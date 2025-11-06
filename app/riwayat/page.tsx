'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';
import { Receipt, Clock, CreditCard, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface OrderItem {
  id: string;
  product_id: string;
  variant_name: string | null;
  qty: number;
  unit_price: number;
  notes: string | null;
}

interface Order {
  id: string;
  order_no: string;
  order_time: string;
  subtotal: number;
  discount_amount: number;
  extra_fee: number;
  total: number;
  paid_amount: number;
  change_amount: number;
  pay_method: string;
  notes: string | null;
  items: OrderItem[];
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function RiwayatPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchOrders();
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

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/today');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
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

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Tunai';
      case 'qris':
        return 'QRIS';
      case 'ewallet':
        return 'E-Wallet';
      default:
        return method;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash':
        return 'bg-green-100 text-green-700';
      case 'qris':
        return 'bg-blue-100 text-blue-700';
      case 'ewallet':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat riwayat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 md:p-6 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900">
              Riwayat Pembelian
            </h1>
            {user && (
              <p className="text-xs md:text-sm text-slate-600">
                Kasir: {user.name} • Hari Ini
              </p>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6">
        {orders.length === 0 ? (
          <div className="text-center py-16 md:py-24">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-md mx-auto">
              <Receipt className="w-16 h-16 md:w-20 md:h-20 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
                Belum Ada Transaksi
              </h3>
              <p className="text-slate-600 text-sm md:text-base">
                Belum ada transaksi hari ini
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => router.push(`/receipt/${order.id}`)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border border-slate-200 hover:border-orange-300"
              >
                <div className="p-4 md:p-5">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Receipt className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                        <h3 className="text-sm md:text-base font-bold text-slate-900">
                          {order.order_no}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span>
                          {format(new Date(order.order_time), 'HH:mm', { locale: id })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg md:text-xl font-bold text-orange-600">
                        {formatCurrency(order.total)}
                      </div>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-[10px] md:text-xs font-medium ${getPaymentMethodColor(
                          order.pay_method
                        )}`}
                      >
                        {getPaymentMethodLabel(order.pay_method)}
                      </span>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="border-t pt-3 mt-3">
                    <div className="space-y-1.5">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-xs md:text-sm text-slate-700"
                        >
                          <span className="flex-1 truncate">
                            {item.qty}x {item.product_id}
                            {item.variant_name && (
                              <span className="text-slate-500"> • {item.variant_name}</span>
                            )}
                          </span>
                          <span className="font-medium ml-2">
                            {formatCurrency(item.unit_price * item.qty)}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-xs text-slate-500 italic">
                          +{order.items.length - 3} item lainnya
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-3 pt-3 border-t flex justify-between items-center">
                    <span className="text-xs md:text-sm text-slate-600">
                      {order.items.reduce((sum, item) => sum + item.qty, 0)} item
                    </span>
                    <span className="text-xs md:text-sm text-orange-600 font-medium">
                      Lihat Struk →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {orders.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-4 md:p-5 border border-slate-200">
            <h3 className="text-sm md:text-base font-semibold text-slate-900 mb-3">
              Ringkasan Hari Ini
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs md:text-sm text-slate-600">Total Transaksi</p>
                <p className="text-lg md:text-2xl font-bold text-slate-900">
                  {orders.length}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-slate-600">Total Penjualan</p>
                <p className="text-lg md:text-2xl font-bold text-orange-600">
                  {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
