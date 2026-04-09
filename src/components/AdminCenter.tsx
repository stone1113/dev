import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Key,
  Eye,
  EyeOff,
  Plus,
  Search,
  Filter,
  Users,
  FolderTree,
  Check,
  Shield,
  Bot,
  Settings2,
  X,
  Lock,
  UserPlus,
  Edit3,
  Unlink,
  AlertCircle,
  Share2,
  Copy,
  Minus,
  Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import type { Department, ActivationCode, LoginMode } from '@/types';
import { CreateActivationCodeModal } from './CreateActivationCodeModal';

// 平台配置（包含颜色和简称）
const PLATFORM_CONFIG: Record<string, { color: string; label: string }> = {
  whatsapp: { color: '#25D366', label: 'W' },
  telegram: { color: '#0088cc', label: 'T' },
  line: { color: '#00B900', label: 'L' },
  instagram: { color: '#E4405F', label: 'I' },
  facebook: { color: '#1877F2', label: 'F' },
  messenger: { color: '#0084FF', label: 'M' },
  wechat: { color: '#07C160', label: 'W' },
  email: { color: '#EA4335', label: 'E' },
  sms: { color: '#34A853', label: 'S' },
  tiktok: { color: '#000000', label: 'T' },
  twitter: { color: '#1DA1F2', label: 'X' },
  shopify: { color: '#96BF48', label: 'S' },
  viber: { color: '#665CAC', label: 'V' },
  kakao: { color: '#FFE812', label: 'K' },
  zalo: { color: '#0068FF', label: 'Z' },
  skype: { color: '#00AFF0', label: 'S' },
};

