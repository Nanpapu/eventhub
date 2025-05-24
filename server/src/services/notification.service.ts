import mongoose from "mongoose";
import Notification, { INotification } from "../models/Notification";
import { IEvent } from "../models/Event"; // Import IEvent nếu cần truy cập các trường của event
import { format } from "date-fns";

// Interface cho dữ liệu tùy chỉnh trong thông báo (mở rộng nếu cần cho các type khác)
interface NotificationCustomData {
  eventId?: string;
  eventTitle?: string;
  ticketId?: string;
  originalDate?: string;
  newDate?: string;
  updatedFields?: string[];
  eventTime?: string;
  eventDate?: string; // Thêm eventDate cho reminder
  reminderTypeSent?: "1day" | "3days" | "2hour"; // Thêm "2hour"
  cancellationReason?: string; // Thêm lý do hủy vé
  ticketInfo?: string; // Thêm thông tin vé bị hủy
  [key: string]: any;
}

class NotificationService {
  /**
   * Tạo thông báo xác nhận vé thành công cho người dùng.
   * @param userId - ID của người dùng đã mua vé.
   * @param event - Thông tin sự kiện.
   * @param ticketTypeName - Tên loại vé.
   * @param quantity - Số lượng vé.
   * @param transactionId - ID giao dịch.
   * @param ticketId - (Tùy chọn) ID của vé cụ thể nếu có.
   */
  async createTicketConfirmationNotification(
    userId: mongoose.Types.ObjectId,
    event: IEvent,
    ticketTypeName: string,
    quantity: number,
    transactionId: string,
    ticketId?: string
  ): Promise<INotification | null> {
    const title = `Xác nhận vé thành công cho sự kiện "${event.title}"!`;
    const message = `Cảm ơn bạn đã đăng ký tham gia sự kiện "${event.title}". Bạn đã mua thành công ${quantity} vé loại ${ticketTypeName}. Mã giao dịch của bạn là: ${transactionId}.`;
    const notificationDetails: Partial<INotification> = {
      user: userId,
      title,
      message,
      type: "ticket_confirmation",
      relatedEvent: event._id as mongoose.Types.ObjectId,
      isRead: false,
      data: {
        eventId: (event._id as mongoose.Types.ObjectId).toString(),
        eventTitle: event.title,
        ticketId: ticketId, // Lưu ID vé nếu có
        transactionId: transactionId,
        quantity: quantity,
        ticketTypeName: ticketTypeName,
      },
    };

    try {
      const newNotification = new Notification(notificationDetails);
      await newNotification.save();
      console.log(
        `[NotificationService] Ticket confirmation notification created for user: ${userId}`
      );
      return newNotification;
    } catch (error) {
      console.error(
        `[NotificationService] Error creating ticket confirmation notification for user ${userId}:`,
        error
      );
      return null;
    }
  }

  /**
   * Tạo thông báo khi cập nhật về sự kiện (ví dụ: thay đổi thời gian, địa điểm, hủy sự kiện).
   * @param affectedUserIds - Danh sách ID người dùng bị ảnh hưởng (ví dụ: đã đăng ký hoặc lưu sự kiện).
   * @param event - Thông tin sự kiện đã cập nhật.
   * @param updatedFieldsText - Mô tả các trường đã thay đổi (ví dụ: "thời gian và địa điểm", "sự kiện đã bị hủy").
   */
  async createEventUpdateNotifications(
    affectedUserIds: mongoose.Types.ObjectId[],
    event: IEvent,
    updatedFieldsText: string
  ): Promise<void> {
    if (!affectedUserIds || affectedUserIds.length === 0) {
      return;
    }

    const title = `Cập nhật quan trọng về sự kiện "${event.title}"`;
    const message = `Sự kiện "${event.title}" bạn quan tâm đã có cập nhật mới: ${updatedFieldsText}. Vui lòng kiểm tra chi tiết.`;
    const type = "event_update"; // Hoặc "event_cancelled" nếu sự kiện bị hủy hoàn toàn
    const data: NotificationCustomData = {
      eventId: (event._id as mongoose.Types.ObjectId).toString(),
      eventTitle: event.title,
      updatedFields: updatedFieldsText.split(", "), // Tách các trường nếu có nhiều
    };

    try {
      const notificationsToCreate = affectedUserIds.map((userId) => ({
        user: userId,
        title,
        message,
        type,
        relatedEvent: event._id as mongoose.Types.ObjectId,
        isRead: false,
        data,
      }));

      if (notificationsToCreate.length > 0) {
        await Notification.insertMany(notificationsToCreate);
        console.log(
          `Sent event update notifications for event ${event.title} to ${notificationsToCreate.length} users.`
        );
      }
    } catch (error) {
      console.error("Error creating bulk event update notifications:", error);
    }
  }

