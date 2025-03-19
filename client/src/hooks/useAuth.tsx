import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  login,
  register,
  logout,
  selectAuth,
  selectIsAuthenticated,
  selectUser,
  selectAuthError,
  selectAuthLoading,
} from "../app/features/authSlice";
import type { LoginData, RegisterData } from "../services/auth.service";

/**
 * Custom hook để quản lý authentication
 */
const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Selectors
  const auth = useAppSelector(selectAuth);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const error = useAppSelector(selectAuthError);
  const isLoading = useAppSelector(selectAuthLoading);

  // Actions
  const loginUser = useCallback(
    async (data: LoginData) => {
      const result = await dispatch(login(data));
      if (login.fulfilled.match(result)) {
        // Chuyển hướng người dùng sau khi đăng nhập thành công
        navigate("/");
        return true;
      }
      return false;
    },
    [dispatch, navigate]
  );

  const registerUser = useCallback(
    async (data: RegisterData) => {
      const result = await dispatch(register(data));
      if (register.fulfilled.match(result)) {
        // Chuyển hướng người dùng sau khi đăng ký thành công
        navigate("/");
        return true;
      }
      return false;
    },
    [dispatch, navigate]
  );

  const logoutUser = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  return {
    // State
    auth,
    isAuthenticated,
    user,
    error,
    isLoading,

    // Actions
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
  };
};

export default useAuth;
