"use client";

import { createPortal } from "react-dom";
import { memo, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useI18n } from "@/hooks/useI18n";
import { useUser } from "@/hooks/useUser";
import { useSound } from "@/hooks/useSound";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { useProfileIcons } from "@/hooks/useProfileIcons";
import VirtualProfileIconsGrid from "@/components/virtual-grids/VirtualProfileIconsGrid";
import {
  useProfileBanners,
  useProfileBorders,
  useProfileTitles,
  type ProfileBanner,
  type ProfileBorder,
  type ProfileTitle,
  type ProfileTitleGroup,
} from "@/hooks/useProfileCatalog";
import { RESOURCES_URL } from "@/utils/constants";
import {
  BUTTON_X_DATA_URI,
  BUTTON_X_DOWN_DATA_URI,
  BUTTON_X_OVER_DATA_URI,
} from "@/utils/uiAssets";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import SearchField from "@/components/SearchField/SearchField";
import "./ProfileIdentityModal.css";

const TABS = [
  { id: "icons", label: "profile.tabs.icons" },
  { id: "borders", label: "profile.tabs.borders" },
  { id: "titles", label: "profile.tabs.titles" },
  { id: "banners", label: "profile.tabs.banners" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface IdentityDraft {
  icon: string;
  titleId: string;
  titleName: string;
  banner: string;
  border: string;
}

const ICON_FILTERS = [
  { value: "all", label: "profile.all" },
  { value: "set", label: "profile.filters.set" },
  { value: "team", label: "profile.filters.team" },
  { value: "level", label: "profile.filters.level" },
] as const;

function fold(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function columnsFor(width: number, cellRem: number) {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
  return Math.max(1, Math.floor(width / (rem * cellRem)));
}

interface ProfileIdentityModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileIdentityModal({ open, onClose }: ProfileIdentityModalProps) {
  const { t, locale } = useI18n();
  const {
    alias,
    title,
    id,
    token,
    profile_icon: profileIcon,
    profile_banner: profileBanner,
    profile_border: profileBorder,
    profile_title: profileTitle,
    saveIdentity,
  } = useUser();
  const { play } = useSound("/sfx/sfx-uikit-click-generic.ogg");
  const playRef = useRef(play);
  playRef.current = play;
  const [tab, setTab] = useState<TabId>("icons");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [wasOpen, setWasOpen] = useState(false);
  const [draft, setDraft] = useState<IdentityDraft>({
    icon: "",
    titleId: "",
    titleName: "",
    banner: "",
    border: "",
  });
  const iconsQuery = useProfileIcons(locale, open);
  const bordersQuery = useProfileBorders(locale, open && tab === "borders");
  const titlesQuery = useProfileTitles(locale, open && tab === "titles");
  const bannersQuery = useProfileBanners(locale, open && (tab === "banners" || Boolean(profileBanner || draft.banner)));

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setDraft({
        icon: profileIcon || "",
        titleId: profileTitle || "",
        titleName: title || "",
        banner: profileBanner || "",
        border: profileBorder || "",
      });
      setTab("icons");
      setQuery("");
      setFilter("all");
    }
  }

  const commit = useCallback(() => {
    const next = {
      profile_icon: draft.icon,
      title: draft.titleId ? draft.titleName : "",
      profile_title: draft.titleId,
      profile_banner: draft.banner,
      profile_border: draft.border,
    };
    const userId = id && id !== "guest-offline" ? id : token;
    void saveIdentity({ userId, ...next });
    onClose();
  }, [draft, id, onClose, saveIdentity, token]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") commit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, commit]);

  useEffect(() => {
    setFilter("all");
    setQuery("");
  }, [locale, tab]);

  const choose = useCallback((patch: Partial<IdentityDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    void playRef.current();
  }, []);

  const currentIcon = useMemo(
    () => iconsQuery.data?.icons.find((icon) => icon.id === Number(draft.icon)),
    [iconsQuery.data, draft.icon],
  );
  const titleLabel = useMemo(() => {
    if (!draft.titleId) return t("profile.noTitle");
    for (const group of titlesQuery.data?.groups ?? []) {
      const match = group.titles.find((item) => item.id === draft.titleId);
      if (match) return match.name;
    }
    return draft.titleName || t("profile.noTitle");
  }, [draft.titleId, draft.titleName, titlesQuery.data, t]);
  const bannerSrc = bannersQuery.data?.banners.find((banner) => banner.id === draft.banner)?.src;

  const borderSrc = bordersQuery.data?.borders.find((border) => border.id === draft.border)?.file;

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="identity-overlay" onMouseDown={commit}>
      <div
        className="identity-panel"
        role="dialog"
        aria-modal="true"
        aria-label={t("profile.title")}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <CloseButton label={t("common.close")} onClose={commit} />
        <aside
          className="identity-preview"
          style={bannerSrc ? {
            backgroundImage: `url("${bannerSrc}")`,
          } : undefined}
        >
          <div className="identity-preview-portrait">
            <img
              className="identity-preview-icon"
              src={`${RESOURCES_URL}/profileicon/${draft.icon || profileIcon || 5}.png`}
              alt=""
            />
            {borderSrc && (
              <img className="identity-preview-border" src={`/profile-borders/${borderSrc}`} alt="" />
            )}
          </div>
          <h2 className="identity-preview-name">{alias}</h2>
          <p className="identity-preview-title">{titleLabel}</p>
        </aside>
        <section className="identity-main">
          <h1 className="identity-heading">{t("profile.title")}</h1>
          <div className="identity-tabs" role="tablist">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                className={tab === item.id ? "subheader-tab active-subheader-tab-small" : "subheader-tab"}
                onClick={() => setTab(item.id)}
              >
                {t(item.label)}
              </button>
            ))}
          </div>
          <div className="identity-toolbar">
            <SearchField
              className="is-toolbar"
              value={query}
              placeholder={t("profile.search")}
              onChange={setQuery}
            />
            {tab === "icons" && (
              <CustomSelect
                options={ICON_FILTERS}
                value={filter}
                onChange={setFilter}
                className="identity-filter"
              />
            )}
          </div>
          <div className="identity-stage">
            {tab === "icons" && (
              <CatalogBody
                isLoading={iconsQuery.isLoading}
                isError={iconsQuery.isError}
                hasData={Boolean(iconsQuery.data)}
                loadingLabel={t("common.loading")}
                errorLabel={t("profile.loadError")}
                retryLabel={t("buttons.retry")}
                onRetry={() => iconsQuery.refetch()}
              >
                {iconsQuery.data && (
                  <VirtualProfileIconsGrid
                    icons={iconsQuery.data.icons}
                    sets={iconsQuery.data.sets}
                    query={query}
                    filter={filter}
                    selectedId={draft.icon ? Number(draft.icon) : -1}
                    onSelect={(iconId) => choose({ icon: String(iconId) })}
                  />
                )}
              </CatalogBody>
            )}
            {tab === "borders" && (
              <CatalogBody
                isLoading={bordersQuery.isLoading}
                isError={bordersQuery.isError}
                hasData={Boolean(bordersQuery.data)}
                loadingLabel={t("common.loading")}
                errorLabel={t("profile.catalogError")}
                retryLabel={t("buttons.retry")}
                onRetry={() => bordersQuery.refetch()}
              >
                {bordersQuery.data && (
                  <BorderGrid
                    borders={bordersQuery.data.borders}
                    query={query}
                    selectedId={draft.border}
                    levelLabel={t("profile.level")}
                    emptyLabel={t("profile.emptyResults")}
                    onSelect={(borderId) => choose({ border: borderId })}
                  />
                )}
              </CatalogBody>
            )}
            {tab === "titles" && (
              <CatalogBody
                isLoading={titlesQuery.isLoading}
                isError={titlesQuery.isError}
                hasData={Boolean(titlesQuery.data)}
                loadingLabel={t("common.loading")}
                errorLabel={t("profile.catalogError")}
                retryLabel={t("buttons.retry")}
                onRetry={() => titlesQuery.refetch()}
              >
                {titlesQuery.data && (
                  <TitleGrid
                    groups={titlesQuery.data.groups}
                    query={query}
                    selectedId={draft.titleId}
                    noneLabel={t("profile.noTitle")}
                    emptyLabel={t("profile.emptyResults")}
                    onSelect={(titleId, titleName) => choose({ titleId, titleName })}
                  />
                )}
              </CatalogBody>
            )}
            {tab === "banners" && (
              <CatalogBody
                isLoading={bannersQuery.isLoading}
                isError={bannersQuery.isError}
                hasData={Boolean(bannersQuery.data)}
                loadingLabel={t("common.loading")}
                errorLabel={t("profile.catalogError")}
                retryLabel={t("buttons.retry")}
                onRetry={() => bannersQuery.refetch()}
              >
                {bannersQuery.data && (
                  <BannerGrid
                    banners={bannersQuery.data.banners}
                    query={query}
                    selectedId={draft.banner}
                    emptyLabel={t("profile.emptyResults")}
                    onSelect={(bannerId) => choose({ banner: bannerId })}
                  />
                )}
              </CatalogBody>
            )}
          </div>
        </section>
      </div>
    </div>,
    document.body,
  );
}

