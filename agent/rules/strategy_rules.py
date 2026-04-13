from __future__ import annotations

from models.action import AgentAction, StrategyCondition, StrategyRule


# ══════════════════════════════════════════════
# 转人工策略 (24条)
# ══════════════════════════════════════════════
_TRANSFER_HUMAN_RULES: list[StrategyRule] = [
    # --- 售前 (8条) ---
    StrategyRule(
        id="th_pre_01", agent_phase="pre_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PRODUCT_INQUIRY"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="customization_inquiry")],
        action=AgentAction(type="transfer_human", reason="定制咨询需要专业顾问", priority="high"),
        priority=90,
    ),
    StrategyRule(
        id="th_pre_02", agent_phase="pre_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PURCHASE_INTENT"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="bulk_purchase")],
        action=AgentAction(type="transfer_human", reason="批量采购需要专属报价", priority="high"),
        priority=85,
    ),
    StrategyRule(
        id="th_pre_03", agent_phase="pre_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PURCHASE_INTENT"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="ready_to_buy"),
                    StrategyCondition(field="order_total", operator="gt", value=5000)],
        action=AgentAction(type="transfer_human", reason="高价值订单需要人工跟进", priority="urgent"),
        priority=95,
    ),
    StrategyRule(
        id="th_pre_04", agent_phase="pre_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="SERVICE_INQUIRY"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="contact_human")],
        action=AgentAction(type="transfer_human", reason="客户主动要求转人工", priority="high"),
        priority=100,
    ),
    StrategyRule(
        id="th_pre_05", agent_phase="pre_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="customer_level", operator="eq", value="VIP")],
        action=AgentAction(type="transfer_human", reason="VIP客户优先转人工", priority="high"),
        priority=92,
    ),
    StrategyRule(
        id="th_pre_06", agent_phase="pre_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PRODUCT_INQUIRY"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="authenticity_inquiry")],
        action=AgentAction(type="transfer_human", reason="真伪鉴定需要专业客服", priority="medium"),
        priority=75,
    ),
    StrategyRule(
        id="th_pre_07", agent_phase="pre_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PAYMENT_INQUIRY"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="installment")],
        action=AgentAction(type="transfer_human", reason="分期付款需要人工确认方案", priority="medium"),
        priority=70,
    ),
    StrategyRule(
        id="th_pre_08", agent_phase="pre_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PURCHASE_INTENT"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="urgency_purchase")],
        action=AgentAction(type="transfer_human", reason="紧急购买需要快速人工响应", priority="urgent"),
        priority=88,
    ),
    # --- 售中 (8条) ---
    StrategyRule(
        id="th_in_01", agent_phase="in_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PAYMENT_ISSUE"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="double_charge")],
        action=AgentAction(type="transfer_human", reason="重复扣款需要紧急人工处理", priority="urgent"),
        priority=98,
    ),
    StrategyRule(
        id="th_in_02", agent_phase="in_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="ORDER_MODIFICATION"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="cancel_order"),
                    StrategyCondition(field="order_total", operator="gt", value=2000)],
        action=AgentAction(type="transfer_human", reason="高价值订单取消需要人工挽留", priority="high"),
        priority=90,
    ),
    StrategyRule(
        id="th_in_03", agent_phase="in_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="QUALITY_CHECK"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="qc_issue")],
        action=AgentAction(type="transfer_human", reason="质检问题需要人工判断处理", priority="high"),
        priority=85,
    ),
    StrategyRule(
        id="th_in_04", agent_phase="in_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="CUSTOMS_LOGISTICS"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="customs_issue")],
        action=AgentAction(type="transfer_human", reason="清关问题需要专业处理", priority="high"),
        priority=88,
    ),
    StrategyRule(
        id="th_in_05", agent_phase="in_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PAYMENT_ISSUE"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="payment_failed")],
        action=AgentAction(type="transfer_human", reason="支付失败需要技术排查", priority="medium"),
        priority=80,
    ),
    StrategyRule(
        id="th_in_06", agent_phase="in_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="ORDER_STATUS"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="shipping_delay")],
        action=AgentAction(type="transfer_human", reason="物流延迟需要人工跟进", priority="medium"),
        priority=75,
    ),
    StrategyRule(
        id="th_in_07", agent_phase="in_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="COMMUNICATION"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="urgent_matter")],
        action=AgentAction(type="transfer_human", reason="紧急事项需要人工处理", priority="urgent"),
        priority=95,
    ),
    StrategyRule(
        id="th_in_08", agent_phase="in_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="customer_level", operator="eq", value="VIP"),
                    StrategyCondition(field="has_order", operator="eq", value="true")],
        action=AgentAction(type="transfer_human", reason="VIP客户售中问题优先人工", priority="high"),
        priority=92,
    ),
    # --- 售后 (8条) ---
    StrategyRule(
        id="th_after_01", agent_phase="after_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="COMPLAINT"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="escalation")],
        action=AgentAction(type="transfer_human", reason="投诉升级需要主管介入", priority="urgent"),
        priority=100,
    ),
    StrategyRule(
        id="th_after_02", agent_phase="after_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="RETURN_REFUND"),
                    StrategyCondition(field="order_total", operator="gt", value=3000)],
        action=AgentAction(type="transfer_human", reason="高价值退货需要人工审核", priority="high"),
        priority=90,
    ),
    StrategyRule(
        id="th_after_03", agent_phase="after_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="COMPLAINT"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="product_complaint")],
        action=AgentAction(type="transfer_human", reason="产品投诉需要专业客服处理", priority="high"),
        priority=85,
    ),
    StrategyRule(
        id="th_after_04", agent_phase="after_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="COMPENSATION"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="goodwill_gesture")],
        action=AgentAction(type="transfer_human", reason="补偿方案需要人工审批", priority="medium"),
        priority=78,
    ),
    StrategyRule(
        id="th_after_05", agent_phase="after_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="REPAIR_MAINTENANCE"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="warranty_claim")],
        action=AgentAction(type="transfer_human", reason="保修索赔需要人工核实", priority="medium"),
        priority=75,
    ),
    StrategyRule(
        id="th_after_06", agent_phase="after_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="COMPLAINT"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="service_complaint")],
        action=AgentAction(type="transfer_human", reason="服务投诉需要主管处理", priority="high"),
        priority=88,
    ),
    StrategyRule(
        id="th_after_07", agent_phase="after_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="customer_level", operator="eq", value="VIP")],
        action=AgentAction(type="transfer_human", reason="VIP客户售后优先人工", priority="high"),
        priority=92,
    ),
    StrategyRule(
        id="th_after_08", agent_phase="after_sales", strategy_type="transfer_human",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="RETURN_REFUND"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="refund_request")],
        action=AgentAction(type="transfer_human", reason="退款申请需要人工处理", priority="medium"),
        priority=72,
    ),
]


