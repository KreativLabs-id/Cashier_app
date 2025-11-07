# 🚀 Setup Guide - Aplikasi Kasir Martabak Tip Top

Panduan lengkap untuk setup dan menjalankan aplikasi kasir dari awal hingga production-ready.

## 📋 Prerequisites

Pastikan sudah terinstall:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** atau **pnpm** (recommended)
- Akun **Neon.tech** (free tier) untuk database PostgreSQL

## 🔧 Step 1: Install Dependencies

```bash
npm install
# atau
pnpm install
```

## 🗄️ Step 2: Setup Database di Neon.tech

### 2.1 Buat Project Baru

1. Buka [Neon.tech](https://neon.tech) dan login/register
2. Klik **"Create Project"**
3. Beri nama project: `martabak-tiptop-db`
4. Pilih region terdekat (Singapore untuk Indonesia)
5. Klik **"Create Project"**

### 2.2 Dapatkan Connection String

1. Di dashboard Neon, klik **"Connection Details"**
2. Copy **Connection String** yang formatnya seperti:
   ```
   postgresql://username:password@ep-xxx.aws.neon.tech/neondb?sslmode=require
   ```

### 2.3 Jalankan Database Schema

1. Buka **SQL Editor** di Neon dashboard
2. Copy seluruh isi file `complete-schema.sql`
3. Paste ke SQL Editor
4. Klik **"Run"** atau tekan `Ctrl+Enter`
5. Tunggu hingga selesai (sekitar 10-15 detik)

### 2.4 Generate Password Hash (PENTING!)

Password default di schema menggunakan hash contoh. Untuk keamanan, generate hash yang benar:

```bash
node scripts/generate-password-hash.js
```

Script akan output SQL untuk update users. Copy dan jalankan di SQL Editor Neon.

### 2.5 Verifikasi Database

Jalankan query berikut di SQL Editor untuk memastikan semua tabel terbuat:

```sql
-- Cek semua tabel
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Cek jumlah products
SELECT COUNT(*) FROM products;

-- Cek jumlah variants
SELECT COUNT(*) FROM product_variants;

-- Cek users
SELECT email, name, role FROM users;
```

Harusnya ada:
- ✅ 8 tabel (users, sessions, products, product_variants, orders, order_items, shifts)
- ✅ 2 products
- ✅ 56 product variants
- ✅ 2 users (admin & kasir)

## 🔐 Step 3: Setup Environment Variables

### 3.1 Copy File Environment

```bash
cp .env.example .env
```

### 3.2 Edit File .env

Buka file `.env` dan isi dengan credentials Neon:

```env
# Database Connection (dari Neon.tech)
DATABASE_URL=postgresql://username:password@ep-xxx.aws.neon.tech/neondb?sslmode=require

# JWT Secret (generate random string yang kuat)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Session Expiry (dalam detik, default 24 jam)
SESSION_EXPIRY=86400

# Node Environment
NODE_ENV=development
```

**PENTING:** Untuk production, gunakan JWT_SECRET yang kuat! Generate dengan:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🎨 Step 4: Generate PWA Icons

Icons untuk PWA sudah ada di folder `public/`, tapi jika ingin regenerate:

```bash
npm run generate-icons
```

## 🚀 Step 5: Jalankan Development Server

```bash
npm run dev
# atau
pnpm dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

## 🔑 Step 6: Login Pertama Kali

### Login sebagai Admin:
- **Email:** `admin@tiptop.com`
- **Password:** `admin123`
- **Akses:** Dashboard admin, manajemen menu, laporan

### Login sebagai Kasir:
- **Email:** `kasir@tiptop.com`
- **Password:** `kasir123`
- **Akses:** POS, keranjang, riwayat transaksi

## 📱 Step 7: Test Fitur Utama

### 7.1 Test POS (Kasir)
1. Login sebagai kasir
2. Pilih produk "Terang Bulan Tip Top"
3. Pilih varian (misal: "Kombinasi Original")
4. Atur qty dan tambah ke cart
5. Klik icon cart di bottom nav
6. Review item, atur payment method
7. Input jumlah bayar
8. Klik "Bayar & Cetak Struk"
9. Lihat struk digital
10. Test share ke WhatsApp
11. Test print struk

### 7.2 Test Admin Panel
1. Logout dari kasir
2. Login sebagai admin
3. Buka halaman Admin (auto redirect)
4. Test tambah menu baru
5. Test edit menu existing
6. Test hapus menu
7. Buka halaman Laporan
8. Pilih tanggal hari ini
9. Lihat laporan harian
10. Test export PDF
11. Test export CSV

### 7.3 Test Riwayat
1. Login sebagai kasir
2. Klik tab "Riwayat" di bottom nav
3. Lihat list transaksi hari ini
4. Klik salah satu transaksi
5. Lihat detail struk

## 🏗️ Step 8: Build untuk Production

### 8.1 Build Aplikasi

```bash
npm run build
```

### 8.2 Test Production Build Locally

```bash
npm start
```

Buka [http://localhost:3000](http://localhost:3000) dan test semua fitur.

## 🌐 Step 9: Deploy ke Vercel

### 9.1 Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit - Cashier App MVP"
git branch -M main
git remote add origin https://github.com/username/cashier-app.git
git push -u origin main
```

### 9.2 Deploy ke Vercel

1. Buka [Vercel](https://vercel.com)
2. Login dengan GitHub
3. Klik **"New Project"**
4. Import repository `cashier-app`
5. Di **Environment Variables**, tambahkan:
   - `DATABASE_URL` = (connection string dari Neon)
   - `JWT_SECRET` = (secret key yang kuat)
   - `SESSION_EXPIRY` = `86400`
6. Klik **"Deploy"**
7. Tunggu hingga deployment selesai (2-3 menit)
8. Buka URL production (misal: `cashier-app.vercel.app`)

### 9.3 Test di Production

1. Buka URL production di browser
2. Test login admin & kasir
3. Test semua fitur end-to-end
4. Test di mobile device (Chrome/Safari)
5. Test install PWA (Add to Home Screen)

## 📱 Step 10: Install PWA di Mobile

### Android (Chrome):
1. Buka aplikasi di Chrome
2. Klik menu (⋮) → **"Add to Home screen"**
3. Beri nama: "Tip Top POS"
4. Klik **"Add"**
5. Icon akan muncul di home screen
6. Buka dari home screen → berjalan seperti native app!

### iOS (Safari):
1. Buka aplikasi di Safari
2. Tap tombol Share (kotak dengan panah ke atas)
3. Scroll dan tap **"Add to Home Screen"**
4. Beri nama: "Tip Top POS"
5. Tap **"Add"**
6. Icon akan muncul di home screen

## 🔧 Troubleshooting

### Error: Cannot connect to database
- ✅ Pastikan `DATABASE_URL` di `.env` sudah benar
- ✅ Cek koneksi internet
- ✅ Verifikasi Neon project masih aktif
- ✅ Pastikan tidak ada typo di connection string

### Error: Login failed / Invalid credentials
- ✅ Pastikan sudah jalankan `generate-password-hash.js`
- ✅ Pastikan sudah update users table dengan hash yang benar
- ✅ Cek di SQL Editor: `SELECT * FROM users;`
- ✅ Pastikan `JWT_SECRET` sudah diset di `.env`

### Error: Order creation failed
- ✅ Pastikan function `generate_order_no()` sudah terbuat
- ✅ Test di SQL Editor: `SELECT generate_order_no();`
- ✅ Cek apakah ada error di console browser (F12)

### PWA tidak bisa install
- ✅ Pastikan menggunakan HTTPS (di production)
- ✅ Pastikan file `manifest.json` accessible
- ✅ Pastikan icons ada di folder `public/`
- ✅ Clear cache browser dan coba lagi

### Print struk tidak berfungsi
- ✅ Pastikan printer thermal sudah terkoneksi
- ✅ Gunakan browser Chrome/Edge (support print lebih baik)
- ✅ Cek ukuran kertas di print settings (58mm)
- ✅ Test dengan "Print Preview" dulu

## 📊 Monitoring & Maintenance

### Daily Tasks:
- ✅ Cek laporan harian
- ✅ Backup database (Neon auto backup)
- ✅ Monitor error logs di Vercel

### Weekly Tasks:
- ✅ Review performa aplikasi
- ✅ Clean expired sessions: `SELECT clean_expired_sessions();`
- ✅ Update menu/harga jika ada perubahan

### Monthly Tasks:
- ✅ Review dan optimize database
- ✅ Update dependencies: `npm update`
- ✅ Review security (ganti JWT_SECRET jika perlu)

## 🎉 Selesai!

Aplikasi kasir Martabak Tip Top sudah siap digunakan!

### Default Credentials:
- **Admin:** admin@tiptop.com / admin123
- **Kasir:** kasir@tiptop.com / kasir123

**PENTING:** Segera ganti password default setelah setup!

### Fitur Lengkap:
- ✅ POS System dengan variant selector
- ✅ Shopping cart dengan discount & extra fee
- ✅ Multiple payment methods (Cash, QRIS, E-Wallet)
- ✅ Digital receipt dengan share WhatsApp
- ✅ Thermal printer support (58mm)
- ✅ Transaction history
- ✅ Daily reports dengan export PDF & CSV
- ✅ Admin panel untuk manajemen menu
- ✅ PWA support (install di mobile)
- ✅ Offline-capable dengan service worker
- ✅ Responsive design (mobile-first)
- ✅ Authentication & authorization
- ✅ Role-based access control

### Support:
Jika ada pertanyaan atau masalah, silakan buat issue di repository GitHub.

---

**Happy Selling! 🥞🎉**
