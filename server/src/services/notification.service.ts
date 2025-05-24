import mongoose from "mongoose";
import Notification, { INotification } from "../models/Notification";
import { IEvent } from "../models/Event"; // Import IEvent nếu cần truy cập các trường của event

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
  [key: string]: any;
}

class NotificationService {
  /**
   * Tạo thông báo xác nhận mua vé
   */
  async createTicketConfirmationNotification(
    userId: mongoose.Types.ObjectId,
    event: IEvent,
    ticketTypeName: string,
    quantity: number,
    transactionId: string,
    ticketId?: string
  ): Promise<INotification | null> {
    try {
      const notificationDetails: Partial<INotification> = {
        user: userId,
        title: `Mua vé thành công: ${event.title}`,
        message: `Bạn đã mua thành công ${quantity} vé ${ticketTypeName} cho sự kiện ${event.title}. Mã giao dịch: ${transactionId}.`,
        type: "ticket_confirmation",
        relatedEvent: event._id as any as mongoose.Types.ObjectId,
        isRead: false,
        data: {
          eventId: (event._id as any).toString(),
          eventTitle: event.title,
          ticketId: ticketId,
        } as NotificationCustomData,
      };
      const newNotification = new Notification(notificationDetails);
      await newNotification.save();
      console.log(
        "[NotificationService] Ticket confirmation notification created for user:",
        userId
      );
      return newNotification;
    } catch (error) {
      console.error(
        "[NotificationService] Error creating ticket confirmation notification:",
        error
      );
      return null;
    }
  }

  /**
   * Tạo thông báo khi thông tin sự kiện được cập nhật
   * @param affectedUserIds - Mảng ID của người dùng bị ảnh hưởng (ví dụ: đã đăng ký sự kiện)
   * @param event - Thông tin sự kiện đã cập nhật
   * @param updatedFieldsText - Mô tả những gì đã thay đổi (ví dụ: "thời gian và địa điểm")
   */
  async createEventUpdateNotifications(
    affectedUserIds: mongoose.Types.ObjectId[],
    event: IEvent,
    updatedFieldsText: string
  ): Promise<void> {
    if (new Date(event.date) < new Date()) {
      console.log(
        `[NotificationService] Event ${event.title} has already passed. No update notifications sent.`
      );
      return;
    }

    const notificationsPromises = affectedUserIds.map((userId) => {
      const notificationDetails: Partial<INotification> = {
        user: userId,
        title: `Cập nhật sự kiện: ${event.title}`,
        message: `Thông tin sự kiện "${event.title}" bạn quan tâm đã được cập nhật: ${updatedFieldsText}. Vui lòng kiểm tra chi tiết.`,
        type: "event_update",
        relatedEvent: event._id as any as mongoose.Types.ObjectId,
        isRead: false,
        data: {
          eventId: (event._id as any).toString(),
          eventTitle: event.title,
          updatedFields: updatedFieldsText.split(", "), // Giả sử updatedFieldsText là "field1, field2"
        } as NotificationCustomData,
      };
      const newNotification = new Notification(notificationDetails);
      return newNotification
        .save()
        .then(() =>
          console.log(
            "[NotificationService] Event update notification created for user:",
            userId
          )
        )
        .catch((error) =>
          console.error(
            `[NotificationService] Error creating event update notification for user ${userId}:`,
            error
          )
        );
    });
    await Promise.all(notificationsPromises);
  }

