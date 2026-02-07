import React, { useState, useRef } from 'react';
import { X, ChevronDown, Globe, Shield, Fingerprint, Cookie } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProxySettingsProps {
  onClose: () => void;
}

type TabType = 'proxy' | 'fingerprint' | 'cookie';

export const ProxySettings: React.FC<ProxySettingsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('proxy');
  const [proxyType, setProxyType] = useState<'custom' | 'managed'>('custom');
  const [protocol, setProtocol] = useState('直连模式 (不设置代理)');

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const proxyRef = useRef<HTMLDivElement>(null);
  const fingerprintRef = useRef<HTMLDivElement>(null);
  const cookieRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'proxy' as TabType, label: '代理设置', ref: proxyRef },
    { id: 'fingerprint' as TabType, label: '指纹设置', ref: fingerprintRef },
    { id: 'cookie' as TabType, label: 'Cookie', ref: cookieRef },
  ];

  // 点击tab滚动到对应区域
  const scrollToSection = (tab: TabType) => {
    setActiveTab(tab);
    const targetRef = tabs.find(t => t.id === tab)?.ref;
    if (targetRef?.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const targetTop = targetRef.current.offsetTop;
      container.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-full bg-white rounded-xl shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#FF6B35]" />
          <h3 className="font-semibold text-gray-900">环境配置</h3>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Tabs - 用于快速定位 */}
      <div className="flex border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(tab.id)}
            className={cn(
              "flex-1 px-2 py-2.5 text-xs font-medium transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "text-[#FF6B35] border-b-2 border-[#FF6B35]"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content - 滚动长页面 */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6"
      >
        {/* 代理设置区域 */}
        <div ref={proxyRef}>
          <ProxyTab
            proxyType={proxyType}
            setProxyType={setProxyType}
            protocol={protocol}
            setProtocol={setProtocol}
          />
        </div>

        {/* 指纹设置区域 */}
        <div ref={fingerprintRef}>
          <FingerprintTab />
        </div>

        {/* Cookie区域 */}
        <div ref={cookieRef}>
          <CookieTab />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
        <button className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
          随机生成
        </button>
        <button className="flex-1 px-3 py-2 text-xs font-medium text-white bg-[#FF6B35] rounded-lg hover:bg-[#E85A2A]">
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
    <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/50 rounded-xl p-4 border border-orange-100/60">
      {/* 代理配置 */}
      <h4 className="text-sm font-semibold text-gray-900 pb-3 mb-3 border-b border-orange-200/50 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center">
          <Shield className="w-4 h-4 text-[#FF6B35]" />
        </div>
        代理配置
      </h4>
      <div className="space-y-3">
        {/* 选择代理 */}
        <div className="flex items-center gap-3 bg-white/70 rounded-lg px-3 py-2.5">
          <span className="text-xs text-gray-600 w-16 flex-shrink-0 font-medium">选择代理</span>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
              <input
                type="radio"
                checked={proxyType === 'custom'}
                onChange={() => setProxyType('custom')}
                className="w-4 h-4 text-[#FF6B35] accent-[#FF6B35]"
              />
              <span className={cn("text-xs", proxyType === 'custom' ? "text-[#FF6B35] font-medium" : "text-gray-600")}>自定义代理</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
              <input
                type="radio"
                checked={proxyType === 'managed'}
                onChange={() => setProxyType('managed')}
                className="w-4 h-4 text-[#FF6B35] accent-[#FF6B35]"
              />
              <span className={cn("text-xs", proxyType === 'managed' ? "text-[#FF6B35] font-medium" : "text-gray-600")}>代理IP管理</span>
            </label>
          </div>
        </div>

        {/* 协议/代理IP */}
        <div className="flex items-center gap-3 bg-white/70 rounded-lg px-3 py-2.5">
          <span className="text-xs text-gray-600 w-16 flex-shrink-0 font-medium">
            {proxyType === 'managed' ? '代理IP' : '协议'}
          </span>
          <div className="relative flex-1">
            <select
              value={proxyType === 'managed' ? '' : protocol}
              onChange={(e) => setProtocol(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] bg-white shadow-sm"
            >
              {proxyType === 'managed' ? (
                <option value="">请选择</option>
              ) : (
                <>
                  <option>直连模式 (不设置代理)</option>
                  <option>HTTP</option>
                  <option>HTTPS</option>
                  <option>SOCKS5</option>
                </>
              )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* 本机IP信息 */}
        <div className="p-3 bg-white/80 rounded-lg border border-green-200/50">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium">(本机) 109.122.3.167 / Hong Kong</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 指纹设置标签页 - 简化为内部状态管理
const FingerprintTab: React.FC = () => {
  const [browserVersion, setBrowserVersion] = React.useState('142');
  const [os, setOs] = React.useState('Windows');
  const [userAgent, setUserAgent] = React.useState('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36');
  const [webRTC, setWebRTC] = React.useState<'replace' | 'allow' | 'disable'>('disable');
  const [geoLocation, setGeoLocation] = React.useState<'allow' | 'disable'>('disable');
  const [resolution, setResolution] = React.useState<'follow' | 'random'>('follow');
  const [resWidth, setResWidth] = React.useState('1410');
  const [resHeight, setResHeight] = React.useState('802');
  const [font, setFont] = React.useState<'system' | 'random'>('system');
  const [canvas, setCanvas] = React.useState<'random' | 'off'>('off');
  const [audioContext, setAudioContext] = React.useState<'random' | 'off'>('off');
  const [clientRects, setClientRects] = React.useState<'random' | 'off'>('off');
  const [deviceInfo, setDeviceInfo] = React.useState<'custom' | 'off'>('off');
  const [hardwareConcurrency, setHardwareConcurrency] = React.useState('4');
  const [deviceMemory, setDeviceMemory] = React.useState('8');

  return (
    <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 rounded-xl p-4 border border-blue-100/60">
      <h4 className="text-sm font-semibold text-gray-900 pb-3 mb-3 border-b border-blue-200/50 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Fingerprint className="w-4 h-4 text-blue-500" />
        </div>
        指纹设置
      </h4>
      <div className="space-y-2.5">
      <FormRow label="浏览器版本">
        <div className="relative flex-1">
          <select
            value={browserVersion}
            onChange={(e) => setBrowserVersion(e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] bg-white"
          >
            <option value="142">142</option>
            <option value="141">141</option>
            <option value="140">140</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
      </FormRow>
      <p className="text-xs text-gray-400 ml-[84px] -mt-1">建议选择最新内核，若切换不同内核请清除缓存，以免异常</p>

      {/* 操作系统 */}
      <FormRow label="操作系统">
        <div className="relative flex-1">
          <select
            value={os}
            onChange={(e) => setOs(e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] bg-white"
          >
            <option value="Windows">Windows</option>
            <option value="macOS">macOS</option>
            <option value="Linux">Linux</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
      </FormRow>

      {/* User Agent */}
      <FormRow label="User Agent">
        <textarea
          value={userAgent}
          onChange={(e) => setUserAgent(e.target.value)}
          rows={3}
          className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] resize-none"
        />
      </FormRow>
      <div className="flex justify-end -mt-2">
        <button className="text-xs text-[#FF6B35] hover:underline">换一换</button>
      </div>

      {/* WebRTC */}
      <FormRow label="WebRTC">
        <div className="flex gap-1.5">
          <ToggleButton active={webRTC === 'replace'} onClick={() => setWebRTC('replace')}>替换</ToggleButton>
          <ToggleButton active={webRTC === 'allow'} onClick={() => setWebRTC('allow')}>允许</ToggleButton>
          <ToggleButton active={webRTC === 'disable'} onClick={() => setWebRTC('disable')} variant="primary">禁止</ToggleButton>
        </div>
      </FormRow>
      <p className="text-xs text-gray-400 ml-[84px] -mt-1">WebRTC被关闭，网站会检测到您关闭了WebRTC</p>

      {/* 地理位置 */}
      <FormRow label="地理位置">
        <div className="flex gap-1.5">
          <ToggleButton active={geoLocation === 'allow'} onClick={() => setGeoLocation('allow')}>允许</ToggleButton>
          <ToggleButton active={geoLocation === 'disable'} onClick={() => setGeoLocation('disable')} variant="primary">禁止</ToggleButton>
        </div>
      </FormRow>

      {/* 分辨率 */}
      <FormRow label="分辨率">
        <div className="flex gap-1.5">
          <ToggleButton active={resolution === 'follow'} onClick={() => setResolution('follow')} variant="primary">跟随电脑</ToggleButton>
          <ToggleButton active={resolution === 'random'} onClick={() => setResolution('random')}>随机</ToggleButton>
        </div>
      </FormRow>

      {/* 分辨率值 */}
      <FormRow label="分辨率值">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={resWidth}
            onChange={(e) => setResWidth(e.target.value)}
            className="w-16 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] text-center"
          />
          <span className="text-xs text-gray-400">×</span>
          <input
            type="text"
            value={resHeight}
            onChange={(e) => setResHeight(e.target.value)}
            className="w-16 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] text-center"
          />
        </div>
      </FormRow>

      {/* 字体 */}
      <FormRow label="字体">
        <div className="flex gap-1.5">
          <ToggleButton active={font === 'system'} onClick={() => setFont('system')} variant="primary">系统默认</ToggleButton>
          <ToggleButton active={font === 'random'} onClick={() => setFont('random')}>随机匹配</ToggleButton>
        </div>
      </FormRow>

      {/* Canvas */}
      <FormRow label={<span>Canvas<br/><span className="text-gray-400 text-[10px]">(新建会话生效)</span></span>}>
        <div className="flex-1">
          <div className="flex gap-1.5">
            <ToggleButton active={canvas === 'random'} onClick={() => setCanvas('random')}>随机</ToggleButton>
            <ToggleButton active={canvas === 'off'} onClick={() => setCanvas('off')} variant="primary">关闭</ToggleButton>
          </div>
          <p className="text-xs text-gray-400 mt-1">每个浏览器使用当前电脑默认的Canvas</p>
        </div>
      </FormRow>

      {/* AudioContext */}
      <FormRow label={<span>AudioContext<br/><span className="text-gray-400 text-[10px]">(新建会话生效)</span></span>}>
        <div className="flex-1">
          <div className="flex gap-1.5">
            <ToggleButton active={audioContext === 'random'} onClick={() => setAudioContext('random')}>随机</ToggleButton>
            <ToggleButton active={audioContext === 'off'} onClick={() => setAudioContext('off')} variant="primary">关闭</ToggleButton>
          </div>
          <p className="text-xs text-gray-400 mt-1">每个浏览器使用当前电脑默认的Audio</p>
        </div>
      </FormRow>

      {/* ClientRects */}
      <FormRow label={<span>ClientRects<br/><span className="text-gray-400 text-[10px]">(新建会话生效)</span></span>}>
        <div className="flex-1">
          <div className="flex gap-1.5">
            <ToggleButton active={clientRects === 'random'} onClick={() => setClientRects('random')}>随机</ToggleButton>
            <ToggleButton active={clientRects === 'off'} onClick={() => setClientRects('off')} variant="primary">关闭</ToggleButton>
          </div>
          <p className="text-xs text-gray-400 mt-1">每个浏览器使用当前电脑默认的ClientRects</p>
        </div>
      </FormRow>

      {/* 设备信息 */}
      <FormRow label="设备信息">
        <div className="flex-1">
          <div className="flex gap-1.5">
            <ToggleButton active={deviceInfo === 'custom'} onClick={() => setDeviceInfo('custom')}>自定义</ToggleButton>
            <ToggleButton active={deviceInfo === 'off'} onClick={() => setDeviceInfo('off')} variant="primary">关闭</ToggleButton>
          </div>
          <p className="text-xs text-gray-400 mt-1">每个浏览器使用当前电脑默认的设备名称和MAC地址</p>
        </div>
      </FormRow>

      {/* 硬件并发数 */}
      <FormRow label="硬件并发数">
        <div className="flex-1">
          <div className="relative">
            <select
              value={hardwareConcurrency}
              onChange={(e) => setHardwareConcurrency(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] bg-white"
            >
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="16">16</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          <p className="text-xs text-gray-400 mt-1">设置当前浏览器环境的CPU核心数</p>
        </div>
      </FormRow>

      {/* 设备内存 */}
      <FormRow label="设备内存">
        <div className="flex-1">
          <div className="relative">
            <select
              value={deviceMemory}
              onChange={(e) => setDeviceMemory(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] bg-white"
            >
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="16">16</option>
              <option value="32">32</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          <p className="text-xs text-gray-400 mt-1">设置当前浏览器环境环境的机器内存</p>
        </div>
      </FormRow>
      </div>
    </div>
  );
};

// Cookie标签页
const CookieTab: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-purple-50/80 to-violet-50/50 rounded-xl p-4 border border-purple-100/60">
      <h4 className="text-sm font-semibold text-gray-900 pb-3 mb-3 border-b border-purple-200/50 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <Cookie className="w-4 h-4 text-purple-500" />
        </div>
        Cookie
      </h4>
      <div className="space-y-3">
        <div className="bg-white/70 rounded-lg p-3">
          <textarea
            placeholder="粘贴 Cookie 内容..."
            rows={6}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6B35] resize-none font-mono bg-white shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white/80 rounded-lg hover:bg-white whitespace-nowrap border border-gray-200 shadow-sm">
            导入
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white/80 rounded-lg hover:bg-white whitespace-nowrap border border-gray-200 shadow-sm">
            导出
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 whitespace-nowrap shadow-sm">
            清除
          </button>
        </div>
      </div>
    </div>
  );
};

// 表单行组件
const FormRow: React.FC<{ label: React.ReactNode; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex items-start gap-4">
    <span className="text-xs text-gray-500 w-[68px] pt-1.5 flex-shrink-0 leading-tight">{label}</span>
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
      if (variant === 'primary') return 'bg-[#FF6B35] text-white border-[#FF6B35]';
      return 'bg-[#FF6B35] text-white border-[#FF6B35]';
    }
    return 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50';
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors whitespace-nowrap min-w-[48px]",
        getStyles()
      )}
    >
      {children}
    </button>
  );
};
