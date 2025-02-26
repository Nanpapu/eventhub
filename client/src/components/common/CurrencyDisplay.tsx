import { Text, TextProps, useColorModeValue } from "@chakra-ui/react";
import { formatCurrency } from "../../utils/formatters";

export interface CurrencyDisplayProps extends TextProps {
  /**
   * Số tiền cần hiển thị
   */
  amount: number;

  /**
   * Mã tiền tệ (mặc định: VND)
   */
  currency?: string;

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
 * Component hiển thị tiền tệ với hỗ trợ i18n
 * Ví dụ:
 * ```jsx
 * <CurrencyDisplay amount={100000} /> // Hiển thị: 100.000 ₫
 * <CurrencyDisplay amount={100} currency="USD" /> // Hiển thị: $100.00
 * ```
 */
const CurrencyDisplay = ({
  amount,
  currency = "VND",
  colorNegative = true,
  colorPositive = false,
  ...rest
}: CurrencyDisplayProps) => {
  const defaultColor = useColorModeValue("gray.700", "gray.300");
  const negativeColor = "red.500";
  const positiveColor = "green.500";

  // Xác định màu sắc dựa vào giá trị và tùy chọn
  let textColor = defaultColor;
  if (amount < 0 && colorNegative) {
    textColor = negativeColor;
  } else if (amount > 0 && colorPositive) {
    textColor = positiveColor;
  }

  // Định dạng số tiền
  const formattedAmount = formatCurrency(amount, currency);

  return (
    <Text color={textColor} {...rest}>
      {formattedAmount}
    </Text>
  );
};

export default CurrencyDisplay;
