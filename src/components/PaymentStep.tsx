'use client';

import React, { useState } from 'react';
import { useFormContext } from '@/context/FormContext';
import { CreditCard, ArrowLeft, ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const PaymentStep: React.FC = () => {
  const { formData, setCurrentStep, completeSimulatedPayment } = useFormContext();
  const { applicantCategory, personalInfo, programType } = formData;
  const [isProcessing, setIsProcessing] = useState(false);

  const feeAmount = applicantCategory === 'Local Applicant' ? 'GHS 150' : 'USD 15';

  const handleSimulatedPayment = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      await completeSimulatedPayment();
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Step Banner */}
      <div className="bg-[#0B1D3A] text-white p-5 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C59B27] font-semibold">
              Step 3 of 4
            </span>
            <h2 className="text-lg font-bold">Application Fee Payment</h2>
          </div>
          <CreditCard className="w-7 h-7 text-[#C59B27]" />
        </div>
        <p className="text-xs text-slate-300 mt-1">
          Complete your registration fee payment to finalize application submission.
        </p>
      </div>

      {/* Fee Breakdown Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1D3A]">
          Payment Overview
        </h3>

        <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Applicant Name:</span>
            <span className="font-semibold text-gray-800">
              {personalInfo.firstName} {personalInfo.surname}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Selected Program:</span>
            <span className="font-semibold text-gray-800">{programType}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Category:</span>
            <span className="font-semibold text-gray-800">{applicantCategory}</span>
          </div>
          <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
            <span className="font-bold text-gray-800 text-sm">Amount Due:</span>
            <span className="text-lg font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded border border-emerald-300">
              {feeAmount}
            </span>
          </div>
        </div>

        {/* Integration Placeholder Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Payment Integration Preview Mode</span>
          </div>
          <p className="text-amber-900 leading-relaxed">
            Paystack & Mobile Money (mNotify SMS notifications) integrations are disabled in this initial UI release. Click below to simulate successful payment and generate your official registration receipt.
          </p>
        </div>

        {/* Security Assurances */}
        <div className="flex items-center justify-center gap-6 pt-2 text-gray-500 text-xs">
          <div className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0B1D3A]" />
            <span>Official UDS Security Portal</span>
          </div>
        </div>
      </div>

      {/* Payment Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => setCurrentStep('review')}
          className="w-full sm:w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-md transition-all flex items-center justify-center gap-2 text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Review Data
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={handleSimulatedPayment}
          className="w-full sm:w-2/3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-md shadow-md transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Payment...
            </span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Complete Payment & Submit ({feeAmount})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
