import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useToast,
  Spinner,
  Center,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Flex,
  useColorModeValue,
  Image,
  Badge,
} from "@chakra-ui/react";
import { FaSearch, FaFilter, FaCalendarAlt, FaTicketAlt } from "react-icons/fa";
import TicketDetails from "../../components/events/TicketDetails";

// Interface mô tả dữ liệu vé
interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventImageUrl: string;
  ticketType: string;
  ticketPrice: number;
  purchaseDate: string;
  attendeeName: string;
  attendeeEmail: string;
  status: "confirmed" | "pending" | "cancelled";
  isOnline: boolean;
  joinUrl?: string;
  organizer: string;
  scanCount: number;
  seatInfo?: string;
  notes?: string;
}

// Dữ liệu mẫu vé
const sampleTickets: Ticket[] = [
  {
    id: "TIX-1234-5678-90AB",
    eventId: "evt-001",
    eventTitle: "Tech Conference 2023",
    eventDate: "15/12/2023",
    eventTime: "09:00 - 17:00",
    eventLocation: "Trung tâm Hội nghị Quốc tế, TP.HCM",
    eventImageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    ticketType: "VIP",
    ticketPrice: 500000,
    purchaseDate: "01/11/2023",
    attendeeName: "Nguyễn Văn A",
    attendeeEmail: "nguyenvana@example.com",
    status: "confirmed",
    isOnline: false,
    organizer: "TechVN",
    scanCount: 0,
    seatInfo: "Khu A, Hàng 5, Ghế 12",
  },
  {
    id: "TIX-2345-6789-01BC",
    eventId: "evt-002",
    eventTitle: "Workshop Thiết kế UX/UI",
    eventDate: "20/12/2023",
    eventTime: "14:00 - 17:00",
    eventLocation: "Online",
    eventImageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692",
    ticketType: "Standard",
    ticketPrice: 200000,
    purchaseDate: "05/11/2023",
    attendeeName: "Nguyễn Văn A",
    attendeeEmail: "nguyenvana@example.com",
    status: "confirmed",
    isOnline: true,
    joinUrl: "https://zoom.us/j/123456789",
    organizer: "DesignHub",
    scanCount: 0,
  },
  {
    id: "TIX-3456-7890-12CD",
    eventId: "evt-003",
    eventTitle: "Hội chợ Ẩm thực Quốc tế",
    eventDate: "25/12/2023",
    eventTime: "10:00 - 22:00",
    eventLocation: "Công viên 23/9, TP.HCM",
    eventImageUrl:
      "https://images.unsplash.com/photo-1536392706976-e486e2ba97af",
    ticketType: "Early Bird",
    ticketPrice: 150000,
    purchaseDate: "10/11/2023",
    attendeeName: "Nguyễn Văn A",
    attendeeEmail: "nguyenvana@example.com",
    status: "pending",
    isOnline: false,
    organizer: "FoodFest",
    scanCount: 0,
    notes: "Bao gồm voucher thức ăn trị giá 50.000đ",
  },
  {
    id: "TIX-4567-8901-23DE",
    eventId: "evt-004",
    eventTitle: "Concert Âm nhạc Dân tộc",
    eventDate: "05/01/2024",
    eventTime: "19:30 - 22:00",
    eventLocation: "Nhà hát Thành phố, TP.HCM",
    eventImageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    ticketType: "Premium",
    ticketPrice: 350000,
    purchaseDate: "15/11/2023",
    attendeeName: "Nguyễn Văn A",
    attendeeEmail: "nguyenvana@example.com",
    status: "cancelled",
    isOnline: false,
    organizer: "Vietnam Cultural Exchange",
    scanCount: 0,
    seatInfo: "Khu B, Hàng 3, Ghế 7",
  },
  {
    id: "TIX-5678-9012-34EF",
    eventId: "evt-005",
    eventTitle: "Hội thảo Khởi nghiệp 2024",
    eventDate: "10/01/2024",
    eventTime: "08:30 - 16:30",
    eventLocation: "Đại học Bách Khoa, TP.HCM",
    eventImageUrl: "https://images.unsplash.com/photo-1559223607-a43c990c692c",
    ticketType: "Student",
    ticketPrice: 50000,
    purchaseDate: "20/11/2023",
    attendeeName: "Nguyễn Văn A",
    attendeeEmail: "nguyenvana@example.com",
    status: "confirmed",
    isOnline: false,
    organizer: "StartupVN",
    scanCount: 0,
  },
];

/**
 * Trang quản lý vé của người dùng
 * Hiển thị danh sách vé đã mua/đăng ký theo trạng thái
 */
