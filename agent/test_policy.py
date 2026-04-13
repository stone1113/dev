import urllib.request
import json

# 测试售后质量问题场景
data = {
    "message": "产品有质量问题，我要退货",
    "orders": [
        {
            "order_number": "TEST001",
            "status": "delivered",
            "total": 150.0
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
    print(json.dumps(result, ensure_ascii=False, indent=2))
except Exception as e:
    print(f"错误: {e}")
