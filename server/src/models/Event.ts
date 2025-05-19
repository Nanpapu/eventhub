import mongoose, { Document, Schema } from "mongoose";

// Interface cho TicketType
export interface ITicketType {
  name: string;
  description: string;
  price: number;
  quantity: number;
  startSaleDate: Date;
  endSaleDate: Date;
  soldQuantity: number;
}

// Interface cho Event document
export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  isOnline: boolean;
  onlineUrl?: string;
  imageUrl: string;
  category: string;
  isPaid: boolean;
  price?: number;
  capacity: number;
  maxTicketsPerPerson: number;
  ticketTypes: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    availableQuantity: number;
    startSaleDate?: Date;
    endSaleDate?: Date;
    description?: string;
  }[];
  tags: string[];
  organizer: mongoose.Types.ObjectId;
  attendees: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ticketTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  startSaleDate: {
    type: Date,
  },
  endSaleDate: {
    type: Date,
  },
  description: {
    type: String,
  },
});

// Schema cho Event
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
    },
    location: {
      type: String,
      required: function (this: IEvent) {
        return !this.isOnline;
      },
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
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      min: 0,
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: 1,
    },
    maxTicketsPerPerson: {
      type: Number,
      required: [true, "Max tickets per person is required"],
      min: 1,
      default: 10,
    },
    ticketTypes: [ticketTypeSchema],
    tags: [
      {
        type: String,
      },
    ],
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer is required"],
    },
    attendees: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Thêm virtual field để tính số vé còn lại
eventSchema.virtual("availableTickets").get(function (this: IEvent) {
  if (this.ticketTypes && this.ticketTypes.length > 0) {
    return this.ticketTypes.reduce(
      (sum, type) => sum + type.availableQuantity,
      0
    );
  }
  return Math.max(0, this.capacity - this.attendees);
});

// Đảm bảo virtuals được bao gồm khi convert to JSON
eventSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    // Xử lý cho document Event chính
    if (ret._id) {
      ret.id = ret._id.toString(); // Đảm bảo là string
      delete ret._id;
    }
    delete ret.__v;

    // Xử lý cho các sub-documents trong ticketTypes
    if (ret.ticketTypes && Array.isArray(ret.ticketTypes)) {
      ret.ticketTypes = ret.ticketTypes.map((ticketType: any) => {
        const newTicketType = { ...ticketType }; // Tạo bản sao để tránh thay đổi trực tiếp
        if (newTicketType._id) {
          newTicketType.id = newTicketType._id.toString(); // Đổi _id thành id và đảm bảo là string
          delete newTicketType._id;
        }
        // Bạn có thể xóa các trường không cần thiết khác của ticketType ở đây nếu muốn
        // delete newTicketType.__v; // Subdocuments không có __v trừ khi bạn tạo schema riêng cho chúng và không tắt nó
        return newTicketType;
      });
    }

    return ret;
  },
});

// Indexes
eventSchema.index({ title: "text", description: "text" });
eventSchema.index({ category: 1 });
eventSchema.index({ location: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ organizer: 1 });

// Tạo và export model
const Event = mongoose.model<IEvent>("Event", eventSchema);

export default Event;
