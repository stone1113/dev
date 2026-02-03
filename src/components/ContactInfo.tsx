import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, Tag, ShoppingBag, MessageCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { platformConfigs } from '@/data/mockData';

interface ContactInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ isOpen, onClose }) => {
  const { getSelectedConversation } = useStore();
  const selectedConversation = getSelectedConversation();

  if (!isOpen || !selectedConversation) return null;

  const customer = selectedConversation.customer;
  const platform = platformConfigs.find(p => p.id === selectedConversation.platform);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-[420px] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">联系人信息</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* 头像和基本信息 */}
          <div className="p-6 text-center border-b border-gray-100">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
            />
            <h4 className="text-lg font-semibold text-gray-900">{customer.name}</h4>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span
                className="px-2 py-1 text-xs font-medium rounded-full"
                style={{ backgroundColor: `${platform?.color}20`, color: platform?.color }}
              >
                {platform?.name}
              </span>
              <span className="text-sm text-gray-500">{customer.country}</span>
            </div>
          </div>

          {/* 联系方式 */}
          <div className="p-4 space-y-3">
            <h5 className="text-sm font-medium text-gray-500 mb-3">联系方式</h5>

            {customer.email && (
              <InfoRow icon={Mail} label="邮箱" value={customer.email} />
            )}

            {customer.phone && (
              <InfoRow icon={Phone} label="电话" value={customer.phone} />
            )}

            <InfoRow icon={MapPin} label="地区" value={customer.country} />

            <InfoRow
              icon={MessageCircle}
              label="语言"
              value={customer.language === 'en' ? 'English' :
                     customer.language === 'zh' ? '中文' :
                     customer.language === 'ja' ? '日本語' : customer.language}
            />
          </div>

          {/* 标签 */}
          {customer.tags.length > 0 && (
            <div className="px-4 pb-4">
              <h5 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                客户标签
              </h5>
              <div className="flex flex-wrap gap-2">
                {customer.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 时间信息 */}
          <div className="p-4 border-t border-gray-100 space-y-3">
            <h5 className="text-sm font-medium text-gray-500 mb-3">时间记录</h5>

            <InfoRow
              icon={Calendar}
              label="首次联系"
              value={new Date(customer.createdAt).toLocaleDateString('zh-CN')}
            />

            <InfoRow
              icon={Calendar}
              label="最近联系"
              value={new Date(customer.lastContactAt).toLocaleDateString('zh-CN')}
            />
          </div>

          {/* 订单统计 */}
          {customer.orderHistory && customer.orderHistory.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <h5 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                订单统计
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="订单数" value={customer.orderHistory.length.toString()} />
                <StatCard
                  label="总消费"
                  value={`$${customer.orderHistory.reduce((sum: number, o: { total: number }) => sum + o.total, 0).toFixed(0)}`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            关闭
          </button>
          <button
            className="px-6 py-2 text-sm font-medium text-white bg-[#0059F8] rounded-lg hover:bg-[#0038A3] transition-colors"
          >
            编辑资料
          </button>
        </div>
      </div>
    </div>
  );
};

// 信息行组件
const InfoRow: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({
  icon: Icon, label, value
}) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-gray-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm text-gray-900 truncate">{value}</p>
    </div>
  </div>
);

// 统计卡片组件
const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="p-3 bg-gray-50 rounded-lg text-center">
    <p className="text-lg font-semibold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);
