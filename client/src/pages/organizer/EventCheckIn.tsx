import { useState, useEffect, useCallback, useRef } from "react";
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
  Divider,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
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
  Spinner,
  Select,
  IconButton,
} from "@chakra-ui/react";
import { FaSearch, FaQrcode, FaSyncAlt, FaTimes } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { DateDisplay, QrCodeScanner } from "../../components/common";
import { getDefaultAvatar } from "../../utils/userUtils";
import eventService from "../../services/event.service";

// Interface cho dữ liệu người tham dự
interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketId: string;
  ticketType: string;
  checkInTime?: string; // Nếu đã check-in thì có giá trị
  checkInStatus: boolean; // Boolean cho biết đã check-in hay chưa
  avatar?: string;
  phone?: string;
  alreadyCheckedIn?: boolean; // Đánh dấu vé đã được check-in trước đó
}

/**
 * Trang Check-in cho người tổ chức sự kiện
 * Cho phép nhập mã vé để xác nhận người tham dự
 */
const EventCheckIn = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const toast = useToast();
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
    title: "Đang tải...",
    date: "",
    location: "",
    totalAttendees: 0,
  });

  const [lastScannedAttendee, setLastScannedAttendee] =
    useState<Attendee | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingCheckIn, setIsProcessingCheckIn] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State cho camera quét QR
  const [isQrScannerActive, setIsQrScannerActive] = useState(false);
  const tabChangeRef = useRef(false);

  // Các màu sắc theo theme - định nghĩa tất cả ở đầu component
  const bgColor = useColorModeValue("white", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const tableHeaderBgColor = useColorModeValue("gray.50", "gray.700");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");
  const grayIconColor = useColorModeValue("gray.300", "gray.500");
  const grayBgColor = useColorModeValue("gray.50", "gray.700");
  const inputHoverBorderColor = useColorModeValue("gray.300", "gray.600");
  const whiteColor = useColorModeValue("white", "gray.700");

  // Định nghĩa các màu cho card thống kê
  const tealBgColor = useColorModeValue("teal.50", "rgba(49, 151, 149, 0.1)");
  const tealTextColor = useColorModeValue("teal.600", "teal.300");
  const tealValueColor = useColorModeValue("teal.700", "teal.200");

  const greenBgColor = useColorModeValue("green.50", "rgba(56, 161, 105, 0.1)");
  const greenTextColor = useColorModeValue("green.600", "green.300");
  const greenValueColor = useColorModeValue("green.700", "green.200");

  const blueBgColor = useColorModeValue("blue.50", "rgba(49, 130, 206, 0.1)");
  const blueTextColor = useColorModeValue("blue.600", "blue.300");
  const blueValueColor = useColorModeValue("blue.700", "blue.200");

  // State cho bộ lọc
  const [filterTicketType, setFilterTicketType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterOptions, setFilterOptions] = useState<{
    ticketTypes: string[];
  }>({
    ticketTypes: [],
  });

  // Tải dữ liệu sự kiện từ API
  useEffect(() => {
    if (!eventId) return;
    loadEventData();
  }, [eventId]);

  // Tải dữ liệu từ API
  const loadEventData = async () => {
    try {
      setIsLoading(true);

      // 1. Lấy thông tin chi tiết sự kiện
      const eventInfo = await eventService.getEventById(eventId as string);

      // 2. Lấy thông tin check-in
      const checkInInfo = await eventService.getEventCheckInInfo(
        eventId as string
      );

      // Cập nhật state
      setEventDetails({
        title: eventInfo.title,
        date: new Date(eventInfo.date).toLocaleDateString("vi-VN"),
        location: eventInfo.location,
        totalAttendees: checkInInfo.totalAttendees || 0,
      });

      setAttendees(checkInInfo.attendees || []);
      setCheckedInCount(checkInInfo.checkedInCount || 0);

      // Tạo danh sách các loại vé cho bộ lọc
      const ticketTypes: string[] = Array.from(
        new Set(
          (checkInInfo.attendees || []).map(
            (attendee: Attendee) => attendee.ticketType
          )
        )
      );
      setFilterOptions({
        ticketTypes,
      });
    } catch (error) {
      console.error("Error loading event data:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu sự kiện. Vui lòng thử lại sau.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm che một phần mã vé
  const maskTicketId = (ticketId: string): string => {
    // Luôn che mã vé để bảo mật, chỉ hiển thị 1/4 đầu
    const visiblePart = Math.floor(ticketId.length / 4);
    return (
      ticketId.substring(0, visiblePart) +
      "•".repeat(ticketId.length - visiblePart)
    );
  };

  // Xử lý check-in bằng ID vé thủ công
  const handleManualCheckIn = async () => {
    if (!manualTicketId.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mã vé",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    await processCheckIn(manualTicketId);
    setManualTicketId("");
  };

  // Xử lý khi quét QR thành công
  const handleQrSuccess = useCallback(
    (decodedText: string) => {
      console.log("QR code scanned successfully:", decodedText);
      // Xử lý check-in với mã vé từ QR code
      processCheckIn(decodedText);
      // Hiển thị thông báo
      toast({
        title: "Đã quét thành công",
        description:
          "Đang xử lý check-in cho mã vé: " +
          decodedText.substring(0, 8) +
          "...",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      // Tắt scanner sau khi quét thành công
      setIsQrScannerActive(false);
    },
    [toast]
  );

  // Xử lý lỗi khi quét QR
  const handleQrError = (error: Error | string) => {
    console.error("QR scan error:", error);

    // Tắt scanner khi gặp lỗi
    setIsQrScannerActive(false);

    // Hiển thị lỗi chi tiết dựa trên loại lỗi
    if (typeof error === "string") {
      if (
        error.includes("camera") ||
        error.includes("permission") ||
        error.includes("getUserMedia")
      ) {
        toast({
          title: "Lỗi truy cập camera",
          description:
            "Không thể truy cập camera. Vui lòng đảm bảo bạn đã cấp quyền camera cho trình duyệt.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Lỗi khi quét mã QR",
          description: error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Lỗi khi quét mã QR",
        description:
          "Đã xảy ra lỗi trong quá trình quét mã QR. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Bảo đảm tắt camera khi chuyển tab
  useEffect(() => {
    const handleTabChange = () => {
      if (document.hidden) {
        tabChangeRef.current = true;
        setIsQrScannerActive(false);
      }
    };

    document.addEventListener("visibilitychange", handleTabChange);
    return () => {
      document.removeEventListener("visibilitychange", handleTabChange);
    };
  }, []);

  // Bảo đảm tắt camera khi unmount component
  useEffect(() => {
    return () => {
      setIsQrScannerActive(false);
    };
  }, []);

  // Hiển thị thông báo khi người dùng quay lại sau khi đã chuyển tab
  useEffect(() => {
    if (tabChangeRef.current && !document.hidden) {
      tabChangeRef.current = false;
      toast({
        title: "Camera đã tắt",
        description:
          "Camera đã tự động tắt vì bạn đã chuyển trang. Vui lòng bật lại nếu cần.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  // Bật/tắt QR scanner
  const toggleQrScanner = () => {
    setIsQrScannerActive(!isQrScannerActive);
  };

  // Hàm xử lý chung cho quá trình check-in
  const processCheckIn = async (ticketData: string) => {
    try {
      // Đảm bảo tắt camera khi bắt đầu xử lý
      if (isQrScannerActive) {
        setIsQrScannerActive(false);
      }

      setIsProcessingCheckIn(true);

      // Tìm vé trong danh sách hiện có
      const foundAttendee = attendees.find((a) => a.ticketId === ticketData);

      if (!foundAttendee) {
        toast({
          title: "Không tìm thấy vé",
          description: `Không tìm thấy vé: ${ticketData}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Gọi API để check-in
      const result = await eventService.checkInTicket(
        foundAttendee.ticketId,
        eventId as string
      );

      // Cập nhật UI
      const updatedAttendees = attendees.map((a) =>
        a.ticketId === foundAttendee.ticketId
          ? {
              ...a,
              checkInStatus: true,
              checkInTime: result.attendee.checkInTime,
              alreadyCheckedIn: result.attendee.alreadyCheckedIn,
            }
          : a
      );

      setAttendees(updatedAttendees);
      setCheckedInCount((prev) =>
        result.attendee.alreadyCheckedIn ? prev : prev + 1
      );

      // Nếu đã check-in trước đó, chỉ hiển thị toast thông báo
      if (result.attendee.alreadyCheckedIn) {
        toast({
          title: "Đã check-in trước đó",
          description: `${foundAttendee.name} đã check-in trước đó`,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Chỉ mở modal khi check-in thành công lần đầu
      setLastScannedAttendee({
        ...foundAttendee,
        checkInStatus: true,
        checkInTime: result.attendee.checkInTime,
      });
      onOpen(); // Mở modal thông báo

      toast({
        title: "Check-in thành công",
        description: `${foundAttendee.name} đã check-in thành công`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error during check-in:", error);
      toast({
        title: "Lỗi check-in",
        description: "Không thể check-in vé. Vui lòng thử lại sau.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsProcessingCheckIn(false);
    }
  };

  // Làm mới dữ liệu
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadEventData();
      toast({
        title: "Đã cập nhật",
        description: "Danh sách người tham dự đã được cập nhật",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Lọc danh sách người tham dự theo từ khóa tìm kiếm
  const filteredAttendees = attendees.filter((attendee) => {
    // Lọc theo từ khóa tìm kiếm
    const matchesKeyword =
      searchKeyword === "" ||
      attendee.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      attendee.ticketId.toLowerCase().includes(searchKeyword.toLowerCase());

    // Lọc theo loại vé
    const matchesTicketType =
      filterTicketType === "" || attendee.ticketType === filterTicketType;

    // Lọc theo trạng thái
    const matchesStatus =
      filterStatus === "" ||
      (filterStatus === "checked-in" && attendee.checkInStatus) ||
      (filterStatus === "not-checked-in" && !attendee.checkInStatus);

    return matchesKeyword && matchesTicketType && matchesStatus;
  });

  // Hàm lấy trạng thái hiển thị chi tiết hơn
  const getDetailedStatus = (
    attendee: Attendee
  ): { label: string; color: string } => {
    if (attendee.checkInStatus) {
      return { label: "Đã check-in", color: "green" };
    }

    // Kiểm tra xem sự kiện đã kết thúc chưa
    const eventDate = new Date(eventDetails.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      return { label: "Đã bỏ lỡ", color: "red" };
    }

    return { label: "Chưa check-in", color: "gray" };
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8} bg={bgColor}>
        <VStack spacing={6} align="center" justify="center" minHeight="50vh">
          <Spinner size="xl" color="teal.500" />
          <Text>Đang tải dữ liệu sự kiện...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8} bg={bgColor}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" color={textColor}>
            Check-in sự kiện
          </Heading>
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
            bg={tealBgColor}
            borderRadius="md"
          >
            <Text fontSize="sm" fontWeight="medium" color={tealTextColor}>
              Tổng số người tham dự
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color={tealValueColor}>
              {eventDetails.totalAttendees}
            </Text>
          </Flex>

          <Flex
            flex={1}
            direction="column"
            align="center"
            justify="center"
            p={3}
            bg={greenBgColor}
            borderRadius="md"
          >
            <Text fontSize="sm" fontWeight="medium" color={greenTextColor}>
              Đã check-in
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color={greenValueColor}>
              {checkedInCount}
            </Text>
          </Flex>

          <Flex
            flex={1}
            direction="column"
            align="center"
            justify="center"
            p={3}
            bg={blueBgColor}
            borderRadius="md"
          >
            <Text fontSize="sm" fontWeight="medium" color={blueTextColor}>
              Tỷ lệ tham dự
            </Text>
            <Text fontSize="3xl" fontWeight="bold" color={blueValueColor}>
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
            <Tab fontWeight="medium" color={textColor}>
              Check-in thủ công
            </Tab>
            <Tab fontWeight="medium" color={textColor}>
              Danh sách người tham dự
            </Tab>
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
                    <Heading size="md" color={textColor}>
                      Check-in bằng mã vé
                    </Heading>
                    <Text color={secondaryTextColor}>
                      Nhập mã vé để check-in người tham dự.
                    </Text>

                    {/* Manual Entry */}
                    <Box>
                      <Heading size="sm" mb={3} color={textColor}>
                        Nhập mã vé
                      </Heading>
                      <HStack>
                        <Input
                          placeholder="Nhập mã vé tại đây"
                          value={manualTicketId}
                          onChange={(e) => setManualTicketId(e.target.value)}
                          bg={whiteColor}
                          borderColor={borderColor}
                          _hover={{ borderColor: inputHoverBorderColor }}
                          _focus={{ borderColor: "teal.500" }}
                        />
                        <Button
                          colorScheme="teal"
                          onClick={handleManualCheckIn}
                          isLoading={isProcessingCheckIn}
                          loadingText="Đang xử lý"
                        >
                          Check-in
                        </Button>
                      </HStack>
                    </Box>

                    {/* QR Scanner feature */}
                    <Box mt={4}>
                      <Divider my={3} borderColor={borderColor} />
                      <Heading size="sm" mb={3} color={textColor}>
                        Quét mã QR
                      </Heading>
                      {isQrScannerActive ? (
                        <Box
                          position="relative"
                          padding={4}
                          borderWidth="1px"
                          borderStyle="solid"
                          borderRadius="md"
                          borderColor={borderColor}
                          bg={grayBgColor}
                        >
                          <IconButton
                            aria-label="Đóng"
                            icon={<FaTimes />}
                            size="sm"
                            position="absolute"
                            top={2}
                            right={2}
                            zIndex={2}
                            onClick={() => {
                              // Đảm bảo camera tắt khi đóng scanner
                              setIsQrScannerActive(false);
                            }}
                          />
                          <QrCodeScanner
                            onScanSuccess={handleQrSuccess}
                            onScanError={handleQrError}
                            isActive={isQrScannerActive}
                          />
                        </Box>
                      ) : (
                        <Box
                          p={4}
                          borderWidth="1px"
                          borderStyle="dashed"
                          borderRadius="md"
                          borderColor={borderColor}
                          bg={grayBgColor}
                        >
                          <VStack spacing={2} align="center">
                            <FaQrcode size={40} color={grayIconColor} />
                            <Text fontWeight="medium" color={textColor}>
                              Quét mã QR từ vé của người tham dự
                            </Text>
                            <Button
                              leftIcon={<FaQrcode />}
                              colorScheme="teal"
                              onClick={toggleQrScanner}
                            >
                              Bắt đầu quét
                            </Button>
                          </VStack>
                        </Box>
                      )}
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
                  <Heading size="md" mb={4} color={textColor}>
                    Check-in gần đây
                  </Heading>
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr bg={tableHeaderBgColor}>
                        <Th color={textColor}>Họ tên</Th>
                        <Th color={textColor}>Thông tin vé</Th>
                        <Th color={textColor}>Thời gian check-in</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {attendees
                        .filter((a) => a.checkInStatus)
                        .sort(
                          (a, b) =>
                            new Date(b.checkInTime || "").getTime() -
                            new Date(a.checkInTime || "").getTime()
                        )
                        .slice(0, 5)
                        .map((attendee) => (
                          <Tr key={attendee.id} _hover={{ bg: hoverBgColor }}>
                            <Td>
                              <HStack>
                                <Avatar
                                  size="xs"
                                  name={attendee.name}
                                  src={
                                    attendee.avatar ||
                                    getDefaultAvatar(attendee.name)
                                  }
                                />
                                <Text color={textColor}>{attendee.name}</Text>
                              </HStack>
                            </Td>
                            <Td>
                              <VStack align="start" spacing={0}>
                                <Text
                                  fontFamily="mono"
                                  fontSize="xs"
                                  color={textColor}
                                >
                                  {maskTicketId(attendee.ticketId)}
                                </Text>
                                <Badge
                                  colorScheme="purple"
                                  variant="subtle"
                                  fontSize="10px"
                                >
                                  {attendee.ticketType}
                                </Badge>
                              </VStack>
                            </Td>
                            <Td color={textColor}>
                              {attendee.checkInTime && (
                                <DateDisplay
                                  date={attendee.checkInTime}
                                  mode="time"
                                  showIcon
                                  size="sm"
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      {attendees.filter((a) => a.checkInStatus).length ===
                        0 && (
                        <Tr>
                          <Td colSpan={3} textAlign="center">
                            <Text color={secondaryTextColor}>
                              Chưa có ai check-in
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
                      <FaSearch color={grayIconColor} />
                    </InputLeftElement>
                    <Input
                      placeholder="Tìm kiếm người tham dự"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      bg={whiteColor}
                      borderColor={borderColor}
                      _hover={{ borderColor: inputHoverBorderColor }}
                      _focus={{ borderColor: "teal.500" }}
                    />
                  </InputGroup>

                  <HStack spacing={3} flexWrap="wrap">
                    <Box>
                      <Select
                        placeholder="Loại vé"
                        value={filterTicketType}
                        onChange={(e) => setFilterTicketType(e.target.value)}
                        size="md"
                        width="150px"
                        bg={whiteColor}
                      >
                        {filterOptions.ticketTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Select>
                    </Box>

                    <Box>
                      <Select
                        placeholder="Trạng thái"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        size="md"
                        width="150px"
                        bg={whiteColor}
                      >
                        <option value="checked-in">Đã check-in</option>
                        <option value="not-checked-in">Chưa check-in</option>
                      </Select>
                    </Box>

                    <Button
                      leftIcon={<FaSyncAlt />}
                      variant="outline"
                      onClick={handleRefreshData}
                      borderColor={borderColor}
                      color={textColor}
                      _hover={{ bg: hoverBgColor }}
                      isLoading={isRefreshing}
                      loadingText="Đang cập nhật"
                    >
                      Làm mới
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
                        <Th color={textColor}>Người tham dự</Th>
                        <Th color={textColor}>Thông tin vé</Th>
                        <Th color={textColor}>Trạng thái</Th>
                        <Th color={textColor}>Thời gian check-in</Th>
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
                                src={
                                  attendee.avatar ||
                                  getDefaultAvatar(attendee.name)
                                }
                              />
                              <Box>
                                <Text fontWeight="medium" color={textColor}>
                                  {attendee.name}
                                </Text>
                                <Text fontSize="xs" color={secondaryTextColor}>
                                  {attendee.email}
                                </Text>
                              </Box>
                            </HStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text
                                fontFamily="mono"
                                fontSize="sm"
                                color={textColor}
                              >
                                {maskTicketId(attendee.ticketId)}
                              </Text>
                              <Badge colorScheme="purple" variant="subtle">
                                {attendee.ticketType}
                              </Badge>
                            </VStack>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={getDetailedStatus(attendee).color}
                              variant="subtle"
                              p={1}
                              borderRadius="md"
                            >
                              {getDetailedStatus(attendee).label}
                            </Badge>
                          </Td>
                          <Td color={textColor}>
                            {attendee.checkInTime ? (
                              <DateDisplay
                                date={attendee.checkInTime}
                                mode="time"
                                showIcon
                                size="sm"
                              />
                            ) : (
                              "-"
                            )}
                          </Td>
                        </Tr>
                      ))}
                      {filteredAttendees.length === 0 && (
                        <Tr>
                          <Td colSpan={4} textAlign="center" py={4}>
                            <VStack>
                              <FaSearch size={20} color={grayIconColor} />
                              <Text color={secondaryTextColor}>
                                Không tìm thấy kết quả
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
      <Modal
        isOpen={isOpen}
        onClose={() => {
          // Tắt camera khi đóng modal
          if (isQrScannerActive) {
            setIsQrScannerActive(false);
          }
          onClose();
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          bg={cardBgColor}
          borderColor={borderColor}
          borderWidth="1px"
        >
          <ModalHeader color={textColor}>
            {lastScannedAttendee?.alreadyCheckedIn
              ? "Đã check-in trước đó"
              : "Check-in thành công"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {lastScannedAttendee && (
              <VStack spacing={4} align="stretch">
                {lastScannedAttendee.checkInStatus ? (
                  lastScannedAttendee.alreadyCheckedIn ? (
                    <Alert status="warning" borderRadius="md">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>Đã check-in trước đó!</AlertTitle>
                        <AlertDescription>
                          Vé này đã được check-in trước đó
                        </AlertDescription>
                      </Box>
                    </Alert>
                  ) : (
                    <Alert status="success" borderRadius="md">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>Thành công!</AlertTitle>
                        <AlertDescription>Check-in thành công</AlertDescription>
                      </Box>
                    </Alert>
                  )
                ) : (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Lỗi!</AlertTitle>
                      <AlertDescription>Không thể check-in</AlertDescription>
                    </Box>
                  </Alert>
                )}
                <Box
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor={borderColor}
                  bg={cardBgColor}
                >
                  <VStack align="start" spacing={3}>
                    <HStack w="100%">
                      <Avatar
                        size="md"
                        name={lastScannedAttendee.name}
                        src={
                          lastScannedAttendee.avatar ||
                          getDefaultAvatar(lastScannedAttendee.name)
                        }
                      />
                      <Box>
                        <Text fontWeight="bold" color={textColor}>
                          {lastScannedAttendee.name}
                        </Text>
                        <Text fontSize="sm" color={secondaryTextColor}>
                          {lastScannedAttendee.email}
                        </Text>
                      </Box>
                    </HStack>
                    <Divider borderColor={borderColor} />
                    <Box w="100%">
                      <HStack justify="space-between">
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color={textColor}
                        >
                          Mã vé:
                        </Text>
                        <Text fontSize="sm" fontFamily="mono" color={textColor}>
                          {/* Ẩn mã vé để bảo mật, chỉ hiển thị một phần nhỏ */}
                          {maskTicketId(lastScannedAttendee.ticketId)}
                        </Text>
                      </HStack>
                      <HStack justify="space-between" mt={1}>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color={textColor}
                        >
                          Loại vé:
                        </Text>
                        <Badge colorScheme="purple">
                          {lastScannedAttendee.ticketType}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between" mt={1}>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color={textColor}
                        >
                          Thời gian check-in:
                        </Text>
                        <Text fontSize="sm" color={textColor}>
                          {lastScannedAttendee.checkInTime ? (
                            <DateDisplay
                              date={lastScannedAttendee.checkInTime}
                              mode="time"
                              showTooltip={false}
                            />
                          ) : (
                            "-"
                          )}
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
              Tiếp tục
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default EventCheckIn;
