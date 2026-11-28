"use client";

import "./icons.css";
import { memo, useMemo, useState } from "react";
import StoreSidePanel from "@/components/StoreSidePanel/StoreSidePanel";
import VirtualStoreGrid from "@/components/virtual-grids/VirtualStoreGrid";
import ProfileIconCard, { type StoreProfileIcon } from "@/components/cards/store/ProfileIcon/ProfileIcon";
import { useProfileIcons } from "@/hooks/useProfileIcons";
import { useUserIcons } from "@/hooks/useUserIcons";
import { useI18n } from "@/hooks/useI18n";
import { STORE_SORT_OPTIONS } from "@/utils/constants";
import type { SortOptionsValues } from "@/types/ui";

const PRICE_BY_RARITY: Record<number, { rp: number; be: number }> = {
  0: { rp: 250, be: 1500 },
  1: { rp: 250, be: 1500 },
  2: { rp: 520, be: 3250 },
  3: { rp: 750, be: 4800 },
  4: { rp: 1350, be: 10200 },
  5: { rp: 1820, be: 13500 },
  6: { rp: 2450, be: 18000 },
  7: { rp: 3250, be: 24000 },
};

const SUBSECTIONS = ["GESTURES", "CLASH", "SENTINELS", "ICONS", "AUGMENTS", "RUNE_PAGE", "BUNDLES"];

function fold(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export default memo(function IconsStore() {
  const { t, locale } = useI18n();
  const catalog = useProfileIcons(locale, true);
  const { userIcons } = useUserIcons();
  const [subsectionSelected, setSubsectionSelected] = useState("ICONS");
  const [searchKeys, setSearchKeys] = useState("");
  const [showOwned, setShowOwned] = useState(false);
  const [sortedBy, setSortedBy] = useState<SortOptionsValues | null>("ReleaseDesc");
  const [blueEssence, setBlueEssence] = useState(false);

  const ownedIds = useMemo(() => new Set(userIcons.map((icon) => icon.id)), [userIcons]);

  const items = useMemo(() => {
    const folded = fold(searchKeys.trim());
    let result: StoreProfileIcon[] = (catalog.data?.icons ?? []).map((icon) => ({
      id: String(icon.id),
      title: icon.title,
      rarity: icon.rarity,
      year: icon.year,
      price: PRICE_BY_RARITY[icon.rarity] ?? PRICE_BY_RARITY[0],
    }));

    result = result.filter((icon) => {
      const matchesSearch = !folded || fold(icon.title).includes(folded);
      const matchesOwned = showOwned || !ownedIds.has(icon.id);
      const matchesEssence = !blueEssence || icon.price.be > 0;
      return matchesSearch && matchesOwned && matchesEssence;
    });

    if (sortedBy === "AlphabeticallyDescend") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sortedBy === "AlphabeticallyAscend") result.sort((a, b) => b.title.localeCompare(a.title));
    if (sortedBy === "PriceRpDescend") result.sort((a, b) => b.price.rp - a.price.rp);
    if (sortedBy === "PriceRpAscend") result.sort((a, b) => a.price.rp - b.price.rp);
    if (sortedBy === "PriceBeDescend") result.sort((a, b) => b.price.be - a.price.be);
    if (sortedBy === "PriceBeAscend") result.sort((a, b) => a.price.be - b.price.be);
    if (sortedBy === "ReleaseDesc") result.sort((a, b) => b.year - a.year);
    if (sortedBy === "ReleaseAscend") result.sort((a, b) => a.year - b.year);
    return result;
  }, [catalog.data, searchKeys, showOwned, sortedBy, ownedIds, blueEssence]);

  return (
    <div className="icons-store">
      <StoreSidePanel
        subsections={SUBSECTIONS}
        subsectionSelected={subsectionSelected}
        setSubsectionSelected={setSubsectionSelected}
        searchKeys={searchKeys}
        setSearchKeys={setSearchKeys}
        inCollection={showOwned}
        setInCollection={setShowOwned}
        sortOptions={STORE_SORT_OPTIONS}
        sortedBy={sortedBy}
        setSortedBy={setSortedBy}
        showOnSale={false}
        blueEssence={blueEssence}
        onToggleBlueEssence={() => setBlueEssence((current) => !current)}
      />
      {subsectionSelected !== "ICONS" && (
        <div className="poro-apologizes flex justify-center items-center grow">
          <img src="/global/poro_question.png" alt="" />
        </div>
      )}
      {subsectionSelected === "ICONS" && catalog.isLoading && (
        <p className="identity-status">{t("common.loading")}</p>
      )}
      {subsectionSelected === "ICONS" && catalog.isError && (
        <p className="identity-status">{t("profile.loadError")}</p>
      )}
      {subsectionSelected === "ICONS" && catalog.data && (
        <VirtualStoreGrid
          items={items}
          ownedItems={userIcons}
          StoreCard={ProfileIconCard}
        />
      )}
    </div>
  );
});
