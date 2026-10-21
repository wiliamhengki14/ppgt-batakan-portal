import ApplicationLogo from '@/Components/ApplicationLogo';
import Button from '@/Components/ui/Button/Button';
import Input from '@/Components/ui/Input/Input';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Check,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    Phone,
    ShieldCheck,
    User,
} from 'lucide-react';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone_number: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Memicu animasi reveal saat masuk ke halaman daftar
    useEffect(() => {
        const timer = setTimeout(() => {
            const elements = document.querySelectorAll('.reveal-from-left, .reveal-from-right');
            elements.forEach((el) => el.classList.add('revealed'));
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    // Evaluasi kekuatan password secara interaktif
    const passwordStrength = useMemo(() => {
        const pwd = data.password;
        if (!pwd) return { score: 0, label: '', color: 'bg-slate-200', text: 'text-slate-400' };

        let score = 0;
        if (pwd.length >= 8) score += 1;
        if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

        switch (score) {
            case 1:
                return { score: 1, label: 'Lemah', color: 'bg-rose-500', text: 'text-rose-500' };
            case 2:
                return { score: 2, label: 'Cukup', color: 'bg-amber-500', text: 'text-amber-500' };
            case 3:
                return { score: 3, label: 'Kuat', color: 'bg-blue-500', text: 'text-blue-500' };
            case 4:
                return { score: 4, label: 'Sangat Kuat', color: 'bg-emerald-500', text: 'text-emerald-600' };
            default:
                return { score: 0, label: 'Terlalu Pendek', color: 'bg-rose-400', text: 'text-rose-400' };
        }
    }, [data.password]);

    // Cek kesesuaian password konfirmasi secara realtime
    const passwordsMatch = useMemo(() => {
        if (!data.password_confirmation) return null;
        return data.password === data.password_confirmation;
    }, [data.password, data.password_confirmation]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="h-screen bg-slate-50 flex flex-col lg:flex-row antialiased overflow-x-hidden">
            <Head title="Pendaftaran Anggota - PPGT Jemaat Batakan" />
            <style>{`
                html {
                    scroll-behavior: smooth;
                    scroll-padding-top: 4rem;
                }
                /* Posisi awal sebelum masuk layar: digeser 100px ke kiri (-100px) & transparan */
                .reveal-from-left {
                    opacity: 0;
                    transform: translateX(-100px);
                    transition: opacity 2s cubic-bezier(0.16, 1, 0.3, 1), transform 2s cubic-bezier(0.16, 1, 0.3, 1);
                    will-change: opacity, transform;
                }
                /* Posisi setelah terlihat di layar (.revealed): meluncur masuk ke posisi normal (0) */
                .reveal-from-left.revealed {
                    opacity: 1;
                    transform: translateX(0);
                }

                /* Posisi awal sebelum masuk layar: digeser 100px ke kanan (100px) & transparan */
                .reveal-from-right {
                    opacity: 0;
                    transform: translateX(100px);
                    transition: opacity 2s cubic-bezier(0.16, 1, 0.3, 1), transform 2s cubic-bezier(0.16, 1, 0.3, 1);
                    will-change: opacity, transform;
                }
                /* Posisi setelah terlihat di layar (.revealed): meluncur masuk ke posisi normal (0) */
                .reveal-from-right.revealed {
                    opacity: 1;
                    transform: translateX(0);
                }
            `}</style>
            {/* Kolom Kiri: Showcase Branding PPGT (Desktop View) */}
            <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative bg-gradient-to-br from-[#3A86FF] via-blue-400 to-blue-300 p-10 xl:p-14 text-white flex-col justify-between overflow-hidden shadow-2xl reveal-from-left">
                {/* Decorative background glow circles */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

                {/* Header Kiri */}
                <div className="relative z-10 flex items-center justify-between">
                    <Link href={route('welcome')}>
                        <Button
                            color="primer"
                            clasName="bg-white/15 hover:bg-[#3A86FF] border-white/20 text-white backdrop-blur-md px-4 py-2 text-sm rounded-xl flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Beranda
                        </Button>
                    </Link>

                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-semibold tracking-wide">
                        Pendaftaran Terbuka
                    </div>
                </div>

                {/* Banner & Identitas Komunitas */}
                <div className="relative z-10 my-auto py-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-white rounded-2xl shadow-lg shadow-black/10">
                            <ApplicationLogo className="w-10 h-10 object-contain" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-white">PPGT Jemaat Batakan</h2>
                            <p className="text-blue-100 text-xs">Gereja Toraja Klasis Walenrang Timur</p>
                        </div>
                    </div>

                    <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-4">
                        Bertumbuh Bersama dalam Persekutuan & Pelayanan
                    </h1>

                    <p className="text-blue-100/90 text-sm xl:text-base leading-relaxed mb-8 max-w-lg">
                        Daftarkan diri Anda untuk terhubung dengan agenda persekutuan, penugasan roster ibadah, warta kegiatan, dan dokumentasi kebersamaan pemuda.
                    </p>

                    {/* Image Card Showcase */}
                    <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl group">
                        <img
                            src="/storage/bg.jpeg"
                            alt="PPGT Jemaat Batakan"
                            className="w-full h-52 xl:h-60 object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5">
                            <span className="text-xs uppercase font-semibold tracking-wider text-blue-300 mb-1">
                                Semangat Pemuda Toraja
                            </span>
                            <p className="text-sm text-white/95 font-medium italic">
                                &ldquo;Kader Siap Utus — Berakar dalam Kristus, Berbuah bagi Sesama&rdquo;
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Kiri */}
                <div className="relative z-10 pt-2 border-t border-white/15 flex items-center justify-between text-xs text-blue-100">
                    <span>&copy; {new Date().getFullYear()} PPGT Jemaat Batakan</span>
                    <span>Portal Pemuda & Ibadah</span>
                </div>
            </div>

            {/* Kolom Kanan: Form Registrasi Modern Menggunakan Komponen UI Input & Button */}
            <div className="w-full lg:w-7/12 xl:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12">
                <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-10 reveal-from-right">
                    {/* Header Mobile: Tombol Kembali & Logo */}
                    <div className="flex lg:hidden items-center justify-between mb-6 pb-4 border-b border-slate-100">
                        <Link
                            href={route('welcome')}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#3A86FF] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali
                        </Link>
                        <div className="flex items-center gap-2">
                            <ApplicationLogo className="w-7 h-7" />
                            <span className="text-xs font-bold text-slate-800">PPGT Batakan</span>
                        </div>
                    </div>

                    {/* Judul & Deskripsi Form */}
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2  text-[#3A86FF] text-xs font-bold uppercase tracking-wider mb-3">

                            Pendaftaran Anggota
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Buat Akun Baru
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Lengkapi data di bawah ini untuk bergabung menjadi anggota PPGT Jemaat Batakan.
                        </p>
                    </div>

                    {/* Form Input Menggunakan Komponen Input & Button */}
                    <form onSubmit={submit} className="space-y-4">
                        {/* 1. Nama Lengkap */}
                        <Input
                            id="name"
                            name="name"
                            label="Nama Lengkap"
                            required
                            type="text"
                            value={data.name}
                            error={errors.name}
                            placehoder="Contoh: William Hengki"
                            onChange={(e) => setData('name', e.target.value)}
                            icon={<User className="w-4 h-4" />}
                        />

                        {/* 2. Grid Email & WhatsApp */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                id="email"
                                name="email"
                                label="Alamat Email"
                                required
                                type="email"
                                value={data.email}
                                error={errors.email}
                                placehoder="nama@email.com"
                                onChange={(e) => setData('email', e.target.value)}
                                icon={<Mail className="w-4 h-4" />}
                            />

                            <Input
                                id="phone_number"
                                name="phone_number"
                                label="WhatsApp / HP"
                                required
                                type="tel"
                                value={data.phone_number}
                                error={errors.phone_number}
                                placehoder="0812xxxxxxxx"
                                onChange={(e) => setData('phone_number', e.target.value)}
                                icon={<Phone className="w-4 h-4" />}
                            />
                        </div>

                        {/* 3. Password */}
                        <div>
                            <Input
                                id="password"
                                name="password"
                                label="Password"
                                required
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                error={errors.password}
                                placehoder="Minimal 8 karakter"
                                onChange={(e) => setData('password', e.target.value)}
                                icon={<Lock className="w-4 h-4" />}
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                        className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                }
                            />

                            {/* Password Strength Meter */}
                            {data.password && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="text-slate-400">Kekuatan Password</span>
                                        <span className={`font-semibold ${passwordStrength.text}`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                                        <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-200'}`} />
                                        <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-200'}`} />
                                        <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-200'}`} />
                                        <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.score >= 4 ? passwordStrength.color : 'bg-slate-200'}`} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 4. Konfirmasi Password */}
                        <div>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                label="Konfirmasi Password"
                                required
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={data.password_confirmation}
                                error={errors.password_confirmation}
                                placehoder="Ulangi password di atas"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                icon={<ShieldCheck className="w-4 h-4" />}
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        tabIndex={-1}
                                        className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                }
                            />

                            {/* Password match feedback */}
                            {passwordsMatch !== null && (
                                <p
                                    className={`text-xs font-semibold flex items-center gap-1.5 mt-1.5 transition-colors ${passwordsMatch ? 'text-emerald-600' : 'text-amber-500'
                                        }`}
                                >
                                    {passwordsMatch ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                            Password cocok
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            Password belum cocok
                                        </>
                                    )}
                                </p>
                            )}
                        </div>

                        {/* 5. Tombol Submit Menggunakan Komponen Button Anda */}
                        <div className="pt-2">
                            <Button
                                color="primer"
                                disabled={processing}
                                clasName="w-full py-3.5 font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Memproses Pendaftaran...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Daftar Akun Anggota</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Footer: Link ke Halaman Login */}
                        <div className="pt-4 text-center border-t border-slate-100">
                            <p className="text-sm text-slate-600">
                                Sudah memiliki akun PPGT?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-bold text-[#3A86FF] hover:text-[#2563EB] hover:underline transition-colors"
                                >
                                    Masuk di sini
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
