import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Users,
    PieChart,
    Sparkles,
    Hourglass,
    TrendingUp,
    Search,
    Bell,
    ShieldCheck,
    Shuffle,
    Download,
    Check,
    Eye,
    ArrowRight,
    SlidersHorizontal,
    Calendar,
    Wallet,
    Brain,
    History,
    X,
    Send,
    Lock,
    Home,
    FileSpreadsheet,
    CheckCircle2,
    AlertCircle,
    UserCheck,
} from 'lucide-react';

interface ProfileItem {
    id: number;
    user_id: number;
    residence_type: 'lokal_batakan' | 'perantau';
    sector_in_batakan?: string | null;
    overseas_city?: string | null;
    created_at?: string;
    verification_status: string;
    user?: {
        id: number;
        name: string;
        email?: string;
        phone_number?: string;
    };
}

interface DashboardStats {
    count_user?: number;
    count_pending?: number;
    count_approved?: number;
    is_eligible?: number;
    lokal?: number;
    perantau?: number;
    pending_verification?: ProfileItem[];
}

interface PendingItem {
    id: number | string;
    name: string;
    code: string;
    category: string;
    categoryType: 'lokal' | 'perantau';
    submittedAt: string;
    status: string;
}

interface AdminDashboardProps {
    user?: DashboardStats;
    stats?: DashboardStats;
    pending_verification?: ProfileItem[];
    pending_verifications?: ProfileItem[];
}

