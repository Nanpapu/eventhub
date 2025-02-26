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
} from '@chakra-ui/react';
import { FiSearch, FiMapPin, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
// Danh sách s? ki?n gi? d?nh
const events = [
  {
    id: 1,
    title: 'Workshop UI/UX Design',
    description: 'Workshop chia s? v? thi?t k? giao di?n ngu?i dùng hi?n d?i',
    date: '15/08/2023',
    location: 'H? Chí Minh',
    image: 'https://bit.ly/3IZUfQd',
    category: 'workshop',
    isPaid: false,
  },
  {
    id: 2,
    title: 'H?i th?o Blockchain Technology',
    description: 'Khám phá ti?m nang và ?ng d?ng c?a công ngh? blockchain',
    date: '20/08/2023',
    location: 'Hà N?i',
    image: 'https://bit.ly/3wIlKgh',
    category: 'conference',
    isPaid: true,
  },
  {
    id: 3,
    title: 'Music Festival 2023',
    description: 'S? ki?n âm nh?c l?n nh?t trong nam v?i nhi?u ca si n?i ti?ng',
    date: '10/09/2023',
    location: 'Ðà N?ng',
    image: 'https://bit.ly/3wvlcXF',
    category: 'concert',
    isPaid: true,
  },
  {
    id: 4,
    title: 'Tri?n lãm công ngh?',
    description: 'Tri?n lãm gi?i thi?u các s?n ph?m công ngh? m?i nh?t',
    date: '25/08/2023',
    location: 'H? Chí Minh',
    image: 'https://bit.ly/3P96Zxz',
    category: 'exhibition',
    isPaid: false,
  },
];
const EventCard = ({ event }: { event: any }) => {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="transform 0.3s"
      _hover={{ transform: 'translateY(-5px)' }}
    >
      <Image src={event.image} alt={event.title} height="200px" width="100%" objectFit="cover" />
      <Box p={5}>
        <Box display="flex" alignItems="baseline">
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
          >
            {event.isPaid ? 'Tr? phí' : 'Mi?n phí'} &bull; {event.category}
          </Box>
        </Box>
        <Heading size="md" my={2} noOfLines={1}>
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
        <Button as={Link} to={`/events/${event.id}`} colorScheme="teal" width="full">
          Xem chi ti?t
        </Button>
      </Box>
    </Box>
  );
};
const Home = () => {
  return (
    <Container maxW="container.xl">
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
        <VStack spacing={5} position="relative" align="flex-start" maxW="container.md">
          <Heading as="h1" size="2xl">
            Khám phá và tham gia s? ki?n h?p d?n
          </Heading>
          <Text fontSize="xl" maxW="container.sm">
            EventHub giúp b?n d? dàng tìm ki?m, tham gia và t? ch?c các s? ki?n phù h?p v?i s?
            thích.
          </Text>
          <Button size="lg" colorScheme="teal">
            Khám phá ngay
          </Button>
        </VStack>
      </Box>
      {/* Search Section */}
      <Box mb={10} p={6} bg="white" borderRadius="lg" boxShadow="md">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={4}
          align={{ base: 'stretch', md: 'center' }}
        >
          <InputGroup size="lg" flex={1}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input placeholder="Tìm ki?m s? ki?n" />
          </InputGroup>
          <InputGroup size="lg" flex={1}>
            <InputLeftElement pointerEvents="none">
              <FiMapPin color="gray.300" />
            </InputLeftElement>
            <Input placeholder="Ð?a di?m" />
          </InputGroup>
          <Select placeholder="Th? lo?i" size="lg" flex={1}>
            <option value="conference">H?i th?o</option>
            <option value="workshop">Workshop</option>
            <option value="meetup">Meetup</option>
            <option value="concert">Hòa nh?c</option>
            <option value="exhibition">Tri?n lãm</option>
            <option value="other">Khác</option>
          </Select>
          <Button colorScheme="teal" size="lg" px={10}>
            Tìm ki?m
          </Button>
        </Flex>
      </Box>
      {/* Events Section */}
      <Box mb={10}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">S? ki?n s?p di?n ra</Heading>
          <Button as={Link} to="/events" variant="outline" colorScheme="teal">
            Xem t?t c?
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
          <Heading>B?n mu?n t? ch?c s? ki?n?</Heading>
          <Text fontSize="lg" maxW="container.md">
            EventHub cung c?p n?n t?ng qu?n lý s? ki?n toàn di?n, giúp b?n d? dàng t?o và qu?n lý
            s? ki?n c?a mình.
          </Text>
          <Button size="lg" colorScheme="teal">
            T?o s? ki?n ngay
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};
export default Home;
