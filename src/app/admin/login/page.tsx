'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Shield, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('admin@uds.edu.gh');
  const [password, setPassword] = useState('Admin@NSCDP2026!');
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
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0B1D3A] p-6 text-white text-center border-b border-slate-800">
          <div className="flex items-center justify-center gap-4 mb-3">
            <img src="/uds-logo.png" alt="UDS Crest" className="w-10 h-10 object-contain" />
            <img src="/iiss-logo.png" alt="IISS Emblem" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#C59B27] font-bold">
            Administrative Portal
          </span>
          <h1 className="text-lg font-extrabold uppercase mt-1">NSCDP Admin Login</h1>
          <p className="text-xs text-slate-300 mt-1">
            University for Development Studies & IISS Ghana
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-xs text-red-600 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Admin Email / Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@uds.edu.gh"
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B1D3A] hover:bg-[#102a43] text-white font-bold py-3 px-4 rounded-md shadow transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#C59B27]" />
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] text-gray-400">
              Default Credentials: <code className="bg-slate-100 px-1 py-0.5 rounded text-gray-700">admin@uds.edu.gh</code> / <code className="bg-slate-100 px-1 py-0.5 rounded text-gray-700">Admin@NSCDP2026!</code>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
