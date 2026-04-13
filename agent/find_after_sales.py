import json

# 读取所有对话
with open('D:/dev/agent/extracted_conversations.json', 'r', encoding='utf-8') as f:
    all_conversations = json.load(f)

# 售后场景关键词
after_sales_keywords = {
    '物流催单': ['物流', '还没到', '什么时候到', '追踪', '快递', '派送', '清关'],
    '收货确认': ['收到了', '已收到', '收货', '拆开', '打开包裹'],
    '质量问题': ['质量问题', '坏了', '断了', '掉色', '褪色严重', '不像'],
    '尺寸不合': ['太小', '太大', '尺寸不对', '戴不上', '太紧', '太松'],
    '退换货': ['退货', '换货', '退款', '重新发', '补发'],
    '好评回访': ['满意', '很好', '喜欢', '漂亮', '质量不错']
}

after_sales = []
for conv in all_conversations:
    if 10 <= conv['message_count'] <= 30:
        full_text = ' '.join((msg['content'] or '') for msg in conv['messages'])

        matched_scenes = []
        for scene, keywords in after_sales_keywords.items():
            if any(kw in full_text for kw in keywords):
                matched_scenes.append(scene)

        if matched_scenes:
            after_sales.append({
                'conv': conv,
                'after_sales_scenes': matched_scenes
            })

print(f"找到 {len(after_sales)} 个售后场景对话\n")

# 按场景分类显示
for scene in after_sales_keywords.keys():
    matching = [item for item in after_sales if scene in item['after_sales_scenes']]
    if matching:
        print(f"\n{scene} ({len(matching)}个):")
        for i, item in enumerate(matching[:3], 1):
            conv = item['conv']
            print(f"  {i}. {conv['conversation_key'][:16]}... ({conv['message_count']}条)")
