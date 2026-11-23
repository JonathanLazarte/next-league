"use client";

import { useState, memo, useLayoutEffect } from "react";
import { useSound } from "@/hooks/useSound";
import { useI18n } from "@/hooks/useI18n";

import ModeSelector from "./ModeSelector";
import Pvp from "./rooms/pvp/PvpLobby";
import PlayBackground from "./PlayBackground";

import "./play.css";
import { GAME_DATA } from '@/utils/constants'
import { useMatchmaking } from "@/hooks/useMatchmaking";


export default memo(function Play(){
  const { queue } = useMatchmaking()
  const [categorySelected, setCategorySelected] = useState("PVP");
  const [ zone, setZone ] = useState<"mode-selector" | "lobby">("mode-selector")
  const { play: playMenuClick } = useSound("/general/menu-click.mp3");
  const { t } = useI18n();

  const handleCategoryChange = (category: string) => {
    playMenuClick();
    GAME_DATA[category as keyof typeof GAME_DATA] && setCategorySelected(category)
  };
  const comebackToSelection = () => {
    setZone("mode-selector")
  }
  const comebackToLobby = () => {
    setZone("lobby")
  }

  const PlaySelectionLayer = () => {
    return (
      <section className="play-selection-modes">
        <header className="mode-selection-header">
          <div
            className={`subheader-tab ${categorySelected === "PVP" ? "active-subheader-tab" : ""}`}
            onClick={() => handleCategoryChange("PVP")}
            /*onMouseEnter={() => playConfirmButtonHover()}*/
          >
            {t("play.categories.PVP")}
          </div>
          <div
            className={`subheader-tab ${categorySelected === "CO_OP_VS_AI" ? "active-subheader-tab" : ""}`}
            onClick={() => handleCategoryChange("CO_OP_VS_AI")}
            /*onMouseEnter={() => playConfirmButtonHover()}*/
          >
            {t("play.categories.CO_OP_VS_AI")}
          </div>
        </header>
        <ModeSelector comeback={comebackToLobby} data={GAME_DATA[categorySelected as keyof typeof GAME_DATA]} />
      </section>
    );
  };

  useLayoutEffect(() => {
    if (queue && zone !== "lobby") {
      setZone("lobby")
    }
  }, [queue])


  const activeGameMode = Object.keys(GAME_DATA).find(key => GAME_DATA[key as keyof typeof GAME_DATA]?.some(map => map.queues?.some(q => q.name === queue)));

  return (
    <div className="play-screen-container">
      <PlayBackground zone={zone} />
      {zone === 'mode-selector' && <PlaySelectionLayer />}
      {activeGameMode === "PVP" && zone === 'lobby' && (
        <Pvp
          comeback={comebackToSelection}
        />
      )}
      {activeGameMode === "CO_OP_VS_AI" && zone === 'lobby' && (
        <Pvp
          comeback={comebackToSelection}
        />
      )}
    </div>
  );
});
