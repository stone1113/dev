// 平台类型
export type Platform = 
  | 'whatsapp' 
  | 'telegram' 
  | 'line' 
  | 'instagram' 
  | 'facebook' 
  | 'wechat' 
  | 'email' 
  | 'sms' 
  | 'tiktok' 
  | 'twitter' 
  | 'shopify';

// 消息类型
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'customer' | 'agent' | 'ai';
  content: string;
  contentOriginal?: string; // 原始语言内容
  translatedContent?: string; // 翻译后内容
  language?: string; // 语言代码
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read' | 'unread';
  attachments?: Attachment[];
  isAIGenerated?: boolean;
}

// 附件类型
export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'file';
  url: string;
  name: string;
  size?: number;
}

// 客户画像
export interface CustomerProfile {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
  country: string;
  language: string;
  platform: Platform;
  tags: string[];
  notes?: string;
  orderHistory?: Order[];
  behaviorAnalysis?: BehaviorAnalysis;
  createdAt: Date;
  lastContactAt: Date;
}

// 订单信息
export interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  total: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: OrderItem[];
}

// 订单商品
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

// 行为分析
export interface BehaviorAnalysis {
  totalSpent: number;
  orderCount: number;
  averageOrderValue: number;
  favoriteCategories: string[];
  lastPurchaseDate?: Date;
  customerSince: Date;
  satisfactionScore?: number;
  responseRate: number;
  preferredContactTime?: string;
}

// 会话
export interface Conversation {
  id: string;
  customerId: string;
  customer: CustomerProfile;
  platform: Platform;
  messages: Message[];
  unreadCount: number;
  lastMessage?: Message;
  status: 'active' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  aiSummary?: string; // AI总结
  aiSuggestions?: string[]; // AI回复建议
  aiAnalysisGenerated?: boolean; // AI分析是否已生成
  isGroup?: boolean; // 是否群聊
  groupName?: string; // 群聊名称
  groupMemberCount?: number; // 群成员数量
}

// 筛选条件
export interface FilterCriteria {
  platforms: Platform[];
  status: ('active' | 'pending' | 'resolved' | 'closed')[];
  priority: ('low' | 'medium' | 'high' | 'urgent')[];
  tags: string[];
  dateRange?: { start: Date; end: Date };
  searchQuery?: string;
  unreadOnly?: boolean;
  unrepliedOnly?: boolean; // 未回复筛选
  chatType?: 'all' | 'single' | 'group'; // 会话类型：全部/单聊/群聊
  // 新增筛选条件
  countries: string[]; // 按国家筛选
  languages: string[]; // 按语言筛选
  assignedTo: string[]; // 按分配客服筛选
  hasOrder?: boolean; // 是否有订单
  isVIP?: boolean; // 是否VIP客户
  customerTags: string[]; // 客户标签
  messageCountRange?: { min?: number; max?: number }; // 消息数量范围
  lastActiveRange?: 'today' | 'yesterday' | 'week' | 'month' | 'custom'; // 最后活跃时间
  // AI画像标签筛选
  customerLevel?: string[]; // 客户等级: A级/B级/C级/D级
  customerTypes?: string[]; // 客户类型: 批发/平台卖家等
  categories?: string[]; // 意向品类
  budgetRange?: string[]; // 预算区间
  intentQuantity?: string[]; // 意向数量
  purchasePurpose?: string[]; // 购买目的
  urgency?: string[]; // 购买紧迫度
  inquiryStage?: string[]; // 询盘阶段
  decisionRole?: string[]; // 决策角色
}

// 平台客服账号
export interface PlatformAccount {
  id: string;
  platformId: Platform;
  name: string;
  avatar?: string;
  accountId: string; // 平台账号ID
  phone?: string; // 手机号
  status: 'online' | 'offline' | 'busy' | 'not_logged_in'; // 账号状态
  isDefault: boolean;
  messageCount: number;
  lastActiveAt?: Date;
  ip?: string; // 客服当前 IP 地址
  proxyRegion?: string; // 代理/节点所在地区
  remark?: string; // 备注信息
  proxyConfigId?: string; // 关联的代理配置ID
  aiEnabled?: boolean; // 是否绑定AI
}

// 代理IP配置
export interface ProxyConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  protocol: 'http' | 'https' | 'socks5';
  username?: string;
  password?: string;
  region: string; // 地区
  isActive: boolean;
  createdAt: Date;
}

// 平台配置
export interface PlatformConfig {
  id: Platform;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  bgColor: string;
  enabled: boolean;
}

// AI翻译结果
export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

// AI回复建议
export interface AIReplySuggestion {
  id: string;
  content: string;
  tone: 'professional' | 'friendly' | 'concise' | 'empathetic';
  language: string;
  confidence: number;
}

// 登录模式类型
export type LoginMode = 'activation_only' | 'activation_with_password';

// 绑定账号（用于激活码绑定模式）
export interface BoundAccount {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: 'admin' | 'agent' | 'manager';
  status: 'active' | 'disabled';
}

