import React, { useState } from 'react';
import { X, ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProxySettingsProps {
  onClose: () => void;
}

type TabType = 'proxy' | 'fingerprint' | 'cookie';

export const ProxySettings: React.FC<ProxySettingsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('proxy');
  const [proxyType, setProxyType] = useState<'custom' | 'managed'>('custom');
  const [protocol, setProtocol] = useState('直连模式 (不设置代理)');

  // 指纹设置
  const [browserVersion, setBrowserVersion] = useState('142');
  const [os, setOs] = useState('Windows');
  const [userAgent, setUserAgent] = useState('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  const [webRTC, setWebRTC] = useState<'replace' | 'allow' | 'disable'>('disable');
  const [geoLocation, setGeoLocation] = useState<'allow' | 'disable'>('disable');
  const [resolution, setResolution] = useState<'follow' | 'random'>('follow');

  const tabs = [
    { id: 'proxy' as TabType, label: '代理' },
    { id: 'fingerprint' as TabType, label: '指纹' },
    { id: 'cookie' as TabType, label: 'Cookie' },
  ];

  return (
    <div className="h-full bg-white rounded-xl shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-gray-900">环境配置</h3>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 px-3 py-2.5 text-xs font-medium transition-colors",
              activeTab === tab.id
                ? "text-emerald-600 border-b-2 border-emerald-500"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'proxy' && (
          <ProxyTab
            proxyType={proxyType}
            setProxyType={setProxyType}
            protocol={protocol}
            setProtocol={setProtocol}
          />
        )}
        {activeTab === 'fingerprint' && (
          <FingerprintTab
            browserVersion={browserVersion}
            setBrowserVersion={setBrowserVersion}
            os={os}
            setOs={setOs}
            userAgent={userAgent}
            setUserAgent={setUserAgent}
            webRTC={webRTC}
            setWebRTC={setWebRTC}
            geoLocation={geoLocation}
            setGeoLocation={setGeoLocation}
            resolution={resolution}
            setResolution={setResolution}
          />
        )}
        {activeTab === 'cookie' && <CookieTab />}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
        <button className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
          随机生成
        </button>
        <button className="flex-1 px-3 py-2 text-xs font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600">
          应用
        </button>
      </div>
    </div>
  );
};

// 代理设置标签页
interface ProxyTabProps {
  proxyType: 'custom' | 'managed';
  setProxyType: (type: 'custom' | 'managed') => void;
  protocol: string;
  setProtocol: (protocol: string) => void;
}

