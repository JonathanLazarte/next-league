"use client";

import { useEffect, useRef } from "react";
import { useAppSelector } from "@/hooks/hooks";
import { RESOURCES_URL } from "@/utils/constants";
import { preloadAssetPlan, type AssetPreloadPlan } from "@/utils/preload";

type ConnectionInfo = { saveData?: boolean; effectiveType?: string };
type NavigatorWithConnection = Navigator & { connection?: ConnectionInfo };

/**
 * Dashboard-level scheduler for dynamic assets. Add new plans here instead of
 * tying preloading to a single route or feature.
 */
export default function DashboardAssetsPreloader() {
  const { profile_icon: profileIcon, rank } = useAppSelector((state) => state.user);
  const scheduledFor = useRef<string | null>(null);

  useEffect(() => {
    if (!rank?.name) return;

    const connection = (navigator as NavigatorWithConnection).connection;
    if (connection?.saveData || connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g") return;

    const rankAssetName = rank.name.trim().toLowerCase();
    const plans: AssetPreloadPlan[] = [
      {
        id: "player-presentation",
        priority: "idle",
        urls: profileIcon ? [`${RESOURCES_URL}/profileicon/${profileIcon}.png`] : [],
      },
      {
        id: "pvp-lobby-presentation",
        priority: "idle",
        urls: [
          `${RESOURCES_URL}/general/mini-sr.png`,
          `${RESOURCES_URL}/banner/official (27).png`,
          `${RESOURCES_URL}/ranked-emblem/wings/wings_${rankAssetName}_plate.png`,
        ],
      },
    ];
    const planKey = plans.map((plan) => `${plan.id}:${plan.urls.join("|")}`).join(";");
    if (scheduledFor.current === planKey) return;
    scheduledFor.current = planKey;

    const run = () => {
      plans.filter((plan) => plan.priority === "idle").forEach((plan) => void preloadAssetPlan(plan));
    };
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(run, { timeout: 8_000 });
      return () => idleWindow.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(run, 3_500);
    return () => window.clearTimeout(timeoutId);
  }, [profileIcon, rank?.name]);

  return null;
}
