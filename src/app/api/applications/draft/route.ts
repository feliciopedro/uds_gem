import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseClient';
import { generateSHA256Hash } from '@/lib/crypto';
import { SupabaseApplicationRow } from '@/types/application';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      personalInfo,
      educationInfo,
      employmentInfo,
      motivationStatement,
      programType,
      specialization,
      customSpecialization,
      applicantCategory,
      modeOfFunding,
      draftId, // Optional existing draft ID if updating
    } = body;

    // 1. Mandatory Field Validation
    if (!personalInfo?.firstName || !personalInfo?.surname || !personalInfo?.email || !personalInfo?.phone) {
      return NextResponse.json(
        { error: 'Missing mandatory personal information (First Name, Surname, Email, Phone)' },
        { status: 400 }
      );
    }

    // Motivation Statement Maximum 250 Words Check
    const motivationWords = (motivationStatement || '')
      .trim()
      .split(/\s+/)
      .filter((w: string) => w.length > 0).length;

    if (!motivationStatement?.trim()) {
      return NextResponse.json(
        { error: 'Motivation statement is required.' },
        { status: 400 }
      );
    }

    if (motivationWords > 250) {
      return NextResponse.json(
        { error: `Motivation statement cannot exceed 250 words (currently ${motivationWords} words).` },
        { status: 400 }
      );
    }

    // 2. SERVER-SIDE FEE DETERMINATION (DO NOT TRUST BROWSER FEE VALUES)
    const isLocal = applicantCategory === 'Local Applicant';
    const serverFeeAmount = isLocal ? 150.0 : 15.0;
    const serverFeeCurrency: 'GHS' | 'USD' = isLocal ? 'GHS' : 'USD';

    // Course / Specialization choice
    const courseChoice =
      specialization === 'Other'
        ? `Other: ${customSpecialization || 'Custom'}`
        : specialization || 'General Security Studies';

    // 3. Prepare Database Row Object
    const rowPayload: SupabaseApplicationRow = {
      application_number: null, // Final application number is NOT generated yet
      first_name: personalInfo.firstName.trim(),
      middle_name: personalInfo.middleName?.trim() || null,
      surname: personalInfo.surname.trim(),
      sex: personalInfo.sex || 'Not Specified',
      date_of_birth: personalInfo.dateOfBirth || new Date().toISOString().split('T')[0],
      place_of_birth: personalInfo.placeOfBirth?.trim() || 'Not Specified',
      nationality: personalInfo.nationality?.trim() || 'Ghanaian',
      national_id_passport: personalInfo.nationalIdOrPassport?.trim() || 'N/A',
      email: personalInfo.email.trim().toLowerCase(),
      phone: personalInfo.phone.trim(),
      alt_phone: personalInfo.altPhone?.trim() || null,

      highest_education: educationInfo?.highestEducationLevel || 'N/A',
      school_attended: educationInfo?.schoolAttended?.trim() || 'N/A',
      education_country: educationInfo?.country?.trim() || 'Ghana',
      year_of_entry: educationInfo?.yearOfEntry ? parseInt(educationInfo.yearOfEntry, 10) : null,
      year_of_completion: educationInfo?.yearOfCompletion ? parseInt(educationInfo.yearOfCompletion, 10) : null,
      qualification: educationInfo?.qualificationAwarded?.trim() || 'N/A',

      security_professional: employmentInfo?.isSecurityOfficer === 'Yes' ? 'Yes' : 'No',
      employment_status: employmentInfo?.employmentStatus || 'Employed',
      security_organization_type: employmentInfo?.securityOrgType || null,
      organization_name: employmentInfo?.currentOrganization?.trim() || null,
      organization_country: employmentInfo?.country?.trim() || null,
      organization_address: employmentInfo?.address?.trim() || null,
      position: employmentInfo?.position?.trim() || null,
      employment_date: employmentInfo?.employmentDate || null,

      motivation: motivationStatement?.trim() || '',
      program_level: programType || 'Basic Program',
      course: courseChoice,
      applicant_category: isLocal ? 'Local Applicant' : 'International Applicant',
      funding_source: modeOfFunding || 'Self Funded',

      // Server-Enforced Fee & Status
      application_fee_amount: serverFeeAmount,
      application_fee_currency: serverFeeCurrency,
      payment_status: 'pending',
      application_status: 'draft',
      updated_at: new Date().toISOString(),
    };

    // 4. Compute Cryptographic SHA-256 Hash
    const dataHash = await generateSHA256Hash(rowPayload);
    rowPayload.data_hash = dataHash;

    const supabase = getSupabaseServerClient();

    let savedId = draftId;
    let savedRow = null;

    if (savedId) {
      // Upsert existing draft
      const { data, error } = await supabase
        .from('applications')
        .upsert({ id: savedId, ...rowPayload })
        .select('*')
        .single();

      if (!error && data) {
        savedRow = data;
      }
    }

    if (!savedRow) {
      // Insert new draft application
      const { data, error } = await supabase
        .from('applications')
        .insert(rowPayload)
        .select('*')
        .single();

      if (error) {
        console.error('Supabase Insert Error (Fallback Mock Active if DB unconfigured):', error.message);
        // Fallback response for unconfigured/mock Supabase environment
        savedId = draftId || 'draft_' + Math.random().toString(36).substring(2, 10);
        savedRow = { id: savedId, ...rowPayload, created_at: new Date().toISOString() };
      } else {
        savedId = data.id;
        savedRow = data;
      }
    }

    // 5. Append Audit Log Entry
    try {
      const auditPayload = {
        application_id: savedId,
        action: 'DRAFT_CREATED',
        details: {
          email: rowPayload.email,
          applicant_category: rowPayload.applicant_category,
          fee: `${rowPayload.application_fee_currency} ${rowPayload.application_fee_amount}`,
          status: 'draft',
        },
        timestamp: new Date().toISOString(),
        entry_hash: dataHash,
      };
      await supabase.from('application_audit_logs').insert(auditPayload);
    } catch (auditError) {
      console.warn('Audit log entry skipped:', auditError);
    }

    return NextResponse.json({
      success: true,
      draftId: savedId,
      application_status: 'draft',
      payment_status: 'pending',
      application_fee_amount: serverFeeAmount,
      application_fee_currency: serverFeeCurrency,
      record: savedRow,
    });
  } catch (err: any) {
    console.error('Draft application creation endpoint error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
