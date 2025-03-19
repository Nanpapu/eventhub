import api from "../utils/api";

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

/**
 * Service cho Authentication
 */
const authService = {
  /**
   * Đăng ký người dùng mới
   * @param data Thông tin đăng ký
   */
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  /**
   * Đăng nhập người dùng
   * @param data Thông tin đăng nhập
   */
  login: async (data: LoginData) => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    // Lưu token vào localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  /**
   * Đăng xuất người dùng
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  /**
   * Kiểm tra người dùng đã đăng nhập chưa
   */
  isLoggedIn: () => {
    return localStorage.getItem("token") !== null;
  },

  /**
   * Lấy thông tin người dùng hiện tại
   */
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return null;
  },

  /**
   * Lấy token của người dùng hiện tại
   */
  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;
