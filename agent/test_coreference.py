import urllib.request
import json

# 测试指代消解场景
data = {
    "message": "这款有什么材质？",
    "orders": [],
    "history": [
        "客户：你好，能看看love手镯吗",
        "客服：好的，这是love手镯的视频"
    ]
}

req = urllib.request.Request(
    'http://localhost:8000/api/agent/analyze',
    data=json.dumps(data).encode(),
    headers={'Content-Type': 'application/json'}
)

try:
    resp = urllib.request.urlopen(req)
    result = json.loads(resp.read().decode())

    print("=== 意图识别结果 ===")
    intent = result.get('intent', {})
    print(f"原始消息: 这款有什么材质？")
    print(f"改写后: {intent.get('rewritten_query')}")
    print(f"提取实体: {intent.get('extracted_entities')}")
    print(f"一级意图: {intent.get('primary_intent')}")
    print(f"二级意图: {intent.get('secondary_intent')}")

    kb = result.get('knowledge_base', {})
    if kb.get('product'):
        print(f"\n=== 匹配产品 ===")
        prod = kb['product']
        print(f"产品: {prod['name']}")
        print(f"品牌: {prod['brand']}")
        print(f"材质: {', '.join(prod['materials'][:3])}")

    print(f"\n=== AI回复 ===")
    print(result['reply'])

except Exception as e:
    print(f"错误: {e}")
