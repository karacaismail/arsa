// ============================================
// ARSAM.NET Timeline V4 — Data Layer
// Kaynak: Excel v9-15 + SOM analiz raporlari
// Senaryo: Kotumser (Muhafazakar)
// Odak: Arsa ve Arazi Dijital Ilan Platformu
// ============================================

// --- Pazar Buyuklugu (sonsomc.md, sonsomg.md) ---
export const TAM = 6_000_000_000; // ₺6.000.000.000 dijital arsa/arazi ilan pazari
export const SAM_BASE = 2_430_000_000; // ₺2.430.000.000 (2026 SAM = TAM x 0.405)

export const SAM_BY_YEAR: Record<number, number> = {
  2026: 2_430_000_000,
  2027: 2_700_000_000,
  2028: 3_050_000_000,
  2029: 3_450_000_000,
  2030: 3_900_000_000,
  2031: 4_400_000_000,
  2032: 4_800_000_000,
};

// 2026-2027: MD baz, 2028+: tutarlı büyüme (gelir/SAM oranı)
export const SOM_TARGETS: Record<number, number> = {
  2026: 0.001, // %0.1 (lansman)
  2027: 0.005, // %0.5 (PMF)
  2028: 0.197, // %19.7 (ölçekleme — aylık ~45→55M devam)
  2029: 0.226, // %22.6 (olgunlaşma)
  2030: 0.241, // %24.1 (hâkimiyet)
  2031: 0.246, // %24.6 (konsolidasyon)
  2032: 0.250, // %25.0 (plato)
};

// Kadro: Excel mevcut (146) + ek 104 kişi (May 2027'den eşit dağılım) = 250 hedef
export const HEADCOUNT: Record<number, { count: number; roles: string; phase: string; color: string }> = {
  2026: { count: 19, roles: "CPO, Asistan, Grafik, PO, GIS, İSG, SM, Backend, Videographer, Helpdesk, Frontend, SEO, Content, Data Analyst, PPC, Creative, Moderator, QA", phase: "LANSMAN", color: "#3B82F6" },
  2027: { count: 76, roles: "+Sr DevOps, Head of Eng, UX/UI, Growth Lead, Muhasebe, PM, Fraud, B2B, Mobile, QA Lead, Data/AI Lead, ML Eng, Test Auto, Scrum Master +ek kadro", phase: "BÜYÜME", color: "#10B981" },
  2028: { count: 114, roles: "+Sr Backend, Sr Frontend, Data Scientist, Security Eng, Content/SEO Lead, Hukuk Danışmanı, İK Müdürü, Ofis Yöneticisi +ölçekleme kadrosu", phase: "ÖLÇEKLEME", color: "#8B5CF6" },
  2029: { count: 150, roles: "+Finans Müdürü, KVKK, Agile Coach, RTE, Enterprise Sales, Sr. Data Eng, Trust & Safety +büyüme kadrosu", phase: "OLGUNLAŞMA", color: "#F59E0B" },
  2030: { count: 185, roles: "+System Architect, Platform Eng, Performance Mktg, Seller Support, PR Uzmanı +operasyon kadrosu", phase: "HÂKİMİYET", color: "#10B981" },
  2031: { count: 220, roles: "+AI/ML Engineer (2), Solution Architect, Sr. Product Designer, UX Researcher +konsolidasyon kadrosu", phase: "KONSOLİDASYON", color: "#3B82F6" },
  2032: { count: 250, roles: "+Staff Engineers, API Marketplace, Full SAFe (ART-1 + ART-2) — tam kadro hedefi", phase: "VİZYON", color: "#22D3EE" },
};

export const CAPEX: Record<number, { amount: number; desc: string }> = {
  2026: { amount: 2_863_100, desc: "Ofis Kurulum ₺1.100.000, Mutfak ₺173.000, Bilgisayar ~₺700.000, Marka ₺180.000, Hosgeldin ₺107.100, Yazilim ₺38.000" },
  2027: { amount: 800_000, desc: "Donanim yenileme, ofis genisleme, yeni lisanslar" },
  2028: { amount: 1_500_000, desc: "2. ofis acilisi, sunucu altyapi buyutme, guvenlik yatirimi" },
  2029: { amount: 1_000_000, desc: "Donanim + lisans yenileme, veri merkezi" },
  2030: { amount: 750_000, desc: "Rutin donanim, bulut altyapi optimizasyonu" },
  2031: { amount: 600_000, desc: "AI/ML altyapi, GPU sunucular" },
  2032: { amount: 500_000, desc: "Rutin yenileme, ofis bakimi" },
};

