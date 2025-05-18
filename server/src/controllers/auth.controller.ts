import { Request, Response } from "express";
import { validationResult } from "express-validator";
import authService from "../services/auth.service";

/**
 * Controller xử lý các request liên quan đến xác thực
 */
const authController = {
  /**
   * Đăng ký người dùng mới
   * @route POST /api/auth/register
   */
  register: async (req: Request, res: Response) => {
    try {
      // Kiểm tra lỗi từ validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      // Xử lý đăng ký
      const { email, password, name } = req.body;
      const result = await authService.register({
        email,
        password,
        name,
      });

      // Trả về kết quả
      return res.status(201).json({
        success: true,
        message: "Đăng ký thành công",
        ...result,
      });
    } catch (error: any) {
      console.error("Register error:", error);

      // Nếu là lỗi kiểm tra
      if (error.message === "Email đã được sử dụng") {
        return res.status(409).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  },

  /**
   * Đăng nhập người dùng
   * @route POST /api/auth/login
   */
  login: async (req: Request, res: Response) => {
    try {
      // Kiểm tra lỗi từ validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      // Xử lý đăng nhập
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      // Trả về kết quả
      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        ...result,
      });
    } catch (error: any) {
      console.error("Login error:", error);

      // Nếu là lỗi xác thực
      if (error.message === "Email hoặc mật khẩu không chính xác") {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  },

  /**
   * Lấy thông tin người dùng hiện tại
   * @route GET /api/auth/me
   */
  getMe: async (req: Request, res: Response) => {
    try {
      // req.user đã được set bởi middleware authenticate
      const user = req.user;

      // Trả về thông tin người dùng
      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
        },
      });
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  },

  /**
   * Yêu cầu đặt lại mật khẩu
   * @route POST /api/auth/forgot-password
   */
  forgotPassword: async (req: Request, res: Response) => {
    try {
      // Kiểm tra lỗi từ validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email } = req.body;
      const result = await authService.forgotPassword({ email });

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  },

  /**
   * Đặt lại mật khẩu bằng token
   * @route POST /api/auth/reset-password
   */
  resetPassword: async (req: Request, res: Response) => {
    try {
      // Kiểm tra lỗi từ validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { token, password } = req.body;
      const result = await authService.resetPassword({ token, password });

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error("Reset password error:", error);

      if (error.message === "Token không hợp lệ hoặc đã hết hạn") {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  },

  /**
   * Đổi mật khẩu (khi đã đăng nhập)
   * @route PUT /api/auth/change-password
   */
  changePassword: async (req: Request, res: Response) => {
    try {
      // Kiểm tra lỗi từ validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { currentPassword, newPassword } = req.body;
      const userId = req.user._id;

      const result = await authService.changePassword({
        currentPassword,
        newPassword,
        userId,
      });

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      console.error("Change password error:", error);

      if (error.message === "Mật khẩu hiện tại không chính xác") {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  },

  /**
   * Cập nhật thông tin người dùng
   * @route PUT /api/auth/profile
   */
  updateProfile: async (req: Request, res: Response) => {
    try {
      // Kiểm tra lỗi từ validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { name, avatar, bio } = req.body;
      const userId = req.user._id;

      const result = await authService.updateProfile({
        name,
        avatar,
        bio,
        userId,
      });

      return res.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công",
        user: result.user,
      });
    } catch (error: any) {
      console.error("Update profile error:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server",
      });
    }
  },
};

export default authController;
