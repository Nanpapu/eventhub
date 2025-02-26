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
} from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { FaTwitter, FaYoutube, FaInstagram, FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiMailSend } from "react-icons/bi";
// Trong thực tế, bạn sẽ import useAuth từ context
// import { useAuth } from "../../contexts/AuthContext";

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
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
  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const logoColor = useColorModeValue("teal.600", "teal.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const formBg = useColorModeValue("gray.50", "gray.700");

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
    >
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid
          templateColumns={{ sm: "1fr 1fr", md: "2fr 1fr 1fr 2fr" }}
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
            <Text fontSize={"sm"} color={secondaryTextColor}>
              © 2025 EventHub Việt Nam. Đã đăng ký bản quyền
            </Text>
            <Stack direction={"row"} spacing={6}>
              <SocialButton
                label={"Facebook"}
                href={"https://facebook.com/eventhubvn"}
              >
                <FaFacebookF />
              </SocialButton>
              <SocialButton
                label={"Twitter"}
                href={"https://twitter.com/eventhubvn"}
              >
                <FaTwitter />
              </SocialButton>
              <SocialButton
                label={"YouTube"}
                href={"https://youtube.com/eventhubvn"}
              >
                <FaYoutube />
              </SocialButton>
              <SocialButton
                label={"Instagram"}
                href={"https://instagram.com/eventhubvn"}
              >
                <FaInstagram />
              </SocialButton>
            </Stack>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Về chúng tôi</ListHeader>
            <ChakraLink as={Link} to={"/about"}>
              Về chúng tôi
            </ChakraLink>
            <ChakraLink as={Link} to={"/contact"}>
              Liên hệ
            </ChakraLink>
            <ChakraLink as={Link} to={"/press"}>
              Bộ hồ sơ báo chí
            </ChakraLink>
            <ChakraLink as={Link} to={"/privacy"}>
              Chính sách bảo mật
            </ChakraLink>
            <ChakraLink as={Link} to={"/terms"}>
              Điều khoản dịch vụ
            </ChakraLink>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Hỗ trợ</ListHeader>
            <ChakraLink as={Link} to={"/help"}>
              Câu hỏi thường gặp
            </ChakraLink>
            <ChakraLink as={Link} to={"/faq"}>
              Trung tâm trợ giúp
            </ChakraLink>
            {isOrganizer ? (
              <ChakraLink as={Link} to={"/dashboard"}>
                Bảng điều khiển tổ chức
              </ChakraLink>
            ) : (
              <ChakraLink as={Link} to={"/become-organizer"}>
                Trở thành nhà tổ chức
              </ChakraLink>
            )}
            <ChakraLink as={Link} to={"/community"}>
              Cộng đồng
            </ChakraLink>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Luôn cập nhật</ListHeader>
            <Stack direction={"row"}>
              <form onSubmit={handleSubscribe}>
                <Stack direction={"row"}>
                  <Input
                    placeholder="Địa chỉ email của bạn"
                    bg={formBg}
                    border={1}
                    borderStyle={"solid"}
                    borderColor={borderColor}
                    _focus={{
                      bg: useColorModeValue("gray.100", "gray.600"),
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <IconButton
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
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
