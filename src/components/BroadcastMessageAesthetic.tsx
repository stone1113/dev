import React, { useMemo, useState } from 'react';
import { X, Search, Send, Wand2, Sparkles, Clock, Calendar, Eye } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { generateMessage, optimizeMessage } from '@/lib/aiService';
import { suggestSendTime } from '@/lib/scheduler';
import { cn } from '@/lib/utils';

interface Props {
  onClose?: () => void;
}

export const BroadcastMessageAesthetic: React.FC<Props> = ({ onClose }) => {
  const { conversations, getPlatformAccounts, selectedPlatform } = useStore();
  const agents = selectedPlatform !== 'all' ? getPlatformAccounts(selectedPlatform) : [];

  const contacts = useMemo(() => Array.from(
    new Map(conversations.map(c => [c.customer.id, { ...c.customer, convoId: c.id }])).values()
  ), [conversations]);

  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [aiPrompt, setAiPrompt] = useState('');
  const [variants, setVariants] = useState<string[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [scheduled, setScheduled] = useState<{ date?: string; time?: string }>({});

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) || c.id.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (id: string) => {
    const s = new Set(selectedIds);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelectedIds(s);
  };

  const generate = async () => {
    if (!aiPrompt && selectedIds.size === 0) return;
    setIsBusy(true);
    try {
      const selectedTexts = Array.from(selectedIds).map(id => {
        const conv = conversations.find(c => c.customer.id === id);
        return conv?.aiSummary || conv?.messages?.slice(-1)?.[0]?.content || '';
      }).filter(Boolean);
      const vs = await generateMessage({ prompt: aiPrompt, knowledgeTexts: selectedTexts, maxVariants: 3 });
      setVariants(vs);
      setSelectedVariant(0);
    } finally { setIsBusy(false); }
  };

  const optimize = async () => {
    if (!message) return;
    setIsBusy(true);
    try {
      const opt = await optimizeMessage(message, 'friendly');
      setVariants([opt]);
      setSelectedVariant(0);
    } finally { setIsBusy(false); }
  };

  const adopt = (idx = 0) => {
    setMessage(variants[idx] || '');
    setVariants([]);
  };

  const applySmartSchedule = () => {
    const prefs = Array.from(selectedIds).map(id => conversations.find(c => c.customer.id === id)?.customer.behaviorAnalysis?.preferredContactTime).filter(Boolean) as string[];
    const { date, time } = suggestSendTime(prefs);
    setScheduled({ date, time });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/40 to-black/30">
      <div className="w-[95vw] max-w-[1100px] bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-12">
        <div className="col-span-3 p-4 bg-gradient-to-b from-[#FFF8F5] to-white border-r border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FF6B35] flex items-center justify-center text-white font-semibold">AI</div>
              <div>
                <div className="text-sm font-medium">创建群发</div>
                <div className="text-[12px] text-gray-500">审美风格 · 简洁优雅</div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100"><X className="w-4 h-4" /></button>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-2">选择账号</div>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {agents.map(a => (
                <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-100">
                  <img src={a.avatar} className="w-8 h-8 rounded-full" />
                  <div className="flex-1 text-sm truncate">{a.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-5 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索联系人 / ID" className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <button onClick={() => { setSelectedIds(new Set(filtered.map(c=>c.id))); }} className="px-3 py-2 text-sm bg-[#FF6B35] text-white rounded-lg">全选</button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {filtered.map(c => (
              <div key={c.id} onClick={() => toggle(c.id)} className={cn('flex items-center gap-3 p-3 rounded-xl cursor-pointer', selectedIds.has(c.id) ? 'bg-[#FFF8F5] border border-[#FF6B35]' : 'bg-white border border-gray-100') }>
                <img src={c.avatar} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="text-sm font-medium truncate">{c.name}</div>
                  <div className="text-[12px] text-gray-400">{c.id}</div>
                </div>
                <div className="text-[12px] text-gray-500">{c.language || 'zh'}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4 p-5 border-l border-gray-100 flex flex-col gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-2">AI 智能生成</div>
            <div className="flex gap-2">
              <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="描述要发送的内容或使用选中客户摘要" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <button onClick={generate} disabled={isBusy} className="px-3 py-2 bg-[#FF6B35] text-white rounded-lg flex items-center gap-2"><Wand2 className="w-4 h-4"/>生成</button>
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={optimize} disabled={isBusy || !message} className="px-3 py-1 text-sm border border-[#FF6B35] text-[#FF6B35] rounded-lg">优化当前</button>
              <button onClick={() => { setVariants([]); setMessage(''); }} className="px-3 py-1 text-sm text-gray-500 rounded-lg">清空</button>
            </div>
          </div>

          {variants.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">AI 备选</div>
                <div className="text-xs text-gray-500">点击采纳或预览</div>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {variants.map((v, i) => (
                  <div key={i} onClick={() => setSelectedVariant(i)} className={cn('p-3 rounded-md cursor-pointer', selectedVariant===i? 'bg-white border border-[#FF6B35]':'bg-white/90 border border-gray-100') }>
                    <div className="text-sm text-gray-800">{v}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => adopt(selectedVariant)} className="px-3 py-2 bg-[#FF6B35] text-white rounded-lg flex-1">采纳</button>
                <button onClick={() => setVariants([])} className="px-3 py-2 text-sm text-gray-500">关闭</button>
              </div>
            </div>
          )}

          <div>
            <div className="text-xs text-gray-500 mb-2">群发内容预览</div>
            <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="在此编辑最终内容" className="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg text-sm resize-none" />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">发送时间</div>
              <div className="text-xs text-gray-400">智能调度支持</div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input type="date" value={scheduled.date || ''} onChange={e => setScheduled(s=>({...s,date:e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input type="time" value={scheduled.time || ''} onChange={e => setScheduled(s=>({...s,time:e.target.value}))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <button onClick={applySmartSchedule} className="ml-auto px-3 py-2 bg-[#FF6B35] text-white rounded-lg flex items-center gap-2"><Sparkles className="w-4 h-4"/>推荐</button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-auto">
            <button className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-sm text-gray-700 flex items-center justify-center gap-2"><Clock className="w-4 h-4"/>存为草稿</button>
            <button className="flex-1 px-4 py-3 rounded-lg bg-[#FF6B35] text-white text-sm flex items-center justify-center gap-2"><Send className="w-4 h-4"/>开始群发</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastMessageAesthetic;
