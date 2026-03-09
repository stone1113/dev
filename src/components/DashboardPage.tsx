import React from 'react';
import { BarChart3, Users, MessageCircle, Bot, TrendingUp, Clock } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 标题 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">工作台</h1>
          <p className="text-sm text-gray-500 mt-1">管理中心数据概览</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="总客户数"
            value="1,234"
            trend="+12%"
            color="blue"
          />
          <StatCard
            icon={MessageCircle}
            label="今日会话"
            value="856"
            trend="+8%"
            color="green"
          />
          <StatCard
            icon={Bot}
            label="AI员工数"
            value="12"
            trend="+2"
            color="purple"
          />
          <StatCard
            icon={Clock}
            label="平均响应时间"
            value="2.3分钟"
            trend="-15%"
            color="orange"
          />
        </div>

        {/* 图表区域占位 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder title="会话趋势" />
          <ChartPlaceholder title="平台分布" />
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  trend: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}> = ({ icon: Icon, label, value, trend, color }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1 text-xs text-green-600">
          <TrendingUp className="w-3 h-3" />
          <span>{trend}</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
};

const ChartPlaceholder: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-400">图表数据加载中...</p>
      </div>
    </div>
  </div>
);