function CatalogBody({
  isLoading,
  isError,
  hasData,
  loadingLabel,
  errorLabel,
  retryLabel,
  onRetry,
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  hasData: boolean;
  loadingLabel: string;
  errorLabel: string;
  retryLabel: string;
  onRetry: () => void;
  children: ReactNode;
}) {
  if (isLoading && !hasData) return <p className="identity-status">{loadingLabel}</p>;
  if (isError && !hasData) {
    return (
      <div className="identity-status">
        <p>{errorLabel}</p>
        <button type="button" className="identity-retry" onClick={onRetry}>{retryLabel}</button>
      </div>
    );
  }
  return children;
}

function CloseButton({ onClose, label }: { onClose: () => void; label: string }) {
  const [buttonState, setButtonState] = useState<"idle" | "hovered" | "pressed">("idle");
  return (
    <button
      type="button"
      className="identity-close"
      aria-label={label}
      onMouseEnter={() => setButtonState("hovered")}
      onMouseLeave={() => setButtonState("idle")}
      onClick={() => {
        setButtonState("pressed");
        onClose();
      }}
    >
      <img src={BUTTON_X_DATA_URI} alt="" className={buttonState === "idle" ? "" : "is-hidden"} />
      <img src={BUTTON_X_OVER_DATA_URI} alt="" className={buttonState === "hovered" ? "" : "is-hidden"} />
      <img src={BUTTON_X_DOWN_DATA_URI} alt="" className={buttonState === "pressed" ? "" : "is-hidden"} />
    </button>
  );
}

