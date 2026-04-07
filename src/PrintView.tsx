import { MONTHLY_2026_2027, getYearlyData, CHURN, BENCHMARKS, formatTL, SAM_BY_YEAR, SOM_TARGETS, TAM } from "@/lib/data";

/* ── Helpers ── */
const fmtNum = (n: number) => n.toLocaleString("tr-TR");

/* ── Styles ── */
const S = {
  page: "bg-white text-black min-h-screen font-[Inter,system-ui,sans-serif] text-base leading-relaxed",
  section: "px-5 py-10 border-b-2 border-black/10",
  h1: "text-4xl md:text-5xl font-black tracking-tight",
  h2: "text-2xl md:text-3xl font-bold mb-6",
  h3: "text-xl md:text-2xl font-semibold mb-4",
  sub: "text-lg text-black/60 mt-2",
  big: "text-5xl md:text-6xl font-black",
  card: "border-2 border-black/15 rounded-2xl p-5 md:p-6",
  table: "w-full text-left border-collapse",
  th: "border-b-2 border-black py-3 px-2 text-base font-bold bg-black/5",
  td: "border-b border-black/10 py-3 px-2 text-base tabular-nums",
  bar: "h-4 rounded-full bg-black",
  barBg: "h-4 rounded-full bg-black/10 w-full",
  label: "text-sm font-medium text-black/50 uppercase tracking-wider",
  grid2: "grid grid-cols-1 md:grid-cols-2 gap-5",
  grid3: "grid grid-cols-1 md:grid-cols-3 gap-5",
  grid4: "grid grid-cols-2 md:grid-cols-4 gap-5",
} as const;

/* ── HERO ── */
function Hero() {
  return (
    <section className="px-5 py-16 text-center border-b-4 border-black">
      <p className="text-lg tracking-[0.3em] uppercase text-black/50 mb-4">Yatirimci Sunumu · 2026-2032 · Muhafazakar Senaryo</p>
      <h1 className="text-5xl md:text-7xl font-black tracking-tight">arsam.net</h1>
      <div className="mt-8 flex items-center justify-center gap-4 text-2xl md:text-3xl font-bold">
        <span>₺49.000.000</span>
        <span className="text-black/30">&rarr;</span>
        <span>₺3.650.442.500</span>
      </div>
      <p className="text-lg text-black/50 mt-2">baslangic sermayesi &rarr; 2032 kumulatif nakit (vergi öncesi)</p>
    </section>
  );
}

