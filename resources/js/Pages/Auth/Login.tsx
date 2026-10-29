import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect, useMemo } from 'react';
import Button from '@/Components/ui/Button/Button';
import Input from '@/Components/ui/Input/Input';

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
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });
    const [showPassword, setShowPassword] = useState(false);

    // Memicu animasi reveal saat masuk ke halaman login
    useEffect(() => {
        const timer = setTimeout(() => {
            const elements = document.querySelectorAll('.reveal-from-left, .reveal-from-right');
            elements.forEach((el) => el.classList.add('revelead'));
        }, 50);

        return () => clearTimeout(timer);
    }, []);
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };


    return (
        <div className='h-screen bg-slate-50 flex flex-col lg:flex-row antialiased overflow-x-hidden'>
            <Head title='Login Anggota - PPGT Jemaat Batakan'/>
            <style>{`
                html {
                    scroll-behavior: smooth;
                    scroll-padding-top: 4rem;
                }
                .reveal-from-left {
                    opacity: 0;
                    transform: translateX(-500px);
                    transition: opacity 2s cubic-bezier(0.16, 1, 0.3, 1), transform 2s cubic-bezier(0.16, 1, 0.3, 1);
                    will-change: opacity, transform;
                }
                .reveal-from-left.revelead {
                    opacity: 1;
                    transform: translateX(0);
                }
                .reveal-from-right {
                    opacity: 0;
                    transform: translateX(500px);
                    transition: opacity 2s cubic-bezier(0.16, 1, 0.3, 1), transform 2s cubic-bezier(0.16, 1, 0.3, 1);
                    will-change: opacity, transform;
                }
                .reveal-from-right.revelead {
                    opacity: 1;
                    transform: translateX(0);
                }
            `}</style>

            <div className='hidden lg:flex lg:w-5/12 xl:w-1/2 relative bg-gradient-to-br from-[#3A86FF] via-blue-400 to-blue-400 p-10 xl:p-14 text-white flex-col justify-between overflow-hidden reveal-from-left'>
                {/* Decorative background glow circles */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

                <div className='relative z-10 flex items-center justify-between'>
                    <Link href={route('welcome')}>
                        <Button color='sekunder' clasName='bg-white/15 hover:bg-[#3A86FF] border-white/20 text-white backdrop-blue-md py-2 text-sm rounded-xl flex items-center gap-2'
                        ><ArrowLeft className='w-4 h-4'/>
                            Kembali Ke Beranda</Button>   
                    </Link>
                    <div className='font-semibold flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs tracking-wide'>
                        Silahkan masuk
                    </div>
                </div>

                <div className='relative z-10 my-auto py-8'>
                    <div className='flex items-center gap-3 mb-6'>
                        <ApplicationLogo className='w-12 h-12 object-contain'/>
                        <div>
                            <h2 className='text-xl font-bold tracking-tight text-white'>PPGT Jemaat Batakan</h2>
                            <p className='text-blue-100 text-xs'>Gereja Toraja Klasis Walenrang Timur</p>
                        </div>
                    </div>

                    <h1 className='text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-4'>
                        Bertumbuh Bersama dalam Persukutuan & Pelayanan
                    </h1>

                    <p>
                        Masukkan email dan password anda agar terhubung dengan persekutuan, penugasan roster ibadah, warta kegiatan, dan dokumentasi kebersamaan pemuda.
                    </p>

                    <div className='relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl group'>
                        <img src="/storage/bg.jpeg" alt="PPGT Jemaat Batakan" 
                        className='w-full h-52 xl:h-60 object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out'/>
                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5'>
                            <span className='text-xs uppercase font-semibold tracking-wider text-blue-300 mb-1'>
                                Semangat Pemuda Toraja
                            </span>
                            <p className='text-sm text-white/95 font-medium italic'>
                                &ldquo;Kader Siap utus - Berakar dalam Kristur, Berbuah bagi Sesama&rdquo;
                            </p>
                        </div>

                    </div>
                </div>
                <div className='relative z-10 pt-2 border-t border-white/15 flex items-center justify-between text-blue-100 text-xs'>
                    <span>&copy; {new Date().getFullYear()} PPGT Jemaat Batakan</span>
                    <span>Portal Pemudah & Ibadah</span>
                </div>
            </div>
            <div className='w-full lg:w-7/12 xl:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12'>
                <div className='w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 reveal-from-right sm:p-10 p-6'>
                    <div className='flex lg:hidden items-center justify-between mb-6 pb-4 border-b border-slate-100'>
                        <Link href={route('welcome')} className='inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#3A86FF] transition-colors'>
                            <ArrowLeft className='w-4 h-4'/> 
                            Kembali
                        </Link>
                        <div className='flex items-center gap-2'>
                            <ApplicationLogo className='w-7 h-7'/>
                            <span className='text-xs font-bold text-slate-800'>PPGT Batakan</span>
                        </div>
                    </div>
                    <div className='mb-6'>
                        <div className='inline-flex gap-2 text-xs font-bold uppercase text-[#3A86ff] tracking-wider mb-6'>
                            Selamat Datang Kembali
                        </div>
                        <h1 className='font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight'>
                            Masuk Akun
                        </h1>
                        <p className='mt-2 text-sm text-slate-500'>
                            Gunakan email yang sudah terdaftar
                        </p>
                    </div>
                    <form onSubmit={submit} className='space-y-4'>
                        <Input 
                            id='email'
                            name='email'
                            placehoder='Masukkan Email'
                            required
                            type='text'
                            value={data.email}
                            error={errors.email}
                            onChange={(e) => setData('email', e.target.value)}
                            icon={<Mail className='w-4 h-4' />}
                            label='Email'
                        />
                        <Input 
                            id='password'
                            name='password'
                            placehoder='Masukkan Password'
                            label='Password'
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={data.password}
                            error={errors.password}
                            onChange={(e) => setData('password', e.target.value)}
                            icon={<Lock className='w-4 h-4'/>}
                            rightElement={
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    className='text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer'
                                >{showPassword ? (
                                    <EyeOff className='w-4 h-4'/>
                                ): (
                                    <Eye className='w-4 h-4'/>
                                )}</button>
                            }
                        />
                        <div className='flex items-center gap-2'>
                            <Checkbox />
                            <span className='text-sm text-gray-600'>Ingat Saya</span>
                        </div>
                        <Button type='submit' clasName='w-full mt-4' color='primer' disabled={processing}>{processing ? (
                            <>
                                <Loader2 className='w-4 h-4 animate-spin'/>
                                <span>Memproses...</span>
                            </>
                        ): (
                            <>
                                <span>Login</span>
                                <ArrowRight className='w-4 h-4'/>
                            </>
                        )}</Button>
                        <div className='flex justify-center items-center gap-1 border-t pt-2'>
                            <p className='text-gray-600'>Belum memiliki Akun? </p>
                            <Link href={route('register')} className='font-bold text-[#3A86FF] hover:underline'>
                                Daftar Sekarang
                            </Link>
                        </div>
                    </form>
                </div>
                
            </div>
        </div>
    );
}
