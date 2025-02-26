import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Button,
  Badge,
  SimpleGrid,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdEvent, MdStar, MdInfo } from "react-icons/md";
import { useTranslation } from "react-i18next";
import ColorModeToggle from "../components/common/ColorModeToggle";
import LanguageSwitcher from "../components/common/LanguageSwitcher";

/**
 * Trang Demo để kiểm tra chức năng đa ngôn ngữ và chế độ màu
 * Hiển thị các thành phần UI với text đã được dịch
 */
const DemoPage = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  // Các màu sắc thay đổi theo chế độ màu
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const accentColor = useColorModeValue("teal.500", "teal.300");

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

            {/* Thông tin về theme và language */}
            <HStack mt={6} justify="center" spacing={4}>
              <Badge colorScheme="purple" p={2} borderRadius="md">
                {colorMode === "dark"
                  ? t("common.darkMode")
                  : t("common.lightMode")}
              </Badge>
              <ColorModeToggle />
              <LanguageSwitcher />
            </HStack>
          </Box>

          <Divider />

          {/* Phần demo ngôn ngữ */}
          <Box>
            <Heading as="h2" size="lg" mb={6}>
              {t("events.events")}
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {/* Thẻ sự kiện mẫu 1 */}
              <Card bg={cardBgColor} shadow="md" borderRadius="lg">
                <CardHeader>
                  <Heading size="md" color={accentColor}>
                    {t("events.categories.conference")}
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <Text>{t("events.eventName")}: Tech Summit 2023</Text>
                    <Text>{t("events.location")}: Hà Nội, Việt Nam</Text>
                    <Text>
                      {t("events.startDate")}: 15/12/2023 -{" "}
                      {t("events.endDate")}: 17/12/2023
                    </Text>
                    <Badge colorScheme="green">
                      {t("events.eventStatus.upcoming")}
                    </Badge>
                    <Button
                      leftIcon={<MdEvent />}
                      colorScheme="teal"
                      size="sm"
                      mt={2}
                    >
                      {t("events.registerEvent")}
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              {/* Thẻ sự kiện mẫu 2 */}
              <Card bg={cardBgColor} shadow="md" borderRadius="lg">
                <CardHeader>
                  <Heading size="md" color={accentColor}>
                    {t("events.categories.workshop")}
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <Text>
                      {t("events.eventName")}: Web Development Workshop
                    </Text>
                    <Text>{t("events.location")}: Hồ Chí Minh, Việt Nam</Text>
                    <Text>
                      {t("events.startDate")}: 05/01/2024 -{" "}
                      {t("events.endDate")}: 05/01/2024
                    </Text>
                    <Badge colorScheme="purple">{t("events.free")}</Badge>
                    <Button
                      leftIcon={<MdStar />}
                      colorScheme="teal"
                      size="sm"
                      mt={2}
                    >
                      {t("events.joinEvent")}
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              {/* Thẻ sự kiện mẫu 3 */}
              <Card bg={cardBgColor} shadow="md" borderRadius="lg">
                <CardHeader>
                  <Heading size="md" color={accentColor}>
                    {t("events.categories.concert")}
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <Text>{t("events.eventName")}: Annual Music Festival</Text>
                    <Text>{t("events.location")}: Đà Nẵng, Việt Nam</Text>
                    <Text>
                      {t("events.startDate")}: 20/02/2024 -{" "}
                      {t("events.endDate")}: 22/02/2024
                    </Text>
                    <Badge colorScheme="red">{t("events.paid")}</Badge>
                    <Button
                      leftIcon={<MdInfo />}
                      colorScheme="teal"
                      size="sm"
                      mt={2}
                    >
                      {t("common.details")}
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </Box>

          <Divider />

          {/* Phần demo form */}
          <Box>
            <Heading as="h2" size="lg" mb={6}>
              {t("user.profile")}
            </Heading>

            <Card bg={cardBgColor} shadow="md" borderRadius="lg" p={6}>
              <VStack spacing={4} align="stretch">
                <Text fontWeight="bold">{t("auth.fullName")}: John Doe</Text>
                <Text>{t("auth.email")}: john.doe@example.com</Text>
                <Text>
                  {t("user.bio")}: {t("common.tagline")}
                </Text>

                <HStack spacing={4}>
                  <Button colorScheme="teal">{t("user.editProfile")}</Button>
                  <Button variant="outline" colorScheme="teal">
                    {t("user.changePassword")}
                  </Button>
                </HStack>
              </VStack>
            </Card>
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
};

export default DemoPage;
