import { useState, useEffect, useRef } from "react";

// Serif cursiva (misma del titular del hero)
const SERIF = "'Instrument Serif', 'Cormorant Garamond', Georgia, serif";

// Colores de acento más oscuros para que se lean sobre blanco
const TEXT_ACCENT: Record<string, string> = {
  "#F5C87A": "#B8892F",
  "#C17A5C": "#B0644A",
  "#A8C5A0": "#5E8F63",
  "#8FBC8F": "#4F8A57",
};
const textAccent = (c: string) => TEXT_ACCENT[c] ?? c;

interface Testimonial {
  id: number;
  name: string;
  role: string;
  origin: string;
  quote: string;
  image: string;
  accentColor: string;
  stat: string;
  statLabel: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "María Quispe",
    role: "Productora de cacao Chuncho",
    origin: "Valle de La Convención, Cusco",
    quote: "Antes vendíamos el cacao a intermediarios que nos pagaban lo mínimo. Ahora sé exactamente a quién llega mi trabajo y cuánto vale. Mis hijos ven que el campo tiene futuro.",
    image: "/Coya/images/maria.jpeg",
    accentColor: "#F5C87A",
    stat: "3×",
    statLabel: "más ingreso que antes",
  },
  {
    id: 2,
    name: "Segundo Huanca",
    role: "Guardián del cacao ancestral",
    origin: "Ayacucho, Perú",
    quote: "Mi abuelo me enseñó a fermentar el cacao con paciencia. Pensé que ese conocimiento moriría conmigo. Hoy lo comparto con el mundo y mis nietos aprenden orgullosos.",
    image: "/Coya/images/segundo.jpeg",
    accentColor: "#C17A5C",
    stat: "12",
    statLabel: "años preservando la tradición",
  },
  {
    id: 3,
    name: "Fructuoso",
    role: "Artesano del tostado",
    origin: "Junín, Perú",
    quote: "Quedé solo con tres hijos y el cacao fue mi salvación. Aprendí a tostar, a empacar, a vender. Hoy tengo mi propio taller y otras personas del pueblo trabajan conmigo.",
    image: "/Coya/images/fructuoso.png",
    accentColor: "#A8C5A0",
    stat: "8",
    statLabel: "personas en su cooperativa",
  },
  {
    id: 4,
    name: "Antonio Quispe",
    role: "Fundador de cooperativa",
    origin: "Ucayali, Perú",
    quote: "El agua potable llegó a nuestra comunidad gracias al cacao. No lo olvidaré nunca. Cada barra que se vende en Europa es un poco de dignidad que regresa a nuestro río.",
    image: "/Coya/images/antonio.png",
    accentColor: "#8FBC8F",
    stat: "340",
    statLabel: "familias con agua potable",
  },
];

function TestimonialCard({
  testimonial,
  active,
}: {
  testimonial: Testimonial;
  active: boolean;
}) {
  return (
    <div
      className="flex-shrink-0 w-full flex flex-col md:flex-row gap-6 rounded-2xl overflow-hidden p-6 md:p-8"
      style={{
        background: "#FFFFFF",
        border: `1px solid ${testimonial.accentColor}55`,
        boxShadow: "0 14px 40px rgba(42,24,16,0.06)",
        opacity: active ? 1 : 0,
        transform: active ? "translateX(0) scale(1)" : "translateX(24px) scale(0.98)",
        transition: "opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: active ? "auto" : "none",
        position: active ? "relative" : "absolute",
        inset: active ? "auto" : 0,
      }}
    >
      {/* Left: photo + stat */}
      <div className="flex flex-col items-center gap-3 flex-shrink-0">
        <div
          className="rounded-full overflow-hidden"
          style={{
            width: "88px",
            height: "88px",
            border: `2.5px solid ${testimonial.accentColor}60`,
          }}
        >
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
        {/* Stat bubble */}
        <div
          className="flex flex-col items-center px-4 py-2 rounded-xl"
          style={{
            background: `${testimonial.accentColor}22`,
            border: `1px solid ${testimonial.accentColor}55`,
          }}
        >
          <span
            className="leading-none"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: textAccent(testimonial.accentColor),
              fontSize: "1.6rem",
            }}
          >
            {testimonial.stat}
          </span>
          <span
            className="text-center leading-tight mt-0.5"
            style={{ color: "rgba(42,24,16,0.6)", fontSize: "9.5px", maxWidth: "80px", fontFamily: "'Inter', sans-serif" }}
          >
            {testimonial.statLabel}
          </span>
        </div>
      </div>

      {/* Right: quote + info */}
      <div className="flex flex-col justify-center flex-1 min-w-0">
        {/* Quote mark */}
        <span
          className="leading-none mb-2 block"
          style={{
            fontFamily: SERIF,
            color: textAccent(testimonial.accentColor),
            fontSize: "3.5rem",
            lineHeight: "1",
            opacity: 0.55,
          }}
        >
          &ldquo;
        </span>
        <p
          className="leading-relaxed mb-4"
          style={{
            color: "#2A1810",
            fontSize: "clamp(1.05rem, 1.7vw, 1.3rem)",
            fontStyle: "italic",
            fontFamily: SERIF,
            lineHeight: 1.45,
          }}
        >
          {testimonial.quote}
        </p>
        <div>
          <p
            style={{
              color: "#2A1810",
              fontSize: "0.95rem",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {testimonial.name}
          </p>
          <p className="text-xs" style={{ color: textAccent(testimonial.accentColor), fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
            {testimonial.role}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <i className="ri-map-pin-line" style={{ color: "rgba(42,24,16,0.4)", fontSize: "11px" }} />
            <span className="text-xs" style={{ color: "rgba(42,24,16,0.5)", fontFamily: "'Inter', sans-serif" }}>
              {testimonial.origin}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProducerTestimonials() {
  const [active, setActive] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5500);
  };

  useEffect(() => {
    startAuto();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const goTo = (idx: number) => {
    setActive(idx);
    startAuto();
  };

  return (
    <div className="w-full mb-10">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-5">
        <span className="w-8 h-px" style={{ background: "rgba(176,100,74,0.5)" }} />
        <span
          className="text-[11px] tracking-[0.3em] uppercase"
          style={{ color: "#B0644A", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
        >
          Voces del campo
        </span>
        <span className="flex-1 h-px" style={{ background: "rgba(42,24,16,0.10)" }} />
      </div>

      {/* Cards container */}
      <div className="relative" style={{ minHeight: "200px" }}>
        {testimonials.map((t, i) => (
          <TestimonialCard key={t.id} testimonial={t} active={i === active} />
        ))}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {testimonials.map((t, i) => (
          <button
            key={t.id}
            onClick={() => goTo(i)}
            className="cursor-pointer rounded-full transition-all"
            style={{
              width: i === active ? "24px" : "8px",
              height: "8px",
              background: i === active ? textAccent(t.accentColor) : "rgba(42,24,16,0.18)",
              border: "none",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
