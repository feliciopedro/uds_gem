'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Search, RefreshCw, Lock, CheckCircle2, FileText, KeyRound, Download, Eye } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  admin_email: string;
  action: string;
  target_resource?: string;
  details: any;
  timestamp: string;
  entry_hash: string;
}

interface AdminAuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAuditTrailModal: React.FC<AdminAuditTrailModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/audit-logs');
      const data = await response.json();
      if (response.ok && data.logs) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error('Failed to fetch admin audit logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      log.admin_email.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      (log.target_resource && log.target_resource.toLowerCase().includes(q)) ||
      log.entry_hash.toLowerCase().includes(q)
    );
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'ADMIN_LOGIN':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-blue-600" /> ADMIN LOGIN
          </span>
        );
      case 'ADMIN_USER_CREATED':
        return (
          <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
            <Lock className="w-3 h-3 text-purple-600" /> CREATED ADMIN
          </span>
        );
      case 'EXPORTED_CSV':
        return (
          <span className="bg-[#C59B27]/20 text-[#8B6B10] border border-[#C59B27]/30 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
            <Download className="w-3 h-3 text-[#C59B27]" /> EXPORTED CSV
          </span>
        );
      case 'VIEWED_APPLICATION':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
            <Eye className="w-3 h-3 text-emerald-600" /> VIEWED DETAILS
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-150 my-8">
        {/* Header */}
        <div className="bg-[#0B1D3A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-[#C59B27]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C59B27] font-bold">
                Immutable Append-Only Log Storage
              </span>
              <h2 className="text-base font-extrabold uppercase">Admin Audit Trail</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Info Banner */}
          <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#C59B27] shrink-0" />
              <span>
                All administrative actions are cryptographically signed with SHA-256 signatures and saved to immutable storage.
              </span>
            </div>
            <button
              onClick={fetchLogs}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors"
              title="Refresh Audit Logs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Search Controls */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail by Admin Email, Action, Resource, or Hash Signature..."
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:border-[#0B1D3A]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>

          {/* Audit Logs Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-gray-200 text-gray-600 font-bold uppercase text-[10px]">
                    <th className="py-3 px-3">Timestamp</th>
                    <th className="py-3 px-3">Admin Email</th>
                    <th className="py-3 px-3">Action</th>
                    <th className="py-3 px-3">Target / Details</th>
                    <th className="py-3 px-3">Cryptographic SHA-256 Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#0B1D3A] border-t-transparent rounded-full animate-spin" />
                          <span>Loading audit logs...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        No audit log entries found.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id || log.entry_hash} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                          {log.admin_email}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">{getActionBadge(log.action)}</td>
                        <td className="py-3 px-3 text-gray-700 font-medium max-w-xs truncate">
                          {log.target_resource || JSON.stringify(log.details)}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-[9px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium block truncate max-w-[140px]">
                            {log.entry_hash}
                          </span>
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
        <div className="bg-slate-50 border-t border-gray-200 p-4 flex justify-between items-center text-xs text-gray-500">
          <span>Showing {filteredLogs.length} audit trail records</span>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold py-2 px-5 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
