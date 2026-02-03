import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { languageMap } from '@/data/mockData';
import {
  Sparkles,
  FileText,
  User,
  X,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Target,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Tag,
  Briefcase,
  Users,
  MessageSquare,
  ShoppingCart,
  DollarSign,
  Clock,
  Truck,
  CreditCard,
  Shield,
  MessageCircle,
  Star,
  Package,
  Zap,
  FileEdit
} from 'lucide-react';

interface CustomerAIProfileProps {
  onClose?: () => void;
}

export const CustomerAIProfile: React.FC<CustomerAIProfileProps> = ({ onClose }) => {
  const { 
    getSelectedConversation,
    generateAIReply,
    addMessage,
    userSettings
  } = useStore();
  
  const conversation = getSelectedConversation();
  const aiSettings = userSettings.preferences.ai;
  
  // AI自动回复 - 当开启AI接管且收到新客户消息时
  useEffect(() => {
    if (!conversation || !aiSettings.enabled || !aiSettings.autoReply) return;
    
    const lastMessage = conversation.lastMessage;
    if (lastMessage?.senderType === 'customer' && lastMessage.status === 'unread') {
      const autoReplyTimeout = setTimeout(async () => {
        const suggestions = await generateAIReply(conversation.id);
        if (suggestions.length > 0) {
          const autoReply = {
            id: `msg_${Date.now()}`,
            conversationId: conversation.id,
            senderId: 'ai',
            senderType: 'ai' as const,
            content: suggestions[0].content,
            timestamp: new Date(),
            status: 'sent' as const,
            isAIGenerated: true,
          };
          addMessage(conversation.id, autoReply);
        }
      }, 2000);
      
      return () => clearTimeout(autoReplyTimeout);
    }
  }, [conversation?.lastMessage, aiSettings.enabled, aiSettings.autoReply]);
  

  
  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl p-6">
        <div className="w-16 h-16 bg-[#0059F8]/10 rounded-full flex items-center justify-center mb-3">
          <User className="w-8 h-8 text-[#0059F8]" />
        </div>
        <p className="text-gray-500 text-sm">选择一个会话查看客户画像</p>
      </div>
    );
  }
  
  const customerLanguage = languageMap[conversation.customer.language] || { name: conversation.customer.language, flag: '🌐' };
  
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#0059F8]/5 to-purple-50/50">
        <div className="flex items-center gap-3">
          <img
            src={conversation.customer.avatar}
            alt={conversation.customer.name}
            className="w-10 h-10 rounded-full object-cover bg-gray-100"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{conversation.customer.name}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{conversation.customer.country}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <span>{customerLanguage.flag}</span>
                <span>{customerLanguage.name}</span>
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* AI画像标签 */}
        <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium text-violet-700">AI画像标签</span>
          </div>

          <div className="space-y-3">
            {/* 客户等级 */}
            <div>
              <span className="text-xs text-violet-600 mb-1.5 block">客户等级</span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 text-xs bg-amber-500 text-white rounded-lg font-medium flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" />B级 - 高意向询价
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">A(已成交) / B(高意向询价) / C(观望) / D(仅加好友)</p>
            </div>

            {/* 客户类型 */}
            <div>
              <span className="text-xs text-violet-600 mb-1.5 block">客户类型</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 text-xs bg-violet-500 text-white rounded-full">批发</span>
                <span className="px-2.5 py-1 text-xs bg-violet-100 text-violet-700 rounded-full">平台卖家</span>
              </div>
            </div>

            {/* 意向商品 */}
            <div>
              <span className="text-xs text-violet-600 mb-1.5 block">意向商品</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 text-xs bg-white text-violet-600 border border-violet-200 rounded-lg">
                  Nike Air Max 270
                </span>
                <span className="px-2 py-1 text-xs bg-white text-violet-600 border border-violet-200 rounded-lg">
                  Adidas Yeezy 350
                </span>
                <span className="px-2 py-1 text-xs bg-white text-violet-600 border border-violet-200 rounded-lg">
                  Jordan 1 Retro
                </span>
              </div>
            </div>

            {/* 意向品类 & 预算 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-violet-600 mb-1 block">意向品类</span>
                <span className="px-2 py-1 text-xs bg-white text-violet-600 border border-violet-200 rounded-lg inline-flex items-center gap-1">
                  <Package className="w-3 h-3" />鞋类
                </span>
              </div>
              <div>
                <span className="text-xs text-violet-600 mb-1 block">预算区间</span>
                <span className="px-2 py-1 text-xs bg-white text-violet-600 border border-violet-200 rounded-lg inline-flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />中($50-$200)
                </span>
              </div>
            </div>

            {/* 购买目的 & 意向数量 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-violet-600 mb-1 block">购买目的</span>
                <span className="px-2 py-1 text-xs bg-white text-violet-600 border border-violet-200 rounded-lg inline-flex items-center gap-1">
                  <ShoppingCart className="w-3 h-3" />转售
                </span>
              </div>
              <div>
                <span className="text-xs text-violet-600 mb-1 block">意向数量</span>
                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-lg inline-flex items-center gap-1">
                  <Zap className="w-3 h-3" />中批(10-99)
                </span>
              </div>
            </div>

            {/* 敏感度标签 */}
            <div>
              <span className="text-xs text-violet-600 mb-1.5 block">敏感度特征</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />价格敏感-高
                </span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full flex items-center gap-1">
                  <Truck className="w-3 h-3" />物流敏感-高
                </span>
              </div>
            </div>

            {/* 付款 & 信任 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-violet-600 mb-1 block">付款偏好</span>
                <span className="px-2 py-1 text-xs bg-white text-violet-600 border border-violet-200 rounded-lg inline-flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />PayPal
                </span>
              </div>
              <div>
                <span className="text-xs text-violet-600 mb-1 block">信任等级</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-lg inline-flex items-center gap-1">
                  <Shield className="w-3 h-3" />中
                </span>
              </div>
            </div>

            {/* 渠道 & 生命周期 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-violet-600 mb-1 block">渠道来源</span>
                <span className="px-2 py-1 text-xs bg-white text-violet-600 border border-violet-200 rounded-lg inline-flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />WhatsApp
                </span>
              </div>
              <div>
                <span className="text-xs text-violet-600 mb-1 block">生命周期</span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg inline-flex items-center gap-1">
                  <Star className="w-3 h-3" />潜在(B)
                </span>
              </div>
            </div>

            {/* 紧迫度 */}
            <div>
              <span className="text-xs text-violet-600 mb-1 block">购买紧迫度</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded-lg inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />本周
                </span>
                <span className="text-xs text-gray-500">需优先跟进</span>
              </div>
            </div>
          </div>
        </div>

        {/* 联系人信息 */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">联系人信息</span>
          </div>

          <div className="space-y-2.5">
            {/* 昵称 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-gray-500">昵称</span>
              </div>
              <span className="text-sm text-gray-700">{conversation.customer.name}</span>
            </div>

            {/* 邮箱 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-gray-500">邮箱</span>
              </div>
              <span className="text-sm text-gray-700">{conversation.customer.email || 'john@example.com'}</span>
            </div>

            {/* 电话 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-gray-500">电话</span>
              </div>
              <span className="text-sm text-gray-700">+1-234-567-890</span>
            </div>

            {/* 微信 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-gray-500">微信</span>
              </div>
              <span className="text-sm text-gray-700">wx_john123</span>
            </div>

            {/* 地区 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-gray-500">地区</span>
              </div>
              <span className="text-sm text-gray-700">{conversation.customer.country}</span>
            </div>

            {/* 首选渠道 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-gray-500">首选渠道</span>
              </div>
              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">微信</span>
            </div>

            {/* 活跃时段 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-gray-500">活跃时段</span>
              </div>
              <span className="text-sm text-gray-700">20:00-22:00 (UTC-5)</span>
            </div>

            {/* 备注 */}
            <div className="pt-2 border-t border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <FileEdit className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-gray-500">备注</span>
              </div>
              <p className="text-sm text-gray-600 bg-white/50 p-2 rounded-lg">偏好白色鞋/喜欢跑步风格</p>
            </div>
          </div>
        </div>

        {/* 公司信息 */}
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-700">公司信息</span>
          </div>

          <div className="space-y-2.5">
            {/* 公司名称 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-gray-500">公司名称</span>
              </div>
              <span className="text-sm text-gray-700">TechCorp International</span>
            </div>

            {/* 行业 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-gray-500">行业</span>
              </div>
              <span className="text-sm text-gray-700">电子商务/零售</span>
            </div>

            {/* 规模 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-gray-500">规模</span>
              </div>
              <span className="text-sm text-gray-700">50-200 员工</span>
            </div>

            {/* 地址 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-gray-500">地址</span>
              </div>
              <span className="text-sm text-gray-700">{conversation.customer.country}</span>
            </div>

            {/* 客单价 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-gray-500">平均客单价</span>
              </div>
              <span className="text-sm font-medium text-emerald-700">$150-$300</span>
            </div>
          </div>
        </div>

        {/* AI会话总结与洞察 */}
        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-700">AI会话总结</span>
            </div>
          </div>

          <p className="text-sm text-amber-800 leading-relaxed mb-4">
            B级高意向批发客户，主要关注Nike Air Max 270、Adidas Yeezy 350等鞋类产品，预算$50-$200，计划中批量(10-99件)采购用于转售。客户价格敏感度高，物流时效要求严格，本周内有明确采购意向，需优先跟进。
          </p>
          
          {/* AI洞察分析 */}
          <div className="pt-3 border-t border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-700">AI洞察分析</span>
            </div>

            <div className="space-y-3">
              {/* 客户核心诉求 */}
              <div className="flex items-start gap-2">
                <Target className="w-3.5 h-3.5 text-amber-400 mt-0.5" />
                <div>
                  <span className="text-xs text-amber-600">客户核心诉求</span>
                  <p className="text-sm text-amber-800">批发价格优惠、稳定货源供应、快速物流配送，关注Nike/Adidas热门款式的利润空间。</p>
                </div>
              </div>

              {/* 情绪状态 */}
              <div className="flex items-start gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <span className="text-xs text-amber-600">购买意愿</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-amber-200 rounded-full overflow-hidden">
                      <div className="w-[85%] h-full bg-green-500 rounded-full" />
                    </div>
                    <span className="text-xs font-medium text-green-600">强烈 85%</span>
                  </div>
                </div>
              </div>

              {/* 需关注的问题 */}
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5" />
                <div>
                  <span className="text-xs text-amber-600">需关注的风险</span>
                  <ul className="text-sm text-amber-800 space-y-0.5 mt-1">
                    <li>• 价格敏感度高，需提供有竞争力的批发价</li>
                    <li>• 物流时效要求严格，需确认发货周期</li>
                    <li>• 信任等级中等，建议分批付款降低风险</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* AI建议行动 */}
          <div className="pt-3 border-t border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-700">AI建议行动</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                <span className="w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full flex-shrink-0">!</span>
                <p className="text-sm text-amber-800">立即发送Nike Air Max 270批发报价单(10-99件阶梯价)</p>
              </div>
              <div className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                <span className="w-5 h-5 flex items-center justify-center bg-[#0059F8] text-white text-xs rounded-full flex-shrink-0">1</span>
                <p className="text-sm text-amber-800">确认库存并提供3-5天快速发货方案</p>
              </div>
              <div className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                <span className="w-5 h-5 flex items-center justify-center bg-[#0059F8] text-white text-xs rounded-full flex-shrink-0">2</span>
                <p className="text-sm text-amber-800">推荐PayPal分批付款(30%定金+70%发货前)</p>
              </div>
              <div className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                <span className="w-5 h-5 flex items-center justify-center bg-[#0059F8] text-white text-xs rounded-full flex-shrink-0">3</span>
                <p className="text-sm text-amber-800">附赠Yeezy 350样品图促进追加订单</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI行为预测 */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">AI行为预测</span>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">成交概率</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                  <div className="w-[75%] h-full bg-green-500 rounded-full" />
                </div>
                <span className="text-xs font-medium text-green-600">75%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">预计成交时间</span>
              <span className="text-xs font-medium text-blue-600">3-5天内</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">预计订单金额</span>
              <span className="text-xs font-medium text-emerald-600">$1,500-$3,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">复购可能性</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                  <div className="w-[80%] h-full bg-blue-500 rounded-full" />
                </div>
                <span className="text-xs font-medium text-blue-600">80%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">升级为A级客户</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                  <div className="w-[60%] h-full bg-amber-500 rounded-full" />
                </div>
                <span className="text-xs font-medium text-amber-600">60%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 互动统计 */}
        <div className="p-4 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">互动统计</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">12</p>
              <span className="text-xs text-gray-500">对话次数</span>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-gray-900">3.5</p>
              <span className="text-xs text-gray-500">响应(分钟)</span>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-semibold text-green-600">4.8</p>
              <span className="text-xs text-gray-500">满意度</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAIProfile;
