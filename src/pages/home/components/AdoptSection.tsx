import { useState, useEffect, useRef } from "react";

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

const producers: Producer[] = [
  {
    id: "rosa",
    name: "Rosa Quispe",
    region: "Ayacucho",
    role: "Productora de cacao fino",
    image: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776563427/bf4815f8e85dba193b6a10a5167b2812_natbdl.jpg",
    need: "Balanza de precisión para fermentación",
    progress: 68,
    adopters: 14,
  },
  {
    id: "luis",
    name: "Luis Mamani",
    region: "Junín",
    role: "Maestro fermentador",
    image: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776563427/search-image_21_hqnltd.jpg",
    need: "Cajones de madera para fermentación",
    progress: 45,
    adopters: 9,
  },
  {
    id: "carmen",
    name: "Carmen Huallpa",
    region: "San Martín",
    role: "Líder de cooperativa",
    image: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776563430/search-image_20_lnh2rg.jpg",
    need: "Secadora solar para cacao",
    progress: 20,
    adopters: 4,
  },
];

const impactTiers = [
  { min: 5,   max: 14,   label: "Cubres el costo de una jornada de cosecha manual." },
  { min: 15,  max: 24,   label: "Financias una semana de fermentación artesanal." },
  { min: 25,  max: 39,   label: "Ayudas a comprar sacos de yute para el secado." },
  { min: 40,  max: 59,   label: "Contribuyes a una balanza de precisión para el proceso." },
  { min: 60,  max: 89,   label: "Financias un cajón de madera para fermentación." },
  { min: 90,  max: 119,  label: "Cubres el mantenimiento mensual de una secadora solar." },
  { min: 120, max: 199,  label: "Apoyas la compra de herramientas para toda la familia." },
  { min: 200, max: 9999, label: "Financias un mes completo de operación del cacaotal." },
];

function getImpact(amount: number, producer: Producer): string {
  const tier = impactTiers.find((t) => amount >= t.min && amount <= t.max);
  if (!tier) return "Cada sol cuenta para esta familia.";
  return `Con $${amount} para ${producer.name}: ${tier.label}`;
}

const AMOUNTS = [10, 20, 40, 60, 100, 200];

// ── Circular stat item ──────────────────────────────────────────────────────
interface StatItem {
  target: number;
  suffix: string;
  prefix: string;
  label: string;
  pct: number; // arc fill 0-100
}

const STATS: StatItem[] = [
  { target: 27,   suffix: "",   prefix: "",  label: "Adoptantes activos",      pct: 27  },
  { target: 3,    suffix: "",   prefix: "",  label: "Familias apoyadas",       pct: 30  },
  { target: 1240, suffix: "",   prefix: "$", label: "Recaudado este mes",      pct: 62  },
  { target: 100,  suffix: "%",  prefix: "",  label: "Va directo al productor", pct: 100 },
];

function CircularStat({ stat, animate }: { stat: StatItem; animate: boolean }) {
  const [count, setCount] = useState(0);
  const radius = 52;
  const stroke = 5;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const dashOffset = circumference - (circumference * (animate ? stat.pct : 0)) / 100;

  useEffect(() => {
    if (!animate) { setCount(0); return; }
    const duration = 1600;
    const steps = 60;
    const increment = stat.target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.target) {
        setCount(stat.target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [animate, stat.target]);

  const displayValue =
    stat.target >= 1000
      ? `${stat.prefix}${(count / 1000).toFixed(count >= stat.target ? 1 : 1)}K`
      : `${stat.prefix}${count}${stat.suffix}`;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Ring */}
      <div className="relative flex items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
        {/* Track */}
        <svg
          width={radius * 2}
          height={radius * 2}
          className="absolute inset-0"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke="rgba(193,122,92,0.12)"
            strokeWidth={stroke}
          />
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke="#F5C87A"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        {/* Value */}
        <span
          className="relative font-bold"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "#F5C87A",
            fontSize: "1.35rem",
            fontWeight: 900,
            letterSpacing: "-0.01em",
          }}
        >
          {displayValue}
        </span>
      </div>
      {/* Label */}
      <p
        className="text-center text-xs font-semibold tracking-widest uppercase"
        style={{ color: "rgba(184,168,152,0.6)", maxWidth: "100px" }}
      >
        {stat.label}
      </p>
    </div>
  );
}

