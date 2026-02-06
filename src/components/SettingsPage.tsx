import React, { useState, useRef } from 'react';
import {
  Layers,
  Languages,
  Globe,
  Settings,
  Wrench,
  Info,
  ChevronRight,
  MessageSquare,
  Send,
  Check,
  HelpCircle,
  GripVertical,
  ExternalLink,
  Copy,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

// 设置菜单类型
type SettingsTab = 'platform' | 'translation' | 'proxy' | 'system' | 'general' | 'about';

// 菜单项配置
const menuItems: { id: SettingsTab; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'platform', label: '平台设置', icon: Layers, description: '管理已连接的社交平台' },
  { id: 'translation', label: '全局翻译设置', icon: Languages, description: '配置消息翻译偏好' },
  { id: 'proxy', label: '全局代理设置', icon: Globe, description: '网络代理与连接配置' },
  { id: 'system', label: '系统设置', icon: Settings, description: '主题、通知与安全' },
  { id: 'general', label: '通用功能设置', icon: Wrench, description: 'AI助手与快捷功能' },
  { id: 'about', label: '关于', icon: Info, description: '版本信息与帮助' },
];

// 左侧菜单组件
const SettingsSidebar: React.FC<{
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}> = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 头部 */}
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#FF6B35]/5 to-orange-50">
          <h2 className="text-lg font-bold text-gray-900">设置</h2>
          <p className="text-xs text-gray-500 mt-0.5">管理您的偏好设置</p>
        </div>

        {/* 菜单列表 */}
        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group mb-1",
                  isActive
                    ? "bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] text-white shadow-lg shadow-[#FF6B35]/25"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                  isActive
                    ? "bg-white/20"
                    : "bg-gray-100 group-hover:bg-[#FF6B35]/10"
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-[#FF6B35]"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium text-sm",
                    isActive ? "text-white" : "text-gray-900"
                  )}>
                    {item.label}
                  </p>
                  <p className={cn(
                    "text-xs truncate",
                    isActive ? "text-white/70" : "text-gray-400"
                  )}>
                    {item.description}
                  </p>
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-transform",
                  isActive ? "text-white/70" : "text-gray-300 group-hover:text-gray-400",
                  isActive && "translate-x-0.5"
                )} />
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

// 通用开关组件
const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  color?: 'orange' | 'green' | 'blue' | 'amber';
}> = ({ enabled, onChange, color = 'orange' }) => {
  const colorMap = {
    orange: 'bg-[#FF6B35]',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
  };

  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "w-11 h-6 rounded-full transition-colors relative",
        enabled ? colorMap[color] : "bg-gray-200"
      )}
    >
      <span className={cn(
        "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
        enabled ? "left-6" : "left-1"
      )} />
    </button>
  );
};

// 设置项卡片组件
const SettingCard: React.FC<{
  title: string;
  description?: string;
  icon?: React.ElementType;
  iconColor?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, description, icon: Icon, iconColor = 'text-[#FF6B35]', children, className }) => (
  <div className={cn("bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", className)}>
    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
      {Icon && (
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconColor.replace('text-', 'bg-') + '/10')}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
      )}
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

// 设置项行组件
const SettingRow: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
  border?: boolean;
}> = ({ title, description, children, border = true }) => (
  <div className={cn(
    "flex items-center justify-between py-4",
    border && "border-b border-gray-100 last:border-b-0"
  )}>
    <div className="flex-1 min-w-0 pr-4">
      <p className="font-medium text-gray-900 text-sm">{title}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
    <div className="flex-shrink-0">
      {children}
    </div>
  </div>
);

// 平台配置数据
const platformList = [
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, color: '#25D366', visible: true },
  { id: 'telegram', name: 'Telegram', icon: Send, color: '#0088cc', visible: true },
  { id: 'line', name: 'Line', icon: MessageSquare, color: '#00B900', visible: true },
];

