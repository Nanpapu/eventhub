// server/src/models/PasswordReset.ts
import mongoose, { Document, Schema } from "mongoose";

// Interface cho Password Reset document
export interface IPasswordReset extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expires: Date;
  used: boolean;
  createdAt: Date;
}

// Schema cho Password Reset
const passwordResetSchema = new Schema<IPasswordReset>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index cho tìm kiếm token nhanh hơn
passwordResetSchema.index({ token: 1 });
passwordResetSchema.index({ userId: 1 });
passwordResetSchema.index({ expires: 1 });

const PasswordReset = mongoose.model<IPasswordReset>(
  "PasswordReset",
  passwordResetSchema
);

export default PasswordReset;
