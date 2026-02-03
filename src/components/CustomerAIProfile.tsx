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
  TrendingUp as TrendingUpIcon,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
        {/* AI客户画像 - 核心信息 */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-700">AI客户画像</span>
          </div>
          
          <div className="space-y-4">
            {/* 客户标签 */}
            <div>
              <span className="text-xs text-purple-600">客户标签</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {conversation.customer.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* 关键数据 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/50 rounded-lg">
                <span className="text-xs text-purple-600">购买意向</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-purple-200 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-purple-500 rounded-full" />
                  </div>
                  <span className="text-sm font-semibold text-purple-700">75%</span>
                </div>
              </div>
              <div className="p-3 bg-white/50 rounded-lg">
                <span className="text-xs text-purple-600">复购概率</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-purple-200 rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-purple-500 rounded-full" />
                  </div>
                  <span className="text-sm font-semibold text-purple-700">85%</span>
                </div>
              </div>
            </div>
            
            {/* 预估数据 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/50 rounded-lg">
                <span className="text-xs text-purple-600">预估客单价</span>
                <p className="text-lg font-semibold text-purple-800">¥2,800</p>
              </div>
              <div className="p-3 bg-white/50 rounded-lg">
                <span className="text-xs text-purple-600">总消费</span>
                <p className="text-lg font-semibold text-purple-800">¥0</p>
              </div>
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
            {conversation.aiSummary || '客户对之前购买的无线耳机满意，想再买一件作为礼物，询问是否有老客户折扣。'}
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
                  <p className="text-sm text-amber-800">关注产品价格、配送时间和售后服务，对性价比较为敏感。</p>
                </div>
              </div>
              
              {/* 情绪状态 */}
              <div className="flex items-start gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <span className="text-xs text-amber-600">情绪状态</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-amber-200 rounded-full overflow-hidden">
                      <div className="w-[80%] h-full bg-green-500 rounded-full" />
                    </div>
                    <span className="text-xs font-medium text-green-600">积极 80%</span>
                  </div>
                </div>
              </div>
              
              {/* 需关注的问题 */}
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5" />
                <div>
                  <span className="text-xs text-amber-600">需关注的问题</span>
                  <ul className="text-sm text-amber-800 space-y-0.5 mt-1">
                    <li>• 对价格有一定顾虑，需要强调产品价值</li>
                    <li>• 配送时效是决策关键因素</li>
                  </ul>
                </div>
              </div>
              
              {/* AI建议行动 */}
              <div className="pt-2 border-t border-amber-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs text-amber-600">AI建议行动</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                    <span className="w-5 h-5 flex items-center justify-center bg-[#0059F8] text-white text-xs rounded-full flex-shrink-0">1</span>
                    <p className="text-sm text-amber-800">提供详细的产品对比和优势说明</p>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                    <span className="w-5 h-5 flex items-center justify-center bg-[#0059F8] text-white text-xs rounded-full flex-shrink-0">2</span>
                    <p className="text-sm text-amber-800">给出明确的配送时间表</p>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                    <span className="w-5 h-5 flex items-center justify-center bg-[#0059F8] text-white text-xs rounded-full flex-shrink-0">3</span>
                    <p className="text-sm text-amber-800">提供批量采购的阶梯报价</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* AI行为预测 */}
        <div className="p-4 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUpIcon className="w-4 h-4 text-[#0059F8]" />
            <span className="text-sm font-medium text-gray-900">AI行为预测</span>
          </div>
          <div className="space-y-3">
            {[
              { label: '成交概率', value: '75%', trend: 'up', color: 'text-green-600' },
              { label: '推荐意愿', value: '70%', trend: 'up', color: 'text-green-600' },
              { label: '价格敏感度', value: '高', trend: 'stable', color: 'text-amber-600' },
              { label: '服务期望', value: '高', trend: 'up', color: 'text-blue-600' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm font-medium", item.color)}>{item.value}</span>
                  {item.trend === 'up' && <span className="text-green-500 text-xs">↑</span>}
                  {item.trend === 'down' && <span className="text-red-500 text-xs">↓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 历史互动 */}
        <div className="p-4 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">历史互动</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">总对话次数</span>
              <span className="text-sm font-medium text-gray-900">12次</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">平均响应时间</span>
              <span className="text-sm font-medium text-gray-900">3.5分钟</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">满意度评分</span>
              <span className="text-sm font-medium text-green-600">4.8/5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAIProfile;
