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
  // 新增筛选条件
  countries: string[]; // 按国家筛选
  languages: string[]; // 按语言筛选
  assignedTo: string[]; // 按分配客服筛选
  hasOrder?: boolean; // 是否有订单
  isVIP?: boolean; // 是否VIP客户
  customerTags: string[]; // 客户标签
  messageCountRange?: { min?: number; max?: number }; // 消息数量范围
  lastActiveRange?: 'today' | 'yesterday' | 'week' | 'month' | 'custom'; // 最后活跃时间
}

// 平台客服账号
export interface PlatformAccount {
  id: string;
  platformId: Platform;
  name: string;
  avatar?: string;
  accountId: string; // 平台账号ID
  status: 'online' | 'offline' | 'busy' | 'not_logged_in'; // 新增未登录状态
  isDefault: boolean;
  messageCount: number;
  lastActiveAt?: Date;
  ip?: string; // 客服当前 IP 地址（可选）
  proxyRegion?: string; // 代理/节点所在地区（可选）
  remark?: string; // 备注信息
  proxyConfigId?: string; // 关联的代理配置ID
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
      receiveLanguage: string; // 接收译文的目标语言
      sendLanguage: string;    // 发送消息的目标语言
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
