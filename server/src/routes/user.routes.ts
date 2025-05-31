import express from "express";
import userController from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import asyncHandler from "express-async-handler";
import { avatarUpload } from "../config/cloudinary";

const router = express.Router();

/**
 * @route   GET /api/users/stats
 * @desc    Lấy thống kê người dùng (số sự kiện đã tạo, số sự kiện đã lưu, số vé đã mua)
 * @access  Private
 */
router.get("/stats", authenticate, asyncHandler(userController.getUserStats));

// Upload avatar
router.post(
  "/avatar",
  authenticate,
  avatarUpload.single("avatar"),
  userController.uploadAvatar
);

// Có thể thêm các routes khác liên quan đến người dùng ở đây
// ví dụ: GET /api/users/profile - Lấy thông tin profile

export default router;
