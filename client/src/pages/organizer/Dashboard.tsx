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
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchUserEvents,
  fetchOrganizerDashboardStats,
  selectUserEvents,
  selectEventLoading,
  selectEventError,
  selectDashboardStats,
  toggleEventVisibility,
} from "../../app/features/eventSlice";

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
  isHidden?: boolean;
}

// Định nghĩa kiểu dữ liệu cho sự kiện từ API
interface ApiEvent {
  id?: string;
  _id?: string;
  title: string;
  date: string | Date;
  location: string;
  isOnline?: boolean;
  imageUrl?: string;
  capacity?: number;
  attendees?: number;
  status?: string;
  isPaid?: boolean;
  price?: number;
  isHidden?: boolean;
  ticketTypes?: Array<{
    quantity: number;
    availableQuantity: number;
    price: number;
  }>;
}

const Dashboard = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventToCancel, setEventToCancel] = useState<string | null>(null);

  // Sử dụng Redux hooks để lấy dữ liệu
  const isLoading = useAppSelector(selectEventLoading);
  const error = useAppSelector(selectEventError);
  const userEventsResponse = useAppSelector(selectUserEvents);
  const dashboardStats = useAppSelector(selectDashboardStats);

  // State cho dữ liệu đã được xử lý
  const [events, setEvents] = useState<Event[]>([]);

  // Tải dữ liệu sự kiện từ API
  useEffect(() => {
    // Dispatch actions để lấy dữ liệu
    dispatch(fetchUserEvents());
    dispatch(fetchOrganizerDashboardStats());
  }, [dispatch]);

  // Xử lý dữ liệu khi nhận được từ Redux
  useEffect(() => {
    if (!userEventsResponse) return;

    // Trích xuất mảng sự kiện, kiểm tra cấu trúc của đối tượng response
    let eventsList: any[] = [];

    if (Array.isArray(userEventsResponse)) {
      eventsList = userEventsResponse;
    } else if (userEventsResponse && typeof userEventsResponse === "object") {
      // @ts-expect-error - Để tránh lỗi TypeScript
      eventsList = userEventsResponse.events || [];
    }

    console.log("Events list:", eventsList);

    // Chuyển đổi dữ liệu từ API sang định dạng cần thiết
    const formattedEvents = eventsList.map((event) => {
      const eventStatus = determineEventStatus(event);
      return {
        id: event.id || event._id || "",
        title: event.title,
        date: new Date(event.date),
        location: event.location,
        isOnline: event.isOnline || false,
        imageUrl: event.imageUrl || "https://via.placeholder.com/150",
        totalTickets: event.capacity || 0,
        soldTickets: event.attendees || 0,
        status: eventStatus,
        revenue: calculateEventRevenue(event),
        isHidden: event.isHidden || false,
      };
    });

    console.log(
      "Upcoming events count:",
      formattedEvents.filter((e: Event) => e.status === "upcoming").length
    );
    setEvents(formattedEvents);
  }, [userEventsResponse]);

  // Hiển thị thông báo lỗi nếu có
  useEffect(() => {
    if (error) {
      toast({
        title: "Lỗi",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  // Helper function để xác định trạng thái sự kiện
  const determineEventStatus = (
    event: any
  ): "upcoming" | "ongoing" | "past" | "cancelled" => {
    console.log(`Checking event status for: ${event.title}`);
    console.log(
      `Event date: ${event.date}, event status from API: ${event.status}`
    );

    if (event.status === "cancelled") {
      console.log(`Event ${event.title} is cancelled`);
      return "cancelled";
    }

    const eventDate = new Date(event.date);
    const now = new Date();

    console.log(
      `Event date: ${eventDate.toISOString()}, Current date: ${now.toISOString()}`
    );

    // So sánh theo ngày, bỏ qua giờ phút giây
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDay = new Date(eventDate);
    eventDay.setHours(0, 0, 0, 0);

    console.log(
      `Event day: ${eventDay.toISOString()}, Today: ${today.toISOString()}`
    );
    console.log(
      `Comparison result: ${
        eventDay.getTime() > today.getTime()
          ? "UPCOMING"
          : eventDay.getTime() === today.getTime()
          ? "ONGOING"
          : "PAST"
      }`
    );

    if (eventDay.getTime() === today.getTime()) {
      return "ongoing";
    }

    if (eventDay.getTime() > today.getTime()) {
      return "upcoming";
    }

    return "past";
  };

  // Helper function để tính doanh thu sự kiện
  const calculateEventRevenue = (event: ApiEvent): number => {
    if (!event.isPaid) return 0;

    let revenue = 0;

    if (event.ticketTypes && event.ticketTypes.length > 0) {
      event.ticketTypes.forEach((ticketType) => {
        const soldQuantity = ticketType.quantity - ticketType.availableQuantity;
        revenue += soldQuantity * ticketType.price;
      });
    } else if (event.price && event.attendees) {
      revenue = event.price * event.attendees;
    }

    return revenue;
  };

  // Lọc sự kiện theo trạng thái
  const upcomingEvents = events.filter((event) => event.status === "upcoming");
  const ongoingEvents = events.filter((event) => event.status === "ongoing");
  const pastEvents = events.filter((event) => event.status === "past");

  // Chuyển đến trang chỉnh sửa sự kiện
  const handleEditEvent = (eventId: string) => {
    navigate(`/create-event?edit=${eventId}`);
    toast({
      title: "Đang mở trang chỉnh sửa",
      description: "Đang chuyển hướng đến trang chỉnh sửa sự kiện",
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

  // Xử lý ẩn/hiện sự kiện
  const handleToggleVisibility = async (
    eventId: string,
    currentlyHidden: boolean
  ) => {
    try {
      await dispatch(
        toggleEventVisibility({ id: eventId, isHidden: !currentlyHidden })
      ).unwrap();

      // Cập nhật UI
      const updatedEvents = events.map((event) =>
        event.id === eventId ? { ...event, isHidden: !currentlyHidden } : event
      );
      setEvents(updatedEvents);

      toast({
        title: currentlyHidden
          ? "Sự kiện đã được hiển thị"
          : "Sự kiện đã được ẩn",
        description: currentlyHidden
          ? "Sự kiện đã được hiển thị công khai trở lại"
          : "Sự kiện đã bị ẩn khỏi danh sách công khai",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể thay đổi trạng thái hiển thị. Vui lòng thử lại sau.";
      toast({
        title: "Lỗi",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
              <StatNumber>
                {dashboardStats?.totalEvents || events.length}
              </StatNumber>
              <StatHelpText>
                {dashboardStats?.upcomingEvents || upcomingEvents.length} sắp
                tới
              </StatHelpText>
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
              <StatNumber>
                {dashboardStats?.upcomingEvents || upcomingEvents.length}
              </StatNumber>
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
              <StatNumber>
                {dashboardStats?.pastEvents || pastEvents.length}
              </StatNumber>
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
                              {event.isHidden && (
                                <Badge colorScheme="gray" fontSize="2xs" ml={2}>
                                  Ẩn
                                </Badge>
                              )}
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
                          {event.soldTickets !== undefined &&
                          event.totalTickets !== undefined ? (
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
                            <Tooltip
                              label={
                                event.isHidden ? "Hiện sự kiện" : "Ẩn sự kiện"
                              }
                            >
                              <IconButton
                                aria-label={
                                  event.isHidden ? "Hiện sự kiện" : "Ẩn sự kiện"
                                }
                                icon={
                                  event.isHidden ? <FaEye /> : <FaEyeSlash />
                                }
                                size="sm"
                                variant="ghost"
                                colorScheme={event.isHidden ? "green" : "gray"}
                                onClick={() =>
                                  handleToggleVisibility(
                                    event.id,
                                    !!event.isHidden
                                  )
                                }
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
                                display="none"
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
                                {event.isHidden && (
                                  <Badge
                                    colorScheme="gray"
                                    fontSize="2xs"
                                    mr={2}
                                  >
                                    Ẩn
                                  </Badge>
                                )}
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
                          {event.soldTickets !== undefined &&
                          event.totalTickets !== undefined ? (
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
                                {event.isHidden && (
                                  <Badge colorScheme="gray" fontSize="2xs">
                                    Ẩn
                                  </Badge>
                                )}
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
