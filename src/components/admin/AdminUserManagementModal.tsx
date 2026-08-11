'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Shield, Mail, Lock, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface AdminUserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminUserManagementModal: React.FC<AdminUserManagementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingAdmin, setAddingAdmin] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (response.ok && data.users) {
        setAdminUsers(data.users);
      }
    } catch (e) {
      console.error('Failed to fetch admin users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdmins();
    }
  }, [isOpen]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingAdmin(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(data.message || `Successfully added ${email} as ${role}.`);
        setFullName('');
        setEmail('');
        setPassword('');
        setRole('Admin');
        fetchAdmins();
      } else {
        setError(data.error || 'Failed to create admin user');
      }
    } catch (err: any) {
      setError('Connection error. Could not create admin user.');
    } finally {
      setAddingAdmin(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-150 my-8">
        {/* Header */}
        <div className="bg-[#0B1D3A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <UserPlus className="w-5 h-5 text-[#C59B27]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C59B27] font-bold">
                Institutional Security
              </span>
              <h2 className="text-base font-extrabold uppercase">Manage Admin Users</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Add New Admin Form Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Shield className="w-4 h-4 text-[#0B1D3A]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1D3A]">
                Add Authorized Administrator
              </h3>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-600 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Isaac Mensah"
                    className="w-full text-xs pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A]"
                  />
                  <UserCheck className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="isaac.mensah@uds.edu.gh"
                    className="w-full text-xs pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A]"
                  />
                  <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Assign secure password"
                    className="w-full text-xs pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A]"
                  />
                  <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Administrative Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 font-medium focus:outline-none"
                >
                  <option value="Admin">Admin (Full Management Access)</option>
                  <option value="Super Admin">Super Admin (System Control)</option>
                </select>
              </div>

              <div className="sm:col-span-2 pt-1">
                <button
                  type="submit"
                  disabled={addingAdmin}
                  className="w-full bg-[#0B1D3A] hover:bg-[#102a43] text-white font-bold py-2.5 px-4 rounded-md shadow transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {addingAdmin ? (
                    <span>Creating Admin Account...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 text-[#C59B27]" />
                      <span>Create Admin User Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Active Admin Users Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-3 bg-slate-50 border-b border-gray-200">
              <h4 className="text-xs font-bold text-[#0B1D3A] uppercase tracking-wider">
                Authorized Administrative Users ({adminUsers.length})
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-gray-200 text-gray-600 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Date Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500">
                        Loading admin users...
                      </td>
                    </tr>
                  ) : adminUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-400">
                        No admin accounts registered yet.
                      </td>
                    </tr>
                  ) : (
                    adminUsers.map((user) => (
                      <tr key={user.id || user.email} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{user.full_name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{user.email}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              user.role === 'Super Admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-gray-500 text-[10px]">
                          {new Date(user.created_at || '').toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold py-2 px-5 rounded-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
