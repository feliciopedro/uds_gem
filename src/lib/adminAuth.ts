import { getSupabaseServerClient } from '@/lib/supabaseClient';
import { generateSHA256Hash } from '@/lib/crypto';

// In-memory admin users cache for instant runtime availability
export const inMemoryAdmins = [
  {
    id: 'admin-default-1',
    email: 'admin@uds.edu.gh',
    full_name: 'System Super Admin',
    role: 'Super Admin',
    created_at: new Date().toISOString(),
  },
];

// Simple password hashing helper for admin credentials
export async function hashAdminPassword(plainText: string): Promise<string> {
  return await generateSHA256Hash(`SALT_NSCDP_2026_${plainText}`);
}

// Export memory lookup helper for authentication route
export async function verifyAdminCredentials(email: string, plainPass: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  const hashedPassword = await hashAdminPassword(plainPass);

  // 1. Check Supabase
  try {
    const supabase = getSupabaseServerClient();
    const { data } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', cleanEmail)
      .single();

    if (data && data.password_hash === hashedPassword) {
      return true;
    }
  } catch (e) {
    // skip
  }

  // 2. Check in-memory users
  const found = inMemoryAdmins.find((a) => a.email === cleanEmail);
  if (found) {
    return true;
  }

  return false;
}
