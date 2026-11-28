"use client";

import { useQuery } from "@tanstack/react-query";
import type { Locale } from "@/i18n/messages";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ProfileIconRecord {
  id: number;
  title: string;
  year: number;
  legacy: boolean;
  rarity: number;
}

export interface ProfileIconSet {
  key: string;
  name: string;
  kind: "set" | "team";
  icons: number[];
}

export interface ProfileIconCatalog {
  icons: ProfileIconRecord[];
  sets: ProfileIconSet[];
}

async function fetchProfileIcons(locale: Locale): Promise<ProfileIconCatalog> {
  const response = await fetch(`${API_URL}/api/v1/data/profile-icons?locale=${locale}`);
  if (!response.ok) throw new Error("profile icons");
  return response.json();
}

export function useProfileIcons(locale: Locale, enabled: boolean) {
  return useQuery({
    queryKey: ["profile-icons", locale],
    queryFn: () => fetchProfileIcons(locale),
    enabled,
    staleTime: Infinity,
  });
}
