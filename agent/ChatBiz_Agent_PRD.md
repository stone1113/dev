# ChatBiz 珠宝客服 AI Agent — 产品需求文档 (PRD)

> **版本**: v2.0 | **更新日期**: 2026-03-18 | **作者**: AI产品经理

---

## 一、系统概述

### 1.1 产品定位

ChatBiz Agent 是面向跨境珠宝电商的智能客服系统，处理 WhatsApp/Telegram 等渠道的客户消息。系统采用**8步流水线架构**，通过规则引擎+LLM兜底的混合策略，实现高效准确的客户服务。

### 1.2 核心指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 意图识别准确率 | ≥85% | 规则引擎+LLM兜底 |
| 首次回复时间 | <500ms | 规则模板回复 |
| LLM回复时间 | <3s | DeepSeek API |
| 转人工率 | <15% | 只在必要时转人工 |
| 客户满意度 | ≥4.2/5 | 回复质量评分 |

### 1.3 处理流水线（8步）

```
客户消息
  ↓
STEP 1: 阶段路由 ──→ 售前 / 售中 / 售后
  ↓
STEP 2: 意图识别 ──→ 18大类 60+子意图（关键词匹配）
  ↓
STEP 3: LLM兜底  ──→ 置信度<0.3时调用DeepSeek
  ↓
STEP 4: Query改写 ──→ 规范化表达 + 实体提取 + 指代消解
  ↓
STEP 5: 知识库查询 ──→ 产品/物流/政策匹配
  ↓
STEP 6: 策略评估 ──→ 62条规则（转人工/拦截/营销）
  ↓
STEP 7: 会话打标 ──→ 自动生成9维标签
  ↓
STEP 8: 回复生成 ──→ 模板填充 / LLM生成
  ↓
客服回复
```

---

## 二、STEP 1: 阶段路由

### 2.1 路由逻辑

根据**订单状态**自动分配服务阶段，决定后续所有节点的处理分支。

```python
def route_phase(orders):
    if not orders:
        return "pre_sales"      # 无订单 → 售前

    active = {"pending", "processing", "shipped"}
    completed = {"delivered", "cancelled", "refunded"}

    for order in orders:
        if order.status in active:
            return "in_sales"   # 有进行中订单 → 售中
        if order.status in completed:
            return "after_sales" # 有已完成订单 → 售后

    return "pre_sales"          # 默认售前
```

### 2.2 路由规则表

| 订单状态 | 阶段 | 说明 |
|----------|------|------|
| 无订单 / none | `pre_sales` | 客户尚未下单 |
| pending | `in_sales` | 订单待处理 |
| processing | `in_sales` | 订单处理中 |
| shipped | `in_sales` | 已发货运输中 |
| delivered | `after_sales` | 已签收 |
| cancelled | `after_sales` | 已取消 |
| refunded | `after_sales` | 已退款 |

### 2.3 Dify节点配置

- **节点类型**: `question-classifier`（因为Dify的if-else只支持二路分支）
- **模型**: deepseek-chat, temperature=0.1
- **输入变量**: `order_status`
- **提示词**:

```
根据订单状态判断客户所处阶段：

分类1 - 售前（无订单或订单状态为none）：客户还没有下单，处于咨询阶段
分类2 - 售中（订单进行中：pending/processing/shipped）：客户已下单，订单正在处理或配送中
分类3 - 售后（订单已完成：delivered/cancelled/refunded）：客户的订单已经完成、取消或退款
```

---

## 三、STEP 2: 意图识别

### 3.1 分类体系

系统采用**二级分类**：Primary Intent（大类）→ Secondary Intent（子意图），共覆盖 **18大类 60+子意图**。

### 3.2 售前意图树（PRE_SALES）

#### 3.2.1 PRODUCT_INQUIRY（产品咨询）— 11个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `price_inquiry` | 多少钱, 价格, 报价, 什么价, 几折 | "这个VCA手链多少钱？" "四叶草项链什么价？" |
| `material_inquiry` | 材质, 什么做的, 14K金, 18K金, 褪色, 掉色, 变色, 变黑, 防水 | "14k金会不会掉色" "材质是什么做的" |
| `spec_inquiry` | 尺寸, 大小, 重量, 规格, 长度 | "手链有多大的？" "项链多长？" |
| `availability_inquiry` | 有货, 库存, 现货, 还有吗, 能买到 | "这款还有货吗？" "能买到吗" |
| `authenticity_inquiry` | 正品, 真假, 高仿, 复刻, 刻印, 1:1, 像正品 | "你们的首饰是正品吗？" "有刻印吗像正品一样？" |
| `packaging_inquiry` | 盒子, 包装, 礼盒, 原装盒, 原盒, 带盒子 | "卡地亚Flex系列带盒子吗？" "有原装盒吗" |
| `care_inquiry` | 保养, 护理, 清洗, 会变色吗, 能戴多久, 防水吗 | "会不会褪色？" "能戴多久" |
| `brand_inquiry` | 品牌, 牌子, 什么牌子 | "什么牌子的？" |
| `collection_inquiry` | 系列, 新款, 经典款, 限量 | "有新款吗？" "经典款推荐" |
| `product_comparison` | 对比, 区别, 哪个好, 推荐哪个 | "14K和18K哪个好？" |
| `customization_inquiry` | 定制, 定做, 刻字, 改尺寸 | "能刻字吗？" "能改尺寸吗" |

#### 3.2.2 PURCHASE_INTENT（购买意向）— 6个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `ready_to_buy` | 我要买, 下单, 购买, 拍, 要了, 就这个 | "我要了，怎么下单？" |
| `gift_purchase` | 送礼, 礼物, 送人, 生日, 纪念日, 情人节 | "送女朋友生日礼物" |
| `bulk_purchase` | 批发, 大量, 团购, 批量, 多件 | "能批发吗？要10条" |
| `hesitation` | 考虑, 想想, 再看看, 不确定, 纠结 | "我再考虑考虑" |
| `budget_concern` | 太贵, 便宜, 优惠, 折扣, 打折 | "太贵了，便宜点" |
| `urgency_purchase` | 急, 尽快, 今天, 马上, 赶时间 | "急需，今天能发吗" |

#### 3.2.3 SHIPPING_INQUIRY（物流咨询）— 5个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `shipping_cost` | 运费, 邮费, 包邮, 免运费 | "运费多少？" "包邮吗？" |
| `shipping_time` | 多久到, 几天, 到货时间, 什么时候到, 几天到 | "多久能到？" "几天到美国？" |
| `shipping_method` | 快递, 配送, 顺丰, EMS, DHL, FedEx | "用什么快递发？" |
| `international_shipping` | 国际, 海外, 关税, 清关, 寄到, 能寄, 加拿大, 美国, 墨西哥 | "能寄到加拿大或墨西哥吗？" |
| `shipping_address` | 地址, 改地址, 收货地址 | "收货地址怎么填？" |

