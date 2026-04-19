import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { B2BLang, HERO_TEXTS } from "../i18n";

interface HeroB2BProps { lang: B2BLang; }

export default function HeroB2B({ lang }: HeroB2BProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const t = HERO_TEXTS[lang];

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "100vh" }}>
      {/* Background video */}
      <video
        ref={videoRef}
        src="https://res.cloudinary.com/djfmngyl0/video/upload/v1775324136/12000309-hd_1920_1080_30fps_d4okyu.mp4"
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlays */}
      <div className="absolute inset-0" style={{ background: "rgba(15,6,2,0.68)" }} />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(44,24,16,0.55) 0%, transparent 60%, rgba(62,32,12,0.35) 100%)" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-center min-h-screen py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-px" style={{ background: "#C17A5C" }} />
            <span className="text-xs font-bold tracking-[0.28em] uppercase" style={{ color: "#C17A5C" }}>
              {t.badge}
            </span>
          </div>

          <h1
            className="font-black leading-tight mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#FFFDF9",
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              letterSpacing: "-0.02em",
            }}
          >
            {t.title1}
            <br />
            <em style={{ color: "#F5C87A", fontStyle: "italic" }}>{t.title2}</em>
            <br />
            {t.title3}
          </h1>

          <p
            className="text-base md:text-lg leading-relaxed mb-8 max-w-xl"
            style={{ color: "rgba(245,230,211,0.78)" }}
          >
            {t.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-14">
            <a
              href="#catalogo-b2b"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm cursor-pointer transition-all hover:scale-105 whitespace-nowrap"
              style={{ background: "#C17A5C", color: "#FFFDF9" }}
            >
              <i className="ri-box-3-line" />
              {t.cta1}
            </a>
            <a
              href="#adopta-b2b"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm cursor-pointer transition-all whitespace-nowrap"
              style={{ background: "rgba(255,255,255,0.10)", color: "#FFFDF9", border: "1px solid rgba(255,255,255,0.25)" }}
            >
              <i className="ri-seedling-line" />
              {t.cta2}
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl px-4 py-4"
                style={{ background: "rgba(255,253,249,0.06)", border: "1px solid rgba(245,200,120,0.15)", backdropFilter: "blur(8px)" }}
              >
                <p
                  className="font-black leading-none mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5C87A", fontSize: "2rem" }}
                >
                  {s.value}
                </p>
                <p className="text-xs" style={{ color: "rgba(245,230,211,0.55)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back to consumer link */}
      <div className="absolute top-24 right-6 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
          style={{ background: "rgba(255,255,255,0.10)", color: "rgba(245,230,211,0.75)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <i className="ri-arrow-left-line" />
          {t.back}
        </Link>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0F0602] to-transparent z-10" />
    </section>
  );
}
