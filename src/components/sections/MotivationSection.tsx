'use client';

import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { Lightbulb, AlertTriangle } from 'lucide-react';

export const MotivationSection: React.FC = () => {
  const { formData, updateMotivation, errors } = useFormContext();
  const { motivationStatement } = formData;

  const words = motivationStatement
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const wordCount = motivationStatement.trim() === '' ? 0 : words.length;
  const maxWords = 250;
  const isOverLimit = wordCount > maxWords;

  return (
    <section className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
        <div className="p-1.5 bg-slate-100 rounded text-[#0B1D3A]">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-wider text-[#0B1D3A] uppercase">
            Motivation Statement / <span className="text-gray-500 font-medium normal-case">Lettre de Motivation</span> <span className="text-red-500 font-normal text-xs">*</span>
          </h2>
          <p className="text-xs text-gray-500">Statement of purpose (Required - Maximum 250 words) / <span className="italic">Lettre de motivation (Obligatoire - Maximum 250 mots)</span></p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Why do you want to study security and intelligence? / <span className="text-gray-500 font-normal">Pourquoi souhaitez-vous étudier la sécurité et le renseignement ?</span> <span className="text-red-500">*</span>
        </label>
        
        <textarea
          rows={7}
          value={motivationStatement}
          onChange={(e) => updateMotivation(e.target.value)}
          placeholder="State your professional background, career aspirations, and motivation for joining the program (maximum 250 words) / Décrivez votre parcours professionnel, vos aspirations et vos motivations (maximum 250 mots)..."
          className={`w-full text-sm p-3 border rounded-md focus:outline-none focus:ring-1 resize-y ${
            errors.motivationStatement || isOverLimit
              ? 'border-amber-400 focus:ring-amber-500 bg-amber-50/10'
              : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
          }`}
        />

        {/* Live Word Counter */}
        <div className="flex items-center justify-between mt-1 text-xs">
          <span className="text-gray-500">
            Maximum <strong className="text-gray-800">{maxWords} words / mots</strong> allowed / autorisés
          </span>
          <div className="flex items-center gap-1.5 font-medium">
            {isOverLimit && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
            <span
              className={
                isOverLimit
                  ? 'text-amber-700 font-bold'
                  : 'text-emerald-700 font-bold'
              }
            >
              Word count / Mots: {wordCount} / {maxWords} max
            </span>
          </div>
        </div>

        {(errors.motivationStatement || isOverLimit) && (
          <p className="text-[11px] text-red-500 mt-1 font-medium">
            {errors.motivationStatement || `Motivation statement cannot exceed ${maxWords} words (currently ${wordCount} words).`}
          </p>
        )}
      </div>
    </section>
  );
};
