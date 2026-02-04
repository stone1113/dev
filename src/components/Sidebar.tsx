import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { platformConfigs } from '@/data/mockData';
import type { Platform } from '@/types';
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
  Check,
  MoreHorizontal,
  QrCode,
  Globe,
  LogIn,
  FileText,
  Building2
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

// 账号管理模态框
interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: Platform | null;
  onOpenProxySettings?: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, platform, onOpenProxySettings }) => {
  const {
    getPlatformAccounts,
    addPlatformAccount,
    deletePlatformAccount,
    updatePlatformAccount
  } = useStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingRemark, setEditingRemark] = useState<string | null>(null);
  const [newAccountName, setNewAccountName] = useState('');
  const [remarkValue, setRemarkValue] = useState('');
  const [showQrCode, setShowQrCode] = useState<string | null>(null);

  if (!isOpen || !platform) return null;

  const accounts = getPlatformAccounts(platform);
  const platformConfig = platformConfigs.find(p => p.id === platform);

  const handleAddAccount = () => {
    if (newAccountName.trim()) {
      addPlatformAccount({
        platformId: platform,
        name: newAccountName.trim(),
        accountId: '',
        status: 'not_logged_in',
        isDefault: false,
        messageCount: 0,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${newAccountName.trim()}&backgroundColor=${platformConfig?.color.replace('#', '')}`,
        remark: '待登录',
      });
      setNewAccountName('');
      setIsAdding(false);
    }
  };

  const handleDeleteAccount = (accountId: string) => {
    deletePlatformAccount(accountId);
  };

  const handleUpdateRemark = (accountId: string) => {
    updatePlatformAccount(accountId, { remark: remarkValue.trim() });
    setEditingRemark(null);
    setRemarkValue('');
  };

  const handleLogin = (accountId: string) => {
    setShowQrCode(accountId);
  };

  const handleProxySettings = () => {
    onClose();
    onOpenProxySettings?.();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-96 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${platformConfig?.color}20` }}
            >
              <span className="text-lg" style={{ color: platformConfig?.color }}>
                {platformConfig?.name.slice(0, 1)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{platformConfig?.name} 账号管理</h3>
              <p className="text-xs text-gray-500">{accounts.length} 个账号</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        {/* Account List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={cn(
                "p-3 rounded-lg border transition-all",
                account.status === 'not_logged_in'
                  ? "bg-amber-50 border-amber-200"
                  : "bg-gray-50 border-transparent hover:bg-gray-100"
              )}
            >
              {/* 账号信息行 */}
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <img src={account.avatar} alt={account.name} className="w-10 h-10 rounded-full object-cover" />
                  <span className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white",
                    account.status === 'online' ? "bg-green-500" :
                    account.status === 'busy' ? "bg-amber-500" :
                    account.status === 'not_logged_in' ? "bg-gray-400" : "bg-gray-400"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{account.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {account.status === 'not_logged_in' ? '未登录' : account.accountId || '未设置'}
                  </p>
                </div>
              </div>

              {/* 备注编辑行 */}
              <div className="mt-2 flex items-center gap-2">
                {editingRemark === account.id ? (
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      type="text"
                      value={remarkValue}
                      onChange={(e) => setRemarkValue(e.target.value)}
                      placeholder="输入备注..."
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#FF6B35]"
                      autoFocus
                    />
                    <button onClick={() => handleUpdateRemark(account.id)} className="p-1 hover:bg-green-100 rounded">
                      <Check className="w-3 h-3 text-green-600" />
                    </button>
                    <button onClick={() => { setEditingRemark(null); setRemarkValue(''); }} className="p-1 hover:bg-gray-200 rounded">
                      <X className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingRemark(account.id); setRemarkValue(account.remark || ''); }}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
                  >
                    <FileText className="w-3 h-3" />
                    <span>{account.remark || '添加备注'}</span>
                  </button>
                )}
              </div>

              {/* 操作按钮行 */}
              <div className="mt-3 flex items-center gap-2">
                {account.status === 'not_logged_in' ? (
                  <button
                    onClick={() => handleLogin(account.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#FF6B35] rounded-lg hover:bg-[#E85A2A] transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    扫码登录
                  </button>
                ) : (
                  <button
                    onClick={() => handleLogin(account.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    重新登录
                  </button>
                )}
                <button
                  onClick={handleProxySettings}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  环境配置
                </button>
                <button
                  onClick={() => handleDeleteAccount(account.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="删除账号"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

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
        </div>
        
        {/* Add Account Form */}
        {isAdding && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">账号名称</label>
                <input
                  type="text"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  placeholder="例如：客服小王"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setIsAdding(false); setNewAccountName(''); }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddAccount}
                  disabled={!newAccountName.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] rounded-lg hover:bg-[#E85A2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        {!isAdding && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#FF6B35] bg-[#FF6B35]/10 rounded-lg hover:bg-[#FF6B35]/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加新账号
            </button>
          </div>
        )}
      </div>
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
    setPlatformAccount
  } = useStore();
  
  const [expandedPlatform, setExpandedPlatform] = useState<Platform | null>(null);
  const [managingPlatform, setManagingPlatform] = useState<Platform | null>(null);
  
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
                      
                      {/* 账号选择器 - 展开时显示 */}
                      {isExpanded && hasMultipleAccounts && (
                        <div className="ml-4 mt-1 pl-3 border-l-2 border-gray-200">
                          <div className="space-y-1">
                            {accounts.map((account) => (
                              <button
                                key={account.id}
                                onClick={() => setPlatformAccount(platform.id, account.id)}
                                className={cn(
                                  "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-xs",
                                  selectedAccount?.id === account.id
                                    ? "bg-[#FF6B35]/10 text-[#FF6B35]"
                                    : "text-gray-500 hover:bg-gray-50"
                                )}
                              >
                                <div className="relative flex-shrink-0">
                                  <img
                                    src={account.avatar}
                                    alt={account.name}
                                    className="w-5 h-5 rounded-full object-cover"
                                  />
                                  <span className={cn(
                                    "absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-white",
                                    account.status === 'online' ? "bg-green-500" :
                                    account.status === 'busy' ? "bg-amber-500" : "bg-gray-400"
                                  )} />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                  <div className="flex items-center gap-1">
                                    <span className="truncate">{account.name}</span>
                                    {account.remark && (
                                      <span className="text-[10px] text-gray-400 truncate">({account.remark})</span>
                                    )}
                                  </div>
                                  {(account.ip || account.proxyRegion) && (
                                    <span className="block text-[10px] text-gray-400 truncate">
                                      {account.proxyRegion && <span>{account.proxyRegion}</span>}
                                      {account.ip && account.proxyRegion && <span className="mx-0.5">·</span>}
                                      {account.ip && <span>{account.ip}</span>}
                                    </span>
                                  )}
                                </div>
                                {selectedAccount?.id === account.id && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] flex-shrink-0" />
                                )}
                              </button>
                            ))}
                            {/* 管理账号按钮 */}
                            <button
                              onClick={() => setManagingPlatform(platform.id)}
                              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-xs text-gray-400 hover:text-[#FF6B35] hover:bg-[#FF6B35]/5"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                              <span className="flex-1 text-left">管理账号</span>
                            </button>
                          </div>
                        </div>
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
          
          {/* User Profile */}
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
            <button
              onClick={onLogout}
              className={cn(
              "w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors",
              sidebarCollapsed && "justify-center"
            )}>
              <img
                src={userSettings.avatar}
                alt={userSettings.name}
                className="w-8 h-8 rounded-full object-cover bg-gray-100"
              />
              {!sidebarCollapsed && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">{userSettings.name}</p>
                  <p className="text-xs text-gray-500">{userSettings.role === 'admin' ? '管理员' : '客服'}</p>
                </div>
              )}
              {!sidebarCollapsed && (
                <LogOut className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Account Management Modal */}
      <AccountModal
        isOpen={!!managingPlatform}
        onClose={() => setManagingPlatform(null)}
        platform={managingPlatform}
      />
    </>
  );
};

export default Sidebar;
