import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  Heading,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  InputGroup,
  InputLeftElement,
  Stack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  SimpleGrid,
} from "@chakra-ui/react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaFileExport,
  FaEnvelope,
  FaEllipsisV,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronRight,
  FaDownload,
} from "react-icons/fa";

// Định nghĩa kiểu dữ liệu cho người tham dự
interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  ticketType: string;
  ticketPrice: number;
  purchaseDate: Date;
  checkInStatus: boolean;
  checkInTime?: Date;
  status: "confirmed" | "cancelled" | "pending";
}

// Định nghĩa kiểu dữ liệu cho sự kiện
interface Event {
  id: string;
  title: string;
  date: Date;
  totalTickets: number;
  soldTickets: number;
}

const EventAttendees = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(
    null
  );

  // State cho tìm kiếm và lọc
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTicketType, setFilterTicketType] = useState<string>("all");

  // Mô phỏng việc tải dữ liệu sự kiện
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState<Event | null>(null);

  // Mô phỏng danh sách người tham dự
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  // Tải dữ liệu giả lập
  useEffect(() => {
    // Mô phỏng API call
    setTimeout(() => {
      const mockEvent: Event = {
        id: eventId || "1",
        title: "Tech Conference 2023",
        date: new Date("2023-12-15"),
        totalTickets: 500,
        soldTickets: 378,
      };

      const mockAttendees: Attendee[] = [
        {
          id: "1",
          name: "John Smith",
          email: "john.smith@example.com",
          phone: "+1 (555) 123-4567",
          ticketType: "VIP",
          ticketPrice: 99.99,
          purchaseDate: new Date("2023-10-15"),
          checkInStatus: true,
          checkInTime: new Date("2023-12-15T09:15:00"),
          status: "confirmed",
        },
        {
          id: "2",
          name: "Emma Johnson",
          email: "emma.j@example.com",
          phone: "+1 (555) 987-6543",
          ticketType: "Standard",
          ticketPrice: 49.99,
          purchaseDate: new Date("2023-10-18"),
          checkInStatus: false,
          status: "confirmed",
        },
        {
          id: "3",
          name: "Michael Brown",
          email: "michael.b@example.com",
          ticketType: "VIP",
          ticketPrice: 99.99,
          purchaseDate: new Date("2023-10-20"),
          checkInStatus: true,
          checkInTime: new Date("2023-12-15T09:30:00"),
          status: "confirmed",
        },
        {
          id: "4",
          name: "Sophia Williams",
          email: "sophia.w@example.com",
          phone: "+1 (555) 222-3333",
          ticketType: "Standard",
          ticketPrice: 49.99,
          purchaseDate: new Date("2023-10-22"),
          checkInStatus: false,
          status: "pending",
        },
        {
          id: "5",
          name: "Robert Jones",
          email: "robert.j@example.com",
          ticketType: "Standard",
          ticketPrice: 49.99,
          purchaseDate: new Date("2023-10-25"),
          checkInStatus: false,
          status: "cancelled",
        },
        {
          id: "6",
          name: "Olivia Davis",
          email: "olivia.d@example.com",
          phone: "+1 (555) 444-5555",
          ticketType: "VIP",
          ticketPrice: 99.99,
          purchaseDate: new Date("2023-11-01"),
          checkInStatus: true,
          checkInTime: new Date("2023-12-15T08:45:00"),
          status: "confirmed",
        },
        {
          id: "7",
          name: "William Miller",
          email: "william.m@example.com",
          ticketType: "Standard",
          ticketPrice: 49.99,
          purchaseDate: new Date("2023-11-05"),
          checkInStatus: false,
          status: "confirmed",
        },
        {
          id: "8",
          name: "Ava Wilson",
          email: "ava.w@example.com",
          phone: "+1 (555) 777-8888",
          ticketType: "Standard",
          ticketPrice: 49.99,
          purchaseDate: new Date("2023-11-10"),
          checkInStatus: false,
          status: "confirmed",
        },
        {
          id: "9",
          name: "James Taylor",
          email: "james.t@example.com",
          ticketType: "VIP",
          ticketPrice: 99.99,
          purchaseDate: new Date("2023-11-15"),
          checkInStatus: false,
          status: "confirmed",
        },
        {
          id: "10",
          name: "Isabella Thomas",
          email: "isabella.t@example.com",
          phone: "+1 (555) 999-0000",
          ticketType: "Standard",
          ticketPrice: 49.99,
          purchaseDate: new Date("2023-11-20"),
          checkInStatus: false,
          status: "pending",
        },
      ];

      setEventData(mockEvent);
      setAttendees(mockAttendees);
      setIsLoading(false);
    }, 1000);
  }, [eventId]);

  // Thống kê
  const stats = {
    totalAttendees: attendees.length,
    confirmedAttendees: attendees.filter((a) => a.status === "confirmed")
      .length,
    checkedInAttendees: attendees.filter((a) => a.checkInStatus).length,
    vipTickets: attendees.filter((a) => a.ticketType === "VIP").length,
    standardTickets: attendees.filter((a) => a.ticketType === "Standard")
      .length,
  };

  // Lọc người tham dự theo tìm kiếm và bộ lọc
  const filteredAttendees = attendees.filter((attendee) => {
    // Tìm kiếm theo tên hoặc email
    const matchesSearch =
      searchQuery === "" ||
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Lọc theo trạng thái
    const matchesStatus =
      filterStatus === "all" || attendee.status === filterStatus;

    // Lọc theo loại vé
    const matchesTicketType =
      filterTicketType === "all" || attendee.ticketType === filterTicketType;

    return matchesSearch && matchesStatus && matchesTicketType;
  });

  // Màu cho UI
  const cardBg = useColorModeValue("white", "gray.800");
  const statBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const secondaryTextColor = useColorModeValue("gray.500", "gray.400");
  const tableBorderColor = useColorModeValue("gray.200", "gray.700");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");
  const tableHoverBg = useColorModeValue("gray.50", "gray.700");

  // Xử lý gửi email
  const handleSendEmail = () => {
    toast({
      title: "Email đã gửi",
      description: "Thông báo đã được gửi đến những người tham dự đã chọn.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Xử lý xuất danh sách
  const handleExportList = () => {
    toast({
      title: "Bắt đầu xuất",
      description: "Danh sách người tham dự đang được xuất ra CSV.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Xử lý hủy đăng ký
  const handleCancelRegistration = () => {
    if (!selectedAttendee) return;

    // Trong thực tế, đây sẽ là API call
    const updatedAttendees = attendees.map((attendee) =>
      attendee.id === selectedAttendee.id
        ? { ...attendee, status: "cancelled" as const }
        : attendee
    );

    setAttendees(updatedAttendees);

    toast({
      title: "Đã hủy đăng ký",
      description: `Đăng ký của ${selectedAttendee.name} đã bị hủy.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onClose();
  };

  // Xử lý check-in
  const handleCheckIn = (attendeeId: string) => {
    // Trong thực tế, đây sẽ là API call
    const updatedAttendees = attendees.map((attendee) =>
      attendee.id === attendeeId
        ? {
            ...attendee,
            checkInStatus: true,
            checkInTime: new Date(),
          }
        : attendee
    );

    setAttendees(updatedAttendees);

    const attendee = attendees.find((a) => a.id === attendeeId);

    toast({
      title: "Check-in thành công",
      description: `${attendee?.name} đã được check-in.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Mở hộp thoại xác nhận hủy đăng ký
  const openCancelDialog = (attendee: Attendee) => {
    setSelectedAttendee(attendee);
    onOpen();
  };

  if (isLoading) {
    return (
      <Container maxW="6xl" py={8}>
        <Text>Đang tải dữ liệu người tham dự...</Text>
      </Container>
    );
  }

  if (!eventData) {
    return (
      <Container maxW="6xl" py={8}>
        <Text>Không tìm thấy sự kiện</Text>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      {/* Breadcrumb */}
      <Breadcrumb
        spacing="8px"
        separator={<FaChevronRight color="gray.500" />}
        mb={6}
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/dashboard">
            Bảng điều khiển
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to={`/events/${eventId}`}>
            {eventData.title}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Người tham dự</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <Box mb={6}>
        <Heading as="h1" size="xl" mb={2}>
          {eventData.title} - Quản lý người tham dự
        </Heading>
        <Text color={secondaryTextColor}>
          {eventData.date.toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </Box>

      {/* Stats Overview */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4} mb={6}>
        <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="sm">
          <StatLabel>Tổng số người tham dự</StatLabel>
          <StatNumber>{stats.totalAttendees}</StatNumber>
          <StatHelpText>
            {Math.round((stats.totalAttendees / eventData.totalTickets) * 100)}%
            công suất
          </StatHelpText>
        </Stat>

        <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="sm">
          <StatLabel>Xác nhận</StatLabel>
          <StatNumber>{stats.confirmedAttendees}</StatNumber>
          <StatHelpText>
            {Math.round(
              (stats.confirmedAttendees / stats.totalAttendees) * 100
            )}
            % đã xác nhận
          </StatHelpText>
        </Stat>

        <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="sm">
          <StatLabel>Đã check-in</StatLabel>
          <StatNumber>{stats.checkedInAttendees}</StatNumber>
          <StatHelpText>
            {Math.round(
              (stats.checkedInAttendees / stats.confirmedAttendees) * 100
            )}
            % đã check-in
          </StatHelpText>
        </Stat>

        <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="sm">
          <StatLabel>Vé VIP</StatLabel>
          <StatNumber>{stats.vipTickets}</StatNumber>
          <StatHelpText>
            {Math.round((stats.vipTickets / stats.totalAttendees) * 100)}% trong
            tổng số
          </StatHelpText>
        </Stat>

        <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="sm">
          <StatLabel>Vé thường</StatLabel>
          <StatNumber>{stats.standardTickets}</StatNumber>
          <StatHelpText>
            {Math.round((stats.standardTickets / stats.totalAttendees) * 100)}%
            trong tổng số
          </StatHelpText>
        </Stat>
      </SimpleGrid>

      {/* Main content */}
      <Box
        bg={cardBg}
        borderRadius="lg"
        boxShadow="md"
        mb={6}
        borderWidth="1px"
        borderColor={tableBorderColor}
      >
        <Tabs colorScheme="teal" isFitted variant="enclosed">
          <TabList>
            <Tab fontWeight="medium">Tất cả người tham dự</Tab>
            <Tab fontWeight="medium">Đã check-in</Tab>
            <Tab fontWeight="medium">Chưa check-in</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={4}>
              {/* Filters and Actions */}
              <Stack
                direction={{ base: "column", md: "row" }}
                spacing={4}
                mb={6}
              >
                <InputGroup size="md" maxW={{ base: "full", md: "320px" }}>
                  <InputLeftElement pointerEvents="none">
                    <FaSearch color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>

                <FormControl maxW={{ base: "full", md: "200px" }}>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="pending">Đang chờ</option>
                    <option value="cancelled">Đã hủy</option>
                  </Select>
                </FormControl>

                <FormControl maxW={{ base: "full", md: "200px" }}>
                  <Select
                    value={filterTicketType}
                    onChange={(e) => setFilterTicketType(e.target.value)}
                  >
                    <option value="all">Tất cả loại vé</option>
                    <option value="VIP">VIP</option>
                    <option value="Standard">Thường</option>
                  </Select>
                </FormControl>

                <Flex flex={1} justifyContent="flex-end">
                  <HStack spacing={2}>
                    <Tooltip label="Gửi email cho người tham dự">
                      <IconButton
                        aria-label="Gửi email cho người tham dự"
                        icon={<FaEnvelope />}
                        colorScheme="blue"
                        variant="outline"
                        onClick={handleSendEmail}
                      />
                    </Tooltip>
                    <Tooltip label="Xuất danh sách người tham dự">
                      <IconButton
                        aria-label="Xuất danh sách người tham dự"
                        icon={<FaFileExport />}
                        colorScheme="green"
                        variant="outline"
                        onClick={handleExportList}
                      />
                    </Tooltip>
                  </HStack>
                </Flex>
              </Stack>

              {/* Attendees Table */}
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr bg={tableHeaderBg}>
                      <Th>Tên</Th>
                      <Th>Email</Th>
                      <Th>Vé</Th>
                      <Th>Trạng thái</Th>
                      <Th>Check-in</Th>
                      <Th>Ngày mua</Th>
                      <Th>Thao tác</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredAttendees.length === 0 ? (
                      <Tr>
                        <Td colSpan={7} textAlign="center" py={4}>
                          Không tìm thấy người tham dự phù hợp với bộ lọc
                        </Td>
                      </Tr>
                    ) : (
                      filteredAttendees.map((attendee) => (
                        <Tr key={attendee.id} _hover={{ bg: tableHoverBg }}>
                          <Td fontWeight="medium" color={textColor}>
                            {attendee.name}
                          </Td>
                          <Td color={textColor}>{attendee.email}</Td>
                          <Td>
                            <HStack>
                              <Badge
                                colorScheme={
                                  attendee.ticketType === "VIP"
                                    ? "purple"
                                    : "blue"
                                }
                                borderRadius="full"
                                px={2}
                              >
                                {attendee.ticketType}
                              </Badge>
                              <Text fontSize="sm">${attendee.ticketPrice}</Text>
                            </HStack>
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
                          <Td>
                            {attendee.checkInStatus ? (
                              <HStack>
                                <FaCheckCircle color="green" />
                                <Text fontSize="sm">
                                  {attendee.checkInTime?.toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </Text>
                              </HStack>
                            ) : (
                              <HStack>
                                <FaTimesCircle color="gray" />
                                <Text fontSize="sm" color="gray.500">
                                  Not checked in
                                </Text>
                              </HStack>
                            )}
                          </Td>
                          <Td>{attendee.purchaseDate.toLocaleDateString()}</Td>
                          <Td>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<FaEllipsisV />}
                                variant="ghost"
                                size="sm"
                              />
                              <MenuList>
                                {!attendee.checkInStatus &&
                                  attendee.status === "confirmed" && (
                                    <MenuItem
                                      icon={<FaCheckCircle />}
                                      onClick={() => handleCheckIn(attendee.id)}
                                    >
                                      Check-in
                                    </MenuItem>
                                  )}
                                <MenuItem
                                  icon={<FaDownload />}
                                  onClick={() =>
                                    toast({
                                      title: "Đã tải vé",
                                      status: "success",
                                      duration: 3000,
                                      isClosable: true,
                                    })
                                  }
                                >
                                  Tải vé
                                </MenuItem>
                                <MenuItem
                                  icon={<FaEnvelope />}
                                  onClick={() =>
                                    toast({
                                      title: "Email đã gửi",
                                      description: `Email đã gửi đến ${attendee.name}`,
                                      status: "success",
                                      duration: 3000,
                                      isClosable: true,
                                    })
                                  }
                                >
                                  Gửi email
                                </MenuItem>
                                {attendee.status !== "cancelled" && (
                                  <MenuItem
                                    icon={<FaTimesCircle />}
                                    color="red.500"
                                    onClick={() => openCancelDialog(attendee)}
                                  >
                                    Cancel Registration
                                  </MenuItem>
                                )}
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))
                    )}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>

            <TabPanel p={4}>
              {/* Checked In Attendees Table */}
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr bg={tableHeaderBg}>
                      <Th>Tên</Th>
                      <Th>Email</Th>
                      <Th>Vé</Th>
                      <Th>Thời gian check-in</Th>
                      <Th>Thao tác</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {attendees.filter((a) => a.checkInStatus).length === 0 ? (
                      <Tr>
                        <Td colSpan={5} textAlign="center" py={4}>
                          Chưa có người tham dự nào check-in
                        </Td>
                      </Tr>
                    ) : (
                      attendees
                        .filter((a) => a.checkInStatus)
                        .map((attendee) => (
                          <Tr key={attendee.id} _hover={{ bg: tableHoverBg }}>
                            <Td fontWeight="medium" color={textColor}>
                              {attendee.name}
                            </Td>
                            <Td color={textColor}>{attendee.email}</Td>
                            <Td>
                              <Badge
                                colorScheme={
                                  attendee.ticketType === "VIP"
                                    ? "purple"
                                    : "blue"
                                }
                                borderRadius="full"
                                px={2}
                              >
                                {attendee.ticketType}
                              </Badge>
                            </Td>
                            <Td>
                              {attendee.checkInTime?.toLocaleString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Td>
                            <Td>
                              <Button
                                size="sm"
                                leftIcon={<FaEnvelope />}
                                variant="outline"
                                onClick={() =>
                                  toast({
                                    title: "Email đã gửi",
                                    description: `Email đã gửi đến ${attendee.name}`,
                                    status: "success",
                                    duration: 3000,
                                    isClosable: true,
                                  })
                                }
                              >
                                Gửi email
                              </Button>
                            </Td>
                          </Tr>
                        ))
                    )}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>

            <TabPanel p={4}>
              {/* Not Checked In Attendees Table */}
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr bg={tableHeaderBg}>
                      <Th>Tên</Th>
                      <Th>Email</Th>
                      <Th>Vé</Th>
                      <Th>Trạng thái</Th>
                      <Th>Thao tác</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {attendees.filter(
                      (a) => !a.checkInStatus && a.status === "confirmed"
                    ).length === 0 ? (
                      <Tr>
                        <Td colSpan={5} textAlign="center" py={4}>
                          Tất cả người tham dự đã xác nhận đã check-in
                        </Td>
                      </Tr>
                    ) : (
                      attendees
                        .filter(
                          (a) => !a.checkInStatus && a.status === "confirmed"
                        )
                        .map((attendee) => (
                          <Tr key={attendee.id} _hover={{ bg: tableHoverBg }}>
                            <Td fontWeight="medium" color={textColor}>
                              {attendee.name}
                            </Td>
                            <Td color={textColor}>{attendee.email}</Td>
                            <Td>
                              <Badge
                                colorScheme={
                                  attendee.ticketType === "VIP"
                                    ? "purple"
                                    : "blue"
                                }
                                borderRadius="full"
                                px={2}
                              >
                                {attendee.ticketType}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge
                                colorScheme="green"
                                borderRadius="full"
                                px={2}
                              >
                                confirmed
                              </Badge>
                            </Td>
                            <Td>
                              <HStack spacing={2}>
                                <Button
                                  size="sm"
                                  leftIcon={<FaCheckCircle />}
                                  colorScheme="green"
                                  onClick={() => handleCheckIn(attendee.id)}
                                >
                                  Check-in
                                </Button>
                                <Button
                                  size="sm"
                                  leftIcon={<FaEnvelope />}
                                  variant="outline"
                                  onClick={() =>
                                    toast({
                                      title: "Email đã gửi",
                                      description: `Email đã gửi đến ${attendee.name}`,
                                      status: "success",
                                      duration: 3000,
                                      isClosable: true,
                                    })
                                  }
                                >
                                  Gửi nhắc nhở
                                </Button>
                              </HStack>
                            </Td>
                          </Tr>
                        ))
                    )}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Alert Dialog for Confirmation */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef as React.RefObject<HTMLButtonElement>}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            bg={cardBg}
            borderColor={tableBorderColor}
            borderWidth="1px"
          >
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hủy đăng ký
            </AlertDialogHeader>

            <AlertDialogBody>
              Bạn có chắc chắn muốn hủy đăng ký của {selectedAttendee?.name}?
              Hành động này không thể hoàn tác.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Không, giữ đăng ký
              </Button>
              <Button
                colorScheme="red"
                onClick={handleCancelRegistration}
                ml={3}
              >
                Có, hủy đăng ký
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default EventAttendees;
