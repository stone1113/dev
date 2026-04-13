import json
from collections import defaultdict
from datetime import datetime

# 读取选中的对话
with open('D:/dev/agent/final_selected.json', 'r', encoding='utf-8') as f:
    conversations = json.load(f)

# 去重
unique_convs = {}
for conv in conversations:
    key = conv['conversation_key']
    if key not in unique_convs:
        unique_convs[key] = conv

conversations = list(unique_convs.values())

# 生成markdown
md_content = """# ChatBiz Agent 真实多轮对话数据集（完整版）
## 基于33,633条WhatsApp珠宝电商真实对话数据

---

"""

scene_names = {
    '高仿咨询': '高仿咨询+相似度确认',
    '讨价还价': '讨价还价+申请折扣',
    '优惠券': '优惠券咨询+使用',
    '弃单挽回': '弃单挽回+优惠券补偿',
    '支付失败': '支付失败+重新下单',
    '产品质量': '产品质量咨询+保证',
    '下单流程': '下单流程+支付确认',
    '尺寸咨询': '尺寸咨询+定制服务',
    '材质咨询': '材质咨询+价格对比',
    '物流咨询': '物流咨询+时效确认'
}

for idx, conv in enumerate(conversations, 1):
    main_scene = conv['scenes'][0] if conv['scenes'] else '综合咨询'
    scene_title = scene_names.get(main_scene, main_scene)

    md_content += f"## 场景{idx}：{scene_title}\n\n"
    md_content += f"**conversation_key**: {conv['conversation_key']}\n"
    md_content += f"**客户**: {conv['customer']}\n"
    md_content += f"**时间跨度**: {conv['time_span']}\n\n"

    messages = conv['messages']
    customer_name = conv['customer']

    # 按对话交互分轮：客户发起 → 客服回复 = 一轮
    round_num = 1
    current_round_messages = []
    last_sender_type = None  # 'customer' or 'service'

    for msg in messages:
        sender = msg['sender']
        content = (msg['content'] or '').replace('\n', ' ').strip()

        if not content or content in ['\u200E图像已忽略', '\u200EGIF 动态图已被忽略', '\u200E视频已忽略']:
            continue

        # 判断是客服还是客户
        is_customer = (customer_name in sender or
                      sender == customer_name or
                      (not any(kw in sender.lower() for kw in ['charm', 'aries', 'clover', 'raffine', 'jewelry', 'jewellry'])))

        current_sender_type = 'customer' if is_customer else 'service'

        # 如果发送者类型变化，且之前有消息，则输出上一轮
        if last_sender_type and current_sender_type != last_sender_type and current_round_messages:
            # 输出上一轮
            if len(current_round_messages) > 0:
                md_content += f"**第{round_num}轮**\n"
                for sender_label, msg_content in current_round_messages:
                    if len(msg_content) > 300:
                        msg_content = msg_content[:300] + '...'
                    md_content += f"- {sender_label}：{msg_content}\n"
                md_content += "\n"
                round_num += 1
                current_round_messages = []

        # 添加当前消息
        sender_label = "客户" if is_customer else "客服"
        current_round_messages.append((sender_label, content))
        last_sender_type = current_sender_type

    # 输出最后一轮
    if current_round_messages:
        md_content += f"**第{round_num}轮**\n"
        for sender_label, msg_content in current_round_messages:
            if len(msg_content) > 300:
                msg_content = msg_content[:300] + '...'
            md_content += f"- {sender_label}：{msg_content}\n"
        md_content += "\n"

    md_content += "---\n\n"

md_content += """## 数据集说明

### 真实对话特点
1. **完整上下文**：所有回复来自同一个conversation_key，保证对话连贯性
2. **真实时间线**：保留原始时间戳，展示真实对话节奏
3. **多轮交互**：每一轮 = 客户发起 + 客服回复，真实展现对话往返
4. **客服话术**：
   - 称呼变化：尊敬的→亲爱的→宝贝
   - 主动营销：发送商店链接、推荐其他产品
   - 补偿策略：优惠券而非退货（跨境成本高）
   - 回头客维护：礼金券、专属优惠

### 覆盖场景（18个真实对话）
- **售前**（10个）：高仿咨询、讨价还价、优惠券、产品质量
- **售中**（4个）：弃单挽回、支付失败、下单流程
- **售后**（4个）：物流催单、质量问题、追加购买、尺寸修改

### 与AI Agent对比要点
1. **价格策略**：真实客服发送链接让客户自查，AI可能直接报价
2. **退换货**：真实客服优先优惠券补偿，AI可能直接提供退货方案
3. **营销节奏**：真实客服会在对话中插入其他产品推荐
4. **1:1复刻说明**：真实客服直接说明是复刻品，不回避
5. **物流时效**：真实数据7-12天，需与AI回复对比

### 数据来源
- 原始数据：33,633条WhatsApp对话记录
- 翻译方式：DeepSeek API翻译
- 提取方式：按conversation_key完整提取
- 筛选标准：10-30条消息、包含关键场景、客服+客户双方对话
"""

with open('D:/dev/agent/真实多轮对话数据集_完整版.md', 'w', encoding='utf-8') as f:
    f.write(md_content)

print(f"已生成 {len(conversations)} 个真实多轮对话")
