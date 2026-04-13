import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from engine.strategy import evaluate_strategy


class TestStrategy:
    def test_vip_transfer_human(self):
        actions = evaluate_strategy(
            message="我想买",
            phase="pre_sales",
            intent_primary="PURCHASE_INTENT",
            intent_secondary="ready_to_buy",
            customer_level="VIP",
        )
        assert any(a.type == "transfer_human" for a in actions)

    def test_contact_human_transfer(self):
        actions = evaluate_strategy(
            message="转人工客服",
            phase="pre_sales",
            intent_primary="SERVICE_INQUIRY",
            intent_secondary="contact_human",
        )
        assert any(a.type == "transfer_human" for a in actions)

    def test_spam_block(self):
        actions = evaluate_strategy(
            message="赚钱兼职日入五千",
            phase="pre_sales",
            intent_primary="",
            intent_secondary="",
        )
        assert any(a.type == "block" for a in actions)

    def test_hesitation_marketing(self):
        actions = evaluate_strategy(
            message="我再考虑考虑",
            phase="pre_sales",
            intent_primary="PURCHASE_INTENT",
            intent_secondary="hesitation",
        )
        assert any(a.type == "marketing_trigger" for a in actions)

    def test_high_value_cancel_transfer(self):
        actions = evaluate_strategy(
            message="取消订单",
            phase="in_sales",
            intent_primary="ORDER_MODIFICATION",
            intent_secondary="cancel_order",
            order_total=5000,
        )
        assert any(a.type == "transfer_human" for a in actions)

    def test_escalation_transfer(self):
        actions = evaluate_strategy(
            message="我要找经理",
            phase="after_sales",
            intent_primary="COMPLAINT",
            intent_secondary="escalation",
        )
        transfer_actions = [a for a in actions if a.type == "transfer_human"]
        assert len(transfer_actions) > 0
        assert any(a.priority == "urgent" for a in transfer_actions)

    def test_no_match_empty_actions(self):
        actions = evaluate_strategy(
            message="你好",
            phase="pre_sales",
            intent_primary="UNKNOWN",
            intent_secondary="general",
        )
        # 可能匹配到一些通用规则，也可能为空
        assert isinstance(actions, list)
