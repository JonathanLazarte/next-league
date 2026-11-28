import { memo } from "react";
import Image from "next/image";
import { usePurchase } from "@/hooks/usePurchase";
import { useI18n } from "@/hooks/useI18n";
import { RESOURCES_URL } from "@/utils/constants";
import "../StoreCard.css";

export interface StoreProfileIcon {
  id: string;
  title: string;
  rarity: number;
  year: number;
  price: { rp: number; be: number };
}

const ProfileIconCard = ({ item, owned = false }: { item: StoreProfileIcon; owned?: boolean }) => {
  const { openPurchaseModal } = usePurchase();
  const { t } = useI18n();

  const handleClick = () => {
    if (owned) return;
    openPurchaseModal({
      id: item.id,
      type: "icon",
      img: `${RESOURCES_URL}/profileicon/${item.id}.png`,
      name: item.title,
      subtitle: t(`profile.rarity.${item.rarity}`),
      value: item.price,
    });
  };

  return (
    <article
      className={`store-card is-icon ${owned ? "owned" : ""}`}
      onClick={handleClick}
    >
      <img
        className="store-card-media store-card-portrait"
        src={`${RESOURCES_URL}/profileicon/${item.id}.png`}
        alt=""
        draggable={false}
        loading="lazy"
        decoding="async"
      />
      <div className="product-info">
        <h4 className="card-name">{item.title}</h4>
        {!owned ? (
          <div className="price">
            <div className="rp-price">
              <div className="currency-icon-wrapper">
                <svg className="rp-icon-card" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.63343 2.25848L6.5001 0.600098L4.36676 2.25848V8.25781L6.5001 9.7405L8.63343 8.25781V2.25848ZM12.0468 6.1152L12.9001 5.49383L10.3401 3.11553V9.11486L7.35343 11.2575V13.4001L12.9001 9.68479L12.0468 8.68634V6.1152ZM2.6601 3.11553L0.100098 5.49383L0.953431 6.1152V8.68634L0.100098 9.68479L5.64676 13.4001V11.2575L2.6601 9.11486V3.11553Z" />
                </svg>
              </div>
              <span className="price-number">{item.price.rp}</span>
            </div>
          </div>
        ) : (
          <div className="owned-status-wrapper">
            <span className="owned-status-badge">{t("common.owned")}</span>
          </div>
        )}
      </div>
      {!owned && (
        <div className="unlock-icon-box">
          <Image width={50} height={50} alt="" className="unlock-product-icon" src="/unlock-icon.png" />
        </div>
      )}
    </article>
  );
};

export default memo(ProfileIconCard);
