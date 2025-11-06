'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { ProductWithVariants } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart';

interface ProductCardProps {
  product: ProductWithVariants;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');
  
  const addItem = useCartStore((state) => state.addItem);
  
  const variants = product.product_variants || [];
  const selectedVariant = selectedVariantId 
    ? variants.find(v => v.id === selectedVariantId) 
    : null;
  
  const currentPrice = selectedVariant ? selectedVariant.base_price : product.base_price;
  const totalPrice = currentPrice * qty;
  
  const handleAdd = () => {
    addItem(product, selectedVariant || null, qty, notes);
    
    // Reset
    setShowModal(false);
    setSelectedVariantId(null);
    setQty(1);
    setNotes('');
  };
  
  const handleCardClick = () => {
    if (variants.length > 0) {
      setShowModal(true);
    } else {
      // Langsung tambah jika tidak ada variant
      addItem(product, null, 1, '');
    }
  };
  
  return (
    <>
      {/* Product Card */}
      <div
        onClick={handleCardClick}
        className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group border-2 border-transparent hover:border-orange-300"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base md:text-lg text-gray-800 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm md:text-base text-gray-600 font-semibold">
              {formatCurrency(product.base_price)}
            </p>
            {variants.length > 0 && (
              <p className="text-xs md:text-sm text-orange-500 mt-1 font-medium">
                {variants.length} varian tersedia
              </p>
            )}
          </div>
          <div className="ml-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
          </div>
        </div>
      </div>
      
      {/* Modal Variant Selector */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full md:max-w-2xl md:rounded-2xl rounded-t-3xl max-h-[90vh] md:max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom md:zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 md:p-6 border-b-2 border-gray-100 bg-gradient-to-r from-orange-50 to-white">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 truncate">
                  {product.name}
                </h2>
                <p className="text-sm md:text-base text-gray-600 mt-1">
                  Pilih varian yang diinginkan
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="ml-4 w-10 h-10 md:w-12 md:h-12 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              </button>
            </div>
            
            {/* Variants List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
              <div className="space-y-3">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                      selectedVariantId === variant.id
                        ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 shadow-md'
                        : 'border-gray-200 hover:border-orange-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm md:text-base text-gray-800 mb-1">
                          {variant.variant_name}
                        </div>
                        <div className={`text-base md:text-lg font-bold ${
                          selectedVariantId === variant.id ? 'text-orange-600' : 'text-gray-700'
                        }`}>
                          {formatCurrency(variant.base_price)}
                        </div>
                      </div>
                      {selectedVariantId === variant.id && (
                        <div className="ml-3 w-6 h-6 md:w-7 md:h-7 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity & Notes */}
            <div className="border-t-2 border-gray-100 p-4 md:p-6 space-y-4 bg-gray-50">
              {/* Quantity */}
              <div>
                <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2">
                  Jumlah
                </label>
                <div className="flex items-center space-x-3 md:space-x-4">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-12 h-12 md:w-14 md:h-14 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-xl font-bold text-xl transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 h-12 md:h-14 text-center text-xl md:text-2xl font-bold border-2 border-gray-300 focus:border-orange-500 rounded-xl outline-none"
                  />
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-12 h-12 md:w-14 md:h-14 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-xl font-bold text-xl transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Notes */}
              <div>
                <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2">
                  Catatan (opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Misal: tidak terlalu manis"
                  className="w-full px-4 py-3 md:py-3.5 border-2 border-gray-300 focus:border-orange-500 rounded-xl outline-none text-sm md:text-base"
                />
              </div>
              
              {/* Total & Add Button */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base md:text-lg font-semibold text-gray-700">Total:</span>
                  <span className="text-xl md:text-2xl font-bold text-orange-600">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <button
                  onClick={handleAdd}
                  disabled={variants.length > 0 && !selectedVariantId}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {variants.length > 0 && !selectedVariantId ? 'Pilih varian dulu' : '✓ Tambah ke Keranjang'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
