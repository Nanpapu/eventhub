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

export default router;
