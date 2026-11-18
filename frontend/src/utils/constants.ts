/**
 * Constantes globales de la aplicación
 */
export const RESOURCES_URL = "https://raw.githubusercontent.com/JonathanLazarte/league-resources/refs/heads/main" /*"http://d2l6vvcxr1n0o0.cloudfront.net"*/;
export const RARITY_LEVELS = [
  "Signature",
  "Hall",
  "Ultimate",
  "Mythic",
  "Legendary",
  "Epic",
];

export const GROUP_MODES = {
  COLLECTION: "collection",
  ALL: "all",
  CHAMPION: "champion",
  SET: "set",
  LEVEL: "level",
};

export const STORE_SORT_OPTIONS = [
  { value: null, label: "filters.releaseDateDesc" },
  { value: "ReleaseAscend", label: "filters.releaseDateAsc" },
  { value: "PriceRpDescend", label: "filters.priceRpDesc" },
  { value: "PriceRpAscend", label: "filters.priceRpAsc" },
  { value: "PriceBeDescend", label: "filters.priceBeDesc" },
  { value: "PriceBeAscend", label: "filters.priceBeAsc" },
  { value: "AlphabeticallyDescend", label: "filters.alphaAZ" },
  { value: "AlphabeticallyAscend", label: "filters.alphaZA" },
] as const;

export const SKIN_SORT_OPTIONS = [

] as const;

export const CHAMPION_SORT_OPTIONS = [
  { value: "alphabetically", label: "filters.alphabetical" },
  { value: "championsMastery", label: "filters.mastery" },
] as const;

export const CHAMPION_GROUP_OPTIONS = [
    { value: "all", label: "filters.allChampions" },
    { value: "possession", label: "filters.possession" },
    { value: "role", label: "filters.role" },
] as const

export const HOVER_DELAYS = {
  INITIAL: 250,
  FAST: 0,
  RESET_AFTER: 500,
};

export const API_ENDPOINTS = {
  SKINS: "api/v1/data/skin",
  DATA: "api/v1/data",
  USERS: "api/v1/user",
};

export const SECTION_LABELS = {
  collection: "sections.collection",
  store: "sections.store",
  league: "sections.league",
}

export const SECTIONS = {
  LEAGUE: {
    id: 'league',
    label: 'LEAGUE',
    type: 'text',
    path: '/league'
  },
  COLLECTION: {
    id: 'collection',
    label: 'Collection',
    icon: 'collection',
    type: 'icon',
    hasSeparator: true
  },
  STORE: {
    id: 'store',
    label: 'Store',
    icon: 'store',
    type: 'icon',
    hasSeparator: true
  }
};

export const LEFT_HEADER_TABS = [SECTIONS.LEAGUE];
export const RIGHT_HEADER_TABS = [SECTIONS.COLLECTION, SECTIONS.STORE];

export const BACKGROUND_URLS = {
  league: "/Jayce_34.webp",
  store: "/store_background.webp",
  collection: "/collection_background.webp",
  play: ""
}

export const FILTER_OPTIONS_BY_GROUPING = {
  collection: [
    { value: "purchaseDate", label: "filters.acquisitionDate" },
    { value: "releaseDate", label: "filters.releaseDate" },
    { value: "alphabetical", label: "filters.alphabetical" },
  ],
  all: [
    { value: "releaseDate", label: "filters.releaseDate" },
    { value: "alphabetical", label: "filters.alphabetical" },
  ],
  champion: [
    { value: "mastery", label: "filters.mastery" },
    { value: "mostOwned", label: "filters.mostOwned" },
    { value: "alphabetical", label: "filters.alphabetical" },
  ],
  set: [
    { value: "mostOwned", label: "filters.mostOwned" },
    { value: "alphabetical", label: "filters.alphabetical" },
  ],
  level: [
    { value: "rarity", label: "filters.rarityDefault" }
  ],
} as const;

export const GROUPING_OPTIONS_CHAMPION = [
  { value: "all", label: "filters.all" },
  { value: "role", label: "filters.role" },
  { value: "possession", label: "filters.possession" }
] as const;

export const SKIN_FILTER_OPTIONS = [
  { value: "collection", label: "filters.myCollection" },
  { value: "all", label: "filters.all" },
  { value: "champion", label: "filters.champion" },
  { value: "set", label: "filters.set" },
  { value: "level", label: "filters.tier" },
] as const;

export const GAME_DATA = {
  PVP: [
    {
      id: "summonersRift",
      hoverImg: "sr-icon-hover.png",
      enabledImg: "sr-icon-active.png",
      disabledImg: "sr-icon-default.png",
      subTitle: "5v5",
      queues: [
        { name: "swiftplay" },
        { name: "ranked_solo_duo" },
        { name: "ranked_flex" },
      ],
    },
    {
      id: "aram",
      hoverImg: "aram-hover.png",
      enabledImg: "aram-active.png",
      disabledImg: "aram-default.png",
      subTitle: "5v5",
      queues: [
        { name: "aram_mayhem" },
        { name: "aram" },
      ],
    },
  ],
  CO_OP_VS_AI: [
    {
      id: "summonersRift",
      hoverImg: "sr-icon-hover.png",
      enabledImg: "sr-icon-active.png",
      disabledImg: "sr-icon-default.png",
      subTitle: "5v5",
      queues: [
        { name: "intro" },
        { name: "beginner" },
        { name: "intermediate" },
      ],
    },
  ],
} as const;
