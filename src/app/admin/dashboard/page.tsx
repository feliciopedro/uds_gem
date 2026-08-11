'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SupabaseApplicationRow } from '@/types/application';
import { ApplicationDetailModal } from '@/components/admin/ApplicationDetailModal';
import { AdminUserManagementModal } from '@/components/admin/AdminUserManagementModal';
import { AdminAuditTrailModal } from '@/components/admin/AdminAuditTrailModal';
import {
  Users,
  BookOpen,
  Award,
  Globe,
  DollarSign,
  Search,
  Filter,
  Download,
  Eye,
  LogOut,
  RefreshCw,
  CheckCircle2,
  Clock,
  Shield,
  UserPlus,
  ShieldAlert,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [applications, setApplications] = useState<SupabaseApplicationRow[]>([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    basicApplications: 0,
    advancedApplications: 0,
    localApplicants: 0,
    foreignApplicants: 0,
    totalFeesGHS: 0,
    totalFeesUSD: 0,
  });

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  const [selectedApplication, setSelectedApplication] = useState<SupabaseApplicationRow | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const router = useRouter();

  const logAdminAction = async (action: string, target_resource: string, details?: any) => {
    try {
      await fetch('/api/admin/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_email: 'admin@uds.edu.gh',
          action,
          target_resource,
          details: details || {},
        }),
      });
    } catch (e) {
      console.warn('Audit log trigger warning:', e);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/applications');
      const data = await response.json();

      if (response.ok && data.success) {
        setApplications(data.applications || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Error loading admin applications data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Applications logic
  const filteredApplications = applications.filter((app) => {
    const query = searchQuery.toLowerCase().trim();
    const fullName = `${app.first_name} ${app.middle_name || ''} ${app.surname}`.toLowerCase();
    const matchesSearch =
      !query ||
      fullName.includes(query) ||
      app.email.toLowerCase().includes(query) ||
      app.phone.includes(query) ||
      app.nationality.toLowerCase().includes(query) ||
      (app.application_number && app.application_number.toLowerCase().includes(query));

    const matchesProgram =
      programFilter === 'All' || app.program_level === programFilter;

    const matchesCategory =
      categoryFilter === 'All' || app.applicant_category === categoryFilter;

    const matchesPayment =
      paymentFilter === 'All' || app.payment_status === paymentFilter;

    return matchesSearch && matchesProgram && matchesCategory && matchesPayment;
  });

  // Export to CSV Feature
  const handleExportCSV = () => {
    if (filteredApplications.length === 0) return;

    const headers = [
      'Application Number',
      'First Name',
      'Middle Name',
      'Surname',
      'Email',
      'Phone',
      'Nationality',
      'Program Level',
      'Course',
      'Applicant Category',
      'Funding Source',
      'Fee Amount',
      'Fee Currency',
      'Payment Status',
      'Application Status',
      'Created At',
    ];

    const rows = filteredApplications.map((app) => [
      `"${app.application_number || 'DRAFT'}"`,
      `"${app.first_name}"`,
      `"${app.middle_name || ''}"`,
      `"${app.surname}"`,
      `"${app.email}"`,
      `"${app.phone}"`,
      `"${app.nationality}"`,
      `"${app.program_level}"`,
      `"${app.course}"`,
      `"${app.applicant_category}"`,
      `"${app.funding_source}"`,
      `"${app.application_fee_amount}"`,
      `"${app.application_fee_currency}"`,
      `"${app.payment_status}"`,
      `"${app.application_status}"`,
      `"${new Date(app.created_at || '').toLocaleString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `NSCDP_Applications_Export_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAdminAction('EXPORTED_CSV', 'Applications CSV Report', {
      exported_count: filteredApplications.length,
    });
  };

  const handleLogout = () => {
    router.push('/admin/login');
  };

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Navbar */}
        <header className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/uds-logo.png"
              alt="UDS Crest"
              style={{ maxWidth: '40px', maxHeight: '40px', width: 'auto', height: 'auto', objectFit: 'contain' }}
              className="w-10 h-10 shrink-0"
            />
            <img
              src="/iiss-logo.png"
              alt="IISS Emblem"
              style={{ maxWidth: '40px', maxHeight: '40px', width: 'auto', height: 'auto', objectFit: 'contain' }}
              className="w-10 h-10 shrink-0"
            />
            <div>
              <h1 className="text-base font-extrabold text-[#0B1D3A] uppercase tracking-wider">
                NSCDP Admin Dashboard
              </h1>
              <p className="text-xs text-gray-500">
                National Security Career Development Program • UDS & IISS Ghana
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow transition-all border border-slate-700"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Audit Trail</span>
            </button>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#0B1D3A] hover:bg-[#102a43] text-white px-3 py-1.5 rounded-md text-xs font-bold shadow transition-all"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Manage Admins</span>
            </button>
            <button
              onClick={fetchData}
              className="p-2 text-gray-600 hover:text-[#0B1D3A] hover:bg-slate-100 rounded-md transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </header>

        {/* 6 METRICS DASHBOARD STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Card 1: Total Applications */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Apps</span>
              <Users className="w-4 h-4 text-[#0B1D3A]" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-[#0B1D3A]">{stats.totalApplications}</span>
              <span className="block text-[10px] text-gray-400">All registered records</span>
            </div>
          </div>

          {/* Card 2: Basic Applications */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Basic Apps</span>
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-blue-700">{stats.basicApplications}</span>
              <span className="block text-[10px] text-gray-400">Foundational track</span>
            </div>
          </div>

          {/* Card 3: Advanced Applications */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Advanced Apps</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-amber-700">{stats.advancedApplications}</span>
              <span className="block text-[10px] text-gray-400">Strategic track</span>
            </div>
          </div>

          {/* Card 4: Local Applicants */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Local Applicants</span>
              <Globe className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-emerald-700">{stats.localApplicants}</span>
              <span className="block text-[10px] text-gray-400">GHS 150 Category</span>
            </div>
          </div>

          {/* Card 5: Foreign Applicants */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Foreign Apps</span>
              <Globe className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-indigo-700">{stats.foreignApplicants}</span>
              <span className="block text-[10px] text-gray-400">USD 15 Category</span>
            </div>
          </div>

          {/* Card 6: Total Application Fees */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Fees</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 space-y-0.5">
              <span className="block text-sm font-black text-emerald-800">
                GHS {stats.totalFeesGHS.toLocaleString()}
              </span>
              <span className="block text-xs font-bold text-indigo-700">
                USD {stats.totalFeesUSD.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH, FILTERS, EXPORT */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, Email, Phone, App No, Nationality..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </div>

            {/* Program Filter */}
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 font-medium focus:outline-none"
            >
              <option value="All">All Programs</option>
              <option value="Basic Program">Basic Program</option>
              <option value="Advanced Program">Advanced Program</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 font-medium focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Local Applicant">Local Applicant</option>
              <option value="Foreign Applicant">Foreign Applicant</option>
            </select>

            {/* Payment Status Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 font-medium focus:outline-none"
            >
              <option value="All">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="ml-auto md:ml-2 bg-[#0B1D3A] hover:bg-[#102a43] text-white text-xs font-bold px-3 py-1.5 rounded-md shadow flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#C59B27]" /> Export CSV
            </button>
          </div>
        </div>

        {/* APPLICANT TABLE */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#0B1D3A] uppercase tracking-wider">
              Applications Table ({filteredApplications.length} records)
            </h2>
            <span className="text-[11px] text-gray-400">
              Showing {filteredApplications.length} of {applications.length} total entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">App Number</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Nationality</th>
                  <th className="py-3 px-3">Program</th>
                  <th className="py-3 px-3">Course</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Amount Paid</th>
                  <th className="py-3 px-3">Payment Status</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-[#0B1D3A] border-t-transparent rounded-full animate-spin" />
                        <span>Loading applications database...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-gray-400">
                      No matching application records found.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => {
                    const fullName = `${app.first_name} ${app.middle_name || ''} ${app.surname}`;
                    const feeDisplay = `${app.application_fee_currency || 'GHS'} ${app.application_fee_amount}`;

                    return (
                      <tr key={app.id || app.application_number} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-[#0B1D3A]">
                          {app.application_number || <span className="text-gray-400 italic">DRAFT</span>}
                        </td>
                        <td className="py-3 px-3 font-semibold text-gray-900">{fullName}</td>
                        <td className="py-3 px-3 text-gray-600">{app.email}</td>
                        <td className="py-3 px-3 text-gray-600">{app.phone}</td>
                        <td className="py-3 px-3 text-gray-700">{app.nationality}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              app.program_level === 'Advanced Program'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {app.program_level}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-700 font-medium">{app.course}</td>
                        <td className="py-3 px-3 text-gray-600">{app.applicant_category}</td>
                        <td className="py-3 px-3 font-bold text-emerald-700">{feeDisplay}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.payment_status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {app.payment_status === 'paid' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Clock className="w-3 h-3 text-amber-600" />
                            )}
                            {app.payment_status?.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-500 text-[11px]">
                          {new Date(app.created_at || '').toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedApplication(app);
                              logAdminAction('VIEWED_APPLICATION', app.application_number || 'DRAFT Application', {
                                applicant_name: fullName,
                                email: app.email,
                              });
                            }}
                            className="bg-slate-100 hover:bg-[#0B1D3A] hover:text-white text-slate-700 px-2.5 py-1 rounded text-xs font-semibold transition-all inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* INDIVIDUAL APPLICATION INSPECTION MODAL */}
      <ApplicationDetailModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
      />

      {/* ADMIN USER MANAGEMENT MODAL */}
      <AdminUserManagementModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      {/* ADMIN AUDIT TRAIL MODAL */}
      <AdminAuditTrailModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
    </main>
  );
}
