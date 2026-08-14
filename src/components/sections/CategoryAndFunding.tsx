'use client';

import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { ApplicantCategory, ModeOfFunding } from '@/types/application';
import { Globe, DollarSign, Wallet } from 'lucide-react';

export const CategoryAndFunding: React.FC = () => {
  const { formData, setFormData } = useFormContext();
  const { applicantCategory, modeOfFunding } = formData;

  const handleCategoryChange = (cat: ApplicantCategory) => {
    setFormData((prev) => ({
      ...prev,
      applicantCategory: cat,
    }));
  };

  const handleFundingChange = (funding: ModeOfFunding) => {
    setFormData((prev) => ({
      ...prev,
      modeOfFunding: funding,
    }));
  };

  return (
    <section className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm space-y-6">
      {/* APPLICANT CATEGORY */}
      <div>
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
          <div className="p-1.5 bg-slate-100 rounded text-[#0B1D3A]">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wider text-[#0B1D3A] uppercase">
              Applicant Category / <span className="text-gray-500 font-medium normal-case">Catégorie de Candidat</span>
            </h2>
            <p className="text-xs text-gray-500">Residency status for application fee assessment / <span className="italic">Statut pour l'évaluation des frais</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Local Applicant */}
          <button
            type="button"
            onClick={() => handleCategoryChange('Local Applicant')}
            className={`p-3.5 border rounded-lg text-left transition-all flex flex-col justify-between ${
              applicantCategory === 'Local Applicant'
                ? 'border-[#0B1D3A] bg-slate-50 ring-1 ring-[#0B1D3A]'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="applicantCategory"
                checked={applicantCategory === 'Local Applicant'}
                onChange={() => handleCategoryChange('Local Applicant')}
                className="w-4 h-4 text-[#0B1D3A] focus:ring-[#0B1D3A]"
              />
              <span className="text-sm font-bold text-[#0B1D3A]">Local Applicant / <span className="font-normal text-gray-600">Candidat Local</span></span>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Application Fee / Frais:</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                GHS 150
              </span>
            </div>
          </button>

          {/* International Applicant */}
          <button
            type="button"
            onClick={() => handleCategoryChange('International Applicant')}
            className={`p-3.5 border rounded-lg text-left transition-all flex flex-col justify-between ${
              applicantCategory === 'International Applicant'
                ? 'border-[#0B1D3A] bg-slate-50 ring-1 ring-[#0B1D3A]'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <input
                type="radio"
                name="applicantCategory"
                checked={applicantCategory === 'International Applicant'}
                onChange={() => handleCategoryChange('International Applicant')}
                className="w-4 h-4 text-[#0B1D3A] focus:ring-[#0B1D3A]"
              />
              <span className="text-sm font-bold text-[#0B1D3A]">International Applicant / <span className="font-normal text-gray-600">Candidat International</span></span>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">Application Fee / Frais:</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                USD 15
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* MODE OF FUNDING */}
      <div className="pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 bg-slate-100 rounded text-[#0B1D3A]">
            <Wallet className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-[#0B1D3A] uppercase tracking-wider">
            Mode of Funding / <span className="text-gray-500 font-medium normal-case">Mode de Financement</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
              modeOfFunding === 'Self Funded'
                ? 'bg-slate-50 border-[#0B1D3A] text-[#0B1D3A] font-semibold'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="modeOfFunding"
              value="Self Funded"
              checked={modeOfFunding === 'Self Funded'}
              onChange={() => handleFundingChange('Self Funded')}
              className="w-4 h-4 text-[#0B1D3A] focus:ring-[#0B1D3A]"
            />
            Self Funded / Auto-financé
          </label>

          <label
            className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
              modeOfFunding === 'Employer Sponsored'
                ? 'bg-slate-50 border-[#0B1D3A] text-[#0B1D3A] font-semibold'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="modeOfFunding"
              value="Employer Sponsored"
              checked={modeOfFunding === 'Employer Sponsored'}
              onChange={() => handleFundingChange('Employer Sponsored')}
              className="w-4 h-4 text-[#0B1D3A] focus:ring-[#0B1D3A]"
            />
            Employer Sponsored / Parrainé par l'employeur
          </label>
        </div>
      </div>
    </section>
  );
};
