import Ticket, { ITicket } from "../models/Ticket";
import Event, { IEvent } from "../models/Event"; // Import IEvent để type-check cho populated event
import mongoose from "mongoose";

class TicketService {
  /**
   * Find all tickets for a given user, populating event details.
   * @param userId - The ID of the user.
   * @returns A promise that resolves to an array of tickets with populated event data.
   */
  async findUserTickets(userId: string): Promise<any[]> {
    console.log("[TicketService] Finding tickets for userId:", userId);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("[TicketService] Invalid user ID format:", userId);
      throw new Error("Invalid user ID format");
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    console.log(
      "[TicketService] Querying tickets for userId (ObjectId):",
      userObjectId
    );

    const ticketsFromDB = await Ticket.find({
      userId: userObjectId,
    })
      // .populate<{ eventId: IEvent }>({ // Original populate
      .populate<{
        eventId: Pick<
          IEvent,
          | "_id"
          | "title"
          | "date"
          | "startTime"
          | "location"
          | "imageUrl"
          | "isOnline"
          | "onlineUrl"
          | "address"
          | "category"
          | "organizer"
        >;
      }>({
        path: "eventId",
        select:
          "title date startTime location imageUrl isOnline onlineUrl address category organizer",
      })
      .sort({ purchaseDate: -1 });

    console.log(
      `[TicketService] Found ${ticketsFromDB.length} tickets in DB (before transform):`,
      JSON.stringify(ticketsFromDB, null, 2)
    );

    if (!ticketsFromDB || ticketsFromDB.length === 0) {
      console.log("[TicketService] No tickets found in DB for this user.");
      return []; // Trả về mảng rỗng nếu không có vé
    }

    const transformedTickets = ticketsFromDB
      .map((ticket) => {
        const event = ticket.eventId as IEvent; // eventId đã được populate thành IEvent

        if (!event) {
          console.warn(
            `[TicketService] Ticket ${ticket._id} has no populated eventId. Skipping transformation for this ticket.`
          );
          // Có thể trả về một object lỗi hoặc bỏ qua vé này
          // Hoặc xử lý theo cách khác tùy vào yêu cầu nghiệp vụ
          return null; // Sẽ được filter ra sau
        }

        let displayStatus: "upcoming" | "past" | "canceled" | "used" =
          "upcoming";
        const now = new Date();
        const eventDate = new Date(event.date);
        now.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);

        if (ticket.status === "cancelled") {
          displayStatus = "canceled";
        } else if (ticket.status === "used") {
          displayStatus = "used";
        } else if (eventDate < now) {
          displayStatus = "past";
        }

        const transformed = {
          id: ticket._id.toString(),
          eventId: event._id.toString(),
          eventTitle: event.title,
          date: new Date(event.date).toLocaleDateString("vi-VN"),
          startTime: event.startTime,
          location: event.isOnline
            ? event.onlineUrl || "Online Event"
            : event.location,
          address: event.isOnline ? "" : event.address,
          image: event.imageUrl,
          ticketType: ticket.ticketTypeName,
          price: ticket.price,
          purchaseDate: new Date(ticket.purchaseDate).toLocaleDateString(
            "vi-VN"
          ),
          status: displayStatus,
          ticketStatusOriginal: ticket.status,
          eventCategory: event.category,
          eventOrganizer: event.organizer,
        };
        // console.log(`[TicketService] Transformed ticket ${ticket._id}:`, JSON.stringify(transformed, null, 2)); // Log từng vé nếu cần debug sâu
        return transformed;
      })
      .filter((ticket) => ticket !== null); // Loại bỏ các vé null (nếu có)

