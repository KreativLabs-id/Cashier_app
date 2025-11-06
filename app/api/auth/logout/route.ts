import { NextRequest, NextResponse } from 'next/server';
import { getSessionToken, logoutUser, clearSessionToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = await getSessionToken();

    if (token) {
      await logoutUser(token);
      await clearSessionToken();
    }

    return NextResponse.json({
      success: true,
      message: 'Logout berhasil',
    });
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat logout' },
      { status: 500 }
    );
  }
}
