'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      if (data.user.role !== 'kasir') {
        router.push('/admin');
        return;
      }
    } catch (error) {
      router.push('/login');
    }
  }, [router]);
  
  const loadOrderDetail = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load order from API
      const response = await fetch(`/api/orders/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      
      const data = await response.json();
      setOrderDetail({ order: data.order, items: data.items || [] });
    } catch (error) {
      console.error('Error loading order:', error);
      alert('Gagal memuat data order');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    checkAuth();
    loadOrderDetail();
  }, [checkAuth, loadOrderDetail]);

  const handlePrint = () => {
    const printContent = document.querySelector('.receipt-print-container');
    if (!printContent) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const contentWindow = iframe.contentWindow;
    if (!contentWindow) {
      document.body.removeChild(iframe);
      alert('Gagal membuka jendela cetak.');
      return;
    }

    const doc = contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Struk Pembelian</title>
          <meta charset="UTF-8">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: 65mm auto;
              margin: 0;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: 'monospace', sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              color: #000;
            }
            
            html, body {
              width: 65mm;
              margin: 0;
              padding: 0;
            }
            
            body {
              padding: 5mm 3mm;
              font-size: 10pt;
              line-height: 1.5;
            }
            
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .mb-1 { margin-bottom: 4px; }
            .mb-2 { margin-bottom: 8px; }
            .mt-2 { margin-top: 8px; }
            
            .border-t { 
              border-top: 1px dashed #000;
            }
            
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .w-full { width: 100%; }
            .receipt-print { 
              width: 100%;
            }
            .item-row > div:last-child {
              text-align: right;
            }
            .summary-row > div:first-child {
              text-align: right;
              padding-right: 1em;
            }
            .summary-row > div:last-child {
              text-align: right;
            }
            .total-row {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    doc.close();

    iframe.onload = () => {
      setTimeout(() => {
        contentWindow.focus();
        contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 100);
      }, 250);
    };
  };
  
  const handleShare = async () => {
    if (!orderDetail) return;
    
    const { order, items } = orderDetail;
    
    // Generate receipt text for WhatsApp
    let text = '🧾 *STRUK PEMBELIAN*\n';
    text += '━━━━━━━━━━━━━━━━\n';
    text += '*Martabak & Terang Bulan Tip Top*\n';
    text += 'Jl. Seroja, Karang Anyar, Kec. Tarakan Barat, Kota Tarakan\n';
    text += 'Telp: 082319777005\n';
    text += '━━━━━━━━━━━━━━━━\n\n';
    text += `Tanggal: ${formatReceiptDateTime(order.order_time)}\n`;
    text += `No: ${order.order_no}\n`;
    text += '━━━━━━━━━━━━━━━━\n\n';
    
    // Items
    items.forEach((item: any) => {
      const itemTotal = item.qty * item.unit_price;
      
      text += `${item.qty}x ${item.products.name}\n`;
      if (item.variant_name) {
        text += `   (${item.variant_name})\n`;
      }
      text += `   @${formatCurrency(item.unit_price)}\n`;
      
      if (item.notes) {
        text += `   Catatan: ${item.notes}\n`;
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
    text += 'Terima kasih! Selamat Menikmati 🙏';
    
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
    <>
      {/* Screen view */}
      <div className="min-h-screen bg-slate-50 print:hidden">
        <div className="max-w-3xl mx-auto bg-white min-h-screen border-x border-slate-200">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 p-6 md:p-8 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold mb-2 text-slate-900">Pembayaran Berhasil</h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium">Order #{order.order_no}</p>
          </div>
          
          {/* Receipt Content */}
          <div className="p-5 md:p-8 lg:p-10">
            <div className="border-b border-slate-200 pb-5 md:pb-6 mb-5 md:mb-6">
              <div className="text-center mb-4">
                <h2 className="font-bold text-lg md:text-xl text-slate-900 mb-2">Martabak & Terang Bulan Tip Top</h2>
                <p className="text-xs md:text-sm text-slate-500">Jl. Seroja, Karang Anyar, Kec. Tarakan Barat, Kota Tarakan</p>
                <p className="text-xs md:text-sm text-slate-500">Telp: 082319777005</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-xs md:text-sm">
                  <span className="text-slate-600 font-medium">Tanggal</span>
                  <span className="font-semibold text-slate-900">{formatReceiptDateTime(order.order_time)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-xs md:text-sm">
                  <span className="text-slate-600 font-medium">No. Order</span>
                  <span className="font-semibold text-slate-900">{order.order_no}</span>
                </div>
              </div>
            </div>
            
            {/* Items */}
            <div className="space-y-3 md:space-y-4 mb-5 md:mb-6">
              <h3 className="font-semibold text-base md:text-lg text-slate-900">
                Daftar Pesanan
              </h3>
              {items.map((item: any) => {
                const itemTotal = item.qty * item.unit_price;
                
                return (
                  <div key={item.id} className="p-3 md:p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex justify-between font-semibold mb-2">
                      <span className="text-slate-900 text-sm md:text-base">
                        <span className="text-orange-600">{item.qty}×</span> {item.products.name}
                      </span>
                      <span className="text-orange-600 text-sm md:text-base">{formatCurrency(itemTotal)}</span>
                    </div>
                    {item.variant_name && (
                      <div className="text-orange-600 ml-4 text-xs md:text-sm font-medium">
                        {item.variant_name}
                      </div>
                    )}
                    <div className="text-slate-700 ml-4 text-xs md:text-sm font-medium">
                      @{formatCurrency(item.unit_price)}
                    </div>
                    {item.notes && (
                      <div className="text-slate-700 ml-4 text-xs md:text-sm mt-1 bg-amber-50 inline-block px-2 py-1 rounded">
                        💬 {item.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Summary */}
            <div className="border-t border-slate-200 pt-4 md:pt-5 space-y-2.5">
              <div className="flex justify-between text-sm md:text-base p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700 font-medium">Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(order.subtotal)}</span>
              </div>
              
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm md:text-base p-3 bg-red-50 rounded-lg">
                  <span className="text-red-600 font-medium">Diskon</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              
              {order.extra_fee > 0 && (
                <div className="flex justify-between text-sm md:text-base p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-medium">Biaya Tambahan</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(order.extra_fee)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold text-lg md:text-xl p-4 bg-green-50 rounded-lg border border-green-200">
                <span className="text-slate-900">TOTAL</span>
                <span className="text-green-600">{formatCurrency(order.total)}</span>
              </div>
            </div>
            
            {/* Payment */}
            <div className="border-t border-slate-200 mt-5 md:mt-6 pt-4 md:pt-5 space-y-2.5">
              <div className="flex justify-between text-sm md:text-base p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700 font-medium">Bayar ({order.pay_method === 'cash' ? 'Tunai' : order.pay_method === 'qris' ? 'QRIS' : 'E-Wallet'})</span>
                <span className="font-semibold text-slate-900">{formatCurrency(order.paid_amount)}</span>
              </div>
              <div className="flex justify-between font-semibold text-sm md:text-base p-3 bg-green-50 rounded-lg">
                <span className="text-green-700">Kembalian</span>
                <span className="text-green-600">{formatCurrency(order.change_amount)}</span>
              </div>
            </div>
            
            <div className="text-center mt-6 md:mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm md:text-base font-semibold text-slate-900 mb-1">Terima kasih atas kunjungan Anda!</p>
              <p className="text-xs md:text-sm text-slate-600">Selamat menikmati</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="p-5 md:p-8 space-y-2.5">
            <button
              onClick={handleShare}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3.5 md:py-4 rounded-lg font-semibold text-sm md:text-base transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <Share2 className="w-4 h-4 md:w-5 md:h-5" />
              <span>Share ke WhatsApp</span>
            </button>
            
            <button
              onClick={handlePrint}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3.5 md:py-4 rounded-lg font-semibold text-sm md:text-base transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <Printer className="w-4 h-4 md:w-5 md:h-5" />
              <span>Cetak Struk</span>
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 md:py-4 rounded-lg font-semibold text-sm md:text-base transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4 md:w-5 md:h-5" />
              <span>Kembali ke POS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Print view */}
      <div className="hidden receipt-print-container">
        <div className="receipt-print leading-snug">
          <div className="text-center mb-1">
            <div className="font-bold text-base mb-0.5">Martabak & Terang Bulan Tip Top</div>
            <div className="text-xs">Jl. Seroja, Karang Anyar, Kec. Tarakan Barat, Kota Tarakan</div>
            <div className="text-xs">Telp: 082319777005</div>
            <div className="border-t"></div>
            <div className="text-xs">{formatReceiptDateTime(order.order_time)}</div>
            <div className="text-xs">No: {order.order_no}</div>
            <div className="border-t"></div>
          </div>
          
          <div>
            {items.map((item: any) => (
              <div key={item.id} className="mb-1">
                <div className="flex justify-between">
                  <span>{item.qty}x {item.products.name}</span>
                  <span>{formatCurrency(item.qty * item.unit_price)}</span>
                </div>
                {item.variant_name && (
                  <div className="ml-2 text-xs">({item.variant_name})</div>
                )}
                <div className="ml-2 text-xs">@{formatCurrency(item.unit_price)}</div>
                {item.notes && (
                  <div className="ml-2 text-xs">Catatan: {item.notes}</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="border-t border-dashed border-black my-1 pt-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between">
                <span>Diskon</span>
                <span>-{formatCurrency(order.discount_amount)}</span>
              </div>
            )}
            {order.extra_fee > 0 && (
              <div className="flex justify-between">
                <span>Biaya Tambahan</span>
                <span>{formatCurrency(order.extra_fee)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-solid pt-0.5 mt-0.5">
              <span>TOTAL</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
          
          <div className="border-t pt-1">
            <div className="flex justify-between">
              <span>Bayar</span>
              <span>{formatCurrency(order.paid_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Kembalian</span>
              <span>{formatCurrency(order.change_amount)}</span>
            </div>
          </div>
          
          <div className="text-center mt-2 text-xs border-t pt-1">
            Terima kasih! 🙏
          </div>
        </div>
      </div>
    </>
  );
}

const ReceiptPrintContent = ({ orderDetail }: { orderDetail: OrderDetail }) => {
  const { order, items } = orderDetail;
  const total = items.reduce((sum, item) => sum + item.qty * item.unit_price, 0);

  return (
    <div className="receipt-print">
      <div className="text-center">
        <div className="font-bold">Martabak & Terang Bulan Tip Top</div>
        <div className="text-xs leading-snug">
          Jl. Seroja, Karang Anyar, Kec. Tarakan Barat, Kota Tarakan
        </div>
        <div className="text-xs leading-snug">Telp: 082319777005</div>
      </div>

      <div className="my-1 border-t"></div>

      <div className="text-sm">
        <div>{formatReceiptDateTime(order.order_time)}</div>
        <div>No: {order.order_no}</div>
      </div>

      <div className="my-1 border-t"></div>

      {items.map((item: any) => {
        const itemTotal = item.qty * item.unit_price;
        return (
          <div key={item.id} className="text-sm">
            <div className="flex justify-between">
              <span>{item.qty}x {item.products.name}</span>
              <span>{formatCurrency(itemTotal)}</span>
            </div>
            {item.variant_name && (
              <div className="ml-2 text-xs">({item.variant_name})</div>
            )}
            <div className="ml-2 text-xs">@{formatCurrency(item.unit_price)}</div>
          </div>
        );
      })}

      <div className="my-1 border-t"></div>

      <div className="text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-bold">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between font-bold text-base pt-0-5">
          <span>TOTAL</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="my-1 border-t"></div>

      <div className="text-sm">
        <div className="flex justify-between">
          <span>Bayar</span>
          <span>{formatCurrency(order.payment_amount)}</span>
        </div>
        <div className="flex justify-between">
          <span>Kembalian</span>
          <span>{formatCurrency(order.payment_amount - total)}</span>
        </div>
      </div>

      <div className="my-1 border-t"></div>

      <div className="text-center mt-2 text-sm">
        Terima kasih! 🙏
      </div>
    </div>
  );
};
