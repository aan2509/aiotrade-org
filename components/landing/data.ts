import {
  BarChart3,
  Clock3,
  Star,
  ChartPie,
  ShieldCheck,
  ChartLine,
} from "lucide-react";
import heroImage from "@/bahan foto/hero.jpg";
import logoDarkImage from "@/bahan foto/Logo-AIOTrade-dark.png";
import logoLightImage from "@/bahan foto/Logo-AIOTrade-light.png";
import phoneImage from "@/bahan foto/phone.png";
import chartImage from "@/bahan foto/chart.webp";
import binanceLogo from "@/bahan foto/binance.webp";
import bitgetLogo from "@/bahan foto/bitget.webp";
import tokocryptoLogo from "@/bahan foto/tokocrypto.png";
import type {
  Article,
  FaqEntry,
  Feature,
  NavItem,
  PartnerLogo,
  Plan,
  StatItem,
  Step,
} from "@/components/landing/types";

export const landingImages = {
  heroImage,
  logoDarkImage,
  logoLightImage,
  phoneImage,
  chartImage,
} as const;

export const navItems: NavItem[] = [
  { label: "Feature", href: "#fitur", accent: "#10a7ff" },
  { label: "Harga", href: "#harga", accent: "#ffc84a" },
  { label: "FAQ", href: "#faq", accent: "#38bdf8" },
  { label: "Guide", href: "#panduan", accent: "#2563eb" },
  { label: "Blog", href: "#blog", accent: "#f6be4f" },
];

export const stats: StatItem[] = [
  { label: "Pengguna aktif", value: "1.200+" },
  { label: "Exchange terhubung", value: "Binance, Bitget, Tokocrypto" },
  { label: "Model akses", value: "Lifetime access" },
];

export const features: Feature[] = [
  {
    title: "24/7 Trading",
    description: "Aio Trade bekerja sepanjang waktu tanpa perlu Anda memantaunya. .",
    icon: Clock3,
  },
  {
    title: "Cepat dan efisien",
    description: "Aio Trade dapat menganalisa kondisi pasar secara otomatis dengan cepat dan efisien.",
    icon: BarChart3,
  },
  {
    title: "Strategi",
    description: "Aio Trade dirancang menggunakan Teknologi AI sehingga menghasilkan profit yang maksimal",
    icon: ShieldCheck,
  },
  {
    title: "Timeframe & Price Range ",
    description: "Anda dapat menentukan pergerakan harga di timeframe tertentu dan membatasi perdagangan pada harga tertentu. ",
    icon: Star,
  },
  {
    title: "Manajemen Resiko",
    description: "Aio Trade secara otomatis dapat mengelola modal trading Anda sehingga meminimalisir risiko dalam perdagangan crypto .",
    icon: ChartPie,
  },
  {
    title: "Teknik Averaging & Grid ",
    description: "Aio Trade menggunakan teknik Averaging dan Grid (Mak. 100 Layer) yang dioptimalkan menggunakan teknologi AI.",
    icon: ChartLine,
  },
];

export const plans: Plan[] = [
  {
    name: "Akses Bot Crypto",
    price: "$130",
    description:
      "Akses penuh ke bot otomatis AioTrade untuk perdagangan crypto spot, lengkap dengan fitur grid, averaging, trailing stop, dan pengaturan custom.",
  },
  {
    name: "Combo",
    price: "$190",
    description:
      "Dapatkan semua fitur dari Bot Crypto dan tambahan akses eksklusif ke bot saham otomatis. Termasuk prioritas support dan update seumur hidup.",
    highlight: "Best price",
    emphasis: true,
  },
  {
    name: "Akses Bot Saham",
    price: "$130",
    description:
      "Akses bot otomatis AioTrade untuk perdagangan saham, dengan fitur analisis dan strategi berbasis AI. (Masih dalam pengembangan).",
  },
];

