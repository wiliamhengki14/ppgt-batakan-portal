import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import Button from '@/Components/ui/Button/Button';
import Input from '@/Components/ui/Input/Input';
import { IUser, PpgtProfile } from '@/types/user';
import {
    ArrowLeftRight,
    ArrowRight,
    BadgeCheck,
    Bell,
    BookOpen,
    Calendar,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Download,
    Eye,
    HeartHandshake,
    Home,
    Images,
    MapPin,
    Megaphone,
    Search,
    Sparkles,
    Star,
    User,
    UserCheck,
    Users,
    UsersRound,
    Video,
    Wallet,
} from 'lucide-react';

interface IndexProps {
    user?: IUser;
    profile: PpgtProfile | null;
    count_user: number;
    stats: {
        lokal_ppgt: number;
        perantau_ppgt: number;
        new_member: number;
    }
}

export default function Dashboard(props: IndexProps) {
    const {profile, count_user, stats, user} = props;
    const { auth } = usePage().props as unknown as { auth: { user: IUser } };
    const currentUser =
        props.user && typeof props.user === 'object' && props.user.name
            ? props.user
            : auth?.user || {
                  name: "Samuel Tandilangi'",
                  email: 'samuel@example.com',
                  phone_number: '08123456789',
                  role: 'ppgt_member',
              };

    // Format tanggal dan waktu saat ini (WITA / Waktu Sekarang)
    const now = new Date();
    const currentDateFull = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(now);

    const currentDateShort = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
    }).format(now);

    const currentMonthYear = new Intl.DateTimeFormat('id-ID', {
        month: 'long',
        year: 'numeric',
    }).format(now);

    const currentYear = now.getFullYear();

    const currentTime = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(now).replace('.', ':');

    // Memicu animasi reveal saat masuk halaman dan saat di-scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    } else {
                        entry.target.classList.remove('revealed');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -30px 0px',
            }
        );

        const elements = document.querySelectorAll(
            '.reveal-on-scroll, .reveal-from-left, .reveal-from-right'
        );
        elements.forEach((el) => observer.observe(el));

        // Memicu elemen yang sudah berada di dalam layar saat pertama kali dibuka
        const timer = setTimeout(() => {
            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('revealed');
                }
            });
        }, 50);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, []);

    // Header Navbar Atas (TopNavBar)
    const TopNavBar = (
        <header className="flex items-center justify-between w-full px-4 lg:px-8 h-16 bg-white border-b border-slate-200 shadow-xs">
            {/* Indikator Breadcrumb Brand Sisi Kiri */}
            <div className="flex items-center gap-3">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#3A86FF] uppercase tracking-wider">
                            Portal Pemuda
                        </span>
                        <span className="text-slate-400 text-xs">/</span>
                        <span className="text-[11px] text-slate-500 font-medium">Beranda</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            PPGT Jemaat Batakan
                        </h1>
                    </div>
                </div>
            </div>

            {/* Search bar menggunakan Komponen UI Input */}
            <div className="relative hidden sm:block w-64 lg:w-80">
                <Input
                    id="dashboard-search"
                    name="search"
                    placehoder="Cari warta, jadwal ibadah, ayat..."
                    icon={<Search className="w-4 h-4 text-slate-400" />}
                    className="!py-2 !text-xs bg-white focus:!border-[#3A86FF]"
                />
            </div>

            {/* Kluster Kanan: Search bar, Aksi Ikon & Status Profil */}
            <div className="flex items-center gap-3">
                {/* Tombol Notifikasi */}
                <button
                    aria-label="Notifikasi"
                    className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 active:scale-95 cursor-pointer"
                    type="button"
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                </button>

                {/* Badge Status Verifikasi Sensus */}
                {profile?.verification_status === 'pending' ? (
                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-200 text-blue-500 border border-blue-300 text-xs font-semibold">
                        <BadgeCheck className="w-4 h-4 text-blue-600" />
                        <span>Verifikasi Belum Disetujui</span>
                    </div>
                ): (
                     <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                        <BadgeCheck className="w-4 h-4 text-emerald-600" />
                        <span>Verifikasi Disetujui</span>
                    </div>
                )} 

                {/* User Profile Pill */}
                <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                    {currentUser?.profile_photo_url ? (
                        <img
                            src={currentUser.profile_photo_url}
                            alt={currentUser.name}
                            className="w-9 h-9 rounded-xl object-cover shadow-xs ring-2 ring-blue-100"
                        />
                    ) : (
                        <div
                            className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center text-xs shadow-xs"
                            title="Belum Ada Foto Profil"
                        >
                            <User className="w-5 h-5 text-slate-400" />
                        </div>
                    )}
                    <div className="hidden xl:block text-left">
                        <p className="text-xs font-extrabold text-slate-800 leading-tight truncate max-w-[140px]">
                            {currentUser?.name || "Samuel Tandilangi'"}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                            {currentUser?.role === 'admin' ? 'Pengurus BPH' : 'Anggota PPGT'}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );

    return (
        <MemberLayout activeMenu="beranda" header={TopNavBar}>
            <Head title="Dashboard Anggota - PPGT Jemaat Batakan" />

            <style>{`
                .toraja-pattern {
                    background-color: #f8f9ff;
                }

                html, body {
                    overflow-x: clip;
                    max-width: 100vw;
                }

                /* ==============================================================
                   1. ANIMASI DARI BAWAH KE ATAS (VERTICAL / Y-AXIS)
                   ============================================================== */
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

                /* ==============================================================
                   2. ANIMASI HALUS ELEMEN KIRI
                   ============================================================== */
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

                /* ==============================================================
                   3. ANIMASI HALUS ELEMEN KANAN
                   ============================================================== */
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

                /* ==============================================================
                   4. DELAY STAGGER (JEDA WAKTU MUNCUL BERGANTIAN)
                   ============================================================== */
                .reveal-delay-100.revealed {
                    transition-delay: 150ms;
                }
                .reveal-delay-200.revealed {
                    transition-delay: 300ms;
                }
                .reveal-delay-300.revealed {
                    transition-delay: 450ms;
                }
                .reveal-delay-400.revealed {
                    transition-delay: 600ms;
                }

                /* ==============================================================
                   5. AKSESIBILITAS: REDUCED MOTION
                   ============================================================== */
                @media (prefers-reduced-motion: reduce) {
                    .reveal-on-scroll,
                    .reveal-from-left,
                    .reveal-from-right {
                        opacity: 1 !important;
                        transform: none !important;
                        transition: none !important;
                    }
                }
            `}</style>

            <div className="space-y-6 pb-10 w-full overflow-x-clip">
                {/* 1. BANNER TUGAS PELAYANAN (H-3) */}
                <div className="reveal-from-left rounded-2xl border border-none shadow-[0px_0px_4px_rgba(0,0,0,0.2)] bg-white p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-[#3A86FF] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                            <Megaphone className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#3A86FF] text-white tracking-wide uppercase">
                                    Pemberitahuan Tugas Pelayanan
                                </span>
                                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                    H-3 Jelang Ibadah
                                </span>
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                                Anda Bertugas sebagai Pemusik / Gitar Utama
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                                <span>{currentDateFull} • 17:00 WITA</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>Gedung Gereja Toraja Jemaat Batakan</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="italic font-medium text-[#3A86FF]">Tema: “Dipanggil untuk Bersaksi”</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
                        <div className="w-full sm:w-auto">
                            <Button
                                color="primer"
                                type="button"
                                className="!py-2.5 !px-4 !text-xs !font-bold flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm shadow-blue-500/20"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Konfirmasi Siap Hadir</span>
                            </Button>
                        </div>
                        <div className="w-full sm:w-auto">
                            <Button
                                color="sekunder"
                                type="button"
                                className="!py-2.5 !px-4 !text-xs !font-semibold !bg-white hover:!bg-slate-50 flex items-center justify-center gap-1.5 whitespace-nowrap !border-slate-300 !text-slate-700"
                            >
                                <ArrowLeftRight className="w-4 h-4 text-slate-500" />
                                <span>Tukar Jadwal</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 2. WELCOME BANNER RINGKAS */}
                <div className="reveal-on-scroll reveal-delay-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 bg-white p-5 rounded-xl shadow-[0px_0px_4px_rgba(0,0,0,0.2)]">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#3A86FF] border border-blue-100">
                                WITA: {currentDateFull}
                            </span>
                            {profile?.verification_status === 'pending' ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#3A68FF] border border-blue-100">
                                    Status: Sensus verifikasi belum di setujui
                                </span>
                            ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Status: Sensus Terverifikasi
                                </span>
                            )}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Shalom, {currentUser?.name || "Samuel Tandilangi'"}!
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            Selamat datang di portal pelayanan pemuda PPGT Jemaat Batakan, Klasis Walenrang Timur.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="w-auto">
                            <Link href={route('sensus')}>
                                <Button
                                    color="sekunder"
                                    type="button"
                                    className="!py-2 !px-3.5 !text-xs !font-semibold !bg-white hover:!bg-blue-50/50 flex items-center gap-1.5 !border-blue-200 !text-[#3A86FF]"
                                >
                                    <UserCheck className="w-4 h-4" />
                                    <span>Perbarui Sensus</span>
                                </Button>
                            </Link>
                        </div>
                        <div className="w-auto">
                            <Button
                                color="sekunder"
                                type="button"
                                className="!py-2 !px-3.5 !text-xs !font-semibold !bg-white hover:!bg-blue-50/50 flex items-center gap-1.5 !border-blue-200 !text-[#3A86FF]"
                            >
                                <Download className="w-4 h-4" />
                                <span>Warta PDF</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 3. 4 KARTU METRIK RINGKAS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Tugas Terdekat */}
                    <div className="reveal-on-scroll reveal-delay-100 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-blue-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between text-slate-400 mb-2">
                            <span className="text-xs font-semibold text-slate-500">Tugas Terdekat</span>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#3A86FF]">
                                <CalendarDays className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-slate-900">{currentDateShort}</p>
                        <p className="text-xs font-semibold text-[#3A86FF] truncate mt-0.5">Pemusik Ibadah Pemuda</p>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                            <span>Pukul 17:00 WITA</span>
                            <span className="text-[#3A86FF] font-semibold">Gedung Gereja</span>
                        </div>
                    </div>

                    {/* Card 2: Tugas Terlaksana */}
                    <div className="reveal-on-scroll reveal-delay-200 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-amber-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between text-slate-400 mb-2">
                            <span className="text-xs font-semibold text-slate-500">Tugas Terlaksana</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <p className="text-lg sm:text-xl font-bold text-slate-900">
                                {currentUser?.duty_count ? `(${currentUser.duty_count}x)` : '(0x)'} Tahun {currentYear}
                            </p>
                        </div>
                        <p className="text-xs font-semibold text-emerald-600 mt-0.5">Riwayat Penugasan</p>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                            <span>Terakhir: {user?.last_duty_at === null ? (
                                'Belum ada riwayat'
                            ) : (
                               `${user?.last_duty_at}` 
                            )}</span>
                            <BadgeCheck className="w-4 h-4 text-amber-500" />
                        </div>
                    </div>

                    {/* Card 3: Transparansi Kas Pemuda */}
                    <div className="reveal-on-scroll reveal-delay-300 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-emerald-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between text-slate-400 mb-2">
                            <span className="text-xs font-semibold text-slate-500">Transparansi Kas</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Wallet className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-slate-900">Rp 8.450.000</p>
                        <p className="text-xs text-slate-500 mt-0.5">Saldo Kas Aktif ({currentMonthYear})</p>
                        <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-[#3A86FF] flex items-center justify-between">
                            <span className="font-semibold text-emerald-600">+Rp 750.000 warta lalu</span>
                            <Eye className="w-3.5 h-3.5 text-slate-400 hover:text-[#3A86FF] cursor-pointer" />
                        </div>
                    </div>

                    {/* Card 4: Sensus Terdata */}
                    <div className="reveal-on-scroll reveal-delay-400 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-blue-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between text-slate-400 mb-2">
                            <span className="text-xs font-semibold text-slate-500">Sensus Terdata</span>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#3A86FF]">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-slate-900">{`${count_user} Pemuda`}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{`${stats.lokal_ppgt} Lokal • ${stats.perantau_ppgt} Perantau`}</p>
                        {stats.new_member > 0 ? (
                            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-[#3A86FF] flex items-center justify-between">
                                <span className="font-semibold text-[#3A86FF]">+{stats.new_member} Anggota baru</span>
                                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                        ): (
                            <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-[#3A86FF] flex items-center justify-between">
                                <span className="font-semibold text-[#3A86FF]">Belum Ada Anggota Baru</span>
                                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. DUA KOLOM UTAMA YANG BERSIH & TERSTRUKTUR (65% / 35%) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Kolom Kiri: Jadwal & Pengumuman (Col 7 / ~65%) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Card: Jadwal & Penugasan Ibadah Terdekat */}
                        <div className="reveal-on-scroll reveal-delay-100 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-[#3A86FF]" />
                                        Jadwal &amp; Penugasan Ibadah Terdekat
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Roster ibadah pemuda dan persekutuan sektor
                                    </p>
                                </div>
                                <Link
                                    href="#jadwal"
                                    className="text-xs font-semibold text-[#3A86FF] hover:underline inline-flex items-center gap-1"
                                >
                                    <span>Lihat Semua Roster</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            {/* Schedule Items */}
                            <div className="mt-5 space-y-4">
                                {/* Item 1: Ibadah Pemuda */}
                                <div className="reveal-on-scroll reveal-delay-100 p-4 rounded-xl border border-slate-200 bg-blue-50/20 hover:border-blue-300 hover:shadow-xs transition-all duration-200">
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#3A86FF] text-white">
                                                Ibadah Pemuda
                                            </span>
                                            <span className="text-xs sm:text-sm font-bold text-slate-900">
                                                {currentDateFull} • 17:00 WITA
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                            Gedung Gereja Batakan
                                        </span>
                                    </div>

                                    {/* Roster Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                                            <span className="text-[11px] text-slate-400 font-semibold block">Liturgis</span>
                                            <span className="text-slate-800 font-medium truncate block mt-0.5">Debora S.</span>
                                        </div>
                                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                                            <span className="text-[11px] text-slate-400 font-semibold block">Penghimpun</span>
                                            <span className="text-slate-800 font-medium truncate block mt-0.5">Markus P.</span>
                                        </div>
                                        <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                                            <span className="text-[11px] text-[#3A86FF] font-bold block">Pemusik (Anda)</span>
                                            <span className="text-[#3A86FF] font-bold truncate block mt-0.5">
                                                {currentUser?.name || "Samuel Tandilangi'"}
                                            </span>
                                        </div>
                                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                                            <span className="text-[11px] text-slate-400 font-semibold block">Singer</span>
                                            <span className="text-slate-800 font-medium truncate block mt-0.5">Grace &amp; Ester</span>
                                        </div>
                                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                                            <span className="text-[11px] text-slate-400 font-semibold block">Kolektan</span>
                                            <span className="text-slate-800 font-medium truncate block mt-0.5">Yohanis B.</span>
                                        </div>
                                        <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                                            <span className="text-[11px] text-slate-400 font-semibold block">Multimedia</span>
                                            <span className="text-slate-800 font-medium truncate block mt-0.5">Tim Media PPGT</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Item 2: Persekutuan Sektor I */}
                                <div className="reveal-on-scroll reveal-delay-200 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all duration-200">
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#3A86FF] border border-blue-100">
                                                Persekutuan Sektor I
                                            </span>
                                            <span className="text-xs sm:text-sm font-bold text-slate-900">
                                                Jumat, 21 Maret 2025 • 19:00 WITA
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <Home className="w-3.5 h-3.5 text-slate-400" />
                                            Kel. Bpk. Tandilangi'
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-2">
                                        <span className="text-slate-400 font-semibold">Petugas:</span>
                                        <span className="bg-slate-100 px-2.5 py-0.5 rounded-lg text-slate-700">PF: Pnt. Y. Salu</span>
                                        <span className="bg-slate-100 px-2.5 py-0.5 rounded-lg text-slate-700">Liturgis: Rina M.</span>
                                        <span className="bg-slate-100 px-2.5 py-0.5 rounded-lg text-slate-700">Pemusik: Kevin T.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card: Warta & Pengumuman Pemuda */}
                        <div className="reveal-on-scroll reveal-delay-200 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Megaphone className="w-5 h-5 text-[#3A86FF]" />
                                    Warta &amp; Pengumuman Pemuda
                                </h3>
                                <span className="text-[11px] font-bold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                                    Warta Terkini
                                </span>
                            </div>
                            <div className="mt-4 space-y-3">
                                {/* Announcement 1 */}
                                <div className="reveal-on-scroll reveal-delay-100 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50/70 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 flex gap-3.5 items-start">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3A86FF] flex items-center justify-center shrink-0">
                                        <UsersRound className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <span>Hari ini • {currentTime} WITA</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span className="text-[#3A86FF] font-semibold">Komisi Minat &amp; Bakat</span>
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                                            Latihan Paduan Suara Persiapan Paskah 2025
                                        </h4>
                                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                            Dihimbau kepada seluruh anggota PPGT hadir tepat waktu pada latihan hari Sabtu pkl 18:30 WITA di Pastori.
                                        </p>
                                    </div>
                                </div>

                                {/* Announcement 2 */}
                                <div className="reveal-on-scroll reveal-delay-200 p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50/70 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 flex gap-3.5 items-start">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                                        <HeartHandshake className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <span>Kemarin • 16:45 WITA</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            <span className="text-emerald-700 font-semibold">Komisi Diakonia</span>
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                                            Aksi Kasih &amp; Gotong Royong Kebersihan Gereja
                                        </h4>
                                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                            Terima kasih atas partisipasi 34 rekan pemuda yang telah membersihkan pelataran gereja dan gedung serbaguna.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Ayat Emas & Akses Cepat Rohani (Col 5 / ~35%) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* a) Ayat Emas Hari Ini */}
                        <div className="reveal-from-right reveal-delay-100 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                                <div className="flex items-center gap-2 text-[#3A86FF]">
                                    <BookOpen className="w-5 h-5" />
                                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                        Ayat Emas Hari Ini
                                    </h3>
                                </div>
                                <span className="text-[11px] bg-blue-50 text-[#3A86FF] px-2.5 py-0.5 rounded-full font-bold border border-blue-100">
                                    1 Korintus 3:11
                                </span>
                            </div>
                            <blockquote className="text-sm italic text-slate-800 leading-relaxed border-l-4 border-[#3A86FF] pl-4 py-2 bg-blue-50/40 rounded-r-xl">
                                “Karena tidak ada seorang pun yang dapat meletakkan dasar lain dari pada dasar yang telah diletakkan, yaitu Yesus Kristus.”
                            </blockquote>
                            <div className="mt-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                                <p className="text-xs text-[#3A86FF] font-bold mb-1">Renungan Hari Ini:</p>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Fondasi persekutuan pemuda Batakan berakar teguh di dalam Kristus di tengah dinamika zaman dan perantauan.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                <a
                                    className="inline-flex items-center gap-1.5 text-xs text-[#3A86FF] hover:underline font-semibold"
                                    href="#youtube"
                                >
                                    <Video className="w-4 h-4" />
                                    <span>YouTube Renungan</span>
                                </a>
                                <a
                                    className="inline-flex items-center gap-1 text-xs text-[#3A86FF] font-semibold hover:underline"
                                    href="#renungan"
                                >
                                    <span>Renungan Lengkap</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>

                        {/* b) Akses Cepat Rohani & Galeri */}
                        <div className="reveal-from-right reveal-delay-200 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 hover:shadow-md transition-all duration-300">
                            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#3A86FF]" />
                                Akses Cepat Rohani &amp; Galeri
                            </h3>
                            <div className="mt-4 space-y-2.5">
                                {/* Shortcut 1: Asisten Rohani AI */}
                                <Link
                                    href="#ai"
                                    className="reveal-on-scroll reveal-delay-100 flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-blue-50/30 hover:border-blue-200 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#3A86FF] flex items-center justify-center">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 group-hover:text-[#3A86FF] transition-colors">
                                                Konsultasi AI Rohani
                                            </p>
                                            <p className="text-[11px] text-slate-400">
                                                Tanya renungan &amp; wawasan alkitabiah
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#3A86FF] transition-colors" />
                                </Link>

                                {/* Shortcut 2: Galeri Kegiatan */}
                                <Link
                                    href="#galeri"
                                    className="reveal-on-scroll reveal-delay-200 flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-emerald-50/30 hover:border-emerald-200 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                            <Images className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                                Galeri Ret-Ret 2025
                                            </p>
                                            <p className="text-[11px] text-slate-400">
                                                Dokumentasi &amp; foto persekutuan
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                                </Link>

                                {/* Shortcut 3: Kirim Pokok Doa */}
                                <Link
                                    href="#doa"
                                    className="reveal-on-scroll reveal-delay-300 flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-amber-50/30 hover:border-amber-200 hover:-translate-y-0.5 hover:shadow-xs transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                                            <HeartHandshake className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                                                Kirim Pokok Doa
                                            </p>
                                            <p className="text-[11px] text-slate-400">
                                                Dukungan doa tim BPH &amp; jemaat
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-800 transition-colors" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MemberLayout>
    );
}