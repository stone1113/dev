import json
from collections import defaultdict
from datetime import datetime

# 读取所有对话
with open('D:/dev/agent/extracted_conversations.json', 'r', encoding='utf-8') as f:
    all_conversations = json.load(f)

# 读取当前选中的对话
with open('D:/dev/agent/final_selected.json', 'r', encoding='utf-8') as f:
    selected = json.load(f)

# 找到场景9（5edcbb52f6dfdb96）并替换
bad_conv_key = '5edcbb52f6dfdb96'

# 找一个真正的产品质量咨询对话
replacement = None
for conv in all_conversations:
    if '产品质量' in conv['scenes'] and 10 <= conv['message_count'] <= 20:
        full_text = ' '.join((msg['content'] or '') for msg in conv['messages'])
        # 排除推销对话，找真正的质量咨询
        if '我妈妈' not in full_text and '纯手工' not in full_text:
            if any(kw in full_text for kw in ['质量怎么样', '会褪色', '能戴多久', '正品', '卓越品质']):
                replacement = conv
                break

# 替换
new_selected = []
for conv in selected:
    if conv['conversation_key'] == bad_conv_key and replacement:
        new_selected.append(replacement)
        print(f"已替换场景9: {bad_conv_key} -> {replacement['conversation_key']}")
    else:
        new_selected.append(conv)

# 去重
unique = {}
for conv in new_selected:
    key = conv['conversation_key']
    if key not in unique:
        unique[key] = conv

final_selected = list(unique.values())

# 保存
with open('D:/dev/agent/final_selected.json', 'w', encoding='utf-8') as f:
    json.dump(final_selected, f, ensure_ascii=False, indent=2)

print(f"最终选择 {len(final_selected)} 个对话")
