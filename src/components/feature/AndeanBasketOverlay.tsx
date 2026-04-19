import { useState, useEffect, useCallback } from "react";
import { CartItem } from "@/hooks/useCart";

interface AndeanBasketOverlayProps {
  item: CartItem | null;
  onClose: () => void;
  cartTotal?: number;
  cartCount?: number;
}

// ── Soft andean "plop" sound via Web Audio API ────────────────────────────────
function playBasketSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    // Layer 1: soft thud (low freq)
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = "sine";
    thud.frequency.setValueAtTime(180, ctx.currentTime);
    thud.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.18);
    thudGain.gain.setValueAtTime(0.38, ctx.currentTime);
    thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    thud.connect(thudGain);
    thudGain.connect(ctx.destination);
    thud.start(ctx.currentTime);
    thud.stop(ctx.currentTime + 0.22);

    // Layer 2: bright "pop" (mid freq)
    const pop = ctx.createOscillator();
    const popGain = ctx.createGain();
    pop.type = "triangle";
    pop.frequency.setValueAtTime(520, ctx.currentTime + 0.04);
    pop.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.18);
    popGain.gain.setValueAtTime(0.0, ctx.currentTime);
    popGain.gain.setValueAtTime(0.22, ctx.currentTime + 0.04);
    popGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
    pop.connect(popGain);
    popGain.connect(ctx.destination);
    pop.start(ctx.currentTime + 0.04);
    pop.stop(ctx.currentTime + 0.28);

    // Layer 3: tiny chime sparkle
    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = "sine";
    chime.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
    chime.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.35);
    chimeGain.gain.setValueAtTime(0.0, ctx.currentTime + 0.1);
    chimeGain.gain.setValueAtTime(0.12, ctx.currentTime + 0.12);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    chime.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chime.start(ctx.currentTime + 0.1);
    chime.stop(ctx.currentTime + 0.45);

    setTimeout(() => ctx.close(), 600);
  } catch {
    // silently fail if audio not supported
  }
}

