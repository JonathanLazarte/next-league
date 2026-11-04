import { SidebarItem, SkinSlide } from './types';

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: 'pickems',
    title: "PICK'EMS DE WORLDS",
    iconType: 'target',
  },
  {
    id: 'cyanide',
    title: 'CYANIDE',
    iconType: 'fist',
  },
  {
    id: 'aram-chaos',
    title: 'ARAM: CAOS',
    iconType: 'chaos',
  },
  {
    id: 'true-damage',
    title: 'ASPECTOS TRUE DAMAGE',
    iconType: 'true-damage',
    isSpecialThumbnail: true,
  },
  {
    id: 'for-the-win',
    title: 'FOR THE WIN',
    iconType: 'crown',
  },
  {
    id: 'heartsteel',
    title: 'ASPECTOS DE HEARTSTEEL',
    iconType: 'masks',
  },
  {
    id: 'worlds-2026',
    title: 'WORLDS 2026',
    iconType: 'trophy',
  },
  {
    id: 'season-worlds',
    title: 'TEMPORADA: WORLDS 2026',
    iconType: 'season',
  },
];

export const PATCH_NOTES_ITEM: SidebarItem = {
  id: 'patch-notes',
  title: 'NOTAS DE LA VERSIÓN',
  iconType: 'patch-notes',
  hasNotification: true,
};

export const TRUE_DAMAGE_SLIDES: SkinSlide[] = [
  {
    id: '84015',
    championName: 'Akali',
    skinName: 'Akali True Damage',
    fullTitle: 'Akali True Damage',
    price: 1350,
    img: 'Akali_15.jpg',
    badgeType: 'epic',
  },
  {
    id: '235001',
    championName: 'Senna',
    skinName: 'Senna True Damage',
    fullTitle: 'Senna True Damage Know My Name',
    price: 1350,
    img: 'Senna_1.jpg',
    badgeType: 'mythic',
  },
  {
    id: '246002',
    championName: 'Qiyana',
    skinName: 'Qiyana True Damage',
    fullTitle: 'Qiyana True Damage',
    price: 1350,
    img: 'Qiyana_2.jpg',
    badgeType: 'epic',
  },
  {
    id: '245019',
    championName: 'Ekko',
    skinName: 'Ekko True Damage',
    fullTitle: 'Ekko True Damage',
    price: 1820,
    img: 'Ekko_19.jpg',
    badgeType: 'legendary',
  },
  {
    id: '157018',
    championName: 'Yasuo',
    skinName: 'Yasuo True Damage',
    fullTitle: 'Yasuo True Damage',
    price: 1350,
    img: 'Yasuo_18.jpg',
    badgeType: 'epic',
  },
];

export const HEARTSTEEL_SLIDES: SkinSlide[] = [
  {
    id: '81043',
    championName: 'Ezreal',
    skinName: 'Ezreal HEARTSTEEL',
    fullTitle: 'Ezreal HEARTSTEEL PARANOIA',
    price: 1350,
    img: 'Ezreal_43.jpg',
    badgeType: 'epic',
  },
  {
    id: '141020',
    championName: 'Kayn',
    skinName: 'Kayn HEARTSTEEL',
    fullTitle: 'Kayn HEARTSTEEL',
    price: 1820,
    img: 'Kayn_20.jpg',
    badgeType: 'legendary',
  },
  {
    id: '875056',
    championName: 'Sett',
    skinName: 'Sett HEARTSTEEL',
    fullTitle: 'Sett HEARTSTEEL',
    price: 1350,
    img: 'Sett_56.jpg',
    badgeType: 'epic',
  },
  {
    id: '777045',
    championName: 'Yone',
    skinName: 'Yone HEARTSTEEL',
    fullTitle: 'Yone HEARTSTEEL',
    price: 1350,
    img: 'Yone_45.jpg',
    badgeType: 'epic',
  },
  {
    id: '523030',
    championName: 'Aphelios',
    skinName: 'Aphelios HEARTSTEEL',
    fullTitle: 'Aphelios HEARTSTEEL',
    price: 1350,
    img: 'Aphelios_30.jpg',
    badgeType: 'epic',
  },
  {
    id: '897008',
    championName: "K'Sante",
    skinName: "K'Sante HEARTSTEEL",
    fullTitle: "K'Sante HEARTSTEEL",
    price: 1350,
    img: 'KSante_8.jpg',
    badgeType: 'epic',
  },
];
