import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Conversation, 
  CustomerProfile, 
  Platform, 
  FilterCriteria, 
  UserSettings,
  Message,
  AIReplySuggestion,
  TranslationResult,
  PlatformAccount
} from '@/types';
import { 
  mockConversations, 
  mockUserSettings,
  mockAIReplySuggestions,
  platformConfigs,
  mockAIStats,
  mockPlatformAccounts
} from '@/data/mockData';

// 应用状态接口
interface AppState {
  // 用户设置
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  
  // 平台
  platforms: Platform[];
  selectedPlatform: Platform | 'all';
  setSelectedPlatform: (platform: Platform | 'all') => void;
  togglePlatform: (platform: Platform) => void;
  
  // 平台账号
  platformAccounts: PlatformAccount[];
  selectedPlatformAccount: Record<Platform, string>; // platformId -> accountId
  setPlatformAccount: (platform: Platform, accountId: string) => void;
  getPlatformAccounts: (platform: Platform) => PlatformAccount[];
  getSelectedAccount: (platform: Platform) => PlatformAccount | undefined;
  addPlatformAccount: (account: Omit<PlatformAccount, 'id'>) => void;
  deletePlatformAccount: (accountId: string) => void;
  updatePlatformAccount: (accountId: string, updates: Partial<PlatformAccount>) => void;
  
  // 会话
  conversations: Conversation[];
  selectedConversationId: string | null;
  setSelectedConversation: (id: string | null) => void;
  getSelectedConversation: () => Conversation | undefined;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  addMessage: (conversationId: string, message: Message) => void;
  markAsRead: (conversationId: string) => void;
  
  // 筛选
  filterCriteria: FilterCriteria;
  setFilterCriteria: (criteria: Partial<FilterCriteria>) => void;
  clearFilters: () => void;
  getFilteredConversations: () => Conversation[];
  
  // 搜索
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // AI功能
  isTranslating: boolean;
  translateMessage: (text: string, sourceLang: string, targetLang: string) => Promise<TranslationResult>;
  
  isGeneratingReply: boolean;
  generateAIReply: (_conversationId: string) => Promise<AIReplySuggestion[]>;
  
  isSummarizing: boolean;
  generateSummary: (_conversationId: string) => Promise<string>;
  
  isAnalyzingProfile: boolean;
  analyzeCustomerProfile: (customerId: string) => Promise<CustomerProfile | null>;
  
  // UI状态
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  showProfilePanel: boolean;
  toggleProfilePanel: () => void;
  
  // 当前语言
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
  
  // AI统计数据
  aiStats: typeof mockAIStats;
}

