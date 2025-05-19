// server/src/services/checkout.service.ts
import mongoose from "mongoose";
import Event from "../models/Event";
import User from "../models/User"; // Cần thiết nếu bạn muốn lấy thêm thông tin user
import Payment from "../models/Payment";
import Registration from "../models/Registration";
import Notification from "../models/Notification";
import { IAttendeeInfo } from "../models/Registration"; // Import IAttendeeInfo

interface SuccessfulPurchaseParams {
  userId: mongoose.Types.ObjectId;
  eventId: string;
  ticketTypeId: string; // ID của ticketType (string)
  quantity: number;
  purchaserInfo: {
    fullName: string;
    email: string;
    phone?: string;
  };
  // totalAmount: number; // Server nên tự tính lại dựa trên giá từ DB
}

class CheckoutService {
  /**
   * Có thể thêm các phương thức xử lý nghiệp vụ thanh toán ở đây sau này.
   * Ví dụ: recordTransaction, updateTicketAvailability, sendConfirmationEmail, v.v.
   */
  // Ví dụ một hàm có thể có trong tương lai:
  // async verifyAndHoldTickets(eventId: string, ticketTypeId: string, quantity: number): Promise<boolean> {
  //   // Logic kiểm tra và tạm giữ vé
  //   console.log(`[CheckoutService] Verifying and holding ${quantity} of ticket type ${ticketTypeId} for event ${eventId}`);
  //   // ...
  //   return true; // or false
  // }

