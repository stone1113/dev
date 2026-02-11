import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ACCESS_PASSWORD = 'aileduo';
const ACCESS_KEY = 'accessGranted_v2';

interface AccessGateProps {
  children: React.ReactNode;
}

export const AccessGate: React.FC<AccessGateProps> = ({ children }) => {
  const [granted, setGranted] = useState(() => {
    return sessionStorage.getItem(ACCESS_KEY) === 'true';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (granted) return <>{children}</>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('请输入访问密码');
      return;
    }
    setLoading(true);
    setError('');
    // 模拟短暂延迟
    await new Promise((r) => setTimeout(r, 400));
    if (password === ACCESS_PASSWORD) {
      sessionStorage.setItem(ACCESS_KEY, 'true');
      setGranted(true);
    } else {
      setError('密码错误，请重试');
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B35]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-200/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 bg-[#FF6B35]/10 rounded-2xl flex items-center justify-center mb-4">
              <Lock className="w-7 h-7 text-[#FF6B35]" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">访问验证</h1>
            <p className="text-sm text-gray-500 mt-1">请输入密码以继续访问</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <div className="relative mb-5">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="请输入访问密码"
              autoFocus
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] pr-10 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              'w-full py-3 rounded-lg text-white font-medium text-sm transition-all',
              loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#FF6B35] hover:bg-[#E85A2A] shadow-lg shadow-[#FF6B35]/25'
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                验证中...
              </span>
            ) : '确认访问'}
          </button>
        </form>
      </div>
    </div>
  );
};
