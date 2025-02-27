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
  Divider,
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
} from "react-icons/fa";
import { IconType } from "react-icons";
import { useState } from "react";

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

  // Các màu sắc đồng bộ với HelpCenter
  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const accentColor = useColorModeValue("teal.500", "teal.300");
  const boxShadow = useColorModeValue("sm", "none");

  return (
    <Container maxW="6xl" py={10}>
      {/* Breadcrumb */}
      <Breadcrumb mb={8} fontSize="sm" separator="/">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Cộng đồng</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <Box mb={10} textAlign="center">
        <Heading as="h1" size="2xl" mb={4} color={headingColor}>
          Cộng đồng EventHub
        </Heading>
        <Text fontSize="lg" color={textColor} maxW="2xl" mx="auto">
          Tham gia cộng đồng EventHub để kết nối với những người đam mê sự kiện,
          chia sẻ ý tưởng và học hỏi từ những người tổ chức sự kiện chuyên
          nghiệp.
        </Text>
      </Box>

      {/* Tìm kiếm */}
      <Box
        mb={10}
        p={6}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow={boxShadow}
      >
        <VStack spacing={4}>
          <Text fontSize="lg" fontWeight="bold">
            Tìm kiếm trong cộng đồng
          </Text>
          <InputGroup size="lg" maxW="container.md" mx="auto">
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Tìm kiếm chủ đề, câu hỏi, hoặc thành viên..."
              borderRadius="full"
              focusBorderColor={accentColor}
            />
            <Button ml={2} borderRadius="full" colorScheme="teal" px={8}>
              Tìm kiếm
            </Button>
          </InputGroup>
        </VStack>
      </Box>

      {/* Stats */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={10}>
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow={boxShadow}
          textAlign="center"
          transition="all 0.3s"
          _hover={{ shadow: "md" }}
        >
          <Icon as={FaUsers} fontSize="3xl" color={accentColor} mb={3} />
          <Stat>
            <StatLabel fontSize="md" color={textColor}>
              Thành viên
            </StatLabel>
            <StatNumber color={headingColor}>5,280</StatNumber>
          </Stat>
        </Box>
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow={boxShadow}
          textAlign="center"
          transition="all 0.3s"
          _hover={{ shadow: "md" }}
        >
          <Icon
            as={FaClipboardList}
            fontSize="3xl"
            color={accentColor}
            mb={3}
          />
          <Stat>
            <StatLabel fontSize="md" color={textColor}>
              Chủ đề
            </StatLabel>
            <StatNumber color={headingColor}>1,423</StatNumber>
          </Stat>
        </Box>
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow={boxShadow}
          textAlign="center"
          transition="all 0.3s"
          _hover={{ shadow: "md" }}
        >
          <Icon
            as={FaRegCommentDots}
            fontSize="3xl"
            color={accentColor}
            mb={3}
          />
          <Stat>
            <StatLabel fontSize="md" color={textColor}>
              Bài viết
            </StatLabel>
            <StatNumber color={headingColor}>8,719</StatNumber>
          </Stat>
        </Box>
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow={boxShadow}
          textAlign="center"
          transition="all 0.3s"
          _hover={{ shadow: "md" }}
        >
          <Icon as={FaCalendarAlt} fontSize="3xl" color={accentColor} mb={3} />
          <Stat>
            <StatLabel fontSize="md" color={textColor}>
              Sự kiện được chia sẻ
            </StatLabel>
            <StatNumber color={headingColor}>924</StatNumber>
          </Stat>
        </Box>
      </SimpleGrid>

      {/* Tabs */}
      <Box
        mb={10}
        p={6}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow={boxShadow}
      >
        <Tabs colorScheme="teal" isLazy>
          <TabList mb={6}>
            <Tab fontWeight="semibold">Danh mục</Tab>
            <Tab fontWeight="semibold">Chủ đề gần đây</Tab>
            <Tab fontWeight="semibold">Thành viên tích cực</Tab>
          </TabList>

          <TabPanels>
            {/* Danh mục Tab */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {categories.map((category) => (
                  <Box
                    key={category.id}
                    p={6}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={borderColor}
                    bg={bgColor}
                    transition="all 0.3s"
                    _hover={{ shadow: "md", borderColor: accentColor }}
                  >
                    <HStack spacing={4} mb={3}>
                      <Flex
                        p={3}
                        bg={`${category.color}.100`}
                        color={`${category.color}.500`}
                        borderRadius="full"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={category.icon} fontSize="xl" />
                      </Flex>
                      <VStack align="start" spacing={0}>
                        <ChakraLink
                          fontSize="lg"
                          fontWeight="bold"
                          _hover={{ color: accentColor }}
                        >
                          {category.name}
                        </ChakraLink>
                        <HStack spacing={4} color={textColor} fontSize="sm">
                          <Text>{category.topics} chủ đề</Text>
                          <Text>{category.posts} bài viết</Text>
                        </HStack>
                      </VStack>
                    </HStack>
                    <Text color={textColor}>{category.description}</Text>
                  </Box>
                ))}
              </SimpleGrid>
            </TabPanel>

            {/* Chủ đề gần đây Tab */}
            <TabPanel px={0}>
              <VStack spacing={4} align="stretch">
                {discussions.map((topic) => (
                  <Box
                    key={topic.id}
                    p={4}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={borderColor}
                    bg={bgColor}
                    transition="all 0.3s"
                    _hover={{ shadow: "md", borderColor: accentColor }}
                  >
                    <Flex justify="space-between" align="start">
                      <HStack spacing={4} flex="1">
                        <Avatar size="md" src={topic.author.avatar} />
                        <VStack align="start" spacing={1}>
                          <HStack>
                            <ChakraLink
                              fontWeight="bold"
                              fontSize="md"
                              _hover={{ color: accentColor }}
                            >
                              {topic.title}
                            </ChakraLink>
                            {topic.isHot && (
                              <Tag size="sm" colorScheme="red" variant="solid">
                                Hot
                              </Tag>
                            )}
                            {topic.isSticky && (
                              <Tag size="sm" colorScheme="blue" variant="solid">
                                Ghim
                              </Tag>
                            )}
                          </HStack>
                          <HStack spacing={2} fontSize="sm" color={textColor}>
                            <Text>
                              bởi{" "}
                              <ChakraLink color={accentColor}>
                                {topic.author.name}
                              </ChakraLink>
                            </Text>
                            <Badge colorScheme={topic.categoryColor}>
                              {topic.category}
                            </Badge>
                            {topic.tags &&
                              topic.tags.map((tag, index) => (
                                <Tag key={index} size="sm" variant="subtle">
                                  {tag}
                                </Tag>
                              ))}
                          </HStack>
                        </VStack>
                      </HStack>
                      <VStack
                        align="end"
                        spacing={1}
                        fontSize="sm"
                        color={textColor}
                      >
                        <Text>{topic.lastActivity}</Text>
                        <HStack spacing={3}>
                          <HStack spacing={1}>
                            <Icon as={FaComment} />
                            <Text>{topic.replies}</Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Icon as={FaEye} />
                            <Text>{topic.views}</Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Icon as={FaHeart} />
                            <Text>{topic.likes}</Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    </Flex>
                  </Box>
                ))}
                <Button
                  colorScheme="teal"
                  variant="outline"
                  size="lg"
                  width="100%"
                >
                  Xem tất cả chủ đề
                </Button>
              </VStack>
            </TabPanel>

            {/* Thành viên tích cực Tab */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                {topMembers.map((member) => (
                  <Box
                    key={member.id}
                    p={6}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={borderColor}
                    bg={bgColor}
                    textAlign="center"
                    transition="all 0.3s"
                    _hover={{ shadow: "md", borderColor: accentColor }}
                  >
                    <Avatar size="xl" src={member.avatar} mb={4} />
                    <Heading size="md" mb={1}>
                      {member.name}
                    </Heading>
                    <Badge
                      colorScheme={member.isContributor ? "purple" : "gray"}
                      mb={3}
                    >
                      {member.role}
                    </Badge>
                    <HStack justify="center" spacing={4} mb={3}>
                      <VStack spacing={0}>
                        <Text fontWeight="bold">{member.posts}</Text>
                        <Text fontSize="sm" color={textColor}>
                          Bài viết
                        </Text>
                      </VStack>
                      <VStack spacing={0}>
                        <Text fontWeight="bold">{member.joined}</Text>
                        <Text fontSize="sm" color={textColor}>
                          Tham gia
                        </Text>
                      </VStack>
                    </HStack>
                    {member.badges && (
                      <HStack justify="center" spacing={2}>
                        {member.badges.map((badge, index) => (
                          <Tag key={index} colorScheme="teal" size="sm">
                            {badge}
                          </Tag>
                        ))}
                      </HStack>
                    )}
                  </Box>
                ))}
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Tham gia */}
      <Box
        mt={16}
        p={8}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow={boxShadow}
        textAlign="center"
      >
        <Heading as="h2" size="lg" mb={4} color={headingColor}>
          Tham gia cộng đồng
        </Heading>
        <Text maxW="2xl" mx="auto" mb={6} color={textColor}>
          Kết nối với những người có cùng đam mê sự kiện, chia sẻ ý tưởng, đặt
          câu hỏi và khám phá thêm về cách tổ chức những sự kiện tuyệt vời.
        </Text>
        <HStack spacing={4} justify="center">
          <Button colorScheme="teal" size="lg">
            Đăng ký ngay
          </Button>
          <Button variant="outline" colorScheme="teal" size="lg">
            Tìm hiểu thêm
          </Button>
        </HStack>
      </Box>

      {/* Footer note */}
      <Divider my={10} />
      <Text fontSize="sm" textAlign="center" color={textColor}>
        © {new Date().getFullYear()} EventHub. Đồ án môn IE213 - Kỹ thuật phát
        triển hệ thống web, UIT.
      </Text>
    </Container>
  );
};

export default Community;
