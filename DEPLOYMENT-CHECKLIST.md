# ✅ CHECKLIST DEPLOYMENT - Aplikasi Kasir Martabak

## 📋 Pre-Deployment Checklist

### 1. Kustomisasi Konten

- [ ] Ubah nama toko di `app/page.tsx` (line 88-89)
- [ ] Ubah info toko di `app/receipt/[id]/page.tsx` (line 192-194, 341-343)
- [ ] Ubah alamat dan telepon sesuai lokasi toko
- [ ] Update `public/manifest.json` name & short_name

### 2. Menu & Harga

- [ ] Sesuaikan produk di Supabase (Table: products)
- [ ] Sesuaikan topping di Supabase (Table: toppings)
- [ ] Update harga jika perlu
- [ ] Tambah produk baru jika ada varian lain

### 3. PWA Icons

- [ ] Generate icon 192x192px dan 512x512px
- [ ] Upload ke folder `public/`
- [ ] Rename sesuai manifest.json (icon-192.png, icon-512.png)
- [ ] Test icon muncul saat install PWA

### 4. Testing Lokal

- [ ] Test input order dari POS
- [ ] Test pilih topping multiple
- [ ] Test edit qty di cart
- [ ] Test diskon nominal
- [ ] Test diskon persentase
- [ ] Test biaya tambahan
- [ ] Test pembayaran tunai
- [ ] Test pembayaran QRIS
- [ ] Test pembayaran e-wallet
- [ ] Test kembalian otomatis terhitung benar
- [ ] Test struk muncul lengkap
- [ ] Test share WhatsApp
- [ ] Test print struk
- [ ] Test laporan harian
- [ ] Test export CSV
- [ ] Test responsive di HP (Chrome)

### 5. Database

- [ ] Backup schema SQL (sudah ada: supabase-schema.sql)
- [ ] Verifikasi semua table terisi seed data
- [ ] Test function generate_order_no
- [ ] Cek index sudah optimal

### 6. Security

- [ ] Pastikan .env.local TIDAK di-commit ke Git
- [ ] Verifikasi .gitignore sudah include .env*
- [ ] Jangan share Supabase credentials public
- [ ] Enable RLS jika deploy production (opsional)

## 🚀 Deployment ke Vercel

### Persiapan

- [ ] Code sudah di-push ke GitHub
- [ ] Tidak ada error saat build lokal (`npm run build`)
- [ ] Semua test passed

### Deploy Steps

1. [ ] Login ke https://vercel.com
2. [ ] Klik "Add New" → "Project"
3. [ ] Import GitHub repository
4. [ ] Framework Preset: Next.js (auto-detect)
5. [ ] Add Environment Variables:
   - [ ] `NEXT_PUBLIC_SUPABASE_URL`
   - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. [ ] Klik "Deploy"
7. [ ] Tunggu deploy selesai (± 2-3 menit)
8. [ ] Buka URL production
9. [ ] Test semua fitur di production

### Post-Deploy

- [ ] Test aplikasi di production URL
- [ ] Test install PWA di HP Android
- [ ] Test all payment methods
- [ ] Test laporan dengan data real
- [ ] Bookmark URL untuk akses cepat

## 📱 Setup PWA di HP Kasir

### Android (Chrome)

1. [ ] Buka aplikasi di Chrome browser
2. [ ] Klik menu (⋮) → "Add to Home screen"
3. [ ] Ubah nama jika perlu
4. [ ] Klik "Add"
5. [ ] Icon muncul di home screen
6. [ ] Buka dari home screen (fullscreen mode)
7. [ ] Test offline capability (optional)

### iOS (Safari) - Opsional

1. [ ] Buka di Safari
2. [ ] Tap Share button
3. [ ] "Add to Home Screen"
4. [ ] Konfirmasi

## 🎯 Training Karyawan

### Alur Kerja Harian

- [ ] **Pagi:** Buka aplikasi kasir
- [ ] **Order Masuk:** 
  1. Pilih produk
  2. Pilih topping
  3. Input qty
  4. Tambah ke cart
- [ ] **Checkout:**
  1. Review cart
  2. Tambah diskon jika ada promo
  3. Pilih metode bayar
  4. Input jumlah bayar
  5. Konfirmasi kembalian
  6. Selesai → Struk otomatis
- [ ] **Struk:**
  1. Share ke WA customer (jika diminta)
  2. Print (jika ada printer thermal)
  3. Kembali ke POS untuk order baru
- [ ] **Malam:** 
  1. Cek laporan harian
  2. Export CSV untuk backup
  3. Catat omzet

### Tips Penggunaan

- [ ] Gunakan mode fullscreen (PWA)
- [ ] Jangan refresh browser saat tengah order
- [ ] Backup data CSV setiap hari
- [ ] Cek koneksi internet stabil

## 🔧 Maintenance

### Harian

- [ ] Cek aplikasi berjalan normal
- [ ] Cek koneksi Supabase
- [ ] Backup laporan CSV

### Mingguan

- [ ] Review produk & topping terlaris
- [ ] Update harga jika ada perubahan
- [ ] Cek storage Supabase (free tier: 500MB)

### Bulanan

- [ ] Backup semua data order
- [ ] Review performance aplikasi
- [ ] Update dependencies jika ada (optional)

## 📞 Emergency Contacts

### Jika Aplikasi Error

1. [ ] Screenshot error message
2. [ ] Cek koneksi internet
3. [ ] Reload aplikasi (Ctrl+R)
4. [ ] Clear cache browser
5. [ ] Restart browser/HP
6. [ ] Hubungi developer jika masih error

### Jika Data Hilang

1. [ ] Jangan panic
2. [ ] Cek Supabase dashboard → Table Editor
3. [ ] Restore dari backup CSV (jika ada)
4. [ ] Contact support Supabase

## ✅ Final Checks

- [ ] Aplikasi accessible via URL production
- [ ] PWA installed di HP kasir
- [ ] Karyawan sudah ditraining
- [ ] Printer thermal setup (jika ada)
- [ ] Backup routine sudah dijadwalkan
- [ ] Emergency contact saved

---

**Status:** [ ] Ready for Production ✅

**Tanggal Deploy:** _______________

**URL Production:** _______________

**Notes:** 
```




```

---

Good luck dengan aplikasi kasirnya! 🚀🥞
