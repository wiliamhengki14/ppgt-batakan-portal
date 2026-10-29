# PRODUCT REQUIREMENT DOCUMENT (PRD) — FINAL SPECIFICATION
## Web Portal & Sistem Informasi Manajemen PPGT Jemaat Batakan
**Klasis Walenrang Timur — Gereja Toraja**  
*“Karena tidak ada seorang pun yang dapat meletakkan dasar lain dari pada dasar yang telah diletakkan, yaitu Yesus Kristus.” (1 Korintus 3:11 TB)*

---

## Informasi Dokumen

| Atribut Dokumen | Rincian Informasi |
| :--- | :--- |
| **Nama Produk / Sistem** | Web Portal & Sistem Informasi Manajemen PPGT Jemaat Batakan (`ppgt-batakan-portal`) |
| **Versi & Status Dokumen** | v2.0 (Final Specification) — Active Development |
| **Pengembang & Metodologi** | Solo Developer — Agile-Kanban (*Vertical Slice* & *Just-in-Time Design* via Trello) |
| **Tech Stack Utama** | Laravel 11/12, React (TypeScript), Inertia.js, Tailwind CSS, Lucide Icons, MySQL/MariaDB, Google Gemini API, Web Push Notification |

---

## 1. Problem Statement (Latar Belakang & Masalah Utama)

Persekutuan Pemuda Gereja Toraja (PPGT) Jemaat Batakan, Klasis Walenrang Timur, membutuhkan sistem informasi terpusat untuk mendukung pelayanan rohani, tata kelola organisasi, dan komunikasi jemaat. Saat ini terdapat **5 permasalahan utama** dalam operasional organisasi:

1. **Pendataan Sensus Anggota yang Terpisah (Lokal vs Perantau):** Data pemuda yang menetap di wilayah Jemaat Batakan dan anggota yang sedang merantau (kuliah atau bekerja di luar kota seperti Makassar, Morowali, Jakarta, dll.) belum terdokumentasi dalam satu pangkalan data terverifikasi.
2. **Ketidakmerataan Penjadwalan Pelayan Ibadah (*Unfair Roster*):** Penunjukan petugas ibadah mingguan (Penghimpun, Pemusik, Singer, Kolektan, Doa Syafaat) masih dilakukan secara manual, sehingga sering berulang pada orang yang sama atau tidak sengaja menjadwalkan anggota yang sedang merantau/berhalangan.
3. **Tingkat Ketidakhadiran Pelayan Akibat Lupa Jadwal:** Anggota yang sudah dijadwalkan melayani kerap lupa akan tugasnya karena pengumuman hanya dibagikan sekali di grup pesan singkat dan mudah tertumpuk percakapan lain.
4. **Penyusunan Laporan Keuangan (LPJ) Gereja yang Lambat:** Bendahara membutuhkan waktu $3\text{--}4$ hari untuk merekap buku kas bulanan/triwulanan dan mengetik ulang Surat Laporan Pertanggungjawaban (LPJ) resmi ber-kop organisasi untuk diserahkan ke Majelis Gereja.
5. **Keterbatasan Akses Dokumentasi & Pendampingan Rohani Digital:** Dokumentasi foto kegiatan internal membutuhkan ruang simpan terproteksi (hanya dapat diunduh penuh oleh anggota), serta pemuda membutuhkan sarana interaktif untuk bertanya seputar jadwal dan memperdalam perenungan firman Tuhan setiap hari.

---

## 2. Target Users & Personas

### 2.1 Daftar Peran Pengguna (*User Roles*)

| Peran (*Role*) | Kode Database | Deskripsi & Hak Akses Utama |
| :--- | :--- | :--- |
| **Pengunjung Publik (*Guest*)** | Tanpa Login / `pengunjung` | Mengakses seluruh informasi publik di Landing Page (Hero, Renungan Harian & YouTube Embed, Jadwal Ibadah, Struktur Pengurus, Pratinjau Galeri, FAQ) dan mengirim masukan di Kotak Saran. |
| **Anggota PPGT** | `ppgt_member` | Mengakses Dashboard Anggota, mengisi & memperbarui Sensus Profil (Lokal/Perantau), mengatur kesiapan bertugas (`is_eligible_for_duty`), melihat Banner & menerima Web Push tugas pelayanan, mengunduh foto galeri resolusi penuh, serta berdiskusi dengan AI Chatbot Rohani. |
| **Bendahara** | `treasurer` | Mengelola Buku Kas Harian (`financial_ledgers`) untuk pemasukan/pengeluaran beserta unggahan foto nota, merekap laporan periodik, dan mencetak PDF Surat LPJ Keuangan untuk Majelis Gereja. |
| **Administrator / Pengurus** | `admin` | Memegang kendali penuh: memverifikasi sensus anggota (`approved`/`rejected`), menyusun jadwal ibadah, menjalankan algoritma Acak Pelayan Adil, mempublikasikan renungan harian, mengelola pengurus, album galeri, FAQ, dan kotak saran. |

