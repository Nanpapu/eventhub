import mongoose from "mongoose";
import Event, { IEvent } from "../models/Event";
import User from "../models/User";

interface EventFilter {
  keyword?: string;
  category?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  isFree?: boolean;
  page?: number;
  limit?: number;
  organizer?: string;
}

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
class EventService {
  /**
   * Lấy danh sách sự kiện với filter
   * @param filter Thông tin filter
   */
  async getEvents(filter: EventFilter = {}) {
    try {
      const {
        keyword,
        category,
        location,
        startDate,
        endDate,
        isFree,
        page = 1,
        limit = 10,
        organizer,
      } = filter;

      // Tạo query object
      const query: any = {};

      // Thêm các điều kiện vào query
      if (keyword) {
        query.$text = { $search: keyword };
      }

      if (category) {
        query.category = category;
      }

      if (location) {
        query.location = { $regex: location, $options: "i" };
      }

      // Filter theo thời gian
      if (startDate || endDate) {
        query.date = {};
        if (startDate) {
          query.date.$gte = new Date(startDate);
        }
        if (endDate) {
          query.date.$lte = new Date(endDate);
        }
      }

      // Filter theo giá
      if (isFree !== undefined) {
        query.isPaid = !isFree;
      }

      // Filter theo organizer
      if (organizer) {
        query.organizer = new mongoose.Types.ObjectId(organizer);
      }

      // Chỉ lấy các sự kiện đã publish
      query.published = true;

      // Tính toán skip cho phân trang
      const skip = (page - 1) * limit;

      // Thực hiện truy vấn và đếm tổng số sự kiện
      const [events, total] = await Promise.all([
        Event.find(query)
          .populate("organizer", "name avatar")
          .skip(skip)
          .limit(limit)
          .sort({ date: 1 }),
        Event.countDocuments(query),
      ]);

      // Tính toán tổng số trang
      const totalPages = Math.ceil(total / limit);

      return {
        events,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy chi tiết sự kiện theo ID
   * @param id ID của sự kiện
   */
  async getEventById(id: string) {
    try {
      const event = await Event.findById(id).populate(
        "organizer",
        "name avatar"
      );
      if (!event) {
        throw new Error("Event not found");
      }
      return event;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo sự kiện mới
   * @param data Dữ liệu sự kiện
   */
  async createEvent(data: CreateEventData) {
    try {
      // Xác minh organizer có tồn tại không
      const user = await User.findById(data.organizer);
      if (!user) {
        throw new Error("Invalid organizer");
      }

      // Tạo danh sách ticket types
      let ticketTypes = [];
      if (data.isPaid && data.ticketTypes && data.ticketTypes.length > 0) {
        ticketTypes = data.ticketTypes.map((ticket) => ({
          ...ticket,
          availableQuantity: ticket.quantity,
        }));
      } else if (data.isPaid && data.price) {
        // Nếu không có ticket types nhưng có price, tạo một loại vé mặc định
        ticketTypes = [
          {
            name: "Standard Ticket",
            price: data.price,
            quantity: data.capacity,
            availableQuantity: data.capacity,
            description: "Standard entry ticket",
          },
        ];
      }

      // Tạo sự kiện mới
      const newEvent = new Event({
        ...data,
        ticketTypes,
      });

      await newEvent.save();
      return newEvent;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật thông tin sự kiện
   * @param id ID của sự kiện
   * @param data Dữ liệu cập nhật
   */
  async updateEvent(id: string, data: UpdateEventData) {
    try {
      // Kiểm tra sự kiện có tồn tại không
      const event = await Event.findById(id);
      if (!event) {
        throw new Error("Event not found");
      }

      // Xử lý đặc biệt cho ticketTypes nếu có
      if (data.ticketTypes) {
        // Giữ lại số lượng vé đã bán từ ticketTypes cũ
        const updatedTicketTypes = data.ticketTypes.map((newType) => {
          // Tìm loại vé cũ tương ứng (nếu có)
          const oldType = event.ticketTypes.find(
            (t) => t.name === newType.name
          );

          // Tính toán số lượng vé đã bán (nếu có thông tin cũ)
          const soldQuantity = oldType
            ? oldType.quantity - oldType.availableQuantity
            : 0;

          // Cập nhật số lượng vé còn lại
          return {
            ...newType,
            availableQuantity: Math.max(0, newType.quantity - soldQuantity),
          };
        });

        data.ticketTypes = updatedTicketTypes;
      }

      // Cập nhật sự kiện
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      ).populate("organizer", "name avatar");

      if (!updatedEvent) {
        throw new Error("Failed to update event");
      }

      return updatedEvent;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa sự kiện
   * @param id ID của sự kiện
   */
  async deleteEvent(id: string) {
    try {
      // Kiểm tra sự kiện có tồn tại không
      const event = await Event.findById(id);
      if (!event) {
        throw new Error("Event not found");
      }

      // Xóa sự kiện
      await Event.findByIdAndDelete(id);

      return { success: true, message: "Event deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lấy sự kiện của người dùng (đã tạo)
   * @param userId ID của người dùng
   */
  async getUserEvents(userId: string) {
    try {
      const events = await Event.find({ organizer: userId })
        .sort({ date: 1 })
        .populate("organizer", "name avatar");

      return events;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Đếm số lượng sự kiện theo các tiêu chí
   * @param organizerId ID của nhà tổ chức (optional)
   */
  async getEventStats(organizerId?: string) {
    try {
      const query: any = {};

      // Nếu có organizerId, chỉ đếm sự kiện của nhà tổ chức đó
      if (organizerId) {
        query.organizer = new mongoose.Types.ObjectId(organizerId);
      }

      // Query cơ bản: đếm tổng số sự kiện
      const totalEvents = await Event.countDocuments(query);

      // Đếm số sự kiện theo trạng thái
      const now = new Date();

      // Sự kiện sắp diễn ra (sau ngày hiện tại)
      const upcomingEvents = await Event.countDocuments({
        ...query,
        date: { $gt: now },
      });

      // Sự kiện đã kết thúc (trước ngày hiện tại)
      const pastEvents = await Event.countDocuments({
        ...query,
        date: { $lt: now },
      });

      // Sự kiện theo danh mục
      const eventsByCategory = await Event.aggregate([
        { $match: query },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      return {
        totalEvents,
        upcomingEvents,
        pastEvents,
        eventsByCategory: eventsByCategory.map((item) => ({
          category: item._id,
          count: item.count,
        })),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật trạng thái published của sự kiện
   * @param id ID của sự kiện
   * @param status Trạng thái published mới
   */
  async updateEventPublishStatus(id: string, status: boolean) {
    try {
      const event = await Event.findByIdAndUpdate(
        id,
        { $set: { published: status } },
        { new: true }
      );

      if (!event) {
        throw new Error("Event not found");
      }

      return event;
    } catch (error) {
      throw error;
    }
  }
}

export default new EventService();
