from __future__ import annotations
from typing import Literal, Optional, Union
from pydantic import BaseModel, Field

from .intent import AgentPhase


class AgentAction(BaseModel):
    type: Literal["auto_reply", "transfer_human", "block", "marketing_trigger", "escalate"]
    reason: str
    priority: Literal["low", "medium", "high", "urgent"]
    metadata: Optional[dict] = None


class StrategyCondition(BaseModel):
    field: str
    operator: Literal["eq", "ne", "gt", "lt", "contains", "matches", "in"]
    value: Union[str, int, float, list[str]]


class StrategyRule(BaseModel):
    id: str
    agent_phase: AgentPhase
    strategy_type: Literal["transfer_human", "block_spam", "marketing_conversion"]
    conditions: list[StrategyCondition]
    action: AgentAction
    priority: int = 0