### 2.2 User Personas

* **Persona 1 — Yeremia (20 Tahun, Anggota PPGT Lokal di Batakan):**
  * **Profil:** Pemuda yang tinggal di Sektor 1 Jemaat Batakan dan aktif hadir dalam ibadah pemuda mingguan.
  * **Kebutuhan:** Ingin mengetahui jadwal ibadah terdekat, mendapatkan giliran pelayanan yang adil bersama rekan-rekan lainnya, serta menerima notifikasi pengingat di HP pada H-3 dan H-1 sebelum bertugas.
* **Persona 2 — Meyske (21 Tahun, Anggota PPGT Perantau di Luar Kota):**
  * **Profil:** Mahasiswi asal Jemaat Batakan yang sedang menempuh kuliah di Makassar.
  * **Kebutuhan:** Ingin tetap tercatat resmi sebagai anggota PPGT Batakan (kategori Perantau), mengikuti perkembangan renungan harian dan foto kegiatan gereja kampung halaman, serta memastikan namanya tidak masuk dalam undian tugas ibadah fisik selama di perantauan (dan mudah mengaktifkannya kembali saat pulang libur semester ke Batakan).
* **Persona 3 — Sekretaris / Koordinator Kerohanian (23 Tahun, Admin Pengurus):**
  * **Profil:** Pengurus inti yang bertanggung jawab atas data keanggotaan dan penyusunan jadwal ibadah bulanan.
  * **Kebutuhan:** Membutuhkan panel verifikasi sensus yang praktis dan fitur **Acak Pelayan Otomatis** yang adil tanpa harus menghitung riwayat tugas anggota satu per satu secara manual.
* **Persona 4 — Bendahara PPGT (22 Tahun, Pengelola Kas):**
  * **Profil:** Pengurus yang mencatat kolekte ibadah, usaha dana, dan pengeluaran konsumsi/kegiatan.
  * **Kebutuhan:** Ingin mencatat transaksi kas langsung dari HP/laptop lengkap dengan foto nota, lalu di akhir periode langsung mengunduh PDF Surat LPJ resmi ber-kop PPGT Jemaat Batakan untuk diserahkan ke Majelis Gereja.

---

## 3. Goals & Non-Goals

### 3.1 Goals (Sasaran Utama Sistem)
1. **Digitalisasi Sensus $100\%$ Terverifikasi:** Memisahkan dengan tegas data domisili anggota **Lokal Batakan** dan **Perantau** disertai alur verifikasi Admin (`pending` $\rightarrow$ `approved` / `rejected`).
2. **Otomatisasi *Fair-Shuffle Roster*:** Mengacak petugas ibadah mingguan secara adil dengan memfilter anggota yang berstatus `is_eligible_for_duty = true`, diurutkan dari jumlah tugas paling sedikit (`duty_count` terendah) dan tanggal tugas terlama (`last_duty_at`).
3. **Pengingat Tugas Proaktif:** Menekan angka ketidakhadiran pelayan melalui Banner Peringatan di Dashboard dan **Web Push Notification** otomatis pada H-3 dan H-1.
4. **Otomatisasi Dokumen LPJ Keuangan Gereja:** Memangkas waktu pembuatan Surat LPJ Keuangan ke Majelis Gereja menjadi $< 10$ menit melalui generator PDF otomatis.
5. **Integrasi AI Rohani Kontekstual:** Menghadirkan asisten cerdas berbasis **Google Gemini API** yang memahami konteks jadwal ibadah, isi renungan harian, dan FAQ PPGT Batakan.

