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
  Button,
  Link as ChakraLink,
  Alert,
  AlertIcon,
  SimpleGrid,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaBalanceScale, FaFileContract, FaShieldAlt } from "react-icons/fa";

// Định nghĩa component cho các section trong terms of service
const TermsSection = ({
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

const TermsOfService = () => {
  const textColor = useColorModeValue("gray.600", "gray.400");
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("teal.500", "teal.300");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const boxShadow = useColorModeValue("sm", "none");
  const lastUpdated = "15/05/2023";

  // Mục lục cho mobile và desktop
  const tableOfContents = [
    { id: "introduction", title: "Giới thiệu" },
    { id: "account", title: "Tài khoản" },
    { id: "event-policies", title: "Chính sách sự kiện" },
    { id: "payments", title: "Thanh toán" },
    { id: "user-conduct", title: "Quy tắc ứng xử" },
    { id: "intellectual-property", title: "Sở hữu trí tuệ" },
    { id: "disclaimers", title: "Tuyên bố miễn trừ trách nhiệm" },
    { id: "limitation-liability", title: "Giới hạn trách nhiệm" },
    { id: "term-termination", title: "Thời hạn và chấm dứt" },
    { id: "changes-terms", title: "Thay đổi điều khoản" },
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
          <BreadcrumbLink>Điều khoản Dịch vụ</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <Box mb={10} textAlign="center">
        <Heading as="h1" size="2xl" mb={4} color={headingColor}>
          Điều khoản Dịch vụ
        </Heading>
        <Text fontSize="lg" color={textColor} maxW="2xl" mx="auto">
          Vui lòng đọc kỹ những điều khoản này trước khi sử dụng dịch vụ của
          chúng tôi.
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
            <Icon as={FaBalanceScale} boxSize={10} color={accentColor} />
          </Flex>
          <Heading as="h3" size="md" mb={2} color={headingColor}>
            Quyền & Trách nhiệm
          </Heading>
          <Text color={textColor}>
            Hiểu rõ quyền lợi và trách nhiệm của bạn khi sử dụng nền tảng của
            chúng tôi.
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
            <Icon as={FaFileContract} boxSize={10} color={accentColor} />
          </Flex>
          <Heading as="h3" size="md" mb={2} color={headingColor}>
            Điều khoản thanh toán
          </Heading>
          <Text color={textColor}>
            Thông tin về các giao dịch, hoàn tiền và chính sách thanh toán.
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
            <Icon as={FaShieldAlt} boxSize={10} color={accentColor} />
          </Flex>
          <Heading as="h3" size="md" mb={2} color={headingColor}>
            Bảo vệ người dùng
          </Heading>
          <Text color={textColor}>
            Chúng tôi cam kết bảo vệ quyền lợi và dữ liệu cá nhân của người
            dùng.
          </Text>
        </Box>
      </SimpleGrid>

      {/* Alert - Lưu ý quan trọng */}
      <Alert
        status="info"
        mb={10}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <AlertIcon />
        <Text>
          Bằng việc truy cập hoặc sử dụng nền tảng EventHub, bạn đồng ý chịu
          ràng buộc bởi những Điều khoản Dịch vụ này. Nếu bạn không đồng ý với
          bất kỳ phần nào của các điều khoản, bạn không nên sử dụng dịch vụ của
          chúng tôi.
        </Text>
      </Alert>

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
          <TermsSection title="1. Giới thiệu" id="introduction">
            <Text mb={4}>
              Chào mừng bạn đến với EventHub - nền tảng kết nối và quản lý sự
              kiện trực tuyến. Những điều khoản này thiết lập các quy tắc sử
              dụng nền tảng của chúng tôi.
            </Text>
            <Text mb={4}>
              Bằng việc truy cập vào trang web của chúng tôi và/hoặc sử dụng
              dịch vụ của chúng tôi, bạn đồng ý tuân thủ và bị ràng buộc bởi
              những điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ
              phần nào của các điều khoản, bạn không được phép sử dụng dịch vụ.
            </Text>
          </TermsSection>

          {/* Tài khoản */}
          <TermsSection title="2. Tài khoản" id="account">
            <Text mb={4}>
              Để sử dụng đầy đủ các tính năng của nền tảng, bạn cần tạo một tài
              khoản. Khi tạo tài khoản, bạn phải cung cấp thông tin chính xác và
              cập nhật.
            </Text>
            <UnorderedList spacing={3} mb={4} pl={4}>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Điều kiện:
                </Text>{" "}
                Bạn phải từ 16 tuổi trở lên để tạo tài khoản. Nếu bạn dưới 18
                tuổi, bạn cần có sự đồng ý của cha mẹ hoặc người giám hộ.
              </ListItem>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Bảo mật:
                </Text>{" "}
                Bạn chịu trách nhiệm duy trì tính bảo mật của tài khoản và mật
                khẩu của mình. Thông báo cho chúng tôi ngay lập tức nếu phát
                hiện bất kỳ hành vi trái phép nào.
              </ListItem>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Trách nhiệm:
                </Text>{" "}
                Bạn chịu trách nhiệm cho tất cả các hoạt động diễn ra dưới tài
                khoản của mình, dù là do bạn thực hiện hay không.
              </ListItem>
            </UnorderedList>
          </TermsSection>

          {/* Chính sách sự kiện */}
          <TermsSection title="3. Chính sách sự kiện" id="event-policies">
            <Text mb={4}>
              EventHub cho phép người dùng tạo, quản lý và tham gia các sự kiện.
              Khi tổ chức hoặc tham gia sự kiện:
            </Text>
            <UnorderedList spacing={3} mb={4} pl={4}>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Nhà tổ chức:
                </Text>{" "}
                Phải cung cấp thông tin chính xác về sự kiện, bao gồm thời gian,
                địa điểm, chính sách hoàn tiền và các chi tiết liên quan khác.
              </ListItem>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Người tham gia:
                </Text>{" "}
                Phải tuân thủ các quy tắc và chính sách của sự kiện đã đăng ký
                tham gia.
              </ListItem>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Hủy sự kiện:
                </Text>{" "}
                Nhà tổ chức có thể hủy sự kiện, nhưng phải thông báo cho người
                tham gia và xử lý các vấn đề liên quan đến vé/đăng ký theo chính
                sách đã nêu.
              </ListItem>
            </UnorderedList>
          </TermsSection>

          {/* Thanh toán */}
          <TermsSection title="4. Thanh toán" id="payments">
            <Text mb={4}>
              Khi thực hiện thanh toán trên nền tảng của chúng tôi:
            </Text>
            <UnorderedList spacing={3} mb={4} pl={4}>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Phí dịch vụ:
                </Text>{" "}
                Chúng tôi thu phí dịch vụ cho mỗi giao dịch. Phí này sẽ được
                hiển thị rõ ràng trước khi bạn hoàn tất thanh toán.
              </ListItem>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Hoàn tiền:
                </Text>{" "}
                Chính sách hoàn tiền được thiết lập bởi người tổ chức sự kiện.
                EventHub không đảm bảo bạn sẽ nhận được hoàn tiền đầy đủ trong
                mọi trường hợp.
              </ListItem>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Bảo mật thanh toán:
                </Text>{" "}
                Chúng tôi sử dụng các biện pháp bảo mật tiêu chuẩn để bảo vệ
                thông tin thanh toán của bạn.
              </ListItem>
            </UnorderedList>
          </TermsSection>

          {/* Quy tắc ứng xử */}
          <TermsSection title="5. Quy tắc ứng xử" id="user-conduct">
            <Text mb={4}>
              Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý không:
            </Text>
            <UnorderedList spacing={3} mb={4} pl={4}>
              <ListItem>Vi phạm bất kỳ luật pháp hoặc quy định nào</ListItem>
              <ListItem>
                Xâm phạm quyền riêng tư hoặc quyền sở hữu trí tuệ của người khác
              </ListItem>
              <ListItem>
                Đăng nội dung quấy rối, lăng mạ, khiêu dâm, đe dọa hoặc phân
                biệt đối xử
              </ListItem>
              <ListItem>
                Thực hiện bất kỳ hành vi nào có thể làm tổn hại hoặc gián đoạn
                dịch vụ
              </ListItem>
              <ListItem>Tổ chức sự kiện lừa đảo hoặc bất hợp pháp</ListItem>
              <ListItem>Thu thập thông tin người dùng trái phép</ListItem>
            </UnorderedList>
            <Text mb={4}>
              Chúng tôi có quyền đình chỉ hoặc chấm dứt tài khoản của bạn nếu vi
              phạm các quy tắc ứng xử này.
            </Text>
          </TermsSection>

          {/* Sở hữu trí tuệ */}
          <TermsSection title="6. Sở hữu trí tuệ" id="intellectual-property">
            <Text mb={4}>
              Nền tảng và nội dung của EventHub được bảo vệ bởi các quyền sở hữu
              trí tuệ.
            </Text>
            <UnorderedList spacing={3} mb={4} pl={4}>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Nội dung của chúng tôi:
                </Text>{" "}
                Tất cả nội dung do EventHub tạo ra, bao gồm logo, thiết kế, văn
                bản, đồ họa và phần mềm, là tài sản của chúng tôi.
              </ListItem>
              <ListItem>
                <Text as="span" fontWeight="semibold">
                  Nội dung của bạn:
                </Text>{" "}
                Bạn giữ quyền sở hữu nội dung bạn tạo ra, nhưng cấp cho chúng
                tôi giấy phép sử dụng, hiển thị và phân phối nội dung đó trên
                nền tảng.
              </ListItem>
            </UnorderedList>
          </TermsSection>

          {/* Tuyên bố miễn trừ trách nhiệm */}
          <TermsSection
            title="7. Tuyên bố miễn trừ trách nhiệm"
            id="disclaimers"
          >
            <Text mb={4}>
              Dịch vụ của chúng tôi được cung cấp "nguyên trạng" và "như hiện
              có". Chúng tôi không đảm bảo rằng:
            </Text>
            <UnorderedList spacing={3} mb={4} pl={4}>
              <ListItem>
                Dịch vụ sẽ không bị gián đoạn hoặc không có lỗi
              </ListItem>
              <ListItem>
                Các sự kiện được tổ chức sẽ đáp ứng kỳ vọng của bạn
              </ListItem>
              <ListItem>
                Thông tin được nhà tổ chức cung cấp là chính xác hoặc đầy đủ
              </ListItem>
            </UnorderedList>
          </TermsSection>

          {/* Giới hạn trách nhiệm */}
          <TermsSection
            title="8. Giới hạn trách nhiệm"
            id="limitation-liability"
          >
            <Text mb={4}>
              Trong phạm vi tối đa được pháp luật cho phép, EventHub và các đơn
              vị liên kết không chịu trách nhiệm về:
            </Text>
            <UnorderedList spacing={3} mb={4} pl={4}>
              <ListItem>
                Bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên hoặc đặc biệt
                nào
              </ListItem>
              <ListItem>Mất doanh thu, lợi nhuận hoặc dữ liệu</ListItem>
              <ListItem>
                Hành vi của các nhà tổ chức sự kiện hoặc người tham gia khác
              </ListItem>
            </UnorderedList>
          </TermsSection>

          {/* Thời hạn và chấm dứt */}
          <TermsSection title="9. Thời hạn và chấm dứt" id="term-termination">
            <Text mb={4}>
              Các điều khoản này có hiệu lực cho đến khi bị chấm dứt bởi bạn
              hoặc EventHub.
            </Text>
            <Text mb={4}>
              <Text as="span" fontWeight="semibold">
                Chấm dứt bởi bạn:
              </Text>{" "}
              Bạn có thể ngừng sử dụng dịch vụ hoặc yêu cầu đóng tài khoản của
              mình bất cứ lúc nào.
            </Text>
            <Text mb={4}>
              <Text as="span" fontWeight="semibold">
                Chấm dứt bởi chúng tôi:
              </Text>{" "}
              Chúng tôi có thể đình chỉ hoặc chấm dứt quyền truy cập của bạn vào
              dịch vụ nếu bạn vi phạm các điều khoản này hoặc nếu chúng tôi tin
              rằng hành vi của bạn gây rủi ro hoặc trách nhiệm pháp lý.
            </Text>
          </TermsSection>

          {/* Thay đổi điều khoản */}
          <TermsSection title="10. Thay đổi điều khoản" id="changes-terms">
            <Text mb={4}>
              Chúng tôi có thể cập nhật các Điều khoản Dịch vụ này theo thời
              gian. Khi có sự thay đổi:
            </Text>
            <UnorderedList spacing={3} mb={4} pl={4}>
              <ListItem>
                Chúng tôi sẽ đăng thông báo về các thay đổi trên trang web của
                mình
              </ListItem>
              <ListItem>
                Đối với những thay đổi quan trọng, chúng tôi sẽ gửi thông báo
                qua email
              </ListItem>
              <ListItem>
                Việc tiếp tục sử dụng dịch vụ sau khi thay đổi có hiệu lực đồng
                nghĩa với việc bạn chấp nhận điều khoản mới
              </ListItem>
            </UnorderedList>
          </TermsSection>

          {/* Liên hệ */}
          <TermsSection title="11. Liên hệ chúng tôi" id="contact">
            <Text mb={4}>
              Nếu bạn có bất kỳ câu hỏi nào về Điều khoản Dịch vụ này, vui lòng
              liên hệ với chúng tôi:
            </Text>
            <VStack align="start" spacing={2} mb={4}>
              <Text>Email: legal@eventhub.example.com</Text>
              <Text>
                Địa chỉ: Khu phố 6, Phường Linh Trung, TP.Thủ Đức, TP.Hồ Chí
                Minh
              </Text>
              <Text>Điện thoại: +84 123 456 789</Text>
            </VStack>
            <Button as={Link} to="/contact" colorScheme="teal" size="lg" mt={4}>
              Liên hệ với chúng tôi
            </Button>
          </TermsSection>
        </Box>
      </SimpleGrid>

      {/* FAQ */}
      <Box mt={16} mb={10}>
        <Heading
          as="h2"
          size="xl"
          mb={6}
          textAlign="center"
          color={headingColor}
        >
          Câu hỏi thường gặp
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            bg={bgColor}
          >
            <Heading as="h3" size="md" mb={3} color={headingColor}>
              Làm thế nào để hủy đăng ký sự kiện?
            </Heading>
            <Text color={textColor}>
              Để hủy đăng ký, hãy đăng nhập vào tài khoản của bạn, tìm sự kiện
              trong danh sách "Sự kiện đã đăng ký" và nhấp vào "Hủy đăng ký".
              Lưu ý rằng chính sách hoàn tiền phụ thuộc vào người tổ chức sự
              kiện.
            </Text>
          </Box>

          <Box
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            bg={bgColor}
          >
            <Heading as="h3" size="md" mb={3} color={headingColor}>
              Làm thế nào để trở thành nhà tổ chức sự kiện?
            </Heading>
            <Text color={textColor}>
              Để trở thành nhà tổ chức, hãy đăng nhập và nhấp vào "Trở thành Nhà
              tổ chức" trong menu cài đặt tài khoản. Bạn sẽ cần cung cấp một số
              thông tin bổ sung và đồng ý với Điều khoản dành cho Nhà tổ chức.
            </Text>
          </Box>

          <Box
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            bg={bgColor}
          >
            <Heading as="h3" size="md" mb={3} color={headingColor}>
              Tôi có thể thay đổi thông tin tài khoản không?
            </Heading>
            <Text color={textColor}>
              Có, bạn có thể cập nhật thông tin tài khoản bất cứ lúc nào bằng
              cách truy cập vào "Cài đặt tài khoản" sau khi đăng nhập. Bạn có
              thể thay đổi tên, email, mật khẩu và các thông tin khác.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Links to other documents */}
      <Box
        mt={16}
        p={8}
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        textAlign="center"
      >
        <Heading as="h3" size="lg" mb={4} color={headingColor}>
          Tài liệu liên quan
        </Heading>
        <Text mb={6} color={textColor}>
          Vui lòng xem thêm các tài liệu sau để hiểu đầy đủ về việc sử dụng nền
          tảng của chúng tôi:
        </Text>
        <VStack spacing={4}>
          <Button
            as={Link}
            to="/privacy-policy"
            variant="outline"
            colorScheme="teal"
            size="lg"
            width={{ base: "full", md: "auto" }}
          >
            Chính sách Riêng tư
          </Button>
          <Button
            as={Link}
            to="/help"
            variant="outline"
            colorScheme="teal"
            size="lg"
            width={{ base: "full", md: "auto" }}
          >
            Trung tâm trợ giúp
          </Button>
          <Button
            as={Link}
            to="/contact"
            colorScheme="teal"
            size="lg"
            width={{ base: "full", md: "auto" }}
          >
            Liên hệ hỗ trợ
          </Button>
        </VStack>
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

export default TermsOfService;
