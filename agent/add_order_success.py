import json

# 读取所有对话
with open('D:/dev/agent/extracted_conversations.json', 'r', encoding='utf-8') as f:
    all_conversations = json.load(f)

# 读取当前选中的对话
with open('D:/dev/agent/final_selected.json', 'r', encoding='utf-8') as f:
    selected = json.load(f)

# 找到咨询到下单成功的对话
target_key = 'd508d7bc89c33046'
new_conv = None

for conv in all_conversations:
    if conv['conversation_key'] == target_key:
        new_conv = conv
        break

if new_conv:
    selected.append(new_conv)
    print(f"已添加对话: {target_key}")
    print(f"场景: {', '.join(new_conv['scenes'])}")
    print(f"消息数: {new_conv['message_count']}")

# 保存
with open('D:/dev/agent/final_selected.json', 'w', encoding='utf-8') as f:
    json.dump(selected, f, ensure_ascii=False, indent=2)

print(f"\n总共 {len(selected)} 个对话")