export interface MonthData {
  period: string;
  revenue: number;
  expenses: number;
  net: number;
  event?: string;
  isMilestone?: boolean;
}

// ============================================
// 18-ay toplam gelir  = 298.000.000 TL
// 18-ay toplam gider  =  81.428.346 TL (Excel tam: OPEX+Maaş+Pazarlama+Sosyal+CAPEX)
// 18-ay NET KÂR (VÖ)  = 216.571.654 TL
// Başabaş: Nisan 2027 (ay 10)
// ROI: Mayıs 2027 (ay 11)
// Gelir: S-curve logistic k=0.8, t0=12
// Gider: Excel gerçek aylık veriler (OPEX+Personel+Pazarlama+Sosyal)
// ============================================
export const MONTHLY_2026_2027: MonthData[] = [
  // H2 2026: Gelir=675.000 / Gider=9.109.148 / Net=-8.434.148
  { period: "Tem 26", revenue: 7_000, expenses: 3_486_276, net: -3_479_276, event: "Platform Lansmanı + CAPEX" },
  { period: "Agu 26", revenue: 15_000, expenses: 705_186, net: -690_186, event: "İlk ilan gelirleri" },
  { period: "Eyl 26", revenue: 34_000, expenses: 818_527, net: -784_527 },
  { period: "Eki 26", revenue: 76_000, expenses: 1_207_263, net: -1_131_263 },
  { period: "Kas 26", revenue: 169_000, expenses: 1_305_130, net: -1_136_130 },
  { period: "Ara 26", revenue: 374_000, expenses: 2_449_866, net: -2_075_866, event: "Yıl sonu — ilk maaşlar" },
  // 2027: Gelir=297.325.000 / Gider=76.107.926 (Excel+ek 100 kadro) / Net=221.217.074
  { period: "Oca 27", revenue: 824_000, expenses: 3_577_969, net: -2_753_969, event: "B2B Lansman" },
  { period: "Sub 27", revenue: 1_794_000, expenses: 3_287_646, net: -1_493_646 },
  { period: "Mar 27", revenue: 3_808_000, expenses: 3_918_820, net: -110_820, event: "Neredeyse başabaş" },
  { period: "Nis 27", revenue: 7_697_000, expenses: 4_347_480, net: 3_349_520, event: "BAŞABAŞ — Operasyonel", isMilestone: true },
  { period: "May 27", revenue: 14_191_000, expenses: 5_083_091, net: 9_107_909, event: "+ek kadro başlangıcı" },
  { period: "Haz 27", revenue: 22_900_000, expenses: 6_070_030, net: 16_829_970 },
  { period: "Tem 27", revenue: 31_609_000, expenses: 6_636_444, net: 24_972_556 },
  { period: "Agu 27", revenue: 38_103_000, expenses: 7_099_519, net: 31_003_481 },
  { period: "Eyl 27", revenue: 41_992_000, expenses: 8_247_074, net: 33_744_926 },
  { period: "Eki 27", revenue: 44_006_000, expenses: 8_145_501, net: 35_860_499, event: "100.000 arsa ilanı eşiği" },
  { period: "Kas 27", revenue: 44_976_000, expenses: 9_144_489, net: 35_831_511 },
  { period: "Ara 27", revenue: 45_425_000, expenses: 10_549_863, net: 34_875_137, event: "S-curve plato başlangıcı" },
];

// Basabas grafiklerinde kullanmak icin: Tem 2026 - Ara 2028 (30 ay)
export function getExtendedMonthly(): MonthData[] {
  const base = [...MONTHLY_2026_2027];
  // 2028: Revenue 569M, Expenses ~133M (Ara 27 ₺10.5M'den düzgün devam, 250 kadro sabit)
  const months2028 = [
    { period: "Oca 28", revenue: 42_000_000, expenses: 10_700_000 },
    { period: "Sub 28", revenue: 43_000_000, expenses: 10_800_000 },
    { period: "Mar 28", revenue: 44_000_000, expenses: 10_900_000 },
    { period: "Nis 28", revenue: 45_000_000, expenses: 11_000_000 },
    { period: "May 28", revenue: 46_000_000, expenses: 11_100_000 },
    { period: "Haz 28", revenue: 47_000_000, expenses: 11_200_000 },
    { period: "Tem 28", revenue: 48_000_000, expenses: 11_300_000 },
    { period: "Agu 28", revenue: 49_000_000, expenses: 11_400_000 },
    { period: "Eyl 28", revenue: 50_000_000, expenses: 11_500_000 },
    { period: "Eki 28", revenue: 51_000_000, expenses: 11_600_000 },
    { period: "Kas 28", revenue: 51_500_000, expenses: 11_700_000 },
    { period: "Ara 28", revenue: 52_500_000, expenses: 11_800_000 },
  ];
  return [
    ...base,
    ...months2028.map(m => ({ ...m, net: m.revenue - m.expenses })),
  ];
}

