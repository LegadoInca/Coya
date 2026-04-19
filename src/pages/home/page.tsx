import { useRef } from "react";
import { useCart } from "@/hooks/useCart";
import Navbar from "@/components/feature/Navbar";
import CartDrawer from "@/components/feature/CartDrawer";
import CookieBanner from "@/components/feature/CookieBanner";
import HeroSection from "./components/HeroSection";
import ProducersSection from "./components/ProducersSection";
import StoriesSection from "./components/StoriesSection";
import CatalogSection from "./components/CatalogSection";
import ProcessSection from "./components/ProcessSection";
import NewsletterSection from "./components/NewsletterSection";
import FooterSection from "./components/FooterSection";
import TestimonialsSection from "./components/TestimonialsSection";


export default function HomePage() {
  const cart = useCart();
  const producersRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  const scrollToProducers = () => {
    document.getElementById("producers")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2" }}>
      <Navbar cartCount={cart.count} onCartOpen={() => cart.setIsOpen(true)} />
      <CartDrawer
        isOpen={cart.isOpen}
        onClose={() => cart.setIsOpen(false)}
        items={cart.items}
        onRemove={cart.removeItem}
        onUpdateQuantity={cart.updateQuantity}
        total={cart.total}
      />
      <CookieBanner />

      <HeroSection
        onScrollToProducers={scrollToProducers}
        onScrollToCatalog={scrollToCatalog}
      />
      <div ref={producersRef}>
        <ProducersSection />
      </div>
      <StoriesSection />
      <div ref={catalogRef}>
        <CatalogSection onAddToCart={cart.addItem} />
      </div>
      <TestimonialsSection />
      <ProcessSection />
      <NewsletterSection />
      <FooterSection />

      {/* Floating cart button */}
      <button
        onClick={() => cart.setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center rounded-full cursor-pointer transition-all hover:scale-110 z-20"
        style={{ background: "#C17A5C", color: "#FFFDF9" }}
      >
        <i className="ri-shopping-cart-line text-xl" />
        {cart.count > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold"
            style={{ background: "#2C1810", color: "#FFFDF9" }}
          >
            {cart.count}
          </span>
        )}
      </button>
    </div>
  );
}