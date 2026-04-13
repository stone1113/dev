import urllib.request
import json

# 测试知识库查询
data = {
    "message": "love手镯有什么材质？",
    "orders": [],
    "history": []
}

req = urllib.request.Request(
    'http://localhost:8000/api/agent/analyze',
    data=json.dumps(data).encode(),
    headers={'Content-Type': 'application/json'}
)

try:
    resp = urllib.request.urlopen(req)
    result = json.loads(resp.read().decode())

    print("=== 知识库查询结果 ===")
    kb = result.get('knowledge_base', {})

    if kb.get('product'):
        print(f"\n产品信息:")
        prod = kb['product']
        print(f"  名称: {prod['name']}")
        print(f"  品牌: {prod['brand']}")
        print(f"  材质: {', '.join(prod['materials'])}")
        print(f"  尺寸: {', '.join(prod['sizes'])}")
        if prod.get('price_range'):
            print(f"  价格: {prod['price_range']}")

    if kb.get('logistics'):
        print(f"\n物流信息:")
        log = kb['logistics']
        print(f"  发货地: {log['origin']}")
        print(f"  快递: {log['carrier']}")
        print(f"  时效: {log['eta']}")

    if kb.get('policies'):
        print(f"\n政策信息:")
        pol = kb['policies']
        print(f"  退货: {pol['return']}")
        print(f"  质量问题: {pol['quality_issue']}")
        print(f"  质保: {pol['warranty']}")

    print(f"\n=== AI回复 ===")
    print(result['reply'])

except Exception as e:
    print(f"错误: {e}")
