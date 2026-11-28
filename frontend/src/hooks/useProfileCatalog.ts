"use client";

import { useQuery } from "@tanstack/react-query";
import type { Locale } from "@/i18n/messages";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ProfileTitle {
  id: string;
  name: string;
}

export interface ProfileTitleGroup {
  id: string;
  name: string;
  titles: ProfileTitle[];
}

export interface ProfileTitleCatalog {
  groups: ProfileTitleGroup[];
}

export interface ProfileBanner {
  id: string;
  name: string;
  src: string;
}

export interface ProfileBannerCatalog {
  banners: ProfileBanner[];
}

export interface ProfileBorder {
  id: string;
  name: string;
  level: number;
  file: string;
}

export interface ProfileBorderCatalog {
  borders: ProfileBorder[];
}

async function fetchCatalog<T>(path: string, locale: Locale): Promise<T> {
  const response = await fetch(`${API_URL}/api/v1/data/${path}?locale=${locale}`);
  if (!response.ok) throw new Error(path);
  return response.json();
}

export function useProfileTitles(locale: Locale, enabled: boolean) {
  return useQuery({
    queryKey: ["profile-titles", locale],
    queryFn: () => fetchCatalog<ProfileTitleCatalog>("profile-titles", locale),
    enabled,
    staleTime: Infinity,
  });
}

export function useProfileBorders(locale: Locale, enabled: boolean) {
  return useQuery({
    queryKey: ["profile-borders", locale],
    queryFn: () => fetchCatalog<ProfileBorderCatalog>("profile-borders", locale),
    enabled,
    staleTime: Infinity,
  });
}

export function useProfileBanners(locale: Locale, enabled: boolean) {
  return useQuery({
    queryKey: ["profile-banners", locale],
    queryFn: () => fetchCatalog<ProfileBannerCatalog>("profile-banners", locale),
    enabled,
    staleTime: Infinity,
  });
}
