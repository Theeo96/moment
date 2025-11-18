import os
import json
from xai_sdk import Client
from xai_sdk.chat import user, system

# ============= 성격 5요인 정보 JSON 로딩 =============
def load_personality_types(json_path='personality_types.json'):
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)

PERSONALITY_TYPES = load_personality_types()

# ============= 시스템 프롬프트(v2) =============
SYSTEM_PROMPT = """
당신은 텍스트 기반 성격 심리검사 결과를 분석하고 해석하는 전문 컨설턴트입니다.

## 핵심 전달 원칙 및 형식:
1. 톤: 사용자에게 공감하며 긍정적으로. 신경성 포함 시 매우 상냥하지만 정중하고 다소 우려스러운 톤.
2. 출력 형식:
    - 첫 줄 요약(2줄)
    - 상세 해석(7줄)
    - 유형별 조언 3개(아이콘 포함)
    - 신경성 경고(필요 시)
3. 길이 및 품질: 짧은 데이터라도 할루시네이션 없이 의미 확장.
4. 결과에 선택된 성격 5요인(아이콘, 설명)을 표시하세요.
"""

# ============= txt 파일 읽기 함수 =============
def read_input_text(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read().strip()

# ============= 신경성 감지 함수 =============
def detect_neuroticism(text):
    neuroticism_keywords = ["신경성", "불안", "걱정", "스트레스", "우울", "강박"]
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in neuroticism_keywords)

# ============= 성격 유형 파싱 함수 =============
def extract_personality_info(text, types=PERSONALITY_TYPES):
    for t in types:
        if t["name"] in text or t["key"] in text:
            return t
    return None

# ============= 메인 분석 함수(JSON 결과) =============
def analyze_personality(input_text):
    is_neuroticism = detect_neuroticism(input_text)
    temperature = 0.5 if is_neuroticism else 0.7

    # AI 세션
    client = Client(api_key=os.getenv("XAI_API_KEY"))
    chat_session = client.chat.create(model='grok-4', temperature=temperature)
    chat_session.append(system(SYSTEM_PROMPT))

    # 사용자 메시지 구성
    user_message = f"""
다음은 개인의 성격 특성을 나타내는 텍스트입니다:

{input_text}

분석하여 성격 5요인 중 하나로 분류 및 설명, 분류 결과에 대한 일관성을 유지하며 아랫단을 출력함
- 첫줄 요약 2줄
- 상세 해석 7줄
- 유형별 조언 3개(긍정적인 아이콘 포함)
- 신경성 결과면 권고 메시지도 출력
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