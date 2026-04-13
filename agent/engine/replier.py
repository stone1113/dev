"""规则模板回复引擎 — 支持动态变量填充和知识库注入。

模板中的占位符格式：{variable_name}
运行时根据提取的实体、知识库和上下文自动填充。
"""
from __future__ import annotations

from models.intent import AgentPhase
from knowledge import (
    find_product_by_entities,
    get_logistics_for_region,
    get_policy,
    find_faq,
    PRODUCTS,
)


# ═══════════════════════════════════════════
# 动态变量回复模板库
# 占位符：{brand} {product} {material} {size} {price}
#         {carrier} {eta} {origin}
#         {return_window} {cancel_fee} {refund_time}
# ═══════════════════════════════════════════

_REPLY_TEMPLATES: dict[AgentPhase, dict[str, dict[str, str]]] = {
    # ───── 售前 ─────
    "pre_sales": {
        "PRODUCT_INQUIRY": {
            "price_inquiry": "亲爱的，{product_info}{price_info}如果没有找到您想要的款式，可以告诉我具体品牌和型号，我帮您查询。我可以发实拍视频给您看看，有喜欢的款式随时告诉我。",
            "material_inquiry": "亲爱的，我来为您说明产品材质。{material_info}首饰具有防水不褪色特性，一般保色约半年左右。{price_info}日常佩戴注意保养的话，使用寿命会更长。{care_info}",
            "product_comparison": "亲爱的，{product_info}{price_info}我可以把每款的实拍视频发给您对比看看，有任何问题随时问我。",
            "collection_inquiry": "亲爱的，{product_info}{price_info}{size_info}您可以先看看我们的店铺，选好喜欢的款式告诉我，我帮您确认库存。",
            "customization_inquiry": "亲爱的，我们支持定制服务，包括刻字、调节尺寸等。定制需要额外5-7个工作日。{price_info}具体细节我帮您对接专业顾问。",
            "authenticity_inquiry": "亲爱的，我们是1:1复刻的，相似度99%，所有细节都按照原版制作，包括刻印、logo等标识。{qc_info} 请放心。",
            "packaging_inquiry": "亲爱的，我们默认包装是精美礼盒。如果需要原品牌礼盒，需要额外支付20-30美元。原装盒包含品牌盒子、证书、包装袋等全套配件。",
            "care_inquiry": "亲爱的，经过适当的护理和维护，不会轻易褪色。{material_info} 一般保色约半年到两年，日常佩戴注意避免接触化学品和水，使用寿命会更长。",
            "general_inquiry": "亲爱的，感谢您的咨询！{product_info}{price_info}有任何问题随时问我，我会真诚地为您服务。",
        },
        "PURCHASE_INTENT": {
            "ready_to_buy": "亲爱的，太好了！{size_info}请确认您的收货地址，下单后我们会尽快安排发货。{qc_info}",
            "hesitation": "亲爱的，{product_info}目前库存有限，最近询问的客户比较多。我们商店的折扣活动仍在继续，如果您喜欢建议尽早下单。有任何顾虑都可以跟我说。",
            "budget_concern": "亲爱的，理解您的预算考虑。{budget_info}我可以帮您推荐性价比高的款式。",
            "gift_purchase": "亲爱的，送礼选珠宝非常合适！我们提供精美包装。{product_info}请问是送给什么人呢？我帮您推荐最合适的款式和尺寸。",
            "bulk_purchase": "亲爱的，批量订购我们有优惠价格。请问您大概需要多少件？我帮您核算批量价格。",
            "urgency_purchase": "亲爱的，收到！确认款式和地址后我们立即安排发货。{shipping_info}",
        },
        "SHIPPING_INQUIRY": {
            "shipping_cost": "亲爱的，运费根据目的地不同有所差异。订单满{free_shipping}可以包邮。请问您的收货地址在哪里？我帮您查具体运费。",
            "shipping_time": "亲爱的，{shipping_info}。具体时效取决于目的地国家和清关速度。",
            "international_shipping": "亲爱的，我们支持全球配送。{shipping_info}。{customs_info}",
            "general_inquiry": "亲爱的，{shipping_info}。下单后会提供物流单号，您可以随时追踪包裹状态。",
        },
        "PAYMENT_INQUIRY": {
            "payment_methods": "亲爱的，您可以通过我们的网站下单支付，支持信用卡、PayPal等多种方式。如果需要其他支付方式也可以跟我沟通。",
            "installment": "亲爱的，部分信用卡支持分期付款。具体方案取决于您的银行，下单时可以查看是否有分期选项。",
            "general_inquiry": "亲爱的，支付方面有任何问题都可以问我，我帮您解决。",
        },
        "PROMOTION_INQUIRY": {
            "current_promotion": "亲爱的，我们商店目前有折扣活动！结账时会自动扣除折扣。有喜欢的款式随时联系我。",
            "membership_benefit": "亲爱的，老客户享有专属优惠。作为回头客，我们会为您准备礼金券供下次购买使用。",
            "bundle_deal": "亲爱的，多件购买更划算！我帮您看看组合优惠方案，搭配购买可以享受额外折扣。",
            "general_inquiry": "亲爱的，我们经常有优惠活动。您可以先看看店铺，有喜欢的联系我，我帮您确认最优价格。",
        },
        "SERVICE_INQUIRY": {
            "contact_human": "好的亲爱的，我马上为您转接人工客服，请稍等。",
            "after_sales_policy": "亲爱的，我们的退换政策：{return_window}可申请退换。{cancel_fee_info}。{qc_info}",
            "general_inquiry": "亲爱的，有什么可以帮到您的吗？无论是产品咨询、下单还是售后，有任何问题随时问我。",
        },
    },

    # ───── 售中 ─────
    "in_sales": {
        "ORDER_STATUS": {
            "order_confirmation": "亲爱的，您的订单已确认！我们会尽快安排生产和发货。{qc_info}",
            "shipping_tracking": "亲爱的，我帮您查询了物流信息。您的包裹已发出，{tracking_info}有任何更新我会及时通知您。",
            "delivery_eta": "亲爱的，根据物流信息，{eta_info}实际到达时间取决于当地清关和派送速度，请耐心等待。",
            "shipping_delay": "亲爱的，非常抱歉物流比预期慢了。我已经帮您跟进催促，可能是清关环节需要时间。有最新进展我第一时间通知您。",
            "general_inquiry": "亲爱的，您的订单正在处理中。有什么具体想了解的吗？我帮您查。",
        },
        "ORDER_MODIFICATION": {
            "change_address": "亲爱的，收到！请把新的收货地址发给我，如果包裹还未发出我马上帮您修改。如果已发出，我联系快递看能否中途转寄。",
            "change_quantity": "亲爱的，好的，请问您要改成什么？我帮您更新订单，有差价的话我核算后告诉您。",
            "cancel_order": "亲爱的，可以问一下取消的原因吗？有什么问题我们可以帮忙解决吗？{cancel_policy_info}",
            "general_inquiry": "亲爱的，订单修改我来帮您处理。请告诉我具体需要改什么。",
        },
        "PAYMENT_ISSUE": {
            "payment_confirmation": "亲爱的，已收到您的付款，感谢！订单已确认，我们会尽快安排生产发货。",
            "payment_failed": "亲爱的，支付似乎没有成功。建议您检查一下卡的余额或换一种支付方式重试。如果问题持续，我帮您排查。",
            "double_charge": "亲爱的，非常抱歉！重复扣款问题我已记录，会立即联系财务处理退款。{refund_time_info}请放心。",
            "general_inquiry": "亲爱的，支付方面的问题我来帮您排查，请描述一下具体情况。",
        },
        "QUALITY_CHECK": {
            "qc_request": "亲爱的，没问题！我现在帮您拍质检照片和视频发给您确认，稍等一下。",
            "qc_issue": "亲爱的，非常抱歉质检发现问题！我已反馈给品控团队，会为您重新安排合格的产品。给您带来的不便深表歉意。",
            "general_inquiry": "亲爱的，{qc_info}有什么具体想确认的吗？",
        },
        "CUSTOMS_LOGISTICS": {
            "customs_issue": "亲爱的，清关可能需要一些时间，这是正常流程。{customs_info}复杂问题我帮您转接专员。",
            "logistics_insurance": "亲爱的，我们的包裹都有基本运输保障。如果您想要额外保险，我帮您查询费用。",
            "general_inquiry": "亲爱的，由于时差原因，有时候回复可能不及时，但看到消息会尽快处理。物流方面的问题我来帮您跟进。",
        },
        "COMMUNICATION": {
            "urgent_matter": "亲爱的，收到！我马上帮您转接处理，请稍等。",
            "special_request": "亲爱的，您的特殊需求我已记录，会尽力安排。确认后回复您。",
            "general_inquiry": "亲爱的，有什么需要沟通的请随时告诉我。",
        },
    },

    # ───── 售后 ─────
    "after_sales": {
        "RETURN_REFUND": {
            "return_request": "亲爱的，您将负责退货的运费和关税。收到退货后，我们将向您发放70%的退款。能告诉我原因吗？是因为尺寸不合适还是不喜欢颜色？",
            "refund_request": "亲爱的，抱歉，我们没有退货标签，需要您自行寄回。我会给您退货地址，但您确定要退款吗？",
            "exchange_request": "我可以给您一张优惠券，供您再次购买。",
            "general_inquiry": "亲爱的，能告诉我原因吗？有什么问题我们可以帮忙解决吗？",
        },
        "COMPLAINT": {
            "product_complaint": "亲爱的，请问是哪里质量差呢？能拍照发给我看看吗？",
            "service_complaint": "您好，由于时差的原因，有时候我无法及时回复您的消息，但看到消息后我会尽快回复您。",
            "escalation": "亲爱的，您的问题我非常重视！已经帮您升级处理，马上转接主管亲自为您解决。",
            "general_inquiry": "得知您遇到问题，我们深表歉意。请详细告诉我情况，我会全力帮您解决。",
        },
        "REPAIR_MAINTENANCE": {
            "repair_request": "亲爱的，请先拍照让我看看损坏情况。我们会给您补发。",
            "maintenance_service": "经过适当的护理和维护，它不会轻易褪色。",
            "warranty_claim": "亲爱的，我们已经查看了您的订单。我们会先和发货部门确认是否有误。如果是，我们会立即给您补发。",
            "general_inquiry": "亲爱的，关于维修和保养，请描述一下情况，我来帮您安排。",
        },
        "COMPENSATION": {
            "request_compensation": "好的，我会为您提供一张40$的回购优惠券。",
            "goodwill_gesture": "亲爱的，作为诚意，我们为您准备了优惠券供下次购买使用。",
            "general_inquiry": "亲爱的，补偿方案我会尽力帮您争取最好的结果。",
        },
        "FEEDBACK": {
            "positive_feedback": "亲爱的，非常感谢您的认可！作为回头客，我们为您准备了专属优惠。期待再次为您服务！",
            "negative_feedback": "亲爱的，感谢您的反馈，我们会认真改进。为表歉意，为您准备了优惠券。如有任何问题随时联系我。",
            "general_inquiry": "亲爱的，非常感谢您的反馈，我们会持续改进。",
        },
        "REPURCHASE": {
            "reorder": "亲爱的，欢迎回来！我们看到您是老客户，为您准备了回头客专属礼金券。有喜欢的款式随时联系我！",
            "new_product_interest": "亲爱的，我们最近上了很多新款！您可以看看店铺，有几款特别受欢迎。看到喜欢的告诉我，我发实拍视频给您。",
            "referral": "亲爱的，非常感谢您推荐朋友！推荐成功后双方都会获得优惠券奖励。",
            "general_inquiry": "亲爱的，欢迎再次光临！有任何需要随时联系我。",
        },
    },
}

