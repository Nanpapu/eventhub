import {
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Heading,
  Text,
  useColorModeValue,
  Flex,
  Button,
  SimpleGrid,
  Badge,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link as ChakraLink,
  HStack,
  IconButton,
  Icon,
  Spinner,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  FiCalendar,
  FiMapPin,
  FiEdit,
  FiPlus,
  FiX,
  FiGrid,
  FiBookmark,
  FiUserPlus,
} from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { SearchBar } from "../../components/common";
import eventService from "../../services/event.service";
import { getCategoryName, getCategoryOptions } from "../../utils/categoryUtils";
import { getLocationOptions } from "../../utils/locationUtils";
import useAuth from "../../hooks/useAuth";

// Interface cho dữ liệu sự kiện thô từ API (cho cả myEvents và savedEvents)
interface ApiEventDto {
  _id: string; // Thường là _id từ MongoDB
  id: string; // Virtual id
  title: string;
  description: string;
  date: string | Date; // API có thể trả về string, cần chuyển đổi
  startTime: string;
  endTime?: string;
  location: string;
  address?: string;
  imageUrl?: string;
  category: string;
  isPaid: boolean;
  price?: number;
  organizer: {
    _id?: string;
    id?: string;
    name: string;
    avatar?: string;
  };
  attendees?: number; // Số người tham gia (cho sự kiện của tôi)
  // Các trường khác có thể có từ API
  createdAt?: string | Date;
  updatedAt?: string | Date;
  // Dành cho ticketTypes nếu có, cấu trúc tùy theo API
  ticketTypes?: {
    id: string;
    _id: string;
    name: string;
    price: number;
    quantity: number;
    availableQuantity: number;
  }[];
}

// Interface cho dữ liệu sự kiện đã được format để hiển thị
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  location: string;
  image?: string;
  imageUrl?: string;
  category: string;
  isPaid: boolean;
  price?: number;
  organizer: {
    id?: string;
    name: string;
    avatar?: string;
  };
  isOwner?: boolean;
  participants?: number;
  // Thêm những trường có thể có từ API
  address?: string;
  endTime?: string;
  isHidden?: boolean;
}

// Format categories cho SearchBar
const categoryOptions = getCategoryOptions();

/**
 * Component quản lý sự kiện - hiển thị trong tab Sự kiện của UserDashboard
 */
