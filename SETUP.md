# 🚀 PANDUAN SETUP CEPAT - Aplikasi Kasir Martabak

## Langkah 1: Install Dependencies

Buka PowerShell/Terminal di folder project, lalu jalankan:

```powershell
npm install
```

Tunggu sampai selesai (± 2-5 menit).

## Langkah 2: Setup Supabase Database

### A. Buat Project Supabase

1. Buka https://supabase.com
2. Klik "Start your project" / "New Project"
3. Login dengan GitHub
4. Klik "New Project"
5. Isi:
   - **Name:** kasir-martabak (atau nama bebas)
   - **Database Password:** buat password (SIMPAN!)
   - **Region:** Southeast Asia (Singapore)
6. Klik "Create new project"
7. Tunggu ± 2 menit sampai project siap

### B. Import Database Schema

1. Di dashboard Supabase, klik **SQL Editor** (sidebar kiri)
2. Klik "New query"
3. Buka file `supabase-schema.sql` di project ini
4. **Copy SEMUA isi file** (Ctrl+A, Ctrl+C)
5. **Paste** ke SQL Editor di Supabase
6. Klik **Run** (atau Ctrl+Enter)
7. Tunggu sampai muncul "Success. No rows returned"

### C. Verifikasi Data

1. Klik **Table Editor** (sidebar kiri)
2. Pastikan terlihat table:
   - ✅ products (3 rows)
   - ✅ toppings (6 rows)
   - ✅ orders
   - ✅ order_items
   - ✅ order_item_toppings
   - ✅ shifts

## Langkah 3: Setup Environment Variables

### A. Ambil Credentials Supabase

1. Di dashboard Supabase, klik **⚙️ Settings** (sidebar bawah)
2. Klik **API**
3. Lihat section "Project API keys"
4. **COPY** dua nilai ini:
   - **Project URL** → contoh: `https://xxxxx.supabase.co`
   - **anon public** key → string panjang mulai `eyJh...`

### B. Buat File Environment

1. Buka file `.env.example` di project
2. Copy isinya
3. Buat file baru bernama `.env.local` (di folder root project)
4. Paste dan isi dengan credentials Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. **SAVE** file `.env.local`

## Langkah 4: Jalankan Aplikasi

Di PowerShell/Terminal, jalankan:

```powershell
npm run dev
```

Tunggu sampai muncul:

```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

## Langkah 5: Buka di Browser

1. Buka browser (Chrome/Edge recommended)
2. Ketik: `http://localhost:3000`
3. **DONE!** 🎉

Aplikasi sudah bisa digunakan:
- Tab **POS** → Input order
- Tab **Cart** → Checkout
- Tab **Laporan** → Lihat laporan harian

## 🧪 Testing Pertama

### Test Input Order

1. Di halaman POS, klik produk "Terang Bulan Tebal"
2. Pilih qty: 1
3. Pilih topping: Keju, Coklat
4. Klik "Tambah"
5. Klik icon keranjang (kanan atas)

### Test Checkout

1. Di halaman Cart, pilih metode: Tunai
2. Input "Dibayar": 50000
3. Lihat kembalian otomatis terhitung
4. Klik "Bayar & Cetak Struk"

### Test Struk

1. Otomatis masuk ke halaman struk
2. Coba "Share ke WhatsApp"
3. Atau "Cetak Struk"

### Test Laporan

1. Klik tab "Laporan"
2. Pilih tanggal hari ini
3. Klik "Lihat"
4. Cek total omzet, produk terlaris, dll
5. Coba "Export ke CSV"

## ✅ Checklist Setup

- [ ] Dependencies installed (`node_modules` folder ada)
- [ ] Supabase project created
- [ ] Database schema imported (6 tables ada)
- [ ] `.env.local` dibuat dan diisi
- [ ] `npm run dev` jalan tanpa error
- [ ] Bisa buka `http://localhost:3000`
- [ ] Halaman POS menampilkan 3 produk
- [ ] Bisa tambah order dan checkout
- [ ] Struk muncul setelah checkout
- [ ] Laporan bisa ditampilkan

## ❗ Troubleshooting

### Error: "Cannot find module"
**Solusi:** Jalankan `npm install` lagi

### Error: "Missing Supabase environment variables"
**Solusi:** 
- Pastikan file `.env.local` ada (bukan `.env.example`)
- Pastikan isi URL dan KEY benar
- Restart server (`Ctrl+C` → `npm run dev`)

### Halaman POS kosong / loading terus
**Solusi:**
- Cek credentials Supabase di `.env.local`
- Pastikan schema SQL sudah di-import
- Buka Console browser (F12) → cek error message

### Products tidak muncul
**Solusi:**
- Buka Supabase → Table Editor → products
- Pastikan ada 3 rows
- Pastikan `is_active = true`
- Kalau kosong, jalankan ulang SQL schema

### Error saat checkout
**Solusi:**
- Buka Console browser (F12)
- Screenshot error
- Cek apakah function `generate_order_no` sudah ada di Supabase

## 🚀 Deploy ke Production (Opsional)

### Deploy ke Vercel

1. Push code ke GitHub
2. Buka https://vercel.com
3. Import repository
4. Add environment variables (copy dari `.env.local`)
5. Deploy!
6. Aplikasi bisa diakses online

### Install PWA di HP

1. Buka aplikasi di HP (Chrome browser)
2. Menu (⋮) → "Add to Home screen"
3. Done! App jadi seperti native app

## 📞 Butuh Bantuan?

Kalau ada error atau stuck di langkah tertentu:
1. Screenshot error message
2. Cek file mana yang bermasalah
3. Pastikan semua langkah sudah diikuti

---

**Good luck! Semoga lancar setup-nya! 🚀**
