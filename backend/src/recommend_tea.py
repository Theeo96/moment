from xai_sdk import Client
from xai_sdk.chat import user, system
import os

# ============= 성격 5요인 모델 매핑 =============
PERSONALITY_TYPES = {
    "개방성": {"icon": "🎨", "key": "Openness"},
    "성실성": {"icon": "⚙️", "key": "Conscientiousness"},
    "외향성": {"icon": "⭐", "key": "Extraversion"},
    "친화성": {"icon": "🤝", "key": "Agreeableness"},
    "신경성": {"icon": "💭", "key": "Neuroticism"}
}

# ============= 시스템 프롬프트 =============
TEA_PROMPT_TEMPLATE = """
당신은 성격 유형에 맞는 차(tea)를 추천하는 전문 티소믈리에입니다.

## 🫖 추천 형식:
- **메인 차**: 성격 유형에 가장 적합한 차 1종
- **서브 차**: 보완적이거나 기분 전환에 좋은 차 1종
- **각 차에 대한 설명**: 이 차가 심신에 어떤 도움을 주는지 간단하고 따뜻한 문장으로 설명

## 💡 추가 조건:
- 매번 다른 차를 추천합니다 (동일한 성격이라도 결과는 다양하게)
- 설명은 감성적이면서도 과학적 효능을 간단히 언급합니다
- 신경성이 포함된 경우, 진정 효과가 있는 차를 우선 추천합니다

## 출력 형식:
- 성격 유형: [아이콘] [한글 유형명] ([영문 키])
- 오늘의 메인 차: [차 이름] - [짧은 설명]
- 오늘의 서브 차: [차 이름] - [짧은 설명]
"""

# ============= 클라이언트 초기화 =============
try:
    client = Client(api_key=os.getenv("XAI_API_KEY"))
except Exception as e:
    print(f"오류: API 클라이언트 초기화 실패. XAI_API_KEY를 확인하세요. ({e})")
    exit(1)

# ============= 차 추천 함수 =============
def recommend_tea(personality_type):
    """성격 유형에 맞는 차를 추천합니다."""
    if personality_type not in PERSONALITY_TYPES:
        raise ValueError(f"알 수 없는 성격 유형: {personality_type}")

    icon = PERSONALITY_TYPES[personality_type]["icon"]
    key = PERSONALITY_TYPES[personality_type]["key"]

    # 프롬프트 구성
    system_prompt = TEA_PROMPT_TEMPLATE
    user_prompt = f"성격 유형은 {icon} {personality_type} ({key})입니다. 이에 맞는 차를 추천해주세요."

    # 채팅 세션 생성
    chat_session = client.chat.create(model='grok-4', temperature=0.9)
    chat_session.append(system(system_prompt))
    chat_session.append(user(user_prompt))

    # API 호출
    try:
        response = chat_session.sample()
        return response.content
    except Exception as e:
        raise Exception(f"차 추천 중 오류: {e}")

# ============= 실행 예시 =============
if __name__ == "__main__":
    # 예시 성격 유형 (실제 분석 결과에서 받아올 수 있음)
    personality_type = "신경성"  # 예: "외향성", "개방성" 등

    try:
        tea_result = recommend_tea(personality_type)
        print(tea_result)
    except Exception as e:
        print(f"오류: {e}")