#### 3.2.4 PAYMENT_INQUIRY（支付咨询）— 5个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `payment_method` | 怎么付, 支付, 付款方式, 银行卡, 信用卡 | "怎么付款？支持什么支付方式？" |
| `installment` | 分期, 月付, 花呗 | "能分期吗？" |
| `payment_security` | 安全, 担保, 靠谱吗 | "付款安全吗？" |
| `invoice` | 发票, 收据 | "能开发票吗？" |
| `currency` | 汇率, 美元, 人民币 | "价格是美元还是人民币？" |

#### 3.2.5 PROMOTION_INQUIRY（促销咨询）— 4个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `current_promotion` | 活动, 促销, 优惠, 打折, 折扣 | "现在有什么活动吗？" |
| `coupon_inquiry` | 优惠券, 折扣码, 满减 | "有优惠券吗？" |
| `membership_benefit` | 会员, VIP, 积分, 会员价 | "会员有什么优惠？" |
| `bundle_deal` | 套餐, 搭配, 组合, 套装, 一起买 | "买一套能便宜吗？" |

#### 3.2.6 SERVICE_INQUIRY（服务咨询）— 5个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `warranty` | 保修, 质保, 保证, 售后保障 | "有保修吗？" |
| `return_policy` | 退货, 退款, 退换, 不满意 | "不满意能退吗？" |
| `after_sales_service` | 售后, 维修, 保养服务 | "售后怎么样？" |
| `store_info` | 门店, 地址, 在哪, 营业时间 | "有线下门店吗？" |
| `contact_human` | 人工, 客服, 转人工, 真人 | "帮我转人工" |

### 3.3 售中意图树（IN_SALES）

#### 3.3.1 ORDER_STATUS（订单状态）— 4个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `order_tracking` | 物流, 快递, 到哪了, 查快递, 运单号 | "我的快递到哪了" |
| `order_confirmation` | 订单确认, 确认收到, 下单成功, 订单号 | "订单确认了吗？" |
| `delivery_eta` | 什么时候到, 预计, 几天能到, 到达时间 | "预计什么时候到？" |
| `shipping_delay` | 延迟, 怎么还没到, 太慢了, 催一下 | "都10天了还没到" |

#### 3.3.2 ORDER_MODIFICATION（订单修改）— 4个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `change_address` | 改地址, 换地址, 地址写错了 | "地址写错了能改吗" |
| `change_quantity` | 改数量, 多买, 加一个 | "能多加一条吗" |
| `change_product` | 换货, 换一个, 换款, 改颜色 | "想换成玫瑰金的" |
| `cancel_order` | 取消, 不要了, 退订 | "我想取消订单" |

#### 3.3.3 PAYMENT_ISSUE（支付问题）— 3个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `payment_failed` | 支付失败, 付不了, 扣款失败 | "付款一直失败" |
| `double_charge` | 重复扣款, 扣了两次, 多扣了 | "扣了我两次钱" |
| `payment_confirmation` | 到账, 已付款, 汇款了 | "我已经付款了" |

#### 3.3.4 QUALITY_CHECK（质检验收）— 2个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `qc_request` | 验货, QC, 质检, 看照片, 实物图 | "发货前能拍照给我看看吗" |
| `qc_issue` | 有问题, 瑕疵, 和图片不一样 | "实物和图片不一样" |

#### 3.3.5 CUSTOMS_LOGISTICS（清关物流）— 2个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `customs_issue` | 清关, 海关, 扣关, 关税 | "被海关扣了怎么办" |
| `logistics_insurance` | 保险, 丢件, 损坏, 理赔 | "包裹丢了怎么办" |

#### 3.3.6 COMMUNICATION（沟通交流）— 3个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `order_update_request` | 进度, 最新情况, 处理到哪了 | "有什么进展吗" |
| `special_request` | 特殊要求, 备注, 帮我 | "帮我备注不要发票" |
| `urgent_matter` | 紧急, 很急, 赶时间, 加急 | "能加急吗？后天要送人" |

### 3.4 售后意图树（AFTER_SALES）

#### 3.4.1 RETURN_REFUND（退货退款）— 4个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `return_request` | 退货, 寄回, 退回, 不想要了 | "我想退货" |
| `refund_request` | 退款, 退钱, 什么时候退 | "退款到了吗" |
| `exchange_request` | 换货, 换一个, 换款式, 换尺寸 | "大了能换小号吗" |
| `refund_status` | 退款进度, 退了吗, 几天退 | "退款什么时候到账" |

#### 3.4.2 COMPLAINT（投诉）— 4个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `product_complaint` | 投诉, 质量太差, 假货 | "东西坏了我要投诉！" |
| `service_complaint` | 态度差, 服务差, 不满意 | "客服态度太差了" |
| `logistics_complaint` | 物流太慢, 快递投诉, 损坏 | "包裹到了全压变形了" |
| `escalation` | 投诉升级, 经理, 上级, 工商 | "叫你们经理来" |

#### 3.4.3 REPAIR_MAINTENANCE（维修保养）— 3个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `repair_request` | 维修, 坏了, 断了, 掉色 | "手链断了能修吗" |
| `maintenance_service` | 保养, 翻新, 清洗, 抛光 | "怎么保养？变黑了" |
| `warranty_claim` | 保修, 在保修期, 免费维修 | "还在保修期内吧" |

#### 3.4.4 COMPENSATION（补偿诉求）— 3个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `price_adjustment` | 补差价, 降价了, 买贵了 | "刚买完就降价了" |
| `goodwill_gesture` | 补偿, 赔偿, 弥补, 给点优惠 | "给我补偿一下" |
| `free_shipping_return` | 承担运费, 退货运费, 包退 | "退货运费你们出吗" |

#### 3.4.5 REPURCHASE（复购意向）— 3个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `reorder` | 再买, 再来一个, 追加, 同款 | "上次买的很好，再来一条" |
| `new_product_interest` | 新品, 新款, 上新 | "最近有新款吗" |
| `referral` | 推荐朋友, 朋友也想买 | "朋友也想买能优惠吗" |

#### 3.4.6 FEEDBACK（反馈评价）— 3个子意图

| 子意图 | 关键词 | 真实用户示例 |
|--------|--------|------------|
| `positive_feedback` | 好评, 满意, 很好, 棒, 赞 | "收到了，很满意！" |
| `negative_feedback` | 差评, 不满意, 差劲, 后悔 | "太差了后悔买了" |
| `suggestion` | 建议, 希望, 改进 | "建议多出点颜色" |

### 3.5 置信度计算

```python
# 关键词匹配计算
hits = 匹配到的关键词数量
total = 该子意图的总关键词数
confidence = min(1.0, (hits / total) * 1.5)  # 放大系数1.5，上限1.0

# 阈值
LLM_FALLBACK_THRESHOLD = 0.3  # 低于此值触发LLM兜底
```

### 3.6 Dify节点配置

