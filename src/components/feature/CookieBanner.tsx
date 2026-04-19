import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function CookieBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("coya_cookies");
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("coya_cookies", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("coya_cookies", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4">
      <div
        className="max-w-3xl w-full rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center gap-4"
        style={{ background: "rgba(42,28,20,0.95)", backdropFilter: "blur(12px)" }}
      >
        <p className="text-sm flex-1 text-center sm:text-left" style={{ color: "#E8DCC8" }}>
          {t("cookies.message")}{" "}
          <a href="#" className="underline" style={{ color: "#C17A5C" }}>
            {t("cookies.policy")}
          </a>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 rounded-full text-sm border whitespace-nowrap cursor-pointer transition-all"
            style={{ borderColor: "#C17A5C", color: "#C17A5C" }}
          >
            {t("cookies.decline")}
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap cursor-pointer transition-all"
            style={{ background: "#C17A5C", color: "#FFFDF9" }}
          >
            {t("cookies.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}