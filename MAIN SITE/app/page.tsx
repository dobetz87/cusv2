"use client";

import Link from "next/link";
import { ShoppingBag, Bike } from "lucide-react";

export default function GatewayPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-between px-6 pt-16 pb-10 relative overflow-hidden"
      style={{ background: "var(--gateway-gradient)" }}
    >
      {/* Background decorative circles */}
      <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute top-[40%] left-[-60px] w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center animate-screen-in z-10">
        {/* Logo */}
        <div className="mb-6">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="72" height="72" rx="20" fill="white" fillOpacity="0.15"/>
            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
                  fontSize="38" fontWeight="900" fill="white"
                  fontFamily="Plus Jakarta Sans, sans-serif">
              C
            </text>
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-7xl font-black text-white tracking-tighter leading-none
                       font-[family-name:var(--font-plus-jakarta)]"
            style={{ textShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
          cus
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-2xl font-semibold text-white/90
                      font-[family-name:var(--font-plus-jakarta)] animate-pulse-scale">
          Cus, otw! ⚡
        </p>

        <p className="mt-4 text-white/70 text-base max-w-xs leading-relaxed">
          Pesan dari warung lokal Pujon & Malang, diantar cepat ke pintumu
        </p>
      </div>

      {/* CTA Cards */}
      <div className="w-full max-w-sm space-y-3 z-10 animate-slide-up">

        {/* Primary CTA */}
        <Link
          id="btn-mau-pesan"
          href="/auth?role=user"
          className="flex items-center justify-between w-full px-6 py-5 rounded-[18px] bg-white
                     shadow-[0_8px_32px_rgba(0,0,0,0.2)] active:scale-[0.97] transition-all group"
        >
          <div>
            <p className="font-bold text-lg text-[var(--text-primary)]
                          font-[family-name:var(--font-plus-jakarta)]">
              Mau Pesan 🛍️
            </p>
            <p className="text-sm text-[var(--text-secondary)]">Masuk sebagai pemesan</p>
          </div>
          <div className="w-12 h-12 rounded-[14px] flex items-center justify-center
                          bg-[var(--primary)] group-hover:bg-[var(--primary-hover)] transition-colors">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
        </Link>

        {/* Secondary CTA */}
        <Link
          id="btn-daftar-driver"
          href="/auth?role=driver"
          className="flex items-center justify-between w-full px-6 py-5 rounded-[18px]
                     bg-white/15 border border-white/30 backdrop-blur-sm
                     active:scale-[0.97] transition-all group"
        >
          <div>
            <p className="font-bold text-lg text-white
                          font-[family-name:var(--font-plus-jakarta)]">
              Daftar Jadi Driver 🏍️
            </p>
            <p className="text-sm text-white/70">Cari penghasilan tambahan</p>
          </div>
          <div className="w-12 h-12 rounded-[14px] flex items-center justify-center bg-white/20">
            <Bike className="w-6 h-6 text-white" />
          </div>
        </Link>

        {/* Admin subtle link */}
        <div className="text-center pt-2">
          <Link
            id="btn-admin-login"
            href="/admin"
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Admin →
          </Link>
        </div>
      </div>
    </main>
  );
}
