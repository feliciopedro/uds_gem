export type ProgramLevel = 'Basic Program' | 'Advanced Program';
export type ProgramType = ProgramLevel;

export type ApplicantCategory = 'Local Applicant' | 'International Applicant';

export type ModeOfFunding = 'Self Funded' | 'Employer Sponsored';

export type FormStep = 'form' | 'review' | 'payment' | 'confirmation';

export interface PersonalInfo {
  firstName: string;
  middleName: string;
  surname: string;
  sex: 'Male' | 'Female' | 'Prefer not to say' | '';
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  nationalIdOrPassport: string;
  email: string;
  phone: string;
  altPhone?: string;
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
  employmentStatus?: string;
  isSecurityOfficer: 'Yes' | 'No' | '';
  securityOrgType: string;
  currentOrganization: string;
  country: string;
  address: string;
  position: string;
  employmentDate: string;
}

export interface ApplicationFormData {
  personalInfo: PersonalInfo;
  educationInfo: EducationInfo;
  employmentInfo: EmploymentInfo;
  motivationStatement: string;
  programType: ProgramLevel | '';
  specialization: string;
  customSpecialization?: string;
  applicantCategory: ApplicantCategory;
  modeOfFunding: ModeOfFunding;
  declarationAccepted: boolean;
}

// Supabase Database Row Structure
export interface SupabaseApplicationRow {
  id?: string;
  application_number?: string | null;
  first_name: string;
  middle_name?: string | null;
  surname: string;
  sex: string;
  date_of_birth: string;
  place_of_birth: string;
  nationality: string;
  national_id_passport: string;
  email: string;
  phone: string;
  alt_phone?: string | null;

  highest_education: string;
  school_attended: string;
  education_country: string;
  year_of_entry?: number | null;
  year_of_completion?: number | null;
  qualification: string;

  security_professional: string; // 'Yes' | 'No'
  employment_status?: string | null;
  security_organization_type?: string | null;
  organization_name?: string | null;
  organization_country?: string | null;
  organization_address?: string | null;
  position?: string | null;
  employment_date?: string | null;

  motivation: string;
  program_level: string; // 'Basic Program' | 'Advanced Program'
  course: string; // Specialization
  applicant_category: string; // 'Local Applicant' | 'Foreign Applicant'
  funding_source: string; // 'Self Funded' | 'Employer Sponsored'

  application_fee_amount: number;
  application_fee_currency: 'GHS' | 'USD';
  payment_status: 'pending' | 'paid';
  application_status: 'draft' | 'submitted';
  sms_status?: 'pending' | 'sent' | 'failed';
  data_hash?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationRecord extends ApplicationFormData {
  id?: string;
  applicationNumber?: string;
  submittedAt: string;
  feeCurrency: 'GHS' | 'USD';
  feeAmount: number;
  paymentStatus: 'pending' | 'paid';
  applicationStatus: 'draft' | 'submitted';
  smsStatus?: 'pending' | 'sent' | 'failed';
  dataHash: string;
}