- **节点类型**: `question-classifier`（每个阶段一个）
- **模型**: deepseek-chat, temperature=0.2
- **售前分类器提示词**:

```
你是一个珠宝电商客服问题分类器。请根据客户消息判断属于以下哪个分类：

分类1 - 产品咨询（大部分售前问题）：
- 询问产品价格：多少钱、什么价、价格
- 询问材质：什么材质、14K金、18K金、会不会褪色
- 询问尺寸：多大、尺寸、手腕
- 产品推荐：有没有、推荐、好看的
- 包装咨询：盒子、包装、礼盒、刻印、证书
- 真伪咨询：正品、高仿、复刻、真假
- 保养咨询：保养、褪色、掉色
- 下单/支付：下单、买、付款
- 发货咨询：发哪里、多久到、什么快递

分类2 - 砍价/优惠：
- 讨价还价：便宜点、少点、打折、优惠
- 批量折扣：多买、批发
- 活动优惠：有没有活动、满减

分类3 - 转人工/广告/其他：
- 转人工：转人工、人工客服
- 广告/引流：加微信、合作、代理
- 无法理解的消息
```

---

## 四、STEP 3: LLM兜底

### 4.1 触发条件

```python
def needs_llm_fallback(intent_result, threshold=0.3):
    return intent_result.confidence < threshold
```

当规则引擎置信度 < 0.3 时，调用 DeepSeek API 重新分类。

### 4.2 LLM分类提示词

```
你是一个珠宝电商客服意图分类系统。分析以下客户消息，返回JSON格式：

{
  "primary_intent": "意图大类ID",
  "secondary_intent": "子意图ID",
  "confidence": 0.0-1.0,
  "extracted_entities": {"brand": "...", "product": "...", "material": "..."}
}

当前阶段: {phase}
客户消息: {message}
对话历史: {history}

可选的意图大类:
- PRODUCT_INQUIRY: 产品咨询（价格/材质/尺寸/真伪/包装/保养）
- PURCHASE_INTENT: 购买意向（下单/犹豫/砍价/送礼/批量/紧急）
- SHIPPING_INQUIRY: 物流咨询（运费/时效/快递/国际/地址）
- PAYMENT_INQUIRY: 支付咨询（方式/分期/安全/发票/汇率）
- PROMOTION_INQUIRY: 促销咨询（活动/优惠券/会员/套装）
- SERVICE_INQUIRY: 服务咨询（保修/退换/售后/门店/转人工）
```

### 4.3 配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `LLM_FALLBACK_ENABLED` | true | 是否启用LLM兜底 |
| `LLM_CONFIDENCE_THRESHOLD` | 0.3 | 触发阈值 |
| `DEEPSEEK_MODEL` | deepseek-chat | 模型名称 |
| `temperature` | 0.3 | 低随机性，确保分类稳定 |
| `max_tokens` | 1024 | 最大输出token |
| `timeout` | 30s | 超时时间 |

---

## 五、STEP 4: Query改写

### 5.1 功能说明

将用户的口语化输入**规范化**，同时提取**结构化实体**，用于后续知识库匹配和回复生成。

### 5.2 处理流程

```
原始消息 → 指代消解 → 规则匹配 → 实体提取 → 实体规范化 → 模板填充 → 输出
```

### 5.3 指代消解

处理多轮对话中的代词，从历史对话中恢复实体：

| 代词 | 替换逻辑 |
|------|----------|
| 这款、那款、这个、那个 | 从上一轮提到的产品名替换 |
| 它、它们 | 从上一轮提到的产品替换 |
| 也、还 | 保留语境，追加上一轮的产品上下文 |

### 5.4 实体规范化字典

#### 5.4.1 品牌规范化（46条）

| 用户输入 | 规范化结果 |
|----------|-----------|
| VCA / 梵克 / 梵克雅宝 | Van Cleef & Arpels |
| Cartier / 卡地亚 | Cartier |
| Tiffany / 蒂芙尼 | Tiffany & Co. |
| Bulgari / 宝格丽 | Bulgari |
| Hermès / 爱马仕 | Hermès |
| Chanel / 香奈儿 | Chanel |
| Dior / 迪奥 | Dior |
| LV / 路易威登 | Louis Vuitton |
| Piaget / 伯爵 | Piaget |
| Chopard / 萧邦 | Chopard |
| Mikimoto / 御木本 | Mikimoto |
| ... | （共46条） |

#### 5.4.2 材质规范化（28条）

| 用户输入 | 规范化结果 |
|----------|-----------|
| 14K / 14K金 | 14K_Gold |
| 18K / 18K金 | 18K_Gold |
| 黄金 / 金 / gold | Gold |
| 白金 / white gold | White_Gold |
| 铂金 / pt950 | Platinum |
| 玫瑰金 / rose gold | Rose_Gold |
| 银 / 925银 / 纯银 | Sterling_Silver |
| 钻石 / diamond | Diamond |
| 珍珠 / pearl | Pearl |
| 钛钢 / 不锈钢 | Stainless_Steel |
| ... | （共28条） |

#### 5.4.3 产品名规范化（18条）

| 用户输入 | 规范化结果 |
|----------|-----------|
| love / LOVE | love |
| 四叶草 / alhambra / Alhambra | alhambra |
| 钉子 / juste un clou | juste_un_clou |
| 蛇骨 / serpenti | serpenti |
| flex / Flex | flex |
| trinity / 三色金 | trinity |
| tiffany t / T系列 | tiffany_t |
| bzero1 / B.zero1 | bzero1 |
| 山茶花 / camellia | camellia |
| 双C / cc | cc |
| ... | （共18条） |

#### 5.4.4 产品类型规范化（12条）

| 用户输入 | 规范化结果 |
|----------|-----------|
| 手链 / bracelet | bracelet |
| 手镯 / bangle | bangle |
| 项链 / necklace | necklace |
| 戒指 / ring | ring |
| 耳环 / earring | earring |
| 耳钉 | stud_earring |
| 吊坠 / pendant | pendant |
| 胸针 / brooch | brooch |
| 脚链 / anklet | anklet |
| ... | （共12条） |

### 5.5 改写规则表（30条）

#### 售前改写规则（10条）

| 规则ID | 匹配模式 | 改写模板 | 提取实体 |
|--------|----------|----------|----------|
| `pre_price_01` | "(.*)多少钱", "(.*)价格", "(.*)什么价" | 查询{product}的价格信息 | product_name, product_type, brand |
| `pre_material_02` | "(.*)什么材质", "(.*)什么做的" | 查询{product}的材质信息 | material, product_type |
| `pre_stock_03` | "(.*)有货吗", "(.*)还有吗", "有(.*)吗" | 查询{product}的库存状态 | product_name, product_type, brand |
| `pre_compare_04` | "(.*)和(.*)哪个好", "(.*)区别" | 对比{product_a}和{product_b}的差异 | brand |
| `pre_custom_05` | "(.*)能定制吗", "(.*)刻字" | 咨询{product}的定制服务 | product_type |
| `pre_shipping_06` | "(.*)运费多少", "(.*)包邮吗" | 查询配送方式和运费信息 | — |
| `pre_auth_07` | "(.*)正品吗", "(.*)真的吗", "(.*)有证书吗" | 咨询{product}的真伪验证和证书 | brand |
| `pre_gift_08` | "(.*)送女朋友", "(.*)送礼", "(.*)礼物推荐" | 推荐适合送礼的{product} | product_type, budget |
| `pre_discount_09` | "(.*)有优惠吗", "(.*)打折吗", "(.*)能便宜" | 查询当前优惠活动和折扣信息 | — |
| `pre_warranty_10` | "(.*)保修吗", "(.*)售后怎么样" | 咨询售后保修和服务保障政策 | — |

