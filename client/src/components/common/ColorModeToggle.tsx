import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

/**
 * Component nút chuyển đổi giữa chế độ sáng/tối
 * Sử dụng useColorMode hook từ Chakra UI để quản lý trạng thái chế độ màu
 */
const ColorModeToggle = () => {
  // Sử dụng hook useColorMode để lấy và thay đổi chế độ màu hiện tại
  const { colorMode, toggleColorMode } = useColorMode();

  // Xác định icon và hover text dựa trên chế độ màu hiện tại
  const isDark = colorMode === "dark";
  const SwitchIcon = isDark ? MdLightMode : MdDarkMode;
  const ariaLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  // Màu sắc thay đổi theo chế độ màu
  const iconColor = useColorModeValue("gray.600", "yellow.400");
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const hoverBgColor = useColorModeValue("gray.200", "gray.600");

  return (
    <IconButton
      aria-label={ariaLabel}
      icon={<SwitchIcon />}
      onClick={toggleColorMode}
      variant="ghost"
      color={iconColor}
      bg={bgColor}
      _hover={{ bg: hoverBgColor }}
      size="md"
      borderRadius="md"
      title={ariaLabel}
    />
  );
};

export default ColorModeToggle;
