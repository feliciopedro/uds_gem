-- Schema for National Security Career Development Program (NSCDP) Registration System
-- Supabase PostgreSQL Table Schema

-- Atomic Sequence for Application Number Generation
CREATE SEQUENCE IF NOT EXISTS nscd_app_number_seq START WITH 1 INCREMENT BY 1;

-- Stored Function for Server-Side Unique Application Number Generation
-- Format: NSCD-2026-00001, NSCD-2026-00002, NSCD-2026-00003
CREATE OR REPLACE FUNCTION generate_next_application_number()
RETURNS VARCHAR AS $$
DECLARE
    next_val BIGINT;
    year_str VARCHAR(4);
BEGIN
    next_val := nextval('nscd_app_number_seq');
    year_str := TO_CHAR(CURRENT_DATE, 'YYYY');
    RETURN 'NSCD-' || year_str || '-' || LPAD(next_val::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(30) UNIQUE, -- Generated ONLY upon payment verification
    
    -- Personal Details
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
    highest_education VARCHAR(100) NOT NULL,
    school_attended VARCHAR(255) NOT NULL,
    education_country VARCHAR(100) NOT NULL,
    year_of_entry INTEGER,
    year_of_completion INTEGER,
    qualification VARCHAR(150) NOT NULL,

    -- Employment Details
    security_professional VARCHAR(20) NOT NULL DEFAULT 'No', -- 'Yes' | 'No'
    security_organization_type VARCHAR(100),
    organization_name VARCHAR(255),
    organization_country VARCHAR(100),
    organization_address TEXT,
    position VARCHAR(150),
    employment_date DATE,

    -- Motivation
    motivation TEXT NOT NULL,

    -- Program & Course
    program_level VARCHAR(50) NOT NULL, -- 'Basic Program' | 'Advanced Program'
    course VARCHAR(150) NOT NULL, -- Specialization choice

    -- Category & Funding
    applicant_category VARCHAR(50) NOT NULL, -- 'Local Applicant' | 'Foreign Applicant'
    funding_source VARCHAR(100) NOT NULL, -- 'Self Funded' | 'Employer Sponsored'

    -- Server-Calculated Fee & Status
    application_fee_amount NUMERIC(10, 2) NOT NULL, -- 150.00 | 15.00
    application_fee_currency VARCHAR(10) NOT NULL, -- 'GHS' | 'USD'
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending' | 'paid'
    application_status VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft' | 'submitted'
    sms_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending' | 'sent' | 'failed'
    
    -- Cryptographic Data Signature Hash
    data_hash VARCHAR(64) NOT NULL,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Admin', -- 'Super Admin' | 'Admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Immutable Applicant Audit Logs Table
CREATE TABLE IF NOT EXISTS application_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    details JSONB NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    entry_hash VARCHAR(64) NOT NULL
);

-- Immutable Admin Audit Logs Table (Admin Trail)
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL, -- 'ADMIN_LOGIN', 'ADMIN_USER_CREATED', 'VIEWED_APPLICATION', 'EXPORTED_CSV'
    target_resource VARCHAR(255),
    details JSONB NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    entry_hash VARCHAR(64) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_app_number ON applications(application_number);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(application_status);
CREATE INDEX IF NOT EXISTS idx_applications_sms_status ON applications(sms_status);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_email ON admin_audit_logs(admin_email);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON admin_audit_logs(action);

-- Append-Only Protection Triggers for Application Audit Logs
CREATE OR REPLACE FUNCTION enforce_audit_append_only()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Table % is immutable and append-only. UPDATE and DELETE are prohibited.', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_no_update_delete ON application_audit_logs;
CREATE TRIGGER trg_audit_no_update_delete
BEFORE UPDATE OR DELETE ON application_audit_logs
FOR EACH ROW EXECUTE FUNCTION enforce_audit_append_only();

-- Append-Only Protection Trigger for Admin Audit Logs
DROP TRIGGER IF EXISTS trg_admin_audit_no_update_delete ON admin_audit_logs;
CREATE TRIGGER trg_admin_audit_no_update_delete
BEFORE UPDATE OR DELETE ON admin_audit_logs
FOR EACH ROW EXECUTE FUNCTION enforce_audit_append_only();
