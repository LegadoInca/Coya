import { useTranslation } from "react-i18next";
import { CartItem } from "@/hooks/useCart";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, qty: number) => void;
  total: number;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemove,
  onUpdateQuantity,
  total,
}: CartDrawerProps) {
  const { t } = useTranslation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "#FAF7F2" }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "#E8DCC8" }}>
          <h2 className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2C1810" }}>
            {t("cart.title")}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-colors hover:bg-black/5"
          >
            <i className="ri-close-line text-xl" style={{ color: "#2C1810" }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full" style={{ background: "#E8DCC8" }}>
                <i className="ri-shopping-cart-line text-2xl" style={{ color: "#C17A5C" }} />
              </div>
              <p className="font-semibold text-lg" style={{ color: "#2C1810" }}>{t("cart.empty")}</p>
              <p className="text-sm" style={{ color: "#8B6F5E" }}>{t("cart.emptyDesc")}</p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2 rounded-full text-sm font-semibold cursor-pointer whitespace-nowrap"
                style={{ background: "#C17A5C", color: "#FFFDF9" }}
              >
                {t("cart.continueShopping")}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-xl" style={{ background: "#FFFDF9" }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight" style={{ color: "#2C1810" }}>{item.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#8B6F5E" }}>{item.producer} · {item.weight}</p>
                    <p className="font-bold mt-1" style={{ color: "#C17A5C" }}>${item.price.toFixed(2)} USD</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full border cursor-pointer"
                        style={{ borderColor: "#E8DCC8", color: "#2C1810" }}
                      >
                        <i className="ri-subtract-line text-xs" />
                      </button>
                      <span className="text-sm font-semibold w-5 text-center" style={{ color: "#2C1810" }}>{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full border cursor-pointer"
                        style={{ borderColor: "#E8DCC8", color: "#2C1810" }}
                      >
                        <i className="ri-add-line text-xs" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="self-start p-1 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                  >
                    <i className="ri-delete-bin-line text-sm" style={{ color: "#2C1810" }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-5 border-t" style={{ borderColor: "#E8DCC8" }}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold" style={{ color: "#2C1810" }}>{t("cart.subtotal")}</span>
              <span className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#C17A5C" }}>
                ${total.toFixed(2)} USD
              </span>
            </div>
            <button
              className="w-full py-3 rounded-full font-semibold text-sm cursor-pointer whitespace-nowrap transition-all hover:opacity-90"
              style={{ background: "#2C1810", color: "#FFFDF9" }}
            >
              {t("cart.checkout")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}