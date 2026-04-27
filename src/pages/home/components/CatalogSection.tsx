import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { products } from "@/mocks/products";
import { CartItem } from "@/hooks/useCart";

interface CatalogSectionProps {
  onAddToCart: (item: Omit<CartItem, "quantity">) => void;
}

// ── Toast ────────────────────────────────────────────────────────────────────
interface ToastData {
  id: number;
  productName: string;
  producerName: string;
}

function CartToast({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: number) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const t1 = setTimeout(() => setVisible(true), 20);
    // Animate out before removing
    const t2 = setTimeout(() => setVisible(false), 3200);
    const t3 = setTimeout(() => onDismiss(toast.id), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [toast.id, onDismiss]);

  return (
    <div
      className="flex items-start gap-3 rounded-2xl px-5 py-4 cursor-pointer"
      onClick={() => { setVisible(false); setTimeout(() => onDismiss(toast.id), 350); }}
      style={{
        background: "linear-gradient(135deg, #8B5E2A 0%, #6B3F1A 60%, #4A2A0E 100%)",
        border: "1px solid rgba(245,200,120,0.35)",
        minWidth: "280px",
        maxWidth: "340px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0) scale(1)" : "translateX(40px) scale(0.95)",
        transition: "opacity 0.35s cubic-bezier(0.34,1.56,0.64,1), transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(245,200,120,0.12)",
      }}
    >
      {/* Icon */}
      <div
        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5"
        style={{ background: "rgba(245,200,120,0.18)", border: "1px solid rgba(245,200,120,0.3)" }}
      >
        <i className="ri-seedling-fill" style={{ color: "#F5C87A", fontSize: "16px" }} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className="font-bold leading-tight mb-1"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "#FFFDF9",
            fontSize: "15px",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          ¡Acabas de apoyar esta historia!
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "#C17A5C" }}>
          Has añadido{" "}
          <span style={{ color: "#F5C87A", fontWeight: 600 }}>«{toast.productName}»</span>{" "}
          a tu canasta. Tu impacto está creciendo.
        </p>
      </div>

      {/* Close hint */}
      <i className="ri-close-line flex-shrink-0 mt-0.5" style={{ color: "rgba(245,200,120,0.4)", fontSize: "14px" }} />
    </div>
  );
}

