import urllib.request
import json

# 10个多轮对话测试场景
test_scenarios = [
    # ===== 售前场景 =====
    {
        "name": "场景1：Love手镯价格+材质+尺寸咨询（3轮）",
        "conversations": [
            {"message": "你好，love手镯多少钱？", "orders": [], "history": []},
            {"message": "这款是什么材质的？", "orders": [], "history": ["客户：你好，love手镯多少钱？", "客服：亲爱的，这款LOVE手镯（Cartier）非常受欢迎"]},
            {"message": "我手腕16cm，应该选多大尺寸？", "orders": [], "history": ["客户：你好，love手镯多少钱？", "客服：价格方面：14K_Gold材质$45-75", "客户：这款是什么材质的？", "客服：我们有14K_Gold/18K_Gold等材质"]},
        ]
    },
    {
        "name": "场景2：四叶草项链+耳环对比咨询（4轮）",
        "conversations": [
            {"message": "有四叶草项链吗？", "orders": [], "history": []},
            {"message": "多少钱？", "orders": [], "history": ["客户：有四叶草项链吗？", "客服：这款四叶草项链（Van Cleef & Arpels）非常受欢迎"]},
            {"message": "耳环呢？也有四叶草的吗？", "orders": [], "history": ["客户：有四叶草项链吗？", "客服：有的", "客户：多少钱？", "客服：价格$65-180"]},
            {"message": "项链和耳环一起买有优惠吗？", "orders": [], "history": ["客户：有四叶草项链吗？", "客服：有", "客户：耳环呢？", "客服：四叶草耳环也有"]},
        ]
    },
    {
        "name": "场景3：真实性咨询+质检流程（3轮）",
        "conversations": [
            {"message": "你们的首饰是正品吗？", "orders": [], "history": []},
            {"message": "和专柜的一样吗？会不会褪色？", "orders": [], "history": ["客户：你们的首饰是正品吗？", "客服：亲，我们是1:1复刻的，相似度99%"]},
            {"message": "发货前能看质检照片吗？", "orders": [], "history": ["客户：你们的首饰是正品吗？", "客服：1:1复刻", "客户：会不会褪色？", "客服：保色约半年"]},
        ]
    },
    {
        "name": "场景4：Tiffany钥匙项链+定制刻字（4轮）",
        "conversations": [
            {"message": "tiffany钥匙项链有吗？", "orders": [], "history": []},
            {"message": "能刻字吗？", "orders": [], "history": ["客户：tiffany钥匙项链有吗？", "客服：这款钥匙项链（Tiffany & Co.）非常受欢迎"]},
            {"message": "刻字要加钱吗？多久能发货？", "orders": [], "history": ["客户：tiffany钥匙项链有吗？", "客服：有的", "客户：能刻字吗？", "客服：我们支持定制服务"]},
            {"message": "好的，我要18K金的，刻\"Forever\"", "orders": [], "history": ["客户：能刻字吗？", "客服：支持刻字", "客户：要加钱吗？", "客服：定制需要额外5-7个工作日"]},
        ]
    },
    {
        "name": "场景5：预算有限+推荐性价比款（3轮）",
        "conversations": [
            {"message": "想买个手镯送女朋友，预算100美元左右", "orders": [], "history": []},
            {"message": "love手镯在这个价位有吗？", "orders": [], "history": ["客户：预算100美元左右", "客服：我们有不同价位的产品可以选择"]},
            {"message": "那推荐哪个材质比较好？", "orders": [], "history": ["客户：预算100美元", "客服：有的", "客户：love手镯在这个价位有吗？", "客服：18K_Gold材质$85-150"]},
        ]
    },

    # ===== 售中场景 =====
    {
        "name": "场景6：订单确认+物流查询（3轮）",
        "conversations": [
            {"message": "我刚下单了，订单号CA12345", "orders": [{"order_number": "CA12345", "status": "pending", "total": 89.99}], "history": []},
            {"message": "什么时候发货？", "orders": [{"order_number": "CA12345", "status": "confirmed", "total": 89.99}], "history": ["客户：我刚下单了", "客服：您的订单已确认"]},
            {"message": "用什么快递？几天能到美国？", "orders": [{"order_number": "CA12345", "status": "confirmed", "total": 89.99}], "history": ["客户：什么时候发货？", "客服：我们会尽快安排生产和发货"]},
        ]
    },
    {
        "name": "场景7：地址错误+修改地址（3轮）",
        "conversations": [
            {"message": "我的订单地址填错了", "orders": [{"order_number": "CA12346", "status": "processing", "total": 129.99}], "history": []},
            {"message": "能改成纽约的地址吗？", "orders": [{"order_number": "CA12346", "status": "processing", "total": 129.99}], "history": ["客户：地址填错了", "客服：请把新的收货地址发给我"]},
            {"message": "123 Main St, New York, NY 10001", "orders": [{"order_number": "CA12346", "status": "processing", "total": 129.99}], "history": ["客户：能改地址吗？", "客服：如果包裹还未发出我马上帮您修改"]},
        ]
    },
    {
        "name": "场景8：物流延迟+催单（4轮）",
        "conversations": [
            {"message": "我的包裹怎么还没到？", "orders": [{"order_number": "CA12347", "status": "shipped", "total": 159.99, "tracking_no": "FX123456789"}], "history": []},
            {"message": "物流单号是多少？", "orders": [{"order_number": "CA12347", "status": "shipped", "total": 159.99, "tracking_no": "FX123456789"}], "history": ["客户：包裹还没到", "客服：我帮您查询了物流信息"]},
            {"message": "已经15天了，还在清关吗？", "orders": [{"order_number": "CA12347", "status": "shipped", "total": 159.99, "tracking_no": "FX123456789"}], "history": ["客户：物流单号是多少？", "客服：物流单号：FX123456789"]},
            {"message": "能催一下吗？", "orders": [{"order_number": "CA12347", "status": "shipped", "total": 159.99, "tracking_no": "FX123456789"}], "history": ["客户：已经15天了", "客服：可能是清关环节需要时间"]},
        ]
    },

    # ===== 售后场景 =====
    {
        "name": "场景9：尺寸不合+换货/优惠券（4轮）",
        "conversations": [
            {"message": "收到手镯了，但是太小了", "orders": [{"order_number": "CA12348", "status": "delivered", "total": 89.99}], "history": []},
            {"message": "能换大一号吗？", "orders": [{"order_number": "CA12348", "status": "delivered", "total": 89.99}], "history": ["客户：手镯太小了", "客服：能告诉我原因吗？是因为尺寸不合适吗？"]},
            {"message": "退货运费要我出吗？", "orders": [{"order_number": "CA12348", "status": "delivered", "total": 89.99}], "history": ["客户：能换大一号吗？", "客服：我可以给您一张优惠券"]},
            {"message": "那给我优惠券吧，我重新买", "orders": [{"order_number": "CA12348", "status": "delivered", "total": 89.99}], "history": ["客户：退货运费要我出吗？", "客服：您将负责退货的运费和关税"]},
        ]
    },
    {
        "name": "场景10：质量问题+补发（3轮）",
        "conversations": [
            {"message": "手链收到了，但是扣子坏了", "orders": [{"order_number": "CA12349", "status": "delivered", "total": 119.99}], "history": []},
            {"message": "能拍照给你看吗？", "orders": [{"order_number": "CA12349", "status": "delivered", "total": 119.99}], "history": ["客户：扣子坏了", "客服：请问是哪里质量差呢？能拍照发给我看看吗？"]},
            {"message": "你们会重新发货吗？", "orders": [{"order_number": "CA12349", "status": "delivered", "total": 119.99}], "history": ["客户：能拍照吗？", "客服：好的，请发照片给我"]},
        ]
    },
]

