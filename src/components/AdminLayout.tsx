import React, { useState, useMemo, useEffect } from 'react';
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
  ChevronDown,
  Menu,
  Eye,
  Search,
  Bot,
  Sparkles,
  Send,
  MessageSquare,
  Instagram,
  Facebook,
  Mail,
  Smartphone,
  Music,
  Twitter,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ChevronRight,
  User,
  Zap,
  BookOpen,
  Tags,
  Filter,
  Plus,
  MapPin,
  UserCircle,
  ClipboardList,
  Download,
  AlertCircle,
  Globe,
  FileText,
  Lightbulb,
  Tag,
  Trash2,
  Pencil,
  Upload,
  GitBranch,
  Lock,
  Unlock,
  FolderTree,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import type { Department } from '@/types';
import { platformConfigs } from '@/data/mockData';
import { AdminCenter } from './AdminCenter';
import { AdminChatView } from './AdminChatView';
import { AILabelsPage } from './AILabelsPage';
import { KnowledgeBasePage } from './KnowledgeBasePage';
import { CustomerAIProfile } from './CustomerAIProfile';
import { OrganizationStructure } from './OrganizationStructure';
import { AccountManagement } from './AccountManagement';
import { ProxyManagement } from './ProxyManagement';
import { DashboardPage } from './DashboardPage';
import type { ActivationCode } from '@/types';

// 统一管理端复选框和单选按钮样式
const adminCheckboxStyle = `
  [type='checkbox']:checked,
  input[type='checkbox']:checked {
    background-color: #FF6B35 !important;
    border-color: #FF6B35 !important;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e") !important;
  }
  [type='radio']:checked,
  input[type='radio']:checked {
    background-color: #FF6B35 !important;
    border-color: #FF6B35 !important;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e") !important;
  }
`;

type AdminSection = 'dashboard' | 'activation-codes' | 'org-settings' | 'members' | 'security' | 'statistics' | 'settings' | 'audit' | 'audit-report' | 'ai-settings' | 'ai-config' | 'ai-config-detail' | 'ai-persona-config' | 'ai-knowledge' | 'ai-scripts' | 'ai-labels' | 'ai-templates' | 'customer-list' | 'customer-detail' | 'ticket-list' | 'proxy-management';

interface AdminLayoutProps {
  onBack?: () => void;
  children?: React.ReactNode;
}

const menuItems: { id: AdminSection; name: string; icon: React.ComponentType<{ className?: string }>; }[] = [
  { id: 'dashboard', name: '工作台', icon: BarChart3 },
  { id: 'activation-codes', name: '激活码管理', icon: Key },
  { id: 'proxy-management', name: '代理IP管理', icon: Globe },
  { id: 'statistics', name: '数据统计', icon: BarChart3 },
  { id: 'security', name: '安全设置', icon: Shield },
  { id: 'settings', name: '系统设置', icon: Settings },
];

// 内控管理子菜单
const auditSubMenuItems: { id: AdminSection; name: string; icon: React.ComponentType<{ className?: string }>; }[] = [
  { id: 'audit', name: '聊天记录', icon: Eye },
  { id: 'audit-report', name: '内控报表', icon: BarChart3 },
];

// 客户管理子菜单
const customerSubMenuItems: { id: AdminSection; name: string; icon: React.ComponentType<{ className?: string }>; }[] = [
  { id: 'customer-list', name: '客户列表', icon: UserCircle },
];

// 平台工单子菜单
const ticketSubMenuItems: { id: AdminSection; name: string; icon: React.ComponentType<{ className?: string }>; }[] = [
  { id: 'ticket-list', name: '工单列表', icon: ClipboardList },
];

// 组织架构子菜单
const orgSubMenuItems: { id: AdminSection; name: string; icon: React.ComponentType<{ className?: string }>; }[] = [
  { id: 'members', name: '账号管理', icon: Users },
  { id: 'org-settings', name: '组织设置', icon: Building2 },
];

