import {
  Box,
  Container,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  SimpleGrid,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

// Định nghĩa cấu trúc dữ liệu cho câu hỏi thường gặp
interface FAQItem {
  question: string;
  answer: React.ReactNode;
  category: string;
}

const FAQ = () => {
  // Colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const categoryBg = useColorModeValue("blue.50", "blue.900");
  const textColor = useColorModeValue("gray.600", "gray.400");

  // Danh sách các câu hỏi thường gặp theo danh mục
  const faqData: FAQItem[] = [
    // Tài khoản & Đăng ký
    {
      question: "Làm thế nào để tạo tài khoản?",
      answer: (
        <Text>
          Nhấp vào nút "Đăng ký" ở góc trên bên phải của trang web. Nhập địa chỉ
          email, tạo mật khẩu và điền thông tin hồ sơ của bạn. Xác minh địa chỉ
          email của bạn bằng cách nhấp vào liên kết được gửi đến hộp thư đến của
          bạn.
        </Text>
      ),
      category: "Tài khoản",
    },
    {
      question: "Làm thế nào để đặt lại mật khẩu?",
      answer: (
        <Text>
          Để đặt lại mật khẩu, nhấp vào liên kết "Quên mật khẩu" trên trang đăng
          nhập. Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết
          đặt lại mật khẩu.
        </Text>
      ),
      category: "Tài khoản",
    },
    // Sự kiện & Đăng ký
    {
      question: "Làm thế nào để đăng ký tham gia sự kiện?",
      answer: (
        <Text>
          Để đăng ký tham gia sự kiện, hãy điều hướng đến trang sự kiện và nhấp
          vào nút "Đăng ký" hoặc "Đặt vé". Làm theo hướng dẫn để hoàn tất đăng
          ký của bạn.
        </Text>
      ),
      category: "Sự kiện",
    },
    {
      question: "Tôi có thể hủy đăng ký không?",
      answer: (
        <Text>
          Có, bạn có thể hủy đăng ký bằng cách vào mục "Sự kiện của tôi" trong
          bảng điều khiển tài khoản và chọn "Hủy đăng ký" cho sự kiện cụ thể.
          Vui lòng kiểm tra chính sách hoàn tiền của sự kiện trước khi hủy.
        </Text>
      ),
      category: "Sự kiện",
    },
    {
      question: "Làm thế nào để tạo sự kiện?",
      answer: (
        <Text>
          Để tạo sự kiện, hãy vào bảng điều khiển và nhấp vào nút "Tạo sự kiện".
          Điền thông tin sự kiện bao gồm tiêu đề, mô tả, ngày, địa điểm và tải
          lên hình ảnh sự kiện. Bạn cũng có thể thiết lập loại vé và giá nếu áp
          dụng.
        </Text>
      ),
      category: "Sự kiện",
    },
    // Thanh toán & Vé
    {
      question: "Những phương thức thanh toán nào được chấp nhận?",
      answer: (
        <Text>
          Hiện tại, chúng tôi hỗ trợ thẻ tín dụng/ghi nợ, MoMo, ZaloPay và VNPay
          cho các khoản thanh toán sự kiện. Thêm các phương thức thanh toán khác
          sẽ được bổ sung trong các cập nhật tương lai.
        </Text>
      ),
      category: "Thanh toán",
    },
    {
      question: "Làm thế nào để truy cập vé của tôi?",
      answer: (
        <Text>
          Sau khi đăng ký, vé của bạn sẽ được gửi đến email và cũng có sẵn trong
          phần "Vé của tôi" trên bảng điều khiển người dùng. Bạn có thể tải
          xuống, in hoặc xuất trình vé trên thiết bị di động khi tham dự sự
          kiện.
        </Text>
      ),
      category: "Thanh toán",
    },
    // Chung
    {
      question: "Làm thế nào để liên hệ với đội hỗ trợ?",
      answer: (
        <Text>
          Bạn có thể liên hệ với đội hỗ trợ của chúng tôi bằng cách gửi email
          đến support@eventhub.example.com hoặc sử dụng biểu mẫu liên hệ trên
          trang "Liên hệ với chúng tôi". Chúng tôi cố gắng phản hồi tất cả các
          yêu cầu trong vòng 24 giờ.
        </Text>
      ),
      category: "Chung",
    },
    {
      question: "EventHub có ứng dụng di động không?",
      answer: (
        <Text>
          Hiện tại, EventHub là một ứng dụng web đáp ứng hoạt động tốt trên mọi
          thiết bị, bao gồm cả điện thoại di động. Chúng tôi đang phát triển ứng
          dụng di động dành riêng cho Android và iOS, dự kiến ​​ra mắt trong
          tương lai gần.
        </Text>
      ),
      category: "Chung",
    },
    {
      question: "Tôi có thể thêm đồng tổ chức cho sự kiện của mình không?",
      answer: (
        <Text>
          Có, bạn có thể thêm đồng tổ chức cho sự kiện của mình. Trong trang
          quản lý sự kiện, nhấp vào tab "Quản lý nhóm" và nhập địa chỉ email của
          người dùng mà bạn muốn thêm làm đồng tổ chức. Họ sẽ nhận được lời mời
          qua email để tham gia nhóm tổ chức sự kiện của bạn.
        </Text>
      ),
      category: "Sự kiện",
    },
    {
      question: "Làm thế nào để trở thành người tổ chức được xác minh?",
      answer: (
        <Text>
          Để trở thành người tổ chức được xác minh, hãy truy cập trang "Trở
          thành người tổ chức" từ menu tài khoản của bạn. Điền vào biểu mẫu với
          thông tin cần thiết và tải lên các tài liệu xác minh được yêu cầu. Quy
          trình xác minh thường mất 2-3 ngày làm việc để hoàn tất.
        </Text>
      ),
      category: "Tài khoản",
    },
  ];

  // Lấy các danh mục duy nhất
  const categories = [...new Set(faqData.map((item) => item.category))];

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
          <BreadcrumbLink>Câu hỏi thường gặp</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <Box mb={10} textAlign="center">
        <Heading as="h1" size="2xl" mb={4}>
          Câu hỏi thường gặp
        </Heading>
        <Text fontSize="lg" color={textColor}>
          Tìm câu trả lời nhanh chóng cho những câu hỏi phổ biến nhất
        </Text>
      </Box>

      {/* FAQ Categories */}
      <SimpleGrid
        columns={{ base: 2, md: 4 }}
        spacing={4}
        mb={10}
        display={{ base: "none", md: "grid" }}
      >
        {categories.map((category) => (
          <Box
            key={category}
            p={4}
            bg={categoryBg}
            borderRadius="md"
            textAlign="center"
            fontWeight="medium"
            cursor="pointer"
            onClick={() => {
              document
                .getElementById(`category-${category}`)
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {category}
          </Box>
        ))}
      </SimpleGrid>

      {/* FAQ by Category */}
      {categories.map((category) => (
        <Box key={category} mb={10} id={`category-${category}`}>
          <Heading
            as="h2"
            size="lg"
            mb={6}
            color={useColorModeValue("blue.600", "blue.300")}
          >
            {category}
          </Heading>
          <Accordion allowToggle>
            {faqData
              .filter((item) => item.category === category)
              .map((faq, index) => (
                <AccordionItem
                  key={index}
                  mb={3}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  overflow="hidden"
                >
                  <h3>
                    <AccordionButton
                      py={4}
                      _expanded={{
                        bg: useColorModeValue("blue.50", "blue.900"),
                        fontWeight: "medium",
                      }}
                    >
                      <Box flex="1" textAlign="left">
                        {faq.question}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h3>
                  <AccordionPanel pb={4}>{faq.answer}</AccordionPanel>
                </AccordionItem>
              ))}
          </Accordion>
        </Box>
      ))}

      {/* Footer note */}
      <Divider my={10} />
      <Text fontSize="sm" textAlign="center" color={textColor}>
        © {new Date().getFullYear()} EventHub. Đồ án môn IE213 - Kỹ thuật phát
        triển hệ thống web, UIT.
      </Text>
    </Container>
  );
};

export default FAQ;
