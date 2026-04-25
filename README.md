# AIOTrade Web Platform

Dokumen ini dibuat untuk membantu pemilik bisnis, admin konten, dan tim teknis memahami project ini tanpa harus membaca kode satu per satu.

Project ini adalah website utama AIOTrade yang mencakup:

- landing page publik untuk promosi produk
- signup dan login
- dashboard member
- dashboard admin untuk mengatur homepage, pembayaran, SEO, user, blog, dan panduan

## 1. Fungsi Project

Website ini dipakai sebagai pusat operasional AIOTrade.

Fungsi utamanya:

- mengenalkan produk AIOTrade lewat landing page publik
- memproses pendaftaran user baru
- memverifikasi pembayaran signup atau langganan bila mode pembayaran diaktifkan
- memberi akses member ke panduan video dan PDF
- memberi admin kontrol penuh untuk mengubah isi homepage tanpa edit kode
- menyimpan blog, SEO, asset gambar, dan panduan dalam satu sistem

Secara sederhana, project ini bukan hanya website company profile, tetapi juga:

- mesin akuisisi user
- area member
- panel admin konten

## 2. Gambaran Alur Web

### A. Pengunjung umum

1. Pengunjung membuka homepage utama di `/`
2. Pengunjung membaca informasi fitur, harga, FAQ, guide, dan blog
3. Pengunjung bisa lanjut ke `/signup`
4. Setelah daftar dan login, user masuk ke dashboard member

### B. Signup

1. User mengisi `username`, `email`, `nomor WhatsApp`, dan `password`
2. Sistem memvalidasi data
3. Jika pembayaran signup diaktifkan, user diminta menyelesaikan pembayaran lebih dulu
4. Setelah valid, akun dibuat dan user bisa login

### C. Login

1. User login di `/login`
2. Sistem membuat session berbasis cookie
3. Jika user biasa, diarahkan ke `/dashboard`
4. Jika user admin, user bisa masuk ke `/admin`

### D. Dashboard member

Area ini dipakai oleh user setelah login.

Fungsi utamanya:

- melihat status akun
- melihat status langganan
- melihat dan mengubah profil dasar
- mengubah nomor WhatsApp
- membuka panduan video dan file PDF
- mengganti light mode dan dark mode

### E. Dashboard admin

Area ini dipakai admin untuk operasional.

Fungsi utamanya:

- `User Management`
- `Payment Settings`
- `Post to Member`
- `Posting Konten`
- `Setting Homepage`
- `SEO Settings`

Admin bisa:

- membuat user manual
- mengubah komponen homepage tanpa edit kode
- upload asset homepage
- mengatur paket pembayaran dan channel pembayaran
- mengelola panduan member
- mengelola PDF guide publik
- menulis dan publish blog
- mengatur metadata SEO

## 3. Halaman Penting

### Halaman publik

- `/` = homepage utama
- `/guide` = halaman guide publik / PDF guide
- `/blog` = daftar artikel
- `/blog/[slug]` = detail artikel
- `/signup` = pendaftaran
- `/login` = login

### Halaman member

- `/dashboard`
- `/dashboard/account`
- `/dashboard/account/profile`
- `/dashboard/subscription`
- `/dashboard/guides`
- `/dashboard/guides/start`
- `/dashboard/guides/activation`
- `/dashboard/guides/bot-settings`
- `/dashboard/guides/files`

### Halaman admin

- `/admin`
- `/admin/users`
- `/admin/payments`
- `/admin/member-posts`
- `/admin/member-posts/published`
- `/admin/posts`
- `/admin/posts/pdfs`
- `/admin/posts/pdfs/published`
- `/admin/posts/published`
- `/admin/seo`

## 4. Fitur Utama yang Sudah Ada