def test_conversation(scenario_name, conversations):
    """测试一个多轮对话场景"""
    print(f"\n{'='*80}")
    print(f"{scenario_name}")
    print(f"{'='*80}")

    for i, conv in enumerate(conversations, 1):
        print(f"\n--- 第{i}轮对话 ---")
        print(f"客户消息: {conv['message']}")

        req = urllib.request.Request(
            'http://localhost:8000/api/agent/analyze',
            data=json.dumps(conv).encode(),
            headers={'Content-Type': 'application/json'}
        )

        try:
            resp = urllib.request.urlopen(req)
            result = json.loads(resp.read().decode())

            intent = result.get('intent', {})
            print(f"意图: {intent.get('primary_intent')} > {intent.get('secondary_intent')}")

            entities = intent.get('extracted_entities', {})
            if entities:
                print(f"实体: {entities}")

            rewritten = intent.get('rewritten_query', '')
            if rewritten and rewritten != conv['message']:
                print(f"改写: {rewritten}")

            kb = result.get('knowledge_base', {})
            if kb.get('product'):
                prod = kb['product']
                print(f"匹配产品: {prod['name']} ({prod['brand']})")

            print(f"\nAI回复:\n{result['reply']}")

        except Exception as e:
            print(f"错误: {e}")

# 运行所有测试场景
if __name__ == "__main__":
    for scenario in test_scenarios:
        test_conversation(scenario["name"], scenario["conversations"])
        print("\n" + "="*80)
        input("按回车继续下一个场景...")
