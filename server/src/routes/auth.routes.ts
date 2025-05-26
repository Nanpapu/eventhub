import express, { Router } from "express";
import authController from "../controllers/auth.controller";
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  updateProfileValidation,
} from "../validations/auth.validation";
import { authenticate } from "../middlewares/auth.middleware";
import config from "../config";
import emailService from "../services/email.service";

const router: Router = express.Router();

// Route đăng ký
router.post("/register", registerValidation, authController.register);

// Route đăng nhập
router.post("/login", loginValidation, authController.login);

// Route lấy thông tin người dùng hiện tại (cần xác thực)
router.get("/me", authenticate, authController.getMe);

// Route quên mật khẩu
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  authController.forgotPassword
);

// Route đặt lại mật khẩu
router.post(
  "/reset-password",
  resetPasswordValidation,
  authController.resetPassword
);

// Route đổi mật khẩu (cần xác thực)
router.put(
  "/change-password",
  authenticate,
  changePasswordValidation,
  authController.changePassword
);

// Route cập nhật thông tin người dùng (cần xác thực)
router.put(
  "/profile",
  authenticate,
  updateProfileValidation,
  authController.updateProfile
);

// Route test chức năng gửi email quên mật khẩu (chỉ có trong môi trường development)
if (config.nodeEnv === "development") {
  router.post("/test-forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email là bắt buộc",
        });
      }

      const testToken = "test-reset-token-" + Date.now();

      const result = await emailService.sendPasswordResetEmail(
        email,
        testToken
      );

      res.status(200).json({
        success: true,
        message: "Email test đã được gửi",
        previewURL: result.previewURL,
        testToken, // Chỉ trả về trong môi trường development
      });
    } catch (error) {
      console.error("Lỗi gửi email test:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi gửi email test",
        error: error.message,
        stack: config.nodeEnv === "development" ? error.stack : undefined,
      });
    }
  });
}

export default router;