  /**
   * Tạo thông báo nhắc nhở sự kiện sắp diễn ra
   * @param affectedUserIds - Mảng ID của người dùng bị ảnh hưởng
   * @param event - Thông tin sự kiện
   */
  async createEventReminderNotifications(
    affectedUserIds: mongoose.Types.ObjectId[],
    event: IEvent
  ): Promise<void> {
    if (new Date(event.date) < new Date()) {
      console.log(
        `[NotificationService] Event ${event.title} has already passed. No reminder notifications sent.`
      );
      return;
    }
    const eventDateFormatted = new Date(event.date).toLocaleDateString(
      "vi-VN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

    const notificationsPromises = affectedUserIds.map((userId) => {
      const notificationDetails: Partial<INotification> = {
        user: userId,
        title: `Nhắc nhở: ${event.title} sắp diễn ra!`,
        message: `Đừng quên! Sự kiện "${event.title}" sẽ bắt đầu vào lúc ${event.startTime}, ngày ${eventDateFormatted}.`,
        type: "event_reminder",
        relatedEvent: event._id as any as mongoose.Types.ObjectId,
        isRead: false,
        data: {
          eventId: (event._id as any).toString(),
          eventTitle: event.title,
          eventTime: event.startTime,
          eventDate: event.date.toString(), // Giữ dạng ISO string hoặc timestamp cho xử lý logic nếu cần
        } as NotificationCustomData,
      };
      const newNotification = new Notification(notificationDetails);
      return newNotification
        .save()
        .then(() =>
          console.log(
            "[NotificationService] Event reminder notification created for user:",
            userId
          )
        )
        .catch((error) =>
          console.error(
            `[NotificationService] Error creating event reminder notification for user ${userId}:`,
            error
          )
        );
    });
    await Promise.all(notificationsPromises);
  }

  /**
   * Gửi thông báo nhắc nhở nếu cần thiết (kiểm tra tránh gửi trùng lặp).
   * @param userIds - Danh sách ID người dùng cần thông báo.
   * @param event - Thông tin sự kiện.
   * @param reminderType - Loại nhắc nhở ('1day' hoặc '3days').
   */
  async sendEventReminderIfNeeded(
    userIds: mongoose.Types.ObjectId[],
    event: IEvent,
    reminderType: "1day" | "3days"
  ): Promise<void> {
    if (new Date(event.date) < new Date()) {
      console.log(
        `[NotificationService] Event ${event.title} has already passed. No ${reminderType} reminder notifications sent.`
      );
      return;
    }

    const now = new Date();
    let checkWindowHours = 0;

    if (reminderType === "1day") {
      // Cho phép gửi nếu chưa có nhắc nhở "1day" trong 23 giờ qua
      checkWindowHours = 23;
    } else if (reminderType === "3days") {
      // Cho phép gửi nếu chưa có nhắc nhở "3days" trong 71 giờ qua (3 ngày - 1 giờ)
      checkWindowHours = 71;
    }

    const recentlySentUserIds = new Set<string>();

    if (checkWindowHours > 0) {
      const checkSince = new Date(
        now.getTime() - checkWindowHours * 60 * 60 * 1000
      );
      // Tìm các thông báo nhắc nhở đã gửi gần đây cho sự kiện này
      const recentReminders = await Notification.find({
        relatedEvent: event._id,
        type: "event_reminder",
        user: { $in: userIds },
        createdAt: { $gte: checkSince },
        // Thêm một cách để lọc rõ hơn loại reminder nếu cần, ví dụ qua data object
        // 'data.reminderType': reminderType
      }).select("user data"); // Chỉ lấy user và data để kiểm tra

      recentReminders.forEach((reminder) => {
        // Kiểm tra xem 'data' có tồn tại và có 'reminderTypeSent' không
        if (reminder.data && reminder.data.reminderTypeSent === reminderType) {
          recentlySentUserIds.add(reminder.user.toString());
        }
      });
    }

    const userIdsToSend = userIds.filter(
      (id) => !recentlySentUserIds.has(id.toString())
    );

    if (userIdsToSend.length > 0) {
      console.log(
        `[NotificationService] Preparing to send ${reminderType} reminders for event '${event.title}' to ${userIdsToSend.length} users.`
      );
      // Tạo thông báo, thêm reminderType vào data để có thể kiểm tra sau này
      const eventDateFormatted = new Date(event.date).toLocaleDateString(
        "vi-VN",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );

      const notificationsPromises = userIdsToSend.map((userId) => {
        const notificationDetails: Partial<INotification> = {
          user: userId,
          title: `Nhắc nhở: ${event.title} sắp diễn ra!`,
          message: `Đừng quên! Sự kiện \"${event.title}\" sẽ bắt đầu vào lúc ${
            event.startTime
          }, ngày ${eventDateFormatted}. (${
            reminderType === "1day" ? "Ngày mai" : "Trong 3 ngày tới"
          })`,
          type: "event_reminder",
          relatedEvent: event._id as any as mongoose.Types.ObjectId,
          isRead: false,
          data: {
            eventId: (event._id as any).toString(),
            eventTitle: event.title,
            eventTime: event.startTime,
            eventDate: event.date.toString(),
            reminderTypeSent: reminderType, // Lưu loại nhắc nhở đã gửi
          } as NotificationCustomData,
        };
        const newNotification = new Notification(notificationDetails);
        return newNotification
          .save()
          .then(() =>
            console.log(
              `[NotificationService] ${reminderType} reminder for event ${event.title} created for user: ${userId}`
            )
          )
          .catch((error) =>
            console.error(
              `[NotificationService] Error creating ${reminderType} reminder for user ${userId} & event ${event.title}:`,
              error
            )
          );
      });
      await Promise.all(notificationsPromises);
    } else {
      console.log(
        `[NotificationService] No new users to send ${reminderType} reminders for event '${event.title}'. All relevant users already reminded recently.`
      );
    }
  }

  /**
   * Lấy danh sách thông báo cho người dùng, hỗ trợ phân trang
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
    try {
      const queryOptions: any = { user: userId };
      if (isRead !== undefined) {
        queryOptions.isRead = isRead;
      }

      const skip = (page - 1) * limit;
      const totalNotifications = await Notification.countDocuments(
        queryOptions
      );
      const notifications = await Notification.find(queryOptions)
        .sort({ createdAt: -1 }) // Sắp xếp mới nhất lên đầu
        .skip(skip)
        .limit(limit)
        .populate("relatedEvent", "title date startTime imageUrl") // Lấy thêm một vài thông tin sự kiện nếu cần
        .exec();

      return {
        notifications,
        total: totalNotifications,
        pages: Math.ceil(totalNotifications / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error(
        "[NotificationService] Error fetching notifications:",
        error
      );
      throw error; // Re-throw lỗi để controller có thể xử lý
    }
  }

  /**
   * Lấy số lượng thông báo chưa đọc cho người dùng
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
      );
      return notification;
    } catch (error) {
      console.error(
        "[NotificationService] Error marking notification as read:",
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
      return { modifiedCount: result.modifiedCount };
    } catch (error) {
      console.error(
        "[NotificationService] Error marking all notifications as read:",
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
      });
      return notification; // Trả về thông báo đã xóa, hoặc null nếu không tìm thấy/không được phép
    } catch (error) {
      console.error(
        "[NotificationService] Error deleting notification:",
        error
      );
      throw error;
    }
  }
}

export default new NotificationService();
