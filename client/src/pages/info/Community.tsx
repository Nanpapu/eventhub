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
  Avatar,
  Badge,
  Tag,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaComment,
  FaHeart,
  FaEye,
  FaUser,
  FaUsers,
  FaCalendarAlt,
  FaCrown,
  FaMedal,
  FaRegCommentDots,
  FaHashtag,
  FaChevronRight,
  FaFire,
  FaLightbulb,
  FaQuestion,
  FaClipboardList,
  FaThumbsUp,
  FaShareAlt,
} from "react-icons/fa";
import { useState } from "react";
import { IconType } from "react-icons";

// Định nghĩa cấu trúc dữ liệu
interface CategoryData {
  id: string;
  name: string;
  description: string;
  icon: IconType;
  topics: number;
  posts: number;
  color: string;
}

interface DiscussionTopic {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  replies: number;
  views: number;
  likes: number;
  isHot?: boolean;
  isSticky?: boolean;
  lastActivity: string;
  tags?: string[];
}

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  posts: number;
  joined: string;
  badges?: string[];
  isContributor?: boolean;
}

const Community = () => {
  // State variables
  const [searchQuery, setSearchQuery] = useState("");

  // Categories data
  const categories: CategoryData[] = [
    {
      id: "general",
      name: "General Discussion",
      description: "Chat about anything related to events and EventHub",
      icon: FaRegCommentDots,
      topics: 124,
      posts: 1240,
      color: "blue",
    },
    {
      id: "tips",
      name: "Tips & Tricks",
      description: "Share your best practices and learn from others",
      icon: FaLightbulb,
      topics: 87,
      posts: 950,
      color: "yellow",
    },
    {
      id: "troubleshooting",
      name: "Troubleshooting",
      description: "Get help with technical issues and bugs",
      icon: FaQuestion,
      topics: 156,
      posts: 1890,
      color: "red",
    },
    {
      id: "event-planning",
      name: "Event Planning",
      description: "Discuss strategies and ideas for successful events",
      icon: FaCalendarAlt,
      topics: 103,
      posts: 1420,
      color: "green",
    },
    {
      id: "feature-requests",
      name: "Feature Requests",
      description: "Suggest new features for EventHub",
      icon: FaClipboardList,
      topics: 68,
      posts: 780,
      color: "purple",
    },
    {
      id: "introductions",
      name: "Introductions",
      description: "Introduce yourself to the community",
      icon: FaUser,
      topics: 210,
      posts: 980,
      color: "teal",
    },
  ];

  // Recent discussions data
  const discussions: DiscussionTopic[] = [
    {
      id: "1",
      title: "Tips for increasing attendee engagement at virtual events",
      category: "Tips & Tricks",
      categoryColor: "yellow.500",
      author: {
        name: "Sarah Johnson",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
        role: "Event Organizer",
      },
      replies: 28,
      views: 342,
      likes: 56,
      isHot: true,
      lastActivity: "2 hours ago",
      tags: ["virtual events", "engagement", "best practices"],
    },
    {
      id: "2",
      title: "How to set up custom registration forms?",
      category: "Troubleshooting",
      categoryColor: "red.500",
      author: {
        name: "Michael Chen",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
      },
      replies: 12,
      views: 187,
      likes: 8,
      lastActivity: "5 hours ago",
      tags: ["registration", "forms", "customization"],
    },
    {
      id: "3",
      title:
        "Announcement: April Community Challenge - Sustainability in Events",
      category: "General Discussion",
      categoryColor: "blue.500",
      author: {
        name: "EventHub Team",
        avatar: "/logo.png",
        role: "Admin",
      },
      replies: 45,
      views: 890,
      likes: 123,
      isSticky: true,
      lastActivity: "1 day ago",
      tags: ["announcement", "challenge", "sustainability"],
    },
    {
      id: "4",
      title: "Marketing strategies that worked for my conference",
      category: "Event Planning",
      categoryColor: "green.500",
      author: {
        name: "Alex Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
        role: "Verified Organizer",
      },
      replies: 34,
      views: 456,
      likes: 89,
      isHot: true,
      lastActivity: "2 days ago",
      tags: ["marketing", "conference", "success story"],
    },
    {
      id: "5",
      title: "Can we get a calendar view for the event dashboard?",
      category: "Feature Requests",
      categoryColor: "purple.500",
      author: {
        name: "Taylor Wong",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
      },
      replies: 18,
      views: 210,
      likes: 45,
      lastActivity: "3 days ago",
      tags: ["dashboard", "calendar", "ui improvement"],
    },
  ];

  // Top members data
  const topMembers: CommunityMember[] = [
    {
      id: "1",
      name: "Jessica Miller",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
      role: "Community Leader",
      posts: 487,
      joined: "Jan 2021",
      badges: ["Top Contributor", "Veteran", "Problem Solver"],
      isContributor: true,
    },
    {
      id: "2",
      name: "David Thompson",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
      role: "Event Expert",
      posts: 356,
      joined: "Mar 2021",
      badges: ["Event Pro", "Helpful", "Mentor"],
      isContributor: true,
    },
    {
      id: "3",
      name: "Sophia Lee",
      avatar:
        "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
      role: "Rising Star",
      posts: 215,
      joined: "Oct 2021",
      badges: ["Quick Responder", "Innovator"],
    },
    {
      id: "4",
      name: "Omar Patel",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
      role: "Tech Support",
      posts: 189,
      joined: "Apr 2021",
      badges: ["Problem Solver", "Tech Guru"],
      isContributor: true,
    },
  ];

  // Colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const secondaryBg = useColorModeValue("gray.50", "gray.700");
  const textColorSecondary = useColorModeValue("gray.600", "gray.400");

  return (
    <Container maxW="6xl" py={12}>
      {/* Breadcrumb */}
      <Breadcrumb mb={8} color={textColorSecondary}>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Community</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Hero Section */}
      <Box
        py={10}
        px={8}
        borderRadius="lg"
        bg={useColorModeValue("teal.50", "teal.900")}
        mb={12}
        textAlign="center"
      >
        <Heading
          as="h1"
          size="2xl"
          fontWeight="bold"
          color={useColorModeValue("teal.600", "teal.300")}
          mb={4}
        >
          EventHub Community
        </Heading>
        <Text
          fontSize="xl"
          color={textColorSecondary}
          maxW="3xl"
          mx="auto"
          mb={8}
        >
          Connect with fellow event enthusiasts, share knowledge, and get help
          from our community of creators and attendees
        </Text>

        {/* Quick Stats */}
        <SimpleGrid
          columns={{ base: 2, md: 4 }}
          spacing={6}
          mb={8}
          maxW="4xl"
          mx="auto"
        >
          <Stat
            textAlign="center"
            p={4}
            bg={bgColor}
            borderRadius="md"
            boxShadow="sm"
          >
            <StatLabel fontSize="sm" color={textColorSecondary}>
              Members
            </StatLabel>
            <StatNumber fontSize="2xl" fontWeight="bold" color="teal.500">
              10,240
            </StatNumber>
          </Stat>
          <Stat
            textAlign="center"
            p={4}
            bg={bgColor}
            borderRadius="md"
            boxShadow="sm"
          >
            <StatLabel fontSize="sm" color={textColorSecondary}>
              Discussions
            </StatLabel>
            <StatNumber fontSize="2xl" fontWeight="bold" color="teal.500">
              3,758
            </StatNumber>
          </Stat>
          <Stat
            textAlign="center"
            p={4}
            bg={bgColor}
            borderRadius="md"
            boxShadow="sm"
          >
            <StatLabel fontSize="sm" color={textColorSecondary}>
              Topics
            </StatLabel>
            <StatNumber fontSize="2xl" fontWeight="bold" color="teal.500">
              748
            </StatNumber>
          </Stat>
          <Stat
            textAlign="center"
            p={4}
            bg={bgColor}
            borderRadius="md"
            boxShadow="sm"
          >
            <StatLabel fontSize="sm" color={textColorSecondary}>
              Online Now
            </StatLabel>
            <StatNumber fontSize="2xl" fontWeight="bold" color="teal.500">
              234
            </StatNumber>
          </Stat>
        </SimpleGrid>

        {/* Search and New Topic Buttons */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={4}
          justify="center"
          maxW="3xl"
          mx="auto"
        >
          <InputGroup size="lg" flex="1">
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search discussions..."
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
          </InputGroup>
          <Button
            colorScheme="teal"
            size="lg"
            leftIcon={<FaComment />}
            minW={{ md: "170px" }}
          >
            New Discussion
          </Button>
        </Flex>
      </Box>

      {/* Main Content - Tabs */}
      <Tabs variant="enclosed" colorScheme="teal" mb={16}>
        <TabList mb={6}>
          <Tab fontWeight="medium">Categories</Tab>
          <Tab fontWeight="medium">Recent Discussions</Tab>
          <Tab fontWeight="medium">Top Members</Tab>
        </TabList>

        <TabPanels>
          {/* Categories Tab */}
          <TabPanel p={0}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {categories.map((category) => (
                <Box
                  key={category.id}
                  p={6}
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor={borderColor}
                  bg={bgColor}
                  _hover={{ boxShadow: "md", borderColor: "teal.300" }}
                  transition="all 0.3s"
                >
                  <Flex mb={4}>
                    <Box
                      p={3}
                      borderRadius="md"
                      bg={`${category.color}.50`}
                      color={`${category.color}.500`}
                      mr={4}
                    >
                      <Icon as={category.icon} boxSize={6} />
                    </Box>
                    <Box>
                      <Heading as="h3" size="md" mb={1}>
                        <ChakraLink
                          as={Link}
                          to={`/community/category/${category.id}`}
                          _hover={{ color: "teal.500", textDecoration: "none" }}
                        >
                          {category.name}
                        </ChakraLink>
                      </Heading>
                      <Text color={textColorSecondary} fontSize="sm">
                        {category.description}
                      </Text>
                    </Box>
                  </Flex>
                  <Flex
                    justify="space-between"
                    fontSize="sm"
                    color={textColorSecondary}
                  >
                    <Text>{category.topics} topics</Text>
                    <Text>{category.posts} posts</Text>
                  </Flex>
                </Box>
              ))}
            </SimpleGrid>
          </TabPanel>

          {/* Recent Discussions Tab */}
          <TabPanel p={0}>
            <VStack spacing={4} align="stretch">
              {discussions.map((topic) => (
                <Box
                  key={topic.id}
                  p={5}
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor={borderColor}
                  bg={bgColor}
                  _hover={{ boxShadow: "sm" }}
                  position="relative"
                >
                  {/* Badges */}
                  <Flex position="absolute" top={2} right={4} gap={2}>
                    {topic.isSticky && (
                      <Badge
                        colorScheme="purple"
                        variant="subtle"
                        px={2}
                        py={0.5}
                      >
                        <Flex align="center">
                          <Icon as={FaCrown} mr={1} boxSize={3} />
                          Pinned
                        </Flex>
                      </Badge>
                    )}
                    {topic.isHot && (
                      <Badge
                        colorScheme="orange"
                        variant="subtle"
                        px={2}
                        py={0.5}
                      >
                        <Flex align="center">
                          <Icon as={FaFire} mr={1} boxSize={3} />
                          Hot
                        </Flex>
                      </Badge>
                    )}
                  </Flex>

                  {/* Title and Category */}
                  <Box mb={4} pr={topic.isSticky || topic.isHot ? 24 : 0}>
                    <Heading as="h3" size="md" mb={2}>
                      <ChakraLink
                        as={Link}
                        to={`/community/discussion/${topic.id}`}
                        _hover={{ color: "teal.500", textDecoration: "none" }}
                      >
                        {topic.title}
                      </ChakraLink>
                    </Heading>
                    <Flex align="center" mb={2}>
                      <Badge
                        px={2}
                        py={0.5}
                        borderRadius="full"
                        colorScheme={
                          topic.category === "General Discussion"
                            ? "blue"
                            : topic.category === "Tips & Tricks"
                            ? "yellow"
                            : topic.category === "Troubleshooting"
                            ? "red"
                            : topic.category === "Event Planning"
                            ? "green"
                            : topic.category === "Feature Requests"
                            ? "purple"
                            : "teal"
                        }
                      >
                        {topic.category}
                      </Badge>
                      <Text fontSize="sm" color={textColorSecondary} ml={4}>
                        Last activity: {topic.lastActivity}
                      </Text>
                    </Flex>
                    <Flex wrap="wrap" gap={2}>
                      {topic.tags?.map((tag, index) => (
                        <Tag
                          key={index}
                          size="sm"
                          colorScheme="teal"
                          variant="subtle"
                        >
                          <Icon as={FaHashtag} boxSize={2.5} mr={1} />
                          {tag}
                        </Tag>
                      ))}
                    </Flex>
                  </Box>

                  {/* Author and Stats */}
                  <Flex
                    justify="space-between"
                    align="center"
                    wrap={{ base: "wrap", md: "nowrap" }}
                    gap={4}
                  >
                    <HStack>
                      <Avatar
                        size="sm"
                        src={topic.author.avatar}
                        name={topic.author.name}
                      />
                      <Box>
                        <Text fontWeight="medium" fontSize="sm">
                          {topic.author.name}
                        </Text>
                        {topic.author.role && (
                          <Badge size="sm" colorScheme="teal" variant="subtle">
                            {topic.author.role}
                          </Badge>
                        )}
                      </Box>
                    </HStack>

                    <HStack
                      spacing={6}
                      fontSize="sm"
                      color={textColorSecondary}
                    >
                      <HStack>
                        <Icon as={FaComment} />
                        <Text>{topic.replies}</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaEye} />
                        <Text>{topic.views}</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaHeart} />
                        <Text>{topic.likes}</Text>
                      </HStack>
                    </HStack>
                  </Flex>
                </Box>
              ))}

              {/* View More Button */}
              <Button
                alignSelf="center"
                mt={4}
                variant="outline"
                colorScheme="teal"
                rightIcon={<FaChevronRight />}
                as={Link}
                to="/community/discussions"
              >
                View More Discussions
              </Button>
            </VStack>
          </TabPanel>

          {/* Top Members Tab */}
          <TabPanel p={0}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {topMembers.map((member) => (
                <Box
                  key={member.id}
                  p={5}
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor={borderColor}
                  bg={bgColor}
                  _hover={{ boxShadow: "md" }}
                  textAlign="center"
                >
                  <Box position="relative" mb={4} display="inline-block">
                    <Avatar size="xl" src={member.avatar} name={member.name} />
                    {member.isContributor && (
                      <Box
                        position="absolute"
                        bottom={0}
                        right={0}
                        bg="teal.500"
                        color="white"
                        borderRadius="full"
                        boxSize={6}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        border="2px solid white"
                      >
                        <Icon as={FaMedal} boxSize={3} />
                      </Box>
                    )}
                  </Box>

                  <Heading as="h3" size="md" mb={1}>
                    {member.name}
                  </Heading>
                  <Badge colorScheme="teal" mb={3}>
                    {member.role}
                  </Badge>

                  <HStack
                    justify="center"
                    mb={4}
                    spacing={4}
                    fontSize="sm"
                    color={textColorSecondary}
                  >
                    <VStack spacing={0}>
                      <Text fontWeight="bold">{member.posts}</Text>
                      <Text>Posts</Text>
                    </VStack>
                    <VStack spacing={0}>
                      <Text fontWeight="bold">{member.joined}</Text>
                      <Text>Joined</Text>
                    </VStack>
                  </HStack>

                  {member.badges && (
                    <Flex justify="center" wrap="wrap" gap={2}>
                      {member.badges.map((badge, index) => (
                        <Badge key={index} colorScheme="blue" variant="subtle">
                          {badge}
                        </Badge>
                      ))}
                    </Flex>
                  )}
                </Box>
              ))}
            </SimpleGrid>

            {/* View All Members Button */}
            <Button
              mt={8}
              mx="auto"
              display="block"
              variant="outline"
              colorScheme="teal"
              rightIcon={<FaChevronRight />}
              as={Link}
              to="/community/members"
            >
              View All Members
            </Button>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Community Guidelines */}
      <Box p={8} borderRadius="lg" bg={secondaryBg} mb={10}>
        <Heading as="h2" size="lg" mb={4} color="teal.500">
          Community Guidelines
        </Heading>
        <Text mb={4}>
          Our community thrives when everyone participates with respect and
          consideration for others. Please follow these guidelines:
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <HStack align="flex-start" spacing={3}>
            <Icon as={FaUsers} color="teal.500" mt={1} />
            <Text>
              Be respectful and inclusive of all community members regardless of
              background.
            </Text>
          </HStack>
          <HStack align="flex-start" spacing={3}>
            <Icon as={FaThumbsUp} color="teal.500" mt={1} />
            <Text>Share constructive feedback and helpful information.</Text>
          </HStack>
          <HStack align="flex-start" spacing={3}>
            <Icon as={FaShareAlt} color="teal.500" mt={1} />
            <Text>
              Share your knowledge and experiences to help others succeed.
            </Text>
          </HStack>
          <HStack align="flex-start" spacing={3}>
            <Icon as={FaRegCommentDots} color="teal.500" mt={1} />
            <Text>
              Stay on topic and use appropriate categories for your discussions.
            </Text>
          </HStack>
        </SimpleGrid>
        <Button
          as={Link}
          to="/community/guidelines"
          variant="link"
          colorScheme="teal"
          mt={4}
          rightIcon={<FaChevronRight />}
        >
          Read the full Community Guidelines
        </Button>
      </Box>

      {/* Join the Community CTA */}
      <Box
        p={8}
        borderRadius="lg"
        bg={useColorModeValue("teal.50", "teal.900")}
        textAlign="center"
      >
        <Heading as="h2" size="xl" mb={4} color="teal.500">
          Join Our Growing Community
        </Heading>
        <Text
          fontSize="lg"
          color={textColorSecondary}
          maxW="2xl"
          mx="auto"
          mb={6}
        >
          Connect with thousands of event professionals and enthusiasts. Share
          your expertise, learn from others, and help build the future of events
          together.
        </Text>
        <Button as={Link} to="/register" colorScheme="teal" size="lg" mb={4}>
          Sign Up Now
        </Button>
        <Text fontSize="sm" color={textColorSecondary}>
          Already have an account?{" "}
          <ChakraLink as={Link} to="/login" color="teal.500">
            Log in
          </ChakraLink>
        </Text>
      </Box>
    </Container>
  );
};

export default Community;
