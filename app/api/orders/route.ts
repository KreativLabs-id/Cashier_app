import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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
    const { data: orderNoData, error: orderNoError } = await supabase
      .rpc('generate_order_no');
    
    if (orderNoError) {
      throw new Error('Failed to generate order number: ' + orderNoError.message);
    }
    
    const orderNo = orderNoData as string;
    
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
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderInsert as any)
      .select()
      .single();
    
    if (orderError || !order) {
      throw new Error('Failed to create order: ' + (orderError?.message || 'No data returned'));
    }
    
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
      
      const { error: itemError } = await supabase
        .from('order_items')
        .insert(itemInsert as any);
      
      if (itemError) {
        throw new Error('Failed to create order item: ' + itemError.message);
      }
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
    
    let query = supabase
      .from('orders')
      .select('*')
      .order('order_time', { ascending: false });
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query = query
        .gte('order_time', startDate.toISOString())
        .lt('order_time', endDate.toISOString());
    }
    
    const { data, error } = await query.limit(100);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ orders: data });
  } catch (error: any) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
