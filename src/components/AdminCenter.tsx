import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Key,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Search,
  Filter,
  Users,
  FolderTree,
  Check,
  Shield,
  MessageSquare,
  Bot,
  Settings2,
  X,
  Zap,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import type { Department, ActivationCode, LoginMode } from '@/types';

// 部门树节点组件
const DepartmentTreeNode: React.FC<{
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
          "w-full flex items-center gap-1.5 py-2 px-2 rounded-lg text-sm transition-colors group",
          isSelected
            ? "bg-[#FF6B35]/10 text-[#FF6B35] font-medium"
            : "text-gray-700 hover:bg-gray-100"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="p-0.5 rounded hover:bg-gray-200 flex-shrink-0"
          >
            {expanded
              ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            }
          </button>
        ) : (
          <span className="w-4.5 flex-shrink-0" />
        )}
        <FolderTree className={cn("w-4 h-4 flex-shrink-0", isSelected ? "text-[#FF6B35]" : "text-gray-400")} />
        <span className="truncate flex-1 text-left">{dept.name}</span>
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded-full flex-shrink-0",
          isSelected ? "bg-[#FF6B35]/20 text-[#FF6B35]" : "bg-gray-100 text-gray-500"
        )}>
          {dept.memberCount}
        </span>
      </button>
      {hasChildren && expanded && (
        <div>
          {dept.children!.map((child) => (
            <DepartmentTreeNode
              key={child.id}
              dept={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 激活码状态徽章
const StatusBadge: React.FC<{ status: ActivationCode['status'] }> = ({ status }) => {
  const config: Record<string, { label: string; cls: string }> = {
    active: { label: '已启用', cls: 'bg-green-50 text-green-700 border-green-200' },
    expired: { label: '已过期', cls: 'bg-gray-50 text-gray-500 border-gray-200' },
    disabled: { label: '已禁用', cls: 'bg-red-50 text-red-600 border-red-200' },
  };
  const c = config[status];
  if (!c) return null;
  return (
    <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full border whitespace-nowrap", c.cls)}>
      {c.label}
    </span>
  );
};

// 角色徽章
const RoleBadge: React.FC<{ role: ActivationCode['role'] }> = ({ role }) => {
  const config: Record<string, { label: string; cls: string }> = {
    admin: { label: '管理员', cls: 'bg-purple-50 text-purple-700' },
    manager: { label: '主管', cls: 'bg-blue-50 text-blue-700' },
    agent: { label: '客服', cls: 'bg-gray-100 text-gray-600' },
  };
  const c = config[role] || config.agent;
  return (
    <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full", c.cls)}>
      {c.label}
    </span>
  );
};

// AI分配模式徽章
const AllocationModeBadge: React.FC<{ mode?: 'fixed' | 'auto'; limit?: number; used?: number }> = ({ mode, limit, used }) => {
  if (!mode || !limit) return <span className="text-xs text-gray-300">-</span>;
  const isFixed = mode === 'fixed';
  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <span className={cn(
        "inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium rounded",
        isFixed ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
      )}>
        {isFixed ? <Lock className="w-2.5 h-2.5" /> : <Zap className="w-2.5 h-2.5" />}
        {isFixed ? '固定' : '动态'}
      </span>
      <span className="text-xs text-gray-500">{used ?? 0}/{limit}</span>
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
      "w-full p-3 rounded-lg border text-left transition-all",
      isSelected
        ? "border-[#FF6B35] bg-[#FF6B35]/5"
        : "border-gray-200 hover:border-gray-300"
    )}
  >
    <div className="flex items-start gap-2">
      <div className={cn(
        "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
        isSelected ? "border-[#FF6B35] bg-[#FF6B35]" : "border-gray-300"
      )}>
        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
      </div>
      <div>
        <p className={cn("text-sm font-medium", isSelected ? "text-[#FF6B35]" : "text-gray-900")}>
          {title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  </button>
);

// 激活码行内联操作按钮
const CodeActionButtons: React.FC<{
  code: ActivationCode;
  onToggle: (id: string) => void;
  onCopy: (text: string) => void;
  onViewChat: (code: ActivationCode) => void;
}> = ({ code, onToggle, onCopy, onViewChat }) => (
  <div className="flex items-center gap-1">
    <button
      onClick={() => onViewChat(code)}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-[#FF6B35] hover:bg-[#FF6B35]/10 rounded-md transition-colors whitespace-nowrap"
      title="查看聊天记录"
    >
      <MessageSquare className="w-3.5 h-3.5" />
      聊天记录
    </button>
    <button
      onClick={() => onCopy(code.code)}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
      title="复制激活码"
    >
      <Copy className="w-3.5 h-3.5" />
      复制
    </button>
    {(code.status === 'active' || code.status === 'disabled') && (
      <button
        onClick={() => onToggle(code.id)}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors whitespace-nowrap",
          code.status === 'active'
            ? "text-red-600 hover:bg-red-50"
            : "text-green-600 hover:bg-green-50"
        )}
        title={code.status === 'active' ? '禁用' : '启用'}
      >
        {code.status === 'active' ? (
          <><EyeOff className="w-3.5 h-3.5" />禁用</>
        ) : (
          <><Eye className="w-3.5 h-3.5" />启用</>
        )}
      </button>
    )}
  </div>
);

// AI配额配置弹窗
const AIQuotaModal: React.FC<{
  code: ActivationCode;
  onClose: () => void;
  onSave: (updates: Partial<ActivationCode>) => void;
}> = ({ code, onClose, onSave }) => {
  const [mode, setMode] = useState<'fixed' | 'auto'>(code.aiAllocationMode || 'auto');
  const [seatLimit, setSeatLimit] = useState(code.aiSeatLimit ?? 0);
  const handleSave = () => {
    onSave({
      aiAllocationMode: mode,
      aiSeatLimit: seatLimit,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

        {/* 弹窗头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#FF6B35]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">AI配额设置</h3>
              <p className="text-xs text-gray-400 font-mono">{code.code}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* 弹窗内容 */}
        <div className="px-6 py-5 space-y-5">

          {/* 坐席上限 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">AI坐席上限</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                max={99}
                value={seatLimit}
                onChange={(e) => setSeatLimit(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
              />
              <span className="text-xs text-gray-400">已使用 {code.aiSeatUsed ?? 0} 个</span>
            </div>
          </div>

          {/* 分配模式 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">分配模式</label>
            <div className="grid grid-cols-2 gap-3">

              {/* 固定分配 */}
              <button
                onClick={() => setMode('fixed')}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  mode === 'fixed'
                    ? "border-[#FF6B35] bg-[#FF6B35]/5 ring-1 ring-[#FF6B35]/20"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Lock className={cn("w-4 h-4", mode === 'fixed' ? "text-[#FF6B35]" : "text-gray-400")} />
                  <span className={cn("text-sm font-medium", mode === 'fixed' ? "text-[#FF6B35]" : "text-gray-700")}>
                    固定分配
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  按固定数量分配AI端口给激活码，分配即占用端口
                </p>
              </button>

              {/* 自动分配 */}
              <button
                onClick={() => setMode('auto')}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  mode === 'auto'
                    ? "border-[#FF6B35] bg-[#FF6B35]/5 ring-1 ring-[#FF6B35]/20"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Zap className={cn("w-4 h-4", mode === 'auto' ? "text-[#FF6B35]" : "text-gray-400")} />
                  <span className={cn("text-sm font-medium", mode === 'auto' ? "text-[#FF6B35]" : "text-gray-700")}>
                    动态分配
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  从共享端口池按需分配，会话结束后释放，先到先得
                </p>
              </button>
            </div>
          </div>

        </div>

        {/* 弹窗底部 */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#E85A2A] rounded-lg transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminCenter: React.FC<{ onViewChat?: (code: ActivationCode) => void }> = ({ onViewChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ActivationCode['status'] | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [aiConfigCode, setAiConfigCode] = useState<ActivationCode | null>(null);

  const organization = useStore((state) => state.organization);
  const departments = useStore((state) => state.departments);
  const selectedDepartmentId = useStore((state) => state.selectedDepartmentId);
  const setSelectedDepartment = useStore((state) => state.setSelectedDepartment);
  const getFilteredActivationCodes = useStore((state) => state.getFilteredActivationCodes);
  const toggleActivationCodeStatus = useStore((state) => state.toggleActivationCodeStatus);
  const updateActivationCode = useStore((state) => state.updateActivationCode);
  const setOrganizationLoginMode = useStore((state) => state.setOrganizationLoginMode);

  const deptCodes = getFilteredActivationCodes();

  // 搜索和状态筛选
  const filteredCodes = useMemo(() => {
    let result = deptCodes.filter(c => c.status !== 'unused');
    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.code.toLowerCase().includes(q) ||
        (c.assignedTo && c.assignedTo.toLowerCase().includes(q)) ||
        c.departmentName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [deptCodes, statusFilter, searchQuery]);

  // 统计数据
  const stats = useMemo(() => ({
    total: deptCodes.filter(c => c.status !== 'unused').length,
    active: deptCodes.filter(c => c.status === 'active').length,
    expired: deptCodes.filter(c => c.status === 'expired').length,
    disabled: deptCodes.filter(c => c.status === 'disabled').length,
  }), [deptCodes]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return date instanceof Date ? date.toLocaleDateString('zh-CN') : String(date);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 顶部操作栏 */}
      <div className="px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div />
        <button className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-[#E85A2A] transition-colors">
          <Plus className="w-4 h-4" />
          生成激活码
        </button>
      </div>

      <div className="flex-1 px-6 pb-6 min-h-0">
        <div className="flex gap-6 h-full">
          {/* 左侧部门树 + 登录模式 */}
          <div className="w-64 flex-shrink-0 flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-gray-200 flex-1 flex flex-col min-h-0">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#FF6B35]" />
                  部门结构
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {departments.map((dept) => (
                  <DepartmentTreeNode
                    key={dept.id}
                    dept={dept}
                    level={0}
                    selectedId={selectedDepartmentId}
                    onSelect={setSelectedDepartment}
                  />
                ))}
              </div>
            </div>

            {/* 登录模式设置 */}
            <div className="bg-white rounded-xl border border-gray-200 flex-shrink-0">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#FF6B35]" />
                  登录模式
                </h3>
              </div>
              <div className="p-3 space-y-2">
                <LoginModeOption
                  mode="activation_only"
                  title="仅激活码"
                  description="输入激活码即可登录"
                  isSelected={organization.loginMode === 'activation_only'}
                  onSelect={() => setOrganizationLoginMode('activation_only')}
                />
                <LoginModeOption
                  mode="activation_with_password"
                  title="激活码 + 密码"
                  description="需输入激活码和个人密码"
                  isSelected={organization.loginMode === 'activation_with_password'}
                  onSelect={() => setOrganizationLoginMode('activation_with_password')}
                />
              </div>
            </div>
          </div>

          {/* 右侧激活码列表 */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* 统计卡片 */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: '全部', value: stats.total, color: 'text-gray-900', bg: 'bg-white', filter: 'all' as const },
                { label: '已启用', value: stats.active, color: 'text-green-600', bg: 'bg-green-50', filter: 'active' as const },
                { label: '已过期', value: stats.expired, color: 'text-gray-500', bg: 'bg-gray-50', filter: 'expired' as const },
                { label: '已禁用', value: stats.disabled, color: 'text-red-600', bg: 'bg-red-50', filter: 'disabled' as const },
              ].map((item) => (
                <button
                  key={item.filter}
                  onClick={() => setStatusFilter(item.filter === statusFilter ? 'all' : item.filter)}
                  className={cn(
                    "rounded-xl border p-3 text-center transition-all",
                    statusFilter === item.filter
                      ? "border-[#FF6B35] ring-1 ring-[#FF6B35]/30 bg-white"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                >
                  <p className={cn("text-xl font-bold", item.color)}>{item.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
                </button>
              ))}
            </div>

            {/* 搜索和筛选栏 */}
            <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 px-4 py-3 flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索激活码、使用人、部门..."
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
              {selectedDepartmentId && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B35]/10 text-[#FF6B35] text-sm rounded-lg">
                  <FolderTree className="w-3.5 h-3.5" />
                  <span>{deptCodes.length > 0 ? deptCodes[0].departmentName : '已选部门'}</span>
                  <button
                    onClick={() => setSelectedDepartment(null)}
                    className="ml-1 hover:bg-[#FF6B35]/20 rounded p-0.5"
                  >
                    &times;
                  </button>
                </div>
              )}
              <div className="ml-auto text-xs text-gray-500">
                共 {filteredCodes.length} 条
              </div>
            </div>

            {/* 激活码表格 */}
            <div className="bg-white rounded-b-xl border border-gray-200 flex-1 overflow-hidden flex flex-col">
              <div className="overflow-x-auto flex-1">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">激活码</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">所属部门</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">使用人</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">角色</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">状态</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">AI配额</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">创建时间</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">到期时间</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">备注</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCodes.map((code) => (
                      <tr key={code.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <Key className="w-3.5 h-3.5 text-[#FF6B35]" />
                            <code className="text-sm font-mono text-gray-900">{code.code}</code>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{code.departmentName}</td>
                        <td className="py-3 px-4">
                          {code.assignedTo ? (
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm text-gray-900">{code.assignedTo}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4"><RoleBadge role={code.role} /></td>
                        <td className="py-3 px-4"><StatusBadge status={code.status} /></td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setAiConfigCode(code)}
                            className="group flex items-center gap-1"
                          >
                            <AllocationModeBadge mode={code.aiAllocationMode} limit={code.aiSeatLimit} used={code.aiSeatUsed} />
                            <Settings2 className="w-3 h-3 text-gray-300 group-hover:text-[#FF6B35] transition-colors" />
                          </button>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">{formatDate(code.createdAt)}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">{formatDate(code.expiresAt)}</td>
                        <td className="py-3 px-4 text-sm text-gray-500 max-w-[120px] truncate">{code.remark || '-'}</td>
                        <td className="py-3 px-4">
                          <CodeActionButtons code={code} onToggle={toggleActivationCodeStatus} onCopy={handleCopy} onViewChat={onViewChat || (() => {})} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredCodes.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <Key className="w-10 h-10 mb-3 text-gray-300" />
                    <p className="text-sm">暂无激活码数据</p>
                    <p className="text-xs mt-1">请选择部门或调整筛选条件</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI配额配置弹窗 */}
      {aiConfigCode && (
        <AIQuotaModal
          code={aiConfigCode}
          onClose={() => setAiConfigCode(null)}
          onSave={(updates) => {
            updateActivationCode(aiConfigCode.id, updates);
            setAiConfigCode(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminCenter;
