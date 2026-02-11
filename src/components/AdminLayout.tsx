import React, { useState, useMemo } from 'react';
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
  Globe,
  Zap,
  BookOpen,
  Tags,
  Filter,
  Plus,
  MapPin,
  Phone,
  UserCircle,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { platformConfigs } from '@/data/mockData';
import { AdminCenter } from './AdminCenter';
import { AdminChatView } from './AdminChatView';
import { AILabelsPage } from './AILabelsPage';
import { KnowledgeBasePage } from './KnowledgeBasePage';
import type { ActivationCode } from '@/types';

type AdminSection = 'activation-codes' | 'org-settings' | 'members' | 'security' | 'statistics' | 'settings' | 'audit' | 'ai-settings' | 'ai-config' | 'ai-knowledge' | 'ai-scripts' | 'ai-labels' | 'customer-list' | 'ticket-list';

interface AdminLayoutProps {
  onBack?: () => void;
  children?: React.ReactNode;
}

const menuItems: { id: AdminSection; name: string; icon: React.ComponentType<{ className?: string }>; }[] = [
  { id: 'activation-codes', name: '激活码管理', icon: Key },
  { id: 'statistics', name: '数据统计', icon: BarChart3 },
  { id: 'security', name: '安全设置', icon: Shield },
  { id: 'settings', name: '系统设置', icon: Settings },
];

// 内控管理子菜单
const auditSubMenuItems: { id: AdminSection; name: string; icon: React.ComponentType<{ className?: string }>; }[] = [
  { id: 'audit', name: '聊天记录', icon: Eye },
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
  { id: 'members', name: '成员管理', icon: Users },
  { id: 'org-settings', name: '组织设置', icon: Building2 },
];

// AI配置子菜单
const aiSubMenuItems: { id: AdminSection; name: string; icon: React.ComponentType<{ className?: string }>; }[] = [
  { id: 'ai-config', name: 'AI员工设置', icon: Sparkles },
  { id: 'ai-settings', name: 'AI功能使用情况', icon: Bot },
  { id: 'ai-knowledge', name: '知识库配置', icon: BookOpen },
  { id: 'ai-scripts', name: '话术库配置', icon: MessageSquare },
  { id: 'ai-labels', name: 'AI标签配置', icon: Tags },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('activation-codes');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiMenuExpanded, setAiMenuExpanded] = useState(false);
  const [auditMenuExpanded, setAuditMenuExpanded] = useState(false);
  const [customerMenuExpanded, setCustomerMenuExpanded] = useState(false);
  const [ticketMenuExpanded, setTicketMenuExpanded] = useState(false);
  const [orgMenuExpanded, setOrgMenuExpanded] = useState(false);
  const isAiSection = activeSection === 'ai-config' || activeSection === 'ai-settings' || activeSection === 'ai-knowledge' || activeSection === 'ai-scripts' || activeSection === 'ai-labels';
  const isAuditSection = activeSection === 'audit';
  const isCustomerSection = activeSection === 'customer-list';
  const isTicketSection = activeSection === 'ticket-list';
  const isOrgSection = activeSection === 'members' || activeSection === 'org-settings';
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
              {menuItems.find(m => m.id === activeSection)?.name || aiSubMenuItems.find(m => m.id === activeSection)?.name || auditSubMenuItems.find(m => m.id === activeSection)?.name || customerSubMenuItems.find(m => m.id === activeSection)?.name || ticketSubMenuItems.find(m => m.id === activeSection)?.name || orgSubMenuItems.find(m => m.id === activeSection)?.name}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">{organization.name}</p>
          </div>
        </header>

        {/* 页面内容 */}
        <div className="flex-1 overflow-auto">
          <AdminContent section={activeSection} onViewChat={handleViewChat} auditCode={auditCode} onClearAuditCode={() => setAuditCode(null)} onNavigateToKnowledge={() => setActiveSection('ai-knowledge')} onNavigateToScripts={() => setActiveSection('ai-scripts')} onNavigateToLabels={() => setActiveSection('ai-labels')} />
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
  onNavigateToKnowledge: () => void;
  onNavigateToScripts: () => void;
  onNavigateToLabels: () => void;
}> = ({ section, onViewChat, auditCode, onClearAuditCode, onNavigateToKnowledge, onNavigateToScripts, onNavigateToLabels }) => {
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
    case 'ai-settings':
      return <AISettingsPage />;
    case 'ai-config':
      return <AIConfigPage onNavigateToKnowledge={onNavigateToKnowledge} onNavigateToScripts={onNavigateToScripts} onNavigateToLabels={onNavigateToLabels} />;
    case 'ai-knowledge':
      return <KnowledgeBasePage />;
    case 'ai-scripts':
      return (
        <PlaceholderPage
          icon={MessageSquare}
          title="话术库配置"
          description="管理AI员工的营销话术和回复模板"
        />
      );
    case 'ai-labels':
      return <AILabelsPage />;
    case 'customer-list':
      return <AdminCustomerListPage />;
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
const platformIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageCircle, Send, MessageSquare, Instagram, Facebook, Mail, Smartphone, Music, Twitter, ShoppingBag,
};

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

