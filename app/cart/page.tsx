'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { formatCurrency } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';
import { Trash2, Minus, Plus, ArrowLeft, Receipt } from 'lucide-react';
import type { CreateOrderPayload } from '@/types/database';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateItemQty,
    removeItem,
    discountType,
    discount,
    setDiscount,
    extraFee,
    setExtraFee,
    payMethod,
    setPayMethod,
    paidAmount,
    setPaidAmount,
    getSubtotal,
    getDiscountAmount,
    getTotal,
    getChange,
    clearCart,
  } = useCartStore();
  
  const [loading, setLoading] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [tempDiscountType, setTempDiscountType] = useState<'amount' | 'percentage'>(discountType);
  const [tempDiscountValue, setTempDiscountValue] = useState(discount.toString());
  
  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const total = getTotal();
  const change = getChange();
  
  const handleApplyDiscount = () => {
    const value = parseFloat(tempDiscountValue) || 0;
    setDiscount(tempDiscountType, value);
    setShowDiscountModal(false);
  };
  
  const handleCheckout = async () => {
    if (items.length === 0) {
      alert('Cart masih kosong!');
      return;
    }
    
    if (paidAmount < total) {
      alert('Jumlah bayar kurang!');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare order payload
      const payload: CreateOrderPayload = {
        subtotal,
        discount_amount: discountAmount,
        extra_fee: extraFee,
        total,
        paid_amount: paidAmount,
        change_amount: change,
        pay_method: payMethod,
        items: items.map((item: any) => ({
          product_id: item.product.id,
          variant_name: item.variant?.variant_name || null,
          qty: item.qty,
          unit_price: item.variant ? item.variant.base_price : item.product.base_price,
          notes: item.notes || undefined,
        })),
      };
      
      // Call API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
      }
      
      const data = await response.json();
      
      // Clear cart and navigate to receipt
      clearCart();
      router.push(`/receipt/${data.order_id}`);
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Gagal membuat order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20">
        <header className="bg-white border-b border-slate-200 p-4 md:p-6 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
          <div className="max-w-4xl mx-auto flex items-center">
            <button onClick={() => router.push('/')} className="mr-3 md:mr-4 hover:bg-slate-100 rounded-lg p-2 transition-colors">
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-700" />
            </button>
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900">Keranjang</h1>
          </div>
        </header>
        
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center px-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 max-w-md mx-auto">
              <Receipt className="w-16 h-16 md:w-20 md:h-20 text-slate-300 mx-auto mb-6" />
              <p className="text-slate-600 text-base md:text-lg mb-6 font-medium">Keranjang masih kosong</p>
              <button
                onClick={() => router.push('/')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all active:scale-95"
              >
                Mulai Belanja
              </button>
            </div>
          </div>
        </div>
        
        <BottomNav />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 md:p-6 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.push('/')} className="mr-3 md:mr-4 hover:bg-slate-100 rounded-lg p-2 transition-colors">
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-700" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900">Keranjang</h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium">{items.length} item</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Cart Items */}
      <main className="max-w-4xl mx-auto px-3 md:px-6 py-4 md:py-6 space-y-3 md:space-y-4">
        {items.filter((item: any) => item && item.product).map((item: any) => {
          const itemPrice = item.variant?.base_price ?? item.product?.base_price ?? 0;
          const itemTotal = (item.qty ?? 0) * itemPrice;
          
          return (
            <div key={item.id} className="bg-white rounded-lg border border-slate-200 p-4 md:p-4.5 hover:border-slate-300 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm md:text-base text-slate-900">{item.product.name}</h3>
                  {item.variant && (
                    <p className="text-xs md:text-sm text-orange-600 font-medium mt-1">
                      {item.variant.variant_name}
                    </p>
                  )}
                  <p className="text-sm md:text-base text-slate-900 font-bold mt-1">
                    {formatCurrency(itemPrice)}
                  </p>
                  {item.notes && (
                    <div className="mt-2">
                      <div className="text-xs md:text-sm text-slate-700 font-medium bg-amber-50 inline-block px-2 py-1 rounded">
                        💬 {item.notes}
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors ml-2 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateItemQty(item.id, item.qty - 1)}
                    className="w-8 h-8 md:w-9 md:h-9 bg-slate-800 hover:bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold transition-colors"
                  >
                    <Minus className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                  <span className="w-10 md:w-12 text-center font-bold text-sm md:text-base text-slate-900">{item.qty}</span>
                  <button
                    onClick={() => updateItemQty(item.id, item.qty + 1)}
                    className="w-8 h-8 md:w-9 md:h-9 bg-slate-800 hover:bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold transition-colors"
                  >
                    <Plus className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
                
                <div className="font-bold text-base md:text-lg text-orange-600">
                  {formatCurrency(itemTotal)}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Discount & Extra Fee */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-4.5 space-y-3">
          <h3 className="font-semibold text-sm md:text-base text-slate-900 mb-2">Pengaturan Tambahan</h3>
          <button
            onClick={() => {
              setTempDiscountType(discountType);
              setTempDiscountValue(discount.toString());
              setShowDiscountModal(true);
            }}
            className="w-full flex justify-between items-center text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span className="font-semibold text-xs md:text-sm text-slate-900">Diskon</span>
            <span className="text-orange-600 font-semibold text-xs md:text-sm">
              {discountAmount > 0 ? `- ${formatCurrency(discountAmount)}` : 'Tambah'}
            </span>
          </button>
          
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span className="font-semibold text-xs md:text-sm text-slate-900">Biaya Tambahan</span>
            <input
              type="number"
              value={extraFee || ''}
              onChange={(e) => setExtraFee(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-28 md:w-36 text-right border-2 border-gray-300 rounded-lg px-3 py-2 font-bold text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>
        
        {/* Payment Method */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-md">
          <h3 className="font-bold text-base md:text-lg text-gray-900 mb-3">Metode Pembayaran</h3>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {(['cash', 'qris', 'ewallet'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPayMethod(method)}
                className={`py-3 md:py-4 px-3 md:px-4 rounded-xl font-bold border-2 transition-all active:scale-95 text-xs md:text-base ${
                  payMethod === method
                    ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900'
                }`}
              >
                <div className="text-xl md:text-2xl mb-1">
                  {method === 'cash' ? '💵' : method === 'qris' ? '📱' : '💳'}
                </div>
                {method === 'cash' ? 'Tunai' : method === 'qris' ? 'QRIS' : 'E-Wallet'}
              </button>
            ))}
          </div>
        </div>
        
        {/* Summary */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-lg border-2 border-orange-200 space-y-2 md:space-y-3">
          <h3 className="font-bold text-base md:text-lg text-gray-900 mb-2">Ringkasan Pembayaran</h3>
          <div className="flex justify-between text-sm md:text-base">
            <span className="text-gray-900 font-medium">Subtotal</span>
            <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm md:text-base text-red-600">
              <span>Diskon</span>
              <span className="font-semibold">- {formatCurrency(discountAmount)}</span>
            </div>
          )}
          {extraFee > 0 && (
            <div className="flex justify-between text-sm md:text-base">
              <span className="text-gray-900 font-medium">Biaya Tambahan</span>
              <span className="font-bold text-gray-900">{formatCurrency(extraFee)}</span>
            </div>
          )}
          <div className="border-t-2 border-dashed pt-2 md:pt-3 flex justify-between font-bold text-lg md:text-xl lg:text-2xl">
            <span className="text-gray-900">TOTAL</span>
            <span className="text-orange-600">{formatCurrency(total)}</span>
          </div>
        </div>
        
        {/* Payment Input */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-md space-y-4">
          <div>
            <label className="block text-sm md:text-base font-bold text-gray-900 mb-2">
              💰 Dibayar
            </label>
            <input
              type="number"
              value={paidAmount || ''}
              onChange={(e) => setPaidAmount(parseInt(e.target.value) || 0)}
              placeholder="Masukkan jumlah bayar"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 md:py-4 text-lg md:text-xl font-bold text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
          
          {paidAmount > 0 && (
            <div className="flex justify-between items-center text-base md:text-lg p-3 md:p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <span className="font-bold text-gray-900">💵 Kembalian</span>
              <span className="font-bold text-xl md:text-2xl text-green-600">
                {formatCurrency(change)}
              </span>
            </div>
          )}
          
          <button
            onClick={handleCheckout}
            disabled={loading || paidAmount < total}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white py-4 md:py-5 rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
            ) : (
              '🧾 Bayar & Cetak Struk'
            )}
          </button>
        </div>
      </main>
      
      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 md:p-7 w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <h3 className="font-bold text-lg md:text-xl mb-5 text-gray-900">💰 Atur Diskon</h3>
            
            <div className="mb-5">
              <label className="block text-sm md:text-base font-semibold text-gray-900 mb-3">
                Tipe Diskon
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTempDiscountType('amount')}
                  className={`py-3 md:py-4 px-4 rounded-xl border-2 font-semibold transition-all active:scale-95 ${
                    tempDiscountType === 'amount'
                      ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  💵 Nominal
                </button>
                <button
                  onClick={() => setTempDiscountType('percentage')}
                  className={`py-3 md:py-4 px-4 rounded-xl border-2 font-semibold transition-all active:scale-95 ${
                    tempDiscountType === 'percentage'
                      ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  📊 Persen
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm md:text-base font-semibold text-gray-900 mb-2">
                Nilai Diskon
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={tempDiscountValue}
                  onChange={(e) => setTempDiscountValue(e.target.value)}
                  placeholder="0"
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 md:py-4 pr-10 text-lg font-bold text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
                {tempDiscountType === 'percentage' && (
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-900 font-bold text-lg">
                    %
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDiscountModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-800 active:bg-gray-900 text-white py-3 md:py-4 rounded-xl font-semibold transition-colors shadow-md"
              >
                Batal
              </button>
              <button
                onClick={handleApplyDiscount}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 md:py-4 rounded-xl font-semibold shadow-lg transition-all active:scale-95"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
      
      <BottomNav />
    </div>
  );
}
