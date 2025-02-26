import { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  IconButton,
  Flex,
  Heading,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Avatar,
} from "@chakra-ui/react";
import {
  FaBell,
  FaCheckDouble,
  FaTrash,
  FaEllipsisV,
  FaCalendarAlt,
  FaUserFriends,
  FaHeart,
  FaComment,
  FaTicketAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { format } from "date-fns";

// Interface cho đối tượng thông báo
export interface Notification {
  id: string;
  type:
    | "event_reminder"
    | "event_update"
    | "event_cancelled"
    | "comment_reply"
    | "registration_confirmed"
    | "event_liked"
    | "payment_confirmation"
    | "friend_activity";
  title: string;
  message: string;
  dateTime: Date;
  read: boolean;
  actionLink?: string;
  relatedUserId?: string;
  relatedUserName?: string;
  relatedUserAvatar?: string;
  relatedEventId?: string;
  relatedEventTitle?: string;
}

// Hàm helper để lấy icon dựa vào loại thông báo
const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "event_reminder":
    case "event_update":
    case "event_cancelled":
      return FaCalendarAlt;
    case "comment_reply":
      return FaComment;
    case "registration_confirmed":
    case "payment_confirmation":
      return FaTicketAlt;
    case "event_liked":
      return FaHeart;
    case "friend_activity":
      return FaUserFriends;
    default:
      return FaBell;
  }
};

// Hàm helper để lấy màu dựa vào loại thông báo
const getNotificationColor = (type: Notification["type"]) => {
  switch (type) {
    case "event_reminder":
      return "blue";
    case "event_update":
      return "orange";
    case "event_cancelled":
      return "red";
    case "comment_reply":
      return "purple";
    case "registration_confirmed":
      return "green";
    case "event_liked":
      return "pink";
    case "payment_confirmation":
      return "green";
    case "friend_activity":
      return "teal";
    default:
      return "gray";
  }
};