#### 售中改写规则（10条）

| 规则ID | 匹配模式 | 改写模板 | 提取实体 |
|--------|----------|----------|----------|
| `in_tracking_01` | "(.*)到哪了", "(.*)物流", "(.*)运单号" | 查询订单{order_number}的物流状态 | order_number |
| `in_delay_02` | "(.*)怎么还没到", "(.*)太慢了", "(.*)催一下" | 催促订单{order_number}的配送进度 | order_number |
| `in_modify_03` | "(.*)改地址", "(.*)地址写错了" | 修改订单{order_number}的收货地址 | order_number |
| `in_cancel_04` | "(.*)取消订单", "(.*)不要了" | 取消订单{order_number} | order_number |
| `in_payment_05` | "(.*)付不了", "(.*)支付失败" | 处理订单{order_number}的支付问题 | order_number |
| `in_double_charge_06` | "(.*)扣了两次", "(.*)重复扣款" | 处理订单{order_number}的重复扣款问题 | order_number |
| `in_qc_07` | "(.*)验货", "(.*)看实物", "(.*)QC" | 请求订单{order_number}的质检照片 | order_number |
| `in_customs_08` | "(.*)清关", "(.*)海关", "(.*)扣关" | 处理订单{order_number}的清关问题 | order_number |
| `in_change_product_09` | "(.*)换一个", "(.*)换款", "(.*)改颜色" | 更换订单{order_number}的商品 | order_number, product_type |
| `in_urgent_10` | "(.*)加急", "(.*)很急", "(.*)赶时间" | 加急处理订单{order_number} | order_number |

#### 售后改写规则（10条）

| 规则ID | 匹配模式 | 改写模板 | 提取实体 |
|--------|----------|----------|----------|
| `after_return_01` | "(.*)退货", "(.*)不想要了" | 申请订单{order_number}的退货 | order_number |
| `after_refund_02` | "(.*)退款", "(.*)退钱" | 查询订单{order_number}的退款进度 | order_number |
| `after_complaint_03` | "(.*)投诉", "(.*)质量太差", "(.*)假货" | 处理订单{order_number}的投诉 | order_number, complaint_type |
| `after_repair_04` | "(.*)维修", "(.*)坏了", "(.*)断了", "(.*)掉色" | 申请{product}的维修服务 | product_type, issue_type |
| `after_warranty_05` | "(.*)保修期", "(.*)免费维修" | 查询{product}的保修状态 | product_type |
| `after_compensation_06` | "(.*)补偿", "(.*)赔偿" | 处理订单{order_number}的补偿诉求 | order_number |
| `after_escalate_07` | "(.*)找经理", "(.*)上级", "(.*)工商" | 升级处理客户投诉 | — |
| `after_exchange_08` | "(.*)换货", "(.*)换尺寸", "(.*)换颜色" | 申请订单{order_number}的换货 | order_number, product_type |
| `after_reorder_09` | "(.*)再买一个", "(.*)追加", "(.*)同款再来" | 复购{product} | product_type, brand |
| `after_feedback_10` | "(.*)好评", "(.*)满意", "(.*)不满意" | 记录客户反馈评价 | — |

### 5.6 改写示例

| 原始消息 | 改写后 | 提取实体 |
|----------|--------|----------|
| "这个VCA手链多少钱？" | "查询Van Cleef & Arpels bracelet的价格信息" | `{brand: "Van Cleef & Arpels", product_type: "bracelet"}` |
| "卡地亚Flex系列带盒子吗？有刻印吗？" | "咨询Cartier flex的包装和真伪验证" | `{brand: "Cartier", product_name: "flex"}` |
| "14k金会不会掉色" | "查询14K_Gold的材质信息" | `{material: "14K_Gold"}` |
| "能寄到加拿大或墨西哥吗？" | "查询国际配送（加拿大/墨西哥）" | `{region: "Canada/Mexico"}` |

---

## 六、STEP 5: 知识库查询

### 6.1 知识库结构

知识库分为三大模块：**产品库**、**物流库**、**政策库**。

### 6.2 产品库（18款珠宝）

| 产品ID | 品牌 | 中文名 | 英文名 | 类型 | 材质选项 | 尺寸 | 价格区间(USD) |
|--------|------|--------|--------|------|----------|------|--------------|
| vca_alhambra_necklace | Van Cleef & Arpels | 四叶草项链 | Alhambra Necklace | necklace | 14K_Gold, 18K_Gold, Rose_Gold, White_Gold | 42cm, 45cm, 50cm | $35-90 |
| vca_alhambra_bracelet | Van Cleef & Arpels | 四叶草手链 | Alhambra Bracelet | bracelet | 14K_Gold, 18K_Gold, Rose_Gold | S, M, L | $30-75 |
| vca_alhambra_earring | Van Cleef & Arpels | 四叶草耳环 | Alhambra Earring | earring | 14K_Gold, 18K_Gold | 一码 | $25-60 |
| vca_alhambra_ring | Van Cleef & Arpels | 四叶草戒指 | Alhambra Ring | ring | 14K_Gold, 18K_Gold | 5-10号 | $25-65 |
| cartier_love_bracelet | Cartier | Love手镯 | Love Bracelet | bangle | 14K_Gold, 18K_Gold, Rose_Gold, White_Gold | 16cm, 17cm, 18cm, 19cm | $55-120 |
| cartier_juste_un_clou | Cartier | 钉子手镯 | Juste un Clou Bracelet | bangle | 14K_Gold, 18K_Gold, Rose_Gold | 15cm, 16cm, 17cm, 18cm | $55-110 |
| cartier_flex_bracelet | Cartier | Flex手链 | Flex Bracelet | bracelet | 18K_Gold, Rose_Gold | M, L | $60-100 |
| cartier_trinity_ring | Cartier | 三色金戒指 | Trinity Ring | ring | 三色金(Yellow+White+Rose) | 5-10号 | $45-85 |
| bulgari_serpenti_bracelet | Bulgari | 蛇形手链 | Serpenti Bracelet | bracelet | 14K_Gold, 18K_Gold, Rose_Gold | S, M, L | $40-90 |
| bulgari_bzero1_ring | Bulgari | B.zero1戒指 | B.zero1 Ring | ring | 14K_Gold, 18K_Gold | 5-10号 | $35-75 |
| tiffany_t_bracelet | Tiffany & Co. | T系列手链 | Tiffany T Bracelet | bracelet | 14K_Gold, 18K_Gold, Rose_Gold | S, M | $40-80 |
| tiffany_smile_necklace | Tiffany & Co. | 笑脸项链 | Tiffany Smile Necklace | necklace | 14K_Gold, 18K_Gold | 42cm, 45cm | $30-65 |
| tiffany_heart_necklace | Tiffany & Co. | 心形项链 | Return to Tiffany Heart | necklace | Sterling_Silver, 14K_Gold | 40cm, 45cm | $20-55 |
| chanel_camellia_earring | Chanel | 山茶花耳环 | Camellia Earring | earring | 14K_Gold, 18K_Gold | 一码 | $30-65 |
| chanel_cc_necklace | Chanel | 双C项链 | CC Necklace | necklace | 14K_Gold, 18K_Gold | 42cm, 45cm | $35-70 |
| dior_cd_bracelet | Dior | CD手链 | CD Bracelet | bracelet | 14K_Gold | S, M | $25-50 |
| hermes_h_bracelet | Hermès | H手镯 | H Bracelet | bangle | 18K_Gold, Rose_Gold, Enamel | S, M, L | $50-100 |
| lv_volt_necklace | Louis Vuitton | Volt项链 | Volt Necklace | necklace | 18K_Gold | 45cm | $55-95 |

