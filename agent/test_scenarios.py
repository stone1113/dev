import urllib.request
import json

scenarios = [
    {
        "name": "四叶草耳环价格咨询",
        "message": "四叶草耳环多少钱？",
    },
    {
        "name": "Tiffany钥匙项链咨询",
        "message": "tiffany钥匙项链有吗？什么价格？",
    },
    {
        "name": "戒指材质+价格咨询",
        "message": "love戒指是什么材质的？贵不贵？",
    },
]

for scenario in scenarios:
    print(f"\n{'='*60}")
    print(f"场景：{scenario['name']}")
    print(f"{'='*60}")
    
    data = {
        "message": scenario["message"],
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
        
        intent = result.get('intent', {})
        print(f"\n意图: {intent.get('primary_intent')} > {intent.get('secondary_intent')}")
        print(f"实体: {intent.get('extracted_entities')}")
        
        kb = result.get('knowledge_base', {})
        if kb.get('product'):
            prod = kb['product']
            print(f"\n匹配产品: {prod['name']} ({prod['brand']})")
            if prod.get('price_range'):
                print(f"价格: {prod['price_range']}")
        
        print(f"\nAI回复:\n{result['reply']}")
        
    except Exception as e:
        print(f"错误: {e}")
