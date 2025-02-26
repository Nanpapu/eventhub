import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Badge,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Link,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaEllipsisV,
  FaDownload,
} from "react-icons/fa";
import { format } from "date-fns";

// Định nghĩa kiểu dữ liệu cho sự kiện đã đăng ký
interface RegisteredEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  isOnline: boolean;
  organizer: string;
  imageUrl: string;
  ticketType: "free" | "paid";
  ticketId: string;
  status: "upcoming" | "past" | "cancelled";
}

const MyEvents = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<RegisteredEvent | null>(
    null
  );

  // Dữ liệu mẫu về các sự kiện đã đăng ký (sẽ được thay thế bằng API call)
  const [registeredEvents, setRegisteredEvents] = useState<RegisteredEvent[]>([
    {
      id: "1",
      title: "Tech Conference 2023",
      date: new Date("2023-12-15"),
      time: "09:00 AM - 05:00 PM",
      location: "Convention Center, New York",
      isOnline: false,
      organizer: "Tech Events Inc.",
      imageUrl:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format",
      ticketType: "paid",
      ticketId: "TKT-001-123456",
      status: "upcoming",
    },
    {
      id: "2",
      title: "JavaScript Workshop",
      date: new Date("2023-11-20"),
      time: "10:00 AM - 02:00 PM",
      location: "https://zoom.us/j/123456789",
      isOnline: true,
      organizer: "JS Enthusiasts",
      imageUrl:
        "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?w=500&auto=format",
      ticketType: "free",
      ticketId: "TKT-002-789012",
      status: "upcoming",
    },
    {
      id: "3",
      title: "Music Festival",
      date: new Date("2023-08-10"),
      time: "04:00 PM - 11:00 PM",
      location: "Central Park, New York",
      isOnline: false,
      organizer: "Music Events Co.",
      imageUrl:
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&auto=format",
      ticketType: "paid",
      ticketId: "TKT-003-345678",
      status: "past",
    },
    {
      id: "4",
      title: "Data Science Meetup",
      date: new Date("2023-09-05"),
      time: "06:00 PM - 08:30 PM",
      location: "Community Center, Boston",
      isOnline: false,
      organizer: "Data Science Community",
      imageUrl:
        "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=500&auto=format",
      ticketType: "free",
      ticketId: "TKT-004-901234",
      status: "past",
    },
    {
      id: "5",
      title: "Business Networking Event",
      date: new Date("2023-12-28"),
      time: "07:00 PM - 09:00 PM",
      location: "Grand Hotel, Chicago",
      isOnline: false,
      organizer: "Business Network Association",
      imageUrl:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&auto=format",
      ticketType: "paid",
      ticketId: "TKT-005-567890",
      status: "upcoming",
    },
  ]);

  // Lọc sự kiện theo trạng thái
  const upcomingEvents = registeredEvents.filter(
    (event) => event.status === "upcoming"
  );
  const pastEvents = registeredEvents.filter(
    (event) => event.status === "past"
  );

  // Xử lý hủy đăng ký sự kiện
  const handleCancelRegistration = () => {
    if (!selectedEvent) return;

    // Giả lập hủy đăng ký (sẽ thay thế bằng API call)
    const updatedEvents = registeredEvents.filter(
      (event) => event.id !== selectedEvent.id
    );
    setRegisteredEvents(updatedEvents);

    toast({
      title: "Registration cancelled",
      description: `You have cancelled your registration for ${selectedEvent.title}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onClose();
  };

  // Xử lý xem/tải vé
  const handleViewTicket = (event: RegisteredEvent) => {
    // Giả lập xem/tải vé (sẽ thay thế bằng chức năng thực tế)
    toast({
      title: "Ticket ready to download",
      description: `Ticket ID: ${event.ticketId}`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Mở modal xác nhận hủy đăng ký
  const openCancelModal = (event: RegisteredEvent) => {
    setSelectedEvent(event);
    onOpen();
  };

  // Màu sắc cho các thành phần UI
  const cardBg = useColorModeValue("white", "gray.800");
  const boxShadow = useColorModeValue("lg", "dark-lg");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl">
          My Events
        </Heading>

        <Tabs colorScheme="teal" isFitted variant="enclosed">
          <TabList mb={4}>
            <Tab fontWeight="medium">
              Upcoming Events ({upcomingEvents.length})
            </Tab>
            <Tab fontWeight="medium">Past Events ({pastEvents.length})</Tab>
          </TabList>

          <TabPanels>
            {/* Tab sự kiện sắp tới */}
            <TabPanel p={0}>
              {upcomingEvents.length === 0 ? (
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
                    No upcoming events
                  </AlertTitle>
                  <AlertDescription maxWidth="sm">
                    You haven't registered for any upcoming events yet. Explore
                    events and join one!
                  </AlertDescription>
                  <Button
                    as={RouterLink}
                    to="/events"
                    colorScheme="teal"
                    mt={4}
                  >
                    Explore Events
                  </Button>
                </Alert>
              ) : (
                <Grid
                  templateColumns={{
                    base: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  }}
                  gap={6}
                >
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onCancelRegistration={() => openCancelModal(event)}
                      onViewTicket={() => handleViewTicket(event)}
                    />
                  ))}
                </Grid>
              )}
            </TabPanel>

            {/* Tab sự kiện đã qua */}
            <TabPanel p={0}>
              {pastEvents.length === 0 ? (
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
                    No past events
                  </AlertTitle>
                  <AlertDescription maxWidth="sm">
                    You haven't attended any events yet.
                  </AlertDescription>
                </Alert>
              ) : (
                <Grid
                  templateColumns={{
                    base: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  }}
                  gap={6}
                >
                  {pastEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isPast={true}
                      onViewTicket={() => handleViewTicket(event)}
                    />
                  ))}
                </Grid>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Modal xác nhận hủy đăng ký */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Cancellation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to cancel your registration for{" "}
            <strong>{selectedEvent?.title}</strong>?
            {selectedEvent?.ticketType === "paid" && (
              <Text mt={2} color="red.500">
                Note: Refund policies may apply as per the event organizer's
                terms.
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              No, Keep Registration
            </Button>
            <Button colorScheme="red" onClick={handleCancelRegistration}>
              Yes, Cancel Registration
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

// Component thẻ sự kiện
interface EventCardProps {
  event: RegisteredEvent;
  isPast?: boolean;
  onCancelRegistration?: () => void;
  onViewTicket: () => void;
}

const EventCard = ({
  event,
  isPast = false,
  onCancelRegistration,
  onViewTicket,
}: EventCardProps) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      bg={cardBg}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      borderWidth="1px"
      borderColor={borderColor}
      transition="transform 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "xl",
      }}
    >
      {/* Ảnh sự kiện */}
      <Box position="relative">
        <Image
          src={event.imageUrl}
          alt={event.title}
          objectFit="cover"
          h="160px"
          w="100%"
        />

        {/* Badge trạng thái */}
        <Badge
          position="absolute"
          top="2"
          right="2"
          colorScheme={event.ticketType === "free" ? "green" : "purple"}
          fontSize="0.8em"
          px={2}
          py={1}
          borderRadius="md"
        >
          {event.ticketType === "free" ? "Free" : "Paid"}
        </Badge>
      </Box>

      {/* Nội dung thẻ */}
      <Box p={4}>
        <Heading as="h3" size="md" noOfLines={2} mb={2}>
          <Link
            as={RouterLink}
            to={`/events/${event.id}`}
            _hover={{ textDecoration: "none", color: "teal.500" }}
          >
            {event.title}
          </Link>
        </Heading>

        <VStack align="start" spacing={1} mb={4}>
          <HStack>
            <FaCalendarAlt color="#718096" />
            <Text fontSize="sm" color="gray.600">
              {format(event.date, "EEEE, MMMM d, yyyy")} • {event.time}
            </Text>
          </HStack>

          <HStack>
            <FaMapMarkerAlt color="#718096" />
            <Text fontSize="sm" color="gray.600" noOfLines={1}>
              {event.isOnline ? "Online Event" : event.location}
            </Text>
          </HStack>

          <HStack>
            <FaTicketAlt color="#718096" />
            <Text fontSize="sm" color="gray.600">
              Ticket ID: {event.ticketId}
            </Text>
          </HStack>
        </VStack>

        {/* Nút tương tác */}
        <Flex justify="space-between" align="center">
          <Button
            leftIcon={<FaDownload />}
            size="sm"
            colorScheme="teal"
            variant="outline"
            onClick={onViewTicket}
          >
            View Ticket
          </Button>

          {!isPast && onCancelRegistration && (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FaEllipsisV />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                <MenuItem onClick={onCancelRegistration} color="red.500">
                  Cancel Registration
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default MyEvents;
