'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, LogOut } from 'lucide-react';
import AdminBottomNav from '@/components/AdminBottomNav';

interface Product {
  id: string;
  name: string;
  base_price: number;
  is_active: boolean;
  product_variants: Array<{
    id: string;
    variant_name: string;
    base_price: number;
  }>;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    checkAuth();
    fetchProducts();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      if (data.user.role !== 'admin') {
        router.push('/');
        return;
      }
      setUser(data.user);
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
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

  const handleDelete = async (productId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Produk berhasil dihapus');
        fetchProducts();
      } else {
        alert('Gagal menghapus produk');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Terjadi kesalahan');
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-xs md:text-sm text-gray-600">
                Welcome, {user?.name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 text-xs md:text-base bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={16} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-8 mb-4">
        <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Manajemen Menu
          </h2>
          <button
            onClick={openAddModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 md:py-2.5 text-sm md:text-base bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={18} className="md:w-5 md:h-5" />
            Tambah Menu
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md p-4 md:p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-sm md:text-base font-semibold text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Base: Rp {product.base_price.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(product)}
                    className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={16} className="md:w-[18px] md:h-[18px]" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                  </button>
                </div>
              </div>

              <div className="border-t pt-3 md:pt-4">
                <p className="text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Varian ({product.product_variants.length}):
                </p>
                <div className="max-h-28 md:max-h-32 overflow-y-auto space-y-1">
                  {product.product_variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="text-[11px] md:text-xs text-gray-600 flex justify-between gap-2"
                    >
                      <span className="truncate flex-1">{variant.variant_name}</span>
                      <span className="flex-shrink-0 font-medium">Rp {variant.base_price.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 md:py-16 text-gray-500">
            <p className="text-sm md:text-base">Belum ada produk. Klik &quot;Tambah Menu&quot; untuk menambahkan produk baru.</p>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchProducts();
          }}
        />
      )}

      {/* Admin Bottom Navigation */}
      <AdminBottomNav />
    </div>
  );
}

// Product Modal Component
function ProductModal({
  product,
  onClose,
  onSuccess,
}: {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    id: product?.id || '',
    name: product?.name || '',
    base_price: product?.base_price || 0,
    variants: product?.product_variants || [],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = product
        ? `/api/products/${product.id}`
        : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(product ? 'Produk berhasil diupdate' : 'Produk berhasil ditambahkan');
        onSuccess();
      } else {
        const data = await response.json();
        alert(data.error || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    // Tambah varian baru di akhir array (bawah)
    const newVariants = [...formData.variants, { id: '', variant_name: '', base_price: 0 }];
    setFormData({
      ...formData,
      variants: newVariants,
    });
  };

  const removeVariant = (index: number) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            {product ? 'Edit Produk' : 'Tambah Produk'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
              ID Produk
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="prd_example"
              required
              disabled={!!product}
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
              Nama Produk
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Nama produk"
              required
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
              Harga Dasar
            </label>
            <input
              type="number"
              value={formData.base_price}
              onChange={(e) =>
                setFormData({ ...formData, base_price: parseInt(e.target.value) })
              }
              className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="15000"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 md:mb-3">
              <label className="block text-xs md:text-sm font-medium text-gray-700">
                Varian
              </label>
              <button
                type="button"
                onClick={addVariant}
                className="text-xs md:text-sm text-orange-600 hover:text-orange-700 font-medium px-2 py-1 hover:bg-orange-50 rounded transition-colors"
              >
                + Tambah Varian
              </button>
            </div>

            <div className="space-y-2 md:space-y-3 max-h-60 md:max-h-80 overflow-y-auto pr-1">
              {formData.variants.map((variant, index) => (
                <div key={index} className="flex gap-2 items-start bg-gray-50 p-2 rounded-lg">
                  <input
                    type="text"
                    value={variant.variant_name}
                    onChange={(e) =>
                      updateVariant(index, 'variant_name', e.target.value)
                    }
                    className="flex-1 px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Nama varian"
                    required
                  />
                  <input
                    type="number"
                    value={variant.base_price}
                    onChange={(e) =>
                      updateVariant(index, 'base_price', parseInt(e.target.value))
                    }
                    className="w-20 md:w-28 px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Harga"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="p-1.5 md:p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                  </button>
                </div>
              ))}
              {formData.variants.length === 0 && (
                <p className="text-xs md:text-sm text-gray-500 text-center py-4">
                  Belum ada varian. Klik &quot;+ Tambah Varian&quot; untuk menambahkan.
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 md:gap-3 pt-4 border-t sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
