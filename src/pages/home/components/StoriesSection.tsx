import { useState } from "react";
import { useTranslation } from "react-i18next";

interface RegionStory {
  id: string;
  name: string;
  group: string;
  families: number;
  x: number;
  y: number;
  people: {
    title: string;
    subtitle: string;
    image: string;
    tag: string;
  }[];
}

const regions: RegionStory[] = [
  {
    id: "cusco",
    name: "Cusco",
    group: "Las Guardianas",
    families: 9,
    x: 52,
    y: 68,
    people: [
      {
        title: "El renacer de María",
        subtitle: "María recuperó su parcela y hoy lidera una cooperativa de mujeres cacaoteras en el Valle de La Convención.",
        tag: "Productora",
        image: "/Coya/images/maria.jpeg",
      },
      {
        title: "Los hijos de María",
        subtitle: "Sus tres hijos crecen entre cacaotales y sueñan con estudiar agronomía para mejorar la cosecha familiar.",
        tag: "Su familia",
        image: "/Coya/images/family-maria.jpeg",
      },
    ],
  },
  {
    id: "ayacucho",
    name: "Ayacucho",
    group: "Las Fundadoras",
    families: 12,
    x: 46,
    y: 57,
    people: [
      {
        title: "El nuevo comienzo de Segundo",
        subtitle: "Segundo revivió sus cacaotales abandonados y hoy exporta a Europa, dando futuro a su familia en las alturas de Ayacucho.",
        tag: "Productor",
        image: "/Coya/images/segundo.jpeg",
      },
      {
        title: "La historia de Félix",
        subtitle: "Félix aprendió a fermentar el cacao a los 14 años. Hoy a los 22 dirige el proceso de secado de toda la cooperativa.",
        tag: "Su familia",
        image: "/Coya/images/family-segundo.jpeg",
      },
    ],
  },
  {
    id: "junin",
    name: "Junín",
    group: "Semilla Nueva",
    families: 8,
    x: 44,
    y: 50,
    people: [
      {
        title: "La fuerza de Rosa",
        subtitle: "Rosa quedó sola con tres hijos en la selva de Junín. Convirtió el tostado artesanal en su sustento y en el orgullo de su comunidad.",
        tag: "Productora",
        image: "/Coya/images/rosa.jpeg",
      },
      {
        title: "Los hijos de Rosa",
        subtitle: "Sus hijos ayudan en la cosecha cada fin de semana. El mayor, Andrés, ya sabe distinguir el cacao maduro solo por el olor.",
        tag: "Su familia",
        image: "/Coya/images/family-rosa.jpeg",
      },
    ],
  },
  {
    id: "sanmartin",
    name: "San Martín",
    group: "Los Guardianes",
    families: 15,
    x: 50,
    y: 36,
    people: [
      {
        title: "El sueño de Elías",
        subtitle: "Elías no pudo estudiar agronomía, pero convirtió el campo en su laboratorio. Hoy exporta a Europa y financia los estudios de sus sobrinos.",
        tag: "Productor",
        image: "/Coya/images/elias.jpeg",
      },
      {
        title: "La historia de Lucía",
        subtitle: "Lucía es la contadora de la cooperativa de San Martín. A sus 28 años gestiona los ingresos de 15 familias cacaoteras.",
        tag: "Su familia",
        image: "/Coya/images/family-elias.jpg",
      },
    ],
  },
  {
    id: "ucayali",
    name: "Ucayali",
    group: "Raíces del Río",
    families: 6,
    x: 58,
    y: 52,
    people: [
      {
        title: "Las manos de Carmen",
        subtitle: "Carmen fundó una cooperativa ribereña en Ucayali. Su manteca de cacao hoy llega a marcas de cosmética en Europa.",
        tag: "Productora",
        image: "/Coya/images/carmen.jpeg",
      },
      {
        title: "Los niños del río",
        subtitle: "Los hijos de las familias de Ucayali crecen junto al río. Gracias a la cooperativa de Carmen, su comunidad tiene agua potable.",
        tag: "Su familia",
        image: "/Coya/images/family-rosa.jpeg",
      },
    ],
  },
];

