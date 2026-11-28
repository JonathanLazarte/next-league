"use client";
import ReactDOM from "react-dom";
import styles from "./ChampionTooltip.module.css";
import { GiAngelWings } from "react-icons/gi";
import { memo, forwardRef, useState, useLayoutEffect } from "react";
import { useI18n } from "@/hooks/useI18n";

type EternalKey = "eternalSeries1" | "eternalSeries2" | "eternalStarter"

interface Champion {
  masteryLevel: number,
  championName: string,
  masteryPoints: number,
  startInfo: string,
  maxSeasonRating: string | "N/D",
  freeToPlay: boolean,
  eternals: EternalKey[]
}

interface TooltipProps {
  content: Champion
  tooltipPos: { x: number, y: number }
  currentDelayType: string
}

const Tooltip = (
  { content, tooltipPos, currentDelayType }: TooltipProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  const { t } = useI18n();
  const [coords, setCoords] = useState(tooltipPos);
  const eternalLabels: Record<EternalKey, string> = {
    eternalSeries1: t("champion.eternalSeries1"),
    eternalSeries2: t("champion.eternalSeries2"),
    eternalStarter: t("champion.eternalStarter"),
  };

  console.log(content)

  useLayoutEffect(() => {
    if (!ref) return

    let tooltipHeight = 0

    if (ref && 'current' in ref && ref.current) {
      tooltipHeight = ref?.current.getBoundingClientRect().height;
    }

    /*const tooltipWidth = ref.current.getBoundingClientRect().width;*/
    /*const championCard = activeChampionRef.current?.getBoundingClientRect();    SE DEBE USAR ESTE REF PARA POSICIONAR EL TOOLTIP Y REMOVER LA FUNCION QUE AHORA ESTA SIENDO USADA EN CHAMPION.JSX*/
    const viewportHeight = window.innerHeight;
    const getRem = () => {
      return parseFloat(getComputedStyle(document.documentElement).fontSize);
    };
    const currentRem = getRem();

    const getPositionY = () => {
      const initialPos = tooltipPos.y;  // Ubicación del elemento al que se le hizo hover.
      const intendedPos = initialPos - tooltipHeight / 2; // intendedPos es la posición que tendra el tooltip sin tomar en cuenta desbordamientos.

      const overflowInTop = intendedPos < 0; // Si intendedPos es negativo, significa que el tooltip se desborda hacia arriba.
      const overflowInBottom = intendedPos + tooltipHeight > viewportHeight; // Si intendedPos + tooltipHeight es mayor que viewportHeight, significa que el tooltip se sale por abajo.

      const upperPosition = intendedPos - tooltipHeight / 2; // Esta es la posición que tendra el tooltip si hay desbordamiento superior.


      if (overflowInTop) {
        return initialPos;
      }
      if (overflowInBottom) {
        return upperPosition + tooltipHeight < viewportHeight
          ? upperPosition
          : viewportHeight - tooltipHeight - 2 * currentRem;
      }

      return intendedPos;
    };

    const newTooltipPos = {
      y: getPositionY(),
      x: tooltipPos.x,
    };
    setCoords(newTooltipPos);
  }, [tooltipPos]);

  return (
    <>
      {typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <div
            ref={ref}
            className={`${styles.tooltip} ${currentDelayType === "initial" ? "initial-delay" : null}`}
            style={{
              top: coords.y,
              left: coords.x,
              position: "fixed",
              animation: `${currentDelayType === "initial" ? "opacity 0.3s" : null}`,
            }}
          >
            {/* Sección superior - Información del campeón */}
            <div className={styles.championSection}>
              <div className={styles.championHeader}>
                <div className={styles.masteryIcon}>
                  <span className={styles.masteryLevel}>
                    {content.masteryLevel}
                  </span>
                </div>
                <h3 className={styles.championName}>{content.championName}</h3>
              </div>
              <div className={styles.separator}></div>
              <div className={styles.championInfo}>
                <div className={styles.masteryPoints}>
                    <svg className={styles.wingIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9998 7.20234L14.3998 6.40234V8.00234L11.9998 10.4023H12.7998V11.2023L11.1998 12.0023V4.80234L15.1998 2.40234V4.80234L11.9998 7.20234ZM6.3998 12.0023V4.00234H9.5998V12.0023L7.9998 13.6023L6.3998 12.0023ZM3.1998 10.4023H3.9998L1.5998 8.00234V6.40234L3.9998 7.20234L0.799805 4.80234V2.40234L4.7998 4.80234V12.0023L3.1998 11.2023V10.4023Z" fill="#F6E1B5"/>
                    </svg>
                  <span>{content.masteryPoints} / 1,800 {t("champion.masteryPointsSuffix")}</span>
                </div>
                <div className={styles.seasonRating}>
                  <span>{t("champion.highestRating")}</span>
                  <span className={styles.ratingValue}>
                    {content.maxSeasonRating}
                  </span>
                </div>
              </div>
            </div>

            {/* Sección media - INICIO */}
            <div className={styles.startSection}>
              <h4 className={styles.sectionTitle}>{t("champion.start")}</h4>
              <div className={styles.startButton}>
                <span>{content.startInfo}</span>
              </div>
              {content.freeToPlay ? (
                <div className={styles.freePlay}>
                  <span className={styles.hexagonIcon}>6</span>
                  <span>{t("champion.playFree")}</span>
                </div>
              ) : null}
            </div>

            {/* Sección inferior - PROGRESIÓN DE ETERNOS */}
            <div className={styles.eternalsSection}>
              <div className={styles.separator}></div>
              <h4 className={styles.eternalsTitle}>{t("champion.eternals")}</h4>
              <div className={styles.eternalsList}>
                {content.eternals.map((eternal, index) => (
                  <div key={index} className={styles.eternalItem}>
                    <span>{eternalLabels[eternal]}</span>
                    <span className={styles.lockIcon}>
                      <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.2 5.39998H2.4V3.79998C2.4 3.37563 2.56857 2.96866 2.86863 2.6686C3.16869 2.36855 3.57565 2.19998 4 2.19998C4.42435 2.19998 4.83131 2.36855 5.13137 2.6686C5.43143 2.96866 5.6 3.37563 5.6 3.79998V5.39998H7.2V3.79998C7.2 2.95128 6.86286 2.13735 6.26274 1.53723C5.66263 0.937115 4.84869 0.599976 4 0.599976C3.15131 0.599976 2.33737 0.937115 1.73726 1.53723C1.13714 2.13735 0.8 2.95128 0.8 3.79998V5.39998H0V11L4 13.4L8 11V5.39998H7.2ZM4.8 10.2V11H3.2V10.2C2.76512 9.76878 2.48403 9.2066 2.4 8.59998C2.4 8.17563 2.56857 7.76866 2.86863 7.4686C3.16869 7.16854 3.57565 6.99998 4 6.99998C4.42435 6.99998 4.83131 7.16854 5.13137 7.4686C5.43143 7.76866 5.6 8.17563 5.6 8.59998C5.51597 9.2066 5.23488 9.76878 4.8 10.2Z"/>
                      </svg>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

const ChampionTooltipWithRef = forwardRef(Tooltip);
ChampionTooltipWithRef.displayName = "ChampionTooltip";
export default memo(ChampionTooltipWithRef);
