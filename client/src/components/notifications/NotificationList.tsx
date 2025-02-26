import {
  Box,
  Text,
  Flex,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaEllipsisV,
  FaCalendarAlt,
  FaUserFriends,
  FaHeart,
  FaComment,
  FaTicketAlt,
  FaBell,
  FaCheckDouble,
  FaTrash,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Notification } from "./NotificationCenter";

/**
 * Component hiển thị một thông báo đơn lẻ
 * Được sử dụng trong cả NotificationCenter và trang Notifications
 */
export const NotificationItem = ({
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

/**
 * Component hiển thị danh sách thông báo
 * Được sử dụng trong trang Notifications
 */
export const NotificationList = ({
  notifications,
  onMarkAsRead,
  onDelete,
}: {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <Box>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
};

// Hàm helper để lấy icon dựa vào loại thông báo
export const getNotificationIcon = (type: Notification["type"]) => {
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
export const getNotificationColor = (type: Notification["type"]) => {
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
