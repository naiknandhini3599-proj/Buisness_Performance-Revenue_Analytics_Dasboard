import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { USERS } from '../data/dummyData';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, demoLoginAs } = useApp();

  const [email, setEmail] = useState('aazam.afroz@company.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email format (e.g. name@company.com).');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email);
      setIsLoading(false);
      navigate('/app/dashboard');
    }, 400);
  };

  const handleQuickLogin = (userId: string) => {
    const user = USERS.find((u) => u.id === userId);
    if (user) {
      demoLoginAs(user);
      navigate('/app/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#071426] text-white flex flex-col justify-center py-8 sm:px-6 lg:px-8 antialiased">
      {/* Top Bar Return Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <span>← Return to Home</span>
        </Link>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0B1730] shadow-2xl grid grid-cols-1 lg:grid-cols-12">
          {/* Left Branded Hero Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#22D3EE]">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-base font-bold text-white">RevenueAnalytics</span>
              </div>

              <div className="mt-10">
                <span className="rounded-full bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
                  DEMO WORKSPACE
                </span>
                <h2 className="mt-3 text-2xl font-black text-white leading-tight">
                  Unified Intelligence Platform
                </h2>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Real-time visibility into customer acquisition, service quotations, deals won, and net cash receipts.
                </p>
              </div>
            </div>

            {/* Quick 1-Click Demo Profiles */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                1-Click Demo Login
              </span>
              <div className="mt-2.5 space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('u-6')}
                  className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-2.5 text-xs text-left hover:bg-blue-600/30 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      AA
                    </span>
                    <div>
                      <div className="font-bold text-white">Aazam Afroz</div>
                      <div className="text-[10px] text-slate-400">Senior Business Consultant</div>
                    </div>
                  </div>
                  <UserCheck className="h-4 w-4 text-cyan-400" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('u-1')}
                  className="w-full flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-2.5 text-xs text-left hover:bg-blue-600/30 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                      NS
                    </span>
                    <div>
                      <div className="font-bold text-white">Nancy Singh</div>
                      <div className="text-[10px] text-slate-400">Senior Sales Lead</div>
                    </div>
                  </div>
                  <UserCheck className="h-4 w-4 text-cyan-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
            <div>
              <h2 className="text-xl font-bold text-white">Sign in to your account</h2>
              <p className="mt-1 text-xs text-slate-400">
                Enter your credentials or use the instant 1-click profiles on the left.
              </p>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-500/20 border border-rose-500/30 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-white/15 bg-white/5 pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <span className="text-[10px] text-slate-400">Demo: any password</span>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-white/15 bg-white/5 pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900" />
                  <span>Remember session</span>
                </label>
                <span className="text-slate-500 cursor-not-allowed">Forgot password?</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/signup" className="font-semibold text-cyan-400 hover:underline">
                Create demo account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
