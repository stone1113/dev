import React, { useState, useEffect, useRef } from 'react';
import { Plus, Filter, RefreshCw, X, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// 自定义复选框样式
const checkboxStyle = `
  [type='checkbox']:checked {
    background-color: #FF6B35;
    border-color: #FF6B35;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  }
  [type='radio']:checked {
    background-color: #FF6B35;
    border-color: #FF6B35;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
  }
`;

interface ProxyConfig {
  id: string;
  name: string;
  protocol: 'HTTP' | 'HTTPS' | 'SOCKS5';
  host: string;
  port: string;
  activationCodes: string;
  createdAt: Date;
}

const mockProxies: ProxyConfig[] = [
  { id: '1', name: '1112', protocol: 'HTTP', host: '12', port: '12', activationCodes: '部分激活码', createdAt: new Date('2026-02-10 14:10:00') },
  { id: '2', name: '测试代理', protocol: 'HTTPS', host: '192.168.1.1', port: '8080', activationCodes: '全部激活码', createdAt: new Date('2026-02-05 18:22:51') },
];

const CreateProxyModal: React.FC<{
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: ProxyConfig | null;
}> = ({ onClose, onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [protocol, setProtocol] = useState<'HTTP' | 'HTTPS' | 'SOCKS5'>(initialData?.protocol || 'HTTP');
  const [host, setHost] = useState(initialData?.host || '');
  const [port, setPort] = useState(initialData?.port || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [scope, setScope] = useState<'all' | 'partial'>(initialData?.activationCodes === '全部激活码' ? 'all' : 'partial');
  const [selectedActivationCodes, setSelectedActivationCodes] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const activationCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ((scope === 'partial' || showDropdown) && activationCodeRef.current) {
      setTimeout(() => {
        activationCodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [scope, showDropdown]);

  const mockActivationCodes = [
    { id: 'ac_001', code: 'QXMS-SA01-2024', remark: '张三' },
    { id: 'ac_002', code: 'QXMS-SA02-2024', remark: '李四' },
    { id: 'ac_003', code: 'QXMS-SO01-2024', remark: 'David' },
    { id: 'ac_004', code: 'QXMS-CP01-2024', remark: '小美' },
  ];

  const toggleActivationCode = (id: string) => {
    setSelectedActivationCodes(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const removeActivationCode = (id: string) => {
    setSelectedActivationCodes(prev => prev.filter(i => i !== id));
  };

  const filteredActivationCodes = mockActivationCodes.filter(ac =>
    ac.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ac.remark.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    onSave({ name, protocol, host, port, username, password, scope, activationCodes: selectedActivationCodes });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{initialData ? '编辑代理' : '创建代理'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span>
              代理名称
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </label>
            <input
              type="text"
              placeholder="请输入代理名称"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 30))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
            />
            <div className="text-xs text-gray-400 mt-1 text-right">{name.length}/30</div>
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span>
              协议
            </label>
            <select
              value={protocol}
              onChange={(e) => setProtocol(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
            >
              <option value="HTTP">HTTP</option>
              <option value="HTTPS">HTTPS</option>
              <option value="SOCKS5">SOCKS5</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span>
              主机
            </label>
            <input
              type="text"
              placeholder="请输入主机名"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span>
              端口
            </label>
            <input
              type="text"
              placeholder="请输入端口号"
              value={port}
              onChange={(e) => setPort(e.target.value.slice(0, 5))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
            />
            <div className="text-xs text-gray-400 mt-1 text-right">{port.length}/5</div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">用户名</label>
            <input
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">密码</label>
            <input
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">代理应用范围</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={scope === 'all'}
                  onChange={() => setScope('all')}
                  className="w-4 h-4 accent-[#FF6B35] focus:ring-[#FF6B35]"
                />
                <span className="text-sm text-gray-700">全部激活码</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={scope === 'partial'}
                  onChange={() => setScope('partial')}
                  className="w-4 h-4 accent-[#FF6B35] focus:ring-[#FF6B35]"
                />
                <span className="text-sm text-gray-700">部分激活码</span>
              </label>
            </div>
          </div>
          {scope === 'partial' && (
            <div ref={activationCodeRef} className="relative">
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span>
                选择激活码
              </label>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="min-h-[40px] px-3 py-2 border border-gray-200 rounded-lg cursor-pointer focus-within:ring-2 focus-within:ring-[#FF6B35]/30 focus-within:border-[#FF6B35]"
              >
                {selectedActivationCodes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedActivationCodes.map(id => {
                      const ac = mockActivationCodes.find(a => a.id === id);
                      return ac ? (
                        <span key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-[#FF6B35]/10 text-[#FF6B35] text-xs rounded">
                          {ac.code}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-[#E85A2A]"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeActivationCode(id);
                            }}
                          />
                        </span>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">请选择激活码</span>
                )}
              </div>
              {showDropdown && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-visible">
                  <div className="p-2 border-b border-gray-100">
                    <input
                      type="text"
                      placeholder="搜索激活码..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto p-2">
                    {filteredActivationCodes.map((ac) => (
                      <label key={ac.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedActivationCodes.includes(ac.id)}
                          onChange={() => toggleActivationCode(ac.id)}
                          className="rounded border-gray-300 accent-[#FF6B35] focus:ring-[#FF6B35]"
                        />
                        <span className="text-sm text-gray-700">{ac.code}</span>
                        <span className="text-xs text-gray-400">({ac.remark})</span>
                      </label>
                    ))}
                    {filteredActivationCodes.length === 0 && (
                      <div className="text-sm text-gray-400 text-center py-4">暂无匹配的激活码</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium bg-[#FF6B35] text-white rounded-lg hover:bg-[#E85A2A] transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProxyManagement: React.FC = () => {
  const [proxies] = useState<ProxyConfig[]>(mockProxies);
  const [searchName, setSearchName] = useState('');
  const [selectedCode, setSelectedCode] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProxy, setEditingProxy] = useState<ProxyConfig | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.length === proxies.length ? [] : proxies.map(p => p.id));
  };

  const handleReset = () => {
    setSearchName('');
    setSelectedCode('all');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <style>{checkboxStyle}</style>
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            disabled={selectedIds.length === 0}
            className={cn(
              "px-4 py-2 text-sm rounded-lg transition-colors",
              selectedIds.length > 0
                ? "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                : "text-gray-400 bg-gray-100 cursor-not-allowed"
            )}
          >
            批量删除
          </button>
          <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            导入代理IP
          </button>
          <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            导出代理IP
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-[#E85A2A] transition-colors"
          >
            <Plus className="w-4 h-4" />
            新建代理
          </button>
        </div>
      </div>

      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">激活码（备注）</span>
            <select
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
            >
              <option value="all">全部</option>
              <option value="dept">部分激活码</option>
              <option value="all-codes">全部激活码</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">代理名称</span>
            <input
              type="text"
              placeholder="请输入"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">创建时间</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35]"
            />
          </div>
          <button className="px-6 py-2 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-[#E85A2A] transition-colors">
            查询
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            重置
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 py-4 overflow-auto">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === proxies.length && proxies.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 accent-[#FF6B35] focus:ring-[#FF6B35]"
                  />
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">代理名称</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">协议</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">主机</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">端口</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">应用激活码</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">创建时间</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {proxies.map((proxy) => (
                <tr key={proxy.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(proxy.id)}
                      onChange={() => toggleSelect(proxy.id)}
                      className="rounded border-gray-300 accent-[#FF6B35] focus:ring-[#FF6B35]"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{proxy.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{proxy.protocol}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{proxy.host}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{proxy.port}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{proxy.activationCodes}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {proxy.createdAt.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="text-sm text-[#FF6B35] hover:underline">查看</button>
                      <button onClick={() => setEditingProxy(proxy)} className="text-sm text-[#FF6B35] hover:underline">编辑</button>
                      <button className="text-sm text-[#FF6B35] hover:underline">删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <CreateProxyModal
          onClose={() => setShowCreateModal(false)}
          onSave={(data) => {
            console.log('创建代理:', data);
            setShowCreateModal(false);
          }}
        />
      )}

      {editingProxy && (
        <CreateProxyModal
          initialData={editingProxy}
          onClose={() => setEditingProxy(null)}
          onSave={(data) => {
            console.log('编辑代理:', data);
            setEditingProxy(null);
          }}
        />
      )}
    </div>
  );
};
