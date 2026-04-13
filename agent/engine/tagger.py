from __future__ import annotations

from typing import Optional

from models.intent import AgentPhase, IntentResult
from models.profile import SessionLabels


def tag_session(
    phase: AgentPhase,
    intent_primary: str,
    intent_secondary: str,
) -> SessionLabels:
    """根据意图结果自动生成会话标签。"""
    labels = SessionLabels()

    if phase == "pre_sales":
        labels.pre_sales_stage = _map_pre_sales_stage(intent_primary, intent_secondary)
        labels.pre_sales_result = _map_pre_sales_result(intent_secondary)
        labels.upsell_attempt = _map_upsell_attempt(intent_primary, intent_secondary)

    elif phase == "in_sales":
        labels.order_stage = _map_order_stage(intent_primary, intent_secondary)
        labels.issue_type = _map_issue_type(intent_primary, intent_secondary)
        labels.cross_sell_result = _map_cross_sell(intent_primary, intent_secondary)

    elif phase == "after_sales":
        labels.session_type = _map_session_type(intent_primary, intent_secondary)
        labels.resolution_status = _map_resolution_status(intent_primary, intent_secondary)
        labels.compensation_measure = _map_compensation(intent_primary, intent_secondary)

    return labels


# ── 售前标签映射 ──

def _map_pre_sales_stage(primary: str, secondary: str) -> str:
    stage_map = {
        "PRODUCT_INQUIRY": "awareness",
        "PURCHASE_INTENT": "consideration",
        "SHIPPING_INQUIRY": "evaluation",
        "PAYMENT_INQUIRY": "evaluation",
        "PROMOTION_INQUIRY": "decision",
        "SERVICE_INQUIRY": "evaluation",
    }
    base = stage_map.get(primary, "awareness")
    # 购买意向中的 ready_to_buy 直接进入决策阶段
    if secondary == "ready_to_buy":
        return "decision"
    if secondary == "hesitation":
        return "consideration"
    return base


def _map_pre_sales_result(secondary: str) -> str:
    result_map = {
        "ready_to_buy": "high_intent",
        "gift_purchase": "high_intent",
        "urgency_purchase": "high_intent",
        "bulk_purchase": "high_intent",
        "hesitation": "nurturing",
        "budget_concern": "nurturing",
        "product_comparison": "evaluating",
    }
    return result_map.get(secondary, "browsing")


def _map_upsell_attempt(primary: str, secondary: str) -> str:
    if secondary in ("product_comparison", "collection_inquiry"):
        return "cross_sell_opportunity"
    if secondary in ("gift_purchase", "bulk_purchase"):
        return "upsell_opportunity"
    if secondary == "bundle_deal":
        return "bundle_opportunity"
    return "none"


# ── 售中标签映射 ──

def _map_order_stage(primary: str, secondary: str) -> str:
    stage_map = {
        "ORDER_STATUS": "tracking",
        "ORDER_MODIFICATION": "modification",
        "PAYMENT_ISSUE": "payment",
        "QUALITY_CHECK": "quality_check",
        "CUSTOMS_LOGISTICS": "logistics",
        "COMMUNICATION": "communication",
    }
    return stage_map.get(primary, "processing")


def _map_issue_type(primary: str, secondary: str) -> str:
    if primary == "PAYMENT_ISSUE":
        return f"payment_{secondary}"
    if primary == "ORDER_MODIFICATION":
        return f"order_{secondary}"
    if primary == "CUSTOMS_LOGISTICS":
        return f"logistics_{secondary}"
    if secondary in ("shipping_delay", "qc_issue", "urgent_matter"):
        return secondary
    return "general"


def _map_cross_sell(primary: str, secondary: str) -> str:
    if secondary in ("order_confirmation", "qc_request", "payment_confirmation"):
        return "opportunity"
    if secondary == "change_quantity":
        return "active"
    return "none"


# ── 售后标签映射 ──

def _map_session_type(primary: str, secondary: str) -> str:
    type_map = {
        "RETURN_REFUND": "return_refund",
        "COMPLAINT": "complaint",
        "REPAIR_MAINTENANCE": "repair",
        "COMPENSATION": "compensation",
        "REPURCHASE": "repurchase",
        "FEEDBACK": "feedback",
    }
    return type_map.get(primary, "general")


def _map_resolution_status(primary: str, secondary: str) -> str:
    # 投诉升级 → 未解决
    if secondary == "escalation":
        return "unresolved_escalated"
    # 退款进度查询 → 处理中
    if secondary == "refund_status":
        return "in_progress"
    # 好评 → 已解决
    if secondary == "positive_feedback":
        return "resolved_satisfied"
    # 差评 → 未解决
    if secondary == "negative_feedback":
        return "unresolved"
    return "pending"


def _map_compensation(primary: str, secondary: str) -> str:
    if primary == "COMPENSATION":
        comp_map = {
            "price_adjustment": "price_match",
            "goodwill_gesture": "goodwill",
            "free_shipping_return": "free_return",
        }
        return comp_map.get(secondary, "pending_review")
    return "none"