### 3.2 Non-Goals (Di Luar Cakupan Sistem Saat Ini)
1. **Bukan *Payment Gateway* / Perbankan Digital:** Sistem tidak memproses transfer uang otomatis (QRIS/Virtual Account); seluruh pemasukan dan pengeluaran dicatat oleh Bendahara ke dalam Buku Kas beserta bukti foto nota fisik/digital.
2. **Bukan Aplikasi Mobile Native (APK/iOS):** Sistem tidak dibangun menggunakan Flutter/React Native, melainkan sebagai *Responsive Web Application (SPA)* berbasis Inertia.js + React yang mendukung *Web Push Notification* langsung di browser HP.
3. **Tidak Menggantikan Database Sinode Pusat:** Sistem ini dirancang khusus untuk kebutuhan operasional internal PPGT Jemaat Batakan (Klasis Walenrang Timur).
4. **Tidak Menyediakan *Server Live Streaming* Mandiri:** Video renungan harian diintegrasikan melalui fitur sematan (*embed*) YouTube resmi.

---

## 4. User Stories

### Pengunjung Publik (*Guest*)
* **US-01:** Sebagai pengunjung, saya ingin membaca renungan harian dan menonton video renungan YouTube langsung di halaman utama, sehingga saya diberkati oleh firman Tuhan setiap hari.
* **US-02:** Sebagai pengunjung, saya ingin melihat jadwal ibadah pemuda terdekat dan daftar pengurus aktif, sehingga saya mengetahui waktu dan tempat persekutuan berlangsung.
* **US-03:** Sebagai pengunjung, saya ingin mengirimkan saran atau aspirasi melalui formulir Kotak Saran tanpa harus login, sehingga masukan saya dapat diterima oleh pengurus PPGT.

### Anggota PPGT (`ppgt_member`)
* **US-04:** Sebagai pemuda PPGT, saya ingin mendaftarkan akun menggunakan nama lengkap, email, dan nomor WhatsApp aktif, sehingga saya memiliki akses resmi ke portal anggota.
* **US-05:** Sebagai anggota, saya ingin mengisi formulir sensus mandiri sesuai status domisili saya (**Lokal di Batakan** atau **Perantau**), sehingga data keluarga dan keberadaan saya tercatat akurat di gereja.
* **US-06:** Sebagai anggota, saya ingin mengubah tombol *toggle* kesiapan melayani (`is_eligible_for_duty`), sehingga pengurus tahu apakah saya sedang berada di Batakan dan siap dijadwalkan bertugas atau sedang merantau/berhalangan.
* **US-07:** Sebagai anggota yang terjadwal melayani, saya ingin melihat *banner* pengingat di bagian atas dashboard dan menerima *push notification* di HP pada H-3 dan H-1, sehingga saya dapat mempersiapkan diri dengan baik.
* **US-08:** Sebagai anggota yang sudah login, saya ingin membuka galeri album kegiatan dan mengunduh foto dokumentasi dalam resolusi penuh.
* **US-09:** Sebagai anggota, saya ingin bertanya kepada Chatbot AI Rohani mengenai jadwal tugas saya atau meminta pokok doa berdasarkan renungan hari ini.

### Bendahara (`treasurer`)
* **US-10:** Sebagai bendahara, saya ingin mencatat setiap uang masuk (`income`) dan uang keluar (`expense`) beserta foto bukti notanya ke dalam Buku Kas, sehingga seluruh mutasi keuangan tercatat transparan.
* **US-11:** Sebagai bendahara, saya ingin memilih rentang tanggal laporan dan mengunduh PDF Surat LPJ Keuangan ber-kop resmi PPGT Jemaat Batakan, sehingga laporan siap diserahkan ke Majelis Gereja dalam hitungan menit.

### Administrator / Pengurus (`admin`)
* **US-12:** Sebagai admin, saya ingin memeriksa data sensus anggota yang berstatus `pending` untuk disetujui (`approved`) atau dikembalikan (`rejected` dengan catatan perbaikan), sehingga hanya data valid yang masuk ke database.
* **US-13:** Sebagai admin, saya ingin menekan tombol **"Acak Pelayan Otomatis"** saat membuat jadwal ibadah, sehingga sistem memilihkan Penghimpun, Pemusik, Singer, Kolektan, dan pendoa syafaat secara adil dari anggota aktif yang paling jarang bertugas.

---

## 5. Scope & Feature Roadmap (Agile-Kanban Workflow)

