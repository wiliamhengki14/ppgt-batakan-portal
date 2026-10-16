import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

interface Props {
  auth?: {
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };
}
function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="placeholder-grid flex min-h-56 items-center justify-center border border-zinc-400 bg-zinc-100 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
      <span className="border border-zinc-400 bg-white px-3 py-2">{label}</span>
    </div>
  )
}

export default function Welcome({ auth }: Props) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isOverHero, setIsOverHero] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      const homeSection = document.getElementById('home');
      if (homeSection) {
        const rect = homeSection.getBoundingClientRect();
        setIsOverHero(rect.bottom > 70);
      } else {
        setIsOverHero(window.scrollY < 400);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

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
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll, .reveal-from-left');
    elements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const faqs = [
    {
      question: "Kapan jadwal ibadah pemuda rutin diadakan?",
      answer: "Ibadah rutin PPGT Jemaat Batakan diadakan setiap hari Sabtu pukul 18.30 WITA...",
    },
    {
      question:
        "Saya pemuda Toraja perantauan yang baru pindah ke Walenrang Timur, bagaimana cara bergabung?",
      answer:
        "Selamat datang di Batakan! Kamu bisa langsung hadir di ibadah pemuda terdekat, menghubungi pengurus melalui kontak di bawah, atau membuat akun di web ini dan mengisi formulir sensus kategori 'Perantau'.",
    },
    {
      question: "Apakah pemuda di luar Batakan bisa ikut bersekutu?",
      answer:
        "Tentu saja! PPGT Jemaat Batakan sangat terbuka bagi seluruh pemuda-pemudi Toraja maupun rekan-rekan pemuda Kristen lainnya yang rindu bersekutu dan bertumbuh bersama dalam iman.",
    },
    {
      question: "Bagaimana cara melengkapi sensus data keluarga?",
      answer:
        "Silakan login ke akun kamu, lalu buka menu 'Sensus Anggota & Keluarga'. Isi data diri dan anggota keluarga dengan lengkap. Setelah dikirim, pengurus/admin akan memverifikasi berkas datamu.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const navLinkClass = `transition-colors hover:underline ${
    isOverHero
      ? 'text-white/90 hover:text-[#4BB8FA]'
      : 'text-zinc-700 hover:text-[#2373F4]'
  }`;

  return (
    <>
      <Head title="Beranda - PPGT Jemaat Batakan" />

      <style>{`
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 4rem;
        }
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
          will-change: opacity, transform;
        }
        .reveal-on-scroll.revealed {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-from-left {
          opacity: 0;
          transform: translateX(-100px);
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
          will-change: opacity, transform;
        }
        .reveal-from-left.revealed {
          opacity: 1;
          transform: translateX(0);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-delay-100.revealed {
          transition-delay: 250ms;
        }
        .reveal-delay-200.revealed {
          transition-delay: 500ms;
        }
        .reveal-delay-300.revealed {
          transition-delay: 750ms;
        }
        .reveal-delay-400.revealed {
          transition-delay: 1000ms;
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal-on-scroll,
          .reveal-from-left {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#f5f5f2] text-zinc-950 overflow-x-hidden">
        {/* Navbar */}
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isOverHero
              ? 'bg-transparent text-white'
              : 'bg-white text-zinc-950 shadow-[0px_0px_4px_rgba(0,0,0,0.2)]'
          }`}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
            <a
              href="#home"
              className={`flex items-center gap-2 font-extrabold transition-colors ${
                isOverHero ? 'text-white' : 'text-zinc-950'
              }`}
            >
              <ApplicationLogo className="w-10" />
              PPGT Jemaat Batakan
            </a>

            {/* Nav Links */}
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              <a href="#home" className={navLinkClass}>Home</a>
              <a href="#renungan" className={navLinkClass}>Renungan</a>
              <a href="#kegiatan" className={navLinkClass}>Kegiatan</a>
              <a href="#dokumentasi" className={navLinkClass}>Dokumentasi</a>
              <a href="#pengurus" className={navLinkClass}>Pengurus</a>
              <a href="#faq" className={navLinkClass}>FAQ</a>
              <a href="#kontak" className={navLinkClass}>Kontak</a>
            </nav>

            {/* Action Buttons menggunakan Link Inertia */}
            <div className="flex items-center gap-3">
              {auth?.user ? (
                <Link
                  href={route('dashboard')}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                    isOverHero
                      ? 'border border-white/60 bg-white/10 text-white hover:bg-white hover:text-zinc-950 backdrop-blur-sm'
                      : 'border border-zinc-950 bg-zinc-950 text-white hover:bg-transparent hover:text-zinc-950'
                  }`}
                >
                  Dashboard ({auth.user.name})
                </Link>
              ) : (
                <>
                  <Link
                    href={route('register')}
                    className={`text-sm transition hover:underline ${
                      isOverHero
                        ? 'text-white/90 hover:text-[#4BB8FA]'
                        : 'text-zinc-700 hover:text-[#3A86FF]'
                    }`}
                  >
                    Daftar
                  </Link>
                  <Link
                    href={route('login')}
                    className={`px-4 py-2 text-sm font-semibold transition border border-[#3A86FF] rounded-lg ${
                      isOverHero
                        ? 'bg-[#3A86FF] text-white hover:bg-white hover:text-slate-900 hover:border-white shadow-sm'
                        : 'bg-[#3A86FF] text-white hover:text-black hover:bg-transparent'
                    }`}
                  >
                    Masuk (Login)
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <main>
          <section
            className="relative flex min-h-screen w-full items-center border-b border-slate-700 bg-[url('/storage/bg.jpeg')] bg-cover bg-center bg-no-repeat overflow-hidden"
            id="home"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-800/60 backdrop-blur-[1px]" />
            <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-24">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-400/30 bg-slate-800/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-100 backdrop-blur-md reveal-from-left">
                  <span className="size-2 rounded-full bg-sky-400" />
                  Klasis Walenrang Timur
                </div>
                <h1 className="max-w-2xl text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] text-white drop-shadow-sm sm:text-6xl lg:text-7xl reveal-from-left reveal-delay-100">
                  PPGT JEMAAT BATAKAN
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200 reveal-from-left reveal-delay-200">
                  1 Korintus 3:11 (TB) Karena tidak ada seorang pun yang dapat
                  meletakkan dasar lain dari pada dasar yang telah diletakkan,
                  yaitu Yesus Kristus.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row reveal-from-left reveal-delay-300">
                  <a
                    className="w-full rounded-2xl border border-[#3A86FF] bg-[#3A86FF] px-6 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:bg-transparent hover:text-white sm:w-40"
                    href="#kegiatan"
                  >
                    Jadwal Ibadah
                  </a>
                  <a
                    className="w-full rounded-2xl border border-slate-300/60 bg-slate-800/40 px-6 py-3 text-center text-sm font-semibold text-white backdrop-blur-sm transition hover:border-[#3A86FF] hover:bg-[#3A86FF] hover:text-white sm:w-40"
                    href="#kontak"
                  >
                    Hubungi Kami
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Renungan Harian */}
          <section className="border-b border-zinc-400 bg-white" id="renungan">
            <div className="mx-auto max-w-7xl px-5 py-12 text-left lg:px-8 lg:py-16">
              <div className="mb-8 reveal-on-scroll">
                <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                  Renungan Harian
                </h2>
                <div className="mt-3 h-1 w-20 bg-[#3A86FF]" />
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-start">
                <div className="overflow-hidden rounded-2xl border border-zinc-300 bg-zinc-950 shadow-sm items-center h-full reveal-on-scroll reveal-delay-100">
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="aspect-video w-full"
                    referrerPolicy="strict-origin-when-cross-origin"
                    src="https://www.youtube.com/embed/VfXuTBKDdIU"
                    title="Renungan Harian Toraya"
                  />
                </div>

                <article className="reveal-on-scroll reveal-delay-200">
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    Renungan hari ini
                  </p>
                  <h3 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
                    Dasar yang Teguh di Dalam Kristus
                  </h3>
                  <p className="mt-5 font-semibold leading-7">
                    1 Korintus 3:11 (TB)
                  </p>
                  <p className="mt-2 leading-8 text-zinc-700">
                    “Karena tidak ada seorang pun yang dapat meletakkan dasar lain
                    dari pada dasar yang telah diletakkan, yaitu Yesus Kristus.”
                  </p>
                  <p className="mt-5 leading-8 text-zinc-700">
                    Kehidupan yang kuat tidak dibangun hanya di atas keberhasilan,
                    kemampuan, atau pengakuan manusia. Firman Tuhan mengingatkan
                    kita bahwa Yesus Kristus adalah satu-satunya dasar yang teguh.
                    Ketika iman, pelayanan, dan pengharapan kita berdiri di
                    atas-Nya, kita dimampukan untuk tetap setia menghadapi setiap
                    musim kehidupan.
                  </p>
                </article>
              </div>

              <div className="mt-10 border-y border-zinc-300 py-5 text-sm text-zinc-500 reveal-on-scroll reveal-delay-300">
                Penulis:{" "}
                <span className="font-semibold text-zinc-800">
                  Tim Renungan Harian PPGT Jemaat Batakan
                </span>
              </div>
            </div>
          </section>

          {/* 4. Agenda & Kegiatan PPGT */}
          <section className="border-b border-zinc-400 bg-[#4BB8FA]" id="kegiatan">
            <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
              <div className="mb-10 reveal-on-scroll">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#fff]">
                  Agenda terdekat
                </p>
                <h2 className="text-4xl font-bold text-white tracking-[-0.03em] sm:text-5xl">
                  Kegiatan PPGT
                </h2>
                <div className="mt-4 h-1 w-20 bg-[#3A86FF]" />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[
                  {
                    date: "Jumat, 19.00 WITA",
                    image:
                      "https://images.unsplash.com/photo-1611087802810-046bb671e644?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1200",
                    title: "Ibadah Rutin PPGT",
                  },
                  {
                    date: "Sabtu, 16.00 WITA",
                    image:
                      "https://images.unsplash.com/photo-1641391460340-df6898498efd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1200",
                    title: "Latihan & Persekutuan Pemuda",
                  },
                  {
                    date: "Minggu, 10.00 WITA",
                    image:
                      "https://images.unsplash.com/photo-1635540636763-5efe299f6aae?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1200",
                    title: "Pelayanan dan Kebersamaan",
                  },
                ].map((activity, index) => (
                  <article
                    className={`group flex h-full flex-col overflow-hidden rounded-2xl shadow-[0px_0px_4px_rgba(0,0,0,0.2)] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg reveal-on-scroll ${
                      index === 0 ? 'reveal-delay-100' : index === 1 ? 'reveal-delay-200' : 'reveal-delay-300'
                    }`}
                    key={activity.title}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-zinc-200">
                      <img
                        alt={activity.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        src={activity.image}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                        {activity.date}
                      </p>
                      <h3 className="mt-3 text-xl font-bold leading-snug">
                        {activity.title}
                      </h3>
                      <a
                        className="mt-7 inline-flex w-full items-center justify-center rounded-2xl border border-[#3A86FF] px-5 py-3 text-sm font-semibold transition hover:bg-[#3A86FF] hover:text-white"
                        href="#"
                      >
                        Detail Acara
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* 5. Dokumentasi Kegiatan */}
          <section className="border-b border-zinc-400 bg-white" id="dokumentasi">
            <style>{`
            @keyframes documentation-coverflow {
              0%, 10% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
                z-index: 6;
              }
              16.67%, 27% {
                transform: translate(-115%, -50%) scale(.82);
                opacity: 1;
                z-index: 5;
              }
              33.33%, 44% {
                transform: translate(-155%, -50%) scale(.64);
                opacity: .45;
                z-index: 3;
              }
              50%, 60% {
                transform: translate(-190%, -50%) scale(.5);
                opacity: 0;
                z-index: 1;
              }
              66.67%, 77% {
                transform: translate(90%, -50%) scale(.5);
                opacity: 0;
                z-index: 1;
              }
              83.33%, 94% {
                transform: translate(15%, -50%) scale(.82);
                opacity: 1;
                z-index: 5;
              }
              100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
                z-index: 6;
              }
            }

            .documentation-slide {
              animation: documentation-coverflow 24s infinite ease-in-out;
              will-change: transform, opacity;
            }

            .documentation-coverflow:hover .documentation-slide {
              animation-play-state: paused;
            }

            @media (prefers-reduced-motion: reduce) {
              .documentation-slide {
                animation-play-state: paused;
              }
            }
          `}</style>
            <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
              <div className="mx-auto mb-10 max-w-3xl text-center reveal-on-scroll">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Cuplikan dokumentasi
                </p>
                <h2 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                  Dokumentasi Kegiatan
                </h2>
                <div className="mx-auto mt-4 h-1 w-20 bg-[#3A86FF]" />
                <p className="mt-5 leading-7 text-zinc-600">
                  Lihat momen kebersamaan dan keseruan PPGT Jemaat Batakan dalam
                  pelayanan, persekutuan, dan berbagai kegiatan sosial.
                </p>
              </div>

              <div className="documentation-coverflow relative isolate flex h-[260px] items-center justify-center overflow-hidden sm:h-[380px] lg:h-[440px] reveal-on-scroll reveal-delay-100">
                {[
                  {
                    image:
                      "https://images.unsplash.com/photo-1701590219284-c3cce0148be1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1200",
                    title: "HUT PPGT",
                  },
                  {
                    image:
                      "https://images.unsplash.com/photo-1611087802810-046bb671e644?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1200",
                    title: "Ret-ret Pemuda",
                  },
                  {
                    image:
                      "https://images.unsplash.com/photo-1663246544754-c9145de13338?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1200",
                    title: "Bakti Sosial",
                  },
                  {
                    image:
                      "https://images.unsplash.com/photo-1678681438108-252df5ddacd1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1200",
                    title: "Persekutuan PPGT",
                  },
                  {
                    image:
                      "https://images.unsplash.com/photo-1717231855727-06fa2b4c431c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1200",
                    title: "Kebersamaan Anggota",
                  },
                  {
                    image:
                      "https://images.unsplash.com/photo-1760637627644-21a07fb5353a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1200",
                    title: "Rekreasi Bersama",
                  },
                ].map((photo, index) => (
                  <figure
                    className="documentation-slide group absolute left-1/2 top-1/2 aspect-[16/10] w-[86%] origin-center overflow-hidden rounded-2xl bg-zinc-200 shadow-xl sm:w-[68%] lg:w-[56%]"
                    key={photo.title}
                    style={{
                      animationDelay: `${((6 - index) % 6) * -4}s`,
                    }}
                  >
                    <img
                      alt={`Dokumentasi ${photo.title}`}
                      className="h-full w-full object-cover object-center transition duration-500 ease-out group-hover:scale-110"
                      src={photo.image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent transition duration-300 group-hover:from-black/90" />
                    <figcaption className="absolute inset-x-0 bottom-0 translate-y-1 p-4 text-sm font-bold text-white transition duration-300 group-hover:translate-y-0 sm:p-5 sm:text-lg">
                      {photo.title}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                Berganti otomatis · Arahkan kursor untuk menjeda
              </p>

              <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-zinc-300 bg-zinc-100 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between reveal-on-scroll reveal-delay-200">
                <div className="flex max-w-3xl items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-transparent text-lg text-white"
                  >
                    🔒
                  </span>
                  <div>
                    <h3 className="font-bold">Galeri khusus anggota</h3>
                    <p className="mt-1 leading-7 text-zinc-600">
                      Ingin melihat &amp; mengunduh ratusan foto dokumentasi
                      lainnya? Silakan login terlebih dahulu sebagai anggota PPGT.
                    </p>
                  </div>
                </div>
                <a
                  className="shrink-0 rounded-2xl bg-[#3A86FF] px-6 py-4 text-center text-sm font-semibold text-white transition hover:bg-zinc-700"
                  href="#"
                >
                  Buka Galeri Lengkap (Login)
                </a>
              </div>
            </div>
          </section>

          {/* 6. Struktur Pengurus Aktif */}
          <section className="border-b border-zinc-400 " id="pengurus">
            <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
              <div className="mx-auto mb-12 max-w-3xl text-center reveal-on-scroll">
                <span className="inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-600">
                  Periode Kepengurusan 2026–2028
                </span>
                <h2 className="mt-5 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
                  Struktur Pengurus Aktif
                </h2>
                <div className="mx-auto mt-4 h-1 w-20 bg-[#3A86FF]" />
                <p className="mt-5 leading-7 text-zinc-600">
                  Pengurus yang melayani dan bertumbuh bersama PPGT Jemaat
                  Batakan.
                </p>
              </div>

              {/* Tingkat 1: BPH */}
              <div>
                <div className="mb-6 flex items-end justify-between gap-4 reveal-on-scroll">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Tingkat 1
                    </p>
                    <h3 className="mt-1 text-2xl font-bold">
                      Badan Pengurus Harian
                    </h3>
                  </div>
                  <span className="hidden text-sm text-zinc-500 sm:block">
                    Arahkan kursor ke foto
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      image:
                        "https://images.unsplash.com/photo-1740414289827-3332d41cb11a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900",
                      name: "Nama Ketua",
                      role: "Ketua",
                    },
                    {
                      image:
                        "https://images.unsplash.com/photo-1636368086488-bb2c04738214?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900",
                      name: "Nama Wakil Ketua",
                      role: "Wakil Ketua",
                    },
                    {
                      image:
                        "https://images.unsplash.com/photo-1674048921642-8968a1cd6237?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900",
                      name: "Nama Sekretaris",
                      role: "Sekretaris",
                    },
                    {
                      image:
                        "https://images.unsplash.com/photo-1654765436522-f59e5cbadcc8?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900",
                      name: "Nama Bendahara",
                      role: "Bendahara",
                    },
                  ].map((person, index) => (
                    <article
                      className={`group overflow-hidden rounded-2xl border border-zinc-300 bg-white transition duration-500 hover:-translate-y-2 hover:shadow-xl reveal-on-scroll ${
                        ['reveal-delay-100', 'reveal-delay-200', 'reveal-delay-300', 'reveal-delay-400'][index] || ''
                      }`}
                      key={person.role}
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-zinc-200">
                        <img
                          alt={`${person.role} PPGT Jemaat Batakan`}
                          className="h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-[1.15]"
                          src={person.image}
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                          {person.role}
                        </p>
                        <h4 className="mt-1 text-lg font-bold">{person.name}</h4>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Tingkat 2: Koordinator Bidang */}
              <div className="mt-14">
                <div className="mb-6 reveal-on-scroll">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    Tingkat 2
                  </p>
                  <h3 className="mt-1 text-2xl font-bold">Koordinator Bidang</h3>
                </div>

                <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      coordinator: "Nama Koordinator",
                      image:
                        "https://images.unsplash.com/photo-1523151401668-fff9e38a48e4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000",
                      members: [
                        "Nama Anggota 1",
                        "Nama Anggota 2",
                        "Nama Anggota 3",
                      ],
                      title: "Kerohanian",
                    },
                    {
                      coordinator: "Nama Koordinator",
                      image:
                        "https://images.unsplash.com/photo-1649009000780-58448d3add13?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000",
                      members: [
                        "Nama Anggota 1",
                        "Nama Anggota 2",
                        "Nama Anggota 3",
                      ],
                      title: "Minat & Bakat",
                    },
                    {
                      coordinator: "Nama Koordinator",
                      image:
                        "https://images.unsplash.com/photo-1563481911853-c14860cd6947?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000",
                      members: [
                        "Nama Anggota 1",
                        "Nama Anggota 2",
                        "Nama Anggota 3",
                      ],
                      title: "Kominfo / Multimedia",
                    },
                    {
                      coordinator: "Nama Koordinator",
                      image:
                        "https://images.unsplash.com/photo-1611087802810-046bb671e644?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=1000",
                      members: [
                        "Nama Anggota 1",
                        "Nama Anggota 2",
                        "Nama Anggota 3",
                      ],
                      title: "Hubungan Masyarakat",
                    },
                  ].map((division, index) => (
                    <article
                      className={`group reveal-on-scroll ${
                        ['reveal-delay-100', 'reveal-delay-200', 'reveal-delay-300', 'reveal-delay-400'][index] || ''
                      }`}
                      key={division.title}
                    >
                      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-200">
                        <img
                          alt={`Kelompok Bidang ${division.title}`}
                          className="h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-110"
                          src={division.image}
                        />
                      </div>
                      <div className="px-1 pt-5">
                        <h4 className="text-xl font-bold leading-snug text-blue-700">
                          {division.title}
                        </h4>
                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                          <span className="font-semibold text-zinc-900">
                            Koordinator:
                          </span>{" "}
                          {division.coordinator}
                        </p>
                        <p className="mt-3 text-sm font-semibold text-zinc-900">
                          Anggota:
                        </p>
                        <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm leading-6 text-zinc-600">
                          {division.members.map((member) => (
                            <li key={member}>{member}</li>
                          ))}
                        </ol>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 7. Section FAQ (Accordion Menggantikan Pricing) */}
          <section className="bg-zinc-950 text-white" id="faq">
            <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
              <div className="mb-12 max-w-3xl reveal-on-scroll">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Tanya Jawab Seputar PPGT
                </p>
                <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                  Pertanyaan yang Sering Diajukan
                </h2>
                <div className="mt-4 h-1 w-20 bg-white" />
                <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
                  Temukan informasi penting seputar jadwal ibadah, bergabung
                  sebagai pemuda rantau, hingga kelengkapan sensus data keluarga.
                </p>
              </div>

              <div className="divide-y divide-zinc-800 border-y border-zinc-800 reveal-on-scroll reveal-delay-100">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index
                  return (
                    <div key={index} className="py-6 transition-colors">
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        className="flex w-full items-center justify-between gap-4 text-left font-semibold text-zinc-100 hover:text-white"
                      >
                        <span className="text-base sm:text-lg">
                          {faq.question}
                        </span>
                        <span
                          className={`flex size-8 shrink-0 items-center justify-center border border-zinc-700 text-xs transition-transform duration-200 ${isOpen
                            ? "rotate-180 bg-white text-zinc-950"
                            : "text-zinc-400"
                            }`}
                        >
                          ▼
                        </span>
                      </button>
                      {isOpen && (
                        <div className="mt-4 pr-10 text-sm leading-relaxed text-zinc-400 sm:text-base">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* 8. Kotak Saran & Hubungi Kami */}
          <section className="border-b border-zinc-400 bg-white" id="kontak">
            <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
              <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                <div className="reveal-on-scroll">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Aspirasi &amp; Masukan
                  </p>
                  <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                    Kotak Saran PPGT Batakan
                  </h2>
                  <div className="mt-4 h-1 w-20 bg-zinc-950" />
                  <p className="mt-5 leading-7 text-zinc-600">
                    Punya ide kegiatan, kritik yang membangun, atau pertanyaan
                    seputar persekutuan pemuda? Sampaikan langsung kepada pengurus
                    melalui formulir ini.
                  </p>
                  <div className="mt-8 space-y-3 text-sm text-zinc-600">
                    <p>
                      📍{" "}
                      <span className="font-semibold text-zinc-900">Alamat:</span>{" "}
                      Gereja Toraja Jemaat Batakan, Walenrang Timur
                    </p>
                    <p>
                      ✉️{" "}
                      <span className="font-semibold text-zinc-900">Email:</span>{" "}
                      ppgt.batakan@gmail.com
                    </p>
                  </div>
                </div>

                <form
                  className="rounded-2xl border border-zinc-300 bg-[#f5f5f2] p-6 sm:p-8 reveal-on-scroll reveal-delay-200"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        placeholder="Masukkan nama Anda"
                        className="mt-2 w-full border border-zinc-400 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700">
                        Nomor WhatsApp / Email
                      </label>
                      <input
                        type="text"
                        placeholder="0812xxxx atau email@domain.com"
                        className="mt-2 w-full border border-zinc-400 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700">
                        Pesan atau Saran
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Tuliskan saran atau pesan Anda di sini..."
                        className="mt-2 w-full border border-zinc-400 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-950"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full border border-[#4BB8FA] bg-[#4BB8FA] py-3 text-center text-sm font-semibold text-white transition hover:bg-transparent hover:text-zinc-950"
                    >
                      Kirim Pesan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </main>
        <footer className="bg-[#3A86FF] text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <div className="flex items-center gap-2">
              <ApplicationLogo className='w-10' />
              <span className="font-bold text-white">PPGT Jemaat Batakan</span>
            </div>
            <div className="flex flex-wrap gap-6 text-xs sm:text-sm">
              <a href="#home" className='hover:text-white'>
                Home
              </a>
              <a className="hover:text-white" href="#renungan">
                Renungan
              </a>
              <a className="hover:text-white" href="#kegiatan">
                Jadwal
              </a>
              <a className="hover:text-white" href="#dokumentasi">
                Dokumentasi
              </a>
              <a className="hover:text-white" href="#faq">
                FAQ
              </a>
              <a className="hover:text-white" href="#kontak">
                Kontak
              </a>
            </div>
            <span className="text-xs">
              © 2026 PPGT Jemaat Batakan · Kader Siap Utus
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}