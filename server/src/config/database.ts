import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

// Lấy đường dẫn cơ sở và tên database từ URI
const getConnectionOptions = () => {
  try {
    const url = new URL(MONGODB_URI);
    // Lấy tên database từ pathname, bỏ dấu "/" đầu tiên
    const dbName = url.pathname.substring(1) || "eventhub";

    // Nếu không có tên database trong URI, mặc định sẽ là "eventhub"
    return {
      dbName: dbName || "eventhub",
    };
  } catch (error) {
    console.error("Failed to parse MongoDB URI:", error);
    return { dbName: "eventhub" };
  }
};

// Khai báo kiểu dữ liệu cho cached connection
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Khai báo namespace để mở rộng global
declare global {
  var mongoose: CachedConnection | undefined;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      ...getConnectionOptions(),
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log(`Connected to MongoDB database: ${opts.dbName}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