- landing page dengan light mode dan dark mode
- dashboard member dengan light mode dan dark mode
- dashboard admin dengan light mode dan dark mode
- multi bahasa dasar melalui selector bahasa situs
- nomor WhatsApp yang bisa diedit user
- signup dengan validasi username, email, password, dan WhatsApp
- pembayaran signup / langganan lewat Paymenku
- guide member dalam bentuk video dan PDF
- blog publik
- SEO settings
- asset management melalui Cloudinary

## 5. Teknologi dan Dependency Utama

Project ini dibangun dengan stack berikut:

- `Next.js 16.2.4` untuk framework web
- `React 19.2.4` untuk UI
- `TypeScript` untuk keamanan tipe data
- `Prisma` untuk akses database PostgreSQL
- `PostgreSQL` sebagai database utama
- `Tailwind CSS 4` untuk styling
- `Zod` untuk validasi data
- `Framer Motion` untuk animasi
- `Tiptap` untuk editor artikel/blog
- `Cloudinary` untuk upload gambar dan file panduan
- `Paymenku` untuk pembayaran

Dependency utama di `package.json` yang paling relevan:

- `next`
- `react`
- `react-dom`
- `@prisma/client`
- `prisma`
- `pg`
- `zod`
- `framer-motion`
- `lucide-react`
- `@tiptap/react`
- `sanitize-html`
- `isomorphic-dompurify`

Catatan:

- helper Supabase tersedia di repo, tetapi alur utama website saat ini berfokus pada Prisma + PostgreSQL
- jika helper Supabase belum dipakai di deployment Anda, env Supabase tidak perlu dianggap wajib

## 6. Struktur Data yang Disimpan

Secara garis besar, database menyimpan:

- `profiles` = data user, admin, WhatsApp, dan autentikasi akun
- `member_subscriptions` = data langganan member
- `homepage_content` = semua isi homepage yang bisa diubah admin
- `homepage_assets` = gambar/asset homepage
- `site_seo_settings` = metadata SEO
- `payment_gateway_settings` = pengaturan pembayaran signup/langganan
- `signup_payment_transactions` = riwayat transaksi pembayaran signup
- `blog_posts` = artikel blog
- `member_guide_posts` = panduan member video/PDF
- `public_guide_pdf_posts` = PDF guide publik

## 7. Kebutuhan Minimum Sebelum Menjalankan Project

Yang wajib disiapkan:

- Node.js versi modern, disarankan `20+`
- npm
- database PostgreSQL

Yang opsional tetapi sangat disarankan:

- Cloudinary untuk upload asset
- Paymenku untuk pembayaran signup
- TranslateX API key untuk terjemahan otomatis
- CoinMarketCap API key untuk ticker market

## 8. Menjalankan Project di Lokal

### Langkah singkat

1. Clone repository
2. Install dependency
3. Siapkan file `.env.local`
4. Jalankan migration database
5. Jalankan development server

### Perintah yang dipakai

```bash
npm install
```

```bash
npx prisma migrate deploy
```

Jika Anda sedang mengembangkan database dari nol dan butuh generate client ulang:

```bash
npm run prisma:generate
```

Jalankan aplikasi:

```bash
npm run dev
```

Lalu buka:

```bash
http://localhost:3000
```

## 9. Environment Variable dan Konfigurasinya

Berikut penjelasan env berdasarkan fungsi bisnis, bukan sekadar nama variabel.

### A. Koneksi website

Wajib:

- `NEXT_PUBLIC_SITE_URL`

Fungsi:

- menentukan base URL website
- dipakai saat membangun link profil, metadata, dan callback tertentu

Contoh:

```env
NEXT_PUBLIC_SITE_URL=https://domainanda.com
```

### B. Database

Wajib salah satu:

- `DATABASE_URL`
- `DIRECT_URL`

Opsional:

- `SHADOW_DATABASE_URL`

Fungsi:

- koneksi PostgreSQL untuk Prisma
- `SHADOW_DATABASE_URL` berguna saat migration yang butuh shadow database

