import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { languageMap } from '@/data/mockData';
import { 
  Sparkles, 
  Languages, 
  MessageSquare, 
  FileText, 
  User,
  Send,
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  X,
  Wand2,
  Zap,
  BrainCircuit,
  Bot,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIAssistantProps {
  onClose?: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const { 
    getSelectedConversation,
    generateAIReply,
    generateSummary,
    isGeneratingReply,
    isSummarizing,
    addMessage,
    userSettings,
    updateUserSettings
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'reply' | 'translate' | 'summary' | 'profile'>('reply');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedTone, setSelectedTone] = useState<'professional' | 'friendly' | 'concise' | 'empathetic'>('friendly');
  
  const conversation = getSelectedConversation();
  const aiSettings = userSettings.preferences.ai;
  
  // AI自动回复 - 当开启AI接管且收到新客户消息时
  useEffect(() => {
    if (!conversation || !aiSettings.enabled || !aiSettings.autoReply) return;
    
    const lastMessage = conversation.lastMessage;
    if (lastMessage?.senderType === 'customer' && lastMessage.status === 'unread') {
      // 模拟AI自动回复
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
  
  const handleGenerateReply = async () => {
    if (!conversation) return;
    const suggestions = await generateAIReply(conversation.id);
    setAiSuggestions(suggestions.map(s => s.content));
  };
  
  const handleGenerateSummary = async () => {
    if (!conversation) return;
    const result = await generateSummary(conversation.id);
    setSummary(result);
  };
  
  const handleUseSuggestion = (suggestion: string) => {
    if (!conversation) return;
    
    const newMessage = {
      id: `msg_${Date.now()}`,
      conversationId: conversation.id,
      senderId: userSettings.id,
      senderType: 'agent' as const,
      content: suggestion,
      timestamp: new Date(),
      status: 'sent' as const,
    };
    
    addMessage(conversation.id, newMessage);
  };
  
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  
  const tones = [
    { id: 'professional', name: '专业', icon: BrainCircuit },
    { id: 'friendly', name: '友好', icon: Sparkles },
    { id: 'concise', name: '简洁', icon: Zap },
    { id: 'empathetic', name: '共情', icon: User },
  ] as const;
  
  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl p-6">
        <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mb-3">
          <Sparkles className="w-8 h-8 text-[#FF6B35]" />
        </div>
        <p className="text-gray-500 text-sm">选择一个会话使用AI助手</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#FF6B35]/5 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI助手</h3>
            <p className="text-xs text-gray-500">智能辅助回复</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      
      {/* AI接管状态提示 */}
      {aiSettings.enabled && aiSettings.autoReply && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-700">AI客服接管模式已开启</span>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-gray-50/50">
        {[
          { id: 'reply', name: '智能回复', icon: MessageSquare },
          { id: 'translate', name: '翻译', icon: Languages },
          { id: 'summary', name: '总结', icon: FileText },
          { id: 'profile', name: '画像', icon: User },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-white text-[#FF6B35] shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.name}</span>
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Smart Reply Tab */}
        {activeTab === 'reply' && (
          <div className="space-y-4">
            {/* AI接管开关 */}
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-600" />
                <div>
                  <p className="font-medium text-sm text-gray-900">AI自动回复</p>
                  <p className="text-xs text-gray-500">AI将自动回复客户消息</p>
                </div>
              </div>
              <button 
                onClick={() => updateUserSettings({
                  preferences: {
                    ...userSettings.preferences,
                    ai: {
                      ...userSettings.preferences.ai,
                      autoReply: !aiSettings.autoReply
                    }
                  }
                })}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  aiSettings.autoReply ? "bg-amber-500" : "bg-gray-200"
                )}
              >
                <span className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  aiSettings.autoReply ? "left-7" : "left-1"
                )} />
              </button>
            </div>
            
            {/* Tone Selection */}
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">回复风格</label>
              <div className="grid grid-cols-2 gap-2">
                {tones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                      selectedTone === tone.id
                        ? "bg-[#FF6B35] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    <tone.icon className="w-4 h-4" />
                    <span>{tone.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Generate Button */}
            <button
              onClick={handleGenerateReply}
              disabled={isGeneratingReply}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all",
                isGeneratingReply
                  ? "bg-gray-100 text-gray-400"
                  : "bg-[#FF6B35] text-white hover:bg-[#E85A2A] shadow-md hover:shadow-lg"
              )}
            >
              {isGeneratingReply ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>生成中...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>生成回复建议</span>
                </>
              )}
            </button>
            
            {/* Suggestions */}
            {aiSuggestions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">回复建议</span>
                  <button 
                    onClick={handleGenerateReply}
                    className="text-xs text-[#FF6B35] hover:underline"
                  >
                    重新生成
                  </button>
                </div>
                
                {aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="group p-3 bg-gray-50 rounded-xl hover:bg-[#FF6B35]/5 border border-transparent hover:border-[#FF6B35]/20 transition-all"
                  >
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {suggestion}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                          <ThumbsUp className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                          <ThumbsDown className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(suggestion, index)}
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                          title="复制"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleUseSuggestion(suggestion)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#FF6B35] text-white text-xs font-medium rounded-lg hover:bg-[#E85A2A] transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          <span>使用</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Quick Replies */}
            {!aiSuggestions.length && !isGeneratingReply && (
              <div className="space-y-3">
                <span className="text-xs font-medium text-gray-500">快捷回复</span>
                {[
                  '您好，感谢您的咨询！请问有什么可以帮您？',
                  '请稍等，我为您查询一下相关信息。',
                  '感谢您的耐心等待，已经为您处理好了。',
                  '如果您还有其他问题，随时联系我。',
                ].map((text, i) => (
                  <button
                    key={i}
                    onClick={() => handleUseSuggestion(text)}
                    className="w-full text-left p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-sm text-gray-700"
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Translate Tab */}
        {activeTab === 'translate' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Languages className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">自动翻译</span>
              </div>
              <p className="text-xs text-blue-600">
                客户语言: {languageMap[conversation.customer.language]?.name || conversation.customer.language}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                点击消息旁的翻译按钮即可查看翻译
              </p>
            </div>
            
            <div className="space-y-2">
              <span className="text-xs font-medium text-gray-500">支持语言</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(languageMap).map(([code, info]) => (
                  <span
                    key={code}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {info.flag} {info.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Summary Tab - AI会话总结和洞察 */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <button
              onClick={handleGenerateSummary}
              disabled={isSummarizing}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all",
                isSummarizing
                  ? "bg-gray-100 text-gray-400"
                  : "bg-[#FF6B35] text-white hover:bg-[#E85A2A] shadow-md"
              )}
            >
              {isSummarizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI分析中...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>生成AI总结与洞察</span>
                </>
              )}
            </button>
            
            {/* AI会话总结 */}
            {(conversation.aiSummary || summary) && (
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-700">AI会话总结</span>
                </div>
                <p className="text-sm text-amber-800 leading-relaxed">
                  {summary || conversation.aiSummary}
                </p>
              </div>
            )}
            
            {/* AI洞察分析 */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-700">AI洞察分析</span>
              </div>
              
              <div className="space-y-4">
                {/* 客户诉求 */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs text-purple-600">客户核心诉求</span>
                  </div>
                  <p className="text-sm text-purple-800">
                    客户主要关注产品价格、配送时间和售后服务，对性价比较为敏感。
                  </p>
                </div>
                
                {/* 情绪分析 */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs text-purple-600">情绪状态</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-purple-200 rounded-full overflow-hidden">
                      <div className="w-[80%] h-full bg-green-500 rounded-full" />
                    </div>
                    <span className="text-xs font-medium text-green-600">积极 80%</span>
                  </div>
                </div>
                
                {/* 关键问题 */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs text-purple-600">需关注的问题</span>
                  </div>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• 对价格有一定顾虑，需要强调产品价值</li>
                    <li>• 配送时效是决策关键因素</li>
                    <li>• 期待更优惠的批量采购价格</li>
                  </ul>
                </div>
                
                {/* AI建议 */}
                <div className="pt-3 border-t border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs text-purple-600">AI建议行动</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                      <span className="w-5 h-5 flex items-center justify-center bg-[#FF6B35] text-white text-xs rounded-full">1</span>
                      <p className="text-sm text-purple-800">提供详细的产品对比和优势说明</p>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                      <span className="w-5 h-5 flex items-center justify-center bg-[#FF6B35] text-white text-xs rounded-full">2</span>
                      <p className="text-sm text-purple-800">给出明确的配送时间表</p>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                      <span className="w-5 h-5 flex items-center justify-center bg-[#FF6B35] text-white text-xs rounded-full">3</span>
                      <p className="text-sm text-purple-800">提供批量采购的阶梯报价</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Profile Tab - AI客户画像 */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* AI客户画像概览 */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-purple-500" />
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
                
                {/* 购买意向 */}
                <div>
                  <span className="text-xs text-purple-600">购买意向</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-purple-200 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-purple-500 rounded-full" />
                    </div>
                    <span className="text-xs font-medium text-purple-700">75%</span>
                  </div>
                </div>
                
                {/* 客户价值 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-white/50 rounded-lg">
                    <span className="text-xs text-purple-600">预估客单价</span>
                    <p className="text-lg font-semibold text-purple-800">¥2,800</p>
                  </div>
                  <div className="p-2 bg-white/50 rounded-lg">
                    <span className="text-xs text-purple-600">复购概率</span>
                    <p className="text-lg font-semibold text-purple-800">85%</p>
                  </div>
                </div>
                
                {/* 沟通建议 */}
                <div>
                  <span className="text-xs text-purple-600">AI沟通建议</span>
                  <p className="text-sm text-purple-800 mt-1">
                    该客户对价格敏感，建议强调产品性价比和优惠活动。沟通时保持专业友好的态度，及时回复配送相关问题。
                  </p>
                </div>
              </div>
            </div>
            
            {/* 行为预测 */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-gray-500">AI行为预测</span>
              <div className="space-y-2">
                {[
                  { label: '成交概率', value: '75%', trend: 'up', color: 'text-green-600' },
                  { label: '推荐意愿', value: '70%', trend: 'up', color: 'text-green-600' },
                  { label: '价格敏感度', value: '高', trend: 'stable', color: 'text-amber-600' },
                  { label: '服务期望', value: '高', trend: 'up', color: 'text-blue-600' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
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
            <div className="space-y-2">
              <span className="text-xs font-medium text-gray-500">历史互动分析</span>
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">总对话次数</span>
                  <span className="text-sm font-medium text-gray-900">12次</span>
                </div>
                <div className="flex items-center justify-between mb-2">
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
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