const ProxyTab: React.FC<ProxyTabProps> = ({ proxyType, setProxyType, protocol, setProtocol }) => {
  return (
    <div className="space-y-6">
      {/* 代理配置 */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">代理配置</h4>
        <div className="space-y-4">
          {/* 选择代理 */}
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-500 w-20">选择代理</span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={proxyType === 'custom'}
                  onChange={() => setProxyType('custom')}
                  className="w-4 h-4 text-[#0059F8]"
                />
                <span className="text-sm text-[#0059F8]">自定义代理</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={proxyType === 'managed'}
                  onChange={() => setProxyType('managed')}
                  className="w-4 h-4 text-gray-400"
                />
                <span className="text-sm text-gray-600">代理IP管理</span>
              </label>
            </div>
          </div>

          {/* 协议 */}
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-500 w-20">协议</span>
            <div className="relative flex-1">
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-[#0059F8] bg-white"
              >
                <option>直连模式 (不设置代理)</option>
                <option>HTTP</option>
                <option>HTTPS</option>
                <option>SOCKS5</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 本机IP信息 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span>(本机) 109.122.3.167 / Hong Kong</span>
        </div>
      </div>
    </div>
  );
};

// 指纹设置标签页
interface FingerprintTabProps {
  browserVersion: string;
  setBrowserVersion: (v: string) => void;
  os: string;
  setOs: (v: string) => void;
  userAgent: string;
  setUserAgent: (v: string) => void;
  webRTC: 'replace' | 'allow' | 'disable';
  setWebRTC: (v: 'replace' | 'allow' | 'disable') => void;
  geoLocation: 'allow' | 'disable';
  setGeoLocation: (v: 'allow' | 'disable') => void;
  resolution: 'follow' | 'random';
  setResolution: (v: 'follow' | 'random') => void;
}

const FingerprintTab: React.FC<FingerprintTabProps> = ({
  browserVersion, setBrowserVersion,
  os, setOs,
  userAgent, setUserAgent,
  webRTC, setWebRTC,
  geoLocation, setGeoLocation,
  resolution, setResolution,
}) => {
  return (
    <div className="space-y-5">
      {/* 指纹设置标题 */}
      <h4 className="text-sm font-medium text-gray-900">指纹设置</h4>

      {/* 浏览器版本 */}
      <FormRow label="浏览器版本">
        <div className="relative flex-1">
          <select
            value={browserVersion}
            onChange={(e) => setBrowserVersion(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-[#0059F8] bg-white"
          >
            <option value="142">142</option>
            <option value="141">141</option>
            <option value="140">140</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </FormRow>
      <p className="text-xs text-gray-400 ml-24 -mt-3">
        建议选择最新内核，若切换不同内核请清除缓存，以免异常
      </p>

      {/* 操作系统 */}
      <FormRow label="操作系统">
        <div className="relative flex-1">
          <select
            value={os}
            onChange={(e) => setOs(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-[#0059F8] bg-white"
          >
            <option value="Windows">Windows</option>
            <option value="macOS">macOS</option>
            <option value="Linux">Linux</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </FormRow>

      {/* User Agent */}
      <FormRow label="User Agent">
        <div className="flex-1 flex gap-2">
          <textarea
            value={userAgent}
            onChange={(e) => setUserAgent(e.target.value)}
            rows={3}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0059F8] resize-none"
          />
        </div>
      </FormRow>
      <div className="flex justify-end -mt-3">
        <button className="text-sm text-[#0059F8] hover:underline">换一换</button>
      </div>

      {/* WebRTC */}
      <FormRow label="WebRTC">
        <div className="flex gap-2">
          <ToggleButton active={webRTC === 'replace'} onClick={() => setWebRTC('replace')}>替换</ToggleButton>
          <ToggleButton active={webRTC === 'allow'} onClick={() => setWebRTC('allow')}>允许</ToggleButton>
          <ToggleButton active={webRTC === 'disable'} onClick={() => setWebRTC('disable')} variant="danger">禁止</ToggleButton>
        </div>
      </FormRow>
      <p className="text-xs text-gray-400 ml-24 -mt-3">
        WebRTC被关闭，网站会检测到您关闭了WebRTC
      </p>

      {/* 地理位置 */}
      <FormRow label="地理位置">
        <div className="flex gap-2">
          <ToggleButton active={geoLocation === 'allow'} onClick={() => setGeoLocation('allow')}>允许</ToggleButton>
          <ToggleButton active={geoLocation === 'disable'} onClick={() => setGeoLocation('disable')} variant="danger">禁止</ToggleButton>
        </div>
      </FormRow>

      {/* 分辨率 */}
      <FormRow label="分辨率">
        <div className="flex gap-2">
          <ToggleButton active={resolution === 'follow'} onClick={() => setResolution('follow')} variant="primary">跟随电脑</ToggleButton>
          <ToggleButton active={resolution === 'random'} onClick={() => setResolution('random')}>随机</ToggleButton>
        </div>
      </FormRow>
    </div>
  );
};

// Cookie标签页
const CookieTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900">Cookie 管理</h4>
      <textarea
        placeholder="粘贴 Cookie 内容..."
        rows={10}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0059F8] resize-none font-mono"
      />
      <div className="flex gap-2">
        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
          导入 Cookie
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
          导出 Cookie
        </button>
        <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
          清除 Cookie
        </button>
      </div>
    </div>
  );
};

// 表单行组件
const FormRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-start gap-4">
    <span className="text-sm text-gray-500 w-20 pt-2 flex-shrink-0">{label}</span>
    {children}
  </div>
);

// 切换按钮组件
interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'danger';
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ active, onClick, children, variant = 'default' }) => {
  const getStyles = () => {
    if (active) {
      if (variant === 'danger') return 'bg-red-500 text-white border-red-500';
      if (variant === 'primary') return 'bg-[#0059F8] text-white border-[#0059F8]';
      return 'bg-gray-100 text-gray-900 border-gray-300';
    }
    return 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50';
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 text-sm font-medium border rounded-lg transition-colors",
        getStyles()
      )}
    >
      {children}
    </button>
  );
};
