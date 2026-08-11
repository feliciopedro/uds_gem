'use client';

import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { Header } from '@/components/Header';
import { StepIndicator } from '@/components/StepIndicator';
import { ApplicationForm } from '@/components/ApplicationForm';
import { ReviewStep } from '@/components/ReviewStep';
import { PaymentStep } from '@/components/PaymentStep';
import { ConfirmationStep } from '@/components/ConfirmationStep';

export default function Home() {
  const { currentStep } = useFormContext();

  return (
    <main className="min-h-screen bg-slate-100 py-4 sm:py-8 px-3 sm:px-4">
      {/* Centered Container (Max Width ~750px) */}
      <div className="max-w-[750px] mx-auto bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {/* Institutional Header */}
        <Header />

        {/* Multi-Step Indicator */}
        <StepIndicator />

        {/* Step Content Body */}
        <div className="p-4 sm:p-6 bg-slate-50/50">
          {currentStep === 'form' && <ApplicationForm />}
          {currentStep === 'review' && <ReviewStep />}
          {currentStep === 'payment' && <PaymentStep />}
          {currentStep === 'confirmation' && <ConfirmationStep />}
        </div>

        {/* Institutional Footer */}
        <footer className="bg-white border-t border-gray-200 p-4 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} University for Development Studies (UDS) & Institute for Interdisciplinary & Security Studies (IISS). All rights reserved.</p>
          <p className="mt-1 text-[11px] text-gray-400">National Security Career Development Program • Secure Online Portal</p>
        </footer>
      </div>
    </main>
  );
}
