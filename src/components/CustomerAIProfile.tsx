import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { languageMap } from '@/data/mockData';
import type { AILabel } from '@/types';
import {
  Sparkles,
  FileText,
  User,
  X,
  TrendingUp,
  Target,
  Building2,
  Tag,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Zap,
  Pencil,
  Check,
  Loader2,
  Brain,
  ArrowRight
} from 'lucide-react';

interface CustomerAIProfileProps {
  onClose?: () => void;
}

// 动态字段值存储：fieldId -> 选中的标签值ID数组 或 文本内容
type DynamicFieldValues = Record<string, string[] | string>;

// 联系人信息
interface ContactFormData {
  nickname: string;
  email: string;
  phone: string;
  region: string;
  activity: 'lost' | 'low' | 'medium' | 'high';
  activeTime: string[];
  remark: string;
}

// 公司信息
interface CompanyFormData {
  companyName: string;
  industry: string;
  scale: string;
  address: string;
}

export const CustomerAIProfile: React.FC<CustomerAIProfileProps> = ({ onClose }) => {
  const {
    getSelectedConversation,
    generateAIReply,
    addMessage,
    userSettings,
    updateConversation,
    aiLabels,
  } = useStore();

  const conversation = getSelectedConversation();
  const aiSettings = userSettings.preferences.ai;

  // AI会话消息数量
  const aiMessageCount = useMemo(() => {
    if (!conversation) return 0;
    return (conversation.messages || []).filter(m => m.senderType === 'ai' || m.isAIGenerated).length;
  }, [conversation]);

  // 编辑状态
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);

  // AI会话总结加载状态（仅用于加载动画）
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  // AI智能分析面板展开状态
  const [_aiAnalysisExpanded, _setAiAnalysisExpanded] = useState(true);
  const [aiAnalysisTab, setAiAnalysisTab] = useState<'summary' | 'prediction'>('summary');

  // 从会话数据获取AI分析生成状态
  const aiSummaryGenerated = conversation?.aiAnalysisGenerated || false;

  // 滚动容器引用和当前激活的导航tab
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeNavTab, setActiveNavTab] = useState<string>('ai-analysis');

  // 导航tab配置
  const navTabs = [
    { id: 'ai-analysis', label: 'AI分析' },
    { id: 'ai-profile', label: 'AI画像' },
    { id: 'contact-info', label: '联系人' },
    { id: 'company-info', label: '公司' },
    { id: 'interaction-stats', label: '互动' },
  ];

  // 滚动到指定区域
  const scrollToSection = (sectionId: string) => {
    setActiveNavTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element && scrollContainerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 从 AI 标签数据动态获取各维度字段
  const profileFields = useMemo(() => {
    return aiLabels.filter((l) => l.parentId === 'dim_profile' && l.level === 3)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [aiLabels]);

  const getFieldValues = (fieldId: string) => {
    return aiLabels.filter((l) => l.parentId === fieldId && l.level === 4)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  };

  // 动态字段值：fieldId -> 选中的标签ID数组 或 文本内容
  const [profileFieldValues, setProfileFieldValues] = useState<DynamicFieldValues>({});

  // 联系人信息固定字段
  const [contactData, setContactData] = useState<ContactFormData>({
    nickname: '',
    email: '',
    phone: '',
    region: '',
    activity: 'medium',
    activeTime: [],
    remark: '',
  });

  // 公司信息固定字段
  const [companyData, setCompanyData] = useState<CompanyFormData>({
    companyName: '',
    industry: '',
    scale: '',
    address: '',
  });

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

  // 动态字段值切换
  const toggleFieldValue = (
    setter: React.Dispatch<React.SetStateAction<DynamicFieldValues>>,
    fieldId: string,
    valueId: string,
    mode: 'single' | 'multiple'
  ) => {
    setter((prev) => {
      const current = (prev[fieldId] as string[]) || [];
      if (mode === 'single') return { ...prev, [fieldId]: current.includes(valueId) ? [] : [valueId] };
      return { ...prev, [fieldId]: current.includes(valueId) ? current.filter((v) => v !== valueId) : [...current, valueId] };
    });
  };

  const setFieldText = (
    setter: React.Dispatch<React.SetStateAction<DynamicFieldValues>>,
    fieldId: string,
    text: string
  ) => {
    setter((prev) => ({ ...prev, [fieldId]: text }));
  };

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl p-6">
        <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mb-3">
          <User className="w-8 h-8 text-[#FF6B35]" />
        </div>
        <p className="text-gray-500 text-sm">选择一个会话查看客户画像</p>
      </div>
    );
  }
  
  const customerLanguage = languageMap[conversation.customer.language] || { name: conversation.customer.language, flag: '🌐' };
  
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#FF6B35]/5 to-purple-50/50">
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

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-100 bg-gray-50/50">
        {navTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
              activeNavTab === tab.id
                ? 'bg-[#FF6B35] text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* AI智能分析入口 - 合并AI会话总结和AI行为预测 */}
        <div id="ai-analysis" className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl p-[1px] shadow-lg shadow-purple-200/50">
          <div className="bg-white rounded-xl overflow-hidden">
            {/* 入口头部 */}
            <div className="w-full px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-gray-900">AI智能分析</h3>
                  <p className="text-xs text-gray-500">会话总结 · 行为预测</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!aiSummaryGenerated && (
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 rounded-full">
                    待生成
                  </span>
                )}
                {aiSummaryGenerated && (
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded-full">
                    已分析
                  </span>
                )}
              </div>
            </div>

            {/* 内容区域 */}
            <div className="border-t border-gray-100">
                {/* Tab 切换 */}
                <div className="flex border-b border-gray-100">
                  <button
                    onClick={() => setAiAnalysisTab('summary')}
                    className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
                      aiAnalysisTab === 'summary'
                        ? 'text-purple-600 border-b-2 border-purple-500 bg-purple-50/50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      会话总结
                    </div>
                  </button>
                  <button
                    onClick={() => setAiAnalysisTab('prediction')}
                    className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
                      aiAnalysisTab === 'prediction'
                        ? 'text-purple-600 border-b-2 border-purple-500 bg-purple-50/50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      行为预测
                    </div>
                  </button>
                </div>

                {/* Tab 内容 - 增加高度 */}
                <div className="p-4 min-h-[280px]">
                  {aiAnalysisTab === 'summary' ? (
                    /* 会话总结内容 */
                    <div className="space-y-4">
                      {!aiSummaryGenerated ? (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                          <Sparkles className="w-10 h-10 mb-3 opacity-30" />
                          <p className="text-xs mb-4">点击生成，AI将分析会话内容</p>
                          <button
                            onClick={() => {
                              if (!conversation) return;
                              setAiSummaryLoading(true);
                              setTimeout(() => {
                                setAiSummaryLoading(false);
                                // 持久化到会话数据
                                updateConversation(conversation.id, { aiAnalysisGenerated: true });
                              }, 1500);
                            }}
                            disabled={aiSummaryLoading}
                            className="px-5 py-2.5 text-xs font-medium bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-70"
                          >
                            {aiSummaryLoading ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                生成中...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5" />
                                生成总结
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* 会话摘要 */}
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-2">会话摘要</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              B级高意向批发客户，主要关注Nike Air Max 270等鞋类产品，预算$50-$200，计划中批量采购用于转售。价格敏感度高，本周内有明确采购意向。
                            </p>
                          </div>

                          {/* 核心诉求 */}
                          <div className="flex items-center gap-2 py-2 px-3 bg-purple-50 rounded-lg">
                            <Target className="w-4 h-4 text-purple-500" />
                            <span className="text-xs text-purple-700 font-medium">核心诉求：批发价格优惠、快速物流</span>
                          </div>

                          {/* 下一步行动建议 */}
                          <div className="pt-2 border-t border-gray-100">
                            <h4 className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5 text-amber-500" />
                              下一步行动建议
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2 p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100/60">
                                <ArrowRight className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-gray-700">发送批发价格表和MOQ优惠政策</span>
                              </div>
                              <div className="flex items-start gap-2 p-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100/60">
                                <ArrowRight className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-gray-700">推荐热销款式组合，提供样品试单方案</span>
                              </div>
                              <div className="flex items-start gap-2 p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100/60">
                                <ArrowRight className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-gray-700">强调物流时效优势，提供运费优惠</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* 行为预测内容 */
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">成交概率</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-[75%] h-full bg-green-500 rounded-full" />
                          </div>
                          <span className="text-xs font-medium text-green-600">75%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">预计成交</span>
                        <span className="text-xs font-medium text-purple-600">3-5天内</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">预计金额</span>
                        <span className="text-xs font-medium text-emerald-600">$1,500-$3,000</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">复购可能</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-[80%] h-full bg-blue-500 rounded-full" />
                          </div>
                          <span className="text-xs font-medium text-blue-600">80%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
          </div>
        </div>

        {/* AI画像标签 */}
        <div id="ai-profile" className="p-4 bg-gradient-to-br from-orange-50/80 to-amber-50/50 rounded-xl border border-orange-100/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-sm font-medium text-[#FF6B35]">AI画像标签</span>
            </div>
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className="p-1.5 hover:bg-orange-100 rounded-lg transition-colors"
              title={editingProfile ? "完成编辑" : "编辑"}
            >
              {editingProfile ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Pencil className="w-3.5 h-3.5 text-[#FF6B35]" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {profileFields.map((field) => {
              const values = getFieldValues(field.id);
              const selected = (profileFieldValues[field.id] as string[]) || [];
              const textVal = (profileFieldValues[field.id] as string) || '';
              const isWide = field.selectMode === 'multiple';
              return (
                <div key={field.id} className={isWide ? 'col-span-2' : ''}>
                  <DynamicFieldSection
                    field={field}
                    values={values}
                    selected={selected}
                    textVal={typeof profileFieldValues[field.id] === 'string' ? textVal : ''}
                    editing={editingProfile}
                    onToggle={(valId) => toggleFieldValue(setProfileFieldValues, field.id, valId, field.selectMode || 'single')}
                    onTextChange={(text) => setFieldText(setProfileFieldValues, field.id, text)}
                  />
                </div>
              );
            })}
            {profileFields.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">暂无画像字段，请在AI标签管理中配置</p>
            )}
          </div>
        </div>

        {/* 联系人信息 - 动态读取AI标签 */}
        <div id="contact-info" className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700">联系人信息</span>
            </div>
            <button
              onClick={() => setEditingContact(!editingContact)}
              className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
              title={editingContact ? "完成编辑" : "编辑"}
            >
              {editingContact ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Pencil className="w-3.5 h-3.5 text-blue-500" />
              )}
            </button>
          </div>
          <div className="space-y-3">
            {/* 昵称 */}
            <div>
              <span className="text-xs text-gray-600 mb-1 block font-medium">昵称</span>
              {editingContact ? (
                <input type="text" value={contactData.nickname} onChange={(e) => setContactData({ ...contactData, nickname: e.target.value })} placeholder="请输入昵称" className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
              ) : (
                <span className="text-sm text-gray-700">{contactData.nickname || <span className="text-gray-300 italic text-xs">未填写</span>}</span>
              )}
            </div>
            {/* 邮箱 */}
            <div>
              <span className="text-xs text-gray-600 mb-1 block font-medium flex items-center gap-1"><Mail className="w-3 h-3" />邮箱</span>
              {editingContact ? (
                <input type="email" value={contactData.email} onChange={(e) => setContactData({ ...contactData, email: e.target.value })} placeholder="请输入邮箱" className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
              ) : (
                <span className="text-sm text-gray-700">{contactData.email || <span className="text-gray-300 italic text-xs">未填写</span>}</span>
              )}
            </div>
            {/* 电话 */}
            <div>
              <span className="text-xs text-gray-600 mb-1 block font-medium flex items-center gap-1"><Phone className="w-3 h-3" />电话</span>
              {editingContact ? (
                <input type="tel" value={contactData.phone} onChange={(e) => setContactData({ ...contactData, phone: e.target.value })} placeholder="请输入电话" className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
              ) : (
                <span className="text-sm text-gray-700">{contactData.phone || <span className="text-gray-300 italic text-xs">未填写</span>}</span>
              )}
            </div>
            {/* 地区 */}
            <div>
              <span className="text-xs text-gray-600 mb-1 block font-medium flex items-center gap-1"><MapPin className="w-3 h-3" />地区</span>
              {editingContact ? (
                <input type="text" value={contactData.region} onChange={(e) => setContactData({ ...contactData, region: e.target.value })} placeholder="请输入地区" className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
              ) : (
                <span className="text-sm text-gray-700">{contactData.region || <span className="text-gray-300 italic text-xs">未填写</span>}</span>
              )}
            </div>
            {/* 活跃度 */}
            <div>
              <span className="text-xs text-gray-600 mb-1.5 block font-medium">活跃度</span>
              {editingContact ? (
                <div className="flex flex-wrap gap-1.5">
                  {([
                    { value: 'lost', label: '已流失', color: 'bg-gray-100 text-gray-500', activeColor: 'bg-gray-500 text-white' },
                    { value: 'low', label: '低活跃', color: 'bg-amber-50 text-amber-600', activeColor: 'bg-amber-500 text-white' },
                    { value: 'medium', label: '中活跃', color: 'bg-blue-50 text-blue-600', activeColor: 'bg-blue-500 text-white' },
                    { value: 'high', label: '高活跃', color: 'bg-green-50 text-green-600', activeColor: 'bg-green-500 text-white' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setContactData({ ...contactData, activity: opt.value })}
                      className={`px-2.5 py-1 text-xs rounded-full transition-colors ${contactData.activity === opt.value ? opt.activeColor : opt.color}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              ) : (
                <span className={`px-2.5 py-1 text-xs rounded-full inline-block ${
                  contactData.activity === 'lost' ? 'bg-gray-100 text-gray-500' :
                  contactData.activity === 'low' ? 'bg-amber-100 text-amber-600' :
                  contactData.activity === 'medium' ? 'bg-blue-100 text-blue-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {contactData.activity === 'lost' ? '已流失' : contactData.activity === 'low' ? '低活跃' : contactData.activity === 'medium' ? '中活跃' : '高活跃'}
                </span>
              )}
            </div>
            {/* 活跃时段（多选） */}
            <div>
              <span className="text-xs text-gray-600 mb-1 block font-medium flex items-center gap-1"><Clock className="w-3 h-3" />活跃时段</span>
              {editingContact ? (
                <div className="flex flex-wrap gap-1.5">
                  {['早晨 6-9点', '上午 9-12点', '下午 12-17点', '傍晚 17-20点', '晚上 20-24点', '凌晨 0-6点'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setContactData({
                        ...contactData,
                        activeTime: contactData.activeTime.includes(t)
                          ? contactData.activeTime.filter((v) => v !== t)
                          : [...contactData.activeTime, t]
                      })}
                      className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                        contactData.activeTime.includes(t)
                          ? 'bg-violet-100 text-violet-700 border-violet-300'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-violet-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-700">
                  {contactData.activeTime.length > 0
                    ? contactData.activeTime.join('、')
                    : <span className="text-gray-300 italic text-xs">未填写</span>}
                </span>
              )}
            </div>
            {/* 备注 */}
            <div>
              <span className="text-xs text-gray-600 mb-1 block font-medium">备注</span>
              {editingContact ? (
                <textarea value={contactData.remark} onChange={(e) => setContactData({ ...contactData, remark: e.target.value })} placeholder="请输入备注" rows={2} className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
              ) : (
                <span className="text-sm text-gray-700">{contactData.remark || <span className="text-gray-300 italic text-xs">未填写</span>}</span>
              )}
            </div>
          </div>
        </div>

        {/* 公司信息 */}
        <div id="company-info" className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-700">公司信息</span>
            </div>
            <button
              onClick={() => setEditingCompany(!editingCompany)}
              className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
              title={editingCompany ? "完成编辑" : "编辑"}
            >
              {editingCompany ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Pencil className="w-3.5 h-3.5 text-emerald-500" />
              )}
            </button>
          </div>
          <div className="space-y-3">
            {/* 公司名称 */}
            <div>
              <span className="text-xs text-gray-600 mb-1 block font-medium">公司名称</span>
              {editingCompany ? (
                <input type="text" value={companyData.companyName} onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })} placeholder="请输入公司名称" className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              ) : (
                <span className="text-sm text-gray-700">{companyData.companyName || <span className="text-gray-300 italic text-xs">未填写</span>}</span>
              )}
            </div>
            {/* 行业 */}
            <div>
              <span className="text-xs text-gray-600 mb-1 block font-medium">行业</span>
              {editingCompany ? (
                <input type="text" value={companyData.industry} onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })} placeholder="请输入行业" className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              ) : (
                <span className="text-sm text-gray-700">{companyData.industry || <span className="text-gray-300 italic text-xs">未填写</span>}</span>
              )}
            </div>
            {/* 规模 */}
            <div>
              <span className="text-xs text-gray-600 mb-1 block font-medium">规模</span>
              {editingCompany ? (
                <input type="text" value={companyData.scale} onChange={(e) => setCompanyData({ ...companyData, scale: e.target.value })} placeholder="请输入公司规模" className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              ) : (
                <span className="text-sm text-gray-700">{companyData.scale || <span className="text-gray-300 italic text-xs">未填写</span>}</span>
              )}
            </div>
            {/* 地址 */}
            <div>
              <span className="text-xs text-gray-600 mb-1 block font-medium flex items-center gap-1"><MapPin className="w-3 h-3" />地址</span>
              {editingCompany ? (
                <input type="text" value={companyData.address} onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })} placeholder="请输入公司地址" className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              ) : (
                <span className="text-sm text-gray-700">{companyData.address || <span className="text-gray-300 italic text-xs">未填写</span>}</span>
              )}
            </div>
          </div>
        </div>

        {/* 互动统计 */}
        <div id="interaction-stats" className="p-4 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">互动统计</span>
          </div>
          {conversation?.isGroup ? (
            /* 群聊统计 */
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-900">{conversation.groupMemberCount || 0}</p>
                <span className="text-xs text-gray-500">群成员</span>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-900">156</p>
                <span className="text-xs text-gray-500">消息总数</span>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold text-green-600">72%</p>
                <span className="text-xs text-gray-500">活跃率</span>
              </div>
            </div>
          ) : (
            /* 单聊统计 */
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-900">12</p>
                <span className="text-xs text-gray-500">对话次数</span>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-900">3.5</p>
                <span className="text-xs text-gray-500">响应(分钟)</span>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded-lg">
                <p className="text-lg font-semibold text-purple-700">{aiMessageCount}</p>
                <span className="text-xs text-purple-500">AI私信次数</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============ DynamicFieldSection ============
const DynamicFieldSection: React.FC<{
  field: AILabel;
  values: AILabel[];
  selected: string[];
  textVal: string;
  editing: boolean;
  onToggle: (valId: string) => void;
  onTextChange: (text: string) => void;
}> = ({ field, values, selected, textVal, editing, onToggle, onTextChange }) => (
  <div>
    <span className="text-xs text-gray-600 mb-1.5 block font-medium">{field.name}</span>
    {field.inputType === 'text' ? (
      editing ? (
        <input
          type="text"
          value={textVal}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={`请输入${field.name}`}
          className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
        />
      ) : (
        <span className="text-sm text-gray-700">{textVal || <span className="text-gray-300 italic">未填写</span>}</span>
      )
    ) : editing ? (
      <div className="flex flex-wrap gap-1.5">
        {values.map((val) => {
          const isSelected = selected.includes(val.id);
          return (
            <button
              key={val.id}
              onClick={() => onToggle(val.id)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                isSelected
                  ? 'text-white border-transparent'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              style={isSelected ? { backgroundColor: val.color, borderColor: val.color } : undefined}
            >
              {val.name}
            </button>
          );
        })}
        {values.length === 0 && (
          <span className="text-xs text-gray-300 italic">暂无可选标签值</span>
        )}
      </div>
    ) : (
      <div className="flex flex-wrap gap-1.5">
        {selected.length > 0 ? (
          selected.map((valId) => {
            const val = values.find((v) => v.id === valId);
            if (!val) return null;
            return (
              <span
                key={val.id}
                className="px-2.5 py-1 text-xs rounded-full border"
                style={{ backgroundColor: val.color + '15', borderColor: val.color + '30', color: val.color }}
              >
                {val.name}
              </span>
            );
          })
        ) : (
          <span className="text-xs text-gray-300 italic">未选择</span>
        )}
      </div>
    )}
  </div>
);

export default CustomerAIProfile;
