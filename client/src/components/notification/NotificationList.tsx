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
  Center,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  SlideFade,
} from "@chakra-ui/react";
import {
  FiInfo,
  FiCheckCircle,
  FiMoreVertical,
  FiTrash2,
  FiBell,
  FiAlertCircle,
  FiMessageSquare,
  FiClock,
  FiChevronRight,
} from "react-icons/fi";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import notificationServiceAPI from "../../services/notification.service";
import { AxiosError } from "axios";

// Định nghĩa kiểu thông báo
export type NotificationType =
  | "event_reminder"
  | "ticket_confirmation"
  | "event_update"
  | "system_message"
  | "event_invite"
  | "payment_success"
  | "payment_failed";

// Interface cho đối tượng thông báo
export interface Notification {
  id: string;
  _id?: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date | string;
  isRead: boolean;
  data?: {
    eventId?: string;
    eventTitle?: string;
    ticketId?: string;
    transactionId?: string;
    userId?: string;
    link?: string;
    reminderTypeSent?: "1day" | "3days";
    [key: string]: string | number | boolean | undefined | null;
  };
  user?: string;
  relatedEvent?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Props cho component NotificationList
interface NotificationListProps {
  maxNotifications?: number;
  onMarkAllAsReadProp?: () => void;
  onItemClickProp?: (notification: Notification) => void;
  isHeaderVisible?: boolean;
  refreshKey?: number;
}

// Interface cho lỗi API có cấu trúc message
interface ApiErrorData {
  message: string;
}

// Thành phần Animation cho mỗi phần tử thông báo
const MotionBox = motion(Box);

/**
 * Component hiển thị danh sách các thông báo của người dùng
 * Có thể hiển thị dưới dạng danh sách đầy đủ hoặc chỉ hiển thị số lượng giới hạn (cho dropdown)
 */
const NotificationList = ({
  maxNotifications,
  onMarkAllAsReadProp,
  onItemClickProp,
  isHeaderVisible = true,
  refreshKey = 0,
}: NotificationListProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalNotifications, setTotalNotifications] = useState(0);

  const toast = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Style colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");
  const unreadBadgeBg = useColorModeValue("teal.500", "teal.300");
  const itemBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");
  const headingColor = useColorModeValue("gray.900", "white");
  const headerBg = useColorModeValue("gray.50", "gray.900");
  const unreadItemBackground = useColorModeValue(
    "teal.50",
    "rgba(129, 230, 217, 0.08)"
  );
  const messageColor = useColorModeValue("gray.600", "gray.300");

  // Hook useColorModeValue cho màu sắc động trong map
  // Chúng ta cần gọi chúng ở top-level, sau đó truyền giá trị vào map
  const iconColorsDynamic = {
    blue: useColorModeValue("blue.500", "blue.300"),
    green: useColorModeValue("green.500", "green.300"),
    orange: useColorModeValue("orange.500", "orange.300"),
    gray: useColorModeValue("gray.500", "gray.300"),
    purple: useColorModeValue("purple.500", "purple.300"),
    red: useColorModeValue("red.500", "red.300"),
  };
  const iconBgColorsDynamic = {
    blue: useColorModeValue("blue.50", "blue.800"),
    green: useColorModeValue("green.50", "green.800"),
    orange: useColorModeValue("orange.50", "orange.800"),
    gray: useColorModeValue("gray.50", "gray.800"),
    purple: useColorModeValue("purple.50", "purple.800"),
    red: useColorModeValue("red.50", "red.800"),
  };
  const borderLeftColorsDynamic = {
    blue: useColorModeValue("blue.400", "blue.600"),
    green: useColorModeValue("green.400", "green.600"),
    orange: useColorModeValue("orange.400", "orange.600"),
    gray: useColorModeValue("gray.400", "gray.600"),
    purple: useColorModeValue("purple.400", "purple.600"),
    red: useColorModeValue("red.400", "red.600"),
  };

