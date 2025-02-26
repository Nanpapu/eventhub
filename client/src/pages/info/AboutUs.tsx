import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
  Button,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Image,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaLightbulb,
  FaUsers,
  FaCode,
  FaGraduationCap,
} from "react-icons/fa";
import { IconType } from "react-icons";

// Định nghĩa cấu trúc dữ liệu thành viên trong team
interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
}

// Định nghĩa cấu trúc dữ liệu giá trị
interface CoreValue {
  title: string;
  description: string;
  icon: IconType;
}

const AboutUs = () => {
  // Dữ liệu đội ngũ thành viên
  const teamMembers: TeamMemberProps[] = [
    {
      name: "Nguyễn Văn A",
      role: "Frontend Developer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3",
      bio: "Sinh viên năm 4 ngành Kỹ thuật Phần mềm, UIT. Chịu trách nhiệm phát triển giao diện người dùng của EventHub.",
    },
    {
      name: "Trần Thị B",
      role: "Backend Developer",
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3",
      bio: "Sinh viên năm 4 ngành Khoa học Máy tính, UIT. Phát triển API và xử lý cơ sở dữ liệu cho EventHub.",
    },
    {
      name: "Lê Văn C",
      role: "UI/UX Designer",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3",
      bio: "Sinh viên năm 4 ngành Kỹ thuật Phần mềm, UIT. Thiết kế giao diện và trải nghiệm người dùng cho EventHub.",
    },
  ];

  // Dữ liệu giá trị cốt lõi
  const coreValues: CoreValue[] = [
    {
      title: "Tập trung vào người dùng",
      description:
        "Chúng tôi đặt trải nghiệm người dùng lên hàng đầu trong mọi quyết định thiết kế và phát triển.",
      icon: FaUsers,
    },
    {
      title: "Đổi mới liên tục",
      description:
        "Không ngừng học hỏi và ứng dụng công nghệ mới để tạo ra sản phẩm tốt hơn.",
      icon: FaLightbulb,
    },
    {
      title: "Chất lượng code",
      description:
        "Cam kết phát triển code sạch, dễ bảo trì và tuân thủ các tiêu chuẩn phát triển phần mềm.",
      icon: FaCode,
    },
  ];

  return (
    <Container maxW="container.lg" py={8}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb mb={6} fontSize="sm">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>About Us</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Hero Section */}
      <Box mb={12} textAlign="center">
        <Heading as="h1" size="xl" mb={4}>
          About EventHub
        </Heading>
        <Text fontSize="lg" maxW="2xl" mx="auto" mb={6}>
          EventHub là dự án của sinh viên UIT, được phát triển như một phần của
          khóa học IE213 - Kỹ thuật Phát triển Hệ thống Web.
        </Text>
      </Box>

      {/* Mission Section */}
      <Box mb={16} textAlign="center">
        <Heading as="h2" size="lg" mb={6}>
          Mục tiêu của chúng tôi
        </Heading>
        <Text fontSize="lg" maxW="2xl" mx="auto">
          Tạo ra một nền tảng đơn giản và tiện lợi để giúp người dùng khám phá,
          tham gia và tổ chức các sự kiện. EventHub kết nối mọi người thông qua
          các sự kiện có ý nghĩa, từ hội thảo học thuật đến các buổi gặp mặt
          cộng đồng.
        </Text>
      </Box>

      {/* Core Values Section */}
      <Box mb={16}>
        <Heading as="h2" size="lg" mb={8} textAlign="center">
          Giá trị cốt lõi
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {coreValues.map((value, index) => (
            <VStack
              key={index}
              align="flex-start"
              p={6}
              bg="white"
              boxShadow="md"
              borderRadius="lg"
            >
              <Flex
                w={12}
                h={12}
                align="center"
                justify="center"
                color="white"
                rounded="full"
                bg="teal.500"
                mb={4}
              >
                <Icon as={value.icon} boxSize={6} />
              </Flex>
              <Heading as="h3" size="md" mb={2}>
                {value.title}
              </Heading>
              <Text>{value.description}</Text>
            </VStack>
          ))}
        </SimpleGrid>
      </Box>

      {/* Technologies Used */}
      <Box mb={16}>
        <Heading as="h2" size="lg" mb={8} textAlign="center">
          Công nghệ sử dụng
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box p={6} bg="white" boxShadow="md" borderRadius="lg">
            <Heading as="h3" size="md" mb={4}>
              Frontend
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                React & Next.js
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                TypeScript
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                Chakra UI
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                React Router
              </ListItem>
            </List>
          </Box>
          <Box p={6} bg="white" boxShadow="md" borderRadius="lg">
            <Heading as="h3" size="md" mb={4}>
              Backend
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                Node.js & Express
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                MongoDB
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                JWT Authentication
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="teal.500" />
                RESTful API
              </ListItem>
            </List>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Team Section */}
      <Box mb={16}>
        <Heading as="h2" size="lg" mb={8} textAlign="center">
          Đội ngũ phát triển
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {teamMembers.map((member, index) => (
            <Box
              key={index}
              textAlign="center"
              p={6}
              bg="white"
              boxShadow="md"
              borderRadius="lg"
            >
              <Image
                borderRadius="full"
                boxSize="150px"
                src={member.image}
                alt={member.name}
                mx="auto"
                mb={4}
              />
              <Heading as="h3" size="md" mb={1}>
                {member.name}
              </Heading>
              <Text color="teal.500" mb={3}>
                {member.role}
              </Text>
              <Text fontSize="sm">{member.bio}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Project Info */}
      <Box mb={16} textAlign="center" p={6} bg="gray.50" borderRadius="lg">
        <Flex justifyContent="center" mb={4}>
          <Icon as={FaGraduationCap} boxSize={10} color="teal.500" />
        </Flex>
        <Heading as="h2" size="lg" mb={4}>
          Thông tin dự án
        </Heading>
        <Text mb={2}>
          <strong>Môn học:</strong> IE213 - Kỹ thuật Phát triển Hệ thống Web
        </Text>
        <Text mb={2}>
          <strong>Giảng viên hướng dẫn:</strong> ThS. Nguyễn Văn X
        </Text>
        <Text mb={2}>
          <strong>Trường:</strong> Đại học Công nghệ Thông tin - ĐHQG TP.HCM
          (UIT)
        </Text>
        <Text>
          <strong>Học kỳ:</strong> HK2 năm học 2023-2024
        </Text>
      </Box>

      {/* Contact Section */}
      <Box textAlign="center">
        <Heading as="h2" size="lg" mb={6}>
          Liên hệ
        </Heading>
        <Text fontSize="lg" mb={6}>
          Có câu hỏi hoặc đề xuất? Chúng tôi rất mong nhận được phản hồi của
          bạn!
        </Text>
        <Button as={Link} to="/contact" colorScheme="teal" size="lg">
          Liên hệ với chúng tôi
        </Button>
      </Box>
    </Container>
  );
};

export default AboutUs;
