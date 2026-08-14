import React from 'react';
import { Shield, BookOpen } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 pt-6 pb-6 px-4 text-center">
      {/* Logos Area */}
      <div className="flex items-center justify-center gap-6 mb-4">
        {/* UDS Logo Badge */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
          <img
            src="/uds-logo.png"
            alt="University for Development Studies Logo"
            style={{ maxWidth: '44px', maxHeight: '44px', width: 'auto', height: 'auto', objectFit: 'contain' }}
            className="w-9 h-9 shrink-0"
          />
          <div className="text-left leading-tight">
            <span className="block text-[11px] font-bold tracking-wider text-[#0B1D3A]">
              UNIVERSITY FOR
            </span>
            <span className="block text-[10px] font-bold tracking-wider text-[#0B1D3A]">
              DEVELOPMENT STUDIES
            </span>
          </div>
        </div>

        <div className="h-8 w-px bg-gray-200"></div>

        {/* IISS Logo Badge */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
          <img
            src="/iiss-logo.png"
            alt="Institute for Intelligence and Strategic Security Logo"
            style={{ maxWidth: '44px', maxHeight: '44px', width: 'auto', height: 'auto', objectFit: 'contain' }}
            className="w-9 h-9 shrink-0"
          />
          <div className="text-left leading-tight">
            <span className="block text-[11px] font-bold tracking-wider text-[#0B1D3A]">
              INSTITUTE FOR INTELLIGENCE
            </span>
            <span className="block text-[10px] font-bold tracking-wider text-[#0B1D3A]">
              & STRATEGIC SECURITY
            </span>
          </div>
        </div>
      </div>

      {/* Program Title */}
      <h1 className="text-xl md:text-2xl font-bold text-[#0B1D3A] tracking-tight uppercase mb-2">
        National Security Career Development Program
      </h1>

      {/* Program Short Description */}
      <p className="text-xs md:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Official online registration portal for security professionals, civil servants, and future intelligence analysts. <span className="text-gray-400 italic text-[11px] md:text-xs block mt-0.5 font-normal">Portail d'inscription en ligne officiel pour les professionnels de la sécurité, fonctionnaires et futurs analystes du renseignement.</span>
      </p>
    </header>
  );
};
