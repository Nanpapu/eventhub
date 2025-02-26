import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FiSearch, FiMapPin, FiCalendar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Sample event data
const events = [
  {
    id: 1,
    title: "UI/UX Design Workshop",
    description: "Workshop on modern user interface design principles",
    date: "15/08/2023",
    location: "Ho Chi Minh City",
    image: "https://bit.ly/3IZUfQd",
    category: "workshop",
    isPaid: false,
  },
  {
    id: 2,
    title: "Blockchain Technology Conference",
    description:
      "Explore the potential and applications of blockchain technology",
    date: "20/08/2023",
    location: "Hanoi",
    image: "https://bit.ly/3wIlKgh",
    category: "conference",
    isPaid: true,
  },
  {
    id: 3,
    title: "Music Festival 2023",
    description: "The biggest music event of the year featuring top artists",
    date: "10/09/2023",
    location: "Da Nang",
    image: "https://bit.ly/3wvlcXF",
    category: "concert",
    isPaid: true,
  },
  {
    id: 4,
    title: "Technology Exhibition",
    description: "Exhibition showcasing the latest technology products",
    date: "25/08/2023",
    location: "Ho Chi Minh City",
    image: "https://bit.ly/3P96Zxz",
    category: "exhibition",
    isPaid: false,
  },
];

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    category: string;
    isPaid: boolean;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="transform 0.3s"
      _hover={{ transform: "translateY(-5px)" }}
    >
      <Image
        src={event.image}
        alt={event.title}
        height="200px"
        width="100%"
        objectFit="cover"
      />
      <Box p={5}>
        <Box display="flex" alignItems="baseline">
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
          >
            {event.isPaid ? "Paid" : "Free"} &bull; {event.category}
          </Box>
        </Box>

        <Heading size="md" my={2} isTruncated>
          {event.title}
        </Heading>

        <Text noOfLines={2} mb={3}>
          {event.description}
        </Text>

        <Flex align="center" color="gray.500" fontSize="sm" mb={2}>
          <FiCalendar />
          <Text ml={2}>{event.date}</Text>
        </Flex>

        <Flex align="center" color="gray.500" fontSize="sm" mb={4}>
          <FiMapPin />
          <Text ml={2}>{event.location}</Text>
        </Flex>

        <Button
          as={Link}
          to={`/events/${event.id}`}
          colorScheme="teal"
          width="full"
          sx={{ textDecoration: "none" }}
        >
          View Details
        </Button>
      </Box>
    </Box>
  );
};

const Home = () => {
  // Thêm state cho form tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const navigate = useNavigate();

  // Xử lý submit form tìm kiếm
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchKeyword) params.append("keyword", searchKeyword);
    if (searchLocation) params.append("location", searchLocation);
    if (searchCategory) params.append("category", searchCategory);

    navigate(`/events?${params.toString()}`);
  };

  return (
    <Container maxW="100%" px={0}>
      {/* Hero Section */}
      <Box
        bg="teal.500"
        color="white"
        py={20}
        px={8}
        borderRadius="lg"
        mb={10}
        backgroundImage="url('https://bit.ly/3IYSA0D')"
        backgroundSize="cover"
        backgroundPosition="center"
        position="relative"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          borderRadius="lg"
        />
        <VStack
          spacing={5}
          position="relative"
          align="flex-start"
          maxW="container.md"
        >
          <Heading as="h1" size="2xl">
            Discover and join exciting events
          </Heading>
          <Text fontSize="xl" maxW="container.sm">
            EventHub helps you easily find, join, and organize events that match
            your interests.
          </Text>
          <Button
            size="lg"
            colorScheme="teal"
            onClick={() => navigate("/events")}
          >
            Explore Now
          </Button>
        </VStack>
      </Box>

      {/* Search Section - Đã được cập nhật với state và xử lý */}
      <Box mb={10} p={6} bg="white" borderRadius="lg" boxShadow="md">
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={4}
          align={{ base: "stretch", md: "center" }}
        >
          <InputGroup size="lg" flex={1}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search events"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </InputGroup>

          <InputGroup size="lg" flex={1}>
            <InputLeftElement pointerEvents="none">
              <FiMapPin color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </InputGroup>

          <Select
            placeholder="Category"
            size="lg"
            flex={1}
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="meetup">Meetup</option>
            <option value="concert">Concert</option>
            <option value="exhibition">Exhibition</option>
            <option value="other">Other</option>
          </Select>

          <Button colorScheme="teal" size="lg" px={10} onClick={handleSearch}>
            Search
          </Button>
        </Flex>
      </Box>

      {/* Events Section */}
      <Box mb={10}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Upcoming Events</Heading>
          <Button
            as={Link}
            to="/events"
            variant="outline"
            colorScheme="teal"
            sx={{ textDecoration: "none" }}
          >
            View All
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </SimpleGrid>
      </Box>

      {/* Call to Action */}
      <Box
        bg="gray.50"
        p={10}
        borderRadius="lg"
        textAlign="center"
        mb={10}
        boxShadow="md"
      >
        <Stack spacing={5} align="center">
          <Heading>Want to organize an event?</Heading>
          <Text fontSize="lg" maxW="container.md">
            EventHub provides a comprehensive event management platform to help
            you easily create and manage your events.
          </Text>
          <Button size="lg" colorScheme="teal">
            Create Event Now
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default Home;
