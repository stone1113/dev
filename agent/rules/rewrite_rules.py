from __future__ import annotations

from models.query import QueryRewriteRule, EntityExtractionRule


# ──────────────────────────────────────────────
# 实体归一化词典 (珠宝行业)
# ──────────────────────────────────────────────
ENTITY_NORMALIZATION: dict[str, dict[str, str]] = {
    "brand": {
        "vca": "Van Cleef & Arpels",
        "梵克雅宝": "Van Cleef & Arpels",
        "梵克": "Van Cleef & Arpels",
        "van cleef": "Van Cleef & Arpels",
        "cartier": "Cartier",
        "卡地亚": "Cartier",
        "tiffany": "Tiffany & Co.",
        "蒂芙尼": "Tiffany & Co.",
        "bulgari": "Bulgari",
        "宝格丽": "Bulgari",
        "hermes": "Hermès",
        "爱马仕": "Hermès",
        "chanel": "Chanel",
        "香奈儿": "Chanel",
        "dior": "Dior",
        "迪奥": "Dior",
        "gucci": "Gucci",
        "古驰": "Gucci",
        "louis vuitton": "Louis Vuitton",
        "lv": "Louis Vuitton",
        "路易威登": "Louis Vuitton",
        "chaumet": "Chaumet",
        "尚美": "Chaumet",
        "piaget": "Piaget",
        "伯爵": "Piaget",
        "chopard": "Chopard",
        "萧邦": "Chopard",
        "boucheron": "Boucheron",
        "宝诗龙": "Boucheron",
        "harry winston": "Harry Winston",
        "海瑞温斯顿": "Harry Winston",
        "graff": "Graff",
        "格拉夫": "Graff",
        "mikimoto": "Mikimoto",
        "御木本": "Mikimoto",
    },
    "material": {
        "14k": "14K_Gold",
        "14k金": "14K_Gold",
        "18k": "18K_Gold",
        "18k金": "18K_Gold",
        "黄金": "Gold",
        "金": "Gold",
        "gold": "Gold",
        "白金": "White_Gold",
        "white gold": "White_Gold",
        "铂金": "Platinum",
        "pt950": "Platinum",
        "platinum": "Platinum",
        "玫瑰金": "Rose_Gold",
        "rose gold": "Rose_Gold",
        "银": "Silver",
        "925银": "Sterling_Silver",
        "纯银": "Sterling_Silver",
        "sterling silver": "Sterling_Silver",
        "钻石": "Diamond",
        "diamond": "Diamond",
        "珍珠": "Pearl",
        "pearl": "Pearl",
        "红宝石": "Ruby",
        "ruby": "Ruby",
        "蓝宝石": "Sapphire",
        "sapphire": "Sapphire",
        "翡翠": "Jade",
        "jade": "Jade",
        "祖母绿": "Emerald",
        "emerald": "Emerald",
    },
    "product_name": {
        "love": "love",
        "LOVE": "love",
        "四叶草": "alhambra",
        "alhambra": "alhambra",
        "Alhambra": "alhambra",
        "钉子": "juste_un_clou",
        "juste un clou": "juste_un_clou",
        "蛇骨": "serpenti",
        "serpenti": "serpenti",
        "Serpenti": "serpenti",
        "trinity": "trinity",
        "Trinity": "trinity",
        "三色金": "trinity",
        "tiffany t": "tiffany_t",
        "t系列": "tiffany_t",
        "T系列": "tiffany_t",
        "钥匙": "key",
        "key": "key",
        "bzero1": "bzero1",
        "B.zero1": "bzero1",
        "山茶花": "camellia",
        "camellia": "camellia",
        "双c": "cc",
        "双C": "cc",
        "cc": "cc",
        "CC": "cc",
        "心形": "heart",
        "heart": "heart",
    },
    "product_type": {
        "手链": "bracelet",
        "bracelet": "bracelet",
        "手镯": "bangle",
        "bangle": "bangle",
        "项链": "necklace",
        "necklace": "necklace",
        "戒指": "ring",
        "ring": "ring",
        "耳环": "earring",
        "earring": "earring",
        "耳钉": "stud_earring",
        "吊坠": "pendant",
        "pendant": "pendant",
        "胸针": "brooch",
        "brooch": "brooch",
        "手表": "watch",
        "腕表": "watch",
        "watch": "watch",
        "袖扣": "cufflink",
        "cufflink": "cufflink",
        "脚链": "anklet",
        "anklet": "anklet",
    },
    "size": {
        "小号": "S",
        "中号": "M",
        "大号": "L",
        "特大": "XL",
        "small": "S",
        "medium": "M",
        "large": "L",
        "extra large": "XL",
        "xs": "XS",
        "s": "S",
        "m": "M",
        "l": "L",
        "xl": "XL",
    },
}


