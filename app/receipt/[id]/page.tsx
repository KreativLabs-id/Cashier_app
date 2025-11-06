'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatReceiptDateTime } from '@/lib/utils';
import { Share2, Printer, Home } from 'lucide-react';

interface OrderDetail {
  order: any;
  items: any[];
}

export default function ReceiptPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadOrderDetail();
  }, [params.id]);
  
  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      
      // Load order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (orderError) throw orderError;
      
      // Load order items with products and toppings
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          products (id, name),
          order_item_toppings (
            *,
            toppings (id, name)
          )
        `)
        .eq('order_id', params.id);
      
      if (itemsError) throw itemsError;
      
      setOrderDetail({ order, items: items || [] });
    } catch (error) {
      console.error('Error loading order:', error);
      alert('Gagal memuat data order');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleShare = async () => {
    if (!orderDetail) return;
    
    const { order, items } = orderDetail;
    
    // Generate receipt text for WhatsApp
    let text = '🧾 *STRUK PEMBELIAN*\n';
    text += '━━━━━━━━━━━━━━━━\n';
    text += '*Martabak & Terang Bulan Tip Top*\n';
    text += 'Jl. [Alamat Lengkap]\n';
    text += 'Telp: 08xxxx\n';
    text += '━━━━━━━━━━━━━━━━\n\n';
    text += `Tanggal: ${formatReceiptDateTime(order.order_time)}\n`;
    text += `No: ${order.order_no}\n`;
    text += '━━━━━━━━━━━━━━━━\n\n';
    
    // Items
    items.forEach((item: any) => {
      const toppingTotal = item.order_item_toppings?.reduce((sum: number, t: any) => sum + t.price, 0) || 0;
      const itemTotal = item.qty * (item.unit_price + toppingTotal);
      
      text += `${item.qty}x ${item.products.name}\n`;
      text += `   @${formatCurrency(item.unit_price)}\n`;
      
      if (item.order_item_toppings?.length > 0) {
        item.order_item_toppings.forEach((t: any) => {
          text += `   + ${t.toppings.name} ${formatCurrency(t.price)}\n`;
        });
      }
      
      text += `   = ${formatCurrency(itemTotal)}\n\n`;
    });
    
    text += '━━━━━━━━━━━━━━━━\n';
    text += `Subtotal: ${formatCurrency(order.subtotal)}\n`;
    
    if (order.discount_amount > 0) {
      text += `Diskon: -${formatCurrency(order.discount_amount)}\n`;
    }
    
    if (order.extra_fee > 0) {
      text += `Biaya Tambahan: ${formatCurrency(order.extra_fee)}\n`;
    }
    
    text += `*TOTAL: ${formatCurrency(order.total)}*\n`;
    text += '━━━━━━━━━━━━━━━━\n';
    
    const payMethodLabel = order.pay_method === 'cash' ? 'Tunai' : 
                          order.pay_method === 'qris' ? 'QRIS' : 'E-Wallet';
    
    text += `Bayar (${payMethodLabel}): ${formatCurrency(order.paid_amount)}\n`;
    text += `Kembalian: ${formatCurrency(order.change_amount)}\n`;
    text += '━━━━━━━━━━━━━━━━\n';
    text += 'Terima kasih! 🙏';
    
    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Struk Pembelian',
          text: text,
        });
        return;
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    }
    
    // Fallback: Open WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat struk...</p>
        </div>
      </div>
    );
  }
  
  if (!orderDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order tidak ditemukan</p>
          <button
            onClick={() => router.push('/')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Kembali ke POS
          </button>
        </div>
      </div>
    );
  }
  
  const { order, items } = orderDetail;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      {/* Screen view */}
      <div className="print:hidden">
        <div className="max-w-3xl mx-auto bg-white min-h-screen shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 md:p-8 text-center shadow-xl">
            <div className="text-5xl md:text-6xl mb-3">✅</div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Pembayaran Berhasil!</h1>
            <p className="text-sm md:text-base text-green-100 font-medium">Order #{order.order_no}</p>
          </div>
          
          {/* Receipt Content */}
          <div className="p-5 md:p-8 lg:p-10">
            <div className="border-b-2 border-dashed pb-5 md:pb-6 mb-5 md:mb-6">
              <div className="text-center mb-4">
                <h2 className="font-bold text-xl md:text-2xl text-gray-800 mb-2">🧇 Martabak & Terang Bulan Tip Top</h2>
                <p className="text-sm md:text-base text-gray-600">Jl. [Alamat Lengkap]</p>
                <p className="text-sm md:text-base text-gray-600">Telp: 08xxxx</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl text-sm md:text-base">
                  <span className="text-gray-600 font-medium">📅 Tanggal:</span>
                  <span className="font-bold text-gray-800">{formatReceiptDateTime(order.order_time)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl text-sm md:text-base">
                  <span className="text-gray-600 font-medium">🔢 No. Order:</span>
                  <span className="font-bold text-gray-800">{order.order_no}</span>
                </div>
              </div>
            </div>
            
            {/* Items */}
            <div className="space-y-4 md:space-y-5 mb-5 md:mb-6">
              <h3 className="font-bold text-lg md:text-xl text-gray-800 flex items-center">
                <span className="text-2xl mr-2">📋</span>
                Daftar Pesanan
              </h3>
              {items.map((item: any) => {
                const toppingTotal = item.order_item_toppings?.reduce((sum: number, t: any) => sum + t.price, 0) || 0;
                const itemTotal = item.qty * (item.unit_price + toppingTotal);
                
                return (
                  <div key={item.id} className="p-4 md:p-5 bg-gradient-to-r from-orange-50 to-transparent rounded-xl hover:from-orange-100 transition-all">
                    <div className="flex justify-between font-bold mb-2">
                      <span className="text-gray-800 text-base md:text-lg">
                        <span className="text-orange-500">{item.qty}×</span> {item.products.name}
                      </span>
                      <span className="text-orange-600 text-base md:text-lg">{formatCurrency(itemTotal)}</span>
                    </div>
                    <div className="text-gray-600 ml-4 text-sm md:text-base font-medium">
                      @{formatCurrency(item.unit_price)}
                    </div>
                    {item.order_item_toppings?.map((t: any) => (
                      <div key={t.id} className="text-gray-600 ml-4 text-sm md:text-base flex justify-between items-center mt-1">
                        <span>+ {t.toppings.name}</span>
                        <span className="text-gray-700 font-medium">{formatCurrency(t.price)}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            
            {/* Summary */}
            <div className="border-t-2 border-dashed pt-4 md:pt-5 space-y-3 md:space-y-4">
              <div className="flex justify-between text-base md:text-lg p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700 font-medium">Subtotal</span>
                <span className="font-bold text-gray-800">{formatCurrency(order.subtotal)}</span>
              </div>
              
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-base md:text-lg p-3 bg-red-50 rounded-xl">
                  <span className="text-red-600 font-medium">💸 Diskon</span>
                  <span className="font-bold text-red-600">-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              
              {order.extra_fee > 0 && (
                <div className="flex justify-between text-base md:text-lg p-3 bg-blue-50 rounded-xl">
                  <span className="text-blue-600 font-medium">➕ Biaya Tambahan</span>
                  <span className="font-bold text-blue-600">{formatCurrency(order.extra_fee)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold text-xl md:text-2xl p-4 md:p-5 bg-gradient-to-r from-green-100 to-green-50 rounded-xl border-2 border-green-300 shadow-md">
                <span className="text-gray-800">💰 TOTAL</span>
                <span className="text-green-600">{formatCurrency(order.total)}</span>
              </div>
            </div>
            
            {/* Payment */}
            <div className="border-t-2 border-dashed mt-5 md:mt-6 pt-4 md:pt-5 space-y-3">
              <div className="flex justify-between text-base md:text-lg p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700 font-medium">💵 Bayar ({order.pay_method === 'cash' ? 'Tunai' : order.pay_method === 'qris' ? 'QRIS' : 'E-Wallet'})</span>
                <span className="font-bold text-gray-800">{formatCurrency(order.paid_amount)}</span>
              </div>
              <div className="flex justify-between font-bold text-base md:text-lg p-3 bg-green-100 rounded-xl">
                <span className="text-green-700">💸 Kembalian</span>
                <span className="text-green-600">{formatCurrency(order.change_amount)}</span>
              </div>
            </div>
            
            <div className="text-center mt-6 md:mt-8 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
              <p className="text-base md:text-lg font-bold text-gray-800 mb-1">🙏 Terima kasih atas kunjungan Anda!</p>
              <p className="text-sm md:text-base text-gray-600">Selamat menikmati �</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="p-5 md:p-8 space-y-3 md:space-y-4">
            <button
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
            >
              <Share2 className="w-5 h-5 md:w-6 md:h-6" />
              <span>📱 Share ke WhatsApp</span>
            </button>
            
            <button
              onClick={handlePrint}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
            >
              <Printer className="w-5 h-5 md:w-6 md:h-6" />
              <span>🖨️ Cetak Struk</span>
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5 md:w-6 md:h-6" />
              <span>🏠 Kembali ke POS</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Print view */}
      <div className="hidden print:block receipt-print">
        <div className="text-center mb-2" style={{ fontSize: '10px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '12px' }}>Martabak & Terang Bulan Tip Top</div>
          <div>Jl. [Alamat Lengkap]</div>
          <div>Telp: 08xxxx</div>
          <div style={{ borderTop: '1px dashed #000', margin: '4px 0' }}></div>
          <div>{formatReceiptDateTime(order.order_time)}</div>
          <div>No: {order.order_no}</div>
          <div style={{ borderTop: '1px dashed #000', margin: '4px 0' }}></div>
        </div>
        
        <div style={{ fontSize: '10px' }}>
          {items.map((item: any, index: number) => {
            const toppingTotal = item.order_item_toppings?.reduce((sum: number, t: any) => sum + t.price, 0) || 0;
            const itemTotal = item.qty * (item.unit_price + toppingTotal);
            
            return (
              <div key={item.id} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.qty}x {item.products.name}</span>
                  <span>{formatCurrency(itemTotal)}</span>
                </div>
                <div style={{ marginLeft: '12px', fontSize: '9px' }}>
                  @{formatCurrency(item.unit_price)}
                </div>
                {item.order_item_toppings?.map((t: any) => (
                  <div key={t.id} style={{ marginLeft: '12px', fontSize: '9px' }}>
                    + {t.toppings.name} ({formatCurrency(t.price)})
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        
        <div style={{ borderTop: '1px dashed #000', margin: '4px 0', paddingTop: '4px', fontSize: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          {order.discount_amount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Diskon</span>
              <span>-{formatCurrency(order.discount_amount)}</span>
            </div>
          )}
          {order.extra_fee > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Biaya Tambahan</span>
              <span>{formatCurrency(order.extra_fee)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '11px', borderTop: '1px solid #000', paddingTop: '2px', marginTop: '2px' }}>
            <span>TOTAL</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
        
        <div style={{ borderTop: '1px dashed #000', margin: '4px 0', paddingTop: '4px', fontSize: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Bayar</span>
            <span>{formatCurrency(order.paid_amount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Kembalian</span>
            <span>{formatCurrency(order.change_amount)}</span>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '10px', borderTop: '1px dashed #000', paddingTop: '4px' }}>
          Terima kasih! 🙏
        </div>
      </div>
    </div>
  );
}
