import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { draftId, email, applicantCategory } = body;

    const secretKey =
      process.env.PAYSTACK_SECRET_KEY || 'sk_test_c5b66af85943253b646795b9261022a5a2c80d5e';

    let draftRecord: any = null;

    if (draftId) {
      try {
        const supabase = getSupabaseServerClient();
        const { data } = await supabase
          .from('applications')
          .select('*')
          .eq('id', draftId)
          .single();
        if (data) draftRecord = data;
      } catch (dbErr) {
        console.warn('Supabase fetch notice in Paystack initialize:', dbErr);
      }
    }

    // Determine category and fee in sub-units
    const category = draftRecord?.applicant_category || applicantCategory || 'Local Applicant';
    const isInternational = category === 'International Applicant';

    const currency = isInternational ? 'USD' : 'GHS';
    // Amounts in Paystack subunits: 150 GHS = 15000 pesewas; 15 USD = 1500 cents
    const amountInSubunits = isInternational ? 1500 : 15000;

    const applicantEmail = draftRecord?.email || email || 'applicant@nscdp.uds.edu.gh';
    const reference = `NSCDP_PAY_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const host = req.headers.get('host') || '';
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    let baseUrl = req.headers.get('origin') || req.headers.get('referer') || '';
    if (!baseUrl && host) {
      baseUrl = `${proto}://${host}`;
    }
    if (!baseUrl || baseUrl.endsWith('/')) {
      baseUrl = baseUrl ? baseUrl.slice(0, -1) : 'http://localhost:3000';
    }
    const callbackUrl = `${baseUrl}/?payment_callback=true&draftId=${draftId || ''}`;

    const paystackPayload = {
      email: applicantEmail,
      amount: amountInSubunits,
      currency: currency,
      reference: reference,
      callback_url: callbackUrl,
      metadata: {
        draftId: draftId || null,
        applicant_category: category,
        applicant_name: `${draftRecord?.first_name || ''} ${draftRecord?.surname || ''}`.trim(),
        phone: draftRecord?.phone || '',
      },
    };

    console.log('Initializing Paystack Transaction:', paystackPayload);

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackPayload),
    });

    const data = await paystackResponse.json();
    console.log('Paystack Initialize API Response:', data);

    if (paystackResponse.ok && data.status) {
      return NextResponse.json({
        success: true,
        authorization_url: data.data.authorization_url,
        access_code: data.data.access_code,
        reference: data.data.reference,
        amount: isInternational ? 15 : 150,
        currency,
      });
    } else {
      return NextResponse.json(
        {
          error: data.message || 'Failed to initialize Paystack payment transaction.',
          raw: data,
        },
        { status: 400 }
      );
    }
  } catch (err: any) {
    console.error('Paystack initialize endpoint error:', err);
    return NextResponse.json(
      { error: err.message || 'Paystack initialization server error' },
      { status: 500 }
    );
  }
}
