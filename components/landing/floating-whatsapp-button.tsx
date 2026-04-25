"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MessageCircleMore } from "lucide-react";

type FloatingWhatsAppButtonProps = {
  href: string;
};

export function FloatingWhatsAppButton({ href }: FloatingWhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-[70] sm:bottom-24 sm:right-6">
      <div
        className={`pointer-events-auto absolute bottom-full right-0 mb-3 w-[min(calc(100vw-2rem),336px)] origin-bottom-right transition duration-300 ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-[26px] border border-white/65 bg-white/96 shadow-[0_24px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 bg-[linear-gradient(135deg,rgba(37,211,102,0.12)_0%,rgba(255,255,255,0.94)_68%)] px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] shadow-[inset_0_1px_0_rgba(255,255,255,0.34)]">
                <Image
                  alt="WhatsApp"
                  className="h-5 w-5 object-contain"
                  height={20}
                  src="/whatsapp-icon.png"
                  width={20}
                />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-tight text-slate-950">Live chat WhatsApp</p>
                <p className="text-xs font-medium text-emerald-600">Online dan siap terhubung</p>
              </div>
            </div>
            <button
              aria-label="Minimize chat"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 px-4 py-4">
            <div className="rounded-2xl bg-[linear-gradient(180deg,rgba(241,245,249,0.94)_0%,rgba(255,255,255,0.98)_100%)] px-4 py-3 text-sm leading-7 text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
              Halo, ada yang ingin ditanyakan soal paket atau pendaftaran? Klik tombol di bawah untuk terhubung
              langsung ke WhatsApp.
            </div>

            <Link
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(37,211,102,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(37,211,102,0.32)]"
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircleMore className="h-4 w-4" />
              Buka chat WhatsApp
            </Link>
          </div>
        </div>
      </div>

      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Minimize WhatsApp chat" : "Open WhatsApp chat"}
        className="pointer-events-auto group relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] shadow-[0_18px_40px_rgba(37,211,102,0.32),0_10px_24px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.34)] transition duration-300 hover:-translate-y-1 hover:scale-[1.04] hover:shadow-[0_24px_48px_rgba(37,211,102,0.36),0_14px_30px_rgba(15,23,42,0.22),inset_0_1px_0_rgba(255,255,255,0.38)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/20 sm:h-[72px] sm:w-[72px]"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="pointer-events-none absolute inset-[2px] rounded-full border border-white/26" />
        <span className="pointer-events-none absolute -inset-1 rounded-full bg-[#25D366]/18 blur-xl transition group-hover:bg-[#25D366]/24" />
        <Image
          alt="WhatsApp"
          className="relative h-8 w-8 object-contain sm:h-9 sm:w-9"
          height={36}
          priority
          src="/whatsapp-icon.png"
          width={36}
        />
      </button>
    </div>
  );
}