  /**
   * Gửi thông báo nhắc nhở sự kiện (chung).
   * @param affectedUserIds - Danh sách ID người dùng sẽ nhận thông báo.
   * @param event - Thông tin sự kiện.
   */
  async createEventReminderNotifications(
    affectedUserIds: mongoose.Types.ObjectId[],
    event: IEvent
  ): Promise<void> {
    // This function might be deprecated or refactored if sendEventReminderIfNeeded handles all cases.
    // For now, let's assume it's still used for general reminders, and specific timed reminders
    // are handled by sendEventReminderIfNeeded directly from the cron job.
    const title = `Nhắc nhở: Sự kiện "${event.title}" sắp diễn ra!`;
    const message = `Đừng quên sự kiện "${
      event.title
    }" sẽ diễn ra vào ngày ${format(new Date(event.date), "dd/MM/yyyy")} lúc ${
      event.startTime
    }. Chuẩn bị sẵn sàng nhé!`;
    const type = "event_reminder";
    const data: NotificationCustomData = {
      eventId: (event._id as mongoose.Types.ObjectId).toString(),
      eventTitle: event.title,
      eventDate: format(new Date(event.date), "dd/MM/yyyy"),
      eventTime: event.startTime,
    };

    try {
      const notificationsToCreate = affectedUserIds.map((userId) => ({
        user: userId,
        title,
        message,
        type,
        relatedEvent: event._id as mongoose.Types.ObjectId,
        isRead: false,
        data,
      }));

      if (notificationsToCreate.length > 0) {
        await Notification.insertMany(notificationsToCreate);
        console.log(
          `Sent general event reminders for event ${event.title} to ${notificationsToCreate.length} users.`
        );
      }
    } catch (error) {
      console.error("Error creating bulk event reminder notifications:", error);
    }
  }

