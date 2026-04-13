from __future__ import annotations
from pydantic import BaseModel, Field

from .intent import AgentPhase


class EntityExtractionRule(BaseModel):
    entity_type: str
    patterns: list[str]
    normalize_map: dict[str, str] = Field(default_factory=dict)


class QueryRewriteRule(BaseModel):
    id: str
    agent_phase: AgentPhase
    patterns: list[str]
    rewrite_template: str
    entity_extraction: list[EntityExtractionRule] = Field(default_factory=list)
