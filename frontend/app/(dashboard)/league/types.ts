export interface SkinSlide {
  id: string;
  championName: string;
  skinName: string;
  fullTitle: string;
  price: number;
  img: string; // filename like Senna_1.jpg
  badgeType?: 'prestige' | 'mythic' | 'epic' | 'legendary';
}

export interface SidebarItem {
  id: string;
  title: string;
  subtitle?: string;
  iconType: 'target' | 'fist' | 'chaos' | 'true-damage' | 'crown' | 'masks' | 'trophy' | 'season' | 'patch-notes';
  hasNotification?: boolean;
  isSpecialThumbnail?: boolean;
  thumbnailUrl?: string;
}
