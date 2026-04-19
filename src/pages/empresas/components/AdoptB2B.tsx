import { useState, useEffect, useRef, useCallback } from "react";
import { B2BLang, ADOPT_TEXTS } from "../i18n";

interface AdoptB2BProps { lang: B2BLang; }

interface Cacaotal {
  id: string; name: string; region: string; producer: string;
  hectares: number; trees: number; image: string; producerImage: string;
  story: string; need: string; progress: number; sponsors: number;
}

const cacaotales: Cacaotal[] = [
  {
    id: "convención",
    name: "Cacaotal Valle de La Convención",
    region: "Cusco",
    producer: "Cooperativa Chuncho",
    hectares: 4.2, trees: 1680,
    image: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776578026/search-image_36_kact9a.jpg",
    producerImage: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776562288/e566784c4facd4b64142124357f929e5_it041c.jpg",
    story: "4.2 hectáreas de cacao Chuncho nativo en el Valle de La Convención. Una de las variedades más raras y apreciadas del mundo, en peligro de extinción. Tu adopción financia la preservación genética y el trabajo de 12 familias.",
    need: "Sistema de riego tecnificado y laboratorio de fermentación",
    progress: 42, sponsors: 8,
  },
  {
    id: "junin",
    name: "Cacaotal Selva Central",
    region: "Junín",
    producer: "Asociación Mamani",
    hectares: 6.8, trees: 2720,
    image: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776578027/b014dfc01bd98300d0cedcd650616533_xbsr3z.jpg",
    producerImage: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776560919/search-image_13_lnyasf.jpg",
    story: "6.8 hectáreas en la Selva Central de Junín. Cacao orgánico certificado con técnicas de agroforestería que preservan la biodiversidad local. 18 familias dependen directamente de este cacaotal.",
    need: "Cajones de fermentación y secadoras solares",
    progress: 28, sponsors: 5,
  },
  {
    id: "ucayali",
    name: "Cacaotal Ribereño Ucayali",
    region: "Ucayali",
    producer: "Cooperativa Carmen Flores",
    hectares: 3.5, trees: 1400,
    image: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776578027/search-image_37_femwi5.jpg",
    producerImage: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776560358/ee55c184022846a6fa648e52e7cfb174_1_kbkxqz.jpg",
    story: "3.5 hectáreas a orillas del río Ucayali. Manteca de cacao prensada en frío de calidad cosmética. La cooperativa de Carmen Flores ya llevó agua potable a su comunidad. Tu adopción financia la siguiente fase: energía solar.",
    need: "Paneles solares y prensa de frío para manteca",
    progress: 65, sponsors: 14,
  },
];

const AMOUNTS_MONTHLY = [100, 250, 500, 1000, 2500, 5000];
const AMOUNTS_ANNUAL  = [300, 500, 1000, 2500, 5000, 10000];

const impactTiersB2B = [
  { min: 100,  max: 249,  label: "Cubre el mantenimiento mensual de 50 árboles de cacao." },
  { min: 250,  max: 499,  label: "Financia la fermentación de una cosecha completa." },
  { min: 500,  max: 999,  label: "Instala un sistema de riego para media hectárea." },
  { min: 1000, max: 2499, label: "Financia una secadora solar para toda la cooperativa." },
  { min: 2500, max: 4999, label: "Cubre la operación anual de una hectárea completa." },
  { min: 5000, max: 99999, label: "Transforma completamente la infraestructura del cacaotal." },
];

function getB2BImpact(amount: number, cacaotal: Cacaotal): string {
  const tier = impactTiersB2B.find((t) => amount >= t.min && amount <= t.max);
  if (!tier) return "Cada aporte transforma directamente este cacaotal.";
  return `Con $${amount.toLocaleString()} para ${cacaotal.name}: ${tier.label}`;
}

const PERK_ICONS = ["ri-file-chart-line", "ri-map-pin-line", "ri-award-line", "ri-box-3-line"];

