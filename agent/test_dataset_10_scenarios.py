#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
生成10个多轮对话测试数据集
每个场景包含3-5轮完整对话，包含客户消息和AI实际回复
"""
import urllib.request
import json

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

def generate_scenario(name, rounds):
    """生成一个场景的完整对话"""
    print("=" * 80)
    print(name)
    print("=" * 80)

    history = []
    for i, (msg, orders) in enumerate(rounds, 1):
        reply = get_ai_reply(msg, orders, history)
        print(f"\n【第{i}轮】")
        print(f"客户：{msg}")
        print(f"AI：{reply}")
        history.extend([f"客户：{msg}", f"客服：{reply}"])
    print("\n")

# 定义10个场景
scenarios = [
    # 售前场景
    ("场景1：Love手镯价格+材质+尺寸咨询（3轮）", [
        ("你好，love手镯多少钱？", []),
        ("18K金的多少钱？", []),
        ("我手腕16cm，选多大尺寸？", []),
    ]),

    ("场景2：四叶草项链+耳环对比（4轮）", [
        ("有四叶草项链吗？", []),
        ("多少钱？", []),
        ("耳环也有四叶草的吗？", []),
        ("项链和耳环一起买有优惠吗？", []),
    ]),

    ("场景3：真实性咨询+质检流程（3轮）", [
        ("你们的首饰是正品吗？", []),
        ("会不会褪色？", []),
        ("发货前能看质检照片吗？", []),
    ]),

    ("场景4：Tiffany钥匙项链+定制刻字（4轮）", [
        ("tiffany钥匙项链有吗？", []),
        ("能刻字吗？", []),
        ("刻字要加钱吗？多久发货？", []),
        ("好的，我要18K金的，刻Forever", []),
    ]),

    ("场景5：预算有限+推荐性价比款（3轮）", [
        ("想买个手镯送女朋友，预算100美元", []),
        ("love手镯在这个价位有吗？", []),
        ("那推荐哪个材质？", []),
    ]),

    # 售中场景
    ("场景6：订单确认+物流查询（3轮）", [
        ("我刚下单了，订单号CA12345", [{"order_number": "CA12345", "status": "pending", "total": 89.99}]),
        ("什么时候发货？", [{"order_number": "CA12345", "status": "confirmed", "total": 89.99}]),
        ("用什么快递？几天到美国？", [{"order_number": "CA12345", "status": "confirmed", "total": 89.99}]),
    ]),

    ("场景7：地址错误+修改地址（3轮）", [
        ("我的订单地址填错了", [{"order_number": "CA12346", "status": "processing", "total": 129.99}]),
        ("能改成纽约的地址吗？", [{"order_number": "CA12346", "status": "processing", "total": 129.99}]),
        ("123 Main St, New York, NY 10001", [{"order_number": "CA12346", "status": "processing", "total": 129.99}]),
    ]),

    ("场景8：物流延迟+催单（4轮）", [
        ("我的包裹怎么还没到？", [{"order_number": "CA12347", "status": "shipped", "total": 159.99, "tracking_no": "FX123456789"}]),
        ("物流单号是多少？", [{"order_number": "CA12347", "status": "shipped", "total": 159.99, "tracking_no": "FX123456789"}]),
        ("已经15天了，还在清关吗？", [{"order_number": "CA12347", "status": "shipped", "total": 159.99, "tracking_no": "FX123456789"}]),
        ("能催一下吗？", [{"order_number": "CA12347", "status": "shipped", "total": 159.99, "tracking_no": "FX123456789"}]),
    ]),

    # 售后场景
    ("场景9：尺寸不合+换货/优惠券（4轮）", [
        ("收到手镯了，但是太小了", [{"order_number": "CA12348", "status": "delivered", "total": 89.99}]),
        ("能换大一号吗？", [{"order_number": "CA12348", "status": "delivered", "total": 89.99}]),
        ("退货运费要我出吗？", [{"order_number": "CA12348", "status": "delivered", "total": 89.99}]),
        ("那给我优惠券吧，我重新买", [{"order_number": "CA12348", "status": "delivered", "total": 89.99}]),
    ]),

    ("场景10：质量问题+补发（3轮）", [
        ("手链收到了，但是扣子坏了", [{"order_number": "CA12349", "status": "delivered", "total": 119.99}]),
        ("能拍照给你看吗？", [{"order_number": "CA12349", "status": "delivered", "total": 119.99}]),
        ("你们会重新发货吗？", [{"order_number": "CA12349", "status": "delivered", "total": 119.99}]),
    ]),
]

if __name__ == "__main__":
    for name, rounds in scenarios:
        generate_scenario(name, rounds)
