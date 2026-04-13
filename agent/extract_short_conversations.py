import json

# 读取提取的对话
with open('D:/dev/agent/extracted_conversations.json', 'r', encoding='utf-8') as f:
    conversations = json.load(f)

# 筛选10-30条消息的对话（适合多轮对话展示）
suitable = [c for c in conversations if 10 <= c['message_count'] <= 30]

print(f"找到 {len(suitable)} 个适合长度的对话（10-30条消息）\n")

# 场景优先级
scene_priority = ['高仿咨询', '讨价还价', '优惠券', '弃单挽回', '支付失败', '产品质量', '下单流程', '尺寸咨询', '材质咨询', '物流咨询']

selected = []
used_scenes = set()

# 为每个场景选择1-2个对话
for scene in scene_priority:
    candidates = [c for c in suitable if scene in c['scenes'] and scene not in used_scenes]

    if candidates:
        # 按消息数量排序，选择适中的
        candidates.sort(key=lambda x: x['message_count'])

        # 选择1-2个
        for conv in candidates[:2]:
            selected.append(conv)
            used_scenes.add(scene)
            print(f"[OK] {scene}: {conv['conversation_key'][:16]}... ({conv['message_count']}条)")

            if len(selected) >= 15:
                break

    if len(selected) >= 15:
        break

# 保存
with open('D:/dev/agent/final_selected.json', 'w', encoding='utf-8') as f:
    json.dump(selected, f, ensure_ascii=False, indent=2)

print(f"\n共选择 {len(selected)} 个对话")