Pengembangan dilaksanakan secara bertahap dengan metode **Agile-Kanban** (*Vertical Slice*) di Trello dengan batas *Work In Progress* (WIP) maksimal $1\text{--}2$ kartu tugas aktif:

| Tahapan (*Milestone*) | Cakupan Fitur Utama (*Deliverables*) | Status |
| :--- | :--- | :---: |
| **Milestone 1: Fondasi & Etalase Publik** | • Setup Laravel + Inertia React (TypeScript) + Tailwind CSS<br>• Perancangan ERD, 13 Migration & Eloquent Models<br>• Landing Page Publik: Hero Section (`slate-800`), Renungan Harian YouTube *align-center*, Kegiatan, Galeri Pratinjau, Pengurus, FAQ, Kotak Saran | **DONE** |
| **Milestone 2: Autentikasi & Sensus Anggota** | • `AdminUserSeeder` & kustomisasi Register (input `phone_number`)<br>• Layout Navigasi `MemberLayout.tsx` (*Collapsible Sidebar* dengan `lucide-react`)<br>• Halaman Sensus Profil Dinamis (Lokal Batakan vs Perantau) & *Toggle Switch* `is_eligible_for_duty` | **IN PROGRESS** |
| **Milestone 3: Verifikasi & Penjadwalan Ibadah** | • Panel Admin Verifikasi Sensus Anggota (*Approve/Reject*)<br>• CRUD Jadwal Ibadah (`worship_schedules`)<br>• Algoritma *Fair-Shuffle Roster* (`schedule_rosters`) & *Banner* Tugas di Dashboard Anggota | **TO DO** |
| **Milestone 4: Galeri Terproteksi & Modul Keuangan** | • Manajemen Album & Foto Kegiatan (`activity_albums` & `activity_photos`) dengan proteksi unduh khusus anggota login<br>• Buku Kas Harian (`financial_ledgers`) & Generator PDF Surat LPJ Gereja (`financial_reports`) | **BACKLOG** |
| **Milestone 5: AI Assistant & Web Push Notification** | • Integrasi Chatbot Google Gemini API dengan injeksi konteks database<br>• Registrasi Service Worker (`push_subscriptions`) & Cron Job pengingat otomatis H-3 dan H-1 | **BACKLOG** |

---

## 6. Functional Requirements Detail

### 6.1 Modul Etalase Publik (Landing Page)
* **FR-01 Hero Section:** Menampilkan identitas *Klasis Walenrang Timur*, judul *PPGT Jemaat Batakan*, ayat tema **1 Korintus 3:11 (TB)**, serta tombol navigasi cepat dengan latar gambar gelap bernuansa `slate-800`.
* **FR-02 Renungan Harian & YouTube Embed:** Menampilkan artikel renungan harian, ayat Alkitab, nama penulis, dan pemutar video YouTube yang disejajarkan rata tengah (*align-center*).
* **FR-03 Jadwal Kegiatan Publik:** Menampilkan kartu jadwal ibadah pemuda, latihan, atau kegiatan khusus yang akan datang.
* **FR-04 Pratinjau Galeri & Struktur Pengurus:** Menampilkan cuplikan album kegiatan (dengan penguncian tombol unduh bagi pengunjung belum login) serta daftar BPH dan Bidang kepengurusan aktif.
* **FR-05 Accordion FAQ & Kotak Saran:** Menampilkan daftar tanya-jawab umum dan formulir pengiriman saran publik ke tabel `feedbacks`.

### 6.2 Modul Autentikasi, Navigasi & Sensus Anggota
* **FR-06 Registrasi & Autentikasi:** Formulir pendaftaran mencatat `name`, `email`, `phone_number` (unik), dan `password` (terenkripsi otomatis), dengan nilai awal `role = 'ppgt_member'`, `is_eligible_for_duty = false`, dan `duty_count = 0`.
* **FR-07 Collapsible Sidebar (`MemberLayout.tsx`):** Navigasi portal anggota menggunakan warna dasar `#1e293b`, indikator menu aktif `#dbeafe` dengan garis aksen kiri `#1d74f5`, serta mendukung mode buka/tutup (*collapse* `w-72` $\leftrightarrow$ `w-20`) yang tersimpan di `localStorage`.
* **FR-08 Formulir Sensus Dinamis (`SensusProfile`):**
  * Menyediakan pilihan status domisili: **Lokal di Batakan** (`lokal_batakan`) atau **Perantau** (`perantau`).
  * Field wajib dasar: Jenis Kelamin (`L`/`P`), Tanggal Lahir, Sektor di Batakan, Nama Orang Tua, dan Alamat Rumah di Batakan.
  * Field kondisional (wajib hanya jika `residence_type === 'perantau'`): Kota Rantau (`overseas_city`), Tujuan Merantau (`kuliah`/`kerja`/`lainnya`), Nama Kampus/Instansi (`institution_or_company`), dan Alamat Kos/Tempat Tinggal di Perantauan (`overseas_address`).
