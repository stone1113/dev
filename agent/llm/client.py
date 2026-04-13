from __future__ import annotations

import json
import logging
from typing import Optional

import httpx

import config
from models.intent import AgentPhase, IntentResult
from .prompts import build_classify_prompt, build_reply_prompt

logger = logging.getLogger(__name__)


class LLMClient:
    """DeepSeek API 异步客户端（OpenAI兼容格式）。"""

    def __init__(
        self,
        api_key: str | None = None,
        api_url: str | None = None,
        model: str | None = None,
    ):
        self.api_key = api_key or config.DEEPSEEK_API_KEY
        self.api_url = api_url or config.DEEPSEEK_API_URL
        self.model = model or config.DEEPSEEK_MODEL
        self._client: httpx.AsyncClient | None = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(timeout=30.0)
        return self._client

    async def close(self) -> None:
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    async def _chat(self, system_prompt: str, user_message: str) -> str:
        """调用LLM Chat API。"""
        client = await self._get_client()
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            "temperature": 0.3,
            "max_tokens": 1024,
        }

        try:
            response = await client.post(self.api_url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"].strip()
        except httpx.HTTPStatusError as e:
            logger.error("LLM API HTTP error: %s %s", e.response.status_code, e.response.text)
            raise
        except Exception as e:
            logger.error("LLM API error: %s", e)
            raise

    async def classify_intent(
        self,
        message: str,
        phase: AgentPhase,
        history: Optional[list[str]] = None,
    ) -> IntentResult:
        """使用LLM进行意图分类（兜底）。"""
        prompt = build_classify_prompt(message, phase, history)
        raw = await self._chat(prompt, message)

        try:
            # 提取JSON（处理可能的markdown代码块包裹）
            json_str = raw
            if "```" in raw:
                json_str = raw.split("```")[1]
                if json_str.startswith("json"):
                    json_str = json_str[4:]
            parsed = json.loads(json_str.strip())

            return IntentResult(
                agent_phase=phase,
                primary_intent=parsed.get("primary_intent", "UNKNOWN"),
                secondary_intent=parsed.get("secondary_intent", "general_inquiry"),
                confidence=min(float(parsed.get("confidence", 0.5)), 1.0),
                rewritten_query=message,
                extracted_entities=parsed.get("extracted_entities", {}),
            )
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            logger.warning("Failed to parse LLM response: %s, raw: %s", e, raw)
            return IntentResult(
                agent_phase=phase,
                primary_intent="UNKNOWN",
                secondary_intent="general_inquiry",
                confidence=0.2,
                rewritten_query=message,
            )

    async def generate_reply(
        self,
        message: str,
        phase: AgentPhase,
        intent_primary: str,
        intent_secondary: str,
        entities: dict[str, str] | None = None,
    ) -> str:
        """使用LLM生成客服回复。"""
        prompt = build_reply_prompt(message, phase, intent_primary, intent_secondary, entities)
        return await self._chat(prompt, message)
