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

  // Các hàm service khác cho vé...
  // Ví dụ: async cancelUserTicket(userId: string, ticketId: string): Promise<ITicket | null> { ... }
}

export default new TicketService();
