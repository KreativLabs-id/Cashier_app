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
        className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 landscape:p-3 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group border-2 border-transparent hover:border-orange-300"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base md:text-lg landscape:text-sm text-gray-800 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm md:text-base landscape:text-xs text-gray-600 font-semibold">
              {formatCurrency(product.base_price)}
            </p>
            {variants.length > 0 && (
              <p className="text-xs md:text-sm landscape:text-[10px] text-orange-500 mt-1 font-medium">
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-white via-white to-orange-50/30 w-full md:max-w-2xl landscape:max-w-4xl md:rounded-3xl rounded-t-3xl max-h-[90vh] md:max-h-[85vh] landscape:max-h-[95vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom md:zoom-in duration-300 border-t-4 md:border-t-0 md:border-2 border-orange-500">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 landscape:p-4 border-b border-orange-100 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
              <div className="flex-1 min-w-0 relative z-10">
                <h2 className="text-xl md:text-2xl landscape:text-xl font-bold text-white truncate drop-shadow-md flex items-center gap-2">
                  <span className="text-2xl">🧇</span>
                  {product.name}
                </h2>
                <p className="text-sm md:text-base landscape:text-sm text-orange-100 mt-1 font-medium">
                  Pilih varian yang diinginkan
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="ml-4 w-10 h-10 md:w-12 md:h-12 landscape:w-10 landscape:h-10 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all hover:rotate-90 duration-300 relative z-10"
              >
                <X className="w-5 h-5 md:w-6 md:h-6 landscape:w-5 landscape:h-5 text-white drop-shadow" />
              </button>
            </div>
            
            {/* Variants List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 landscape:p-4 custom-scrollbar bg-gradient-to-b from-transparent to-orange-50/20">
              <div className="space-y-3 landscape:space-y-2">
                {variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`w-full text-left p-4 md:p-5 landscape:p-3 rounded-2xl border-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group ${
                      selectedVariantId === variant.id
                        ? 'border-orange-500 bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 shadow-lg shadow-orange-200/50'
                        : 'border-gray-200 hover:border-orange-300 bg-white hover:shadow-md'
                    }`}
                  >
                    {selectedVariantId === variant.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-transparent animate-pulse"></div>
                    )}
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 md:w-12 md:h-12 landscape:w-10 landscape:h-10 rounded-xl flex items-center justify-center font-bold text-lg md:text-xl landscape:text-lg transition-all ${
                          selectedVariantId === variant.id 
                            ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg scale-110' 
                            : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 group-hover:from-orange-100 group-hover:to-orange-200'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm md:text-base landscape:text-sm text-gray-800 mb-0.5">
                            {variant.variant_name}
                          </div>
                          <div className={`text-base md:text-lg landscape:text-base font-bold transition-colors ${
                            selectedVariantId === variant.id ? 'text-orange-600' : 'text-gray-700'
                          }`}>
                            {formatCurrency(variant.base_price)}
                          </div>
                        </div>
                      </div>
                      {selectedVariantId === variant.id && (
                        <div className="ml-3 w-8 h-8 md:w-9 md:h-9 landscape:w-8 landscape:h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-in zoom-in duration-200">
                          <svg className="w-5 h-5 md:w-6 md:h-6 landscape:w-5 landscape:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="border-t-2 border-orange-100 p-4 md:p-6 landscape:p-4 space-y-3 md:space-y-4 landscape:space-y-3 bg-gradient-to-b from-white to-orange-50/50 backdrop-blur-sm">
              {/* Quantity */}
              <div>
                <label className="block text-sm md:text-base landscape:text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-lg">🔢</span>
                  Jumlah
                </label>
                <div className="flex items-center space-x-3 md:space-x-4 landscape:space-x-3">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-12 h-12 md:w-14 md:h-14 landscape:w-11 landscape:h-11 bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 active:scale-95 rounded-xl font-bold text-xl shadow-md transition-all"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 h-12 md:h-14 landscape:h-11 text-center text-xl md:text-2xl landscape:text-xl font-bold border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl outline-none bg-white shadow-inner"
                  />
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-12 h-12 md:w-14 md:h-14 landscape:w-11 landscape:h-11 bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 active:scale-95 rounded-xl font-bold text-xl shadow-md transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Notes */}
              <div>
                <label className="block text-sm md:text-base landscape:text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-lg">📝</span>
                  Catatan (opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Misal: tidak terlalu manis"
                  className="w-full px-4 py-3 md:py-3.5 landscape:py-2.5 border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl outline-none text-sm md:text-base landscape:text-sm bg-white shadow-inner"
                />
              </div>
              
              {/* Total & Add Button */}
              <div className="pt-2 landscape:pt-1">
                <div className="flex items-center justify-between mb-3 landscape:mb-2 p-4 landscape:p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
                  <span className="text-base md:text-lg landscape:text-base font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-xl">💰</span>
                    Total:
                  </span>
                  <span className="text-2xl md:text-3xl landscape:text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent drop-shadow">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <button
                  onClick={handleAdd}
                  disabled={variants.length > 0 && !selectedVariantId}
                  className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 md:py-5 landscape:py-3.5 rounded-2xl font-bold text-base md:text-lg landscape:text-base shadow-xl hover:shadow-2xl disabled:shadow-none transition-all transform hover:-translate-y-1 active:scale-95 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <span className="relative z-10">{variants.length > 0 && !selectedVariantId ? '⚠️ Pilih varian dulu' : '✓ Tambah ke Keranjang'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
