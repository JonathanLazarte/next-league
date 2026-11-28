import { createSlice, PayloadAction, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, verifyToken } from "@/redux/slices/authSlice";
import { confirmPurchase } from '@/redux/slices/purchaseSlice'
import { RootState } from '@/redux/store'
import type { User, DatabaseUser } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Rank {
  name: string;
  level: number;
  points: number;
}

interface PurchasePayload {
  coin: Coin,
  price: number,
  newInventoryItem: Record<string, unknown>,
  type: string
}
export type Coin = "RP" | "BE";

export interface UserState {
  userName: string,
  id: string,
  alias: string,
  tag: string,
  title: string,
  level: number,
  EXP: number,
  BE: number,
  RP: number,
  rank: {
    name: string,
    level: number,
    points: number,
  },
  profile_icon: string,
  profile_background: string,
  profile_banner: string,
  profile_border: string,
  profile_title: string,
  loading: boolean,
  token: string,
}

const initialState: UserState = {
  userName: "",
  id: "",
  alias: "",
  tag: "",
  title: "",
  level: 1,
  EXP: 0,
  BE: 20000,
  RP: 3000,
  rank: {
    name: "Bronze",
    level: 4,
    points: 100,
  },
  profile_icon: "",
  profile_background: "",
  profile_banner: "",
  profile_border: "",
  profile_title: "",
  loading: false,
  token: "",
};

export const fetchUser = createAsyncThunk<
  DatabaseUser,
  string
>(
  "user/set-user",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/v1/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token }),
      })
      if (!response.ok) {
        throw new Error('No se pudo obtener el usuario')
      }

      const data = await response.json()

      return data
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)

export interface ProfileIdentity {
  profile_icon: string;
  title: string;
  profile_title: string;
  profile_banner: string;
  profile_border: string;
}

export const saveIdentity = createAsyncThunk<
  ProfileIdentity,
  ProfileIdentity & { userId: string },
  { rejectValue: string }
>(
  "user/saveIdentity",
  async ({ userId, ...identity }, { rejectWithValue }) => {
    if (!userId || userId === "guest-token" || userId === "guest-offline") {
      return identity;
    }
    try {
      const response = await fetch(`${API_URL}/api/v1/user/save-identity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...identity }),
      });
      if (!response.ok) return rejectWithValue("fetch failed");
      return identity;
    } catch (error) {
      return rejectWithValue(String(error));
    }
  },
);

const applyIdentity = (state: UserState, identity: ProfileIdentity) => {
  state.profile_icon = identity.profile_icon;
  state.title = identity.title;
  state.profile_title = identity.profile_title;
  state.profile_banner = identity.profile_banner;
  state.profile_border = identity.profile_border;
};

const updateUserFields = (state: User, action: PayloadAction<User>) => {
  const { payload } = action;
  state.userName = payload.userName;
  state.id = payload.id;
  state.alias = payload.userName;
  state.tag = payload.tag;
  state.title = payload.title;
  state.level = payload.level;
  state.EXP = payload.EXP;
  state.BE = payload.BE;
  state.RP = payload.RP;
  state.profile_icon = payload.profile_icon;
  state.profile_background = payload.profile_background;
  state.profile_banner = payload.profile_banner ?? "";
  state.profile_border = payload.profile_border ?? "";
  state.profile_title = payload.profile_title ?? "";
  state.rank = payload.rank;
}


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      Object.assign(state, action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      Object.assign(state, action.payload)
    },
    setProfileIcon: (state, action: PayloadAction<string>) => {
      state.profile_icon = action.payload;
    },
    updateCoins: (
      state,
      action: PayloadAction<{ coin: Coin; price: number }>,
    ) => {
      state.RP =
        action.payload.coin == "RP"
          ? state.RP - action.payload.price
          : state.RP;
      state.BE =
        action.payload.coin == "BE"
          ? state.BE - action.payload.price
          : state.BE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        Object.assign(state, action.payload)
        state.loading = false
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        updateUserFields(state, action)
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        updateUserFields(state, action)
      })
      .addCase(verifyToken.fulfilled, (state, action: PayloadAction<{ token: string, user: User }>) => {
        const { user } = action.payload
        state.userName = user.userName;
        state.id = user.id;
        state.alias = user.userName;
        state.tag = user.tag;
        state.title = user.title;
        state.level = user.level;
        state.EXP = user.EXP;
        state.BE = user.BE;
        state.RP = user.RP;
        state.profile_icon = user.profile_icon;
        state.profile_background = user.profile_background;
        state.profile_banner = user.profile_banner ?? "";
        state.profile_border = user.profile_border ?? "";
        state.profile_title = user.profile_title ?? "";
        state.rank = user.rank;

      })
      .addCase(confirmPurchase.fulfilled, (state, action: PayloadAction<PurchasePayload>) => {
        const { coin, price } = action.payload
        state[coin] = state[coin] - price;
      })
      .addCase(saveIdentity.pending, (state, action) => {
        applyIdentity(state, action.meta.arg);
      });
  },
});

export const { setUser, updateUser, updateCoins, setProfileIcon } =
  userSlice.actions;

export const selectRP = (state: RootState) => state.user.RP;
export const selectBE = (state: RootState) => state.user.BE;

export const selectUserData = createSelector(
  [selectRP, selectBE],
  (RP, BE) => ({
    RP,
    BE
  }))

export default userSlice.reducer;
