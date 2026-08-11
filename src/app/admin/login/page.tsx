'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Shield, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B1D3A] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1D3A] via-[#102a43] to-[#061024] opacity-90 -z-10" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-700/30 overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-900 p-6 text-white text-center border-b border-slate-800 relative">
          {/* Institutional Logos Container */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 flex items-center justify-center">
              <img
                src="/uds-logo.png"
                alt="UDS Crest"
                style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                className="w-12 h-12 object-contain shrink-0"
              />
            </div>
            <div className="h-10 w-px bg-slate-700" />
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 flex items-center justify-center">
              <img
                src="/iiss-logo.png"
                alt="IISS Emblem"
                style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                className="w-12 h-12 object-contain shrink-0"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C59B27]/20 border border-[#C59B27]/40 mb-2">
            <Shield className="w-3 h-3 text-[#C59B27]" />
            <span className="text-[10px] uppercase tracking-widest text-[#C59B27] font-bold">
              Institutional Admin Portal
            </span>
          </div>

          <h1 className="text-xl font-extrabold tracking-tight text-white uppercase">
            NSCDP Portal Login
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            National Security Career Development Program
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5 bg-white">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Administrator Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="enter admin email"
                className="w-full text-xs pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1D3A] focus:border-transparent transition-all bg-slate-50 focus:bg-white text-slate-900 font-medium"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B1D3A] focus:border-transparent transition-all bg-slate-50 focus:bg-white text-slate-900 font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B1D3A] hover:bg-[#102a43] text-white font-bold py-3.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating Admin...
                </span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-[#C59B27]" />
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#C59B27]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            University for Development Studies & Institute for Intelligence and Strategic Security
          </p>
        </div>
      </div>
    </main>
  );
}
