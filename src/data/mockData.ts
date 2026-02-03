import type { PlatformConfig, Conversation, CustomerProfile, UserSettings, AIReplySuggestion, PlatformAccount, ProxyConfig } from '@/types';

// 平台配置
export const platformConfigs: PlatformConfig[] = [
  { id: 'whatsapp', name: 'WhatsApp', nameEn: 'WhatsApp', icon: 'MessageCircle', color: '#25D366', bgColor: 'bg-[#25D366]/10', enabled: true },
  { id: 'telegram', name: 'Telegram', nameEn: 'Telegram', icon: 'Send', color: '#0088CC', bgColor: 'bg-[#0088CC]/10', enabled: true },
  { id: 'line', name: 'Line', nameEn: 'Line', icon: 'MessageSquare', color: '#06C755', bgColor: 'bg-[#06C755]/10', enabled: true },
  { id: 'instagram', name: 'Instagram', nameEn: 'Instagram', icon: 'Instagram', color: '#E4405F', bgColor: 'bg-[#E4405F]/10', enabled: true },
  { id: 'facebook', name: 'Facebook', nameEn: 'Facebook', icon: 'Facebook', color: '#1877F2', bgColor: 'bg-[#1877F2]/10', enabled: true },
  { id: 'wechat', name: '微信', nameEn: 'WeChat', icon: 'MessageCircle', color: '#07C160', bgColor: 'bg-[#07C160]/10', enabled: true },
  { id: 'email', name: '邮件', nameEn: 'Email', icon: 'Mail', color: '#EA4335', bgColor: 'bg-[#EA4335]/10', enabled: true },
  { id: 'sms', name: '短信', nameEn: 'SMS', icon: 'Smartphone', color: '#5F6368', bgColor: 'bg-[#5F6368]/10', enabled: true },
  { id: 'tiktok', name: '抖音', nameEn: 'TikTok', icon: 'Music', color: '#000000', bgColor: 'bg-black/10', enabled: true },
  { id: 'twitter', name: 'Twitter', nameEn: 'Twitter', icon: 'Twitter', color: '#1DA1F2', bgColor: 'bg-[#1DA1F2]/10', enabled: true },
  { id: 'shopify', name: 'Shopify', nameEn: 'Shopify', icon: 'ShoppingBag', color: '#96BF48', bgColor: 'bg-[#96BF48]/10', enabled: true },
];

// 代理IP配置
export const mockProxyConfigs: ProxyConfig[] = [
  { id: 'proxy_001', name: '新加坡节点1', host: '34.125.26.1', port: 1080, protocol: 'socks5', region: '新加坡', isActive: true, createdAt: new Date() },
  { id: 'proxy_002', name: '香港节点1', host: '198.51.100.45', port: 1080, protocol: 'socks5', region: '香港', isActive: true, createdAt: new Date() },
  { id: 'proxy_003', name: '日本-东京节点', host: '203.0.113.22', port: 8080, protocol: 'http', region: '日本-东京', isActive: true, createdAt: new Date() },
  { id: 'proxy_004', name: '日本-大阪节点', host: '203.0.113.23', port: 8080, protocol: 'http', region: '日本-大阪', isActive: true, createdAt: new Date() },
  { id: 'proxy_005', name: '美国-弗吉尼亚节点', host: '52.58.12.11', port: 3128, protocol: 'https', region: '美国-弗吉尼亚', isActive: true, createdAt: new Date() },
  { id: 'proxy_006', name: '英国节点', host: '52.58.12.10', port: 3128, protocol: 'https', region: '英国', isActive: false, createdAt: new Date() },
];

