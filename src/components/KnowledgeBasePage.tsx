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
  CheckCircle2,
  AlertCircle,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import type { KnowledgeBase, KnowledgeDocument } from '@/types';

const FILE_TYPE_ICONS: Record<string, string> = {
  pdf: '📄', docx: '📝', doc: '📝', xlsx: '📊', xls: '📊',
  csv: '📊', txt: '📃', md: '📃',
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
  const updateKnowledgeBase = useStore((s) => s.updateKnowledgeBase);
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
        status: 'processing',
        enabled: true,
        uploadedAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      addKnowledgeDocument(doc);
      // Simulate processing completion
      setTimeout(() => {
        updateKnowledgeDocument(doc.id, { status: 'ready' });
      }, 2000 + Math.random() * 3000);
    });
    e.target.value = '';
  };

  const toggleDocEnabled = (docId: string, current: boolean) => {
    updateKnowledgeDocument(docId, { enabled: !current });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 flex items-center justify-between flex-shrink-0">
        <span className="text-xs text-gray-500">
          {knowledgeBases.length} 个知识库 / {knowledgeDocuments.length} 个文档
        </span>
        <button
          onClick={() => setShowAddKb(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-[#E85A2A] transition-colors"
        >
          <Plus className="w-4 h-4" />
          新建知识库
        </button>
      </div>

      <div className="flex-1 px-6 pb-6 min-h-0">
        <div className="flex gap-6 h-full">
          <KbSidebar
            knowledgeBases={knowledgeBases}
            documents={knowledgeDocuments}
            selectedId={selectedKbId}
            onSelect={setSelectedKbId}
            onDelete={handleDeleteKb}
          />
          <div className="flex-1 flex flex-col min-w-0">
            {selectedKb ? (
              <>
                <KbHeader
                  kb={selectedKb}
                  docCount={filteredDocs.length}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onImport={() => fileInputRef.current?.click()}
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
    </div>
  );
};

// ============ KbSidebar ============
const KbSidebar: React.FC<{
  knowledgeBases: KnowledgeBase[];
  documents: KnowledgeDocument[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
}> = ({ knowledgeBases, documents, selectedId, onSelect, onDelete }) => (
  <div className="w-56 flex-shrink-0">
    <div className="bg-white rounded-xl border border-gray-200 h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#FF6B35]" />
          知识库列表
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {knowledgeBases.map((kb) => {
          const docCount = documents.filter((d) => d.knowledgeBaseId === kb.id).length;
          return (
            <div key={kb.id} className="group relative">
              <button
                onClick={() => onSelect(kb.id)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors text-left',
                  selectedId === kb.id
                    ? 'bg-[#FF6B35]/10 text-[#FF6B35] font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: kb.color }} />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{kb.name}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{docCount} 个文档</div>
                </div>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(kb.id); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

// ============ KbHeader ============
const KbHeader: React.FC<{
  kb: KnowledgeBase;
  docCount: number;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onImport: () => void;
}> = ({ kb, docCount, searchQuery, onSearchChange, onImport }) => (
  <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 px-4 py-3">
    <div className="flex items-center gap-3 mb-3">
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: kb.color }} />
      <h2 className="text-sm font-semibold text-gray-900">{kb.name}</h2>
      {kb.description && <span className="text-xs text-gray-400">- {kb.description}</span>}
    </div>
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="搜索文档..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
        />
      </div>
      <span className="text-xs text-gray-500">共 {docCount} 个文档</span>
      <button
        onClick={onImport}
        className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-[#E85A2A] transition-colors"
      >
        <Upload className="w-4 h-4" />
        导入文档
      </button>
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
    <div className="grid grid-cols-[1fr_80px_100px_80px_60px] gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500">
      <span>文件名</span>
      <span>大小</span>
      <span>上传时间</span>
      <span>状态</span>
      <span>操作</span>
    </div>
    <div className="overflow-y-auto flex-1">
      {docs.map((doc) => (
        <DocRow key={doc.id} doc={doc} onToggle={onToggle} onDelete={onDelete} />
      ))}
      {docs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <FileText className="w-10 h-10 mb-3 text-gray-300" />
          <p className="text-sm">暂无文档</p>
          <p className="text-xs mt-1">点击“导入文档”添加文件</p>
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
}> = ({ doc, onToggle, onDelete }) => (
  <div className="grid grid-cols-[1fr_80px_100px_80px_60px] gap-2 px-4 py-2.5 items-center hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-b-0">
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-base flex-shrink-0">{FILE_TYPE_ICONS[doc.fileType] ?? '📄'}</span>
      <span className="text-sm text-gray-700 truncate">{doc.fileName}</span>
    </div>
    <span className="text-xs text-gray-500">{formatFileSize(doc.fileSize)}</span>
    <span className="text-xs text-gray-500">{doc.uploadedAt}</span>
    <div className="flex items-center gap-1.5">
      {doc.status === 'processing' && (
        <span className="inline-flex items-center gap-1 text-xs text-amber-600">
          <Loader2 className="w-3 h-3 animate-spin" />
          处理中
        </span>
      )}
      {doc.status === 'ready' && (
        <button
          onClick={() => onToggle(doc.id, doc.enabled)}
          className="inline-flex items-center gap-1 text-xs"
        >
          {doc.enabled ? (
            <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-600">已启用</span></>
          ) : (
            <><ToggleLeft className="w-5 h-5 text-gray-400" /><span className="text-gray-400">已禁用</span></>
          )}
        </button>
      )}
      {doc.status === 'error' && (
        <span className="inline-flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="w-3 h-3" />
          失败
        </span>
      )}
    </div>
    <button
      onClick={() => onDelete(doc.id)}
      className="inline-flex items-center px-1.5 py-1 text-xs text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  </div>
);

// ============ EmptyState ============
const EmptyState: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <div className="bg-white rounded-xl border border-gray-200 flex-1 flex flex-col items-center justify-center text-gray-400">
    <FolderOpen className="w-12 h-12 mb-4 text-gray-300" />
    <p className="text-sm font-medium text-gray-500">请选择或创建知识库</p>
    <p className="text-xs mt-1 mb-4">知识库用于存储AI员工的产品知识和FAQ内容</p>
    <button
      onClick={onAdd}
      className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-[#E85A2A] transition-colors"
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
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">新建知识库</h2>
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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-colors"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-colors"
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
