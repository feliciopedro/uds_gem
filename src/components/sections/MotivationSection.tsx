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
  const maxWords = 100;
  const isOverLimit = wordCount > maxWords;

  return (
    <section className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
        <div className="p-1.5 bg-slate-100 rounded text-[#0B1D3A]">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-wider text-[#0B1D3A] uppercase">
            Motivation
          </h2>
          <p className="text-xs text-gray-500">Statement of purpose for joining the program</p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Why do you want to study security and intelligence?
        </label>
        
        <textarea
          rows={4}
          value={motivationStatement}
          onChange={(e) => updateMotivation(e.target.value)}
          placeholder="Briefly state your professional aspiration and why you wish to undertake this program..."
          className={`w-full text-sm p-3 border rounded-md focus:outline-none focus:ring-1 resize-y ${
            isOverLimit || errors.motivationStatement
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
          }`}
        />

        {/* Live Word Counter */}
        <div className="flex items-center justify-between mt-1 text-xs">
          <span className="text-gray-500">
            Maximum {maxWords} words allowed
          </span>
          <div className="flex items-center gap-1.5 font-medium">
            {isOverLimit && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
            <span
              className={
                isOverLimit
                  ? 'text-red-600 font-bold'
                  : wordCount > 85
                  ? 'text-amber-600 font-semibold'
                  : 'text-gray-700'
              }
            >
              Word count: {wordCount} / {maxWords}
            </span>
          </div>
        </div>

        {(errors.motivationStatement || isOverLimit) && (
          <p className="text-[11px] text-red-500 mt-1 font-medium">
            {errors.motivationStatement || `Please reduce your statement by ${wordCount - maxWords} word(s).`}
          </p>
        )}
      </div>
    </section>
  );
};
