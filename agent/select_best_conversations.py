import json

# 读取提取的对话
with open('D:/dev/agent/extracted_conversations.json', 'r', encoding='utf-8') as f:
    conversations = json.load(f)

# 场景优先级和数量分配
scene_targets = {
    '优惠券': 3,
    '讨价还价': 3,
    '产品质量': 2,
    '高仿咨询': 2,
    '下单流程': 2,
    '支付失败': 2,
    '弃单挽回': 2,
    '尺寸咨询': 2,
    '材质咨询': 2,
    '物流咨询': 2
}

selected = {}

# 为每个场景选择最佳对话
for scene, target_count in scene_targets.items():
    # 筛选包含该场景的对话
    candidates = [c for c in conversations if scene in c['scenes']]

    # 按消息数量排序（更多轮次更好）
    candidates.sort(key=lambda x: x['message_count'], reverse=True)

    # 选择前N个
    for conv in candidates[:target_count]:
        if conv['conversation_key'] not in selected:
            selected[conv['conversation_key']] = conv

print(f"选择了 {len(selected)} 个对话")

# 保存选中的对话
with open('D:/dev/agent/selected_conversations.json', 'w', encoding='utf-8') as f:
    json.dump(list(selected.values()), f, ensure_ascii=False, indent=2)

# 输出每个对话的基本信息
for i, conv in enumerate(selected.values(), 1):
    print(f"\n{i}. {conv['conversation_key'][:16]}... ({conv['message_count']}条消息)")
    print(f"   场景: {', '.join(conv['scenes'])}")
    print(f"   客户: {conv['customer']}")
