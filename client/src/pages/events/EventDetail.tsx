import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  useToast,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  IconButton,
  useColorModeValue,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Avatar,
  Tooltip,
  Center,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiShare2 } from "react-icons/fi";
import { EventReview } from "../../components/events";
import {
  BsBookmark,
  BsBookmarkFill,
  BsCalendar,
  BsGeoAlt,
  BsPerson,
  BsPeople,
} from "react-icons/bs";
import { FiMail } from "react-icons/fi";

// Interface cho dữ liệu sự kiện
export interface EventData {
  id: string | number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  location: string;
  startDate: string;
  endDate: string;
  isFree: boolean;
  price?: number;
  availableTickets?: number;
  rating?: number;
  reviewCount?: number;
  attendees?: any[];
  organizer?: {
    id: string;
    name: string;
    image?: string;
    events?: number;
  };
}

// Dữ liệu mẫu cho sự kiện
const eventData: EventData = {
  id: 1,
  title: "UI/UX Design Workshop",
  description:
    "Join us for a hands-on workshop where you'll learn the fundamentals of UI/UX design. This workshop is perfect for beginners and intermediate designers who want to improve their skills. We'll cover the design thinking process, user research, wireframing, prototyping, and usability testing. By the end of this workshop, you'll have created a complete design for a mobile app.\n\nTopics covered:\n- Design principles and fundamentals\n- User-centered design processes\n- Creating user personas and user flows\n- Wireframing and prototyping\n- Design systems and component libraries\n- Usability testing and iteration\n\nAll participants will receive a certificate of completion and access to exclusive design resources.",
  date: "15/08/2023",
  startTime: "09:00 AM",
  endTime: "04:00 PM",
  location: "Technology Innovation Hub",
  address: "123 Tech Street, District 1, Ho Chi Minh City",
  image: "https://bit.ly/3IZUfQd",
  category: "workshop",
  isPaid: true,
  price: 25.99,
  organizer: {
    name: "TechDesign Academy",
    avatar: "https://bit.ly/3Q3eQvj",
  },
  attendees: 42,
  capacity: 50,
};

// Dữ liệu mẫu cho bình luận - không còn sử dụng nhưng giữ lại làm tài liệu
// const commentsData: Comment[] = [ ... ];

