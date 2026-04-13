import urllib.request
import json

# 测试尺寸不合场景
data = {
    "message": "手链尺寸太小了，戴不上",
    "orders": [
        {
            "order_number": "TEST002",
            "status": "delivered",
            "total": 85.0
        }
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

    print("=== 阶段和意图 ===")
    print(f"阶段: {result['phase']}")
    print(f"主意图: {result['intent']['primary_intent']}")
    print(f"次意图: {result['intent']['secondary_intent']}")
    print(f"\n=== AI回复 ===")
    print(result['reply'])
    print(f"\n回复来源: {result['reply_source']}")
except Exception as e:
    print(f"错误: {e}")
