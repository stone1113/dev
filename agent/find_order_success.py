import json

# 读取所有对话
with open('D:/dev/agent/extracted_conversations.json', 'r', encoding='utf-8') as f:
    all_conversations = json.load(f)

# 筛选包含完整下单流程的对话
order_success = []
for conv in all_conversations:
    if 10 <= conv['message_count'] <= 30:
        full_text = ' '.join((msg['content'] or '') for msg in conv['messages'])

        # 必须包含咨询和下单成功的关键词
        has_inquiry = any(kw in full_text for kw in ['多少钱', '价格', '什么材质', '有吗', '能寄到'])
        has_order = any(kw in full_text for kw in ['订单号', '已下单', '下单成功', '付款成功', '已付款', 'CA', 'CJ', 'RA', 'LC'])

        if has_inquiry and has_order:
            order_success.append(conv)

print(f"找到 {len(order_success)} 个咨询到下单成功的对话\n")

# 显示前5个
for i, conv in enumerate(order_success[:5], 1):
    print(f"{i}. {conv['conversation_key'][:16]}... ({conv['message_count']}条)")
    print(f"   场景: {', '.join(conv['scenes'])}")
    print(f"   客户: {conv['customer']}")
    print()
