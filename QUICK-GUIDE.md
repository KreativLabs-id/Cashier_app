# 📖 PANDUAN CEPAT - Aplikasi Kasir Martabak

## 🎯 Quick Start

### Pertama Kali Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Supabase** (ikuti `SETUP.md`)
   - Buat project di supabase.com
   - Import `supabase-schema.sql`
   - Copy credentials ke `.env.local`

3. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```
   
   Atau double-click `start.bat` (Windows)

4. **Buka Browser**
   ```
   http://localhost:3000
   ```

---

## 💼 Cara Pakai (SOP Kasir)

### 1️⃣ Input Order Baru

```
POS → Pilih Produk → Pilih Topping → Set Qty → Tambah
```

**Contoh:**
- Klik "Terang Bulan Tebal"
- Pilih topping: ☑️ Keju, ☑️ Coklat
- Qty: 2
- Klik "Tambah"

**Tips:**
- Bisa tambah multiple produk sebelum checkout
- Topping bisa lebih dari 1
- Qty bisa langsung diketik

---

### 2️⃣ Checkout & Bayar

```
Cart → Review → Set Diskon (optional) → Pilih Metode Bayar → Input Dibayar → Bayar
```

**Contoh Skenario:**

**A. Pembayaran Normal (Tunai)**
1. Buka Cart (icon keranjang)
2. Total: Rp 72.000
3. Pilih: 💵 Tunai
4. Dibayar: 100.000
5. Kembalian: Rp 28.000 (otomatis)
6. Klik "Bayar & Cetak Struk"

**B. Ada Diskon**
1. Klik "Diskon"
2. Pilih: Nominal / Persen
3. Input: 10000 atau 10%
4. Klik "Terapkan"
5. Total berkurang otomatis

**C. Ada Biaya Tambahan**
1. Input "Biaya Tambahan": 2000 (kantong, ongkir, dll)
2. Total bertambah otomatis

---

### 3️⃣ Struk

```
Auto redirect → Share WA / Print / Kembali POS
```

**Opsi:**
- **Share ke WhatsApp:** Kirim struk ke customer
- **Cetak Struk:** Print thermal (jika ada printer)
- **Kembali ke POS:** Order baru

---

### 4️⃣ Laporan Harian

```
Laporan → Pilih Tanggal → Lihat → Export CSV (optional)
```

**Info yang Ditampilkan:**
- 📊 Total Order
- 💰 Total Omzet
- 📈 Rata-rata Order
- 💳 Breakdown Metode Bayar
- 🏆 Produk Terlaris (Top 5)
- ⭐ Topping Terlaris (Top 5)

**Export CSV:**
- Klik "Export ke CSV"
- File download otomatis
- Bisa dibuka di Excel
- Untuk backup atau analisis

---

## ⚙️ Fitur-Fitur Penting

### Diskon

**Tipe Diskon:**
1. **Nominal (Rp):** Diskon flat
   - Contoh: Rp 5.000 off
   
2. **Persentase (%):** Diskon persen
   - Contoh: 10% off
   - Total Rp 50.000 → Diskon Rp 5.000

**Cara Pakai:**
1. Di Cart, klik "Diskon"
2. Pilih tipe
3. Input nilai
4. Klik "Terapkan"

### Biaya Tambahan

**Untuk:**
- Kantong plastik
- Ongkir
- Service charge
- Dll

**Cara Pakai:**
1. Di Cart, input di field "Biaya Tambahan"
2. Total otomatis update

### Metode Pembayaran

**3 Pilihan:**
- 💵 **Tunai:** Cash
- 📱 **QRIS:** Scan QR
- 💳 **E-Wallet:** GoPay, OVO, Dana, dll

**Fungsi:**
- Untuk tracking di laporan
- Breakdown metode bayar

---

## 🔥 Shortcut & Tips

### Keyboard Shortcuts (Desktop)

- `Tab` → Pindah field
- `Enter` → Submit form
- `Ctrl+P` → Print (di halaman struk)
- `F5` → Refresh (kalau lag)

### Mobile Tips

- **Fullscreen Mode:** Install PWA (Add to Home Screen)
- **Quick Add:** Tap produk → langsung muncul modal topping
- **Fast Checkout:** Semua di 1 halaman, scroll smooth

### Alur Cepat (Speed Run)

**Order Simple (tanpa topping):**
```
Tap Produk → Qty → Tambah → Cart → Metode Bayar → Input Dibayar → Bayar
```
**⏱️ ± 10 detik**

**Order dengan Topping:**
```
Tap Produk → Pilih Topping → Qty → Tambah → Cart → Bayar → Done
```
**⏱️ ± 15-20 detik**

---

## ❗ Troubleshooting Cepat

### Aplikasi Lemot
✅ Refresh browser (F5)
✅ Clear cache
✅ Cek koneksi internet

### Struk Tidak Bisa Print
✅ Cek printer nyala
✅ Coba Share WA dulu (backup)
✅ Screenshot struk

### Data Order Hilang
✅ Cek tab "Laporan" → cari berdasarkan tanggal
✅ Supabase nyimpen semua data
✅ Export CSV untuk backup

### Koneksi Supabase Error
✅ Cek internet
✅ Cek Supabase dashboard (masih aktif?)
✅ Verifikasi credentials di `.env.local`

---

## 📊 Laporan: Cara Baca

### Card Omzet
```
Total Order: 25        ← Jumlah transaksi
Total Omzet: Rp 750K   ← Total pemasukan
Rata-rata: Rp 30K      ← Per order
```

### Breakdown Payment
```
Tunai:    Rp 500K (67%)  ← Paling banyak
QRIS:     Rp 150K (20%)
E-Wallet: Rp 100K (13%)
```

### Top Products
```
1. Terang Bulan Tebal   15 pcs   Rp 450K
2. Martabak Telur       8 pcs    Rp 224K
3. Terang Bulan Tipis   5 pcs    Rp 125K
```

**Insight:** 
- Terang Bulan Tebal = Best seller
- Stock prioritas

### Top Toppings
```
1. Keju      12x   Rp 72K
2. Coklat    10x   Rp 50K
3. Mix       5x    Rp 45K
```

**Insight:**
- Keju paling laris
- Stock keju harus cukup

---

## 🎓 FAQ

**Q: Bisa edit harga produk?**
A: Ya, via Supabase → Table Editor → products → edit `base_price`

**Q: Bisa tambah produk baru?**
A: Ya, via Supabase → Insert row baru di table `products`

**Q: Data order bisa dihapus?**
A: Sebaiknya jangan. Buat laporan akurat. Kalau perlu, disable produk saja.

**Q: Limit berapa order per hari?**
A: Unlimited (selama Supabase storage cukup)

**Q: Offline bisa?**
A: Butuh koneksi untuk save order. Browser cache sebagian UI.

**Q: Multi-kasir bisa?**
A: Bisa! Buka di beberapa HP, data sync real-time.

**Q: Printer thermal support?**
A: Ya, via browser print. Set ukuran 58mm di print settings.

---

## 📞 Support

**Butuh bantuan?**
- Cek file `SETUP.md` untuk setup detail
- Cek file `DEPLOYMENT-CHECKLIST.md` untuk deploy
- Cek console browser (F12) untuk error

---

**Version:** 1.0  
**Last Updated:** November 2025  
**Created with ❤️ for UMKM Indonesia**
