import express from "express";
import notificationController from "../controllers/notification.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

// Lấy danh sách thông báo (có phân trang và lọc theo isRead)
// GET /api/notifications?page=1&limit=10&isRead=false
router.get(
  "/",
  authenticate, // Yêu cầu đăng nhập
  notificationController.getNotifications
);

// Lấy số lượng thông báo chưa đọc
// GET /api/notifications/unread-count
router.get(
  "/unread-count",
  authenticate, // Yêu cầu đăng nhập
  notificationController.getUnreadCount
);

// Đánh dấu một thông báo là đã đọc
// POST /api/notifications/:id/read
router.post(
  "/:id/read",
  authenticate, // Yêu cầu đăng nhập
  notificationController.markAsRead
);

// Đánh dấu tất cả thông báo là đã đọc
// POST /api/notifications/mark-all-read
router.post(
  "/mark-all-read",
  authenticate, // Yêu cầu đăng nhập
  notificationController.markAllAsRead
);

// Xóa một thông báo
// DELETE /api/notifications/:id
router.delete(
  "/:id",
  authenticate, // Yêu cầu đăng nhập
  notificationController.deleteNotification
);

export default router;
