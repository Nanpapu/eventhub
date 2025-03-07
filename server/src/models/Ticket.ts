import mongoose from "mongoose";

// Interface cho Ticket document
export interface ITicket extends mongoose.Document {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  ticketTypeId: string;
  ticketTypeName: string;
  price: number;
  quantity: number;
  status: "reserved" | "paid" | "cancelled" | "used";
  paymentId?: mongoose.Types.ObjectId;
  purchaseDate: Date;
  checkInDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Định nghĩa schema
const TicketSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    ticketTypeId: {
      type: String,
      required: [true, "Ticket type ID is required"],
    },
    ticketTypeName: {
      type: String,
      required: [true, "Ticket type name is required"],
    },
    price: {
      type: Number,
      required: [true, "Ticket price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Ticket quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    status: {
      type: String,
      enum: ["reserved", "paid", "cancelled", "used"],
      default: "reserved",
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    checkInDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo và export model
const Ticket = mongoose.model<ITicket>("Ticket", TicketSchema);
export default Ticket;
