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
  "https://res.cloudinary.com/djfmngyl0/image/upload/v1776560495/search-image_5_vomacm.jpg",
  "https://res.cloudinary.com/djfmngyl0/image/upload/v1776560424/search-image_3_j5xccy.jpg",
  "https://res.cloudinary.com/djfmngyl0/image/upload/v1776560536/search-image_7_fnixmz.jpg",
  "https://res.cloudinary.com/djfmngyl0/image/upload/v1776560597/search-image_9_r6omdu.jpg",
  "https://res.cloudinary.com/djfmngyl0/image/upload/v1776562867/search-image_16_ujjvmu.jpg",
];

export default function ProcessSection() {
  const { t } = useTranslation();
  const steps = t("process.steps", { returnObjects: true }) as Array<{ title: string; desc: string }>;
  const [active, setActive] = useState(2);

  const prev = useCallback(() => setActive((a) => (a - 1 + steps.length) % steps.length), [steps.length]);
  const next = useCallback(() => setActive((a) => (a + 1) % steps.length), [steps.length]);

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Background base dark */}
      <div className="absolute inset-0 z-0" style={{ background: "#1C1008" }} />
      {/* Background texture image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/djfmngyl0/image/upload/v1775318750/pexels-daniel-dan-47825192-7543116_nwuk2v.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.38,
        }}
      />
      {/* Dark golden overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(160deg, rgba(30,16,4,0.72) 0%, rgba(90,50,10,0.45) 50%, rgba(25,12,2,0.70) 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-10 h-px" style={{ background: "#C17A5C" }} />
            <span className="text-xs font-semibold tracking-[0.35em] uppercase" style={{ color: "#C17A5C" }}>
              {t("process.badge")}
            </span>
            <span className="w-10 h-px" style={{ background: "#C17A5C" }} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3" }}
          >
            {t("process.title")}
          </h2>
        </div>

        {/* Carousel row */}
        <div className="relative flex items-center justify-center gap-0">

          {/* Left arrow */}
          <button
            onClick={prev}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 hover:scale-110 mr-4"
            style={{
              background: "rgba(193,122,92,0.15)",
              border: "1.5px solid rgba(193,122,92,0.5)",
            }}
          >
            <i className="ri-arrow-left-s-line text-xl" style={{ color: "#C17A5C" }} />
          </button>

          {/* Steps */}
          <div className="flex items-center justify-center gap-3 flex-1 overflow-hidden">
            {steps.map((step, i) => {
              const isActive = i === active;
              const dist = Math.abs(i - active);
              const opacity = dist === 0 ? 1 : dist === 1 ? 0.65 : 0.35;

              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="relative flex-shrink-0 cursor-pointer transition-all duration-500 rounded-2xl overflow-hidden flex flex-col items-center justify-end"
                  style={{
                    width: isActive ? "220px" : dist === 1 ? "160px" : "130px",
                    height: isActive ? "280px" : dist === 1 ? "220px" : "180px",
                    opacity,
                    border: isActive
                      ? "2px solid rgba(193,122,92,0.9)"
                      : "2px solid rgba(193,122,92,0.2)",
                    boxShadow: isActive
                      ? "0 0 32px rgba(193,122,92,0.25), inset 0 0 0 1px rgba(193,122,92,0.15)"
                      : "none",
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
                  <div className="relative z-10 w-full px-4 pb-4 text-center">
                    <h4
                      className="font-bold mb-1"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        color: "#F5E6D3",
                        fontSize: isActive ? "18px" : "14px",
                      }}
                    >
                      {step.title}
                    </h4>
                    {isActive && (
                      <p className="text-xs leading-relaxed" style={{ color: "#B8A898" }}>
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
              background: "rgba(193,122,92,0.15)",
              border: "1.5px solid rgba(193,122,92,0.5)",
            }}
          >
            <i className="ri-arrow-right-s-line text-xl" style={{ color: "#C17A5C" }} />
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
                background: i === active ? "#C17A5C" : "rgba(193,122,92,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
