import mongoose from "mongoose";

// Interface cho Notification document
export interface INotification extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: "event_reminder" | "ticket_purchase" | "event_update" | "system";
  message: string;
  relatedId?: string; // Có thể là eventId, ticketId, v.v.
  isRead: boolean;
  createdAt: Date;
}

// Định nghĩa schema
const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    type: {
      type: String,
      enum: ["event_reminder", "ticket_purchase", "event_update", "system"],
      required: [true, "Notification type is required"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
    },
    relatedId: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo index để tìm kiếm thông báo nhanh hơn
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });

// Tạo và export model
const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
export default Notification;
