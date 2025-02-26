import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Divider,
  Card,
  CardBody,
  Image,
  Stack,
  Badge,
  useToast,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ColorModeToggle from "../components/common/ColorModeToggle";
import LanguageSwitcher from "../components/common/LanguageSwitcher";

/**
 * Trang Demo - Giúp người dùng dễ dàng test các luồng chính của hệ thống
 * Trang này sẽ bị xóa khi tích hợp BE thực tế
 */
export default function Demo() {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  // Demo user state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"user" | "organizer" | null>(null);

  // Màu sắc thay đổi theo chế độ màu
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  // Danh sách sự kiện demo
  const demoEvents = [
    {
      id: "1",
      title: "Tech Summit 2023",
      type: "conference",
      location: "Hà Nội, Việt Nam",
      startDate: "15/12/2023",
      endDate: "17/12/2023",
      imageUrl: "https://bit.ly/3yMdCgG",
      price: "VND 599,000",
      isPaid: true,
      status: "upcoming",
    },
    {
      id: "2",
      title: "Web Development Workshop",
      type: "workshop",
      location: "Hồ Chí Minh, Việt Nam",
      startDate: "05/01/2024",
      endDate: "05/01/2024",
      imageUrl: "https://bit.ly/3PkXdB0",
      price: "Miễn phí",
      isPaid: false,
      status: "upcoming",
    },
    {
      id: "3",
      title: "Annual Music Festival",
      type: "concert",
      location: "Đà Nẵng, Việt Nam",
      startDate: "20/02/2024",
      endDate: "22/02/2024",
      imageUrl: "https://bit.ly/3tKjY8Z",
      price: "VND 799,000",
      isPaid: true,
      status: "upcoming",
    },
  ];

  // Functions to navigate
  const goToEventDetail = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const goToEventCheckout = (eventId: string) => {
    navigate(`/events/${eventId}/checkout`);
  };

  const goToMyTickets = () => {
    navigate("/my-tickets");
  };

  // Demo login functions
  const loginAsUser = () => {
    setIsLoggedIn(true);
    setUserRole("user");
    toast({
      title: t("auth.loginSuccess"),
      description: t("common.welcome"),
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const loginAsOrganizer = () => {
    setIsLoggedIn(true);
    setUserRole("organizer");
    toast({
      title: t("auth.loginSuccess"),
      description: `${t("common.welcome")}, ${t("user.organizerDashboard")}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    toast({
      title: t("auth.logoutSuccess"),
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Tiêu đề */}
          <Box textAlign="center" py={6}>
            <Heading as="h1" size="2xl" mb={4}>
              {t("common.welcome")}
            </Heading>
            <Text fontSize="xl" color={textColor}>
              {t("common.tagline")}
            </Text>

            {/* Demo của Theme và Language Switcher */}
            <Box mt={6} p={4} bg={cardBgColor} borderRadius="md" shadow="md">
              <Heading as="h3" size="md" mb={4}>
                Language & Theme Demo
              </Heading>
              <HStack spacing={4} justify="center">
                <Badge colorScheme="purple" p={2} borderRadius="md">
                  {colorMode === "dark"
                    ? t("common.darkMode")
                    : t("common.lightMode")}
                </Badge>
                <ColorModeToggle />
                <LanguageSwitcher />
              </HStack>
            </Box>
          </Box>

          <Divider />

          {/* Phần demo đăng nhập */}
          <Box>
            <Heading as="h2" size="lg" mb={6}>
              {t("auth.login")} Demo
            </Heading>
            <HStack spacing={4} mb={6}>
              {!isLoggedIn ? (
                <>
                  <Button colorScheme="teal" onClick={loginAsUser}>
                    {t("auth.login")} as User
                  </Button>
                  <Button colorScheme="orange" onClick={loginAsOrganizer}>
                    {t("auth.login")} as Organizer
                  </Button>
                </>
              ) : (
                <>
                  <Badge
                    colorScheme={userRole === "organizer" ? "orange" : "teal"}
                    p={2}
                  >
                    Role: {userRole === "organizer" ? "Organizer" : "User"}
                  </Badge>
                  <Button colorScheme="red" onClick={logout}>
                    {t("auth.logout")}
                  </Button>
                </>
              )}
            </HStack>
          </Box>

          <Divider />

          {/* Events Section */}
          <Box>
            <Heading as="h2" size="lg" mb={6}>
              {t("events.events")}
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {demoEvents.map((event) => (
                <Card
                  key={event.id}
                  bg={cardBgColor}
                  shadow="md"
                  borderRadius="lg"
                  overflow="hidden"
                >
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    height="200px"
                    objectFit="cover"
                  />
                  <CardBody>
                    <Stack spacing={3}>
                      <Heading size="md">{event.title}</Heading>
                      <Badge
                        colorScheme={event.isPaid ? "red" : "green"}
                        width="fit-content"
                      >
                        {event.isPaid ? t("events.paid") : t("events.free")}
                      </Badge>
                      <Text>
                        {t("events.category")}:{" "}
                        {t(`events.categories.${event.type}`)}
                      </Text>
                      <Text>
                        {t("events.location")}: {event.location}
                      </Text>
                      <Text>
                        {t("events.startDate")}: {event.startDate} -{" "}
                        {t("events.endDate")}: {event.endDate}
                      </Text>
                      {event.isPaid && <Text>{event.price}</Text>}
                      <HStack spacing={2} mt={2}>
                        <Button
                          size="sm"
                          colorScheme="teal"
                          onClick={() => goToEventDetail(event.id)}
                        >
                          {t("common.details")}
                        </Button>
                        {isLoggedIn && (
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => goToEventCheckout(event.id)}
                          >
                            {t("events.registerEvent")}
                          </Button>
                        )}
                      </HStack>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>

            {isLoggedIn && (
              <Button mt={8} colorScheme="teal" onClick={goToMyTickets}>
                {t("events.myEvents")}
              </Button>
            )}
          </Box>

          <Divider />

          {/* Footer */}
          <Box textAlign="center" py={4}>
            <Text fontSize="sm" color="gray.500">
              {t("footer.copyright")}
            </Text>
            <HStack spacing={4} justify="center" mt={2}>
              <Button variant="link" size="sm">
                {t("footer.about")}
              </Button>
              <Button variant="link" size="sm">
                {t("footer.contactUs")}
              </Button>
              <Button variant="link" size="sm">
                {t("footer.privacyPolicy")}
              </Button>
              <Button variant="link" size="sm">
                {t("footer.termsOfService")}
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
