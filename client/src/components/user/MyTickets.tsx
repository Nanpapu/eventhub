import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Badge,
  Button,
  VStack,
  HStack,
  Stack,
  Icon,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tag,
  Spinner,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tooltip,
  Circle,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  FiCalendar,
  FiMapPin,
  FiShare2,
  FiClock,
  FiList,
  FiClock as FiHistory,
  FiCode,
  FiCheckCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { SearchBar } from "../../components/common";
import userService from "../../services/user.service.ts";
import { getLocationOptions } from "../../utils/locationUtils";
import QRCode from "react-qr-code";

// Interface cho dữ liệu vé (đồng bộ với dữ liệu trả về từ API)
interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  date: string;
  startTime: string;
  location: string;
  address?: string;
  image: string;
  ticketType: string;
  price: number;
  purchaseDate: string;
  status: "upcoming" | "past" | "canceled" | "used";
  ticketStatusOriginal?: "reserved" | "paid" | "cancelled" | "used";
  eventCategory?: string;
  checkInDate?: string; // Thêm trường thời gian check-in
}

/**
 * Component hiển thị danh sách vé của người dùng
 */
const MyTickets = () => {
  // State để lưu tab đang active
  const [tabIndex, setTabIndex] = useState(0);

  // State lọc và tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  // State lưu dữ liệu vé, trạng thái loading và lỗi
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Màu sắc theo theme
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const activeBg = useColorModeValue("teal.50", "teal.900");
  const activeColor = useColorModeValue("teal.600", "teal.200");

  // useEffect để fetch vé khi component mount
  useEffect(() => {
    const fetchTickets = async () => {
      console.log("[MyTickets] Starting to fetch tickets...");
      setIsLoading(true);
      setError(null);
      try {
        const fetchedTickets = await userService.getMyTickets();
        console.log(
          "[MyTickets] Fetched tickets from service:",
          fetchedTickets
        );

        setTickets(Array.isArray(fetchedTickets) ? fetchedTickets : []);
        console.log("[MyTickets] State 'tickets' updated.");
      } catch (err) {
        console.error("[MyTickets] Error fetching tickets in component:", err);
        if (err instanceof Error) {
          setError(err.message);
          console.log("[MyTickets] Error message set to state:", err.message);
        } else if (typeof err === "string") {
          setError(err);
          console.log("[MyTickets] Error string set to state:", err);
        } else {
          const defaultError =
            "Không thể tải danh sách vé. Vui lòng thử lại sau.";
          setError(defaultError);
          console.log("[MyTickets] Default error set to state:", defaultError);
        }
      } finally {
        setIsLoading(false);
        console.log(
          "[MyTickets] Finished fetching tickets, isLoading set to false."
        );
      }
    };

    fetchTickets();
  }, []);

  // Lọc vé theo tab và tìm kiếm
  console.log("[MyTickets] Current 'tickets' state before filtering:", tickets);
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.eventTitle
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLocation =
      locationFilter === "" ||
      ticket.location.toLowerCase().includes(locationFilter.toLowerCase());
    // Không thực sự lọc theo danh mục và giá vì vé không có các thuộc tính này
    // Nhưng vẫn giữ code để đồng bộ với các trang khác

    if (tabIndex === 0) {
      // Tất cả vé
      return matchesSearch && matchesLocation;
    } else if (tabIndex === 1) {
      // Vé sắp tới
      return matchesSearch && matchesLocation && ticket.status === "upcoming";
    } else if (tabIndex === 2) {
      // Vé đã qua
      return (
        matchesSearch &&
        matchesLocation &&
        (ticket.status === "past" || ticket.status === "used")
      );
    } else {
      // Vé đã hủy
      return matchesSearch && matchesLocation && ticket.status === "canceled";
    }
  });

  // Hàm tiện ích lọc vé theo điều kiện search và location
  const filterTickets = (status?: string) => {
    return tickets.filter((ticket) => {
      const matchesSearch = ticket.eventTitle
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesLocation =
        locationFilter === "" ||
        ticket.location.toLowerCase().includes(locationFilter.toLowerCase());

      if (status) {
        if (status === "past") {
          // Đối với "past", bao gồm cả "used" và "past"
          return (
            matchesSearch &&
            matchesLocation &&
            (ticket.status === status || ticket.status === "used")
          );
        }
        return matchesSearch && matchesLocation && ticket.status === status;
      }
      return matchesSearch && matchesLocation;
    });
  };

  // Xử lý hủy vé
  const handleCancelTicket = (ticketId: string) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: "canceled" } : ticket
      )
    );
    // Trong thực tế sẽ gọi API để hủy vé
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    // Đã được xử lý thông qua state
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
  };

  // Tạo locationOptions cho SearchBar từ utils
  const locationOptions = getLocationOptions();

  // Tạo danh mục (dummy) cho SearchBar - Bỏ đi vì không dùng
  /*
  const categoryOptions = [
    { id: "all", name: "Tất cả loại vé" },
    { id: "standard", name: "Vé thường" },
    { id: "vip", name: "Vé VIP" },
    { id: "premium", name: "Vé Premium" },
  ];
  */

  // Tạo appliedFilters để hiển thị badges khi có filter - Bỏ đi vì không dùng
  /*
  const appliedFilters = {
    location: locationFilter,
  };
  */

  // Xử lý khi đang loading
  if (isLoading) {
    // console.log("[MyTickets] Rendering Loading Spinner."); // Di chuyển log ra ngoài JSX hoặc return null
    return (
      <Center h="300px">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Xử lý khi có lỗi
  if (error) {
    // console.log("[MyTickets] Rendering Error Alert with message:", error); // Di chuyển log
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <AlertTitle mr={2}>Lỗi!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Tab container */}
      <Tabs
        variant="soft-rounded"
        colorScheme="teal"
        index={tabIndex}
        onChange={setTabIndex}
        isLazy
      >
        <TabList mb={6}>
          <Tab
            fontWeight="semibold"
            _selected={{ color: activeColor, bg: activeBg }}
            mr={2}
            px={5}
            py={3}
          >
            <Flex align="center">
              <Icon as={FiList} fontSize="18px" mr={2} />
              <Text>Tất cả vé</Text>
              <Badge ml={2} colorScheme="blue" borderRadius="full">
                {filterTickets().length}
              </Badge>
            </Flex>
          </Tab>
          <Tab
            fontWeight="semibold"
            _selected={{ color: activeColor, bg: activeBg }}
            mr={2}
            px={5}
            py={3}
          >
            <Flex align="center">
              <Icon as={FiCalendar} fontSize="18px" mr={2} />
              <Text>Sắp diễn ra</Text>
              <Badge ml={2} colorScheme="green" borderRadius="full">
                {filterTickets("upcoming").length}
              </Badge>
            </Flex>
          </Tab>
          <Tab
            fontWeight="semibold"
            _selected={{ color: activeColor, bg: activeBg }}
            mr={2}
            px={5}
            py={3}
          >
            <Flex align="center">
              <Icon as={FiHistory} fontSize="18px" mr={2} />
              <Text>Đã qua</Text>
              <Badge ml={2} colorScheme="gray" borderRadius="full">
                {filterTickets("past").length}
              </Badge>
            </Flex>
          </Tab>
          {/* Tab "Đã hủy" đã bị ẩn
          <Tab
            fontWeight="semibold"
            _selected={{ color: activeColor, bg: activeBg }}
            px={5}
            py={3}
          >
            <Flex align="center">
              <Icon as={FiX} fontSize="18px" mr={2} />
              <Text>Đã hủy</Text>
              <Badge ml={2} colorScheme="red" borderRadius="full">
                {filterTickets("canceled").length}
              </Badge>
            </Flex>
          </Tab>
          */}
        </TabList>

        {/* SearchBar Component */}
        <SearchBar
          keyword={searchQuery}
          setKeyword={setSearchQuery}
          location={locationFilter}
          setLocation={setLocationFilter}
          onSearch={handleSearch}
          onReset={resetFilters}
          locations={locationOptions}
          showLocationFilter={true}
          showCategoryFilter={false}
          showPriceFilter={false}
          mb={6}
          borderWidth="1px"
          borderColor={borderColor}
          bg={bgColor}
        />

        {/* Tab nội dung */}
        <TabPanels>
          {/* Tab: Tất cả vé */}
          <TabPanel p={0}>
            {/* Log trước khi kiểm tra filteredTickets.length */}
            {/* {console.log("[MyTickets] Rendering 'Tất cả vé' tab. Filtered tickets length:", filteredTickets.length, "isLoading:", isLoading, "error:", error)} */}
            {filteredTickets.length > 0 ? (
              <VStack spacing={6} align="stretch">
                {filteredTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onCancel={handleCancelTicket}
                  />
                ))}
              </VStack>
            ) : (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <AlertTitle mr={2}>Không tìm thấy vé nào!</AlertTitle>
                <AlertDescription>
                  Bạn chưa mua vé cho sự kiện nào hoặc không có vé phù hợp với
                  tìm kiếm hiện tại.
                </AlertDescription>
              </Alert>
            )}
          </TabPanel>

          {/* Tab: Vé sắp diễn ra */}
          <TabPanel p={0}>
            {/* Log cho tab 'Sắp diễn ra' */}
            {/* {console.log("[MyTickets] Rendering 'Sắp diễn ra' tab. Filtered tickets length:", filteredTickets.filter(t => t.status === 'upcoming').length)} */}
            {filteredTickets.filter((ticket) => ticket.status === "upcoming")
              .length > 0 ? (
              <VStack spacing={6} align="stretch">
                {filteredTickets
                  .filter((ticket) => ticket.status === "upcoming")
                  .map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onCancel={handleCancelTicket}
                    />
                  ))}
              </VStack>
            ) : (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <AlertTitle mr={2}>Không có vé sắp tới!</AlertTitle>
                <AlertDescription>
                  Bạn không có vé cho sự kiện sắp diễn ra nào.
                </AlertDescription>
              </Alert>
            )}
          </TabPanel>

          {/* Tab: Vé đã qua */}
          <TabPanel p={0}>
            {/* Log cho tab 'Đã qua' */}
            {/* {console.log("[MyTickets] Rendering 'Đã qua' tab. Filtered tickets length:", filteredTickets.filter(t => t.status === 'past').length)} */}
            {filteredTickets.filter(
              (ticket) => ticket.status === "past" || ticket.status === "used"
            ).length > 0 ? (
              <VStack spacing={6} align="stretch">
                {filteredTickets
                  .filter(
                    (ticket) =>
                      ticket.status === "past" || ticket.status === "used"
                  )
                  .map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onCancel={handleCancelTicket}
                    />
                  ))}
              </VStack>
            ) : (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <AlertTitle mr={2}>Không có vé đã qua!</AlertTitle>
                <AlertDescription>
                  Bạn chưa tham gia sự kiện nào trong quá khứ.
                </AlertDescription>
              </Alert>
            )}
          </TabPanel>

          {/* Tab "Đã hủy" đã bị ẩn
          <TabPanel p={0}>
            {filteredTickets.filter((ticket) => ticket.status === "canceled")
              .length > 0 ? (
              <VStack spacing={6} align="stretch">
                {filteredTickets
                  .filter((ticket) => ticket.status === "canceled")
                  .map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onCancel={handleCancelTicket}
                    />
                  ))}
              </VStack>
            ) : (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <AlertTitle mr={2}>Không có vé đã hủy!</AlertTitle>
                <AlertDescription>Bạn chưa hủy vé nào.</AlertDescription>
              </Alert>
            )}
          </TabPanel>
          */}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