const EventDetail = () => {
  // Lấy ID sự kiện từ URL nhưng không sử dụng
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const navigate = useNavigate();

  // State cho các trạng thái trong trang
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isPastEvent, setIsPastEvent] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>({
    id: "user-123",
  }); // Mock user

  // Màu sắc thay đổi theo chế độ màu
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const tabBgColor = useColorModeValue("gray.50", "gray.900");

  // Tải dữ liệu sự kiện
  useEffect(() => {
    // Mock data - sẽ thay thế bằng API call thực tế
    setTimeout(() => {
      setEventData({
        id: "1",
        title: "React Developer Conference 2023",
        description:
          "Join us for the biggest React conference in Asia. Learn from industry experts and connect with the React community.\n\nThis three-day event features workshops, talks, and networking opportunities. Whether you're a beginner or an experienced developer, there's something for everyone!",
        category: "Technology",
        imageUrl:
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
        location: "Singapore Convention Center",
        startDate: "2023-10-15T09:00:00",
        endDate: "2023-10-17T18:00:00",
        isFree: false,
        price: 299.99,
        availableTickets: 45,
        rating: 4.7,
        reviewCount: 32,
        attendees: [{ id: "1" }, { id: "2" }],
        organizer: {
          id: "org1",
          name: "React Asia",
          image: "https://randomuser.me/api/portraits/men/32.jpg",
          events: 15,
        },
      });
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Xử lý đăng ký tham gia sự kiện
  const handleRegister = () => {
    setIsRegistered(!isRegistered);
    toast({
      title: isRegistered
        ? "Registration cancelled"
        : "Registration successful!",
      description: isRegistered
        ? "You have cancelled your registration for this event."
        : "You have successfully registered for this event.",
      status: isRegistered ? "info" : "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Xử lý lưu sự kiện
  const handleSaveEvent = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from saved events" : "Event saved!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Xử lý chia sẻ sự kiện
  const handleShare = () => {
    // Logic chia sẻ sẽ được thêm sau khi có backend
    toast({
      title: "Share link copied!",
      description: "Event link has been copied to clipboard.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Xử lý chuyển tới trang thanh toán
  const handleBuyTicket = () => {
    navigate(`/events/${id}/checkout`);
    toast({
      title: "Proceeding to checkout",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box
      maxW="1200px"
      mx="auto"
      px={{ base: 4, md: 8 }}
      py={8}
      bg={bgColor}
      color={textColor}
    >
      {isLoading ? (
        <Center h="400px">
          <Spinner size="xl" color="teal.500" />
        </Center>
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Breadcrumb */}
          <Breadcrumb mb={8} fontSize="sm" color={secondaryTextColor}>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/events">Events</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{eventData?.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Event Detail */}
          <Grid templateColumns={{ base: "1fr", md: "5fr 3fr" }} gap={10}>
            {/* Left Column */}
            <GridItem>
              {/* Event Image */}
              <Box
                position="relative"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="xl"
                mb={6}
              >
                <Image
                  src={eventData?.imageUrl || "/images/event-placeholder.jpg"}
                  alt={eventData?.title}
                  w="100%"
                  h={{ base: "250px", md: "400px" }}
                  objectFit="cover"
                />

                {/* Category and Paid/Free Badge */}
                <HStack position="absolute" top={4} right={4} spacing={2}>
                  <Badge
                    colorScheme="teal"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="sm"
                    textTransform="capitalize"
                  >
                    {eventData?.category}
                  </Badge>
                  <Badge
                    colorScheme={eventData?.isFree ? "green" : "purple"}
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="sm"
                  >
                    {eventData?.isFree ? "Free" : "Paid"}
                  </Badge>
                </HStack>
              </Box>

              {/* Event Content */}
              <VStack align="start" spacing={6}>
                <Flex
                  width="100%"
                  justifyContent="space-between"
                  alignItems={{ base: "start", md: "center" }}
                  flexDirection={{ base: "column", md: "row" }}
                  gap={4}
                >
                  <Heading size="xl" color={textColor}>
                    {eventData?.title}
                  </Heading>

                  <HStack spacing={2}>
                    <Tooltip
                      label={isSaved ? "Remove from saved" : "Save event"}
                    >
                      <IconButton
                        aria-label="Save event"
                        icon={isSaved ? <BsBookmarkFill /> : <BsBookmark />}
                        colorScheme="teal"
                        variant="outline"
                        onClick={handleSaveEvent}
                        borderColor={borderColor}
                        color={textColor}
                        _hover={{ bg: "teal.50", color: "teal.500" }}
                      />
                    </Tooltip>
                    <Tooltip label="Share event">
                      <IconButton
                        aria-label="Share event"
                        icon={<FiShare2 />}
                        colorScheme="teal"
                        variant="outline"
                        borderColor={borderColor}
                        color={textColor}
                        _hover={{ bg: "teal.50", color: "teal.500" }}
                      />
                    </Tooltip>
                  </HStack>
                </Flex>

                {/* Event Details */}
                <Grid
                  templateColumns={{ base: "1fr", sm: "1fr 1fr" }}
                  gap={6}
                  width="100%"
                  p={5}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  bg={cardBgColor}
                >
                  <HStack>
                    <Icon as={BsCalendar} boxSize={5} color="teal.500" />
                    <Box>
                      <Text fontWeight="bold" color={textColor}>
                        Date & Time
                      </Text>
                      <Text color={secondaryTextColor}>
                        {new Date(
                          eventData?.startDate || ""
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Text>
                      <Text color={secondaryTextColor}>
                        {new Date(
                          eventData?.startDate || ""
                        ).toLocaleTimeString()}{" "}
                        -{" "}
                        {new Date(
                          eventData?.endDate || ""
                        ).toLocaleTimeString()}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack>
                    <Icon as={BsGeoAlt} boxSize={5} color="teal.500" />
                    <Box>
                      <Text fontWeight="bold" color={textColor}>
                        Location
                      </Text>
                      <Text color={secondaryTextColor}>
                        {eventData?.location}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack>
                    <Icon as={BsPerson} boxSize={5} color="teal.500" />
                    <Box>
                      <Text fontWeight="bold" color={textColor}>
                        Organizer
                      </Text>
                      <Text color={secondaryTextColor}>
                        {eventData?.organizer?.name}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack>
                    <Icon as={BsPeople} boxSize={5} color="teal.500" />
                    <Box>
                      <Text fontWeight="bold" color={textColor}>
                        Attendees
                      </Text>
                      <Text color={secondaryTextColor}>
                        {eventData?.attendees?.length || 0} registered
                      </Text>
                    </Box>
                  </HStack>
                </Grid>

                {/* Description */}
                <Box width="100%">
                  <Heading size="md" mb={4} color={textColor}>
                    About this event
                  </Heading>
                  <Text color={textColor} whiteSpace="pre-line">
                    {eventData?.description}
                  </Text>
                </Box>

                {/* Tabs: Reviews & Comments */}
                <Box width="100%" mt={8}>
                  <Tabs isFitted variant="enclosed" colorScheme="teal">
                    <TabList
                      mb="1em"
                      bg={tabBgColor}
                      borderColor={borderColor}
                      borderRadius="md"
                    >
                      <Tab
                        _selected={{
                          color: "teal.500",
                          borderColor: "teal.500",
                          borderBottomColor: cardBgColor,
                          bg: cardBgColor,
                        }}
                        color={textColor}
                      >
                        Reviews & Comments
                      </Tab>
                    </TabList>
                    <TabPanels
                      borderWidth="1px"
                      borderColor={borderColor}
                      borderRadius="md"
                      p={4}
                      bg={cardBgColor}
                    >
                      <TabPanel>
                        <EventReview
                          eventId={eventData?.id}
                          currentUserId={currentUser?.id}
                          canAddReview={isRegistered && !isPastEvent}
                          onReviewAdded={() => console.log("Review added")}
                          rating={eventData?.rating}
                          reviewCount={eventData?.reviewCount}
                        />
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Box>
              </VStack>
            </GridItem>

            {/* Right Column - Pricing & Registration */}
            <GridItem>
              <Box
                position="sticky"
                top="100px"
                p={6}
                borderWidth="1px"
                borderRadius="lg"
                borderColor={borderColor}
                boxShadow="lg"
                bg={cardBgColor}
              >
                <VStack spacing={6} align="stretch">
                  {/* Price */}
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="bold" fontSize="xl" color={textColor}>
                      {eventData?.isFree
                        ? "Free"
                        : `$${eventData?.price?.toFixed(2)}`}
                    </Text>
                    {isPastEvent && (
                      <Badge colorScheme="red" p={2} borderRadius="md">
                        Event Ended
                      </Badge>
                    )}
                  </Flex>

                  {/* Registration button */}
                  {!isPastEvent && (
                    <Button
                      colorScheme="teal"
                      size="lg"
                      width="100%"
                      onClick={
                        eventData?.isFree ? handleRegister : handleBuyTicket
                      }
                      isDisabled={isRegistered && eventData?.isFree}
                    >
                      {isRegistered && eventData?.isFree
                        ? "Already Registered"
                        : eventData?.isFree
                        ? "Register Now"
                        : "Buy Ticket"}
                    </Button>
                  )}

                  {/* Remaining tickets */}
                  {!eventData?.isFree && !isPastEvent && (
                    <Text
                      fontSize="sm"
                      color={secondaryTextColor}
                      textAlign="center"
                    >
                      Only {eventData?.availableTickets} tickets remaining!
                    </Text>
                  )}

                  {/* Event summary */}
                  <Box pt={6} borderTopWidth="1px" borderColor={borderColor}>
                    <VStack spacing={4} align="start">
                      <Heading size="sm" color={textColor}>
                        Event Summary
                      </Heading>

                      {!eventData?.isFree && (
                        <Flex justify="space-between" width="100%">
                          <Text color={secondaryTextColor}>
                            Price per ticket
                          </Text>
                          <Text fontWeight="bold" color={textColor}>
                            ${eventData?.price?.toFixed(2)}
                          </Text>
                        </Flex>
                      )}

                      <Flex justify="space-between" width="100%">
                        <Text color={secondaryTextColor}>Date</Text>
                        <Text fontWeight="medium" color={textColor}>
                          {new Date(
                            eventData?.startDate || ""
                          ).toLocaleDateString()}
                        </Text>
                      </Flex>

                      <Flex justify="space-between" width="100%">
                        <Text color={secondaryTextColor}>Time</Text>
                        <Text fontWeight="medium" color={textColor}>
                          {new Date(
                            eventData?.startDate || ""
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </Flex>

                      <Flex justify="space-between" width="100%">
                        <Text color={secondaryTextColor}>Location</Text>
                        <Text
                          fontWeight="medium"
                          color={textColor}
                          textAlign="right"
                        >
                          {eventData?.location}
                        </Text>
                      </Flex>
                    </VStack>
                  </Box>

                  {/* Organizer Info */}
                  <Box pt={6} borderTopWidth="1px" borderColor={borderColor}>
                    <VStack spacing={4} align="start">
                      <Heading size="sm" color={textColor}>
                        Event Organizer
                      </Heading>
                      <HStack spacing={3}>
                        <Avatar
                          size="md"
                          name={eventData?.organizer?.name}
                          src={eventData?.organizer?.image}
                        />
                        <Box>
                          <Text fontWeight="bold" color={textColor}>
                            {eventData?.organizer?.name}
                          </Text>
                          <Text fontSize="sm" color={secondaryTextColor}>
                            {eventData?.organizer?.events} events hosted
                          </Text>
                        </Box>
                      </HStack>
                      <Button
                        variant="outline"
                        leftIcon={<FiMail />}
                        size="sm"
                        width="100%"
                        borderColor={borderColor}
                        color={textColor}
                        _hover={{ bg: "teal.50", color: "teal.500" }}
                      >
                        Contact Organizer
                      </Button>
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </GridItem>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default EventDetail;
