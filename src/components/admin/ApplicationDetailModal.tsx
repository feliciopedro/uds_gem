'use client';

import React from 'react';
import { SupabaseApplicationRow } from '@/types/application';
import { X, User, GraduationCap, Briefcase, BookOpen, ShieldCheck, Printer, CheckCircle2, Clock } from 'lucide-react';

interface ApplicationDetailModalProps {
  application: SupabaseApplicationRow | null;
  onClose: () => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  onClose,
}) => {
  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  const fullName = `${application.first_name} ${application.middle_name || ''} ${application.surname}`;
  const feeDisplay = `${application.application_fee_currency || 'GHS'} ${application.application_fee_amount}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-150 my-8">
        {/* Header */}
        <div className="bg-[#0B1D3A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/uds-logo.png" alt="UDS Crest" className="w-8 h-8 object-contain" />
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C59B27] font-bold">
                Application Detail Inspector
              </span>
              <h2 className="text-base font-bold">
                {application.application_number || 'Draft Application'}
              </h2>
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
        <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">Payment Status:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                  application.payment_status === 'paid'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {application.payment_status?.toUpperCase()} ({feeDisplay})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">Application Status:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                  application.application_status === 'submitted'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                {application.application_status?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* 1. Personal Details */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-[#0B1D3A] font-bold border-b pb-2 text-xs uppercase tracking-wider">
              <User className="w-4 h-4" /> Personal Information
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="block text-gray-500 font-medium">Full Name</span>
                <span className="font-bold text-gray-900">{fullName}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Sex</span>
                <span className="font-semibold text-gray-800">{application.sex}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Date of Birth</span>
                <span className="font-semibold text-gray-800">{application.date_of_birth}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Place of Birth</span>
                <span className="font-semibold text-gray-800">{application.place_of_birth}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Nationality</span>
                <span className="font-semibold text-gray-800">{application.nationality}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">National ID / Passport</span>
                <span className="font-semibold text-gray-800">{application.national_id_passport}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Email</span>
                <span className="font-semibold text-gray-800">{application.email}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Phone</span>
                <span className="font-semibold text-gray-800">{application.phone}</span>
              </div>
            </div>
          </div>

          {/* 2. Program & Course */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-[#0B1D3A] font-bold border-b pb-2 text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4" /> Program & Enrollment
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="block text-gray-500 font-medium">Program Track</span>
                <span className="font-bold text-[#0B1D3A]">{application.program_level}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Course / Specialization</span>
                <span className="font-bold text-gray-900">{application.course}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Applicant Category</span>
                <span className="font-semibold text-gray-800">{application.applicant_category}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Funding Source</span>
                <span className="font-semibold text-gray-800">{application.funding_source}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">mNotify SMS Status</span>
                <span className="font-semibold text-emerald-700">{application.sms_status || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Registration Date</span>
                <span className="font-semibold text-gray-800">
                  {new Date(application.created_at || '').toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Educational Background */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-[#0B1D3A] font-bold border-b pb-2 text-xs uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" /> Educational Background
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="block text-gray-500 font-medium">Highest Education</span>
                <span className="font-semibold text-gray-800">{application.highest_education}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">School Attended</span>
                <span className="font-semibold text-gray-800">{application.school_attended}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Country</span>
                <span className="font-semibold text-gray-800">{application.education_country}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Qualification Awarded</span>
                <span className="font-semibold text-gray-800">{application.qualification}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Years</span>
                <span className="font-semibold text-gray-800">
                  {application.year_of_entry || 'N/A'} - {application.year_of_completion || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Employment Background */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-[#0B1D3A] font-bold border-b pb-2 text-xs uppercase tracking-wider">
              <Briefcase className="w-4 h-4" /> Employment Details
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="block text-gray-500 font-medium">Security Professional</span>
                <span className="font-semibold text-gray-800">{application.security_professional}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Organization Type</span>
                <span className="font-semibold text-gray-800">
                  {application.security_organization_type || 'N/A'}
                </span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Current Organization</span>
                <span className="font-semibold text-gray-800">{application.organization_name || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Position / Rank</span>
                <span className="font-semibold text-gray-800">{application.position || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-gray-500 font-medium">Employment Date</span>
                <span className="font-semibold text-gray-800">{application.employment_date || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* 5. Motivation Statement */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-1">
            <span className="block text-gray-500 font-bold uppercase text-[10px]">Motivation Statement</span>
            <p className="text-xs text-gray-800 italic bg-slate-50 p-2.5 rounded border border-slate-200">
              "{application.motivation}"
            </p>
          </div>

          {/* Cryptographic SHA-256 Hash */}
          <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-400">
            <span className="block font-mono text-[9px] truncate bg-gray-50 p-1.5 rounded border border-gray-200">
              SHA256: {application.data_hash}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-gray-200 p-4 flex justify-between items-center">
          <button
            onClick={handlePrint}
            className="bg-[#0B1D3A] hover:bg-[#102a43] text-white text-xs font-bold py-2 px-4 rounded-md shadow flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" /> Print Copy
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold py-2 px-4 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
