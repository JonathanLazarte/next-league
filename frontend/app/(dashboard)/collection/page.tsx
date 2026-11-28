"use client";

import "./collection.css";
import { useState, memo } from "react";
import { useSound } from "@/hooks/useSound";
import { useI18n } from "@/hooks/useI18n";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading/Loading";
import ChampionsSection from './champions/Champions'
import { useDecodeAssetGroup } from "@/hooks/useDecodeAssetGroup";
const SkinsSection = dynamic(
  () => import("./skins/Skins"),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);
const IconsSection = dynamic(
  () => import("./icons/Icons"),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);

export default memo(function Collection() {
  useDecodeAssetGroup("championDetails");
  const { t } = useI18n();
  const [actualSubSection, setActualSubSection] = useState("campeones");
  const subSections = [
    { id: "campeones", label: "sections.champions" },
    { id: "aspectos", label: "sections.skins" },
    { id: "iconos", label: "sections.icons" },
  ] as const;
  const { play } = useSound("/sfx/menu-click.mp3");
  type SubSectionId = (typeof subSections)[number]["id"]

  const handleClick = (section: SubSectionId) => {
    play();
    setActualSubSection(section);
  }

  return (
    <section className="collection">
      <header className="collection-header">
        {subSections.map((section) => (
          <div
            key={section.id}
            className={`subheader-tab ${actualSubSection === section.id ? "active-subheader-tab" : null}`}
            onClick={() => handleClick(section.id)}
          >
            {t(section.label)}
          </div>
        ))}
      </header>
      {actualSubSection == "aspectos" && <SkinsSection></SkinsSection>}
      {actualSubSection == "campeones" && <ChampionsSection></ChampionsSection>}
      {actualSubSection == "iconos" && <IconsSection />}
    </section>
  );
});
