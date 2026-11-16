/**
 * Precarga + decode de assets por grupo de ruta.
 *
 * No incrustar estos PNG como Data URI en uiAssets.ts: inflaría el bundle
 * que carga todo el cliente. Cada grupo se pide y se decodifica solo cuando
 * el usuario entra a la pantalla que lo usa (p. ej. collection).
 *
 * decode() deja el bitmap en la caché de imagen del navegador, así el modal
 * no espera red ni rasterización en el primer paint.
 */

import { RESOURCES_URL } from "@/utils/constants";

export const ASSET_GROUPS = {
  championDetails: [
    "/champion-details/cdp_graph_backing.png",
    "/champion-details/cdp-graph-damage-hover.png",
    "/champion-details/cdp-graph-crowd-control-hover.png",
    "/champion-details/cdp-graph-mobility-hover.png",
    "/champion-details/cdp-graph-toughness-hover.png",
    "/champion-details/cdp-graph-utility-hover.png",
    "/champion-details/cdp-graph-segment-l1.png",
    "/champion-details/cdp-graph-segment-l1-hover.png",
    "/champion-details/cdp-graph-segment-l2.png",
    "/champion-details/cdp-graph-segment-l2-hover.png",
    "/champion-details/cdp-graph-segment-l3.png",
    "/champion-details/cdp-graph-segment-l3-hover.png",
    "/champion-details/continuum_graph_line.png",
    "/champion-details/continuum_graph_pip.png",
    "/champion-details/continuum_icon_attackspeed.png",
    "/champion-details/continuum_icon_attackspeed_grey.png",
    "/champion-details/continuum_icon_abilitypower.png",
    "/champion-details/continuum_icon_abilitypower_grey.png",
    "/champion-details/difficultygraph_difficulty1.png",
    "/champion-details/difficultygraph_difficulty2.png",
    "/champion-details/difficultygraph_difficulty3.png",
    "/champion-details/difficultygraph_empty.png",
    "/champion-details/role-icon-assassin.png",
    "/champion-details/role-icon-fighter.png",
    "/champion-details/role-icon-mage.png",
    "/champion-details/role-icon-marksman.png",
    "/champion-details/role-icon-support.png",
    "/champion-details/role-icon-tank.png",
  ],
} as const;

export type AssetGroupName = keyof typeof ASSET_GROUPS;

const groupPromises = new Map<AssetGroupName, Promise<void>>();

const decodeImage = (src: string): Promise<void> => {
  const img = new Image();
  img.src = src;
  if (typeof img.decode === "function") {
    return img.decode().catch(() => undefined);
  }
  return new Promise((resolve) => {
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
};

export const decodeAssetGroup = (group: AssetGroupName): Promise<void> => {
  const pending = groupPromises.get(group);
  if (pending) return pending;

  const promise = Promise.all(ASSET_GROUPS[group].map(decodeImage)).then(
    () => undefined,
  );
  groupPromises.set(group, promise);
  return promise;
};

/** @deprecated usar decodeAssetGroup('championDetails') */
export const preloadChampionDetailsAssets = () => {
  void decodeAssetGroup("championDetails");
};
type RoomAssetUser = {
  profileIcon?: string;
  rankName?: string;
};

const roomAssetPromises = new Map<string, Promise<void>>();

/**
 * Precarga los recursos que la sala PvP muestra inmediatamente.
 * Se invoca durante un período inactivo, nunca en la navegación crítica.
 */
export const preloadRoomAssets = ({ profileIcon, rankName }: RoomAssetUser): Promise<void> => {
  const rank = rankName?.trim().toLowerCase() || "bronze";
  const assets = [
    `${RESOURCES_URL}/general/mini-sr.png`,
    `${RESOURCES_URL}/banner/official (27).png`,
    `${RESOURCES_URL}/ranked-emblem/wings/wings_${rank}_plate.png`,
    ...(profileIcon ? [`${RESOURCES_URL}/profileicon/${profileIcon}.png`] : []),
  ];
  const cacheKey = assets.join("|");
  const pending = roomAssetPromises.get(cacheKey);

  if (pending) return pending;

  const promise = Promise.all(assets.map(decodeImage)).then(() => undefined);
  roomAssetPromises.set(cacheKey, promise);
  return promise;
};
