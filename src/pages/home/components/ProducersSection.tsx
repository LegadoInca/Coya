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
    return () => clearInterval(t);
  }, [active, autoplay, goTo]);

  const producer = producers[active];

  return (
    <section
      id="producers"
      className="relative w-full overflow-hidden"
      style={{ background: "#1A0E08", minHeight: "100vh" }}
    >
      {/* Background texture image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/djfmngyl0/image/upload/v1775318750/pexels-daniel-dan-47825192-7543116_nwuk2v.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.32,
        }}
      />
      {/* Golden warm overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(135deg, rgba(180,110,40,0.22) 0%, rgba(210,150,60,0.14) 40%, rgba(160,90,20,0.20) 100%)",
        }}
      />
      {/* Section header */}
      <div className="relative z-10 text-center pt-16 pb-8 px-6" style={{ position: "relative" }}>
        <span
          className="text-xs tracking-[0.4em] uppercase font-light mb-3 block"
          style={{ color: "#C17A5C" }}
        >
          {t("producers.badge")}
        </span>
        <h2
          className="text-4xl md:text-5xl font-bold"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3" }}
        >
          {t("producers.title")}
        </h2>
      </div>

      {/* Main showcase */}
      <div className="relative flex flex-col lg:flex-row w-full z-10" style={{ minHeight: "70vh" }}>

        {/* Left: vertical nav thumbnails */}
        <div className="hidden lg:flex flex-col justify-center gap-3 px-6 xl:px-10 py-8 z-20" style={{ minWidth: "160px" }}>
          {producers.map((p, i) => (
            <button
              key={p.id}
              onClick={() => { setAutoplay(false); goTo(i); }}
              className="group relative flex items-center gap-3 cursor-pointer transition-all duration-300"
            >
              {/* Active indicator line */}
              <div
                className="transition-all duration-500 rounded-full flex-shrink-0"
                style={{
                  width: "3px",
                  height: i === active ? "48px" : "24px",
                  background: i === active ? "#C17A5C" : "rgba(255,255,255,0.2)",
                }}
              />
              {/* Thumbnail */}
              <div
                className="relative overflow-hidden rounded-lg flex-shrink-0 transition-all duration-300"
                style={{
                  width: i === active ? "72px" : "52px",
                  height: i === active ? "88px" : "64px",
                  opacity: i === active ? 1 : 0.5,
                  border: i === active ? "2px solid #C17A5C" : "2px solid transparent",
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Name on active */}
              {i === active && (
                <span
                  className="text-xs font-medium leading-tight max-w-[70px]"
                  style={{ color: "#F5E6D3", fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {p.name}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Center: main image + overlay info */}
        <div className="relative flex-1 overflow-hidden" style={{ minHeight: "60vh" }}>
          {/* Background image */}
          {producers.map((p, i) => (
            <div
              key={p.id}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === active ? 1 : 0 }}
            >
              <img
                src={p.workImage}
                alt={p.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          ))}

          {/* Dark gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E08]/80 via-transparent to-[#1A0E08]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E08]/95 via-[#1A0E08]/30 to-transparent" />

          {/* Floating badge top-right — hidden on mobile to avoid clutter */}
          <div
            className="hidden sm:block absolute top-6 right-6 z-10 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{ background: "rgba(193,122,92,0.9)", color: "#FFFDF9" }}
          >
            {producer.badge}
          </div>

          {/* Floating stats — top left, compact on mobile */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
              style={{ background: "rgba(26,14,8,0.80)", color: "#C17A5C", backdropFilter: "blur(8px)" }}
            >
              <i className="ri-map-pin-line text-xs" />
              <span className="truncate max-w-[140px]">{producer.location}</span>
            </div>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
              style={{ background: "rgba(26,14,8,0.80)", color: "#C17A5C", backdropFilter: "blur(8px)" }}
            >
              <i className="ri-time-line text-xs" />
              <span>{producer.years} años cultivando</span>
            </div>
          </div>

          {/* Bottom content overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 z-10 px-5 md:px-8 pb-6 md:pb-10 pt-12 transition-all duration-500 ${
              animating ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
            }`}
          >
            {/* Badge visible only on mobile here */}
            <div className="flex items-center gap-2 mb-3 sm:hidden">
              <span
                className="text-[10px] tracking-widest uppercase px-3 py-1 rounded-full font-semibold"
                style={{ background: "rgba(193,122,92,0.9)", color: "#FFFDF9" }}
              >
                {producer.badge}
              </span>
            </div>

            {/* Connector line */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1" style={{ background: "rgba(193,122,92,0.4)" }} />
              <span className="text-xs tracking-widest uppercase" style={{ color: "#C17A5C" }}>
                {producer.region}
              </span>
              <div className="h-px w-8" style={{ background: "rgba(193,122,92,0.4)" }} />
            </div>

            <h3
              className="text-3xl md:text-5xl font-bold mb-2 md:mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FFFDF9" }}
            >
              {producer.name}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#D4C4B0", maxWidth: "520px" }}>
              {producer.story}
            </p>

            {/* Impact chip */}
            <div className="mt-4 inline-flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                style={{ background: "#C17A5C" }}
              />
              <span className="text-sm font-semibold" style={{ color: "#C17A5C" }}>
                {producer.impact}
              </span>
            </div>
          </div>
        </div>

        {/* Right: side-by-side portraits + navigation */}
        <div
          className="hidden lg:flex flex-col justify-center items-center gap-5 px-6 xl:px-10 py-8 z-20"
          style={{ minWidth: "380px" }}
        >
          {/* Two images side by side */}
          <div
            className={`flex flex-row gap-3 transition-all duration-500 ${
              animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            {/* Portrait image */}
            <div className="flex flex-col gap-2">
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  width: "168px",
                  height: "220px",
                  border: "2px solid rgba(193,122,92,0.6)",
                  flexShrink: 0,
                }}
              >
                <img
                  src={producer.image}
                  alt={producer.name}
                  className="w-full h-full object-cover object-top"
                />
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
            </div>

            {/* Vertical divider */}
            <div className="flex flex-col items-center justify-center gap-1 px-1">
              <div className="h-8 w-px" style={{ background: "rgba(193,122,92,0.25)" }} />
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(193,122,92,0.15)", border: "1px solid rgba(193,122,92,0.4)" }}
              >
                <i className="ri-leaf-line text-[11px]" style={{ color: "#C17A5C" }} />
              </div>
              <div className="h-8 w-px" style={{ background: "rgba(193,122,92,0.25)" }} />
            </div>

            {/* Work image */}
            <div className="flex flex-col gap-2">
              <div
                className="relative overflow-hidden rounded-2xl"
                style={{
                  width: "168px",
                  height: "220px",
                  border: "2px solid rgba(193,122,92,0.3)",
                  flexShrink: 0,
                }}
              >
                <img
                  src={producer.workImage}
                  alt={`${producer.name} trabajando`}
                  className="w-full h-full object-cover object-top"
                />
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

          {/* Dot navigation */}
          <div className="flex flex-row gap-2 items-center mt-1">
            {producers.map((_, i) => (
              <button
                key={i}
                onClick={() => { setAutoplay(false); goTo(i); }}
                className="cursor-pointer transition-all duration-300 rounded-full"
                style={{
                  height: "6px",
                  width: i === active ? "28px" : "6px",
                  background: i === active ? "#C17A5C" : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>

          {/* Counter */}
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {String(active + 1).padStart(2, "0")} / {String(producers.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Mobile: bottom thumbnail strip */}
      <div className="flex lg:hidden flex-col items-center gap-4 px-5 py-5">
        {/* Thumbnails row */}
        <div className="flex justify-center gap-3 overflow-x-auto w-full pb-1">
          {producers.map((p, i) => (
            <button
              key={p.id}
              onClick={() => { setAutoplay(false); goTo(i); }}
              className="flex-shrink-0 relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300"
              style={{
                width: i === active ? "68px" : "48px",
                height: i === active ? "84px" : "60px",
                border: i === active ? "2px solid #C17A5C" : "2px solid rgba(193,122,92,0.2)",
                opacity: i === active ? 1 : 0.45,
              }}
            >
              <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top" />
            </button>
          ))}
        </div>

        {/* Active producer name + counter */}
        <div className="flex items-center gap-3">
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            {String(active + 1).padStart(2, "0")} / {String(producers.length).padStart(2, "0")}
          </span>
          <div className="w-px h-3" style={{ background: "rgba(193,122,92,0.4)" }} />
          <span
            className="text-sm font-semibold"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3" }}
          >
            {producer.name}
          </span>
        </div>

        {/* Dot navigation */}
        <div className="flex gap-2 items-center">
          {producers.map((_, i) => (
            <button
              key={i}
              onClick={() => { setAutoplay(false); goTo(i); }}
              className="cursor-pointer transition-all duration-300 rounded-full"
              style={{
                height: "5px",
                width: i === active ? "24px" : "5px",
                background: i === active ? "#C17A5C" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="pb-10 lg:pb-14" />

      {/* Progress bar */}
      {autoplay && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div
            key={active}
            className="h-full"
            style={{
              background: "#C17A5C",
              animation: "progressBar 5.5s linear forwards",
            }}
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
