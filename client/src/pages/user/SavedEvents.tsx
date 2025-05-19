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
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Divider,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Icon,
  Tag,
} from "@chakra-ui/react";
import { useState, useRef, RefObject } from "react";
import {
  FiSearch,
  FiCalendar,
  FiMapPin,
  FiHeart,
  FiFilter,
  FiX,
  FiTag,
} from "react-icons/fi";
import { Link } from "react-router-dom";

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

// Danh sách categories - giống như trong SearchResults
const categories = [
  { id: "", name: "Tất cả thể loại" },
  { id: "conference", name: "Hội nghị" },
  { id: "workshop", name: "Hội thảo" },
  { id: "meetup", name: "Gặp gỡ" },
  { id: "networking", name: "Kết nối" },
  { id: "music", name: "Âm nhạc" },
  { id: "exhibition", name: "Triển lãm" },
  { id: "food", name: "Ẩm thực" },
  { id: "sports", name: "Thể thao" },
  { id: "tech", name: "Công nghệ" },
  { id: "education", name: "Giáo dục" },
  { id: "health", name: "Sức khỏe" },
  { id: "art", name: "Nghệ thuật" },
  { id: "business", name: "Kinh doanh" },
  { id: "masterclass", name: "Masterclass" },
  { id: "other", name: "Khác" },
];

