import mongoose from "mongoose";

// Interface cho Payment document
export interface IPayment extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  registrationId?: mongoose.Types.ObjectId;
  amount: number;
  method: "credit_card" | "paypal" | "bank_transfer" | "DEMO_PURCHASE";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Định nghĩa schema
const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    method: {
      type: String,
      enum: ["credit_card", "paypal", "bank_transfer", "DEMO_PURCHASE"],
      required: [true, "Payment method is required"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo và export model
const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
export default Payment;
