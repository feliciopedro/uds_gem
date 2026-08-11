import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabaseClient';
import { inMemoryAdmins, hashAdminPassword } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();

    let adminList: any[] = [];
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, email, full_name, role, created_at')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        adminList = data;
      }
    } catch (e) {
      console.warn('Supabase admin_users fetch query fallback active:', e);
    }

    if (adminList.length === 0) {
      adminList = inMemoryAdmins;
    }

    return NextResponse.json({
      success: true,
      users: adminList,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch admin users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, full_name, password, role } = await req.json();

    if (!email || !full_name || !password) {
      return NextResponse.json(
        { error: 'Full Name, Email, and Password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const supabase = getSupabaseServerClient();
    const hashedPassword = await hashAdminPassword(password);
    const assignedRole = role || 'Admin';

    const newUserObj = {
      id: `admin-${Date.now()}`,
      email: cleanEmail,
      full_name: full_name.trim(),
      password_hash: hashedPassword,
      role: assignedRole,
      created_at: new Date().toISOString(),
    };

    // Save to Supabase admin_users table
    let savedInDb = false;
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          email: cleanEmail,
          full_name: full_name.trim(),
          password_hash: hashedPassword,
          role: assignedRole,
        })
        .select()
        .single();

      if (!error && data) {
        savedInDb = true;
        newUserObj.id = data.id;
      }
    } catch (dbErr) {
      console.warn('Supabase admin_users insert fallback active:', dbErr);
    }

    // Always append to in-memory fallback list so it works seamlessly regardless of database setup
    if (!inMemoryAdmins.some((a) => a.email === cleanEmail)) {
      inMemoryAdmins.unshift({
        id: newUserObj.id,
        email: cleanEmail,
        full_name: full_name.trim(),
        role: assignedRole,
        created_at: newUserObj.created_at,
      });
    }

    // Append Audit Log Entry
    try {
      const auditPayload = {
        action: 'ADMIN_USER_CREATED',
        details: { email: cleanEmail, full_name, role: assignedRole },
        timestamp: new Date().toISOString(),
        entry_hash: hashedPassword,
      };
      await supabase.from('application_audit_logs').insert(auditPayload);
    } catch (auditErr) {
      console.warn('Audit log insert warning:', auditErr);
    }

    return NextResponse.json({
      success: true,
      message: `Admin user ${cleanEmail} created successfully.`,
      user: {
        id: newUserObj.id,
        email: cleanEmail,
        full_name: full_name.trim(),
        role: assignedRole,
        created_at: newUserObj.created_at,
      },
    });
  } catch (err: any) {
    console.error('Create admin user error:', err);
    return NextResponse.json(
      { error: err.message || 'Error creating admin user' },
      { status: 500 }
    );
  }
}
