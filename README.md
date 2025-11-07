# 🥞 Aplikasi Kasir Martabak & Terang Bulan Tip Top

Aplikasi kasir modern full-stack dengan fitur lengkap untuk manajemen penjualan harian. Dibangun dengan Next.js 14, TypeScript, dan PostgreSQL (Neon.tech).

## ✨ Fitur Lengkap

### 🛒 POS (Point of Sale)
- ✅ Interface intuitif untuk input pesanan cepat
- ✅ Pilih produk dengan 56+ varian Terang Bulan
- ✅ Variant selector dengan search functionality
- ✅ Tambah catatan per item
- ✅ Real-time cart management dengan Zustand
- ✅ Hitung harga otomatis per varian

### 💳 Keranjang & Checkout
- ✅ Edit jumlah item (increment/decrement)
- ✅ Hapus item dari cart
- ✅ Diskon fleksibel (nominal / persentase)
- ✅ Biaya tambahan (delivery, packaging, dll)
- ✅ Multiple payment methods (Tunai / QRIS / E-Wallet)
- ✅ Hitung kembalian otomatis
- ✅ Validasi pembayaran sebelum checkout

### 🧾 Struk Digital
- ✅ Tampilan struk lengkap dengan detail order
- ✅ Share ke WhatsApp (Web Share API)
- ✅ Cetak struk thermal (58mm) - optimized for thermal printers
- ✅ Format struk profesional dengan logo & info toko
- ✅ Responsive design untuk mobile & desktop

### 📊 Laporan Harian
- ✅ Dashboard laporan dengan visualisasi data
- ✅ Total omzet & jumlah order per hari
- ✅ Breakdown pembayaran (Cash, QRIS, E-Wallet)
- ✅ Top 5 produk terlaris dengan varian
- ✅ Rata-rata nilai order
- ✅ Export laporan ke PDF (jsPDF)
- ✅ Export laporan ke CSV
- ✅ Preview PDF sebelum download

### 👤 Authentication & Authorization
- ✅ Secure login dengan JWT & bcrypt
- ✅ Role-based access control (Admin & Kasir)
- ✅ Session management dengan cookies
- ✅ Protected routes dengan middleware
- ✅ Auto-redirect berdasarkan role
- ✅ Logout functionality

### 🔧 Admin Panel
- ✅ Manajemen menu (CRUD products & variants)
- ✅ Tambah/edit/hapus produk
- ✅ Kelola varian dengan harga berbeda
- ✅ Soft delete untuk data integrity
- ✅ User-friendly modal forms
- ✅ Real-time update tanpa reload

### 📱 Progressive Web App (PWA)
- ✅ Install ke Home Screen (Android & iOS)
- ✅ Offline support dengan Service Worker
- ✅ Fast loading dengan caching strategy
- ✅ App shortcuts (POS & Laporan)
- ✅ Native app-like experience
- ✅ Custom icons & splash screens
- ✅ Mobile-first responsive design
- ✅ Install prompt component

### 📜 Riwayat Transaksi
- ✅ List transaksi hari ini
- ✅ Detail per transaksi
- ✅ Klik untuk lihat struk
- ✅ Summary total penjualan
- ✅ Filter by date (coming soon)

## 🚀 Quick Start

