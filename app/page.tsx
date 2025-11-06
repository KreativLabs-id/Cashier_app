'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/store/cart';
import type { ProductWithVariants } from '@/types/database';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import { ShoppingBag, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { items } = useCartStore();
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load products dengan variants
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          product_variants (*)
        `)
        .eq('is_active', true)
        .order('name');
      
      if (productsError) throw productsError;
      
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Gagal memuat data. Pastikan koneksi Supabase sudah benar.');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const cartItemCount = items.reduce((sum: number, item: any) => sum + item.qty, 0);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 md:p-6 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Martabak & Terang Bulan Tip Top</h1>
              <p className="text-sm md:text-base text-orange-100">Cashier App</p>
            </div>
            <button
              onClick={() => router.push('/cart')}
              className="relative bg-white/20 hover:bg-white/30 rounded-full p-3 md:p-4 transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-6 h-6 md:w-7 md:h-7" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[24px] h-6 px-1.5 flex items-center justify-center shadow-lg animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-md text-base md:text-lg"
            />
          </div>
        </div>
      </header>
      
      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 md:py-24">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-md mx-auto">
              <div className="text-6xl md:text-7xl mb-4">🔍</div>
              <p className="text-gray-500 text-base md:text-lg">
                {searchQuery ? 'Produk tidak ditemukan' : 'Belum ada produk tersedia'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Bar - Desktop/Tablet Only */}
            <div className="hidden md:flex items-center justify-between mb-6 bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
                <span className="font-medium">{filteredProducts.length} Produk Tersedia</span>
              </div>
              {cartItemCount > 0 && (
                <div className="flex items-center space-x-2 text-orange-600 font-semibold">
                  <span>{cartItemCount} item di keranjang</span>
                </div>
              )}
            </div>

            {/* Products Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 md:gap-4 lg:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
}
