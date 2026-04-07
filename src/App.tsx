import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import { Disclosure, DisclosureButton, DisclosurePanel, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Star, Zap, Users, ArrowRight, DollarSign } from "lucide-react";
import clsx from "clsx";
import { MONTHLY_2026_2027, getExtendedMonthly, getYearlyData, CHURN, BENCHMARKS, formatTL } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid, Area, AreaChart, Legend } from "recharts";
import gsap from "gsap";

/* ── Utilities ── */
function useAnimatedNumber(target: number, duration = 1200) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const val = Math.round(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = formatTL(val);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  return ref;
}

function Counter({ value, prefix = "", className = "" }: { value: number; prefix?: string; className?: string }) {
  const ref = useAnimatedNumber(value);
  return <span className={clsx("tabular", className)}>{prefix}<span ref={ref}>₺0</span></span>;
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}>{children}</motion.div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return <motion.div className="scroll-progress" style={{ width }} />;
}

function StickyNav() {
  const items = [
    { label: "Yatirim", href: "#yatirim" }, { label: "Zarar", href: "#zarar" },
    { label: "Basabas", href: "#basabas" }, { label: "Kar", href: "#kar" },
    { label: "Vizyon", href: "#vizyon" }, { label: "Kadro", href: "#kadro" },
    { label: "Churn", href: "#churn" }, { label: "2035", href: "#finale" },
  ];
  return (
    <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full bg-surface-2/80 backdrop-blur-xl border border-border/50">
      {items.map((s) => (
        <a key={s.label} href={s.href} className="px-3 py-1 text-xs text-text-3 hover:text-text rounded-full hover:bg-surface-3 transition-colors">{s.label}</a>
      ))}
    </nav>
  );
}

/* ── HERO ── */
function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue/5 rounded-full blur-[120px]" />
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-text-3 text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.4em] uppercase mb-6 px-4 text-center">Yatırımcı Sunumu · 2026-2032 · Muhafazakâr Senaryo</motion.p>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl sm:text-6xl md:text-[5.5rem] font-bold tracking-[-0.04em] leading-none">
        <span className="bg-gradient-to-r from-blue via-cyan to-emerald bg-clip-text text-transparent">arsam.net</span>
      </motion.h1>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xl sm:text-3xl font-light">
        <span className="text-rose">₺42.300.164</span><ArrowRight className="w-5 h-5 text-text-3" /><span className="text-emerald">₺4.131.069.752</span>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="text-text-3 text-sm mt-2">başlangıç sermayesi → 2032 kümülatif nakit (vergi öncesi)</motion.p>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-16"><ChevronDown className="w-6 h-6 text-text-3" /></motion.div>
    </section>
  );
}