interface TitleRow {
  type: "header" | "titles";
  label?: string;
  titles?: ProfileTitle[];
}

const TitleGrid = memo(function TitleGrid({
  groups,
  query,
  selectedId,
  noneLabel,
  emptyLabel,
  onSelect,
}: {
  groups: ProfileTitleGroup[];
  query: string;
  selectedId: string;
  noneLabel: string;
  emptyLabel: string;
  onSelect: (id: string, name: string) => void;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(2);
  const rows = useMemo(() => {
    const folded = fold(query.trim());
    const result: TitleRow[] = [];
    for (const group of groups) {
      const groupMatches = folded && fold(group.name).includes(folded);
      const titles = group.titles.filter((item) => !folded || groupMatches || fold(item.name).includes(folded));
      if (titles.length === 0) continue;
      result.push({ type: "header", label: group.name });
      for (let index = 0; index < titles.length; index += columns) {
        result.push({ type: "titles", titles: titles.slice(index, index + columns) });
      }
    }
    return result;
  }, [groups, query, columns]);

  useEffect(() => {
    parentRef.current?.scrollTo({ top: 0 });
  }, [query]);

  const handleResize = useCallback((width: number) => {
    const next = columnsFor(width, 28);
    setColumns((current) => (current === next ? current : next));
  }, []);
  useResizeObserver(parentRef, handleResize);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => (rows[index]?.type === "header" ? 36 : 52),
    overscan: 8,
  });

  return (
    <div className="identity-grid" ref={parentRef}>
      <button
        type="button"
        className={selectedId ? "identity-title identity-title-none" : "identity-title identity-title-none is-selected"}
        aria-pressed={!selectedId}
        onClick={() => onSelect("", "")}
      >
        {noneLabel}
      </button>
      {rows.length === 0 ? <p className="identity-status">{emptyLabel}</p> : (
        <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.type === "header" && <div className="identity-year">{row.label}</div>}
                {row.type === "titles" && (
                  <div className="identity-title-row" style={{ ["--cols" as string]: columns }}>
                    {row.titles?.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={item.id === selectedId ? "identity-title is-selected" : "identity-title"}
                        aria-pressed={item.id === selectedId}
                        onClick={() => onSelect(item.id, item.name)}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

const BorderGrid = memo(function BorderGrid({
  borders,
  query,
  selectedId,
  levelLabel,
  emptyLabel,
  onSelect,
}: {
  borders: ProfileBorder[];
  query: string;
  selectedId: string;
  levelLabel: string;
  emptyLabel: string;
  onSelect: (id: string) => void;
}) {
  const filtered = useMemo(() => {
    const folded = fold(query.trim());
    if (!folded) return borders;
    return borders.filter((border) => fold(border.name).includes(folded) || String(border.level).includes(folded));
  }, [borders, query]);

  if (filtered.length === 0) return <p className="identity-status">{emptyLabel}</p>;

  return (
    <div className="identity-grid">
      <div className="identity-border-row">
        {filtered.map((border) => (
          <button
            key={border.id}
            type="button"
            className={border.id === selectedId ? "identity-border is-selected" : "identity-border"}
            aria-pressed={border.id === selectedId}
            onClick={() => onSelect(border.id)}
          >
            <img src={`/profile-borders/${border.file}`} alt="" draggable={false} />
            <span>{border.name}</span>
            <small>{levelLabel} {border.level}</small>
          </button>
        ))}
      </div>
    </div>
  );
});

interface BannerRow {
  banners: ProfileBanner[];
}

const BannerGrid = memo(function BannerGrid({
  banners,
  query,
  selectedId,
  emptyLabel,
  onSelect,
}: {
  banners: ProfileBanner[];
  query: string;
  selectedId: string;
  emptyLabel: string;
  onSelect: (id: string) => void;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(4);
  const filtered = useMemo(() => {
    const folded = fold(query.trim());
    if (!folded) return banners;
    return banners.filter((banner) => fold(banner.name).includes(folded));
  }, [banners, query]);
  const rows = useMemo(() => {
    const result: BannerRow[] = [];
    for (let index = 0; index < filtered.length; index += columns) {
      result.push({ banners: filtered.slice(index, index + columns) });
    }
    return result;
  }, [filtered, columns]);

  useEffect(() => {
    parentRef.current?.scrollTo({ top: 0 });
  }, [query]);

  const handleResize = useCallback((width: number) => {
    const next = columnsFor(width, 16);
    setColumns((current) => (current === next ? current : next));
  }, []);
  useResizeObserver(parentRef, handleResize);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 230,
    overscan: 4,
  });

  if (rows.length === 0) return <p className="identity-status">{emptyLabel}</p>;

  return (
    <div className="identity-grid" ref={parentRef}>
      <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="identity-banner-row" style={{ ["--cols" as string]: columns }}>
                {row.banners.map((banner) => (
                  <button
                    key={banner.id}
                    type="button"
                    className={banner.id === selectedId ? "identity-banner is-selected" : "identity-banner"}
                    aria-pressed={banner.id === selectedId}
                    onClick={() => onSelect(banner.id)}
                  >
                    <img src={banner.src} alt="" draggable={false} loading="lazy" decoding="async" />
                    <span>{banner.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
