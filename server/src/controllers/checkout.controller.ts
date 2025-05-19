import { Request, Response } from "express";
import mongoose from "mongoose";
// Giả sử bạn có User model và Event model để tương tác (nếu cần cho logic demo phức tạp hơn)
// import User from '../models/User';
// import Event from '../models/Event';

/**
 * @desc Process a demo payment
 * @route POST /api/v1/checkout/process-payment
 * @access Private
 */
const processDemoPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Lấy userId từ req.user (được thêm bởi middleware authenticate)
  // const userId = (req.user as { id: string })?.id; // Type assertion

  // Lấy thông tin từ request body
  const {
    eventId,
    ticketTypeId,
    quantity,
    paymentMethodDetails, // { type: "DEMO_SUCCESS" | "DEMO_FAIL" }
    fullName,
    email,
    phone,
  } = req.body;

  console.log(
    "[Server CheckoutController] Received payment processing request:",
    req.body
  );
  // console.log('[Server CheckoutController] User ID from token:', userId);

  // --- Input Validation (Cơ bản) ---
  if (!eventId || !quantity || !paymentMethodDetails || !fullName || !email) {
    res
      .status(400)
      .json({
        success: false,
        message: "Missing required payment information.",
      });
    return;
  }

  // --- Demo Payment Logic ---
  try {
    if (paymentMethodDetails.type === "DEMO_SUCCESS") {
      // Giả lập tạo transactionId
      const transactionId = `DEMO-TRX-${Date.now()}-${new mongoose.Types.ObjectId()
        .toString()
        .slice(-6)}`;

      console.log(
        `[Server CheckoutController] Demo payment SUCCESS for event ${eventId}, quantity ${quantity}. TxID: ${transactionId}`
      );

      // TODO (Mở rộng Demo):
      // 1. Kiểm tra sự kiện có tồn tại không (Event.findById(eventId))
      // 2. Kiểm tra loại vé có tồn tại không và số lượng vé còn đủ không.
      // 3. Giả lập việc "tạo vé" hoặc "giảm số lượng vé có sẵn".
      //    Ví dụ: const event = await Event.findById(eventId);
      //           if (event && ticketTypeId) {
      //             const ticketType = event.ticketTypes.find(tt => tt.id === ticketTypeId);
      //             if (ticketType && ticketType.availableQuantity >= quantity) {
      //               ticketType.availableQuantity -= quantity;
      //               // await event.save(); // Cần xử lý cẩn thận race condition nếu có nhiều request
      //             } else {
      //                // Xử lý hết vé
      //             }
      //           }

      res.status(200).json({
        success: true,
        message: "Demo payment successful.",
        transactionId,
        eventId,
        ticketTypeId,
        quantity,
        purchaser: { fullName, email, phone },
      });
    } else if (paymentMethodDetails.type === "DEMO_FAIL") {
      console.log(
        `[Server CheckoutController] Demo payment FAILED for event ${eventId}, quantity ${quantity}.`
      );
      res.status(400).json({
        success: false,
        message: "Demo payment failed as requested by client.",
        eventId,
        ticketTypeId,
        quantity,
      });
    } else {
      console.log(
        `[Server CheckoutController] Unknown demo payment type: ${paymentMethodDetails.type}`
      );
      res
        .status(400)
        .json({ success: false, message: "Invalid demo payment type." });
    }
  } catch (error) {
    console.error(
      "[Server CheckoutController] Error processing demo payment:",
      error
    );
    // Phân biệt lỗi do client hay server
    if (
      error instanceof Error &&
      (error.message.includes("not found") ||
        error.message.includes("insufficient"))
    ) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res
        .status(500)
        .json({
          success: false,
          message: "Internal server error during demo payment processing.",
        });
    }
  }
};

export { processDemoPayment };
