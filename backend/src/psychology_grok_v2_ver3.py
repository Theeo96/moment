import xai_sdk
from xai_sdk.chat import user, system
import os
import json


# ============= 성격 5요인 모델 매핑 =============
PERSONALITY_TYPES = {
    "개방성": {"icon": "🎨", "key": "Openness"},
    "성실성": {"icon": "⚙️", "key": "Conscientiousness"},
    "외향성": {"icon": "⭐", "key": "Extraversion"},
    "친화성": {"icon": "🤝", "key": "Agreeableness"},
    "신경성": {"icon": "💭", "key": "Neuroticism"}
}

ADVICE_ICONS = {
    "개방성": "🎯",
    "성실성": "📋",
    "외향성": "🚀",
    "친화성": "💚",
    "신경성": "🌙"
}


# ============= 시스템 프롬프트 (수정됨) =============
SYSTEM_PROMPT = """
당신은 텍스트 기반 성격 심리검사 결과를 분석하고 해석하는 전문 컨설턴트입니다.

## 🔑 핵심 전달 원칙:

1. **톤**: 사용자가 절대 상처받지 않도록 공감하며 긍정적인 방향으로 문장을 구성합니다.
    - 신경성이 포함된 경우: 매우 상냥하지만 정중하고 다소 우려스러운 톤으로 전환합니다.

2. **분석**:
    - 제공된 텍스트를 분석하여 다음 5가지 중 하나로 명확히 분류합니다:
      * 개방성 (Openness)
      * 성실성 (Conscientiousness)
      * 외향성 (Extraversion)
      * 친화성 (Agreeableness)
      * 신경성 (Neuroticism)
    - 입력 데이터가 짧더라도 할루시네이션 없이 깊이 있게 분석하고 잠재력에 대한 긍정적인 해석을 덧붙입니다.

3. **출력 형식**:
    - **반드시** 다음 키(key)를 가진 JSON 형식으로만 응답해야 합니다.
    - `classification`: 분석 결과 분류된 5가지 유형 중 하나의 한글 이름 (예: "개방성")
    - `summary`: 첫 줄 요약 (2줄)
    - `analysis`: 상세 해석 (7줄)
    - `advice`: 사용자 조언 (정확히 3개의 문자열을 가진 리스트)
"""


# ============= txt 파일 읽기 함수 =============
def read_input_text(file_path):
    """txt 파일에서 텍스트를 읽어 반환합니다."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read().strip()
    except FileNotFoundError:
        raise FileNotFoundError(f"파일을 찾을 수 없습니다: {file_path}")
    except Exception as e:
        raise Exception(f"파일 읽기 중 오류: {e}")


# ============= 신경성 감지 함수 (온도 조절용으로만 사용) =============
def detect_neuroticism(text):
    """텍스트에서 신경성 키워드 감지 (온도 조절용)"""
    neuroticism_keywords = ["신경성", "불안", "걱정", "스트레스", "우울", "강박"]
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in neuroticism_keywords)

# ============= 성격 유형 파싱 함수 =============
def extract_personality_info(text, types=PERSONALITY_TYPES):
    for t in types:
        if t["name"] in text or t["key"] in text:
            return t
    return None

# ============= 클라이언트 초기화 =============
try:
    client = xai_sdk.Client(api_key=os.getenv("XAI_API_KEY"))
except Exception as e:
    print(f"오류: API 클라이언트 초기화 실패. XAI_API_KEY를 확인하세요. ({e})")
    exit(1)


# ============= 메인 함수 (수정됨) =============
def analyze_personality(input_text):
    """텍스트를 분석하여 성격 심리검사 결과 (JSON 문자열)를 생성합니다."""

    # 키워드 기반으로 온도만 설정
    is_neuroticism_heuristic = detect_neuroticism(input_text)
    temperature = 0.5 if is_neuroticism_heuristic else 0.7

    # 채팅 세션 생성
    chat_session = client.chat.create(model='grok-4', temperature=temperature)
    chat_session.append(system(SYSTEM_PROMPT))

    # 사용자 메시지 구성 (JSON 출력 요청으로 수정)
    user_message = f"""
다음은 개인의 성격 특성을 나타내는 텍스트입니다:

{input_text}

위 텍스트를 분석하여, 시스템 프롬프트에 정의된 다음 JSON 형식으로 결과를 생성해주세요.
(다른 설명이나 텍스트 없이, 순수한 JSON 객체만 응답해야 함)

{{
  "classification": "분류된 성격 유형 (예: 개방성)",
  "summary": "첫 줄 요약 (2줄)",
  "analysis": "상세 해석 (7줄)",
  "advice": [
    "조언 항목 1",
    "조언 항목 2",
    "조언 항목 3"
  ]
}}
"""
    chat_session.append(user(user_message))

    try:
        response = chat_session.sample()
        result_text = response.content
        personality_info = extract_personality_info(result_text)
        # 결과문 텍스트 파싱(예시, 프롬프트대로라면 순서대로 분리 가능)
        lines = [l for l in result_text.strip().split('\n') if l]
        summary = "\n".join(lines[:2])
        details = "\n".join(lines[2:9])
        advices = [l for l in lines[9:12]]
        warning = ""
        for l in lines:
            if '전문 상담사' in l:
                warning = l
        # JSON 결과 구조화
        return {
            "type": personality_info if personality_info else {},
            "summary": summary,
            "details": details,
            "advices": advices,
            "warning": warning
        }
    except Exception as e:
        raise Exception(f"AI 호출 오류: {e}")

# ============= 실행 부분(main) =============
if __name__ == "__main__":
    input_file = "input.txt"
    try:
        input_text = read_input_text(input_file)
        result = analyze_personality(input_text)
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except FileNotFoundError as e:
        print(f"오류: {e}")
    except Exception as e:
        print(f"오류: {e}")
