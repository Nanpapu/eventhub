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
    // Sẽ trả về mảng đã được transform
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    const tickets = await Ticket.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
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
          "title date startTime location imageUrl isOnline onlineUrl address category organizer", // Chọn các trường cần từ Event
        // Options để populate organizer từ event nếu cần
        // populate: {
        //   path: 'organizer',
        //   select: 'name avatar' // Chọn các trường cần từ User (Organizer)
        // }
      })
      .sort({ purchaseDate: -1 }); // Sắp xếp vé mới nhất lên đầu

    // Transform data to match client's expected Ticket interface and add computed status
    return tickets.map((ticket) => {
      const event = ticket.eventId as IEvent; // eventId đã được populate thành IEvent

      // Xác định trạng thái "upcoming", "past" dựa trên ngày sự kiện
      let displayStatus: "upcoming" | "past" | "canceled" | "used" = "upcoming";
      const now = new Date();
      const eventDate = new Date(event.date);
      // Đặt giờ về 0 để so sánh ngày chính xác
      now.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);

      if (ticket.status === "cancelled") {
        displayStatus = "canceled";
      } else if (ticket.status === "used") {
        displayStatus = "used";
      } else if (eventDate < now) {
        displayStatus = "past";
      }
      // Nếu không rơi vào các trường hợp trên và status là "paid", nó sẽ là "upcoming"

      return {
        id: ticket._id.toString(),
        eventId: event._id.toString(), // Client đang dùng eventId là number/string, nên transform
        eventTitle: event.title,
        date: new Date(event.date).toLocaleDateString("vi-VN"), // Format date
        startTime: event.startTime,
        location: event.isOnline
          ? event.onlineUrl || "Online Event"
          : event.location,
        address: event.isOnline ? "" : event.address, // Địa chỉ cho sự kiện offline
        image: event.imageUrl,
        ticketType: ticket.ticketTypeName,
        price: ticket.price,
        purchaseDate: new Date(ticket.purchaseDate).toLocaleDateString("vi-VN"), // Format date
        // qrCode: `GENERATE_QR_FOR_${ticket._id.toString()}`, // Tạm thời client tự tạo
        status: displayStatus, // Trạng thái tính toán cho client
        ticketStatusOriginal: ticket.status, // Giữ lại status gốc từ DB nếu cần
        // Thêm các thông tin khác nếu cần
        eventCategory: event.category,
        eventOrganizer: event.organizer, // Đây sẽ là ObjectId, cần populate thêm nếu muốn tên organizer
      };
    });
  }

  // Các hàm service khác cho vé...
  // Ví dụ: async cancelUserTicket(userId: string, ticketId: string): Promise<ITicket | null> { ... }
}

export default new TicketService();
