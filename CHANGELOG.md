# Changelog

## [Update] - 2025-11-06

### ✅ Rebranding Aplikasi
- Ganti judul dari "Kasir Martabak" → "Martabak & Terang Bulan Tip Top"
- Update semua references di:
  - `app/layout.tsx` - Metadata dan app title
  - `public/manifest.json` - PWA manifest
  - `app/page.tsx` - Header POS
  - `app/receipt/[id]/page.tsx` - Nama toko di struk (screen & print)
  - WhatsApp share template

### ✅ Perbaikan README.md
- Hapus duplikasi "# Cashier_app" di akhir file
- Format ulang struktur dokumentasi
- Update fitur dan cara penggunaan
- Perbaiki formatting code blocks

### 🎨 UI/UX Improvements (Sebelumnya)
- Responsive design untuk HP, Tablet, PC
- Gradient backgrounds di semua halaman
- Smooth animations dan hover effects
- Better touch targets (44px+)
- Custom orange scrollbar
- Loading states dan feedback visual

### 📝 Catatan
- Schema database masih sama (products: Terang Bulan Tipis/Tebal, Martabak Telur)
- Jika ingin pisahkan kategori Martabak dan Terang Bulan, perlu:
  1. Update schema database (tambah kolom category)
  2. Update seed data
  3. Update frontend untuk group by category
