import api from "../utils/api";

export interface RegisterData {
  email: string;
  password: string;
  name: string;   // Thay đổi từ firstName và lastName sang name
  role?: "user" | "organizer" | "admin";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;   // Thay đổi từ firstName và lastName sang name
    role: string;
    avatar?: string;
    bio?: string;
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
    // Lưu token vào localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
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
  getCurrentUser: async () => {
    // Kiểm tra nếu đã có user trong localStorage
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }
    
    try {
      // Nếu không có hoặc cần refresh, gọi API
      const response = await api.get<{success: boolean, user: any}>("/auth/me");
      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data.user;
      }
      return null;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  },

  /**
   * Lấy token của người dùng hiện tại
   */
  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default authService;