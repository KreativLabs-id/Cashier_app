'use client';

import { useEffect, useState } from 'react';
import type { ProductWithVariants } from '@/types/database';
import ProductCard from '@/components/ProductCard';
import BottomNav from '@/components/BottomNav';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
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
      setUser(data.user);
    } catch (error) {
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load products dengan variants dari API
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Gagal memuat data. Pastikan koneksi database sudah benar.');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
    <div className="min-h-screen bg-slate-50 pb-20 landscape:pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 md:p-6 landscape:p-4 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900">Martabak & Terang Bulan Tip Top</h1>
            {user && (
              <p className="text-xs md:text-sm text-slate-600">Kasir: {user.name}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>
      
      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-6 landscape:py-2">
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
            <div className="hidden md:flex items-center justify-between mb-5 bg-white rounded-lg border border-slate-200 p-3.5">
              <div className="flex items-center space-x-2 text-slate-600">
                <span className="text-sm font-medium">{filteredProducts.length} Produk</span>
              </div>
            </div>

            {/* Products Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 landscape:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-3.5 landscape:gap-3">
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
