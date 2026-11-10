import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { producers } from "@/mocks/producers";

interface HeroSectionProps {
  onScrollToProducers: () => void;
  onScrollToCatalog: () => void;
}

// Un solo video de fondo
const HERO_VIDEO = "/Coya/videos/hero1.mp4";

// Logo del hero: "Qantari" en rojo y "Cacao" en blanco
const LOGO = "/Coya/images/logo-qantari-cacao-blanco.png";
const SERIF_ITALIC = "'Instrument Serif', 'Cormorant Garamond', Georgia, serif";

// Fotos de los arcos: retrato y foto de trabajo de cada productor, intercaladas para no repetir caras seguidas
const ARCH_PHOTOS: string[] = (() => {
  const first = producers.map((p, i) => (i % 2 === 0 ? p.image : p.workImage));
  const second = producers.map((p, i) => (i % 2 === 0 ? p.workImage : p.image));
  return [...first, ...second];
})();

function Arch({ src }: { src: string }) {
  return (
    <div
      className="relative flex-shrink-0 overflow-hidden transition-transform duration-500 hover:-translate-y-2"
      style={{
        width: "var(--arch-w)",
        height: "calc(var(--arch-w) * 1.2)",
        borderRadius: "calc(var(--arch-w) / 2) calc(var(--arch-w) / 2) 26px 26px",
        border: "1px solid rgba(255,255,255,0.28)",
        boxShadow: "0 14px 34px rgba(0,0,0,0.28)",
      }}
    >
      <img src={src} alt="" loading="lazy" className="w-full h-full object-cover object-top" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(0,0,0,0.08))" }}
      />
    </div>
  );
}

export default function HeroSection({ onScrollToCatalog }: HeroSectionProps) {
  const { t } = useTranslation();

  // Tipografía serif cursiva del titular (se carga una sola vez)
  useEffect(() => {
    const id = "qantari-instrument-serif";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap";
    document.head.appendChild(link);
  }, []);

  // Los 4 textos antiguos eran idénticos: usamos el primero
  const slides = t("hero.slides", { returnObjects: true }) as Array<{
    title: string;
    subtitle: string;
    desc: string;
    cta: string;
  }>;
  const slide = (Array.isArray(slides) && slides[0]) || { title: "", subtitle: "", desc: "", cta: "" };

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[660px] overflow-hidden"
      style={{ ["--arch-w" as string]: "clamp(92px, 12.2vw, 176px)" } as React.CSSProperties}
    >
      {/* Video único */}
      <video
        src={HERO_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Sombras para que el texto blanco se lea (más fuerte a la izquierda) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(20,10,6,0.74) 0%, rgba(20,10,6,0.46) 38%, rgba(20,10,6,0.12) 70%, rgba(20,10,6,0.26) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Contenido */}
      <div
        className="absolute inset-0 z-10 flex flex-col justify-center px-5 md:px-16 lg:px-24"
        style={{ paddingTop: "84px", paddingBottom: "calc(var(--arch-w) * 0.95 + 20px)" }}
      >
        <div className="max-w-4xl">
          {/* Logo Qantari Cacao (imagen tal cual) */}
          <img
            src={LOGO}
            alt="Qantari Cacao"
            className="block mb-5 md:mb-7"
            style={{ height: "clamp(84px, 10vw, 140px)", width: "auto" }}
          />

          {/* Titular: línea 1 sans ligera + línea 2 serif cursiva */}
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              color: "#FFFFFF",
              fontSize: "clamp(1.8rem, 4.1vw, 3.7rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.04,
            }}
          >
            {slide.title}
          </h2>
          <p
            style={{
              fontFamily: SERIF_ITALIC,
              fontStyle: "italic",
              fontWeight: 400,
              color: "#FFFFFF",
              fontSize: "clamp(2rem, 4.4vw, 4rem)",
              letterSpacing: "-0.01em",
              lineHeight: 1.02,
              marginTop: "0.08em",
            }}
          >
            {slide.subtitle}
          </p>

          <p
            className="max-w-md mt-5 md:mt-6 mb-6 md:mb-8 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.82)", fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.85rem, 1.15vw, 0.98rem)" }}
          >
            {slide.desc}
          </p>

          {/* Botón blanco con círculo y flecha */}
          <button
            onClick={onScrollToCatalog}
            className="group inline-flex items-center gap-4 pl-6 pr-2 py-2 rounded-full cursor-pointer transition-transform hover:scale-[1.03] whitespace-nowrap"
            style={{ background: "rgba(255,255,255,0.96)", color: "#3A2A22", fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.95rem" }}
          >
            {slide.cta}
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ background: "#7A4A38", color: "#FFFFFF" }}
            >
              <i className="ri-arrow-right-up-line text-lg" />
            </span>
          </button>
        </div>
      </div>

      {/* Fila de arcos con las fotos de los productores (primer y último se cortan en los bordes) */}
      <div className="absolute left-0 right-0 bottom-0 z-10" style={{ transform: "translateY(26%)" }}>
        <div className="flex items-end gap-5 md:gap-[26px]" style={{ marginLeft: "-70px" }}>
          {ARCH_PHOTOS.map((src, i) => (
            <Arch key={`${src}-${i}`} src={src} />
          ))}
        </div>
      </div>
    </section>
  );
}
