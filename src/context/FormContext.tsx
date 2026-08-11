'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ApplicationFormData,
  FormStep,
  ApplicationRecord,
} from '@/types/application';
import { generateApplicationNumber, generateSHA256Hash } from '@/lib/crypto';

const INITIAL_FORM_DATA: ApplicationFormData = {
  personalInfo: {
    firstName: '',
    middleName: '',
    surname: '',
    sex: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: 'Ghanaian',
    nationalIdOrPassport: '',
    email: '',
    phone: '',
  },
  educationInfo: {
    highestEducationLevel: 'Bachelor\'s Degree',
    schoolAttended: '',
    country: 'Ghana',
    yearOfEntry: '',
    yearOfCompletion: '',
    qualificationAwarded: '',
  },
  employmentInfo: {
    isSecurityOfficer: 'No',
    securityOrgType: '',
    currentOrganization: '',
    country: 'Ghana',
    address: '',
    position: '',
    employmentDate: '',
  },
  motivationStatement: '',
  programType: 'Basic Program',
  specialization: 'Basic Intelligence',
  customSpecialization: '',
  applicantCategory: 'Local Applicant',
  modeOfFunding: 'Self Funded',
  declarationAccepted: false,
};

interface FormContextType {
  formData: ApplicationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ApplicationFormData>>;
  currentStep: FormStep;
  setCurrentStep: (step: FormStep) => void;
  updatePersonalInfo: (field: keyof ApplicationFormData['personalInfo'], value: string) => void;
  updateEducationInfo: (field: keyof ApplicationFormData['educationInfo'], value: string) => void;
  updateEmploymentInfo: (field: keyof ApplicationFormData['employmentInfo'], value: string) => void;
  updateMotivation: (text: string) => void;
  updateProgram: (programType: ApplicationFormData['programType'], specialization?: string) => void;
  submittedRecord: ApplicationRecord | null;
  submitApplicationForReview: () => Promise<boolean>;
  proceedToPayment: () => void;
  completeSimulatedPayment: () => Promise<void>;
  resetForm: () => void;
  errors: Record<string, string>;
  isSavingDraft: boolean;
  draftId: string | null;
  serverFee: { amount: number; currency: 'GHS' | 'USD' } | null;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'nscdp_application_draft';

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<ApplicationFormData>(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState<FormStep>('form');
  const [submittedRecord, setSubmittedRecord] = useState<ApplicationRecord | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [serverFee, setServerFee] = useState<{ amount: number; currency: 'GHS' | 'USD' } | null>(null);

  // Restore draft from local storage on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.submittedRecord) setSubmittedRecord(parsed.submittedRecord);
        if (parsed.draftId) setDraftId(parsed.draftId);
        if (parsed.serverFee) setServerFee(parsed.serverFee);
      }
    } catch (e) {
      console.error('Failed to load saved application state:', e);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ formData, currentStep, submittedRecord, draftId, serverFee })
      );
    } catch (e) {
      console.error('Failed to save application state:', e);
    }
  }, [formData, currentStep, submittedRecord, draftId, serverFee]);

  const updatePersonalInfo = (field: keyof ApplicationFormData['personalInfo'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const updateEducationInfo = (field: keyof ApplicationFormData['educationInfo'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      educationInfo: { ...prev.educationInfo, [field]: value },
    }));
  };

  const updateEmploymentInfo = (field: keyof ApplicationFormData['employmentInfo'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      employmentInfo: { ...prev.employmentInfo, [field]: value },
    }));
  };

  const updateMotivation = (text: string) => {
    setFormData((prev) => ({
      ...prev,
      motivationStatement: text,
    }));
  };

  const updateProgram = (
    programType: ApplicationFormData['programType'],
    specialization?: string
  ) => {
    setFormData((prev) => {
      let defaultSpec = specialization;
      if (!defaultSpec) {
        defaultSpec = programType === 'Basic Program' ? 'Basic Intelligence' : 'Intelligence Operations';
      }
      return {
        ...prev,
        programType,
        specialization: defaultSpec,
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { personalInfo, motivationStatement, declarationAccepted } = formData;

    if (!personalInfo.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!personalInfo.surname.trim()) newErrors.surname = 'Surname is required';
    if (!personalInfo.sex) newErrors.sex = 'Sex is required';
    if (!personalInfo.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    if (!personalInfo.placeOfBirth.trim()) newErrors.placeOfBirth = 'Place of Birth is required';
    if (!personalInfo.nationality.trim()) newErrors.nationality = 'Nationality is required';
    if (!personalInfo.nationalIdOrPassport.trim())
      newErrors.nationalIdOrPassport = 'National ID / Passport Number is required';
    if (!personalInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!personalInfo.phone.trim()) newErrors.phone = 'Phone Number is required';

    // Motivation word limit check
    const wordCount = motivationStatement
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    if (wordCount > 100) {
      newErrors.motivationStatement = 'Motivation statement must not exceed 100 words';
    }

    if (!declarationAccepted) {
      newErrors.declarationAccepted = 'You must accept the declaration to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitApplicationForReview = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsSavingDraft(true);
    try {
      const response = await fetch('/api/applications/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          draftId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setDraftId(result.draftId);
        setServerFee({
          amount: result.application_fee_amount,
          currency: result.application_fee_currency,
        });
      }
    } catch (e) {
      console.warn('Failed server draft save call, using local state:', e);
    } finally {
      setIsSavingDraft(false);
      setCurrentStep('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return true;
  };

  const proceedToPayment = () => {
    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completeSimulatedPayment = async () => {
    const appNum = generateApplicationNumber();
    const feeCurrency: 'GHS' | 'USD' =
      serverFee?.currency || (formData.applicantCategory === 'Local Applicant' ? 'GHS' : 'USD');
    const feeAmount =
      serverFee?.amount || (formData.applicantCategory === 'Local Applicant' ? 150 : 15);
    
    const recordPayload = {
      ...formData,
      id: draftId || undefined,
      applicationNumber: appNum,
      submittedAt: new Date().toISOString(),
      feeCurrency,
      feeAmount,
      paymentStatus: 'paid' as const,
      applicationStatus: 'submitted' as const,
    };

    const hash = await generateSHA256Hash(recordPayload);

    const record: ApplicationRecord = {
      ...recordPayload,
      dataHash: hash,
    };

    setSubmittedRecord(record);
    setCurrentStep('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep('form');
    setSubmittedRecord(null);
    setDraftId(null);
    setServerFee(null);
    setErrors({});
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData,
        currentStep,
        setCurrentStep,
        updatePersonalInfo,
        updateEducationInfo,
        updateEmploymentInfo,
        updateMotivation,
        updateProgram,
        submittedRecord,
        submitApplicationForReview,
        proceedToPayment,
        completeSimulatedPayment,
        resetForm,
        errors,
        isSavingDraft,
        draftId,
        serverFee,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
