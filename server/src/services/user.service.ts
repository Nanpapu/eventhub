import User from "../models/User";
import Event from "../models/Event";
import Ticket from "../models/Ticket";
import mongoose from "mongoose";

class UserService {
  /**
   * Lấy thống kê người dùng bao gồm:
   * - Số lượng sự kiện đã tạo
   * - Số lượng sự kiện đã lưu
   * - Số lượng vé đã mua
   *
   * @param userId - ID của người dùng
   * @returns Object chứa thống kê về các hoạt động của người dùng
   */
  async getUserStats(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("ID người dùng không hợp lệ");
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    try {
      // Đếm số lượng sự kiện đã tạo
      const createdEvents = await Event.countDocuments({
        organizer: userObjectId,
      });

      // Lấy thông tin người dùng và số sự kiện đã lưu
      const user = await User.findById(userObjectId).lean();
      const savedEvents = user?.savedEvents?.length || 0;

      // Đếm số lượng vé đã mua
      const tickets = await Ticket.countDocuments({
        userId: userObjectId,
      });

      return {
        createdEvents,
        savedEvents,
        tickets,
      };
    } catch (error) {
      console.error("[UserService] Error getting user stats:", error);
      throw new Error("Không thể lấy thống kê người dùng");
    }
  }
}

export default new UserService();
