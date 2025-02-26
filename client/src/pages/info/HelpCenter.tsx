import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Flex,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Link as ChakraLink,
  Image,
  Tag,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaUserCircle,
  FaCalendarAlt,
  FaCreditCard,
  FaQuestionCircle,
  FaBook,
  FaVideo,
  FaComments,
  FaLightbulb,
  FaChevronRight,
  FaClipboardList,
  FaTools,
} from "react-icons/fa";
import { useState } from "react";
import { IconType } from "react-icons";

// Định nghĩa cấu trúc dữ liệu cho các chủ đề trợ giúp
interface HelpTopic {
  title: string;
  description: string;
  icon: IconType;
  articles: {
    title: string;
    description: string;
    link: string;
    isPopular?: boolean;
  }[];
}

// Định nghĩa cấu trúc dữ liệu cho các hướng dẫn
interface Guide {
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
}

const HelpCenter = () => {
  // Data cho các chủ đề trợ giúp
  const helpTopics: HelpTopic[] = [
    {
      title: "Getting Started",
      description: "Everything you need to begin with EventHub",
      icon: FaLightbulb,
      articles: [
        {
          title: "Creating your EventHub account",
          description: "Learn how to sign up and set up your profile",
          link: "/help/account-creation",
          isPopular: true,
        },
        {
          title: "Navigating the EventHub platform",
          description: "An overview of the main features and sections",
          link: "/help/platform-overview",
        },
        {
          title: "Finding events you'll love",
          description:
            "How to discover and filter events that match your interests",
          link: "/help/finding-events",
          isPopular: true,
        },
        {
          title: "Becoming an event organizer",
          description:
            "Steps to upgrade your account to create and manage events",
          link: "/help/become-organizer",
        },
      ],
    },
    {
      title: "Account Management",
      description: "Manage your profile, preferences and settings",
      icon: FaUserCircle,
      articles: [
        {
          title: "Updating your profile information",
          description: "How to edit your personal details and preferences",
          link: "/help/update-profile",
        },
        {
          title: "Password reset and account security",
          description: "Securing your account and recovering access",
          link: "/help/account-security",
          isPopular: true,
        },
        {
          title: "Notification settings",
          description: "Customize how and when you receive notifications",
          link: "/help/notification-settings",
        },
        {
          title: "Deleting your account",
          description: "How to permanently remove your EventHub account",
          link: "/help/delete-account",
        },
      ],
    },
    {
      title: "Attending Events",
      description: "Everything about registering and attending events",
      icon: FaCalendarAlt,
      articles: [
        {
          title: "Registering for an event",
          description: "Step-by-step guide to securing your spot at an event",
          link: "/help/event-registration",
          isPopular: true,
        },
        {
          title: "Managing your tickets",
          description: "How to view, download, and present your tickets",
          link: "/help/manage-tickets",
        },
        {
          title: "Canceling your registration",
          description:
            "How to cancel attendance and understand refund policies",
          link: "/help/cancel-registration",
          isPopular: true,
        },
        {
          title: "Adding events to your calendar",
          description: "Sync event details with your personal calendar",
          link: "/help/calendar-sync",
        },
      ],
    },
    {
      title: "Creating & Managing Events",
      description: "For organizers: creating and running successful events",
      icon: FaClipboardList,
      articles: [
        {
          title: "Creating your first event",
          description: "A complete walkthrough of the event creation process",
          link: "/help/create-event",
          isPopular: true,
        },
        {
          title: "Setting up ticket types and pricing",
          description: "Define different ticket options and pricing strategies",
          link: "/help/ticket-setup",
        },
        {
          title: "Managing attendee check-in",
          description: "Tools and tips for smooth check-in at your event",
          link: "/help/attendee-checkin",
        },
        {
          title: "Promoting your event",
          description: "Strategies to increase visibility and attendance",
          link: "/help/event-promotion",
          isPopular: true,
        },
      ],
    },
    {
      title: "Payments & Billing",
      description: "Information about payments, refunds and financial matters",
      icon: FaCreditCard,
      articles: [
        {
          title: "Payment methods accepted",
          description: "Overview of supported payment options",
          link: "/help/payment-methods",
        },
        {
          title: "Refund policies and process",
          description:
            "Understanding how refunds work for attendees and organizers",
          link: "/help/refunds",
          isPopular: true,
        },
        {
          title: "Organizer payouts",
          description: "How and when event organizers receive their funds",
          link: "/help/organizer-payouts",
          isPopular: true,
        },
        {
          title: "Understanding fees and charges",
          description: "Explanation of EventHub's fee structure",
          link: "/help/fee-structure",
        },
      ],
    },
    {
      title: "Troubleshooting",
      description: "Solutions for common issues and technical problems",
      icon: FaTools,
      articles: [
        {
          title: "Login problems",
          description: "Resolving issues with accessing your account",
          link: "/help/login-issues",
          isPopular: true,
        },
        {
          title: "Missing tickets or registrations",
          description:
            "What to do if your tickets don't appear in your account",
          link: "/help/missing-tickets",
        },
        {
          title: "Payment processing issues",
          description: "Troubleshooting failed payments and charges",
          link: "/help/payment-issues",
        },
        {
          title: "Mobile app troubleshooting",
          description: "Fixing common problems with the EventHub mobile app",
          link: "/help/app-troubleshooting",
        },
      ],
    },
  ];

  // Data cho hướng dẫn nổi bật
  const featuredGuides: Guide[] = [
    {
      title: "The Complete Guide to Hosting Virtual Events",
      description:
        "Learn how to plan, promote, and execute successful online events that engage your audience.",
      image:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      link: "/help/guides/virtual-events",
      tags: ["Organizer", "Virtual Events", "Beginner"],
    },
    {
      title: "Maximizing Event Attendance: Marketing Strategies",
      description:
        "Discover proven techniques to increase registrations and ensure a packed house at your next event.",
      image:
        "https://images.unsplash.com/photo-1540304453527-62f979142a17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      link: "/help/guides/marketing-strategies",
      tags: ["Organizer", "Marketing", "Intermediate"],
    },
    {
      title: "Event Photography Tips for Beginners",
      description:
        "Essential tips for capturing high-quality photos that showcase your event and attract future attendees.",
      image:
        "https://images.unsplash.com/photo-1551816230-ef5d99c0690c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
      link: "/help/guides/event-photography",
      tags: ["Organizer", "Photography", "Beginner"],
    },
  ];

  // State cho search
  const [searchQuery, setSearchQuery] = useState("");

  // Colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const secondaryBg = useColorModeValue("gray.50", "gray.700");
  const textColorSecondary = useColorModeValue("gray.600", "gray.400");
  const primaryColor = useColorModeValue("teal.600", "teal.300");

  // Màu sắc cho components bên trong map function
  const topicDescriptionColor = textColorSecondary;
  const hoverBgColor = secondaryBg;

  return (
    <Container maxW="6xl" py={12}>
      {/* Breadcrumb */}
      <Breadcrumb mb={8} color={useColorModeValue("gray.600", "gray.400")}>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Help Center</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Hero Section */}
      <Box
        py={10}
        px={8}
        borderRadius="lg"
        bg={secondaryBg}
        mb={12}
        textAlign="center"
      >
        <Heading
          as="h1"
          size="2xl"
          fontWeight="bold"
          color={primaryColor}
          mb={4}
        >
          How can we help you?
        </Heading>
        <Text
          fontSize="xl"
          color={useColorModeValue("gray.600", "gray.300")}
          maxW="3xl"
          mx="auto"
          mb={8}
        >
          Search our knowledge base or browse categories to find the answers you
          need
        </Text>

        {/* Search Bar */}
        <Box maxW="2xl" mx="auto">
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search for help articles..."
              bg={bgColor}
              borderColor={borderColor}
              _hover={{ borderColor: "teal.300" }}
              _focus={{
                borderColor: "teal.500",
                boxShadow: "0 0 0 1px teal.500",
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              ml={2}
              colorScheme="teal"
              size="lg"
              onClick={() => console.log("Search:", searchQuery)}
            >
              Search
            </Button>
          </InputGroup>
        </Box>
      </Box>

      {/* Popular Topics Section */}
      <Box mb={16}>
        <Heading as="h2" size="xl" mb={6} color={primaryColor}>
          Popular Topics
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {helpTopics.map((topic, index) => (
            <Box
              key={index}
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              borderColor={borderColor}
              bg={bgColor}
              _hover={{ boxShadow: "md", borderColor: "teal.300" }}
              transition="all 0.3s"
            >
              <Flex align="center" mb={4}>
                <Icon as={topic.icon} boxSize={8} color="teal.500" mr={3} />
                <Heading as="h3" size="md">
                  {topic.title}
                </Heading>
              </Flex>
              <Text color={topicDescriptionColor} mb={4}>
                {topic.description}
              </Text>
              <VStack align="stretch" spacing={3}>
                {topic.articles.slice(0, 3).map((article, artIndex) => (
                  <HStack
                    key={artIndex}
                    as={ChakraLink}
                    href={article.link}
                    align="center"
                    p={2}
                    borderRadius="md"
                    _hover={{ bg: hoverBgColor }}
                    transition="background 0.2s"
                  >
                    <Text flex="1" fontSize="sm" fontWeight="medium">
                      {article.title}
                      {article.isPopular && (
                        <Tag
                          size="sm"
                          colorScheme="teal"
                          ml={2}
                          verticalAlign="middle"
                        >
                          Popular
                        </Tag>
                      )}
                    </Text>
                    <Icon as={FaChevronRight} color="teal.500" boxSize={3} />
                  </HStack>
                ))}
                <ChakraLink
                  as={Link}
                  to={`/help/category/${topic.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  color="teal.500"
                  fontWeight="medium"
                  fontSize="sm"
                  alignSelf="flex-start"
                  mt={2}
                >
                  View all articles
                </ChakraLink>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Featured Guides */}
      <Box mb={16}>
        <Heading as="h2" size="xl" mb={6} color={primaryColor}>
          Featured Guides
        </Heading>
        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={8}>
          {featuredGuides.map((guide, index) => (
            <GridItem key={index}>
              <Box
                borderWidth="1px"
                borderRadius="lg"
                borderColor={borderColor}
                overflow="hidden"
                bg={bgColor}
                _hover={{ boxShadow: "lg" }}
                transition="all 0.3s"
                height="100%"
                display="flex"
                flexDirection="column"
              >
                <Image
                  src={guide.image}
                  alt={guide.title}
                  h="180px"
                  objectFit="cover"
                  w="100%"
                />
                <Box p={5} flex="1" display="flex" flexDirection="column">
                  <Flex mb={2} wrap="wrap" gap={2}>
                    {guide.tags.map((tag, tagIndex) => (
                      <Tag
                        key={tagIndex}
                        size="sm"
                        colorScheme="teal"
                        variant="subtle"
                      >
                        {tag}
                      </Tag>
                    ))}
                  </Flex>
                  <Heading as="h3" size="md" mb={2}>
                    {guide.title}
                  </Heading>
                  <Text color={textColorSecondary} mb={4} flex="1">
                    {guide.description}
                  </Text>
                  <Button
                    as={Link}
                    to={guide.link}
                    colorScheme="teal"
                    variant="outline"
                    size="sm"
                    alignSelf="flex-start"
                    rightIcon={<FaChevronRight />}
                  >
                    Read Guide
                  </Button>
                </Box>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Box>

      {/* Help Resources Section */}
      <Box mb={16}>
        <Heading as="h2" size="xl" mb={6} color={primaryColor}>
          More Ways to Get Help
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            borderColor={borderColor}
            bg={bgColor}
            textAlign="center"
            _hover={{ boxShadow: "md", borderColor: "teal.300" }}
            transition="all 0.3s"
          >
            <Icon as={FaBook} boxSize={10} color="teal.500" mb={4} />
            <Heading as="h3" size="md" mb={2}>
              Documentation
            </Heading>
            <Text color={useColorModeValue("gray.600", "gray.400")} mb={4}>
              Detailed guides and technical documentation for advanced users
            </Text>
            <Button
              as={Link}
              to="/help/documentation"
              colorScheme="teal"
              variant="outline"
              size="md"
            >
              Browse Docs
            </Button>
          </Box>

          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            borderColor={borderColor}
            bg={bgColor}
            textAlign="center"
            _hover={{ boxShadow: "md", borderColor: "teal.300" }}
            transition="all 0.3s"
          >
            <Icon as={FaVideo} boxSize={10} color="teal.500" mb={4} />
            <Heading as="h3" size="md" mb={2}>
              Video Tutorials
            </Heading>
            <Text color={useColorModeValue("gray.600", "gray.400")} mb={4}>
              Watch step-by-step tutorials to master EventHub features
            </Text>
            <Button
              as={Link}
              to="/help/videos"
              colorScheme="teal"
              variant="outline"
              size="md"
            >
              Watch Videos
            </Button>
          </Box>

          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            borderColor={borderColor}
            bg={bgColor}
            textAlign="center"
            _hover={{ boxShadow: "md", borderColor: "teal.300" }}
            transition="all 0.3s"
          >
            <Icon as={FaComments} boxSize={10} color="teal.500" mb={4} />
            <Heading as="h3" size="md" mb={2}>
              Community Forum
            </Heading>
            <Text color={useColorModeValue("gray.600", "gray.400")} mb={4}>
              Connect with other users to ask questions and share tips
            </Text>
            <Button
              as={Link}
              to="/community"
              colorScheme="teal"
              variant="outline"
              size="md"
            >
              Join Discussion
            </Button>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Contact Support Section */}
      <Box p={8} borderRadius="lg" bg={secondaryBg} textAlign="center">
        <Icon as={FaQuestionCircle} boxSize={12} color="teal.500" mb={4} />
        <Heading as="h2" size="lg" mb={4}>
          Can't find what you're looking for?
        </Heading>
        <Text
          color={useColorModeValue("gray.600", "gray.300")}
          maxW="2xl"
          mx="auto"
          mb={6}
          fontSize="lg"
        >
          Our support team is here to help. Contact us and we'll get back to you
          as soon as possible.
        </Text>
        <HStack spacing={4} justify="center">
          <Button as={Link} to="/contact" colorScheme="teal" size="lg">
            Contact Support
          </Button>
          <Button
            as="a"
            href="mailto:support@eventhub.com"
            colorScheme="teal"
            variant="outline"
            size="lg"
          >
            Email Us
          </Button>
        </HStack>
      </Box>
    </Container>
  );
};

export default HelpCenter;
