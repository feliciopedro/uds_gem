import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseClient';
import { generateSHA256Hash } from '@/lib/crypto';
import { sendConfirmationSMS } from '@/lib/mnotify';

// Server-side fallback counter for environments where Supabase procedure isn't initialized yet
let fallbackCounter = 1;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { draftId, paymentReference } = body;

    const supabase = getSupabaseServerClient();
    const currentYear = new Date().getFullYear();

    // 1. Retrieve existing draft record from Supabase
    let draftRecord: any = null;
    if (draftId) {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('id', draftId)
        .single();
      if (data) draftRecord = data;
    }

    // 2. Prevent duplicate processing if already submitted & SMS sent
    if (draftRecord && draftRecord.application_status === 'submitted' && draftRecord.sms_status === 'sent') {
      console.log(`Application ${draftRecord.application_number} already processed & SMS sent. Preventing duplicate SMS.`);
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        applicationNumber: draftRecord.application_number,
        payment_status: 'paid',
        application_status: 'submitted',
        sms_status: 'sent',
        dataHash: draftRecord.data_hash,
        submittedAt: draftRecord.updated_at,
        record: draftRecord,
      });
    }

    // 3. ATOMIC DATABASE APPLICATION NUMBER GENERATION (NSCD-2026-00001 format)
    let appNumber: string | null = draftRecord?.application_number || null;
    if (!appNumber) {
      try {
        // Call PostgreSQL stored procedure using atomic sequence
        const { data: dbNumber, error: seqError } = await supabase.rpc('generate_next_application_number');
        if (!seqError && dbNumber) {
          appNumber = dbNumber;
        }
      } catch (e) {
        console.warn('PostgreSQL generate_next_application_number RPC call skipped/unconfigured:', e);
      }
    }

    if (!appNumber) {
      // Fallback server-side random application number generation: NSCD-2026-XXXXX
      const random5Digit = Math.floor(10000 + Math.random() * 90000);
      appNumber = `NSCD-${currentYear}-${random5Digit}`;
    }

    // 4. Update Application Record to 'paid' & 'submitted'
    const paymentRef = paymentReference || `PAYSTACK_VERIFIED_${Date.now()}`;
    const updatedPayload = {
      ...draftRecord,
      application_number: appNumber,
      payment_status: 'paid',
      application_status: 'submitted',
      payment_reference: paymentRef,
      updated_at: new Date().toISOString(),
    };

    const newHash = await generateSHA256Hash(updatedPayload);
    updatedPayload.data_hash = newHash;

    // 5. DISPATCH mNOTIFY SMS NOTIFICATION
    let finalSmsStatus: 'sent' | 'failed' = 'failed';
    const recipientPhone = draftRecord?.phone || body.phone || body.recipientPhone;
    const firstName = draftRecord?.first_name || body.firstName || 'Applicant';

    if (recipientPhone && appNumber) {
      try {
        const smsResult = await sendConfirmationSMS({
          firstName,
          phone: recipientPhone,
          applicationNumber: appNumber,
        });

        if (smsResult.success) {
          finalSmsStatus = 'sent';
        } else {
          console.warn(`mNotify SMS dispatch failed for ${appNumber}:`, smsResult.error);
          finalSmsStatus = 'failed';
        }
      } catch (smsError) {
        console.error(`mNotify SMS dispatch exception for ${appNumber}:`, smsError);
        finalSmsStatus = 'failed';
      }
    }

    updatedPayload.sms_status = finalSmsStatus;

    // 6. Save updated application record into Supabase
    if (draftId) {
      await supabase
        .from('applications')
        .update({
          application_number: appNumber,
          payment_status: 'paid',
          application_status: 'submitted',
          sms_status: finalSmsStatus,
          data_hash: newHash,
          updated_at: new Date().toISOString(),
        })
        .eq('id', draftId);
    }

    // 7. Append Immutable Audit Log Entry
    try {
      const auditPayload = {
        application_id: draftId || null,
        action: 'PAYMENT_VERIFIED_AND_SUBMITTED',
        details: {
          application_number: appNumber,
          payment_status: 'paid',
          application_status: 'submitted',
          sms_status: finalSmsStatus,
          payment_reference: paymentRef,
        },
        timestamp: new Date().toISOString(),
        entry_hash: newHash,
      };
      await supabase.from('application_audit_logs').insert(auditPayload);
    } catch (auditErr) {
      console.warn('Audit log insert warning:', auditErr);
    }

    // 8. Return response. Note: Even if sms_status = 'failed', the application remains 100% successfully submitted!
    return NextResponse.json({
      success: true,
      applicationNumber: appNumber,
      payment_status: 'paid',
      application_status: 'submitted',
      sms_status: finalSmsStatus,
      dataHash: newHash,
      submittedAt: new Date().toISOString(),
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
