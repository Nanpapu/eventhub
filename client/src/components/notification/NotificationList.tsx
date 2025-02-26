import { useState, useEffect } from "react";
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
} from "react-icons/fi";
import { Link } from "react-router-dom";

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

  // Style colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");
  const unreadBadgeBg = useColorModeValue("teal.500", "teal.300");

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
            title: "Event Reminder",
            message:
              "Tech Conference 2023 starts in 2 days! Don't forget to check in at 9 AM.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            isRead: false,
            data: {
              eventId: "ev-123",
              eventTitle: "Tech Conference 2023",
            },
          },
          {
            id: "2",
            type: "ticket_confirmation",
            title: "Ticket Confirmed",
            message:
              "Your ticket for React Workshop has been confirmed. You can view it in My Tickets.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            isRead: true,
            data: {
              eventId: "ev-456",
              eventTitle: "React Workshop",
              ticketId: "TIX-7890",
            },
          },
          {
            id: "3",
            type: "event_update",
            title: "Event Updated",
            message:
              "The venue for JavaScript Meetup has changed. Please check the event details.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
            isRead: false,
            data: {
              eventId: "ev-789",
              eventTitle: "JavaScript Meetup",
            },
          },
          {
            id: "4",
            type: "system_message",
            title: "Profile Updated",
            message: "Your profile information has been updated successfully.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
            isRead: true,
          },
          {
            id: "5",
            type: "event_invite",
            title: "Event Invitation",
            message:
              "You've been invited to Product Launch Party by John Smith.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
            isRead: false,
            data: {
              eventId: "ev-101",
              eventTitle: "Product Launch Party",
              userId: "user-123",
            },
          },
          {
            id: "6",
            type: "event_reminder",
            title: "Check-in Opens Soon",
            message:
              "Check-in for UX Design Basics opens tomorrow at 8 AM. Be prepared!",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120), // 5 days ago
            isRead: true,
            data: {
              eventId: "ev-202",
              eventTitle: "UX Design Basics",
            },
          },
        ];

        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({
          title: "Error",
          description: "Could not load notifications",
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
      title: "Notification marked as read",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Hàm xóa một thông báo
  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();

    setNotifications((prev) => prev.filter((item) => item.id !== id));

    toast({
      title: "Notification deleted",
      status: "success",
      duration: 2000,
      isClosable: true,
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
      return "Just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }

    return date.toLocaleDateString();
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
      title: "All notifications marked as read",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  if (isLoading) {
    return (
      <Box padding={4} width="100%">
        <Text>Loading notifications...</Text>
      </Box>
    );
  }

  return (
    <Box width="100%">
      {isHeaderVisible && (
        <Flex
          justify="space-between"
          align="center"
          p={4}
          borderBottom="1px solid"
          borderColor={borderColor}
        >
          <HStack>
            <Heading size="md">Notifications</Heading>
            {unreadCount > 0 && (
              <Badge borderRadius="full" px="2" colorScheme="teal">
                {unreadCount} new
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
              >
                Mark all as read
              </Button>
            )}
          </HStack>
        </Flex>
      )}

      {displayedNotifications.length === 0 ? (
        <Box p={4} textAlign="center">
          <Icon as={FiBell} fontSize="2xl" mb={2} />
          <Text>No notifications yet</Text>
        </Box>
      ) : (
        <VStack spacing={0} align="stretch" maxH="400px" overflowY="auto">
          {displayedNotifications.map((notification) => (
            <Box
              key={notification.id}
              p={4}
              borderBottom="1px solid"
              borderColor={borderColor}
              bg={notification.isRead ? "transparent" : hoverBgColor}
              _hover={{ bg: hoverBgColor }}
              cursor="pointer"
              onClick={() => handleItemClick(notification)}
              position="relative"
            >
              <HStack align="start" spacing={3}>
                <Box
                  bg={`${getNotificationColor(notification.type)}.100`}
                  color={`${getNotificationColor(notification.type)}.500`}
                  p={2}
                  borderRadius="md"
                >
                  <Icon
                    as={getNotificationIcon(notification.type)}
                    fontSize="xl"
                  />
                </Box>

                <Box flex="1">
                  <HStack justify="space-between" align="start" mb={1}>
                    <Text fontWeight="bold">{notification.title}</Text>
                    <Menu isLazy>
                      <MenuButton
                        as={IconButton}
                        aria-label="Notification options"
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <MenuList shadow="md">
                        {!notification.isRead && (
                          <MenuItem
                            icon={<FiCheck />}
                            onClick={(e) =>
                              handleMarkAsRead(notification.id, e)
                            }
                          >
                            Mark as read
                          </MenuItem>
                        )}
                        <MenuItem
                          icon={<FiTrash2 />}
                          onClick={(e) => handleDelete(notification.id, e)}
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>

                  <Text color="gray.600" fontSize="sm" mb={2}>
                    {notification.message}
                  </Text>

                  <HStack
                    justify="space-between"
                    fontSize="xs"
                    color="gray.500"
                  >
                    <Text>{getRelativeTime(notification.timestamp)}</Text>

                    {notification.data?.eventId && (
                      <Button
                        as={Link}
                        to={getNotificationLink(notification)}
                        variant="link"
                        color="teal.500"
                        size="xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View details
                      </Button>
                    )}
                  </HStack>
                </Box>

                {!notification.isRead && (
                  <Tooltip label="Unread notification">
                    <Box
                      position="absolute"
                      top="4"
                      right="4"
                      width="10px"
                      height="10px"
                      borderRadius="full"
                      bg={unreadBadgeBg}
                    />
                  </Tooltip>
                )}
              </HStack>
            </Box>
          ))}
        </VStack>
      )}

      {showViewAllButton && notifications.length > (maxNotifications || 0) && (
        <Flex
          justify="center"
          p={3}
          borderTop="1px solid"
          borderColor={borderColor}
        >
          <Button
            as={Link}
            to="/notifications"
            variant="ghost"
            size="sm"
            width="100%"
          >
            View all ({notifications.length})
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default NotificationList;