# 兜底默认回复
_DEFAULT_REPLIES: dict[AgentPhase, str] = {
    "pre_sales": "亲爱的，感谢您的咨询！请问有什么可以帮到您的呢？您可以先看看我们的店铺，有喜欢的款式随时联系我。",
    "in_sales": "亲爱的，您的订单我来帮您跟进。有什么具体需要帮助的请告诉我。",
    "after_sales": "亲爱的，售后问题我来帮您处理。请详细描述一下情况，我会尽快给您解决方案。",
}


# ═══════════════════════════════════════════
# 动态变量构建器
# ═══════════════════════════════════════════

def _build_variables(
    phase: AgentPhase,
    intent_primary: str,
    intent_secondary: str,
    entities: dict[str, str] | None = None,
    order_info: dict | None = None,
) -> dict[str, str]:
    """根据上下文构建模板变量。"""
    entities = entities or {}
    order_info = order_info or {}
    variables: dict[str, str] = {}

    # ── 产品信息 ──
    product = find_product_by_entities(entities)
    if product:
        materials_str = "/".join(product["materials"][:3])
        variables["product_info"] = (
            f"这款{product['name_zh']}（{product['brand']}），"
            f"有{materials_str}等材质可选。"
        )
        variables["size_info"] = f"尺寸建议：{product['size_guide']}，可选尺寸：{'/'.join(product['sizes'][:5])}。"
        variables["care_info"] = product.get("care", "日常注意保养可延长使用寿命。")
        price = product.get("price_range", {})
        if price:
            first_key = next(iter(price))
            variables["budget_info"] = f"我们有不同材质和价位可选，比如{first_key}材质价格在{price[first_key]}之间。"
            price_list = [f"{mat}材质{pr}" for mat, pr in list(price.items())[:2]]
            variables["price_info"] = f"价格方面：{'/'.join(price_list)}。"
        else:
            variables["price_info"] = ""
    else:
        variables["product_info"] = ""
        variables["size_info"] = ""
        variables["care_info"] = "日常佩戴注意避免接触化学品，洗澡游泳时建议取下。"
        variables["budget_info"] = "我们有不同价位的产品可以选择，从合金到925银到18K金都有。"
        variables["price_info"] = ""

    # ── 材质信息 ──
    material = entities.get("material", "")
    if material:
        variables["material_info"] = f"您询问的{material}材质，我们采用合金基材镀层工艺。"
    else:
        variables["material_info"] = "我们有两种材质可选：银合金镀14K金和925纯银镀18K金。"

    # ── 物流信息 ──
    logistics = get_logistics_for_region()
    variables["shipping_info"] = f"我们从{logistics['origin']}发货，使用{logistics['carrier_name']}，一般{logistics['eta']}送达"
    variables["carrier"] = logistics["carrier_name"]
    variables["eta"] = logistics["eta"]
    variables["origin"] = logistics["origin"]
    variables["customs_info"] = logistics.get("customs_note", "具体清关事宜视目的地而定。")
    variables["free_shipping"] = "$200"

    # ── 物流追踪（售中） ──
    tracking_no = order_info.get("tracking_no", "")
    if tracking_no:
        variables["tracking_info"] = f"物流单号：{tracking_no}，您可以在快递官网追踪。"
    else:
        variables["tracking_info"] = "物流单号会在发货后通知您。"

    variables["eta_info"] = f"您的包裹预计在{logistics['eta']}内送达。"

    # ── 政策信息（跨境电商特殊政策）──
    variables["return_policy_info"] = get_policy("return_policy") or "跨境退货运费高昂，一般不支持退货退款"
    variables["quality_issue_info"] = get_policy("quality_issue") or "质量问题：提供照片后重新发货或赠送优惠券"
    variables["size_issue_info"] = get_policy("size_issue") or "尺寸不合：补偿$10-20优惠券"
    variables["cancel_policy_info"] = f"{get_policy('cancel_free') or '未发货前可取消'}。如果已发货，{get_policy('cancel_shipped') or '无法取消'}。"
    variables["compensation_info"] = get_policy("compensation_coupon") or "一般问题补偿$10-30优惠券"
    variables["warranty_info"] = f"{get_policy('warranty') or '产品享有6个月质保'}，质保期内质量问题免费补发。"
    variables["qc_info"] = get_policy("qc_process") or "发货前提供质检照片/视频给您确认。"

    return variables


