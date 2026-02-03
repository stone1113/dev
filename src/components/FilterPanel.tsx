import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { platformConfigs } from '@/data/mockData';
import { 
  Filter,
  X,
  Check,
  Calendar,
  AlertCircle,
  MessageSquare,
  Globe,
  Languages,
  User,
  ShoppingBag,
  Crown,
  Tag,
  Hash,
  Clock,
  ChevronDown,
  ChevronUp,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  title, 
  icon, 
  children, 
  isExpanded, 
  onToggle 
}) => (
  <div className="border-b border-gray-100 last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 px-1 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="text-gray-400">{icon}</span>
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
      {isExpanded ? (
        <ChevronUp className="w-4 h-4 text-gray-400" />
      ) : (
        <ChevronDown className="w-4 h-4 text-gray-400" />
      )}
    </button>
    {isExpanded && (
      <div className="pb-4 px-1">
        {children}
      </div>
    )}
  </div>
);

export const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose }) => {
  const { 
    filterCriteria, 
    setFilterCriteria, 
    clearFilters,
    getFilteredConversations,
    platformAccounts
  } = useStore();
  
  // 展开/折叠状态
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    platform: true,
    status: true,
    priority: false,
    country: false,
    language: false,
    assignedTo: false,
    customerType: false,
    customerTags: false,
    conversationTags: false,
    messageCount: false,
    lastActive: false,
  });
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const filteredCount = getFilteredConversations().length;
  
  // 状态选项
  const statusOptions = [
    { id: 'active', name: '进行中', color: 'bg-green-100 text-green-700' },
    { id: 'pending', name: '待处理', color: 'bg-amber-100 text-amber-700' },
    { id: 'resolved', name: '已解决', color: 'bg-blue-100 text-blue-700' },
    { id: 'closed', name: '已关闭', color: 'bg-gray-100 text-gray-500' },
  ] as const;
  
  // 优先级选项
  const priorityOptions = [
    { id: 'low', name: '低', color: 'bg-gray-100 text-gray-600' },
    { id: 'medium', name: '中', color: 'bg-amber-100 text-amber-700' },
    { id: 'high', name: '高', color: 'bg-orange-100 text-orange-700' },
    { id: 'urgent', name: '紧急', color: 'bg-red-100 text-red-700 font-medium' },
  ] as const;
  
  // 国家选项 (与mock数据中的country字段匹配)
  const countryOptions = [
    { id: '中国', name: '中国', flag: '🇨🇳' },
    { id: '美国', name: '美国', flag: '🇺🇸' },
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
  
  // 语言选项
  const languageOptions = [
    { id: 'zh', name: '中文' },
    { id: 'en', name: '英语' },
    { id: 'ja', name: '日语' },
    { id: 'ko', name: '韩语' },
    { id: 'de', name: '德语' },
    { id: 'fr', name: '法语' },
    { id: 'es', name: '西班牙语' },
    { id: 'it', name: '意大利语' },
    { id: 'pt', name: '葡萄牙语' },
    { id: 'ru', name: '俄语' },
    { id: 'ar', name: '阿拉伯语' },
    { id: 'th', name: '泰语' },
    { id: 'vi', name: '越南语' },
    { id: 'id', name: '印尼语' },
    { id: 'ms', name: '马来语' },
  ];
  
  // 客户标签选项
  const customerTagOptions = ['VIP客户', '新客户', '老客户', '高价值', '潜在', '流失风险', '投诉客户', '好评客户'];
  
  // 会话标签选项
  const conversationTagOptions = ['售后', '询价', '投诉', '物流', '退款', '技术支持', '产品咨询', '支付问题'];
  
  // 最后活跃时间选项
  const lastActiveOptions = [
    { id: 'today', name: '今天' },
    { id: 'yesterday', name: '昨天' },
    { id: 'week', name: '近7天' },
    { id: 'month', name: '近30天' },
  ] as const;
  
  // 消息数量范围选项
  const messageCountOptions = [
    { id: 'few', name: '少量 (1-5)', min: 1, max: 5 },
    { id: 'medium', name: '中等 (6-15)', min: 6, max: 15 },
    { id: 'many', name: '大量 (16+)', min: 16, max: undefined },
  ];
  
  // 切换状态
  const toggleStatus = (status: typeof statusOptions[number]['id']) => {
    const currentStatus = filterCriteria.status;
    if (currentStatus.includes(status)) {
      setFilterCriteria({ 
        status: currentStatus.filter(s => s !== status) 
      });
    } else {
      setFilterCriteria({ status: [...currentStatus, status] });
    }
  };
  
  // 切换优先级
  const togglePriority = (priority: typeof priorityOptions[number]['id']) => {
    const currentPriority = filterCriteria.priority;
    if (currentPriority.includes(priority)) {
      setFilterCriteria({ 
        priority: currentPriority.filter(p => p !== priority) 
      });
    } else {
      setFilterCriteria({ priority: [...currentPriority, priority] });
    }
  };
  
  // 切换平台
  const togglePlatform = (platformId: string) => {
    const currentPlatforms = filterCriteria.platforms;
    if (currentPlatforms.includes(platformId as any)) {
      setFilterCriteria({ 
        platforms: currentPlatforms.filter(p => p !== platformId) 
      });
    } else {
      setFilterCriteria({ 
        platforms: [...currentPlatforms, platformId as any] 
      });
    }
  };
  
  // 切换国家
  const toggleCountry = (countryId: string) => {
    const currentCountries = filterCriteria.countries;
    if (currentCountries.includes(countryId)) {
      setFilterCriteria({ 
        countries: currentCountries.filter(c => c !== countryId) 
      });
    } else {
      setFilterCriteria({ countries: [...currentCountries, countryId] });
    }
  };
  
  // 切换语言
  const toggleLanguage = (languageId: string) => {
    const currentLanguages = filterCriteria.languages;
    if (currentLanguages.includes(languageId)) {
      setFilterCriteria({ 
        languages: currentLanguages.filter(l => l !== languageId) 
      });
    } else {
      setFilterCriteria({ languages: [...currentLanguages, languageId] });
    }
  };
  
  // 切换分配客服
  const toggleAssignedTo = (accountId: string) => {
    const currentAssigned = filterCriteria.assignedTo;
    if (currentAssigned.includes(accountId)) {
      setFilterCriteria({ 
        assignedTo: currentAssigned.filter(a => a !== accountId) 
      });
    } else {
      setFilterCriteria({ assignedTo: [...currentAssigned, accountId] });
    }
  };
  
  // 切换客户标签
  const toggleCustomerTag = (tag: string) => {
    const currentTags = filterCriteria.customerTags;
    if (currentTags.includes(tag)) {
      setFilterCriteria({ 
        customerTags: currentTags.filter(t => t !== tag) 
      });
    } else {
      setFilterCriteria({ customerTags: [...currentTags, tag] });
    }
  };
  
  // 切换会话标签
  const toggleTag = (tag: string) => {
    const currentTags = filterCriteria.tags;
    if (currentTags.includes(tag)) {
      setFilterCriteria({ 
        tags: currentTags.filter(t => t !== tag) 
      });
    } else {
      setFilterCriteria({ tags: [...currentTags, tag] });
    }
  };
  
  // 设置消息数量范围
  const setMessageCountRange = (range: { min?: number; max?: number } | undefined) => {
    setFilterCriteria({ messageCountRange: range });
  };
  
  // 设置最后活跃时间
  const setLastActiveRange = (range: typeof lastActiveOptions[number]['id'] | undefined) => {
    setFilterCriteria({ lastActiveRange: range });
  };
  
  // 检查是否有激活的筛选条件
  const hasActiveFilters = 
    filterCriteria.status.length > 0 ||
    filterCriteria.priority.length > 0 ||
    filterCriteria.tags.length > 0 ||
    filterCriteria.platforms.length > 0 ||
    filterCriteria.countries.length > 0 ||
    filterCriteria.languages.length > 0 ||
    filterCriteria.assignedTo.length > 0 ||
    filterCriteria.customerTags.length > 0 ||
    filterCriteria.unreadOnly ||
    filterCriteria.hasOrder !== undefined ||
    filterCriteria.isVIP !== undefined ||
    filterCriteria.messageCountRange !== undefined ||
    filterCriteria.lastActiveRange !== undefined;
  
  // 获取激活的筛选条件数量
  const getActiveFilterCount = () => {
    let count = 0;
    if (filterCriteria.platforms.length > 0) count++;
    if (filterCriteria.status.length > 0) count++;
    if (filterCriteria.priority.length > 0) count++;
    if (filterCriteria.countries.length > 0) count++;
    if (filterCriteria.languages.length > 0) count++;
    if (filterCriteria.assignedTo.length > 0) count++;
    if (filterCriteria.hasOrder !== undefined) count++;
    if (filterCriteria.isVIP !== undefined) count++;
    if (filterCriteria.customerTags.length > 0) count++;
    if (filterCriteria.tags.length > 0) count++;
    if (filterCriteria.messageCountRange !== undefined) count++;
    if (filterCriteria.lastActiveRange !== undefined) count++;
    if (filterCriteria.unreadOnly) count++;
    return count;
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-96 h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#0059F8]/10 rounded-lg">
              <Filter className="w-5 h-5 text-[#0059F8]" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">筛选条件</h2>
              {getActiveFilterCount() > 0 && (
                <p className="text-xs text-[#0059F8]">{getActiveFilterCount()} 个条件已激活</p>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Platform Filter */}
          <FilterSection
            title="平台"
            icon={<Globe className="w-4 h-4" />}
            isExpanded={expandedSections.platform}
            onToggle={() => toggleSection('platform')}
          >
            <div className="grid grid-cols-2 gap-2">
              {platformConfigs.filter(p => p.enabled).map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left",
                    filterCriteria.platforms.includes(platform.id as any)
                      ? "bg-[#0059F8]/10 border border-[#0059F8]/30"
                      : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                  )}
                >
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{ backgroundColor: `${platform.color}30`, color: platform.color }}
                  >
                    {platform.name.slice(0, 1)}
                  </div>
                  <span className="flex-1 text-xs text-gray-700 truncate">{platform.name}</span>
                  {filterCriteria.platforms.includes(platform.id as any) && (
                    <Check className="w-3 h-3 text-[#0059F8]" />
                  )}
                </button>
              ))}
            </div>
          </FilterSection>
          
          {/* Status Filter */}
          <FilterSection
            title="会话状态"
            icon={<MessageSquare className="w-4 h-4" />}
            isExpanded={expandedSections.status}
            onToggle={() => toggleSection('status')}
          >
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status.id}
                  onClick={() => toggleStatus(status.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-full transition-all",
                    filterCriteria.status.includes(status.id)
                      ? status.color + " ring-2 ring-offset-1 ring-gray-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {status.name}
                </button>
              ))}
            </div>
          </FilterSection>
          
          {/* Priority Filter */}
          <FilterSection
            title="优先级"
            icon={<AlertCircle className="w-4 h-4" />}
            isExpanded={expandedSections.priority}
            onToggle={() => toggleSection('priority')}
          >
            <div className="flex flex-wrap gap-2">
              {priorityOptions.map((priority) => (
                <button
                  key={priority.id}
                  onClick={() => togglePriority(priority.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-full transition-all flex items-center gap-1",
                    filterCriteria.priority.includes(priority.id)
                      ? priority.color + " ring-2 ring-offset-1 ring-gray-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {priority.name}
                </button>
              ))}
            </div>
          </FilterSection>
          
          {/* Country Filter */}
          <FilterSection
            title="客户国家/地区"
            icon={<Globe className="w-4 h-4" />}
            isExpanded={expandedSections.country}
            onToggle={() => toggleSection('country')}
          >
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
              {countryOptions.map((country) => (
                <button
                  key={country.id}
                  onClick={() => toggleCountry(country.id)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-left",
                    filterCriteria.countries.includes(country.id)
                      ? "bg-[#0059F8]/10 border border-[#0059F8]/30"
                      : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                  )}
                >
                  <span className="text-sm">{country.flag}</span>
                  <span className="flex-1 text-xs text-gray-700 truncate">{country.name}</span>
                  {filterCriteria.countries.includes(country.id) && (
                    <Check className="w-3 h-3 text-[#0059F8]" />
                  )}
                </button>
              ))}
            </div>
          </FilterSection>
          
          {/* Language Filter */}
          <FilterSection
            title="客户语言"
            icon={<Languages className="w-4 h-4" />}
            isExpanded={expandedSections.language}
            onToggle={() => toggleSection('language')}
          >
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
              {languageOptions.map((language) => (
                <button
                  key={language.id}
                  onClick={() => toggleLanguage(language.id)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-left",
                    filterCriteria.languages.includes(language.id)
                      ? "bg-[#0059F8]/10 border border-[#0059F8]/30"
                      : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                  )}
                >
                  <span className="flex-1 text-xs text-gray-700">{language.name}</span>
                  {filterCriteria.languages.includes(language.id) && (
                    <Check className="w-3 h-3 text-[#0059F8]" />
                  )}
                </button>
              ))}
            </div>
          </FilterSection>
          
          {/* Assigned To Filter */}
          <FilterSection
            title="分配客服"
            icon={<Users className="w-4 h-4" />}
            isExpanded={expandedSections.assignedTo}
            onToggle={() => toggleSection('assignedTo')}
          >
            <div className="space-y-1.5">
              <button
                onClick={() => setFilterCriteria({ assignedTo: [] })}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                  filterCriteria.assignedTo.length === 0
                    ? "bg-[#0059F8]/10 border border-[#0059F8]/30"
                    : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                )}
              >
                <User className="w-4 h-4 text-gray-400" />
                <span className="flex-1 text-left text-xs text-gray-700">全部客服</span>
                {filterCriteria.assignedTo.length === 0 && (
                  <Check className="w-3 h-3 text-[#0059F8]" />
                )}
              </button>
              {platformAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => toggleAssignedTo(account.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                    filterCriteria.assignedTo.includes(account.id)
                      ? "bg-[#0059F8]/10 border border-[#0059F8]/30"
                      : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                  )}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    account.status === 'online' ? "bg-green-500" :
                    account.status === 'busy' ? "bg-amber-500" : "bg-gray-400"
                  )} />
                  <span className="flex-1 text-left text-xs text-gray-700">{account.name}</span>
                  {filterCriteria.assignedTo.includes(account.id) && (
                    <Check className="w-3 h-3 text-[#0059F8]" />
                  )}
                </button>
              ))}
            </div>
          </FilterSection>
          
          {/* Customer Type Filter */}
          <FilterSection
            title="客户类型"
            icon={<User className="w-4 h-4" />}
            isExpanded={expandedSections.customerType}
            onToggle={() => toggleSection('customerType')}
          >
            <div className="space-y-2">
              {/* VIP Filter */}
              <button
                onClick={() => setFilterCriteria({ isVIP: filterCriteria.isVIP === true ? undefined : true })}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                  filterCriteria.isVIP === true
                    ? "bg-amber-50 border border-amber-200"
                    : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                )}
              >
                <Crown className={cn(
                  "w-4 h-4",
                  filterCriteria.isVIP === true ? "text-amber-500" : "text-gray-400"
                )} />
                <span className={cn(
                  "flex-1 text-left text-xs",
                  filterCriteria.isVIP === true ? "text-amber-700 font-medium" : "text-gray-700"
                )}>
                  VIP客户
                </span>
                {filterCriteria.isVIP === true && (
                  <Check className="w-3 h-3 text-amber-500" />
                )}
              </button>
              
              {/* Has Order Filter */}
              <button
                onClick={() => setFilterCriteria({ hasOrder: filterCriteria.hasOrder === true ? undefined : true })}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                  filterCriteria.hasOrder === true
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                )}
              >
                <ShoppingBag className={cn(
                  "w-4 h-4",
                  filterCriteria.hasOrder === true ? "text-blue-500" : "text-gray-400"
                )} />
                <span className={cn(
                  "flex-1 text-left text-xs",
                  filterCriteria.hasOrder === true ? "text-blue-700 font-medium" : "text-gray-700"
                )}>
                  有订单客户
                </span>
                {filterCriteria.hasOrder === true && (
                  <Check className="w-3 h-3 text-blue-500" />
                )}
              </button>
            </div>
          </FilterSection>
          
          {/* Customer Tags Filter */}
          <FilterSection
            title="客户标签"
            icon={<Tag className="w-4 h-4" />}
            isExpanded={expandedSections.customerTags}
            onToggle={() => toggleSection('customerTags')}
          >
            <div className="flex flex-wrap gap-2">
              {customerTagOptions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleCustomerTag(tag)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-full transition-all",
                    filterCriteria.customerTags.includes(tag)
                      ? "bg-[#0059F8] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </FilterSection>
          
          {/* Conversation Tags Filter */}
          <FilterSection
            title="会话标签"
            icon={<Hash className="w-4 h-4" />}
            isExpanded={expandedSections.conversationTags}
            onToggle={() => toggleSection('conversationTags')}
          >
            <div className="flex flex-wrap gap-2">
              {conversationTagOptions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-full transition-all",
                    filterCriteria.tags.includes(tag)
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </FilterSection>
          
          {/* Message Count Filter */}
          <FilterSection
            title="消息数量"
            icon={<MessageSquare className="w-4 h-4" />}
            isExpanded={expandedSections.messageCount}
            onToggle={() => toggleSection('messageCount')}
          >
            <div className="space-y-2">
              {messageCountOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    const currentRange = filterCriteria.messageCountRange;
                    if (currentRange?.min === option.min && currentRange?.max === option.max) {
                      setMessageCountRange(undefined);
                    } else {
                      setMessageCountRange({ min: option.min, max: option.max });
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                    filterCriteria.messageCountRange?.min === option.min
                      ? "bg-[#0059F8]/10 border border-[#0059F8]/30"
                      : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                  )}
                >
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 text-left text-xs text-gray-700">{option.name}</span>
                  {filterCriteria.messageCountRange?.min === option.min && (
                    <Check className="w-3 h-3 text-[#0059F8]" />
                  )}
                </button>
              ))}
            </div>
          </FilterSection>
          
          {/* Last Active Filter */}
          <FilterSection
            title="最后活跃时间"
            icon={<Clock className="w-4 h-4" />}
            isExpanded={expandedSections.lastActive}
            onToggle={() => toggleSection('lastActive')}
          >
            <div className="space-y-2">
              {lastActiveOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    if (filterCriteria.lastActiveRange === option.id) {
                      setLastActiveRange(undefined);
                    } else {
                      setLastActiveRange(option.id);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                    filterCriteria.lastActiveRange === option.id
                      ? "bg-[#0059F8]/10 border border-[#0059F8]/30"
                      : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                  )}
                >
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="flex-1 text-left text-xs text-gray-700">{option.name}</span>
                  {filterCriteria.lastActiveRange === option.id && (
                    <Check className="w-3 h-3 text-[#0059F8]" />
                  )}
                </button>
              ))}
            </div>
          </FilterSection>
          
          {/* Unread Only */}
          <div className="pt-2">
            <button
              onClick={() => setFilterCriteria({ unreadOnly: !filterCriteria.unreadOnly })}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                filterCriteria.unreadOnly
                  ? "bg-red-50 border border-red-200"
                  : "bg-gray-50 hover:bg-gray-100 border border-transparent"
              )}
            >
              <MessageSquare className={cn(
                "w-5 h-5",
                filterCriteria.unreadOnly ? "text-red-500" : "text-gray-400"
              )} />
              <span className={cn(
                "flex-1 text-left text-sm",
                filterCriteria.unreadOnly ? "text-red-700 font-medium" : "text-gray-700"
              )}>
                仅显示未读
              </span>
              {filterCriteria.unreadOnly && (
                <Check className="w-4 h-4 text-red-500" />
              )}
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                hasActiveFilters
                  ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              清除筛选
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#0059F8] text-white rounded-lg text-sm font-medium hover:bg-[#0038A3] transition-colors shadow-sm hover:shadow"
            >
              查看结果 ({filteredCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