/* ── S-CURVE ── */
function SCurve() {
  const m = MONTHLY_2026_2027;
  const data = m.map(mo => ({
    name: mo.period,
    gelir: mo.revenue,
    gider: mo.expenses,
  }));
  const fmt = (v: number) => formatTL(v);
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Reveal><h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2">S-Curve Büyüme Eğrileri</h2></Reveal>
        <Reveal delay={0.1}><p className="text-text-3 text-center mb-10">Arsa/arazi platformu aylık gelir vs gider (Tem 2026 — Ara 2027)</p></Reveal>
        <Reveal delay={0.2}>
          <div className="w-full h-[280px] sm:h-[400px] md:h-[480px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 9 }} angle={-45} textAnchor="end" height={50} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={fmt} width={80} />
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid #1E293B", borderRadius: 12, fontSize: 13 }}
                  labelStyle={{ color: "#94A3B8" }}
                  formatter={(v: number) => [formatTL(v), ""]}
                />
                <ReferenceLine x="Mar 27" stroke="#10B981" strokeDasharray="6 4" strokeWidth={2} label={{ value: "BAŞABAŞ", fill: "#10B981", fontSize: 13, fontWeight: 700, position: "top" }} />
                <Area type="monotone" dataKey="gelir" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.15} strokeWidth={3} name="Gelir" />
                <Area type="monotone" dataKey="gider" stroke="#EF4444" fill="#EF4444" fillOpacity={0.08} strokeWidth={2} name="Gider" />
                <Legend wrapperStyle={{ fontSize: 13, color: "#94A3B8" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── BREAKEVEN CHART ── */
function BreakevenChart() {
  const extended = getExtendedMonthly();
  let cumNet = 0;
  const data = extended.map(mo => {
    cumNet += mo.net;
    return {
      name: mo.period,
      gelir: mo.revenue,
      gider: mo.expenses,
      net: mo.net,
      kumulatif: cumNet,
      nakit: 49_000_000 + cumNet,
    };
  });
  const fmt = (v: number) => formatTL(v);

  // ROI ay: nakit >= 49M (ilk kez)
  const roiIdx = data.findIndex(d => d.nakit >= 49_000_000 && d.net > 0);
  const roiMonth = roiIdx >= 0 ? data[roiIdx].name : "Nis 27";

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal><h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2">Başabaş ve ROI Analizi</h2></Reveal>
        <Reveal delay={0.1}><p className="text-text-3 text-center mb-6">Arsa/arazi ilan geliri vs gider — Tem 2026 → Ara 2028 (30 ay)</p></Reveal>

        {/* Bar Chart */}
        <Reveal delay={0.2}>
          <div className="w-full h-[300px] sm:h-[420px] md:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 50 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 10 }} angle={-60} textAnchor="end" height={70} interval={0} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={fmt} width={80} />
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid #1E293B", borderRadius: 12, fontSize: 13 }}
                  labelStyle={{ color: "#94A3B8" }}
                  formatter={(v: number, name: string) => [formatTL(v), name === "gelir" ? "Gelir" : "Gider"]}
                />
                <ReferenceLine x="Mar 27" stroke="#10B981" strokeDasharray="6 4" strokeWidth={2.5}
                  label={{ value: "BAŞABAŞ", fill: "#10B981", fontSize: 13, fontWeight: 700, position: "top" }} />
                <ReferenceLine x={roiMonth} stroke="#3B82F6" strokeDasharray="4 4" strokeWidth={2}
                  label={{ value: "ROI", fill: "#3B82F6", fontSize: 13, fontWeight: 700, position: "top", offset: 15 }} />
                <Bar dataKey="gelir" fill="#3B82F6" radius={[3, 3, 0, 0]} name="Gelir" />
                <Bar dataKey="gider" fill="#EF4444" radius={[3, 3, 0, 0]} name="Gider" opacity={0.7} />
                <Legend wrapperStyle={{ fontSize: 13, color: "#94A3B8" }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        {/* Explanation cards */}
        <Reveal delay={0.4} className="mt-10">
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 rounded-2xl border-2 border-emerald/30 bg-emerald/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-8 bg-emerald rounded" />
                <h3 className="text-base sm:text-lg font-bold text-emerald">Başabaş Noktası (Break-even)</h3>
              </div>
              <p className="text-text-2 leading-relaxed">
                <strong>Mart 2027</strong> — Platformun aylık gelirinin, aylık gideri ilk kez geçtiği noktadır. Bu aydan itibaren her ay kâr elde edilir.
                Başabaş öncesi toplam zarar: {formatTL(10_700_000 + 724_000 + 669_000)} (9 ay).
                Bu zarar, başlangıç sermayesinden (₺49.000.000) karşılandı.
              </p>
            </div>
            <div className="p-4 sm:p-6 rounded-2xl border-2 border-blue/30 bg-blue/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-8 bg-blue rounded" />
                <h3 className="text-base sm:text-lg font-bold text-blue">ROI — Yatırım Geri Dönüşü</h3>
              </div>
              <p className="text-text-2 leading-relaxed">
                <strong>{roiMonth.replace("27", "2027")}</strong> — Kümülatif kâr, baslangicta yatırılan ₺49.000.000 sermayeyi aşarak yatırımcının parasını geri kazandığı noktadır.
                ROI (Return on Investment) = toplam kârın başlangıç yatırımına oranı.
                Bu noktadan sonra her lira net kazançtır.
              </p>
            </div>
          </div>
        </Reveal>

        {/* What is breakeven? */}
        <Reveal delay={0.5} className="mt-8">
          <div className="p-4 sm:p-6 rounded-2xl border border-border bg-surface-2">
            <h3 className="text-base sm:text-lg font-bold mb-3">Başabaş nedir?</h3>
            <p className="text-text-2 leading-relaxed">
              Basabas (break-even), bir işletmenin toplam gelirinin toplam giderine eşitlendiği noktadır.
              Bu noktaya kadar isletme zarar eder — yani harcadığı parayı henüz kazanamamıştır.
              Başabaş noktasını geçtikten sonra her ek satış kâr getirir.
              Arsa/arazi ilan platformu icin basabas, yeterli sayida ilan vereni (arsa sahibi, emlakci) ve aliciyi platforma cekerek
              ilan ücreti, doping ve kurumsal abonelik gelirlerinin operasyonel giderleri karşılamasına bağlı.
              Ne kadar erken basabas, o kadar düşük risk ve o kadar hızlı büyüme.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── INVESTMENT ── */
function Investment() {
  const topItems = [
    { label: "Personel", amount: 37_353_380, pct: 43, color: "bg-red" },
    { label: "OPEX", amount: 22_953_694, pct: 27, color: "bg-amber" },
    { label: "Dijital Pazarlama", amount: 22_910_000, pct: 27, color: "bg-blue" },
    { label: "CAPEX", amount: 2_863_100, pct: 3, color: "bg-violet" },
  ];
  const personnelRows = [
    { label: "Brüt Maaş Toplamı (İşveren Maliyeti)", amount: 34_986_823 },
    { label: "Sosyal Bütçe (ödül/ikram/eğitim)", amount: 2_366_557 },
  ];
  const opexRows = [
    { label: "AI & Yazılım Araçları", amount: 4_545_761 },
    { label: "Ofis Sabit Giderler", amount: 3_124_141 },
    { label: "Dijital Altyapı (AWS/CDN/API)", amount: 2_802_500 },
    { label: "CPO Araç Giderleri", amount: 2_240_249 },
    { label: "Yeni İşe Alım Ekipmanı", amount: 2_200_000 },
    { label: "Agile/SAFe Araçları", amount: 795_927 },
    { label: "Ofis İkram & Ulaşım", amount: 799_115 },
    { label: "Platform AI/API Maliyeti", amount: 406_724 },
    { label: "CPO Ek Yan Haklar", amount: 305_233 },
    { label: "Hukuki & İdari", amount: 297_000 },
  ];
  const mktRows = [
    { label: "Google Ads", amount: 8_090_000 },
    { label: "Meta Ads (FB + IG)", amount: 3_645_000 },
    { label: "İnfluencer & KOL", amount: 2_250_000 },
    { label: "Emlak Ofisleri Ortaklık", amount: 2_190_000 },
    { label: "YouTube Ads", amount: 1_900_000 },
    { label: "LinkedIn Ads", amount: 1_758_000 },
    { label: "TikTok Ads", amount: 1_455_000 },
    { label: "Programatik / Display", amount: 1_030_000 },
    { label: "SMS Kampanya", amount: 306_000 },
    { label: "SEO İçerik & Ajans", amount: 286_000 },
  ];
  const capexRows = [
    { label: "Bilgisayar & Ekipman (13 ünite)", amount: 1_265_000 },
    { label: "Ofis Kurulum (depozito+mobilya+klima)", amount: 1_100_000 },
    { label: "Marka (TPE+Logo+Kuruluş)", amount: 180_000 },
    { label: "Mutfak Ekipmanları", amount: 173_000 },
    { label: "Hoşgeldin Paketleri (18 kişi)", amount: 107_100 },
    { label: "Yıllık Yazılım Lisansları", amount: 38_000 },
  ];
  const DetailBlock = ({ title, icon, rows, total, bg }: { title: string; icon: string; rows: { label: string; amount: number }[]; total: number; bg: string }) => (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className={clsx("px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-text-2 flex items-center gap-2 border-b border-border", bg)}>
        <DollarSign className="w-4 h-4" /> {title} — {formatTL(total)}
      </div>
      <div className="px-3 sm:px-5 py-3 sm:py-4 space-y-1.5 sm:space-y-2">
        {rows.map(d => (
          <div key={d.label} className="flex justify-between items-center py-1">
            <span className="text-sm text-text-2">{d.label}</span>
            <span className="text-sm font-semibold tabular">{formatTL(d.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <section id="yatirim" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <Reveal><p className="text-text-3 text-xs tracking-[0.3em] uppercase text-center">ROI Noktasına Kadar (12 Ay) Toplam Harcamalar</p></Reveal>
        <Reveal delay={0.1}><p className="text-3xl sm:text-5xl md:text-[7rem] font-bold text-rose mt-4 tracking-tight text-center"><Counter value={42_300_164} className="text-rose" /></p></Reveal>
        <Reveal delay={0.2}><p className="text-text-3 mt-3 text-lg text-center">harcanacak para — bu bilinmeli. <span className="text-text-3/70">(risk payı %5 eklendi)</span></p></Reveal>
        <Reveal delay={0.3} className="mt-14">
          <div className="flex h-4 rounded-full overflow-hidden">
            {topItems.map((it) => (
              <motion.div key={it.label} initial={{ width: 0 }} whileInView={{ width: `${it.pct}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 }}
                className={clsx("h-full", it.color)} />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {topItems.map((it) => (
              <div key={it.label} className="text-center">
                <div className={clsx("w-2 h-2 rounded-full mx-auto mb-1", it.color)} />
                <p className="text-xs text-text-3">{it.label} (%{it.pct})</p>
                <p className="text-sm font-semibold">{formatTL(it.amount)}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.45} className="mt-8">
          <DetailBlock title="Personel Detayı" icon="red" rows={personnelRows} total={37_353_380} bg="bg-red/5" />
        </Reveal>
        <Reveal delay={0.5} className="mt-4">
          <DetailBlock title="OPEX Detayı" icon="amber" rows={opexRows} total={22_953_694} bg="bg-amber/5" />
        </Reveal>
        <Reveal delay={0.6} className="mt-4">
          <DetailBlock title="Dijital Pazarlama Detayı" icon="blue" rows={mktRows} total={22_910_000} bg="bg-blue/5" />
        </Reveal>
        <Reveal delay={0.7} className="mt-4">
          <DetailBlock title="CAPEX Detayı" icon="violet" rows={capexRows} total={2_863_100} bg="bg-violet/5" />
        </Reveal>
      </div>
    </section>
  );
}

/* ── MONTHLY FLOW ── */
function MonthRow({ mo, i, variant }: { mo: typeof MONTHLY_2026_2027[0]; i: number; variant: "loss" | "profit" }) {
  const isLoss = variant === "loss";
  const maxVal = isLoss ? 4_500_000 : 35_000_000;
  const barPct = Math.min(100, (isLoss ? mo.expenses : mo.revenue) / maxVal * 100);
  return (
    <Reveal delay={i * 0.03}>
      <div className={clsx("group flex items-center gap-1.5 sm:gap-3 py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg hover:bg-white/[0.03] transition-colors", mo.isMilestone && "bg-emerald/5 border border-emerald/20 my-2 py-3")}>
        <span className="w-14 sm:w-16 text-xs sm:text-sm font-medium text-text-3 shrink-0">{mo.period}</span>
        <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} whileInView={{ width: `${barPct}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.03 }}
            className={clsx("h-full rounded-full", isLoss ? "bg-gradient-to-r from-red/80 to-amber/60" : "bg-gradient-to-r from-emerald/70 to-cyan/60")} />
        </div>
        <span className={clsx("w-24 sm:w-32 text-right text-[11px] sm:text-xs tabular", mo.revenue > 0 ? "text-blue" : "text-text-3/30")}>{mo.revenue > 0 ? formatTL(mo.revenue) : "—"}</span>
        <span className="w-24 sm:w-32 text-right text-[11px] sm:text-xs tabular text-red/60 hidden md:block">{formatTL(-mo.expenses)}</span>
        <span className={clsx("w-20 sm:w-32 text-right text-[11px] sm:text-xs tabular font-semibold", mo.net >= 0 ? "text-emerald" : "text-red")}>{mo.net >= 0 ? "+" : ""}{formatTL(mo.net)}</span>
        {mo.event && <span className={clsx("text-xs hidden lg:block shrink-0", mo.isMilestone ? "text-emerald font-semibold" : "text-text-3")}>{mo.event}</span>}
      </div>
    </Reveal>
  );
}

function MonthlyFlow() {
  const m = MONTHLY_2026_2027;
  return (
    <>
      <section id="zarar" className="section-gradient-loss py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto px-0">
          <Reveal><div className="flex items-center gap-3 mb-10"><div className="w-3 h-3 rounded-full bg-red animate-pulse" /><h2 className="text-xl sm:text-2xl font-bold">Zarar Dönemi</h2><span className="text-text-3 text-sm">Tem 2026 → Mar 2027</span></div></Reveal>
          <div className="space-y-0.5">{m.slice(0, 9).map((mo, i) => <MonthRow key={mo.period} mo={mo} i={i} variant="loss" />)}</div>
        </div>
      </section>

      <section id="basabas" className="min-h-[60vh] sm:min-h-[80vh] flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)]" />
        <Reveal><Star className="w-12 h-12 text-emerald mb-4" /></Reveal>
        <Reveal delay={0.1}><p className="text-xs tracking-[0.3em] uppercase text-text-3">1. Başabaş — Operasyonel</p></Reveal>
        <Reveal delay={0.2}><h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-emerald mt-2">NİSAN 2027</h2></Reveal>
        <Reveal delay={0.4}><p className="text-xl text-text-2 mt-4">İlk kez kâr ettik.</p></Reveal>
        <Reveal delay={0.5}><p className="text-2xl sm:text-3xl font-bold text-emerald mt-4 sm:mt-6">+₺3.349.520</p></Reveal>
        <Reveal delay={0.6}><p className="text-sm text-text-3 mt-1">Gelir ₺7.697.000 &gt; Gider ₺4.347.480</p></Reveal>
      </section>

      <section id="kar" className="section-gradient-profit py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto px-0">
          <Reveal><div className="flex items-center gap-3 mb-10"><div className="w-3 h-3 rounded-full bg-emerald animate-pulse" /><h2 className="text-xl sm:text-2xl font-bold">Kâr Dönemi</h2><span className="text-text-3 text-sm">Nis 2027 → Ara 2027</span></div></Reveal>
          <div className="space-y-0.5">{m.slice(9).map((mo, i) => <MonthRow key={mo.period} mo={mo} i={i} variant="profit" />)}</div>
        </div>
      </section>
    </>
  );
}

/* ── QUARTERS (Headless Tab) ── */
function Quarters() {
  const m = MONTHLY_2026_2027;
  const qs = [
    { label: "Q1", months: m.slice(6, 9) }, { label: "Q2", months: m.slice(9, 12) },
    { label: "Q3", months: m.slice(12, 15) }, { label: "Q4", months: m.slice(15, 18) },
  ];
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto px-0">
        <Reveal><h2 className="text-2xl font-bold text-center mb-2">Çeyreklik Dönüşüm</h2></Reveal>
        <Reveal delay={0.1}><p className="text-text-3 text-center mb-10">4 çeyrekte zararın kâra dönüşümü</p></Reveal>
        <TabGroup>
          <TabList className="flex justify-center gap-2 mb-8">
            {qs.map((q) => (
              <Tab key={q.label} className={({ selected }) => clsx("px-6 py-2.5 rounded-full text-sm font-medium transition-all outline-none", selected ? "bg-blue text-white shadow-lg shadow-blue/20" : "text-text-3 hover:bg-surface-3")}>{q.label} 2027</Tab>
            ))}
          </TabList>
          <TabPanels>
            {qs.map((q) => {
              const rev = q.months.reduce((s, m) => s + m.revenue, 0);
              const exp = q.months.reduce((s, m) => s + m.expenses, 0);
              const net = q.months.reduce((s, m) => s + m.net, 0);
              const margin = rev > 0 ? Math.round(net / rev * 100) : 0;
              return (
                <TabPanel key={q.label}>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Gelir", val: formatTL(rev), color: "text-blue" },
                      { label: "Gider", val: formatTL(exp), color: "text-red" },
                      { label: "Net", val: formatTL(net), color: net >= 0 ? "text-emerald" : "text-red" },
                      { label: "Kâr Marjı", val: `%${margin}`, color: margin >= 0 ? "text-emerald" : "text-red" },
                    ].map((m) => (
                      <div key={m.label} className="p-4 sm:p-6 rounded-2xl bg-surface-2 border border-border text-center">
                        <p className="text-xs text-text-3 uppercase tracking-wider">{m.label}</p>
                        <p className={clsx("text-xl sm:text-3xl font-bold mt-2", m.color)}>{m.val}</p>
                      </div>
                    ))}
                  </motion.div>
                </TabPanel>
              );
            })}
          </TabPanels>
        </TabGroup>
      </div>
    </section>
  );
}

/* ── PAZAR PAYI EVRİMİ (3 senaryo, GSAP countdown) ── */
// 2026-2027: MD verileri, 2028+: tutarlı büyüme (gelir düşmez, her yıl artar)
const SCENARIOS = {
  kotumser: {
    label: "Kötümser", color: "text-red", bg: "bg-red",
    years: [
      { year: 2026, gelir: 800_000, samPay: 0.03, buyume: null },
      { year: 2027, gelir: 7_000_000, samPay: 0.26, buyume: 775 },
      { year: 2028, gelir: 330_000_000, samPay: 10.8, buyume: 4614 },
      { year: 2029, gelir: 430_000_000, samPay: 12.5, buyume: 30 },
      { year: 2030, gelir: 520_000_000, samPay: 13.3, buyume: 21 },
      { year: 2031, gelir: 600_000_000, samPay: 13.6, buyume: 15 },
      { year: 2032, gelir: 660_000_000, samPay: 13.8, buyume: 10 },
    ],
    kumulatif: 2_547_800_000,
  },
  baz: {
    label: "Kararlı", color: "text-blue", bg: "bg-blue",
    years: [
      { year: 2026, gelir: 1_500_000, samPay: 0.06, buyume: null },
      { year: 2027, gelir: 14_500_000, samPay: 0.54, buyume: 867 },
      { year: 2028, gelir: 600_000_000, samPay: 19.7, buyume: 4038 },
      { year: 2029, gelir: 780_000_000, samPay: 22.6, buyume: 30 },
      { year: 2030, gelir: 940_000_000, samPay: 24.1, buyume: 21 },
      { year: 2031, gelir: 1_083_000_000, samPay: 24.6, buyume: 15 },
      { year: 2032, gelir: 1_200_000_000, samPay: 25.0, buyume: 11 },
    ],
    kumulatif: 4_619_000_000,
  },
  iyimser: {
    label: "İyimser", color: "text-emerald", bg: "bg-emerald",
    years: [
      { year: 2026, gelir: 2_700_000, samPay: 0.11, buyume: null },
      { year: 2027, gelir: 26_000_000, samPay: 0.96, buyume: 863 },
      { year: 2028, gelir: 870_000_000, samPay: 28.5, buyume: 3246 },
      { year: 2029, gelir: 1_130_000_000, samPay: 32.8, buyume: 30 },
      { year: 2030, gelir: 1_360_000_000, samPay: 34.9, buyume: 20 },
      { year: 2031, gelir: 1_565_000_000, samPay: 35.6, buyume: 15 },
      { year: 2032, gelir: 1_720_000_000, samPay: 35.8, buyume: 10 },
    ],
    kumulatif: 6_673_700_000,
  },
} as const;

type ScenarioKey = keyof typeof SCENARIOS;

function GsapNumber({ value, prefix = "", suffix = "", decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prevVal = useRef(0);

  useEffect(() => {
    if (!ref.current) return;
    const obj = { val: prevVal.current };
    gsap.to(obj, {
      val: value,
      duration: 0.9,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          if (decimals > 0) {
            ref.current.textContent = prefix + obj.val.toFixed(decimals).replace(".", ",") + suffix;
          } else {
            ref.current.textContent = prefix + Math.round(obj.val).toLocaleString("tr-TR") + suffix;
          }
        }
      },
    });
    prevVal.current = value;
  }, [value, prefix, suffix, decimals]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

function PazarPayi() {
  const [active, setActive] = useState<ScenarioKey>("baz");
  const sc = SCENARIOS[active];
  const keys: ScenarioKey[] = ["kotumser", "baz", "iyimser"];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Reveal><h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2">Pazar Payı Evrimi</h2></Reveal>
        <Reveal delay={0.1}><p className="text-text-3 text-center mb-10">Arsa/arazi dijital ilan pazarında SAM payı — 3 senaryo</p></Reveal>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {keys.map(k => (
            <button key={k} onClick={() => setActive(k)}
              className={clsx("px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold transition-all",
                active === k ? `${SCENARIOS[k].bg} text-white shadow-lg` : "text-text-3 hover:bg-surface-3"
              )}>
              {SCENARIOS[k].label}
            </button>
          ))}
        </div>

        {/* Kümülatif headline */}
        <Reveal delay={0.2}>
          <div className="text-center mb-10">
            <p className="text-text-3 text-sm uppercase tracking-wider">6 Yıl Kümülatif Gelir</p>
            <p className={clsx("text-2xl sm:text-4xl md:text-6xl font-black mt-2 tabular", sc.color)}>
              <GsapNumber value={sc.kumulatif} prefix="₺" />
            </p>
          </div>
        </Reveal>

        {/* Year rows */}
        <div className="space-y-3">
          {sc.years.map((y, i) => (
            <Reveal key={y.year} delay={i * 0.04}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl border border-border hover:border-blue/20 transition-colors">
                <span className="w-full sm:w-12 text-base sm:text-lg font-bold text-text-2 shrink-0">{y.year}</span>

                {/* SAM bar */}
                <div className="flex-1">
                  <div className="h-8 bg-white/[0.04] rounded-lg overflow-hidden relative">
                    <motion.div
                      className={clsx("h-full rounded-lg flex items-center px-3", sc.bg)}
                      animate={{ width: `${Math.max((y.samPay / sc.years[sc.years.length - 1].samPay) * 100, 4)}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <span className="text-white text-sm font-bold whitespace-nowrap tabular">
                        <GsapNumber value={y.samPay} prefix="%" decimals={1} />
                      </span>
                    </motion.div>
                  </div>
                </div>

                {/* Revenue */}
                <div className="w-full sm:w-36 text-left sm:text-right shrink-0">
                  <p className="text-xs text-text-3">Gelir</p>
                  <p className={clsx("text-base font-bold tabular", sc.color)}>
                    <GsapNumber value={y.gelir} prefix="₺" />
                  </p>
                </div>

                {/* Growth */}
                <div className="w-full sm:w-20 text-left sm:text-right shrink-0 hidden sm:block">
                  {y.buyume ? (
                    <>
                      <p className="text-xs text-text-3">Büyüme</p>
                      <p className="text-base font-bold text-cyan tabular">
                        <GsapNumber value={y.buyume} prefix="+" suffix="%" />
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-text-3">Lansman</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Source note */}
        <Reveal delay={0.4}>
          <p className="text-xs text-text-3/50 text-center mt-6">
            Kaynak: TAM ₺6B, SAM ₺2.4B-₺4.4B (sonsomc.md / sonsomg.md analizi)
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ── VISION + BE2 ── */
function Vision() {
  const years = getYearlyData();
  return (
    <>
      <section className="section-gradient-blue min-h-[50vh] sm:min-h-[70vh] flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)]" />
        <Reveal><Star className="w-12 h-12 text-blue mb-4" /></Reveal>
        <Reveal delay={0.1}><p className="text-xs tracking-[0.3em] uppercase text-text-3">2. Başabaş — Kümülatif</p></Reveal>
        <Reveal delay={0.2}><h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-blue mt-2">HAZİRAN 2027</h2></Reveal>
        <Reveal delay={0.4}><p className="text-xl text-text-2 mt-4">Tüm yatırım geri kazanıldı.</p></Reveal>
        <Reveal delay={0.5}><p className="text-lg sm:text-2xl font-bold text-blue mt-4 sm:mt-6">Kümülatif nakit ₺49.000.000'u aştı (12 ayda)</p></Reveal>
      </section>

      <section id="vizyon" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal><h2 className="text-3xl font-bold text-center mb-12">2026 → 2032</h2></Reveal>
          <div className="space-y-4">
            {years.map((y, i) => (
              <Reveal key={y.year} delay={i * 0.06}>
                <div className={clsx("flex items-stretch rounded-2xl border overflow-hidden transition-all hover:border-blue/30", y.year === 2032 ? "border-cyan/30 glow-cyan" : "border-border")}>
                  <div className="w-20 sm:w-28 md:w-36 flex flex-col items-center justify-center p-2 sm:p-4 border-r border-border shrink-0" style={{ background: `linear-gradient(180deg, ${y.phaseColor}08, ${y.phaseColor}15)` }}>
                    <span className="text-xl sm:text-2xl font-bold">{y.year}</span>
                    <span className="text-[10px] mt-1 px-2 py-0.5 rounded-full border" style={{ borderColor: y.phaseColor, color: y.phaseColor }}>{y.phase}</span>
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-1 sm:gap-4 p-2 sm:p-5">
                    <div><p className="text-[10px] text-text-3 uppercase">Gelir</p><p className="text-xs sm:text-lg font-bold text-blue">{formatTL(y.revenue)}</p></div>
                    <div><p className="text-[10px] text-text-3 uppercase">EBITDA</p><p className={clsx("text-xs sm:text-lg font-bold", y.ebitda >= 0 ? "text-emerald" : "text-red")}>{formatTL(y.ebitda)}</p></div>
                    <div><p className="text-[10px] text-text-3 uppercase">SOM</p><p className="text-xs sm:text-lg font-bold text-violet">{y.somPct > 0 ? `%${y.somPct}` : "GTM"}</p></div>
                    <div className="hidden md:block"><p className="text-[10px] text-text-3 uppercase">Kadro</p><p className="text-lg font-bold text-cyan">{y.headcount}</p></div>
                    <div className="hidden md:block"><p className="text-[10px] text-text-3 uppercase">Marj</p><p className={clsx("text-lg font-bold", y.margin >= 0 ? "text-emerald" : "text-red")}>%{y.margin}</p></div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ── HEADCOUNT ── */
function Headcount() {
  const years = getYearlyData();
  return (
    <section id="kadro" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto px-0">
        <Reveal><h2 className="text-xl sm:text-2xl font-bold text-center mb-2 flex items-center justify-center gap-2"><Users className="w-6 h-6 text-cyan" /> Kadro Evrimi</h2></Reveal>
        <Reveal delay={0.1}><p className="text-text-3 text-center mb-12">19 → 250 kişi — Mayıs 2027'den itibaren ek +100 kadro (eşit dağılımlı)</p></Reveal>
        <div className="space-y-3">
          {years.map((y, i) => (
            <Reveal key={y.year} delay={i * 0.06}>
              <div className="flex items-center gap-4">
                <span className="w-8 sm:w-10 text-right text-xs sm:text-sm font-bold text-text-2">{y.year}</span>
                <div className="flex-1 h-11 relative">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${(y.headcount / 250) * 100}%` }} viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-xl flex items-center px-4 text-sm font-semibold text-white"
                    style={{ background: `linear-gradient(90deg, ${y.phaseColor}CC, ${y.phaseColor}66)`, minWidth: 56 }}>{y.headcount}</motion.div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.5} className="mt-10">
          <Disclosure>
            {({ open }) => (
              <div className="border border-border rounded-xl overflow-hidden">
                <DisclosureButton className="w-full flex items-center justify-between px-3 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm hover:bg-surface-3 transition-colors">
                  <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber" /> AI Verimlilik: 74 FTE → 38 AI ile (21M TL/yıl tasarruf)</span>
                  <ChevronDown className={clsx("w-4 h-4 text-text-3 transition-transform", open && "rotate-180")} />
                </DisclosureButton>
                <DisclosurePanel className="px-3 sm:px-5 pb-4 sm:pb-5 border-t border-border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {Object.entries(BENCHMARKS).map(([name, data]) => (
                      <div key={name} className="text-center p-3 rounded-xl bg-surface-3/50"><p className="text-xs text-text-3 capitalize">{name}</p><p className="text-xl font-bold mt-1">{data.employees.toLocaleString("tr-TR")}</p></div>
                    ))}
                  </div>
                </DisclosurePanel>
              </div>
            )}
          </Disclosure>
        </Reveal>
      </div>
    </section>
  );
}

/* ── CHURN ── */
function ChurnSec() {
  const cards = [
    { label: "sahibinden Bireysel", rate: 85, sub: "ömür: 2-4 ay", color: "text-red", border: "border-red/20" },
    { label: "sahibinden Kurumsal", rate: 40, sub: "ömür: 12-36 ay", color: "text-amber", border: "border-amber/20" },
    { label: "arsam.net Hedef", rate: 25, sub: "149 kişi, 6-7x verimlilik", color: "text-emerald", border: "border-emerald/30 border-2 glow-emerald" },
  ];
  return (
    <section id="churn" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto px-0 text-center">
        <Reveal><h2 className="text-xl sm:text-2xl font-bold mb-8 sm:mb-10">Churn: Neden %25?</h2></Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {cards.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.12}>
              <div className={clsx("p-5 sm:p-8 rounded-2xl border text-center", c.border)}>
                <p className="text-xs text-text-3">{c.label}</p>
                <p className={clsx("text-4xl sm:text-6xl font-bold mt-3", c.color)}>%{c.rate}</p>
                <p className="text-xs text-text-3 mt-2">/yil — {c.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.4}><p className="text-xs text-text-3 mt-8 max-w-xl mx-auto leading-relaxed">{CHURN.explanation}</p></Reveal>
      </div>
    </section>
  );
}

/* ── FINALE ── */
function Finale() {
  return (
    <section id="finale" className="min-h-screen flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.06)_0%,transparent_60%)]" />
      <Reveal><p className="text-xs tracking-[0.4em] uppercase text-text-3 mb-6">Uzun Vade Vizyon</p></Reveal>
      <Reveal delay={0.15}><h2 className="text-4xl sm:text-7xl md:text-[8rem] font-bold text-cyan tracking-tight">2035</h2></Reveal>
      <Reveal delay={0.3}><div className="mt-8 space-y-2 text-center"><p className="text-xl sm:text-3xl font-bold">%75 Pazar Payı</p><p className="text-2xl sm:text-4xl font-bold text-cyan"><Counter value={4_500_000_000} className="text-cyan" /></p><p className="text-text-3">TAM ₺6.000.000.000 x %75 = SAM Hâkimiyeti</p></div></Reveal>
      <Reveal delay={0.5}><p className="text-lg sm:text-xl font-semibold mt-8 sm:mt-12">Türkiye'nin #1 Arsa Platformu</p></Reveal>
      <Reveal delay={0.6}><p className="text-sm text-text-3 mt-1">Veri + Değerleme + İlan</p></Reveal>
    </section>
  );
}

/* ── APP ── */
export default function App() {
  return (<><ScrollProgress /><StickyNav /><Hero /><SCurve /><BreakevenChart /><Investment /><MonthlyFlow /><Quarters /><PazarPayi /><Vision /><Headcount /><ChurnSec /><Finale /></>);
}