// ── Animated Andean Basket (pure CSS/SVG) ────────────────────────────────────
function AndeanBasket({ dropping }: { dropping: boolean }) {
  return (
    <div className="relative flex items-end justify-center" style={{ width: "240px", height: "210px" }}>
      <svg viewBox="0 0 240 195" width="240" height="195" style={{ overflow: "visible" }}>
        <defs>
          <clipPath id="basketClip2">
            <path d="M28,52 Q24,165 14,175 L226,175 Q216,165 212,52 Z" />
          </clipPath>
          <linearGradient id="bShadow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(0,0,0,0.30)" />
            <stop offset="12%"  stopColor="rgba(0,0,0,0)" />
            <stop offset="88%"  stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.30)" />
          </linearGradient>
          <linearGradient id="rimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#F5C87A" />
            <stop offset="100%" stopColor="#8B4520" />
          </linearGradient>
        </defs>

        {/* ── Body base ── */}
        <path d="M28,52 Q24,165 14,175 L226,175 Q216,165 212,52 Z" fill="#B85C2A" />

        {/* ── Woven stripes with vivid andean colors ── */}
        <g clipPath="url(#basketClip2)">
          {/* Band 1 — deep red */}
          <rect x="12" y="52"  width="216" height="12" fill="#C0392B" />
          {/* Band 2 — bright gold */}
          <rect x="12" y="64"  width="216" height="9"  fill="#F39C12" />
          {/* Band 3 — electric green */}
          <rect x="12" y="73"  width="216" height="7"  fill="#27AE60" />
          {/* Band 4 — cream white */}
          <rect x="12" y="80"  width="216" height="5"  fill="#FDFAF3" />
          {/* Band 5 — cobalt blue */}
          <rect x="12" y="85"  width="216" height="8"  fill="#2980B9" />
          {/* Band 6 — hot pink/magenta */}
          <rect x="12" y="93"  width="216" height="6"  fill="#E91E8C" />
          {/* Band 7 — gold */}
          <rect x="12" y="99"  width="216" height="5"  fill="#F5C87A" />
          {/* Band 8 — deep red */}
          <rect x="12" y="104" width="216" height="9"  fill="#C0392B" />
          {/* Band 9 — green */}
          <rect x="12" y="113" width="216" height="6"  fill="#27AE60" />
          {/* Band 10 — cream */}
          <rect x="12" y="119" width="216" height="5"  fill="#FDFAF3" />
          {/* Band 11 — blue */}
          <rect x="12" y="124" width="216" height="7"  fill="#2980B9" />
          {/* Band 12 — magenta */}
          <rect x="12" y="131" width="216" height="5"  fill="#E91E8C" />
          {/* Band 13 — gold */}
          <rect x="12" y="136" width="216" height="6"  fill="#F39C12" />
          {/* Band 14 — deep red base */}
          <rect x="12" y="142" width="216" height="33" fill="#8B2500" />

          {/* Vertical weave texture */}
          {Array.from({ length: 27 }).map((_, i) => (
            <line key={i} x1={14 + i * 8} y1="52" x2={14 + i * 8} y2="175"
              stroke="rgba(0,0,0,0.07)" strokeWidth="1" />
          ))}

          {/* ── Geometric andean motifs ── */}
          {/* Row 1: zigzag diamonds on red band */}
          {[45, 75, 105, 135, 165, 195].map((x, i) => (
            <polygon key={`d1-${i}`}
              points={`${x},54 ${x+9},63 ${x},72 ${x-9},63`}
              fill={i % 3 === 0 ? "#F5C87A" : i % 3 === 1 ? "#FDFAF3" : "#27AE60"}
              opacity="0.95"
            />
          ))}

          {/* Row 2: small squares on blue band */}
          {[35, 60, 85, 110, 135, 160, 185, 210].map((x, i) => (
            <rect key={`sq-${i}`} x={x-4} y="86" width="8" height="6"
              fill={i % 2 === 0 ? "#F39C12" : "#E91E8C"} opacity="0.9" />
          ))}

          {/* Row 3: diamonds on middle section */}
          {[50, 80, 110, 140, 170, 200].map((x, i) => (
            <polygon key={`d2-${i}`}
              points={`${x},105 ${x+8},113 ${x},121 ${x-8},113`}
              fill={i % 3 === 0 ? "#FDFAF3" : i % 3 === 1 ? "#F5C87A" : "#27AE60"}
              opacity="0.9"
            />
          ))}

          {/* Row 4: cross motifs on lower section */}
          {[55, 95, 135, 175, 215].map((x, i) => (
            <g key={`cross-${i}`}>
              <rect x={x-1.5} y="143" width="3" height="12" fill={i%2===0?"#F39C12":"#E91E8C"} opacity="0.85" />
              <rect x={x-6}   y="148" width="12" height="3" fill={i%2===0?"#F39C12":"#E91E8C"} opacity="0.85" />
            </g>
          ))}

          {/* ── Llamita silhouette in center ── */}
          <g transform="translate(100, 108)" opacity="0.92">
            {/* Body */}
            <ellipse cx="20" cy="22" rx="14" ry="10" fill="#FDFAF3" />
            {/* Neck */}
            <rect x="26" y="10" width="7" height="14" rx="3" fill="#FDFAF3" />
            {/* Head */}
            <ellipse cx="30" cy="8" rx="6" ry="5" fill="#FDFAF3" />
            {/* Ear left */}
            <ellipse cx="26" cy="4" rx="2" ry="3.5" fill="#FDFAF3" transform="rotate(-15,26,4)" />
            {/* Ear right */}
            <ellipse cx="34" cy="3" rx="2" ry="3.5" fill="#FDFAF3" transform="rotate(15,34,3)" />
            {/* Eye */}
            <circle cx="32" cy="7" r="1.2" fill="#8B2500" />
            {/* Legs */}
            <rect x="10" y="30" width="4" height="10" rx="2" fill="#FDFAF3" />
            <rect x="17" y="30" width="4" height="10" rx="2" fill="#FDFAF3" />
            <rect x="24" y="30" width="4" height="10" rx="2" fill="#FDFAF3" />
            <rect x="31" y="30" width="4" height="10" rx="2" fill="#FDFAF3" />
            {/* Tail */}
            <path d="M6,22 Q0,18 2,14" fill="none" stroke="#FDFAF3" strokeWidth="3" strokeLinecap="round" />
            {/* Saddle blanket — colorful */}
            <ellipse cx="20" cy="20" rx="10" ry="6" fill="#E91E8C" opacity="0.7" />
            <ellipse cx="20" cy="20" rx="7"  ry="4" fill="#F39C12" opacity="0.7" />
          </g>

          {/* Shadow overlay */}
          <path d="M28,52 Q24,165 14,175 L226,175 Q216,165 212,52 Z" fill="url(#bShadow)" />
        </g>

        {/* ── Rim ── */}
        <path d="M22,52 Q120,36 218,52" fill="none" stroke="#5A2000" strokeWidth="12" strokeLinecap="round" />
        <path d="M22,52 Q120,36 218,52" fill="none" stroke="url(#rimGrad)" strokeWidth="8" strokeLinecap="round" />
        {/* Rim stripe pattern */}
        {[30,44,58,72,86,100,114,128,142,156,170,184,198,212].map((x,i) => (
          <circle key={`rim-dot-${i}`} cx={x} cy={52 - Math.sin((x-22)/196*Math.PI)*8} r="2.5"
            fill={["#C0392B","#F39C12","#27AE60","#2980B9","#E91E8C","#FDFAF3"][i%6]} />
        ))}

        {/* ── Handles ── */}
        {/* Left */}
        <path d="M32,52 Q4,22 26,4 Q48,-10 62,18 Q68,34 56,48"
          fill="none" stroke="#5A2000" strokeWidth="10" strokeLinecap="round" />
        <path d="M32,52 Q4,22 26,4 Q48,-10 62,18 Q68,34 56,48"
          fill="none" stroke="#C0392B" strokeWidth="6" strokeLinecap="round" />
        <path d="M32,52 Q4,22 26,4 Q48,-10 62,18 Q68,34 56,48"
          fill="none" stroke="rgba(245,200,120,0.4)" strokeWidth="2" strokeLinecap="round" />
        {/* Right */}
        <path d="M208,52 Q236,22 214,4 Q192,-10 178,18 Q172,34 184,48"
          fill="none" stroke="#5A2000" strokeWidth="10" strokeLinecap="round" />
        <path d="M208,52 Q236,22 214,4 Q192,-10 178,18 Q172,34 184,48"
          fill="none" stroke="#C0392B" strokeWidth="6" strokeLinecap="round" />
        <path d="M208,52 Q236,22 214,4 Q192,-10 178,18 Q172,34 184,48"
          fill="none" stroke="rgba(245,200,120,0.4)" strokeWidth="2" strokeLinecap="round" />

        {/* ── Bottom ── */}
        <ellipse cx="120" cy="175" rx="106" ry="9" fill="#5A2000" />
        <ellipse cx="120" cy="175" rx="100" ry="6" fill="#8B3010" />

        {/* ── Colorful fringe at rim ── */}
        {[30,42,54,66,78,90,102,114,126,138,150,162,174,186,198,210].map((x, i) => {
          const fringeColors = ["#C0392B","#F39C12","#27AE60","#2980B9","#E91E8C","#F5C87A","#FDFAF3","#8B2500"];
          const rimY = 52 - Math.sin((x-22)/196*Math.PI)*8;
          return (
            <line key={`fr-${i}`}
              x1={x} y1={rimY}
              x2={x + (i%3===0?-2:i%3===1?0:2)} y2={rimY+13}
              stroke={fringeColors[i%fringeColors.length]}
              strokeWidth="2.5" strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* ── Dropping product animation ── */}
      {dropping && (
        <div
          className="absolute"
          style={{
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            animation: "dropIntoBasket 0.75s cubic-bezier(0.55,0,1,0.45) forwards",
            zIndex: 10,
          }}
        >
          <div style={{
            width: "38px", height: "38px", borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #F5C87A, #8B3A1A)",
            border: "2.5px solid rgba(245,200,120,0.7)",
            boxShadow: "0 4px 18px rgba(0,0,0,0.45)",
          }} />
        </div>
      )}

      <style>{`
        @keyframes dropIntoBasket {
          0%   { top: -70px; opacity: 1; transform: translateX(-50%) scale(1) rotate(0deg); }
          55%  { top: 85px;  opacity: 1; transform: translateX(-50%) scale(0.85) rotate(200deg); }
          80%  { top: 100px; opacity: 0.6; transform: translateX(-50%) scale(0.5) rotate(300deg); }
          100% { top: 115px; opacity: 0; transform: translateX(-50%) scale(0.1) rotate(360deg); }
        }
        @keyframes basketBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25%       { transform: translateY(-5px) rotate(-2deg); }
          75%       { transform: translateY(-2px) rotate(1.5deg); }
        }
        @keyframes basketWiggle {
          0%   { transform: rotate(0deg) scale(1); }
          20%  { transform: rotate(-4deg) scale(1.02); }
          40%  { transform: rotate(4deg) scale(1.02); }
          60%  { transform: rotate(-2.5deg) scale(1.01); }
          80%  { transform: rotate(2.5deg) scale(1.01); }
          100% { transform: rotate(0deg) scale(1); }
        }
      `}</style>
    </div>
  );
}

// ── Main overlay ─────────────────────────────────────────────────────────────
export default function AndeanBasketOverlay({ item, onClose, cartTotal = 0, cartCount = 0 }: AndeanBasketOverlayProps) {
  const [phase, setPhase] = useState<"hidden" | "enter" | "visible" | "exit">("hidden");
  const [dropping, setDropping] = useState(false);
  const [basketAnim, setBasketAnim] = useState<"idle" | "bounce" | "wiggle">("idle");
  const [totalVisible, setTotalVisible] = useState(false);

  const triggerVibration = useCallback(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate([30, 20, 60]);
    }
  }, []);

  useEffect(() => {
    if (!item) { setPhase("hidden"); return; }

    setPhase("enter");
    const t1 = setTimeout(() => setPhase("visible"), 30);

    // Drop animation + sound + vibration after panel is visible
    const t2 = setTimeout(() => {
      setDropping(true);
      setBasketAnim("wiggle");
      playBasketSound();
      triggerVibration();
    }, 500);
    const t3 = setTimeout(() => {
      setDropping(false);
      setBasketAnim("bounce");
      setTotalVisible(true);
    }, 1200);
    const t4 = setTimeout(() => setBasketAnim("idle"), 2000);

    return () => {
      [t1, t2, t3, t4].forEach(clearTimeout);
      setTotalVisible(false);
    };
  }, [item, triggerVibration]);

  if (phase === "hidden" || !item) return null;

  const isVisible = phase === "visible";

  const handleClose = () => {
    setPhase("exit");
    setTimeout(() => { setPhase("hidden"); onClose(); }, 500);
  };

  const basketStyle: React.CSSProperties = {
    animation:
      basketAnim === "bounce"
        ? "basketBounce 0.5s ease 2"
        : basketAnim === "wiggle"
        ? "basketWiggle 0.4s ease"
        : "none",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{
          background: "rgba(20,8,2,0.6)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.45s ease",
          backdropFilter: isVisible ? "blur(6px)" : "none",
        }}
        onClick={handleClose}
      />

      {/* Panel — slides up from bottom center */}
      <div
        className="fixed left-1/2 z-50"
        style={{
          bottom: isVisible ? "0px" : "-200px",
          transform: `translateX(-50%) scale(${isVisible ? 1 : 0.94})`,
          opacity: isVisible ? 1 : 0,
          transition: "bottom 0.55s cubic-bezier(0.34,1.4,0.64,1), opacity 0.4s ease, transform 0.55s cubic-bezier(0.34,1.4,0.64,1)",
          width: "min(600px, 100vw)",
        }}
      >
        <div
          className="rounded-t-3xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #3D1F0A 0%, #1E0C04 100%)",
            border: "1px solid rgba(193,122,92,0.3)",
            borderBottom: "none",
          }}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-6 pt-5 pb-3"
            style={{ borderBottom: "1px solid rgba(193,122,92,0.12)" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#C17A5C" }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#C17A5C" }}>
                ¡Añadido a tu canasta andina!
              </span>
            </div>
            <button
              onClick={handleClose}
              className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,253,249,0.5)" }}
            >
              <i className="ri-close-line text-sm" />
            </button>
          </div>

          {/* Main content — mobile: stacked, desktop: side by side */}
          <div className="flex flex-col md:flex-row md:items-end">

            {/* Mobile: basket centered on top, scaled down */}
            <div className="flex md:hidden justify-center pt-2 pb-0" style={{ height: "130px", overflow: "hidden" }}>
              <div
                style={{
                  ...basketStyle,
                  transform: "scale(0.58)",
                  transformOrigin: "center top",
                }}
              >
                <AndeanBasket dropping={dropping} />
              </div>
            </div>

            {/* Left: product info */}
            <div className="flex-1 px-4 md:px-6 py-3 md:py-5">
              {/* Product row */}
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="flex-shrink-0 rounded-xl overflow-hidden"
                  style={{ width: "58px", height: "58px", border: "2px solid rgba(193,122,92,0.45)" }}
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p
                    className="font-bold leading-tight mb-1"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3", fontSize: "1rem" }}
                  >
                    {item.name}
                  </p>
                  <p className="text-xs mb-1.5" style={{ color: "rgba(184,168,152,0.65)" }}>
                    {item.producer} · {item.weight}
                  </p>
                  <span
                    className="font-bold"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5C87A", fontSize: "1rem" }}
                  >
                    ${item.price.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Impact message */}
              <div
                className="rounded-xl px-3 py-2.5 mb-3"
                style={{ background: "rgba(193,122,92,0.10)", border: "1px solid rgba(193,122,92,0.2)" }}
              >
                <div className="flex items-start gap-2">
                  <i className="ri-seedling-fill flex-shrink-0 mt-0.5" style={{ color: "#F5C87A", fontSize: "13px" }} />
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(245,230,211,0.75)" }}>
                    Tu compra apoya directamente a{" "}
                    <strong style={{ color: "#F5C87A" }}>{item.producer}</strong>.
                    Cada producto transforma una vida real.
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs" style={{ color: "rgba(184,168,152,0.5)" }}>Tu canasta</span>
                  <span className="text-xs font-semibold" style={{ color: "#C17A5C" }}>
                    {cartCount} {cartCount === 1 ? "producto" : "productos"}
                  </span>
                </div>
                <div className="w-full rounded-full overflow-hidden" style={{ height: "4px", background: "rgba(255,255,255,0.07)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(cartCount * 20, 100)}%`,
                      background: "linear-gradient(90deg, #C17A5C, #F5C87A)",
                    }}
                  />
                </div>
              </div>

              {/* Total acumulado */}
              <div
                style={{
                  opacity: totalVisible ? 1 : 0,
                  transform: totalVisible ? "translateY(0px)" : "translateY(8px)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                }}
              >
                <div
                  className="rounded-xl px-4 py-2.5 flex items-center justify-between"
                  style={{
                    background: "linear-gradient(135deg, rgba(245,200,122,0.12), rgba(193,122,92,0.08))",
                    border: "1px solid rgba(245,200,122,0.25)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-shopping-basket-2-fill" style={{ color: "#F5C87A", fontSize: "14px" }} />
                    </div>
                    <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: "rgba(245,230,211,0.6)" }}>
                      Total canasta
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs" style={{ color: "rgba(245,200,122,0.6)" }}>USD</span>
                    <span
                      className="font-bold"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        color: "#F5C87A",
                        fontSize: "1.35rem",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: animated basket — desktop only */}
            <div className="hidden md:flex flex-shrink-0 pr-4 pb-2 flex-col items-center">
              <div style={basketStyle}>
                <AndeanBasket dropping={dropping} />
              </div>
              <p
                className="text-center text-xs mt-1 font-semibold tracking-wider uppercase"
                style={{ color: "rgba(193,122,92,0.55)" }}
              >
                Canasta Andina
              </p>
            </div>
          </div>

          {/* Andean pattern strip at bottom */}
          <div
            className="h-2.5 w-full"
            style={{
              background: "repeating-linear-gradient(90deg, #C17A5C 0px, #C17A5C 10px, #F5C87A 10px, #F5C87A 20px, #7A1A1A 20px, #7A1A1A 30px, #2D6A4F 30px, #2D6A4F 40px, #F5E6D3 40px, #F5E6D3 50px)",
            }}
          />
        </div>
      </div>
    </>
  );
}
