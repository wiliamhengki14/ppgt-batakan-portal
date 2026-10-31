import { PropsWithChildren, useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    Church,
    LayoutGrid,
    UserCheck,
    CalendarDays,
    Images,
    BookOpen,
    Bot,
    CircleHelp,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

export type ActiveMenuKey =
    | 'beranda'
    | 'sensus'
    | 'jadwal'
    | 'galeri'
    | 'renungan'
    | 'ai'
    | 'faq';

interface MemberLayoutProps extends PropsWithChildren {
    activeMenu?: ActiveMenuKey;
    header?: React.ReactNode;
}

export default function MemberLayout({
    children,
    activeMenu = 'beranda',
    header,
}: MemberLayoutProps) {
    // State untuk buka/tutup drawer di layar HP (Mobile)
    const [mobileOpen, setMobileOpen] = useState(false);

    // State untuk buka/tutup (collapse) sidebar di layar Desktop
    const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('ppgt_sidebar_collapsed') === 'true';
        }
        return false;
    });
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const handleLogout = () => {
        router.post(route('logout'), {}, {
            preserveScroll: true,
        });
    }
    // Simpan perubahan status buka/tutup ke localStorage
    useEffect(() => {
        localStorage.setItem('ppgt_sidebar_collapsed', String(isCollapsed));
    }, [isCollapsed]);

    const menuItems = [
        {
            key: 'beranda' as ActiveMenuKey,
            label: 'Beranda',
            href: route('dashboard'),
            icon: LayoutGrid,
        },
        {
            key: 'sensus' as ActiveMenuKey,
            label: 'Sensus Profil',
            href: route('sensus'),
            icon: UserCheck,
        },
        {
            key: 'jadwal' as ActiveMenuKey,
            label: 'Jadwal Ibadah & Roster',
            href: '#jadwal',
            icon: CalendarDays,
        },
        {
            key: 'galeri' as ActiveMenuKey,
            label: 'Galeri Kegiatan',
            href: '#galeri',
            icon: Images,
        },
        {
            key: 'renungan' as ActiveMenuKey,
            label: 'Renungan Harian',
            href: '#renungan',
            icon: BookOpen,
        },
        {
            key: 'ai' as ActiveMenuKey,
            label: 'Konsultasi AI Rohani',
            href: '#ai',
            icon: Bot,
        },
        {
            key: 'faq' as ActiveMenuKey,
            label: 'Bantuan & FAQ',
            href: '#faq',
            icon: CircleHelp,
        },
    ];

    const renderSidebarContent = (collapsedMode: boolean) => (
        <div className="flex h-full flex-col justify-between bg-[#3A86FF] px-3.5 py-6 text-white select-none transition-all duration-300 shadow-md">
            {/* Bagian Atas: Header Brand & Menu */}
            <div>
                {/* Header Logo & Nama Gereja */}
                <div
                    className={`flex items-center pb-6 border-b border-slate-700/80 ${
                        collapsedMode ? 'justify-center px-0' : 'gap-3.5 px-2'
                    }`}
                >
                    <div>
                        <ApplicationLogo className='w-12 h-12'/>
                    </div>

                    {!collapsedMode && (
                        <div className="leading-snug overflow-hidden whitespace-nowrap">
                            <h1 className="text-lg font-extrabold tracking-tight text-white">
                                PPGT Jemaat Batakan
                            </h1>
                            <p className="mt-0.5 text-xs font-bold text-slate-300">
                                Klasis Walenrang Timur
                            </p>
                        </div>
                    )}
                </div>

                {/* Daftar Navigasi Menu */}
                <nav className="mt-6 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeMenu === item.key;

                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                title={collapsedMode ? item.label : undefined}
                                className={`group relative flex items-center rounded-xl py-3 text-sm transition-all duration-150 ${
                                    collapsedMode
                                        ? 'justify-center px-0'
                                        : 'gap-3.5 px-4'
                                } ${
                                    isActive
                                        ? 'bg-[#dbeafe] font-bold text-slate-900 shadow-sm before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1.5 before:rounded-r-full before:bg-[#1d74f5]'
                                        : 'font-medium text-white hover:bg-slate-800/70 hover:text-white'
                                }`}
                            >
                                <Icon
                                    className={`size-5 shrink-0 transition-colors ${
                                        isActive
                                            ? 'text-[#1d74f5]'
                                            : 'text-white group-hover:text-slate-200'
                                    }`}
                                />

                                {!collapsedMode && (
                                    <span className="truncate">{item.label}</span>
                                )}

                                {/* Tooltip Melayang Saat Mode Tutup (Collapsed) */}
                                {collapsedMode && (
                                    <span className="pointer-events-none fixed left-20 ml-2 hidden rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg group-hover:block z-50 whitespace-nowrap border border-slate-700">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bagian Bawah: Tombol Keluar */}
            <div className="pt-5 border-t border-slate-700/80">
                <button
                    onClick={() => setShowLogoutModal(true)}
                    title={collapsedMode ? 'Keluar' : undefined}
                    className={`group relative flex w-full items-center rounded-xl py-3 text-sm font-medium text-white transition hover:bg-rose-500/10 hover:text-rose-400 ${
                        collapsedMode ? 'justify-center px-0' : 'gap-3.5 px-4'
                    }`}
                >
                    <LogOut className="size-5 shrink-0 text-white group-hover:text-rose-400" />
                    {!collapsedMode && <span>Keluar</span>}

                    {collapsedMode && (
                        <span className="pointer-events-none fixed left-20 ml-2 hidden rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-rose-400 shadow-lg group-hover:block z-50 whitespace-nowrap border border-slate-700">
                            Keluar
                        </span>
                    )}
                </button>
            </div>
            {/* Modal Konfirmasi Logout (TC-NAV-05) */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop Gelap */}
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                        onClick={() => setShowLogoutModal(false)}
                    />

                    {/* Kotak Dialog Modal */}
                    <div className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                        <div className='flex justify-between items-center'>
                            <h3 className="text-lg font-bold text-slate-900">
                                Konfirmasi Keluar
                            </h3>
                            <div className="flex size-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4">
                                <LogOut className="size-5" />
                                
                            </div>
                            
                        </div>

                        
                        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                            Apakah Anda yakin ingin keluar dari sesi Portal Anggota PPGT Jemaat Batakan?
                        </p>

                        <div className="mt-6 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(false)}
                                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Batal
                            </button>
                            <button
                                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
                                onClick={handleLogout}
                            >
                                Ya, Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f9ff] flex flex-col lg:flex-row overflow-x-clip w-full">
            {/* Topbar Khusus Layar HP (Mobile) */}
            <div className="sticky top-0 z-40 flex items-center justify-between bg-[#1e293b] px-4 py-3 text-white shadow-md lg:hidden">
                <div className="flex items-center gap-2.5">
                    <ApplicationLogo className='w-9 h-9'/>
                    <div>
                        <p className="text-sm font-bold leading-none">PPGT Jemaat Batakan</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">Klasis Walenrang Timur</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Buka atau tutup menu navigasi"
                    className="rounded-xl p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                    {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </div>

            {/* Drawer Sidebar untuk HP (Selalu menampilkan teks penuh saat dibuka) */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 flex lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="relative z-50 w-72 max-w-[80vw] h-full shadow-2xl">
                        {renderSidebarContent(false)}
                    </div>
                </div>
            )}

            {/* Sidebar Tetap (Fixed) untuk Desktop dengan Tombol Buka/Tutup */}
            <aside
                className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block shadow-xl transition-all duration-300 ${
                    isCollapsed ? 'lg:w-20' : 'lg:w-72'
                }`}
            >
                {/* Tombol Bulat Buka/Tutup di Pinggir Kanan Sidebar */}
                <button
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
                    className="absolute -right-3.5 top-9 z-50 flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#1d74f5] text-white shadow-md transition hover:bg-blue-600 focus:outline-none cursor-pointer"
                >
                    {isCollapsed ? (
                        <ChevronRight className="size-4 stroke-[2.5]" />
                    ) : (
                        <ChevronLeft className="size-4 stroke-[2.5]" />
                    )}
                </button>

                {renderSidebarContent(isCollapsed)}
            </aside>

            {/* Area Konten Utama Halaman (Menyesuaikan Lebar Sidebar Otomatis) */}
            <div
                className={`flex-1 flex flex-col min-h-screen min-w-0 w-full transition-all duration-300 ${
                    isCollapsed ? 'lg:pl-20' : 'lg:pl-72'
                }`}
            >
                {header && (
                    <div className="sticky top-0 z-30 w-full bg-white">
                        {header}
                    </div>
                )}
                <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 bg-[#f8f9ff] overflow-x-clip">
                    <div className="w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}