import mongoose, { Document, Schema } from "mongoose";

// Interface cho Notification document
export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: "event" | "registration" | "payment" | "system";
  relatedEvent?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema cho Notification
const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["event", "registration", "payment", "system"],
      required: [true, "Type is required"],
    },
    relatedEvent: {
      type: Schema.Types.ObjectId,
      ref: "Event",
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

// Indexes
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });

// Tạo và export model
const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default Notification;
