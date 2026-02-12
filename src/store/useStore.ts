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
  PlatformAccount,
  Organization,
  LoginMode,
  BoundAccount,
  Department,
  ActivationCode,
  AIEmployeeConfig,
  AILabelGroup,
  AILabel,
  KnowledgeBase,
  KnowledgeDocument
} from '@/types';
import {
  mockConversations,
  mockUserSettings,
  mockAIReplySuggestions,
  platformConfigs,
  mockAIStats,
  mockPlatformAccounts,
  mockDepartments,
  mockActivationCodes,
  mockAIEmployeeConfig,
  mockAILabelGroups,
  mockAILabels
} from '@/data/mockData';

// 应用状态接口
interface AppState {
  // 组织设置
  organization: Organization;
  updateOrganization: (updates: Partial<Organization>) => void;
  setOrganizationLoginMode: (mode: LoginMode) => void;

  // 绑定账号管理
  addBoundAccount: (account: Omit<BoundAccount, 'id'>) => void;
  updateBoundAccount: (accountId: string, updates: Partial<BoundAccount>) => void;
  deleteBoundAccount: (accountId: string) => void;
  toggleBoundAccountStatus: (accountId: string) => void;

  // 部门管理
  departments: Department[];
  selectedDepartmentId: string | null;
  setSelectedDepartment: (id: string | null) => void;

  // 激活码管理
  activationCodes: ActivationCode[];
  addActivationCode: (code: Omit<ActivationCode, 'id'>) => void;
  updateActivationCode: (id: string, updates: Partial<ActivationCode>) => void;
  deleteActivationCode: (id: string) => void;
  toggleActivationCodeStatus: (id: string) => void;
  getFilteredActivationCodes: () => ActivationCode[];

  // 用户设置
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;

  // 当前用户激活码（C端关联）
  currentActivationCodeId: string | null;
  
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

  // 账号登录状态
  loginAccountId: string | null; // 当前需要登录的账号ID
  setLoginAccountId: (accountId: string | null) => void;
  getLoginAccount: () => PlatformAccount | undefined;
  
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
  
  // AI员工配置
  aiEmployeeConfig: AIEmployeeConfig;
  updateAIEmployeeConfig: (updates: Partial<AIEmployeeConfig>) => void;

  // AI标签管理
  aiLabelGroups: AILabelGroup[];
  aiLabels: AILabel[];
  addAILabel: (label: AILabel) => void;
  updateAILabel: (id: string, updates: Partial<AILabel>) => void;
  deleteAILabel: (id: string) => void;
  addAILabelGroup: (group: AILabelGroup) => void;
  updateAILabelGroup: (id: string, updates: Partial<AILabelGroup>) => void;
  deleteAILabelGroup: (id: string) => void;

  // 知识库管理
  knowledgeBases: KnowledgeBase[];
  knowledgeDocuments: KnowledgeDocument[];
  addKnowledgeBase: (kb: KnowledgeBase) => void;
  updateKnowledgeBase: (id: string, updates: Partial<KnowledgeBase>) => void;
  deleteKnowledgeBase: (id: string) => void;
  addKnowledgeDocument: (doc: KnowledgeDocument) => void;
  updateKnowledgeDocument: (id: string, updates: Partial<KnowledgeDocument>) => void;
  deleteKnowledgeDocument: (id: string) => void;

  // AI统计数据
  aiStats: typeof mockAIStats;
}