// 组织信息
export interface Organization {
  id: string;
  name: string;
  activationCode: string;
  loginMode: LoginMode;
  memberCount: number;
  createdAt: Date;
  status: 'active' | 'inactive' | 'expired';
  expiresAt?: Date;
  boundAccounts?: BoundAccount[];
  aiSeats?: {
    total: number;
    used: number;
  };
}

// 部门节点
export interface Department {
  id: string;
  name: string;
  parentId: string | null;
  children?: Department[];
  memberCount: number;
  order: number;
}

// 激活码
export interface AiPlatformConfig {
  platformId: string;
  aiSalesChat?: boolean;
  aiProactiveMarketing?: boolean;
  aiRecall?: boolean;
  aiQualityCheck?: boolean;
}

export interface ActivationCode {
  id: string;
  code: string;
  departmentId: string;
  departmentName: string;
  assignedTo?: string;
  role: 'admin' | 'agent' | 'manager';
  status: 'unused' | 'active' | 'expired' | 'disabled';
  createdAt: Date;
  activatedAt?: Date;
  expiresAt?: Date;
  remark?: string;
  platforms?: string[];
  aiPlatforms?: AiPlatformConfig[];
  aiSeatLimit?: number;       // 该激活码可开启的AI坐席上限
  aiSeatUsed?: number;        // 该激活码已使用的AI坐席数
  aiAllocationMode?: 'fixed' | 'auto'; // 分配模式：固定分配/自动分配
  aiFixedAccountIds?: string[];         // 固定分配模式下指定的客服账号ID列表
}

// AI标签管理 —— 四级树形结构
// 一级：行业（制造业、消费品…）
// 二级：维度（用户画像、联系人信息、公司信息、会话标签）
// 三级：字段（客户等级、客户类型、意向品类…）
// 四级：可选值（A级-已成交、批发商、鞋类…）
export interface AILabelGroup {
  id: string;
  name: string;
  icon?: string;
  color: string;
  order: number;
}

export interface AILabel {
  id: string;
  groupId: string;
  parentId?: string | null; // 父节点ID
  level: 1 | 2 | 3 | 4;    // 1=行业, 2=维度, 3=字段, 4=可选值
  name: string;
  color: string;
  description?: string;
  isSystem?: boolean;
  order?: number;           // 同级排序
  selectMode?: 'single' | 'multiple'; // 仅三级字段有效：单选/多选
  inputType?: 'select' | 'text';      // 仅三级字段有效：选择/文本框，默认 select
}

// 知识库
export interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  color: string;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDocument {
  id: string;
  knowledgeBaseId: string;
  fileName: string;
  fileSize: number;       // bytes
  fileType: string;       // pdf, docx, txt, csv, xlsx
  charCount?: number;     // 字符数
  chunkCount?: number;    // 分块数量
  status: 'parsing' | 'chunking' | 'embedding' | 'ready' | 'error';
  enabled: boolean;
  uploadedAt: string;
  updatedAt: string;
}

// AI员工人设模板
export type AIPersonaTemplate = 'sales' | 'support' | 'brand';

// AI员工配置
export interface AIEmployeeConfig {
  id: string;
  name: string;                    // AI员工对外昵称
  avatar?: string;
  language: string;                // 首选回复语言
  personaTemplate: AIPersonaTemplate;
  status: 'online' | 'offline';
  // 工作时间
  timezone: string;
  workStartTime: string;
  workEndTime: string;
  workDays: number[];              // 0=Sun, 1=Mon ... 6=Sat
  // 各平台能力配置
  platformCapabilities: AIPlatformCapability[];
  // 激活的平台列表
  activePlatforms: string[];
}

export interface AIPlatformCapability {
  platformId: string;
  aiSalesChat: boolean;
  aiProactiveMarketing: boolean;
  aiRecall: boolean;
  aiQualityCheck: boolean;
}

// 用户设置
export interface UserSettings {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'agent' | 'manager';
  preferences: {
    language: string;
    timezone: string;
    notifications: boolean;
    soundEnabled: boolean;
    // 翻译设置
    translation: {
      enabled: boolean;
      receiveLanguage: string;    // 我的母语/目标显示语
      sendLanguage: string;       // 客户语种/输出目标语
      sourceLanguage?: string;    // 源语言（对方语种）
      receiveEngine?: string;     // 接收翻译线路
      sendEngine?: string;        // 发送翻译线路
      autoReceive?: boolean;      // 自动翻译接收的消息
      autoSend?: boolean;         // 将发送的消息翻译成对方语言
      realtimeTranslate?: boolean;  // 实时翻译
      groupAutoTranslate?: boolean; // 群组自动翻译
      blockChinese?: boolean;       // 禁发中文
      confirmTranslation?: boolean; // 翻译确认
    };
    // AI设置
    ai: {
      enabled: boolean;        // AI辅助总开关
      autoReply: boolean;      // AI自动回复（接管）
      suggestions: boolean;    // AI回复建议
      summary: boolean;        // AI自动总结
    };
  };
  connectedPlatforms: Platform[];
}
