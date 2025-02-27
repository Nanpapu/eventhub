import { useState, useEffect, useRef } from "react";
import {
  Box,
  VStack,
  Text,
  Flex,
  Heading,
  Icon,
  Badge,
  Button,
  useColorModeValue,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Tooltip,
  Divider,
  Center,
  Image,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Fade,
  SlideFade,
  ScaleFade,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiInfo,
  FiCheck,
  FiMoreVertical,
  FiTrash2,
  FiBell,
  FiCheckCircle,
  FiAlertCircle,
  FiMessageCircle,
  FiEye,
  FiClock,
  FiChevronRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Định nghĩa kiểu thông báo
export type NotificationType =
  | "event_reminder"
  | "ticket_confirmation"
  | "event_update"
  | "system_message"
  | "event_invite";

// Interface cho đối tượng thông báo
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  data?: {
    eventId?: string;
    eventTitle?: string;
    ticketId?: string;
    userId?: string;
  };
}

// Props cho component NotificationList
interface NotificationListProps {
  maxNotifications?: number;
  showViewAllButton?: boolean;
  onMarkAllAsRead?: () => void;
  onItemClick?: (notification: Notification) => void;
  isHeaderVisible?: boolean;
}

// Thành phần Animation cho mỗi phần tử thông báo
const MotionBox = motion(Box);

/**
 * Component hiển thị danh sách các thông báo của người dùng
 * Có thể hiển thị dưới dạng danh sách đầy đủ hoặc chỉ hiển thị số lượng giới hạn (cho dropdown)
 */
