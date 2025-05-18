import mongoose from "mongoose";
import Event, { IEvent } from "../models/Event";
import User from "../models/User";
import { EventFilter } from "../validations/event.validation";

interface CreateEventData {
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
  ticketTypes?: {
    name: string;
    price: number;
    quantity: number;
    availableQuantity: number;
    startSaleDate?: Date;
    endSaleDate?: Date;
    description?: string;
  }[];
  tags?: string[];
  organizer: string | mongoose.Types.ObjectId;
  published?: boolean;
}

interface UpdateEventData extends Partial<CreateEventData> {}

/**
 * Service cho Event
 */
const eventService = {
  /**
   * Lấy danh sách sự kiện
   */
  async getEvents(filter: EventFilter = {}) {
    const {
      keyword,
      category,
      location,
      startDate,
      endDate,
      isFree,
      page = 1,
      limit = 10,
    } = filter;

    const query: any = {};

    // Chỉ lấy các sự kiện đã published
    query.published = true;

    // Filter theo từ khóa
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Filter theo category
    if (category) {
      query.category = category;
    }

    // Filter theo location
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Filter theo ngày
    if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        query.date.$gte = new Date(startDate);
      }

      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Filter theo giá vé
    if (isFree !== undefined) {
      query.isPaid = !isFree;
    }

    // Tính toán số lượng sự kiện bỏ qua
    const skip = (page - 1) * limit;

    // Query database
    const events = await Event.find(query)
      .populate("organizer", "name avatar")
      .skip(skip)
      .limit(limit)
      .sort({ date: 1 });

    // Đếm tổng số sự kiện thỏa mãn điều kiện
    const total = await Event.countDocuments(query);

    // Tính toán tổng số trang
    const totalPages = Math.ceil(total / limit);

    return {
      events,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  },

  /**
   * Lấy thông tin chi tiết sự kiện theo ID
   */
  async getEventById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Event not found");
    }

    const event = await Event.findById(id).populate("organizer", "name avatar");

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  },

  /**
   * Tạo sự kiện mới
   */
  async createEvent(data: CreateEventData) {
    const event = new Event(data);
    return await event.save();
  },

  /**
   * Cập nhật thông tin sự kiện
   */
  async updateEvent(id: string, data: UpdateEventData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Event not found");
    }

    const event = await Event.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  },

  /**
   * Xóa sự kiện
   */
  async deleteEvent(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Event not found");
    }

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      throw new Error("Event not found");
    }

    return true;
  },

  /**
   * Lấy sự kiện của người dùng hiện tại
   */
  async getUserEvents(userId: string) {
    return Event.find({ organizer: userId }).sort({ createdAt: -1 });
  },

  /**
   * Lấy thống kê sự kiện của người dùng hiện tại
   */
  async getEventStats(userId: string) {
    const stats = {
      total: 0,
      published: 0,
      draft: 0,
      past: 0,
      upcoming: 0,
    };

    // Đếm tổng số sự kiện
    stats.total = await Event.countDocuments({ organizer: userId });

    // Đếm số sự kiện đã published
    stats.published = await Event.countDocuments({
      organizer: userId,
      published: true,
    });

    // Đếm số sự kiện draft
    stats.draft = await Event.countDocuments({
      organizer: userId,
      published: false,
    });

    // Ngày hiện tại
    const currentDate = new Date();

    // Đếm số sự kiện đã qua
    stats.past = await Event.countDocuments({
      organizer: userId,
      date: { $lt: currentDate },
    });

    // Đếm số sự kiện sắp tới
    stats.upcoming = await Event.countDocuments({
      organizer: userId,
      date: { $gte: currentDate },
    });

    return stats;
  },

  /**
   * Cập nhật trạng thái published của sự kiện
   */
  async updateEventPublishStatus(id: string, published: boolean) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Event not found");
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { published },
      { new: true, runValidators: true }
    );

    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  },

  /**
   * Lưu sự kiện vào danh sách đã lưu của người dùng
   */
  async saveEvent(eventId: string, userId: string) {
    // Kiểm tra sự kiện có tồn tại không
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new Error("Event not found");
    }

    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Kiểm tra sự kiện đã được lưu chưa
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Kiểm tra xem sự kiện đã được lưu chưa
    if (user.savedEvents.includes(new mongoose.Types.ObjectId(eventId))) {
      throw new Error("Event already saved");
    }

    // Lưu sự kiện vào danh sách
    user.savedEvents.push(new mongoose.Types.ObjectId(eventId));
    await user.save();

    return true;
  },

  /**
   * Xóa sự kiện khỏi danh sách đã lưu của người dùng
   */
  async unsaveEvent(eventId: string, userId: string) {
    // Kiểm tra sự kiện có tồn tại không
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new Error("Event not found");
    }

    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Kiểm tra xem sự kiện có trong danh sách đã lưu không
    const eventObjId = new mongoose.Types.ObjectId(eventId);
    const eventIndex = user.savedEvents.findIndex((id) =>
      id.equals(eventObjId)
    );

    if (eventIndex === -1) {
      throw new Error("Event not saved");
    }

    // Xóa sự kiện khỏi danh sách
    user.savedEvents.splice(eventIndex, 1);
    await user.save();

    return true;
  },

  /**
   * Kiểm tra xem sự kiện đã được người dùng lưu chưa
   */
  async isEventSaved(eventId: string, userId: string) {
    // Kiểm tra tính hợp lệ của ID
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new Error("Event not found");
    }

    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Kiểm tra xem sự kiện có trong danh sách đã lưu không
    const eventObjId = new mongoose.Types.ObjectId(eventId);
    return user.savedEvents.some((id) => id.equals(eventObjId));
  },

  /**
   * Lấy danh sách sự kiện đã lưu của người dùng
   */
  async getSavedEvents(userId: string) {
    // Tìm người dùng và populate savedEvents
    const user = await User.findById(userId).populate({
      path: "savedEvents",
      populate: {
        path: "organizer",
        select: "name avatar",
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user.savedEvents;
  },
};

export default eventService;
