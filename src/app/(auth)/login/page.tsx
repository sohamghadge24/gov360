"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { MapPin, User, Lock, Check, Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshAuth } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login({ email, password });

      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token);
        }

        await refreshAuth();
      }
    } catch (err: any) {
      if (err.status === 401 || err.message?.includes('401')) {
        setError('Unable to sign in. The email/employee ID or password is incorrect.');
      } else if (err.status === 423 || err.message?.includes('locked')) {
        setError('Account temporarily locked. Please contact your administrator or try again later.');
      } else {
        setError('Sign-in service unavailable. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#F7F8FA]">
        <MapPin className="w-12 h-12 text-blue-600 mb-4 animate-pulse" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">GovTrack360</h2>
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">Loading secure workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex bg-[#F7F8FA] overflow-hidden">
      {/* Left Branding Panel (approx 42%) */}
      <div className="hidden lg:flex w-[42%] bg-slate-900 relative flex-col justify-center p-12 overflow-hidden border-r border-slate-800 shadow-2xl">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 opacity-80 pointer-events-none"></div>

        <div className="relative z-10 max-w-md mx-auto w-full">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">GovTrack360</span>
          </div>

          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            Smart Attendance &<br />Field Monitoring
          </h1>

          <p className="text-slate-300 text-[15px] mb-10 leading-relaxed max-w-sm">
            Secure workforce attendance, duty verification and field operations — in one platform.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Check className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-slate-300 text-sm font-medium">Attendance & verification</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Check className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-slate-300 text-sm font-medium">Field duty monitoring</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Check className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-slate-300 text-sm font-medium">Auditable operations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Auth Panel (approx 58%) */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[440px] bg-white p-8 md:p-10 shadow-sm rounded-2xl border border-gray-200/60">

          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <MapPin className="w-6 h-6 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">GovTrack360</span>
          </div>

          <div className="mb-8">
            <h2 className="text-[24px] font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-sm text-gray-500 font-medium">Use your authorized organizational account.</p>
          </div>

          <div className="flex justify-center mb-6">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@gov.in');
                setPassword('admin123');
              }}
              className="text-[12px] font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-1.5 px-3 rounded-md transition-colors"
            >
              Use Demo Credentials
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-lg text-[13px] font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email or Employee ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or employee ID"
                  className="w-full border-gray-300 rounded-lg shadow-sm border pl-9 pr-3 py-2.5 text-[14px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors disabled:opacity-60 disabled:bg-gray-50"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border-gray-300 rounded-lg shadow-sm border pl-9 pr-10 py-2.5 text-[14px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors disabled:opacity-60 disabled:bg-gray-50"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-60"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  disabled={loading}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-60 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-[13px] text-gray-600 font-medium cursor-pointer">
                  Remember this device
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full h-[48px] bg-[#1d4ed8] text-white rounded-[12px] text-[15px] font-semibold hover:bg-[#1e40af] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-6 shadow-[0_2px_4px_rgba(29,78,216,0.15)]"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => alert("Please contact your organization's administrator to reset access.")}
                className="text-[13px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col items-center">
            <p className="text-[12px] text-gray-400 mb-3 uppercase tracking-wider font-semibold">SSO / Organization Login</p>
            <button className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-lg py-2.5 px-4 text-[14px] font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              Continue with Microsoft Entra ID
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
