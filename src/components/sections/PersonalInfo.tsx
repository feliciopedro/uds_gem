'use client';

import React from 'react';
import { useFormContext } from '@/context/FormContext';
import { User } from 'lucide-react';
import { COUNTRY_CODES, NATIONALITIES } from '@/data/countries';

export const PersonalInfo: React.FC = () => {
  const { formData, updatePersonalInfo, errors } = useFormContext();
  const { personalInfo } = formData;

  // Extract country dial code and local phone number for primary & alternative phone
  const parsePhoneNumber = (rawPhone: string) => {
    const raw = rawPhone || '';
    const matched = COUNTRY_CODES.find((item) => raw.startsWith(item.code));
    if (matched) {
      return {
        selectedCountry: matched,
        countryCode: matched.code,
        localPhone: raw.substring(matched.code.length).trim(),
      };
    }
    return {
      selectedCountry: COUNTRY_CODES[0], // Ghana default
      countryCode: '+233',
      localPhone: raw.startsWith('+') ? '' : raw,
    };
  };

  const { selectedCountry, countryCode, localPhone } = parsePhoneNumber(personalInfo.phone || '');
  const { selectedCountry: altSelectedCountry, countryCode: altCountryCode, localPhone: altLocalPhone } = parsePhoneNumber(personalInfo.altPhone || '');

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    updatePersonalInfo('phone', `${newCode} ${localPhone}`.trim());
  };

  const handleLocalPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocal = e.target.value;
    updatePersonalInfo('phone', `${countryCode} ${newLocal}`.trim());
  };

  const handleAltCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    updatePersonalInfo('altPhone', `${newCode} ${altLocalPhone}`.trim());
  };

  const handleAltLocalPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocal = e.target.value;
    updatePersonalInfo('altPhone', `${altCountryCode} ${newLocal}`.trim());
  };

  return (
    <section className="bg-white p-5 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
        <div className="p-1.5 bg-slate-100 rounded text-[#0B1D3A]">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-wider text-[#0B1D3A] uppercase">
            Personal Information / <span className="text-gray-500 font-medium normal-case">Informations Personnelles</span>
          </h2>
          <p className="text-xs text-gray-500">Provide your official identification details / <span className="italic">Fournissez vos informations d'identification officielles</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            First Name / <span className="text-gray-500 font-normal">Prénom</span> <span className="text-red-500">*</span>
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
            Middle Name / <span className="text-gray-500 font-normal">Deuxième prénom</span>
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
            Surname / <span className="text-gray-500 font-normal">Nom de famille</span> <span className="text-red-500">*</span>
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

        {/* Gender */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Gender / <span className="text-gray-500 font-normal">Genre</span> <span className="text-red-500">*</span>
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
            <option value="">Select Gender / Sélectionner le genre</option>
            <option value="Male">Male / Masculin</option>
            <option value="Female">Female / Féminin</option>
            <option value="Prefer not to say">Prefer not to say / Préfère ne pas préciser</option>
          </select>
          {errors.sex && <p className="text-[11px] text-red-500 mt-1">{errors.sex}</p>}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Date of Birth / <span className="text-gray-500 font-normal">Date de naissance</span> <span className="text-red-500">*</span>
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
            Place of Birth / <span className="text-gray-500 font-normal">Lieu de naissance</span> <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={personalInfo.placeOfBirth}
            onChange={(e) => updatePersonalInfo('placeOfBirth', e.target.value)}
            placeholder="e.g. Accra / Lomé / Abidjan"
            className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
              errors.placeOfBirth
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
            }`}
          />
          {errors.placeOfBirth && <p className="text-[11px] text-red-500 mt-1">{errors.placeOfBirth}</p>}
        </div>

        {/* Nationality Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Nationality / <span className="text-gray-500 font-normal">Nationalité</span> <span className="text-red-500">*</span>
          </label>
          <select
            value={personalInfo.nationality || 'Ghanaian'}
            onChange={(e) => updatePersonalInfo('nationality', e.target.value)}
            className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 bg-white ${
              errors.nationality
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
            }`}
          >
            <option value="">Select Nationality / Sélectionner la nationalité</option>
            {NATIONALITIES.map((nat) => (
              <option key={nat} value={nat}>
                {nat}
              </option>
            ))}
          </select>
          {errors.nationality && <p className="text-[11px] text-red-500 mt-1">{errors.nationality}</p>}
        </div>

        {/* National ID / Passport Number */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            National ID / Passport Number / <span className="text-gray-500 font-normal">N° Carte d'identité ou Passeport</span> <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={personalInfo.nationalIdOrPassport}
            onChange={(e) => updatePersonalInfo('nationalIdOrPassport', e.target.value)}
            placeholder="e.g. GHA-000000000-0 / C0123456"
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
            Email Address / <span className="text-gray-500 font-normal">Adresse e-mail</span> <span className="text-red-500">*</span>
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

        {/* Primary Phone Number */}
        <div className="md:col-span-3 lg:col-span-1.5">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Primary Phone Number / <span className="text-gray-500 font-normal">Téléphone principal</span> <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 items-center">
            {/* Country Selector with Flag Image Preview */}
            <div className="flex items-center bg-slate-50 border border-gray-300 rounded-md px-2.5 py-1.5 focus-within:ring-1 focus-within:ring-[#0B1D3A] focus-within:border-[#0B1D3A]">
              <img
                src={`https://flagcdn.com/w40/${selectedCountry.iso}.png`}
                alt={selectedCountry.name}
                className="w-5 h-3.5 object-cover rounded-xs mr-1.5 border border-gray-200"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <select
                value={countryCode}
                onChange={handleCountryCodeChange}
                className="text-sm bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer pr-1"
              >
                {COUNTRY_CODES.map((item) => (
                  <option key={`${item.iso}-${item.code}-${item.name}`} value={item.code}>
                    {item.code} ({item.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Local Phone Number Input */}
            <input
              type="tel"
              value={localPhone}
              onChange={handleLocalPhoneChange}
              placeholder="e.g. 24 000 0000"
              className={`flex-1 text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.phone
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]'
              }`}
            />
          </div>
          {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {/* Alternative Phone / WhatsApp Number */}
        <div className="md:col-span-3 lg:col-span-1.5">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Alternative Phone / WhatsApp / <span className="text-gray-500 font-normal">Téléphone secondaire (WhatsApp)</span>
          </label>
          <div className="flex gap-2 items-center">
            {/* Country Selector with Flag Image Preview */}
            <div className="flex items-center bg-slate-50 border border-gray-300 rounded-md px-2.5 py-1.5 focus-within:ring-1 focus-within:ring-[#0B1D3A] focus-within:border-[#0B1D3A]">
              <img
                src={`https://flagcdn.com/w40/${altSelectedCountry.iso}.png`}
                alt={altSelectedCountry.name}
                className="w-5 h-3.5 object-cover rounded-xs mr-1.5 border border-gray-200"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <select
                value={altCountryCode}
                onChange={handleAltCountryCodeChange}
                className="text-sm bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer pr-1"
              >
                {COUNTRY_CODES.map((item) => (
                  <option key={`alt-${item.iso}-${item.code}-${item.name}`} value={item.code}>
                    {item.code} ({item.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Local Phone Number Input */}
            <input
              type="tel"
              value={altLocalPhone}
              onChange={handleAltLocalPhoneChange}
              placeholder="e.g. 50 000 0000"
              className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:border-[#0B1D3A] focus:ring-[#0B1D3A]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
