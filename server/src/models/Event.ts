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
  category: string;
  location: string;
  venue: string;
  startDate: Date;
  endDate: Date;
  bannerImage: string;
  ticketTypes: ITicketType[];
  organizer: mongoose.Types.ObjectId;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    bannerImage: {
      type: String,
      required: [true, "Banner image is required"],
    },
    ticketTypes: [
      {
        name: {
          type: String,
          required: [true, "Ticket type name is required"],
        },
        description: {
          type: String,
          required: [true, "Ticket type description is required"],
        },
        price: {
          type: Number,
          required: [true, "Ticket price is required"],
          min: [0, "Price cannot be negative"],
        },
        quantity: {
          type: Number,
          required: [true, "Ticket quantity is required"],
          min: [0, "Quantity cannot be negative"],
        },
        startSaleDate: {
          type: Date,
          required: [true, "Start sale date is required"],
        },
        endSaleDate: {
          type: Date,
          required: [true, "End sale date is required"],
        },
        soldQuantity: {
          type: Number,
          default: 0,
          min: [0, "Sold quantity cannot be negative"],
        },
      },
    ],
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer is required"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
eventSchema.index({ title: "text", description: "text" });
eventSchema.index({ category: 1 });
eventSchema.index({ location: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ organizer: 1 });

// Tạo và export model
const Event = mongoose.model<IEvent>("Event", eventSchema);

export default Event;
