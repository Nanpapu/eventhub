import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  useColorModeValue,
  Button,
  Flex,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FiSearch, FiCalendar, FiMapPin, FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";
import EventCard from "../../components/event/EventCard";

// Interface cho dữ liệu sự kiện
interface SavedEvent {
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
}

// Dữ liệu mẫu cho sự kiện đã lưu
const savedEventsData: SavedEvent[] = [
  {
    id: 1,
    title: "UI/UX Design Workshop",
    description:
      "Join us for a hands-on workshop where you'll learn the fundamentals of UI/UX design.",
    date: "15/08/2023",
    startTime: "09:00 AM",
    location: "Technology Innovation Hub",
    image: "https://images.pexels.com/photos/7149165/pexels-photo-7149165.jpeg",
    category: "workshop",
    isPaid: true,
    price: 25.99,
    organizer: "TechDesign Academy",
  },
  {
    id: 2,
    title: "Photography Masterclass",
    description:
      "Learn from professional photographers and master the art of photography.",
    date: "22/08/2023",
    startTime: "10:00 AM",
    location: "Art Gallery 28",
    image: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg",
    category: "masterclass",
    isPaid: true,
    price: 39.99,
    organizer: "Creative Arts Club",
  },
  {
    id: 3,
    title: "Tech Networking Mixer",
    description:
      "Network with professionals from tech industry and discover new opportunities.",
    date: "29/08/2023",
    startTime: "06:30 PM",
    location: "Skyline Rooftop Bar",
    image: "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg",
    category: "networking",
    isPaid: false,
    organizer: "Tech Professionals Association",
  },
];

/**
 * Trang hiển thị danh sách các sự kiện đã lưu của người dùng
 */
const SavedEvents = () => {
  // State để lưu danh sách sự kiện đã lưu
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>(savedEventsData);
  // State để lưu trạng thái tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");
  // State để lưu trạng thái filter theo category
  const [categoryFilter, setCategoryFilter] = useState("");

  // Màu sắc theo theme
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

  // Lọc các sự kiện dựa trên tìm kiếm và filter
  const filteredEvents = savedEvents.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "" || event.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Xử lý hủy lưu sự kiện
  const handleUnsaveEvent = (eventId: number) => {
    setSavedEvents(savedEvents.filter((event) => event.id !== eventId));
  };

  // Các danh mục sự kiện có sẵn
  const categories = [
    { value: "", label: "Tất cả thể loại" },
    { value: "workshop", label: "Workshop" },
    { value: "masterclass", label: "Masterclass" },
    { value: "networking", label: "Networking" },
    { value: "conference", label: "Conference" },
    { value: "concert", label: "Concert" },
  ];

  // Hiện tại đây chỉ là data mẫu
  // Trong thực tế, chúng ta sẽ lấy dữ liệu từ API trong useEffect:
  /*
  useEffect(() => {
    // Hàm lấy dữ liệu sự kiện đã lưu
    const fetchSavedEvents = async () => {
      try {
        // Gọi API để lấy dữ liệu sự kiện đã lưu
        const response = await fetch('/api/user/saved-events');
        const data = await response.json();
        
        if (data.success) {
          setSavedEvents(data.events);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sự kiện đã lưu:', error);
      }
    };

    fetchSavedEvents();
  }, []);
  */

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={2} color={textColor}>
          Sự kiện đã lưu
        </Heading>
        <Text color={secondaryTextColor}>
          Danh sách các sự kiện bạn đã lưu để xem sau
        </Text>
      </Box>

      {/* Phần tìm kiếm và lọc */}
      <Flex
        direction={{ base: "column", md: "row" }}
        mb={8}
        gap={4}
        bg={bgColor}
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <InputGroup flex={1}>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Tìm kiếm sự kiện đã lưu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        <Select
          placeholder="Lọc theo thể loại"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          maxW={{ base: "100%", md: "200px" }}
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </Select>
      </Flex>

      {/* Phần hiển thị danh sách sự kiện */}
      {filteredEvents.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredEvents.map((event) => (
            <Box
              key={event.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              bg={bgColor}
              borderColor={borderColor}
              transition="all 0.3s"
              _hover={{ transform: "translateY(-5px)", shadow: "md" }}
              position="relative"
            >
              {/* Nút hủy lưu */}
              <IconButton
                aria-label="Unsave event"
                icon={<FiHeart fill="red" />}
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
                    <Badge colorScheme="teal" borderRadius="full" px={2}>
                      {event.category}
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
                    fontSize="sm"
                    color={secondaryTextColor}
                    noOfLines={2}
                    mb={3}
                  >
                    {event.description}
                  </Text>

                  <VStack spacing={1} align="start">
                    <Flex align="center">
                      <Box as={FiCalendar} mr={2} color="teal.500" />
                      <Text fontSize="sm">
                        {event.date} • {event.startTime}
                      </Text>
                    </Flex>

                    <Flex align="center">
                      <Box as={FiMapPin} mr={2} color="teal.500" />
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
        <Alert
          status="info"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          borderRadius="lg"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Không tìm thấy sự kiện
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Bạn chưa lưu sự kiện nào hoặc không có sự kiện phù hợp với bộ lọc
            hiện tại.
          </AlertDescription>
          <Button as={Link} to="/events" colorScheme="teal" mt={4}>
            Khám phá sự kiện
          </Button>
        </Alert>
      )}
    </Container>
  );
};

export default SavedEvents;
