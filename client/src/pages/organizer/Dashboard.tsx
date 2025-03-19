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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
  Tooltip,
  Badge,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FaCalendarAlt,
  FaUsers,
  FaTicketAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaChartLine,
  FaUndo,
  FaQrcode,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
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
  const labelColor = useColorModeValue("#2D3748", "#E2E8F0");

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
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
          <XAxis dataKey="name" stroke={chartAxisColor} />
          <YAxis
            stroke={chartAxisColor}
            allowDecimals={false}
            domain={[0, "dataMax + 1"]}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          <Bar
            dataKey="events"
            fill="#38B2AC"
            name="Số sự kiện"
            label={{
              position: "top",
              fill: labelColor,
              formatter: (value: number) => (value > 0 ? value : ""),
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

const Dashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventToCancel, setEventToCancel] = useState<string | null>(null);

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
      { name: "Feb", events: 3 },
      { name: "Mar", events: 5 },
      { name: "Apr", events: 4 },
      { name: "May", events: 2 },
      { name: "Jun", events: 1 },
      { name: "Jul", events: 3 },
      { name: "Aug", events: 2 },
      { name: "Sep", events: 4 },
      { name: "Oct", events: 6 },
      { name: "Nov", events: 3 },
      { name: "Dec", events: 1 },
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
      status: "ongoing",
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
        "https://images.unsplash.com/photo-1551818255-5973dc0f32e7?w=500&auto=format",
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
    {
      id: "6",
      title: "AI Conference",
      date: new Date("2023-10-15"),
      location: "Tech Hub, San Francisco",
      isOnline: false,
      imageUrl:
        "https://images.unsplash.com/photo-1591115765373-5207764f72e4?w=500&auto=format",
      totalTickets: 300,
      soldTickets: 245,
      status: "ongoing",
      revenue: 12250,
    },
    {
      id: "7",
      title: "Webinar Marketing Digital",
      date: new Date("2023-11-05"),
      location: "https://zoom.us/j/987654321",
      isOnline: true,
      imageUrl:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format",
      totalTickets: 150,
      soldTickets: 110,
      status: "cancelled",
      revenue: 2200,
    },
  ]);

  // Lọc sự kiện theo trạng thái
  const upcomingEvents = events.filter((event) => event.status === "upcoming");
  const ongoingEvents = events.filter((event) => event.status === "ongoing");
  const pastEvents = events.filter((event) => event.status === "past");
  const cancelledEvents = events.filter(
    (event) => event.status === "cancelled"
  );

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

  // Mở hộp thoại xác nhận khi hủy sự kiện
  const confirmCancelEvent = (eventId: string) => {
    setEventToCancel(eventId);
    onOpen();
  };

  // Xử lý hủy sự kiện sau khi xác nhận
  const handleCancelConfirmed = () => {
    if (!eventToCancel) return;

    // Thay vì xóa, cập nhật trạng thái thành "cancelled"
    const updatedEvents = events.map((event) =>
      event.id === eventToCancel
        ? { ...event, status: "cancelled" as const }
        : event
    );
    setEvents(updatedEvents);

    toast({
      title: "Đã hủy sự kiện",
      description:
        "Sự kiện đã được hủy thành công. Người đăng ký sẽ được thông báo.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onClose();
    setEventToCancel(null);
  };

  // Khôi phục sự kiện đã hủy
  const handleRestoreEvent = (eventId: string) => {
    const updatedEvents = events.map((event) =>
      event.id === eventId ? { ...event, status: "upcoming" as const } : event
    );
    setEvents(updatedEvents);

    toast({
      title: "Đã khôi phục sự kiện",
      description:
        "Sự kiện đã được khôi phục thành công và hiển thị lại trong mục sự kiện sắp tới.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Màu sắc cho giao diện
  const cardBg = useColorModeValue("white", "gray.800");
  const statBg = useColorModeValue("gray.50", "gray.700");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");
  const cancelBtnBg = useColorModeValue("red.50", "red.900");
  const cancelBtnColor = useColorModeValue("red.600", "red.200");
  const cancelBtnHoverBg = useColorModeValue("red.100", "red.800");

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

      {/* Tabs cho quản lý sự kiện */}
      <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="md">
        <Tabs colorScheme="teal" isFitted variant="enclosed">
          <TabList mb={4}>
            <Tab fontWeight="medium">Sự Kiện Sắp Tới</Tab>
            <Tab fontWeight="medium">Sự Kiện Đang Diễn Ra</Tab>
            <Tab fontWeight="medium">Sự Kiện Đã Qua</Tab>
            <Tab fontWeight="medium">Sự Kiện Đã Hủy</Tab>
          </TabList>

          <TabPanels>
            {/* Tab sự kiện sắp tới */}
            <TabPanel p={0}>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Sự Kiện Sắp Tới Của Bạn</Heading>
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
                          <HStack spacing={1}>
                            <Tooltip label="Chỉnh sửa sự kiện">
                              <IconButton
                                aria-label="Chỉnh sửa"
                                icon={<FaEdit />}
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => handleEditEvent(event.id)}
                              />
                            </Tooltip>
                            <Tooltip label="Hủy sự kiện">
                              <IconButton
                                aria-label="Hủy sự kiện"
                                icon={<FaTrash />}
                                size="sm"
                                bg={cancelBtnBg}
                                color={cancelBtnColor}
                                _hover={{
                                  bg: cancelBtnHoverBg,
                                }}
                                onClick={() => confirmCancelEvent(event.id)}
                              />
                            </Tooltip>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TabPanel>

            {/* Tab sự kiện đang diễn ra */}
            <TabPanel p={0}>
              <Heading size="md" mb={4}>
                Sự Kiện Đang Diễn Ra Của Bạn
              </Heading>

              {ongoingEvents.length === 0 ? (
                <Text py={4}>Bạn không có sự kiện đang diễn ra nào.</Text>
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
                    {ongoingEvents.map((event) => (
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
                              <Flex align="center">
                                <Link
                                  as={RouterLink}
                                  to={`/events/${event.id}`}
                                  fontWeight="medium"
                                  _hover={{ color: "teal.500" }}
                                  mr={2}
                                >
                                  {event.title}
                                </Link>
                                <Badge colorScheme="green" fontSize="2xs">
                                  Đang diễn ra
                                </Badge>
                              </Flex>
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
                          <HStack spacing={1}>
                            <Tooltip label="Điểm danh người tham gia">
                              <IconButton
                                aria-label="Điểm danh"
                                icon={<FaQrcode />}
                                size="sm"
                                variant="ghost"
                                colorScheme="teal"
                                onClick={() =>
                                  navigate(
                                    `/organizer/events/${event.id}/check-in`
                                  )
                                }
                              />
                            </Tooltip>
                            <Tooltip label="Xem phân tích">
                              <IconButton
                                aria-label="Phân tích"
                                icon={<FaChartLine />}
                                size="sm"
                                variant="ghost"
                                colorScheme="green"
                                onClick={() =>
                                  navigate(
                                    `/organizer/events/${event.id}/analytics`
                                  )
                                }
                              />
                            </Tooltip>
                            <Tooltip label="Quản lý người tham gia">
                              <IconButton
                                aria-label="Người tham gia"
                                icon={<FaUsers />}
                                size="sm"
                                variant="ghost"
                                colorScheme="purple"
                                onClick={() =>
                                  navigate(
                                    `/organizer/events/${event.id}/attendees`
                                  )
                                }
                              />
                            </Tooltip>
                          </HStack>
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
                              <Flex align="center">
                                <Link
                                  as={RouterLink}
                                  to={`/events/${event.id}`}
                                  fontWeight="medium"
                                  _hover={{ color: "teal.500" }}
                                  mr={2}
                                >
                                  {event.title}
                                </Link>
                                <Badge colorScheme="gray" fontSize="2xs">
                                  Đã kết thúc
                                </Badge>
                              </Flex>
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
                          <HStack spacing={1}>
                            <Tooltip label="Xem phân tích">
                              <IconButton
                                aria-label="Phân tích"
                                icon={<FaChartLine />}
                                size="sm"
                                variant="ghost"
                                colorScheme="green"
                                onClick={() =>
                                  navigate(
                                    `/organizer/events/${event.id}/analytics`
                                  )
                                }
                              />
                            </Tooltip>
                            <Tooltip label="Xem người tham gia">
                              <IconButton
                                aria-label="Người tham gia"
                                icon={<FaUsers />}
                                size="sm"
                                variant="ghost"
                                colorScheme="purple"
                                onClick={() =>
                                  navigate(
                                    `/organizer/events/${event.id}/attendees`
                                  )
                                }
                              />
                            </Tooltip>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TabPanel>

            {/* Tab sự kiện đã hủy */}
            <TabPanel p={0}>
              <Heading size="md" mb={4}>
                Sự Kiện Đã Hủy
              </Heading>

              {cancelledEvents.length === 0 ? (
                <Text py={4}>Bạn không có sự kiện đã hủy nào.</Text>
              ) : (
                <Table variant="simple">
                  <Thead bg={tableHeaderBg}>
                    <Tr>
                      <Th>Sự Kiện</Th>
                      <Th>Ngày</Th>
                      <Th>Đã Bán</Th>
                      <Th>Doanh Thu</Th>
                      <Th>Thao Tác</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {cancelledEvents.map((event) => (
                      <Tr key={event.id} opacity={0.7}>
                        <Td>
                          <HStack>
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              boxSize="40px"
                              borderRadius="md"
                              objectFit="cover"
                              opacity={0.6}
                            />
                            <VStack align="start" spacing={0}>
                              <Flex align="center">
                                <Text fontWeight="medium" mr={2}>
                                  {event.title}
                                </Text>
                                <Badge colorScheme="red">Đã hủy</Badge>
                              </Flex>
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
                          <HStack spacing={1}>
                            <Tooltip label="Khôi phục sự kiện">
                              <IconButton
                                aria-label="Khôi phục sự kiện"
                                icon={<FaUndo />}
                                size="sm"
                                variant="solid"
                                colorScheme="blue"
                                onClick={() => handleRestoreEvent(event.id)}
                              />
                            </Tooltip>
                            <Tooltip label="Xem người tham gia">
                              <IconButton
                                aria-label="Người tham gia"
                                icon={<FaUsers />}
                                size="sm"
                                variant="ghost"
                                colorScheme="purple"
                                onClick={() =>
                                  navigate(
                                    `/organizer/events/${event.id}/attendees`
                                  )
                                }
                              />
                            </Tooltip>
                          </HStack>
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

      {/* Modal xác nhận hủy sự kiện */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Xác Nhận Hủy Sự Kiện</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Bạn có chắc chắn muốn hủy sự kiện này không?</Text>
              <Text mt={2} fontSize="sm" color="gray.500">
                Sự kiện sẽ được đánh dấu là đã hủy và tất cả người đăng ký sẽ
                được thông báo. Dữ liệu sự kiện vẫn được giữ lại trong hệ thống.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Đóng</Button>
              <Button
                colorScheme="red"
                onClick={() => handleCancelConfirmed()}
                ml={3}
              >
                Hủy Sự Kiện
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
};

export default Dashboard;
