import asyncio
import os
import shutil
import subprocess
import uuid
from pathlib import Path
from typing import Dict

from fastapi import BackgroundTasks, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR

# 분석 모듈 경로 고정
BASE_DIR = Path(__file__).resolve().parent
os.chdir(BASE_DIR)

UPLOAD_DIR = BASE_DIR / "uploads"
YOLO_OUTPUT_DIR = BASE_DIR / "yolo_outputs"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
YOLO_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

YOLO_MODELS: Dict[int, Path] = {
    0: Path.home() / "htp" / "weights" / "house_best.pt",
    1: Path.home() / "htp" / "weights" / "tree_best.pt",
    2: Path.home() / "htp" / "weights" / "person_best.pt",
}

YOLO_CONF = float(os.getenv("YOLO_CONF", "0.70"))
YOLO_IMGSZ = int(os.getenv("YOLO_IMGSZ", "640"))
YOLO_DEVICE = os.getenv("YOLO_DEVICE", "0")
YOLO_BINARY = os.getenv("YOLO_BIN", "yolo")

from analysis_module import get_analysis_result  # noqa: E402
from psychology_grok_v2_ver3 import analyze_personality  # noqa: E402


app = FastAPI(title="HTP 이미지 분석 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _save_upload_file(upload: UploadFile) -> Path:
    file_ext = Path(upload.filename or "").suffix or ".jpg"
    saved_path = UPLOAD_DIR / f"{uuid.uuid4().hex}{file_ext}"
    with saved_path.open("wb") as buffer:
        shutil.copyfileobj(upload.file, buffer)
    return saved_path


def _build_yolo_command(image_path: Path, category: int, run_name: str) -> list[str]:
    model_path = YOLO_MODELS.get(category)
    if not model_path or not model_path.exists():
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"YOLO 가중치 파일을 찾을 수 없습니다: category={category}",
        )

    output_dir = YOLO_OUTPUT_DIR / run_name
    return [
        YOLO_BINARY,
        "predict",
        f"model={model_path}",
        f"source={image_path}",
        f"imgsz={YOLO_IMGSZ}",
        f"conf={YOLO_CONF}",
        f"device={YOLO_DEVICE}",
        "save=True",
        "save_txt=True",
        f"project={YOLO_OUTPUT_DIR}",
        f"name={run_name}",
        "exist_ok=True",
        "half=True",
    ]


def _run_yolo(image_path: Path, category: int) -> Path:
    run_name = f"run_{uuid.uuid4().hex[:8]}"
    command = _build_yolo_command(image_path, category, run_name)

    result = subprocess.run(
        command,
        capture_output=True,
        text=True,
        cwd=BASE_DIR,
        env=os.environ.copy(),
    )

    if result.returncode != 0:
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"YOLO 실행 실패: {result.stderr}",
        )

    labels_dir = YOLO_OUTPUT_DIR / run_name / "labels"
    label_file = labels_dir / f"{image_path.stem}.txt"
    if not label_file.exists():
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail="YOLO labels.txt 를 찾지 못했습니다.",
        )
    return label_file


def _cleanup_paths(paths: list[Path]) -> None:
    for path in paths:
        if not path:
            continue
        try:
            if path.is_dir():
                shutil.rmtree(path, ignore_errors=True)
            elif path.exists():
                path.unlink(missing_ok=True)
        except Exception:
            continue


def _process(image_path: Path, label_path: Path, category: int) -> dict:
    analysis_text = get_analysis_result(
        user_choice=category,
        txt_file_path=str(label_path),
        image_path=str(image_path),
    )

    if not analysis_text or analysis_text.startswith("오류"):
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"분석 모듈 오류: {analysis_text}",
        )

    personality = analyze_personality(analysis_text)
    return {
        "category": category,
        "analysis_text": analysis_text,
        "personality": personality,
    }


@app.post("/")
async def analyze_image(
    background_tasks: BackgroundTasks,
    image: UploadFile = File(...),
    category: int = Form(...),
):
    if category not in (0, 1, 2):
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="category 값은 0(집), 1(나무), 2(사람) 중 하나여야 합니다.",
        )

    saved_image = _save_upload_file(image)

    try:
        label_path = await asyncio.to_thread(_run_yolo, saved_image, category)
        result = await asyncio.to_thread(_process, saved_image, label_path, category)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc
    finally:
        background_tasks.add_task(
            _cleanup_paths, [saved_image, label_path.parent.parent if 'label_path' in locals() else None]
        )

    return JSONResponse(result)


@app.get("/health")
def health_check():
    return {"status": "ok"}

