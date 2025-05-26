import { Request, Response } from "express";
import userService from "../services/user.service";

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
}

export default new UserController();