# ═══════════════════════════════════════════
# 主入口
# ═══════════════════════════════════════════

def generate_template_reply(
    phase: AgentPhase,
    intent_primary: str,
    intent_secondary: str,
    entities: dict[str, str] | None = None,
    order_info: dict | None = None,
    message: str = "",
) -> str:
    """根据意图匹配模板并填充动态变量，支持多关注点组合回复。"""
    phase_templates = _REPLY_TEMPLATES.get(phase, {})
    primary_templates = phase_templates.get(intent_primary, {})

    # 精确匹配二级意图
    template = primary_templates.get(intent_secondary)
    if not template:
        template = primary_templates.get("general_inquiry")
    if not template:
        return _DEFAULT_REPLIES.get(phase, "您好，请问有什么可以帮到您？")

    variables = _build_variables(phase, intent_primary, intent_secondary, entities, order_info)

    # 填充变量
    try:
        reply = template.format_map(_SafeDict(variables))
    except (KeyError, ValueError):
        reply = template
        for k, v in variables.items():
            reply = reply.replace("{" + k + "}", v)

    # 多关注点补充：检测消息中是否包含其他未被主意图覆盖的关注点
    if message:
        reply = _append_secondary_concerns(reply, message, intent_secondary, primary_templates, variables)

    return reply