const EventManagement = () => {
  // State cho tab đang active
  const [tabIndex, setTabIndex] = useState(0);

  // State cho tìm kiếm và lọc
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showPaidOnly, setShowPaidOnly] = useState(false);

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const eventsPerPage = 6; // Số sự kiện mỗi trang, đồng bộ với SearchResults

  // State lưu dữ liệu sự kiện
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [isMyEventsLoading, setIsMyEventsLoading] = useState(false);
  const [myEventsError, setMyEventsError] = useState<string | null>(null);

  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [isSavedEventsLoading, setIsSavedEventsLoading] = useState(false);
  const [savedEventsError, setSavedEventsError] = useState<string | null>(null);

  // Màu sắc theo theme
  const tabBg = useColorModeValue("white", "gray.800");
  const activeBg = useColorModeValue("teal.50", "teal.900");
  const activeColor = useColorModeValue("teal.600", "teal.200");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardHoverBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

  // Toast thông báo
  const toast = useToast();

  // Lấy thông tin người dùng để kiểm tra vai trò
  const { user } = useAuth();
  const isOrganizer = user?.role === "organizer";

  // Fetch "Sự kiện của tôi" (sự kiện do người dùng tạo)
  useEffect(() => {
    const fetchMyEvents = async () => {
      setIsMyEventsLoading(true);
      setMyEventsError(null);
      try {
        const response = await eventService.getUserEvents(); // API call
        if (response.success && Array.isArray(response.events)) {
          const formattedEvents: Event[] = response.events.map(
            (event: ApiEventDto) => ({
              id: event.id || event._id, // Ưu tiên id (virtual) nếu có, fallback về _id
              title: event.title || "Sự kiện không có tiêu đề",
              description: event.description || "Không có mô tả",
              date: event.date
                ? new Date(event.date).toLocaleDateString("vi-VN")
                : "Chưa có ngày",
              startTime: event.startTime || "N/A",
              endTime: event.endTime || "N/A",
              location: event.location || "Chưa có địa điểm",
              address: event.address || "Chưa có địa chỉ",
              image: event.imageUrl, // API trả về imageUrl
              imageUrl: event.imageUrl,
              category: event.category || "other",
              isPaid: event.isPaid || false,
              price: event.price || 0,
              organizer: {
                id: event.organizer?.id || event.organizer?._id,
                name: event.organizer?.name || "Người tổ chức ẩn danh",
                avatar: event.organizer?.avatar,
              },
              isOwner: true, // Sự kiện của tôi luôn là owner
              participants: event.attendees || 0, // API trả về attendees
            })
          );
          setMyEvents(formattedEvents);
          setTotalEvents(formattedEvents.length);
          setTotalPages(Math.ceil(formattedEvents.length / eventsPerPage));
        } else {
          setMyEventsError(
            response.message || "Không thể tải danh sách sự kiện của bạn."
          );
        }
      } catch (err: unknown) {
        const error = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        console.error("Error fetching my events:", error);
        setMyEventsError(
          error.response?.data?.message ||
            error.message || // Thêm error.message
            "Có lỗi xảy ra khi tải sự kiện của bạn."
        );
      } finally {
        setIsMyEventsLoading(false);
      }
    };

    fetchMyEvents();
  }, [eventsPerPage]);

  // Fetch saved events từ API
  useEffect(() => {
    const fetchSavedEvents = async () => {
      setIsSavedEventsLoading(true);
      setSavedEventsError(null);

      try {
        const response = await eventService.getSavedEvents();

        if (response.success && Array.isArray(response.events)) {
          // Format dữ liệu từ API để phù hợp với cấu trúc Event
          const formattedEvents: Event[] = response.events.map(
            (event: ApiEventDto) => ({
              // Sử dụng ApiEventDto
              id: event.id || event._id,
              title: event.title || "Untitled Event",
              description: event.description || "No description",
              date: event.date
                ? new Date(event.date).toLocaleDateString("vi-VN")
                : "No date specified",
              startTime: event.startTime || "N/A",
              endTime: event.endTime || "N/A",
              location: event.location || "No location",
              address: event.address || "No address",
              image: event.imageUrl,
              imageUrl: event.imageUrl,
              category: event.category || "other",
              isPaid: event.isPaid || false,
              price: event.price || 0,
              organizer: event.organizer || {
                name: "Unknown Organizer",
                avatar:
                  "https://ui-avatars.com/api/?name=Unknown&background=0D8ABC&color=fff",
              },
            })
          );

          setSavedEvents(formattedEvents);
        } else {
          setSavedEventsError(
            response.message || "Không thể tải danh sách sự kiện đã lưu"
          );
        }
      } catch (err: unknown) {
        // Thay any bằng unknown
        const error = err as {
          response?: { data?: { message?: string } };
          message?: string;
        }; // Type assertion
        console.error("Error fetching saved events:", error);
        setSavedEventsError(
          error.response?.data?.message ||
            error.message || // Thêm error.message
            "Có lỗi xảy ra khi tải sự kiện đã lưu"
        );
      } finally {
        setIsSavedEventsLoading(false);
      }
    };

    fetchSavedEvents();
  }, []);

  // Filter sự kiện dựa trên tìm kiếm
  const filteredMyEvents = myEvents.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "" || event.category === categoryFilter;
    const matchesPrice =
      (showFreeOnly && !event.isPaid) ||
      (showPaidOnly && event.isPaid) ||
      (!showFreeOnly && !showPaidOnly);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Lấy sự kiện cho trang hiện tại
  const paginatedMyEvents = filteredMyEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const filteredSavedEvents = savedEvents.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "" || event.category === categoryFilter;
    const matchesPrice =
      (showFreeOnly && !event.isPaid) ||
      (showPaidOnly && event.isPaid) ||
      (!showFreeOnly && !showPaidOnly);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Kết hợp tất cả sự kiện đã lọc
  const allFilteredEvents = [...filteredMyEvents, ...filteredSavedEvents]
    // Lọc ra các sự kiện không bị ẩn cho tab "Tất cả sự kiện"
    .filter((event) => !event.isHidden)
    .sort(
      (a, b) =>
        new Date(b.date.split("/").reverse().join("-")).getTime() -
        new Date(a.date.split("/").reverse().join("-")).getTime()
    ); // Sắp xếp theo ngày giảm dần

  // Cập nhật totalPages cho tất cả sự kiện khi tab thay đổi
  useEffect(() => {
    if (tabIndex === 0) {
      setTotalPages(Math.ceil(allFilteredEvents.length / eventsPerPage));
    } else if (tabIndex === 1) {
      setTotalPages(Math.ceil(filteredMyEvents.length / eventsPerPage));
    }
  }, [
    tabIndex,
    allFilteredEvents.length,
    filteredMyEvents.length,
    eventsPerPage,
  ]);

  // Phân trang cho tất cả sự kiện
  const paginatedAllEvents = allFilteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  // Xử lý tìm kiếm
  const handleSearch = () => {
    // Đã được xử lý thông qua state và filter
  };

  // Reset filter
  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setShowFreeOnly(false);
    setShowPaidOnly(false);
    setCurrentPage(1); // Reset về trang đầu tiên khi reset filter
  };

  // Xử lý chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      // Sau này khi có API phân trang thực sự, sẽ gọi API load dữ liệu trang mới ở đây
    }
  };

  // Xử lý ẩn/hiện sự kiện
  const handleToggleVisibility = (eventId: string) => {
    // Trong thực tế, đây sẽ là API call để ẩn/hiện sự kiện
    const event = myEvents.find((e) => e.id === eventId);
    const isCurrentlyHidden = event?.isHidden || false;

    const updatedEvents = myEvents.map((event) =>
      event.id === eventId ? { ...event, isHidden: !event.isHidden } : event
    );
    setMyEvents(updatedEvents);

    toast({
      title: isCurrentlyHidden ? "Đã hiện sự kiện" : "Đã ẩn sự kiện",
      description: isCurrentlyHidden
        ? "Sự kiện đã được hiển thị công khai trở lại"
        : "Sự kiện đã bị ẩn khỏi danh sách công khai",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Xử lý hủy lưu sự kiện - gọi API để hủy lưu
  const handleUnsaveEvent = async (eventId: string) => {
    try {
      await eventService.unsaveEvent(eventId);
      // Cập nhật state sau khi hủy thành công
      setSavedEvents(savedEvents.filter((event) => event.id !== eventId));
    } catch (err: unknown) {
      // Thay any bằng unknown
      const error = err as { response?: { data?: { message?: string } } }; // Type assertion
      console.error("Error unsaving event:", error);
      // Có thể thêm xử lý thông báo lỗi ở đây
    }
  };

  // Tạo locationOptions từ các sự kiện
  const locationOptions = getLocationOptions();

  // Tạo appliedFilters để hiển thị badges khi có filter
  const appliedFilters = {
    category: categoryFilter,
    showFreeOnly,
    showPaidOnly,
  };

  // Render loading state cho saved events tab
  const renderSavedEventsContent = () => {
    if (isSavedEventsLoading) {
      return (
        <Flex justify="center" align="center" minH="200px">
          <VStack spacing={4}>
            <Spinner size="xl" color="teal.500" thickness="4px" />
            <Text>Đang tải sự kiện đã lưu...</Text>
          </VStack>
        </Flex>
      );
    }

    if (savedEventsError) {
      return (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Flex direction="column" align="start">
            <AlertTitle mr={2}>Lỗi khi tải sự kiện đã lưu!</AlertTitle>
            <AlertDescription>{savedEventsError}</AlertDescription>
          </Flex>
        </Alert>
      );
    }

    if (filteredSavedEvents.length === 0) {
      return (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Flex direction="column" align="start">
            <AlertTitle mr={2}>Không có sự kiện đã lưu!</AlertTitle>
            <AlertDescription>
              Bạn chưa lưu sự kiện nào hoặc không có sự kiện phù hợp với bộ lọc
              hiện tại.
            </AlertDescription>
          </Flex>
        </Alert>
      );
    }

    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {filteredSavedEvents.map((event) => (
          <Box
            key={event.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg={cardBg}
            borderColor={borderColor}
            transition="all 0.3s"
            _hover={{
              transform: "translateY(-5px)",
              shadow: "md",
              bg: cardHoverBg,
            }}
            position="relative"
          >
            <IconButton
              aria-label="Unsave event"
              icon={<FiX />}
              size="sm"
              position="absolute"
              top={2}
              right={2}
              colorScheme="red"
              variant="solid"
              onClick={() => handleUnsaveEvent(event.id)}
              zIndex={1}
              borderRadius="full"
            />

            <Link to={`/events/${event.id}`}>
              <Box h="200px" overflow="hidden">
                <Box
                  bgImage={`url(${event.imageUrl || event.image})`}
                  bgSize="cover"
                  bgPosition="center"
                  h="100%"
                  w="100%"
                  transition="transform 0.3s"
                  _hover={{ transform: "scale(1.05)" }}
                />
              </Box>

              <Box p={4}>
                <Flex justify="space-between" align="start" mb={2}>
                  <Badge colorScheme="teal" borderRadius="full" px={2}>
                    {getCategoryName(event.category)}
                  </Badge>
                  {event.isPaid ? (
                    <Badge colorScheme="blue" borderRadius="full" px={2}>
                      Trả phí
                    </Badge>
                  ) : (
                    <Badge colorScheme="green" borderRadius="full" px={2}>
                      Miễn phí
                    </Badge>
                  )}
                </Flex>

                <Heading as="h3" size="md" mb={2} noOfLines={2}>
                  {event.title}
                  {event.isHidden && (
                    <Badge ml={2} colorScheme="gray" fontSize="xs">
                      Ẩn
                    </Badge>
                  )}
                </Heading>

                <Text
                  color={secondaryTextColor}
                  fontSize="sm"
                  mb={3}
                  noOfLines={2}
                >
                  {event.description}
                </Text>

                <VStack spacing={1} align="start">
                  <Flex align="center">
                    <Icon as={FiCalendar} mr={2} color="teal.500" />
                    <Text fontSize="sm">
                      {event.date} • {event.startTime}
                    </Text>
                  </Flex>

                  <Flex align="center">
                    <Icon as={FiMapPin} mr={2} color="teal.500" />
                    <Text fontSize="sm" noOfLines={1}>
                      {event.location}
                    </Text>
                  </Flex>
                </VStack>
              </Box>
            </Link>
          </Box>
        ))}
      </SimpleGrid>
    );
  };

  const renderMyEventsContent = () => {
    // Kiểm tra nếu không phải nhà tổ chức, hiển thị thông báo
    if (!isOrganizer) {
      return (
        <Alert
          status="info"
          borderRadius="md"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          py={6}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={2} fontSize="lg">
            Bạn cần trở thành nhà tổ chức!
          </AlertTitle>
          <AlertDescription maxWidth="md">
            Để tạo và quản lý sự kiện, bạn cần trở thành nhà tổ chức trên
            EventHub. Nhà tổ chức có thể tạo sự kiện, quản lý đăng ký và nhiều
            tính năng khác.
          </AlertDescription>
          <Button
            as={Link}
            to="/become-organizer"
            mt={6}
            colorScheme="teal"
            leftIcon={<FiUserPlus />}
          >
            Trở thành nhà tổ chức
          </Button>
        </Alert>
      );
    }

    if (isMyEventsLoading) {
      return (
        <Flex justify="center" align="center" minH="200px">
          <VStack spacing={4}>
            <Spinner size="xl" color="teal.500" thickness="4px" />
            <Text>Đang tải sự kiện của bạn...</Text>
          </VStack>
        </Flex>
      );
    }

    if (myEventsError) {
      return (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Flex direction="column" align="start">
            <AlertTitle mr={2}>Lỗi khi tải sự kiện của bạn!</AlertTitle>
            <AlertDescription>{myEventsError}</AlertDescription>
          </Flex>
        </Alert>
      );
    }

    if (filteredMyEvents.length === 0) {
      return (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Flex direction="column" align="start">
            <AlertTitle mr={2}>Không có sự kiện nào!</AlertTitle>
            <AlertDescription>
              Bạn chưa tạo sự kiện nào hoặc không có sự kiện phù hợp với bộ lọc
              hiện tại.{" "}
              {isOrganizer && (
                <ChakraLink
                  as={Link}
                  to="/create-event"
                  color="teal.500"
                  fontWeight="bold"
                >
                  Tạo sự kiện mới ngay!
                </ChakraLink>
              )}
            </AlertDescription>
          </Flex>
        </Alert>
      );
    }

    return (
      <>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {paginatedMyEvents.map((event) => (
            <Box
              key={event.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              bg={cardBg}
              borderColor={borderColor}
              transition="all 0.3s"
              _hover={{
                transform: "translateY(-5px)",
                shadow: "md",
                bg: cardHoverBg,
              }}
            >
              <Link to={`/events/${event.id}`}>
                <Box h="200px" overflow="hidden">
                  <Box
                    bgImage={`url(${event.imageUrl || event.image})`}
                    bgSize="cover"
                    bgPosition="center"
                    h="100%"
                    w="100%"
                    transition="transform 0.3s"
                    _hover={{ transform: "scale(1.05)" }}
                  />
                </Box>

                <Box p={4}>
                  <Flex justify="space-between" align="start" mb={2}>
                    <Badge colorScheme="teal" borderRadius="full" px={2}>
                      {getCategoryName(event.category)}
                    </Badge>
                    {event.isPaid ? (
                      <Badge colorScheme="blue" borderRadius="full" px={2}>
                        Trả phí
                      </Badge>
                    ) : (
                      <Badge colorScheme="green" borderRadius="full" px={2}>
                        Miễn phí
                      </Badge>
                    )}
                  </Flex>

                  <Heading as="h3" size="md" mb={2} noOfLines={2}>
                    {event.title}
                    {event.isHidden && (
                      <Badge ml={2} colorScheme="gray" fontSize="xs">
                        Ẩn
                      </Badge>
                    )}
                  </Heading>

                  <Text
                    color={secondaryTextColor}
                    fontSize="sm"
                    mb={3}
                    noOfLines={2}
                  >
                    {event.description}
                  </Text>

                  <VStack spacing={1} align="start">
                    <Flex align="center">
                      <Icon as={FiCalendar} mr={2} color="teal.500" />
                      <Text fontSize="sm">
                        {event.date} • {event.startTime}
                      </Text>
                    </Flex>

                    <Flex align="center">
                      <Icon as={FiMapPin} mr={2} color="teal.500" />
                      <Text fontSize="sm" noOfLines={1}>
                        {event.location}
                      </Text>
                    </Flex>
                  </VStack>
                </Box>
              </Link>

              {/* Actions for "My Events" */}
              <Flex
                justify="space-between"
                align="center"
                p={4}
                borderTopWidth="1px"
                borderColor={borderColor}
              >
                <Text fontSize="sm" color={secondaryTextColor}>
                  {event.participants || 0} người tham gia
                </Text>
                <HStack>
                  <IconButton
                    aria-label="Edit event"
                    icon={<FiEdit />}
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    as={Link}
                    to={`/create-event?edit=${event.id}`}
                  />
                  <Tooltip
                    label={event.isHidden ? "Hiện sự kiện" : "Ẩn sự kiện"}
                  >
                    <IconButton
                      aria-label="Toggle visibility"
                      icon={event.isHidden ? <FaEye /> : <FaEyeSlash />}
                      size="sm"
                      colorScheme={event.isHidden ? "green" : "gray"}
                      variant="outline"
                      onClick={() => handleToggleVisibility(event.id)}
                      display="none"
                    />
                  </Tooltip>
                </HStack>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
        {renderPaginationControls()}
      </>
    );
  };

  // Render pagination controls
  const renderPaginationControls = () => {
    if (totalPages <= 1) {
      return null;
    }

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button
          key={i}
          size="sm"
          colorScheme="teal"
          variant={currentPage === i ? "solid" : "ghost"}
          onClick={() => handlePageChange(i)}
          mx={1}
        >
          {i}
        </Button>
      );
    }

    return (
      <Flex justify="center" mt={8} mb={4}>
        <HStack spacing={2}>
          <Button
            size="sm"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            isDisabled={currentPage === 1}
            colorScheme="teal"
            variant="outline"
          >
            Trước
          </Button>
          {pageNumbers}
          <Button
            size="sm"
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            isDisabled={currentPage === totalPages}
            colorScheme="teal"
            variant="outline"
          >
            Sau
          </Button>
        </HStack>
      </Flex>
    );
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
              <Icon as={FiGrid} fontSize="18px" mr={2} />
              <Text>Tất cả sự kiện</Text>
              <Badge ml={2} colorScheme="blue" borderRadius="full">
                {isMyEventsLoading || isSavedEventsLoading
                  ? "..."
                  : allFilteredEvents.length}
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
              <Text>Sự kiện của tôi</Text>
              <Badge ml={2} colorScheme="green" borderRadius="full">
                {isMyEventsLoading ? "..." : filteredMyEvents.length}
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
              <Icon as={FiBookmark} fontSize="18px" mr={2} />
              <Text>Sự kiện đã lưu</Text>
              <Badge ml={2} colorScheme="purple" borderRadius="full">
                {isSavedEventsLoading ? "..." : filteredSavedEvents.length}
              </Badge>
            </Flex>
          </Tab>
        </TabList>

        {/* SearchBar Component */}
        <SearchBar
          keyword={searchQuery}
          setKeyword={setSearchQuery}
          category={categoryFilter}
          setCategory={setCategoryFilter}
          showFreeOnly={showFreeOnly}
          setShowFreeOnly={setShowFreeOnly}
          showPaidOnly={showPaidOnly}
          setShowPaidOnly={setShowPaidOnly}
          onSearch={handleSearch}
          onReset={resetFilters}
          categories={categoryOptions}
          locations={locationOptions}
          showLocationFilter={true}
          showCategoryFilter={true}
          showPriceFilter={true}
          appliedFilters={appliedFilters}
          getCategoryName={getCategoryName}
          mb={6}
          borderWidth="1px"
          borderColor={borderColor}
          bg={tabBg}
        />

        <TabPanels>
          {/* Tab: Tất cả sự kiện */}
          <TabPanel p={0}>
            <Box
              bg={tabBg}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Flex justify="space-between" align="center" mb={6}>
                <Heading as="h3" size="md">
                  Tất cả sự kiện (
                  {isMyEventsLoading || isSavedEventsLoading
                    ? "..."
                    : allFilteredEvents.length}
                  )
                </Heading>
                {isOrganizer && (
                  <Button
                    as={Link}
                    to="/create-event"
                    colorScheme="teal"
                    variant="outline"
                    leftIcon={<FiPlus />}
                  >
                    Tạo sự kiện mới
                  </Button>
                )}
              </Flex>

              {/* Hiển thị tất cả sự kiện */}
              {isMyEventsLoading || isSavedEventsLoading ? (
                <Flex justify="center" align="center" minH="200px">
                  <VStack spacing={4}>
                    <Spinner size="xl" color="teal.500" thickness="4px" />
                    <Text>Đang tải sự kiện...</Text>
                  </VStack>
                </Flex>
              ) : allFilteredEvents.length > 0 ? (
                <>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {paginatedAllEvents.map((event) => (
                      <Box
                        key={event.id}
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        bg={cardBg}
                        borderColor={borderColor}
                        transition="all 0.3s"
                        _hover={{
                          transform: "translateY(-5px)",
                          shadow: "md",
                          bg: cardHoverBg,
                        }}
                        position="relative"
                      >
                        {/* Huy hiệu sở hữu nếu là sự kiện do user tạo */}
                        {event.isOwner && (
                          <Badge
                            colorScheme="green"
                            position="absolute"
                            top={2}
                            left={2}
                            zIndex={1}
                            px={2}
                            py={1}
                            borderRadius="md"
                            variant="solid"
                          >
                            Sự kiện của tôi
                          </Badge>
                        )}

                        <Link to={`/events/${event.id}`}>
                          <Box h="200px" overflow="hidden">
                            <Box
                              bgImage={`url(${event.imageUrl || event.image})`}
                              bgSize="cover"
                              bgPosition="center"
                              h="100%"
                              w="100%"
                              transition="transform 0.3s"
                              _hover={{ transform: "scale(1.05)" }}
                            />
                          </Box>

                          <Box p={4}>
                            <Flex justify="space-between" align="start" mb={2}>
                              <Badge
                                colorScheme="teal"
                                borderRadius="full"
                                px={2}
                              >
                                {getCategoryName(event.category)}
                              </Badge>
                              {event.isPaid ? (
                                <Badge
                                  colorScheme="blue"
                                  borderRadius="full"
                                  px={2}
                                >
                                  Trả phí
                                </Badge>
                              ) : (
                                <Badge
                                  colorScheme="green"
                                  borderRadius="full"
                                  px={2}
                                >
                                  Miễn phí
                                </Badge>
                              )}
                            </Flex>

                            <Heading as="h3" size="md" mb={2} noOfLines={2}>
                              {event.title}
                              {event.isHidden && (
                                <Badge ml={2} colorScheme="gray" fontSize="xs">
                                  Ẩn
                                </Badge>
                              )}
                            </Heading>

                            <Text
                              color={secondaryTextColor}
                              fontSize="sm"
                              mb={3}
                              noOfLines={2}
                            >
                              {event.description}
                            </Text>

                            <VStack spacing={1} align="start">
                              <Flex align="center">
                                <Icon as={FiCalendar} mr={2} color="teal.500" />
                                <Text fontSize="sm">
                                  {event.date} • {event.startTime}
                                </Text>
                              </Flex>

                              <Flex align="center">
                                <Icon as={FiMapPin} mr={2} color="teal.500" />
                                <Text fontSize="sm" noOfLines={1}>
                                  {event.location}
                                </Text>
                              </Flex>
                            </VStack>
                          </Box>
                        </Link>

                        {/* Actions */}
                        {event.isOwner && (
                          <Flex
                            justify="space-between"
                            p={4}
                            borderTopWidth="1px"
                            borderColor={borderColor}
                          >
                            <Text fontSize="sm" color={secondaryTextColor}>
                              {event.participants} người tham gia
                            </Text>
                            <HStack>
                              <IconButton
                                aria-label="Edit event"
                                icon={<FiEdit />}
                                size="sm"
                                colorScheme="blue"
                                variant="outline"
                                as={Link}
                                to={`/create-event?edit=${event.id}`}
                              />
                              <Tooltip
                                label={
                                  event.isHidden ? "Hiện sự kiện" : "Ẩn sự kiện"
                                }
                              >
                                <IconButton
                                  aria-label="Toggle visibility"
                                  icon={
                                    event.isHidden ? <FaEye /> : <FaEyeSlash />
                                  }
                                  size="sm"
                                  colorScheme={
                                    event.isHidden ? "green" : "gray"
                                  }
                                  variant="outline"
                                  onClick={() =>
                                    handleToggleVisibility(event.id)
                                  }
                                  display="none"
                                />
                              </Tooltip>
                            </HStack>
                          </Flex>
                        )}
                      </Box>
                    ))}
                  </SimpleGrid>
                  {renderPaginationControls()}
                </>
              ) : (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <AlertTitle mr={2}>Không tìm thấy sự kiện!</AlertTitle>
                  <AlertDescription>
                    Bạn chưa có sự kiện nào hoặc không có sự kiện phù hợp với bộ
                    lọc hiện tại.
                  </AlertDescription>
                </Alert>
              )}
            </Box>
          </TabPanel>

          {/* Tab: Sự kiện của tôi */}
          <TabPanel p={0}>
            <Box
              bg={tabBg}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Flex justify="space-between" align="center" mb={6}>
                <Heading as="h3" size="md">
                  Sự kiện của tôi ({filteredMyEvents.length} / {totalEvents})
                </Heading>
                {isOrganizer && (
                  <HStack spacing={2}>
                    <Button
                      as={Link}
                      to="/dashboard"
                      colorScheme="purple"
                      leftIcon={<FiCalendar />}
                      variant="outline"
                    >
                      Quản lý chuyên sâu
                    </Button>
                    <Button
                      as={Link}
                      to="/events/create"
                      colorScheme="teal"
                      leftIcon={<FiPlus />}
                      variant="outline"
                    >
                      Tạo sự kiện mới
                    </Button>
                  </HStack>
                )}
              </Flex>

              {/* Hiển thị sự kiện của tôi */}
              {renderMyEventsContent()}
            </Box>
          </TabPanel>

          {/* Tab: Sự kiện đã lưu */}
          <TabPanel p={0}>
            <Box
              bg={tabBg}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Flex justify="space-between" align="center" mb={6}>
                <Heading as="h3" size="md">
                  Sự kiện đã lưu (
                  {isSavedEventsLoading ? "..." : filteredSavedEvents.length})
                </Heading>
                <Button
                  as={Link}
                  to="/events"
                  colorScheme="teal"
                  variant="outline"
                  leftIcon={<FaEye />}
                >
                  Khám phá sự kiện
                </Button>
              </Flex>

              {/* Hiển thị sự kiện đã lưu */}
              {renderSavedEventsContent()}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default EventManagement;
