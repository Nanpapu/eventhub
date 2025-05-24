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
  useToast,
} from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import NotificationList from "./NotificationList";
import notificationServiceAPI from "../../services/notification.service";
import { AxiosError } from "axios";

// Interface cho lỗi API có cấu trúc message (định nghĩa lại nếu bị thiếu)
interface ApiErrorData {
  message: string;
}

/**
 * Component hiển thị nút thông báo trên thanh điều hướng
 * Hiển thị số lượng thông báo chưa đọc và danh sách thông báo dạng popup
 */
const NotificationBell = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const location = useLocation();
  const bellRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  // Màu sắc theo theme
  const badgeBg = useColorModeValue("red.500", "red.300");
  const popoverBg = useColorModeValue("white", "gray.800");
  const popoverBorderColor = useColorModeValue("gray.200", "gray.700");

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationServiceAPI.getUnreadCountAPI();
      setUnreadCount(response.count);
    } catch (err) {
      const error = err as AxiosError<ApiErrorData>;
      console.error("Lỗi khi lấy số thông báo chưa đọc:", error.message);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  const handlePopoverOpen = () => {
    onOpen();
    setRefreshKey((prev) => prev + 1);
  };

  const handleNotificationClick = () => {
    onClose();
    setTimeout(() => {
      fetchUnreadCount();
    }, 500);
  };

  const handleMarkAllAsReadInList = async () => {
    try {
      await notificationServiceAPI.markAllNotificationsAsReadAPI();
      setUnreadCount(0);
      setRefreshKey((prev) => prev + 1);
      toast({
        title: "Tất cả thông báo đã được đánh dấu là đã đọc",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      const error = err as AxiosError<ApiErrorData>;
      console.error("Lỗi khi đánh dấu tất cả đã đọc:", error);
      toast({
        title: "Lỗi",
        description:
          error.response?.data?.message || "Không thể đánh dấu tất cả đã đọc",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
            onClick={handlePopoverOpen}
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
              boxShadow={`0 0 0 2px ${popoverBg}`}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          </Box>
        )}

        <Portal>
          <PopoverContent
            width={{ base: "90vw", md: "450px" }}
            maxWidth="90vw"
            maxHeight="calc(100vh - 120px)"
            shadow="xl"
            border="1px solid"
            borderColor={popoverBorderColor}
            bg={popoverBg}
            _focus={{ outline: "none" }}
            zIndex="popover"
          >
            <PopoverArrow bg={popoverBg} />
            <PopoverBody p={0}>
              <NotificationList
                maxNotifications={7}
                onMarkAllAsReadProp={handleMarkAllAsReadInList}
                onItemClickProp={handleNotificationClick}
                isHeaderVisible={true}
                refreshKey={refreshKey}
              />
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>

      {/* Hiệu ứng chỉ hiển thị khi có thông báo chưa đọc và popover đóng */}
      {unreadCount > 0 && !isOpen && (
        <Box
          position="absolute"
          top="-1px"
          right="-1px"
          width="10px"
          height="10px"
          borderRadius="full"
          bg={badgeBg}
          animation="pulse 1.5s infinite ease-in-out"
          sx={{
            "@keyframes pulse": {
              "0%": {
                transform: "scale(0.90)",
                boxShadow: `0 0 0 0 ${badgeBg}`,
              },
              "50%": {
                transform: "scale(1.1)",
                boxShadow: `0 0 0 6px rgba(0,0,0,0)`,
              },
              "100%": {
                transform: "scale(0.90)",
                boxShadow: `0 0 0 0 rgba(0,0,0,0)`,
              },
            },
          }}
        />
      )}
    </Box>
  );
};

export default NotificationBell;
