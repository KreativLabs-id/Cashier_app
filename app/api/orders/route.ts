import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { CreateOrderPayload, Database } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const payload: CreateOrderPayload = await request.json();
    
    // Validate payload
    if (!payload.items || payload.items.length === 0) {
      return NextResponse.json(
        { message: 'Items tidak boleh kosong' },
        { status: 400 }
      );
    }
    
    // Generate order number
    const orderNoResult = await sql`SELECT generate_order_no() as order_no`;
    
    if (!orderNoResult || orderNoResult.length === 0) {
      throw new Error('Failed to generate order number');
    }
    
    const orderNo = orderNoResult[0].order_no as string;
    
    // Create order
    const orderInsert: Database['Tables']['orders']['Insert'] = {
      order_no: orderNo,
      order_time: new Date().toISOString(),
      subtotal: payload.subtotal,
      discount_amount: payload.discount_amount,
      extra_fee: payload.extra_fee,
      total: payload.total,
      paid_amount: payload.paid_amount,
      change_amount: payload.change_amount,
      pay_method: payload.pay_method,
      notes: payload.notes || null,
    };
    
    const orderResult = await sql`
      INSERT INTO orders (
        order_no, order_time, subtotal, discount_amount, extra_fee, 
        total, paid_amount, change_amount, pay_method, notes
      ) VALUES (
        ${orderNo}, ${orderInsert.order_time}, ${orderInsert.subtotal}, 
        ${orderInsert.discount_amount}, ${orderInsert.extra_fee}, ${orderInsert.total},
        ${orderInsert.paid_amount}, ${orderInsert.change_amount}, 
        ${orderInsert.pay_method}, ${orderInsert.notes}
      )
      RETURNING *
    `;
    
    if (!orderResult || orderResult.length === 0) {
      throw new Error('Failed to create order: No data returned');
    }
    
    const order = orderResult[0];
    
    // Create order items
    for (const item of payload.items) {
      const itemInsert: Database['Tables']['order_items']['Insert'] = {
        order_id: (order as any).id,
        product_id: item.product_id,
        variant_name: item.variant_name,
        qty: item.qty,
        unit_price: item.unit_price,
        notes: item.notes || null,
      };
      
      await sql`
        INSERT INTO order_items (
          order_id, product_id, variant_name, qty, unit_price, notes
        ) VALUES (
          ${itemInsert.order_id}, ${itemInsert.product_id}, ${itemInsert.variant_name},
          ${itemInsert.qty}, ${itemInsert.unit_price}, ${itemInsert.notes}
        )
      `;
    }
    
    return NextResponse.json({
      success: true,
      order_id: (order as any).id,
      order_no: (order as any).order_no,
    });
  } catch (error: any) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    let orders;
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      orders = await sql`
        SELECT * FROM orders
        WHERE order_time >= ${startDate.toISOString()}
          AND order_time < ${endDate.toISOString()}
        ORDER BY order_time DESC
        LIMIT 100
      `;
    } else {
      orders = await sql`
        SELECT * FROM orders
        ORDER BY order_time DESC
        LIMIT 100
      `;
    }
    
    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
