import json

# 读取所有对话
with open('D:/dev/agent/extracted_conversations.json', 'r', encoding='utf-8') as f:
    all_conversations = json.load(f)

# 筛选真正的产品质量咨询对话
quality_convs = []
for conv in all_conversations:
    if '产品质量' in conv['scenes'] and 10 <= conv['message_count'] <= 30:
        # 检查内容是否真的是质量咨询
        full_text = ' '.join(msg['content'] or '' for msg in conv['messages'])
        # 排除客户推销的对话
        if '我妈妈' not in full_text and '纯手工缝制' not in full_text:
            # 包含质量相关关键词
            if any(kw in full_text for kw in ['质量', '褪色', '会不会', '能戴多久', '卓越品质', '正品', '保证']):
                quality_convs.append(conv)

print(f"找到 {len(quality_convs)} 个真正的产品质量咨询对话\n")

# 显示前5个
for i, conv in enumerate(quality_convs[:5], 1):
    print(f"{i}. {conv['conversation_key'][:16]}... ({conv['message_count']}条)")
    print(f"   场景: {', '.join(conv['scenes'])}")
    # 显示部分内容
    sample = ' '.join(msg['content'] or '' for msg in conv['messages'][:3])[:150]
    print(f"   内容: {sample}...")
    print()
