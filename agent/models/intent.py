from __future__ import annotations
from typing import Literal, Optional
from pydantic import BaseModel, Field

AgentPhase = Literal["pre_sales", "in_sales", "after_sales"]


class IntentTreeNode(BaseModel):
    id: str
    name: str
    name_zh: str
    children: list[IntentTreeNode] = Field(default_factory=list)
    keywords: list[str] = Field(default_factory=list)
    confidence: float = 0.0


class IntentResult(BaseModel):
    agent_phase: AgentPhase
    primary_intent: str
    secondary_intent: str
    tertiary_intent: Optional[str] = None
    confidence: float
    rewritten_query: str
    extracted_entities: dict[str, str] = Field(default_factory=dict)
    suggested_action: Optional["AgentAction"] = None


# 避免循环引用，延迟导入
from .action import AgentAction  # noqa: E402

IntentResult.model_rebuild()
