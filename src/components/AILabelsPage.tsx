import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Tags,
  Pencil,
  Trash2,
  X,
  FolderTree,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import type { AILabel, AILabelGroup } from '@/types';

const PRESET_COLORS = [
  '#FF6B35', '#EF4444', '#F59E0B', '#22C55E', '#3B82F6',
  '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1', '#F97316',
  '#06B6D4', '#84CC16', '#A855F7', '#9CA3AF',
];

export const AILabelsPage: React.FC = () => {
  const aiLabelGroups = useStore((s) => s.aiLabelGroups);
  const aiLabels = useStore((s) => s.aiLabels);
  const addAILabel = useStore((s) => s.addAILabel);
  const updateAILabel = useStore((s) => s.updateAILabel);
  const deleteAILabel = useStore((s) => s.deleteAILabel);
  const addAILabelGroup = useStore((s) => s.addAILabelGroup);
  const deleteAILabelGroup = useStore((s) => s.deleteAILabelGroup);

  const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingField, setEditingField] = useState<AILabel | null>(null);
  const [editingFieldValues, setEditingFieldValues] = useState<AILabel[]>([]);
  const [newValueInput, setNewValueInput] = useState('');
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [fieldModalParentId, setFieldModalParentId] = useState<string | null>(null);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('#FF6B35');

  const childrenMap = useMemo(() => {
    const map: Record<string, AILabel[]> = {};
    for (const l of aiLabels) {
      if (l.parentId) {
        if (!map[l.parentId]) map[l.parentId] = [];
        map[l.parentId].push(l);
      }
    }
    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    );
    return map;
  }, [aiLabels]);

  const dimensionNodes = useMemo(
    () => aiLabels.filter((l) => l.level === 2).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [aiLabels]
  );

  const fieldNodes = useMemo(
    () => aiLabels.filter((l) => l.level === 3),
    [aiLabels]
  );

  const filteredFieldIds = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.trim().toLowerCase();
    const matched = new Set<string>();
    for (const f of aiLabels.filter((l) => l.level === 3)) {
      if (f.name.toLowerCase().includes(q)) { matched.add(f.id); continue; }
      const values = childrenMap[f.id] ?? [];
      if (values.some((v) => v.name.toLowerCase().includes(q))) matched.add(f.id);
    }
    return matched;
  }, [aiLabels, childrenMap, searchQuery]);

  const valueCount = useMemo(
    () => aiLabels.filter((l) => l.level === 4).length,
    [aiLabels]
  );

  const openAddField = (dimId: string) => {
    setFieldModalParentId(dimId);
    setEditingField({
      id: '', groupId: '', parentId: dimId, level: 3,
      name: '', color: '#FF6B35', selectMode: 'single', order: 0,
    });
    setEditingFieldValues([]);
    setNewValueInput('');
    setShowFieldModal(true);
  };

  const openEditField = (field: AILabel) => {
    setEditingField({ ...field });
    setFieldModalParentId(field.parentId ?? null);
    setEditingFieldValues([...(childrenMap[field.id] ?? [])]);
    setNewValueInput('');
    setShowFieldModal(true);
  };

  const handleAddValueInModal = () => {
    const name = newValueInput.trim();
    if (!name) return;
    const newVal: AILabel = {
      id: `lb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      groupId: '', parentId: editingField?.id ?? '', level: 4,
      name, color: editingField?.color ?? '#FF6B35',
      order: editingFieldValues.length + 1,
    };
    setEditingFieldValues((prev) => [...prev, newVal]);
    setNewValueInput('');
  };

  const handleRemoveValueInModal = (valId: string) => {
    setEditingFieldValues((prev) => prev.filter((v) => v.id !== valId));
  };

  const handleSaveField = () => {
    if (!fieldModalParentId || !editingField || !editingField.name.trim()) return;

    if (editingField.id) {
      updateAILabel(editingField.id, {
        name: editingField.name, color: editingField.color, selectMode: editingField.selectMode,
      });
      const oldValues = childrenMap[editingField.id] ?? [];
      const newIds = new Set(editingFieldValues.map((v) => v.id));
      for (const ov of oldValues) { if (!newIds.has(ov.id)) deleteAILabel(ov.id); }
      const oldIds = new Set(oldValues.map((v) => v.id));
      for (const nv of editingFieldValues) {
        if (oldIds.has(nv.id)) {
          updateAILabel(nv.id, { name: nv.name, color: nv.color, order: nv.order });
        } else {
          addAILabel({ ...nv, parentId: editingField.id });
        }
      }
    } else {
      const fieldId = `field_${Date.now()}`;
      const siblings = childrenMap[fieldModalParentId] ?? [];
      const maxOrder = Math.max(0, ...siblings.map((s) => s.order ?? 0));
      addAILabel({
        id: fieldId, groupId: '', parentId: fieldModalParentId, level: 3,
        name: editingField.name.trim(), color: editingField.color,
        selectMode: editingField.selectMode ?? 'single', order: maxOrder + 1,
      });
      for (const nv of editingFieldValues) { addAILabel({ ...nv, parentId: fieldId }); }
    }

    closeFieldModal();
  };

  const closeFieldModal = () => {
    setShowFieldModal(false);
    setEditingField(null);
    setEditingFieldValues([]);
    setNewValueInput('');
    setFieldModalParentId(null);
  };

  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;
    const maxOrder = Math.max(0, ...aiLabelGroups.map((g) => g.order));
    addAILabelGroup({
      id: `grp_${Date.now()}`, name: newGroupName.trim(),
      color: newGroupColor, order: maxOrder + 1,
    });
    setNewGroupName('');
    setShowAddGroup(false);
  };

  const visibleDimensions = useMemo(() => {
    const dims = selectedIndustryId
      ? dimensionNodes.filter((d) => d.groupId === selectedIndustryId)
      : dimensionNodes;
    if (!filteredFieldIds) return dims;
    return dims.filter((dim) => {
      const fields = childrenMap[dim.id] ?? [];
      return fields.some((f) => filteredFieldIds.has(f.id));
    });
  }, [dimensionNodes, selectedIndustryId, childrenMap, filteredFieldIds]);

  return (
    <div className="h-full flex flex-col">
      <PageHeader
        industryCount={aiLabelGroups.length}
        dimensionCount={dimensionNodes.length}
        fieldCount={fieldNodes.length}
        valueCount={valueCount}
        onAddIndustry={() => setShowAddGroup(true)}
      />
      <div className="flex-1 px-6 pb-6 min-h-0">
        <div className="flex gap-6 h-full">
          <IndustrySidebar
            industries={aiLabelGroups}
            selectedId={selectedIndustryId}
            onSelect={setSelectedIndustryId}
            onDelete={deleteAILabelGroup}
          />
          <div className="flex-1 flex flex-col min-w-0">
            <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 px-4 py-3 flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索字段或标签值..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
                />
              </div>
              <span className="ml-auto text-xs text-gray-500">
                共 {filteredFieldIds ? filteredFieldIds.size : fieldNodes.length} 个字段
              </span>
            </div>
            <FieldTable
              dimensions={visibleDimensions}
              childrenMap={childrenMap}
              filteredFieldIds={filteredFieldIds}
              onEditField={openEditField}
              onDeleteField={deleteAILabel}
              onAddField={openAddField}
            />
          </div>
        </div>
      </div>

      {showFieldModal && editingField && (
        <FieldEditModal
          field={editingField}
          values={editingFieldValues}
          newValueInput={newValueInput}
          onNewValueInputChange={setNewValueInput}
          onFieldChange={setEditingField}
          onAddValue={handleAddValueInModal}
          onRemoveValue={handleRemoveValueInModal}
          onSave={handleSaveField}
          onClose={closeFieldModal}
        />
      )}

      {showAddGroup && (
        <AddGroupModal
          name={newGroupName}
          color={newGroupColor}
          onNameChange={setNewGroupName}
          onColorChange={setNewGroupColor}
          onSave={handleAddGroup}
          onClose={() => setShowAddGroup(false)}
        />
      )}
    </div>
  );
};

// ============ PageHeader ============
const PageHeader: React.FC<{
  industryCount: number;
  dimensionCount: number;
  fieldCount: number;
  valueCount: number;
  onAddIndustry: () => void;
}> = ({ industryCount, dimensionCount, fieldCount, valueCount, onAddIndustry }) => (
  <div className="px-6 py-4 flex items-center justify-between flex-shrink-0">
    <span className="text-xs text-gray-500">
      {industryCount} 个行业 / {dimensionCount} 个维度 / {fieldCount} 个字段 / {valueCount} 个标签值
    </span>
    <button
      onClick={onAddIndustry}
      className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-[#E85A2A] transition-colors"
    >
      <Plus className="w-4 h-4" />
      新增行业
    </button>
  </div>
);

// ============ IndustrySidebar ============
const IndustrySidebar: React.FC<{
  industries: AILabelGroup[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
}> = ({ industries, selectedId, onSelect, onDelete }) => {
  const sorted = [...industries].sort((a, b) => a.order - b.order);
  return (
    <div className="w-56 flex-shrink-0">
      <div className="bg-white rounded-xl border border-gray-200 h-full flex flex-col">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-[#FF6B35]" />
            行业分类
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          <button
            onClick={() => onSelect(null)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
              !selectedId ? 'bg-[#FF6B35]/10 text-[#FF6B35] font-medium' : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            <div className="flex items-center gap-2">
              <Tags className="w-4 h-4" />
              <span>系统默认</span>
            </div>
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded-full',
              !selectedId ? 'bg-[#FF6B35]/20 text-[#FF6B35]' : 'bg-gray-100 text-gray-500'
            )}>
              {industries.length}
            </span>
          </button>
          {sorted.map((ind) => (
            <IndustryItem
              key={ind.id}
              industry={ind}
              isSelected={selectedId === ind.id}
              onSelect={() => onSelect(ind.id)}
              onDelete={() => onDelete(ind.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============ IndustryItem ============
const IndustryItem: React.FC<{
  industry: AILabelGroup;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}> = ({ industry, isSelected, onSelect, onDelete }) => (
  <div className="group relative">
    <button
      onClick={onSelect}
      className={cn(
        'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
        isSelected ? 'bg-[#FF6B35]/10 text-[#FF6B35] font-medium' : 'text-gray-700 hover:bg-gray-50'
      )}
    >
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: industry.color }} />
        <span className="truncate">{industry.name}</span>
      </div>
    </button>
    <button
      onClick={(e) => { e.stopPropagation(); onDelete(); }}
      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
      title="删除行业"
    >
      <Trash2 className="w-3 h-3" />
    </button>
  </div>
);

// ============ FieldTable ============
const FieldTable: React.FC<{
  dimensions: AILabel[];
  childrenMap: Record<string, AILabel[]>;
  filteredFieldIds: Set<string> | null;
  onEditField: (field: AILabel) => void;
  onDeleteField: (id: string) => void;
  onAddField: (dimId: string) => void;
}> = ({ dimensions, childrenMap, filteredFieldIds, onEditField, onDeleteField, onAddField }) => (
  <div className="bg-white rounded-b-xl border border-gray-200 flex-1 overflow-hidden flex flex-col">
    <div className="overflow-y-auto flex-1">
      {dimensions.map((dim) => {
        const fields = childrenMap[dim.id] ?? [];
        const visible = filteredFieldIds ? fields.filter((f) => filteredFieldIds.has(f.id)) : fields;
        if (visible.length === 0 && filteredFieldIds) return null;
        return (
          <DimensionGroup
            key={dim.id}
            dimension={dim}
            fields={visible}
            childrenMap={childrenMap}
            onEditField={onEditField}
            onDeleteField={onDeleteField}
            onAddField={() => onAddField(dim.id)}
          />
        );
      })}
      {dimensions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Tags className="w-10 h-10 mb-3 text-gray-300" />
          <p className="text-sm">暂无匹配的标签</p>
          <p className="text-xs mt-1">请调整搜索条件</p>
        </div>
      )}
    </div>
  </div>
);

// ============ DimensionGroup ============
const DimensionGroup: React.FC<{
  dimension: AILabel;
  fields: AILabel[];
  childrenMap: Record<string, AILabel[]>;
  onEditField: (field: AILabel) => void;
  onDeleteField: (id: string) => void;
  onAddField: () => void;
}> = ({ dimension, fields, childrenMap, onEditField, onDeleteField, onAddField }) => (
  <div className="border-b border-gray-100 last:border-b-0">
    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/70">
      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: dimension.color }} />
      <span className="text-sm font-semibold text-gray-900">{dimension.name}</span>
      <span className="text-xs text-gray-400">({fields.length} 个字段)</span>
      <button
        onClick={onAddField}
        className="ml-auto flex items-center gap-1 px-2 py-1 text-xs text-[#FF6B35] hover:bg-[#FF6B35]/10 rounded-md transition-colors"
      >
        <Plus className="w-3 h-3" />
        添加字段
      </button>
    </div>
    {fields.map((field) => {
      const values = childrenMap[field.id] ?? [];
      return (
        <FieldRow
          key={field.id}
          field={field}
          values={values}
          onEdit={() => onEditField(field)}
          onDelete={() => onDeleteField(field.id)}
        />
      );
    })}
  </div>
);

// ============ FieldRow ============
const FieldRow: React.FC<{
  field: AILabel;
  values: AILabel[];
  onEdit: () => void;
  onDelete: () => void;
}> = ({ field, values, onEdit, onDelete }) => (
  <div className="flex items-center gap-3 px-4 py-2.5 pl-8 hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-b-0">
    <div className="flex items-center gap-2 w-36 flex-shrink-0">
      <span className="w-2.5 h-2.5 rounded flex-shrink-0" style={{ backgroundColor: field.color }} />
      <span className="text-sm font-medium text-gray-700 truncate">{field.name}</span>
    </div>
    <div className="flex-1 flex flex-wrap gap-1.5 min-w-0">
      {field.inputType === 'text' ? (
        <span className="text-xs text-gray-400 italic">文本输入框</span>
      ) : (
        <>
          {values.map((val) => (
            <span
              key={val.id}
              className="inline-flex items-center px-2 py-0.5 text-xs rounded-full border"
              style={{ backgroundColor: val.color + '15', borderColor: val.color + '30', color: val.color }}
            >
              {val.name}
            </span>
          ))}
          {values.length === 0 && <span className="text-xs text-gray-300 italic">暂无标签值</span>}
        </>
      )}
    </div>
    <span className={cn(
      'px-2 py-0.5 text-[11px] font-medium rounded-full flex-shrink-0',
      field.inputType === 'text'
        ? 'bg-emerald-50 text-emerald-600'
        : field.selectMode === 'multiple' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
    )}>
      {field.inputType === 'text' ? '文本框' : field.selectMode === 'multiple' ? '多选' : '单选'}
    </span>
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
      <button onClick={onEdit} className="inline-flex items-center px-1.5 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded transition-colors">
        <Pencil className="w-3.5 h-3.5" />
      </button>
      {!field.isSystem && (
        <button onClick={onDelete} className="inline-flex items-center px-1.5 py-1 text-xs text-red-500 hover:bg-red-50 rounded transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  </div>
);

// ============ FieldEditModal ============
const FieldEditModal: React.FC<{
  field: AILabel;
  values: AILabel[];
  newValueInput: string;
  onNewValueInputChange: (v: string) => void;
  onFieldChange: (field: AILabel | null) => void;
  onAddValue: () => void;
  onRemoveValue: (valId: string) => void;
  onSave: () => void;
  onClose: () => void;
}> = ({
  field, values, newValueInput, onNewValueInputChange,
  onFieldChange, onAddValue, onRemoveValue, onSave, onClose,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Tags className="w-5 h-5" style={{ color: '#FF6B35' }} />
          <h2 className="text-lg font-semibold text-gray-900">
            {field.id ? '编辑字段' : '新增字段'}
          </h2>
        </div>
        <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">字段名称</label>
          <input
            type="text"
            value={field.name}
            onChange={(e) => onFieldChange({ ...field, name: e.target.value })}
            placeholder="请输入字段名称"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-colors"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">字段类型</label>
          <div className="flex gap-2">
            <button
              onClick={() => onFieldChange({ ...field, inputType: 'select', selectMode: field.selectMode || 'single' })}
              className={cn(
                'flex-1 px-3 py-2 text-sm rounded-lg border transition-colors',
                field.inputType !== 'text' && field.selectMode === 'single'
                  ? 'border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35] font-medium'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              单选
            </button>
            <button
              onClick={() => onFieldChange({ ...field, inputType: 'select', selectMode: 'multiple' })}
              className={cn(
                'flex-1 px-3 py-2 text-sm rounded-lg border transition-colors',
                field.inputType !== 'text' && field.selectMode === 'multiple'
                  ? 'border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35] font-medium'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              多选
            </button>
            <button
              onClick={() => onFieldChange({ ...field, inputType: 'text' })}
              className={cn(
                'flex-1 px-3 py-2 text-sm rounded-lg border transition-colors',
                field.inputType === 'text'
                  ? 'border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35] font-medium'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              文本框
            </button>
          </div>
        </div>
        {field.inputType === 'text' ? (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 text-center">
            <span className="text-sm text-gray-400">文本框类型无需配置标签值，客户将直接输入文本内容</span>
          </div>
        ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">标签值</label>
          <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px] p-2 border border-gray-200 rounded-lg bg-gray-50/50">
            {values.map((val) => (
              <span
                key={val.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border"
                style={{ backgroundColor: val.color + '15', borderColor: val.color + '30', color: val.color }}
              >
                {val.name}
                <button
                  onClick={() => onRemoveValue(val.id)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {values.length === 0 && (
              <span className="text-xs text-gray-300 italic">暂无标签值，请在下方添加</span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newValueInput}
              onChange={(e) => onNewValueInputChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAddValue(); } }}
              placeholder="输入标签值后按回车添加"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-colors"
            />
            <button
              onClick={onAddValue}
              disabled={!newValueInput.trim()}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                newValueInput.trim()
                  ? 'bg-[#FF6B35] text-white hover:bg-[#E85A2A]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              添加
            </button>
          </div>
        </div>
        )}
      </div>
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          取消
        </button>
        <button
          onClick={onSave}
          disabled={!field.name.trim()}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            field.name.trim()
              ? 'bg-[#FF6B35] text-white hover:bg-[#E85A2A]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          保存
        </button>
      </div>
    </div>
  </div>
);

// ============ AddGroupModal ============
export const AddGroupModal: React.FC<{
  name: string;
  color: string;
  onNameChange: (v: string) => void;
  onColorChange: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}> = ({ name, color, onNameChange, onColorChange, onSave, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">新增行业</h2>
        <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="px-6 py-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">行业名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="请输入行业名称"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-colors"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">颜色</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onColorChange(c)}
                className={cn(
                  'w-7 h-7 rounded-full border-2 transition-all',
                  color === c ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105'
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          取消
        </button>
        <button
          onClick={onSave}
          disabled={!name.trim()}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            name.trim()
              ? 'bg-[#FF6B35] text-white hover:bg-[#E85A2A]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          保存
        </button>
      </div>
    </div>
  </div>
);
