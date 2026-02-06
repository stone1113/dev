import React, { useState } from 'react';
import { Globe, Eye, EyeOff, Loader2, Mail, Lock, Layers, Shield, Bot, BarChart3, Users, MessageSquare, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// 登录表单组件Props
interface LoginFormProps {
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (v: boolean) => void;
  isLoggingIn: boolean;
  error: string;
  handleLogin: () => void;
  onGoToClient?: () => void;
}

// 登录表单组件
const LoginForm: React.FC<LoginFormProps> = ({
  username, setUsername,
  password, setPassword,
  showPassword, setShowPassword,
  rememberMe, setRememberMe,
  isLoggingIn, error,
  handleLogin, onGoToClient
}) => (
  <div className="w-full lg:w-1/2 flex items-start justify-center pt-[184px] p-8 bg-gradient-to-br from-orange-50/80 via-amber-50/60 to-[#FF6B35]/5 relative overflow-hidden">
    {/* 装饰背景 */}
    <div className="absolute inset-0">
      <div className="absolute top-10 right-10 w-64 h-64 bg-[#FF6B35]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-amber-200/20 rounded-full blur-3xl" />
    </div>

    {/* 语言切换 */}
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
        <div>
          <span className="text-2xl font-bold text-gray-900">洽小秘</span>
          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#FF6B35]/10 text-[#FF6B35] rounded">管理端</span>
        </div>
      </div>

      {/* 标题 */}
      <h2 className="text-xl font-semibold text-gray-900 mb-1">账号登录</h2>
      <p className="text-sm text-gray-500 mb-6">
        登录管理中心，掌控全局运营
      </p>

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* 账号输入 */}
      <div className="space-y-4 mb-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Mail className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入账号"
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-all"
          />
        </div>

        {/* 密码输入 */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Lock className="w-5 h-5" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 忘记密码 & 记住我 */}
      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => setRememberMe(!rememberMe)}
            className={cn(
              "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
              rememberMe
                ? "bg-[#FF6B35] border-[#FF6B35]"
                : "border-gray-300 bg-white"
            )}
          >
            {rememberMe && (
              <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="text-sm text-gray-600">记住我</span>
        </label>
        <button className="text-sm text-[#FF6B35] hover:underline">
          忘记密码
        </button>
      </div>

      {/* 登录按钮 */}
      <button
        onClick={handleLogin}
        disabled={isLoggingIn}
        className={cn(
          "w-full py-3 rounded-lg text-white font-medium transition-all",
          isLoggingIn
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

      {/* 底部链接 */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
        <span className="text-sm text-gray-500">没有账号？</span>
        <div className="flex items-center gap-4">
          <button className="text-sm text-[#FF6B35] hover:underline font-medium">
            去注册
          </button>
          <button
            onClick={onGoToClient}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            客户端登录
          </button>
        </div>
      </div>
    </div>
  </div>
);

// 特性项组件
const FeatureItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/15 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600 mt-0.5">{description}</p>
    </div>
  </div>
);

// 左侧面板
const LeftPanel: React.FC = () => (
  <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#FF6B35]/5 via-orange-50 to-amber-50 relative overflow-hidden">
    {/* 装饰背景 */}
    <div className="absolute inset-0">
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#FF6B35]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
    </div>

    {/* 内容 */}
    <div className="relative z-10 flex flex-col pt-16 px-16 w-full">
      {/* 产品名称和Slogan */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-[#FF6B35] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF6B35]/30">
            <span className="text-white font-bold text-2xl">洽</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">洽小秘</h1>
            <p className="text-sm text-[#FF6B35] font-medium">Chamie AI</p>
          </div>
        </div>
        <p className="text-xl font-semibold text-gray-800">
          全渠道的 AI 跨境智能营销平台
        </p>
      </div>

      {/* 两个板块并排 */}
      <div className="space-y-6">
        {/* 第一板块 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-[#FF6B35]/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-6 h-6 text-[#FF6B35]" />
            <h2 className="text-lg font-bold text-gray-900">坚实的业务基座</h2>
          </div>
          <div className="space-y-4">
            <FeatureItem
              icon={<MessageSquare className="w-5 h-5 text-[#FF6B35]" />}
              title="多平台聚合接待"
              description="聚合 WhatsApp、Telegram 等 18+ 社交平台"
            />
            <FeatureItem
              icon={<Shield className="w-5 h-5 text-[#FF6B35]" />}
              title="内置指纹浏览器"
              description="一台电脑稳定运行 100+ 营销账号"
            />
            <FeatureItem
              icon={<Globe className="w-5 h-5 text-[#FF6B35]" />}
              title="实时双向翻译"
              description="支持 200+ 语种，多线路精准翻译"
            />
          </div>
        </div>

        {/* 第二板块 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-[#FF6B35]/10 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Bot className="w-6 h-6 text-[#FF6B35]" />
            <h2 className="text-lg font-bold text-gray-900">强大的 AI 增长引擎</h2>
          </div>
          <div className="space-y-4">
            <FeatureItem
              icon={<Users className="w-5 h-5 text-[#FF6B35]" />}
              title="智接待：AI 销售"
              description="实时画像、智能私信、沉默召回"
            />
            <FeatureItem
              icon={<Zap className="w-5 h-5 text-[#FF6B35]" />}
              title="智触达：AI 主动营销"
              description="精准批量触达，7x24 自动化营销"
            />
            <FeatureItem
              icon={<BarChart3 className="w-5 h-5 text-[#FF6B35]" />}
              title="智洞察：AI 业务大脑"
              description="VOC 分析、会话质检、策略优化"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

interface AdminLoginPageProps {
  onLoginSuccess?: () => void;
  onGoToClient?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onGoToClient }) => {
  // 表单状态
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // UI状态
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  // 处理登录
  const handleLogin = async () => {
    if (!username) {
      setError('请输入账号');
      return;
    }

    if (!password) {
      setError('请输入密码');
      return;
    }

    setIsLoggingIn(true);
    setError('');

    try {
      // 模拟登录API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 登录成功
      console.log('管理端登录成功');
      onLoginSuccess?.();

    } catch {
      setError('登录失败，请检查账号密码');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* 左侧特性展示 */}
      <LeftPanel />

      {/* 右侧登录表单 */}
      <LoginForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        isLoggingIn={isLoggingIn}
        error={error}
        handleLogin={handleLogin}
        onGoToClient={onGoToClient}
      />
    </div>
  );
};
