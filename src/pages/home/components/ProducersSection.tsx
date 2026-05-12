import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { producers } from "@/mocks/producers";

export default function ProducersSection() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === active) return;
      setAnimating(true);
      setTimeout(() => {
        setActive(idx);
        setAnimating(false);
      }, 350);
    },
    [active]
  );

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => {
      goTo((active + 1) % producers.length);
    }, 5500);
    return (
    <section
      id="producers"
      className="relative w-full overflow-hidden"
      style={{ background: "#1A0E08" }}
    >
      {/* Background texture image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/Coya/images/producers-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.32,
        }}
      />
      {/* Golden warm overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(160deg, rgba(26,14,8,0.55) 0%, rgba(42,22,8,0.45) 50%, rgba(26,14,8,0.55) 100%)" }}
      />

      {/* Section header */}
      <div className="relative z-10 text-center pt-16 pb-8 px-6">
        <span
          className="text-xs tracking-[0.4em] uppercase font-light mb-3 block"
          style={{ color: "#C17A5C" }}
        >
          {t("producers.badge")}
        </span>
        <h2
          className="text-4xl md:text-5xl font-bold mb-8"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3" }}
        >
          {t("producers.title")}
        </h2>

        {/* Horizontal thumbnail strip */}
        <div className="flex justify-center gap-4 flex-wrap">
          {producers.map((p, i) => (
            <button
              key={p.id}
              onClick={() => { setAutoplay(false); goTo(i); }}
              className="flex flex-col items-center gap-2 cursor-pointer transition-all duration-300"
            >
              <div
                className="relative overflow-hidden rounded-xl transition-all duration-300"
                style={{
                  width: i === active ? "80px" : "58px",
                  height: i === active ? "96px" : "72px",
                  border: i === active ? "2.5px solid #C17A5C" : "2px solid rgba(193,122,92,0.2)",
                  opacity: i === active ? 1 : 0.55,
                  boxShadow: i === active ? "0 0 18px rgba(193,122,92,0.5)" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top" />
                {i === active && (
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,14,8,0.6), transparent)" }} />
                )}
              </div>
              <span
                className="text-xs font-medium leading-tight text-center"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: i === active ? "#F5E6D3" : "rgba(245,230,211,0.4)",
                  maxWidth: "80px",
                  fontSize: i === active ? "13px" : "11px",
                  transition: "all 0.3s ease",
                }}
              >
                {p.name}
              </span>
              {/* Active dot */}
              <div
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{ background: i === active ? "#C17A5C" : "transparent" }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main content: left info + right map */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-14">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">

          {/* LEFT: producer info card */}
          <div
            className={`flex-1 rounded-2xl overflow-hidden relative transition-all duration-500 ${
              animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
            style={{ minHeight: "460px" }}
          >
            {/* Background work image */}
            {producers.map((p, i) => (
              <div
                key={p.id}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: i === active ? 1 : 0 }}
              >
                <img src={p.workImage} alt={p.name} className="w-full h-full object-cover object-top" />
              </div>
            ))}
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E08]/85 via-transparent to-[#1A0E08]/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E08]/98 via-[#1A0E08]/30 to-transparent" />

            {/* Floating stats */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                style={{ background: "rgba(26,14,8,0.85)", color: "#C17A5C", backdropFilter: "blur(8px)" }}
              >
                <i className="ri-map-pin-line text-xs" />
                <span className="truncate max-w-[130px]">{producer.location}</span>
              </div>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                style={{ background: "rgba(26,14,8,0.85)", color: "#C17A5C", backdropFilter: "blur(8px)" }}
              >
                <i className="ri-time-line text-xs" />
                <span>{producer.years} años cultivando</span>
              </div>
            </div>

            {/* Badge top-right */}
            <div
              className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ background: "rgba(193,122,92,0.9)", color: "#FFFDF9" }}
            >
              {producer.badge}
            </div>

            {/* Bottom overlay content */}
            <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-8 pt-16">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1" style={{ background: "rgba(193,122,92,0.4)" }} />
                <span className="text-xs tracking-widest uppercase" style={{ color: "#C17A5C" }}>
                  {producer.region}
                </span>
                <div className="h-px w-8" style={{ background: "rgba(193,122,92,0.4)" }} />
              </div>
              <h3
                className="text-3xl md:text-5xl font-bold mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FFFDF9" }}
              >
                {producer.name}
              </h3>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{
                  color: "#D4C4B0",
                  maxWidth: "480px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {producer.story}
              </p>
              <div className="inline-flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: "#C17A5C" }} />
                <span className="text-sm font-semibold" style={{ color: "#C17A5C" }}>
                  {producer.impact}
                </span>
              </div>
            </div>

            {/* Dot nav + counter at bottom center */}
            <div className="absolute bottom-3 right-6 z-10 flex items-center gap-3">
              <div className="flex gap-1.5">
                {producers.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setAutoplay(false); goTo(i); }}
                    className="cursor-pointer transition-all duration-300 rounded-full"
                    style={{
                      height: "5px",
                      width: i === active ? "22px" : "5px",
                      background: i === active ? "#C17A5C" : "rgba(255,255,255,0.2)",
                    }}
                  />
                ))}
              </div>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                {String(active + 1).padStart(2, "0")} / {String(producers.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* RIGHT: portrait + work image pair */}
          <div
            className={`hidden lg:flex flex-col justify-center items-center gap-5 transition-all duration-500 ${
              animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            style={{ minWidth: "360px" }}
          >
            <div className="flex flex-row gap-3">
              {/* Portrait */}
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{ width: "168px", height: "220px", border: "2px solid rgba(193,122,92,0.6)" }}
              >
                <img src={producer.image} alt={producer.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                  <span
                    className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(26,14,8,0.75)", color: "#C17A5C", backdropFilter: "blur(6px)" }}
                  >
                    Productor
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="flex flex-col items-center justify-center gap-1 px-1">
                <div className="h-8 w-px" style={{ background: "rgba(193,122,92,0.25)" }} />
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(193,122,92,0.15)", border: "1px solid rgba(193,122,92,0.4)" }}
                >
                  <i className="ri-leaf-line text-[11px]" style={{ color: "#C17A5C" }} />
                </div>
                <div className="h-8 w-px" style={{ background: "rgba(193,122,92,0.25)" }} />
              </div>

              {/* Work image */}
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{ width: "168px", height: "220px", border: "2px solid rgba(193,122,92,0.3)" }}
              >
                <img src={producer.workImage} alt={`${producer.name} trabajando`} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                  <span
                    className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(26,14,8,0.75)", color: "#C17A5C", backdropFilter: "blur(6px)" }}
                  >
                    En campo
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Progress bar */}
      {autoplay && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            key={active}
            className="h-full"
            style={{ background: "#C17A5C", animation: "progressBar 5.5s linear forwards" }}
          />
        </div>
      )}

      <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}