# ──────────────────────────────────────────────
# 售前 Query 改写规则 (10条)
# ──────────────────────────────────────────────
_PRE_SALES_REWRITE_RULES: list[QueryRewriteRule] = [
    QueryRewriteRule(
        id="pre_price_01",
        agent_phase="pre_sales",
        patterns=["(.*)多少钱", "(.*)价格", "(.*)怎么卖", "(.*)什么价"],
        rewrite_template="查询{product}的价格信息",
        entity_extraction=[
            EntityExtractionRule(entity_type="product_name", patterns=["love", "LOVE", "四叶草", "alhambra", "钉子", "juste un clou", "蛇骨", "serpenti", "trinity", "三色金", "tiffany t", "t系列", "钥匙", "bzero1", "山茶花", "双c", "心形"]),
            EntityExtractionRule(entity_type="product_type", patterns=["手链", "项链", "戒指", "耳环", "手镯", "吊坠", "手表", "胸针"]),
            EntityExtractionRule(entity_type="brand", patterns=["vca", "梵克", "卡地亚", "cartier", "tiffany", "蒂芙尼", "宝格丽", "bulgari", "香奈儿", "chanel"]),
        ],
    ),
    QueryRewriteRule(
        id="pre_material_02",
        agent_phase="pre_sales",
        patterns=["(.*)什么材质", "(.*)什么做的", "(.*)是什么材料"],
        rewrite_template="查询{product}的材质信息",
        entity_extraction=[
            EntityExtractionRule(entity_type="material", patterns=["18k", "14k", "黄金", "白金", "铂金", "钻石", "珍珠"]),
            EntityExtractionRule(entity_type="product_type", patterns=["手链", "项链", "戒指", "耳环"]),
        ],
    ),
    QueryRewriteRule(
        id="pre_stock_03",
        agent_phase="pre_sales",
        patterns=["(.*)有货吗", "(.*)还有吗", "(.*)有现货", "(.*)能买到吗", "有(.*)吗", "(.*)有吗"],
        rewrite_template="查询{product}的库存状态",
        entity_extraction=[
            EntityExtractionRule(entity_type="product_name", patterns=["love", "LOVE", "四叶草", "alhambra", "钉子", "juste un clou", "蛇骨", "serpenti", "trinity", "三色金", "tiffany t", "t系列", "钥匙", "bzero1", "山茶花", "双c", "心形"]),
            EntityExtractionRule(entity_type="product_type", patterns=["手链", "项链", "戒指", "耳环", "手镯", "吊坠"]),
            EntityExtractionRule(entity_type="brand", patterns=["vca", "梵克", "cartier", "卡地亚", "tiffany", "蒂芙尼", "香奈儿", "chanel", "宝格丽", "bulgari"]),
        ],
    ),
    QueryRewriteRule(
        id="pre_compare_04",
        agent_phase="pre_sales",
        patterns=["(.*)和(.*)哪个好", "(.*)对比(.*)", "(.*)区别"],
        rewrite_template="对比{product_a}和{product_b}的差异",
        entity_extraction=[
            EntityExtractionRule(entity_type="brand", patterns=["vca", "梵克", "cartier", "卡地亚", "tiffany", "蒂芙尼"]),
        ],
    ),
    QueryRewriteRule(
        id="pre_custom_05",
        agent_phase="pre_sales",
        patterns=["(.*)能定制吗", "(.*)定做", "(.*)刻字", "(.*)改尺寸"],
        rewrite_template="咨询{product}的定制服务",
        entity_extraction=[
            EntityExtractionRule(entity_type="product_type", patterns=["手链", "项链", "戒指", "耳环"]),
        ],
    ),
    QueryRewriteRule(
        id="pre_shipping_06",
        agent_phase="pre_sales",
        patterns=["(.*)运费多少", "(.*)包邮吗", "(.*)怎么发货"],
        rewrite_template="查询配送方式和运费信息",
        entity_extraction=[],
    ),
    QueryRewriteRule(
        id="pre_auth_07",
        agent_phase="pre_sales",
        patterns=["(.*)正品吗", "(.*)真的吗", "(.*)有证书吗", "(.*)鉴定"],
        rewrite_template="咨询{product}的真伪验证和证书",
        entity_extraction=[
            EntityExtractionRule(entity_type="brand", patterns=["vca", "梵克", "cartier", "卡地亚", "tiffany", "蒂芙尼"]),
        ],
    ),
    QueryRewriteRule(
        id="pre_gift_08",
        agent_phase="pre_sales",
        patterns=["(.*)送女朋友", "(.*)送老婆", "(.*)送礼", "(.*)礼物推荐"],
        rewrite_template="推荐适合送礼的{product}",
        entity_extraction=[
            EntityExtractionRule(entity_type="product_type", patterns=["手链", "项链", "戒指", "耳环", "手表"]),
            EntityExtractionRule(entity_type="budget", patterns=["\\d+[万千百]?[以内左右]?"]),
        ],
    ),
    QueryRewriteRule(
        id="pre_discount_09",
        agent_phase="pre_sales",
        patterns=["(.*)有优惠吗", "(.*)打折吗", "(.*)折扣", "(.*)能便宜"],
        rewrite_template="查询当前优惠活动和折扣信息",
        entity_extraction=[],
    ),
    QueryRewriteRule(
        id="pre_warranty_10",
        agent_phase="pre_sales",
        patterns=["(.*)保修吗", "(.*)售后怎么样", "(.*)保障"],
        rewrite_template="咨询售后保修和服务保障政策",
        entity_extraction=[],
    ),
]


