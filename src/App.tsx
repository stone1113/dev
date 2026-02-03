import { useState, useEffect } from 'react';
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
import { platformConfigs, languageMap } from '@/data/mockData';
import { 
  MessageCircle, 
  Filter,
  Search,
  Bell,
  Menu,
  Users,
  User,
  Sparkles,
  Clock,
  ThumbsUp,
  Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';

function App() {
  const {
    searchQuery,
    setSearchQuery,
    getFilteredConversations,
    userSettings
  } = useStore();
  
  const [activeSection, setActiveSection] = useState('conversations');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeRightPanel, setActiveRightPanel] = useState<RightPanelType>(null);
  
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
  
  // 渲染主内容区
  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'conversations':
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
        return <SettingsView />;
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
            
            <h1 className="text-lg font-semibold text-gray-900">
              {activeSection === 'dashboard' && '概览'}
              {activeSection === 'conversations' && '会话管理'}
              {activeSection === 'customers' && '客户管理'}
              {activeSection === 'analytics' && '数据分析'}
              {activeSection === 'settings' && '设置'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Search */}
            {activeSection === 'conversations' && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0059F8]/20 w-48"
                  />
                </div>
                <button 
                  onClick={() => setShowFilterPanel(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Filter className="w-5 h-5 text-gray-500" />
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
            
            {/* User */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <img
                src={userSettings.avatar}
                alt={userSettings.name}
                className="w-8 h-8 rounded-full object-cover bg-gray-100"
              />
              <span className="hidden sm:text-sm font-medium text-gray-700">{userSettings.name}</span>
            </div>
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

// Dashboard View
function DashboardView() {
  const { conversations, getFilteredConversations, aiStats } = useStore();
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
      {/* AI客服状态卡片 */}
      <div className="bg-gradient-to-r from-[#0059F8] to-[#0038A3] rounded-xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className={cn("absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#0059F8]", aiStatus.dotColor)} />
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
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: '总会话', value: stats.total, icon: MessageCircle, color: 'bg-blue-500' },
          { name: '进行中', value: stats.active, icon: MessageCircle, color: 'bg-green-500' },
          { name: '待处理', value: stats.pending, icon: MessageCircle, color: 'bg-amber-500' },
          { name: '未读消息', value: stats.unread, icon: MessageCircle, color: 'bg-red-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.color)}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* AI今日数据 */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">AI客服今日数据</h3>
          <span className="text-xs text-gray-400">{new Date().toLocaleDateString('zh-CN')}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: '接待人数', value: aiStats.today.customersServed, icon: Users, color: 'text-[#0059F8]', bgColor: 'bg-[#0059F8]/10' },
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
                <span className="text-sm font-semibold text-[#0059F8]">{aiStats.aiUsage.adoptionRate}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0059F8] to-[#0038A3] rounded-full transition-all duration-500"
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

// Customers View
function CustomersView() {
  const { conversations } = useStore();
  const customers = Array.from(new Map(conversations.map(c => [c.customer.id, c.customer])).values());
  
  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">客户列表</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">共 {customers.length} 位客户</span>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {customers.map((customer) => (
            <div key={customer.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{customer.name}</p>
                <p className="text-sm text-gray-500">{customer.country} · {customer.email}</p>
              </div>
              <div className="flex items-center gap-2">
                {customer.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Analytics View
function AnalyticsView() {
  const { aiStats } = useStore();
  
  return (
    <div className="h-full overflow-y-auto space-y-6">
      {/* AI客服核心指标 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { 
            name: '今日接待', 
            value: aiStats.today.customersServed, 
            change: `+${Math.round((aiStats.today.customersServed - aiStats.dailyTrend[5].customers) / aiStats.dailyTrend[5].customers * 100)}%`,
            icon: Users, 
            color: 'bg-[#0059F8]' 
          },
          { 
            name: 'AI回复数', 
            value: aiStats.today.aiGeneratedReplies, 
            change: `+${Math.round((aiStats.today.aiGeneratedReplies - aiStats.dailyTrend[5].aiReplies) / aiStats.dailyTrend[5].aiReplies * 100)}%`,
            icon: Sparkles, 
            color: 'bg-purple-500' 
          },
          { 
            name: '平均响应', 
            value: `${aiStats.today.avgResponseTime}s`, 
            change: '-3s',
            icon: Clock, 
            color: 'bg-green-500' 
          },
          { 
            name: '满意度', 
            value: `${aiStats.today.satisfactionRate}%`, 
            change: '+2.3%',
            icon: ThumbsUp, 
            color: 'bg-amber-500' 
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={cn(
                  "text-xs mt-1",
                  stat.change.startsWith('+') ? "text-green-500" : 
                  stat.change.startsWith('-') && stat.name === '平均响应' ? "text-green-500" : "text-red-500"
                )}>
                  {stat.change} 较昨日
                </p>
              </div>
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.color)}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 本周汇总 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">本周汇总</h3>
          <span className="text-xs text-gray-400">{new Date().toLocaleDateString('zh-CN')} 为止</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: '接待人数', value: aiStats.weekly.customersServed, unit: '人' },
            { name: '回复消息', value: aiStats.weekly.messagesReplied, unit: '条' },
            { name: 'AI生成回复', value: aiStats.weekly.aiGeneratedReplies, unit: '条' },
            { name: '翻译次数', value: aiStats.weekly.translationCount, unit: '次' },
            { name: '平均响应', value: `${aiStats.weekly.avgResponseTime}s`, unit: '' },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.name} {item.unit}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 接待趋势图 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">接待趋势（近7天）</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-[#0059F8]" />
                <span className="text-gray-500">接待人数</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-purple-400" />
                <span className="text-gray-500">AI回复</span>
              </div>
            </div>
          </div>
          <div className="h-56 flex items-end justify-between gap-3">
            {aiStats.dailyTrend.map((day, i) => {
              const maxCustomers = Math.max(...aiStats.dailyTrend.map(d => d.customers));
              const heightPercent = (day.customers / maxCustomers) * 100;
              const aiHeightPercent = (day.aiReplies / day.customers) * heightPercent;
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full relative" style={{ height: '180px' }}>
                    {/* 背景条 - 接待人数 */}
                    <div 
                      className="absolute bottom-0 w-full bg-[#0059F8]/20 rounded-t-lg transition-all duration-500"
                      style={{ height: `${heightPercent}%` }}
                    />
                    {/* AI回复条 */}
                    <div 
                      className="absolute bottom-0 w-full bg-purple-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${aiHeightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 mt-2">{day.date}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* 语言能力分布 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">语言能力分布</h3>
          <div className="space-y-4">
            {aiStats.languageStats.map((lang, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{languageMap[lang.language]?.flag || '🌐'}</span>
                    <span className="text-sm text-gray-700">{lang.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{lang.count} 次</span>
                    <span className="text-sm font-medium text-gray-900">{lang.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      i === 0 ? "bg-[#0059F8]" :
                      i === 1 ? "bg-green-500" :
                      i === 2 ? "bg-amber-500" :
                      i === 3 ? "bg-purple-500" : "bg-gray-400"
                    )}
                    style={{ width: `${lang.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* 总翻译次数 */}
          <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-cyan-600" />
                <span className="text-sm text-gray-700">本周翻译总次数</span>
              </div>
              <span className="text-xl font-bold text-cyan-700">{aiStats.weekly.translationCount}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI回复效果分析 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">AI回复效果分析</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 采纳率 */}
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E6E6E6" strokeWidth="12" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="none" 
                  stroke="#0059F8" 
                  strokeWidth="12"
                  strokeDasharray={`${aiStats.aiUsage.adoptionRate * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-900">{aiStats.aiUsage.adoptionRate}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">AI建议采纳率</p>
              <p className="text-xs text-gray-400 mt-1">
                生成 {aiStats.aiUsage.totalSuggestions} 条建议
                <br />
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
      
      {/* 平台分布 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">平台分布</h3>
        <div className="h-48 flex items-end justify-between gap-2">
          {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
            <div 
              key={i}
              className="flex-1 bg-[#0059F8]/20 rounded-t-lg"
              style={{ height: `${height}%` }}
            >
              <div 
                className="w-full bg-[#0059F8] rounded-t-lg transition-all duration-500"
                style={{ height: `${height * 0.7}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>周一</span>
          <span>周二</span>
          <span>周三</span>
          <span>周四</span>
          <span>周五</span>
          <span>周六</span>
          <span>周日</span>
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0059F8]/20"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">邮箱</label>
                <input 
                  type="email" 
                  defaultValue={userSettings.email}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0059F8]/20"
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
                  userSettings.preferences.translation.enabled ? "bg-[#0059F8]" : "bg-gray-200"
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
                        ? "border-[#0059F8] bg-[#0059F8]/10 text-[#0059F8]"
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
                        ? "border-[#0059F8] bg-[#0059F8]/10 text-[#0059F8]"
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
                  userSettings.preferences.ai.enabled ? "bg-[#0059F8]" : "bg-gray-200"
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
                  userSettings.preferences.ai.suggestions ? "bg-[#0059F8]" : "bg-gray-200"
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
                  userSettings.preferences.ai.summary ? "bg-[#0059F8]" : "bg-gray-200"
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
                      ? "bg-[#0059F8]"
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
