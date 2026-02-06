import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown, Eye, EyeOff, Loader2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import type { BoundAccount } from '@/types';

// 激活码输入组件Props
interface ActivationCodeInputProps {
  activationCode: string;
  setActivationCode: (v: string) => void;
  showCodeDropdown: boolean;
  setShowCodeDropdown: (v: boolean) => void;
  savedCodes: SavedActivationCode[];
  selectSavedCode: (code: SavedActivationCode) => void;
  isValidating: boolean;
}

// 激活码输入组件 - 合并输入框和历史激活码下拉
const ActivationCodeInput: React.FC<ActivationCodeInputProps> = ({
  activationCode, setActivationCode,
  showCodeDropdown, setShowCodeDropdown,
  savedCodes, selectSavedCode,
  isValidating
}) => (
  <div className="mb-4 relative">
    {/* 激活码输入框 */}
    <div className="relative">
      <input
        type="text"
        value={activationCode}
        onChange={(e) => setActivationCode(e.target.value)}
        onFocus={() => savedCodes.length > 0 && setShowCodeDropdown(true)}
        placeholder="请输入激活码"
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] pr-20"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {isValidating && (
          <Loader2 className="w-5 h-5 text-[#FF6B35] animate-spin" />
        )}
        {savedCodes.length > 0 && !isValidating && (
          <button
            type="button"
            onClick={() => setShowCodeDropdown(!showCodeDropdown)}
            className="text-gray-400 hover:text-[#FF6B35] transition-colors"
          >
            <ChevronDown className={cn("w-5 h-5 transition-transform", showCodeDropdown && "rotate-180")} />
          </button>
        )}
      </div>
    </div>

    {/* 历史激活码下拉列表 */}
    {showCodeDropdown && savedCodes.length > 0 && (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
        <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
          <span className="text-xs text-gray-500">历史激活码 ({savedCodes.length})</span>
        </div>
        {savedCodes.map((code, i) => (
          <button
            key={i}
            onClick={() => selectSavedCode(code)}
            className={cn(
              "w-full px-4 py-2.5 text-left hover:bg-[#FF6B35]/5 text-sm border-b border-gray-100 last:border-b-0 transition-colors",
              activationCode === code.code && "bg-[#FF6B35]/10"
            )}
          >
            <div className="font-medium text-gray-900">{code.code}</div>
            <div className="text-xs text-gray-500">{code.organizationName}</div>
          </button>
        ))}
      </div>
    )}
  </div>
);

// 登录模式类型
type LoginMode = 'activation_only' | 'activation_with_password';

// 组织信息
interface OrganizationInfo {
  id: string;
  name: string;
  loginMode: LoginMode;
}

// 保存的激活码
interface SavedActivationCode {
  code: string;
  organizationName: string;
  lastUsed: Date;
}

// 账号密码输入组件Props
interface AccountPasswordFieldsProps {
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  boundAccounts: BoundAccount[];
}

