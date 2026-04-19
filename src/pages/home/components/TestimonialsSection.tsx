import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const testimonials = [
  {
    id: 1,
    name: "Sophie Müller",
    location: "Berlín, Alemania",
    avatar: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776563123/a023b09f226d986b3467f597f42dae6f_lgxd5p.jpg",
    text: "Compré una manta andina y quedé sin palabras. La calidad es extraordinaria, pero lo que más me llegó fue la historia de María. Saber que mi compra ayuda a su familia hace que el producto valga el doble.",
    stars: 5,
  },
  {
    id: 2,
    name: "Emma Thompson",
    location: "Londres, Reino Unido",
    avatar: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776563122/2bff1bf4d60dae695b9c40e9d7357c81_wncs21.jpg",
    text: "The earrings I bought are stunning, but what truly moved me was reading about the artisan who made them. I feel connected to a real story every time I wear them. Absolutely beautiful and meaningful.",
    stars: 5,
  },
  {
    id: 3,
    name: "James O\'Brien",
    location: "Dublín, Irlanda",
    avatar: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776563097/5c38c7ba39008d6bd40e141f53bd791c_dz8jdu.jpg",
    text: "I bought a friend a gift and they couldn\'t stop talking about it. The packaging, the story card, the quality — everything felt intentional and beautiful. This is what conscious shopping looks like.",
    stars: 5,
  },
  {
    id: 4,
    name: "Fiona Hernández",
    location: "Ciudad de México, México",
    avatar: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776563097/49c9046fe95f72b159f80d83c67d29d4_lnehtn.jpg",
    text: "El chocolate ceremonial es una experiencia espiritual. Cada sorbo me conecta con algo más profundo. Saber que viene directamente de comunidades andinas le da un sabor completamente diferente.",
    stars: 5,
  },
  {
    id: 5,
    name: "Luca Bianchi",
    location: "Milán, Italia",
    avatar: "https://res.cloudinary.com/djfmngyl0/image/upload/v1776563097/9e826c618a9df4ce90d55ed97435a4f2_hepkyp.jpg",
    text: "Ho ordinato i nibs di cacao e sono rimasto senza parole. La qualità è eccezionale e sapere che ogni acquisto supporta direttamente le famiglie produttrici rende tutto ancora più speciale.",
    stars: 5,
  },
];

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number, dir: "left" | "right") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setActive(idx);
      setAnimating(false);
    }, 320);
  };

  const prev = () => {
    const idx = (active - 1 + testimonials.length) % testimonials.length;
    goTo(idx, "left");
  };

  const next = () => {
    const idx = (active + 1) % testimonials.length;
    goTo(idx, "right");
  };

  useEffect(() => {
    autoRef.current = setInterval(() => {
      setDirection("right");
      setAnimating(true);
      setTimeout(() => {
        setActive((a) => (a + 1) % testimonials.length);
        setAnimating(false);
      }, 320);
    }, 5000);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [active]);

  const getCard = (offset: number) => {
    const idx = (active + offset + testimonials.length) % testimonials.length;
    return testimonials[idx];
  };

  const centerCard = getCard(0);
  const leftCard = getCard(-1);
  const rightCard = getCard(1);

  return (
    <section className="relative overflow-hidden" style={{ background: "#2C1810" }}>
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://res.cloudinary.com/djfmngyl0/video/upload/v1773436299/14701095_1920_1080_30fps_amrqfg.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{ opacity: 0.7 }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 z-0" style={{ background: "rgba(20,8,2,0.45)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-8 h-px" style={{ background: "#C17A5C" }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#C17A5C" }}>
              {t("testimonials.badge")}
            </span>
            <span className="w-8 h-px" style={{ background: "#C17A5C" }} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-extrabold"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FFFDF9" }}
          >
            {t("testimonials.title")}
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center gap-2 md:gap-6">
          {/* Prev button */}
          <button
            onClick={prev}
            className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all hover:scale-110 flex-shrink-0 z-10"
            style={{ background: "rgba(255,253,249,0.12)", color: "#FFFDF9", border: "1px solid rgba(255,253,249,0.2)" }}
          >
            <i className="ri-arrow-left-s-line text-lg" />
          </button>

          {/* Cards row */}
          <div className="flex items-center justify-center gap-4 flex-1 overflow-hidden" style={{ minHeight: "300px" }}>
            {/* Left ghost card */}
            <div
              className="hidden md:block rounded-2xl p-6 flex-shrink-0 cursor-pointer transition-all duration-300"
              style={{
                width: "260px",
                background: "rgba(255,253,249,0.07)",
                border: "1px solid rgba(255,253,249,0.1)",
                opacity: 0.5,
                transform: "scale(0.92)",
                filter: "blur(1px)",
              }}
              onClick={prev}
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: leftCard.stars }).map((_, i) => (
                  <i key={i} className="ri-star-fill text-xs" style={{ color: "#F59E0B" }} />
                ))}
              </div>
              <p className="text-xs leading-relaxed mb-4 line-clamp-4" style={{ color: "rgba(255,253,249,0.7)" }}>
                &ldquo;{leftCard.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={leftCard.avatar}
                  alt={leftCard.name}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <p className="text-xs font-bold" style={{ color: "#FFFDF9" }}>{leftCard.name}</p>
                  <p className="text-xs" style={{ color: "rgba(255,253,249,0.5)" }}>{leftCard.location}</p>
                </div>
              </div>
            </div>

            {/* Center active card */}
            <div
              className="rounded-2xl p-6 md:p-7 w-full md:flex-shrink-0"
              style={{
                maxWidth: "340px",
                background: "#FFFDF9",
                opacity: animating ? 0 : 1,
                transform: animating
                  ? `translateX(${direction === "right" ? "-30px" : "30px"})`
                  : "translateX(0) scale(1)",
                transition: "opacity 0.32s ease, transform 0.32s ease",
                zIndex: 2,
              }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: centerCard.stars }).map((_, i) => (
                  <i key={i} className="ri-star-fill text-sm" style={{ color: "#F59E0B" }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#3D1F10", wordBreak: "break-word" }}>
                &ldquo;{centerCard.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={centerCard.avatar}
                  alt={centerCard.name}
                  className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                  style={{ border: "2px solid #C17A5C" }}
                />
                <div>
                  <p className="text-sm font-bold" style={{ color: "#2C1810" }}>{centerCard.name}</p>
                  <p className="text-xs" style={{ color: "#8B6F5E" }}>{centerCard.location}</p>
                </div>
              </div>
            </div>

            {/* Right ghost card */}
            <div
              className="hidden md:block rounded-2xl p-6 flex-shrink-0 cursor-pointer transition-all duration-300"
              style={{
                width: "260px",
                background: "rgba(255,253,249,0.07)",
                border: "1px solid rgba(255,253,249,0.1)",
                opacity: 0.5,
                transform: "scale(0.92)",
                filter: "blur(1px)",
              }}
              onClick={next}
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: rightCard.stars }).map((_, i) => (
                  <i key={i} className="ri-star-fill text-xs" style={{ color: "#F59E0B" }} />
                ))}
              </div>
              <p className="text-xs leading-relaxed mb-4 line-clamp-4" style={{ color: "rgba(255,253,249,0.7)" }}>
                &ldquo;{rightCard.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={rightCard.avatar}
                  alt={rightCard.name}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <p className="text-xs font-bold" style={{ color: "#FFFDF9" }}>{rightCard.name}</p>
                  <p className="text-xs" style={{ color: "rgba(255,253,249,0.5)" }}>{rightCard.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={next}
            className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all hover:scale-110 flex-shrink-0 z-10"
            style={{ background: "rgba(255,253,249,0.12)", color: "#FFFDF9", border: "1px solid rgba(255,253,249,0.2)" }}
          >
            <i className="ri-arrow-right-s-line text-lg" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > active ? "right" : "left")}
              className="cursor-pointer transition-all duration-300 rounded-full"
              style={{
                width: i === active ? "24px" : "8px",
                height: "8px",
                background: i === active ? "#C17A5C" : "rgba(255,253,249,0.3)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
