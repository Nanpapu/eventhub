import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  HStack,
  VStack,
  Progress,
  useColorModeValue,
  useToast,
  Link,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaUsers,
  FaTicketAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaQrcode,
} from "react-icons/fa";
import { useAppDispatch } from "../../app/hooks";
// import { fetchUserEvents } from "../../app/features/eventSlice"; // Sẽ cần thêm vào sau khi có API

// Định nghĩa các kiểu dữ liệu
interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  isOnline: boolean;
  imageUrl: string;
  totalTickets?: number;
  soldTickets?: number;
  status: "upcoming" | "ongoing" | "past" | "cancelled";
  revenue?: number;
}

interface Analytics {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
}

const Dashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventToCancel, setEventToCancel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Trạng thái dữ liệu
  const [events, setEvents] = useState<Event[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalEvents: 0,
    upcomingEvents: 0,
    pastEvents: 0,
  });

  // Tải dữ liệu sự kiện từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Trong phiên bản sau, thay thế bằng API thực:
        // const response = await dispatch(fetchUserEvents()).unwrap();

        // Demo data - sẽ được thay thế bằng API
        setTimeout(() => {
          // Khai báo với kiểu dữ liệu rõ ràng cho mảng
          const demoEvents: Array<Event> = [
            {
              id: "1",
              title: "Tech Conference 2023",
              date: new Date("2023-12-15"),
              location: "Convention Center, New York",
              isOnline: false,
              imageUrl:
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format",
              totalTickets: 500,
              soldTickets: 378,
              status: "upcoming", // Literal type
              revenue: 18900,
            },
            {
              id: "2",
              title: "JavaScript Workshop",
              date: new Date("2023-11-20"),
              location: "https://zoom.us/j/123456789",
              isOnline: true,
              imageUrl:
                "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?w=500&auto=format",
              totalTickets: 100,
              soldTickets: 87,
              status: "ongoing", // Literal type
              revenue: 2610,
            },
            {
              id: "3",
              title: "Music Festival",
              date: new Date("2023-08-10"),
              location: "Central Park, New York",
              isOnline: false,
              imageUrl:
                "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&auto=format",
              totalTickets: 1000,
              soldTickets: 750,
              status: "past", // Literal type
              revenue: 37500,
            },
          ] as Event[]; // Type assertion

          setEvents(demoEvents);

          // Cập nhật analytics
          const stats: Analytics = {
            totalEvents: demoEvents.length,
            upcomingEvents: demoEvents.filter((e) => e.status === "upcoming")
              .length,
            pastEvents: demoEvents.filter((e) => e.status === "past").length,
          };
          setAnalytics(stats);

          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        toast({
          title: "Không thể tải dữ liệu",
          description: "Đã xảy ra lỗi khi tải dữ liệu sự kiện.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, toast]);

  // Lọc sự kiện theo trạng thái
  const upcomingEvents = events.filter((event) => event.status === "upcoming");
  const ongoingEvents = events.filter((event) => event.status === "ongoing");
  const pastEvents = events.filter((event) => event.status === "past");

  // Chuyển đến trang chỉnh sửa sự kiện
  const handleEditEvent = (eventId: string) => {
    // Trong thực tế, gọi API để lấy dữ liệu sự kiện để chỉnh sửa
    navigate(`/create-event?edit=${eventId}`);
    toast({
      title: "Chỉnh sửa sự kiện",
      description: "Đang tải dữ liệu sự kiện để chỉnh sửa",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  // Mở hộp thoại xác nhận khi hủy sự kiện
  const confirmCancelEvent = (eventId: string) => {
    setEventToCancel(eventId);
    onOpen();
  };

  // Xử lý hủy sự kiện sau khi xác nhận
  const handleCancelConfirmed = async () => {
    if (!eventToCancel) return;

    try {
      // Trong tương lai, sẽ gọi API để hủy sự kiện
      // await cancelEvent(eventToCancel);

      // Cập nhật trạng thái UI
      const updatedEvents = events.map((event) =>
        event.id === eventToCancel
          ? { ...event, status: "cancelled" as const }
          : event
      );
      setEvents(updatedEvents);

      toast({
        title: "Đã hủy sự kiện",
        description: "Sự kiện đã được hủy thành công.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể hủy sự kiện. Vui lòng thử lại sau.";
      toast({
        title: "Lỗi",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
      setEventToCancel(null);
    }
  };

  // Màu sắc cho giao diện
  const cardBg = useColorModeValue("white", "gray.800");
  const statBg = useColorModeValue("gray.50", "gray.700");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");
  const cancelBtnBg = useColorModeValue("red.50", "red.900");
  const cancelBtnColor = useColorModeValue("red.600", "red.200");
  const cancelBtnHoverBg = useColorModeValue("red.100", "red.800");

  if (isLoading) {
    return (
      <Container maxW="7xl" py={8}>
        <Flex direction="column" align="center" justify="center" minH="60vh">
          <Spinner size="xl" color="teal.500" thickness="4px" />
          <Text mt={4}>Đang tải dữ liệu...</Text>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      <Box mb={6}>
        <Heading as="h1" size="xl" mb={2}>
          Bảng Điều Khiển Nhà Tổ Chức
        </Heading>
        <Text color="gray.500">Quản lý sự kiện và xem thông tin tổng quan</Text>
      </Box>

      {/* Thống kê tổng quan đơn giản */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="md">
          <Flex justify="space-between">
            <Box>
              <StatLabel fontWeight="medium">Tổng Số Sự Kiện</StatLabel>
              <StatNumber>{analytics.totalEvents}</StatNumber>
              <StatHelpText>{analytics.upcomingEvents} sắp tới</StatHelpText>
            </Box>
            <Box
              bg="teal.500"
              w="40px"
              h="40px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
            >
              <FaCalendarAlt />
            </Box>
          </Flex>
        </Stat>

        <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="md">
          <Flex justify="space-between">
            <Box>
              <StatLabel fontWeight="medium">Sự Kiện Sắp Tới</StatLabel>
              <StatNumber>{analytics.upcomingEvents}</StatNumber>
              <StatHelpText>Cần chuẩn bị</StatHelpText>
            </Box>
            <Box
              bg="blue.500"
              w="40px"
              h="40px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
            >
              <FaUsers />
            </Box>
          </Flex>
        </Stat>

        <Stat bg={statBg} p={4} borderRadius="lg" boxShadow="md">
          <Flex justify="space-between">
            <Box>
              <StatLabel fontWeight="medium">Sự Kiện Đã Qua</StatLabel>
              <StatNumber>{analytics.pastEvents}</StatNumber>
              <StatHelpText>Đã hoàn thành</StatHelpText>
            </Box>
            <Box
              bg="green.500"
              w="40px"
              h="40px"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
            >
              <FaTicketAlt />
            </Box>
          </Flex>
        </Stat>
      </SimpleGrid>

      {/* Tabs cho quản lý sự kiện */}
      <Box bg={cardBg} p={4} borderRadius="lg" boxShadow="md">
        <Tabs colorScheme="teal" isFitted variant="enclosed">
          <TabList mb={4}>
            <Tab fontWeight="medium">Sự Kiện Sắp Tới</Tab>
            <Tab fontWeight="medium">Sự Kiện Đang Diễn Ra</Tab>
            <Tab fontWeight="medium">Sự Kiện Đã Qua</Tab>
          </TabList>

          <TabPanels>
            {/* Tab sự kiện sắp tới */}
            <TabPanel p={0}>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Sự Kiện Sắp Tới Của Bạn</Heading>
                <Button
                  as={RouterLink}
                  to="/create-event"
                  colorScheme="teal"
                  leftIcon={<FaPlus />}
                  size="sm"
                >
                  Tạo Sự Kiện Mới
                </Button>
              </Flex>

              {upcomingEvents.length === 0 ? (
                <Text py={4}>Bạn không có sự kiện sắp tới nào.</Text>
              ) : (
                <Table variant="simple">
                  <Thead bg={tableHeaderBg}>
                    <Tr>
                      <Th>Sự Kiện</Th>
                      <Th>Ngày</Th>
                      <Th>Bán Vé</Th>
                      <Th>Thao Tác</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {upcomingEvents.map((event) => (
                      <Tr key={event.id}>
                        <Td>
                          <HStack>
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              boxSize="40px"
                              borderRadius="md"
                              objectFit="cover"
                            />
                            <VStack align="start" spacing={0}>
                              <Link
                                as={RouterLink}
                                to={`/events/${event.id}`}
                                fontWeight="medium"
                                _hover={{ color: "teal.500" }}
                              >
                                {event.title}
                              </Link>
                              <Text fontSize="xs" color="gray.500">
                                {event.isOnline
                                  ? "Sự Kiện Trực Tuyến"
                                  : event.location}
                              </Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td>
                          {event.date.toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Td>
                        <Td>
                          {event.soldTickets && event.totalTickets ? (
                            <VStack align="start" spacing={1}>
                              <Text>
                                {event.soldTickets}/{event.totalTickets} (
                                {Math.round(
                                  (event.soldTickets / event.totalTickets) * 100
                                )}
                                %)
                              </Text>
                              <Progress
                                value={
                                  (event.soldTickets / event.totalTickets) * 100
                                }
                                size="sm"
                                colorScheme="teal"
                                w="100%"
                                borderRadius="full"
                              />
                            </VStack>
                          ) : (
                            <Text>--</Text>
                          )}
                        </Td>
                        <Td>
                          <HStack spacing={1}>
                            <Tooltip label="Chỉnh sửa sự kiện">
                              <IconButton
                                aria-label="Chỉnh sửa"
                                icon={<FaEdit />}
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => handleEditEvent(event.id)}
                              />
                            </Tooltip>
                            <Tooltip label="Hủy sự kiện">
                              <IconButton
                                aria-label="Hủy sự kiện"
                                icon={<FaTrash />}
                                size="sm"
                                bg={cancelBtnBg}
                                color={cancelBtnColor}
                                _hover={{
                                  bg: cancelBtnHoverBg,
                                }}
                                onClick={() => confirmCancelEvent(event.id)}
                              />
                            </Tooltip>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TabPanel>

            {/* Tab sự kiện đang diễn ra */}
            <TabPanel p={0}>
              <Heading size="md" mb={4}>
                Sự Kiện Đang Diễn Ra Của Bạn
              </Heading>

              {ongoingEvents.length === 0 ? (
                <Text py={4}>Bạn không có sự kiện đang diễn ra nào.</Text>
              ) : (
                <Table variant="simple">
                  <Thead bg={tableHeaderBg}>
                    <Tr>
                      <Th>Sự Kiện</Th>
                      <Th>Ngày</Th>
                      <Th>Bán Vé</Th>
                      <Th>Thao Tác</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {ongoingEvents.map((event) => (
                      <Tr key={event.id}>
                        <Td>
                          <HStack>
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              boxSize="40px"
                              borderRadius="md"
                              objectFit="cover"
                            />
                            <VStack align="start" spacing={0}>
                              <Flex align="center">
                                <Link
                                  as={RouterLink}
                                  to={`/events/${event.id}`}
                                  fontWeight="medium"
                                  _hover={{ color: "teal.500" }}
                                  mr={2}
                                >
                                  {event.title}
                                </Link>
                                <Badge colorScheme="green" fontSize="2xs">
                                  Đang diễn ra
                                </Badge>
                              </Flex>
                              <Text fontSize="xs" color="gray.500">
                                {event.isOnline
                                  ? "Sự Kiện Trực Tuyến"
                                  : event.location}
                              </Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td>
                          {event.date.toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Td>
                        <Td>
                          {event.soldTickets && event.totalTickets ? (
                            <VStack align="start" spacing={1}>
                              <Text>
                                {event.soldTickets}/{event.totalTickets} (
                                {Math.round(
                                  (event.soldTickets / event.totalTickets) * 100
                                )}
                                %)
                              </Text>
                            </VStack>
                          ) : (
                            <Text>--</Text>
                          )}
                        </Td>
                        <Td>
                          <HStack spacing={1}>
                            <Tooltip label="Điểm danh người tham gia">
                              <IconButton
                                aria-label="Điểm danh"
                                icon={<FaQrcode />}
                                size="sm"
                                variant="ghost"
                                colorScheme="teal"
                                onClick={() =>
                                  navigate(
                                    `/organizer/events/${event.id}/check-in`
                                  )
                                }
                              />
                            </Tooltip>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TabPanel>

            {/* Tab sự kiện đã qua */}
            <TabPanel p={0}>
              <Heading size="md" mb={4}>
                Sự Kiện Đã Qua Của Bạn
              </Heading>

              {pastEvents.length === 0 ? (
                <Text py={4}>Bạn không có sự kiện đã qua nào.</Text>
              ) : (
                <Table variant="simple">
                  <Thead bg={tableHeaderBg}>
                    <Tr>
                      <Th>Sự Kiện</Th>
                      <Th>Ngày</Th>
                      <Th>Người Tham Gia</Th>
                      <Th>Thao Tác</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {pastEvents.map((event) => (
                      <Tr key={event.id}>
                        <Td>
                          <HStack>
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              boxSize="40px"
                              borderRadius="md"
                              objectFit="cover"
                            />
                            <VStack align="start" spacing={0}>
                              <Flex align="center">
                                <Link
                                  as={RouterLink}
                                  to={`/events/${event.id}`}
                                  fontWeight="medium"
                                  _hover={{ color: "teal.500" }}
                                  mr={2}
                                >
                                  {event.title}
                                </Link>
                                <Badge colorScheme="gray" fontSize="2xs">
                                  Đã kết thúc
                                </Badge>
                              </Flex>
                              <Text fontSize="xs" color="gray.500">
                                {event.isOnline
                                  ? "Sự Kiện Trực Tuyến"
                                  : event.location}
                              </Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td>
                          {event.date.toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Td>
                        <Td>{event.soldTickets || "--"}</Td>
                        <Td>
                          <Link
                            as={RouterLink}
                            to={`/events/${event.id}`}
                            color="teal.500"
                          >
                            Xem chi tiết
                          </Link>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Modal xác nhận hủy sự kiện */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Xác Nhận Hủy Sự Kiện</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Bạn có chắc chắn muốn hủy sự kiện này không?</Text>
              <Text mt={2} fontSize="sm" color="gray.500">
                Sự kiện sẽ được đánh dấu là đã hủy và tất cả người đăng ký sẽ
                được thông báo. Dữ liệu sự kiện vẫn được giữ lại trong hệ thống.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Đóng</Button>
              <Button
                colorScheme="red"
                onClick={() => handleCancelConfirmed()}
                ml={3}
              >
                Hủy Sự Kiện
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
};

export default Dashboard;
