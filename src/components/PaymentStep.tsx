'use client';

import React, { useState } from 'react';
import { useFormContext } from '@/context/FormContext';
import { CreditCard, ArrowLeft, ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export const PaymentStep: React.FC = () => {
  const { formData, setCurrentStep, completeSimulatedPayment, draftId } = useFormContext();
  const { applicantCategory, personalInfo, programType } = formData;
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const feeAmount = applicantCategory === 'Local Applicant' ? 'GHS 150' : 'USD 15';

  const loadPaystackScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.PaystackPop) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaystackPayment = async () => {
    setIsProcessing(true);
    setPaymentError('');

    try {
      // 1. Save/update application draft first
      let activeDraftId = draftId;
      try {
        const draftRes = await fetch('/api/applications/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            draftId,
          }),
        });
        const draftData = await draftRes.json();
        if (draftData?.draftId) {
          activeDraftId = draftData.draftId;
        }
      } catch (draftErr) {
        console.warn('Draft save notice before payment:', draftErr);
      }

      // 2. Initialize Paystack Transaction via Server API
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftId: activeDraftId,
          email: personalInfo.email,
          applicantCategory,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.authorization_url) {
        // Direct redirect to Paystack's official secure payment page
        window.location.href = data.authorization_url;
      } else {
        setPaymentError(data.error || 'Failed to initialize Paystack payment. Please check your network and try again.');
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Paystack initialization trigger error:', err);
      setPaymentError('Unable to connect to Paystack payment gateway. Please check your connection and try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Banner */}
      <div className="bg-[#0B1D3A] text-[#ffffff] p-5 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C59B27] font-semibold">
              Step 3 of 4
            </span>
            <h2 className="text-lg font-bold">Paystack Application Fee Payment</h2>
          </div>
          <CreditCard className="w-7 h-7 text-[#C59B27]" />
        </div>
        <p className="text-xs text-slate-300 mt-1">
          Complete your registration fee payment via Mobile Money or Card to finalize submission.
        </p>
      </div>

      {/* Fee Breakdown Card */}
      <div className="bg-[#ffffff] border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1D3A]">
          Payment Overview
        </h3>

        {paymentError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-600 font-medium">
            {paymentError}
          </div>
        )}

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
            <span className="font-bold text-gray-800 text-sm">Total Fee Payable:</span>
            <span className="text-lg font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded border border-emerald-300">
              {feeAmount}
            </span>
          </div>
        </div>

        {/* Paystack Channel Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-xs space-y-2">
          <div className="flex items-center gap-2 text-blue-900 font-bold">
            <CreditCard className="w-4 h-4 text-blue-700" />
            <span>Supported Payment Methods</span>
          </div>
          <p className="text-blue-800 leading-relaxed">
            Paystack accepts Mobile Money (MTN MoMo, Telecel Cash, AT Money) and Visa / Mastercard debit & credit cards. Upon successful payment verification, your unique application number (**NSCD-2026-XXXXX**) will be assigned and confirmation SMS dispatched via mNotify.
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
            <span>Official UDS & Paystack Gateway</span>
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
          <ArrowLeft className="w-4 h-4" /> Review Data / Résumé
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={handlePaystackPayment}
          className="w-full sm:w-2/3 bg-emerald-700 hover:bg-emerald-800 text-[#ffffff] font-bold py-3.5 px-6 rounded-md shadow-md transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Opening Paystack Checkout... / Ouverture...
            </span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Pay Now with Paystack / Payer ({feeAmount})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
