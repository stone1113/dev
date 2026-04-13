"""LLM 提示词模板 — 基于33,633条WhatsApp珠宝电商真实对话数据集构建。"""
from __future__ import annotations

from models.intent import AgentPhase
from knowledge import find_product_by_entities, get_logistics_for_region, get_policy, PRODUCTS

# ═══════════════════════════════════════════
# 意图分类树参考（提示词内嵌，帮助LLM理解分类体系）
# ═══════════════════════════════════════════

_INTENT_REFERENCE = {
    "pre_sales": """售前意图分类：
- PRODUCT_INQUIRY（产品咨询）: price_inquiry(价格咨询), material_inquiry(材质咨询,如14K/18K/925银/合金/防水/褪色), product_comparison(产品对比), collection_inquiry(系列咨询,如四叶草/Love/蛇骨), customization_inquiry(定制/刻字/改尺寸), authenticity_inquiry(真伪/证书)
- PURCHASE_INTENT（购买意向）: ready_to_buy(准备下单), hesitation(犹豫/考虑中), budget_concern(预算/砍价/折扣), gift_purchase(送礼), bulk_purchase(批量/代购), urgency_purchase(加急)
- SHIPPING_INQUIRY（物流咨询）: shipping_cost(运费/包邮), shipping_time(时效/几天到), international_shipping(跨境/清关/关税)
- PAYMENT_INQUIRY（支付咨询）: payment_methods(支付方式), installment(分期)
- PROMOTION_INQUIRY（促销咨询）: current_promotion(当前活动/折扣码), membership_benefit(会员权益), bundle_deal(套装/组合优惠)
- SERVICE_INQUIRY（服务咨询）: contact_human(转人工), after_sales_policy(售后政策/退换规则)""",

    "in_sales": """售中意图分类：
- ORDER_STATUS（订单状态）: order_confirmation(订单确认), shipping_tracking(物流追踪/单号), delivery_eta(预计到达/几天到), shipping_delay(物流延迟/催物流)
- ORDER_MODIFICATION（订单修改）: change_address(改地址), change_quantity(改数量/加购), cancel_order(取消订单)
- PAYMENT_ISSUE（支付问题）: payment_confirmation(确认收款), payment_failed(支付失败), double_charge(重复扣款)
- QUALITY_CHECK（验货质检）: qc_request(要求验货照片/视频), qc_issue(质检问题)
- CUSTOMS_LOGISTICS（清关物流）: customs_issue(清关/被扣), logistics_insurance(运输保险)
- COMMUNICATION（沟通需求）: urgent_matter(紧急事项), special_request(特殊要求/备注/留言)""",

    "after_sales": """售后意图分类：
- RETURN_REFUND（退换货）: return_request(退货), refund_request(退款), exchange_request(换货/换尺寸/换颜色)
- COMPLAINT（投诉）: product_complaint(产品问题/色差/尺寸不对/褪色/断裂), service_complaint(服务投诉/回复慢), escalation(投诉升级/要主管)
- REPAIR_MAINTENANCE（维修保养）: repair_request(维修), maintenance_service(保养/清洗), warranty_claim(保修)
- COMPENSATION（补偿）: request_compensation(要求补偿), goodwill_gesture(商家主动补偿)
- FEEDBACK（反馈）: positive_feedback(好评/满意), negative_feedback(差评/不满)
- REPURCHASE（复购）: reorder(复购/再买), new_product_interest(对新品感兴趣), referral(推荐朋友)""",
}

# ═══════════════════════════════════════════
# 真实对话样本（从数据集中提取的典型对话）
# ═══════════════════════════════════════════

_FEW_SHOT_EXAMPLES = {
    "pre_sales": """
示例对话及标注：
1. 客户："你好，你们的首饰是什么材质的？" → PRODUCT_INQUIRY > material_inquiry, entities: {}
2. 客户："能看看梵克雅宝四叶草手链的视频吗" → PRODUCT_INQUIRY > collection_inquiry, entities: {brand: "Van Cleef & Arpels", product_type: "bracelet"}
3. 客户："可以给我看看黄金款卡地亚Love手镯的视频吗" → PRODUCT_INQUIRY > collection_inquiry, entities: {brand: "Cartier", product_type: "bracelet", material: "gold"}
4. 客户："我已向购物车中添加了3项商品，但折扣未显示" → PROMOTION_INQUIRY > current_promotion, entities: {}
5. 客户："那我可以戴着首饰洗澡游泳吗？会不会变黑？" → PRODUCT_INQUIRY > material_inquiry, entities: {}
6. 客户："您好，您从哪里发货？" → SHIPPING_INQUIRY > international_shipping, entities: {}
7. 客户："您是运送联邦快递还是UPS？" → SHIPPING_INQUIRY > shipping_time, entities: {}""",

    "in_sales": """
示例对话及标注：
1. 客户："我的订单在哪里？我在你们主页用订单号找不到我的订单" → ORDER_STATUS > shipping_tracking, entities: {}
2. 客户："请取消它" + 上下文有订单讨论 → ORDER_MODIFICATION > cancel_order, entities: {}
3. 客户："是的，那个地址是正确的" + 上下文确认地址 → ORDER_STATUS > order_confirmation, entities: {}
4. 客户："我之前和客服邮件沟通换货，但无法通过邮件发送视频" → QUALITY_CHECK > qc_issue, entities: {}
5. 客户："为了保险起见，请寄18号的尺寸" → ORDER_MODIFICATION > change_quantity, entities: {size: "18cm"}
6. 客户："我愿意支付20美元运费" + 上下文有换货讨论 → PAYMENT_ISSUE > payment_confirmation, entities: {}""",

    "after_sales": """
示例对话及标注：
1. 客户："您好。我刚收到漂亮的手镯，但它们太小了。我可以退货并放大尺寸吗？" → RETURN_REFUND > exchange_request, entities: {product_type: "bracelet"}
2. 客户："我不想要这个订单了，我无法信任你们的产品。" → RETURN_REFUND > return_request, entities: {}
3. 客户："直接取消订单就足够了" → RETURN_REFUND > refund_request, entities: {}
4. 客户："没错，你说你们24小时营业，但凌晨2点才回复。" → COMPLAINT > service_complaint, entities: {}
5. 客户："我不再信任你们的产品了。请取消订单，不要扣费。" → COMPLAINT > product_complaint, entities: {}""",
}


