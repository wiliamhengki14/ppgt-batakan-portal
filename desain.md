# PANDUAN SISTEM DESAIN & TATA KELOLA UI/UX (DESIGN SYSTEM)
## Web Portal & Sistem Informasi Manajemen PPGT Jemaat Batakan
**Klasis Walenrang Timur — Gereja Toraja**  
*“Karena tidak ada seorang pun yang dapat meletakkan dasar lain dari pada dasar yang telah diletakkan, yaitu Yesus Kristus.” (1 Korintus 3:11 TB)*

---

## 1. Filosofi & Arah Desain (*Design Philosophy*)

Sistem Desain Portal PPGT Jemaat Batakan dibangun untuk menyajikan perpaduan antara **kesegaran generasi muda (vibrant youth)**, **keagungan persekutuan rohani gereja**, dan **efisiensi sistem manajemen modern**. 

### Nilai Desain Utama (*Core Principles*):
1. **Bersih & Terstruktur (*Clean & Structured Hierarchy*):** Mengutamakan keterbacaan data informasi jadwal ibadah, roster pelayan, dan pendataan sensus anggota tanpa distraksi visual berlebih.
2. **Karakter Khas Pemuda PPGT (*Youthful & Vibrant*):** Memakai warna utama *Electric Blue* (`#3A86FF`) yang dipadukan aksen *Amber Warmth* untuk merepresentasikan semangat melayani, talenta, dan persekutuan yang hangat.
3. **Sentuhan Toraja Kontemporer (*Contemporary Toraja Tint*):** Latar belakang permukaan menggunakan warna dasar sejuk bertema Toraja (`#f8f9ff`) dengan aksen tipografi rapi, badge modern, dan e-KTA bermotif elegan.
4. **Resposif & Mengutamakan Mobile (*Mobile-First Usability*):** Semua elemen navigasi (sidebar collapsible, drawer mobile, modal, kartu metrik) dirancang bekerja sempurna di layar ponsel cerdas anggota jemaat hingga layar monitor monitor desktop pengurus.
5. **Aksentuasi Halus & Dinamis (*Micro-interactions & Smooth Motion*):** Menggunakan animasi *reveal on scroll*, transisi hover kartu interaktif, dan feedback visual seketika (toast, indikator aktif, status verifikasi).

---

## 2. Fondasi Tipografi (*Typography*)

Aplikasi menggunakan kombinasi font sans-serif modern yang telah dikonfigurasi melalui `@vite` dan Google Fonts / Bunny Fonts CDN serta stylesheet global:

### 2.1 Konfigurasi Font Family
- **Font Utama Tailwind:** `'Figtree', ui-sans-serif, system-ui, sans-serif` (didefinisikan di `tailwind.config.js`).
- **Font Fallback Global:** `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif` (didefinisikan di `resources/css/app.css`).
- **Font Kode / Nomor Identitas (Monospace):** `font-mono` (untuk ID Anggota PPGT-BTK-XXXX, QR Code label, nominal kas).

```css
/* resources/css/app.css */
html, body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: white;
    overflow-x: clip;
    max-width: 100vw;
}
```

### 2.2 Hirarki Teks (*Type Scale & Text Hierarchy*)

| Tingkat / Peruntukan | Kelas Tailwind | Ukuran / Bobot | Kasus Penggunaan (*Usage*) |
| :--- | :--- | :--- | :--- |
| **Page / Greeting Title** | `text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900` | 24px - 30px, 800 | Judul ucapan salam dashboard, judul utama halaman sensus |
| **Section Header** | `text-base sm:text-lg font-bold text-slate-900` | 16px - 18px, 700 | Judul kartu besar (Jadwal Ibadah, Warta Pemuda, Form Sensus) |
| **Card / Sub-Header** | `text-sm sm:text-base font-bold text-slate-900` | 14px - 16px, 700 | Judul pengumuman warta, judul agenda, judul dialog modal |
| **Section Number Step** | `w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold` | 12px, 700 | Nomor langkah formulir sensus (1, 2, 3) |
| **Input / Form Label** | `text-xs font-bold uppercase tracking-wider text-slate-700` | 12px, 700, All-Caps | Label di atas input, select option, dan date picker |
| **Body & Deskripsi** | `text-xs sm:text-sm text-slate-600 leading-relaxed` | 12px - 14px, 400 | Isi warta, renungan, petunjuk bantuan, deskripsi umum |
| **Card Metric Number** | `text-lg sm:text-xl font-bold text-slate-900` | 18px - 20px, 700 | Angka statistik kartu (Saldo Kas, Jumlah Pemuda, Riwayat Tugas) |
| **Sub-Label / Meta / Timestamp** | `text-[11px] text-slate-400 font-medium` | 11px, 500 | Jam postingan, keterangan footer card, petunjuk hint kecil |
| **Badge / Status Pill** | `text-[11px] sm:text-xs font-bold` | 11px - 12px, 700 | Status verifikasi, penanda waktu WITA, chip kategori |

