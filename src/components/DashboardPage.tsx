import React, { useState } from 'react';
import {
  Key, FileText, Activity, List, BarChart3,
  Crown, ClipboardList,
  TrendingUp, Calendar, ChevronRight, Circle, ChevronDown,
  Ban, CheckCircle2, RotateCcw, PackageOpen,
  Bot, BookOpen, Tags, Brain, Sparkles, MessageSquare,
  Clock, Languages, Users, Settings, Eye
} from 'lucide-react';
import { useStore } from '@/store/useStore';

/*
 * 色彩规范 - 仅使用以下色值：
 * 主题色：#FF6B35 / #E85A2A / #FF8F5E / #FFB088 / #FFD4BE / #FFF7F3
 * 中性色：#1A1A1A / #333 / #666 / #999 / #B3B3B3 / #D9D9D9 / #E8E8E8 / #F2F2F2 / #F7F8FA / #FFF
 */

export const DashboardPage: React.FC = () => {
  const activationCodes = useStore((s) => s.activationCodes);
  const topCodes = activationCodes.slice(0, 5);
  const [selectedPlatform, setSelectedPlatform] = useState('全部平台');
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('今日');

  const platforms = ['全部平台', 'WhatsApp', 'Telegram', 'Line', 'Instagram', 'Facebook', 'WeChat', 'Email', 'SMS', 'TikTok', 'Twitter', 'Shopify'];

  return (
    <div className="h-full overflow-y-auto bg-[#F7F8FA]">
      {/* ── 顶部用户信息栏 ── */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8F5E] text-white px-8 py-5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 min-w-0 shrink-0">
            <div className="w-11 h-11 bg-white/20 backdrop-blur rounded-full flex items-center justify-center ring-2 ring-white/30">
              <span className="text-base font-semibold">L</span>
            </div>
            <div>
              <div className="font-medium text-[15px]">linmianbao@outlook.com</div>
              <div className="text-xs text-white/70 mt-0.5">2026-03-21 14:18:06</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 flex-1">
            {[
              { label: '在线端口数', value: '1' },
              { label: '占用端口', value: '5' },
              { label: '剩余端口', value: '0' },
              { label: '总端口', value: '5' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-[11px] text-white/80 tracking-wide">{item.label}</div>
                <div className="text-xl font-bold mt-0.5 text-white">{item.value}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="px-4 py-1.5 text-sm bg-[#1A1A1A] hover:bg-[#333] text-white rounded-md transition-all">
              续费
            </button>
            <button className="px-4 py-1.5 text-sm bg-white text-[#FF6B35] font-medium rounded-md hover:bg-white/90 transition-all shadow-sm">
              增加端口
            </button>
            <button className="px-4 py-1.5 text-sm bg-[#1A1A1A] hover:bg-[#333] text-white rounded-md transition-all">
              更换套餐
            </button>
            <div className="ml-1 w-9 h-9 bg-white/15 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* ── 订阅信息 ── */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-base font-semibold text-[#1A1A1A] mb-4">订阅信息</h2>
            <div className="grid grid-cols-6 gap-4">
              <SubscriptionItem icon={Crown} label="当前套餐" value="专业版" highlight />
              <SubscriptionItem icon={Calendar} label="到期时间" value="2026-12-31" />
              <SubscriptionItem icon={Key} label="激活码" value="QXMS2024DEMO" />
              <SubscriptionItem icon={MessageSquare} label="会话端口" value={<><span className="text-[#FF6B35]">13</span> / 10</>} />
              <SubscriptionItem icon={Bot} label="AI绑定" value={<><span className="text-[#FF6B35]">9 个账号</span> / 17</>} />
              <SubscriptionItem icon={Users} label="组织" value="示例企业" />
            </div>
          </div>
        </div>

        {/* ── AI 员工今日数据 ── */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-[#1A1A1A]">AI 员工今日数据</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                  className="text-xs text-[#666] bg-white border border-[#E8E8E8] rounded-md px-3 py-1.5 pr-8 cursor-pointer hover:border-[#FF6B35] transition-colors flex items-center gap-2"
                >
                  {selectedPlatform}
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showPlatformDropdown && (
                  <div className="absolute z-50 mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto min-w-[120px]">
                    {platforms.map((platform) => (
                      <div
                        key={platform}
                        onClick={() => { setSelectedPlatform(platform); setShowPlatformDropdown(false); }}
                        className={`px-3 py-2 text-xs cursor-pointer transition-colors ${
                          selectedPlatform === platform ? 'bg-[#FF6B35] text-white' : 'text-[#666] hover:bg-[#FFF7F3]'
                        }`}
                      >
                        {platform}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center bg-[#F2F2F2] rounded-md border border-[#E8E8E8] p-0.5">
                {['今日', '本周', '本月'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                      selectedTimeRange === range
                        ? 'bg-white text-[#FF6B35] shadow-sm'
                        : 'text-[#666] hover:text-[#333]'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4">
            <AIMetricCard icon={Users} label="接待人数" value="156" />
            <AIMetricCard icon={Sparkles} label="AI生成回复" value="298" />
            <AIMetricCard icon={FileText} label="AI生成总结" value="134" />
            <AIMetricCard icon={Tags} label="AI标签提取" value="312" />
            <AIMetricCard icon={Clock} label="会话平均响应" value="12s" />
            <AIMetricCard icon={Languages} label="翻译次数" value="87" />
          </div>
        </div>

        {/* ── AI接待统计 ── */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-[#1A1A1A]">AI接待统计</h2>
            <div className="flex items-center gap-2">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="text-xs text-[#666] bg-white border border-[#E8E8E8] rounded-md px-3 py-1.5 pr-8 cursor-pointer hover:border-[#FF6B35] transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23999%22%20d%3D%22M10.293%203.293L6%207.586%201.707%203.293A1%201%200%2000.293%204.707l5%205a1%201%200%20001.414%200l5-5a1%201%200%2010-1.414-1.414z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat"
              >
                <option>全部平台</option>
                <option>WhatsApp</option>
                <option>Telegram</option>
                <option>Line</option>
                <option>Instagram</option>
                <option>Facebook</option>
                <option>WeChat</option>
                <option>Email</option>
                <option>SMS</option>
                <option>TikTok</option>
                <option>Twitter</option>
                <option>Shopify</option>
              </select>
              <div className="flex items-center bg-[#F2F2F2] rounded-md border border-[#E8E8E8] p-0.5">
                {['今日', '本周', '本月'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                      selectedTimeRange === range
                        ? 'bg-white text-[#FF6B35] shadow-sm'
                        : 'text-[#666] hover:text-[#333]'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <AIReceptionCard icon={Sparkles} label="AI自动回复" value="298" total="423" percent={70} />
            <AIReceptionCard icon={Bot} label="AI辅助生成" value="87" total="423" percent={21} />
            <AIReceptionCard icon={Users} label="人工回复" value="38" total="423" percent={9} />
          </div>
        </div>

        {/* ── 热点功能 + 消息中心 ── */}
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3 bg-white rounded-lg border border-[#E8E8E8] shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <h2 className="text-base font-semibold text-[#1A1A1A]">热点功能</h2>
              <span className="px-1.5 py-0.5 bg-[#FF6B35] text-white text-[10px] font-medium rounded">Hot</span>
              <span className="px-1.5 py-0.5 bg-[#333] text-white text-[10px] font-medium rounded">New</span>
            </div>
            <div className="grid grid-cols-4 gap-x-4 gap-y-6">
              <FunctionCard icon={Bot} label="AI员工设置" badge="hot" />
              <FunctionCard icon={Key} label="激活码管理" badge="hot" />
              <FunctionCard icon={BookOpen} label="知识库配置" badge="new" />
              <FunctionCard icon={Tags} label="AI标签配置" badge="new" />
              <FunctionCard icon={List} label="客户列表" />
              <FunctionCard icon={FileText} label="工单管理" />
              <FunctionCard icon={Activity} label="代理IP" />
              <FunctionCard icon={BarChart3} label="内控报表" />
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-lg border border-[#E8E8E8] shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-[#1A1A1A]">消息中心</h2>
              <button className="text-xs text-[#FF6B35] hover:text-[#E85A2A] flex items-center gap-0.5 transition-colors">
                全部 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              <NoticeItem type="通知" title="【敏感行为通知】账号:lzNV3xQ13k..." time="2026-01-27 11:02:47" />
              <NoticeItem type="通知" title="【系统通知】ChatKnow推荐官福利..." time="2024-07-09 16:39:57" />
              <NoticeItem type="通知" title="【系统通知】ChatKnow推荐官福利..." time="2024-07-08 19:32:49" />
            </div>
          </div>
        </div>

        {/* ── 工单趋势 + 线索排行 ── */}
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3 bg-white rounded-lg border border-[#E8E8E8] shadow-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-[#1A1A1A]">工单新增线索</h2>
                <span className="text-xs text-[#999]">15 个平台工单未使用</span>
              </div>
              <DateRangeBadge />
            </div>
            <div className="mt-4 relative">
              <svg viewBox="0 0 700 200" className="w-full h-48">
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={i} x1="40" y1={20 + i * 45} x2="680" y2={20 + i * 45} stroke="#E8E8E8" strokeWidth="1" />
                ))}
                {['1', '0.8', '0.6', '0.4', '0.2', '0'].map((v, i) => (
                  <text key={v} x="30" y={25 + i * 36} textAnchor="end" className="text-[11px]" fill="#999">{v}</text>
                ))}
                <polyline fill="none" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  points="60,25 150,140 240,160 330,168 420,172 510,174 600,175 660,176" />
                <circle cx="60" cy="25" r="4" fill="#FF6B35" />
                <polyline fill="none" stroke="#B3B3B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 4"
                  points="60,176 150,176 240,176 330,176 420,176 510,176 600,176 660,176" />
                {['03-03', '03-04', '03-05', '03-06', '03-07', '03-08', '03-09', '03-10'].map((d, i) => (
                  <text key={d} x={60 + i * 85.7} y="198" textAnchor="middle" className="text-[11px]" fill="#999">{d}</text>
                ))}
              </svg>
              <div className="flex items-center justify-center gap-6 mt-2">
                <div className="flex items-center gap-1.5">
                  <Circle className="w-2.5 h-2.5 fill-[#FF6B35] text-[#FF6B35]" />
                  <span className="text-xs text-[#666]">Telegram</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Circle className="w-2.5 h-2.5 fill-[#B3B3B3] text-[#B3B3B3]" />
                  <span className="text-xs text-[#666]">WhatsApp</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-lg border border-[#E8E8E8] shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-[#1A1A1A]">今日线索排行</h2>
              <TrendingUp className="w-4 h-4 text-[#FF6B35]" />
            </div>
            <div className="space-y-1">
              {topCodes.map((c, i) => (
                <RankItem key={c.id} rank={i + 1} code={c.code} status={c.assignedTo} count={0} />
              ))}
              {topCodes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8">
                  <PackageOpen className="w-12 h-12 text-[#D9D9D9] mb-3" />
                  <span className="text-sm text-[#999]">暂无数据</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 新增线索排行 + 新增线索统计 + 线索统计 ── */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 bg-white rounded-lg border border-[#E8E8E8] shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#1A1A1A]">新增线索排行</h2>
              <DropdownBadge label="WhatsApp" />
            </div>
            <DateRangeBadge className="mb-4" />
            {(() => {
              const platformCodes = activationCodes.filter(
                (c) => c.platforms && c.platforms.includes('whatsapp')
              );
              if (platformCodes.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-8">
                    <PackageOpen className="w-12 h-12 text-[#D9D9D9] mb-3" />
                    <span className="text-sm text-[#999]">暂无数据</span>
                  </div>
                );
              }
              return (
                <div className="space-y-1">
                  {platformCodes.slice(0, 5).map((c, i) => (
                    <RankItem key={c.id} rank={i + 1} code={c.code} status={c.assignedTo} count={0} />
                  ))}
                </div>
              );
            })()}
          </div>

          <div className="col-span-5 bg-white rounded-lg border border-[#E8E8E8] shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#1A1A1A]">新增线索统计</h2>
              <div className="flex items-center gap-2">
                <DropdownBadge label={topCodes[0]?.code.slice(0, 10) + '...' || '全部'} />
                <DateRangeBadge />
              </div>
            </div>
            <LeadBarChart data={[
              { platform: 'WhatsApp', value: 0 },
              { platform: 'Telegram', value: 1 },
              { platform: 'Line', value: 0 },
              { platform: 'Instagram', value: 0 },
              { platform: 'Facebook', value: 0 },
              { platform: 'WeChat', value: 0 },
              { platform: 'Email', value: 0 },
            ]} />
          </div>

          <div className="col-span-4 bg-white rounded-lg border border-[#E8E8E8] shadow-sm p-6">
            <h2 className="text-base font-semibold text-[#1A1A1A] mb-4">线索统计</h2>
            <div className="space-y-3">
              <LeadStatItem icon={Ban} label="[历史]重复线索" subtext="实时更新" value="0" />
              <LeadStatItem icon={CheckCircle2} label="[历史]有效线索" subtext="实时更新" value="6" highlight />
              <LeadStatItem icon={RotateCcw} label="[今日]重复线索" subtext="实时更新" value="0" />
              <LeadStatItem icon={CheckCircle2} label="[今日]有效线索" subtext="实时更新" value="0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────── 子组件 ──────────────────────── */

const TabSwitcher: React.FC = () => (
  <div className="flex items-center bg-[#F2F2F2] rounded-md border border-[#E8E8E8] p-0.5">
    <span className="px-3 py-1 text-xs font-medium text-[#FF6B35] bg-white rounded shadow-sm">今日</span>
    <span className="px-3 py-1 text-xs text-[#666] cursor-pointer hover:text-[#333]">本周</span>
    <span className="px-3 py-1 text-xs text-[#666] cursor-pointer hover:text-[#333]">本月</span>
  </div>
);

const SubscriptionItem: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}> = ({ icon: Icon, label, value, highlight }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#FFF7F3]">
      <Icon className="w-4 h-4 text-[#FF6B35]" />
    </div>
    <div className="min-w-0">
      <div className="text-[11px] text-[#999]">{label}</div>
      <div className={`text-sm font-semibold mt-0.5 truncate ${highlight ? 'text-[#FF6B35]' : 'text-[#1A1A1A]'}`}>
        {value}
      </div>
    </div>
  </div>
);

const AIMetricCard: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}> = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col items-center text-center py-2">
    <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3 bg-[#FFF7F3]">
      <Icon className="w-5 h-5 text-[#FF6B35]" />
    </div>
    <div className="text-2xl font-bold text-[#1A1A1A]">{value}</div>
    <div className="text-xs text-[#999] mt-1">{label}</div>
  </div>
);

const AIReceptionCard: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  total: string;
  percent: number;
}> = ({ icon: Icon, label, value, total, percent }) => (
  <div className="p-4 rounded-lg border border-[#E8E8E8] hover:shadow-sm transition-shadow">
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-[#FF6B35]" />
      <span className="text-sm text-[#666]">{label}</span>
    </div>
    <div className="text-3xl font-bold text-[#FF6B35]">{value}</div>
    <div className="flex items-center justify-between mt-2">
      <span className="text-xs text-[#999]">占比 {percent}%</span>
      <span className="text-xs text-[#B3B3B3]">/ {total}</span>
    </div>
    <div className="w-full h-1.5 bg-[#F2F2F2] rounded-full mt-2 overflow-hidden">
      <div className="h-full rounded-full bg-[#FF6B35]" style={{ width: `${percent}%` }} />
    </div>
  </div>
);

const DateRangeBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-2 text-xs text-[#666] bg-[#F2F2F2] rounded-md px-3 py-1.5 border border-[#E8E8E8] ${className}`}>
    <Calendar className="w-3.5 h-3.5 text-[#999]" />
    <span>2026-03-03</span>
    <span className="text-[#D9D9D9]">-</span>
    <span>2026-03-10</span>
  </div>
);

const DropdownBadge: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-1 text-xs text-[#666] bg-[#F2F2F2] border border-[#E8E8E8] rounded-md px-2 py-1 cursor-pointer hover:bg-[#E8E8E8] transition-colors">
    <span>{label}</span>
    <ChevronDown className="w-3.5 h-3.5 text-[#999]" />
  </div>
);

const FunctionCard: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: 'hot' | 'new';
}> = ({ icon: Icon, label, badge }) => (
  <button className="flex flex-col items-center gap-2 py-3 rounded-lg hover:bg-[#FFF7F3] transition-all group relative">
    {badge === 'hot' && (
      <span className="absolute -top-1 right-2 px-1 py-px bg-[#FF6B35] text-white text-[9px] rounded leading-tight">Hot</span>
    )}
    {badge === 'new' && (
      <span className="absolute -top-1 right-2 px-1 py-px bg-[#333] text-white text-[9px] rounded leading-tight">New</span>
    )}
    <div className="w-11 h-11 rounded-lg bg-[#F2F2F2] group-hover:bg-[#FFF7F3] border border-[#E8E8E8] group-hover:border-[#FFD4BE] flex items-center justify-center transition-all">
      <Icon className="w-5 h-5 text-[#666] group-hover:text-[#FF6B35] transition-colors" />
    </div>
    <span className="text-[13px] text-[#666] group-hover:text-[#FF6B35] transition-colors">{label}</span>
  </button>
);

const NoticeItem: React.FC<{
  type: string;
  title: string;
  time: string;
}> = ({ type, title, time }) => (
  <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-md hover:bg-[#FFF7F3] cursor-pointer transition-colors group">
    <span className="px-1.5 py-0.5 bg-[#FFF7F3] text-[#FF6B35] text-[11px] font-medium rounded flex-shrink-0 mt-0.5 border border-[#FFD4BE]">
      {type}
    </span>
    <div className="flex-1 min-w-0">
      <div className="text-sm text-[#333] truncate group-hover:text-[#1A1A1A]">{title}</div>
      <div className="text-[11px] text-[#B3B3B3] mt-0.5">{time}</div>
    </div>
  </div>
);

const RankItem: React.FC<{
  rank: number;
  code: string;
  status?: string;
  count: number;
}> = ({ rank, code, status, count }) => {
  const rankBg = rank === 1
    ? 'bg-[#FF6B35] text-white'
    : rank === 2
      ? 'bg-[#FFB088] text-white'
      : rank === 3
        ? 'bg-[#FFD4BE] text-[#FF6B35]'
        : 'bg-[#F2F2F2] text-[#999]';

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#FFF7F3] transition-colors">
      <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${rankBg}`}>
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[#333] truncate">{code}</div>
        {status && <div className="text-[11px] text-[#B3B3B3]">({status})</div>}
      </div>
      <span className="text-sm font-medium text-[#666]">{count}</span>
    </div>
  );
};

const LeadStatItem: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  subtext: string;
  value: string;
  highlight?: boolean;
}> = ({ icon: Icon, label, subtext, value, highlight }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E8E8E8] hover:shadow-sm transition-shadow">
    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#FFF7F3]">
      <Icon className="w-[18px] h-[18px] text-[#FF6B35]" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-[#333]">{label}</div>
      <div className="text-[11px] text-[#B3B3B3]">{subtext}</div>
    </div>
    <span className={`text-xl font-bold ${highlight ? 'text-[#FF6B35]' : 'text-[#333]'}`}>{value}</span>
  </div>
);

const LeadBarChart: React.FC<{
  data: { platform: string; value: number }[];
}> = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 36;
  const gap = 20;
  const leftPad = 45;
  const chartH = 170;
  const totalW = leftPad + data.length * (barWidth + gap);
  const ySteps = [1, 0.8, 0.6, 0.4, 0.2, 0];

  return (
    <div className="mt-2 overflow-x-auto">
      <svg viewBox={`0 0 ${totalW} 220`} className="w-full h-52">
        {ySteps.map((v, i) => {
          const y = 10 + i * (chartH / (ySteps.length - 1));
          return (
            <g key={v}>
              <line x1={leftPad} y1={y} x2={totalW - 10} y2={y} stroke="#E8E8E8" strokeWidth="1" />
              <text x={leftPad - 6} y={y + 4} textAnchor="end" fontSize="11" fill="#999">{v}</text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const x = leftPad + i * (barWidth + gap) + gap / 2;
          const barH = maxVal > 0 ? (d.value / maxVal) * chartH : 0;
          const y = 10 + chartH - barH;
          return (
            <g key={d.platform}>
              {barH > 0 && (
                <rect x={x} y={y} width={barWidth} height={barH} rx="3" fill="#FF6B35" opacity="0.85" />
              )}
              <text x={x + barWidth / 2} y={chartH + 30} textAnchor="middle" fontSize="11" fill="#999"
                transform={`rotate(-30, ${x + barWidth / 2}, ${chartH + 30})`}>
                {d.platform}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
