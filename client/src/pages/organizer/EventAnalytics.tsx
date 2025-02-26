import { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  HStack,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  Badge,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {
  FaChartLine,
  FaChartBar,
  FaTicketAlt,
  FaUsers,
  FaCalendarAlt,
  FaDollarSign,
  FaDownload,
  FaArrowLeft,
  FaEllipsisV,
  FaPrint,
  FaShareAlt,
  FaFilter,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Interface định nghĩa kiểu dữ liệu cho phân tích sự kiện
interface EventAnalyticsData {
  id: string;
  title: string;
  date: string;
  eventStatus: "upcoming" | "past" | "ongoing";
  totalAttendees: number;
  checkedInAttendees: number;
  totalRevenue: number;
  revenueGrowth: number;
  salesByTicketType: {
    name: string;
    value: number;
    color: string;
  }[];
  salesOverTime: {
    date: string;
    tickets: number;
    revenue: number;
  }[];
  attendeeDemographics: {
    name: string;
    value: number;
    color: string;
  }[];
  attendanceByHour: {
    hour: string;
    count: number;
  }[];
  marketingStats: {
    source: string;
    visitors: number;
    conversions: number;
    conversionRate: number;
  }[];
}

/**
 * Trang phân tích chi tiết cho một sự kiện cụ thể
 * Hiển thị các biểu đồ và số liệu thống kê về doanh thu, người tham dự, và hiệu quả marketing
 */
const EventAnalytics = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [timeRange, setTimeRange] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<EventAnalyticsData | null>(null);

  // Màu sắc cho giao diện
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const statBg = useColorModeValue("gray.50", "gray.700");

  // UI color values for hooks that were being called conditionally
  const tooltipBg = useColorModeValue("white", "gray.800");
  const tooltipBorderColor = useColorModeValue("gray.200", "gray.700");
  const tooltipTextColor = useColorModeValue("gray.800", "gray.100");
  const tooltipTextShadow = useColorModeValue(
    "none",
    "0 0 1px rgba(255,255,255,0.3)"
  );
  const dateColor = useColorModeValue("gray.500", "gray.400");
  const chartGridColor = useColorModeValue("#e0e0e0", "#4a5568");
  const chartAxisColor = useColorModeValue("#666", "#cbd5e0");
  const pieStrokeColor = useColorModeValue("white", "gray.800");
  const blueBoxBg = useColorModeValue("blue.50", "rgba(49, 130, 206, 0.1)");
  const blueTextColor = useColorModeValue("blue.700", "blue.300");
  const greenBoxBg = useColorModeValue("green.50", "rgba(56, 161, 105, 0.1)");
  const greenTextColor = useColorModeValue("green.700", "green.300");
  const redBoxBg = useColorModeValue("red.50", "rgba(229, 62, 62, 0.1)");
  const redTextColor = useColorModeValue("red.700", "red.300");

  // Giả lập dữ liệu phân tích (trong thực tế sẽ được lấy từ API)
  useEffect(() => {
    setIsLoading(true);

    // Giả lập thời gian tải dữ liệu
    setTimeout(() => {
      const mockData: EventAnalyticsData = {
        id: eventId || "1",
        title: "Tech Conference 2023",
        date: "Dec 15, 2023",
        eventStatus: "past",
        totalAttendees: 378,
        checkedInAttendees: 350,
        totalRevenue: 18900,
        revenueGrowth: 15.8,
        salesByTicketType: [
          { name: "VIP", value: 50, color: "#0088FE" },
          { name: "Early Bird", value: 150, color: "#00C49F" },
          { name: "Standard", value: 120, color: "#FFBB28" },
          { name: "Last Minute", value: 58, color: "#FF8042" },
        ],
        salesOverTime: [
          { date: "Sep 15", tickets: 15, revenue: 750 },
          { date: "Sep 30", tickets: 45, revenue: 2250 },
          { date: "Oct 15", tickets: 85, revenue: 4250 },
          { date: "Oct 30", tickets: 140, revenue: 7000 },
          { date: "Nov 15", tickets: 220, revenue: 11000 },
          { date: "Nov 30", tickets: 290, revenue: 14500 },
          { date: "Dec 10", tickets: 378, revenue: 18900 },
        ],
        attendeeDemographics: [
          { name: "18-24", value: 80, color: "#0088FE" },
          { name: "25-34", value: 140, color: "#00C49F" },
          { name: "35-44", value: 90, color: "#FFBB28" },
          { name: "45-54", value: 45, color: "#FF8042" },
          { name: "55+", value: 23, color: "#8884D8" },
        ],
        attendanceByHour: [
          { hour: "09:00", count: 45 },
          { hour: "10:00", count: 85 },
          { hour: "11:00", count: 65 },
          { hour: "12:00", count: 30 },
          { hour: "13:00", count: 40 },
          { hour: "14:00", count: 55 },
          { hour: "15:00", count: 20 },
          { hour: "16:00", count: 10 },
        ],
        marketingStats: [
          {
            source: "Email Campaign",
            visitors: 1200,
            conversions: 180,
            conversionRate: 15,
          },
          {
            source: "Social Media",
            visitors: 2500,
            conversions: 120,
            conversionRate: 4.8,
          },
          {
            source: "Partner Websites",
            visitors: 800,
            conversions: 40,
            conversionRate: 5,
          },
          {
            source: "Direct Traffic",
            visitors: 450,
            conversions: 38,
            conversionRate: 8.4,
          },
        ],
      };

      setAnalytics(mockData);
      setIsLoading(false);
    }, 800);
  }, [eventId, timeRange]);

  // Define TypeScript types for CustomTooltip props
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }

  // Render custom tooltip cho biểu đồ
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <Box
          bg={tooltipBg}
          p={3}
          boxShadow="md"
          borderRadius="md"
          border="1px solid"
          borderColor={tooltipBorderColor}
        >
          <Text fontWeight="bold" color={tooltipTextColor}>
            {label}
          </Text>
          {payload.map((entry, index) => (
            <Text
              key={`tooltip-${index}`}
              color={entry.color}
              fontWeight="medium"
              textShadow={tooltipTextShadow}
            >
              {entry.name}: {entry.value}
            </Text>
          ))}
        </Box>
      );
    }
    return null;
  };

  if (isLoading || !analytics) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <HStack>
            <Button
              as={RouterLink}
              to="/dashboard"
              leftIcon={<FaArrowLeft />}
              variant="ghost"
            >
              Quay lại Bảng điều khiển
            </Button>
          </HStack>
          <Heading>Đang tải dữ liệu phân tích...</Heading>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Breadcrumb & Header */}
        <Box>
          <Breadcrumb mb={4} fontSize="sm">
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/dashboard">
                Bảng điều khiển
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Phân tích sự kiện</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Box>
              <Heading size="lg">{analytics.title} - Phân tích</Heading>
              <HStack mt={1}>
                <Badge
                  colorScheme={
                    analytics.eventStatus === "upcoming"
                      ? "blue"
                      : analytics.eventStatus === "ongoing"
                      ? "green"
                      : "gray"
                  }
                >
                  {analytics.eventStatus.charAt(0).toUpperCase() +
                    analytics.eventStatus.slice(1)}
                </Badge>
                <Text color={dateColor}>{analytics.date}</Text>
              </HStack>
            </Box>

            <HStack>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                w="150px"
                size="sm"
              >
                <option value="all">Tất cả thời gian</option>
                <option value="month">Tháng trước</option>
                <option value="week">Tuần trước</option>
                <option value="day">Ngày trước</option>
              </Select>

              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FaEllipsisV />}
                  variant="ghost"
                  aria-label="Options"
                  size="sm"
                />
                <MenuList>
                  <MenuItem icon={<FaDownload />}>Xuất dữ liệu</MenuItem>
                  <MenuItem icon={<FaPrint />}>In báo cáo</MenuItem>
                  <MenuItem icon={<FaShareAlt />}>Chia sẻ báo cáo</MenuItem>
                  <MenuItem icon={<FaFilter />}>Bộ lọc nâng cao</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Box>

        {/* Thống kê tổng quan */}
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={6}
        >
          <GridItem>
            <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="sm">
              <Flex justify="space-between">
                <Box>
                  <StatLabel>Tổng số người tham dự</StatLabel>
                  <StatNumber>{analytics.totalAttendees}</StatNumber>
                  <StatHelpText>
                    {Math.round(
                      (analytics.checkedInAttendees /
                        analytics.totalAttendees) *
                        100
                    )}
                    % đã check-in
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
          </GridItem>

          <GridItem>
            <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="sm">
              <Flex justify="space-between">
                <Box>
                  <StatLabel>Tổng doanh thu</StatLabel>
                  <StatNumber>
                    ${analytics.totalRevenue.toLocaleString()}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {analytics.revenueGrowth}% từ dự kiến
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
                  <FaDollarSign />
                </Box>
              </Flex>
            </Stat>
          </GridItem>

          <GridItem>
            <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="sm">
              <Flex justify="space-between">
                <Box>
                  <StatLabel>Giá vé trung bình</StatLabel>
                  <StatNumber>
                    $
                    {Math.round(
                      analytics.totalRevenue / analytics.totalAttendees
                    )}
                  </StatNumber>
                  <StatHelpText>Trên mỗi người tham dự</StatHelpText>
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
                  <FaTicketAlt />
                </Box>
              </Flex>
            </Stat>
          </GridItem>

          <GridItem>
            <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="sm">
              <Flex justify="space-between">
                <Box>
                  <StatLabel>Tỷ lệ check-in</StatLabel>
                  <StatNumber>
                    {Math.round(
                      (analytics.checkedInAttendees /
                        analytics.totalAttendees) *
                        100
                    )}
                    %
                  </StatNumber>
                  <StatHelpText>
                    {analytics.checkedInAttendees} trong số{" "}
                    {analytics.totalAttendees}
                  </StatHelpText>
                </Box>
                <Box
                  bg="orange.500"
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
          </GridItem>
        </Grid>

        {/* Biểu đồ và phân tích chi tiết */}
        <Tabs colorScheme="teal" isLazy>
          <TabList>
            <Tab fontWeight="medium">
              <Box as="span" mr={2}>
                <FaChartLine />
              </Box>{" "}
              Phân tích doanh số
            </Tab>
            <Tab fontWeight="medium">
              <Box as="span" mr={2}>
                <FaUsers />
              </Box>{" "}
              Phân tích người tham dự
            </Tab>
            <Tab fontWeight="medium">
              <Box as="span" mr={2}>
                <FaChartBar />
              </Box>{" "}
              Hiệu suất tiếp thị
            </Tab>
          </TabList>

          <TabPanels>
            {/* Tab Sales Analytics */}
            <TabPanel px={0}>
              <VStack spacing={8} align="stretch">
                {/* Biểu đồ doanh thu theo thời gian */}
                <Box
                  bg={bgColor}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Heading size="md" mb={6}>
                    Doanh thu theo thời gian
                  </Heading>
                  <Box h="400px">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={analytics.salesOverTime}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={chartGridColor}
                        />
                        <XAxis dataKey="date" stroke={chartAxisColor} />
                        <YAxis stroke={chartAxisColor} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.3}
                          name="Doanh thu ($)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>

                {/* Biểu đồ doanh thu theo loại vé */}
                <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
                  <GridItem>
                    <Box
                      bg={bgColor}
                      p={6}
                      borderRadius="lg"
                      boxShadow="sm"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Heading size="md" mb={6}>
                        Doanh số theo loại vé
                      </Heading>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analytics.salesByTicketType}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {analytics.salesByTicketType.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    stroke={pieStrokeColor}
                                    strokeWidth={1}
                                  />
                                )
                              )}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                  </GridItem>

                  <GridItem>
                    <Box
                      bg={bgColor}
                      p={6}
                      borderRadius="lg"
                      boxShadow="sm"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Heading size="md" mb={6}>
                        Vé bán theo thời gian
                      </Heading>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={analytics.salesOverTime}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke={chartGridColor}
                            />
                            <XAxis dataKey="date" stroke={chartAxisColor} />
                            <YAxis stroke={chartAxisColor} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="tickets"
                              stroke="#82ca9d"
                              activeDot={{ r: 8 }}
                              name="Vé đã bán"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                  </GridItem>
                </Grid>
              </VStack>
            </TabPanel>

            {/* Tab Attendee Analytics */}
            <TabPanel px={0}>
              <VStack spacing={8} align="stretch">
                {/* Biểu đồ phân bố độ tuổi người tham dự */}
                <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
                  <GridItem>
                    <Box
                      bg={bgColor}
                      p={6}
                      borderRadius="lg"
                      boxShadow="sm"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Heading size="md" mb={6}>
                        Thông tin nhân khẩu học người tham dự
                      </Heading>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analytics.attendeeDemographics}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {analytics.attendeeDemographics.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    stroke={pieStrokeColor}
                                    strokeWidth={1}
                                  />
                                )
                              )}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                  </GridItem>

                  <GridItem>
                    <Box
                      bg={bgColor}
                      p={6}
                      borderRadius="lg"
                      boxShadow="sm"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Heading size="md" mb={6}>
                        Hoạt động check-in theo giờ
                      </Heading>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={analytics.attendanceByHour}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke={chartGridColor}
                            />
                            <XAxis dataKey="hour" stroke={chartAxisColor} />
                            <YAxis stroke={chartAxisColor} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar
                              dataKey="count"
                              name="Người tham dự"
                              fill="#8884d8"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </Box>
                  </GridItem>
                </Grid>

                {/* Thống kê chi tiết về người tham dự */}
                <Box
                  bg={bgColor}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Heading size="md" mb={6}>
                    Tóm tắt tham dự
                  </Heading>
                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                    gap={6}
                  >
                    <GridItem>
                      <VStack
                        align="center"
                        p={4}
                        bg={blueBoxBg}
                        borderRadius="md"
                      >
                        <Text fontSize="sm" color={blueTextColor}>
                          Tổng số đăng ký
                        </Text>
                        <Heading>{analytics.totalAttendees}</Heading>
                      </VStack>
                    </GridItem>
                    <GridItem>
                      <VStack
                        align="center"
                        p={4}
                        bg={greenBoxBg}
                        borderRadius="md"
                      >
                        <Text fontSize="sm" color={greenTextColor}>
                          Đã check-in
                        </Text>
                        <Heading>{analytics.checkedInAttendees}</Heading>
                      </VStack>
                    </GridItem>
                    <GridItem>
                      <VStack
                        align="center"
                        p={4}
                        bg={redBoxBg}
                        borderRadius="md"
                      >
                        <Text fontSize="sm" color={redTextColor}>
                          Không tham dự
                        </Text>
                        <Heading>
                          {analytics.totalAttendees -
                            analytics.checkedInAttendees}
                        </Heading>
                      </VStack>
                    </GridItem>
                  </Grid>
                </Box>
              </VStack>
            </TabPanel>

            {/* Tab Marketing Performance */}
            <TabPanel px={0}>
              <VStack spacing={8} align="stretch">
                <Box
                  bg={bgColor}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Heading size="md" mb={6}>
                    Hiệu suất kênh tiếp thị
                  </Heading>
                  <Box overflow="auto">
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Nguồn</Th>
                          <Th isNumeric>Lượt truy cập</Th>
                          <Th isNumeric>Chuyển đổi</Th>
                          <Th isNumeric>Tỷ lệ chuyển đổi</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {analytics.marketingStats.map((source, index) => (
                          <Tr key={index}>
                            <Td>{source.source}</Td>
                            <Td isNumeric>
                              {source.visitors.toLocaleString()}
                            </Td>
                            <Td isNumeric>{source.conversions}</Td>
                            <Td isNumeric>
                              <Badge
                                colorScheme={
                                  source.conversionRate > 10
                                    ? "green"
                                    : source.conversionRate > 5
                                    ? "blue"
                                    : "gray"
                                }
                              >
                                {source.conversionRate}%
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>

                <Box
                  bg={bgColor}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Heading size="md" mb={6}>
                    Chuyển đổi theo kênh
                  </Heading>
                  <Box h="400px">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analytics.marketingStats}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={chartGridColor}
                        />
                        <XAxis dataKey="source" stroke={chartAxisColor} />
                        <YAxis stroke={chartAxisColor} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                          dataKey="visitors"
                          name="Lượt truy cập"
                          fill="#8884d8"
                        />
                        <Bar
                          dataKey="conversions"
                          name="Chuyển đổi"
                          fill="#82ca9d"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default EventAnalytics;