# ──────────────────────────────────────────────
# 售中 Query 改写规则 (10条)
# ──────────────────────────────────────────────
_IN_SALES_REWRITE_RULES: list[QueryRewriteRule] = [
    QueryRewriteRule(
        id="in_tracking_01",
        agent_phase="in_sales",
        patterns=["(.*)到哪了", "(.*)物流", "(.*)快递查询", "(.*)运单号"],
        rewrite_template="查询订单{order_number}的物流状态",
        entity_extraction=[
            EntityExtractionRule(entity_type="order_number", patterns=["[A-Z]{2}\\d{8,}", "\\d{10,}"]),
        ],
    ),
    QueryRewriteRule(
        id="in_delay_02",
        agent_phase="in_sales",
        patterns=["(.*)怎么还没到", "(.*)太慢了", "(.*)催一下", "(.*)延迟"],
        rewrite_template="催促订单{order_number}的配送进度",
        entity_extraction=[
            EntityExtractionRule(entity_type="order_number", patterns=["[A-Z]{2}\\d{8,}", "\\d{10,}"]),
        ],
    ),
    QueryRewriteRule(
        id="in_modify_03",
        agent_phase="in_sales",
        patterns=["(.*)改地址", "(.*)换地址", "(.*)地址写错了"],
        rewrite_template="修改订单{order_number}的收货地址",
        entity_extraction=[
            EntityExtractionRule(entity_type="order_number", patterns=["[A-Z]{2}\\d{8,}", "\\d{10,}"]),
        ],
    ),
    QueryRewriteRule(
        id="in_cancel_04",
        agent_phase="in_sales",
        patterns=["(.*)取消订单", "(.*)不要了", "(.*)退订"],
        rewrite_template="取消订单{order_number}",
        entity_extraction=[
            EntityExtractionRule(entity_type="order_number", patterns=["[A-Z]{2}\\d{8,}", "\\d{10,}"]),
        ],
    ),
    QueryRewriteRule(
        id="in_payment_05",
        agent_phase="in_sales",
        patterns=["(.*)付不了", "(.*)支付失败", "(.*)扣款失败"],
        rewrite_template="处理订单{order_number}的支付问题",
        entity_extraction=[
            EntityExtractionRule(entity_type="order_number", patterns=["[A-Z]{2}\\d{8,}", "\\d{10,}"]),
        ],
    ),
    QueryRewriteRule(
        id="in_double_charge_06",
        agent_phase="in_sales",
        patterns=["(.*)扣了两次", "(.*)重复扣款", "(.*)多扣了"],
        rewrite_template="处理订单{order_number}的重复扣款问题",
        entity_extraction=[
            EntityExtractionRule(entity_type="order_number", patterns=["[A-Z]{2}\\d{8,}", "\\d{10,}"]),
        ],
    ),
    QueryRewriteRule(
        id="in_qc_07",
        agent_phase="in_sales",
        patterns=["(.*)验货", "(.*)看实物", "(.*)照片", "(.*)QC"],
        rewrite_template="请求订单{order_number}的质检照片",
        entity_extraction=[
            EntityExtractionRule(entity_type="order_number", patterns=["[A-Z]{2}\\d{8,}", "\\d{10,}"]),
        ],
    ),
    QueryRewriteRule(
        id="in_customs_08",
        agent_phase="in_sales",
        patterns=["(.*)清关", "(.*)海关", "(.*)扣关", "(.*)关税"],
        rewrite_template="处理订单{order_number}的清关问题",
        entity_extraction=[
            EntityExtractionRule(entity_type="order_number", patterns=["[A-Z]{2}\\d{8,}", "\\d{10,}"]),
        ],
    ),
    QueryRewriteRule(
        id="in_change_product_09",
        agent_phase="in_sales",
        patterns=["(.*)换一个", "(.*)换款", "(.*)改颜色", "(.*)换货"],
        rewrite_template="更换订单{order_number}的商品",
        entity_extraction=[
            EntityExtractionRule(entity_type="order_number", patterns=["[A-Z]{2}\\d{8,}", "\\d{10,}"]),
            EntityExtractionRule(entity_type="product_type", patterns=["手链", "项链", "戒指", "耳环"]),
        ],
    ),
    QueryRewriteRule(
        id="in_urgent_10",
        agent_phase="in_sales",
        patterns=["(.*)加急", "(.*)很急", "(.*)赶时间", "(.*)紧急"],
        rewrite_template="加急处理订单{order_number}",
        entity_extraction=[
            EntityExtractionRule(entity_type="order_number", patterns=["[A-Z]{2}\\d{8,}", "\\d{10,}"]),
        ],
    ),
]


