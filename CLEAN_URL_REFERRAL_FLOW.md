# Clean URL Referral Flow

Dokumen ini menjelaskan alur dan cara kerja sistem referral landing page terbaru di project AIOTrade.

## Tujuan

Sistem referral sekarang dibuat agar:

- user tetap membagikan link `domain.com/username`
- visitor akhirnya selalu melihat homepage bersih di `domain.com/`
- sistem tetap tahu siapa pemilik referral dari link awal
- CTA landing page berubah otomatis mengikuti pemilik referral

## Konsep Utama

Arsitektur lama:

- `/:username` langsung merender landing page referral

Arsitektur baru:

- `/:username` hanya menjadi **entry link referral**
- server menangkap entry link itu di `proxy`
- server menyimpan cookie referral
- server me-redirect visitor ke `/`
- homepage `/` membaca cookie lalu menampilkan CTA dinamis

Jadi sekarang render landing page hanya terjadi di `/`.

## Alur Lengkap

### 1. User membagikan link referral

Di dashboard, user tetap mendapatkan link:

- `domain.com/username`

Link ini bukan lagi halaman landing final, tetapi pintu masuk referral.

### 2. Visitor membuka `domain.com/username`

Request masuk ke `proxy.ts`.

Yang dilakukan server:

1. membaca pathname
2. memastikan path hanya 1 segmen, misalnya `/username`
3. memastikan username valid dan bukan username sistem seperti:
   - `login`
   - `signup`
   - `dashboard`
   - `admin`
   - `api`
4. mencari owner referral di database
5. memastikan owner punya landing page aktif (`is_lp_active = true`)

Kalau valid:

- server set cookie `landing_referral=<username>`
- cookie berlaku 30 hari
- server redirect ke `/`

Kalau tidak valid:

- cookie tidak diubah
- request diteruskan normal
- hasil akhirnya bisa 404 atau route biasa

### 3. Visitor sampai di homepage `/`

Homepage sekarang membaca cookie:

- `landing_referral`

Lalu homepage mencari owner referral aktif berdasarkan username di cookie.

Jika owner ditemukan:

- tombol hero `Gabung Komunitas` mengarah ke WhatsApp owner
- semua tombol `Daftar Sekarang` mengarah ke:
  - `/signup?ref=username-owner`

Jika owner tidak punya nomor WhatsApp:

- tombol hero fallback ke:
  - `/signup?ref=username-owner`

Jika cookie tidak ada atau owner sudah tidak valid:

- homepage kembali ke mode normal
- semua CTA mengarah ke `/signup`

## Aturan Referral

### Last click wins

Kalau visitor sebelumnya sudah punya cookie referral, lalu membuka link referral milik user lain:

- cookie referral diganti ke owner terakhir yang diklik

Artinya atribusi selalu mengikuti referral link terbaru yang dibuka.

### Direct visit ke `/`

Kalau visitor membuka `/` langsung:

- cookie referral yang sudah ada tidak dihapus
- homepage tetap akan mengikuti referral yang masih tersimpan

## Alur Signup

Halaman signup sekarang memakai urutan referral seperti ini:

1. `?ref=` dari URL
2. cookie `landing_referral`
3. `null`

Artinya:

- jika ada `/signup?ref=usernameA`, maka `usernameA` dipakai
- jika tidak ada query `ref`, maka signup akan memakai cookie referral
- jika dua-duanya tidak ada, signup menjadi direct signup biasa

## Dashboard User

Di dashboard, user tetap melihat dan membagikan:

- `domain.com/username`

Tetapi secara sistem, link itu sekarang bekerja seperti ini:

1. visitor masuk lewat `/:username`
2. referral disimpan di cookie
3. visitor dipindah ke `/`
4. homepage berubah mengikuti owner referral

Jadi dashboard tetap sederhana untuk user, tetapi pengalaman visitor jadi clean URL.

## Cookie yang Dipakai

Nama cookie:

- `landing_referral`

Isi cookie:

- username owner referral dalam lowercase

Sifat cookie:

- `httpOnly`
- `sameSite=lax`
- `path=/`
- `secure` hanya di production
- `maxAge=30 hari`

## Validasi Username

Karena sekarang clean URL bergantung pada path `/:username`, beberapa username harus diblok supaya tidak bentrok dengan route sistem.

Minimal username terlarang:

- `login`
- `signup`
- `dashboard`
- `admin`
- `api`

Blacklist ini dipakai di:

- validasi signup
- endpoint cek username realtime
- parsing username referral di proxy

## File Penting

### Entry referral dan cookie

- [proxy.ts](/home/aan/aiotrade/proxy.ts)
- [referral.ts](/home/aan/aiotrade/lib/referral.ts)
- [username-rules.ts](/home/aan/aiotrade/lib/username-rules.ts)

### Homepage

- [page.tsx](/home/aan/aiotrade/app/(public)/page.tsx)
- [LandingPageUI.tsx](/home/aan/aiotrade/components/LandingPageUI.tsx)

### Signup

- [page.tsx](/home/aan/aiotrade/app/(auth)/signup/page.tsx)
- [actions.ts](/home/aan/aiotrade/app/(auth)/signup/actions.ts)
- [signup-form.tsx](/home/aan/aiotrade/components/auth/signup-form.tsx)

### Username validation

- [route.ts](/home/aan/aiotrade/app/api/auth/check-username/route.ts)

### Dashboard

- [page.tsx](/home/aan/aiotrade/app/(protected)/dashboard/page.tsx)

## Ringkasan Cara Kerja

Versi singkatnya:

1. user share `domain.com/username`
2. visitor buka link itu
3. `proxy` cek username dan simpan cookie referral
4. visitor dipindah ke `/`
5. homepage baca cookie
6. CTA homepage berubah sesuai owner referral
7. signup tetap menyimpan sponsor lewat `ref`

## Catatan Penting

- route landing lama `app/(public)/[username]/page.tsx` sudah dihapus
- sekarang tidak ada lagi render landing page khusus di `/:username`
- render landing page hanya ada di `/`
- clean URL yang terlihat visitor adalah `/`, bukan `/:username`
