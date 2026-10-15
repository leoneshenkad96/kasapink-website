# Kasapink

Landing page statis, mobile-first, tanpa dependency frontend saat runtime. Preview lokal dapat dibuka melalui `index.html`. `npm run build` menyalin hanya file publik yang diizinkan ke `public/`; Vercel menggunakan output ini. Deploy production hanya dengan persetujuan pemilik.

- `index.html`: konten, WhatsApp resmi `6287884363963`, SEO dan metadata sosial.
- `styles.css`: gaya responsif, fallback font lokal, reduced motion, fokus keyboard.
- `assets/logo.png`: logo transparan asli; favicon dan Apple icon diturunkan dari logo ini.
- ERP terpisah: `https://erp.kasapink.com`, dari HTML referensi. Ketersediaan dan akses ERP perlu dikonfirmasi pemilik.
- Menu, harga, foto produk, alamat, sertifikasi, dan testimoni belum diberikan, sehingga tidak dibuat-buat.
- Lihat `docs/design.md` untuk lima konsep dan alasan pilihan.

Repo awal kosong. Branch implementasi dibuat terpisah; PR memerlukan branch dasar dengan minimal satu commit. Tidak ada workflow deployment yang ditambahkan.