# ──────────────────────────────────────────────
# 售后 Query 改写规则 (10条)
# ──────────────────────────────────────────────
_AFTER_SALES_REWRITE_RULES: list[QueryRewriteRule] = [
    QueryRewriteRule(
        id="after_return_01",
        agent_phase="after_sales",
        patterns=["(.*)退货", "(.*)退回去", "(.*)不想要了"],
        rewrite_template="申请订单{order_number}的退货",
        entity_extraction=[
            EntityExtractionRule(entity_type="order_number", patterns=["[A-Z]{2}\\d{8,}", "\\d{10,}"]),
        ],
    ),
    QueryRewriteRule(
        id="after_refund_02",
        agent_phase="after_sales",
        patterns=["(.*)退款", "(.*)退钱", "(.*)什么时候退"],
        rewrite_template="查询订单{order_number}的退款进度",
        entity_extraction=[
            EntityExtractionRule(entity_type="order_number", patterns=["[A-Z]{2}\\d{8,}", "\\d{10,}"]),
        ],
    ),
    QueryRewriteRule(
        id="after_complaint_03",
        agent_phase="after_sales",
        patterns=["(.*)投诉", "(.*)质量太差", "(.*)假货"],
        rewrite_template="处理订单{order_number}的投诉",
        entity_extraction=[
            EntityExtractionRule(entity_type="order_number", patterns=["[A-Z]{2}\\d{8,}", "\\d{10,}"]),
            EntityExtractionRule(entity_type="complaint_type", patterns=["质量", "假货", "服务", "物流", "态度"]),
        ],
    ),
    QueryRewriteRule(
        id="after_repair_04",
        agent_phase="after_sales",
        patterns=["(.*)维修", "(.*)坏了", "(.*)断了", "(.*)掉色"],
        rewrite_template="申请{product}的维修服务",
        entity_extraction=[
            EntityExtractionRule(entity_type="product_type", patterns=["手链", "项链", "戒指", "耳环"]),
            EntityExtractionRule(entity_type="issue_type", patterns=["断裂", "掉色", "变形", "脱落", "划痕"]),
        ],
    ),
    QueryRewriteRule(
        id="after_warranty_05",
        agent_phase="after_sales",
        patterns=["(.*)保修期", "(.*)免费维修", "(.*)在保修内"],
        rewrite_template="查询{product}的保修状态",
        entity_extraction=[
            EntityExtractionRule(entity_type="product_type", patterns=["手链", "项链", "戒指", "耳环"]),
        ],
    ),
    QueryRewriteRule(
        id="after_compensation_06",
        agent_phase="after_sales",
        patterns=["(.*)补偿", "(.*)赔偿", "(.*)弥补"],
        rewrite_template="处理订单{order_number}的补偿诉求",
        entity_extraction=[
            EntityExtractionRule(entity_type="order_number", patterns=["[A-Z]{2}\\d{8,}", "\\d{10,}"]),
        ],
    ),
    QueryRewriteRule(
        id="after_escalate_07",
        agent_phase="after_sales",
        patterns=["(.*)找经理", "(.*)上级", "(.*)supervisor", "(.*)工商"],
        rewrite_template="升级处理客户投诉",
        entity_extraction=[],
    ),
    QueryRewriteRule(
        id="after_exchange_08",
        agent_phase="after_sales",
        patterns=["(.*)换货", "(.*)换一个", "(.*)换尺寸", "(.*)换颜色"],
        rewrite_template="申请订单{order_number}的换货",
        entity_extraction=[
            EntityExtractionRule(entity_type="order_number", patterns=["[A-Z]{2}\\d{8,}", "\\d{10,}"]),
            EntityExtractionRule(entity_type="product_type", patterns=["手链", "项链", "戒指", "耳环"]),
        ],
    ),
    QueryRewriteRule(
        id="after_reorder_09",
        agent_phase="after_sales",
        patterns=["(.*)再买一个", "(.*)追加", "(.*)同款再来"],
        rewrite_template="复购{product}",
        entity_extraction=[
            EntityExtractionRule(entity_type="product_type", patterns=["手链", "项链", "戒指", "耳环"]),
            EntityExtractionRule(entity_type="brand", patterns=["vca", "梵克", "cartier", "卡地亚"]),
        ],
    ),
    QueryRewriteRule(
        id="after_feedback_10",
        agent_phase="after_sales",
        patterns=["(.*)好评", "(.*)满意", "(.*)不满意", "(.*)建议"],
        rewrite_template="记录客户反馈评价",
        entity_extraction=[],
    ),
]


# 汇总全部30条改写规则
REWRITE_RULES: list[QueryRewriteRule] = (
    _PRE_SALES_REWRITE_RULES
    + _IN_SALES_REWRITE_RULES
    + _AFTER_SALES_REWRITE_RULES
)
