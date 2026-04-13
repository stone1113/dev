from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field

from .intent import AgentPhase, IntentResult
from .action import AgentAction
from .profile import SessionLabels


class OrderInfo(BaseModel):
    order_number: str = ""
    status: str = ""  # pending, processing, shipped, delivered, cancelled, refunded
    total: float = 0.0


class AnalyzeRequest(BaseModel):
    message: str
    orders: list[OrderInfo] = Field(default_factory=list)
    customer_level: Optional[str] = None
    history: list[str] = Field(default_factory=list)  # 历史消息


class NodeTrace(BaseModel):
    """工作流节点追踪信息"""
    node: str  # 节点名称
    label: str = ""  # 中文标签
    input: dict = Field(default_factory=dict)
    output: dict = Field(default_factory=dict)
    duration_ms: float = 0.0


class AnalyzeResponse(BaseModel):
    phase: AgentPhase
    intent: IntentResult
    actions: list[AgentAction] = Field(default_factory=list)
    session_labels: SessionLabels = Field(default_factory=SessionLabels)
    knowledge_base: dict = Field(default_factory=dict)  # 知识库查询结果
    reply: str = ""  # AI生成的回复内容
    reply_source: str = ""  # 回复来源: "template" | "llm"
    pipeline_trace: list[NodeTrace] = Field(default_factory=list)  # 工作流追踪


class ClassifyRequest(BaseModel):
    message: str
    phase: Optional[AgentPhase] = None
    history: list[str] = Field(default_factory=list)


class ClassifyResponse(BaseModel):
    intent: IntentResult


class RewriteRequest(BaseModel):
    message: str
    phase: AgentPhase = "pre_sales"


class RewriteResponse(BaseModel):
    rewritten_query: str
    extracted_entities: dict[str, str] = Field(default_factory=dict)


class StrategyRequest(BaseModel):
    message: str
    phase: AgentPhase
    intent_primary: str = ""
    intent_secondary: str = ""
    customer_level: Optional[str] = None
    order_total: Optional[float] = None
    has_order: bool = False


class StrategyResponse(BaseModel):
    actions: list[AgentAction] = Field(default_factory=list)


class TagRequest(BaseModel):
    message: str
    phase: AgentPhase
    intent_primary: str = ""
    intent_secondary: str = ""


class TagResponse(BaseModel):
    session_labels: SessionLabels
