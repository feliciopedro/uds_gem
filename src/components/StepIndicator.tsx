'use client';

import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { FormStep } from '@/types/application';
import { FileText, CheckCircle2, CreditCard, Award } from 'lucide-react';

const STEPS: { id: FormStep; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'form', label: '1. Application', icon: FileText },
  { id: 'review', label: '2. Review', icon: CheckCircle2 },
  { id: 'payment', label: '3. Payment', icon: CreditCard },
  { id: 'confirmation', label: '4. Confirmation', icon: Award },
];

export const StepIndicator: React.FC = () => {
  const { currentStep } = useFormContext();

  const getStepIndex = (step: FormStep) => {
    switch (step) {
      case 'form': return 0;
      case 'review': return 1;
      case 'payment': return 2;
      case 'confirmation': return 3;
    }
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="bg-slate-50 border-b border-gray-200 py-3 px-4">
      <div className="flex items-center justify-between max-w-[750px] mx-auto">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentIndex;
          const isDone = idx < currentIndex;

          return (
            <div key={step.id} className="flex items-center gap-1.5 md:gap-2">
              <div
                className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0B1D3A] text-white shadow'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : idx + 1}
              </div>
              <span
                className={`text-xs md:text-sm font-medium ${
                  isActive
                    ? 'text-[#0B1D3A] font-semibold'
                    : isDone
                    ? 'text-emerald-700'
                    : 'text-gray-400'
                }`}
              >
                {step.label.replace(/^\d+\.\s*/, '')}
              </span>
              {idx < STEPS.length - 1 && (
                <div
                  className={`hidden sm:block h-0.5 w-6 md:w-12 ml-1 ${
                    idx < currentIndex ? 'bg-emerald-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