---

## 3. Sistem Palet Warna (*Color Palette*)

### 3.1 Warna Utama Organisasi (*Brand Colors*)

```
[ Primary Brand #3A86FF ]     [ Primary Hover #1D74F5 ]     [ Primary Soft #DBEAFE ]     [ App Surface #F8F9FF ]
```

- **Primary Brand (`#3A86FF`):** Warna biru cerah elektrik khas PPGT Batakan. Digunakan untuk Sidebar, Tombol Primer, fokus input form, border aktif, dan ikon sorotan.
- **Primary Deep / Hover (`#1d74f5`):** Digunakan untuk garis indikator sidebar aktif, tombol bulat toggle sidebar, dan efek hover/active.
- **Primary Soft Tint (`bg-blue-50`, `bg-[#dbeafe]`, `border-blue-100` / `border-blue-200`):** Digunakan untuk latar menu sidebar aktif, kartu roster bertugas, dan pill info.
- **Background Utama Aplikasi (`#f8f9ff`):** Dinamakan kelas `.toraja-pattern`, memberikan nuansa sejuk bersih bernada kebiruan yang nyaman di mata.

### 3.2 Warna Fungsional & Semantik (*Functional & Semantic Colors*)

| Kategori | Hex / Kelas Tailwind | Tampilan Visual | Contoh Penggunaan |
| :--- | :--- | :--- | :--- |
| **Primary (Aksi Utama)** | `#3A86FF`<br>`bg-[#3A86FF]` | Biru Elektrik | Tombol simpan, navbar link, banner megaphone, brand header |
| **Success (Disetujui/Siap)** | `emerald-500` / `emerald-600`<br>`bg-emerald-50 text-emerald-700` | Hijau Zamrud | Badge "Verifikasi Disetujui", "Siap Ditugaskan", Saldo Kas Positif |
| **Warning / Aksen Hangat** | `amber-500` / `amber-600`<br>`bg-amber-50 text-amber-800` | Kuning Keemasan | Pill "H-3 Jelang Ibadah", Talenta Terpilih, Bintang Tugas, Mode Roster |
| **Danger / Peringatan** | `rose-500` / `rose-600`<br>`bg-rose-50 text-rose-600` | Merah Mawar | Asterisk wajib (`*`), Input error border/text, Tombol Keluar, Badge "Ditolak" |
| **Info / Perantau** | `sky-500` / `sky-600`<br>`bg-sky-50 text-sky-800` | Biru Langit | Badge "Mode Perantau", Panduan mutasi diaspora rantau |
| **Dark Slate (Struktur)** | `#1e293b` & `#0f172a`<br>`bg-slate-900` | Slate Gelap Pekat | Topbar Mobile HP, Kartu e-KTA digital, Toast notification, Tooltip |

### 3.3 Tingkatan Warna Netral (*Neutral Scale - Slate*)
- **`#ffffff` (White):** Latar belakang kartu (*Card*), header topbar, input form.
- **`bg-slate-50` / `bg-slate-100`:** Latar belakang container upload avatar, sub-kotak roster, hover menu item.
- **`border-slate-200`:** Garis tepi standar (*default border*) seluruh kartu dan kontainer.
- **`text-slate-900` / `text-slate-800`:** Teks judul dan tulisan berbobot tebal.
- **`text-slate-600` / `text-slate-500`:** Teks paragraf isi dan label sekunder.
- **`text-slate-400`:** Teks placeholder, timestamp, dan garis pemisah pembagi (*divider*).

---

## 4. Sistem Tata Letak (*Layout Architecture*)

Aplikasi menggunakan layout induk terpadu di `resources/js/Layouts/MemberLayout.tsx`:

