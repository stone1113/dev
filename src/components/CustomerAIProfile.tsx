import React, { useEffect, useState, useRef } from 'react';
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
  FileEdit,
  Pencil,
  Check,
  Plus,
  Loader2,
  ChevronDown,
  ChevronUp,
  Brain,
  ArrowRight
} from 'lucide-react';

interface CustomerAIProfileProps {
  onClose?: () => void;
}

// 编辑表单数据类型
interface ProfileFormData {
  customerLevel: string;
  customerTypes: string[];
  categories: string[];
  products: string[];
  budgetRange: string;
  intentQuantity: string;
  purchasePurpose: string;
  priceSensitivity: string;
  logisticsSensitivity: string;
  authenticitySensitivity: string;
  paymentSecuritySensitivity: string;
  qualitySensitivity: string;
  paymentPreference: string;
  trustLevel: string;
  channelSource: string;
  lifecycle: string;
  urgency: string;
}

interface ContactFormData {
  nickname: string;
  email: string;
  phone: string;
  region: string;
  activeHours: string;
  activityLevel: string;
  notes: string;
}

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
    updateConversation
  } = useStore();

  const conversation = getSelectedConversation();
  const aiSettings = userSettings.preferences.ai;

  // 编辑状态
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);

  // AI会话总结加载状态（仅用于加载动画）
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  // AI智能分析面板展开状态
  const [aiAnalysisExpanded, setAiAnalysisExpanded] = useState(true);
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

  // AI画像表单数据
  const [profileData, setProfileData] = useState<ProfileFormData>({
    customerLevel: 'B级 - 高意向询价',
    customerTypes: ['批发', '平台卖家'],
    categories: ['鞋类', '运动服饰'],
    products: ['Nike Air Max 270', 'Adidas Yeezy 350', 'Jordan 1 Retro'],
    budgetRange: '中($50-$200)',
    intentQuantity: '中批(10-99)',
    purchasePurpose: '转售',
    priceSensitivity: '高',
    logisticsSensitivity: '高',
    authenticitySensitivity: '高',
    paymentSecuritySensitivity: '中',
    qualitySensitivity: '高',
    paymentPreference: 'PayPal',
    trustLevel: '中',
    channelSource: 'WhatsApp',
    lifecycle: '潜在(B)',
    urgency: '本周',
  });

  // 联系人表单数据
  const [contactData, setContactData] = useState<ContactFormData>({
    nickname: '',
    email: '',
    phone: '+1-234-567-890',
    region: '',
    activeHours: '20:00-22:00 (UTC-5)',
    activityLevel: '中活跃',
    notes: '偏好白色鞋/喜欢跑步风格',
  });

  // 公司表单数据
  const [companyData, setCompanyData] = useState<CompanyFormData>({
    companyName: 'TechCorp International',
    industry: '电子商务/零售',
    scale: '50-200 员工',
    address: '',
  });

  // 同步客户数据到表单
  useEffect(() => {
    if (conversation) {
      setContactData(prev => ({
        ...prev,
        nickname: conversation.customer.name,
        email: conversation.customer.email || 'john@example.com',
        region: conversation.customer.country,
      }));
      setCompanyData(prev => ({
        ...prev,
        address: conversation.customer.country,
      }));
    }
  }, [conversation?.id]);
  
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

          <div className="space-y-3">
            {/* 客户等级 */}
            <div>
              <span className="text-xs text-gray-600 mb-1.5 block font-medium">客户等级</span>
              {editingProfile ? (
                <select
                  value={profileData.customerLevel}
                  onChange={(e) => setProfileData({ ...profileData, customerLevel: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
                >
                  <option value="A级 - 已成交">A级 - 已成交</option>
                  <option value="B级 - 高意向询价">B级 - 高意向询价</option>
                  <option value="C级 - 观望">C级 - 观望</option>
                  <option value="D级 - 仅加好友">D级 - 仅加好友</option>
                </select>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 text-xs bg-[#FF6B35] text-white rounded-lg font-medium">
                      {profileData.customerLevel}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">A(已成交) / B(高意向询价) / C(观望) / D(仅加好友)</p>
                </>
              )}
            </div>

            {/* 客户类型 */}
            <div>
              <span className="text-xs text-gray-600 mb-1.5 block font-medium">客户类型</span>
              {editingProfile ? (
                <div className="flex flex-wrap gap-1.5">
                  {profileData.customerTypes.map((type, idx) => (
                    <span key={idx} className="px-2.5 py-1 text-xs bg-[#FF6B35] text-white rounded-full flex items-center gap-1">
                      {type}
                      <button onClick={() => setProfileData({
                        ...profileData,
                        customerTypes: profileData.customerTypes.filter((_, i) => i !== idx)
                      })} className="hover:bg-white/20 rounded-full">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      const newType = prompt('输入新的客户类型:');
                      if (newType) setProfileData({ ...profileData, customerTypes: [...profileData.customerTypes, newType] });
                    }}
                    className="px-2 py-1 text-xs border border-dashed border-[#FF6B35] text-[#FF6B35] rounded-full flex items-center gap-1 hover:bg-[#FF6B35]/10"
                  >
                    <Plus className="w-3 h-3" />添加
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {profileData.customerTypes.map((type, idx) => (
                    <span key={idx} className={`px-2.5 py-1 text-xs rounded-full ${idx === 0 ? 'bg-[#FF6B35] text-white' : 'bg-[#FF6B35]/10 text-[#FF6B35]'}`}>
                      {type}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 意向品类 */}
            <div>
              <span className="text-xs text-gray-600 mb-1.5 block font-medium">意向品类</span>
              {editingProfile ? (
                <div className="flex flex-wrap gap-1.5">
                  {profileData.categories.map((cat, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-white text-gray-700 border border-gray-200 rounded-lg flex items-center gap-1">
                      <Package className="w-3 h-3 text-[#FF6B35]" />{cat}
                      <button onClick={() => setProfileData({
                        ...profileData,
                        categories: profileData.categories.filter((_, i) => i !== idx)
                      })} className="hover:bg-gray-100 rounded-full ml-1">
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      const newCat = prompt('输入新的意向品类:');
                      if (newCat) setProfileData({ ...profileData, categories: [...profileData.categories, newCat] });
                    }}
                    className="px-2 py-1 text-xs border border-dashed border-gray-300 text-gray-500 rounded-lg flex items-center gap-1 hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />添加
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {profileData.categories.map((cat, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-white text-gray-700 border border-gray-200 rounded-lg">
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 意向商品 */}
            <div>
              <span className="text-xs text-gray-600 mb-1.5 block font-medium">意向商品</span>
              {editingProfile ? (
                <div className="flex flex-wrap gap-1.5">
                  {profileData.products.map((product, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-white text-gray-700 border border-gray-200 rounded-lg flex items-center gap-1">
                      {product}
                      <button onClick={() => setProfileData({
                        ...profileData,
                        products: profileData.products.filter((_, i) => i !== idx)
                      })} className="hover:bg-gray-100 rounded-full ml-1">
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      const newProduct = prompt('输入新的意向商品:');
                      if (newProduct) setProfileData({ ...profileData, products: [...profileData.products, newProduct] });
                    }}
                    className="px-2 py-1 text-xs border border-dashed border-gray-300 text-gray-500 rounded-lg flex items-center gap-1 hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />添加
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {profileData.products.map((product, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-white text-gray-700 border border-gray-200 rounded-lg">
                      {product}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 预算区间 & 意向数量 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-gray-600 mb-1 block font-medium">预算区间</span>
                {editingProfile ? (
                  <select
                    value={profileData.budgetRange}
                    onChange={(e) => setProfileData({ ...profileData, budgetRange: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                  >
                    <option value="低(&lt;$50)">低(&lt;$50)</option>
                    <option value="中($50-$200)">中($50-$200)</option>
                    <option value="高($200-$500)">高($200-$500)</option>
                    <option value="超高(&gt;$500)">超高(&gt;$500)</option>
                  </select>
                ) : (
                  <span className="px-2 py-1 text-xs bg-white text-gray-700 border border-gray-200 rounded-lg">
                    {profileData.budgetRange}
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs text-gray-600 mb-1 block font-medium">意向数量</span>
                {editingProfile ? (
                  <select
                    value={profileData.intentQuantity}
                    onChange={(e) => setProfileData({ ...profileData, intentQuantity: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                  >
                    <option value="小批(1-9)">小批(1-9)</option>
                    <option value="中批(10-99)">中批(10-99)</option>
                    <option value="大批(100+)">大批(100+)</option>
                  </select>
                ) : (
                  <span className="px-2 py-1 text-xs bg-[#FF6B35]/10 text-[#FF6B35] rounded-lg">
                    {profileData.intentQuantity}
                  </span>
                )}
              </div>
            </div>

            {/* 购买目的 */}
            <div>
              <span className="text-xs text-gray-600 mb-1 block font-medium">购买目的</span>
              {editingProfile ? (
                <select
                  value={profileData.purchasePurpose}
                  onChange={(e) => setProfileData({ ...profileData, purchasePurpose: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                >
                  <option value="转售">转售</option>
                  <option value="自用">自用</option>
                  <option value="送礼">送礼</option>
                  <option value="代购">代购</option>
                </select>
              ) : (
                <span className="px-2 py-1 text-xs bg-white text-gray-700 border border-gray-200 rounded-lg">
                  {profileData.purchasePurpose}
                </span>
              )}
            </div>

            {/* 敏感度标签 */}
            <div>
              <span className="text-xs text-gray-600 mb-1.5 block font-medium">敏感度特征</span>
              {editingProfile ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-gray-500">价格敏感度</span>
                    <select
                      value={profileData.priceSensitivity}
                      onChange={(e) => setProfileData({ ...profileData, priceSensitivity: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                    >
                      <option value="低">低</option>
                      <option value="中">中</option>
                      <option value="高">高</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500">物流敏感度</span>
                    <select
                      value={profileData.logisticsSensitivity}
                      onChange={(e) => setProfileData({ ...profileData, logisticsSensitivity: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                    >
                      <option value="低">低</option>
                      <option value="中">中</option>
                      <option value="高">高</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500">真实性敏感度</span>
                    <select
                      value={profileData.authenticitySensitivity}
                      onChange={(e) => setProfileData({ ...profileData, authenticitySensitivity: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                    >
                      <option value="低">低</option>
                      <option value="中">中</option>
                      <option value="高">高</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500">付款安全敏感度</span>
                    <select
                      value={profileData.paymentSecuritySensitivity}
                      onChange={(e) => setProfileData({ ...profileData, paymentSecuritySensitivity: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                    >
                      <option value="低">低</option>
                      <option value="中">中</option>
                      <option value="高">高</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-gray-500">质量敏感度</span>
                    <select
                      value={profileData.qualitySensitivity}
                      onChange={(e) => setProfileData({ ...profileData, qualitySensitivity: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                    >
                      <option value="低">低</option>
                      <option value="中">中</option>
                      <option value="高">高</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                    价格敏感-{profileData.priceSensitivity}
                  </span>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                    物流敏感-{profileData.logisticsSensitivity}
                  </span>
                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-full">
                    真实性敏感-{profileData.authenticitySensitivity}
                  </span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                    付款安全敏感-{profileData.paymentSecuritySensitivity}
                  </span>
                  <span className="px-2 py-1 text-xs bg-amber-100 text-amber-600 rounded-full">
                    质量敏感-{profileData.qualitySensitivity}
                  </span>
                </div>
              )}
            </div>

            {/* 付款 & 信任 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-gray-600 mb-1 block font-medium">付款偏好</span>
                {editingProfile ? (
                  <select
                    value={profileData.paymentPreference}
                    onChange={(e) => setProfileData({ ...profileData, paymentPreference: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                  >
                    <option value="PayPal">PayPal</option>
                    <option value="信用卡">信用卡</option>
                    <option value="银行转账">银行转账</option>
                    <option value="西联汇款">西联汇款</option>
                  </select>
                ) : (
                  <span className="px-2 py-1 text-xs bg-white text-gray-700 border border-gray-200 rounded-lg">
                    {profileData.paymentPreference}
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs text-gray-600 mb-1 block font-medium">信任等级</span>
                {editingProfile ? (
                  <select
                    value={profileData.trustLevel}
                    onChange={(e) => setProfileData({ ...profileData, trustLevel: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                  >
                    <option value="低">低</option>
                    <option value="中">中</option>
                    <option value="高">高</option>
                  </select>
                ) : (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-lg">
                    {profileData.trustLevel}
                  </span>
                )}
              </div>
            </div>

            {/* 渠道 & 生命周期 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs text-gray-600 mb-1 block font-medium">渠道来源</span>
                {editingProfile ? (
                  <select
                    value={profileData.channelSource}
                    onChange={(e) => setProfileData({ ...profileData, channelSource: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="微信">微信</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                ) : (
                  <span className="px-2 py-1 text-xs bg-white text-gray-700 border border-gray-200 rounded-lg">
                    {profileData.channelSource}
                  </span>
                )}
              </div>
              <div>
                <span className="text-xs text-gray-600 mb-1 block font-medium">生命周期</span>
                {editingProfile ? (
                  <select
                    value={profileData.lifecycle}
                    onChange={(e) => setProfileData({ ...profileData, lifecycle: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                  >
                    <option value="新客户">新客户</option>
                    <option value="潜在(B)">潜在(B)</option>
                    <option value="活跃(A)">活跃(A)</option>
                    <option value="流失风险">流失风险</option>
                  </select>
                ) : (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg">
                    {profileData.lifecycle}
                  </span>
                )}
              </div>
            </div>

            {/* 紧迫度 */}
            <div>
              <span className="text-xs text-gray-600 mb-1 block font-medium">购买紧迫度</span>
              {editingProfile ? (
                <select
                  value={profileData.urgency}
                  onChange={(e) => setProfileData({ ...profileData, urgency: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg"
                >
                  <option value="本周">本周</option>
                  <option value="本月">本月</option>
                  <option value="近期">近期</option>
                  <option value="观望中">观望中</option>
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-lg ${
                    profileData.urgency === '本周' ? 'bg-[#FF6B35] text-white' :
                    profileData.urgency === '本月' ? 'bg-amber-100 text-amber-700' :
                    profileData.urgency === '近期' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {profileData.urgency}
                  </span>
                  <span className="text-xs text-gray-500">
                    {profileData.urgency === '本周' ? '需优先跟进' :
                     profileData.urgency === '本月' ? '保持联系' :
                     profileData.urgency === '近期' ? '定期跟进' :
                     '暂不急迫'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 联系人信息 */}
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

          <div className="space-y-2.5">
            {/* 昵称 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-gray-500">昵称</span>
              </div>
              {editingContact ? (
                <input
                  type="text"
                  value={contactData.nickname}
                  onChange={(e) => setContactData({ ...contactData, nickname: e.target.value })}
                  className="w-32 px-2 py-1 text-sm border border-gray-200 rounded text-right"
                />
              ) : (
                <span className="text-sm text-gray-700">{contactData.nickname}</span>
              )}
            </div>

            {/* 邮箱 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-gray-500">邮箱</span>
              </div>
              {editingContact ? (
                <input
                  type="email"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  className="w-40 px-2 py-1 text-sm border border-gray-200 rounded text-right"
                />
              ) : (
                <span className="text-sm text-gray-700">{contactData.email}</span>
              )}
            </div>

            {/* 电话 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-gray-500">电话</span>
              </div>
              {editingContact ? (
                <input
                  type="tel"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  className="w-36 px-2 py-1 text-sm border border-gray-200 rounded text-right"
                />
              ) : (
                <span className="text-sm text-gray-700">{contactData.phone}</span>
              )}
            </div>

            {/* 地区 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-gray-500">地区</span>
              </div>
              {editingContact ? (
                <input
                  type="text"
                  value={contactData.region}
                  onChange={(e) => setContactData({ ...contactData, region: e.target.value })}
                  className="w-32 px-2 py-1 text-sm border border-gray-200 rounded text-right"
                />
              ) : (
                <span className="text-sm text-gray-700">{contactData.region}</span>
              )}
            </div>

            {/* 活跃度 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-gray-500">活跃度</span>
              </div>
              {editingContact ? (
                <select
                  value={contactData.activityLevel}
                  onChange={(e) => setContactData({ ...contactData, activityLevel: e.target.value })}
                  className="w-24 px-2 py-1 text-xs border border-gray-200 rounded"
                >
                  <option value="已流失">已流失</option>
                  <option value="低活跃">低活跃</option>
                  <option value="中活跃">中活跃</option>
                  <option value="高活跃">高活跃</option>
                </select>
              ) : (
                <span className={`px-2 py-0.5 text-xs rounded ${
                  contactData.activityLevel === '高活跃' ? 'bg-green-100 text-green-700' :
                  contactData.activityLevel === '中活跃' ? 'bg-blue-100 text-blue-700' :
                  contactData.activityLevel === '低活跃' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-500'
                }`}>{contactData.activityLevel}</span>
              )}
            </div>

            {/* 活跃时段 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-gray-500">活跃时段</span>
              </div>
              {editingContact ? (
                <input
                  type="text"
                  value={contactData.activeHours}
                  onChange={(e) => setContactData({ ...contactData, activeHours: e.target.value })}
                  className="w-40 px-2 py-1 text-sm border border-gray-200 rounded text-right"
                />
              ) : (
                <span className="text-sm text-gray-700">{contactData.activeHours}</span>
              )}
            </div>

            {/* 备注 */}
            <div className="pt-2 border-t border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <FileEdit className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-gray-500">备注</span>
              </div>
              {editingContact ? (
                <textarea
                  value={contactData.notes}
                  onChange={(e) => setContactData({ ...contactData, notes: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg resize-none"
                  rows={2}
                />
              ) : (
                <p className="text-sm text-gray-600 bg-white/50 p-2 rounded-lg">{contactData.notes}</p>
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

          <div className="space-y-2.5">
            {/* 公司名称 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-gray-500">公司名称</span>
              </div>
              {editingCompany ? (
                <input
                  type="text"
                  value={companyData.companyName}
                  onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                  className="w-40 px-2 py-1 text-sm border border-gray-200 rounded text-right"
                />
              ) : (
                <span className="text-sm text-gray-700">{companyData.companyName}</span>
              )}
            </div>

            {/* 行业 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-gray-500">行业</span>
              </div>
              {editingCompany ? (
                <input
                  type="text"
                  value={companyData.industry}
                  onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                  className="w-32 px-2 py-1 text-sm border border-gray-200 rounded text-right"
                />
              ) : (
                <span className="text-sm text-gray-700">{companyData.industry}</span>
              )}
            </div>

            {/* 规模 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-gray-500">规模</span>
              </div>
              {editingCompany ? (
                <select
                  value={companyData.scale}
                  onChange={(e) => setCompanyData({ ...companyData, scale: e.target.value })}
                  className="w-32 px-2 py-1 text-xs border border-gray-200 rounded"
                >
                  <option value="1-10 员工">1-10 员工</option>
                  <option value="10-50 员工">10-50 员工</option>
                  <option value="50-200 员工">50-200 员工</option>
                  <option value="200+ 员工">200+ 员工</option>
                </select>
              ) : (
                <span className="text-sm text-gray-700">{companyData.scale}</span>
              )}
            </div>

            {/* 地址 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-gray-500">地址</span>
              </div>
              {editingCompany ? (
                <input
                  type="text"
                  value={companyData.address}
                  onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                  className="w-32 px-2 py-1 text-sm border border-gray-200 rounded text-right"
                />
              ) : (
                <span className="text-sm text-gray-700">{companyData.address}</span>
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
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold text-green-600">4.8</p>
                <span className="text-xs text-gray-500">满意度</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerAIProfile;