# ══════════════════════════════════════════════
# 拉黑/屏蔽策略 (13条)
# ══════════════════════════════════════════════
_BLOCK_SPAM_RULES: list[StrategyRule] = [
    StrategyRule(
        id="block_01", agent_phase="pre_sales", strategy_type="block_spam",
        conditions=[StrategyCondition(field="message", operator="contains", value="代理"),
                    StrategyCondition(field="message", operator="contains", value="加盟")],
        action=AgentAction(type="block", reason="疑似招商广告", priority="medium"),
        priority=60,
    ),
    StrategyRule(
        id="block_02", agent_phase="pre_sales", strategy_type="block_spam",
        conditions=[StrategyCondition(field="message", operator="matches", value="(微信|wx|WeChat).*\\d{5,}")],
        action=AgentAction(type="block", reason="疑似引流到其他平台", priority="high"),
        priority=80,
    ),
    StrategyRule(
        id="block_03", agent_phase="pre_sales", strategy_type="block_spam",
        conditions=[StrategyCondition(field="message", operator="matches", value="(赚钱|日入|兼职|副业)")],
        action=AgentAction(type="block", reason="疑似传销/诈骗信息", priority="high"),
        priority=85,
    ),
    StrategyRule(
        id="block_04", agent_phase="pre_sales", strategy_type="block_spam",
        conditions=[StrategyCondition(field="message", operator="matches", value="(http[s]?://|bit\\.ly|t\\.co)")],
        action=AgentAction(type="block", reason="疑似垃圾链接", priority="medium"),
        priority=70,
    ),
    StrategyRule(
        id="block_05", agent_phase="pre_sales", strategy_type="block_spam",
        conditions=[StrategyCondition(field="message", operator="matches", value="(色情|赌博|彩票|博彩)")],
        action=AgentAction(type="block", reason="违禁内容", priority="urgent"),
        priority=100,
    ),
    StrategyRule(
        id="block_06", agent_phase="in_sales", strategy_type="block_spam",
        conditions=[StrategyCondition(field="message", operator="matches", value="(威胁|报警|法院|律师函)")],
        action=AgentAction(type="block", reason="疑似恶意威胁，转人工处理", priority="urgent",
                           metadata={"fallback": "transfer_human"}),
        priority=95,
    ),
    StrategyRule(
        id="block_07", agent_phase="pre_sales", strategy_type="block_spam",
        conditions=[StrategyCondition(field="message", operator="matches", value="(仿|高仿|A货|复刻)")],
        action=AgentAction(type="block", reason="涉及假冒商品", priority="high"),
        priority=90,
    ),
    StrategyRule(
        id="block_08", agent_phase="pre_sales", strategy_type="block_spam",
        conditions=[StrategyCondition(field="message", operator="matches", value="^(.{0,5})$"),
                    StrategyCondition(field="message", operator="matches", value="^[\\s\\n]*$")],
        action=AgentAction(type="block", reason="空消息或无意义内容", priority="low"),
        priority=10,
    ),
    StrategyRule(
        id="block_09", agent_phase="pre_sales", strategy_type="block_spam",
        conditions=[StrategyCondition(field="message", operator="contains", value="测试"),
                    StrategyCondition(field="message", operator="matches", value="^测试[\\d]*$")],
        action=AgentAction(type="block", reason="测试消息", priority="low"),
        priority=5,
    ),
    StrategyRule(
        id="block_10", agent_phase="in_sales", strategy_type="block_spam",
        conditions=[StrategyCondition(field="message", operator="matches", value="(私下|线下交易|不走平台)")],
        action=AgentAction(type="block", reason="疑似绕过平台交易", priority="high"),
        priority=88,
    ),
    StrategyRule(
        id="block_11", agent_phase="after_sales", strategy_type="block_spam",
        conditions=[StrategyCondition(field="message", operator="matches", value="(差评威胁|不给好评|一星)")],
        action=AgentAction(type="block", reason="差评勒索，转人工处理", priority="high",
                           metadata={"fallback": "transfer_human"}),
        priority=85,
    ),
    StrategyRule(
        id="block_12", agent_phase="pre_sales", strategy_type="block_spam",
        conditions=[StrategyCondition(field="message", operator="matches", value="(同行|竞品|打听)")],
        action=AgentAction(type="block", reason="疑似竞品打探", priority="medium"),
        priority=65,
    ),
    StrategyRule(
        id="block_13", agent_phase="pre_sales", strategy_type="block_spam",
        conditions=[StrategyCondition(field="message", operator="matches", value="(群发|群消息|转发)")],
        action=AgentAction(type="block", reason="疑似群发垃圾消息", priority="medium"),
        priority=60,
    ),
]