```
+------------------------------------------------------------------------------------+
|  [Mobile Topbar - Hanya di layar < lg] (Logo + PPGT Jemaat Batakan + Hamburger)    |
+-------------------+----------------------------------------------------------------+
|                   |  [TopNavBar Sticky Header]                                      |
|  SIDEBAR DESKTOP  |  Breadcrumb / Search Bar / Bell Notif / Badge Sensus / Profil   |
|  (Fixed di Kiri)  +----------------------------------------------------------------+
|  Lebar Collapsible|                                                                |
|  w-72 <-> w-20    |  KONTEN UTAMA HALAMAN (Main Content)                            |
|                   |  - Background: #f8f9ff                                         |
|  - Logo & Brand   |  - Responsive Padding: p-4 sm:p-6 lg:p-8                       |
|  - 7 Menu Items   |  - Dual Column (65% / 35%) atau Form Sensus Full-Width          |
|  - Tombol Logout  |                                                                |
+-------------------+----------------------------------------------------------------+
```

### 4.1 Sidebar Navigasi Desktop (`lg:block`)
- **Tampilan Standar (*Expanded*):** Lebar `w-72` dengan teks penuh label menu dan info klasis.
- **Tampilan Terlipat (*Collapsed Mode*):** Lebar `w-20` dengan ikon berada di tengah dan teks disembunyikan. Status disimpan ke `localStorage('ppgt_sidebar_collapsed')`.
- **Tombol Toggle Collapsible:**
  - Lingkaran bulat berdiameter 28px (`size-7`) melayang di batas luar kanan sidebar (`absolute -right-3.5 top-9`).
  - Style: `rounded-full border-2 border-white bg-[#1d74f5] text-white shadow-md hover:bg-blue-600 cursor-pointer`.
  - Menggunakan ikon `ChevronLeft` (saat terbuka) dan `ChevronRight` (saat tertutup).
- **Indikator Menu Aktif:**
  - Background: `bg-[#dbeafe]` dengan teks `text-slate-900 font-bold`.
  - Garis aksen kiri (*Accent Pill Bar*): `before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1.5 before:rounded-r-full before:bg-[#1d74f5]`.
- **Menu Inaktif:**
  - Style: `font-medium text-white hover:bg-slate-800/70 hover:text-white rounded-xl`.
- **Tooltip Saat Mode Tutup:**
  - Kotak melayang: `fixed left-20 ml-2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg border border-slate-700 z-50`.
- **Tombol Keluar (*Logout*):**
  - Berada di baris terbawah dengan border pembatas `border-t border-slate-700/80`.
  - Style: `hover:bg-rose-500/10 hover:text-rose-400`. Menampilkan Modal Konfirmasi sebelum keluar sesi.

### 4.2 Topbar & Drawer Navigasi Mobile (`< lg`)
- **Sticky Topbar HP:**
  - Background gelap pekat: `bg-[#1e293b] text-white px-4 py-3 sticky top-0 z-40 shadow-md`.
  - Logo aplikasi ukuran `w-9 h-9`, teks "PPGT Jemaat Batakan" (14px font-bold) & "Klasis Walenrang Timur" (11px text-slate-400).
  - Tombol Hamburger Menu (`Menu` / `X`).
- **Drawer Slide-Over:**
  - Backdrop semi-transparan `fixed inset-0 bg-black/50 backdrop-blur-xs`.
  - Drawer sidebar `w-72 max-w-[80vw] h-full shadow-2xl` yang menampilkan menu secara utuh.

### 4.3 Header Halaman Atas (*TopNavBar*)
Header melekat (*sticky top*) dengan tinggi `h-16`, background putih bersih, dan garis tepi `border-b border-slate-200 shadow-xs`.
- **Kiri (Breadcrumbs):**
  - Tag kategori: `text-[11px] font-bold text-[#3A86FF] uppercase tracking-wider` ("PORTAL PEMUDA").
  - Separator slash: `text-slate-400 text-xs` (" / ").
  - Nama halaman: `text-[11px] text-slate-500 font-medium` ("Beranda" / "Sensus Profile").
  - Title utama: `text-base sm:text-lg font-bold text-slate-900 tracking-tight` ("PPGT Jemaat Batakan").
- **Tengah (Search Bar Input):**
  - Hidden di HP, tampil di `sm:block` dengan lebar `w-64 lg:w-80`.
  - Memakai komponen `Input` dengan ikon `Search`, styling kompak: `!py-2 !text-xs bg-white focus:!border-[#3A86FF]`.
- **Kanan (Actions & Profile Pill):**
  - **Lonceng Notifikasi:** `p-2 rounded-xl text-slate-500 hover:bg-slate-100 relative` dengan titik merah *notification dot* (`w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white`).
  - **Badge Status Sensus:** Pill terverifikasi / pending bergaris halus.
  - **User Pill:** Avatar persegi bulat (`w-9 h-9 rounded-xl object-cover ring-2 ring-blue-100`), nama pengguna (12px font-extrabold max-w-[140px] truncate), dan role (11px text-slate-500 "Anggota PPGT" / "Pengurus BPH").

