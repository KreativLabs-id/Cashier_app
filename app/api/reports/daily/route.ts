import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { Database } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json(
        { message: 'Date parameter required' },
        { status: 400 }
      );
    }
    
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    
    // Get orders for the day
    const orders = await sql`
      SELECT * FROM orders
      WHERE order_time >= ${startDate.toISOString()}
        AND order_time < ${endDate.toISOString()}
    `;
    
    if (!orders || orders.length === 0) {
      return NextResponse.json({
        date,
        order_count: 0,
        total_revenue: 0,
        avg_order_value: 0,
        by_payment: {
          cash: 0,
          qris: 0,
          ewallet: 0,
        },
        top_products: [],
        top_variants: [],
      });
    }
    
    // Calculate summary
    const totalRevenue = (orders as any[]).reduce((sum: number, o: any) => sum + o.total, 0);
    const orderCount = orders.length;
    const avgOrderValue = Math.round(totalRevenue / orderCount);
    
    // Payment breakdown
    const byPayment = {
      cash: (orders as any[]).filter((o: any) => o.pay_method === 'cash').reduce((sum: number, o: any) => sum + o.total, 0),
      qris: (orders as any[]).filter((o: any) => o.pay_method === 'qris').reduce((sum: number, o: any) => sum + o.total, 0),
      ewallet: (orders as any[]).filter((o: any) => o.pay_method === 'ewallet').reduce((sum: number, o: any) => sum + o.total, 0),
    };
    
    // Get order items with products
    const orderIds = (orders as any[]).map((o: any) => o.id);
    const orderItems = await sql`
      SELECT 
        oi.*,
        p.id as product_id,
        p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ANY(${orderIds}::uuid[])
    `;
    
    // Top products
    const productMap = new Map();
    orderItems?.forEach((item: any) => {
      const key = item.product_id;
      if (!productMap.has(key)) {
        productMap.set(key, {
          product_id: key,
          product_name: item.product_name,
          qty: 0,
          revenue: 0,
        });
      }
      const product = productMap.get(key);
      product.qty += item.qty;
      product.revenue += item.qty * item.unit_price;
    });
    
    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
    
    // Top variants (from order_items)
    const variantMap = new Map();
    orderItems?.forEach((item: any) => {
      if (item.variant_name) {
        const key = `${item.product_id}_${item.variant_name}`;
        if (!variantMap.has(key)) {
          variantMap.set(key, {
            product_name: item.product_name,
            variant_name: item.variant_name,
            qty: 0,
            revenue: 0,
          });
        }
        const variant = variantMap.get(key);
        variant.qty += item.qty;
        variant.revenue += item.qty * item.unit_price;
      }
    });
    
    const topVariants = Array.from(variantMap.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
    
    return NextResponse.json({
      date,
      order_count: orderCount,
      total_revenue: totalRevenue,
      avg_order_value: avgOrderValue,
      by_payment: byPayment,
      top_products: topProducts,
      top_variants: topVariants,
    });
  } catch (error: any) {
    console.error('GET /api/reports/daily error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
