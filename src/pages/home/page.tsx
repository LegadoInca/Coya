import { useRef, useState, useCallback } from "react";
import { useCart, CartItem } from "@/hooks/useCart";
import Navbar from "@/components/feature/Navbar";
import CartDrawer from "@/components/feature/CartDrawer";
import CookieBanner from "@/components/feature/CookieBanner";
import AndeanBasketOverlay from "@/components/feature/AndeanBasketOverlay";
import HeroSection from "./components/HeroSection";
import ProducersSection from "./components/ProducersSection";
import StoriesSection from "./components/StoriesSection";
import CatalogSection from "./components/CatalogSection";
import ProcessSection from "./components/ProcessSection";
import NewsletterSection from "./components/NewsletterSection";
import FooterSection from "./components/FooterSection";
import TestimonialsSection from "./components/TestimonialsSection";

const BASKET_BTN_IMG = "https://res.cloudinary.com/djfmngyl0/image/upload/v1776575886/7f22ea6d149000f6efd45e2b2c2062e4_zia9of.jpg";

export default function HomePage() {
  const cart = useCart();
  const producersRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  const scrollToProducers = () => {
    document.getElementById("producers")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddToCart = useCallback((product: Omit<CartItem, "quantity">) => {
    cart.addItem(product);
    // Build the CartItem to show in overlay (quantity will be 1 for new, or current+1)
    const existing = cart.items.find((i) => i.id === product.id);
    const quantity = existing ? existing.quantity + 1 : 1;
    setLastAddedItem({ ...product, quantity });
  }, [cart]);

  const handleBasketClose = useCallback(() => {
    setLastAddedItem(null);
  }, []);

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

      {/* Andean basket overlay — shows when product is added */}
      <AndeanBasketOverlay
        item={lastAddedItem}
        onClose={handleBasketClose}
        cartTotal={cart.total}
        cartCount={cart.count}
      />

      <HeroSection
        onScrollToProducers={scrollToProducers}
        onScrollToCatalog={scrollToCatalog}
      />
      <div ref={producersRef}>
        <ProducersSection />
      </div>
      <StoriesSection />
      <div ref={catalogRef}>
        <CatalogSection onAddToCart={handleAddToCart} cartItems={cart.items} />
      </div>
      <TestimonialsSection />
      <ProcessSection />
      <NewsletterSection />
      <FooterSection />

      {/* Floating basket button */}
      <button
        onClick={() => cart.setIsOpen(true)}
        className="fixed bottom-6 right-6 z-20 cursor-pointer transition-all hover:scale-110 flex flex-col items-center"
        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.35))" }}
      >
        {/* Basket image */}
        <div className="relative" style={{ width: "64px", height: "64px" }}>
          <img
            src={BASKET_BTN_IMG}
            alt="Canasta Andina"
            className="w-full h-full object-cover rounded-full"
            style={{ border: "2.5px solid rgba(193,122,92,0.8)" }}
          />
          {/* Count badge */}
          {cart.count > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
              style={{ background: "#C17A5C", color: "#FFFDF9", border: "2px solid #FAF7F2" }}
            >
              {cart.count}
            </span>
          )}
        </div>
        {/* Label */}
        {cart.count > 0 && (
          <span
            className="mt-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full whitespace-nowrap"
            style={{ background: "#2C1810", color: "#F5C87A" }}
          >
            Mi canasta
          </span>
        )}
      </button>
    </div>
  );
}
