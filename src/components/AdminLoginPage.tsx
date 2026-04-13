import React, { useState } from 'react';
import { Globe, Eye, EyeOff, Loader2, Mail, Lock, Layers, Shield, Bot, BarChart3, Users, MessageSquare, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  onGoToSaas?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  username, setUsername,
  password, setPassword,
  showPassword, setShowPassword,
  rememberMe, setRememberMe,
  isLoggingIn, error,
  handleLogin, onGoToClient, onGoToSaas
}) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <div className="w-full lg:w-[480px] flex items-center justify-center min-h-screen p-8 bg-white relative">
      {/* 顶部语言切换 */}
      <div className="absolute top-6 right-8">
        <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
          <Globe className="w-4 h-4" />
          <span>简体中文</span>
        </button>
      </div>

      <div className="w-full max-w-[360px]">
        {/* Logo */}
        <button
          onClick={onGoToSaas}
          className="flex items-center gap-3 mb-10 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#FF8C55] rounded-xl flex items-center justify-center shadow-md shadow-[#FF6B35]/30">
            <span className="text-white font-bold text-lg leading-none">洽</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900 tracking-tight">洽小秘</span>
            <span className="text-xs font-medium text-[#FF6B35] bg-[#FF6B35]/8 px-2 py-0.5 rounded-full border border-[#FF6B35]/20">管理端</span>
          </div>
        </button>

        {/* 标题区 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">欢迎回来</h1>
          <p className="text-sm text-gray-500 mt-1.5">登录管理中心，掌控全局运营数据</p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-5 flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* 表单 */}
        <div className="space-y-3.5 mb-5">
          {/* 账号 */}
          <div className={cn(
            "relative flex items-center rounded-xl border transition-all duration-200",
            focusedField === 'username'
              ? "border-[#FF6B35] bg-orange-50/40 shadow-sm shadow-[#FF6B35]/10"
              : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
          )}>
            <Mail className={cn(
              "w-4 h-4 absolute left-4 transition-colors",
              focusedField === 'username' ? "text-[#FF6B35]" : "text-gray-400"
            )} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="请输入账号"
              className="w-full pl-11 pr-4 py-3.5 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>

          {/* 密码 */}
          <div className={cn(
            "relative flex items-center rounded-xl border transition-all duration-200",
            focusedField === 'password'
              ? "border-[#FF6B35] bg-orange-50/40 shadow-sm shadow-[#FF6B35]/10"
              : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
          )}>
            <Lock className={cn(
              "w-4 h-4 absolute left-4 transition-colors",
              focusedField === 'password' ? "text-[#FF6B35]" : "text-gray-400"
            )} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="请输入密码"
              className="w-full pl-11 pr-11 py-3.5 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 记住我 & 忘记密码 */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className="flex items-center gap-2 group"
          >
            <div className={cn(
              "w-4 h-4 rounded flex items-center justify-center transition-all duration-200",
              rememberMe
                ? "bg-[#FF6B35] border border-[#FF6B35]"
                : "border-2 border-gray-300 group-hover:border-[#FF6B35]/50"
            )}>
              {rememberMe && (
                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-600">记住我</span>
          </button>
          <button className="text-sm text-[#FF6B35] hover:text-[#E85A2A] transition-colors font-medium">
            忘记密码？
          </button>
        </div>

        {/* 登录按钮 */}
        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className={cn(
            "w-full py-3.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
            isLoggingIn
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#FF6B35] to-[#FF7F4F] hover:from-[#E85A2A] hover:to-[#FF6B35] shadow-lg shadow-[#FF6B35]/30 hover:shadow-[#FF6B35]/40 hover:-translate-y-0.5 active:translate-y-0"
          )}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              登录中...
            </>
          ) : (
            <>
              登录
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* 底部链接 */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-400">没有账号？<button className="text-[#FF6B35] hover:text-[#E85A2A] font-medium transition-colors ml-1">联系管理员</button></span>
          <button
            onClick={onGoToClient}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
          >
            客户端
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex items-start gap-3">
    <div className="w-7 h-7 rounded-lg bg-[#FF6B35]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-200">{title}</p>
      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
    </div>
  </div>
);

const StatCard: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <div className="text-xl font-bold text-white">{value}</div>
    <div className="text-xs text-slate-500 mt-0.5">{label}</div>
  </div>
);

const LeftPanel: React.FC = () => (
  <div className="hidden lg:flex flex-1 bg-[#0F1117] relative overflow-hidden">
    {/* 极简装饰：右上角橙色光晕 */}
    <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-[#FF6B35]/10 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF6B35]/5 rounded-full blur-[80px] pointer-events-none" />

    {/* 内容 */}
    <div className="relative z-10 flex flex-col justify-between p-14 w-full">
      {/* 顶部 Logo */}
      <div>
        <a href="http://127.0.0.1:8010/landing.html" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF6B35]/30">
            <span className="text-white font-bold text-lg leading-none">洽</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">洽小秘</h1>
            <p className="text-xs text-slate-500 mt-0.5">Chamie AI</p>
          </div>
        </a>

        <div className="mt-12 mb-10">
          <h2 className="text-[2rem] font-bold text-white leading-tight tracking-tight">
            一站式跨境<br />
            <span className="text-[#FF6B35]">智能营销</span>平台
          </h2>
          <p className="text-sm text-slate-500 mt-4 leading-relaxed">
            聚合 18+ 主流社交平台，AI 驱动销售增长<br />
            让每一次触达都精准有效
          </p>
        </div>

        {/* 数据统计 */}
        <div className="flex items-center gap-8 py-5 px-6 bg-white/[0.04] rounded-2xl border border-white/[0.07] mb-10">
          <StatCard value="18+" label="平台接入" />
          <div className="w-px h-8 bg-white/10" />
          <StatCard value="200+" label="支持语言" />
          <div className="w-px h-8 bg-white/10" />
          <StatCard value="100+" label="账号并发" />
        </div>
      </div>

      {/* 特性列表 */}
      <div className="space-y-2.5">
        <div className="p-5 bg-white/[0.04] rounded-2xl border border-white/[0.07] space-y-4">
          <div className="flex items-center gap-2 mb-0.5">
            <Layers className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">业务基座</span>
          </div>
          <FeatureItem
            icon={<MessageSquare className="w-3.5 h-3.5 text-[#FF6B35]" />}
            title="多平台聚合接待"
            description="WhatsApp、Telegram、Line 等 18+ 平台统一管理"
          />
          <FeatureItem
            icon={<Shield className="w-3.5 h-3.5 text-[#FF6B35]" />}
            title="内置指纹浏览器"
            description="一台电脑稳定运行 100+ 营销账号，安全隔离"
          />
          <FeatureItem
            icon={<Globe className="w-3.5 h-3.5 text-[#FF6B35]" />}
            title="实时双向翻译"
            description="支持 200+ 语种，多线路精准即时翻译"
          />
        </div>

        <div className="p-5 bg-white/[0.04] rounded-2xl border border-white/[0.07] space-y-4">
          <div className="flex items-center gap-2 mb-0.5">
            <Bot className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">AI 增长引擎</span>
          </div>
          <FeatureItem
            icon={<Users className="w-3.5 h-3.5 text-[#FF6B35]" />}
            title="智接待 · AI 销售"
            description="实时客户画像、智能私信、沉默客户召回"
          />
          <FeatureItem
            icon={<Zap className="w-3.5 h-3.5 text-[#FF6B35]" />}
            title="智触达 · AI 营销"
            description="精准批量触达，7×24 小时自动化营销"
          />
          <FeatureItem
            icon={<BarChart3 className="w-3.5 h-3.5 text-[#FF6B35]" />}
            title="智洞察 · 业务大脑"
            description="VOC 分析、会话质检、策略持续优化"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <CheckCircle2 className="w-3 h-3 text-slate-600" />
          <span className="text-xs text-slate-600">SOC 2 Type II 认证 · 数据加密传输 · 合规运营</span>
        </div>
      </div>
    </div>
  </div>
);

interface AdminLoginPageProps {
  onLoginSuccess?: () => void;
  onGoToClient?: () => void;
  onGoToSaas?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onGoToClient, onGoToSaas }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username) { setError('请输入账号'); return; }
    if (!password) { setError('请输入密码'); return; }

    setIsLoggingIn(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLoginSuccess?.();
    } catch {
      setError('登录失败，请检查账号密码');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <LeftPanel />
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
        onGoToSaas={onGoToSaas}
      />
    </div>
  );
};
