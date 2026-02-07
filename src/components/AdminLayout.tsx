import React, { useState } from 'react';
import {
  Key,
  Building2,
  Users,
  Shield,
  BarChart3,
  Settings,
  LogOut,
  MessageCircle,
  ChevronLeft,
  Menu,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { AdminCenter } from './AdminCenter';
import { AdminChatView } from './AdminChatView';
import type { ActivationCode } from '@/types';

type AdminSection = 'activation-codes' | 'org-settings' | 'members' | 'security' | 'statistics' | 'settings' | 'audit';

interface AdminLayoutProps {
  onBack?: () => void;
  children?: React.ReactNode;
}

const menuItems: { id: AdminSection; name: string; icon: React.ComponentType<{ className?: string }>; }[] = [
  { id: 'activation-codes', name: '激活码管理', icon: Key },
  { id: 'audit', name: '聊天记录', icon: Eye },
  { id: 'members', name: '成员管理', icon: Users },
  { id: 'org-settings', name: '组织设置', icon: Building2 },
  { id: 'statistics', name: '数据统计', icon: BarChart3 },
  { id: 'security', name: '安全设置', icon: Shield },
  { id: 'settings', name: '系统设置', icon: Settings },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('activation-codes');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [auditCode, setAuditCode] = useState<ActivationCode | null>(null);
  const organization = useStore((state) => state.organization);

  // 从激活码列表跳转到内控管理查看聊天记录
  const handleViewChat = (code: ActivationCode) => {
    setAuditCode(code);
    setActiveSection('audit');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 侧边栏 */}
      <div
        className={cn(
          "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-56"
        )}
      >
        {/* Logo 区域 */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          {!sidebarCollapsed ? (
            <>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">洽</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{organization.name}</p>
                  <p className="text-[10px] text-gray-400">管理后台</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center mx-auto hover:bg-[#E85A2A] transition-colors"
            >
              <Menu className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {/* 菜单列表 */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                activeSection === item.id
                  ? "bg-[#FF6B35] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              title={sidebarCollapsed ? item.name : undefined}
            >
              <item.icon className={cn("flex-shrink-0", sidebarCollapsed ? "w-5 h-5 mx-auto" : "w-5 h-5")} />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium truncate">{item.name}</span>
              )}
            </button>
          ))}
        </nav>

        {/* 底部操作区 */}
        <div className="p-2 border-t border-gray-100 space-y-1">
          {/* 返回客户端 */}
          <button
            onClick={onBack}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-gray-600 hover:bg-gray-100",
              sidebarCollapsed && "justify-center"
            )}
          >
            <MessageCircle className={cn("flex-shrink-0 w-5 h-5")} />
            {!sidebarCollapsed && <span className="text-sm font-medium">返回客户端</span>}
          </button>
          {/* 退出登录 */}
          <button
            onClick={onBack}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-gray-600 hover:bg-gray-100",
              sidebarCollapsed && "justify-center"
            )}
          >
            <LogOut className={cn("flex-shrink-0 w-5 h-5")} />
            {!sidebarCollapsed && <span className="text-sm font-medium">退出登录</span>}
          </button>
        </div>
      </div>

      {/* 右侧内容区 */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 顶部标题栏 */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {menuItems.find(m => m.id === activeSection)?.name}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">{organization.name}</p>
          </div>
        </header>

        {/* 页面内容 */}
        <div className="flex-1 overflow-auto">
          <AdminContent section={activeSection} onViewChat={handleViewChat} auditCode={auditCode} onClearAuditCode={() => setAuditCode(null)} />
        </div>
      </div>
    </div>
  );
};

// 内容区路由组件
const AdminContent: React.FC<{
  section: AdminSection;
  onViewChat: (code: ActivationCode) => void;
  auditCode: ActivationCode | null;
  onClearAuditCode: () => void;
}> = ({ section, onViewChat, auditCode, onClearAuditCode }) => {
  switch (section) {
    case 'activation-codes':
      return <AdminCenter onViewChat={onViewChat} />;
    case 'audit':
      return <AdminChatView initialCode={auditCode} onClearCode={onClearAuditCode} />;
    case 'members':
      return (
        <PlaceholderPage
          icon={Users}
          title="成员管理"
          description="管理组织成员、分配角色和权限"
        />
      );
    case 'org-settings':
      return (
        <PlaceholderPage
          icon={Building2}
          title="组织设置"
          description="配置组织基本信息和偏好设置"
        />
      );
    case 'statistics':
      return (
        <PlaceholderPage
          icon={BarChart3}
          title="数据统计"
          description="查看组织运营数据和分析报表"
        />
      );
    case 'security':
      return (
        <PlaceholderPage
          icon={Shield}
          title="安全设置"
          description="管理安全策略、登录限制和审计日志"
        />
      );
    case 'settings':
      return (
        <PlaceholderPage
          icon={Settings}
          title="系统设置"
          description="配置系统参数和全局选项"
        />
      );
    default:
      return null;
  }
};

// 占位页面组件
const PlaceholderPage: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400">
    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-gray-300" />
    </div>
    <h3 className="text-lg font-medium text-gray-500 mb-1">{title}</h3>
    <p className="text-sm">{description}</p>
    <p className="text-xs mt-3 text-gray-300">功能开发中...</p>
  </div>
);

export default AdminLayout;