**每个产品的额外属性**：
- `features`: 产品卖点列表
- `care`: 保养说明
- `size_guide`: 尺寸选购指南
- `price_range`: 按材质分价格区间

### 6.3 物流库

#### 6.3.1 基础信息

| 属性 | 值 |
|------|-----|
| 发货地 | 中国（广州/深圳） |
| 免运费门槛 | $200 |
| 包裹保险 | 基本运输保障（免费） |

#### 6.3.2 快递选项

| 快递 | 覆盖区域 | 时效 | 追踪链接 |
|------|----------|------|----------|
| FedEx | 美洲、欧洲 | 7-12天 | fedex.com/tracking |
| UPS | 美洲 | 7-12天 | ups.com/tracking |
| EMS | 亚洲 | 5-10天 | ems.com.cn |
| DHL | 全球 | 7-15天 | dhl.com/tracking |

#### 6.3.3 地区配送信息

| 地区 | 时效 | 默认快递 | 清关说明 |
|------|------|----------|----------|
| 美国 | 7-12天 | FedEx | $800以下免关税 |
| 欧洲 | 10-15天 | FedEx | 可能产生VAT |
| 加拿大 | 10-15天 | FedEx | CAD$20以下免税 |
| 澳大利亚 | 10-18天 | DHL | AUD$1000以下免税 |
| 亚洲 | 5-10天 | EMS | 各国政策不同 |
| 中国国内 | 2-3天 | 顺丰 | 无需清关 |

### 6.4 政策库

| 政策项 | 内容 |
|--------|------|
| `return_policy` | 跨境退货运费高昂，一般不支持退货退款。如确需退货，客户承担退货运费和关税，收到退货后发放70%退款。 |
| `quality_issue` | 客户提供照片/视频后，免费重新发货 或 补偿$10-30优惠券。 |
| `size_issue` | 尺寸不合适：补偿$10-20优惠券 + 可以补发正确尺寸。 |
| `cancel_free` | 未发货前取消，全额退款。 |
| `cancel_shipped` | 已发货无法取消，需等收货后走退货流程。 |
| `compensation_coupon` | 一般问题补偿$10-30优惠券。 |
| `warranty` | 6个月质保期。期内质量问题免费补发。 |
| `qc_process` | 发货前提供质检照片/视频(QC)供客户确认。 |
| `fading_policy` | 14K金一般保色约6个月。过早褪色可免费补发。日常避免接触化学品和水。 |

### 6.5 FAQ库（12条）

| 问题 | 回答 |
|------|------|
| 材质是什么 | 我们采用合金材料，表面镀14K金或18K金，非纯金。 |
| 会不会褪色 | 一般保色约半年到两年，取决于材质和保养。避免接触化学品和水。 |
| 是正品吗 | 我们是1:1复刻款，非正品。做工精细，相似度99%。 |
| 包装是什么 | 默认精美礼盒包装。原品牌礼盒需加$20-30。 |
| 能包邮吗 | 订单满$200包邮。 |
| 多久能到 | 根据目的地不同，7-18天。发货后提供追踪号。 |
| 能退货吗 | 跨境退货运费高昂，建议协商换货或优惠券补偿。 |
| 支持什么支付 | 支持信用卡、PayPal等，通过网站下单支付。 |
| 有保修吗 | 6个月质保。期内质量问题免费补发。 |
| 能定制吗 | 支持刻字、调节尺寸等定制服务，额外需5-7个工作日。 |
| 有实物照片吗 | 可以提供实拍照片和视频，下单前确认。 |
| 发什么快递 | 根据目的地自动选择FedEx/UPS/EMS/DHL。 |

### 6.6 Dify知识库配置

- **检索模式**: `multiple`（多路召回）
- **Reranking**: `weighted_score`
- **分数阈值**: 0.3
- **Top K**: 5
- **每个阶段独立知识库**：
  - 售前: 产品目录 + 价格表 + 材质说明 + 包装说明 + FAQ
  - 售中: 物流信息 + 订单操作指南 + 支付相关
  - 售后: 退换货政策 + 质保条款 + 补偿方案

---

## 七、STEP 6: 策略评估

### 7.1 规则引擎概述

共 **62条策略规则**，分为三类：
- **转人工规则**: 24条（优先级70-100）
- **拦截规则**: 13条（优先级5-100）
- **营销转化规则**: 25条（优先级35-92）

### 7.2 转人工规则（24条）

#### 售前转人工（8条）

| 规则ID | 条件 | 动作 | 原因 | 优先级 |
|--------|------|------|------|--------|
| `th_pre_01` | 定制咨询 | 转人工 | 定制咨询需要专业顾问 | 90 |
| `th_pre_02` | 批量采购 | 转人工 | 批量采购需要专属报价 | 85 |
| `th_pre_03` | 准备购买 + 订单>$5000 | 转人工 | 高价值订单需要人工跟进 | **95** |
| `th_pre_04` | 客户主动转人工 | 转人工 | 客户主动要求 | **100** |
| `th_pre_05` | VIP客户 | 转人工 | VIP优先人工服务 | 92 |
| `th_pre_06` | 真伪鉴定 | 转人工 | 需要专业客服 | 75 |
| `th_pre_07` | 分期付款 | 转人工 | 需要人工确认方案 | 70 |
| `th_pre_08` | 紧急购买 | 转人工 | 需要快速人工响应 | 88 |

#### 售中转人工（8条）

