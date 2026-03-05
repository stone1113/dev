import React, { useState } from 'react';
import { X, RotateCcw, Check, Globe, MessageSquare, Users, Tag, Hash, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { platformConfigs } from '@/data/mockData';
import type { Platform } from '@/types';

interface AdvancedFilterPanelProps {
  onClose: () => void;
}

// 国家/地区选项
const countryOptions = [
  { id: '美国', name: '美国', flag: '🇺🇸' },
  { id: '中国', name: '中国', flag: '🇨🇳' },
  { id: '日本', name: '日本', flag: '🇯🇵' },
  { id: '韩国', name: '韩国', flag: '🇰🇷' },
  { id: '英国', name: '英国', flag: '🇬🇧' },
  { id: '德国', name: '德国', flag: '🇩🇪' },
  { id: '法国', name: '法国', flag: '🇫🇷' },
  { id: '意大利', name: '意大利', flag: '🇮🇹' },
  { id: '澳大利亚', name: '澳大利亚', flag: '🇦🇺' },
  { id: '加拿大', name: '加拿大', flag: '🇨🇦' },
  { id: '巴西', name: '巴西', flag: '🇧🇷' },
  { id: '印度', name: '印度', flag: '🇮🇳' },
  { id: '新加坡', name: '新加坡', flag: '🇸🇬' },
  { id: '马来西亚', name: '马来西亚', flag: '🇲🇾' },
  { id: '泰国', name: '泰国', flag: '🇹🇭' },
  { id: '越南', name: '越南', flag: '🇻🇳' },
  { id: '印尼', name: '印尼', flag: '🇮🇩' },
  { id: '菲律宾', name: '菲律宾', flag: '🇵🇭' },
  { id: '俄罗斯', name: '俄罗斯', flag: '🇷🇺' },
  { id: '墨西哥', name: '墨西哥', flag: '🇲🇽' },
];

// 会话状态选项
const statusOptions = [
  { id: 'all', name: '全部' },
  { id: 'unread', name: '未读' },
  { id: 'unreplied', name: '未回' },
  { id: 'group', name: '群聊' },
  { id: 'single', name: '单聊' },
] as const;

// 会话标签选项
const conversationTagOptions = ['售后', '询价', '投诉', '物流', '退款', '技术支持', '产品咨询', '支付问题', '转人工', 'AI接管', 'AI辅助'];

// 客户标签筛选选项配置
const customerFilterOptions = {
  customerLevel: [
    { value: 'A级 - 已成交', label: 'A级 - 已成交' },
    { value: 'B级 - 高意向询价', label: 'B级 - 高意向询价' },
    { value: 'C级 - 观望', label: 'C级 - 观望' },
    { value: 'D级 - 仅加好友', label: 'D级 - 仅加好友' },
  ],
  customerTypes: [
    { value: '批发', label: '批发' },
    { value: '平台卖家', label: '平台卖家' },
    { value: '零售', label: '零售' },
    { value: '代理商', label: '代理商' },
  ],
  categories: [
    { value: '鞋类', label: '鞋类' },
    { value: '运动服饰', label: '运动服饰' },
    { value: '电子产品', label: '电子产品' },
    { value: '家居用品', label: '家居用品' },
    { value: '美妆护肤', label: '美妆护肤' },
  ],
  budgetRange: [
    { value: '低(<$50)', label: '低(<$50)' },
    { value: '中($50-$200)', label: '中($50-$200)' },
    { value: '高($200-$500)', label: '高($200-$500)' },
    { value: '超高(>$500)', label: '超高(>$500)' },
  ],
  intentQuantity: [
    { value: '小批(1-9)', label: '小批(1-9)' },
    { value: '中批(10-99)', label: '中批(10-99)' },
    { value: '大批(100+)', label: '大批(100+)' },
  ],
  purchasePurpose: [
    { value: '转售', label: '转售' },
    { value: '自用', label: '自用' },
    { value: '送礼', label: '送礼' },
    { value: '代购', label: '代购' },
  ],
  urgency: [
    { value: '本周', label: '本周' },
    { value: '本月', label: '本月' },
    { value: '近期', label: '近期' },
    { value: '观望中', label: '观望中' },
  ],
};

export const AdvancedFilterPanel: React.FC<AdvancedFilterPanelProps> = ({ onClose }) => {
  const { filterCriteria, setFilterCriteria, platformAccounts } = useStore();

  // 本地状态
  const [localFilters, setLocalFilters] = useState({
    platforms: filterCriteria.platforms || [],
    countries: filterCriteria.countries || [],
    unreadOnly: filterCriteria.unreadOnly || false,
    unrepliedOnly: filterCriteria.unrepliedOnly || false,
    chatType: filterCriteria.chatType || 'all',
    assignedTo: filterCriteria.assignedTo || [],
    tags: filterCriteria.tags || [],
    customerLevel: filterCriteria.customerLevel || [],
    customerTypes: filterCriteria.customerTypes || [],
    categories: filterCriteria.categories || [],
    budgetRange: filterCriteria.budgetRange || [],
    intentQuantity: filterCriteria.intentQuantity || [],
    purchasePurpose: filterCriteria.purchasePurpose || [],
    urgency: filterCriteria.urgency || [],
  });

  // 切换平台
  const togglePlatform = (platformId: string) => {
    setLocalFilters(prev => {
      const platforms = prev.platforms.includes(platformId as Platform)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId as Platform];
      return { ...prev, platforms };
    });
  };

  // 切换国家/地区
  const toggleCountry = (countryId: string) => {
    setLocalFilters(prev => {
      const countries = prev.countries.includes(countryId)
        ? prev.countries.filter(c => c !== countryId)
        : [...prev.countries, countryId];
      return { ...prev, countries };
    });
  };

  // 切换会话状态
  const toggleStatus = (statusId: string) => {
    setLocalFilters(prev => {
      if (statusId === 'all') {
        return { ...prev, chatType: 'all' as const, unreadOnly: false, unrepliedOnly: false };
      } else if (statusId === 'unread') {
        return { ...prev, unreadOnly: !prev.unreadOnly, unrepliedOnly: false };
      } else if (statusId === 'unreplied') {
        return { ...prev, unrepliedOnly: !prev.unrepliedOnly, unreadOnly: false };
      } else if (statusId === 'group') {
        return { ...prev, chatType: prev.chatType === 'group' ? 'all' as const : 'group' as const };
      } else if (statusId === 'single') {
        return { ...prev, chatType: prev.chatType === 'single' ? 'all' as const : 'single' as const };
      }
      return prev;
    });
  };

  // 获取状态是否选中
  const isStatusSelected = (statusId: string) => {
    if (statusId === 'all') {
      return !localFilters.unreadOnly && !localFilters.unrepliedOnly && localFilters.chatType === 'all';
    } else if (statusId === 'unread') {
      return localFilters.unreadOnly;
    } else if (statusId === 'unreplied') {
      return localFilters.unrepliedOnly;
    } else if (statusId === 'group') {
      return localFilters.chatType === 'group';
    } else if (statusId === 'single') {
      return localFilters.chatType === 'single';
    }
    return false;
  };

  // 切换客服账号
  const toggleAssignedTo = (accountId: string) => {
    setLocalFilters(prev => {
      const assignedTo = prev.assignedTo.includes(accountId)
        ? prev.assignedTo.filter(a => a !== accountId)
        : [...prev.assignedTo, accountId];
      return { ...prev, assignedTo };
    });
  };

  // 切换会话标签
  const toggleConversationTag = (tag: string) => {
    setLocalFilters(prev => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  // 切换客户标签筛选
  const toggleCustomerFilter = (key: keyof typeof customerFilterOptions, value: string) => {
    setLocalFilters(prev => {
      const current = prev[key] as string[];
      const newValues = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: newValues };
    });
  };

  // 获取可筛选的账号（与平台联动）
  const getFilterableAccounts = () => {
    return platformAccounts
      .filter(account => account.status !== 'not_logged_in')
      .filter(account =>
        localFilters.platforms.length === 0 ||
        localFilters.platforms.includes(account.platformId as Platform)
      );
  };

  // 应用筛选
  const handleApply = () => {
    setFilterCriteria(localFilters);
    onClose();
  };

  // 重置筛选
  const handleReset = () => {
    const emptyFilters = {
      platforms: [] as Platform[],
      countries: [] as string[],
      unreadOnly: false,
      unrepliedOnly: false,
      chatType: 'all' as const,
      assignedTo: [] as string[],
      tags: [] as string[],
      customerLevel: [] as string[],
      customerTypes: [] as string[],
      categories: [] as string[],
      budgetRange: [] as string[],
      intentQuantity: [] as string[],
      purchasePurpose: [] as string[],
      urgency: [] as string[],
    };
    setLocalFilters(emptyFilters);
  };

  // 计算激活的筛选数量
  const getActiveCount = () => {
    let count = 0;
    if (localFilters.platforms.length > 0) count++;
    if (localFilters.countries.length > 0) count++;
    if (localFilters.unreadOnly || localFilters.unrepliedOnly || localFilters.chatType !== 'all') count++;
    if (localFilters.assignedTo.length > 0) count++;
    if (localFilters.tags.length > 0) count++;
    if (localFilters.customerLevel.length > 0) count++;
    if (localFilters.customerTypes.length > 0) count++;
    if (localFilters.categories.length > 0) count++;
    if (localFilters.budgetRange.length > 0) count++;
    if (localFilters.intentQuantity.length > 0) count++;
    if (localFilters.purchasePurpose.length > 0) count++;
    if (localFilters.urgency.length > 0) count++;
    return count;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">高级筛选</span>
          {getActiveCount() > 0 && (
            <span className="px-2 py-0.5 text-xs bg-[#FF6B35] text-white rounded-full">
              {getActiveCount()}
            </span>
          )}
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* 平台筛选 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-700">平台</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {platformConfigs.filter(p => p.enabled).map((platform) => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all text-left text-xs",
                  localFilters.platforms.includes(platform.id as Platform)
                    ? "bg-[#FF6B35]/10 border border-[#FF6B35]/30"
                    : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                )}
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-medium"
                  style={{ backgroundColor: `${platform.color}30`, color: platform.color }}
                >
                  {platform.name.slice(0, 1)}
                </div>
                <span className="flex-1 text-gray-700 truncate">{platform.name}</span>
                {localFilters.platforms.includes(platform.id as Platform) && (
                  <Check className="w-3 h-3 text-[#FF6B35]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 国家/地区筛选 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-700">国家/地区</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto">
            {countryOptions.map((country) => (
              <button
                key={country.id}
                onClick={() => toggleCountry(country.id)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all text-left text-xs",
                  localFilters.countries.includes(country.id)
                    ? "bg-[#FF6B35]/10 border border-[#FF6B35]/30"
                    : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                )}
              >
                <span className="text-sm">{country.flag}</span>
                <span className="flex-1 text-gray-700 truncate">{country.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 会话状态筛选 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-700">会话状态</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status.id}
                onClick={() => toggleStatus(status.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-all border",
                  isStatusSelected(status.id)
                    ? "bg-[#FF6B35] text-white border-transparent"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                )}
              >
                {status.name}
              </button>
            ))}
          </div>
        </div>

        {/* 客服账号筛选 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-700">客服账号</span>
            {localFilters.platforms.length > 0 && (
              <span className="text-[10px] text-gray-400">
                (已筛选 {localFilters.platforms.length} 个平台)
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto">
            {getFilterableAccounts().length === 0 ? (
              <p className="text-xs text-gray-400 py-2 col-span-2">暂无可用账号</p>
            ) : (
              getFilterableAccounts().map((account) => {
                const platform = platformConfigs.find(p => p.id === account.platformId);
                return (
                  <button
                    key={account.id}
                    onClick={() => toggleAssignedTo(account.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all text-left text-xs",
                      localFilters.assignedTo.includes(account.id)
                        ? "bg-[#FF6B35]/10 border border-[#FF6B35]/30"
                        : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                    )}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-medium"
                      style={{ backgroundColor: `${platform?.color}30`, color: platform?.color }}
                    >
                      {platform?.name.slice(0, 1)}
                    </div>
                    <span className="flex-1 text-gray-700 truncate">{account.name}</span>
                    {localFilters.assignedTo.includes(account.id) && (
                      <Check className="w-3 h-3 text-[#FF6B35]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* 客户标签筛选 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-700">客户标签</span>
          </div>
          <div className="space-y-3">
            <CustomerFilterSection
              title="客户等级"
              options={customerFilterOptions.customerLevel}
              selected={localFilters.customerLevel}
              onToggle={(v) => toggleCustomerFilter('customerLevel', v)}
            />
            <CustomerFilterSection
              title="客户类型"
              options={customerFilterOptions.customerTypes}
              selected={localFilters.customerTypes}
              onToggle={(v) => toggleCustomerFilter('customerTypes', v)}
            />
            <CustomerFilterSection
              title="意向品类"
              options={customerFilterOptions.categories}
              selected={localFilters.categories}
              onToggle={(v) => toggleCustomerFilter('categories', v)}
            />
            <CustomerFilterSection
              title="预算区间"
              options={customerFilterOptions.budgetRange}
              selected={localFilters.budgetRange}
              onToggle={(v) => toggleCustomerFilter('budgetRange', v)}
            />
            <CustomerFilterSection
              title="意向数量"
              options={customerFilterOptions.intentQuantity}
              selected={localFilters.intentQuantity}
              onToggle={(v) => toggleCustomerFilter('intentQuantity', v)}
            />
            <CustomerFilterSection
              title="购买目的"
              options={customerFilterOptions.purchasePurpose}
              selected={localFilters.purchasePurpose}
              onToggle={(v) => toggleCustomerFilter('purchasePurpose', v)}
            />
            <CustomerFilterSection
              title="购买紧迫度"
              options={customerFilterOptions.urgency}
              selected={localFilters.urgency}
              onToggle={(v) => toggleCustomerFilter('urgency', v)}
            />
          </div>
        </div>

        {/* 会话标签筛选 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-700">会话标签</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {conversationTagOptions.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleConversationTag(tag)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-all border",
                  localFilters.tags.includes(tag)
                    ? "bg-purple-500 text-white border-transparent"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 p-4 border-t border-gray-100 bg-gray-50">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重置
        </button>
        <button
          onClick={handleApply}
          className="flex-1 px-3 py-2 text-xs font-medium text-white bg-[#FF6B35] rounded-lg hover:bg-[#E85A2A]"
        >
          应用筛选
        </button>
      </div>
    </div>
  );
};

// 客户标签筛选子组件
interface CustomerFilterSectionProps {
  title: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}

const CustomerFilterSection: React.FC<CustomerFilterSectionProps> = ({
  title,
  options,
  selected,
  onToggle,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] text-gray-500">{title}</span>
        {selected.length > 0 && (
          <span className="text-[10px] text-[#FF6B35]">{selected.length}项</span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => onToggle(opt.value)}
              className={cn(
                "px-2.5 py-1 text-xs rounded-lg transition-all border",
                isSelected
                  ? "bg-[#FF6B35] text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdvancedFilterPanel;