* **FR-09 Toggle Kesiapan Tugas (`is_eligible_for_duty`):** Anggota dapat mengubah status kesiapan melayani melalui *toggle switch* interaktif yang langsung mengirim *request* `router.put` tanpa *reload* halaman.
* **FR-10 Verifikasi Sensus oleh Admin:** Admin memeriksa perubahan sensus berstatus `pending` dan memilih **Approve** (mengubah status ke `approved`) atau **Reject** (mengubah status ke `rejected` disertai `rejection_note`).

### 6.3 Modul Jadwal Ibadah & Algoritma *Fair-Shuffle Roster*
* **FR-11 Manajemen Jadwal Ibadah:** Admin dapat membuat, mengubah, dan menghapus jadwal ibadah pada tabel `worship_schedules` (judul, kategori `ibadah_rutin`/`gabungan`/`latihan`/`event_khusus`, tanggal, waktu, lokasi/sektor, dan nama pengkhotbah).
* **FR-12 Algoritma Acak Pelayan Adil (*Fair-Shuffle*):**
  * Untuk setiap peran (`penghimpun`, `pemuzik`, `singer`, `kolektan`, `doa_syafaat`), sistem menarik kandidat dari tabel `users` dengan kriteria:
    $$\text{role} = \text{'ppgt\_member'} \quad \land \quad \text{is\_eligible\_for\_duty} = \text{true}$$
  * Kandidat diurutkan berdasarkan `duty_count` paling kecil (`ASC`), kemudian `last_duty_at` paling lama (`ASC`, `NULLS FIRST`), lalu diacak (`inRandomOrder()`) apabila terdapat nilai yang seri.
  * Saat jadwal disimpan/dikunci, sistem menambah `duty_count` sebesar $+1$ dan memperbarui `last_duty_at` sesuai tanggal ibadah pada akun petugas terpilih.
* **FR-13 Input Petugas Manual (`custom_name`):** Jika petugas bukan akun anggota terdaftar (misalnya Majelis Gereja atau tamu), Admin dapat mengetikkan nama secara manual pada kolom `custom_name`.
* **FR-14 Banner Pengingat Tugas:** Dashboard anggota menampilkan kartu peringatan mencolok di bagian paling atas apabila pengguna memiliki jadwal pelayanan yang akan datang.

### 6.4 Modul Keuangan & Generator Surat LPJ Gereja
* **FR-15 Buku Kas Harian (`financial_ledgers`):** Bendahara mencatat transaksi `income` atau `expense`, kategori, tanggal transaksi, nominal (`decimal(15,2)`), deskripsi, dan mengunggah foto nota (`receipt_image_path`).
* **FR-16 Rekapitulasi & Generator PDF Surat LPJ (`financial_reports`):** Sistem menghitung otomatis `total_income`, `total_expense`, dan `ending_balance` pada periode terpilih, menyematkan Nomor Surat resmi dan kop PPGT Jemaat Batakan, lalu mengekspornya menjadi berkas PDF siap cetak dengan pelacakan status (`draft`, `submitted_to_church`, `verified_by_church`).

### 6.5 Modul Galeri Terproteksi, AI Assistant & Web Push Notification
* **FR-17 Proteksi Unduh Galeri:** Pengunjung publik hanya dapat melihat sampul album kegiatan, sedangkan anggota yang login dapat membuka *lightbox* dan mengunduh foto resolusi asli dari `activity_photos`.
* **FR-18 Konsultasi AI Rohani (Gemini API):** Chatbot di portal anggota menjawab pertanyaan seputar jadwal ibadah, membantu menyusun pokok doa, dan menjelaskan renungan harian dengan konteks data dari database PPGT Batakan.
* **FR-19 Web Push Notification (H-3 & H-1):** Sistem menjalankan *scheduled command* harian untuk memeriksa jadwal ibadah pada $H-3$ dan $H-1$, mengirim *Web Push Notification* ke browser HP petugas melalui data `push_subscriptions`, dan menandai `notified_h3 = true` / `notified_h1 = true`.

