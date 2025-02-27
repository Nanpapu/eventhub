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
  HStack,
  Link as ChakraLink,
  Alert,
  AlertIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

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
  return (
    <Box as="section" id={id} mb={8}>
      <Heading
        as="h2"
        size="lg"
        mb={4}
        color={useColorModeValue("blue.600", "blue.300")}
      >
        {title}
      </Heading>
      <Box>{children}</Box>
    </Box>
  );
};

// Tinh gọn trang Terms of Service
const TermsOfService = () => {
  const textColor = useColorModeValue("gray.600", "gray.400");
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const lastUpdated = "20/05/2023";

  return (
    <Container maxW="4xl" py={10}>
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
      <Box mb={10}>
        <Heading as="h1" size="2xl" mb={4}>
          Điều khoản Dịch vụ
        </Heading>
        <Text color={textColor}>Cập nhật lần cuối: {lastUpdated}</Text>
      </Box>

      {/* Thông báo chấp nhận */}
      <Alert status="info" mb={8} borderRadius="md">
        <AlertIcon />
        <Text>
          Bằng cách truy cập hoặc sử dụng dịch vụ EventHub, bạn đồng ý tuân theo
          các điều khoản và điều kiện được nêu trong thỏa thuận này. Vui lòng
          đọc kỹ.
        </Text>
      </Alert>

      {/* Giới thiệu */}
      <TermsSection title="1. Giới thiệu">
        <Text mb={4}>
          Chào mừng đến với EventHub - nền tảng kết nối người tổ chức sự kiện và
          người tham gia. Các Điều khoản Dịch vụ này ("Điều khoản") quản lý việc
          bạn truy cập và sử dụng trang web, ứng dụng di động và các dịch vụ của
          EventHub (gọi chung là "Dịch vụ").
        </Text>
        <Text>
          Bằng cách truy cập hoặc sử dụng Dịch vụ của chúng tôi, bạn xác nhận
          rằng bạn đã đọc, hiểu và đồng ý tuân theo các Điều khoản này. Nếu bạn
          không đồng ý với bất kỳ phần nào của các Điều khoản này, vui lòng
          không sử dụng Dịch vụ của chúng tôi.
        </Text>
      </TermsSection>

      {/* Định nghĩa */}
      <TermsSection title="2. Định nghĩa" id="definitions">
        <VStack align="start" spacing={3}>
          <Box>
            <Text fontWeight="medium">2.1. "EventHub" hoặc "chúng tôi"</Text>
            <Text>
              Đề cập đến nền tảng EventHub, đơn vị phát triển và vận hành bởi
              nhóm sinh viên UIT.
            </Text>
          </Box>
          <Box>
            <Text fontWeight="medium">2.2. "Dịch vụ"</Text>
            <Text>
              Bao gồm trang web, ứng dụng di động, và tất cả các tính năng, nội
              dung và dịch vụ được cung cấp bởi EventHub.
            </Text>
          </Box>
          <Box>
            <Text fontWeight="medium">2.3. "Người dùng" hoặc "bạn"</Text>
            <Text>
              Đề cập đến bất kỳ cá nhân nào truy cập hoặc sử dụng Dịch vụ của
              chúng tôi.
            </Text>
          </Box>
          <Box>
            <Text fontWeight="medium">2.4. "Người tổ chức"</Text>
            <Text>
              Người dùng tạo và quản lý sự kiện trên nền tảng EventHub.
            </Text>
          </Box>
          <Box>
            <Text fontWeight="medium">2.5. "Người tham gia"</Text>
            <Text>
              Người dùng đăng ký tham gia sự kiện được tạo trên nền tảng
              EventHub.
            </Text>
          </Box>
        </VStack>
      </TermsSection>

      {/* Đăng ký tài khoản */}
      <TermsSection title="3. Đăng ký tài khoản" id="account-registration">
        <Text mb={4}>
          Để sử dụng đầy đủ các tính năng của dịch vụ, bạn cần tạo một tài
          khoản. Khi đăng ký tài khoản với chúng tôi, bạn đồng ý:
        </Text>
        <UnorderedList spacing={2} pl={5} mb={4}>
          <ListItem>
            Cung cấp thông tin chính xác, đầy đủ và cập nhật khi được yêu cầu
          </ListItem>
          <ListItem>Bảo mật thông tin đăng nhập tài khoản của bạn</ListItem>
          <ListItem>
            Chịu trách nhiệm về tất cả hoạt động diễn ra dưới tài khoản của bạn
          </ListItem>
          <ListItem>
            Thông báo ngay cho chúng tôi về bất kỳ việc sử dụng trái phép tài
            khoản của bạn
          </ListItem>
        </UnorderedList>
        <Text>
          EventHub có quyền từ chối dịch vụ, đóng tài khoản hoặc xóa/chỉnh sửa
          nội dung theo quyết định riêng của mình, đặc biệt nếu vi phạm các điều
          khoản sử dụng.
        </Text>
      </TermsSection>

      {/* Nội dung người dùng */}
      <TermsSection title="4. Nội dung người dùng" id="user-content">
        <Text mb={4}>
          Khi bạn đăng tải hoặc chia sẻ nội dung trên nền tảng của chúng tôi
          (như thông tin sự kiện, bình luận, hình ảnh), bạn cấp cho EventHub
          quyền phi độc quyền, miễn phí để sử dụng, sao chép, chỉnh sửa và hiển
          thị nội dung đó cho mục đích cung cấp và quảng bá Dịch vụ.
        </Text>
        <Text mb={4}>
          Bạn đảm bảo rằng bạn sở hữu hoặc có đầy đủ quyền đối với nội dung mà
          bạn đăng tải, và việc đăng tải không vi phạm quyền của bất kỳ bên thứ
          ba nào.
        </Text>
        <Text fontWeight="medium" mb={2}>
          Nội dung bị cấm:
        </Text>
        <UnorderedList spacing={2} pl={5}>
          <ListItem>
            Nội dung vi phạm pháp luật hoặc quảng cáo các hoạt động bất hợp pháp
          </ListItem>
          <ListItem>
            Nội dung xúc phạm, khiêu dâm, bạo lực hoặc phân biệt đối xử
          </ListItem>
          <ListItem>Spam, lừa đảo hoặc phần mềm độc hại</ListItem>
          <ListItem>
            Nội dung vi phạm quyền sở hữu trí tuệ của người khác
          </ListItem>
        </UnorderedList>
      </TermsSection>

      {/* Các sự kiện */}
      <TermsSection title="5. Các sự kiện" id="events">
        <Text mb={4}>
          EventHub cho phép Người tổ chức tạo và quản lý sự kiện, và Người tham
          gia đăng ký tham gia các sự kiện này.
        </Text>

        <Heading as="h3" size="md" mb={3} mt={4}>
          5.1. Đối với Người tổ chức
        </Heading>
        <UnorderedList spacing={2} pl={5} mb={4}>
          <ListItem>
            Bạn chịu trách nhiệm về tính chính xác của thông tin sự kiện
          </ListItem>
          <ListItem>Bạn phải tuân thủ mọi cam kết với Người tham gia</ListItem>
          <ListItem>
            Bạn chịu trách nhiệm đảm bảo sự kiện tuân thủ pháp luật hiện hành
          </ListItem>
          <ListItem>
            EventHub không chịu trách nhiệm về nội dung, chất lượng hoặc an toàn
            của sự kiện
          </ListItem>
        </UnorderedList>

        <Heading as="h3" size="md" mb={3}>
          5.2. Đối với Người tham gia
        </Heading>
        <UnorderedList spacing={2} pl={5}>
          <ListItem>
            Việc đăng ký sự kiện tạo thành thỏa thuận giữa bạn và Người tổ chức,
            không phải với EventHub
          </ListItem>
          <ListItem>
            Bạn nên xem xét cẩn thận thông tin sự kiện trước khi đăng ký
          </ListItem>
          <ListItem>
            Chính sách hủy và hoàn tiền do Người tổ chức quyết định
          </ListItem>
        </UnorderedList>
      </TermsSection>

      {/* Phí và thanh toán */}
      <TermsSection title="6. Phí và thanh toán" id="fees-payment">
        <Text mb={4}>
          EventHub có thể tính phí cho một số dịch vụ nhất định trên nền tảng.
          Khi bạn lựa chọn dịch vụ có phí:
        </Text>
        <UnorderedList spacing={2} pl={5}>
          <ListItem>
            Bạn đồng ý thanh toán tất cả các khoản phí liên quan
          </ListItem>
          <ListItem>
            Thông tin thanh toán của bạn sẽ được xử lý bởi các nhà cung cấp dịch
            vụ thanh toán được ủy quyền
          </ListItem>
          <ListItem>
            Tất cả các khoản phí sẽ được hiển thị rõ ràng trước khi bạn hoàn tất
            giao dịch
          </ListItem>
          <ListItem>
            Chính sách hoàn tiền sẽ được nêu rõ cho từng dịch vụ cụ thể
          </ListItem>
        </UnorderedList>
      </TermsSection>

      {/* Quyền sở hữu trí tuệ */}
      <TermsSection title="7. Quyền sở hữu trí tuệ" id="intellectual-property">
        <Text mb={4}>
          Tất cả nội dung, thiết kế, đồ họa, giao diện người dùng, mã nguồn và
          phần mềm được sử dụng bởi EventHub đều thuộc sở hữu của EventHub hoặc
          được cấp phép cho EventHub sử dụng.
        </Text>
        <Text>
          Bạn không được sao chép, sửa đổi, phân phối, tái sản xuất, xuất bản
          hoặc tạo ra các tác phẩm phái sinh từ bất kỳ nội dung nào của EventHub
          mà không có sự cho phép rõ ràng bằng văn bản từ chúng tôi.
        </Text>
      </TermsSection>

      {/* Miễn trừ trách nhiệm */}
      <TermsSection title="8. Miễn trừ trách nhiệm" id="disclaimers">
        <Text mb={4}>
          Dịch vụ của EventHub được cung cấp "nguyên trạng" và "như có sẵn",
          không có bất kỳ bảo đảm nào, dù rõ ràng hay ngụ ý. Cụ thể, EventHub
          không bảo đảm rằng:
        </Text>
        <UnorderedList spacing={2} pl={5}>
          <ListItem>Dịch vụ sẽ đáp ứng các yêu cầu cụ thể của bạn</ListItem>
          <ListItem>
            Dịch vụ sẽ không bị gián đoạn, kịp thời, an toàn hoặc không có lỗi
          </ListItem>
          <ListItem>
            Thông tin bạn nhận được qua Dịch vụ sẽ chính xác hoặc đáng tin cậy
          </ListItem>
        </UnorderedList>
      </TermsSection>

      {/* Giới hạn trách nhiệm */}
      <TermsSection title="9. Giới hạn trách nhiệm" id="limitation-liability">
        <Text mb={4}>
          Trong giới hạn tối đa được pháp luật cho phép, EventHub và các nhân
          viên, giám đốc, đối tác của chúng tôi sẽ không chịu trách nhiệm về:
        </Text>
        <UnorderedList spacing={2} pl={5}>
          <ListItem>
            Bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, hoặc do hậu quả
          </ListItem>
          <ListItem>
            Mất dữ liệu, lợi nhuận, doanh thu, cơ hội kinh doanh
          </ListItem>
          <ListItem>
            Thiệt hại từ việc sử dụng hoặc không thể sử dụng dịch vụ
          </ListItem>
          <ListItem>
            Nội dung hoặc hành vi của bất kỳ bên thứ ba nào trên dịch vụ
          </ListItem>
        </UnorderedList>
      </TermsSection>

      {/* Sửa đổi điều khoản */}
      <TermsSection title="10. Sửa đổi điều khoản" id="modifications">
        <Text mb={4}>
          EventHub có quyền sửa đổi các Điều khoản này vào bất kỳ lúc nào. Chúng
          tôi sẽ thông báo cho bạn về các thay đổi quan trọng bằng cách đăng
          thông báo nổi bật trên Dịch vụ hoặc gửi email đến địa chỉ được liên
          kết với tài khoản của bạn.
        </Text>
        <Text>
          Việc bạn tiếp tục sử dụng Dịch vụ sau khi thay đổi có hiệu lực đồng
          nghĩa với việc bạn chấp nhận các Điều khoản đã sửa đổi.
        </Text>
      </TermsSection>

      {/* Điều khoản pháp lý khác */}
      <TermsSection title="11. Điều khoản pháp lý khác" id="legal-terms">
        <VStack align="start" spacing={4}>
          <Box>
            <Text fontWeight="medium">11.1. Luật áp dụng</Text>
            <Text>
              Các Điều khoản này sẽ được điều chỉnh và giải thích theo luật pháp
              Việt Nam, không áp dụng các quy tắc xung đột pháp luật.
            </Text>
          </Box>
          <Box>
            <Text fontWeight="medium">11.2. Giải quyết tranh chấp</Text>
            <Text>
              Bất kỳ tranh chấp nào phát sinh từ hoặc liên quan đến Điều khoản
              này sẽ được giải quyết thông qua thương lượng thiện chí. Nếu không
              thể giải quyết, tranh chấp sẽ được đưa ra tòa án có thẩm quyền tại
              Việt Nam.
            </Text>
          </Box>
          <Box>
            <Text fontWeight="medium">11.3. Tính tách biệt</Text>
            <Text>
              Nếu bất kỳ điều khoản nào trong Thỏa thuận này được xác định là
              không hợp lệ hoặc không thể thực thi, các điều khoản còn lại vẫn
              giữ nguyên hiệu lực.
            </Text>
          </Box>
        </VStack>
      </TermsSection>

      {/* Câu hỏi thường gặp */}
      <Box
        mt={12}
        p={6}
        bg={useColorModeValue("gray.50", "gray.700")}
        borderRadius="lg"
      >
        <Heading as="h2" size="lg" mb={4}>
          Câu hỏi thường gặp về Điều khoản
        </Heading>
        <Accordion allowToggle>
          <AccordionItem
            borderWidth="1px"
            mb={3}
            borderRadius="md"
            borderColor={borderColor}
            overflow="hidden"
          >
            <h3>
              <AccordionButton
                py={3}
                px={4}
                _expanded={{ bg: useColorModeValue("blue.50", "blue.900") }}
              >
                <Box flex="1" textAlign="left" fontWeight="medium">
                  Tôi có thể hủy đăng ký sự kiện không?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h3>
            <AccordionPanel pb={4}>
              <Text>
                Việc hủy đăng ký sự kiện phụ thuộc vào chính sách của người tổ
                chức. Mỗi sự kiện có thể có chính sách hủy và hoàn tiền khác
                nhau. Vui lòng kiểm tra thông tin chi tiết của sự kiện trước khi
                đăng ký. Nếu bạn cần hủy, hãy liên hệ trực tiếp với người tổ
                chức sự kiện hoặc sử dụng tùy chọn hủy trong tài khoản của bạn
                nếu có sẵn.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem
            borderWidth="1px"
            mb={3}
            borderRadius="md"
            borderColor={borderColor}
            overflow="hidden"
          >
            <h3>
              <AccordionButton
                py={3}
                px={4}
                _expanded={{ bg: useColorModeValue("blue.50", "blue.900") }}
              >
                <Box flex="1" textAlign="left" fontWeight="medium">
                  EventHub có chịu trách nhiệm về chất lượng sự kiện không?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h3>
            <AccordionPanel pb={4}>
              <Text>
                EventHub là nền tảng kết nối người tổ chức sự kiện và người tham
                gia. Chúng tôi không tổ chức các sự kiện trực tiếp và không chịu
                trách nhiệm về nội dung, chất lượng hoặc an toàn của sự kiện.
                Người tổ chức sự kiện chịu hoàn toàn trách nhiệm về thông tin họ
                cung cấp và việc tổ chức sự kiện. Tuy nhiên, chúng tôi khuyến
                khích người dùng báo cáo bất kỳ vấn đề nào để chúng tôi có thể
                duy trì tiêu chuẩn chất lượng trên nền tảng.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem
            borderWidth="1px"
            borderRadius="md"
            borderColor={borderColor}
            overflow="hidden"
          >
            <h3>
              <AccordionButton
                py={3}
                px={4}
                _expanded={{ bg: useColorModeValue("blue.50", "blue.900") }}
              >
                <Box flex="1" textAlign="left" fontWeight="medium">
                  Làm thế nào để trở thành người tổ chức sự kiện?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h3>
            <AccordionPanel pb={4}>
              <Text>
                Để trở thành người tổ chức sự kiện trên EventHub, bạn cần đăng
                ký tài khoản và hoàn thành quy trình xác minh đơn giản. Sau khi
                đăng nhập, hãy chọn "Trở thành Người tổ chức" từ menu tài khoản
                và làm theo hướng dẫn. Quy trình này bao gồm việc cung cấp thông
                tin cơ bản về bạn hoặc tổ chức của bạn. Sau khi được phê duyệt,
                bạn có thể bắt đầu tạo và quản lý sự kiện trên nền tảng của
                chúng tôi.
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      {/* Hành động */}
      <HStack justify="center" mt={10} mb={6} spacing={6}>
        <Button as={Link} to="/privacy" colorScheme="blue" variant="outline">
          Xem Chính sách Riêng tư
        </Button>
        <Button as={Link} to="/contact" colorScheme="blue">
          Liên hệ với chúng tôi
        </Button>
      </HStack>

      {/* Footer */}
      <Divider my={6} />
      <Text textAlign="center" fontSize="sm" color={textColor}>
        © {new Date().getFullYear()} EventHub. Đồ án môn IE213 - Kỹ thuật phát
        triển hệ thống web, UIT.
      </Text>
    </Container>
  );
};

export default TermsOfService;
