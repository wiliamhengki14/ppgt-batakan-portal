import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { CheckCircle2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const { auth } = usePage().props as { auth: { user: { name: string; email: string; email_verified_at?: string } } };
    const [showVerifiedAlert, setShowVerifiedAlert] = useState(false);

    useEffect(() => {
        // Cek apakah ada query parameter ?verified=1 setelah user mengklik link verifikasi
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('verified') === '1') {
                setShowVerifiedAlert(true);
            }
        }
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Notifikasi Pop-up / Banner Berhasil Verifikasi Email */}
                    {showVerifiedAlert && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start justify-between shadow-sm transition-all duration-300">
                            <div className="flex items-start gap-3">
                                <div className="p-1 bg-emerald-100 rounded-lg text-emerald-600 mt-0.5">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-emerald-900">
                                        Email Berhasil Diverifikasi!
                                    </h4>
                                    <p className="text-xs sm:text-sm text-emerald-700 mt-0.5">
                                        Terima kasih, {auth.user.name}. Alamat email Anda (<span className="font-semibold">{auth.user.email}</span>) telah terverifikasi secara resmi. Akun Anda kini aktif sepenuhnya di Portal PPGT Jemaat Batakan.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowVerifiedAlert(false)}
                                className="text-emerald-500 hover:text-emerald-800 transition-colors p-1 rounded-lg hover:bg-emerald-100 cursor-pointer"
                                title="Tutup notifikasi"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-2xl border border-slate-100 p-6 sm:p-8">
                        <div className="text-gray-900 font-medium">
                            Selamat datang di Dashboard PPGT Jemaat Batakan, <span className="font-bold text-[#3A86FF]">{auth.user.name}</span>!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

