import { useState, useRef } from "react";
import { productsB2B } from "@/mocks/productsB2B";
import { B2BLang, CATALOG_TEXTS } from "../i18n";

interface CatalogB2BProps { lang: B2BLang; }

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  bestseller: { bg: "#C17A5C", color: "#FFFDF9" },
  popular:    { bg: "#8B5E2A", color: "#FFFDF9" },
  premium:    { bg: "#4A2A0E", color: "#F5C87A" },
  exclusivo:  { bg: "#2C1810", color: "#F5C87A" },
  regalo:     { bg: "#4A7C59", color: "#FFFDF9" },
};

interface QuoteRequest { productId: number; boxes: number; }

// ─── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({
  product, onQuote, t,
}: {
  product: typeof productsB2B[0];
  onQuote: (req: QuoteRequest) => void;
  t: typeof CATALOG_TEXTS["es"];
}) {
  const [boxes, setBoxes] = useState(product.minBoxes);
  const [hovered, setHovered] = useState(false);
  const badge = product.badge ? BADGE_STYLES[product.badge] : null;
  const totalKg = product.kgPerBox * boxes;
  const totalPrice = product.pricePerBox * boxes;

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{ background: "rgba(20,8,2,0.72)", border: "1px solid rgba(245,200,120,0.14)", backdropFilter: "blur(6px)" }}
    >
      {/* Image area: hover reveals producer photo */}
      <div
        className="relative overflow-hidden"
        style={{ height: "220px", cursor: "default" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Product image */}
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{
            opacity: hovered ? 0 : 1,
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "opacity 0.45s ease, transform 0.55s ease",
            filter: "brightness(0.88)",
          }}
        />
        {/* Producer image */}
        <img
          src={product.producerImage}
          alt={product.producerPerson}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "scale(1)" : "scale(1.06)",
            transition: "opacity 0.45s ease, transform 0.55s ease",
          }}
        />

        {/* Badge */}
        {badge && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold z-10"
            style={{ background: badge.bg, color: badge.color, opacity: hovered ? 0 : 1, transition: "opacity 0.3s ease" }}
          >
            {product.badge}
          </span>
        )}

        {/* Kg badge */}
        <div
          className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold z-10"
          style={{
            background: "rgba(10,4,1,0.82)", color: "#F5C87A",
            border: "1px solid rgba(245,200,120,0.28)",
            opacity: hovered ? 0 : 1, transition: "opacity 0.3s ease",
          }}
        >
          {product.kgPerBox} {t.kgBox}
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: hovered
              ? "linear-gradient(to top, rgba(10,4,1,0.92) 0%, rgba(10,4,1,0.50) 45%, rgba(10,4,1,0.10) 100%)"
              : "linear-gradient(to top, rgba(10,4,1,0.65) 0%, rgba(10,4,1,0.10) 55%, transparent 100%)",
            transition: "background 0.45s ease",
            pointerEvents: "none",
          }}
        />

        {/* Hover hint */}
        <div
          className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5"
          style={{ opacity: hovered ? 0 : 1, transition: "opacity 0.25s ease", pointerEvents: "none" }}
        >
          <i className="ri-heart-line" style={{ color: "#F5C87A", fontSize: "11px" }} />
          <span className="text-xs font-semibold" style={{ color: "#F5C87A", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
            {t.storyLabel}
          </span>
        </div>

        {/* Producer story on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.4s ease 0.08s, transform 0.4s ease 0.08s",
            pointerEvents: "none",
          }}
        >
          <p
            className="font-bold mb-0.5 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5C87A", fontSize: "1.05rem", textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
          >
            {product.producerPerson}
          </p>
          <p className="text-xs mb-1.5" style={{ color: "rgba(245,200,120,0.80)" }}>{product.producerRole}</p>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,253,249,0.90)", textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>
            {product.producerStory}
          </p>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        <p className="text-xs mb-1" style={{ color: "#C17A5C" }}>
          <i className="ri-map-pin-line mr-1" />{product.origin}
        </p>
        <h3 className="font-bold leading-tight mb-1.5" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FFFDF9", fontSize: "1.05rem" }}>
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0" style={{ border: "1px solid rgba(245,200,120,0.30)" }}>
            <img src={product.producerImage} alt={product.producerPerson} className="w-full h-full object-cover object-top" />
          </div>
          <span className="text-xs" style={{ color: "rgba(245,230,211,0.52)" }}>
            {product.producerPerson} · {product.producerRole}
          </span>
        </div>
        <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(245,230,211,0.60)" }}>{product.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.certifications.map((c) => (
            <span key={c} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(245,200,120,0.08)", color: "rgba(245,200,120,0.68)", border: "1px solid rgba(245,200,120,0.14)" }}>
              {c}
            </span>
          ))}
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-black" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5C87A", fontSize: "1.55rem" }}>
            ${product.pricePerBox.toFixed(2)}
          </span>
          <span className="text-xs" style={{ color: "rgba(245,230,211,0.38)" }}>
            / {t.boxLabel.toLowerCase()} · {product.unitsPerBox} uds · {product.kgPerBox} kg
          </span>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: "rgba(245,230,211,0.48)" }}>
              {t.boxLabel} ({t.minLabel} {product.minBoxes})
            </span>
            <span className="text-xs font-bold" style={{ color: "#F5C87A" }}>
              {totalKg.toFixed(1)} {t.totalKg} · ${totalPrice.toFixed(2)} {t.totalPrice}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setBoxes(Math.max(product.minBoxes, boxes - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
              style={{ background: "rgba(245,200,120,0.10)", color: "#F5C87A", border: "1px solid rgba(245,200,120,0.20)" }}>
              <i className="ri-subtract-line text-sm" />
            </button>
            <span className="flex-1 text-center font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FFFDF9", fontSize: "1.2rem" }}>{boxes}</span>
            <button onClick={() => setBoxes(boxes + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer"
              style={{ background: "rgba(245,200,120,0.10)", color: "#F5C87A", border: "1px solid rgba(245,200,120,0.20)" }}>
              <i className="ri-add-line text-sm" />
            </button>
          </div>
        </div>

        <div className="rounded-xl px-3 py-2.5 mb-4" style={{ background: "rgba(168,197,160,0.07)", border: "1px solid rgba(168,197,160,0.15)" }}>
          <div className="flex items-start gap-2">
            <i className="ri-seedling-line flex-shrink-0 mt-0.5" style={{ color: "#A8C5A0", fontSize: "12px" }} />
            <p className="text-xs leading-relaxed" style={{ color: "rgba(168,197,160,0.85)" }}>{product.impactPerBox}</p>
          </div>
        </div>

        <button
          onClick={() => onQuote({ productId: product.id, boxes })}
          className="w-full py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all hover:opacity-90 whitespace-nowrap mt-auto"
          style={{ background: "linear-gradient(135deg, #C17A5C 0%, #8B4520 100%)", color: "#FFFDF9", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}
        >
          <i className="ri-mail-send-line mr-2" />
          {t.quoteBtn(boxes)}
        </button>
      </div>
    </div>
  );
}

// ─── QuoteModal ───────────────────────────────────────────────────────────────
function QuoteModal({ request, onClose, t }: { request: QuoteRequest | null; onClose: () => void; t: typeof CATALOG_TEXTS["es"] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  if (!request) return null;
  const product = productsB2B.find((p) => p.id === request.productId);
  if (!product) return null;
  const totalKg = product.kgPerBox * request.boxes;
  const totalPrice = product.pricePerBox * request.boxes;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const body = new URLSearchParams({ name, email, company, product: product.name, boxes: String(request.boxes), totalKg: `${totalKg.toFixed(1)} kg`, totalPrice: `$${totalPrice.toFixed(2)} USD`, message });
    try {
      await fetch("https://readdy.ai/api/form/b2b-quote-coya-01", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
    } catch { /* silent */ }
    setSent(true);
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,4,1,0.82)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: "linear-gradient(160deg, #1E0C04 0%, #2C1810 100%)", border: "1px solid rgba(193,122,92,0.3)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(193,122,92,0.15)" }}>
          <div>
            <h3 className="font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3", fontSize: "1.2rem" }}>{t.modalTitle}</h3>
            <p className="text-xs mt-0.5" style={{ color: "rgba(184,168,152,0.55)" }}>{product.name} · {request.boxes} · {totalKg.toFixed(1)} kg · ${totalPrice.toFixed(2)}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(245,230,211,0.5)" }}>
            <i className="ri-close-line" />
          </button>
        </div>
        <div className="px-6 py-5">
          {!sent ? (
            <form data-readdy-form id="b2b-quote-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input type="hidden" name="product" value={product.name} />
              <input type="hidden" name="boxes" value={String(request.boxes)} />
              <input type="hidden" name="totalKg" value={`${totalKg.toFixed(1)} kg`} />
              <input type="hidden" name="totalPrice" value={`$${totalPrice.toFixed(2)} USD`} />
              <input type="text" name="name" required placeholder={t.namePh} value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "#F5E6D3" }} />
              <input type="email" name="email" required placeholder={t.emailPh} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "#F5E6D3" }} />
              <input type="text" name="company" required placeholder={t.companyPh} value={company} onChange={(e) => setCompany(e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "#F5E6D3" }} />
              <textarea name="message" placeholder={t.msgPh} value={message} onChange={(e) => setMessage(e.target.value.slice(0, 500))} rows={3} maxLength={500} className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", color: "#F5E6D3" }} />
              <p className="text-right text-xs" style={{ color: "rgba(184,168,152,0.35)" }}>{message.length}/500</p>
              <button type="submit" disabled={sending} className="w-full py-3.5 rounded-xl font-semibold cursor-pointer transition-all whitespace-nowrap" style={{ background: "linear-gradient(135deg, #C17A5C, #8B4520)", color: "#FFFDF9", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}>
                {sending ? t.modalSending : t.sendBtn}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(168,197,160,0.15)" }}>
                <i className="ri-check-line" style={{ color: "#A8C5A0", fontSize: "24px" }} />
              </div>
              <h4 className="font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3", fontSize: "1.3rem" }}>{t.modalSent}</h4>
              <p className="text-sm" style={{ color: "rgba(184,168,152,0.70)" }}>{t.modalSentDesc(company)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CatalogB2B({ lang }: CatalogB2BProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const t = CATALOG_TEXTS[lang];
  const filterKeys = ["all", "chocolate", "nibs", "powder", "butter", "ceremonial", "pack"];
  const filtered = activeFilter === "all" ? productsB2B : productsB2B.filter((p) => p.category === activeFilter);

  return (
    <section id="catalogo-b2b" className="relative py-16 md:py-24 overflow-hidden">
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/Coya/videos/hero1.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0" style={{ background: "rgba(8,3,1,0.52)", zIndex: 1 }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(44,24,16,0.25) 0%, rgba(8,3,1,0.05) 50%, rgba(44,24,16,0.25) 100%)", zIndex: 1 }} />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8" style={{ zIndex: 2 }}>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-10 h-px" style={{ background: "#C17A5C" }} />
            <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#C17A5C" }}>{t.badge}</span>
            <span className="w-10 h-px" style={{ background: "#C17A5C" }} />
          </div>
          <h2 className="font-black mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#FFFDF9", fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
            {t.title}
          </h2>
          <p className="max-w-lg mx-auto text-sm leading-relaxed" style={{ color: "rgba(245,230,211,0.60)" }}>{t.subtitle}</p>
          <div className="flex items-center gap-2 mt-3 justify-center">
            <i className="ri-cursor-line" style={{ color: "#F5C87A", fontSize: "14px" }} />
            <span className="text-xs" style={{ color: "rgba(245,230,211,0.50)" }}>{t.hoverHint}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filterKeys.map((fk) => (
            <button key={fk} onClick={() => setActiveFilter(fk)}
              className="px-5 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all whitespace-nowrap"
              style={{
                background: activeFilter === fk ? "#C17A5C" : "rgba(255,255,255,0.07)",
                color: activeFilter === fk ? "#FFFDF9" : "rgba(245,230,211,0.65)",
                border: activeFilter === fk ? "1.5px solid #C17A5C" : "1.5px solid rgba(245,230,211,0.15)",
              }}
            >
              {t.filters[fk]}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onQuote={setQuoteRequest} t={t} />
          ))}
        </div>

        {/* Bulk note */}
        <div className="mt-10 rounded-2xl px-6 py-5 flex flex-col md:flex-row items-center gap-4" style={{ background: "rgba(245,200,120,0.06)", border: "1px solid rgba(245,200,120,0.15)" }}>
          <i className="ri-truck-line flex-shrink-0" style={{ color: "#F5C87A", fontSize: "24px" }} />
          <div className="flex-1 text-center md:text-left">
            <p className="font-semibold text-sm" style={{ color: "#F5E6D3" }}>{t.bulkTitle}</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(245,230,211,0.50)" }}>{t.bulkDesc}</p>
          </div>
          <a href="mailto:empresas@coya.pe" className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer whitespace-nowrap" style={{ background: "#C17A5C", color: "#FFFDF9" }}>
            {t.bulkCta}
          </a>
        </div>
      </div>

      {quoteRequest && <QuoteModal request={quoteRequest} onClose={() => setQuoteRequest(null)} t={t} />}
    </section>
  );
}
