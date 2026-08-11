'use client';

import React from 'react';
import { PersonalInfo } from './sections/PersonalInfo';
import { EducationInfo } from './sections/EducationInfo';
import { EmploymentInfo } from './sections/EmploymentInfo';
import { MotivationSection } from './sections/MotivationSection';
import { ProgramSection } from './sections/ProgramSection';
import { CategoryAndFunding } from './sections/CategoryAndFunding';
import { DeclarationSection } from './sections/DeclarationSection';

export const ApplicationForm: React.FC = () => {
  return (
    <div className="space-y-6">
      <PersonalInfo />
      <EducationInfo />
      <EmploymentInfo />
      <MotivationSection />
      <ProgramSection />
      <CategoryAndFunding />
      <DeclarationSection />
    </div>
  );
};
