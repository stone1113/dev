"""
指代消解模块
从历史对话中追踪实体，将"这款"、"那个"等指代词解析为具体实体
"""
from __future__ import annotations


# 指代词列表
COREFERENCE_PATTERNS = [
    "这款", "那款", "这个", "那个", "它", "这条", "那条",
    "这件", "那件", "上面那个", "刚才那个", "之前那个",
]


def resolve_coreference(message: str, history: list[str]) -> tuple[str, dict[str, str]]:
    """
    指代消解：从历史对话中提取实体，替换当前消息中的指代词

    Args:
        message: 当前用户消息
        history: 历史对话列表（最近的在前）

    Returns:
        (resolved_message, context_entities): 消解后的消息和上下文实体
    """
    # 检查是否包含指代词
    has_coreference = any(pattern in message for pattern in COREFERENCE_PATTERNS)
    if not has_coreference or not history:
        return message, {}

    # 从历史中提取实体
    context_entities = _extract_entities_from_history(history)
    if not context_entities:
        return message, {}

    # 替换指代词
    resolved = message
    for pattern in COREFERENCE_PATTERNS:
        if pattern in resolved and context_entities:
            # 使用最近提到的产品替换指代词
            product = context_entities.get("product", "")
            if product:
                resolved = resolved.replace(pattern, product)
                break

    return resolved, context_entities


def _extract_entities_from_history(history: list[str]) -> dict[str, str]:
    """从历史对话中提取实体（产品、尺寸、材质等）"""
    entities: dict[str, str] = {}

    # 产品关键词
    products = [
        "love手镯", "love bracelet", "四叶草", "alhambra", "clover",
        "juste un clou", "钉子", "蛇骨", "serpenti",
        "手链", "手镯", "项链", "戒指", "耳环",
    ]

    # 材质关键词
    materials = ["14K", "18K", "925银", "纯银", "玫瑰金", "黄金", "白金"]

    # 尺寸关键词
    sizes = ["15cm", "16cm", "17cm", "18cm", "19cm", "40cm", "42cm", "45cm", "50cm"]

    # 从最近的对话开始查找（最多查看最近5条）
    for msg in history[:5]:
        msg_lower = msg.lower()

        # 提取产品
        if not entities.get("product"):
            for prod in products:
                if prod.lower() in msg_lower:
                    entities["product"] = prod
                    break

        # 提取材质
        if not entities.get("material"):
            for mat in materials:
                if mat in msg:
                    entities["material"] = mat
                    break

        # 提取尺寸
        if not entities.get("size"):
            for size in sizes:
                if size in msg:
                    entities["size"] = size
                    break

        # 如果都找到了就停止
        if entities.get("product") and entities.get("material") and entities.get("size"):
            break

    return entities
