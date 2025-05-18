import User from "../models/User";
import { generateToken } from "../utils/jwt.utils";

interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
}

/**
 * Service xử lý các chức năng xác thực
 */
const authService = {
  /**
   * Đăng ký người dùng mới
   * @param userData Thông tin đăng ký
   * @returns Thông tin người dùng và token
   */
  register: async (userData: RegisterInput): Promise<AuthResult> => {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("Email đã được sử dụng");
    }

    // Tạo người dùng mới
    const user = await User.create(userData);

    // Tạo token
    const token = generateToken({ id: user._id });

    // Trả về kết quả
    return {
      user: {
        id: user._id?.toString() || "",
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  },

  /**
   * Đăng nhập người dùng
   * @param loginData Thông tin đăng nhập
   * @returns Thông tin người dùng và token
   */
  login: async (loginData: LoginInput): Promise<AuthResult> => {
    // Tìm user theo email
    const user = await User.findOne({ email: loginData.email });
    if (!user) {
      throw new Error("Email hoặc mật khẩu không chính xác");
    }

    // Kiểm tra mật khẩu
    const isPasswordMatch = await user.comparePassword(loginData.password);
    if (!isPasswordMatch) {
      throw new Error("Email hoặc mật khẩu không chính xác");
    }

    // Tạo token
    const token = generateToken({ id: user._id });

    // Trả về kết quả
    return {
      user: {
        id: user._id?.toString() || "",
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  },
};

export default authService;
