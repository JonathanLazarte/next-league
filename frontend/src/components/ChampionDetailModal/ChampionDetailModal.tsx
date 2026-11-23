"use client";



import React, { useState, useEffect, memo, useRef, useMemo } from "react";
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { AnimatePresence, motion } from "framer-motion";
import useLoadingDelay from '@/hooks/useLoadingDelay'

import styles from "./ChampionDetailModal.module.css";
import "./ChampionDetailModal.css";
import { usePurchase } from "@/hooks/usePurchase";
import { useUserChampions } from "@/hooks/useUserChampions";
import { useUserSkins } from "@/hooks/useUserSkins";
import { useI18n } from "@/hooks/useI18n";
/*aspectos imports*/
import { GiPadlock } from "react-icons/gi";
import { IoArrowForward, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { RESOURCES_URL } from "@/utils/constants";
import {
  circularDirection,
  getCircularWindow,
  normalizeIndex,
  stepIndex,
} from "@/utils/circularWindow";
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

const SKIN_WINDOW = 5;

const AspectosTab = memo(function AspectosTab({ champion, activeTab }: AspectosTabProps) {
  const { t } = useI18n();
  const [selectedSkin, setSelectedSkin] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [trackChampionId, setTrackChampionId] = useState(champion.id);
  const [missingTiles, setMissingTiles] = useState<string[]>([]);
  const { userSkins } = useUserSkins();
  const { openPurchaseModal } = usePurchase();
  const skins = useMemo(
    () => champion.skins.filter((skin) => skin.parentSkin == null && !missingTiles.includes(skin.id)),
    [champion.skins, missingTiles],
  );
  const totalSkins = skins.length;
  const [isBackgroundImageLoaded, setIsBackgroundImageLoaded] = useState(false);
  const navigationRef = useRef({
    previous: () => {},
    next: () => {},
  });

  const championChanged = champion.id !== trackChampionId;
  if (championChanged) {
    setTrackChampionId(champion.id);
    setSelectedSkin(0);
    setDirection(1);
    setMissingTiles([]);
    setIsBackgroundImageLoaded(false);
  }

  const activeSkinIndex = championChanged
    ? 0
    : normalizeIndex(selectedSkin, totalSkins);
  const activeSkin = skins[activeSkinIndex];

  const isSkinInCollection =
    activeSkinIndex === 0 ||
    userSkins.some((us) => us.id == activeSkin?.id);

  const isThisSkinInCollection = (skinContextIndex: number) => {
    return (
      skinContextIndex == 0 ||
      userSkins.some((us) => us.id == skins[skinContextIndex]?.id)
    );
  };
  const handleUnlockSkin = () => {
    const selectedSkinId = activeSkin?.id;
    openPurchaseModal({ itemId: selectedSkinId, type: "skin" });
  };

  const visibleSkins = useMemo(
    () => getCircularWindow(activeSkinIndex, totalSkins, SKIN_WINDOW),
    [activeSkinIndex, totalSkins],
  );

  const selectSkin = (index: number) => {
    if (totalSkins <= 0) return;
    const nextIndex = normalizeIndex(index, totalSkins);
    if (nextIndex === activeSkinIndex) return;
    setDirection(circularDirection(activeSkinIndex, nextIndex, totalSkins));
    setIsBackgroundImageLoaded(false);
    setSelectedSkin(nextIndex);
  };

  const goToPreviousSkin = () => {
    if (totalSkins <= 1) return;
    setDirection(-1);
    setIsBackgroundImageLoaded(false);
    setSelectedSkin((prev) => stepIndex(prev, totalSkins, -1));
  };

  const goToNextSkin = () => {
    if (totalSkins <= 1) return;
    setDirection(1);
    setIsBackgroundImageLoaded(false);
    setSelectedSkin((prev) => stepIndex(prev, totalSkins, 1));
  };

  navigationRef.current.previous = goToPreviousSkin;
  navigationRef.current.next = goToNextSkin;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeTab !== "aspectos") return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigationRef.current.previous();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        navigationRef.current.next();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeTab]);

  useEffect(() => {
    if (totalSkins <= 1 || !activeSkin) return;
    const neighbors = [1, -1].map(
      (delta) => skins[stepIndex(activeSkinIndex, totalSkins, delta)],
    );
    neighbors.forEach((skin) => {
      if (!skin) return;
      const image = new window.Image();
      image.src = `${RESOURCES_URL}/champion/splash/${champion.id}_${skin.num}.jpg`;
    });
  }, [activeSkin, activeSkinIndex, champion.id, skins, totalSkins]);

  return (
    <div
      className="content"
    >
      <MediaSlot variant="hero">
        {activeSkin && (
          <Image
            className="skin-background-image"
            src={`${RESOURCES_URL}/champion/${window.innerWidth < 767 ? "loading" : "splash"}/${champion.id}_${activeSkin.num}.jpg`}
            alt={activeSkinIndex === 0 ? champion.name : activeSkin.name}
            onLoad={() => setIsBackgroundImageLoaded(true)}
            height={'800'}
            width={'1320'}
            unoptimized
          />
        )}
      </MediaSlot>
      <div className="background-skin-placeholder"
        style={{ visibility: !isBackgroundImageLoaded ? "visible" : "hidden" }}
      >
      </div>
      <div className="bottom-panel">
        <h3 className="skin-name">
          {" "}
          {activeSkinIndex !== 0 && activeSkin
            ? activeSkin.name
            : champion.name}{" "}
        </h3>
        <div className="skin-navigator">
          <div className="navigator-line"></div>
          <div className="minibuttons-container">
            {skins.map((skin, index) => (
              <div
                key={skin.id}
                onClick={() => selectSkin(index)}
                className={`navigator-minibutton ${index === activeSkinIndex ? "active" : null}`}
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
            {totalSkins > 1 && (
              <button
                type="button"
                className="arrow-icon"
                onClick={goToPreviousSkin}
                aria-label={t("common.previous")}
              >
                <IoChevronBack />
              </button>
            )}
            <div className="skin-minicards-container">
              <AnimatePresence initial={false} mode="popLayout" custom={direction}>
              {visibleSkins.map((skinIndex) => {
                const skin = skins[skinIndex];
                if (!skin) return null;
                const isSelected = skinIndex === activeSkinIndex;
                const label = skinIndex === 0 ? champion.name : skin.name;
                return (
                  <motion.div
                    layout
                    key={skin.id}
                    custom={direction}
                    initial={{ x: direction * 56, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction * -56, opacity: 0 }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                    onClick={() => selectSkin(skinIndex)}
                    className={`skin-minicard ${isSelected ? "selected" : ""}`}
                    role="button"
                    tabIndex={0}
                    aria-label={label}
                    aria-current={isSelected ? "true" : undefined}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectSkin(skinIndex);
                      }
                    }}
                  >
                    <MediaSlot variant="tile">
                      <img
                        src={`${RESOURCES_URL}/champion/tiles/${champion.id}_${skin.num}.jpg`}
                        className="skin-minicard-image"
                        alt={label}
                        onError={() => {
                          setMissingTiles((current) =>
                            current.includes(skin.id) ? current : [...current, skin.id],
                          );
                        }}
                      />
                    </MediaSlot>
                    {!isThisSkinInCollection(skinIndex) ? (
                      <GiPadlock
                        className={`skin-locked-icon ${isSelected ? "selected" : ""}`}
                      />
                    ) : null}
                  </motion.div>
                );
              })}
              </AnimatePresence>
            </div>
            {totalSkins > 1 && (
              <button
                type="button"
                className="arrow-icon"
                onClick={goToNextSkin}
                aria-label={t("common.next")}
              >
                <IoChevronForward />
              </button>
            )}
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
                  src={`/champion-details/passive/${champion.passive.image.full}`}
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
                      src={`/champion-details/spell/${spell.image.full}`}
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
