import {
  Box,
  Container,
  Heading,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
  Flex,
  Avatar,
  VStack,
  HStack,
  Badge,
  Divider,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FiUser, FiCalendar, FiCreditCard, FiSettings } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import EventManagement from "../../components/user/EventManagement";
import MyTickets from "../../components/user/MyTickets";
import UserSettings from "../../components/user/UserSettings";

/**
 * Trang tài khoản người dùng tích hợp - gộp từ các trang Sự kiện của tôi,
 * Sự kiện đã lưu và Vé của tôi thành một trang duy nhất với các tab
 */
const UserDashboard = () => {
  // State để theo dõi tab đang được chọn
  const [tabIndex, setTabIndex] = useState(0);

  // Sử dụng React Router để xử lý URL và điều hướng
  const navigate = useNavigate();
  const location = useLocation();

  // Màu sắc theo theme
  const bgColor = useColorModeValue("white", "gray.900");
  const headerBg = useColorModeValue("gray.50", "gray.800");
  const tabBg = useColorModeValue("white", "gray.800");
  const activeBg = useColorModeValue("teal.50", "teal.900");
  const activeColor = useColorModeValue("teal.600", "teal.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

  // Dữ liệu người dùng mẫu (sau này sẽ được lấy từ API)
  const userData = {
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    createdEvents: 5,
    savedEvents: 12,
    tickets: 8,
  };

  // Xử lý thay đổi tab
  const handleTabChange = (index: number) => {
    setTabIndex(index);

    // Cập nhật URL dựa vào tab được chọn
    const tabPaths = ["profile", "events", "tickets", "settings"];
    navigate(`/user/${tabPaths[index]}`, { replace: true });
  };

  // Cập nhật tab dựa vào URL khi component được tải
  useEffect(() => {
    const path = location.pathname.split("/").pop() || "";
    const tabPaths = ["profile", "events", "tickets", "settings"];
    const index = tabPaths.indexOf(path);

    if (index !== -1) {
      setTabIndex(index);
    } else {
      // Mặc định sẽ hiển thị tab profile nếu URL không khớp
      setTabIndex(0);
    }
  }, [location.pathname]);

  return (
    <Box bg={bgColor} minH="calc(100vh - 80px)">
      <Container maxW="container.xl" py={8}>
        {/* Header với thông tin người dùng */}
        <Box
          mb={6}
          p={6}
          bg={headerBg}
          borderRadius="lg"
          boxShadow="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "center", md: "start" }}
          >
            <Avatar
              src={userData.avatar}
              size="xl"
              mr={{ base: 0, md: 6 }}
              mb={{ base: 4, md: 0 }}
            />

            <Box flex="1">
              <Heading as="h1" size="lg" color={textColor}>
                {userData.name}
              </Heading>
              <Text color={secondaryTextColor} mb={4}>
                {userData.email}
              </Text>

              <HStack spacing={4} flexWrap="wrap">
                <Badge colorScheme="teal" p={2} borderRadius="md">
                  {userData.createdEvents} sự kiện đã tạo
                </Badge>
                <Badge colorScheme="purple" p={2} borderRadius="md">
                  {userData.savedEvents} sự kiện đã lưu
                </Badge>
                <Badge colorScheme="blue" p={2} borderRadius="md">
                  {userData.tickets} vé đã mua
                </Badge>
              </HStack>
            </Box>

            <Button
              colorScheme="teal"
              variant="outline"
              mt={{ base: 4, md: 0 }}
              alignSelf={{ base: "center", md: "start" }}
            >
              Chỉnh sửa
            </Button>
          </Flex>
        </Box>

        {/* Tabs */}
        <Tabs
          index={tabIndex}
          onChange={handleTabChange}
          variant="enclosed"
          colorScheme="teal"
          isLazy
        >
          <TabList mb={6}>
            <Tab
              fontWeight="semibold"
              _selected={{ color: activeColor, bg: activeBg }}
            >
              <FiUser style={{ marginRight: "8px" }} /> Thông tin cá nhân
            </Tab>
            <Tab
              fontWeight="semibold"
              _selected={{ color: activeColor, bg: activeBg }}
            >
              <FiCalendar style={{ marginRight: "8px" }} /> Sự kiện
            </Tab>
            <Tab
              fontWeight="semibold"
              _selected={{ color: activeColor, bg: activeBg }}
            >
              <FiCreditCard style={{ marginRight: "8px" }} /> Vé của tôi
            </Tab>
            <Tab
              fontWeight="semibold"
              _selected={{ color: activeColor, bg: activeBg }}
            >
              <FiSettings style={{ marginRight: "8px" }} /> Cài đặt
            </Tab>
          </TabList>

          <TabPanels>
            {/* Tab nội dung: Thông tin cá nhân */}
            <TabPanel>
              <Box
                bg={tabBg}
                p={6}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Heading as="h2" size="md" mb={4}>
                  Thông tin cá nhân
                </Heading>
                <Divider mb={4} />

                <VStack spacing={4} align="start">
                  <Box>
                    <Text fontWeight="bold" mb={1}>
                      Họ và tên
                    </Text>
                    <Text>{userData.name}</Text>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={1}>
                      Email
                    </Text>
                    <Text>{userData.email}</Text>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={1}>
                      Số điện thoại
                    </Text>
                    <Text>+84 123 456 789</Text>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={1}>
                      Ngày tham gia
                    </Text>
                    <Text>01/01/2023</Text>
                  </Box>
                </VStack>
              </Box>
            </TabPanel>

            {/* Tab nội dung: Sự kiện */}
            <TabPanel p={0}>
              <EventManagement />
            </TabPanel>

            {/* Tab nội dung: Vé của tôi */}
            <TabPanel p={0}>
              <MyTickets />
            </TabPanel>

            {/* Tab nội dung: Cài đặt */}
            <TabPanel p={0}>
              <UserSettings />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};

export default UserDashboard;