// 创建store
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 组织设置
      organization: {
        id: 'org_001',
        name: '示例企业',
        activationCode: 'QXMS2024DEMO',
        loginMode: 'activation_only',
        memberCount: 15,
        createdAt: new Date('2024-01-01'),
        status: 'active',
        expiresAt: new Date('2025-12-31'),
        boundAccounts: [
          { id: 'acc_001', username: 'admin', displayName: '管理员', role: 'admin', status: 'active' },
          { id: 'acc_002', username: 'zhangsan', displayName: '张三', role: 'agent', status: 'active' },
          { id: 'acc_003', username: 'lisi', displayName: '李四', role: 'agent', status: 'active' },
          { id: 'acc_004', username: 'wangwu', displayName: '王五', role: 'manager', status: 'disabled' },
        ],
        aiSeats: {
          total: 5,
          used: 2,
        },
      },
      updateOrganization: (updates) =>
        set((state) => ({
          organization: { ...state.organization, ...updates }
        })),
      setOrganizationLoginMode: (mode) =>
        set((state) => ({
          organization: { ...state.organization, loginMode: mode }
        })),

      // 绑定账号管理
      addBoundAccount: (account) =>
        set((state) => ({
          organization: {
            ...state.organization,
            boundAccounts: [
              ...(state.organization.boundAccounts || []),
              { ...account, id: `acc_${Date.now()}` }
            ]
          }
        })),
      updateBoundAccount: (accountId, updates) =>
        set((state) => ({
          organization: {
            ...state.organization,
            boundAccounts: (state.organization.boundAccounts || []).map(acc =>
              acc.id === accountId ? { ...acc, ...updates } : acc
            )
          }
        })),
      deleteBoundAccount: (accountId) =>
        set((state) => ({
          organization: {
            ...state.organization,
            boundAccounts: (state.organization.boundAccounts || []).filter(
              acc => acc.id !== accountId
            )
          }
        })),
      toggleBoundAccountStatus: (accountId) =>
        set((state) => ({
          organization: {
            ...state.organization,
            boundAccounts: (state.organization.boundAccounts || []).map(acc =>
              acc.id === accountId
                ? { ...acc, status: acc.status === 'active' ? 'disabled' : 'active' }
                : acc
            )
          }
        })),

      // 部门管理
      departments: mockDepartments,
      selectedDepartmentId: null,
      setSelectedDepartment: (id) => set({ selectedDepartmentId: id }),

      // 激活码管理
      activationCodes: mockActivationCodes,
      addActivationCode: (code) =>
        set((state) => ({
          activationCodes: [...state.activationCodes, { ...code, id: `ac_${Date.now()}` }]
        })),
      updateActivationCode: (id, updates) =>
        set((state) => ({
          activationCodes: state.activationCodes.map(c =>
            c.id === id ? { ...c, ...updates } : c
          )
        })),
      deleteActivationCode: (id) =>
        set((state) => ({
          activationCodes: state.activationCodes.filter(c => c.id !== id)
        })),
      toggleActivationCodeStatus: (id) =>
        set((state) => ({
          activationCodes: state.activationCodes.map(c =>
            c.id === id
              ? { ...c, status: c.status === 'active' ? 'disabled' : c.status === 'disabled' ? 'active' : c.status }
              : c
          )
        })),
      getFilteredActivationCodes: () => {
        const { activationCodes, selectedDepartmentId } = get();
        if (!selectedDepartmentId) return activationCodes;
        // 递归收集选中部门及其子部门的所有 ID
        const collectDeptIds = (depts: Department[], targetId: string): string[] => {
          const ids: string[] = [];
          for (const dept of depts) {
            if (dept.id === targetId) {
              ids.push(dept.id);
              if (dept.children) {
                for (const child of dept.children) {
                  ids.push(...collectDeptIds([child], child.id));
                }
              }
              return ids;
            }
            if (dept.children) {
              const found = collectDeptIds(dept.children, targetId);
              if (found.length > 0) return found;
            }
          }
          return ids;
        };
        const deptIds = collectDeptIds(get().departments, selectedDepartmentId);
        return activationCodes.filter(c => deptIds.includes(c.departmentId));
      },

      // 用户设置
      userSettings: mockUserSettings,

      // 当前用户激活码（C端demo默认关联张三）
      currentActivationCodeId: 'ac_001',

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

      // 账号登录状态
      loginAccountId: null,
      setLoginAccountId: (accountId) => set({ loginAccountId: accountId }),
      getLoginAccount: () => {
        const { platformAccounts, loginAccountId } = get();
        return platformAccounts.find(a => a.id === loginAccountId);
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
        // AI画像标签筛选
        customerLevel: [],
        customerTypes: [],
        categories: [],
        budgetRange: [],
        intentQuantity: [],
        purchasePurpose: [],
        urgency: [],
        inquiryStage: [],
        decisionRole: [],
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
            // AI画像标签筛选
            customerLevel: [],
            customerTypes: [],
            categories: [],
            budgetRange: [],
            intentQuantity: [],
            purchasePurpose: [],
            urgency: [],
            inquiryStage: [],
            decisionRole: [],
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

        // 模拟翻译结果 - 预设翻译
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
        let translatedText = translations[key]?.[text];

        // 如果没有预设翻译，根据目标语言生成模拟翻译
        if (!translatedText) {
          // 模拟翻译 - 直接返回原文作为译文（实际项目中会调用翻译API）
          translatedText = text;
        }

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
      
      // AI员工配置
      aiEmployeeConfig: mockAIEmployeeConfig,
      updateAIEmployeeConfig: (updates) =>
        set((state) => ({
          aiEmployeeConfig: { ...state.aiEmployeeConfig, ...updates }
        })),

      // AI标签管理
      aiLabelGroups: mockAILabelGroups,
      aiLabels: mockAILabels,
      addAILabel: (label) =>
        set((state) => ({ aiLabels: [...state.aiLabels, label] })),
      updateAILabel: (id, updates) =>
        set((state) => ({
          aiLabels: state.aiLabels.map((l) => l.id === id ? { ...l, ...updates } : l)
        })),
      deleteAILabel: (id) =>
        set((state) => {
          // 收集要删除的ID：自身 + 子节点 + 孙节点
          const childIds = state.aiLabels.filter((l) => l.parentId === id).map((l) => l.id);
          const grandchildIds = state.aiLabels.filter((l) => l.parentId && childIds.includes(l.parentId)).map((l) => l.id);
          const toDelete = new Set([id, ...childIds, ...grandchildIds]);
          return { aiLabels: state.aiLabels.filter((l) => !toDelete.has(l.id)) };
        }),
      addAILabelGroup: (group) =>
        set((state) => ({ aiLabelGroups: [...state.aiLabelGroups, group] })),
      updateAILabelGroup: (id, updates) =>
        set((state) => ({
          aiLabelGroups: state.aiLabelGroups.map((g) => g.id === id ? { ...g, ...updates } : g)
        })),
      deleteAILabelGroup: (id) =>
        set((state) => ({
          aiLabelGroups: state.aiLabelGroups.filter((g) => g.id !== id),
          aiLabels: state.aiLabels.filter((l) => l.groupId !== id)
        })),

      // 知识库管理
      knowledgeBases: [
        { id: 'kb_1', name: '产品知识库', description: '公司产品信息、规格参数、价格体系', color: '#3B82F6', documentCount: 3, createdAt: '2025-01-15', updatedAt: '2025-02-01' },
        { id: 'kb_2', name: 'FAQ知识库', description: '常见问题与标准回复', color: '#22C55E', documentCount: 2, createdAt: '2025-01-20', updatedAt: '2025-01-28' },
        { id: 'kb_3', name: '售后政策', description: '退换货、保修、物流等售后相关政策', color: '#F59E0B', documentCount: 1, createdAt: '2025-02-01', updatedAt: '2025-02-05' },
      ] as KnowledgeBase[],
      knowledgeDocuments: [
        { id: 'doc_1', knowledgeBaseId: 'kb_1', fileName: '2025产品目录.pdf', fileSize: 2456000, fileType: 'pdf', charCount: 128600, chunkCount: 86, status: 'ready', enabled: true, uploadedAt: '2025-01-15', updatedAt: '2025-01-15' },
        { id: 'doc_2', knowledgeBaseId: 'kb_1', fileName: '产品规格参数表.xlsx', fileSize: 890000, fileType: 'xlsx', charCount: 45200, chunkCount: 32, status: 'ready', enabled: true, uploadedAt: '2025-01-18', updatedAt: '2025-01-18' },
        { id: 'doc_3', knowledgeBaseId: 'kb_1', fileName: '价格体系说明.docx', fileSize: 345000, fileType: 'docx', charCount: 18900, chunkCount: 14, status: 'ready', enabled: false, uploadedAt: '2025-01-20', updatedAt: '2025-01-20' },
        { id: 'doc_4', knowledgeBaseId: 'kb_2', fileName: '常见问题汇总.pdf', fileSize: 1200000, fileType: 'pdf', charCount: 67300, chunkCount: 45, status: 'ready', enabled: true, uploadedAt: '2025-01-20', updatedAt: '2025-01-20' },
        { id: 'doc_5', knowledgeBaseId: 'kb_2', fileName: '标准回复模板.txt', fileSize: 56000, fileType: 'txt', charCount: 32100, status: 'embedding', enabled: true, uploadedAt: '2025-01-28', updatedAt: '2025-01-28' },
        { id: 'doc_6', knowledgeBaseId: 'kb_3', fileName: '售后服务政策2025.pdf', fileSize: 780000, fileType: 'pdf', charCount: 41500, chunkCount: 28, status: 'ready', enabled: true, uploadedAt: '2025-02-01', updatedAt: '2025-02-01' },
      ] as KnowledgeDocument[],
      addKnowledgeBase: (kb) =>
        set((state) => ({ knowledgeBases: [...state.knowledgeBases, kb] })),
      updateKnowledgeBase: (id, updates) =>
        set((state) => ({
          knowledgeBases: state.knowledgeBases.map((kb) => kb.id === id ? { ...kb, ...updates } : kb)
        })),
      deleteKnowledgeBase: (id) =>
        set((state) => ({
          knowledgeBases: state.knowledgeBases.filter((kb) => kb.id !== id),
          knowledgeDocuments: state.knowledgeDocuments.filter((d) => d.knowledgeBaseId !== id)
        })),
      addKnowledgeDocument: (doc) =>
        set((state) => ({ knowledgeDocuments: [...state.knowledgeDocuments, doc] })),
      updateKnowledgeDocument: (id, updates) =>
        set((state) => ({
          knowledgeDocuments: state.knowledgeDocuments.map((d) => d.id === id ? { ...d, ...updates } : d)
        })),
      deleteKnowledgeDocument: (id) =>
        set((state) => ({
          knowledgeDocuments: state.knowledgeDocuments.filter((d) => d.id !== id)
        })),

      // AI统计数据
      aiStats: mockAIStats,
    }),
    {
      name: 'chatbiz-storage',
      partialize: (state) => ({
        organization: state.organization,
        userSettings: state.userSettings,
        sidebarCollapsed: state.sidebarCollapsed,
        currentLanguage: state.currentLanguage,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<AppState>;
        // 如果持久化数据中没有 boundAccounts 或为空数组，使用默认值
        const boundAccounts =
          persisted.organization?.boundAccounts && persisted.organization.boundAccounts.length > 0
            ? persisted.organization.boundAccounts
            : currentState.organization.boundAccounts;
        return {
          ...currentState,
          ...persisted,
          organization: {
            ...currentState.organization,
            ...persisted.organization,
            boundAccounts,
          },
        };
      },
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
