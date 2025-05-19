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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Grid,
  GridItem,
  Icon,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  FiUser,
  FiCalendar,
  FiCreditCard,
  FiSettings,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar as FiDateJoin,
  FiEdit,
  FiAlertCircle,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import EventManagement from "../../components/user/EventManagement";
import MyTickets from "../../components/user/MyTickets";
import UserSettings from "../../components/user/UserSettings";
import authService from "../../services/auth.service";

// Interface for API error responses
interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

// Interface for user data
interface UserData {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  phone?: string;
  location?: string;
  bio?: string;
  joinDate?: string; // Ngày tham gia (có thể được lấy từ createdAt)
}

/**
 * Trang tài khoản người dùng tích hợp - gộp từ các trang Sự kiện của tôi,
 * Sự kiện đã lưu và Vé của tôi thành một trang duy nhất với các tab
 */
const UserDashboard = () => {
  // State để theo dõi tab đang được chọn
  const [tabIndex, setTabIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho thống kê
  const [stats, setStats] = useState({
    createdEvents: 0,
    savedEvents: 0,
    tickets: 0,
  });

  // Form state
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

  // State cho user data
  const [userData, setUserData] = useState<UserData | null>(null);

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
  const highlightBg = useColorModeValue("gray.50", "gray.700");
  const iconColor = useColorModeValue("teal.500", "teal.300");
  const errorColor = useColorModeValue("red.500", "red.300");

  // Fetch thông tin người dùng từ API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy thông tin người dùng từ API
        const user = await authService.getCurrentUser();

        if (!user) {
          setError("Không thể tải thông tin người dùng");
          return;
        }

        // Parse ngày tham gia từ ID MongoDB hoặc từ createdAt nếu có
        let joinDate = "Không xác định";
        if (user.createdAt) {
          joinDate = new Date(user.createdAt).toLocaleDateString("vi-VN");
        } else if (user.id) {
          // MongoDB ObjectIDs chứa timestamp trong 4 byte đầu tiên
          // Nhưng vì frontend không có cách truy cập trực tiếp, ta chỉ hiển thị "Không xác định"
        }

        // Format lại dữ liệu người dùng
        const formattedUser: UserData = {
          id: user.id,
          name: user.name || "Người dùng",
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          phone: user.phone || "",
          location: user.location || "",
          bio: user.bio || "",
          joinDate,
        };

        // Giả lập số lượng thống kê (sau này sẽ lấy từ API)
        // Trong thực tế, bạn sẽ gọi API để lấy số liệu thống kê này
        setStats({
          createdEvents: 5, // Sẽ lấy từ API
          savedEvents: 12, // Sẽ lấy từ API
          tickets: 8, // Sẽ lấy từ API
        });

        setUserData(formattedUser);
        setFormData(formattedUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Có lỗi xảy ra khi tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

  // Xử lý thay đổi form input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Gọi API để cập nhật thông tin người dùng
      await authService.updateProfile({
        name: formData.name,
        bio: formData.bio,
        phone: formData.phone,
        location: formData.location,
        // Các trường khác như avatar có thể cần một quy trình riêng (ví dụ: upload file)
      });

      // Cập nhật userData state với dữ liệu mới
      if (userData) {
        setUserData({
          ...userData,
          name: formData.name,
          bio: formData.bio,
          phone: formData.phone,
          location: formData.location,
        });
      }

      // Hiển thị thông báo thành công
      toast({
        title: "Thông tin đã cập nhật",
        description: "Thông tin cá nhân của bạn đã được cập nhật thành công.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      const apiError = error as ApiErrorResponse;
      const errorMessage =
        apiError?.response?.data?.message ||
        "Đã xảy ra lỗi khi cập nhật thông tin";

      toast({
        title: "Cập nhật thất bại",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Hiển thị loading state
  if (loading) {
    return (
      <Box bg={bgColor} minH="calc(100vh - 80px)">
        <Container maxW="container.xl" py={8}>
          <Flex justify="center" align="center" minH="60vh">
            <Spinner size="xl" color="teal.500" thickness="4px" />
          </Flex>
        </Container>
      </Box>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <Box bg={bgColor} minH="calc(100vh - 80px)">
        <Container maxW="container.xl" py={8}>
          <Flex direction="column" justify="center" align="center" minH="60vh">
            <Icon as={FiAlertCircle} boxSize={16} color={errorColor} mb={4} />
            <Heading size="lg" mb={4} color={errorColor}>
              {error}
            </Heading>
            <Button colorScheme="teal" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </Flex>
        </Container>
      </Box>
    );
  }

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
              src={userData?.avatar}
              name={userData?.name}
              size="xl"
              mr={{ base: 0, md: 6 }}
              mb={{ base: 4, md: 0 }}
            />

            <Box flex="1">
              <Heading as="h1" size="lg" color={textColor}>
                {userData?.name}
              </Heading>
              <Text color={secondaryTextColor} mb={4}>
                {userData?.email}
              </Text>

              <HStack spacing={4} flexWrap="wrap">
                <Badge colorScheme="teal" p={2} borderRadius="md">
                  {stats.createdEvents} sự kiện đã tạo
                </Badge>
                <Badge colorScheme="purple" p={2} borderRadius="md">
                  {stats.savedEvents} sự kiện đã lưu
                </Badge>
                <Badge colorScheme="blue" p={2} borderRadius="md">
                  {stats.tickets} vé đã mua
                </Badge>
              </HStack>
            </Box>
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
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading as="h2" size="md" color={textColor}>
                    Thông tin cá nhân
                  </Heading>
                  <Button
                    size="sm"
                    colorScheme="teal"
                    variant="outline"
                    leftIcon={<FiEdit />}
                    onClick={onOpen}
                  >
                    Chỉnh sửa
                  </Button>
                </Flex>
                <Divider mb={6} />

                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={6}
                >
                  <GridItem>
                    <VStack align="start" spacing={4}>
                      <Flex
                        direction="column"
                        p={4}
                        bg={highlightBg}
                        borderRadius="md"
                        w="100%"
                      >
                        <Flex align="center" mb={2}>
                          <Icon as={FiUser} color={iconColor} mr={2} />
                          <Text fontWeight="bold">Họ và tên</Text>
                        </Flex>
                        <Text>{userData?.name}</Text>
                      </Flex>

                      <Flex
                        direction="column"
                        p={4}
                        bg={highlightBg}
                        borderRadius="md"
                        w="100%"
                      >
                        <Flex align="center" mb={2}>
                          <Icon as={FiMail} color={iconColor} mr={2} />
                          <Text fontWeight="bold">Email</Text>
                        </Flex>
                        <Text>{userData?.email}</Text>
                      </Flex>

                      <Flex
                        direction="column"
                        p={4}
                        bg={highlightBg}
                        borderRadius="md"
                        w="100%"
                      >
                        <Flex align="center" mb={2}>
                          <Icon as={FiPhone} color={iconColor} mr={2} />
                          <Text fontWeight="bold">Số điện thoại</Text>
                        </Flex>
                        <Text>{userData?.phone || "Chưa cập nhật"}</Text>
                      </Flex>
                    </VStack>
                  </GridItem>

                  <GridItem>
                    <VStack align="start" spacing={4}>
                      <Flex
                        direction="column"
                        p={4}
                        bg={highlightBg}
                        borderRadius="md"
                        w="100%"
                      >
                        <Flex align="center" mb={2}>
                          <Icon as={FiMapPin} color={iconColor} mr={2} />
                          <Text fontWeight="bold">Địa chỉ</Text>
                        </Flex>
                        <Text>{userData?.location || "Chưa cập nhật"}</Text>
                      </Flex>

                      <Flex
                        direction="column"
                        p={4}
                        bg={highlightBg}
                        borderRadius="md"
                        w="100%"
                      >
                        <Flex align="center" mb={2}>
                          <Icon as={FiDateJoin} color={iconColor} mr={2} />
                          <Text fontWeight="bold">Ngày tham gia</Text>
                        </Flex>
                        <Text>{userData?.joinDate || "Không xác định"}</Text>
                      </Flex>

                      {userData?.bio && (
                        <Flex
                          direction="column"
                          p={4}
                          bg={highlightBg}
                          borderRadius="md"
                          w="100%"
                        >
                          <Flex align="center" mb={2}>
                            <Icon as={FiUser} color={iconColor} mr={2} />
                            <Text fontWeight="bold">Giới thiệu</Text>
                          </Flex>
                          <Text>{userData?.bio}</Text>
                        </Flex>
                      )}
                    </VStack>
                  </GridItem>
                </Grid>
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

        {/* Modal chỉnh sửa thông tin cá nhân */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Chỉnh sửa thông tin cá nhân</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl id="name" isRequired>
                    <FormLabel>Họ và tên</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl id="email" isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      readOnly
                      disabled
                    />
                    <Text fontSize="sm" color="gray.500">
                      Email không thể thay đổi
                    </Text>
                  </FormControl>

                  <FormControl id="phone">
                    <FormLabel>Số điện thoại</FormLabel>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl id="location">
                    <FormLabel>Địa chỉ</FormLabel>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl id="bio">
                    <FormLabel>Giới thiệu</FormLabel>
                    <Textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </FormControl>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Hủy
                </Button>
                <Button colorScheme="teal" type="submit">
                  Lưu thay đổi
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default UserDashboard;
