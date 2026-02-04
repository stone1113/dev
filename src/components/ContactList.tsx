import React, { useState } from 'react';
import { X, Search, RefreshCw, ExternalLink, Users, Send, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { platformConfigs } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { BroadcastMessage } from './BroadcastMessage';

interface ContactListProps {
  onClose: () => void;
}

type ChatType = 'all' | 'private' | 'group' | 'channel';
type ReadStatus = 'all' | 'unread' | 'read';
type ArchiveStatus = 'all' | 'archived' | 'unarchived';

export const ContactList: React.FC<ContactListProps> = ({ onClose }) => {
  const { conversations, setSelectedConversation, selectedPlatform, getSelectedAccount } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [chatType, setChatType] = useState<ChatType>('all');
  const [readStatus, setReadStatus] = useState<ReadStatus>('all');
  const [archiveStatus, setArchiveStatus] = useState<ArchiveStatus>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBroadcast, setShowBroadcast] = useState(false);

  // 获取所有唯一客户（包含群聊信息）
  const customers = conversations.map(c => ({
    ...c.customer,
    platform: c.platform,
    conversationId: c.id,
    isGroup: c.isGroup === true,
    isChannel: c.customer.name.includes('Channel') || c.customer.name.includes('频道'),
    unreadCount: c.unreadCount || 0,
    isArchived: false,
    groupName: c.groupName,
    groupMemberCount: c.groupMemberCount
  }));

  // 搜索和筛选
  const filteredCustomers = customers.filter(customer => {
    const matchSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchType = chatType === 'all' ||
      (chatType === 'private' && !customer.isGroup && !customer.isChannel) ||
      (chatType === 'group' && customer.isGroup) ||
      (chatType === 'channel' && customer.isChannel);

    const matchRead = readStatus === 'all' ||
      (readStatus === 'unread' && customer.unreadCount > 0) ||
      (readStatus === 'read' && customer.unreadCount === 0);

    const matchArchive = archiveStatus === 'all' ||
      (archiveStatus === 'archived' && customer.isArchived) ||
      (archiveStatus === 'unarchived' && !customer.isArchived);

    return matchSearch && matchType && matchRead && matchArchive;
  });

  const handleSelectCustomer = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    setSelectedIds(new Set(filteredCustomers.map(c => c.id)));
  };

  const invertSelection = () => {
    const newSelected = new Set<string>();
    filteredCustomers.forEach(c => {
      if (!selectedIds.has(c.id)) {
        newSelected.add(c.id);
      }
    });
    setSelectedIds(newSelected);
  };

  // 筛选标签组件
  const FilterTag = ({
    label,
    active,
    onClick
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "px-2 py-0.5 text-xs rounded transition-colors whitespace-nowrap",
        active
          ? "bg-[#FF6B35] text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="h-full bg-white rounded-xl shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#FF6B35]" />
          <h3 className="font-medium text-gray-900 text-xs">联系人管理</h3>
        </div>
        <div className="flex items-center gap-0.5">
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
          </button>
          <button className="flex items-center gap-0.5 px-1.5 py-1 text-[11px] text-gray-500 hover:bg-gray-100 rounded transition-colors">
            <ExternalLink className="w-3 h-3" />
            导出
          </button>
          <button className="flex items-center gap-0.5 px-1.5 py-1 text-[11px] text-gray-500 hover:bg-gray-100 rounded transition-colors">
            <ExternalLink className="w-3 h-3" />
            导入
          </button>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <input
            type="text"
            placeholder="请输入用户名/ID/手机号"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-8 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35]"
          />
          <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF6B35]" />
        </div>
      </div>

      {/* Filter Tags */}
      <div className="px-3 py-1.5 space-y-1.5 border-b border-gray-100">
        {/* 类型筛选 */}
        <div className="flex items-center gap-1.5">
          <FilterTag label="全部" active={chatType === 'all'} onClick={() => setChatType('all')} />
          <FilterTag label="私聊" active={chatType === 'private'} onClick={() => setChatType('private')} />
          <FilterTag label="群聊" active={chatType === 'group'} onClick={() => setChatType('group')} />
          <FilterTag label="频道" active={chatType === 'channel'} onClick={() => setChatType('channel')} />
        </div>
        {/* 已读状态 */}
        <div className="flex items-center gap-1.5">
          <FilterTag label="全部" active={readStatus === 'all'} onClick={() => setReadStatus('all')} />
          <FilterTag label="未读" active={readStatus === 'unread'} onClick={() => setReadStatus('unread')} />
          <FilterTag label="已读" active={readStatus === 'read'} onClick={() => setReadStatus('read')} />
        </div>
        {/* 归档状态 */}
        <div className="flex items-center gap-1.5">
          <FilterTag label="全部" active={archiveStatus === 'all'} onClick={() => setArchiveStatus('all')} />
          <FilterTag label="已归档" active={archiveStatus === 'archived'} onClick={() => setArchiveStatus('archived')} />
          <FilterTag label="未归档" active={archiveStatus === 'unarchived'} onClick={() => setArchiveStatus('unarchived')} />
        </div>
      </div>

      {/* Batch Actions */}
      <div className="px-3 py-1.5 border-b border-gray-100 flex items-center gap-2">
        <button
          onClick={() => selectedIds.size === filteredCustomers.length ? setSelectedIds(new Set()) : selectAll()}
          className={cn(
            "w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors",
            selectedIds.size === filteredCustomers.length && filteredCustomers.length > 0
              ? "bg-[#FF6B35] border-[#FF6B35]"
              : "border-gray-300 bg-white hover:border-gray-400"
          )}
        >
          {selectedIds.size === filteredCustomers.length && filteredCustomers.length > 0 && (
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          )}
        </button>
        <button onClick={selectAll} className="text-xs text-[#FF6B35] hover:underline">全选</button>
        <button onClick={invertSelection} className="text-xs text-[#FF6B35] hover:underline">反选</button>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Users className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-xs">暂无联系人</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredCustomers.map((customer) => {
              const isSelected = selectedIds.has(customer.id);
              return (
                <div
                  key={customer.conversationId}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition-colors",
                    isSelected && "bg-[#FFF8F5]"
                  )}
                >
                  <button
                    onClick={() => toggleSelect(customer.id)}
                    className={cn(
                      "w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors",
                      isSelected
                        ? "bg-[#FF6B35] border-[#FF6B35]"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </button>
                  <button
                    onClick={() => handleSelectCustomer(customer.conversationId)}
                    className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
                  >
                    <div className="relative flex-shrink-0">
                      {customer.isGroup ? (
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      )}
                      {customer.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                          {customer.unreadCount > 99 ? '99+' : customer.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {customer.isGroup ? customer.groupName : customer.name}
                        </p>
                        {customer.isGroup && (
                          <span className="px-1 py-0.5 text-[9px] bg-blue-100 text-blue-600 rounded">
                            {customer.groupMemberCount}人
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 truncate">
                        {customer.isGroup ? `群聊 · ${customer.name}` : customer.id}
                      </p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer - 群发消息 */}
      {selectedIds.size > 0 && (
        <div className="px-3 py-2 border-t border-gray-100">
          <button
            onClick={() => setShowBroadcast(true)}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-[#FF6B35] rounded-lg hover:bg-[#E85A2A] transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            群发消息 ({selectedIds.size})
          </button>
        </div>
      )}

      {/* 群发消息弹窗 */}
      {showBroadcast && (
        <BroadcastMessage
          onClose={() => setShowBroadcast(false)}
          selectedContactIds={selectedIds}
          currentAgentId={selectedPlatform !== 'all' ? getSelectedAccount(selectedPlatform)?.id : undefined}
        />
      )}
    </div>
  );
};