def build_classify_prompt(message: str, phase: AgentPhase, history: list[str] | None = None) -> str:
    """构建意图分类的系统提示词 — 基于真实WhatsApp珠宝电商数据集。"""
    phase_zh = {"pre_sales": "售前", "in_sales": "售中", "after_sales": "售后"}[phase]

    history_text = ""
    if history:
        recent = history[-5:]
        history_text = "\n\n对话上下文（最近消息）：\n" + "\n".join(f"- {h}" for h in recent)

    intent_ref = _INTENT_REFERENCE.get(phase, "")
    examples = _FEW_SHOT_EXAMPLES.get(phase, "")

    return f"""你是一个跨境珠宝电商WhatsApp客服AI助手，服务于Clover Jewelry/Charm Aries等品牌店铺。
你的客户来自全球各国（美国、韩国、以色列、黎巴嫩、瑞士等），通过WhatsApp沟通。
当前需要对{phase_zh}阶段的客户消息进行意图分类。

{intent_ref}

{examples}

请分析以下客户消息，返回JSON格式结果：

客户消息：{message}{history_text}

要求：
1. primary_intent: 匹配上述分类树中的一级意图ID（如 PRODUCT_INQUIRY）
2. secondary_intent: 匹配二级意图ID（如 price_inquiry）
3. confidence: 置信度（0-1，根据消息与意图的匹配程度）
4. extracted_entities: 提取的实体（brand品牌、material材质、product_type产品类型、size尺寸等）

注意：
- 品牌缩写要归一化：VCA→Van Cleef & Arpels, 卡地亚→Cartier
- 材质要规范化：14k→14K_Gold, 925银→Sterling_Silver
- 如果消息太模糊无法判断，confidence设为0.2以下

请严格按以下JSON格式返回，不要有其他内容：
{{
    "primary_intent": "...",
    "secondary_intent": "...",
    "confidence": 0.0,
    "extracted_entities": {{}}
}}"""


def build_reply_prompt(
    message: str,
    phase: AgentPhase,
    intent_primary: str,
    intent_secondary: str,
    entities: dict[str, str] | None = None,
) -> str:
    """构建自动回复的系统提示词 — 基于真实WhatsApp珠宝电商数据集的商家回复风格。"""
    phase_zh = {"pre_sales": "售前", "in_sales": "售中", "after_sales": "售后"}[phase]

    # 根据阶段提供不同的回复风格指引
    style_guide = _REPLY_STYLE_GUIDES.get(phase, "")

    # 从知识库注入事实上下文
    kb_context = _build_kb_context(entities or {})

    return f"""你是一个跨境珠宝电商的{phase_zh}WhatsApp客服，服务于高端珠宝品牌（梵克雅宝、卡地亚、蒂芙尼等风格的饰品）。

## 角色设定
- 品牌：跨境珠宝电商，从中国发货，面向全球客户
- 渠道：WhatsApp
- 产品：高仿/平替轻奢珠宝，14K金、18K金、925银、合金镀金等
- 物流：联邦快递/UPS/EMS，一般7-15天送达
- 退换政策：跨境退货运费高昂，一般通过补偿优惠券或重新发货解决。退货需客户承担运费和关税，收到后退70%。

## 知识库参考（请基于以下事实回复，不要编造）
{kb_context}

## 客户信息
客户意图：{intent_primary} > {intent_secondary}
客户消息：{message}

## 回复风格（基于真实数据集的商家话术）
{style_guide}

## 回复要求
1. 称呼客户为"亲爱的"（dear），这是WhatsApp珠宝电商的标准称呼
2. 语气专业但温暖，不要过度热情也不要生硬
3. 如果涉及产品，主动提供店铺链接或产品信息
4. 如果涉及问题/投诉，先道歉再给方案
5. 如果客户犹豫，适当施加紧迫感但不要太强势
6. 回复控制在50-150字，WhatsApp消息不宜太长
7. 不要使用emoji表情
8. 使用中文回复

请直接输出回复内容，不需要额外格式。"""