---

## 7. User Flows (Alur Pengguna Utama)

### 7.1 Alur Registrasi, Sensus Mandiri & Verifikasi Admin
```
[Pemuda Buka Web] 
   --> [Klik Daftar & Isi Nama, Email, No. WA, Password]
   --> [Akun Terbuat: role='ppgt_member', is_eligible_for_duty=false]
   --> [Masuk ke Dashboard / Sensus Profil]
   --> [Pilih Domisili: Lokal Batakan ATAU Perantau]
         |-- Jika Lokal Batakan: Isi Sektor, Orang Tua, Alamat Batakan (Kolom Rantau dikosongkan otomatis)
         |-- Jika Perantau: Isi Sektor & Keluarga + Wajib Isi Kota Rantau, Tujuan, Kampus/Instansi, Alamat Rantau
   --> [Klik Simpan --> Status Sensus: 'pending']
   --> [Admin Cek di Panel Verifikasi]
         |-- Klik Approve --> Status: 'approved' (Jika Lokal, aktifkan is_eligible_for_duty = true)
         |-- Klik Reject  --> Status: 'rejected' + Catatan Perbaikan tampil di Banner Anggota
```

### 7.2 Alur Penjadwalan Ibadah & Algoritma *Fair-Shuffle Roster*
```
[Admin Buat Jadwal Ibadah Baru (Tanggal, Lokasi/Sektor, Pengkhotbah)]
   --> [Admin Klik Tombol "Acak Pelayan Otomatis"]
   --> [Sistem Filter User: is_eligible_for_duty == true]
   --> [Sistem Urutkan: duty_count ASC, last_duty_at ASC, Random Tie-Breaker]
   --> [Sistem Tempatkan ke 5 Peran: Penghimpun, Pemusik, Singer, Kolektan, Doa Syafaat]
   --> [Admin Tinjau & Simpan Jadwal]
   --> [Sistem Update User Terpilih: duty_count + 1 & last_duty_at = event_date]
   --> [Anggota Terpilih Login: Tampil Banner Tugas di Dashboard]
   --> [Cron Job H-3 & H-1: Kirim Web Push Notification ke HP Anggota Terpilih]
```

### 7.3 Alur Pencatatan Keuangan & Cetak PDF Surat LPJ Gereja
```
[Bendahara Login]
   --> [Input Transaksi Masuk/Keluar + Upload Foto Nota di Buku Kas (financial_ledgers)]
   --> [Di Akhir Bulan/Periode: Buka Menu Laporan LPJ (financial_reports)]
   --> [Pilih Rentang Tanggal (period_start s/d period_end) & Input Nomor Surat]
   --> [Sistem Hitung Otomatis: Total Pemasukan, Total Pengeluaran, Saldo Akhir]
   --> [Klik Generate PDF Surat LPJ Ber-Kop Resmi PPGT Jemaat Batakan]
   --> [Cetak & Serahkan ke Majelis Gereja --> Update Status: 'verified_by_church']
```

---

## 8. Data Model Sketch (Arsitektur 13 Tabel & Standar Eloquent)

### 8.1 Ringkasan Skema 13 Tabel Relasional

