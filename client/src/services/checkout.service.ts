import api from "../utils/api";

// Định nghĩa kiểu dữ liệu cho request body
interface DemoPaymentPayload {
  eventId: string;
  ticketTypeId?: string | null; // Có thể không có nếu sự kiện chỉ có 1 loại vé mặc định
  quantity: number;
  fullName: string;
  email: string;
  phone?: string;
  paymentMethodDetails: {
    type: "DEMO_SUCCESS" | "DEMO_FAIL";
    // Có thể thêm các chi tiết khác cho demo nếu cần
    // cardNumber?: string;
    // expiryDate?: string;
    // cvv?: string;
  };
}

// Định nghĩa kiểu dữ liệu cho response thành công
interface DemoPaymentSuccessResponse {
  success: true;
  message: string;
  transactionId: string;
  eventId: string;
  ticketTypeId?: string;
  quantity: number;
  purchaser: {
    fullName: string;
    email: string;
    phone?: string;
  };
}

// Định nghĩa kiểu dữ liệu cho response thất bại (chung)
interface DemoPaymentErrorResponse {
  success: false;
  message: string;
  eventId?: string;
  ticketTypeId?: string;
  quantity?: number;
}

const checkoutService = {
  /**
   * Gọi API để xử lý thanh toán demo.
   * @param payload Dữ liệu thanh toán
   * @returns Promise chứa kết quả thanh toán
   */
  processDemoPayment: async (
    payload: DemoPaymentPayload
  ): Promise<DemoPaymentSuccessResponse> => {
    try {
      console.log(
        "[Client CheckoutService] Sending demo payment request:",
        payload
      );
      const response = await api.post<
        DemoPaymentSuccessResponse | DemoPaymentErrorResponse
      >("/checkout/process-payment", payload);
      console.log(
        "[Client CheckoutService] Received demo payment response:",
        response.data
      );

      if (response.data.success) {
        // TypeScript sẽ biết đây là DemoPaymentSuccessResponse do điều kiện success === true
        return response.data as DemoPaymentSuccessResponse;
      } else {
        // Nếu success là false, đây là DemoPaymentErrorResponse
        // Ném lỗi để component có thể bắt và xử lý
        // Sử dụng message từ server nếu có, hoặc một message mặc định
        const errorData = response.data as DemoPaymentErrorResponse;
        throw new Error(
          errorData.message || "Demo payment processing failed on server."
        );
      }
    } catch (error: any) {
      console.error(
        "[Client CheckoutService] Error calling processDemoPayment API:",
        error
      );
      // Xử lý lỗi từ axios (network error, server error không theo format DemoPaymentErrorResponse)
      let errorMessage =
        "An unexpected error occurred during payment processing.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message; // Lỗi đã được ném từ block `if (response.data.success)`
      }
      throw new Error(errorMessage);
    }
  },
};

export default checkoutService;
