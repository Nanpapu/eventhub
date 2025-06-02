import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Divider,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Link as ChakraLink,
  Button,
  SimpleGrid,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaUserLock, FaInfoCircle } from "react-icons/fa";

// Định nghĩa component cho các section trong privacy policy
const PolicySection = ({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) => {
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const boxShadow = useColorModeValue("sm", "none");

  return (
    <Box
      as="section"
      id={id}
      mb={8}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      bg={bgColor}
      boxShadow={boxShadow}
      transition="all 0.3s"
      _hover={{ shadow: "md" }}
    >
      <Heading as="h2" size="lg" mb={4} color={headingColor}>
        {title}
      </Heading>
      <Box>{children}</Box>
    </Box>
  );
};

// Tinh gọn trang Privacy Policy
const PrivacyPolicy = () => {
  const textColor = useColorModeValue("gray.600", "gray.400");
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("teal.500", "teal.300");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const boxShadow = useColorModeValue("sm", "none");
  const lastUpdated = "20/05/2023";

  // Mục lục cho mobile
  const tableOfContents = [
    { id: "introduction", title: "Giới thiệu" },
    { id: "information-collected", title: "Thông tin chúng tôi thu thập" },
    { id: "information-use", title: "Cách chúng tôi sử dụng thông tin" },
    { id: "information-sharing", title: "Chia sẻ thông tin" },
    { id: "cookies", title: "Cookies và công nghệ tương tự" },
    { id: "data-security", title: "Bảo mật dữ liệu" },
    { id: "user-rights", title: "Quyền của người dùng" },
    { id: "children-privacy", title: "Quyền riêng tư của trẻ em" },
    { id: "policy-changes", title: "Thay đổi chính sách" },
    { id: "contact", title: "Liên hệ chúng tôi" },
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
          <BreadcrumbLink>Chính sách Riêng tư</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <Box mb={10} textAlign="center">
        <Heading as="h1" size="2xl" mb={4} color={headingColor}>
          Chính sách Riêng tư
        </Heading>
        <Text fontSize="lg" color={textColor} maxW="2xl" mx="auto">
          Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết bảo vệ dữ liệu
          cá nhân của bạn.
          <br />
          Cập nhật lần cuối: {lastUpdated}
        </Text>
      </Box>

      {/* Highlight Boxes */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={10}>
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow={boxShadow}
          textAlign="center"
        >
          <Flex justifyContent="center" mb={4}>
            <Icon as={FaShieldAlt} boxSize={10} color={accentColor} />
          </Flex>
          <Heading as="h3" size="md" mb={2} color={headingColor}>
            Bảo vệ dữ liệu
          </Heading>
          <Text color={textColor}>
            Chúng tôi sử dụng các biện pháp bảo mật mạnh mẽ để bảo vệ dữ liệu cá
            nhân của bạn.
          </Text>
        </Box>
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow={boxShadow}
          textAlign="center"
        >
          <Flex justifyContent="center" mb={4}>
            <Icon as={FaUserLock} boxSize={10} color={accentColor} />
          </Flex>
          <Heading as="h3" size="md" mb={2} color={headingColor}>
            Quyền kiểm soát
          </Heading>
          <Text color={textColor}>
            Bạn có quyền kiểm soát thông tin của mình và có thể truy cập, chỉnh
            sửa hoặc xóa dữ liệu bất cứ lúc nào.
          </Text>
        </Box>
        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow={boxShadow}
          textAlign="center"
        >
          <Flex justifyContent="center" mb={4}>
            <Icon as={FaInfoCircle} boxSize={10} color={accentColor} />
          </Flex>
          <Heading as="h3" size="md" mb={2} color={headingColor}>
            Minh bạch
          </Heading>
          <Text color={textColor}>
            Chúng tôi luôn minh bạch về cách thu thập, sử dụng và bảo vệ dữ liệu
            của bạn.
          </Text>
        </Box>
      </SimpleGrid>

      {/* Mobile Table of Contents */}
      <Box
        display={{ base: "block", lg: "none" }}
        mb={10}
        p={6}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Heading as="h2" size="md" mb={4}>
          Mục lục
        </Heading>
        <VStack align="stretch" spacing={2}>
          {tableOfContents.map((item) => (
            <ChakraLink
              key={item.id}
              as="a"
              href={`#${item.id}`}
              color={accentColor}
              _hover={{ textDecoration: "underline" }}
            >
              {item.title}
            </ChakraLink>
          ))}
        </VStack>
      </Box>

      {/* Content with sidebar on desktop */}
      <SimpleGrid columns={{ base: 1, lg: 4 }} spacing={10}>
        {/* Sidebar - Table of Contents (desktop only) */}
        <Box display={{ base: "none", lg: "block" }}>
          <Box
            position="sticky"
            top="100px"
            p={6}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Heading as="h2" size="md" mb={4}>
              Mục lục
            </Heading>
            <VStack align="stretch" spacing={2}>
              {tableOfContents.map((item) => (
                <ChakraLink
                  key={item.id}
                  as="a"
                  href={`#${item.id}`}
                  color={accentColor}
                  _hover={{ textDecoration: "underline" }}
                >
                  {item.title}
                </ChakraLink>
              ))}
            </VStack>
          </Box>
        </Box>

        {/* Main Content */}
        <Box gridColumn={{ lg: "span 3" }}>
          {/* Giới thiệu */}
          <PolicySection title="1. Giới thiệu" id="introduction">
            <Text mb={4}>
              Chào mừng đến với Chính sách Riêng tư của EventHub. Chúng tôi tôn
              trọng quyền riêng tư của bạn và cam kết bảo vệ thông tin cá nhân
              mà bạn chia sẻ với chúng tôi.
            </Text>
            <Text mb={4}>
              Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ
              thông tin cá nhân khi bạn sử dụng dịch vụ của chúng tôi. Bằng việc
              sử dụng EventHub, bạn đồng ý với các điều khoản được mô tả trong
              chính sách này.
            </Text>
          </PolicySection>

          {/* Thông tin chúng tôi thu thập */}
          <PolicySection
            title="2. Thông tin chúng tôi thu thập"
            id="information-collected"
          >
            <Text mb={4}>
              Chúng tôi thu thập các loại thông tin sau để cung cấp và cải thiện
              dịch vụ của mình:
            </Text>
            <UnorderedList spacing={3} mb={4} pl={4}>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Thông tin tài khoản:
                </Text>{" "}
                Tên, địa chỉ email, mật khẩu, và các thông tin liên hệ khi bạn
                đăng ký tài khoản trên EventHub.
              </ListItem>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Thông tin hồ sơ:
                </Text>{" "}
                Ảnh đại diện, giới thiệu cá nhân, sở thích, và các thông tin
                khác mà bạn chọn chia sẻ trong hồ sơ.
              </ListItem>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Thông tin sự kiện:
                </Text>{" "}
                Dữ liệu về các sự kiện bạn tạo, tham gia hoặc quan tâm.
              </ListItem>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Thông tin thanh toán:
                </Text>{" "}
                Chi tiết thanh toán khi bạn mua vé hoặc đăng ký sự kiện trả phí.
              </ListItem>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Dữ liệu sử dụng:
                </Text>{" "}
                Thông tin về cách bạn tương tác với trang web và dịch vụ của
                chúng tôi.
              </ListItem>
            </UnorderedList>
          </PolicySection>

          {/* Cách chúng tôi sử dụng thông tin */}
          <PolicySection
            title="3. Cách chúng tôi sử dụng thông tin"
            id="information-use"
          >
            <Text mb={4}>
              Chúng tôi sử dụng thông tin thu thập được cho các mục đích sau:
            </Text>
            <UnorderedList spacing={3} mb={4} pl={4}>
              <ListItem>
                Cung cấp, duy trì và cải thiện dịch vụ của chúng tôi
              </ListItem>
              <ListItem>Xử lý đăng ký sự kiện và giao dịch thanh toán</ListItem>
              <ListItem>Gửi thông báo và cập nhật về sự kiện</ListItem>
              <ListItem>Cá nhân hóa trải nghiệm người dùng</ListItem>
              <ListItem>Phát hiện và ngăn chặn gian lận, lạm dụng</ListItem>
              <ListItem>
                Phân tích xu hướng sử dụng và cải thiện nền tảng
              </ListItem>
            </UnorderedList>
          </PolicySection>

          {/* Chia sẻ thông tin */}
          <PolicySection title="4. Chia sẻ thông tin" id="information-sharing">
            <Text mb={4}>
              Chúng tôi có thể chia sẻ thông tin của bạn trong các trường hợp
              sau:
            </Text>
            <UnorderedList spacing={3} mb={4} pl={4}>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Với nhà tổ chức sự kiện:
                </Text>{" "}
                Khi bạn đăng ký tham gia sự kiện, thông tin của bạn sẽ được chia
                sẻ với nhà tổ chức để quản lý sự kiện.
              </ListItem>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Với nhà cung cấp dịch vụ:
                </Text>{" "}
                Chúng tôi làm việc với các công ty cung cấp dịch vụ như xử lý
                thanh toán, phân tích dữ liệu, và tiếp thị.
              </ListItem>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Theo yêu cầu pháp lý:
                </Text>{" "}
                Khi pháp luật yêu cầu hoặc để bảo vệ quyền và an toàn.
              </ListItem>
            </UnorderedList>
            <Text mb={4}>
              Chúng tôi không bán thông tin cá nhân của bạn cho bên thứ ba.
            </Text>
          </PolicySection>

          {/* Cookies */}
          <PolicySection title="5. Cookies và công nghệ tương tự" id="cookies">
            <Text mb={4}>
              Chúng tôi sử dụng cookies và các công nghệ tương tự để cải thiện
              trải nghiệm của bạn trên nền tảng. Cookies là các tệp nhỏ được lưu
              trữ trên thiết bị của bạn để ghi nhớ thông tin và cài đặt.
            </Text>
            <Text mb={4}>
              Bạn có thể cấu hình trình duyệt để từ chối tất cả hoặc một số
              cookies, nhưng điều này có thể ảnh hưởng đến chức năng của trang
              web.
            </Text>
          </PolicySection>

          {/* Bảo mật dữ liệu */}
          <PolicySection title="6. Bảo mật dữ liệu" id="data-security">
            <Text mb={4}>
              Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông
              tin cá nhân của bạn khỏi mất mát, truy cập trái phép, sử dụng sai
              mục đích, tiết lộ, thay đổi và phá hủy.
            </Text>
            <Text mb={4}>
              Tuy nhiên, không có phương thức truyền qua internet hoặc lưu trữ
              điện tử nào an toàn 100%. Do đó, chúng tôi không thể đảm bảo an
              ninh tuyệt đối.
            </Text>
          </PolicySection>

          {/* Quyền của người dùng */}
          <PolicySection title="7. Quyền của người dùng" id="user-rights">
            <Text mb={4}>
              Tùy thuộc vào khu vực của bạn, bạn có thể có các quyền sau liên
              quan đến dữ liệu cá nhân của mình:
            </Text>
            <UnorderedList spacing={3} mb={4} pl={4}>
              <ListItem>Quyền truy cập thông tin cá nhân của bạn</ListItem>
              <ListItem>
                Quyền yêu cầu sửa đổi thông tin không chính xác
              </ListItem>
              <ListItem>
                Quyền yêu cầu xóa dữ liệu cá nhân trong một số trường hợp
              </ListItem>
              <ListItem>
                Quyền hạn chế hoặc phản đối việc xử lý dữ liệu
              </ListItem>
              <ListItem>Quyền chuyển dữ liệu của bạn</ListItem>
              <ListItem>Quyền rút lại sự đồng ý</ListItem>
            </UnorderedList>
            <Text mb={4}>
              Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua
              thông tin ở phần "Liên hệ chúng tôi".
            </Text>
          </PolicySection>

          {/* Quyền riêng tư của trẻ em */}
          <PolicySection
            title="8. Quyền riêng tư của trẻ em"
            id="children-privacy"
          >
            <Text mb={4}>
              Dịch vụ của chúng tôi không dành cho người dưới 16 tuổi. Chúng tôi
              không cố ý thu thập thông tin cá nhân từ trẻ em dưới 16 tuổi.
            </Text>
            <Text mb={4}>
              Nếu bạn phát hiện ra rằng con bạn đã cung cấp thông tin cá nhân
              cho chúng tôi, vui lòng liên hệ với chúng tôi và chúng tôi sẽ thực
              hiện các bước để xóa thông tin đó.
            </Text>
          </PolicySection>

          {/* Thay đổi chính sách */}
          <PolicySection title="9. Thay đổi chính sách" id="policy-changes">
            <Text mb={4}>
              Chúng tôi có thể cập nhật Chính sách Riêng tư này theo thời gian
              để phản ánh những thay đổi trong hoạt động của chúng tôi hoặc vì
              các lý do pháp lý khác.
            </Text>
            <Text mb={4}>
              Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi quan trọng nào
              bằng cách đăng thông báo trên trang web của chúng tôi hoặc gửi
              email trực tiếp cho bạn.
            </Text>
          </PolicySection>

          {/* Liên hệ */}
          <PolicySection title="10. Liên hệ chúng tôi" id="contact">
            <Text mb={4}>
              Nếu bạn có bất kỳ câu hỏi, mối quan tâm hoặc yêu cầu nào liên quan
              đến Chính sách Riêng tư này hoặc cách chúng tôi xử lý dữ liệu cá
              nhân của bạn, vui lòng liên hệ với chúng tôi:
            </Text>
            <VStack align="start" spacing={2} mb={4}>
              <Text>Email: privacy@eventhub.example.com</Text>
              <Text>
                Địa chỉ: Khu phố 6, Phường Linh Trung, TP.Thủ Đức, TP.Hồ Chí
                Minh
              </Text>
              <Text>Điện thoại: +84 123 456 789</Text>
            </VStack>
            <Button
              as={Link}
              to="/contact"
              colorScheme="teal"
              variant="outline"
              size="lg"
              mt={4}
            >
              Liên hệ với chúng tôi
            </Button>
          </PolicySection>
        </Box>
      </SimpleGrid>

      {/* Footer note */}
      <Divider my={10} />
      <Text fontSize="sm" textAlign="center" color={textColor}>
        © {new Date().getFullYear()} EventHub. Đồ án môn IE213 - Kỹ thuật phát
        triển hệ thống web, UIT.
      </Text>
    </Container>
  );
};

export default PrivacyPolicy;
