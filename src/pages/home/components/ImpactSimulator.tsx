import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { CartItem } from "@/hooks/useCart";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ImpactMetric {
  icon: string;
  value: string;
  label: string;
  subtext: string;
  color: string;
  image: string;
}

interface ImpactSimulatorProps {
  cartItems?: CartItem[];
}

// ─── Confetti particle ────────────────────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const CONFETTI_COLORS = ["#F5C87A", "#C17A5C", "#A8C5A0", "#8FBC8F", "#FFFDF9", "#D4A96A"];

function ConfettiBurst({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    // Spawn particles
    const newParticles: Particle[] = Array.from({ length: 52 }, (_, i) => ({
      id: i,
      x: 40 + Math.random() * 20, // % from left, centered
      vx: (Math.random() - 0.5) * 3.5,
      vy: -(3 + Math.random() * 4),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 5 + Math.random() * 6,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
    }));
    setParticles(newParticles);

    let frame = 0;
    const animate = () => {
      frame++;
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.5,
            vy: p.vy + 0.18, // gravity
            vx: p.vx * 0.98,
            rotation: p.rotation + p.rotationSpeed,
            opacity: Math.max(0, p.opacity - (frame > 40 ? 0.03 : 0)),
          }))
          .filter((p) => p.opacity > 0)
      );
      if (frame < 90) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setParticles([]);
        startedRef.current = false;
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 50 }}>
      {particles.map((p) => {
        // Accumulate vertical position from vy history — approximate with frame
        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: "40%",
              width: `${p.size}px`,
              height: `${p.size * 0.5}px`,
              background: p.color,
              borderRadius: "2px",
              opacity: p.opacity,
              transform: `translate(${p.vx * 8}px, ${p.vy * 8}px) rotate(${p.rotation}deg)`,
              transition: "none",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 480) {
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
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return display;
}

// ─── Contextual subtexts (based on units, realistic) ─────────────────────────
function familiesSubtext(units: number): string {
  if (units === 1) return "1 familia recibe ingreso directo hoy";
  if (units <= 3) return "una pequeña familia apoyada esta semana";
  if (units <= 7) return "varias familias con ingresos este mes";
  if (units <= 12) return "toda una comunidad en movimiento";
  return "un impacto que trasciende generaciones";
}

function revenueSubtext(units: number): string {
  if (units === 1) return "cubre 2 días de alimentos de una familia";
  if (units <= 3) return "paga una semana de servicios básicos";
  if (units <= 7) return "financia útiles escolares para un niño";
  if (units <= 12) return "equivale a un mes de ingresos dignos";
  return "transforma la economía de una comunidad";
}

function childrenSubtext(units: number): string {
  if (units <= 2) return "útiles escolares para un niño";
  if (units <= 5) return "un mes de clases garantizado";
  if (units <= 9) return "un trimestre escolar completo";
  if (units <= 14) return "medio año de educación apoyada";
  return "un año escolar completo financiado";
}

function treesSubtext(units: number): string {
  if (units === 1) return "1 árbol de cacao nativo protegido";
  if (units <= 3) return "un pequeño jardín de cacao preservado";
  if (units <= 7) return "una parcela familiar en pie";
  if (units <= 12) return "un bosquete de cacao conservado";
  return "un ecosistema completo protegido";
}

// ─── Impact formulas — realistic per unit ────────────────────────────────────
// Each product unit ≈ 80–250g → avg ~130g = 0.13 kg
// Producer gets ~$3.50 per unit (fair trade premium)
// 1 unit → supports 1 producer family partially
// Every 3 units → 1 child gets school supplies
// Every 2 units → 1 cacao tree preserved (reforestation fund)
function computeImpact(units: number) {
  const families = Math.max(1, Math.round(units * 0.6));           // ~1 family per 2 units
  const revenue = Math.round(units * 3.5 * 100) / 100;            // $3.50 per unit to producer
  const children = Math.max(0, Math.floor(units / 3));             // 1 child per 3 units
  const trees = Math.max(1, Math.round(units * 0.5));              // 1 tree per 2 units
  return { families, revenue, children, trees };
}

// ─── MetricCard ───────────────────────────────────────────────────────────────
function MetricCard({ icon, value, label, subtext, color, image }: ImpactMetric) {
  return (
    <div
      className="flex-1 relative rounded-xl overflow-hidden"
      style={{
        border: "1px solid rgba(245,200,120,0.18)",
        minWidth: "0",
        height: "160px",
      }}
    >
      {/* Full-card image */}
      <img
        src={image}
        alt={label}
        className="absolute inset-0 w-full h-full object-cover object-top"
        style={{ filter: "brightness(0.88) saturate(0.90)" }}
      />

      {/* Gradient: only bottom third darkened for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(10,4,1,0.00) 0%, rgba(10,4,1,0.20) 45%, rgba(10,4,1,0.78) 75%, rgba(10,4,1,0.92) 100%)",
        }}
      />

      {/* Icon top-left */}
      <div
        className="absolute top-2 left-2 w-7 h-7 flex items-center justify-center rounded-full"
        style={{ background: "rgba(10,4,1,0.55)", border: `1px solid ${color}55` }}
      >
        <i className={icon} style={{ color, fontSize: "13px" }} />
      </div>

      {/* Text bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-3 px-2 gap-0.5">
        <span
          className="font-black leading-none"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "#FFFDF9",
            fontSize: "clamp(1.3rem, 2.5vw, 2rem)",
            letterSpacing: "-0.02em",
            textShadow: "0 1px 12px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.8)",
          }}
        >
          {value}
        </span>
        <span
          className="text-center leading-tight font-semibold"
          style={{
            color: "#FFFDF9",
            fontSize: "10px",
            maxWidth: "110px",
            textShadow: "0 1px 6px rgba(0,0,0,0.9)",
            opacity: 0.92,
          }}
        >
          {label}
        </span>
        <span
          className="text-center leading-tight italic font-medium"
          style={{
            color,
            fontSize: "9px",
            maxWidth: "110px",
            textShadow: "0 1px 6px rgba(0,0,0,0.95)",
            opacity: 1,
          }}
        >
          {subtext}
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ImpactSimulator({ cartItems = [] }: ImpactSimulatorProps) {
  const MIN = 1;
  const MAX = 100;

  // Total units in cart
  const cartUnits = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );
  const hasCartItems = cartItems.length > 0;

  // Confetti: fire when first item added
  const prevCartUnits = useRef(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (prevCartUnits.current === 0 && cartUnits >= 1) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    prevCartUnits.current = cartUnits;
  }, [cartUnits]);

  // Slider state
  const [manualUnits, setManualUnits] = useState(3);
  const [isManual, setIsManual] = useState(false);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Sync slider with cart
  useEffect(() => {
    if (hasCartItems && !isManual) {
      const clamped = Math.min(MAX, Math.max(MIN, cartUnits));
      setManualUnits(clamped);
    }
  }, [cartUnits, hasCartItems, isManual]);

  const units = isManual
    ? manualUnits
    : hasCartItems
    ? Math.min(MAX, Math.max(MIN, cartUnits))
    : manualUnits;

  const percent = ((units - MIN) / (MAX - MIN)) * 100;

  const { families, revenue, children, trees } = computeImpact(units);

  const displayFamilies = useCountUp(families);
  const displayRevenue = useCountUp(Math.round(revenue * 100)); // cents for smooth animation
  const displayChildren = useCountUp(children);
  const displayTrees = useCountUp(trees);

  const updateFromPointer = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newUnits = Math.round(MIN + ratio * (MAX - MIN));
    setManualUnits(newUnits);
    setIsManual(true);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    updateFromPointer(e.clientX);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    updateFromPointer(e.touches[0].clientX);
  };

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

  const metrics: ImpactMetric[] = [
    {
      icon: "ri-group-line",
      value: `${displayFamilies}`,
      label: "Familias productoras beneficiadas",
      subtext: familiesSubtext(units),
      color: "#F5C87A",
      image: "/Coya/images/impact1.jpeg",
    },
    {
      icon: "ri-money-dollar-circle-line",
      value: `$${(displayRevenue / 100).toFixed(2)}`,
      label: "USD directos al productor",
      subtext: revenueSubtext(units),
      color: "#C17A5C",
      image: "/Coya/images/impact2.jpeg",
    },
    {
      icon: "ri-graduation-cap-line",
      value: `${displayChildren}`,
      label: "Niños con educación apoyada",
      subtext: childrenSubtext(units),
      color: "#A8C5A0",
      image: "/Coya/images/family-rosa.jpeg",
    },
    {
      icon: "ri-plant-line",
      value: `${displayTrees}`,
      label: "Árboles de cacao preservados",
      subtext: treesSubtext(units),
      color: "#8FBC8F",
      image: "/Coya/images/impact4.jpeg",
    },
  ];

  const isCartMode = hasCartItems && !isManual;

  return (
    <div
      className="w-full rounded-2xl mb-10 overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, rgba(44,24,16,0.82) 0%, rgba(62,32,12,0.75) 100%)",
        border: `1px solid ${isCartMode ? "rgba(168,197,160,0.30)" : "rgba(245,200,120,0.18)"}`,
        backdropFilter: "blur(8px)",
        transition: "border-color 0.4s ease",
      }}
    >
      {/* Confetti burst */}
      <ConfettiBurst active={showConfetti} />

      {/* First-impact celebration banner */}
      {showConfetti && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center gap-2 py-2 z-40"
          style={{
            background: "linear-gradient(90deg, rgba(168,197,160,0.18), rgba(245,200,120,0.22), rgba(168,197,160,0.18))",
            borderBottom: "1px solid rgba(245,200,120,0.25)",
            animation: "fadeInDown 0.4s ease",
          }}
        >
          <i className="ri-sparkling-2-fill" style={{ color: "#F5C87A", fontSize: "14px" }} />
          <span className="text-xs font-bold tracking-wide" style={{ color: "#FFFDF9" }}>
            ¡Tu primer impacto real acaba de comenzar!
          </span>
          <i className="ri-sparkling-2-fill" style={{ color: "#A8C5A0", fontSize: "14px" }} />
        </div>
      )}

      {/* Header */}
      <div className={`flex items-center justify-between px-6 pb-3 ${showConfetti ? "pt-10" : "pt-5"}`} style={{ transition: "padding-top 0.3s ease" }}>
        <div>
          <h3
            className="font-black leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#FFFDF9",
              fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
              letterSpacing: "0.01em",
            }}
          >
            Tu Impacto Real
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "rgba(245,230,211,0.55)" }}>
            {isCartMode
              ? "Calculado con tu canasta actual — mueve el slider para explorar"
              : "Mueve el slider y descubre el impacto de cada producto que eliges"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasCartItems && isManual && (
            <button
              onClick={() => setIsManual(false)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full cursor-pointer transition-all"
              style={{ background: "rgba(168,197,160,0.15)", border: "1px solid rgba(168,197,160,0.35)" }}
            >
              <i className="ri-refresh-line" style={{ color: "#A8C5A0", fontSize: "11px" }} />
              <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "#A8C5A0" }}>Mi canasta</span>
            </button>
          )}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(245,200,120,0.10)", border: "1px solid rgba(245,200,120,0.22)" }}
          >
            <i className="ri-seedling-line" style={{ color: "#F5C87A", fontSize: "13px" }} />
            <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "#F5C87A" }}>Cacao Peruano</span>
          </div>
        </div>
      </div>

      {/* Big units display */}
      <div className="text-center py-2">
        <span
          className="font-black leading-none"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "#FFFDF9",
            fontSize: "clamp(3rem, 7vw, 5rem)",
            letterSpacing: "-0.03em",
          }}
        >
          {units}
        </span>
        <span
          className="font-bold ml-2"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: isCartMode ? "#A8C5A0" : "#F5C87A",
            fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)",
            transition: "color 0.4s ease",
          }}
        >
          {units === 1 ? "producto" : "productos"}
        </span>
        <p className="text-xs mt-1" style={{ color: "rgba(245,230,211,0.50)", letterSpacing: "0.12em" }}>
          {isCartMode ? "EN TU CANASTA AHORA MISMO" : "UNIDADES SELECCIONADAS"}
        </p>
        {isCartMode && (
          <div className="flex items-center justify-center gap-1.5 mt-1.5">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "#A8C5A0" }}
            />
            <span className="text-xs" style={{ color: "#A8C5A0" }}>
              Sincronizado · {cartItems.length} tipo{cartItems.length !== 1 ? "s" : ""} de producto
            </span>
          </div>
        )}
      </div>

      {/* Slider */}
      <div className="px-6 pb-4">
        <div
          ref={trackRef}
          className="relative h-1 rounded-full cursor-pointer select-none"
          style={{ background: "rgba(245,200,120,0.15)" }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              width: `${percent}%`,
              background: isCartMode
                ? "linear-gradient(90deg, #4A7C59, #A8C5A0)"
                : "linear-gradient(90deg, #8B5E2A, #F5C87A)",
              transition: dragging ? "none" : "width 0.2s ease, background 0.4s ease",
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full"
            style={{
              left: `${percent}%`,
              width: dragging ? "28px" : "24px",
              height: dragging ? "28px" : "24px",
              background: isCartMode ? "#A8C5A0" : "#F5C87A",
              border: "3px solid #FFFDF9",
              boxShadow: dragging
                ? "0 0 0 6px rgba(245,200,120,0.25), 0 4px 16px rgba(0,0,0,0.5)"
                : "0 2px 10px rgba(0,0,0,0.4)",
              cursor: "grab",
              transition: dragging ? "none" : "width 0.15s ease, height 0.15s ease, background 0.4s ease",
              zIndex: 10,
            }}
          />
        </div>
        {/* Step markers */}
        <div className="flex justify-between mt-2 px-0.5">
          {[1, 25, 50, 75, 100].map((v) => (
            <span key={v} className="text-xs" style={{ color: "rgba(245,230,211,0.30)" }}>
              {v}
            </span>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="flex gap-2 px-4 pb-5">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>
    </div>
  );
}
