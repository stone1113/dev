"""知识库 — 产品、物流、政策、FAQ 等结构化知识。

知识库为回复引擎和LLM提示词提供事实依据，
避免回复中出现编造信息。支持从JSON文件热加载。
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Optional


# ═══════════════════════════════════════════
# 产品知识库
# ═══════════════════════════════════════════

PRODUCTS: dict[str, dict] = {
    "love_bracelet": {
        "name": "LOVE Bracelet",
        "name_zh": "LOVE手镯",
        "brand": "Cartier",
        "category": "bracelet",
        "materials": ["14K_Gold", "18K_Gold", "Rose_Gold", "White_Gold"],
        "sizes": ["15cm", "16cm", "17cm", "18cm", "19cm", "20cm", "21cm"],
        "size_guide": "建议量手腕围度后加1-2cm选择",
        "price_range": {"14K_Gold": "$45-75", "18K_Gold": "$85-150"},
        "features": ["防水不褪色", "保色约半年", "合金/925银基材"],
        "care": "避免接触化学品，洗澡游泳建议取下",
    },
    "alhambra_bracelet": {
        "name": "Alhambra Bracelet (四叶草手链)",
        "name_zh": "四叶草手链",
        "brand": "Van Cleef & Arpels",
        "category": "bracelet",
        "materials": ["18K_Gold", "Rose_Gold", "White_Gold"],
        "sizes": ["15cm", "16cm", "17cm", "18cm"],
        "size_guide": "手链尺寸建议量手腕后加1.5cm",
        "price_range": {"18K_Gold": "$55-120"},
        "features": ["经典四叶草造型", "多种花色可选", "五瓣/六瓣/十瓣"],
        "care": "925银材质建议定期用银布擦拭",
    },
    "alhambra_necklace": {
        "name": "Alhambra Necklace (四叶草项链)",
        "name_zh": "四叶草项链",
        "brand": "Van Cleef & Arpels",
        "category": "necklace",
        "materials": ["18K_Gold", "Rose_Gold"],
        "sizes": ["42cm", "45cm", "50cm"],
        "size_guide": "项链长度：42cm贴颈/45cm标准/50cm长款",
        "price_range": {"18K_Gold": "$65-180"},
        "features": ["经典四叶草造型", "单花/三花/五花/十花可选"],
        "care": "避免拉扯，存放时平放于首饰盒",
    },
    "juste_un_clou": {
        "name": "Juste un Clou Bracelet (钉子手镯)",
        "name_zh": "钉子手镯",
        "brand": "Cartier",
        "category": "bracelet",
        "materials": ["14K_Gold", "18K_Gold", "Rose_Gold"],
        "sizes": ["15cm", "16cm", "17cm", "18cm", "19cm"],
        "size_guide": "硬手镯建议选比手腕围度大1cm的",
        "price_range": {"14K_Gold": "$40-65", "18K_Gold": "$75-130"},
        "features": ["经典钉子造型", "开口设计", "镶钻/素面可选"],
        "care": "开口处避免大力掰动",
    },
    "serpenti_necklace": {
        "name": "Serpenti Necklace (蛇骨项链)",
        "name_zh": "蛇骨项链",
        "brand": "Bulgari",
        "category": "necklace",
        "materials": ["14K_Gold", "18K_Gold", "Sterling_Silver"],
        "sizes": ["40cm", "42cm", "45cm"],
        "size_guide": "蛇骨链贴合脖颈，建议选准确尺寸",
        "price_range": {"14K_Gold": "$50-90", "18K_Gold": "$80-160"},
        "features": ["蛇骨链设计", "闪亮切面", "不易打结"],
        "care": "避免折叠存放，平放保存",
    },
    "love_ring": {
        "name": "LOVE Ring",
        "name_zh": "LOVE戒指",
        "brand": "Cartier",
        "category": "ring",
        "materials": ["14K_Gold", "18K_Gold", "Rose_Gold", "White_Gold"],
        "sizes": ["6号", "7号", "8号", "9号", "10号", "11号", "12号"],
        "size_guide": "建议量手指围度，戒指尺寸需精准",
        "price_range": {"14K_Gold": "$35-55", "18K_Gold": "$65-110"},
        "features": ["经典螺丝造型", "窄版/宽版可选", "镶钻款更闪"],
        "care": "避免磕碰，取下时轻拿轻放",
    },
    "trinity_ring": {
        "name": "Trinity Ring (三色金戒指)",
        "name_zh": "三色金戒指",
        "brand": "Cartier",
        "category": "ring",
        "materials": ["18K_Gold_Tri_Color"],
        "sizes": ["6号", "7号", "8号", "9号", "10号", "11号"],
        "size_guide": "三环戒指建议选稍大半号",
        "price_range": {"18K_Gold_Tri_Color": "$55-95"},
        "features": ["三色金三环设计", "玫瑰金/黄金/白金", "经典款"],
        "care": "三环可转动，避免大力拉扯",
    },
    "alhambra_earring": {
        "name": "Alhambra Earring (四叶草耳环)",
        "name_zh": "四叶草耳环",
        "brand": "Van Cleef & Arpels",
        "category": "earring",
        "materials": ["18K_Gold", "Rose_Gold", "Sterling_Silver"],
        "sizes": ["单花", "双花"],
        "size_guide": "耳钉/耳夹可选，耳夹适合无耳洞",
        "price_range": {"18K_Gold": "$45-85", "Sterling_Silver": "$30-60"},
        "features": ["经典四叶草造型", "耳钉/耳夹可选", "日常百搭"],
        "care": "耳钉后塞要拧紧，避免丢失",
    },
    "tiffany_t_bracelet": {
        "name": "Tiffany T Bracelet",
        "name_zh": "Tiffany T手镯",
        "brand": "Tiffany & Co.",
        "category": "bracelet",
        "materials": ["18K_Gold", "Rose_Gold", "Sterling_Silver"],
        "sizes": ["S", "M", "L"],
        "size_guide": "S适合手腕15-16cm，M适合16-17cm，L适合17-18cm",
        "price_range": {"18K_Gold": "$70-130", "Sterling_Silver": "$45-80"},
        "features": ["T字母造型", "开口设计", "简约大气"],
        "care": "开口处避免反复掰动",
    },
    "tiffany_key_necklace": {
        "name": "Tiffany Key Necklace (钥匙项链)",
        "name_zh": "钥匙项链",
        "brand": "Tiffany & Co.",
        "category": "necklace",
        "materials": ["18K_Gold", "Sterling_Silver"],
        "sizes": ["42cm", "45cm"],
        "size_guide": "钥匙吊坠较大，建议选45cm长度",
        "price_range": {"18K_Gold": "$60-120", "Sterling_Silver": "$40-75"},
        "features": ["钥匙造型", "镶钻/素面可选", "寓意开启幸福"],
        "care": "吊坠较重，避免拉扯链条",
    },
    "bzero1_ring": {
        "name": "B.zero1 Ring",
        "name_zh": "B.zero1戒指",
        "brand": "Bulgari",
        "category": "ring",
        "materials": ["18K_Gold", "Rose_Gold", "White_Gold"],
        "sizes": ["6号", "7号", "8号", "9号", "10号", "11号", "12号"],
        "size_guide": "宽版戒指建议选大半号",
        "price_range": {"18K_Gold": "$60-110"},
        "features": ["螺旋造型", "宽版设计", "个性时尚"],
        "care": "宽版戒指避免磕碰变形",
    },
    "chanel_camellia_earring": {
        "name": "Chanel Camellia Earring (山茶花耳环)",
        "name_zh": "山茶花耳环",
        "brand": "Chanel",
        "category": "earring",
        "materials": ["Sterling_Silver", "Alloy"],
        "sizes": ["小号", "中号", "大号"],
        "size_guide": "小号日常佩戴，大号适合晚宴",
        "price_range": {"Sterling_Silver": "$35-70", "Alloy": "$25-50"},
        "features": ["山茶花造型", "珍珠/水钻装饰", "优雅复古"],
        "care": "珍珠避免接触化妆品",
    },
    "chanel_cc_earring": {
        "name": "Chanel CC Earring (双C耳环)",
        "name_zh": "双C耳环",
        "brand": "Chanel",
        "category": "earring",
        "materials": ["Sterling_Silver", "Alloy"],
        "sizes": ["经典款"],
        "size_guide": "耳钉款，适合日常佩戴",
        "price_range": {"Sterling_Silver": "$30-60", "Alloy": "$20-45"},
        "features": ["双C logo", "简约百搭", "品牌标志性"],
        "care": "避免接触香水和化妆品",
    },
    "juste_un_clou_ring": {
        "name": "Juste un Clou Ring (钉子戒指)",
        "name_zh": "钉子戒指",
        "brand": "Cartier",
        "category": "ring",
        "materials": ["14K_Gold", "18K_Gold", "Rose_Gold"],
        "sizes": ["6号", "7号", "8号", "9号", "10号", "11号"],
        "size_guide": "钉子造型建议选准确尺寸",
        "price_range": {"14K_Gold": "$35-60", "18K_Gold": "$60-105"},
        "features": ["钉子造型", "镶钻/素面可选", "个性前卫"],
        "care": "钉子尖端避免磕碰",
    },
    "tiffany_heart_necklace": {
        "name": "Tiffany Heart Necklace (心形项链)",
        "name_zh": "心形项链",
        "brand": "Tiffany & Co.",
        "category": "necklace",
        "materials": ["18K_Gold", "Sterling_Silver"],
        "sizes": ["42cm", "45cm"],
        "size_guide": "心形吊坠适合42cm贴颈佩戴",
        "price_range": {"18K_Gold": "$55-100", "Sterling_Silver": "$35-65"},
        "features": ["心形吊坠", "经典浪漫", "送礼佳品"],
        "care": "心形吊坠避免挤压变形",
    },
}


# ═══════════════════════════════════════════
# 物流知识库
# ═══════════════════════════════════════════

LOGISTICS: dict[str, dict] = {
    "shipping_origin": "中国（广州/深圳）",
    "carriers": {
        "fedex": {"name": "联邦快递", "eta": "7-12个工作日", "tracking_url": "https://www.fedex.com/fedextrack/"},
        "ups": {"name": "UPS", "eta": "7-15个工作日", "tracking_url": "https://www.ups.com/track"},
        "ems": {"name": "EMS", "eta": "10-20个工作日", "tracking_url": "https://www.ems.com.cn/"},
        "dhl": {"name": "DHL", "eta": "5-10个工作日", "tracking_url": "https://www.dhl.com/"},
    },
    "free_shipping_threshold": "$200",
    "regions": {
        "us": {"eta": "7-12天", "carrier": "fedex", "customs_note": "一般无需额外操作"},
        "eu": {"eta": "10-15天", "carrier": "fedex", "customs_note": "可能产生关税，由收件人承担"},
        "middle_east": {"eta": "10-15天", "carrier": "fedex", "customs_note": "清关时间较长"},
        "asia": {"eta": "5-10天", "carrier": "ems", "customs_note": "亚洲地区较快"},
        "default": {"eta": "7-15天", "carrier": "fedex", "customs_note": "具体时效视目的地而定"},
    },
}


# ═══════════════════════════════════════════
# 政策知识库
# ═══════════════════════════════════════════

POLICIES: dict[str, str] = {
    # 跨境电商特殊政策：退货成本极高，优先补偿方案
    "return_policy": "跨境退货运费高昂，一般不支持退货退款",
    "quality_issue": "质量问题：提供照片/视频证明后，重新免费发货或赠送等值优惠券",
    "size_issue": "尺寸不合：首次可补偿$10-20优惠券用于下次购买正确尺寸",
    "cancel_free": "未发货前取消订单，全额退款",
    "cancel_shipped": "已发货无法取消，建议收货后转售或赠送",
    "compensation_coupon": "一般问题补偿：$10-30优惠券（根据订单金额）",
    "compensation_reship": "严重质量问题：免费重新发货",
    "warranty": "产品享有6个月质保，质保期内质量问题免费补发",
    "qc_process": "发货前提供质检照片/视频给客户确认",
    "dispute_escalation": "客户坚持退货：转主管评估，特殊情况可协商部分退款",
}


# ═══════════════════════════════════════════
# FAQ 知识库
# ═══════════════════════════════════════════

FAQ: list[dict[str, str]] = [
    {"q": "材质是什么", "a": "我们采用合金材料，有两种材质可选：银合金镀14K金和925纯银镀18K金。"},
    {"q": "会不会褪色", "a": "首饰具有防水不褪色特性，一般保色约半年。日常注意保养可延长使用寿命。"},
    {"q": "可以戴着洗澡吗", "a": "具有防水性，但长期接触水和化学品会加速磨损，建议洗澡游泳时取下。"},
    {"q": "怎么选尺寸", "a": "手链：量手腕围度+1-2cm。手镯：量手腕围度+1cm。项链：42cm贴颈/45cm标准/50cm长款。"},
    {"q": "从哪里发货", "a": "从中国发货，使用联邦快递/UPS/EMS国际快递。"},
    {"q": "多久能到", "a": "一般7-15个工作日，美国约7-12天，欧洲约10-15天，亚洲约5-10天。"},
    {"q": "有关税吗", "a": "部分国家可能产生关税，由收件人承担。具体取决于目的地国家的进口政策。"},
    {"q": "怎么退货", "a": "跨境退货运费很高，一般不支持退货。如有质量问题，提供照片后我们会重新发货或赠送优惠券。"},
    {"q": "尺寸不合怎么办", "a": "首次尺寸问题可补偿$10-20优惠券用于购买正确尺寸。建议下单前仔细核对尺寸指南。"},
    {"q": "收到有质量问题", "a": "请拍照或录视频发给客服，确认后立即免费重新发货或赠送等值优惠券。"},
    {"q": "有证书吗", "a": "每件产品附有质保卡，发货前提供质检照片/视频确认。"},
    {"q": "支持什么支付方式", "a": "支持信用卡、PayPal等。通过官网下单，支付安全有保障。"},
    {"q": "可以定制吗", "a": "支持刻字和尺寸调整，定制需额外5-7个工作日。"},
    {"q": "包邮吗", "a": "订单满$200包邮，未满按目的地计算运费。"},
]


# ═══════════════════════════════════════════
# 知识库查询接口
# ═══════════════════════════════════════════

def find_product(query: str) -> Optional[dict]:
    """根据关键词模糊匹配产品。"""
    query_lower = query.lower()
    for pid, prod in PRODUCTS.items():
        names = [prod["name"].lower(), prod["name_zh"], prod.get("brand", "").lower(), pid]
        if any(n in query_lower or query_lower in n for n in names):
            return prod
    return None


def find_product_by_entities(entities: dict[str, str]) -> Optional[dict]:
    """根据提取的实体匹配产品。"""
    brand = entities.get("brand", "").lower()
    ptype = entities.get("product_type", "").lower()
    pname = entities.get("product_name", "").lower()

    # 优先匹配产品名称+类型（最精确）
    if pname and ptype:
        for key, prod in PRODUCTS.items():
            if pname in key.lower() and ptype in prod["category"].lower():
                return prod

    # 其次匹配产品名称
    if pname:
        for key, prod in PRODUCTS.items():
            if pname in key.lower():
                return prod

    # 再次匹配品牌+类型
    for prod in PRODUCTS.values():
        brand_match = brand and brand in prod["brand"].lower()
        type_match = ptype and ptype in prod["category"].lower()
        if brand_match and type_match:
            return prod
        if brand_match:
            return prod
    return None


def find_faq(query: str) -> Optional[str]:
    """模糊匹配FAQ，返回最佳答案。"""
    query_lower = query.lower()
    for item in FAQ:
        if any(kw in query_lower for kw in item["q"]):
            return item["a"]
    return None


def get_logistics_for_region(region: str = "default") -> dict:
    """获取指定地区的物流信息。"""
    regions = LOGISTICS.get("regions", {})
    info = regions.get(region, regions.get("default", {}))
    carrier_key = info.get("carrier", "fedex")
    carrier = LOGISTICS.get("carriers", {}).get(carrier_key, {})
    return {
        "carrier_name": carrier.get("name", "国际快递"),
        "eta": info.get("eta", "7-15天"),
        "tracking_url": carrier.get("tracking_url", ""),
        "customs_note": info.get("customs_note", ""),
        "origin": LOGISTICS.get("shipping_origin", "中国"),
    }


def get_policy(key: str) -> str:
    """获取政策信息。"""
    return POLICIES.get(key, "")


# ═══════════════════════════════════════════
# 从外部JSON文件加载（可选，支持热更新）
# ═══════════════════════════════════════════

_KB_DIR = Path(__file__).parent / "data"


def load_external_kb():
    """从 knowledge/data/ 目录加载JSON扩展知识库。"""
    global PRODUCTS, FAQ
    products_file = _KB_DIR / "products.json"
    faq_file = _KB_DIR / "faq.json"

    if products_file.exists():
        with open(products_file, encoding="utf-8") as f:
            extra = json.load(f)
            PRODUCTS.update(extra)

    if faq_file.exists():
        with open(faq_file, encoding="utf-8") as f:
            extra = json.load(f)
            FAQ.extend(extra)
