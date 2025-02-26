import { useState } from "react";
import {
  Container,
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Button,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Text,
  Flex,
  Divider,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { FiFilter, FiCheck, FiTrash2, FiMoreVertical } from "react-icons/fi";
import NotificationList, {
  NotificationType,
} from "../../components/notification/NotificationList";

/**
 * Trang hiển thị tất cả thông báo của người dùng
 * Cho phép người dùng xem, lọc, đánh dấu và xóa các thông báo
 */
const Notifications = () => {
  const [selectedFilter, setSelectedFilter] = useState<
    NotificationType | "all"
  >("all");
  const [tabIndex, setTabIndex] = useState(0);
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Xử lý đánh dấu tất cả là đã đọc
  const handleMarkAllAsRead = () => {
    toast({
      title: "All notifications marked as read",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Xử lý xóa tất cả thông báo
  const handleClearAll = () => {
    toast({
      title: "All notifications cleared",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Xử lý khi chọn loại thông báo
  const handleFilterSelect = (type: NotificationType | "all") => {
    setSelectedFilter(type);
    toast({
      title: `Filtered by ${type === "all" ? "All" : type.replace("_", " ")}`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  // Các props cần truyền vào NotificationList dựa trên tab hiện tại
  const getNotificationProps = () => {
    // filterType sẽ được sử dụng để lọc thông báo theo loại
    // readStatus sẽ được sử dụng để lọc thông báo theo trạng thái đã đọc
    const props = {
      filterType: selectedFilter,
      readStatus: "all",
      showViewAllButton: false,
      isHeaderVisible: false,
    };

    if (tabIndex === 1) {
      // Tab "Unread"
      props.readStatus = "unread";
    } else if (tabIndex === 2) {
      // Tab "Read"
      props.readStatus = "read";
    }

    return props;
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Box mb={6}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading as="h1" size="xl" mb={2}>
              Notifications
            </Heading>
            <Text color="gray.500">
              Stay updated with all your event activities
            </Text>
          </Box>

          <HStack spacing={2}>
            <Button
              leftIcon={<FiCheck />}
              variant="outline"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>

            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<FiMoreVertical />}
                variant="outline"
              />
              <MenuList>
                <MenuItem icon={<FiTrash2 />} onClick={handleClearAll}>
                  Clear all notifications
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>

      <Box
        bg={bgColor}
        borderRadius="lg"
        boxShadow="md"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
      >
        <Tabs
          colorScheme="teal"
          onChange={(index) => {
            setTabIndex(index);
          }}
          isLazy
        >
          <TabList px={4} pt={4}>
            <Tab>
              <HStack>
                <Text>All</Text>
                <Badge borderRadius="full" px={2} colorScheme="gray">
                  6
                </Badge>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <Text>Unread</Text>
                <Badge borderRadius="full" px={2} colorScheme="teal">
                  3
                </Badge>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <Text>Read</Text>
                <Badge borderRadius="full" px={2} colorScheme="gray">
                  3
                </Badge>
              </HStack>
            </Tab>

            <Box ml="auto">
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<FiFilter />}
                  variant="ghost"
                  size="sm"
                >
                  Filter:{" "}
                  {selectedFilter === "all"
                    ? "All Types"
                    : selectedFilter.replace("_", " ")}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => handleFilterSelect("all")}>
                    All Types
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleFilterSelect("event_reminder")}
                  >
                    Event Reminders
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleFilterSelect("ticket_confirmation")}
                  >
                    Ticket Confirmations
                  </MenuItem>
                  <MenuItem onClick={() => handleFilterSelect("event_update")}>
                    Event Updates
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleFilterSelect("system_message")}
                  >
                    System Messages
                  </MenuItem>
                  <MenuItem onClick={() => handleFilterSelect("event_invite")}>
                    Event Invitations
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </TabList>

          <Divider mt={4} />

          <TabPanels>
            <TabPanel p={0}>
              <NotificationList {...getNotificationProps()} />
            </TabPanel>
            <TabPanel p={0}>
              <NotificationList {...getNotificationProps()} />
            </TabPanel>
            <TabPanel p={0}>
              <NotificationList {...getNotificationProps()} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Notifications;
