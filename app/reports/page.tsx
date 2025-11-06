'use client';

import { useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';
import { Calendar, Download, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react';

interface DailyReport {
  date: string;
  order_count: number;
  total_revenue: number;
  avg_order_value: number;
  by_payment: {
    cash: number;
    qris: number;
    ewallet: number;
  };
  top_products: Array<{
    product_id: string;
    product_name: string;
    qty: number;
    revenue: number;
  }>;
  top_toppings: Array<{
    topping_id: string;
    topping_name: string;
    times_used: number;
    revenue: number;
  }>;
}

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(false);
  
  const loadReport = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reports/daily?date=${selectedDate}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }
      
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error('Error loading report:', error);
      alert('Gagal memuat laporan');
    } finally {
      setLoading(false);
    }
  };
  
  const exportToCSV = () => {
    if (!report) return;
    
    let csv = 'Laporan Harian,\n';
    csv += `Tanggal,${report.date}\n\n`;
    csv += 'Ringkasan,\n';
    csv += `Total Order,${report.order_count}\n`;
    csv += `Total Omzet,${report.total_revenue}\n`;
    csv += `Rata-rata Order,${report.avg_order_value}\n\n`;
    csv += 'Pembayaran,\n';
    csv += `Tunai,${report.by_payment.cash}\n`;
    csv += `QRIS,${report.by_payment.qris}\n`;
    csv += `E-Wallet,${report.by_payment.ewallet}\n\n`;
    csv += 'Produk Terlaris,\n';
    csv += 'Nama,Qty,Omzet\n';
    report.top_products.forEach(p => {
      csv += `${p.product_name},${p.qty},${p.revenue}\n`;
    });
    csv += '\nTopping Terlaris,\n';
    csv += 'Nama,Digunakan,Omzet\n';
    report.top_toppings.forEach(t => {
      csv += `${t.topping_name},${t.times_used},${t.revenue}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-${report.date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 md:p-6 sticky top-0 z-40 shadow-xl">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">📊 Laporan Harian</h1>
          
          {/* Date Picker */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <div className="flex-1 relative">
              <Calendar className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 rounded-xl text-gray-800 font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm md:text-base"
              />
            </div>
            <button
              onClick={loadReport}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 active:bg-white/40 disabled:bg-white/10 px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold transition-all disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm md:text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                '🔍 Lihat Laporan'
              )}
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-3 md:px-6 py-4 md:py-6 space-y-4 md:space-y-5">
        {!report ? (
          <div className="text-center py-16 md:py-24">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md mx-auto">
              <Calendar className="w-20 h-20 md:w-24 md:h-24 text-orange-300 mx-auto mb-6" />
              <p className="text-gray-500 text-base md:text-lg">Pilih tanggal dan klik <span className="font-bold text-orange-500">"Lihat Laporan"</span> untuk menampilkan data</p>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
                  <span className="text-3xl">📦</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-1">{report.order_count}</div>
                <div className="text-sm md:text-base opacity-90 font-medium">Total Order</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
                  <span className="text-3xl">💰</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1">{formatCurrency(report.total_revenue)}</div>
                <div className="text-sm md:text-base opacity-90 font-medium">Total Omzet</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
                  <span className="text-3xl">📊</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1">{formatCurrency(report.avg_order_value)}</div>
                <div className="text-sm md:text-base opacity-90 font-medium">Rata-rata per Order</div>
              </div>
            </div>
            
            {/* Payment Breakdown */}
            <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg">
              <h2 className="font-bold text-lg md:text-xl mb-4 text-gray-800 flex items-center">
                <span className="text-2xl mr-2">💳</span>
                Metode Pembayaran
              </h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center p-3 md:p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <span className="text-gray-700 font-semibold text-sm md:text-base">💵 Tunai</span>
                  <span className="font-bold text-green-600 text-base md:text-lg">{formatCurrency(report.by_payment.cash)}</span>
                </div>
                <div className="flex justify-between items-center p-3 md:p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <span className="text-gray-700 font-semibold text-sm md:text-base">📱 QRIS</span>
                  <span className="font-bold text-blue-600 text-base md:text-lg">{formatCurrency(report.by_payment.qris)}</span>
                </div>
                <div className="flex justify-between items-center p-3 md:p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <span className="text-gray-700 font-semibold text-sm md:text-base">💳 E-Wallet</span>
                  <span className="font-bold text-purple-600 text-base md:text-lg">{formatCurrency(report.by_payment.ewallet)}</span>
                </div>
              </div>
              
              {/* Payment Chart */}
              <div className="mt-5 h-3 bg-gray-200 rounded-full overflow-hidden flex shadow-inner">
                {report.total_revenue > 0 && (
                  <>
                    {report.by_payment.cash > 0 && (
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-500 transition-all"
                        style={{ width: `${(report.by_payment.cash / report.total_revenue) * 100}%` }}
                        title={`Tunai: ${Math.round((report.by_payment.cash / report.total_revenue) * 100)}%`}
                      ></div>
                    )}
                    {report.by_payment.qris > 0 && (
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-500 transition-all"
                        style={{ width: `${(report.by_payment.qris / report.total_revenue) * 100}%` }}
                        title={`QRIS: ${Math.round((report.by_payment.qris / report.total_revenue) * 100)}%`}
                      ></div>
                    )}
                    {report.by_payment.ewallet > 0 && (
                      <div
                        className="bg-gradient-to-r from-purple-400 to-purple-500 transition-all"
                        style={{ width: `${(report.by_payment.ewallet / report.total_revenue) * 100}%` }}
                        title={`E-Wallet: ${Math.round((report.by_payment.ewallet / report.total_revenue) * 100)}%`}
                      ></div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {/* Top Products */}
            <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg">
              <h2 className="font-bold text-lg md:text-xl mb-4 text-gray-800 flex items-center">
                <span className="text-2xl mr-2">🏆</span>
                Produk Terlaris
              </h2>
              {report.top_products.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm md:text-base">Belum ada data produk</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {report.top_products.map((product, index) => (
                    <div key={product.product_id} className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-xl hover:from-orange-100 transition-all transform hover:scale-[1.02]">
                      <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                        <div className={`w-10 h-10 md:w-12 md:h-12 ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                          index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                          'bg-gradient-to-br from-orange-500 to-orange-600'
                        } text-white rounded-xl flex items-center justify-center font-bold text-lg md:text-xl shadow-md`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm md:text-base text-gray-800 truncate">{product.product_name}</div>
                          <div className="text-xs md:text-sm text-gray-600 font-medium">{product.qty} pcs terjual</div>
                        </div>
                      </div>
                      <div className="font-bold text-orange-500 text-base md:text-lg ml-2">
                        {formatCurrency(product.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Top Toppings */}
            <div className="bg-white rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg">
              <h2 className="font-bold text-lg md:text-xl mb-4 text-gray-800 flex items-center">
                <span className="text-2xl mr-2">⭐</span>
                Topping Terlaris
              </h2>
              {report.top_toppings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm md:text-base">Belum ada data topping</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {report.top_toppings.map((topping, index) => (
                    <div key={topping.topping_id} className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-green-50 to-transparent rounded-xl hover:from-green-100 transition-all transform hover:scale-[1.02]">
                      <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                        <div className={`w-10 h-10 md:w-12 md:h-12 ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                          index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                          'bg-gradient-to-br from-green-500 to-green-600'
                        } text-white rounded-xl flex items-center justify-center font-bold text-lg md:text-xl shadow-md`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm md:text-base text-gray-800 truncate">{topping.topping_name}</div>
                          <div className="text-xs md:text-sm text-gray-600 font-medium">{topping.times_used}x digunakan</div>
                        </div>
                      </div>
                      <div className="font-bold text-green-500 text-base md:text-lg ml-2">
                        {formatCurrency(topping.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5 md:w-6 md:h-6" />
              <span>📥 Export Laporan ke CSV</span>
            </button>
          </>
        )}
      </main>
      
      <BottomNav />
    </div>
  );
}
