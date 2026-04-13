from __future__ import annotations

from models.intent import IntentTreeNode, AgentPhase


# ──────────────────────────────────────────────
# 售前意图树 (Pre-sales) — 6大类 60+意图
# ──────────────────────────────────────────────
PRE_SALES_TREE = IntentTreeNode(
    id="pre_sales",
    name="Pre-sales",
    name_zh="售前",
    children=[
        IntentTreeNode(
            id="PRODUCT_INQUIRY",
            name="Product Inquiry",
            name_zh="产品咨询",
            children=[
                IntentTreeNode(id="price_inquiry", name="Price Inquiry", name_zh="价格咨询",
                               keywords=["多少钱", "价格", "报价", "cost", "price", "how much", "什么价", "几折"]),
                IntentTreeNode(id="spec_inquiry", name="Spec Inquiry", name_zh="规格咨询",
                               keywords=["尺寸", "大小", "重量", "规格", "size", "dimension", "weight", "长度", "宽度"]),
                IntentTreeNode(id="material_inquiry", name="Material Inquiry", name_zh="材质咨询",
                               keywords=["材质", "材料", "什么做的", "material", "gold", "silver", "黄金", "白金", "铂金", "K金",
                                          "真金", "镀金", "纯银", "合金", "925银", "18K", "14K", "不锈钢", "钛钢",
                                          "褪色", "掉色", "变色", "变绿", "变黑", "防水"]),
                IntentTreeNode(id="availability_inquiry", name="Availability", name_zh="库存查询",
                               keywords=["有货", "库存", "现货", "available", "in stock", "还有吗", "能买到"]),
                IntentTreeNode(id="product_comparison", name="Product Comparison", name_zh="产品对比",
                               keywords=["对比", "区别", "哪个好", "compare", "difference", "vs", "推荐哪个"]),
                IntentTreeNode(id="customization_inquiry", name="Customization", name_zh="定制咨询",
                               keywords=["定制", "定做", "customize", "custom", "刻字", "改尺寸", "个性化"]),
                IntentTreeNode(id="authenticity_inquiry", name="Authenticity", name_zh="真伪查询",
                               keywords=["正品", "真假", "authentic", "genuine", "鉴定", "证书", "验货", "刻印", "logo", "标识", "像正品", "高仿", "复刻", "1:1"]),
                IntentTreeNode(id="packaging_inquiry", name="Packaging Inquiry", name_zh="包装咨询",
                               keywords=["盒子", "包装", "礼盒", "原装盒", "box", "packaging", "带盒子", "有盒子", "配盒子", "原盒"]),
                IntentTreeNode(id="brand_inquiry", name="Brand Inquiry", name_zh="品牌咨询",
                               keywords=["品牌", "brand", "牌子", "哪个牌子", "什么牌子"]),
                IntentTreeNode(id="collection_inquiry", name="Collection Inquiry", name_zh="系列咨询",
                               keywords=["系列", "collection", "新款", "经典款", "限量", "联名"]),
                IntentTreeNode(id="care_inquiry", name="Care Instructions", name_zh="保养咨询",
                               keywords=["保养", "护理", "清洗", "care", "maintain", "怎么保存", "会变色吗",
                                          "不会褪色吧", "会不会褪色", "能戴多久", "防水吗"]),
            ],
        ),
        IntentTreeNode(
            id="PURCHASE_INTENT",
            name="Purchase Intent",
            name_zh="购买意向",
            children=[
                IntentTreeNode(id="ready_to_buy", name="Ready to Buy", name_zh="准备购买",
                               keywords=["我要买", "下单", "购买", "buy", "order", "拍", "要了", "就这个"]),
                IntentTreeNode(id="gift_purchase", name="Gift Purchase", name_zh="礼物购买",
                               keywords=["送礼", "gift", "礼物", "送人", "生日", "纪念日", "情人节", "圣诞"]),
                IntentTreeNode(id="bulk_purchase", name="Bulk Purchase", name_zh="批量购买",
                               keywords=["批发", "wholesale", "大量", "团购", "bulk", "批量", "多件"]),
                IntentTreeNode(id="hesitation", name="Hesitation", name_zh="犹豫不决",
                               keywords=["考虑", "想想", "再看看", "hesitate", "think about", "不确定", "纠结"]),
                IntentTreeNode(id="budget_concern", name="Budget Concern", name_zh="预算顾虑",
                               keywords=["太贵", "便宜", "优惠", "折扣", "budget", "expensive", "cheaper", "打折"]),
                IntentTreeNode(id="urgency_purchase", name="Urgent Purchase", name_zh="紧急购买",
                               keywords=["急", "尽快", "今天", "马上", "urgent", "asap", "赶时间", "急需"]),
            ],
        ),
        IntentTreeNode(
            id="SHIPPING_INQUIRY",
            name="Shipping Inquiry",
            name_zh="物流咨询",
            children=[
                IntentTreeNode(id="shipping_cost", name="Shipping Cost", name_zh="运费咨询",
                               keywords=["运费", "邮费", "shipping cost", "delivery fee", "包邮", "免运费"]),
                IntentTreeNode(id="shipping_time", name="Shipping Time", name_zh="到货时间",
                               keywords=["多久到", "几天", "delivery time", "shipping time", "到货时间", "什么时候到",
                                          "要多久", "多长时间", "多久能到", "几天到"]),
                IntentTreeNode(id="shipping_method", name="Shipping Method", name_zh="配送方式",
                               keywords=["快递", "配送", "shipping method", "express", "顺丰", "EMS", "DHL", "fedex"]),
                IntentTreeNode(id="international_shipping", name="International Shipping", name_zh="国际配送",
                               keywords=["国际", "海外", "international", "overseas", "关税", "清关", "海关",
                                          "寄到", "能寄", "发到", "能发", "配送到", "加拿大", "美国", "英国", "澳大利亚", "墨西哥"]),
                IntentTreeNode(id="shipping_address", name="Shipping Address", name_zh="地址相关",
                               keywords=["地址", "address", "改地址", "收货地址", "邮编"]),
            ],
        ),
        IntentTreeNode(
            id="PAYMENT_INQUIRY",
            name="Payment Inquiry",
            name_zh="支付咨询",
            children=[
                IntentTreeNode(id="payment_method", name="Payment Method", name_zh="支付方式",
                               keywords=["怎么付", "支付", "payment", "pay", "付款方式", "银行卡", "信用卡"]),
                IntentTreeNode(id="installment", name="Installment", name_zh="分期付款",
                               keywords=["分期", "installment", "月付", "花呗", "分几期"]),
                IntentTreeNode(id="payment_security", name="Payment Security", name_zh="支付安全",
                               keywords=["安全", "secure", "payment security", "担保", "保障", "靠谱吗"]),
                IntentTreeNode(id="invoice", name="Invoice", name_zh="发票",
                               keywords=["发票", "invoice", "收据", "receipt", "开票"]),
                IntentTreeNode(id="currency", name="Currency", name_zh="货币汇率",
                               keywords=["汇率", "currency", "美元", "欧元", "人民币", "exchange rate"]),
            ],
        ),
        IntentTreeNode(
            id="PROMOTION_INQUIRY",
            name="Promotion Inquiry",
            name_zh="促销咨询",
            children=[
                IntentTreeNode(id="current_promotion", name="Current Promotions", name_zh="当前优惠",
                               keywords=["活动", "促销", "promotion", "sale", "优惠", "打折", "折扣"]),
                IntentTreeNode(id="coupon_inquiry", name="Coupon", name_zh="优惠券",
                               keywords=["优惠券", "coupon", "code", "折扣码", "满减"]),
                IntentTreeNode(id="membership_benefit", name="Membership", name_zh="会员权益",
                               keywords=["会员", "member", "VIP", "积分", "会员价", "等级"]),
                IntentTreeNode(id="bundle_deal", name="Bundle Deal", name_zh="套餐优惠",
                               keywords=["套餐", "bundle", "搭配", "组合", "套装", "一起买"]),
            ],
        ),
        IntentTreeNode(
            id="SERVICE_INQUIRY",
            name="Service Inquiry",
            name_zh="服务咨询",
            children=[
                IntentTreeNode(id="warranty", name="Warranty", name_zh="保修政策",
                               keywords=["保修", "warranty", "质保", "保证", "售后保障"]),
                IntentTreeNode(id="return_policy", name="Return Policy", name_zh="退货政策",
                               keywords=["退货", "退款", "return", "refund", "退换", "不满意"]),
                IntentTreeNode(id="after_sales_service", name="After-sales Service", name_zh="售后服务",
                               keywords=["售后", "after-sales", "维修", "repair", "保养服务"]),
                IntentTreeNode(id="store_info", name="Store Info", name_zh="门店信息",
                               keywords=["门店", "store", "地址", "在哪", "营业时间", "线下"]),
                IntentTreeNode(id="contact_human", name="Contact Human", name_zh="联系客服",
                               keywords=["人工", "客服", "转人工", "human", "agent", "真人"]),
            ],
        ),
    ],
)


