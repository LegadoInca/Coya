import { useTranslation } from "react-i18next";

export default function FooterSection() {
  const { t } = useTranslation();

  return (
    <footer style={{ background: "#1A1410" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <img
              src="https://res.cloudinary.com/djfmngyl0/image/upload/v1776563722/04b29615-647c-4c59-ae8a-1c4332b6c9ee_czilup.png"
              alt="COYA"
              className="h-12 object-contain mb-4"
            />
            <p className="text-sm leading-relaxed mb-5" style={{ color: "#8B6F5E" }}>
              {t("footer.description")}
            </p>
            <div className="flex gap-3">
              {["ri-instagram-line", "ri-facebook-line", "ri-twitter-x-line"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-all hover:scale-110"
                  style={{ background: "rgba(193,122,92,0.15)", color: "#C17A5C" }}
                >
                  <i className={icon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: "#F5E6D3" }}>
              {t("footer.links")}
            </h5>
            {["nav.producers", "nav.catalog", "nav.story", "nav.contact"].map((key) => (
              <a
                key={key}
                href="#"
                className="block text-sm mb-3 transition-colors hover:text-amber-400 cursor-pointer"
                style={{ color: "#8B6F5E" }}
              >
                {t(key)}
              </a>
            ))}
          </div>

          <div>
            <h5 className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: "#F5E6D3" }}>
              {t("footer.legal")}
            </h5>
            {["footer.terms", "footer.privacy", "footer.shipping", "footer.faq"].map((key) => (
              <a
                key={key}
                href="#"
                className="block text-sm mb-3 transition-colors hover:text-amber-400 cursor-pointer"
                style={{ color: "#8B6F5E" }}
              >
                {t(key)}
              </a>
            ))}
          </div>

          <div>
            <h5 className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: "#F5E6D3" }}>
              {t("footer.follow")}
            </h5>
            <div className="rounded-xl overflow-hidden" style={{ height: "140px" }}>
              <img
                src="https://res.cloudinary.com/djfmngyl0/image/upload/v1776560495/search-image_5_vomacm.jpg"
                alt="COYA Cacao"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "#2C1810" }}>
          <p className="text-xs" style={{ color: "#5A4A42" }}>
            © 2026 COYA. {t("footer.rights")}
          </p>
          <p className="text-xs" style={{ color: "#5A4A42" }}>
            {t("footer.madeIn")} <span style={{ color: "#C17A5C" }}>♥</span> {t("footer.madeInCountry")}
          </p>
        </div>
      </div>

      <div className="overflow-hidden" style={{ height: "80px" }}>
        <p
          className="text-center font-black tracking-widest select-none"
          style={{
            fontSize: "clamp(60px, 12vw, 140px)",
            color: "rgba(255,253,249,0.04)",
            fontFamily: "'Cormorant Garamond', serif",
            lineHeight: 1,
          }}
        >
          COYA
        </p>
      </div>
    </footer>
  );
}