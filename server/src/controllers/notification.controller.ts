import { Request, Response } from "express";
import mongoose from "mongoose";
import notificationService from "../services/notification.service";

class NotificationController {
  /**
   * Lấy danh sách thông báo của người dùng hiện tại
   */
  async getNotifications(req: Request, res: Response) {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const isReadQuery = req.query.isRead;
      let isRead: boolean | undefined = undefined;

      if (isReadQuery === "true") {
        isRead = true;
      } else if (isReadQuery === "false") {
        isRead = false;
      }

      const result = await notificationService.getNotifications(
        new mongoose.Types.ObjectId(userId),
        page,
        limit,
        isRead
      );
      res.status(200).json(result);
    } catch (error) {
      console.error(
        "[NotificationController] Error fetching notifications:",
        error
      );
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  }

  /**
   * Lấy số lượng thông báo chưa đọc của người dùng hiện tại
   */
  async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const count = await notificationService.getUnreadCount(
        new mongoose.Types.ObjectId(userId)
      );
      res.status(200).json({ count });
    } catch (error) {
      console.error(
        "[NotificationController] Error fetching unread count:",
        error
      );
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  }

  /**
   * Đánh dấu một thông báo là đã đọc
   */
  async markAsRead(req: Request, res: Response) {
    try {
      const userId = (req.user as any)?.id;
      const notificationId = req.params.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!notificationId) {
        return res.status(400).json({ message: "Notification ID is required" });
      }

      const notification = await notificationService.markNotificationAsRead(
        notificationId,
        new mongoose.Types.ObjectId(userId)
      );

      if (!notification) {
        return res
          .status(404)
          .json({ message: "Notification not found or access denied" });
      }
      res.status(200).json(notification);
    } catch (error) {
      console.error(
        "[NotificationController] Error marking notification as read:",
        error
      );
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  }

  /**
   * Đánh dấu tất cả thông báo của người dùng là đã đọc
   */
  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await notificationService.markAllNotificationsAsRead(
        new mongoose.Types.ObjectId(userId)
      );
      res.status(200).json(result);
    } catch (error) {
      console.error(
        "[NotificationController] Error marking all notifications as read:",
        error
      );
      res
        .status(500)
        .json({ message: "Failed to mark all notifications as read" });
    }
  }

  /**
   * Xóa một thông báo
   */
  async deleteNotification(req: Request, res: Response) {
    try {
      const userId = (req.user as any)?.id;
      const notificationId = req.params.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!notificationId) {
        return res.status(400).json({ message: "Notification ID is required" });
      }

      const notification = await notificationService.deleteNotification(
        notificationId,
        new mongoose.Types.ObjectId(userId)
      );

      if (!notification) {
        return res
          .status(404)
          .json({ message: "Notification not found or access denied" });
      }
      res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error(
        "[NotificationController] Error deleting notification:",
        error
      );
      res.status(500).json({ message: "Failed to delete notification" });
    }
  }
}

export default new NotificationController();
