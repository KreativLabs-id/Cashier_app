'use client';

import { useState } from 'react';
import { getBluetoothPrinter } from '@/lib/bluetoothPrinter';
import { Bluetooth, Check, X, Printer } from 'lucide-react';

export default function PrinterTestPage() {
  const [connected, setConnected] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState('');

  const handleConnect = async () => {
    setTesting(true);
    setMessage('Mencari printer Bluetooth...');
    
    try {
      const printer = getBluetoothPrinter();
      const success = await printer.connect();
      
      if (success) {
        setConnected(true);
        setMessage('✅ Berhasil terhubung ke printer!');
      } else {
        throw new Error('Gagal connect');
      }
    } catch (error: any) {
      setConnected(false);
      if (error.message?.includes('cancelled')) {
        setMessage('❌ Koneksi dibatalkan');
      } else {
        setMessage('❌ Gagal terhubung ke printer');
      }
    } finally {
      setTesting(false);
    }
  };

  const handleTestPrint = async () => {
    setTesting(true);
    setMessage('Mencetak test...');
    
    try {
      const printer = getBluetoothPrinter();
      
      // Test receipt data
      const testOrder = {
        order_no: 'TEST-001',
        order_time: new Date().toISOString(),
        subtotal: 50000,
        discount_amount: 0,
        extra_fee: 0,
        total: 50000,
        pay_method: 'cash',
        paid_amount: 50000,
        change_amount: 0
      };
      
      const testItems = [
        {
          id: 1,
          qty: 1,
          products: { name: 'Test Product' },
          variant_name: 'Test Variant',
          unit_price: 50000,
          notes: 'Test notes'
        }
      ];
      
      const success = await printer.printReceipt(testOrder, testItems);
      
      if (success) {
        setMessage('✅ Test print berhasil!');
      } else {
        throw new Error('Print failed');
      }
    } catch (error) {
      setMessage('❌ Test print gagal');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mt-10">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Printer className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Test Printer Bluetooth</h1>
          <p className="text-sm text-slate-600">Pastikan printer Bluetooth sudah ON dan dalam jangkauan</p>
        </div>

        <div className="space-y-4">
          {/* Connection Status */}
          <div className={`p-4 rounded-lg border-2 ${connected ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Status Koneksi</span>
              {connected ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">Terhubung</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-slate-400">
                  <X className="w-5 h-5" />
                  <span className="font-semibold">Belum terhubung</span>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-slate-700">{message}</p>
            </div>
          )}

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            disabled={testing || connected}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Bluetooth className="w-5 h-5" />
            <span>{testing ? 'Menghubungkan...' : connected ? 'Sudah Terhubung' : 'Hubungkan Printer'}</span>
          </button>

          {/* Test Print Button */}
          <button
            onClick={handleTestPrint}
            disabled={testing || !connected}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="w-5 h-5" />
            <span>{testing ? 'Mencetak...' : 'Test Cetak Struk'}</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-semibold text-amber-900 mb-2">📋 Panduan:</h3>
          <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
            <li>Nyalakan printer Bluetooth</li>
            <li>Pastikan printer dalam jangkauan (max 10m)</li>
            <li>Klik &quot;Hubungkan Printer&quot;</li>
            <li>Pilih printer dari daftar yang muncul</li>
            <li>Klik &quot;Test Cetak Struk&quot; untuk tes</li>
          </ol>
        </div>

        {/* Supported Printers */}
        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold text-slate-700 mb-2 text-sm">✅ Printer yang Didukung:</h3>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Printer thermal 58mm/80mm dengan Bluetooth</li>
            <li>• Mendukung ESC/POS commands</li>
            <li>• Contoh: Zjiang, EPPOS, BlueBamboo, dll</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
