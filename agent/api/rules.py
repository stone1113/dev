from fastapi import APIRouter

from models.intent import AgentPhase
from rules.intent_trees import PRE_SALES_TREE, IN_SALES_TREE, AFTER_SALES_TREE
from rules.strategy_rules import STRATEGY_RULES
from rules.rewrite_rules import REWRITE_RULES, ENTITY_NORMALIZATION
from engine.replier import _REPLY_TEMPLATES, _DEFAULT_REPLIES
from llm.prompts import build_classify_prompt, build_reply_prompt
from knowledge import PRODUCTS, LOGISTICS, POLICIES, FAQ

router = APIRouter(prefix="/api/rules", tags=["rules"])


@router.get("/intents")
async def get_intent_trees(phase: AgentPhase | None = None):
    """获取意图分类树。"""
    trees = {
        "pre_sales": PRE_SALES_TREE,
        "in_sales": IN_SALES_TREE,
        "after_sales": AFTER_SALES_TREE,
    }
    if phase:
        return {phase: trees[phase].model_dump()}
    return {k: v.model_dump() for k, v in trees.items()}


@router.get("/strategies")
async def get_strategy_rules(
    phase: AgentPhase | None = None,
    strategy_type: str | None = None,
):
    """获取策略规则。"""
    rules = STRATEGY_RULES
    if phase:
        rules = [r for r in rules if r.agent_phase == phase]
    if strategy_type:
        rules = [r for r in rules if r.strategy_type == strategy_type]
    return {"total": len(rules), "rules": [r.model_dump() for r in rules]}


@router.get("/rewrites")
async def get_rewrite_rules(phase: AgentPhase | None = None):
    """获取Query改写规则和实体归一化词典。"""
    rules = REWRITE_RULES
    if phase:
        rules = [r for r in rules if r.phase == phase]
    return {
        "total": len(rules),
        "rules": [r.model_dump() for r in rules],
        "entity_normalization": ENTITY_NORMALIZATION,
    }


@router.get("/replies")
async def get_reply_templates(phase: AgentPhase | None = None):
    """获取回复模板。"""
    templates = _REPLY_TEMPLATES
    if phase:
        templates = {phase: templates.get(phase, {})}
    return {
        "templates": templates,
        "defaults": _DEFAULT_REPLIES,
    }


@router.get("/prompts")
async def get_prompts(phase: AgentPhase = "pre_sales"):
    """查看LLM提示词模板（传入示例消息预览实际提示词）。"""
    sample_msg = "这个VCA手链多少钱"
    return {
        "phase": phase,
        "classify_prompt": build_classify_prompt(sample_msg, phase, None),
        "reply_prompt": build_reply_prompt(sample_msg, phase, "PRODUCT_INQUIRY", "price_inquiry"),
    }


@router.get("/knowledge")
async def get_knowledge_base():
    """获取知识库内容（产品、物流、政策、FAQ）。"""
    return {
        "products": PRODUCTS,
        "logistics": LOGISTICS,
        "policies": POLICIES,
        "faq": FAQ,
        "stats": {
            "product_count": len(PRODUCTS),
            "faq_count": len(FAQ),
            "policy_count": len(POLICIES),
            "carrier_count": len(LOGISTICS.get("carriers", {})),
            "region_count": len(LOGISTICS.get("regions", {})),
        },
    }
