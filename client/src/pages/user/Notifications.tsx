import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Divider,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
  Badge,
  useToast,
  IconButton,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import {
  FaFilter,
  FaCheck,
  FaTrash,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { Notification } from "../../components/notifications/NotificationCenter";
import { NotificationItem } from "../../components/notifications/NotificationList";

/**
 * Trang hiển thị tất cả thông báo của người dùng
 * Cho phép lọc, sắp xếp, đánh dấu đã đọc và xóa thông báo
 */
export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortNewest, setSortNewest] = useState(true);
  const toast = useToast();
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // Giả lập dữ liệu thông báo
  useEffect(() => {
    // Trong thực tế, sẽ fetch dữ liệu từ API
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
      {
        id: "6",
        type: "event_cancelled",
        title: "Sự kiện đã bị hủy",
        message:
          "Chúng tôi rất tiếc phải thông báo rằng Data Science Meetup đã bị hủy.",
        dateTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 ngày trước
        read: true,
        actionLink: "/events/4",
        relatedEventId: "4",
        relatedEventTitle: "Data Science Meetup",
      },
      {
        id: "7",
        type: "event_liked",
        title: "Có người thích sự kiện của bạn",
        message: "John Smith đã thích sự kiện Tech Conference 2023 của bạn",
        dateTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 ngày trước
        read: true,
        relatedUserId: "user456",
        relatedUserName: "John Smith",
        relatedEventId: "1",
        relatedEventTitle: "Tech Conference 2023",
      },
      {
        id: "8",
        type: "friend_activity",
        title: "Bạn bè đăng ký sự kiện",
        message: "Emma Wilson vừa đăng ký tham gia Tech Conference 2023",
        dateTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 ngày trước
        read: false,
        actionLink: "/events/1",
        relatedUserId: "user789",
        relatedUserName: "Emma Wilson",
        relatedEventId: "1",
        relatedEventTitle: "Tech Conference 2023",
      },
    ];

    setNotifications(mockNotifications);
    applyFilters(mockNotifications, activeFilters);
  }, []);

  // Cập nhật các thông báo đã lọc mỗi khi filter thay đổi
  useEffect(() => {
    applyFilters(notifications, activeFilters);
  }, [activeFilters, sortNewest]);

  // Lọc thông báo theo loại và sắp xếp
  const applyFilters = (data: Notification[], filters: string[]) => {
    let result = [...data];

    // Lọc theo loại nếu có filter
    if (filters.length > 0) {
      result = result.filter((notification) =>
        filters.includes(notification.type)
      );
    }

    // Sắp xếp theo thời gian
    result.sort((a, b) => {
      if (sortNewest) {
        return b.dateTime.getTime() - a.dateTime.getTime();
      } else {
        return a.dateTime.getTime() - b.dateTime.getTime();
      }
    });

    setFilteredNotifications(result);
  };

  // Xử lý thêm filter
  const handleAddFilter = (filterType: Notification["type"]) => {
    if (!activeFilters.includes(filterType)) {
      const newFilters = [...activeFilters, filterType];
      setActiveFilters(newFilters);
    }
  };

  // Xử lý xóa filter
  const handleRemoveFilter = (filterType: string) => {
    const newFilters = activeFilters.filter((type) => type !== filterType);
    setActiveFilters(newFilters);
  };

  // Xử lý xóa tất cả filter
  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  // Đánh dấu thông báo là đã đọc
  const handleMarkAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );

    setNotifications(updatedNotifications);
    applyFilters(updatedNotifications, activeFilters);

    toast({
      title: "Đã đánh dấu đã đọc",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Đánh dấu tất cả thông báo là đã đọc
  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    setNotifications(updatedNotifications);
    applyFilters(updatedNotifications, activeFilters);

    toast({
      title: "Đã đánh dấu tất cả là đã đọc",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Xử lý xóa thông báo
  const handleDelete = (id: string) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );

    setNotifications(updatedNotifications);
    applyFilters(updatedNotifications, activeFilters);

    toast({
      title: "Đã xóa thông báo",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  // Xử lý xóa tất cả thông báo
  const handleDeleteAll = () => {
    setNotifications([]);
    setFilteredNotifications([]);

    toast({
      title: "Đã xóa tất cả thông báo",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  // Chuyển đổi tên loại thông báo thành văn bản thân thiện
  const getFilterDisplayName = (filterType: string) => {
    switch (filterType) {
      case "event_reminder":
        return "Nhắc nhở sự kiện";
      case "event_update":
        return "Cập nhật sự kiện";
      case "event_cancelled":
        return "Sự kiện đã hủy";
      case "comment_reply":
        return "Phản hồi bình luận";
      case "registration_confirmed":
        return "Xác nhận đăng ký";
      case "event_liked":
        return "Thích sự kiện";
      case "payment_confirmation":
        return "Xác nhận thanh toán";
      case "friend_activity":
        return "Hoạt động bạn bè";
      default:
        return filterType;
    }
  };

  // Lấy màu cho loại thông báo
  const getFilterColor = (filterType: string) => {
    switch (filterType) {
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

  // Số lượng thông báo chưa đọc
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          wrap="wrap"
          gap={4}
        >
          <Heading size="xl">Thông báo</Heading>

          <HStack spacing={4}>
            <Button
              leftIcon={<FaCheck />}
              colorScheme="teal"
              variant="outline"
              isDisabled={unreadCount === 0}
              onClick={handleMarkAllAsRead}
            >
              Đánh dấu tất cả đã đọc
            </Button>

            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FaFilter />}
                variant="outline"
              >
                Lọc
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => handleAddFilter("event_reminder")}
                  isDisabled={activeFilters.includes("event_reminder")}
                >
                  Nhắc nhở sự kiện
                </MenuItem>
                <MenuItem
                  onClick={() => handleAddFilter("event_update")}
                  isDisabled={activeFilters.includes("event_update")}
                >
                  Cập nhật sự kiện
                </MenuItem>
                <MenuItem
                  onClick={() => handleAddFilter("event_cancelled")}
                  isDisabled={activeFilters.includes("event_cancelled")}
                >
                  Sự kiện đã hủy
                </MenuItem>
                <MenuItem
                  onClick={() => handleAddFilter("comment_reply")}
                  isDisabled={activeFilters.includes("comment_reply")}
                >
                  Phản hồi bình luận
                </MenuItem>
                <MenuItem
                  onClick={() => handleAddFilter("registration_confirmed")}
                  isDisabled={activeFilters.includes("registration_confirmed")}
                >
                  Xác nhận đăng ký
                </MenuItem>
                <MenuItem
                  onClick={() => handleAddFilter("payment_confirmation")}
                  isDisabled={activeFilters.includes("payment_confirmation")}
                >
                  Xác nhận thanh toán
                </MenuItem>
                <MenuItem
                  onClick={() => handleAddFilter("event_liked")}
                  isDisabled={activeFilters.includes("event_liked")}
                >
                  Thích sự kiện
                </MenuItem>
                <MenuItem
                  onClick={() => handleAddFilter("friend_activity")}
                  isDisabled={activeFilters.includes("friend_activity")}
                >
                  Hoạt động bạn bè
                </MenuItem>
                <Divider my={2} />
                <MenuItem
                  onClick={handleClearFilters}
                  isDisabled={activeFilters.length === 0}
                >
                  Xóa tất cả bộ lọc
                </MenuItem>
              </MenuList>
            </Menu>

            <IconButton
              aria-label={
                sortNewest ? "Sắp xếp cũ nhất trước" : "Sắp xếp mới nhất trước"
              }
              icon={sortNewest ? <FaSortAmountDown /> : <FaSortAmountUp />}
              onClick={() => setSortNewest(!sortNewest)}
              variant="outline"
            />
          </HStack>
        </Flex>

        {activeFilters.length > 0 && (
          <Box>
            <Text mb={2} fontWeight="medium">
              Bộ lọc đang áp dụng:
            </Text>
            <Flex gap={2} flexWrap="wrap">
              {activeFilters.map((filter) => (
                <Tag
                  size="md"
                  key={filter}
                  borderRadius="full"
                  variant="solid"
                  colorScheme={getFilterColor(filter)}
                >
                  <TagLabel>{getFilterDisplayName(filter)}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveFilter(filter)} />
                </Tag>
              ))}
              <Button size="sm" variant="ghost" onClick={handleClearFilters}>
                Xóa tất cả
              </Button>
            </Flex>
          </Box>
        )}

        {unreadCount > 0 && (
          <Text>
            Bạn có <Badge colorScheme="red">{unreadCount}</Badge> thông báo chưa
            đọc
          </Text>
        )}

        <Tabs variant="enclosed" colorScheme="teal">
          <TabList>
            <Tab>Tất cả ({notifications.length})</Tab>
            <Tab>Chưa đọc ({unreadCount})</Tab>
            <Tab>Đã đọc ({notifications.length - unreadCount})</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              {filteredNotifications.length === 0 ? (
                <Box p={8} textAlign="center" borderRadius="md" bg={bgColor}>
                  {activeFilters.length > 0
                    ? "Không có thông báo nào phù hợp với bộ lọc"
                    : "Không có thông báo nào"}
                </Box>
              ) : (
                <VStack spacing={3} align="stretch">
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDelete}
                    />
                  ))}
                </VStack>
              )}
            </TabPanel>

            <TabPanel px={0}>
              {filteredNotifications.filter((n) => !n.read).length === 0 ? (
                <Box p={8} textAlign="center" borderRadius="md" bg={bgColor}>
                  {activeFilters.length > 0
                    ? "Không có thông báo chưa đọc nào phù hợp với bộ lọc"
                    : "Không có thông báo chưa đọc nào"}
                </Box>
              ) : (
                <VStack spacing={3} align="stretch">
                  {filteredNotifications
                    .filter((n) => !n.read)
                    .map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                        onDelete={handleDelete}
                      />
                    ))}
                </VStack>
              )}
            </TabPanel>

            <TabPanel px={0}>
              {filteredNotifications.filter((n) => n.read).length === 0 ? (
                <Box p={8} textAlign="center" borderRadius="md" bg={bgColor}>
                  {activeFilters.length > 0
                    ? "Không có thông báo đã đọc nào phù hợp với bộ lọc"
                    : "Không có thông báo đã đọc nào"}
                </Box>
              ) : (
                <VStack spacing={3} align="stretch">
                  {filteredNotifications
                    .filter((n) => n.read)
                    .map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                        onDelete={handleDelete}
                      />
                    ))}
                </VStack>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>

        {notifications.length > 0 && (
          <Flex justifyContent="center" my={4}>
            <Button
              leftIcon={<FaTrash />}
              colorScheme="red"
              variant="outline"
              onClick={handleDeleteAll}
            >
              Xóa tất cả thông báo
            </Button>
          </Flex>
        )}
      </VStack>
    </Container>
  );
}
