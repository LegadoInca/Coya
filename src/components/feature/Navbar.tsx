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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
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

  const navLinks = [
    { key: "nav.producers", id: "producers" },
    { key: "nav.catalog", id: "catalog" },
    { key: "nav.story", id: "story" },
    { key: "nav.contact", id: "contact" },
  ];

  const activeLang = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
      style={{
        background: scrolled ? "rgba(255,253,249,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} className="cursor-pointer">
          <img
            src="/Coya/images/logo.png"
            alt="COYA"
            className="h-10 md:h-12 object-contain"
          />
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => scrollTo(link.id)}
              className="text-sm font-medium cursor-pointer transition-colors whitespace-nowrap"
              style={{ color: scrolled ? "#2C1810" : "#FFFDF9" }}
            >
              {t(link.key)}
            </button>
          ))}
        </div>

        {/* Empresas link */}
        <Link
          to="/empresas"
          className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
          style={{
            background: scrolled ? "rgba(44,24,16,0.10)" : "rgba(255,255,255,0.12)",
            color: scrolled ? "#2C1810" : "#FFFDF9",
            border: scrolled ? "1px solid rgba(44,24,16,0.20)" : "1px solid rgba(255,255,255,0.25)",
            letterSpacing: "0.06em",
          }}
        >
          <i className="ri-building-line" style={{ fontSize: "12px" }} />
          EMPRESAS
        </Link>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold cursor-pointer transition-all whitespace-nowrap"
              style={{
                background: scrolled ? "#F5E6D3" : "rgba(255,255,255,0.15)",
                color: scrolled ? "#2C1810" : "#FFFDF9",
              }}
            >
              <span>{activeLang.flag}</span>
              <span>{activeLang.label}</span>
              <i className="ri-arrow-down-s-line text-xs" />
            </button>
            {langOpen && (
              <div
                className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden shadow-lg z-50"
                style={{ background: "#FFFDF9", minWidth: "120px" }}
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLang(lang.code)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-amber-50 whitespace-nowrap"
                    style={{ color: currentLang === lang.code ? "#C17A5C" : "#2C1810" }}
                  >
                    <span>{lang.flag}</span>
                    <span className="font-medium">{lang.label}</span>
                    {currentLang === lang.code && <i className="ri-check-line ml-auto text-xs" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onCartOpen}
            className="relative w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all"
            style={{
              background: scrolled ? "#F5E6D3" : "rgba(255,255,255,0.15)",
              color: scrolled ? "#2C1810" : "#FFFDF9",
            }}
          >
            <i className="ri-shopping-cart-line text-lg" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold"
                style={{ background: "#C17A5C", color: "#FFFDF9" }}
              >
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
            style={{ color: scrolled ? "#2C1810" : "#FFFDF9" }}
          >
            <i className={`text-xl ${mobileOpen ? "ri-close-line" : "ri-menu-line"}`} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-4 pb-4" style={{ background: "rgba(255,253,249,0.97)" }}>
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => scrollTo(link.id)}
              className="w-full text-left py-3 text-sm font-medium border-b cursor-pointer whitespace-nowrap"
              style={{ color: "#2C1810", borderColor: "#E8DCC8" }}
            >
              {t(link.key)}
            </button>
          ))}
          <Link
            to="/empresas"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 py-3 text-sm font-bold cursor-pointer whitespace-nowrap"
            style={{ color: "#C17A5C" }}
          >
            <i className="ri-building-line" />
            Para Empresas
          </Link>
        </div>
      )}
    </nav>
  );
}