// 开关按钮组件
const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: () => void;
}> = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={cn(
      "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
      checked ? "bg-green-500" : "bg-gray-300"
    )}
  >
    <span
      className={cn(
        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
        checked ? "translate-x-5" : "translate-x-0.5"
      )}
    />
  </button>
);

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
          <span
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="p-0.5 rounded hover:bg-gray-200 flex-shrink-0 cursor-pointer"
          >
            {expanded
              ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            }
          </span>
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
    unused: { label: '未使用', cls: 'bg-gray-50 text-gray-500 border-gray-200' },
    active: { label: '已启用', cls: 'bg-green-50 text-green-700 border-green-200' },
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
const AllocationModeBadge: React.FC<{ mode?: 'fixed' | 'auto'; limit?: number; used?: number }> = ({ limit, used }) => {
  if (!limit) return <span className="text-xs text-gray-300">-</span>;
  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium rounded bg-blue-50 text-blue-600">
        <Lock className="w-2.5 h-2.5" />
        固定
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

// 分配部门弹框
const AssignDepartmentModal: React.FC<{
  code: ActivationCode;
  departments: Department[];
  onClose: () => void;
  onConfirm: (deptId: string) => void;
}> = ({ code, departments, onClose, onConfirm }) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(['1']));

  const toggleExpand = (deptId: string) => {
    setExpandedDepts(prev => {
      const next = new Set(prev);
      if (next.has(deptId)) {
        next.delete(deptId);
      } else {
        next.add(deptId);
      }
      return next;
    });
  };

  const renderDepartment = (dept: Department, level: number = 0): React.ReactNode => {
    const hasChildren = dept.children && dept.children.length > 0;
    const isExpanded = expandedDepts.has(dept.id);
    const isSelected = selectedDeptId === dept.id;

    return (
      <div key={dept.id}>
        <button
          onClick={() => setSelectedDeptId(dept.id)}
          className={cn(
            "w-full flex items-center gap-1.5 py-2 px-2 rounded-lg text-sm transition-colors",
            isSelected ? "bg-[#FF6B35]/10 text-[#FF6B35] font-medium" : "text-gray-700 hover:bg-gray-50"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => { e.stopPropagation(); toggleExpand(dept.id); }}
              className="p-0.5 rounded hover:bg-gray-200 flex-shrink-0"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <span className="w-4" />
          )}
          <span className="flex-1 text-left">{dept.name}</span>
        </button>
        {hasChildren && isExpanded && dept.children?.map(child => renderDepartment(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[600px] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">分配部门</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-600">激活码：<span className="font-medium text-gray-900">{code.code}</span></p>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {departments.map(dept => renderDepartment(dept))}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            取消
          </button>
          <button
            onClick={() => selectedDeptId && onConfirm(selectedDeptId)}
            disabled={!selectedDeptId}
            className={cn(
              "px-4 py-2 text-sm rounded-lg transition-colors",
              selectedDeptId ? "bg-[#FF6B35] text-white hover:bg-[#ff5722]" : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

// 分配账号弹框
const AssignAccountModal: React.FC<{
  code: ActivationCode;
  onClose: () => void;
  onConfirm: (accountIds: string[]) => void;
}> = ({ code, onClose, onConfirm }) => {
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  const accounts = [
    { id: '1', username: 'test', name: '测试用户', department: '金牌销售小组', role: '金牌销售主管' },
    { id: '2', username: 'user2', name: '张三', department: '国内销售组', role: '销售专员' },
    { id: '3', username: 'user3', name: '李四', department: '海外销售组', role: '销售经理' },
  ];

  const toggleAccount = (accountId: string) => {
    setSelectedAccountIds(prev =>
      prev.includes(accountId) ? prev.filter(id => id !== accountId) : [...prev, accountId]
    );
  };

  const toggleAll = () => {
    setSelectedAccountIds(prev =>
      prev.length === accounts.length ? [] : accounts.map(a => a.id)
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[600px] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">分配账号</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-600">激活码：<span className="font-medium text-gray-900">{code.code}</span></p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">
                  <input type="checkbox" className="rounded" checked={selectedAccountIds.length === accounts.length} onChange={toggleAll} />
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">账号</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">姓名</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">部门</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">角色</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input type="checkbox" className="rounded" checked={selectedAccountIds.includes(account.id)} onChange={() => toggleAccount(account.id)} />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{account.username}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{account.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{account.department}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{account.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-600">已选择 {selectedAccountIds.length} 个账号</span>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">取消</button>
            <button
              onClick={() => onConfirm(selectedAccountIds)}
              disabled={selectedAccountIds.length === 0}
              className={cn("px-4 py-2 text-sm rounded-lg transition-colors", selectedAccountIds.length > 0 ? "bg-[#FF6B35] text-white hover:bg-[#ff5722]" : "bg-gray-100 text-gray-400 cursor-not-allowed")}
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 解绑账号弹框
const UnbindAccountModal: React.FC<{
  code: ActivationCode;
  onClose: () => void;
  onConfirm: (accountIds: string[]) => void;
}> = ({ code, onClose, onConfirm }) => {
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  console.log('UnbindAccountModal - code:', code);
  console.log('UnbindAccountModal - assignedTo:', code.assignedTo);

  // 根据激活码的assignedTo字段生成已绑定账号列表
  const boundAccounts = code.assignedTo ? code.assignedTo.split(',').map((name, index) => ({
    id: `${code.id}-${index}`,
    username: name.trim(),
    name: name.trim(),
    status: 'active' as const,
    department: code.departmentName || '-',
    role: code.role || '客服',
    createdAt: code.createdAt || new Date()
  })) : [];

  console.log('UnbindAccountModal - boundAccounts:', boundAccounts);

  const toggleAccount = (accountId: string) => {
    setSelectedAccountIds(prev =>
      prev.includes(accountId) ? prev.filter(id => id !== accountId) : [...prev, accountId]
    );
  };

  const toggleAll = () => {
    setSelectedAccountIds(prev =>
      prev.length === boundAccounts.length ? [] : boundAccounts.map(a => a.id)
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[600px] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">解绑激活码</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {boundAccounts.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                      checked={selectedAccountIds.length === boundAccounts.length && boundAccounts.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">账号</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">姓名</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">账号状态</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">部门</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">角色</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">创建时间</th>
                </tr>
              </thead>
              <tbody>
                {boundAccounts.map((account) => (
                  <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                        checked={selectedAccountIds.includes(account.id)}
                        onChange={() => toggleAccount(account.id)}
                      />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{account.username}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{account.name}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        account.status === 'active' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      )}>
                        {account.status === 'active' ? '已启用' : '已禁用'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{account.department}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{account.role}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{account.createdAt.toLocaleDateString('zh-CN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Users className="w-12 h-12 mb-3 text-gray-300" />
              <p className="text-sm">暂无数据</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              onConfirm(selectedAccountIds);
              onClose();
            }}
            disabled={selectedAccountIds.length === 0}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              selectedAccountIds.length > 0
                ? "bg-[#FF6B35] text-white hover:bg-[#E85A2A]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            解绑
          </button>
        </div>
      </div>
    </div>
  );
};

// 禁用激活码确认弹框
const DisableConfirmModal: React.FC<{
  code: ActivationCode;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ code, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">确定要停用激活码？</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 mb-3">激活码停用后：</p>
          <ol className="space-y-2 text-sm text-gray-600">
            <li>1、系统自动回收已分配的端口数；</li>
            <li>2、该激活码不能在登录使用用客户端；</li>
            <li>3、客户端将关闭所有会话并退出；</li>
            <li>4、激活码对应的所有工单，工单状态置为"禁用"，禁用状态无法新增线索。</li>
          </ol>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium bg-[#FF6B35] text-white rounded-lg hover:bg-[#E85A2A] transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

// 部门冲突提示弹框
const DepartmentConflictModal: React.FC<{
  code: ActivationCode;
  newDeptName: string;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ code, newDeptName, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">部门冲突提示</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 mb-3">
            该激活码当前已绑定「{code.departmentName}」部门的员工账号，分配到新部门「{newDeptName}」后：
          </p>
          <ol className="space-y-2 text-sm text-gray-600">
            <li>1、系统将自动解绑原部门的所有员工账号；</li>
            <li>2、激活码将分配到新部门「{newDeptName}」；</li>
            <li>3、需要重新为该激活码分配新部门的员工账号。</li>
          </ol>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium bg-[#FF6B35] text-white rounded-lg hover:bg-[#E85A2A] transition-colors"
          >
            确认分配
          </button>
        </div>
      </div>
    </div>
  );
};

// 分享工单弹框
interface ShareRecord {
  id: string;
  title: string;
  access: string;
  sharedAt: string;
  link: string;
}

const ShareWorkOrderModal: React.FC<{
  code: ActivationCode;
  onClose: () => void;
}> = ({ code, onClose }) => {
  const [title, setTitle] = useState('');
  const [validDays, setValidDays] = useState<number | 'unlimited'>(1);
  const [validHours, setValidHours] = useState(24);
  const [access, setAccess] = useState<'public' | 'password'>('public');
  const [canViewLeads, setCanViewLeads] = useState(true);
  const [leadsDesensitize, setLeadsDesensitize] = useState<'public' | 'hidden'>('public');
  const [canEditNote, setCanEditNote] = useState(true);
  const [remark, setRemark] = useState('');
  const [history] = useState<ShareRecord[]>([]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[560px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl flex flex-col">
        {/* 顶部绿色 banner */}
        <div className="relative bg-gradient-to-r from-green-500 to-green-400 rounded-t-2xl px-8 pt-7 pb-10 overflow-hidden">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white text-center">分享工单详情</h2>
            <p className="text-green-100 text-xs text-center mt-1">配置以下参数，可对分享页面的权限进行控制</p>
          </div>
          {/* 装饰图 */}
          <div className="absolute right-6 bottom-0 opacity-30 text-white text-5xl select-none">🔍</div>
        </div>

        {/* 表单区 */}
        <div className="px-8 py-6 space-y-4 -mt-4 bg-white rounded-t-2xl relative z-10">
          {/* 标题 */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 w-24 text-right flex-shrink-0 whitespace-nowrap">标题</span>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="请填写标题"
              className="flex-1 border border-green-400 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* 有效天数 */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 w-24 text-right flex-shrink-0 whitespace-nowrap">有效天数</span>
            <div className="flex items-center gap-3 flex-nowrap">
              {([1, 3, 7, 30, 'unlimited'] as const).map(d => (
                <label key={String(d)} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    checked={validDays === d}
                    onChange={() => setValidDays(d)}
                    className="accent-green-500"
                  />
                  <span className="text-sm text-gray-700">{d === 'unlimited' ? '无限制' : `${d}天`}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 有效小时数 */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 w-24 text-right flex-shrink-0 whitespace-nowrap">有效小时数</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setValidHours(h => Math.max(1, h - 1))}
                className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <Minus className="w-3.5 h-3.5 text-gray-500" />
              </button>
              <span className="w-12 text-center text-sm font-medium">{validHours}</span>
              <button
                onClick={() => setValidHours(h => h + 1)}
                className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* 访问权限 */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 w-24 text-right flex-shrink-0 whitespace-nowrap">访问权限</span>
            <div className="flex items-center gap-4">
              {(['public', 'password'] as const).map(v => (
                <label key={v} className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" checked={access === v} onChange={() => setAccess(v)} className="accent-green-500" />
                  <span className="text-sm text-gray-700">{v === 'public' ? '公开访问' : '密码访问'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 能否查看线索 */}
          <div className="flex items-start gap-4">
            <span className="text-sm text-gray-600 w-24 text-right flex-shrink-0 whitespace-nowrap pt-0.5">能否查看线索</span>
            <div>
              <div className="flex items-center gap-4">
                {([true, false] as const).map(v => (
                  <label key={String(v)} className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" checked={canViewLeads === v} onChange={() => setCanViewLeads(v)} className="accent-green-500" />
                    <span className="text-sm text-gray-700">{v ? '是' : '否'}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">是否可以查看线索列表</p>
            </div>
          </div>

          {/* 线索脱敏 */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 w-24 text-right flex-shrink-0 whitespace-nowrap">线索脱敏</span>
            <div className="flex items-center gap-4">
              {(['public', 'hidden'] as const).map(v => (
                <label key={v} className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" checked={leadsDesensitize === v} onChange={() => setLeadsDesensitize(v)} className="accent-green-500" />
                  <span className="text-sm text-gray-700">{v === 'public' ? '公开' : '隐藏'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 是否编辑注释 */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 w-24 text-right flex-shrink-0 whitespace-nowrap">是否编辑注释</span>
            <div className="flex items-center gap-4">
              {([true, false] as const).map(v => (
                <label key={String(v)} className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" checked={canEditNote === v} onChange={() => setCanEditNote(v)} className="accent-green-500" />
                  <span className="text-sm text-gray-700">{v ? '是' : '否'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 备注 */}
          <div className="flex items-start gap-4">
            <span className="text-sm text-gray-600 w-24 text-right flex-shrink-0 whitespace-nowrap pt-1">备注</span>
            <div className="flex-1 relative">
              <textarea
                value={remark}
                onChange={e => setRemark(e.target.value.slice(0, 50))}
                placeholder="请输入备注"
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-300 resize-none bg-gray-50"
              />
              <span className="absolute bottom-2 right-2 text-[10px] text-gray-400">{remark.length}/50</span>
            </div>
          </div>

          {/* 分享历史 */}
          <div>
            <p className="text-xs text-gray-500 mb-2">分享历史（仅展示最近分享的3条信息、更多信息请查看所有分享历史）</p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-[1fr_80px_120px_1fr_60px] bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                <span>工单标题</span>
                <span>访问权限</span>
                <span>分享时间</span>
                <span>分享链接</span>
                <span>操作</span>
              </div>
              {history.length === 0 ? (
                <div className="py-8 flex flex-col items-center gap-2 text-gray-400">
                  <Inbox className="w-8 h-8 text-gray-300" />
                  <span className="text-xs">暂无数据</span>
                </div>
              ) : (
                history.map(h => (
                  <div key={h.id} className="grid grid-cols-[1fr_80px_120px_1fr_60px] px-3 py-2 text-xs text-gray-600 border-b border-gray-50 last:border-0">
                    <span className="truncate">{h.title}</span>
                    <span>{h.access}</span>
                    <span>{h.sharedAt}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(h.link)}
                      className="flex items-center gap-1 text-green-500 hover:text-green-600 truncate"
                    >
                      <Copy className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{h.link}</span>
                    </button>
                    <button className="text-red-400 hover:text-red-500">删除</button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                // TODO: 生成分享链接
                onClose();
              }}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              生成分享链接
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 激活码行内联操作按钮
const CodeActionButtons: React.FC<{
  code: ActivationCode;
  onToggle: (id: string) => void;
  onEdit: (code: ActivationCode) => void;
  onAssignDept: (code: ActivationCode) => void;
  onAssignAccount: (code: ActivationCode) => void;
  onUnbind: (code: ActivationCode) => void;
  onDisableConfirm: (code: ActivationCode) => void;
  onCopy: (code: ActivationCode) => void;
  onShare: (code: ActivationCode) => void;
}> = ({ code, onToggle, onEdit, onAssignDept, onAssignAccount, onUnbind, onDisableConfirm, onCopy, onShare }) => {
  const hasDepartment = !!code.departmentId;
  const hasAssignedAccounts = !!code.assignedTo;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onShare(code)}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded-md transition-colors whitespace-nowrap"
        title="分享工单"
      >
        <Share2 className="w-3.5 h-3.5" />
        分享
      </button>
      <button
        onClick={() => onCopy(code)}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-[#FF6B35] hover:bg-[#FF6B35]/10 rounded-md transition-colors whitespace-nowrap"
        title="复制激活码"
      >
        <Key className="w-3.5 h-3.5" />
        复制
      </button>
      <button
        onClick={() => onAssignDept(code)}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-[#FF6B35] hover:bg-[#FF6B35]/10 rounded-md transition-colors whitespace-nowrap"
        title="分配部门"
      >
        <FolderTree className="w-3.5 h-3.5" />
        分配部门
      </button>
      <button
        onClick={() => hasDepartment && onAssignAccount(code)}
        disabled={!hasDepartment}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors whitespace-nowrap",
          hasDepartment
            ? "text-[#FF6B35] hover:bg-[#FF6B35]/10 cursor-pointer"
            : "text-gray-400 cursor-not-allowed opacity-50"
        )}
        title={hasDepartment ? "分配账号" : "请先分配部门"}
      >
        <UserPlus className="w-3.5 h-3.5" />
        分配账号
      </button>
      <button
        onClick={() => onEdit(code)}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-[#FF6B35] hover:bg-[#FF6B35]/10 rounded-md transition-colors whitespace-nowrap"
        title="编辑"
      >
        <Edit3 className="w-3.5 h-3.5" />
        编辑
      </button>
      <button
        onClick={() => hasAssignedAccounts && onUnbind(code)}
        disabled={!hasAssignedAccounts}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors whitespace-nowrap",
          hasAssignedAccounts
            ? "text-[#FF6B35] hover:bg-[#FF6B35]/10 cursor-pointer"
            : "text-gray-400 cursor-not-allowed opacity-50"
        )}
        title={hasAssignedAccounts ? "解绑" : "暂无已分配账号"}
      >
        <Unlink className="w-3.5 h-3.5" />
        解绑
      </button>
    {(code.status === 'active' || code.status === 'disabled') && (
      <button
        onClick={() => {
          if (code.status === 'active') {
            onDisableConfirm(code);
          } else {
            onToggle(code.id);
          }
        }}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-[#FF6B35] hover:bg-[#FF6B35]/10 rounded-md transition-colors whitespace-nowrap"
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
};

// AI配额配置弹窗
const AIQuotaModal: React.FC<{
  code: ActivationCode;
  onClose: () => void;
  onSave: (updates: Partial<ActivationCode>) => void;
}> = ({ code, onClose, onSave }) => {
  const [seatLimit, setSeatLimit] = useState(code.aiSeatLimit ?? 0);
  const handleSave = () => {
    onSave({
      aiAllocationMode: 'fixed',
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCode, setEditingCode] = useState<ActivationCode | null>(null);
  const [showAssignDeptModal, setShowAssignDeptModal] = useState(false);
  const [assigningCode, setAssigningCode] = useState<ActivationCode | null>(null);
  const [showAssignAccountModal, setShowAssignAccountModal] = useState(false);
  const [assigningCodeForAccount, setAssigningCodeForAccount] = useState<ActivationCode | null>(null);
  const [showUnbindModal, setShowUnbindModal] = useState(false);
  const [unbindingCode, setUnbindingCode] = useState<ActivationCode | null>(null);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [disablingCode, setDisablingCode] = useState<ActivationCode | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharingCode, setSharingCode] = useState<ActivationCode | null>(null);
  const [showDeptConflict, setShowDeptConflict] = useState(false);
  const [conflictDeptInfo, setConflictDeptInfo] = useState<{ code: ActivationCode; deptId: string; deptName: string } | null>(null);

  const organization = useStore((state) => state.organization);
  const departments = useStore((state) => state.departments);
  const selectedDepartmentId = useStore((state) => state.selectedDepartmentId);
  const setSelectedDepartment = useStore((state) => state.setSelectedDepartment);
  const getFilteredActivationCodes = useStore((state) => state.getFilteredActivationCodes);
  const toggleActivationCodeStatus = useStore((state) => state.toggleActivationCodeStatus);
  const updateActivationCode = useStore((state) => state.updateActivationCode);
  const setOrganizationLoginMode = useStore((state) => state.setOrganizationLoginMode);

  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [showBatchMenu, setShowBatchMenu] = useState(false);

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
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: '全部', value: stats.total, color: 'text-gray-900', bg: 'bg-white', filter: 'all' as const },
                { label: '已启用', value: stats.active, color: 'text-green-600', bg: 'bg-green-50', filter: 'active' as const },
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
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-white bg-[#FF6B35] hover:bg-[#E85A2A] rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                生成激活码
              </button>
              <div className="relative">
                <button
                  onClick={() => selectedCodes.length > 0 && setShowBatchMenu(!showBatchMenu)}
                  disabled={selectedCodes.length === 0}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors",
                    selectedCodes.length > 0
                      ? "text-white bg-[#FF6B35] hover:bg-[#FF6B35]/90 cursor-pointer"
                      : "text-gray-400 bg-gray-100 cursor-not-allowed"
                  )}
                >
                  批量操作 {selectedCodes.length > 0 && `(${selectedCodes.length})`}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showBatchMenu && selectedCodes.length > 0 && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowBatchMenu(false)} />
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <button
                          onClick={() => {
                            const codes = filteredCodes.filter(c => selectedCodes.includes(c.id)).map(c => c.code).join('\n');
                            navigator.clipboard.writeText(codes);
                            setShowBatchMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          复制激活码
                        </button>
                        <button
                          onClick={() => {
                            selectedCodes.forEach(id => toggleActivationCodeStatus(id));
                            setSelectedCodes([]);
                            setShowBatchMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          批量启用
                        </button>
                        <button
                          onClick={() => {
                            selectedCodes.forEach(id => toggleActivationCodeStatus(id));
                            setSelectedCodes([]);
                            setShowBatchMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          批量停用
                        </button>
                        <button
                          onClick={() => {
                            setShowBatchMenu(false);
                            setAssigningCode(filteredCodes.find(c => selectedCodes.includes(c.id)) || null);
                            setShowAssignDeptModal(true);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          分配到部门
                        </button>
                        <button
                          onClick={() => {
                            setShowBatchMenu(false);
                            setAssigningCodeForAccount(filteredCodes.find(c => selectedCodes.includes(c.id)) || null);
                            setShowAssignAccountModal(true);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          分配到账号
                        </button>
                      </div>
                    </>
                  )}
                </div>
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
                <table className="w-full min-w-max">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap w-12">
                        <input
                          type="checkbox"
                          checked={selectedCodes.length === filteredCodes.length && filteredCodes.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCodes(filteredCodes.map(c => c.id));
                            } else {
                              setSelectedCodes([]);
                            }
                          }}
                          className="w-4 h-4 text-[#FF6B35] border-gray-300 rounded focus:ring-[#FF6B35]"
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">激活码</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">所属部门</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">使用人</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">角色</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">状态</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">最近登录</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">社交平台</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">在线端口</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">分配端口</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">多设备登录</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">聊天备份</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">AI配额</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">创建时间</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">到期时间</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">已分配账号</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">备注</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCodes.map((code) => (
                      <tr key={code.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedCodes.includes(code.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCodes([...selectedCodes, code.id]);
                              } else {
                                setSelectedCodes(selectedCodes.filter(id => id !== code.id));
                              }
                            }}
                            className="w-4 h-4 text-[#FF6B35] border-gray-300 rounded focus:ring-[#FF6B35]"
                          />
                        </td>
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
                        <td className="py-3 px-4 text-sm text-gray-500">{formatDate(code.lastLoginAt)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-0.5">
                            {code.platforms && code.platforms.length > 0 ? (
                              <>
                                {code.platforms.slice(0, 8).map((platformId, idx) => {
                                  const config = PLATFORM_CONFIG[platformId];
                                  if (!config) return null;
                                  return (
                                    <div
                                      key={idx}
                                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                                      style={{ backgroundColor: config.color }}
                                      title={platformId}
                                    >
                                      {config.label}
                                    </div>
                                  );
                                })}
                                <span className="text-xs text-gray-400 ml-1">
                                  {code.platforms.length}/{code.platforms.length}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{code.onlinePorts ?? 0}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{code.allocatedPorts ?? 0}</td>
                        <td className="py-3 px-4">
                          <ToggleSwitch
                            checked={code.multiDevice ?? false}
                            onChange={() => updateActivationCode(code.id, { multiDevice: !code.multiDevice })}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <ToggleSwitch
                            checked={code.chatBackup ?? false}
                            onChange={() => updateActivationCode(code.id, { chatBackup: !code.chatBackup })}
                          />
                        </td>
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
                        <td className="py-3 px-4">
                          {code.assignedTo ? (
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm text-gray-900">{code.assignedTo}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">未分配</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500 max-w-[120px] truncate">{code.remark || '-'}</td>
                        <td className="py-3 px-4">
                          <CodeActionButtons
                            code={code}
                            onToggle={toggleActivationCodeStatus}
                            onEdit={(code) => {
                              setEditingCode(code);
                              setShowEditModal(true);
                            }}
                            onCopy={(code) => {
                              // 复制激活码配置，创建新的激活码
                              const newCode = {
                                ...code,
                                id: `code-${Date.now()}`,
                                code: `COPY-${code.code}`,
                                status: 'active' as const,
                                assignedTo: undefined,
                                createdAt: new Date().toISOString(),
                              };
                              // TODO: 调用 store 的添加激活码方法
                              console.log('复制激活码:', newCode);
                            }}
                            onAssignDept={(code) => {
                              setAssigningCode(code);
                              setShowAssignDeptModal(true);
                            }}
                            onAssignAccount={(code) => {
                              setAssigningCodeForAccount(code);
                              setShowAssignAccountModal(true);
                            }}
                            onUnbind={(code) => {
                              setUnbindingCode(code);
                              setShowUnbindModal(true);
                            }}
                            onDisableConfirm={(code) => {
                              setDisablingCode(code);
                              setShowDisableConfirm(true);
                            }}
                            onShare={(code) => {
                              setSharingCode(code);
                              setShowShareModal(true);
                            }}
                          />
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

      {/* 新建激活码弹窗 */}
      {showCreateModal && (
        <CreateActivationCodeModal
          onClose={() => setShowCreateModal(false)}
          onSave={(data) => {
            console.log('创建激活码:', data);
            setShowCreateModal(false);
          }}
        />
      )}

      {/* 编辑激活码弹窗 */}
      {showEditModal && editingCode && (
        <CreateActivationCodeModal
          initialData={editingCode}
          onClose={() => {
            setShowEditModal(false);
            setEditingCode(null);
          }}
          onSave={(data) => {
            console.log('编辑激活码:', editingCode.id, data);
            setShowEditModal(false);
            setEditingCode(null);
          }}
        />
      )}

      {/* 分配部门弹框 */}
      {showAssignDeptModal && assigningCode && (
        <AssignDepartmentModal
          code={assigningCode}
          departments={departments}
          onClose={() => {
            setShowAssignDeptModal(false);
            setAssigningCode(null);
          }}
          onConfirm={(deptId) => {
            const findDept = (depts: Department[], id: string): Department | null => {
              for (const dept of depts) {
                if (dept.id === id) return dept;
                if (dept.children) {
                  const found = findDept(dept.children, id);
                  if (found) return found;
                }
              }
              return null;
            };
            const dept = findDept(departments, deptId);
            if (dept) {
              // 检查是否有冲突：已有部门、已分配账号、且要分配到不同部门
              const hasConflict = assigningCode.departmentId &&
                                  assigningCode.assignedTo &&
                                  deptId !== assigningCode.departmentId;

              if (hasConflict) {
                // 显示冲突提示
                setConflictDeptInfo({
                  code: assigningCode,
                  deptId: dept.id,
                  deptName: dept.name
                });
                setShowDeptConflict(true);
                setShowAssignDeptModal(false);
              } else {
                // 直接分配
                updateActivationCode(assigningCode.id, {
                  departmentId: dept.id,
                  departmentName: dept.name
                });
                setShowAssignDeptModal(false);
                setAssigningCode(null);
              }
            }
          }}
        />
      )}

      {/* 分配账号弹框 */}
      {showAssignAccountModal && assigningCodeForAccount && (
        <AssignAccountModal
          code={assigningCodeForAccount}
          onClose={() => {
            setShowAssignAccountModal(false);
            setAssigningCodeForAccount(null);
          }}
          onConfirm={(accountIds) => {
            console.log('分配账号:', assigningCodeForAccount.id, accountIds);
            updateActivationCode(assigningCodeForAccount.id, {
              assignedTo: accountIds.join(',')
            });
            setShowAssignAccountModal(false);
            setAssigningCodeForAccount(null);
          }}
        />
      )}

      {/* 解绑账号弹框 */}
      {showUnbindModal && unbindingCode && (
        <UnbindAccountModal
          code={unbindingCode}
          onClose={() => {
            setShowUnbindModal(false);
            setUnbindingCode(null);
          }}
          onConfirm={(accountIds) => {
            console.log('解绑账号:', unbindingCode.id, accountIds);
            setShowUnbindModal(false);
            setUnbindingCode(null);
          }}
        />
      )}

      {/* 禁用激活码确认弹框 */}
      {showDisableConfirm && disablingCode && (
        <DisableConfirmModal
          code={disablingCode}
          onClose={() => {
            setShowDisableConfirm(false);
            setDisablingCode(null);
          }}
          onConfirm={() => {
            toggleActivationCodeStatus(disablingCode.id);
            setShowDisableConfirm(false);
            setDisablingCode(null);
          }}
        />
      )}

      {/* 部门冲突提示弹框 */}
      {showDeptConflict && conflictDeptInfo && (
        <DepartmentConflictModal
          code={conflictDeptInfo.code}
          newDeptName={conflictDeptInfo.deptName}
          onClose={() => {
            setShowDeptConflict(false);
            setConflictDeptInfo(null);
            setAssigningCode(null);
          }}
          onConfirm={() => {
            // 执行部门分配（实际应该还要解绑账号，但这需要后端支持）
            updateActivationCode(conflictDeptInfo.code.id, {
              departmentId: conflictDeptInfo.deptId,
              departmentName: conflictDeptInfo.deptName,
              assignedTo: '' // 清空已分配账号
            });
            setShowDeptConflict(false);
            setConflictDeptInfo(null);
            setAssigningCode(null);
          }}
        />
      )}

      {/* 分享工单弹框 */}
      {showShareModal && sharingCode && (
        <ShareWorkOrderModal
          code={sharingCode}
          onClose={() => {
            setShowShareModal(false);
            setSharingCode(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminCenter;
