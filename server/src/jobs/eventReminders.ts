import cron from "node-cron";
import mongoose from "mongoose";
import Event from "../models/Event";
import Registration from "../models/Registration";
import notificationService from "../services/notification.service";
import { IEvent } from "../models/Event"; // Import IEvent để sử dụng kiểu
import User from "../models/User"; // Import User model

// Khoảng thời gian để kiểm tra (ví dụ: chạy mỗi giờ)
const CRON_SCHEDULE = "0 */1 * * *"; // Chạy mỗi giờ, vào phút thứ 0
// const CRON_SCHEDULE = '*/2 * * * *'; // Chạy mỗi 2 phút để test

/**
 * Cron job để gửi thông báo nhắc nhở cho các sự kiện sắp diễn ra.
 */
const scheduleEventReminders = () => {
  console.log(
    `[CronJob] Event reminder job scheduled with pattern: ${CRON_SCHEDULE}`
  );

  cron.schedule(CRON_SCHEDULE, async () => {
    console.log(
      "[CronJob] Running event reminder job at",
      new Date().toISOString()
    );
    try {
      const now = new Date();

      // --- Xử lý nhắc nhở 1 ngày ---
      const oneDayLaterStart = new Date(now);
      const oneDayLaterEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // --- Xử lý nhắc nhở 3 ngày ---
      // Bắt đầu từ sau 24h (để không trùng với nhắc nhở 1 ngày) đến hết 72h (3 ngày)
      const threeDaysLaterStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const threeDaysLaterEnd = new Date(now.getTime() + 72 * 60 * 60 * 1000);

      const processRemindersForPeriod = async (
        periodStart: Date,
        periodEnd: Date,
        reminderType: "1day" | "3days"
      ) => {
        const eventsInPeriod = (await Event.find({
          published: true,
          date: { $gte: periodStart, $lt: periodEnd }, // Sử dụng $lt cho periodEnd để không bị chồng chéo khi job chạy sát giờ
        }).lean()) as IEvent[];

        if (eventsInPeriod.length === 0) {
          console.log(
            `[CronJob] No upcoming events found for ${reminderType} reminders.`
          );
          return;
        }

        console.log(
          `[CronJob] Found ${eventsInPeriod.length} upcoming events to process for ${reminderType} reminders.`
        );

        for (const event of eventsInPeriod) {
          const registeredUserIds = (
            await Registration.find({ event: event._id })
              .select("user -_id")
              .lean()
          ).map((reg) => reg.user as mongoose.Types.ObjectId);

          const savedUserObjects = await User.find({
            savedEvents: event._id,
          })
            .select("_id")
            .lean();
          const savedUserIds = savedUserObjects.map((user) => user._id);

          const allUserIdsToNotify = Array.from(
            new Set(
              [...registeredUserIds, ...savedUserIds].map((id) => id.toString())
            )
          ).map((idStr) => new mongoose.Types.ObjectId(idStr));

          if (allUserIdsToNotify.length > 0) {
            console.log(
              `[CronJob] Sending ${reminderType} reminders for event \"${event.title}\" to ${allUserIdsToNotify.length} users.`
            );
            // Gọi service để gửi thông báo, service sẽ kiểm tra logic có nên gửi hay không
            notificationService
              .sendEventReminderIfNeeded(
                allUserIdsToNotify,
                event,
                reminderType
              )
              .catch((err) =>
                console.error(
                  `[CronJob] Error triggering ${reminderType} reminder for event ${event._id}:`,
                  err
                )
              );
          } else {
            console.log(
              `[CronJob] No relevant users found for event \"${event.title}\" to send ${reminderType} reminders.`
            );
          }
        }
      };

      // Xử lý cho cả hai loại nhắc nhở
      await processRemindersForPeriod(oneDayLaterStart, oneDayLaterEnd, "1day");
      await processRemindersForPeriod(
        threeDaysLaterStart,
        threeDaysLaterEnd,
        "3days"
      );
    } catch (error) {
      console.error("[CronJob] Error running event reminder job:", error);
    }
  });
};

export default scheduleEventReminders;
