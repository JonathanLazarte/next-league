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

export type AssetPriority = "required" | "idle";

export interface AssetPreloadPlan {
  id: string;
  urls: readonly string[];
  priority: AssetPriority;
}

export interface AssetPreloadProgress {
  completed: number;
  total: number;
}

const assetPromises = new Map<string, Promise<void>>();
const planPromises = new Map<string, Promise<void>>();

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

const decodeAsset = (src: string): Promise<void> => {
  const pending = assetPromises.get(src);
  if (pending) return pending;

  const promise = decodeImage(src);
  assetPromises.set(src, promise);
  return promise;
};

/** Preloads any set of URLs and optionally reports decode progress. */
export const preloadAssets = (
  urls: readonly string[],
  onProgress?: (progress: AssetPreloadProgress) => void,
): Promise<void> => {
  const uniqueUrls = [...new Set(urls)];
  let completed = 0;
  const total = uniqueUrls.length;

  if (!total) {
    onProgress?.({ completed: 0, total: 0 });
    return Promise.resolve();
  }

  return Promise.all(
    uniqueUrls.map((url) =>
      decodeAsset(url).finally(() => {
        completed += 1;
        onProgress?.({ completed, total });
      }),
    ),
  ).then(() => undefined);
};

/**
 * Deduplicates a named asset plan. `required` plans can later feed the loading
 * screen progress, while `idle` plans are safe to schedule after the app paints.
 */
export const preloadAssetPlan = (
  plan: AssetPreloadPlan,
  onProgress?: (progress: AssetPreloadProgress) => void,
): Promise<void> => {
  const key = `${plan.id}:${plan.urls.join("|")}`;
  const pending = planPromises.get(key);
  if (pending) return pending;

  const promise = preloadAssets(plan.urls, onProgress);
  planPromises.set(key, promise);
  return promise;
};

export const decodeAssetGroup = (group: AssetGroupName): Promise<void> =>
  preloadAssetPlan({ id: group, urls: ASSET_GROUPS[group], priority: "idle" });

/** @deprecated usar decodeAssetGroup('championDetails') */
export const preloadChampionDetailsAssets = () => {
  void decodeAssetGroup("championDetails");
};
