import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const validEmail = process.env.ADMIN_EMAIL || 'admin@uds.edu.gh';
    const validPassword = process.env.ADMIN_PASSWORD || 'Admin@NSCDP2026!';

    if (
      (username?.trim().toLowerCase() === validEmail.toLowerCase() || username?.trim() === 'admin') &&
      password === validPassword
    ) {
      const response = NextResponse.json({
        success: true,
        message: 'Admin authenticated successfully',
      });

      // Set auth cookie
      response.cookies.set('nscdp_admin_session', 'authenticated_token_' + Date.now(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 12, // 12 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid admin credentials. Please check your username/email and password.' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server login error' }, { status: 500 });
  }
}
