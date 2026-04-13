from __future__ import annotations

import re
from typing import Optional

from models.intent import AgentPhase, IntentResult, IntentTreeNode
from rules.intent_trees import get_tree_by_phase


def classify_intent(
    message: str,
    phase: AgentPhase,
    history: Optional[list[str]] = None,
) -> IntentResult:
    """基于规则的意图识别引擎。

    遍历意图树，通过关键词匹配找到最佳意图。
    返回置信度：匹配命中关键词数 / 总关键词数。
    """
    tree = get_tree_by_phase(phase)
    msg_lower = message.lower()

    best_primary = ""
    best_secondary = ""
    best_confidence = 0.0
    best_primary_node_id = ""

    for primary_node in tree.children:
        for secondary_node in primary_node.children:
            if not secondary_node.keywords:
                continue
            hits = sum(1 for kw in secondary_node.keywords if kw.lower() in msg_lower)
            if hits == 0:
                continue
            confidence = hits / len(secondary_node.keywords)
            # 加权：匹配越多关键词，置信度越高
            confidence = min(confidence * 1.5, 1.0)
            if confidence > best_confidence:
                best_confidence = confidence
                best_primary = primary_node.id
                best_primary_node_id = primary_node.id
                best_secondary = secondary_node.id

    # 如果没有匹配到任何意图，使用默认值
    if not best_primary:
        best_primary = tree.children[0].id if tree.children else "UNKNOWN"
        best_secondary = "general_inquiry"
        best_confidence = 0.1

    return IntentResult(
        agent_phase=phase,
        primary_intent=best_primary,
        secondary_intent=best_secondary,
        confidence=round(best_confidence, 3),
        rewritten_query=message,
        extracted_entities={},
    )


def needs_llm_fallback(result: IntentResult, threshold: float = 0.3) -> bool:
    """判断是否需要LLM兜底"""
    return result.confidence < threshold
