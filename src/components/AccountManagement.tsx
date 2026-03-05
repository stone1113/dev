import React, { useState } from 'react';
import { Search, Plus, Edit3, Lock, X, ChevronRight, ChevronDown, Ban, AlertCircle, Trash2, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Account {
  id: string;
  username: string;
  name: string;
  status: 'active' | 'inactive';
  department: string;
  role: string;
  createdAt: Date;
}

// 部门角色层级选择器
const DepartmentRoleSelector: React.FC<{
  value: string;
  onChange: (value: string, label: string) => void;
  onClose: () => void;
}> = ({ value, onChange, onClose }) => {
  const [expandedDepts, setExpandedDepts] = useState<string[]>([]);

  const departments = [
    {
      id: 'sales',
      name: '销售部',
      roles: [
        { id: 'sales-manager', name: '销售主管' },
        { id: 'sales-staff', name: '销售专员' },
      ],
    },
    {
      id: 'service',
      name: '客服部',
      roles: [
        { id: 'service-manager', name: '客服主管' },
        { id: 'service-staff', name: '客服专员' },
      ],
    },
  ];

  const toggleDept = (deptId: string) => {
    setExpandedDepts(prev =>
      prev.includes(deptId) ? prev.filter(id => id !== deptId) : [...prev, deptId]
    );
  };

  const handleSelect = (roleId: string, deptName: string, roleName: string) => {
    onChange(roleId, `${deptName} - ${roleName}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-80 max-h-96 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">选择部门/角色</h3>
        </div>
        <div className="overflow-y-auto max-h-80">
          {departments.map(dept => (
            <div key={dept.id}>
              <div
                onClick={() => toggleDept(dept.id)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                {expandedDepts.includes(dept.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm text-gray-700">{dept.name}</span>
              </div>
              {expandedDepts.includes(dept.id) && (
                <div className="bg-gray-50">
                  {dept.roles.map(role => (
                    <div
                      key={role.id}
                      onClick={() => handleSelect(role.id, dept.name, role.name)}
                      className={cn(
                        "pl-10 pr-4 py-2 text-sm cursor-pointer hover:bg-gray-100",
                        value === role.id ? "text-[#FF6B35] bg-[#FF6B35]/5" : "text-gray-600"
                      )}
                    >
                      {role.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 新建账号弹框
const CreateAccountModal: React.FC<{
  onClose: () => void;
  onConfirm: (data: { username: string; name: string; password: string; departmentRole: string }) => void;
}> = ({ onClose, onConfirm }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [departmentRole, setDepartmentRole] = useState('');
  const [departmentRoleLabel, setDepartmentRoleLabel] = useState('');
  const [showDeptSelector, setShowDeptSelector] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateUsername = (value: string) => {
    if (!value.trim()) return '请输入账号';
    if (!/^[a-zA-Z]+$/.test(value)) return '账号只能包含英文字母';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) return '请输入密码';
    if (value.length < 8) return '密码至少8位';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return '密码必须包含大小写字母和数字';
    return '';
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    const usernameError = validateUsername(username);
    if (usernameError) newErrors.username = usernameError;

    if (!name.trim()) newErrors.name = '请输入姓名';

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (!confirmPassword) {
      newErrors.confirmPassword = '请再次输入密码';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    if (!departmentRole) newErrors.departmentRole = '请选择所属部门/角色';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onConfirm({ username, name, password, departmentRole });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">新建账号</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              <span className="text-red-500">* </span>账号
            </label>
            <input
              type="text"
              placeholder="请输入账号"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors(prev => ({ ...prev, username: '' }));
              }}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
            />
            {errors.username ? (
              <p className="mt-1 text-xs text-red-500">{errors.username}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-400">仅支持英文字母</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              <span className="text-red-500">* </span>姓名
            </label>
            <input
              type="text"
              placeholder="请输入姓名"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors(prev => ({ ...prev, name: '' }));
              }}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              <span className="text-red-500">* </span>密码
            </label>
            <input
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors(prev => ({ ...prev, password: '' }));
              }}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-400">至少8位，需包含大小写字母和数字</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              <span className="text-red-500">* </span>确认密码
            </label>
            <input
              type="password"
              placeholder="请再次输入密码"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
              }}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              <span className="text-red-500">* </span>所属部门/角色
            </label>
            <input
              type="text"
              readOnly
              placeholder="请选择所属部门/角色"
              value={departmentRoleLabel}
              onClick={() => setShowDeptSelector(true)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 cursor-pointer"
            />
            {errors.departmentRole ? (
              <p className="mt-1 text-xs text-red-500">{errors.departmentRole}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-400">点击选择所属部门和角色</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#E85A2A] rounded-lg transition-colors"
          >
            确定
          </button>
        </div>
      </div>

      {/* 部门角色选择器 */}
      {showDeptSelector && (
        <DepartmentRoleSelector
          value={departmentRole}
          onChange={(value, label) => {
            setDepartmentRole(value);
            setDepartmentRoleLabel(label);
            setErrors(prev => ({ ...prev, departmentRole: '' }));
          }}
          onClose={() => setShowDeptSelector(false)}
        />
      )}
    </div>
  );
};

// 编辑账号弹框
const EditAccountModal: React.FC<{
  account: Account;
  onClose: () => void;
  onConfirm: (data: { name: string; departmentRole: string; status: 'active' | 'inactive' }) => void;
}> = ({ account, onClose, onConfirm }) => {
  const [name, setName] = useState(account.name);
  const [departmentRole, setDepartmentRole] = useState('');
  const [departmentRoleLabel, setDepartmentRoleLabel] = useState(`${account.department} - ${account.role}`);
  const [status, setStatus] = useState(account.status);
  const [showDeptSelector, setShowDeptSelector] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = '请输入姓名';
    if (!departmentRole) newErrors.departmentRole = '请选择所属部门/角色';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onConfirm({ name, departmentRole, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">编辑账号</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">账号</label>
            <input
              type="text"
              value={account.username}
              readOnly
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              <span className="text-red-500">* </span>姓名
            </label>
            <input
              type="text"
              placeholder="请输入姓名"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors(prev => ({ ...prev, name: '' }));
              }}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              <span className="text-red-500">* </span>所属部门/角色
            </label>
            <input
              type="text"
              readOnly
              placeholder="请选择所属部门/角色"
              value={departmentRoleLabel}
              onClick={() => setShowDeptSelector(true)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 cursor-pointer"
            />
            {errors.departmentRole && <p className="mt-1 text-xs text-red-500">{errors.departmentRole}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">账号状态</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 bg-white"
            >
              <option value="active">已启用</option>
              <option value="inactive">已停用</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#E85A2A] rounded-lg transition-colors"
          >
            确定
          </button>
        </div>
      </div>

      {showDeptSelector && (
        <DepartmentRoleSelector
          value={departmentRole}
          onChange={(value, label) => {
            setDepartmentRole(value);
            setDepartmentRoleLabel(label);
            setErrors(prev => ({ ...prev, departmentRole: '' }));
          }}
          onClose={() => setShowDeptSelector(false)}
        />
      )}
    </div>
  );
};

// 重置密码弹框
const ResetPasswordModal: React.FC<{
  username: string;
  onClose: () => void;
  onConfirm: (password: string) => void;
}> = ({ username, onClose, onConfirm }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePassword = (value: string) => {
    if (!value) return '请输入密码';
    if (value.length < 8) return '密码至少8位';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return '密码必须包含大小写字母和数字';
    return '';
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (!confirmPassword) {
      newErrors.confirmPassword = '请再次输入密码';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onConfirm(password);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">重置密码</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">账号</label>
            <input
              type="text"
              value={username}
              readOnly
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              <span className="text-red-500">* </span>新密码
            </label>
            <input
              type="password"
              placeholder="请输入新密码"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors(prev => ({ ...prev, password: '' }));
              }}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-400">至少8位，需包含大小写字母和数字</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              <span className="text-red-500">* </span>确认密码
            </label>
            <input
              type="password"
              placeholder="请再次输入密码"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
              }}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#E85A2A] rounded-lg transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

// 禁用账号确认弹框
const DisableAccountModal: React.FC<{
  username: string;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ username, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">提示</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm text-gray-700">
                禁用账号后会无法登录管理端，确定要禁用该账号吗？
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#E85A2A] rounded-lg transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

// 删除账号确认弹框
const DeleteAccountModal: React.FC<{
  username: string;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ username, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">删除账号</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm text-gray-700">删除后，该账号将无法登录。</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#E85A2A] rounded-lg transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
};

interface AccountManagementProps {
  filterRoleId?: string | null;
  onClearFilter?: () => void;
}

export const AccountManagement: React.FC<AccountManagementProps> = ({ filterRoleId, onClearFilter }) => {
  const [accounts] = useState<Account[]>([
    {
      id: '1',
      username: 'test',
      name: '测试用户',
      status: 'active',
      department: '金牌销售小组',
      role: '金牌销售主管',
      createdAt: new Date('2026-01-26T10:05:50'),
    },
  ]);

  const [filters, setFilters] = useState({
    username: '',
    name: '',
    status: '',
    department: '',
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [showBatchMenu, setShowBatchMenu] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAccountIds(accounts.map(acc => acc.id));
    } else {
      setSelectedAccountIds([]);
    }
  };

  const handleSelectAccount = (accountId: string, checked: boolean) => {
    if (checked) {
      setSelectedAccountIds(prev => [...prev, accountId]);
    } else {
      setSelectedAccountIds(prev => prev.filter(id => id !== accountId));
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="h-full flex flex-col p-6 bg-gray-50">
      {/* 角色筛选提示 */}
      {filterRoleId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-900">正在显示角色"滚滚滚"的已分配账号</span>
          </div>
          <button
            onClick={onClearFilter}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            清除筛选
          </button>
        </div>
      )}
      {/* 筛选区域 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">账号</label>
            <input
              type="text"
              placeholder="请输入账号查询"
              value={filters.username}
              onChange={(e) => setFilters({ ...filters, username: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">姓名</label>
            <input
              type="text"
              placeholder="请输入姓名查询"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">账号状态</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className={cn(
                "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 bg-white",
                !filters.status && "text-gray-400"
              )}
            >
              <option value="">请选择账号状态</option>
              <option value="active" className="text-gray-900">已启用</option>
              <option value="inactive" className="text-gray-900">已停用</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">所属部门</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className={cn(
                "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 bg-white",
                !filters.department && "text-gray-400"
              )}
            >
              <option value="">请选择所属部门</option>
              <option value="sales" className="text-gray-900">销售部</option>
              <option value="service" className="text-gray-900">客服部</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm text-white bg-[#FF6B35] hover:bg-[#ff5722] rounded-lg transition-colors flex items-center gap-2">
            <Search className="w-4 h-4" />
            查询
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">
            重置
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="ml-auto px-4 py-2 text-sm text-white bg-[#FF6B35] hover:bg-[#ff5722] rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新建账号
          </button>
        </div>
      </div>

      {/* 表格区域 */}
      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setShowBatchMenu(!showBatchMenu)}
              className={cn(
                "flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition-colors",
                selectedAccountIds.length > 0
                  ? "text-[#FF6B35] border border-[#FF6B35]/30 hover:bg-[#FF6B35]/10"
                  : "text-gray-400 border border-gray-200 cursor-not-allowed"
              )}
              disabled={selectedAccountIds.length === 0}
            >
              批量操作
              <ChevronDown className="w-4 h-4" />
            </button>
            {showBatchMenu && selectedAccountIds.length > 0 && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowBatchMenu(false)} />
                <div className="absolute left-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                  <button
                    onClick={() => {
                      console.log('批量启用', selectedAccountIds);
                      setShowBatchMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    批量启用
                  </button>
                  <button
                    onClick={() => {
                      console.log('批量停用', selectedAccountIds);
                      setShowBatchMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    批量停用
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedAccountIds.length === accounts.length && accounts.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">账号</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">姓名</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">账号状态</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">部门</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">角色</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">创建时间</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedAccountIds.includes(account.id)}
                      onChange={(e) => handleSelectAccount(account.id, e.target.checked)}
                    />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{account.username}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{account.name}</td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "px-2 py-0.5 text-xs font-medium rounded-full",
                      account.status === 'active' ? "bg-cyan-50 text-cyan-600" : "bg-gray-100 text-gray-500"
                    )}>
                      {account.status === 'active' ? '已启用' : '已停用'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{account.department}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{account.role}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{formatDateTime(account.createdAt)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowEditModal(true);
                        }}
                        className="p-1.5 text-[#FF6B35] hover:bg-[#FF6B35]/10 rounded transition-colors"
                        title="编辑"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowResetPasswordModal(true);
                        }}
                        className="p-1.5 text-[#FF6B35] hover:bg-[#FF6B35]/10 rounded transition-colors"
                        title="重置密码"
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowDisableModal(true);
                        }}
                        className="p-1.5 text-[#FF6B35] hover:bg-[#FF6B35]/10 rounded transition-colors"
                        title="禁用"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowDeleteModal(true);
                        }}
                        className="p-1.5 text-[#FF6B35] hover:bg-[#FF6B35]/10 rounded transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 新建账号弹框 */}
      {showCreateModal && (
        <CreateAccountModal
          onClose={() => setShowCreateModal(false)}
          onConfirm={(data) => {
            console.log('创建账号:', data);
            // TODO: 实际创建账号逻辑
          }}
        />
      )}

      {/* 编辑账号弹框 */}
      {showEditModal && selectedAccount && (
        <EditAccountModal
          account={selectedAccount}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAccount(null);
          }}
          onConfirm={(data) => {
            console.log('编辑账号:', selectedAccount.username, data);
            // TODO: 实际编辑账号逻辑
          }}
        />
      )}

      {/* 重置密码弹框 */}
      {showResetPasswordModal && selectedAccount && (
        <ResetPasswordModal
          username={selectedAccount.username}
          onClose={() => {
            setShowResetPasswordModal(false);
            setSelectedAccount(null);
          }}
          onConfirm={(password) => {
            console.log('重置密码:', selectedAccount.username, password);
            // TODO: 实际重置密码逻辑
          }}
        />
      )}

      {/* 禁用账号确认弹框 */}
      {showDisableModal && selectedAccount && (
        <DisableAccountModal
          username={selectedAccount.username}
          onClose={() => {
            setShowDisableModal(false);
            setSelectedAccount(null);
          }}
          onConfirm={() => {
            console.log('禁用账号:', selectedAccount.username);
            // TODO: 实际禁用账号逻辑
          }}
        />
      )}

      {/* 删除账号确认弹框 */}
      {showDeleteModal && selectedAccount && (
        <DeleteAccountModal
          username={selectedAccount.username}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedAccount(null);
          }}
          onConfirm={() => {
            console.log('删除账号:', selectedAccount.username);
            // TODO: 实际删除账号逻辑
          }}
        />
      )}
    </div>
  );
};

export default AccountManagement;
