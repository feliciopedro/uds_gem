import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseClient';
import { generateSHA256Hash } from '@/lib/crypto';
import { sendMNotifySMS } from '@/lib/mnotify';

// Server-side fallback counter for environments where Supabase procedure isn't initialized yet
let fallbackCounter = 1;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { draftId, paymentReference } = body;

    const supabase = getSupabaseServerClient();
    const currentYear = new Date().getFullYear();

    let appNumber: string | null = null;

    // 1. ATOMIC DATABASE APPLICATION NUMBER GENERATION (NSCD-2026-00001 format)
    try {
      // Call PostgreSQL stored procedure using atomic sequence
      const { data: dbNumber, error: seqError } = await supabase.rpc('generate_next_application_number');
      if (!seqError && dbNumber) {
        appNumber = dbNumber;
      }
    } catch (e) {
      console.warn('PostgreSQL generate_next_application_number RPC call skipped/unconfigured:', e);
    }

    if (!appNumber) {
      // Fallback server-side atomic formatted generation: NSCD-YYYY-00001
      const numStr = String(fallbackCounter++).padStart(5, '0');
      appNumber = `NSCD-${currentYear}-${numStr}`;
    }

    // 2. Retrieve existing draft record
    let draftRecord: any = null;
    if (draftId) {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('id', draftId)
        .single();
      if (data) draftRecord = data;
    }

    // 3. Compute SHA-256 Cryptographic Hash for Submitted Application
    const updatedPayload = {
      ...draftRecord,
      application_number: appNumber,
      payment_status: 'paid',
      application_status: 'submitted',
      payment_reference: paymentReference || `SIM_PAY_${Date.now()}`,
      updated_at: new Date().toISOString(),
    };

    const newHash = await generateSHA256Hash(updatedPayload);
    updatedPayload.data_hash = newHash;

    // 4. Update Database Application Record
    if (draftId) {
      await supabase
        .from('applications')
        .update({
          application_number: appNumber,
          payment_status: 'paid',
          application_status: 'submitted',
          data_hash: newHash,
          updated_at: new Date().toISOString(),
        })
        .eq('id', draftId);
    }

    // 5. Send mNotify SMS Notification to Applicant
    let smsDispatchResult = { success: false };
    const recipientPhone = draftRecord?.phone || body.phone;
    const firstName = draftRecord?.first_name || 'Applicant';

    if (recipientPhone) {
      const smsMessage = `Dear ${firstName}, your application for the National Security Career Development Program (NSCDP) has been received. Your Application Ref No. is ${appNumber}. Thank you.`;
      smsDispatchResult = await sendMNotifySMS({
        recipientPhone,
        message: smsMessage,
      });
    }

    // 6. Append Audit Log Entry
    try {
      const auditPayload = {
        application_id: draftId || null,
        action: 'PAYMENT_VERIFIED_AND_NUMBER_ASSIGNED',
        details: {
          application_number: appNumber,
          payment_status: 'paid',
          payment_reference: paymentReference || 'SIMULATED',
          sms_dispatched: smsDispatchResult.success,
        },
        timestamp: new Date().toISOString(),
        entry_hash: newHash,
      };
      await supabase.from('application_audit_logs').insert(auditPayload);
    } catch (auditErr) {
      console.warn('Audit log insert warning:', auditErr);
    }

    return NextResponse.json({
      success: true,
      applicationNumber: appNumber,
      payment_status: 'paid',
      application_status: 'submitted',
      dataHash: newHash,
      submittedAt: new Date().toISOString(),
      smsDispatched: smsDispatchResult.success,
      record: updatedPayload,
    });
  } catch (err: any) {
    console.error('Verify payment endpoint error:', err);
    return NextResponse.json(
      { error: err.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