---

## 5. Komponen UI Kustom (*Custom UI Components*)

Aplikasi memiliki komponen UI modular yang konsisten di `resources/js/Components/ui/`:

### 5.1 Komponen Tombol (*Button Component*)
Lokasi: `resources/js/Components/ui/Button/Button.tsx`

```tsx
import Button from '@/Components/ui/Button/Button';

// 1. Tombol Primer (Default / Utama)
<Button color="primer" type="submit">
    <Save className="w-4 h-4" />
    <span>Simpan Perubahan</span>
</Button>

// 2. Tombol Sekunder (Garis Tepi & Transparan)
<Button color="sekunder" type="button" onClick={handleDownload}>
    <Download className="w-4 h-4" />
    <span>Unduh Dokumen</span>
</Button>
```

#### Spesifikasi Styling Button:
- **Base Class:**
  ```css
  py-3 px-5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0
  ```
- **Varian Warna (`color`):**
  - `primer`: `bg-[#3A86FF] text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 border border-transparent`
  - `sekunder`: `bg-transparent border border-[#3A86FF] text-[#3A86FF] hover:bg-[#3A86FF]/10`
- **Varian Sekunder Putih / Abu (Kompak):**
  Digunakan di kartu aksi dashboard:
  ```css
  !py-2 !px-3.5 !text-xs !font-semibold !bg-white hover:!bg-blue-50/50 !border-blue-200 !text-[#3A86FF]
  ```
- **Varian Danger / Batalkan:**
  ```css
  rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700
  ```
- **State Disabled:**
  `disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`

---

### 5.2 Komponen Form & Input (*Input Component*)
Lokasi: `resources/js/Components/ui/Input/Input.tsx`

```tsx
import Input from '@/Components/ui/Input/Input';

<Input
    id="telepon"
    name="telepon"
    label="Nomor WhatsApp Aktif"
    required
    type="tel"
    icon={<MessageCircle className="w-4 h-4 text-slate-400" />}
    placehoder="0812xxxx"
    error={errors.phone}
    rightElement={
        <span className="text-emerald-700 text-xs font-semibold flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Terhubung
        </span>
    }
/>
```

#### Spesifikasi Styling Input:
- **Label:** `text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between`
  - Tanda Wajib: `<span className="text-rose-500">*</span>`
- **Field Input:**
  ```css
  w-full py-3 bg-white text-sm text-slate-800 placeholder-slate-500 rounded-xl outline-none transition-all duration-200
  border-[#3A86FF] focus:ring-2 focus:ring-[#3A86FF]/25 focus:border-[#3A86FF]
  ```
  - Padding dengan Ikon Kiri: `pl-11` (tanpa ikon: `pl-4`).
  - Padding dengan Elemen Kanan: `pr-11` (tanpa elemen: `pr-4`).
- **State Error Validasi:**
  - Field: `border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20`
  - Pesan Error: `text-rose-500 text-xs font-medium flex items-center gap-1 mt-0.5` dilengkapi ikon svg alert.

---

### 5.3 Elemen Form Lainnya

#### a) Dropdown Select
Digunakan untuk jenis kelamin, wilayah sektor, dan rencana kepulangan. Disesuaikan dengan estetika Input:
```css
w-full py-3 border-[#3A86FF] bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-[#3A86FF]/25 focus:border-[#3A86FF] transition-all duration-200
```

#### b) Switch Toggle Kesiapan Melayani (iOS Style)
Digunakan untuk `is_eligible_for_duty` dan pengingat push reminder:
```html
<label class="relative inline-flex items-center cursor-pointer shrink-0">
    <input type="checkbox" class="sr-only peer" checked />
    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3A86FF]"></div>
</label>
```

#### c) Multi-Select Tag Chips (Talenta & Minat)
Digunakan untuk memilih talenta pelayanan:
- **Saat Tidak Terpilih:** `bg-white border-slate-200 text-slate-600 hover:border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium`
- **Saat Terpilih (Active):** `bg-amber-100 text-amber-900 border-amber-400 font-bold shadow-xs rounded-lg px-3 py-1.5 text-xs sm:text-sm`

