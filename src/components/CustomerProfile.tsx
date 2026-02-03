import React from 'react';
import { useStore } from '@/store/useStore';
import { platformConfigs, languageMap } from '@/data/mockData';
import { 
  User, 
  MapPin, 
  Globe, 
  Calendar, 
  ShoppingBag, 
  Star,
  Package,
  MessageSquare,
  Edit3,
  Plus,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface CustomerProfilePanelProps {
  onClose?: () => void;
}

export const CustomerProfilePanel: React.FC<CustomerProfilePanelProps> = () => {
  const { getSelectedConversation } = useStore();
  
  const conversation = getSelectedConversation();
  const customer = conversation?.customer;
  
  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl p-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">选择一个会话查看客户画像</p>
      </div>
    );
  }
  
  const platform = platformConfigs.find(p => p.id === conversation.platform);
  const language = languageMap[customer.language];
  
  const formatCurrency = (amount: number, currency: string) => {
    const symbols: Record<string, string> = {
      CNY: '¥',
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      KRW: '₩',
    };
    return `${symbols[currency] || currency}${amount.toLocaleString()}`;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-amber-100 text-amber-700';
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      delivered: '已送达',
      shipped: '已发货',
      processing: '处理中',
      pending: '待处理',
      cancelled: '已取消',
      refunded: '已退款',
    };
    return statusMap[status] || status;
  };
  
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">客户画像</h3>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Edit3 className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Basic Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-16 h-16 rounded-full object-cover bg-gray-100"
              />
              <div 
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white"
                style={{ backgroundColor: platform?.color }}
              >
                <span className="text-[10px] text-white font-medium">
                  {platform?.name?.slice(0, 1)}
                </span>
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{customer.name}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{customer.country}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                <Globe className="w-3.5 h-3.5" />
                <span>{language?.name || customer.language}</span>
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="mt-4 space-y-2">
            {customer.email && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 w-12">邮箱:</span>
                <span className="text-gray-700">{customer.email}</span>
              </div>
            )}
            {customer.phone && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 w-12">电话:</span>
                <span className="text-gray-700">{customer.phone}</span>
              </div>
            )}
          </div>
          
          {/* Tags */}
          <div className="mt-4">
            <div className="flex items-center gap-2 flex-wrap">
              {customer.tags.map((tag, i) => (
                <span 
                  key={i}
                  className="px-2.5 py-1 text-xs font-medium bg-[#0059F8]/10 text-[#0059F8] rounded-full"
                >
                  {tag}
                </span>
              ))}
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
        
        {/* AI Insights */}
        {customer.behaviorAnalysis && (
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#0059F8]" />
              <h4 className="font-medium text-gray-900">AI洞察</h4>
            </div>
            
            <div className="bg-gradient-to-r from-[#0059F8]/5 to-[#0059F8]/10 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">总消费</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(customer.behaviorAnalysis.totalSpent, 
                      customer.orderHistory?.[0]?.currency || 'CNY')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">订单数</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {customer.behaviorAnalysis.orderCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">平均订单</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(customer.behaviorAnalysis.averageOrderValue,
                      customer.orderHistory?.[0]?.currency || 'CNY')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">满意度</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-lg font-semibold text-gray-900">
                      {customer.behaviorAnalysis.satisfactionScore || '-'}
                    </span>
                  </div>
                </div>
              </div>
              
              {customer.behaviorAnalysis.favoriteCategories.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#0059F8]/10">
                  <p className="text-xs text-gray-500 mb-2">偏好品类</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {customer.behaviorAnalysis.favoriteCategories.map((cat, i) => (
                      <span 
                        key={i}
                        className="px-2 py-0.5 text-xs bg-white text-gray-600 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {customer.behaviorAnalysis.preferredContactTime && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>偏好联系时间: {customer.behaviorAnalysis.preferredContactTime}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Order History */}
        {customer.orderHistory && customer.orderHistory.length > 0 && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-gray-500" />
                <h4 className="font-medium text-gray-900">订单历史</h4>
              </div>
              <button className="text-xs text-[#0059F8] hover:underline">
                查看全部
              </button>
            </div>
            
            <div className="space-y-3">
              {customer.orderHistory.slice(0, 3).map((order) => (
                <div 
                  key={order.id}
                  className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </span>
                    <span className={cn(
                      "px-2 py-0.5 text-xs rounded-full",
                      getStatusColor(order.status)
                    )}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{format(new Date(order.date), 'yyyy-MM-dd')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {order.items.length} 件商品
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.total, order.currency)}
                    </span>
                  </div>
                  
                  {order.items.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 truncate">
                        {order.items[0].name}
                        {order.items.length > 1 && ` 等${order.items.length}件`}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Notes */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <h4 className="font-medium text-gray-900">备注</h4>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <Edit3 className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
          
          {customer.notes ? (
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
              {customer.notes}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">暂无备注</p>
          )}
        </div>
        
        {/* Customer Since */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              客户自 {format(new Date(customer.createdAt), 'yyyy年MM月dd日')} 开始关注
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePanel;