# 关注点关键词映射（意图ID → 触发关键词）
_CONCERN_KEYWORDS: dict[str, list[str]] = {
    "packaging_inquiry": ["盒子", "包装", "礼盒", "原装盒", "原盒"],
    "authenticity_inquiry": ["刻印", "正品", "像正品", "高仿", "复刻", "1:1"],
    "material_inquiry": ["材质", "材料", "什么做的", "真金", "镀金", "纯银", "合金"],
    "price_inquiry": ["多少钱", "价格", "报价"],
    "care_inquiry": ["保养", "护理", "褪色", "掉色", "变色"],
    "shipping_cost": ["运费", "包邮"],
    "shipping_time": ["多久到", "几天到", "多长时间"],
}


def _append_secondary_concerns(
    reply: str,
    message: str,
    primary_secondary: str,
    primary_templates: dict[str, str],
    variables: dict[str, str],
) -> str:
    """检测消息中未被主意图覆盖的次要关注点，追加简短回答。"""
    msg_lower = message.lower()
    appended = []

    for intent_id, keywords in _CONCERN_KEYWORDS.items():
        if intent_id == primary_secondary:
            continue
        if not any(kw in msg_lower for kw in keywords):
            continue
        # 找到次要关注点，生成简短补充
        sub_template = primary_templates.get(intent_id)
        if sub_template:
            try:
                sub_reply = sub_template.format_map(_SafeDict(variables))
            except (KeyError, ValueError):
                sub_reply = sub_template
            # 只取第一句作为补充
            first_sentence = sub_reply.split("。")[0] + "。"
            if first_sentence not in reply:
                appended.append(first_sentence)

    if appended:
        reply = reply.rstrip() + " " + " ".join(appended)

    return reply


class _SafeDict(dict):
    """安全字典，缺失的key返回空字符串而不是抛异常。"""
    def __missing__(self, key: str) -> str:
        return ""
