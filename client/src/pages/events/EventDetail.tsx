import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  useToast,
  IconButton,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiShare2,
  FiHeart,
} from "react-icons/fi";
import {
  FaTimes,
  FaCalendarCheck,
  FaShoppingCart,
  FaTicketAlt,
} from "react-icons/fa";
import eventService from "../../services/event.service";

// Interface cho dữ liệu sự kiện
interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  imageUrl: string;
  category: string;
  isPaid: boolean;
  price?: number;
  ticketTypes?: {
    id: string;
    name: string;
    price: number;
  }[];
  organizer: {
    name: string;
    avatar?: string;
    id?: string;
  };
  attendees: number;
  capacity: number;
}

const EventDetail = () => {
  // Lấy ID sự kiện từ URL
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const navigate = useNavigate();

  // State cho các trạng thái trong trang
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Màu sắc thay đổi theo chế độ màu
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const infoBoxBgColor = useColorModeValue("gray.50", "gray.700");
  const infoBoxTextColor = useColorModeValue("gray.600", "gray.300");
  const iconColor = useColorModeValue("teal.500", "teal.300");

  // Lấy thông tin sự kiện từ API khi component mount
  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const eventData = await eventService.getEventById(id);

        // Debug: Log dữ liệu API trả về để kiểm tra
        console.log("API response data:", eventData);

        // Format dữ liệu từ API để phù hợp với cấu trúc giao diện
        const formattedEvent: EventData = {
          id: eventData.id || id,
          title: eventData.title || "Untitled Event",
          description: eventData.description || "No description available",
          date: eventData.date
            ? new Date(eventData.date).toLocaleDateString("vi-VN")
            : "No date specified",
          startTime: eventData.startTime || "N/A",
          endTime: eventData.endTime || "N/A",
          location: eventData.location || "No location specified",
          address: eventData.address || "No address specified",
          imageUrl:
            eventData.imageUrl ||
            "https://via.placeholder.com/800x400?text=No+Image+Available",
          category: eventData.category || "Other",
          isPaid: Boolean(eventData.isPaid),
          price: eventData.price || 0,
          ticketTypes: eventData.ticketTypes || [],
          organizer: eventData.organizer || {
            name: "Unknown Organizer",
            avatar:
              "https://ui-avatars.com/api/?name=Unknown&background=0D8ABC&color=fff",
          },
          attendees: eventData.attendees || 0,
          capacity: eventData.capacity || 50,
        };

        // Debug: Log event đã format để kiểm tra
        console.log("Formatted event:", formattedEvent);

        setEvent(formattedEvent);

        // TODO: Khi có backend, sẽ kiểm tra nếu người dùng đã đăng ký hoặc lưu sự kiện
        // Ví dụ:
        // const isEventSaved = await eventService.isEventSaved(id);
        // setIsSaved(isEventSaved.isSaved);
      } catch (error: unknown) {
        console.error("Error fetching event:", error);
        let errorMessage = "Có lỗi xảy ra khi tải dữ liệu sự kiện";

        // Xử lý lỗi từ axios
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          if (axiosError.response?.data?.message) {
            errorMessage = axiosError.response.data.message;
          }
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  // Hàm mới để xử lý hiển thị giá vé
  const getDisplayPrice = () => {
    if (!event) return "Đang tải...";

    if (!event.isPaid) {
      return "Miễn phí";
    }

    const paidTicketTypes =
      event.ticketTypes?.filter((tt) => tt.price > 0) || [];
    const freeTicketTypes =
      event.ticketTypes?.filter((tt) => tt.price === 0) || [];

    if (event.ticketTypes && event.ticketTypes.length > 0) {
      if (paidTicketTypes.length === 0 && freeTicketTypes.length > 0) {
        return "Miễn phí"; // Tất cả các loại vé đều miễn phí
      }

      if (paidTicketTypes.length === 1) {
        return `${paidTicketTypes[0].price.toLocaleString("vi-VN")} VND`;
      }

      if (paidTicketTypes.length > 1) {
        const prices = paidTicketTypes.map((tt) => tt.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        if (minPrice === maxPrice) {
          return `${minPrice.toLocaleString("vi-VN")} VND`;
        }
        return `${minPrice.toLocaleString("vi-VN")} - ${maxPrice.toLocaleString(
          "vi-VN"
        )} VND`;
      }
    }

    // Fallback: Nếu isPaid là true nhưng không có ticketTypes hoặc không có paidTicketTypes nào
    // thì sử dụng event.price (nếu có và > 0), ngược lại là "Miễn phí"
    if (event.price && event.price > 0) {
      return `${event.price.toLocaleString("vi-VN")} VND`;
    }

    return "Miễn phí"; // Mặc định nếu không có thông tin giá cụ thể nào
  };

  // Xử lý đăng ký tham gia sự kiện
  const handleRegister = () => {
    // Nếu đã đăng ký, hủy đăng ký
    if (isRegistered) {
      setIsRegistered(false);
      toast({
        title: "Hủy đăng ký thành công",
        description: "Bạn đã hủy đăng ký tham gia sự kiện này.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    /* 
      TODO: Khi có backend, cần thực hiện các bước:
      1. Gọi API để đăng ký sự kiện (POST /api/events/:id/register)
      2. Kiểm tra nếu sự kiện có phí:
         - Lưu trạng thái đăng ký là "pending"
         - Chuyển người dùng đến trang thanh toán
      3. Nếu sự kiện miễn phí:
         - Lưu trạng thái đăng ký là "confirmed"
         - Hiển thị thông báo thành công
    */

    // DEMO: Luôn đăng ký thành công cho sự kiện miễn phí
    setIsRegistered(true);
    toast({
      title: "Đăng ký thành công!",
      description: "Bạn đã đăng ký tham gia sự kiện này thành công.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Xử lý lưu sự kiện
  const handleSaveEvent = async () => {
    if (!id) return;

    try {
      if (isSaved) {
        // Nếu đã lưu, gọi API để bỏ lưu
        await eventService.unsaveEvent(id);
        setIsSaved(false);
        toast({
          title: "Đã xóa khỏi sự kiện đã lưu",
          description: "Sự kiện đã được xóa khỏi danh sách đã lưu của bạn.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Nếu chưa lưu, gọi API để lưu
        await eventService.saveEvent(id);
        setIsSaved(true);
        toast({
          title: "Đã lưu sự kiện!",
          description:
            "Bạn có thể xem lại sự kiện này trong mục 'Sự kiện đã lưu'.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: unknown) {
      console.error("Error saving/unsaving event:", error);

      let errorMessage = "Không thể lưu/hủy lưu sự kiện. Vui lòng thử lại sau.";
      // Xử lý lỗi từ axios
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      toast({
        title: "Có lỗi xảy ra",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Xử lý chia sẻ sự kiện
  const handleShare = () => {
    // Logic chia sẻ sẽ được thêm sau khi có backend
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Đã sao chép liên kết!",
        description: "Liên kết sự kiện đã được sao chép vào clipboard.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    });
  };

  // Xử lý chuyển tới trang thanh toán
  const handleBuyTicket = () => {
    /*
      TODO: Khi có backend, logic sẽ như sau:
      1. Gọi API để tạo đơn hàng (POST /api/events/:id/checkout)
      2. API trả về thông tin đơn hàng bao gồm paymentUrl
      3. Chuyển người dùng đến trang thanh toán (paymentUrl)
      4. Sau khi thanh toán, webhook sẽ cập nhật trạng thái đăng ký thành "confirmed"
      5. Chuyển người dùng trở lại trang chi tiết sự kiện với trạng thái đã đăng ký
    */

    // DEMO: Chỉ chuyển hướng đến trang thanh toán giả lập
    if (event && event.id) {
      navigate(`/events/${event.id}/checkout`);
      toast({
        title: "Chuyển đến thanh toán",
        description: "Hoàn tất thanh toán để đảm bảo đăng ký của bạn.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Hiển thị trạng thái tải dữ liệu
  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" color="teal.500" thickness="4px" />
        </Flex>
      </Container>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex direction="column" justify="center" align="center" minH="60vh">
          <Heading size="lg" mb={4} color="red.500">
            Có lỗi xảy ra
          </Heading>
          <Text mb={6}>{error}</Text>
          <Button colorScheme="teal" onClick={() => navigate("/events")}>
            Quay lại danh sách sự kiện
          </Button>
        </Flex>
      </Container>
    );
  }

  // Hiển thị thông báo nếu không tìm thấy sự kiện
  if (!event) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex direction="column" justify="center" align="center" minH="60vh">
          <Heading size="lg" mb={4}>
            Không tìm thấy sự kiện
          </Heading>
          <Text mb={6}>Sự kiện này không tồn tại hoặc đã bị xóa</Text>
          <Button colorScheme="teal" onClick={() => navigate("/events")}>
            Quay lại danh sách sự kiện
          </Button>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* Phần hình ảnh và thông tin cơ bản của sự kiện */}
      <Box position="relative" mb={8} bg={bgColor} borderRadius="lg">
        <Image
          src={event.imageUrl}
          alt={event.title}
          w="100%"
          h={{ base: "200px", md: "400px" }}
          objectFit="cover"
          borderRadius="lg"
        />

        {/* Badge thể loại và trạng thái */}
        <HStack position="absolute" top={4} right={4} spacing={2}>
          <Badge
            colorScheme="teal"
            fontSize="sm"
            px={2}
            py={1}
            borderRadius="md"
          >
            {event.category}
          </Badge>
          <Badge
            colorScheme={event.isPaid ? "purple" : "green"}
            fontSize="sm"
            px={2}
            py={1}
            borderRadius="md"
          >
            {event.isPaid ? "Có phí" : "Miễn phí"}
          </Badge>
        </HStack>
      </Box>

      {/* Grid layout cho nội dung */}
      <Flex direction={{ base: "column", lg: "row" }} gap={8} mb={10}>
        {/* Cột thông tin chi tiết sự kiện */}
        <Box
          flex="2"
          bg={bgColor}
          p={6}
          borderRadius="lg"
          borderColor={borderColor}
          borderWidth="1px"
        >
          <VStack align="start" spacing={5}>
            {/* Tiêu đề và nút tương tác */}
            <Flex
              w="100%"
              justify="space-between"
              align={{ base: "start", sm: "center" }}
              direction={{ base: "column", sm: "row" }}
              gap={{ base: 4, sm: 0 }}
            >
              <Heading as="h1" size="xl" color={textColor}>
                {event.title}
              </Heading>

              <HStack spacing={2}>
                <IconButton
                  aria-label="Save event"
                  icon={<FiHeart fill={isSaved ? "red" : "none"} />}
                  onClick={handleSaveEvent}
                  variant="outline"
                  colorScheme={isSaved ? "red" : "gray"}
                />
                <IconButton
                  aria-label="Share event"
                  icon={<FiShare2 />}
                  onClick={handleShare}
                  variant="outline"
                />
              </HStack>
            </Flex>

            {/* Chi tiết về thời gian và địa điểm */}
            <VStack align="start" spacing={3} w="100%">
              <Flex align="center" gap={2}>
                <Box as={FiCalendar} color={iconColor} />
                <Text fontWeight="medium" color={textColor}>
                  {event.date}
                </Text>
              </Flex>

              <Flex align="center" gap={2}>
                <Box as={FiClock} color={iconColor} />
                <Text color={textColor}>
                  {event.startTime} - {event.endTime}
                </Text>
              </Flex>

              <Flex align="start" gap={2}>
                <Box as={FiMapPin} color={iconColor} mt={1} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="medium" color={textColor}>
                    {event.location}
                  </Text>
                  <Text fontSize="sm" color={secondaryTextColor}>
                    {event.address}
                  </Text>
                </VStack>
              </Flex>

              <Flex align="center" gap={2}>
                <Box as={FiDollarSign} color={iconColor} />
                <Text fontWeight="bold" color={textColor}>
                  {getDisplayPrice()}
                </Text>
              </Flex>

              <Flex align="center" gap={2}>
                <Box as={FiUsers} color={iconColor} />
                <Text color={textColor}>
                  {event.attendees} đã đăng ký / {event.capacity} chỗ
                </Text>
              </Flex>

              <Flex align="center" gap={2} w="100%">
                <Box as={FiUsers} color={iconColor} />
                <Text fontWeight="medium">Tổ chức:</Text>
                <Text>{event.organizer.name}</Text>
              </Flex>
            </VStack>

            <Divider borderColor={borderColor} />

            {/* Mô tả sự kiện */}
            <Box>
              <Heading as="h3" size="md" mb={3} color={textColor}>
                Về Sự Kiện Này
              </Heading>
              <Text color={textColor}>{event.description}</Text>
            </Box>
          </VStack>
        </Box>

        {/* Cột thông tin đăng ký và chi tiết */}
        <Box
          flex="1"
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          height="fit-content"
          position="sticky"
          top="100px"
          bg={cardBgColor}
          borderColor={borderColor}
        >
          <VStack spacing={5} align="stretch">
            <Heading size="md" color={textColor}>
              Đăng Ký
            </Heading>

            <VStack align="start" spacing={3}>
              <Flex align="center" gap={2}>
                <Box as={FiCalendar} color={iconColor} />
                <Text fontWeight="medium" color={textColor}>
                  {event.date}
                </Text>
              </Flex>

              <Flex align="center" gap={2}>
                <Box as={FiClock} color={iconColor} />
                <Text color={textColor}>
                  {event.startTime} - {event.endTime}
                </Text>
              </Flex>
            </VStack>

            <Box bg={infoBoxBgColor} p={3} borderRadius="md">
              <Text fontWeight="medium" color={textColor}>
                {event.attendees} người đã đăng ký
              </Text>
              <Text fontSize="sm" color={infoBoxTextColor}>
                Còn {event.capacity - event.attendees} chỗ trống
              </Text>
            </Box>

            {/* Hiển thị trạng thái đăng ký */}
            {isRegistered && (
              <Box
                bg="green.50"
                color="green.700"
                p={3}
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="green.400"
                _dark={{
                  bg: "green.900",
                  color: "green.200",
                  borderColor: "green.500",
                }}
              >
                <Flex align="center" gap={2}>
                  <Box as={FaCalendarCheck} />
                  <Text fontWeight="medium">
                    Bạn đã đăng ký tham gia sự kiện này
                  </Text>
                </Flex>
              </Box>
            )}

            {/* Phần điều khiển: đăng ký và mua vé */}
            <Box w="full" display="flex" flexDirection="column" gap={4} mt={6}>
              {/* 
                Cập nhật logic hiển thị nút:
                - Nếu sự kiện miễn phí (`event.isPaid === false`), hiển thị nút "Đăng ký tham gia". 
                  Khi nhấn, sẽ điều hướng đến trang checkout (tương tự như Mua vé).
                - Nếu sự kiện có phí (`event.isPaid === true`), hiển thị nút "Mua vé".
                - Logic `isRegistered` vẫn giữ để xử lý việc "Hủy đăng ký".
              */}

              {event.isPaid ? (
                // === SỰ KIỆN CÓ PHÍ ===
                isRegistered ? (
                  <Button
                    colorScheme="green" // Màu sắc cho nút khi đã mua vé
                    size="lg"
                    width="full"
                    onClick={() => navigate("/user/tickets")} // Điều hướng đến /user/tickets
                    leftIcon={<FaTicketAlt />} // Biểu tượng vé
                  >
                    Xem vé của bạn
                  </Button>
                ) : (
                  <Button
                    colorScheme="blue"
                    size="lg"
                    width="full"
                    onClick={handleBuyTicket} // Điều hướng đến /checkout
                    leftIcon={<FaShoppingCart />}
                  >
                    Mua Vé
                  </Button>
                )
              ) : (
                // === SỰ KIỆN MIỄN PHÍ ===
                <Button
                  colorScheme={isRegistered ? "red" : "teal"}
                  size="lg"
                  width="full"
                  // Nếu chưa đăng ký, hành động "Đăng ký tham gia" sẽ mở trang checkout (giống Mua vé)
                  // Nếu đã đăng ký, hành động là "Hủy đăng ký"
                  onClick={isRegistered ? handleRegister : handleBuyTicket}
                  leftIcon={isRegistered ? <FaTimes /> : <FaCalendarCheck />}
                >
                  {isRegistered ? "Hủy Đăng Ký" : "Đăng Ký Tham Gia"}
                </Button>
              )}
            </Box>
          </VStack>
        </Box>
      </Flex>

      {/* Phần sự kiện liên quan */}
      <Box mt={10}>
        <Heading size="lg" mb={6} color={textColor}>
          Sự Kiện Tương Tự
        </Heading>
        <Text color={secondaryTextColor}>
          Sắp ra mắt... Sự kiện tương tự sẽ được hiển thị khi kết nối với
          backend.
        </Text>
      </Box>
    </Container>
  );
};

export default EventDetail;
