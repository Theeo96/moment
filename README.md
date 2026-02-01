# Moment - 모두를 위한 멘탈 트리트먼트

HTP(House-Tree-Person) 그림 검사를 통한 심리 분석 서비스

참고문헌 : https://daegu.dcollection.net/public_resource/pdf/000002419228_20260202004021.pdf

(모바일 기반 HTP그림검사 앱 개발을 위한 표준화 연구 - 손성희)

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [시스템 요구사항](#시스템-요구사항)
- [설치 및 환경 설정](#설치-및-환경-설정)
  - [Frontend 설정](#frontend-설정)
  - [Backend 설정](#backend-설정)
- [실행 방법](#실행-방법)
- [API 문서](#api-문서)
- [프로젝트 구조](#프로젝트-구조)
- [문제 해결](#문제-해결)

## 프로젝트 개요

이 프로젝트는 HTP(House-Tree-Person) 심리 검사를 위한 웹 애플리케이션입니다. 사용자가 그린 집, 나무, 사람 그림을 YOLO 모델로 분석하여 심리 상태를 파악하고 결과를 제공합니다.

## 기술 스택

### Frontend

- **Framework**: Next.js 16.0.0
- **UI Library**: React 18.3.1
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI, Shadcn UI
- **Build Tool**: Next.js (Static Export)

### Backend

- **Framework**: FastAPI
- **Language**: Python 3.10.19
- **AI/ML**: PyTorch 2.7.1, Ultralytics YOLO 8.3.228
- **Image Processing**: OpenCV, Pillow
- **Environment**: Conda

## 시스템 요구사항

### Frontend

- Node.js 18 이상
- npm 또는 pnpm

### Backend

- Python 3.10
- Anaconda 또는 Miniconda
- CUDA 11.8 (GPU 사용 시)
- 최소 8GB RAM 권장

## 설치 및 환경 설정

### Frontend 설정

#### 1. 프로젝트 클론

```bash
git clone https://github.com/Theeo96/moment.git
cd moment
```

#### 2. Frontend 디렉토리로 이동

```bash
cd frontend
```

#### 3. 의존성 설치

npm 사용:

```bash
npm install
```

또는 pnpm 사용:

```bash
pnpm install
```

#### 4. 개발 서버 실행

```bash
npm run dev
# 또는
pnpm dev
```

#### 5. 브라우저에서 확인

```
http://localhost:3000
```

#### 6. 프로덕션 빌드 (선택사항)

```bash
npm run build
# 빌드된 정적 파일은 out/ 디렉토리에 생성됩니다
```

### Backend 설정

#### 1. Conda 환경 생성

프로젝트 루트 디렉토리에서 제공된 environment 파일을 사용하여 Conda 환경을 생성합니다:

```bash
cd moment
conda env create -f htp_backend_environment.yml
```

**참고**: `htp_backend_environment_fixed.yml` 파일도 있습니다. 만약 위 명령이 실패하면 이 파일을 사용해보세요.

#### 2. Conda 환경 활성화

```bash
conda activate htp-backend
```

#### 3. 환경 변수 설정

`backend/src` 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```bash
cd backend/src
cat > .env << EOF
# YOLO 모델 설정
YOLO_CONF=0.70
YOLO_IMGSZ=640
YOLO_DEVICE=0
YOLO_BIN=yolo
EOF
```

**환경 변수 설명:**

- `YOLO_CONF`: YOLO 모델의 confidence threshold (기본값: 0.70)
- `YOLO_IMGSZ`: 입력 이미지 크기 (기본값: 640)
- `YOLO_DEVICE`: 사용할 디바이스 (0=첫 번째 GPU, cpu=CPU 사용)
- `YOLO_BIN`: YOLO 실행 바이너리 경로 (기본값: yolo)

#### 4. YOLO 모델 가중치 파일 준비

HTP 분석을 위한 YOLO 모델 가중치 파일이 필요합니다:

```bash
mkdir -p ~/htp/weights
```

다음 세 가지 모델 파일을 `~/htp/weights/` 디렉토리에 배치해야 합니다:

- `house_best.pt` - 집 분석 모델
- `tree_best.pt` - 나무 분석 모델
- `person_best.pt` - 사람 분석 모델

**참고**: 모델 파일은 별도로 제공되거나 학습이 필요합니다.

#### 5. Backend 서버 실행

```bash
cd backend/src
python main.py
```

또는 uvicorn을 직접 사용:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

서버가 정상적으로 시작되면 다음 주소에서 API에 접근할 수 있습니다:

- **API**: http://localhost:8000
- **API 문서 (Swagger)**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 실행 방법

### 전체 시스템 실행

#### 터미널 1 - Backend 서버 실행

```bash
cd backend/src
conda activate htp-backend
python main.py
```

#### 터미널 2 - Frontend 개발 서버 실행

```bash
cd frontend
npm run dev
```

#### 브라우저에서 애플리케이션 확인

```
http://localhost:3000
```

## API 문서

### POST /

HTP 이미지 분석 엔드포인트

**요청:**

- `image` (file): 분석할 이미지 파일 (multipart/form-data)
- `category` (string): 이미지 카테고리
  - `0`: 집 (House)
  - `1`: 나무 (Tree)
  - `2`: 사람 (Person)

**응답:**

```json
{
  "category": 0,
  "analysis_text": "분석 결과 텍스트...",
  "personality": {
    "type": "성격 유형",
    "description": "성격 설명..."
  }
}
```

### GET /health

서버 상태 확인

**응답:**

```json
{
  "status": "ok"
}
```

## 프로젝트 구조

```
moment/
├── frontend/                 # Next.js Frontend 애플리케이션
│   ├── app/                 # Next.js 13+ App Router
│   ├── components/          # React 컴포넌트
│   ├── hooks/               # Custom React Hooks
│   ├── lib/                 # 유틸리티 함수
│   ├── public/              # 정적 파일
│   ├── styles/              # CSS 스타일
│   ├── package.json         # Frontend 의존성
│   └── next.config.js       # Next.js 설정
│
├── backend/                 # FastAPI Backend 애플리케이션
│   ├── src/                 # 소스 코드
│   │   ├── main.py         # FastAPI 애플리케이션 진입점
│   │   ├── analysis_module.py  # HTP 분석 모듈
│   │   ├── psychology_grok_v2_ver3.py  # 성격 분석 모듈
│   │   └── personality_types.json      # 성격 유형 데이터
│   └── etc/                 # 추가 스크립트 및 테스트
│
├── htp_backend_environment.yml  # Conda 환경 설정 파일
├── package.json             # 루트 프로젝트 메타데이터
└── README.md               # 이 문서
```

## 문제 해결

### Frontend 관련

**문제: npm install 중 에러 발생**

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

**문제: TypeScript 빌드 에러**

`next.config.js`에 `typescript.ignoreBuildErrors: true` 설정이 있어 빌드 시 TypeScript 에러는 무시됩니다.

### Backend 관련

**문제: Conda 환경 생성 실패**

```bash
# 대안 환경 파일 사용
conda env create -f htp_backend_environment_fixed.yml
```

**문제: YOLO 모델 파일을 찾을 수 없음**

- `~/htp/weights/` 디렉토리에 모델 파일이 있는지 확인
- 파일 권한 확인: `chmod 644 ~/htp/weights/*.pt`

**문제: GPU 메모리 부족**

`.env` 파일에서 `YOLO_DEVICE=cpu`로 변경하여 CPU 모드로 실행

**문제: Port 8000이 이미 사용 중**

```bash
# 다른 포트 사용
uvicorn main:app --host 0.0.0.0 --port 8001
```