// Component cho từng thông báo riêng lẻ
const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const NotificationIcon = getNotificationIcon(notification.type);
  const notificationColor = getNotificationColor(notification.type);
  const bgColor = useColorModeValue(
    notification.read ? "white" : "gray.50",
    notification.read ? "gray.800" : "gray.700"
  );
  const timeColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Box
      p={3}
      borderRadius="md"
      boxShadow="sm"
      bg={bgColor}
      borderLeft={`4px solid ${
        notification.read
          ? "transparent"
          : `var(--chakra-colors-${notificationColor}-500)`
      }`}
      opacity={notification.read ? 0.8 : 1}
      transition="all 0.2s"
      _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
    >
      <Flex alignItems="flex-start">
        <Box
          p={2}
          borderRadius="md"
          bg={`${notificationColor}.100`}
          color={`${notificationColor}.500`}
          mr={3}
        >
          <NotificationIcon size={16} />
        </Box>

        <Box flex={1}>
          <Flex alignItems="center" justify="space-between">
            <Box>
              <Text fontWeight={notification.read ? "normal" : "bold"}>
                {notification.title}
              </Text>
              <Text fontSize="sm" color={timeColor} mt={1}>
                {format(notification.dateTime, "MMM d, yyyy 'at' h:mm a")}
              </Text>
            </Box>

            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FaEllipsisV />}
                aria-label="Options"
                variant="ghost"
                size="sm"
              />
              <MenuList fontSize="sm">
                {!notification.read && (
                  <MenuItem
                    icon={<FaCheckDouble />}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    Đánh dấu đã đọc
                  </MenuItem>
                )}
                <MenuItem
                  icon={<FaTrash />}
                  onClick={() => onDelete(notification.id)}
                  color="red.500"
                >
                  Xóa thông báo
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>

          <Text fontSize="sm" mt={2} mb={2}>
            {notification.message}
          </Text>

          {notification.relatedUserName && (
            <HStack mt={2} spacing={2}>
              <Avatar
                size="xs"
                name={notification.relatedUserName}
                src={notification.relatedUserAvatar}
              />
              <Text fontSize="xs" color={timeColor}>
                {notification.relatedUserName}
              </Text>
            </HStack>
          )}

          {notification.actionLink && (
            <Button
              as={Link}
              to={notification.actionLink}
              size="xs"
              colorScheme={notificationColor}
              variant="link"
              mt={2}
            >
              Xem chi tiết
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

// Component chính NotificationCenter
export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Giả lập dữ liệu thông báo
  useEffect(() => {
    // Dữ liệu mẫu cho demo
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "event_reminder",
        title: "Sự kiện sắp diễn ra",
        message:
          "Tech Conference 2023 sẽ diễn ra trong 2 ngày nữa. Đừng quên chuẩn bị!",
        dateTime: new Date(Date.now() - 30 * 60 * 1000), // 30 phút trước
        read: false,
        actionLink: "/my-events",
        relatedEventId: "1",
        relatedEventTitle: "Tech Conference 2023",
      },
      {
        id: "2",
        type: "comment_reply",
        title: "Phản hồi bình luận mới",
        message:
          'Jane Doe đã trả lời bình luận của bạn: "Cảm ơn về thông tin!"',
        dateTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 giờ trước
        read: false,
        actionLink: "/events/3#comments",
        relatedUserId: "user123",
        relatedUserName: "Jane Doe",
        relatedUserAvatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
        relatedEventId: "3",
        relatedEventTitle: "Music Festival",
      },
      {
        id: "3",
        type: "registration_confirmed",
        title: "Đăng ký thành công",
        message: "Đăng ký của bạn cho JavaScript Workshop đã được xác nhận.",
        dateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 ngày trước
        read: true,
        actionLink: "/my-events",
        relatedEventId: "2",
        relatedEventTitle: "JavaScript Workshop",
      },
      {
        id: "4",
        type: "payment_confirmation",
        title: "Thanh toán thành công",
        message:
          "Thanh toán của bạn cho Business Networking Event đã được xác nhận.",
        dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 ngày trước
        read: true,
        actionLink: "/my-events",
        relatedEventId: "5",
        relatedEventTitle: "Business Networking Event",
      },
      {
        id: "5",
        type: "event_update",
        title: "Sự kiện cập nhật",
        message:
          "Music Festival đã cập nhật thời gian và địa điểm. Vui lòng kiểm tra thông tin mới.",
        dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 ngày trước
        read: false,
        actionLink: "/events/3",
        relatedEventId: "3",
        relatedEventTitle: "Music Festival",
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  // Các hàm xử lý thông báo
  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  // Đếm số thông báo chưa đọc
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Box>
      <Popover
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom-end"
        gutter={4}
      >
        <PopoverTrigger>
          <Button
            variant="ghost"
            aria-label="Notifications"
            onClick={onToggle}
            position="relative"
          >
            <FaBell />
            {unreadCount > 0 && (
              <Badge
                colorScheme="red"
                position="absolute"
                top="-6px"
                right="-6px"
                fontSize="0.8em"
                borderRadius="full"
                minW={5}
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          width={{ base: "96vw", md: "400px" }}
          maxH="500px"
          overflow="hidden"
          boxShadow="lg"
          border="1px solid"
          borderColor={borderColor}
        >
          <PopoverArrow />
          <PopoverCloseButton />

          <Box p={4} borderBottomWidth="1px">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading size="sm">Thông báo</Heading>
              <HStack spacing={2}>
                {unreadCount > 0 && (
                  <Button
                    size="xs"
                    leftIcon={<FaCheckDouble />}
                    onClick={handleMarkAllAsRead}
                    variant="ghost"
                  >
                    Đọc tất cả
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button
                    size="xs"
                    colorScheme="red"
                    variant="ghost"
                    leftIcon={<FaTrash />}
                    onClick={handleClearAll}
                  >
                    Xóa tất cả
                  </Button>
                )}
              </HStack>
            </Flex>
          </Box>

          <PopoverBody p={0} overflowY="auto" maxH="350px">
            {notifications.length === 0 ? (
              <Box p={6} textAlign="center">
                <Text color="gray.500">Không có thông báo nào</Text>
              </Box>
            ) : (
              <VStack spacing={2} align="stretch" p={2}>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}
              </VStack>
            )}
          </PopoverBody>

          <PopoverFooter p={2}>
            <Flex justifyContent="center">
              <Button
                as={Link}
                to="/notifications"
                size="sm"
                width="full"
                variant="ghost"
                onClick={onClose}
              >
                Xem tất cả thông báo
              </Button>
            </Flex>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
