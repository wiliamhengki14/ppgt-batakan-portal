import { FormEventHandler, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import InputError from '@/Components/InputError';
import Input from '@/Components/ui/Input/Input';
import { IUser, PpgtProfile } from '@/types/user';
import {
    ArrowLeftRight,
    BadgeCheck,
    Bell,
    BookOpen,
    Building2,
    Calendar,
    CalendarCheck,
    Camera,
    Check,
    CheckCircle2,
    ChevronDown,
    Clock,
    CreditCard,
    Download,
    FileText,
    HeartHandshake,
    HelpCircle,
    History,
    Home,
    Info,
    Mail,
    MapPin,
    Megaphone,
    MessageCircle,
    Mic,
    Music,
    Phone,
    PlaneLanding,
    PlaneTakeoff,
    Printer,
    QrCode,
    RefreshCw,
    Save,
    Search,
    Shuffle,
    Star,
    User,
    UserCheck,
    Video,
    X,
} from 'lucide-react';
import Button from '@/Components/ui/Button/Button';

interface Props {
    profile: PpgtProfile | null;
}

export default function SensusProfile({ profile }: Props) {
    const { auth } = usePage().props as unknown as { auth: { user: IUser } };
    const currentUser = auth?.user;

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<{
        residence_type: 'lokal_batakan' | 'perantau';
        gender: 'L' | 'P';
        birth_date: string;
        sector_in_batakan: string;
        batakan_home_address: string;
        parent_names: string;
        talents: string[];
        overseas_city: string;
        overseas_address: string;
        overseas_purpose: 'pendidikan' | 'kerja' | 'lainnya';
        church_at_overseas: string;
        return_plan: string;
        photo: File | null;
    }>({
        residence_type: profile?.residence_type || 'lokal_batakan',
        gender: profile?.gender || 'L',
        birth_date: profile?.birth_date ? profile.birth_date.substring(0, 10) : '',
        sector_in_batakan: profile?.sector_in_batakan || 'Sektor 1',
        batakan_home_address: profile?.batakan_home_address || '',
        parent_names: profile?.parent_names || '',
        talents: (profile?.talents as string[]) || [
            'Pemusik / Keyboardis',
            'Song Leader / Singer',
        ],
        overseas_city: profile?.overseas_city || '',
        overseas_address: profile?.overseas_address || '',
        overseas_purpose: profile?.overseas_purpose || 'pendidikan',
        church_at_overseas: profile?.church_at_overseas || '',
        return_plan: profile?.return_plan || 'natal',
        photo: null,
    });

    // Parent names handling (split into father and mother for detailed UI)
    const initialParentParts = (profile?.parent_names || '').split('&').map((s) => s.trim());
    const [fatherName, setFatherName] = useState(initialParentParts[0] || '');
    const [motherName, setMotherName] = useState(initialParentParts[1] || '');

    const handleFatherChange = (val: string) => {
        setFatherName(val);
        const combined = motherName ? `${val} & ${motherName}` : val;
        setData('parent_names', combined);
    };

    const handleMotherChange = (val: string) => {
        setMotherName(val);
        const combined = fatherName ? `${fatherName} & ${val}` : val;
        setData('parent_names', combined);
    };

    // UI interactive states
    const [isDutyConfirmed, setIsDutyConfirmed] = useState(false);
    const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const [eligibleDuty, setEligibleDuty] = useState<boolean>(currentUser?.is_eligible_for_duty ?? false);
    useEffect(() => {
        setEligibleDuty(currentUser?.is_eligible_for_duty ?? false);
    }, [currentUser?.is_eligible_for_duty]);
    const [processingDuty, setProcessingDuty] = useState<boolean>(false);
    const handleToggleEligible = () => {
        router.put(route('sensus.updateElgible'), {}, {
            preserveScroll: true,
            onStart: () => setProcessingDuty(true),
            onFinish: () => setProcessingDuty(false),
        });
    };
    const [pushReminder, setPushReminder] = useState(true);

    const [swapTarget, setSwapTarget] = useState('David Sarira (Sektor II - Siap)');
    const [swapReason, setSwapReason] = useState('');

    // Toast state
    const [toast, setToast] = useState<{ show: boolean; message: string }>({
        show: false,
        message: '',
    });

    const showToast = (message: string) => {
        setToast({ show: true, message });
        setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }));
        }, 3500);
    };

    useEffect(() => {
        if (recentlySuccessful) {
            showToast('Data Sensus Anggota berhasil disimpan & tersinkron!');
        }
    }, [recentlySuccessful]);

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
    }, [data.residence_type]);

    const toggleTalent = (talent: string) => {
        const currentTalents = data.talents || [];
        const updated = currentTalents.includes(talent)
            ? currentTalents.filter((t) => t !== talent)
            : [...currentTalents, talent];
        setData('talents', updated);
    };

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('photo', file);
            const reader = new FileReader();
            reader.onload = (uploadEvent) => {
                if (uploadEvent.target?.result) {
                    setAvatarPreview(uploadEvent.target.result as string);
                    showToast('Foto profil baru dipilih. Klik "Simpan Perubahan" untuk menyimpan ke server.');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmDuty = () => {
        setIsDutyConfirmed(true);
        showToast('Terima kasih! Kehadiran Anda telah dicatat oleh Seksi Ibadah.');
    };

    const handleDownloadCard = () => {
        setIsCardModalOpen(true);
    };

    const handleSwapSubmit = () => {
        setIsSwapModalOpen(false);
        showToast('Permohonan tukar jadwal diteruskan ke koordinator ibadah.');
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('sensus.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setAvatarPreview(null);
            },
        });
    };

    // Header Navbar Atas (TopNavBar) - Dipertahankan sesuai existing SensusProfile.tsx
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
                        <span className="text-[11px] text-slate-500 font-medium">Sensus Profile</span>
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
                    onClick={() => showToast('Anda memiliki 1 tugas ibadah minggu ini!')}
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                </button>

                {/* Badge Status Verifikasi Sensus */}
                {profile?.verification_status === 'pending' ? (
                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold">
                        <BadgeCheck className="w-4 h-4 text-blue-600" />
                        <span>Verifikasi Menunggu</span>
                    </div>
                ) : profile?.verification_status === 'rejected' ? (
                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
                        <BadgeCheck className="w-4 h-4 text-rose-600" />
                        <span>Verifikasi Ditolak</span>
                    </div>
                ) : (
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
        <MemberLayout activeMenu="sensus" header={TopNavBar}>
            <Head title="Sensus Profil & Portal Anggota - PPGT Jemaat Batakan" />

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

            <main className="flex-1 p-4 lg:p-0 max-w-[1280px] w-full mx-auto space-y-6 overflow-x-clip pb-10">

                {/* ==================== 2. STATS & SENSUS HEALTH OVERVIEW (FR-10) ==================== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Status Anggota */}
                    <div className="reveal-on-scroll reveal-delay-100 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:border-emerald-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                        <div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Status Anggota
                                </span>
                                <div className="text-emerald-700">
                                    <UserCheck className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                                {profile?.verification_status === 'approved' ? (
                                    <>
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span className="text-lg font-bold text-slate-900">Terverifikasi</span>
                                    </>
                                ) : profile?.verification_status === 'rejected' ? (
                                    <>
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                                        <span className="text-lg font-bold text-rose-700">Perlu Perbaikan</span>
                                    </>
                                ) : profile?.verification_status === 'pending' ? (
                                    <>
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                                        <span className="text-lg font-bold text-amber-700">Menunggu</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                                        <span className="text-lg font-bold text-slate-700">Belum Sensus</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="text-xs text-emerald-700 font-medium border-t w-full mt-3 pt-2">
                            {profile?.verification_status === 'approved'
                                ? 'Diperiksa Majelis Jemaat'
                                : profile?.verification_status === 'pending'
                                ? 'Dalam Antrean Pengurus'
                                : profile?.verification_status === 'rejected'
                                ? profile.rejection_note || 'Periksa data sensus'
                                : 'Lengkapi formulir di bawah'}
                        </div>
                    </div>

                    {/* Kesiapan Bertugas */}
                    <div className="reveal-on-scroll reveal-delay-200 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                        <div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Kesiapan Bertugas
                                </span>
                                <div className="text-blue-700">
                                    <CalendarCheck className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                                {currentUser?.is_eligible_for_duty ? (
                                    <>
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span className="text-lg font-bold text-slate-900">Siap Ditugaskan</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                                        <span className="text-lg font-bold text-slate-700">Belum Siap</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="text-xs text-blue-700 font-medium border-t w-full mt-3 pt-2">
                            {currentUser?.is_eligible_for_duty
                                ? 'Aktif di Roster Pelayanan'
                                : 'Belum Masuk Roster Jadwal'}
                        </div>
                    </div>

                    {/* Total Pelayanan Tahun Ini */}
                    <div className="reveal-on-scroll reveal-delay-300 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:border-amber-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                        <div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Tugas Terlaksana
                                </span>
                                <div className="text-amber-800">
                                    <Star className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                <span className="text-lg font-bold text-slate-900">
                                    {currentUser?.duty_count ?? 3} Kali
                                </span>
                                <span className="text-xs font-semibold text-amber-800">
                                    (Tahun {new Date().getFullYear()})
                                </span>
                            </div>
                        </div>
                        <div className="text-xs text-slate-600 font-medium border-t w-full mt-3 pt-2 truncate">
                            Terakhir:{' '}
                            {currentUser?.last_duty_at
                                ? new Date(currentUser.last_duty_at).toLocaleDateString('id-ID', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                  })
                                : 'Belum ada riwayat'}
                        </div>
                    </div>

                    {/* Kelengkapan Sensus */}
                    <div className="reveal-on-scroll reveal-delay-400 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                        <div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Kelengkapan Sensus
                                </span>
                                <div className={profile ? 'text-emerald-700' : 'text-blue-700'}>
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                                {profile ? (
                                    <>
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span className="text-lg font-bold text-slate-900">100% Selesai</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                                        <span className="text-lg font-bold text-amber-700">40% Draf</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="text-xs text-slate-600 font-medium border-t w-full mt-3 pt-2 truncate">
                            ID Anggota:{' '}
                            <strong className="text-slate-900 font-mono">
                                PPGT-BTK-{new Date().getFullYear()}-{String(currentUser?.id || 82).padStart(3, '0')}
                            </strong>
                        </div>
                    </div>
                </div>

                {/* ==================== 3. SENSUS PROFIL CONTAINER & SEGMENTED CONTROLLER ==================== */}
                <section className="reveal-on-scroll reveal-delay-100 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    {/* Segmented Tab Header Bar */}
                    <div className="p-6 border-b border-slate-200 bg-gradient-to-b from-white to-slate-50/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-[#3A68FF]" />
                                    <h3 className="text-xl font-bold text-slate-900">
                                        Formulir Sensus Mandiri PPGT
                                    </h3>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                                    Pembaruan data mutasi pemuda demi pemerataan pelayanan jemaat dan pemutakhiran
                                    database PPGT Klasis Walenrang Timur.
                                </p>
                            </div>

                            {/* Segmented Pill Switcher (Lokal vs Perantau) */}
                            <div
                                className="inline-flex p-1 rounded-xl bg-blue-400 text-white border border-[#3a68ff] shadow-inner"
                                role="tablist"
                            >
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={data.residence_type === 'lokal_batakan'}
                                    onClick={() => setData('residence_type', 'lokal_batakan')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
                                        data.residence_type === 'lokal_batakan'
                                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                                            : 'text-white'
                                    }`}
                                >
                                    <Home className="w-4 h-4" />
                                    <span>Pemuda Lokal Batakan</span>
                                </button>
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={data.residence_type === 'perantau'}
                                    onClick={() => setData('residence_type', 'perantau')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
                                        data.residence_type === 'perantau'
                                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                                            : 'text-white'
                                    }`}
                                >
                                    <PlaneTakeoff className="w-4 h-4" />
                                    <span>Pemuda Perantau</span>
                                </button>
                            </div>
                        </div>

                        {/* Dynamic Context Badge Description */}
                        {data.residence_type === 'lokal_batakan' ? (
                            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs sm:text-sm">
                                <Info className="w-4 h-4 shrink-0 text-emerald-600" />
                                <span>
                                    Anda sedang mengisi data sebagai <strong>Warga Pemuda Lokal Batakan</strong>. Anda
                                    aktif menghadiri kebaktian rutin dan siap ditempatkan dalam roster jadwal pelayanan
                                    ibadah gereja.
                                </span>
                            </div>
                        ) : (
                            <div className="mt-4 p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center gap-2 text-sky-800 text-xs sm:text-sm">
                                <PlaneLanding className="w-4 h-4 shrink-0 text-sky-600" />
                                <span>
                                    Anda sedang mengisi data sebagai <strong>Pemuda Diaspora/Perantau</strong> (Studi /
                                    Bekerja di luar Batakan). Jadwal pelayanan Anda akan diprioritaskan saat libur
                                    Natal/Paskah/Pulang Kampung.
                                </span>
                            </div>
                        )}
                    </div>

                    {/* ==================== FORM BODY ==================== */}
                    <form onSubmit={submit} className="p-6 lg:p-8 space-y-8">
                        {/* BAGIAN 1: IDENTITAS PRIBADI UTAMA */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                                <h4 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">
                                        1
                                    </span>
                                    <span>Data Identitas Diri Anggota</span>
                                </h4>
                                <span className="text-xs font-semibold text-slate-400">Wajib Diisi</span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
                                {/* Foto Profil Avatar Upload Container */}
                                <div className="reveal-from-left reveal-delay-100 lg:col-span-3 flex flex-col h-full items-center p-4 bg-slate-50 rounded-2xl border border-[#3A68FF] text-center">
                                    <div className="relative w-28 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-slate-100 mb-3 group flex items-center justify-center">
                                        {avatarPreview || currentUser?.profile_photo_url ? (
                                            <img
                                                className="w-full h-full object-cover"
                                                alt="Foto Profil Anggota"
                                                src={avatarPreview || currentUser?.profile_photo_url || ''}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-slate-400 p-2">
                                                <User className="w-12 h-12 text-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                                                    No Profile
                                                </span>
                                            </div>
                                        )}
                                        <label
                                            htmlFor="avatarInput"
                                            className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity duration-200"
                                        >
                                            <Camera className="w-5 h-5" />
                                            <span className="text-[10px] mt-1 font-semibold">
                                                {avatarPreview || currentUser?.profile_photo_url ? 'Ganti Foto' : 'Unggah Foto'}
                                            </span>
                                        </label>
                                        <input
                                            type="file"
                                            id="avatarInput"
                                            accept="image/jpeg,image/png,image/jpg,image/webp"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </div>
                                    <label
                                        htmlFor="avatarInput"
                                        className="cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-900 hover:text-white transition-all shadow-xs"
                                    >
                                        {avatarPreview || currentUser?.profile_photo_url ? 'Ganti Foto Resmi' : 'Unggah Foto Resmi'}
                                    </label>
                                    {errors.photo && (
                                        <InputError message={errors.photo} className="mt-1" />
                                    )}
                                    <p className="text-[11px] text-slate-400 mt-2 leading-tight">
                                        Format JPG/PNG/WebP, pas foto rapi maksimal 2MB.
                                    </p>
                                </div>

                                {/* Input Data Kolom Kanan */}
                                <div className="reveal-from-right reveal-delay-200 lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Nama Lengkap */}
                                    <div className="sm:col-span-2 space-y-1">
                                        <Input 
                                            id='namaLengkap'
                                            label='Nama Lengkap & Gelar (Sesuai KTP / Surat Baptis)'
                                            name='namaLengkap'
                                            type='text'
                                            value={currentUser?.name}
                                            readOnly
                                            icon={<CreditCard className="w-4 h-4" />}
                                            required
                                        />
                                    </div>

                                    {/* Nomor WhatsApp Aktif */}
                                    <div className="space-y-1">
                                        <Input 
                                            id='noWhatsapp'
                                            type='tel'
                                            readOnly
                                            label='Nomor WhatsApp Aktif (Sinkron Roster)'
                                            value={currentUser.phone_number}
                                            required
                                            icon={<MessageCircle className="w-4 h-4" />}
                                            rightElement={
                                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-700 text-xs font-semibold">
                                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />{' '}
                                                    Terhubung
                                                </span>
                                            }
                                        />
                                        <p className="text-[11px] text-slate-400">
                                            Pengingat jadwal tugas akan dikirim via bot WhatsApp.
                                        </p>
                                    </div>

                                    {/* Alamat Email */}
                                    <div className="space-y-1">
                                        <Input 
                                            id='emailAnggota'
                                            label='Alamat Email Aktif'
                                            required
                                            name='emailAnggota'
                                            readOnly
                                            value={currentUser.email}
                                            icon={<Mail className="w-4 h-4" />}
                                        />
                                    </div>

                                    {/* Tanggal Lahir */}
                                    <div className="space-y-1">
                                        <Input 
                                            id='tglLahir'
                                            name='tglLahir'
                                            label='Tanggal Lahir'
                                            type='date'
                                            required
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                            error={errors.birth_date}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-[2px] space-y-1">
                                            <label
                                                htmlFor="jenisKelamin"
                                                className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-start gap-1"
                                            >
                                                Gender <span className="text-rose-500">*</span>
                                            </label>
                                            <select
                                                id="jenisKelamin"
                                                value={data.gender}
                                                onChange={(e) =>
                                                    setData('gender', e.target.value as 'L' | 'P')
                                                }
                                                className="w-full py-3 border-[#3A86FF] bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-[#3A86FF]/25 focus:border-[#3A86FF] transition-all duration-200"
                                            >
                                                <option value="L">Laki-laki (L)</option>
                                                <option value="P">Perempuan (P)</option>
                                            </select>
                                            <InputError message={errors.batakan_home_address} className="mt-1" />
                                        </div>
                                    
                                </div>
                            </div>
                        </div>

                        {/* BAGIAN 2: KONDISIONAL BERDASARKAN STATUS (LOKAL VS PERANTAU) */}
                        <div className="reveal-on-scroll reveal-delay-100 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                                <h4 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">
                                        2
                                    </span>
                                    <span>
                                        {data.residence_type === 'lokal_batakan'
                                            ? 'Domisili & Pelayanan Lokal Batakan'
                                            : 'Informasi Rantau & Jadwal Kepulangan'}
                                    </span>
                                </h4>
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                        data.residence_type === 'lokal_batakan'
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                            : 'bg-sky-100 text-sky-800 border border-sky-200'
                                    }`}
                                >
                                    {data.residence_type === 'lokal_batakan' ? 'Mode Lokal' : 'Mode Perantau'}
                                </span>
                            </div>

                            {/* TAB 1: FIELD KHUSUS PEMUDA LOKAL BATAKAN */}
                            {data.residence_type === 'lokal_batakan' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Sektor Pelayanan */}
                                        <div className="flex flex-col gap-[2px] space-y-1">
                                            <label
                                                htmlFor="sektorPelayanan"
                                                className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-start gap-1"
                                            >
                                                Wilayah Sektor Pelayanan Batakan{' '}
                                                <span className="text-rose-500">*</span>
                                            </label>
                                            <select
                                                id="sektorPelayanan"
                                                value={data.sector_in_batakan}
                                                onChange={(e) => setData('sector_in_batakan', e.target.value)}
                                                className="w-full py-3 border-[#3A86FF] bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-[#3A86FF]/25 focus:border-[#3A86FF] transition-all duration-200"
                                            >
                                                <option value="Sektor 1">
                                                    Sektor I - Immanuel (Batakan Tengah)
                                                </option>
                                                <option value="Sektor 2">Sektor II - Sion (Batakan Hilir)</option>
                                                <option value="Sektor 3">
                                                    Sektor III - Galilea (Batakan Hulu / Perbukitan)
                                                </option>
                                            </select>
                                            <InputError message={errors.sector_in_batakan} className="mt-1" />
                                        </div>

                                        {/* Alamat Rumah di Batakan */}
                                        <div className="space-y-1">
                                            <Input 
                                                id='alamatBatakan'
                                                label='Alamat lengkap / Patokan Rumah di Batakan'
                                                required
                                                type='text'
                                                error={errors.batakan_home_address}
                                                value={data.batakan_home_address}
                                                placehoder='Jl. Poros Batakan No. 42 (Dekat Pastori Jemaat)'
                                                onChange={(e) => setData('batakan_home_address', e.target.value)}
                                            />
                                        </div>

                                        {/* Nama Orang Tua (Ayah & Ibu) */}
                                        <div className="space-y-1">
                                            <Input 
                                                id='namaAyah'
                                                name='namaAyah'
                                                label='Nama lengkap ayah (kepala keluarga)'
                                                required
                                                placehoder='Nama Ayah'
                                                value={fatherName}
                                                onChange={(e) => handleFatherChange(e.target.value)}
                                                error={errors.parent_names}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Input 
                                                id='namaIbu'
                                                name='namaIbu'
                                                label='Nama Lengkap Ibu'
                                                required
                                                placehoder='Nama Ibu'
                                                value={motherName}
                                                onChange={(e) => handleMotherChange(e.target.value)}
                                                error={errors.parent_names}
                                            />
                                        </div>

                                        {/* Minat & Talenta Pelayanan (Multi-select pill tags) */}
                                        <div className="sm:col-span-2 space-y-2 pt-2">
                                            <label className="block text-xs sm:text-sm font-semibold text-slate-800">
                                                Talenta &amp; Minat Pelayanan Khusus (Pilih yang sesuai)
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    { name: 'Pemusik / Keyboardis', icon: Music },
                                                    { name: 'Song Leader / Singer', icon: Mic },
                                                    { name: 'Liturgis / MC Ibadah', icon: BookOpen },
                                                    { name: 'Multimedia & Sound System', icon: Video },
                                                    { name: 'Kolektan / Penerima Tamu', icon: HeartHandshake },
                                                ].map((item) => {
                                                    const isChecked = data.talents?.includes(item.name) ?? false;
                                                    const IconComponent = item.icon;
                                                    return (
                                                        <button
                                                            key={item.name}
                                                            type="button"
                                                            onClick={() => toggleTalent(item.name)}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                                                                isChecked
                                                                    ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold shadow-xs'
                                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                            }`}
                                                        >
                                                            <IconComponent className="w-4 h-4 text-amber-600" />
                                                            <span>{item.name}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-[11px] text-slate-400">
                                                Sistem pengacakan roster adil akan memprioritaskan jadwal ibadah
                                                berdasarkan talenta yang Anda tandai.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: FIELD KHUSUS PEMUDA PERANTAU (DIASPORA) */}
                            {data.residence_type === 'perantau' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Kota Tujuan Rantau */}
                                        <div className="space-y-1">
                                            <Input 
                                                id='kotaRantau'
                                                label='Kota / Kabupate Tempat Merantau'
                                                required
                                                value={data.overseas_city || ''}
                                                onChange={(e) => setData('overseas_city', e.target.value)}
                                                error={errors.overseas_city}
                                                placehoder='Contoh: Makassar, Palu, Jayapura, Jakarta'
                                                type='text'
                                                icon={<Building2 className="w-4 h-4" />}
                                            />
                                        </div>

                                        {/* Kampus / Instansi Kerja */}
                                        <div className="space-y-1">
                                            <div className="flex flex-col gap-[2px] space-y-1">
                                                <label
                                                    htmlFor="tujuanRantau"
                                                    className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-start gap-1"
                                                >
                                                    Tujuan Merantau <span className="text-rose-500">*</span>
                                                </label>
                                                <select
                                                    id="tujuanRantau"
                                                    value={data.overseas_purpose || 'pendidikan'}
                                                    onChange={(e) =>
                                                        setData(
                                                            'overseas_purpose',
                                                            e.target.value as 'pendidikan' | 'kerja' | 'lainnya'
                                                        )
                                                    }
                                                    className="w-full py-3 border-[#3A86FF] bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-[#3A86FF]/25 focus:border-[#3A86FF] transition-all duration-2000"
                                                >
                                                    <option value="pendidikan">Pendidikan / Kuliah</option>
                                                    <option value="kerja">Bekerja / Karir</option>
                                                    <option value="lainnya">Lainnya</option>
                                                </select>
                                                <InputError message={errors.overseas_purpose} className="mt-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-1'>
                                        <Input 
                                            label='Alamat Lengkap kos / Domisili Rantau'
                                            id='alamatKos'
                                            type='text'
                                            required
                                            value={data.overseas_address || ''}
                                            onChange={(e) => setData('overseas_address', e.target.value)}
                                            error={errors.overseas_address}
                                            placehoder='Nama Jalan, Kelurahan, Kecamatan di perantauan'
                                        />
                                    </div>
                                        
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                        

                                        {/* Jemaat / Gereja Lokal di Rantau */}
                                        <div className="space-y-1">
                                            <Input 
                                                id='gerejaRantau'
                                                label='Gereja Toraja / Jemaat yang Dihuni di Rantau'
                                                value={data.church_at_overseas || ''}
                                                onChange={(e) => setData('church_at_overseas', e.target.value)}
                                                placehoder='Contoh: Jemaat Tamalanrea Klasis Makassar'
                                                type='text'
                                            />
                                        </div>

                                        {/* Perkiraan Jadwal Mudik / Pulang Batakan */}
                                        <div className="flex flex-col gap-[2px] space-y-1">
                                            <label
                                                htmlFor="rencanaPulang"
                                                className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-start gap-1"
                                            >
                                                Perkiraan Waktu Pulang ke Batakan
                                            </label>
                                            <select
                                                id="rencanaPulang"
                                                value={data.return_plan || 'natal'}
                                                onChange={(e) => setData('return_plan', e.target.value)}
                                                className="w-full py-3 border-[#3A86FF] bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-[#3A86FF]/25 focus:border-[#3A86FF] transition-all duration-200"
                                            >
                                                <option value="natal">
                                                    Libur Hari Raya Natal &amp; Tahun Baru (Desember - Januari)
                                                </option>
                                                <option value="paskah">
                                                    Libur Pekan Paskah &amp; Sidang Sinode
                                                </option>
                                                <option value="libur-semester">
                                                    Libur Semester Kuliah (Juli - Agustus)
                                                </option>
                                                <option value="belum-tentu">
                                                    Belum Ada Rencana Pulang dalam Waktu Dekat
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="sm:col-span-2 space-y-2 pt-2">
                                        <label className="block text-xs sm:text-sm font-semibold text-slate-800">
                                            Talenta &amp; Minat Pelayanan Khusus (Pilih yang sesuai)
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { name: 'Pemusik / Keyboardis', icon: Music },
                                                { name: 'Song Leader / Singer', icon: Mic },
                                                { name: 'Liturgis / MC Ibadah', icon: BookOpen },
                                                { name: 'Multimedia & Sound System', icon: Video },
                                                { name: 'Kolektan / Penerima Tamu', icon: HeartHandshake },
                                            ].map((item) => {
                                                const isChecked = data.talents?.includes(item.name) ?? false;
                                                const IconComponent = item.icon;
                                                return (
                                                    <button
                                                        key={item.name}
                                                        type="button"
                                                        onClick={() => toggleTalent(item.name)}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                                                            isChecked
                                                                ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold shadow-xs'
                                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <IconComponent className="w-4 h-4 text-amber-600" />
                                                        <span>{item.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <p className="text-[11px] text-slate-400">
                                            Sistem pengacakan roster adil akan memprioritaskan jadwal ibadah
                                            berdasarkan talenta yang Anda tandai.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* BAGIAN 3: PREFERENSI TUGAS & NOTIFIKASI WEB PUSH */}
                        <div className="reveal-on-scroll reveal-delay-100 space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                                <h4 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">
                                        3
                                    </span>
                                    <span>Komitmen Kesiapan Melayani &amp; Notifikasi</span>
                                </h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Switch: Bersedia Masuk Roster Acak Adil */}
                                <div className="reveal-on-scroll reveal-delay-100 p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4 hover:border-blue-300 hover:shadow-xs transition-all duration-200">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Shuffle className="w-4 h-4 text-[#3A68FF]" />
                                            <span className="text-sm font-bold text-slate-900">
                                                Bersedia Ditugaskan Otomatis
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Mengizinkan sistem generator roster cerdas membagikan tugas ibadah secara
                                            berkala dan berkeadilan.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                                        <input
                                            type="checkbox"
                                            checked={eligibleDuty}
                                            onChange={handleToggleEligible}
                                            disabled={processingDuty}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3A68FF]"></div>
                                    </label>
                                </div>

                                {/* Switch: Web Push & WA Reminder */}
                                <div className="reveal-on-scroll reveal-delay-200 p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4 hover:border-blue-300 hover:shadow-xs transition-all duration-200">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Bell className="w-4 h-4 text-blue-700" />
                                            <span className="text-sm font-bold text-slate-900">
                                                Notifikasi Pengingat Tugas H-3
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Kirim notifikasi web push browser &amp; pesan reminder otomatis ke WhatsApp
                                            Anda 3 hari sebelum jadwal kebaktian berlangsung.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                                        <input
                                            type="checkbox"
                                            checked={pushReminder}
                                            onChange={(e) => setPushReminder(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* ==================== FORM ACTION BAR ==================== */}
                        <div className="reveal-on-scroll reveal-delay-100 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <History className="w-4 h-4 text-slate-400" />
                                <span>
                                    Terakhir disinkronkan:{' '}
                                    <strong className="text-slate-800">12 Maret 2025, 09:42 WITA</strong>
                                </span>
                            </div>

                            <div className="flex flex-wrap lg:flex-nowrap items-center w-full sm:w-auto justify-end gap-4">
                                {/* Unduh Kartu Anggota Digital */}
                                <Button type='button' color='sekunder' clasName='w-full sm:w-[210px]' onClick={handleDownloadCard}>
                                    <CreditCard className="w-4 h-4 text-[#3A68FF]" />
                                    <span>Kartu Anggota Digital</span>
                                </Button>

                                {/* Simpan Perubahan */}
                                <Button type='submit' disabled={processing} clasName='w-full'>
                                    {processing ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                            
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {processing ? 'Menyimpan...': 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </section>

                {/* ==================== 4. ACCORDION BANTUAN SENSUS & PETUNJUK RESMI ==================== */}
                <section className="reveal-on-scroll reveal-delay-200 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all duration-300">
                    <button
                        type="button"
                        onClick={() => setIsHelpOpen((prev) => !prev)}
                        className="flex items-center justify-between w-full text-left"
                    >
                        <div className="flex items-center gap-2.5">
                            <HelpCircle className="w-5 h-5 text-[#3A68FF]" />
                            <span className="text-base sm:text-lg font-bold text-slate-900">
                                Panduan &amp; Tata Cara Mutasi Sensus Pemuda
                            </span>
                        </div>
                        <ChevronDown
                            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                                isHelpOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </button>

                    {isHelpOpen && (
                        <div className="pt-4 mt-3 border-t border-slate-200 text-xs sm:text-sm text-slate-600 space-y-2.5">
                            <p>
                                1. <strong>Mengapa ada kategori Pemuda Perantau?</strong> Banyak rekan pemuda
                                Batakan yang menempuh pendidikan atau bekerja di luar wilayah Walenrang Timur.
                                Pengelompokan ini mencegah penetapan jadwal sepihak saat anggota sedang tidak berada di
                                Batakan.
                            </p>
                            <p>
                                2. <strong>Bagaimana jika jadwal tugas bentrok?</strong> Tekan tombol 'Tukar Jadwal' di
                                hero banner untuk mengajukan pertukaran pelayan dengan rekan pemuda sebidang secara
                                langsung dalam portal.
                            </p>
                            <p>
                                3. <strong>Kerahasiaan Data:</strong> Seluruh data formulir sensus dienkripsi dan hanya
                                dapat diakses oleh Pengurus Inti (BPH) PPGT Jemaat Batakan dan Tim IT Klasis Walenrang
                                Timur sesuai protokol privasi Gereja Toraja.
                            </p>
                        </div>
                    )}
                </section>
            </main>

            {/* ==================== SWAP SCHEDULE MODAL (TUKAR JADWAL) ==================== */}
            {isSwapModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                                <ArrowLeftRight className="w-5 h-5 text-amber-500" />
                                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                                    Pengajuan Tukar Jadwal Pelayanan
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsSwapModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="py-4 space-y-4">
                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs sm:text-sm text-amber-800">
                                Jadwal Anda: <strong>Minggu, 16 Maret 2025 (Pianis)</strong>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-xs sm:text-sm font-semibold text-slate-800">
                                    Pilih Rekan Pemusik Pengganti
                                </label>
                                <select
                                    value={swapTarget}
                                    onChange={(e) => setSwapTarget(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900"
                                >
                                    <option value="David Sarira (Sektor II - Siap)">
                                        David Sarira (Sektor II - Siap)
                                    </option>
                                    <option value="Grace Banne (Sektor I - Siap)">
                                        Grace Banne (Sektor I - Siap)
                                    </option>
                                    <option value="Yohanes Rante (Sektor III - Siap)">
                                        Yohanes Rante (Sektor III - Siap)
                                    </option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-xs sm:text-sm font-semibold text-slate-800">
                                    Alasan Pertukaran
                                </label>
                                <textarea
                                    rows={2}
                                    value={swapReason}
                                    onChange={(e) => setSwapReason(e.target.value)}
                                    placeholder="Contoh: Bertepatan dengan dinas kerja shift siang / kegiatan kampus..."
                                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={() => setIsSwapModalOpen(false)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleSwapSubmit}
                                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-600 transition-all shadow-xs"
                            >
                                Kirim Permohonan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== MODAL KARTU ANGGOTA DIGITAL (e-KTA) ==================== */}
            {isCardModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-[#3A68FF]" />
                                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                                    Kartu Anggota Digital (e-KTA)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCardModalOpen(false)}
                                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body: Digital Card Preview */}
                        <div className="py-4 ">
                            <div
                                id="digital-kta-card"
                                className="relative rounded-2xl p-5 sm:p-6 text-white shadow-xl overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e3a8a] border border-blue-400/30"
                            >
                                {/* Decorative Blur Overlays */}
                                <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
                                <div className="absolute -left-10 -top-10 w-36 h-36 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>

                                {/* Card Header */}
                                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 p-1 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
                                            <ApplicationLogo className="w-full h-full" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs sm:text-sm font-extrabold tracking-tight text-white leading-tight">
                                                PPGT JEMAAT BATAKAN
                                            </h4>
                                            <p className="text-[10px] sm:text-[11px] text-blue-200 font-medium">
                                                Klasis Walenrang Timur • Gereja Toraja
                                            </p>
                                        </div>
                                    </div>
                                    <div className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                                        <BadgeCheck className="w-3.5 h-3.5 text-amber-300" />
                                        <span>e-KTA RESMI</span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="mt-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                    {/* Foto Anggota */}
                                    <div className="w-24 h-35 mt-3 rounded-xl overflow-hidden border-2 border-white/40 shadow-md bg-slate-800 shrink-0 flex items-center justify-center">
                                        {avatarPreview || currentUser?.profile_photo_url ? (
                                            <img
                                                src={avatarPreview || currentUser?.profile_photo_url || ''}
                                                alt={currentUser?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                                                <User className="w-10 h-10 text-slate-400" />
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                                                    No Profile
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Detail Informasi Anggota */}
                                    <div className="flex-1 space-y-1.5 text-center sm:text-left min-w-0">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300">
                                                Nama Anggota
                                            </span>
                                            <p className="text-sm sm:text-base font-extrabold text-white truncate">
                                                {currentUser?.name || "Samuel Tandilangi'"}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                                            <div>
                                                <span className="text-[10px] text-slate-400 block font-medium">
                                                    Nomor ID PPGT
                                                </span>
                                                <span className="font-mono font-bold text-amber-300 text-xs">
                                                    PPGT-BTK-{new Date().getFullYear()}-{String(currentUser?.id || 82).padStart(3, '0')}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 block font-medium">
                                                    Domisili / Wilayah
                                                </span>
                                                <span className="font-semibold text-slate-200 truncate block">
                                                    {data.residence_type === 'lokal_batakan'
                                                        ? data.sector_in_batakan
                                                        : `Perantau (${data.overseas_city || 'Diaspora'})`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-1">
                                            <span className="text-[10px] text-slate-400 block font-medium">
                                                Talenta Pelayanan
                                            </span>
                                            <div className="flex flex-wrap gap-1 mt-1 justify-center sm:justify-start">
                                                {data.talents && data.talents.length > 0 ? (
                                                    data.talents.map((t) => (
                                                        <span
                                                            key={t}
                                                            className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-medium text-slate-200 border border-white/10"
                                                        >
                                                            {t}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-slate-400 italic">
                                                        Belum memilih talenta
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer Bar */}
                                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[10px] text-slate-300">
                                    <div className="flex items-center gap-1.5">
                                        <QrCode className="w-4 h-4 text-amber-300" />
                                        <span className="font-mono text-slate-300">
                                            PPGT.BATAKAN.ORG
                                        </span>
                                    </div>
                                    <span className="italic text-slate-400">
                                        “1 Korintus 3:11”
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200">
                            <span className="text-[11px] text-slate-500 hidden sm:inline">
                                e-KTA Resmi PPGT Jemaat Batakan
                            </span>
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsCardModalOpen(false)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                                >
                                    Tutup
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        window.print();
                                        showToast('Membuka dialog cetak kartu anggota digital.');
                                    }}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3A86FF] text-white font-bold text-xs sm:text-sm hover:bg-blue-600 transition-all shadow-xs cursor-pointer"
                                >
                                    <Printer className="w-4 h-4" />
                                    <span>Cetak / Simpan PDF</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== TOAST NOTIFICATION CONTAINER ==================== */}
            <div
                className={`fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 transition-all duration-300 pointer-events-none ${
                    toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
                }`}
            >
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
            </div>
        </MemberLayout>
    );
}