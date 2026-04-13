# 测试面板改造：Dify 风格工作流可视化

## 目标
将测试面板从"扁平结果展示"改造为"工作流节点可视化"，每个处理节点显示输入/输出。

## 后端改造

### 1. 新增 `pipeline_trace` 字段到 AnalyzeResponse
在 `models/request.py` 中新增：
```python
class NodeTrace(BaseModel):
    node: str           # 节点名称
    input: dict         # 输入数据
    output: dict        # 输出数据
    duration_ms: float  # 耗时

class AnalyzeResponse(BaseModel):
    # ... 现有字段保持不变
    pipeline_trace: list[NodeTrace] = []  # 新增
```

### 2. 在 `api/agent.py` 的 analyze() 中记录每个节点
每个步骤前后记录时间和输入输出：
- 节点1: 阶段路由 (input: orders → output: phase)
- 节点2: 意图识别 (input: message, phase, history → output: intent)
- 节点3: LLM兜底 (input: intent.confidence → output: 是否触发, 新intent)
- 节点4: Query改写 (input: message, phase → output: rewritten, entities)
- 节点5: 策略评估 (input: message, phase, intent → output: actions)
- 节点6: 会话打标 (input: phase, intent → output: labels)
- 节点7: 知识库查询 (input: entities → output: product, logistics, policies)
- 节点8: 回复生成 (input: phase, intent, entities → output: reply, source)

## 前端改造

### 3. 新增工作流可视化 CSS
- 垂直流水线布局，节点之间用连接线
- 每个节点：标题 + 状态图标 + 展开/折叠的输入输出面板
- 颜色编码：蓝色(路由)、紫色(意图)、橙色(改写)、绿色(策略)、青色(打标)、粉色(知识库)、红色(回复)

### 4. 新增 renderPipeline() 函数
替换现有的 renderResult()，渲染工作流节点链：
```
[阶段路由] → [意图识别] → [LLM兜底?] → [Query改写] → [策略评估] → [会话打标] → [知识库] → [回复生成]
```
每个节点可点击展开查看输入/输出 JSON。

## 文件变更清单
1. `models/request.py` - 新增 NodeTrace 模型
2. `api/agent.py` - analyze() 中记录 pipeline_trace
3. `static/test.html` - 工作流可视化 UI
