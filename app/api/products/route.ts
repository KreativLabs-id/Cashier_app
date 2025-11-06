import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get products with variants
    const products = await sql`
      SELECT 
        p.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pv.id,
              'product_id', pv.product_id,
              'variant_name', pv.variant_name,
              'base_price', pv.base_price,
              'created_at', pv.created_at
            ) ORDER BY pv.variant_name
          ) FILTER (WHERE pv.id IS NOT NULL),
          '[]'
        ) as product_variants
      FROM products p
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      WHERE p.is_active = true
      GROUP BY p.id, p.name, p.base_price, p.is_active, p.created_at
      ORDER BY p.name
    `;
    
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('GET /api/products error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
