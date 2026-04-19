import { Link } from "react-router-dom";
import { B2BLang, FOOTER_TEXTS } from "../i18n";

interface FooterB2BProps { lang: B2BLang; }

export default function FooterB2B({ lang }: FooterB2BProps) {
  const t = FOOTER_TEXTS[lang];

  return (
    <footer className="py-10 px-4 md:px-8" style={{ background: "#0A0401", borderTop: "1px solid rgba(193,122,92,0.12)" }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <img
            src="https://res.cloudinary.com/djfmngyl0/image/upload/v1776563722/04b29615-647c-4c59-ae8a-1c4332b6c9ee_czilup.png"
            alt="COYA"
            className="h-10 object-contain"
            style={{ filter: "brightness(0.85)" }}
          />
          <p className="text-xs" style={{ color: "rgba(184,168,152,0.40)" }}>{t.tagline}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href="#catalogo-b2b" className="text-xs cursor-pointer whitespace-nowrap" style={{ color: "rgba(184,168,152,0.55)" }}>
            {t.catalog}
          </a>
          <a href="#adopta-b2b" className="text-xs cursor-pointer whitespace-nowrap" style={{ color: "rgba(184,168,152,0.55)" }}>
            {t.adopt}
          </a>
          <a href="mailto:empresas@coya.pe" className="text-xs cursor-pointer whitespace-nowrap" style={{ color: "rgba(184,168,152,0.55)" }}>
            empresas@coya.pe
          </a>
          <Link
            to="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold cursor-pointer whitespace-nowrap"
            style={{ background: "rgba(193,122,92,0.15)", color: "#C17A5C", border: "1px solid rgba(193,122,92,0.30)" }}
          >
            <i className="ri-store-2-line" />
            {t.back}
          </Link>
        </div>

        <p className="text-xs text-center md:text-right" style={{ color: "rgba(184,168,152,0.30)" }}>
          {t.rights}
        </p>
      </div>
    </footer>
  );
}