export interface YearData {
  year: number;
  revenue: number;
  expenses: number;
  ebitda: number;
  netProfit: number;
  margin: number;
  somPct: number;
  somVal: number;
  headcount: number;
  phase: string;
  phaseColor: string;
  hcRoles: string;
  capex: number;
  capexDesc: string;
  isProjection: boolean;
}

export function getYearlyData(): YearData[] {
  const raw: Partial<YearData>[] = [
    // 2026-2027: MD + Excel gider, 2028+: S-curve geçiş (MD→Excel)
    // Giderler: Excel mevcut + ek 100 kişi maaş etkisi (May 2027'den eşit dağılım)
    { year: 2026, revenue: 675_000, expenses: 9_972_248, isProjection: false },
    { year: 2027, revenue: 297_325_000, expenses: 76_108_000, isProjection: false },    // +4.7M ek kadro
    { year: 2028, revenue: 600_000_000, expenses: 133_000_000, isProjection: true },     // aylık ~10.7→11.8M, 250 kadro sabit
    { year: 2029, revenue: 780_000_000, expenses: 119_091_000, isProjection: true },   // +30% büyüme
    { year: 2030, revenue: 940_000_000, expenses: 154_698_000, isProjection: true },   // +21% büyüme
    { year: 2031, revenue: 1_083_000_000, expenses: 190_306_000, isProjection: true }, // +15% büyüme
    { year: 2032, revenue: 1_200_000_000, expenses: 184_271_000, isProjection: true }, // +11% plato
  ];

  return raw.map(r => {
    const y = r.year!;
    const rev = r.revenue!;
    const exp = r.expenses!;
    const ebitda = rev - exp;
    const hc = HEADCOUNT[y];
    const cap = CAPEX[y];
    const somPct = SOM_TARGETS[y] || 0;
    const sam = SAM_BY_YEAR[y] || SAM_BASE;
    return {
      year: y, revenue: rev, expenses: exp, ebitda,
      netProfit: ebitda * 0.75,
      margin: rev > 0 ? Math.round(ebitda / rev * 100) : 0,
      somPct: Math.round(somPct * 1000) / 10,
      somVal: sam * somPct,
      headcount: hc?.count || 0,
      phase: hc?.phase || "",
      phaseColor: hc?.color || "#6B7280",
      hcRoles: hc?.roles || "",
      capex: cap?.amount || 0,
      capexDesc: cap?.desc || "",
      isProjection: r.isProjection || false,
    };
  });
}

export const CHURN = {
  sahibindenBireysel: { rate: 85, platformLife: "2-4 ay" },
  sahibindenKurumsal: { rate: 40, platformLife: "12-36 ay" },
  sahibindenBlended: 60,
  arsamTarget: 25,
  explanation: "149 kişi, 6-7x verimlilik (AI destekli). 74 FTE AI olmadan → 38 AI ile = 36 FTE tasarruf, yıllık 21M TL tasarruf. sahibinden 750-1000 kişi ile %60 churn yapıyor. arsam.net daha iyi müşteri hizmeti (dedicated account manager, 7/24 AI chatbot, proaktif destek) → churn %25'e düşürme hedefi.",
};

export const BENCHMARKS = {
  sahibinden: { employees: 1000, year: 2025 },
  yemeksepeti: { employees: 5500, year: 2024 },
  hepsiburada: { employees: 1250, year: 2024 },
  trendyol: { employees: 3900, year: 2024 },
};

export function formatTL(value: number): string {
  const abs = Math.abs(Math.round(value));
  const formatted = abs.toLocaleString("tr-TR");
  return value < 0 ? `-₺${formatted}` : `₺${formatted}`;
}
