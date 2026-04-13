import sys
import os

# 让测试能找到项目根目录的模块
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from engine.classifier import classify_intent, needs_llm_fallback


class TestClassifier:
    def test_price_inquiry(self):
        result = classify_intent("这个VCA手链多少钱", "pre_sales")
        assert result.agent_phase == "pre_sales"
        assert result.primary_intent == "PRODUCT_INQUIRY"
        assert result.secondary_intent == "price_inquiry"
        assert result.confidence > 0.1

    def test_ready_to_buy(self):
        result = classify_intent("我要买这个，下单吧", "pre_sales")
        assert result.primary_intent == "PURCHASE_INTENT"
        assert result.secondary_intent == "ready_to_buy"

    def test_order_tracking(self):
        result = classify_intent("我的快递到哪了", "in_sales")
        assert result.primary_intent == "ORDER_STATUS"
        assert result.secondary_intent == "order_tracking"

    def test_return_request(self):
        result = classify_intent("我要退货，不想要了", "after_sales")
        assert result.primary_intent == "RETURN_REFUND"
        assert result.secondary_intent == "return_request"

    def test_complaint(self):
        result = classify_intent("我要投诉，质量太差了", "after_sales")
        assert result.primary_intent == "COMPLAINT"
        assert result.secondary_intent == "product_complaint"

    def test_low_confidence_needs_llm(self):
        result = classify_intent("嗯嗯好的", "pre_sales")
        assert needs_llm_fallback(result, threshold=0.3)

    def test_high_confidence_no_llm(self):
        result = classify_intent("这个手链多少钱，价格是多少", "pre_sales")
        assert not needs_llm_fallback(result, threshold=0.1)
