import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import i18n from "@/i18n";

const LANGUAGES = [
  { code: "es", label: "ES", flag: "🇵🇪" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "cs", label: "CS", flag: "🇨🇿" },
];

// Enlaces del menú (la pastilla activa sigue la sección que se está viendo)
const NAV_LINKS = [
  { key: "nav.home", id: "hero" },
  { key: "nav.producers", id: "producers" },
  { key: "nav.catalog", id: "catalog" },
  { key: "nav.story", id: "story" },
  { key: "nav.contact", id: "contact" },
];

const TERRACOTTA = "#C17A5C";
const INK = "#2A1810";
const CREAM = "#FAF7F2"; // mismo crema de la sección de Productores

// true = la barra es crema desde el inicio (también sobre el video del hero)
// false = transparente sobre el hero y crema al bajar
const CREAM_ON_HERO = false;

const pillStyle = (active: boolean, cream = false): React.CSSProperties => ({
  background: active ? TERRACOTTA : cream ? "rgba(42,24,16,0.06)" : "rgba(255,255,255,0.14)",
  color: active ? "#FFFFFF" : cream ? INK : "#FFFFFF",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: `1px solid ${active ? "transparent" : cream ? "rgba(42,24,16,0.08)" : "rgba(255,255,255,0.10)"}`,
  fontFamily: "'Inter', sans-serif",
  fontWeight: 500,
  fontSize: "14px",
});

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
}

export default function Navbar({ cartCount, onCartOpen }: NavbarProps) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("es");
  const [activeId, setActiveId] = useState("hero");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      // sección activa: la más cercana por encima del 35 % de la pantalla
      const line = window.innerHeight * 0.35;
      let best = "hero";
      let bestTop = -Infinity;
      NAV_LINKS.forEach((l) => {
        const el = document.getElementById(l.id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top <= line && top > bestTop) {
          best = l.id;
          bestTop = top;
        }
      });
      setActiveId(best);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    setCurrentLang(code);
    setLangOpen(false);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const activeLang = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
  const cream = scrolled || CREAM_ON_HERO;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${scrolled ? "shadow-sm" : ""}`}
      style={{
        background: cream ? "rgba(250,247,242,0.96)" : "transparent",
        backdropFilter: cream ? "blur(12px)" : "none",
        borderBottom: cream ? "1px solid rgba(42,24,16,0.08)" : "1px solid transparent",
      }}
    >
      <div className="max-w-[1500px] mx-auto px-4 md:px-8 h-12 md:h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={() => scrollTo("hero")} className="cursor-pointer flex-shrink-0">
          <img src="/Coya/images/logo.png" alt="Qantari" className="h-8 md:h-9 object-contain" />
        </button>

        {/* Pastillas de navegación (centro) */}
        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => (
            <button
              key={link.key}
              onClick={() => scrollTo(link.id)}
              className="px-5 py-2 rounded-full cursor-pointer transition-all duration-300 whitespace-nowrap hover:brightness-125"
              style={pillStyle(activeId === link.id, cream)}
            >
              {t(link.key)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 md:gap-3">
          {/* Banderas — escritorio */}
          <div className="hidden lg:flex items-center gap-2 animate-flag-float">
            <img src="https://flagcdn.com/w40/pe.png" alt="Peru" className="w-9 h-6 rounded-sm object-cover shadow-sm" />
            <img src="https://flagcdn.com/w40/cz.png" alt="Czech Republic" className="w-9 h-6 rounded-sm object-cover shadow-sm" />
          </div>

          {/* Idioma */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full cursor-pointer transition-all whitespace-nowrap"
              style={pillStyle(false, cream)}
            >
              <span>{activeLang.flag}</span>
              <span>{activeLang.label}</span>
              <i className="ri-arrow-down-s-line text-xs" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden shadow-lg z-50" style={{ background: "#FFFDF9", minWidth: "120px" }}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLang(lang.code)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-amber-50 whitespace-nowrap"
                    style={{ color: currentLang === lang.code ? TERRACOTTA : "#2C1810" }}
                  >
                    <span>{lang.flag}</span>
                    <span className="font-medium">{lang.label}</span>
                    {currentLang === lang.code && <i className="ri-check-line ml-auto text-xs" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Carrito */}
          <button
            onClick={onCartOpen}
            className="relative w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all"
            style={{ ...pillStyle(false, cream), padding: 0 }}
          >
            <i className="ri-shopping-cart-line text-lg" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold"
                style={{ background: TERRACOTTA, color: "#FFFDF9" }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Empresas — pastilla blanca (como el botón de la referencia) */}
          <Link
            to="/empresas"
            className="hidden md:flex items-center gap-1.5 px-5 py-2 rounded-full cursor-pointer transition-all whitespace-nowrap hover:scale-[1.03]"
            style={{ background: cream ? INK : "#FFFFFF", color: cream ? "#FFFFFF" : "#3A2A22", fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "14px" }}
          >
            <i className="ri-building-line" style={{ fontSize: "14px" }} />
            Empresas
          </Link>

          {/* Banderas — móvil */}
          <div className="md:hidden flex items-center gap-1.5 animate-flag-float">
            <img src="https://flagcdn.com/w40/pe.png" alt="Peru" className="w-6 h-4 rounded-sm object-cover shadow-sm" />
            <img src="https://flagcdn.com/w40/cz.png" alt="Czech Republic" className="w-6 h-4 rounded-sm object-cover shadow-sm" />
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
            style={{ color: cream ? INK : "#F5E6D3" }}
          >
            <i className={`text-xl ${mobileOpen ? "ri-close-line" : "ri-menu-line"}`} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-4 pb-4" style={{ background: CREAM, borderBottom: "1px solid rgba(42,24,16,0.08)" }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.key}
              onClick={() => scrollTo(link.id)}
              className="w-full text-left py-3 text-sm cursor-pointer whitespace-nowrap"
              style={{ color: activeId === link.id ? "#B0644A" : INK, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              {t(link.key)}
            </button>
          ))}
          <Link
            to="/empresas"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 py-3 text-sm font-bold cursor-pointer whitespace-nowrap"
            style={{ color: "#B0644A", fontFamily: "'Inter', sans-serif" }}
          >
            <i className="ri-building-line" />
            Para Empresas
          </Link>
        </div>
      )}
    </nav>
  );
}
