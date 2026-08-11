'use client';

import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { GraduationCap } from 'lucide-react';

export const EducationInfo: React.FC = () => {
  const { formData, updateEducationInfo } = useFormContext();
  const { educationInfo } = formData;

  return (
    <section className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
        <div className="p-1.5 bg-slate-100 rounded text-[#0B1D3A]">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-wider text-[#0B1D3A] uppercase">
            Educational Information
          </h2>
          <p className="text-xs text-gray-500">Details of your academic qualifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Highest Education Level */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Highest Education Level
          </label>
          <select
            value={educationInfo.highestEducationLevel}
            onChange={(e) => updateEducationInfo('highestEducationLevel', e.target.value)}
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A] focus:ring-[#0B1D3A] bg-white"
          >
            <option value="Senior High School / WASSCE">Senior High School / WASSCE</option>
            <option value="Diploma / HND">Diploma / HND</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="Doctorate (Ph.D.)">Doctorate (Ph.D.)</option>
            <option value="Professional Certification">Professional Certification</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* School Attended */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            School / Institution Attended
          </label>
          <input
            type="text"
            value={educationInfo.schoolAttended}
            onChange={(e) => updateEducationInfo('schoolAttended', e.target.value)}
            placeholder="e.g. University for Development Studies"
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Country of Institution
          </label>
          <input
            type="text"
            value={educationInfo.country}
            onChange={(e) => updateEducationInfo('country', e.target.value)}
            placeholder="e.g. Ghana"
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]"
          />
        </div>

        {/* Qualification Awarded */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Degree / Diploma / Certificate Awarded
          </label>
          <input
            type="text"
            value={educationInfo.qualificationAwarded}
            onChange={(e) => updateEducationInfo('qualificationAwarded', e.target.value)}
            placeholder="e.g. B.A. Political Science & Security Studies"
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]"
          />
        </div>

        {/* Year of Entry */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Year of Entry
          </label>
          <input
            type="number"
            min="1960"
            max={new Date().getFullYear()}
            value={educationInfo.yearOfEntry}
            onChange={(e) => updateEducationInfo('yearOfEntry', e.target.value)}
            placeholder="e.g. 2018"
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]"
          />
        </div>

        {/* Year of Completion */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Year of Completion
          </label>
          <input
            type="number"
            min="1960"
            max={new Date().getFullYear() + 5}
            value={educationInfo.yearOfCompletion}
            onChange={(e) => updateEducationInfo('yearOfCompletion', e.target.value)}
            placeholder="e.g. 2022"
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]"
          />
        </div>
      </div>
    </section>
  );
};