// 平台客服账号
export const mockPlatformAccounts: PlatformAccount[] = [
  // WhatsApp 账号
  { id: 'wa_001', platformId: 'whatsapp', name: '客服小美', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cs1', accountId: '+86-138-0000-0001', status: 'online', isDefault: true, messageCount: 156, lastActiveAt: new Date(), remark: '主账号' },
  { id: 'wa_002', platformId: 'whatsapp', name: '客服小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cs2', accountId: '+86-138-0000-0002', status: 'online', isDefault: false, messageCount: 89, lastActiveAt: new Date(), ip: '203.0.113.12', proxyRegion: '中国-广东', remark: '备用号' },
  { id: 'wa_003', platformId: 'whatsapp', name: '客服小张', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cs3', accountId: '+86-138-0000-0003', status: 'offline', isDefault: false, messageCount: 234, lastActiveAt: new Date('2024-12-19'), ip: '198.51.100.45', proxyRegion: '香港', proxyConfigId: 'proxy_002' },

  // Telegram 账号
  { id: 'tg_001', platformId: 'telegram', name: '客服小美', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cs1', accountId: '@chatbiz_cs1', status: 'online', isDefault: true, messageCount: 78, lastActiveAt: new Date(), ip: '34.125.26.8', proxyRegion: '新加坡', remark: 'VIP客户专用', proxyConfigId: 'proxy_001' },
  { id: 'tg_002', platformId: 'telegram', name: '客服小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cs4', accountId: '@chatbiz_cs2', status: 'busy', isDefault: false, messageCount: 45, lastActiveAt: new Date(), ip: '34.125.26.9', proxyRegion: '新加坡', proxyConfigId: 'proxy_001' },
  { id: 'tg_003', platformId: 'telegram', name: '新账号', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=new', accountId: '', status: 'not_logged_in', isDefault: false, messageCount: 0, remark: '待登录' },

  // Line 账号
  { id: 'line_001', platformId: 'line', name: '客服小美', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cs1', accountId: 'chatbiz_jp1', status: 'online', isDefault: true, messageCount: 123, lastActiveAt: new Date(), ip: '203.0.113.22', proxyRegion: '日本-东京', proxyConfigId: 'proxy_003' },
  { id: 'line_002', platformId: 'line', name: '客服小林', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cs5', accountId: 'chatbiz_jp2', status: 'online', isDefault: false, messageCount: 67, lastActiveAt: new Date(), ip: '203.0.113.23', proxyRegion: '日本-大阪', proxyConfigId: 'proxy_004' },
  
  // Instagram 账号
  { id: 'ig_001', platformId: 'instagram', name: 'ChatBiz官方', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=official', accountId: '@chatbiz_official', status: 'online', isDefault: true, messageCount: 234, lastActiveAt: new Date(), ip: '52.58.12.10', proxyRegion: '英国' },
  
  // Facebook 账号
  { id: 'fb_001', platformId: 'facebook', name: 'ChatBiz Page', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=official', accountId: 'ChatBizOfficial', status: 'online', isDefault: true, messageCount: 189, lastActiveAt: new Date(), ip: '52.58.12.11', proxyRegion: '美国-弗吉尼亚' },
  
  // 微信 账号
  { id: 'wx_001', platformId: 'wechat', name: '客服小美', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cs1', accountId: 'chatbiz_cs01', status: 'online', isDefault: true, messageCount: 312, lastActiveAt: new Date(), ip: '203.0.113.65', proxyRegion: '中国-上海' },
  { id: 'wx_002', platformId: 'wechat', name: '客服小陈', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cs6', accountId: 'chatbiz_cs02', status: 'offline', isDefault: false, messageCount: 156, lastActiveAt: new Date('2024-12-18'), ip: '203.0.113.66', proxyRegion: '中国-北京' },
  
  // 邮件 账号
  { id: 'email_001', platformId: 'email', name: '客服部', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=official', accountId: 'support@chatbiz.com', status: 'online', isDefault: true, messageCount: 89, lastActiveAt: new Date(), ip: '198.51.100.12', proxyRegion: '美国-加州' },
  
  // 短信 账号
  { id: 'sms_001', platformId: 'sms', name: '短信客服', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=official', accountId: '+86-400-888-8888', status: 'online', isDefault: true, messageCount: 45, lastActiveAt: new Date(), ip: '198.51.100.13', proxyRegion: '中国-广州' },
  
  // 抖音 账号
  { id: 'dy_001', platformId: 'tiktok', name: 'ChatBiz官方', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=official', accountId: '@chatbiz', status: 'online', isDefault: true, messageCount: 178, lastActiveAt: new Date(), ip: '54.223.11.7', proxyRegion: '美国-俄勒冈' },
  
  // Twitter 账号
  { id: 'tw_001', platformId: 'twitter', name: 'ChatBiz', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=official', accountId: '@chatbiz', status: 'online', isDefault: true, messageCount: 67, lastActiveAt: new Date(), ip: '54.223.11.8', proxyRegion: '美国-俄勒冈' },
  
  // Shopify 账号
  { id: 'sp_001', platformId: 'shopify', name: 'ChatBiz Store', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=official', accountId: 'chatbiz.myshopify.com', status: 'online', isDefault: true, messageCount: 234, lastActiveAt: new Date(), ip: '3.120.45.19', proxyRegion: '新加坡' },
];

// 模拟客户数据
const mockCustomers: CustomerProfile[] = [
  {
    id: 'cust_1',
    name: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    email: 'sarah.j@example.com',
    phone: '+1-555-0123',
    country: '美国',
    language: 'en',
    platform: 'whatsapp',
    tags: ['VIP客户', '高消费', '回头客'],
    notes: '对产品质量要求很高，喜欢快速回复',
    createdAt: new Date('2024-01-15'),
    lastContactAt: new Date('2024-12-20'),
    orderHistory: [
      { id: 'ord_1', orderNumber: 'ORD-2024-001', date: new Date('2024-11-15'), total: 299.99, currency: 'USD', status: 'delivered', items: [{ id: 'item_1', name: '无线蓝牙耳机', quantity: 1, price: 299.99 }] },
      { id: 'ord_2', orderNumber: 'ORD-2024-045', date: new Date('2024-12-10'), total: 159.99, currency: 'USD', status: 'shipped', items: [{ id: 'item_2', name: '手机保护壳套装', quantity: 2, price: 79.99 }] },
    ],
    behaviorAnalysis: {
      totalSpent: 459.98,
      orderCount: 2,
      averageOrderValue: 229.99,
      favoriteCategories: ['电子产品', '配件'],
      lastPurchaseDate: new Date('2024-12-10'),
      customerSince: new Date('2024-01-15'),
      satisfactionScore: 4.8,
      responseRate: 0.95,
      preferredContactTime: '上午9-12点',
    },
  },
  {
    id: 'cust_2',
    name: '田中健太',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kenta',
    email: 'kenta.tanaka@example.jp',
    phone: '+81-90-1234-5678',
    country: '日本',
    language: 'ja',
    platform: 'line',
    tags: ['新客户', '询盘'],
    notes: '日语沟通，对物流时效比较关注',
    createdAt: new Date('2024-12-18'),
    lastContactAt: new Date('2024-12-20'),
    orderHistory: [],
    behaviorAnalysis: {
      totalSpent: 0,
      orderCount: 0,
      averageOrderValue: 0,
      favoriteCategories: [],
      customerSince: new Date('2024-12-18'),
      satisfactionScore: undefined,
      responseRate: 0.8,
      preferredContactTime: '下午2-5点',
    },
  },
  {
    id: 'cust_3',
    name: '李明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiMing',
    email: 'liming@example.cn',
    phone: '+86-138-8888-8888',
    country: '中国',
    language: 'zh',
    platform: 'wechat',
    tags: ['批发客户', '大客户'],
    notes: '批量采购，需要报价单，关注折扣',
    createdAt: new Date('2024-06-01'),
    lastContactAt: new Date('2024-12-19'),
    orderHistory: [
      { id: 'ord_3', orderNumber: 'ORD-2024-120', date: new Date('2024-12-01'), total: 15800, currency: 'CNY', status: 'delivered', items: [{ id: 'item_3', name: '智能手表 x50', quantity: 50, price: 316 }] },
    ],
    behaviorAnalysis: {
      totalSpent: 15800,
      orderCount: 1,
      averageOrderValue: 15800,
      favoriteCategories: ['智能穿戴', '批发'],
      lastPurchaseDate: new Date('2024-12-01'),
      customerSince: new Date('2024-06-01'),
      satisfactionScore: 4.5,
      responseRate: 0.9,
      preferredContactTime: '上午10-12点',
    },
  },
  {
    id: 'cust_4',
    name: 'Emma Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    email: 'emma.w@example.co.uk',
    phone: '+44-7700-900123',
    country: '英国',
    language: 'en',
    platform: 'instagram',
    tags: ['社交媒体', '年轻客户'],
    notes: '通过Instagram广告来的，对时尚产品感兴趣',
    createdAt: new Date('2024-11-20'),
    lastContactAt: new Date('2024-12-20'),
    orderHistory: [
      { id: 'ord_4', orderNumber: 'ORD-2024-089', date: new Date('2024-12-15'), total: 129.99, currency: 'GBP', status: 'processing', items: [{ id: 'item_4', name: '时尚手提包', quantity: 1, price: 129.99 }] },
    ],
    behaviorAnalysis: {
      totalSpent: 129.99,
      orderCount: 1,
      averageOrderValue: 129.99,
      favoriteCategories: ['时尚', '配饰'],
      lastPurchaseDate: new Date('2024-12-15'),
      customerSince: new Date('2024-11-20'),
      satisfactionScore: 4.2,
      responseRate: 0.85,
      preferredContactTime: '晚上7-10点',
    },
  },
  {
    id: 'cust_5',
    name: 'Park Min-ji',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minji',
    email: 'minji.park@example.kr',
    phone: '+82-10-1234-5678',
    country: '韩国',
    language: 'ko',
    platform: 'telegram',
    tags: ['美妆爱好者', '活跃客户'],
    notes: '经常询问新品，对K-beauty产品很感兴趣',
    createdAt: new Date('2024-09-10'),
    lastContactAt: new Date('2024-12-20'),
    orderHistory: [
      { id: 'ord_5', orderNumber: 'ORD-2024-056', date: new Date('2024-11-01'), total: 189000, currency: 'KRW', status: 'delivered', items: [{ id: 'item_5', name: '护肤套装', quantity: 1, price: 189000 }] },
      { id: 'ord_6', orderNumber: 'ORD-2024-098', date: new Date('2024-12-05'), total: 125000, currency: 'KRW', status: 'delivered', items: [{ id: 'item_6', name: '彩妆组合', quantity: 1, price: 125000 }] },
    ],
    behaviorAnalysis: {
      totalSpent: 314000,
      orderCount: 2,
      averageOrderValue: 157000,
      favoriteCategories: ['美妆', '护肤'],
      lastPurchaseDate: new Date('2024-12-05'),
      customerSince: new Date('2024-09-10'),
      satisfactionScore: 4.9,
      responseRate: 0.98,
      preferredContactTime: '下午3-6点',
    },
  },
  {
    id: 'cust_6',
    name: 'Marco Rossi',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marco',
    email: 'marco.rossi@example.it',
    phone: '+39-333-1234567',
    country: '意大利',
    language: 'it',
    platform: 'facebook',
    tags: ['欧洲客户', '设计爱好者'],
    notes: '对产品设计很挑剔，喜欢意大利风格',
    createdAt: new Date('2024-08-15'),
    lastContactAt: new Date('2024-12-18'),
    orderHistory: [
      { id: 'ord_7', orderNumber: 'ORD-2024-067', date: new Date('2024-10-20'), total: 449.99, currency: 'EUR', status: 'delivered', items: [{ id: 'item_7', name: '设计师台灯', quantity: 1, price: 449.99 }] },
    ],
    behaviorAnalysis: {
      totalSpent: 449.99,
      orderCount: 1,
      averageOrderValue: 449.99,
      favoriteCategories: ['家居', '设计'],
      lastPurchaseDate: new Date('2024-10-20'),
      customerSince: new Date('2024-08-15'),
      satisfactionScore: 4.6,
      responseRate: 0.75,
      preferredContactTime: '上午10-12点',
    },
  },
  {
    id: 'cust_7',
    name: '张伟',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangWei',
    email: 'zhangwei@example.cn',
    phone: '+86-139-6666-6666',
    country: '中国',
    language: 'zh',
    platform: 'tiktok',
    tags: ['直播客户', '冲动消费'],
    notes: '通过直播下单，对促销活动敏感',
    createdAt: new Date('2024-12-01'),
    lastContactAt: new Date('2024-12-20'),
    orderHistory: [
      { id: 'ord_8', orderNumber: 'ORD-2024-134', date: new Date('2024-12-10'), total: 599, currency: 'CNY', status: 'shipped', items: [{ id: 'item_8', name: '直播特惠套装', quantity: 1, price: 599 }] },
    ],
    behaviorAnalysis: {
      totalSpent: 599,
      orderCount: 1,
      averageOrderValue: 599,
      favoriteCategories: ['促销', '套装'],
      lastPurchaseDate: new Date('2024-12-10'),
      customerSince: new Date('2024-12-01'),
      satisfactionScore: 4.0,
      responseRate: 0.7,
      preferredContactTime: '晚上8-11点',
    },
  },
  {
    id: 'cust_8',
    name: 'Alex Thompson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    email: 'alex.t@example.com',
    phone: '+1-555-0199',
    country: '美国',
    language: 'en',
    platform: 'email',
    tags: ['B2B客户', '企业采购'],
    notes: '企业采购经理，需要正式报价和合同',
    createdAt: new Date('2024-07-01'),
    lastContactAt: new Date('2024-12-19'),
    orderHistory: [
      { id: 'ord_9', orderNumber: 'ORD-2024-078', date: new Date('2024-11-25'), total: 5999.99, currency: 'USD', status: 'processing', items: [{ id: 'item_9', name: '办公设备套装', quantity: 10, price: 599.99 }] },
    ],
    behaviorAnalysis: {
      totalSpent: 5999.99,
      orderCount: 1,
      averageOrderValue: 5999.99,
      favoriteCategories: ['办公设备', 'B2B'],
      lastPurchaseDate: new Date('2024-11-25'),
      customerSince: new Date('2024-07-01'),
      satisfactionScore: 4.7,
      responseRate: 0.88,
      preferredContactTime: '上午9-11点',
    },
  },
];

// 导出客户数据供store使用
export { mockCustomers };

// 模拟会话数据
export const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    customerId: 'cust_1',
    customer: mockCustomers[0],
    platform: 'whatsapp',
    messages: [
      { id: 'msg_1', conversationId: 'conv_1', senderId: 'cust_1', senderType: 'customer', content: 'Hi, I ordered a wireless earphone last month and I\'m very satisfied with it!', contentOriginal: 'Hi, I ordered a wireless earphone last month and I\'m very satisfied with it!', language: 'en', timestamp: new Date('2024-12-20T09:30:00'), status: 'read' },
      { id: 'msg_2', conversationId: 'conv_1', senderId: 'ai', senderType: 'ai', content: 'Thank you for your feedback! We\'re glad you\'re enjoying your wireless earphone. Is there anything else we can help you with today?', translatedContent: '感谢您的反馈！很高兴您喜欢我们的无线耳机。今天还有什么可以帮您的吗？', language: 'en', timestamp: new Date('2024-12-20T09:31:00'), status: 'read', isAIGenerated: true },
      { id: 'msg_3', conversationId: 'conv_1', senderId: 'cust_1', senderType: 'customer', content: 'Actually, I\'m looking to buy another one as a gift. Do you have any discounts for returning customers?', contentOriginal: 'Actually, I\'m looking to buy another one as a gift. Do you have any discounts for returning customers?', language: 'en', timestamp: new Date('2024-12-20T09:32:00'), status: 'unread' },
    ],
    unreadCount: 1,
    lastMessage: { id: 'msg_3', conversationId: 'conv_1', senderId: 'cust_1', senderType: 'customer', content: 'Actually, I\'m looking to buy another one as a gift. Do you have any discounts for returning customers?', contentOriginal: 'Actually, I\'m looking to buy another one as a gift. Do you have any discounts for returning customers?', language: 'en', timestamp: new Date('2024-12-20T09:32:00'), status: 'unread' },
    status: 'active',
    priority: 'medium',
    tags: ['复购', '折扣咨询'],
    createdAt: new Date('2024-12-20T09:30:00'),
    updatedAt: new Date('2024-12-20T09:32:00'),
    aiSummary: '客户对之前购买的无线耳机满意，想再买一件作为礼物，询问是否有老客户折扣。',
    aiSuggestions: [
      '感谢您对我们的支持！作为回头客，您可以享受9折优惠，代码是RETURN10。',
      '当然！我们为忠实客户提供特别折扣，请使用代码LOYAL15享受85折。',
      '很高兴您喜欢我们的产品！现在购买第二件可享受8折优惠。',
    ],
  },
  {
    id: 'conv_2',
    customerId: 'cust_2',
    customer: mockCustomers[1],
    platform: 'line',
    messages: [
      { id: 'msg_4', conversationId: 'conv_2', senderId: 'cust_2', senderType: 'customer', content: 'こんにちは、製品について質問があります。', contentOriginal: 'こんにちは、製品について質問があります。', language: 'ja', timestamp: new Date('2024-12-20T10:15:00'), status: 'read' },
      { id: 'msg_5', conversationId: 'conv_2', senderId: 'ai', senderType: 'ai', content: 'こんにちは！どのようなご質問でしょうか？喜んでお手伝いさせていただきます。', translatedContent: '您好！您有什么问题呢？我很乐意为您提供帮助。', language: 'ja', timestamp: new Date('2024-12-20T10:16:00'), status: 'read', isAIGenerated: true },
      { id: 'msg_6', conversationId: 'conv_2', senderId: 'cust_2', senderType: 'customer', content: '配送はどのくらいかかりますか？', contentOriginal: '配送はどのくらいかかりますか？', language: 'ja', timestamp: new Date('2024-12-20T10:17:00'), status: 'unread' },
    ],
    unreadCount: 1,
    lastMessage: { id: 'msg_6', conversationId: 'conv_2', senderId: 'cust_2', senderType: 'customer', content: '配送はどのくらいかかりますか？', contentOriginal: '配送はどのくらいかかりますか？', language: 'ja', timestamp: new Date('2024-12-20T10:17:00'), status: 'unread' },
    status: 'active',
    priority: 'high',
    tags: ['物流咨询', '日本客户'],
    createdAt: new Date('2024-12-20T10:15:00'),
    updatedAt: new Date('2024-12-20T10:17:00'),
    aiSummary: '日本新客户询问配送时间，需要尽快回复。',
    aiSuggestions: [
      '日本への配送は通常5-7営業日かかります。',
      ' expedited shippingをご利用の場合、3-5営業日でお届けできます。',
      '現在、日本向け配送キャンペーン中で、無料配送をご利用いただけます。',
    ],
  },
  {
    id: 'conv_3',
    customerId: 'cust_3',
    customer: mockCustomers[2],
    platform: 'wechat',
    messages: [
      { id: 'msg_7', conversationId: 'conv_3', senderId: 'cust_3', senderType: 'customer', content: '你好，我想批量采购智能手表，能给我报个价吗？', contentOriginal: '你好，我想批量采购智能手表，能给我报个价吗？', language: 'zh', timestamp: new Date('2024-12-19T14:30:00'), status: 'read' },
      { id: 'msg_8', conversationId: 'conv_3', senderId: 'ai', senderType: 'ai', content: '您好！感谢您对我们产品的关注。请问您需要采购多少数量呢？我们有不同的批量折扣方案。', translatedContent: '您好！感谢您对我们产品的关注。请问您需要采购多少数量呢？我们有不同的批量折扣方案。', language: 'zh', timestamp: new Date('2024-12-19T14:32:00'), status: 'read', isAIGenerated: true },
      { id: 'msg_9', conversationId: 'conv_3', senderId: 'cust_3', senderType: 'customer', content: '大概需要100个，什么价格？', contentOriginal: '大概需要100个，什么价格？', language: 'zh', timestamp: new Date('2024-12-19T14:35:00'), status: 'read' },
      { id: 'msg_10', conversationId: 'conv_3', senderId: 'ai', senderType: 'ai', content: '100个的话，单价可以给到280元，总价28000元，包含运费。如果需要更多，价格还可以再谈。', translatedContent: '100个的话，单价可以给到280元，总价28000元，包含运费。如果需要更多，价格还可以再谈。', language: 'zh', timestamp: new Date('2024-12-19T14:38:00'), status: 'read', isAIGenerated: true },
    ],
    unreadCount: 0,
    lastMessage: { id: 'msg_10', conversationId: 'conv_3', senderId: 'ai', senderType: 'ai', content: '100个的话，单价可以给到280元，总价28000元，包含运费。如果需要更多，价格还可以再谈。', translatedContent: '100个的话，单价可以给到280元，总价28000元，包含运费。如果需要更多，价格还可以再谈。', language: 'zh', timestamp: new Date('2024-12-19T14:38:00'), status: 'read', isAIGenerated: true },
    status: 'pending',
    priority: 'urgent',
    tags: ['批发', '大客户', '报价'],
    createdAt: new Date('2024-12-19T14:30:00'),
    updatedAt: new Date('2024-12-19T14:38:00'),
    aiSummary: '批发客户询问100个智能手表的报价，AI已回复单价280元，等待客户确认。',
    aiSuggestions: [
      '如果您今天下单，我们还可以额外赠送5个样品。',
      '这个价格已经是最优惠的了，质量保证，支持7天无理由退换。',
      '我们可以提供正式报价单和合同，方便您公司报销。',
    ],
  },
  {
    id: 'conv_4',
    customerId: 'cust_4',
    customer: mockCustomers[3],
    platform: 'instagram',
    messages: [
      { id: 'msg_11', conversationId: 'conv_4', senderId: 'cust_4', senderType: 'customer', content: 'Hey! I saw your ad on Instagram. Love the handbag! Is it available in other colors?', contentOriginal: 'Hey! I saw your ad on Instagram. Love the handbag! Is it available in other colors?', language: 'en', timestamp: new Date('2024-12-20T08:20:00'), status: 'read' },
      { id: 'msg_12', conversationId: 'conv_4', senderId: 'ai', senderType: 'ai', content: 'Hi! Thank you for your interest! Yes, this handbag comes in black, brown, beige, and red. Which color do you prefer?', translatedContent: '嗨！感谢您的关注！是的，这款手提包有黑色、棕色、米色和红色。您喜欢哪种颜色？', language: 'en', timestamp: new Date('2024-12-20T08:22:00'), status: 'read', isAIGenerated: true },
    ],
    unreadCount: 0,
    lastMessage: { id: 'msg_12', conversationId: 'conv_4', senderId: 'ai', senderType: 'ai', content: 'Hi! Thank you for your interest! Yes, this handbag comes in black, brown, beige, and red. Which color do you prefer?', translatedContent: '嗨！感谢您的关注！是的，这款手提包有黑色、棕色、米色和红色。您喜欢哪种颜色？', language: 'en', timestamp: new Date('2024-12-20T08:22:00'), status: 'read', isAIGenerated: true },
    status: 'active',
    priority: 'low',
    tags: ['社交媒体', '产品咨询'],
    createdAt: new Date('2024-12-20T08:20:00'),
    updatedAt: new Date('2024-12-20T08:22:00'),
    aiSummary: 'Instagram广告来的客户询问手提包是否有其他颜色可选。',
    aiSuggestions: [
      'The black one is our bestseller and goes with everything!',
      'We have a special 15% off for first-time customers. Would you like the discount code?',
      'I can send you photos of all colors. Which one would you like to see first?',
    ],
  },
  {
    id: 'conv_5',
    customerId: 'cust_5',
    customer: mockCustomers[4],
    platform: 'telegram',
    messages: [
      { id: 'msg_13', conversationId: 'conv_5', senderId: 'cust_5', senderType: 'customer', content: '안녕하세요! 새로운 화장품 출시 소식 있나요?', contentOriginal: '안녕하세요! 새로운 화장품 출시 소식 있나요?', language: 'ko', timestamp: new Date('2024-12-20T11:00:00'), status: 'read' },
      { id: 'msg_14', conversationId: 'conv_5', senderId: 'ai', senderType: 'ai', content: '안녕하세요! 네, 이번 주에 새로운 K-뷰티 세트를 출시했어요. 특별 할인도 진행 중입니다!', translatedContent: '您好！是的，我们本周推出了新的K-Beauty套装。正在进行特别折扣活动！', language: 'ko', timestamp: new Date('2024-12-20T11:02:00'), status: 'read', isAIGenerated: true },
    ],
    unreadCount: 0,
    lastMessage: { id: 'msg_14', conversationId: 'conv_5', senderId: 'ai', senderType: 'ai', content: '안녕하세요! 네, 이번 주에 새로운 K-뷰티 세트를 출시했어요. 특별 할인도 진행 중입니다!', translatedContent: '您好！是的，我们本周推出了新的K-Beauty套装。正在进行特别折扣活动！', language: 'ko', timestamp: new Date('2024-12-20T11:02:00'), status: 'read', isAIGenerated: true },
    status: 'active',
    priority: 'medium',
    tags: ['新品咨询', '韩国客户', '美妆'],
    createdAt: new Date('2024-12-20T11:00:00'),
    updatedAt: new Date('2024-12-20T11:02:00'),
    aiSummary: '韩国老客户询问新品化妆品，对K-Beauty产品很感兴趣。',
    aiSuggestions: [
      '새로운 세트를 지금 구매하시면 20% 할인된 가격에 드려요!',
      '묶음 구매 시 추가 10% 할인도 가능합니다.',
      '묣음 샘플도 함께 볂어드릴까요?',
    ],
  },
  {
    id: 'conv_6',
    customerId: 'cust_6',
    customer: mockCustomers[5],
    platform: 'facebook',
    messages: [
      { id: 'msg_15', conversationId: 'conv_6', senderId: 'cust_6', senderType: 'customer', content: 'Ciao! I bought a designer lamp last month but it arrived damaged. Can I get a replacement?', contentOriginal: 'Ciao! I bought a designer lamp last month but it arrived damaged. Can I get a replacement?', language: 'it', timestamp: new Date('2024-12-18T16:45:00'), status: 'read' },
      { id: 'msg_16', conversationId: 'conv_6', senderId: 'ai', senderType: 'ai', content: 'Hello! We\'re sorry to hear that your lamp arrived damaged. Of course, we can arrange a replacement for you. Could you please provide your order number?', translatedContent: '您好！很抱歉您的灯具在运输中损坏了。当然，我们可以为您安排换货。请提供您的订单号好吗？', language: 'en', timestamp: new Date('2024-12-18T16:47:00'), status: 'read', isAIGenerated: true },
      { id: 'msg_17', conversationId: 'conv_6', senderId: 'cust_6', senderType: 'customer', content: 'It\'s ORD-2024-067. The box was crushed during shipping.', contentOriginal: 'It\'s ORD-2024-067. The box was crushed during shipping.', language: 'en', timestamp: new Date('2024-12-18T16:50:00'), status: 'read' },
    ],
    unreadCount: 0,
    lastMessage: { id: 'msg_17', conversationId: 'conv_6', senderId: 'cust_6', senderType: 'customer', content: 'It\'s ORD-2024-067. The box was crushed during shipping.', contentOriginal: 'It\'s ORD-2024-067. The box was crushed during shipping.', language: 'en', timestamp: new Date('2024-12-18T16:50:00'), status: 'read' },
    status: 'resolved',
    priority: 'high',
    tags: ['售后', '换货', '物流损坏'],
    createdAt: new Date('2024-12-18T16:45:00'),
    updatedAt: new Date('2024-12-18T16:50:00'),
    aiSummary: '意大利客户报告灯具运输损坏，已提供订单号ORD-2024-067，需要安排换货。',
    aiSuggestions: [
      'Thank you for providing the order number. We\'ll ship a replacement within 24 hours.',
      'We apologize for the inconvenience. A new lamp will be sent with extra protective packaging.',
      'Would you like us to arrange pickup of the damaged item, or can you dispose of it?',
    ],
  },
  {
    id: 'conv_7',
    customerId: 'cust_7',
    customer: mockCustomers[6],
    platform: 'tiktok',
    messages: [
      { id: 'msg_18', conversationId: 'conv_7', senderId: 'cust_7', senderType: 'customer', content: '在吗？我昨天直播买的套装什么时候发货？', contentOriginal: '在吗？我昨天直播买的套装什么时候发货？', language: 'zh', timestamp: new Date('2024-12-20T09:00:00'), status: 'read' },
      { id: 'msg_19', conversationId: 'conv_7', senderId: 'ai', senderType: 'ai', content: '在的！感谢您的购买。您的订单ORD-2024-134已经发货了，预计2-3天到达。', translatedContent: '在的！感谢您的购买。您的订单ORD-2024-134已经发货了，预计2-3天到达。', language: 'zh', timestamp: new Date('2024-12-20T09:02:00'), status: 'read', isAIGenerated: true },
    ],
    unreadCount: 0,
    lastMessage: { id: 'msg_19', conversationId: 'conv_7', senderId: 'ai', senderType: 'ai', content: '在的！感谢您的购买。您的订单ORD-2024-134已经发货了，预计2-3天到达。', translatedContent: '在的！感谢您的购买。您的订单ORD-2024-134已经发货了，预计2-3天到达。', language: 'zh', timestamp: new Date('2024-12-20T09:02:00'), status: 'read', isAIGenerated: true },
    status: 'resolved',
    priority: 'low',
    tags: ['直播客户', '物流查询'],
    createdAt: new Date('2024-12-20T09:00:00'),
    updatedAt: new Date('2024-12-20T09:02:00'),
    aiSummary: '直播客户查询订单发货情况，订单已发货，预计2-3天到达。',
    aiSuggestions: [
      '您可以通过这个链接实时跟踪物流信息。',
      '如果急需，我们可以帮您联系快递优先派送。',
      '收到后如果有任何问题，随时联系我们！',
    ],
  },
  {
    id: 'conv_8',
    customerId: 'cust_8',
    customer: mockCustomers[7],
    platform: 'email',
    messages: [
      { id: 'msg_20', conversationId: 'conv_8', senderId: 'cust_8', senderType: 'customer', content: 'Dear Sales Team, I would like to request a formal quote for 10 units of your office equipment set. Please include shipping costs to New York.', contentOriginal: 'Dear Sales Team, I would like to request a formal quote for 10 units of your office equipment set. Please include shipping costs to New York.', language: 'en', timestamp: new Date('2024-12-19T10:00:00'), status: 'read' },
      { id: 'msg_21', conversationId: 'conv_8', senderId: 'ai', senderType: 'ai', content: 'Dear Mr. Thompson, Thank you for your inquiry. We\'d be happy to provide a formal quote. The price for 10 units would be $5,999.90 plus $299 shipping to New York. I\'ll send the detailed quote shortly.', translatedContent: '尊敬的张先生，感谢您的询价。我们很乐意提供正式报价。10套设备的价格是5999.90美元，另加299美元运费到纽约。我将很快发送详细报价单。', language: 'en', timestamp: new Date('2024-12-19T10:30:00'), status: 'read', isAIGenerated: true },
    ],
    unreadCount: 0,
    lastMessage: { id: 'msg_21', conversationId: 'conv_8', senderId: 'ai', senderType: 'ai', content: 'Dear Mr. Thompson, Thank you for your inquiry. We\'d be happy to provide a formal quote. The price for 10 units would be $5,999.90 plus $299 shipping to New York. I\'ll send the detailed quote shortly.', translatedContent: '尊敬的张先生，感谢您的询价。我们很乐意提供正式报价。10套设备的价格是5999.90美元，另加299美元运费到纽约。我将很快发送详细报价单。', language: 'en', timestamp: new Date('2024-12-19T10:30:00'), status: 'read', isAIGenerated: true },
    status: 'pending',
    priority: 'high',
    tags: ['B2B', '正式报价', '企业客户'],
    createdAt: new Date('2024-12-19T10:00:00'),
    updatedAt: new Date('2024-12-19T10:30:00'),
    aiSummary: 'B2B客户请求10套办公设备的正式报价，需要发送到纽约，AI已回复初步价格。',
    aiSuggestions: [
      'Please find the attached formal quotation. Payment terms are Net 30.',
      'We can offer a 5% discount for orders over $10,000.',
      'Would you like to schedule a call to discuss the details?',
    ],
  },
];

// 模拟用户设置
export const mockUserSettings: UserSettings = {
  id: 'user_1',
  name: '客服小美',
  email: 'cs@chatbiz.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CS',
  role: 'agent',
  preferences: {
    language: 'zh',
    timezone: 'Asia/Shanghai',
    notifications: true,
    soundEnabled: true,
    translation: {
      enabled: true,
      receiveLanguage: 'zh', // 接收消息翻译为中文
      sendLanguage: 'en',    // 发送消息翻译为英文
    },
    ai: {
      enabled: true,
      autoReply: false,      // AI自动回复（接管模式）默认关闭
      suggestions: true,     // AI回复建议
      summary: true,         // AI自动总结
    },
  },
  connectedPlatforms: ['whatsapp', 'telegram', 'line', 'instagram', 'facebook', 'wechat', 'email', 'tiktok'],
};

// 模拟AI回复建议
export const mockAIReplySuggestions: AIReplySuggestion[] = [
  {
    id: 'sugg_1',
    content: '感谢您对我们的支持！作为回头客，您可以享受9折优惠，代码是RETURN10。',
    tone: 'friendly',
    language: 'zh',
    confidence: 0.92,
  },
  {
    id: 'sugg_2',
    content: '当然！我们为忠实客户提供特别折扣，请使用代码LOYAL15享受85折。',
    tone: 'professional',
    language: 'zh',
    confidence: 0.88,
  },
  {
    id: 'sugg_3',
    content: '很高兴您喜欢我们的产品！现在购买第二件可享受8折优惠。',
    tone: 'friendly',
    language: 'zh',
    confidence: 0.85,
  },
];

// 语言映射
export const languageMap: Record<string, { name: string; flag: string }> = {
  zh: { name: '中文', flag: '🇨🇳' },
  en: { name: 'English', flag: '🇬🇧' },
  ja: { name: '日本語', flag: '🇯🇵' },
  ko: { name: '한국어', flag: '🇰🇷' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  ar: { name: 'العربية', flag: '🇸🇦' },
};

// 国家映射
export const countryMap: Record<string, { name: string; flag: string; currency: string }> = {
  CN: { name: '中国', flag: '🇨🇳', currency: 'CNY' },
  US: { name: '美国', flag: '🇺🇸', currency: 'USD' },
  UK: { name: '英国', flag: '🇬🇧', currency: 'GBP' },
  JP: { name: '日本', flag: '🇯🇵', currency: 'JPY' },
  KR: { name: '韩国', flag: '🇰🇷', currency: 'KRW' },
  IT: { name: '意大利', flag: '🇮🇹', currency: 'EUR' },
  DE: { name: '德国', flag: '🇩🇪', currency: 'EUR' },
  FR: { name: '法国', flag: '🇫🇷', currency: 'EUR' },
  ES: { name: '西班牙', flag: '🇪🇸', currency: 'EUR' },
  AU: { name: '澳大利亚', flag: '🇦🇺', currency: 'AUD' },
  CA: { name: '加拿大', flag: '🇨🇦', currency: 'CAD' },
};

// AI客服统计数据
export const mockAIStats = {
  // AI客服状态
  status: 'online' as 'online' | 'offline' | 'busy' | 'pause',
  statusText: '在线',
  // 今日接待数据
  today: {
    customersServed: 156,      // 接待人数
    messagesReplied: 423,      // 回复消息数
    aiGeneratedReplies: 298,   // AI生成回复数
    avgResponseTime: 12,       // 平均响应时间(秒)
    satisfactionRate: 94.5,    // 满意度(%)
    translationCount: 87,      // 翻译次数
  },
  // 本周数据
  weekly: {
    customersServed: 1089,
    messagesReplied: 3241,
    aiGeneratedReplies: 2156,
    avgResponseTime: 15,
    satisfactionRate: 93.2,
    translationCount: 612,
  },
  // AI使用统计
  aiUsage: {
    totalSuggestions: 5234,    // 总建议数
    adoptedSuggestions: 3891,  // 被采纳数
    adoptionRate: 74.3,        // 采纳率
    autoReplies: 1245,         // 自动回复数
    manualReplies: 876,        // 人工回复数
  },
  // 实时数据
  realtime: {
    currentChats: 8,           // 当前对话数
    queueLength: 3,            // 排队人数
    avgWaitTime: 45,           // 平均等待时间(秒)
  },
  // 语言能力统计
  languageStats: [
    { language: 'zh', name: '中文', count: 2341, percentage: 45 },
    { language: 'en', name: 'English', count: 1567, percentage: 30 },
    { language: 'ja', name: '日本語', count: 523, percentage: 10 },
    { language: 'ko', name: '한국어', count: 389, percentage: 7 },
    { language: 'other', name: '其他', count: 414, percentage: 8 },
  ],
  // 每日趋势（最近7天）
  dailyTrend: [
    { date: '12-14', customers: 142, messages: 398, aiReplies: 267 },
    { date: '12-15', customers: 156, messages: 423, aiReplies: 298 },
    { date: '12-16', customers: 138, messages: 389, aiReplies: 245 },
    { date: '12-17', customers: 167, messages: 456, aiReplies: 312 },
    { date: '12-18', customers: 145, messages: 412, aiReplies: 289 },
    { date: '12-19', customers: 159, messages: 445, aiReplies: 301 },
    { date: '12-20', customers: 156, messages: 423, aiReplies: 298 },
  ],
};
