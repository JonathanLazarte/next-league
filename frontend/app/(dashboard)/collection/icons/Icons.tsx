"use client";

import "./icons.css";
import { memo, useMemo, useState } from "react";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import SearchField from "@/components/SearchField/SearchField";
import VirtualProfileIconsGrid from "@/components/virtual-grids/VirtualProfileIconsGrid";
import { useProfileIcons } from "@/hooks/useProfileIcons";
import { useUserIcons } from "@/hooks/useUserIcons";
import { useUser } from "@/hooks/useUser";
import { useI18n } from "@/hooks/useI18n";

const RARITY_GEM: Record<number, string> = {
  2: "/collection/rarity-gem-icons/epic.png",
  3: "/collection/rarity-gem-icons/legendary.png",
  4: "/collection/rarity-gem-icons/mythic.png",
  5: "/collection/rarity-gem-icons/ultimate.png",
  6: "/collection/rarity-gem-icons/exalted.png",
  7: "/collection/rarity-gem-icons/transcendent.png",
};

const VIEW_OPTIONS = [
  { value: "collection", label: "filters.myCollection" },
  { value: "all", label: "filters.all" },
];

const ORDER_OPTIONS = [
  { value: "recent", label: "filters.acquisitionDate" },
  { value: "name", label: "filters.alphabetical" },
];

export default memo(function CollectionIcons() {
  const { t, locale } = useI18n();
  const catalog = useProfileIcons(locale, true);
  const { userIcons } = useUserIcons();
  const { id, token, title, profile_title, profile_banner, profile_border, profile_icon, saveIdentity } = useUser();
  const [query, setQuery] = useState("");
  const [view, setView] = useState("collection");
  const [order, setOrder] = useState("recent");

  const ownedIds = useMemo(() => new Set(userIcons.map((icon) => Number(icon.id))), [userIcons]);
  const ownedIcons = useMemo(
    () => (catalog.data?.icons ?? []).filter((icon) => ownedIds.has(icon.id)),
    [catalog.data, ownedIds],
  );
  const rarityCounts = useMemo(() => {
    const counts = new Map<number, number>();
    let legacy = 0;
    for (const icon of ownedIcons) {
      counts.set(icon.rarity, (counts.get(icon.rarity) ?? 0) + 1);
      if (icon.legacy) legacy += 1;
    }
    return { counts, legacy };
  }, [ownedIcons]);

  const visibleIcons = view === "collection" ? ownedIcons : (catalog.data?.icons ?? []);

  const equip = (iconId: number) => {
    if (!ownedIds.has(iconId)) return;
    const userId = id && id !== "guest-offline" ? id : token;
    void saveIdentity({
      userId,
      profile_icon: String(iconId),
      title,
      profile_title: profile_title || "",
      profile_banner: profile_banner || "",
      profile_border: profile_border || "",
    });
  };

  return (
    <div className="collection-icons">
      <aside className="collection-icons-panel">
        <div className="square-hextech collection-icons-summary">
          <svg className="hextech-border" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 243.62 224.22">
            <path className="cls-1" d="M1,7.93c4.73,0,8.56-3.1,8.56-6.93h224.49c0,3.83,3.83,6.93,8.56,6.93" />
            <path className="cls-1" d="M16.5,218.88c-2.22-5.21-8.31-8.95-15.5-8.95V14.57c7.19,0,13.28-3.74,15.5-8.95" />
            <path className="cls-1 resalted" d="M242.62,216.29c-4.73,0-8.56,3.1-8.56,6.93H9.56c0-3.83-3.83-6.93-8.56-6.93" />
            <path className="cls-1" d="M227.12,5.33c2.22,5.21,8.31,8.95,15.5,8.95v195.36c-7.19,0-13.28,3.74-15.5,8.95" />
          </svg>
          <div className="maestry-etern-levels">
            <div className="amount-and-description">
              <div className="amount">{ownedIcons.length}</div>
              <div className="description">{t("collection.totalIcons")}</div>
            </div>
          </div>
        </div>
        <div className="collection-icons-rarities">
          {[2, 3, 4, 5, 6, 7].map((rarity) => (
            <div key={rarity} className="collection-icons-rarity">
              <img src={RARITY_GEM[rarity]} alt="" />
              <span>{rarityCounts.counts.get(rarity) ?? 0}</span>
            </div>
          ))}
        </div>
        <div className="collection-icons-legacy">
          <span className="collection-icons-legacy-dot" />
          <span>{rarityCounts.legacy}</span>
        </div>
        <SearchField
          value={query}
          placeholder={t("common.search")}
          onChange={setQuery}
        />
        <CustomSelect
          options={VIEW_OPTIONS}
          value={view}
          onChange={setView}
          className="select-filter"
        />
        <CustomSelect
          options={ORDER_OPTIONS}
          value={order}
          onChange={setOrder}
          className="select-filter"
        />
      </aside>
      <div className="collection-icons-main">
        <button
          type="button"
          className="collection-icons-save"
          onClick={() => profile_icon && equip(Number(profile_icon))}
        >
          {t("buttons.save")}
        </button>
        {catalog.isLoading && <p className="identity-status">{t("common.loading")}</p>}
        {catalog.isError && <p className="identity-status">{t("profile.loadError")}</p>}
        {catalog.data && visibleIcons.length === 0 && (
          <p className="identity-status">{t("collection.noIcons")}</p>
        )}
        {catalog.data && visibleIcons.length > 0 && (
          <VirtualProfileIconsGrid
            icons={visibleIcons}
            sets={catalog.data.sets}
            query={query}
            filter="all"
            order={order === "name" ? "name" : "recent"}
            ownedIds={view === "all" ? ownedIds : undefined}
            selectedId={profile_icon ? Number(profile_icon) : -1}
            onSelect={equip}
          />
        )}
      </div>
    </div>
  );
});