export const faqEntries: FaqEntry[] = [
  {
    question: "Apa itu AIOTrade?",
    answer:
      "AioTrade adalah bot trading berbasis Artificial Intelligence (AI) yang dirancang untuk membantu pengguna melakukan perdagangan aset digital secara otomatis dan efisien. Saat ini AioTrade mendukung perdagangan kripto di pasar spot melalui integrasi API yang aman dengan exchange global seperti Binance dan Bitget, dan ke depannya akan diperluas untuk mendukung pasar saham (stock trading).",
  },
  {
    question: "Apakah AIOTrade scam?",
    answer:
      "Tidak. Aio Trade tidak memiliki akses untuk menarik (withdraw) modal trading Anda karena 100% modal trading Anda simpan di dompet exchange pribadi. Aio Trade hanya diijinkan untuk perdagangan di pasar spot, sehingga tidak ada risiko margin call atau liquid.",
  },
  {
    question: "AIOTrade bisa digunakan di exchange apa saja?",
    answer:
      "Saat ini Aio Trade terintegrasi dengan exchange terbesar yaitu Binance dan Bitget. ",
  },
  {
    question: "Apakah ada biaya registrasi atau biaya berlangganan?",
    answer:
      "Daftar sekarang gratis tanpa biaya registrasi! Cukup isi trading fee minimal $10 untuk mulai menggunakan AioTrade. Ingin akses permanen? Deposit trading fee minimal $50 dan gunakan selamanya.",
  },
  {
    question: "Bisakah trading berjalan otomatis tanpa saya pantau terus?",
    answer:
      "Tentu bisa. Anda dapat menggunakan Aio Trade untuk trading secara otomatis dengan menggunakan fitur “follow master”. Disamping itu Anda juga bisa menerapkan teknik trading Anda dengan melakukan pengaturan custom.",
  },
  {
    question: "Teknik apa yang dipakai AIOTrade?",
    answer:
      "Aio Trade menggunakan beberapa teknik trading yaitu Averaging (DCA), Grid dan Price Range yang dikombinasikan untuk mendapatkan hasil yang maksimal. Sistem Aio Trade juga dilengkapi dengan fitur timeframe dan trailing stop untuk memaksimalkan profit trading Anda.",
  },
  {
    question: "Apakah ada komunitas atau panduan untuk pengguna baru?",
    answer:
      "Tentu. Anda dapat diskusi dan komunikasi dengan komunitas Aio Trade di group whatsapp dan telegram, serta dukungan dari tim support.",
  },
];

export const steps: Step[] = [
  {
    number: "01",
    title: "Daftar & Buat Akun",
    description:
      "Buat akun Aio Trade dan verifikasi melalui email. Jika belum memiliki akun di Binance atau Bitget, buat akun exchanger terlebih dahulu.",
  },
  {
    number: "02",
    title: "Hubungkan API & Atur Bot",
    description:
      "Sambungkan API Spot dari akun exchanger ke Aio Trade, lalu atur bot sesuai modal trading dan strategi yang diinginkan.",
  },
  {
    number: "03",
    title: "Mulai Trading",
    description:
      "Pilih mode Custom atau Follow, teknik Grid atau Average untuk strategi trading Anda dan nikmati profit trading dengan pemantauan realtime.",
  },
];

export const articles: Article[] = [
  {
    title: "Trading Crypto di Bitget Kini Bisa Otomatis dengan AIOTrade",
    description: "Trading spot otomatis dengan setup yang lebih rapi dan mudah dipantau.",
    image: bitgetLogo,
    label: "Crypto news",
  },
  {
    title: "Binance: Aman untuk Trading Kripto?",
    description: "Likuiditas besar, sistem familiar, dan integrasi yang terasa cepat.",
    image: binanceLogo,
    label: "Crypto news",
  },
  {
    title: "Mengenal Market Kripto yang Bergerak Lebih Cepat",
    description: "Cara membaca peluang market dengan pendekatan yang lebih tenang.",
    image: tokocryptoLogo,
    label: "Crypto news",
  },
];

export const partnerLogos: PartnerLogo[] = [
  { src: tokocryptoLogo, alt: "Tokocrypto" },
  { src: binanceLogo, alt: "Binance" },
  { src: bitgetLogo, alt: "Bitget" },
];