Contoh:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
DIRECT_URL=postgresql://user:password@host:5432/dbname
SHADOW_DATABASE_URL=postgresql://user:password@host:5432/dbname_shadow
```

### C. Session dan keamanan

Sangat disarankan:

- `AUTH_SECRET`

Cadangan yang masih dibaca sistem:

- `SESSION_SECRET`

Fungsi:

- menandatangani cookie session login
- dipakai juga sebagai secret internal fallback tertentu

Contoh:

```env
AUTH_SECRET=ganti-dengan-random-string-panjang
```

### D. Cloudinary

Opsional tetapi dibutuhkan jika admin ingin upload asset dari panel admin:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Opsional untuk folder:

- `CLOUDINARY_HOMEPAGE_FOLDER`
- `CLOUDINARY_MEMBER_GUIDE_FOLDER`
- `CLOUDINARY_PUBLIC_GUIDE_FOLDER`

Fungsi:

- upload gambar homepage
- upload PDF panduan member
- upload PDF guide publik

Contoh:

```env
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
CLOUDINARY_HOMEPAGE_FOLDER=aiotrade/homepage
CLOUDINARY_MEMBER_GUIDE_FOLDER=aiotrade/member-guides
CLOUDINARY_PUBLIC_GUIDE_FOLDER=aiotrade/public-guides
```

### E. Pembayaran Paymenku

Opsional jika pembayaran signup ingin dipakai:

- API key Paymenku tidak wajib ditaruh di env, karena bisa disimpan dari panel admin

Namun yang perlu dipahami:

- panel admin menyediakan tempat untuk mengisi API key Paymenku
- data itu disimpan ke database dalam `payment_gateway_settings`

Jika mode pembayaran tidak dipakai:

- website tetap bisa berjalan
- signup bisa dibuat tanpa mewajibkan pembayaran

### F. TranslateX

Opsional:

- `TRANSLATEX_API_KEY`

Fungsi:

- membantu proses terjemahan konten ke bahasa lain

Jika kosong:

- situs tetap jalan
- hanya fitur terjemahan otomatis yang tidak aktif penuh

### G. CoinMarketCap

Opsional:

- `CMC_API_KEY`
- `COINMARKETCAP_API_KEY`

Fungsi:

- mengambil data ticker market di landing page

Jika kosong:

- fitur market ticker bisa fallback atau tidak selengkap mode live

### H. Supabase

Opsional:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Fungsi:

- helper Supabase tersedia di project
- saat ini bukan inti utama alur web harian

Jika deployment Anda tidak memakai helper Supabase:

- bagian ini bisa dikosongkan

### I. Admin bootstrap

Opsional tetapi sangat berguna saat awal deploy:

- `DEFAULT_ADMIN_EMAIL`
- `DEFAULT_ADMIN_USERNAME`
- `DEFAULT_ADMIN_PASSWORD`

Fungsi:

- jika belum ada admin sama sekali, sistem akan membuat akun admin pertama otomatis dari env ini
- jika akun dengan email atau username tersebut sudah ada, sistem akan menjadikannya admin pertama dan menyamakan password-nya dengan env
- setelah admin pertama sudah ada, perubahan akun lewat panel admin tidak akan terus ditimpa env

Contoh:

```env
DEFAULT_ADMIN_EMAIL=admin@domainanda.com
DEFAULT_ADMIN_USERNAME=adminutama
DEFAULT_ADMIN_PASSWORD=ganti-dengan-password-kuat
```

## 10. Contoh `.env.local`

Berikut contoh aman untuk dijadikan template awal:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

DATABASE_URL=postgresql://user:password@localhost:5432/aiotrade
DIRECT_URL=postgresql://user:password@localhost:5432/aiotrade
SHADOW_DATABASE_URL=postgresql://user:password@localhost:5432/aiotrade_shadow

AUTH_SECRET=isi-dengan-random-string-panjang

DEFAULT_ADMIN_EMAIL=admin@email.com
DEFAULT_ADMIN_USERNAME=adminutama
DEFAULT_ADMIN_PASSWORD=ganti-dengan-password-kuat

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_HOMEPAGE_FOLDER=aiotrade/homepage
CLOUDINARY_MEMBER_GUIDE_FOLDER=aiotrade/member-guides
CLOUDINARY_PUBLIC_GUIDE_FOLDER=aiotrade/public-guides

TRANSLATEX_API_KEY=

CMC_API_KEY=
COINMARKETCAP_API_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## 11. Persiapan Deploy

Project ini paling cocok dideploy ke:

- Vercel
- VPS biasa
- container / platform Node.js yang mendukung build Next.js

### A. Checklist sebelum deploy

- database PostgreSQL sudah siap
- semua env penting sudah diisi
- domain utama sudah ditentukan
- Cloudinary sudah siap jika butuh upload asset
- Paymenku siap jika signup berbayar diaktifkan
- migration database sudah dipastikan ikut dijalankan

### B. Build command

Build aplikasi:

```bash
npm run build
```

Menjalankan aplikasi production:

```bash
npm run start
```

### C. Migration saat deploy

Penting:

- setiap kali ada perubahan schema database, migration harus dijalankan di server

Perintah:

```bash
npx prisma migrate deploy
```

Saran urutan deploy:

1. upload code
2. install dependency
3. jalankan `npx prisma migrate deploy`
4. jalankan `npm run build`
5. jalankan `npm run start`

### D. Deploy ke Vercel

Jika memakai Vercel:

- hubungkan repository ke Vercel
- isi semua environment variable di dashboard Vercel
- pastikan database PostgreSQL bisa diakses dari Vercel
- jalankan migration database di environment yang sama

Saran:

- simpan `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, dan `NEXT_PUBLIC_SITE_URL`
- jika admin butuh upload asset, simpan juga env Cloudinary
- jika signup berbayar aktif, lengkapi pengaturan pembayaran dari panel admin setelah deploy

