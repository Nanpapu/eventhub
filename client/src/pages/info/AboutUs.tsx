import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
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
  Divider,
  useColorModeValue,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaLightbulb,
  FaUsers,
  FaCode,
  FaGraduationCap,
  FaEnvelope,
  FaArrowRight,
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
  // Colors cho dark/light mode - đồng bộ theo HelpCenter
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("teal.500", "teal.300");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const boxShadow = useColorModeValue("sm", "none");

  // Dữ liệu đội ngũ thành viên
  const teamMembers: TeamMemberProps[] = [
    {
      name: "Trần Phương Lâm",
      role: "Frontend Developer",
      image:
        "https://images.unsplash.com/photo-1589656966895-2f33e7653819?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Hình con mèo
      bio: "Sinh viên năm 4 chuyên ngành Kỹ thuật phần mềm tại UIT. Có kinh nghiệm phát triển giao diện người dùng với React và NextJS.",
    },
    {
      name: "Trần Trọng Nhân",
      role: "Backend Developer",
      image:
        "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Hình con chó
      bio: "Sinh viên năm 4 chuyên ngành Khoa học máy tính tại UIT. Chuyên về phát triển backend với Node.js và xây dựng APIs.",
    },
    {
      name: "Bùi Gia Huy",
      role: "Database Engineer",
      image:
        "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Hình con chim
      bio: "Sinh viên năm 4 chuyên ngành Hệ thống thông tin tại UIT. Có kiến thức sâu về thiết kế và quản lý cơ sở dữ liệu.",
    },
  ];

  // Dữ liệu giá trị cốt lõi
  const coreValues: CoreValue[] = [
    {
      title: "Đơn giản & Dễ sử dụng",
      description:
        "Chúng tôi tin rằng công nghệ phải đơn giản và trực quan. EventHub được thiết kế để mọi người đều có thể sử dụng dễ dàng, bất kể trình độ kỹ thuật.",
      icon: FaLightbulb,
    },
    {
      title: "Cộng đồng Vững mạnh",
      description:
        "Xây dựng cộng đồng là trọng tâm của những gì chúng tôi làm. Chúng tôi tạo điều kiện cho mọi người kết nối, học hỏi và phát triển cùng nhau.",
      icon: FaUsers,
    },
    {
      title: "Đổi mới Liên tục",
      description:
        "Chúng tôi luôn tìm kiếm những cách tốt hơn để cải thiện trải nghiệm người dùng và cung cấp các tính năng mới phù hợp với nhu cầu không ngừng thay đổi.",
      icon: FaCode,
    },
    {
      title: "Giáo dục & Hướng dẫn",
      description:
        "Chúng tôi tin vào việc trao quyền cho người tổ chức sự kiện thông qua giáo dục và hướng dẫn, cung cấp tài nguyên để họ tổ chức sự kiện thành công.",
      icon: FaGraduationCap,
    },
  ];

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
          <BreadcrumbLink>Về Chúng Tôi</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <Box mb={10} textAlign="center">
        <Heading as="h1" size="2xl" mb={4} color={headingColor}>
          Về Chúng Tôi
        </Heading>
        <Text fontSize="lg" maxW="2xl" mx="auto" color={textColor}>
          Khám phá câu chuyện, sứ mệnh và đội ngũ đằng sau EventHub
        </Text>
      </Box>

      {/* Giới thiệu */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mb={16}>
        <Box>
          <Heading as="h2" size="xl" mb={4} color={headingColor}>
            Câu chuyện của chúng tôi
          </Heading>
          <Text mb={4} color={textColor}>
            EventHub được thành lập với mục tiêu đơn giản hóa việc tổ chức và
            quản lý sự kiện cho mọi người. Xuất phát từ đồ án môn học của nhóm
            sinh viên UIT, chúng tôi nhận thấy rằng các nền tảng sự kiện hiện
            tại còn nhiều điểm hạn chế, đặc biệt là đối với người dùng Việt Nam.
          </Text>
          <Text mb={4} color={textColor}>
            Chúng tôi tin rằng công nghệ có thể mang mọi người lại gần nhau hơn,
            và sự kiện là một trong những cách tuyệt vời nhất để xây dựng cộng
            đồng. Với EventHub, chúng tôi muốn tạo ra một nền tảng nơi mọi người
            có thể dễ dàng tìm kiếm, tạo và tham gia các sự kiện.
          </Text>
          <List spacing={3} mt={6}>
            <ListItem>
              <ListIcon as={FaCheckCircle} color={accentColor} />
              Nền tảng quản lý sự kiện toàn diện
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color={accentColor} />
              Được phát triển bởi đội ngũ sinh viên UIT
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color={accentColor} />
              Thiết kế đáp ứng trên mọi thiết bị
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color={accentColor} />
              Tập trung vào trải nghiệm người dùng
            </ListItem>
          </List>
        </Box>
        <Box>
          <Image
            src="client/src/assets/EventHub_alt_logo.png"
            alt="Sự kiện EventHub"
            borderRadius="lg"
            shadow="lg"
            objectFit="cover"
            h="100%"
          />
        </Box>
      </SimpleGrid>

      {/* Giá trị cốt lõi */}
      <Box mb={16}>
        <Heading
          as="h2"
          size="xl"
          mb={8}
          textAlign="center"
          color={headingColor}
        >
          Giá trị cốt lõi của chúng tôi
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {coreValues.map((value, index) => (
            <Box
              key={index}
              p={6}
              bg={bgColor}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              boxShadow={boxShadow}
              transition="all 0.3s"
              _hover={{ shadow: "md" }}
            >
              <Icon as={value.icon} boxSize={10} color={accentColor} mb={4} />
              <Heading as="h3" size="md" mb={2}>
                {value.title}
              </Heading>
              <Text color={textColor}>{value.description}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Đội ngũ */}
      <Box mb={16}>
        <Heading
          as="h2"
          size="xl"
          mb={8}
          textAlign="center"
          color={headingColor}
        >
          Đội ngũ của chúng tôi
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {teamMembers.map((member, index) => (
            <Box
              key={index}
              p={6}
              bg={bgColor}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              boxShadow={boxShadow}
              transition="all 0.3s"
              _hover={{ shadow: "md" }}
            >
              <VStack spacing={4} align="center">
                <Image
                  src={member.image}
                  alt={member.name}
                  borderRadius="full"
                  boxSize="150px"
                  objectFit="cover"
                  border="4px solid"
                  borderColor={accentColor}
                />
                <VStack spacing={1}>
                  <Heading as="h3" size="md">
                    {member.name}
                  </Heading>
                  <Text fontWeight="bold" color={accentColor} fontSize="sm">
                    {member.role}
                  </Text>
                </VStack>
                <Text textAlign="center" color={textColor}>
                  {member.bio}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Sứ mệnh và Tầm nhìn */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mb={16}>
        <Box
          p={8}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow={boxShadow}
        >
          <Heading as="h3" size="lg" mb={4} color={headingColor}>
            Sứ mệnh
          </Heading>
          <Text color={textColor}>
            Sứ mệnh của chúng tôi là đơn giản hóa việc tổ chức và tham gia sự
            kiện, tạo điều kiện cho các cộng đồng phát triển và kết nối. Chúng
            tôi tin rằng công nghệ có thể phá vỡ rào cản và tạo ra những trải
            nghiệm đáng nhớ.
          </Text>
        </Box>
        <Box
          p={8}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow={boxShadow}
        >
          <Heading as="h3" size="lg" mb={4} color={headingColor}>
            Tầm nhìn
          </Heading>
          <Text color={textColor}>
            Chúng tôi hướng tới việc trở thành nền tảng quản lý sự kiện hàng đầu
            Việt Nam, nơi mọi người có thể dễ dàng tìm kiếm, tạo và tham gia các
            sự kiện phù hợp với sở thích và nhu cầu của họ. Chúng tôi mong muốn
            xây dựng một cộng đồng vững mạnh và kết nối.
          </Text>
        </Box>
      </SimpleGrid>

      {/* Call to Action */}
      <Box mt={16} p={8} bg={hoverBg} borderRadius="lg" textAlign="center">
        <Heading as="h3" size="lg" mb={4} color={headingColor}>
          Tham gia cùng chúng tôi
        </Heading>
        <Text mb={6} color={textColor} maxW="2xl" mx="auto">
          Bạn quan tâm đến việc tổ chức sự kiện hoặc muốn tìm hiểu thêm về
          EventHub? Hãy liên hệ với chúng tôi ngay hôm nay!
        </Text>
        <HStack spacing={4} justify="center">
          <Button
            as={Link}
            to="/contact"
            variant="outline"
            colorScheme="teal"
            size="lg"
            leftIcon={<Icon as={FaEnvelope} />}
          >
            Liên hệ
          </Button>
          <Button
            as={Link}
            to="/become-organizer"
            variant="outline"
            colorScheme="teal"
            size="lg"
            rightIcon={<Icon as={FaArrowRight} />}
          >
            Trở thành Nhà tổ chức
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

export default AboutUs;
