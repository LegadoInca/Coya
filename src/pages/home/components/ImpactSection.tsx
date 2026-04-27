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
      className="relative py-10 md:py-14 overflow-hidden"
      style={{ background: "#1A0D06" }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('/Coya/images/products-bg.jpeg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.45,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,200,120,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-10 h-px" style={{ background: "#F5C87A" }} />
            <span
              className="text-xs font-bold tracking-[0.25em] uppercase"
              style={{ color: "#F5C87A" }}
            >
              Impacto & Voces
            </span>
            <span className="w-10 h-px" style={{ background: "#F5C87A" }} />
          </div>
          <h2
            className="font-bold leading-tight mb-3"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "#F5E6D3",
              fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
              fontWeight: 900,
            }}
          >
            Cada compra{" "}
            <em style={{ color: "#F5C87A", fontStyle: "italic" }}>transforma vidas</em>
          </h2>
          <p
            className="max-w-lg mx-auto leading-relaxed"
            style={{
              color: "rgba(245,230,211,0.60)",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.05rem",
            }}
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
