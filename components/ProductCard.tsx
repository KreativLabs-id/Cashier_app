'use client';

import { useState } from 'react';
import type { Product, Topping } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  toppings: Topping[];
  onAddToCart: (product: Product, selectedToppings: Topping[], qty: number) => void;
}

export default function ProductCard({ product, toppings, onAddToCart }: ProductCardProps) {
  const [showToppings, setShowToppings] = useState(false);
  const [selectedToppingIds, setSelectedToppingIds] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  
  const toggleTopping = (toppingId: string) => {
    setSelectedToppingIds(prev =>
      prev.includes(toppingId)
        ? prev.filter(id => id !== toppingId)
        : [...prev, toppingId]
    );
  };
  
  const handleAddToCart = () => {
    const selectedToppings = toppings.filter(t => selectedToppingIds.includes(t.id));
    onAddToCart(product, selectedToppings, qty);
    
    // Reset
    setShowToppings(false);
    setSelectedToppingIds([]);
    setQty(1);
  };
  
  const calculateTotal = () => {
    const toppingTotal = toppings
      .filter(t => selectedToppingIds.includes(t.id))
      .reduce((sum, t) => sum + t.price, 0);
    return (product.base_price + toppingTotal) * qty;
  };
  
  if (showToppings) {
    return (
      <div className="bg-white border-2 border-orange-500 rounded-xl p-4 md:p-5 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="mb-3 md:mb-4">
          <h3 className="font-bold text-lg md:text-xl">{product.name}</h3>
          <p className="text-sm md:text-base text-gray-600 font-medium">{formatCurrency(product.base_price)}</p>
        </div>
        
        {/* Quantity */}
        <div className="mb-3 md:mb-4">
          <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Jumlah</label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-lg flex items-center justify-center font-bold text-lg transition-colors"
            >
              -
            </button>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 md:w-20 text-center border-2 border-gray-300 rounded-lg px-2 py-2 font-bold text-lg focus:border-orange-500 focus:outline-none"
            />
            <button
              onClick={() => setQty(qty + 1)}
              className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-lg flex items-center justify-center font-bold text-lg transition-colors"
            >
              +
            </button>
          </div>
        </div>
        
        {/* Toppings */}
        <div className="mb-4">
          <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Pilih Topping</label>
          <div className="space-y-2 max-h-48 md:max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {toppings.map(topping => (
              <button
                key={topping.id}
                onClick={() => toggleTopping(topping.id)}
                className={`w-full flex items-center justify-between p-3 md:p-3.5 rounded-lg border-2 transition-all active:scale-95 ${
                  selectedToppingIds.includes(topping.id)
                    ? 'border-orange-500 bg-orange-50 shadow-md'
                    : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm md:text-base font-semibold">{topping.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm md:text-base text-gray-600 font-medium">{formatCurrency(topping.price)}</span>
                  {selectedToppingIds.includes(topping.id) && (
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Total & Actions */}
        <div className="border-t-2 border-dashed pt-3 md:pt-4 mt-3 md:mt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-base md:text-lg text-gray-700">Total:</span>
            <span className="font-bold text-xl md:text-2xl text-orange-500">
              {formatCurrency(calculateTotal())}
            </span>
          </div>
          
          <div className="flex space-x-2 md:space-x-3">
            <button
              onClick={() => {
                setShowToppings(false);
                setSelectedToppingIds([]);
                setQty(1);
              }}
              className="flex-1 px-4 py-2.5 md:py-3 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-lg font-semibold transition-colors text-sm md:text-base"
            >
              Batal
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 px-4 py-2.5 md:py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 active:scale-95 text-white rounded-lg font-semibold shadow-lg transition-all text-sm md:text-base"
            >
              + Tambah
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <button
      onClick={() => setShowToppings(true)}
      className="group bg-white border-2 border-gray-200 hover:border-orange-500 rounded-xl p-4 md:p-5 shadow-md hover:shadow-xl transition-all text-left w-full transform hover:-translate-y-1 active:translate-y-0"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-bold text-base md:text-lg lg:text-xl mb-1.5 group-hover:text-orange-600 transition-colors line-clamp-2">{product.name}</h3>
          <p className="text-orange-500 font-bold text-lg md:text-xl">{formatCurrency(product.base_price)}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full p-2 md:p-2.5 group-hover:scale-110 transition-transform shadow-lg">
          <Plus className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </div>
    </button>
  );
}