  /**
   * Gửi thông báo nhắc nhở sự kiện nếu cần thiết.
   * Kiểm tra xem thông báo nhắc nhở với loại cụ thể (1day, 3days, 2hour) đã được gửi chưa.
   * @param userIds - Danh sách ID người dùng sẽ nhận thông báo.
   * @param event - Thông tin sự kiện.
   * @param reminderType - Loại nhắc nhở ("1day", "3days", "2hour").
   */
  async sendEventReminderIfNeeded(
    userIds: mongoose.Types.ObjectId[],
    event: IEvent,
    reminderType: "1day" | "3days" | "2hour"
  ): Promise<void> {
    if (!userIds || userIds.length === 0) {
      return;
    }

    let title = "";
    let message = "";
    const eventDateTime = new Date(event.date);
    const eventTime = event.startTime; // Assuming startTime is like "HH:mm"

    // Adjust date part of eventDateTime based on event.date (which is already a Date object from IEvent)
    // And time part from event.startTime
    const [hours, minutes] = event.startTime.split(":").map(Number);
    eventDateTime.setHours(hours, minutes, 0, 0);

    switch (reminderType) {
      case "1day":
        title = `Sự kiện "${event.title}" diễn ra vào ngày mai!`;
        message = `Đừng quên, sự kiện "${
          event.title
        }" sẽ bắt đầu vào lúc ${eventTime} ngày mai, ${format(
          eventDateTime,
          "dd/MM/yyyy"
        )}. Chuẩn bị sẵn sàng nhé!`;
        break;
      case "3days":
        title = `Còn 3 ngày nữa là đến sự kiện "${event.title}"!`;
        message = `Sự kiện "${
          event.title
        }" bạn quan tâm sẽ diễn ra sau 3 ngày nữa, vào lúc ${eventTime} ngày ${format(
          eventDateTime,
          "dd/MM/yyyy"
        )}. Đừng bỏ lỡ!`;
        break;
      case "2hour":
        title = `Sự kiện "${event.title}" sắp bắt đầu!`;
        message = `Chỉ còn khoảng 2 giờ nữa, sự kiện "${
          event.title
        }" sẽ bắt đầu lúc ${eventTime} hôm nay (${format(
          eventDateTime,
          "dd/MM/yyyy"
        )}). Đừng bỏ lỡ nhé!`;
        break;
      default:
        console.warn(`Unknown reminder type: ${reminderType}`);
        return;
    }

    const data: NotificationCustomData = {
      eventId: (event._id as mongoose.Types.ObjectId).toString(),
      eventTitle: event.title,
      eventDate: format(eventDateTime, "dd/MM/yyyy"),
      eventTime: eventTime,
      reminderTypeSent: reminderType,
    };

    const notificationsToCreate = [];

    for (const userId of userIds) {
      // Kiểm tra xem thông báo nhắc nhở loại này đã được gửi cho người dùng này chưa
      const existingNotification = await Notification.findOne({
        user: userId,
        relatedEvent: event._id as mongoose.Types.ObjectId,
        "data.reminderTypeSent": reminderType,
      });

      if (!existingNotification) {
        notificationsToCreate.push({
          user: userId,
          title,
          message,
          type: "event_reminder" as INotification["type"],
          relatedEvent: event._id as mongoose.Types.ObjectId,
          isRead: false,
          data,
        });
      }
    }

    if (notificationsToCreate.length > 0) {
      try {
        await Notification.insertMany(notificationsToCreate);
        console.log(
          `Sent ${reminderType} reminders for event ${event.title} to ${notificationsToCreate.length} users.`
        );
      } catch (error) {
        console.error(
          `Error creating bulk ${reminderType} event reminder notifications:`,
          error
        );
      }
    }
  }

  /**
   * Tạo thông báo khi vé hoặc đăng ký bị hủy bởi người tổ chức.
   * @param userId - ID của người dùng có vé bị hủy.
   * @param event - Thông tin sự kiện liên quan.
   * @param ticketInfo - Thông tin về vé/đăng ký đã bị hủy (ví dụ: loại vé, mã vé).
   * @param reason - (Tùy chọn) Lý do hủy từ người tổ chức.
   */
  async createTicketCancellationByOrganizerNotification(
    userId: mongoose.Types.ObjectId,
    event: IEvent,
    ticketInfo: string, // Ví dụ: "Vé VIP - Mã: ABC123" hoặc "Đăng ký tham gia"
    reason?: string
  ): Promise<INotification | null> {
    const title = `Vé của bạn cho sự kiện "${event.title}" đã bị hủy`;
    let message = `Rất tiếc, ${ticketInfo} của bạn cho sự kiện "${
      event.title
    }" (diễn ra vào ${format(new Date(event.date), "dd/MM/yyyy")} lúc ${
      event.startTime
    }) đã bị hủy bởi ban tổ chức.`;
    if (reason) {
      message += ` Lý do: ${reason}.`;
    }
    message += " Vui lòng liên hệ ban tổ chức để biết thêm chi tiết.";

    const notificationDetails: Partial<INotification> = {
      user: userId,
      title,
      message,
      type: "system_message" as INotification["type"],
      relatedEvent: event._id as mongoose.Types.ObjectId,
      isRead: false,
      data: {
        eventId: (event._id as mongoose.Types.ObjectId).toString(),
        eventTitle: event.title,
        cancellationReason: reason,
        ticketInfo,
      },
    };

    try {
      const newNotification = new Notification(notificationDetails);
      await newNotification.save();
      console.log(
        `[NotificationService] Ticket cancellation by organizer notification created for user: ${userId}, event: ${event.title}`
      );
      return newNotification;
    } catch (error) {
      console.error(
        `[NotificationService] Error creating ticket cancellation by organizer notification for user ${userId}:`,
        error
      );
      return null;
    }
  }

