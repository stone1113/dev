import React, { useState } from 'react';
import { X, RefreshCw, Search, Check, ChevronDown, Image, Video, FileText, Clock, Send, Sparkles, Wand2, Calendar, Loader2, BookOpen, Languages, Database, MessageSquare, Package, Target, Zap, TrendingUp, Tag, UserCheck, AlertCircle, Mic, Trash2, Plus, Shuffle, FileEdit, ClipboardList } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { generateMessage, optimizeMessage } from '@/lib/aiService';
import { suggestSendTime } from '@/lib/scheduler';
import { cn } from '@/lib/utils';

// AI推荐策略类型
interface AIRecommendation {
  id: string;
  name: string;
  description: string;
  icon: 'Target' | 'TrendingUp' | 'Tag' | 'UserCheck' | 'Zap';
  matchCount: number;
  reason: string;
}

// AI时机建议
interface TimingSuggestion {
  time: string;
  score: number;
  reason: string;
}

// 模拟AI推荐策略
const aiRecommendStrategies: AIRecommendation[] = [
  { id: 'high_value', name: '高价值客户', description: '消费金额>$1000或VIP标签', icon: 'TrendingUp', matchCount: 0, reason: '这些客户购买力强，转化率高' },
  { id: 'active_recent', name: '近期活跃', description: '7天内有互动的客户', icon: 'Zap', matchCount: 0, reason: '活跃客户响应率更高' },
  { id: 'promo_interest', name: '促销敏感', description: '对促销活动感兴趣的客户', icon: 'Tag', matchCount: 0, reason: '历史数据显示对优惠敏感' },
  { id: 'new_customer', name: '新客户培育', description: '30天内新增的客户', icon: 'UserCheck', matchCount: 0, reason: '新客户需要关怀提升粘性' },
  { id: 'inquiry_stage', name: '询盘阶段', description: '有询盘但未成交的客户', icon: 'Target', matchCount: 0, reason: '推动询盘转化为订单' },
];

// 模拟AI时机建议
const aiTimingSuggestions: TimingSuggestion[] = [
  { time: '09:30', score: 95, reason: '客户群体工作日上午活跃度最高' },
  { time: '14:00', score: 82, reason: '午休后注意力恢复，适合营销' },
  { time: '20:00', score: 78, reason: '晚间休闲时段，阅读率较高' },
];

// 知识库类型
interface KnowledgeBase {
  id: string;
  name: string;
  type: 'product' | 'faq' | 'template' | 'policy';
  itemCount: number;
  icon: 'Package' | 'MessageSquare' | 'FileText' | 'BookOpen';
}

// 知识库条目
interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

// 模拟知识库数据
const mockKnowledgeBases: KnowledgeBase[] = [
  { id: 'kb1', name: '产品知识库', type: 'product', itemCount: 156, icon: 'Package' },
  { id: 'kb2', name: '常见问题FAQ', type: 'faq', itemCount: 89, icon: 'MessageSquare' },
  { id: 'kb3', name: '营销话术模板', type: 'template', itemCount: 45, icon: 'FileText' },
  { id: 'kb4', name: '公司政策文档', type: 'policy', itemCount: 23, icon: 'BookOpen' },
];

// 模拟知识库条目
const mockKnowledgeItems: Record<string, KnowledgeItem[]> = {
  kb1: [
    { id: 'p1', title: '新品A系列介绍', content: '我们的A系列产品采用最新技术，具有高性能、低功耗的特点...', tags: ['新品', '热销'] },
    { id: 'p2', title: 'B系列促销活动', content: 'B系列产品限时8折优惠，购买即送精美礼品...', tags: ['促销', '限时'] },
    { id: 'p3', title: '产品规格参数', content: '产品尺寸：120x80x30mm，重量：250g，材质：航空铝合金...', tags: ['规格'] },
  ],
  kb2: [
    { id: 'f1', title: '发货时间说明', content: '订单确认后48小时内发货，节假日顺延...', tags: ['物流'] },
    { id: 'f2', title: '退换货政策', content: '7天无理由退换，15天质量问题包换...', tags: ['售后'] },
  ],
  kb3: [
    { id: 't1', title: '节日问候模板', content: '亲爱的客户，值此佳节来临之际，祝您节日快乐，阖家幸福！', tags: ['节日', '问候'] },
    { id: 't2', title: '新客户欢迎语', content: '欢迎您成为我们的客户！我是您的专属客服，有任何问题随时联系我。', tags: ['欢迎', '新客'] },
  ],
  kb4: [
    { id: 'po1', title: '价格政策', content: '所有产品价格以官网公示为准，大客户可享受专属折扣...', tags: ['价格'] },
  ],
};

// 翻译引擎配置
const translationEngines = [
  { code: 'google', name: '谷歌翻译' },
  { code: 'deepl', name: 'DeepL' },
  { code: 'azure', name: 'Azure' },
  { code: 'llm', name: '大模型翻译' },
];

// 语言配置
const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'auto', name: '自动检测', flag: '🔍' },
];

interface BroadcastMessageProps {
  onClose: () => void;
  selectedContactIds?: Set<string>;
  currentAgentId?: string;
}

type TabType = 'all' | 'private' | 'group' | 'unread' | 'pending' | 'needReply';
type SendMode = 'original' | 'translated' | 'smart';
type SendTime = 'immediate' | 'custom' | 'ai';
type SendPattern = 'all' | 'randomOne' | 'randomMessage';

// 消息内容类型
type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file';

interface MessageItem {
  id: string;
  type: MessageType;
  content: string; // 文本内容或文件名
  file?: File;
  preview?: string; // 预览URL
}

