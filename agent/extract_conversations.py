import csv
import json
from collections import defaultdict
from datetime import datetime

# 读取所有CSV文件
csv_files = [
    'D:/dev/docs/语料_part1_zh.csv',
    'D:/dev/docs/语料_part2_zh.csv',
    'D:/dev/docs/语料_part3_zh.csv',
    'D:/dev/docs/语料_part4_zh.csv',
    'D:/dev/docs/语料_part5_zh.csv'
]

conversations = defaultdict(list)

# 读取所有对话
for csv_file in csv_files:
    try:
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                conversations[row['conversation_key']].append({
                    'sender': row['sender'],
                    'time': row['send_time'],
                    'content': row['content'],
                    'chat_with': row['chat_with']
                })
    except Exception as e:
        print(f"Error reading {csv_file}: {e}")

# 关键词匹配场景
keywords = {
    '优惠券': ['优惠券', '折扣', 'coupon', '优惠码', '优惠', '打折'],
    '讨价还价': ['便宜', '最低价', '能不能', '再便宜', '批发价', '多少钱'],
    '产品质量': ['质量', '褪色', '会不会', '能戴多久', '正品', '卓越品质'],
    '高仿咨询': ['1:1', '复刻', '相似度', '99%', '95%', '高仿', '和正品'],
    '下单流程': ['下单', '订购', '怎么买', '支付链接', '付款'],
    '支付失败': ['支付失败', '未支付', '付款没有成功', 'PayPal'],
    '弃单挽回': ['放弃', '未付款', '没有成功'],
    '尺寸咨询': ['尺寸', '多大', '16cm', '17cm', '18cm', '定制'],
    '材质咨询': ['材质', '14K', '18K', '镀金', '什么材料'],
    '物流咨询': ['物流', '多久', '发货', '几天', '快递', '送达']
}

# 分析对话
results = []
for conv_key, messages in conversations.items():
    if len(messages) < 6:  # 至少6条消息才算多轮
        continue

    # 检查是否包含客服和客户
    senders = set(msg['sender'] for msg in messages)
    if len(senders) < 2:
        continue

    # 合并内容用于关键词匹配
    full_text = ' '.join(msg['content'] or '' for msg in messages)

    # 匹配场景
    matched_scenes = []
    for scene, kws in keywords.items():
        if any(kw in full_text for kw in kws):
            matched_scenes.append(scene)

    if matched_scenes:
        results.append({
            'conversation_key': conv_key,
            'message_count': len(messages),
            'scenes': matched_scenes,
            'customer': messages[0]['chat_with'],
            'time_span': f"{messages[0]['time']} 至 {messages[-1]['time']}",
            'messages': messages
        })

# 按场景分组
print(f"找到 {len(results)} 个有价值的对话\n")

# 输出每个场景的对话数量
scene_counts = defaultdict(int)
for r in results:
    for scene in r['scenes']:
        scene_counts[scene] += 1

print("场景分布：")
for scene, count in sorted(scene_counts.items(), key=lambda x: -x[1]):
    print(f"  {scene}: {count}个对话")

# 保存结果
with open('D:/dev/agent/extracted_conversations.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\n结果已保存到 extracted_conversations.json")
