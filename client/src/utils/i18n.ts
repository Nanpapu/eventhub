import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import tất cả các file ngôn ngữ
import translationEN from "../locales/en/translation.json";
import translationVI from "../locales/vi/translation.json";

// Các ngôn ngữ được hỗ trợ
export const languages = {
  en: { name: "English", flag: "🇺🇸", dir: "ltr" },
  vi: { name: "Tiếng Việt", flag: "🇻🇳", dir: "ltr" },
};

// Tài nguyên ngôn ngữ
const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
};

// Kiểm tra xem có đang ở môi trường development không
const isDevelopment = import.meta.env.DEV;

/**
 * Cấu hình i18next
 * - Sử dụng LanguageDetector để tự động phát hiện ngôn ngữ từ trình duyệt
 * - Sử dụng initReactI18next để tích hợp với React
 * - Cấu hình các tùy chọn mặc định
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en", // Ngôn ngữ dự phòng khi không phát hiện được
    debug: isDevelopment, // Debug chỉ trong môi trường development

    interpolation: {
      escapeValue: false, // React đã tự xử lý XSS nên không cần escape
    },

    detection: {
      order: ["localStorage", "navigator"], // Thứ tự phát hiện ngôn ngữ
      caches: ["localStorage"], // Lưu lựa chọn của người dùng vào localStorage
    },
  });

export default i18n;
