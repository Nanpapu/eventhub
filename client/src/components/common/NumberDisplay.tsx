import { Text, TextProps, useColorModeValue } from "@chakra-ui/react";
import { formatNumber, formatPercent } from "@/utils/formatters";
import { useTranslation } from "react-i18next";

export interface NumberDisplayProps extends TextProps {
  /**
   * Số cần hiển thị
   */
  value: number;

  /**
   * Chế độ hiển thị
   * - 'number' - Số nguyên thông thường
   * - 'percent' - Dạng phần trăm (0.1 -> 10%)
   */
  mode?: "number" | "percent";

  /**
   * Số chữ số thập phân (chỉ áp dụng cho mode="percent")
   */
  decimals?: number;

  /**
   * Có hiển thị số âm bằng màu đỏ không
   */
  colorNegative?: boolean;

  /**
   * Có highlight số dương bằng màu xanh không
   */
  colorPositive?: boolean;
}

/**
 * Component hiển thị số với hỗ trợ i18n
 * Ví dụ:
 * ```jsx
 * <NumberDisplay value={1000} /> // Hiển thị: 1,000
 * <NumberDisplay value={0.75} mode="percent" /> // Hiển thị: 75%
 * ```
 */
const NumberDisplay = ({
  value,
  mode = "number",
  decimals = 0,
  colorNegative = true,
  colorPositive = false,
  ...rest
}: NumberDisplayProps) => {
  const { t } = useTranslation();
  const defaultColor = useColorModeValue("gray.700", "gray.300");
  const negativeColor = "red.500";
  const positiveColor = "green.500";

  // Xác định màu sắc dựa vào giá trị và tùy chọn
  let textColor = defaultColor;
  if (value < 0 && colorNegative) {
    textColor = negativeColor;
  } else if (value > 0 && colorPositive) {
    textColor = positiveColor;
  }

  // Định dạng giá trị
  let formattedValue: string;

  if (mode === "percent") {
    formattedValue = formatPercent(value, decimals);
  } else {
    formattedValue = formatNumber(value);
  }

  return (
    <Text color={textColor} {...rest}>
      {formattedValue}
    </Text>
  );
};

export default NumberDisplay;