// 创建store
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 用户设置
      userSettings: mockUserSettings,
      updateUserSettings: (settings) => 
        set((state) => ({ 
          userSettings: { ...state.userSettings, ...settings } 
        })),
      
      // 平台
      platforms: platformConfigs.filter(p => p.enabled).map(p => p.id),
      selectedPlatform: 'all',
      setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
      togglePlatform: (platform) => {
        const { platforms } = get();
        if (platforms.includes(platform)) {
          set({ platforms: platforms.filter(p => p !== platform) });
        } else {
          set({ platforms: [...platforms, platform] });
        }
      },
      
      // 平台账号
      platformAccounts: mockPlatformAccounts,
      selectedPlatformAccount: {
        whatsapp: 'wa_001',
        telegram: 'tg_001',
        line: 'line_001',
        instagram: 'ig_001',
        facebook: 'fb_001',
        wechat: 'wx_001',
        email: 'email_001',
        sms: 'sms_001',
        tiktok: 'dy_001',
        twitter: 'tw_001',
        shopify: 'sp_001',
      },
      setPlatformAccount: (platform, accountId) => 
        set((state) => ({
          selectedPlatformAccount: {
            ...state.selectedPlatformAccount,
            [platform]: accountId
          }
        })),
      getPlatformAccounts: (platform) => {
        const { platformAccounts } = get();
        return platformAccounts.filter(a => a.platformId === platform);
      },
      getSelectedAccount: (platform) => {
        const { platformAccounts, selectedPlatformAccount } = get();
        return platformAccounts.find(a => a.id === selectedPlatformAccount[platform]);
      },
      addPlatformAccount: (account) => {
        const newAccount: PlatformAccount = {
          ...account,
          id: `${account.platformId}_${Date.now()}`,
        };
        set((state) => ({
          platformAccounts: [...state.platformAccounts, newAccount]
        }));
      },
      deletePlatformAccount: (accountId) => {
        set((state) => ({
          platformAccounts: state.platformAccounts.filter(a => a.id !== accountId)
        }));
      },
      updatePlatformAccount: (accountId, updates) => {
        set((state) => ({
          platformAccounts: state.platformAccounts.map(a => 
            a.id === accountId ? { ...a, ...updates } : a
          )
        }));
      },
      
      // 会话
      conversations: mockConversations,
      selectedConversationId: null,
      setSelectedConversation: (id) => set({ selectedConversationId: id }),
      getSelectedConversation: () => {
        const { conversations, selectedConversationId } = get();
        return conversations.find(c => c.id === selectedConversationId);
      },
      updateConversation: (id, updates) => 
        set((state) => ({
          conversations: state.conversations.map(c => 
            c.id === id ? { ...c, ...updates } : c
          )
        })),
      addMessage: (conversationId, message) => 
        set((state) => ({
          conversations: state.conversations.map(c => 
            c.id === conversationId 
              ? { 
                  ...c, 
                  messages: [...c.messages, message],
                  lastMessage: message,
                  updatedAt: new Date()
                } 
              : c
          )
        })),
      markAsRead: (conversationId) => 
        set((state) => ({
          conversations: state.conversations.map(c => 
            c.id === conversationId 
              ? { ...c, unreadCount: 0 } 
              : c
          )
        })),
      
      // 筛选
      filterCriteria: {
        platforms: [],
        status: ['active', 'pending'],
        priority: [],
        tags: [],
        unreadOnly: false,
        unrepliedOnly: false,
        chatType: 'all',
        countries: [],
        languages: [],
        assignedTo: [],
        hasOrder: undefined,
        isVIP: undefined,
        customerTags: [],
        messageCountRange: undefined,
        lastActiveRange: undefined,
      },
      setFilterCriteria: (criteria) => 
        set((state) => ({ 
          filterCriteria: { ...state.filterCriteria, ...criteria } 
        })),
      clearFilters: () =>
        set({
          filterCriteria: {
            platforms: [],
            status: ['active', 'pending'],
            priority: [],
            tags: [],
            unreadOnly: false,
            unrepliedOnly: false,
            chatType: 'all',
            countries: [],
            languages: [],
            assignedTo: [],
            hasOrder: undefined,
            isVIP: undefined,
            customerTags: [],
            messageCountRange: undefined,
            lastActiveRange: undefined,
          },
          searchQuery: '',
          selectedPlatform: 'all',
        }),
      getFilteredConversations: () => {
        const { conversations, filterCriteria, searchQuery, selectedPlatform } = get();
        const now = new Date();
        
        return conversations.filter(conv => {
          // 平台筛选
          if (selectedPlatform !== 'all' && conv.platform !== selectedPlatform) {
            return false;
          }
          
          // 状态筛选
          if (filterCriteria.status.length > 0 && !filterCriteria.status.includes(conv.status)) {
            return false;
          }
          
          // 优先级筛选
          if (filterCriteria.priority.length > 0 && !filterCriteria.priority.includes(conv.priority)) {
            return false;
          }
          
          // 标签筛选
          if (filterCriteria.tags.length > 0 && !filterCriteria.tags.some(tag => conv.tags.includes(tag))) {
            return false;
          }
          
          // 未读筛选
          if (filterCriteria.unreadOnly && conv.unreadCount === 0) {
            return false;
          }

          // 未回复筛选（最后一条消息是客户发的）
          if (filterCriteria.unrepliedOnly) {
            const lastMsg = conv.lastMessage;
            if (!lastMsg || lastMsg.senderType !== 'customer') {
              return false;
            }
          }

          // 会话类型筛选（单聊/群聊）
          if (filterCriteria.chatType && filterCriteria.chatType !== 'all') {
            const isGroup = conv.isGroup === true;
            if (filterCriteria.chatType === 'single' && isGroup) {
              return false;
            }
            if (filterCriteria.chatType === 'group' && !isGroup) {
              return false;
            }
          }

          // 国家筛选
          if (filterCriteria.countries.length > 0 && !filterCriteria.countries.includes(conv.customer.country)) {
            return false;
          }
          
          // 语言筛选
          if (filterCriteria.languages.length > 0 && !filterCriteria.languages.includes(conv.customer.language)) {
            return false;
          }
          
          // 分配客服筛选
          if (filterCriteria.assignedTo.length > 0 && (!conv.assignedTo || !filterCriteria.assignedTo.includes(conv.assignedTo))) {
            return false;
          }
          
          // 是否有订单筛选
          if (filterCriteria.hasOrder !== undefined) {
            const hasOrder = conv.customer.orderHistory && conv.customer.orderHistory.length > 0;
            if (hasOrder !== filterCriteria.hasOrder) {
              return false;
            }
          }
          
          // VIP客户筛选
          if (filterCriteria.isVIP !== undefined) {
            const isVIP = conv.customer.tags.includes('VIP客户');
            if (isVIP !== filterCriteria.isVIP) {
              return false;
            }
          }
          
          // 客户标签筛选
          if (filterCriteria.customerTags.length > 0 && 
              !filterCriteria.customerTags.some(tag => conv.customer.tags.includes(tag))) {
            return false;
          }
          
          // 消息数量范围筛选
          if (filterCriteria.messageCountRange) {
            const msgCount = conv.messages.length;
            if (filterCriteria.messageCountRange.min !== undefined && msgCount < filterCriteria.messageCountRange.min) {
              return false;
            }
            if (filterCriteria.messageCountRange.max !== undefined && msgCount > filterCriteria.messageCountRange.max) {
              return false;
            }
          }
          
          // 最后活跃时间筛选
          if (filterCriteria.lastActiveRange) {
            const lastActive = new Date(conv.updatedAt);
            const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
            
            switch (filterCriteria.lastActiveRange) {
              case 'today':
                if (diffHours > 24) return false;
                break;
              case 'yesterday':
                if (diffHours <= 24 || diffHours > 48) return false;
                break;
              case 'week':
                if (diffHours > 24 * 7) return false;
                break;
              case 'month':
                if (diffHours > 24 * 30) return false;
                break;
            }
          }
          
          // 搜索
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const customerMatch = conv.customer.name.toLowerCase().includes(query);
            const messageMatch = conv.messages.some((m: Message) => 
              m.content.toLowerCase().includes(query)
            );
            if (!customerMatch && !messageMatch) {
              return false;
            }
          }
          
          return true;
        }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      },
      
      // 搜索
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // AI功能 - 模拟实现
      isTranslating: false,
      translateMessage: async (text, sourceLang, targetLang) => {
        set({ isTranslating: true });
        
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟翻译结果
        const translations: Record<string, Record<string, string>> = {
          'en-zh': {
            'Hi, I ordered a wireless earphone last month and I\'m very satisfied with it!': '嗨，我上个月订购了一副无线耳机，非常满意！',
            'Actually, I\'m looking to buy another one as a gift. Do you have any discounts for returning customers?': '实际上，我想再买一件作为礼物。你们有回头客折扣吗？',
          },
          'ja-zh': {
            'こんにちは、製品について質問があります。': '您好，我有一个关于产品的问题。',
            '配送はどのくらいかかりますか？': '配送需要多长时间？',
          },
          'ko-zh': {
            '안녕하세요! 새로운 화장품 출시 소식 있나요?': '您好！有新品化妆品上市的消息吗？',
          },
          'it-zh': {
            'Ciao! I bought a designer lamp last month but it arrived damaged. Can I get a replacement?': '你好！我上个月买了一盏设计师台灯，但到货时损坏了。可以换货吗？',
          },
        };
        
        const key = `${sourceLang}-${targetLang}`;
        const translatedText = translations[key]?.[text] || `[${targetLang}] ${text}`;
        
        set({ isTranslating: false });
        
        return {
          originalText: text,
          translatedText,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
          confidence: 0.95,
        };
      },
      
      isGeneratingReply: false,
      generateAIReply: async () => {
        set({ isGeneratingReply: true });
        
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        set({ isGeneratingReply: false });
        
        return mockAIReplySuggestions;
      },
      
      isSummarizing: false,
      generateSummary: async () => {
        set({ isSummarizing: true });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set({ isSummarizing: false });
        
        return '会话总结已生成';
      },
      
      isAnalyzingProfile: false,
      analyzeCustomerProfile: async () => {
        set({ isAnalyzingProfile: true });
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        set({ isAnalyzingProfile: false });
        
        return null;
      },
      
      // UI状态
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      showProfilePanel: true,
      toggleProfilePanel: () => set((state) => ({ showProfilePanel: !state.showProfilePanel })),
      
      // 当前语言
      currentLanguage: 'zh',
      setCurrentLanguage: (lang) => set({ currentLanguage: lang }),
      
      // AI统计数据
      aiStats: mockAIStats,
    }),
    {
      name: 'chatbiz-storage',
      partialize: (state) => ({
        userSettings: state.userSettings,
        sidebarCollapsed: state.sidebarCollapsed,
        currentLanguage: state.currentLanguage,
      }),
    }
  )
);

// 派生状态hooks
export const useUnreadCount = () => {
  const conversations = useStore(state => state.conversations);
  return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
};

export const usePlatformStats = () => {
  const conversations = useStore(state => state.conversations);
  const stats: Record<string, number> = {};
  
  conversations.forEach(conv => {
    stats[conv.platform] = (stats[conv.platform] || 0) + conv.unreadCount;
  });
  
  return stats;
};

export const useConversationStats = () => {
  const conversations = useStore(state => state.conversations);
  
  return {
    total: conversations.length,
    active: conversations.filter(c => c.status === 'active').length,
    pending: conversations.filter(c => c.status === 'pending').length,
    resolved: conversations.filter(c => c.status === 'resolved').length,
    unread: conversations.reduce((sum, c) => sum + c.unreadCount, 0),
  };
};
