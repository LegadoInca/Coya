import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

type SlideMedia =
  | { type: "video"; src: string }
  | { type: "image"; src: string };

const SLIDES: SlideMedia[] = [
  { type: "video", src: "https://res.cloudinary.com/djfmngyl0/video/upload/v1775324136/12000309-hd_1920_1080_30fps_d4okyu.mp4" },
  { type: "video", src: "https://res.cloudinary.com/djfmngyl0/video/upload/v1774742813/3365440-uhd_3840_2160_30fps_mvpetn.mp4" },
  { type: "video", src: "https://res.cloudinary.com/djfmngyl0/video/upload/v1776551667/4061791-hd_1920_1080_24fps_bcamn1.mp4" },
  { type: "video", src: "https://res.cloudinary.com/djfmngyl0/video/upload/v1776551668/15171377_2160_3840_30fps_zpsqtg.mp4" },
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

      {/* Brand name centered at top */}
      <div className="absolute top-0 left-0 right-0 flex flex-col items-center pt-10 z-10 pointer-events-none">
        <span
          className="tracking-[0.55em] uppercase text-xs font-light mb-1"
          style={{ color: "#C17A5C", fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.5em" }}
        >
          ✦ &nbsp; Cacao Peruano &nbsp; ✦
        </span>
        <h1
          className="text-5xl md:text-6xl font-bold"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "#FFFDF9",
            letterSpacing: "0.3em",
            textShadow: "0 2px 24px rgba(0,0,0,0.35)",
          }}
        >
          COYA
        </h1>
      </div>

      {/* Slide content */}
      <div
        className={`absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24 transition-all duration-500 z-10 ${
          animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-8 h-px" style={{ background: "#C17A5C" }} />
            <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#C17A5C" }}>
              {t("hero.badge")}
            </span>
          </div>

          <p
            className="text-5xl md:text-7xl font-bold leading-tight mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FFFDF9" }}
          >
            {slide.title}
          </p>
          <h2
            className="text-4xl md:text-6xl font-light leading-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3", opacity: 0.9 }}
          >
            {slide.subtitle}
          </h2>
          <p
            className="text-base md:text-lg max-w-lg mb-8 leading-relaxed"
            style={{ color: "#E8DCC8", opacity: 0.9 }}
          >
            {slide.desc}
          </p>
          <button
            onClick={handleCta}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm cursor-pointer transition-all hover:scale-105 whitespace-nowrap"
            style={{ background: "#C17A5C", color: "#FFFDF9" }}
          >
            {slide.cta}
            <i className="ri-arrow-right-line" />
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="cursor-pointer transition-all duration-300"
            style={{
              width: i === current ? "32px" : "8px",
              height: "4px",
              borderRadius: "2px",
              background: i === current ? "#C17A5C" : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all hover:scale-110 z-10"
        style={{ background: "rgba(255,255,255,0.15)", color: "#FFFDF9" }}
      >
        <i className="ri-arrow-left-s-line text-xl" />
      </button>
      <button
        onClick={() => goTo((current + 1) % SLIDES.length)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all hover:scale-110 z-10"
        style={{ background: "rgba(255,255,255,0.15)", color: "#FFFDF9" }}
      >
        <i className="ri-arrow-right-s-line text-xl" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF7F2] to-transparent z-10" />
    </section>
  );
}
