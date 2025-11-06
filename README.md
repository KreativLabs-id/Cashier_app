# Aplikasi Kasir Martabak & Terang Bulan 🥞

Aplikasi kasir modern untuk usaha Martabak & Terang Bulan dengan fitur lengkap untuk manajemen penjualan harian.

## ✨ Fitur Utama

### 1. **POS (Point of Sale)**
- ✅ Input pesanan cepat
- ✅ Pilih produk (Martabak Tipis/Tebal, Terang Bulan)
- ✅ Tambah topping (Keju, Coklat, Kacang, Meses, Mix)
- ✅ Hitung harga otomatis

### 2. **Keranjang & Checkout**
- ✅ Edit jumlah item
- ✅ Diskon (nominal / persentase)
- ✅ Biaya tambahan
- ✅ Pilih metode bayar (Tunai / QRIS / E-Wallet)
- ✅ Hitung kembalian otomatis

### 3. **Struk Digital**
- ✅ Tampilan struk lengkap
- ✅ Share ke WhatsApp
- ✅ Cetak struk thermal (58mm)

### 4. **Laporan Harian**
- ✅ Total omzet & jumlah order
- ✅ Rata-rata nilai order
- ✅ Breakdown metode pembayaran
- ✅ Produk terlaris
- ✅ Topping terlaris
- ✅ Export CSV

### 5. **Progressive Web App (PWA)**
- ✅ Install ke Home Screen
- ✅ Mobile-first design
- ✅ Responsive UI

## 🚀 Setup & Instalasi

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) atau npm
- Akun Supabase (free tier)

### 1. Install Dependencies

```bash
pnpm install
# atau
npm install
```

### 2. Setup Supabase

1. Buat project baru di [Supabase](https://supabase.com)
2. Buka SQL Editor di Supabase Dashboard
3. Copy & paste semua isi file `supabase-schema.sql`
4. Jalankan SQL query
5. Verifikasi table sudah terbuat dan terisi seed data

### 3. Environment Variables

Copy file `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi dengan credentials Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Cara mendapatkan credentials:**
1. Buka Supabase Project Settings → API
2. Copy "Project URL" ke `NEXT_PUBLIC_SUPABASE_URL`
3. Copy "anon public" key ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Jalankan Development Server

```bash
pnpm dev
# atau
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 5. Build untuk Production

```bash
pnpm build
pnpm start
# atau
npm run build
npm start
```

## 📱 Deploy ke Production

### Deploy ke Vercel (Recommended)

1. Push code ke GitHub
2. Import repository ke [Vercel](https://vercel.com)
3. Tambahkan Environment Variables di Vercel Dashboard
4. Deploy!

### Install PWA di HP Android

1. Buka aplikasi di browser (Chrome/Edge)
2. Klik menu (⋮) → "Add to Home screen"
3. Aplikasi akan muncul di home screen seperti app native

## 📂 Struktur Project

```
aplikasi-kasir/
├── app/
│   ├── api/
│   │   ├── orders/route.ts          # API create & get orders
│   │   └── reports/daily/route.ts   # API laporan harian
│   ├── cart/page.tsx                # Halaman keranjang & checkout
│   ├── receipt/[id]/page.tsx        # Halaman struk
│   ├── reports/page.tsx             # Halaman laporan
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Halaman utama POS
│   └── globals.css                  # Global styles
├── components/
│   ├── BottomNav.tsx                # Bottom navigation
│   ├── Button.tsx                   # Button component
│   └── ProductCard.tsx              # Card produk dengan topping
├── lib/
│   ├── supabase.ts                  # Supabase client
│   └── utils.ts                     # Helper functions
├── store/
│   └── cart.ts                      # Zustand cart store
├── types/
│   └── database.ts                  # TypeScript types
├── public/
│   └── manifest.json                # PWA manifest
├── supabase-schema.sql              # Database schema
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 🛠 Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Database:** Supabase (PostgreSQL)
- **Icons:** Lucide React
- **Deployment:** Vercel

## 📝 Cara Penggunaan

### 1. Tambah Order
1. Pilih produk dari halaman POS
2. Pilih topping (opsional)
3. Atur jumlah
4. Klik "Tambah" → item masuk keranjang

### 2. Checkout
1. Klik icon keranjang atau tab "Cart"
2. Review item, tambah diskon/biaya tambahan jika perlu
3. Pilih metode pembayaran
4. Input jumlah bayar
5. Klik "Bayar & Cetak Struk"

### 3. Struk
1. Setelah checkout, otomatis redirect ke halaman struk
2. Pilih "Share ke WhatsApp" untuk kirim struk
3. Atau "Cetak Struk" untuk print thermal
4. Klik "Kembali ke POS" untuk order baru

### 4. Laporan
1. Buka tab "Laporan"
2. Pilih tanggal
3. Klik "Lihat"
4. Lihat ringkasan, produk terlaris, dll
5. Klik "Export ke CSV" untuk download

## 🎨 Kustomisasi

### Ubah Nama Toko & Info

Edit file `app/receipt/[id]/page.tsx` dan `components/BottomNav.tsx`:

```tsx
// Ganti dengan nama toko Anda
<h2>Martabak & Terang Bulan Oom</h2>
<p>Jl. [Alamat Lengkap]</p>
<p>Telp: 08xxxx</p>
```

### Tambah Produk & Topping

Bisa via Supabase Dashboard atau SQL:

```sql
-- Tambah produk baru
INSERT INTO products (id, name, base_price, is_active) 
VALUES ('prd_custom', 'Nama Produk', 35000, true);

-- Tambah topping baru
INSERT INTO toppings (id, name, price, is_active) 
VALUES ('top_custom', 'Nama Topping', 4000, true);
```

### Ubah Warna Theme

Edit `tailwind.config.ts` dan ganti warna orange:

```ts
colors: {
  // Ganti orange-500 dengan warna pilihan
  primary: '#your-color',
}
```

## 🐛 Troubleshooting

### Error: Cannot connect to Supabase
- Pastikan credentials di `.env.local` sudah benar
- Cek koneksi internet
- Verifikasi Supabase project masih aktif

### Struk tidak bisa print
- Pastikan printer thermal sudah terkoneksi
- Gunakan browser Chrome/Edge (support print lebih baik)
- Cek ukuran kertas di print settings (58mm)

### PWA tidak bisa install
- Pastikan menggunakan HTTPS (di production)
- Buka di Chrome/Edge mobile
- Clear cache browser dan coba lagi

## 📞 Support

Ada pertanyaan? Silakan buat issue di repository ini.

## 📄 License

MIT License - bebas digunakan untuk personal maupun komersial.

---

**Dibuat dengan ❤️ untuk UMKM Indonesia**
