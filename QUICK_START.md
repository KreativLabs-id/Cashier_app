# ⚡ Quick Start - 5 Menit Setup

Panduan super cepat untuk menjalankan aplikasi dalam 5 menit!

## 📋 Prerequisites

- ✅ Node.js 18+ terinstall
- ✅ npm atau pnpm terinstall
- ✅ Akun Neon.tech (gratis)

## 🚀 5 Langkah Setup

### 1️⃣ Install Dependencies (1 menit)

```bash
npm install
```

### 2️⃣ Setup Database (2 menit)

1. Buka [neon.tech](https://neon.tech) → Login/Register
2. Create New Project → Beri nama "martabak-tiptop"
3. Copy **Connection String**
4. Buka **SQL Editor** di Neon
5. Copy-paste isi file `complete-schema.sql`
6. Klik **Run** (tunggu 10 detik)

### 3️⃣ Generate Password Hash (30 detik)

```bash
node scripts/generate-password-hash.js
```

Copy output SQL dan jalankan di SQL Editor Neon.

### 4️⃣ Setup Environment (30 detik)

Buat file `.env` di root folder:

```env
DATABASE_URL=postgresql://user:pass@host.neon.tech/neondb?sslmode=require
JWT_SECRET=your-random-secret-min-32-chars
SESSION_EXPIRY=86400
```

Ganti `DATABASE_URL` dengan connection string dari Neon.

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5️⃣ Run Development Server (10 detik)

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🔑 Login Credentials

### Admin
- **Email:** `admin@tiptop.com`
- **Password:** `admin123`
- **Akses:** Admin panel, reports, product management

### Kasir
- **Email:** `kasir@tiptop.com`
- **Password:** `kasir123`
- **Akses:** POS, cart, transaction history

## ✅ Verifikasi

Cek apakah semua berjalan dengan baik:

1. ✅ Login berhasil (admin atau kasir)
2. ✅ Bisa lihat produk di POS
3. ✅ Bisa tambah produk ke cart
4. ✅ Bisa checkout dan lihat struk
5. ✅ Admin bisa akses admin panel
6. ✅ Admin bisa lihat reports

## 🐛 Troubleshooting

### Error: Cannot connect to database
```bash
# Cek connection string di .env
# Pastikan tidak ada spasi atau karakter aneh
# Test koneksi di SQL Editor Neon
```

### Error: Login failed
```bash
# Pastikan sudah jalankan generate-password-hash.js
# Pastikan sudah update users table dengan hash yang benar
# Cek di SQL Editor: SELECT * FROM users;
```

### Error: Module not found
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
```

## 📚 Next Steps

Setelah aplikasi running:

1. 📖 Baca [SETUP_GUIDE.md](./SETUP_GUIDE.md) untuk panduan lengkap
2. 📊 Baca [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) untuk overview project
3. 🚀 Deploy ke Vercel (lihat README.md)
4. 📱 Install PWA di mobile device

## 🎉 Done!

Aplikasi kasir sudah siap digunakan!

**Total waktu setup: ~5 menit** ⚡

---

**Need help?** Baca dokumentasi lengkap atau buat issue di GitHub.