// AI配置子菜单
const aiSubMenuItems: { id: AdminSection; name: string; icon: React.ComponentType<{ className?: string }>; }[] = [
  { id: 'ai-config', name: 'AI员工设置', icon: Sparkles },
  { id: 'ai-settings', name: 'AI功能使用情况', icon: Bot },
  { id: 'ai-knowledge', name: '知识库配置', icon: BookOpen },
  { id: 'ai-labels', name: 'AI标签配置', icon: Tags },
  { id: 'ai-templates', name: '个性化配置', icon: FileText },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiMenuExpanded, setAiMenuExpanded] = useState(false);
  const [auditMenuExpanded, setAuditMenuExpanded] = useState(false);
  const [customerMenuExpanded, setCustomerMenuExpanded] = useState(false);
  const [ticketMenuExpanded, setTicketMenuExpanded] = useState(false);
  const [orgMenuExpanded, setOrgMenuExpanded] = useState(false);
  const isAiSection = activeSection === 'ai-config' || activeSection === 'ai-config-detail' || activeSection === 'ai-settings' || activeSection === 'ai-knowledge' || activeSection === 'ai-labels' || activeSection === 'ai-templates';
  const isAuditSection = activeSection === 'audit' || activeSection === 'audit-report';
  const isCustomerSection = activeSection === 'customer-list' || activeSection === 'customer-detail';
  const isTicketSection = activeSection === 'ticket-list';
  const isOrgSection = activeSection === 'members' || activeSection === 'org-settings';
  const [auditCode, setAuditCode] = useState<ActivationCode | null>(null);
  const [detailCustomerId, setDetailCustomerId] = useState<string | null>(null);
  const [filterRoleId, setFilterRoleId] = useState<string | null>(null);
  const organization = useStore((state) => state.organization);

  // 从激活码列表跳转到内控管理查看聊天记录
  const handleViewChat = (code: ActivationCode) => {
    setAuditCode(code);
    setActiveSection('audit');
  };

  // 从客户列表跳转到客户详情
  const handleViewCustomerDetail = (customerId: string) => {
    setDetailCustomerId(customerId);
    setActiveSection('customer-detail');
  };

  const handleBackToCustomerList = () => {
    setDetailCustomerId(null);
    setActiveSection('customer-list');
  };

  // AI员工列表 → 详情
  const handleViewAIEmployee = (employeeId: string) => {
    useStore.getState().selectAIEmployee(employeeId);
    setActiveSection('ai-config-detail');
  };

  const handleBackToAIList = () => {
    setActiveSection('ai-config');
  };

  const handleGoToPersonaConfig = () => {
    setActiveSection('ai-templates');
  };

  const handleBackToAIDetail = () => {
    setActiveSection('ai-config-detail');
  };

  // 从组织设置跳转到账号管理查看角色账号
  const handleViewRoleAccounts = (roleId: string) => {
    setFilterRoleId(roleId);
    setActiveSection('members');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <style>{adminCheckboxStyle}</style>
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
          {/* 激活码管理 */}
          {menuItems.slice(0, 1).map((item) => (
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

          {/* 客户管理分组 */}
          {sidebarCollapsed ? (
            <button
              onClick={() => setActiveSection('customer-list')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isCustomerSection
                  ? "bg-[#FF6B35] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              title="客户管理"
            >
              <Users className="flex-shrink-0 w-5 h-5 mx-auto" />
            </button>
          ) : (
            <>
              <button
                onClick={() => setCustomerMenuExpanded(!customerMenuExpanded)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isCustomerSection
                    ? "bg-[#FF6B35]/10 text-[#FF6B35]"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Users className="flex-shrink-0 w-5 h-5" />
                <span className="text-sm font-medium truncate flex-1 text-left">客户管理</span>
                {(customerMenuExpanded || isCustomerSection) ? (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                )}
              </button>
              {(customerMenuExpanded || isCustomerSection) && (
                <div className="ml-4 space-y-0.5">
                  {customerSubMenuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm",
                        activeSection === item.id
                          ? "bg-[#FF6B35] text-white font-medium"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      )}
                    >
                      <item.icon className="flex-shrink-0 w-4 h-4" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* 平台工单分组 */}
          {sidebarCollapsed ? (
            <button
              onClick={() => setActiveSection('ticket-list')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isTicketSection
                  ? "bg-[#FF6B35] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              title="平台工单"
            >
              <ClipboardList className="flex-shrink-0 w-5 h-5 mx-auto" />
            </button>
          ) : (
            <>
              <button
                onClick={() => setTicketMenuExpanded(!ticketMenuExpanded)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isTicketSection
                    ? "bg-[#FF6B35]/10 text-[#FF6B35]"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <ClipboardList className="flex-shrink-0 w-5 h-5" />
                <span className="text-sm font-medium truncate flex-1 text-left">平台工单</span>
                {(ticketMenuExpanded || isTicketSection) ? (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                )}
              </button>
              {(ticketMenuExpanded || isTicketSection) && (
                <div className="ml-4 space-y-0.5">
                  {ticketSubMenuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm",
                        activeSection === item.id
                          ? "bg-[#FF6B35] text-white font-medium"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      )}
                    >
                      <item.icon className="flex-shrink-0 w-4 h-4" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* 内控管理分组 */}
          {sidebarCollapsed ? (
            <button
              onClick={() => setActiveSection('audit')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isAuditSection
                  ? "bg-[#FF6B35] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              title="内控管理"
            >
              <Shield className="flex-shrink-0 w-5 h-5 mx-auto" />
            </button>
          ) : (
            <>
              <button
                onClick={() => setAuditMenuExpanded(!auditMenuExpanded)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isAuditSection
                    ? "bg-[#FF6B35]/10 text-[#FF6B35]"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Search className="flex-shrink-0 w-5 h-5" />
                <span className="text-sm font-medium truncate flex-1 text-left">内控管理</span>
                {(auditMenuExpanded || isAuditSection) ? (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                )}
              </button>
              {(auditMenuExpanded || isAuditSection) && (
                <div className="ml-4 space-y-0.5">
                  {auditSubMenuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm",
                        activeSection === item.id
                          ? "bg-[#FF6B35] text-white font-medium"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      )}
                    >
                      <item.icon className="flex-shrink-0 w-4 h-4" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* AI配置分组 */}
          {sidebarCollapsed ? (
            // 收起状态：只显示图标，点击展开第一个子项
            <button
              onClick={() => setActiveSection('ai-config')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isAiSection
                  ? "bg-[#FF6B35] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              title="AI配置"
            >
              <Sparkles className="flex-shrink-0 w-5 h-5 mx-auto" />
            </button>
          ) : (
            <>
              {/* AI配置父级按钮 */}
              <button
                onClick={() => setAiMenuExpanded(!aiMenuExpanded)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isAiSection
                    ? "bg-[#FF6B35]/10 text-[#FF6B35]"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Sparkles className="flex-shrink-0 w-5 h-5" />
                <span className="text-sm font-medium truncate flex-1 text-left">AI配置</span>
                {(aiMenuExpanded || isAiSection) ? (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                )}
              </button>
              {/* AI子菜单 */}
              {(aiMenuExpanded || isAiSection) && (
                <div className="ml-4 space-y-0.5">
                  {aiSubMenuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm",
                        activeSection === item.id
                          ? "bg-[#FF6B35] text-white font-medium"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      )}
                    >
                      <item.icon className="flex-shrink-0 w-4 h-4" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* 组织架构分组 */}
          {sidebarCollapsed ? (
            <button
              onClick={() => setActiveSection('members')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isOrgSection
                  ? "bg-[#FF6B35] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              title="组织架构"
            >
              <Building2 className="flex-shrink-0 w-5 h-5 mx-auto" />
            </button>
          ) : (
            <>
              <button
                onClick={() => setOrgMenuExpanded(!orgMenuExpanded)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isOrgSection
                    ? "bg-[#FF6B35]/10 text-[#FF6B35]"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Building2 className="flex-shrink-0 w-5 h-5" />
                <span className="text-sm font-medium truncate flex-1 text-left">组织架构</span>
                {(orgMenuExpanded || isOrgSection) ? (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                )}
              </button>
              {(orgMenuExpanded || isOrgSection) && (
                <div className="ml-4 space-y-0.5">
                  {orgSubMenuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm",
                        activeSection === item.id
                          ? "bg-[#FF6B35] text-white font-medium"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      )}
                    >
                      <item.icon className="flex-shrink-0 w-4 h-4" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* 剩余菜单项 */}
          {menuItems.slice(1).map((item) => (
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
              {menuItems.find(m => m.id === activeSection)?.name || aiSubMenuItems.find(m => m.id === activeSection)?.name || auditSubMenuItems.find(m => m.id === activeSection)?.name || customerSubMenuItems.find(m => m.id === activeSection)?.name || ticketSubMenuItems.find(m => m.id === activeSection)?.name || orgSubMenuItems.find(m => m.id === activeSection)?.name || (activeSection === 'customer-detail' ? '客户详情' : '') || (activeSection === 'ai-config-detail' ? 'AI员工配置' : '')}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">{organization.name}</p>
          </div>
        </header>

        {/* 页面内容 */}
        <div className="flex-1 min-h-0 relative">
          <div className="absolute inset-0">
            <AdminContent section={activeSection} onViewChat={handleViewChat} auditCode={auditCode} onClearAuditCode={() => setAuditCode(null)} detailCustomerId={detailCustomerId} onViewCustomerDetail={handleViewCustomerDetail} onBackToCustomerList={handleBackToCustomerList} onViewAIEmployee={handleViewAIEmployee} onBackToAIList={handleBackToAIList} onGoToPersonaConfig={handleGoToPersonaConfig} onBackToAIDetail={handleBackToAIDetail} filterRoleId={filterRoleId} onClearFilterRole={() => setFilterRoleId(null)} onViewRoleAccounts={handleViewRoleAccounts} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── 管理端内容模板管理 ────────────────────────────────────────────────────────

type AdminTemplateSubPage =
  | 'persona-styles'
  | 'intent-single'
  | 'intent-group'
  | 'strategy-single'
  | 'strategy-group'
  | 'script-welcome'
  | 'keyword-single'
  | 'keyword-group';

interface AdminTemplateSceneItem { id: AdminTemplateSubPage; label: string; }
interface AdminTemplateScene {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  items: AdminTemplateSceneItem[];
}

const adminTemplateScenes: AdminTemplateScene[] = [
  {
    id: 'persona', label: '角色人设', icon: Users,
    items: [
      { id: 'persona-styles', label: '角色人设' },
    ],
  },
  {
    id: 'intent', label: '意图库', icon: Lightbulb,
    items: [
      { id: 'intent-single', label: '单聊意图' },
      { id: 'intent-group', label: '群聊意图' },
    ],
  },
  {
    id: 'strategy', label: '策略库', icon: GitBranch,
    items: [
      { id: 'strategy-single', label: '单聊策略' },
      { id: 'strategy-group', label: '群聊策略' },
    ],
  },
  {
    id: 'script', label: '话术库', icon: MessageSquare,
    items: [
      { id: 'script-welcome', label: '欢迎语话术' },
    ],
  },
  {
    id: 'keyword', label: '关键词回复', icon: Tag,
    items: [
      { id: 'keyword-single', label: '单聊关键词' },
      { id: 'keyword-group', label: '群聊关键词' },
    ],
  },
];

// ─── 角色人设 ──────────────────────────────────────────────────────────────────

interface AdminPersonaStyle {
  id: number;
  styleName: string;
  desc: string;
  tags: string[];
  scripts: string[];
  scope: string;
  avatarBg: string;
  avatarText: string;
  source: '平台下发' | '企业自建';
  enabled: boolean;
}

const adminMockPersonaStyles: AdminPersonaStyle[] = [
  {
    id: 1,
    styleName: '热情店长',
    desc: '以店长身份与客户沟通，态度热情诚恳，对品牌和产品很自信，有一定的品牌宣导性，适合30-45岁形象定位。',
    tags: ['热情', '自信', '品牌感'],
    scripts: [
      '亲，您眼光真好！这款是我们今年最热卖的，现在下单还有专属折扣哦～',
      '作为店长，我可以负责任地说，这绝对是目前性价比最高的选择！',
    ],
    scope: '电商售前',
    avatarBg: 'from-orange-100 to-amber-100',
    avatarText: '店',
    source: '平台下发', enabled: true,
  },
  {
    id: 2,
    styleName: '客户经理',
    desc: '一位门店客户经理，在25-35岁之间，话术感受留意适中，存在适当的语气词柔和话术，专业又不失亲和。',
    tags: ['专业', '亲和', '留意适中'],
    scripts: [
      '您好，感谢您的咨询。根据您的需求，我为您推荐以下几款方案，请参考。',
      '我完全理解您的顾虑，这边帮您详细说明一下各项差异，方便您做判断。',
    ],
    scope: '门店服务',
    avatarBg: 'from-blue-100 to-indigo-100',
    avatarText: '经',
    source: '平台下发', enabled: true,
  },
  {
    id: 3,
    styleName: '专业极简',
    desc: '一位简洁高效的销售，简洁明了地解答客户疑问，用最少的话传递最有效的信息，与客户高效沟通。',
    tags: ['简洁', '高效', '直接'],
    scripts: [
      '收到。订单号多少？',
      '已处理，3个工作日到账。如有问题请联系。',
    ],
    scope: '通用客服',
    avatarBg: 'from-gray-100 to-slate-100',
    avatarText: '简',
    source: '平台下发', enabled: false,
  },
  {
    id: 4,
    styleName: '甜美主播',
    desc: '一位美女主播，年龄在24-28岁之间，语气温柔可爱，温和地解答客户疑问，让客户体验良好，适合直播电商场景。',
    tags: ['温柔', '可爱', '互动感强'],
    scripts: [
      '哇～宝宝们这款真的超级好用！我自己用了一个月啦，皮肤状态杠杠的～🌟',
      '姐妹不用担心，这个我们支持7天无理由的，放心入手吧！比心心～💕',
    ],
    scope: '直播电商',
    avatarBg: 'from-pink-100 to-rose-100',
    avatarText: '播',
    source: '平台下发', enabled: false,
  },
  {
    id: 5,
    styleName: '品牌专属助手',
    desc: '完全按照我们品牌调性定制，语气亲切有温度，突出品牌特色和服务优势，传递专属感。',
    tags: ['品牌感', '专属', '温度'],
    scripts: [
      '您好！欢迎来到{品牌名}，我是您的专属服务顾问，随时为您效劳～',
      '感谢您一直支持{品牌名}！您是我们最重要的客户，有任何需求都可以告诉我。',
    ],
    scope: '品牌客服',
    avatarBg: 'from-violet-100 to-purple-100',
    avatarText: '专',
    source: '企业自建', enabled: false,
  },
];

function AdminPersonaTable() {
  const [styles, setStyles] = useState(adminMockPersonaStyles);
  const [selected, setSelected] = useState<number | null>(1);

  const activeStyle = styles.find(p => p.id === selected);
  const unlockedCount = 14;
  const lockedCount = 6;

  return (
    <div className="p-6 space-y-5">
      {/* 当前人设影响提示 */}
      {activeStyle && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
          <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0 text-sm font-bold text-gray-500', activeStyle.avatarBg)}>
            {activeStyle.avatarText}
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold text-gray-700">默认风格：{activeStyle.styleName}</span>
            <span className="text-xs text-gray-400 ml-2">将影响 <span className="text-[#FF6B35] font-medium">{unlockedCount} 条未锁定话术</span>的输出风格</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Unlock size={11} className="text-[#FF6B35]" />{unlockedCount} 条随人设调整</span>
            <span className="flex items-center gap-1"><Lock size={11} className="text-gray-400" />{lockedCount} 条精准锁定</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <p className="text-xs text-gray-400">选择一种话术风格作为 AI 员工的默认沟通方式，影响所有未锁定话术的输出</p>
        <div className="ml-auto">
          <button className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-500 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-all">
            <Plus size={12} />自定义风格
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {styles.map(p => (
          <div
            key={p.id}
            onClick={() => setSelected(p.id === selected ? null : p.id)}
            className={cn(
              'relative rounded-xl border bg-white cursor-pointer transition-all overflow-hidden flex flex-col',
              selected === p.id
                ? 'border-[#FF6B35] shadow-md shadow-orange-100 ring-1 ring-[#FF6B35]/20'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            )}
          >
            {/* 来源标签 */}
            <div className="absolute top-3 left-3">
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-md border',
                p.source === '平台下发'
                  ? 'bg-purple-50 text-purple-400 border-purple-200'
                  : 'bg-gray-50 text-gray-400 border-gray-200'
              )}>{p.source}</span>
            </div>

            {/* 激活标记 */}
            {selected === p.id ? (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#FF6B35] text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                <svg width="8" height="6" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                默认风格
              </div>
            ) : (
              <div className="absolute top-3 right-3 text-[10px] text-gray-300 border border-gray-200 px-2 py-0.5 rounded-full">
                点击激活
              </div>
            )}

            {/* 头部：头像 + 标题 */}
            <div className="px-5 pt-9 pb-3">
              <div className="flex items-start gap-3 mb-3">
                <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 text-base font-bold text-gray-500', p.avatarBg)}>
                  {p.avatarText}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-800">{p.styleName}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
            </div>

            {/* 话术示例 */}
            <div className="px-5 pb-4 space-y-1.5">
              <p className="text-[10px] text-gray-300 font-medium uppercase tracking-wide mb-2">话术示例</p>
              {p.scripts.map((s, si) => (
                <div key={si} className={cn(
                  'text-xs text-gray-500 rounded-lg px-3 py-2 leading-relaxed border',
                  selected === p.id ? 'bg-orange-50/60 border-orange-100' : 'bg-gray-50 border-gray-100'
                )}>{s}</div>
              ))}
            </div>

            {/* 底部：场景 */}
            <div className="mt-auto px-5 py-3 border-t border-gray-100 bg-gray-50/50">
              <span className="text-xs text-gray-400">{p.scope}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 策略库 ────────────────────────────────────────────────────────────────────

type StrategyCategory = '运营类' | '销售类' | '售后类';
type StrategyTrigger = '用户行为' | '时间条件' | '订单状态';

const strategyCategoryColors: Record<StrategyCategory, string> = {
  '运营类': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  '销售类': 'bg-orange-50 text-[#FF6B35] border-orange-200',
  '售后类': 'bg-blue-50 text-blue-500 border-blue-200',
};

const strategyTriggerColors: Record<StrategyTrigger, string> = {
  '用户行为': 'bg-violet-50 text-violet-500 border-violet-200',
  '时间条件': 'bg-amber-50 text-amber-600 border-amber-200',
  '订单状态': 'bg-sky-50 text-sky-500 border-sky-200',
};

interface AdminStrategy {
  id: number;
  name: string;
  category: StrategyCategory;
  triggerType: StrategyTrigger;
  triggerDesc: string;
  action: string;
  scripts: string[];
  source: '平台下发' | '企业自建';
  chatType: '单聊' | '群聊';
  enabled: boolean;
}

const adminMockStrategies: AdminStrategy[] = [
  { id: 1, name: '24小时未回消息召回', category: '运营类', triggerType: '时间条件', triggerDesc: '用户超过24小时未回复消息', action: '自动发送召回话术，提醒用户继续对话', scripts: ['嗨～好久不见！有什么我可以帮您的吗？😊', '您上次咨询的问题还没解决？随时欢迎回来聊聊～'], source: '平台下发', chatType: '单聊', enabled: true },
  { id: 2, name: '新用户激活策略', category: '运营类', triggerType: '用户行为', triggerDesc: '新用户首次发起会话后未完成购买', action: '24小时后推送新人专属优惠券并引导下单', scripts: ['欢迎新朋友！专属新人优惠已为您准备好，点击领取立享9折优惠 🎁', '第一次来？这里有份新手礼包送给您，限时24小时哦～'], source: '平台下发', chatType: '单聊', enabled: true },
  { id: 3, name: '下单未付款催付', category: '销售类', triggerType: '订单状态', triggerDesc: '用户创建订单后30分钟内未完成支付', action: '发送催付提醒，附带限时优惠截止倒计时', scripts: ['您的订单还在等待付款中，库存有限，赶快完成支付吧！⏰', '温馨提示：您的订单将在30分钟后自动取消，点击这里立即支付'], source: '平台下发', chatType: '单聊', enabled: true },
  { id: 4, name: '老客户复购激活', category: '销售类', triggerType: '时间条件', triggerDesc: '上次购买距今超过60天且无新订单', action: '发送专属回购优惠，关联上次购买品类推荐', scripts: ['好久不见～根据您的喜好，这些新品您可能会喜欢 👀', '老朋友回来啦！专属85折优惠码：BACK85，有效期3天'], source: '企业自建', chatType: '单聊', enabled: false },
  { id: 5, name: '售后超时跟进', category: '售后类', triggerType: '时间条件', triggerDesc: '售后工单超过48小时未处理', action: '自动提醒客服跟进，并向用户发送安抚话术', scripts: ['非常抱歉让您久等了！您的问题我们正在优先处理，预计今天内给您答复 🙏', '感谢您的耐心等待，售后团队将在2小时内联系您'], source: '平台下发', chatType: '单聊', enabled: true },
  { id: 6, name: '加购未下单提醒', category: '销售类', triggerType: '用户行为', triggerDesc: '用户将商品加入购物车后超过2小时未下单', action: '发送购物车提醒，附带库存紧张提示', scripts: ['您购物车里的商品还在等您～库存仅剩最后几件了 🛒', '提醒您：购物车商品库存紧张，赶快下单锁定吧！'], source: '企业自建', chatType: '单聊', enabled: true },
  { id: 7, name: '群内新成员欢迎', category: '运营类', triggerType: '用户行为', triggerDesc: '新用户加入群聊后30秒内未有人欢迎', action: '自动发送欢迎话术，介绍群内福利及规则', scripts: ['欢迎新朋友加入！群内每周三有专属福利派送，记得关注哦 🎉', '你好！这里是[品牌名]官方交流群，有任何问题随时@客服～'], source: '平台下发', chatType: '群聊', enabled: true },
  { id: 8, name: '群内活动预热推送', category: '运营类', triggerType: '时间条件', triggerDesc: '活动开始前24小时', action: '向群内所有成员发送活动预热内容', scripts: ['【活动预告】明天10点大促开启，提前锁定购物车！🔥', '倒计时24小时！明日限时折扣，手慢无～记得准时来'], source: '企业自建', chatType: '群聊', enabled: true },
  { id: 9, name: '群内沉默成员激活', category: '运营类', triggerType: '时间条件', triggerDesc: '群成员超过7天未在群内发言', action: '私信沉默成员，发送专属福利引导互动', scripts: ['好久没见你在群里啦～特意给你准备了一份专属优惠，点击查看 👀', '群里最近热闹，你有没有看到昨天的福利贴？别错过哦～'], source: '平台下发', chatType: '群聊', enabled: false },
  { id: 10, name: '群内问题智能答复', category: '售后类', triggerType: '用户行为', triggerDesc: '群内出现产品问题关键词（如退款/坏了/发货慢）', action: '自动@提问用户并发送对应解决话术', scripts: ['您好！关于您提到的问题，请私信我们客服处理，会优先为您解决 🙏', '看到您的留言啦！遇到这种情况请不用担心，我们来帮您'], source: '平台下发', chatType: '群聊', enabled: true },
];

function AdminStrategyTable({ chatType }: { chatType: '单聊' | '群聊' }) {
  const [activeCategory, setActiveCategory] = useState<StrategyCategory | '全部'>('全部');
  const [strategies, setStrategies] = useState(adminMockStrategies);

  const filtered = strategies.filter(s =>
    s.chatType === chatType &&
    (activeCategory === '全部' || s.category === activeCategory)
  );

  const toggleEnabled = (id: number) => {
    setStrategies(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(['全部', '运营类', '销售类', '售后类'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-all',
                activeCategory === cat ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >{cat}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-44">
          <Search size={13} className="text-gray-400" />
          <input className="bg-transparent text-xs text-gray-600 placeholder:text-gray-300 outline-none w-full" placeholder="搜索策略名称..." />
        </div>
        <div className="ml-auto">
          <button className="flex items-center gap-1.5 text-xs bg-[#FF6B35] text-white rounded-lg px-3 py-1.5 hover:bg-[#E85A2A] transition-all">
            <Plus size={12} />新增策略
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/60 border-b border-gray-100">
              {['策略名称', '类别', '触发类型', '触发条件', '执行动作', '策略话术', '状态', '操作'].map((h, i) => (
                <th key={h} className={cn(
                  'px-5 py-2.5 text-left text-xs text-gray-400 font-medium',
                  i === 3 && 'w-44',
                  i === 4 && 'w-44',
                  i === 5 && 'w-56',
                )}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} className={cn('hover:bg-gray-50 transition-colors group align-top', i < filtered.length - 1 && 'border-b border-gray-100')}>
                <td className="px-5 py-3 text-xs text-gray-800 font-medium whitespace-nowrap">{s.name}</td>
                <td className="px-5 py-3">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium whitespace-nowrap', strategyCategoryColors[s.category])}>
                    {s.category}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border whitespace-nowrap', strategyTriggerColors[s.triggerType])}>
                    {s.triggerType}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-gray-500 leading-relaxed">{s.triggerDesc}</td>
                <td className="px-5 py-3 text-xs text-gray-500 leading-relaxed">{s.action}</td>
                <td className="px-5 py-3">
                  <div className="space-y-1.5">
                    {s.scripts.map((script, si) => (
                      <div key={si} className="text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1.5 leading-relaxed border border-gray-100">{script}</div>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => toggleEnabled(s.id)}
                    className={cn(
                      'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                      s.enabled ? 'bg-[#FF6B35]' : 'bg-gray-200'
                    )}
                  >
                    <span className={cn(
                      'inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform',
                      s.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    )} />
                  </button>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"><Pencil size={11} />编辑</button>
                    <button className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1"><Trash2 size={11} />删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const intentCategoriesAdmin = ['销售类', '售后类', '运营类'] as const;
type IntentCategoryAdmin = typeof intentCategoriesAdmin[number];

const adminCategoryColors: Record<IntentCategoryAdmin, string> = {
  '销售类': 'bg-orange-50 text-[#FF6B35] border-orange-200',
  '售后类': 'bg-blue-50 text-blue-500 border-blue-200',
  '运营类': 'bg-emerald-50 text-emerald-600 border-emerald-200',
};

interface AdminIntent {
  id: number;
  name: string;
  category: IntentCategoryAdmin;
  source: '平台下发' | '企业自建';
  scenes: { scene: string; script: string }[];
}

const adminMockIntents: AdminIntent[] = [
  {
    id: 1, name: '询价意图', category: '销售类', source: '平台下发',
    scenes: [
      { scene: '含商品实体', script: '您问的{商品名}目前售价 $XX，现在购买还有折扣哦～' },
      { scene: '无实体', script: '请问您想了解哪款产品的价格？我来为您详细介绍' },
    ],
  },
  {
    id: 2, name: '退款意图', category: '售后类', source: '平台下发',
    scenes: [
      { scene: '含订单实体', script: '您的订单 {订单号} 退款申请已收到，1-3个工作日内处理完毕' },
      { scene: '无实体', script: '非常抱歉！请提供您的订单号，我来为您优先处理退款' },
    ],
  },
  {
    id: 3, name: '品牌故事咨询', category: '销售类', source: '企业自建',
    scenes: [
      { scene: '无实体', script: '我们品牌创立于2018年，专注于{行业}领域，累计服务超过10万客户～' },
    ],
  },
  {
    id: 4, name: '加群意图', category: '运营类', source: '平台下发',
    scenes: [
      { scene: '含平台实体', script: '欢迎加入{平台}VIP群！群内专属优惠第一时间通知：{群链接}' },
      { scene: '无实体', script: '欢迎加入我们的VIP社群，点击链接即可：{群链接}' },
    ],
  },
  {
    id: 5, name: '售后评价引导', category: '售后类', source: '企业自建',
    scenes: [
      { scene: '含订单实体', script: '感谢您购买{商品名}！如果满意的话，欢迎给我们留下好评～' },
      { scene: '无实体', script: '感谢您的支持！期待您的宝贵评价，这对我们非常重要！' },
    ],
  },
];

function AdminIntentTable() {
  const [activeCategory, setActiveCategory] = useState<IntentCategoryAdmin | '全部'>('全部');

  const filtered = adminMockIntents.filter(i =>
    (activeCategory === '全部' || i.category === activeCategory)
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(['全部', ...intentCategoriesAdmin] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-all',
                activeCategory === cat ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}
            >{cat}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-44">
          <Search size={13} className="text-gray-400" />
          <input className="bg-transparent text-xs text-gray-600 placeholder:text-gray-300 outline-none w-full" placeholder="搜索意图名称..." />
        </div>
        <div className="ml-auto">
          <button className="flex items-center gap-1.5 text-xs bg-[#FF6B35] text-white rounded-lg px-3 py-1.5 hover:bg-[#E85A2A] transition-all">
            <Plus size={12} />新增意图
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/60 border-b border-gray-100">
              {['意图名称', '类别', '场景', '话术', '操作'].map((h, i) => (
                <th key={h} className={cn('px-5 py-2.5 text-left text-xs text-gray-400 font-medium', i === 2 && 'w-32', i === 3 && 'w-80')}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((intent, i) => (
              <tr key={intent.id} className={cn('hover:bg-gray-50 transition-colors group align-top', i < filtered.length - 1 && 'border-b border-gray-100')}>
                <td className="px-5 py-3 text-xs text-gray-800 font-medium whitespace-nowrap">{intent.name}</td>
                <td className="px-5 py-3">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium whitespace-nowrap', adminCategoryColors[intent.category])}>
                    {intent.category}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="space-y-2.5">
                    {intent.scenes.map((s, si) => (
                      <div key={si}>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md whitespace-nowrap">{s.scene}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="space-y-2.5">
                    {intent.scenes.map((s, si) => (
                      <div key={si} className="text-xs text-gray-500 leading-relaxed line-clamp-1">{s.script}</div>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"><Pencil size={11} />编辑</button>
                    <button className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1"><Trash2 size={11} />删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminTemplateSubPageContent({ page, selectedEmployee, activationCodes }: {
  page: AdminTemplateSubPage;
  selectedEmployee: import('@/types').AIEmployeeConfig | null;
  activationCodes: import('@/types').ActivationCode[];
}) {
  if (page === 'persona-styles') {
    // 激活码范围 banner（仅 AI员工模式）
    const empCodes = selectedEmployee
      ? (selectedEmployee.activationCodeScope === 'custom'
          ? activationCodes.filter(c => (selectedEmployee.activationCodeIds ?? []).includes(c.id))
          : activationCodes)
      : [];
    return (
      <div className="flex flex-col h-full">
        {selectedEmployee && (
          <div className="flex-shrink-0 mx-6 mt-4 mb-0 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
            <Key className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span className="text-xs text-blue-600 font-medium">应用激活码范围：</span>
            {selectedEmployee.activationCodeScope === 'custom' ? (
              empCodes.length === 0
                ? <span className="text-xs text-gray-400">未绑定激活码</span>
                : <div className="flex flex-wrap gap-1.5">
                    {empCodes.map(c => (
                      <span key={c.id} className="text-xs bg-white border border-blue-200 text-blue-500 px-2 py-0.5 rounded-full font-mono">{c.code}</span>
                    ))}
                  </div>
            ) : (
              <span className="text-xs text-blue-500">全部激活码</span>
            )}
          </div>
        )}
        <div className="flex-1 overflow-auto">
          <AdminPersonaTable />
        </div>
      </div>
    );
  }

  if (page === 'intent-single' || page === 'intent-group') {
    return <AdminIntentTable />;
  }

  if (page === 'strategy-single') {
    return <AdminStrategyTable chatType="单聊" />;
  }
  if (page === 'strategy-group') {
    return <AdminStrategyTable chatType="群聊" />;
  }

  const isWelcome = page === 'script-welcome';
  const rows = isWelcome
    ? [
        { name: '新用户欢迎语', content: '您好，欢迎来到 {店铺名}！有什么可以帮助您的吗？', scripts: ['您好，欢迎来到 {店铺名}！有什么可以帮助您的吗？', '嗨！很高兴认识您，我是您的专属客服，有任何问题都可以告诉我～'], enabled: true, codeScope: '全部激活码', delay: '0s', replyMode: '回复全部', sendMode: '原文发送', createdAt: '2026-04-09 13:50:35' },
        { name: '节假日欢迎语', content: '节日快乐！我们正在开展限时优惠活动，欢迎了解～', scripts: ['节日快乐！我们正在开展限时优惠活动，欢迎了解～', '🎉 节日好！专属节日福利已为您准备好，点击查看详情'], enabled: false, codeScope: '部分激活码', delay: '2s - 5s', replyMode: '随机回复', sendMode: '原文发送', createdAt: '2026-04-08 10:20:11' },
        { name: '品牌专属欢迎语', content: '欢迎光临{品牌名}！我是您的专属顾问，随时为您服务！', scripts: ['欢迎光临{品牌名}！我是您的专属顾问，随时为您服务！'], enabled: true, codeScope: '全部激活码', delay: '1s - 3s', replyMode: '回复全部', sendMode: '原文发送', createdAt: '2026-04-07 09:15:00' },
      ]
    : [
        { name: '价格咨询', keyword: '多少钱, 价格, 报价, how much', matchRule: '半匹配', scripts: ['您问的{商品名}目前售价 $XX，现在购买还有折扣哦～', '具体价格因规格不同有所差异，请问您需要哪款呢？'], enabled: true, codeScope: '部分激活码', delay: '2s - 5s', replyMode: '回复全部', sendMode: '原文发送', createdAt: '2026-04-09 13:50:35' },
        { name: '退款申请', keyword: '退款, 退货, refund', matchRule: '精确匹配', scripts: ['非常抱歉！请提供您的订单号，我来为您优先处理退款', '您好，退款申请已收到，1-3个工作日内处理完毕'], enabled: true, codeScope: '全部激活码', delay: '1s - 3s', replyMode: '随机回复', sendMode: '原文发送', createdAt: '2026-04-08 11:30:22' },
        { name: '品牌活动', keyword: '活动, 优惠, 折扣, {品牌词}', matchRule: '半匹配', scripts: ['我们目前正在进行{活动名}，全场{折扣}优惠，快来参与吧！'], enabled: false, codeScope: '部分激活码', delay: '3s - 6s', replyMode: '回复全部', sendMode: '原文发送', createdAt: '2026-04-07 16:45:00' },
      ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-44">
          <Search size={13} className="text-gray-400" />
          <input className="bg-transparent text-xs text-gray-600 placeholder:text-gray-300 outline-none w-full" placeholder="搜索..." />
        </div>
        <div className="ml-auto">
          <button className="flex items-center gap-1.5 text-xs bg-[#FF6B35] text-white rounded-lg px-3 py-1.5 hover:bg-[#E85A2A] transition-all">
            <Plus size={12} />{isWelcome ? '新增话术' : '新增关键词'}
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/60 border-b border-gray-100">
              <th className="px-4 py-2.5 text-left text-xs text-gray-400 font-medium w-8">
                <input type="checkbox" className="w-3.5 h-3.5 rounded" />
              </th>
              <th className="px-4 py-2.5 text-left text-xs text-gray-400 font-medium">{isWelcome ? '话术名称' : '关键词'}</th>
              <th className="px-4 py-2.5 text-left text-xs text-gray-400 font-medium">状态</th>
              {!isWelcome && <th className="px-4 py-2.5 text-left text-xs text-gray-400 font-medium">匹配规则</th>}
              <th className="px-4 py-2.5 text-left text-xs text-gray-400 font-medium">回复内容</th>
              <th className="px-4 py-2.5 text-left text-xs text-gray-400 font-medium">应用激活码</th>
              <th className="px-4 py-2.5 text-left text-xs text-gray-400 font-medium">延时间隔</th>
              <th className="px-4 py-2.5 text-left text-xs text-gray-400 font-medium">回复方式</th>
              <th className="px-4 py-2.5 text-left text-xs text-gray-400 font-medium">发送设置</th>
              <th className="px-4 py-2.5 text-left text-xs text-gray-400 font-medium">添加时间</th>
              <th className="px-4 py-2.5 text-left text-xs text-gray-400 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={cn('border-b border-gray-50 hover:bg-gray-50/60 transition-colors group align-middle', i === rows.length - 1 && 'border-b-0')}>
                <td className="px-4 py-3">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded" />
                </td>
                <td className="px-4 py-3 text-xs text-gray-800 font-medium whitespace-nowrap">
                  {isWelcome ? r.name : (r as any).keyword}
                </td>
                <td className="px-4 py-3">
                  <button
                    className={cn(
                      "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                      r.enabled ? "bg-green-500" : "bg-gray-200"
                    )}
                  >
                    <span className={cn(
                      "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform",
                      r.enabled ? "translate-x-4" : "translate-x-0.5"
                    )} />
                  </button>
                </td>
                {!isWelcome && (
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{(r as any).matchRule}</td>
                )}
                <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px] truncate">
                  {isWelcome ? (r as any).content : r.scripts[0]}
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    r.codeScope === '全部激活码' ? "bg-blue-50 text-blue-500" : "bg-orange-50 text-orange-500"
                  )}>{r.codeScope}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{(r as any).delay}</td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{(r as any).replyMode}</td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{(r as any).sendMode}</td>
                <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{r.createdAt}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button className="text-xs text-[#1677ff] hover:text-blue-600">编辑</button>
                    <button className="text-xs text-red-400 hover:text-red-500">删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const AdminTemplatesPage: React.FC<{ initialEmployeeId?: string | null }> = ({ initialEmployeeId }) => {
  const aiEmployees = useStore((s) => s.aiEmployees);
  const activationCodes = useStore((s) => s.activationCodes);

  // 选中的 AI员工 id，null = 通用
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(initialEmployeeId ?? null);
  const [showScopeDropdown, setShowScopeDropdown] = useState(false);
  const scopeDropdownRef = React.useRef<HTMLDivElement>(null);

  const isGeneral = selectedEmployeeId === null;
  const selectedEmployee = aiEmployees.find(e => e.id === selectedEmployeeId) ?? null;

  // 通用模式只显示话术库和关键词回复
  const visibleScenes = isGeneral
    ? adminTemplateScenes.filter(s => s.id === 'script' || s.id === 'keyword')
    : adminTemplateScenes;

  const [activePage, setActivePage] = useState<AdminTemplateSubPage>(
    initialEmployeeId ? 'persona-styles' : 'script-welcome'
  );
  const [expandedScenes, setExpandedScenes] = useState<Set<string>>(new Set(adminTemplateScenes.map(s => s.id)));

  const handleSetEmployee = (id: string | null) => {
    setSelectedEmployeeId(id);
    if (id === null) {
      const aiOnlyPages: AdminTemplateSubPage[] = ['persona-styles', 'intent-single', 'intent-group', 'strategy-single', 'strategy-group'];
      if (aiOnlyPages.includes(activePage)) setActivePage('script-welcome');
    } else {
      // 切换到 AI员工时默认跳到角色人设
      setActivePage('persona-styles');
    }
    setShowScopeDropdown(false);
  };

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (scopeDropdownRef.current && !scopeDropdownRef.current.contains(e.target as Node)) {
        setShowScopeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const scopeLabel = isGeneral ? '通用' : (selectedEmployee?.name ?? 'AI员工');

  const toggleScene = (id: string) => {
    setExpandedScenes(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const currentScene = adminTemplateScenes.find(s => s.items.some(i => i.id === activePage));
  const currentItem = currentScene?.items.find(i => i.id === activePage);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Scene sidebar */}
      <div className="w-44 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="py-3">
          {visibleScenes.map(scene => {
            const Icon = scene.icon;
            const isExpanded = expandedScenes.has(scene.id);
            const isSceneActive = scene.items.some(i => i.id === activePage);
            return (
              <div key={scene.id}>
                <button
                  onClick={() => toggleScene(scene.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors',
                    isSceneActive ? 'text-gray-800' : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <Icon size={13} className={cn(isSceneActive ? 'text-[#FF6B35]' : 'text-gray-400')} />
                  <span className="flex-1 text-left">{scene.label}</span>
                  <ChevronDown size={12} className={cn('text-gray-300 transition-transform duration-200', isExpanded && 'rotate-180')} />
                </button>
                {isExpanded && (
                  <div className="mb-1">
                    {scene.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setActivePage(item.id)}
                        className={cn(
                          'w-full flex items-center text-left px-4 py-2 text-xs transition-all relative',
                          activePage === item.id
                            ? 'text-[#1677ff] bg-blue-50 font-medium'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        {activePage === item.id && (
                          <span className="absolute right-0 top-0 bottom-0 w-0.5 bg-blue-500 rounded-l-full" />
                        )}
                        <span className="pl-5">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="flex items-center gap-2 px-6 py-3 bg-white border-b border-gray-100">
          <span className="text-xs text-gray-400">{currentScene?.label}</span>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-xs font-medium text-gray-700">{currentItem?.label}</span>
          <span className="ml-2 text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            平台下发模板可查看，企业可自建覆盖
          </span>

          {/* 维度筛选器 */}
          <div className="ml-auto relative" ref={scopeDropdownRef}>
            <button
              onClick={() => setShowScopeDropdown(v => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors"
            >
              <Filter className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600 max-w-[120px] truncate">{scopeLabel}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            {showScopeDropdown && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden max-h-80 overflow-y-auto">
                {/* 通用 */}
                <button
                  onClick={() => handleSetEmployee(null)}
                  className={cn("w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 transition-colors", isGeneral && "text-[#FF6B35] bg-orange-50/50")}
                >
                  <Globe className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span>通用</span>
                  {isGeneral && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />}
                </button>

                {/* AI员工列表 */}
                {aiEmployees.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 text-[10px] text-gray-400 font-medium border-t border-gray-100 mt-0.5">AI员工</div>
                    {aiEmployees.map(e => (
                      <button
                        key={e.id}
                        onClick={() => handleSetEmployee(e.id)}
                        className={cn("w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 transition-colors", selectedEmployeeId === e.id && "text-[#FF6B35] bg-orange-50/50")}
                      >
                        <Bot className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate font-medium">{e.name}</span>
                        {selectedEmployeeId === e.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF6B35] flex-shrink-0" />}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <AdminTemplateSubPageContent page={activePage} selectedEmployee={selectedEmployee} activationCodes={activationCodes} />
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
  detailCustomerId: string | null;
  onViewCustomerDetail: (customerId: string) => void;
  onBackToCustomerList: () => void;
  onViewAIEmployee: (employeeId: string) => void;
  onBackToAIList: () => void;
  onGoToPersonaConfig: () => void;
  onBackToAIDetail: () => void;
  filterRoleId: string | null;
  onClearFilterRole: () => void;
  onViewRoleAccounts: (roleId: string) => void;
}> = ({ section, onViewChat, auditCode, onClearAuditCode, detailCustomerId, onViewCustomerDetail, onBackToCustomerList, onViewAIEmployee, onBackToAIList, onGoToPersonaConfig, onBackToAIDetail, filterRoleId, onClearFilterRole, onViewRoleAccounts }) => {
  const selectedAIEmployeeId = useStore((s) => s.selectedAIEmployeeId);
  switch (section) {
    case 'dashboard':
      return <DashboardPage />;
    case 'activation-codes':
      return <AdminCenter onViewChat={onViewChat} />;
    case 'proxy-management':
      return <ProxyManagement />;
    case 'audit':
      return <AdminChatView initialCode={auditCode} onClearCode={onClearAuditCode} />;
    case 'audit-report':
      return <AdminAuditReportPage />;
    case 'members':
      return <AccountManagement filterRoleId={filterRoleId} onClearFilter={onClearFilterRole} />;
    case 'org-settings':
      return <OrganizationStructure onViewRoleAccounts={onViewRoleAccounts} />;
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
    case 'ai-settings':
      return <AISettingsPage />;
    case 'ai-config':
      return <AIConfigListPage onViewEmployee={onViewAIEmployee} />;
    case 'ai-config-detail':
      return <AIConfigDetailPage onBack={onBackToAIList} onGoToPersonaConfig={onGoToPersonaConfig} />;
    case 'ai-persona-config':
      return <AIPersonaConfigPage onBack={onBackToAIDetail} />;
    case 'ai-knowledge':
      return <KnowledgeBasePage />;
    case 'ai-scripts':
      return (
        <div className="h-full flex flex-col">
          <div className="mx-6 mt-4 flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-500" />
            <span>该功能还在完善中</span>
          </div>
          <div className="flex-1">
            <PlaceholderPage
              icon={MessageSquare}
              title="话术库配置"
              description="管理AI员工的营销话术和回复模板"
            />
          </div>
        </div>
      );
    case 'ai-labels':
      return <AILabelsPage />;
    case 'ai-templates':
      return <AdminTemplatesPage initialEmployeeId={selectedAIEmployeeId} />;
    case 'customer-list':
      return <AdminCustomerListPage onViewDetail={onViewCustomerDetail} />;
    case 'customer-detail':
      return <AdminCustomerDetailPage customerId={detailCustomerId} onBack={onBackToCustomerList} />;
    case 'ticket-list':
      return <AdminTicketListPage />;
    default:
      return null;
  }
};

// AI开关状态标签
const AiSwitch: React.FC<{ enabled: boolean }> = ({ enabled }) => (
  <div className="flex justify-center">
    <span className={cn(
      "px-2 py-0.5 text-[11px] font-medium rounded-full",
      enabled ? "bg-[#FF6B35]/10 text-[#FF6B35]" : "bg-gray-100 text-gray-400"
    )}>
      {enabled ? '开启' : '未开启'}
    </span>
  </div>
);

// AI设置页面
const platformIconMap = {
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
} as Record<string, React.ComponentType<{ className?: string }>>;

const AISettingsPage: React.FC = () => {
  const organization = useStore((s) => s.organization);
  const activationCodes = useStore((s) => s.activationCodes);
  const platformAccounts = useStore((s) => s.platformAccounts);
  const aiSeats = organization.aiSeats || { total: 0, used: 0 };

  // 过滤掉 unused 状态
  const validCodes = activationCodes.filter(c => c.status !== 'unused');

  // 将激活码按平台展开为扁平行
  const flatRows = validCodes.flatMap(code =>
    (code.aiPlatforms || []).map(ap => ({ code, aiPlatform: ap }))
  );
  // 没有 aiPlatforms 的激活码也显示一行
  const noAiRows = validCodes
    .filter(c => !c.aiPlatforms || c.aiPlatforms.length === 0)
    .map(code => ({ code, aiPlatform: null }));
  const allRows = [...flatRows, ...noAiRows];

  // 统计已开启AI的激活码数（至少有一个平台开启了任意AI功能）
  const enabledCount = validCodes.filter(c =>
    (c.aiPlatforms || []).some(ap => ap.aiSalesChat || ap.aiProactiveMarketing || ap.aiRecall || ap.aiQualityCheck)
  ).length;

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 筛选状态
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterAccount, setFilterAccount] = useState('');
  const [filterAiStatus, setFilterAiStatus] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showAiStatusDropdown, setShowAiStatusDropdown] = useState(false);

  // 筛选逻辑
  const filteredRows = allRows.filter(({ code, aiPlatform }) => {
    // 关键词搜索：激活码、组织账号
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchCode = code.code.toLowerCase().includes(q);
      const matchAssigned = (code.assignedTo || '').toLowerCase().includes(q);
      if (!matchCode && !matchAssigned) return false;
    }
    // 平台筛选
    if (filterPlatform) {
      if (!aiPlatform || aiPlatform.platformId !== filterPlatform) return false;
    }
    // 客服账号筛选
    if (filterAccount) {
      if (!aiPlatform) return false;
      const account = platformAccounts.find(a => a.platformId === aiPlatform.platformId && a.status !== 'not_logged_in');
      if (!account || account.id !== filterAccount) return false;
    }
    // AI状态筛选
    if (filterAiStatus === 'enabled') {
      if (!aiPlatform) return false;
      if (!aiPlatform.aiSalesChat && !aiPlatform.aiProactiveMarketing && !aiPlatform.aiRecall && !aiPlatform.aiQualityCheck) return false;
    } else if (filterAiStatus === 'disabled') {
      if (aiPlatform && (aiPlatform.aiSalesChat || aiPlatform.aiProactiveMarketing || aiPlatform.aiRecall || aiPlatform.aiQualityCheck)) return false;
    }
    return true;
  });

  const remaining = aiSeats.total - enabledCount;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pagedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 可用平台列表（从数据中提取）
  const availablePlatforms = [...new Set(allRows.map(r => r.aiPlatform?.platformId).filter(Boolean))] as string[];

  // 可用客服账号列表（从数据中提取，去重）
  const availableAccounts = [...new Set(
    allRows.map(r => r.aiPlatform?.platformId).filter(Boolean)
  )].flatMap(pid =>
    platformAccounts.filter(a => a.platformId === pid && a.status !== 'not_logged_in')
  ).filter((a, i, arr) => arr.findIndex(x => x.id === a.id) === i);

  return (
    <div className="p-6 h-full flex flex-col space-y-5 overflow-auto">
      {/* 坐席配额卡片 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-shrink-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#FF6B35]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">AI员工坐席配额</h2>
              <p className="text-xs text-gray-500 mt-0.5">管理本组织可开启的AI员工坐席数量</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{aiSeats.total}</p>
              <p className="text-[10px] text-gray-400">总坐席数</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{enabledCount}</p>
              <p className="text-[10px] text-gray-400">已使用</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className={cn("text-lg font-bold", remaining > 0 ? "text-blue-600" : "text-red-500")}>{remaining}</p>
              <p className="text-[10px] text-gray-400">剩余可用</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI员工绑定列表 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">AI员工绑定情况</h2>
          <span className="text-xs text-gray-500">
            {enabledCount} / {aiSeats.total} 已绑定
          </span>
        </div>

        {/* 筛选条件 */}
        <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-3">
          {/* 关键词搜索 */}
          <div className="relative flex-shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索激活码/账号"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg w-48 focus:outline-none focus:ring-1 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] placeholder:text-gray-300"
            />
          </div>

          {/* 平台筛选 */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => { setShowPlatformDropdown(!showPlatformDropdown); setShowAccountDropdown(false); setShowAiStatusDropdown(false); }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors",
                filterPlatform
                  ? "border-[#FF6B35]/30 bg-[#FF6B35]/5 text-[#FF6B35]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              {filterPlatform
                ? platformConfigs.find(p => p.id === filterPlatform)?.name || '平台'
                : '平台'}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showPlatformDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowPlatformDropdown(false)} />
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 min-w-[120px]">
                  <button
                    onClick={() => { setFilterPlatform(''); setShowPlatformDropdown(false); setCurrentPage(1); }}
                    className={cn("w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50", !filterPlatform && "text-[#FF6B35] font-medium")}
                  >
                    全部平台
                  </button>
                  {availablePlatforms.map(pid => {
                    const pc = platformConfigs.find(p => p.id === pid);
                    const PIcon = pc ? platformIconMap[pc.icon] : null;
                    return pc ? (
                      <button
                        key={pid}
                        onClick={() => { setFilterPlatform(pid); setShowPlatformDropdown(false); setCurrentPage(1); }}
                        className={cn("w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2", filterPlatform === pid && "text-[#FF6B35] font-medium")}
                      >
                        {PIcon && (
                          <div className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: pc.color }}>
                            <PIcon className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                        {pc.name}
                      </button>
                    ) : null;
                  })}
                </div>
              </>
            )}
          </div>

          {/* 客服账号筛选 */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => { setShowAccountDropdown(!showAccountDropdown); setShowPlatformDropdown(false); setShowAiStatusDropdown(false); }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors",
                filterAccount
                  ? "border-[#FF6B35]/30 bg-[#FF6B35]/5 text-[#FF6B35]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              {filterAccount
                ? availableAccounts.find(a => a.id === filterAccount)?.name || '客服账号'
                : '客服账号'}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showAccountDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowAccountDropdown(false)} />
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 min-w-[160px] max-h-[240px] overflow-auto">
                  <button
                    onClick={() => { setFilterAccount(''); setShowAccountDropdown(false); setCurrentPage(1); }}
                    className={cn("w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50", !filterAccount && "text-[#FF6B35] font-medium")}
                  >
                    全部账号
                  </button>
                  {availableAccounts.map(acc => {
                    const pc = platformConfigs.find(p => p.id === acc.platformId);
                    const PIcon = pc ? platformIconMap[pc.icon] : null;
                    return (
                      <button
                        key={acc.id}
                        onClick={() => { setFilterAccount(acc.id); setShowAccountDropdown(false); setCurrentPage(1); }}
                        className={cn("w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2", filterAccount === acc.id && "text-[#FF6B35] font-medium")}
                      >
                        {PIcon && pc && (
                          <div className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: pc.color }}>
                            <PIcon className="w-2 h-2 text-white" />
                          </div>
                        )}
                        <span className="truncate">{acc.name}</span>
                        <span className="text-gray-400 truncate">({acc.accountId})</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* AI状态筛选 */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => { setShowAiStatusDropdown(!showAiStatusDropdown); setShowPlatformDropdown(false); setShowAccountDropdown(false); }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors",
                filterAiStatus !== 'all'
                  ? "border-[#FF6B35]/30 bg-[#FF6B35]/5 text-[#FF6B35]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              {{ all: 'AI状态', enabled: '已开启', disabled: '未开启' }[filterAiStatus]}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showAiStatusDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowAiStatusDropdown(false)} />
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 min-w-[100px]">
                  {([['all', '全部'], ['enabled', '已开启'], ['disabled', '未开启']] as const).map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => { setFilterAiStatus(val); setShowAiStatusDropdown(false); setCurrentPage(1); }}
                      className={cn("w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50", filterAiStatus === val && "text-[#FF6B35] font-medium")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 重置 */}
          {(searchQuery || filterPlatform || filterAccount || filterAiStatus !== 'all') && (
            <button
              onClick={() => { setSearchQuery(''); setFilterPlatform(''); setFilterAccount(''); setFilterAiStatus('all'); setCurrentPage(1); }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              重置
            </button>
          )}
        </div>

        {/* 表头 */}
        <div className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr_80px_80px_80px_80px] px-6 py-2.5 bg-gray-50 border-b border-gray-100 text-xs text-gray-500 font-medium">
          <span>激活码</span>
          <span>组织账号</span>
          <span>客服账号</span>
          <span>平台</span>
          <span className="text-center">AI销售客服</span>
          <span className="text-center">AI主动营销</span>
          <span className="text-center">AI召回</span>
          <span className="text-center">AI会话质检</span>
        </div>

        {/* 列表 */}
        <div className="divide-y divide-gray-50">
          {pagedRows.map(({ code, aiPlatform }, rowIdx) => {
            const pc = aiPlatform ? platformConfigs.find(p => p.id === aiPlatform.platformId) : null;
            const PIcon = pc ? platformIconMap[pc.icon] : null;
            const account = aiPlatform
              ? platformAccounts.find(a => a.platformId === aiPlatform.platformId && a.status !== 'not_logged_in')
              : null;

            return (
              <div key={`${code.id}-${aiPlatform?.platformId || 'none'}-${rowIdx}`} className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr_80px_80px_80px_80px] px-6 py-3 items-center hover:bg-gray-50/50 transition-colors">
                {/* 激活码 */}
                <span className="text-xs text-gray-700 font-mono truncate">{code.code}</span>

                {/* 组织账号 */}
                <span className="text-xs text-gray-600 truncate">{code.assignedTo || '-'}</span>

                {/* 客服账号 */}
                <div className="min-w-0">
                  {account ? (
                    <p className="text-[11px] text-gray-600 truncate leading-relaxed">{account.name} ({account.accountId})</p>
                  ) : (
                    <span className="text-[11px] text-gray-300">-</span>
                  )}
                </div>

                {/* 平台 */}
                <div className="flex items-center gap-1">
                  {pc && PIcon ? (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-50 border border-gray-100">
                      <div className="w-4 h-4 rounded flex items-center justify-center" style={{ backgroundColor: pc.color }}>
                        <PIcon className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-[10px] text-gray-500">{pc.name}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-300">-</span>
                  )}
                </div>

                {/* AI销售客服 */}
                <AiSwitch enabled={!!aiPlatform?.aiSalesChat} />
                {/* AI主动营销 */}
                <AiSwitch enabled={!!aiPlatform?.aiProactiveMarketing} />
                {/* AI召回 */}
                <AiSwitch enabled={!!aiPlatform?.aiRecall} />
                {/* AI会话质检 */}
                <AiSwitch enabled={!!aiPlatform?.aiQualityCheck} />
              </div>
            );
          })}
        </div>

        {/* 分页 */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            共 {filteredRows.length} 条记录{filteredRows.length !== allRows.length ? `（筛选自 ${allRows.length} 条）` : ''}，已开启AI {enabledCount} 个
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className={cn(
                "px-2.5 py-1 text-xs rounded-md border transition-colors",
                currentPage <= 1
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              )}
            >
              上一页
            </button>
            <span className="text-xs text-gray-500">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className={cn(
                "px-2.5 py-1 text-xs rounded-md border transition-colors",
                currentPage >= totalPages
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              )}
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI配置页面 - AI员工配置（人设模板数据，与内容模板管理保持一致）
const personaTemplates = [
  {
    id: 'shop-owner',
    avatarBg: 'from-orange-100 to-amber-100',
    avatarText: '店',
    name: '热情店长',
    description: '以店长身份与客户沟通，态度热情诚恳，对品牌和产品很自信，有一定的品牌宣导性，适合30-45岁形象定位。',
    tags: ['热情', '自信', '品牌感'],
    scope: '电商售前',
  },
  {
    id: 'account-manager',
    avatarBg: 'from-blue-100 to-indigo-100',
    avatarText: '经',
    name: '客户经理',
    description: '一位门店客户经理，在25-35岁之间，话术感受留意适中，存在适当的语气词柔和话术，专业又不失亲和。',
    tags: ['专业', '亲和', '留意适中'],
    scope: '门店服务',
  },
  {
    id: 'minimal',
    avatarBg: 'from-gray-100 to-slate-100',
    avatarText: '简',
    name: '专业极简',
    description: '一位简洁高效的销售，简洁明了地解答客户疑问，用最少的话传递最有效的信息，与客户高效沟通。',
    tags: ['简洁', '高效', '直接'],
    scope: '通用客服',
  },
  {
    id: 'streamer',
    avatarBg: 'from-pink-100 to-rose-100',
    avatarText: '播',
    name: '甜美主播',
    description: '一位美女主播，年龄在24-28岁之间，语气温柔可爱，温和地解答客户疑问，让客户体验良好，适合直播电商场景。',
    tags: ['温柔', '可爱', '互动感强'],
    scope: '直播电商',
  },
  {
    id: 'after-sales',
    avatarBg: 'from-emerald-100 to-teal-100',
    avatarText: '后',
    name: '售后专家',
    description: '专注售后问题处理，语气沉稳有耐心，善于安抚情绪、推动问题解决，具备强烈的责任感和服务意识。',
    tags: ['耐心', '共情', '解决导向'],
    scope: '售后服务',
  },
  {
    id: 'grass',
    avatarBg: 'from-violet-100 to-purple-100',
    avatarText: '草',
    name: '种草姐妹',
    description: '以闺蜜口吻分享好物体验，擅长用真实感受种草，语气活泼有感染力，善用生活场景引发共鸣。',
    tags: ['种草', '真实感', '感染力'],
    scope: '社交电商',
  },
];

// 各人设模板对应的语气预览对话
const personaPreviewQuestion = '这款产品可以发货到巴西吗？';
const personaPreviewAnswers: Record<string, string> = {
  'shop-owner': '当然可以！我们每天通过DHL快递发往巴西。2小时内下单可免费升级物流追踪，需要帮您安排吗？',
  'account-manager': '您好，我们支持巴西地区配送，通常7-10个工作日到达。如有任何问题我随时为您跟进处理。',
  'minimal': '支持。7-10个工作日到达。',
  'streamer': '宝宝放心！巴西也可以发哦～DHL快递，快递单号实时追踪，姐妹入手超放心💕',
  'after-sales': '非常感谢您的咨询。我们支持巴西地区配送，全程提供物流追踪，如有任何问题请随时联系。',
  'grass': '姐妹！巴西也发的！我上次帮朋友买就是发过去的，DHL超快，一周多就到了，放心买！✨',
};

// ========== AI 员工列表页 ==========
const AIConfigListPage: React.FC<{ onViewEmployee: (id: string) => void }> = ({ onViewEmployee }) => {
  const aiEmployees = useStore((s) => s.aiEmployees);
  const addAIEmployee = useStore((s) => s.addAIEmployee);
  const deleteAIEmployee = useStore((s) => s.deleteAIEmployee);
  const updateAIEmployeeById = useStore((s) => s.updateAIEmployeeById);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPlatform, setNewPlatform] = useState('whatsapp');

  const handleCreate = () => {
    const id = `ai_emp_${Date.now()}`;
    addAIEmployee({
      id,
      name: newName || `AI 员工 ${aiEmployees.length + 1}`,
      language: 'zh',
      personaTemplate: 'sales',
      status: 'online',
      timezone: 'Asia/Shanghai',
      workStartTime: '00:00',
      workEndTime: '23:59',
      workDays: [1, 2, 3, 4, 5, 6, 0],
      activePlatforms: [newPlatform],
      platformCapabilities: [
        { platformId: newPlatform, aiSalesChat: true, aiProactiveMarketing: false, aiRecall: false, aiQualityCheck: false },
      ],
    });
    setShowCreateModal(false);
    setNewName('');
    setNewPlatform('whatsapp');
  };

  const CreateEmployeeModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">创建 AI 员工</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">员工名称</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={`AI 员工 ${aiEmployees.length + 1}`}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">选择平台</label>
            <div className="grid grid-cols-4 gap-2">
              {platformConfigs.map(pc => {
                const PIcon = platformIconMap[pc.icon];
                const isActive = newPlatform === pc.id;
                return (
                  <button
                    key={pc.id}
                    onClick={() => setNewPlatform(pc.id)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center',
                      isActive ? 'border-[#FF6B35] bg-[#FF6B35]/5' : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: pc.color }}>
                      {PIcon && <PIcon className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-[11px] text-gray-600 truncate w-full">{pc.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">取消</button>
          <button onClick={handleCreate} className="px-5 py-2 text-sm font-medium bg-[#FF6B35] text-white rounded-lg hover:bg-[#E85A2A] transition-colors">创建</button>
        </div>
      </div>
    </div>
  );

  // 空状态
  if (aiEmployees.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B35]/10 to-[#FF6B35]/5 flex items-center justify-center mb-6">
          <Bot className="w-10 h-10 text-[#FF6B35]/40" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">还没有 AI 员工</h3>
        <p className="text-sm text-gray-500 mb-8 max-w-sm">创建一个 AI 员工，为指定平台自动回复客户消息</p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#FF6B35] text-white text-sm font-medium rounded-xl hover:bg-[#E85A2A] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          创建 AI 员工
        </button>
        {showCreateModal && <CreateEmployeeModal />}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-6 flex flex-col h-full space-y-4">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between flex-shrink-0">
          <p className="text-sm text-gray-500">共 {aiEmployees.length} 个 AI 员工</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-[#E85A2A] transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加 AI 员工
          </button>
        </div>

        {/* 表格 */}
        <div className="flex-1 min-h-0 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
          {/* 表头 */}
          <div className="grid grid-cols-[2fr_1fr_1.5fr_1.2fr_1fr_1fr_1fr] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 flex-shrink-0">
            <span>员工名称</span>
            <span>人设模板</span>
            <span>绑定平台</span>
            <span>应用激活码范围</span>
            <span>创建时间</span>
            <span>修改时间</span>
            <span className="text-right">操作</span>
          </div>
          {/* 表体 */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {aiEmployees.map((emp) => {
              const tpl = personaTemplates.find(p => p.id === emp.personaTemplate);
              const codeCount = emp.activationCodeScope === 'custom'
                ? (emp.activationCodeIds?.length ?? 0)
                : null; // null = 全部
              return (
                <div key={emp.id} className="grid grid-cols-[2fr_1fr_1.5fr_1.2fr_1fr_1fr_1fr] gap-4 px-5 py-3.5 items-center hover:bg-gray-50/60 transition-colors">
                  {/* 员工名称 */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6B35]/15 to-[#FF8F5E]/25 flex items-center justify-center">
                        <Bot className="w-4.5 h-4.5 text-[#FF6B35]" />
                      </div>
                      <span className={cn(
                        'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white',
                        emp.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                      )} />
                    </div>
                    <span className="text-sm font-medium text-gray-900 truncate">{emp.name}</span>
                  </div>
                  {/* 人设模板 */}
                  <div className="text-sm text-gray-600 truncate">
                    {tpl ? <span>{tpl.avatarText} {tpl.name}</span> : <span className="text-gray-400">未设置</span>}
                  </div>
                  {/* 绑定平台 */}
                  <div className="flex flex-wrap gap-1">
                    {emp.activePlatforms.map(pid => {
                      const pc = platformConfigs.find(p => p.id === pid);
                      const PIcon = pc ? platformIconMap[pc.icon] : null;
                      return pc ? (
                        <div key={pid} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-50 border border-gray-100">
                          <div className="w-3.5 h-3.5 rounded flex items-center justify-center" style={{ backgroundColor: pc.color }}>
                            {PIcon && <PIcon className="w-2 h-2 text-white" />}
                          </div>
                          <span className="text-[11px] text-gray-500">{pc.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                  {/* 应用激活码范围 */}
                  <div>
                    {codeCount === null
                      ? <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-500">全部激活码</span>
                      : <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-500">{codeCount} 个激活码</span>
                    }
                  </div>
                  {/* 创建时间 */}
                  <div className="text-xs text-gray-400">{emp.createdAt ?? '-'}</div>
                  {/* 修改时间 */}
                  <div className="text-xs text-gray-400">{emp.updatedAt ?? '-'}</div>
                  {/* 操作 */}
                  <div className="flex items-center justify-end gap-1.5 flex-nowrap">
                    <button
                      onClick={() => onViewEmployee(emp.id)}
                      className="px-2.5 py-1.5 text-xs font-medium text-[#FF6B35] bg-[#FF6B35]/5 rounded-lg hover:bg-[#FF6B35]/10 transition-colors whitespace-nowrap"
                    >
                      配置
                    </button>
                    <button className="px-2.5 py-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                      日志
                    </button>
                    <button className="px-2.5 py-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                      应用激活码
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(emp.id)}
                      className="px-2.5 py-1.5 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
                    >
                      删除
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-2">确认删除</h3>
            <p className="text-sm text-gray-500 mb-6">删除后该 AI 员工的所有配置将丢失，确定要删除吗？</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">取消</button>
              <button onClick={() => { deleteAIEmployee(showDeleteConfirm); setShowDeleteConfirm(null); }} className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">删除</button>
            </div>
          </div>
        </div>
      )}

      {/* 创建弹窗 */}
      {showCreateModal && <CreateEmployeeModal />}
    </div>
  );
};

// ========== AI 员工详情页 ==========
const AIConfigDetailPage: React.FC<{
  onBack: () => void;
  onGoToPersonaConfig: () => void;
}> = ({ onBack, onGoToPersonaConfig }) => {
  const selectedAIEmployeeId = useStore((s) => s.selectedAIEmployeeId);
  const aiEmployees = useStore((s) => s.aiEmployees);
  const updateAIEmployeeConfig = useStore((s) => s.updateAIEmployeeConfig);
  const activationCodes = useStore((s) => s.activationCodes);
  const aiConfig = aiEmployees.find((e) => e.id === selectedAIEmployeeId);

  const [selectedPlatform, setSelectedPlatform] = useState<string>(aiConfig?.activePlatforms[0] || 'whatsapp');
  const [nicknameInput, setNicknameInput] = useState(aiConfig?.name || '');
  const [nicknameSaved, setNicknameSaved] = useState(false);
  const [debugMessages, setDebugMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'user', text: personaPreviewQuestion },
    { role: 'ai', text: personaPreviewAnswers['shop-owner'] },
  ]);
  const [debugInput, setDebugInput] = useState('');
  const debugEndRef = React.useRef<HTMLDivElement>(null);
  const [showDebugDrawer, setShowDebugDrawer] = useState(false);

  useEffect(() => {
    if (aiConfig) {
      setNicknameInput(aiConfig.name);
      if (aiConfig.activePlatforms.length > 0 && !aiConfig.activePlatforms.includes(selectedPlatform)) {
        setSelectedPlatform(aiConfig.activePlatforms[0]);
      }
    }
  }, [aiConfig?.id]);

  if (!aiConfig) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6">
        <p className="text-sm text-gray-500 mb-4">未找到该 AI 员工</p>
        <button onClick={onBack} className="text-sm text-[#FF6B35] hover:underline">返回列表</button>
      </div>
    );
  }

  const currentTpl = personaTemplates.find((t) => t.id === aiConfig.personaTemplate);
  const currentCap = aiConfig.platformCapabilities.find((c) => c.platformId === selectedPlatform);
  const activeFeatures = currentCap
    ? [currentCap.aiSalesChat && '智能销售', currentCap.aiProactiveMarketing && '主动营销', currentCap.aiRecall && '客户召回', currentCap.aiQualityCheck && '质量检测'].filter(Boolean)
    : [];

  const handleSaveNickname = () => {
    updateAIEmployeeConfig({ name: nicknameInput });
    setNicknameSaved(true);
    setTimeout(() => setNicknameSaved(false), 2000);
  };

  const handleToggleCapability = (key: 'aiSalesChat' | 'aiProactiveMarketing' | 'aiRecall' | 'aiQualityCheck') => {
    const caps = aiConfig.platformCapabilities.map((c) =>
      c.platformId === selectedPlatform ? { ...c, [key]: !c[key] } : c
    );
    updateAIEmployeeConfig({ platformCapabilities: caps });
  };

  const handleSelectPersona = (id: string) => {
    updateAIEmployeeConfig({ personaTemplate: id });
  };

  const handleDebugSend = () => {
    if (!debugInput.trim()) return;
    const userMsg = debugInput.trim();
    setDebugInput('');
    const newMessages = [...debugMessages, { role: 'user' as const, text: userMsg }];
    setDebugMessages(newMessages);
    // 模拟 AI 回复（基于当前人设的预设回复或通用答复）
    setTimeout(() => {
      const tplId = aiConfig.personaTemplate || 'shop-owner';
      const presetAnswer = personaPreviewAnswers[tplId];
      const tpl = personaTemplates.find(t => t.id === tplId);
      const fallback = tpl
        ? `[${tpl.name}风格] 感谢您的咨询！我已收到您的问题，稍后为您详细解答。`
        : '感谢您的咨询，我会尽快为您解答。';
      setDebugMessages(prev => [...prev, { role: 'ai' as const, text: presetAnswer || fallback }]);
      debugEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 返回按钮 */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-gray-100 bg-white">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#FF6B35] transition-colors">
          <ChevronLeft className="w-4 h-4" />
          返回 AI 员工列表
        </button>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* 左侧：员工信息卡 */}
        <div className="w-72 flex-shrink-0 border-r border-gray-200 bg-gradient-to-b from-indigo-50/80 to-white overflow-y-auto p-5 space-y-5">
          {/* 头像 + 名称 + 语言 */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-200/50">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <span className={cn(
                'absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white',
                aiConfig.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
              )} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">{aiConfig.name}</h3>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
              <Globe className="w-3 h-3" />
              <span>{aiConfig.language || 'English (US)'}</span>
            </div>
            {currentTpl && (
              <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-[11px] text-amber-700 font-medium">
                {currentTpl.avatarText} {currentTpl.name}
              </span>
            )}
          </div>

          {/* 工作状态 */}
          <div className="px-3 py-2.5 bg-white/80 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">工作状态</span>
              <button
                onClick={() => updateAIEmployeeConfig({ status: aiConfig.status === 'online' ? 'offline' : 'online' })}
                className={cn(
                  "w-9 h-5 rounded-full transition-colors relative flex-shrink-0",
                  aiConfig.status === 'online' ? "bg-indigo-500" : "bg-gray-200"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                  aiConfig.status === 'online' ? "left-[18px]" : "left-0.5"
                )} />
              </button>
            </div>
          </div>

          {/* 已激活平台 */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-2">已激活平台</h4>
            <div className="flex gap-2">
              {aiConfig.activePlatforms.map((pid) => {
                const pc = platformConfigs.find((p) => p.id === pid);
                return pc ? (
                  <div
                    key={pid}
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: pc.color }}
                    title={pc.name}
                  >
                    <span className="text-white text-[9px] font-bold">{pc.name.charAt(0)}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {/* 连接功能 */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-2">连接功能</h4>
            {activeFeatures.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {activeFeatures.map((f) => (
                  <span key={f as string} className="px-2 py-0.5 text-[11px] bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">{f as string}</span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400">暂无开启功能</p>
            )}
          </div>

          {/* TONE OF VOICE PREVIEW */}
          <div>
            <h4 className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase mb-3">Tone of Voice Preview</h4>
            <div className="space-y-2.5">
              {/* 用户消息气泡 */}
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3 h-3 text-gray-500" />
                </div>
                <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 border border-gray-100 shadow-sm max-w-[85%]">
                  <p className="text-[11px] text-gray-700 leading-relaxed">{personaPreviewQuestion}</p>
                </div>
              </div>
              {/* AI 回复气泡 */}
              <div className="flex items-start gap-2 justify-end">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl rounded-tr-sm px-3 py-2 shadow-sm max-w-[85%] relative">
                  <p className="text-[11px] text-white/95 leading-relaxed">{personaPreviewAnswers[aiConfig.personaTemplate]}</p>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center">
                    <span className="text-[7px] font-bold text-white">AI</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：配置区 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* 平台选项卡 */}
          <div className="flex gap-2 flex-wrap">
            {aiConfig.activePlatforms.map((pid) => {
              const pc = platformConfigs.find((p) => p.id === pid);
              const PIcon = pc ? platformIconMap[pc.icon] : null;
              return pc ? (
                <button
                  key={pid}
                  onClick={() => setSelectedPlatform(pid)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all',
                    selectedPlatform === pid
                      ? 'border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35] font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  )}
                >
                  <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: pc.color }}>
                    {PIcon && <PIcon className="w-3 h-3 text-white" />}
                  </div>
                  {pc.name}
                </button>
              ) : null;
            })}
          </div>

          {/* AI 对话测试入口 */}
          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm shadow-indigo-200/50">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">AI 对话测试</p>
                <p className="text-xs text-gray-400 mt-0.5">模拟真实会话，验证 AI 表现与人设效果</p>
              </div>
            </div>
            <button
              onClick={() => setShowDebugDrawer(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-xs font-medium rounded-xl hover:bg-indigo-600 transition-colors shadow-sm shadow-indigo-200/50"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              开始测试
            </button>
          </div>

          {/* AI 身份与人设 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF6B35]" />
              AI 身份与人设 (Identity)
            </h3>
            {/* 昵称 + 语言 两列 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">AI 员工对外昵称</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                  />
                  <button
                    onClick={handleSaveNickname}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-lg transition-colors flex-shrink-0",
                      nicknameSaved
                        ? "bg-green-50 text-green-600"
                        : "bg-[#FF6B35] text-white hover:bg-[#E85A2A]"
                    )}
                  >
                    {nicknameSaved ? '已保存' : '保存'}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">首选回复语言</label>
                <select
                  value={aiConfig.language || 'auto'}
                  onChange={(e) => updateAIEmployeeConfig({ language: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                >
                  <option value="auto">🌐 根据对方语言（自动）</option>
                  <option value="en">English (US)</option>
                  <option value="zh">中文（简体）</option>
                  <option value="zh-TW">中文（繁体）</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                  <option value="es">Espanol</option>
                  <option value="fr">Francais</option>
                  <option value="de">Deutsch</option>
                  <option value="pt">Portugues</option>
                  <option value="ar">العربية</option>
                  <option value="ru">Русский</option>
                </select>
              </div>
            </div>
            {/* 人设模板选择 */}
            <div>
              <label className="text-xs text-gray-500 mb-2 block">选择人设模板</label>
              <div className="grid grid-cols-3 gap-3">
                {personaTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectPersona(tpl.id)}
                    className={cn(
                      'p-3 rounded-xl border-2 text-left transition-all',
                      aiConfig.personaTemplate === tpl.id
                        ? 'border-[#FF6B35] bg-[#FF6B35]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0', tpl.avatarBg)}>
                        {tpl.avatarText}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-gray-900">{tpl.name}</h4>
                        <span className="text-[9px] text-gray-400">{tpl.scope}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-2 mb-2">{tpl.description}</p>
                    <div className="flex gap-1 flex-wrap">
                      {tpl.tags.map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 text-[9px] bg-gray-100 text-gray-500 rounded">{tag}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 工作时间 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              工作时间 (Schedule)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">工作时区</label>
                <select
                  value={aiConfig.timezone || 'GMT+08:00'}
                  onChange={(e) => updateAIEmployeeConfig({ timezone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                >
                  <option value="GMT+08:00">GMT+08:00 (Beijing)</option>
                  <option value="GMT+09:00">GMT+09:00 (Tokyo)</option>
                  <option value="GMT+09:30">GMT+09:30 (Seoul)</option>
                  <option value="GMT+07:00">GMT+07:00 (Bangkok)</option>
                  <option value="GMT+05:30">GMT+05:30 (Mumbai)</option>
                  <option value="GMT+03:00">GMT+03:00 (Moscow)</option>
                  <option value="GMT+01:00">GMT+01:00 (Paris)</option>
                  <option value="GMT+00:00">GMT+00:00 (London)</option>
                  <option value="GMT-03:00">GMT-03:00 (Sao Paulo)</option>
                  <option value="GMT-05:00">GMT-05:00 (New York)</option>
                  <option value="GMT-08:00">GMT-08:00 (Los Angeles)</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1.5">根据目标客户所在区域选择，避免半夜骚扰</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">在线时间段</label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={aiConfig.workStartTime}
                    onChange={(e) => updateAIEmployeeConfig({ workStartTime: e.target.value })}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                  />
                  <span className="text-xs text-gray-400">至</span>
                  <input
                    type="time"
                    value={aiConfig.workEndTime}
                    onChange={(e) => updateAIEmployeeConfig({ workEndTime: e.target.value })}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-2 block">工作日</label>
              <div className="flex gap-2">
                {[
                  { label: 'Mon', idx: 1 },
                  { label: 'Tue', idx: 2 },
                  { label: 'Wed', idx: 3 },
                  { label: 'Thu', idx: 4 },
                  { label: 'Fri', idx: 5 },
                  { label: 'Sat', idx: 6 },
                  { label: 'Sun', idx: 0 },
                ].map(({ label, idx }) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const days = aiConfig.workDays.includes(idx)
                        ? aiConfig.workDays.filter((x) => x !== idx)
                        : [...aiConfig.workDays, idx].sort();
                      updateAIEmployeeConfig({ workDays: days });
                    }}
                    className={cn(
                      'px-3 h-9 rounded-lg text-xs font-medium transition-colors',
                      aiConfig.workDays.includes(idx)
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI 能力配置 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                AI 能力配置 (Capabilities)
              </h3>
              <span className="text-[11px] text-gray-500 px-2.5 py-1 bg-gray-50 rounded-full border border-gray-100">
                当前应用 {platformConfigs.find((p) => p.id === selectedPlatform)?.name || selectedPlatform}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CapabilityCard
                icon={MessageCircle}
                iconColor="text-[#FF6B35]"
                iconBg="bg-[#FF6B35]/10"
                title="AI 销售客服"
                description="自动识别客户意图，解答产品问题，并在对话中引导客户完成订单转化"
                enabled={currentCap?.aiSalesChat ?? false}
                onToggle={() => handleToggleCapability('aiSalesChat')}
              />
              <CapabilityCard
                icon={Send}
                iconColor="text-blue-500"
                iconBg="bg-blue-50"
                title="AI 主动营销"
                description="根据客户标签，向客户主动发送个性化营销消息（SOP模板）"
                enabled={currentCap?.aiProactiveMarketing ?? false}
                onToggle={() => handleToggleCapability('aiProactiveMarketing')}
              />
              <CapabilityCard
                icon={User}
                iconColor="text-purple-500"
                iconBg="bg-purple-50"
                title="AI 沉默互回"
                description="自动识别 7 天未互动的客户进行回调提醒并发送，需配置客户互回模板新流。"
                enabled={currentCap?.aiRecall ?? false}
                onToggle={() => handleToggleCapability('aiRecall')}
              />
              <CapabilityCard
                icon={CheckCircle2}
                iconColor="text-green-500"
                iconBg="bg-green-50"
                title="AI 会话质检"
                description="对接结束后自动质检AI员工的工作质量，并自动生成质检报告"
                enabled={currentCap?.aiQualityCheck ?? false}
                onToggle={() => handleToggleCapability('aiQualityCheck')}
              />
            </div>
          </div>

          {/* 激活码范围 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-gray-500" />
              激活码范围
            </h3>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`codeScope-${aiConfig.id}`}
                  checked={(aiConfig.activationCodeScope ?? 'all') === 'all'}
                  onChange={() => updateAIEmployeeConfig({ activationCodeScope: 'all', activationCodeIds: [] })}
                  className="w-4 h-4 text-[#FF6B35]"
                />
                <span className="text-sm text-gray-700">全部激活码</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`codeScope-${aiConfig.id}`}
                  checked={aiConfig.activationCodeScope === 'custom'}
                  onChange={() => updateAIEmployeeConfig({ activationCodeScope: 'custom' })}
                  className="w-4 h-4 text-[#FF6B35]"
                />
                <span className="text-sm text-gray-700">自定义范围</span>
              </label>
            </div>
            {aiConfig.activationCodeScope === 'custom' && (
              <div className="mt-2 max-h-48 overflow-y-auto space-y-1.5 border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                {activationCodes.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-2">暂无激活码</p>
                ) : (
                  activationCodes.map((code) => (
                    <label key={code.id} className="flex items-center gap-2.5 cursor-pointer hover:bg-white rounded-lg px-2 py-1.5 transition-colors">
                      <input
                        type="checkbox"
                        checked={(aiConfig.activationCodeIds ?? []).includes(code.id)}
                        onChange={(e) => {
                          const ids = aiConfig.activationCodeIds ?? [];
                          updateAIEmployeeConfig({
                            activationCodeIds: e.target.checked
                              ? [...ids, code.id]
                              : ids.filter((id) => id !== code.id)
                          });
                        }}
                        className="w-3.5 h-3.5 text-[#FF6B35] rounded"
                      />
                      <span className="text-xs font-mono text-gray-700">{code.code}</span>
                      {code.departmentName && (
                        <span className="text-xs text-gray-400">{code.departmentName}</span>
                      )}
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 个性化配置 Banner */}
          <div className="mx-1 mb-1">
            <button
              onClick={onGoToPersonaConfig}
              className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-[#FF6B35] to-orange-400 px-5 py-4 flex items-center justify-between group hover:from-[#E85A2A] hover:to-orange-500 transition-all shadow-sm shadow-orange-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white leading-tight">个性化配置</p>
                  <p className="text-xs text-white/70 mt-0.5">知识库 · 话术库 · 回复风格</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
              {/* 装饰圆 */}
              <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute -right-1 -bottom-5 w-10 h-10 rounded-full bg-white/10 pointer-events-none" />
            </button>
          </div>
        </div>
      </div>

      {/* AI 对话测试抽屉 */}
      {showDebugDrawer && (
        <div className="fixed inset-0 z-50 flex">
          {/* 背景遮罩 */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowDebugDrawer(false)} />

          {/* 抽屉主体 */}
          <div className="relative ml-auto w-[900px] max-w-[95vw] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* 抽屉顶栏 */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">AI 对话测试</span>
                  <span className="ml-2 text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {personaTemplates.find(t => t.id === aiConfig.personaTemplate)?.name || '未选人设'} · 模拟环境
                  </span>
                </div>
              </div>
              <button onClick={() => setShowDebugDrawer(false)} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <span className="text-gray-400 text-lg leading-none">×</span>
              </button>
            </div>

            {/* 抽屉内容区 */}
            <div className="flex-1 min-h-0 flex overflow-hidden">
              {/* 左侧：聊天区 */}
              <div className="flex-1 flex flex-col border-r border-gray-100">
                {/* 消息列表 */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50/40">
                  {debugMessages.map((msg, i) => (
                    <div key={i} className={cn('flex items-end gap-2.5', msg.role === 'ai' && 'flex-row-reverse')}>
                      {/* 头像 */}
                      {msg.role === 'user' ? (
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 text-gray-500" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-[8px] font-bold text-white">AI</span>
                        </div>
                      )}
                      {/* 气泡 */}
                      <div className={cn(
                        'max-w-[68%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                        msg.role === 'user'
                          ? 'bg-white border border-gray-100 shadow-sm text-gray-700 rounded-bl-sm'
                          : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm shadow-sm shadow-indigo-200/50'
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={debugEndRef} />
                </div>

                {/* 输入区 */}
                <div className="flex-shrink-0 px-5 py-3.5 border-t border-gray-100 bg-white flex items-center gap-3">
                  <input
                    value={debugInput}
                    onChange={e => setDebugInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleDebugSend()}
                    placeholder="输入测试消息，按 Enter 发送..."
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 focus:bg-white placeholder:text-gray-300 transition-all"
                  />
                  <button
                    onClick={handleDebugSend}
                    disabled={!debugInput.trim()}
                    className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 右侧：AI 功能面板 */}
              <div className="w-72 flex-shrink-0 flex flex-col bg-white overflow-y-auto">
                <CustomerAIProfile />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ========== AI 个性化配置页 ==========
const AIPersonaConfigPage: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const selectedAIEmployeeId = useStore((s) => s.selectedAIEmployeeId);
  const aiEmployees = useStore((s) => s.aiEmployees);
  const updateAIEmployeeConfig = useStore((s) => s.updateAIEmployeeConfig);
  const activationCodes = useStore((s) => s.activationCodes);
  const aiConfig = aiEmployees.find((e) => e.id === selectedAIEmployeeId);

  const personaConfig = aiConfig?.personaConfig ?? {};
  const updatePersonaConfig = (updates: Partial<NonNullable<typeof personaConfig>>) => {
    updateAIEmployeeConfig({ personaConfig: { ...personaConfig, ...updates } });
  };

  const replyStyles = [
    { id: 'formal', label: '正式', desc: '专业严谨，适合企业客服' },
    { id: 'friendly', label: '亲切', desc: '温暖自然，拉近客户距离' },
    { id: 'concise', label: '简洁', desc: '直接高效，减少冗余表达' },
  ] as const;

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      {/* 顶部面包屑 */}
      <div className="flex-shrink-0 flex items-center gap-2 px-6 py-4 bg-white border-b border-gray-100">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>{aiConfig?.name ?? 'AI员工'}</span>
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-sm font-medium text-gray-900">个性化配置</span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 max-w-2xl">

        {/* 激活码范围 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-gray-500" />
            激活码范围
          </h3>
          <p className="text-xs text-gray-400">选择此个性化配置应用的激活码范围</p>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="persona-codeScope"
                checked={(aiConfig?.activationCodeScope ?? 'all') === 'all'}
                onChange={() => updateAIEmployeeConfig({ activationCodeScope: 'all', activationCodeIds: [] })}
                className="w-4 h-4 text-[#FF6B35]"
              />
              <span className="text-sm text-gray-700">全部激活码</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="persona-codeScope"
                checked={aiConfig?.activationCodeScope === 'custom'}
                onChange={() => updateAIEmployeeConfig({ activationCodeScope: 'custom' })}
                className="w-4 h-4 text-[#FF6B35]"
              />
              <span className="text-sm text-gray-700">自定义范围</span>
            </label>
          </div>
          {aiConfig?.activationCodeScope === 'custom' && (
            <div className="max-h-48 overflow-y-auto space-y-1.5 border border-gray-100 rounded-xl p-3 bg-gray-50/50">
              {activationCodes.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-2">暂无激活码</p>
              ) : (
                activationCodes.map((code) => (
                  <label key={code.id} className="flex items-center gap-2.5 cursor-pointer hover:bg-white rounded-lg px-2 py-1.5 transition-colors">
                    <input
                      type="checkbox"
                      checked={(aiConfig.activationCodeIds ?? []).includes(code.id)}
                      onChange={(e) => {
                        const ids = aiConfig.activationCodeIds ?? [];
                        updateAIEmployeeConfig({
                          activationCodeIds: e.target.checked
                            ? [...ids, code.id]
                            : ids.filter((id) => id !== code.id)
                        });
                      }}
                      className="w-3.5 h-3.5 text-[#FF6B35] rounded"
                    />
                    <span className="text-xs font-mono text-gray-700">{code.code}</span>
                    {code.departmentName && (
                      <span className="text-xs text-gray-400">{code.departmentName}</span>
                    )}
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        {/* 知识库 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">知识库</p>
                <p className="text-xs text-gray-400 mt-0.5">AI 回复时优先引用知识库内容</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updatePersonaConfig({ knowledgeBaseEnabled: !personaConfig.knowledgeBaseEnabled })}
              className={cn(
                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                personaConfig.knowledgeBaseEnabled ? "bg-[#FF6B35]" : "bg-gray-200"
              )}
            >
              <span className={cn(
                "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform",
                personaConfig.knowledgeBaseEnabled ? "translate-x-4" : "translate-x-0.5"
              )} />
            </button>
          </div>
        </div>

        {/* 话术库 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">话术库</p>
                <p className="text-xs text-gray-400 mt-0.5">启用预设话术，提升回复一致性</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updatePersonaConfig({ scriptLibraryEnabled: !personaConfig.scriptLibraryEnabled })}
              className={cn(
                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                personaConfig.scriptLibraryEnabled ? "bg-[#FF6B35]" : "bg-gray-200"
              )}
            >
              <span className={cn(
                "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform",
                personaConfig.scriptLibraryEnabled ? "translate-x-4" : "translate-x-0.5"
              )} />
            </button>
          </div>
        </div>

        {/* 回复风格 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">回复风格</p>
              <p className="text-xs text-gray-400 mt-0.5">影响 AI 的语气和表达方式</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {replyStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => updatePersonaConfig({ replyStyle: style.id })}
                className={cn(
                  "p-3 rounded-xl border-2 text-left transition-all",
                  (personaConfig.replyStyle ?? 'friendly') === style.id
                    ? "border-[#FF6B35] bg-[#FF6B35]/5"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <p className={cn(
                  "text-sm font-semibold",
                  (personaConfig.replyStyle ?? 'friendly') === style.id ? "text-[#FF6B35]" : "text-gray-700"
                )}>{style.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{style.desc}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// 能力卡片组件
const CapabilityCard: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}> = ({ icon: Icon, iconColor, iconBg, title, description, enabled, onToggle }) => (
  <div className={cn(
    "p-4 rounded-xl border transition-all",
    enabled ? "border-[#FF6B35]/20 bg-[#FF6B35]/[0.02]" : "border-gray-200"
  )}>
    <div className="flex items-start justify-between mb-3">
      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", iconBg)}>
        <Icon className={cn("w-4.5 h-4.5", iconColor)} />
      </div>
      <button
        onClick={onToggle}
        className={cn(
          "w-11 h-6 rounded-full transition-colors relative flex-shrink-0",
          enabled ? "bg-[#FF6B35]" : "bg-gray-200"
        )}
      >
        <span className={cn(
          "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
          enabled ? "left-[22px]" : "left-0.5"
        )} />
      </button>
    </div>
    <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
    <p className="text-[11px] text-gray-500 leading-relaxed">{description}</p>
  </div>
);

// 客户列表页面
const CUSTOMER_STATUS_MAP: Record<string, { label: string; cls: string }> = {
  normal: { label: '正常', cls: 'bg-green-50 text-green-600 border-green-200' },
  unfollowed: { label: '取消跟进', cls: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  deleted: { label: '已删除', cls: 'bg-red-50 text-red-500 border-red-200' },
};

const getActivityLevel = (customer: import('@/types').CustomerProfile) => {
  const days = customer.lastContactAt
    ? Math.floor((Date.now() - new Date(customer.lastContactAt).getTime()) / 86400000)
    : 999;
  if (days <= 3) return { level: '高' as const, cls: 'text-green-600' };
  if (days <= 14) return { level: '中' as const, cls: 'text-yellow-600' };
  return { level: '低' as const, cls: 'text-gray-400' };
};

const getCustomerStatus = (_customer: import('@/types').CustomerProfile) => {
  // 默认都是正常状态，取消跟进和已删除需要业务操作触发
  return 'normal';
};

const AdminCustomerListPage: React.FC<{ onViewDetail: (customerId: string) => void }> = ({ onViewDetail }) => {
  const conversations = useStore((s) => s.conversations);
  const activationCodes = useStore((s) => s.activationCodes);
  const platformAccounts = useStore((s) => s.platformAccounts);
  const aiLabels = useStore((s) => s.aiLabels);
  const setSelectedConversation = useStore((s) => s.setSelectedConversation);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [codeFilter, setCodeFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [nicknameFilter, setNicknameFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState('');
  const [leadDateRange, setLeadDateRange] = useState('');
  const [recordDateRange, setRecordDateRange] = useState('');
  const [tagFilter, setTagFilter] = useState<Record<string, string[]>>({});
  const [showTagSidebar, setShowTagSidebar] = useState(false);
  const [showCodeDropdown, setShowCodeDropdown] = useState(false);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);

  const customers = useMemo(() => {
    const seen = new Set<string>();
    const list: typeof conversations[0]['customer'][] = [];
    for (const conv of conversations) {
      if (!seen.has(conv.customer.id)) {
        seen.add(conv.customer.id);
        list.push(conv.customer);
      }
    }
    return list;
  }, [conversations]);

  // 客户 → 会话/账号映射
  const customerConvMap = useMemo(() => {
    const map = new Map<string, typeof conversations[0]>();
    for (const conv of conversations) {
      if (!map.has(conv.customer.id)) map.set(conv.customer.id, conv);
    }
    return map;
  }, [conversations]);

  const getCustomerAccount = (customerId: string) => {
    const conv = customerConvMap.get(customerId);
    if (!conv) return null;
    return platformAccounts.find(a => a.platformId === conv.platform) ?? null;
  };

  const getCustomerActivationCode = (customerId: string) => {
    const account = getCustomerAccount(customerId);
    if (!account) return activationCodes[0] ?? null;
    return activationCodes.find(ac => ac.platforms?.includes(account.platformId)) ?? activationCodes[0] ?? null;
  };

  // 国家列表
  const allCountries = useMemo(() => {
    const set = new Set(customers.map(c => c.country));
    return Array.from(set).sort();
  }, [customers]);

  // AI画像标签：三级字段 + 四级可选值
  const aiLabelFields = useMemo(() => aiLabels.filter(l => l.level === 3), [aiLabels]);
  const getFieldOptions = (fieldId: string) => aiLabels.filter(l => l.level === 4 && l.parentId === fieldId);

  const toggleTagFilter = (fieldId: string, optionId: string) => {
    setTagFilter(prev => {
      const current = prev[fieldId] ?? [];
      const next = current.includes(optionId)
        ? current.filter(v => v !== optionId)
        : [...current, optionId];
      return { ...prev, [fieldId]: next };
    });
  };

  const filtered = useMemo(() => {
    let result = customers;
    if (platformFilter !== 'all') {
      result = result.filter(c => c.platform === platformFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter(c => getCustomerStatus(c) === statusFilter);
    }
    if (codeFilter !== 'all') {
      result = result.filter(c => {
        const ac = getCustomerActivationCode(c.id);
        return ac?.code === codeFilter;
      });
    }
    if (countryFilter !== 'all') {
      result = result.filter(c => c.country === countryFilter);
    }
    if (activityFilter !== 'all') {
      result = result.filter(c => getActivityLevel(c).level === activityFilter);
    }
    // AI画像标签筛选：每个字段内OR，字段间AND
    const activeFieldEntries = Object.entries(tagFilter).filter(([, vals]) => vals.length > 0);
    if (activeFieldEntries.length > 0) {
      result = result.filter(c => {
        return activeFieldEntries.every(([, labelIds]) => {
          return labelIds.some(labelId => {
            const label = aiLabels.find(l => l.id === labelId);
            return label ? c.tags.includes(label.name) : false;
          });
        });
      });
    }
    if (nicknameFilter.trim()) {
      const q = nicknameFilter.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || (c.notes && c.notes.toLowerCase().includes(q)));
    }
    if (accountFilter.trim()) {
      const q = accountFilter.toLowerCase();
      result = result.filter(c => {
        const account = getCustomerAccount(c.id);
        return account?.accountId?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
      });
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q)) ||
        c.country.toLowerCase().includes(q) ||
        (c.notes && c.notes.toLowerCase().includes(q))
      );
    }
    return result;
  }, [customers, platformFilter, statusFilter, codeFilter, countryFilter, activityFilter, tagFilter, nicknameFilter, accountFilter, searchQuery]);

  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return date instanceof Date ? date.toLocaleDateString('zh-CN') : String(date);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setPlatformFilter('all');
    setStatusFilter('all');
    setCodeFilter('all');
    setCountryFilter('all');
    setActivityFilter('all');
    setNicknameFilter('');
    setAccountFilter('');
    setLeadDateRange('');
    setRecordDateRange('');
    setTagFilter({});
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(c => c.id)));
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      {/* 顶部栏 */}
      <div className="px-6 py-4 flex items-center justify-between flex-shrink-0 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-[#FF6B35]" />
          <h1 className="text-base font-semibold text-gray-900">客户管理</h1>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{customers.length} 位客户</span>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-[#E85A2A] transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          添加客户
        </button>
      </div>

      {/* 提示说明 */}
      <div className="px-6 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
        <span className="text-xs text-amber-700">仅开启了"聊天备份"的激活码，并且在社交账号上对客户添加了"客户画像"信息，才会上报客户信息</span>
      </div>

      {/* 筛选栏 */}
      <div className="px-6 py-3 bg-white border-b border-gray-100 space-y-3">
        {/* 第一行筛选 */}
        <div className="grid grid-cols-5 gap-3">
          <div className="relative">
            <label className="text-[11px] text-gray-400 mb-1 block">激活码</label>
            <button
              onClick={() => setShowCodeDropdown(!showCodeDropdown)}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] text-left flex items-center justify-between hover:border-[#FF6B35] transition-colors"
            >
              <span>{codeFilter === 'all' ? '全部激活码' : activationCodes.find(ac => ac.code === codeFilter)?.code + (activationCodes.find(ac => ac.code === codeFilter)?.remark ? ` (${activationCodes.find(ac => ac.code === codeFilter)?.remark})` : '')}</span>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showCodeDropdown && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                <div onClick={() => { setCodeFilter('all'); setShowCodeDropdown(false); }} className="px-2.5 py-1.5 text-sm text-[#666] hover:bg-[#FFF7F3] cursor-pointer">全部激活码</div>
                {activationCodes.map(ac => (
                  <div key={ac.id} onClick={() => { setCodeFilter(ac.code); setShowCodeDropdown(false); }} className={`px-2.5 py-1.5 text-sm cursor-pointer transition-colors ${codeFilter === ac.code ? 'bg-[#FF6B35] text-white' : 'text-[#666] hover:bg-[#FFF7F3]'}`}>{ac.code}{ac.remark ? ` (${ac.remark})` : ''}</div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <label className="text-[11px] text-gray-400 mb-1 block">社交平台</label>
            <button
              onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] text-left flex items-center justify-between hover:border-[#FF6B35] transition-colors"
            >
              <span>{platformFilter === 'all' ? '全部平台' : platformConfigs.find(p => p.id === platformFilter)?.name}</span>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showPlatformDropdown && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                <div onClick={() => { setPlatformFilter('all'); setShowPlatformDropdown(false); }} className="px-2.5 py-1.5 text-sm text-[#666] hover:bg-[#FFF7F3] cursor-pointer">全部平台</div>
                {platformConfigs.map(p => (
                  <div key={p.id} onClick={() => { setPlatformFilter(p.id); setShowPlatformDropdown(false); }} className={`px-2.5 py-1.5 text-sm cursor-pointer transition-colors ${platformFilter === p.id ? 'bg-[#FF6B35] text-white' : 'text-[#666] hover:bg-[#FFF7F3]'}`}>{p.name}</div>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <label className="text-[11px] text-gray-400 mb-1 block">国家</label>
            <button
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] text-left flex items-center justify-between hover:border-[#FF6B35] transition-colors"
            >
              <span>{countryFilter === 'all' ? '全部国家' : countryFilter}</span>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showCountryDropdown && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                <div onClick={() => { setCountryFilter('all'); setShowCountryDropdown(false); }} className="px-2.5 py-1.5 text-sm text-[#666] hover:bg-[#FFF7F3] cursor-pointer">全部国家</div>
                {allCountries.map(c => (
                  <div key={c} onClick={() => { setCountryFilter(c); setShowCountryDropdown(false); }} className={`px-2.5 py-1.5 text-sm cursor-pointer transition-colors ${countryFilter === c ? 'bg-[#FF6B35] text-white' : 'text-[#666] hover:bg-[#FFF7F3]'}`}>{c}</div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">社交账号昵称</label>
            <input type="text" placeholder="请输入" value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)} className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]" />
          </div>
          <div className="relative">
            <label className="text-[11px] text-gray-400 mb-1 block">客户状态</label>
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] text-left flex items-center justify-between hover:border-[#FF6B35] transition-colors"
            >
              <span>{statusFilter === 'all' ? '全部状态' : CUSTOMER_STATUS_MAP[statusFilter]?.label}</span>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showStatusDropdown && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                <div onClick={() => { setStatusFilter('all'); setShowStatusDropdown(false); }} className="px-2.5 py-1.5 text-sm text-[#666] hover:bg-[#FFF7F3] cursor-pointer">全部状态</div>
                {Object.entries(CUSTOMER_STATUS_MAP).map(([k, v]) => (
                  <div key={k} onClick={() => { setStatusFilter(k); setShowStatusDropdown(false); }} className={`px-2.5 py-1.5 text-sm cursor-pointer transition-colors ${statusFilter === k ? 'bg-[#FF6B35] text-white' : 'text-[#666] hover:bg-[#FFF7F3]'}`}>{v.label}</div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* 第二行筛选 */}
        <div className="grid grid-cols-5 gap-3">
          <div className="relative">
            <label className="text-[11px] text-gray-400 mb-1 block">活跃度</label>
            <button
              onClick={() => setShowActivityDropdown(!showActivityDropdown)}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] text-left flex items-center justify-between hover:border-[#FF6B35] transition-colors"
            >
              <span>{activityFilter === 'all' ? '全部' : activityFilter}</span>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showActivityDropdown && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                {['all', '高', '中', '低'].map(a => (
                  <div key={a} onClick={() => { setActivityFilter(a); setShowActivityDropdown(false); }} className={`px-2.5 py-1.5 text-sm cursor-pointer transition-colors ${activityFilter === a ? 'bg-[#FF6B35] text-white' : 'text-[#666] hover:bg-[#FFF7F3]'}`}>{a === 'all' ? '全部' : a}</div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">昵称备注</label>
            <input type="text" placeholder="请输入" value={nicknameFilter} onChange={(e) => setNicknameFilter(e.target.value)} className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">线索录入时间</label>
            <input type="date" value={leadDateRange} onChange={(e) => setLeadDateRange(e.target.value)} className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">记录时间</label>
            <input type="date" value={recordDateRange} onChange={(e) => setRecordDateRange(e.target.value)} className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]" />
          </div>
          <div className="flex items-end gap-2">
            <button onClick={() => {}} className="px-4 py-1.5 text-sm font-medium bg-[#FF6B35] text-white rounded-lg hover:bg-[#E85A2A] transition-colors">查询</button>
            <button onClick={handleResetFilters} className="px-4 py-1.5 text-sm font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">重置</button>
          </div>
        </div>
        {/* 第三行：操作栏 */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTagSidebar(!showTagSidebar)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors",
                showTagSidebar
                  ? "bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/30"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              )}
            >
              <Tags className="w-3.5 h-3.5" />
              标签筛选
              {Object.values(tagFilter).flat().length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-[#FF6B35] text-white rounded-full leading-none">
                  {Object.values(tagFilter).flat().length}
                </span>
              )}
            </button>
            <span className="text-xs text-gray-400">{filtered.length} 条结果</span>
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-3.5 h-3.5" />
            导出
          </button>
        </div>
      </div>

      {/* 表格 + 标签侧边栏 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 表格区域 */}
        <div className="flex-1 overflow-auto px-6 py-4">
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="w-10 py-3 px-4">
                  <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]/30" />
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">激活码(备注)</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">社交账号</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">客户信息</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">昵称备注</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">客户标签</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">客户手机号</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">客户备注</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">国家</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">线索录入时间</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">记录时间</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">更新时间</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">活跃度</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">客户状态</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => {
                const activity = getActivityLevel(customer);
                const status = getCustomerStatus(customer);
                const statusCfg = CUSTOMER_STATUS_MAP[status] ?? CUSTOMER_STATUS_MAP.normal;
                const ac = getCustomerActivationCode(customer.id);
                const account = getCustomerAccount(customer.id);
                const pc = platformConfigs.find(p => p.id === customer.platform);
                return (
                  <tr key={customer.id} className="border-b border-gray-50 hover:bg-[#FF6B35]/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <input type="checkbox" checked={selectedIds.has(customer.id)} onChange={() => toggleSelect(customer.id)} className="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]/30" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-700">{ac?.code ?? '-'}</div>
                      {ac?.remark && <div className="text-[11px] text-gray-400">{ac.remark}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {pc && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: pc.color }} />}
                        <span className="text-sm text-gray-700">{account?.accountId ?? customer.email ?? '-'}</span>
                      </div>
                      {pc && <div className="text-[11px] text-gray-400 mt-0.5">{pc.name}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {customer.avatar ? (
                            <img src={customer.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserCircle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm text-gray-700">{customer.name}</div>
                          {customer.email && <div className="text-[11px] text-gray-400">{customer.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{customer.notes || customer.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {customer.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-[#FF6B35]/8 text-[#FF6B35] rounded">{tag}</span>
                        ))}
                        {customer.tags.length > 2 && <span className="text-[10px] text-gray-400">+{customer.tags.length - 2}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-700 font-medium">{customer.phone || '-'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600 truncate max-w-[200px] inline-block">{customer.notes || customer.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600">{customer.country}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(customer.createdAt)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(customer.lastContactAt)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(customer.lastContactAt)}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${activity.cls}`}>{activity.level}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${statusCfg.cls}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => {
                          const conv = customerConvMap.get(customer.id);
                          if (conv) setSelectedConversation(conv.id);
                          onViewDetail(customer.id);
                        }} className="text-xs text-[#FF6B35] hover:underline whitespace-nowrap">聊天记录</button>
                        <button onClick={() => {
                          const conv = customerConvMap.get(customer.id);
                          if (conv) setSelectedConversation(conv.id);
                          onViewDetail(customer.id);
                        }} className="text-xs text-[#FF6B35] hover:underline whitespace-nowrap">客户详情</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <UserCircle className="w-10 h-10 mb-3 text-gray-300" />
              <p className="text-sm">暂无客户数据</p>
              <p className="text-xs mt-1">请调整筛选条件</p>
            </div>
          )}
        </div>
        </div>

        {/* AI画像标签侧边栏 */}
        <div className={cn(
          "border-l border-gray-200 bg-white overflow-y-auto transition-all duration-300 flex-shrink-0",
          showTagSidebar ? "w-72" : "w-0 border-l-0"
        )}>
          {showTagSidebar && (
            <div className="p-4 space-y-4 w-72">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Tags className="w-4 h-4 text-[#FF6B35]" />
                  <span className="text-sm font-medium text-gray-800">AI画像标签</span>
                </div>
                <button
                  onClick={() => setShowTagSidebar(false)}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {Object.values(tagFilter).flat().length > 0 && (
                <button
                  onClick={() => setTagFilter({})}
                  className="text-[11px] text-[#FF6B35] hover:underline"
                >
                  清除全部筛选
                </button>
              )}

              {aiLabelFields.slice(0, 8).map(field => {
                const options = getFieldOptions(field.id);
                const selected = tagFilter[field.id] ?? [];
                return (
                  <div key={field.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-gray-500">{field.name}</span>
                      {selected.length > 0 && (
                        <span className="text-[10px] text-[#FF6B35]">{selected.length}项</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {options.map(opt => {
                        const isSelected = selected.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            onClick={() => toggleTagFilter(field.id, opt.id)}
                            className={cn(
                              "px-2.5 py-1 text-xs rounded-lg transition-all border",
                              isSelected
                                ? "bg-[#FF6B35] text-white border-transparent"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                            )}
                          >
                            {opt.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

// ============ 客户详情整页视图 ============
const AdminCustomerDetailPage: React.FC<{
  customerId: string | null;
  onBack: () => void;
}> = ({ customerId, onBack }) => {
  const conversations = useStore((s) => s.conversations);
  const setSelectedConversation = useStore((s) => s.setSelectedConversation);

  const conversation = useMemo(() => {
    if (!customerId) return null;
    return conversations.find(c => c.customer.id === customerId) ?? null;
  }, [conversations, customerId]);

  const customer = conversation?.customer ?? null;

  // 设置 selectedConversation 以便 CustomerAIProfile 能读取
  useEffect(() => {
    if (conversation) setSelectedConversation(conversation.id);
  }, [conversation, setSelectedConversation]);

  const messages = conversation?.messages ?? [];

  // 跟进记录
  interface FollowUpRecord {
    id: string;
    content: string;
    createdAt: string;
    type: 'call' | 'visit' | 'email' | 'wechat' | 'other';
  }
  const FOLLOW_UP_TYPES: { value: FollowUpRecord['type']; label: string }[] = [
    { value: 'call', label: '电话' },
    { value: 'wechat', label: '微信' },
    { value: 'email', label: '邮件' },
    { value: 'visit', label: '拜访' },
    { value: 'other', label: '其他' },
  ];
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>([
    { id: 'fu_1', content: '首次联系客户，了解需求，客户对产品感兴趣', createdAt: '2025-01-15 10:30', type: 'call' },
    { id: 'fu_2', content: '发送产品报价单，客户表示需要内部讨论', createdAt: '2025-01-18 14:20', type: 'email' },
  ]);
  const [newFollowUp, setNewFollowUp] = useState('');
  const [newFollowUpType, setNewFollowUpType] = useState<FollowUpRecord['type']>('call');
  const [showFollowUpInput, setShowFollowUpInput] = useState(false);

  const handleAddFollowUp = () => {
    if (!newFollowUp.trim()) return;
    const record: FollowUpRecord = {
      id: `fu_${Date.now()}`,
      content: newFollowUp.trim(),
      createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      type: newFollowUpType,
    };
    setFollowUps(prev => [record, ...prev]);
    setNewFollowUp('');
    setShowFollowUpInput(false);
  };

  if (!customerId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p className="text-sm">未选择客户</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      {/* 顶部导航栏 */}
      <div className="flex items-center gap-3 px-6 py-3 bg-white border-b border-gray-100 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          返回客户列表
        </button>
        <div className="w-px h-5 bg-gray-200" />
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-[#FF6B35]" />
          <span className="text-sm font-medium text-gray-800">
            {customer?.name ?? '客户详情'}
          </span>
          {conversation && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {platformConfigs.find(p => p.id === conversation.platform)?.name ?? conversation.platform}
            </span>
          )}
        </div>
      </div>

      {/* 主体：三列分栏 */}
      <div className="flex-1 flex min-h-0">
        {/* 左侧：聊天记录 */}
        <div className="flex-[3] border-r border-gray-100 flex flex-col min-h-0 bg-white">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/80 flex-shrink-0">
            <MessageSquare className="w-4 h-4 text-[#FF6B35]" />
            <span className="text-sm font-medium text-gray-800">聊天记录</span>
            <span className="ml-auto text-xs text-gray-400">{messages.length} 条消息</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageSquare className="w-8 h-8 mb-2 text-gray-300" />
                <p className="text-sm">暂无聊天记录</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isCustomer = msg.senderType === 'customer';
                return (
                  <div key={msg.id} className={cn("flex gap-2 items-start", isCustomer ? "justify-start" : "justify-end")}>
                    {isCustomer && (
                      <img
                        src={conversation?.customer.avatar}
                        alt="Customer"
                        className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5"
                      />
                    )}
                    <div className={cn(
                      "max-w-[75%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                      isCustomer
                        ? "bg-white text-gray-800 border border-gray-100"
                        : msg.senderType === 'ai'
                          ? "bg-purple-50 text-purple-900 border border-purple-100"
                          : "bg-[#FF6B35]/10 text-gray-800 border border-[#FF6B35]/20"
                    )}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-medium text-gray-400">
                          {isCustomer ? '客户' : msg.senderType === 'ai' ? 'AI' : '客服'}
                        </span>
                        <span className="text-[10px] text-gray-300">
                          {(() => { try { return new Date(msg.timestamp).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }); } catch { return ''; } })()}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      {msg.translatedContent && msg.translatedContent !== msg.content && (
                        <p className="mt-1.5 pt-1.5 border-t border-gray-200/60 text-xs text-gray-500 italic">{msg.translatedContent}</p>
                      )}
                    </div>
                    {!isCustomer && (
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                        msg.senderType === 'ai' ? "bg-purple-100" : "bg-[#FF6B35]/10"
                      )}>
                        {msg.senderType === 'ai' ? (
                          <Bot className="w-4 h-4 text-purple-600" />
                        ) : (
                          <User className="w-4 h-4 text-[#FF6B35]" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 中间：AI画像 */}
        <div className="flex-1 border-r border-gray-100 overflow-y-auto bg-white min-w-0">
          <CustomerAIProfile />
        </div>

        {/* 右侧：跟进记录 */}
        <div className="w-80 flex-shrink-0 flex flex-col min-h-0 bg-white">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/80 flex-shrink-0">
            <ClipboardList className="w-4 h-4 text-[#FF6B35]" />
            <span className="text-sm font-medium text-gray-800">跟进记录</span>
            <span className="text-xs text-gray-400">{followUps.length} 条</span>
            <button
              onClick={() => setShowFollowUpInput(!showFollowUpInput)}
              className="ml-auto flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-[#FF6B35] rounded-md hover:bg-[#FF6B35]/90 transition-colors"
            >
              <Plus className="w-3 h-3" />
              新增跟进
            </button>
          </div>

          {/* 新增跟进输入 */}
          {showFollowUpInput && (
            <div className="px-4 py-3 bg-orange-50/50 border-b border-orange-100 flex-shrink-0 space-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {FOLLOW_UP_TYPES.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setNewFollowUpType(t.value)}
                    className={cn(
                      "px-2.5 py-1 text-xs rounded-md border transition-colors",
                      newFollowUpType === t.value
                        ? "bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/30 font-medium"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <textarea
                value={newFollowUp}
                onChange={e => setNewFollowUp(e.target.value)}
                placeholder="输入跟进内容..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35]/40"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAddFollowUp}
                  disabled={!newFollowUp.trim()}
                  className={cn(
                    "px-4 py-1.5 text-xs font-medium rounded-lg transition-colors",
                    newFollowUp.trim()
                      ? "bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  )}
                >
                  保存
                </button>
              </div>
            </div>
          )}

          {/* 跟进记录列表 */}
          <div className="flex-1 overflow-y-auto">
            {followUps.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ClipboardList className="w-6 h-6 mb-2 text-gray-300" />
                <p className="text-xs">暂无跟进记录</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {followUps.map(record => (
                  <div key={record.id} className="px-5 py-3 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={cn(
                        "px-1.5 py-0.5 text-[10px] font-medium rounded",
                        record.type === 'call' ? 'bg-blue-50 text-blue-600' :
                        record.type === 'wechat' ? 'bg-green-50 text-green-600' :
                        record.type === 'email' ? 'bg-purple-50 text-purple-600' :
                        record.type === 'visit' ? 'bg-orange-50 text-orange-600' :
                        'bg-gray-100 text-gray-500'
                      )}>
                        {FOLLOW_UP_TYPES.find(t => t.value === record.type)?.label ?? '其他'}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {record.createdAt}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{record.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

type PlatformTicketStatus = 'normal' | 'disabled';

interface PlatformTicket {
  id: string;
  ticketNo: string;
  platform: string;
  activationCode: string;
  activationRemark: string;
  status: PlatformTicketStatus;
  onlineConversations: number;
  totalConversations: number;
  completedConversations: number;
  totalTarget: number;
  todayNewLeads: number;
  todayRepeatLeads: number;
  totalRepeatLeads: number;
  todayRemovedLeads: number;
  totalRemovedLeads: number;
  dailyResetTime: string;
  ticketResetTime: string;
  groupId: string;
  createdAt: Date;
}

// 工单状态配置
const ticketStatusConfig: Record<PlatformTicketStatus, { label: string; cls: string }> = {
  normal: { label: '正常', cls: 'bg-green-50 text-green-700 border-green-200' },
  disabled: { label: '禁用', cls: 'bg-red-50 text-red-600 border-red-200' },
};

// 工单分组
interface TicketGroup {
  id: string;
  name: string;
  count: number;
}

// Mock 平台工单数据
const mockPlatformTickets: PlatformTicket[] = [
  { id: 'pt_1', ticketNo: '20260203180448839688', platform: 'telegram', activationCode: 'yFA1neN1BUrl', activationRemark: '', status: 'normal', onlineConversations: 0, totalConversations: 0, completedConversations: 0, totalTarget: 0, todayNewLeads: 0, todayRepeatLeads: 0, totalRepeatLeads: 0, todayRemovedLeads: 0, totalRemovedLeads: 0, dailyResetTime: '00:00', ticketResetTime: '', groupId: 'default', createdAt: new Date('2026-02-03T18:04:00') },
  { id: 'pt_2', ticketNo: '20260203105618183779', platform: 'telegram', activationCode: 'E5Ap7n3P846l', activationRemark: '', status: 'disabled', onlineConversations: 0, totalConversations: 0, completedConversations: 0, totalTarget: 0, todayNewLeads: 0, todayRepeatLeads: 0, totalRepeatLeads: 0, todayRemovedLeads: 0, totalRemovedLeads: 0, dailyResetTime: '00:00', ticketResetTime: '', groupId: 'default', createdAt: new Date('2026-02-03T10:56:00') },
  { id: 'pt_3', ticketNo: '20260204091532847261', platform: 'telegram', activationCode: '7xUG7y4kO4BS', activationRemark: '', status: 'normal', onlineConversations: 0, totalConversations: 0, completedConversations: 0, totalTarget: 0, todayNewLeads: 0, todayRepeatLeads: 0, totalRepeatLeads: 0, todayRemovedLeads: 0, totalRemovedLeads: 0, dailyResetTime: '00:00', ticketResetTime: '', groupId: 'sales', createdAt: new Date('2026-02-04T09:15:00') },
  { id: 'pt_4', ticketNo: '20260204142817593042', platform: 'telegram', activationCode: 'pyWabKS233Yu', activationRemark: '', status: 'normal', onlineConversations: 0, totalConversations: 2, completedConversations: 0, totalTarget: 0, todayNewLeads: 0, todayRepeatLeads: 0, totalRepeatLeads: 0, todayRemovedLeads: 0, totalRemovedLeads: 0, dailyResetTime: '00:00', ticketResetTime: '', groupId: 'sales', createdAt: new Date('2026-02-04T14:28:00') },
  { id: 'pt_5', ticketNo: '20260205083921674518', platform: 'telegram', activationCode: '0A6514e6oHg2', activationRemark: '', status: 'normal', onlineConversations: 0, totalConversations: 2, completedConversations: 0, totalTarget: 0, todayNewLeads: 0, todayRepeatLeads: 0, totalRepeatLeads: 0, todayRemovedLeads: 0, totalRemovedLeads: 0, dailyResetTime: '00:00', ticketResetTime: '', groupId: 'source', createdAt: new Date('2026-02-05T08:39:00') },
  { id: 'pt_6', ticketNo: '20260205093921674519', platform: 'telegram', activationCode: '7DmmGnc5uD5v', activationRemark: '', status: 'normal', onlineConversations: 1, totalConversations: 2, completedConversations: 1, totalTarget: 0, todayNewLeads: 1, todayRepeatLeads: 0, totalRepeatLeads: 0, todayRemovedLeads: 0, totalRemovedLeads: 0, dailyResetTime: '00:00', ticketResetTime: '', groupId: 'default', createdAt: new Date('2026-02-05T09:39:00') },
  { id: 'pt_7', ticketNo: '20260205103921674520', platform: 'telegram', activationCode: '07UX3yCL50W3', activationRemark: '门店在用', status: 'normal', onlineConversations: 0, totalConversations: 1, completedConversations: 7, totalTarget: 0, todayNewLeads: 0, todayRepeatLeads: 0, totalRepeatLeads: 0, todayRemovedLeads: 0, totalRemovedLeads: 0, dailyResetTime: '00:00', ticketResetTime: '', groupId: 'default', createdAt: new Date('2026-02-05T10:39:00') },
];

// 工单列表页面
const AdminTicketListPage: React.FC = () => {
  const [detailTicket, setDetailTicket] = useState<PlatformTicket | null>(null);

  if (detailTicket) {
    return <TicketDetailPage ticket={detailTicket} onBack={() => setDetailTicket(null)} />;
  }

  return <TicketListView onViewDetail={setDetailTicket} />;
};

// 工单账号数据
interface TicketAccount {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  remark: string;
  completedToday: number;
  targetToday: number;
  completedTotal: number;
  targetTotal: number;
  todayRepeat: number;
  totalRepeat: number;
  aiEnabled: boolean;
  onlineEnabled: boolean;
  onlineStatus: 'online' | 'offline';
  note: string;
  addLink: string;
  qrCode: string;
  lastActiveAt: string;
  currentLoginAt: string;
  clientVersion: string;
  platform: string;
}

const mockTicketAccounts: TicketAccount[] = [
  {
    id: 'ta_1', name: 'Adele 多', phone: '+8613720371545', remark: '',
    completedToday: 0, targetToday: 0, completedTotal: 0, targetTotal: 0,
    todayRepeat: 0, totalRepeat: 0, aiEnabled: true, onlineEnabled: true,
    onlineStatus: 'online', note: '', addLink: 'https://t.me/+8613720371545',
    qrCode: 'qr_1', lastActiveAt: '2026-04-09 18:31:42', currentLoginAt: '2026-04-09 18:31:42',
    clientVersion: '2.0.0', platform: 'telegram',
  },
];

// 工单详情页
const TicketDetailPage: React.FC<{ ticket: PlatformTicket; onBack: () => void }> = ({ ticket, onBack }) => {
  const [platformFilter, setPlatformFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [onlineFilter, setOnlineFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState('每1分钟');

  const pc = platformConfigs.find(p => p.id === ticket.platform);
  const PIcon = pc ? platformIconMap[pc.icon] : null;

  const filtered = useMemo(() => {
    return mockTicketAccounts.filter(a => {
      if (platformFilter !== 'all' && a.platform !== platformFilter) return false;
      if (searchText && !a.name.includes(searchText) && !a.phone.includes(searchText)) return false;
      if (onlineFilter !== 'all' && a.onlineStatus !== onlineFilter) return false;
      return true;
    });
  }, [platformFilter, searchText, onlineFilter]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 顶部标题栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#FF6B35] transition-colors">
            <ChevronLeft className="w-4 h-4" />
            全部工单
          </button>
          <span className="text-gray-300">|</span>
          <h2 className="text-sm font-semibold text-gray-900">
            工单详情-{ticket.activationCode}
            {ticket.activationRemark && <span className="text-gray-500 font-normal ml-1">({ticket.activationRemark})</span>}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={refreshInterval}
            onChange={e => setRefreshInterval(e.target.value)}
            className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-600 focus:outline-none"
          >
            {['每1分钟','每5分钟','每10分钟'].map(v => <option key={v}>{v}</option>)}
          </select>
          <span className="text-xs text-gray-500">自动刷新数据</span>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors", autoRefresh ? "bg-[#FF6B35]" : "bg-gray-200")}
          >
            <span className={cn("inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform", autoRefresh ? "translate-x-4.5" : "translate-x-0.5")} />
          </button>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <span className="text-xs text-gray-500">上单平台</span>
        <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1 bg-white">
          {pc && PIcon && (
            <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: pc.color }}>
              <PIcon className="w-2.5 h-2.5 text-white" />
            </div>
          )}
          <span className="text-xs text-gray-700 ml-1">{pc?.name || ticket.platform}</span>
          <ChevronDown className="w-3 h-3 text-gray-400 ml-1" />
        </div>
        <span className="text-xs text-gray-500">昵称</span>
        <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600 focus:outline-none">
          <option>昵称</option>
        </select>
        <input
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder="请输入"
          className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 w-32 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
        />
        <span className="text-xs text-gray-500">在线状态</span>
        <select
          value={onlineFilter}
          onChange={e => setOnlineFilter(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600 focus:outline-none"
        >
          <option value="all">全部</option>
          <option value="online">在线</option>
          <option value="offline">离线</option>
        </select>
        <button className="px-4 py-1.5 text-xs bg-[#FF6B35] text-white rounded-lg hover:bg-[#ff5722] transition-colors">查询</button>
        <button onClick={() => { setPlatformFilter('all'); setSearchText(''); setOnlineFilter('all'); }} className="px-4 py-1.5 text-xs border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">重置</button>
      </div>

      {/* 操作栏 */}
      <div className="bg-white border-b border-gray-100 px-6 py-2.5 flex items-center gap-2 flex-shrink-0">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Settings className="w-3.5 h-3.5" />智能排序
          <ChevronDown className="w-3 h-3" />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          <ClipboardList className="w-3.5 h-3.5" />工单操作日志
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          <Download className="w-3.5 h-3.5" />导出线索
          <ChevronDown className="w-3 h-3" />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#FF6B35] border border-[#FF6B35]/30 bg-[#FFF0E8] rounded-lg hover:bg-[#FFE0D0]">
          <Search className="w-3.5 h-3.5" />查看全部线索
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-[#FF6B35] rounded-lg hover:bg-[#ff5722]">
          <GitBranch className="w-3.5 h-3.5" />分享工单
          <ChevronDown className="w-3 h-3" />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-green-500 rounded-lg hover:bg-green-600">
          <Plus className="w-3.5 h-3.5" />新建分流链接
        </button>
      </div>

      {/* 统计提示栏 */}
      <div className="bg-[#fffbe6] border-b border-yellow-100 px-6 py-2 flex items-center gap-6 flex-shrink-0 text-xs text-gray-600">
        <span>A 工单重置后新增线索总数(已去重): <span className="font-medium">0</span></span>
        <span>B 当日置零后新增线索总数(已去重): <span className="font-medium">0</span></span>
        <span>C 当日置零后被移除主号线索总数(已去重): <span className="font-medium">0</span></span>
        <span>D 置零后清零手工的有效线索(已去重): <span className="font-medium">0</span></span>
        <span>E 工单重置后被移除主号线索总数(已去重): <span className="font-medium">0</span></span>
        <span className="ml-auto text-gray-400">注: 本工单建议在置零时间 (00:00) 前导出清单，双方确认售后数量，按 B+C 进行日结，如果超过了当天置零时间，则需要导出清单进行统计。</span>
      </div>

      {/* 表格 */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-3 w-8">
                <input type="checkbox" checked={filtered.length > 0 && selectedIds.size === filtered.length}
                  onChange={() => setSelectedIds(selectedIds.size === filtered.length ? new Set() : new Set(filtered.map(a => a.id)))}
                  className="w-3.5 h-3.5 rounded border-gray-300 accent-[#FF6B35]" />
              </th>
              <th className="py-3 px-3 w-6"></th>
              <th className="text-left py-3 px-3 font-medium text-gray-500 whitespace-nowrap">账号信息</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500 whitespace-nowrap">账号备注</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500 whitespace-nowrap">在线状态 ↕</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500 whitespace-nowrap">注释</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500 whitespace-nowrap">今日目标</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500 whitespace-nowrap">总目标</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500 whitespace-nowrap">加粉链接</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500 whitespace-nowrap">二维码</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500 whitespace-nowrap">最后活跃时间</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500 whitespace-nowrap">本次登录时间</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500 whitespace-nowrap">客户端版本号</th>
              <th className="text-left py-3 px-3 font-medium text-gray-500 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(account => (
              <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                <td className="py-3 px-3">
                  <input type="checkbox" checked={selectedIds.has(account.id)} onChange={() => toggleSelect(account.id)}
                    className="w-3.5 h-3.5 rounded border-gray-300 accent-[#FF6B35]" />
                </td>
                <td className="py-3 px-3">
                  <span className="text-gray-300 cursor-grab">⠿</span>
                </td>
                {/* 账号信息 */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                      {account.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 text-xs">{account.name}</div>
                      <div className="text-gray-400 flex items-center gap-1 text-xs">
                        <Smartphone className="w-3 h-3" />{account.phone}
                      </div>
                    </div>
                  </div>
                </td>
                {/* 账号备注 */}
                <td className="py-3 px-3 text-xs text-gray-400">{account.remark || '–'}</td>
                {/* 在线状态 */}
                <td className="py-3 px-3">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded text-xs font-medium border",
                    account.onlineStatus === 'online'
                      ? "bg-green-50 text-green-600 border-green-200"
                      : "bg-gray-50 text-gray-500 border-gray-200"
                  )}>
                    {account.onlineStatus === 'online' ? '在线' : '离线'}
                  </span>
                </td>
                {/* 注释 */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">{account.note || '-'}</span>
                    <button className="text-gray-300 hover:text-[#FF6B35]"><Pencil className="w-3 h-3" /></button>
                  </div>
                </td>
                {/* 今日目标 */}
                <td className="py-3 px-3 text-xs text-gray-700 text-center">{account.targetToday}</td>
                {/* 总目标 */}
                <td className="py-3 px-3 text-xs text-gray-700 text-center">{account.targetTotal}</td>
                {/* 加粉链接 */}
                <td className="py-3 px-3">
                  {account.addLink
                    ? <a href="#" className="text-xs text-[#FF6B35] hover:underline break-all max-w-[120px] block">{account.addLink}</a>
                    : <span className="text-gray-300 text-xs">–</span>}
                </td>
                {/* 二维码 */}
                <td className="py-3 px-3">
                  {account.qrCode
                    ? <button className="text-xs text-[#FF6B35] hover:underline">查看</button>
                    : <span className="text-gray-300 text-xs">–</span>}
                </td>
                {/* 最后活跃时间 */}
                <td className="py-3 px-3 text-xs text-gray-500 whitespace-nowrap">{account.lastActiveAt}</td>
                {/* 本次登录时间 */}
                <td className="py-3 px-3 text-xs text-gray-500 whitespace-nowrap">{account.currentLoginAt}</td>
                {/* 客户端版本号 */}
                <td className="py-3 px-3 text-xs text-gray-500">{account.clientVersion}</td>
                {/* 操作 */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <button className="text-xs text-[#FF6B35] hover:underline whitespace-nowrap">查看线索</button>
                    <button className="text-xs text-[#FF6B35] hover:underline whitespace-nowrap">登录日志</button>
                  </div>
                </td>
              </tr>
            ))}
            {/* 总计行 */}
            <tr className="bg-gray-50 border-t border-gray-200 font-medium text-gray-600 text-xs">
              <td colSpan={6} className="py-2.5 px-3">总计</td>
              <td className="py-2.5 px-3 text-center">{filtered.reduce((s, a) => s + a.targetToday, 0)}</td>
              <td className="py-2.5 px-3 text-center">{filtered.reduce((s, a) => s + a.targetTotal, 0)}</td>
              <td colSpan={6}></td>
            </tr>
          </tbody>
        </table>

        {/* 分页 */}
        <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-gray-100 text-xs text-gray-500">
          <span>共 {filtered.length} 条</span>
          <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50">‹</button>
          <button className="w-6 h-6 flex items-center justify-center rounded bg-[#FF6B35] text-white">1</button>
          <button className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50">›</button>
          <select className="border border-gray-200 rounded px-2 py-0.5 bg-white focus:outline-none">
            <option>10 条/页</option>
            <option>20 条/页</option>
            <option>50 条/页</option>
          </select>
          <span>前往</span>
        </div>
      </div>
    </div>
  );
};

// 工单列表视图（原 AdminTicketListPage 内容）
const TicketListView: React.FC<{ onViewDetail: (t: PlatformTicket) => void }> = ({ onViewDetail }) => {
  const activationCodes = useStore((s) => s.activationCodes);
  const departments = useStore((s) => s.departments);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [codeFilter, setCodeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<PlatformTicketStatus | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = mockPlatformTickets;
    if (selectedDeptId) {
      result = result.filter(t => t.groupId === selectedDeptId);
    }
    if (platformFilter !== 'all') {
      result = result.filter(t => t.platform === platformFilter);
    }
    if (codeFilter !== 'all') {
      result = result.filter(t => t.activationCode === codeFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }
    return result;
  }, [selectedDeptId, platformFilter, codeFilter, statusFilter]);

  const totalOnline = filtered.reduce((s, t) => s + t.onlineConversations, 0);
  const totalConv = filtered.reduce((s, t) => s + t.totalConversations, 0);
  const totalCompleted = filtered.reduce((s, t) => s + t.completedConversations, 0);
  const totalTarget = filtered.reduce((s, t) => s + t.totalTarget, 0);
  const totalTodayNewLeads = filtered.reduce((s, t) => s + t.todayNewLeads, 0);
  const totalTodayRepeat = filtered.reduce((s, t) => s + t.todayRepeatLeads, 0);
  const totalRepeat = filtered.reduce((s, t) => s + t.totalRepeatLeads, 0);
  const totalTodayRemoved = filtered.reduce((s, t) => s + t.todayRemovedLeads, 0);
  const totalRemoved = filtered.reduce((s, t) => s + t.totalRemovedLeads, 0);

  // 从 store 的激活码列表取值，而非工单数据
  const allCodes = useMemo(() => {
    return activationCodes.map(ac => ({
      code: ac.code,
      remark: ac.remark || ac.assignedTo || '',
    }));
  }, [activationCodes]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(t => t.id)));
    }
  };

  const handleReset = () => {
    setPlatformFilter('all');
    setCodeFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="h-full flex flex-col">
      {/* 提示栏 */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
        <p className="text-xs text-gray-400">
          工单默认置零时间为每日凌晨的0点0分(UTC+8), 您也可以在 '更多' - '工单置零' 操作中设置置零时间
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50">批量操作</button>
          <button className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50">导出数据</button>
          <button className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50">分享记录</button>
        </div>
      </div>

      {/* 筛选栏 */}
      <TicketFilterBar
        platformFilter={platformFilter}
        onPlatformChange={setPlatformFilter}
        codeFilter={codeFilter}
        onCodeChange={setCodeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        allCodes={allCodes}
        onReset={handleReset}
      />

      {/* 主体：左侧部门树 + 右侧表格 */}
      <div className="flex-1 flex min-h-0">
        <div className="w-56 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#FF6B35]" />
              部门结构
            </h4>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {departments.map(dept => (
              <TicketDeptNode
                key={dept.id}
                dept={dept}
                level={0}
                selectedId={selectedDeptId}
                onSelect={setSelectedDeptId}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <TicketDataTable
            tickets={filtered}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleAll={toggleAll}
            onViewDetail={onViewDetail}
            totalOnline={totalOnline}
            totalConv={totalConv}
            totalCompleted={totalCompleted}
            totalTarget={totalTarget}
            totalTodayNewLeads={totalTodayNewLeads}
            totalTodayRepeat={totalTodayRepeat}
            totalRepeat={totalRepeat}
            totalTodayRemoved={totalTodayRemoved}
            totalRemoved={totalRemoved}
          />
        </div>
      </div>
    </div>
  );
};

// 工单筛选栏
const TicketFilterBar: React.FC<{
  platformFilter: string;
  onPlatformChange: (v: string) => void;
  codeFilter: string;
  onCodeChange: (v: string) => void;
  statusFilter: PlatformTicketStatus | 'all';
  onStatusChange: (v: PlatformTicketStatus | 'all') => void;
  allCodes: { code: string; remark: string }[];
  onReset: () => void;
}> = ({ platformFilter, onPlatformChange, codeFilter, onCodeChange, statusFilter, onStatusChange, allCodes, onReset }) => {
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [showCodeDropdown, setShowCodeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const getPlatformLabel = () => {
    if (platformFilter === 'all') return '全部';
    const p = platformConfigs.find(pc => pc.id === platformFilter);
    return p ? p.name : '全部';
  };

  const getCodeLabel = () => {
    if (codeFilter === 'all') return '全部';
    const c = allCodes.find(ac => ac.code === codeFilter);
    return c ? `${c.code}(${c.remark})` : '全部';
  };

  const getStatusLabel = () => {
    const statusMap = { all: '全部', normal: '正常', disabled: '禁用' };
    return statusMap[statusFilter] || '全部';
  };

  return (
    <div className="px-6 py-3 flex items-center gap-4 border-b border-gray-100 flex-shrink-0 bg-white">
      <div className="flex items-center gap-2 relative">
        <span className="text-xs text-gray-500 whitespace-nowrap">工单平台</span>
        <button
          onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] min-w-[140px] text-left flex items-center justify-between hover:border-[#FF6B35] transition-colors"
        >
          <span className="text-gray-700">{getPlatformLabel()}</span>
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showPlatformDropdown && (
          <div className="absolute z-50 mt-1 top-full left-20 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto min-w-[140px]">
            <div onClick={() => { onPlatformChange('all'); setShowPlatformDropdown(false); }} className="px-3 py-2 text-sm text-[#666] hover:bg-[#FFF7F3] cursor-pointer">全部</div>
            {platformConfigs.map(p => (
              <div key={p.id} onClick={() => { onPlatformChange(p.id); setShowPlatformDropdown(false); }} className={`px-3 py-2 text-sm cursor-pointer transition-colors ${platformFilter === p.id ? 'bg-[#FF6B35] text-white' : 'text-[#666] hover:bg-[#FFF7F3]'}`}>{p.name}</div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 relative">
        <span className="text-xs text-gray-500 whitespace-nowrap">激活码(备注)</span>
        <button
          onClick={() => setShowCodeDropdown(!showCodeDropdown)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] min-w-[140px] text-left flex items-center justify-between hover:border-[#FF6B35] transition-colors"
        >
          <span className="text-gray-700">{getCodeLabel()}</span>
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showCodeDropdown && (
          <div className="absolute z-50 mt-1 top-full left-28 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto min-w-[200px]">
            <div onClick={() => { onCodeChange('all'); setShowCodeDropdown(false); }} className="px-3 py-2 text-sm text-[#666] hover:bg-[#FFF7F3] cursor-pointer">全部</div>
            {allCodes.map(c => (
              <div key={c.code} onClick={() => { onCodeChange(c.code); setShowCodeDropdown(false); }} className={`px-3 py-2 text-sm cursor-pointer transition-colors ${codeFilter === c.code ? 'bg-[#FF6B35] text-white' : 'text-[#666] hover:bg-[#FFF7F3]'}`}>{c.code}({c.remark})</div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 relative">
        <span className="text-xs text-gray-500 whitespace-nowrap">工单状态</span>
        <button
          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] min-w-[100px] text-left flex items-center justify-between hover:border-[#FF6B35] transition-colors"
        >
          <span className="text-gray-700">{getStatusLabel()}</span>
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showStatusDropdown && (
          <div className="absolute z-50 mt-1 top-full left-20 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[100px]">
            {[{ value: 'all', label: '全部' }, { value: 'normal', label: '正常' }, { value: 'disabled', label: '禁用' }].map(s => (
              <div key={s.value} onClick={() => { onStatusChange(s.value as any); setShowStatusDropdown(false); }} className={`px-3 py-2 text-sm cursor-pointer transition-colors ${statusFilter === s.value ? 'bg-[#FF6B35] text-white' : 'text-[#666] hover:bg-[#FFF7F3]'}`}>{s.label}</div>
            ))}
          </div>
        )}
      </div>
      <button onClick={() => {}} className="px-4 py-1.5 text-sm font-medium text-white bg-[#FF6B35] rounded-md hover:bg-[#E85A2A] transition-colors">查询</button>
      <button onClick={onReset} className="px-4 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">重置</button>
    </div>
  );
};

// 工单分组侧边栏
// 工单页部门树节点
const TicketDeptNode: React.FC<{
  dept: Department;
  level: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}> = ({ dept, level, selectedId, onSelect }) => {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = dept.children && dept.children.length > 0;
  const isSelected = selectedId === dept.id;
  return (
    <div>
      <button
        onClick={() => onSelect(isSelected ? null : dept.id)}
        className={cn(
          "w-full flex items-center gap-1.5 py-2 px-2 rounded-lg text-sm transition-colors",
          isSelected ? "bg-[#FF6B35]/10 text-[#FF6B35] font-medium" : "text-gray-700 hover:bg-gray-100"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <span onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} className="p-0.5 rounded hover:bg-gray-200 flex-shrink-0 cursor-pointer">
            {expanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </span>
        ) : <span className="w-4.5 flex-shrink-0" />}
        <FolderTree className={cn("w-4 h-4 flex-shrink-0", isSelected ? "text-[#FF6B35]" : "text-gray-400")} />
        <span className="truncate flex-1 text-left">{dept.name}</span>
        <span className={cn("text-xs px-1.5 py-0.5 rounded-full flex-shrink-0", isSelected ? "bg-[#FF6B35]/20 text-[#FF6B35]" : "bg-gray-100 text-gray-500")}>
          {dept.memberCount}
        </span>
      </button>
      {hasChildren && expanded && dept.children!.map(child => (
        <TicketDeptNode key={child.id} dept={child} level={level + 1} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
};

// 工单数据表格
const TicketDataTable: React.FC<{
  tickets: PlatformTicket[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onViewDetail: (t: PlatformTicket) => void;
  totalOnline: number;
  totalConv: number;
  totalCompleted: number;
  totalTarget: number;
  totalTodayNewLeads: number;
  totalTodayRepeat: number;
  totalRepeat: number;
  totalTodayRemoved: number;
  totalRemoved: number;
}> = ({ tickets, selectedIds, onToggleSelect, onToggleAll, onViewDetail, totalOnline, totalConv, totalCompleted, totalTarget, totalTodayNewLeads, totalTodayRepeat, totalRepeat, totalTodayRemoved, totalRemoved }) => (
  <div className="flex-1 overflow-auto">
    <table className="w-full">
      <thead className="sticky top-0 z-10">
        <tr className="border-b border-gray-200 bg-gray-50">
          <th className="py-3 px-4 w-10">
            <input
              type="checkbox"
              checked={tickets.length > 0 && selectedIds.size === tickets.length}
              onChange={onToggleAll}
              className="w-3.5 h-3.5 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]/30"
            />
          </th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">工单号</th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">工单平台</th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">激活码(备注)</th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">工单状态</th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">在线会话/总会话</th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">已完成/总目标</th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">当日新增线索</th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">今日重复线索</th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">累计重复线索</th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">当日移除主号新增线索</th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">累计移除主号新增线索</th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">当日置零时间</th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">工单重置时间</th>
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">操作</th>
        </tr>
      </thead>
      <TicketTableRows tickets={tickets} selectedIds={selectedIds} onToggleSelect={onToggleSelect} onViewDetail={onViewDetail} />
    </table>

    {/* 总计行 */}
    {tickets.length > 0 && (
      <div className="border-t border-gray-200 bg-gray-50/50 px-4 py-3 grid grid-cols-[2.5rem_1fr_80px_100px_100px_90px_90px_90px_130px_130px_100px_100px_80px] gap-0 text-sm text-gray-700">
        <span />
        <span className="px-4 text-gray-500">总计</span>
        <span className="px-4" />
        <span className="px-4">{totalOnline}/{totalConv}</span>
        <span className="px-4">{totalCompleted}/{totalTarget}</span>
        <span className="px-4 text-green-600">{totalTodayNewLeads}</span>
        <span className="px-4 text-green-600">{totalTodayRepeat}</span>
        <span className="px-4 text-green-600">{totalRepeat}</span>
        <span className="px-4">{totalTodayRemoved}</span>
        <span className="px-4">{totalRemoved}</span>
        <span className="px-4" />
        <span className="px-4" />
        <span className="px-4" />
      </div>
    )}

    {tickets.length === 0 && (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <ClipboardList className="w-10 h-10 mb-3 text-gray-300" />
        <p className="text-sm">暂无工单数据</p>
        <p className="text-xs mt-1">请调整筛选条件</p>
      </div>
    )}
  </div>
);

// 工单表格行
const TicketTableRows: React.FC<{
  tickets: PlatformTicket[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onViewDetail: (t: PlatformTicket) => void;
}> = ({ tickets, selectedIds, onToggleSelect, onViewDetail }) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const menuItems = [
    { label: '编辑工单' },
    { label: '分享工单' },
    { label: '分享记录' },
    { label: '工单置零' },
    { label: '重置工单', danger: true },
  ];

  return (
  <tbody>
    {tickets.map((ticket) => {
      const pc = platformConfigs.find(p => p.id === ticket.platform);
      const PIcon = pc ? platformIconMap[pc.icon] : null;
      const sc = ticketStatusConfig[ticket.status];
      return (
        <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
          <td className="py-3 px-4 w-10">
            <input
              type="checkbox"
              checked={selectedIds.has(ticket.id)}
              onChange={() => onToggleSelect(ticket.id)}
              className="w-3.5 h-3.5 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]/30"
            />
          </td>
          <td className="py-3 px-4">
            <span className="text-sm text-gray-700 font-mono">{ticket.ticketNo}</span>
          </td>
          <td className="py-3 px-4">
            {pc && PIcon && (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: pc.color }}>
                  <PIcon className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-gray-700">{pc.name}</span>
              </div>
            )}
          </td>
          <td className="py-3 px-4">
            <div className="flex items-center gap-1">
              <span className="text-sm text-[#FF6B35] cursor-pointer hover:underline">
                {ticket.activationCode}
              </span>
              {ticket.activationRemark && (
                <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap">{ticket.activationRemark}</span>
              )}
            </div>
          </td>
          <td className="py-3 px-4">
            <span className={cn("px-2 py-0.5 text-xs font-medium rounded border", sc.cls)}>
              {sc.label}
            </span>
          </td>
          <td className="py-3 px-4 text-sm text-gray-700">
            {ticket.onlineConversations}/{ticket.totalConversations}
          </td>
          <td className="py-3 px-4 text-sm text-gray-700">
            {ticket.completedConversations}/{ticket.totalTarget}
          </td>
          <td className="py-3 px-4 text-sm text-green-600 font-medium">
            {ticket.todayNewLeads}
          </td>
          <td className="py-3 px-4 text-sm text-green-600 font-medium">
            {ticket.todayRepeatLeads}
          </td>
          <td className="py-3 px-4 text-sm text-green-600 font-medium">
            {ticket.totalRepeatLeads}
          </td>
          <td className="py-3 px-4 text-sm text-gray-700">
            {ticket.todayRemovedLeads}
          </td>
          <td className="py-3 px-4 text-sm text-gray-700">
            {ticket.totalRemovedLeads}
          </td>
          <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
            <span>{ticket.dailyResetTime}</span>
            <button className="ml-1 text-gray-400 hover:text-[#FF6B35]">
              <Pencil className="w-3 h-3 inline" />
            </button>
          </td>
          <td className="py-3 px-4 text-sm text-gray-400 whitespace-nowrap">
            {ticket.ticketResetTime || '-'}
          </td>
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              <button onClick={() => onViewDetail(ticket)} className="text-xs text-[#FF6B35] hover:underline whitespace-nowrap">工单详情</button>
              <div className="relative">
                <button
                  onClick={() => setOpenMenuId(openMenuId === ticket.id ? null : ticket.id)}
                  className="text-xs text-[#FF6B35] hover:underline whitespace-nowrap flex items-center gap-0.5"
                >
                  更多
                  <ChevronDown className="w-3 h-3" />
                </button>
                {openMenuId === ticket.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                    <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                      {menuItems.map(item => (
                        <button
                          key={item.label}
                          onClick={() => setOpenMenuId(null)}
                          className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors ${item.danger ? 'text-red-500' : 'text-gray-700'}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </td>
        </tr>
      );
    })}
  </tbody>
  );
};

// ============ 内控报表页面 ============
// 排行榜 mock 数据
const mockRankingData = [
  { name: '销售主力(SA01)', conversations: 156, messages: 1842, initiated: 89, customers: 67 },
  { name: '李四(SA02)', conversations: 132, messages: 1567, initiated: 72, customers: 58 },
  { name: 'David(SO01)', conversations: 98, messages: 1203, initiated: 45, customers: 42 },
  { name: 'Emily(SO02)', conversations: 87, messages: 956, initiated: 38, customers: 35 },
  { name: '运营主管(OP01)', conversations: 64, messages: 723, initiated: 28, customers: 24 },
];

const AdminAuditReportPage: React.FC = () => {
  const [rankTab, setRankTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const rankTabs: { value: 'daily' | 'weekly' | 'monthly'; label: string }[] = [
    { value: 'daily', label: '日报' },
    { value: 'weekly', label: '周报' },
    { value: 'monthly', label: '月报' },
  ];

  // 排行榜条形图最大值
  const maxConv = Math.max(...mockRankingData.map(r => r.conversations));
  const maxMsg = Math.max(...mockRankingData.map(r => r.messages));
  const maxInit = Math.max(...mockRankingData.map(r => r.initiated));
  const maxCust = Math.max(...mockRankingData.map(r => r.customers));

  return (
    <div className="h-full flex flex-col overflow-auto">
      <div className="p-6 space-y-5">
        {/* 第一行：社交账号在线总数 + 对话总数 + 回复效率看板 */}
        <div className="grid grid-cols-3 gap-4">
          {/* 社交账号在线总数 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">社交账号在线总数</h3>
              <span className="text-[11px] text-gray-400">实时</span>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-bold text-[#FF6B35]">5</p>
              <span className="text-sm text-gray-400 mb-1">/ 8 个账号</span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                <span className="text-xs text-gray-500">在线 5</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-300" />
                <span className="text-xs text-gray-500">离线 3</span>
              </div>
            </div>
          </div>

          {/* 对话总数 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">对话总数</h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400">今日</span>
                <button className="text-[11px] text-[#FF6B35] hover:text-[#e55a2b] font-medium transition-colors">查看明细</button>
              </div>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-bold text-gray-900">537</p>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs text-[#FF6B35]">+12.5%</span>
                <span className="text-[10px] text-gray-400">较昨日</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div>
                <p className="text-lg font-semibold text-gray-900">328</p>
                <span className="text-[11px] text-gray-400">客户发起</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">142</p>
                <span className="text-[11px] text-gray-400">主动发起</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">67</p>
                <span className="text-[11px] text-gray-400">AI发起</span>
              </div>
            </div>
          </div>

          {/* 回复效率看板 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">回复效率看板</h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400">今日</span>
                <button className="text-[11px] text-[#FF6B35] hover:text-[#e55a2b] font-medium transition-colors">查看明细</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">2.3<span className="text-sm font-normal text-gray-400 ml-0.5">min</span></p>
                <span className="text-[11px] text-gray-400">平均首次响应</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4.8<span className="text-sm font-normal text-gray-400 ml-0.5">min</span></p>
                <span className="text-[11px] text-gray-400">平均回复时长</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FF6B35]">96.2<span className="text-sm font-normal text-[#FF6B35] ml-0.5">%</span></p>
                <span className="text-[11px] text-gray-400">回复率</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">8.5</p>
                <span className="text-[11px] text-gray-400">平均对话轮次</span>
              </div>
            </div>
          </div>
        </div>

        {/* 第二行：超时未回复次数 + 合规统计看板 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 超时未回复次数 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">超时未回复次数</h3>
              <span className="text-[11px] text-gray-400">今日</span>
            </div>
            <div className="flex items-end gap-3 mb-4">
              <p className="text-3xl font-bold text-[#FF6B35]">12</p>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs text-[#FF6B35]">+3</span>
                <span className="text-[10px] text-gray-400">较昨日</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { name: '销售主力(SA01)', count: 5 },
                { name: '李四(SA02)', count: 4 },
                { name: 'Emily(SO02)', count: 2 },
                { name: 'David(SO01)', count: 1 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-28 truncate">{item.name}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all bg-[#FF6B35]"
                      style={{ width: `${(item.count / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-6 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 合规统计看板 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">合规统计看板</h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400">本周</span>
                <button className="text-[11px] text-[#FF6B35] hover:text-[#e55a2b] font-medium transition-colors">查看明细</button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-[#FFF7F3] rounded-lg">
                <p className="text-xl font-bold text-[#FF6B35]">3</p>
                <span className="text-[11px] text-[#FF6B35]">敏感词触发</span>
              </div>
              <div className="text-center p-3 bg-[#F7F8FA] rounded-lg">
                <p className="text-xl font-bold text-[#666]">7</p>
                <span className="text-[11px] text-[#666]">删除消息</span>
              </div>
              <div className="text-center p-3 bg-[#F7F8FA] rounded-lg">
                <p className="text-xl font-bold text-[#666]">2</p>
                <span className="text-[11px] text-[#666]">删除联系人</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-[#F7F8FA] rounded-lg">
                <p className="text-xl font-bold text-[#1A1A1A]">4</p>
                <span className="text-[11px] text-[#666]">发送名片</span>
              </div>
              <div className="text-center p-3 bg-[#F7F8FA] rounded-lg">
                <p className="text-xl font-bold text-[#1A1A1A]">5</p>
                <span className="text-[11px] text-[#666]">发送文件</span>
              </div>
              <div className="text-center p-3 bg-[#F7F8FA] rounded-lg">
                <p className="text-xl font-bold text-[#1A1A1A]">1</p>
                <span className="text-[11px] text-[#666]">异常登录</span>
              </div>
            </div>
          </div>
        </div>

        {/* 第三行：排行榜 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">数据排行</h3>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              {rankTabs.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setRankTab(tab.value)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                    rankTab === tab.value
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 divide-x divide-gray-100">
            {/* 对话总数排行 */}
            <div className="p-4">
              <h4 className="text-xs font-medium text-gray-500 mb-3">对话总数排行</h4>
              <div className="space-y-2.5">
                {mockRankingData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                      i === 0 ? "bg-[#FF6B35] text-white" :
                      i === 1 ? "bg-[#FFB088] text-white" :
                      i === 2 ? "bg-[#FFD4BE] text-[#FF6B35]" :
                      "bg-gray-100 text-gray-400"
                    )}>{i + 1}</span>
                    <span className="text-xs text-gray-700 truncate flex-1">{item.name}</span>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                      <div className="h-full bg-[#FF6B35] rounded-full" style={{ width: `${(item.conversations / maxConv) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-8 text-right flex-shrink-0">{item.conversations}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 消息总数排行 */}
            <div className="p-4">
              <h4 className="text-xs font-medium text-gray-500 mb-3">消息总数排行榜</h4>
              <div className="space-y-2.5">
                {mockRankingData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                      i === 0 ? "bg-[#1A1A1A] text-white" :
                      i === 1 ? "bg-[#666] text-white" :
                      i === 2 ? "bg-[#999] text-white" :
                      "bg-gray-100 text-gray-400"
                    )}>{i + 1}</span>
                    <span className="text-xs text-gray-700 truncate flex-1">{item.name}</span>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                      <div className="h-full bg-[#1A1A1A] rounded-full" style={{ width: `${(item.messages / maxMsg) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-10 text-right flex-shrink-0">{item.messages}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 主动发起对话数排行 */}
            <div className="p-4">
              <h4 className="text-xs font-medium text-gray-500 mb-3">主动发起对话数排行</h4>
              <div className="space-y-2.5">
                {mockRankingData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                      i === 0 ? "bg-[#FF6B35] text-white" :
                      i === 1 ? "bg-[#FFB088] text-white" :
                      i === 2 ? "bg-[#FFD4BE] text-[#FF6B35]" :
                      "bg-gray-100 text-gray-400"
                    )}>{i + 1}</span>
                    <span className="text-xs text-gray-700 truncate flex-1">{item.name}</span>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                      <div className="h-full bg-[#FF6B35] rounded-full" style={{ width: `${(item.initiated / maxInit) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-8 text-right flex-shrink-0">{item.initiated}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 接待客户数排行 */}
            <div className="p-4">
              <h4 className="text-xs font-medium text-gray-500 mb-3">接待客户数排行</h4>
              <div className="space-y-2.5">
                {mockRankingData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                      i === 0 ? "bg-[#1A1A1A] text-white" :
                      i === 1 ? "bg-[#666] text-white" :
                      i === 2 ? "bg-[#999] text-white" :
                      "bg-gray-100 text-gray-400"
                    )}>{i + 1}</span>
                    <span className="text-xs text-gray-700 truncate flex-1">{item.name}</span>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                      <div className="h-full bg-[#1A1A1A] rounded-full" style={{ width: `${(item.customers / maxCust) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-8 text-right flex-shrink-0">{item.customers}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
