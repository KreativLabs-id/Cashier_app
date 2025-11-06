# PWA Icons - Placeholder

Untuk menambahkan icon PWA yang proper, silakan:

1. **Generate Icons**
   - Buat logo 512x512px untuk aplikasi kasir Anda
   - Gunakan tool: https://realfavicongenerator.net/
   - Atau: https://www.pwabuilder.com/imageGenerator

2. **Upload Icons**
   Simpan file berikut di folder `/public`:
   - `icon-192.png` (192x192px)
   - `icon-512.png` (512x512px)
   - `favicon.ico` (opsional, untuk browser tab)

3. **Contoh Simple Icon**
   Bisa gunakan emoji atau text:
   - Background: Orange (#f97316)
   - Icon: 🥞 atau 🧇 atau text "M"
   - Tool: Canva, Figma, atau online icon generator

## Sementara (Quick Fix)

Jika ingin cepat, bisa:

1. Buka https://favicon.io/favicon-generator/
2. Settings:
   - Text: M
   - Background: #f97316 (orange)
   - Font: Bold
3. Generate & download
4. Rename files:
   - `android-chrome-192x192.png` → `icon-192.png`
   - `android-chrome-512x512.png` → `icon-512.png`
5. Copy ke folder `/public`

Atau gunakan placeholder SVG/PNG untuk development dulu, nanti diganti saat production.
