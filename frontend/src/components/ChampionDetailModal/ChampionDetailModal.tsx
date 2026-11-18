"use client";



import React, { useState, useEffect, memo, useRef } from "react";
import { createPortal } from 'react-dom'
import Image from 'next/image'
import useLoadingDelay from '@/hooks/useLoadingDelay'

import styles from "./ChampionDetailModal.module.css";
import "./ChampionDetailModal.css";
import { usePurchase } from "@/hooks/usePurchase";
import { useUserChampions } from "@/hooks/useUserChampions";
import { useUserSkins } from "@/hooks/useUserSkins";
import { useI18n } from "@/hooks/useI18n";
/*aspectos imports*/
import { GiPadlock } from "react-icons/gi";
import { IoArrowForward } from "react-icons/io5";
import { RESOURCES_URL } from "@/utils/constants";
import type { Champion } from '@/types/champion'
import { useSound } from '@/hooks/useSound'
import { BUTTON_X_DATA_URI, BUTTON_X_OVER_DATA_URI, BUTTON_X_DOWN_DATA_URI } from '@/utils/uiAssets'
import MediaSlot from '@/components/MediaSlot/MediaSlot'


export const CloseModalButton = ({ onClose }: { onClose: () => void }) => {
  const [buttonState, setButtonState] = useState('idle')
  const handleMouseEnter = () => {
    setButtonState('hovered');
  }
  const handleMouseLeave = () => {
    setButtonState('idle');
  }
  const handleClick = () => {
    setButtonState('pressed');
    onClose();
  }
  return (<div
    className={styles.closeButton}
    onClick={handleClick}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    <img src={BUTTON_X_DATA_URI} alt="" className={buttonState === 'idle' ? styles.closeIcon : styles.closeIconHidden} />
    <img src={BUTTON_X_OVER_DATA_URI} alt="" className={buttonState === 'hovered' ? styles.closeIcon : styles.closeIconHidden} />
    <img src={BUTTON_X_DOWN_DATA_URI} alt="" className={buttonState === 'pressed' ? styles.closeIcon : styles.closeIconHidden} />
  </div>)
}

interface ResumenTabProps {
  champion: Champion,
  splashSrc: string,
  isChampionInCollection: boolean,
  onUnlockChampion: () => void
}

