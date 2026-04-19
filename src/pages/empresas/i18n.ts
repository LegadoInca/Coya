// ─── Shared B2B language type & texts ────────────────────────────────────────
export type B2BLang = "es" | "en" | "de" | "cs";

export const LANG_OPTIONS: { code: B2BLang; label: string; flag: string }[] = [
  { code: "es", label: "ES", flag: "🇵🇪" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "cs", label: "CS", flag: "🇨🇿" },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────
export const HERO_TEXTS: Record<B2BLang, {
  badge: string; title1: string; title2: string; title3: string;
  subtitle: string; cta1: string; cta2: string; back: string;
  stats: { value: string; label: string }[];
}> = {
  es: {
    badge: "Soluciones para Empresas",
    title1: "Cacao de origen",
    title2: "con impacto real",
    title3: "para tu empresa",
    subtitle: "Abastece tu negocio con cacao peruano de alta calidad, trazable desde el árbol hasta tu mesa. Cada caja que compras transforma directamente la vida de familias productoras en los Andes y la Amazonía.",
    cta1: "Ver catálogo por cajas",
    cta2: "Adoptar un cacaotal",
    back: "Volver a tienda personal",
    stats: [
      { value: "12+", label: "Países importadores" },
      { value: "340", label: "Familias productoras" },
      { value: "100%", label: "Trazabilidad directa" },
      { value: "3×", label: "Precio justo vs. mercado" },
    ],
  },
  en: {
    badge: "Business Solutions",
    title1: "Origin cacao",
    title2: "with real impact",
    title3: "for your company",
    subtitle: "Supply your business with high-quality Peruvian cacao, traceable from tree to table. Every box you buy directly transforms the lives of farming families in the Andes and Amazon.",
    cta1: "View box catalog",
    cta2: "Adopt a cacao farm",
    back: "Back to personal store",
    stats: [
      { value: "12+", label: "Importing countries" },
      { value: "340", label: "Farming families" },
      { value: "100%", label: "Direct traceability" },
      { value: "3×", label: "Fair price vs. market" },
    ],
  },
  de: {
    badge: "Unternehmenslösungen",
    title1: "Ursprungs-Kakao",
    title2: "mit echter Wirkung",
    title3: "für Ihr Unternehmen",
    subtitle: "Versorgen Sie Ihr Unternehmen mit hochwertigem peruanischen Kakao, vom Baum bis zum Tisch rückverfolgbar. Jede Kiste, die Sie kaufen, verändert direkt das Leben von Bauernfamilien in den Anden und im Amazonas.",
    cta1: "Kartenkatalog ansehen",
    cta2: "Kakaoplantage adoptieren",
    back: "Zurück zum persönlichen Shop",
    stats: [
      { value: "12+", label: "Importländer" },
      { value: "340", label: "Produzentenfamilien" },
      { value: "100%", label: "Direkte Rückverfolgbarkeit" },
      { value: "3×", label: "Fairer Preis vs. Markt" },
    ],
  },
  cs: {
    badge: "Firemní řešení",
    title1: "Kakao z původu",
    title2: "se skutečným dopadem",
    title3: "pro vaši firmu",
    subtitle: "Zásobte svou firmu vysoce kvalitním peruánským kakaem, sledovatelným od stromu až na stůl. Každá krabice, kterou koupíte, přímo mění životy pěstitelských rodin v Andách a Amazonii.",
    cta1: "Zobrazit katalog krabic",
    cta2: "Adoptovat kakaovník",
    back: "Zpět do osobního obchodu",
    stats: [
      { value: "12+", label: "Dovážející země" },
      { value: "340", label: "Pěstitelské rodiny" },
      { value: "100%", label: "Přímá sledovatelnost" },
      { value: "3×", label: "Spravedlivá cena vs. trh" },
    ],
  },
};

// ─── Catalog ──────────────────────────────────────────────────────────────────
export const CATALOG_TEXTS: Record<B2BLang, {
  badge: string; title: string; subtitle: string;
  filters: Record<string, string>;
  boxLabel: string; minLabel: string; kgBox: string;
  quoteBtn: (n: number) => string;
  totalKg: string; totalPrice: string;
  storyLabel: string;
  bulkTitle: string; bulkDesc: string; bulkCta: string;
  modalTitle: string; modalSending: string; modalSent: string; modalSentDesc: (c: string) => string;
  namePh: string; emailPh: string; companyPh: string; msgPh: string; sendBtn: string;
  hoverHint: string;
}> = {
  es: {
    badge: "Catálogo B2B", title: "Productos por caja",
    subtitle: "Precios mayoristas directos del productor. Sin intermediarios. Con trazabilidad completa y certificaciones internacionales.",
    filters: { all: "Todos", chocolate: "Chocolate", nibs: "Nibs", powder: "Polvo", butter: "Manteca", ceremonial: "Ceremonial", pack: "Packs regalo" },
    boxLabel: "Cajas", minLabel: "mín.", kgBox: "kg / caja",
    quoteBtn: (n) => `Solicitar cotización · ${n} caja${n !== 1 ? "s" : ""}`,
    totalKg: "kg total", totalPrice: "USD total",
    storyLabel: "Historia que apoyas",
    bulkTitle: "¿Necesitas volúmenes mayores o productos personalizados?",
    bulkDesc: "Ofrecemos etiquetado privado, mezclas exclusivas y contratos anuales para pedidos superiores a 100 kg.",
    bulkCta: "Contactar equipo B2B",
    modalTitle: "Solicitar cotización", modalSending: "Enviando...", modalSent: "¡Solicitud enviada!",
    modalSentDesc: (c) => `Te contactaremos en menos de 24h con la cotización para ${c || "tu empresa"}.`,
    namePh: "Tu nombre", emailPh: "Correo corporativo", companyPh: "Nombre de tu empresa",
    msgPh: "Cuéntanos más sobre tu proyecto (opcional)", sendBtn: "Enviar solicitud",
    hoverHint: "Pasa el cursor para conocer al productor",
  },
  en: {
    badge: "B2B Catalog", title: "Products by box",
    subtitle: "Wholesale prices direct from the producer. No middlemen. Full traceability and international certifications.",
    filters: { all: "All", chocolate: "Chocolate", nibs: "Nibs", powder: "Powder", butter: "Butter", ceremonial: "Ceremonial", pack: "Gift packs" },
    boxLabel: "Boxes", minLabel: "min.", kgBox: "kg / box",
    quoteBtn: (n) => `Request quote · ${n} box${n !== 1 ? "es" : ""}`,
    totalKg: "kg total", totalPrice: "USD total",
    storyLabel: "Story you support",
    bulkTitle: "Need larger volumes or custom products?",
    bulkDesc: "We offer private labeling, exclusive blends and annual contracts for orders over 100 kg.",
    bulkCta: "Contact B2B team",
    modalTitle: "Request quote", modalSending: "Sending...", modalSent: "Request sent!",
    modalSentDesc: (c) => `We will contact you within 24h with the quote for ${c || "your company"}.`,
    namePh: "Your name", emailPh: "Corporate email", companyPh: "Company name",
    msgPh: "Tell us more about your project (optional)", sendBtn: "Send request",
    hoverHint: "Hover to meet the producer",
  },
  de: {
    badge: "B2B-Katalog", title: "Produkte pro Karton",
    subtitle: "Großhandelspreise direkt vom Produzenten. Ohne Zwischenhändler. Vollständige Rückverfolgbarkeit und internationale Zertifizierungen.",
    filters: { all: "Alle", chocolate: "Schokolade", nibs: "Nibs", powder: "Pulver", butter: "Butter", ceremonial: "Zeremoniell", pack: "Geschenksets" },
    boxLabel: "Kartons", minLabel: "mind.", kgBox: "kg / Karton",
    quoteBtn: (n) => `Angebot anfragen · ${n} Karton${n !== 1 ? "s" : ""}`,
    totalKg: "kg gesamt", totalPrice: "USD gesamt",
    storyLabel: "Geschichte, die du unterstützt",
    bulkTitle: "Größere Mengen oder individuelle Produkte?",
    bulkDesc: "Wir bieten Eigenmarken, exklusive Mischungen und Jahresverträge für Bestellungen über 100 kg.",
    bulkCta: "B2B-Team kontaktieren",
    modalTitle: "Angebot anfragen", modalSending: "Wird gesendet...", modalSent: "Anfrage gesendet!",
    modalSentDesc: (c) => `Wir melden uns innerhalb von 24h mit dem Angebot für ${c || "Ihr Unternehmen"}.`,
    namePh: "Ihr Name", emailPh: "Geschäftliche E-Mail", companyPh: "Unternehmensname",
    msgPh: "Erzählen Sie uns mehr über Ihr Projekt (optional)", sendBtn: "Anfrage senden",
    hoverHint: "Hover, um den Produzenten kennenzulernen",
  },
  cs: {
    badge: "B2B Katalog", title: "Produkty po krabicích",
    subtitle: "Velkoobchodní ceny přímo od producenta. Bez prostředníků. Plná sledovatelnost a mezinárodní certifikace.",
    filters: { all: "Vše", chocolate: "Čokoláda", nibs: "Nibs", powder: "Prášek", butter: "Máslo", ceremonial: "Ceremoniální", pack: "Dárkové sady" },
    boxLabel: "Krabice", minLabel: "min.", kgBox: "kg / krabice",
    quoteBtn: (n) => `Požádat o nabídku · ${n} krabic${n !== 1 ? "e" : ""}`,
    totalKg: "kg celkem", totalPrice: "USD celkem",
    storyLabel: "Příběh, který podporujete",
    bulkTitle: "Potřebujete větší objemy nebo vlastní produkty?",
    bulkDesc: "Nabízíme soukromé značení, exkluzivní směsi a roční smlouvy pro objednávky nad 100 kg.",
    bulkCta: "Kontaktovat B2B tým",
    modalTitle: "Požádat o nabídku", modalSending: "Odesílání...", modalSent: "Žádost odeslána!",
    modalSentDesc: (c) => `Ozveme se do 24h s nabídkou pro ${c || "vaši společnost"}.`,
    namePh: "Vaše jméno", emailPh: "Firemní e-mail", companyPh: "Název společnosti",
    msgPh: "Řekněte nám více o vašem projektu (volitelné)", sendBtn: "Odeslat žádost",
    hoverHint: "Najeďte myší pro setkání s producentem",
  },
};

// ─── Impact Simulator ─────────────────────────────────────────────────────────
export const IMPACT_TEXTS: Record<B2BLang, {
  badge: string; title: string; subtitle: string;
  volumeLabel: string;
  metrics: { families: string; revenue: string; children: string; trees: string; co2: string };
  reportTitle: string; reportDesc: string; reportCta: string;
}> = {
  es: {
    badge: "Impacto empresarial", title: "Simulador de Impacto B2B",
    subtitle: "Mueve el slider para ver el impacto real de tu volumen de compra en kilos",
    volumeLabel: "VOLUMEN DE COMPRA ESTIMADO",
    metrics: { families: "Familias beneficiadas", revenue: "USD directos al productor", children: "Niños con educación apoyada", trees: "Árboles de cacao preservados", co2: "CO₂ compensado" },
    reportTitle: "¿Quieres un informe de impacto personalizado para tu empresa?",
    reportDesc: "Generamos reportes de sostenibilidad con trazabilidad completa para tu RSE o memoria anual.",
    reportCta: "Solicitar informe",
  },
  en: {
    badge: "Business impact", title: "B2B Impact Simulator",
    subtitle: "Move the slider to see the real impact of your purchase volume in kilos",
    volumeLabel: "ESTIMATED PURCHASE VOLUME",
    metrics: { families: "Families benefited", revenue: "USD direct to producer", children: "Children with education supported", trees: "Cacao trees preserved", co2: "CO₂ offset" },
    reportTitle: "Want a personalized impact report for your company?",
    reportDesc: "We generate sustainability reports with full traceability for your CSR or annual report.",
    reportCta: "Request report",
  },
  de: {
    badge: "Unternehmensauswirkung", title: "B2B-Wirkungssimulator",
    subtitle: "Bewegen Sie den Schieberegler, um die reale Wirkung Ihres Einkaufsvolumens in Kilo zu sehen",
    volumeLabel: "GESCHÄTZTES EINKAUFSVOLUMEN",
    metrics: { families: "Begünstigte Familien", revenue: "USD direkt an Produzenten", children: "Kinder mit Bildungsunterstützung", trees: "Erhaltene Kakaobäume", co2: "CO₂ kompensiert" },
    reportTitle: "Möchten Sie einen personalisierten Wirkungsbericht für Ihr Unternehmen?",
    reportDesc: "Wir erstellen Nachhaltigkeitsberichte mit vollständiger Rückverfolgbarkeit für Ihre CSR oder Jahresbericht.",
    reportCta: "Bericht anfordern",
  },
  cs: {
    badge: "Firemní dopad", title: "B2B Simulátor dopadu",
    subtitle: "Pohybujte posuvníkem a sledujte skutečný dopad vašeho objemu nákupu v kilogramech",
    volumeLabel: "ODHADOVANÝ OBJEM NÁKUPU",
    metrics: { families: "Podpořené rodiny", revenue: "USD přímo producentovi", children: "Děti s podporou vzdělání", trees: "Zachované kakaovníky", co2: "Kompenzovaný CO₂" },
    reportTitle: "Chcete personalizovanou zprávu o dopadu pro vaši firmu?",
    reportDesc: "Vytváříme zprávy o udržitelnosti s plnou sledovatelností pro vaše CSR nebo výroční zprávu.",
    reportCta: "Požádat o zprávu",
  },
};

// ─── Adopt ────────────────────────────────────────────────────────────────────
export const ADOPT_TEXTS: Record<B2BLang, {
  badge: string; title: string; titleEm: string; titleSuffix: string;
  subtitle: string; minMonthly: string; minAnnual: string;
  chooseCacaotal: string; monthly: string; annual: string;
  amountLabel: (mode: string, min: number) => string;
  customAmount: string; annualTotal: string; annualTotalLabel: string;
  impactLabel: string; namePh: string; emailPh: string; companyPh: string;
  adoptMonthly: (a: number) => string; adoptAnnual: (a: number) => string;
  sending: string; contactNote: string;
  thankYou: (c: string) => string; thankYouMsg: (name: string) => string;
  perks: { title: string; desc: string }[];
  ha: string; trees: string; companies: string;
  need: string;
}> = {
  es: {
    badge: "Programa Empresarial", title: "Adopta un", titleEm: "Cacaotal", titleSuffix: "para tu empresa",
    subtitle: "Tu empresa se convierte en guardiana de un cacaotal real en Perú. Trazabilidad completa, informes de impacto y beneficios exclusivos para tu equipo.",
    minMonthly: "$100/mes", minAnnual: "$300/año",
    chooseCacaotal: "Elige el cacaotal a adoptar",
    monthly: "Mensual", annual: "Anual (2 meses gratis)",
    amountLabel: (mode, min) => `Aporte ${mode === "annual" ? "anual" : "mensual"} (USD · mín. $${min})`,
    customAmount: "Otro monto:", annualTotal: "Total anual (10 meses)", annualTotalLabel: "USD",
    impactLabel: "Tu impacto real",
    namePh: "Tu nombre", emailPh: "Correo corporativo", companyPh: "Nombre de tu empresa",
    adoptMonthly: (a) => `Adoptar por $${a.toLocaleString()}/mes`,
    adoptAnnual: (a) => `Adoptar por $${a.toLocaleString()}/año`,
    sending: "Enviando...", contactNote: "Te contactaremos en 24h para coordinar el contrato y el primer informe de impacto.",
    thankYou: (c) => `¡Gracias, ${c}!`,
    thankYouMsg: (name) => `Tu solicitud de adopción del ${name} está registrada. Nuestro equipo te contactará en menos de 24h para coordinar el contrato y enviarte la caja de bienvenida.`,
    perks: [
      { title: "Informe de impacto anual", desc: "Reporte detallado con fotos, datos y trazabilidad para tu RSE" },
      { title: "Visita al cacaotal", desc: "Invitación anual para visitar tu cacaotal adoptado en Perú" },
      { title: "Certificado de adopción", desc: "Documento oficial para tu memoria de sostenibilidad" },
      { title: "Caja de bienvenida", desc: "Pack de productos del cacaotal adoptado para tu equipo" },
    ],
    ha: "ha", trees: "árboles", companies: "empresas", need: "Necesita",
  },
  en: {
    badge: "Corporate Program", title: "Adopt a", titleEm: "Cacao Farm", titleSuffix: "for your company",
    subtitle: "Your company becomes the guardian of a real cacao farm in Peru. Full traceability, impact reports and exclusive benefits for your team.",
    minMonthly: "$100/month", minAnnual: "$300/year",
    chooseCacaotal: "Choose the farm to adopt",
    monthly: "Monthly", annual: "Annual (2 months free)",
    amountLabel: (mode, min) => `${mode === "annual" ? "Annual" : "Monthly"} contribution (USD · min. $${min})`,
    customAmount: "Custom amount:", annualTotal: "Annual total (10 months)", annualTotalLabel: "USD",
    impactLabel: "Your real impact",
    namePh: "Your name", emailPh: "Corporate email", companyPh: "Company name",
    adoptMonthly: (a) => `Adopt for $${a.toLocaleString()}/month`,
    adoptAnnual: (a) => `Adopt for $${a.toLocaleString()}/year`,
    sending: "Sending...", contactNote: "We will contact you within 24h to coordinate the contract and first impact report.",
    thankYou: (c) => `Thank you, ${c}!`,
    thankYouMsg: (name) => `Your adoption request for ${name} is registered. Our team will contact you within 24h to coordinate the contract and send your welcome box.`,
    perks: [
      { title: "Annual impact report", desc: "Detailed report with photos, data and traceability for your CSR" },
      { title: "Farm visit", desc: "Annual invitation to visit your adopted farm in Peru" },
      { title: "Adoption certificate", desc: "Official document for your sustainability report" },
      { title: "Welcome box", desc: "Product pack from the adopted farm for your team" },
    ],
    ha: "ha", trees: "trees", companies: "companies", need: "Needs",
  },
  de: {
    badge: "Unternehmensprogramm", title: "Adoptieren Sie eine", titleEm: "Kakaoplantage", titleSuffix: "für Ihr Unternehmen",
    subtitle: "Ihr Unternehmen wird zum Hüter einer echten Kakaoplantage in Peru. Vollständige Rückverfolgbarkeit, Wirkungsberichte und exklusive Vorteile für Ihr Team.",
    minMonthly: "$100/Monat", minAnnual: "$300/Jahr",
    chooseCacaotal: "Wählen Sie die zu adoptierende Plantage",
    monthly: "Monatlich", annual: "Jährlich (2 Monate gratis)",
    amountLabel: (mode, min) => `${mode === "annual" ? "Jährlicher" : "Monatlicher"} Beitrag (USD · mind. $${min})`,
    customAmount: "Anderer Betrag:", annualTotal: "Jahresgesamt (10 Monate)", annualTotalLabel: "USD",
    impactLabel: "Ihre echte Wirkung",
    namePh: "Ihr Name", emailPh: "Geschäftliche E-Mail", companyPh: "Unternehmensname",
    adoptMonthly: (a) => `Adoptieren für $${a.toLocaleString()}/Monat`,
    adoptAnnual: (a) => `Adoptieren für $${a.toLocaleString()}/Jahr`,
    sending: "Wird gesendet...", contactNote: "Wir kontaktieren Sie innerhalb von 24h zur Vertragskoordination und dem ersten Wirkungsbericht.",
    thankYou: (c) => `Danke, ${c}!`,
    thankYouMsg: (name) => `Ihre Adoptionsanfrage für ${name} ist registriert. Unser Team wird sich innerhalb von 24h melden.`,
    perks: [
      { title: "Jährlicher Wirkungsbericht", desc: "Detaillierter Bericht mit Fotos, Daten und Rückverfolgbarkeit für Ihre CSR" },
      { title: "Plantagenbesuch", desc: "Jährliche Einladung zur Besichtigung Ihrer adoptierten Plantage in Peru" },
      { title: "Adoptionszertifikat", desc: "Offizielles Dokument für Ihren Nachhaltigkeitsbericht" },
      { title: "Willkommensbox", desc: "Produktpaket von der adoptierten Plantage für Ihr Team" },
    ],
    ha: "ha", trees: "Bäume", companies: "Unternehmen", need: "Braucht",
  },
  cs: {
    badge: "Firemní program", title: "Adoptujte", titleEm: "kakaovník", titleSuffix: "pro vaši firmu",
    subtitle: "Vaše firma se stane strážcem skutečné kakaové farmy v Peru. Plná sledovatelnost, zprávy o dopadu a exkluzivní výhody pro váš tým.",
    minMonthly: "$100/měsíc", minAnnual: "$300/rok",
    chooseCacaotal: "Vyberte farmu k adopci",
    monthly: "Měsíčně", annual: "Ročně (2 měsíce zdarma)",
    amountLabel: (mode, min) => `${mode === "annual" ? "Roční" : "Měsíční"} příspěvek (USD · min. $${min})`,
    customAmount: "Jiná částka:", annualTotal: "Roční celkem (10 měsíců)", annualTotalLabel: "USD",
    impactLabel: "Váš skutečný dopad",
    namePh: "Vaše jméno", emailPh: "Firemní e-mail", companyPh: "Název společnosti",
    adoptMonthly: (a) => `Adoptovat za $${a.toLocaleString()}/měsíc`,
    adoptAnnual: (a) => `Adoptovat za $${a.toLocaleString()}/rok`,
    sending: "Odesílání...", contactNote: "Ozveme se do 24h pro koordinaci smlouvy a první zprávy o dopadu.",
    thankYou: (c) => `Děkujeme, ${c}!`,
    thankYouMsg: (name) => `Vaše žádost o adopci ${name} je zaregistrována. Náš tým vás kontaktuje do 24h.`,
    perks: [
      { title: "Roční zpráva o dopadu", desc: "Podrobná zpráva s fotografiemi, daty a sledovatelností pro vaše CSR" },
      { title: "Návštěva farmy", desc: "Roční pozvání k návštěvě vaší adoptované farmy v Peru" },
      { title: "Certifikát o adopci", desc: "Oficiální dokument pro vaši zprávu o udržitelnosti" },
      { title: "Uvítací box", desc: "Balíček produktů z adoptované farmy pro váš tým" },
    ],
    ha: "ha", trees: "stromů", companies: "firem", need: "Potřebuje",
  },
};

// ─── Footer ───────────────────────────────────────────────────────────────────
export const FOOTER_TEXTS: Record<B2BLang, {
  tagline: string; catalog: string; adopt: string; back: string; rights: string;
}> = {
  es: { tagline: "Cacao peruano con impacto real · Programa Empresarial", catalog: "Catálogo B2B", adopt: "Adoptar cacaotal", back: "Tienda personal", rights: "© 2025 COYA · Todos los derechos reservados" },
  en: { tagline: "Peruvian cacao with real impact · Corporate Program", catalog: "B2B Catalog", adopt: "Adopt a farm", back: "Personal store", rights: "© 2025 COYA · All rights reserved" },
  de: { tagline: "Peruanischer Kakao mit echter Wirkung · Unternehmensprogramm", catalog: "B2B-Katalog", adopt: "Plantage adoptieren", back: "Persönlicher Shop", rights: "© 2025 COYA · Alle Rechte vorbehalten" },
  cs: { tagline: "Peruánské kakao se skutečným dopadem · Firemní program", catalog: "B2B Katalog", adopt: "Adoptovat farmu", back: "Osobní obchod", rights: "© 2025 COYA · Všechna práva vyhrazena" },
};
