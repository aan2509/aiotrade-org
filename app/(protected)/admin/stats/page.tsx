import type { ComponentType } from "react";
import {
  ArrowUpRight,
  BanknoteArrowUp,
  ChartColumn,
  Eye,
  FileLock2,
  FileText,
  Sparkles,
  TrendingUp,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { formatIdrCurrency } from "@/lib/payment-gateway-config";
import { getAdminStats, type AdminTrendPoint } from "@/lib/admin-stats";

type StatCardProps = {
  accentClassName: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
};

type TrendMetricKey = "guideRevenue" | "signupRevenue" | "totalRevenue" | "visits";

type TrendCardProps = {
  accentFrom: string;
  accentTo: string;
  description: string;
  formatter: (value: number) => string;
  icon: ComponentType<{ className?: string }>;
  metric: TrendMetricKey;
  points: AdminTrendPoint[];
  title: string;
};

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function buildPolyline(values: number[], width: number, height: number, padding: number) {
  if (!values.length) {
    return "";
  }

  const max = Math.max(...values, 1);
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  return values
    .map((value, index) => {
      const x = padding + (index * chartWidth) / Math.max(values.length - 1, 1);
      const y = padding + chartHeight - (value / max) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");
}

function buildAreaPath(values: number[], width: number, height: number, padding: number) {
  const polyline = buildPolyline(values, width, height, padding);

  if (!polyline) {
    return "";
  }

  const points = polyline.split(" ");
  const first = points[0]?.split(",") ?? [String(padding), String(height - padding)];
  const last = points[points.length - 1]?.split(",") ?? [String(width - padding), String(height - padding)];

  return [
    `M ${first[0]} ${height - padding}`,
    `L ${points.join(" L ")}`,
    `L ${last[0]} ${height - padding}`,
    "Z",
  ].join(" ");
}

function TrendCard({
  accentFrom,
  accentTo,
  description,
  formatter,
  icon: Icon,
  metric,
  points,
  title,
}: TrendCardProps) {
  const chartId = `${metric}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const values = points.map((point) => point[metric]);
  const latest = values[values.length - 1] ?? 0;
  const peak = Math.max(...values, 0);
  const avg = average(values);
  const width = 640;
  const height = 220;
  const padding = 18;
  const polyline = buildPolyline(values, width, height, padding);
  const areaPath = buildAreaPath(values, width, height, padding);

  return (
    <article className="admin-glass-panel relative overflow-hidden rounded-[30px] border-transparent px-6 py-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background: `radial-gradient(circle at top right, ${accentTo}30, transparent 28%), linear-gradient(135deg, ${accentFrom}10 0%, transparent 40%, ${accentTo}12 100%)`,
        }}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="admin-page-badge inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em]">
              <Icon className="h-3.5 w-3.5" />
              {title}
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--admin-text-secondary)]">
              {description}
            </p>
          </div>
          <div
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${accentFrom}18 0%, ${accentTo}24 100%)`,
              color: accentTo,
            }}
          >
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="admin-row-surface rounded-[22px] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
              Terakhir
            </p>
            <p className="mt-3 text-lg font-semibold text-[var(--admin-text-primary)]">
              {formatter(latest)}
            </p>
          </div>
          <div className="admin-row-surface rounded-[22px] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
              Rata-rata
            </p>
            <p className="mt-3 text-lg font-semibold text-[var(--admin-text-primary)]">
              {formatter(avg)}
            </p>
          </div>
          <div className="admin-row-surface rounded-[22px] px-4 py-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
              Puncak
            </p>
            <p className="mt-3 text-lg font-semibold text-[var(--admin-text-primary)]">
              {formatter(peak)}
            </p>
          </div>
        </div>

        <div className="admin-row-surface mt-5 rounded-[26px] px-4 py-4 sm:px-5 sm:py-5">
          <svg
            aria-label={title}
            className="h-[220px] w-full"
            viewBox={`0 0 ${width} ${height}`}
          >
            <defs>
              <linearGradient id={`${chartId}-area`} x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor={accentTo} stopOpacity="0.34" />
                <stop offset="100%" stopColor={accentFrom} stopOpacity="0.03" />
              </linearGradient>
              <linearGradient id={`${chartId}-line`} x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor={accentFrom} />
                <stop offset="100%" stopColor={accentTo} />
              </linearGradient>
            </defs>

            {Array.from({ length: 5 }).map((_, index) => {
              const y = padding + ((height - padding * 2) / 4) * index;

              return (
                <line
                  key={y}
                  stroke="rgba(148,163,184,0.14)"
                  strokeDasharray="4 8"
                  strokeWidth="1"
                  x1={padding}
                  x2={width - padding}
                  y1={y}
                  y2={y}
                />
              );
            })}

            {areaPath ? <path d={areaPath} fill={`url(#${chartId}-area)`} /> : null}
            {polyline ? (
              <polyline
                fill="none"
                points={polyline}
                stroke={`url(#${chartId}-line)`}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
              />
            ) : null}

            {values.map((value, index) => {
              const max = Math.max(...values, 1);
              const chartWidth = width - padding * 2;
              const chartHeight = height - padding * 2;
              const x = padding + (index * chartWidth) / Math.max(values.length - 1, 1);
              const y = padding + chartHeight - (value / max) * chartHeight;

              return (
                <g key={`${chartId}-${points[index]?.key ?? index}`}>
                  <circle cx={x} cy={y} fill={accentTo} r="5" />
                  <circle cx={x} cy={y} fill="white" fillOpacity="0.9" r="2.2" />
                </g>
              );
            })}
          </svg>

          <div
            className="mt-4 grid gap-2 text-center text-[0.7rem] font-medium text-[var(--admin-text-muted)] sm:text-xs"
            style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}
          >
            {points.map((point) => (
              <div key={point.key}>{point.label}</div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function StatCard({
  accentClassName,
  description,
  icon: Icon,
  label,
  value,
}: StatCardProps) {
  return (
    <article className="admin-glass-panel relative overflow-hidden rounded-[30px] border-transparent px-6 py-6">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_46%,rgba(255,255,255,0.06)_100%)]" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--admin-text-muted)]">
            {label}
          </p>
          <p className="mt-4 text-[1.9rem] font-semibold tracking-tight text-[var(--admin-text-primary)]">
            {value}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--admin-text-secondary)]">
            {description}
          </p>
        </div>
        <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${accentClassName}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </article>
  );
}

