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
import { AccessGate } from '@/components/AccessGate';
import { platformConfigs } from '@/data/mockData';
import type { PlatformAccount, AIEmployeeConfig, ActivationCode } from '@/types';
import {
  MessageCircle,
  Search,
  Bell,
  Menu,
  Users,
  User,
  Sparkles,
  Clock,
  Languages,
  BarChart3,
  Lightbulb,
  Target,
  Zap,
  AlertTriangle,
  Bot,
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
  ShoppingBag,
  FileText,
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
  const [showAdminCenter, setShowAdminCenter] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('admin') === 'true';
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [activeSection, setActiveSection] = useState('dashboard');
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
        return <DashboardView onGoToConversations={() => setActiveSection('conversations')} />;
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
          onOpenProxy={() => setActiveRightPanel('proxy')}
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

              const MAX_VISIBLE = 8;

              return (
                <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FFF7F3] rounded-lg border border-[#FF6B35]/15">
                    <Inbox className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <span className="text-xs font-medium text-[#FF6B35]">待处理</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#FF6B35] text-white rounded-full min-w-[20px] text-center">
                      {pendingConversations.length}
                    </span>
                  </div>

                  {/* 头像列表 - 重叠显示 */}
                  <div className="flex items-center">
                    {pendingConversations.slice(0, MAX_VISIBLE).map((conv, index) => (
                        <button
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv.id)}
                          className="relative flex-shrink-0 transition-all duration-200 hover:scale-110 hover:z-10"
                          style={{ marginLeft: index === 0 ? 0 : '-4px', zIndex: MAX_VISIBLE - index }}
                          title={conv.customer.name}
                        >
                          <img
                            src={conv.customer.avatar}
                            alt={conv.customer.name}
                            className={cn(
                              "w-7 h-7 rounded-full object-cover border-2 border-white transition-all shadow-sm",
                              selectedConversationId === conv.id ? "border-[#FF6B35]" : "hover:border-[#FF6B35]/50"
                            )}
                          />
                        </button>
                    ))}
                  </div>

                  {/* 超过MAX_VISIBLE个时显示更多数量 */}
                  {pendingConversations.length > MAX_VISIBLE && (
                    <div className="relative flex-shrink-0" style={{ marginLeft: '-4px', zIndex: 0 }}>
                      <button
                        onClick={() => setShowMorePending(!showMorePending)}
                        className="w-7 h-7 rounded-full bg-[#FFF0E8] border-2 border-white flex items-center justify-center hover:bg-[#FFE0D0] transition-colors cursor-pointer shadow-sm"
                        title={`还有 ${pendingConversations.length - MAX_VISIBLE} 个待处理会话`}
                      >
                        <span className="text-[10px] font-bold text-[#FF6B35]">
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
                      className="p-1 hover:bg-[#FFF0E8] rounded transition-colors"
                      title="上一个"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-400 hover:text-[#FF6B35]" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-1 hover:bg-[#FFF0E8] rounded transition-colors"
                      title="下一个"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400 hover:text-[#FF6B35]" />
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

// 时区友好名称映射
function getTimezoneLabel(tz: string): string {
  const map: Record<string, string> = {
    'America/New_York': '纽约时间 UTC-5',
    'America/Los_Angeles': '洛杉矶时间 UTC-8',
    'America/Chicago': '芝加哥时间 UTC-6',
    'Europe/London': '伦敦时间 UTC+0',
    'Europe/Paris': '巴黎时间 UTC+1',
    'Asia/Shanghai': '北京时间 UTC+8',
    'Asia/Tokyo': '东京时间 UTC+9',
    'Asia/Seoul': '首尔时间 UTC+9',
    'Asia/Singapore': '新加坡时间 UTC+8',
    'Asia/Dubai': '迪拜时间 UTC+4',
    'Australia/Sydney': '悉尼时间 UTC+11',
    'Pacific/Auckland': '奥克兰时间 UTC+12',
  };
  return map[tz] || tz;
}

// AI员工绑定页面
function AIBindingPage({ platformAccounts, aiEmployeeConfig, iconMap, onBack, onGoToConversations, onToggleAI, activationCode, orgAiSeats }: {
  platformAccounts: PlatformAccount[];
  aiEmployeeConfig: AIEmployeeConfig | null;
  iconMap: Record<string, React.ComponentType<{ className?: string }>>;
  onBack: () => void;
  onGoToConversations: () => void;
  onToggleAI: (accountId: string, enabled: boolean) => void;
  activationCode: ActivationCode | null;
  orgAiSeats?: { total: number; used: number };
}) {
  const ai = aiEmployeeConfig ?? {
    name: 'AI 员工', status: 'offline' as const, workStartTime: '09:00', workEndTime: '18:00', timezone: 'Asia/Shanghai',
  };
  // 仅显示当前支持的平台（WhatsApp 和 Telegram）
  const supportedPlatforms = ['whatsapp', 'telegram'];
  const filteredAccounts = platformAccounts.filter(a => supportedPlatforms.includes(a.platformId));
  // 过滤掉未登录账号
  const loggedInAccounts = filteredAccounts.filter(a => a.status === 'online' || a.status === 'offline' || a.status === 'busy');
  const notLoggedInCount = filteredAccounts.length - loggedInAccounts.length;
  const boundCount = loggedInAccounts.filter(a => a.aiEnabled).length;
  const platformIds = [...new Set(loggedInAccounts.map(a => a.platformId))];
  const [activePlatformTab, setActivePlatformTab] = useState<string>(platformIds[0] ?? '');
  const [confirmDisableAI, setConfirmDisableAI] = useState<string | null>(null);

  return (
    <div className="h-full overflow-y-auto">
      <div className="py-6 px-6 space-y-6">

        {/* 顶部返回栏 */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            返回概览
          </button>
        </div>

        {/* AI员工信息卡片 */}
        <div className="bg-gradient-to-r from-[#1A1A1A] to-[#333] rounded-xl p-5 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#FF6B35]/20 rounded-2xl flex items-center justify-center">
              <Bot className="w-7 h-7 text-[#FF6B35]" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{ai.name}</h2>
              <p className="text-sm text-white/70 mt-0.5">
                {ai.status === 'online' ? '在线工作中' : ''} {ai.status === 'online' && '·'} 已绑定 <span className="text-[#FF6B35] font-medium">{boundCount}</span> 个账号
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60">工作时间</p>
              <p className="text-sm font-medium text-[#FF6B35]">{ai.workStartTime} - {ai.workEndTime}</p>
              <p className="text-[10px] text-white/50 mt-0.5">
                {getTimezoneLabel(ai.timezone)} · 自动适配客户时区
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/15 flex items-start gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-[#FF6B35]/60 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-white/60 leading-relaxed">
              开启AI绑定后，该账号收到的私信将由AI员工自动回复。AI员工会根据知识库和话术库内容进行智能应答，你可以随时手动接管对话。
            </p>
          </div>
        </div>

        {/* 坐席配额卡片 — 按平台分行 */}
        {activationCode && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#FF6B35]" />
                <h3 className="text-sm font-semibold text-gray-900">AI坐席配额</h3>
              </div>
              <span className="text-xs text-gray-400 font-mono">{activationCode.code}</span>
            </div>
            {/* 按平台显示坐席 */}
            {(() => {
              const platforms = activationCode.platforms ?? [];
              const aiPlatforms = activationCode.aiPlatforms ?? [];
              const groupedPlatforms = platforms.map(pid => {
                const pc = platformConfigs.find(p => p.id === pid);
                const PIcon = pc ? iconMap[pc.icon] || MessageCircle : MessageCircle;
                const accts = loggedInAccounts.filter(a => a.platformId === pid);
                const enabledCount = accts.filter(a => a.aiEnabled).length;
                const aiCfg = aiPlatforms.find(ap => ap.platformId === pid);
                const capabilities = [
                  aiCfg?.aiSalesChat && '智能销售对话',
                  aiCfg?.aiProactiveMarketing && '主动营销触达',
                  aiCfg?.aiRecall && '客户召回',
                  aiCfg?.aiQualityCheck && '质量检测',
                ].filter(Boolean);
                return { pid, pc, PIcon, accts, enabledCount, totalAccts: accts.length, capabilities };
              });
              return (
                <div className="space-y-3">
                  {/* 表头 */}
                  <div className="grid grid-cols-3 items-center px-1 pb-2 border-b border-gray-100">
                    <span className="text-[11px] font-medium text-gray-400">平台</span>
                    <span className="text-[11px] font-medium text-gray-400 text-center">坐席使用</span>
                    <span className="text-[11px] font-medium text-gray-400 text-center">AI能力</span>
                  </div>
                  {groupedPlatforms.map(({ pid, pc, PIcon, enabledCount, totalAccts, capabilities }) => (
                    <div key={pid} className="grid grid-cols-3 items-center px-1 py-1.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${pc?.color || '#666'}15` }}
                        >
                          <PIcon className="w-4 h-4" style={{ color: pc?.color || '#666' }} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{pc?.name || pid}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-semibold text-[#FF6B35]">{enabledCount}</span>
                        <span className="text-xs text-gray-400">/{totalAccts}</span>
                      </div>
                      <div className="flex justify-center">
                        {capabilities.length > 0 ? (
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                            {capabilities.map((cap, i) => (
                              <span key={i} className="text-[10px] text-[#FF6B35] bg-[#FFF0E8] border border-[#FF6B35]/20 px-2 py-0.5 rounded-full text-center whitespace-nowrap">{cap}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400">未配置</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {/* 汇总行 */}
                  <div className="pt-3 mt-1 border-t border-gray-100 flex items-center justify-between px-1">
                    <span className="text-xs text-gray-500">
                      合计：<span className="font-semibold text-[#FF6B35]">{boundCount}</span>/{loggedInAccounts.length} 已绑定
                    </span>
                    {orgAiSeats && (
                      <span className="text-[10px] text-gray-400">
                        组织总配额：{orgAiSeats.used}/{orgAiSeats.total}
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 账号列表 — 平台 tab 切换 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-gray-900">平台账号列表</h3>
            </div>
            <span className="text-xs text-gray-400">
              {boundCount}/{loggedInAccounts.length} 已绑定
            </span>
          </div>

          {/* 未登录账号提示横幅 */}
          {notLoggedInCount > 0 && (
            <div className="mx-5 mt-3 mb-1 flex items-center justify-between px-4 py-3 bg-[#FFF7F3] border border-[#FF6B35]/20 rounded-lg">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#FF6B35] flex-shrink-0" />
                <p className="text-xs text-[#1A1A1A] leading-relaxed">
                  请先在左侧会话页面扫码登录客服账号后，再回到此处开启AI绑定。
                </p>
              </div>
              <button
                onClick={onGoToConversations}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#FF6B35] bg-[#FFF0E8] hover:bg-[#FFE0D0] rounded-md transition-colors flex-shrink-0"
              >
                前往登录
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 平台 tab 栏 */}
          {platformIds.length > 0 && (
            <div className="flex items-center gap-1 px-5 pt-3 pb-0 overflow-x-auto">
              {platformIds.map((pid) => {
                const pc = platformConfigs.find(p => p.id === pid);
                const PIcon = pc ? iconMap[pc.icon] || MessageCircle : MessageCircle;
                const accts = loggedInAccounts.filter(a => a.platformId === pid);
                const enabledCount = accts.filter(a => a.aiEnabled).length;
                const isActive = (activePlatformTab || platformIds[0]) === pid;
                return (
                  <button
                    key={pid}
                    onClick={() => setActivePlatformTab(pid)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg border border-b-0 transition-colors flex-shrink-0",
                      isActive
                        ? "bg-white text-gray-900 border-gray-200 relative after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[1px] after:bg-white"
                        : "bg-transparent text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <PIcon className="w-3.5 h-3.5" style={{ color: isActive ? (pc?.color || '#666') : undefined }} />
                    <span>{pc?.name || pid}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full",
                      enabledCount > 0 ? "bg-[#FFF0E8] text-[#FF6B35]" : "bg-gray-100 text-gray-400"
                    )}>{enabledCount}/{accts.length}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 当前 tab 的账号列表 */}
          <div className="border-t border-gray-200">
            {(() => {
              const currentPid = activePlatformTab || platformIds[0];
              const pc = platformConfigs.find(p => p.id === currentPid);
              const PIcon = pc ? iconMap[pc.icon] || MessageCircle : MessageCircle;
              const accts = loggedInAccounts.filter(a => a.platformId === currentPid);
              if (accts.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <p className="text-sm">该平台暂无已登录账号</p>
                  </div>
                );
              }
              return (
                <div className="divide-y divide-gray-100">
                  {accts.map((account) => (
                    <AIBindingRow
                      key={account.id}
                      account={account}
                      platformConfig={pc}
                      PIcon={PIcon}
                      onToggle={() => account.aiEnabled ? setConfirmDisableAI(account.id) : onToggleAI(account.id, true)}
                    />
                  ))}
                </div>
              );
            })()}
          </div>

          {platformAccounts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Inbox className="w-10 h-10 mb-3 text-gray-300" />
              <p className="text-sm">暂无平台账号</p>
              <p className="text-xs mt-1">请先在会话页面添加平台账号</p>
            </div>
          )}
        </div>

      </div>

      {/* 关闭AI员工确认弹框 */}
      {confirmDisableAI && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmDisableAI(null)} />
          <div className="relative bg-white rounded-xl p-5 shadow-2xl w-80">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-[#FFF0E8] rounded-full">
              <AlertTriangle className="w-6 h-6 text-[#FF6B35]" />
            </div>
            <h4 className="text-center font-medium text-gray-900 mb-2">确认关闭AI员工</h4>
            <p className="text-xs text-gray-500 text-center mb-3">关闭后该账号将无法使用以下AI能力：</p>
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {['智能销售对话', '主动营销触达', '客户召回', '质量检测'].map(cap => (
                <span key={cap} className="text-[10px] text-center text-gray-600 bg-gray-100 border border-gray-200 px-2 py-1 rounded-md">{cap}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDisableAI(null)} className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">取消</button>
              <button onClick={() => { onToggleAI(confirmDisableAI, false); setConfirmDisableAI(null); }} className="flex-1 px-3 py-2 text-sm text-white bg-[#FF6B35] rounded-lg hover:bg-[#E85A2A]">确定关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// AI绑定行组件
function AIBindingRow({ account, platformConfig, PIcon, onToggle }: {
  account: PlatformAccount;
  platformConfig: typeof platformConfigs[number] | undefined;
  PIcon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  onToggle: () => void;
}) {
  const isEnabled = !!account.aiEnabled;
  const statusText = account.status === 'online' ? '在线' : '离线';
  const statusColor = account.status === 'online' ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-100';

  return (
    <div className="grid grid-cols-[1fr_2fr_auto] items-center px-5 py-4 hover:bg-gray-50/50 transition-colors">
      {/* 平台 */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${platformConfig?.color || '#666'}20` }}
        >
          <PIcon className="w-4.5 h-4.5" style={{ color: platformConfig?.color || '#666' }} />
        </div>
        <span className="text-sm font-medium text-gray-900">{platformConfig?.name || account.platformId}</span>
      </div>

      {/* 客服账号 */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm text-gray-900 truncate">{account.name}</span>
        <span className={cn("px-1.5 py-0.5 text-[10px] font-medium rounded-full flex-shrink-0", statusColor)}>
          {statusText}
        </span>
        {account.proxyRegion && (
          <span className="text-xs text-gray-400 flex-shrink-0">
            {account.proxyRegion}{account.ip ? ` ${account.ip}` : ''}
          </span>
        )}
      </div>

      {/* 操作 */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {isEnabled && (
          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">AI员工服务中</span>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "w-11 h-6 rounded-full transition-colors relative flex-shrink-0",
            isEnabled ? "bg-[#FF6B35]" : "bg-gray-200"
          )}
        >
          <span className={cn(
            "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
            isEnabled ? "left-[22px]" : "left-0.5"
          )} />
        </button>
      </div>
    </div>
  );
}

// Dashboard View
function DashboardView({ onGoToConversations }: { onGoToConversations: () => void }) {
  const { conversations, aiStats, organization, platformAccounts, aiEmployees, selectedAIEmployeeId, updatePlatformAccount, activationCodes, currentActivationCodeId } = useStore();
  const aiEmployeeConfig = aiEmployees.find(e => e.id === selectedAIEmployeeId) ?? aiEmployees[0] ?? null;
  const [showAIBinding, setShowAIBinding] = useState(false);
  const [aiDataTimeRange, setAiDataTimeRange] = useState<'today' | 'weekly' | 'monthly'>('today');
  const [aiReceptionTimeRange, setAiReceptionTimeRange] = useState<'today' | 'weekly' | 'monthly'>('today');
  const dashTimeLabels = { today: '今日', weekly: '本周', monthly: '本月' };
  const aiDataPeriod = aiStats[aiDataTimeRange];
  const stats = {
    total: conversations.length,
    active: conversations.filter(c => c.status === 'active').length,
    pending: conversations.filter(c => c.status === 'pending').length,
    resolved: conversations.filter(c => c.status === 'resolved').length,
    unread: conversations.reduce((sum, c) => sum + c.unreadCount, 0),
  };


  // AI状态配置

  // 平台图标映射
  const dashIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    MessageCircle, Send, MessageSquare, Instagram, Facebook,
    Mail, Smartphone, Music, Twitter, ShoppingBag,
  };

  const currentActivationCode = activationCodes.find(c => c.id === currentActivationCodeId) || null;

  if (showAIBinding) {
    return (
      <AIBindingPage
        platformAccounts={platformAccounts}
        aiEmployeeConfig={aiEmployeeConfig}
        iconMap={dashIconMap}
        activationCode={currentActivationCode}
        orgAiSeats={organization.aiSeats}
        onBack={() => setShowAIBinding(false)}
        onGoToConversations={onGoToConversations}
        onToggleAI={(accountId, enabled) => updatePlatformAccount(accountId, { aiEnabled: enabled })}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-6">
      {/* 订阅套餐信息 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1A1A1A]">订阅信息</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* 当前套餐 */}
          <div className="p-3 bg-[#FFF7F3] rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-xs text-[#999]">当前套餐</span>
            </div>
            <p className="text-sm font-bold text-[#1A1A1A]">专业版</p>
          </div>
          {/* 到期时间 */}
          <div className="p-3 bg-[#F7F8FA] rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-[#999]" />
              <span className="text-xs text-[#999]">到期时间</span>
            </div>
            <p className="text-sm font-bold text-[#1A1A1A]">
              {organization.expiresAt instanceof Date
                ? organization.expiresAt.toLocaleDateString('zh-CN')
                : organization.expiresAt || '2026-12-31'}
            </p>
          </div>
          {/* 激活码 */}
          <div className="p-3 bg-[#F7F8FA] rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Key className="w-4 h-4 text-[#999]" />
              <span className="text-xs text-[#999]">激活码</span>
            </div>
            <p className="text-sm font-bold text-[#1A1A1A] truncate" title={organization.activationCode}>
              {organization.activationCode}
            </p>
          </div>
          {/* 会话端口 */}
          <div className="p-3 bg-[#F7F8FA] rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-4 h-4 text-[#999]" />
              <span className="text-xs text-[#999]">会话端口</span>
            </div>
            <p className="text-sm font-bold text-[#1A1A1A]">
              <span className="text-[#FF6B35]">{platformAccounts.filter(a => a.status === 'online').length}</span>
              <span className="text-[#D9D9D9] mx-0.5">/</span>
              <span>10</span>
            </p>
          </div>
          {/* AI绑定账号 */}
          <div className="p-3 bg-[#FFF7F3] rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-xs text-[#999]">AI绑定</span>
            </div>
            <p className="text-sm font-bold text-[#FF6B35]">
              {platformAccounts.filter(a => a.aiEnabled).length} 个账号
            </p>
          </div>
          {/* 组织名称 */}
          <div className="p-3 bg-[#F7F8FA] rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-[#999]" />
              <span className="text-xs text-[#999]">组织</span>
            </div>
            <p className="text-sm font-bold text-[#1A1A1A] truncate" title={organization.name}>
              {organization.name}
            </p>
          </div>
        </div>
      </div>

      {/* AI员工绑定 + AI智能客服 并排 */}
      <div className="grid grid-cols-2 gap-4">
        {/* AI员工绑定入口 */}
        <div className="bg-gradient-to-r from-[#1A1A1A] to-[#333] rounded-xl p-5 text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => setShowAIBinding(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center">
                  <Bot className="w-5.5 h-5.5 text-[#FF8F5E]" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#333] bg-[#FF6B35]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold">AI员工绑定</h2>
                  <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-white/20 truncate max-w-[120px]">
                    {aiEmployeeConfig?.name || 'AI 员工'}
                  </span>
                </div>
                <p className="text-xs text-white/70 mt-0.5">
                  已绑定 <span className="font-semibold text-white">{platformAccounts.filter(a => a.aiEnabled).length}</span> 个账号
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <div className="text-center">
                <p className="text-xl font-bold">{platformAccounts.filter(a => a.aiEnabled).length}</p>
                <p className="text-[10px] text-white/70">已绑定</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-center">
                <p className="text-xl font-bold">{platformAccounts.length}</p>
                <p className="text-[10px] text-white/70">总账号</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setShowAIBinding(true); }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white/20 hover:bg-white/30 rounded-lg transition-colors ml-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                管理绑定
              </button>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/15 flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
              在线 {platformAccounts.filter(a => a.status === 'online').length}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#999]" />
              离线 {platformAccounts.filter(a => a.status === 'offline').length}
            </div>
          </div>
        </div>

        {/* AI客服状态卡片 */}
        <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8F5E] rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5.5 h-5.5 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold">AI智能客服</h2>
                <p className="text-xs text-white/70 mt-0.5">
                  今日已接待 <span className="font-semibold text-white">{aiStats.today.customersServed}</span> 位客户，
                  回复 <span className="font-semibold text-white">{aiStats.today.messagesReplied}</span> 条消息
                </p>
              </div>
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
              <p className="text-sm text-[#666]">今日总会话</p>
              <p className="text-3xl font-bold text-[#1A1A1A] mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FFF7F3] flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-[#FF6B35]" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-[#999]">昨日</span>
              <span className="font-medium text-[#333]">28</span>
            </div>
            <div className="w-px h-3 bg-[#E8E8E8]" />
            <div className="flex items-center gap-1">
              <span className="text-[#999]">近7日</span>
              <span className="font-medium text-[#333]">186</span>
            </div>
            <div className="w-px h-3 bg-[#E8E8E8]" />
            <div className="flex items-center gap-1">
              <span className="text-[#999]">近30日</span>
              <span className="font-medium text-[#333]">742</span>
            </div>
          </div>
        </div>

        {/* 今日未读 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-[#FF8F5E]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#666]">今日未读</p>
              <p className="text-3xl font-bold text-[#1A1A1A] mt-1">{stats.unread}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FFF7F3] flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-[#FF8F5E]" />
            </div>
          </div>
        </div>

        {/* 今日未回复 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-[#FFB088]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#666]">今日未回复</p>
              <p className="text-3xl font-bold text-[#1A1A1A] mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FFF7F3] flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-[#FFB088]" />
            </div>
          </div>
        </div>
      </div>
      
      {/* AI数据统计 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1A1A1A]">AI 员工{dashTimeLabels[aiDataTimeRange]}数据</h3>
          <div className="flex items-center gap-1 bg-[#F2F2F2] rounded-lg p-0.5">
            {(['today', 'weekly', 'monthly'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setAiDataTimeRange(range)}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                  aiDataTimeRange === range
                    ? "bg-white text-[#FF6B35] shadow-sm"
                    : "text-[#666] hover:text-[#333]"
                )}
              >
                {dashTimeLabels[range]}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { name: '接待人数', value: aiDataPeriod.customersServed, icon: Users, color: 'text-[#FF6B35]', bgColor: 'bg-[#FFF7F3]' },
            { name: 'AI生成回复', value: aiDataPeriod.aiGeneratedReplies, icon: Sparkles, color: 'text-[#FF6B35]', bgColor: 'bg-[#FFF7F3]' },
            { name: 'AI生成总结', value: aiDataPeriod.aiSummaryCount, icon: FileText, color: 'text-[#FF6B35]', bgColor: 'bg-[#FFF7F3]' },
            { name: 'AI标签提取', value: aiDataPeriod.aiLabelExtracted, icon: Target, color: 'text-[#FF6B35]', bgColor: 'bg-[#FFF7F3]' },
            { name: '会话平均响应', value: `${aiDataPeriod.avgResponseTime}s`, icon: Clock, color: 'text-[#FF6B35]', bgColor: 'bg-[#FFF7F3]' },
            { name: '翻译次数', value: aiDataPeriod.translationCount, icon: Languages, color: 'text-[#FF6B35]', bgColor: 'bg-[#FFF7F3]' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-3 rounded-xl hover:bg-[#FFF7F3] transition-colors">
              <div className={cn("w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center", stat.bgColor)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <p className="text-xl font-bold text-[#1A1A1A]">{stat.value}</p>
              <p className="text-xs text-[#999] mt-0.5">{stat.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* AI接待统计 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-[#F2F2F2] flex items-center justify-between">
            <h3 className="font-semibold text-[#1A1A1A]">AI接待统计</h3>
            <div className="flex items-center gap-1 bg-[#F2F2F2] rounded-lg p-0.5">
              {(['today', 'weekly', 'monthly'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setAiReceptionTimeRange(range)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                    aiReceptionTimeRange === range
                      ? "bg-white text-[#FF6B35] shadow-sm"
                      : "text-[#666] hover:text-[#333]"
                  )}
                >
                  {dashTimeLabels[range]}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4">
            {/* 回复类型分布 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#FFF7F3] rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                  <span className="text-sm text-[#666]">AI自动回复</span>
                </div>
                <p className="text-2xl font-bold text-[#FF6B35]">{aiStats.aiUsage.autoReplies}</p>
                <p className="text-xs text-[#FF8F5E]">占比 {Math.round(aiStats.aiUsage.autoReplies / (aiStats.aiUsage.autoReplies + aiStats.aiUsage.adoptedSuggestions + aiStats.aiUsage.manualReplies || 1) * 100)}%</p>
              </div>
              <div className="p-3 bg-[#FFF7F3] rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-4 h-4 text-[#FF8F5E]" />
                  <span className="text-sm text-[#666]">AI辅助生成</span>
                </div>
                <p className="text-2xl font-bold text-[#FF6B35]">{aiStats.aiUsage.adoptedSuggestions}</p>
                <p className="text-xs text-[#FF8F5E]">占比 {Math.round(aiStats.aiUsage.adoptedSuggestions / (aiStats.aiUsage.autoReplies + aiStats.aiUsage.adoptedSuggestions + aiStats.aiUsage.manualReplies || 1) * 100)}%</p>
              </div>
              <div className="p-3 bg-[#F2F2F2] rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-[#666]" />
                  <span className="text-sm text-[#666]">人工回复</span>
                </div>
                <p className="text-2xl font-bold text-[#333]">{aiStats.aiUsage.manualReplies}</p>
                <p className="text-xs text-[#999]">占比 {Math.round(aiStats.aiUsage.manualReplies / (aiStats.aiUsage.autoReplies + aiStats.aiUsage.adoptedSuggestions + aiStats.aiUsage.manualReplies || 1) * 100)}%</p>
              </div>
            </div>
          </div>
      </div>

      {/* Platform Stats */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-semibold text-[#1A1A1A] mb-4">平台分布</h3>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {['whatsapp', 'telegram'].map((platformId) => {
            const count = platformAccounts.filter(a => a.platformId === platformId && a.aiEnabled).length;
            const platform = platformConfigs.find(p => p.id === platformId);
            return (
              <div key={platformId} className="text-center">
                <div className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center bg-[#FFF7F3]">
                  <span className="text-lg font-bold text-[#FF6B35]">
                    {count}
                  </span>
                </div>
                <p className="text-xs text-[#999]">{platform?.name}</p>
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
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-900">{customer.nicknameRemark || customer.name}</span>
                  </td>
                  <td className="px-4 py-6">
                    <div className="flex flex-wrap gap-1.5 items-center max-w-xs">
                      {(() => {
                        const aiProfileTags = customer.aiProfile ? [
                          customer.aiProfile.customerLevel,
                          customer.aiProfile.customerType,
                          customer.aiProfile.intendedCategory,
                          customer.aiProfile.budgetRange,
                          customer.aiProfile.purchaseUrgency,
                          customer.aiProfile.inquiryStage,
                          customer.aiProfile.decisionRole,
                        ].filter(Boolean) : [];
                        const displayTags = aiProfileTags.length > 0 ? aiProfileTags : (customer.tags || []);

                        return (
                          <>
                            {displayTags.slice(0, 6).map((tag, i) => (
                              <span key={i} className="px-2.5 py-1 text-xs bg-[#FFF0E8] text-[#FF6B35] rounded-md font-medium whitespace-nowrap border border-[#FF6B35]/15">
                                {tag}
                              </span>
                            ))}
                            {displayTags.length > 6 && (
                              <span
                                className="px-2.5 py-1 text-xs bg-gray-100 text-gray-600 rounded-md font-medium cursor-help whitespace-nowrap"
                                title={displayTags.slice(6).join('、')}
                              >
                                +{displayTags.length - 6}
                              </span>
                            )}
                            {displayTags.length === 0 && (
                              <span className="text-xs text-gray-400">-</span>
                            )}
                          </>
                        );
                      })()}
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
  color: 'light' | 'medium' | 'dark';
}) {
  const colorMap = {
    light: {
      bg: 'bg-[#FFF7F3]',
      text: 'text-[#FF6B35]',
      value: 'text-[#FF6B35]'
    },
    medium: {
      bg: 'bg-[#FFF0E8]',
      text: 'text-[#FF6B35]',
      value: 'text-[#E85A2A]'
    },
    dark: {
      bg: 'bg-[#FFE0D0]',
      text: 'text-[#E85A2A]',
      value: 'text-[#E85A2A]'
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
  const [timeRange, setTimeRange] = useState<'today' | 'weekly' | 'monthly'>('today');
  const timeLabels = { today: '今日', weekly: '本周', monthly: '本月' };
  const periodData = aiStats[timeRange];

  return (
    <div className="h-full overflow-y-auto space-y-6">
      {/* 时间范围选择器 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">数据分析</h2>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(['today', 'weekly', 'monthly'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                timeRange === range
                  ? "bg-white text-[#FF6B35] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {timeLabels[range]}
            </button>
          ))}
        </div>
      </div>

      {/* AI客服核心指标 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: `${timeLabels[timeRange]}接待`, value: periodData.customersServed, change: timeRange === 'today' ? `+${Math.round((periodData.customersServed - aiStats.dailyTrend[5].customers) / aiStats.dailyTrend[5].customers * 100)}%` : '', icon: Users },
          { name: 'AI回复数', value: periodData.aiGeneratedReplies, change: timeRange === 'today' ? `+${Math.round((periodData.aiGeneratedReplies - aiStats.dailyTrend[5].aiReplies) / aiStats.dailyTrend[5].aiReplies * 100)}%` : '', icon: Sparkles },
          { name: '平均响应', value: `${periodData.avgResponseTime}s`, change: timeRange === 'today' ? '-3s' : '', icon: Clock },
          { name: '翻译次数', value: periodData.translationCount, change: timeRange === 'today' ? '+12' : '', icon: Languages },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl p-5 shadow-sm bg-white border border-[#E8E8E8]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#666]">{stat.name}</p>
                <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{stat.value}</p>
                <p className="text-xs mt-1 font-medium text-[#FF6B35]">
                  {stat.change}{stat.change ? (timeRange === 'today' ? ' 较昨日' : timeRange === 'weekly' ? ' 较上周' : ' 较上月') : ''}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#1A1A1A]">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI智能洞察 */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-[#E8E8E8]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#FF6B35]" />
            <h3 className="font-semibold text-[#1A1A1A]">AI智能洞察</h3>
          </div>
          <span className="text-xs text-[#FF6B35] bg-[#FFF7F3] px-2 py-1 rounded-lg border border-[#FFD4BE]">实时分析</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard icon={Target} title="转化机会" value="12" desc="高意向客户待跟进" color="light" />
          <InsightCard icon={Zap} title="效率提升" value="+23%" desc="AI辅助后响应速度" color="medium" />
          <InsightCard icon={AlertTriangle} title="风险预警" value="3" desc="客户流失风险提醒" color="dark" />
        </div>
      </div>

      {/* 数据汇总 */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-[#E8E8E8]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#FF6B35]" />
            <h3 className="font-semibold text-[#1A1A1A]">{timeLabels[timeRange]}汇总</h3>
          </div>
          <span className="text-xs text-[#999] bg-[#F7F8FA] px-2 py-1 rounded-lg border border-[#E8E8E8]">{new Date().toLocaleDateString('zh-CN')} 为止</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          {[
            { name: '接待人数', value: periodData.customersServed, unit: '人', accent: true },
            { name: '回复消息', value: periodData.messagesReplied, unit: '条' },
            { name: 'AI生成回复', value: periodData.aiGeneratedReplies, unit: '条' },
            { name: 'AI生成总结', value: periodData.aiSummaryCount, unit: '条' },
            { name: 'AI标签提取', value: periodData.aiLabelExtracted, unit: '个' },
            { name: '翻译次数', value: periodData.translationCount, unit: '次' },
            { name: '平均响应', value: `${periodData.avgResponseTime}s`, unit: '' },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-[#1A1A1A]">
              <p className={`text-2xl font-bold ${item.accent ? 'text-[#FF6B35]' : 'text-white'}`}>{item.value}</p>
              <p className="text-xs mt-1 text-white/70">{item.name} {item.unit}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI总结统计 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E8E8E8]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#FF6B35]" />
              <h3 className="font-semibold text-[#1A1A1A]">AI总结统计</h3>
            </div>
            <span className="text-xs text-[#FF6B35] bg-[#FFF7F3] px-2 py-1 rounded-lg border border-[#FFD4BE]">{timeLabels[timeRange]}数据</span>
          </div>

          <div className="space-y-4">
            {/* 总结生成率 */}
            <div className="bg-[#F7F8FA] rounded-xl p-4 border border-[#E8E8E8]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#666]">总结生成率</span>
                <span className="text-lg font-bold text-[#FF6B35]">{Math.round(periodData.aiSummaryCount / periodData.customersServed * 100)}%</span>
              </div>
              <div className="h-2 bg-[#E8E8E8] rounded-full overflow-hidden">
                <div className="h-full bg-[#FF6B35] rounded-full" style={{ width: `${Math.round(periodData.aiSummaryCount / periodData.customersServed * 100)}%` }} />
              </div>
              <p className="text-xs text-[#999] mt-1">已生成 {periodData.aiSummaryCount} / 总会话 {periodData.customersServed}</p>
            </div>

          </div>

          {/* 底部统计 */}
          <div className="mt-4 p-3 bg-[#1A1A1A] rounded-xl">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm">{timeLabels[timeRange]}生成总结</span>
              </div>
              <span className="text-xl font-bold">{periodData.aiSummaryCount}</span>
            </div>
          </div>
        </div>

        {/* AI画像标签统计 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E8E8E8]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#FF6B35]" />
              <h3 className="font-semibold text-[#1A1A1A]">AI画像标签统计</h3>
            </div>
            <span className="text-xs text-[#FF6B35] bg-[#FFF7F3] px-2 py-1 rounded-lg border border-[#FFD4BE]">{timeLabels[timeRange]}数据</span>
          </div>
          <div className="space-y-3 bg-[#F7F8FA] rounded-xl p-4 border border-[#E8E8E8]">
            {[
              { field: '客户等级', count: 186, percent: 35, color: '#1A1A1A' },
              { field: '客户类型', count: 156, percent: 29, color: '#444' },
              { field: '意向品类', count: 134, percent: 25, color: '#666' },
              { field: '预算区间', count: 98, percent: 18, color: '#999' },
              { field: '购买紧迫度', count: 72, percent: 14, color: '#B3B3B3' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#333]">{item.field}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#666]">{item.count} 次</span>
                    <span className="text-sm font-bold text-[#1A1A1A]">{item.percent}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-[#E8E8E8] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.percent * 2.8}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* 总标签数 */}
          <div className="mt-4 p-3 bg-[#FF6B35] rounded-xl">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span className="text-sm">{timeLabels[timeRange]}提取标签</span>
              </div>
              <span className="text-xl font-bold">{periodData.aiLabelExtracted}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI标签下钻统计 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 客户类型分布 */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-[#E8E8E8]">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-[#FF6B35]" />
            <h3 className="text-sm font-semibold text-[#1A1A1A]">客户类型分布</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: '批发商', count: 42, percent: 27, color: '#FF6B35' },
              { name: '平台卖家', count: 38, percent: 24, color: '#FF8F5E' },
              { name: '零售终端', count: 35, percent: 22, color: '#FFB088' },
              { name: '品牌代理', count: 25, percent: 16, color: '#FFD4BE' },
              { name: '个人消费者', count: 16, percent: 11, color: '#FFE8D9' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#666]">{item.name}</span>
                  <span className="text-xs font-semibold text-[#333]">{item.count}</span>
                </div>
                <div className="h-1.5 bg-[#E8E8E8] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.percent * 3.7}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 意向品类分布 */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-[#E8E8E8]">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-[#FF6B35]" />
            <h3 className="text-sm font-semibold text-[#1A1A1A]">意向品类分布</h3>
          </div>
          <div className="space-y-3">
            {[
              { name: '电子产品', count: 58, percent: 32, color: '#1A1A1A' },
              { name: '鞋类', count: 41, percent: 23, color: '#444' },
              { name: '运动服饰', count: 34, percent: 19, color: '#666' },
              { name: '美妆护肤', count: 28, percent: 15, color: '#999' },
              { name: '家居用品', count: 21, percent: 11, color: '#B3B3B3' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#666]">{item.name}</span>
                  <span className="text-xs font-semibold text-[#333]">{item.count}</span>
                </div>
                <div className="h-1.5 bg-[#E8E8E8] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.percent * 3.1}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 购买紧迫度 & 预算区间 */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-[#E8E8E8]">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[#FF6B35]" />
              <h3 className="text-sm font-semibold text-[#1A1A1A]">购买紧迫度</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: '本周内', count: 18, color: '#FF6B35' },
                { name: '本月内', count: 45, color: '#1A1A1A' },
                { name: '近期考虑', count: 62, color: '#444' },
                { name: '观望中', count: 31, color: '#1A1A1A' },
              ].map((item, i) => (
                <div key={i} className="bg-[#F7F8FA] rounded-lg p-2.5 text-center border border-[#E8E8E8]">
                  <p className="text-lg font-bold" style={{ color: item.color }}>{item.count}</p>
                  <p className="text-[10px] text-[#666]">{item.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-[#E8E8E8]">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-[#FF6B35]" />
              <h3 className="text-sm font-semibold text-[#1A1A1A]">预算区间</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: '<$500', count: 34, color: '#1A1A1A' },
                { name: '$500-$5K', count: 52, color: '#444' },
                { name: '$5K-$50K', count: 28, color: '#1A1A1A' },
                { name: '>$50K', count: 12, color: '#FF6B35' },
              ].map((item, i) => (
                <div key={i} className="bg-[#F7F8FA] rounded-lg p-2.5 text-center border border-[#E8E8E8]">
                  <p className="text-lg font-bold" style={{ color: item.color }}>{item.count}</p>
                  <p className="text-[10px] text-[#666]">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 客户画像分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 客户等级分布 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E8E8E8]">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#FF6B35]" />
            <h3 className="font-semibold text-[#1A1A1A]">客户等级分布</h3>
          </div>
          <div className="space-y-3">
            {[
              { level: 'A级', desc: '已成交', count: 28, percent: 15, color: '#FF6B35' },
              { level: 'B级', desc: '高意向询价', count: 56, percent: 30, color: '#FF8F5E' },
              { level: 'C级', desc: '观望', count: 74, percent: 40, color: '#FFB088' },
              { level: 'D级', desc: '仅加好友', count: 28, percent: 15, color: '#FFD4BE' },
            ].map((item, i) => (
              <div key={i} className="bg-[#F7F8FA] rounded-lg p-3 border border-[#E8E8E8]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-[#333]">{item.level}</span>
                    <span className="text-xs text-[#999]">{item.desc}</span>
                  </div>
                  <span className="text-sm text-[#666]">{item.count}人 ({item.percent}%)</span>
                </div>
                <div className="h-2 bg-[#E8E8E8] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.percent * 2.6}%`, backgroundColor: item.color }} />
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
export function _SettingsView() {
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
