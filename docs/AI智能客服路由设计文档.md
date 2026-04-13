# ChatBiz AI 智能客服路由设计文档

> 基于 33,633 条真实 WhatsApp 客服对话语料分析
> 涉及店铺：Charm Aries / Clover Jewelry / Raffine Jewelry (Jennifer's Jewelry Selections)
> 业务领域：奢侈品珠宝、手袋、手表（高仿/复刻）跨境电商
> 渠道：WhatsApp 为主，覆盖全球客户

---

## 一、意图分类体系 (Intent Taxonomy)

### 1.1 一级意图（8大类）

| 编号 | 一级意图 | 英文标识 | 出现频率 | 说明 |
|------|----------|----------|----------|------|
| I1 | 商品咨询 | `product_inquiry` | ~30% | 询问商品信息、价格、材质、库存 |
| I2 | 订单服务 | `order_service` | ~20% | 下单、支付、修改订单 |
| I3 | 物流追踪 | `shipping_tracking` | ~18% | 查物流、催单、配送范围 |
| I4 | 售后问题 | `after_sales` | ~12% | 退换货、质量投诉、尺寸不符 |
| I5 | 优惠促销 | `promotion` | ~8% | 优惠券、折扣询问、活动信息 |
| I6 | 客户关系 | `relationship` | ~5% | 问候、感谢、节日祝福 |
| I7 | 店铺信息 | `store_info` | ~4% | 网站链接、目录、实体店信息 |
| I8 | 其他 | `other` | ~3% | 合作咨询、无法识别 |

### 1.2 二级意图（细分）

#### I1 商品咨询
| 二级意图 | 标识 | 实体要求 | 典型 Query |
|----------|------|----------|------------|
| 目录浏览 | `product_inquiry.catalog` | 无实体（泛浏览） | "有产品目录吗" / "发个链接看看" / "你们都卖什么" / "想看看你们的产品" / "有什么好看的" |
| 询价 | `product_inquiry.price` | 需品牌/款式/材质 | "这个手链多少钱" / "价格" / "14K和18K各多少" |
| 款式查询 | `product_inquiry.style` | 需品牌或品类 | "你们有宝格丽灵蛇戒指吗" / "有爱马仕吗" |
| 材质咨询 | `product_inquiry.material` | 需品类或上下文 | "是黄金材质的吗" / "镀金还是纯金" / "什么材质" |
| 质量咨询 | `product_inquiry.quality` | 需品类或上下文 | "会不会掉色" / "褪色吗" / "能戴多久" / "防水吗" / "洗澡能戴吗" / "会不会过敏" |
| 尺寸咨询 | `product_inquiry.size` | 需品类+尺码 | "有什么尺寸" / "能做23厘米的吗" |
| 库存查询 | `product_inquiry.stock` | 需品牌/款式 | "这款有货吗" / "现在卖什么" |
| 定制咨询 | `product_inquiry.customization` | 需品类+定制项 | "可以定制长度吗" / "绳尾帽要金色的" |
| 产品对比 | `product_inquiry.comparison` | 需≥2个对比项 | "14K和18K有什么区别" |
| 实拍/视频 | `product_inquiry.media` | 需品类或上下文 | "请发送耳环的视频" / "有实拍图吗" |
| 新品查看 | `product_inquiry.new_arrival` | 无实体或有品类 | "有新款吗" / "最近上新了什么" / "新款" |

#### I1 实体提取与匹配状态

> **核心设计**：用户说了什么 ≠ 系统能匹配到什么。实体提取的结果分三种情况，每种走完全不同的路由分支。

**三种实体状态**：

| 状态 | 标识 | 定义 | 典型场景 |
|------|------|------|----------|
| 未提及实体 | `no_entity` | 用户消息中没有任何商品相关信息 | "多少钱" / "有货吗" / "发个目录" |
| 提及且匹配 | `entity_matched` | 提取到实体，且在商品库中匹配到1个或多个商品 | "宝格丽灵蛇手镯多少钱" → 匹配到3款 |
| 提及未匹配 | `entity_unmatched` | 提取到实体，但商品库中没有 或 无法识别 | "有Tiffany的吗" / "面包车悬崖" / 发了张模糊图片 |

```
用户消息
    │
    ▼
┌─────────────────────┐
│ 阶段1: 实体提取       │  从消息文本/图片/上下文中提取实体
│ (brand/category/     │
│  product/size/...)   │
└──────────┬──────────┘
           │
     用户是否提及了商品相关信息？
           │
     ┌─────┴──────┐
     │            │
    否            是
     │            │
     ▼            ▼
 no_entity   ┌──────────────────┐
     │       │ 阶段2: 商品库匹配  │
     │       │ 提取到的实体 vs    │
     │       │ 知识库/SKU 库     │
     │       └────────┬─────────┘
     │                │
     │          匹配到商品了吗？
     │                │
     │          ┌─────┴──────┐
     │          │            │
     │         是            否
     │          │            │
     │          ▼            ▼
     │    entity_matched  entity_unmatched
     │     (单个/多个)
     │          │            │
     ▼          ▼            ▼
  路由分支A   路由分支B      路由分支C
```

#### I1 三种实体状态的路由分支

##### 分支A: `no_entity` — 用户未提及任何商品实体

**来源判定**：
- 消息中无品牌、品类、款式、材质等商品关键词
- 无图片附件
- 上下文窗口（最近5条）中也无可指代的商品（排除"这款""这个"等代词场景）

> 注："这款多少钱" 如果上文商家刚发了商品图 → 上下文指代解析成功 → 进入分支B，不属于 no_entity

```yaml
no_entity_routing:
  # 不同意图在 no_entity 状态下的处理

  product_inquiry.price:
    # "多少钱" — 完全不知道问什么
    strategy: guide_to_catalog
    response: |
      亲爱的，您想了解哪款产品的价格呢？
      可以告诉我品牌名称，发图片给我，或者点击目录链接浏览～
      {catalog_link}
    action: 发送目录链接，等待用户补充

  product_inquiry.stock:
    # "有货吗" — 不知道问哪款
    strategy: guide_to_catalog
    response: |
      亲爱的，您想查哪款的库存呢？
      可以告诉我品牌和款式，或者发图片给我～
      这是我们的产品目录：{catalog_link}
    action: 发送目录链接，等待用户补充

  product_inquiry.style:
    # "你们有什么" — 等价于 catalog
    strategy: redirect_to_catalog
    action: 按 product_inquiry.catalog 处理

  product_inquiry.material:
    # "什么材质" — 不知道问哪款
    strategy: general_education
    response: |
      亲爱的，我们的产品主要有以下材质：
      • 14K镀金 — 入门优选，日常佩戴
      • 18K镀金 — 高品质，接近真金色泽
      • 不锈钢/钨钢 — 耐磨不变色
      您在看哪款呢？我帮您确认具体材质～

  product_inquiry.quality:
    # "会掉色吗" — 不知道问哪种材质/商品
    strategy: general_education
    response: |
      亲爱的，耐久度取决于材质：
      • 14K镀金 — 正常佩戴可保持6-12个月
      • 18K镀金 — 可保持1-2年
      • 不锈钢 — 永不变色
      您在看哪款呢？我帮您确认～

  product_inquiry.size:
    strategy: ask_specific
    response: "亲爱的，您想看哪款产品的尺寸呢？不同款式的尺寸范围不太一样～"

  product_inquiry.media:
    strategy: ask_or_send_bestsellers
    response: "亲爱的，您想看哪款的实拍呢？我可以先给您发几款热销的实拍图～"

  product_inquiry.catalog:
    # 本身就是 no_entity 意图，直接响应
    strategy: direct_response
    action: 发送店铺目录链接 + 热门分类导航

  product_inquiry.new_arrival:
    # 允许 no_entity，直接响应
    strategy: direct_response
    action: 发送全品类热门新品列表

  # 通用规则
  marketing_allowed: false  # no_entity 状态禁止营销附加
  next_state: 等待用户补充实体 → 重新进入实体提取
```

##### 分支B: `entity_matched` — 提及实体且匹配到商品

**来源判定**：
- 从消息文本提取到实体（品牌/品类/款式/材质等）
- 或从上下文指代解析得到实体（"这款" + 上文商品）
- 或从用户发送的图片识别到商品（置信度 ≥ 0.8）
- **且**在商品库/SKU库中匹配到至少1个商品

**匹配结果分两种**：

```yaml
entity_matched_routing:
  # 情况B1: 精确匹配 — 匹配到 1 个商品
  single_match:
    condition: matched_products.length == 1
    entity_status: "entity_matched.single"
    action: 直接使用该商品信息回复
    example:
      query: "宝格丽灵蛇戒指18K多少钱"
      matched: SKU-BV-SERPENTI-RING-18K
      response: 直接报价 + 展示商品详情
    marketing_allowed: true  # 可附加交叉销售/升级销售

  # 情况B2: 模糊匹配 — 匹配到多个商品
  multi_match:
    condition: matched_products.length > 1
    entity_status: "entity_matched.multi"
    action: 展示匹配列表，引导用户选择
    sub_strategies:
      # 同品牌同品类多SKU（尺寸/材质/颜色不同）
      same_brand_same_category:
        example:
          query: "卡地亚Love手镯多少钱"
          matched: [Love-14K, Love-18K, Love-RealGold]
        response: |
          亲爱的，卡地亚Love手镯有以下版本：
          ① 14K镀金 — $XX
          ② 18K镀金 — $XX
          ③ 真金 — $XX
          您想了解哪个版本呢？
        marketing: 同时展示各版本是天然的升级销售(MS-02)

      # 同品牌不同品类（戒指/手镯/项链）
      same_brand_diff_category:
        example:
          query: "有宝格丽灵蛇的吗"
          matched: [灵蛇戒指, 灵蛇手镯, 灵蛇项链, 灵蛇耳环]
        response: |
          亲爱的，宝格丽灵蛇系列我们有：
          💎 戒指 — $XX起
          💎 手镯 — $XX起
          💎 项链 — $XX起
          💎 耳环 — $XX起
          您对哪个感兴趣呢？
        marketing: 引导套装购买是天然的凑单激励(MS-03)

      # 跨品牌同品类（搜"手链"匹配到多品牌）
      diff_brand_same_category:
        example:
          query: "有什么手链"
          matched: [卡地亚Love, 宝格丽灵蛇, 梵克雅宝四叶草...]
        response: |
          亲爱的，我们有以下品牌的手链：
          💎 卡地亚 Love/Juste un Clou — $XX起
          💎 宝格丽 灵蛇/B.zero1 — $XX起
          💎 梵克雅宝 四叶草 — $XX起
          您偏好哪个品牌或风格呢？
        marketing: 引导到具体品牌后再执行营销

    marketing_allowed: true  # multi_match 可附加营销，但需与匹配结果相关
```

##### 分支C: `entity_unmatched` — 提及了实体但未匹配到商品

**来源判定**：
- 用户明确说了品牌/商品名，但在商品库中找不到
- 用户发了图片，但图片识别失败或置信度低
- 用户表述的品牌名/商品名有严重拼写错误，NER提取到了但无法映射

**细分场景**：

```yaml
entity_unmatched_routing:
  # 场景C1: 品牌不在经营范围
  brand_not_carried:
    condition: extracted_brand NOT IN brand_catalog
    examples:
      - "有Tiffany的吗" → Tiffany 不在经营范围
      - "有Chanel首饰吗" → Chanel 不在经营范围
    response: |
      亲爱的，我们暂时没有{brand}系列的产品。
      我们目前主营卡地亚、宝格丽、梵克雅宝、爱马仕等品牌的珠宝。
      要看看这些品牌的产品吗？{catalog_link}
    marketing: 引导到现有品牌(MS-01交叉销售变体)
    next_state: 等待用户回应

  # 场景C2: 品牌有但具体款式/型号不存在
  product_not_found:
    condition: extracted_brand IN brand_catalog AND product NOT IN sku_list
    examples:
      - "卡地亚Panthere猎豹戒指有吗" → 品牌有但该款未进货
      - "宝格丽Diva系列" → 品牌有但该系列未进货
    response: |
      亲爱的，{brand}的{product}目前暂时没有货。
      我们有{brand}的其他热门款：
      {brand_hot_products_list}
      要看看这些吗？
    marketing: 推荐同品牌替代款(MS-01)
    next_state: 等待用户回应

  # 场景C3: 拼写错误/表述模糊导致无法识别
  entity_unclear:
    condition: NER提取到内容但无法映射到已知实体
    examples:
      - "面包车悬崖" → Van Cleef 误翻译，需query改写
      - "蛇骨链" → 可能是宝格丽灵蛇，但不确定
      - "那个很火的手链" → 无法确定指哪款
    sub_strategies:
      # 可纠正的拼写/翻译错误
      correctable:
        condition: 通过 query 改写规则可以纠正
        action: 自动纠正 → 重新进入实体匹配 → 变为 entity_matched
        example: "面包车悬崖" → query改写 → "Van Cleef & Arpels" → 匹配成功
      # 不可纠正的模糊表述
      ambiguous:
        condition: 无法确定用户指的是什么
        response: |
          亲爱的，您说的是"{user_text}"吗？
          您是想找以下哪个呢？
          ① {guess_1}
          ② {guess_2}
          或者可以直接发图片给我～
        action: 提供猜测选项 + 引导发图
      # 图片识别失败
      image_unrecognized:
        condition: 用户发了图片但识别置信度 < 0.8
        response: |
          亲爱的，图片看得不太清楚，您想找的是哪个品牌的呢？
          也可以再发一张更清晰的图片，或者告诉我品牌名称～
        action: 引导用户补充文字描述或重发图片

  # 场景C4: 品类不在经营范围
  category_not_carried:
    condition: extracted_category NOT IN business_scope
    examples:
      - "有鞋子吗" → 非经营品类
      - "卖电子产品吗" → 完全不相关
    response: |
      亲爱的，我们暂时不经营{category}。
      我们主营高品质珠宝（手链、戒指、项链、耳环等），也有手表、包包和皮带。
      要看看我们的产品目录吗？{catalog_link}
    marketing: 引导到主营品类

  # 通用规则
  marketing_allowed: conditional  # 仅在推荐替代商品时允许
  log_for_expansion: true  # 记录未匹配实体，供商品库扩充参考
```

#### I1 实体状态决策流程图

```
用户消息: "宝格丽灵蛇手镯多少钱"
         │
         ▼
    实体提取: brand=宝格丽, series=灵蛇, category=手镯
         │
         ▼
    商品库匹配: 找到 3 个 SKU (14K/18K/真金)
         │
         ▼
    entity_matched.multi → 列出3个版本供选择 + 附加升级销售(MS-02)

===

用户消息: "多少钱"
         │
         ▼
    实体提取: 无实体
         │
         ▼
    上下文检查: 最近5条无商品讨论
         │
         ▼
    no_entity → 反问 + 发送目录链接，禁止营销

===

用户消息: "有Tiffany的戒指吗"
         │
         ▼
    实体提取: brand=Tiffany, category=戒指
         │
         ▼
    商品库匹配: Tiffany 不在经营品牌列表
         │
         ▼
    entity_unmatched.brand_not_carried → 告知无此品牌 + 推荐同品类其他品牌

===

用户消息: "面包车悬崖多少钱"
         │
         ▼
    实体提取: 识别到疑似品牌，但无法直接映射
         │
         ▼
    Query改写: "面包车悬崖" → "Van Cleef & Arpels"
         │
         ▼
    重新匹配: 找到梵克雅宝系列商品
         │
         ▼
    entity_matched → 正常回复
```

#### I1 实体状态对后续流程的影响

| 实体状态 | 意图标识后缀 | 路由目标 | 营销策略 | 回复策略 |
|----------|-------------|---------|---------|---------|
| `no_entity` | `.no_entity` | N6c 反问/引导 | 禁止 | 引导用户提供实体 → 重新识别 |
| `entity_matched.single` | `.matched.single` | N6a 直接回复 | 正常执行 | 精准回复 + 可附加交叉/升级推荐 |
| `entity_matched.multi` | `.matched.multi` | N6a 列表回复 | 条件执行 | 展示匹配列表 + 引导选择 |
| `entity_unmatched.brand_not_carried` | `.unmatched.brand` | N6c 替代推荐 | 替代引导 | 告知无此品牌 + 推荐替代 |
| `entity_unmatched.product_not_found` | `.unmatched.product` | N6c 替代推荐 | 同品牌推荐 | 告知无此款 + 推荐同品牌其他热款 |
| `entity_unmatched.entity_unclear` | `.unmatched.unclear` | N6c 确认/重试 | 禁止 | 猜测确认 或 引导发图/重新描述 |
| `entity_unmatched.category_not_carried` | `.unmatched.category` | N6c 品类引导 | 品类引导 | 告知不经营 + 引导主营品类 |

#### I1 实体解析规则

```yaml
entity_resolution:
  # 阶段1: 从当前消息提取实体
  step1_explicit_extraction:
    extract_from: current_message
    entity_types:
      - brand: "卡地亚|Cartier|宝格丽|Bulgari|BV|梵克雅宝|VCA|Van Cleef|爱马仕|Hermes"
      - category: "手链|手镯|项链|戒指|耳环|手表|包|皮带|衣服"
      - material: "14K|18K|纯金|镀金|不锈钢|钨钢|真金"
      - product_name: "灵蛇|Serpenti|Love|Juste un Clou|四叶草|Alhambra|蛇骨|B.zero1"
      - size: "\\d{1,2}(cm|厘米|号|码)"
      - order_id: "[A-Z]{2}\\d{4,6}"
    if_any_found: proceed_to_step2_matching
    if_none_found: proceed_to_step1b_context

  # 阶段1b: 上下文指代解析（仅在step1无结果时触发）
  step1b_context_resolution:
    context_window: 最近 5 条消息（含商家发送的商品链接/图片）
    rules:
      - "这款/这个/它" + 上文有明确商品 → 继承上文实体，proceed_to_step2
      - "这款/这个" + 上文商家刚发送图片/链接 → 继承链接对应商品
      - "还有吗/其他的呢" + 上文有品类讨论 → 继承品类实体
      - 代词指代消解: "它会掉色吗" → 指代上文讨论的商品
    if_resolved: proceed_to_step2_matching (来源标记为 context)
    if_not_resolved: proceed_to_step1c_image

  # 阶段1c: 图片实体识别（仅在消息含图片时触发）
  step1c_image_resolution:
    trigger: 用户消息包含图片
    action: 调用多模态模型识别商品
    output: brand + category + product_name (置信度)
    if_confidence >= 0.8: proceed_to_step2_matching (来源标记为 image)
    if_confidence < 0.8: entity_status = "entity_unmatched.entity_unclear"

  # 如果以上全部无结果
  fallback: entity_status = "no_entity"

  # 阶段2: 商品库匹配（有提取实体时执行）
  step2_product_matching:
    input: step1/1b/1c 提取到的实体
    process:
      1. 先检查 brand 是否在经营范围 → 否则 entity_unmatched.brand_not_carried
      2. 再检查 category 是否在经营范围 → 否则 entity_unmatched.category_not_carried
      3. 用 brand + category + product_name + material 组合检索 SKU 库
      4. 匹配结果:
         - 0 条: entity_unmatched.product_not_found
         - 1 条: entity_matched.single
         - 2+ 条: entity_matched.multi
    fuzzy_matching:
      - 品牌名模糊匹配（编辑距离 ≤ 2）
      - 支持同义词映射: "蛇骨" → "灵蛇Serpenti"
      - 支持 query 改写后重匹配
```

#### I2 订单服务
| 二级意图 | 标识 | 典型 Query |
|----------|------|------------|
| 下单 | `order_service.place_order` | "我想订这个" / "我要三件商品" |
| 支付方式 | `order_service.payment` | "怎么付款" / "可以货到付款吗" |
| 订单确认 | `order_service.confirm` | "订单号CA12050" / "我刚支付了订单" |
| 修改订单 | `order_service.modify` | "能换个尺寸吗" / "多加一条" |
| 未付款提醒 | `order_service.unpaid` | (商家触发) 未付款订单跟进 |

#### I3 物流追踪
| 二级意图 | 标识 | 典型 Query |
|----------|------|------------|
| 查快递 | `shipping.tracking` | "我的订单什么时候到" / "有物流更新吗" |
| 配送范围 | `shipping.coverage` | "能送到越南吗" / "你们发货到塞尔维亚吗" |
| 物流异常 | `shipping.exception` | "包裹还没收到" / "物流信息一周没更新了" |
| 催单 | `shipping.rush` | "能快点发货吗" / "已经等了很久了" |
| 签收确认 | `shipping.delivered` | "收到了" / "我刚收到一条手链" |

#### I4 售后问题
| 二级意图 | 标识 | 典型 Query |
|----------|------|------------|
| 尺寸不符 | `after_sales.size_issue` | "手镯太小了" / "你发错了尺寸" |
| 质量问题 | `after_sales.quality` | "耳环太松了会掉" / "做工有瑕疵" |
| 退换货 | `after_sales.return` | "我可以退货吗" / "想退款" |
| 补发 | `after_sales.resend` | "请再给我发一条" / "可以补发吗" |
| 不满投诉 | `after_sales.complaint` | "上次买的东西让我不太开心" |

#### I5 优惠促销
| 二级意图 | 标识 | 典型 Query |
|----------|------|------------|
| 折扣询问 | `promotion.discount` | "还有额外折扣吗" / "买多件能便宜吗" |
| 优惠券使用 | `promotion.coupon` | "优惠码怎么用" / "有没有优惠券" |
| 砍价 | `promotion.bargain` | "能再便宜点吗" / "竞品只要240" |

#### I6 客户关系
| 二级意图 | 标识 | 典型 Query |
|----------|------|------------|
| 打招呼 | `relationship.greeting` | "你好" / "Hi" / "嗨" |
| 感谢 | `relationship.thanks` | "谢谢" / "太感谢了" |
| 节日祝福 | `relationship.holiday` | "圣诞快乐" / "节日快乐" |
| 闲聊 | `relationship.chitchat` | "最近怎么样" / "你在哪里" |

---

## 二、Query 改写规则 (Query Rewriting)

### 2.1 改写目的
将用户自然语言输入标准化为可被意图识别引擎精准匹配的规范形式。

### 2.2 改写规则表

| 规则编号 | 规则名称 | 原始 Query 示例 | 改写结果 | 说明 |
|----------|----------|-----------------|----------|------|
| QR-01 | 简短词扩展 | "价格" | "请问这个商品的价格是多少" | 单词 query 补全上下文 |
| QR-02 | 图片引用补全 | "这个多少钱" (附图) | "图片中的商品价格是多少" | 带图消息标记 |
| QR-03 | 品牌名纠错 | "面包车悬崖" / "Van Cliff" | "Van Cleef & Arpels (梵克雅宝)" | 品牌名自动纠正 |
| QR-04 | 多语言统一 | "Buenos días" / "Hola" | "[西班牙语] 你好/早上好" | 语言检测+翻译 |
| QR-05 | 缩写展开 | "tks" / "thx" | "谢谢" | 常见缩写还原 |
| QR-06 | 上下文合并 | "我想要" + "2个灵蛇戒指和1个H扣手镯" | "我想订购：2个宝格丽灵蛇戒指+1个爱马仕H扣手镯" | 连续短消息合并 |
| QR-07 | 模糊品类明确 | "有包吗" | "你们销售手袋/背包类产品吗" | 模糊词澄清 |
| QR-08 | 语气词过滤 | "哦好的那谢谢了呢" | "好的，谢谢" | 去除语气词 |
| QR-09 | 订单号提取 | "订单号CA12050，查一下到哪了" | `[订单号:CA12050] 查询物流状态` | 结构化实体提取 |
| QR-10 | 否定意图纠正 | "我不想要手镯" | "排除手镯，只要耳环" | 否定表达明确化 |

### 2.3 上下文窗口规则

```
窗口大小: 最近 10 条消息（含双方）
合并规则:
  - 同一用户连续 3 分钟内的多条消息 → 合并为一条
  - 商家发送链接 + 说明文字 → 合并为一条带链接的商品推荐
  - 用户发送图片 + 文字 → 合并为图文询价
```

---

## 三、回复策略体系 (Response Strategy)

### 3.1 策略路由总览

```
用户消息 → [语言检测] → [Query 改写] → [意图识别] → [策略选择] → [回复生成]
                                              ↓
                                     [上下文状态机]
                                              ↓
                                   [知识库检索 / LLM 生成]
                                              ↓
                                     [话术模板填充]
                                              ↓
                                     [人工审核/直接发送]
```

### 3.2 策略分级

| 策略等级 | 名称 | 触发条件 | 处理方式 | 响应时间 |
|----------|------|----------|----------|----------|
| L1 | 全自动回复 | 意图置信度 > 0.9 + 命中知识库 | LLM 生成 + 模板约束 | < 5s |
| L2 | 半自动回复 | 意图置信度 0.7-0.9 | LLM 生成草稿 → 人工确认 | < 30s |
| L3 | 人工辅助 | 意图置信度 < 0.7 或敏感话题 | 推荐回复 + 人工编辑 | < 2min |
| L4 | 人工接管 | 投诉升级/退款/复杂售后 | 转人工客服 | 即时 |

### 3.3 各意图策略详表

| 意图 | 策略等级 | 核心动作 | 必须包含要素 |
|------|----------|----------|-------------|
| 询价 | L1 | 从商品库取价格 → 模板回复 | 价格 + 材质选项 + 店铺链接 |
| 款式查询 | L1/L2 | 检索商品库 → 推荐链接 | 商品链接 + 图片 + 是否有货 |
| 材质咨询 | L1 | 知识库匹配 → 标准回复 | 材质说明 + 保养提示 |
| 尺寸咨询 | L1 | 知识库匹配 → 尺寸表 | 可选尺寸 + 测量建议 |
| 定制咨询 | L2 | 确认需求 → 报价 | 可定制范围 + 加工周期 |
| 下单 | L2 | 确认商品+尺寸+材质 → 创建订单 | 订单确认 + 支付链接 |
| 支付方式 | L1 | 知识库匹配 | 信用卡/在线支付说明 |
| 查快递 | L1 | 调用物流 API → 状态回复 | 物流链接 + 预计到达时间 |
| 配送范围 | L1 | 知识库匹配 | 是否可达 + 预计时间 + 运费 |
| 物流异常 | L3 | 查询物流 → 联系物流商 | 当前状态 + 解决方案 + 时间承诺 |
| 尺寸不符 | L3/L4 | 确认问题 → 提供方案 | 优惠券/补发/退换 |
| 质量问题 | L4 | 转人工 → 跟进处理 | 道歉 + 具体解决方案 |
| 折扣询问 | L2 | 根据购买数量计算折扣 | 阶梯折扣规则 + 优惠券 |
| 砍价 | L3 | 评估客户价值 → 灵活报价 | 最低价底线 + 增值服务 |
| 打招呼 | L1 | 即时友好回复 | 问候 + 引导需求 |
| 节日祝福 | L1 | 节日模板回复 | 祝福 + 软性推荐 |

### 3.4 营销转化回复策略

> 语料分析发现，真实对话中 **超过 40% 的商家消息** 具有营销性质（交叉销售、追单、优惠刺激等）。以下是系统化的营销转化策略体系。

#### 3.4.1 客户旅程阶段与转化策略

```
客户旅程状态机:

  [曝光] → [触达] → [兴趣] → [考虑] → [意向] → [下单] → [付款] → [收货] → [复购]
     │        │        │        │        │        │        │        │        │
     ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼
  品牌曝光  首次问候  商品咨询  比价犹豫  确认需求  创建订单  完成支付  售后关怀  二次营销
  (被动)   (激活)   (培育)   (攻坚)   (促成)   (锁定)   (交付)   (留存)   (裂变)
```

| 阶段 | 阶段标识 | 客户行为信号 | 转化目标 | 策略等级 |
|------|----------|-------------|----------|----------|
| 触达 | `funnel.reach` | 首次发 "Hi" / "你好" | 兴趣 → 开始咨询 | L1 |
| 兴趣 | `funnel.interest` | 询价 / 看商品 / 要链接 | 考虑 → 加深了解 | L1/L2 |
| 考虑 | `funnel.consider` | "让我想想" / 比价 / 沉默 | 意向 → 消除犹豫 | L2 |
| 意向 | `funnel.intent` | "我想订" / 问尺寸材质 | 下单 → 确认订单 | L2 |
| 下单 | `funnel.order` | 确认订单信息 | 付款 → 完成支付 | L1 |
| 付款 | `funnel.payment` | 支付完成 | 交付 → 等待收货 | L1 |
| 收货 | `funnel.delivered` | 确认签收 / 好评 | 复购 → 二次消费 | L1/L2 |
| 复购 | `funnel.repurchase` | 回头客再次咨询 | 裂变 → 带来新客 | L2 |

#### 3.4.2 七大营销转化策略

##### MS-01: 交叉销售策略 (Cross-Sell)

> **语料依据**：几乎每次发货通知后，商家都会推荐"包包和手表"，是出现频率最高的营销动作。

```yaml
触发条件:
  - 客户完成订单/确认收货后
  - 客户对某个品类表现出兴趣时
  - 任何对话自然结束点

策略规则:
  触发时机:
    - 订单发货通知的末尾（100% 触发）
    - 签收确认后的关怀消息中（100% 触发）
    - 客户表示满意/感谢时（80% 触发）
    - 普通对话结束前（50% 触发）

  推荐逻辑:
    买珠宝 → 推荐包包/手表
    买包包 → 推荐珠宝/手表
    买手表 → 推荐珠宝/包包
    买单品类多件 → 推荐同品牌其他品类

  话术要求:
    - 自然过渡，不生硬
    - 附带对应品类的店铺链接
    - 不超过 2 句话

回复模板:
  嵌入型（附在其他回复后面）:
    "我们还有手袋和手表，如果您看到任何喜欢的东西，请随时联系我！
    {cross_sell_link}"

  独立型:
    "亲爱的，除了珠宝，我们还有精选包包、手表和服饰。
    您可以在这里浏览：{cross_sell_link}
    如果有喜欢的随时告诉我！"
```

##### MS-02: 向上销售策略 (Up-Sell)

> **语料依据**：客户询问 14K 产品时，商家常常同时报出 18K 价格引导升级。

```yaml
触发条件:
  - 客户询价时（同时展示高低配）
  - 客户选择低价材质时
  - 客户是回头客/VIP 时（推真金款）

策略规则:
  材质向上: 14K → 18K → 真金
  套装向上: 单品 → 套装（手链+耳环）
  品牌向上: 普通款 → 热销款 → 限量款
  定制向上: 标准尺寸 → 定制尺寸（附加值感知）

  价格展示顺序（锚定效应）:
    先报 18K 价格（高锚点）→ 再报 14K 价格（显得实惠）
    或: 14K $55 / 18K $125 并列展示

  话术要求:
    - 不贬低低价选项
    - 强调高价选项的差异化价值（"颜色更持久" "更接近真金"）
    - 仅在客户未明确预算时使用

回复模板:
  "亲爱的，这款{product}我们有两种材质：
  - 14K镀金 ${price_14k} — 日常佩戴优选
  - 18K镀金 ${price_18k} — 色泽更接近真金，持久不变色
  如果您追求更好的品质体验，18K是非常好的选择。"

  VIP客户专属:
  "亲爱的，既然您是我们的老客户，我想推荐真金版本给您，
  品质和细节完全不同，${price_real_gold}。
  如果感兴趣我可以发详细图片给您看看。"
```

##### MS-03: 阶梯优惠策略 (Volume Incentive)

> **语料依据**：Clover Jewelry 系统性使用"2件8折、3件7折"+"买包送珠宝"。

```yaml
触发条件:
  - 客户下单 1 件商品时
  - 客户犹豫不决时
  - 客户主动砍价时（用阶梯折扣替代单件降价）

策略规则:
  基础阶梯:
    1 件: 原价
    2 件: 8 折 (20% off)
    3 件+: 7 折 (30% off)

  特殊组合:
    买包送珠宝（指定款）
    买手表 + 珠宝 → 额外 5% off
    满 $300 → 送螺丝刀/配件

  计算展示:
    必须明确显示: 原价 → 折后价 → 节省金额
    示例: "总价$212，给您打八折，实付$170，省$42！"

  追加引导:
    客户买2件时: "亲爱的，如果再加一件就可以享七折了，更划算哦！"

回复模板:
  首次提及:
    "亲爱的，我们目前的优惠政策：
    - 2件商品享 8折
    - 3件及以上享 7折
    - 订购包包赠送精美珠宝
    一起下单更划算！需要帮您搭配推荐吗？"

  促成追加:
    "亲爱的，您目前选了{count}件，总价${total}。
    如果再加{needed_count}件就能享受{next_discount}折了！
    差${gap}就能省更多，要不要再看看其他款？"

  订单确认时:
    "亲爱的，帮您确认：
    {item_list}
    原价 ${original}，{discount_level}折后 ${final}，为您节省 ${saved}！"
```

##### MS-04: 弃单挽回策略 (Abandoned Cart Recovery)

> **语料依据**：多个对话中商家主动发送未支付订单链接 + 优惠券组合。

```yaml
触发条件:
  - 购物车有商品但 24h 未付款
  - 客户询价后 48h 无下文
  - 客户说"让我想想"后 2 天未回复
  - 客户创建订单但未完成支付

触发链路（时间递进）:
  T+1h:   不做任何动作（给客户思考时间）
  T+24h:  第一轮 — 温和提醒 + 订单链接
  T+72h:  第二轮 — 优惠刺激（$10-$20 优惠券）
  T+7d:   第三轮 — 最后提醒 + 更大优惠 / 限时
  T+15d:  归档为流失客户，进入长期唤醒池

策略分层:
  未付款订单:
    → 发送支付链接 + "如果付款遇到问题请告诉我"
    → 附送 $10-$20 优惠券降低门槛

  咨询后未下单:
    → 跟进询问 "您考虑得怎么样了？"
    → 强调热销/库存紧张
    → 提供优惠券

  犹豫中:
    → "让我想想" → 3天后给出最低折扣价
    → "太贵了" → 推荐同款低价材质 or 更多件享更低折扣

回复模板:
  第一轮（T+24h）:
    "亲爱的，我们注意到您有一个未完成的订单。
    如果在支付过程中遇到任何问题，随时告诉我，我来帮您解决。
    {payment_link}"

  第二轮（T+72h）:
    "亲爱的，您之前看的{product_name}还在等您呢！
    我特意为您准备了一张${coupon_amount}优惠券：{coupon_code}
    有效期{expiry_days}天，下单时输入即可使用。"

  第三轮（T+7d）:
    "亲爱的，好久没联系了！您之前看中的{product_name}目前售得很好。
    这是我能给到您的最低价${lowest_price}，限时{expiry_days}天。
    如果需要，请随时联系我！"

  咨询未下单跟进:
    "嗨，朋友，你考虑过订购{product_name}了吗？
    现在我给你最低折扣价${discount_price}。
    随时联系我！"
```

##### MS-05: 社交认同与品质背书策略 (Social Proof)

> **语料依据**：商家频繁使用"热销品""手工制作""真有眼光"等话术。

```yaml
触发条件:
  - 客户犹豫/比价时
  - 客户质疑品质时
  - 客户首次购买高价商品时

策略类型:
  热销背书:
    "这款是我们的热销品，回头客非常多。"
    "这款{product}特别受{region}客户喜欢。"

  品质背书:
    "亲爱的，我们只做高品质产品，品质和做工细节绝对完美，一分钱一分货。"
    "我们使用不易快速变色的高品质材料，颜色非常接近真金。"
    "这款是手工制作的，每个细节都是1:1精工。"

  品味认同:
    "亲爱的，你真有眼光！"
    "这款确实很好看，戴上它你一定是最耀眼的那一个。"

  老客见证:
    "很多老客户都买了这款，反馈都非常满意。"
    （注意：不引用具体客户信息，仅做群体背书）

应用规则:
  - 每次对话最多使用 2 次社交认同话术
  - 不同类型轮换使用，避免重复
  - 品味认同 必须在客户选择商品后使用
  - 品质背书 在客户比价/质疑时使用
  - 热销背书 在客户犹豫时使用
```

##### MS-06: 老客户唤醒与复购策略 (Win-Back & Repurchase)

> **语料依据**：商家对已购客户有系统性的跟进习惯（签收关怀 → 周末问候 → 新品推荐 → 节日促销）。

```yaml
触发条件:
  - 客户签收后 3-7 天无互动
  - 回头客上次购买超过 30 天
  - 节假日/大促活动前
  - 新品上架时

唤醒链路（按时间线）:
  收货后 +3天:  满意度关怀
  收货后 +7天:  交叉品类推荐
  上次购买 +30天: 新品推荐 + 回头客专属券
  上次购买 +60天: "好久不见"唤醒 + 大额优惠券
  上次购买 +90天: 最终唤醒，降至"长期沉默"池

客户分层策略:
  高价值回头客 (VIP):
    → 一对一关怀，语气更亲密
    → 新品优先通知
    → 专属折扣（高于普通客户）
    → "亲爱的，以后需要下单随时联系我，我会为您提供专属礼金券。"

  普通回头客:
    → 群发式但带个性化变量
    → 标准阶梯折扣
    → 节日触发推送

  一次性客户:
    → 签收关怀 1 次
    → 新品推送 1 次
    → 无响应则停止

回复模板:
  签收关怀:
    "亲爱的，包裹收到了吗？还满意吗？
    如果喜欢，期待你再次光临。
    有任何问题随时联系我！"

  回头客唤醒:
    "亲爱的，好久不见了！
    我们最近上了很多新品，{new_product_highlight}。
    这是送给您的专属${coupon_amount}优惠券：{coupon_code}
    有空来看看吧！{shop_link}"

  VIP 专属:
    "亲爱的，想到你了！最近有款新品特别适合你的风格——
    {product_recommendation}
    还没上架，我提前留了一件给你。
    需要的话告诉我，VIP 专享{discount}折！"

  周期性软触达:
    "亲爱的，周末愉快！"
    "亲爱的，最近怎么样？有任何需要随时联系我。"
```

##### MS-07: 场景化营销策略 (Contextual Marketing)

> **语料依据**：商家在圣诞/感恩节/新年等节日前后显著增加营销频率，且会利用"送礼"场景推动多件购买。

```yaml
场景类型:
  节日场景:
    圣诞节 → "送女儿/妻子/朋友的圣诞礼物" → 推荐礼盒/多件套
    新年 → "新年新气象" → 推荐新品
    情人节 → "送爱人" → 推荐情侣款/套装
    母亲节 → "送妈妈" → 推荐经典款

  生活场景:
    "给女儿买" → 推荐年轻时尚款 + 追加"给自己也来一个"
    "送朋友" → 推荐热销款 + "可以帮您包装"
    "出席活动" → 推荐套装搭配

  购买场景:
    批量采购意向 → 专属报价 + 样品试单方案
    首次购买犹豫 → "先买一件试试品质"

触发检测:
  关键词: "送给" "礼物" "女儿" "妻子" "朋友" "圣诞" "新年" "生日" "婚礼"
  时间: 距节日 7-14 天自动激活对应场景

回复模板:
  节日送礼:
    "亲爱的，{holiday}快要到了！
    这些都是今年最受欢迎的礼物款式：{gift_recommendations}
    买{count}件享{discount}折，送礼更有面子！
    需要帮您搭配推荐吗？"

  为他人购买:
    "亲爱的，给{recipient}选礼物真好！
    这款很适合{适合理由}。如果是给{另一个人}的话，这款也很不错——
    {additional_recommendation}
    一起下单还能享受折扣哦！"

  批量/代购意向:
    "嗨！如果您有批量采购需求，我们可以提供更优惠的报价。
    建议先买几件样品看看品质，满意后我们可以商量大单的优惠条件。
    每个包裹都有物流追踪和保险，您不用担心。"
```

#### 3.4.3 营销转化决策矩阵

```yaml
决策引擎规则:

  # 规则 M1: 交叉销售 — 每次发货/签收后必触发
  IF event IN [order_shipped, order_delivered]:
    → 附加 MS-01 交叉销售内容

  # 规则 M2: 向上销售 — 询价时自动展示高低配
  IF intent == product_inquiry.price AND NOT customer.has_stated_budget:
    → 使用 MS-02 同时展示两种材质价格

  # 规则 M3: 阶梯优惠 — 下单1件时自动引导
  IF event == order_placing AND cart.item_count == 1:
    → 使用 MS-03 提示阶梯折扣

  # 规则 M4: 弃单挽回 — 时间驱动自动链路
  IF order.status == unpaid AND time_since_create > 24h:
    → 进入 MS-04 弃单挽回链路

  # 规则 M5: 社交认同 — 客户犹豫/比价时
  IF customer.state == CONSIDERING AND (message CONTAINS "想想" OR message CONTAINS "贵" OR silence > 48h):
    → 使用 MS-05 品质背书 + 热销背书

  # 规则 M6: 老客唤醒 — 时间驱动
  IF customer.level IN [Return, VIP] AND days_since_last_purchase > 30:
    → 进入 MS-06 唤醒链路

  # 规则 M7: 场景营销 — 事件/关键词驱动
  IF (calendar.days_to_holiday < 14) OR (message CONTAINS 送礼关键词):
    → 激活 MS-07 场景化营销

  # 防骚扰保护规则
  GLOBAL_CONSTRAINTS:
    - 单日营销消息 ≤ 2 条（不含订单服务消息）
    - 客户连续 3 次未读 → 暂停 30 天
    - 客户说"不需要"/"别发了" → 永久停止主动营销
    - 两条营销消息间隔 ≥ 4 小时
    - 当地时间 22:00-08:00 不发营销消息
```

#### 3.4.4 营销转化话术模板补充

##### T-MKT-01: 价值锚定话术
```
亲爱的，这款{product}的做工非常精致：
- 品质：1:1精工，每个细节都完美还原
- 材质：{material}，不易变色
- 原版参考价：${original_brand_hint}
- 我们的价格：仅${our_price}
物超所值！需要帮您下单吗？
```

##### T-MKT-02: 限时紧迫话术
```
亲爱的，这款{product}最近卖得特别好，库存不多了。
现在下单我还能给您{special_offer}。
这个优惠{expiry_description}，之后恢复原价。
需要的话我现在就帮您创建订单！
```

##### T-MKT-03: 凑单引导话术
```
亲爱的，您选的{items}非常好看！
现在一共{count}件，总价${total}。
再加{additional_count}件就能享受{next_tier_discount}折了！
我帮您推荐几款热销的搭配？
- {recommendation_1} ${price_1}
- {recommendation_2} ${price_2}
一起下单可以省${save_amount}！
```

##### T-MKT-04: 售后转复购话术
```
亲爱的，很高兴你喜欢{purchased_item}！
戴上它一定非常好看。
我们最近上了很多同系列的新品：
{new_arrivals_link}
作为老客户，下次购买我给您专属{vip_discount}折 + 额外${coupon}优惠券。
随时联系我！
```

##### T-MKT-05: 竞品比价应对话术
```
亲爱的，我理解您的考虑。
我们的价格确实不是最低的，因为我们只做高品质产品——
品质和做工细节绝对完美，很多老客户对比过都选择了我们。
不过考虑到您的预算，我可以给您{adjusted_offer}。
您觉得怎么样？
```

##### T-MKT-06: 赠品/加购策略话术
```
亲爱的，这次订单满${threshold}了！
我额外送您一个{gift_item}作为感谢！
下次购买也会有礼金券等着您。
感谢您的信任和支持！
```

#### 3.4.5 营销效果追踪指标

| 指标名称 | 计算方式 | 目标基准 | 对应策略 |
|----------|----------|----------|----------|
| 咨询转化率 | 下单数 / 咨询数 | ≥ 25% | 全策略 |
| 平均客单价 | 总收入 / 订单数 | ≥ $120 | MS-02, MS-03 |
| 追加购买率 | 追加件数 / 初始件数 | ≥ 30% | MS-03 |
| 弃单挽回率 | 挽回订单 / 弃单总数 | ≥ 15% | MS-04 |
| 复购率 | 复购客户 / 总客户 | ≥ 20% | MS-06 |
| 交叉销售转化率 | 跨品类购买 / 推荐次数 | ≥ 8% | MS-01 |
| 向上销售成功率 | 选高价材质 / 询价次数 | ≥ 35% | MS-02 |
| 营销消息响应率 | 回复数 / 发送数 | ≥ 40% | 全策略 |
| 客户满意度 | 正向反馈 / 总反馈 | ≥ 85% | 全策略 |
| 取消订阅率 | 要求停推 / 推送总客户 | ≤ 3% | 防骚扰约束 |

#### 3.4.6 营销策略 LLM 提示词

```
你是{store_name}的AI营销助手。在客服对话中自然融入营销转化动作。

## 当前营销上下文
- 客户阶段: {funnel_stage}
- 客户等级: {customer_level}
- 购物车: {cart_items}
- 适用策略: {active_strategies}
- 近期活动: {current_promotions}
- 距最近节日: {days_to_holiday}天 ({holiday_name})

## 营销生成规则

### 核心原则
1. 营销内容必须自然融入对话，不能生硬打断
2. 先解决客户的核心问题，再附加营销内容
3. 每条回复最多包含 1 个营销动作
4. 使用"附加式"而非"独立式"营销（嵌入在服务回复中）

### 转化话术技巧
1. 锚定效应: 先展示高价选项，再展示目标价位
2. 损失厌恶: "限时优惠" "库存不多" "优惠即将到期"
3. 从众心理: "热销" "很多客户选择" "回头客推荐"
4. 互惠原则: 先给优惠券/赠品，再引导购买
5. 承诺一致: 客户说"好的"后立即推进下一步
6. 场景代入: "送给女儿一定很开心" "配你的穿搭一定好看"

### 禁止行为
1. 不得在客户投诉/不满时做营销
2. 不得在客户明确拒绝后继续推销
3. 不得夸大产品功效或做虚假承诺
4. 不得诋毁竞品
5. 不得在深夜时段发送营销消息
6. 不得连续发送 2 条以上纯营销消息
7. 不得给出低于系统底线的折扣

### 输出格式
{
  "service_reply": "解决客户问题的回复内容",
  "marketing_action": "MS-XX",
  "marketing_content": "营销附加内容（可为空）",
  "next_followup": {
    "trigger": "触发条件",
    "delay": "延迟时间",
    "template": "T-MKT-XX"
  }
}
```

---

### 3.5 意图-营销关联映射 (Intent-Marketing Linkage)

> **核心发现**：营销转化与用户意图之间存在强关联。语料分析表明，每一种用户意图都对应特定的营销窗口期和最优策略组合。系统应在识别用户意图后，**同步生成服务回复 + 营销附加内容**（双输出模型）。

#### 3.5.1 双输出路由模型

```
用户消息
    │
    ▼
┌──────────────┐
│ N3 意图识别   │
└──────┬───────┘
       │
       ▼
┌──────────────┐    ┌──────────────────┐
│ N5 策略决策   │───►│ 意图→旅程阶段映射  │
└──────┬───────┘    └────────┬─────────┘
       │                     │
       ▼                     ▼
┌──────────────┐    ┌──────────────────┐
│ N6a 服务回复   │    │ N6b 营销附加生成   │
│ (解决问题)    │    │ (转化引导)        │
└──────┬───────┘    └────────┬─────────┘
       │                     │
       ▼                     ▼
┌─────────────────────────────────────┐
│ N7 后处理：合并输出                   │
│ service_reply + marketing_content   │
└─────────────────────────────────────┘
```

**决策链路**：`意图(intent) → 旅程阶段(funnel_stage) → 营销策略(marketing_strategy) → 话术模板(template)`

#### 3.5.2 意图→旅程阶段映射

| 二级意图 | 所处旅程阶段 | 营销窗口类型 |
|----------|-------------|-------------|
| `product_inquiry.catalog` | 触达→兴趣 | 引导浏览窗口 |
| `product_inquiry.new_arrival` | 兴趣 | 新品推荐窗口 |
| `product_inquiry.style` | 兴趣 | 主动推荐窗口 |
| `product_inquiry.price` | 考虑 | 价值锚定窗口 |
| `product_inquiry.material` | 考虑 | 品质说服窗口 |
| `product_inquiry.quality` | 考虑 | 品质保障窗口 |
| `product_inquiry.size` | 意向 | 促成转化窗口 |
| `product_inquiry.stock` | 意向 | 紧迫感窗口 |
| `product_inquiry.comparison` | 考虑 | 升级引导窗口 |
| `product_inquiry.media` | 意向 | 视觉促成窗口 |
| `order_service.place_order` | 下单 | 追加销售窗口 |
| `order_service.payment` | 付款 | 锁定转化窗口 |
| `order_service.unpaid` | 下单→付款 | 挽回窗口 |
| `shipping_tracking.query` | 收货 | 期待值管理窗口 |
| `shipping_tracking.urgent` | 收货 | 安抚+预热窗口 |
| `after_sales.quality_complaint` | 收货 | 补偿转化窗口 |
| `after_sales.size_issue` | 收货 | 换购引导窗口 |
| `after_sales.return` | 收货 | 挽留窗口 |
| `after_sales.positive_feedback` | 复购 | 黄金复购窗口 |
| `promotion.coupon_inquiry` | 考虑 | 优惠锁定窗口 |
| `promotion.discount_request` | 考虑→意向 | 谈判转化窗口 |
| `relationship.greeting` | 触达 | 破冰推荐窗口 |
| `relationship.thanks` | 复购 | 情感营销窗口 |
| `relationship.holiday` | 触达 | 节日营销窗口 |

#### 3.5.3 意图-营销策略关联矩阵

> 语料实证标注：✅ 强关联（语料频繁出现）｜ ⚡ 条件触发 ｜ — 不适用

| 二级意图 | MS-01 交叉销售 | MS-02 升级销售 | MS-03 凑单激励 | MS-04 弃单挽回 | MS-05 社会证明 | MS-06 复购激活 | MS-07 场景营销 |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **I1 商品咨询** | | | | | | | |
| `product_inquiry.catalog` | ✅ | — | ✅ | — | — | ⚡ | ✅ |
| `product_inquiry.new_arrival` | ✅ | ⚡ | ✅ | — | ✅ | ⚡ | ✅ |
| `product_inquiry.style` | ✅ | ⚡ | ✅ | — | ✅ | — | ✅ |
| `product_inquiry.price` | ⚡ | ✅ | ✅ | — | ✅ | — | — |
| `product_inquiry.material` | — | ✅ | — | — | ✅ | — | — |
| `product_inquiry.quality` | — | ✅ | — | — | ✅ | — | — |
| `product_inquiry.size` | ⚡ | — | ⚡ | — | — | — | — |
| `product_inquiry.stock` | ✅ | — | ⚡ | — | ✅ | — | — |
| `product_inquiry.comparison` | — | ✅ | — | — | ✅ | — | — |
| `product_inquiry.media` | — | — | — | — | ✅ | — | ✅ |
| **I2 订单服务** | | | | | | | |
| `order_service.place_order` | ✅ | ✅ | ✅ | — | — | — | — |
| `order_service.payment` | — | — | ⚡ | — | — | — | — |
| `order_service.unpaid` | — | — | ⚡ | ✅ | ✅ | — | — |
| **I3 物流追踪** | | | | | | | |
| `shipping_tracking.query` | ✅ | — | — | — | — | — | ✅ |
| `shipping_tracking.urgent` | — | — | — | — | — | — | — |
| **I4 售后问题** | | | | | | | |
| `after_sales.quality_complaint` | — | ⚡ | — | — | — | ⚡ | — |
| `after_sales.size_issue` | ✅ | — | ⚡ | — | — | — | — |
| `after_sales.positive_feedback` | ✅ | ✅ | — | — | ✅ | ✅ | ✅ |
| **I5 优惠促销** | | | | | | | |
| `promotion.coupon_inquiry` | ✅ | — | ✅ | — | — | ⚡ | — |
| `promotion.discount_request` | — | ✅ | ✅ | — | ✅ | — | — |
| **I6 客户关系** | | | | | | | |
| `relationship.greeting` | ⚡ | — | — | — | — | ⚡ | ✅ |
| `relationship.thanks` | ✅ | — | — | — | — | ✅ | — |

#### 3.5.4 关键关联模式（语料实证）

**模式一：咨询→交叉销售（I1 → MS-01）**
> 语料证据：客户询问一款产品后，商家立即推荐同品牌/同风格的配套产品

```
客户: "有宝格丽灵蛇戒指吗"
商家: "有的亲，这是图片和价格。我们还有配套的灵蛇手镯和项链，一起买套装更好看，还能享受8折优惠哦"
```
**触发规则**: `intent == product_inquiry.style && product_has_matching_set → MS-01 + MS-03`

**模式二：犹豫→社会证明+弃单挽回（考虑阶段 → MS-04 + MS-05）**
> 语料证据：客户表达"考虑一下""太贵了""让我想想"后，商家使用社会证明话术

```
客户: "让我考虑一下"
商家: "好的亲，这款最近很多客户回购，品质很受好评。考虑到您是新客户，我给您争取了一个专属折扣，今天下单可以享受20%优惠"
```
**触发规则**: `intent == order_service.unpaid || text_contains("考虑","想想","太贵") → MS-04 + MS-05`

**模式三：满意反馈→复购激活（I4.positive → MS-01 + MS-06）**
> 语料证据：客户收货并表达满意后，商家立即推荐新品或互补商品

```
客户: "收到了，很满意，天天都戴着"
商家: "谢谢亲的反馈！看您这么喜欢，我们最近新到了一批配套的耳环和项链，老客户享受VIP价格，要看看吗？"
```
**触发规则**: `intent == after_sales.positive_feedback && sentiment == positive → MS-01 + MS-06`

**模式四：物流等待→场景营销（I3 → MS-07）**
> 语料证据：物流等待期间商家发送搭配建议或新品预告

```
客户: "我的包裹到哪了"
商家: "已经到达目的地国家了，预计3-5天到您手上。等包裹的时候可以看看我们新到的手表系列，和您之前买的手链很搭配哦～"
```
**触发规则**: `intent == shipping_tracking.query && package_status == in_transit → MS-07 + MS-01`

**模式五：价格敏感→升级销售+凑单激励（I1.price + I5 → MS-02 + MS-03）**
> 语料证据：客户讨价还价时，商家引导到更高价值组合

```
客户: "能不能便宜点"
商家: "亲，单件的价格已经很优惠了。不过买2件可以打8折，3件打7折，加一条项链凑满两件更划算哦"
```
**触发规则**: `intent == promotion.discount_request → MS-02 + MS-03`

**模式六：售后补偿→换购引导（I4.size/quality → MS-01/MS-02）**
> 语料证据：质量或尺寸问题处理后，引导换购或补偿优惠券

```
客户: "手链太小了，戴不上"
商家: "抱歉亲，我们可以免费重新发一条合适尺寸的。另外送您一张8折优惠券，有效期30天，可以选购其他喜欢的款式"
```
**触发规则**: `intent == after_sales.size_issue → 先解决售后 → MS-01(优惠券引导)`

#### 3.5.5 N5 策略决策节点 - 营销附加规则

```yaml
node: N5-marketing-addon
description: 在 N5 策略决策时，根据意图判断是否附加营销内容

rules:
  # 规则1：绝对禁止营销的场景（情绪安抚优先）
  - condition: "sentiment == very_negative || intent in [after_sales.quality_complaint, shipping_tracking.urgent]"
    marketing_enabled: false
    reason: "客户处于负面情绪，禁止一切营销行为"

  # 规则2：强营销窗口（高转化机会）
  - condition: "intent in [product_inquiry.style, product_inquiry.stock, order_service.place_order]"
    marketing_enabled: true
    strategy_pool: [MS-01, MS-02, MS-03]
    timing: immediate  # 跟随服务回复一起输出
    max_items: 2  # 最多附加2个营销推荐

  # 规则3：软营销窗口（需谨慎）
  - condition: "intent in [shipping_tracking.query, relationship.greeting, relationship.thanks]"
    marketing_enabled: true
    strategy_pool: [MS-07, MS-01]
    timing: delayed_30s  # 服务回复后30秒追加
    max_items: 1

  # 规则4：挽回窗口（紧迫性+优惠）
  - condition: "intent == order_service.unpaid || hesitation_detected"
    marketing_enabled: true
    strategy_pool: [MS-04, MS-05, MS-03]
    timing: immediate
    urgency: high

  # 规则5：复购黄金窗口
  - condition: "intent == after_sales.positive_feedback && sentiment == positive"
    marketing_enabled: true
    strategy_pool: [MS-06, MS-01, MS-07]
    timing: delayed_60s  # 先感谢，后推荐
    max_items: 2

  # 规则6：补偿转化窗口
  - condition: "intent in [after_sales.size_issue, after_sales.return] && resolution_completed"
    marketing_enabled: true
    strategy_pool: [MS-01]
    timing: after_resolution  # 售后解决后才触发
    method: coupon  # 以优惠券形式而非直接推荐

output_format:
  service_reply: "string - 解决用户问题的主回复"
  marketing_action: "MS-XX | null"
  marketing_content: "string | null - 营销附加话术"
  marketing_timing: "immediate | delayed_Ns | after_resolution"
```

#### 3.5.6 N6b 营销共生成提示词（更新）

在原有 N6b 营销回复提示词的基础上，新增意图感知指令：

```
## 意图-营销联动指令（新增）

当前用户意图: {intent}
旅程阶段: {funnel_stage}
推荐营销策略: {recommended_ms_list}
营销窗口类型: {window_type}

### 联动生成规则
1. 你的营销内容必须与用户当前意图强相关，禁止无关推荐
2. 意图为 product_inquiry 时：推荐同品牌/同风格/配套产品
3. 意图为 order_service.place_order 时：推荐互补商品，使用凑单话术
4. 意图为 after_sales.positive_feedback 时：感谢在先，推荐在后，间隔30秒以上
5. 意图为 shipping_tracking.query 时：仅在客户心情平稳时附加新品预告
6. 意图为 promotion.discount_request 时：引导凑单而非直接降价

### 禁止规则
- 客户投诉/催单/情绪负面时，禁止任何营销内容
- 单次对话中营销附加不超过2次
- 不得连续两轮都包含营销内容
- 营销内容占比不超过回复总长度的30%
```

#### 3.5.7 关联效果评估指标

| 指标 | 计算方式 | 目标值 |
|------|----------|--------|
| 意图-营销命中率 | 意图触发营销且客户正向回应 / 总营销触发次数 | > 25% |
| 服务满意度不降级率 | 附加营销后 CSAT 不低于纯服务回复 | > 95% |
| 交叉销售转化率 | 营销推荐后下单数 / 推荐次数 | > 8% |
| 客户反感率 | 客户因营销表达不满 / 总营销次数 | < 3% |
| 营销时机准确率 | 人工评审中营销时机恰当的比例 | > 80% |

---

## 四、知识库内容 (Knowledge Base)

### 4.1 商品知识库

#### 4.1.1 材质体系

| 材质代码 | 材质名称 | 价格区间 | 特点描述 |
|----------|----------|----------|----------|
| 14K | 14K镀金 | $45-$80 | 入门级，日常佩戴优选，颜色持久 |
| 18K | 18K镀金 | $85-$200 | 高品质，颜色接近真金，不易快速变色 |
| SS | 不锈钢/钨钢 | $30-$60 | 耐磨耐腐蚀，不变色 |
| REAL_GOLD | 真金 | $500+ | 纯金/K金，收藏级品质 |

#### 4.1.2 品牌系列

| 品牌 | 热门系列 | 价格范围 | 关键词映射 |
|------|----------|----------|-----------|
| Cartier 卡地亚 | Love 手镯、Juste un Clou | $55-$195 | "卡地亚" "love" "钉子" "螺丝刀" |
| Bulgari 宝格丽 | Serpenti 灵蛇、B.zero1 | $55-$120 | "宝格丽" "灵蛇" "蛇头" "serpenti" |
| Van Cleef 梵克雅宝 | Alhambra 四叶草 | $55-$150 | "四叶草" "梵克" "van cleef" "VCA" |
| Hermès 爱马仕 | Clic H、Kelly | $95-$680 | "爱马仕" "H扣" "clic" "kelly" |
| Tiffany 蒂芙尼 | T系列、HardWear | $45-$120 | "蒂芙尼" "tiffany" "T系列" |
| Fred | Force 10 | $85-$150 | "fred" "force 10" |
| Rolex 劳力士 | (手表) | $120-$400 | "劳力士" "rolex" |

#### 4.1.3 尺寸标准

```
手镯尺寸标准：
  - XS: 15cm (手腕周长 < 14cm)
  - S:  16cm (手腕周长 14-15cm)
  - M:  17cm (手腕周长 15-16cm) ← 最常见
  - L:  18cm (手腕周长 16-17cm)
  - XL: 19cm (手腕周长 17-18cm)
  - 可定制：20cm-24cm

戒指尺寸标准：
  - 美码 5-12 号
  - 建议：提供测量方法指引

项链标准长度：
  - 标准：45cm
  - 可定制长度
```

### 4.2 物流知识库

| 配送区域 | 预计时效 | 运费 | 物流方式 |
|----------|----------|------|----------|
| 美国/加拿大 | 10-20天 | 免运费 | 国际专线 |
| 欧洲 | 12-25天 | 免运费 | 国际专线 |
| 中东/阿联酋 | 10-18天 | 免运费 | 国际专线 |
| 东南亚 | 8-15天 | 免运费 | 国际专线 |
| 南美 | 15-30天 | 免运费 | 国际专线 |
| 非洲 | 15-30天 | 视具体国家 | 国际专线 |
| 全球其他 | 15-30天 | 视具体国家 | EMS/专线 |

```
物流追踪说明：
  - 发货后提供追踪号
  - 追踪链接格式：https://track.yw56.com.cn/en/querydel?nums={tracking_no}
  - 节假日期间（圣诞/新年/春节）延长 5-10 天
  - 不支持到付 (COD)
  - 不支持自提
  - 海外仓中转后生成本地追踪号
```

### 4.3 售后政策知识库

```
退换货政策：
  - 收到商品 7 天内可申请退换
  - 尺寸不符：提供优惠券用于重新购买（$20-$40）
  - 质量问题：免费补发 + 额外优惠券
  - 物流丢失：免费补发
  - 退款：视具体情况，优先提供优惠券方案

补偿阶梯：
  Level 1 - 轻微问题：$10 优惠券
  Level 2 - 一般问题：$20-$30 优惠券
  Level 3 - 严重问题：$40 优惠券 + 免费补发
  Level 4 - 重大投诉：全额退款/补发 + 优惠券
```

### 4.4 折扣规则知识库

```
阶梯折扣规则：
  - 1 件：原价
  - 2 件：8 折 (20% off)
  - 3 件及以上：7 折 (30% off)
  - 大客户/批发：另议

常用优惠码：
  - LUXESAVE10 — 额外 10% 折扣
  - 个性化优惠码 — 商家手动生成（如 THRE1NS31PMG、C989QAFQ355W）

VIP 回头客政策：
  - 多次购买客户自动获得礼金券
  - 下次购买时使用
```

### 4.5 FAQ 知识库

| 问题 | 标准答案 |
|------|----------|
| 是真金吗？ | 我们提供14K镀金和18K镀金两种材质，颜色接近真金，不易快速变色。如需真金版本也有现货，价格较高。 |
| 能泡水吗？ | 不建议长时间浸泡在水中，日常佩戴无影响。 |
| 从哪里发货？ | 从香港直接发货，全球免运费。 |
| 有实体店吗？ | 目前暂无实体店，您可以通过我们的在线商店购买。 |
| 怎么付款？ | 支持信用卡在线支付，我们会为您创建订单并发送支付链接。 |
| 多久能收到？ | 通常 10-25 天，取决于目的地国家。节假日期间可能延长。 |
| 可以退货吗？ | 收到后 7 天内可申请，我们会提供优惠券或补发方案。 |

---

## 五、话术模板库 (Script Templates)

### 5.1 商品咨询类

#### T-PROD-01: 报价模板
```
亲爱的，这款{product_name}我们有两种材质可选：
- 14K镀金：${price_14k}
- 18K镀金：${price_18k}
可选尺寸：{available_sizes}
{shop_link}
如果您购买多件，可享受额外折扣哦！
```

#### T-PROD-02: 商品推荐模板
```
亲爱的，这款{product_name}是我们的热销品，{highlight}。
{shop_link}
您可以点击链接查看详情和实拍图。有任何问题随时联系我！
```

#### T-PROD-03: 材质说明模板
```
亲爱的，我们的产品颜色非常接近真金，使用不易快速变色的高品质材料。
14K镀金适合日常佩戴，18K镀金品质更高，色泽更持久。
如果需要真金版本，我们也有现货，价格会高一些。您可以根据预算来选择！
```

#### T-PROD-04: 定制确认模板
```
亲爱的，我们可以为您定制{custom_item}。
尺寸：{custom_size}
材质：{material}
颜色：{color}
确认后我为您创建订单，加工周期约{production_days}天。
```

### 5.2 订单服务类

#### T-ORDER-01: 创建订单模板
```
亲爱的，帮您确认订单：
{order_items_list}
总价：${total_price}，为您打{discount}折，实付${final_price}
我现在为您创建订单，稍后发送支付链接。
```

#### T-ORDER-02: 支付链接模板
```
亲爱的，这是您的支付链接：
{payment_link}
支持信用卡支付，安全可靠。
付款完成后请告诉我，我为您安排发货。
```

#### T-ORDER-03: 未付款跟进模板
```
亲爱的，我们注意到您有一个未完成的订单。
如果在付款过程中遇到任何问题，请随时告诉我。
这里有一张${coupon_amount}的优惠券送给您：{coupon_code}
```

### 5.3 物流追踪类

#### T-SHIP-01: 发货通知模板
```
亲爱的，您的订单#{order_id}已发货！
追踪号：{tracking_number}
您可以点击以下链接查看物流：
{tracking_link}
预计{estimated_days}天内送达。如有任何疑问，请随时联系我。
```

#### T-SHIP-02: 物流查询回复模板
```
亲爱的，已为您查询物流状态：
{tracking_status}
您可以随时点击链接查看最新轨迹：
{tracking_link}
{additional_note}
```

#### T-SHIP-03: 物流异常处理模板
```
亲爱的，非常抱歉，经查询您的包裹{exception_description}。
我已将情况反馈给物流公司。
{resolution_plan}
如果到{deadline_date}还没有更新，我们会为您{action}。
请放心，我会持续跟进此事。
```

#### T-SHIP-04: 配送范围查询模板
```
可以的！我们可以配送到{country}。
预计配送时间：{estimated_days}天
运费：{shipping_fee}
我们的产品从香港直发，每个包裹都有物流追踪和保险。
```

### 5.4 售后服务类

#### T-AFTER-01: 尺寸不符处理模板
```
亲爱的，非常抱歉给您带来了不便。
我可以为您提供一张${coupon_amount}的优惠券用于重新购买正确尺寸的商品。
优惠券代码：{coupon_code}
下次购买时请告诉我正确的尺寸和订单号，我来协助您。
```

#### T-AFTER-02: 质量问题道歉模板
```
亲爱的，非常抱歉给您带来了不好的体验。
我们非常重视产品质量，这个问题我已经记录并反馈给仓库。
为了弥补，{compensation_plan}。
感谢您一直以来的信任和支持。
```

#### T-AFTER-03: 补发确认模板
```
亲爱的，我已经为您安排补发：
{resend_items}
新的追踪号将在发货后提供给您。
如果之前的包裹后续也送到了，您将会收到两个包裹，都归您。
```

### 5.5 优惠促销类

#### T-PROMO-01: 阶梯折扣说明模板
```
亲爱的，我们目前的优惠活动：
- 购买 2 件享 8 折
- 购买 3 件及以上享 7 折
- 订购包包赠送精美珠宝
有喜欢的商品可以一起下单，更划算哦！
```

#### T-PROMO-02: 优惠券发放模板
```
亲爱的，感谢您的支持！
这是专属于您的${coupon_amount}优惠券：{coupon_code}
下单时输入即可享受折扣。
有任何问题随时联系我！
```

#### T-PROMO-03: 应对砍价模板
```
亲爱的，我们只做高品质产品，虽然价格稍高，但品质和做工细节绝对完美。
不过考虑到您是我们的{customer_level}客户，我可以给您{special_offer}。
这已经是我们能给到的最优价格了！
```

### 5.6 客户关系类

#### T-REL-01: 首次问候模板
```
你好亲爱的！欢迎来到{store_name}！
我们专营高品质珠宝、手袋和手表。
{shop_link}
您在找什么类型的产品呢？请随时告诉我！
```

#### T-REL-02: 售后关怀模板
```
亲爱的，您的包裹应该已经收到了吧？还满意吗？
如果后续有任何需要，随时联系我，我会为您提供专属优惠券。
期待再次为您服务！
```

#### T-REL-03: 节日祝福模板
```
亲爱的，{holiday_name}快乐！
感谢您这一年的信任和支持。祝您和家人节日愉快！
我们店里有很多新品，有空可以来看看哦。
{shop_link}
```

#### T-REL-04: 交叉销售模板
```
亲爱的，我们不仅有珠宝首饰，还有手袋、手表和服饰。
如果您看到任何喜欢的东西，请随时联系我！
{cross_sell_link}
```

---

## 六、LLM 回复路由流程 (Reply Routing)

### 6.1 总体流程图

```
┌─────────────┐
│  用户消息输入  │
└──────┬──────┘
       ▼
┌─────────────┐
│ N1: 预处理节点 │ ← 语言检测、去噪、合并连续消息
└──────┬──────┘
       ▼
┌─────────────┐
│ N2: 实体提取  │ ← 订单号、品牌名、金额、尺寸、优惠码
└──────┬──────┘
       ▼
┌─────────────┐     ┌──────────────┐
│ N3: 意图识别  │────→│ N3a: 多意图拆分 │ (当一条消息含多个意图时)
└──────┬──────┘     └──────────────┘
       ▼
┌─────────────┐
│ N4: 上下文融合 │ ← 读取近10条对话历史 + 客户画像
└──────┬──────┘
       ▼
┌─────────────┐
│ N5: 策略决策  │ ← 根据意图+上下文选择策略等级
└──────┬──────┘
       ▼
  ┌────┴────┬──────────┬──────────┐
  ▼         ▼          ▼          ▼
┌────┐  ┌────┐   ┌─────┐   ┌─────┐
│ L1 │  │ L2 │   │ L3  │   │ L4  │
│全自动│  │半自动│   │人工辅│   │人工接│
└──┬─┘  └──┬─┘   └──┬──┘   └──┬──┘
   ▼       ▼        ▼         ▼
┌────┐  ┌────┐  ┌─────┐  ┌──────┐
│N6a │  │N6b │  │N6c  │  │N6d   │
│知识库│  │LLM │  │LLM  │  │转人工 │
│+模板│  │生成 │  │建议  │  │队列  │
│直出 │  │草稿 │  │+编辑 │  │      │
└──┬─┘  └──┬─┘  └──┬──┘  └──┬───┘
   ▼       ▼        ▼         ▼
┌─────────────┐
│ N7: 回复后处理 │ ← 敏感词过滤、品牌名规避、emoji适配
└──────┬──────┘
       ▼
┌─────────────┐
│ N8: 发送/排队 │ ← 发送到对应渠道 or 入人工处理队列
└─────────────┘
```

### 6.2 节点详细规则

#### N1: 预处理节点

```yaml
规则:
  - 语言检测: 自动识别用户语言（支持 50+ 语言）
  - 翻译: 非中文/英文消息自动翻译为中文处理，回复时翻译回用户语言
  - 去噪:
    - 过滤系统消息: "已成为联系人" / "消息已删除" / "正在等待此消息"
    - 过滤翻译引擎错误: "MYMEMORY WARNING" 类消息
    - 过滤 GIF/图片占位符: "GIF 动态图已被忽略" / "图像已忽略"
  - 消息合并:
    - 同用户 3 分钟内连续消息合并
    - 合并后保留所有实体信息
  - 表情处理:
    - 纯表情消息（🙏 / ❤️ / 😂）→ 标记为 "relationship.reaction"，不触发主动回复

输入: 原始消息文本
输出: 清洗后的标准文本 + 检测到的语言代码
```

#### N2: 实体提取节点

```yaml
提取实体类型:
  order_id:       正则 [A-Z]{2}\d{4,6}（如 CA12050、CJ11766、LC11468）
  tracking_number: 正则 UK\d{9}YP | Z\d{10}
  brand_name:     品牌名词典匹配 + 模糊匹配（含错拼纠正）
  product_type:   [手链|手镯|戒指|耳环|项链|手表|包|行李箱]
  material:       [14K|18K|黄金|玫瑰金|银|不锈钢|钨钢|镀金]
  size:           数字 + cm/mm/号
  price:          $?\d+(\.\d{2})?
  coupon_code:    大写字母+数字组合（6-15位）
  color:          [金色|银色|黑色|粉色|白色|玫瑰金|奶油色]
  quantity:       [一个|两个|三个|\d+件|\d+条|\d+个]
  url:            URL 正则

特殊处理:
  - 品牌名纠错映射:
    "面包车悬崖" → "Van Cleef & Arpels"
    "山度士" → "Cartier Santos"
    "灵蛇" → "Bulgari Serpenti"
    "H扣" → "Hermès Clic H"
    "四叶草" → "Van Cleef Alhambra"
```

#### N3: 意图识别节点

```yaml
模型: fine-tuned classifier + LLM fallback
分类器:
  - 一级分类: 8 类 softmax
  - 二级分类: 每个一级下的子分类
  - 置信度阈值:
    - > 0.9: 高置信 → 直接路由
    - 0.7-0.9: 中置信 → LLM 二次确认
    - < 0.7: 低置信 → 人工辅助

多意图处理 (N3a):
  触发条件: 消息中包含 2+ 个独立意图
  示例: "卡地亚手链多少钱？你们有迷你凯莉吗？爱马仕Clic H手镯呢？"
  处理: 拆分为 3 个独立查询，分别路由，合并回复

上下文意图覆盖规则:
  - 用户刚发送订单号 → 后续 "?" 或 "有更新吗" 自动归类为 shipping.tracking
  - 用户刚完成购买 → "谢谢" 归类为 relationship.thanks 而非新会话
  - 商家刚发送商品链接 → "多少钱" 关联到该商品而非泛询价
```

#### N4: 上下文融合节点

```yaml
上下文窗口:
  - 近 10 条对话记录（含双方）
  - 客户历史画像:
    - 购买次数
    - 累计消费金额
    - 偏好品牌/品类
    - 最近订单状态
    - 客户等级（新客/回头客/VIP）
    - 上次互动时间
    - 历史投诉记录

客户分层:
  新客 (New):       首次咨询，无购买记录
  回头客 (Return):   1-2 次购买
  VIP:              3+ 次购买 或 累计消费 > $500
  批发客户 (Bulk):   单次订购 5+ 件 或 表达批发意向

上下文状态机:
  IDLE → BROWSING → INTERESTED → NEGOTIATING → ORDERING → PAID → SHIPPED → DELIVERED
  └──────────────── COMPLAINT ──────────────────────────────────────────────┘
```

#### N5: 策略决策节点

```yaml
决策矩阵:

  # 规则 1: 高置信常见问题
  IF intent.confidence > 0.9 AND intent IN [greeting, price, tracking, shipping_coverage, payment, faq]:
    → L1 (全自动)

  # 规则 2: 需要确认的操作
  IF intent IN [place_order, modify_order, customization]:
    → L2 (半自动)

  # 规则 3: 涉及金钱/补偿
  IF intent IN [discount_negotiation, size_issue, resend] AND customer.level != VIP:
    → L3 (人工辅助)

  # 规则 4: VIP 客户售后
  IF intent IN [size_issue, resend] AND customer.level == VIP:
    → L2 (半自动，快速处理)

  # 规则 5: 严重问题
  IF intent IN [quality_complaint, refund_request] OR customer.sentiment == ANGRY:
    → L4 (人工接管)

  # 规则 6: 砍价/竞品比较
  IF intent == bargain AND message CONTAINS "竞品价格":
    → L3 (人工辅助，需评估底线)

  # 规则 7: 低置信度 fallback
  IF intent.confidence < 0.7:
    → L3 (人工辅助)

情绪检测触发升级:
  - 连续 2 条包含 "?" 或 "??" → 客户不耐烦，提升紧急度
  - 包含 "退款" "投诉" "差评" → 直接 L4
  - 包含 "你是认真的吗" "不想等了" → 情绪告警
```

#### N6a: 知识库+模板回复（L1）

```yaml
流程:
  1. 根据意图选择对应知识库分区
  2. 检索匹配条目
  3. 选择对应话术模板
  4. 填充变量（商品名、价格、链接等）
  5. 输出回复

模板选择规则:
  product_inquiry.catalog → T-PROD-CATALOG (目录链接+热门分类导航)
  product_inquiry.new_arrival → T-PROD-NEW (新品列表+推荐)
  product_inquiry.price → T-PROD-01
  product_inquiry.style → T-PROD-02
  product_inquiry.material → T-PROD-03
  product_inquiry.quality → T-PROD-03 (品质保障话术变体)
  order_service.payment → T-ORDER-02
  shipping.tracking → T-SHIP-02
  shipping.coverage → T-SHIP-04
  promotion.discount → T-PROMO-01
  relationship.greeting → T-REL-01
  relationship.holiday → T-REL-03
```

#### N6b: LLM 生成草稿（L2）

```yaml
LLM 调用配置:
  model: claude-sonnet-4-6
  temperature: 0.3  # 低温度，保证一致性
  max_tokens: 300

System Prompt:
  """
  你是{store_name}的专业客服代表。

  角色设定：
  - 称呼客户为"亲爱的"
  - 语气温暖友好但专业
  - 适度使用表情（最多1个emoji）
  - 回复简洁不啰嗦

  当前上下文：
  - 客户名称：{customer_name}
  - 客户等级：{customer_level}
  - 当前意图：{detected_intent}
  - 提取实体：{extracted_entities}
  - 近期对话：{recent_messages}

  约束规则：
  1. 不得承诺超出售后政策的补偿
  2. 折扣不得低于 7 折底线（VIP 客户除外）
  3. 必须附带相关商品链接或追踪链接
  4. 不得主动提及"复刻""仿品""高仿"等字眼
  5. 被问到"是正品吗"回答"高品质/1:1工艺"
  6. 涉及退款必须转人工，不得自行承诺
  7. 回复语言与用户语言一致
  """

输出:
  → 生成草稿 → 推送到客服工作台 → 人工审核/修改 → 发送
```

#### N6c: LLM 建议+人工编辑（L3）

```yaml
LLM 调用:
  # 同 N6b，但生成 3 个候选回复
  num_candidates: 3

展示方式:
  - 推荐回复 A（最保守）
  - 推荐回复 B（标准）
  - 推荐回复 C（最灵活）
  - 人工可选择/编辑/完全自写

附加信息面板:
  - 客户画像摘要
  - 历史购买记录
  - 同类问题的历史处理方案
  - 策略建议（如"建议发放$20优惠券"）
```

#### N6d: 转人工队列（L4）

```yaml
触发条件:
  - 退款请求
  - 质量投诉 + 客户情绪激动
  - 连续 3 轮未解决的售后问题
  - 人身安全/法律相关

转接信息包:
  - 客户完整对话历史
  - 意图分析结果
  - 客户画像
  - 建议处理方案
  - 情绪评分
  - 紧急度标记（普通/紧急/加急）

SLA:
  普通: 30分钟内首次响应
  紧急: 10分钟内首次响应
  加急: 5分钟内首次响应
```

#### N7: 回复后处理节点

```yaml
过滤规则:
  敏感词替换:
    "假的" → "高品质复刻"
    "仿品" → "精品"
    "高仿" → "1:1精工"
    "A货" → "顶级品质"

  品牌名规避:
    - 商品名称中品牌名使用间隔符: "C-ar-t-ier" / "B-V"
    - URL 中品牌名混淆: "/ct-bracelets" / "/bv"
    - 不在文字中直接使用注册商标全称

  格式化:
    - 价格统一使用 $ 符号
    - 链接前后空行
    - 手机端友好的短段落

多语言输出:
  - 检测用户语言
  - 回复用同语言生成
  - 支持中英混合（部分客户习惯）
```

#### N8: 发送/排队节点

```yaml
发送策略:
  - L1 回复: 直接发送到 WhatsApp
  - L2 回复: 进入审核队列，等待客服确认后发送
  - L3 回复: 进入编辑队列，等待客服编辑后发送
  - L4 回复: 转入人工客服工作台

限流规则:
  - 同一客户 1 分钟内最多发送 3 条消息
  - 非工作时间（当地时间 22:00-08:00）仅发送自动回复
  - 客户连续未读 3 条消息 → 暂停主动推送

自动触发规则（商家主动）:
  - 发货后自动发送: T-SHIP-01
  - 签收 3 天后: T-REL-02 (售后关怀)
  - 7 天未回复: 发送一次友好跟进
  - 节日当天: T-REL-03
  - 未付款 24h: T-ORDER-03
```

---

## 七、LLM 核心提示词 (Prompts)

### 7.1 意图识别提示词

```
你是一个意图分类引擎，负责分析跨境珠宝电商的客服对话意图。

输入：用户最新消息 + 最近5条对话上下文
输出：JSON 格式

{
  "primary_intent": "一级意图标识",
  "secondary_intent": "二级意图标识",
  "confidence": 0.0-1.0,
  "entities": {
    "order_id": null,
    "brand": null,
    "product_type": null,
    "material": null,
    "size": null,
    "price_mentioned": null,
    "color": null,
    "quantity": null
  },
  "sentiment": "positive|neutral|negative|angry",
  "urgency": "low|medium|high|critical",
  "needs_human": false,
  "multiple_intents": []
}

分类标准：
- product_inquiry: 任何关于商品信息、价格、材质、尺寸、库存的询问
- order_service: 下单、支付、修改订单相关
- shipping_tracking: 物流查询、配送范围、催单
- after_sales: 退换货、质量问题、补偿诉求
- promotion: 折扣、优惠券、砍价
- relationship: 打招呼、感谢、节日祝福、闲聊
- store_info: 店铺链接、目录、公司信息
- other: 以上都不符合

注意：
- "价格" 单独一个词 → product_inquiry.price (置信度 0.95)
- 纯 emoji 或 "好的" "谢谢" → relationship (置信度 0.85)
- 包含订单号 + 疑问 → shipping_tracking (置信度 0.90)
- "?" 或 "??" 单独发送 → 根据上下文推断（通常是催促回复）
```

### 7.2 回复生成提示词

```
你是{store_name}的AI客服助手。根据以下信息生成回复。

## 客户信息
- 名称: {customer_name}
- 等级: {customer_level} (New/Return/VIP/Bulk)
- 语言: {customer_language}
- 当前情绪: {sentiment}

## 当前意图
- 一级: {primary_intent}
- 二级: {secondary_intent}
- 提取实体: {entities}

## 对话上下文
{recent_10_messages}

## 匹配的知识库条目
{kb_entries}

## 推荐话术模板
{template}

## 生成规则
1. 称呼客户为"亲爱的"
2. 语气友好、专业、不卑不亢
3. 回复控制在 3-5 句话内（不含链接）
4. 如涉及价格，必须列出所有可选材质和对应价格
5. 如涉及商品，必须附带商品链接
6. 如涉及物流，必须附带追踪链接
7. 每次回复末尾自然地引导下一步行动
8. 绝不提及"复刻""仿品""高仿"等词
9. 回复语言与客户语言一致
10. VIP 客户语气更亲切，可适当给予更多优惠
11. 新客户回复需附带店铺链接引导浏览
12. 涉及退款/大额补偿不做承诺，引导人工介入

## 禁止行为
- 不得自行承诺退款
- 不得给出低于 7 折的折扣（除非系统标注允许）
- 不得泄露供应链信息（如"从中国发货"直接说"从香港发货"）
- 不得与客户争论
- 不得忽略客户的情绪表达
```

### 7.3 Query 改写提示词

```
你是一个 Query 改写引擎。将用户的原始消息标准化为意图识别友好的格式。

输入: 原始消息 + 最近 3 条上下文
输出: 改写后的标准 Query

改写规则:
1. 单个词/短语 → 补全为完整句子（结合上下文）
2. 多语言混合 → 翻译为中文
3. 品牌名拼写错误 → 纠正为标准名称
4. 缩写/网络用语 → 展开为标准表达
5. 连续短消息 → 合并为一条
6. 提取并标注实体: [品牌:XX] [尺寸:XX] [订单号:XX]
7. 保留用户的核心诉求和情绪信号

示例:
  原始: "价格"
  上下文: 商家刚发送了卡地亚Love手镯链接
  改写: "请问这款卡地亚Love手镯的价格是多少？"

  原始: "tks" + "能寄到胡志明市吗"
  改写: "谢谢。请问可以配送到越南胡志明市吗？"

  原始: "面包车悬崖 23cm"
  改写: "请问有Van Cleef & Arpels(梵克雅宝)手链，尺寸23cm的吗？"
```

---

## 八、商家主动触达策略 (Proactive Outreach)

> 语料分析显示，商家端有大量主动触达行为，需系统化管理。主动触达并非独立于用户意图，而是基于**历史意图信号**和**行为事件**共同驱动。

### 8.1 自动触发场景

| 触发事件 | 延迟 | 动作 | 模板 |
|----------|------|------|------|
| 订单发货 | 即时 | 发货通知 + 交叉销售 | T-SHIP-01 + T-REL-04 |
| 包裹签收 | +3天 | 满意度关怀 | T-REL-02 |
| 新客首次咨询未下单 | +2天 | 跟进 + 优惠券 | T-PROMO-02 |
| 购物车放弃 | +24h | 未付款提醒 | T-ORDER-03 |
| 回头客长时间未复购 | +30天 | 唤醒 + 新品推荐 | T-REL-04 |
| 节日（圣诞/新年等） | 节日当天 | 节日祝福 + 促销 | T-REL-03 |
| 客户生日 | 生日当天 | 生日祝福 + 专属券 | T-REL-03 变体 |

### 8.2 触达事件-意图信号-营销策略 关联映射

> 主动触达的本质是"对历史意图信号的延迟响应"。每个触达事件背后都有一个或多个用户意图作为前置信号，系统需结合历史意图画像选择最优触达内容。

#### 8.2.1 事件-意图-策略三维映射表

| 触发事件 | 前置意图信号（历史） | 旅程阶段 | 关联营销策略 | 触达内容策略 |
|----------|----------------------|----------|-------------|-------------|
| 订单发货 | `order_service.place_order` | 下单→收货 | MS-01 交叉销售 | 基于订单商品推荐配套款：同品牌耳环/项链/手镯互补推荐 |
| 包裹签收 | `shipping_tracking.query` + 物流状态=签收 | 收货→复购 | MS-06 复购激活 + MS-01 交叉销售 | 满意度调研 → 正向反馈则推新品；负向反馈则引导售后 |
| 新客咨询未下单 | `product_inquiry.*`（任意商品咨询）+ 无 `order_service.place_order` | 兴趣→考虑 | MS-04 弃单挽回 + MS-05 社会证明 | 基于咨询过的商品发送优惠券+热销证明 |
| 购物车放弃 | `order_service.place_order` + 无 `order_service.payment` | 下单→付款 | MS-04 弃单挽回 + MS-03 凑单激励 | 未付款提醒 + 限时折扣 + 凑单建议 |
| 回头客未复购 | 历史 `after_sales.positive_feedback` 或高复购评分 | 复购 | MS-06 复购激活 + MS-07 场景营销 | 新品推荐 + 老客专属价 + 节日场景话术 |
| 节日促销 | 任意历史意图（全客群覆盖） | 触达 | MS-07 场景营销 + MS-03 凑单激励 | 节日主题 + 限时折扣 + 客户偏好品类推荐 |
| 客户生日 | 任意历史意图（全客群覆盖） | 触达→复购 | MS-07 场景营销 + MS-06 复购激活 | 生日专属券 + 基于历史偏好的个性化推荐 |

#### 8.2.2 历史意图画像驱动的个性化触达

```yaml
proactive_outreach_rules:
  # 规则1：基于历史咨询品类个性化推荐
  - event: order_shipped
    intent_history_check:
      - look_back: 30d
      - extract: product_inquiry 涉及的品牌和品类
    personalization:
      - 如果历史咨询过 Cartier → 推荐 Cartier 新品/配套
      - 如果历史咨询过多个品牌 → 推荐跨品牌搭配套装
      - 如果历史询价过高价位 → 推荐同系列高端款（MS-02 升级销售）
      - 如果历史只询价低价位 → 推荐同品类入门款（MS-03 凑单激励）

  # 规则2：基于售后历史调整触达策略
  - event: package_delivered_3d
    intent_history_check:
      - look_back: 90d
      - extract: after_sales.* 记录
    personalization:
      - 有质量投诉历史 → 优先关怀而非营销，确认满意后再推荐
      - 有尺寸问题历史 → 附带尺寸指南，推荐可调节款式
      - 无售后记录 → 正常推荐流程
      - 有正面反馈历史 → 直接推荐新品 + VIP 优惠

  # 规则3：基于犹豫信号定制挽回话术
  - event: inquiry_no_order_2d
    intent_history_check:
      - look_back: 7d
      - extract: 犹豫信号（"考虑一下""太贵""让我想想"）和咨询商品
    personalization:
      - 价格犹豫 → 专属折扣码 + 凑单省钱方案（MS-03 + MS-04）
      - 款式犹豫 → 发送更多实拍/视频 + 其他客户搭配图（MS-05）
      - 信任犹豫 → 客户好评截图 + 售后保障说明（MS-05）
      - 无明确犹豫原因 → 温和跟进 + 小额优惠券

  # 规则4：沉默客户分级唤醒
  - event: no_repurchase_30d
    intent_history_check:
      - look_back: 180d
      - extract: 购买频次、客单价、偏好品类、最后活跃意图
    personalization:
      - 高价值客户(≥3单/客单价>$100) → VIP专属新品预览 + 大额券（MS-06）
      - 中价值客户(1-2单) → 爆款推荐 + 限时折扣（MS-06 + MS-07）
      - 低价值客户(仅咨询未购) → 清仓特惠 + 入门款推荐（MS-03）
      - 最后意图为投诉 → 先发关怀消息确认问题已解决，再视反应决定是否营销
```

#### 8.2.3 触达内容生成提示词

```
你是{store_name}的主动触达内容生成引擎。根据以下信息生成一条个性化触达消息。

## 触发事件
- 事件类型: {event_type}
- 触发时间: {trigger_time}

## 客户画像
- 名称: {customer_name}
- 等级: {customer_level}
- 历史订单数: {order_count}
- 平均客单价: {avg_order_value}
- 偏好品类: {preferred_categories}
- 偏好品牌: {preferred_brands}

## 历史意图信号
- 最近30天意图序列: {recent_intent_sequence}
- 上次对话情绪: {last_sentiment}
- 未转化原因(如有): {abandonment_reason}
- 售后历史: {after_sales_history}

## 推荐营销策略
- 主策略: {primary_ms}
- 辅策略: {secondary_ms}
- 推荐商品: {recommended_products}

## 生成规则
1. 消息长度控制在 2-4 句话，简洁有温度
2. 必须有明确的 CTA（行动号召），如"点击查看""回复我了解更多"
3. 根据客户等级调整语气：
   - New: 热情欢迎，强调"新客专属"
   - Return: 亲切回访，强调"老朋友"
   - VIP: 尊贵感，强调"专属""优先"
   - Bulk: 专业感，强调"批发价""量大从优"
4. 基于历史意图信号个性化内容：
   - 提及客户之前感兴趣的具体商品/品牌
   - 呼应客户之前的需求（如"上次您看的那款手链..."）
5. 根据触达事件调整基调：
   - 发货通知 → 兴奋期待感
   - 签收关怀 → 关心体贴感
   - 弃单挽回 → 温和不施压
   - 沉默唤醒 → 自然不突兀
   - 节日/生日 → 节日氛围感
6. 绝不提及"复刻""仿品""高仿"等词
7. 语言与客户历史对话语言一致

## 禁止行为
- 不得给客户施加压力感（"最后一天""再不买就没了"用法克制）
- 不得连续发送2条以上未回复的营销消息
- 不得在客户历史投诉未解决时发送营销内容
- 不得推荐客户之前明确拒绝过的商品
```

#### 8.2.4 触达效果归因

```
触达归因模型:

  主动触达消息
       │
       ▼
  客户行为追踪（7天归因窗口）
       │
       ├── 直接转化: 触达后24h内下单 → 归因到该触达事件+关联营销策略
       ├── 辅助转化: 触达后7天内下单 → 部分归因
       ├── 无效触达: 已读未回复 → 记录触达疲劳度+1
       └── 负面反馈: 客户要求停止 → 立即加入免打扰名单

  归因指标:
  - 触达响应率 = 回复数 / 触达数（目标 > 15%）
  - 触达转化率 = 7天内下单数 / 触达数（目标 > 5%）
  - 个性化提升率 = 个性化触达转化率 / 通用触达转化率（目标 > 1.5x）
  - 触达ROI = 触达带来的GMV / 触达成本
  - 意图命中率 = 触达内容匹配客户实际需求 / 总触达数（人工抽检，目标 > 70%）
```

### 8.3 跟进频率控制

```
新客跟进: 最多 3 次（间隔 2天 → 5天 → 15天），无回复则停止
老客唤醒: 每月最多 2 次
节日祝福: 不限（但同一节日只发一次）
订单相关: 不限（属于服务性质）

绝对红线:
  - 客户明确表示不想被打扰 → 永久停止主动推送
  - 客户连续 3 次未读 → 暂停 30 天
  - 单日推送不超过 2 条（订单通知除外）
```

### 8.4 触达-意图闭环

```
主动触达 → 客户回复 → 产生新意图 → 进入被动服务流程（Section 6 路由）
                                          │
                                          ▼
                                   服务回复 + 营销附加（Section 3.5 双输出模型）
                                          │
                                          ▼
                                   新一轮行为数据 → 更新客户意图画像 → 驱动下一次触达决策
```

> **关键设计**：主动触达不是孤立事件，而是"触达→意图→服务→营销→行为数据→触达"的闭环。每次触达都基于历史意图画像，每次客户互动又丰富意图画像，形成正反馈循环。

---

## 九、数据质量说明 & 优化建议

### 9.1 语料中发现的问题

1. **翻译引擎限额**：部分消息为 "MYMEMORY WARNING" 翻译引擎报错，需在预处理中过滤
2. **多语言混杂**：同一对话中混用中文、英文、西班牙语、塞尔维亚语等，需强化多语言处理
3. **图片依赖**：大量对话依赖图片传递信息（"图像已忽略"），需补充图片理解能力
4. **价格不一致**：同款商品不同店铺报价差异大，需统一价格管理系统
5. **品牌名敏感**：URL 和文字中故意规避品牌名，AI 回复也需遵循此规则

### 9.2 后续优化方向

1. **图片意图识别**：接入多模态模型，识别客户发送的商品图片
2. **智能报价**：基于客户画像和库存动态定价
3. **情绪预警**：实时监测客户情绪变化，提前干预
4. **A/B 测试**：不同话术模板效果对比，持续优化转化率
5. **知识库自动更新**：新品上架/价格调整自动同步到知识库

---

*文档版本: v1.0 | 生成日期: 2026-03-18 | 基于 33,633 条真实对话语料分析*
