from __future__ import annotations

import re

from models.intent import AgentPhase
from models.query import QueryRewriteRule
from rules.rewrite_rules import REWRITE_RULES, ENTITY_NORMALIZATION
from engine.coreference import resolve_coreference


def rewrite_query(
    message: str,
    phase: AgentPhase,
    history: list[str] | None = None,
) -> tuple[str, dict[str, str]]:
    """Query改写 + 实体提取归一化 + 指代消解。

    返回 (改写后的query, 提取到的实体字典)。
    """
    # 1. 指代消解（将"这款"、"那个"等替换为具体实体）
    history = history or []
    resolved_message, context_entities = resolve_coreference(message, history)

    # 2. 过滤当前阶段的规则
    phase_rules = [r for r in REWRITE_RULES if r.agent_phase == phase]

    for rule in phase_rules:
        matched = False
        for pattern in rule.patterns:
            if re.search(pattern, resolved_message, re.IGNORECASE):
                matched = True
                break

        if not matched:
            continue

        # 实体提取（从消解后的消息中提取）
        entities = _extract_entities(resolved_message, rule)

        # 合并上下文实体（指代消解提取的实体）
        entities = {**context_entities, **entities}

        # 构建改写后的query
        rewritten = rule.rewrite_template
        for entity_type, entity_value in entities.items():
            rewritten = rewritten.replace(f"{{{entity_type}}}", entity_value)
        # 清理未替换的占位符
        rewritten = re.sub(r"\{[^}]+\}", "", rewritten).strip()

        return rewritten, entities

    # 没有匹配到任何规则，返回消解后的消息和上下文实体
    return resolved_message, context_entities


def _extract_entities(message: str, rule: QueryRewriteRule) -> dict[str, str]:
    """从消息中提取实体并进行归一化。"""
    entities: dict[str, str] = {}
    msg_lower = message.lower()

    for extraction in rule.entity_extraction:
        entity_type = extraction.entity_type

        for pattern in extraction.patterns:
            match = re.search(pattern, msg_lower, re.IGNORECASE)
            if match:
                raw_value = match.group(0).strip().lower()
                # 归一化
                normalized = _normalize_entity(entity_type, raw_value)
                entities[entity_type] = normalized
                break

    return entities


def _normalize_entity(entity_type: str, raw_value: str) -> str:
    """使用归一化词典标准化实体值。"""
    norm_map = ENTITY_NORMALIZATION.get(entity_type, {})
    return norm_map.get(raw_value, raw_value)
