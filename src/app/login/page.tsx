'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    setIsSubmitting(true);

    // Realistic corporate delay for secure authentication check
    setTimeout(() => {
      const res = login(username.trim(), password);
      if (res.success) {
        router.replace('/');
      } else {
        setError(res.error || 'Authentication failed. Please check your credentials.');
        setIsSubmitting(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/40 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center gap-3.5 mb-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 ring-4 ring-blue-500/10">
              <span className="text-white font-bold text-2xl tracking-tighter">D</span>
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight block">
                DealFlow
              </span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block -mt-1">
                Enterprise CRM
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">Sign in to your account</h1>
          <p className="text-sm text-slate-500 mt-1">Access real-time sales intelligence and deal pipelines.</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-8 sm:p-9 transition-all">
          
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-rose-800 font-medium leading-relaxed">
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-slate-600 font-medium text-xs">Remember this device</span>
              </label>
              <span className="text-xs text-slate-400">
                Single Sign-On (SSO)
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={17} className="transform group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security badge footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>End-to-end encrypted enterprise security</span>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          DealFlow Business Analytics &copy; 2026 Enterprise Edition
        </p>
      </div>
    </div>
  );
}