# ──────────────────────────────────────────────
# 售中意图树 (In-sales) — 6大类 20+意图
# ──────────────────────────────────────────────
IN_SALES_TREE = IntentTreeNode(
    id="in_sales",
    name="In-sales",
    name_zh="售中",
    children=[
        IntentTreeNode(
            id="ORDER_STATUS",
            name="Order Status",
            name_zh="订单状态",
            children=[
                IntentTreeNode(id="order_tracking", name="Order Tracking", name_zh="物流追踪",
                               keywords=["物流", "快递", "tracking", "到哪了", "查快递", "运单号"]),
                IntentTreeNode(id="order_confirmation", name="Order Confirmation", name_zh="订单确认",
                               keywords=["订单确认", "confirm", "确认收到", "下单成功", "订单号"]),
                IntentTreeNode(id="delivery_eta", name="Delivery ETA", name_zh="预计到达",
                               keywords=["什么时候到", "预计", "ETA", "几天能到", "到达时间"]),
                IntentTreeNode(id="shipping_delay", name="Shipping Delay", name_zh="物流延迟",
                               keywords=["延迟", "delay", "怎么还没到", "太慢了", "催一下"]),
            ],
        ),
        IntentTreeNode(
            id="ORDER_MODIFICATION",
            name="Order Modification",
            name_zh="订单修改",
            children=[
                IntentTreeNode(id="change_address", name="Change Address", name_zh="修改地址",
                               keywords=["改地址", "change address", "换地址", "地址写错了"]),
                IntentTreeNode(id="change_quantity", name="Change Quantity", name_zh="修改数量",
                               keywords=["改数量", "多买", "少买", "加一个", "减一个"]),
                IntentTreeNode(id="change_product", name="Change Product", name_zh="更换商品",
                               keywords=["换货", "换一个", "change product", "换款", "改颜色"]),
                IntentTreeNode(id="cancel_order", name="Cancel Order", name_zh="取消订单",
                               keywords=["取消", "cancel", "不要了", "退订", "撤销"]),
            ],
        ),
        IntentTreeNode(
            id="PAYMENT_ISSUE",
            name="Payment Issue",
            name_zh="支付问题",
            children=[
                IntentTreeNode(id="payment_failed", name="Payment Failed", name_zh="支付失败",
                               keywords=["支付失败", "payment failed", "付不了", "扣款失败", "付款不成功"]),
                IntentTreeNode(id="double_charge", name="Double Charge", name_zh="重复扣款",
                               keywords=["重复扣款", "扣了两次", "double charge", "多扣了"]),
                IntentTreeNode(id="payment_confirmation", name="Payment Confirmation", name_zh="到账确认",
                               keywords=["到账", "收到钱", "payment received", "已付款", "汇款了"]),
            ],
        ),
        IntentTreeNode(
            id="QUALITY_CHECK",
            name="Quality Check",
            name_zh="质检验收",
            children=[
                IntentTreeNode(id="qc_request", name="QC Request", name_zh="要求验货",
                               keywords=["验货", "QC", "质检", "看照片", "实物图"]),
                IntentTreeNode(id="qc_issue", name="QC Issue", name_zh="质检问题",
                               keywords=["有问题", "瑕疵", "质量问题", "defect", "不对", "和图片不一样"]),
            ],
        ),
        IntentTreeNode(
            id="CUSTOMS_LOGISTICS",
            name="Customs & Logistics",
            name_zh="清关物流",
            children=[
                IntentTreeNode(id="customs_issue", name="Customs Issue", name_zh="清关问题",
                               keywords=["清关", "海关", "customs", "扣关", "关税", "报关"]),
                IntentTreeNode(id="logistics_insurance", name="Logistics Insurance", name_zh="物流保险",
                               keywords=["保险", "insurance", "丢件", "损坏", "理赔"]),
            ],
        ),
        IntentTreeNode(
            id="COMMUNICATION",
            name="Communication",
            name_zh="沟通交流",
            children=[
                IntentTreeNode(id="order_update_request", name="Order Update", name_zh="进度更新",
                               keywords=["进度", "update", "最新情况", "处理到哪了"]),
                IntentTreeNode(id="special_request", name="Special Request", name_zh="特殊要求",
                               keywords=["特殊要求", "备注", "special request", "注意", "帮我"]),
                IntentTreeNode(id="urgent_matter", name="Urgent Matter", name_zh="紧急事项",
                               keywords=["紧急", "urgent", "很急", "赶时间", "加急"]),
            ],
        ),
    ],
)


