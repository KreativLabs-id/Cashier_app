import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .gte('order_time', startDate.toISOString())
      .lt('order_time', endDate.toISOString());
    
    if (ordersError) throw ordersError;
    
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
        top_toppings: [],
      });
    }
    
    // Calculate summary
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const orderCount = orders.length;
    const avgOrderValue = Math.round(totalRevenue / orderCount);
    
    // Payment breakdown
    const byPayment = {
      cash: orders.filter(o => o.pay_method === 'cash').reduce((sum, o) => sum + o.total, 0),
      qris: orders.filter(o => o.pay_method === 'qris').reduce((sum, o) => sum + o.total, 0),
      ewallet: orders.filter(o => o.pay_method === 'ewallet').reduce((sum, o) => sum + o.total, 0),
    };
    
    // Get order items with products
    const orderIds = orders.map(o => o.id);
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products (id, name)
      `)
      .in('order_id', orderIds);
    
    if (itemsError) throw itemsError;
    
    // Top products
    const productMap = new Map();
    orderItems?.forEach((item: any) => {
      const key = item.product_id;
      if (!productMap.has(key)) {
        productMap.set(key, {
          product_id: key,
          product_name: item.products.name,
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
    
    // Get toppings
    const itemIds = orderItems?.map((i: any) => i.id) || [];
    if (itemIds.length > 0) {
      const { data: itemToppings, error: toppingsError } = await supabase
        .from('order_item_toppings')
        .select(`
          *,
          toppings (id, name)
        `)
        .in('order_item_id', itemIds);
      
      if (toppingsError) throw toppingsError;
      
      // Top toppings
      const toppingMap = new Map();
      itemToppings?.forEach((item: any) => {
        const key = item.topping_id;
        if (!toppingMap.has(key)) {
          toppingMap.set(key, {
            topping_id: key,
            topping_name: item.toppings.name,
            times_used: 0,
            revenue: 0,
          });
        }
        const topping = toppingMap.get(key);
        topping.times_used += 1;
        topping.revenue += item.price;
      });
      
      const topToppings = Array.from(toppingMap.values())
        .sort((a, b) => b.times_used - a.times_used)
        .slice(0, 5);
      
      return NextResponse.json({
        date,
        order_count: orderCount,
        total_revenue: totalRevenue,
        avg_order_value: avgOrderValue,
        by_payment: byPayment,
        top_products: topProducts,
        top_toppings: topToppings,
      });
    }
    
    return NextResponse.json({
      date,
      order_count: orderCount,
      total_revenue: totalRevenue,
      avg_order_value: avgOrderValue,
      by_payment: byPayment,
      top_products: topProducts,
      top_toppings: [],
    });
  } catch (error: any) {
    console.error('GET /api/reports/daily error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