| 规则ID | 条件 | 动作 | 原因 | 优先级 |
|--------|------|------|------|--------|
| `th_in_01` | 重复扣款 | 转人工 | 紧急财务问题 | **98** |
| `th_in_02` | 取消订单 + 订单>$2000 | 转人工 | 高价值订单挽留 | 90 |
| `th_in_03` | 质检问题 | 转人工 | 需要人工判断 | 85 |
| `th_in_04` | 清关问题 | 转人工 | 需要专业处理 | 88 |
| `th_in_05` | 支付失败 | 转人工 | 需要技术排查 | 80 |
| `th_in_06` | 物流延迟 | 转人工 | 需要人工跟进 | 75 |
| `th_in_07` | 紧急事项 | 转人工 | 紧急处理 | **95** |
| `th_in_08` | VIP客户 + 有订单 | 转人工 | VIP售中优先 | 92 |

#### 售后转人工（8条）

| 规则ID | 条件 | 动作 | 原因 | 优先级 |
|--------|------|------|------|--------|
| `th_after_01` | 投诉升级 | 转人工 | 主管介入 | **100** |
| `th_after_02` | 退货 + 订单>$3000 | 转人工 | 高价值退货审核 | 90 |
| `th_after_03` | 产品投诉 | 转人工 | 专业客服处理 | 85 |
| `th_after_04` | 补偿诉求 | 转人工 | 需要人工审批 | 78 |
| `th_after_05` | 保修索赔 | 转人工 | 需要人工核实 | 75 |
| `th_after_06` | 服务投诉 | 转人工 | 主管处理 | 88 |
| `th_after_07` | VIP客户 | 转人工 | VIP售后优先 | 92 |
| `th_after_08` | 退款申请 | 转人工 | 需要人工处理 | 72 |

### 7.3 拦截规则（13条）

| 规则ID | 匹配条件 | 动作 | 原因 | 优先级 |
|--------|----------|------|------|--------|
| `block_01` | 包含"代理"+"加盟" | 拦截 | 招商广告 | 60 |
| `block_02` | 匹配"(微信\|wx).*\\d{5,}" | 拦截 | 引流到其他平台 | 80 |
| `block_03` | 匹配"(赚钱\|日入\|兼职\|副业)" | 拦截 | 传销/诈骗 | 85 |
| `block_04` | 匹配"(http[s]?://\|bit\\.ly)" | 拦截 | 垃圾链接 | 70 |
| `block_05` | 匹配"(色情\|赌博\|彩票)" | 拦截 | 违禁内容 | **100** |
| `block_06` | 匹配"(威胁\|报警\|法院\|律师函)" | 拦截→转人工 | 恶意威胁 | **95** |
| `block_07` | 匹配"(仿\|高仿\|A货\|复刻)" | 拦截 | 假冒商品 | 90 |
| `block_08` | 空消息或极短 | 拦截 | 无意义内容 | 10 |
| `block_09` | 匹配"^测试[\\d]*$" | 拦截 | 测试消息 | 5 |
| `block_10` | 匹配"(私下\|线下交易\|不走平台)" | 拦截 | 绕过平台 | 88 |
| `block_11` | 匹配"(差评威胁\|不给好评\|一星)" | 拦截→转人工 | 差评勒索 | 85 |
| `block_12` | 匹配"(同行\|竞品\|打听)" | 拦截 | 竞品打探 | 65 |
| `block_13` | 匹配"(群发\|群消息\|转发)" | 拦截 | 群发垃圾 | 60 |

### 7.4 营销转化规则（25条）

#### 售前营销（10条）

| 规则ID | 触发条件 | 营销动作 | 优先级 |
|--------|----------|----------|--------|
| `mk_pre_01` | 犹豫客户 | 推送限时优惠(5%off) | 85 |
| `mk_pre_02` | 嫌贵 | 推荐平替或分期 | 80 |
| `mk_pre_03` | 送礼场景 | 推荐礼盒包装+贺卡 | 75 |
| `mk_pre_04` | 对比中 | 强化我方产品优势 | 70 |
| `mk_pre_05` | 主动问优惠 | 推送当前活动 | 88 |
| `mk_pre_06` | 问会员 | 推荐注册会员 | 72 |
| `mk_pre_07` | 准备购买 | 下单引导+赠品 | **92** |
| `mk_pre_08` | 系列咨询 | 推荐搭配套装 | 68 |
| `mk_pre_09` | 套餐咨询 | 组合优惠(10%off) | 82 |
| `mk_pre_10` | 问运费 | 推送满$200包邮 | 55 |

#### 售中营销（8条）

| 规则ID | 触发条件 | 营销动作 | 优先级 |
|--------|----------|----------|--------|
| `mk_in_01` | 订单确认 | 推荐搭配商品 | 50 |
| `mk_in_02` | 验货满意 | 推荐加购保养套装 | 45 |
| `mk_in_03` | 加购意向 | 推送多件折扣 | 65 |
| `mk_in_04` | 想取消订单 | 挽留+提供折扣 | **88** |
| `mk_in_05` | 特殊需求 | 展示增值服务 | 40 |
| `mk_in_06` | 保险咨询 | 推荐运输保险 | 55 |
| `mk_in_07` | 等待收货 | 推送使用指南 | 35 |
| `mk_in_08` | 付款确认 | 订单福利+赠品 | 42 |

#### 售后营销（7条）

| 规则ID | 触发条件 | 营销动作 | 优先级 |
|--------|----------|----------|--------|
| `mk_after_01` | 复购意向 | 老客专属价(8%off) | **90** |
| `mk_after_02` | 问新品 | 新品预告+早鸟价 | 78 |
| `mk_after_03` | 推荐朋友 | 推荐有礼(双方优惠券) | 85 |
| `mk_after_04` | 好评客户 | 邀请加入VIP群 | 70 |
| `mk_after_05` | 保养咨询 | 推荐保养套餐 | 50 |
| `mk_after_06` | 差评客户 | 补偿优惠券挽回 | 82 |
| `mk_after_07` | 换货机会 | 推荐升级款式 | 68 |

### 7.5 条件评估逻辑

```python
# 条件运算符
"eq"       → 精确匹配
"ne"       → 不等于
"gt"       → 大于（数值）
"lt"       → 小于（数值）
"contains" → 包含子串（不区分大小写）
"matches"  → 正则匹配（不区分大小写）
"in"       → 列表成员

# 评估流程
1. 按 phase 筛选规则
2. 按 priority 降序排列
3. 对每条规则的所有 conditions 做 AND 逻辑判断
4. 返回所有匹配的 actions（按优先级排序）
```

---

## 八、STEP 7: 会话打标

### 8.1 标签体系（9维）

根据阶段+意图，自动生成结构化标签用于BI分析和客户画像。

#### 售前标签（3维）

