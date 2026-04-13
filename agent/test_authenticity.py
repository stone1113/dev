import urllib.request
import json

# 测试真实性/1:1场景
data = {
    "message": "你们的首饰是正品吗？和专柜的一样吗？",
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

    print("=== 意图识别结果 ===")
    intent = result.get('intent', {})
    print(f"阶段: {result.get('phase')}")
    print(f"一级意图: {intent.get('primary_intent')}")
    print(f"二级意图: {intent.get('secondary_intent')}")
    print(f"置信度: {intent.get('confidence')}")

    print(f"\n=== AI回复 ===")
    print(result['reply'])
    print(f"\n回复来源: {result.get('reply_source')}")

except Exception as e:
    print(f"错误: {e}")
