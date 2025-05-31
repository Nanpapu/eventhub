import i18n from "i18next";

/**
 * Định dạng tiền tệ dựa trên ngôn ngữ
 * @param amount Số tiền cần định dạng
 * @param currency Mã tiền tệ (mặc định: VND)
 * @returns Chuỗi đã định dạng
 */
export const formatCurrency = (amount: number, currency = "VND"): string => {
  // Xác định locale dựa trên ngôn ngữ hiện tại
  const locale = i18n.language === "vi" ? "vi-VN" : "en-US";

  try {
    if (currency === "VND") {
      // Định dạng số theo ngôn ngữ, sau đó thêm đ vào cuối
      return `${new Intl.NumberFormat(locale).format(amount)} đ`;
    }

    // Các loại tiền tệ khác vẫn sử dụng Intl.NumberFormat
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `${amount} ${currency}`;
  }
};

/**
 * Định dạng ngày tháng dựa trên ngôn ngữ
 * @param date Ngày cần định dạng (Date hoặc ISO string)
 * @param options Tùy chọn định dạng
 * @returns Chuỗi ngày tháng đã định dạng
 */
export const formatDate = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string => {
  const locale = i18n.language === "vi" ? "vi-VN" : "en-US";
  const dateObj = date instanceof Date ? date : new Date(date);

  try {
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateObj.toLocaleDateString();
  }
};

/**
 * Định dạng thời gian dựa trên ngôn ngữ
 * @param date Ngày giờ cần định dạng
 * @param options Tùy chọn định dạng
 * @returns Chuỗi thời gian đã định dạng
 */
export const formatTime = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
  }
): string => {
  const locale = i18n.language === "vi" ? "vi-VN" : "en-US";
  const dateObj = date instanceof Date ? date : new Date(date);

  try {
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch (error) {
    console.error("Error formatting time:", error);
    return dateObj.toLocaleTimeString();
  }
};

/**
 * Định dạng ngày giờ đầy đủ dựa trên ngôn ngữ
 * @param date Ngày giờ cần định dạng
 * @returns Chuỗi ngày giờ đã định dạng
 */
export const formatDateTime = (date: Date | string): string => {
  const locale = i18n.language === "vi" ? "vi-VN" : "en-US";
  const dateObj = date instanceof Date ? date : new Date(date);

  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return dateObj.toLocaleString();
  }
};

/**
 * Định dạng thời gian tương đối (ví dụ: "2 giờ trước")
 * @param date Ngày giờ cần định dạng
 * @returns Chuỗi thời gian tương đối
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  // Xác định đơn vị thời gian và số lượng
  let unit: Intl.RelativeTimeFormatUnit;
  let value: number;

  if (diffInSeconds < 60) {
    unit = "second";
    value = diffInSeconds;
  } else if (diffInSeconds < 3600) {
    unit = "minute";
    value = Math.floor(diffInSeconds / 60);
  } else if (diffInSeconds < 86400) {
    unit = "hour";
    value = Math.floor(diffInSeconds / 3600);
  } else if (diffInSeconds < 604800) {
    unit = "day";
    value = Math.floor(diffInSeconds / 86400);
  } else if (diffInSeconds < 2592000) {
    unit = "week";
    value = Math.floor(diffInSeconds / 604800);
  } else if (diffInSeconds < 31536000) {
    unit = "month";
    value = Math.floor(diffInSeconds / 2592000);
  } else {
    unit = "year";
    value = Math.floor(diffInSeconds / 31536000);
  }

  // Định dạng thời gian tương đối
  const locale = i18n.language === "vi" ? "vi-VN" : "en-US";
  try {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
      -value,
      unit
    );
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return `${value} ${unit}${value !== 1 ? "s" : ""} ago`;
  }
};

/**
 * Định dạng số nguyên dựa trên ngôn ngữ
 * @param num Số cần định dạng
 * @returns Chuỗi số đã định dạng
 */
export const formatNumber = (num: number): string => {
  const locale = i18n.language === "vi" ? "vi-VN" : "en-US";

  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch (error) {
    console.error("Error formatting number:", error);
    return num.toString();
  }
};

/**
 * Định dạng phần trăm dựa trên ngôn ngữ
 * @param value Giá trị (0-1)
 * @param decimals Số chữ số thập phân
 * @returns Chuỗi phần trăm đã định dạng
 */
export const formatPercent = (value: number, decimals = 0): string => {
  const locale = i18n.language === "vi" ? "vi-VN" : "en-US";

  try {
    return new Intl.NumberFormat(locale, {
      style: "percent",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (error) {
    console.error("Error formatting percent:", error);
    return `${(value * 100).toFixed(decimals)}%`;
  }
};
