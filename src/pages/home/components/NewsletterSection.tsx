import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";

// ── Types ────────────────────────────────────────────────────────────────────
interface Producer {
  id: string;
  name: string;
  region: string;
  role: string;
  image: string;
  need: string;
  progress: number;
  adopters: number;
}

interface StatItem {
  target: number;
  suffix: string;
  prefix: string;
  label: string;
  pct: number;
}

// ── Data ─────────────────────────────────────────────────────────────────────
const producers: Producer[] = [
  {
    id: "rosa",
    name: "Rosa Quispe",
    region: "Ayacucho",
    role: "Productora de cacao fino",
    image: "/Coya/images/rosa.jpeg",
    need: "Balanza de precisión para fermentación",
    progress: 68,
    adopters: 14,
  },
  {
    id: "luis",
    name: "Luis Mamani",
    region: "Junín",
    role: "Maestro fermentador",
    image: "/Coya/images/elias.jpeg",
    need: "Cajones de madera para fermentación",
    progress: 45,
    adopters: 9,
  },
  {
    id: "carmen",
    name: "Carmen Huallpa",
    region: "San Martín",
    role: "Líder de cooperativa",
    image: "/Coya/images/carmen.jpeg",
    need: "Secadora solar para cacao",
    progress: 20,
    adopters: 4,
  },
];

const impactTiers = [
  { min: 30,  max: 39,   label: "Cubres el costo de una jornada completa de cosecha manual." },
  { min: 40,  max: 59,   label: "Financias una semana de fermentación artesanal del cacao." },
  { min: 60,  max: 79,   label: "Contribuyes a una balanza de precisión para el proceso de secado." },
  { min: 80,  max: 99,   label: "Financias un cajón de madera para fermentación artesanal." },
  { min: 100, max: 199,  label: "Cubres el mantenimiento mensual completo de una secadora solar." },
  { min: 200, max: 9999, label: "Financias un mes entero de operación del cacaotal familiar." },
];

function getImpact(amount: number, producer: Producer): string {
  const tier = impactTiers.find((t) => amount >= t.min && amount <= t.max);
  if (!tier) return "Cada sol cuenta para esta familia.";
  return `Con $${amount} para ${producer.name}: ${tier.label}`;
}

const AMOUNTS_MONTHLY = [30, 40, 60, 80, 100, 200];
const AMOUNTS_ONCE    = [200, 300, 500, 800, 1000, 2000];