const NotificationList = ({
  maxNotifications,
  showViewAllButton = true,
  onMarkAllAsRead,
  onItemClick,
  isHeaderVisible = true,
}: NotificationListProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const toast = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Style colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");
  const unreadBadgeBg = useColorModeValue("teal.500", "teal.300");
  const itemBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");

  // Lấy dữ liệu thông báo (giả lập - trong thực tế sẽ gọi API)
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);

      try {
        // Giả lập delay của API
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Dữ liệu thông báo mẫu
        const mockNotifications: Notification[] = [
          {
            id: "1",
            type: "event_reminder",
            title: "Nhắc nhở sự kiện",
            message:
              "Hội nghị Công nghệ 2023 sẽ bắt đầu trong 2 ngày! Đừng quên check-in lúc 9 giờ sáng.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 giờ trước
            isRead: false,
            data: {
              eventId: "ev-123",
              eventTitle: "Hội nghị Công nghệ 2023",
            },
          },
          {
            id: "2",
            type: "ticket_confirmation",
            title: "Vé đã được xác nhận",
            message:
              "Vé tham dự Hội thảo React của bạn đã được xác nhận. Bạn có thể xem vé trong phần Vé của tôi.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 ngày trước
            isRead: true,
            data: {
              eventId: "ev-456",
              eventTitle: "Hội thảo React",
              ticketId: "VE-7890",
            },
          },
          {
            id: "3",
            type: "event_update",
            title: "Thông tin sự kiện đã cập nhật",
            message:
              "Địa điểm tổ chức JavaScript Meetup đã thay đổi. Vui lòng kiểm tra thông tin sự kiện.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 ngày trước
            isRead: false,
            data: {
              eventId: "ev-789",
              eventTitle: "JavaScript Meetup",
            },
          },
          {
            id: "4",
            type: "system_message",
            title: "Hồ sơ đã cập nhật",
            message: "Thông tin hồ sơ của bạn đã được cập nhật thành công.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 ngày trước
            isRead: true,
          },
          {
            id: "5",
            type: "event_invite",
            title: "Lời mời tham dự sự kiện",
            message:
              "Bạn đã được Nguyễn Văn A mời tham dự sự kiện Ra mắt sản phẩm.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 ngày trước
            isRead: false,
            data: {
              eventId: "ev-101",
              eventTitle: "Ra mắt sản phẩm",
              userId: "user-123",
            },
          },
          {
            id: "6",
            type: "event_reminder",
            title: "Check-in sắp mở",
            message:
              "Check-in cho khóa học Cơ bản về thiết kế UX sẽ mở vào ngày mai lúc 8 giờ sáng. Hãy chuẩn bị sẵn sàng!",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120), // 5 ngày trước
            isRead: true,
            data: {
              eventId: "ev-202",
              eventTitle: "Cơ bản về thiết kế UX",
            },
          },
        ];

        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Lỗi khi tải thông báo:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông báo",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [toast]);

  // Hàm đánh dấu một thông báo là đã đọc
  const handleMarkAsRead = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();

    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );

    toast({
      title: "Đã đánh dấu là đã đọc",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  // Hàm xóa một thông báo
  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();

    setNotifications((prev) => prev.filter((item) => item.id !== id));

    toast({
      title: "Đã xóa thông báo",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  // Xử lý khi click vào thông báo
  const handleItemClick = (notification: Notification) => {
    // Nếu chưa đọc, đánh dấu là đã đọc
    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item
        )
      );
    }

    // Gọi callback nếu có
    if (onItemClick) {
      onItemClick(notification);
    }
  };

  // Hàm tính thời gian tương đối
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Vừa xong";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    }

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return date.toLocaleDateString("vi-VN", options);
  };

  // Hàm lấy icon dựa trên loại thông báo
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "event_reminder":
        return FiCalendar;
      case "ticket_confirmation":
        return FiCheckCircle;
      case "event_update":
        return FiInfo;
      case "system_message":
        return FiAlertCircle;
      case "event_invite":
        return FiMessageCircle;
      default:
        return FiBell;
    }
  };

  // Hàm lấy màu dựa trên loại thông báo
  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case "event_reminder":
        return "blue";
      case "ticket_confirmation":
        return "green";
      case "event_update":
        return "orange";
      case "system_message":
        return "purple";
      case "event_invite":
        return "pink";
      default:
        return "teal";
    }
  };

  // Hàm lấy đường dẫn chi tiết dựa trên loại thông báo
  const getNotificationLink = (notification: Notification) => {
    const { type, data } = notification;

    switch (type) {
      case "event_reminder":
      case "event_update":
        return data?.eventId ? `/events/${data.eventId}` : "/events";
      case "ticket_confirmation":
        return "/my-tickets";
      case "event_invite":
        return data?.eventId ? `/events/${data.eventId}` : "/events";
      case "system_message":
      default:
        return "#";
    }
  };

  // Danh sách thông báo để hiển thị (giới hạn nếu cần)
  const displayedNotifications = maxNotifications
    ? notifications.slice(0, maxNotifications)
    : notifications;

  // Số lượng thông báo chưa đọc
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Hàm đánh dấu tất cả là đã đọc
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));

    toast({
      title: "Đã đánh dấu tất cả là đã đọc",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });

    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  if (isLoading) {
    return (
      <Box padding={4} width="100%">
        <Skeleton height="40px" width="200px" mb={4} />
        <SkeletonText noOfLines={1} mb={2} />
        {[1, 2, 3].map((index) => (
          <Box
            key={index}
            p={4}
            borderBottom="1px solid"
            borderColor={borderColor}
          >
            <Flex>
              <SkeletonCircle size="10" mr={3} />
              <Box flex="1">
                <SkeletonText noOfLines={2} mb={2} />
                <Skeleton height="20px" width="120px" />
              </Box>
            </Flex>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      bg={bgColor}
      borderRadius="md"
      overflow="hidden"
      boxShadow="sm"
    >
      {isHeaderVisible && (
        <Flex
          justify="space-between"
          align="center"
          p={4}
          borderBottom="1px solid"
          borderColor={borderColor}
          bg={useColorModeValue("gray.50", "gray.900")}
        >
          <HStack>
            <Icon as={FiBell} color="teal.500" fontSize="xl" mr={1} />
            <Heading size="md">Thông báo</Heading>
            {unreadCount > 0 && (
              <Badge borderRadius="full" px="2" colorScheme="teal">
                {unreadCount} mới
              </Badge>
            )}
          </HStack>

          <HStack>
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMarkAllAsRead}
                leftIcon={<FiCheck />}
                color="teal.500"
                _hover={{ bg: "teal.50", color: "teal.600" }}
              >
                Đánh dấu đã đọc
              </Button>
            )}
          </HStack>
        </Flex>
      )}

      {displayedNotifications.length === 0 ? (
        <Box p={6} textAlign="center">
          <Center flexDirection="column" p={4}>
            <Icon as={FiBell} fontSize="3xl" mb={3} color="gray.400" />
            <Text color={textColor} fontSize="md">
              Chưa có thông báo nào
            </Text>
            <Text color={mutedTextColor} fontSize="sm" mt={1}>
              Chúng tôi sẽ thông báo cho bạn khi có tin mới
            </Text>
          </Center>
        </Box>
      ) : (
        <VStack
          spacing={0}
          align="stretch"
          maxH="400px"
          overflowY="auto"
          ref={scrollRef}
          css={{
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(0, 0, 0, 0.1)",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          {displayedNotifications.map((notification, index) => (
            <SlideFade
              in={true}
              offsetY="10px"
              key={notification.id}
              delay={index * 0.05}
            >
              <MotionBox
                p={4}
                borderBottom="1px solid"
                borderColor={borderColor}
                bg={
                  notification.isRead
                    ? itemBgColor
                    : useColorModeValue("teal.50", "rgba(129, 230, 217, 0.08)")
                }
                _hover={{ bg: hoverBgColor }}
                cursor="pointer"
                onClick={() => handleItemClick(notification)}
                position="relative"
                transition="all 0.2s"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                borderLeft={notification.isRead ? "none" : "4px solid"}
                borderLeftColor={`${getNotificationColor(
                  notification.type
                )}.500`}
              >
                <HStack align="start" spacing={3}>
                  <Box
                    bg={`${getNotificationColor(notification.type)}.100`}
                    color={`${getNotificationColor(notification.type)}.500`}
                    p={2}
                    borderRadius="lg"
                    boxShadow="sm"
                  >
                    <Icon
                      as={getNotificationIcon(notification.type)}
                      fontSize="xl"
                    />
                  </Box>

                  <Box flex="1">
                    <HStack justify="space-between" align="start" mb={1}>
                      <Text
                        fontWeight={notification.isRead ? "medium" : "bold"}
                        fontSize="md"
                        color={textColor}
                      >
                        {notification.title}
                      </Text>
                      <Menu isLazy>
                        <MenuButton
                          as={IconButton}
                          aria-label="Tùy chọn thông báo"
                          icon={<FiMoreVertical />}
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                          _hover={{ bg: "transparent", color: "teal.500" }}
                        />
                        <MenuList shadow="lg" rounded="md">
                          {!notification.isRead && (
                            <MenuItem
                              icon={<FiCheck color="green.500" />}
                              onClick={(e) =>
                                handleMarkAsRead(notification.id, e)
                              }
                            >
                              Đánh dấu đã đọc
                            </MenuItem>
                          )}
                          <MenuItem
                            icon={<FiTrash2 color="red.500" />}
                            onClick={(e) => handleDelete(notification.id, e)}
                          >
                            Xóa thông báo
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>

                    <Text
                      color={useColorModeValue("gray.600", "gray.300")}
                      fontSize="sm"
                      mb={2}
                      fontWeight={notification.isRead ? "normal" : "medium"}
                    >
                      {notification.message}
                    </Text>

                    <HStack
                      justify="space-between"
                      fontSize="xs"
                      color={mutedTextColor}
                      mt={2}
                    >
                      <HStack spacing={1} opacity={0.9}>
                        <Icon as={FiClock} fontSize="xs" />
                        <Text>{getRelativeTime(notification.timestamp)}</Text>
                      </HStack>

                      {notification.data?.eventId && (
                        <Button
                          as={Link}
                          to={getNotificationLink(notification)}
                          variant="ghost"
                          color="teal.500"
                          size="xs"
                          height="auto"
                          rightIcon={<FiChevronRight />}
                          fontWeight="medium"
                          onClick={(e) => e.stopPropagation()}
                          _hover={{
                            bg: "transparent",
                            textDecoration: "underline",
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      )}
                    </HStack>
                  </Box>

                  {!notification.isRead && (
                    <Tooltip label="Thông báo chưa đọc" placement="left">
                      <Box
                        position="absolute"
                        top="4"
                        right="4"
                        width="8px"
                        height="8px"
                        borderRadius="full"
                        bg={unreadBadgeBg}
                      />
                    </Tooltip>
                  )}
                </HStack>
              </MotionBox>
            </SlideFade>
          ))}
        </VStack>
      )}

      {showViewAllButton && notifications.length > (maxNotifications || 0) && (
        <Flex
          justify="center"
          p={3}
          borderTop="1px solid"
          borderColor={borderColor}
          bg={useColorModeValue("gray.50", "gray.900")}
        >
          <Button
            as={Link}
            to="/notifications"
            variant="ghost"
            size="sm"
            width="100%"
            rightIcon={<FiChevronRight />}
            color="teal.500"
            _hover={{ bg: "teal.50", color: "teal.600" }}
          >
            Xem tất cả ({notifications.length})
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default NotificationList;
