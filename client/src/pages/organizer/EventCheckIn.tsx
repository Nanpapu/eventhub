import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  FormControl,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  FormLabel,
  Divider,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  IconButton,
  useToast,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  Switch,
} from "@chakra-ui/react";
import {
  FaSearch,
  FaQrcode,
  FaUserCheck,
  FaUserTimes,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  FaCamera,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  FaTimes,
  FaFileDownload,
  FaSyncAlt,
} from "react-icons/fa";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams, useNavigate } from "react-router-dom";
// Tạm thời comment để tránh lỗi
// import QrReader from "react-qr-reader";

/**
 * Các thiết lập cho quy trình check-in
 *
 * LƯU Ý QUAN TRỌNG: Nhiều hàm và biến trong file này hiện đang không sử dụng
 * vì chức năng quét QR code đã bị tạm thời vô hiệu hóa để tránh lỗi TypeScript.
 * Các hàm và biến này sẽ được dùng khi triển khai đầy đủ tính năng QR scanner
 * với thư viện phù hợp hơn trong tương lai.
 *
 * KHÔNG XÓA các biến và hàm này khi phát triển các tính năng khác!
 */

// Interface cho dữ liệu người tham dự
interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketId: string;
  ticketType: string;
  checkInTime?: string; // Nếu đã check-in thì có giá trị
  avatar?: string;
  phone?: string;
}

/**
 * Trang Check-in cho người tổ chức sự kiện
 * Cho phép nhập mã vé để xác nhận người tham dự
 * (Tạm thời bỏ chức năng quét QR để demo)
 */