| 标签 | 可选值 | 说明 |
|------|--------|------|
| `pre_sales_stage` | awareness → consideration → evaluation → decision | 购买决策阶段 |
| `pre_sales_result` | high_intent, nurturing, evaluating, browsing | 购买意向强度 |
| `upsell_attempt` | cross_sell, upsell, bundle, none | 交叉/向上销售机会 |

**映射规则**：
- `ready_to_buy` → stage=decision, result=high_intent
- `hesitation` → stage=consideration, result=nurturing
- `gift_purchase` → upsell=cross_sell
- `bulk_purchase` → upsell=bundle

#### 售中标签（3维）

| 标签 | 可选值 | 说明 |
|------|--------|------|
| `order_stage` | tracking, modification, payment, quality_check, logistics, communication | 订单处理阶段 |
| `issue_type` | payment_*, order_*, logistics_*, general | 问题类型 |
| `cross_sell_result` | opportunity, active, none | 交叉销售结果 |

#### 售后标签（3维）

| 标签 | 可选值 | 说明 |
|------|--------|------|
| `session_type` | return_refund, complaint, repair, compensation, repurchase, feedback, general | 会话类型 |
| `resolution_status` | unresolved_escalated, in_progress, resolved_satisfied, unresolved, pending | 解决状态 |
| `compensation_measure` | price_match, goodwill, free_return, pending_review, none | 补偿措施 |

**特殊映射**：
- `escalation` → resolution=unresolved_escalated
- `refund_status` → resolution=in_progress
- `positive_feedback` → resolution=resolved_satisfied
- `negative_feedback` → resolution=unresolved

---

## 九、STEP 8: 回复生成

### 9.1 路由逻辑

```python
# 回复来源决策
if 模板匹配成功:
    reply = 模板填充(知识库变量)
    reply_source = "template"
elif LLM启用 and 置信度 < 0.3:
    reply = DeepSeek生成
    reply_source = "llm"
else:
    reply = 默认兜底回复
    reply_source = "template"
```

### 9.2 模板查找优先级

```
1. _REPLY_TEMPLATES[phase][primary_intent][secondary_intent]  ← 精确匹配
2. _REPLY_TEMPLATES[phase][primary_intent]["general_inquiry"]  ← 大类兜底
3. _DEFAULT_REPLIES[phase]                                     ← 阶段兜底
```

### 9.3 话术模板（核心模板）

#### 9.3.1 售前话术

**产品咨询 — 询价**
```
亲爱的，{product_info}{price_info}如果没有找到您想要的款式，可以告诉我具体品牌和型号，
我帮您查询。我可以发实拍视频给您看看，有喜欢的款式随时告诉我。
```

**产品咨询 — 材质**
```
亲爱的，我来为您说明产品材质。{material_info}首饰具有防水不褪色特性，
一般保色约半年左右。{price_info}日常佩戴注意保养的话，使用寿命会更长。{care_info}
```

**产品咨询 — 真伪**
```
亲爱的，我们是1:1复刻的，相似度99%，所有细节都按照原版制作，
包括刻印、logo等标识。{qc_info} 请放心。
```

**产品咨询 — 包装**
```
亲爱的，我们默认包装是精美礼盒。如果需要原品牌礼盒，需要额外支付20-30美元。
原装盒包含品牌盒子、证书、包装袋等全套配件。
```

**产品咨询 — 保养**
```
亲爱的，经过适当的护理和维护，不会轻易褪色。{material_info}
一般保色约半年到两年，日常佩戴注意避免接触化学品和水，使用寿命会更长。
```

**购买意向 — 准备下单**
```
亲爱的，太好了！{size_info}请确认您的收货地址，下单后我们会尽快安排发货。{qc_info}
```

**购买意向 — 犹豫**
```
亲爱的，{product_info}目前库存有限，最近询问的客户比较多。
我们商店的折扣活动仍在继续，如果您喜欢建议尽早下单。有任何顾虑都可以跟我说。
```

**购买意向 — 嫌贵**
```
亲爱的，理解您的预算考虑。{budget_info}我可以帮您推荐性价比高的款式。
```

**物流咨询 — 运费**
```
亲爱的，运费根据目的地不同有所差异。订单满{free_shipping}可以包邮。
请问您的收货地址在哪里？我帮您查具体运费。
```

**物流咨询 — 国际配送**
```
亲爱的，我们支持全球配送。{shipping_info}。{customs_info}
```

**转人工**
```
好的亲爱的，我马上为您转接人工客服，请稍等。
```

#### 9.3.2 售中话术

**物流查询**
```
亲爱的，我帮您查询了物流信息。您的包裹已发出，{tracking_info}
有任何更新我会及时通知您。
```

**物流延迟**
```
亲爱的，非常抱歉物流比预期慢了。我已经帮您跟进催促，
可能是清关环节需要时间。有最新进展我第一时间通知您。
```

**修改地址**
```
亲爱的，收到！请把新的收货地址发给我，如果包裹还未发出我马上帮您修改。
如果已发出，我联系快递看能否中途转寄。
```

**取消订单**
```
亲爱的，可以问一下取消的原因吗？有什么问题我们可以帮忙解决吗？{cancel_policy_info}
```

**重复扣款**
```
亲爱的，非常抱歉！重复扣款问题我已记录，会立即联系财务处理退款。
{refund_time_info}请放心。
```

**QC质检**
```
亲爱的，没问题！我现在帮您拍质检照片和视频发给您确认，稍等一下。
```

#### 9.3.3 售后话术

**退货**
```
亲爱的，您将负责退货的运费和关税。收到退货后，我们将向您发放70%的退款。
能告诉我原因吗？是因为尺寸不合适还是不喜欢颜色？
```

**退款**
```
亲爱的，抱歉，我们没有退货标签，需要您自行寄回。
我会给您退货地址，但您确定要退款吗？
```

**产品投诉**
```
亲爱的，请问是哪里质量差呢？能拍照发给我看看吗？
```

**维修**
```
亲爱的，请先拍照让我看看损坏情况。我们会给您补发。
```

**补偿**
```
好的，我会为您提供一张40$的回购优惠券。
```

**好评**
```
亲爱的，非常感谢您的认可！作为回头客，我们为您准备了专属优惠。期待再次为您服务！
```

**复购**
```
亲爱的，欢迎回来！我们看到您是老客户，为您准备了回头客专属礼金券。
有喜欢的款式随时联系我！
```

### 9.4 多关注点检测

当客户消息同时包含多个关注点时（如"带盒子吗？有刻印吗？"），系统会检测并**追加补充回答**。

**检测关键词**:

| 关注点 | 关键词 |
|--------|--------|
| `packaging_inquiry` | 盒子, 包装, 礼盒, 原装盒, 原盒 |
| `authenticity_inquiry` | 刻印, 正品, 像正品, 高仿, 复刻, 1:1 |
| `material_inquiry` | 材质, 材料, 什么做的, 真金, 镀金, 纯银 |
| `price_inquiry` | 多少钱, 价格, 报价 |
| `care_inquiry` | 保养, 护理, 褪色, 掉色, 变色 |
| `shipping_cost` | 运费, 包邮 |
| `shipping_time` | 多久到, 几天到, 多长时间 |

