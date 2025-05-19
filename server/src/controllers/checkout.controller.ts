import { Request, Response } from "express";
import mongoose from "mongoose";
import checkoutService from "../services/checkout.service"; // Import checkoutService
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
  const userId = (req.user as { _id: mongoose.Types.ObjectId })?._id; // Lấy _id và đảm bảo kiểu ObjectId

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
    res.status(400).json({
      success: false,
      message: "Missing required payment information.",
    });
    return;
  }

  // --- Demo Payment Logic ---
  try {
    // Nếu user không tồn tại (ví dụ token hợp lệ nhưng user đã bị xóa)
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "User not authenticated or not found.",
      });
      return;
    }

    if (paymentMethodDetails.type === "DEMO_SUCCESS") {
      console.log(
        `[Server CheckoutController] Processing REAL payment for event ${eventId}, quantity ${quantity}.`
      );

      // Gọi service để xử lý nghiệp vụ
      const purchaseResult = await checkoutService.processSuccessfulPurchase({
        userId,
        eventId,
        ticketTypeId, // Đảm bảo ticketTypeId là string ID
        quantity,
        purchaserInfo: { fullName, email, phone },
      });

      // Trả về kết quả từ service
      res.status(200).json({
        success: true,
        message: purchaseResult.message,
        transactionId: purchaseResult.transactionId, // transactionId từ payment record
        // Các thông tin khác client có thể cần từ purchaseResult
        eventId, // Giữ lại để client không bị lỗi
        ticketTypeId, // Giữ lại
        quantity, // Giữ lại
        purchaser: { fullName, email, phone }, // Giữ lại
        // registrationId: purchaseResult.registrationId, // Có thể thêm nếu client cần
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
      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Internal server error during demo payment processing.",
      });
    }
  }
};

export { processDemoPayment };
