"use client";

import { memo, useRef, useState, useEffect } from "react";
import { GiPadlock } from "react-icons/gi";
import Image from 'next/image'
import { useSound } from '@/hooks/useSound'

import "./Skin.css";
import { RESOURCES_URL } from "@/utils/constants";
import type { Skin } from '@/types/skin'
import { BORDER_NORMAL_DATA_URI, getRarityGemUri } from "@/utils/uiAssets";

interface SkinCardProps {
  onHoverStart: (skin: Skin, ref: React.RefObject<HTMLDivElement>) => void,
  onHoverEnd: () => void,
  skin: Skin,
  isAdquired: boolean,
  tooltipPosRef: React.MutableRefObject<{x:number, y:number}>,
  priority?: boolean
}

export default memo(function SkinCard({
  onHoverStart,
  onHoverEnd,
  skin,
  isAdquired,
  tooltipPosRef,
  priority = false,
}: SkinCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasImgError, setHasImgError] = useState(false);

  useEffect(() => {
    setHasImgError(false);
  }, [skin.img]);
  const getRem = () => {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  };
  const currentRem = getRem();
  const { play: playGridHover } = useSound("/sfx/sfx-uikit-grid-hover.ogg")

  const handleMouseEnter = () => {
    playGridHover();
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    // Actualizar el ref directamente sin causar re-render
    if (tooltipPosRef) {
      tooltipPosRef.current = {
        x: rect.right - rect.width / 2,
        y: window.innerHeight - rect.top + currentRem * 3,
      };
    }
    onHoverStart(skin, ref);
  }

  return (
    <div
      className={`skin-card ${isAdquired ? "" : "not-obtained"}`}
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`Skin ${skin.name}${isAdquired ? " - Obtenido" : " - No obtenido"}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onHoverEnd}
    >
      {isAdquired ? (
        <img
          width={264}
          height={450}
          alt="Skin card border"
          className="skin-card-border"
          src={BORDER_NORMAL_DATA_URI}
        />
      ) : null}
      {
        <Image
          className={`skin-card-image ${isAdquired ? "" : "not-obtained"} ${hasImgError ? "img-fallback" : ""}`}
          src={hasImgError ? "/global/poro_sad.png" : `${RESOURCES_URL}/loading/${skin.img}`}
          alt={`${skin.name} skin`}
          width={308}
          height={560}
          priority={priority}
          onError={() => setHasImgError(true)}
        />
      }
      {isAdquired ? (
        skin.rarity !== "NoRarity" && getRarityGemUri(skin.rarity) ? (
          <img
            className="skin-card-rarity-image"
            src={getRarityGemUri(skin.rarity)}
            alt={`Rareza ${skin.rarity}`}
            aria-hidden="true"
            width={50}
            height={50}
          />
        ) : null
      ) : (
        <div className="unlock-champion-button" aria-label="Skin bloqueado">
          <GiPadlock
            style={{ transform: "rotate(-45deg)" }}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
});
