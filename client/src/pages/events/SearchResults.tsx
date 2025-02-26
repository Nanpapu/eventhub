import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  Badge,
  Divider,
  Checkbox,
  Stack,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiSearch, FiMapPin, FiCalendar, FiFilter, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";

// Định nghĩa kiểu dữ liệu cho sự kiện
interface EventType {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  category: string;
  isPaid: boolean;
  price?: number;
}

// Component EventCard nhỏ gọn nhúng trực tiếp trong trang này
// (Trong dự án thực tế nên tách thành component riêng)
const EventCard = ({ event }: { event: EventType }) => {
  const { t } = useTranslation();

  // Màu sắc theo theme
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const metaColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="transform 0.3s"
      _hover={{ transform: "translateY(-5px)" }}
      bg={cardBg}
      borderColor={borderColor}
    >
      <Box position="relative">
        <Image
          src={event.image}
          alt={event.title}
          height="200px"
          width="100%"
          objectFit="cover"
        />

        <Box position="absolute" top={2} right={2} display="flex" gap={1}>
          <Badge
            colorScheme="teal"
            fontSize="xs"
            textTransform="capitalize"
            borderRadius="md"
            px={2}
            py={1}
          >
            {t(`events.categories.${event.category}`)}
          </Badge>
          <Badge
            colorScheme={event.isPaid ? "purple" : "green"}
            fontSize="xs"
            borderRadius="md"
            px={2}
            py={1}
          >
            {event.isPaid ? t("common.paid") : t("common.free")}
          </Badge>
        </Box>
      </Box>

      <Box p={5}>
        <Heading size="md" my={2} noOfLines={2} color={textColor}>
          {event.title}
        </Heading>

        <Text noOfLines={2} mb={3} fontSize="sm" color={metaColor}>
          {event.description}
        </Text>

        <Flex align="center" color={metaColor} fontSize="sm" mb={2}>
          <FiCalendar />
          <Text ml={2}>{event.date}</Text>
        </Flex>

        <Flex align="center" color={metaColor} fontSize="sm" mb={4}>
          <FiMapPin />
          <Text ml={2} noOfLines={1}>
            {event.location}
          </Text>
        </Flex>

        <Button
          as={Link}
          to={`/events/${event.id}`}
          colorScheme="teal"
          width="full"
          size="sm"
          sx={{ textDecoration: "none" }}
        >
          {t("common.viewDetails")}
        </Button>
      </Box>
    </Box>
  );
};

// Dữ liệu mẫu cho sự kiện
const eventsData: EventType[] = [
  {
    id: 1,
    title: "UI/UX Design Workshop",
    description: "Workshop on modern user interface design principles",
    date: "15/08/2023",
    location: "Ho Chi Minh City",
    image: "https://bit.ly/3IZUfQd",
    category: "workshop",
    isPaid: false,
  },
  {
    id: 2,
    title: "Blockchain Technology Conference",
    description:
      "Explore the potential and applications of blockchain technology",
    date: "20/08/2023",
    location: "Hanoi",
    image: "https://bit.ly/3wIlKgh",
    category: "conference",
    isPaid: true,
  },
  {
    id: 3,
    title: "Music Festival 2023",
    description: "The biggest music event of the year featuring top artists",
    date: "10/09/2023",
    location: "Da Nang",
    image: "https://bit.ly/3IfO5Fh",
    category: "music",
    isPaid: true,
  },
  {
    id: 4,
    title: "Startup Networking Night",
    description: "Exhibition showcasing the latest technology products",
    date: "25/08/2023",
    location: "Ho Chi Minh City",
    image: "https://bit.ly/3kpPKS5",
    category: "networking",
    isPaid: false,
  },
  {
    id: 5,
    title: "JavaScript Developers Meetup",
    description:
      "Network with fellow JavaScript developers and share knowledge",
    date: "05/08/2023",
    location: "Ho Chi Minh City",
    image: "https://bit.ly/3IZx4Xd",
    category: "meetup",
    isPaid: false,
  },
  {
    id: 6,
    title: "AI in Business Conference",
    description: "Discussing the role of artificial intelligence in business",
    date: "12/09/2023",
    location: "Hanoi",
    image: "https://bit.ly/3kD02Jq",
    category: "conference",
    isPaid: true,
  },
];

// Danh sách địa điểm mẫu
const locations = [
  "Ho Chi Minh City",
  "Hanoi",
  "Da Nang",
  "Can Tho",
  "Nha Trang",
];

