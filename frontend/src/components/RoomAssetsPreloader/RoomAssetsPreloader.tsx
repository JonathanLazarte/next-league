"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/hooks/hooks";
import { preloadRoomAssets } from "@/utils/preload";

type ConnectionInfo = {
  saveData?: boolean;
  effectiveType?: string;
};

type NavigatorWithConnection = Navigator & {
  connection?: ConnectionInfo;
};

export default function RoomAssetsPreloader() {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const { profile_icon: profileIcon, rank } = useAppSelector((state) => state.user);
  const scheduledFor = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || loading || pathname === "/" || pathname === "/login" || pathname === "/register") {
      return;
    }

    const connection = (navigator as NavigatorWithConnection).connection;
    if (connection?.saveData || connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g") {
      return;
    }

    const assetKey = `${profileIcon}:${rank.name}`;
    if (scheduledFor.current === assetKey) return;
    scheduledFor.current = assetKey;

    const run = () => {
      void preloadRoomAssets({ profileIcon, rankName: rank.name });
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
  }, [isAuthenticated, loading, pathname, profileIcon, rank.name]);

  return null;
}