function PeruMapImage({
  regions: regs,
  activeId,
  onSelect,
  popupRegion,
  activePersonIdx,
  onPersonChange,
  familiesLabel,
}: {
  regions: RegionStory[];
  activeId: string | null;
  onSelect: (id: string) => void;
  popupRegion: RegionStory | null;
  activePersonIdx: number;
  onPersonChange: (idx: number) => void;
  familiesLabel: string;
}) {
  const activePerson = popupRegion ? popupRegion.people[activePersonIdx] : null;

  return (
    <div className="relative w-full h-full">
      {/* Peru map image — warm silhouette */}
      <img
        src="/Coya/images/mapa.png"
        alt="Mapa del Perú"
        className="w-full h-full object-contain"
        style={{
          objectPosition: "70% center",
          filter: "drop-shadow(0 20px 56px rgba(193,122,92,0.45)) brightness(1.08)",
        }}
      />

      {/* Interactive dots */}
      {regs.map((r) => {
        const isActive = activeId === r.id;
        return (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            className="absolute cursor-pointer"
            style={{
              left: `${r.x}%`,
              top: `${r.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
            }}
            title={r.name}
          >
            {/* Pulse rings */}
            {isActive && (
              <>
                <span
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    inset: "-10px",
                    background: "rgba(193,122,92,0.2)",
                    animation: "mapPulse 1.8s ease-out infinite",
                  }}
                />
                <span
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    inset: "-5px",
                    background: "rgba(193,122,92,0.3)",
                    animation: "mapPulse 1.8s ease-out 0.4s infinite",
                  }}
                />
              </>
            )}
            {/* Dot */}
            <span
              className="relative flex items-center justify-center rounded-full transition-all duration-300"
              style={{
                width: isActive ? "20px" : "14px",
                height: isActive ? "20px" : "14px",
                background: isActive ? "#C17A5C" : "rgba(193,122,92,0.8)",
                border: isActive ? "2.5px solid #F5C87A" : "2px solid rgba(245,200,120,0.6)",
                boxShadow: isActive ? "0 0 16px rgba(193,122,92,0.8)" : "0 0 6px rgba(193,122,92,0.4)",
              }}
            >
              {isActive && (
                <span className="rounded-full" style={{ width: "7px", height: "7px", background: "#FFFDF9" }} />
              )}
            </span>
            {/* Name label always visible */}
            <span
              className="absolute left-1/2 whitespace-nowrap px-2 py-0.5 rounded-full pointer-events-none transition-all duration-200"
              style={{
                top: "calc(100% + 5px)",
                transform: "translateX(-50%)",
                background: isActive ? "rgba(193,122,92,0.95)" : "rgba(26,14,8,0.80)",
                color: isActive ? "#FFFDF9" : "rgba(245,230,211,0.8)",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "11px",
                fontWeight: 600,
                border: isActive ? "1px solid rgba(245,200,120,0.5)" : "1px solid rgba(193,122,92,0.25)",
              }}
            >
              {r.name}
            </span>
          </button>
        );
      })}

      {/* Popup cards — one per region, anchored to its dot position on the map */}
      {regs.map((r) => {
        if (activeId !== r.id || !activePerson || popupRegion?.id !== r.id) return null;

        // Decide if card should open upward or downward based on dot Y position
        const openUp = r.y > 55;
        // Decide if card should open left or right based on dot X position
        const openLeft = r.x > 55;

        return (
          <div
            key={`popup-${r.id}`}
            className="absolute rounded-2xl overflow-hidden pointer-events-auto"
            style={{
              left: openLeft ? "auto" : `${r.x}%`,
              right: openLeft ? `${100 - r.x}%` : "auto",
              top: openUp ? "auto" : `${r.y}%`,
              bottom: openUp ? `${100 - r.y}%` : "auto",
              transform: openLeft
                ? openUp ? "translate(10px, -8px)" : "translate(10px, 8px)"
                : openUp ? "translate(-10px, -8px)" : "translate(-10px, 8px)",
              width: "210px",
              zIndex: 30,
              background: "rgba(16,8,3,0.97)",
              border: "1px solid rgba(193,122,92,0.45)",
              backdropFilter: "blur(20px)",
              animation: "fadePopup 0.30s cubic-bezier(0.34,1.56,0.64,1)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(193,122,92,0.15)",
            }}
          >
            {/* Connector line from dot to card */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: "2px",
                height: "20px",
                background: "linear-gradient(to bottom, rgba(193,122,92,0.8), rgba(193,122,92,0))",
                [openUp ? "bottom" : "top"]: "100%",
                [openLeft ? "right" : "left"]: "20px",
              }}
            />

            {/* Photo — big, top */}
            <div className="relative w-full overflow-hidden" style={{ height: "130px" }}>
              <img
                src={activePerson.image}
                alt={activePerson.title}
                className="w-full h-full object-cover object-top"
              />
              {/* Gradient overlay bottom */}
              <div
                className="absolute inset-x-0 bottom-0"
                style={{ height: "55px", background: "linear-gradient(to top, rgba(16,8,3,0.98), transparent)" }}
              />
              {/* Tag badge */}
              <span
                className="absolute top-2 left-2 px-2 py-0.5 rounded-full font-semibold"
                style={{
                  background: "rgba(193,122,92,0.92)",
                  color: "#FFFDF9",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "10px",
                  letterSpacing: "0.05em",
                }}
              >
                {activePerson.tag}
              </span>
              {/* Region name over photo bottom */}
              <span
                className="absolute bottom-2 left-3 font-bold"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "rgba(245,200,120,0.9)",
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {r.name}
              </span>
            </div>

            {/* Text content */}
            <div className="px-3 pt-2.5 pb-2">
              <p
                className="font-bold leading-tight mb-1.5"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#F5C87A",
                  fontSize: "13px",
                }}
              >
                {activePerson.title}
              </p>
              <p
                className="leading-relaxed"
                style={{ color: "rgba(184,168,152,0.80)", fontSize: "10.5px" }}
              >
                {activePerson.subtitle}
              </p>
            </div>

            {/* Tabs */}
            {r.people.length > 1 && (
              <div className="flex" style={{ borderTop: "1px solid rgba(193,122,92,0.18)" }}>
                {r.people.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => onPersonChange(idx)}
                    className="flex-1 py-2 cursor-pointer transition-all"
                    style={{
                      color: activePersonIdx === idx ? "#C17A5C" : "rgba(184,168,152,0.45)",
                      borderTop: activePersonIdx === idx ? "2px solid #C17A5C" : "2px solid transparent",
                      background: "transparent",
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "10.5px",
                      fontWeight: 600,
                    }}
                  >
                    {p.tag}
                  </button>
                ))}
              </div>
            )}

            {/* Footer */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5"
              style={{ borderTop: "1px solid rgba(193,122,92,0.12)" }}
            >
              <i className="ri-map-pin-fill" style={{ color: "#C17A5C", fontSize: "10px" }} />
              <span style={{ color: "#C17A5C", fontSize: "10px", fontWeight: 600 }}>{r.group}</span>
              <span className="ml-auto" style={{ color: "rgba(184,168,152,0.4)", fontSize: "10px" }}>
                {r.families} {familiesLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function StoriesSection() {
  const { t } = useTranslation();
  const [activeRegionId, setActiveRegionId] = useState<string | null>("ayacucho");
  const [activePersonIdx, setActivePersonIdx] = useState(0);

  const activeRegion = regions.find((r) => r.id === activeRegionId) ?? null;

  const handleSelectRegion = (id: string) => {
    if (id === activeRegionId) {
      setActiveRegionId(null);
    } else {
      setActiveRegionId(id);
      setActivePersonIdx(0);
    }
  };

  return (
    <section id="story" className="relative py-2 md:py-4 overflow-hidden">
      {/* Background */}
      <img src="/Coya/images/region.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: "rgba(30,18,8,0.70)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-shrink-0 lg:w-64 flex flex-col gap-4" style={{ position: "relative", zIndex: 50 }}>

            {/* Title block — OUTSIDE the glass panel */}
            <div style={{ position: "relative", zIndex: 50 }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-px" style={{ background: "#C17A5C" }} />
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#C17A5C" }}>
                  {t("stories.badge")}
                </span>
              </div>
              <h2
                className="font-bold leading-tight whitespace-nowrap"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5E6D3", fontSize: "3rem" }}
              >
                {t("stories.mapTitle")}{" "}
                <em style={{ color: "#C17A5C", fontStyle: "italic", fontSize: "3.3rem" }}>{t("stories.mapTitleEm")}</em>
              </h2>
              <p className="text-sm leading-relaxed mt-3" style={{ color: "#B8A898" }}>
                {t("stories.mapSubtitle")}
              </p>
            </div>

            {/* Glass panel — only the region list */}
{/* Hint button — golden shimmer */}
            <div className="flex justify-center mb-3">
              <span
                className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-semibold cursor-default select-none overflow-hidden"
                style={{
                  background: "linear-gradient(90deg, rgba(193,122,92,0.18) 0%, rgba(245,200,120,0.28) 50%, rgba(193,122,92,0.18) 100%)",
                  border: "1px solid rgba(245,200,120,0.55)",
                  color: "#F5C87A",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "12px",
                  letterSpacing: "0.03em",
                  boxShadow: "0 0 14px rgba(245,200,120,0.22), inset 0 0 10px rgba(245,200,120,0.06)",
                }}
              >
                {/* Shimmer sweep */}
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(105deg, transparent 35%, rgba(255,230,140,0.35) 50%, transparent 65%)",
                    animation: "shimmerSweep 2.4s ease-in-out infinite",
                  }}
                />
                <i className="ri-sparkling-2-fill relative z-10" style={{ fontSize: "13px", color: "#F5C87A" }} />
                <span className="relative z-10">Toca un lugar para conocer el nombre detrás</span>
                <i className="ri-sparkling-fill relative z-10" style={{ fontSize: "11px", color: "rgba(245,200,120,0.7)" }} />
              </span>
            </div>

            <div
              className="rounded-2xl px-4 py-4"
              style={{
                background: "rgba(16,7,2,0.55)",
                border: "1px solid rgba(193,122,92,0.18)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            >
            {/* Region list */}
            <div className="flex flex-col gap-1">
              {regions.map((r) => {
                const isActive = activeRegionId === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRegion(r.id)}
                    className="flex items-start gap-4 px-4 py-4 rounded-xl text-left cursor-pointer transition-all duration-300 w-full"
                    style={{
                      background: isActive ? "rgba(193,122,92,0.10)" : "transparent",
                      borderLeft: isActive ? "2px solid #C17A5C" : "2px solid transparent",
                    }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5"
                      style={{
                        background: isActive ? "#C17A5C" : "rgba(193,122,92,0.45)",
                        transition: "background 0.3s ease",
                      }}
                    />
                    <div>
                      <p
                        className="font-bold text-base leading-tight"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          color: isActive ? "#F5E6D3" : "rgba(245,230,211,0.65)",
                          transition: "color 0.3s ease",
                        }}
                      >
                        {r.name}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: isActive ? "#C17A5C" : "rgba(184,168,152,0.6)" }}>
                        {r.group} · {r.families} {t("stories.familiesActive")}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            </div>{/* end glass panel */}
          </div>{/* end left column */}

          {/* ── RIGHT COLUMN: Map ── */}
          <div className="flex-1 flex flex-col items-end justify-start pr-0 lg:pr-8">
            {/* Map container — matches left column height */}
            <div
              className="relative w-full"
              style={{ maxWidth: "620px", height: "700px" }}
            >
              <PeruMapImage
                regions={regions}
                activeId={activeRegionId}
                onSelect={handleSelectRegion}
                popupRegion={activeRegion}
                activePersonIdx={activePersonIdx}
                onPersonChange={setActivePersonIdx}
                familiesLabel={t("stories.families")}
              />
            </div>

            {/* Hint */}
            <p className="text-xs text-center mt-4" style={{ color: "rgba(184,168,152,0.45)" }}>
              <i className="ri-cursor-line mr-1" />
              {t("stories.mapHint")}
            </p>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadePopup {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes mapPulse {
          0%   { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0;   transform: scale(2.4); }
        }
      `}</style>
    </section>
  );
}
