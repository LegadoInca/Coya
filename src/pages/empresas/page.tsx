import { useState } from "react";
import { B2BLang, LANG_OPTIONS } from "./i18n";
import HeroB2B from "./components/HeroB2B";
import CatalogB2B from "./components/CatalogB2B";
import ImpactSimulatorB2B from "./components/ImpactSimulatorB2B";
import AdoptB2B from "./components/AdoptB2B";
import FooterB2B from "./components/FooterB2B";

export default function EmpresasPage() {
  const [lang, setLang] = useState<B2BLang>("es");
  const [langOpen, setLangOpen] = useState(false);
  const activeLang = LANG_OPTIONS.find((l) => l.code === lang)!;

  return (
    <div className="min-h-screen relative" style={{ background: "#0F0602" }}>

      {/* ── Global language switcher — fixed top-right ── */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setLangOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: "rgba(20,8,2,0.85)",
              border: "1px solid rgba(245,200,120,0.35)",
              color: "#F5C87A",
              backdropFilter: "blur(12px)",
            }}
          >
            <span style={{ fontSize: "16px" }}>{activeLang.flag}</span>
            <span>{activeLang.label}</span>
            {langOpen
              ? <i className="ri-arrow-up-s-line text-xs" />
              : <i className="ri-arrow-down-s-line text-xs" />
            }
          </button>

          {langOpen && (
            <>
              {/* Backdrop to close */}
              <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 rounded-xl overflow-hidden z-50"
                style={{
                  background: "rgba(20,8,2,0.96)",
                  border: "1px solid rgba(193,122,92,0.30)",
                  minWidth: "150px",
                  backdropFilter: "blur(16px)",
                }}
              >
                {LANG_OPTIONS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors whitespace-nowrap"
                    style={{
                      color: lang === l.code ? "#F5C87A" : "rgba(245,230,211,0.70)",
                      background: lang === l.code ? "rgba(245,200,120,0.10)" : "transparent",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{l.flag}</span>
                    <span className="font-medium">{l.label}</span>
                    {lang === l.code && (
                      <i className="ri-check-line ml-auto" style={{ color: "#F5C87A", fontSize: "13px" }} />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <HeroB2B lang={lang} />
      <CatalogB2B lang={lang} />
      <ImpactSimulatorB2B lang={lang} />
      <AdoptB2B lang={lang} />
      <FooterB2B lang={lang} />
    </div>
  );
}