const EventCheckIn = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const toast = useToast();
  /* eslint-disable @typescript-eslint/no-unused-vars -- Sẽ sử dụng trong tương lai khi phát triển tính năng chuyển hướng */
  const navigate = useNavigate();
  /* eslint-disable @typescript-eslint/no-unused-vars -- Các biến dưới đây sẽ được sử dụng khi triển khai QR scanner */
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const [manualTicketId, setManualTicketId] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [eventDetails, setEventDetails] = useState<{
    title: string;
    date: string;
    location: string;
    totalAttendees: number;
  }>({
    title: "Loading...",
    date: "",
    location: "",
    totalAttendees: 0,
  });

  /* eslint-disable @typescript-eslint/no-unused-vars -- Sẽ sử dụng khi triển khai QR scanner */
  const [activeCamera, setActiveCamera] = useState(false);
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const [lastScannedAttendee, setLastScannedAttendee] =
    useState<Attendee | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars -- Sẽ sử dụng khi triển khai QR scanner */
  const qrReaderRef = useRef(null);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Giả lập dữ liệu cho demo
  useEffect(() => {
    // Trong thực tế, sẽ fetch dữ liệu từ API
    const mockEventDetails = {
      title: "Tech Conference 2023",
      date: "15 Dec 2023",
      location: "Convention Center, New York",
      totalAttendees: 150,
    };

    // Mock attendees data
    const mockAttendees: Attendee[] = Array.from({ length: 20 }, (_, i) => ({
      id: `user-${i + 1}`,
      name: `Attendee ${i + 1}`,
      email: `attendee${i + 1}@example.com`,
      ticketId: `TIX-${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`,
      ticketType: i % 3 === 0 ? "VIP" : i % 3 === 1 ? "Standard" : "Early Bird",
      checkInTime:
        i < 8
          ? new Date(Date.now() - Math.random() * 3600000).toISOString()
          : undefined,
      avatar: `https://randomuser.me/api/portraits/${
        i % 2 === 0 ? "men" : "women"
      }/${i % 70}.jpg`,
      phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${
        Math.floor(Math.random() * 900) + 100
      }-${Math.floor(Math.random() * 9000) + 1000}`,
    }));

    setEventDetails(mockEventDetails);
    setAttendees(mockAttendees);
    setCheckedInCount(mockAttendees.filter((a) => a.checkInTime).length);
  }, [eventId]);

  // Xử lý khi quét QR thành công (tạm thời không sử dụng)
  /* eslint-disable @typescript-eslint/no-unused-vars -- Sẽ sử dụng khi triển khai QR scanner */
  const handleScan = (data: string | null) => {
    if (data) {
      setScanResult(data);
      processCheckIn(data);
      setIsScanning(false);
    }
  };

  // Xử lý lỗi quét QR (tạm thời không sử dụng)
  const handleError = (err: Error) => {
    console.error(err);
    toast({
      title: "Scan Error",
      description:
        "Could not access camera or encountered an error while scanning",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    setIsScanning(false);
  };
  /* eslint-enable @typescript-eslint/no-unused-vars */

  // Xử lý check-in bằng ID vé thủ công
  const handleManualCheckIn = () => {
    if (!manualTicketId.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a ticket ID",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    processCheckIn(manualTicketId);
    setManualTicketId("");
  };

  // Hàm xử lý chung cho quá trình check-in
  const processCheckIn = (ticketData: string) => {
    // Parse QR data (trong thực tế sẽ phức tạp hơn và có validation)
    const ticketId = ticketData.includes("|")
      ? ticketData
          .split("|")
          .find((part) => part.startsWith("TICKET:"))
          ?.replace("TICKET:", "")
      : ticketData.trim();

    if (!ticketId) {
      toast({
        title: "Invalid Ticket",
        description: "The scanned code is not a valid ticket",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Tìm người tham dự theo ID vé
    const attendee = attendees.find((a) => a.ticketId === ticketId);

    if (!attendee) {
      toast({
        title: "Ticket Not Found",
        description: `No ticket found with ID: ${ticketId}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (attendee.checkInTime) {
      setLastScannedAttendee(attendee);
      onOpen(); // Mở modal cảnh báo

      toast({
        title: "Already Checked In",
        description: `This ticket has already been checked in at ${new Date(
          attendee.checkInTime
        ).toLocaleTimeString()}`,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Tiến hành check-in
    const updatedAttendees = attendees.map((a) =>
      a.id === attendee.id ? { ...a, checkInTime: new Date().toISOString() } : a
    );

    setAttendees(updatedAttendees);
    setCheckedInCount(updatedAttendees.filter((a) => a.checkInTime).length);
    setLastScannedAttendee({
      ...attendee,
      checkInTime: new Date().toISOString(),
    });
    onOpen(); // Mở modal thông báo

    toast({
      title: "Check-in Successful",
      description: `${attendee.name} has been checked in`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Lọc danh sách người tham dự theo từ khóa tìm kiếm
  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      attendee.ticketId.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // Tìm người tham dự theo ID
  const findAttendeeById = (id: string): Attendee | undefined => {
    return attendees.find((a) => a.id === id);
  };

  // Toggle trạng thái check-in của người tham dự
  const toggleCheckInStatus = (attendeeId: string) => {
    const attendee = findAttendeeById(attendeeId);
    if (!attendee) return;

    const updatedAttendees = attendees.map((a) =>
      a.id === attendeeId
        ? {
            ...a,
            checkInTime: a.checkInTime ? undefined : new Date().toISOString(),
          }
        : a
    );

    setAttendees(updatedAttendees);
    setCheckedInCount(updatedAttendees.filter((a) => a.checkInTime).length);

    toast({
      title: attendee.checkInTime
        ? "Check-in Cancelled"
        : "Check-in Successful",
      description: `${attendee.name} has been ${
        attendee.checkInTime ? "removed from" : "added to"
      } check-in list`,
      status: attendee.checkInTime ? "info" : "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Format timestamp thành chuỗi thời gian dễ đọc
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleTimeString();
  };

  // Export danh sách người tham dự (giả lập)
  const exportAttendees = () => {
    toast({
      title: "Export Started",
      description: "Attendee list is being downloaded",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    // Trong thực tế, sẽ gọi API để tạo và tải file CSV/Excel
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg">Event Check-in</Heading>
          <HStack mt={2}>
            <Heading size="md" fontWeight="normal" color="gray.600">
              {eventDetails.title}
            </Heading>
            <Badge colorScheme="teal" fontSize="sm">
              {eventDetails.date}
            </Badge>
          </HStack>
          <Text mt={1} color="gray.500">
            {eventDetails.location}
          </Text>
        </Box>

        {/* Statistics */}
        <Flex
          bg={bgColor}
          p={5}
          borderRadius="lg"
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <Flex
            flex={1}
            direction="column"
            align="center"
            justify="center"
            p={3}
            bg="teal.50"
            borderRadius="md"
          >
            <Text fontSize="sm" fontWeight="medium" color="teal.600">
              Total Attendees
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="teal.700">
              {eventDetails.totalAttendees}
            </Text>
          </Flex>

          <Flex
            flex={1}
            direction="column"
            align="center"
            justify="center"
            p={3}
            bg="green.50"
            borderRadius="md"
          >
            <Text fontSize="sm" fontWeight="medium" color="green.600">
              Checked-in
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="green.700">
              {checkedInCount}
            </Text>
          </Flex>

          <Flex
            flex={1}
            direction="column"
            align="center"
            justify="center"
            p={3}
            bg="blue.50"
            borderRadius="md"
          >
            <Text fontSize="sm" fontWeight="medium" color="blue.600">
              Attendance Rate
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color="blue.700">
              {eventDetails.totalAttendees
                ? Math.round(
                    (checkedInCount / eventDetails.totalAttendees) * 100
                  )
                : 0}
              %
            </Text>
          </Flex>
        </Flex>

        {/* Main Content */}
        <Tabs colorScheme="teal" variant="enclosed">
          <TabList>
            <Tab fontWeight="medium">Manual Check-in</Tab>
            <Tab fontWeight="medium">Attendee List</Tab>
          </TabList>

          <TabPanels>
            {/* Manual Check-in Tab (thay thế cho QR Scanner Tab) */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                <Box
                  bg={bgColor}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <VStack spacing={5} align="stretch">
                    <Heading size="md">Check-in by Ticket ID</Heading>
                    <Text>
                      Enter the ticket ID from the attendee's ticket to check
                      them in.
                    </Text>

                    {/* Manual Entry */}
                    <Box>
                      <Heading size="sm" mb={3}>
                        Enter Ticket ID
                      </Heading>
                      <HStack>
                        <Input
                          placeholder="Enter ticket ID (e.g. TIX-ABC123)"
                          value={manualTicketId}
                          onChange={(e) => setManualTicketId(e.target.value)}
                        />
                        <Button
                          colorScheme="teal"
                          onClick={handleManualCheckIn}
                        >
                          Check In
                        </Button>
                      </HStack>
                    </Box>

                    {/* QR Scanner feature - placeholder for future implementation */}
                    <Box mt={4}>
                      <Divider my={3} />
                      <Heading size="sm" mb={3}>
                        QR Scanner
                      </Heading>
                      <Box
                        p={4}
                        borderWidth="1px"
                        borderStyle="dashed"
                        borderRadius="md"
                        bg="gray.50"
                      >
                        <VStack spacing={2} align="center">
                          <FaQrcode size={40} color="gray" />
                          <Text fontWeight="medium">
                            QR Scanner Coming Soon
                          </Text>
                          <Text color="gray.500" textAlign="center">
                            The QR scanner functionality will be implemented in
                            a future update. For now, please use the manual
                            ticket ID entry above.
                          </Text>
                        </VStack>
                      </Box>
                    </Box>
                  </VStack>
                </Box>

                {/* Recent Check-ins */}
                <Box
                  bg={bgColor}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Heading size="md" mb={4}>
                    Recent Check-ins
                  </Heading>
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Ticket ID</Th>
                        <Th>Time</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {attendees
                        .filter((a) => a.checkInTime)
                        .sort(
                          (a, b) =>
                            new Date(b.checkInTime!).getTime() -
                            new Date(a.checkInTime!).getTime()
                        )
                        .slice(0, 5)
                        .map((attendee) => (
                          <Tr key={attendee.id}>
                            <Td>
                              <HStack>
                                <Avatar
                                  size="xs"
                                  name={attendee.name}
                                  src={attendee.avatar}
                                />
                                <Text>{attendee.name}</Text>
                              </HStack>
                            </Td>
                            <Td>
                              <Text fontFamily="mono">{attendee.ticketId}</Text>
                            </Td>
                            <Td>{formatTime(attendee.checkInTime)}</Td>
                          </Tr>
                        ))}
                      {attendees.filter((a) => a.checkInTime).length === 0 && (
                        <Tr>
                          <Td colSpan={3} textAlign="center">
                            <Text color="gray.500">No check-ins yet</Text>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            </TabPanel>

            {/* Attendee List Tab - giữ nguyên */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                <Flex
                  bg={bgColor}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align={{ base: "stretch", md: "center" }}
                  gap={4}
                >
                  <InputGroup maxW={{ base: "100%", md: "300px" }}>
                    <InputLeftElement pointerEvents="none">
                      <FaSearch color="gray.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search by name, email, or ticket ID"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                  </InputGroup>

                  <HStack spacing={3}>
                    <Button
                      leftIcon={<FaSyncAlt />}
                      variant="outline"
                      onClick={() => setSearchKeyword("")}
                    >
                      Reset
                    </Button>
                    <Button
                      leftIcon={<FaFileDownload />}
                      onClick={exportAttendees}
                    >
                      Export
                    </Button>
                  </HStack>
                </Flex>

                <Box
                  bg={bgColor}
                  borderRadius="lg"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                  overflowX="auto"
                >
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Attendee</Th>
                        <Th>Ticket</Th>
                        <Th>Status</Th>
                        <Th>Check-in Time</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredAttendees.map((attendee) => (
                        <Tr key={attendee.id}>
                          <Td>
                            <HStack>
                              <Avatar
                                size="sm"
                                name={attendee.name}
                                src={attendee.avatar}
                              />
                              <Box>
                                <Text fontWeight="medium">{attendee.name}</Text>
                                <Text fontSize="xs" color="gray.500">
                                  {attendee.email}
                                </Text>
                              </Box>
                            </HStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text fontFamily="mono" fontSize="sm">
                                {attendee.ticketId}
                              </Text>
                              <Badge colorScheme="purple" variant="subtle">
                                {attendee.ticketType}
                              </Badge>
                            </VStack>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={
                                attendee.checkInTime ? "green" : "gray"
                              }
                              variant="subtle"
                              p={1}
                              borderRadius="md"
                            >
                              {attendee.checkInTime
                                ? "Checked In"
                                : "Not Checked In"}
                            </Badge>
                          </Td>
                          <Td>{formatTime(attendee.checkInTime)}</Td>
                          <Td>
                            <IconButton
                              aria-label="Toggle check-in status"
                              icon={
                                attendee.checkInTime ? (
                                  <FaUserTimes />
                                ) : (
                                  <FaUserCheck />
                                )
                              }
                              colorScheme={
                                attendee.checkInTime ? "red" : "green"
                              }
                              size="sm"
                              onClick={() => toggleCheckInStatus(attendee.id)}
                            />
                          </Td>
                        </Tr>
                      ))}
                      {filteredAttendees.length === 0 && (
                        <Tr>
                          <Td colSpan={5} textAlign="center" py={4}>
                            <VStack>
                              <FaSearch size={20} color="gray" />
                              <Text color="gray.500">No attendees found</Text>
                            </VStack>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Modal for displaying check-in result */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {lastScannedAttendee?.checkInTime
              ? "Check-in Successful"
              : "Check-in Failed"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {lastScannedAttendee && (
              <VStack spacing={4} align="stretch">
                {lastScannedAttendee.checkInTime ? (
                  <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Success!</AlertTitle>
                      <AlertDescription>
                        Attendee has been checked in successfully.
                      </AlertDescription>
                    </Box>
                  </Alert>
                ) : (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Error!</AlertTitle>
                      <AlertDescription>
                        This ticket has already been checked in.
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}
                <Box p={4} borderWidth="1px" borderRadius="md">
                  <VStack align="start" spacing={3}>
                    <HStack w="100%">
                      <Avatar
                        size="md"
                        name={lastScannedAttendee.name}
                        src={lastScannedAttendee.avatar}
                      />
                      <Box>
                        <Text fontWeight="bold">
                          {lastScannedAttendee.name}
                        </Text>
                        <Text fontSize="sm">{lastScannedAttendee.email}</Text>
                      </Box>
                    </HStack>
                    <Divider />
                    <Box w="100%">
                      <HStack justify="space-between">
                        <Text fontSize="sm" fontWeight="medium">
                          Ticket ID:
                        </Text>
                        <Text fontSize="sm" fontFamily="mono">
                          {lastScannedAttendee.ticketId}
                        </Text>
                      </HStack>
                      <HStack justify="space-between" mt={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          Ticket Type:
                        </Text>
                        <Badge colorScheme="purple">
                          {lastScannedAttendee.ticketType}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between" mt={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          Check-in Time:
                        </Text>
                        <Text fontSize="sm">
                          {lastScannedAttendee.checkInTime
                            ? new Date(
                                lastScannedAttendee.checkInTime
                              ).toLocaleTimeString()
                            : "-"}
                        </Text>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={onClose}>
              Continue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default EventCheckIn;
