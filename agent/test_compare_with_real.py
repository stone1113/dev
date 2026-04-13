#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
对比测试：AI回复 vs 真实客服回复
基于《多轮对话测试数据集.md》中的真实销售客服回复
"""
import urllib.request
import json
import difflib


def get_ai_reply(message, orders=[], history=[]):
    """调用API获取AI回复"""
    data = {"message": message, "orders": orders, "history": history}
    req = urllib.request.Request(
        'http://localhost:8000/api/agent/analyze',
        data=json.dumps(data).encode(),
        headers={'Content-Type': 'application/json'}
    )
    resp = urllib.request.urlopen(req)
    result = json.loads(resp.read().decode())
    return result['reply']


def calculate_similarity(text1, text2):
    """计算两段文本的相似度"""
    return difflib.SequenceMatcher(None, text1, text2).ratio()


def compare_scenario(name, rounds):
    """对比一个场景的所有轮次"""
    print("=" * 80)
    print(name)
    print("=" * 80)

    history = []
    total_similarity = 0

    for i, (customer_msg, real_reply, orders) in enumerate(rounds, 1):
        ai_reply = get_ai_reply(customer_msg, orders, history)
        similarity = calculate_similarity(real_reply, ai_reply)
        total_similarity += similarity

        print(f"\n【第{i}轮】")
        print(f"客户：{customer_msg}")
        print(f"\n真实客服：{real_reply}")
        print(f"\nAI回复：{ai_reply}")
        print(f"\n相似度：{similarity*100:.1f}%")

        # 差异分析
        if similarity < 0.5:
            print("⚠️  差异较大")
        elif similarity < 0.7:
            print("⚡ 有一定差异")
        else:
            print("✓ 较为接近")

        # 更新历史
        history.extend([f"客户：{customer_msg}", f"客服：{ai_reply}"])

    avg_similarity = total_similarity / len(rounds)
    print(f"\n场景平均相似度：{avg_similarity*100:.1f}%")
    print("\n")


# 定义10个场景（客户消息 + 真实客服回复 + 订单信息）
scenarios = [
    ("场景1：Love手镯价格+材质+尺寸咨询（3轮）", [
        ("你好，love手镯多少钱？",
         "亲爱的，这款LOVE手镯（Cartier）非常受欢迎，有14K_Gold/18K_Gold/Rose_Gold等材质可选。价格方面：14K_Gold材质$45-75/18K_Gold材质$85-150。我可以发实拍视频给您看看，有喜欢的款式随时告诉我。",
         []),

        ("这款是什么材质的？会不会褪色？",
         "亲爱的，我来为您说明产品材质。我们采用合金基材镀层工艺，有银合金镀14K金和925纯银镀18K金两种材质可选。首饰具有防水不褪色特性，一般保色约半年左右。日常佩戴注意保养的话，使用寿命会更长。",
         []),

        ("我手腕16cm，应该选多大尺寸？",
         "亲爱的，尺寸建议：建议量手腕围度后加1-2cm选择，可选尺寸：15cm/16cm/17cm/18cm/19cm。您手腕16cm的话，建议选17cm或18cm，这样佩戴会比较舒适。",
         []),
    ]),

    ("场景2：四叶草项链价格咨询+对比耳环（4轮）", [
        ("四叶草项链多少钱？",
         "亲爱的，这款四叶草项链（Van Cleef & Arpels）非常受欢迎，有18K_Gold/Rose_Gold等材质可选。价格方面：18K_Gold材质$65-180。我可以发实拍视频给您看看，有喜欢的款式随时告诉我。",
         []),

        ("有几个花的？",
         "亲爱的，这款四叶草项链（Van Cleef & Arpels）非常受欢迎，有18K_Gold/Rose_Gold等材质可选。经典四叶草造型，单花/三花/五花/十花可选。您可以先看看我们的店铺，选好喜欢的款式告诉我，我帮您确认库存。",
         []),

        ("耳环也有四叶草的吗？",
         "亲爱的，这款四叶草耳环（Van Cleef & Arpels）非常受欢迎，有18K_Gold/Rose_Gold/Sterling_Silver等材质可选。价格方面：18K_Gold材质$45-85/Sterling_Silver材质$30-60。我可以发实拍视频给您看看，有喜欢的款式随时告诉我。",
         []),

        ("项链和耳环一起买有优惠吗？",
         "亲爱的，多件购买更划算！我帮您看看组合优惠方案，搭配购买可以享受额外折扣。",
         []),
    ]),

    ("场景3：真实性咨询+质检流程（3轮）", [
        ("你们的首饰是正品吗？和专柜一样吗？",
         "亲，我们是1:1复刻的，相似度99%，细节都是按照原版复刻。发货前提供质检照片/视频给客户确认。请放心。",
         []),

        ("会不会褪色？能戴多久？",
         "亲爱的，我来为您说明产品材质。我们有两种材质可选：银合金镀14K金和925纯银镀18K金。首饰具有防水不褪色特性，一般保色约半年左右。日常佩戴注意保养的话，使用寿命会更长。避免接触化学品，洗澡游泳时建议取下。",
         []),

        ("发货前能看质检照片吗？",
         "亲爱的，没问题！我现在帮您拍质检照片和视频发给您确认，稍等一下。",
         []),
    ]),

    ("场景4：Tiffany钥匙项链+定制刻字（4轮）", [
        ("tiffany钥匙项链有吗？什么价格？",
         "亲爱的，这款钥匙项链（Tiffany & Co.）非常受欢迎，有18K_Gold/Sterling_Silver等材质可选。价格方面：18K_Gold材质$60-120/Sterling_Silver材质$40-75。我可以发实拍视频给您看看，有喜欢的款式随时告诉我。",
         []),

        ("能刻字吗？",
         "亲爱的，我们支持定制服务，包括刻字、调节尺寸等。定制需要额外5-7个工作日。具体细节我帮您对接专业顾问。",
         []),

        ("刻字要加钱吗？多久能发货？",
         "亲爱的，我们支持定制服务，包括刻字、调节尺寸等。定制需要额外5-7个工作日。具体细节我帮您对接专业顾问。",
         []),

        ("好的，我要18K金的，刻\"Forever\"",
         "亲爱的，太好了！尺寸建议：钥匙吊坠较大，建议选45cm长度，可选尺寸：42cm/45cm。请确认您的收货地址，下单后我们会尽快安排发货。发货前提供质检照片/视频给客户确认。",
         []),
    ]),

    ("场景5：预算有限+推荐性价比款（3轮）", [
        ("想买个手镯送女朋友，预算100美元左右",
         "亲爱的，理解您的预算考虑。我们有不同材质和价位可选，比如14K_Gold材质价格在$45-75之间。我可以帮您推荐性价比高的款式。",
         []),

        ("love手镯在这个价位有吗？",
         "亲爱的，这款LOVE手镯（Cartier）非常受欢迎，有14K_Gold/18K_Gold/Rose_Gold等材质可选。价格方面：14K_Gold材质$45-75/18K_Gold材质$85-150。14K金款在您的预算内，18K金稍微超一点。我可以发实拍视频给您看看，有喜欢的款式随时告诉我。",
         []),

        ("那推荐哪个材质比较好？",
         "亲爱的，我们有不同材质和价位可选，比如14K_Gold材质价格在$45-75之间。14K金性价比更高，适合日常佩戴。18K金颜色更接近正品，但价格稍高。根据您的预算，建议选14K金款。",
         []),
    ]),

    # ── 售中场景 ──

    ("场景6：订单确认+物流查询（3轮）", [
        ("我刚下单了，订单号CA12345",
         "亲爱的，您的订单已确认！我们会尽快安排生产和发货。发货前提供质检照片/视频给客户确认。",
         [{"order_number": "CA12345", "status": "pending", "total": 89.99}]),

        ("什么时候发货？",
         "亲爱的，您的订单正在处理中。有什么具体想了解的吗？我帮您查。",
         [{"order_number": "CA12345", "status": "confirmed", "total": 89.99}]),

        ("用什么快递？几天能到美国？",
         "亲爱的，我们从中国（广州/深圳）发货，使用联邦快递，一般7-15天送达。具体时效取决于目的地国家和清关速度。",
         [{"order_number": "CA12345", "status": "confirmed", "total": 89.99}]),
    ]),

    ("场景7：地址错误+修改地址（3轮）", [
        ("我的订单地址填错了",
         "亲爱的，收到！请把新的收货地址发给我，如果包裹还未发出我马上帮您修改。如果已发出，我联系快递看能否中途转寄。",
         [{"order_number": "CA12346", "status": "processing", "total": 129.99}]),

        ("能改成纽约的地址吗？",
         "亲爱的，收到！请把新的收货地址发给我，如果包裹还未发出我马上帮您修改。如果已发出，我联系快递看能否中途转寄。",
         [{"order_number": "CA12346", "status": "processing", "total": 129.99}]),

        ("123 Main St, New York, NY 10001",
         "亲爱的，收到！请把新的收货地址发给我，如果包裹还未发出我马上帮您修改。如果已发出，我联系快递看能否中途转寄。",
         [{"order_number": "CA12346", "status": "processing", "total": 129.99}]),
    ]),

    ("场景8：物流延迟+催单（4轮）", [
        ("我的包裹怎么还没到？",
         "亲爱的，我帮您查询了物流信息。您的包裹已发出，物流单号会在发货后通知您。有任何更新我会及时通知您。",
         [{"order_number": "CA12347", "status": "shipped", "total": 159.99}]),

        ("物流单号是多少？",
         "亲爱的，我帮您查询了物流信息。您的包裹已发出，物流单号会在发货后通知您。有任何更新我会及时通知您。",
         [{"order_number": "CA12347", "status": "shipped", "total": 159.99}]),

        ("已经15天了，还在清关吗？",
         "亲爱的，非常抱歉物流比预期慢了。我已经帮您跟进催促，可能是清关环节需要时间。有最新进展我第一时间通知您。",
         [{"order_number": "CA12347", "status": "shipped", "total": 159.99}]),

        ("能催一下吗？",
         "亲爱的，非常抱歉物流比预期慢了。我已经帮您跟进催促，可能是清关环节需要时间。有最新进展我第一时间通知您。",
         [{"order_number": "CA12347", "status": "shipped", "total": 159.99}]),
    ]),

    # ── 售后场景 ──

    ("场景9：尺寸不合+换货/优惠券（4轮）", [
        ("收到手镯了，但是太小了",
         "亲爱的，能告诉我原因吗？是因为尺寸不合适还是不喜欢颜色？",
         [{"order_number": "CA12348", "status": "delivered", "total": 89.99}]),

        ("能换大一号吗？",
         "我可以给您一张优惠券，供您再次购买。",
         [{"order_number": "CA12348", "status": "delivered", "total": 89.99}]),

        ("退货运费要我出吗？",
         "亲爱的，您将负责退货的运费和关税。收到退货后，我们将向您发放70%的退款。能告诉我原因吗？是因为尺寸不合适还是不喜欢颜色？",
         [{"order_number": "CA12348", "status": "delivered", "total": 89.99}]),

        ("那给我优惠券吧，我重新买",
         "好的，我会为您提供一张40$的回购优惠券。",
         [{"order_number": "CA12348", "status": "delivered", "total": 89.99}]),
    ]),

    ("场景10：质量问题+补发（3轮）", [
        ("手链收到了，但是扣子坏了",
         "亲爱的，请问是哪里质量差呢？能拍照发给我看看吗？",
         [{"order_number": "CA12349", "status": "delivered", "total": 119.99}]),

        ("能拍照给你看吗？",
         "亲爱的，没问题！我现在帮您拍质检照片和视频发给您确认，稍等一下。",
         [{"order_number": "CA12349", "status": "delivered", "total": 119.99}]),

        ("你们会重新发货吗？",
         "亲爱的，请先拍照让我看看损坏情况。我们会给您补发。",
         [{"order_number": "CA12349", "status": "delivered", "total": 119.99}]),
    ]),
]


if __name__ == "__main__":
    print("ChatBiz Agent 对比测试")
    print("AI回复 vs 真实销售客服回复")
    print("=" * 80)
    print()

    total_sim = 0
    total_rounds = 0

    for name, rounds in scenarios:
        compare_scenario(name, rounds)
        for customer_msg, real_reply, orders in rounds:
            total_rounds += 1

    print("=" * 80)
    print(f"共测试 {len(scenarios)} 个场景，{total_rounds} 轮对话")
    print("=" * 80)
