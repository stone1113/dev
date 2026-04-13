from __future__ import annotations
from typing import Optional
from pydantic import BaseModel


class AIProfile(BaseModel):
    # 基础
    customer_level: Optional[str] = None
    customer_type: Optional[str] = None
    intended_category: Optional[str] = None
    budget_range: Optional[str] = None
    purchase_urgency: Optional[str] = None
    inquiry_stage: Optional[str] = None
    decision_role: Optional[str] = None
    # 售前专属
    traffic_source: Optional[str] = None
    price_sensitivity: Optional[str] = None
    preferred_brand: Optional[str] = None
    preferred_material: Optional[str] = None
    preferred_category: Optional[str] = None
    bargain_style: Optional[str] = None
    decision_speed: Optional[str] = None
    trust_barrier: Optional[str] = None
    # 售中专属
    payment_behavior: Optional[str] = None
    qc_attitude: Optional[str] = None
    order_complexity: Optional[str] = None
    logistics_sensitivity: Optional[str] = None
    customs_risk_level: Optional[str] = None
    # 售后专属
    satisfaction_score: Optional[str] = None
    complaint_type: Optional[str] = None
    return_history: Optional[str] = None
    refund_resolution: Optional[str] = None
    vip_level: Optional[str] = None
    repurchase_probability: Optional[str] = None
    churn_risk: Optional[str] = None
    customer_lifetime_value: Optional[str] = None


class SessionLabels(BaseModel):
    # 售前
    pre_sales_stage: Optional[str] = None
    pre_sales_result: Optional[str] = None
    upsell_attempt: Optional[str] = None
    # 售中
    order_stage: Optional[str] = None
    issue_type: Optional[str] = None
    cross_sell_result: Optional[str] = None
    # 售后
    session_type: Optional[str] = None
    resolution_status: Optional[str] = None
    compensation_measure: Optional[str] = None