/**
 * Component hiển thị thông tin chi tiết một vé
 */
interface TicketCardProps {
  ticket: Ticket;
  onCancel: (ticketId: string) => void;
}

const TicketCard = ({ ticket, onCancel }: TicketCardProps) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

  // Màu sắc và style cho vé đã check-in
  const usedTicketBg = useColorModeValue("gray.50", "gray.700");
  const usedTicketBorderColor = useColorModeValue("gray.300", "gray.600");
  const watermarkColor = useColorModeValue("gray.200", "gray.600");
  const usedTextColor = useColorModeValue("gray.500", "gray.400");

  // QR Code modal controls
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Badge color dựa vào status
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "green";
      case "past":
        return "gray";
      case "canceled":
        return "red";
      case "used":
        return "purple";
      default:
        return "gray";
    }
  };

  // Text dựa vào status
  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Sắp diễn ra";
      case "past":
        return "Đã kết thúc";
      case "canceled":
        return "Đã hủy";
      case "used":
        return "Đã sử dụng";
      default:
        return "";
    }
  };

  // Kiểm tra xem vé đã được sử dụng chưa
  const isUsedTicket = ticket.status === "used";

  // Style cho card dựa vào trạng thái vé
  const cardStyle = isUsedTicket
    ? {
        bg: usedTicketBg,
        borderColor: usedTicketBorderColor,
        opacity: 0.85,
        position: "relative" as const,
      }
    : {
        bg: cardBg,
        borderColor: borderColor,
      };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      borderColor={cardStyle.borderColor}
      bg={cardStyle.bg}
      boxShadow="sm"
      p={0}
      opacity={cardStyle.opacity}
      position={cardStyle.position}
    >
      {/* Watermark cho vé đã sử dụng */}
      {isUsedTicket && (
        <Flex
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%) rotate(-30deg)"
          zIndex={2}
          pointerEvents="none"
          opacity={0.2}
        >
          <Text
            fontSize="6xl"
            fontWeight="extrabold"
            color={watermarkColor}
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Đã sử dụng
          </Text>
        </Flex>
      )}

      <Flex direction={{ base: "column", md: "row" }}>
        {/* Ảnh sự kiện */}
        <Box
          w={{ base: "100%", md: "200px" }}
          h={{ base: "150px", md: "auto" }}
          bgImage={`url(${ticket.image})`}
          bgSize="cover"
          bgPosition="center"
          filter={isUsedTicket ? "grayscale(0.5)" : "none"}
          position="relative"
        >
          {/* Check-in badge (chỉ hiển thị nếu vé đã check-in) */}
          {isUsedTicket && (
            <Tooltip
              label={`Đã check-in: ${
                ticket.checkInDate || "Không có thông tin"
              }`}
              placement="top"
              hasArrow
            >
              <Circle
                size="40px"
                bg="green.500"
                color="white"
                position="absolute"
                top={2}
                right={2}
                boxShadow="md"
              >
                <Icon as={FiCheckCircle} boxSize={5} />
              </Circle>
            </Tooltip>
          )}
        </Box>

        {/* Thông tin vé */}
        <Box flex="1" p={6}>
          <Flex justify="space-between" align="start" mb={3}>
            <VStack align="start" spacing={1}>
              <Heading
                as="h3"
                size="md"
                color={isUsedTicket ? usedTextColor : textColor}
              >
                {ticket.eventTitle}
              </Heading>
              <HStack>
                <Badge
                  colorScheme={getBadgeColor(ticket.status)}
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  {getStatusText(ticket.status)}
                </Badge>
                <Badge px={2} py={1} borderRadius="full">
                  {ticket.ticketType}
                </Badge>
              </HStack>
            </VStack>
            <Tag size="lg" variant="solid" colorScheme="purple">
              {ticket.price > 0
                ? `${ticket.price.toLocaleString()} VND`
                : "Miễn phí"}
            </Tag>
          </Flex>

          <Divider my={3} />

          <Stack
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            mb={3}
          >
            <VStack align="start" spacing={1}>
              <Flex align="center">
                <Icon as={FiCalendar} mr={2} color="teal.500" />
                <Text
                  fontSize="sm"
                  color={isUsedTicket ? usedTextColor : secondaryTextColor}
                >
                  {ticket.date} • {ticket.startTime}
                </Text>
              </Flex>
              <Flex align="center">
                <Icon as={FiMapPin} mr={2} color="teal.500" />
                <Text
                  fontSize="sm"
                  color={isUsedTicket ? usedTextColor : secondaryTextColor}
                >
                  {ticket.location}
                </Text>
              </Flex>
            </VStack>

            <VStack align="start" spacing={1}>
              <Flex align="center">
                <Icon as={FiClock} mr={2} color="teal.500" />
                <Text
                  fontSize="sm"
                  color={isUsedTicket ? usedTextColor : secondaryTextColor}
                >
                  Ngày mua: {ticket.purchaseDate}
                </Text>
              </Flex>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={isUsedTicket ? usedTextColor : textColor}
              >
                Mã vé: {ticket.id}
              </Text>
              {isUsedTicket && ticket.checkInDate && (
                <Text fontSize="sm" color="green.500" fontWeight="medium">
                  Đã check-in: {ticket.checkInDate}
                </Text>
              )}
            </VStack>
          </Stack>

          <Divider my={3} />

          {/* Nút hành động */}
          <Flex justify="space-between" align="center" mt={3}>
            <Flex>
              <Link to={`/events/${ticket.eventId}`}>
                <Button size="sm" variant="outline" mr={2}>
                  Xem sự kiện
                </Button>
              </Link>
              {ticket.status === "upcoming" && (
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => onCancel(ticket.id)}
                  display="none" // Đã thay đổi để nút không hiển thị nữa
                >
                  Hủy vé
                </Button>
              )}
            </Flex>

            <Flex>
              <Button
                size="sm"
                leftIcon={<FiCode />}
                colorScheme="teal"
                variant="outline"
                mr={2}
                isDisabled={ticket.status === "canceled"}
                onClick={onOpen}
                opacity={isUsedTicket ? 0.7 : 1}
                _hover={isUsedTicket ? {} : { opacity: 0.8 }}
              >
                {isUsedTicket ? "Vé đã sử dụng" : "Xem mã QR"}
              </Button>
              <Button
                size="sm"
                leftIcon={<FiShare2 />}
                colorScheme="blue"
                variant="outline"
                isDisabled={ticket.status === "canceled"}
              >
                Chia sẻ
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Flex>

      {/* Modal hiển thị mã QR */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isUsedTicket ? "Vé đã được sử dụng" : "Mã QR vé của bạn"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="center" py={4}>
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="md"
                borderColor={borderColor}
                bg="white"
                position="relative"
              >
                <QRCode
                  value={ticket.id}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
                {/* Overlay "Đã sử dụng" cho vé đã check-in */}
                {isUsedTicket && (
                  <Flex
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0,0,0,0.1)"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="md"
                  >
                    <Text
                      color="red.500"
                      fontWeight="bold"
                      fontSize="2xl"
                      transform="rotate(-30deg)"
                      bgColor="rgba(255,255,255,0.7)"
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      ĐÃ SỬ DỤNG
                    </Text>
                  </Flex>
                )}
              </Box>
              <Text fontWeight="bold">Mã vé: {ticket.id}</Text>
              {isUsedTicket ? (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Vé đã được sử dụng</AlertTitle>
                    <AlertDescription>
                      Vé này đã được check-in vào{" "}
                      {ticket.checkInDate || "trước đó"}.
                    </AlertDescription>
                  </Box>
                </Alert>
              ) : (
                <Text
                  fontSize="sm"
                  color={secondaryTextColor}
                  textAlign="center"
                >
                  Xuất trình mã QR này khi tham gia sự kiện để xác nhận vé của
                  bạn
                </Text>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MyTickets;
