import React, { useState } from 'react';
import { X, Search, UserCircle, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { platformConfigs } from '@/data/mockData';

interface ContactListProps {
  onClose: () => void;
}

export const ContactList: React.FC<ContactListProps> = ({ onClose }) => {
  const { conversations, setSelectedConversation } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  // 获取所有唯一客户
  const customers = Array.from(
    new Map(conversations.map(c => [c.customer.id, { ...c.customer, platform: c.platform, conversationId: c.id }])).values()
  );

  // 搜索过滤
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCustomer = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  return (
    <div className="h-full bg-white rounded-xl shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900">联系人</h3>
          <span className="text-xs text-gray-400">({customers.length})</span>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索联系人..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <UserCircle className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">暂无联系人</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredCustomers.map((customer) => {
              const platform = platformConfigs.find(p => p.id === customer.platform);
              return (
                <button
                  key={customer.id}
                  onClick={() => handleSelectCustomer(customer.conversationId)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center"
                      style={{ backgroundColor: platform?.color }}
                    >
                      <span className="text-[8px] text-white font-bold">
                        {platform?.name?.charAt(0)}
                      </span>
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {customer.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {customer.country} · {customer.language === 'en' ? 'English' :
                        customer.language === 'zh' ? '中文' :
                        customer.language === 'ja' ? '日本語' :
                        customer.language === 'ko' ? '한국어' : customer.language}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {customer.tags.slice(0, 1).map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-500 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-gray-100">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
          <MessageCircle className="w-4 h-4" />
          发起新会话
        </button>
      </div>
    </div>
  );
};
