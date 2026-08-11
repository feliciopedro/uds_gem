/**
 * Helper utility for sending SMS notifications via mNotify v2 API
 * API Key & Sender ID are stored strictly in server environment variables
 */
export function formatPhoneNumber(recipientPhone: string): string {
  let digits = recipientPhone.replace(/[^\d]/g, '');

  if (digits.startsWith('00')) {
    // International prefix 00 (e.g. 00447911123456 -> 447911123456)
    digits = digits.substring(2);
  } else if (digits.startsWith('0')) {
    // Local Ghanaian number (e.g. 0241234567 -> 233241234567)
    digits = '233' + digits.substring(1);
  }

  return digits;
}

export async function sendMNotifySMS({
  recipientPhone,
  message,
}: {
  recipientPhone: string;
  message: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const apiKey = process.env.MNOTIFY_API_KEY || 'Pge6NFHGQzEl3bp6Ca4Apqqc8';
  const senderId = process.env.MNOTIFY_SENDER_ID || 'AgriConnect';

  const formattedPhone = formatPhoneNumber(recipientPhone);

  const endpoint = `https://api.mnotify.com/api/sms/quick?key=${apiKey}`;

  const payload = {
    recipient: [formattedPhone],
    sender: senderId.substring(0, 11), // Sender ID capped at 11 characters
    message: message,
    is_schedule: false,
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('mNotify SMS API Response:', data);

    if (response.ok && (data.status === 'success' || data.code === '2000')) {
      return { success: true, data };
    } else {
      return {
        success: false,
        data,
        error: data.message || data.status || 'mNotify SMS dispatch failed',
      };
    }
  } catch (err: any) {
    console.error('mNotify SMS Network Error:', err);
    return { success: false, error: err.message || 'Network error dispatching mNotify SMS' };
  }
}

/**
 * Dispatch official application confirmation SMS with exact required text format
 */
export async function sendConfirmationSMS({
  firstName,
  phone,
  applicationNumber,
}: {
  firstName: string;
  phone: string;
  applicationNumber: string;
}): Promise<{ success: boolean; error?: string }> {
  const text = `Dear ${firstName}, your application to the National Security Career Development Program has been received successfully. Application No: ${applicationNumber}. Thank you. - UDS/IISS`;
  return await sendMNotifySMS({ recipientPhone: phone, message: text });
}
