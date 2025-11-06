import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireRole } from '@/lib/auth';

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

// POST - Create new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const user = await requireRole(['admin']);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, name, base_price, variants } = body;

    // Validate input
    if (!id || !name || !base_price) {
      return NextResponse.json(
        { error: 'ID, nama, dan harga harus diisi' },
        { status: 400 }
      );
    }

    // Insert product
    await sql`
      INSERT INTO products (id, name, base_price, is_active)
      VALUES (${id}, ${name}, ${base_price}, true)
    `;

    // Insert variants if provided
    if (variants && Array.isArray(variants) && variants.length > 0) {
      for (const variant of variants) {
        await sql`
          INSERT INTO product_variants (product_id, variant_name, base_price)
          VALUES (${id}, ${variant.variant_name}, ${variant.base_price})
        `;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Produk berhasil ditambahkan',
    });
  } catch (error: any) {
    console.error('POST /api/products error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat menambahkan produk' },
      { status: 500 }
    );
  }
}