| No | Nama Tabel | Model Eloquent | Relasi Eloquent Utama | Kolom Kunci & Tipe Data Penting |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `users` | `User` | `hasOne(PpgtProfile)`<br>`hasMany(ScheduleRoster)`<br>`hasMany(PushSubscription)` | `name`, `email`, `phone_number`, `role` (`admin`, `treasurer`, `ppgt_member`), `is_eligible_for_duty` (bool), `duty_count` (int), `last_duty_at` (date) |
| 2 | `ppgt_profiles` | `PpgtProfile` | `belongsTo(User)`<br>`belongsTo(User, 'verified_by')` | `user_id`, `residence_type` (`lokal_batakan`, `perantau`), `gender`, `birth_date`, `sector_in_batakan`, `batakan_home_address`, `parent_names`, `overseas_city`, `overseas_address`, `overseas_purpose`, `institution_or_company`, `verification_status` (`pending`, `approved`, `rejected`), `rejection_note` |
| 3 | `push_subscriptions` | `PushSubscription` | `belongsTo(User)` | `user_id`, `endpoint`, `public_key` (`p256dh`), `auth_token` |
| 4 | `worship_schedules` | `WorshipSchedule` | `hasMany(ScheduleRoster)`<br>`belongsTo(User, 'created_by')` | `title`, `category`, `event_date` (date), `start_time`, `location`, `preacher_name`, `description`, `created_by` |
| 5 | `schedule_rosters` | `ScheduleRoster` | `belongsTo(WorshipSchedule)`<br>`belongsTo(User)` | `schedule_id`, `user_id` (nullable), `custom_name` (nullable), `duty_role` (`penghimpun`, `pemuzik`, `singer`, `kolektan`, `doa_syafaat`), `notified_h3` (bool), `notified_h1` (bool) |
| 6 | `devotionals` | `Devotional` | `belongsTo(User, 'created_by')` | `title`, `bible_verse`, `content`, `youtube_url`, `cover_image`, `author_name`, `published_at`, `created_by` |
| 7 | `board_members` | `BoardMember` | *Standalone* | `name`, `position`, `department`, `period_year`, `photo_path`, `phone_number`, `display_order`, `is_active` (bool) |
| 8 | `activity_albums` | `ActivityAlbum` | `hasMany(ActivityPhoto)`<br>`belongsTo(User, 'created_by')` | `title`, `event_date` (date), `description`, `cover_image_path`, `created_by` |
| 9 | `activity_photos` | `ActivityPhoto` | `belongsTo(ActivityAlbum, 'album_id')` | `album_id`, `image_path`, `caption` |
| 10 | `financial_ledgers` | `FinancialLedger` | `belongsTo(User, 'created_by')` | `transaction_date` (date), `type` (`income`, `expense`), `category`, `amount` (`decimal(15,2)`), `description`, `receipt_image_path`, `created_by` |
| 11 | `financial_reports` | `FinancialReport` | `belongsTo(User, 'created_by')` | `title`, `letter_number`, `period_start` (date), `period_end` (date), `total_income`, `total_expense`, `ending_balance`, `status` (`draft`, `submitted_to_church`, `verified_by_church`), `pdf_file_path`, `created_by` |
| 12 | `feedbacks` | `Feedback` | *Standalone* | `sender_name`, `sender_contact`, `message`, `is_read` (bool) |
| 13 | `faqs` | `Faq` | *Standalone* | `question`, `answer`, `category`, `display_order`, `is_active` (bool) |

### 8.2 Aturan Teknis & Konvensi Model Eloquent
* **Mass Assignment Protection:** Seluruh model menggunakan `protected $guarded = ['id'];` agar primary key `id` terlindungi dari manipulasi input massal.
* **Type Casting (`$casts`):**
  * Kolom boolean (`is_eligible_for_duty`, `notified_h3`, `notified_h1`, `is_active`, `is_read`) di-*cast* ke `'boolean'` agar menghasilkan nilai murni `true`/`false` di PHP dan React TypeScript.
  * Kolom tanggal (`birth_date`, `last_duty_at`, `event_date`, `transaction_date`, `period_start`, `period_end`) di-*cast* ke `'date'` (objek Carbon).
  * Kolom `password` pada `User` di-*cast* ke `'hashed'`.
* **Konvensi Penamaan:** Nama Class Model menggunakan *PascalCase Singular* (`PpgtProfile`, `WorshipSchedule`), method relasi satu data (`hasOne`, `belongsTo`) menggunakan *camelCase Singular* (`profile`, `creator`), dan relasi banyak data (`hasMany`) menggunakan *camelCase Plural* (`rosters`, `photos`).

---

## 9. Edge Cases & Handling (Kasus Batas & Penanganan Teknis)

