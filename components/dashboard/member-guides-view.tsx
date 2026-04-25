"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, FileText, PlayCircle } from "lucide-react";
import type { MemberGuidePost } from "@/lib/member-guide-types";

type MemberGuidesViewProps = {
  guides: MemberGuidePost[];
};

const glassPanelClass =
  "rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(246,249,252,0.72)_100%)] shadow-[0_24px_80px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-2xl";

export function MemberGuidesView({ guides }: MemberGuidesViewProps) {
  const videoGuides = useMemo(() => guides.filter((guide) => guide.type === "video"), [guides]);
  const pdfGuides = useMemo(() => guides.filter((guide) => guide.type === "pdf"), [guides]);
  const [selectedVideoId, setSelectedVideoId] = useState(videoGuides[0]?.id ?? null);
  const selectedVideo = videoGuides.find((guide) => guide.id === selectedVideoId) ?? videoGuides[0] ?? null;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-5 lg:px-6 lg:py-8">
      <section className={`relative overflow-hidden px-6 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8 ${glassPanelClass}`}>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.12)_0%,rgba(255,255,255,0)_44%,rgba(16,185,129,0.1)_100%)]" />
        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-sky-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)]">
            <PlayCircle className="h-3.5 w-3.5" />
            Panduan Member
          </div>
          <div>
            <h1 className="text-[2.1rem] font-semibold tracking-tight text-stone-950 sm:text-[2.5rem]">
              Video & PDF Panduan
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-stone-600">
              Semua materi di halaman ini hanya tersedia untuk member aktif. Pilih video yang ingin dipelajari atau buka PDF untuk panduan yang lebih detail.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="px-1">
          <h2 className="text-[1.7rem] font-semibold tracking-tight text-white">Video Panduan</h2>
          <p className="mt-1 text-sm leading-7 text-white/68">
            Pilih video di panel samping untuk melihat preview utama.
          </p>
        </div>

        {selectedVideo ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_360px]">
            <div className={`overflow-hidden ${glassPanelClass}`}>
              <div className="aspect-video overflow-hidden bg-[#060b14]">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                  src={selectedVideo.embedUrl ?? undefined}
                  title={selectedVideo.title}
                />
              </div>
              <div className="px-6 py-6 sm:px-7">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-stone-500">Sedang diputar</p>
                <h3 className="mt-3 text-[1.6rem] font-semibold tracking-tight text-stone-950">{selectedVideo.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{selectedVideo.description}</p>
              </div>
            </div>

            <div className={`px-5 py-5 ${glassPanelClass}`}>
              <div className="px-1">
                <h3 className="text-[1.35rem] font-semibold tracking-tight text-stone-950">Daftar Video</h3>
                <p className="mt-1 text-sm leading-7 text-stone-600">Pilih materi yang ingin dipelajari lebih dulu.</p>
              </div>

              <div className="mt-5 space-y-3">
                {videoGuides.map((guide) => {
                  const active = guide.id === selectedVideo.id;

                  return (
                    <button
                      className={`w-full rounded-[24px] px-4 py-4 text-left transition duration-300 ${
                        active
                          ? "bg-[linear-gradient(135deg,rgba(17,24,39,0.96)_0%,rgba(15,23,42,0.9)_100%)] text-white shadow-[0_20px_40px_rgba(15,23,42,0.26)]"
                          : "bg-white/46 text-stone-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.76)] hover:bg-white/58 hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)]"
                      }`}
                      key={guide.id}
                      onClick={() => setSelectedVideoId(guide.id)}
                      type="button"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                            active ? "bg-white/10" : "bg-stone-950/[0.045]"
                          }`}
                        >
                          <PlayCircle className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{guide.title}</p>
                          <p className={`mt-2 text-xs leading-6 ${active ? "opacity-75" : "text-stone-500"}`}>
                            {guide.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className={`px-6 py-8 text-sm text-stone-600 ${glassPanelClass}`}>
            Belum ada video panduan yang dipublish.
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="px-1">
          <h2 className="text-[1.7rem] font-semibold tracking-tight text-white">PDF Panduan</h2>
          <p className="mt-1 text-sm leading-7 text-white/68">
            Buka dokumen untuk membaca materi yang lebih lengkap dan lebih tenang dibaca.
          </p>
        </div>

        {pdfGuides.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {pdfGuides.map((guide) => (
              <div className={`flex h-full flex-col gap-5 px-6 py-6 ${glassPanelClass}`} key={guide.id}>
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/12 text-rose-800">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[1.35rem] font-semibold tracking-tight text-stone-950">{guide.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-stone-600">{guide.description}</p>
                  </div>
                </div>

                <div className="mt-auto">
                  <Link
                    className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white/52 px-5 text-sm font-medium text-stone-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.78)] transition hover:bg-white/64 hover:shadow-[0_16px_28px_rgba(15,23,42,0.08)]"
                    href={guide.fileUrl ?? "#"}
                    target="_blank"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Buka PDF
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`px-6 py-8 text-sm text-stone-600 ${glassPanelClass}`}>
            Belum ada PDF panduan yang dipublish.
          </div>
        )}
      </section>
    </div>
  );
}
