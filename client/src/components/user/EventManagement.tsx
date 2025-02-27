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
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { SearchBar } from "../../components/common";

// Interface cho dữ liệu sự kiện
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  location: string;
  image: string;
  category: string;
  isPaid: boolean;
  price?: number;
  organizer: string;
  isOwner?: boolean;
  participants?: number;
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
    id: 101,
    title: "Web Development Workshop",
    description: "Learn the latest web development techniques and tools.",
    date: "15/09/2023",
    startTime: "10:00 AM",
    location: "Tech Hub Center",
    image: "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg",
    category: "workshop",
    isPaid: true,
    price: 15.0,
    organizer: "Nguyen Van A",
    isOwner: true,
    participants: 45,
  },
  {
    id: 102,
    title: "Digital Marketing Conference",
    description: "Explore effective digital marketing strategies for 2023.",
    date: "22/09/2023",
    startTime: "09:00 AM",
    location: "Business Center",
    image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg",
    category: "conference",
    isPaid: true,
    price: 25.0,
    organizer: "Nguyen Van A",
    isOwner: true,
    participants: 120,
  },
  {
    id: 103,
    title: "Mobile App Design Meetup",
    description: "Share ideas and get feedback on mobile app designs.",
    date: "05/10/2023",
    startTime: "06:30 PM",
    location: "Design Studio",
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
    category: "meetup",
    isPaid: false,
    organizer: "Nguyen Van A",
    isOwner: true,
    participants: 30,
  },
];

// Dữ liệu mẫu: Sự kiện đã lưu
const savedEventsData: Event[] = [
  {
    id: 201,
    title: "Photography Exhibition",
    description:
      "Explore stunning photography from local and international artists.",
    date: "18/09/2023",
    startTime: "10:00 AM",
    location: "Art Gallery",
    image: "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg",
    category: "exhibition",
    isPaid: false,
    organizer: "Arts Council",
  },
  {
    id: 202,
    title: "Future of AI Conference",
    description: "Discover the latest advancements in artificial intelligence.",
    date: "25/09/2023",
    startTime: "09:30 AM",
    location: "Tech Convention Center",
    image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg",
    category: "conference",
    isPaid: true,
    price: 35.0,
    organizer: "Tech Forward",
  },
  {
    id: 203,
    title: "Classical Music Concert",
    description:
      "An evening of classical masterpieces performed by renowned musicians.",
    date: "08/10/2023",
    startTime: "07:00 PM",
    location: "Opera House",
    image: "https://images.pexels.com/photos/7095506/pexels-photo-7095506.jpeg",
    category: "music",
    isPaid: true,
    price: 20.0,
    organizer: "Symphony Orchestra",
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
  const [savedEvents, setSavedEvents] = useState<Event[]>(savedEventsData);

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
  const handleDeleteEvent = (eventId: number) => {
    setMyEvents(myEvents.filter((event) => event.id !== eventId));
    // Trong thực tế sẽ gọi API để xóa sự kiện
  };

  // Hủy lưu sự kiện
  const handleUnsaveEvent = (eventId: number) => {
    setSavedEvents(savedEvents.filter((event) => event.id !== eventId));
    // Trong thực tế sẽ gọi API để hủy lưu sự kiện
  };

  // Format categories cho SearchBar
  const categoryOptions = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  // Tạo locationOptions empty để hiển thị đồng nhất với SearchResults
  const locationOptions = [];

  // Tạo appliedFilters để hiển thị badges khi có filter
  const appliedFilters = {
    category: categoryFilter,
    showFreeOnly,
    showPaidOnly,
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
                {filteredSavedEvents.length}
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
                  {filteredMyEvents.length + filteredSavedEvents.length})
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
              {filteredMyEvents.length + filteredSavedEvents.length > 0 ? (
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
                  Sự kiện đã lưu ({filteredSavedEvents.length})
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
              {filteredSavedEvents.length > 0 ? (
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
                    </Box>
                  ))}
                </SimpleGrid>
              ) : (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <AlertTitle mr={2}>Không tìm thấy sự kiện!</AlertTitle>
                  <AlertDescription>
                    Bạn chưa lưu sự kiện nào hoặc không có sự kiện phù hợp với
                    bộ lọc hiện tại.
                  </AlertDescription>
                </Alert>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default EventManagement;
