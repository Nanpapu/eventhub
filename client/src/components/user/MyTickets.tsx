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
  SimpleGrid,
  VStack,
  HStack,
  Stack,
  Image,
  Icon,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tag,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FiCalendar,
  FiMapPin,
  FiDownload,
  FiShare2,
  FiClock,
  FiSearch,
  FiFilter,
  FiList,
  FiCheck,
  FiClock as FiHistory,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";

// Interface cho dữ liệu vé
interface Ticket {
  id: string;
  eventId: number;
  eventTitle: string;
  date: string;
  startTime: string;
  location: string;
  image: string;
  ticketType: string;
  price: number;
  purchaseDate: string;
  qrCode: string;
  status: "upcoming" | "past" | "canceled";
}

// Dữ liệu mẫu cho vé
const ticketsData: Ticket[] = [
  {
    id: "TK-2023-001",
    eventId: 501,
    eventTitle: "TechConf 2023",
    date: "20/10/2023",
    startTime: "09:00 AM",
    location: "Convention Center",
    image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
    ticketType: "VIP",
    price: 299.99,
    purchaseDate: "05/09/2023",
    qrCode:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-2023-001",
    status: "upcoming",
  },
  {
    id: "TK-2023-002",
    eventId: 502,
    eventTitle: "Classical Music Night",
    date: "15/10/2023",
    startTime: "07:30 PM",
    location: "Opera House",
    image: "https://images.pexels.com/photos/7095506/pexels-photo-7095506.jpeg",
    ticketType: "Standard",
    price: 49.99,
    purchaseDate: "01/09/2023",
    qrCode:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-2023-002",
    status: "upcoming",
  },
  {
    id: "TK-2023-003",
    eventId: 503,
    eventTitle: "Photography Workshop",
    date: "05/09/2023",
    startTime: "10:00 AM",
    location: "Art Studio",
    image: "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg",
    ticketType: "Standard",
    price: 25.0,
    purchaseDate: "20/08/2023",
    qrCode:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-2023-003",
    status: "past",
  },
  {
    id: "TK-2023-004",
    eventId: 504,
    eventTitle: "AI Summit",
    date: "10/08/2023",
    startTime: "09:30 AM",
    location: "Tech Campus",
    image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg",
    ticketType: "Premium",
    price: 199.99,
    purchaseDate: "15/07/2023",
    qrCode:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-2023-004",
    status: "past",
  },
  {
    id: "TK-2023-005",
    eventId: 505,
    eventTitle: "Startup Meetup",
    date: "25/08/2023",
    startTime: "06:00 PM",
    location: "Innovation Hub",
    image: "https://images.pexels.com/photos/7515916/pexels-photo-7515916.jpeg",
    ticketType: "Standard",
    price: 0,
    purchaseDate: "10/08/2023",
    qrCode:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TK-2023-005",
    status: "canceled",
  },
];

/**
 * Component hiển thị danh sách vé của người dùng
 */
const MyTickets = () => {
  // State để lưu tab đang active
  const [tabIndex, setTabIndex] = useState(0);

  // State lọc và tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");

  // State lưu dữ liệu vé
  const [tickets, setTickets] = useState<Ticket[]>(ticketsData);

  // Màu sắc theo theme
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const iconColor = useColorModeValue("gray.500", "gray.400");
  const activeBg = useColorModeValue("teal.50", "teal.900");
  const activeColor = useColorModeValue("teal.600", "teal.200");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardHoverBg = useColorModeValue("gray.50", "gray.700");

  // Lọc vé theo tab và tìm kiếm
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.eventTitle
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (tabIndex === 0) {
      // Tất cả vé
      return matchesSearch;
    } else if (tabIndex === 1) {
      // Vé sắp tới
      return matchesSearch && ticket.status === "upcoming";
    } else if (tabIndex === 2) {
      // Vé đã qua
      return matchesSearch && ticket.status === "past";
    } else {
      // Vé đã hủy
      return matchesSearch && ticket.status === "canceled";
    }
  });

  // Xử lý hủy vé
  const handleCancelTicket = (ticketId: string) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: "canceled" } : ticket
      )
    );
    // Trong thực tế sẽ gọi API để hủy vé
  };

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
                {tickets.length}
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
                {tickets.filter((t) => t.status === "upcoming").length}
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
                {tickets.filter((t) => t.status === "past").length}
              </Badge>
            </Flex>
          </Tab>
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
                {tickets.filter((t) => t.status === "canceled").length}
              </Badge>
            </Flex>
          </Tab>
        </TabList>

        {/* Search bar */}
        <Box mb={6}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiSearch color={iconColor} />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm vé theo tên sự kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg={bgColor}
              borderColor={borderColor}
            />
          </InputGroup>
        </Box>

        {/* Tab nội dung */}
        <TabPanels>
          {/* Tab: Tất cả vé */}
          <TabPanel p={0}>
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
                <AlertTitle mr={2}>Không có vé sắp tới!</AlertTitle>
                <AlertDescription>
                  Bạn không có vé cho sự kiện sắp diễn ra nào.
                </AlertDescription>
              </Alert>
            )}
          </TabPanel>

          {/* Tab: Vé đã qua */}
          <TabPanel p={0}>
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
                <AlertTitle mr={2}>Không có vé đã qua!</AlertTitle>
                <AlertDescription>
                  Bạn chưa tham gia sự kiện nào trong quá khứ.
                </AlertDescription>
              </Alert>
            )}
          </TabPanel>

          {/* Tab: Vé đã hủy */}
          <TabPanel p={0}>
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
                <AlertTitle mr={2}>Không có vé đã hủy!</AlertTitle>
                <AlertDescription>Bạn chưa hủy vé nào.</AlertDescription>
              </Alert>
            )}
          </TabPanel>
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

  // Badge color dựa vào status
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "green";
      case "past":
        return "gray";
      case "canceled":
        return "red";
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
      default:
        return "";
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      borderColor={borderColor}
      boxShadow="sm"
      p={0}
    >
      <Flex direction={{ base: "column", md: "row" }}>
        {/* Ảnh sự kiện */}
        <Box
          w={{ base: "100%", md: "200px" }}
          h={{ base: "150px", md: "auto" }}
          bgImage={`url(${ticket.image})`}
          bgSize="cover"
          bgPosition="center"
        />

        {/* Thông tin vé */}
        <Box flex="1" p={6}>
          <Flex justify="space-between" align="start" mb={3}>
            <VStack align="start" spacing={1}>
              <Heading as="h3" size="md" color={textColor}>
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
                <Text fontSize="sm" color={secondaryTextColor}>
                  {ticket.date} • {ticket.startTime}
                </Text>
              </Flex>
              <Flex align="center">
                <Icon as={FiMapPin} mr={2} color="teal.500" />
                <Text fontSize="sm" color={secondaryTextColor}>
                  {ticket.location}
                </Text>
              </Flex>
            </VStack>

            <VStack align="start" spacing={1}>
              <Flex align="center">
                <Icon as={FiClock} mr={2} color="teal.500" />
                <Text fontSize="sm" color={secondaryTextColor}>
                  Ngày mua: {ticket.purchaseDate}
                </Text>
              </Flex>
              <Text fontSize="sm" fontWeight="medium">
                Mã vé: {ticket.id}
              </Text>
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
                >
                  Hủy vé
                </Button>
              )}
            </Flex>

            <Flex>
              <Button
                size="sm"
                leftIcon={<FiDownload />}
                colorScheme="teal"
                variant="outline"
                mr={2}
                isDisabled={ticket.status === "canceled"}
              >
                Tải vé
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
    </Box>
  );
};

export default MyTickets;
