'use client';

import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { ProgramType } from '@/types/application';
import { BookOpen, ShieldAlert, Award } from 'lucide-react';

const BASIC_SPECIALIZATIONS = [
  'Basic Intelligence',
  'Intelligence Analysis',
  'National Security Fundamentals',
  'Other',
];

const ADVANCED_SPECIALIZATIONS = [
  'Intelligence Operations',
  'National Security and Statecraft',
  'Security Risk Management',
  'Other',
];

export const ProgramSection: React.FC = () => {
  const { formData, updateProgram, setFormData } = useFormContext();
  const { programType, specialization, customSpecialization } = formData;

  const currentOptions =
    programType === 'Basic Program' ? BASIC_SPECIALIZATIONS : ADVANCED_SPECIALIZATIONS;

  const handleProgramTypeChange = (type: ProgramType) => {
    updateProgram(type);
  };

  const handleSpecializationChange = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specialization: spec,
    }));
  };

  return (
    <section className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
        <div className="p-1.5 bg-slate-100 rounded text-[#0B1D3A]">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-wider text-[#0B1D3A] uppercase">
            Program of Study / <span className="text-gray-500 font-medium normal-case">Programme d'Études</span>
          </h2>
          <p className="text-xs text-gray-500">Select your academic track and specialization / <span className="italic">Sélectionnez votre filière et spécialisation</span></p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Main Program Option Selector */}
        <div>
          <label className="block text-xs font-bold text-[#0B1D3A] mb-2">
            Which program are you applying for? / <span className="text-gray-600 font-medium">Pour quel programme postulez-vous ?</span> <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Basic Program Card */}
            <button
              type="button"
              onClick={() => handleProgramTypeChange('Basic Program')}
              className={`p-3.5 border rounded-lg text-left transition-all flex items-start gap-3 ${
                programType === 'Basic Program'
                  ? 'border-[#0B1D3A] bg-slate-50 ring-1 ring-[#0B1D3A]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                  programType === 'Basic Program'
                    ? 'border-[#0B1D3A] bg-[#0B1D3A]'
                    : 'border-gray-400'
                }`}
              >
                {programType === 'Basic Program' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <div>
                <span className="block text-sm font-bold text-[#0B1D3A]">Basic Program / <span className="font-normal text-gray-600">Programme de Base</span></span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  Foundational security principles & core intelligence analysis / <span className="italic">Principes de sécurité & analyse du renseignement</span>
                </span>
              </div>
            </button>

            {/* Advanced Program Card */}
            <button
              type="button"
              onClick={() => handleProgramTypeChange('Advanced Program')}
              className={`p-3.5 border rounded-lg text-left transition-all flex items-start gap-3 ${
                programType === 'Advanced Program'
                  ? 'border-[#0B1D3A] bg-slate-50 ring-1 ring-[#0B1D3A]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                  programType === 'Advanced Program'
                    ? 'border-[#0B1D3A] bg-[#0B1D3A]'
                    : 'border-gray-400'
                }`}
              >
                {programType === 'Advanced Program' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <div>
                <span className="block text-sm font-bold text-[#0B1D3A]">Advanced Program / <span className="font-normal text-gray-600">Programme Avancé</span></span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  Strategic intelligence operations & risk management / <span className="italic">Opérations stratégiques & gestion des risques</span>
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Dynamic Specializations Sub-options */}
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-md">
          <label className="block text-xs font-bold text-[#0B1D3A] mb-2">
            Select Specialization Area / <span className="text-gray-600 font-medium">Sélectionnez la spécialisation</span> <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentOptions.map((opt) => {
              const isSelected = specialization === opt;
              return (
                <label
                  key={opt}
                  className={`flex items-center gap-2.5 p-2.5 rounded border text-xs font-medium cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-white border-[#0B1D3A] text-[#0B1D3A] font-semibold shadow-sm'
                      : 'bg-white/60 border-gray-200 text-gray-700 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="specializationOption"
                    value={opt}
                    checked={isSelected}
                    onChange={() => handleSpecializationChange(opt)}
                    className="w-3.5 h-3.5 text-[#0B1D3A] focus:ring-[#0B1D3A]"
                  />
                  {opt}
                </label>
              );
            })}
          </div>

          {/* Custom specialization input if 'Other' is chosen */}
          {specialization === 'Other' && (
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Please specify your requested specialization area / <span className="text-gray-500">Précisez votre domaine de spécialisation</span>:
              </label>
              <input
                type="text"
                value={customSpecialization || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customSpecialization: e.target.value,
                  }))
                }
                placeholder="e.g. Cybersecurity & Maritime Intelligence / Cybersécurité"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A]"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
