import mongoose from "mongoose";

// Interface cho Review document
export interface IReview extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// Định nghĩa schema
const ReviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Mỗi người dùng chỉ có thể đánh giá một sự kiện một lần
ReviewSchema.index({ userId: 1, eventId: 1 }, { unique: true });

// Tạo và export model
const Review = mongoose.model<IReview>("Review", ReviewSchema);
export default Review;