export default function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Lấy dữ liệu vé (trong thực tế sẽ từ API)
  useEffect(() => {
    // Giả lập gọi API
    const fetchTickets = async () => {
      try {
        // Trong thực tế, đây sẽ là một API call
        // const response = await api.get('/user/tickets');
        // setTickets(response.data);

        // Dùng dữ liệu mẫu
        setTimeout(() => {
          setTickets(sampleTickets);
          setFilteredTickets(sampleTickets);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu vé:", error);
        toast({
          title: "Không thể tải dữ liệu vé",
          description: "Vui lòng thử lại sau",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [toast]);

  // Xử lý lọc vé
  useEffect(() => {
    let result = tickets;

    // Lọc theo trạng thái
    if (filterStatus !== "all") {
      result = result.filter((ticket) => ticket.status === filterStatus);
    }

    // Lọc theo thời gian
    const today = new Date();
    // const todayStr = today.toISOString().split("T")[0];

    if (filterDate === "upcoming") {
      result = result.filter((ticket) => {
        const eventDate = new Date(
          ticket.eventDate.split("/").reverse().join("-")
        );
        return eventDate >= today;
      });
    } else if (filterDate === "past") {
      result = result.filter((ticket) => {
        const eventDate = new Date(
          ticket.eventDate.split("/").reverse().join("-")
        );
        return eventDate < today;
      });
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (ticket) =>
          ticket.eventTitle.toLowerCase().includes(term) ||
          ticket.organizer.toLowerCase().includes(term) ||
          ticket.eventLocation.toLowerCase().includes(term) ||
          ticket.id.toLowerCase().includes(term)
      );
    }

    setFilteredTickets(result);
  }, [tickets, searchTerm, filterStatus, filterDate]);

  // Xử lý xem chi tiết vé
  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    onOpen();
  };

  // Xử lý tải xuống vé
  const handleDownloadTicket = () => {
    toast({
      title: "Đang tải xuống vé",
      description: "Vé của bạn sẽ được tải xuống trong giây lát",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    // Trong thực tế, đây sẽ gọi API để tải xuống vé
  };

  // Xử lý gửi lại vé qua email
  const handleEmailTicket = () => {
    toast({
      title: "Đã gửi vé qua email",
      description: "Vé đã được gửi đến địa chỉ email của bạn",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    // Trong thực tế, đây sẽ gọi API để gửi lại vé qua email
  };

  // Component hiển thị tóm tắt vé
  const TicketCard = ({ ticket }: { ticket: Ticket }) => {
    let statusColor;
    switch (ticket.status) {
      case "confirmed":
        statusColor = "green";
        break;
      case "pending":
        statusColor = "yellow";
        break;
      case "cancelled":
        statusColor = "red";
        break;
      default:
        statusColor = "gray";
    }

    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        borderColor={borderColor}
        bg={bgColor}
        boxShadow="sm"
        onClick={() => handleViewTicket(ticket)}
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
      >
        <Box position="relative">
          <Image
            src={ticket.eventImageUrl}
            alt={ticket.eventTitle}
            height="120px"
            width="100%"
            objectFit="cover"
            filter="brightness(0.8)"
          />
          <Badge
            position="absolute"
            top="10px"
            right="10px"
            px="2"
            py="1"
            borderRadius="md"
            colorScheme={statusColor}
          >
            {ticket.status === "confirmed"
              ? "Đã xác nhận"
              : ticket.status === "pending"
              ? "Đang xử lý"
              : "Đã hủy"}
          </Badge>
        </Box>
        <Box p="4">
          <Text fontWeight="bold" fontSize="md" noOfLines={1}>
            {ticket.eventTitle}
          </Text>
          <HStack mt="2" spacing="4">
            <HStack spacing="1">
              <FaCalendarAlt size="12" />
              <Text fontSize="xs">{ticket.eventDate}</Text>
            </HStack>
            <HStack spacing="1">
              <FaTicketAlt size="12" />
              <Text fontSize="xs">{ticket.ticketType}</Text>
            </HStack>
          </HStack>
          <Text mt="2" fontSize="xs" color="gray.500">
            {ticket.isOnline ? "Sự kiện trực tuyến" : ticket.eventLocation}
          </Text>
        </Box>
      </Box>
    );
  };

  return (
    <Box maxW="container.xl" mx="auto" py="8" px={{ base: "4", md: "8" }}>
      <VStack spacing="6" align="stretch">
        <Box>
          <Heading size="lg">Vé của tôi</Heading>
          <Text mt="1" color="gray.600">
            Quản lý và xem tất cả vé sự kiện của bạn
          </Text>
        </Box>

        {/* Bộ lọc và tìm kiếm */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap="4"
          align={{ base: "stretch", md: "center" }}
        >
          <InputGroup maxW={{ base: "100%", md: "400px" }}>
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm vé theo tên sự kiện, địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <HStack spacing="4">
            <HStack>
              <FaFilter size="14" />
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                size="md"
                w={{ base: "full", md: "auto" }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="pending">Đang xử lý</option>
                <option value="cancelled">Đã hủy</option>
              </Select>
            </HStack>

            <HStack>
              <FaCalendarAlt size="14" />
              <Select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                size="md"
                w={{ base: "full", md: "auto" }}
              >
                <option value="all">Tất cả thời gian</option>
                <option value="upcoming">Sắp diễn ra</option>
                <option value="past">Đã diễn ra</option>
              </Select>
            </HStack>
          </HStack>
        </Flex>

        {/* Danh sách vé */}
        <Box>
          {isLoading ? (
            <Center p="8">
              <VStack>
                <Spinner size="xl" />
                <Text mt="4">Đang tải vé...</Text>
              </VStack>
            </Center>
          ) : filteredTickets.length === 0 ? (
            <Center p="8" borderWidth="1px" borderRadius="md">
              <VStack>
                <Box fontSize="5xl">🎫</Box>
                <Heading size="md">Không tìm thấy vé nào</Heading>
                <Text textAlign="center">
                  {searchTerm || filterStatus !== "all" || filterDate !== "all"
                    ? "Thử thay đổi bộ lọc để tìm kiếm lại"
                    : "Bạn chưa đăng ký tham gia sự kiện nào."}
                </Text>
                {searchTerm ||
                filterStatus !== "all" ||
                filterDate !== "all" ? (
                  <Button
                    mt="2"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                      setFilterDate("all");
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                ) : (
                  <Button mt="2" colorScheme="teal">
                    Khám phá sự kiện
                  </Button>
                )}
              </VStack>
            </Center>
          ) : (
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
              spacing="6"
              mt="4"
            >
              {filteredTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>

      {/* Modal xem chi tiết vé */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p="5">
            {selectedTicket && (
              <TicketDetails
                ticket={selectedTicket}
                onDownload={handleDownloadTicket}
                onEmailTicket={handleEmailTicket}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
