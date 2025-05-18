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
      const { email, password, firstName, lastName } = req.body;
      const result = await authService.register({
        email,
        password,
        firstName,
        lastName,
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
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
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
};

export default authController;
