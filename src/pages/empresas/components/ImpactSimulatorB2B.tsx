import { useState, useRef, useCallback, useEffect } from "react";
import { B2BLang, IMPACT_TEXTS } from "../i18n";

interface ImpactSimulatorB2BProps { lang: B2BLang; }

function useCountUp(target: number, duration = 550) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    const to = target;
    if (from === to) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) { rafRef.current = requestAnimationFrame(step); }
      else { fromRef.current = to; }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return display;
}

function computeB2BImpact(kg: number) {
  const families  = Math.max(1, Math.round(kg * 0.14));
  const revenue   = Math.round(kg * 20.8);
  const children  = Math.max(0, Math.floor(kg * 0.25));
  const trees     = Math.max(1, Math.round(kg * 0.6));
  const co2       = Math.round(kg * 2.3);
  return { families, revenue, children, trees, co2 };
}

function familiesSubtext(kg: number) {
  if (kg <= 20)  return "una familia con ingresos esta semana";
  if (kg <= 60)  return "varias familias con trabajo estable";
  if (kg <= 150) return "una comunidad entera en movimiento";
  if (kg <= 300) return "múltiples comunidades beneficiadas";
  return "un impacto regional transformador";
}
function revenueSubtext(kg: number) {
  if (kg <= 20)  return "cubre gastos básicos de una familia";
  if (kg <= 60)  return "financia un mes de operación del cacaotal";
  if (kg <= 150) return "equivale a una cosecha completa";
  if (kg <= 300) return "financia infraestructura productiva";
  return "transforma la economía de una región";
}
function childrenSubtext(kg: number) {
  if (kg <= 20)  return "útiles escolares para varios niños";
  if (kg <= 60)  return "un trimestre escolar completo";
  if (kg <= 150) return "un año de educación garantizado";
  if (kg <= 300) return "toda una escuela rural apoyada";
  return "una generación con futuro asegurado";
}
function treesSubtext(kg: number) {
  if (kg <= 20)  return "un jardín de cacao nativo protegido";
  if (kg <= 60)  return "una parcela familiar preservada";
  if (kg <= 150) return "un bosquete de cacao en pie";
  if (kg <= 300) return "un ecosistema completo conservado";
  return "un corredor biológico protegido";
}
function co2Subtext(kg: number) {
  if (kg <= 20)  return "equivale a plantar 2 árboles";
  if (kg <= 60)  return "como no usar el coche 1 mes";
  if (kg <= 150) return "compensa vuelos de corta distancia";
  if (kg <= 300) return "huella de carbono de una empresa pequeña";
  return "impacto climático significativo y medible";
}

interface MetricCardB2BProps {
  icon: string; value: string; label: string; subtext: string; color: string; image: string;
}

function MetricCardB2B({ icon, value, label, subtext, color, image }: MetricCardB2BProps) {
  return (
    <div className="flex-1 relative rounded-xl overflow-hidden" style={{ border: "1px solid rgba(245,200,120,0.14)", minWidth: "0", height: "170px" }}>
      <img src={image} alt={label} className="absolute inset-0 w-full h-full object-cover object-top" style={{ filter: "brightness(0.88) saturate(0.88)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,4,1,0.00) 0%, rgba(10,4,1,0.20) 40%, rgba(10,4,1,0.82) 75%, rgba(10,4,1,0.94) 100%)" }} />
      <div className="absolute top-2 left-2 w-7 h-7 flex items-center justify-center rounded-full" style={{ background: "rgba(10,4,1,0.60)", border: `1px solid ${color}55` }}>
        <i className={icon} style={{ color, fontSize: "13px" }} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-3 px-2 gap-0.5">
        <span className="font-black leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FFFDF9", fontSize: "clamp(1.3rem, 2.2vw, 1.9rem)", letterSpacing: "-0.02em", textShadow: "0 1px 10px rgba(0,0,0,0.95)" }}>
          {value}
        </span>
        <span className="text-center leading-tight font-semibold" style={{ color: "#FFFDF9", fontSize: "10px", maxWidth: "110px", textShadow: "0 1px 6px rgba(0,0,0,0.9)", opacity: 0.90 }}>
          {label}
        </span>
        <span className="text-center leading-tight italic font-medium" style={{ color, fontSize: "9px", maxWidth: "110px", textShadow: "0 1px 6px rgba(0,0,0,0.95)" }}>
          {subtext}
        </span>
      </div>
    </div>
  );
}

