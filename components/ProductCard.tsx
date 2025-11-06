'use client';

import { useState } from 'react';
import { Plus, X, Search } from 'lucide-react';
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
  const [searchVariant, setSearchVariant] = useState('');
  
  const addItem = useCartStore((state) => state.addItem);
  
  const variants = product.product_variants || [];
  
  // Filter variants berdasarkan search
  const filteredVariants = variants.filter(v => 
    v.variant_name.toLowerCase().includes(searchVariant.toLowerCase())
  );
  
  const selectedVariant = selectedVariantId 
    ? variants.find(v => v.id === selectedVariantId) 
    : null;
  
  // Total dimulai dari 0 jika ada varian tapi belum dipilih
  const totalPrice = variants.length > 0 && !selectedVariantId
    ? 0
    : selectedVariant 
      ? selectedVariant.base_price * qty 
      : product.base_price * qty;
  
  const handleAdd = () => {
    addItem(product, selectedVariant || null, qty, notes);
    
    // Reset
    setShowModal(false);
    setSelectedVariantId(null);
    setQty(1);
    setNotes('');
    setSearchVariant('');
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
        className="bg-white rounded-lg border border-slate-200 p-4 md:p-4.5 landscape:p-3.5 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm md:text-base landscape:text-sm text-slate-900 mb-1.5 line-clamp-2">
              {product.name}
            </h3>
            {variants.length > 0 && (
              <p className="text-[11px] md:text-xs landscape:text-[11px] text-slate-500 font-medium">
                {variants.length} varian
              </p>
            )}
          </div>
          <button className="ml-3 bg-orange-500 hover:bg-orange-600 text-white w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
      
      {/* Modal Variant Selector */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full md:max-w-lg landscape:max-w-3xl md:rounded-2xl rounded-t-2xl max-h-[calc(100vh-80px)] md:max-h-[92vh] landscape:max-h-[95vh] flex flex-col shadow-xl mb-16 md:mb-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-5 landscape:p-4 border-b border-slate-200">
              <div className="flex-1 min-w-0">
                <h2 className="text-base md:text-lg landscape:text-base font-bold text-slate-900 truncate">
                  {product.name}
                </h2>
                <p className="text-xs md:text-sm landscape:text-xs text-slate-500 mt-0.5 font-medium">
                  Pilih varian
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="ml-3 w-9 h-9 md:w-10 md:h-10 landscape:w-9 landscape:h-9 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            {/* Search Box */}
            <div className="px-4 md:px-5 landscape:px-4 pt-4 md:pt-4 landscape:pt-3 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="text"
                  placeholder="Cari varian..."
                  value={searchVariant}
                  onChange={(e) => setSearchVariant(e.target.value)}
                  className="w-full pl-10 md:pl-11 pr-4 py-2 md:py-2.5 landscape:py-2 border-2 border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg outline-none text-sm md:text-base landscape:text-sm bg-white text-gray-900 placeholder-gray-400 transition-all"
                />
                {searchVariant && (
                  <button
                    onClick={() => setSearchVariant('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {variants.length > 0 && (
                <p className="text-xs text-gray-500 mt-1.5 ml-1">
                  {filteredVariants.length} dari {variants.length} varian
                </p>
              )}
            </div>
            
            {/* Variants List - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 md:px-5 landscape:px-4 pb-4 md:pb-5 landscape:pb-4 min-h-0 custom-scrollbar" style={{WebkitOverflowScrolling: 'touch'}}>
              {filteredVariants.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <div className="text-4xl md:text-5xl mb-3">🔍</div>
                  <p className="text-gray-500 text-sm md:text-base">
                    {searchVariant ? 'Varian tidak ditemukan' : 'Tidak ada varian tersedia'}
                  </p>
                  {searchVariant && (
                    <button
                      onClick={() => setSearchVariant('')}
                      className="mt-3 text-orange-500 hover:text-orange-600 text-sm font-medium"
                    >
                      Hapus pencarian
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2 landscape:space-y-2">
                  {filteredVariants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`w-full text-left p-3 md:p-3.5 landscape:p-3 rounded-lg border transition-all ${
                      selectedVariantId === variant.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm md:text-base landscape:text-sm text-slate-900">
                          {variant.variant_name}
                        </div>
                        <div className={`text-base md:text-lg landscape:text-base font-bold mt-0.5 ${
                          selectedVariantId === variant.id ? 'text-orange-600' : 'text-slate-900'
                        }`}>
                          {formatCurrency(variant.base_price)}
                        </div>
                      </div>
                      {selectedVariantId === variant.id && (
                        <div className="ml-3 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              )}
            </div>
            
            {/* Quantity & Notes */}
            <div className="border-t border-slate-200 p-4 md:p-5 landscape:p-4 space-y-3 md:space-y-3 landscape:space-y-2.5 bg-slate-50 flex-shrink-0">
              {/* Quantity */}
              <div>
                <label className="block text-xs md:text-sm font-semibold text-slate-900 mb-2">
                  Jumlah
                </label>
                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 md:w-11 md:h-11 landscape:w-10 landscape:h-10 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-base transition-colors flex-shrink-0"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 h-10 md:h-11 landscape:h-10 text-center text-base md:text-lg landscape:text-base font-bold border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg outline-none bg-white text-slate-900"
                  />
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 md:w-11 md:h-11 landscape:w-10 landscape:h-10 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-base transition-colors flex-shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Notes */}
              <div>
                <label className="block text-xs md:text-sm font-semibold text-slate-900 mb-2">
                  Catatan (opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Misal: tidak terlalu manis"
                  className="w-full px-3 py-2.5 md:py-2.5 landscape:py-2.5 border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg outline-none text-sm md:text-base landscape:text-sm bg-white text-slate-900 placeholder-slate-400"
                />
              </div>
              
              {/* Total & Add Button */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-3 p-3 md:p-3.5 landscape:p-3 bg-orange-50 rounded-lg">
                  <span className="text-xs md:text-sm font-semibold text-slate-900">
                    Total
                  </span>
                  <span className="text-lg md:text-xl landscape:text-lg font-bold text-orange-600">
                    {totalPrice === 0 ? 'Rp 0' : formatCurrency(totalPrice)}
                  </span>
                </div>
                <button
                  onClick={handleAdd}
                  disabled={variants.length > 0 && !selectedVariantId}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white py-3 md:py-3.5 landscape:py-3 rounded-lg font-semibold text-sm md:text-base landscape:text-sm transition-all active:scale-95 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {variants.length > 0 && !selectedVariantId ? 'Pilih varian dulu' : 'Tambah ke Keranjang'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