export default function AdminDashboard(props: AdminDashboardProps) {
    // Ambil data statistik dari controller (prioritaskan 'stats', support fallback 'user')
    const stats: DashboardStats = props.stats || props.user || {
        count_user: 0,
        count_pending: 0,
        count_approved: 0,
        is_eligible: 0,
        lokal: 0,
        perantau: 0,
    };

    const { auth } = usePage().props as unknown as {
        auth: {
            user?: {
                id: number;
                name: string;
                email: string;
                role?: string;
            };
        };
    };

    const currentUser = auth?.user || {
        name: 'Pengurus BPH',
        email: 'admin@batakan.ppgt.id',
        role: 'admin',
    };

    // State untuk Fair Shuffle Modal
    const [isShuffleModalOpen, setIsShuffleModalOpen] = useState(false);
    const [isShuffleSuccess, setIsShuffleSuccess] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Hitung persentase untuk visualisasi data
    const totalUsers = stats.count_user ?? 0;
    const totalResidence = (stats.lokal ?? 0) + (stats.perantau ?? 0);
    const lokalPercent = totalResidence > 0 ? Math.round(((stats.lokal ?? 0) / totalResidence) * 100) : 0;
    const perantauPercent = totalResidence > 0 ? 100 - lokalPercent : 0;
    const eligiblePercent = totalUsers > 0 ? Math.round(((stats.is_eligible ?? 0) / totalUsers) * 100) : 0;

    // Data antrean verifikasi fallback jika controller belum menyediakan relasi pending_verification
    const samplePendingList: PendingItem[] = [
        {
            id: 1,
            name: 'Yohana Salempang',
            code: 'KTA-BTK-2025-0142',
            category: 'Lokal • Sektor II',
            categoryType: 'lokal',
            submittedAt: 'Hari ini, 09:15',
            status: 'Menunggu Review',
        },
        {
            id: 2,
            name: 'Efraim Tandilino',
            code: 'KTA-BTK-2023-0089',
            category: 'Perantau • Makassar',
            categoryType: 'perantau',
            submittedAt: 'Hari ini, 08:30',
            status: 'Menunggu Review',
        },
        {
            id: 3,
            name: 'Grace Ranteallo',
            code: 'KTA-BTK-2025-0143',
            category: 'Lokal • Sektor I',
            categoryType: 'lokal',
            submittedAt: 'Kemarin, 20:12',
            status: 'Menunggu Review',
        },
        {
            id: 4,
            name: 'Markus Somalinggi',
            code: 'KTA-BTK-2024-0102',
            category: 'Perantau • Yogyakarta',
            categoryType: 'perantau',
            submittedAt: '18 Mar 2025',
            status: 'Menunggu Review',
        },
    ];

    // Ambil list pending_verification dari controller (support di dalam stats atau di root props)
    const rawPending = props.stats?.pending_verification 
        || props.pending_verification 
        || props.pending_verifications 
        || props.user?.pending_verification;

    const pendingItems: PendingItem[] = (rawPending && Array.isArray(rawPending) && rawPending.length > 0)
        ? rawPending.map((item) => ({
            id: item.id,
            name: item.user?.name || `Anggota #${item.user_id}`,
            code: `KTA-BTK-${String(item.user_id).padStart(4, '0')}`,
            category: item.residence_type === 'lokal_batakan'
                ? `Lokal • ${item.sector_in_batakan || 'Batakan'}`
                : `Perantau • ${item.overseas_city || 'Luar Kota'}`,
            categoryType: item.residence_type === 'lokal_batakan' ? 'lokal' : 'perantau',
            submittedAt: item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
            }) : 'Baru saja',
            status: item.verification_status === 'pending' ? 'Menunggu Review' : item.verification_status,
        }))
        : (stats.count_pending && stats.count_pending > 0 ? samplePendingList : []);

    const handleApplyShuffle = () => {
        setIsShuffleSuccess(true);
        setTimeout(() => {
            setIsShuffleSuccess(false);
            setIsShuffleModalOpen(false);
        }, 1500);
    };

    // Filter pending items dengan quick search jika ada input pencarian
    const displayedPendingItems = pendingItems.filter((item) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            item.name.toLowerCase().includes(q) ||
            item.code.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.status.toLowerCase().includes(q)
        );
    });

    // Memicu animasi reveal saat masuk halaman dan saat di-scroll (baik scroll ke bawah maupun ke atas)
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
                threshold: 0.08,
                rootMargin: '0px 0px -25px 0px',
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
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('revealed');
                }
            });
        }, 50);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [displayedPendingItems.length]);

    // Header sticky top app bar untuk AdminLayout
    const headerContent = (
        <header className="h-16 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
            {/* Sisi Kiri: Breadcrumb */}
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                    <span className="text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                        PANEL PENGURUS
                    </span>
                    <span className="text-slate-300">/</span>
                    <span className="text-[#0058bd] font-semibold flex items-center gap-1.5">
                        <Home className="size-4" />
                        <span>Dashboard Utama</span>
                    </span>
                </div>
            </div>

            {/* Sisi Tengah: Quick Search Input */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari nama anggota, nomor KTA, tanggal roster, nota kas..."
                        className="w-full pl-9 pr-4 py-1.5 bg-[#f8f9ff] rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0058bd] focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Sisi Kanan: Action Badges & Profil Ringkas */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Realtime Sync Status */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Realtime Sync</span>
                </div>

                {/* Notification Bell */}
                <button
                    type="button"
                    title="Notifikasi Sistem"
                    className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    <Bell className="size-5" />
                    {(stats.count_pending ?? 0) > 0 && (
                        <span className="absolute top-1.5 right-1.5 size-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                    )}
                </button>

                {/* Super Admin / BPH Authority Badge */}
                <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-[#0058bd] text-xs font-semibold border border-blue-100">
                    <ShieldCheck className="size-4" />
                    <span>BPH & Administrator</span>
                </div>

                <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

                {/* Mini Profile Avatar */}
                <div className="flex items-center gap-2 pl-1 cursor-default">
                    <div className="size-8 rounded-full bg-[#0058bd] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                        {currentUser.name ? currentUser.name.slice(0, 2) : 'AD'}
                    </div>
                    <span className="hidden sm:inline text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                        {currentUser.name}
                    </span>
                </div>
            </div>
        </header>
    );

    return (
        <AdminLayout activeMenu="dashboard" header={headerContent}>
            <Head title="Dashboard Ringkasan Admin - PPGT Jemaat Batakan" />

            {/* Efek Animasi Reveal (Identik dengan Halaman PPGT Member) */}
            <style>{`
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

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* 1. WELCOME BANNER PENGURUS */}
                <div className="reveal-from-left relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0058bd] via-[#1470e8] to-[#004494] text-white p-6 sm:p-8 shadow-sm">
                    {/* Toraja motif subtle background styling */}
                    <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none select-none">
                        <Users className="size-64" />
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold tracking-wide border border-white/20">
                                <ShieldCheck className="size-3.5" />
                                <span>Periode 2025–2027 • Wilayah III Luwu</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Syalom, Pengurus BPH PPGT Jemaat Batakan!
                            </h1>
                            <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
                                Portal terpadu kendali sensus pemuda, manajemen tugas roster ibadah adil (
                                <span className="font-semibold italic">Fair-Shuffle</span>), pembukuan kas jemaat, dan arsip pelayanan gerejawi.
                            </p>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            <Link
                                href={route('sensus')}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0058bd] text-xs font-bold hover:bg-slate-100 shadow-sm transition-transform active:scale-95 whitespace-nowrap"
                            >
                                <Hourglass className="size-4 text-amber-500 shrink-0" />
                                <span>Verifikasi Sensus ({stats.count_pending ?? 0} Menunggu)</span>
                            </Link>

                            <button
                                type="button"
                                onClick={() => setIsShuffleModalOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold border border-white/25 transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
                            >
                                <Shuffle className="size-4 shrink-0" />
                                <span>Acak Roster Minggu Ini</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => alert('Fitur unduh rekap berkas sensus & jadwal ibadah sedang diproses.')}
                                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/15 transition-colors cursor-pointer whitespace-nowrap"
                            >
                                <Download className="size-4 shrink-0" />
                                <span>Unduh Rekap</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. FOUR CORE STATISTICAL METRIC CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Metrik 1: Total Anggota Terdaftar */}
                    <div className="reveal-on-scroll reveal-delay-100 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between pb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Total Anggota
                            </span>
                            <span className="size-8 rounded-xl bg-blue-50 text-[#0058bd] flex items-center justify-center">
                                <Users className="size-4" />
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl font-extrabold text-slate-600 tracking-tight">
                                {stats.count_user ?? 0}{' '}
                                <span className="text-sm font-medium text-slate-500">Pemuda</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold border-t pt-2">
                                <TrendingUp className="size-3.5" />
                                <span>{stats.count_approved ?? 0} tervalidasi</span>
                                <span className="text-slate-400 font-normal">• PPGT Member</span>
                            </div>
                        </div>
                    </div>

                    {/* Metrik 2: Rasio Domisili (Lokal vs Perantau) */}
                    <div className="reveal-on-scroll reveal-delay-200 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between pb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Rasio Domisili
                            </span>
                            <span className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <PieChart className="size-4" />
                            </span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-baseline justify-between text-xs font-bold">
                                <span className="text-[#0058bd]">
                                    {stats.lokal ?? 0} Lokal{' '}
                                    <span className="text-[11px] font-normal text-slate-500">({lokalPercent}%)</span>
                                </span>
                                <span className="text-amber-600">
                                    {stats.perantau ?? 0} Perantau{' '}
                                    <span className="text-[11px] font-normal text-slate-500">({perantauPercent}%)</span>
                                </span>
                            </div>
                            {/* Dual color progress bar */}
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                <div
                                    className="bg-[#0058bd] h-full transition-all duration-500"
                                    style={{ width: `${lokalPercent}%` }}
                                ></div>
                                <div
                                    className="bg-amber-400 h-full transition-all duration-500"
                                    style={{ width: `${perantauPercent}%` }}
                                ></div>
                            </div>
                            <div className="text-[11px] text-slate-400 border-t pt-2">Wilayah Batakan vs Diaspora Studi/Kerja</div>
                        </div>
                    </div>

                    {/* Metrik 3: Kesiapan Pelayan Aktif */}
                    <div className="reveal-on-scroll reveal-delay-300 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between pb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Kesiapan Pelayan
                            </span>
                            <span className="size-8 rounded-xl bg-purple-50 text-emerald-600 flex items-center justify-center">
                                <Sparkles className="size-4" />
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl font-extrabold text-slate-600 tracking-tight">
                                {stats.is_eligible ?? 0}{' '}
                                <span className="text-sm font-medium text-emerald-600">Siap Tugas</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold border-t pt-2">
                                <CheckCircle2 className="size-3.5" />
                                <span>{eligiblePercent}% dari total anggota</span>
                                <span className="text-slate-400 font-normal">• Roster Ready</span>
                            </div>
                        </div>
                    </div>

                    {/* Metrik 4: Antrean Sensus Pending */}
                    <div className="reveal-on-scroll reveal-delay-400 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between pb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Antrean Sensus
                            </span>
                            <span className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Hourglass className="size-4" />
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl font-extrabold text-slate-600 tracking-tight">
                                {stats.count_pending ?? 0}{' '}
                                <span className="text-sm font-medium text-amber-600">Pending</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold border-t pt-2">
                                {(stats.count_pending ?? 0) > 0 ? (
                                    <>
                                        <span className="size-2 rounded-full bg-amber-600 animate-ping"></span>
                                        <span>Perlu Verifikasi BPH Segera</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="size-3.5 text-emerald-600" />
                                        <span className="text-emerald-600">Semua Berkas Tervalidasi</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. MAIN WORKFLOW BENTO CONTENT GRID (65% / 35%) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* LEFT COLUMN (8 cols on 12-col grid) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* WIDGET 1: Antrean Verifikasi Sensus Terkini */}
                        <div className="reveal-on-scroll reveal-delay-100 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:shadow-md transition-all duration-300">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-xl bg-blue-50 text-[#0058bd]">
                                        <UserCheck className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-slate-900">
                                            Antrean Verifikasi Sensus Terkini
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            {stats.count_pending ?? 0} berkas profil anggota baru & pembaruan domisili memerlukan review BPH
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={route('sensus')}
                                    className="text-xs font-bold text-[#0058bd] hover:underline flex items-center gap-1 shrink-0"
                                >
                                    <span>Lihat Semua</span>
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            </div>

                            {/* Table Antrean Sensus */}
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-left text-sm min-w-[680px]">
                                    <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                        <tr>
                                            <th className="px-5 py-3 whitespace-nowrap">Nama Anggota</th>
                                            <th className="px-4 py-3 whitespace-nowrap">Kategori</th>
                                            <th className="px-4 py-3 whitespace-nowrap">Tanggal Diajukan</th>
                                            <th className="px-4 py-3 whitespace-nowrap">Status</th>
                                            <th className="px-5 py-3 text-right whitespace-nowrap">Aksi Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {displayedPendingItems.length > 0 ? (
                                            displayedPendingItems.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`size-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
                                                                    item.categoryType === 'lokal'
                                                                        ? 'bg-blue-100 text-[#0058bd]'
                                                                        : 'bg-amber-100 text-amber-800'
                                                                }`}
                                                            >
                                                                {item.name
                                                                    .split(' ')
                                                                    .map((n) => n[0])
                                                                    .join('')
                                                                    .slice(0, 2)
                                                                    .toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-semibold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
                                                                    {item.name}
                                                                </div>
                                                                <div className="text-[11px] text-slate-400 whitespace-nowrap">{item.code}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border shrink-0 ${
                                                                item.categoryType === 'lokal'
                                                                    ? 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]'
                                                                    : 'bg-[#f0f9ff] text-[#075985] border-[#bae6fd]'
                                                            }`}
                                                        >
                                                            <span
                                                                className={`size-1.5 rounded-full shrink-0 ${
                                                                    item.categoryType === 'lokal'
                                                                        ? 'bg-emerald-600'
                                                                        : 'bg-sky-600'
                                                                }`}
                                                            ></span>
                                                            <span className="whitespace-nowrap">{item.category}</span>
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-xs text-slate-500 font-medium whitespace-nowrap">
                                                        {item.submittedAt}
                                                    </td>
                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap shrink-0">
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                                        <div className="inline-flex items-center justify-end gap-1.5 shrink-0">
                                                            <Link
                                                                href={route('sensus')}
                                                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold shadow-xs transition-colors flex items-center gap-1 whitespace-nowrap"
                                                            >
                                                                <Check className="size-3.5 shrink-0" />
                                                                <span>Approve</span>
                                                            </Link>
                                                            <Link
                                                                href={route('sensus')}
                                                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
                                                                title="Periksa Berkas"
                                                            >
                                                                <Eye className="size-4" />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <CheckCircle2 className="size-8 text-emerald-500" />
                                                        <p className="font-semibold text-slate-700">
                                                            {searchQuery ? 'Tidak ada data yang sesuai pencarian' : 'Tidak ada antrean verifikasi'}
                                                        </p>
                                                        <p className="text-slate-400">
                                                            {searchQuery ? 'Coba ubah kata kunci pencarian Anda.' : 'Semua formulir sensus anggota telah diproses oleh BPH.'}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* WIDGET 2: Status Penjadwalan & Algoritma Fair-Shuffle Roster */}
                        <div className="reveal-on-scroll reveal-delay-200 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 space-y-5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                                        <SlidersHorizontal className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-slate-900">
                                            Status Penjadwalan & Algoritma Fair-Shuffle
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Optimasi penugasan anggota berdasarkan rotasi merata dan kesiapan talenta
                                        </p>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shrink-0">
                                    <Calendar className="size-4 text-[#0058bd]" />
                                    <span>Minggu, 23 Maret 2025</span>
                                </div>
                            </div>

                            {/* Duty Slot Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {/* Slot 1: Liturgis */}
                                <div className="reveal-on-scroll reveal-delay-100 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-blue-300 hover:shadow-xs transition-all">
                                    <div className="flex items-center justify-between gap-2 text-xs">
                                        <span className="font-bold text-slate-600 truncate">Liturgis</span>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap shrink-0">
                                            Terkonfirmasi
                                        </span>
                                    </div>
                                    <div className="font-semibold text-slate-900 text-[13px] truncate">Daniel K. Toding</div>
                                    <div className="text-[11px] text-slate-400 truncate">Total Tugas: 2x • Sektor II</div>
                                </div>

                                {/* Slot 2: Pemusik */}
                                <div className="reveal-on-scroll reveal-delay-200 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-blue-300 hover:shadow-xs transition-all">
                                    <div className="flex items-center justify-between gap-2 text-xs">
                                        <span className="font-bold text-slate-600 truncate">Pemusik (Keyboard)</span>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap shrink-0">
                                            Terkonfirmasi
                                        </span>
                                    </div>
                                    <div className="font-semibold text-slate-900 text-[13px] truncate">Samuel Patandung</div>
                                    <div className="text-[11px] text-slate-400 truncate">Total Tugas: 3x • Sektor I</div>
                                </div>

                                {/* Slot 3: Singer */}
                                <div className="reveal-on-scroll reveal-delay-300 p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2 hover:border-amber-300 hover:shadow-xs transition-all">
                                    <div className="flex items-center justify-between gap-2 text-xs">
                                        <span className="font-bold text-amber-800 truncate">Singer (2 Orang)</span>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 whitespace-nowrap shrink-0">
                                            Perlu Konfirmasi
                                        </span>
                                    </div>
                                    <div className="font-semibold text-slate-900 text-[13px] truncate">Hana P. & Maria K.</div>
                                    <div className="text-[11px] text-amber-700 truncate">Terkirim WA Notifikasi (2j lalu)</div>
                                </div>

                                {/* Slot 4: Kolektan */}
                                <div className="reveal-on-scroll reveal-delay-400 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 hover:border-blue-300 hover:shadow-xs transition-all">
                                    <div className="flex items-center justify-between gap-2 text-xs">
                                        <span className="font-bold text-slate-600 truncate">Kolektan / Warta</span>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap shrink-0">
                                            Siap
                                        </span>
                                    </div>
                                    <div className="font-semibold text-slate-900 text-[13px] truncate">Lukas B. & Ruth T.</div>
                                    <div className="text-[11px] text-slate-400 truncate">Total Tugas: 1x • Sektor III</div>
                                </div>
                            </div>

                            {/* Bottom Audit & Fairness Indicator */}
                            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2 text-[#0058bd] font-medium">
                                    <Sparkles className="size-4 shrink-0" />
                                    <span>
                                        Algoritma memprioritaskan {stats.is_eligible ?? 18} anggota siap tugas dengan riwayat penugasan terendah.
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 font-semibold text-slate-600 shrink-0">
                                    <span className="whitespace-nowrap">Indeks Keadilan: 94.2%</span>
                                    <button
                                        type="button"
                                        onClick={() => setIsShuffleModalOpen(true)}
                                        className="text-[#0058bd] hover:underline font-bold cursor-pointer whitespace-nowrap"
                                    >
                                        Audit Roster
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (4 cols on 12-col grid) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* WIDGET 3: Ringkasan Kas & LPJ Keuangan */}
                        <div className="reveal-on-scroll lg:reveal-from-right reveal-delay-100 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 space-y-5">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                                        <Wallet className="size-4" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">Kas PPGT Bulan Berjalan</h3>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Maret 2025
                                </span>
                            </div>

                            {/* Saldo Kas Aktif */}
                            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1">
                                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                                    Total Saldo Kas Aktif
                                </div>
                                <div className="text-2xl font-bold tracking-tight text-white">Rp 8.450.000</div>
                                <div className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1">
                                    <Lock className="size-3.5" />
                                    <span>Status LPJ Majelis: Siap Diserahkan</span>
                                </div>
                            </div>

                            {/* Pemasukan vs Pengeluaran Mini Stats */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                    <div className="text-slate-400 font-medium">Pemasukan</div>
                                    <div className="font-bold text-emerald-600 text-sm">+Rp 2.150.000</div>
                                    <div className="text-[10px] text-slate-400">Kolekte & Donatur</div>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                                    <div className="text-slate-400 font-medium">Pengeluaran</div>
                                    <div className="font-bold text-rose-600 text-sm">-Rp 950.000</div>
                                    <div className="text-[10px] text-slate-400">Diakonia & Sound</div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => alert('Modul buku kas & laporan keuangan LPJ sedang disinkronkan.')}
                                className="w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <FileSpreadsheet className="size-4" />
                                <span>Buka Buku Kas & Laporan LPJ</span>
                            </button>
                        </div>

                        {/* WIDGET 4: Distribusi Minat & Talenta Pemuda */}
                        <div className="reveal-on-scroll lg:reveal-from-right reveal-delay-200 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-blue-50 text-[#0058bd]">
                                        <Brain className="size-4" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">Minat & Talenta</h3>
                                </div>
                                <span className="text-[11px] text-slate-500 font-semibold">
                                    {stats.count_user ?? 123} Terdata
                                </span>
                            </div>

                            <div className="space-y-3 text-xs">
                                {/* Talenta 1: Musik & Vokal */}
                                <div className="space-y-1">
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-slate-900">Musik & Vokal</span>
                                        <span className="text-[#0058bd] font-bold">34%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="bg-[#0058bd] h-full rounded-full" style={{ width: '34%' }}></div>
                                    </div>
                                </div>

                                {/* Talenta 2: Pelayanan Firman & Doa */}
                                <div className="space-y-1">
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-slate-900">Pelayanan Firman & Doa</span>
                                        <span className="text-emerald-700 font-bold">28%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '28%' }}></div>
                                    </div>
                                </div>

                                {/* Talenta 3: Diakonia & Sosial */}
                                <div className="space-y-1">
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-slate-900">Diakonia & Sosial</span>
                                        <span className="text-amber-700 font-bold">23%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="bg-amber-400 h-full rounded-full" style={{ width: '23%' }}></div>
                                    </div>
                                </div>

                                {/* Talenta 4: Multimedia & Desain */}
                                <div className="space-y-1">
                                    <div className="flex justify-between font-semibold">
                                        <span className="text-slate-900">Multimedia & Desain</span>
                                        <span className="text-purple-700 font-bold">15%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '15%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* WIDGET 5: Log Aktivitas Sistem Pengurus */}
                        <div className="reveal-on-scroll lg:reveal-from-right reveal-delay-300 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-300 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                                        <History className="size-4" />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">Log Aktivitas Portal</h3>
                                </div>
                                <span className="size-2 rounded-full bg-emerald-500"></span>
                            </div>

                            <div className="space-y-3.5 text-xs">
                                <div className="flex items-start gap-2.5">
                                    <CheckCircle2 className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                                    <div className="space-y-0.5">
                                        <div className="text-slate-800 font-medium">
                                            <span className="font-bold">Sekretaris</span> menyetujui mutasi perantau anggota.
                                        </div>
                                        <div className="text-[10px] text-slate-400">14 menit yang lalu</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <Send className="size-4 text-[#0058bd] mt-0.5 shrink-0" />
                                    <div className="space-y-0.5">
                                        <div className="text-slate-800 font-medium">
                                            <span className="font-bold">Bendahara</span> mengunggah nota kuitansi sound system.
                                        </div>
                                        <div className="text-[10px] text-slate-400">1 jam yang lalu</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <Shuffle className="size-4 text-purple-600 mt-0.5 shrink-0" />
                                    <div className="space-y-0.5">
                                        <div className="text-slate-800 font-medium">
                                            <span className="font-bold">Fair-Shuffle</span> menjadwalkan ibadah sektor III.
                                        </div>
                                        <div className="text-[10px] text-slate-400">3 jam yang lalu</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Minimal Admin Footer */}
                <footer className="reveal-on-scroll mt-8 py-4 px-6 border-t border-slate-200/80 bg-white rounded-2xl text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs">
                    <div>
                        © {new Date().getFullYear()} PPGT Jemaat Batakan • Klasis Walenrang Timur. Dilindungi Hak Cipta.
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                        <span className="hover:text-[#0058bd] cursor-pointer">Panduan BPH</span>
                        <span>•</span>
                        <span className="hover:text-[#0058bd] cursor-pointer">Kebijakan Privasi Sensus</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold">Server: Terhubung</span>
                    </div>
                </footer>
            </div>

            {/* INTERACTIVE MODAL FOR FAIR-SHUFFLE DEMO */}
            {isShuffleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsShuffleModalOpen(false)}
                    />

                    {/* Dialog Container */}
                    <div className="relative z-10 bg-white max-w-lg w-full rounded-2xl border border-slate-200 p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-blue-50 text-[#0058bd]">
                                    <Shuffle className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Generator Fair-Shuffle Roster
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Simulasi algoritma rotasi berkeadilan tugas ibadah
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                                onClick={() => setIsShuffleModalOpen(false)}
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs text-slate-600">
                            <p>
                                Algoritma menganalisis {stats.count_user ?? 148} anggota PPGT Jemaat Batakan dengan parameter:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>
                                    Status Domisili = <strong className="text-[#0058bd]">Lokal Batakan</strong> ({stats.lokal ?? 0} terdata)
                                </li>
                                <li>
                                    Kesiapan Pelayanan ={' '}
                                    <strong className="text-emerald-700">is_eligible_for_duty = true</strong> ({stats.is_eligible ?? 0} anggota)
                                </li>
                                <li>Urutan prioritas: Jumlah penugasan terendah sepanjang semester berjalan.</li>
                            </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                            <div className="flex justify-between text-xs font-semibold text-slate-700">
                                <span>Kandidat Roster Ibadah Minggu Depan</span>
                                <span className="text-emerald-600">4 Posisi Terpenuhi</span>
                            </div>
                            <div className="text-[11px] text-slate-600 font-mono bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                                <div>[1] Liturgis : Yonathan P. (duty: 0x)</div>
                                <div>[2] Pemusik : Gloria T. (duty: 1x)</div>
                                <div>[3] Singer : Martha R. & David B. (duty: 1x)</div>
                                <div>[4] Kolektan : Kevin S. & Debora K. (duty: 0x)</div>
                            </div>
                        </div>

                        {isShuffleSuccess && (
                            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                                <CheckCircle2 className="size-4 shrink-0" />
                                <span>Roster berhasil digenerate dan dijadwalkan! Notifikasi siap dikirim.</span>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
                                onClick={() => setIsShuffleModalOpen(false)}
                            >
                                Tutup
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 rounded-xl bg-[#0058bd] text-white text-xs font-bold hover:bg-blue-700 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                                onClick={handleApplyShuffle}
                            >
                                <Send className="size-3.5" />
                                <span>Terapkan & Kirim Notifikasi WA</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