// 账号密码输入组件
const AccountPasswordFields: React.FC<AccountPasswordFieldsProps> = ({
  username, setUsername,
  password, setPassword,
  showPassword, setShowPassword,
  boundAccounts
}) => {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const activeAccounts = boundAccounts.filter(acc => acc.status === 'active');
  const selectedAccount = activeAccounts.find(acc => acc.username === username);

  return (
    <div className="space-y-4 mb-4 animate-in slide-in-from-top-2 duration-300">
      {/* 账号下拉选择 */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowAccountDropdown(!showAccountDropdown)}
          className={cn(
            "w-full px-4 py-3 border rounded-lg text-left flex items-center justify-between transition-all",
            showAccountDropdown
              ? "border-[#FF6B35] ring-2 ring-[#FF6B35]"
              : "border-gray-200 hover:border-gray-300"
          )}
        >
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-400" />
            {selectedAccount ? (
              <div>
                <span className="text-gray-900">{selectedAccount.displayName}</span>
                <span className="text-gray-400 text-sm ml-2">({selectedAccount.username})</span>
              </div>
            ) : (
              <span className="text-gray-400">请选择账号</span>
            )}
          </div>
          <ChevronDown className={cn(
            "w-5 h-5 text-gray-400 transition-transform",
            showAccountDropdown && "rotate-180"
          )} />
        </button>

        {/* 账号下拉列表 */}
        {showAccountDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
            {activeAccounts.length > 0 ? (
              activeAccounts.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => {
                    setUsername(account.username);
                    setShowAccountDropdown(false);
                  }}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-[#FF6B35]/5 flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors",
                    username === account.username && "bg-[#FF6B35]/10"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{account.displayName}</div>
                    <div className="text-xs text-gray-500">{account.username}</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                暂无可用账号
              </div>
            )}
          </div>
        )}
      </div>

      {/* 密码输入 */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入密码"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

// 右侧面板Props
interface RightPanelProps {
  activationCode: string;
  setActivationCode: (v: string) => void;
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  loginMode: LoginMode | null;
  isValidating: boolean;
  isLoggingIn: boolean;
  showCodeDropdown: boolean;
  setShowCodeDropdown: (v: boolean) => void;
  savedCodes: SavedActivationCode[];
  agreedToTerms: boolean;
  setAgreedToTerms: (v: boolean) => void;
  keepLoggedIn: boolean;
  setKeepLoggedIn: (v: boolean) => void;
  error: string;
  handleLogin: () => void;
  selectSavedCode: (code: SavedActivationCode) => void;
  onGoToAdmin?: () => void;
  boundAccounts: BoundAccount[];
}

// 右侧登录面板
const RightPanel: React.FC<RightPanelProps> = (props) => {
  const {
    activationCode, setActivationCode,
    username, setUsername,
    password, setPassword,
    showPassword, setShowPassword,
    loginMode, isValidating, isLoggingIn,
    showCodeDropdown, setShowCodeDropdown,
    savedCodes, agreedToTerms, setAgreedToTerms,
    keepLoggedIn, setKeepLoggedIn,
    error, handleLogin, selectSavedCode,
    onGoToAdmin, boundAccounts
  } = props;

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-orange-50/80 via-amber-50/60 to-[#FF6B35]/5 relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#FF6B35]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-amber-200/20 rounded-full blur-3xl" />
      </div>

      {/* 语言切换 - 固定在右上角 */}
      <div className="absolute top-6 right-8">
        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
          <Globe className="w-4 h-4" />
          简体中文
        </button>
      </div>

      {/* 登录卡片 */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">洽</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">洽小秘</span>
        </div>

        {/* 标题 */}
        <h2 className="text-xl font-semibold text-gray-900 mb-1">激活码登录</h2>
        <p className="text-sm text-gray-500 mb-6">
          忘记激活码 请登录管理中心查看，
          <button
            onClick={onGoToAdmin}
            className="text-[#FF6B35] hover:underline"
          >
            立即前往
          </button>
        </p>

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* 激活码输入 */}
        <ActivationCodeInput
          activationCode={activationCode}
          setActivationCode={setActivationCode}
          showCodeDropdown={showCodeDropdown}
          setShowCodeDropdown={setShowCodeDropdown}
          savedCodes={savedCodes}
          selectSavedCode={selectSavedCode}
          isValidating={isValidating}
        />

        {/* 账号密码（模式二时显示） */}
        {loginMode === 'activation_with_password' && (
          <AccountPasswordFields
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            boundAccounts={boundAccounts}
          />
        )}

        {/* 协议和保持登录 */}
        <div className="space-y-3 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              className={cn(
                "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                agreedToTerms
                  ? "bg-[#FF6B35] border-[#FF6B35]"
                  : "border-gray-300 bg-white"
              )}
            >
              {agreedToTerms && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-600">
              我已阅读并同意
              <a href="#" className="text-[#FF6B35] hover:underline">《用户服务协议》</a>
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setKeepLoggedIn(!keepLoggedIn)}
              className={cn(
                "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                keepLoggedIn
                  ? "bg-[#FF6B35] border-[#FF6B35]"
                  : "border-gray-300 bg-white"
              )}
            >
              {keepLoggedIn && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-600">保持登录</span>
          </label>
        </div>

        {/* 登录按钮 */}
        <button
          onClick={handleLogin}
          disabled={isLoggingIn || isValidating}
          className={cn(
            "w-full py-3 rounded-lg text-white font-medium transition-all",
            isLoggingIn || isValidating
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#FF6B35] hover:bg-[#E85A2A] shadow-lg shadow-[#FF6B35]/25"
          )}
        >
          {isLoggingIn ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              登录中...
            </span>
          ) : '登录'}
        </button>
      </div>
    </div>
  );
};

