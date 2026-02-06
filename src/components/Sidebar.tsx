import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { platformConfigs } from '@/data/mockData';
import type { Platform, PlatformAccount } from '@/types';
import {
  MessageCircle,
  Send,
  MessageSquare,
  Instagram,
  Facebook,
  Mail,
  Smartphone,
  Music,
  Twitter,
  ShoppingBag,
  LayoutDashboard,
  MessageSquare as MessagesIcon,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  X,
  QrCode,
  Building2,
  Bot,
  ExternalLink,
  Server,
  FolderOpen,
  RefreshCw,
  Power,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageCircle,
  Send,
  MessageSquare,
  Instagram,
  Facebook,
  Mail,
  Smartphone,
  Music,
  Twitter,
  ShoppingBag,
};

interface SidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  onLogout?: () => void;
  onOpenAdminCenter?: () => void;
}

// 内联账号列表组件 - 直接在侧边栏展示账号管理功能
interface AccountListInlineProps {
  platform: Platform;
  accounts: PlatformAccount[];
  selectedAccount: PlatformAccount | undefined;
  onSelectAccount: (accountId: string) => void;
}

const AccountListInline: React.FC<AccountListInlineProps> = ({
  platform,
  accounts,
  selectedAccount,
  onSelectAccount
}) => {
  const {
    addPlatformAccount,
    deletePlatformAccount,
    updatePlatformAccount,
    setLoginAccountId
  } = useStore();

  const [showQrCode, setShowQrCode] = useState<string | null>(null);
  const [hoveredAccount, setHoveredAccount] = useState<string | null>(null);
  const [restartingAccount, setRestartingAccount] = useState<string | null>(null);
  const [confirmCloseAccount, setConfirmCloseAccount] = useState<string | null>(null);
  const [editingRemarkId, setEditingRemarkId] = useState<string | null>(null);
  const [editingRemarkValue, setEditingRemarkValue] = useState('');

  const platformConfig = platformConfigs.find(p => p.id === platform);

  const handleAddAccount = () => {
    // 直接添加一个未登录状态的空白客服账号
    const accountCount = accounts.length + 1;
    addPlatformAccount({
      platformId: platform,
      name: `客服${accountCount}`,
      accountId: '',
      status: 'not_logged_in',
      isDefault: false,
      messageCount: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=cs${Date.now()}`,
      remark: '-',
      proxyRegion: '',
    });
  };

  const handleToggleStatus = (account: PlatformAccount) => {
    if (account.status === 'online' || account.status === 'busy') {
      updatePlatformAccount(account.id, { status: 'offline' });
    } else if (account.status === 'offline') {
      updatePlatformAccount(account.id, { status: 'online' });
    }
  };

  // 重启会话
  const handleRestartSession = (accountId: string) => {
    setRestartingAccount(accountId);
    // 模拟重启过程
    setTimeout(() => {
      setRestartingAccount(null);
    }, 2000);
  };

  // 确认关闭会话
  const handleConfirmClose = (accountId: string) => {
    updatePlatformAccount(accountId, { status: 'offline' });
    setConfirmCloseAccount(null);
  };

  // 渲染单个账号卡片
  const renderAccountCard = (account: PlatformAccount) => {
    const isSelected = selectedAccount?.id === account.id;
    const isHovered = hoveredAccount === account.id;
    const isOnline = account.status === 'online' || account.status === 'busy';
    const isOffline = account.status === 'offline';
    const isNotLoggedIn = account.status === 'not_logged_in';
    const isRestarting = restartingAccount === account.id;

    return (
      <div
        key={account.id}
        className={cn(
          "relative p-2 rounded-lg transition-all text-xs border-l-4",
          // 在线状态：主题色浅背景，可点击
          isOnline && "bg-[#FF6B35]/5 border-l-[#FF6B35] cursor-pointer",
          // 离线/未登录状态：灰色背景，不可点击
          !isOnline && "bg-gray-50 border-l-[#FF6B35]/40 cursor-default",
          isSelected && "ring-1 ring-[#FF6B35]/30 bg-[#FF6B35]/10"
        )}
        onMouseEnter={() => setHoveredAccount(account.id)}
        onMouseLeave={() => setHoveredAccount(null)}
        onClick={() => isOnline && onSelectAccount(account.id)}
      >
        {/* 重启加载遮罩 */}
        {isRestarting && (
          <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center z-10">
            <Loader2 className="w-5 h-5 text-[#FF6B35] animate-spin" />
          </div>
        )}

        {/* 悬停时显示的操作按钮遮罩 - 仅对离线和未登录状态显示 */}
        {isHovered && !isRestarting && !isOnline && (
          <div className="absolute inset-0 bg-gray-900/60 rounded-lg flex items-center justify-center gap-3 z-10">
            {isNotLoggedIn ? (
              <button
                onClick={(e) => { e.stopPropagation(); setLoginAccountId(account.id); }}
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md"
                title="扫码登录"
              >
                <FolderOpen className="w-4 h-4 text-amber-600" />
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); handleToggleStatus(account); }}
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md"
                title="上线"
              >
                <FolderOpen className="w-4 h-4 text-amber-600" />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); /* 环境配置 */ }}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md"
              title="环境配置"
            >
              <Server className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); deletePlatformAccount(account.id); }}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md"
              title="删除"
            >
              <Trash2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}

        {/* 账号头部 - 头像、名称、状态 */}
        <div className="flex items-center gap-2">
          <div className="relative flex-shrink-0">
            <img src={account.avatar} alt={account.name} className="w-8 h-8 rounded-full object-cover" />
            {/* 在线状态显示未读消息数量 */}
            {isOnline && account.messageCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                {account.messageCount > 99 ? '99+' : account.messageCount}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className={cn(
                "font-medium truncate",
                isOnline ? "text-green-600" : isSelected ? "text-[#FF6B35]" : "text-gray-800"
              )}>
                {account.name}
              </span>
              {/* 在线状态显示AI标识 - 更明显 */}
              {isOnline && account.aiEnabled && (
                <span
                  className="flex items-center justify-center w-4 h-4 bg-purple-500 rounded flex-shrink-0"
                  title="AI员工服务中"
                >
                  <Bot className="w-3 h-3 text-white" />
                </span>
              )}
              {/* 状态标签 */}
              <span className={cn(
                "px-1.5 py-0.5 text-[10px] rounded flex-shrink-0",
                isOnline && "bg-green-100 text-green-600",
                isOffline && "bg-gray-100 text-gray-500",
                isNotLoggedIn && "bg-amber-100 text-amber-600"
              )}>
                {isOnline ? '在线' : isOffline ? '离线' : '未登录'}
              </span>
            </div>
            {account.phone && (
              <div className="text-gray-500 truncate">{account.phone}</div>
            )}
          </div>
        </div>

        {/* 账号信息 */}
        <div className="mt-1.5 space-y-0 text-gray-400">
          <div className="flex items-center gap-1.5">
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
            {editingRemarkId === account.id ? (
              <input
                type="text"
                value={editingRemarkValue}
                onChange={(e) => setEditingRemarkValue(e.target.value)}
                onBlur={() => {
                  updatePlatformAccount(account.id, { remark: editingRemarkValue || '--' });
                  setEditingRemarkId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    updatePlatformAccount(account.id, { remark: editingRemarkValue || '--' });
                    setEditingRemarkId(null);
                  }
                  if (e.key === 'Escape') {
                    setEditingRemarkId(null);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                className="flex-1 min-w-0 px-1 py-0.5 text-xs bg-white border border-[#FF6B35] rounded outline-none text-gray-700"
              />
            ) : (
              <span
                className={cn(
                  "truncate",
                  isOnline && "cursor-text hover:text-gray-600"
                )}
                onClick={(e) => {
                  if (isOnline) {
                    e.stopPropagation();
                    setEditingRemarkId(account.id);
                    setEditingRemarkValue(account.remark === '--' ? '' : (account.remark || ''));
                  }
                }}
              >
                {account.remark || '--'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Server className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">
              {account.proxyRegion ? `(${account.proxyRegion})` : '(本机)'}
            </span>
          </div>
        </div>

        {/* 在线状态的操作按钮 - 图标按钮 */}
        {isOnline && (
          <div className="mt-1.5 pt-1.5 border-t border-gray-100 flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); handleRestartSession(account.id); }}
              className="p-1 rounded-md text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors"
              title="重启会话"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmCloseAccount(account.id); }}
              className="p-1 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="关闭会话"
            >
              <Power className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); deletePlatformAccount(account.id); }}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="删除"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="ml-4 mt-1 pl-3 border-l-2 border-gray-200 space-y-2">
      {/* 所有账号列表 - 状态标签在卡片内显示 */}
      {accounts.map(renderAccountCard)}

      {/* 添加账号 */}
      <button
        onClick={handleAddAccount}
        className="w-full flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:text-[#FF6B35] hover:bg-[#FF6B35]/5"
      >
        <Plus className="w-3 h-3" />
        <span>添加账号</span>
      </button>

      {/* 扫码登录弹窗 */}
      {showQrCode && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowQrCode(null)} />
          <div className="relative bg-white rounded-xl p-6 shadow-2xl">
            <button onClick={() => setShowQrCode(null)} className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded">
              <X className="w-4 h-4 text-gray-500" />
            </button>
            <h4 className="text-center font-medium text-gray-900 mb-4">扫码登录 {platformConfig?.name}</h4>
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <QrCode className="w-32 h-32 text-gray-300" />
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">请使用 {platformConfig?.name} 扫描二维码</p>
          </div>
        </div>
      )}

      {/* 关闭会话确认弹窗 */}
      {confirmCloseAccount && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmCloseAccount(null)} />
          <div className="relative bg-white rounded-xl p-5 shadow-2xl w-72">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full">
              <Power className="w-6 h-6 text-red-500" />
            </div>
            <h4 className="text-center font-medium text-gray-900 mb-2">确认关闭会话</h4>
            <p className="text-xs text-gray-500 text-center mb-4">
              关闭后该账号将变为离线状态，确定要关闭吗？
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmCloseAccount(null)}
                className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => handleConfirmClose(confirmCloseAccount)}
                className="flex-1 px-3 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection = 'conversations',
  onSectionChange,
  onLogout,
  onOpenAdminCenter
}) => {
  const {
    sidebarCollapsed,
    toggleSidebar,
    userSettings,
    conversations,
    selectedPlatform,
    setSelectedPlatform,
    getPlatformAccounts,
    getSelectedAccount,
    setPlatformAccount,
    organization
  } = useStore();
  
  const [expandedPlatform, setExpandedPlatform] = useState<Platform | null>(null);
  
  // 计算各平台的未读消息数
  const platformUnreadCounts = conversations.reduce((acc, conv) => {
    acc[conv.platform] = (acc[conv.platform] || 0) + conv.unreadCount;
    return acc;
  }, {} as Record<string, number>);
  
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  
  const mainNavItems = [
    { id: 'dashboard', name: '概览', icon: LayoutDashboard, badge: null },
    { id: 'conversations', name: '会话', icon: MessagesIcon, badge: totalUnread },
    { id: 'customers', name: '客户', icon: Users, badge: null },
    { id: 'analytics', name: '数据', icon: BarChart3, badge: null },
  ];
  
  const bottomNavItems = [
    { id: 'settings', name: '设置', icon: Settings, badge: null },
    { id: 'help', name: '帮助', icon: HelpCircle, badge: null },
  ];
  
  return (
    <>
      <div 
        className={cn(
          "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">ChatBiz</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center mx-auto">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
          )}
          {!sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
          )}
          {sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="absolute -right-3 top-4 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
            >
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>
        
        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange?.(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  activeSection === item.id
                    ? "bg-[#FF6B35] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className={cn(
                  "flex-shrink-0",
                  sidebarCollapsed ? "w-5 h-5 mx-auto" : "w-5 h-5"
                )} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left text-sm font-medium">{item.name}</span>
                    {item.badge !== null && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && item.badge !== null && item.badge > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-medium bg-red-500 text-white rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
          
          {/* Platform Filter - 只在会话页面显示 */}
          {!sidebarCollapsed && activeSection === 'conversations' && (
            <div className="mt-6 px-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  平台与账号
                </span>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedPlatform('all')}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm",
                    selectedPlatform === 'all'
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="flex-1 text-left">全部平台</span>
                  {totalUnread > 0 && (
                    <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                      {totalUnread}
                    </span>
                  )}
                </button>
                
                {platformConfigs.filter(p => p.enabled).map((platform) => {
                  const Icon = iconMap[platform.icon] || MessageCircle;
                  const unreadCount = platformUnreadCounts[platform.id] || 0;
                  const accounts = getPlatformAccounts(platform.id);
                  const selectedAccount = getSelectedAccount(platform.id);
                  const hasMultipleAccounts = accounts.length > 1;
                  const isExpanded = expandedPlatform === platform.id;
                  const isSelected = selectedPlatform === platform.id;
                  
                  return (
                    <div key={platform.id}>
                      <button
                        onClick={() => {
                          setSelectedPlatform(platform.id);
                          if (hasMultipleAccounts) {
                            setExpandedPlatform(isExpanded ? null : platform.id);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm",
                          isSelected
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <div style={{ color: platform.color }}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="flex-1 text-left">{platform.name}</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                        {hasMultipleAccounts && (
                          <ChevronDown 
                            className={cn(
                              "w-3 h-3 text-gray-400 transition-transform",
                              isExpanded && "rotate-180"
                            )} 
                          />
                        )}
                      </button>
                      
                      {/* 账号列表 - 展开时显示，包含完整管理功能 */}
                      {isExpanded && (
                        <AccountListInline
                          platform={platform.id}
                          accounts={accounts}
                          selectedAccount={selectedAccount}
                          onSelectAccount={(accountId) => setPlatformAccount(platform.id, accountId)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom Navigation */}
        <div className="p-2 border-t border-gray-100">
          <nav className="space-y-1">
            {bottomNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange?.(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-gray-600 hover:bg-gray-100",
                  activeSection === item.id && "bg-gray-100 text-gray-900"
                )}
              >
                <item.icon className={cn(
                  "flex-shrink-0",
                  sidebarCollapsed ? "w-5 h-5 mx-auto" : "w-5 h-5"
                )} />
                {!sidebarCollapsed && (
                  <span className="text-left text-sm font-medium">{item.name}</span>
                )}
              </button>
            ))}
          </nav>
          
          {/* 账号信息区域 */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            {/* 管理中心入口 */}
            {userSettings.role === 'admin' && (
              <button
                onClick={onOpenAdminCenter}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-gray-600 hover:bg-gray-100 mb-2",
                  sidebarCollapsed && "justify-center"
                )}
              >
                <Building2 className={cn(
                  "flex-shrink-0",
                  sidebarCollapsed ? "w-5 h-5" : "w-5 h-5"
                )} />
                {!sidebarCollapsed && (
                  <span className="text-left text-sm font-medium">管理中心</span>
                )}
              </button>
            )}

            {/* 账号信息卡片 */}
            {!sidebarCollapsed ? (
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  {organization.loginMode === 'activation_with_password' ? (
                    <>
                      {/* 账号密码模式：显示账号、组织、角色、激活码、端口信息 */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">账号</span>
                        <span className="text-xs font-medium text-gray-900">{userSettings.name || 'admin'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">组织</span>
                        <span className="text-xs font-medium text-gray-900">{organization.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">角色</span>
                        <span className="text-xs font-medium text-[#FF6B35]">
                          {userSettings.role === 'admin' ? '管理员' : '成员'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">激活码</span>
                        <span className="text-xs font-medium text-gray-900">{organization.activationCode}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">会话端口</span>
                        <span className="text-xs font-medium text-gray-900">
                          <span className="text-[#FF6B35]">8</span>
                          <span className="text-gray-400">/</span>
                          <span>10</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">到期时间</span>
                        <span className="text-xs font-medium text-gray-900">
                          {organization.expiresAt instanceof Date
                            ? organization.expiresAt.toLocaleDateString('zh-CN')
                            : organization.expiresAt || '2026-12-31'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* 仅激活码模式：显示激活码、端口、版本信息 */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">激活码</span>
                        <span className="text-xs font-medium text-gray-900">{organization.activationCode}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">会话端口</span>
                        <span className="text-xs font-medium text-gray-900">
                          <span className="text-[#FF6B35]">8</span>
                          <span className="text-gray-400">/</span>
                          <span>10</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">到期时间</span>
                        <span className="text-xs font-medium text-gray-900">
                          {organization.expiresAt instanceof Date
                            ? organization.expiresAt.toLocaleDateString('zh-CN')
                            : organization.expiresAt || '2026-12-31'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">购买版本</span>
                        <span className="text-xs font-medium text-[#FF6B35]">专业版</span>
                      </div>
                    </>
                  )}
                </div>
                {/* 续费和退出登录按钮 */}
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 bg-[#FF6B35] text-white text-xs font-medium rounded-lg hover:bg-[#E85A2A] transition-colors">
                    续费
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="w-3 h-3" />
                    退出登录
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="退出登录"
              >
                <LogOut className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