**Lihat panduan lengkap di [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

### Prerequisites
- Node.js 18+ 
- npm atau pnpm (recommended)
- Akun Neon.tech (free tier) untuk PostgreSQL database

### 1. Install Dependencies

```bash
npm install
# atau
pnpm install
```

### 2. Setup Database

1. Buat project di [Neon.tech](https://neon.tech)
2. Copy connection string
3. Buka SQL Editor di Neon dashboard
4. Copy & paste semua isi file `complete-schema.sql`
5. Jalankan SQL query
6. Generate password hash:
   ```bash
   node scripts/generate-password-hash.js
   ```
7. Update users table dengan hash yang benar

### 3. Environment Variables

Copy file `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Edit `.env` dan isi dengan credentials:

```env
DATABASE_URL=postgresql://user:pass@host.neon.tech/neondb?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
SESSION_EXPIRY=86400
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 5. Login

**Admin:**
- Email: `admin@tiptop.com`
- Password: `admin123`

**Kasir:**
- Email: `kasir@tiptop.com`
- Password: `kasir123`

### 6. Build untuk Production

```bash
npm run build
npm start
```

## 📱 Deploy ke Production

### Deploy ke Vercel (Recommended)

1. Push code ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/cashier-app.git
   git push -u origin main
   ```

2. Import repository ke [Vercel](https://vercel.com)
3. Tambahkan Environment Variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `SESSION_EXPIRY`
4. Deploy!

### Install PWA di Mobile

**Android (Chrome):**
1. Buka aplikasi di browser Chrome
2. Klik menu (⋮) → "Add to Home screen"
3. Aplikasi akan muncul di home screen seperti app native

**iOS (Safari):**
1. Buka aplikasi di Safari
2. Tap tombol Share → "Add to Home Screen"
3. Icon akan muncul di home screen

## 📂 Struktur Project

```
cashier-app/
├── app/                                    # Next.js 14 App Router
│   ├── api/                               # API Routes
│   │   ├── auth/                          # Authentication endpoints
│   │   │   ├── login/route.ts            # Login API
│   │   │   ├── logout/route.ts           # Logout API
│   │   │   └── me/route.ts               # Get current user
│   │   ├── orders/                        # Orders endpoints
│   │   │   ├── [id]/route.ts             # Get order by ID
│   │   │   ├── route.ts                  # Create & list orders
│   │   │   └── today/route.ts            # Today's orders
│   │   ├── products/                      # Products endpoints
│   │   │   ├── [id]/route.ts             # Update/delete product
│   │   │   └── route.ts                  # List & create products
│   │   ├── reports/                       # Reports endpoints
│   │   │   └── daily/route.ts            # Daily report
│   │   └── users/                         # Users endpoints
│   │       ├── [id]/password/route.ts    # Change password
│   │       └── route.ts                  # List users
│   ├── admin/                             # Admin pages
│   │   ├── users/page.tsx                # User management
│   │   └── page.tsx                      # Admin dashboard
│   ├── cart/page.tsx                      # Shopping cart & checkout
│   ├── login/page.tsx                     # Login page
│   ├── receipt/[id]/page.tsx              # Receipt page
│   ├── reports/page.tsx                   # Reports page
│   ├── riwayat/page.tsx                   # Transaction history
│   ├── layout.tsx                         # Root layout
│   ├── page.tsx                           # POS main page
│   └── globals.css                        # Global styles
├── components/                            # React components
│   ├── AdminBottomNav.tsx                # Admin navigation
│   ├── BottomNav.tsx                     # Kasir navigation
│   ├── Button.tsx                        # Button component
│   ├── InstallPrompt.tsx                 # PWA install prompt
│   └── ProductCard.tsx                   # Product card with variants
├── lib/                                   # Utility libraries
│   ├── auth.ts                           # Authentication helpers
│   ├── db.ts                             # Database client (Neon)
│   ├── pdfGenerator.ts                   # PDF generation
│   └── utils.ts                          # Helper functions
├── store/                                 # State management
│   └── cart.ts                           # Zustand cart store
├── types/                                 # TypeScript types
│   └── database.ts                       # Database types
├── public/                                # Static assets
│   ├── manifest.json                     # PWA manifest
│   ├── sw.js                             # Service worker
│   └── *.png                             # Icons & images
├── scripts/                               # Utility scripts
│   ├── generate-icons.js                 # Generate PWA icons
│   └── generate-password-hash.js         # Generate bcrypt hashes
├── complete-schema.sql                    # Complete DB schema
├── neon-schema.sql                        # Neon-specific schema
├── middleware.ts                          # Next.js middleware (auth)
├── SETUP_GUIDE.md                         # Detailed setup guide
├── README.md                              # This file
├── package.json                           # Dependencies
├── tsconfig.json                          # TypeScript config
├── tailwind.config.ts                     # Tailwind config
└── next.config.mjs                        # Next.js config
```

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **State Management:** Zustand (cart management)
- **Icons:** Lucide React
- **Date Handling:** date-fns, date-fns-tz

### Backend
- **Runtime:** Node.js
- **API:** Next.js API Routes
- **Database:** PostgreSQL (Neon.tech serverless)
- **ORM:** @neondatabase/serverless (SQL client)
- **Authentication:** JWT (jose) + bcryptjs
- **Session:** Cookie-based with httpOnly

### Features & Tools
- **PDF Generation:** jsPDF + jspdf-autotable
- **PWA:** next-pwa, Service Worker
- **Image Optimization:** Sharp
- **Deployment:** Vercel (recommended)

### Development
- **Package Manager:** npm / pnpm
- **Linting:** ESLint
- **Code Style:** Prettier (via ESLint)
- **Git Hooks:** (optional) Husky

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