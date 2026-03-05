import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Edit3,
  Trash2,
  MoreVertical,
  FolderPlus,
  AlertCircle,
  X,
  Ban,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import type { Department } from '@/types';

// 角色数据类型
interface Role {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  assignedCount: number;
  createdAt: Date;
  departmentId?: string;
}

// 部门操作菜单
const DepartmentMenu: React.FC<{
  dept: Department;
  onAddChild: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}> = ({ onAddChild, onEdit, onDelete, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-8 z-50 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
    >
      <button
        onClick={onAddChild}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <FolderPlus className="w-4 h-4" />
        添加子部门
      </button>
      <button
        onClick={onEdit}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <Edit3 className="w-4 h-4" />
        编辑
      </button>
      <button
        onClick={onDelete}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
        删除
      </button>
    </div>
  );
};

// 删除失败提示弹框
const DeleteFailModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">删除失败</h3>
          <p className="text-sm text-gray-600">
            删除部门需保证该部门和其子部门没有所属账号，否则将无法删除！
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          我知道了
        </button>
      </div>
    </div>
  </div>
);

// 部门表单弹框
const DepartmentFormModal: React.FC<{
  title: string;
  initialData?: { name: string; remark: string };
  onSave: (data: { name: string; remark: string }) => void;
  onClose: () => void;
}> = ({ title, initialData, onSave, onClose }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [remark, setRemark] = useState(initialData?.remark || '');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), remark: remark.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          {/* 部门名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">* </span>部门名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              placeholder="请输入入部门名称"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
            />
            <div className="text-xs text-gray-400 text-right mt-1">
              {name.length} / 20
            </div>
          </div>

          {/* 备注 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value.slice(0, 200))}
              placeholder="请输入入备注"
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 resize-none"
            />
            <div className="text-xs text-gray-400 text-right mt-1">
              {remark.length} / 200
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#ff5722] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

// 权限树数据类型
interface PermissionNode {
  id: string;
  label: string;
  children?: PermissionNode[];
  actions?: string[];
}

// 权限选择弹框
const PermissionSelectorModal: React.FC<{
  onConfirm: (selected: string) => void;
  onClose: () => void;
}> = ({ onConfirm, onClose }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '1-1']));
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());

  const permissionTree: PermissionNode[] = [
    {
      id: '1',
      label: '控制中心',
      children: [
        {
          id: '1-1',
          label: '系统设置',
          children: [
            { id: '1-1-1', label: '缓存管理', actions: ['修改', '新增', '列表', '详情', '删除', '管理'] },
            { id: '1-1-2', label: '数据源管理', actions: ['修改', '新增', '列表', '详情', '删除'] },
            { id: '1-1-3', label: '字典管理', actions: ['修改', '新增', '列表', '详情', '删除'] },
            { id: '1-1-4', label: '域名管理', actions: ['修改', '新增', '列表', '删除', '详情'] },
            { id: '1-1-5', label: '国际化管理', actions: ['修改', '新增', '列表', '详情', '删除'] },
          ],
        },
      ],
    },
  ];

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // 获取节点的所有子节点ID和操作
  const getAllChildrenAndActions = (node: PermissionNode): { nodeIds: string[]; actionKeys: string[] } => {
    const nodeIds: string[] = [];
    const actionKeys: string[] = [];

    const traverse = (n: PermissionNode) => {
      if (n.actions) {
        n.actions.forEach(action => {
          actionKeys.push(`${n.id}-${action}`);
        });
      }
      if (n.children) {
        n.children.forEach(child => {
          nodeIds.push(child.id);
          traverse(child);
        });
      }
    };

    traverse(node);
    return { nodeIds, actionKeys };
  };

  // 切换节点选中状态
  const toggleNodeSelection = (node: PermissionNode) => {
    const { nodeIds, actionKeys } = getAllChildrenAndActions(node);
    const isCurrentlySelected = selectedNodes.has(node.id);

    setSelectedNodes(prev => {
      const next = new Set(prev);
      if (isCurrentlySelected) {
        next.delete(node.id);
        nodeIds.forEach(id => next.delete(id));
      } else {
        next.add(node.id);
        nodeIds.forEach(id => next.add(id));
      }
      return next;
    });

    setSelectedActions(prev => {
      const next = new Set(prev);
      if (isCurrentlySelected) {
        actionKeys.forEach(key => next.delete(key));
      } else {
        actionKeys.forEach(key => next.add(key));
      }
      return next;
    });
  };

  const toggleAction = (actionKey: string) => {
    setSelectedActions(prev => {
      const next = new Set(prev);
      if (next.has(actionKey)) {
        next.delete(actionKey);
      } else {
        next.add(actionKey);
      }
      return next;
    });
  };

  const renderNode = (node: PermissionNode, level: number) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNodes.has(node.id);

    return (
      <div key={node.id}>
        <div className="flex items-center gap-2 py-2" style={{ paddingLeft: `${level * 20}px` }}>
          {hasChildren && (
            <button onClick={() => toggleExpand(node.id)} className="p-0.5">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
          )}
          {!hasChildren && !node.actions && <span className="w-5" />}
          <input
            type="checkbox"
            className="rounded"
            checked={isSelected}
            onChange={() => toggleNodeSelection(node)}
          />
          <span className="text-sm text-gray-700">{node.label}</span>
        </div>
        {node.actions && (
          <div className="flex flex-wrap gap-2 py-2" style={{ paddingLeft: `${(level + 1) * 20 + 24}px` }}>
            {node.actions.map((action) => {
              const actionKey = `${node.id}-${action}`;
              const isActionSelected = selectedActions.has(actionKey);
              return (
                <label key={action} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={isActionSelected}
                    onChange={() => toggleAction(actionKey)}
                  />
                  <span className="text-sm text-gray-600">{action}</span>
                </label>
              );
            })}
          </div>
        )}
        {isExpanded && hasChildren && (
          <div>
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">选择权限</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {permissionTree.map((node) => renderNode(node, 0))}
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            取消
          </button>
          <button
            onClick={() => {
              onConfirm('已选择权限');
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#ff5722] rounded-lg"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

// 角色表单弹框
const RoleFormModal: React.FC<{
  title: string;
  initialData?: { name: string; permissions: string; dataPermission: string };
  onSave: (data: { name: string; permissions: string; dataPermission: string }) => void;
  onClose: () => void;
}> = ({ title, initialData, onSave, onClose }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [permissions, setPermissions] = useState(initialData?.permissions || '');
  const [dataPermission, setDataPermission] = useState(initialData?.dataPermission || '');
  const [showPermissionSelector, setShowPermissionSelector] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !permissions.trim()) return;
    onSave({ name: name.trim(), permissions: permissions.trim(), dataPermission });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          {/* 角色名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">* </span>角色名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              placeholder="请输入入角色名称"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
            />
            <div className="text-xs text-gray-400 text-right mt-1">
              {name.length} / 20
            </div>
          </div>

          {/* 分配权限 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">* </span>分配权限
            </label>
            <div className="relative">
              <input
                type="text"
                value={permissions}
                readOnly
                onClick={() => setShowPermissionSelector(true)}
                placeholder="点击选择权限"
                className="w-full px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 cursor-pointer"
              />
              {permissions && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPermissions('');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* 数据权限 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">数据权限</label>
            <select
              value={dataPermission}
              onChange={(e) => setDataPermission(e.target.value)}
              className={cn(
                "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 bg-white",
                !dataPermission && "text-gray-400"
              )}
            >
              <option value="">请选择数据权限</option>
              <option value="self">仅本人</option>
              <option value="department">本部门及下级部门</option>
              <option value="all">全部门</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !permissions.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#ff5722] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            确定
          </button>
        </div>
      </div>

      {/* 权限选择弹框 */}
      {showPermissionSelector && (
        <PermissionSelectorModal
          onConfirm={(selected) => setPermissions(selected)}
          onClose={() => setShowPermissionSelector(false)}
        />
      )}
    </div>
  );
};

