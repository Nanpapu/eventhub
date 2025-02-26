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
import {
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaArrowRight,
  FaFacebookF,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const [isSubscribing, setIsSubscribing] = useState(false);
  const toast = useToast();
  const { t } = useTranslation();

  // Sẽ sử dụng context auth trong thực tế
  // const { isAuthenticated, user } = useAuth();
  // const isOrganizer = isAuthenticated && user?.role === "organizer";

  // Tạm thời để false, trong thực tế sẽ lấy từ context
  const isOrganizer = false;

  // Thiết lập màu sắc theo theme
  const bgColor = useColorModeValue("bg.secondary", "bg.primary");
  const textColor = useColorModeValue("text.primary", "text.primary");
  const secondaryTextColor = useColorModeValue(
    "text.secondary",
    "text.secondary"
  );
  const logoColor = useColorModeValue("teal.600", "teal.300");
  const borderColor = useColorModeValue("card.border", "card.border");
  const formBg = useColorModeValue("whiteAlpha.100", "blackAlpha.100");

  // Kiểm tra email hợp lệ
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Xử lý đăng ký nhận thông báo
  const handleSubscribe = () => {
    if (!email) {
      toast({
        title: t("errors.required"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!isValidEmail(email)) {
      toast({
        title: t("errors.invalidEmail"),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Giả lập gửi đăng ký
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setEmail("");
      toast({
        title: t("common.success"),
        description: t("common.welcome"),
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }, 1000);
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
                {t("common.appName")}
              </Heading>
            </Flex>
            <Text fontSize={"sm"} color={secondaryTextColor}>
              © 2024 EventHub Vietnam. {t("footer.copyright")}
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
            <ListHeader>{t("footer.about")}</ListHeader>
            <ChakraLink as={Link} to={"/about"}>
              {t("footer.about")}
            </ChakraLink>
            <ChakraLink as={Link} to={"/contact"}>
              {t("footer.contactUs")}
            </ChakraLink>
            <ChakraLink as={Link} to={"/press"}>
              Press Kit
            </ChakraLink>
            <ChakraLink as={Link} to={"/privacy"}>
              {t("footer.privacyPolicy")}
            </ChakraLink>
            <ChakraLink as={Link} to={"/terms"}>
              {t("footer.termsOfService")}
            </ChakraLink>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Support</ListHeader>
            <ChakraLink as={Link} to={"/help"}>
              {t("footer.faq")}
            </ChakraLink>
            <ChakraLink as={Link} to={"/faq"}>
              Help Center
            </ChakraLink>
            {isOrganizer ? (
              <ChakraLink as={Link} to={"/dashboard"}>
                {t("user.organizerDashboard")}
              </ChakraLink>
            ) : (
              <ChakraLink as={Link} to={"/become-organizer"}>
                Become an Organizer
              </ChakraLink>
            )}
            <ChakraLink as={Link} to={"/community"}>
              Community
            </ChakraLink>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Stay up to date</ListHeader>
            <Stack direction={"row"}>
              <Input
                placeholder={"Your email address"}
                bg={formBg}
                border={1}
                borderStyle={"solid"}
                borderColor={borderColor}
                _focus={{
                  bg: "whiteAlpha.300",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isDisabled={isSubscribing}
              />
              <IconButton
                bg={useColorModeValue("teal.500", "teal.500")}
                color={useColorModeValue("white", "gray.800")}
                _hover={{
                  bg: "teal.600",
                }}
                aria-label="Subscribe"
                icon={<FaArrowRight />}
                onClick={handleSubscribe}
                isLoading={isSubscribing}
              />
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
