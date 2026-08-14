'use client';

import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { Briefcase } from 'lucide-react';
import { WORLD_COUNTRIES } from '@/data/countries';

export const EmploymentInfo: React.FC = () => {
  const { formData, updateEmploymentInfo, errors } = useFormContext();
  const { employmentInfo } = formData;
  const isEmployed = employmentInfo.employmentStatus === 'Yes' || employmentInfo.employmentStatus === 'Employed' || !employmentInfo.employmentStatus;
  const isSecurity = employmentInfo.isSecurityOfficer === 'Yes';

  return (
    <section className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
        <div className="p-1.5 bg-slate-100 rounded text-[#0B1D3A]">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-wider text-[#0B1D3A] uppercase">
            Employment Information / <span className="text-gray-500 font-medium normal-case">Informations Professionnelles</span>
          </h2>
          <p className="text-xs text-gray-500">Your professional background and current role / <span className="italic">Votre parcours professionnel et poste actuel</span></p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Are you currently employed? (Yes / No Radio) */}
        <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-md">
          <label className="block text-xs font-bold text-[#0B1D3A] mb-2">
            Are you currently employed? / <span className="text-gray-600 font-medium">Êtes-vous actuellement employé(e) ?</span> <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2 text-sm text-gray-800 font-medium cursor-pointer">
              <input
                type="radio"
                name="isEmployed"
                value="Yes"
                checked={isEmployed}
                onChange={() => updateEmploymentInfo('employmentStatus', 'Yes')}
                className="w-4 h-4 text-[#0B1D3A] focus:ring-[#0B1D3A]"
              />
              Yes / Oui
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-800 font-medium cursor-pointer">
              <input
                type="radio"
                name="isEmployed"
                value="No"
                checked={employmentInfo.employmentStatus === 'No'}
                onChange={() => updateEmploymentInfo('employmentStatus', 'No')}
                className="w-4 h-4 text-[#0B1D3A] focus:ring-[#0B1D3A]"
              />
              No / Non
            </label>
          </div>
        </div>

        {/* Conditionally Render Work Details Only When Employed (Yes) */}
        {isEmployed && (
          <>
            {/* Are you a security officer/professional? */}
            <div className="bg-slate-50 p-3.5 border border-slate-200 rounded-md">
              <label className="block text-xs font-bold text-[#0B1D3A] mb-2">
                Are you a security officer or security professional? / <span className="text-gray-600 font-medium">Êtes-vous un agent ou un professionnel de la sécurité ?</span> <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2 text-sm text-gray-800 font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="isSecurityOfficer"
                    value="Yes"
                    checked={employmentInfo.isSecurityOfficer === 'Yes'}
                    onChange={(e) => updateEmploymentInfo('isSecurityOfficer', e.target.value)}
                    className="w-4 h-4 text-[#0B1D3A] focus:ring-[#0B1D3A]"
                  />
                  Yes / Oui
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-800 font-medium cursor-pointer">
                  <input
                    type="radio"
                    name="isSecurityOfficer"
                    value="No"
                    checked={employmentInfo.isSecurityOfficer === 'No'}
                    onChange={(e) => updateEmploymentInfo('isSecurityOfficer', e.target.value)}
                    className="w-4 h-4 text-[#0B1D3A] focus:ring-[#0B1D3A]"
                  />
                  No / Non
                </label>
              </div>
            </div>

            {/* Organization Detail Fields (Visible for all employed applicants) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Security Organization Type (Shown if security officer is Yes) */}
              {isSecurity && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Security Organization Type / <span className="text-gray-500 font-normal">Type d'organisation</span> <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={employmentInfo.securityOrgType}
                    onChange={(e) => updateEmploymentInfo('securityOrgType', e.target.value)}
                    className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 bg-white ${
                      errors.securityOrgType
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
                    }`}
                  >
                    <option value="">Select Organization Type / Sélectionner le type</option>
                    <option value="Armed Forces / Military">Armed Forces / Military / Forces armées / Militaire</option>
                    <option value="Police Service">Police Service / Service de police</option>
                    <option value="National Intelligence Agency">National Intelligence Agency / Agence de renseignement</option>
                    <option value="Immigration / Customs / Border Security">Immigration / Customs / Border Security / Immigration / Douanes</option>
                    <option value="Private Security Company">Private Security Company / Société de sécurité privée</option>
                    <option value="Corporate / Industrial Security">Corporate / Industrial Security / Sécurité d'entreprise</option>
                    <option value="Civil Service / Ministry">Civil Service / Ministry / Fonction publique / Ministère</option>
                    <option value="Non-Governmental Organization (NGO)">Non-Governmental Organization (NGO) / ONG</option>
                    <option value="Non-Security Sector">Non-Security Sector / Secteur hors sécurité</option>
                  </select>
                  {errors.securityOrgType && (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.securityOrgType}</p>
                  )}
                </div>
              )}

              {/* Name of Current Organization */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Name of Current Organization / <span className="text-gray-500 font-normal">Nom de l'organisation</span> <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={employmentInfo.currentOrganization}
                  onChange={(e) => updateEmploymentInfo('currentOrganization', e.target.value)}
                  placeholder="e.g. Ghana Armed Forces / Ministry / Company"
                  className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    errors.currentOrganization
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
                  }`}
                />
                {errors.currentOrganization && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.currentOrganization}</p>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Current Position / Rank / <span className="text-gray-500 font-normal">Poste actuel / Grade</span> <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={employmentInfo.position}
                  onChange={(e) => updateEmploymentInfo('position', e.target.value)}
                  placeholder="e.g. Intelligence Analyst / Officer / Specialist"
                  className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                    errors.position
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
                  }`}
                />
                {errors.position && (
                  <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.position}</p>
                )}
              </div>

              {/* Employment Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Employment Start Date / <span className="text-gray-500 font-normal">Date de prise de fonction</span>
                </label>
                <input
                  type="date"
                  value={employmentInfo.employmentDate}
                  onChange={(e) => updateEmploymentInfo('employmentDate', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Country of Employment / <span className="text-gray-500 font-normal">Pays d'emploi</span>
                </label>
                <select
                  value={employmentInfo.country || 'Ghana'}
                  onChange={(e) => updateEmploymentInfo('country', e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A] focus:ring-[#0B1D3A] bg-white text-gray-800"
                >
                  <option value="">Select Country / Sélectionner le pays</option>
                  {WORLD_COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Organization Address / <span className="text-gray-500 font-normal">Adresse de l'organisation</span>
                </label>
                <input
                  type="text"
                  value={employmentInfo.address}
                  onChange={(e) => updateEmploymentInfo('address', e.target.value)}
                  placeholder="P.O. Box or Office location / Boîte postale ou adresse"
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
