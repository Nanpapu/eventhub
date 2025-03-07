import mongoose from "mongoose";

// Interface cho TicketType
export interface ITicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  quantitySold: number;
}

// Interface cho Event document
export interface IEvent extends mongoose.Document {
  title: string;
  description: string;
  category: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  isOnline: boolean;
  onlineUrl?: string;
  capacity: number;
  isPaid: boolean;
  price?: number;
  ticketTypes: ITicketType[];
  image: string;
  tags: string[];
  organizer: mongoose.Types.ObjectId;
  attendees: mongoose.Types.ObjectId[];
  status: "draft" | "published" | "cancelled" | "completed";
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

// Ticket Type Schema (embedded in Event)
const TicketTypeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: [true, "Ticket name is required"],
    trim: true,
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
  quantitySold: {
    type: Number,
    default: 0,
    min: [0, "Quantity sold cannot be negative"],
  },
});

// Main Event Schema
const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    category: {
      type: String,
      required: [true, "Event category is required"],
      enum: [
        "workshop",
        "conference",
        "meetup",
        "networking",
        "music",
        "exhibition",
        "food",
        "sports",
        "tech",
        "education",
        "health",
        "art",
        "business",
        "other",
      ],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Event start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "Event end time is required"],
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
    },
    address: {
      type: String,
      required: function (this: IEvent) {
        return !this.isOnline;
      },
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    onlineUrl: {
      type: String,
      required: function (this: IEvent) {
        return this.isOnline;
      },
    },
    capacity: {
      type: Number,
      required: [true, "Event capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: function (this: IEvent) {
        return (
          this.isPaid && (!this.ticketTypes || this.ticketTypes.length === 0)
        );
      },
      min: [0, "Price cannot be negative"],
    },
    ticketTypes: {
      type: [TicketTypeSchema],
      default: [],
      validate: {
        validator: function (ticketTypes: ITicketType[]) {
          // Nếu là event có phí và không có price mặc định thì phải có ít nhất 1 loại vé
          const isPaid = this.get("isPaid");
          const hasDefaultPrice = this.get("price") !== undefined;
          return !isPaid || hasDefaultPrice || ticketTypes.length > 0;
        },
        message:
          "Paid events must have at least one ticket type or a default price",
      },
    },
    image: {
      type: String,
      required: [true, "Event image is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Event organizer is required"],
    },
    attendees: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo và export model
const Event = mongoose.model<IEvent>("Event", EventSchema);
export default Event;
