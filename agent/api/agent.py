import time
from fastapi import APIRouter

import config
from models.request import (
    AnalyzeRequest, AnalyzeResponse, NodeTrace,
    ClassifyRequest, ClassifyResponse,
    RewriteRequest, RewriteResponse,
    StrategyRequest, StrategyResponse,
    TagRequest, TagResponse,
)
from engine.router import route_phase
from engine.classifier import classify_intent, needs_llm_fallback
from engine.rewriter import rewrite_query
from engine.strategy import evaluate_strategy
from engine.tagger import tag_session
from engine.replier import generate_template_reply
from llm.client import LLMClient

router = APIRouter(prefix="/api/agent", tags=["agent"])

# 全局LLM客户端实例
_llm_client: LLMClient | None = None


def _get_llm_client() -> LLMClient:
    global _llm_client
    if _llm_client is None:
        _llm_client = LLMClient()
    return _llm_client


def _trace(node: str, label: str, inp: dict, out: dict, t0: float) -> NodeTrace:
    return NodeTrace(node=node, label=label, input=inp, output=out, duration_ms=round((time.perf_counter() - t0) * 1000, 2))


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest):
    """完整分析：阶段路由 → 意图识别 → Query改写 → 策略评估 → 会话打标。"""
    trace: list[NodeTrace] = []

    # 1. 阶段路由
    t0 = time.perf_counter()
    phase = route_phase(req.orders)
    trace.append(_trace("phase_router", "阶段路由", {
        "orders": [o.model_dump() for o in req.orders],
    }, {"phase": phase}, t0))

    # 2. 意图识别（规则优先）
    t0 = time.perf_counter()
    intent = classify_intent(req.message, phase, req.history)
    trace.append(_trace("intent_classifier", "意图识别", {
        "message": req.message, "phase": phase, "history_len": len(req.history),
    }, {
        "primary_intent": intent.primary_intent,
        "secondary_intent": intent.secondary_intent,
        "confidence": intent.confidence,
    }, t0))

    # 3. LLM兜底（置信度低时）
    t0 = time.perf_counter()
    llm_triggered = False
    if needs_llm_fallback(intent) and config.LLM_FALLBACK_ENABLED:
        try:
            llm = _get_llm_client()
            intent = await llm.classify_intent(req.message, phase, req.history)
            llm_triggered = True
        except Exception:
            pass
    trace.append(_trace("llm_fallback", "LLM 兜底", {
        "confidence": intent.confidence,
        "threshold": 0.3,
        "llm_enabled": config.LLM_FALLBACK_ENABLED,
    }, {
        "triggered": llm_triggered,
        "primary_intent": intent.primary_intent,
        "confidence": intent.confidence,
    }, t0))

    # 4. Query改写 + 实体提取 + 指代消解
    t0 = time.perf_counter()
    rewritten, entities = rewrite_query(req.message, phase, req.history)
    intent.rewritten_query = rewritten
    intent.extracted_entities = {**intent.extracted_entities, **entities}
    trace.append(_trace("query_rewriter", "Query 改写", {
        "message": req.message, "phase": phase,
    }, {
        "rewritten_query": rewritten,
        "extracted_entities": entities,
    }, t0))

    # 5. 策略评估
    t0 = time.perf_counter()
    max_order_total = max((o.total for o in req.orders), default=0)
    actions = evaluate_strategy(
        message=req.message,
        phase=phase,
        intent_primary=intent.primary_intent,
        intent_secondary=intent.secondary_intent,
        customer_level=req.customer_level,
        order_total=max_order_total if max_order_total > 0 else None,
        has_order=len(req.orders) > 0,
    )
    trace.append(_trace("strategy_eval", "策略评估", {
        "phase": phase,
        "primary_intent": intent.primary_intent,
        "customer_level": req.customer_level,
        "order_total": max_order_total if max_order_total > 0 else None,
    }, {
        "actions": [a.model_dump() for a in actions],
    }, t0))

    # 6. 会话打标
    t0 = time.perf_counter()
    labels = tag_session(phase, intent.primary_intent, intent.secondary_intent)
    trace.append(_trace("session_tagger", "会话打标", {
        "phase": phase,
        "primary_intent": intent.primary_intent,
        "secondary_intent": intent.secondary_intent,
    }, {
        "labels": labels.model_dump() if hasattr(labels, 'model_dump') else dict(labels),
    }, t0))

    # 7. 知识库查询
    t0 = time.perf_counter()
    from knowledge import find_product_by_entities, get_logistics_for_region, get_policy
    kb_result = {}

    product = find_product_by_entities(intent.extracted_entities)
    if product:
        kb_result["product"] = {
            "name": product["name_zh"],
            "brand": product["brand"],
            "materials": product["materials"],
            "sizes": product["sizes"],
            "price_range": product.get("price_range", {}),
        }

    logistics = get_logistics_for_region()
    kb_result["logistics"] = {
        "origin": logistics["origin"],
        "carrier": logistics["carrier_name"],
        "eta": logistics["eta"],
    }

    kb_result["policies"] = {
        "return": get_policy("return_policy"),
        "quality_issue": get_policy("quality_issue"),
        "warranty": get_policy("warranty"),
    }
    trace.append(_trace("knowledge_base", "知识库查询", {
        "entities": intent.extracted_entities,
    }, kb_result, t0))

    # 8. 构建订单上下文
    order_info = {}
    if req.orders:
        first_order = req.orders[0]
        order_info = {
            "order_id": first_order.order_number,
            "status": first_order.status,
            "total": first_order.total,
        }

    # 9. 生成回复
    t0 = time.perf_counter()
    reply = generate_template_reply(
        phase,
        intent.primary_intent,
        intent.secondary_intent,
        entities=intent.extracted_entities,
        order_info=order_info,
        message=req.message,
    )
    reply_source = "template"

    if config.LLM_FALLBACK_ENABLED and needs_llm_fallback(intent):
        try:
            llm = _get_llm_client()
            llm_reply = await llm.generate_reply(
                req.message, phase, intent.primary_intent, intent.secondary_intent,
                entities=intent.extracted_entities,
            )
            if llm_reply:
                reply = llm_reply
                reply_source = "llm"
        except Exception:
            pass
    trace.append(_trace("reply_generator", "回复生成", {
        "phase": phase,
        "primary_intent": intent.primary_intent,
        "secondary_intent": intent.secondary_intent,
        "entities": intent.extracted_entities,
    }, {
        "reply": reply[:100] + ("..." if len(reply) > 100 else ""),
        "source": reply_source,
    }, t0))

    return AnalyzeResponse(
        phase=phase,
        intent=intent,
        actions=actions,
        session_labels=labels,
        knowledge_base=kb_result,
        reply=reply,
        reply_source=reply_source,
        pipeline_trace=trace,
    )