  /**
   * Xử lý logic sau khi thanh toán thành công, bao gồm tạo các bản ghi DB.
   */
  async processSuccessfulPurchase(params: SuccessfulPurchaseParams) {
    const { userId, eventId, ticketTypeId, quantity, purchaserInfo } = params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Lấy thông tin sự kiện và kiểm tra
      const event = await Event.findById(eventId).session(session);
      if (!event) {
        throw new Error("Event not found.");
      }
      if (!event.published) {
        throw new Error("Event is not currently published.");
      }

      // Thêm kiểm tra cho ticketTypeId (đảm bảo nó là string hợp lệ)
      if (typeof ticketTypeId !== "string" || !ticketTypeId.trim()) {
        throw new Error(`Invalid Ticket Type ID provided: ${ticketTypeId}`);
      }

      // 2. Tìm đúng loại vé (ticketType) trong sự kiện
      // Đảm bảo event.ticketTypes là mảng và có phần tử
      if (!event.ticketTypes || event.ticketTypes.length === 0) {
        throw new Error(
          `Event '${event.title}' (ID: ${eventId}) has no ticket types defined or its ticketTypes array is empty.`
        );
      }

      const selectedTicketType = event.ticketTypes.find(
        // tt._id là ObjectId, ticketTypeId là string
        (tt) => tt._id.toString() === ticketTypeId
      );

      if (!selectedTicketType) {
        // Cung cấp thêm context cho lỗi
        const availableTicketTypesInfo = event.ticketTypes
          .map((tt) => `{ id: '${tt._id.toString()}', name: '${tt.name}' }`)
          .join(", ");
        throw new Error(
          `Ticket type with ID '${ticketTypeId}' not found for event '${
            event.title
          }' (ID: ${eventId}). Available ticket types in DB for this event: [${
            availableTicketTypesInfo ||
            "None (this should not happen if previous check passed)"
          }]`
        );
      }

      // 3. Kiểm tra số lượng vé còn lại và giới hạn mua
      if (selectedTicketType.availableQuantity < quantity) {
        throw new Error(
          `Not enough tickets available for type "${selectedTicketType.name}". Only ${selectedTicketType.availableQuantity} left.`
        );
      }
      if (quantity <= 0) {
        throw new Error("Quantity must be greater than zero.");
      }
      if (quantity > event.maxTicketsPerPerson) {
        throw new Error(
          `Cannot purchase more than ${event.maxTicketsPerPerson} tickets per order for this event.`
        );
      }

      // 4. Tính tổng tiền (server-side)
      const singleTicketPrice = selectedTicketType.price;
      const totalAmount = singleTicketPrice * quantity;
      // TODO: Thêm logic phí dịch vụ nếu có, ví dụ:
      // const serviceFee = totalAmount * 0.05; // 5% service fee
      // const finalAmount = totalAmount + serviceFee;

      // 5. Tạo bản ghi Payment
      const paymentTransactionId = `REAL-TRX-${Date.now()}-${new mongoose.Types.ObjectId()
        .toString()
        .slice(-6)}`;
      const payment = new Payment({
        userId,
        eventId,
        amount: totalAmount, // Sử dụng finalAmount nếu có phí dịch vụ
        method: "DEMO_PURCHASE",
        status: "completed",
        transactionId: paymentTransactionId,
        // registrationId sẽ được cập nhật sau khi registration được tạo, hoặc không cần nếu Registration đã có paymentId
      });
      await payment.save({ session });

      // 6. Tạo bản ghi Registration
      const attendeeData: IAttendeeInfo[] = [
        {
          firstName:
            purchaserInfo.fullName.split(" ")[0] || purchaserInfo.fullName, // Tách đơn giản
          lastName: purchaserInfo.fullName.split(" ").slice(1).join(" ") || "",
          email: purchaserInfo.email,
          phone: purchaserInfo.phone,
        },
      ];

      const registration = new Registration({
        event: eventId,
        user: userId,
        ticketType: selectedTicketType._id, // Lưu ObjectId của ticketType
        quantity,
        totalAmount, // Sử dụng finalAmount nếu có phí dịch vụ
        attendeeInfo: attendeeData, // Client chỉ gửi 1 bộ thông tin người mua chính
        status: "confirmed",
        paymentStatus: "paid",
        paymentId: payment._id,
      });
      await registration.save({ session });

      // (Optional) Nếu Payment model có registrationId
      // payment.registrationId = registration._id;
      // await payment.save({ session });

      // 7. Cập nhật Event: giảm số lượng vé và tăng số người tham dự
      // Cách 1: Dùng $inc (an toàn hơn cho concurrency)
      const updateResult = await Event.updateOne(
        {
          _id: eventId,
          "ticketTypes._id": selectedTicketType._id, // So sánh ObjectId với ObjectId
        },
        {
          $inc: {
            "ticketTypes.$.availableQuantity": -quantity,
            attendees: quantity,
          },
        },
        { session }
      );

      if (updateResult.modifiedCount === 0) {
        // Có thể do vé đã bị người khác mua trong lúc xử lý, hoặc ID không đúng
        // Kiểm tra lại availableQuantity trước khi throw lỗi này để chắc chắn
        const freshEvent = await Event.findById(eventId).session(session);
        const freshTicketType = freshEvent?.ticketTypes.find(
          (tt) => tt._id.equals(selectedTicketType._id) // So sánh ObjectId với ObjectId
        );
        if (!freshTicketType || freshTicketType.availableQuantity < quantity) {
          throw new Error(
            "Failed to update event ticket quantity, possibly due to concurrent purchase or insufficient stock."
          );
        }
        // Nếu không phải do hết vé, có thể là lỗi khác
        // throw new Error("Failed to update event ticket quantity.");
      }

      // 8. Tạo Notification cho người dùng
      const notification = new Notification({
        user: userId,
        title: `Mua vé thành công: ${event.title}`,
        message: `Bạn đã mua thành công ${quantity} vé loại "${selectedTicketType.name}" cho sự kiện "${event.title}". Mã giao dịch: ${payment.transactionId}.`,
        type: "payment",
        relatedEvent: eventId,
      });
      await notification.save({ session });

      await session.commitTransaction();

      return {
        success: true,
        message: "Purchase processed successfully.",
        transactionId: payment.transactionId,
        registrationId: registration._id,
        eventTitle: event.title,
        ticketTypeName: selectedTicketType.name,
        quantityPurchased: quantity,
        totalPaid: totalAmount, // Sử dụng finalAmount nếu có phí dịch vụ
      };
    } catch (error) {
      await session.abortTransaction();
      console.error(
        "[CheckoutService] Error processing successful purchase:",
        error
      );
      throw error; // Ném lỗi để controller bắt và trả về cho client
    } finally {
      session.endSession();
    }
  }
}

export default new CheckoutService();