# ══════════════════════════════════════════════
# 营销转化策略 (25条)
# ══════════════════════════════════════════════
_MARKETING_CONVERSION_RULES: list[StrategyRule] = [
    # --- 售前营销 (10条) ---
    StrategyRule(
        id="mk_pre_01", agent_phase="pre_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PURCHASE_INTENT"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="hesitation")],
        action=AgentAction(type="marketing_trigger", reason="犹豫客户 — 推送限时优惠", priority="high",
                           metadata={"template": "limited_time_offer", "discount": "5%"}),
        priority=85,
    ),
    StrategyRule(
        id="mk_pre_02", agent_phase="pre_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PURCHASE_INTENT"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="budget_concern")],
        action=AgentAction(type="marketing_trigger", reason="价格敏感 — 推荐分期或平替", priority="medium",
                           metadata={"template": "budget_friendly", "suggest_installment": True}),
        priority=80,
    ),
    StrategyRule(
        id="mk_pre_03", agent_phase="pre_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PURCHASE_INTENT"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="gift_purchase")],
        action=AgentAction(type="marketing_trigger", reason="送礼场景 — 推荐礼盒包装+贺卡", priority="medium",
                           metadata={"template": "gift_package", "upsell": "gift_box"}),
        priority=75,
    ),
    StrategyRule(
        id="mk_pre_04", agent_phase="pre_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PRODUCT_INQUIRY"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="product_comparison")],
        action=AgentAction(type="marketing_trigger", reason="对比中 — 强化我方产品优势", priority="medium",
                           metadata={"template": "product_advantage"}),
        priority=70,
    ),
    StrategyRule(
        id="mk_pre_05", agent_phase="pre_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PROMOTION_INQUIRY"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="current_promotion")],
        action=AgentAction(type="marketing_trigger", reason="主动询问优惠 — 推送当前活动", priority="high",
                           metadata={"template": "current_promotions"}),
        priority=88,
    ),
    StrategyRule(
        id="mk_pre_06", agent_phase="pre_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PROMOTION_INQUIRY"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="membership_benefit")],
        action=AgentAction(type="marketing_trigger", reason="会员咨询 — 推荐会员注册享专属优惠", priority="medium",
                           metadata={"template": "membership_signup"}),
        priority=72,
    ),
    StrategyRule(
        id="mk_pre_07", agent_phase="pre_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PURCHASE_INTENT"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="ready_to_buy")],
        action=AgentAction(type="marketing_trigger", reason="准备购买 — 提供下单引导和赠品", priority="high",
                           metadata={"template": "checkout_guide", "freebie": True}),
        priority=92,
    ),
    StrategyRule(
        id="mk_pre_08", agent_phase="pre_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PRODUCT_INQUIRY"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="collection_inquiry")],
        action=AgentAction(type="marketing_trigger", reason="系列咨询 — 推荐搭配套装", priority="medium",
                           metadata={"template": "collection_bundle"}),
        priority=68,
    ),
    StrategyRule(
        id="mk_pre_09", agent_phase="pre_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PROMOTION_INQUIRY"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="bundle_deal")],
        action=AgentAction(type="marketing_trigger", reason="套餐咨询 — 推送组合优惠", priority="high",
                           metadata={"template": "bundle_discount", "discount": "10%"}),
        priority=82,
    ),
    StrategyRule(
        id="mk_pre_10", agent_phase="pre_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="SHIPPING_INQUIRY"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="shipping_cost")],
        action=AgentAction(type="marketing_trigger", reason="运费咨询 — 推送满额包邮活动", priority="low",
                           metadata={"template": "free_shipping_threshold"}),
        priority=55,
    ),
    # --- 售中营销 (8条) ---
    StrategyRule(
        id="mk_in_01", agent_phase="in_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="ORDER_STATUS"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="order_confirmation")],
        action=AgentAction(type="marketing_trigger", reason="订单确认 — 推荐搭配商品", priority="low",
                           metadata={"template": "cross_sell", "timing": "post_confirmation"}),
        priority=50,
    ),
    StrategyRule(
        id="mk_in_02", agent_phase="in_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="QUALITY_CHECK"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="qc_request")],
        action=AgentAction(type="marketing_trigger", reason="验货满意 — 推荐加购保养套装", priority="low",
                           metadata={"template": "care_kit_upsell"}),
        priority=45,
    ),
    StrategyRule(
        id="mk_in_03", agent_phase="in_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="ORDER_MODIFICATION"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="change_quantity")],
        action=AgentAction(type="marketing_trigger", reason="加购意向 — 推送多件折扣", priority="medium",
                           metadata={"template": "quantity_discount"}),
        priority=65,
    ),
    StrategyRule(
        id="mk_in_04", agent_phase="in_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="ORDER_MODIFICATION"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="cancel_order")],
        action=AgentAction(type="marketing_trigger", reason="取消挽留 — 提供取消替代方案", priority="high",
                           metadata={"template": "cancel_retention", "offer_discount": True}),
        priority=88,
    ),
    StrategyRule(
        id="mk_in_05", agent_phase="in_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="COMMUNICATION"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="special_request")],
        action=AgentAction(type="marketing_trigger", reason="特殊需求 — 展示增值服务", priority="low",
                           metadata={"template": "value_added_services"}),
        priority=40,
    ),
    StrategyRule(
        id="mk_in_06", agent_phase="in_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="CUSTOMS_LOGISTICS"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="logistics_insurance")],
        action=AgentAction(type="marketing_trigger", reason="保险咨询 — 推荐运输保险服务", priority="medium",
                           metadata={"template": "insurance_upsell"}),
        priority=55,
    ),
    StrategyRule(
        id="mk_in_07", agent_phase="in_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="ORDER_STATUS"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="delivery_eta")],
        action=AgentAction(type="marketing_trigger", reason="等待收货 — 推送使用指南预热", priority="low",
                           metadata={"template": "pre_delivery_guide"}),
        priority=35,
    ),
    StrategyRule(
        id="mk_in_08", agent_phase="in_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="PAYMENT_ISSUE"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="payment_confirmation")],
        action=AgentAction(type="marketing_trigger", reason="付款确认 — 推送订单福利", priority="low",
                           metadata={"template": "payment_thankyou", "freebie": True}),
        priority=42,
    ),
    # --- 售后营销 (7条) ---
    StrategyRule(
        id="mk_after_01", agent_phase="after_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="REPURCHASE"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="reorder")],
        action=AgentAction(type="marketing_trigger", reason="复购意向 — 推送老客专属价", priority="high",
                           metadata={"template": "loyalty_discount", "discount": "8%"}),
        priority=90,
    ),
    StrategyRule(
        id="mk_after_02", agent_phase="after_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="REPURCHASE"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="new_product_interest")],
        action=AgentAction(type="marketing_trigger", reason="新品兴趣 — 推送新品预告和早鸟价", priority="medium",
                           metadata={"template": "new_arrival_preview"}),
        priority=78,
    ),
    StrategyRule(
        id="mk_after_03", agent_phase="after_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="REPURCHASE"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="referral")],
        action=AgentAction(type="marketing_trigger", reason="推荐意向 — 推送推荐有礼活动", priority="high",
                           metadata={"template": "referral_reward", "reward": "coupon_100"}),
        priority=85,
    ),
    StrategyRule(
        id="mk_after_04", agent_phase="after_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="FEEDBACK"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="positive_feedback")],
        action=AgentAction(type="marketing_trigger", reason="好评客户 — 邀请加入VIP群", priority="medium",
                           metadata={"template": "vip_group_invite"}),
        priority=70,
    ),
    StrategyRule(
        id="mk_after_05", agent_phase="after_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="REPAIR_MAINTENANCE"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="maintenance_service")],
        action=AgentAction(type="marketing_trigger", reason="保养咨询 — 推荐保养套餐", priority="low",
                           metadata={"template": "care_package"}),
        priority=50,
    ),
    StrategyRule(
        id="mk_after_06", agent_phase="after_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="FEEDBACK"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="negative_feedback")],
        action=AgentAction(type="marketing_trigger", reason="差评挽回 — 提供补偿优惠券", priority="high",
                           metadata={"template": "recovery_coupon", "coupon_value": 200}),
        priority=82,
    ),
    StrategyRule(
        id="mk_after_07", agent_phase="after_sales", strategy_type="marketing_conversion",
        conditions=[StrategyCondition(field="intent_primary", operator="eq", value="RETURN_REFUND"),
                    StrategyCondition(field="intent_secondary", operator="eq", value="exchange_request")],
        action=AgentAction(type="marketing_trigger", reason="换货机会 — 推荐升级款式", priority="medium",
                           metadata={"template": "upgrade_suggestion"}),
        priority=68,
    ),
]


# 汇总全部62条策略规则
STRATEGY_RULES: list[StrategyRule] = (
    _TRANSFER_HUMAN_RULES
    + _BLOCK_SPAM_RULES
    + _MARKETING_CONVERSION_RULES
)
