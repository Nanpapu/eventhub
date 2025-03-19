import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  HStack,
  VStack,
  Progress,
  useColorModeValue,
  useToast,
  Link,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FaCalendarAlt,
  FaUsers,
  FaTicketAlt,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaPlus,
  FaChartLine,
  FaQrcode,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
} from "recharts";

// Định nghĩa các kiểu dữ liệu
interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  isOnline: boolean;
  imageUrl: string;
  totalTickets: number;
  soldTickets: number;
  status: "upcoming" | "ongoing" | "past" | "cancelled";
  revenue: number;
}

interface Analytics {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalAttendeesMonth: number;
  totalRevenue: number;
  revenueGrowth: number;
  attendeesGrowth: number;
  eventsByMonth: { name: string; events: number }[];
}

// Custom tooltip cho biểu đồ
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  const tooltipBg = useColorModeValue("white", "gray.800");
  const tooltipBorder = useColorModeValue("gray.200", "gray.600");
  const tooltipText = useColorModeValue("gray.800", "gray.100");

  if (active && payload && payload.length) {
    return (
      <Box
        bg={tooltipBg}
        p={2}
        boxShadow="sm"
        borderRadius="md"
        border="1px solid"
        borderColor={tooltipBorder}
      >
        <Text fontWeight="bold" color={tooltipText}>
          {label}
        </Text>
        {payload.map((entry, index) => (
          <Text
            key={`tooltip-${index}`}
            color={entry.color}
            fontWeight="medium"
          >
            {entry.name}: {entry.value}
          </Text>
        ))}
      </Box>
    );
  }
  return null;
};

