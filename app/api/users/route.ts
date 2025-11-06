import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const user = await requireRole(['admin']);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Get all users
    const users = await sql`
      SELECT id, email, name, role, created_at
      FROM users
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('GET /api/users error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
