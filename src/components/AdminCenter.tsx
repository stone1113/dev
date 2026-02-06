import React, { useState } from 'react';
import {
  Building2,
  Users,
  Shield,
  Key,
  ChevronRight,
  Save,
  ArrowLeft,
  Check,
  AlertCircle,
  Loader2,
  Copy,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import type { LoginMode, Organization, BoundAccount } from '@/types';

interface AdminCenterProps {
  onBack?: () => void;
}

// 安全设置组件
const SecuritySettings: React.FC<{
  organization: Organization;
}> = ({ organization }) => {
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireNumber: true,
    requireSpecial: false
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#FF6B35]" />
          密码策略
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          仅在"激活码 + 账号密码"模式下生效
        </p>

        {organization.loginMode === 'activation_only' && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              当前为"仅激活码登录"模式，密码策略不会生效
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">最小密码长度</label>
            <select
              value={passwordPolicy.minLength}
              onChange={(e) => setPasswordPolicy(prev => ({ ...prev, minLength: Number(e.target.value) }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            >
              <option value={6}>6 位</option>
              <option value={8}>8 位</option>
              <option value={10}>10 位</option>
              <option value={12}>12 位</option>
            </select>
          </div>

          <div className="space-y-3">
            <PolicyToggle
              label="必须包含大写字母"
              checked={passwordPolicy.requireUppercase}
              onChange={(v) => setPasswordPolicy(prev => ({ ...prev, requireUppercase: v }))}
            />
            <PolicyToggle
              label="必须包含数字"
              checked={passwordPolicy.requireNumber}
              onChange={(v) => setPasswordPolicy(prev => ({ ...prev, requireNumber: v }))}
            />
            <PolicyToggle
              label="必须包含特殊字符"
              checked={passwordPolicy.requireSpecial}
              onChange={(v) => setPasswordPolicy(prev => ({ ...prev, requireSpecial: v }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// 策略开关组件
const PolicyToggle: React.FC<{
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "w-10 h-6 rounded-full transition-colors relative",
        checked ? "bg-[#FF6B35]" : "bg-gray-200"
      )}
    >
      <span className={cn(
        "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
        checked ? "left-5" : "left-1"
      )} />
    </button>
  </label>
);

// 成员管理组件
const MemberManagement: React.FC<{
  members: BoundAccount[];
  onToggleStatus: (accountId: string) => void;
  onAddMember: (account: Omit<BoundAccount, 'id'>) => void;
}> = ({ members, onToggleStatus }) => {
  const roleLabels: Record<string, string> = {
    admin: '管理员',
    agent: '客服',
    manager: '主管'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#FF6B35]" />
            成员列表
          </h3>
          <button
            className="px-4 py-2 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-[#E85A2A]"
          >
            添加成员
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">用户名</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">显示名称</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">角色</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">状态</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{member.username}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{member.displayName}</td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      member.role === 'admin'
                        ? "bg-purple-100 text-purple-700"
                        : member.role === 'manager'
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                    )}>
                      {roleLabels[member.role] || member.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      member.status === 'active'
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    )}>
                      {member.status === 'active' ? '正常' : '禁用'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onToggleStatus(member.id)}
                      className="text-sm text-[#FF6B35] hover:underline"
                    >
                      {member.status === 'active' ? '禁用' : '启用'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 组织设置组件
const OrganizationSettings: React.FC<{
  organization: Organization;
  setOrganization: (updates: Partial<Organization>) => void;
  toggleLoginMode: (mode: LoginMode) => void;
  copyActivationCode: () => void;
}> = ({ organization, setOrganization, toggleLoginMode, copyActivationCode }) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="space-y-6">
      {/* 基本信息卡片 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#FF6B35]" />
          基本信息
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">组织名称</label>
            <input
              type="text"
              value={organization.name}
              onChange={(e) => setOrganization({ name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">激活码</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showCode ? 'text' : 'password'}
                  value={organization.activationCode}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 pr-20"
                />
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={copyActivationCode}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <button className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-600">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">激活码用于成员登录系统</p>
          </div>
        </div>
      </div>

      {/* 登录模式设置卡片 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-[#FF6B35]" />
          登录模式设置
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          选择组织成员的登录验证方式，设置后将对所有成员生效
        </p>
        <div className="space-y-3">
          <LoginModeOption
            mode="activation_only"
            title="仅激活码登录"
            description="成员只需输入激活码即可登录，适合小团队快速使用"
            isSelected={organization.loginMode === 'activation_only'}
            onSelect={() => toggleLoginMode('activation_only')}
          />
          <LoginModeOption
            mode="activation_with_password"
            title="激活码 + 账号密码"
            description="成员需要输入激活码和个人账号密码，安全性更高，适合正式团队"
            isSelected={organization.loginMode === 'activation_with_password'}
            onSelect={() => toggleLoginMode('activation_with_password')}
          />
        </div>
      </div>

      {/* 状态信息 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">订阅状态</h3>
        <div className="grid grid-cols-3 gap-4">
          <StatusCard label="状态" value={organization.status === 'active' ? '正常' : '已过期'} status={organization.status} />
          <StatusCard label="成员数" value={`${organization.memberCount} 人`} />
          <StatusCard label="到期时间" value={organization.expiresAt instanceof Date ? organization.expiresAt.toLocaleDateString('zh-CN') : (organization.expiresAt || '-')} />
        </div>
      </div>
    </div>
  );
};

// 登录模式选项组件
const LoginModeOption: React.FC<{
  mode: LoginMode;
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ title, description, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    className={cn(
      "w-full p-4 rounded-lg border-2 text-left transition-all",
      isSelected
        ? "border-[#FF6B35] bg-[#FF6B35]/5"
        : "border-gray-200 hover:border-gray-300"
    )}
  >
    <div className="flex items-start gap-3">
      <div className={cn(
        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
        isSelected ? "border-[#FF6B35] bg-[#FF6B35]" : "border-gray-300"
      )}>
        {isSelected && <Check className="w-3 h-3 text-white" />}
      </div>
      <div>
        <p className={cn("font-medium", isSelected ? "text-[#FF6B35]" : "text-gray-900")}>{title}</p>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  </button>
);

// 状态卡片组件
const StatusCard: React.FC<{
  label: string;
  value: string;
  status?: 'active' | 'inactive' | 'expired';
}> = ({ label, value, status }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className={cn(
      "font-semibold",
      status === 'active' ? "text-green-600" : status === 'expired' ? "text-red-600" : "text-gray-900"
    )}>
      {value}
    </p>
  </div>
);

// 侧边栏组件
const Sidebar: React.FC<{
  activeTab: 'organization' | 'members' | 'security';
  setActiveTab: (tab: 'organization' | 'members' | 'security') => void;
}> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'organization' as const, label: '组织设置', icon: Building2 },
    { id: 'members' as const, label: '成员管理', icon: Users },
    { id: 'security' as const, label: '安全设置', icon: Shield },
  ];

  return (
    <div className="w-56 flex-shrink-0">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === item.id
                ? "bg-[#FF6B35]/10 text-[#FF6B35] border-l-2 border-[#FF6B35]"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
            {activeTab === item.id && (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export const AdminCenter: React.FC<AdminCenterProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'organization' | 'members' | 'security'>('organization');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 从 store 获取组织信息和绑定账号管理方法
  const organization = useStore((state) => state.organization);
  const updateOrganization = useStore((state) => state.updateOrganization);
  const setOrganizationLoginMode = useStore((state) => state.setOrganizationLoginMode);
  const toggleBoundAccountStatus = useStore((state) => state.toggleBoundAccountStatus);
  const addBoundAccount = useStore((state) => state.addBoundAccount);

  // 获取绑定账号列表
  const boundAccounts = organization.boundAccounts || [];

  // 复制激活码
  const copyActivationCode = () => {
    navigator.clipboard.writeText(organization.activationCode);
  };

  // 保存设置
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // 模拟API保存
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      console.error('保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  // 切换登录模式
  const toggleLoginMode = (mode: LoginMode) => {
    setOrganizationLoginMode(mode);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">洽</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">管理中心</h1>
                <p className="text-xs text-gray-500">{organization.name}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
              isSaving
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : saveSuccess
                  ? "bg-green-500 text-white"
                  : "bg-[#FF6B35] text-white hover:bg-[#E85A2A]"
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                保存中...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                已保存
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                保存设置
              </>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* 左侧菜单 */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* 右侧内容 */}
          <div className="flex-1">
            {activeTab === 'organization' && (
              <OrganizationSettings
                organization={organization}
                setOrganization={updateOrganization}
                toggleLoginMode={toggleLoginMode}
                copyActivationCode={copyActivationCode}
              />
            )}
            {activeTab === 'members' && (
              <MemberManagement
                members={boundAccounts}
                onToggleStatus={toggleBoundAccountStatus}
                onAddMember={addBoundAccount}
              />
            )}
            {activeTab === 'security' && (
              <SecuritySettings organization={organization} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
