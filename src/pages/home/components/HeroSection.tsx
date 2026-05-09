import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

type SlideMedia =
  | { type: "video"; src: string }
  | { type: "image"; src: string };

const SLIDES: SlideMedia[] = [
  { type: "video", src: "/Coya/videos/hero1.mp4" },
  { type: "video", src: "/Coya/videos/hero2.mp4" },
  { type: "video", src: "/Coya/videos/hero3.mp4" },
  { type: "video", src: "/Coya/videos/hero4.mp4" },
];

interface HeroSectionProps {
  onScrollToProducers: () => void;
  onScrollToCatalog: () => void;
}

function VideoSlide({ src, active }: { src: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (active) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    } else {
      ref.current.pause();
    }
  }, [active]);

  return (
    <div
      className="absolute inset-0 transition-opacity duration-1000"
      style={{ opacity: active ? 1 : 0 }}
    >
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
}

function ImageSlide({ src, active }: { src: string; active: boolean }) {
  return (
    <div
      className="absolute inset-0 transition-opacity duration-1000"
      style={{ opacity: active ? 1 : 0 }}
    >
      <img src={src} alt="" className="w-full h-full object-cover object-top" />
    </div>
  );
}

export default function HeroSection({ onScrollToProducers, onScrollToCatalog }: HeroSectionProps) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const slides = t("hero.slides", { returnObjects: true }) as Array<{
    title: string;
    subtitle: string;
    desc: string;
    cta: string;
  }>;

  const goTo = useCallback((idx: number) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 400);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  const slide = slides[current] || slides[0];

  const handleCta = () => {
    if (current === 0) onScrollToProducers();
    else onScrollToCatalog();
  };

  return (
    <section id="hero" className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Media slides */}
      {SLIDES.map((s, i) =>
        s.type === "video" ? (
          <VideoSlide key={i} src={s.src} active={i === current} />
        ) : (
          <ImageSlide key={i} src={s.src} active={i === current} />
        )
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Slide content — left-aligned like Holzen */}
      <div
        className={`absolute inset-0 flex flex-col justify-center px-5 md:px-16 lg:px-24 transition-all duration-500 z-10 ${
          animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <span
            className="tracking-[0.4em] uppercase text-[10px] md:text-xs font-light mb-3 md:mb-4 inline-block"
            style={{ color: "#C17A5C", fontFamily: "'Cormorant Garamond', serif" }}
          >
            ✦ &nbsp; Cacao Peruano &nbsp; ✦
          </span>

          {/* COYA grande */}
          <h1
            className="font-bold leading-none mb-4 md:mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#FFFDF9",
              letterSpacing: "0.05em",
              fontSize: "clamp(3rem, 8.5vw, 7rem)",
              fontWeight: 900,
              textShadow: "0 2px 24px rgba(0,0,0,0.4)",
            }}
          >
            COYA
          </h1>

          {/* Subtítulo en 2 líneas */}
          <p
            className="font-bold leading-tight mb-1"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FFFDF9", fontSize: "clamp(1.2rem, 3vw, 2.5rem)" }}
          >
            {slide.title}
          </p>
          <h2
            className="font-light leading-tight mb-5 md:mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3", opacity: 0.9, fontSize: "clamp(1rem, 2.4vw, 2rem)" }}
          >
            {slide.subtitle}
          </h2>

          <p
            className="text-sm md:text-base max-w-lg mb-6 md:mb-8 leading-relaxed"
            style={{ color: "#E8DCC8", opacity: 0.9 }}
          >
            {slide.desc}
          </p>

          <button
            onClick={handleCta}
            className="relative overflow-hidden inline-flex items-center gap-2 px-6 md:px-7 py-3 md:py-3.5 rounded-full font-semibold text-sm cursor-pointer transition-all hover:scale-105 whitespace-nowrap group"
            style={{ background: "#C17A5C", color: "#FFFDF9", boxShadow: "0 0 22px rgba(193,122,92,0.45)" }}
          >
            <span className="relative z-10">{slide.cta}</span>
            <i className="relative z-10 ri-arrow-right-line" />
            <span className="absolute top-0 bottom-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="cursor-pointer transition-all duration-300"
            style={{
              width: i === current ? "28px" : "7px",
              height: "4px",
              borderRadius: "2px",
              background: i === current ? "#C17A5C" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>

      {/* Arrows — hidden on mobile to keep content clean */}
      <button
        onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full cursor-pointer transition-all hover:scale-110 z-10"
        style={{ background: "rgba(255,255,255,0.15)", color: "#FFFDF9" }}
      >
        <i className="ri-arrow-left-s-line text-xl" />
      </button>
      <button
        onClick={() => goTo((current + 1) % SLIDES.length)}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full cursor-pointer transition-all hover:scale-110 z-10"
        style={{ background: "rgba(255,255,255,0.15)", color: "#FFFDF9" }}
      >
        <i className="ri-arrow-right-s-line text-xl" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF7F2] to-transparent z-10" />
    </section>
  );
}
