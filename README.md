# ImgURL - Image to URL Converter

Website konverter gambar ke URL instan dengan dukungan masa aktif tautan (1 hari, 1 minggu, 1 bulan), token URL panjang berkeamanan tinggi, integrasi database & storage Supabase, halaman 404 keren saat link kedaluwarsa, dan tampilan modern yang presisi sesuai referensi.

---

## Fitur Utama

- 🎨 **Tampilan Presisi Referensi**: Desain bersih, modern, dan responsif dilengkapi Dark / Light mode toggle.
- ⏱️ **Pengaturan Masa Aktif Fleksibel**: Pilihan durasi link **1 Hari**, **1 Minggu**, atau **1 Bulan**.
- 🔗 **Long Secure URL**: Format link panjang menggunakan kombinasi cryptographic hash acak yang aman dan tidak dapat ditebak.
- 🌌 **Halaman 404 Keren**: Tampilan 404 interaktif dan futuristik saat masa aktif link telah berakhir atau tidak ditemukan.
- 🗄️ **Integrasi Supabase Cloud**: Menggunakan Supabase Storage untuk berkas gambar dan database PostgreSQL untuk pelacakan masa kedaluwarsa.
- 🧪 **Built-in Demo Mode**: Aplikasi tetap dapat berjalan langsung di browser menggunakan local IndexedDB bahkan sebelum Supabase dikonfigurasi.
- 🏷️ **Footer Khusus**: Mengusung identitas **"developed by dimas"**.

---

## Cara Setup Database Supabase

1. Buka dashboard [Supabase](https://supabase.com/dashboard) dan buat project baru.
2. Masuk ke menu **SQL Editor** di sidebar Supabase.
3. Buka file `supabase_schema.sql` di proyek ini, lalu salin seluruh kodenya dan klik **Run**.
4. Masuk ke menu **Settings** -> **API**, lalu salin:
   - **Project URL**
   - **anon / public key**
5. Isi nilai tersebut ke file `.env`:
   ```env
   VITE_SUPABASE_URL=https://xyzcompany.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   *(Atau Anda bisa langsung memasukkannya melalui tombol indikator Supabase di pojok kanan atas website).*

---

## Cara Menjalankan Secara Lokal

```bash
# 1. Install dependencies (jika belum)
npm install

# 2. Jalankan development server
npm run dev

# 3. Akses di browser
# http://localhost:5173
```

---

## Cara Deploy ke Vercel

Proyek ini telah dikonfigurasi dengan file `vercel.json` sehingga single-page application (SPA) routing seperti `/v/:token` akan berjalan sempurna di Vercel tanpa error 404.

### Opsi 1: Deploy Lewat GitHub (Sangat Direkomendasikan)
1. Buat repository baru di [GitHub](https://github.com/new).
2. Hubungkan repository lokal dan push kode:
   ```bash
   git remote add origin https://github.com/username/nama-repo.git
   git branch -M main
   git push -u origin main
   ```
3. Buka dashboard [Vercel](https://vercel.com/new) dan klik **Import Project** dari repository GitHub Anda.
4. Pada bagian **Environment Variables** di Vercel, tambahkan:
   - `VITE_SUPABASE_URL` : (URL Supabase Anda)
   - `VITE_SUPABASE_ANON_KEY` : (Anon Public Key Supabase Anda)
5. Klik **Deploy**. Website Anda langsung aktif di domain `.vercel.app`!

### Opsi 2: Deploy Menggunakan Vercel CLI
Jalankan perintah berikut di terminal:
```bash
npx vercel
```
Ikuti instruksi login dan konfirmasi di terminal, lalu untuk deploy produksi:
```bash
npx vercel --prod
```

---

## Pengembang
Developed with ❤️ by **dimas**
