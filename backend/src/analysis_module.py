import json
import os
from PIL import Image
from rules import House_rules, Tree_rules, Person_rules

HOUSE_CLASS_NAMES = ["집전체", "지붕", "집벽", "문", "창문", "굴뚝", "연기", "울타리", "길", "연못", "산", "나무", "꽃", "잔디", "태양"]
TREE_CLASS_NAMES = ["나무전체", "기둥", "수관", "가지", "뿌리", "나뭇잎", "꽃", "열매", "그네", "새", "다람쥐", "구름", "달", "별"]
PERSON_CLASS_NAMES = ["사람전체", "머리", "얼굴", "눈", "코", "입", "귀", "머리카락", "목", "상체", "팔", "손", "다리", "발", "단추", "주머니", "운동화", "여자구두"]

def get_analysis_result(user_choice, txt_file_path, image_path):
    """
    사용자 선택, TXT 파일, 이미지 경로를 받아 분석 문장을 반환하는 함수
    """
    
    analysis_results = {
        "house": {"size": None, "location": None, "box_area": 0},
        "windows": [], "trees": [], "persons": [] 
    }
    
    house_counts = {k: 0 for k in HOUSE_CLASS_NAMES}
    tree_counts = {k: 0 for k in TREE_CLASS_NAMES} 
    person_counts = {k: 0 for k in PERSON_CLASS_NAMES}
    
    all_model_results = {} 

    try:
        if os.path.exists(image_path):
            original_pil_image = Image.open(image_path)
            img_width, img_height = original_pil_image.size
            img_area = img_width * img_height
        else:
            img_width, img_height = 1000, 1000
            img_area = 1000000

        raw_data = []
        if not os.path.exists(txt_file_path):
            return "오류: 분석 결과 파일(test_analysis.txt)을 찾을 수 없습니다."

        with open(txt_file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        if user_choice == 0: current_class_names = HOUSE_CLASS_NAMES
        elif user_choice == 1: current_class_names = TREE_CLASS_NAMES
        else: current_class_names = PERSON_CLASS_NAMES

        for line in lines:
            parts = line.strip().split()
            if len(parts) >= 6:
                cls_id = int(parts[0])
                cx, cy, w, h = map(float, parts[1:5]) 
                conf = float(parts[5])
                
                if conf >= 0.8:
                    if 0 <= cls_id < len(current_class_names):
                        name = current_class_names[cls_id]
                    else:
                        name = f"Unknown_{cls_id}"
                    
                    obj = {
                        "name": name,
                        "confidence": conf,
                        "xmin": cx - (w/2), "ymin": cy - (h/2), 
                        "xmax": cx + (w/2), "ymax": cy + (h/2),
                        "w": w, "h": h
                    }
                    raw_data.append(obj)

        target_key = ['house', 'tree', 'person'][user_choice]
        all_model_results[target_key] = raw_data

        if user_choice == 0 and 'house' in all_model_results:
            for det in all_model_results['house']:
                if det['name'] == '집전체':
                    ratio = det['w'] * det['h']
                    analysis_results['house']['box_area'] = ratio
                    if ratio >= (2/3): analysis_results['house']['size'] = '크다'
                    elif ratio <= (1/3): analysis_results['house']['size'] = '작다'
                    else: analysis_results['house']['size'] = '보통'
                    
                    if (det['xmin'] >= 0.25 and det['xmax'] <= 0.75 and
                        det['ymin'] >= 0.25 and det['ymax'] <= 0.75):
                        analysis_results['house']['location'] = '중앙'
                    else:
                        analysis_results['house']['location'] = '비중앙'
                    break
            
            house_area_ratio = analysis_results['house']['box_area']
            if house_area_ratio > 0:
                for det in all_model_results['house']:
                    if det['name'] == '창문':
                        win_area = det['w'] * det['h']
                        rel_ratio = win_area / house_area_ratio
                        if rel_ratio >= (2/3): size = '크다'
                        elif rel_ratio <= (1/3): size = '작다'
                        else: size = '보통'
                        analysis_results['windows'].append({"size": size})

            for det in all_model_results['house']:
                if det['name'] in house_counts: house_counts[det['name']] += 1

        if user_choice == 1 and 'tree' in all_model_results:
            for det in all_model_results['tree']:
                if det['name'] == '나무전체':
                    ratio = det['w'] * det['h']
                    if ratio > 0.5: size = '보통'
                    else: size = '작다'
                    analysis_results['trees'].append({"size": size})

            for det in all_model_results['tree']:
                if det['name'] in tree_counts: tree_counts[det['name']] += 1

        if user_choice == 2 and 'person' in all_model_results:
            for det in all_model_results['person']:
                if det['name'] == '사람전체':
                    h_ratio = det['h']
                    if h_ratio >= (2/3): size = '크다'
                    elif h_ratio <= (1/3): size = '작다'
                    else: size = '보통'
                    analysis_results['persons'].append({"size": size})

            for det in all_model_results['person']:
                if det['name'] in person_counts: person_counts[det['name']] += 1

        final_sentence_string = ""
        
        if user_choice == 0:
            if analysis_results["house"]["size"]:
                key = "크다" if analysis_results["house"]["size"] == "크다" else "크지 않다"
                sentence = House_rules["집전체"]["크기"].get(key)
                if sentence: final_sentence_string += sentence + " "
            if analysis_results["house"]["location"]:
                key = analysis_results["house"]["location"]
                sentence = House_rules["집전체"]["위치"].get(key)
                if sentence: final_sentence_string += sentence + " "
            for window in analysis_results["windows"]:
                key = window["size"]
                sentence = House_rules["창문"]["크기"].get(key)
                if sentence: final_sentence_string += sentence + " "
            for item, count in house_counts.items():
                if item == "창문":
                    if count == 0: key = "생략"
                    elif count >= 3: key = "3개 이상"
                    else: key = None
                    sentence = House_rules["창문"]["개수"].get(key)
                elif item == "집전체": continue
                else:
                    key = "있다" if count > 0 else "없다"
                    if item in House_rules and "유무" in House_rules[item]:
                        sentence = House_rules[item]["유무"].get(key)
                    else: sentence = None
                if sentence: final_sentence_string += sentence + " "

        elif user_choice == 1:
            for tree in analysis_results["trees"]:
                key = tree["size"]
                sentence = Tree_rules["나무전체"]["크기"].get(key)
                if sentence: final_sentence_string += sentence + " "
            
            for item, count in tree_counts.items():
                if item == "나무전체": continue
                
                if item == "다람쥐" and tree_counts.get("새", 0) > 0: continue
                
                if item in ["새", "다람쥐"]: rule_key = "동물"
                else: rule_key = item
                
                key = "있다" if count > 0 else "없다"
                if rule_key in Tree_rules and "유무" in Tree_rules[rule_key]:
                    sentence = Tree_rules[rule_key]["유무"].get(key)
                    if sentence: final_sentence_string += sentence + " "

        elif user_choice == 2:
            for person in analysis_results["persons"]:
                key = person["size"]
                sentence = Person_rules["사람전체"]["크기"].get(key)
                if sentence: final_sentence_string += sentence + " "
            
            for item, count in person_counts.items():
                if item == "사람전체": continue
                
                if item == "여자구두" and person_counts.get("운동화", 0) > 0: continue
                
                if item in ["운동화", "여자구두"]: rule_key = "신발"
                else: rule_key = item

                if rule_key == "눈":
                    if count == 0: key = "없다"
                    elif count % 2 == 1: key = "한쪽 눈"
                    else: key = "양쪽 눈"
                    sentence = Person_rules["눈"]["종류"].get(key)
                elif rule_key == "얼굴":
                    if (person_counts.get("눈", 0) > 0 and person_counts.get("코", 0) > 0 and person_counts.get("입", 0) > 0):
                        key = "완전"
                    else: key = "불완전"
                    sentence = Person_rules["얼굴"]["종류"].get(key)
                else:
                    key = "있다" if count > 0 else "없다"
                    if rule_key in Person_rules and "유무" in Person_rules[rule_key]:
                        sentence = Person_rules[rule_key]["유무"].get(key)
                    else: sentence = None
                
                if sentence: final_sentence_string += sentence + " "

        return final_sentence_string.strip()

    except Exception as e:
        return f"오류 발생: {str(e)}"