@router.post("/classify", response_model=ClassifyResponse)
async def classify(req: ClassifyRequest):
    """仅意图识别。"""
    phase = req.phase or "pre_sales"
    intent = classify_intent(req.message, phase, req.history)

    if needs_llm_fallback(intent) and config.LLM_FALLBACK_ENABLED:
        try:
            llm = _get_llm_client()
            intent = await llm.classify_intent(req.message, phase, req.history)
        except Exception:
            pass

    return ClassifyResponse(intent=intent)


@router.post("/rewrite", response_model=RewriteResponse)
async def rewrite(req: RewriteRequest):
    """仅Query改写。"""
    rewritten, entities = rewrite_query(req.message, req.phase)
    return RewriteResponse(rewritten_query=rewritten, extracted_entities=entities)


@router.post("/strategy", response_model=StrategyResponse)
async def strategy(req: StrategyRequest):
    """仅策略评估。"""
    actions = evaluate_strategy(
        message=req.message,
        phase=req.phase,
        intent_primary=req.intent_primary,
        intent_secondary=req.intent_secondary,
        customer_level=req.customer_level,
        order_total=req.order_total,
        has_order=req.has_order,
    )
    return StrategyResponse(actions=actions)


@router.post("/tag", response_model=TagResponse)
async def tag(req: TagRequest):
    """仅自动打标。"""
    labels = tag_session(req.phase, req.intent_primary, req.intent_secondary)
    return TagResponse(session_labels=labels)