/* ── DASHBOARD KPIs ── */
function Dashboard() {
  const m = MONTHLY_2026_2027;
  const totR = m.reduce((s, x) => s + x.revenue, 0);
  const totE = m.reduce((s, x) => s + x.expenses, 0);
  const totN = totR - totE;
  const kpis = [
    { label: "TOPLAM YATIRIM", value: "49.000.000", sub: "Baslangic Sermaye" },
    { label: "18 AY TOPLAM GELIR", value: fmtNum(totR), sub: "Kumulatif" },
    { label: "18 AY TOPLAM GIDER", value: fmtNum(totE), sub: "Kumulatif" },
    { label: "NET KAR (VERGI ONCESI)", value: fmtNum(totN), sub: "18 Ay Net Sonuc" },
  ];
  return (
    <section className={S.section}>
      <h2 className={S.h2}>Finansal Dashboard</h2>
      <div className={S.grid4}>
        {kpis.map(k => (
          <div key={k.label} className={S.card}>
            <p className={S.label}>{k.label}</p>
            <p className="text-2xl md:text-3xl font-black mt-2">{k.value}</p>
            <p className="text-base text-black/40 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── INVESTMENT ── */
function Investment() {
  const items = [
    { label: "Personel", amount: 24_000_000, pct: 60 },
    { label: "OPEX", amount: 8_000_000, pct: 20 },
    { label: "Pazarlama", amount: 5_137_000, pct: 13 },
    { label: "CAPEX", amount: 2_863_000, pct: 7 },
  ];
  const capex = [
    "Ofis Kurulum (Depozito+Mobilya+Klima+Cam) ₺1,100K",
    "Mutfak Ekipmanlari ₺173.000",
    "Bilgisayar (MacBook/iMac/PC) ~₺700.000",
    "Marka (TPE+Logo+Kurulus) ₺180.000",
    "Hosgeldin Paketleri (18 kisi) ₺107.100",
    "Yazilim Lisanslari ₺38.000",
  ];
  return (
    <section className={S.section}>
      <h2 className={S.h2}>Baslangic Sermayesi: ₺49.000.000</h2>
      {/* bar */}
      <div className="flex h-6 rounded-full overflow-hidden border-2 border-black/20 mb-4">
        {items.map(it => (
          <div key={it.label} className="bg-black/80 border-r border-white" style={{ width: `${it.pct}%` }} />
        ))}
      </div>
      <div className={S.grid4}>
        {items.map(it => (
          <div key={it.label} className="text-center">
            <p className="text-lg font-bold">{formatTL(it.amount)}</p>
            <p className="text-base text-black/50">{it.label} (%{it.pct})</p>
          </div>
        ))}
      </div>
      {/* CAPEX detail - STATIC, no accordion */}
      <div className="mt-6 border-2 border-black/15 rounded-2xl p-5">
        <p className="text-lg font-bold mb-3">CAPEX Detayi (₺2.863.100)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {capex.map(c => <p key={c} className="text-base py-1">• {c}</p>)}
        </div>
      </div>
    </section>
  );
}

/* ── MONTHLY TABLE ── */
function MonthlyTable() {
  const m = MONTHLY_2026_2027;
  const breakIdx = m.findIndex(x => x.isMilestone);
  return (
    <section className={S.section}>
      <h2 className={S.h2}>Aylik Nakit Akisi (S-Curve)</h2>
      <div className="overflow-x-auto">
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Ay</th>
              <th className={S.th + " text-right"}>Gelir</th>
              <th className={S.th + " text-right"}>Gider</th>
              <th className={S.th + " text-right"}>Net</th>
              <th className={S.th}>Olay</th>
            </tr>
          </thead>
          <tbody>
            {m.map((mo, i) => {
              const isBE = i === breakIdx;
              return (
                <tr key={mo.period} className={isBE ? "bg-black/5 font-bold" : ""}>
                  <td className={S.td + " font-medium"}>{mo.period}</td>
                  <td className={S.td + " text-right"}>{mo.revenue > 0 ? fmtNum(mo.revenue) : "—"}</td>
                  <td className={S.td + " text-right"}>{fmtNum(mo.expenses)}</td>
                  <td className={S.td + " text-right font-semibold"}>{mo.net >= 0 ? "+" : ""}{fmtNum(mo.net)}</td>
                  <td className={S.td + " text-black/50"}>{mo.event || ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ── BREAKEVEN ── */
function Breakeven() {
  return (
    <section className={S.section + " text-center"}>
      <p className={S.label}>1. Basabas — Operasyonel</p>
      <p className={S.big + " mt-2"}>EKIM 2026</p>
      <p className="text-2xl mt-2">+₺300.000 — Gelir ₺2.200.000 &gt; Gider ₺1.900.000</p>
      <div className="mt-8 border-t-2 border-black/10 pt-8">
        <p className={S.label}>2. Basabas — Kumulatif (Yatirim Geri Donus)</p>
        <p className={S.big + " mt-2"}>ARALIK 2026</p>
        <p className="text-2xl mt-2">₺49.000.000+ geri (6 ayda)</p>
      </div>
    </section>
  );
}

/* ── QUARTERS — all 4 visible ── */
function Quarters() {
  const m = MONTHLY_2026_2027;
  const qs = [
    { label: "Q1 2027", months: m.slice(6, 9) },
    { label: "Q2 2027", months: m.slice(9, 12) },
    { label: "Q3 2027", months: m.slice(12, 15) },
    { label: "Q4 2027", months: m.slice(15, 18) },
  ];
  return (
    <section className={S.section}>
      <h2 className={S.h2}>Ceyreklik Donusum (2027)</h2>
      <div className={S.grid4}>
        {qs.map(q => {
          const rev = q.months.reduce((s, x) => s + x.revenue, 0);
          const exp = q.months.reduce((s, x) => s + x.expenses, 0);
          const net = rev - exp;
          const margin = rev > 0 ? Math.round(net / rev * 100) : 0;
          return (
            <div key={q.label} className={S.card}>
              <p className="text-lg font-bold mb-3">{q.label}</p>
              <div className="space-y-2">
                <div><span className={S.label}>Gelir</span><p className="text-xl font-bold">{formatTL(rev)}</p></div>
                <div><span className={S.label}>Gider</span><p className="text-xl font-bold">{formatTL(exp)}</p></div>
                <div><span className={S.label}>Net</span><p className="text-xl font-bold">{formatTL(net)}</p></div>
                <div><span className={S.label}>Marj</span><p className="text-xl font-bold">%{margin}</p></div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── YEARLY VISION ── */
function Vision() {
  const years = getYearlyData();
  return (
    <section className={S.section}>
      <h2 className={S.h2}>2026 &rarr; 2032 Yillik Projeksiyon</h2>
      <div className="overflow-x-auto">
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Yil</th>
              <th className={S.th}>Faz</th>
              <th className={S.th + " text-right"}>Gelir</th>
              <th className={S.th + " text-right"}>EBITDA</th>
              <th className={S.th + " text-right"}>SOM %</th>
              <th className={S.th + " text-right"}>Kadro</th>
              <th className={S.th + " text-right"}>Marj</th>
            </tr>
          </thead>
          <tbody>
            {years.map(y => (
              <tr key={y.year} className={y.year === 2032 ? "bg-black/5 font-bold" : ""}>
                <td className={S.td + " font-bold text-lg"}>{y.year}</td>
                <td className={S.td}>{y.phase}</td>
                <td className={S.td + " text-right font-semibold"}>{formatTL(y.revenue)}</td>
                <td className={S.td + " text-right font-semibold"}>{formatTL(y.ebitda)}</td>
                <td className={S.td + " text-right"}>{y.somPct > 0 ? `%${y.somPct}` : "GTM"}</td>
                <td className={S.td + " text-right"}>{y.headcount}</td>
                <td className={S.td + " text-right"}>%{y.margin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ── TAM / SAM / SOM ── */
function MarketSize() {
  return (
    <section className={S.section}>
      <h2 className={S.h2}>Pazar Buyuklugu (TAM / SAM / SOM)</h2>
      <div className={S.grid3}>
        <div className={S.card}>
          <p className={S.label}>TAM</p>
          <p className="text-3xl font-black mt-2">{formatTL(TAM)}</p>
          <p className="text-base text-black/50 mt-1">Dijital arsa ilan pazari</p>
        </div>
        <div className={S.card}>
          <p className={S.label}>SAM (2026)</p>
          <p className="text-3xl font-black mt-2">{formatTL(SAM_BY_YEAR[2026])}</p>
          <p className="text-base text-black/50 mt-1">TAM x 0.405</p>
        </div>
        <div className={S.card}>
          <p className={S.label}>SAM (2032)</p>
          <p className="text-3xl font-black mt-2">{formatTL(SAM_BY_YEAR[2032])}</p>
          <p className="text-base text-black/50 mt-1">+%13/yil buyume</p>
        </div>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Yil</th>
              <th className={S.th + " text-right"}>SAM</th>
              <th className={S.th + " text-right"}>SOM Hedef (%)</th>
              <th className={S.th + " text-right"}>SOM Deger</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(SAM_BY_YEAR).map(y => {
              const year = Number(y);
              const sam = SAM_BY_YEAR[year];
              const som = SOM_TARGETS[year] || 0;
              return (
                <tr key={year}>
                  <td className={S.td + " font-bold"}>{year}</td>
                  <td className={S.td + " text-right"}>{formatTL(sam)}</td>
                  <td className={S.td + " text-right"}>%{(som * 100).toFixed(1)}</td>
                  <td className={S.td + " text-right font-semibold"}>{formatTL(sam * som)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ── HEADCOUNT ── */
function Headcount() {
  const years = getYearlyData();
  const max = Math.max(...years.map(y => y.headcount));
  return (
    <section className={S.section}>
      <h2 className={S.h2}>Kadro Evrimi: 19 &rarr; 149 kisi</h2>
      <p className="text-lg text-black/50 mb-8">6-7x verimlilik (AI destekli)</p>
      <div className="space-y-3">
        {years.map(y => (
          <div key={y.year} className="flex items-center gap-4">
            <span className="w-12 text-right text-lg font-bold">{y.year}</span>
            <div className={S.barBg}>
              <div className={S.bar} style={{ width: `${(y.headcount / max) * 100}%`, minWidth: 48 }}>
                <span className="text-white text-sm font-bold px-3 leading-4">{y.headcount}</span>
              </div>
            </div>
            <span className="text-base text-black/40 shrink-0">{y.phase}</span>
          </div>
        ))}
      </div>
      {/* AI benchmark - STATIC, no accordion */}
      <div className="mt-8 border-2 border-black/15 rounded-2xl p-5">
        <p className="text-lg font-bold mb-4">AI Verimlilik: 74 FTE &rarr; 38 AI ile (21M TL/yil tasarruf)</p>
        <div className={S.grid4}>
          {Object.entries(BENCHMARKS).map(([name, data]) => (
            <div key={name} className="text-center">
              <p className="text-2xl font-black">{data.employees.toLocaleString("tr-TR")}</p>
              <p className="text-base text-black/50 capitalize">{name} ({data.year})</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CHURN ── */
function ChurnSec() {
  const cards = [
    { label: "sahibinden Bireysel", rate: 85, sub: "omur: 2-4 ay" },
    { label: "sahibinden Kurumsal", rate: 40, sub: "omur: 12-36 ay" },
    { label: "arsam.net Hedef", rate: 25, sub: "149 kisi, 6-7x verimlilik" },
  ];
  return (
    <section className={S.section}>
      <h2 className={S.h2}>Churn: Neden %25?</h2>
      <div className={S.grid3}>
        {cards.map(c => (
          <div key={c.label} className={S.card + " text-center"}>
            <p className="text-base text-black/50">{c.label}</p>
            <p className="text-5xl font-black mt-3">%{c.rate}</p>
            <p className="text-base text-black/40 mt-2">/yil — {c.sub}</p>
          </div>
        ))}
      </div>
      <p className="text-base text-black/50 mt-6 leading-relaxed">{CHURN.explanation}</p>
    </section>
  );
}

/* ── FINALE ── */
function Finale() {
  return (
    <section className={S.section + " text-center"}>
      <p className={S.label + " mb-4"}>Uzun Vade Vizyon</p>
      <p className="text-6xl md:text-8xl font-black">2035</p>
      <p className="text-3xl font-bold mt-6">%75 Pazar Payi</p>
      <p className="text-4xl font-black mt-2">{formatTL(4_500_000_000)}</p>
      <p className="text-lg text-black/50 mt-1">TAM ₺6.000.000.000 x %75 = SAM Hakimiyeti</p>
      <p className="text-2xl font-bold mt-8">Turkiye'nin #1 Arsa Platformu</p>
      <p className="text-lg text-black/50">Veri + Degerleme + Ilan</p>
    </section>
  );
}

/* ── PRINT VIEW ── */
export default function PrintView() {
  return (
    <div className={S.page}>
      <Hero />
      <Dashboard />
      <Investment />
      <MonthlyTable />
      <Breakeven />
      <Quarters />
      <MarketSize />
      <Vision />
      <Headcount />
      <ChurnSec />
      <Finale />
      <footer className="px-5 py-6 text-center text-base text-black/30 border-t-2 border-black/10">
        arsam.net · Muhafazakar Senaryo · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