const ResumenTab = memo(function ResumenTab({
  champion,
  splashSrc,
  isChampionInCollection,
  onUnlockChampion,
}: ResumenTabProps) {
  const { t } = useI18n();
  const difficulty = champion?.info.difficulty;

  return (
    <div className={styles.content}>
      <MediaSlot variant="hero" className={styles.splashSlot}>
        <img src={splashSrc} alt="" />
      </MediaSlot>
      <div className={styles.splashScrim} />
      {/* Left Panel - Information */}
      <div className={styles.leftPanel}>
        <div className={styles.graphics}>
          <div className={styles.info}>
            <div className={styles.damageType}>
              <span className={styles.damageLabel}>{t("champion.damage")}</span>
              <span className={styles.damageValue}>{t("champion.physical")}</span>
            </div>
            <div className={styles.styleSection}>
              <span className={styles.styleLabel}>{t("champion.style")}</span>
              <div className={styles.styleSlider}>
                <div className={styles.meleeIcon}>
                  <img
                    alt=""
                    src="/champion-details/continuum_icon_attackspeed.png"
                    width={17}
                    height={17}
                    decoding="sync"
                  />
                </div>
                <div className={styles.sliderTrack}>
                  <div
                    className={styles.sliderThumb}
                    style={{ left: "40%" }}
                  ></div>
                </div>
                <div className={styles.rangedIcon}>
                  <img
                    alt=""
                    src="/champion-details/continuum_icon_abilitypower_grey.png"
                    width={17}
                    height={17}
                    decoding="sync"
                  />
                </div>
              </div>
            </div>
            <div className={styles.difficultySection}>
              <span className={styles.difficultyLabel}>{t("champion.difficulty")}</span>
              <div className={styles.difficultyBar}>
                {difficulty > 0 && difficulty <= 4 ? (
                  <img
                    src="/champion-details/difficultygraph_difficulty1.png"
                    className={styles.difficultyLevel}
                    alt=""
                    width={136}
                    height={5}
                    decoding="sync"
                  />
                  ): null}
                {difficulty > 4 && difficulty <= 7 ? (
                  <img
                    className={styles.difficultyLevel}
                    src="/champion-details/difficultygraph_difficulty2.png"
                    alt=""
                    width={136}
                    height={5}
                    decoding="sync"
                    />
                ) : null}
                {difficulty > 7 ? (
                  <img
                    className={styles.difficultyLevel}
                    src="/champion-details/difficultygraph_difficulty3.png"
                    alt=""
                    width={136}
                    height={5}
                    decoding="sync"
                    />
                ) : null}
              </div>
            </div>
          </div>
          <div className={styles.statsRadar}>
            <div className={styles.radarChart}>
              {[
                { name: "damage", value: 3, hover_icon: 'cdp-graph-damage-hover' },
                { name: "toughness", value: 2, hover_icon: 'cdp-graph-toughness-hover' },
                { name: "crowd-control", value: 3, hover_icon: 'cdp-graph-crowd-control-hover' },
                { name: "mobility", value: 1, hover_icon: 'cdp-graph-mobility-hover' },
                { name: "utility", value: 2, hover_icon: 'cdp-graph-utility-hover' },
              ].map((stat, index) => {
                const rotationDegree = index * 72
                return (
                  <>
                    <img
                      className={styles.graphTraitIcon}
                      src={`/champion-details/${stat.hover_icon}.png`}
                      key={index}
                      width={800}
                      height={800}
                      alt=""
                      decoding="sync"
                      />
                    <img
                      src={`/champion-details/cdp-graph-segment-l${stat.value}.png`}
                      className={styles.graphSegmentLevel}
                      style={{ transform: `rotate(${rotationDegree}deg)` }}
                      alt=""
                      width={800}
                      height={800}
                      decoding="sync"
                    />
                  </>
                );
              })}
              <img
                width={800}
                height={800}
                alt=""
                src="/champion-details/cdp_graph_backing.png"
                className={styles.radarBackground}
                decoding="sync"
              />
            </div>
          </div>
        </div>
        <div className={styles.loreSection}>
          <p className={styles.loreText}>
            {champion.lore}
          </p>
        </div>
        <div className={styles.actionButtons}>
          {isChampionInCollection ? (
            <button className="general-button disabled">{t("common.inCollection")}</button>
          ) : (
            <button className="general-button" onClick={onUnlockChampion}>
              {t("buttons.unlock")}
            </button>
          )}
          <button
            onClick={() => {
              window.open(
                `https://www.leagueoflegends.com/es-es/champions/${champion.id.toLowerCase()}/`,
                "_blank",
                "noopener,noreferrer",
              );
            }}
            className="general-button"
          >
            {t("buttons.learnMore")}
            <IoArrowForward />
          </button>
        </div>
      </div>

    </div>
  );
});

interface AspectosTabProps {
  champion: Champion,
  activeTab: string
}

