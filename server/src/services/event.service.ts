import mongoose from "mongoose";
import Event, { IEvent } from "../models/Event";
import User from "../models/User";
import Registration from "../models/Registration";
import notificationService from "./notification.service";
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
      throw new Error("Event ID không hợp lệ");
    }

    const originalEvent = await Event.findById(id).lean();
    if (!originalEvent) {
      throw new Error("Không tìm thấy sự kiện");
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      throw new Error("Không thể cập nhật sự kiện");
    }

    if (new Date(updatedEvent.date) > new Date()) {
      const changes: string[] = [];
      if (originalEvent.title !== updatedEvent.title)
        changes.push(`tiêu đề (mới: ${updatedEvent.title})`);
      if (originalEvent.description !== updatedEvent.description)
        changes.push("mô tả");
      if (
        new Date(originalEvent.date).toISOString() !==
        new Date(updatedEvent.date).toISOString()
      )
        changes.push(
          `ngày diễn ra (mới: ${new Date(updatedEvent.date).toLocaleDateString(
            "vi-VN"
          )})`
        );
      if (originalEvent.startTime !== updatedEvent.startTime)
        changes.push(`giờ bắt đầu (mới: ${updatedEvent.startTime})`);
      if (originalEvent.endTime !== updatedEvent.endTime)
        changes.push(`giờ kết thúc (mới: ${updatedEvent.endTime})`);
      if (originalEvent.location !== updatedEvent.location)
        changes.push(`địa điểm (mới: ${updatedEvent.location})`);
      if (originalEvent.address !== updatedEvent.address)
        changes.push(`địa chỉ (mới: ${updatedEvent.address})`);
      if (originalEvent.isOnline !== updatedEvent.isOnline)
        changes.push(
          updatedEvent.isOnline ? "hình thức trực tuyến" : "hình thức trực tiếp"
        );
      if (originalEvent.onlineUrl !== updatedEvent.onlineUrl)
        changes.push(
          `đường dẫn trực tuyến (mới: ${updatedEvent.onlineUrl || "N/A"})`
        );
      if (originalEvent.imageUrl !== updatedEvent.imageUrl)
        changes.push("hình ảnh sự kiện");
      if (originalEvent.category !== updatedEvent.category)
        changes.push(`danh mục (mới: ${updatedEvent.category})`);
      if (originalEvent.published !== updatedEvent.published)
        changes.push(
          updatedEvent.published
            ? "trạng thái công khai"
            : "trạng thái riêng tư"
        );

      if (changes.length > 0) {
        const updatedFieldsText = changes.join(", ");

        const registrations = await Registration.find({
          event: updatedEvent._id,
        })
          .select("user -_id")
          .lean();
        const userIds = registrations
          .map((reg) => reg.user as mongoose.Types.ObjectId)
          .filter((userId) => userId);

        if (userIds.length > 0) {
          console.log(
            `[EventService] Event ${updatedEvent.title} updated. Fields changed: ${updatedFieldsText}. Notifying ${userIds.length} users.`
          );
          await notificationService.createEventUpdateNotifications(
            userIds,
            updatedEvent,
            updatedFieldsText
          );
        }
      }
    }

    return updatedEvent;
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
      throw new Error("Event ID không hợp lệ");
    }

    const originalEvent = await Event.findById(id).lean();
    if (!originalEvent) {
      throw new Error("Không tìm thấy sự kiện");
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { published },
      { new: true, runValidators: true }
    );

    if (!event) {
      throw new Error("Không thể cập nhật trạng thái sự kiện");
    }

    if (
      originalEvent.published !== event.published &&
      new Date(event.date) > new Date()
    ) {
      const actionText = event.published
        ? "đã được công khai"
        : "đã được chuyển sang riêng tư";
      const message = `Sự kiện "${event.title}" ${actionText}.`;

      const registrations = await Registration.find({ event: event._id })
        .select("user -_id")
        .lean();
      const userIds = registrations
        .map((reg) => reg.user as mongoose.Types.ObjectId)
        .filter((userId) => userId);

      if (userIds.length > 0) {
        console.log(
          `[EventService] Event ${event.title} publish status changed to ${event.published}. Notifying ${userIds.length} users.`
        );
        await notificationService.createEventUpdateNotifications(
          userIds,
          event,
          message
        );
      }
    }

    return event;
  },

  /**
   * Lưu sự kiện vào danh sách đã lưu của người dùng
   */
  async saveEvent(eventId: string, userId: string) {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new Error("Invalid event ID");
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    if (user.savedEvents && user.savedEvents.includes(event._id)) {
      console.log("Event already saved by the user.");
      return { message: "Event already saved." };
    }

    user.savedEvents = user.savedEvents || [];
    user.savedEvents.push(event._id as mongoose.Types.ObjectId);
    await user.save();

    return { message: "Event saved successfully." };
  },

  /**
   * Xóa sự kiện khỏi danh sách đã lưu của người dùng
   */
  async unsaveEvent(eventId: string, userId: string) {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new Error("Invalid event ID");
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.savedEvents) {
      user.savedEvents = user.savedEvents.filter(
        (savedEventId) => savedEventId.toString() !== eventId
      );
      await user.save();
      return { message: "Event unsaved successfully." };
    } else {
      return {
        message: "No events to unsave or event not found in saved list.",
      };
    }
  },

  /**
   * Kiểm tra xem sự kiện đã được người dùng lưu chưa
   */
  async isEventSaved(eventId: string, userId: string): Promise<boolean> {
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(eventId)
    ) {
      console.warn("Invalid user ID or event ID for isEventSaved check.");
      return false;
    }
    const user = await User.findById(userId).select("savedEvents").lean();
    if (!user || !user.savedEvents) {
      return false;
    }
    return user.savedEvents.some((id) => id.toString() === eventId);
  },

  /**
   * Lấy danh sách sự kiện đã lưu của người dùng
   */
  async getSavedEvents(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }
    const user = await User.findById(userId)
      .populate({
        path: "savedEvents",
        model: "Event",
        populate: {
          path: "organizer",
          model: "User",
          select: "name avatar",
        },
        select:
          "title description date startTime location imageUrl category slug",
      })
      .lean();

    if (!user) {
      throw new Error("User not found");
    }
    return user.savedEvents || [];
  },
};

export default eventService;
