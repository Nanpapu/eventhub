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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  HStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

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

// Tinh gọn trang Privacy Policy
const PrivacyPolicy = () => {
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
          <BreadcrumbLink>Chính sách Riêng tư</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <Box mb={10}>
        <Heading as="h1" size="2xl" mb={4}>
          Chính sách Riêng tư
        </Heading>
        <Text color={textColor}>Cập nhật lần cuối: {lastUpdated}</Text>
      </Box>

      {/* Giới thiệu */}
      <PolicySection title="1. Giới thiệu">
        <Text mb={4}>
          Chào mừng đến với Chính sách Riêng tư của EventHub. Chúng tôi tôn
          trọng quyền riêng tư của bạn và cam kết bảo vệ thông tin cá nhân mà
          bạn chia sẻ với chúng tôi.
        </Text>
        <Text mb={4}>
          Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông
          tin cá nhân khi bạn sử dụng dịch vụ của chúng tôi. Bằng việc sử dụng
          EventHub, bạn đồng ý với các điều khoản được mô tả trong chính sách
          này.
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
        <VStack align="start" spacing={4} mb={4}>
          <Box>
            <Heading as="h3" size="md" mb={2}>
              2.1 Thông tin cá nhân
            </Heading>
            <Text mb={2}>
              Khi bạn đăng ký tài khoản hoặc sử dụng dịch vụ của chúng tôi,
              chúng tôi có thể thu thập:
            </Text>
            <UnorderedList spacing={1} pl={5}>
              <ListItem>
                Thông tin cá nhân như tên, địa chỉ email, số điện thoại
              </ListItem>
              <ListItem>Thông tin hồ sơ như ảnh đại diện và tiểu sử</ListItem>
              <ListItem>
                Thông tin liên lạc khi bạn liên hệ với bộ phận hỗ trợ của chúng
                tôi
              </ListItem>
            </UnorderedList>
          </Box>
          <Box>
            <Heading as="h3" size="md" mb={2}>
              2.2 Thông tin sử dụng
            </Heading>
            <Text mb={2}>
              Chúng tôi cũng thu thập thông tin về cách bạn truy cập và sử dụng
              dịch vụ của chúng tôi:
            </Text>
            <UnorderedList spacing={1} pl={5}>
              <ListItem>
                Dữ liệu tương tác như các sự kiện bạn xem hoặc tham gia
              </ListItem>
              <ListItem>
                Thông tin thiết bị như địa chỉ IP, loại trình duyệt và thiết bị
              </ListItem>
              <ListItem>
                Dữ liệu nhật ký như thời gian truy cập và các trang bạn đã xem
              </ListItem>
            </UnorderedList>
          </Box>
        </VStack>
      </PolicySection>

      {/* Cách chúng tôi sử dụng thông tin */}
      <PolicySection
        title="3. Cách chúng tôi sử dụng thông tin"
        id="information-use"
      >
        <Text mb={4}>
          Chúng tôi sử dụng thông tin thu thập được cho các mục đích sau:
        </Text>
        <UnorderedList spacing={2} pl={5} mb={4}>
          <ListItem>
            <Text fontWeight="medium">Cung cấp và duy trì dịch vụ:</Text>
            <Text>
              Quản lý tài khoản của bạn và cung cấp các tính năng của nền tảng
            </Text>
          </ListItem>
          <ListItem>
            <Text fontWeight="medium">
              Cải thiện và cá nhân hóa trải nghiệm:
            </Text>
            <Text>
              Phân tích cách người dùng sử dụng dịch vụ để cải thiện nền tảng
            </Text>
          </ListItem>
          <ListItem>
            <Text fontWeight="medium">Liên lạc với bạn:</Text>
            <Text>
              Gửi thông báo, cập nhật, và hỗ trợ liên quan đến dịch vụ
            </Text>
          </ListItem>
          <ListItem>
            <Text fontWeight="medium">Đảm bảo an toàn:</Text>
            <Text>
              Phát hiện, ngăn chặn và xử lý các hoạt động gian lận hoặc bất hợp
              pháp
            </Text>
          </ListItem>
        </UnorderedList>
      </PolicySection>

      {/* Chia sẻ thông tin */}
      <PolicySection title="4. Chia sẻ thông tin" id="information-sharing">
        <Text mb={4}>
          Chúng tôi không bán thông tin cá nhân của bạn cho bên thứ ba. Chúng
          tôi có thể chia sẻ thông tin trong các trường hợp sau:
        </Text>
        <UnorderedList spacing={2} pl={5} mb={4}>
          <ListItem>
            <Text fontWeight="medium">Với người tổ chức sự kiện:</Text>
            <Text>
              Khi bạn đăng ký tham gia sự kiện, thông tin cần thiết sẽ được chia
              sẻ với người tổ chức
            </Text>
          </ListItem>
          <ListItem>
            <Text fontWeight="medium">Với nhà cung cấp dịch vụ:</Text>
            <Text>
              Chúng tôi làm việc với các công ty khác để cung cấp dịch vụ như
              lưu trữ và xử lý thanh toán
            </Text>
          </ListItem>
          <ListItem>
            <Text fontWeight="medium">Theo yêu cầu pháp lý:</Text>
            <Text>
              Khi được yêu cầu bởi luật pháp hoặc để bảo vệ quyền lợi pháp lý
              của chúng tôi
            </Text>
          </ListItem>
        </UnorderedList>
      </PolicySection>

      {/* Bảo mật dữ liệu */}
      <PolicySection title="5. Bảo mật dữ liệu" id="data-security">
        <Text mb={4}>
          Chúng tôi áp dụng các biện pháp bảo mật hợp lý để bảo vệ thông tin cá
          nhân của bạn:
        </Text>
        <UnorderedList spacing={2} pl={5} mb={4}>
          <ListItem>
            Mã hóa dữ liệu nhạy cảm như mật khẩu và thông tin thanh toán
          </ListItem>
          <ListItem>
            Hạn chế quyền truy cập vào thông tin cá nhân cho nhân viên được ủy
            quyền
          </ListItem>
          <ListItem>
            Đánh giá thường xuyên các biện pháp bảo mật để đảm bảo hiệu quả
          </ListItem>
        </UnorderedList>
        <Text>
          Tuy nhiên, không có phương thức truyền dữ liệu qua internet hoặc
          phương thức lưu trữ điện tử nào là an toàn 100%. Chúng tôi không thể
          đảm bảo bảo mật tuyệt đối cho thông tin của bạn.
        </Text>
      </PolicySection>

      {/* Quyền của bạn */}
      <PolicySection title="6. Quyền của bạn" id="your-rights">
        <Text mb={4}>
          Tùy thuộc vào khu vực bạn cư trú, bạn có thể có một số hoặc tất cả các
          quyền sau đối với dữ liệu cá nhân của mình:
        </Text>
        <UnorderedList spacing={2} pl={5} mb={4}>
          <ListItem>Quyền truy cập và xem thông tin cá nhân của bạn</ListItem>
          <ListItem>Quyền yêu cầu chỉnh sửa thông tin không chính xác</ListItem>
          <ListItem>
            Quyền yêu cầu xóa thông tin trong một số trường hợp
          </ListItem>
          <ListItem>Quyền phản đối hoặc hạn chế việc xử lý thông tin</ListItem>
          <ListItem>
            Quyền rút lại sự đồng ý mà bạn đã cung cấp trước đó
          </ListItem>
        </UnorderedList>
        <Text>
          Để thực hiện quyền của mình, bạn có thể truy cập vào trang cài đặt tài
          khoản của mình hoặc liên hệ với chúng tôi theo thông tin liên hệ được
          cung cấp dưới đây.
        </Text>
      </PolicySection>

      {/* Người dùng trẻ em */}
      <PolicySection title="7. Người dùng trẻ em" id="children">
        <Text mb={4}>
          Dịch vụ của chúng tôi không dành cho người dưới 13 tuổi. Chúng tôi
          không cố ý thu thập thông tin cá nhân từ trẻ em dưới 13 tuổi. Nếu bạn
          là phụ huynh hoặc người giám hộ và biết rằng con bạn đã cung cấp cho
          chúng tôi thông tin cá nhân, vui lòng liên hệ với chúng tôi để có thể
          thực hiện các hành động cần thiết.
        </Text>
      </PolicySection>

      {/* Thay đổi chính sách */}
      <PolicySection title="8. Thay đổi chính sách" id="policy-changes">
        <Text mb={4}>
          Chúng tôi có thể cập nhật Chính sách Riêng tư này theo thời gian để
          phản ánh các thay đổi về thực tiễn thông tin của chúng tôi. Chúng tôi
          sẽ thông báo cho bạn về bất kỳ thay đổi quan trọng nào bằng cách đăng
          thông báo nổi bật trên trang web của chúng tôi hoặc gửi email đến địa
          chỉ email được liên kết với tài khoản của bạn.
        </Text>
        <Text>
          Chúng tôi khuyến khích bạn xem xét Chính sách Riêng tư này định kỳ để
          cập nhật về cách chúng tôi bảo vệ thông tin của bạn.
        </Text>
      </PolicySection>

      {/* Liên hệ */}
      <PolicySection title="9. Liên hệ với chúng tôi" id="contact-us">
        <Text mb={4}>
          Nếu bạn có bất kỳ câu hỏi nào về Chính sách Riêng tư này hoặc thực
          tiễn bảo mật của chúng tôi, vui lòng liên hệ với chúng tôi:
        </Text>
        <Box
          p={5}
          bg={useColorModeValue("gray.50", "gray.700")}
          borderRadius="md"
          mb={4}
        >
          <VStack align="start" spacing={2}>
            <Text>
              <strong>Email:</strong>{" "}
              <ChakraLink
                href="mailto:privacy@eventhub.example.com"
                color="blue.500"
              >
                privacy@eventhub.example.com
              </ChakraLink>
            </Text>
            <Text>
              <strong>Đơn vị phát triển:</strong> Nhóm Sinh viên UIT
            </Text>
            <Text>
              <strong>Địa chỉ:</strong> Đại học Công nghệ Thông tin, Đại học
              Quốc gia TP.HCM
            </Text>
          </VStack>
        </Box>
      </PolicySection>

      {/* Điều hướng FAQ */}
      <Box
        mt={12}
        p={6}
        bg={useColorModeValue("gray.50", "gray.700")}
        borderRadius="lg"
      >
        <Heading as="h2" size="lg" mb={4}>
          Câu hỏi thường gặp về Quyền riêng tư
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
                  EventHub lưu trữ dữ liệu cá nhân của tôi trong bao lâu?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h3>
            <AccordionPanel pb={4}>
              <Text>
                Chúng tôi lưu trữ thông tin cá nhân của bạn chừng nào tài khoản
                của bạn còn hoạt động hoặc cần thiết để cung cấp dịch vụ cho
                bạn. Nếu bạn xóa tài khoản, chúng tôi sẽ xóa thông tin cá nhân
                trong vòng 30 ngày, trừ khi có yêu cầu pháp lý để lưu giữ lâu
                hơn.
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
                  Làm thế nào để tôi có thể kiểm soát thông báo email?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h3>
            <AccordionPanel pb={4}>
              <Text>
                Bạn có thể cập nhật tùy chọn email trong phần "Cài đặt tài
                khoản" sau khi đăng nhập. Tại đây, bạn có thể lựa chọn loại
                thông báo bạn muốn nhận hoặc hủy đăng ký khỏi tất cả các email
                tiếp thị. Lưu ý rằng chúng tôi vẫn có thể gửi email quan trọng
                liên quan đến dịch vụ, như xác nhận đăng ký sự kiện.
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
                  EventHub có sử dụng cookie không?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h3>
            <AccordionPanel pb={4}>
              <Text>
                Có, chúng tôi sử dụng cookie và các công nghệ tương tự để cung
                cấp, bảo vệ và cải thiện dịch vụ của mình. Cookie giúp chúng tôi
                nhớ đăng nhập của bạn, hiểu cách bạn sử dụng dịch vụ, cá nhân
                hóa nội dung, và cung cấp tính năng bảo mật. Bạn có thể quản lý
                cài đặt cookie trong trình duyệt của mình, nhưng việc vô hiệu
                hóa cookie có thể ảnh hưởng đến chức năng của trang web.
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      {/* Hành động */}
      <HStack justify="center" mt={10} mb={6} spacing={6}>
        <Button as={Link} to="/terms" colorScheme="blue" variant="outline">
          Xem Điều khoản Dịch vụ
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

export default PrivacyPolicy;