## 12. Konfigurasi Setelah Deploy

Setelah website berhasil online, lakukan langkah berikut.

### A. Membuat admin pertama

Pilihan paling mudah:

1. isi `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_USERNAME`, dan `DEFAULT_ADMIN_PASSWORD`
2. login memakai email dan password tersebut
3. jika belum ada admin, sistem akan membuat admin pertama otomatis
4. setelah berhasil masuk, Anda bebas mengganti email, username, atau password dari panel admin / akun

### B. Masuk ke panel admin

URL:

```text
/admin
```

Yang perlu diatur pertama kali:

- homepage content
- SEO settings
- payment settings
- guide member
- blog

### C. Mengatur homepage

Masuk ke:

```text
/admin
```

Di sini admin bisa mengubah:

- overview
- benefit
- pricing
- video
- FAQ
- guide
- testimonial
- blog
- banner ads
- footer

### D. Mengatur pembayaran

Masuk ke:

```text
/admin/payments
```

Di sini admin bisa:

- mengaktifkan atau mematikan pembayaran signup
- mengatur API key Paymenku
- memilih channel pembayaran
- mengatur paket langganan
- mengatur paket default

### E. Mengatur panduan member

Masuk ke:

```text
/admin/member-posts
```

Admin bisa:

- membuat panduan video
- upload PDF untuk member
- mengatur kategori panduan
- publish atau unpublish

### F. Mengatur guide publik

Masuk ke:

```text
/admin/posts/pdfs
```

Admin bisa:

- upload PDF guide publik
- mengatur urutan tampil
- publish atau unpublish

### G. Mengatur blog

Masuk ke:

```text
/admin/posts
```

Admin bisa:

- menulis artikel
- upload thumbnail
- mengatur excerpt
- publish ke halaman blog

### H. Mengatur SEO

Masuk ke:

```text
/admin/seo
```

Admin bisa mengubah:

- site name
- site URL
- homepage title
- homepage description
- open graph title
- open graph description
- favicon
- gambar share social media

