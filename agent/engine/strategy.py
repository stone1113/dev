from __future__ import annotations

import re
from typing import Optional

from models.action import AgentAction, StrategyRule, StrategyCondition
from models.intent import AgentPhase
from rules.strategy_rules import STRATEGY_RULES


def evaluate_strategy(
    message: str,
    phase: AgentPhase,
    intent_primary: str = "",
    intent_secondary: str = "",
    customer_level: Optional[str] = None,
    order_total: Optional[float] = None,
    has_order: bool = False,
) -> list[AgentAction]:
    """策略评估引擎。

    遍历所有策略规则，按优先级返回匹配的动作列表。
    """
    # 构建上下文字典，用于条件匹配
    context = {
        "message": message,
        "phase": phase,
        "intent_primary": intent_primary,
        "intent_secondary": intent_secondary,
        "customer_level": customer_level or "",
        "order_total": order_total or 0,
        "has_order": str(has_order).lower(),
    }

    # 过滤当前阶段的规则
    phase_rules = [r for r in STRATEGY_RULES if r.agent_phase == phase]

    # 按优先级降序排列
    phase_rules.sort(key=lambda r: r.priority, reverse=True)

    matched_actions: list[AgentAction] = []

    for rule in phase_rules:
        if _evaluate_conditions(rule.conditions, context):
            matched_actions.append(rule.action)

    return matched_actions


def _evaluate_conditions(
    conditions: list[StrategyCondition],
    context: dict,
) -> bool:
    """评估一组条件（全部满足才返回True）。"""
    return all(_evaluate_single(cond, context) for cond in conditions)


def _evaluate_single(condition: StrategyCondition, context: dict) -> bool:
    """评估单个条件。"""
    field_value = context.get(condition.field, "")
    target = condition.value
    op = condition.operator

    if op == "eq":
        return str(field_value) == str(target)
    elif op == "ne":
        return str(field_value) != str(target)
    elif op == "gt":
        try:
            return float(field_value) > float(target)
        except (ValueError, TypeError):
            return False
    elif op == "lt":
        try:
            return float(field_value) < float(target)
        except (ValueError, TypeError):
            return False
    elif op == "contains":
        return str(target).lower() in str(field_value).lower()
    elif op == "matches":
        try:
            return bool(re.search(str(target), str(field_value), re.IGNORECASE))
        except re.error:
            return False
    elif op == "in":
        if isinstance(target, list):
            return str(field_value) in target
        return False

    return False
