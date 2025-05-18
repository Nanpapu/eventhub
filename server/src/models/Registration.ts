import mongoose, { Document, Schema } from "mongoose";

// Interface cho AttendeeInfo
export interface IAttendeeInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

// Interface cho Registration document
export interface IRegistration extends Document {
  event: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  ticketType: mongoose.Types.ObjectId;
  quantity: number;
  totalAmount: number;
  attendeeInfo: IAttendeeInfo[];
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  paymentMethod?: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema cho Registration
const registrationSchema = new Schema<IRegistration>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    ticketType: {
      type: Schema.Types.ObjectId,
      required: [true, "Ticket type is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    attendeeInfo: [
      {
        firstName: {
          type: String,
          required: [true, "First name is required"],
          trim: true,
        },
        lastName: {
          type: String,
          required: [true, "Last name is required"],
          trim: true,
        },
        email: {
          type: String,
          required: [true, "Email is required"],
          trim: true,
          lowercase: true,
        },
        phone: {
          type: String,
          trim: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
    },
    paymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
registrationSchema.index({ event: 1, user: 1 });
registrationSchema.index({ status: 1 });
registrationSchema.index({ paymentStatus: 1 });

// Tạo và export model
const Registration = mongoose.model<IRegistration>(
  "Registration",
  registrationSchema
);

export default Registration;
