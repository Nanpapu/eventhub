import mongoose, { Document, Schema, Types } from "mongoose";

// Interface cho TicketType SAU KHI toJSON transform (dùng cho client)
export interface ITicketTypeTransformed {
  id: string; // virtual 'id'
  name: string;
  description?: string;
  price: number;
  quantity: number; // Tổng số lượng ban đầu
  availableQuantity: number; // Số lượng còn lại
  startSaleDate?: Date;
  endSaleDate?: Date;
}

// Interface cho TicketType subdocument TRƯỚC KHI toJSON transform (dùng trong server logic, có _id)
// Nó cũng nên bao gồm các phương thức của mongoose.Types.Subdocument nếu bạn cần dùng
export interface ITicketTypeSubdocument extends Types.Subdocument {
  // Quan trọng: kế thừa Types.Subdocument
  _id: Types.ObjectId; // Thêm _id ở đây
  name: string;
  description?: string;
  price: number;
  quantity: number;
  availableQuantity: number;
  startSaleDate?: Date;
  endSaleDate?: Date;
  // Không cần 'id' ở đây vì nó là subdocument Mongoose
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
  ticketTypes: ITicketTypeSubdocument[]; // Sử dụng ITicketTypeSubdocument ở đây
  tags: string[];
  organizer: mongoose.Types.ObjectId;
  attendees: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ticketTypeSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    auto: true,
  },
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
      default: 3,
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

// Thêm Mongoose Hooks để theo dõi việc lưu Event
eventSchema.pre("save", function (this: IEvent, next) {
  // \`this\` ở đây là document Event sắp được lưu
  console.log(
    `[EventModel PRE-SAVE hook] Event "${this.title}" (ID: ${this._id}) is about to be saved.`
  );

  // Kiểm tra xem trường ticketTypes có bị thay đổi không
  if (this.isModified("ticketTypes")) {
    console.log(
      '[EventModel PRE-SAVE hook] The "ticketTypes" field was modified.'
    );
    console.log(
      "[EventModel PRE-SAVE hook] Current ticketTypes before save:",
      JSON.stringify(this.ticketTypes, null, 2)
    );
  } else {
    console.log(
      '[EventModel PRE-SAVE hook] The "ticketTypes" field was NOT modified.'
    );
  }
  next();
});

eventSchema.post("save", function (doc: IEvent, next) {
  // \`doc\` ở đây là document Event vừa được lưu
  console.log(
    `[EventModel POST-SAVE hook] Event "${doc.title}" (ID: ${doc._id}) was successfully saved.`
  );
  console.log(
    "[EventModel POST-SAVE hook] Saved ticketTypes:",
    JSON.stringify(doc.ticketTypes, null, 2)
  );
  next();
});

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
      ret.ticketTypes = ret.ticketTypes.map((ticketTypeSubDoc: any) => {
        // Sử dụng .toObject() nếu là Mongoose subdocument instance để lấy plain object
        // Nếu không, spread operator có thể hoạt động với plain object đã được Mongoose chuẩn bị cho 'ret'
        const plainSubDoc =
          ticketTypeSubDoc && typeof ticketTypeSubDoc.toObject === "function"
            ? ticketTypeSubDoc.toObject()
            : { ...ticketTypeSubDoc };

        if (plainSubDoc && plainSubDoc._id) {
          // Kiểm tra plainSubDoc và plainSubDoc._id có tồn tại không
          plainSubDoc.id = plainSubDoc._id.toString();
          delete plainSubDoc._id;
        }
        // Không cần xóa __v cho subdocuments trừ khi schema của subdocument có versionKey riêng
        return plainSubDoc as ITicketTypeTransformed;
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