## 13. Alur Operasional yang Mudah Dipahami

### Jika tujuan Anda hanya membuat website aktif

Lakukan ini:

1. siapkan database PostgreSQL
2. isi env dasar
3. deploy project
4. jalankan migration
5. buat akun admin pertama
6. login ke admin
7. isi homepage, SEO, dan guide

### Jika tujuan Anda ingin signup berbayar

Tambahan yang perlu disiapkan:

1. aktifkan Cloudinary jika butuh upload asset
2. buka `/admin/payments`
3. masukkan API key Paymenku
4. pilih channel pembayaran
5. atur paket
6. aktifkan mode payment

## 14. Script yang Tersedia

```bash
npm run dev
```

Menjalankan project di mode development.

```bash
npm run build
```

Build production.

```bash
npm run start
```

Menjalankan hasil build production.

```bash
npm run lint
```

Menjalankan ESLint.

```bash
npm run prisma:generate
```

Generate Prisma client.

## 15. Struktur Folder Penting

Berikut folder yang paling sering dipakai saat maintenance:

- `app/` = route utama Next.js
- `components/landing/` = komponen halaman publik utama
- `components/dashboard/` = komponen member area
- `components/admin/` = komponen admin panel
- `app/(auth)/` = login dan signup
- `app/(public)/` = halaman publik
- `app/(protected)/dashboard/` = halaman member
- `app/(protected)/admin/` = halaman admin
- `app/api/` = API internal project
- `lib/` = logika bisnis, helper, config, auth, payment, translation
- `prisma/` = schema dan migration database

## 16. Hal yang Perlu Diingat Saat Maintenance

- perubahan schema database harus disertai migration
- perubahan homepage sebaiknya dilakukan dari admin panel, bukan edit data manual di database
- jika upload asset bermasalah, cek konfigurasi Cloudinary
- jika signup tidak bisa lanjut, cek mode payment dan setting Paymenku
- jika admin bootstrap tidak jalan, cek `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_USERNAME`, dan `DEFAULT_ADMIN_PASSWORD`
- jika dark/light mode tidak sesuai, cek cookie theme di browser
- jika sesi login terasa tidak konsisten, hapus cookie browser lalu login ulang

## 17. Troubleshooting Cepat

### Build gagal karena database

Penyebab umum:

- `DATABASE_URL` atau `DIRECT_URL` belum diisi
- migration belum dijalankan

Solusi:

```bash
npx prisma migrate deploy
```

### Upload asset tidak jalan

Penyebab umum:

- env Cloudinary kosong

Solusi:

- isi `CLOUDINARY_CLOUD_NAME`
- isi `CLOUDINARY_API_KEY`
- isi `CLOUDINARY_API_SECRET`

### User tidak bisa login

Penyebab umum:

- session secret berubah
- database profile belum ada
- password tidak cocok

Solusi:

- cek `AUTH_SECRET`
- cek tabel `profiles`

### Payment tidak muncul di signup

Penyebab umum:

- payment belum diaktifkan di admin
- setting payment gateway kosong

Solusi:

- buka `/admin/payments`
- aktifkan gateway
- cek channel dan paket default

## 18. Rekomendasi Untuk Tim Non Teknis

Jika Anda bukan developer, fokus saja pada urutan kerja berikut:

1. minta tim teknis menyiapkan database dan deploy
2. minta tim teknis mengisi env dasar
3. login sebagai admin
4. ubah homepage dari panel admin
5. isi guide member dan guide publik
6. isi SEO
7. uji signup
8. uji login
9. uji dashboard member

## 19. Catatan Penutup

Dokumen ini ditulis agar project lebih mudah dipahami oleh owner, admin operasional, dan tim teknis baru.

Kalau project terus berkembang, README ini sebaiknya ikut diperbarui setiap kali ada perubahan besar pada:

- alur signup
- alur pembayaran
- struktur dashboard admin
- struktur dashboard member
- environment variable