function ToastContainer({ toasts, onDismiss }: { toasts: ToastData[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div
      className="fixed z-50 flex flex-col gap-3"
      style={{ bottom: "28px", right: "24px" }}
    >
      {toasts.map((t) => (
        <CartToast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function useParallax(strength = 0.25) {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const inView = rect.top < windowH && rect.bottom > 0;
      if (!inView) return;
      const progress = (windowH - rect.top) / (windowH + rect.height);
      setOffset((progress - 0.5) * strength * 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [strength]);

  return { sectionRef, offset };
}

function useScrollReveal(count: number) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(Array(count).fill(false));

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    refs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisible((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * 80);
            obs.disconnect();
          }
        },
        { threshold: 0.12 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [count]);

  return { refs, visible };
}

interface ProductCardProps {
  product: typeof products[0];
  index: number;
  visible: boolean;
  refCallback: (el: HTMLDivElement | null) => void;
  onAddToCart: (product: typeof products[0]) => void;
  addedId: number | null;
}

function ProductCard({ product, visible, refCallback, onAddToCart, addedId }: ProductCardProps) {
  const [storyOpen, setStoryOpen] = useState(false);

  const getBadgeLabel = (badge: string | null) => {
    if (badge === "new") return "Nuevo";
    if (badge === "limited") return "Edición limitada";
    return null;
  };

  return (
    <div
      ref={refCallback}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "#FFFDF9",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: "opacity 0.55s ease, transform 0.55s ease",
      }}
    >
      {/* Image area — product photo OR producer photo, same size */}
      <div
        className="relative overflow-hidden cursor-pointer"
        style={{ height: "220px" }}
        onClick={() => setStoryOpen((v) => !v)}
      >
        {/* Product image */}
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{
            opacity: storyOpen ? 0 : 1,
            transform: storyOpen ? "scale(1.04)" : "scale(1)",
            transition: "opacity 0.45s ease, transform 0.45s ease",
          }}
        />

        {/* Producer image — same size, fades in on top */}
        <img
          src={product.producerImage}
          alt={product.producer}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{
            opacity: storyOpen ? 1 : 0,
            transform: storyOpen ? "scale(1)" : "scale(1.04)",
            transition: "opacity 0.45s ease, transform 0.45s ease",
          }}
        />

        {/* Badges — only when product image is showing */}
        {!storyOpen && product.badge && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold z-10"
            style={{ background: "#C17A5C", color: "#FFFDF9" }}
          >
            {getBadgeLabel(product.badge)}
          </span>
        )}
        {!storyOpen && product.stock > 0 && (
          <span
            className="stock-blink absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 whitespace-nowrap z-10"
            style={{ background: "#DC2626", color: "#fff" }}
          >
            <i className="ri-alarm-warning-line" style={{ fontSize: "11px" }} />
            ¡Solo {product.stock}!
          </span>
        )}

        {/* Overlay — always present, adapts to state */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-4 z-10"
          style={{
            background: storyOpen
              ? "linear-gradient(to top, rgba(20,8,2,0.90) 0%, rgba(20,8,2,0.55) 50%, rgba(20,8,2,0.15) 100%)"
              : "linear-gradient(to top, rgba(20,8,2,0.72) 0%, rgba(20,8,2,0.20) 60%, transparent 100%)",
            transition: "background 0.4s ease",
            pointerEvents: "none",
          }}
        >
          {/* PRODUCT MODE: story title always visible at bottom */}
          <div
            style={{
              position: "absolute",
              bottom: "14px",
              left: "14px",
              right: "14px",
              opacity: storyOpen ? 0 : 1,
              transform: storyOpen ? "translateY(6px)" : "translateY(0)",
              transition: "opacity 0.28s ease, transform 0.28s ease",
              pointerEvents: storyOpen ? "none" : "auto",
            }}
          >
            <div className="flex items-center gap-1.5">
              <i className="ri-heart-line" style={{ color: "#F5C87A", fontSize: "12px" }} />
              <span
                className="font-bold leading-tight"
                style={{
                  color: "#F5C87A",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "15px",
                  textShadow: "0 1px 6px rgba(0,0,0,0.7)",
                }}
              >
                {product.storyTitle}
              </span>
              <i className="ri-arrow-up-s-line" style={{ color: "#F5C87A", fontSize: "13px", flexShrink: 0 }} />
            </div>
          </div>

          {/* STORY MODE: producer photo + story text */}
          <div
            style={{
              opacity: storyOpen ? 1 : 0,
              transform: storyOpen ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s",
              pointerEvents: storyOpen ? "auto" : "none",
            }}
          >
            <p
              className="font-extrabold mb-2 leading-tight"
              style={{
                color: "#F5C87A",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "17px",
                textShadow: "0 1px 6px rgba(0,0,0,0.7)",
              }}
            >
              {product.storyTitle}
            </p>
            <p className="text-xs leading-relaxed mb-2" style={{ color: "rgba(255,253,249,0.93)" }}>
              {product.story}
            </p>
            <div
              className="flex items-center gap-1 text-xs font-semibold cursor-pointer"
              style={{ color: "#F5C87A" }}
              onClick={(e) => { e.stopPropagation(); setStoryOpen(false); }}
            >
              <i className="ri-arrow-down-s-line" />
              <span>Ver producto</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Impact label */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3 self-start"
          style={{ background: "#F0EAE0", border: "1px solid #D4B896" }}
        >
          <div className="w-3 h-3 flex items-center justify-center">
            <i className={product.impactIcon} style={{ color: "#8B5E3C", fontSize: "11px" }} />
          </div>
          <span className="text-xs font-semibold whitespace-nowrap" style={{ color: "#6B3F1E" }}>
            {product.impactLabel}
          </span>
        </div>

        <p className="text-xs mb-1" style={{ color: "#C17A5C" }}>
          <i className="ri-map-pin-line mr-1" />
          {product.origin}
        </p>
        <h3 className="font-bold text-base mb-1 leading-tight" style={{ color: "#2C1810" }}>
          {product.name}
        </h3>
        <p className="text-xs mb-3" style={{ color: "#8B6F5E" }}>
          {product.producer} · {product.weight}
        </p>
        <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: "#8B6F5E" }}>
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#C17A5C" }}
          >
            ${product.price.toFixed(2)} USD
          </span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="relative overflow-hidden flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: addedId === product.id ? "#4A7C59" : product.stock === 0 ? "#E8DCC8" : "#2C1810",
              color: product.stock === 0 ? "#8B6F5E" : "#FFFDF9",
            }}
          >
                  <span className="catalog-btn-shimmer" aria-hidden="true" />
            {addedId === product.id ? (
              <>
                <i className="ri-check-line" />
                ¡Añadido!
              </>
            ) : product.stock === 0 ? (
              "Agotado"
            ) : (
              <>
                <i className="ri-heart-line" />
                {product.ctaLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CatalogSection({ onAddToCart }: CatalogSectionProps) {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [addedId, setAddedId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const toastCounter = useRef(0);

  const filters = ["all", "chocolate", "nibs", "powder", "butter"];

  const filtered = activeFilter === "all"
    ? products
    : products.filter((p) => p.category === activeFilter);

  const { refs, visible } = useScrollReveal(filtered.length);
  const { sectionRef, offset } = useParallax(0.28);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleAdd = (product: typeof products[0]) => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      weight: product.weight,
      producer: product.producer,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);

    // Show toast
    toastCounter.current += 1;
    const newToast: ToastData = {
      id: toastCounter.current,
      productName: product.name,
      producerName: product.producer,
    };
    setToasts((prev) => [...prev.slice(-2), newToast]); // max 3 toasts
  };

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <section ref={sectionRef} id="catalog" className="relative py-12 md:py-16 overflow-hidden" style={{ background: "transparent" }}>
        {/* Background base color */}
        <div className="absolute inset-0 z-0" style={{ background: "transparent" }} />
        {/* Background texture image with parallax */}
        <img
  src="/Coya/images/fondos1.jpg"
  alt=""
  className="absolute inset-0 z-0 w-full h-full object-cover"
  style={{ opacity: 0.85 }}
/>
        {/* Warm brown tint overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "rgba(60,30,10,0.05)",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="w-12 h-px" style={{ background: "#F5C87A" }} />
              <span
                className="text-xs font-bold tracking-[0.25em] uppercase"
                style={{ color: "#F5C87A", letterSpacing: "0.22em" }}
              >
                {t("catalog.badge")}
              </span>
              <span className="w-12 h-px" style={{ background: "#F5C87A" }} />
            </div>
            <h2
              className="mb-5"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#FFFDF9",
                fontWeight: 900,
                fontSize: "clamp(2.8rem, 5vw, 4rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              {t("catalog.title")}
            </h2>
            <p
              className="text-base max-w-xl mx-auto mb-4"
              style={{ color: "rgba(245,230,211,0.75)", fontWeight: 400, lineHeight: 1.6 }}
            >
              {t("catalog.subtitle")}
            </p>

            {/* Hint for story interaction — golden shimmer button */}
            <div className="flex items-center justify-center">
              <span
                className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full overflow-hidden cursor-default select-none"
                style={{
                  background: "linear-gradient(90deg, #B8812A 0%, #F5C87A 40%, #D4A843 70%, #B8812A 100%)",
                  backgroundSize: "200% 100%",
                  border: "1px solid rgba(255,220,120,0.6)",
                  boxShadow: "0 0 20px rgba(245,200,120,0.35), 0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
                  color: "#2C1810",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)",
                    animation: "shimmerSweep 2.2s ease-in-out infinite",
                  }}
                />
                <i className="ri-sparkling-2-fill relative z-10" style={{ fontSize: "14px" }} />
                <span className="relative z-10">Toca la imagen de cada producto para descubrir la historia detrás</span>
                <i className="ri-sparkling-fill relative z-10" style={{ fontSize: "12px" }} />
              </span>
            </div>
          </div>


          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-5 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all whitespace-nowrap"
                style={{
                  background: activeFilter === f ? "#C17A5C" : "rgba(255,255,255,0.08)",
                  color: activeFilter === f ? "#FFFDF9" : "rgba(245,230,211,0.75)",
                  border: activeFilter === f ? "1.5px solid #C17A5C" : "1.5px solid rgba(245,230,211,0.25)",
                }}
              >
                {t(`catalog.filters.${f}`)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                visible={visible[i]}
                refCallback={(el) => { refs.current[i] = el; }}
                onAddToCart={handleAdd}
                addedId={addedId}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
