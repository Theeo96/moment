# 분석 결과에서 성격 유형만 추출하는 함수
def extract_personality_type(text):
    for type_name in PERSONALITY_TYPES:
        if type_name in text:
            return type_name
    return None