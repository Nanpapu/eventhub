import express from "express";
import authController from "../controllers/auth.controller";
import {
  registerValidation,
  loginValidation,
} from "../validations/auth.validation";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

// Route đăng ký
router.post("/register", registerValidation, authController.register);

// Route đăng nhập
router.post("/login", loginValidation, authController.login);

// Route lấy thông tin người dùng hiện tại (cần xác thực)
router.get("/me", authenticate, authController.getMe);

export default router;
