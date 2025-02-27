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
} from "react-icons/fi";
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

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

  // Dữ liệu người dùng mẫu (sau này sẽ được lấy từ API)
  const userData = {
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    createdEvents: 5,
    savedEvents: 12,
    tickets: 8,
    phone: "0901234567",
    location: "TP. Hồ Chí Minh, Việt Nam",
    joinDate: "01/01/2023",
  };

  // Khởi tạo form data từ user data
  useEffect(() => {
    setFormData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
      bio: "",
    });
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trong thực tế sẽ gọi API để cập nhật thông tin người dùng
    toast({
      title: "Thông tin đã cập nhật",
      description: "Thông tin cá nhân của bạn đã được cập nhật thành công.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onClose();
  };

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
                        <Text>{userData.name}</Text>
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
                        <Text>{userData.email}</Text>
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
                        <Text>{userData.phone}</Text>
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
                        <Text>{userData.location}</Text>
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
                        <Text>{userData.joinDate}</Text>
                      </Flex>
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
                    />
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
