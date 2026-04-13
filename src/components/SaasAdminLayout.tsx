import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Package,
  CreditCard,
  Brain,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Activity,
  Zap,
  GitBranch,
  Timer,
  ToggleRight,
  Shield,
  BarChart3,
  Bell,
  Search,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  Check,
  Clock,
  Boxes,
  Cpu,
  Network,
  BadgeDollarSign,
  Receipt,
  Layers,
  ChevronLeft,
  MessageSquare,
  Lightbulb,
  Send,
  Users,
  Globe,
  Tag,
  BookOpen,
  Pencil,
  Trash2,
  Download,
  Upload,
  UserCircle,
  Lock,
  Unlock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type Section =
  | 'dashboard'
  | 'tenants'
  | 'packages'
  | 'addons'
  | 'ip'
  | 'billing'
  | 'payment'
  | 'ai-usage'
  | 'templates'
  | 'system'
  | 'permissions'
  | 'logs';

interface NavItem {
  id: Section;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: number;
  children?: { id: Section; label: string }[];
}

// ─── Nav Config ───────────────────────────────────────────────────────────────

const navItems: NavItem[] = [
  { id: 'dashboard', label: '概览大盘', icon: LayoutDashboard },
  { id: 'tenants', label: '租户管理', icon: Building2, badge: 3 },
  { id: 'packages', label: '套餐管理', icon: Package },
  { id: 'addons', label: '附加包管理', icon: Boxes },
  { id: 'ip', label: 'IP 管理', icon: Network },
  {
    id: 'billing',
    label: '计费模块',
    icon: Receipt,
    children: [
      { id: 'billing', label: '账单管理' },
      { id: 'payment', label: '支付流水' },
    ],
  },
  { id: 'ai-usage', label: 'AI 用量统计', icon: Brain },
  { id: 'templates', label: 'AI管理中心', icon: FileText },
  { id: 'system', label: '系统配置', icon: Settings },
  { id: 'permissions', label: '权限管理', icon: Shield },
  { id: 'logs', label: '日志管理', icon: BarChart3 },
];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const stats = [
  { label: '在线租户', value: '1,284', change: '+12', up: true, icon: Building2, color: '#FF6B35', bg: '#FFF5F0' },
  { label: '本月收入', value: '$48,320', change: '+8.4%', up: true, icon: BadgeDollarSign, color: '#10B981', bg: '#F0FDF4' },
  { label: 'AI 调用量', value: '9.2M', change: '+24.1%', up: true, icon: Cpu, color: '#6366F1', bg: '#EEF2FF' },
  { label: '7天内到期', value: '38', change: '需关注', up: false, icon: AlertCircle, color: '#F59E0B', bg: '#FFFBEB' },
];

const tenants = [
  { id: 'T001', name: 'Nova Global Ltd', plan: '专业版·年', ports: 20, expire: '2026-12-01', status: 'active', revenue: '$2,388' },
  { id: 'T002', name: '星耀电商科技', plan: '基础版·季', ports: 5, expire: '2026-04-18', status: 'warning', revenue: '$612' },
  { id: 'T003', name: 'SkyLink Agency', plan: '专业版·月', ports: 10, expire: '2026-04-30', status: 'active', revenue: '$796' },
  { id: 'T004', name: '汇盈跨境贸易', plan: '企业版·年', ports: 50, expire: '2027-01-15', status: 'active', revenue: '$8,400' },
  { id: 'T005', name: 'Bright Commerce', plan: '基础版·月', ports: 3, expire: '2026-04-08', status: 'expired', revenue: '$204' },
  { id: 'T006', name: '翼展数字营销', plan: '专业版·季', ports: 15, expire: '2026-06-22', status: 'active', revenue: '$1,836' },
];

const aiUsage = [
  { name: 'AI 销售回复', tokens: '3.2M', pct: 35, color: '#FF6B35' },
  { name: 'AI 聚合翻译', tokens: '2.8M', pct: 30, color: '#6366F1' },
  { name: 'AI 画像标签', tokens: '1.9M', pct: 21, color: '#10B981' },
  { name: 'AI 会话总结', tokens: '1.3M', pct: 14, color: '#F59E0B' },
];

const recentPayments = [
  { id: '#P2048', tenant: 'Nova Global Ltd', type: '套餐续费', amount: '+$796', time: '2分钟前', status: 'success' },
  { id: '#P2047', tenant: '星耀电商科技', type: 'AI加油包', amount: '+$49', time: '18分钟前', status: 'success' },
  { id: '#P2046', tenant: 'SkyLink Agency', type: 'IP购买', amount: '+$120', time: '1小时前', status: 'success' },
  { id: '#P2045', tenant: 'Bright Commerce', type: '套餐购买', amount: '+$204', time: '2小时前', status: 'pending' },
  { id: '#P2044', tenant: '汇盈跨境贸易', type: '端口扩展包', amount: '+$180', time: '3小时前', status: 'success' },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    active:  { label: '正常',   cls: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
    warning: { label: '即将到期', cls: 'bg-amber-50 text-amber-600 border border-amber-200' },
    expired: { label: '已到期', cls: 'bg-red-50 text-red-500 border border-red-200' },
    success: { label: '成功',   cls: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
    pending: { label: '处理中', cls: 'bg-blue-50 text-blue-500 border border-blue-200' },
  };
  const c = cfg[status] || cfg.active;
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', c.cls)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {c.label}
    </span>
  );
}

// ─── Dashboard Content ────────────────────────────────────────────────────────

