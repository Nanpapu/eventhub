import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
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
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FaChartPie,
  FaCalendarAlt,
  FaUsers,
  FaTicketAlt,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaPlus,
  FaChartLine,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import React from "react";

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
  attendeesBySource: { name: string; value: number }[];
}

// Biểu đồ cột hiển thị sự kiện theo tháng
const MonthlyEventsChart = ({
  data,
}: {
  data: { name: string; events: number }[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 });

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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="events" fill="#38B2AC" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

// Biểu đồ tròn hiển thị người tham gia theo nguồn
const AttendeesSourceChart = ({
  data,
}: {
  data: { name: string; value: number }[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 });
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

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

  // Tùy chỉnh label cho biểu đồ tròn
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
    name?: string;
  }) => {
    if (
      !cx ||
      !cy ||
      !midAngle ||
      !innerRadius ||
      !outerRadius ||
      !percent ||
      !name
    )
      return null;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (dimensions.width === 0) return <Box ref={containerRef} h="300px"></Box>;

  // Hiển thị biểu đồ tròn
  return (
    <Box ref={containerRef} h="300px">
      <ResponsiveContainer>
        <PieChart width={dimensions.width} height={dimensions.height}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

const Dashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();

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
    attendeesBySource: [
      { name: "Direct", value: 45 },
      { name: "Social Media", value: 30 },
      { name: "Email", value: 15 },
      { name: "Partners", value: 8 },
      { name: "Other", value: 2 },
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

  // Xử lý xóa sự kiện
  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);

    toast({
      title: "Event deleted",
      description: "The event has been removed successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Chuyển đến trang chỉnh sửa sự kiện
  const handleEditEvent = () => {
    toast({
      title: "Edit event",
      description: "Redirecting to edit page",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  // Màu sắc cho giao diện
  const cardBg = useColorModeValue("white", "gray.800");
  const statBg = useColorModeValue("gray.50", "gray.700");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Container maxW="7xl" py={8}>
      <Box mb={6}>
        <Heading as="h1" size="xl" mb={2}>
          Organizer Dashboard
        </Heading>
        <Text color="gray.500">Manage your events and analyze performance</Text>
      </Box>

      {/* Thống kê tổng quan */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="md">
          <Flex justify="space-between">
            <Box>
              <StatLabel fontWeight="medium">Total Events</StatLabel>
              <StatNumber>{analytics.totalEvents}</StatNumber>
              <StatHelpText>{analytics.upcomingEvents} upcoming</StatHelpText>
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
              <StatLabel fontWeight="medium">Total Attendees</StatLabel>
              <StatNumber>{analytics.totalAttendeesMonth}</StatNumber>
              <StatHelpText>
                <StatArrow
                  type={analytics.attendeesGrowth > 0 ? "increase" : "decrease"}
                />
                {Math.abs(analytics.attendeesGrowth)}% from last month
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
              <StatLabel fontWeight="medium">Total Revenue</StatLabel>
              <StatNumber>
                ${analytics.totalRevenue.toLocaleString()}
              </StatNumber>
              <StatHelpText>
                <StatArrow
                  type={analytics.revenueGrowth > 0 ? "increase" : "decrease"}
                />
                {Math.abs(analytics.revenueGrowth)}% from last month
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

        <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="md">
          <Flex justify="space-between">
            <Box>
              <StatLabel fontWeight="medium">Conversion Rate</StatLabel>
              <StatNumber>24.8%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                3.2% from last month
              </StatHelpText>
            </Box>
            <Box
              bg="purple.500"
              w="40px"
              h="40px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
            >
              <FaChartPie />
            </Box>
          </Flex>
        </Stat>
      </SimpleGrid>

      {/* Biểu đồ phân tích */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} mb={8}>
        <GridItem bg={cardBg} p={4} borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={4}>
            Events by Month
          </Heading>
          <MonthlyEventsChart data={analytics.eventsByMonth} />
        </GridItem>

        <GridItem bg={cardBg} p={4} borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={4}>
            Attendees by Source
          </Heading>
          <AttendeesSourceChart data={analytics.attendeesBySource} />
        </GridItem>
      </Grid>

      {/* Tabs cho quản lý sự kiện và người tham gia */}
      <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="md">
        <Tabs colorScheme="teal" isFitted variant="enclosed">
          <TabList mb={4}>
            <Tab fontWeight="medium">Upcoming Events</Tab>
            <Tab fontWeight="medium">Past Events</Tab>
            <Tab fontWeight="medium">Recent Attendees</Tab>
          </TabList>

          <TabPanels>
            {/* Tab sự kiện sắp tới */}
            <TabPanel p={0}>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Manage Your Upcoming Events</Heading>
                <Button
                  as={RouterLink}
                  to="/create-event"
                  colorScheme="teal"
                  leftIcon={<FaPlus />}
                  size="sm"
                >
                  Create New Event
                </Button>
              </Flex>

              {upcomingEvents.length === 0 ? (
                <Text py={4}>You don't have any upcoming events.</Text>
              ) : (
                <Table variant="simple">
                  <Thead bg={tableHeaderBg}>
                    <Tr>
                      <Th>Event</Th>
                      <Th>Date</Th>
                      <Th>Ticket Sales</Th>
                      <Th>Revenue</Th>
                      <Th>Actions</Th>
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
                                  ? "Online Event"
                                  : event.location}
                              </Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td>
                          {event.date.toLocaleDateString("en-US", {
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
                                onClick={handleEditEvent}
                              >
                                Edit Event
                              </MenuItem>
                              <MenuItem
                                icon={<FaChartLine />}
                                onClick={() =>
                                  navigate(
                                    `/organizer/events/${event.id}/analytics`
                                  )
                                }
                              >
                                View Analytics
                              </MenuItem>
                              <MenuItem
                                icon={<FaUsers />}
                                onClick={() =>
                                  navigate(
                                    `/organizer/events/${event.id}/attendees`
                                  )
                                }
                              >
                                Manage Attendees
                              </MenuItem>
                              <MenuItem
                                icon={<FaTrash />}
                                color="red.500"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                Delete Event
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
                Your Past Events
              </Heading>

              {pastEvents.length === 0 ? (
                <Text py={4}>You don't have any past events.</Text>
              ) : (
                <Table variant="simple">
                  <Thead bg={tableHeaderBg}>
                    <Tr>
                      <Th>Event</Th>
                      <Th>Date</Th>
                      <Th>Attendees</Th>
                      <Th>Revenue</Th>
                      <Th>Actions</Th>
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
                                  ? "Online Event"
                                  : event.location}
                              </Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td>
                          {event.date.toLocaleDateString("en-US", {
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
                                View Analytics
                              </MenuItem>
                              <MenuItem
                                icon={<FaUsers />}
                                onClick={() =>
                                  navigate(
                                    `/organizer/events/${event.id}/attendees`
                                  )
                                }
                              >
                                View Attendees
                              </MenuItem>
                              <MenuItem
                                icon={<FaTrash />}
                                color="red.500"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                Delete Event
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
                Recent Attendees
              </Heading>

              {attendees.length === 0 ? (
                <Text py={4}>No attendees data available.</Text>
              ) : (
                <Table variant="simple">
                  <Thead bg={tableHeaderBg}>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Ticket Type</Th>
                      <Th>Purchase Date</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {attendees.map((attendee) => (
                      <Tr key={attendee.id}>
                        <Td fontWeight="medium">{attendee.name}</Td>
                        <Td>{attendee.email}</Td>
                        <Td>{attendee.ticketType}</Td>
                        <Td>
                          {attendee.purchaseDate.toLocaleDateString("en-US", {
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
                            {attendee.status}
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
    </Container>
  );
};

export default Dashboard;
