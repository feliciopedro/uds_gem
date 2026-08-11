-- Schema for National Security Career Development Program (NSCDP) Registration System
-- Clean PostgreSQL / Supabase Schema abiding by append-only & audit log requirements

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(30) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    surname VARCHAR(100) NOT NULL,
    sex VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth VARCHAR(150) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    national_id_passport VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,

    -- Educational Information
    highest_education_level VARCHAR(100) NOT NULL,
    school_attended VARCHAR(255) NOT NULL,
    education_country VARCHAR(100) NOT NULL,
    year_of_entry INTEGER NOT NULL,
    year_of_completion INTEGER NOT NULL,
    qualification_awarded VARCHAR(150) NOT NULL,

    -- Employment Information
    is_security_officer BOOLEAN NOT NULL DEFAULT FALSE,
    security_org_type VARCHAR(100),
    current_organization VARCHAR(255),
    employment_country VARCHAR(100),
    employment_address TEXT,
    position VARCHAR(150),
    employment_date DATE,

    -- Motivation (Max 100 words)
    motivation_statement TEXT NOT NULL,

    -- Program of Study
    program_type VARCHAR(50) NOT NULL, -- 'Basic Program' | 'Advanced Program'
    specialization VARCHAR(150) NOT NULL,

    -- Applicant Category & Funding
    applicant_category VARCHAR(50) NOT NULL, -- 'Local Applicant' | 'Foreign Applicant'
    application_fee_currency VARCHAR(10) NOT NULL, -- 'GHS' | 'USD'
    application_fee_amount NUMERIC(10, 2) NOT NULL, -- 150.00 | 15.00
    mode_of_funding VARCHAR(100) NOT NULL, -- 'Self Funded' | 'Employer Sponsored'

    -- Declaration & Integrity
    declaration_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    payment_status VARCHAR(50) DEFAULT 'PENDING' NOT NULL,
    data_hash VARCHAR(64) NOT NULL -- Cryptographic SHA-256 integrity signature
);

-- Append-Only Enforcement Trigger (Prevent Update / Delete)
CREATE OR REPLACE FUNCTION enforce_append_only()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Table % is append-only. Operations UPDATE and DELETE are prohibited.', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_applications_no_update_delete ON applications;
CREATE TRIGGER trg_applications_no_update_delete
BEFORE UPDATE OR DELETE ON applications
FOR EACH ROW EXECUTE FUNCTION enforce_append_only();

-- Immutable Audit Log Table
CREATE TABLE IF NOT EXISTS application_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id),
    application_number VARCHAR(30) NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'APPLICATION_SUBMITTED', 'PAYMENT_SIMULATED', etc.
    details JSONB NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    entry_hash VARCHAR(64) NOT NULL
);

DROP TRIGGER IF EXISTS trg_audit_no_update_delete ON application_audit_logs;
CREATE TRIGGER trg_audit_no_update_delete
BEFORE UPDATE OR DELETE ON application_audit_logs
FOR EACH ROW EXECUTE FUNCTION enforce_append_only();
