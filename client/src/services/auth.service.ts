import api from "../utils/api";

export interface RegisterData {
  email: string;
  password: string;
  name: string; // Thay đổi từ firstName và lastName sang name
  role?: "user" | "organizer" | "admin";
  // Thông tin bổ sung cho tổ chức
  organizationName?: string;
  organizationType?: string;
  description?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Interface cho quên mật khẩu
export interface ForgotPasswordData {
  email: string;
}

// Interface cho đặt lại mật khẩu
export interface ResetPasswordData {
  token: string;
  password: string;
}

// Interface cho đổi mật khẩu
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Interface cho việc cập nhật hồ sơ người dùng
export interface UpdateProfileData {
  name?: string;
  avatar?: string; // Giữ lại avatar nếu có logic cập nhật avatar riêng
  bio?: string;
  phone?: string; // Đảm bảo phone có ở đây
  location?: string; // Đảm bảo location có ở đây
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string; // Thay đổi từ firstName và lastName sang name
    role: string;
    avatar?: string;
    bio?: string;
    phone?: string;
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
      const response = await api.get<{ success: boolean; user: any }>(
        "/auth/me"
      );
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

  /**
   * Gửi yêu cầu quên mật khẩu
   * @param data Dữ liệu quên mật khẩu (email)
   */
  forgotPassword: async (data: ForgotPasswordData) => {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
  },

  /**
   * Đặt lại mật khẩu bằng token
   * @param data Dữ liệu đặt lại mật khẩu (token và mật khẩu mới)
   */
  resetPassword: async (data: ResetPasswordData) => {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },

  /**
   * Đổi mật khẩu (khi đã đăng nhập)
   * @param data Dữ liệu đổi mật khẩu
   */
  changePassword: async (data: ChangePasswordData) => {
    const response = await api.put("/auth/change-password", data);
    return response.data;
  },

  /**
   * Cập nhật thông tin người dùng
   * @param data Thông tin cập nhật
   */
  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put("/auth/profile", data);

    // Cập nhật thông tin người dùng trong localStorage
    if (response.data.success && response.data.user) {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...response.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    return response.data;
  },
};

export default authService;
