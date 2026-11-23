import { useDispatch } from 'react-redux';
import { useAppSelector } from './hooks';
import { useCallback } from 'react';
import {
  setActualSection,
  setIsNavigating,
  toggleSideNav,
  setUserState,
  setIsSettingsModalOpen,
  selectUserInterfaceData,
} from '@/redux/slices/userInterfaceSlice';
import type { UserState, Section } from '@/types/ui'


export const useUserInterface = () => {
  const dispatch = useDispatch();
  const uiState = useAppSelector(selectUserInterfaceData);

  const changeSection = useCallback((section: Section) => {
    dispatch(setActualSection(section));
  }, [dispatch]);

  const setNavigating = useCallback((isNavigating: boolean) => {
    dispatch(setIsNavigating(isNavigating));
  }, [dispatch]);

  const updateUserState = useCallback((userState: UserState) => {
    dispatch(setUserState(userState));
  }, [dispatch]);


  const updateSideNav = useCallback(() => {
    dispatch(toggleSideNav())
  }, [dispatch])

  const updateSettingsModal = useCallback((status: boolean) => {
    dispatch(setIsSettingsModalOpen(status))
  }, [dispatch])

  return {
    // Estado
    ...uiState,

    // Acciones
    changeSection,
    setNavigating,
    updateUserState,
    updateSideNav,
    updateSettingsModal,
  };
};
