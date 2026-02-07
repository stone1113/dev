import { useState, useEffect, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { Sidebar } from '@/components/Sidebar';
import { ConversationList } from '@/components/ConversationList';
import { ChatInterface } from '@/components/ChatInterface';
import { CustomerAIProfile } from '@/components/CustomerAIProfile';
import { FilterPanel } from '@/components/FilterPanel';
import { RightMenuBar, type RightPanelType } from '@/components/RightMenuBar';
import { ProxySettings } from '@/components/ProxySettings';
import { TranslationSettings } from '@/components/TranslationSettings';
import { ContactList } from '@/components/ContactList';
import { LoginPage } from '@/components/LoginPage';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminLoginPage } from '@/components/AdminLoginPage';
import { SettingsPage } from '@/components/SettingsPage';
import { platformConfigs } from '@/data/mockData';
import {
  MessageCircle,
  Search,
  Bell,
  Menu,
  Users,
  User,
  Sparkles,
  Clock,
  ThumbsUp,
  Languages,
  BarChart3,
  Lightbulb,
  Target,
  Zap,
  AlertTriangle,
  MapPin,
  Bot,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  Inbox,
  ChevronLeft,
  ChevronRight,
  QrCode,
  X,
  Send,
  Crown,
  Calendar,
  Key,
  Server,
  Building2,
  MessageSquare,
  Instagram,
  Facebook,
  Mail,
  Smartphone,
  Music,
  Twitter,
  ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';

function App() {
  const {
    searchQuery,
    setSearchQuery,
    getFilteredConversations,
    conversations: allConversations,
    selectedConversationId,
    setSelectedConversation,
    loginAccountId,
    setLoginAccountId,
    getLoginAccount,
    updatePlatformAccount
  } = useStore();

  // 登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // 管理中心状态
  const [showAdminCenter, setShowAdminCenter] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [activeSection, setActiveSection] = useState('conversations');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeRightPanel, setActiveRightPanel] = useState<RightPanelType>(null);
  const [showMorePending, setShowMorePending] = useState(false);

  // 登录处理
  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  // 退出登录处理
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };
  
  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const conversations = getFilteredConversations();
  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  // 如果显示管理中心
  if (showAdminCenter) {
    // 如果管理端未登录，显示管理端登录页面
    if (!isAdminLoggedIn) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => setIsAdminLoggedIn(true)}
          onGoToClient={() => setShowAdminCenter(false)}
        />
      );
    }
    // 管理端已登录，显示管理中心
    return (
      <AdminLayout
        onBack={() => {
          setShowAdminCenter(false);
          setIsAdminLoggedIn(false);
        }}
      />
    );
  }

  // 如果未登录，显示登录页面
  if (!isLoggedIn) {
    return (
      <LoginPage
        onLoginSuccess={handleLogin}
        onGoToAdmin={() => setShowAdminCenter(true)}
      />
    );
  }
  
  // 渲染主内容区
  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'conversations':
        // 如果正在登录客服账号，只显示扫码页面
        if (loginAccountId) {
          return (
            <div className="flex h-full items-center justify-center">
              <div className="w-full max-w-md">
                <QrCodeLoginPanel
                  account={getLoginAccount()}
                  onClose={() => setLoginAccountId(null)}
                  onLoginSuccess={() => {
                    const account = getLoginAccount();
                    if (account) {
                      updatePlatformAccount(account.id, { status: 'online' });
                    }
                    setLoginAccountId(null);
                  }}
                />
              </div>
            </div>
          );
        }

        return (
          <div className="flex h-full gap-4">
            {/* Left: Conversation List */}
            <div className={cn(
              "transition-all duration-300",
              isMobile ? "w-full" : "w-80 flex-shrink-0"
            )}>
              <ConversationList onFilterClick={() => setShowFilterPanel(true)} />
            </div>

            {/* Middle: Chat Interface */}
            {!isMobile && (
              <div className="flex-1 min-w-0">
                <ChatInterface
                  onToggleProfile={() => setActiveRightPanel(activeRightPanel === 'ai-profile' ? null : 'ai-profile')}
                />
              </div>
            )}

            {/* Right: Panels (before menu bar) */}
            {!isMobile && activeRightPanel && (
              <div className="w-80 flex-shrink-0 transition-all duration-300">
                {activeRightPanel === 'ai-profile' && (
                  <CustomerAIProfile onClose={() => setActiveRightPanel(null)} />
                )}
                {activeRightPanel === 'proxy' && (
                  <ProxySettings onClose={() => setActiveRightPanel(null)} />
                )}
                {activeRightPanel === 'translation' && (
                  <TranslationSettings onClose={() => setActiveRightPanel(null)} />
                )}
                {activeRightPanel === 'contact' && (
                  <ContactList onClose={() => setActiveRightPanel(null)} />
                )}
              </div>
            )}

            {/* Right: Menu Bar */}
            {!isMobile && (
              <RightMenuBar
                activePanel={activeRightPanel}
                onPanelChange={setActiveRightPanel}
              />
            )}
          </div>
        );
      case 'customers':
        return <CustomersView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex h-screen bg-[#F4F4F4] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobile && showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "transition-all duration-300 z-50",
        isMobile ? (
          showMobileSidebar 
            ? "fixed left-0 top-0 h-full" 
            : "fixed -left-64 top-0 h-full"
        ) : "relative"
      )}>
        <Sidebar
          activeSection={activeSection}
          onSectionChange={(section) => {
            setActiveSection(section);
            setShowMobileSidebar(false);
          }}
          onLogout={handleLogout}
          onOpenAdminCenter={() => setShowAdminCenter(true)}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            )}

            <h1 className="text-lg font-semibold text-gray-900 flex-shrink-0">
              {activeSection === 'dashboard' && '概览'}
              {activeSection === 'conversations' && '会话管理'}
              {activeSection === 'customers' && '客户管理'}
              {activeSection === 'analytics' && '数据分析'}
              {activeSection === 'settings' && '设置'}
            </h1>

            {/* 待处理会话快速切换 - 仅在会话管理页面显示，登录时隐藏 */}
            {activeSection === 'conversations' && !loginAccountId && (() => {
              const pendingConversations = allConversations.filter(
                c => c.unreadCount > 0 || c.status === 'pending'
              );
              const currentIndex = pendingConversations.findIndex(c => c.id === selectedConversationId);

              const handlePrev = () => {
                if (pendingConversations.length === 0) return;
                const newIndex = currentIndex <= 0 ? pendingConversations.length - 1 : currentIndex - 1;
                setSelectedConversation(pendingConversations[newIndex].id);
              };

              const handleNext = () => {
                if (pendingConversations.length === 0) return;
                const newIndex = currentIndex >= pendingConversations.length - 1 ? 0 : currentIndex + 1;
                setSelectedConversation(pendingConversations[newIndex].id);
              };

              if (pendingConversations.length === 0) return null;

              const pendingIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
                MessageCircle, Send, MessageSquare, Instagram, Facebook,
                Mail, Smartphone, Music, Twitter, ShoppingBag,
              };

              const getPlatformInfo = (platform: string) => {
                const config = platformConfigs.find(p => p.id === platform);
                const PIcon = config ? pendingIconMap[config.icon] || MessageCircle : MessageCircle;
                return { PIcon, pColor: config?.color || '#666' };
              };

              const MAX_VISIBLE = 16;

              return (
                <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-medium text-amber-600">待处理</span>
                    <span className="px-1.5 py-0.5 text-xs font-semibold bg-amber-500 text-white rounded-full">
                      {pendingConversations.length}
                    </span>
                  </div>

                  {/* 头像列表 - 重叠显示 */}
                  <div className="flex items-center overflow-x-auto scrollbar-hide">
                    {pendingConversations.slice(0, MAX_VISIBLE).map((conv, index) => {
                      const { PIcon, pColor } = getPlatformInfo(conv.platform);
                      return (
                        <button
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv.id)}
                          className="relative flex-shrink-0 transition-all duration-200 hover:scale-110 hover:z-10"
                          style={{ marginLeft: index === 0 ? 0 : '-6px', zIndex: MAX_VISIBLE - index }}
                          title={conv.customer.name}
                        >
                          <img
                            src={conv.customer.avatar}
                            alt={conv.customer.name}
                            className={cn(
                              "w-7 h-7 rounded-full object-cover border-2 border-white hover:border-amber-300 transition-all shadow-sm",
                              index >= MAX_VISIBLE - 3 && "opacity-60"
                            )}
                          />
                          <div
                            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white"
                            style={{ backgroundColor: pColor }}
                          >
                            <PIcon className="w-2 h-2 text-white" />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* 超过MAX_VISIBLE个时显示更多数量 */}
                  {pendingConversations.length > MAX_VISIBLE && (
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => setShowMorePending(!showMorePending)}
                        className="w-7 h-7 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center hover:bg-amber-200 hover:border-amber-400 transition-colors cursor-pointer"
                        title={`还有 ${pendingConversations.length - MAX_VISIBLE} 个待处理会话`}
                      >
                        <span className="text-[10px] font-bold text-amber-700">
                          +{pendingConversations.length - MAX_VISIBLE}
                        </span>
                      </button>
                      {/* 下拉列表 */}
                      {showMorePending && (
                        <>
                          {/* 点击外部关闭 */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowMorePending(false)}
                          />
                          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
                            <div className="px-3 py-2 border-b border-gray-100">
                              <span className="text-xs font-medium text-gray-500">
                                更多待处理会话 ({pendingConversations.length - MAX_VISIBLE})
                              </span>
                            </div>
                            {pendingConversations.slice(MAX_VISIBLE).map((conv) => {
                              const { PIcon, pColor } = getPlatformInfo(conv.platform);
                              return (
                              <button
                                key={conv.id}
                                onClick={() => {
                                  setSelectedConversation(conv.id);
                                  setShowMorePending(false);
                                }}
                                className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                              >
                                <div className="relative flex-shrink-0">
                                  <img
                                    src={conv.customer.avatar}
                                    alt={conv.customer.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <div
                                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white"
                                    style={{ backgroundColor: pColor }}
                                  >
                                    <PIcon className="w-2 h-2 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {conv.customer.name}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {conv.lastMessage?.content || '暂无消息'}
                                  </p>
                                </div>
                              </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* 导航按钮 */}
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={handlePrev}
                      className="p-1 hover:bg-amber-100 rounded transition-colors"
                      title="上一个"
                    >
                      <ChevronLeft className="w-4 h-4 text-amber-600" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-1 hover:bg-amber-100 rounded transition-colors"
                      title="下一个"
                    >
                      <ChevronRight className="w-4 h-4 text-amber-600" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Search - 登录时隐藏 */}
            {activeSection === 'conversations' && !loginAccountId && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 w-48"
                  />
                </div>
                {/* 全局筛选按钮 */}
                <button
                  onClick={() => setShowFilterPanel(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                  title="全局筛选"
                >
                  <SlidersHorizontal className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            )}
            
            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-medium bg-red-500 text-white rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-hidden p-4">
          {renderMainContent()}
        </main>
      </div>
      
      {/* Filter Panel */}
      <FilterPanel
        isOpen={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
      />
    </div>
  );
}

// QR Code Login Panel - 扫码登录界面
function QrCodeLoginPanel({
  account,
  onClose,
  onLoginSuccess
}: {
  account: ReturnType<typeof useStore.getState>['platformAccounts'][0] | undefined;
  onClose: () => void;
  onLoginSuccess: () => void;
}) {
  if (!account) return null;

  const platformConfig = platformConfigs.find(p => p.id === account.platformId);
  const PlatformIcon = platformConfig?.icon || 'MessageCircle';

  // 获取平台图标组件
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    MessageCircle,
    Send,
  };
  const Icon = iconMap[PlatformIcon] || MessageCircle;

  return (
    <div className="h-full bg-white flex flex-col">
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">未登录</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="关闭"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* 账号信息卡片 */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <img
            src={account.avatar}
            alt={account.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900">{account.name}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span style={{ color: platformConfig?.color }}>{platformConfig?.name}</span>
              <span>-</span>
              <span>(本机)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 扫码区域 */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* 二维码 */}
        <div className="relative mb-6">
          <div className="w-64 h-64 bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center relative">
              <QrCode className="w-48 h-48 text-gray-800" />
              {/* 平台图标在中间 */}
              <div
                className="absolute w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: platformConfig?.color || '#FF6B35' }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* 标题 */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          扫码登录 {platformConfig?.name}
        </h2>

        {/* 步骤说明 */}
        <div className="space-y-4 text-left max-w-sm">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
              1
            </span>
            <span className="text-gray-700">在您的手机上打开 {platformConfig?.name}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
              2
            </span>
            <span className="text-gray-700">
              Go to <span className="font-medium">Settings</span> {'>'} <span className="font-medium">Devices</span> {'>'} <span className="font-medium">Link Desktop Device</span>
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
              3
            </span>
            <span className="text-gray-700">点击手机屏幕确认登录</span>
          </div>
        </div>

        {/* 底部链接 */}
        <div className="mt-8 space-y-3 text-center">
          <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
            手机号登录
          </button>
          <div>
            <button
              onClick={onLoginSuccess}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium uppercase tracking-wide"
            >
              模拟登录成功
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard View
function DashboardView() {
  const { conversations, getFilteredConversations, aiStats, organization, platformAccounts } = useStore();
  const stats = {
    total: conversations.length,
    active: conversations.filter(c => c.status === 'active').length,
    pending: conversations.filter(c => c.status === 'pending').length,
    resolved: conversations.filter(c => c.status === 'resolved').length,
    unread: conversations.reduce((sum, c) => sum + c.unreadCount, 0),
  };
  
  const recentConversations = getFilteredConversations().slice(0, 5);
  
  // AI状态配置
  const aiStatusConfig = {
    online: { text: '在线', color: 'bg-green-500', dotColor: 'bg-green-400' },
    offline: { text: '离线', color: 'bg-gray-500', dotColor: 'bg-gray-400' },
    busy: { text: '忙碌', color: 'bg-red-500', dotColor: 'bg-red-400' },
    pause: { text: '暂停', color: 'bg-amber-500', dotColor: 'bg-amber-400' },
  };
  const aiStatus = aiStatusConfig[aiStats.status];
  
  return (
    <div className="h-full overflow-y-auto space-y-6">
      {/* 订阅套餐信息 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">订阅信息</h3>
          <button className="px-3 py-1.5 text-xs font-medium bg-[#FF6B35] text-white rounded-lg hover:bg-[#E85A2A] transition-colors">
            续费套餐
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* 当前套餐 */}
          <div className="p-3 bg-gradient-to-br from-[#FF6B35]/10 to-orange-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-xs text-gray-500">当前套餐</span>
            </div>
            <p className="text-sm font-bold text-gray-900">专业版</p>
          </div>
          {/* 到期时间 */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">到期时间</span>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {organization.expiresAt instanceof Date
                ? organization.expiresAt.toLocaleDateString('zh-CN')
                : organization.expiresAt || '2026-12-31'}
            </p>
          </div>
          {/* 激活码 */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Key className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">激活码</span>
            </div>
            <p className="text-sm font-bold text-gray-900 truncate" title={organization.activationCode}>
              {organization.activationCode}
            </p>
          </div>
          {/* 会话端口 */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">会话端口</span>
            </div>
            <p className="text-sm font-bold text-gray-900">
              <span className="text-[#FF6B35]">{platformAccounts.filter(a => a.status === 'online').length}</span>
              <span className="text-gray-400 mx-0.5">/</span>
              <span>10</span>
            </p>
          </div>
          {/* AI绑定账号 */}
          <div className="p-3 bg-purple-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-gray-500">AI绑定</span>
            </div>
            <p className="text-sm font-bold text-purple-700">
              {platformAccounts.filter(a => a.aiEnabled).length} 个账号
            </p>
          </div>
          {/* 组织名称 */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">组织</span>
            </div>
            <p className="text-sm font-bold text-gray-900 truncate" title={organization.name}>
              {organization.name}
            </p>
          </div>
        </div>
      </div>

      {/* AI客服状态卡片 */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] rounded-xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className={cn("absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#FF6B35]", aiStatus.dotColor)} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">AI智能客服</h2>
                <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full bg-white/20")}>
                  {aiStatus.text}
                </span>
              </div>
              <p className="text-sm text-white/70 mt-0.5">
                今日已接待 <span className="font-semibold text-white">{aiStats.today.customersServed}</span> 位客户，
                回复 <span className="font-semibold text-white">{aiStats.today.messagesReplied}</span> 条消息
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{aiStats.realtime.currentChats}</p>
              <p className="text-xs text-white/70">当前对话</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">{aiStats.realtime.queueLength}</p>
              <p className="text-xs text-white/70">排队人数</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">{aiStats.today.satisfactionRate}%</p>
              <p className="text-xs text-white/70">满意度</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards - 今日数据统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 今日总会话 - 带历史对比 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-[#FF6B35]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500">今日总会话</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-[#FF6B35]" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-gray-400">昨日</span>
              <span className="font-medium text-gray-600">28</span>
            </div>
            <div className="w-px h-3 bg-gray-200" />
            <div className="flex items-center gap-1">
              <span className="text-gray-400">近7日</span>
              <span className="font-medium text-gray-600">186</span>
            </div>
            <div className="w-px h-3 bg-gray-200" />
            <div className="flex items-center gap-1">
              <span className="text-gray-400">近30日</span>
              <span className="font-medium text-gray-600">742</span>
            </div>
          </div>
        </div>

        {/* 今日未读 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">今日未读</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.unread}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>

        {/* 今日未回复 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">今日未回复</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>
      
      {/* AI今日数据 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">AI客服今日数据</h3>
          <span className="text-xs text-gray-400">{new Date().toLocaleDateString('zh-CN')}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: '接待人数', value: aiStats.today.customersServed, icon: Users, color: 'text-[#FF6B35]', bgColor: 'bg-[#FF6B35]/10' },
            { name: '回复消息', value: aiStats.today.messagesReplied, icon: MessageCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
            { name: 'AI生成回复', value: aiStats.today.aiGeneratedReplies, icon: Sparkles, color: 'text-purple-600', bgColor: 'bg-purple-100' },
            { name: '平均响应', value: `${aiStats.today.avgResponseTime}s`, icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100' },
            { name: '翻译次数', value: aiStats.today.translationCount, icon: Languages, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className={cn("w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center", stat.bgColor)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* 两列布局：最近会话 + AI使用统计 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">最近会话</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentConversations.map((conv) => (
              <div key={conv.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <img
                  src={conv.customer.avatar}
                  alt={conv.customer.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{conv.customer.name}</p>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(conv.updatedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* AI使用统计 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">AI使用统计</h3>
          </div>
          <div className="p-4 space-y-4">
            {/* 采纳率进度条 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">AI建议采纳率</span>
                <span className="text-sm font-semibold text-[#FF6B35]">{aiStats.aiUsage.adoptionRate}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] rounded-full transition-all duration-500"
                  style={{ width: `${aiStats.aiUsage.adoptionRate}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                共生成 {aiStats.aiUsage.totalSuggestions} 条建议，采纳 {aiStats.aiUsage.adoptedSuggestions} 条
              </p>
            </div>
            
            {/* 回复类型分布 */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">AI自动回复</span>
                </div>
                <p className="text-2xl font-bold text-purple-700">{aiStats.aiUsage.autoReplies}</p>
                <p className="text-xs text-purple-500">占比 {Math.round(aiStats.aiUsage.autoReplies / (aiStats.aiUsage.autoReplies + aiStats.aiUsage.manualReplies) * 100)}%</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">人工回复</span>
                </div>
                <p className="text-2xl font-bold text-blue-700">{aiStats.aiUsage.manualReplies}</p>
                <p className="text-xs text-blue-500">占比 {Math.round(aiStats.aiUsage.manualReplies / (aiStats.aiUsage.autoReplies + aiStats.aiUsage.manualReplies) * 100)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-4">平台分布</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {['whatsapp', 'telegram', 'line', 'instagram', 'wechat', 'email'].map((platformId) => {
            const count = conversations.filter(c => c.platform === platformId).length;
            const platform = platformConfigs.find(p => p.id === platformId);
            return (
              <div key={platformId} className="text-center">
                <div 
                  className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${platform?.color}20` }}
                >
                  <span style={{ color: platform?.color }} className="text-lg font-bold">
                    {count}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{platform?.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Customers View - 客户明细
function CustomersView() {
  const { conversations } = useStore();
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'account' | 'nickname' | 'tag' | 'remark'>('nickname');
  const [showSearchTypeDropdown, setShowSearchTypeDropdown] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '2026-01-05', end: '2026-02-05' });
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);

  // 从会话中提取客户并关联平台信息 - 使用 useMemo 缓存避免重复生成随机数据
  const customers = useMemo(() => conversations.map((c, index) => ({
    ...c.customer,
    platform: c.platform,
    accountId: (c as unknown as Record<string, unknown>).accountId as string || '5726930093',
    fanId: (1000000000 + index * 123456789 % 9000000000).toString(),
    addedAt: c.lastMessage?.timestamp || new Date(),
    remark: '',
  })), [conversations]);

  // 搜索类型选项
  const searchTypeOptions = [
    { value: 'account' as const, label: '客户账号' },
    { value: 'nickname' as const, label: '客户昵称' },
    { value: 'tag' as const, label: '客户标签' },
    { value: 'remark' as const, label: '客户备注' },
  ];

  // 筛选客户 - 支持按类型搜索，多值用逗号分隔
  const filteredCustomers = customers.filter(c => {
    if (selectedPlatform !== 'all' && c.platform !== selectedPlatform) return false;
    if (searchQuery) {
      // 支持逗号分隔的多值搜索
      const queries = searchQuery.split(',').map(q => q.trim().toLowerCase()).filter(q => q);
      if (queries.length === 0) return true;

      // 根据搜索类型匹配
      const matchAny = queries.some(query => {
        switch (searchType) {
          case 'account':
            return c.fanId?.toLowerCase().includes(query) || c.accountId?.toLowerCase().includes(query);
          case 'nickname':
            return c.name.toLowerCase().includes(query);
          case 'tag':
            return c.tags?.some(tag => tag.toLowerCase().includes(query));
          case 'remark':
            return c.remark?.toLowerCase().includes(query);
          default:
            return false;
        }
      });
      if (!matchAny) return false;
    }
    return true;
  });

  const platformOptions = [
    { value: 'all', label: '全部平台' },
    { value: 'telegram', label: 'Telegram', color: '#0088CC' },
    { value: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
    { value: 'line', label: 'Line', color: '#06C755' },
    { value: 'instagram', label: 'Instagram', color: '#E4405F' },
    { value: 'facebook', label: 'Facebook', color: '#1877F2' },
    { value: 'wechat', label: '微信', color: '#07C160' },
  ];

  const getPlatformIcon = (platform: string) => {
    const config = platformConfigs.find(p => p.id === platform);
    return config?.color || '#666';
  };

  return (
    <div className="h-full overflow-y-auto space-y-4">
      {/* 页面标题 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold text-gray-900">客户明细</h2>
      </div>

      {/* 筛选区域 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="grid grid-cols-4 gap-6">
          {/* 社交渠道 */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 whitespace-nowrap">社交渠道</span>
            <div className="relative flex-1">
              <button
                onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between hover:border-gray-300"
              >
                <span>{platformOptions.find(p => p.value === selectedPlatform)?.label}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {showPlatformDropdown && (
                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  {platformOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSelectedPlatform(opt.value); setShowPlatformDropdown(false); }}
                      className={cn(
                        "w-full px-3 py-2 text-sm text-left hover:bg-gray-50",
                        selectedPlatform === opt.value && "bg-[#FF6B35]/5 text-[#FF6B35]"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 社交账号 */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 whitespace-nowrap">社交账号</span>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
            >
              <option value="">请选择社交账号</option>
              <option value="5726930093">5726930093</option>
            </select>
          </div>

          {/* 客户搜索 - 先选类型再输入 */}
          <div className="flex items-center gap-2 col-span-2">
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowSearchTypeDropdown(!showSearchTypeDropdown)}
                className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm text-left flex items-center justify-between hover:border-gray-300 whitespace-nowrap"
              >
                <span>{searchTypeOptions.find(t => t.value === searchType)?.label}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-1" />
              </button>
              {showSearchTypeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  {searchTypeOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSearchType(opt.value); setShowSearchTypeDropdown(false); }}
                      className={cn(
                        "w-full px-3 py-2 text-sm text-left hover:bg-gray-50 whitespace-nowrap",
                        searchType === opt.value && "bg-[#FF6B35]/5 text-[#FF6B35]"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="多个用英文逗号隔开"
              className="w-48 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
            />
          </div>
        </div>

        {/* 第二行筛选 */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">添加时间</span>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
            />
            <span className="text-gray-400">~</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
            />
          </div>

          <button className="px-6 py-2 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-[#E85A2A] transition-colors">
            查询
          </button>
          <button className="px-6 py-2 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            重置
          </button>
        </div>
      </div>

      {/* 客户列表表格 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">社交账号</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">客户信息</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">客户手机号</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">国家/地区</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">昵称备注</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">客户标签</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">添加时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer, index) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm text-gray-600">{index + 1}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${getPlatformIcon(customer.platform)}20` }}
                      >
                        <User className="w-4 h-4" style={{ color: getPlatformIcon(customer.platform) }} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.accountId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.fanId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{customer.phone || '-'}</td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900">{customer.country || '-'}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">-</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {customer.tags?.slice(0, 2).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-[#FF6B35]/10 text-[#FF6B35] rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {customer.addedAt instanceof Date
                      ? customer.addedAt.toLocaleString('zh-CN', {
                          year: 'numeric', month: '2-digit', day: '2-digit',
                          hour: '2-digit', minute: '2-digit', second: '2-digit'
                        })
                      : '-'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">共 {filteredCustomers.length} 条记录</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">上一页</button>
            <button className="px-3 py-1.5 bg-[#FF6B35] text-white rounded text-sm">1</button>
            <button className="px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Insight Card Component
function InsightCard({ icon: Icon, title, value, desc, color }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  desc: string;
  color: 'emerald' | 'blue' | 'rose';
}) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-600',
      value: 'text-emerald-700'
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      value: 'text-blue-700'
    },
    rose: {
      bg: 'bg-rose-100',
      text: 'text-rose-600',
      value: 'text-rose-700'
    }
  };
  const colors = colorMap[color];

  return (
    <div className="bg-white/60 rounded-xl p-4 flex items-center gap-3">
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.bg)}>
        <Icon className={cn("w-5 h-5", colors.text)} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className={cn("text-xl font-bold", colors.value)}>{value}</p>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
    </div>
  );
}

// Analytics View
function AnalyticsView() {
  const { aiStats } = useStore();

  return (
    <div className="h-full overflow-y-auto space-y-6">
      {/* AI客服核心指标 - 渐变卡片风格 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            name: '今日接待',
            value: aiStats.today.customersServed,
            change: `+${Math.round((aiStats.today.customersServed - aiStats.dailyTrend[5].customers) / aiStats.dailyTrend[5].customers * 100)}%`,
            icon: Users,
            gradient: 'from-blue-500 to-indigo-600',
            bgLight: 'from-blue-50 to-indigo-50'
          },
          {
            name: 'AI回复数',
            value: aiStats.today.aiGeneratedReplies,
            change: `+${Math.round((aiStats.today.aiGeneratedReplies - aiStats.dailyTrend[5].aiReplies) / aiStats.dailyTrend[5].aiReplies * 100)}%`,
            icon: Sparkles,
            gradient: 'from-violet-500 to-purple-600',
            bgLight: 'from-violet-50 to-purple-50'
          },
          {
            name: '平均响应',
            value: `${aiStats.today.avgResponseTime}s`,
            change: '-3s',
            icon: Clock,
            gradient: 'from-emerald-500 to-teal-600',
            bgLight: 'from-emerald-50 to-teal-50'
          },
          {
            name: '满意度',
            value: `${aiStats.today.satisfactionRate}%`,
            change: '+2.3%',
            icon: ThumbsUp,
            gradient: 'from-amber-500 to-orange-600',
            bgLight: 'from-amber-50 to-orange-50'
          },
        ].map((stat, i) => (
          <div key={i} className={cn("rounded-xl p-5 shadow-sm bg-gradient-to-br border", stat.bgLight, "border-white/50")}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={cn(
                  "text-xs mt-1 font-medium",
                  stat.change.startsWith('+') ? "text-emerald-600" :
                  stat.change.startsWith('-') && stat.name === '平均响应' ? "text-emerald-600" : "text-red-500"
                )}>
                  {stat.change} 较昨日
                </p>
              </div>
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg", stat.gradient)}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI智能洞察 */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl shadow-sm p-5 border border-amber-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-gray-900">AI智能洞察</h3>
          </div>
          <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-lg">实时分析</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard
            icon={Target}
            title="转化机会"
            value="12"
            desc="高意向客户待跟进"
            color="emerald"
          />
          <InsightCard
            icon={Zap}
            title="效率提升"
            value="+23%"
            desc="AI辅助后响应速度"
            color="blue"
          />
          <InsightCard
            icon={AlertTriangle}
            title="风险预警"
            value="3"
            desc="客户流失风险提醒"
            color="rose"
          />
        </div>
      </div>

      {/* 本周汇总 - 渐变背景 */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-gray-900">本周汇总</h3>
          </div>
          <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-lg">{new Date().toLocaleDateString('zh-CN')} 为止</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: '接待人数', value: aiStats.weekly.customersServed, unit: '人', color: 'text-blue-600' },
            { name: '回复消息', value: aiStats.weekly.messagesReplied, unit: '条', color: 'text-indigo-600' },
            { name: 'AI生成回复', value: aiStats.weekly.aiGeneratedReplies, unit: '条', color: 'text-violet-600' },
            { name: '翻译次数', value: aiStats.weekly.translationCount, unit: '次', color: 'text-cyan-600' },
            { name: '平均响应', value: `${aiStats.weekly.avgResponseTime}s`, unit: '', color: 'text-emerald-600' },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 bg-white rounded-xl shadow-sm">
              <p className={cn("text-2xl font-bold", item.color)}>{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.name} {item.unit}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI接待效果 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">AI接待效果</h3>
            </div>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">本周数据</span>
          </div>

          <div className="space-y-4">
            {/* AI接待率 */}
            <div className="bg-white/60 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">AI接待率</span>
                <span className="text-lg font-bold text-blue-600">78%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[78%] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
              </div>
              <p className="text-xs text-gray-400 mt-1">AI独立处理 312 / 总接待 400</p>
            </div>

            {/* AI回复采纳率 */}
            <div className="bg-white/60 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">AI回复采纳率</span>
                <span className="text-lg font-bold text-emerald-600">{aiStats.aiUsage.adoptionRate}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  style={{ width: `${aiStats.aiUsage.adoptionRate}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">采纳 {aiStats.aiUsage.adoptedSuggestions} / 生成 {aiStats.aiUsage.totalSuggestions}</p>
            </div>

            {/* 客户满意度 */}
            <div className="bg-white/60 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">客户满意度</span>
                <span className="text-lg font-bold text-violet-600">{aiStats.today.satisfactionRate}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                  style={{ width: `${aiStats.today.satisfactionRate}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">好评 186 / 总评价 200</p>
            </div>
          </div>

          {/* 底部统计 */}
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">AI解决问题数</span>
              </div>
              <span className="text-xl font-bold">286</span>
            </div>
          </div>
        </div>
        
        {/* 地区数据分布 */}
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 shadow-sm border border-cyan-100">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-cyan-600" />
            <h3 className="font-semibold text-gray-900">客户地区分布</h3>
          </div>
          <div className="space-y-3 bg-white/50 rounded-xl p-4">
            {[
              { region: '北美', flag: '🇺🇸', count: 156, percent: 35, color: 'from-blue-500 to-blue-600' },
              { region: '欧洲', flag: '🇪🇺', count: 112, percent: 25, color: 'from-emerald-500 to-emerald-600' },
              { region: '东南亚', flag: '🌏', count: 89, percent: 20, color: 'from-amber-500 to-amber-600' },
              { region: '中东', flag: '🇦🇪', count: 45, percent: 10, color: 'from-violet-500 to-violet-600' },
              { region: '其他', flag: '🌐', count: 44, percent: 10, color: 'from-gray-400 to-gray-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.flag}</span>
                    <span className="text-sm font-medium text-gray-700">{item.region}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{item.count} 人</span>
                    <span className="text-sm font-bold text-gray-900">{item.percent}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r", item.color)}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 总客户数 */}
          <div className="mt-4 p-4 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-white" />
                <span className="text-sm text-white/90">本周新增客户</span>
              </div>
              <span className="text-2xl font-bold text-white">446</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI回复效果分析 - 渐变背景 */}
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl shadow-sm p-6 border border-violet-100">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <h3 className="font-semibold text-gray-900">AI回复效果分析</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 采纳率 */}
          <div className="flex items-center gap-4 bg-white/60 rounded-xl p-4">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#gradient1)"
                  strokeWidth="10"
                  strokeDasharray={`${aiStats.aiUsage.adoptionRate * 2.51} 251`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-violet-700">{aiStats.aiUsage.adoptionRate}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">AI建议采纳率</p>
              <p className="text-xs text-gray-500 mt-1">
                生成 {aiStats.aiUsage.totalSuggestions} 条
              </p>
              <p className="text-xs text-gray-500">
                采纳 {aiStats.aiUsage.adoptedSuggestions} 条
              </p>
            </div>
          </div>
          
          {/* 回复类型对比 */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">回复类型分布</span>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-purple-500" />
                  <span className="text-gray-500">AI自动</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-gray-500">人工</span>
                </div>
              </div>
            </div>
            <div className="h-8 bg-gray-100 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-purple-500 flex items-center justify-center text-xs text-white font-medium"
                style={{ 
                  width: `${aiStats.aiUsage.autoReplies / (aiStats.aiUsage.autoReplies + aiStats.aiUsage.manualReplies) * 100}%` 
                }}
              >
                {aiStats.aiUsage.autoReplies}
              </div>
              <div 
                className="h-full bg-blue-500 flex items-center justify-center text-xs text-white font-medium"
                style={{ 
                  width: `${aiStats.aiUsage.manualReplies / (aiStats.aiUsage.autoReplies + aiStats.aiUsage.manualReplies) * 100}%` 
                }}
              >
                {aiStats.aiUsage.manualReplies}
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>AI自动回复占比 {Math.round(aiStats.aiUsage.autoReplies / (aiStats.aiUsage.autoReplies + aiStats.aiUsage.manualReplies) * 100)}%</span>
              <span>人工回复占比 {Math.round(aiStats.aiUsage.manualReplies / (aiStats.aiUsage.autoReplies + aiStats.aiUsage.manualReplies) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 平台分布 - 渐变背景 */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl shadow-sm p-6 border border-rose-100">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5 text-rose-600" />
          <h3 className="font-semibold text-gray-900">每日消息趋势</h3>
        </div>
        <div className="h-48 flex items-end justify-between gap-3 bg-white/50 rounded-xl p-4">
          {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
            <div
              key={i}
              className="flex-1 h-full flex items-end"
            >
              <div
                className="w-full bg-gradient-to-t from-rose-500 to-pink-400 rounded-t-lg transition-all duration-500 shadow-sm"
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-xs text-gray-500 font-medium">
          <span>周一</span>
          <span>周二</span>
          <span>周三</span>
          <span>周四</span>
          <span>周五</span>
          <span>周六</span>
          <span>周日</span>
        </div>
      </div>

      {/* 客户画像分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 客户等级分布 */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm p-6 border border-indigo-100">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">客户等级分布</h3>
          </div>
          <div className="space-y-3">
            {[
              { level: 'A级', count: 28, percent: 15, color: 'from-emerald-500 to-emerald-600' },
              { level: 'B级', count: 56, percent: 30, color: 'from-blue-500 to-blue-600' },
              { level: 'C级', count: 74, percent: 40, color: 'from-amber-500 to-amber-600' },
              { level: 'D级', count: 28, percent: 15, color: 'from-gray-400 to-gray-500' },
            ].map((item, i) => (
              <div key={i} className="bg-white/60 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.level}</span>
                  <span className="text-sm text-gray-500">{item.count}人 ({item.percent}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r", item.color)}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 意向产品TOP5 */}
        <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 rounded-xl shadow-sm p-6 border border-fuchsia-100">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-fuchsia-600" />
            <h3 className="font-semibold text-gray-900">意向产品TOP5</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: '智能手表Pro', count: 45, percent: 100 },
              { name: '无线耳机Max', count: 38, percent: 84 },
              { name: '便携充电宝', count: 32, percent: 71 },
              { name: '蓝牙音箱', count: 28, percent: 62 },
              { name: '智能手环', count: 22, percent: 49 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                  i === 0 ? "bg-gradient-to-br from-amber-400 to-amber-500" :
                  i === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400" :
                  i === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700" :
                  "bg-gray-300"
                )}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    <span className="text-sm text-fuchsia-600 font-semibold">{item.count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings View
function SettingsView() {
  const { userSettings, updateUserSettings } = useStore();
  
  const languages = [
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];
  
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 个人设置 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">个人设置</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={userSettings.avatar}
                alt={userSettings.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">{userSettings.name}</p>
                <p className="text-sm text-gray-500">{userSettings.email}</p>
              </div>
              <button className="ml-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                更换头像
              </button>
            </div>
            
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">显示名称</label>
                <input 
                  type="text" 
                  defaultValue={userSettings.name}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">邮箱</label>
                <input 
                  type="email" 
                  defaultValue={userSettings.email}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* 翻译设置 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">翻译设置</h3>
          </div>
          <div className="p-4 space-y-4">
            {/* 翻译总开关 */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">启用翻译</p>
                <p className="text-sm text-gray-500">自动翻译客户消息和发送的消息</p>
              </div>
              <button 
                onClick={() => updateUserSettings({
                  preferences: {
                    ...userSettings.preferences,
                    translation: {
                      ...userSettings.preferences.translation,
                      enabled: !userSettings.preferences.translation.enabled
                    }
                  }
                })}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  userSettings.preferences.translation.enabled ? "bg-[#FF6B35]" : "bg-gray-200"
                )}
              >
                <span className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  userSettings.preferences.translation.enabled ? "left-7" : "left-1"
                )} />
              </button>
            </div>
            
            {/* 接收消息翻译语言 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                接收消息翻译为
                <span className="text-xs text-gray-400 ml-2">客户消息将自动翻译为此语言</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => updateUserSettings({
                      preferences: {
                        ...userSettings.preferences,
                        translation: {
                          ...userSettings.preferences.translation,
                          receiveLanguage: lang.code
                        }
                      }
                    })}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all",
                      userSettings.preferences.translation.receiveLanguage === lang.code
                        ? "border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35]"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* 发送消息翻译语言 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                发送消息翻译为
                <span className="text-xs text-gray-400 ml-2">您的消息将自动翻译为此语言发送给客户</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => updateUserSettings({
                      preferences: {
                        ...userSettings.preferences,
                        translation: {
                          ...userSettings.preferences.translation,
                          sendLanguage: lang.code
                        }
                      }
                    })}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all",
                      userSettings.preferences.translation.sendLanguage === lang.code
                        ? "border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35]"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* AI设置 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">AI设置</h3>
          </div>
          <div className="p-4 space-y-4">
            {/* AI总开关 */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">启用AI功能</p>
                <p className="text-sm text-gray-500">开启AI辅助客服功能</p>
              </div>
              <button 
                onClick={() => updateUserSettings({
                  preferences: {
                    ...userSettings.preferences,
                    ai: {
                      ...userSettings.preferences.ai,
                      enabled: !userSettings.preferences.ai.enabled
                    }
                  }
                })}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  userSettings.preferences.ai.enabled ? "bg-[#FF6B35]" : "bg-gray-200"
                )}
              >
                <span className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  userSettings.preferences.ai.enabled ? "left-7" : "left-1"
                )} />
              </button>
            </div>
            
            {/* AI自动回复（接管） */}
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <p className="font-medium text-gray-900">AI客服接管</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">开启后AI将自动回复客户消息，无需人工干预</p>
              </div>
              <button 
                onClick={() => updateUserSettings({
                  preferences: {
                    ...userSettings.preferences,
                    ai: {
                      ...userSettings.preferences.ai,
                      autoReply: !userSettings.preferences.ai.autoReply
                    }
                  }
                })}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  userSettings.preferences.ai.autoReply ? "bg-amber-500" : "bg-gray-200"
                )}
              >
                <span className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  userSettings.preferences.ai.autoReply ? "left-7" : "left-1"
                )} />
              </button>
            </div>
            
            {/* AI回复建议 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">AI回复建议</p>
                <p className="text-sm text-gray-500">AI为您的回复提供智能建议</p>
              </div>
              <button 
                onClick={() => updateUserSettings({
                  preferences: {
                    ...userSettings.preferences,
                    ai: {
                      ...userSettings.preferences.ai,
                      suggestions: !userSettings.preferences.ai.suggestions
                    }
                  }
                })}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  userSettings.preferences.ai.suggestions ? "bg-[#FF6B35]" : "bg-gray-200"
                )}
              >
                <span className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  userSettings.preferences.ai.suggestions ? "left-7" : "left-1"
                )} />
              </button>
            </div>
            
            {/* AI自动总结 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">AI自动总结</p>
                <p className="text-sm text-gray-500">自动总结会话内容和客户画像</p>
              </div>
              <button 
                onClick={() => updateUserSettings({
                  preferences: {
                    ...userSettings.preferences,
                    ai: {
                      ...userSettings.preferences.ai,
                      summary: !userSettings.preferences.ai.summary
                    }
                  }
                })}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  userSettings.preferences.ai.summary ? "bg-[#FF6B35]" : "bg-gray-200"
                )}
              >
                <span className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  userSettings.preferences.ai.summary ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          </div>
        </div>
        
        {/* 通知设置 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">通知设置</h3>
          </div>
          <div className="p-4 space-y-4">
            {[
              { name: '新消息通知', desc: '收到新消息时发送通知', key: 'notifications' },
              { name: '声音提醒', desc: '播放提示音', key: 'soundEnabled' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <button 
                  onClick={() => updateUserSettings({
                    preferences: {
                      ...userSettings.preferences,
                      [item.key]: !userSettings.preferences[item.key as keyof typeof userSettings.preferences]
                    }
                  })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    userSettings.preferences[item.key as keyof typeof userSettings.preferences]
                      ? "bg-[#FF6B35]"
                      : "bg-gray-200"
                  )}
                >
                  <span className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                    userSettings.preferences[item.key as keyof typeof userSettings.preferences]
                      ? "left-7"
                      : "left-1"
                  )} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