// ─── Floating perk preview cards ─────────────────────────────────────────────
function PerkPreview({ index, cacaotalName }: { index: number; cacaotalName: string }) {
  const year = new Date().getFullYear();

  if (index === 0) {
    return null;
  }

  if (index === 1) {
    // Farm visit preview
    return (
      <div className="w-60 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(160deg, #1A0D06 0%, #2C1810 100%)", border: "1px solid rgba(193,122,92,0.40)" }}>
        <div className="relative" style={{ height: "130px" }}>
          <img
            src="https://res.cloudinary.com/djfmngyl0/image/upload/v1776577674/4b98cd626c8ab8fc4d96bbd7e93ea21a_fj7xov.jpg"
            alt="Visita al cacaotal"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,13,6,0.85) 0%, transparent 60%)" }} />
          <div className="absolute bottom-3 left-3">
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "rgba(193,122,92,0.85)", color: "#FFFDF9" }}>
              Invitación anual incluida
            </span>
          </div>
        </div>
        <div className="px-4 py-3">
          <p className="font-bold mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3", fontSize: "1rem" }}>
            Visita al Cacaotal
          </p>
          <p className="text-xs mb-3" style={{ color: "rgba(184,168,152,0.55)" }}>Experiencia inmersiva en {cacaotalName}</p>
          {[
            { icon: "ri-map-pin-line", text: "Traslado desde Lima incluido" },
            { icon: "ri-group-line", text: "Reunión con productores" },
            { icon: "ri-camera-line", text: "Sesión fotográfica para RSE" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 mb-1.5">
              <i className={item.icon} style={{ color: "#C17A5C", fontSize: "11px", flexShrink: 0 }} />
              <span className="text-xs" style={{ color: "rgba(184,168,152,0.65)" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (index === 2) {
    // Certificate preview — horizontal landscape format, like a real certificate
    return (
      <div
        className="relative overflow-hidden"
        style={{
          width: "520px",
          background: "linear-gradient(135deg, #FAF5E8 0%, #F2E8CC 50%, #EDE0BA 100%)",
          border: "2px solid rgba(139,94,42,0.40)",
          borderRadius: "12px",
          boxShadow: "0 32px 64px rgba(0,0,0,0.55)",
        }}
      >
        {/* Outer decorative border */}
        <div className="absolute inset-2 pointer-events-none" style={{ border: "1px solid rgba(139,94,42,0.22)", borderRadius: "8px" }} />

        {/* Corner ornaments */}
        <div className="absolute top-3 left-3 w-7 h-7" style={{ borderTop: "2px solid rgba(139,94,42,0.50)", borderLeft: "2px solid rgba(139,94,42,0.50)", borderRadius: "3px 0 0 0" }} />
        <div className="absolute top-3 right-3 w-7 h-7" style={{ borderTop: "2px solid rgba(139,94,42,0.50)", borderRight: "2px solid rgba(139,94,42,0.50)", borderRadius: "0 3px 0 0" }} />
        <div className="absolute bottom-3 left-3 w-7 h-7" style={{ borderBottom: "2px solid rgba(139,94,42,0.50)", borderLeft: "2px solid rgba(139,94,42,0.50)", borderRadius: "0 0 0 3px" }} />
        <div className="absolute bottom-3 right-3 w-7 h-7" style={{ borderBottom: "2px solid rgba(139,94,42,0.50)", borderRight: "2px solid rgba(139,94,42,0.50)", borderRadius: "0 0 3px 0" }} />

        {/* Watermark seal */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.04 }}>
          <i className="ri-award-fill" style={{ fontSize: "180px", color: "#8B5E2A" }} />
        </div>

        <div className="flex" style={{ padding: "22px 28px 18px 28px" }}>
          {/* LEFT stripe — seal + vertical label */}
          <div className="flex flex-col items-center justify-between mr-5" style={{ minWidth: "52px" }}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(139,94,42,0.12)", border: "1.5px solid rgba(139,94,42,0.35)" }}>
                <i className="ri-award-fill" style={{ color: "#8B5E2A", fontSize: "18px" }} />
              </div>
              <div className="w-px flex-1 mt-2" style={{ background: "rgba(139,94,42,0.18)", minHeight: "60px" }} />
            </div>
            <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
              <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(139,94,42,0.45)", fontSize: "9px" }}>
                COYA · Cacao Peruano
              </span>
            </div>
          </div>

          {/* CENTER — main content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-2">
              <p className="font-bold tracking-[0.28em] uppercase" style={{ color: "#8B5E2A", fontSize: "9px", opacity: 0.75 }}>
                Certificado de Adopción
              </p>
              <p style={{ color: "rgba(139,94,42,0.45)", fontSize: "8px" }}>Programa Empresarial COYA</p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2 mb-3">
              <span className="flex-1 h-px" style={{ background: "rgba(139,94,42,0.22)" }} />
              <i className="ri-seedling-fill" style={{ color: "#8B5E2A", fontSize: "9px", opacity: 0.5 }} />
              <span className="flex-1 h-px" style={{ background: "rgba(139,94,42,0.22)" }} />
            </div>

            {/* Acredita que */}
            <p style={{ color: "rgba(62,32,12,0.50)", fontSize: "9px", marginBottom: "2px" }}>Este certificado acredita que</p>
            <p
              className="font-black leading-tight mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2C1810", fontSize: "1.35rem", letterSpacing: "-0.01em" }}
            >
              Tu Empresa S.A.
            </p>
            <p
              className="leading-snug mb-3"
              style={{ color: "rgba(62,32,12,0.62)", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.72rem" }}
            >
              ha asumido con honor su responsabilidad social al proteger y sostener el{" "}
              <span style={{ color: "#8B5E2A", fontWeight: 700 }}>{cacaotalName}</span>,
              contribuyendo al bienestar de las familias productoras y a la preservación del cacao peruano para las generaciones futuras.
            </p>

            {/* Signatures row */}
            <div className="flex items-end gap-6 mt-1">
              {/* Signature 1 — Empresa adoptante */}
              <div className="flex flex-col items-start" style={{ minWidth: "120px" }}>
                <div className="mb-1" style={{ height: "28px", display: "flex", alignItems: "flex-end" }}>
                  <span
                    style={{
                      fontFamily: "'Dancing Script', cursive",
                      fontSize: "1.3rem",
                      color: "#3E200C",
                      opacity: 0.75,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Tu Empresa S.A.
                  </span>
                </div>
                <div className="w-full h-px mb-1" style={{ background: "rgba(62,32,12,0.30)" }} />
                <p style={{ color: "rgba(62,32,12,0.45)", fontSize: "8px" }}>Empresa Adoptante</p>
              </div>

              {/* Signature 2 — CEO COYA */}
              <div className="flex flex-col items-start" style={{ minWidth: "110px" }}>
                <div className="mb-1" style={{ height: "28px", display: "flex", alignItems: "flex-end" }}>
                  {/* blank line for CEO signature */}
                </div>
                <div className="w-full h-px mb-1" style={{ background: "rgba(139,94,42,0.35)" }} />
                <p style={{ color: "rgba(139,94,42,0.55)", fontSize: "8px" }}>CEO · COYA Cacao Peruano</p>
              </div>
            </div>
          </div>

          {/* RIGHT — official seal + year + serial */}
          <div className="flex flex-col items-end justify-between ml-4" style={{ minWidth: "64px" }}>
            {/* Official seal */}
            <div className="flex flex-col items-center" style={{ marginBottom: "6px" }}>
              <div
                className="relative flex items-center justify-center"
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  border: "2px solid rgba(139,94,42,0.55)",
                  background: "radial-gradient(circle, rgba(139,94,42,0.08) 0%, rgba(139,94,42,0.03) 100%)",
                }}
              >
                {/* Inner ring */}
                <div
                  className="absolute"
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    border: "1px dashed rgba(139,94,42,0.35)",
                  }}
                />
                <i className="ri-award-fill relative z-10" style={{ color: "#8B5E2A", fontSize: "20px" }} />
              </div>
              <p style={{ color: "rgba(139,94,42,0.50)", fontSize: "6.5px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "3px", textAlign: "center" }}>
                OFICIAL
              </p>
            </div>
            <div className="text-right">
              <p style={{ color: "rgba(62,32,12,0.35)", fontSize: "8px" }}>Año</p>
              <p className="font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#8B5E2A", fontSize: "1rem" }}>{year}</p>
            </div>
            <div className="text-right">
              <p style={{ color: "rgba(62,32,12,0.35)", fontSize: "8px" }}>Nº</p>
              <p className="font-semibold" style={{ color: "rgba(62,32,12,0.50)", fontSize: "9px" }}>00523</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // index === 3 — Welcome box preview
  return (
    <div className="w-60 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(160deg, #1A0D06 0%, #2C1810 100%)", border: "1px solid rgba(193,122,92,0.40)" }}>
      <div className="relative" style={{ height: "130px" }}>
        <img
          src="https://res.cloudinary.com/djfmngyl0/image/upload/v1776577677/bb529ff98f5be78c6a782069c3eabe00_nzki3j.jpg"
          alt="Caja de bienvenida"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,13,6,0.85) 0%, transparent 60%)" }} />
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "rgba(74,124,89,0.85)", color: "#FFFDF9" }}>
            Envío incluido
          </span>
        </div>
      </div>
      <div className="px-4 py-3">
        <p className="font-bold mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3", fontSize: "1rem" }}>
          Caja de Bienvenida
        </p>
        <p className="text-xs mb-3" style={{ color: "rgba(184,168,152,0.55)" }}>Productos del {cacaotalName}</p>
        {[
          { icon: "ri-cake-3-line", text: "Chocolate negro 85% · 6 uds" },
          { icon: "ri-leaf-line", text: "Nibs tostados artesanales · 200g" },
          { icon: "ri-cup-line", text: "Cacao ceremonial · 100g" },
          { icon: "ri-file-text-line", text: "Carta del productor" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-2 mb-1.5">
            <i className={item.icon} style={{ color: "#C17A5C", fontSize: "11px", flexShrink: 0 }} />
            <span className="text-xs" style={{ color: "rgba(184,168,152,0.65)" }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdoptB2B({ lang }: AdoptB2BProps) {
  const t = ADOPT_TEXTS[lang];
  const [selected, setSelected] = useState<Cacaotal>(cacaotales[0]);
  const [amount, setAmount] = useState(500);
  const [mode, setMode] = useState<"monthly" | "annual">("monthly");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Floating producer photo on hover
  const [hoveredCacaotal, setHoveredCacaotal] = useState<Cacaotal | null>(null);
  const [floatPos, setFloatPos] = useState({ x: 0, y: 0 });
  const listRef = useRef<HTMLDivElement>(null);

  // Floating perk preview on hover
  const [hoveredPerk, setHoveredPerk] = useState<number | null>(null);
  const [perkPos, setPerkPos] = useState({ x: 0, y: 0 });
  const perksRef = useRef<HTMLDivElement>(null);

  const handleCardMouseMove = useCallback((e: React.MouseEvent, c: Cacaotal) => {
    setHoveredCacaotal(c);
    const rect = listRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Position relative to the list container
    setFloatPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const minAmount = mode === "annual" ? 300 : 100;
  const AMOUNTS_B2B = mode === "annual" ? AMOUNTS_ANNUAL : AMOUNTS_MONTHLY;

  useEffect(() => {
    if (mode === "annual" && amount < 300) setAmount(300);
  }, [mode]);

  const impact = getB2BImpact(amount, selected);
  const annualTotal = mode === "annual" ? amount * 10 : amount * 12;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !company) return;
    setSubmitting(true);
    const body = new URLSearchParams({ name, email, company, cacaotal: selected.name, region: selected.region, amount: String(amount), mode: mode === "monthly" ? "Mensual" : "Anual", impact });
    try {
      await fetch("https://readdy.ai/api/form/d7i5b5gi2k4pviviqtm0", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
    } catch { /* silent */ }
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <section id="adopta-b2b" className="py-16 md:py-24 relative overflow-hidden" style={{ background: "#1A0D06" }}>
      {/* Texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(https://res.cloudinary.com/djfmngyl0/image/upload/v1776560424/search-image_3_j5xccy.jpg)",
          backgroundSize: "cover",
          opacity: 0.22,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-10 h-px" style={{ background: "#C17A5C" }} />
            <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#C17A5C" }}>{t.badge}</span>
            <span className="w-10 h-px" style={{ background: "#C17A5C" }} />
          </div>
          <h2 className="font-black mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3", fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)" }}>
            {t.title}{" "}
            <em style={{ color: "#C17A5C", fontStyle: "italic" }}>{t.titleEm}</em>
            {" "}{t.titleSuffix}
          </h2>
          <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: "rgba(184,168,152,0.70)" }}>
            {t.subtitle}{" "}
            <strong style={{ color: "#C17A5C" }}>{t.minMonthly}</strong> {lang === "es" ? "o" : lang === "de" ? "oder" : lang === "cs" ? "nebo" : "or"}{" "}
            <strong style={{ color: "#C17A5C" }}>{t.minAnnual}</strong>.
          </p>
        </div>

        {/* Perks row */}
        <div ref={perksRef} className="relative grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
          {t.perks.map((p, i) => (
            <div
              key={p.title}
              className="rounded-xl px-4 py-4 flex flex-col gap-2 cursor-default transition-all"
              style={{
                background: hoveredPerk === i ? "rgba(193,122,92,0.10)" : "rgba(255,255,255,0.03)",
                border: hoveredPerk === i ? "1px solid rgba(193,122,92,0.35)" : "1px solid rgba(193,122,92,0.14)",
              }}
              onMouseEnter={(e) => {
                setHoveredPerk(i);
                const rect = perksRef.current?.getBoundingClientRect();
                if (!rect) return;
                setPerkPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
              }}
              onMouseMove={(e) => {
                const rect = perksRef.current?.getBoundingClientRect();
                if (!rect) return;
                setPerkPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
              }}
              onMouseLeave={() => setHoveredPerk(null)}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full" style={{ background: "rgba(193,122,92,0.15)" }}>
                <i className={PERK_ICONS[i]} style={{ color: "#C17A5C", fontSize: "15px" }} />
              </div>
              <p className="font-semibold text-sm" style={{ color: "#F5E6D3" }}>{p.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(184,168,152,0.55)" }}>{p.desc}</p>
            </div>
          ))}

          {/* Floating perk preview */}
          {hoveredPerk !== null && hoveredPerk !== 0 && (
            <div
              className="pointer-events-none absolute z-50"
              style={{
                // For certificate (index 2) use centered-above positioning; others follow cursor
                left: hoveredPerk === 2 ? "50%" : perkPos.x + 16,
                top: hoveredPerk === 2 ? -10 : perkPos.y - 180,
                transform: hoveredPerk === 2 ? "translate(-50%, -100%)" : "none",
                filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.65))",
                transition: "opacity 0.18s ease",
                opacity: 1,
              }}
            >
              <PerkPreview index={hoveredPerk} cacaotalName={selected.name} />
            </div>
          )}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* LEFT — Cacaotal selector */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "rgba(193,122,92,0.7)" }}>
              {t.chooseCacaotal}
            </p>
            {/* Cacaotal list — relative container for the floating photo */}
            <div ref={listRef} className="relative flex flex-col gap-4 mb-8">
              {cacaotales.map((c) => {
                const isSel = selected.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    onMouseMove={(e) => handleCardMouseMove(e, c)}
                    onMouseLeave={() => setHoveredCacaotal(null)}
                    className="flex items-start gap-4 rounded-2xl p-4 text-left cursor-pointer transition-all w-full"
                    style={{
                      background: isSel ? "rgba(193,122,92,0.12)" : "rgba(255,255,255,0.03)",
                      border: isSel ? "1.5px solid rgba(193,122,92,0.55)" : "1.5px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex-shrink-0 rounded-xl overflow-hidden" style={{ width: "80px", height: "80px" }}>
                      <img src={c.producerImage} alt={c.producer} className="w-full h-full object-cover object-top" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="font-bold text-sm" style={{ fontFamily: "'Cormorant Garamond', serif", color: isSel ? "#F5E6D3" : "rgba(245,230,211,0.55)" }}>
                          {c.name}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: "rgba(193,122,92,0.18)", color: "#C17A5C", fontWeight: 600 }}>
                          {c.region}
                        </span>
                      </div>
                      <p className="text-xs mb-1" style={{ color: "rgba(184,168,152,0.50)" }}>
                        {c.hectares} {t.ha} · {c.trees.toLocaleString()} {t.trees} · {c.producer}
                      </p>
                      <p className="text-xs mb-2" style={{ color: "rgba(245,200,120,0.70)" }}>
                        <i className="ri-tools-line mr-1" />{t.need}: {c.need}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-full overflow-hidden" style={{ height: "3px", background: "rgba(255,255,255,0.08)" }}>
                          <div className="h-full rounded-full" style={{ width: `${c.progress}%`, background: "linear-gradient(90deg, #C17A5C, #F5C87A)" }} />
                        </div>
                        <span className="text-xs whitespace-nowrap" style={{ color: "rgba(184,168,152,0.45)" }}>
                          {c.progress}% · {c.sponsors} {t.companies}
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

              {/* Floating producer photo — follows cursor */}
              {hoveredCacaotal && (
                <div
                  className="pointer-events-none absolute z-50"
                  style={{
                    left: floatPos.x + 20,
                    top: floatPos.y - 100,
                    width: "200px",
                    transition: "opacity 0.2s ease",
                    opacity: 1,
                  }}
                >
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      border: "1.5px solid rgba(193,122,92,0.50)",
                      background: "rgba(20,8,2,0.92)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {/* Photo */}
                    <div style={{ height: "220px" }}>
                      <img
                        src={hoveredCacaotal.producerImage}
                        alt={hoveredCacaotal.producer}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    {/* Info */}
                    <div
                      className="px-3 py-3"
                      style={{ background: "linear-gradient(to bottom, rgba(20,8,2,0.0) 0%, rgba(20,8,2,1) 100%)" }}
                    >
                      <p
                        className="font-bold leading-tight mb-0.5"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5C87A", fontSize: "1rem" }}
                      >
                        {hoveredCacaotal.producer}
                      </p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full inline-block"
                        style={{ background: "rgba(193,122,92,0.22)", color: "#C17A5C", fontWeight: 600 }}
                      >
                        {hoveredCacaotal.region}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cacaotal hero image */}
            <div ref={imgRef} className="relative w-full rounded-2xl overflow-hidden" style={{ height: "220px" }}>
              {cacaotales.map((c) => (
                <div key={c.id} className="absolute inset-0 transition-opacity duration-500" style={{ opacity: selected.id === c.id ? 1 : 0 }}>
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,13,6,0.90) 0%, rgba(26,13,6,0.20) 60%, transparent 100%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
                    <p className="font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3", fontSize: "1.2rem" }}>{c.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(184,168,152,0.70)" }}>{c.story.slice(0, 100)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Form */}
          <div>
            {/* Mode toggle */}
            <div className="flex gap-2 mb-6">
              {(["monthly", "annual"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className="flex-1 py-2.5 rounded-full text-sm font-semibold cursor-pointer transition-all whitespace-nowrap"
                  style={{ background: mode === m ? "#C17A5C" : "rgba(255,255,255,0.05)", color: mode === m ? "#FFFDF9" : "rgba(184,168,152,0.6)", border: mode === m ? "none" : "1px solid rgba(255,255,255,0.08)" }}
                >
                  {m === "monthly" ? t.monthly : t.annual}
                </button>
              ))}
            </div>

            {/* Amount selector */}
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "rgba(193,122,92,0.7)" }}>
              {t.amountLabel(mode, minAmount)}
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {AMOUNTS_B2B.map((a) => (
                <button key={a} onClick={() => setAmount(a)}
                  className="py-3 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap"
                  style={{ background: amount === a ? "rgba(193,122,92,0.18)" : "rgba(255,255,255,0.04)", border: amount === a ? "1.5px solid #C17A5C" : "1.5px solid rgba(255,255,255,0.07)", color: amount === a ? "#F5C87A" : "rgba(245,230,211,0.50)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}
                >
                  ${a.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ color: "rgba(184,168,152,0.5)", fontSize: "0.9rem" }}>{t.customAmount}</span>
              <span style={{ color: "#C17A5C", fontWeight: 700 }}>$</span>
              <input type="number" min={minAmount} max={99999} value={amount}
                onChange={(e) => setAmount(Math.max(minAmount, Number(e.target.value)))}
                className="flex-1 bg-transparent outline-none text-sm" style={{ color: "#F5E6D3" }} />
            </div>

            {/* Annual summary */}
            {mode === "annual" && (
              <div className="rounded-xl px-4 py-3 mb-5 flex items-center justify-between" style={{ background: "rgba(168,197,160,0.08)", border: "1px solid rgba(168,197,160,0.20)" }}>
                <span className="text-xs" style={{ color: "rgba(168,197,160,0.80)" }}>{t.annualTotal}</span>
                <span className="font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#A8C5A0", fontSize: "1.2rem" }}>
                  ${annualTotal.toLocaleString()} {t.annualTotalLabel}
                </span>
              </div>
            )}

            {/* Impact card */}
            <div className="rounded-2xl px-5 py-4 mb-6" style={{ background: "rgba(193,122,92,0.10)", border: "1px solid rgba(193,122,92,0.28)" }}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5" style={{ background: "rgba(193,122,92,0.25)" }}>
                  <i className="ri-seedling-line" style={{ color: "#F5C87A", fontSize: "15px" }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#C17A5C" }}>{t.impactLabel}</p>
                  <p className="leading-relaxed" style={{ color: "#F5E6D3", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem" }}>{impact}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            {!submitted ? (
              <form data-readdy-form id="adopt-b2b-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input type="hidden" name="cacaotal" value={selected.name} />
                <input type="hidden" name="region" value={selected.region} />
                <input type="hidden" name="amount" value={String(amount)} />
                <input type="hidden" name="mode" value={mode === "monthly" ? "Mensual" : "Anual"} />
                <input type="hidden" name="impact" value={impact} />
                <input type="text" name="name" required placeholder={t.namePh} value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "#F5E6D3" }} />
                <input type="email" name="email" required placeholder={t.emailPh} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "#F5E6D3" }} />
                <input type="text" name="company" required placeholder={t.companyPh} value={company} onChange={(e) => setCompany(e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "#F5E6D3" }} />
                <button type="submit" disabled={submitting}
                  className="w-full py-4 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap"
                  style={{ background: submitting ? "rgba(193,122,92,0.5)" : "linear-gradient(135deg, #C17A5C 0%, #A85E3E 100%)", color: "#FFFDF9", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem" }}
                >
                  {submitting ? t.sending : (
                    <>
                      <i className="ri-seedling-fill mr-2" />
                      {mode === "monthly" ? t.adoptMonthly(amount) : t.adoptAnnual(annualTotal)}
                    </>
                  )}
                </button>
                <p className="text-center text-xs" style={{ color: "rgba(184,168,152,0.40)" }}>{t.contactNote}</p>
              </form>
            ) : (
              <div className="rounded-2xl px-6 py-8 text-center" style={{ background: "rgba(193,122,92,0.10)", border: "1px solid rgba(193,122,92,0.35)" }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(193,122,92,0.2)" }}>
                  <i className="ri-heart-fill" style={{ color: "#C17A5C", fontSize: "24px" }} />
                </div>
                <h3 className="font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3", fontSize: "1.4rem" }}>
                  {t.thankYou(company)}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(184,168,152,0.75)" }}>
                  {t.thankYouMsg(selected.name)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
