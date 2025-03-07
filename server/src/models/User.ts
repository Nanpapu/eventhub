import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Định nghĩa interface cho User document
export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: "user" | "organizer" | "admin";
  savedEvents: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Định nghĩa schema
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "organizer", "admin"],
      default: "user",
    },
    savedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Middleware để hash password trước khi lưu
UserSchema.pre("save", async function (next) {
  // Chỉ hash password nếu nó được sửa đổi hoặc mới
  if (!this.isModified("password")) return next();

  try {
    // Tạo salt với 10 rounds
    const salt = await bcrypt.genSalt(10);
    // Hash password với salt đã tạo
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method để so sánh password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    // So sánh candidatePassword với password đã hash trong database
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Tạo và export model
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