// ── Circular stat ─────────────────────────────────────────────────────────────
function CircularStat({ stat, animate }: { stat: StatItem; animate: boolean }) {
  const [count, setCount] = useState(0);
  const radius = 44;
  const stroke = 4;
  const nr = radius - stroke / 2;
  const circ = 2 * Math.PI * nr;
  const dashOffset = circ - (circ * (animate ? stat.pct : 0)) / 100;

  useEffect(() => {
    if (!animate) { setCount(0); return; }
    const steps = 60;
    const inc = stat.target / steps;
    let cur = 0;
    const timer = setInterval(() => {
      cur += inc;
      if (cur >= stat.target) { setCount(stat.target); clearInterval(timer); }
      else setCount(Math.floor(cur));
    }, 1600 / steps);
    return () => clearInterval(timer);
  }, [animate, stat.target]);

  const display =
    stat.target >= 1000
      ? `${stat.prefix}${(count / 1000).toFixed(1)}K`
      : `${stat.prefix}${count}${stat.suffix}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
        <svg width={radius * 2} height={radius * 2} className="absolute inset-0" style={{ transform: "rotate(-90deg)" }}>
          <circle cx={radius} cy={radius} r={nr} fill="none" stroke="rgba(255,253,249,0.12)" strokeWidth={stroke} />
          <circle
            cx={radius} cy={radius} r={nr} fill="none"
            stroke="#F5C87A" strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <span className="relative font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5C87A", fontSize: "1.1rem", fontWeight: 900 }}>
          {display}
        </span>
      </div>
      <p className="text-center text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(255,253,249,0.55)", maxWidth: "80px" }}>
        {stat.label}
      </p>
    </div>
  );
}

// ── Horizontal Certificate (floating preview) ─────────────────────────────────
function HorizontalCertificate({ producerName, adopterName }: { producerName: string; adopterName: string }) {
  const year = new Date().getFullYear();
  const displayName = adopterName.trim() || "Tu Nombre";

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: "500px",
        background: "linear-gradient(135deg, #FAF5E8 0%, #F2E8CC 50%, #EDE0BA 100%)",
        border: "2px solid rgba(139,94,42,0.40)",
        borderRadius: "12px",
        boxShadow: "0 32px 64px rgba(0,0,0,0.65)",
      }}
    >
      {/* Inner border */}
      <div className="absolute inset-2 pointer-events-none" style={{ border: "1px solid rgba(139,94,42,0.20)", borderRadius: "8px" }} />

      {/* Corner ornaments */}
      <div className="absolute top-3 left-3 w-6 h-6" style={{ borderTop: "2px solid rgba(139,94,42,0.50)", borderLeft: "2px solid rgba(139,94,42,0.50)", borderRadius: "3px 0 0 0" }} />
      <div className="absolute top-3 right-3 w-6 h-6" style={{ borderTop: "2px solid rgba(139,94,42,0.50)", borderRight: "2px solid rgba(139,94,42,0.50)", borderRadius: "0 3px 0 0" }} />
      <div className="absolute bottom-3 left-3 w-6 h-6" style={{ borderBottom: "2px solid rgba(139,94,42,0.50)", borderLeft: "2px solid rgba(139,94,42,0.50)", borderRadius: "0 0 0 3px" }} />
      <div className="absolute bottom-3 right-3 w-6 h-6" style={{ borderBottom: "2px solid rgba(139,94,42,0.50)", borderRight: "2px solid rgba(139,94,42,0.50)", borderRadius: "0 0 3px 0" }} />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.04 }}>
        <i className="ri-award-fill" style={{ fontSize: "160px", color: "#8B5E2A" }} />
      </div>

      <div className="flex" style={{ padding: "20px 26px 16px 26px" }}>
        {/* LEFT stripe */}
        <div className="flex flex-col items-center justify-between mr-5" style={{ minWidth: "48px" }}>
          <div className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(139,94,42,0.12)", border: "1.5px solid rgba(139,94,42,0.35)" }}>
              <i className="ri-award-fill" style={{ color: "#8B5E2A", fontSize: "16px" }} />
            </div>
            <div className="w-px mt-2" style={{ background: "rgba(139,94,42,0.18)", height: "55px" }} />
          </div>
          <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            <span style={{ color: "rgba(139,94,42,0.40)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              COYA · Cacao Peruano
            </span>
          </div>
        </div>

        {/* CENTER */}
        <div className="flex-1">
          <div className="mb-1.5">
            <p style={{ color: "#8B5E2A", fontSize: "8px", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.75 }}>
              Certificado de Adopción
            </p>
            <p style={{ color: "rgba(139,94,42,0.45)", fontSize: "7.5px" }}>Programa de Apadrinamiento COYA</p>
          </div>

          <div className="flex items-center gap-2 mb-2.5">
            <span className="flex-1 h-px" style={{ background: "rgba(139,94,42,0.22)" }} />
            <i className="ri-seedling-fill" style={{ color: "#8B5E2A", fontSize: "8px", opacity: 0.5 }} />
            <span className="flex-1 h-px" style={{ background: "rgba(139,94,42,0.22)" }} />
          </div>

          <p style={{ color: "rgba(62,32,12,0.50)", fontSize: "8.5px", marginBottom: "2px" }}>Este certificado acredita que</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2C1810", fontSize: "1.25rem", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.01em", marginBottom: "4px" }}>
            {displayName}
          </p>
          <p style={{ color: "rgba(62,32,12,0.62)", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.70rem", lineHeight: 1.45, marginBottom: "12px" }}>
            ha asumido con honor su compromiso de proteger y sostener a{" "}
            <span style={{ color: "#8B5E2A", fontWeight: 700 }}>{producerName}</span>,
            contribuyendo al bienestar de las familias productoras y a la preservación del cacao peruano para las generaciones futuras.
          </p>

          {/* Signatures */}
          <div className="flex items-end gap-8">
            {/* Adopter signature */}
            <div style={{ minWidth: "110px" }}>
              <div style={{ height: "26px", display: "flex", alignItems: "flex-end", marginBottom: "3px" }}>
                <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.2rem", color: "#3E200C", opacity: 0.72, lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {displayName}
                </span>
              </div>
              <div style={{ width: "100%", height: "1px", background: "rgba(62,32,12,0.28)", marginBottom: "3px" }} />
              <p style={{ color: "rgba(62,32,12,0.42)", fontSize: "7.5px" }}>Padrino / Madrina</p>
            </div>

            {/* CEO signature */}
            <div style={{ minWidth: "105px" }}>
              <div style={{ height: "26px", display: "flex", alignItems: "flex-end", marginBottom: "3px" }}>
                {/* blank — CEO firma en blanco */}
              </div>
              <div style={{ width: "100%", height: "1px", background: "rgba(139,94,42,0.32)", marginBottom: "3px" }} />
              <p style={{ color: "rgba(139,94,42,0.52)", fontSize: "7.5px" }}>CEO · COYA Cacao Peruano</p>
            </div>
          </div>
        </div>

        {/* RIGHT — official seal + year + serial */}
        <div className="flex flex-col items-end justify-between ml-4" style={{ minWidth: "60px" }}>
          {/* Official seal */}
          <div className="flex flex-col items-center" style={{ marginBottom: "6px" }}>
            <div
              style={{
                position: "relative",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "2px solid rgba(139,94,42,0.55)",
                background: "radial-gradient(circle, rgba(139,94,42,0.08) 0%, rgba(139,94,42,0.03) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Inner dashed ring */}
              <div
                style={{
                  position: "absolute",
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  border: "1px dashed rgba(139,94,42,0.35)",
                }}
              />
              <i className="ri-award-fill" style={{ color: "#8B5E2A", fontSize: "18px", position: "relative", zIndex: 1 }} />
            </div>
            <p style={{ color: "rgba(139,94,42,0.50)", fontSize: "6px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "3px", textAlign: "center" }}>
              OFICIAL
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "rgba(62,32,12,0.35)", fontSize: "7.5px" }}>Año</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#8B5E2A", fontSize: "1rem", fontWeight: 700 }}>{year}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "rgba(62,32,12,0.35)", fontSize: "7.5px" }}>Nº</p>
            <p style={{ color: "rgba(62,32,12,0.48)", fontSize: "8.5px", fontWeight: 600 }}>00523</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function NewsletterSection() {
  const { t } = useTranslation();

  const STATS: StatItem[] = [
    { target: 27,   suffix: "",  prefix: "",  label: t("adopt.stats.adopters"), pct: 27  },
    { target: 3,    suffix: "",  prefix: "",  label: t("adopt.stats.families"),  pct: 30  },
    { target: 1240, suffix: "",  prefix: "$", label: t("adopt.stats.raised"),    pct: 62  },
    { target: 100,  suffix: "%", prefix: "",  label: t("adopt.stats.direct"),    pct: 100 },
  ];

  // Newsletter state
  const [nlEmail, setNlEmail] = useState("");
  const [nlSubmitted, setNlSubmitted] = useState(false);
  const [nlLoading, setNlLoading] = useState(false);

  // Adopt state
  const [selectedProducer, setSelectedProducer] = useState<Producer>(producers[0]);
  const [amount, setAmount]       = useState(40);
  const [mode, setMode]           = useState<"monthly" | "once">("monthly");
  const [adoptSubmitted, setAdoptSubmitted] = useState(false);
  const [adoptSubmitting, setAdoptSubmitting] = useState(false);
  const [adoptEmail, setAdoptEmail] = useState("");
  const [adoptName, setAdoptName]   = useState("");
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Hover floating image state
  const [hoveredProducer, setHoveredProducer] = useState<Producer | null>(null);
  const [floatPos, setFloatPos] = useState({ x: 0, y: 0 });
  const floatRef = useRef<HTMLDivElement>(null);

  // Certificate hover state
  const [certHovered, setCertHovered] = useState(false);
  const [certPos, setCertPos] = useState({ x: 0, y: 0 });
  const certBtnRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const fw = 220;
    const fh = 280;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setFloatPos({
      x: x + 20 + fw > vw ? x - fw - 20 : x + 20,
      y: y + fh / 2 > vh ? vh - fh - 10 : Math.max(10, y - fh / 2),
    });
  }, []);

  const impact = getImpact(amount, selectedProducer);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleNlSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nlEmail) return;
    setNlLoading(true);
    try {
      await fetch("https://readdy.ai/api/form/d7877fj86jhav3jpf45g", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: nlEmail }).toString(),
      });
      setNlSubmitted(true);
    } catch { setNlSubmitted(true); }
    finally { setNlLoading(false); }
  };

  const handleAdoptSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!adoptEmail || !adoptName) return;
    setAdoptSubmitting(true);
    try {
      await fetch("https://readdy.ai/api/form/d7i1irvhkiob2r09irag", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          name: adoptName, email: adoptEmail,
          producer: selectedProducer.name, region: selectedProducer.region,
          amount: String(amount), mode: mode === "monthly" ? t("adopt.monthly") : t("adopt.once"), impact,
        }).toString(),
      });
      setAdoptSubmitted(true);
    } catch { setAdoptSubmitted(true); }
    finally { setAdoptSubmitting(false); }
  };

  return (
    <section id="contact" className="relative overflow-hidden">
      {/* Shared background video */}
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/Coya/videos/hero4.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0" style={{ background: "rgba(20,8,2,0.78)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-28 pb-10 md:pb-14">

        {/* ══ TOP: ADOPT SECTION ══════════════════════════════════════════════ */}
        <div className="mb-0">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-10 h-px" style={{ background: "#C17A5C" }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C17A5C" }}>
                {t("adopt.badge")}
              </span>
              <span className="w-10 h-px" style={{ background: "#C17A5C" }} />
            </div>
            <h2
              className="font-bold leading-tight mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3", fontSize: "clamp(2.4rem, 5vw, 3.6rem)", fontWeight: 900 }}
            >
              {t("adopt.title")} <em style={{ color: "#C17A5C", fontStyle: "italic" }}>{t("adopt.titleEm")}</em>
            </h2>
            <p className="max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(245,230,211,0.65)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
              {t("adopt.subtitle")}
            </p>
          </div>

          {/* Main grid — stats inline on the right of producers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

            {/* LEFT — Producer selector + newsletter below */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "rgba(193,122,92,0.8)" }}>
                {t("adopt.chooseProducer")}
              </p>
              {producers.map((p) => {
                const isSel = selectedProducer.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProducer(p)}
                    onMouseEnter={() => setHoveredProducer(p)}
                    onMouseLeave={() => setHoveredProducer(null)}
                    onMouseMove={handleMouseMove}
                    className="flex items-center gap-4 rounded-2xl p-4 text-left cursor-pointer transition-all duration-300 w-full"
                    style={{
                      background: isSel ? "rgba(193,122,92,0.15)" : "rgba(255,255,255,0.04)",
                      border: isSel ? "1.5px solid rgba(193,122,92,0.6)" : "1.5px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Small avatar */}
                    <div className="flex-shrink-0 rounded-xl overflow-hidden" style={{ width: "56px", height: "56px" }}>
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" style={{ objectPosition: "center 15%" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="font-bold text-base" style={{ fontFamily: "'Cormorant Garamond', serif", color: isSel ? "#F5E6D3" : "rgba(245,230,211,0.65)" }}>
                          {p.name}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(193,122,92,0.2)", color: "#C17A5C", fontWeight: 600 }}>
                          {p.region}
                        </span>
                      </div>
                      <p className="text-xs mb-1.5" style={{ color: "rgba(255,253,249,0.4)" }}>{p.role}</p>
                      <p className="text-xs mb-1.5" style={{ color: "rgba(245,200,120,0.75)" }}>
                        <i className="ri-tools-line mr-1" />{t("adopt.needs")}: {p.need}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-full overflow-hidden" style={{ height: "3px", background: "rgba(255,255,255,0.10)" }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p.progress}%`, background: "linear-gradient(90deg, #C17A5C, #F5C87A)" }} />
                        </div>
                        <span className="text-xs whitespace-nowrap" style={{ color: "rgba(255,253,249,0.35)" }}>
                          {p.progress}% · {p.adopters} {t("adopt.adopters")}
                        </span>
                      </div>
                    </div>
                    {isSel && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#C17A5C" }}>
                        <i className="ri-check-line" style={{ color: "#fff", fontSize: "13px" }} />
                      </div>
                    )}
                  </button>
                );
              })}

              {/* ── Newsletter inline below producers ── */}
              <div
                className="mt-2 rounded-2xl px-5 py-5"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,253,249,0.08)" }}
              >
                <p className="font-bold mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FFFDF9", fontSize: "1.15rem" }}>
                  {t("newsletter.title")}
                </p>
                <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(245,230,211,0.55)" }}>
                  {t("newsletter.subtitle")}
                </p>
                {nlSubmitted ? (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "rgba(255,253,249,0.08)" }}>
                    <i className="ri-checkbox-circle-line" style={{ color: "#C17A5C", fontSize: "18px" }} />
                    <p className="text-sm font-semibold" style={{ color: "#FFFDF9" }}>{t("newsletter.success")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleNlSubmit} data-readdy-form className="flex flex-col gap-2">
                    <input
                      type="email" name="email" value={nlEmail}
                      onChange={(e) => setNlEmail(e.target.value)}
                      placeholder={t("newsletter.placeholder")} required
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(255,253,249,0.08)", color: "#FFFDF9", border: "1px solid rgba(255,253,249,0.15)" }}
                    />
                    <button
                      type="submit" disabled={nlLoading}
                      className="w-full px-4 py-2.5 rounded-xl font-semibold text-sm cursor-pointer whitespace-nowrap transition-all hover:opacity-90"
                      style={{ background: "#C17A5C", color: "#FFFDF9" }}
                    >
                      {nlLoading ? <i className="ri-loader-4-line animate-spin" /> : t("newsletter.button")}
                    </button>
                    <p className="text-xs" style={{ color: "rgba(255,253,249,0.3)" }}>{t("newsletter.privacy")}</p>
                  </form>
                )}
              </div>
            </div>

            {/* RIGHT — Stats + form */}
            <div>
              {/* Compact circular stats */}
              <div
                ref={statsRef}
                className="grid grid-cols-4 gap-3 mb-5 py-5 px-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,253,249,0.08)" }}
              >
                {STATS.map((s) => <CircularStat key={s.label} stat={s} animate={statsVisible} />)}
              </div>

              {/* Mode toggle */}
              <div className="flex gap-2 mb-5">
                {(["monthly", "once"] as const).map((m) => (
                  <button key={m} onClick={() => {
                    setMode(m);
                    setAmount(m === "once" ? 200 : 40);
                  }}
                    className="flex-1 py-2.5 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap"
                    style={{
                      background: mode === m ? "#C17A5C" : "rgba(255,255,255,0.06)",
                      color: mode === m ? "#FFFDF9" : "rgba(255,253,249,0.5)",
                      border: mode === m ? "none" : "1px solid rgba(255,255,255,0.10)",
                    }}
                  >
                    {m === "monthly" ? t("adopt.monthly") : t("adopt.once")}
                  </button>
                ))}
              </div>

              {/* Amount buttons */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {(mode === "monthly" ? AMOUNTS_MONTHLY : AMOUNTS_ONCE).map((a) => (
                  <button key={a} onClick={() => setAmount(a)}
                    className="py-2.5 rounded-xl font-bold cursor-pointer transition-all duration-200 whitespace-nowrap"
                    style={{
                      background: amount === a ? "rgba(193,122,92,0.20)" : "rgba(255,255,255,0.05)",
                      border: amount === a ? "1.5px solid #C17A5C" : "1.5px solid rgba(255,255,255,0.08)",
                      color: amount === a ? "#F5C87A" : "rgba(245,230,211,0.45)",
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.1rem",
                    }}
                  >
                    ${a}
                  </button>
                ))}
              </div>

              {/* Impact card */}
              <div className="rounded-xl px-4 py-3 mb-5" style={{ background: "rgba(193,122,92,0.12)", border: "1px solid rgba(193,122,92,0.25)" }}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5" style={{ background: "rgba(193,122,92,0.25)" }}>
                    <i className="ri-seedling-line" style={{ color: "#F5C87A", fontSize: "13px" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#C17A5C" }}>{t("adopt.realImpact")}</p>
                    <p className="leading-relaxed" style={{ color: "#F5E6D3", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem" }}>{impact}</p>
                  </div>
                </div>
              </div>

              {/* Certificate hover badge */}
              <div className="relative mb-4" ref={certBtnRef}>
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-default transition-all duration-200"
                  style={{
                    background: certHovered ? "rgba(139,94,42,0.14)" : "rgba(139,94,42,0.07)",
                    border: certHovered ? "1px solid rgba(139,94,42,0.45)" : "1px solid rgba(139,94,42,0.22)",
                  }}
                  onMouseEnter={(e) => {
                    setCertHovered(true);
                    const rect = certBtnRef.current?.getBoundingClientRect();
                    if (rect) setCertPos({ x: rect.left, y: rect.top });
                  }}
                  onMouseLeave={() => setCertHovered(false)}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: "rgba(139,94,42,0.18)" }}>
                    <i className="ri-award-fill" style={{ color: "#C17A5C", fontSize: "15px" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: "#F5E6D3", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem" }}>
                      Apadrina y obtén tu reconocimiento
                    </p>
                    <p className="text-xs" style={{ color: "rgba(184,168,152,0.55)" }}>
                      Certificado oficial firmado · Pasa el mouse para verlo
                    </p>
                  </div>
                  <i className="ri-eye-line flex-shrink-0" style={{ color: "rgba(193,122,92,0.55)", fontSize: "14px" }} />
                </div>

                {/* Floating certificate — horizontal landscape */}
                {certHovered && (
                  <div
                    className="fixed pointer-events-none z-50"
                    style={{
                      left: certPos.x,
                      top: certPos.y - 175,
                      animation: "floatIn 0.20s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                  >
                    <HorizontalCertificate producerName={selectedProducer.name} adopterName={adoptName} />
                  </div>
                )}
              </div>

              {/* Adopt form */}
              {!adoptSubmitted ? (
                <form data-readdy-form id="adopt-cacaotal-form" onSubmit={handleAdoptSubmit} className="flex flex-col gap-2.5">
                  <input type="hidden" name="producer" value={selectedProducer.name} />
                  <input type="hidden" name="region"   value={selectedProducer.region} />
                  <input type="hidden" name="amount"   value={String(amount)} />
                  <input type="hidden" name="mode"     value={mode === "monthly" ? t("adopt.monthly") : t("adopt.once")} />
                  <input type="hidden" name="impact"   value={impact} />
                  <input type="text" name="name" required placeholder={t("adopt.namePlaceholder")} value={adoptName} onChange={(e) => setAdoptName(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#F5E6D3" }}
                  />
                  <input type="email" name="email" required placeholder={t("adopt.emailPlaceholder")} value={adoptEmail} onChange={(e) => setAdoptEmail(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#F5E6D3" }}
                  />
                  <button type="submit" disabled={adoptSubmitting}
                    className="w-full py-3.5 rounded-xl font-bold cursor-pointer transition-all duration-300 whitespace-nowrap"
                    style={{
                      background: adoptSubmitting ? "rgba(193,122,92,0.5)" : "linear-gradient(135deg, #C17A5C 0%, #A85E3E 100%)",
                      color: "#FFFDF9", letterSpacing: "0.06em",
                      fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem",
                    }}
                  >
                    {adoptSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <i className="ri-loader-4-line" style={{ animation: "spin 1s linear infinite" }} />{t("adopt.sending")}
                      </span>
                    ) : (
                      <><i className="ri-seedling-fill mr-2" />{mode === "monthly" ? `${t("adopt.adoptBtn")} $${amount}/${t("adopt.perMonth")}` : `${t("adopt.contributeBtn")} $${amount} ${t("adopt.now")}`}</>
                    )}
                  </button>
                </form>
              ) : (
                <div className="rounded-2xl px-6 py-6 text-center" style={{ background: "rgba(193,122,92,0.12)", border: "1px solid rgba(193,122,92,0.35)" }}>
                  <i className="ri-heart-fill mb-3 block" style={{ color: "#C17A5C", fontSize: "28px" }} />
                  <h3 className="font-bold mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3", fontSize: "1.3rem" }}>
                    {t("adopt.thankYou")}, {adoptName}!
                  </h3>
                  <p className="text-sm" style={{ color: "rgba(255,253,249,0.65)" }}>
                    {t("adopt.supportTo")} <strong style={{ color: "#C17A5C" }}>{selectedProducer.name}</strong> {t("adopt.thankYouMsg")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>


      </div>

      {/* ── Floating producer image on hover ── */}
      {hoveredProducer && (
        <div
          ref={floatRef}
          className="fixed pointer-events-none rounded-2xl overflow-hidden"
          style={{
            left: floatPos.x,
            top: floatPos.y,
            width: "220px",
            height: "280px",
            zIndex: 9999,
            animation: "floatIn 0.22s cubic-bezier(0.34,1.56,0.64,1)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(193,122,92,0.3)",
          }}
        >
          <img
            src={hoveredProducer.image}
            alt={hoveredProducer.name}
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 10%" }}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(20,8,2,0.92) 0%, rgba(20,8,2,0.1) 50%, transparent 100%)" }}
          />
          {/* Name + region */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
            <p className="font-bold leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3", fontSize: "1.2rem", fontWeight: 900 }}>
              {hoveredProducer.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,253,249,0.55)" }}>{hoveredProducer.role}</p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(193,122,92,0.85)", color: "#FFFDF9" }}>
              {hoveredProducer.region}
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes floatIn {
          from { opacity: 0; transform: scale(0.88) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </section>
  );
}
