"use client";

import "./store.css";
import { useState, memo } from "react";
import dynamic from "next/dynamic";
import { IoIosGift } from "react-icons/io";
import { MdOutlineManageAccounts } from "react-icons/md";
import { useSound } from "@/hooks/useSound";
import { useI18n } from "@/hooks/useI18n";
import Loading from "@/components/Loading/Loading";
import "./champions/champions.css";
import "./skins/skins.css";

/*const ChampionsStore = dynamic(
  () => import("./championsStore/championsStore"),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);*/
import ChampionsStore from './champions/Champions'
const SkinsStore = dynamic(() => import("./skins/Skins"), {
  loading: () => <Loading />,
  ssr: false,
});

export default memo(function Store() {
  const [actualSection, setActualSection] = useState("campeones");
  const { play } = useSound("/general/menu-click.mp3");
  const { t } = useI18n();

  return (
    <section className="store">
      <header className="store-header">
        <div className="sections-items">
          <div
            className={`subheader-tab ${actualSection === "campeones" ? "active-subheader-tab" : null}`}
            onClick={() => {
              setActualSection("campeones");
              play();
            }}
          >
            {t("sections.champions")}
          </div>
          <div
            className={`subheader-tab ${actualSection === "aspectos" ? "active-subheader-tab" : null}`}
            onClick={() => {
              setActualSection("aspectos");
              play();
            }}
          >
            {t("sections.skins")}
          </div>
        </div>
        <div className="right-items">
          <button type="button" className="buy-rp-button not-available" disabled>{t("common.buyRp")}</button>
          <button type="button" className="rounded-button not-available" disabled aria-label="Gift unavailable">
            <IoIosGift className="rounded-icon" />
          </button>
          <button type="button" className="rounded-button not-available" disabled aria-label="Account management unavailable">
            <MdOutlineManageAccounts className="rounded-icon" />
          </button>
        </div>
      </header>

      {actualSection == "campeones" && <ChampionsStore />}
      {actualSection == "aspectos" && <SkinsStore />}
    </section>
  );
});