    console.log(
      `[TicketService] Returning ${transformedTickets.length} transformed tickets.`
    );
    return transformedTickets;
  }

  /**
   * Kiểm tra trạng thái vé của người dùng cho sự kiện cụ thể
   * @param userId ID của người dùng
   * @param eventId ID của sự kiện
   * @returns Thông tin về số lượng vé đã mua và có vé miễn phí hay không
   */
  async getUserTicketStatus(
    userId: string,
    eventId: string
  ): Promise<{ ticketCount: number; hasFreeTicker: boolean }> {
    // Tìm tất cả vé của người dùng cho sự kiện này
    const tickets = await Ticket.find({
      userId: new mongoose.Types.ObjectId(userId),
      eventId: new mongoose.Types.ObjectId(eventId),
      status: { $nin: ["cancelled"] }, // Không đếm vé đã hủy
    }).populate({
      path: "eventId",
      select: "isPaid price ticketTypes",
    });

    // Đếm tổng số vé đã mua
    const ticketCount = tickets.reduce(
      (sum, ticket) => sum + ticket.quantity,
      0
    );

    // Kiểm tra xem đã có vé miễn phí chưa
    const hasFreeTicker = tickets.some((ticket) => {
      // Nếu là vé thường (không có ticketTypeId cụ thể)
      if (
        !ticket.ticketTypeId &&
        ticket.eventId &&
        !(ticket.eventId as any).isPaid
      ) {
        return true;
      }

      // Nếu là vé có loại cụ thể, kiểm tra giá của loại vé đó
      if (ticket.price === 0) {
        return true;
      }

      return false;
    });

    return {
      ticketCount,
      hasFreeTicker,
    };
  }

  /**
   * Lấy danh sách người tham dự (đã mua vé) của một sự kiện
   * @param eventId ID của sự kiện
   * @param organizerId ID của người tổ chức (để xác thực quyền truy cập)
   * @returns Danh sách người tham dự với thông tin vé và trạng thái check-in
   */
  async getEventAttendees(
    eventId: string,
    organizerId: string
  ): Promise<any[]> {
    // Kiểm tra id hợp lệ
    if (
      !mongoose.Types.ObjectId.isValid(eventId) ||
      !mongoose.Types.ObjectId.isValid(organizerId)
    ) {
      throw new Error("ID sự kiện hoặc ID người tổ chức không hợp lệ");
    }

    const eventObjectId = new mongoose.Types.ObjectId(eventId);

    // Kiểm tra người tổ chức có quyền xem sự kiện này không
    const event = await Event.findOne({
      _id: eventObjectId,
      organizer: organizerId,
    });

    if (!event) {
      throw new Error("Sự kiện không tồn tại hoặc bạn không có quyền truy cập");
    }

    // Lấy tất cả vé của sự kiện (không lấy những vé đã hủy)
    const tickets = await Ticket.find({
      eventId: eventObjectId,
      status: { $ne: "cancelled" },
    })
      .populate({
        path: "userId",
        select: "name email phone avatar", // Chỉ lấy những thông tin cần thiết
      })
      .sort({ purchaseDate: -1 });

    // Chuyển đổi dữ liệu để trả về
    return tickets.map((ticket) => {
      const user = ticket.userId as any; // TypeScript casting
      return {
        id: ticket._id.toString(),
        ticketId: ticket._id.toString(),
        name: user?.name || "Không có thông tin",
        email: user?.email || "Không có thông tin",
        phone: user?.phone,
        avatar: user?.avatar,
        ticketType: ticket.ticketTypeName,
        price: ticket.price,
        purchaseDate: ticket.purchaseDate,
        checkInStatus: !!ticket.checkInDate,
        checkInTime: ticket.checkInDate,
        status: ticket.status,
      };
    });
  }

  /**
   * Đánh dấu một vé đã được check-in
   * @param ticketId ID của vé
   * @param eventId ID của sự kiện
   * @param organizerId ID của người tổ chức (để xác thực quyền truy cập)
   * @returns Thông tin vé đã check-in
   */
  async checkInTicket(
    ticketId: string,
    eventId: string,
    organizerId: string
  ): Promise<any> {
    // Kiểm tra id hợp lệ
    if (
      !mongoose.Types.ObjectId.isValid(ticketId) ||
      !mongoose.Types.ObjectId.isValid(eventId) ||
      !mongoose.Types.ObjectId.isValid(organizerId)
    ) {
      throw new Error("ID không hợp lệ");
    }

    const eventObjectId = new mongoose.Types.ObjectId(eventId);
    const ticketObjectId = new mongoose.Types.ObjectId(ticketId);

    // Kiểm tra người tổ chức có quyền truy cập sự kiện này không
    const event = await Event.findOne({
      _id: eventObjectId,
      organizer: organizerId,
    });

    if (!event) {
      throw new Error("Sự kiện không tồn tại hoặc bạn không có quyền truy cập");
    }

    // Tìm vé
    const ticket = await Ticket.findOne({
      _id: ticketObjectId,
      eventId: eventObjectId,
    }).populate({
      path: "userId",
      select: "name email phone avatar",
    });

    if (!ticket) {
      throw new Error("Vé không tồn tại hoặc không thuộc sự kiện này");
    }

    // Kiểm tra vé đã check-in chưa
    const alreadyCheckedIn = !!ticket.checkInDate;

    // Nếu chưa check-in, cập nhật trạng thái
    if (!alreadyCheckedIn) {
      ticket.checkInDate = new Date();
      ticket.status = "used";
      await ticket.save();
    }

    // Trả về thông tin vé và người dùng
    const user = ticket.userId as any;
    return {
      id: ticket._id.toString(),
      ticketId: ticket._id.toString(),
      name: user?.name || "Không có thông tin",
      email: user?.email || "Không có thông tin",
      phone: user?.phone,
      avatar: user?.avatar,
      ticketType: ticket.ticketTypeName,
      price: ticket.price,
      purchaseDate: ticket.purchaseDate,
      checkInStatus: !!ticket.checkInDate,
      checkInTime: ticket.checkInDate,
      status: ticket.status,
      alreadyCheckedIn: alreadyCheckedIn, // Thêm trường này để UI biết đây là vé đã check-in từ trước
    };
  }

  // Các hàm service khác cho vé...
  // Ví dụ: async cancelUserTicket(userId: string, ticketId: string): Promise<ITicket | null> { ... }
}

export default new TicketService();