// 左侧装饰面板
const LeftPanel: React.FC = () => (
  <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#FF6B35]/5 via-orange-50 to-amber-50 relative overflow-hidden">
    {/* 装饰背景 */}
    <div className="absolute inset-0">
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#FF6B35]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
    </div>

    {/* 内容 */}
    <div className="relative z-10 flex flex-col justify-center px-16">
      {/* 主标题 - 最高层级 */}
      <h1 className="text-4xl font-bold text-gray-900 mb-3">
        全渠道的 AI 跨境智能营销平台
      </h1>

      {/* 副标题 */}
      <h2 className="text-xl font-semibold text-[#FF6B35] mb-4">
        基于指纹浏览器的全链路 AI 获客与营销系统
      </h2>

      {/* 描述文字 */}
      <div className="text-base text-gray-700 mb-8 max-w-2xl leading-relaxed bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-[#FF6B35]/10 space-y-2">
        <p className="whitespace-nowrap">聚合 WhatsApp/Telegram 等 18+ 平台，内置原生环境隔离与实时翻译</p>
        <p className="whitespace-nowrap">集成 AI 实时画像、AI 智能回复与主动营销触达，让每一次沟通更安全、更智能、更高效</p>
      </div>

      {/* 特性列表 */}
      <div className="space-y-4">
        {[
          '聚合 WhatsApp/Telegram 等 18+ 社交平台',
          '指纹浏览器原生环境隔离，账号更安全',
          'AI 实时画像与智能回复，沟通更高效',
          '主动营销触达，精准获客转化'
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FF6B35]/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />
            </div>
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface LoginPageProps {
  onLoginSuccess?: () => void;
  onGoToAdmin?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onGoToAdmin }) => {
  // 从 store 获取组织信息
  const organization = useStore((state) => state.organization);

  // 表单状态
  const [activationCode, setActivationCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 登录模式状态
  const [loginMode, setLoginMode] = useState<LoginMode | null>(null);
  const [organizationInfo, setOrganizationInfo] = useState<OrganizationInfo | null>(null);

  // UI状态
  const [isValidating, setIsValidating] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showCodeDropdown, setShowCodeDropdown] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  // 保存的激活码列表
  const [savedCodes, setSavedCodes] = useState<SavedActivationCode[]>([]);

  // 错误信息
  const [error, setError] = useState('');

  // 加载保存的激活码
  useEffect(() => {
    const saved = localStorage.getItem('savedActivationCodes');
    if (saved) {
      setSavedCodes(JSON.parse(saved));
    }
  }, []);

  // 模拟验证激活码并获取组织模式
  const validateActivationCode = async (code: string) => {
    if (!code || code.length < 6) return;

    setIsValidating(true);
    setError('');

    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 800));

      // 验证激活码是否匹配当前组织
      if (code === organization.activationCode) {
        // 从 store 获取组织的登录模式
        const orgInfo: OrganizationInfo = {
          id: organization.id,
          name: organization.name,
          loginMode: organization.loginMode
        };

        setOrganizationInfo(orgInfo);
        setLoginMode(orgInfo.loginMode);
      } else {
        setError('激活码无效，请检查后重试');
        setLoginMode(null);
        setOrganizationInfo(null);
      }
    } catch {
      setError('激活码验证失败，请重试');
    } finally {
      setIsValidating(false);
    }
  };

  // 激活码输入变化时验证
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activationCode.length >= 10) {
        validateActivationCode(activationCode);
      } else {
        setLoginMode(null);
        setOrganizationInfo(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [activationCode]);

  // 保存激活码到本地
  const saveActivationCode = (code: string, orgName: string) => {
    const newSaved: SavedActivationCode = {
      code,
      organizationName: orgName,
      lastUsed: new Date()
    };

    const updated = [
      newSaved,
      ...savedCodes.filter(s => s.code !== code)
    ].slice(0, 10); // 最多保存10个

    setSavedCodes(updated);
    localStorage.setItem('savedActivationCodes', JSON.stringify(updated));
  };

  // 处理登录
  const handleLogin = async () => {
    if (!activationCode) {
      setError('请输入激活码');
      return;
    }

    if (!agreedToTerms) {
      setError('请先同意用户服务协议');
      return;
    }

    if (loginMode === 'activation_with_password') {
      if (!username || !password) {
        setError('请输入账号和密码');
        return;
      }
    }

    setIsLoggingIn(true);
    setError('');

    try {
      // 模拟登录API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 保存激活码
      if (organizationInfo) {
        saveActivationCode(activationCode, organizationInfo.name);
      }

      // 登录成功，跳转到主页面
      console.log('登录成功');
      onLoginSuccess?.();

    } catch {
      setError('登录失败，请重试');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 选择保存的激活码
  const selectSavedCode = (code: SavedActivationCode) => {
    setActivationCode(code.code);
    setShowCodeDropdown(false);
  };

  // 刷新组织模式
  return (
    <div className="min-h-screen flex">
      {/* 左侧装饰区域 */}
      <LeftPanel />

      {/* 右侧登录表单 */}
      <RightPanel
        activationCode={activationCode}
        setActivationCode={setActivationCode}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loginMode={loginMode}
        isValidating={isValidating}
        isLoggingIn={isLoggingIn}
        showCodeDropdown={showCodeDropdown}
        setShowCodeDropdown={setShowCodeDropdown}
        savedCodes={savedCodes}
        agreedToTerms={agreedToTerms}
        setAgreedToTerms={setAgreedToTerms}
        keepLoggedIn={keepLoggedIn}
        setKeepLoggedIn={setKeepLoggedIn}
        error={error}
        handleLogin={handleLogin}
        selectSavedCode={selectSavedCode}
        onGoToAdmin={onGoToAdmin}
        boundAccounts={organization.boundAccounts || []}
      />
    </div>
  );
};
