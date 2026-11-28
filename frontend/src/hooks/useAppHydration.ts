import { useEffect } from 'react';
import { useUser } from "@/hooks/useUser";
import { useUserChampions } from "@/hooks/useUserChampions";
import { useUserSkins } from "@/hooks/useUserSkins";
import { useUserIcons } from "@/hooks/useUserIcons";
import { preload } from 'react-dom'

export const useAppHydration = ( token: string | null ) => {
  const { fetchUser } = useUser();
  const { getUserChampions } = useUserChampions();
  const { getUserSkins } = useUserSkins()
  const { getUserIcons } = useUserIcons()

  useEffect(() => {
    if (!token) return;
    preload('/collection/borders/borders_epic.png', { as: "image" })
    getUserChampions(token);
    getUserSkins(token);
    getUserIcons(token);
    fetchUser(token);
  }, [token, fetchUser, getUserChampions, getUserSkins, getUserIcons]);
};
