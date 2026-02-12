import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Plus,
  BookOpen,
  FileText,
  Trash2,
  X,
  Upload,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertCircle,
  FolderOpen,
  MoreHorizontal,
  FileEdit,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import type { KnowledgeBase, KnowledgeDocument } from '@/types';

const FILE_TYPE_ICONS: Record<string, { icon: string; color: string }> = {
  pdf: { icon: 'PDF', color: '#EF4444' },
  docx: { icon: 'DOC', color: '#3B82F6' },
  doc: { icon: 'DOC', color: '#3B82F6' },
  xlsx: { icon: 'XLS', color: '#22C55E' },
  xls: { icon: 'XLS', color: '#22C55E' },
  csv: { icon: 'CSV', color: '#22C55E' },
  txt: { icon: 'TXT', color: '#6B7280' },
  md: { icon: 'MD', color: '#8B5CF6' },
};

const formatCharCount = (count?: number): string => {
  if (!count) return '0';
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return `${count}`;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const KnowledgeBasePage: React.FC = () => {
  const knowledgeBases = useStore((s) => s.knowledgeBases);
  const knowledgeDocuments = useStore((s) => s.knowledgeDocuments);
  const addKnowledgeBase = useStore((s) => s.addKnowledgeBase);
  const deleteKnowledgeBase = useStore((s) => s.deleteKnowledgeBase);
  const addKnowledgeDocument = useStore((s) => s.addKnowledgeDocument);
  const updateKnowledgeDocument = useStore((s) => s.updateKnowledgeDocument);
  const deleteKnowledgeDocument = useStore((s) => s.deleteKnowledgeDocument);

  const [selectedKbId, setSelectedKbId] = useState<string | null>(knowledgeBases[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddKb, setShowAddKb] = useState(false);
  const [newKbName, setNewKbName] = useState('');
  const [newKbDesc, setNewKbDesc] = useState('');
  const [newKbColor, setNewKbColor] = useState('#3B82F6');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUploadWizard, setShowUploadWizard] = useState(false);
  const [wizardFiles, setWizardFiles] = useState<File[]>([]);

  const PRESET_COLORS = [
    '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#14B8A6', '#FF6B35', '#6366F1', '#06B6D4',
  ];

  const selectedKb = useMemo(
    () => knowledgeBases.find((kb) => kb.id === selectedKbId) ?? null,
    [knowledgeBases, selectedKbId]
  );

  const filteredDocs = useMemo(() => {
    if (!selectedKbId) return [];
    const docs = knowledgeDocuments.filter((d) => d.knowledgeBaseId === selectedKbId);
    if (!searchQuery.trim()) return docs;
    const q = searchQuery.trim().toLowerCase();
    return docs.filter((d) => d.fileName.toLowerCase().includes(q));
  }, [knowledgeDocuments, selectedKbId, searchQuery]);

  const getKbCharCount = (kbId: string) =>
    knowledgeDocuments
      .filter((d) => d.knowledgeBaseId === kbId)
      .reduce((sum, d) => sum + (d.charCount ?? 0), 0);

  const handleAddKb = () => {
    if (!newKbName.trim()) return;
    const kb: KnowledgeBase = {
      id: `kb_${Date.now()}`,
      name: newKbName.trim(),
      description: newKbDesc.trim() || undefined,
      color: newKbColor,
      documentCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    addKnowledgeBase(kb);
    setSelectedKbId(kb.id);
    setNewKbName('');
    setNewKbDesc('');
    setShowAddKb(false);
  };

  const handleDeleteKb = (id: string) => {
    deleteKnowledgeBase(id);
    if (selectedKbId === id) {
      setSelectedKbId(knowledgeBases.find((kb) => kb.id !== id)?.id ?? null);
    }
  };

  const handleImportFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedKbId) return;
    Array.from(files).forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'txt';
      const doc: KnowledgeDocument = {
        id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        knowledgeBaseId: selectedKbId,
        fileName: file.name,
        fileSize: file.size,
        fileType: ext,
        charCount: Math.round(file.size * 0.4),
        status: 'parsing',
        enabled: true,
        uploadedAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      addKnowledgeDocument(doc);
      // 模拟 RAG 阶段流转: parsing -> chunking -> embedding -> ready
      const t1 = 1000 + Math.random() * 1500;
      const t2 = t1 + 1000 + Math.random() * 1500;
      const t3 = t2 + 1500 + Math.random() * 2000;
      setTimeout(() => updateKnowledgeDocument(doc.id, { status: 'chunking' }), t1);
      setTimeout(() => updateKnowledgeDocument(doc.id, { status: 'embedding' }), t2);
      setTimeout(() => {
        const chunks = Math.round((doc.charCount ?? 0) / 1500) || 1;
        updateKnowledgeDocument(doc.id, { status: 'ready', chunkCount: chunks });
      }, t3);
    });
    e.target.value = '';
  };

  const toggleDocEnabled = (docId: string, current: boolean) => {
    updateKnowledgeDocument(docId, { enabled: !current });
  };

  const handleWizardComplete = (files: File[], settings: { chunkSize: number; overlap: number }) => {
    if (!selectedKbId) return;
    files.forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'txt';
      const doc: KnowledgeDocument = {
        id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        knowledgeBaseId: selectedKbId,
        fileName: file.name,
        fileSize: file.size,
        fileType: ext,
        charCount: Math.round(file.size * 0.4),
        status: 'parsing',
        enabled: true,
        uploadedAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      addKnowledgeDocument(doc);
      const t1 = 1000 + Math.random() * 1500;
      const t2 = t1 + 1000 + Math.random() * 1500;
      const t3 = t2 + 1500 + Math.random() * 2000;
      setTimeout(() => updateKnowledgeDocument(doc.id, { status: 'chunking' }), t1);
      setTimeout(() => updateKnowledgeDocument(doc.id, { status: 'embedding' }), t2);
      setTimeout(() => {
        const chunks = Math.round((doc.charCount ?? 0) / settings.chunkSize) || 1;
        updateKnowledgeDocument(doc.id, { status: 'ready', chunkCount: chunks });
      }, t3);
    });
    setShowUploadWizard(false);
    setWizardFiles([]);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      {/* 顶部栏 */}
      <div className="px-6 py-4 flex items-center justify-between flex-shrink-0 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h1 className="text-base font-semibold text-gray-900">知识库管理</h1>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {knowledgeBases.length} 个知识库
          </span>
        </div>
        <button
          onClick={() => setShowAddKb(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          新建知识库
        </button>
      </div>

      {/* 主体 */}
      <div className="flex-1 px-6 py-5 min-h-0">
        <div className="flex gap-5 h-full">
          <KbSidebar
            knowledgeBases={knowledgeBases}
            documents={knowledgeDocuments}
            selectedId={selectedKbId}
            getCharCount={getKbCharCount}
            onSelect={setSelectedKbId}
            onDelete={handleDeleteKb}
          />
          <div className="flex-1 flex flex-col min-w-0">
            {selectedKb ? (
              <>
                <KbHeader
                  kb={selectedKb}
                  docCount={filteredDocs.length}
                  totalCharCount={getKbCharCount(selectedKb.id)}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onImport={() => setShowUploadWizard(true)}
                />
                <DocTable
                  docs={filteredDocs}
                  onToggle={toggleDocEnabled}
                  onDelete={(id) => deleteKnowledgeDocument(id)}
                />
              </>
            ) : (
              <EmptyState onAdd={() => setShowAddKb(true)} />
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.txt,.md"
        className="hidden"
        onChange={handleImportFiles}
      />

      {showAddKb && (
        <AddKbModal
          name={newKbName}
          desc={newKbDesc}
          color={newKbColor}
          colors={PRESET_COLORS}
          onNameChange={setNewKbName}
          onDescChange={setNewKbDesc}
          onColorChange={setNewKbColor}
          onSave={handleAddKb}
          onClose={() => setShowAddKb(false)}
        />
      )}

      {showUploadWizard && selectedKbId && (
        <UploadWizardModal
          onComplete={handleWizardComplete}
          onClose={() => { setShowUploadWizard(false); setWizardFiles([]); }}
        />
      )}
    </div>
  );
};

// ============ KbSidebar ============
const KbSidebar: React.FC<{
  knowledgeBases: KnowledgeBase[];
  documents: KnowledgeDocument[];
  selectedId: string | null;
  getCharCount: (kbId: string) => number;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
}> = ({ knowledgeBases, documents, selectedId, getCharCount, onSelect, onDelete }) => (
  <div className="w-60 flex-shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
    {knowledgeBases.map((kb) => {
      const docCount = documents.filter((d) => d.knowledgeBaseId === kb.id).length;
      const charCount = getCharCount(kb.id);
      const isSelected = selectedId === kb.id;
      return (
        <div
          key={kb.id}
          onClick={() => onSelect(kb.id)}
          className={cn(
            'group relative p-3.5 rounded-xl border cursor-pointer transition-all',
            isSelected
              ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-100'
              : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
          )}
        >
          {isSelected && (
            <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-blue-500" />
          )}
          <div className="flex items-start gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: kb.color + '18' }}
            >
              <BookOpen className="w-4 h-4" style={{ color: kb.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{kb.name}</div>
              {kb.description && (
                <div className="text-xs text-gray-400 truncate mt-0.5">{kb.description}</div>
              )}
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                <span>{docCount} 个文档</span>
                <span>{formatCharCount(charCount)} 字符</span>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(kb.id); }}
            className="absolute right-2 top-2 p-1 rounded-md hover:bg-red-50 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      );
    })}
  </div>
);

// ============ KbHeader ============
const KbHeader: React.FC<{
  kb: KnowledgeBase;
  docCount: number;
  totalCharCount: number;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onImport: () => void;
}> = ({ kb, docCount, totalCharCount, searchQuery, onSearchChange, onImport }) => (
  <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 px-5 py-4">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: kb.color + '18' }}
        >
          <BookOpen className="w-3.5 h-3.5" style={{ color: kb.color }} />
        </div>
        <h2 className="text-sm font-semibold text-gray-900">{kb.name}</h2>
        <span className="text-xs text-gray-400">{docCount} 个文档 / {formatCharCount(totalCharCount)} 字符</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onImport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          添加文件
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors">
          <FileEdit className="w-3.5 h-3.5" />
          添加自定义内容
        </button>
      </div>
    </div>
    <div className="relative max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
      <input
        type="text"
        placeholder="搜索文档..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
      />
    </div>
  </div>
);

// ============ DocTable ============
const DocTable: React.FC<{
  docs: KnowledgeDocument[];
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
}> = ({ docs, onToggle, onDelete }) => (
  <div className="bg-white rounded-b-xl border border-gray-200 flex-1 overflow-hidden flex flex-col">
    <div className="grid grid-cols-[1fr_90px_90px_100px_70px] gap-2 px-5 py-2.5 bg-gray-50/80 border-b border-gray-100 text-xs font-medium text-gray-500">
      <span>文件名</span>
      <span>字符数</span>
      <span>大小</span>
      <span>状态</span>
      <span className="text-center">操作</span>
    </div>
    <div className="overflow-y-auto flex-1">
      {docs.map((doc) => (
        <DocRow key={doc.id} doc={doc} onToggle={onToggle} onDelete={onDelete} />
      ))}
      {docs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <FileText className="w-10 h-10 mb-3 text-gray-300" />
          <p className="text-sm">暂无文档</p>
          <p className="text-xs mt-1">点击"添加文件"上传文档</p>
        </div>
      )}
    </div>
  </div>
);

// ============ DocRow ============
const DocRow: React.FC<{
  doc: KnowledgeDocument;
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
}> = ({ doc, onToggle, onDelete }) => {
  const typeInfo = FILE_TYPE_ICONS[doc.fileType] ?? { icon: 'FILE', color: '#6B7280' };
  return (
    <div className="grid grid-cols-[1fr_90px_90px_100px_70px] gap-2 px-5 py-3 items-center hover:bg-blue-50/30 transition-colors group border-b border-gray-50 last:border-b-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white"
          style={{ backgroundColor: typeInfo.color }}
        >
          {typeInfo.icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm text-gray-800 truncate">{doc.fileName}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">{doc.uploadedAt}</div>
        </div>
      </div>
      <span className="text-xs text-gray-500">{formatCharCount(doc.charCount)} 字符</span>
      <span className="text-xs text-gray-500">{formatFileSize(doc.fileSize)}</span>
      <DocStatusBadge status={doc.status} enabled={doc.enabled} />
      <div className="flex items-center justify-center gap-1">
        {doc.status === 'ready' && (
          <button onClick={() => onToggle(doc.id, doc.enabled)} className="p-0.5">
            {doc.enabled ? (
              <ToggleRight className="w-5 h-5 text-blue-500" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-gray-300" />
            )}
          </button>
        )}
        <button
          onClick={() => onDelete(doc.id)}
          className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ============ DocStatusBadge ============
const RAG_STAGES: Record<string, { label: string; color: string; bg: string }> = {
  parsing:   { label: '解析中', color: 'text-blue-600', bg: 'bg-blue-50' },
  chunking:  { label: '分块中', color: 'text-violet-600', bg: 'bg-violet-50' },
  embedding: { label: '向量化', color: 'text-amber-600', bg: 'bg-amber-50' },
};

const DocStatusBadge: React.FC<{
  status: KnowledgeDocument['status'];
  enabled: boolean;
}> = ({ status, enabled }) => {
  const stage = RAG_STAGES[status];
  if (stage) {
    return (
      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px]', stage.bg, stage.color)}>
        <Loader2 className="w-3 h-3 animate-spin" />
        {stage.label}
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-500 text-[11px]">
        <AlertCircle className="w-3 h-3" />
        失败
      </span>
    );
  }
  if (!enabled) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 text-[11px]">
        已禁用
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[11px]">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
      已启用
    </span>
  );
};

// ============ EmptyState ============
const EmptyState: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <div className="bg-white rounded-xl border border-gray-200 flex-1 flex flex-col items-center justify-center text-gray-400">
    <FolderOpen className="w-12 h-12 mb-4 text-gray-300" />
    <p className="text-sm font-medium text-gray-500">请选择或创建知识库</p>
    <p className="text-xs mt-1 mb-4">知识库用于存储AI员工的产品知识和FAQ内容</p>
    <button
      onClick={onAdd}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Plus className="w-4 h-4" />
      新建知识库
    </button>
  </div>
);

// ============ AddKbModal ============
const AddKbModal: React.FC<{
  name: string;
  desc: string;
  color: string;
  colors: string[];
  onNameChange: (v: string) => void;
  onDescChange: (v: string) => void;
  onColorChange: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}> = ({ name, desc, color, colors, onNameChange, onDescChange, onColorChange, onSave, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">新建知识库</h2>
        <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="px-6 py-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">知识库名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="请输入知识库名称"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">描述</label>
          <input
            type="text"
            value={desc}
            onChange={(e) => onDescChange(e.target.value)}
            placeholder="可选，简要描述知识库用途"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">颜色</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
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
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          取消
        </button>
        <button
          onClick={onSave}
          disabled={!name.trim()}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            name.trim()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          )}
        >
          保存
        </button>
      </div>
    </div>
  </div>
);

// ============ UploadWizardModal (3步流程) ============
const WIZARD_STEPS = [
  { key: 'source', label: '选择数据源' },
  { key: 'chunk', label: '文本分段与清洗' },
  { key: 'process', label: '处理并完成' },
] as const;

type WizardStep = (typeof WIZARD_STEPS)[number]['key'];

const UploadWizardModal: React.FC<{
  onComplete: (files: File[], settings: { chunkSize: number; overlap: number }) => void;
  onClose: () => void;
}> = ({ onComplete, onClose }) => {
  const [step, setStep] = useState<WizardStep>('source');
  const [files, setFiles] = useState<File[]>([]);
  const [chunkSize, setChunkSize] = useState(500);
  const [overlap, setOverlap] = useState(50);
  const [chunkMode, setChunkMode] = useState<'auto' | 'custom'>('auto');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const wizardFileRef = useRef<HTMLInputElement>(null);

  const stepIndex = WIZARD_STEPS.findIndex((s) => s.key === step);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length) setFiles((prev) => [...prev, ...dropped]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected) setFiles((prev) => [...prev, ...Array.from(selected)]);
    e.target.value = '';
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const goNext = () => {
    if (stepIndex < WIZARD_STEPS.length - 1) {
      const next = WIZARD_STEPS[stepIndex + 1].key;
      setStep(next);
      if (next === 'process') startProcessing();
    }
  };

  const goPrev = () => {
    if (stepIndex > 0 && !processing) setStep(WIZARD_STEPS[stepIndex - 1].key);
  };

  const startProcessing = () => {
    setProcessing(true);
    setProgress(0);
    let p = 0;
    const timer = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(timer);
        setProcessing(false);
      }
      setProgress(Math.min(100, Math.round(p)));
    }, 400);
  };

  const canNext = step === 'source' ? files.length > 0 : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">添加文档</h2>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center">
            {WIZARD_STEPS.map((s, i) => {
              const done = i < stepIndex;
              const active = i === stepIndex;
              return (
                <React.Fragment key={s.key}>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                      done ? 'bg-blue-600 text-white' :
                      active ? 'bg-blue-600 text-white' :
                      'bg-gray-200 text-gray-400'
                    )}>
                      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className={cn(
                      'text-xs',
                      active ? 'text-gray-900 font-medium' : done ? 'text-gray-600' : 'text-gray-400'
                    )}>{s.label}</span>
                  </div>
                  {i < WIZARD_STEPS.length - 1 && (
                    <div className={cn('flex-1 h-px mx-3', i < stepIndex ? 'bg-blue-400' : 'bg-gray-200')} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="px-6 py-5 min-h-[280px]">
          {step === 'source' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => wizardFileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-600 font-medium">拖拽文件到此处，或点击选择</p>
                <p className="text-xs text-gray-400 mt-1">支持 PDF、DOC、DOCX、XLS、XLSX、CSV、TXT、MD</p>
                <input
                  ref={wizardFileRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.txt,.md"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
              {files.length > 0 && (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {files.map((f, i) => {
                    const ext = f.name.split('.').pop()?.toLowerCase() ?? 'txt';
                    const typeInfo = FILE_TYPE_ICONS[ext] ?? { icon: 'FILE', color: '#6B7280' };
                    return (
                      <div key={i} className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 rounded-lg">
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: typeInfo.color }}
                        >{typeInfo.icon}</div>
                        <span className="text-sm text-gray-700 truncate flex-1">{f.name}</span>
                        <span className="text-[11px] text-gray-400 flex-shrink-0">{formatFileSize(f.size)}</span>
                        <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="p-0.5 text-gray-300 hover:text-red-500">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {step === 'chunk' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-800 mb-1">分段策略</h3>
                <p className="text-xs text-gray-400">选择文档分段方式，影响检索精度和召回率</p>
              </div>

              {/* 策略选择卡片 */}
              <div className="space-y-2">
                <button
                  onClick={() => setChunkMode('auto')}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-lg border transition-colors',
                    chunkMode === 'auto'
                      ? 'border-blue-400 bg-blue-50/50 ring-1 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <p className="text-sm font-medium text-gray-800">自动分段与清洗</p>
                  <p className="text-xs text-gray-400 mt-0.5">系统自动识别文档结构，智能分段并清洗冗余内容</p>
                </button>
                <button
                  onClick={() => setChunkMode('custom')}
                  className={cn(
                    'w-full text-left px-4 py-3 rounded-lg border transition-colors',
                    chunkMode === 'custom'
                      ? 'border-blue-400 bg-blue-50/50 ring-1 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <p className="text-sm font-medium text-gray-800">自定义</p>
                  <p className="text-xs text-gray-400 mt-0.5">手动设置分段长度和重叠长度</p>
                </button>
              </div>

              {/* 自定义设置 */}
              {chunkMode === 'custom' && (
                <div className="space-y-3 border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                  <div>
                    <label className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-500">分段长度</span>
                      <span className="text-xs font-medium text-blue-600">{chunkSize} 字符</span>
                    </label>
                    <input
                      type="range" min={100} max={2000} step={50}
                      value={chunkSize}
                      onChange={(e) => setChunkSize(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                      <span>100</span><span>2000</span>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-500">重叠长度</span>
                      <span className="text-xs font-medium text-blue-600">{overlap} 字符</span>
                    </label>
                    <input
                      type="range" min={0} max={500} step={10}
                      value={overlap}
                      onChange={(e) => setOverlap(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                      <span>0</span><span>500</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'process' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-5">
              {processing ? (
                <>
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#E5E7EB" strokeWidth="6" />
                      <circle
                        cx="40" cy="40" r="34" fill="none" stroke="#3B82F6" strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 34}`}
                        strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-blue-600">
                      {progress}%
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">正在处理文档...</p>
                    <p className="text-xs text-gray-400 mt-1">解析、分段、生成向量索引</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">处理完成</p>
                    <p className="text-xs text-gray-400 mt-1">点击"完成"添加到知识库</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={stepIndex > 0 && !processing ? goPrev : onClose}
            className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {stepIndex > 0 && !processing ? (
              <><ChevronLeft className="w-4 h-4" />上一步</>
            ) : '取消'}
          </button>
          {step === 'process' ? (
            <button
              onClick={() => onComplete(files, { chunkSize, overlap })}
              disabled={processing}
              className={cn(
                'px-5 py-2 text-sm font-medium rounded-lg transition-colors',
                processing
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              完成
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={!canNext}
              className={cn(
                'flex items-center gap-1 px-5 py-2 text-sm font-medium rounded-lg transition-colors',
                canNext
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              下一步
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};