// AI配置页面 - AI员工配置（人设模板数据）
const personaTemplates = [
  {
    id: 'sales' as const,
    icon: '🦁',
    name: '金牌销售型',
    description: '主动、热情，擅长挖掘需求与促单，使用更有感染力的语言。',
    tags: ['高转化', '主动引导'],
  },
  {
    id: 'support' as const,
    icon: '🐬',
    name: '贴心客服型',
    description: '温和、耐心，注重解决用户疑惑与情绪安抚，回复速度快。',
    tags: ['高满意度', '情绪识别'],
  },
  {
    id: 'brand' as const,
    icon: '🦊',
    name: '品牌专家型',
    description: '严谨、高端，主要用于品牌形象塑造与专业问题解答。',
    tags: ['专业知识', '品牌调性'],
  },
];

// 各人设模板对应的语气预览对话（同一个客户问题，不同风格的AI回复）
const personaPreviewQuestion = '这款产品可以发货到巴西吗？';
const personaPreviewAnswers: Record<string, string> = {
  sales: '当然可以！我们每天通过DHL快递发往巴西。2小时内下单可免费升级物流追踪，需要帮您安排吗？',
  support: '可以的，请放心。我们支持巴西地区配送，通常7-10个工作日到达，如有任何问题我随时为您跟进。',
  brand: '支持。我们与DHL国际物流深度合作，巴西全境可达，提供端到端物流追踪与签收确认服务。',
};

