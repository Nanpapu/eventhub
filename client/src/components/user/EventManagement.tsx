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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  FiCalendar,
  FiMapPin,
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlus,
  FiX,
  FiTag,
  FiGrid,
  FiBookmark,
  FiAlertCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { SearchBar } from "../../components/common";
import eventService from "../../services/event.service";

// Interface cho dữ liệu sự kiện
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
}

// Danh mục sự kiện
const categories = [
  { id: "", name: "Tất cả danh mục" },
  { id: "conference", name: "Hội nghị" },
  { id: "workshop", name: "Hội thảo" },
  { id: "meetup", name: "Gặp gỡ" },
  { id: "networking", name: "Kết nối" },
  { id: "music", name: "Âm nhạc" },
  { id: "exhibition", name: "Triển lãm" },
  { id: "tech", name: "Công nghệ" },
  { id: "masterclass", name: "Masterclass" },
  { id: "other", name: "Khác" },
];

// Dữ liệu mẫu: Sự kiện do user tạo
const myEventsData: Event[] = [
  {
    id: "101",
    title: "Web Development Workshop",
    description: "Learn the latest web development techniques and tools.",
    date: "15/09/2023",
    startTime: "10:00 AM",
    location: "Tech Hub Center",
    image: "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg",
    category: "workshop",
    isPaid: true,
    price: 15.0,
    organizer: {
      name: "Nguyen Van A",
    },
    isOwner: true,
    participants: 45,
  },
  {
    id: "102",
    title: "Digital Marketing Conference",
    description: "Explore effective digital marketing strategies for 2023.",
    date: "22/09/2023",
    startTime: "09:00 AM",
    location: "Business Center",
    image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
    category: "conference",
    isPaid: true,
    price: 25.0,
    organizer: {
      name: "Nguyen Van A",
    },
    isOwner: true,
    participants: 120,
  },
  {
    id: "103",
    title: "Mobile App Design Meetup",
    description: "Share ideas and get feedback on mobile app designs.",
    date: "05/10/2023",
    startTime: "06:30 PM",
    location: "Design Studio",
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
    category: "meetup",
    isPaid: false,
    organizer: {
      name: "Nguyen Van A",
    },
    isOwner: true,
    participants: 30,
  },
];

// Function để lấy tên category từ id
const getCategoryName = (categoryId: string): string => {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : "Khác";
};

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

  // State lưu dữ liệu sự kiện
  const [myEvents, setMyEvents] = useState<Event[]>(myEventsData);
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
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const iconColor = useColorModeValue("gray.400", "gray.500");
  const tagBg = useColorModeValue("teal.50", "teal.900");
  const tagColor = useColorModeValue("teal.600", "teal.200");
  const errorColor = useColorModeValue("red.500", "red.300");

  // Fetch saved events từ API
  useEffect(() => {
    const fetchSavedEvents = async () => {
      setIsSavedEventsLoading(true);
      setSavedEventsError(null);

      try {
        const response = await eventService.getSavedEvents();

        if (response.success && response.events) {
          // Format dữ liệu từ API để phù hợp với cấu trúc Event
          const formattedEvents: Event[] = response.events.map(
            (event: any) => ({
              id: event._id || event.id,
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
          setSavedEventsError("Không thể tải danh sách sự kiện đã lưu");
        }
      } catch (error: any) {
        console.error("Error fetching saved events:", error);
        setSavedEventsError(
          error.response?.data?.message ||
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
  };

  // Xóa sự kiện
  const handleDeleteEvent = (eventId: string) => {
    setMyEvents(myEvents.filter((event) => event.id !== eventId));
    // Trong thực tế sẽ gọi API để xóa sự kiện
  };

  // Hủy lưu sự kiện - gọi API để hủy lưu
  const handleUnsaveEvent = async (eventId: string) => {
    try {
      await eventService.unsaveEvent(eventId);
      // Cập nhật state sau khi hủy thành công
      setSavedEvents(savedEvents.filter((event) => event.id !== eventId));
    } catch (error: any) {
      console.error("Error unsaving event:", error);
      // Có thể thêm xử lý thông báo lỗi ở đây
    }
  };

  // Format categories cho SearchBar
  const categoryOptions = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  // Tạo locationOptions từ các sự kiện
  const allEvents = [...myEvents, ...savedEvents];
  const locationOptions = allEvents
    .map((event) => event.location)
    .filter((location, index, self) => self.indexOf(location) === index) // Loại bỏ trùng lặp
    .map((location) => ({ name: location }));

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
                    <Badge colorScheme="purple" borderRadius="full" px={2}>
                      {event.price} VND
                    </Badge>
                  ) : (
                    <Badge colorScheme="green" borderRadius="full" px={2}>
                      Miễn phí
                    </Badge>
                  )}
                </Flex>

                <Heading as="h3" size="md" mb={2} noOfLines={2}>
                  {event.title}
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
                {filteredMyEvents.length + filteredSavedEvents.length}
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
                {filteredMyEvents.length}
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
                  {isSavedEventsLoading
                    ? "..."
                    : filteredMyEvents.length + filteredSavedEvents.length}
                  )
                </Heading>
                <Button
                  as={Link}
                  to="/events/create"
                  colorScheme="teal"
                  leftIcon={<FiPlus />}
                >
                  Tạo sự kiện mới
                </Button>
              </Flex>

              {/* Hiển thị tất cả sự kiện */}
              {isSavedEventsLoading ? (
                <Flex justify="center" align="center" minH="200px">
                  <VStack spacing={4}>
                    <Spinner size="xl" color="teal.500" thickness="4px" />
                    <Text>Đang tải sự kiện...</Text>
                  </VStack>
                </Flex>
              ) : filteredMyEvents.length + filteredSavedEvents.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {[...filteredMyEvents, ...filteredSavedEvents].map(
                    (event) => (
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
                                  colorScheme="purple"
                                  borderRadius="full"
                                  px={2}
                                >
                                  {event.price} VND
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
                                to={`/events/${event.id}/edit`}
                              />
                              <IconButton
                                aria-label="Delete event"
                                icon={<FiTrash2 />}
                                size="sm"
                                colorScheme="red"
                                variant="outline"
                                onClick={() => handleDeleteEvent(event.id)}
                              />
                            </HStack>
                          </Flex>
                        )}
                      </Box>
                    )
                  )}
                </SimpleGrid>
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
                  Sự kiện của tôi ({filteredMyEvents.length})
                </Heading>
                <Button
                  as={Link}
                  to="/events/create"
                  colorScheme="teal"
                  leftIcon={<FiPlus />}
                >
                  Tạo sự kiện mới
                </Button>
              </Flex>

              {/* Hiển thị sự kiện của tôi */}
              {filteredMyEvents.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {filteredMyEvents.map((event) => (
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
                            bgImage={`url(${event.image})`}
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
                                colorScheme="purple"
                                borderRadius="full"
                                px={2}
                              >
                                {event.price} VND
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
                            to={`/events/${event.id}/edit`}
                          />
                          <IconButton
                            aria-label="Delete event"
                            icon={<FiTrash2 />}
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            onClick={() => handleDeleteEvent(event.id)}
                          />
                        </HStack>
                      </Flex>
                    </Box>
                  ))}
                </SimpleGrid>
              ) : (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <AlertTitle mr={2}>Không tìm thấy sự kiện!</AlertTitle>
                  <AlertDescription>
                    Bạn chưa tạo sự kiện nào hoặc không có sự kiện phù hợp với
                    bộ lọc hiện tại.
                  </AlertDescription>
                </Alert>
              )}
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
                  leftIcon={<FiEye />}
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
