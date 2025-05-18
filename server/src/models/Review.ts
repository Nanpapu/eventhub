import mongoose, { Document, Schema } from "mongoose";

// Interface cho Review document
export interface IReview extends Document {
  event: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema cho Review
const reviewSchema = new Schema<IReview>(
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

// Indexes
reviewSchema.index({ event: 1, user: 1 }, { unique: true });
reviewSchema.index({ rating: 1 });

// Tạo và export model
const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;