  // Lấy dữ liệu thông báo từ API
  useEffect(() => {
    const fetchNotifications = async (pageToFetch = 1) => {
      setIsLoading(true);
      try {
        const response = await notificationServiceAPI.getNotificationsAPI(
          pageToFetch,
          maxNotifications || 10
        );
        const fetchedNotifications = response.notifications.map((n) => ({
          ...n,
          id: n._id || n.id,
          timestamp: n.createdAt || n.timestamp || new Date().toISOString(),
        }));

        if (pageToFetch === 1 || !maxNotifications) {
          setNotifications(fetchedNotifications);
        } else {
          setNotifications((prev) => [...prev, ...fetchedNotifications]);
        }
        setTotalNotifications(response.total);
      } catch (err) {
        const error = err as AxiosError<ApiErrorData>;
        console.error("Lỗi khi tải thông báo:", error);
        toast({
          title: "Lỗi máy chủ",
          description:
            error.response?.data?.message ||
            "Không thể tải thông báo từ máy chủ",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications(1);
  }, [toast, maxNotifications, refreshKey]);

  // Hàm đánh dấu một thông báo là đã đọc
  const handleMarkAsRead = async (
    notificationId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    try {
      const updatedNotification =
        await notificationServiceAPI.markNotificationAsReadAPI(notificationId);
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === updatedNotification.id
            ? {
                ...item,
                ...updatedNotification,
                id: updatedNotification._id || updatedNotification.id,
              }
            : item
        )
      );
      toast({
        title: "Đã đánh dấu là đã đọc",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      const error = err as AxiosError<ApiErrorData>;
      console.error("Lỗi khi đánh dấu đã đọc:", error);
      toast({
        title: "Lỗi",
        description:
          error.response?.data?.message || "Không thể đánh dấu đã đọc",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Hàm xóa một thông báo
  const handleDelete = async (
    notificationId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    try {
      await notificationServiceAPI.deleteNotificationAPI(notificationId);
      setNotifications((prev) =>
        prev.filter((item) => item.id !== notificationId)
      );
      toast({
        title: "Đã xóa thông báo",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      const error = err as AxiosError<ApiErrorData>;
      console.error("Lỗi khi xóa thông báo:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể xóa thông báo",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Xử lý khi click vào thông báo
  const handleItemClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        const updatedNotification =
          await notificationServiceAPI.markNotificationAsReadAPI(
            notification.id
          );
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === updatedNotification.id
              ? {
                  ...item,
                  ...updatedNotification,
                  id: updatedNotification._id || updatedNotification.id,
                }
              : item
          )
        );
      } catch (err) {
        const error = err as AxiosError<ApiErrorData>;
        console.error("Lỗi khi đánh dấu đã đọc lúc click:", error.message);
      }
    }

    if (onItemClickProp) {
      onItemClickProp(notification);
      return;
    }

    const link = getNotificationLink(notification);
    if (link && link !== "#") {
      navigate(link);
    }
  };

  // Hàm tính thời gian tương đối
  const getRelativeTime = (dateInput: Date | string | undefined) => {
    if (!dateInput) {
      return "Thời gian không xác định";
    }

    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    if (isNaN(date.getTime())) {
      return "Ngày không hợp lệ";
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} giây trước`;
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

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Hàm lấy icon dựa trên loại thông báo
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "event_reminder":
        return FiClock;
      case "ticket_confirmation":
      case "payment_success":
        return FiCheckCircle;
      case "event_update":
        return FiInfo;
      case "system_message":
        return FiMessageSquare;
      case "event_invite":
        return FiBell;
      case "payment_failed":
        return FiAlertCircle;
      default:
        return FiBell;
    }
  };

  // Hàm lấy màu dựa trên loại thông báo
  const getNotificationColorName = (
    type: NotificationType
  ): keyof typeof iconColorsDynamic => {
    switch (type) {
      case "event_reminder":
        return "blue";
      case "ticket_confirmation":
      case "payment_success":
        return "green";
      case "event_update":
        return "orange";
      case "system_message":
        return "gray";
      case "event_invite":
        return "purple";
      case "payment_failed":
        return "red";
      default:
        return "gray";
    }
  };

  // Hàm lấy đường dẫn chi tiết dựa trên loại thông báo và dữ liệu trong thông báo
  const getNotificationLink = (notification: Notification): string => {
    const { type, data } = notification;

    if (!data) return "#";

    switch (type) {
      case "event_reminder":
      case "event_update":
      case "event_invite":
        return data.eventId ? `/events/${data.eventId}` : "#";
      case "ticket_confirmation":
      case "payment_success":
        if (data.ticketId) return `/user/tickets`;
        if (data.eventId) return `/events/${data.eventId}`;
        return "/user/tickets";
      case "payment_failed":
        if (data.eventId) return `/checkout/${data.eventId}?retry=true`;
        return "/support/payment-issues";
      case "system_message":
        return data.link || "#";
      default:
        if (data.eventId) return `/events/${data.eventId}`;
        return "#";
    }
  };

  // Danh sách thông báo để hiển thị (giới hạn nếu cần)
  const displayedNotifications = notifications;

  // Số lượng thông báo chưa đọc
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Hàm đánh dấu tất cả là đã đọc
  const handleMarkAllAsRead = async () => {
    try {
      await notificationServiceAPI.markAllNotificationsAsReadAPI();
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true }))
      );
      toast({
        title: "Đã đánh dấu tất cả là đã đọc",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      if (onMarkAllAsReadProp) {
        onMarkAllAsReadProp();
      }
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

  if (isLoading && notifications.length === 0) {
    return (
      <Box padding={4} width="100%">
        {isHeaderVisible && <Skeleton height="40px" width="200px" mb={4} />}
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
          bg={headerBg}
        >
          <HStack>
            <Icon as={FiBell} color="teal.500" fontSize="xl" mr={1} />
            <Heading size="md" color={headingColor}>
              Thông báo ({totalNotifications})
            </Heading>
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
                leftIcon={<FiCheckCircle />}
                color="teal.500"
                _hover={{ bg: "teal.50", color: "teal.600" }}
              >
                Đánh dấu đã đọc
              </Button>
            )}
          </HStack>
        </Flex>
      )}

      {displayedNotifications.length === 0 && !isLoading ? (
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
          maxH={{ base: "calc(100vh - 200px)", md: "500px" }}
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
          {displayedNotifications.map((notification, index) => {
            const colorName = getNotificationColorName(notification.type);
            const iconColor = iconColorsDynamic[colorName];
            const iconBgColor = iconBgColorsDynamic[colorName];
            const borderLeftColorVal = borderLeftColorsDynamic[colorName];

            return (
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
                  bg={notification.isRead ? itemBgColor : unreadItemBackground}
                  _hover={{ bg: hoverBgColor }}
                  cursor="pointer"
                  onClick={() => handleItemClick(notification)}
                  position="relative"
                  transition="all 0.2s"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  borderLeft={notification.isRead ? "none" : "4px solid"}
                  borderLeftColor={
                    notification.isRead ? "transparent" : borderLeftColorVal
                  }
                >
                  <HStack align="start" spacing={3}>
                    <Box
                      bg={iconBgColor}
                      color={iconColor}
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
                          noOfLines={1}
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
                          <MenuList shadow="lg" rounded="md" minW="180px">
                            {!notification.isRead && (
                              <MenuItem
                                icon={<FiCheckCircle />}
                                color="green.500"
                                onClick={(e) =>
                                  handleMarkAsRead(notification.id, e)
                                }
                              >
                                Đánh dấu đã đọc
                              </MenuItem>
                            )}
                            <MenuItem
                              icon={<FiTrash2 />}
                              color="red.500"
                              onClick={(e) => handleDelete(notification.id, e)}
                            >
                              Xóa thông báo
                            </MenuItem>
                            <MenuItem
                              as={RouterLink}
                              to={getNotificationLink(notification)}
                              icon={<FiChevronRight />}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Xem chi tiết
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>

                      <Text
                        color={messageColor}
                        fontSize="sm"
                        mb={2}
                        fontWeight={notification.isRead ? "normal" : "medium"}
                        noOfLines={2}
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
                      </HStack>
                    </Box>

                    {!notification.isRead && (
                      <Tooltip label="Thông báo chưa đọc" placement="left">
                        <Box
                          position="absolute"
                          top="50%"
                          right="10px"
                          transform="translateY(-50%)"
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
            );
          })}
        </VStack>
      )}
    </Box>
  );
};

export default NotificationList;
