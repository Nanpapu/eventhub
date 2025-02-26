import { useRef, useState, useEffect } from "react";
import {
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Box,
  Badge,
  useDisclosure,
  Portal,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationList, { Notification } from "./NotificationList";

/**
 * Component hiển thị nút thông báo trên thanh điều hướng
 * Hiển thị số lượng thông báo chưa đọc và danh sách thông báo dạng popup
 */
const NotificationBell = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [hasNewNotifications, setHasNewNotifications] =
    useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const bellRef = useRef<HTMLButtonElement>(null);

  // Màu sắc theo theme
  const badgeBg = useColorModeValue("red.500", "red.300");
  const popoverBg = useColorModeValue("white", "gray.800");
  const popoverBorderColor = useColorModeValue("gray.200", "gray.700");

  // Lấy số lượng thông báo chưa đọc (giả lập - trong thực tế sẽ gọi API)
  useEffect(() => {
    // Giả lập API để lấy số lượng thông báo chưa đọc
    const fetchUnreadCount = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Giả lập số ngẫu nhiên từ 1-5
      const count = Math.floor(Math.random() * 5) + 1;
      setUnreadCount(count);
      setHasNewNotifications(count > 0);
    };

    fetchUnreadCount();

    // Giả lập cơ chế nhận thông báo mới (ví dụ: WebSocket)
    const simulateNewNotification = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% cơ hội nhận thông báo mới
        setUnreadCount((prev) => prev + 1);
        setHasNewNotifications(true);
      }
    }, 60000); // Cứ sau 1 phút có cơ hội nhận thông báo mới

    return () => clearInterval(simulateNewNotification);
  }, []);

  // Đóng popover khi thay đổi route
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  // Xử lý khi nhấp vào một thông báo
  const handleNotificationClick = (notification: Notification) => {
    // Đóng popover
    onClose();

    // Nếu thông báo có ID sự kiện, chuyển đến trang sự kiện
    if (notification.data?.eventId) {
      navigate(`/events/${notification.data.eventId}`);
    } else {
      // Xử lý các loại thông báo khác
      switch (notification.type) {
        case "ticket_confirmation":
          navigate("/my-tickets");
          break;
        case "system_message":
          // Không chuyển hướng cho thông báo hệ thống
          break;
        default:
          // Mặc định chuyển đến trang thông báo
          navigate("/notifications");
      }
    }
  };

  // Xử lý khi đánh dấu tất cả là đã đọc
  const handleMarkAllAsRead = () => {
    setUnreadCount(0);
    setHasNewNotifications(false);
  };

  return (
    <Box position="relative">
      <Popover
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom-end"
        closeOnBlur={true}
        trigger="click"
        isLazy
      >
        <PopoverTrigger>
          <IconButton
            ref={bellRef}
            aria-label="Thông báo"
            icon={<FiBell />}
            variant="ghost"
            size="lg"
            onClick={onOpen}
            position="relative"
          />
        </PopoverTrigger>

        {/* Số lượng thông báo chưa đọc */}
        {unreadCount > 0 && (
          <Box
            position="absolute"
            top="0"
            right="0"
            transform="translate(30%, -30%)"
            zIndex={2}
          >
            <Badge
              borderRadius="full"
              bg={badgeBg}
              color="white"
              fontSize="0.8em"
              fontWeight="bold"
              minW="1.6em"
              h="1.6em"
              textAlign="center"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 0 0 2px var(--chakra-colors-white)"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          </Box>
        )}

        {/* Popover hiển thị danh sách thông báo */}
        <Portal>
          <PopoverContent
            width="350px"
            maxWidth="90vw"
            maxHeight="80vh"
            shadow="xl"
            border="1px solid"
            borderColor={popoverBorderColor}
            bg={popoverBg}
            _focus={{ outline: "none" }}
          >
            <PopoverArrow />
            <PopoverBody p={0}>
              <NotificationList
                maxNotifications={5}
                showViewAllButton={true}
                onMarkAllAsRead={handleMarkAllAsRead}
                onItemClick={handleNotificationClick}
              />
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>

      {/* Hiệu ứng nhấp nháy khi có thông báo mới */}
      {hasNewNotifications && (
        <Box
          position="absolute"
          top="-1px"
          right="-1px"
          width="10px"
          height="10px"
          borderRadius="full"
          bg={badgeBg}
          animation="pulse 2s infinite"
          sx={{
            "@keyframes pulse": {
              "0%": {
                transform: "scale(0.95)",
                boxShadow: "0 0 0 0 rgba(220, 38, 38, 0.7)",
              },
              "70%": {
                transform: "scale(1)",
                boxShadow: "0 0 0 10px rgba(220, 38, 38, 0)",
              },
              "100%": {
                transform: "scale(0.95)",
                boxShadow: "0 0 0 0 rgba(220, 38, 38, 0)",
              },
            },
          }}
        />
      )}
    </Box>
  );
};

export default NotificationBell;
