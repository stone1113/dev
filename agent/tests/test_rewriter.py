import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from engine.rewriter import rewrite_query


class TestRewriter:
    def test_price_rewrite(self):
        rewritten, entities = rewrite_query("VCA手链多少钱", "pre_sales")
        assert "价格" in rewritten
        assert entities.get("brand") == "Van Cleef & Arpels" or entities.get("product_type") == "bracelet"

    def test_entity_normalization_brand(self):
        rewritten, entities = rewrite_query("卡地亚戒指多少钱", "pre_sales")
        assert entities.get("brand") == "Cartier"

    def test_entity_normalization_product(self):
        rewritten, entities = rewrite_query("项链多少钱", "pre_sales")
        assert entities.get("product_type") == "necklace"

    def test_material_inquiry(self):
        rewritten, entities = rewrite_query("这个手链是什么材质", "pre_sales")
        assert "材质" in rewritten

    def test_no_match_returns_original(self):
        rewritten, entities = rewrite_query("你好", "pre_sales")
        assert rewritten == "你好"
        assert entities == {}

    def test_in_sales_tracking(self):
        rewritten, entities = rewrite_query("我的订单到哪了", "in_sales")
        assert "物流" in rewritten or "订单" in rewritten

    def test_after_sales_return(self):
        rewritten, entities = rewrite_query("我要退货", "after_sales")
        assert "退货" in rewritten
