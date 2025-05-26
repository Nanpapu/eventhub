// server/src/services/checkout.service.ts
import mongoose, { Types } from "mongoose";
import Event, { IEvent } from "../models/Event";
import User from "../models/User"; // Cần thiết nếu bạn muốn lấy thêm thông tin user
import Payment, { IPayment } from "../models/Payment";
import Registration, {
  IRegistration,
  IAttendeeInfo,
} from "../models/Registration";
import Ticket, { ITicket } from "../models/Ticket";
import notificationService from "./notification.service"; // Import NotificationService
import ticketService from "./ticket.service";

interface SuccessfulPurchaseParams {
  userId: Types.ObjectId;
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  purchaserInfo: {
    fullName: string;
    email: string;
    phone?: string;
  };
  // paymentMethod?: string; // Example: 'stripe', 'paypal' - can be added for more specific payment processing
  // paymentDetails?: any; // Example: Stripe token, PayPal transaction ID
}

interface PurchaseResult {
  registration: IRegistration;
  payment: IPayment;
  // notification: INotification; // Bỏ trường này nếu service không trả về trực tiếp nữa
  tickets: ITicket[];
}

class CheckoutService {
  /**
   * Processes a successful purchase after payment confirmation.
   * This function should be called after the payment gateway has confirmed the payment.
   * It handles creating the registration, payment record, tickets, updating event stats, and sending notifications.
   *
   * IMPORTANT: This entire operation is performed within a MongoDB transaction
   * to ensure data consistency. If any step fails, the entire transaction is rolled back.
   */
  async processSuccessfulPurchase(
    params: SuccessfulPurchaseParams
  ): Promise<PurchaseResult> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { userId, eventId, ticketTypeId, quantity, purchaserInfo } = params;

      // Find event
      const event = await Event.findById(eventId).session(session);
      if (!event) {
        throw new Error("Event not found.");
      }
      if (!event.published) {
        // Assuming isPublished field exists
        throw new Error("Event is not currently published.");
      }

      // Find selected ticket type
      const ticketTypeDetails = event.ticketTypes.find(
        (tt) => tt._id.toString() === ticketTypeId
      );

      if (!ticketTypeDetails) {
        throw new Error("Invalid ticket type.");
      }

      // Check available quantity (critical: do this within the transaction)
      if (ticketTypeDetails.availableQuantity < quantity) {
        throw new Error("Not enough tickets available for the selected type.");
      }
      if (quantity <= 0) {
        throw new Error("Quantity must be greater than zero.");
      }
      // Assuming maxTicketsPerPerson field exists on event
      if (event.maxTicketsPerPerson && quantity > event.maxTicketsPerPerson) {
        throw new Error(
          `Cannot purchase more than ${event.maxTicketsPerPerson} tickets per order for this event.`
        );
      }

      // Kiểm tra nếu là vé miễn phí
      if (ticketTypeDetails.price === 0) {
        // Kiểm tra người dùng đã có vé miễn phí cho sự kiện này chưa
        const ticketStatus = await ticketService.getUserTicketStatus(
          userId.toString(),
          eventId
        );
        if (ticketStatus.hasFreeTicker) {
          throw new Error("Bạn đã đăng ký vé miễn phí cho sự kiện này rồi");
        }

        // Kiểm tra số lượng vé miễn phí
        if (quantity > 1) {
          throw new Error("Chỉ được đăng ký 1 vé miễn phí cho mỗi sự kiện");
        }
      }

      const totalAmount = ticketTypeDetails.price * quantity;

      // 1. Create Registration
      const registrationData: Partial<IRegistration> = {
        event: event._id as any as Types.ObjectId,
        user: userId,
        ticketType: ticketTypeDetails._id as any as Types.ObjectId,
        quantity: quantity,
        totalAmount: totalAmount,
        attendeeInfo: [
          {
            name: purchaserInfo.fullName,
            email: purchaserInfo.email,
            phone: purchaserInfo.phone,
          },
        ],
        status: "confirmed", // Because payment is successful
        paymentStatus: "paid",
        paymentMethod: "DEMO_PURCHASE", // Demo payment
      };
      const registration = new Registration(registrationData);
      const savedRegistration = await registration.save({ session });

      // 2. Create Payment
      const paymentData: Partial<IPayment> = {
        userId: userId,
        eventId: event._id as any as Types.ObjectId,
        registrationId: savedRegistration._id as Types.ObjectId,
        amount: totalAmount,
        method: "DEMO_PURCHASE", // Demo payment
        status: "completed",
        transactionId: `DEMO-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      };
      const payment = new Payment(paymentData);
      const savedPayment = await payment.save({ session }); // Assign to new variable

      // Update registration with paymentId (if your schema needs it, ensure it's optional or handled)
      registration.paymentId = savedPayment._id;
      await registration.save({ session });

      // 3. Create individual Ticket records
      const createdTickets: ITicket[] = [];
      for (let i = 0; i < quantity; i++) {
        const ticketData: Partial<ITicket> = {
          eventId: event._id as any as Types.ObjectId,
          userId: userId,
          ticketTypeId: ticketTypeDetails._id.toString(),
          ticketTypeName: ticketTypeDetails.name,
          price: ticketTypeDetails.price,
          quantity: 1, // Each Ticket document represents 1 ticket
          status: "paid",
          paymentId: savedPayment._id as Types.ObjectId,
          purchaseDate: new Date(),
        };
        const ticket = new Ticket(ticketData);
        const savedTicket = await ticket.save({ session });
        createdTickets.push(savedTicket);
      }

      // 4. Update available quantity in Event
      ticketTypeDetails.availableQuantity -= quantity;
      event.attendees = (event.attendees || 0) + quantity; // Update total attendees
      // If you have a soldTickets field on ticketTypeDetails, update it too
      // ticketTypeDetails.soldQuantity = (ticketTypeDetails.soldQuantity || 0) + quantity;
      await event.save({ session });

      // Gọi NotificationService để tạo thông báo
      await notificationService.createTicketConfirmationNotification(
        userId,
        event, // Truyền toàn bộ object event (đã là IEvent)
        ticketTypeDetails.name,
        quantity,
        savedPayment.transactionId, // Truyền transactionId
        createdTickets.length > 0
          ? (createdTickets[0]._id as any).toString()
          : undefined // Truyền ticketId nếu có
      );

      await session.commitTransaction();
      return {
        registration: savedRegistration,
        payment: savedPayment,
        // notification: savedNotification, // Bỏ vì đã được xử lý bởi NotificationService
        tickets: createdTickets,
      };
    } catch (error) {
      await session.abortTransaction();
      console.error("Error during ticket purchase processing:", error);
      // It's good practice to throw a custom error or re-throw the original with context
      if (error instanceof Error) {
        throw new Error(`Transaction failed: ${error.message}`);
      }
      throw new Error("Transaction failed due to an unknown error.");
    } finally {
      session.endSession();
    }
  }
}

export default new CheckoutService();
