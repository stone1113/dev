import React from 'react';
import { useStore } from '@/store/useStore';
import { platformConfigs } from '@/data/mockData';
import type { Conversation, Platform } from '@/types';
import { 
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
  Search,
  Filter,
  MoreHorizontal,
  CheckCheck,
  Clock,
  AlertCircle,
  Bot,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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
};

const priorityIcons = {
  low: null,
  medium: <Clock className="w-3 h-3 text-amber-500" />,
  high: <AlertCircle className="w-3 h-3 text-red-500" />,
  urgent: <AlertCircle className="w-3 h-3 text-red-600" />,
};

interface ConversationListProps {
  onSelectConversation?: (conversation: Conversation) => void;
  onFilterClick?: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({ 
  onSelectConversation,
  onFilterClick 
}) => {
  const { 
    getFilteredConversations, 
    selectedConversationId, 
    setSelectedConversation,
    searchQuery,
    setSearchQuery,
    filterCriteria,
    setFilterCriteria,
    userSettings
  } = useStore();
  
  const conversations = getFilteredConversations();
  
  const handleSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation.id);
    onSelectConversation?.(conversation);
  };
  
  const getPlatformIcon = (platform: Platform) => {
    const config = platformConfigs.find(p => p.id === platform);
    const Icon = config ? iconMap[config.icon] : MessageCircle;
    return { Icon, color: config?.color || '#666' };
  };
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const msgDate = new Date(date);
    
    if (now.toDateString() === msgDate.toDateString()) {
      return format(msgDate, 'HH:mm');
    }
    
    if (now.getTime() - msgDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return format(msgDate, 'EEE');
    }
    
    return format(msgDate, 'MM/dd');
  };
  
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">会话列表</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={onFilterClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="筛选"
            >
              <Filter className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索客户或消息..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0059F8]/20 focus:border-[#0059F8] transition-all"
          />
        </div>
        
        {/* Quick Filters */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => setFilterCriteria({ 
              status: filterCriteria.status.includes('active') 
                ? filterCriteria.status.filter(s => s !== 'active')
                : [...filterCriteria.status, 'active']
            })}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full transition-all",
              filterCriteria.status.includes('active')
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            进行中
          </button>
          <button
            onClick={() => setFilterCriteria({ 
              status: filterCriteria.status.includes('pending')
                ? filterCriteria.status.filter(s => s !== 'pending')
                : [...filterCriteria.status, 'pending']
            })}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full transition-all",
              filterCriteria.status.includes('pending')
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            待处理
          </button>
          <button
            onClick={() => setFilterCriteria({ unreadOnly: !filterCriteria.unreadOnly })}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full transition-all",
              filterCriteria.unreadOnly
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            未读
          </button>
        </div>
      </div>
      
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <MessageCircle className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">暂无会话</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {conversations.map((conversation, index) => {
              const { Icon, color } = getPlatformIcon(conversation.platform);
              const isSelected = selectedConversationId === conversation.id;
              const hasUnread = conversation.unreadCount > 0;
              
              return (
                <button
                  key={conversation.id}
                  onClick={() => handleSelect(conversation)}
                  className={cn(
                    "w-full p-4 text-left transition-all duration-200 hover:bg-gray-50",
                    isSelected && "bg-[#0059F8]/5 hover:bg-[#0059F8]/10",
                    hasUnread && !isSelected && "bg-blue-50/50"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={conversation.customer.avatar}
                        alt={conversation.customer.name}
                        className="w-12 h-12 rounded-full object-cover bg-gray-100"
                      />
                      <div 
                        className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                        style={{ backgroundColor: color }}
                      >
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={cn(
                          "font-medium truncate",
                          hasUnread ? "text-gray-900" : "text-gray-700"
                        )}>
                          {conversation.customer.name}
                        </h3>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      
                      <p className={cn(
                        "text-sm truncate mb-2",
                        hasUnread ? "text-gray-800 font-medium" : "text-gray-500"
                      )}>
                        {conversation.lastMessage?.content || '暂无消息'}
                      </p>
                      
                      <div className="flex items-center gap-1.5">
                        {/* AI Takeover Badge - 仅图标，hover显示tooltip */}
                        {userSettings.preferences.ai.enabled && userSettings.preferences.ai.autoReply && (
                          <span
                            className="flex items-center justify-center w-5 h-5 bg-amber-100 text-amber-600 rounded-full"
                            title="AI接管中"
                          >
                            <Bot className="w-3 h-3" />
                          </span>
                        )}

                        {/* AI Assist Badge - 仅图标，hover显示tooltip */}
                        {userSettings.preferences.ai.enabled && !userSettings.preferences.ai.autoReply && (
                          <span
                            className="flex items-center justify-center w-5 h-5 bg-[#0059F8]/10 text-[#0059F8] rounded-full"
                            title="AI辅助"
                          >
                            <Sparkles className="w-3 h-3" />
                          </span>
                        )}
                        
                        {/* Tags */}
                        {conversation.tags.slice(0, 2).map((tag, i) => (
                          <span 
                            key={i}
                            className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        
                        {/* Priority */}
                        {priorityIcons[conversation.priority]}
                        
                        {/* Unread Count */}
                        {hasUnread && (
                          <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                        
                        {/* Read Status */}
                        {!hasUnread && conversation.lastMessage?.senderType !== 'customer' && (
                          <CheckCheck className="w-4 h-4 text-blue-500 ml-auto" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Footer Stats */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>共 {conversations.length} 个会话</span>
          <span>
            {conversations.reduce((sum, c) => sum + c.unreadCount, 0)} 条未读
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConversationList;
