import "./Settings.css";
import { audioEngine } from "@/engine/audioEngine";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import {
  setVolume,
  setMute,
  restoreDefaults,
} from "@/redux/slices/soundSlice";
import { saveSettings, setLanguage } from "@/redux/slices/settingsSlice";
import { useAppSelector, useAppDispatch } from '@/hooks/hooks'
import { useSound } from '@/hooks/useSound'
import { useUserInterface } from "@/hooks/useUserInterface";
import { LOCALE_STORAGE_KEY, useI18n } from "@/hooks/useI18n";
import type { Locale } from "@/i18n/messages";

interface SoundControlProps {
  label: string,
  checkLabel: string,
  type: "master" | "sfx" | "music",
  isMasterMuted: boolean
}

function SoundControl({ label, checkLabel, type, isMasterMuted }: SoundControlProps) {
  const { t } = useI18n();
  // Estado local solo para visualización inmediata en UI
  const [localVolume, setLocalVolume] = useState(0.5); // Valor inicial debería venir de config
  const [isLocalMuted, setIsLocalMuted] = useState(false);
  const { volume: globalVolume, muted: globalMuted } = useAppSelector(
    (state) => state.sound[type],
  );
  const dispatch = useAppDispatch();

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    audioEngine.setVolume(type, val);
    setLocalVolume(val);
  };
  const handleCommit = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    const target = e.currentTarget as HTMLInputElement
    const val = Number(target.value);
    dispatch(setVolume({ type, val }));
  };

  const handleCheck = () => {
    dispatch(setMute({ type, muted: !isLocalMuted }));
  };

  useEffect(() => { setLocalVolume(globalVolume) }, [globalVolume]);
  useEffect(() => { setIsLocalMuted(globalMuted) }, [globalMuted]);

  return (
    <div
      className={`master-sound-control ${isLocalMuted || isMasterMuted ? "muted" : ""}`}
    >
      <div className="settings-checkbox">
        <div
          className="custom-checkbox"
          onClick={handleCheck}
          style={{ pointerEvents: isMasterMuted ? "none" : "unset" }}
        >
          {!isLocalMuted && (
            <FaCheck
              className="check-icon"
              style={{ opacity: isMasterMuted ? "0.5" : "1" }}
            />
          )}
        </div>
        <label className="audio-label">{t("settings.enable")} {checkLabel}</label>
      </div>
      <div className="sub-volume-controls">
        <span className={`audio-label `}>
          {label}
          {Math.floor((globalVolume * 100) / audioEngine.channels[type].maxVolume)}
        </span>
        <input
          type="range"
          min="0"
          max={audioEngine.channels[type].maxVolume}
          step="0.01"
          value={localVolume}
          onChange={handleSlider}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          disabled={isLocalMuted || isMasterMuted} // Opcional: Desactivar slider si está muteado
          className={`audio-input`}
        />
      </div>
    </div>
  );
}

// Componente de Ajustes de Sonido
function AudioSettings() {
  const { t } = useI18n();
  const [localVolume, setLocalVolume] = useState(0.5); // Valor inicial debería venir de config
  const [isMasterMuted, setIsMasterMuted] = useState(false);
  const { volume: globalVolume, muted: globalMuted } = useAppSelector(
    (state) => state.sound.master,
  );
  const dispatch = useAppDispatch();

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    audioEngine.setVolume("master", val);
    setLocalVolume(val);
  };
  const handleCommit = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    const target = e.currentTarget as HTMLInputElement
    const val = Number(target.value);
    dispatch(setVolume({ type: "master", val }));
  };

  const handleCheck = () => {
    dispatch(setMute({ type: "master", muted: !isMasterMuted }));
  };

  useEffect(() => setLocalVolume(globalVolume), [globalVolume]);
  useEffect(() => setIsMasterMuted(globalMuted), [globalMuted]);

  return (
    <div className="audio-settings">
      <div className={`master-sound-control ${isMasterMuted ? "muted" : null}`}>
        <div className="settings-checkbox">
          <div className="custom-checkbox" onClick={handleCheck}>
            {!isMasterMuted && (
              <FaCheck
                className="check-icon"
                style={{ opacity: isMasterMuted ? "0.5" : "1" }}
              />
            )}
          </div>
          <label className="audio-label">{t("settings.enableSound")}</label>
        </div>
        <span className="audio-label">
          {t("settings.overallVolume")}: {globalVolume * 100}
        </span>
        <input
          type="range"
          value={localVolume}
          min="0"
          max="1"
          step="0.01"
          onChange={handleSlider}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          disabled={isMasterMuted} // Opcional: Desactivar slider si está muteado
          className="audio-input"
        />
      </div>

      <div className="secondary-controls">
        <SoundControl
          label={`${t("settings.sfxVolume")}: `}
          checkLabel={"SFX"}
          type="sfx"
          isMasterMuted={isMasterMuted}
        />
        <SoundControl
          label={`${t("settings.musicVolume")}: `}
          checkLabel={"Music"}
          type="music"
          isMasterMuted={isMasterMuted}
        />
      </div>
    </div>
  );
}

