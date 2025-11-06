'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';
import { generateDailyReportPDF, downloadPDF, openPDFInNewTab } from '@/lib/pdfGenerator';
import AdminBottomNav from '@/components/AdminBottomNav';
import { Calendar, Download, TrendingUp, ShoppingBag, DollarSign, LogOut, FileText } from 'lucide-react';

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
  top_variants: Array<{
    product_name: string;
    variant_name: string;
    qty: number;
    revenue: number;
  }>;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuth();
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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
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
  
  const exportToPDF = () => {
    if (!report) return;
    
    try {
      const pdf = generateDailyReportPDF(report);
      downloadPDF(pdf, `Laporan-${report.date}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal membuat PDF');
    }
  };

  const previewPDF = () => {
    if (!report) return;
    
    try {
      const pdf = generateDailyReportPDF(report);
      openPDFInNewTab(pdf);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal membuat PDF');
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
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 md:p-6 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <div>
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900">Laporan Harian</h1>
              {user && (
                <p className="text-xs md:text-sm text-slate-600">Admin: {user.name}</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 text-xs md:text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
          
          {/* Date Picker */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-2.5">
            <div className="flex-1 relative">
              <Calendar className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 rounded-lg border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base"
              />
            </div>
            <button
              onClick={loadReport}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold transition-all disabled:cursor-not-allowed text-sm md:text-base"
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
            <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 max-w-md mx-auto">
              <Calendar className="w-16 h-16 md:w-20 md:h-20 text-slate-300 mx-auto mb-6" />
              <p className="text-slate-600 text-sm md:text-base">Pilih tanggal dan klik <span className="font-semibold text-orange-600">&quot;Lihat Laporan&quot;</span> untuk menampilkan data</p>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200 rounded-lg p-5 md:p-6 hover:border-blue-500 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1 text-slate-900">{report.order_count}</div>
                <div className="text-xs md:text-sm text-slate-600 font-medium">Total Order</div>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-lg p-5 md:p-6 hover:border-green-500 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
                <div className="text-xl md:text-2xl font-bold mb-1 text-slate-900">{formatCurrency(report.total_revenue)}</div>
                <div className="text-xs md:text-sm text-slate-600 font-medium">Total Omzet</div>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-lg p-5 md:p-6 hover:border-purple-500 transition-all sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
                <div className="text-xl md:text-2xl font-bold mb-1 text-slate-900">{formatCurrency(report.avg_order_value)}</div>
                <div className="text-xs md:text-sm text-slate-600 font-medium">Rata-rata per Order</div>
              </div>
            </div>
            
            {/* Payment Breakdown */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 md:p-6">
              <h2 className="font-semibold text-base md:text-lg mb-4 text-slate-900">
                Metode Pembayaran
              </h2>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <span className="text-slate-900 font-semibold text-xs md:text-sm">Tunai</span>
                  <span className="font-bold text-green-600 text-sm md:text-base">{formatCurrency(report.by_payment.cash)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <span className="text-slate-900 font-semibold text-xs md:text-sm">QRIS</span>
                  <span className="font-bold text-blue-600 text-sm md:text-base">{formatCurrency(report.by_payment.qris)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <span className="text-slate-900 font-semibold text-xs md:text-sm">E-Wallet</span>
                  <span className="font-bold text-purple-600 text-sm md:text-base">{formatCurrency(report.by_payment.ewallet)}</span>
                </div>
              </div>
              
              {/* Payment Chart */}
              <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden flex">
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
            <div className="bg-white rounded-lg border border-slate-200 p-5 md:p-6">
              <h2 className="font-semibold text-base md:text-lg mb-4 text-slate-900">
                Produk Terlaris
              </h2>
              {report.top_variants && report.top_variants.length > 0 ? (
                <div className="space-y-3">
                  {report.top_variants.map((item, index) => (
                    <div key={`${item.product_name}-${item.variant_name}`} className="flex items-center justify-between p-3 md:p-3.5 bg-slate-50 rounded-lg border border-slate-200 hover:border-orange-500 transition-all">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`w-8 h-8 md:w-9 md:h-9 ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-slate-400' :
                          index === 2 ? 'bg-orange-500' :
                          'bg-slate-300'
                        } text-white rounded-lg flex items-center justify-center font-bold text-sm md:text-base`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-xs md:text-sm text-slate-900 truncate">{item.product_name}</div>
                          <div className="text-[11px] md:text-xs text-orange-600 font-medium">{item.variant_name}</div>
                          <div className="text-[11px] md:text-xs text-slate-600 font-medium">{item.qty} pcs</div>
                        </div>
                      </div>
                      <div className="font-bold text-orange-600 text-sm md:text-base ml-2">
                        {formatCurrency(item.revenue)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm md:text-base">Belum ada data produk</p>
                </div>
              )}
            </div>
            
            {/* Export Buttons */}
            <div className="space-y-3">
              {/* PDF Export - Primary */}
              <button
                onClick={exportToPDF}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 md:py-4 rounded-lg font-semibold text-sm md:text-base transition-all active:scale-95 flex items-center justify-center space-x-2 shadow-lg"
              >
                <FileText className="w-4 h-4 md:w-5 md:h-5" />
                <span>Download Laporan PDF</span>
              </button>

              {/* Preview & CSV - Secondary */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={previewPDF}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 md:py-3 text-sm md:text-base bg-white border-2 border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-all active:scale-95 font-medium"
                >
                  <FileText className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Preview PDF</span>
                  <span className="sm:hidden">Preview</span>
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 md:py-3 text-sm md:text-base bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all active:scale-95 font-medium"
                >
                  <Download className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">CSV</span>
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Admin Bottom Navigation */}
      <AdminBottomNav />
    </div>
  );
}
