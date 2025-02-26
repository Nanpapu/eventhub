import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
  Button,
  Flex,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Link as ChakraLink,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  AspectRatio,
  Badge,
  Link,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FaDownload,
  FaFileAlt,
  FaEnvelope,
  FaFilePdf,
  FaFileWord,
  FaImages,
  FaQuoteLeft,
} from "react-icons/fa";
import { IconType } from "react-icons";

// Brand Assets Data Structures
interface ColorInfo {
  name: string;
  value: string;
  textColor: string;
  description: string;
}

interface LogoAsset {
  id: string;
  name: string;
  description: string;
  preview: string;
  formats: string[];
  downloadLink: string;
}

interface MediaKit {
  id: string;
  title: string;
  description: string;
  fileType: string;
  icon: IconType;
  size: string;
  downloadLink: string;
}

interface PressRelease {
  id: string;
  title: string;
  date: string;
  summary: string;
  downloadLink: string;
}

const PressKit = () => {
  // Colors
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const secondaryBg = useColorModeValue("gray.50", "gray.700");
  const textColorSecondary = useColorModeValue("gray.600", "gray.400");
  const hoverBgColor = useColorModeValue("gray.50", "gray.900");
  const grayBgColor = useColorModeValue("gray.800", "white");
  const blueHighlightBg = useColorModeValue("blue.50", "blue.900");
  const blueTextColor = useColorModeValue("blue.600", "blue.300");
  const blueDarkTextColor = useColorModeValue("blue.700", "blue.300");

  // Color palette data
  const brandColors: ColorInfo[] = [
    {
      name: "Primary",
      value: "#319795", // teal.500
      textColor: "white",
      description: "Main brand color, used for primary actions and navigation",
    },
    {
      name: "Secondary",
      value: "#3182CE", // blue.500
      textColor: "white",
      description: "Used for secondary actions and supporting elements",
    },
    {
      name: "Accent",
      value: "#DD6B20", // orange.500
      textColor: "white",
      description:
        "Used for highlighting important elements or calls to action",
    },
    {
      name: "Success",
      value: "#38A169", // green.500
      textColor: "white",
      description: "Indicates successful actions or positive statuses",
    },
    {
      name: "Warning",
      value: "#ECC94B", // yellow.400
      textColor: "black",
      description: "Used for warnings or drawing attention",
    },
    {
      name: "Error",
      value: "#E53E3E", // red.500
      textColor: "white",
      description: "Indicates errors or critical issues",
    },
    {
      name: "Dark",
      value: "#1A202C", // gray.800
      textColor: "white",
      description: "Used for text and dark mode backgrounds",
    },
    {
      name: "Light",
      value: "#F7FAFC", // gray.50
      textColor: "black",
      description: "Used for backgrounds in light mode",
    },
  ];

  // Logo assets data
  const logoAssets: LogoAsset[] = [
    {
      id: "primary-logo",
      name: "Primary Logo",
      description: "Full color logo on transparent background",
      preview: "/assets/brand/eventhub-logo-color.png",
      formats: ["PNG", "SVG", "EPS"],
      downloadLink: "/downloads/eventhub-primary-logo-package.zip",
    },
    {
      id: "logo-dark",
      name: "Logo - Dark Background",
      description: "White logo for use on dark backgrounds",
      preview: "/assets/brand/eventhub-logo-white.png",
      formats: ["PNG", "SVG", "EPS"],
      downloadLink: "/downloads/eventhub-dark-logo-package.zip",
    },
    {
      id: "logo-light",
      name: "Logo - Light Background",
      description: "Full color logo for use on light backgrounds",
      preview: "/assets/brand/eventhub-logo-dark.png",
      formats: ["PNG", "SVG", "EPS"],
      downloadLink: "/downloads/eventhub-light-logo-package.zip",
    },
    {
      id: "icon-only",
      name: "Icon Only",
      description: "Brand icon without text",
      preview: "/assets/brand/eventhub-icon.png",
      formats: ["PNG", "SVG", "EPS"],
      downloadLink: "/downloads/eventhub-icon-package.zip",
    },
  ];

  // Media kits data
  const mediaKits: MediaKit[] = [
    {
      id: "brand-guidelines",
      title: "Brand Guidelines",
      description:
        "Complete brand guidelines including logo usage, typography, and color palette",
      fileType: "PDF",
      icon: FaFilePdf,
      size: "3.2 MB",
      downloadLink: "/downloads/eventhub-brand-guidelines.pdf",
    },
    {
      id: "media-kit",
      title: "Press Media Kit",
      description:
        "Comprehensive media kit with company information, product screenshots, and press releases",
      fileType: "ZIP",
      icon: FaFileAlt,
      size: "24.6 MB",
      downloadLink: "/downloads/eventhub-media-kit.zip",
    },
    {
      id: "product-images",
      title: "Product Images",
      description: "High-resolution product screenshots and images",
      fileType: "ZIP",
      icon: FaImages,
      size: "18.3 MB",
      downloadLink: "/downloads/eventhub-product-images.zip",
    },
    {
      id: "fact-sheet",
      title: "Company Fact Sheet",
      description:
        "Key information about EventHub company, history, and product",
      fileType: "DOCX/PDF",
      icon: FaFileWord,
      size: "1.5 MB",
      downloadLink: "/downloads/eventhub-fact-sheet.zip",
    },
  ];

  // Press releases data
  const pressReleases: PressRelease[] = [
    {
      id: "press-1",
      title:
        "EventHub Secures $5M in Series A Funding to Expand Event Management Platform",
      date: "July 15, 2023",
      summary:
        "EventHub announces completion of Series A funding led by Acme Ventures to accelerate product development and market expansion.",
      downloadLink: "/downloads/press/eventhub-series-a-funding.pdf",
    },
    {
      id: "press-2",
      title:
        "EventHub Launches Revolutionary AI-Powered Event Planning Assistant",
      date: "May 22, 2023",
      summary:
        "New AI features help event planners save time and optimize event performance with smart recommendations and automations.",
      downloadLink: "/downloads/press/eventhub-ai-assistant-launch.pdf",
    },
    {
      id: "press-3",
      title: "EventHub Reaches 1 Million Users Milestone",
      date: "February 8, 2023",
      summary:
        "EventHub celebrates reaching 1 million users globally, with events organized in over 120 countries.",
      downloadLink: "/downloads/press/eventhub-1m-users.pdf",
    },
    {
      id: "press-4",
      title:
        "EventHub Partners with Global Payment Providers to Expand International Reach",
      date: "November 30, 2022",
      summary:
        "New partnerships with leading payment providers allow EventHub to offer localized payment options in 45 new countries.",
      downloadLink: "/downloads/press/eventhub-payment-partnerships.pdf",
    },
  ];

  return (
    <Container maxW="6xl" py={12}>
      {/* Breadcrumb */}
      <Breadcrumb mb={8} color={textColorSecondary}>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Press Kit</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Hero Section */}
      <Box
        py={10}
        px={8}
        borderRadius="lg"
        bg={blueHighlightBg}
        mb={12}
        textAlign="center"
      >
        <Heading
          as="h1"
          size="2xl"
          fontWeight="bold"
          color={blueTextColor}
          mb={4}
        >
          EventHub Press Kit
        </Heading>
        <Text
          fontSize="xl"
          color={textColorSecondary}
          maxW="3xl"
          mx="auto"
          mb={8}
        >
          Everything you need to accurately represent the EventHub brand in your
          articles, publications, and media.
        </Text>

        <Flex
          direction={{ base: "column", md: "row" }}
          gap={4}
          justify="center"
        >
          <Button
            colorScheme="blue"
            size="lg"
            leftIcon={<FaDownload />}
            as={ChakraLink}
            href="/downloads/eventhub-complete-press-kit.zip"
            download
          >
            Download Complete Press Kit
          </Button>
          <Button
            variant="outline"
            colorScheme="blue"
            size="lg"
            leftIcon={<FaEnvelope />}
            as={ChakraLink}
            href="mailto:press@eventhub.com"
          >
            Contact Press Team
          </Button>
        </Flex>
      </Box>

      {/* Quick Facts */}
      <Box mb={12}>
        <Heading
          as="h2"
          size="xl"
          mb={6}
          color={useColorModeValue("gray.700", "white")}
        >
          Quick Facts
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box
            p={6}
            borderRadius="lg"
            bg={bgColor}
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Heading as="h3" size="md" mb={4} color="blue.500">
              Company Information
            </Heading>
            <VStack align="start" spacing={3}>
              <HStack>
                <Text fontWeight="bold" minW="120px">
                  Founded:
                </Text>
                <Text>2019</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold" minW="120px">
                  Headquarters:
                </Text>
                <Text>San Francisco, California</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold" minW="120px">
                  Employees:
                </Text>
                <Text>150+</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold" minW="120px">
                  Funding:
                </Text>
                <Text>$12M (Series A)</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold" minW="120px">
                  Leadership:
                </Text>
                <Text>
                  Sophia Rodriguez (CEO & Co-founder), David Chen (CTO &
                  Co-founder)
                </Text>
              </HStack>
            </VStack>
          </Box>

          <Box
            p={6}
            borderRadius="lg"
            bg={bgColor}
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Heading as="h3" size="md" mb={4} color="blue.500">
              Platform Statistics
            </Heading>
            <VStack align="start" spacing={3}>
              <HStack>
                <Text fontWeight="bold" minW="150px">
                  Active Users:
                </Text>
                <Text>1.2 million+</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold" minW="150px">
                  Events Hosted:
                </Text>
                <Text>250,000+ annually</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold" minW="150px">
                  Countries:
                </Text>
                <Text>Available in 120+ countries</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold" minW="150px">
                  Ticket Transactions:
                </Text>
                <Text>$500M+ processed (2022)</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold" minW="150px">
                  Customer Satisfaction:
                </Text>
                <Text>4.8/5 average rating</Text>
              </HStack>
            </VStack>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Main Content - Tabs */}
      <Tabs variant="enclosed" colorScheme="blue" mb={16}>
        <TabList mb={6}>
          <Tab fontWeight="medium">Brand Assets</Tab>
          <Tab fontWeight="medium">Press Releases</Tab>
          <Tab fontWeight="medium">Media Resources</Tab>
        </TabList>

        <TabPanels>
          {/* Brand Assets Tab */}
          <TabPanel p={0}>
            {/* Logo Section */}
            <Box mb={10}>
              <Heading
                as="h3"
                size="lg"
                mb={5}
                color={useColorModeValue("gray.700", "white")}
              >
                Logo Assets
              </Heading>
              <Text mb={6} color={textColorSecondary}>
                Download official EventHub logos in various formats. Please
                refer to our brand guidelines for proper usage instructions.
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {logoAssets.map((logo) => (
                  <Box
                    key={logo.id}
                    p={5}
                    borderWidth="1px"
                    borderRadius="lg"
                    borderColor={borderColor}
                    bg={bgColor}
                    _hover={{ boxShadow: "md" }}
                  >
                    <Flex direction={{ base: "column", sm: "row" }} gap={5}>
                      <Box
                        minW={{ base: "100%", sm: "150px" }}
                        maxW={{ base: "100%", sm: "150px" }}
                        height="150px"
                        bg={logo.id.includes("dark") ? "gray.800" : "gray.100"}
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        p={4}
                        mb={{ base: 4, sm: 0 }}
                      >
                        <Image
                          src={logo.preview}
                          alt={logo.name}
                          objectFit="contain"
                          maxH="120px"
                        />
                      </Box>
                      <Box flex="1">
                        <Heading as="h4" size="md" mb={2}>
                          {logo.name}
                        </Heading>
                        <Text color={textColorSecondary} mb={3} fontSize="sm">
                          {logo.description}
                        </Text>
                        <Flex gap={2} mb={4} flexWrap="wrap">
                          {logo.formats.map((format) => (
                            <Badge key={format} colorScheme="blue">
                              {format}
                            </Badge>
                          ))}
                        </Flex>
                        <Button
                          leftIcon={<FaDownload />}
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          as={ChakraLink}
                          href={logo.downloadLink}
                          download
                        >
                          Download All Formats
                        </Button>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            {/* Color Palette Section */}
            <Box mb={10}>
              <Heading
                as="h3"
                size="lg"
                mb={5}
                color={useColorModeValue("gray.700", "white")}
              >
                Color Palette
              </Heading>
              <Text mb={6} color={textColorSecondary}>
                EventHub brand colors. Use these hex values to accurately
                represent our brand in your publications.
              </Text>

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                {brandColors.map((color) => (
                  <Box
                    key={color.name}
                    p={5}
                    borderRadius="md"
                    bg={color.value}
                    color={color.textColor}
                    _hover={{ transform: "translateY(-2px)" }}
                    transition="transform 0.2s"
                  >
                    <Heading as="h4" size="md" mb={2}>
                      {color.name}
                    </Heading>
                    <Text fontSize="sm" mb={3}>
                      {color.value}
                    </Text>
                    <Text fontSize="xs" opacity={0.8}>
                      {color.description}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>

              <Alert status="info" mt={6} borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                  For a complete color guide including secondary and accent
                  colors, please refer to our brand guidelines document.
                </Text>
              </Alert>
            </Box>

            {/* Typography Section */}
            <Box>
              <Heading
                as="h3"
                size="lg"
                mb={5}
                color={useColorModeValue("gray.700", "white")}
              >
                Typography
              </Heading>
              <Text mb={6} color={textColorSecondary}>
                EventHub uses the following fonts across our product and
                marketing materials.
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                <Box
                  p={6}
                  borderRadius="lg"
                  bg={bgColor}
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Heading as="h4" size="md" mb={4} color="blue.500">
                    Inter
                  </Heading>
                  <Text mb={2} fontFamily="Inter, sans-serif">
                    Primary font for interface elements and body text
                  </Text>
                  <Box mt={6}>
                    <Text
                      fontWeight="900"
                      fontSize="2xl"
                      mb={3}
                      fontFamily="Inter, sans-serif"
                    >
                      Inter Black (900)
                    </Text>
                    <Text
                      fontWeight="700"
                      fontSize="xl"
                      mb={3}
                      fontFamily="Inter, sans-serif"
                    >
                      Inter Bold (700)
                    </Text>
                    <Text
                      fontWeight="500"
                      fontSize="lg"
                      mb={3}
                      fontFamily="Inter, sans-serif"
                    >
                      Inter Medium (500)
                    </Text>
                    <Text
                      fontWeight="400"
                      fontSize="md"
                      mb={3}
                      fontFamily="Inter, sans-serif"
                    >
                      Inter Regular (400)
                    </Text>
                  </Box>
                </Box>

                <Box
                  p={6}
                  borderRadius="lg"
                  bg={bgColor}
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Heading as="h4" size="md" mb={4} color="blue.500">
                    Montserrat
                  </Heading>
                  <Text mb={2} fontFamily="Montserrat, sans-serif">
                    Used for headings and important titles
                  </Text>
                  <Box mt={6}>
                    <Text
                      fontWeight="900"
                      fontSize="2xl"
                      mb={3}
                      fontFamily="Montserrat, sans-serif"
                    >
                      Montserrat Black (900)
                    </Text>
                    <Text
                      fontWeight="700"
                      fontSize="xl"
                      mb={3}
                      fontFamily="Montserrat, sans-serif"
                    >
                      Montserrat Bold (700)
                    </Text>
                    <Text
                      fontWeight="500"
                      fontSize="lg"
                      mb={3}
                      fontFamily="Montserrat, sans-serif"
                    >
                      Montserrat Medium (500)
                    </Text>
                    <Text
                      fontWeight="400"
                      fontSize="md"
                      mb={3}
                      fontFamily="Montserrat, sans-serif"
                    >
                      Montserrat Regular (400)
                    </Text>
                  </Box>
                </Box>
              </SimpleGrid>
            </Box>
          </TabPanel>

          {/* Press Releases Tab */}
          <TabPanel p={0}>
            <VStack spacing={0} align="stretch" divider={<Divider />}>
              {pressReleases.map((release) => (
                <Box
                  key={release.id}
                  py={6}
                  _hover={{ bg: hoverBgColor }}
                  borderRadius="md"
                  transition="background 0.2s"
                >
                  <Flex
                    gap={6}
                    direction={{ base: "column", md: "row" }}
                    align={{ base: "flex-start", md: "center" }}
                    justify="space-between"
                  >
                    <Box>
                      <Text
                        color="blue.500"
                        fontSize="sm"
                        fontWeight="medium"
                        mb={2}
                      >
                        {release.date}
                      </Text>
                      <Heading as="h3" size="md" mb={2} color={grayBgColor}>
                        {release.title}
                      </Heading>
                      <Text color={textColorSecondary} noOfLines={2}>
                        {release.summary}
                      </Text>
                    </Box>

                    <Box minW={{ md: "125px" }} pt={{ base: 2, md: 0 }}>
                      <Button
                        as={ChakraLink}
                        href={release.downloadLink}
                        download
                        leftIcon={<FaFilePdf />}
                        colorScheme="blue"
                        variant="outline"
                        size="sm"
                        w={{ base: "full", md: "auto" }}
                      >
                        Download PDF
                      </Button>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </VStack>

            <Box mt={10} p={6} borderRadius="lg" bg={blueHighlightBg}>
              <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                justify="space-between"
                gap={4}
              >
                <Box>
                  <Heading as="h3" size="md" mb={2} color={blueDarkTextColor}>
                    Need Additional Press Information?
                  </Heading>
                  <Text color={textColorSecondary}>
                    Contact our press team for inquiries, interviews, or
                    additional materials.
                  </Text>
                </Box>
                <HStack>
                  <Button
                    as={ChakraLink}
                    href="mailto:press@eventhub.com"
                    leftIcon={<FaEnvelope />}
                    colorScheme="blue"
                  >
                    Email Press Team
                  </Button>
                </HStack>
              </Flex>
            </Box>
          </TabPanel>

          {/* Media Resources Tab */}
          <TabPanel p={0}>
            {/* Download Kits */}
            <Box mb={10}>
              <Heading
                as="h3"
                size="lg"
                mb={5}
                color={useColorModeValue("gray.700", "white")}
              >
                Media Kits
              </Heading>
              <Text mb={6} color={textColorSecondary}>
                Comprehensive resources for media coverage, including brand
                materials, product imagery, and company information.
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {mediaKits.map((kit) => (
                  <Flex
                    key={kit.id}
                    p={5}
                    borderWidth="1px"
                    borderRadius="lg"
                    borderColor={borderColor}
                    bg={bgColor}
                    _hover={{ boxShadow: "md" }}
                    direction="row"
                    gap={4}
                  >
                    <Box
                      p={3}
                      borderRadius="md"
                      bg={blueHighlightBg}
                      color="blue.500"
                      height="fit-content"
                    >
                      <Icon as={kit.icon} boxSize={8} />
                    </Box>
                    <Box flex="1">
                      <Heading as="h4" size="md" mb={1}>
                        {kit.title}
                      </Heading>
                      <Text color={textColorSecondary} fontSize="sm" mb={3}>
                        {kit.description}
                      </Text>
                      <Flex
                        justify="space-between"
                        align="center"
                        wrap={{ base: "wrap", md: "nowrap" }}
                        gap={2}
                      >
                        <HStack>
                          <Badge colorScheme="blue">{kit.fileType}</Badge>
                          <Text fontSize="xs" color={textColorSecondary}>
                            {kit.size}
                          </Text>
                        </HStack>
                        <Button
                          leftIcon={<FaDownload />}
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          as={ChakraLink}
                          href={kit.downloadLink}
                          download
                        >
                          Download
                        </Button>
                      </Flex>
                    </Box>
                  </Flex>
                ))}
              </SimpleGrid>
            </Box>

            {/* Product Screenshots */}
            <Box mb={10}>
              <Heading
                as="h3"
                size="lg"
                mb={5}
                color={useColorModeValue("gray.700", "white")}
              >
                Product Screenshots
              </Heading>
              <Text mb={6} color={textColorSecondary}>
                High-resolution screenshots of the EventHub platform. All images
                may be used with proper attribution.
              </Text>

              <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Box
                    key={item}
                    borderWidth="1px"
                    borderRadius="lg"
                    borderColor={borderColor}
                    overflow="hidden"
                    bg={bgColor}
                    _hover={{ boxShadow: "md" }}
                  >
                    <Box position="relative">
                      <AspectRatio ratio={16 / 9}>
                        <Image
                          src={`/assets/press/product-screenshot-${item}.jpg`}
                          alt={`EventHub product screenshot ${item}`}
                          objectFit="cover"
                        />
                      </AspectRatio>
                      <Button
                        position="absolute"
                        bottom={2}
                        right={2}
                        leftIcon={<FaDownload />}
                        size="xs"
                        colorScheme="blue"
                        as={ChakraLink}
                        href={`/downloads/screenshots/product-screenshot-${item}-full.jpg`}
                        download
                      >
                        Download
                      </Button>
                    </Box>
                    <Box p={3}>
                      <Text fontSize="sm" fontWeight="medium">
                        Screenshot {item}:{" "}
                        {item === 1
                          ? "Dashboard"
                          : item === 2
                          ? "Event Creation"
                          : item === 3
                          ? "Attendee Management"
                          : item === 4
                          ? "Analytics"
                          : item === 5
                          ? "Mobile View"
                          : "Registration"}
                      </Text>
                      <HStack fontSize="xs" color={textColorSecondary} mt={1}>
                        <Text>JPG + PNG</Text>
                        <Text>•</Text>
                        <Text>3840 × 2160px</Text>
                      </HStack>
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>

              <Button
                leftIcon={<FaDownload />}
                mt={6}
                colorScheme="blue"
                as={ChakraLink}
                href="/downloads/eventhub-all-screenshots.zip"
                download
              >
                Download All Screenshots
              </Button>
            </Box>

            {/* Company Information */}
            <Box>
              <Heading
                as="h3"
                size="lg"
                mb={5}
                color={useColorModeValue("gray.700", "white")}
              >
                Company Information
              </Heading>
              <Text mb={6} color={textColorSecondary}>
                Official boilerplate and information for media coverage.
              </Text>

              <Box
                p={6}
                borderRadius="lg"
                bg={bgColor}
                borderWidth="1px"
                borderColor={borderColor}
                mb={6}
              >
                <Heading as="h4" size="md" mb={4} color="blue.500">
                  Company Boilerplate
                </Heading>
                <Box
                  position="relative"
                  p={6}
                  bg={secondaryBg}
                  borderRadius="md"
                  borderLeftWidth="4px"
                  borderLeftColor="blue.500"
                >
                  <Icon
                    as={FaQuoteLeft}
                    position="absolute"
                    top={3}
                    left={3}
                    color="blue.200"
                    boxSize={6}
                    opacity={0.3}
                  />
                  <Text lineHeight="tall" pl={6}>
                    EventHub is a leading event management platform that helps
                    organizers create, promote, and manage virtual, in-person,
                    and hybrid events. Founded in 2019 and headquartered in San
                    Francisco, EventHub serves over 1 million users across 120+
                    countries. The company's all-in-one platform offers tools
                    for registration, ticketing, attendee engagement, analytics,
                    and more, empowering businesses and creators to deliver
                    exceptional event experiences. EventHub is backed by
                    prominent investors including Acme Ventures, Horizon
                    Capital, and FutureForge Partners, with $12 million in total
                    funding to date.
                  </Text>
                </Box>
                <Button
                  leftIcon={<FaFileAlt />}
                  mt={4}
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  as={ChakraLink}
                  href="/downloads/eventhub-company-boilerplate.docx"
                  download
                >
                  Download Boilerplate Text
                </Button>
              </Box>

              <Box
                p={6}
                borderRadius="lg"
                bg={bgColor}
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Heading as="h4" size="md" mb={4} color="blue.500">
                  Executive Team
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Flex gap={4}>
                    <Image
                      src="/assets/press/sophia-rodriguez.jpg"
                      alt="Sophia Rodriguez"
                      borderRadius="md"
                      width="80px"
                      height="80px"
                      objectFit="cover"
                    />
                    <Box>
                      <Heading as="h5" size="sm" mb={1}>
                        Sophia Rodriguez
                      </Heading>
                      <Text fontSize="sm" color="blue.500" mb={2}>
                        CEO & Co-founder
                      </Text>
                      <Button
                        as={ChakraLink}
                        href="/downloads/bios/sophia-rodriguez-bio.pdf"
                        download
                        leftIcon={<FaFileAlt />}
                        colorScheme="blue"
                        variant="outline"
                        size="xs"
                      >
                        Download Bio
                      </Button>
                    </Box>
                  </Flex>

                  <Flex gap={4}>
                    <Image
                      src="/assets/press/david-chen.jpg"
                      alt="David Chen"
                      borderRadius="md"
                      width="80px"
                      height="80px"
                      objectFit="cover"
                    />
                    <Box>
                      <Heading as="h5" size="sm" mb={1}>
                        David Chen
                      </Heading>
                      <Text fontSize="sm" color="blue.500" mb={2}>
                        CTO & Co-founder
                      </Text>
                      <Button
                        as={ChakraLink}
                        href="/downloads/bios/david-chen-bio.pdf"
                        download
                        leftIcon={<FaFileAlt />}
                        colorScheme="blue"
                        variant="outline"
                        size="xs"
                      >
                        Download Bio
                      </Button>
                    </Box>
                  </Flex>
                </SimpleGrid>

                <Button
                  mt={6}
                  colorScheme="blue"
                  variant="outline"
                  leftIcon={<FaFileAlt />}
                  as={ChakraLink}
                  href="/downloads/eventhub-executive-team-bios.zip"
                  download
                >
                  Download All Executive Bios
                </Button>
              </Box>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Contact Information */}
      <Box p={8} borderRadius="lg" bg={blueHighlightBg} textAlign="center">
        <Heading as="h2" size="xl" mb={4} color="blue.500">
          Press Contact
        </Heading>
        <Text
          fontSize="lg"
          color={textColorSecondary}
          maxW="2xl"
          mx="auto"
          mb={6}
        >
          For press inquiries, interview requests, or additional information,
          please contact our media relations team.
        </Text>
        <VStack spacing={2} mb={6}>
          <Text fontSize="lg" fontWeight="bold">
            Media Relations
          </Text>
          <Link
            href="mailto:press@eventhub.com"
            color="blue.500"
            fontWeight="medium"
          >
            press@eventhub.com
          </Link>
          <Text>+1 (555) 123-4567</Text>
        </VStack>

        <Text fontSize="sm" color={textColorSecondary} mt={4}>
          Our press team typically responds within 24 hours on business days.
        </Text>
      </Box>
    </Container>
  );
};

export default PressKit;
