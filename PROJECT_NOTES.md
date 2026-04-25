# Project Notes

Catatan singkat ini dibuat sebagai pengingat tentang perubahan yang sudah dikerjakan dan alur utama web saat ini.

## Ringkasan Pekerjaan

### 1. Landing page dibangun ulang
- Landing page dibuat ulang dari nol mengikuti referensi visual.
- Struktur halaman dipecah per section agar mudah dikelola.
- Section yang sudah dipisah ke komponen:
  - `hero-section`
  - `ticker-strip`
  - `overview-section`
  - `benefits-section`
  - `pricing-section`
  - `faq-section`
  - `guide-section`
  - `blog-section`
  - `cta-section`
- Header landing juga sudah dipisah ke komponen sendiri agar tidak hardcode di hero.

### 2. Hero landing page diperbarui
- Hero dibuat setinggi 1 layar penuh di desktop dan mobile.
- Posisi teks dan CTA dipusatkan.
- Overlay hitam dikurangi agar foto lebih jelas.
- Ditambahkan animasi dan motion menggunakan `framer-motion`.
- Hero sekarang hanya memiliki 1 tombol utama.

### 3. Overview section disesuaikan dengan referensi
- Copy overview diubah agar lebih dekat ke pesan produk, bukan menjelaskan pekerjaan redesign.
- Tampilan overview dibuat lebih dekat ke referensi dengan fokus pada mockup aplikasi, deskripsi singkat, dan logo exchange.
- Logo Binance, Tokocrypto, dan Bitget sekarang berjalan terus dalam loop.
- Tombol overview disederhanakan menjadi 1 tombol utama dengan gaya yang konsisten seperti tombol hero.
- Ticker market dipindah ke bagian bawah overview.
- Ticker sekarang berjalan terus dan mengambil data market real melalui API internal project.
- Sumber ticker market sekarang disiapkan untuk memakai top 10 CoinMarketCap.
- Logo ticker bisa diambil otomatis dari metadata CoinMarketCap, tidak perlu dimasukkan satu-satu jika API key tersedia.

### 4. Alur CTA landing dibedakan
- CTA hero dan CTA daftar di section bawah tidak lagi disamakan.
- Hero CTA bisa mengarah ke WhatsApp atau signup tergantung konteks halaman.
- CTA daftar di section overview, pricing, dan penutup selalu bisa diarahkan khusus ke halaman signup.

### 5. Signup diperbarui
- Form signup sekarang memiliki field:
  - `username`
  - `email`
  - `nomor whatsapp`
  - `password`
  - `ulangi password`
- Halaman signup dibuat lebih interaktif dan lebih rapi secara visual.
- Validasi realtime ditambahkan:
  - cek ketersediaan username saat user mengetik
  - indikator kekuatan password yang benar-benar aktif
  - validasi kecocokan password

### 6. Login disamakan dengan signup
- Halaman login dibuat seirama dengan halaman signup.
- Copy di sign in dan sign up dibuat lebih ringan dan tidak terlalu teknis.

### 7. Dukungan data WhatsApp
- Field `whatsapp` sudah ditambahkan ke data profile.
- Data WhatsApp dipakai untuk CTA WhatsApp di landing page replika `/username`.
- Ada fallback query untuk menghindari error saat Prisma client dev masih stale.

## Alur Web Saat Ini

### A. Homepage utama
URL: `/`

Alur:
1. User membuka homepage utama.
2. Tombol utama `Gabung Komunitas` di hero mengarah ke `/signup`.
3. Tombol daftar di section overview, pricing, dan CTA penutup juga mengarah ke `/signup`.

Tujuan:
- Homepage utama dipakai untuk akuisisi umum tanpa referral khusus.

### B. Landing page replika per username
URL: `/{username}`

Contoh:
- `domain.com/usernameA`

Alur:
1. Sistem mencari profile berdasarkan `username`.
2. Jika landing page user aktif, halaman replika ditampilkan.
3. Tombol hero `Gabung Komunitas` mengarah ke WhatsApp milik user tersebut.
4. Tombol daftar di section overview, pricing, dan CTA penutup mengarah ke:
   - `/signup?ref=usernameA`

Tujuan:
- Hero dipakai untuk kontak langsung ke affiliator.
- Tombol daftar tetap membawa referral affiliator ke flow signup.

### C. Signup dengan referral
URL: `/signup?ref=usernameA`

Alur:
1. User membuka halaman signup dari landing page affiliator.
2. Parameter `ref` dibaca sebagai sponsor atau affiliator.
3. Saat akun dibuat, hubungan referral disimpan sesuai username sponsor.

Tujuan:
- User baru tetap masuk ke flow signup normal.
- Referral affiliator tetap tercatat.

### D. Login
URL: `/login`

Alur:
1. User login dengan akun yang sudah dibuat.
2. Setelah login, user diarahkan ke area yang sesuai.

## Aturan CTA yang Penting

Supaya tidak tertukar, ini aturan yang harus diingat:

- Di `/`:
  - hero CTA -> `/signup`
  - tombol daftar section bawah -> `/signup`

- Di `/{username}`:
  - hero CTA -> WhatsApp user sesuai data profile
  - tombol daftar section bawah -> `/signup?ref={username}`

## File Penting

Beberapa file utama yang paling sering terkait alur ini:

- `components/LandingPageUI.tsx`
- `components/landing/types.ts`
- `components/landing/landing-header.tsx`
- `components/landing/hero-section.tsx`
- `components/landing/overview-section.tsx`
- `components/landing/pricing-section.tsx`
- `components/landing/cta-section.tsx`
- `components/auth/signup-form.tsx`
- `components/auth/login-form.tsx`
- `app/(public)/page.tsx`
- `app/(public)/[username]/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(auth)/signup/actions.ts`
- `app/(auth)/login/page.tsx`
- `app/(auth)/login/actions.ts`
- `app/api/auth/check-username/route.ts`
- `lib/site.ts`
- `lib/auth.ts`
- `prisma/schema.prisma`

## Catatan Teknis

- `LandingPageUI` sekarang mendukung pemisahan:
  - `ctaHref` untuk hero
  - `signupCtaHref` untuk tombol daftar di section bawah
- Format nomor WhatsApp dinormalisasi sebelum dibentuk menjadi link `wa.me`.
- Beberapa query profile punya fallback SQL untuk menghindari masalah Prisma client yang belum sinkron di mode dev.
- Data ticker real diambil dari route internal `app/api/market/ticker/route.ts`.
- Route ticker sekarang disiapkan untuk mengambil top 10 market dari CoinMarketCap dan metadata logo otomatis dari endpoint info CoinMarketCap.
- Env yang dibaca untuk integrasi ini:
  - `CMC_API_KEY`
  - `COINMARKETCAP_API_KEY`

## Checklist Cepat Saat Mengubah Landing Page

Kalau nanti ada perubahan lagi, cek hal ini:

1. Apakah hero CTA dan CTA signup masih mengarah ke tujuan yang benar?
2. Apakah `/` dan `/{username}` masih punya perilaku yang berbeda sesuai kebutuhan?
3. Apakah referral `?ref=username` tetap terbawa saat daftar?
4. Apakah nomor WhatsApp masih terbentuk benar ke link WhatsApp?
5. Apakah tampilan hero tetap penuh 1 layar dan responsif?