### 9.5 模板变量构建

```python
变量来源:
  {product_info}      ← 知识库 find_product_by_entities()
  {price_info}        ← product["price_range"]
  {size_info}         ← product["size_guide"] + product["sizes"]
  {material_info}     ← 实体规范化后的材质说明
  {care_info}         ← product["care"]
  {shipping_info}     ← get_logistics_for_region()
  {tracking_info}     ← order_info["tracking_number"]
  {eta_info}          ← logistics["eta"]
  {customs_info}      ← region["customs_note"]
  {free_shipping}     ← "$200"
  {return_policy_info} ← get_policy("return_policy")
  {qc_info}           ← get_policy("qc_process")
  {cancel_policy_info} ← get_policy("cancel_free") / get_policy("cancel_shipped")
  {budget_info}       ← 根据预算推荐替代款
```

### 9.6 LLM回复提示词

当模板回复不足（置信度<0.3）时，使用LLM生成回复。

**售前LLM提示词**:
```
你是一位专业的珠宝电商售前客服，名叫小美。你的工作是帮助客户了解产品并促成下单。

## 角色设定
- 热情友好，专业耐心
- 熟悉所有珠宝产品：VCA四叶草、卡地亚Love/Juste un Clou/Flex、宝格丽蛇形/B.zero1、蒂芙尼T系列/笑脸
- 材质：14K金($20-60)、18K金($55-120)、玫瑰金、白金、钛钢($15-30)
- 包装：精美小盒默认免费，原品牌礼盒+$20-30

## 回复规范
- 中文回复，语气亲切自然（"亲爱的"开头）
- 主动推荐相关产品和搭配
- 承诺提供实拍视频/图片
- 价格用美元标注
- 如客户问真伪：如实说明是复刻款，强调做工精细
- 如客户砍价：适当给小幅优惠（满$200免运费）
- 回复控制在100字以内
- 多关注点时需全部回答

## 知识库参考
{{#context#}}

## 对话历史
{{conversation_history}}
```

**售中LLM提示词**:
```
你是一位专业的珠宝电商客服，名叫小美。客户有进行中的订单。

## 物流信息
- 发货地：中国（广州/深圳）
- FedEx（美洲/欧洲，7-12天）、EMS（亚洲，5-10天）、DHL（全球，7-15天）
- $200以上免运费，发货前提供QC照片/视频

## 订单操作
- 未发货：可修改地址、尺寸、款式
- 已发货：无法修改
- 取消：未发货全额退款，已发货无法取消

## 回复规范
- 明确操作步骤或预计时间
- 需要信息时主动要求提供订单号
- 回复80字以内

## 知识库参考
{{#context#}}
```

**售后LLM提示词**:
```
你是一位专业的珠宝电商售后客服，名叫小美。

## 售后政策（跨境电商）
- 退货退款：跨境退货运费高昂，一般不支持退货退款
- 质量问题：提供照片/视频后，免费重新发货或补偿$10-30优惠券
- 褪色问题：14K金保色约6个月，过早褪色可免费补发
- 尺寸问题：补偿$10-20优惠券 + 补发正确尺寸
- 断裂/损坏：6个月内质保免费补发
- 投诉：先安抚情绪，再给方案

## 回复规范
- 先表达理解和歉意
- 明确解决方案和时间节点
- 主动要求客户提供问题照片/视频
- 回复100字以内

## 知识库参考
{{#context#}}
```

### 9.7 默认兜底回复

| 阶段 | 兜底回复 |
|------|----------|
| 售前 | 亲爱的，感谢您的咨询！请问有什么可以帮到您的呢？您可以先看看我们的店铺，有喜欢的款式随时联系我。 |
| 售中 | 亲爱的，您的订单我来帮您跟进。有什么具体需要帮助的请告诉我。 |
| 售后 | 亲爱的，售后问题我来帮您处理。请详细描述一下情况，我会尽快给您解决方案。 |

---

## 十、Dify工作流节点映射

### 10.1 完整节点清单

| Agent STEP | Dify节点类型 | 节点数量 | 说明 |
|------------|-------------|----------|------|
| 开始 | `start` | 1 | 5个输入变量 |
| STEP 1 阶段路由 | `question-classifier` | 1 | 3路分支(售前/售中/售后) |
| STEP 2 意图识别 | `question-classifier` | 3 | 每阶段独立分类器 |
| STEP 5 知识库查询 | `knowledge-retrieval` | 3 | 每阶段独立知识库 |
| STEP 3+4+8 LLM回复 | `llm` | 3 | 含兜底+改写+回复生成 |
| STEP 6 策略评估 | `llm` | 2 | 售前砍价+售后投诉 |
| STEP 7 会话打标 | `template-transform` | 3 | 透传回复+附加标签 |
| 直接回复 | `template-transform` | 1 | 转人工/广告固定回复 |
| 结束 | `end` | 6 | 每条分支独立结束 |
| **合计** | | **23** | 24条连线 |

### 10.2 工作流拓扑

```
                                ┌─ 产品咨询 → 知识检索(售前) → LLM(售前) → 打标(售前) → 结束
开始 → 阶段路由 ─┬─ 售前意图 ──┼─ 砍价/优惠 → 策略评估(售前) → 结束
                │             └─ 转人工/广告 → 直接回复 → 结束
                │
                │             ┌─ 订单/物流 → 知识检索(售中) → LLM(售中) → 打标(售中) → 结束
                ├─ 售中意图 ──┤
                │             └─ 转人工/其他 → 直接回复 → 结束
                │
                │             ┌─ 退换/质量 → 知识检索(售后) → LLM(售后) → 打标(售后) → 结束
                └─ 售后意图 ──┼─ 投诉/升级 → 策略评估(售后) → 结束
                              └─ 转人工/其他 → 直接回复 → 结束
```

---

## 附录A: 数据来源

本文档的意图分类、关键词、话术模板均来源于：
- **33,633条WhatsApp真实对话**（5个DeepSeek中文翻译CSV文件）
- **398条筛选后的高质量多轮对话**
- **18条精选完整对话场景**（覆盖售前10+售中4+售后4）

## 附录B: 文件索引

| 文件 | 说明 |
|------|------|
| `agent/rules/intent_trees.py` | 意图分类树（60+意图，关键词） |
| `agent/rules/rewrite_rules.py` | 改写规则（30条）+ 实体规范化字典（135+条） |
| `agent/rules/strategy_rules.py` | 策略规则（62条） |
| `agent/engine/replier.py` | 回复模板（100+模板） |
| `agent/knowledge/__init__.py` | 知识库（18产品+物流+政策+FAQ） |
| `agent/llm/client.py` | DeepSeek LLM客户端 |
| `agent/chatbiz_agent_workflow.yml` | Dify工作流DSL文件 |
