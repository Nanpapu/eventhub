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
    _id?: mongoose.Types.ObjectId;
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
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const event = await Event.findById(id).session(session);
      if (!event) {
        throw new Error("Event not found");
      }

      // Lưu lại thông tin cũ để so sánh
      const oldEventData = {
        date: new Date(event.date).toISOString(), // So sánh ISO string cho dễ
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        address: event.address,
        isOnline: event.isOnline,
        onlineUrl: event.onlineUrl,
        published: event.published, // Theo dõi cả trạng thái publish/unpublish
        isPaid: event.isPaid,
      };

      // Cập nhật sự kiện
      Object.assign(event, data);

      // Xử lý ticketTypes nếu có trong data
      if (data.ticketTypes && data.ticketTypes.length > 0) {
        event.ticketTypes = data.ticketTypes.map((tt) => ({
          ...tt,
          _id: tt._id || new mongoose.Types.ObjectId(), // Tạo ID nếu là ticket type mới
          availableQuantity: tt.quantity, // Mặc định availableQuantity bằng quantity khi tạo/cập nhật
        })) as any; // Cần giữ lại ép kiểu any vì không thể khớp chính xác với kiểu ITicketTypeSubdocument[]
      }
      // Nếu không có ticketTypes trong data và sự kiện đang miễn phí, đảm bảo ticketTypes rỗng
      else if (!data.isPaid) {
        event.ticketTypes = [];
      }

      // Nếu isPaid thay đổi từ true sang false, xóa giá và ticketTypes
      if (data.isPaid === false && oldEventData.isPaid === true) {
        event.price = undefined;
        event.ticketTypes = [];
      }

      // Nếu isPaid thay đổi từ false sang true và không có price, đặt giá mặc định (ví dụ 0 hoặc yêu cầu nhập)
      if (
        data.isPaid === true &&
        oldEventData.isPaid === false &&
        !event.price &&
        (!event.ticketTypes || event.ticketTypes.length === 0)
      ) {
        // event.price = 0; // Hoặc throw error yêu cầu nhập giá/ticket type
        // Hoặc dựa vào logic từ data.price nếu được gửi lên
      }

      const updatedEvent = await event.save({ session });

      // ---- Logic gửi thông báo cập nhật cho người dùng đã lưu sự kiện và người mua vé ----
      const changedFields: string[] = [];
      if (new Date(updatedEvent.date).toISOString() !== oldEventData.date)
        changedFields.push("ngày diễn ra");
      if (updatedEvent.startTime !== oldEventData.startTime)
        changedFields.push("thời gian bắt đầu");
      if (updatedEvent.endTime !== oldEventData.endTime)
        changedFields.push("thời gian kết thúc");
      if (updatedEvent.location !== oldEventData.location)
        changedFields.push("địa điểm");
      if (updatedEvent.address !== oldEventData.address)
        changedFields.push("địa chỉ cụ thể");
      if (updatedEvent.isOnline !== oldEventData.isOnline)
        changedFields.push("hình thức tổ chức (online/offline)");
      if (
        updatedEvent.onlineUrl !== oldEventData.onlineUrl &&
        updatedEvent.isOnline
      )
        changedFields.push("đường dẫn sự kiện online");
      // Kiểm tra nếu sự kiện bị hủy (ví dụ: published chuyển từ true sang false)
      if (updatedEvent.published === false && oldEventData.published === true) {
        changedFields.push("sự kiện đã bị hủy"); // Hoặc một thông điệp cụ thể hơn
      }

      if (changedFields.length > 0) {
        // Người dùng đã lưu sự kiện
        const usersWhoSavedEvent = await User.find({
          savedEvents: updatedEvent._id as mongoose.Types.ObjectId,
        }).select("_id");

        // Lấy danh sách người dùng đã mua vé cho sự kiện này
        const usersWithRegistrations = await Registration.find({
          event: updatedEvent._id as mongoose.Types.ObjectId,
        })
          .select("user -_id")
          .lean();

        // Gộp danh sách userIds từ cả người đã lưu và người đã mua vé
        const allUserIds = [
          ...usersWhoSavedEvent.map((user) => user._id),
          ...usersWithRegistrations.map(
            (reg) => reg.user as mongoose.Types.ObjectId
          ),
        ];

        // Lọc ra các ID user duy nhất
        const uniqueUserIds = [
          ...new Set(
            allUserIds.map((id) => (id as mongoose.Types.ObjectId).toString())
          ),
        ].map((idStr) => new mongoose.Types.ObjectId(idStr));

        if (uniqueUserIds.length > 0) {
          let updateMessage = changedFields.join(", ");
          if (
            updatedEvent.published === false &&
            oldEventData.published === true
          ) {
            // Nếu sự kiện bị hủy, thông báo rõ hơn
            updateMessage = "sự kiện đã bị hủy hoặc không còn được công khai.";
          }

          await notificationService.createEventUpdateNotifications(
            uniqueUserIds,
            updatedEvent,
            updateMessage
          );
        }
      }
      // ---- Kết thúc logic gửi thông báo ----

      await session.commitTransaction();
      return updatedEvent;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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
        .filter((userId): userId is mongoose.Types.ObjectId => Boolean(userId));

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

    if (
      user.savedEvents &&
      user.savedEvents.some(
        (savedId) =>
          savedId.toString() ===
          (event._id as mongoose.Types.ObjectId).toString()
      )
    ) {
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

  // Hủy sự kiện (ví dụ: unpublish)
  async cancelEvent(
    eventId: string,
    organizerId: string
  ): Promise<IEvent | null> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const event = await Event.findOne({
        _id: eventId,
        organizer: organizerId,
      });
      if (!event) {
        throw new Error("Event not found or you are not the organizer.");
      }

      if (!event.published) {
        // throw new Error("Event is already unpublished."); // Hoặc chỉ bỏ qua
        await session.abortTransaction();
        return event; // Trả về sự kiện hiện tại nếu nó đã unpublish
      }

      const oldPublishedStatus = event.published;
      event.published = false;
      const updatedEvent = await event.save({ session });

      // Gửi thông báo cho người dùng đã lưu
      if (oldPublishedStatus === true) {
        // Chỉ gửi nếu trước đó nó published
        const usersWhoSavedEvent = await User.find({
          savedEvents: updatedEvent._id as mongoose.Types.ObjectId,
        }).select("_id");

        if (usersWhoSavedEvent.length > 0) {
          const userIds = usersWhoSavedEvent.map(
            (user) => user._id
          ) as mongoose.Types.ObjectId[];
          await notificationService.createEventUpdateNotifications(
            userIds,
            updatedEvent,
            "sự kiện đã bị hủy hoặc không còn được công khai."
          );
        }
      }

      // TODO: Cân nhắc gửi thông báo cho người đã mua vé về việc sự kiện bị hủy
      // Ví dụ: Lấy danh sách registrations cho eventId, rồi gửi thông báo cho từng user.
      // Điều này có thể cần một hàm riêng trong notificationService.

      await session.commitTransaction();
      return updatedEvent;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },
};

export default eventService;
