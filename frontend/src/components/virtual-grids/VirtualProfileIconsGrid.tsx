"use client";

import { memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { useI18n } from "@/hooks/useI18n";
import { RESOURCES_URL } from "@/utils/constants";
import type { ProfileIconRecord, ProfileIconSet } from "@/hooks/useProfileIcons";
import "./virtualGrid.css";

const RARITY_GEM: Record<number, string> = {
  2: "/collection/rarity-gem-icons/epic.png",
  3: "/collection/rarity-gem-icons/legendary.png",
  4: "/collection/rarity-gem-icons/mythic.png",
  5: "/collection/rarity-gem-icons/ultimate.png",
  6: "/collection/rarity-gem-icons/exalted.png",
  7: "/collection/rarity-gem-icons/transcendent.png",
};

interface Row {
  type: "header" | "icons";
  year?: number;
  label?: string;
  icons?: ProfileIconRecord[];
}

function fold(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

const CARD_REM = 9.2;
const GAP_REM = 2;
const PAD_REM = 3.6;
const ROW_EXTRA_REM = 2.4;

function rootRem() {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 10;
}

function columnCount(width: number) {
  const rem = rootRem();
  const gap = rem * GAP_REM;
  const card = rem * CARD_REM;
  const padding = rem * PAD_REM;
  return Math.max(1, Math.floor((width + gap - padding) / (card + gap)));
}

export default memo(function VirtualProfileIconsGrid({
  icons,
  sets,
  query,
  filter,
  selectedId,
  onSelect,
  order = "recent",
  ownedIds,
}: {
  icons: ProfileIconRecord[];
  sets: ProfileIconSet[];
  query: string;
  filter: string;
  selectedId: number;
  onSelect: (id: number) => void;
  order?: "recent" | "name";
  ownedIds?: ReadonlySet<number>;
}) {
  const { t } = useI18n();
  const parentRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<number>();

  const measureColumns = useCallback((width: number) => {
    const contentWidth = parentRef.current?.clientWidth || width;
    if (contentWidth < 8) return;
    const next = columnCount(contentWidth);
    setColumns((current) => (current === next ? current : next));
  }, []);

  useLayoutEffect(() => {
    if (!parentRef.current) return;
    measureColumns(parentRef.current.clientWidth);
  }, [measureColumns]);

  useResizeObserver(parentRef, measureColumns);

  const rows = useMemo(() => {
    if (!columns) return [];
    const folded = fold(query.trim());
    const matches = (icon: ProfileIconRecord) => !folded || fold(icon.title).includes(folded);
    const byId = new Map(icons.map((icon) => [icon.id, icon]));
    const result: Row[] = [];

    const pushIcons = (bucket: ProfileIconRecord[], header: { year?: number; label?: string }) => {
      const visible = bucket.filter(matches).sort((a, b) => (
        order === "name" ? a.title.localeCompare(b.title) : b.id - a.id
      ));
      if (visible.length === 0) return;
      result.push({ type: "header", ...header });
      for (let index = 0; index < visible.length; index += columns) {
        result.push({ type: "icons", icons: visible.slice(index, index + columns) });
      }
    };

    if (filter === "set" || filter === "team") {
      for (const set of sets) {
        if (filter === "team" ? set.kind !== "team" : set.kind === "team") continue;
        const bucket = set.icons.flatMap((id) => {
          const icon = byId.get(id);
          return icon ? [icon] : [];
        });
        pushIcons(bucket, { label: set.name });
      }
      return result;
    }

    if (filter === "level") {
      for (let rarity = 7; rarity >= 0; rarity -= 1) {
        pushIcons(
          icons.filter((icon) => icon.rarity === rarity),
          { label: t(`profile.rarity.${rarity}`) },
        );
      }
      return result;
    }

    const byYear = new Map<number, ProfileIconRecord[]>();
    for (const icon of icons) {
      const year = icon.year > 0 ? icon.year : 0;
      const bucket = byYear.get(year);
      if (bucket) bucket.push(icon);
      else byYear.set(year, [icon]);
    }
    for (const year of [...byYear.keys()].sort((a, b) => b - a)) {
      pushIcons(byYear.get(year) ?? [], { year });
    }
    return result;
  }, [icons, sets, query, filter, columns, order, t]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const rem = rootRem();
      return rows[index]?.type === "header" ? rem * 3.6 : rem * (CARD_REM + ROW_EXTRA_REM);
    },
    measureElement: (element) => element.getBoundingClientRect().height,
    overscan: 6,
  });

  const scrollKey = `${query}:${filter}`;
  const lastScrollKey = useRef(scrollKey);
  if (lastScrollKey.current !== scrollKey) {
    lastScrollKey.current = scrollKey;
    parentRef.current?.scrollTo({ top: 0 });
  }

  return (
    <div ref={parentRef} className="profile-icons-grid">
      {columns && rows.length === 0 && <p className="identity-status">{t("profile.empty")}</p>}
      <div style={{ height: rowVirtualizer.getTotalSize(), width: "100%", position: "relative" }}>
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
              {row?.type === "header" && (
                <div className="identity-year">
                  {row.year !== undefined
                    ? (row.year ? `${t("profile.acquiredIn")} ${row.year}` : t("profile.other"))
                    : row.label}
                </div>
              )}
              {row?.type === "icons" && (
                <div
                  className="profile-icons-row"
                  style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    gap: `${GAP_REM}rem`,
                  }}
                >
                  {row.icons?.map((icon) => (
                    <ProfileIcon
                      key={icon.id}
                      icon={icon}
                      selected={icon.id === selectedId}
                      locked={Boolean(ownedIds && !ownedIds.has(icon.id))}
                      onSelect={onSelect}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

const ProfileIcon = memo(function ProfileIcon({
  icon,
  selected,
  locked,
  onSelect,
}: {
  icon: ProfileIconRecord;
  selected: boolean;
  locked: boolean;
  onSelect: (id: number) => void;
}) {
  const gem = RARITY_GEM[icon.rarity];
  const className = [
    "profile-icon",
    selected ? "is-selected" : "",
    locked ? "is-locked" : "",
  ].filter(Boolean).join(" ");
  return (
    <button
      type="button"
      className={className}
      aria-label={icon.title}
      aria-pressed={selected}
      onClick={() => {
        if (!locked) onSelect(icon.id);
      }}
    >
      <img
        className="icon"
        src={`${RESOURCES_URL}/profileicon/${icon.id}.png`}
        alt=""
        draggable={false}
        loading="lazy"
        decoding="async"
      />
      {icon.rarity === 1 && <span className="profile-icon-gem profile-icon-gem-rare" />}
      {gem && <img className="profile-icon-gem" src={gem} alt="" />}
    </button>
  );
});