#### d) Segmented Pill Switcher (Lokal vs Perantau)
Tab pemilih tipe domisili di formulir sensus:
- **Container Box:** `inline-flex p-1 rounded-xl bg-blue-400 text-white border border-[#3a68ff] shadow-inner`
- **Tab Aktif:** `bg-amber-500 text-slate-950 font-bold shadow-sm rounded-lg px-4 py-2 text-xs sm:text-sm`
- **Tab Inaktif:** `text-white font-medium hover:text-white/80 rounded-lg px-4 py-2 text-xs sm:text-sm`

---

## 6. Desain Kartu & Kontainer (*Cards & Containers*)

### 6.1 Kartu Standar Permukaan (*Standard Surface Card*)
Semua kartu di dashboard dan form sensus menggunakan radius lengkung sudut besar dan border tipis elegan:
```css
bg-white rounded-2xl border border-slate-200 shadow-xs p-6 hover:shadow-md transition-all duration-300
```

### 6.2 Kartu Metrik Ringkas (*Metric Statistic Card*)
Digunakan pada 4 kolom indikator ringkas di bagian atas dashboard:
- **Struktur Kartu:** `bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-blue-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300`
- **Icon Container:** `w-8 h-8 rounded-lg bg-blue-50 text-[#3A86FF] flex items-center justify-center`
- **Footer Card:** `mt-3 pt-2.5 border-t border-slate-100 text-[11px] flex items-center justify-between`

### 6.3 Banner Pengumuman Pelayanan (H-3)
Banner pemberitahuan tugas pelayan ibadah terdekat:
- **Card Container:** `rounded-2xl border-none shadow-[0px_0px_4px_rgba(0,0,0,0.2)] bg-white p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4`
- **Icon Box:** `w-11 h-11 rounded-xl bg-[#3A86FF] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20`
- **Badge Kategori:** `px-2 py-0.5 rounded text-[11px] font-bold bg-[#3A86FF] text-white tracking-wide uppercase`
- **Badge Countdown:** `px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200`

---

## 7. Sistem Lencana & Status (*Badges & Status Pills*)

| Status Sensus / Data | Tampilan Badge | CSS Classes |
| :--- | :--- | :--- |
| **Terverifikasi (Approved)** | Hijau Terang | `px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5` |
| **Menunggu (Pending)** | Biru Muda Lembut | `px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#3A86FF] border border-blue-100 flex items-center gap-1.5` |
| **Ditolak / Perbaikan** | Merah Mawar | `px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5` |
| **Waktu / Tanggal WITA** | Biru Netral | `px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#3A86FF] border border-blue-100` |
| **Label Sektor Ibadah** | Biru Solid | `px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#3A86FF] text-white` |
| **Aksen Roster (Anda)** | Biru Aksen Khusus | `bg-blue-50 p-2.5 rounded-xl border border-blue-200 text-[#3A86FF] font-bold` |

---

## 8. Dialog Modal & Notifikasi Toast (*Modals & Overlays*)

### 8.1 Standar Modal Dialog
Semua modal (`Modal Konfirmasi Keluar`, `Pengajuan Tukar Jadwal`, dan `Kartu e-KTA`) mematuhi struktur:
- **Backdrop:** `fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4`
- **Panel Dialog:** `bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200`
- **Header Modal:** `flex items-center justify-between pb-3 border-b border-slate-200`

### 8.2 Desain Spesial: Kartu Anggota Digital (e-KTA)
Didesain khusus untuk memberikan kebanggaan bagi pemuda PPGT Batakan:
- **Latar Belakang e-KTA:** `bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e3a8a] border border-blue-400/30 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden`
- **Efek Glow:** Lingkaran blur lembut di sudut (`bg-blue-500/10` dan `bg-amber-500/10`).
- **Elemen Identitas:** Logo PPGT, Nama Gereja, Pas Foto persegi bulat berbingkai putih (`border-2 border-white/40`), Nomor ID format `PPGT-BTK-YYYY-XXX`, status domisili, daftar talenta, dan QR Code resmi.
- **Aksi Cetak:** Mendukung tombol `Cetak / Simpan PDF` yang memanggil `window.print()` langsung dari browser.

### 8.3 Notifikasi Toast Mengambang (*Floating Toast*)
Toast feedback muncul di sudut kanan bawah layar saat aksi berhasil (misal: simpan sensus, konfirmasi hadir, tukar jadwal):
```tsx
<div className={`fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 transition-all duration-300 pointer-events-none ${
    toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
}`}>
    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
    <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
</div>
```

---

## 9. Animasi, Transisi & Aksesibilitas (*Motion & Interactions*)

