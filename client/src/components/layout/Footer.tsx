import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link as ChakraLink,
  VisuallyHidden,
  chakra,
  useColorModeValue,
  Flex,
  Heading,
  Input,
  IconButton,
  useToast,
  Divider,
  HStack,
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { FaTwitter, FaYoutube, FaInstagram, FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiMailSend } from "react-icons/bi";
// Trong thực tế, bạn sẽ import useAuth từ context
// import { useAuth } from "../../contexts/AuthContext";

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={"600"} fontSize={"md"} mb={3} color="teal.500">
      {children}
    </Text>
  );
};

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {
  // State cho form đăng ký email
  const [email, setEmail] = useState("");
  const toast = useToast();

  // Tạm thời để false, trong thực tế sẽ lấy từ context
  const isOrganizer = false;

  // Thiết lập màu sắc theo theme
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const logoColor = useColorModeValue("teal.600", "teal.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const formBg = useColorModeValue("white", "gray.700");
  const linkHoverColor = useColorModeValue("teal.600", "teal.300");

  // Xử lý đăng ký nhận thông báo
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập địa chỉ email của bạn",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Kiểm tra định dạng email đơn giản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập một địa chỉ email hợp lệ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Mô phỏng thành công
    toast({
      title: "Đăng ký thành công!",
      description: "Cảm ơn bạn đã đăng ký nhận bản tin của chúng tôi",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setEmail("");
  };

  return (
    <Box
      bg={bgColor}
      color={textColor}
      mt="auto" // Giúp footer luôn ở dưới cùng nếu nội dung trang không đủ cao
      borderTopWidth="1px"
      borderColor={borderColor}
    >
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid
          templateColumns={{ sm: "1fr 1fr", md: "1.5fr 1fr 1fr" }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Flex alignItems="center">
              <Heading
                as={Link}
                to="/"
                size="md"
                color={logoColor}
                sx={{ textDecoration: "none" }}
              >
                EventHub
              </Heading>
            </Flex>
            <Text
              fontSize={"sm"}
              color={secondaryTextColor}
              maxW="320px"
              lineHeight="1.6"
            >
              EventHub là nền tảng quản lý sự kiện hàng đầu tại Việt Nam, giúp
              kết nối người tổ chức với người tham gia.
            </Text>
            <Stack direction={"row"} spacing={4}>
              <SocialButton
                label={"Facebook của EventHub"}
                href={"https://facebook.com/eventhubvn"}
              >
                <FaFacebookF />
              </SocialButton>
              <SocialButton
                label={"Twitter của EventHub"}
                href={"https://twitter.com/eventhubvn"}
              >
                <FaTwitter />
              </SocialButton>
              <SocialButton
                label={"YouTube của EventHub"}
                href={"https://youtube.com/eventhubvn"}
              >
                <FaYoutube />
              </SocialButton>
              <SocialButton
                label={"Instagram của EventHub"}
                href={"https://instagram.com/eventhubvn"}
              >
                <FaInstagram />
              </SocialButton>
            </Stack>
          </Stack>

          <Stack align={"flex-start"} spacing={4}>
            <ListHeader>Thông tin</ListHeader>
            <ChakraLink
              as={Link}
              to={"/about"}
              _hover={{ color: linkHoverColor, textDecoration: "none" }}
            >
              Về chúng tôi
            </ChakraLink>
            <ChakraLink
              as={Link}
              to={"/contact"}
              _hover={{ color: linkHoverColor, textDecoration: "none" }}
            >
              Liên hệ
            </ChakraLink>
            <ChakraLink
              as={Link}
              to={"/press"}
              _hover={{ color: linkHoverColor, textDecoration: "none" }}
            >
              Hồ sơ báo chí
            </ChakraLink>
            <ChakraLink
              as={Link}
              to={"/help"}
              _hover={{ color: linkHoverColor, textDecoration: "none" }}
            >
              Trung tâm trợ giúp
            </ChakraLink>
          </Stack>

          <Stack align={"flex-start"} spacing={4}>
            <ListHeader>Pháp lý & Hỗ trợ</ListHeader>
            <ChakraLink
              as={Link}
              to={"/privacy"}
              _hover={{ color: linkHoverColor, textDecoration: "none" }}
            >
              Chính sách riêng tư
            </ChakraLink>
            <ChakraLink
              as={Link}
              to={"/terms"}
              _hover={{ color: linkHoverColor, textDecoration: "none" }}
            >
              Điều khoản dịch vụ
            </ChakraLink>
            {isOrganizer ? (
              <ChakraLink
                as={Link}
                to={"/dashboard"}
                _hover={{ color: linkHoverColor, textDecoration: "none" }}
              >
                Bảng điều khiển tổ chức
              </ChakraLink>
            ) : (
              <ChakraLink
                as={Link}
                to={"/become-organizer"}
                _hover={{ color: linkHoverColor, textDecoration: "none" }}
              >
                Trở thành nhà tổ chức
              </ChakraLink>
            )}
            <ChakraLink
              as={Link}
              to={"/events/categories"}
              _hover={{ color: linkHoverColor, textDecoration: "none" }}
            >
              Khám phá danh mục
            </ChakraLink>
          </Stack>
        </SimpleGrid>

        <Divider my={8} borderColor={borderColor} />

        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ base: "center", md: "flex-end" }}
          gap={4}
        >
          <Box>
            <Text fontSize={"sm"} color={secondaryTextColor}>
              © {new Date().getFullYear()} EventHub Việt Nam | IE213 - Kỹ thuật
              phát triển hệ thống web, UIT
            </Text>
          </Box>
          <HStack spacing={3}>
            <form onSubmit={handleSubscribe}>
              <Stack direction={"row"}>
                <Input
                  placeholder="Đăng ký nhận tin mới"
                  bg={formBg}
                  size="sm"
                  width="200px"
                  borderRadius="md"
                  border={1}
                  borderStyle={"solid"}
                  borderColor={borderColor}
                  _focus={{
                    borderColor: "teal.400",
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <IconButton
                  size="sm"
                  bg={"teal.500"}
                  color={useColorModeValue("white", "gray.800")}
                  _hover={{
                    bg: "teal.600",
                  }}
                  aria-label="Đăng ký"
                  type="submit"
                  icon={<BiMailSend />}
                />
              </Stack>
            </form>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
