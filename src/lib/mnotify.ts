/**
 * Helper utility for sending SMS notifications via mNotify v2 API
 */
export async function sendMNotifySMS({
  recipientPhone,
  message,
}: {
  recipientPhone: string;
  message: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  const apiKey = process.env.MNOTIFY_API_KEY || 'Pge6NFHGQzEl3bp6Ca4Apqqc8';
  const senderId = process.env.MNOTIFY_SENDER_ID || 'NSCDP';

  // Format recipient phone number (remove spaces, symbols)
  let formattedPhone = recipientPhone.replace(/[^\d+]/g, '');
  if (formattedPhone.startsWith('+')) {
    formattedPhone = formattedPhone.substring(1);
  }

  const endpoint = `https://api.mnotify.com/api/sms/quick?key=${apiKey}`;

  const payload = {
    recipient: [formattedPhone],
    sender: senderId.substring(0, 11), // mNotify sender ID max length is 11 chars
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
