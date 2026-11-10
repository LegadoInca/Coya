import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { producers } from "@/mocks/producers";

const SERIF = "'Instrument Serif', 'Cormorant Garamond', Georgia, serif";
const INK = "#2A1810";
const TERRA = "#C17A5C";
const TERRA_TEXT = "#B0644A";

export default function ProducersSection() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const total = producers.length;

  // Pasa solo (hasta que el usuario toca algo)
  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => setActive((a) => (a + 1) % total), 5500);
    return () => clearInterval(timer);
  }, [autoplay, active, total]);

  const choose = (idx: number) => {
    setAutoplay(false);
    setActive(((idx % total) + total) % total);
  };

  const producer = producers[active];

  // Título: sans y la última palabra en serif cursiva
  const titleWords = String(t("producers.title")).split(" ");
  const titleTail = titleWords.length > 1 ? titleWords[titleWords.length - 1] : "";
  const titleHead = titleWords.length > 1 ? titleWords.slice(0, -1).join(" ") : titleWords[0];

  const scrollToStory = () => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="producers"
      className="relative w-full overflow-hidden"
      style={{ background: "#FAF7F2", borderTop: "1px solid rgba(42,24,16,0.06)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-14 md:pt-20 pb-14 md:pb-20">
        {/* ── Encabezado: etiqueta + título + botón · párrafo + flechas ── */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start mb-8 md:mb-10">
          <div>
            <span
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs mb-5"
              style={{
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(42,24,16,0.08)",
                boxShadow: "0 4px 14px rgba(42,24,16,0.06)",
                color: INK,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
              }}
            >
              <i className="ri-arrow-right-up-line" style={{ color: TERRA }} />
              {t("producers.badge")}
            </span>
            <h2
              className="mb-6"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                color: INK,
                fontSize: "clamp(2rem, 3.8vw, 3.2rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                maxWidth: "560px",
              }}
            >
              {titleHead}{" "}
              <em
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  fontSize: "1.06em",
                }}
              >
                {titleTail}
              </em>
            </h2>
            <button
              onClick={scrollToStory}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full cursor-pointer transition-all hover:bg-[#2A1810] hover:text-white"
              style={{
                border: `1.5px solid ${INK}`,
                color: INK,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              {t("producers.readMore")}
              <i className="ri-arrow-right-line" />
            </button>
          </div>

          <div className="md:ml-auto md:max-w-sm">
            <p
              className="leading-relaxed"
              style={{ color: "rgba(42,24,16,0.7)", fontFamily: "'Inter', sans-serif", fontSize: "14px" }}
            >
              {t("producers.subtitle")}
            </p>
            <div className="flex gap-3 mt-6 md:justify-end">
              <button
                onClick={() => choose(active - 1)}
                aria-label="Anterior"
                className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105"
                style={{ background: "rgba(42,24,16,0.12)", color: INK }}
              >
                <i className="ri-arrow-left-s-line text-xl" />
              </button>
              <button
                onClick={() => choose(active + 1)}
                aria-label="Siguiente"
                className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105"
                style={{ background: "rgba(42,24,16,0.12)", color: INK }}
              >
                <i className="ri-arrow-right-s-line text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Tarjetas verticales (la elegida crece) ── */}
        <div className="q-noscroll flex gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory py-6 -mx-4 px-4 md:mx-0 md:px-0">
          {producers.map((p, i) => {
            const selected = i === active;
            return (
              <button
                key={p.id}
                onClick={() => choose(i)}
                aria-pressed={selected}
                className="relative flex-shrink-0 w-[68%] sm:w-[44%] md:w-auto md:flex-1 snap-center text-left cursor-pointer"
                style={{
                  height: "clamp(340px, 33vw, 430px)",
                  borderRadius: "22px",
                  transform: selected ? "scale(1.07) translateY(-6px)" : "scale(1)",
                  zIndex: selected ? 10 : 1,
                  boxShadow: selected ? "0 26px 56px rgba(42,24,16,0.30)" : "0 10px 26px rgba(42,24,16,0.10)",
                  transition: "transform 0.45s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.45s ease",
                }}
              >
                <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: "22px" }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top" />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, rgba(20,10,6,0) 42%, rgba(20,10,6,0.88) 100%)" }}
                  />
                </div>
                <div className="absolute left-0 right-0 bottom-0 p-4 md:p-5">
                  <p
                    className="leading-snug mb-3"
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "clamp(0.85rem, 1.15vw, 1rem)",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {p.impact}
                  </p>
                  <p style={{ color: "#FFFFFF", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "13px" }}>{p.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Inter', sans-serif", fontSize: "11.5px" }}>{p.badge}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Detalle del productor elegido ── */}
        <div
          key={active}
          className="mt-4 md:mt-6 rounded-3xl p-5 md:p-8 grid md:grid-cols-[170px_1fr_auto] gap-6 md:gap-10 items-center"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(42,24,16,0.08)",
            boxShadow: "0 18px 50px rgba(42,24,16,0.07)",
            animation: "qFadeUp 0.5s ease",
          }}
        >
          <div
            className="relative overflow-hidden mx-auto md:mx-0"
            style={{
              width: "150px",
              height: "190px",
              borderRadius: "75px 75px 20px 20px",
              border: `2px solid rgba(193,122,92,0.45)`,
            }}
          >
            <img src={producer.workImage} alt={`${producer.name} trabajando`} className="w-full h-full object-cover object-top" />
            <span
              className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full whitespace-nowrap"
              style={{ background: "rgba(26,14,8,0.75)", color: "#E8A98C", fontFamily: "'Inter', sans-serif" }}
            >
              En campo
            </span>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] tracking-[0.25em] uppercase" style={{ color: TERRA_TEXT, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                {producer.region}
              </span>
              <span className="h-px flex-1" style={{ background: "rgba(176,100,74,0.25)" }} />
            </div>
            <h3
              className="mb-3"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                color: INK,
                fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
              }}
            >
              {producer.name}
            </h3>
            <p className="leading-relaxed mb-4" style={{ color: "rgba(42,24,16,0.72)", fontFamily: "'Inter', sans-serif", fontSize: "14.5px", maxWidth: "560px" }}>
              {producer.story}
            </p>
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: TERRA }} />
              <span style={{ color: TERRA_TEXT, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "14px" }}>{producer.impact}</span>
            </div>
          </div>

          <div className="flex md:flex-col gap-2 md:items-end flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap"
              style={{ background: "rgba(193,122,92,0.10)", color: TERRA_TEXT, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              <i className="ri-map-pin-line" />
              {producer.location}
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap"
              style={{ background: "rgba(193,122,92,0.10)", color: TERRA_TEXT, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              <i className="ri-time-line" />
              {producer.years} años cultivando
            </span>
            <span className="text-xs md:mt-2" style={{ color: "rgba(42,24,16,0.4)", fontFamily: "'Inter', sans-serif" }}>
              {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de progreso del paso automático */}
      {autoplay && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "rgba(42,24,16,0.08)" }}>
          <div key={active} className="h-full" style={{ background: TERRA, animation: "progressBar 5.5s linear forwards" }} />
        </div>
      )}

      <style>{`
        @keyframes progressBar { from { width: 0%; } to { width: 100%; } }
        @keyframes qFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .q-noscroll { scrollbar-width: none; }
        .q-noscroll::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
