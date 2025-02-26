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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
    title: t("common.loading"),
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

  // Các màu sắc theo theme
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const bgColor = useColorModeValue("bg.primary", "bg.primary");
  const cardBgColor = useColorModeValue("card.bg", "card.bg");
  const borderColor = useColorModeValue("card.border", "card.border");
  const textColor = useColorModeValue("text.primary", "text.primary");
  const secondaryTextColor = useColorModeValue(
    "text.secondary",
    "text.secondary"
  );
  const tableBgColor = useColorModeValue("white", "gray.800");
  const tableHeaderBgColor = useColorModeValue("gray.50", "gray.700");
  const hoverBgColor = useColorModeValue("hover.bg", "hover.bg");
  /* eslint-enable @typescript-eslint/no-unused-vars */

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
      title: t("events.checkIn.checkInFailed"),
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
        title: t("errors.required"),
        description: t("events.checkIn.enterTicketId"),
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
        title: t("events.checkIn.invalidTicket"),
        description: t("events.checkIn.invalidTicket"),
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
        title: t("events.checkIn.ticketNotFound"),
        description: `${t("events.checkIn.ticketNotFound")}: ${ticketId}`,
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
        title: t("events.checkIn.alreadyCheckedIn"),
        description: `${t("events.checkIn.alreadyCheckedIn")} ${new Date(
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
      title: t("events.checkIn.checkInSuccess"),
      description: `${attendee.name} ${t(
        "events.checkIn.checkInSuccess"
      ).toLowerCase()}`,
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
        ? t("common.cancel")
        : t("events.checkIn.checkInSuccess"),
      description: `${attendee.name} ${
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
      title: t("common.export"),
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
          <Heading size="lg">{t("events.checkIn.title")}</Heading>
          <HStack mt={2}>
            <Heading size="md" fontWeight="normal" color={secondaryTextColor}>
              {eventDetails.title}
            </Heading>
            <Badge colorScheme="teal" fontSize="sm">
              {eventDetails.date}
            </Badge>
          </HStack>
          <Text mt={1} color={secondaryTextColor}>
            {eventDetails.location}
          </Text>
        </Box>

        {/* Statistics */}
        <Flex
          bg={cardBgColor}
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
            bg={useColorModeValue("teal.50", "rgba(49, 151, 149, 0.1)")}
            borderRadius="md"
          >
            <Text
              fontSize="sm"
              fontWeight="medium"
              color={useColorModeValue("teal.600", "teal.300")}
            >
              {t("events.checkIn.totalAttendees")}
            </Text>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color={useColorModeValue("teal.700", "teal.200")}
            >
              {eventDetails.totalAttendees}
            </Text>
          </Flex>

          <Flex
            flex={1}
            direction="column"
            align="center"
            justify="center"
            p={3}
            bg={useColorModeValue("green.50", "rgba(56, 161, 105, 0.1)")}
            borderRadius="md"
          >
            <Text
              fontSize="sm"
              fontWeight="medium"
              color={useColorModeValue("green.600", "green.300")}
            >
              {t("events.checkIn.checkedIn")}
            </Text>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color={useColorModeValue("green.700", "green.200")}
            >
              {checkedInCount}
            </Text>
          </Flex>

          <Flex
            flex={1}
            direction="column"
            align="center"
            justify="center"
            p={3}
            bg={useColorModeValue("blue.50", "rgba(49, 130, 206, 0.1)")}
            borderRadius="md"
          >
            <Text
              fontSize="sm"
              fontWeight="medium"
              color={useColorModeValue("blue.600", "blue.300")}
            >
              {t("events.checkIn.attendanceRate")}
            </Text>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color={useColorModeValue("blue.700", "blue.200")}
            >
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
            <Tab fontWeight="medium">{t("events.checkIn.manualCheckIn")}</Tab>
            <Tab fontWeight="medium">{t("events.checkIn.attendeeList")}</Tab>
          </TabList>

          <TabPanels>
            {/* Manual Check-in Tab (thay thế cho QR Scanner Tab) */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                <Box
                  bg={cardBgColor}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <VStack spacing={5} align="stretch">
                    <Heading size="md">
                      {t("events.checkIn.checkInByTicketId")}
                    </Heading>
                    <Text color={secondaryTextColor}>
                      {t("events.checkIn.checkInByTicketId") + "."}
                    </Text>

                    {/* Manual Entry */}
                    <Box>
                      <Heading size="sm" mb={3}>
                        {t("events.checkIn.enterTicketId")}
                      </Heading>
                      <HStack>
                        <Input
                          placeholder={t("events.checkIn.ticketIdPlaceholder")}
                          value={manualTicketId}
                          onChange={(e) => setManualTicketId(e.target.value)}
                        />
                        <Button
                          colorScheme="teal"
                          onClick={handleManualCheckIn}
                        >
                          {t("events.checkIn.checkedIn")}
                        </Button>
                      </HStack>
                    </Box>

                    {/* QR Scanner feature - placeholder for future implementation */}
                    <Box mt={4}>
                      <Divider my={3} />
                      <Heading size="sm" mb={3}>
                        {t("events.checkIn.qrScanner")}
                      </Heading>
                      <Box
                        p={4}
                        borderWidth="1px"
                        borderStyle="dashed"
                        borderRadius="md"
                        bg={useColorModeValue("gray.50", "gray.700")}
                      >
                        <VStack spacing={2} align="center">
                          <FaQrcode size={40} color="gray" />
                          <Text fontWeight="medium">
                            {t("events.checkIn.qrScannerComingSoon")}
                          </Text>
                          <Text color={secondaryTextColor} textAlign="center">
                            {t("events.checkIn.qrScannerDescription")}
                          </Text>
                        </VStack>
                      </Box>
                    </Box>
                  </VStack>
                </Box>

                {/* Recent Check-ins */}
                <Box
                  bg={cardBgColor}
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Heading size="md" mb={4}>
                    {t("events.checkIn.recentCheckIns")}
                  </Heading>
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr bg={tableHeaderBgColor}>
                        <Th>{t("auth.fullName")}</Th>
                        <Th>{t("events.ticketId")}</Th>
                        <Th>{t("events.checkIn.checkInTime")}</Th>
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
                            <Text color={secondaryTextColor}>
                              {t("events.checkIn.noCheckInsYet")}
                            </Text>
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
                  bg={cardBgColor}
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
                      placeholder={t("events.checkIn.searchAttendees")}
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
                      {t("common.reset")}
                    </Button>
                    <Button
                      leftIcon={<FaFileDownload />}
                      onClick={exportAttendees}
                    >
                      {t("common.export")}
                    </Button>
                  </HStack>
                </Flex>

                <Box
                  bg={cardBgColor}
                  borderRadius="lg"
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                  overflowX="auto"
                >
                  <Table variant="simple">
                    <Thead>
                      <Tr bg={tableHeaderBgColor}>
                        <Th>{t("events.attendees")}</Th>
                        <Th>{t("events.event")}</Th>
                        <Th>{t("common.status")}</Th>
                        <Th>{t("events.checkIn.checkInTime")}</Th>
                        <Th>{t("common.action")}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredAttendees.map((attendee) => (
                        <Tr key={attendee.id} _hover={{ bg: hoverBgColor }}>
                          <Td>
                            <HStack>
                              <Avatar
                                size="sm"
                                name={attendee.name}
                                src={attendee.avatar}
                              />
                              <Box>
                                <Text fontWeight="medium">{attendee.name}</Text>
                                <Text fontSize="xs" color={secondaryTextColor}>
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
                                ? t("events.checkIn.status.checkedIn")
                                : t("events.checkIn.status.notCheckedIn")}
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
                              <Text color={secondaryTextColor}>
                                {t("common.noResults")}
                              </Text>
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
        <ModalContent bg={cardBgColor}>
          <ModalHeader>
            {lastScannedAttendee?.checkInTime
              ? t("events.checkIn.checkInSuccess")
              : t("events.checkIn.checkInFailed")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {lastScannedAttendee && (
              <VStack spacing={4} align="stretch">
                {lastScannedAttendee.checkInTime ? (
                  <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>{t("common.success")}!</AlertTitle>
                      <AlertDescription>
                        {t("events.checkIn.checkInSuccess").toLowerCase()}
                      </AlertDescription>
                    </Box>
                  </Alert>
                ) : (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>{t("common.error")}!</AlertTitle>
                      <AlertDescription>
                        {t("events.checkIn.alreadyCheckedIn")}
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}
                <Box
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor={borderColor}
                >
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
                        <Text fontSize="sm" color={secondaryTextColor}>
                          {lastScannedAttendee.email}
                        </Text>
                      </Box>
                    </HStack>
                    <Divider />
                    <Box w="100%">
                      <HStack justify="space-between">
                        <Text fontSize="sm" fontWeight="medium">
                          {t("events.ticketId")}:
                        </Text>
                        <Text fontSize="sm" fontFamily="mono">
                          {lastScannedAttendee.ticketId}
                        </Text>
                      </HStack>
                      <HStack justify="space-between" mt={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          {t("events.ticketType")}:
                        </Text>
                        <Badge colorScheme="purple">
                          {lastScannedAttendee.ticketType}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between" mt={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          {t("events.checkIn.checkInTime")}:
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
              {t("common.continue")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default EventCheckIn;