  /**
   * Lấy danh sách thông báo của người dùng, có phân trang
   * @param userId - ID của người dùng
   * @param page - Trang hiện tại
   * @param limit - Số lượng thông báo mỗi trang
   * @param isRead - Lọc theo trạng thái đã đọc (true, false, hoặc undefined để lấy tất cả)
   */
  async getNotifications(
    userId: mongoose.Types.ObjectId,
    page: number = 1,
    limit: number = 10,
    isRead?: boolean
  ): Promise<{
    notifications: INotification[];
    total: number;
    pages: number;
    currentPage: number;
  }> {
    const skip = (page - 1) * limit;
    const query: any = { user: userId };
    if (isRead !== undefined) {
      query.isRead = isRead;
    }

    try {
      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("relatedEvent", "title date") // Populate thêm thông tin sự kiện nếu cần
        .lean(); // Sử dụng lean() để trả về plain JS objects

      const totalNotifications = await Notification.countDocuments(query);
      const totalPages = Math.ceil(totalNotifications / limit);

      return {
        notifications: notifications.map((n) => ({
          ...n,
          id: n._id.toString(), // Đảm bảo có trường id
          timestamp: n.createdAt, // Sử dụng createdAt làm timestamp chính
        })),
        total: totalNotifications,
        pages: totalPages,
        currentPage: page,
      };
    } catch (error) {
      console.error(
        "[NotificationService] Error fetching notifications:",
        error
      );
      throw error;
    }
  }

  /**
   * Lấy số lượng thông báo chưa đọc
   * @param userId - ID của người dùng
   */
  async getUnreadCount(userId: mongoose.Types.ObjectId): Promise<number> {
    try {
      const count = await Notification.countDocuments({
        user: userId,
        isRead: false,
      });
      return count;
    } catch (error) {
      console.error(
        "[NotificationService] Error fetching unread notification count:",
        error
      );
      throw error;
    }
  }

  /**
   * Đánh dấu một thông báo là đã đọc
   * @param notificationId - ID của thông báo
   * @param userId - ID của người dùng (để đảm bảo đúng người sở hữu thông báo)
   */
  async markNotificationAsRead(
    notificationId: string,
    userId: mongoose.Types.ObjectId
  ): Promise<INotification | null> {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user: userId },
        { isRead: true },
        { new: true } // Trả về document đã được cập nhật
      ).lean();
      if (notification) {
        console.log(
          `[NotificationService] Notification ${notificationId} marked as read for user ${userId}`
        );
        return { ...notification, id: notification._id.toString() };
      }
      return null;
    } catch (error) {
      console.error(
        `[NotificationService] Error marking notification ${notificationId} as read:`,
        error
      );
      throw error;
    }
  }

  /**
   * Đánh dấu tất cả thông báo của người dùng là đã đọc
   * @param userId - ID của người dùng
   */
  async markAllNotificationsAsRead(
    userId: mongoose.Types.ObjectId
  ): Promise<{ modifiedCount: number }> {
    try {
      const result = await Notification.updateMany(
        { user: userId, isRead: false },
        { isRead: true }
      );
      console.log(
        `[NotificationService] Marked all unread notifications as read for user ${userId}. Count: ${result.modifiedCount}`
      );
      return { modifiedCount: result.modifiedCount };
    } catch (error) {
      console.error(
        `[NotificationService] Error marking all notifications as read for user ${userId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Xóa một thông báo
   * @param notificationId - ID của thông báo
   * @param userId - ID của người dùng (để đảm bảo đúng người sở hữu thông báo)
   */
  async deleteNotification(
    notificationId: string,
    userId: mongoose.Types.ObjectId
  ): Promise<INotification | null> {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        user: userId,
      }).lean();
      if (notification) {
        console.log(
          `[NotificationService] Notification ${notificationId} deleted for user ${userId}`
        );
        return { ...notification, id: notification._id.toString() };
      }
      return null;
    } catch (error) {
      console.error(
        `[NotificationService] Error deleting notification ${notificationId}:`,
        error
      );
      throw error;
    }
  }
}

export default new NotificationService();