# ──────────────────────────────────────────────
# 售后意图树 (After-sales) — 6大类 20+意图
# ──────────────────────────────────────────────
AFTER_SALES_TREE = IntentTreeNode(
    id="after_sales",
    name="After-sales",
    name_zh="售后",
    children=[
        IntentTreeNode(
            id="RETURN_REFUND",
            name="Return & Refund",
            name_zh="退货退款",
            children=[
                IntentTreeNode(id="return_request", name="Return Request", name_zh="退货申请",
                               keywords=["退货", "return", "寄回", "退回", "不想要了"]),
                IntentTreeNode(id="refund_request", name="Refund Request", name_zh="退款申请",
                               keywords=["退款", "refund", "退钱", "退回货款", "什么时候退"]),
                IntentTreeNode(id="exchange_request", name="Exchange Request", name_zh="换货申请",
                               keywords=["换货", "exchange", "换一个", "换款式", "换尺寸"]),
                IntentTreeNode(id="refund_status", name="Refund Status", name_zh="退款进度",
                               keywords=["退款进度", "refund status", "退了吗", "退款到哪了", "几天退"]),
            ],
        ),
        IntentTreeNode(
            id="COMPLAINT",
            name="Complaint",
            name_zh="投诉",
            children=[
                IntentTreeNode(id="product_complaint", name="Product Complaint", name_zh="产品投诉",
                               keywords=["投诉", "complaint", "质量太差", "有问题", "假货"]),
                IntentTreeNode(id="service_complaint", name="Service Complaint", name_zh="服务投诉",
                               keywords=["态度差", "服务差", "不满意", "service complaint", "怠慢"]),
                IntentTreeNode(id="logistics_complaint", name="Logistics Complaint", name_zh="物流投诉",
                               keywords=["物流太慢", "快递投诉", "损坏", "丢件", "配送差"]),
                IntentTreeNode(id="escalation", name="Escalation", name_zh="升级投诉",
                               keywords=["投诉升级", "经理", "supervisor", "manager", "上级", "工商"]),
            ],
        ),
        IntentTreeNode(
            id="REPAIR_MAINTENANCE",
            name="Repair & Maintenance",
            name_zh="维修保养",
            children=[
                IntentTreeNode(id="repair_request", name="Repair Request", name_zh="维修申请",
                               keywords=["维修", "repair", "坏了", "修一下", "断了", "掉色"]),
                IntentTreeNode(id="maintenance_service", name="Maintenance", name_zh="保养服务",
                               keywords=["保养", "maintenance", "翻新", "清洗", "抛光"]),
                IntentTreeNode(id="warranty_claim", name="Warranty Claim", name_zh="保修索赔",
                               keywords=["保修", "warranty claim", "在保修期", "免费维修"]),
            ],
        ),
        IntentTreeNode(
            id="COMPENSATION",
            name="Compensation",
            name_zh="补偿诉求",
            children=[
                IntentTreeNode(id="price_adjustment", name="Price Adjustment", name_zh="价格补偿",
                               keywords=["补差价", "price adjustment", "降价了", "买贵了"]),
                IntentTreeNode(id="goodwill_gesture", name="Goodwill Gesture", name_zh="好意补偿",
                               keywords=["补偿", "compensation", "赔偿", "弥补", "给点优惠"]),
                IntentTreeNode(id="free_shipping_return", name="Free Return Shipping", name_zh="免费退回",
                               keywords=["承担运费", "free return", "退货运费", "包退"]),
            ],
        ),
        IntentTreeNode(
            id="REPURCHASE",
            name="Repurchase",
            name_zh="复购意向",
            children=[
                IntentTreeNode(id="reorder", name="Reorder", name_zh="再次购买",
                               keywords=["再买", "reorder", "再来一个", "追加", "同款"]),
                IntentTreeNode(id="new_product_interest", name="New Product Interest", name_zh="新品兴趣",
                               keywords=["新品", "new product", "新款", "上新", "最新"]),
                IntentTreeNode(id="referral", name="Referral", name_zh="转介绍",
                               keywords=["推荐朋友", "referral", "介绍人", "朋友也想买"]),
            ],
        ),
        IntentTreeNode(
            id="FEEDBACK",
            name="Feedback",
            name_zh="反馈评价",
            children=[
                IntentTreeNode(id="positive_feedback", name="Positive Feedback", name_zh="好评",
                               keywords=["好评", "满意", "很好", "positive", "excellent", "棒", "赞"]),
                IntentTreeNode(id="negative_feedback", name="Negative Feedback", name_zh="差评",
                               keywords=["差评", "不满意", "terrible", "bad", "差劲", "后悔"]),
                IntentTreeNode(id="suggestion", name="Suggestion", name_zh="建议",
                               keywords=["建议", "suggestion", "希望", "改进", "能不能"]),
            ],
        ),
    ],
)


def get_tree_by_phase(phase: AgentPhase) -> IntentTreeNode:
    """根据阶段返回对应的意图树"""
    trees = {
        "pre_sales": PRE_SALES_TREE,
        "in_sales": IN_SALES_TREE,
        "after_sales": AFTER_SALES_TREE,
    }
    return trees[phase]
