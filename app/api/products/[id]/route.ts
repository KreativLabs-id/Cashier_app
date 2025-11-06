import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { requireRole } from '@/lib/auth';

// PUT - Update product (Admin only)
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

    const { id } = params;
    const body = await request.json();
    const { name, base_price, is_active, variants } = body;

    // Validate input
    if (!name || base_price === undefined) {
      return NextResponse.json(
        { error: 'Nama dan harga harus diisi' },
        { status: 400 }
      );
    }

    // Update product
    await sql`
      UPDATE products 
      SET name = ${name}, 
          base_price = ${base_price}, 
          is_active = ${is_active !== undefined ? is_active : true}
      WHERE id = ${id}
    `;

    // Update variants if provided
    if (variants && Array.isArray(variants)) {
      // Delete existing variants
      await sql`DELETE FROM product_variants WHERE product_id = ${id}`;

      // Insert new variants
      for (const variant of variants) {
        await sql`
          INSERT INTO product_variants (product_id, variant_name, base_price)
          VALUES (${id}, ${variant.variant_name}, ${variant.base_price})
        `;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Produk berhasil diupdate',
    });
  } catch (error: any) {
    console.error('PUT /api/products/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat mengupdate produk' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product (Admin only)
export async function DELETE(
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

    const { id } = params;

    // Soft delete - set is_active to false
    await sql`
      UPDATE products 
      SET is_active = false 
      WHERE id = ${id}
    `;

    return NextResponse.json({
      success: true,
      message: 'Produk berhasil dihapus',
    });
  } catch (error: any) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat menghapus produk' },
      { status: 500 }
    );
  }
}