const AIConfigPage: React.FC<{ onNavigateToKnowledge?: () => void; onNavigateToScripts?: () => void; onNavigateToLabels?: () => void }> = ({ onNavigateToKnowledge, onNavigateToScripts, onNavigateToLabels }) => {
  const aiConfig = useStore((s) => s.aiEmployeeConfig);
  const updateAIConfig = useStore((s) => s.updateAIEmployeeConfig);
  const [selectedPlatform, setSelectedPlatform] = useState(aiConfig.activePlatforms[0] || 'whatsapp');

  const currentCapability = aiConfig.platformCapabilities.find(c => c.platformId === selectedPlatform);

  const toggleCapability = (key: 'aiSalesChat' | 'aiProactiveMarketing' | 'aiRecall' | 'aiQualityCheck') => {
    const updated = aiConfig.platformCapabilities.map(c =>
      c.platformId === selectedPlatform ? { ...c, [key]: !c[key] } : c
    );
    updateAIConfig({ platformCapabilities: updated });
  };

  const toggleWorkDay = (day: number) => {
    const days = aiConfig.workDays.includes(day)
      ? aiConfig.workDays.filter(d => d !== day)
      : [...aiConfig.workDays, day].sort();
    updateAIConfig({ workDays: days });
  };

  const dayLabels = [
    { day: 1, label: 'Mon' }, { day: 2, label: 'Tue' }, { day: 3, label: 'Wed' },
    { day: 4, label: 'Thu' }, { day: 5, label: 'Fri' }, { day: 6, label: 'Sat' }, { day: 0, label: 'Sun' },
  ];

  const activeFeatures = [
    currentCapability?.aiSalesChat && { icon: MessageSquare, label: '客服' },
    currentCapability?.aiProactiveMarketing && { icon: Zap, label: '营销' },
    currentCapability?.aiRecall && { icon: Clock, label: '召回' },
    currentCapability?.aiQualityCheck && { icon: CheckCircle2, label: '质检' },
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; label: string }[];

  return (
    <div className="h-full flex">
      {/* 左侧员工卡片 */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-gradient-to-b from-[#FF6B35]/5 to-white p-6 pt-10 flex flex-col items-center justify-center overflow-auto">
        {/* 头像 */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#FF6B35]/20 to-[#FF8F5E]/30 flex items-center justify-center overflow-hidden">
            <Bot className="w-12 h-12 text-[#FF6B35]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
        </div>

        {/* 名称 + 人设标签 */}
        <div className="text-center mb-2">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{aiConfig.name}</h3>
          <span className="inline-block px-2.5 py-0.5 text-[10px] font-medium bg-[#FF6B35]/10 text-[#FF6B35] rounded-md">
            {personaTemplates.find(p => p.id === aiConfig.personaTemplate)?.name || ''}
          </span>
        </div>

        {/* 工作状态 */}
        <div className="w-full mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">工作状态</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-medium text-green-600">在线接单中</span>
            </div>
          </div>

          {/* 已激活平台 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">已激活平台</span>
            <div className="flex items-center gap-1">
              {aiConfig.activePlatforms.slice(0, 4).map(pid => {
                const pc = platformConfigs.find(p => p.id === pid);
                const PIcon = pc ? platformIconMap[pc.icon] : null;
                return pc && PIcon ? (
                  <div key={pid} className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: pc.color }}>
                    <PIcon className="w-3 h-3 text-white" />
                  </div>
                ) : null;
              })}
              {aiConfig.activePlatforms.length > 4 && (
                <span className="text-[10px] text-gray-400">+{aiConfig.activePlatforms.length - 4}</span>
              )}
            </div>
          </div>

          {/* 活跃功能 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">活跃功能</span>
            <div className="flex items-center gap-1">
              {activeFeatures.map((f, i) => (
                <f.icon key={i} className="w-4 h-4 text-gray-400" />
              ))}
            </div>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="w-full mt-10 border-t border-gray-200" />

        {/* 语气预览 */}
        <div className="w-full mt-6">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-5">语气预览</p>
          <div className="space-y-5">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-gray-500">客</div>
              <div className="max-w-[75%] bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 text-xs text-gray-700 leading-relaxed">
                {personaPreviewQuestion}
              </div>
            </div>
            <div className="flex items-start gap-2.5 justify-end">
              <div className="max-w-[75%] bg-[#FF6B35]/10 rounded-2xl rounded-tr-sm px-4 py-2.5 text-xs text-gray-700 leading-relaxed">
                {personaPreviewAnswers[aiConfig.personaTemplate]}
              </div>
              <div className="w-7 h-7 rounded-full bg-[#FF6B35] flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white">AI</div>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧内容区 */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl py-6 px-8 space-y-6">

          {/* 平台标签栏 */}
          <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1.5">
            {aiConfig.activePlatforms.map(pid => {
              const pc = platformConfigs.find(p => p.id === pid);
              if (!pc) return null;
              const isActive = selectedPlatform === pid;
              return (
                <button
                  key={pid}
                  onClick={() => setSelectedPlatform(pid)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-white shadow-sm border border-gray-200 text-gray-900"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pc.color }} />
                  {pc.name}
                </button>
              );
            })}
          </div>

          {/* AI 身份与人设 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <User className="w-4 h-4 text-[#FF6B35]" />
              <h3 className="text-sm font-semibold text-gray-900">AI 身份与人设</h3>
            </div>
            <div className="px-6 py-5 space-y-5">
              {/* 昵称 */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">AI 员工对外昵称</label>
                <input
                  type="text"
                  value={aiConfig.name}
                  onChange={(e) => updateAIConfig({ name: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                />
              </div>

              {/* 人设模板选择 */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">选择人设模板</label>
                <div className="grid grid-cols-3 gap-3">
                  {personaTemplates.map(tpl => {
                    const isSelected = aiConfig.personaTemplate === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        onClick={() => updateAIConfig({ personaTemplate: tpl.id })}
                        className={cn(
                          "relative text-left p-4 rounded-xl border-2 transition-all",
                          isSelected
                            ? "border-[#FF6B35] bg-[#FF6B35]/[0.03]"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="w-4 h-4 text-[#FF6B35]" />
                          </div>
                        )}
                        <span className="text-2xl mb-2 block">{tpl.icon}</span>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{tpl.name}</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed mb-2">{tpl.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {tpl.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 text-[10px] bg-gray-100 text-gray-500 rounded-md">{tag}</span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 工作时间 (Schedule) */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF6B35]" />
              <h3 className="text-sm font-semibold text-gray-900">工作时间 (Schedule)</h3>
            </div>
            <div className="px-6 py-5 space-y-5">
              {/* 时区 + 在线时间段 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">工作时区</label>
                  <select
                    value={aiConfig.timezone}
                    onChange={(e) => updateAIConfig({ timezone: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] bg-white"
                  >
                    <option value="America/New_York">GMT-05:00 (New York)</option>
                    <option value="America/Chicago">GMT-06:00 (Chicago)</option>
                    <option value="America/Los_Angeles">GMT-08:00 (Los Angeles)</option>
                    <option value="Europe/London">GMT+00:00 (London)</option>
                    <option value="Asia/Shanghai">GMT+08:00 (Shanghai)</option>
                    <option value="Asia/Tokyo">GMT+09:00 (Tokyo)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">在线时间段</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={aiConfig.workStartTime}
                      onChange={(e) => updateAIConfig({ workStartTime: e.target.value })}
                      className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                    />
                    <span className="text-xs text-gray-400">至</span>
                    <input
                      type="time"
                      value={aiConfig.workEndTime}
                      onChange={(e) => updateAIConfig({ workEndTime: e.target.value })}
                      className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                    />
                  </div>
                </div>
              </div>
              {/* 提示 */}
              <p className="text-[11px] text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                根据目标客户所在区域选择，避免半夜营销骚扰。
              </p>

              {/* 工作日 */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">工作日</label>
                <div className="flex items-center gap-2">
                  {dayLabels.map(({ day, label }) => {
                    const isActive = aiConfig.workDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleWorkDay(day)}
                        className={cn(
                          "w-12 h-10 rounded-lg text-sm font-medium transition-all",
                          isActive
                            ? "bg-[#FF6B35] text-white shadow-sm"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* AI 能力配置 (Capabilities) */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#FF6B35]" />
                <h3 className="text-sm font-semibold text-gray-900">AI 能力配置 (Capabilities)</h3>
              </div>
              <span className="text-xs text-gray-400">
                当前应用: {platformConfigs.find(p => p.id === selectedPlatform)?.name}
              </span>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-4">
                {/* AI 销售客服 */}
                <CapabilityCard
                  icon={MessageSquare}
                  iconColor="text-[#FF6B35]"
                  iconBg="bg-[#FF6B35]/10"
                  title="AI 销售客服"
                  description="自动接待新客咨询，解答产品问题，并在对话中识别意向进行留资引导。"
                  enabled={!!currentCapability?.aiSalesChat}
                  onToggle={() => toggleCapability('aiSalesChat')}
                />
                {/* AI 主动营销 */}
                <CapabilityCard
                  icon={Zap}
                  iconColor="text-amber-500"
                  iconBg="bg-amber-50"
                  title="AI 主动营销"
                  description="根据用户标签，向潜在客户主动发送个性化营销话术（SOP推送）。"
                  enabled={!!currentCapability?.aiProactiveMarketing}
                  onToggle={() => toggleCapability('aiProactiveMarketing')}
                />
                {/* AI 沉默召回 */}
                <CapabilityCard
                  icon={Clock}
                  iconColor="text-emerald-500"
                  iconBg="bg-emerald-50"
                  title="AI 沉默召回"
                  description="对超过 7 天未互动的客户进行探测性发信，根据回复意愿重新激活。"
                  enabled={!!currentCapability?.aiRecall}
                  onToggle={() => toggleCapability('aiRecall')}
                />
                {/* AI 会话质检 */}
                <CapabilityCard
                  icon={CheckCircle2}
                  iconColor="text-rose-500"
                  iconBg="bg-rose-50"
                  title="AI 会话质检"
                  description="实时监控对话情绪，识别违规词汇或消极怠工行为，并自动生成质检报告。"
                  enabled={!!currentCapability?.aiQualityCheck}
                  onToggle={() => toggleCapability('aiQualityCheck')}
                />
              </div>
            </div>
          </div>

          {/* 知识库、话术库、标签配置入口 */}
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={onNavigateToKnowledge}
              className="group bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-[#FF6B35]/40 hover:shadow-md hover:shadow-[#FF6B35]/5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center mb-3 group-hover:bg-[#FF6B35]/15 transition-colors">
                <BookOpen className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">知识库配置</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-3">管理产品资料、FAQ、公司介绍等知识内容，让AI员工更懂你的业务。</p>
              <div className="flex items-center text-xs text-[#FF6B35] font-medium">
                前往配置
                <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
            <button
              onClick={onNavigateToScripts}
              className="group bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-[#FF6B35]/40 hover:shadow-md hover:shadow-[#FF6B35]/5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3 group-hover:bg-amber-100/70 transition-colors">
                <MessageSquare className="w-5 h-5 text-amber-500" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">话术库配置</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-3">配置营销话术、回复模板和SOP流程，提升AI员工的沟通转化能力。</p>
              <div className="flex items-center text-xs text-[#FF6B35] font-medium">
                前往配置
                <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
            <button
              onClick={onNavigateToLabels}
              className="group bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-[#FF6B35]/40 hover:shadow-md hover:shadow-[#FF6B35]/5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center mb-3 group-hover:bg-violet-100/70 transition-colors">
                <Tags className="w-5 h-5 text-violet-500" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">AI标签配置</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-3">配置AI自动打标规则与客户分类标签，实现精准客户画像管理。</p>
              <div className="flex items-center text-xs text-[#FF6B35] font-medium">
                前往配置
                <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
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
const AdminCustomerListPage: React.FC = () => {
  const conversations = useStore((s) => s.conversations);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // 从会话中提取唯一客户
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

  // 筛选
  const filtered = useMemo(() => {
    let result = customers;
    if (platformFilter !== 'all') {
      result = result.filter(c => c.platform === platformFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q)) ||
        c.country.toLowerCase().includes(q)
      );
    }
    return result;
  }, [customers, platformFilter, searchQuery]);

  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return date instanceof Date ? date.toLocaleDateString('zh-CN') : String(date);
  };

  // 统计
  const stats = useMemo(() => ({
    total: customers.length,
    platforms: [...new Set(customers.map(c => c.platform))].length,
    withOrders: customers.filter(c => c.orderHistory && c.orderHistory.length > 0).length,
    countries: [...new Set(customers.map(c => c.country))].length,
  }), [customers]);

  return (
    <div className="h-full flex flex-col">
      {/* 顶部操作栏 */}
      <div className="px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div />
        <button className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-[#E85A2A] transition-colors">
          <Plus className="w-4 h-4" />
          添加客户
        </button>
      </div>

      <div className="flex-1 px-6 pb-6 min-h-0 flex flex-col">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: '总客户数', value: stats.total, color: 'text-gray-900' },
            { label: '覆盖平台', value: stats.platforms, color: 'text-blue-600' },
            { label: '有订单客户', value: stats.withOrders, color: 'text-green-600' },
            { label: '覆盖国家', value: stats.countries, color: 'text-purple-600' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-3 text-center">
              <p className={cn("text-xl font-bold", item.color)}>{item.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        {/* 搜索和筛选栏 */}
        <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 px-4 py-3 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索客户名称、邮箱、电话、国家..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg transition-colors",
              showFilters
                ? "border-[#FF6B35] text-[#FF6B35] bg-[#FF6B35]/5"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            <Filter className="w-4 h-4" />
            筛选
          </button>
          {platformFilter !== 'all' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B35]/10 text-[#FF6B35] text-sm rounded-lg">
              <Globe className="w-3.5 h-3.5" />
              <span>{platformConfigs.find(p => p.id === platformFilter)?.name || platformFilter}</span>
              <button onClick={() => setPlatformFilter('all')} className="ml-1 hover:bg-[#FF6B35]/20 rounded p-0.5">&times;</button>
            </div>
          )}
          <div className="ml-auto text-xs text-gray-500">
            共 {filtered.length} 位客户
          </div>
        </div>

        {/* 平台筛选面板 */}
        {showFilters && (
          <div className="bg-white border-x border-gray-200 px-4 py-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 mr-1">平台:</span>
            <button
              onClick={() => setPlatformFilter('all')}
              className={cn(
                "px-2.5 py-1 text-xs rounded-md transition-colors",
                platformFilter === 'all' ? "bg-[#FF6B35] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >全部</button>
            {platformConfigs.map(p => (
              <button
                key={p.id}
                onClick={() => setPlatformFilter(p.id)}
                className={cn(
                  "px-2.5 py-1 text-xs rounded-md transition-colors",
                  platformFilter === p.id ? "bg-[#FF6B35] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >{p.name}</button>
            ))}
          </div>
        )}

        {/* 客户表格 */}
        <CustomerTable customers={filtered} formatDate={formatDate} />
      </div>
    </div>
  );
};

// 客户表格组件（拆分以保持可读性）
const CustomerTable: React.FC<{
  customers: import('@/types').CustomerProfile[];
  formatDate: (date?: Date) => string;
}> = ({ customers, formatDate }) => (
  <div className="bg-white rounded-b-xl border border-gray-200 flex-1 overflow-hidden flex flex-col">
    <div className="overflow-x-auto flex-1">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/50">
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">客户</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">平台</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">国家</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">联系方式</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">标签</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">订单数</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">最后联系</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => {
            const pc = platformConfigs.find(p => p.id === customer.platform);
            return (
              <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {customer.avatar ? (
                        <img src={customer.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                      {customer.email && (
                        <p className="text-xs text-gray-400">{customer.email}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {pc && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full text-white"
                      style={{ backgroundColor: pc.color }}
                    >
                      {pc.name}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm text-gray-600">{customer.country}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {customer.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">{customer.phone}</span>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {customer.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded">
                        {tag}
                      </span>
                    ))}
                    {customer.tags.length > 3 && (
                      <span className="text-[10px] text-gray-400">+{customer.tags.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {customer.orderHistory?.length || 0}
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  {formatDate(customer.lastContactAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {customers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <UserCircle className="w-10 h-10 mb-3 text-gray-300" />
          <p className="text-sm">暂无客户数据</p>
          <p className="text-xs mt-1">请调整筛选条件</p>
        </div>
      )}
    </div>
  </div>
);

// 平台工单定义
type PlatformTicketStatus = 'normal' | 'abnormal' | 'offline';

interface PlatformTicket {
  id: string;
  ticketNo: string;
  platform: string;
  activationCode: string;
  activationRemark: string;
  status: PlatformTicketStatus;
  onlineConversations: number;
  totalConversations: number;
  groupId: string;
  createdAt: Date;
}

// 工单状态配置
const ticketStatusConfig: Record<PlatformTicketStatus, { label: string; cls: string }> = {
  normal: { label: '正常', cls: 'bg-green-50 text-green-700 border-green-200' },
  abnormal: { label: '异常', cls: 'bg-red-50 text-red-600 border-red-200' },
  offline: { label: '离线', cls: 'bg-gray-50 text-gray-500 border-gray-200' },
};

// 工单分组
interface TicketGroup {
  id: string;
  name: string;
  count: number;
}

const mockTicketGroups: TicketGroup[] = [
  { id: 'all', name: '全部', count: 5 },
  { id: 'default', name: '默认分组', count: 2 },
  { id: 'sales', name: '销售部', count: 2 },
  { id: 'source', name: '源码组', count: 1 },
  { id: 'cs', name: '客服部', count: 0 },
];

// Mock 平台工单数据
const mockPlatformTickets: PlatformTicket[] = [
  { id: 'pt_1', ticketNo: '20260203180448839688', platform: 'telegram', activationCode: 'QXMS-SA01-2024', activationRemark: '销售主力', status: 'normal', onlineConversations: 0, totalConversations: 1, groupId: 'default', createdAt: new Date('2026-02-03T18:04:00') },
  { id: 'pt_2', ticketNo: '20260203105618183779', platform: 'telegram', activationCode: 'QXMS-SA02-2024', activationRemark: '李四', status: 'normal', onlineConversations: 1, totalConversations: 1, groupId: 'default', createdAt: new Date('2026-02-03T10:56:00') },
  { id: 'pt_3', ticketNo: '20260204091532847261', platform: 'whatsapp', activationCode: 'QXMS-SO01-2024', activationRemark: 'David', status: 'normal', onlineConversations: 2, totalConversations: 3, groupId: 'sales', createdAt: new Date('2026-02-04T09:15:00') },
  { id: 'pt_4', ticketNo: '20260204142817593042', platform: 'whatsapp', activationCode: 'QXMS-SO02-2024', activationRemark: 'Emily', status: 'abnormal', onlineConversations: 0, totalConversations: 2, groupId: 'sales', createdAt: new Date('2026-02-04T14:28:00') },
  { id: 'pt_5', ticketNo: '20260205083921674518', platform: 'instagram', activationCode: 'QXMS-OP01-2024', activationRemark: '运营主管', status: 'normal', onlineConversations: 1, totalConversations: 1, groupId: 'source', createdAt: new Date('2026-02-05T08:39:00') },
];

// 工单列表页面
const AdminTicketListPage: React.FC = () => {
  const activationCodes = useStore((s) => s.activationCodes);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [codeFilter, setCodeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<PlatformTicketStatus | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = mockPlatformTickets;
    if (selectedGroup !== 'all') {
      result = result.filter(t => t.groupId === selectedGroup);
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
  }, [selectedGroup, platformFilter, codeFilter, statusFilter]);

  const totalOnline = filtered.reduce((s, t) => s + t.onlineConversations, 0);
  const totalConv = filtered.reduce((s, t) => s + t.totalConversations, 0);

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

      {/* 主体：左侧分组 + 右侧表格 */}
      <div className="flex-1 flex min-h-0">
        <TicketGroupSidebar
          groups={mockTicketGroups}
          selectedGroup={selectedGroup}
          onSelect={setSelectedGroup}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <TicketDataTable
            tickets={filtered}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleAll={toggleAll}
            totalOnline={totalOnline}
            totalConv={totalConv}
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
}> = ({ platformFilter, onPlatformChange, codeFilter, onCodeChange, statusFilter, onStatusChange, allCodes, onReset }) => (
  <div className="px-6 py-3 flex items-center gap-4 border-b border-gray-100 flex-shrink-0 bg-white">
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 whitespace-nowrap">工单平台</span>
      <select
        value={platformFilter}
        onChange={(e) => onPlatformChange(e.target.value)}
        className="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] min-w-[140px]"
      >
        <option value="all">全部</option>
        {platformConfigs.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 whitespace-nowrap">激活码(备注)</span>
      <select
        value={codeFilter}
        onChange={(e) => onCodeChange(e.target.value)}
        className="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] min-w-[140px]"
      >
        <option value="all">全部</option>
        {allCodes.map(c => (
          <option key={c.code} value={c.code}>{c.code}({c.remark})</option>
        ))}
      </select>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 whitespace-nowrap">工单状态</span>
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as PlatformTicketStatus | 'all')}
        className="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] min-w-[100px]"
      >
        <option value="all">全部</option>
        <option value="normal">正常</option>
        <option value="abnormal">异常</option>
        <option value="offline">离线</option>
      </select>
    </div>
    <button
      onClick={() => {}}
      className="px-4 py-1.5 text-sm font-medium text-white bg-[#FF6B35] rounded-md hover:bg-[#E85A2A] transition-colors"
    >
      查询
    </button>
    <button
      onClick={onReset}
      className="px-4 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
    >
      重置
    </button>
  </div>
);

// 工单分组侧边栏
const TicketGroupSidebar: React.FC<{
  groups: TicketGroup[];
  selectedGroup: string;
  onSelect: (id: string) => void;
}> = ({ groups, selectedGroup, onSelect }) => (
  <div className="w-48 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
    <div className="px-4 py-3 border-b border-gray-100">
      <h4 className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
        <Filter className="w-3.5 h-3.5 text-gray-400" />
        全部分组
      </h4>
    </div>
    <div className="py-1">
      {groups.map((g) => (
        <button
          key={g.id}
          onClick={() => onSelect(g.id)}
          className={cn(
            "w-full text-left px-4 py-2.5 text-sm transition-colors",
            selectedGroup === g.id
              ? "text-[#FF6B35] bg-[#FF6B35]/5 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          {g.name}({g.count})
        </button>
      ))}
    </div>
  </div>
);

// 工单数据表格
const TicketDataTable: React.FC<{
  tickets: PlatformTicket[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  totalOnline: number;
  totalConv: number;
}> = ({ tickets, selectedIds, onToggleSelect, onToggleAll, totalOnline, totalConv }) => (
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
          <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">操作</th>
        </tr>
      </thead>
      <TicketTableRows tickets={tickets} selectedIds={selectedIds} onToggleSelect={onToggleSelect} />
    </table>

    {/* 总计行 */}
    {tickets.length > 0 && (
      <div className="border-t border-gray-200 bg-gray-50/50 px-4 py-3 flex items-center">
        <span className="text-sm text-gray-500 ml-[calc(2.5rem+1rem+1rem)]">总计</span>
        <span className="text-sm font-medium text-gray-700 ml-auto mr-[calc(6rem)]">
          {totalOnline}/{totalConv}
        </span>
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
}> = ({ tickets, selectedIds, onToggleSelect }) => (
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
            <span className="text-sm text-[#FF6B35] cursor-pointer hover:underline">
              {ticket.activationCode}({ticket.activationRemark})
            </span>
          </td>
          <td className="py-3 px-4">
            <span className={cn("px-2 py-0.5 text-xs font-medium rounded border", sc.cls)}>
              {sc.label}
            </span>
          </td>
          <td className="py-3 px-4 text-sm text-gray-700">
            {ticket.onlineConversations}/{ticket.totalConversations}
          </td>
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              <button className="text-xs text-[#FF6B35] hover:underline whitespace-nowrap">工单详情</button>
              <button className="text-xs text-[#FF6B35] hover:underline whitespace-nowrap flex items-center gap-0.5">
                更多
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </td>
        </tr>
      );
    })}
  </tbody>
);

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
