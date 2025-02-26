import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Button,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { DateDisplay, CurrencyDisplay, NumberDisplay } from "../common";

/**
 * Component demo hiển thị các thành phần định dạng i18n
 */
const FormattingDemo = () => {
  const { t, i18n } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Ngày hiện tại để demo
  const now = new Date();

  // Ngày trong quá khứ để demo thời gian tương đối
  const pastDate = new Date();
  pastDate.setHours(pastDate.getHours() - 5);

  // Ngày trong tương lai để demo
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 14);

  // Đổi ngôn ngữ
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "vi" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <Container maxW="container.md" py={8}>
      <Stack spacing={6}>
        <Flex justify="space-between" align="center">
          <Heading as="h1" size="xl" mb={4}>
            I18n Components Demo
          </Heading>
          <Stack direction="row" spacing={4}>
            <Button onClick={toggleLanguage}>
              {i18n.language === "en" ? "Tiếng Việt" : "English"}
            </Button>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? "Dark Mode" : "Light Mode"}
            </Button>
          </Stack>
        </Flex>

        <Box
          p={6}
          bg={bgColor}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Heading as="h2" size="md" mb={4}>
            Date & Time Formatting
          </Heading>
          <Divider mb={4} />
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Date Display (Standard)
              </Text>
              <DateDisplay date={now} mode="date" showIcon />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Date Display (Compact)
              </Text>
              <DateDisplay date={now} mode="compact" showIcon />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Time Display
              </Text>
              <DateDisplay date={now} mode="time" showIcon />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                DateTime Display
              </Text>
              <DateDisplay date={now} mode="dateTime" showIcon />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Relative Time (Past)
              </Text>
              <DateDisplay date={pastDate} mode="relative" showIcon />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Future Date
              </Text>
              <DateDisplay date={futureDate} mode="date" showIcon />
            </Box>
          </SimpleGrid>
        </Box>

        <Box
          p={6}
          bg={bgColor}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Heading as="h2" size="md" mb={4}>
            Currency Formatting
          </Heading>
          <Divider mb={4} />
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Vietnamese Dong (VND)
              </Text>
              <CurrencyDisplay amount={1250000} />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                US Dollars (USD)
              </Text>
              <CurrencyDisplay amount={49.99} currency="USD" />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Euro (EUR)
              </Text>
              <CurrencyDisplay amount={39.95} currency="EUR" />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Negative Amount
              </Text>
              <CurrencyDisplay amount={-125000} colorNegative />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Positive Amount (Highlighted)
              </Text>
              <CurrencyDisplay amount={500000} colorPositive />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Zero Amount
              </Text>
              <CurrencyDisplay amount={0} />
            </Box>
          </SimpleGrid>
        </Box>

        <Box
          p={6}
          bg={bgColor}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Heading as="h2" size="md" mb={4}>
            Number Formatting
          </Heading>
          <Divider mb={4} />
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Standard Number
              </Text>
              <NumberDisplay value={1234567} />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Negative Number
              </Text>
              <NumberDisplay value={-9876} colorNegative />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Percentage (Basic)
              </Text>
              <NumberDisplay value={0.75} mode="percent" />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Percentage (With Decimals)
              </Text>
              <NumberDisplay value={0.3333} mode="percent" decimals={2} />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Positive Percentage (Highlighted)
              </Text>
              <NumberDisplay value={0.15} mode="percent" colorPositive />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Negative Percentage
              </Text>
              <NumberDisplay value={-0.25} mode="percent" colorNegative />
            </Box>
          </SimpleGrid>
        </Box>
      </Stack>
    </Container>
  );
};

export default FormattingDemo;