// 通用确认弹框
const ConfirmModal: React.FC<{
  icon: React.ReactNode;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ icon, title, message, confirmText, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          取消
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);

// 部门树节点组件
const DepartmentTreeNode: React.FC<{
  dept: Department;
  level: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onShowDeleteFail: () => void;
  onAddChild: (parentId: string) => void;
  onEdit: (deptId: string) => void;
}> = ({ dept, level, selectedId, onSelect, onShowDeleteFail, onAddChild, onEdit }) => {
  const [expanded, setExpanded] = useState(level < 2);
  const [showMenu, setShowMenu] = useState(false);
  const hasChildren = dept.children && dept.children.length > 0;
  const isSelected = selectedId === dept.id;

  // 检查部门及其子孙部门是否有账号
  const checkDepartmentHasAccounts = (dept: Department): boolean => {
    if (dept.memberCount > 0) return true;
    if (dept.children) {
      return dept.children.some(child => checkDepartmentHasAccounts(child));
    }
    return false;
  };

  const handleAddChild = () => {
    onAddChild(dept.id);
    setShowMenu(false);
  };

  const handleEdit = () => {
    onEdit(dept.id);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (checkDepartmentHasAccounts(dept)) {
      onShowDeleteFail();
    } else {
      console.log('删除部门', dept.id);
    }
    setShowMenu(false);
  };

  return (
    <div>
      <button
        onClick={() => onSelect(isSelected ? null : dept.id)}
        className={cn(
          "w-full flex items-center gap-1.5 py-2 px-2 rounded-lg text-sm transition-colors group",
          isSelected
            ? "bg-[#FF6B35]/10 text-[#FF6B35] font-medium"
            : "text-gray-700 hover:bg-gray-50"
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
              : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <span className="flex-1 text-left truncate">{dept.name}</span>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 rounded"
          >
            <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
          </button>
          {showMenu && (
            <DepartmentMenu
              dept={dept}
              onAddChild={handleAddChild}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClose={() => setShowMenu(false)}
            />
          )}
        </div>
      </button>
      {expanded && hasChildren && (
        <div>
          {dept.children!.map((child) => (
            <DepartmentTreeNode
              key={child.id}
              dept={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onShowDeleteFail={onShowDeleteFail}
              onAddChild={onAddChild}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// 角色状态徽章
const RoleStatusBadge: React.FC<{ status: 'active' | 'inactive' }> = ({ status }) => (
  <span className={cn(
    "px-2 py-0.5 text-xs font-medium rounded-full",
    status === 'active' ? "bg-cyan-50 text-cyan-600" : "bg-gray-100 text-gray-500"
  )}>
    {status === 'active' ? '启用' : '禁用'}
  </span>
);

interface OrganizationStructureProps {
  onViewRoleAccounts?: (roleId: string) => void;
}

export const OrganizationStructure: React.FC<OrganizationStructureProps> = ({ onViewRoleAccounts }) => {
  const departments = useStore((state) => state.departments);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [showBatchActions, setShowBatchActions] = useState(false);
  const [showDeleteFailModal, setShowDeleteFailModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'disable' | 'enable';
    roleId: string;
  } | null>(null);
  const [departmentForm, setDepartmentForm] = useState<{
    show: boolean;
    type: 'root' | 'child' | 'edit';
    parentId?: string;
    deptId?: string;
  }>({ show: false, type: 'root' });
  const [roleForm, setRoleForm] = useState<{
    show: boolean;
    type: 'create' | 'edit';
    roleId?: string;
  }>({ show: false, type: 'create' });
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [showBatchMenu, setShowBatchMenu] = useState(false);

  // 模拟角色数据
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: '滚滚滚',
      status: 'active',
      assignedCount: 0,
      createdAt: new Date('2026-03-05T06:45:43'),
      departmentId: '1',
    },
  ]);

  // 根据选中的部门过滤角色
  const filteredRoles = selectedDepartmentId
    ? roles.filter(role => role.departmentId === selectedDepartmentId)
    : roles;

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(/\//g, '/');
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    if (confirmAction.type === 'delete') {
      setRoles(roles.filter(r => r.id !== confirmAction.roleId));
      console.log('删除角色', confirmAction.roleId);
    } else if (confirmAction.type === 'disable') {
      setRoles(roles.map(r => r.id === confirmAction.roleId ? { ...r, status: 'inactive' } : r));
      console.log('停用角色', confirmAction.roleId);
    } else if (confirmAction.type === 'enable') {
      setRoles(roles.map(r => r.id === confirmAction.roleId ? { ...r, status: 'active' } : r));
      console.log('启用角色', confirmAction.roleId);
    }

    setConfirmAction(null);
  };

  const getConfirmModalProps = () => {
    if (!confirmAction) return null;

    if (confirmAction.type === 'delete') {
      return {
        icon: <AlertCircle className="w-5 h-5 text-orange-600" />,
        title: '删除角色',
        message: '删除后，该角色将无法登录。',
        confirmText: '删除',
      };
    } else if (confirmAction.type === 'disable') {
      return {
        icon: <AlertCircle className="w-5 h-5 text-orange-600" />,
        title: '停用',
        message: '角色停用后，被分配的账号无法使用角色的相关权限，确定要停用该角色吗？',
        confirmText: '确认',
      };
    } else {
      return {
        icon: <AlertCircle className="w-5 h-5 text-orange-600" />,
        title: '启用角色',
        message: '角色启用后，被分配的账号可以使用角色的相关权限，确定要启用该角色吗？',
        confirmText: '确认',
      };
    }
  };

  // 根据部门ID查找部门数据
  const findDepartmentById = (depts: Department[], id: string): Department | null => {
    for (const dept of depts) {
      if (dept.id === id) return dept;
      if (dept.children) {
        const found = findDepartmentById(dept.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleSaveDepartment = (data: { name: string; remark: string }) => {
    if (departmentForm.type === 'root') {
      console.log('创建根部门', data);
    } else if (departmentForm.type === 'child') {
      console.log('创建子部门', departmentForm.parentId, data);
    } else if (departmentForm.type === 'edit') {
      console.log('编辑部门', departmentForm.deptId, data);
    }
    setDepartmentForm({ show: false, type: 'root' });
  };

  const handleSaveRole = (data: { name: string; permissions: string; dataPermission: string }) => {
    if (roleForm.type === 'create') {
      const newRole: Role = {
        id: String(roles.length + 1),
        name: data.name,
        status: 'active',
        assignedCount: 0,
        createdAt: new Date(),
      };
      setRoles([...roles, newRole]);
      console.log('创建角色', data);
    } else {
      setRoles(roles.map(r => r.id === roleForm.roleId ? { ...r, name: data.name } : r));
      console.log('编辑角色', roleForm.roleId, data);
    }
    setRoleForm({ show: false, type: 'create' });
  };

  const handleBatchEnable = () => {
    const selectedRoles = roles.filter(r => selectedRoleIds.includes(r.id));
    const hasActiveRoles = selectedRoles.some(r => r.status === 'active');

    if (hasActiveRoles) {
      setBatchError('批量启用失败：选中的角色中包含已启用的角色，请重新选择！');
      return;
    }

    setRoles(roles.map(r =>
      selectedRoleIds.includes(r.id) ? { ...r, status: 'active' } : r
    ));
    setSelectedRoleIds([]);
    setShowBatchActions(false);
  };

  const handleBatchDisable = () => {
    const selectedRoles = roles.filter(r => selectedRoleIds.includes(r.id));
    const hasInactiveRoles = selectedRoles.some(r => r.status === 'inactive');

    if (hasInactiveRoles) {
      setBatchError('批量禁用失败：选中的角色中包含已禁用的角色，请重新选择！');
      return;
    }

    setRoles(roles.map(r =>
      selectedRoleIds.includes(r.id) ? { ...r, status: 'inactive' } : r
    ));
    setSelectedRoleIds([]);
    setShowBatchActions(false);
  };

  const toggleRoleSelection = (roleId: string) => {
    setSelectedRoleIds(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  };

  const toggleAllRoles = () => {
    if (selectedRoleIds.length === roles.length) {
      setSelectedRoleIds([]);
      setShowBatchActions(false);
    } else {
      setSelectedRoleIds(roles.map(r => r.id));
      setShowBatchActions(true);
    }
  };

  useEffect(() => {
    setShowBatchActions(selectedRoleIds.length > 0);
  }, [selectedRoleIds]);

  return (
    <div className="h-full flex gap-6 p-6">
      {/* 左侧部门树 */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 h-full flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">组织架构</h3>
            <button
              onClick={() => setDepartmentForm({ show: true, type: 'root' })}
              className="px-3 py-1 text-xs text-[#FF6B35] border border-[#FF6B35]/30 rounded hover:bg-[#FF6B35]/10 transition-colors"
            >
              新增
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {departments.map((dept) => (
              <DepartmentTreeNode
                key={dept.id}
                dept={dept}
                level={0}
                selectedId={selectedDepartmentId}
                onSelect={setSelectedDepartmentId}
                onShowDeleteFail={() => setShowDeleteFailModal(true)}
                onAddChild={(parentId) => setDepartmentForm({ show: true, type: 'child', parentId })}
                onEdit={(deptId) => setDepartmentForm({ show: true, type: 'edit', deptId })}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 右侧角色管理 */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white rounded-xl border border-gray-200 flex-1 flex flex-col overflow-hidden">
          {/* 顶部操作栏 */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
            <button
              onClick={() => setRoleForm({ show: true, type: 'create' })}
              className="px-4 py-2 text-sm text-[#FF6B35] border border-[#FF6B35]/30 rounded-lg hover:bg-[#FF6B35]/10 transition-colors"
            >
              添加角色
            </button>
            <div className="relative">
              <button
                onClick={() => setShowBatchMenu(!showBatchMenu)}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition-colors",
                  selectedRoleIds.length > 0
                    ? "text-[#FF6B35] border border-[#FF6B35]/30 hover:bg-[#FF6B35]/10"
                    : "text-gray-400 border border-gray-200 cursor-not-allowed"
                )}
                disabled={selectedRoleIds.length === 0}
              >
                批量操作
                <ChevronDown className="w-4 h-4" />
              </button>
              {showBatchMenu && selectedRoleIds.length > 0 && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowBatchMenu(false)} />
                  <div className="absolute left-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                    <button
                      onClick={() => {
                        handleBatchEnable();
                        setShowBatchMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      批量启用
                    </button>
                    <button
                      onClick={() => {
                        handleBatchDisable();
                        setShowBatchMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      批量禁用
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 角色表格 */}
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedRoleIds.length === roles.length && roles.length > 0}
                      onChange={toggleAllRoles}
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">序号</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">角色名称</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">角色状态</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">已分配账号数</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">创建时间</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role, index) => (
                  <tr key={role.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedRoleIds.includes(role.id)}
                        onChange={() => toggleRoleSelection(role.id)}
                      />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{role.name}</td>
                    <td className="py-3 px-4">
                      <RoleStatusBadge status={role.status} />
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onViewRoleAccounts?.(role.id)}
                        className="text-sm text-[#FF6B35] hover:underline cursor-pointer"
                      >
                        {role.assignedCount}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDateTime(role.createdAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setRoleForm({ show: true, type: 'edit', roleId: role.id })}
                          className="p-1.5 text-[#FF6B35] hover:bg-[#FF6B35]/10 rounded transition-colors"
                          title="编辑"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmAction({
                            type: role.status === 'active' ? 'disable' : 'enable',
                            roleId: role.id
                          })}
                          className={cn(
                            "p-1.5 rounded transition-colors",
                            role.status === 'active'
                              ? "text-orange-600 hover:bg-orange-50"
                              : "text-green-600 hover:bg-green-50"
                          )}
                          title={role.status === 'active' ? '停用' : '启用'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmAction({ type: 'delete', roleId: role.id })}
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
      </div>

      {/* 删除失败弹框 */}
      {showDeleteFailModal && (
        <DeleteFailModal onClose={() => setShowDeleteFailModal(false)} />
      )}

      {/* 确认操作弹框 */}
      {confirmAction && getConfirmModalProps() && (
        <ConfirmModal
          {...getConfirmModalProps()!}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {/* 部门表单弹框 */}
      {departmentForm.show && (
        <DepartmentFormModal
          title={
            departmentForm.type === 'root'
              ? '创建部门'
              : departmentForm.type === 'child'
              ? '创建下级部门'
              : '编辑部门'
          }
          initialData={
            departmentForm.type === 'edit' && departmentForm.deptId
              ? (() => {
                  const dept = findDepartmentById(departments, departmentForm.deptId);
                  return dept ? { name: dept.name, remark: '' } : undefined;
                })()
              : undefined
          }
          onSave={handleSaveDepartment}
          onClose={() => setDepartmentForm({ show: false, type: 'root' })}
        />
      )}

      {/* 角色表单弹框 */}
      {roleForm.show && (
        <RoleFormModal
          title={roleForm.type === 'create' ? '新增角色' : '编辑角色'}
          initialData={
            roleForm.type === 'edit'
              ? {
                  name: roles.find(r => r.id === roleForm.roleId)?.name || '',
                  permissions: '子系统管理，修改，新增，列表，详情',
                  dataPermission: '',
                }
              : undefined
          }
          onSave={handleSaveRole}
          onClose={() => setRoleForm({ show: false, type: 'create' })}
        />
      )}

      {/* 批量操作错误提示弹框 */}
      {batchError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setBatchError(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">操作失败</h3>
                <p className="text-sm text-gray-600">{batchError}</p>
              </div>
              <button
                onClick={() => setBatchError(null)}
                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setBatchError(null)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationStructure;
