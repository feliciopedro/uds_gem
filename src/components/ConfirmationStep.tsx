'use client';

import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { Award, Printer, RotateCcw, ShieldCheck, CheckCircle, FileText } from 'lucide-react';

export const ConfirmationStep: React.FC = () => {
  const { submittedRecord, resetForm } = useFormContext();

  if (!submittedRecord) {
    return (
      <div className="bg-white p-8 text-center border rounded-lg">
        <p className="text-sm text-gray-500">No submitted application found.</p>
        <button
          onClick={resetForm}
          className="mt-4 bg-[#0B1D3A] text-white px-4 py-2 rounded text-xs"
        >
          Start New Registration
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-emerald-800 text-white p-6 rounded-lg text-center shadow-md">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-8 h-8 text-[#C59B27]" />
        </div>
        <span className="text-xs uppercase tracking-widest text-emerald-200 font-bold">
          Registration Complete
        </span>
        <h2 className="text-xl font-bold mt-1">Application Submitted Successfully</h2>
        <p className="text-xs text-emerald-100 mt-1 max-w-md mx-auto">
          Your application for the National Security Career Development Program has been recorded and cryptographically signed.
        </p>
      </div>

      {/* Official Receipt Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-5 print:shadow-none print:border-none">
        {/* Header inside slip */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
          <div className="flex items-center gap-3">
            <img
              src="/uds-logo.png"
              alt="UDS Crest"
              style={{ maxWidth: '44px', maxHeight: '44px', width: 'auto', height: 'auto', objectFit: 'contain' }}
              className="w-10 h-10 shrink-0"
            />
            <img
              src="/iiss-logo.png"
              alt="IISS Emblem"
              style={{ maxWidth: '44px', maxHeight: '44px', width: 'auto', height: 'auto', objectFit: 'contain' }}
              className="w-10 h-10 shrink-0"
            />
            <div>
              <h3 className="text-sm font-extrabold text-[#0B1D3A] uppercase tracking-wider">
                UDS - IISS Registration Slip
              </h3>
              <p className="text-[11px] text-gray-500">National Security Career Development Program</p>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-[10px] text-gray-400 font-bold uppercase">Reference No.</span>
            <span className="font-mono text-sm font-black text-[#0B1D3A]">
              {submittedRecord.applicationNumber}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="bg-slate-50 p-3 rounded-md border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-gray-700">Payment & Submission Status:</span>
          </div>
          <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded text-xs border border-emerald-300">
            PAID & SUBMITTED ({submittedRecord.feeCurrency} {submittedRecord.feeAmount})
          </span>
        </div>

        {/* Applicant Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="block text-gray-500 font-medium">Applicant Name</span>
            <span className="font-bold text-gray-900">
              {submittedRecord.personalInfo.firstName} {submittedRecord.personalInfo.middleName} {submittedRecord.personalInfo.surname}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Email Address</span>
            <span className="font-semibold text-gray-800">{submittedRecord.personalInfo.email}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Phone Number</span>
            <span className="font-semibold text-gray-800">{submittedRecord.personalInfo.phone}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">National ID / Passport</span>
            <span className="font-semibold text-gray-800">
              {submittedRecord.personalInfo.nationalIdOrPassport}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Program Enrolled</span>
            <span className="font-bold text-[#0B1D3A]">{submittedRecord.programType}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Specialization</span>
            <span className="font-semibold text-gray-800">{submittedRecord.specialization}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Applicant Category</span>
            <span className="font-semibold text-gray-800">{submittedRecord.applicantCategory}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Mode of Funding</span>
            <span className="font-semibold text-gray-800">{submittedRecord.modeOfFunding}</span>
          </div>
        </div>

        {/* Audit Hash & Timestamp */}
        <div className="pt-3 border-t border-gray-100 text-[10px] text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Timestamp: {new Date(submittedRecord.submittedAt).toLocaleString()}</span>
            <span>Immutable Append-Only Record</span>
          </div>
          <div className="font-mono text-[9px] truncate bg-gray-50 p-1.5 rounded border border-gray-100 text-gray-500">
            SHA256: {submittedRecord.dataHash}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-1/2 bg-[#0B1D3A] hover:bg-[#102a43] text-white font-bold py-3 px-4 rounded-md shadow transition-all flex items-center justify-center gap-2 text-xs uppercase"
        >
          <Printer className="w-4 h-4" /> Print / Download Slip
        </button>

        <button
          type="button"
          onClick={resetForm}
          className="w-full sm:w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-md transition-all flex items-center justify-center gap-2 text-xs uppercase"
        >
          <RotateCcw className="w-4 h-4" /> Submit Another Registration
        </button>
      </div>
    </div>
  );
};