function ClientSettings() {
  const { locale, t } = useI18n();
  const dispatch = useAppDispatch();

  const choose = (next: Locale) => {
    dispatch(setLanguage(next));
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  };

  return (
    <div className="audio-settings">
      <span className="audio-label">{t("settings.language")}</span>
      <p className="audio-label">{t("settings.languageHint")}</p>
      <div className="settings-category-selector">
        {(["es", "en"] as const).map((code) => (
          <div
            key={code}
            className={`setting-category-item ${locale === code ? "selected" : ""}`}
            onClick={() => choose(code)}
          >
            <div className="selected-reference-bar"></div>
            <div className="setting-category-item-name">
              {code === "es" ? t("settings.spanish") : t("settings.english")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Settings() {
  const { t } = useI18n();
  const [settingSelected, setSettingSelected] = useState("sound");
  const userSettings = useAppSelector((state) => state.settings);
  const { updateSettingsModal, isSettingsModalOpen } = useUserInterface()
  const dispatch = useAppDispatch();
  const { play: playButtonGoldClick } = useSound("/sfx/sfx-uikit-button-gold-click.ogg")

  const handleRestoreDefaults = () => {
    dispatch(restoreDefaults());
  };
  const handleSaveSettings = () => {
    playButtonGoldClick();
    const updatedUserSettings = {
      ...userSettings,
      sound: {
        master: {
          volume: audioEngine.channels.master.volume,
          muted: audioEngine.channels.master.muted,
        },
        sfx: {
          volume: audioEngine.channels.sfx.volume,
          muted: audioEngine.channels.sfx.muted,
        },
        music: {
          volume: audioEngine.channels.music.volume,
          muted: audioEngine.channels.music.muted,
        },
      },
    };
    const token = localStorage.getItem("token");
    if (token) dispatch(saveSettings({ userId: token, settings: updatedUserSettings }));
  };

  return (
    typeof window !== "undefined" &&
    ReactDOM.createPortal(
      <div style={{ display: isSettingsModalOpen ? "flex" : "none" }} className="settings-modal">
        <div className="settings-panel">
          <div className="settings-header">
            <div className="settings-header-tittle">
              <span>{t("settings.interface")}</span>
              <span style={{ marginLeft: "1rem", marginRight: "1rem" }}>/</span>
              <span style={{ color: "var(--gold-one)" }}>
                {settingSelected === "interface" ? t("settings.interface") : t("settings.sound")}
              </span>
            </div>
            <div
              className="settings-restore-button general-button"
              onClick={() => handleRestoreDefaults()}
            >
              {t("settings.restore")}
            </div>
          </div>
          <div className="settings-main">
            <div className="settings-category-selector">
              <div
                className={`setting-category-item ${settingSelected === "sound" ? "selected" : ""}`}
                onClick={() => setSettingSelected("sound")}
              >
                <div className="selected-reference-bar"></div>
                <div className="setting-category-item-name">{t("settings.sound")}</div>
              </div>
              <div
                className={`setting-category-item ${settingSelected === "interface" ? "selected" : ""}`}
                onClick={() => setSettingSelected("interface")}
              >
                <div className="selected-reference-bar"></div>
                <div className="setting-category-item-name">{t("settings.interface")}</div>
              </div>
            </div>
            <div className="settings-parameters">
              {settingSelected === "sound" && <AudioSettings />}
              {settingSelected === "interface" && <ClientSettings />}
            </div>
          </div>
          <div
            className="general-button"
            onClick={() => {
              handleSaveSettings();
              updateSettingsModal(false);
            }}
          >
            {t("settings.done")}
          </div>
        </div>
      </div>,
      document.body,
    )
  );

}
