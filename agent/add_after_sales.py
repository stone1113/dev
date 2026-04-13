import json

# 读取所有对话
with open('D:/dev/agent/extracted_conversations.json', 'r', encoding='utf-8') as f:
    all_conversations = json.load(f)

# 读取当前选中的对话
with open('D:/dev/agent/final_selected.json', 'r', encoding='utf-8') as f:
    selected = json.load(f)

# 选择售后场景对话（每个场景选1个）
target_keys = [
    '3a205294062b1db1',  # 物流催单+退换货
    '1ce05a359e22b6d2',  # 收货确认+好评回访
    '3da4ca7ed418f49f',  # 质量问题
    '0fabfb77609a411a'   # 尺寸不合
]

added = 0
for conv in all_conversations:
    if conv['conversation_key'] in target_keys:
        selected.append(conv)
        added += 1
        print(f"已添加: {conv['conversation_key'][:16]}... ({conv['message_count']}条)")
        print(f"  场景: {', '.join(conv['scenes'])}")

# 保存
with open('D:/dev/agent/final_selected.json', 'w', encoding='utf-8') as f:
    json.dump(selected, f, ensure_ascii=False, indent=2)

print(f"\n共添加 {added} 个售后对话")
print(f"总共 {len(selected)} 个对话")
