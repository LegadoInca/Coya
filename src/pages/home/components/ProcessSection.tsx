import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

const STEP_ICONS = [
  "ri-seedling-line",
  "ri-hand-heart-line",
  "ri-flask-line",
  "ri-sun-line",
  "ri-gift-line",
];

const STEP_IMAGES = [
  "/Coya/images/segundo-work.jpeg",
  "/Coya/images/rosa-work.jpeg",
  "/Coya/images/carmen-work.jpeg",
  "/Coya/images/family-segundo.jpeg",
  "/Coya/images/coya3.jpeg",
];

export default function ProcessSection() {
  const { t } = useTranslation();
  const steps = t("process.steps", { returnObjects: true }) as Array<{ title: string; desc: string }>;
  const [active, setActive] = useState(2);

  // Título: sans ligera y la última palabra en serif cursiva
  const titleWords = String(t("process.title")).split(" ");
  const titleTail = titleWords.length > 1 ? titleWords[titleWords.length - 1] : "";
  const titleHead = titleWords.length > 1 ? titleWords.slice(0, -1).join(" ") : titleWords[0];

  const prev = useCallback(() => setActive((a) => (a - 1 + steps.length) % steps.length), [steps.length]);
  const next = useCallback(() => setActive((a) => (a + 1) % steps.length), [steps.length]);

  return (
    <section
      className="relative py-16 md:py-20 overflow-hidden"
      style={{ background: "#FAF7F2", borderTop: "1px solid rgba(42,24,16,0.06)" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-10 h-px" style={{ background: "rgba(176,100,74,0.5)" }} />
            <span className="text-[11px] tracking-[0.3em] uppercase" style={{ color: "#B0644A", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
              {t("process.badge")}
            </span>
            <span className="w-10 h-px" style={{ background: "rgba(176,100,74,0.5)" }} />
          </div>
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              color: "#2A1810",
              fontSize: "clamp(2rem, 4.2vw, 3.6rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
            }}
          >
            {titleHead}{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', 'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "#B0644A",
                letterSpacing: "-0.01em",
                fontSize: "1.06em",
              }}
            >
              {titleTail}
            </em>
          </h2>
        </div>

        {/* Carousel row */}
        <div className="relative flex items-center justify-center gap-0">

          {/* Left arrow */}
          <button
            onClick={prev}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 hover:scale-110 mr-4"
            style={{
              background: "#FFFFFF",
              border: "1.5px solid rgba(42,24,16,0.14)",
              boxShadow: "0 6px 16px rgba(42,24,16,0.08)",
            }}
          >
            <i className="ri-arrow-left-s-line text-xl" style={{ color: "#2A1810" }} />
          </button>

          {/* Steps — desktop: all cards visible; mobile: only active card */}
          <div className="flex items-center justify-center gap-3 flex-1 overflow-hidden py-10">
            {steps.map((step, i) => {
              const isActive = i === active;
              const dist = Math.abs(i - active);
              const opacity = dist === 0 ? 1 : dist === 1 ? 0.88 : 0.62;

              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`relative flex-shrink-0 cursor-pointer transition-all duration-500 overflow-hidden flex flex-col items-center justify-end ${!isActive ? "hidden md:flex" : "flex"}`}
                  style={{
                    width: isActive ? "min(220px, 100%)" : dist === 1 ? "160px" : "130px",
                    height: isActive ? "320px" : dist === 1 ? "220px" : "180px",
                    opacity,
                    borderRadius: "22px",
                    boxShadow: isActive
                      ? "0 18px 34px rgba(42,24,16,0.28)"
                      : "0 10px 26px rgba(42,24,16,0.12)",
                    background: "#1C1008",
                  }}
                >
                  {/* Background image */}
                  <img
                    src={STEP_IMAGES[i]}
                    alt={step.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                    style={{ transform: isActive ? "scale(1.04)" : "scale(1)" }}
                  />

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: isActive
                        ? "linear-gradient(to top, rgba(20,10,2,0.95) 0%, rgba(20,10,2,0.4) 50%, rgba(20,10,2,0.1) 100%)"
                        : "linear-gradient(to top, rgba(20,10,2,0.85) 0%, rgba(20,10,2,0.5) 100%)",
                    }}
                  />

                  {/* Step number badge */}
                  <div
                    className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold z-10"
                    style={{ background: "#C17A5C", color: "#FFFDF9" }}
                  >
                    {i + 1}
                  </div>

                  {/* Active: circular image highlight */}
                  {isActive && (
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-20 h-20 rounded-full overflow-hidden z-10"
                      style={{
                        border: "2.5px solid rgba(193,122,92,0.85)",
                        boxShadow: "0 0 20px rgba(193,122,92,0.4)",
                      }}
                    >
                      <img
                        src={STEP_IMAGES[i]}
                        alt={step.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Icon (non-active) */}
                  {!isActive && (
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full z-10"
                      style={{
                        background: "rgba(193,122,92,0.12)",
                        border: "1.5px solid rgba(193,122,92,0.45)",
                      }}
                    >
                      <i className={`${STEP_ICONS[i]} text-xl`} style={{ color: "#C17A5C" }} />
                    </div>
                  )}

                  {/* Text content */}
                  <div className="relative z-10 w-full px-4 pb-5 text-center">
                    <h4
                      className="mb-2"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        color: "#FFFFFF",
                        fontSize: isActive ? "18px" : "14px",
                      }}
                    >
                      {step.title}
                    </h4>
                    {isActive && (
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.82)", fontFamily: "'Inter', sans-serif", wordBreak: "break-word" }}>
                        {step.desc}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 hover:scale-110 ml-4"
            style={{
              background: "#FFFFFF",
              border: "1.5px solid rgba(42,24,16,0.14)",
              boxShadow: "0 6px 16px rgba(42,24,16,0.08)",
            }}
          >
            <i className="ri-arrow-right-s-line text-xl" style={{ color: "#2A1810" }} />
          </button>
        </div>

        {/* Dot navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="cursor-pointer transition-all duration-300 rounded-full"
              style={{
                width: i === active ? "24px" : "7px",
                height: "7px",
                background: i === active ? "#C17A5C" : "rgba(42,24,16,0.18)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
