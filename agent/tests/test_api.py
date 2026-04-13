import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from httpx import AsyncClient, ASGITransport

from main import app


@pytest.mark.asyncio
async def test_health():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"


@pytest.mark.asyncio
async def test_analyze_pre_sales():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/agent/analyze", json={
            "message": "这个VCA手链多少钱",
            "orders": [],
        })
    assert resp.status_code == 200
    data = resp.json()
    assert data["phase"] == "pre_sales"
    assert data["intent"]["primary_intent"] == "PRODUCT_INQUIRY"


@pytest.mark.asyncio
async def test_analyze_in_sales():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/agent/analyze", json={
            "message": "我的快递到哪了",
            "orders": [{"order_number": "ORD001", "status": "shipped", "total": 3000}],
        })
    assert resp.status_code == 200
    data = resp.json()
    assert data["phase"] == "in_sales"


@pytest.mark.asyncio
async def test_analyze_after_sales():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/agent/analyze", json={
            "message": "我要退货",
            "orders": [{"order_number": "ORD002", "status": "delivered", "total": 2000}],
        })
    assert resp.status_code == 200
    data = resp.json()
    assert data["phase"] == "after_sales"


@pytest.mark.asyncio
async def test_classify():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/agent/classify", json={
            "message": "卡地亚戒指有现货吗",
            "phase": "pre_sales",
        })
    assert resp.status_code == 200
    data = resp.json()
    assert "intent" in data


@pytest.mark.asyncio
async def test_rewrite():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/agent/rewrite", json={
            "message": "VCA手链多少钱",
            "phase": "pre_sales",
        })
    assert resp.status_code == 200
    data = resp.json()
    assert "rewritten_query" in data


@pytest.mark.asyncio
async def test_strategy():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/agent/strategy", json={
            "message": "转人工",
            "phase": "pre_sales",
            "intent_primary": "SERVICE_INQUIRY",
            "intent_secondary": "contact_human",
        })
    assert resp.status_code == 200
    data = resp.json()
    assert "actions" in data


@pytest.mark.asyncio
async def test_tag():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.post("/api/agent/tag", json={
            "message": "查看订单",
            "phase": "in_sales",
            "intent_primary": "ORDER_STATUS",
            "intent_secondary": "order_tracking",
        })
    assert resp.status_code == 200
    data = resp.json()
    assert "session_labels" in data


@pytest.mark.asyncio
async def test_get_intents():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/rules/intents")
    assert resp.status_code == 200
    data = resp.json()
    assert "pre_sales" in data
    assert "in_sales" in data
    assert "after_sales" in data


@pytest.mark.asyncio
async def test_get_strategies():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/rules/strategies")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 62