// 平台设置面板
const PlatformSettings: React.FC = () => {
  const [platforms, setPlatforms] = useState(platformList);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const dragOverId = useRef<string | null>(null);

  const togglePlatform = (id: string) => {
    setPlatforms(prev => prev.map(p =>
      p.id === id ? { ...p, visible: !p.visible } : p
    ));
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    dragOverId.current = id;
  };

  const handleDragEnd = () => {
    if (draggedId && dragOverId.current && draggedId !== dragOverId.current) {
      setPlatforms(prev => {
        const newList = [...prev];
        const draggedIndex = newList.findIndex(p => p.id === draggedId);
        const overIndex = newList.findIndex(p => p.id === dragOverId.current);
        const [removed] = newList.splice(draggedIndex, 1);
        newList.splice(overIndex, 0, removed);
        return newList;
      });
    }
    setDraggedId(null);
    dragOverId.current = null;
  };

  return (
    <div className="space-y-6">
      <SettingCard
        title="左侧栏平台展示"
        description="自定义左侧栏平台展示，鼠标拖拽可以更换显示顺序。如需支持其他平台，可与我们联系 @洽小秘"
        icon={Layers}
      >
        <div className="grid grid-cols-2 gap-4">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.id}
                draggable
                onDragStart={() => handleDragStart(platform.id)}
                onDragOver={(e) => handleDragOver(e, platform.id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "relative p-4 rounded-xl border-2 transition-all group",
                  platform.visible
                    ? "border-[#FF6B35]/30 bg-[#FF6B35]/5"
                    : "border-gray-100 bg-gray-50/50",
                  draggedId === platform.id && "opacity-50 scale-95"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* 拖拽手柄 */}
                  <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-400">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${platform.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: platform.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{platform.name}</p>
                    <p className={cn(
                      "text-xs",
                      platform.visible ? "text-[#FF6B35]" : "text-gray-400"
                    )}>
                      {platform.visible ? '显示' : '隐藏'}
                    </p>
                  </div>
                  {/* 开关按钮 */}
                  <button
                    onClick={() => togglePlatform(platform.id)}
                    className={cn(
                      "w-10 h-6 rounded-full transition-colors relative",
                      platform.visible ? "bg-[#FF6B35]" : "bg-gray-200"
                    )}
                  >
                    <span className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                      platform.visible ? "left-5" : "left-1"
                    )} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </SettingCard>
    </div>
  );
};

// 下拉选择组件
const SelectDropdown: React.FC<{
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}> = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-left flex items-center justify-between bg-white hover:border-gray-300 transition-colors"
      >
        <span className="text-gray-900">{selectedOption?.label || '请选择'}</span>
        <ChevronRight className={cn(
          "w-4 h-4 text-gray-400 transition-transform",
          isOpen && "rotate-90"
        )} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors",
                value === option.value && "bg-[#FF6B35]/5 text-[#FF6B35]"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Tooltip 提示组件
const Tooltip: React.FC<{
  content: React.ReactNode;
  children: React.ReactNode;
}> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2
      });
    }
    setIsVisible(true);
  };

  return (
    <div className="relative inline-flex">
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className="fixed z-[9999]"
          style={{
            top: position.top,
            left: position.left,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="bg-gray-800 text-white text-xs rounded-lg px-4 py-3 w-[260px] shadow-xl leading-relaxed whitespace-pre-line">
            {content}
          </div>
          <div className="flex justify-center -mt-1">
            <div className="border-[6px] border-transparent border-t-gray-800" />
          </div>
        </div>
      )}
    </div>
  );
};

