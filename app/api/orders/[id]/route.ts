import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    
    // Get order
    const orders = await sql`
      SELECT * FROM orders
      WHERE id = ${orderId}
    `;
    
    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }
    
    const order = orders[0];
    
    // Get order items with products
    const items = await sql`
      SELECT 
        oi.*,
        p.id as product_id,
        p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${orderId}
    `;
    
    // Transform items to match expected format
    const transformedItems = items.map((item: any) => ({
      ...item,
      products: {
        id: item.product_id,
        name: item.product_name
      }
    }));
    
    return NextResponse.json({
      order,
      items: transformedItems
    });
  } catch (error: any) {
    console.error('GET /api/orders/[id] error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