| No | Skenario Kasus Batas (*Edge Case*) | Solusi & Penanganan Teknis (*System Handling*) |
| :-: | :--- | :--- |
| 1 | **Anggota Lokal Berubah Menjadi Perantau / Izin Mendadak Setelah Terjadwal:** Anggota yang sudah masuk ke dalam jadwal ibadah minggu depan tiba-tiba sakit atau berangkat merantau. | • Saat anggota mengubah domisili menjadi `perantau`, sistem otomatis mengubah `is_eligible_for_duty = false`.<br>• Pada halaman jadwal Admin, tersedia tombol **"Ganti / Kocok Ulang 1 Petugas"** pada baris `schedule_rosters` terkait tanpa mengacak ulang petugas lainnya, serta mengembalikan `duty_count - 1` pada anggota yang batal bertugas. |
| 2 | **Jumlah Anggota Aktif Kurang dari Kebutuhan Roster atau Pelayan dari Luar PPGT:** Misalnya pengkhotbah atau pemusik berasal dari Majelis Gereja/senior yang tidak memiliki akun PPGT. | • Kolom `user_id` pada tabel `schedule_rosters` dirancang `nullable`.<br>• Admin dapat mengisi kolom `custom_name` (teks bebas) jika posisi tersebut diisi oleh pelayan tamu atau jika kuota anggota `is_eligible_for_duty = true` sedang tidak mencukupi. |
| 3 | **Anggota Mengubah Data Sensus dari *Perantau* Kembali ke *Lokal Batakan*:** Data lama di kolom rantau (`overseas_city`, dll.) berisiko tertinggal di database dan membingungkan Admin. | • Pada `MemberDashboardController::updateProfile()`, jika `residence_type === 'lokal_batakan'`, sistem secara eksplisit mengosongkan (`null`) keempat kolom perantauan (`overseas_city`, `overseas_address`, `overseas_purpose`, `institution_or_company`) dan mereset `verification_status = 'pending'`. |
| 4 | **Browser HP Anggota Memblokir Izin *Web Push Notification*:** Anggota menolak *prompt* izin notifikasi di browser atau menggunakan perangkat yang tidak mendukung Web Push. | • Sistem tetap menampilkan **Banner Peringatan Tugas** mencolok di bagian paling atas Dashboard saat anggota login.<br>• Pada tabel jadwal Admin, disediakan tombol pintas **"Ingatkan via WhatsApp"** yang membuka tautan `https://wa.me/{phone_number}` dengan teks pesan pengingat otomatis. |
| 5 | **Gangguan / *Rate Limit* pada Google Gemini API:** Saat anggota mengirim pesan ke AI Rohani, koneksi internet terputus atau kuota API Gemini sedang penuh. | • Backend membungkus pemanggilan API Gemini di dalam blok `try-catch` dengan batas *timeout* $10$ detik.<br>• Jika gagal, chatbot menampilkan pesan *fallback* yang ramah dan menyarankan pengguna melihat bagian FAQ atau menghubungi Pengurus Bidang Kerohanian. |
| 6 | **Perubahan Transaksi Kas Setelah Surat LPJ Disahkan Gereja:** Bendahara tidak sengaja mengedit transaksi bulan lalu yang laporannya sudah diserahkan ke Majelis Gereja. | • Laporan pada `financial_reports` yang sudah berstatus `verified_by_church` dikunci (*read-only*) beserta nilai rekapitulasinya agar histori dokumen PDF yang telah dicetak tetap konsisten dan dapat dipertanggungjawabkan. |

---

## 10. Success Metrics

Keberhasilan implementasi Portal Web & Sistem Informasi Manajemen PPGT Jemaat Batakan diukur menggunakan **4 indikator kinerja utama (*Key Performance Indicators*)** berikut:

* **Keadilan Penjadwalan:** Standar deviasi ($\sigma$) jumlah penugasan antar-anggota aktif $< 2$ (semua anggota aktif yang berstatus `is_eligible_for_duty = true` mendapat kesempatan melayani secara seimbang dalam kurun waktu $3$ bulan).
* **Efisiensi Administrasi Keuangan:** Waktu pembuatan Surat LPJ Keuangan ke Majelis Gereja berkurang dari $3\text{--}4$ hari menjadi $< 10$ menit (otomatisasi rekapitulasi kas & generator PDF ber-kop resmi).
* **Tingkat Kehadiran Pelayan:** Penurunan angka ketidakhadiran pelayan ibadah hingga mendekati $0\%$ berkat pengingat otomatis pada $H-3$ & $H-1$ (*Web Push Notification* dan *Dashboard Banner*).
* **Adopsi AI Assistant:** Minimal $50\%$ anggota yang login memanfaatkan fitur Gemini Chatbot untuk memantau jadwal pelayanan dan memperdalam pemahaman renungan harian.