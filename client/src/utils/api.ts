import axios from "axios";
import { toast } from "react-toastify";

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Thêm timeout 10 giây để tránh chờ quá lâu khi có sự cố mạng
});

// Thêm interceptor cho request
api.interceptors.request.use(
  (config) => {
    // Thêm token vào header của request nếu có
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor cho response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi từ response
    const { response } = error;

    if (response) {
      // Xử lý các mã lỗi HTTP
      switch (response.status) {
        case 400:
          toast.error("Bad Request");
          break;
        case 401:
          toast.error("Unauthorized");
          localStorage.removeItem("token");
          // Nếu cần, có thể thêm redirect đến trang login
          break;
        case 403:
          toast.error("Forbidden");
          break;
        case 404:
          toast.error("Not Found");
          break;
        case 500:
          toast.error("Server Error");
          break;
        default:
          toast.error("Something went wrong");
      }
    } else {
      // Lỗi không có response (network error)
      toast.error("Network Error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default api;
