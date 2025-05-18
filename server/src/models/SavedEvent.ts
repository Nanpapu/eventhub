import mongoose, { Document, Schema } from "mongoose";

// Interface cho SavedEvent document
export interface ISavedEvent extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Schema cho SavedEvent
const savedEventSchema = new Schema<ISavedEvent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
savedEventSchema.index({ user: 1, event: 1 }, { unique: true });

// Tạo và export model
const SavedEvent = mongoose.model<ISavedEvent>("SavedEvent", savedEventSchema);

export default SavedEvent;
