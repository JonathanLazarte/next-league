import { useCallback } from "react";
import { useSelector } from "react-redux";
import { getUserIcons, selectUserIconsData } from "@/redux/slices/userIconsSlice";
import { useAppDispatch } from "@/hooks/hooks";

export function useUserIcons() {
  const dispatch = useAppDispatch();
  const userIconsState = useSelector(selectUserIconsData);
  const fetchUserIcons = useCallback((id: string) => dispatch(getUserIcons(id)), [dispatch]);

  return {
    ...userIconsState,
    getUserIcons: fetchUserIcons,
  };
}
