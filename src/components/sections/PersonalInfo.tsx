'use client';

import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { User } from 'lucide-react';

export const PersonalInfo: React.FC = () => {
  const { formData, updatePersonalInfo, errors } = useFormContext();
  const { personalInfo } = formData;

  return (
    <section className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
        <div className="p-1.5 bg-slate-100 rounded text-[#0B1D3A]">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-wider text-[#0B1D3A] uppercase">
            Personal Information
          </h2>
          <p className="text-xs text-gray-500">Provide your official identification details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={personalInfo.firstName}
            onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
            placeholder="e.g. Kwame"
            className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.firstName
                ? 'border-red-500 focus:ring-red-500 bg-red-50/20'
                : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
            }`}
          />
          {errors.firstName && <p className="text-[11px] text-red-500 mt-1">{errors.firstName}</p>}
        </div>

        {/* Middle Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Middle Name
          </label>
          <input
            type="text"
            value={personalInfo.middleName}
            onChange={(e) => updatePersonalInfo('middleName', e.target.value)}
            placeholder="e.g. Kofi"
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]"
          />
        </div>

        {/* Surname */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Surname <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={personalInfo.surname}
            onChange={(e) => updatePersonalInfo('surname', e.target.value)}
            placeholder="e.g. Mensah"
            className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.surname
                ? 'border-red-500 focus:ring-red-500 bg-red-50/20'
                : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
            }`}
          />
          {errors.surname && <p className="text-[11px] text-red-500 mt-1">{errors.surname}</p>}
        </div>

        {/* Sex */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Sex <span className="text-red-500">*</span>
          </label>
          <select
            value={personalInfo.sex}
            onChange={(e) => updatePersonalInfo('sex', e.target.value as any)}
            className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 bg-white ${
              errors.sex
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
            }`}
          >
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.sex && <p className="text-[11px] text-red-500 mt-1">{errors.sex}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={personalInfo.dateOfBirth}
            onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
            className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.dateOfBirth
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
            }`}
          />
          {errors.dateOfBirth && <p className="text-[11px] text-red-500 mt-1">{errors.dateOfBirth}</p>}
        </div>

        {/* Place of Birth */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Place of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={personalInfo.placeOfBirth}
            onChange={(e) => updatePersonalInfo('placeOfBirth', e.target.value)}
            placeholder="e.g. Accra"
            className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.placeOfBirth
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
            }`}
          />
          {errors.placeOfBirth && <p className="text-[11px] text-red-500 mt-1">{errors.placeOfBirth}</p>}
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Nationality <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={personalInfo.nationality}
            onChange={(e) => updatePersonalInfo('nationality', e.target.value)}
            placeholder="e.g. Ghanaian"
            className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.nationality
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
            }`}
          />
          {errors.nationality && <p className="text-[11px] text-red-500 mt-1">{errors.nationality}</p>}
        </div>

        {/* National ID / Passport Number */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            National ID / Passport Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={personalInfo.nationalIdOrPassport}
            onChange={(e) => updatePersonalInfo('nationalIdOrPassport', e.target.value)}
            placeholder="e.g. GHA-000000000-0"
            className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.nationalIdOrPassport
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
            }`}
          />
          {errors.nationalIdOrPassport && (
            <p className="text-[11px] text-red-500 mt-1">{errors.nationalIdOrPassport}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            placeholder="applicant@example.com"
            className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
            }`}
          />
          {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Phone Number */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            placeholder="e.g. +233 24 000 0000"
            className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.phone
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
            }`}
          />
          {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
        </div>
      </div>
    </section>
  );
};
