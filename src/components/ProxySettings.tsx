import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Globe, Shield, Fingerprint, Cookie } from 'lucide-react';
import { cn } from '@/lib/utils';

// 自定义下拉组件
const CustomSelect: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({ value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-1.5 text-xs border rounded-lg bg-white transition-colors",
          open ? "border-[#FF6B35] ring-2 ring-[#FF6B35]/20" : "border-[#D9D9D9]"
        )}
      >
        <span className={cn("truncate", selected ? "text-[#1A1A1A]" : "text-[#999]")}>
          {selected?.label || placeholder || '请选择'}
        </span>
        <ChevronDown className={cn("w-3.5 h-3.5 flex-shrink-0 text-[#999] transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-[#D9D9D9] rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={cn(
                "w-full text-left px-3 py-1.5 text-xs whitespace-nowrap transition-colors",
                opt.value === value
                  ? "bg-[#FFF0E8] text-[#FF6B35] font-medium"
                  : "text-[#333] hover:bg-[#F7F8FA]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E8E8]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF8F5E] flex items-center justify-center shadow-sm">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-[#1A1A1A]">环境配置</h3>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-[#F2F2F2] rounded-lg transition-colors">
          <X className="w-4 h-4 text-[#999]" />
        </button>
      </div>

      {/* Tabs - 用于快速定位 */}
      <div className="flex border-b border-[#E8E8E8]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(tab.id)}
            className={cn(
              "flex-1 px-2 py-2.5 text-xs font-medium transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "text-[#FF6B35] border-b-2 border-[#FF6B35]"
                : "text-[#999] hover:text-[#333]"
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
      <div className="flex items-center gap-2 px-4 py-3 border-t border-[#E8E8E8]">
        <button className="flex-1 px-3 py-2 text-xs font-medium text-[#1A1A1A] bg-[#F2F2F2] rounded-lg hover:bg-[#E8E8E8]">
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
    <div className="bg-white rounded-xl p-4 border border-[#E8E8E8]">
      {/* 代理配置 */}
      <h4 className="text-sm font-semibold text-[#1A1A1A] pb-3 mb-3 border-b border-[#E8E8E8] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#1A1A1A] flex items-center justify-center shadow-sm">
          <Shield className="w-5 h-5 text-white" />
        </div>
        代理配置
      </h4>
      <div className="space-y-3">
        {/* 选择代理 */}
        <div className="flex items-center gap-3 bg-[#F7F8FA] rounded-lg px-3 py-2.5">
          <span className="text-xs text-[#1A1A1A] w-16 flex-shrink-0 font-medium">选择代理</span>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
              <input
                type="radio"
                checked={proxyType === 'custom'}
                onChange={() => setProxyType('custom')}
                className="w-4 h-4 text-[#FF6B35] accent-[#FF6B35]"
              />
              <span className={cn("text-xs", proxyType === 'custom' ? "text-[#FF6B35] font-medium" : "text-[#666]")}>自定义代理</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap">
              <input
                type="radio"
                checked={proxyType === 'managed'}
                onChange={() => setProxyType('managed')}
                className="w-4 h-4 text-[#FF6B35] accent-[#FF6B35]"
              />
              <span className={cn("text-xs", proxyType === 'managed' ? "text-[#FF6B35] font-medium" : "text-[#666]")}>代理IP管理</span>
            </label>
          </div>
        </div>

        {/* 协议/代理IP */}
        <div className="flex items-center gap-3 bg-[#F7F8FA] rounded-lg px-3 py-2.5">
          <span className="text-xs text-[#1A1A1A] w-16 flex-shrink-0 font-medium">
            {proxyType === 'managed' ? '代理IP' : '协议'}
          </span>
          <CustomSelect
              value={proxyType === 'managed' ? '' : protocol}
              onChange={(v) => setProtocol(v)}
              placeholder="请选择"
              options={proxyType === 'managed'
                ? [{ value: '', label: '请选择' }]
                : [
                    { value: '直连模式 (不设置代理)', label: '直连模式 (不设置代理)' },
                    { value: 'HTTP', label: 'HTTP' },
                    { value: 'HTTPS', label: 'HTTPS' },
                    { value: 'SOCKS5', label: 'SOCKS5' },
                  ]
              }
            />
        </div>

        {/* 本机IP信息 */}
        <div className="p-3 bg-[#FFF7F3] rounded-lg border border-[#FFD4BE]">
          <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
            <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
            <span className="font-semibold">(本机) 109.122.3.167 / Hong Kong</span>
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
    <div className="bg-white rounded-xl p-4 border border-[#E8E8E8]">
      <h4 className="text-sm font-semibold text-[#1A1A1A] pb-3 mb-3 border-b border-[#E8E8E8] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#1A1A1A] flex items-center justify-center shadow-sm">
          <Fingerprint className="w-5 h-5 text-white" />
        </div>
        指纹设置
      </h4>
      <div className="space-y-2.5">
      <FormRow label="浏览器版本">
        <CustomSelect
          value={browserVersion}
          onChange={(v) => setBrowserVersion(v)}
          options={[
            { value: '142', label: '142' },
            { value: '141', label: '141' },
            { value: '140', label: '140' },
          ]}
        />
      </FormRow>
      <p className="text-xs text-[#999] ml-[84px] -mt-1">建议选择最新内核，若切换不同内核请清除缓存，以免异常</p>

      {/* 操作系统 */}
      <FormRow label="操作系统">
        <CustomSelect
          value={os}
          onChange={(v) => setOs(v)}
          options={[
            { value: 'Windows', label: 'Windows' },
            { value: 'macOS', label: 'macOS' },
            { value: 'Linux', label: 'Linux' },
          ]}
        />
      </FormRow>

      {/* User Agent */}
      <FormRow label="User Agent">
        <textarea
          value={userAgent}
          onChange={(e) => setUserAgent(e.target.value)}
          rows={3}
          className="flex-1 px-3 py-1.5 text-xs border border-[#D9D9D9] rounded-lg focus:outline-none focus:border-[#FF6B35] resize-none"
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
      <p className="text-xs text-[#999] ml-[84px] -mt-1">WebRTC被关闭，网站会检测到您关闭了WebRTC</p>

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
            className="w-16 px-2 py-1.5 text-xs border border-[#D9D9D9] rounded-lg focus:outline-none focus:border-[#FF6B35] text-center"
          />
          <span className="text-xs text-[#999]">×</span>
          <input
            type="text"
            value={resHeight}
            onChange={(e) => setResHeight(e.target.value)}
            className="w-16 px-2 py-1.5 text-xs border border-[#D9D9D9] rounded-lg focus:outline-none focus:border-[#FF6B35] text-center"
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
      <FormRow label={<span>Canvas<br/><span className="text-[#999] text-[10px]">(新建会话生效)</span></span>}>
        <div className="flex-1">
          <div className="flex gap-1.5">
            <ToggleButton active={canvas === 'random'} onClick={() => setCanvas('random')}>随机</ToggleButton>
            <ToggleButton active={canvas === 'off'} onClick={() => setCanvas('off')} variant="primary">关闭</ToggleButton>
          </div>
          <p className="text-xs text-[#999] mt-1">每个浏览器使用当前电脑默认的Canvas</p>
        </div>
      </FormRow>

      {/* AudioContext */}
      <FormRow label={<span>AudioContext<br/><span className="text-[#999] text-[10px]">(新建会话生效)</span></span>}>
        <div className="flex-1">
          <div className="flex gap-1.5">
            <ToggleButton active={audioContext === 'random'} onClick={() => setAudioContext('random')}>随机</ToggleButton>
            <ToggleButton active={audioContext === 'off'} onClick={() => setAudioContext('off')} variant="primary">关闭</ToggleButton>
          </div>
          <p className="text-xs text-[#999] mt-1">每个浏览器使用当前电脑默认的Audio</p>
        </div>
      </FormRow>

      {/* ClientRects */}
      <FormRow label={<span>ClientRects<br/><span className="text-[#999] text-[10px]">(新建会话生效)</span></span>}>
        <div className="flex-1">
          <div className="flex gap-1.5">
            <ToggleButton active={clientRects === 'random'} onClick={() => setClientRects('random')}>随机</ToggleButton>
            <ToggleButton active={clientRects === 'off'} onClick={() => setClientRects('off')} variant="primary">关闭</ToggleButton>
          </div>
          <p className="text-xs text-[#999] mt-1">每个浏览器使用当前电脑默认的ClientRects</p>
        </div>
      </FormRow>

      {/* 设备信息 */}
      <FormRow label="设备信息">
        <div className="flex-1">
          <div className="flex gap-1.5">
            <ToggleButton active={deviceInfo === 'custom'} onClick={() => setDeviceInfo('custom')}>自定义</ToggleButton>
            <ToggleButton active={deviceInfo === 'off'} onClick={() => setDeviceInfo('off')} variant="primary">关闭</ToggleButton>
          </div>
          <p className="text-xs text-[#999] mt-1">每个浏览器使用当前电脑默认的设备名称和MAC地址</p>
        </div>
      </FormRow>

      {/* 硬件并发数 */}
      <FormRow label="硬件并发数">
        <div className="flex-1">
          <CustomSelect
            value={hardwareConcurrency}
            onChange={(v) => setHardwareConcurrency(v)}
            options={[
              { value: '2', label: '2' },
              { value: '4', label: '4' },
              { value: '8', label: '8' },
              { value: '16', label: '16' },
            ]}
          />
          <p className="text-xs text-[#999] mt-1">设置当前浏览器环境的CPU核心数</p>
        </div>
      </FormRow>

      {/* 设备内存 */}
      <FormRow label="设备内存">
        <div className="flex-1">
          <CustomSelect
            value={deviceMemory}
            onChange={(v) => setDeviceMemory(v)}
            options={[
              { value: '2', label: '2' },
              { value: '4', label: '4' },
              { value: '8', label: '8' },
              { value: '16', label: '16' },
              { value: '32', label: '32' },
            ]}
          />
          <p className="text-xs text-[#999] mt-1">设置当前浏览器环境环境的机器内存</p>
        </div>
      </FormRow>
      </div>
    </div>
  );
};

// Cookie标签页
const CookieTab: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-4 border border-[#E8E8E8]">
      <h4 className="text-sm font-semibold text-[#1A1A1A] pb-3 mb-3 border-b border-[#E8E8E8] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#1A1A1A] flex items-center justify-center shadow-sm">
          <Cookie className="w-5 h-5 text-white" />
        </div>
        Cookie
      </h4>
      <div className="space-y-3">
        <div className="bg-[#F7F8FA] rounded-lg p-3">
          <textarea
            placeholder="粘贴 Cookie 内容..."
            rows={6}
            className="w-full px-3 py-2 text-xs border border-[#D9D9D9] rounded-lg focus:outline-none focus:border-[#FF6B35] resize-none font-mono bg-white shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium text-[#1A1A1A] bg-[#F2F2F2] rounded-lg hover:bg-[#E8E8E8] whitespace-nowrap border border-[#D9D9D9] shadow-sm">
            导入
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-[#1A1A1A] bg-[#F2F2F2] rounded-lg hover:bg-[#E8E8E8] whitespace-nowrap border border-[#D9D9D9] shadow-sm">
            导出
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-white bg-[#1A1A1A] rounded-lg hover:bg-[#333] whitespace-nowrap shadow-sm">
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
    <span className="text-xs text-[#1A1A1A] w-[68px] pt-1.5 flex-shrink-0 leading-tight">{label}</span>
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
      if (variant === 'danger') return 'bg-[#1A1A1A] text-white border-[#1A1A1A]';
      if (variant === 'primary') return 'bg-[#FF6B35] text-white border-[#FF6B35]';
      return 'bg-[#FF6B35] text-white border-[#FF6B35]';
    }
    return 'bg-white text-[#666] border-[#D9D9D9] hover:bg-[#F7F8FA]';
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