// Danh sách categories
const categories = [
  "conference",
  "workshop",
  "meetup",
  "networking",
  "music",
  "exhibition",
  "food",
  "other",
];

const SearchResults = () => {
  const { t } = useTranslation();

  // Màu sắc theo theme
  const bgColor = useColorModeValue("white", "gray.900");
  const boxBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const iconColor = useColorModeValue("gray.400", "gray.500");

  // Lấy query params từ URL
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get("keyword") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialCategory = searchParams.get("category") || "";

  // State cho trang tìm kiếm
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>(eventsData);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showPaidOnly, setShowPaidOnly] = useState(false);

  // Drawer cho filter trên mobile
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Xử lý tìm kiếm
  const handleSearch = () => {
    // Cập nhật URL với các tham số tìm kiếm
    const params: { [key: string]: string } = {};
    if (keyword) params.keyword = keyword;
    if (location) params.location = location;
    if (category) params.category = category;
    setSearchParams(params);

    // Lọc sự kiện dựa trên tìm kiếm
    filterEvents();
  };

  // Xử lý lọc sự kiện
  const filterEvents = useCallback(() => {
    let results = [...eventsData];

    // Lọc theo từ khóa
    if (keyword) {
      results = results.filter(
        (event) =>
          event.title.toLowerCase().includes(keyword.toLowerCase()) ||
          event.description.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // Lọc theo địa điểm
    if (location) {
      results = results.filter((event) =>
        event.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Lọc theo thể loại
    if (category) {
      results = results.filter((event) => event.category === category);
    }

    // Lọc theo giá (Free/Paid)
    if (showFreeOnly) {
      results = results.filter((event) => !event.isPaid);
    }

    if (showPaidOnly) {
      results = results.filter((event) => event.isPaid);
    }

    setFilteredEvents(results);
  }, [keyword, location, category, showFreeOnly, showPaidOnly]);

  // Reset tất cả bộ lọc
  const resetFilters = () => {
    setKeyword("");
    setLocation("");
    setCategory("");
    setShowFreeOnly(false);
    setShowPaidOnly(false);
    setPriceRange([0, 100]);
    setSearchParams({});
    setFilteredEvents(eventsData);
  };

  // Cập nhật kết quả khi các bộ lọc thay đổi
  useEffect(() => {
    filterEvents();
  }, [
    keyword,
    location,
    category,
    showFreeOnly,
    showPaidOnly,
    priceRange,
    filterEvents,
  ]);

  return (
    <Box bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        {/* Tiêu đề trang */}
        <Heading as="h1" size="xl" mb={6} color={textColor}>
          {t("events.searchResults")}
        </Heading>

        {/* Desktop: Search & Filter Bar */}
        <Box
          display={{ base: "none", md: "block" }}
          mb={8}
          p={6}
          bg={boxBg}
          borderRadius="lg"
          boxShadow="md"
          borderColor={borderColor}
          borderWidth="1px"
        >
          <Flex gap={4} mb={4}>
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none">
                <FiSearch color={iconColor} />
              </InputLeftElement>
              <Input
                placeholder={t("events.searchEvents")}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                borderColor={borderColor}
              />
            </InputGroup>

            <InputGroup size="md">
              <InputLeftElement pointerEvents="none">
                <FiMapPin color={iconColor} />
              </InputLeftElement>
              <Select
                placeholder={t("events.allLocations")}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                borderColor={borderColor}
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </Select>
            </InputGroup>

            <Select
              placeholder={t("events.categories.all")}
              size="md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              borderColor={borderColor}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`events.categories.${cat}`)}
                </option>
              ))}
            </Select>

            <Button colorScheme="teal" onClick={handleSearch}>
              {t("common.search")}
            </Button>
          </Flex>

          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <Checkbox
                isChecked={showFreeOnly}
                onChange={(e) => {
                  setShowFreeOnly(e.target.checked);
                  if (e.target.checked) setShowPaidOnly(false);
                }}
              >
                {t("events.filterType.free")}
              </Checkbox>
              <Checkbox
                isChecked={showPaidOnly}
                onChange={(e) => {
                  setShowPaidOnly(e.target.checked);
                  if (e.target.checked) setShowFreeOnly(false);
                }}
              >
                {t("events.filterType.paid")}
              </Checkbox>
            </HStack>

            <Button
              variant="ghost"
              colorScheme="teal"
              size="sm"
              leftIcon={<FiX />}
              onClick={resetFilters}
            >
              {t("events.resetFilters")}
            </Button>
          </Flex>
        </Box>

        {/* Mobile: Compact Search & Filter */}
        <Box display={{ base: "block", md: "none" }} mb={6}>
          <Flex gap={2} mb={4}>
            <InputGroup size="md" flex={1}>
              <InputLeftElement pointerEvents="none">
                <FiSearch color={iconColor} />
              </InputLeftElement>
              <Input
                placeholder={t("events.searchEvents")}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                borderColor={borderColor}
              />
            </InputGroup>

            <IconButton
              aria-label={t("common.filter")}
              icon={<FiFilter />}
              colorScheme="teal"
              onClick={onOpen}
            />
          </Flex>

          {/* Filter Badges (hiển thị bộ lọc đã chọn) */}
          {(location || category || showFreeOnly || showPaidOnly) && (
            <Flex gap={2} mb={4} flexWrap="wrap">
              {location && (
                <Badge
                  colorScheme="teal"
                  borderRadius="full"
                  px={2}
                  py={1}
                  display="flex"
                  alignItems="center"
                >
                  {location}
                  <Box
                    as={FiX}
                    ml={1}
                    cursor="pointer"
                    onClick={() => setLocation("")}
                  />
                </Badge>
              )}
              {category && (
                <Badge
                  colorScheme="purple"
                  borderRadius="full"
                  px={2}
                  py={1}
                  display="flex"
                  alignItems="center"
                >
                  {t(`events.categories.${category}`)}
                  <Box
                    as={FiX}
                    ml={1}
                    cursor="pointer"
                    onClick={() => setCategory("")}
                  />
                </Badge>
              )}
              {showFreeOnly && (
                <Badge
                  colorScheme="green"
                  borderRadius="full"
                  px={2}
                  py={1}
                  display="flex"
                  alignItems="center"
                >
                  {t("events.filterType.free")}
                  <Box
                    as={FiX}
                    ml={1}
                    cursor="pointer"
                    onClick={() => setShowFreeOnly(false)}
                  />
                </Badge>
              )}
              {showPaidOnly && (
                <Badge
                  colorScheme="orange"
                  borderRadius="full"
                  px={2}
                  py={1}
                  display="flex"
                  alignItems="center"
                >
                  {t("events.filterType.paid")}
                  <Box
                    as={FiX}
                    ml={1}
                    cursor="pointer"
                    onClick={() => setShowPaidOnly(false)}
                  />
                </Badge>
              )}
            </Flex>
          )}
        </Box>

        {/* Mobile Drawer Filter */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">
              {t("common.filter")}
            </DrawerHeader>

            <DrawerBody>
              <VStack spacing={4} align="stretch" py={4}>
                <Box>
                  <Text fontWeight="medium" mb={2}>
                    {t("events.location")}
                  </Text>
                  <Select
                    placeholder={t("events.allLocations")}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Text fontWeight="medium" mb={2}>
                    {t("events.category")}
                  </Text>
                  <Select
                    placeholder={t("events.categories.all")}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {t(`events.categories.${cat}`)}
                      </option>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <Text fontWeight="medium" mb={2}>
                    {t("events.price")}
                  </Text>
                  <Stack spacing={2}>
                    <Checkbox
                      isChecked={showFreeOnly}
                      onChange={(e) => {
                        setShowFreeOnly(e.target.checked);
                        if (e.target.checked) setShowPaidOnly(false);
                      }}
                    >
                      {t("events.filterType.free")}
                    </Checkbox>
                    <Checkbox
                      isChecked={showPaidOnly}
                      onChange={(e) => {
                        setShowPaidOnly(e.target.checked);
                        if (e.target.checked) setShowFreeOnly(false);
                      }}
                    >
                      {t("events.filterType.paid")}
                    </Checkbox>
                  </Stack>
                </Box>

                <Divider />

                <Button colorScheme="teal" onClick={handleSearch}>
                  {t("common.apply")}
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  {t("events.resetFilters")}
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Kết quả tìm kiếm */}
        {filteredEvents.length > 0 ? (
          <>
            <Text mb={6} color={textColor}>
              {filteredEvents.length} {t("events.eventsFound")}
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mb={10}>
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </SimpleGrid>
          </>
        ) : (
          <Box textAlign="center" py={10}>
            <Heading size="md" mb={4} color={textColor}>
              {t("events.noEventsFound")}
            </Heading>
            <Text mb={6} color={textColor}>
              {t("events.tryAdjustingFilters")}
            </Text>
            <Button colorScheme="teal" onClick={resetFilters}>
              {t("events.resetFilters")}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SearchResults;
