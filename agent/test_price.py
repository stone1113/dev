import urllib.request
import json

# 测试价格咨询场景
data = {
    "message": "love手镯多少钱？",
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

    print("=== 意图识别 ===")
    intent = result.get('intent', {})
    print(f"意图: {intent.get('primary_intent')} > {intent.get('secondary_intent')}")
    print(f"提取实体: {intent.get('extracted_entities')}")

    kb = result.get('knowledge_base', {})
    if kb.get('product'):
        print(f"\n=== 匹配产品 ===")
        prod = kb['product']
        print(f"产品: {prod['name']}")
        print(f"品牌: {prod['brand']}")
        print(f"价格: {prod.get('price_range', {})}")

    print(f"\n=== AI回复 ===")
    print(result['reply'])

except Exception as e:
    print(f"错误: {e}")
