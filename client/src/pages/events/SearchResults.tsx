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
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiSearch, FiMapPin, FiCalendar, FiFilter, FiX } from "react-icons/fi";

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
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="transform 0.3s"
      _hover={{ transform: "translateY(-5px)" }}
      bg="white"
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
            {event.category}
          </Badge>
          <Badge
            colorScheme={event.isPaid ? "purple" : "green"}
            fontSize="xs"
            borderRadius="md"
            px={2}
            py={1}
          >
            {event.isPaid ? "Paid" : "Free"}
          </Badge>
        </Box>
      </Box>

      <Box p={5}>
        <Heading size="md" my={2} noOfLines={2}>
          {event.title}
        </Heading>

        <Text noOfLines={2} mb={3} fontSize="sm" color="gray.600">
          {event.description}
        </Text>

        <Flex align="center" color="gray.500" fontSize="sm" mb={2}>
          <FiCalendar />
          <Text ml={2}>{event.date}</Text>
        </Flex>

        <Flex align="center" color="gray.500" fontSize="sm" mb={4}>
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
          View Details
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
    image: "https://bit.ly/3wvlcXF",
    category: "concert",
    isPaid: true,
  },
  {
    id: 4,
    title: "Technology Exhibition",
    description: "Exhibition showcasing the latest technology products",
    date: "25/08/2023",
    location: "Ho Chi Minh City",
    image: "https://bit.ly/3P96Zxz",
    category: "exhibition",
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
    title: "AI in Healthcare Symposium",
    description: "Discussing the role of artificial intelligence in healthcare",
    date: "12/09/2023",
    location: "Hanoi",
    image: "https://bit.ly/40x6Q2d",
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
  "concert",
  "exhibition",
  "other",
];

const SearchResults = () => {
  // Lấy query params từ URL
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get("keyword") || "";
  const initialLocation = searchParams.get("location") || "";
  const initialCategory = searchParams.get("category") || "";

  // State cho trang tìm kiếm
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);
  const [events, setEvents] = useState<EventType[]>(eventsData);
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
  const filterEvents = () => {
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
  };

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
  }, [keyword, location, category, showFreeOnly, showPaidOnly, priceRange]);

  return (
    <Container maxW="container.xl" py={8}>
      {/* Tiêu đề trang */}
      <Heading as="h1" size="xl" mb={6}>
        Event Search Results
      </Heading>

      {/* Desktop: Search & Filter Bar */}
      <Box
        display={{ base: "none", md: "block" }}
        mb={8}
        p={6}
        bg="white"
        borderRadius="lg"
        boxShadow="md"
      >
        <Flex gap={4} mb={4}>
          <InputGroup size="md">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search events"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </InputGroup>

          <InputGroup size="md">
            <InputLeftElement pointerEvents="none">
              <FiMapPin color="gray.300" />
            </InputLeftElement>
            <Select
              placeholder="All Locations"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </Select>
          </InputGroup>

          <Select
            placeholder="All Categories"
            size="md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </Select>

          <Button colorScheme="teal" onClick={handleSearch}>
            Search
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
              Free Events
            </Checkbox>
            <Checkbox
              isChecked={showPaidOnly}
              onChange={(e) => {
                setShowPaidOnly(e.target.checked);
                if (e.target.checked) setShowFreeOnly(false);
              }}
            >
              Paid Events
            </Checkbox>
          </HStack>

          <Button
            variant="ghost"
            colorScheme="teal"
            size="sm"
            leftIcon={<FiX />}
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </Flex>
      </Box>

      {/* Mobile: Compact Search & Filter */}
      <Box display={{ base: "block", md: "none" }} mb={6}>
        <Flex gap={2} mb={4}>
          <InputGroup size="md" flex={1}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search events"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </InputGroup>

          <IconButton
            aria-label="Filters"
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
                {category}
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
                Free Events
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
                Paid Events
                <Box
                  as={FiX}
                  ml={1}
                  cursor="pointer"
                  onClick={() => setShowPaidOnly(false)}
                />
              </Badge>
            )}
            <Button
              size="xs"
              variant="ghost"
              onClick={resetFilters}
              colorScheme="red"
            >
              Clear All
            </Button>
          </Flex>
        )}

        {/* Filter Drawer cho Mobile */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Filters</DrawerHeader>

            <DrawerBody>
              <VStack spacing={4} align="start">
                <Box w="100%">
                  <Text fontWeight="medium" mb={2}>
                    Location
                  </Text>
                  <Select
                    placeholder="All Locations"
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

                <Box w="100%">
                  <Text fontWeight="medium" mb={2}>
                    Category
                  </Text>
                  <Select
                    placeholder="All Categories"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </Select>
                </Box>

                <Box w="100%">
                  <Text fontWeight="medium" mb={2}>
                    Price
                  </Text>
                  <Stack spacing={2}>
                    <Checkbox
                      isChecked={showFreeOnly}
                      onChange={(e) => {
                        setShowFreeOnly(e.target.checked);
                        if (e.target.checked) setShowPaidOnly(false);
                      }}
                    >
                      Free Events
                    </Checkbox>
                    <Checkbox
                      isChecked={showPaidOnly}
                      onChange={(e) => {
                        setShowPaidOnly(e.target.checked);
                        if (e.target.checked) setShowFreeOnly(false);
                      }}
                    >
                      Paid Events
                    </Checkbox>
                  </Stack>
                </Box>

                <Divider />

                <Button
                  w="100%"
                  colorScheme="teal"
                  onClick={() => {
                    handleSearch();
                    onClose();
                  }}
                >
                  Apply Filters
                </Button>

                <Button
                  w="100%"
                  variant="outline"
                  onClick={() => {
                    resetFilters();
                    onClose();
                  }}
                >
                  Reset All
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>

      {/* Kết quả tìm kiếm */}
      <Box>
        {/* Thông tin kết quả */}
        <Flex
          justify="space-between"
          align="center"
          mb={6}
          direction={{ base: "column", sm: "row" }}
          gap={{ base: 2, sm: 0 }}
        >
          <Text fontSize="lg">
            Found{" "}
            <Text as="span" fontWeight="bold" color="teal.500">
              {filteredEvents.length}
            </Text>{" "}
            events
          </Text>

          <HStack>
            <Text>Sort by:</Text>
            <Select size="sm" defaultValue="date">
              <option value="date">Date: Upcoming</option>
              <option value="popularity">Popularity</option>
              <option value="az">A-Z</option>
            </Select>
          </HStack>
        </Flex>

        {/* Danh sách sự kiện */}
        {filteredEvents.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={6}>
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={10}>
            <Text fontSize="xl" mb={4}>
              No events found matching your search criteria
            </Text>
            <Button colorScheme="teal" onClick={resetFilters}>
              Clear Filters
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SearchResults;
