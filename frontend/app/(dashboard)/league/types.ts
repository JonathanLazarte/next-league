export type SubsectionType =
  | 'carousel'
  | 'patch-notes';

export interface SkinSlide {
  id: string;
  championName: string;
  skinName: string;
  fullTitle: string;
  price: number;
  img: string; // filename like Senna_1.jpg
  badgeType?: 'prestige' | 'mythic' | 'epic' | 'legendary';
}

export interface SkinSet {
  id: string;
  name: string;
  subtitle?: string;
  defaultIndex?: number;
  slides: SkinSlide[];
}

export interface SidebarItem {
  id: string;
  title: string;
  subtitle?: string;
  type: SubsectionType;
  iconType: 'true-damage' | 'crown' | 'masks' | 'trophy' | 'patch-notes';
  hasNotification?: boolean;
  isSpecialThumbnail?: boolean;
  thumbnailUrl?: string;
  skinSet?: SkinSet;
  bgImage?: string;
}