export default function ImpactSimulatorB2B({ lang }: ImpactSimulatorB2BProps) {
  const MIN = 5;
  const MAX = 1000;
  const [kg, setKg] = useState(50);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const t = IMPACT_TEXTS[lang];

  const { families, revenue, children, trees, co2 } = computeB2BImpact(kg);
  const displayFamilies = useCountUp(families);
  const displayRevenue  = useCountUp(revenue);
  const displayChildren = useCountUp(children);
  const displayTrees    = useCountUp(trees);
  const displayCo2      = useCountUp(co2);

  const percent = ((kg - MIN) / (MAX - MIN)) * 100;

  const updateFromPointer = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = MIN + ratio * (MAX - MIN);
    const snapped = raw < 50 ? Math.round(raw / 5) * 5 : raw < 200 ? Math.round(raw / 10) * 10 : Math.round(raw / 25) * 25;
    setKg(Math.max(MIN, Math.min(MAX, snapped)));
  }, []);

  const onMouseDown = (e: React.MouseEvent) => { e.preventDefault(); setDragging(true); updateFromPointer(e.clientX); };
  const onTouchStart = (e: React.TouchEvent) => { setDragging(true); updateFromPointer(e.touches[0].clientX); };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updateFromPointer(clientX);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, updateFromPointer]);

  const metrics: MetricCardB2BProps[] = [
    { icon: "ri-group-line", value: `${displayFamilies}`, label: t.metrics.families, subtext: familiesSubtext(kg), color: "#F5C87A", image: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776575902/864cbb7ad6c5b81c2255c05e0ad7fb36_llu0xk.jpg" },
    { icon: "ri-money-dollar-circle-line", value: `$${displayRevenue.toLocaleString()}`, label: t.metrics.revenue, subtext: revenueSubtext(kg), color: "#C17A5C", image: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776575917/search-image_23_svkngz.jpg" },
    { icon: "ri-graduation-cap-line", value: `${displayChildren}`, label: t.metrics.children, subtext: childrenSubtext(kg), color: "#A8C5A0", image: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776575914/search-image_24_chbptf.jpg" },
    { icon: "ri-plant-line", value: `${displayTrees}`, label: t.metrics.trees, subtext: treesSubtext(kg), color: "#8FBC8F", image: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776575907/search-image_25_bkytcr.jpg" },
    { icon: "ri-leaf-line", value: `${displayCo2} kg`, label: t.metrics.co2, subtext: co2Subtext(kg), color: "#7EC8A0", image: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776578247/search-image_38_utz0dd.jpg" },
  ];

  return (
    <section className="py-16 md:py-20 relative overflow-hidden" style={{ background: "#0F0602" }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(https://res.cloudinary.com/djfmngyl0/image/upload/v1775318750/pexels-daniel-dan-47825192-7543116_nwuk2v.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="absolute inset-0" style={{ background: "rgba(8,3,1,0.50)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(15,6,2,0.30) 0%, rgba(8,3,1,0.05) 50%, rgba(15,6,2,0.30) 100%)" }} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-10 h-px" style={{ background: "#C17A5C" }} />
            <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#C17A5C" }}>{t.badge}</span>
            <span className="w-10 h-px" style={{ background: "#C17A5C" }} />
          </div>
          <h2 className="font-black mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FFFDF9", fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
            {t.title}
          </h2>
          <p className="max-w-lg mx-auto text-sm" style={{ color: "rgba(245,230,211,0.55)" }}>{t.subtitle}</p>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(44,24,16,0.85) 0%, rgba(62,32,12,0.78) 100%)", border: "1px solid rgba(245,200,120,0.18)", backdropFilter: "blur(8px)" }}>
          <div className="text-center pt-8 pb-4">
            <span className="font-black leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FFFDF9", fontSize: "clamp(4rem, 9vw, 7rem)", letterSpacing: "-0.03em" }}>
              {kg}
            </span>
            <span className="font-bold ml-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5C87A", fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
              kg
            </span>
            <p className="text-xs mt-1 tracking-[0.18em]" style={{ color: "rgba(245,230,211,0.45)" }}>
              {t.volumeLabel}
            </p>
          </div>

          <div className="px-8 pb-6">
            <div ref={trackRef} className="relative h-1.5 rounded-full cursor-pointer select-none" style={{ background: "rgba(245,200,120,0.15)" }} onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
              <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${percent}%`, background: "linear-gradient(90deg, #8B5E2A, #F5C87A)", transition: dragging ? "none" : "width 0.15s ease" }} />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full" style={{ left: `${percent}%`, width: dragging ? "30px" : "26px", height: dragging ? "30px" : "26px", background: "#F5C87A", border: "3px solid #FFFDF9", boxShadow: dragging ? "0 0 0 6px rgba(245,200,120,0.25), 0 4px 16px rgba(0,0,0,0.5)" : "0 2px 10px rgba(0,0,0,0.4)", cursor: "grab", transition: dragging ? "none" : "width 0.15s ease, height 0.15s ease", zIndex: 10 }} />
            </div>
            <div className="flex justify-between mt-2">
              {[5, 100, 250, 500, 750, "1000 kg"].map((v, i) => (
                <span key={i} className="text-xs" style={{ color: "rgba(245,230,211,0.28)" }}>{v}</span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 px-4 pb-6">
            {metrics.map((m) => <MetricCardB2B key={m.label} {...m} />)}
          </div>

          <div className="mx-4 mb-5 rounded-xl px-5 py-4 flex flex-col md:flex-row items-center gap-3" style={{ background: "rgba(245,200,120,0.07)", border: "1px solid rgba(245,200,120,0.15)" }}>
            <i className="ri-file-chart-line flex-shrink-0" style={{ color: "#F5C87A", fontSize: "20px" }} />
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-semibold" style={{ color: "#F5E6D3" }}>{t.reportTitle}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(245,230,211,0.45)" }}>{t.reportDesc}</p>
            </div>
            <a href="mailto:empresas@coya.pe" className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer whitespace-nowrap" style={{ background: "#C17A5C", color: "#FFFDF9" }}>
              {t.reportCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
