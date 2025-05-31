import { Request, Response } from "express";
import userService from "../services/user.service";
import User from "../models/User";

class UserController {
  /**
   * Lấy thống kê người dùng
   * @route GET /api/users/stats
   * @access Private
   */
  async getUserStats(req: Request, res: Response) {
    try {
      // Lấy ID người dùng từ middleware auth
      const userId = (req as any).user.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Không tìm thấy thông tin người dùng",
        });
      }

      // Gọi service để lấy thống kê
      const stats = await userService.getUserStats(userId);

      return res.status(200).json({
        success: true,
        stats,
      });
    } catch (error: any) {
      console.error("[UserController] Error getting user stats:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Lỗi khi lấy thống kê người dùng",
      });
    }
  }

  /**
   * Upload Avatar
   */
  async uploadAvatar(req: Request, res: Response) {
    try {
      // req.file có sẵn từ middleware multer
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // @ts-ignore - Cloudinary sẽ thêm path và filename vào req.file
      const avatarUrl = req.file.path;

      // Lấy ID người dùng từ token đã xác thực
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      // Cập nhật URL avatar trong database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatar: avatarUrl },
        { new: true, select: "-password" } // trả về user đã cập nhật và loại bỏ trường password
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Avatar uploaded successfully",
        data: {
          user: updatedUser,
        },
      });
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      return res.status(500).json({
        success: false,
        message: "Error uploading avatar",
        error: error.message,
      });
    }
  }
}

export default new UserController();
