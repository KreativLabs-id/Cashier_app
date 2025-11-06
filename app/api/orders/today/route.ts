import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check if user is kasir
    const user = await requireRole(['kasir']);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Kasir access required.' },
        { status: 403 }
      );
    }

    // Get today's orders
    const today = new Date().toISOString().split('T')[0];
    
    const orders = await sql`
      SELECT 
        o.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'variant_name', oi.variant_name,
              'qty', oi.qty,
              'unit_price', oi.unit_price,
              'notes', oi.notes
            ) ORDER BY oi.created_at
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE DATE(o.order_time AT TIME ZONE 'Asia/Jakarta') = ${today}
      GROUP BY o.id
      ORDER BY o.order_time DESC
    `;

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('GET /api/orders/today error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