# ═══════════════════════════════════════════
# 各阶段回复风格指引（从真实数据集提炼）
# ═══════════════════════════════════════════

_REPLY_STYLE_GUIDES: dict[AgentPhase, str] = {
    "pre_sales": """售前风格参考（来自真实数据）：
- 材质咨询："亲爱的，我们采用合金材料，有两种材质可选：一种是银合金镀14K金，另一种是925纯银镀18K金。"
- 真实性/1:1："亲，我们是1:1复刻的，相似度99%，细节都是按照原版复刻。" / "我们和正品的相似度超过95%。" / "颜色和官网原版完全一样的！"
- 产品展示：主动发店铺链接"这是我们店铺的链接，您可以先看看"
- 防水问题："我们的首饰具有防水不褪色特性，一般保色约半年左右。"
- 尺寸建议：主动提供尺寸测量建议
- 跟进话术："您好，亲爱的，有任何其他问题随时问我"
- 沉默跟进："最近怎么样，您还在看首饰吗"
- 促销引导："商店的折扣活动仍在继续，您是否考虑过订购？"
""",

    "in_sales": """售中风格参考（来自真实数据）：
- 地址确认："亲爱的，您购买的订单显示地址有误，请确认您的正确地址。"
- 发货通知："这是您产品的质检视频/照片"，发货前主动提供QC
- 物流查询：主动提供物流单号和预计到达时间
- 时差说明："由于时差的原因，有时候我无法及时回复，但看到消息后会尽快回复您。"
- 换货流程："请将物品和原包装寄到这个地址，我们收到后会为您重新寄出新包裹。"
- 灵活处理："您已经收到的可以保留，无需退回。"
""",

    "after_sales": """售后风格参考（真实数据集话术）：
- 尺寸问题："我可以给您一张优惠券，供您再次购买。" / "好的，我会为您提供一张40$的回购优惠券。"
- 质量问题先询问："亲爱的，请问是哪里质量差呢" / "得知您的手镯到货时损坏，我们深表歉意。这完全不可接受，我们对此问题负全部责任。"
- 补发方案："您保留产品，支付30$的运费，我们重新发送您尺寸的手镯，是否可以接受？" / "我们会给您补发"
- 退货说明："您将负责退货的运费和关税。收到退货后，我们将向您发放70%的退款。" / "抱歉，我们没有退货标签，需要您自行寄回。"
- 挽留话术："能告诉我原因吗？是因为尺寸不合适还是不喜欢颜色？" / "要不要考虑换成玫瑰金色？"
- 灵活处理："如果下次寄送还是这样，我会免费为您重新补发。" / "我们想和您分摊这笔费用——每人30美元。这样可以吗？"
""",
}


# ═══════════════════════════════════════════
# 知识库上下文构建器（注入到LLM提示词中）
# ═══════════════════════════════════════════

def _build_kb_context(entities: dict[str, str]) -> str:
    """根据提取的实体构建知识库上下文，注入到LLM提示词中。"""
    lines: list[str] = []

    # 产品信息
    product = find_product_by_entities(entities)
    if product:
        lines.append(f"匹配产品：{product['name_zh']}（{product['brand']}）")
        lines.append(f"  可选材质：{'/'.join(product['materials'][:4])}")
        lines.append(f"  可选尺寸：{'/'.join(product['sizes'][:5])}")
        lines.append(f"  尺寸建议：{product['size_guide']}")
        price = product.get("price_range", {})
        if price:
            price_str = "，".join(f"{k}: {v}" for k, v in price.items())
            lines.append(f"  价格区间：{price_str}")
        lines.append(f"  保养建议：{product.get('care', '日常注意保养')}")
    else:
        lines.append("未匹配到具体产品。可选品类：项链、手链、手镯、戒指、耳环。")
        product_names = [p["name_zh"] for p in PRODUCTS.values()]
        lines.append(f"  热门产品：{'、'.join(product_names)}")

    # 物流信息
    logistics = get_logistics_for_region()
    lines.append(f"物流：从{logistics['origin']}发货，{logistics['carrier_name']}，{logistics['eta']}送达")
    lines.append(f"  包邮门槛：$200")

    # 政策信息（跨境电商特殊政策）
    lines.append(f"售后政策：{get_policy('return_policy')}")
    lines.append(f"  质量问题：{get_policy('quality_issue')}")
    lines.append(f"  尺寸问题：{get_policy('size_issue')}")
    lines.append(f"  补偿方案：{get_policy('compensation_coupon')}")
    lines.append(f"  质保期：{get_policy('warranty')}")
    lines.append(f"取消政策：{get_policy('cancel_free')}；{get_policy('cancel_fee')}")
    lines.append(f"退款时效：{get_policy('refund_time')}")
    lines.append(f"质保：{get_policy('warranty')}")
    lines.append(f"质检流程：{get_policy('qc_process')}")

    return "\n".join(lines)
