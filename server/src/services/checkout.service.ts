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
      // Find event
      const event = await Event.findById(params.eventId).session(session);
      if (!event) {
        throw new Error("Event not found.");
      }
      if (!event.published) {
        // Assuming isPublished field exists
        throw new Error("Event is not currently published.");
      }

      // Find selected ticket type
      const ticketTypeDetails = event.ticketTypes.find(
        (tt) => tt._id.toString() === params.ticketTypeId
      );

      if (!ticketTypeDetails) {
        throw new Error("Invalid ticket type.");
      }

      // Check available quantity (critical: do this within the transaction)
      if (ticketTypeDetails.availableQuantity < params.quantity) {
        throw new Error("Not enough tickets available for the selected type.");
      }
      if (params.quantity <= 0) {
        throw new Error("Quantity must be greater than zero.");
      }
      // Assuming maxTicketsPerPerson field exists on event
      if (
        event.maxTicketsPerPerson &&
        params.quantity > event.maxTicketsPerPerson
      ) {
        throw new Error(
          `Cannot purchase more than ${event.maxTicketsPerPerson} tickets per order for this event.`
        );
      }

      const totalAmount = ticketTypeDetails.price * params.quantity;

      // 1. Create Registration
      const registrationData: Partial<IRegistration> = {
        event: event._id as any as Types.ObjectId,
        user: params.userId,
        ticketType: ticketTypeDetails._id as any as Types.ObjectId,
        quantity: params.quantity,
        totalAmount: totalAmount,
        attendeeInfo: [
          {
            name: params.purchaserInfo.fullName,
            email: params.purchaserInfo.email,
            phone: params.purchaserInfo.phone,
          },
        ],
        status: "confirmed", // Because payment is successful
        paymentStatus: "paid",
      };
      const registration = new Registration(registrationData);
      const savedRegistration = await registration.save({ session });

      // 2. Create Payment
      const paymentData: Partial<IPayment> = {
        userId: params.userId,
        eventId: event._id as any as Types.ObjectId,
        registrationId: savedRegistration._id as Types.ObjectId,
        amount: totalAmount,
        method: "DEMO_PURCHASE", // Or from params if available
        status: "completed",
        transactionId: `DEMO_TRANS_${new Types.ObjectId().toString()}`, // Mock transaction ID
      };
      const payment = new Payment(paymentData);
      const savedPayment = await payment.save({ session }); // Assign to new variable

      // Update registration with paymentId (if your schema needs it, ensure it's optional or handled)
      // registration.paymentId = savedPayment._id; // This line might be problematic if paymentId is string
      // registration.paymentMethod = savedPayment.method;
      // await registration.save({ session }); // Save registration again if updated

      // 3. Create individual Ticket records
      const createdTickets: ITicket[] = [];
      for (let i = 0; i < params.quantity; i++) {
        const ticketData: Partial<ITicket> = {
          eventId: event._id as any as Types.ObjectId,
          userId: params.userId,
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
      ticketTypeDetails.availableQuantity -= params.quantity;
      event.attendees = (event.attendees || 0) + params.quantity; // Update total attendees
      // If you have a soldTickets field on ticketTypeDetails, update it too
      // ticketTypeDetails.soldQuantity = (ticketTypeDetails.soldQuantity || 0) + params.quantity;
      await event.save({ session });

      // Gọi NotificationService để tạo thông báo
      await notificationService.createTicketConfirmationNotification(
        params.userId,
        event, // Truyền toàn bộ object event (đã là IEvent)
        ticketTypeDetails.name,
        params.quantity,
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
