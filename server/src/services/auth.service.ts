import User, { IUser } from "../models/User";
import PasswordReset, { IPasswordReset } from "../models/PasswordReset";
import { generateToken, verifyToken } from "../utils/jwt.utils";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import emailService from "./email.service";

interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role?: "user" | "organizer" | "admin";
  organizationName?: string;
  organizationType?: string;
  description?: string;
  phone?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface ForgotPasswordInput {
  email: string;
}

interface ResetPasswordInput {
  token: string;
  password: string;
}

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  userId: string | mongoose.Types.ObjectId;
}

interface UpdateProfileInput {
  name?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  userId: string | mongoose.Types.ObjectId;
}

interface AuthResult {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    location?: string;
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
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
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
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
      },
      token,
    };
  },

  /**
   * Gửi email đặt lại mật khẩu
   * @param data Dữ liệu quên mật khẩu
   * @returns Thông báo kết quả
   */
  forgotPassword: async (
    data: ForgotPasswordInput
  ): Promise<{ message: string; previewURL?: string }> => {
    // Tìm user theo email
    const user = await User.findOne({ email: data.email });
    if (!user) {
      // Không báo lỗi cụ thể để tránh lộ thông tin về email tồn tại
      return {
        message:
          "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu",
      };
    }

    // Tạo token ngẫu nhiên
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Thời hạn token: 1 giờ
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    // Lưu token vào database
    await PasswordReset.create({
      userId: user._id,
      token: resetToken,
      expires,
      used: false,
    });

    // Gửi email với link đặt lại mật khẩu
    try {
      const emailResult = await emailService.sendPasswordResetEmail(
        user.email,
        resetToken
      );

      return {
        message:
          "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu",
        previewURL: emailResult.previewURL,
      };
    } catch (error) {
      console.error("Lỗi khi gửi email đặt lại mật khẩu:", error);
      // Vẫn trả về thành công để không tiết lộ email tồn tại hay không
      return {
        message:
          "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu",
      };
    }
  },

  /**
   * Đặt lại mật khẩu với token
   * @param data Dữ liệu đặt lại mật khẩu
   * @returns Thông báo kết quả
   */
  resetPassword: async (
    data: ResetPasswordInput
  ): Promise<{ message: string }> => {
    // Tìm token đặt lại mật khẩu
    const resetRecord = await PasswordReset.findOne({
      token: data.token,
      used: false,
      expires: { $gt: new Date() },
    });

    if (!resetRecord) {
      throw new Error("Token không hợp lệ hoặc đã hết hạn");
    }

    // Tìm user
    const user = await User.findById(resetRecord.userId);
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    // Cập nhật mật khẩu
    user.password = data.password;
    await user.save();

    // Đánh dấu token đã được sử dụng
    resetRecord.used = true;
    await resetRecord.save();

    return { message: "Mật khẩu đã được đặt lại thành công" };
  },

  /**
   * Đổi mật khẩu (khi đã đăng nhập)
   * @param data Dữ liệu đổi mật khẩu
   * @returns Thông báo kết quả
   */
  changePassword: async (
    data: ChangePasswordInput
  ): Promise<{ message: string }> => {
    // Tìm user
    const user = await User.findById(data.userId);
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordMatch = await user.comparePassword(data.currentPassword);
    if (!isPasswordMatch) {
      throw new Error("Mật khẩu hiện tại không chính xác");
    }

    // Cập nhật mật khẩu mới
    user.password = data.newPassword;
    await user.save();

    return { message: "Mật khẩu đã được thay đổi thành công" };
  },

  /**
   * Cập nhật thông tin người dùng
   * @param data Dữ liệu cập nhật
   * @returns Thông tin người dùng đã cập nhật
   */
  updateProfile: async (
    data: UpdateProfileInput
  ): Promise<{
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      avatar?: string;
      bio?: string;
      phone?: string;
      location?: string;
    };
  }> => {
    // Tìm user
    const user = await User.findById(data.userId);
    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    // Cập nhật thông tin
    if (data.name) user.name = data.name;
    if (data.avatar) user.avatar = data.avatar;
    if (data.bio) user.bio = data.bio;
    if (data.phone) user.phone = data.phone;
    if (data.location) user.location = data.location;

    // Lưu thay đổi
    await user.save();

    return {
      user: {
        id: user._id?.toString() || "",
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
      },
    };
  },

  async getCurrentUser(userId: string): Promise<any> {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    console.log("Server returning user data:", {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      // Các trường khác
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      bio: user.bio,
      phone: user.phone,
      location: user.location,
      createdAt: user.createdAt,
    };
  },
};

export default authService;