export const BroadcastMessage: React.FC<BroadcastMessageProps> = ({ onClose, selectedContactIds, currentAgentId }) => {
  const { conversations, selectedPlatform, getPlatformAccounts } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(selectedContactIds || new Set());

  // 从 store 获取当前平台的客服账号
  const allAgents = selectedPlatform !== 'all'
    ? getPlatformAccounts(selectedPlatform).filter(a => a.status === 'online' || a.status === 'busy')
    : [];

  // 根据当前客服账号过滤可选账号
  const agents = currentAgentId
    ? allAgents.filter(a => a.id === currentAgentId)
    : allAgents;

  // 客服账号选择 - 默认选中当前账号或第一个
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(
    new Set([currentAgentId || agents[0]?.id].filter(Boolean))
  );

  // 群发设置
  const [taskName, setTaskName] = useState('');
  const [sendMode, setSendMode] = useState<SendMode>('original');
  const [sendTime, setSendTime] = useState<SendTime>('immediate');
  const [sendPattern, setSendPattern] = useState<SendPattern>('all');
  // const [messageContent, setMessageContent] = useState('');
  const [messageItems, setMessageItems] = useState<MessageItem[]>([]);
  const [_editingItemId, setEditingItemId] = useState<string | null>(null);
  const [messageInterval, setMessageInterval] = useState({ min: 2, max: 26 });
  const [contactInterval, setContactInterval] = useState({ min: 2, max: 6 });

  // AI 相关状态
  // const [aiPrompt, setAiPrompt] = useState('');
  // const [isGenerating, setIsGenerating] = useState(false);
  // const [generatedVariants, setGeneratedVariants] = useState<string[]>([]);
  // const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // 知识库相关状态
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(false);
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<string>('');
  const [selectedKnowledgeItems, setSelectedKnowledgeItems] = useState<Set<string>>(new Set());
  // const [knowledgeSearchQuery, setKnowledgeSearchQuery] = useState('');

  // 智能收件人建议相关状态
  const [showSuggestionPanel, setShowSuggestionPanel] = useState(false);
  const [suggestedIds, setSuggestedIds] = useState<Set<string>>(new Set());
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);

  // AI时机建议状态
  const [showTimingPanel, setShowTimingPanel] = useState(false);
  const [selectedTiming, setSelectedTiming] = useState<TimingSuggestion | null>(null);

  // 翻译相关状态
  const [sourceLanguage, setSourceLanguage] = useState('zh');
  const [targetLanguage, setTargetLanguage] = useState('auto');
  const [translationEngine, setTranslationEngine] = useState('google');
  // const [showTranslationPreview, setShowTranslationPreview] = useState(false);
  const [showTranslationSettings, setShowTranslationSettings] = useState(true);
  // const [translatedContent, setTranslatedContent] = useState('');
  // const [isTranslating, setIsTranslating] = useState(false);

  const toggleAgent = (id: string) => {
    const newSelected = new Set(selectedAgents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedAgents(newSelected);
  };

  // 获取联系人列表
  const contacts = Array.from(
    new Map(conversations.map(c => [c.customer.id, {
      ...c.customer,
      platform: c.platform,
      conversationId: c.id,
      isGroup: c.customer.name.includes('群') || c.customer.name.includes('Group'),
    }])).values()
  );

  const filteredContacts = contacts.filter(contact => {
    const matchSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'private') return matchSearch && !contact.isGroup;
    if (activeTab === 'group') return matchSearch && contact.isGroup;
    return matchSearch;
  });

  // AI智能分析客户群体
  const analyzeCustomers = () => {
    setIsAnalyzing(true);

    // 模拟AI分析过程
    setTimeout(() => {
      const now = new Date();
      const recommendations = aiRecommendStrategies.map(strategy => {
        let matchIds: string[] = [];

        switch (strategy.id) {
          case 'high_value':
            matchIds = conversations
              .filter(c => (c.customer.behaviorAnalysis?.totalSpent || 0) > 1000 || c.customer.tags.includes('VIP客户'))
              .map(c => c.customer.id);
            break;
          case 'active_recent':
            matchIds = conversations
              .filter(c => (now.getTime() - new Date(c.updatedAt).getTime()) <= 7 * 24 * 60 * 60 * 1000)
              .map(c => c.customer.id);
            break;
          case 'promo_interest':
            matchIds = conversations
              .filter(c => c.tags.some(t => ['促销', '优惠', '折扣'].includes(t)) || c.customer.tags.includes('活跃客户'))
              .map(c => c.customer.id);
            break;
          case 'new_customer':
            matchIds = conversations
              .filter(c => (now.getTime() - new Date(c.createdAt || c.updatedAt).getTime()) <= 30 * 24 * 60 * 60 * 1000)
              .map(c => c.customer.id);
            break;
          case 'inquiry_stage':
            matchIds = conversations
              .filter(c => c.tags.some(t => ['询盘', '咨询', '意向'].includes(t)))
              .map(c => c.customer.id);
            break;
        }

        return { ...strategy, matchCount: matchIds.length };
      });

      setAiRecommendations(recommendations);
      setIsAnalyzing(false);
      setShowSuggestionPanel(true);
    }, 1200);
  };

  // 应用AI推荐策略
  const applyStrategy = (strategyId: string) => {
    const now = new Date();
    let matchIds: string[] = [];

    switch (strategyId) {
      case 'high_value':
        matchIds = conversations
          .filter(c => (c.customer.behaviorAnalysis?.totalSpent || 0) > 1000 || c.customer.tags.includes('VIP客户'))
          .map(c => c.customer.id);
        break;
      case 'active_recent':
        matchIds = conversations
          .filter(c => (now.getTime() - new Date(c.updatedAt).getTime()) <= 7 * 24 * 60 * 60 * 1000)
          .map(c => c.customer.id);
        break;
      case 'promo_interest':
        matchIds = conversations
          .filter(c => c.tags.some(t => ['促销', '优惠', '折扣'].includes(t)) || c.customer.tags.includes('活跃客户'))
          .map(c => c.customer.id);
        break;
      case 'new_customer':
        matchIds = conversations
          .filter(c => (now.getTime() - new Date(c.createdAt || c.updatedAt).getTime()) <= 30 * 24 * 60 * 60 * 1000)
          .map(c => c.customer.id);
        break;
      case 'inquiry_stage':
        matchIds = conversations
          .filter(c => c.tags.some(t => ['询盘', '咨询', '意向'].includes(t)))
          .map(c => c.customer.id);
        break;
    }

    setSelectedStrategy(strategyId);
    setSuggestedIds(new Set(matchIds));
    setSelectedIds(new Set(matchIds));
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // AI 生成消息内容（结合知识库）
  // const handleAIGenerate = async () => {
  //   if (!aiPrompt.trim() && selectedKnowledgeItems.size === 0) return;
  //   setIsGenerating(true);
  //   const selectedItemsTexts: string[] = [];
  //   Object.values(mockKnowledgeItems).forEach(items => {
  //     items.forEach(item => {
  //       if (selectedKnowledgeItems.has(item.id)) {
  //         selectedItemsTexts.push(item.content);
  //       }
  //     });
  //   });
  //   try {
  //     const variants = await generateMessage({
  //       prompt: aiPrompt,
  //       knowledgeTexts: selectedItemsTexts,
  //       tone: sendMode === 'smart' ? 'friendly' : 'professional',
  //       maxVariants: 1,
  //     });
  //     setGeneratedVariants(variants);
  //     setSelectedVariantIndex(0);
  //   } catch (e) {
  //     // ignore for now
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  // const handleAIOptimize = async () => {
  //   if (!messageContent.trim()) return;
  //   setIsGenerating(true);
  //   try {
  //     const optimized = await optimizeMessage(messageContent, sendMode === 'smart' ? 'friendly' : 'professional');
  //     setGeneratedVariants([optimized]);
  //     setSelectedVariantIndex(0);
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  // 翻译预览
  // const handleTranslatePreview = async () => {
  //   if (!messageContent.trim()) return;
  //   setIsTranslating(true);
  //   setTimeout(() => {
  //     const targetLang = languages.find(l => l.code === targetLanguage);
  //     const mockTranslations: Record<string, string> = {
  //       en: `Dear customer, ${messageContent.slice(0, 50)}... [Translated to English]`,
  //       ja: `お客様へ、${messageContent.slice(0, 30)}... [日本語に翻訳]`,
  //       ko: `고객님께, ${messageContent.slice(0, 30)}... [한국어로 번역]`,
  //       es: `Estimado cliente, ${messageContent.slice(0, 40)}... [Traducido al español]`,
  //     };
  //     setTranslatedContent(mockTranslations[targetLanguage] || `[${targetLang?.name}] ${messageContent}`);
  //     setShowTranslationPreview(true);
  //     setIsTranslating(false);
  //   }, 1000);
  // };

  // 插入知识库内容
  // const insertKnowledgeContent = (item: KnowledgeItem) => {
  //   setMessageContent(prev => prev ? `${prev}\n\n${item.content}` : item.content);
  // };

  // 当前正在AI生成的消息项ID
  const [generatingItemId, setGeneratingItemId] = useState<string | null>(null);
  // 消息项的AI提示词
  const [itemAiPrompts, setItemAiPrompts] = useState<Record<string, string>>({});
  // 显示AI输入框的消息项ID
  const [showAiInputForItem, setShowAiInputForItem] = useState<string | null>(null);
  // 每个消息项的AI生成变体
  const [itemAiVariants, setItemAiVariants] = useState<Record<string, string[]>>({});
  // 每个消息项选中的变体索引
  const [itemSelectedVariant, setItemSelectedVariant] = useState<Record<string, number>>({});

  // 消息项操作
  const addMessageItem = (type: MessageType) => {
    const newItem: MessageItem = {
      id: Date.now().toString(),
      type,
      content: '',
    };
    setMessageItems(prev => [...prev, newItem]);
    if (type === 'text') {
      setEditingItemId(newItem.id);
    }
  };

  const updateMessageItem = (id: string, content: string) => {
    setMessageItems(prev => prev.map(item =>
      item.id === id ? { ...item, content } : item
    ));
  };

  const removeMessageItem = (id: string) => {
    setMessageItems(prev => prev.filter(item => item.id !== id));
  };

  const handleFileUpload = (id: string, file: File) => {
    const preview = URL.createObjectURL(file);
    setMessageItems(prev => prev.map(item =>
      item.id === id ? { ...item, file, content: file.name, preview } : item
    ));
  };

  // 为单个消息项生成AI内容
  const handleItemAIGenerate = async (itemId: string) => {
    const prompt = itemAiPrompts[itemId];
    if (!prompt?.trim() && selectedKnowledgeItems.size === 0) return;

    setGeneratingItemId(itemId);

    const selectedItemsTexts: string[] = [];
    Object.values(mockKnowledgeItems).forEach(items => {
      items.forEach(item => {
        if (selectedKnowledgeItems.has(item.id)) {
          selectedItemsTexts.push(item.content);
        }
      });
    });

    try {
      const variants = await generateMessage({
        prompt: prompt || '根据知识库内容生成营销消息',
        knowledgeTexts: selectedItemsTexts,
        tone: sendMode === 'smart' ? 'friendly' : 'professional',
        maxVariants: 3,
      });

      if (variants.length > 0) {
        // 存储所有变体供选择
        setItemAiVariants(prev => ({ ...prev, [itemId]: variants }));
        setItemSelectedVariant(prev => ({ ...prev, [itemId]: 0 }));
        // 默认选中第一个
        updateMessageItem(itemId, variants[0]);
      }
      setItemAiPrompts(prev => ({ ...prev, [itemId]: '' }));
    } finally {
      setGeneratingItemId(null);
    }
  };

  // 选择AI生成的变体
  const selectAiVariant = (itemId: string, variantIndex: number) => {
    const variants = itemAiVariants[itemId];
    if (variants && variants[variantIndex]) {
      setItemSelectedVariant(prev => ({ ...prev, [itemId]: variantIndex }));
      updateMessageItem(itemId, variants[variantIndex]);
      // 选中后自动收起变体列表
      clearAiVariants(itemId);
    }
  };

  // 清除变体选择
  const clearAiVariants = (itemId: string) => {
    setItemAiVariants(prev => {
      const newVariants = { ...prev };
      delete newVariants[itemId];
      return newVariants;
    });
    setItemSelectedVariant(prev => {
      const newSelected = { ...prev };
      delete newSelected[itemId];
      return newSelected;
    });
  };

  // 优化单个消息项内容
  const handleItemAIOptimize = async (itemId: string) => {
    const item = messageItems.find(i => i.id === itemId);
    if (!item?.content.trim()) return;

    setGeneratingItemId(itemId);
    try {
      const optimized = await optimizeMessage(item.content, sendMode === 'smart' ? 'friendly' : 'professional');
      updateMessageItem(itemId, optimized);
    } finally {
      setGeneratingItemId(null);
    }
  };

  const selectAll = () => setSelectedIds(new Set(filteredContacts.map(c => c.id)));
  const clearSelection = () => setSelectedIds(new Set());
  const invertSelection = () => {
    const newSelected = new Set<string>();
    filteredContacts.forEach(c => {
      if (!selectedIds.has(c.id)) newSelected.add(c.id);
    });
    setSelectedIds(newSelected);
  };

  // 自定义复选框
  const Checkbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={cn(
        "w-4 h-4 rounded-sm border flex-shrink-0 flex items-center justify-center transition-colors",
        checked ? "bg-[#FF6B35] border-[#FF6B35]" : "border-gray-300 bg-white hover:border-gray-400"
      )}
    >
      {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
    </button>
  );

  // 单选按钮
  const RadioButton = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-2 cursor-pointer whitespace-nowrap group"
    >
      <span className={cn(
        "w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
        checked ? "border-[#FF6B35] bg-[#FF6B35]/5" : "border-gray-300 group-hover:border-gray-400"
      )}>
        {checked && <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />}
      </span>
      <span className={cn(
        "text-sm transition-colors",
        checked ? "text-gray-900 font-medium" : "text-gray-600"
      )}>{label}</span>
    </button>
  );

  // Tab按钮
  const TabButton = ({ id, label }: { id: TabType; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "px-3 py-1 text-xs rounded-full transition-colors",
        activeTab === id
          ? "bg-[#FF6B35] text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-50 w-[95vw] max-w-[1400px] h-[90vh] rounded-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 rounded-t-xl">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-[#FF6B35]" />
            <span className="text-sm font-medium text-gray-900">创建群发任务</span>
            <span className="text-xs text-gray-400">创建群发任务后，请保持账号在线，否则会出现发送失败异常情况</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700">
              按ESC键退出
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧 - 选择账号 */}
          <div className="w-52 bg-white border-r border-gray-200 flex flex-col">
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-700">
                <span>选择账号</span>
                <RefreshCw className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">仅显示当前平台在线账号，可多选</p>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {agents.map((agent) => {
                const isSelected = selectedAgents.has(agent.id);
                return (
                  <div
                    key={agent.id}
                    onClick={() => toggleAgent(agent.id)}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
                      isSelected ? "bg-[#FFF8F5] border-[#FF6B35]/30" : "border-transparent hover:bg-gray-50"
                    )}
                  >
                    <Checkbox checked={isSelected} onChange={() => toggleAgent(agent.id)} />
                    <img
                      src={agent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.id}`}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {agent.name}
                        {agent.remark && (
                          <span className="text-[10px] text-gray-400 ml-0.5">({agent.remark})</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-3 py-2 border-t border-gray-100">
              <button className="text-xs text-[#FF6B35] hover:underline">管理账号</button>
            </div>
          </div>

          {/* 中间 - 群发对象 */}
          <div className="flex-1 bg-white flex flex-col">
            <div className="px-4 py-2.5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-900">群发对象</span>
                  <span className="text-xs text-[#FF6B35]">{agents[0]?.name || '未选择账号'}</span>
                </div>
                <RefreshCw className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <Checkbox checked={true} onChange={() => {}} />
                <span className="text-xs text-gray-600">联系人和群组</span>
              </div>
            </div>

            {/* 搜索 */}
            <div className="px-4 py-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="请输入名称/ID/手机号"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35]"
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={analyzeCustomers}
                  disabled={isAnalyzing}
                  className={cn(
                    "px-2 py-1 text-xs rounded-lg flex items-center gap-1",
                    showSuggestionPanel ? "bg-[#FF6B35] text-white" : "bg-gradient-to-r from-[#FF6B35] to-[#FF8F5A] text-white hover:opacity-90"
                  )}
                >
                  {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  AI智能筛选
                </button>

                {selectedStrategy && (
                  <span className="text-[11px] text-[#FF6B35] flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    已选 {suggestedIds.size} 人
                  </span>
                )}
              </div>

              {showSuggestionPanel && (
                <div className="mt-2 p-3 bg-gradient-to-br from-[#FFF8F5] to-white border border-[#FF6B35]/20 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-900 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-[#FF6B35]" />
                      AI推荐策略
                    </span>
                    <button
                      onClick={() => setShowSuggestionPanel(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {aiRecommendations.map((rec) => {
                      const IconComp = rec.icon === 'Target' ? Target :
                        rec.icon === 'TrendingUp' ? TrendingUp :
                        rec.icon === 'Tag' ? Tag :
                        rec.icon === 'UserCheck' ? UserCheck : Zap;
                      const isActive = selectedStrategy === rec.id;

                      return (
                        <button
                          key={rec.id}
                          onClick={() => applyStrategy(rec.id)}
                          className={cn(
                            "w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all",
                            isActive ? "bg-[#FF6B35] text-white" : "bg-white hover:bg-gray-50 border border-gray-100"
                          )}
                        >
                          <IconComp className={cn("w-4 h-4", isActive ? "text-white" : "text-[#FF6B35]")} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={cn("text-xs font-medium", isActive ? "text-white" : "text-gray-900")}>{rec.name}</span>
                              <span className={cn("text-[10px] px-1.5 py-0.5 rounded", isActive ? "bg-white/20 text-white" : "bg-[#FF6B35]/10 text-[#FF6B35]")}>
                                {rec.matchCount} 人
                              </span>
                            </div>
                            <p className={cn("text-[10px] truncate", isActive ? "text-white/80" : "text-gray-500")}>{rec.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {selectedStrategy && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                      <p className="text-[10px] text-blue-700 flex items-start gap-1">
                        <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {aiRecommendations.find(r => r.id === selectedStrategy)?.reason}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="px-4 py-2 flex items-center gap-2 flex-wrap">
              <TabButton id="all" label="全部" />
              <TabButton id="private" label="私聊" />
              <TabButton id="group" label="群组" />
              <TabButton id="unread" label="未读" />
              <TabButton id="pending" label="等待回复" />
              <TabButton id="needReply" label="需要回复" />
            </div>

            {/* 批量操作 */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedIds.size === filteredContacts.length && filteredContacts.length > 0}
                  onChange={() => selectedIds.size === filteredContacts.length ? clearSelection() : selectAll()}
                />
                <span className="text-xs text-gray-600">全选 {selectedIds.size}/{filteredContacts.length}</span>
                <span className="text-xs text-gray-400">/ 无限制</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={clearSelection} className="text-xs text-gray-500 hover:text-gray-700">隐藏未选</button>
                <button onClick={invertSelection} className="text-xs text-gray-500 hover:text-gray-700">反选</button>
                <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-0.5">
                  排序 <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 联系人列表 */}
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.map((contact) => {
                const isSelected = selectedIds.has(contact.id);
                return (
                  <div
                    key={contact.id}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 transition-colors border-b border-gray-50",
                      isSelected && "bg-[#FFF8F5]"
                    )}
                  >
                    <Checkbox checked={isSelected} onChange={() => toggleSelect(contact.id)} />
                    <img src={contact.avatar} alt={contact.name} className="w-8 h-8 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{contact.name}</p>
                      <p className="text-[10px] text-gray-400">{contact.id}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 右侧 - 群发设置 */}
          <div className="w-[640px] bg-gradient-to-b from-gray-50/50 to-white border-l border-gray-200 flex flex-col">
            <div className="px-6 py-4 bg-white border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900 tracking-tight">群发设置</h2>
              <p className="text-xs text-gray-400 mt-0.5">配置消息内容和发送规则</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 任务名称 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[#FF6B35]" />
                  任务名称
                </label>
                <input
                  type="text"
                  placeholder="请输入群发任务名称"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/10 transition-all bg-white"
                />
              </div>

              {/* 发送设置 - 带翻译语言选择 */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-[#FF6B35]" /> 翻译设置
                </label>
                <div className="flex items-center gap-3">
                  <RadioButton checked={sendMode === 'original'} onChange={() => setSendMode('original')} label="原文" />
                  <RadioButton checked={sendMode === 'translated'} onChange={() => { setSendMode('translated'); setShowTranslationSettings(true); }} label="翻译后发送" />
                  <RadioButton checked={sendMode === 'smart'} onChange={() => { setSendMode('smart'); setShowTranslationSettings(true); }} label="AI智能" />
                </div>

                {/* AI智能模式 - 收起状态显示摘要 */}
                {sendMode === 'smart' && !showTranslationSettings && (
                  <button
                    onClick={() => setShowTranslationSettings(true)}
                    className="w-full p-3 bg-gradient-to-r from-[#FFF8F5] to-[#FFF0EB] rounded-xl border border-[#FF6B35]/20 flex items-center justify-between hover:shadow-sm transition-all text-left"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#FF6B35] font-medium">AI智能翻译</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-600">{languages.find(l => l.code === sourceLanguage)?.name} → 自动检测</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-600">{translationEngines.find(e => e.code === translationEngine)?.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">点击修改</span>
                  </button>
                )}

                {/* 翻译后发送模式 - 收起状态显示摘要 */}
                {sendMode === 'translated' && !showTranslationSettings && (
                  <button
                    onClick={() => setShowTranslationSettings(true)}
                    className="w-full p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between hover:shadow-sm transition-all text-left"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">{languages.find(l => l.code === sourceLanguage)?.name}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-gray-600">{languages.find(l => l.code === targetLanguage)?.name}</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-gray-600">{translationEngines.find(e => e.code === translationEngine)?.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">点击修改</span>
                  </button>
                )}

                {/* 展开的设置面板 */}
                {(sendMode === 'translated' || sendMode === 'smart') && showTranslationSettings && (
                  <div className="space-y-3">
                    {sendMode === 'smart' && (
                      <div className="p-3 bg-gradient-to-r from-[#FFF8F5] to-[#FFF0EB] rounded-xl border border-[#FF6B35]/20">
                        <p className="text-xs text-gray-700 leading-relaxed">
                          <span className="font-semibold text-[#FF6B35]">AI智能翻译：</span>根据客户手机号归属国家的语种自动翻译后发送。若客户已设置独立语种偏好，则优先使用客户偏好语种。
                        </p>
                      </div>
                    )}
                    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm space-y-3">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-gray-500 w-16">源语言</span>
                        <select
                          value={sourceLanguage}
                          onChange={(e) => setSourceLanguage(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] bg-gray-50/50"
                        >
                          {languages.filter(l => l.code !== 'auto').map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-gray-500 w-16">目标语言</span>
                        <select
                          value={targetLanguage}
                          onChange={(e) => setTargetLanguage(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] bg-gray-50/50"
                        >
                          {languages.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-gray-500 w-16">翻译引擎</span>
                        <select
                          value={translationEngine}
                          onChange={(e) => setTranslationEngine(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] bg-gray-50/50"
                        >
                          {translationEngines.map(engine => (
                            <option key={engine.code} value={engine.code}>{engine.name}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => setShowTranslationSettings(false)}
                        className="w-full py-2 text-xs text-[#FF6B35] hover:bg-[#FFF8F5] rounded-lg transition-colors"
                      >
                        收起
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 任务发送时间 */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FF6B35]" /> 发送时间
                </label>
                <div className="flex items-center gap-3">
                  <RadioButton checked={sendTime === 'immediate'} onChange={() => { setSendTime('immediate'); setSelectedTiming(null); }} label="立即发送" />
                  <RadioButton checked={sendTime === 'custom'} onChange={() => { setSendTime('custom'); }} label="定时发送" />
                  <RadioButton checked={sendTime === 'ai'} onChange={() => { setSendTime('ai'); }} label="AI智能推荐" />
                </div>

                {/* 定时发送 - 日期时间选择 */}
                {sendTime === 'custom' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35]"
                    />
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35]"
                    />
                    {selectedTiming && (
                      <span className="text-xs text-[#FF6B35] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI推荐
                      </span>
                    )}
                  </div>
                )}

                {/* AI智能推荐面板 */}
                {sendTime === 'ai' && (
                  <div className="mt-2">
                    {/* 已选时间显示 - 可点击展开 */}
                    {selectedTiming && !showTimingPanel && (
                      <button
                        onClick={() => setShowTimingPanel(true)}
                        className="w-full p-3 bg-gradient-to-r from-[#FFF8F5] to-[#FFF0EB] rounded-xl border border-[#FF6B35]/20 flex items-center justify-between hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#FF6B35]" />
                          <span className="text-sm text-gray-700">发送时间：</span>
                          <span className="text-sm font-medium text-[#FF6B35]">{scheduledDate} {scheduledTime}</span>
                        </div>
                        <span className="text-xs text-gray-400">点击修改</span>
                      </button>
                    )}

                    {/* 展开的面板 */}
                    {(!selectedTiming || showTimingPanel) && (
                      <div className="p-3 bg-gradient-to-br from-[#FFF8F5] to-white border border-[#FF6B35]/20 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-[#FF6B35] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> AI智能推荐
                          </span>
                          {selectedTiming && (
                            <button onClick={() => setShowTimingPanel(false)} className="text-xs text-gray-400 hover:text-gray-600">
                              收起
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
                          根据所选联系人的<span className="text-[#FF6B35] font-medium">手机号归属国家时区</span>智能计算最佳发送时间，确保消息在客户当地的活跃时段送达。
                        </p>

                        {/* AI推荐的时间选项 */}
                        <div className="space-y-1.5 mb-3">
                          {aiTimingSuggestions.map((timing, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setSelectedTiming(timing);
                                const today = new Date().toISOString().split('T')[0];
                                setScheduledDate(today);
                                setScheduledTime(timing.time);
                                setShowTimingPanel(false);
                              }}
                              className={cn(
                                "w-full flex items-center gap-2 p-2.5 rounded-xl text-left transition-all",
                                selectedTiming?.time === timing.time ? "bg-[#FF6B35] text-white shadow-md" : "bg-white hover:bg-[#FFF8F5] border border-gray-100"
                              )}
                            >
                              <div className={cn(
                                "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold",
                                selectedTiming?.time === timing.time ? "bg-white/20 text-white" : "bg-[#FF6B35]/10 text-[#FF6B35]"
                              )}>
                                {timing.score}
                              </div>
                              <div className="flex-1">
                                <span className={cn("text-sm font-medium", selectedTiming?.time === timing.time ? "text-white" : "text-gray-900")}>
                                  {timing.time}
                                </span>
                                <p className={cn("text-[11px]", selectedTiming?.time === timing.time ? "text-white/80" : "text-gray-500")}>
                                  {timing.reason}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* 智能推荐按钮 */}
                        <button
                          onClick={() => {
                            const prefs = Array.from(selectedIds).map(id => {
                              const conv = conversations.find(c => c.customer.id === id);
                              return conv?.customer.behaviorAnalysis?.preferredContactTime;
                            }).filter(Boolean) as string[];
                            const { date, time } = suggestSendTime(prefs);
                            setScheduledDate(date);
                            setScheduledTime(time);
                            setSelectedTiming({ time, score: 95, reason: '基于客户偏好智能推荐' });
                            setShowTimingPanel(false);
                          }}
                          className="w-full px-3 py-2 text-xs font-medium bg-[#FF6B35] text-white rounded-lg hover:bg-[#E85A2A] flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          根据客户偏好智能推荐
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* 发送模式 */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shuffle className="w-4 h-4 text-[#FF6B35]" />
                  发送模式
                </label>
                <div className="flex items-center gap-3">
                  <RadioButton checked={sendPattern === 'all'} onChange={() => setSendPattern('all')} label="发送全部" />
                  <RadioButton checked={sendPattern === 'randomOne'} onChange={() => setSendPattern('randomOne')} label="随机一条" />
                  <RadioButton checked={sendPattern === 'randomMessage'} onChange={() => setSendPattern('randomMessage')} label="随机一组" />
                </div>
              </div>

              {/* 群发内容 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileEdit className="w-4 h-4 text-[#FF6B35]" />
                    群发内容
                  </label>
                  <span className="text-xs text-gray-400">
                    {sendPattern === 'all' ? '按顺序发送全部' : sendPattern === 'randomOne' ? '随机发送一条' : '随机发送一组'}
                  </span>
                </div>

                {/* 消息列表 */}
                <div className="space-y-2">
                  {messageItems.map((item, index) => (
                    <div key={item.id} className="relative group">
                      <div className="flex items-start gap-2 p-3 bg-white rounded-xl border border-gray-200 hover:border-[#FF6B35]/30 transition-colors">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </span>

                        {/* 文本类型 */}
                        {item.type === 'text' && (
                          <div className="flex-1 min-w-0 space-y-2">
                            <textarea
                              value={item.content}
                              onChange={(e) => updateMessageItem(item.id, e.target.value)}
                              placeholder="输入文本内容..."
                              rows={4}
                              className="w-full text-sm border-0 focus:outline-none resize-none bg-transparent"
                            />
                            {/* AI操作按钮 */}
                            <div className="space-y-2 pt-1 border-t border-gray-100">
                              {showAiInputForItem === item.id ? (
                                <div className="space-y-2">
                                  {/* 知识库面板 */}
                                  {showKnowledgePanel && (
                                    <div className="p-2 bg-gray-50 rounded-lg space-y-2">
                                      <div className="flex flex-wrap gap-1.5">
                                        {mockKnowledgeBases.map((kb) => {
                                          const IconComponent = kb.icon === 'Package' ? Package : kb.icon === 'MessageSquare' ? MessageSquare : kb.icon === 'FileText' ? FileText : BookOpen;
                                          const isActive = selectedKnowledgeBase === kb.id;
                                          return (
                                            <button
                                              key={kb.id}
                                              onClick={() => setSelectedKnowledgeBase(isActive ? '' : kb.id)}
                                              className={cn(
                                                "flex items-center gap-1 px-2 py-1 text-[10px] font-medium rounded whitespace-nowrap transition-all",
                                                isActive ? "bg-[#FF6B35] text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                                              )}
                                            >
                                              <IconComponent className="w-3 h-3" />
                                              {kb.name}
                                            </button>
                                          );
                                        })}
                                      </div>
                                      {selectedKnowledgeBase && (
                                        <div className="max-h-24 overflow-y-auto space-y-1">
                                          {(mockKnowledgeItems[selectedKnowledgeBase] || []).map((kbItem) => {
                                            const isSelected = selectedKnowledgeItems.has(kbItem.id);
                                            return (
                                              <div
                                                key={kbItem.id}
                                                onClick={() => {
                                                  const newSet = new Set(selectedKnowledgeItems);
                                                  isSelected ? newSet.delete(kbItem.id) : newSet.add(kbItem.id);
                                                  setSelectedKnowledgeItems(newSet);
                                                }}
                                                className={cn(
                                                  "flex items-center gap-1.5 p-1.5 rounded cursor-pointer text-[11px]",
                                                  isSelected ? "bg-[#FFF8F5] text-[#FF6B35]" : "hover:bg-white text-gray-600"
                                                )}
                                              >
                                                <Checkbox checked={isSelected} onChange={() => {}} />
                                                <span className="truncate">{kbItem.title}</span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* AI输入框 + 知识库按钮 */}
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => setShowKnowledgePanel(!showKnowledgePanel)}
                                      className={cn(
                                        "flex-shrink-0 flex items-center gap-1 px-2 py-1 text-[11px] rounded-lg transition-colors",
                                        showKnowledgePanel || selectedKnowledgeItems.size > 0
                                          ? "bg-[#FF6B35] text-white"
                                          : "text-gray-500 hover:bg-gray-100 border border-gray-200"
                                      )}
                                    >
                                      <Database className="w-3 h-3" />
                                      {selectedKnowledgeItems.size > 0 ? selectedKnowledgeItems.size : ''}
                                    </button>
                                    <input
                                      type="text"
                                      placeholder={selectedKnowledgeItems.size > 0 ? "描述如何使用知识库..." : "描述你想生成的内容..."}
                                      value={itemAiPrompts[item.id] || ''}
                                      onChange={(e) => setItemAiPrompts(prev => ({ ...prev, [item.id]: e.target.value }))}
                                      className="flex-1 min-w-0 px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35]"
                                      onKeyDown={(e) => e.key === 'Enter' && handleItemAIGenerate(item.id)}
                                    />
                                    <button
                                      onClick={() => handleItemAIGenerate(item.id)}
                                      disabled={generatingItemId === item.id}
                                      className="flex-shrink-0 px-2 py-1 text-xs text-white bg-[#FF6B35] rounded-lg hover:bg-[#E85A2A] disabled:opacity-50 flex items-center gap-1"
                                    >
                                      {generatingItemId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                      生成
                                    </button>
                                    <button
                                      onClick={() => { setShowAiInputForItem(null); setShowKnowledgePanel(false); }}
                                      className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setShowAiInputForItem(item.id)}
                                    className="flex items-center gap-1 px-2 py-1 text-[11px] text-[#FF6B35] hover:bg-[#FFF8F5] rounded-lg transition-colors"
                                  >
                                    <Sparkles className="w-3 h-3" /> AI生成
                                  </button>
                                  {item.content.trim() && (
                                    <button
                                      onClick={() => handleItemAIOptimize(item.id)}
                                      disabled={generatingItemId === item.id}
                                      className="flex items-center gap-1 px-2 py-1 text-[11px] text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                      {generatingItemId === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                      优化
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* AI生成变体选择 */}
                              {itemAiVariants[item.id] && itemAiVariants[item.id].length > 1 && (
                                <div className="mt-3 space-y-3">
                                  <div className="flex items-start">
                                    <span className="text-xs font-medium text-[#FF6B35]">AI智能生成：</span>
                                    <span className="text-xs text-gray-500 flex-1">
                                      已生成 {itemAiVariants[item.id].length} 个版本，点击选择合适的内容，选中后自动应用。
                                    </span>
                                  </div>
                                  <div className="space-y-2 pl-1">
                                    {itemAiVariants[item.id].map((variant, vIndex) => (
                                      <div
                                        key={vIndex}
                                        onClick={() => selectAiVariant(item.id, vIndex)}
                                        className={cn(
                                          "flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer transition-all",
                                          itemSelectedVariant[item.id] === vIndex
                                            ? "border-[#FF6B35] bg-[#FFF8F5]"
                                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                                        )}
                                      >
                                        <div className={cn(
                                          "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center",
                                          itemSelectedVariant[item.id] === vIndex
                                            ? "border-[#FF6B35]"
                                            : "border-gray-300"
                                        )}>
                                          {itemSelectedVariant[item.id] === vIndex && (
                                            <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                                          )}
                                        </div>
                                        <span className="text-xs text-gray-700 leading-relaxed line-clamp-3">{variant}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex items-center justify-end gap-3">
                                    <button
                                      onClick={() => handleItemAIGenerate(item.id)}
                                      className="text-xs text-[#FF6B35] hover:text-[#E85A2A]"
                                    >
                                      重新生成
                                    </button>
                                    <button
                                      onClick={() => clearAiVariants(item.id)}
                                      className="text-xs text-[#FF6B35] hover:text-[#E85A2A]"
                                    >
                                      收起
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* 图片类型 */}
                        {item.type === 'image' && (
                          <div className="flex-1">
                            {item.preview ? (
                              <div className="flex items-center gap-2">
                                <img src={item.preview} alt="" className="w-16 h-16 object-cover rounded-lg" />
                                <span className="text-xs text-gray-500">{item.content}</span>
                              </div>
                            ) : (
                              <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-[#FF6B35]">
                                <Image className="w-4 h-4" />
                                <span className="text-xs">点击上传图片</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(item.id, e.target.files[0])} />
                              </label>
                            )}
                          </div>
                        )}

                        {/* 视频类型 */}
                        {item.type === 'video' && (
                          <div className="flex-1">
                            {item.content ? (
                              <div className="flex items-center gap-2">
                                <Video className="w-8 h-8 text-[#FF6B35]" />
                                <span className="text-xs text-gray-500">{item.content}</span>
                              </div>
                            ) : (
                              <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-[#FF6B35]">
                                <Video className="w-4 h-4" />
                                <span className="text-xs">点击上传视频</span>
                                <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(item.id, e.target.files[0])} />
                              </label>
                            )}
                          </div>
                        )}

                        {/* 音频类型 */}
                        {item.type === 'audio' && (
                          <div className="flex-1">
                            {item.content ? (
                              <div className="flex items-center gap-2">
                                <Mic className="w-8 h-8 text-[#FF6B35]" />
                                <span className="text-xs text-gray-500">{item.content}</span>
                              </div>
                            ) : (
                              <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-[#FF6B35]">
                                <Mic className="w-4 h-4" />
                                <span className="text-xs">点击上传音频</span>
                                <input type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(item.id, e.target.files[0])} />
                              </label>
                            )}
                          </div>
                        )}

                        {/* 文件类型 */}
                        {item.type === 'file' && (
                          <div className="flex-1">
                            {item.content ? (
                              <div className="flex items-center gap-2">
                                <FileText className="w-8 h-8 text-[#FF6B35]" />
                                <span className="text-xs text-gray-500">{item.content}</span>
                              </div>
                            ) : (
                              <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-[#FF6B35]">
                                <FileText className="w-4 h-4" />
                                <span className="text-xs">点击上传文件</span>
                                <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(item.id, e.target.files[0])} />
                              </label>
                            )}
                          </div>
                        )}

                        {/* 删除按钮 */}
                        <button
                          onClick={() => removeMessageItem(item.id)}
                          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 添加内容按钮 */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => addMessageItem('text')}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 hover:text-[#FF6B35] hover:bg-[#FFF8F5] rounded-lg transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> 文本
                  </button>
                  <button
                    onClick={() => addMessageItem('image')}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 hover:text-[#FF6B35] hover:bg-[#FFF8F5] rounded-lg transition-all"
                  >
                    <Image className="w-4 h-4" /> 图片
                  </button>
                  <button
                    onClick={() => addMessageItem('video')}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 hover:text-[#FF6B35] hover:bg-[#FFF8F5] rounded-lg transition-all"
                  >
                    <Video className="w-4 h-4" /> 视频
                  </button>
                  <button
                    onClick={() => addMessageItem('audio')}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 hover:text-[#FF6B35] hover:bg-[#FFF8F5] rounded-lg transition-all"
                  >
                    <Mic className="w-4 h-4" /> 音频
                  </button>
                  <button
                    onClick={() => addMessageItem('file')}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 hover:text-[#FF6B35] hover:bg-[#FFF8F5] rounded-lg transition-all"
                  >
                    <FileText className="w-4 h-4" /> 文件
                  </button>
                </div>

                {/* 消息数量提示 */}
                {messageItems.length > 0 && (
                  <p className="text-xs text-gray-400">
                    共 {messageItems.length} 条消息，
                    {sendPattern === 'all' && '将按顺序全部发送'}
                    {sendPattern === 'randomOne' && '将随机发送其中一条'}
                    {sendPattern === 'randomMessage' && '将随机发送一组'}
                  </p>
                )}
              </div>

              {/* 发送间隔设置 */}
              <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">间隔设置</p>
                  <span className="text-xs text-gray-400">间隔过短可能触发风控</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-20">消息间隔</span>
                  <input
                    type="number"
                    value={messageInterval.min}
                    onChange={(e) => setMessageInterval({ ...messageInterval, min: Number(e.target.value) })}
                    className="w-20 px-3 py-2 text-sm border border-gray-200 rounded-lg text-center focus:outline-none focus:border-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-400">-</span>
                  <input
                    type="number"
                    value={messageInterval.max}
                    onChange={(e) => setMessageInterval({ ...messageInterval, max: Number(e.target.value) })}
                    className="w-20 px-3 py-2 text-sm border border-gray-200 rounded-lg text-center focus:outline-none focus:border-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-500">秒</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-20">联系人间隔</span>
                  <input
                    type="number"
                    value={contactInterval.min}
                    onChange={(e) => setContactInterval({ ...contactInterval, min: Number(e.target.value) })}
                    className="w-20 px-3 py-2 text-sm border border-gray-200 rounded-lg text-center focus:outline-none focus:border-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-400">-</span>
                  <input
                    type="number"
                    value={contactInterval.max}
                    onChange={(e) => setContactInterval({ ...contactInterval, max: Number(e.target.value) })}
                    className="w-20 px-3 py-2 text-sm border border-gray-200 rounded-lg text-center focus:outline-none focus:border-[#FF6B35]"
                  />
                  <span className="text-sm text-gray-500">秒</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-6 py-4 border-t border-gray-100 bg-white">
              <button className="flex-1 px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 flex items-center justify-center gap-2 transition-all">
                <Clock className="w-4 h-4" /> 存为草稿
              </button>
              <button className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-[#FF6B35] rounded-xl hover:bg-[#E85A2A] flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF6B35]/25 hover:shadow-xl hover:shadow-[#FF6B35]/30">
                <Send className="w-4 h-4" /> 开始群发
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
