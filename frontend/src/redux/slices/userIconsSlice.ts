import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { confirmPurchase } from "./purchaseSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UserIcon {
  id: string;
}

export const getUserIcons = createAsyncThunk<
  UserIcon[],
  string,
  { rejectValue: string }
>(
  "userIcons/getUserIcons",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/user/icon-collection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to fetch icons");
      const data: UserIcon[] = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error: unknown) {
      return rejectWithValue(String(error));
    }
  },
);

interface UserIconsState {
  loading: boolean;
  icons: UserIcon[];
  error: string | null;
}

const initialState: UserIconsState = {
  loading: false,
  icons: [],
  error: null,
};

const userIconsSlice = createSlice({
  name: "userIcons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserIcons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserIcons.fulfilled, (state, action) => {
        state.loading = false;
        state.icons = action.payload;
      })
      .addCase(getUserIcons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(confirmPurchase.fulfilled, (state, action) => {
        const { newInventoryItem, type } = action.payload;
        if (type !== "icon") return;
        const id = String(newInventoryItem.id);
        if (state.icons.some((icon) => icon.id === id)) return;
        state.icons.push({ id });
      });
  },
});

export const selectUserIcons = (state: { userIcons: UserIconsState }) => state.userIcons.icons;
export const selectUserIconsLoading = (state: { userIcons: UserIconsState }) => state.userIcons.loading;
export const selectUserIconsError = (state: { userIcons: UserIconsState }) => state.userIcons.error;

export const selectUserIconsData = createSelector(
  [selectUserIcons, selectUserIconsLoading, selectUserIconsError],
  (icons, loading, error) => ({
    userIcons: icons,
    loading,
    error,
  }),
);

export default userIconsSlice.reducer;
