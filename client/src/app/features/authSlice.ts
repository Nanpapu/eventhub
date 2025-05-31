import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authService, {
  LoginData,
  RegisterData,
  AuthResponse,
} from "../../services/auth.service";
import { RootState } from "../store";
import { createAction } from "@reduxjs/toolkit";

// Định nghĩa interface cho state
interface AuthState {
  user: AuthResponse["user"] | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Khởi tạo state từ localStorage
const token = localStorage.getItem("token");
const userStr = localStorage.getItem("user");
let user = null;

if (userStr) {
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    localStorage.removeItem("user");
  }
}

const initialState: AuthState = {
  user: user,
  token: token,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

// Async thunk cho đăng nhập
export const login = createAsyncThunk<
  AuthResponse,
  LoginData,
  { rejectValue: string }
>("auth/login", async (loginData, { rejectWithValue }) => {
  try {
    return await authService.login(loginData);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// Async thunk cho đăng ký
export const register = createAsyncThunk<
  AuthResponse,
  RegisterData,
  { rejectValue: string }
>("auth/register", async (registerData, { rejectWithValue }) => {
  try {
    return await authService.register(registerData);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Registration failed"
    );
  }
});

// Async thunk cho logout
export const logout = createAsyncThunk("auth/logout", async () => {
  authService.logout();
});

/**
 * Action để cập nhật thông tin người dùng hiện tại trong store
 */
export const updateUser =
  createAction<Partial<AuthState["user"]>>("auth/updateUser");

// Tạo auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reset state
    resetAuthState: (state) => {
      state.error = null;
      state.isLoading = false;
    },

    [updateUser.type]: (
      state,
      action: PayloadAction<Partial<AuthState["user"]>>
    ) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      })

      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Logout case
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

// Export actions
export const { resetAuthState } = authSlice.actions;

// Export selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;

// Export reducer
export default authSlice.reducer;