export default async function AdminStatsPage() {
  const stats = await getAdminStats();
  const premiumRatio =
    stats.paidGuideContentCount + stats.freeGuideContentCount > 0
      ? Math.round(
          (stats.paidGuideContentCount /
            (stats.paidGuideContentCount + stats.freeGuideContentCount)) *
            100,
        )
      : 0;

  const cards: StatCardProps[] = [
    {
      accentClassName: "bg-sky-500/12 text-sky-700",
      description: "Total akun yang sudah terdaftar di website.",
      icon: Users,
      label: "Jumlah User",
      value: stats.totalUsers.toLocaleString("id-ID"),
    },
    {
      accentClassName: "bg-emerald-500/12 text-emerald-700",
      description: "Akumulasi pembayaran signup yang sudah berstatus paid.",
      icon: BanknoteArrowUp,
      label: "Penghasilan Sign Up",
      value: formatIdrCurrency(stats.signupRevenue),
    },
    {
      accentClassName: "bg-violet-500/12 text-violet-700",
      description: "Akumulasi pembayaran unlock konten berbayar yang sudah lunas.",
      icon: FileLock2,
      label: "Penghasilan Konten Berbayar",
      value: formatIdrCurrency(stats.paidGuideRevenue),
    },
    {
      accentClassName: "bg-amber-500/12 text-amber-700",
      description: "Jumlah materi member berbayar yang saat ini dipublish.",
      icon: FileLock2,
      label: "Konten Berbayar",
      value: stats.paidGuideContentCount.toLocaleString("id-ID"),
    },
    {
      accentClassName: "bg-cyan-500/12 text-cyan-700",
      description: "Jumlah materi member gratis yang saat ini dipublish.",
      icon: FileText,
      label: "Konten Gratis",
      value: stats.freeGuideContentCount.toLocaleString("id-ID"),
    },
    {
      accentClassName: "bg-rose-500/12 text-rose-700",
      description: "Total visit yang tercatat dari area publik website.",
      icon: Eye,
      label: "Kunjungan Website",
      value: stats.websiteVisits.toLocaleString("id-ID"),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="admin-glass-panel relative overflow-hidden rounded-[34px] border-transparent px-7 py-7 sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.2),transparent_24%),linear-gradient(135deg,rgba(37,99,235,0.08)_0%,rgba(255,255,255,0)_44%,rgba(245,158,11,0.08)_100%)]" />
        <div className="relative">
          <div className="admin-page-badge inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.24em]">
            <ChartColumn className="h-3.5 w-3.5" />
            Statistik
          </div>
          <div className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-[2rem] font-semibold tracking-tight text-[var(--admin-text-primary)] sm:text-[2.5rem]">
                Dashboard statistik
              </h1>
              <p className="mt-3 text-sm leading-7 text-[var(--admin-text-secondary)] sm:text-base">
                Pantau performa website secara lengkap.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[540px]">
              <div className="admin-row-surface rounded-[22px] px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
                  Total income
                </p>
                <p className="mt-3 text-lg font-semibold text-[var(--admin-text-primary)]">
                  {formatIdrCurrency(stats.signupRevenue + stats.paidGuideRevenue)}
                </p>
              </div>
              <div className="admin-row-surface rounded-[22px] px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
                  Visitor unik
                </p>
                <p className="mt-3 text-lg font-semibold text-[var(--admin-text-primary)]">
                  {stats.uniqueVisitors.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="admin-row-surface rounded-[22px] px-4 py-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--admin-text-muted)]">
                  Rasio premium
                </p>
                <p className="mt-3 text-lg font-semibold text-[var(--admin-text-primary)]">
                  {premiumRatio}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <TrendCard
          accentFrom="#22d3ee"
          accentTo="#0ea5e9"
          description="Gelombang kunjungan website dalam 7 hari terakhir dari area publik yang tercatat oleh tracker."
          formatter={(value) => value.toLocaleString("id-ID")}
          icon={Eye}
          metric="visits"
          points={stats.dailyTrend}
          title="Kunjungan Harian"
        />
        <TrendCard
          accentFrom="#f59e0b"
          accentTo="#2563eb"
          description="Pendapatan gabungan signup dan konten premium per hari selama 7 hari terakhir."
          formatter={formatIdrCurrency}
          icon={BanknoteArrowUp}
          metric="totalRevenue"
          points={stats.dailyTrend}
          title="Revenue Harian"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <TrendCard
          accentFrom="#8b5cf6"
          accentTo="#0ea5e9"
          description="Ringkasan ritme kunjungan website dalam 8 minggu terakhir agar tren jangka menengah lebih terlihat."
          formatter={(value) => value.toLocaleString("id-ID")}
          icon={Sparkles}
          metric="visits"
          points={stats.weeklyTrend}
          title="Kunjungan Mingguan"
        />
        <TrendCard
          accentFrom="#10b981"
          accentTo="#f59e0b"
          description="Akumulasi revenue per minggu untuk membaca momentum penjualan dan performa monetisasi website."
          formatter={formatIdrCurrency}
          icon={ArrowUpRight}
          metric="totalRevenue"
          points={stats.weeklyTrend}
          title="Revenue Mingguan"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="admin-glass-panel rounded-[30px] border-transparent px-6 py-6 xl:col-span-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[var(--admin-text-muted)]">
            Detail monetisasi
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="admin-row-surface rounded-[24px] px-5 py-5">
              <p className="text-sm font-semibold text-[var(--admin-text-primary)]">Signup contribution</p>
              <p className="mt-3 text-[1.9rem] font-semibold tracking-tight text-[var(--admin-text-primary)]">
                {formatIdrCurrency(stats.signupRevenue)}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--admin-text-secondary)]">
                Pemasukan dari flow pendaftaran member yang sudah berhasil paid.
              </p>
            </div>
            <div className="admin-row-surface rounded-[24px] px-5 py-5">
              <p className="text-sm font-semibold text-[var(--admin-text-primary)]">Premium content contribution</p>
              <p className="mt-3 text-[1.9rem] font-semibold tracking-tight text-[var(--admin-text-primary)]">
                {formatIdrCurrency(stats.paidGuideRevenue)}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--admin-text-secondary)]">
                Pemasukan dari pembukaan materi premium oleh member.
              </p>
            </div>
          </div>
        </article>

        <article className="admin-glass-panel rounded-[30px] border-transparent px-6 py-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/12 text-indigo-700">
            <UserRoundPlus className="h-5 w-5" />
          </div>
          <p className="mt-5 text-sm font-semibold text-[var(--admin-text-primary)]">Jangkauan website</p>
          <p className="mt-3 text-[1.9rem] font-semibold tracking-tight text-[var(--admin-text-primary)]">
            {stats.uniqueVisitors.toLocaleString("id-ID")}
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--admin-text-secondary)]">
            Dihitung dari visitor ID yang tersimpan di cookie. Angka ini membantu membedakan total kunjungan
            dengan jumlah orang yang benar-benar datang ke website.
          </p>
        </article>
      </section>
    </div>
  );
}