const AspectosTab = memo(function AspectosTab({ champion, activeTab }: AspectosTabProps) {
  const { t } = useI18n();
  const [selectedSkin, setSelectedSkin] = useState(0);
  const { userSkins } = useUserSkins();
  const totalSkins = champion.skins.length;
  const [isBackgroundImageLoaded, setIsBackgroundImageLoaded] = useState(false);

  const isSkinInCollection =
    selectedSkin === 0 ||
    userSkins.some((us) => us.id == champion.skins[selectedSkin]?.id);
  const { openPurchaseModal } = usePurchase();

  const isThisSkinInCollection = (skinContextIndex: number) => {
    return (
      skinContextIndex == 0 ||
      userSkins.some((us) => us.id == champion.skins[skinContextIndex].id)
    );
  };
  const handleUnlockSkin = () => {
    const selectedSkinId = champion?.skins[selectedSkin]?.id;
    openPurchaseModal({ itemId: selectedSkinId, type: "skin" });
  };
  const getVisibleSkins = () => {
    const visibleSkins: number[] = [];

    if (totalSkins <= 5) {
      const slotsToShow = Math.min(5, totalSkins);
      const offset = Math.floor((5 - slotsToShow) / 2);

      for (let i = 0; i < 5; i++) {
        if (i >= offset && i < offset + slotsToShow) {
          const skinIndex = i - offset;
          visibleSkins.push(skinIndex);
        }
      }
      return visibleSkins;
    }

    const carouselPositions = [0, 1, 2, 3, 4];

    carouselPositions.forEach((position, index) => {
      if (index === 2) {
        visibleSkins.push(selectedSkin);
      } else {
        let skinIndex;
        if (index < 2) {
          skinIndex = selectedSkin - (2 - index);
          if (skinIndex < 0) skinIndex += totalSkins;
        } else {
          skinIndex = selectedSkin + (index - 2);
          if (skinIndex >= totalSkins) skinIndex -= totalSkins;
        }
        visibleSkins.push(skinIndex);
      }
    });

    return visibleSkins;
  };

  const goToPreviousSkin = () => {
    setSelectedSkin((prev) => (prev - 1 + totalSkins) % totalSkins);
    setIsBackgroundImageLoaded(false);
  };

  const goToNextSkin = () => {
    setSelectedSkin((prev) => (prev + 1) % totalSkins);
    setIsBackgroundImageLoaded(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeTab === "aspectos") {
        switch (event.key) {
          case "ArrowLeft":
            event.preventDefault();
            goToPreviousSkin();
            break;
          case "ArrowRight":
            event.preventDefault();
            goToNextSkin();
            break;
          default:
            break;
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedSkin, totalSkins]);

  const visibleSkins = getVisibleSkins();

  return (
    <div
      className="content"
    >
      <MediaSlot variant="hero">
        <Image
          className="skin-background-image"
          src={`${RESOURCES_URL}/${window.innerWidth < 767 ? "loading" : "splash"}/${champion.id}_${champion.skins[selectedSkin].num}.jpg`}
          alt={champion.name}
          onLoad={() => setIsBackgroundImageLoaded(true)}
          height={'800'}
          width={'1320'}
        />
      </MediaSlot>
      <div className="background-skin-placeholder"
        style={{ visibility: !isBackgroundImageLoaded ? "visible" : "hidden" }}
      >
      </div>
      <div className="bottom-panel">
        <h3 className="skin-name">
          {" "}
          {selectedSkin != 0
            ? champion.skins[selectedSkin].name
            : champion.name}{" "}
        </h3>
        <div className="skin-navigator">
          <div className="navigator-line"></div>
          <div className="minibuttons-container">
            {champion.skins.map((_, index) => (
              <div
                key={index}
                onClick={() => { setSelectedSkin(index); setIsBackgroundImageLoaded(false); }}
                className={`navigator-minibutton ${index == selectedSkin ? "active" : null}`}
              ></div>
            ))}
          </div>
          <div className="navigator-line"></div>
        </div>
        <div className="actions">
          {isSkinInCollection ? (
            <div className="unlock-button disabled"> {t("common.inCollection")} </div>
          ) : (
            <div className="unlock-button" onClick={handleUnlockSkin}>
              {" "}
              {t("buttons.unlock")}{" "}
            </div>
          )}
          <div className="skin-changer">
            <div className="skin-minicards-container">
              {visibleSkins.map((skinIndex, position) => (
                <div
                  key={`${skinIndex}-${position}`}
                  onClick={() => {
                    skinIndex !== null && setSelectedSkin(skinIndex);
                    setIsBackgroundImageLoaded(false);
                  }}
                  className={`skin-minicard ${skinIndex === selectedSkin ? "selected" : ""} ${skinIndex === null ? "empty" : ""}`}
                  style={{
                    transform:
                      position === 2 && skinIndex !== null
                        ? "scale(1.1)"
                        : "scale(1)",
                    zIndex: position === 2 ? 10 : 5 - Math.abs(position - 2),
                    transition: "all 0.3s ease-in-out",
                    opacity: skinIndex === null ? 0.3 : 1,
                    cursor: skinIndex === null ? "default" : "pointer",
                  }}
                  role={skinIndex !== null ? "button" : undefined}
                  tabIndex={skinIndex !== null ? 0 : -1}
                  aria-label={
                    skinIndex !== null
                      ? `Skin ${skinIndex + 1} de ${champion.name}`
                      : "Slot vacío"
                  }
                  onKeyDown={(e) => {
                    if (
                      skinIndex !== null &&
                      (e.key === "Enter" || e.key === " ")
                    ) {
                      e.preventDefault();
                      setSelectedSkin(skinIndex);
                    }
                  }}
                >
                  {skinIndex !== null ? (
                    <>
                      <MediaSlot variant="tile">
                        <img
                          src={`${RESOURCES_URL}/champion/tiles/${champion.id}_${champion.skins[skinIndex].num}.jpg`}
                          className="skin-minicard-image"
                          alt={`Skin ${skinIndex + 1} de ${champion.name}`}
                        />
                      </MediaSlot>
                      {!isThisSkinInCollection(skinIndex) ? (
                        <GiPadlock
                          className={`skin-locked-icon ${skinIndex === selectedSkin && "selected"}`}
                        />
                      ) : null}
                    </>
                  ) : (
                    <div className="empty-slot">
                      <span></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const HabilidadesTab = memo(function HabilidadesTab({ champion }: { champion: Champion }) {
  const spellKeys = ["P", "Q", "W", "E", "R"];
  const [selectedSpell, setSelectedSpell] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const showLoading = useLoadingDelay(isVideoLoading);
  /*const videosRef = useRef < HTMLVideoElement[] > ([]);*/
  const videoRef = useRef<HTMLVideoElement[]>([])

  useEffect(() => {
    videoRef.current.forEach((video: HTMLVideoElement, index: number) => {
      if (!video) return;

      if (index === selectedSpell) {
        video.currentTime = 0; // empezar desde el inicio
        video.play();
      } else {
        video.pause();
      }
    });
  }, [selectedSpell]);

  return (
    <div className="spells-section">
      {spellKeys.map((spellKey, index) => (
        <video
          key={index}
          ref={(video) => {
            if (video) {
              videoRef.current[index] = video;
            }
          }}
          className={`spell-video ${selectedSpell === index ? "selected" : null}`}
          src={`https://lol.dyn.riotcdn.net/x/videos/champion-abilities/0${champion.key.toString().length < 3 ? `0${champion.key}` : champion.key}/ability_0${champion.key.toString().length < 3 ? `0${champion.key}` : champion.key}_${spellKey}1.mp4`}
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoading(false)}
          onLoadStart={() => setIsVideoLoading(true)}
        />
      ))}
      <div className={`video-placeholder`} style={{ visibility: showLoading ? "visible" : "hidden" }}>
        <div className={`loading-spinner medium`}>
          <Image
            className="spinner-ring"
            src="/general/loading-spinner-blue.png"
            alt="loading spinner"
            width={100}
            height={100}
          />
        </div>
      </div>
      <div className="spells-panel">
        <div className="sprites-container">
          <div className="passive-item">
            <div onClick={() => {
              setSelectedSpell(0);
            }} className={`passive-image-container ${selectedSpell === 0 ? "selected" : null}`}>
              <MediaSlot variant="icon">
                <Image
                  className='passive-image'
                  src={`${RESOURCES_URL}/passive/${champion.passive.image.full}`}
                  alt="passive sprite"
                  width={32}
                  height={32}
                  />
              </MediaSlot>
            </div>
            P
          </div>
          <div className="spell-separator"></div>
          {champion.spells.map((spell, index) => {
            return (
              <div key={index} className="spell-item" >
                <div
                  onClick={() => {
                  setSelectedSpell(index + 1);
                  }}
                  className={`spell-image-container ${selectedSpell === index + 1 ? "selected" : null}`}
                >
                  <MediaSlot variant="icon">
                    <Image
                      key={index}
                      className='spell-image'
                      src={`${RESOURCES_URL}/spell/${spell.image.full}`}
                      alt="spell sprite"
                      width={48}
                      height={48}
                      />
                  </MediaSlot>
                </div>
                {spellKeys[index + 1]}
              </div>
            );
          })}
        </div>
        <div className="skill-info">
          <h3 className="skill-name">
            {" "}
            {selectedSpell !== 0
              ? champion.spells[selectedSpell - 1].name
              : champion.passive.name}{" "}
          </h3>
          <p className="skill-description">
            {selectedSpell !== 0
              ? champion.spells[selectedSpell - 1].description
              : champion.passive.description}
          </p>
        </div>
      </div>
    </div>
  );
});



interface ChampionDetailModalProps {
  champion: Champion,
  onClose: () => void,
}

const ChampionDetailModal = ({ champion, onClose }: ChampionDetailModalProps) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("resumen");
  const { userChampions } = useUserChampions();
  const { openPurchaseModal } = usePurchase();
  const { play: playMenuClick } = useSound("/sfx/menu-click.mp3");

  if (!champion) return null;

  const isChampionInCollection = userChampions?.some(
    (c) => c.id === champion.id,
  );

  const tabs =
    window.innerWidth > 767
      ? [
          { id: "resumen", label: "RESUMEN" },
          { id: "habilidades", label: "HABILIDADES" },
          /*{ id: "maestria", label: "MAESTRÍA" },
          { id: "eternos", label: "ETERNOS" },*/
          { id: "aspectos", label: "ASPECTOS" },
        ]
      : [
          { id: "resumen", label: t("sections.overview") },
          { id: "habilidades", label: t("sections.abilities") },
          { id: "aspectos", label: t("sections.skinsTab") },
        ];

  const splashSrc = `${RESOURCES_URL}/champion/${activeTab === "resumen" ? "centered" : "splash"}/${champion.id}_0.jpg`;
  /*const skinFileName = `${champion.id}_`*/
  const handleUnlockChampion = () => {
    openPurchaseModal({ itemId: champion.id, type: "champion" });
  };

  if (!champion) return null;
  return typeof window !== 'undefined' && createPortal((
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.championInfoBorder}>
            <div className={styles.championInfo}>
              <div className={styles.championIcon}>
                <img
                  src={`/champion-details/role-icon-${champion.tags[0].toLowerCase()}.png`}
                  alt=""
                  className={styles.iconImage}
                  decoding="sync"
                />
              </div>
              <div className={styles.championText}>
                <h1 className={styles.championName}>{champion.name}</h1>
                <p className={styles.championTitle}>{champion.title.toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ""}`}
                onClick={() => { playMenuClick(); setActiveTab(tab.id); }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <CloseModalButton onClose={onClose}></CloseModalButton>
        </div>
        {activeTab === "resumen" && (
          <ResumenTab
            champion={champion}
            splashSrc={splashSrc}
            isChampionInCollection={isChampionInCollection}
            onUnlockChampion={handleUnlockChampion}
          />
        )}
        {activeTab === "aspectos" && (
          <AspectosTab champion={champion} activeTab={activeTab} />
        )}
        {activeTab === "habilidades" && <HabilidadesTab champion={champion} />}
      </div>
    </div>
  ), document.body);
};

export default memo(ChampionDetailModal);