// Biểu đồ cột hiển thị sự kiện theo tháng
const MonthlyEventsChart = ({
  data,
}: {
  data: { name: string; events: number }[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 });
  const chartGridColor = useColorModeValue("#e0e0e0", "#4a5568");
  const chartAxisColor = useColorModeValue("#666", "#cbd5e0");

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: 300,
      });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: 300,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (dimensions.width === 0) return <Box ref={containerRef} h="300px"></Box>;

  // Hiển thị biểu đồ cột
  return (
    <Box ref={containerRef} h="300px">
      <ResponsiveContainer>
        <BarChart
          width={dimensions.width}
          height={dimensions.height}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
          <XAxis dataKey="name" stroke={chartAxisColor} />
          <YAxis stroke={chartAxisColor} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="events" fill="#38B2AC" name="Số sự kiện" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

const Dashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  // Dữ liệu mẫu (sẽ được thay thế bằng API calls)
  const analytics: Analytics = {
    totalEvents: 12,
    upcomingEvents: 5,
    pastEvents: 7,
    totalAttendeesMonth: 345,
    totalRevenue: 4250,
    revenueGrowth: 12.5,
    attendeesGrowth: 8.3,
    eventsByMonth: [
      { name: "Jan", events: 2 },
      { name: "Feb", events: 1 },
      { name: "Mar", events: 3 },
      { name: "Apr", events: 2 },
      { name: "May", events: 1 },
      { name: "Jun", events: 0 },
      { name: "Jul", events: 1 },
      { name: "Aug", events: 0 },
      { name: "Sep", events: 1 },
      { name: "Oct", events: 0 },
      { name: "Nov", events: 1 },
      { name: "Dec", events: 0 },
    ],
  };

  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Tech Conference 2023",
      date: new Date("2023-12-15"),
      location: "Convention Center, New York",
      isOnline: false,
      imageUrl:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format",
      totalTickets: 500,
      soldTickets: 378,
      status: "upcoming",
      revenue: 18900,
    },
    {
      id: "2",
      title: "JavaScript Workshop",
      date: new Date("2023-11-20"),
      location: "https://zoom.us/j/123456789",
      isOnline: true,
      imageUrl:
        "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?w=500&auto=format",
      totalTickets: 100,
      soldTickets: 87,
      status: "upcoming",
      revenue: 2610,
    },
    {
      id: "3",
      title: "Music Festival",
      date: new Date("2023-08-10"),
      location: "Central Park, New York",
      isOnline: false,
      imageUrl:
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&auto=format",
      totalTickets: 1000,
      soldTickets: 750,
      status: "past",
      revenue: 37500,
    },
    {
      id: "4",
      title: "Data Science Meetup",
      date: new Date("2023-09-05"),
      location: "Community Center, Boston",
      isOnline: false,
      imageUrl:
        "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=500&auto=format",
      totalTickets: 150,
      soldTickets: 120,
      status: "past",
      revenue: 3600,
    },
    {
      id: "5",
      title: "Business Networking Event",
      date: new Date("2023-12-28"),
      location: "Grand Hotel, Chicago",
      isOnline: false,
      imageUrl:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&auto=format",
      totalTickets: 200,
      soldTickets: 65,
      status: "upcoming",
      revenue: 3250,
    },
  ]);

  const attendees = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      ticketType: "VIP",
      purchaseDate: new Date("2023-10-15"),
      status: "confirmed",
    },
    {
      id: "2",
      name: "Emma Johnson",
      email: "emma.j@example.com",
      ticketType: "Standard",
      purchaseDate: new Date("2023-10-18"),
      status: "confirmed",
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael.b@example.com",
      ticketType: "VIP",
      purchaseDate: new Date("2023-10-20"),
      status: "confirmed",
    },
    {
      id: "4",
      name: "Sophia Williams",
      email: "sophia.w@example.com",
      ticketType: "Standard",
      purchaseDate: new Date("2023-10-22"),
      status: "pending",
    },
    {
      id: "5",
      name: "Robert Jones",
      email: "robert.j@example.com",
      ticketType: "Standard",
      purchaseDate: new Date("2023-10-25"),
      status: "cancelled",
    },
  ];

  // Lọc sự kiện theo trạng thái
  const upcomingEvents = events.filter((event) => event.status === "upcoming");
  const pastEvents = events.filter((event) => event.status === "past");

  // Chuyển đến trang chỉnh sửa sự kiện
  const handleEditEvent = (eventId: string) => {
    // Trong thực tế, gọi API để lấy dữ liệu sự kiện để chỉnh sửa
    navigate(`/create-event?edit=${eventId}`);
    toast({
      title: "Chỉnh sửa sự kiện",
      description: "Đang tải dữ liệu sự kiện để chỉnh sửa",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  // Mở hộp thoại xác nhận khi xóa sự kiện
  const confirmDeleteEvent = (eventId: string) => {
    setEventToDelete(eventId);
    onOpen();
  };

  // Xử lý xóa sự kiện sau khi xác nhận
  const handleDeleteConfirmed = () => {
    if (!eventToDelete) return;

    const updatedEvents = events.filter((event) => event.id !== eventToDelete);
    setEvents(updatedEvents);

    toast({
      title: "Đã xóa sự kiện",
      description: "Sự kiện đã được xóa thành công",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onClose();
    setEventToDelete(null);
  };

  // Màu sắc cho giao diện
  const cardBg = useColorModeValue("white", "gray.800");
  const statBg = useColorModeValue("gray.50", "gray.700");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Container maxW="7xl" py={8}>
      <Box mb={6}>
        <Heading as="h1" size="xl" mb={2}>
          Bảng Điều Khiển Nhà Tổ Chức
        </Heading>
        <Text color="gray.500">
          Quản lý sự kiện và phân tích hiệu suất của bạn
        </Text>
      </Box>

      {/* Thống kê tổng quan */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
        <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="md">
          <Flex justify="space-between">
            <Box>
              <StatLabel fontWeight="medium">Tổng Số Sự Kiện</StatLabel>
              <StatNumber>{analytics.totalEvents}</StatNumber>
              <StatHelpText>{analytics.upcomingEvents} sắp tới</StatHelpText>
            </Box>
            <Box
              bg="teal.500"
              w="40px"
              h="40px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
            >
              <FaCalendarAlt />
            </Box>
          </Flex>
        </Stat>

        <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="md">
          <Flex justify="space-between">
            <Box>
              <StatLabel fontWeight="medium">Tổng Số Người Tham Gia</StatLabel>
              <StatNumber>{analytics.totalAttendeesMonth}</StatNumber>
              <StatHelpText>
                <StatArrow
                  type={analytics.attendeesGrowth > 0 ? "increase" : "decrease"}
                />
                {Math.abs(analytics.attendeesGrowth)}% so với tháng trước
              </StatHelpText>
            </Box>
            <Box
              bg="blue.500"
              w="40px"
              h="40px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
            >
              <FaUsers />
            </Box>
          </Flex>
        </Stat>

        <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="md">
          <Flex justify="space-between">
            <Box>
              <StatLabel fontWeight="medium">Tổng Doanh Thu</StatLabel>
              <StatNumber>
                ${analytics.totalRevenue.toLocaleString()}
              </StatNumber>
              <StatHelpText>
                <StatArrow
                  type={analytics.revenueGrowth > 0 ? "increase" : "decrease"}
                />
                {Math.abs(analytics.revenueGrowth)}% so với tháng trước
              </StatHelpText>
            </Box>
            <Box
              bg="green.500"
              w="40px"
              h="40px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
            >
              <FaTicketAlt />
            </Box>
          </Flex>
        </Stat>
      </SimpleGrid>

      {/* Biểu đồ phân tích */}
      <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="md" mb={8}>
        <Heading size="md" mb={4}>
          Số Sự Kiện Theo Tháng
        </Heading>
        <MonthlyEventsChart data={analytics.eventsByMonth} />
      </Box>

      {/* Tabs cho quản lý sự kiện và người tham gia */}
      <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="md">
        <Tabs colorScheme="teal" isFitted variant="enclosed">
          <TabList mb={4}>
            <Tab fontWeight="medium">Sự Kiện Sắp Tới</Tab>
            <Tab fontWeight="medium">Sự Kiện Đã Qua</Tab>
            <Tab fontWeight="medium">Người Tham Gia Gần Đây</Tab>
          </TabList>

          <TabPanels>
            {/* Tab sự kiện sắp tới */}
            <TabPanel p={0}>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Quản Lý Sự Kiện Sắp Tới Của Bạn</Heading>
                <Button
                  as={RouterLink}
                  to="/create-event"
                  colorScheme="teal"
                  leftIcon={<FaPlus />}
                  size="sm"
                >
                  Tạo Sự Kiện Mới
                </Button>
              </Flex>

              {upcomingEvents.length === 0 ? (
                <Text py={4}>Bạn không có sự kiện sắp tới nào.</Text>
              ) : (
                <Table variant="simple">
                  <Thead bg={tableHeaderBg}>
                    <Tr>
                      <Th>Sự Kiện</Th>
                      <Th>Ngày</Th>
                      <Th>Bán Vé</Th>
                      <Th>Doanh Thu</Th>
                      <Th>Thao Tác</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {upcomingEvents.map((event) => (
                      <Tr key={event.id}>
                        <Td>
                          <HStack>
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              boxSize="40px"
                              borderRadius="md"
                              objectFit="cover"
                            />
                            <VStack align="start" spacing={0}>
                              <Link
                                as={RouterLink}
                                to={`/events/${event.id}`}
                                fontWeight="medium"
                                _hover={{ color: "teal.500" }}
                              >
                                {event.title}
                              </Link>
                              <Text fontSize="xs" color="gray.500">
                                {event.isOnline
                                  ? "Sự Kiện Trực Tuyến"
                                  : event.location}
                              </Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td>
                          {event.date.toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Td>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text>
                              {event.soldTickets}/{event.totalTickets} (
                              {Math.round(
                                (event.soldTickets / event.totalTickets) * 100
                              )}
                              %)
                            </Text>
                            <Progress
                              value={
                                (event.soldTickets / event.totalTickets) * 100
                              }
                              size="sm"
                              colorScheme="teal"
                              w="100%"
                              borderRadius="full"
                            />
                          </VStack>
                        </Td>
                        <Td>${event.revenue.toLocaleString()}</Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<FaEllipsisV />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem
                                icon={<FaEdit />}
                                onClick={() => handleEditEvent(event.id)}
                              >
                                Chỉnh Sửa Sự Kiện
                              </MenuItem>
                              <MenuItem
                                icon={<FaChartLine />}
                                onClick={() =>
                                  navigate(
                                    `/organizer/events/${event.id}/analytics`
                                  )
                                }
                              >
                                Xem Phân Tích
                              </MenuItem>
                              <MenuItem
                                icon={<FaUsers />}
                                onClick={() =>
                                  navigate(
                                    `/organizer/events/${event.id}/attendees`
                                  )
                                }
                              >
                                Quản Lý Người Tham Gia
                              </MenuItem>
                              <MenuItem
                                icon={<FaQrcode />}
                                onClick={() =>
                                  navigate(
                                    `/organizer/events/${event.id}/check-in`
                                  )
                                }
                              >
                                Điểm Danh Người Tham Gia
                              </MenuItem>
                              <MenuItem
                                icon={<FaTrash />}
                                color="red.500"
                                onClick={() => confirmDeleteEvent(event.id)}
                              >
                                Xóa Sự Kiện
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TabPanel>

            {/* Tab sự kiện đã qua */}
            <TabPanel p={0}>
              <Heading size="md" mb={4}>
                Sự Kiện Đã Qua Của Bạn
              </Heading>

              {pastEvents.length === 0 ? (
                <Text py={4}>Bạn không có sự kiện đã qua nào.</Text>
              ) : (
                <Table variant="simple">
                  <Thead bg={tableHeaderBg}>
                    <Tr>
                      <Th>Sự Kiện</Th>
                      <Th>Ngày</Th>
                      <Th>Người Tham Gia</Th>
                      <Th>Doanh Thu</Th>
                      <Th>Thao Tác</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {pastEvents.map((event) => (
                      <Tr key={event.id}>
                        <Td>
                          <HStack>
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              boxSize="40px"
                              borderRadius="md"
                              objectFit="cover"
                            />
                            <VStack align="start" spacing={0}>
                              <Link
                                as={RouterLink}
                                to={`/events/${event.id}`}
                                fontWeight="medium"
                                _hover={{ color: "teal.500" }}
                              >
                                {event.title}
                              </Link>
                              <Text fontSize="xs" color="gray.500">
                                {event.isOnline
                                  ? "Sự Kiện Trực Tuyến"
                                  : event.location}
                              </Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td>
                          {event.date.toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Td>
                        <Td>{event.soldTickets}</Td>
                        <Td>${event.revenue.toLocaleString()}</Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<FaEllipsisV />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem
                                icon={<FaChartLine />}
                                onClick={() =>
                                  navigate(
                                    `/organizer/events/${event.id}/analytics`
                                  )
                                }
                              >
                                Xem Phân Tích
                              </MenuItem>
                              <MenuItem
                                icon={<FaUsers />}
                                onClick={() =>
                                  navigate(
                                    `/organizer/events/${event.id}/attendees`
                                  )
                                }
                              >
                                Xem Người Tham Gia
                              </MenuItem>
                              <MenuItem
                                icon={<FaTrash />}
                                color="red.500"
                                onClick={() => confirmDeleteEvent(event.id)}
                              >
                                Xóa Sự Kiện
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TabPanel>

            {/* Tab người tham gia gần đây */}
            <TabPanel p={0}>
              <Heading size="md" mb={4}>
                Người Tham Gia Gần Đây
              </Heading>

              {attendees.length === 0 ? (
                <Text py={4}>Không có dữ liệu người tham gia.</Text>
              ) : (
                <Table variant="simple">
                  <Thead bg={tableHeaderBg}>
                    <Tr>
                      <Th>Tên</Th>
                      <Th>Email</Th>
                      <Th>Loại Vé</Th>
                      <Th>Ngày Mua</Th>
                      <Th>Trạng Thái</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {attendees.map((attendee) => (
                      <Tr key={attendee.id}>
                        <Td fontWeight="medium">{attendee.name}</Td>
                        <Td>{attendee.email}</Td>
                        <Td>{attendee.ticketType}</Td>
                        <Td>
                          {attendee.purchaseDate.toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={
                              attendee.status === "confirmed"
                                ? "green"
                                : attendee.status === "cancelled"
                                ? "red"
                                : "yellow"
                            }
                            borderRadius="full"
                            px={2}
                          >
                            {attendee.status === "confirmed"
                              ? "Đã xác nhận"
                              : attendee.status === "cancelled"
                              ? "Đã hủy"
                              : "Đang chờ"}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Xác Nhận Xóa</ModalHeader>
            <ModalCloseButton />
            <ModalBody>Bạn có chắc chắn muốn xóa sự kiện này không?</ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Hủy</Button>
              <Button
                colorScheme="red"
                onClick={() => handleDeleteConfirmed()}
                ml={3}
              >
                Xóa
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
};

export default Dashboard;
