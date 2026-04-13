from __future__ import annotations

from models.intent import AgentPhase
from models.request import OrderInfo


def route_phase(orders: list[OrderInfo]) -> AgentPhase:
    """根据订单状态路由到对应的Agent阶段。

    规则：
    - 有活跃订单（pending/processing/shipped）→ 售中
    - 有已完成订单（delivered/cancelled/refunded）但无活跃订单 → 售后
    - 无订单 → 售前
    """
    active_statuses = {"pending", "processing", "shipped"}
    completed_statuses = {"delivered", "cancelled", "refunded"}

    has_active = any(o.status in active_statuses for o in orders)
    has_completed = any(o.status in completed_statuses for o in orders)

    if has_active:
        return "in_sales"
    if has_completed:
        return "after_sales"
    return "pre_sales"