// 翻译设置面板
const TranslationSettings: React.FC = () => {
  const [receiveEnabled, setReceiveEnabled] = useState(true);
  const [receiveRoute, setReceiveRoute] = useState('google');
  const [receiveLanguage, setReceiveLanguage] = useState('zh');
  const [groupAutoTranslate, setGroupAutoTranslate] = useState(false);

  const [sendEnabled, setSendEnabled] = useState(true);
  const [sendRoute, setSendRoute] = useState('google');
  const [sendLanguage, setSendLanguage] = useState('en');
  const [autoDetect, setAutoDetect] = useState(true);
  const [skipChinese, setSkipChinese] = useState(true);

  const routeOptions = [
    { value: 'google', label: '谷歌' },
    { value: 'deepl', label: 'DeepL' },
    { value: 'baidu', label: '百度' },
    { value: 'youdao', label: '有道' },
  ];

  const languageOptions = [
    { value: 'zh', label: '中文（简体）' },
    { value: 'zh-TW', label: '中文（繁体）' },
    { value: 'en', label: '英语' },
    { value: 'ja', label: '日语' },
    { value: 'ko', label: '韩语' },
    { value: 'es', label: '西班牙语' },
    { value: 'fr', label: '法语' },
    { value: 'de', label: '德语' },
    { value: 'ru', label: '俄语' },
    { value: 'ar', label: '阿拉伯语' },
  ];

  return (
    <div className="space-y-6">
      <SettingCard
        title="翻译设置"
        description="以下设置将作为新创建会话的默认翻译设置"
        icon={Languages}
        iconColor="text-[#FF6B35]"
      >
        {/* 接收自动翻译设置 */}
        <div className="space-y-4 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-900">接收自动翻译设置</span>
              <Tooltip content="开启后，收到的消息将自动翻译为您设置的语言。此为全局译文设置，将应用于所有新会话。">
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
              </Tooltip>
            </div>
            <ToggleSwitch enabled={receiveEnabled} onChange={setReceiveEnabled} />
          </div>

          {receiveEnabled && (
            <>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">翻译路线</label>
                <SelectDropdown
                  value={receiveRoute}
                  options={routeOptions}
                  onChange={setReceiveRoute}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">翻译语言</label>
                <SelectDropdown
                  value={receiveLanguage}
                  options={languageOptions}
                  onChange={setReceiveLanguage}
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-900">群组自动翻译</span>
            <ToggleSwitch enabled={groupAutoTranslate} onChange={setGroupAutoTranslate} />
          </div>
        </div>

        {/* 发送自动翻译 */}
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-900">发送自动翻译</span>
              <Tooltip content="开启后，您发送的消息将自动翻译为目标语言后发送给对方。">
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
              </Tooltip>
            </div>
            <ToggleSwitch enabled={sendEnabled} onChange={setSendEnabled} />
          </div>

          {sendEnabled && (
            <>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">翻译路线</label>
                <SelectDropdown
                  value={sendRoute}
                  options={routeOptions}
                  onChange={setSendRoute}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-2 block">翻译语言</label>
                <SelectDropdown
                  value={sendLanguage}
                  options={languageOptions}
                  onChange={setSendLanguage}
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-900">自动识别</span>
              <Tooltip content="开启后，系统将根据您粉丝的手机号码的所属国家，为您设置发送的语言">
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
              </Tooltip>
            </div>
            <ToggleSwitch enabled={autoDetect} onChange={setAutoDetect} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-900">禁发中文自动开启</span>
              <Tooltip content={`启用：发送翻译开启时自动开启检测中文\n关闭：不跟随发送翻译开启，需要手动开启/关闭`}>
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
              </Tooltip>
            </div>
            <ToggleSwitch enabled={skipChinese} onChange={setSkipChinese} />
          </div>
        </div>
      </SettingCard>
    </div>
  );
};

// 代理设置面板
const ProxySettingsPanel: React.FC = () => {
  const [proxyEnabled, setProxyEnabled] = useState(false);
  const [selectedProxy, setSelectedProxy] = useState('');
  const [smartFill, setSmartFill] = useState('');
  const [protocol, setProtocol] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showProxyDropdown, setShowProxyDropdown] = useState(false);
  const [showProtocolDropdown, setShowProtocolDropdown] = useState(false);

  const proxyOptions = [
    { value: 'proxy1', label: '代理服务器 1' },
    { value: 'proxy2', label: '代理服务器 2' },
    { value: 'custom', label: '自定义代理' },
  ];

  const protocolOptions = [
    { value: 'http', label: 'HTTP' },
    { value: 'https', label: 'HTTPS' },
    { value: 'socks5', label: 'SOCKS5' },
  ];

  // 智能填写解析
  const handleSmartFill = (value: string) => {
    setSmartFill(value);
    // 尝试解析 IP:PORT 或 PROTOCOL://HOST:PORT 格式
    const match = value.match(/^(?:(\w+):\/\/)?([^:]+):(\d+)$/);
    if (match) {
      if (match[1]) setProtocol(match[1].toLowerCase());
      setHost(match[2]);
      setPort(match[3]);
    }
  };

  return (
    <div className="space-y-6">
      <SettingCard
        title="代理设置（全局）"
        description="全局代理设置，对于未进行单独设置的会话，代理的设置和全局代理设置的一致"
        icon={Globe}
        iconColor="text-[#FF6B35]"
      >
        <div className="space-y-5">
          {/* 启动代理服务器开关 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-900">启动代理服务器</span>
            <ToggleSwitch enabled={proxyEnabled} onChange={setProxyEnabled} />
          </div>

          {/* 选择代理 */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">选择代理</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProxyDropdown(!showProxyDropdown)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-left flex items-center justify-between bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <span className={selectedProxy ? "text-gray-900" : "text-gray-400"}>
                  {proxyOptions.find(o => o.value === selectedProxy)?.label || '请选择'}
                </span>
                <ChevronRight className={cn(
                  "w-4 h-4 text-gray-400 transition-transform",
                  showProxyDropdown && "rotate-90"
                )} />
              </button>
              {showProxyDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  {proxyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSelectedProxy(option.value);
                        setShowProxyDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors",
                        selectedProxy === option.value && "bg-[#FF6B35]/5 text-[#FF6B35]"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 智能填写 */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <label className="text-sm text-gray-600">智能填写</label>
              <Tooltip content="粘贴完整的代理信息，系统将自动识别并填充各字段。支持格式：IP:端口 或 协议://主机:端口">
                <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
              </Tooltip>
            </div>
            <textarea
              value={smartFill}
              onChange={(e) => handleSmartFill(e.target.value)}
              placeholder="粘贴IP信息到此处，自动识别"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] resize-none h-20 text-sm"
            />
          </div>

          {/* 协议 */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">协议</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProtocolDropdown(!showProtocolDropdown)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-left flex items-center justify-between bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <span className={protocol ? "text-gray-900" : "text-gray-400"}>
                  {protocolOptions.find(o => o.value === protocol)?.label || '请选择'}
                </span>
                <ChevronRight className={cn(
                  "w-4 h-4 text-gray-400 transition-transform",
                  showProtocolDropdown && "rotate-90"
                )} />
              </button>
              {showProtocolDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  {protocolOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setProtocol(option.value);
                        setShowProtocolDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors",
                        protocol === option.value && "bg-[#FF6B35]/5 text-[#FF6B35]"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 主机 */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              <span className="text-red-500 mr-1">*</span>主机
            </label>
            <input
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="请输入主机地址"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
            />
          </div>

          {/* 端口 */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              <span className="text-red-500 mr-1">*</span>端口
            </label>
            <input
              type="text"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="请输入端口号"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
            />
          </div>

          {/* 用户名 */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名（可选）"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
            />
          </div>

          {/* 密码 */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码（可选）"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              代理检测
            </button>
            <button className="px-6 py-2.5 bg-[#FF6B35] text-white rounded-lg text-sm font-medium hover:bg-[#E85A2A] transition-colors">
              应用
            </button>
          </div>
        </div>
      </SettingCard>
    </div>
  );
};

// 复选框组件
const Checkbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  tooltip?: string;
}> = ({ checked, onChange, label, tooltip }) => (
  <label className="flex items-center gap-3 py-2.5 cursor-pointer group">
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
        checked
          ? "bg-[#FF6B35] border-[#FF6B35]"
          : "border-gray-300 hover:border-gray-400"
      )}
    >
      {checked && <Check className="w-3 h-3 text-white" />}
    </button>
    <span className={cn(
      "text-sm transition-colors",
      checked ? "text-[#FF6B35]" : "text-gray-600 group-hover:text-gray-900"
    )}>
      {label}
    </span>
    {tooltip && (
      <Tooltip content={tooltip}>
        <HelpCircle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
      </Tooltip>
    )}
  </label>
);

// 系统设置面板
const SystemSettings: React.FC = () => {
  const [cacheDir, setCacheDir] = useState('C:\\Users\\11935\\AppData\\Roaming\\ChatBiz');
  const [autoStart, setAutoStart] = useState(true);
  const [minimizeToTray, setMinimizeToTray] = useState(true);
  const [showUnreadInTray, setShowUnreadInTray] = useState(true);
  const [systemNotification, setSystemNotification] = useState(true);
  const [notificationSound, setNotificationSound] = useState(true);
  const [disableSleep, setDisableSleep] = useState(true);
  const [pageZoom, setPageZoom] = useState(false);
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);

  return (
    <div className="space-y-6">
      <SettingCard
        title="系统设置"
        icon={Settings}
        iconColor="text-[#FF6B35]"
      >
        <div className="space-y-6">
          {/* 缓存目录 */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              缓存目录(更改后自动重启)
            </label>
            <div className="flex gap-3">
              <button className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
                选择更改目录
              </button>
              <input
                type="text"
                value={cacheDir}
                onChange={(e) => setCacheDir(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-600"
                readOnly
              />
            </div>
          </div>

          {/* 系统选项复选框列表 */}
          <div className="space-y-1 pt-2">
            <Checkbox
              checked={autoStart}
              onChange={setAutoStart}
              label="开机启动洽小秘"
            />
            <Checkbox
              checked={minimizeToTray}
              onChange={setMinimizeToTray}
              label="关闭窗口最小化到任务栏"
            />
            <Checkbox
              checked={showUnreadInTray}
              onChange={setShowUnreadInTray}
              label="系统托盘上显示未读消息"
            />
            <Checkbox
              checked={systemNotification}
              onChange={setSystemNotification}
              label="系统消息提示"
            />
            <Checkbox
              checked={notificationSound}
              onChange={setNotificationSound}
              label="系统消息提示声音"
            />
            <Checkbox
              checked={disableSleep}
              onChange={setDisableSleep}
              label="运行洽小秘期间，将禁用电脑息屏功能"
            />
            <Checkbox
              checked={pageZoom}
              onChange={setPageZoom}
              label="页面缩放"
              tooltip="启用后可以使用 Ctrl+滚轮 缩放页面大小"
            />
            <Checkbox
              checked={hardwareAcceleration}
              onChange={setHardwareAcceleration}
              label="启用硬件加速"
              tooltip="使用GPU加速渲染，可提升性能但可能在某些设备上出现兼容问题"
            />
          </div>
        </div>
      </SettingCard>
    </div>
  );
};

// 通用功能设置面板
const GeneralSettings: React.FC = () => {
  const [cpuOverloadAlert, setCpuOverloadAlert] = useState(true);

  return (
    <div className="space-y-6">
      <SettingCard
        title="通用功能设置"
        icon={Wrench}
        iconColor="text-[#FF6B35]"
      >
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-900">CPU超负载提醒</span>
          <ToggleSwitch
            enabled={cpuOverloadAlert}
            onChange={setCpuOverloadAlert}
          />
        </div>
      </SettingCard>
    </div>
  );
};

// 关于面板
const AboutSettings: React.FC = () => {
  const [deviceId] = useState('bb76ce68-b9f1-4351-a7b1-13d2f08c9a34');
  const [residualSize] = useState('0B');
  const [cacheSize] = useState('7.32MB');

  const copyDeviceId = () => {
    navigator.clipboard.writeText(deviceId);
  };

  return (
    <div className="space-y-6">
      <SettingCard
        title="关于"
        icon={Info}
        iconColor="text-[#FF6B35]"
      >
        <div className="space-y-5">
          {/* 设备ID */}
          <div className="flex items-start">
            <span className="text-sm text-gray-600 w-24 flex-shrink-0 pt-0.5">设备ID</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-900">{deviceId}</span>
              <button
                onClick={copyDeviceId}
                className="text-gray-400 hover:text-[#FF6B35] transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 使用帮助 */}
          <div className="flex items-start">
            <span className="text-sm text-gray-600 w-24 flex-shrink-0 pt-0.5">使用帮助</span>
            <button className="text-sm text-[#FF6B35] hover:underline">
              查看文档
            </button>
          </div>

          {/* 联系客服 */}
          <div className="flex items-start">
            <span className="text-sm text-gray-600 w-24 flex-shrink-0 pt-0.5">联系客服</span>
            <div className="flex items-center gap-1.5">
              <Send className="w-4 h-4 text-[#0088cc]" />
              <span className="text-sm text-[#FF6B35]">@QiaXiaoMi_Help</span>
            </div>
          </div>

          {/* 版本号 */}
          <div className="flex items-start">
            <span className="text-sm text-gray-600 w-24 flex-shrink-0 pt-0.5">版本号</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-900">v1.0.0</span>
              <button className="text-gray-400 hover:text-[#FF6B35] transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 日志上报 */}
          <div className="flex items-start">
            <span className="text-sm text-gray-600 w-24 flex-shrink-0 pt-0.5">日志上报</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">将本机产生的错误日志一键上报，便于我们更快的解决您的问题</span>
              <button className="text-sm text-[#FF6B35] hover:underline whitespace-nowrap">
                一键上报
              </button>
            </div>
          </div>

          {/* 清理残留 */}
          <div className="flex items-start">
            <div className="flex items-center gap-1 w-24 flex-shrink-0">
              <span className="text-sm text-gray-600">清理残留</span>
              <Tooltip content="清理已删除会话的残留数据，释放存储空间">
                <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
              </Tooltip>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">当前残留大小 {residualSize}</span>
              <button className="text-sm text-[#FF6B35] hover:underline">
                立即清理
              </button>
            </div>
          </div>

          {/* 清理缓存 */}
          <div className="flex items-start">
            <div className="flex items-center gap-1 w-24 flex-shrink-0">
              <span className="text-sm text-gray-600">清理缓存</span>
              <Tooltip content="清理应用缓存数据，可能需要重新加载部分内容">
                <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
              </Tooltip>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">当前缓存大小 {cacheSize}</span>
              <button className="text-sm text-[#FF6B35] hover:underline">
                立即清理
              </button>
            </div>
          </div>

          {/* 意见反馈 */}
          <div className="flex items-start">
            <span className="text-sm text-gray-600 w-24 flex-shrink-0 pt-0.5">意见反馈</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">您的意见是我们不断进步的动力，请留下您在使用中遇到的问题或提出宝贵的建议</span>
              <button className="text-sm text-[#FF6B35] hover:underline whitespace-nowrap">
                提交反馈
              </button>
            </div>
          </div>
        </div>
      </SettingCard>
    </div>
  );
};

// 主设置页面组件
const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('platform');

  const renderContent = () => {
    switch (activeTab) {
      case 'platform':
        return <PlatformSettings />;
      case 'translation':
        return <TranslationSettings />;
      case 'proxy':
        return <ProxySettingsPanel />;
      case 'system':
        return <SystemSettings />;
      case 'general':
        return <GeneralSettings />;
      case 'about':
        return <AboutSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex gap-6">
      <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto pr-2">
        {renderContent()}
      </div>
    </div>
  );
};

export { SettingsPage, SettingsSidebar, ToggleSwitch, SettingCard, SettingRow, PlatformSettings, TranslationSettings, ProxySettingsPanel, SystemSettings, GeneralSettings, AboutSettings };
export type { SettingsTab };
