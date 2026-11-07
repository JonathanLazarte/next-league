import { User, UserCredentials } from "@/types/user";
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";

// Async thunk para login
export const loginUser = createAsyncThunk<
  User,
  UserCredentials,
  {
    rejectValue: string;
  }
>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        },
      );

      let data: Record<string, any> = {};
      try {
        data = await response.json();
      } catch {
        data = { error: "El servidor backend se está desplegando o iniciando en Render." };
      }

      if (!response.ok) {
        if ([502, 503, 504].includes(response.status)) {
          return rejectWithValue("El servidor backend se está desplegando o iniciando (cold start de Render). Por favor espera unos momentos.");
        }
        return rejectWithValue(data.error || "Login failed");
      }
      // Guardar token en localStorage
      localStorage.setItem("token", data.token);

      return data as User;
    } catch (error) {
      const errStr = String(error);
      if (errStr.includes("Failed to fetch") || errStr.includes("NetworkError")) {
        return rejectWithValue("El servidor backend se está desplegando o no responde. Por favor espera unos momentos.");
      }
      return rejectWithValue(errStr);
    }
  },
);

// Async thunk para registro
export const registerUser = createAsyncThunk<
  User,
  UserCredentials,
  {
    rejectValue: string;
  }
>(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        },
      );

      let data: Record<string, any> = {};
      try {
        data = await response.json();
      } catch {
        data = { error: "El servidor backend se está desplegando o iniciando en Render." };
      }

      if (!response.ok) {
        if ([502, 503, 504].includes(response.status)) {
          return rejectWithValue("El servidor backend se está desplegando o iniciando (cold start de Render). Por favor espera unos momentos.");
        }
        return rejectWithValue(data.error || "Register failed");
      }
      // Guardar token en localStorage
      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      const errStr = String(error);
      if (errStr.includes("Failed to fetch") || errStr.includes("NetworkError")) {
        return rejectWithValue("El servidor backend se está desplegando o no responde. Por favor espera unos momentos.");
      }
      return rejectWithValue(errStr);
    }
  },
);

export interface Rank {
  name: string;
  level: number;
  points: number;
}

// Async thunk para verificar token
export const verifyToken = createAsyncThunk<
  { token: string; user: User },
  string,
  {
    rejectValue: string;
  }
>(
  "auth/verifyToken",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
          }),
        },
      );

      let data: Record<string, any> = {};
      try {
        data = await response.json();
      } catch {
        data = { message: "Servidor desplegándose" };
      }

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
        }
        return rejectWithValue(data.message || "Token verification failed");
      }

      return data as { token: string; user: User };
    } catch (error) {
      // IMPORTANTE: NO borrar token de localStorage si fue fallo de red/despliegue
      return rejectWithValue(String(error));
    }
  },
);

interface AuthState {
  isAuthenticated: boolean;
  token: null | string;
  loading: boolean;
  error: null | string | undefined;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify token
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
