import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Search,
  Trash2,
  ChevronDown,
  Plus,
  Send,
  BookOpen,
  Globe,
  File,
  Loader2,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── 类型 ─────────────────────────────────────────────────────────────────────

type KnowledgeStatus = 'ready' | 'processing' | 'failed';
type KnowledgeType = 'file' | 'url' | 'text';

interface KnowledgeItem {
  id: string;
  title: string;
  answer: string;
  type: KnowledgeType;
  source: string;
  status: KnowledgeStatus;
  chunks: number;
  size: string;
  createdAt: string;
  validFrom: string;
  validTo: string;
  tags: string[];
}

type ChatMessage =
  | { role: 'assistant'; text: string; options?: string[] }
  | { role: 'user'; text: string }
  | { role: 'system'; item: KnowledgeItem };

// ─── Mock 数据 ────────────────────────────────────────────────────────────────

const mockKnowledge: KnowledgeItem[] = [
  {
    id: '1',
    title: '全新奥迪Q5L 2026款价格及配置',
    answer: '全新奥迪Q5L 2026款共4款配置：\n• 35TFSI 时尚动感型：官方指导价 34.98万元\n• 40TFSI 豪华动感型：官方指导价 39.98万元\n• 40TFSI 臻选动感型：官方指导价 43.98万元\n• 45TFSI quattro 旗舰型：官方指导价 49.98万元\n\n当前终端优惠约4-6万元，落地价约30-44万元（视地区经销商而定）。',
    type: 'file', source: '奥迪Q5L 2026款产品手册.pdf',
    status: 'ready', chunks: 8, size: '4.2 MB', createdAt: '2026-01-01',
    validFrom: '2026-01-01', validTo: '2026-12-31',
    tags: ['Q5L', '价格', '配置'],
  },
  {
    id: '2',
    title: '奥迪Q5L 发动机与动力参数',
    answer: '35TFSI：2.0T四缸涡轮增压，最大功率150kW（204马力），峰值扭矩320N·m，7速S tronic双离合变速箱，0-100km/h加速7.9秒，综合油耗6.8L/100km。\n\n40TFSI/45TFSI：2.0T四缸涡轮增压，最大功率185kW（252马力），峰值扭矩370N·m，7速S tronic，0-100km/h加速6.3秒，综合油耗7.2L/100km。\n\n45TFSI quattro额外搭载奥迪四驱系统，可在前后轴之间动态分配扭矩。',
    type: 'file', source: '奥迪Q5L 2026款产品手册.pdf',
    status: 'ready', chunks: 5, size: '4.2 MB', createdAt: '2026-01-01',
    validFrom: '2026-01-01', validTo: '2026-12-31',
    tags: ['Q5L', '发动机', '技术参数'],
  },
  {
    id: '3',
    title: 'Q5L 内饰材质与工艺',
    answer: '座椅：豪华动感型及以上标配Valcona真皮座椅，皮革经过Stuttgart Nappa鞣制工艺处理，手感细腻柔软；旗舰型升级菱形绗缝工艺。\n\n内饰面板：仿木纹镶嵌件（豪华型）/ 真实橡木木纹（臻选及以上），表面经12道抛光工艺。\n\n顶棚：标配Alcantara翻毛皮顶棚，吸音系数提升18%。\n\n方向盘：真皮包裹三辐式多功能方向盘，旗舰型升级Nappa皮+加热功能。',
    type: 'file', source: '奥迪Q5L 2026款产品手册.pdf',
    status: 'ready', chunks: 4, size: '4.2 MB', createdAt: '2026-01-01',
    validFrom: '2026-01-01', validTo: '2026-12-31',
    tags: ['Q5L', '内饰', '材质工艺'],
  },
  {
    id: '4',
    title: '2026春节限时购车优惠方案',
    answer: '春节钜惠（2026年1月20日—2月28日）：\n• 综合优惠最高至6万元（含厂家补贴+经销商让利）\n• 置换补贴：旧车换新额外补贴14,000元现金\n• 金融方案：首付20%，36期0息，月供最低2,899元起\n• 赠品包：赠送原厂全车脚垫+行车记录仪+5次免费保养套餐（价值约8,000元）\n• 老用户专属：同款增购再享5,000元忠诚礼金',
    type: 'text', source: '2026春节促销活动方案.docx',
    status: 'ready', chunks: 3, size: '—', createdAt: '2026-01-15',
    validFrom: '2026-01-20', validTo: '2026-02-28',
    tags: ['优惠', '春节', '限时'],
  },
  {
    id: '5',
    title: '奥迪A5L 车身尺寸及外观工艺',
    answer: '车身尺寸：长×宽×高 = 5,049×1,902×1,461mm，轴距3,098mm（较A5加长110mm）。\n\n车身工艺：\n• 外覆盖件铝钢混合车身，铝合金占比47%，整备质量仅1,720kg\n• 前翼子板、发动机盖、车顶全铝材质，防腐蚀电泳镀层处理\n• 风阻系数Cd=0.23，同级最低\n• 标配LED大灯，旗舰版升级OLED矩阵大灯（像素达1,300万）\n• 可选三色车漆：冰川白、神秘黑、曜岩灰（金属漆+2,800元）',
    type: 'file', source: 'A5L产品详情页_2026.pdf',
    status: 'ready', chunks: 6, size: '3.8 MB', createdAt: '2026-01-10',
    validFrom: '2026-01-01', validTo: '2026-12-31',
    tags: ['A5L', '外观', '工艺'],
  },
  {
    id: '6',
    title: '售后保修政策说明',
    answer: '整车质保：3年或10万公里（以先到为准），官方授权服务中心全国联保。\n\n动力总成质保：5年或15万公里（发动机、变速箱、差速器）。\n\n车身钣金防穿孔质保：12年不限里程。\n\n免费保养：首次1,000km免费检测；之后每10,000km或12个月（以先到为准）进行定期保养，工时费全免，前3次机油机滤材料费由厂家承担。\n\n道路救援：全年7×24小时免费道路救援，覆盖全国3,200+城市。',
    type: 'file', source: '2026奥迪售后服务手册.pdf',
    status: 'ready', chunks: 9, size: '2.1 MB', createdAt: '2026-01-05',
    validFrom: '2026-01-01', validTo: '2026-12-31',
    tags: ['质保', '售后', '保养'],
  },
  {
    id: '7',
    title: '奥迪Q5L 智能驾驶辅助配置',
    answer: 'L2+级智驾（臻选及以上标配）：\n• ACC自适应巡航（全速域，0-160km/h）\n• 车道居中保持+主动变道辅助\n• 交通拥堵辅助（低速跟车自动刹停）\n• HUD抬头显示（全彩，投影面积等效10英寸）\n• 360°全景影像+透明底盘\n• 自动泊车系统（支持垂直/平行/斜列车位）\n• 疲劳预警+前后方碰撞预警+盲区监测',
    type: 'url', source: 'https://www.audi.cn/q5l/tech',
    status: 'ready', chunks: 7, size: '—', createdAt: '2026-01-08',
    validFrom: '2026-01-01', validTo: '2026-12-31',
    tags: ['Q5L', '智驾', '配置'],
  },
  {
    id: '8',
    title: '新客首购专属礼包内容',
    answer: '【驰享新程礼】适用人群：从未购买过奥迪品牌车辆的新客户。\n\n礼包内容：\n① 0首付金融方案（限指定车型，需提交征信，12期免息）\n② 原厂行车记录仪一台（型号：奥迪A8 4K版，市售价2,490元）\n③ 原厂镀晶套餐一次（含车身镀晶+内饰深度清洁，价值3,800元）\n④ 5年道路救援会员卡（全国通用）\n⑤ 奥迪驾驶学院体验课1次（赛道驾驶体验日）\n\n领取方式：到店交定金即可激活，提车当日兑换礼包。',
    type: 'text', source: '新客专属活动说明.docx',
    status: 'ready', chunks: 2, size: '—', createdAt: '2026-01-15',
    validFrom: '2026-01-01', validTo: '2026-06-30',
    tags: ['新客', '礼包', '促销'],
  },
];

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

