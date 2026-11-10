import { CartItem } from "@/hooks/useCart";
import ImpactSimulator from "./ImpactSimulator";
import ProducerTestimonials from "./ProducerTestimonials";

interface ImpactSectionProps {
  cartItems?: CartItem[];
}

export default function ImpactSection({ cartItems = [] }: ImpactSectionProps) {
  return (
    <section
      id="impacto"
      className="relative py-12 md:py-16 overflow-hidden"
      style={{ background: "#FAF7F2", borderTop: "1px solid rgba(42,24,16,0.06)" }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-10 h-px" style={{ background: "rgba(176,100,74,0.5)" }} />
            <span
              className="text-[11px] tracking-[0.3em] uppercase"
              style={{ color: "#B0644A", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
            >
              Impacto & Voces
            </span>
            <span className="w-10 h-px" style={{ background: "rgba(176,100,74,0.5)" }} />
          </div>
          <h2
            className="mb-4"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              color: "#2A1810",
              fontSize: "clamp(2rem, 4.2vw, 3.6rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
            }}
          >
            Cada compra{" "}
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
              transforma vidas
            </em>
          </h2>
          <p
            className="max-w-lg mx-auto leading-relaxed"
            style={{ color: "rgba(42,24,16,0.65)", fontFamily: "'Inter', sans-serif", fontSize: "1rem" }}
          >
            Mueve el slider y descubre el impacto real que genera cada producto que eliges.
            Luego escucha a quienes lo hacen posible.
          </p>
        </div>

        <ImpactSimulator cartItems={cartItems} />
        <ProducerTestimonials />
      </div>
    </section>
  );
}
