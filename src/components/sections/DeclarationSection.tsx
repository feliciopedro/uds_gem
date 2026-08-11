'use client';

import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { CheckSquare, ArrowRight, ShieldCheck } from 'lucide-react';

export const DeclarationSection: React.FC = () => {
  const { formData, setFormData, submitApplicationForReview, errors, isSavingDraft } = useFormContext();
  const { declarationAccepted } = formData;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      declarationAccepted: e.target.checked,
    }));
  };

  return (
    <section className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-2">
        <div className="p-1.5 bg-slate-100 rounded text-[#0B1D3A]">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-wider text-[#0B1D3A] uppercase">
            Declaration
          </h2>
          <p className="text-xs text-gray-500">Applicant confirmation & verification statement</p>
        </div>
      </div>

      <div
        className={`p-4 border rounded-md transition-all ${
          errors.declarationAccepted
            ? 'border-red-500 bg-red-50/20'
            : 'border-slate-200 bg-slate-50'
        }`}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={declarationAccepted}
            onChange={handleCheckboxChange}
            className="w-4 h-4 mt-0.5 text-[#0B1D3A] rounded border-gray-300 focus:ring-[#0B1D3A]"
          />
          <span className="text-xs text-gray-700 leading-relaxed">
            I hereby declare that all information provided in this registration form is true, accurate, and complete to the best of my knowledge. I understand that any false statement or omission may invalidate my application for the National Security Career Development Program.
          </span>
        </label>
        {errors.declarationAccepted && (
          <p className="text-[11px] text-red-500 mt-2 font-medium">
            {errors.declarationAccepted}
          </p>
        )}
      </div>

      {/* Action Button: CONTINUE TO REVIEW */}
      <div className="pt-3">
        <button
          type="button"
          disabled={isSavingDraft}
          onClick={submitApplicationForReview}
          className="w-full bg-[#0B1D3A] hover:bg-[#102a43] text-white font-bold py-3.5 px-6 rounded-md shadow-md transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider disabled:opacity-50"
        >
          {isSavingDraft ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving Application Draft...
            </span>
          ) : (
            <>
              <span>Continue to Review</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </section>
  );
};