// ── Main section ────────────────────────────────────────────────────────────
export default function AdoptSection() {
  const [selectedProducer, setSelectedProducer] = useState<Producer>(producers[0]);
  const [amount, setAmount]     = useState(40);
  const [mode, setMode]         = useState<"monthly" | "once">("monthly");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail]       = useState("");
  const [name, setName]         = useState("");
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const impact = getImpact(amount, selectedProducer);

  // Intersection observer for stats animation
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !name) return;
    setSubmitting(true);
    const body = new URLSearchParams({
      name,
      email,
      producer: selectedProducer.name,
      region: selectedProducer.region,
      amount: String(amount),
      mode: mode === "monthly" ? "Mensual" : "Pago único",
      impact,
    });
    try {
      await fetch("https://readdy.ai/api/form/d7i1irvhkiob2r09irag", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="adopta"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: "#1A0D06" }}
    >
      {/* Texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(https://res.cloudinary.com/djfmngyl0/image/upload/v1776560424/search-image_3_j5xccy.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.08,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(193,122,92,0.10) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">

        {/* ── HEADER ── */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-10 h-px" style={{ background: "#C17A5C" }} />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#C17A5C", fontFamily: "'Cormorant Garamond', serif" }}
            >
              Impacto real
            </span>
            <span className="w-10 h-px" style={{ background: "#C17A5C" }} />
          </div>
          <h2
            className="font-bold leading-tight mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#F5E6D3",
              fontSize: "clamp(2.6rem, 5vw, 4rem)",
              fontWeight: 900,
            }}
          >
            Adopta un{" "}
            <em style={{ color: "#C17A5C", fontStyle: "italic" }}>Cacaotal</em>
          </h2>
          <p
            className="max-w-xl mx-auto leading-relaxed"
            style={{ color: "rgba(184,168,152,0.75)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem" }}
          >
            "No adoptas un cacaotal. Te conviertes en parte de su historia."
            <br />
            <span style={{ color: "rgba(184,168,152,0.5)", fontSize: "0.95rem" }}>
              No es caridad. Es una relación humana real.
            </span>
          </p>
        </div>

        {/* ── CIRCULAR STATS ── */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14 py-10 px-6 rounded-3xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(193,122,92,0.14)",
          }}
        >
          {STATS.map((s) => (
            <CircularStat key={s.label} stat={s} animate={statsVisible} />
          ))}
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* LEFT — Producer selector */}
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ color: "rgba(193,122,92,0.7)" }}
            >
              Elige a quién apoyar
            </p>
            <div className="flex flex-col gap-4">
              {producers.map((p) => {
                const isSelected = selectedProducer.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProducer(p)}
                    className="flex items-center gap-4 rounded-2xl p-4 text-left cursor-pointer transition-all duration-300 w-full"
                    style={{
                      background: isSelected ? "rgba(193,122,92,0.12)" : "rgba(255,255,255,0.03)",
                      border: isSelected ? "1.5px solid rgba(193,122,92,0.55)" : "1.5px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      className="flex-shrink-0 rounded-xl overflow-hidden"
                      style={{ width: "96px", height: "96px" }}
                    >
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="font-bold text-base"
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            color: isSelected ? "#F5E6D3" : "rgba(245,230,211,0.6)",
                          }}
                        >
                          {p.name}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(193,122,92,0.18)", color: "#C17A5C", fontWeight: 600 }}
                        >
                          {p.region}
                        </span>
                      </div>
                      <p className="text-xs mb-2" style={{ color: "rgba(184,168,152,0.55)" }}>{p.role}</p>
                      <p className="text-xs mb-2" style={{ color: "rgba(245,200,120,0.75)" }}>
                        <i className="ri-tools-line mr-1" />
                        Necesita: {p.need}
                      </p>
                      <div className="flex items-center gap-2">
                        <div
                          className="flex-1 rounded-full overflow-hidden"
                          style={{ height: "4px", background: "rgba(255,255,255,0.08)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${p.progress}%`,
                              background: "linear-gradient(90deg, #C17A5C, #F5C87A)",
                            }}
                          />
                        </div>
                        <span className="text-xs whitespace-nowrap" style={{ color: "rgba(184,168,152,0.5)" }}>
                          {p.progress}% · {p.adopters} adoptantes
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: "#C17A5C" }}
                      >
                        <i className="ri-check-line" style={{ color: "#fff", fontSize: "13px" }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT — Producer photo + form */}
          <div>
            {/* ── Producer hero photo ── */}
            <div
              className="relative w-full rounded-2xl overflow-hidden mb-7"
              style={{ height: "260px" }}
            >
              {producers.map((p) => (
                <div
                  key={p.id}
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ opacity: selectedProducer.id === p.id ? 1 : 0 }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center 20%" }}
                  />
                  {/* Gradient overlay bottom */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, rgba(26,13,6,0.95) 0%, rgba(26,13,6,0.3) 50%, transparent 100%)",
                    }}
                  />
                  {/* Name + region badge */}
                  <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p
                          className="font-bold leading-tight"
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            color: "#F5E6D3",
                            fontSize: "1.6rem",
                            fontWeight: 900,
                          }}
                        >
                          {p.name}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(184,168,152,0.75)" }}>
                          {p.role}
                        </p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                        style={{ background: "rgba(193,122,92,0.85)", color: "#FFFDF9" }}
                      >
                        {p.region}
                      </span>
                    </div>
                    {/* Need tag */}
                    <div
                      className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl"
                      style={{ background: "rgba(245,200,120,0.10)", border: "1px solid rgba(245,200,120,0.2)" }}
                    >
                      <i className="ri-tools-line" style={{ color: "#F5C87A", fontSize: "13px" }} />
                      <span className="text-xs" style={{ color: "rgba(245,200,120,0.85)" }}>
                        Necesita: {p.need}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mode toggle */}
            <div className="flex gap-2 mb-7">
              {(["monthly", "once"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="flex-1 py-2.5 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap"
                  style={{
                    background: mode === m ? "#C17A5C" : "rgba(255,255,255,0.05)",
                    color: mode === m ? "#FFFDF9" : "rgba(184,168,152,0.6)",
                    border: mode === m ? "none" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {m === "monthly" ? "Mensual" : "Pago único"}
                </button>
              ))}
            </div>

            {/* Amount selector */}
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: "rgba(193,122,92,0.7)" }}
            >
              Elige tu aporte (USD)
            </p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className="py-3 rounded-xl font-bold cursor-pointer transition-all duration-200 whitespace-nowrap"
                  style={{
                    background: amount === a ? "rgba(193,122,92,0.18)" : "rgba(255,255,255,0.04)",
                    border: amount === a ? "1.5px solid #C17A5C" : "1.5px solid rgba(255,255,255,0.07)",
                    color: amount === a ? "#F5C87A" : "rgba(245,230,211,0.55)",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.2rem",
                  }}
                >
                  ${a}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3 mb-6"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span style={{ color: "rgba(184,168,152,0.5)", fontSize: "0.9rem" }}>Otro monto:</span>
              <span style={{ color: "#C17A5C", fontWeight: 700 }}>$</span>
              <input
                type="number"
                min={5}
                max={9999}
                value={amount}
                onChange={(e) => setAmount(Math.max(5, Number(e.target.value)))}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "#F5E6D3" }}
              />
            </div>

            {/* Impact card */}
            <div
              className="rounded-2xl px-5 py-4 mb-7"
              style={{
                background: "rgba(193,122,92,0.10)",
                border: "1px solid rgba(193,122,92,0.28)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                  style={{ background: "rgba(193,122,92,0.25)" }}
                >
                  <i className="ri-seedling-line" style={{ color: "#F5C87A", fontSize: "15px" }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#C17A5C" }}>
                    Tu impacto real
                  </p>
                  <p
                    className="leading-relaxed"
                    style={{ color: "#F5E6D3", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}
                  >
                    {impact}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            {!submitted ? (
              <form
                data-readdy-form
                id="adopt-cacaotal-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-3"
              >
                <input type="hidden" name="producer" value={selectedProducer.name} />
                <input type="hidden" name="region"   value={selectedProducer.region} />
                <input type="hidden" name="amount"   value={String(amount)} />
                <input type="hidden" name="mode"     value={mode === "monthly" ? "Mensual" : "Pago único"} />
                <input type="hidden" name="impact"   value={impact} />

                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "#F5E6D3",
                  }}
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "#F5E6D3",
                  }}
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl font-bold cursor-pointer transition-all duration-300 whitespace-nowrap"
                  style={{
                    background: submitting
                      ? "rgba(193,122,92,0.5)"
                      : "linear-gradient(135deg, #C17A5C 0%, #A85E3E 100%)",
                    color: "#FFFDF9",
                    letterSpacing: "0.06em",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.05rem",
                  }}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="ri-loader-4-line" style={{ animation: "spin 1s linear infinite" }} />
                      Enviando...
                    </span>
                  ) : (
                    <>
                      <i className="ri-seedling-fill mr-2" />
                      {mode === "monthly" ? `Adoptar por $${amount}/mes` : `Contribuir $${amount} ahora`}
                    </>
                  )}
                </button>

                <p className="text-center text-xs" style={{ color: "rgba(184,168,152,0.4)" }}>
                  Te contactaremos para coordinar el pago y enviarte actualizaciones de {selectedProducer.name}.
                </p>
              </form>
            ) : (
              <div
                className="rounded-2xl px-6 py-8 text-center"
                style={{
                  background: "rgba(193,122,92,0.10)",
                  border: "1px solid rgba(193,122,92,0.35)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(193,122,92,0.2)" }}
                >
                  <i className="ri-heart-fill" style={{ color: "#C17A5C", fontSize: "24px" }} />
                </div>
                <h3
                  className="font-bold mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3", fontSize: "1.4rem" }}
                >
                  ¡Gracias, {name}!
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(184,168,152,0.75)" }}>
                  Tu apoyo a{" "}
                  <strong style={{ color: "#C17A5C" }}>{selectedProducer.name}</strong> ya está registrado.
                  Te escribiremos pronto con los detalles y las primeras actualizaciones de su cacaotal.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
