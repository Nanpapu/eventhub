import {
  Box,
  Text,
  Flex,
  FlexProps,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import {
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
} from "../../utils/formatters";
import { useTranslation } from "react-i18next";
import { FiCalendar, FiClock, FiAlertCircle } from "react-icons/fi";

export interface DateDisplayProps extends FlexProps {
  /**
   * Ngày giờ cần hiển thị (Date object hoặc string)
   */
  date: Date | string;

  /**
   * Chế độ hiển thị của component
   * - 'date' - Chỉ hiển thị ngày
   * - 'time' - Chỉ hiển thị giờ
   * - 'dateTime' - Hiển thị cả ngày và giờ
   * - 'relative' - Hiển thị thời gian tương đối (ví dụ: 2 giờ trước)
   * - 'compact' - Hiển thị dạng ngắn gọn (DD/MM/YYYY)
   */
  mode?: "date" | "time" | "dateTime" | "relative" | "compact";

  /**
   * Hiển thị thêm tooltip khi hover với đầy đủ thông tin ngày giờ
   */
  showTooltip?: boolean;

  /**
   * Có hiển thị icon không
   */
  showIcon?: boolean;

  /**
   * Size của text
   */
  size?: "xs" | "sm" | "md" | "lg";
}

/**
 * Component hiển thị ngày tháng với hỗ trợ i18n
 */
const DateDisplay = ({
  date,
  mode = "date",
  showTooltip = true,
  showIcon = false,
  size = "md",
  ...rest
}: DateDisplayProps) => {
  const { t } = useTranslation();
  const textColor = useColorModeValue("gray.700", "gray.300");
  const iconColor = useColorModeValue("blue.500", "blue.300");

  // Chuyển đổi string thành Date object nếu cần
  const dateObj = date instanceof Date ? date : new Date(date);

  // Kiểm tra nếu ngày không hợp lệ
  if (isNaN(dateObj.getTime())) {
    return <Text color="red.500">{t("errors.invalidDate")}</Text>;
  }

  // Định dạng hiển thị dựa trên mode
  let displayValue = "";
  const tooltipValue = formatDateTime(dateObj);
  let icon = <FiCalendar />;

  switch (mode) {
    case "date":
      displayValue = formatDate(dateObj);
      icon = <FiCalendar />;
      break;
    case "time":
      displayValue = formatTime(dateObj);
      icon = <FiClock />;
      break;
    case "dateTime":
      displayValue = formatDateTime(dateObj);
      icon = <FiCalendar />;
      break;
    case "relative":
      displayValue = formatRelativeTime(dateObj);
      icon = <FiAlertCircle />;
      break;
    case "compact":
      displayValue = formatDate(dateObj, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      icon = <FiCalendar />;
      break;
    default:
      displayValue = formatDate(dateObj);
      icon = <FiCalendar />;
  }

  const content = (
    <Flex align="center" gap={2} {...rest}>
      {showIcon && <Box color={iconColor}>{icon}</Box>}
      <Text fontSize={size} color={textColor}>
        {displayValue}
      </Text>
    </Flex>
  );

  if (showTooltip) {
    return (
      <Tooltip label={tooltipValue} hasArrow placement="top">
        {content}
      </Tooltip>
    );
  }

  return content;
};

export default DateDisplay;