function DashboardContent() {
  return (
    <div className="p-6 space-y-5">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: s.bg }}
                >
                  <Icon size={16} style={{ color: s.color }} />
                </div>
                <span
                  className={cn(
                    'flex items-center gap-0.5 text-xs font-medium',
                    s.up ? 'text-emerald-500' : 'text-amber-500'
                  )}
                >
                  {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {s.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
                {s.value}
              </div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-5 gap-4">
        {/* Tenant Table */}
        <div className="col-span-3 rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Building2 size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">租户列表</span>
              <span className="text-xs text-gray-400">({tenants.length})</span>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-[#FF6B35] hover:text-[#E85A2A] font-medium transition-colors">
              <Plus size={12} />
              新增租户
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/60">
                {['租户', '套餐', '端口', '到期日', '收入', '状态', ''].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs text-gray-400 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tenants.map((t, i) => (
                <tr
                  key={t.id}
                  className={cn(
                    'border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group',
                    i === tenants.length - 1 && 'border-b-0'
                  )}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: '#FF6B35' }}
                      >
                        {t.name[0]}
                      </div>
                      <div>
                        <div className="text-xs text-gray-800 font-medium">{t.name}</div>
                        <div className="text-[10px] text-gray-400">{t.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">{t.plan}</span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-gray-500">{t.ports}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-400">{t.expire}</td>
                  <td className="px-4 py-2.5 text-xs text-emerald-600 font-semibold">{t.revenue}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-2.5">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-500">
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="col-span-2 space-y-4">
          {/* AI Usage */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">AI 用量分布</span>
              <span className="ml-auto text-xs text-gray-400">本月 9.2M tokens</span>
            </div>
            <div className="space-y-3">
              {aiUsage.map((a) => (
                <div key={a.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500">{a.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{a.tokens}</span>
                      <span className="text-xs font-semibold" style={{ color: a.color }}>
                        {a.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${a.pct}%`, backgroundColor: a.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">最近支付</span>
            </div>
            <div className="space-y-3">
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                      p.status === 'success'
                        ? 'bg-emerald-50 border border-emerald-200'
                        : 'bg-blue-50 border border-blue-200'
                    )}
                  >
                    {p.status === 'success' ? (
                      <Check size={12} className="text-emerald-500" />
                    ) : (
                      <Clock size={12} className="text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-700 truncate font-medium">{p.tenant}</div>
                    <div className="text-[10px] text-gray-400">{p.type} · {p.time}</div>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold flex-shrink-0">
                    {p.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* 套餐分布 */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-4">
            <Package size={14} className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-700">套餐分布</span>
          </div>
          <div className="space-y-3">
            {[
              { name: '企业版', count: 89, color: '#FF6B35' },
              { name: '专业版', count: 342, color: '#6366F1' },
              { name: '基础版', count: 853, color: '#10B981' },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-12">{p.name}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(p.count / 1284) * 100}%`, backgroundColor: p.color }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right font-medium">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 系统健康 */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-700">系统健康</span>
            <span className="ml-auto flex items-center gap-1 text-xs text-emerald-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              正常运行
            </span>
          </div>
          <div className="space-y-3">
            {[
              { name: 'API 服务', latency: '42ms', ok: true },
              { name: 'AI 服务', latency: '186ms', ok: true },
              { name: 'VPN 节点', latency: '98ms', ok: true },
              { name: '支付回调', latency: '—', ok: false },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn('w-1.5 h-1.5 rounded-full', s.ok ? 'bg-emerald-400' : 'bg-amber-400')} />
                  <span className="text-xs text-gray-500">{s.name}</span>
                </div>
                <span className="text-xs text-gray-400">{s.latency}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 快速操作 */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-700">快速操作</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '新建租户', icon: Building2 },
              { label: '发布公告', icon: Bell },
              { label: '新增套餐', icon: Package },
              { label: '查看日志', icon: BarChart3 },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-orange-50 hover:border-[#FF6B35]/30 transition-all group"
                >
                  <Icon size={15} className="text-gray-400 group-hover:text-[#FF6B35] transition-colors" />
                  <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">{a.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Templates Content ────────────────────────────────────────────────────────

type TemplateSubPage =
  | 'persona-styles'
  | 'model-config'
  | 'intent-single'
  | 'intent-group'
  | 'script-welcome'
  | 'keyword-single'
  | 'keyword-group'
  | 'strategy-single'
  | 'strategy-group';

interface TemplateSceneItem {
  id: TemplateSubPage;
  label: string;
}
interface TemplateScene {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  items?: TemplateSceneItem[];
}

const templateScenes: TemplateScene[] = [
  {
    id: 'persona-styles', label: '角色人设', icon: UserCircle,
  },
  {
    id: 'model-config', label: '模型配置', icon: Cpu,
  },
  {
    id: 'intent', label: '意图库', icon: Lightbulb,
    items: [
      { id: 'intent-single', label: '单聊意图' },
      { id: 'intent-group', label: '群聊意图' },
    ],
  },
  {
    id: 'strategy', label: '策略库', icon: GitBranch,
    items: [
      { id: 'strategy-single', label: '单聊策略' },
      { id: 'strategy-group', label: '群聊策略' },
    ],
  },
  {
    id: 'script', label: '话术库', icon: MessageSquare,
    items: [
      { id: 'script-welcome', label: '欢迎语话术' },
    ],
  },
  {
    id: 'keyword', label: '关键词回复', icon: Tag,
    items: [
      { id: 'keyword-single', label: '单聊关键词' },
      { id: 'keyword-group', label: '群聊关键词' },
    ],
  },
];

const intentCategories = ['销售类', '售后类', '运营类'] as const;
type IntentCategory = typeof intentCategories[number];

const categoryColors: Record<IntentCategory, string> = {
  '销售类': 'bg-orange-50 text-[#FF6B35] border-orange-200',
  '售后类': 'bg-blue-50 text-blue-500 border-blue-200',
  '运营类': 'bg-emerald-50 text-emerald-600 border-emerald-200',
};

interface IntentScene {
  scene: string;
  script: string;
  locked: boolean;
}

interface Intent {
  id: number;
  name: string;
  category: IntentCategory;
  scenes: IntentScene[];
}

const mockIntents: Intent[] = [
  {
    id: 1, name: '询价意图', category: '销售类',
    scenes: [
      { scene: '含商品实体', script: '您问的{商品名}目前售价 $XX，现在购买还有折扣哦～', locked: false },
      { scene: '含其他实体', script: '{地区}地区运费另算，具体价格请告知您需要的规格', locked: false },
      { scene: '无实体', script: '请问您想了解哪款产品的价格？我来为您详细介绍', locked: false },
    ],
  },
  {
    id: 2, name: '产品咨询', category: '销售类',
    scenes: [
      { scene: '含商品实体', script: '{商品名}的详细参数是：{参数}，非常适合您的需求！', locked: false },
      { scene: '无实体', script: '我们有多款热销产品，请问您主要的使用场景是什么？', locked: false },
    ],
  },
  {
    id: 3, name: '退款意图', category: '售后类',
    scenes: [
      { scene: '含订单实体', script: '您的订单 {订单号} 退款申请已收到，1-3个工作日内处理完毕', locked: true },
      { scene: '无实体', script: '非常抱歉！请提供您的订单号，我来为您优先处理退款', locked: false },
    ],
  },
  {
    id: 4, name: '物流查询', category: '售后类',
    scenes: [
      { scene: '含订单实体', script: '您的订单 {订单号} 已于{发货时间}发出，快递单号：{单号}', locked: true },
      { scene: '无实体', script: '请提供您的订单号，我来查询最新物流状态', locked: false },
    ],
  },
  {
    id: 5, name: '投诉意图', category: '售后类',
    scenes: [
      { scene: '含商品实体', script: '非常抱歉{商品名}让您不满意！专属客服30分钟内联系您', locked: true },
      { scene: '无实体', script: '您的反馈我已记录，能详细描述遇到的问题吗？', locked: false },
    ],
  },
  {
    id: 6, name: '加群意图', category: '运营类',
    scenes: [
      { scene: '含平台实体', script: '欢迎加入{平台}VIP群！群内专属优惠第一时间通知：{群链接}', locked: false },
      { scene: '无实体', script: '欢迎加入我们的VIP社群，点击链接即可：{群链接}', locked: false },
    ],
  },
  {
    id: 7, name: '活动咨询', category: '运营类',
    scenes: [
      { scene: '含活动实体', script: '{活动名}活动详情：{活动内容}，截止{截止日期}，快来参与！', locked: false },
      { scene: '无实体', script: '我们目前正在进行多项优惠活动，请问您对哪类活动感兴趣？', locked: false },
    ],
  },
];

function IntentTable({ isGroup }: { isGroup?: boolean }) {
  const [activeCategory, setActiveCategory] = useState<IntentCategory | '全部'>('全部');
  const [intents, setIntents] = useState(mockIntents);

  const filtered = activeCategory === '全部'
    ? intents
    : intents.filter(i => i.category === activeCategory);

  const toggleSceneLock = (intentId: number, sceneIdx: number) => {
    setIntents(prev => prev.map(intent =>
      intent.id !== intentId ? intent : {
        ...intent,
        scenes: intent.scenes.map((s, si) => si === sceneIdx ? { ...s, locked: !s.locked } : s),
      }
    ));
  };

  return (
    <div className="p-6 space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        {/* Category tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(['全部', ...intentCategories] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-all',
                activeCategory === cat
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-48">
          <Search size={13} className="text-gray-400" />
          <input className="bg-transparent text-xs text-gray-600 placeholder:text-gray-300 outline-none w-full" placeholder="搜索意图名称..." />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-500 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-all">
            <Upload size={12} />批量导入
          </button>
          <button className="flex items-center gap-1.5 text-xs bg-[#FF6B35] text-white rounded-lg px-3 py-1.5 hover:bg-[#E85A2A] transition-all">
            <Plus size={12} />新增意图
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/60 border-b border-gray-100">
              {['意图名称', '类别', '场景', '话术', '操作'].map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'px-5 py-2.5 text-left text-xs text-gray-400 font-medium',
                    i === 2 && 'w-36',
                    i === 3 && 'w-96',
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((intent, i) => (
              <tr
                key={intent.id}
                className={cn(
                  'hover:bg-gray-50 transition-colors group align-top',
                  i < filtered.length - 1 && 'border-b border-gray-100'
                )}
              >
                {/* 意图名称 */}
                <td className="px-5 py-3 text-xs text-gray-800 font-medium whitespace-nowrap">
                  {intent.name}
                </td>

                {/* 类别 */}
                <td className="px-5 py-3">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium whitespace-nowrap', categoryColors[intent.category])}>
                    {intent.category}
                  </span>
                </td>

                {/* 场景列 */}
                <td className="px-5 py-3">
                  <div className="space-y-2.5">
                    {intent.scenes.map((s, si) => (
                      <div key={si} className="flex items-center">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                          {s.scene}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>

                {/* 话术列 */}
                <td className="px-5 py-3">
                  <div className="space-y-2.5">
                    {intent.scenes.map((s, si) => (
                      <div key={si} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 leading-relaxed line-clamp-1 flex-1">
                          {s.script}
                        </span>
                        <button
                          onClick={() => toggleSceneLock(intent.id, si)}
                          className={cn(
                            'flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap transition-all flex-shrink-0',
                            s.locked
                              ? 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
                              : 'bg-orange-50 border-orange-200 text-[#FF6B35] hover:bg-orange-100'
                          )}
                        >
                          {s.locked ? <Lock size={9} /> : <Unlock size={9} />}
                          {s.locked ? '精准锁定' : '随人设调整'}
                        </button>
                      </div>
                    ))}
                  </div>
                </td>

                {/* 操作 */}
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1">
                      <Send size={11} />下发
                    </button>
                    <button className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                      <Pencil size={11} />编辑
                    </button>
                    <button className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1">
                      <Trash2 size={11} />删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Deploy panel */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Send size={13} className="text-blue-400" />
          <span className="text-xs font-semibold text-blue-600">批量下发</span>
        </div>
        <div className="flex items-center gap-3">
          <select className="text-xs border border-blue-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 outline-none">
            <option>下发给全部租户</option>
            <option>下发给专业版+企业版</option>
            <option>指定租户</option>
          </select>
          <button className="text-xs bg-blue-500 text-white rounded-lg px-4 py-1.5 hover:bg-blue-600 transition-all">确认下发</button>
          <span className="text-xs text-blue-400">租户已有自定义版本不会被覆盖</span>
        </div>
      </div>
    </div>
  );
}

// ─── 角色人设 ──────────────────────────────────────────────────────────────────

interface PersonaStyle {
  id: number;
  styleName: string;
  desc: string;
  tags: string[];
  scripts: string[];
  scope: string;
  avatarBg: string;
  avatarText: string;
  source: '平台下发' | '企业自建';
  prompt: string;
  enabled: boolean;
}

const mockPersonaStyles: PersonaStyle[] = [
  {
    id: 1, styleName: '热情店长',
    desc: '以店长身份与客户沟通，态度热情诚恳，对品牌和产品很自信，有一定的品牌宣导性，适合30-45岁形象定位。',
    tags: ['热情', '自信', '品牌感'],
    scripts: ['亲，您眼光真好！这款是我们今年最热卖的，现在下单还有专属折扣哦～', '作为店长，我可以负责任地说，这绝对是目前性价比最高的选择！'],
    scope: '电商售前', avatarBg: 'from-orange-100 to-amber-100', avatarText: '店',
    source: '平台下发',
    prompt: `你是一位热情自信的品牌店长，年龄35-45岁，有丰富的零售经验。\n\n【性格特点】\n- 热情主动，见到顾客第一时间打招呼\n- 对自家产品充满信心，敢于直接推荐\n- 语气亲切，善用"亲""哦～""呢"等柔和语气词\n\n【沟通原则】\n1. 优先了解客户需求再做推荐\n2. 推荐时结合产品卖点和实际使用场景\n3. 遇到价格异议，强调性价比和品牌价值\n4. 不夸大产品功能，保持真实可信\n\n【禁止事项】\n- 不使用竞争对手品牌名称\n- 不承诺无法实现的功能或效果`,
    enabled: true,
  },
  {
    id: 2, styleName: '客户经理',
    desc: '一位门店客户经理，在25-35岁之间，话术感受留意适中，存在适当的语气词柔和话术，专业又不失亲和。',
    tags: ['专业', '亲和', '留意适中'],
    scripts: ['您好，感谢您的咨询。根据您的需求，我为您推荐以下几款方案，请参考。', '我完全理解您的顾虑，这边帮您详细说明一下各项差异，方便您做判断。'],
    scope: '门店服务', avatarBg: 'from-blue-100 to-indigo-100', avatarText: '经',
    source: '平台下发',
    prompt: `你是一位专业的门店客户经理，25-35岁，形象干练，服务周到。\n\n【性格特点】\n- 专业知识扎实，能准确回答产品技术问题\n- 语气温和有礼，不过分热情也不冷漠\n- 善于倾听，理解客户深层需求\n\n【沟通原则】\n1. 先倾听客户完整需求，不打断\n2. 提供2-3个方案供客户对比选择\n3. 用数据和案例支撑建议\n4. 保持跟进，让客户感受到被重视\n\n【话术风格】\n- 正式但不生硬，使用"您"称呼客户\n- 适当使用专业术语，但需解释清楚\n- 结尾常用"如有其他问题，随时联系我"`,
    enabled: true,
  },
  {
    id: 3, styleName: '专业极简',
    desc: '一位简洁高效的销售，在25-35岁之间，简洁明了地解答客户疑问，用最少的话传递最有效的信息，与客户高效沟通。',
    tags: ['简洁', '高效', '直接'],
    scripts: ['收到。订单号多少？', '已处理，3个工作日到账。如有问题请联系。'],
    scope: '通用客服', avatarBg: 'from-gray-100 to-slate-100', avatarText: '简',
    source: '平台下发',
    prompt: `你是一位高效简洁的客服专员，注重信息传递效率。\n\n【核心原则】\n- 每次回复不超过3句话\n- 直接给出解决方案，不做无效寒暄\n- 信息准确，不模糊表达\n\n【回复模板】\n问题类：[确认问题] + [给出答案/方案]\n操作类：[告知已处理] + [预期结果] + [后续联系方式]\n\n【禁止行为】\n- 不使用"您好，很高兴为您服务"等套话开场\n- 不重复客户已说过的信息\n- 不在问题未解决前说"感谢您的耐心等待"`,
    enabled: true,
  },
  {
    id: 4, styleName: '甜美主播',
    desc: '一位美女主播，年龄在24-28岁之间，语气温柔可爱，温和地解答客户疑问，让客户体验良好，适合直播电商场景。',
    tags: ['温柔', '可爱', '互动感强'],
    scripts: ['哇～宝宝们这款真的超级好用！我自己用了一个月啦，皮肤状态杠杠的～🌟', '姐妹不用担心，这个我们支持7天无理由的，放心入手吧！比心心～💕'],
    scope: '直播电商', avatarBg: 'from-pink-100 to-rose-100', avatarText: '播',
    source: '平台下发',
    prompt: `你是一位活泼可爱的直播带货主播，24-28岁女生，风格甜美。\n\n【人设定位】\n- 像闺蜜一样真诚分享产品体验\n- 语气充满活力，善用语气词和emoji\n- 制造紧迫感（限时/库存紧张）推动转化\n\n【话术要素】\n1. 开头：用"宝宝们""姐妹""亲爱的"拉近距离\n2. 产品介绍：结合亲身体验，突出使用感受\n3. 促单话术：强调活动截止、库存数量\n4. 售后保障：主动提及退换货政策消除顾虑\n\n【语言风格】\n- 多用叠词：好好用、美美的、稳稳当当\n- 适度使用emoji：🌟💕✨😍🛒\n- 句尾常用语："真的真的""不骗你""绝绝子"`,
    enabled: true,
  },
  {
    id: 5, styleName: '售后专家',
    desc: '专注售后问题处理，语气沉稳有耐心，善于安抚情绪、推动问题解决，具备强烈的责任感和服务意识。',
    tags: ['耐心', '共情', '解决导向'],
    scripts: ['非常抱歉给您带来了不好的体验，请您放心，我会全程跟进直到问题解决。', '您的反馈非常重要，我已将问题标记为优先处理，今日内给您答复。🙏'],
    scope: '售后服务', avatarBg: 'from-emerald-100 to-teal-100', avatarText: '后',
    source: '企业自建',
    prompt: `你是一位经验丰富的售后服务专家，以解决问题为最高优先级。\n\n【核心能力】\n- 快速识别问题类型：质量问题/物流问题/操作问题/退换货\n- 先安抚情绪，再解决问题\n- 给出明确的处理时限和跟进节点\n\n【处理流程】\n1. 表达歉意（真诚，不敷衍）\n2. 确认问题细节（订单号、问题描述、图片）\n3. 给出解决方案（优先级：换货>退款>维修>补偿）\n4. 告知处理时限，并主动跟进\n\n【禁止行为】\n- 不推卸责任给客户或物流\n- 不说"这不在我们责任范围内"\n- 不让客户反复说明同一个问题`,
    enabled: false,
  },
  {
    id: 6, styleName: '种草姐妹',
    desc: '以闺蜜口吻分享好物体验，擅长用真实感受种草，语气活泼有感染力，善用生活场景引发共鸣，让客户产生强烈的购买欲。',
    tags: ['种草', '真实感', '感染力'],
    scripts: ['姐妹！这个我已经回购三次了，真的用了就回不去了，你一定要试试！✨', '不夸张，上次我同事看到我用这个，当场就问我链接，现在我们办公室人手一个😂'],
    scope: '社交电商', avatarBg: 'from-violet-100 to-purple-100', avatarText: '草',
    source: '平台下发',
    prompt: `你是一位真实可信的生活博主，擅长用自身经历种草好物。\n\n【人设核心】\n- 真实用户身份，不是"官方客服"\n- 用第一人称分享亲身体验\n- 善于找到产品与生活场景的结合点\n\n【种草技巧】\n1. 场景代入：描述使用场景让人产生共鸣\n2. 细节描写：具体的使用感受比笼统夸奖更有说服力\n3. 社交证明：引用朋友/同事的使用反馈\n4. 对比强调：和同类产品对比突出优势\n\n【语言风格】\n- 口语化，有真实聊天感\n- 适度使用感叹号和省略号制造节奏感\n- 常用句式："不夸张""真的真的""你懂那种感觉吗"`,
    enabled: true,
  },
];

function PersonaTable() {
  const [styles, setStyles] = useState(mockPersonaStyles);
  const [selected, setSelected] = useState<number | null>(1);
  const [editingPrompt, setEditingPrompt] = useState<PersonaStyle | null>(null);
  const [promptDraft, setPromptDraft] = useState('');

  const toggleEnabled = (id: number) => {
    setStyles(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  const openPromptEditor = (e: React.MouseEvent, p: PersonaStyle) => {
    e.stopPropagation();
    setEditingPrompt(p);
    setPromptDraft(p.prompt);
  };

  const savePrompt = () => {
    if (!editingPrompt) return;
    setStyles(prev => prev.map(p => p.id === editingPrompt.id ? { ...p, prompt: promptDraft } : p));
    setEditingPrompt(null);
  };

  const activeStyle = styles.find(p => p.id === selected);
  const unlockedCount = 14;
  const lockedCount = 6;

  return (
    <div className="p-6 space-y-5">
      {/* 当前人设影响提示 */}
      {activeStyle && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
          <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0 text-sm font-bold text-gray-500', activeStyle.avatarBg)}>
            {activeStyle.avatarText}
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold text-gray-700">默认风格：{activeStyle.styleName}</span>
            <span className="text-xs text-gray-400 ml-2">将影响 <span className="text-[#FF6B35] font-medium">{unlockedCount} 条未锁定话术</span>的输出风格</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Unlock size={11} className="text-[#FF6B35]" />{unlockedCount} 条随人设调整</span>
            <span className="flex items-center gap-1"><Lock size={11} className="text-gray-400" />{lockedCount} 条精准锁定</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <p className="text-xs text-gray-400">选择一种话术风格作为 AI 员工的默认沟通方式，影响所有未锁定话术的输出</p>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-500 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-all">
            <Plus size={12} />自定义风格
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {styles.map(p => (
          <div
            key={p.id}
            onClick={() => setSelected(p.id === selected ? null : p.id)}
            className={cn(
              'relative rounded-xl border bg-white cursor-pointer transition-all overflow-hidden',
              selected === p.id
                ? 'border-[#FF6B35] shadow-md shadow-orange-100 ring-1 ring-[#FF6B35]/20'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            )}
          >
            {/* 激活标记 */}
            {selected === p.id ? (
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#FF6B35] text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                <svg width="8" height="6" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                默认风格
              </div>
            ) : (
              <div className="absolute top-3 right-3 text-[10px] text-gray-300 border border-gray-200 px-2 py-0.5 rounded-full">
                点击激活
              </div>
            )}

            {/* 头部：头像 + 标题 */}
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-start gap-3 mb-3">
                <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 text-base font-bold text-gray-500', p.avatarBg)}>
                  {p.avatarText}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-800">{p.styleName}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
            </div>

            {/* 话术示例 */}
            <div className="px-5 pb-4 space-y-1.5">
              <p className="text-[10px] text-gray-300 font-medium uppercase tracking-wide mb-2">话术示例</p>
              {p.scripts.map((s, si) => (
                <div key={si} className={cn(
                  'text-xs text-gray-500 rounded-lg px-3 py-2 leading-relaxed border',
                  selected === p.id ? 'bg-orange-50/60 border-orange-100' : 'bg-gray-50 border-gray-100'
                )}>{s}</div>
              ))}
            </div>

            {/* 底部：场景 + 编辑提示词 + 开关 */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <span className="text-[11px] text-gray-400">{p.scope}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={e => openPromptEditor(e, p)}
                  className="text-[11px] text-gray-400 hover:text-[#FF6B35] flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-orange-50"
                >
                  <Pencil size={10} />提示词
                </button>
                <button
                  onClick={e => { e.stopPropagation(); toggleEnabled(p.id); }}
                  className={cn('relative inline-flex h-5 w-9 items-center rounded-full transition-colors', p.enabled ? 'bg-[#FF6B35]' : 'bg-gray-200')}
                >
                  <span className={cn('inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform', p.enabled ? 'translate-x-4' : 'translate-x-0.5')} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 提示词编辑抽屉 */}
      {editingPrompt && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setEditingPrompt(null)} />
          <div className="relative ml-auto w-[520px] h-full bg-white shadow-2xl flex flex-col">
            {/* 抽屉头部 */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-sm font-bold text-gray-500', editingPrompt.avatarBg)}>
                  {editingPrompt.avatarText}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{editingPrompt.styleName}</p>
                  <p className="text-xs text-gray-400">编辑提示词</p>
                </div>
              </div>
              <button onClick={() => setEditingPrompt(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* 说明 */}
            <div className="flex-shrink-0 mx-6 mt-4 mb-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
              <p className="text-xs text-blue-600 leading-relaxed">
                提示词定义了 AI 员工的人格、沟通风格和行为规则。修改后将影响该风格下所有未锁定的话术输出。
              </p>
            </div>

            {/* 编辑区 */}
            <div className="flex-1 min-h-0 px-6 pb-4">
              <textarea
                value={promptDraft}
                onChange={e => setPromptDraft(e.target.value)}
                className="w-full h-full resize-none text-sm text-gray-700 leading-relaxed border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] bg-gray-50/40 placeholder:text-gray-300 font-mono"
                placeholder="请输入提示词..."
                spellCheck={false}
              />
            </div>

            {/* 底部操作 */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">{promptDraft.length} 字符</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPromptDraft(editingPrompt.prompt)}
                  className="text-xs text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  重置
                </button>
                <button
                  onClick={savePrompt}
                  className="text-xs bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#E85A2A] transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 模型配置 ───────────────────────────────────────────────────────────────────

const MODEL_OPTIONS = [
  { value: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI', color: 'text-green-600' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini', provider: 'OpenAI', color: 'text-green-500' },
  { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', provider: 'Anthropic', color: 'text-orange-500' },
  { value: 'claude-3-haiku', label: 'Claude 3 Haiku', provider: 'Anthropic', color: 'text-orange-400' },
  { value: 'deepseek-v3', label: 'DeepSeek-V3', provider: 'DeepSeek', color: 'text-blue-500' },
  { value: 'qwen-max', label: '通义千问 Max', provider: '阿里云', color: 'text-purple-500' },
  { value: 'ernie-4', label: '文心一言 4.0', provider: '百度', color: 'text-sky-500' },
];

interface SceneModelConfig {
  id: string;
  scene: string;
  desc: string;
  model: string;
}

function ModelConfigContent() {
  const [configs, setConfigs] = useState<SceneModelConfig[]>([
    { id: 'reply', scene: '对话回复与策略', desc: '智能客服日常对话与自动回复', model: 'claude-3-5-sonnet' },
    { id: 'translate', scene: '智能翻译', desc: '多语言实时翻译功能', model: 'gpt-4o-mini' },
    { id: 'summary', scene: '会话总结与分析', desc: '长对话摘要与日报生成', model: 'deepseek-v3' },
    { id: 'intent', scene: '意图识别', desc: '用户意图分析与标签打标', model: 'gpt-4o-mini' },
    { id: 'sentiment', scene: '情感分析', desc: '客户情绪实时识别与预警', model: 'claude-3-haiku' },
    { id: 'profile', scene: 'AI画像', desc: '客户画像标签智能提取', model: 'deepseek-v3' },
  ]);
  const [saved, setSaved] = useState(false);

  const updateModel = (id: string, model: string) =>
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, model } : c));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">默认模型设置</h2>
          <p className="text-xs text-gray-400 mt-0.5">为每个 AI 使用场景指定默认调用的大语言模型</p>
        </div>
        <button
          onClick={handleSave}
          className={cn(
            'flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg transition-all',
            saved
              ? 'bg-green-50 text-green-600 border border-green-200'
              : 'bg-[#FF6B35] text-white hover:bg-[#E85A2A]'
          )}
        >
          {saved ? <><Check size={12} />已保存</> : '保存配置'}
        </button>
      </div>

      {/* Model legend */}
      <div className="flex flex-wrap gap-2">
        {MODEL_OPTIONS.map(m => (
          <div key={m.value} className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1">
            <span className={cn('text-[10px] font-semibold', m.color)}>{m.provider}</span>
            <span className="text-[10px] text-gray-500">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Config table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/60 border-b border-gray-100">
              {['场景', '功能说明', '默认模型', '模型厂商'].map(h => (
                <th key={h} className="px-5 py-2.5 text-left text-xs text-gray-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {configs.map((c, i) => {
              const selectedModel = MODEL_OPTIONS.find(m => m.value === c.model);
              return (
                <tr key={c.id} className={cn('border-b border-gray-50 hover:bg-gray-50/50 transition-colors', i === configs.length - 1 && 'border-b-0')}>
                  <td className="px-5 py-3">
                    <span className="text-xs font-medium text-gray-800">{c.scene}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-400">{c.desc}</td>
                  <td className="px-5 py-3">
                    <select
                      value={c.model}
                      onChange={e => updateModel(c.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 outline-none hover:border-gray-300 focus:border-[#FF6B35] transition-colors cursor-pointer"
                    >
                      {MODEL_OPTIONS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    {selectedModel && (
                      <span className={cn('text-xs font-medium', selectedModel.color)}>{selectedModel.provider}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Note */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <AlertCircle size={13} className="text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-500 leading-relaxed">
          此处配置的模型为平台侧默认值。租户可在其账号内覆盖各场景的模型选择（需对应套餐权限）。
          修改后将对未自定义的租户即时生效。
        </p>
      </div>
    </div>
  );
}

// ─── 策略库 ────────────────────────────────────────────────────────────────────

type StrategyCategory = '运营类' | '销售类' | '售后类';
type StrategyTrigger = '用户行为' | '时间条件' | '订单状态';

const strategyCategoryColors: Record<StrategyCategory, string> = {
  '运营类': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  '销售类': 'bg-orange-50 text-[#FF6B35] border-orange-200',
  '售后类': 'bg-blue-50 text-blue-500 border-blue-200',
};

const strategyTriggerColors: Record<StrategyTrigger, string> = {
  '用户行为': 'bg-violet-50 text-violet-500 border-violet-200',
  '时间条件': 'bg-amber-50 text-amber-600 border-amber-200',
  '订单状态': 'bg-sky-50 text-sky-500 border-sky-200',
};

interface Strategy {
  id: number;
  name: string;
  category: StrategyCategory;
  triggerType: StrategyTrigger;
  triggerDesc: string;
  action: string;
  scripts: string[];
  locked: boolean;
  source: '平台下发' | '企业自建';
  enabled: boolean;
}

const mockStrategies: Strategy[] = [
  { id: 1, name: '24小时未回消息召回', category: '运营类', triggerType: '时间条件', triggerDesc: '用户超过24小时未回复消息', action: '自动发送召回话术，提醒用户继续对话', scripts: ['嗨～好久不见！有什么我可以帮您的吗？😊', '您上次咨询的问题还没解决？随时欢迎回来聊聊～'], locked: false, source: '平台下发', enabled: true },
  { id: 2, name: '新用户激活策略', category: '运营类', triggerType: '用户行为', triggerDesc: '新用户首次发起会话后未完成购买', action: '24小时后推送新人专属优惠券并引导下单', scripts: ['欢迎新朋友！专属新人优惠已为您准备好，点击领取立享9折优惠 🎁', '第一次来？这里有份新手礼包送给您，限时24小时哦～'], locked: false, source: '平台下发', enabled: true },
  { id: 3, name: '下单未付款催付', category: '销售类', triggerType: '订单状态', triggerDesc: '用户创建订单后30分钟内未完成支付', action: '发送催付提醒，附带限时优惠截止倒计时', scripts: ['您的订单还在等待付款中，库存有限，赶快完成支付吧！⏰', '温馨提示：您的订单将在30分钟后自动取消，点击这里立即支付'], locked: true, source: '平台下发', enabled: true },
  { id: 4, name: '老客户复购激活', category: '销售类', triggerType: '时间条件', triggerDesc: '上次购买距今超过60天且无新订单', action: '发送专属回购优惠，关联上次购买品类推荐', scripts: ['好久不见～根据您的喜好，这些新品您可能会喜欢 👀', '老朋友回来啦！专属85折优惠码：BACK85，有效期3天'], locked: false, source: '企业自建', enabled: false },
  { id: 5, name: '售后超时跟进', category: '售后类', triggerType: '时间条件', triggerDesc: '售后工单超过48小时未处理', action: '自动提醒客服跟进，并向用户发送安抚话术', scripts: ['非常抱歉让您久等了！您的问题我们正在优先处理，预计今天内给您答复 🙏', '感谢您的耐心等待，售后团队将在2小时内联系您'], locked: true, source: '平台下发', enabled: true },
  { id: 6, name: '加购未下单提醒', category: '销售类', triggerType: '用户行为', triggerDesc: '用户将商品加入购物车后超过2小时未下单', action: '发送购物车提醒，附带库存紧张提示', scripts: ['您购物车里的商品还在等您～库存仅剩最后几件了 🛒', '提醒您：购物车商品库存紧张，赶快下单锁定吧！'], locked: false, source: '企业自建', enabled: true },
];

const mockGroupStrategies: Strategy[] = [
  { id: 1, name: '群内沉默唤醒', category: '运营类', triggerType: '时间条件', triggerDesc: '群内超过48小时无人发言', action: '发送话题引导，激活群内讨论', scripts: ['大家好久不见啦～今天给大家带来一个福利活动，快来看看吧！🎉', '群里的朋友们，最近有什么想聊的吗？欢迎留言～'], locked: false, source: '平台下发', enabled: true },
  { id: 2, name: '新成员入群欢迎', category: '运营类', triggerType: '用户行为', triggerDesc: '新成员加入群组', action: '自动发送欢迎语并介绍群规', scripts: ['欢迎新朋友 @{昵称} 加入！请先阅读群公告，有任何问题随时@我 😊', '新人入群福利：发送"领取"即可获得专属优惠券！🎁'], locked: false, source: '平台下发', enabled: true },
  { id: 3, name: '群内活动预热', category: '销售类', triggerType: '时间条件', triggerDesc: '活动开始前24小时', action: '群发活动预热通知', scripts: ['⏰ 明天活动倒计时！全场8折，记得准时参加～', '好消息！明天10点整开抢，先到先得，名额有限！'], locked: true, source: '平台下发', enabled: true },
  { id: 4, name: '群内投诉处理', category: '售后类', triggerType: '用户行为', triggerDesc: '群内出现投诉关键词', action: '及时回应并引导私聊处理', scripts: ['非常抱歉给您带来不好的体验！麻烦私信客服，我们第一时间帮您处理 🙏'], locked: true, source: '企业自建', enabled: true },
];

function StrategyTable({ isGroup = false }: { isGroup?: boolean }) {
  const [activeCategory, setActiveCategory] = useState<StrategyCategory | '全部'>('全部');
  const [activeSource, setActiveSource] = useState<'全部' | '平台下发' | '企业自建'>('全部');
  const [strategies, setStrategies] = useState(isGroup ? mockGroupStrategies : mockStrategies);

  const filtered = strategies.filter(s =>
    (activeCategory === '全部' || s.category === activeCategory) &&
    (activeSource === '全部' || s.source === activeSource)
  );

  const toggleEnabled = (id: number) => {
    setStrategies(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const toggleLocked = (id: number) => {
    setStrategies(prev => prev.map(s => s.id === id ? { ...s, locked: !s.locked } : s));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(['全部', '运营类', '销售类', '售后类'] as const).map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={cn('px-3 py-1 rounded-md text-xs font-medium transition-all',
                activeCategory === cat ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}>{cat}</button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(['全部', '平台下发', '企业自建'] as const).map(s => (
            <button key={s} onClick={() => setActiveSource(s)}
              className={cn('px-3 py-1 rounded-md text-xs font-medium transition-all',
                activeSource === s ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}>{s}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-44">
          <Search size={13} className="text-gray-400" />
          <input className="bg-transparent text-xs text-gray-600 placeholder:text-gray-300 outline-none w-full" placeholder="搜索策略名称..." />
        </div>
        <div className="ml-auto">
          <button className="flex items-center gap-1.5 text-xs bg-[#FF6B35] text-white rounded-lg px-3 py-1.5 hover:bg-[#E85A2A] transition-all">
            <Plus size={12} />新增策略
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/60 border-b border-gray-100">
              {['策略名称', '类别', '触发类型', '触发条件', '执行动作', '策略话术', '状态', '下发租户', '操作'].map((h, i) => (
                <th key={h} className={cn('px-4 py-2.5 text-left text-xs text-gray-400 font-medium', i === 3 && 'w-40', i === 4 && 'w-40', i === 5 && 'w-60')}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} className={cn('hover:bg-gray-50 transition-colors group align-top', i < filtered.length - 1 && 'border-b border-gray-100')}>
                <td className="px-4 py-3 text-xs text-gray-800 font-medium whitespace-nowrap">{s.name}</td>
                <td className="px-4 py-3">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium whitespace-nowrap', strategyCategoryColors[s.category])}>{s.category}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border whitespace-nowrap', strategyTriggerColors[s.triggerType])}>{s.triggerType}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 leading-relaxed">{s.triggerDesc}</td>
                <td className="px-4 py-3 text-xs text-gray-500 leading-relaxed">{s.action}</td>
                <td className="px-4 py-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between mb-1">
                      <button
                        onClick={() => toggleLocked(s.id)}
                        className={cn('flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md border transition-all',
                          s.locked
                            ? 'bg-gray-100 text-gray-500 border-gray-200'
                            : 'bg-orange-50 text-[#FF6B35] border-orange-200'
                        )}
                      >
                        {s.locked ? <Lock size={9} /> : <Unlock size={9} />}
                        {s.locked ? '精准锁定' : '随人设调整'}
                      </button>
                    </div>
                    {s.scripts.map((script, si) => (
                      <div key={si} className={cn(
                        'text-xs text-gray-500 rounded-lg px-2.5 py-1.5 leading-relaxed border',
                        s.locked ? 'bg-gray-50 border-gray-100' : 'bg-orange-50/50 border-orange-100'
                      )}>{script}</div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleEnabled(s.id)}
                    className={cn('relative inline-flex h-5 w-9 items-center rounded-full transition-colors', s.enabled ? 'bg-[#FF6B35]' : 'bg-gray-200')}>
                    <span className={cn('inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform', s.enabled ? 'translate-x-4' : 'translate-x-0.5')} />
                  </button>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">全部租户</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"><Pencil size={11} />编辑</button>
                    <button className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1"><Trash2 size={11} />删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TemplateSubPageContent({ page }: { page: TemplateSubPage }) {
  if (page === 'persona-styles') {
    return <PersonaTable />;
  }
  if (page === 'model-config') {
    return <ModelConfigContent />;
  }
  if (page === 'strategy-single' || page === 'strategy-group') {
    return <StrategyTable isGroup={page === 'strategy-group'} />;
  }

  // 意图库 → 平铺表格，场景/话术多行对齐
  if (page === 'intent-single' || page === 'intent-group') {
    return <IntentTable isGroup={page === 'intent-group'} />;
  }

  // 欢迎语话术 & 关键词回复 → 通用表格
  const isWelcome = page === 'script-welcome';
  const colLabel = isWelcome ? '触发关键词' : '触发关键词';
  const addLabel = isWelcome ? '新增话术' : '新增关键词';
  const initialRows = isWelcome
    ? [
        { name: '新用户欢迎语', content: '首次进入, 开始对话, hello', scope: '通用', platform: '全平台', scripts: ['您好，欢迎来到 {店铺名}！有什么可以帮助您的吗？', '嗨！很高兴见到您～有什么我可以帮忙的吗？😊'], locked: false },
        { name: '节假日欢迎语', content: '节日快乐, 新年好, 过年', scope: '通用', platform: '全平台', scripts: ['节日快乐！我们正在开展限时优惠活动，欢迎了解～🎉'], locked: true },
        { name: '深夜自动回复', content: '夜间, 晚上好, 深夜', scope: '通用', platform: '全平台', scripts: ['您好！当前为非工作时间，客服将于明日 9:00 为您服务，感谢理解！', '您的留言已收到，我们将在工作时间第一时间回复您 🌙'], locked: true },
      ]
    : [
        { name: '价格咨询', content: '多少钱, 价格, 报价, how much', scope: '售前', platform: '全平台', scripts: ['您好！{商品名}目前售价 $XX，现在购买还有折扣哦～', '请问您想了解哪款产品的价格？我来为您详细介绍'], locked: false },
        { name: '退款申请', content: '退款, 退货, refund', scope: '售后', platform: '全平台', scripts: ['非常抱歉！请提供您的订单号，我来为您优先处理退款 🙏', '您的退款申请已收到，1-3个工作日内处理完毕'], locked: true },
        { name: '物流查询', content: '发货了吗, 快递, 到了吗', scope: '售中', platform: '全平台', scripts: ['您的订单预计 {X} 天内到达，快递单号：{快递号}', '您好！您的包裹正在运输中，预计明天到达～'], locked: false },
      ];
  const [rows, setRows] = useState(initialRows);
  const toggleRowLock = (i: number) => setRows(prev => prev.map((r, ri) => ri === i ? { ...r, locked: !r.locked } : r));

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 flex-1 max-w-xs">
          <Search size={13} className="text-gray-400" />
          <input className="bg-transparent text-xs text-gray-600 placeholder:text-gray-300 outline-none w-full" placeholder="搜索..." />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-500 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-all">
            <Upload size={12} />批量导入
          </button>
          <button className="flex items-center gap-1.5 text-xs bg-[#FF6B35] text-white rounded-lg px-3 py-1.5 hover:bg-[#E85A2A] transition-all">
            <Plus size={12} />{addLabel}
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/60 border-b border-gray-100">
              {['名称', colLabel, '适用范围', '适用平台', '话术', '操作'].map(h => (
                <th key={h} className="px-5 py-2.5 text-left text-xs text-gray-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={cn('border-b border-gray-50 hover:bg-gray-50 transition-colors group', i === rows.length - 1 && 'border-b-0')}>
                <td className="px-5 py-3 text-xs text-gray-800 font-medium">{r.name}</td>
                <td className="px-5 py-3 text-xs text-gray-400 max-w-[200px] truncate">{r.content}</td>
                <td className="px-5 py-3">
                  <span className="text-xs bg-orange-50 text-[#FF6B35] border border-orange-200 px-2 py-0.5 rounded-full">{r.scope}</span>
                </td>
                <td className="px-5 py-3 text-xs text-gray-500">{r.platform}</td>
                <td className="px-5 py-3">
                  <div className="space-y-1.5">
                    <button
                      onClick={() => toggleRowLock(i)}
                      className={cn('flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md border transition-all mb-1',
                        r.locked
                          ? 'bg-gray-100 text-gray-500 border-gray-200'
                          : 'bg-orange-50 text-[#FF6B35] border-orange-200'
                      )}
                    >
                      {r.locked ? <Lock size={9} /> : <Unlock size={9} />}
                      {r.locked ? '精准锁定' : '随人设调整'}
                    </button>
                    {r.scripts.map((s, si) => (
                      <div key={si} className={cn(
                        'text-xs text-gray-500 rounded-lg px-2.5 py-1.5 leading-relaxed border',
                        r.locked ? 'bg-gray-50 border-gray-100' : 'bg-orange-50/50 border-orange-100'
                      )}>{s}</div>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"><Send size={11} />下发</button>
                    <button className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"><Pencil size={11} />编辑</button>
                    <button className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1"><Trash2 size={11} />删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Send size={13} className="text-blue-400" />
          <span className="text-xs font-semibold text-blue-600">批量下发</span>
        </div>
        <div className="flex items-center gap-3">
          <select className="text-xs border border-blue-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 outline-none">
            <option>下发给全部租户</option>
            <option>下发给专业版+企业版</option>
            <option>指定租户</option>
          </select>
          <button className="text-xs bg-blue-500 text-white rounded-lg px-4 py-1.5 hover:bg-blue-600 transition-all">确认下发</button>
          <span className="text-xs text-blue-400">租户已有自定义版本不会被覆盖</span>
        </div>
      </div>
    </div>
  );
}

function TemplatesContent() {
  const [activeScene, setActiveScene] = useState<string>('intent');
  const [activePage, setActivePage] = useState<TemplateSubPage>('intent-single');
  const [expandedScenes, setExpandedScenes] = useState<Set<string>>(
    new Set(templateScenes.map(s => s.id))
  );

  const toggleScene = (id: string) => {
    setExpandedScenes(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const currentScene = templateScenes.find(s =>
    s.id === activePage || s.items?.some(i => i.id === activePage)
  );
  const currentItem = currentScene?.items?.find(i => i.id === activePage)
    ?? (currentScene?.id === activePage ? { id: activePage, label: currentScene.label } : undefined);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Scene sidebar */}
      <div className="w-48 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="py-3">
          {templateScenes.map(scene => {
            const Icon = scene.icon;
            const isLeaf = !scene.items || scene.items.length === 0;
            const isExpanded = expandedScenes.has(scene.id);
            const isSceneActive = isLeaf ? activePage === scene.id : scene.items?.some(i => i.id === activePage);
            return (
              <div key={scene.id}>
                {/* Scene header */}
                <button
                  onClick={() => isLeaf ? (setActivePage(scene.id as TemplateSubPage), setActiveScene(scene.id)) : toggleScene(scene.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors',
                    isSceneActive
                      ? isLeaf ? 'text-[#1677ff] bg-blue-50' : 'text-gray-800'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <Icon size={13} className={cn(isSceneActive ? 'text-[#FF6B35]' : 'text-gray-400')} />
                  <span className="flex-1 text-left">{scene.label}</span>
                  {!isLeaf && (
                    <ChevronDown
                      size={12}
                      className={cn('text-gray-300 transition-transform duration-200', isExpanded && 'rotate-180')}
                    />
                  )}
                  {isLeaf && isSceneActive && (
                    <span className="absolute right-0 top-0 bottom-0 w-0.5 bg-blue-500 rounded-l-full" />
                  )}
                </button>

                {/* Sub items */}
                {!isLeaf && isExpanded && (
                  <div className="mb-1">
                    {scene.items!.map(item => (
                      <button
                        key={item.id}
                        onClick={() => { setActivePage(item.id); setActiveScene(scene.id); }}
                        className={cn(
                          'w-full flex items-center text-left px-4 py-2 text-xs transition-all relative',
                          activePage === item.id
                            ? 'text-[#1677ff] bg-blue-50 font-medium'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        {activePage === item.id && (
                          <span className="absolute right-0 top-0 bottom-0 w-0.5 bg-blue-500 rounded-l-full" />
                        )}
                        <span className="pl-5">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* Sub header */}
        <div className="flex items-center gap-2 px-6 py-3 bg-white border-b border-gray-100">
          <span className="text-xs text-gray-400">{currentScene?.label}</span>
          {currentItem && currentItem.id !== currentScene?.id && (
            <>
              <ChevronRight size={12} className="text-gray-300" />
              <span className="text-xs font-medium text-gray-700">{currentItem.label}</span>
            </>
          )}
        </div>
        <TemplateSubPageContent page={activePage} />
      </div>
    </div>
  );
}

// ─── Placeholder ───────────────────────────────────────────────────────────────

function PlaceholderContent({ section }: { section: Section }) {
  const labels: Record<Section, string> = {
    dashboard: '概览大盘', tenants: '租户管理', packages: '套餐管理',
    addons: '附加包管理', ip: 'IP 管理', billing: '计费模块',
    payment: '支付流水', 'ai-usage': 'AI 用量统计', templates: '内容模板管理',
    system: '系统配置', permissions: '权限管理', logs: '日志管理',
  };
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-300">
      <Layers size={40} className="mb-3" />
      <div className="text-sm text-gray-400">{labels[section]}</div>
      <div className="text-xs mt-1 text-gray-300">功能开发中</div>
    </div>
  );
}

// ─── Main Layout ───────────────────────────────────────────────────────────────

export function SaasAdminLayout() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [expandedItems, setExpandedItems] = useState<Set<Section>>(new Set(['billing']));
  const [collapsed, setCollapsed] = useState(false);

  const toggleExpand = (id: Section) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleNav = (id: Section, hasChildren?: boolean) => {
    if (hasChildren) toggleExpand(id);
    else setActiveSection(id);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          'flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0',
          collapsed ? 'w-16' : 'w-56'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          {!collapsed ? (
            <>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">洽</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">洽小秘</p>
                  <p className="text-[10px] text-gray-400">SAAS 总控端</p>
                </div>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setCollapsed(false)}
              className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center mx-auto"
            >
              <span className="text-white font-bold text-sm">洽</span>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = !!item.children?.length;
            const isExpanded = expandedItems.has(item.id);
            const isActive =
              activeSection === item.id ||
              item.children?.some((c) => c.id === activeSection);

            return (
              <div key={item.id}>
                <button
                  onClick={() => handleNav(item.id, hasChildren)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                    collapsed && 'justify-center px-0',
                    isActive
                      ? 'bg-[#FFF5F0] text-[#FF6B35] font-medium'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Icon size={15} className="flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left text-xs">{item.label}</span>
                      {item.badge && (
                        <span className="bg-[#FF6B35] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                          {item.badge}
                        </span>
                      )}
                      {hasChildren && (
                        <ChevronDown
                          size={12}
                          className={cn('transition-transform duration-200 text-gray-400', isExpanded && 'rotate-180')}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Sub items */}
                {hasChildren && isExpanded && !collapsed && (
                  <div className="ml-3 mt-0.5 pl-3 border-l border-gray-100 space-y-0.5">
                    {item.children!.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => setActiveSection(child.id)}
                        className={cn(
                          'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all',
                          activeSection === child.id
                            ? 'text-[#FF6B35] bg-[#FFF5F0] font-medium'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        <ChevronRight size={10} />
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User */}
        {!collapsed && (
          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors">
              <div className="w-7 h-7 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-700 font-medium truncate">超级管理员</div>
                <div className="text-[10px] text-gray-400 truncate">admin@chatbiz.io</div>
              </div>
              <LogOut size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
            </div>
          </div>
        )}
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-4 px-6 py-3 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 flex-1 max-w-xs">
            <Search size={13} className="text-gray-400" />
            <input
              className="bg-transparent text-xs text-gray-600 placeholder:text-gray-300 outline-none w-full"
              placeholder="搜索租户、订单..."
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              <Bell size={14} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FF6B35] rounded-full" />
            </button>

          </div>
        </header>

        {/* Page header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white flex-shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-gray-800">
              {navItems.find((n) => n.id === activeSection || n.children?.some((c) => c.id === activeSection))?.label ?? '概览大盘'}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {activeSection === 'dashboard' ? '实时数据 · 每30秒更新' : '洽小秘 SAAS 总控端'}
            </p>
          </div>
          {activeSection === 'dashboard' && (
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-all">
              <ArrowUpRight size={12} />
              导出报表
            </button>
          )}
        </div>

        {/* Content */}
        <div className={cn('flex-1 overflow-hidden', activeSection !== 'templates' && 'overflow-y-auto')}>
          {activeSection === 'dashboard' ? (
            <DashboardContent />
          ) : activeSection === 'templates' ? (
            <TemplatesContent />
          ) : (
            <PlaceholderContent section={activeSection} />
          )}
        </div>
      </main>
    </div>
  );
}
