import { useState, useEffect, useRef } from "react";

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
    image: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776562288/e566784c4facd4b64142124357f929e5_it041c.jpg",
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
    image: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776560756/search-image_12_ikzaw2.jpg",
    accentColor: "#C17A5C",
    stat: "12",
    statLabel: "años preservando la tradición",
  },
  {
    id: 3,
    name: "Rosa Mamani",
    role: "Artesana del tostado",
    origin: "Junín, Perú",
    quote: "Quedé sola con tres hijos y el cacao fue mi salvación. Aprendí a tostar, a empacar, a vender. Hoy tengo mi propio taller y otras mujeres del pueblo trabajan conmigo.",
    image: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776560919/search-image_13_lnyasf.jpg",
    accentColor: "#A8C5A0",
    stat: "8",
    statLabel: "mujeres en su cooperativa",
  },
  {
    id: 4,
    name: "Carmen Flores",
    role: "Fundadora de cooperativa",
    origin: "Ucayali, Perú",
    quote: "El agua potable llegó a nuestra comunidad gracias al cacao. No lo olvidaré nunca. Cada barra que se vende en Europa es un poco de dignidad que regresa a nuestro río.",
    image: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776560358/ee55c184022846a6fa648e52e7cfb174_1_kbkxqz.jpg",
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
        background: "linear-gradient(135deg, rgba(44,24,16,0.78) 0%, rgba(62,32,12,0.68) 100%)",
        border: `1px solid ${testimonial.accentColor}28`,
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
            background: `${testimonial.accentColor}14`,
            border: `1px solid ${testimonial.accentColor}30`,
          }}
        >
          <span
            className="font-black leading-none"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: testimonial.accentColor,
              fontSize: "1.6rem",
            }}
          >
            {testimonial.stat}
          </span>
          <span
            className="text-center leading-tight mt-0.5"
            style={{ color: "rgba(245,230,211,0.55)", fontSize: "9.5px", maxWidth: "80px" }}
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
            fontFamily: "'Cormorant Garamond', serif",
            color: testimonial.accentColor,
            fontSize: "3.5rem",
            lineHeight: "1",
            opacity: 0.5,
          }}
        >
          &ldquo;
        </span>
        <p
          className="leading-relaxed mb-4"
          style={{
            color: "rgba(255,253,249,0.90)",
            fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
            fontStyle: "italic",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {testimonial.quote}
        </p>
        <div>
          <p
            className="font-bold"
            style={{
              color: "#FFFDF9",
              fontSize: "0.95rem",
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: "0.02em",
            }}
          >
            {testimonial.name}
          </p>
          <p className="text-xs" style={{ color: testimonial.accentColor, opacity: 0.85 }}>
            {testimonial.role}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <i className="ri-map-pin-line" style={{ color: "rgba(245,230,211,0.40)", fontSize: "11px" }} />
            <span className="text-xs" style={{ color: "rgba(245,230,211,0.40)" }}>
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
        <span className="w-8 h-px" style={{ background: "rgba(245,200,120,0.4)" }} />
        <span
          className="text-xs font-bold tracking-[0.22em] uppercase"
          style={{ color: "rgba(245,200,120,0.7)" }}
        >
          Voces del campo
        </span>
        <span className="flex-1 h-px" style={{ background: "rgba(245,200,120,0.15)" }} />
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
              background: i === active ? t.accentColor : "rgba(245,200,120,0.22)",
              border: "none",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
