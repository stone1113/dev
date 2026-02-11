import React, { useState, useEffect } from 'react';
import {
  Key,
  Search,
  ChevronDown,
  Download,
  SlidersHorizontal,
  MessageCircle,
  Send,
  MessageSquare,
  Instagram,
  Facebook,
  Mail,
  Smartphone,
  Music,
  Twitter,
  ShoppingBag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { platformConfigs } from '@/data/mockData';
import { ConversationList } from './ConversationList';
import { ChatInterface } from './ChatInterface';
import { CustomerAIProfile } from './CustomerAIProfile';
import { ProxySettings } from './ProxySettings';
import { TranslationSettings } from './TranslationSettings';
import { ContactList } from './ContactList';
import { RightMenuBar, type RightPanelType } from './RightMenuBar';
import { AdvancedFilterPanel } from './AdvancedFilterPanel';
import { User } from 'lucide-react';
import type { ActivationCode, Platform } from '@/types';

interface AdminChatViewProps {
  initialCode?: ActivationCode | null;
  onClearCode?: () => void;
}

export const AdminChatView: React.FC<AdminChatViewProps> = ({ initialCode, onClearCode }) => {
  const activationCodes = useStore((s) => s.activationCodes);

  // 筛选栏状态
  const [selectedCodeId, setSelectedCodeId] = useState<string | null>(initialCode?.id ?? null);
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [orgAccountFilter, setOrgAccountFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeRightPanel, setActiveRightPanel] = useState<RightPanelType>(null);

  // 从激活码管理跳转过来时自动选中
  useEffect(() => {
    if (initialCode) {
      setSelectedCodeId(initialCode.id);
      onClearCode?.();
    }
  }, [initialCode]);

  const allCodeList = activationCodes.filter(c => c.status !== 'unused');
  // const selectedCode = activationCodes.find(c => c.id === selectedCodeId);

  return (
    <div className="h-full flex flex-col">
      {/* 顶部筛选栏 */}
      <TopFilterBar
        codes={allCodeList}
        selectedCodeId={selectedCodeId}
        onSelectCode={setSelectedCodeId}
        orgAccountFilter={orgAccountFilter}
        onOrgAccountChange={setOrgAccountFilter}
        platformFilter={platformFilter}
        onPlatformChange={(p) => { setPlatformFilter(p); setAccountFilter('all'); }}
        accountFilter={accountFilter}
        onAccountChange={setAccountFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* 主内容区 */}
      <div className="flex-1 flex min-h-0">
        {/* 客服账号列表 */}
        <AccountListPanel
          platformFilter={platformFilter}
          selectedAccountId={accountFilter}
          onSelectAccount={setAccountFilter}
        />

        {/* 会话列表 */}
        <div className="w-80 flex-shrink-0">
          <ConversationList />
        </div>

        {/* 聊天区域 */}
        <div className="flex-1 min-w-0">
          <ChatInterface
            onToggleProfile={() => setActiveRightPanel(activeRightPanel === 'ai-profile' ? null : 'ai-profile')}
          />
        </div>

        {/* 右侧面板 */}
        {activeRightPanel && (
          <div className="w-80 flex-shrink-0">
            {activeRightPanel === 'ai-profile' && (
              <CustomerAIProfile onClose={() => setActiveRightPanel(null)} />
            )}
            {activeRightPanel === 'proxy' && (
              <ProxySettings onClose={() => setActiveRightPanel(null)} />
            )}
            {activeRightPanel === 'translation' && (
              <TranslationSettings onClose={() => setActiveRightPanel(null)} />
            )}
            {activeRightPanel === 'contact' && (
              <ContactList onClose={() => setActiveRightPanel(null)} />
            )}
          </div>
        )}

        {/* 右侧菜单栏 */}
        <RightMenuBar
          activePanel={activeRightPanel}
          onPanelChange={setActiveRightPanel}
        />
      </div>
    </div>
  );
};

// ---- 左侧客服账号列表 ----

const AccountListPanel: React.FC<{
  platformFilter: Platform | 'all';
  selectedAccountId: string;
  onSelectAccount: (id: string) => void;
}> = ({ platformFilter, selectedAccountId, onSelectAccount }) => {
  const platformAccounts = useStore((s) => s.platformAccounts);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAccounts = (platformFilter === 'all'
    ? platformAccounts
    : platformAccounts.filter(a => a.platformId === platformFilter)
  ).filter(a => a.status !== 'not_logged_in')
  .filter(a => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.accountId.toLowerCase().includes(q);
  });

  // 只有在线和离线两种状态，busy 视为在线
  const getStatusColor = (status: string) => {
    if (status === 'online' || status === 'busy') return 'bg-green-500';
    return 'bg-gray-400';
  };

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    MessageCircle, Send, MessageSquare, Instagram, Facebook, Mail, Smartphone, Music, Twitter, ShoppingBag,
  };

  return (
    <div className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* 标题 */}
      <div className="px-3 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
          <User className="w-4 h-4 text-[#FF6B35]" />
          客服账号
        </h3>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索账号..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
          />
        </div>
      </div>

      {/* 全部账号选项 */}
      <button
        onClick={() => onSelectAccount('all')}
        className={cn(
          "w-full px-3 py-2.5 text-left text-sm border-b border-gray-50 transition-colors",
          selectedAccountId === 'all'
            ? "bg-[#FF6B35]/5 text-[#FF6B35] font-medium"
            : "text-gray-600 hover:bg-gray-50"
        )}
      >
        全部账号 ({filteredAccounts.length})
      </button>

      {/* 账号列表 */}
      <div className="flex-1 overflow-y-auto">
        {filteredAccounts.map(account => {
          const pConfig = platformConfigs.find(p => p.id === account.platformId);
          const isSelected = selectedAccountId === account.id;

          return (
            <button
              key={account.id}
              onClick={() => onSelectAccount(account.id)}
              className={cn(
                "w-full px-3 py-2.5 text-left transition-colors border-l-2",
                isSelected
                  ? "bg-[#FF6B35]/5 border-l-[#FF6B35]"
                  : "border-l-transparent hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-2">
                <div className="relative flex-shrink-0">
                  {account.avatar ? (
                    <img src={account.avatar} alt={account.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <span className={cn(
                    "absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white",
                    getStatusColor(account.status)
                  )} />
                  {(() => {
                    const PIcon = pConfig ? iconMap[pConfig.icon] : MessageCircle;
                    return PIcon ? (
                      <div
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white"
                        style={{ backgroundColor: pConfig?.color || '#666' }}
                      >
                        <PIcon className="w-2.5 h-2.5 text-white" />
                      </div>
                    ) : null;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm truncate",
                    isSelected ? "text-[#FF6B35] font-medium" : "text-gray-900"
                  )}>
                    {account.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[11px] text-gray-400 truncate">
                      {pConfig?.name || account.platformId}
                    </span>
                    <span className="text-[11px] text-gray-300">·</span>
                    <span className="text-[11px] text-gray-400 truncate">
                      {account.accountId}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {filteredAccounts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <User className="w-8 h-8 mb-2 text-gray-300" />
            <p className="text-xs">暂无账号</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ---- 顶部筛选栏 ----

const TopFilterBar: React.FC<{
  codes: ActivationCode[];
  selectedCodeId: string | null;
  onSelectCode: (id: string | null) => void;
  orgAccountFilter: string;
  onOrgAccountChange: (id: string) => void;
  platformFilter: Platform | 'all';
  onPlatformChange: (p: Platform | 'all') => void;
  accountFilter: string;
  onAccountChange: (id: string) => void;
  statusFilter: string;
  onStatusChange: (s: string) => void;
}> = ({
  codes, selectedCodeId, onSelectCode,
  orgAccountFilter, onOrgAccountChange,
  platformFilter, onPlatformChange,
  accountFilter, onAccountChange,
  statusFilter, onStatusChange,
}) => {
  const [codeDropdown, setCodeDropdown] = useState(false);
  const [codeSearch, setCodeSearch] = useState('');
  const [orgAccountDropdown, setOrgAccountDropdown] = useState(false);
  const [platformDropdown, setPlatformDropdown] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [deviceDropdown, setDeviceDropdown] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const platformAccounts = useStore((s) => s.platformAccounts);
  const allActivationCodes = useStore((s) => s.activationCodes);

  // 组织账号：从激活码中提取已分配的成员（去重）
  const orgMembers = allActivationCodes
    .filter(c => c.assignedTo && c.status !== 'unused')
    .reduce<{ name: string; departmentName: string; role: string }[]>((acc, c) => {
      if (!acc.some(m => m.name === c.assignedTo)) {
        acc.push({ name: c.assignedTo!, departmentName: c.departmentName, role: c.role });
      }
      return acc;
    }, []);

  const selectedOrgAccount = orgMembers.find(m => m.name === orgAccountFilter);

  const selectedCode = codes.find(c => c.id === selectedCodeId);

  // 激活码搜索过滤
  const filteredCodes = codes.filter(c => {
    if (!codeSearch.trim()) return true;
    const q = codeSearch.toLowerCase();
    return c.code.toLowerCase().includes(q)
      || (c.assignedTo && c.assignedTo.toLowerCase().includes(q))
      || c.departmentName.toLowerCase().includes(q);
  });

  const codeStatusLabel: Record<string, string> = {
    active: '已启用',
    expired: '已过期',
    disabled: '已禁用',
  };
  const codeStatusCls: Record<string, string> = {
    active: 'bg-green-50 text-green-700',
    expired: 'bg-gray-50 text-gray-500',
    disabled: 'bg-red-50 text-red-600',
  };

  // 根据平台筛选账号列表
  const filteredAccounts = platformFilter === 'all'
    ? platformAccounts
    : platformAccounts.filter(a => a.platformId === platformFilter);

  const selectedAccount = platformAccounts.find(a => a.id === accountFilter);

  // 计算高级筛选激活数量
  const { filterCriteria } = useStore();
  const advancedFilterCount = [
    filterCriteria.customerLevel,
    filterCriteria.customerTypes,
    filterCriteria.categories,
    filterCriteria.budgetRange,
    filterCriteria.intentQuantity,
    filterCriteria.purchasePurpose,
    filterCriteria.urgency,
  ].reduce((sum, arr) => sum + (arr?.length || 0), 0);

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 flex-shrink-0 flex-wrap">
      {/* 激活码选择 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 flex-shrink-0">激活码</span>
        <div className="relative">
          <button
            onClick={() => setCodeDropdown(!codeDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 min-w-[200px]"
          >
            <Key className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span className="truncate text-gray-900">
              {selectedCode
                ? selectedCode.code
                : '全部激活码'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-auto flex-shrink-0" />
          </button>
          {codeDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => { setCodeDropdown(false); setCodeSearch(''); }} />
              <div className="absolute left-0 top-full mt-1 z-20 w-72 bg-white rounded-lg border border-gray-200 shadow-lg">
                {/* 搜索框 */}
                <div className="p-2 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索激活码、使用人..."
                      value={codeSearch}
                      onChange={(e) => setCodeSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="py-1 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => { onSelectCode(null); setCodeDropdown(false); setCodeSearch(''); }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-gray-50",
                      !selectedCodeId && "bg-[#FF6B35]/5 text-[#FF6B35]"
                    )}
                  >
                    全部激活码
                  </button>
                  {filteredCodes.map(code => (
                    <button
                      key={code.id}
                      onClick={() => { onSelectCode(code.id); setCodeDropdown(false); setCodeSearch(''); }}
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm hover:bg-gray-50",
                        selectedCodeId === code.id && "bg-[#FF6B35]/5 text-[#FF6B35]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Key className="w-3 h-3 text-[#FF6B35] flex-shrink-0" />
                        <span className="font-mono truncate">{code.code}</span>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0", codeStatusCls[code.status] || 'bg-gray-50 text-gray-500')}>
                          {codeStatusLabel[code.status] || code.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 组织账号选择 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 flex-shrink-0">组织账号</span>
        <div className="relative">
          <button
            onClick={() => setOrgAccountDropdown(!orgAccountDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 min-w-[140px]"
          >
            <User className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate text-gray-900">
              {selectedOrgAccount ? selectedOrgAccount.name : '全部'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-auto flex-shrink-0" />
          </button>
          {orgAccountDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOrgAccountDropdown(false)} />
              <div className="absolute left-0 top-full mt-1 z-20 w-56 bg-white rounded-lg border border-gray-200 shadow-lg py-1 max-h-60 overflow-y-auto">
                <button
                  onClick={() => { onOrgAccountChange('all'); setOrgAccountDropdown(false); }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-gray-50",
                    orgAccountFilter === 'all' && "bg-[#FF6B35]/5 text-[#FF6B35]"
                  )}
                >
                  全部
                </button>
                {orgMembers.map(member => (
                  <button
                    key={member.name}
                    onClick={() => { onOrgAccountChange(member.name); setOrgAccountDropdown(false); }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-gray-50",
                      orgAccountFilter === member.name && "bg-[#FF6B35]/5 text-[#FF6B35]"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{member.name}</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5 pl-5">
                      {member.departmentName}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 社交平台选择 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 flex-shrink-0">社交平台</span>
        <div className="relative">
          <button
            onClick={() => setPlatformDropdown(!platformDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 min-w-[140px]"
          >
            <span className="text-gray-900">
              {platformFilter === 'all'
                ? '全部'
                : platformConfigs.find(p => p.id === platformFilter)?.name || platformFilter}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-auto flex-shrink-0" />
          </button>
          {platformDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setPlatformDropdown(false)} />
              <div className="absolute left-0 top-full mt-1 z-20 w-48 bg-white rounded-lg border border-gray-200 shadow-lg py-1 max-h-60 overflow-y-auto">
                <button
                  onClick={() => { onPlatformChange('all'); setPlatformDropdown(false); }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-gray-50",
                    platformFilter === 'all' && "bg-[#FF6B35]/5 text-[#FF6B35]"
                  )}
                >
                  全部
                </button>
                {platformConfigs.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { onPlatformChange(p.id); setPlatformDropdown(false); }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2",
                      platformFilter === p.id && "bg-[#FF6B35]/5 text-[#FF6B35]"
                    )}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 会话账号选择 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 flex-shrink-0">会话账号</span>
        <div className="relative">
          <button
            onClick={() => setAccountDropdown(!accountDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 min-w-[160px]"
          >
            <User className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate text-gray-900">
              {selectedAccount ? selectedAccount.name : '全部账号'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-auto flex-shrink-0" />
          </button>
          {accountDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setAccountDropdown(false)} />
              <div className="absolute left-0 top-full mt-1 z-20 w-56 bg-white rounded-lg border border-gray-200 shadow-lg py-1 max-h-60 overflow-y-auto">
                <button
                  onClick={() => { onAccountChange('all'); setAccountDropdown(false); }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-gray-50",
                    accountFilter === 'all' && "bg-[#FF6B35]/5 text-[#FF6B35]"
                  )}
                >
                  全部账号
                </button>
                {filteredAccounts.map(account => {
                  const pConfig = platformConfigs.find(p => p.id === account.platformId);
                  return (
                    <button
                      key={account.id}
                      onClick={() => { onAccountChange(account.id); setAccountDropdown(false); }}
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm hover:bg-gray-50",
                        accountFilter === account.id && "bg-[#FF6B35]/5 text-[#FF6B35]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{account.name}</span>
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: pConfig?.color || '#999' }}
                        />
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5 pl-5">
                        {account.accountId}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 状态筛选 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 flex-shrink-0">状态</span>
        <div className="relative">
          <button
            onClick={() => setStatusDropdown(!statusDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 min-w-[100px]"
          >
            <span className="truncate text-gray-900">
              {statusFilter === 'all' ? '全部' : statusFilter === 'online' ? '在线' : '离线'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-auto flex-shrink-0" />
          </button>
          {statusDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setStatusDropdown(false)} />
              <div className="absolute left-0 top-full mt-1 z-20 w-32 bg-white rounded-lg border border-gray-200 shadow-lg py-1">
                {[
                  { value: 'all', label: '全部' },
                  { value: 'online', label: '在线' },
                  { value: 'offline', label: '离线' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { onStatusChange(opt.value); setStatusDropdown(false); }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-gray-50",
                      statusFilter === opt.value && "bg-[#FF6B35]/5 text-[#FF6B35]"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 设备筛选 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 flex-shrink-0">设备</span>
        <div className="relative">
          <button
            onClick={() => setDeviceDropdown(!deviceDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 min-w-[100px]"
          >
            <span className="truncate text-gray-900">全部</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-auto flex-shrink-0" />
          </button>
          {deviceDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDeviceDropdown(false)} />
              <div className="absolute left-0 top-full mt-1 z-20 w-40 bg-white rounded-lg border border-gray-200 shadow-lg py-1">
                <button
                  onClick={() => setDeviceDropdown(false)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 bg-[#FF6B35]/5 text-[#FF6B35]"
                >
                  全部
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <button className="px-4 py-1.5 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-[#E85A2A] transition-colors">
        查询
      </button>
      <button className="px-4 py-1.5 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
        重置
      </button>

      {/* 右侧导出按钮 */}
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setShowAdvancedFilter(true)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 border text-sm rounded-lg transition-colors",
            advancedFilterCount > 0
              ? "border-[#FF6B35] text-[#FF6B35] bg-[#FF6B35]/5"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          标签筛选
          {advancedFilterCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] bg-[#FF6B35] text-white rounded-full">
              {advancedFilterCount}
            </span>
          )}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-3.5 h-3.5" />
          导出记录
        </button>
      </div>

      {/* 高级筛选面板 */}
      {showAdvancedFilter && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setShowAdvancedFilter(false)}
          />
          <div className="relative ml-auto w-80 h-full animate-in slide-in-from-right duration-200">
            <AdvancedFilterPanel onClose={() => setShowAdvancedFilter(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChatView;
