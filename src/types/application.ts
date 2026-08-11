export type ProgramType = 'Basic Program' | 'Advanced Program';

export type BasicSpecialization =
  | 'Basic Intelligence'
  | 'Intelligence Analysis'
  | 'National Security Fundamentals'
  | 'Other';

export type AdvancedSpecialization =
  | 'Intelligence Operations'
  | 'National Security and Statecraft'
  | 'Security Risk Management'
  | 'Other';

export type SpecializationOption = BasicSpecialization | AdvancedSpecialization | string;

export type ApplicantCategory = 'Local Applicant' | 'Foreign Applicant';

export type ModeOfFunding = 'Self Funded' | 'Employer Sponsored';

export type FormStep = 'form' | 'review' | 'payment' | 'confirmation';

export interface PersonalInfo {
  firstName: string;
  middleName: string;
  surname: string;
  sex: 'Male' | 'Female' | 'Other' | '';
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  nationalIdOrPassport: string;
  email: string;
  phone: string;
}

export interface EducationInfo {
  highestEducationLevel: string;
  schoolAttended: string;
  country: string;
  yearOfEntry: string;
  yearOfCompletion: string;
  qualificationAwarded: string;
}

export interface EmploymentInfo {
  isSecurityOfficer: 'Yes' | 'No' | '';
  securityOrgType: string;
  currentOrganization: string;
  country: string;
  address: string;
  position: string;
  employmentDate: string;
}

export interface ApplicationFormData {
  // Section 1: Personal Information
  personalInfo: PersonalInfo;
  
  // Section 2: Educational Information
  educationInfo: EducationInfo;
  
  // Section 3: Employment Information
  employmentInfo: EmploymentInfo;
  
  // Section 4: Motivation
  motivationStatement: string;
  
  // Section 5: Program of Study
  programType: ProgramType | '';
  specialization: SpecializationOption;
  customSpecialization?: string;
  
  // Section 6: Applicant Category
  applicantCategory: ApplicantCategory;
  
  // Section 7: Mode of Funding
  modeOfFunding: ModeOfFunding;
  
  // Section 8: Declaration
  declarationAccepted: boolean;
}

export interface ApplicationRecord extends ApplicationFormData {
  applicationNumber: string;
  submittedAt: string;
  feeCurrency: 'GHS' | 'USD';
  feeAmount: number;
  paymentStatus: 'PENDING' | 'SIMULATED_PAID';
  dataHash: string;
}