Aplikasi menggunakan sistem animasi halus tanpa library berat eksternal, memanfaatkan `IntersectionObserver` native yang ringan dan efisien:

### 9.1 CSS Classes Animasi Reveal
```css
/* 1. Reveal dari Bawah (Vertical / Y-Axis) */
.reveal-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
    will-change: opacity, transform;
}
.reveal-on-scroll.revealed {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 2. Reveal dari Kiri (Slide-In dari Kiri) */
.reveal-from-left {
    opacity: 0;
    transform: translateY(25px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
    will-change: opacity, transform;
}
.reveal-from-left.revealed {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 3. Reveal dari Kanan (Slide-In dari Kanan) */
.reveal-from-right {
    opacity: 0;
    transform: translateY(25px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
    will-change: opacity, transform;
}
.reveal-from-right.revealed {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 4. Delay Bertingkat (Stagger) */
.reveal-delay-100.revealed { transition-delay: 150ms; }
.reveal-delay-200.revealed { transition-delay: 300ms; }
.reveal-delay-300.revealed { transition-delay: 450ms; }
.reveal-delay-400.revealed { transition-delay: 600ms; }

/* 5. Aksesibilitas: Matikan Animasi jika Pengguna Mengatur 'Reduce Motion' */
@media (prefers-reduced-motion: reduce) {
    .reveal-on-scroll,
    .reveal-from-left,
    .reveal-from-right {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
    }
}
```

---

## 10. Standar Ikonografi (*Iconography Guidelines*)

Aplikasi menggunakan pustaka **`lucide-react`** secara konsisten di seluruh halaman:
- **Ukuran Standar:**
  - `w-3.5 h-3.5` / `w-4 h-4`: Ikon pendamping teks kecil, input search, dan tombol ringkas.
  - `w-5 h-5` / `size-5`: Ikon menu sidebar navigasi, header card, dan modal title.
  - `w-8 h-8` s/d `w-12 h-12`: Ikon placeholder kosong avatar dan ilustrasi fitur.
- **Daftar Ikon Berdasarkan Konteks:**
  - **Navigasi Utama:** `LayoutGrid` (Beranda), `UserCheck` (Sensus), `CalendarDays` (Jadwal), `Images` (Galeri), `BookOpen` (Renungan), `Bot` (AI), `CircleHelp` (FAQ).
  - **Identitas & Anggota:** `User`, `UserCheck`, `CreditCard`, `Camera`, `Phone`, `Mail`, `MapPin`, `Home`.
  - **Perantau / Diaspora:** `PlaneTakeoff`, `PlaneLanding`, `Building2`.
  - **Tugas & Roster:** `CalendarCheck`, `ArrowLeftRight`, `Shuffle`, `CheckCircle2`, `Music`, `Mic`.
  - **Keuangan & Warta:** `Wallet`, `Megaphone`, `Download`, `Printer`, `HeartHandshake`.

---

## 11. Panduan Pengembangan Halaman Baru (*New Page Checklist*)

Saat membuat halaman baru di Portal PPGT Jemaat Batakan, pastikan mematuhi aturan berikut:
1. **Gunakan `MemberLayout`:** Bungkus halaman dengan `<MemberLayout activeMenu="...">`.
2. **Sediakan `TopNavBar`:** Sertakan breadcrumb dinamis, input pencarian, notifikasi lonceng, dan profil pengguna pada prop `header`.
3. **Patuhi Skema Tombol:** Selalu gunakan `<Button color="primer">` untuk aksi konfirmasi/submit dan `color="sekunder"` untuk aksi batal/filter/unduh.
4. **Patuhi Skema Input:** Gunakan `<Input label="..." required error={...} />` yang telah mendukung label kapital, focus ring biru elektrik, dan pesan error terintegrasi.
5. **Gunakan Kelas Animasi:** Berikan kelas `.reveal-on-scroll` dan `.reveal-delay-100` pada kartu konten agar halaman tampil dinamis dan konsisten saat di-scroll.
6. **Pastikan Responsif:** Selalu uji tampilan pada resolusi mobile (`< 640px`), tablet (`768px`), dan desktop (`> 1024px`).
7. **Jaga Konsistensi Warna:** Jangan menggunakan warna hex ad-hoc; rujuk palet di Bab 3 (`#3A86FF`, `emerald`, `amber`, `rose`, dan `slate`).

---
*Dokumen ini dirancang sebagai standar acuan desain resmi untuk seluruh tim pengembang Portal Web PPGT Jemaat Batakan.*