const typeIcon = (type: KnowledgeType) => {
  if (type === 'file') return File;
  if (type === 'url') return Globe;
  return FileText;
};

// ─── 对话式导入面板 ───────────────────────────────────────────────────────────

const WELCOME: ChatMessage = {
  role: 'assistant',
  text: '你好！我来帮你添加知识到知识库。请选择导入方式：',
  options: ['📄 上传文件', '🔗 导入网址', '✏️ 直接输入文本'],
};

const ImportChat: React.FC<{ onImported: (item: KnowledgeItem) => void }> = ({ onImported }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<'choose' | 'file' | 'url' | 'text' | 'naming' | 'tagging' | 'done'>('choose');
  const [pending, setPending] = useState<Partial<KnowledgeItem>>({});
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const addAssistant = (text: string, options?: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', text, options }]);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }, 600);
  };

  const addUser = (text: string) => {
    setMessages(prev => [...prev, { role: 'user', text }]);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const handleOption = (opt: string) => {
    addUser(opt);
    if (step === 'choose') {
      if (opt.includes('上传文件')) {
        setStep('file');
        addAssistant('请上传文件（支持 PDF、Word、TXT、Excel），我会自动解析内容。');
        setTimeout(() => fileInputRef.current?.click(), 700);
      } else if (opt.includes('导入网址')) {
        setStep('url');
        addAssistant('请输入要导入的网址，我会自动抓取页面内容：');
      } else {
        setStep('text');
        addAssistant('请直接输入或粘贴文本内容，完成后发送：');
      }
    } else if (step === 'naming') {
      if (opt === '使用默认名称') {
        proceedToTag(pending.title || '未命名知识');
      }
    } else if (step === 'tagging') {
      const tagMap: Record<string, string[]> = {
        '售前咨询': ['售前', '产品'],
        '售后服务': ['售后', '政策'],
        '通用知识': ['通用'],
        '自定义': [],
      };
      const tags = tagMap[opt] ?? [];
      finishImport(tags);
    }
  };

  const proceedToTag = (title: string) => {
    setPending(p => ({ ...p, title }));
    setStep('tagging');
    addAssistant(`好的，知识名称为"${title}"。请选择标签分类：`, ['售前咨询', '售后服务', '通用知识', '自定义']);
  };

  const finishImport = (tags: string[]) => {
    const today = new Date().toISOString().slice(0, 10);
    const nextYear = `${new Date().getFullYear() + 1}-12-31`;
    const item: KnowledgeItem = {
      id: Date.now().toString(),
      title: pending.title || '未命名知识',
      answer: '（内容处理中，完成后将自动更新）',
      type: pending.type || 'text',
      source: pending.source || '手动输入',
      status: 'processing',
      chunks: 0,
      size: pending.size || '—',
      createdAt: today,
      validFrom: today,
      validTo: nextYear,
      tags,
    };
    setMessages(prev => [...prev, { role: 'system', item }]);
    setStep('done');
    onImported(item);
    addAssistant('已加入知识库，正在后台处理。处理完成后即可被 AI 引用。\n\n还需要添加更多知识吗？', ['继续添加', '完成']);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    addUser(text);

    if (step === 'url') {
      setPending({ type: 'url', source: text, title: new URL(text.startsWith('http') ? text : 'https://' + text).hostname });
      setStep('naming');
      addAssistant(`已获取网址内容。建议名称：「${new URL(text.startsWith('http') ? text : 'https://' + text).hostname}」，是否使用？`, ['使用默认名称', '自定义名称']);
    } else if (step === 'text') {
      const preview = text.slice(0, 20) + (text.length > 20 ? '...' : '');
      setPending({ type: 'text', source: '手动输入', title: preview, size: `${new Blob([text]).size} B` });
      setStep('naming');
      addAssistant(`收到文本内容（${text.length} 字符）。建议名称：「${preview}」，是否使用？`, ['使用默认名称', '自定义名称']);
    } else if (step === 'naming') {
      proceedToTag(text);
    } else if (step === 'done') {
      if (text.includes('继续') || text.includes('添加')) {
        setStep('choose');
        addAssistant('好的！请选择导入方式：', ['📄 上传文件', '🔗 导入网址', '✏️ 直接输入文本']);
      } else {
        addAssistant('好的，知识库已更新完毕！AI 员工会自动引用这些知识回答客户问题。');
      }
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addUser(`已选择文件：${file.name}`);
    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
      : `${(file.size / 1024).toFixed(0)} KB`;
    setPending({ type: 'file', source: file.name, title: file.name.replace(/\.[^.]+$/, ''), size: sizeStr });
    setStep('naming');
    addAssistant(`已上传「${file.name}」（${sizeStr}）。建议名称：「${file.name.replace(/\.[^.]+$/, '')}」，是否使用？`, ['使用默认名称', '自定义名称']);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-full">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg, i) => {
          if (msg.role === 'system') {
            const badge = statusBadge(msg.item.status);
            const Icon = typeIcon(msg.item.type);
            return (
              <div key={i} className="flex justify-center">
                <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm max-w-sm w-full">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{msg.item.title}</p>
                    <p className="text-[10px] text-gray-400">{msg.item.source}</p>
                  </div>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap', badge.cls)}>
                    {badge.label}
                  </span>
                </div>
              </div>
            );
          }

          if (msg.role === 'assistant') {
            return (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6B35] to-orange-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <BookOpen className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="max-w-[80%] space-y-2">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{msg.text}</p>
                  </div>
                  {msg.options && (
                    <div className="flex flex-wrap gap-2">
                      {msg.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleOption(opt)}
                          className="text-xs px-3 py-1.5 bg-white border border-[#FF6B35]/30 text-[#FF6B35] rounded-full hover:bg-[#FF6B35]/5 transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div key={i} className="flex justify-end">
              <div className="max-w-[70%] bg-[#FF6B35] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF6B35] to-orange-400 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map(d => (
                  <div key={d} className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* 输入区 */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white flex items-center gap-2">
        <input
          ref={fileInputRef as React.RefObject<HTMLInputElement>}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
          onChange={handleFile}
          className="hidden"
        />
        <button
          onClick={() => { setStep('file'); fileInputRef.current?.click(); }}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#FF6B35] hover:border-[#FF6B35]/40 transition-colors flex-shrink-0"
          title="上传文件"
        >
          <Upload className="w-3.5 h-3.5" />
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="输入内容或网址，按 Enter 发送…"
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] focus:bg-white placeholder:text-gray-300 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-8 h-8 rounded-xl bg-[#FF6B35] flex items-center justify-center text-white hover:bg-[#E85A2A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ─── 知识列表 ─────────────────────────────────────────────────────────────────

const KnowledgeList: React.FC<{ items: KnowledgeItem[]; onDelete: (id: string) => void }> = ({ items, onDelete }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const pageSize = 10;

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.answer.toLowerCase().includes(search.toLowerCase()) ||
    i.tags.some(t => t.includes(search))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex flex-col h-full">
      {/* 工具栏 */}
      <div className="flex-shrink-0 px-5 py-3 border-b border-gray-100 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
          <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="您可搜索问题/答案/知识来源"
            className="bg-transparent text-xs text-gray-600 placeholder:text-gray-300 outline-none w-full"
          />
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          冲突量 <span className="font-semibold text-gray-700">25</span>
          <span className="mx-2 text-gray-200">|</span>
          知识量 <span className="font-semibold text-gray-700">{items.length}</span>
        </span>
      </div>

      {/* 卡片列表 */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
        {paged.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2 pt-20">
            <BookOpen className="w-8 h-8" />
            <p className="text-sm">暂无知识，请通过左侧对话导入</p>
          </div>
        ) : paged.map(item => {
          const isExpanded = expanded.has(item.id);
          const lines = item.answer.split('\n');
          const needsToggle = lines.length > 4;
          const displayAnswer = (!needsToggle || isExpanded) ? item.answer : lines.slice(0, 4).join('\n') + '…';
          return (
          <div key={item.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 hover:shadow-sm transition-shadow">
            {/* 标题 */}
            <p className="text-sm font-semibold text-gray-800 mb-1.5">{item.title}</p>
            {/* 内容 */}
            <p className="text-sm text-gray-500 leading-relaxed mb-1 whitespace-pre-line">{displayAnswer}</p>
            {needsToggle && (
              <button
                onClick={() => setExpanded(prev => {
                  const next = new Set(prev);
                  isExpanded ? next.delete(item.id) : next.add(item.id);
                  return next;
                })}
                className="text-xs text-[#FF6B35] hover:underline mb-2"
              >
                {isExpanded ? '收起' : '展开全部'}
              </button>
            )}
            {/* 有效期 + 操作 */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">
                生效时间：{item.validFrom} 至 {item.validTo}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />删除
                </button>
                <span className="text-gray-200">|</span>
                <button className="text-xs text-gray-400 hover:text-[#FF6B35] flex items-center gap-1 transition-colors">
                  <Eye className="w-3 h-3" />我要修改
                </button>
                <span className="text-gray-200">|</span>
                <span className="text-xs text-gray-400 flex items-center gap-1.5">
                  此条解析效果如何？
                  <button className="hover:text-emerald-500 transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                  </button>
                  <button className="hover:text-red-400 transition-colors">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
                      <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                    </svg>
                  </button>
                </span>
              </div>
            </div>
            {/* 知识来源 */}
            <div className="mt-2.5 pt-2.5 border-t border-gray-50">
              <p className="text-[11px] text-gray-400 truncate">
                <span className="text-gray-500 font-medium">知识来源：</span>{item.source}
              </p>
            </div>
          </div>
        );})}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex-shrink-0 px-5 py-3 border-t border-gray-100 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30"
          >
            <ChevronDown className="w-3.5 h-3.5 rotate-90" />
          </button>
          <span className="text-xs text-gray-500">{page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30"
          >
            <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
          </button>
        </div>
      )}
    </div>
  );
};

// ─── 主页面 ───────────────────────────────────────────────────────────────────

export const KnowledgeBasePage: React.FC = () => {
  const [items, setItems] = useState<KnowledgeItem[]>(mockKnowledge);

  const handleImported = (item: KnowledgeItem) => {
    setItems(prev => [item, ...prev]);
    // 模拟处理完成
    setTimeout(() => {
      setItems(prev => prev.map(i =>
        i.id === item.id ? { ...i, status: 'ready', chunks: Math.floor(Math.random() * 50) + 10 } : i
      ));
    }, 3000);
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="h-full flex overflow-hidden bg-white">
      {/* 左侧：对话导入 */}
      <div className="w-[420px] flex-shrink-0 border-r border-gray-100 flex flex-col bg-gray-50/40">
        <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#FF6B35]" />
            <h3 className="text-sm font-semibold text-gray-800">对话式导入</h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">通过对话引导，快速上传文件、网址或文本</p>
        </div>
        <div className="flex-1 min-h-0">
          <ImportChat onImported={handleImported} />
        </div>
      </div>

      {/* 右侧：知识列表 */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-800">知识库列表</h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">AI 员工将自动引用以下知识回答客户问题</p>
        </div>
        <div className="flex-1 min-h-0">
          <KnowledgeList items={items} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
