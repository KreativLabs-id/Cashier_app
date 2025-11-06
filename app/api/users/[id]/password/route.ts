import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireRole, hashPassword } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const user = await requireRole(['admin']);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { newPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await sql`
      UPDATE users
      SET password_hash = ${hashedPassword}
      WHERE id = ${params.id}
    `;

    return NextResponse.json({ 
      success: true,
      message: 'Password berhasil diubah' 
    });
  } catch (error: any) {
    console.error('PUT /api/users/[id]/password error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