// Function để lấy tên category từ id
const getCategoryName = (categoryId: string): string => {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : "Khác";
};

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
  // State để lưu sự kiện đang được xác nhận xóa
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);

  // Màu sắc theo theme
  const bgColor = useColorModeValue("white", "gray.900");
  const boxBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const iconColor = useColorModeValue("gray.400", "gray.500");
  const sectionBg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardHoverBg = useColorModeValue("gray.50", "gray.700");
  const tagBg = useColorModeValue("teal.50", "teal.900");
  const tagColor = useColorModeValue("teal.600", "teal.200");
  const locationColor = useColorModeValue("gray.600", "gray.400");

  // Drawer cho filter trên mobile
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Dialog xác nhận xóa
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Toast notifications
  const toast = useToast();

  // Lọc các sự kiện dựa trên tìm kiếm và filter
  const filteredEvents = savedEvents.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "" || event.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Xử lý bắt đầu hủy lưu sự kiện (mở dialog xác nhận)
  const startUnsaveEvent = (eventId: number) => {
    setEventToDelete(eventId);
    onDeleteDialogOpen();
  };

  // Xử lý hủy lưu sự kiện (sau khi xác nhận)
  const confirmUnsaveEvent = () => {
    if (eventToDelete !== null) {
      setSavedEvents(savedEvents.filter((event) => event.id !== eventToDelete));
      toast({
        title: "Đã hủy lưu sự kiện",
        description: "Sự kiện đã được xóa khỏi danh sách đã lưu của bạn.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onDeleteDialogClose();
      setEventToDelete(null);
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    // Đã được xử lý thông qua state filteredEvents
  };

  // Reset tất cả bộ lọc
  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
  };

  return (
    <Box bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        <Box mb={8}>
          <Heading as="h1" size="xl" mb={2} color={textColor}>
            Sự kiện đã lưu
          </Heading>
          <Text color={locationColor}>
            Danh sách các sự kiện bạn đã lưu để xem sau
          </Text>
        </Box>

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
          <Flex direction="column" gap={4}>
            <Flex gap={4}>
              <InputGroup size="md" flexGrow={1}>
                <InputLeftElement pointerEvents="none">
                  <FiSearch color={iconColor} />
                </InputLeftElement>
                <Input
                  placeholder="Tìm kiếm sự kiện đã lưu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderColor={borderColor}
                />
              </InputGroup>

              <Button colorScheme="teal" onClick={handleSearch} px={8}>
                Tìm kiếm
              </Button>
            </Flex>

            <Flex gap={4} align="center">
              <InputGroup size="md" flex={1}>
                <InputLeftElement pointerEvents="none">
                  <FiTag color={iconColor} />
                </InputLeftElement>
                <Select
                  placeholder="Tất cả danh mục"
                  size="md"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  borderColor={borderColor}
                  pl={10}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </InputGroup>

              <Button
                variant="outline"
                colorScheme="teal"
                size="md"
                leftIcon={<FiX />}
                onClick={resetFilters}
              >
                Xóa bộ lọc
              </Button>
            </Flex>
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
                placeholder="Tìm kiếm sự kiện đã lưu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderColor={borderColor}
              />
            </InputGroup>

            <IconButton
              aria-label="Lọc"
              icon={<FiFilter />}
              colorScheme="teal"
              onClick={onOpen}
            />
          </Flex>

          {/* Filter Badges (hiển thị bộ lọc đã chọn) */}
          {categoryFilter && (
            <Flex gap={2} mb={4} flexWrap="wrap">
              <Badge
                colorScheme="purple"
                borderRadius="full"
                px={2}
                py={1}
                display="flex"
                alignItems="center"
              >
                {getCategoryName(categoryFilter)}
                <Box
                  as={FiX}
                  ml={1}
                  cursor="pointer"
                  onClick={() => setCategoryFilter("")}
                />
              </Badge>
            </Flex>
          )}
        </Box>

        {/* Mobile Drawer Filter */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Bộ lọc</DrawerHeader>

            <DrawerBody>
              <VStack spacing={4} align="stretch" py={4}>
                <Box>
                  <Text fontWeight="medium" mb={2}>
                    Danh mục
                  </Text>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiTag color={iconColor} />
                    </InputLeftElement>
                    <Select
                      placeholder="Tất cả danh mục"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      pl={10}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Select>
                  </InputGroup>
                </Box>

                <Divider />

                <Button colorScheme="teal" onClick={handleSearch}>
                  Áp dụng
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  Xóa bộ lọc
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Kết quả tìm kiếm */}
        {filteredEvents.length > 0 ? (
          <>
            <Flex justify="space-between" align="center" mb={6}>
              <Text color={textColor}>
                {filteredEvents.length} sự kiện đã lưu
              </Text>
              {searchQuery || categoryFilter ? (
                <Button
                  variant="outline"
                  colorScheme="teal"
                  size="sm"
                  leftIcon={<FiX />}
                  onClick={resetFilters}
                >
                  Xóa tất cả bộ lọc
                </Button>
              ) : null}
            </Flex>

            <Box
              bg={sectionBg}
              p={6}
              borderRadius="lg"
              mb={6}
              borderWidth="1px"
              borderColor={borderColor}
            >
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {filteredEvents.map((event) => (
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
                      onClick={() => startUnsaveEvent(event.id)}
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
                          <Tag
                            size="sm"
                            bg={tagBg}
                            color={tagColor}
                            borderRadius="full"
                          >
                            <Icon as={FiTag} mr={1} />
                            {getCategoryName(event.category)}
                          </Tag>
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
                          fontSize="sm"
                          color={locationColor}
                          noOfLines={2}
                          mb={3}
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
            </Box>
          </>
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

        {/* AlertDialog xác nhận hủy lưu */}
        <AlertDialog
          isOpen={isDeleteDialogOpen}
          leastDestructiveRef={cancelRef as RefObject<HTMLButtonElement>}
          onClose={onDeleteDialogClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Xác nhận hủy lưu
              </AlertDialogHeader>

              <AlertDialogBody>
                Bạn có chắc chắn muốn xóa sự kiện này khỏi danh sách đã lưu
                không? Bạn sẽ không thể dễ dàng tìm lại sự kiện này trong mục đã
                lưu.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteDialogClose}>
                  Không, giữ lại
                </Button>
                <Button colorScheme="red" onClick={confirmUnsaveEvent} ml={3}>
                  Có, hủy lưu
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Container>
    </Box>
  );
};

export default SavedEvents;
