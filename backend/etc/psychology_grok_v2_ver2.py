from xai_sdk import Client
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


# ============= 시스템 프롬프트 (강조 표시 제거) =============
SYSTEM_PROMPT = """
당신은 텍스트 기반 성격 심리검사 결과를 분석하고 해석하는 전문 컨설턴트입니다.

## 🔑 핵심 전달 원칙 및 형식:

1. **톤**: 사용자가 절대 상처받지 않도록 공감하며 긍정적인 방향으로 문장을 구성합니다.
    - 신경성이 포함된 경우: 매우 상냥하지만 정중하고 다소 우려스러운 톤으로 전환합니다.

2. **출력 형식**:
    - **첫 줄 요약**: 제공된 결과값 중 가장 중요하고 핵심적인 요소에 한정하여 두 줄로 작성합니다. (사용자에게 직접 이야기하듯 부드럽게 시작)
    - **상세 해석**: 첫 줄 요약 후 공백을 두고, 상세 해석 내용을 7줄로 풀어서 정리합니다. (깊이 있고 구체적으로)
    - **사용자 조언**: 성격 5요인 유형에 맞는 키워드별 조언을 3개 항목으로 제시합니다. (각 조언은 명확하고 실행 가능한 내용)

3. **길이 및 품질**:
    - 입력 데이터가 짧더라도 할루시네이션(새로운 사실 생성) 없이 기존 데이터를 깊이 있게 분석합니다.
    - 잠재력에 대한 긍정적인 해석을 덧붙여 의미를 확장합니다.
    - 문장의 일관성과 타당성을 유지합니다.

4. **성격 5요인 분류**:
    - 제공된 텍스트를 분석하여 다음 5가지 중 하나를 선택합니다:
      * 개방성 (Openness): 도전과 아이디어를 추구하는
      * 성실성 (Conscientiousness): 목표 앞에서는 집중하지만, 때로는 자유로운
      * 외향성 (Extraversion): 사람들과 어울리는 에너지가 넘치는
      * 친화성 (Agreeableness): 배려와 신뢰로 관계를 만드는
      * 신경성 (Neuroticism): 가끔 신중해지는 섬세한
    
    - 선택한 유형을 결과에 명시합니다.

5. **신경성 특별 처리**:
    - 신경성이 분류된 경우, 최종 조언 3개 항목 이후에 "\n⚠️  현재 결과에 따라 전문 상담사 또는 병원 방문을 고려해 보시길 권고 드립니다." 문구를 추가합니다.
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


# ============= 신경성 감지 함수 =============
def detect_neuroticism(text):
    """텍스트에서 신경성 키워드 감지"""
    neuroticism_keywords = ["신경성", "불안", "걱정", "스트레스", "우울", "강박"]
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in neuroticism_keywords)


# ============= 클라이언트 초기화 =============
# 환경 변수 XAI_API_KEY가 설정되어 있어야 합니다.
try:
    client = Client(api_key=os.getenv("XAI_API_KEY"))
except Exception as e:
    print(f"오류: API 클라이언트 초기화 실패. XAI_API_KEY를 확인하세요. ({e})")
    exit(1)


# ============= 메인 함수 =============
def analyze_personality(input_text):
    """텍스트를 분석하여 성격 심리검사 결과를 생성합니다."""
    
    # 신경성 감지
    is_neuroticism = detect_neuroticism(input_text)
    
    # 온도 설정 (신경성: 0.5 - 신중함, 일반: 0.7 - 약간의 창의성 허용)
    temperature = 0.5 if is_neuroticism else 0.7
    
    # 채팅 세션 생성
    chat_session = client.chat.create(model='grok-4', temperature=temperature)
    chat_session.append(system(SYSTEM_PROMPT))
    
    # 사용자 메시지 구성
    user_message = f"""
다음은 개인의 성격 특성을 나타내는 텍스트입니다:

{input_text}

위 텍스트를 분석하여:
1. 성격 5요인 중 하나로 분류합니다.
2. 다음 형식으로 결과를 생성합니다:
    - 첫 줄 요약 (2줄)
    - 상세 해석 (7줄)
    - 사용자 조언 (3개 항목, 각 항목 앞에 🎯/📋/🚀/💚/🌙 중 적절한 아이콘 붙임)
    - 신경성이 감지된 경우만 경고 메시지 추가

**중요**: 마침표나 엔터 규칙 없이, 순수 텍스트로만 생성해주세요.
"""
    chat_session.append(user(user_message))
    
    # API 호출
    try:
        response = chat_session.sample()
        result = response.content
        
        # 성격 유형 자동 분류 및 아이콘 추가 (프롬프트에서 분류된 유형을 기반으로)
        final_result = result
        for type_name, info in PERSONALITY_TYPES.items():
            # Grok AI 응답에 한글 유형 이름 또는 영어 키가 포함되어 있는지 확인
            if type_name in result or info["key"] in result:
                # 아이콘을 맨 앞에 추가
                final_result = f"{info['icon']} {result}"
                break
        
        return final_result
    
    except Exception as e:
        raise Exception(f"AI 호출 중 오류: {e}")


# ============= 실행 =============
if __name__ == "__main__":
    # 📌 입력 파일 경로 설정 (이 부분을 실제 환경에 맞게 수정해야 합니다)
    input_file = "input.txt"
    
    try:
        # txt 파일 읽기
        input_text = read_input_text(input_file)
        
        # 분석 실행
        result = analyze_personality(input_text)
        
        # 결과 출력 (백엔드용 - 순수 텍스트만)
        print(result)
    
    except FileNotFoundError as e:
        print(f"오류: {e}")
    except Exception as e:
        print(f"오류: {e}")