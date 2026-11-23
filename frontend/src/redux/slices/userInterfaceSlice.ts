import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import type { Section, UserState } from "@/types/ui";


interface UserInterfaceState {
  userState: UserState;
  actualSection: Section;
  isNavigating: boolean;
  showSideNav: boolean; // Add this
  sectionTabSelected: string | null; // Add this
  modal: null;
  isSettingsModalOpen: boolean;
}

const initialState: UserInterfaceState = {
  // Estado del usuario
  userState: "online", // online | away | inGame | offline

  // Navegación
  actualSection: "league",
  isNavigating: false,
  showSideNav: true, // Initial state
  sectionTabSelected: null, // Initial state

  // Modal global
  modal: null,
  isSettingsModalOpen: false,
};

const userInterfaceSlice = createSlice({
  name: "userInterface",
  initialState,
  reducers: {
    setActualSection: (state, action: PayloadAction<Section>) => {
      state.actualSection = action.payload;
    },
    setUserState: (state, action: PayloadAction<UserState>) => {
      state.userState = action.payload;
    },
    setIsNavigating: (state, action) => {
      state.isNavigating = action.payload;
    },
    toggleSideNav: (state) => {
      state.showSideNav = !state.showSideNav;
    },
    setSectionTabSelected: (state, action) => {
      state.sectionTabSelected = action.payload;
    },
    setIsSettingsModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isSettingsModalOpen = action.payload
    },
  },
});

export const {
  setActualSection,
  setUserState,
  setIsNavigating,
  toggleSideNav,
  setSectionTabSelected,
  setIsSettingsModalOpen,
} = userInterfaceSlice.actions;

interface StateProp {
  userInterface: UserInterfaceState
}

export const selectUserInterfaceActualSection = (state: StateProp) =>
  state.userInterface.actualSection;
export const selectUserInterfaceState = (state: StateProp) =>
  state.userInterface.userState;
export const selectUserInterfaceIsNavigating = (state: StateProp) =>
  state.userInterface.isNavigating;
export const selectUserInterfaceShowSideNav = (state: StateProp) =>
  state.userInterface.showSideNav;
export const selectUserInterfaceSectionTabSelected = (state: StateProp) =>
  state.userInterface.sectionTabSelected;
export const selectIsSettingsModalOpen = (state: StateProp) =>
  state.userInterface.isSettingsModalOpen


export const selectUserInterfaceData = createSelector(
  [
    selectUserInterfaceState,
    selectUserInterfaceActualSection,
    selectUserInterfaceIsNavigating,
    selectUserInterfaceShowSideNav,
    selectUserInterfaceSectionTabSelected,
    selectIsSettingsModalOpen,
  ],
  (userState, actualSection, isNavigating, showSideNav, sectionTabSelected, isSettingsModalOpen) => ({
    userState,
    actualSection,
    isNavigating,
    showSideNav,
    sectionTabSelected,
    isSettingsModalOpen,
  }),
);

export default userInterfaceSlice.reducer;
