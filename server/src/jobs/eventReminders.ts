import cron from "node-cron";
import mongoose from "mongoose";
import Event, { IEvent } from "../models/Event";
import Registration from "../models/Registration";
import notificationService from "../services/notification.service";
import User from "../models/User"; // Import User model

/**
 * Cron job để tự động gửi thông báo nhắc nhở sự kiện.
 * Chạy mỗi giờ để kiểm tra các sự kiện sắp diễn ra.
 */
const scheduleEventReminders = () => {
  // Chạy mỗi giờ (vào phút thứ 0 của mỗi giờ)
  cron.schedule("0 * * * *", async () => {
    console.log("[CronJob] Running event reminder job at", new Date());
    const now = new Date();

    // Định nghĩa các khoảng thời gian nhắc nhở
    const reminderPeriods = [
      { hours: 24, type: "1day" as const }, // 1 ngày trước
      { hours: 72, type: "3days" as const }, // 3 ngày trước
      { hours: 2, type: "2hour" as const }, // 2 giờ trước
    ];

    for (const period of reminderPeriods) {
      const periodStart = new Date(
        now.getTime() + period.hours * 60 * 60 * 1000
      );
      // Tạo một khoảng thời gian nhỏ (ví dụ: 1 giờ) để bắt các sự kiện trong khung giờ đó
      const periodEnd = new Date(periodStart.getTime() + 1 * 60 * 60 * 1000);

      await processRemindersForPeriod(periodStart, periodEnd, period.type);
    }
  });

  // Hàm xử lý logic gửi nhắc nhở cho một khoảng thời gian cụ thể
  const processRemindersForPeriod = async (
    periodStart: Date,
    periodEnd: Date,
    reminderType: "1day" | "3days" | "2hour"
  ) => {
    try {
      // Tìm các sự kiện sắp diễn ra trong khoảng thời gian này
      // Kết hợp điều kiện ngày và giờ bắt đầu (startTime)
      const eventsToRemind = await Event.find({
        date: {
          $gte: new Date(periodStart.setHours(0, 0, 0, 0)), // Bắt đầu từ 00:00 của ngày periodStart
          $lte: new Date(periodEnd.setHours(23, 59, 59, 999)), // Kết thúc vào 23:59 của ngày periodEnd
        },
        published: true, // Chỉ nhắc các sự kiện đã publish
        // Thêm điều kiện kiểm tra startTime nếu cần chính xác hơn trong khoảng giờ
        // Ví dụ: event.startTime >= format(periodStart, 'HH:mm') và event.startTime < format(periodEnd, 'HH:mm')
        // Cần chuyển đổi startTime (string) và so sánh, có thể phức tạp.
        // Hiện tại, chúng ta dựa vào việc cron job chạy hàng giờ và khoảng periodStart/End để bắt sự kiện.
      }).populate("organizer", "name email"); // Populate thông tin người tổ chức nếu cần

      if (eventsToRemind.length > 0) {
        console.log(
          `[CronJob] Found ${
            eventsToRemind.length
          } events for ${reminderType} reminder between ${periodStart.toISOString()} and ${periodEnd.toISOString()}`
        );
      }

      for (const event of eventsToRemind) {
        // Ghép ngày sự kiện và thời gian bắt đầu để tạo đối tượng Date hoàn chỉnh
        const [eventHour, eventMinute] = event.startTime.split(":").map(Number);
        const eventDateTime = new Date(event.date);
        eventDateTime.setHours(eventHour, eventMinute, 0, 0);

        // Kiểm tra chính xác thời gian sự kiện có nằm trong khoảng nhắc nhở không
        if (eventDateTime >= periodStart && eventDateTime < periodEnd) {
          // Lấy danh sách người dùng đã đăng ký hoặc lưu sự kiện này (ví dụ)
          // Đây là phần phức tạp cần logic nghiệp vụ cụ thể:
          // 1. Ai sẽ nhận được thông báo? Người đã mua vé? Người đã lưu sự kiện?
          // Giả sử chúng ta có 1 trường `registrations` hoặc `savedByUsers` trong Event model
          // Hoặc chúng ta query từ Registration model / User model

          // Ví dụ: Lấy tất cả người dùng (để demo - trong thực tế cần lọc cụ thể)
          const usersToNotify = await User.find({
            // Thêm điều kiện lọc người dùng ở đây, ví dụ:
            // _id: { $in: event.registeredUsers } // Nếu có trường này
            // Hoặc những người đã lưu sự kiện này
            savedEvents: event._id as any as mongoose.Types.ObjectId,
          }).select("_id");

          const userObjectIds = usersToNotify.map((user) => user._id);

          if (userObjectIds.length > 0) {
            await notificationService.sendEventReminderIfNeeded(
              userObjectIds,
              event,
              reminderType
            );
          } else {
            console.log(
              `[CronJob] No users found to remind for event ${event.title} (${reminderType})`
            );
          }
        } else {
          // Debugging log if an event was fetched but did not fall into the exact time window
          // This might happen due to the broader date query and the more precise time check here.
          console.log(
            `[CronJob] Event ${
              event.title
            } (Date: ${event.date.toISOString()}, StartTime: ${
              event.startTime
            }) was fetched but does not match the exact ${reminderType} window: ${periodStart.toISOString()} - ${periodEnd.toISOString()}. EventDateTime: ${eventDateTime.toISOString()}`
          );
        }
      }
    } catch (error) {
      console.error(
        `[CronJob] Error processing ${reminderType} reminders: `,
        error
      );
    }
  };
};

export default scheduleEventReminders;
