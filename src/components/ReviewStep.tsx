'use client';

import React from 'react';
import { useFormContext } from '@/context/FormContext';
import {
  User,
  GraduationCap,
  Briefcase,
  Lightbulb,
  BookOpen,
  Globe,
  Wallet,
  Edit3,
  CreditCard,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

export const ReviewStep: React.FC = () => {
  const { formData, setCurrentStep, proceedToPayment, serverFee, draftId } = useFormContext();
  const {
    personalInfo,
    educationInfo,
    employmentInfo,
    motivationStatement,
    programType,
    specialization,
    customSpecialization,
    applicantCategory,
    modeOfFunding,
  } = formData;

  const feeDisplay = serverFee
    ? `${serverFee.currency} ${serverFee.amount}`
    : applicantCategory === 'Local Applicant'
    ? 'GHS 150'
    : 'USD 15';

  return (
    <div className="space-y-6">
      {/* Review Header Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#C59B27] font-semibold">
                Step 2 of 4
              </span>
              <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700 font-mono">
                Status: Draft Saved
              </span>
            </div>
            <h2 className="text-lg font-bold mt-0.5">Application Summary & Verification</h2>
          </div>
          <CheckCircle className="w-8 h-8 text-[#C59B27]" />
        </div>
        <p className="text-xs text-slate-300 mt-1">
          Your draft application has been registered in the database. Please review your details below before proceeding to payment.
        </p>
      </div>

      {/* 1. Personal Information Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
          <div className="flex items-center gap-2 text-[#0B1D3A]">
            <User className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Personal Information</h3>
          </div>
          <button
            onClick={() => setCurrentStep('form')}
            className="text-xs text-[#0B1D3A] hover:underline flex items-center gap-1 font-medium"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="block text-gray-500 font-medium">Full Name</span>
            <span className="font-semibold text-gray-800">
              {personalInfo.firstName} {personalInfo.middleName} {personalInfo.surname}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Sex</span>
            <span className="font-semibold text-gray-800">{personalInfo.sex || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Date of Birth</span>
            <span className="font-semibold text-gray-800">{personalInfo.dateOfBirth || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Place of Birth</span>
            <span className="font-semibold text-gray-800">{personalInfo.placeOfBirth || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Nationality</span>
            <span className="font-semibold text-gray-800">{personalInfo.nationality || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">ID / Passport No.</span>
            <span className="font-semibold text-gray-800">
              {personalInfo.nationalIdOrPassport || 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Email</span>
            <span className="font-semibold text-gray-800">{personalInfo.email || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Phone Number</span>
            <span className="font-semibold text-gray-800">{personalInfo.phone || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* 2. Educational Information Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
          <div className="flex items-center gap-2 text-[#0B1D3A]">
            <GraduationCap className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Educational Information</h3>
          </div>
          <button
            onClick={() => setCurrentStep('form')}
            className="text-xs text-[#0B1D3A] hover:underline flex items-center gap-1 font-medium"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="block text-gray-500 font-medium">Highest Education</span>
            <span className="font-semibold text-gray-800">
              {educationInfo.highestEducationLevel || 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">School Attended</span>
            <span className="font-semibold text-gray-800">
              {educationInfo.schoolAttended || 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Country</span>
            <span className="font-semibold text-gray-800">{educationInfo.country || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Qualification Awarded</span>
            <span className="font-semibold text-gray-800">
              {educationInfo.qualificationAwarded || 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Entry / Completion</span>
            <span className="font-semibold text-gray-800">
              {educationInfo.yearOfEntry || 'N/A'} - {educationInfo.yearOfCompletion || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Employment Information Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
          <div className="flex items-center gap-2 text-[#0B1D3A]">
            <Briefcase className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Employment Information</h3>
          </div>
          <button
            onClick={() => setCurrentStep('form')}
            className="text-xs text-[#0B1D3A] hover:underline flex items-center gap-1 font-medium"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="block text-gray-500 font-medium">Security Professional</span>
            <span className="font-semibold text-gray-800">
              {employmentInfo.isSecurityOfficer || 'No'}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Organization Type</span>
            <span className="font-semibold text-gray-800">
              {employmentInfo.securityOrgType || 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Current Organization</span>
            <span className="font-semibold text-gray-800">
              {employmentInfo.currentOrganization || 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Position / Rank</span>
            <span className="font-semibold text-gray-800">{employmentInfo.position || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Employment Date</span>
            <span className="font-semibold text-gray-800">
              {employmentInfo.employmentDate || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Program & Funding Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
          <div className="flex items-center gap-2 text-[#0B1D3A]">
            <BookOpen className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Program Selection & Fee Assessment
            </h3>
          </div>
          <button
            onClick={() => setCurrentStep('form')}
            className="text-xs text-[#0B1D3A] hover:underline flex items-center gap-1 font-medium"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="block text-gray-500 font-medium">Program Track</span>
            <span className="font-bold text-[#0B1D3A] text-sm">{programType}</span>
          </div>

          <div>
            <span className="block text-gray-500 font-medium">Selected Specialization</span>
            <span className="font-bold text-gray-800 text-sm">
              {specialization === 'Other'
                ? `Other: ${customSpecialization || 'Custom'}`
                : specialization}
            </span>
          </div>

          <div>
            <span className="block text-gray-500 font-medium">Applicant Category</span>
            <span className="font-semibold text-gray-800">{applicantCategory}</span>
          </div>

          <div>
            <span className="block text-gray-500 font-medium">Mode of Funding</span>
            <span className="font-semibold text-gray-800">{modeOfFunding}</span>
          </div>

          <div className="md:col-span-2 bg-slate-50 p-3 rounded border border-slate-200 flex items-center justify-between">
            <span className="font-bold text-gray-700">Total Application Fee Payable:</span>
            <span className="text-sm font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded border border-emerald-300">
              {feeDisplay}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Motivation Statement Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
          <div className="flex items-center gap-2 text-[#0B1D3A]">
            <Lightbulb className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Motivation Statement</h3>
          </div>
          <button
            onClick={() => setCurrentStep('form')}
            className="text-xs text-[#0B1D3A] hover:underline flex items-center gap-1 font-medium"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
        <p className="text-xs text-gray-700 italic bg-slate-50 p-3 rounded border border-slate-200">
          "{motivationStatement}"
        </p>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={() => setCurrentStep('form')}
          className="w-full sm:w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-md transition-all flex items-center justify-center gap-2 text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Form
        </button>

        {/* PROCEED TO PAYMENT PLACEHOLDER BUTTON */}
        <button
          type="button"
          onClick={proceedToPayment}
          className="w-full sm:w-2/3 bg-[#0B1D3A] hover:bg-[#102a43] text-white font-bold py-3.5 px-6 rounded-md shadow-lg transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
        >
          <CreditCard className="w-5 h-5 text-[#C59B27]" />
          <span>Proceed to Payment</span>
        </button>
      </div>
    </div>
  );
};
