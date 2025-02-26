import {
  Box,
  Image,
  Heading,
  Text,
  Flex,
  Button,
  Badge,
} from "@chakra-ui/react";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";

// Định nghĩa kiểu dữ liệu cho sự kiện
export interface EventType {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  category: string;
  isPaid: boolean;
  price?: number;
}

interface EventCardProps {
  event: EventType;
}

/**
 * Component hiển thị thông tin tóm tắt của một sự kiện dưới dạng card
 * @param event - Thông tin sự kiện cần hiển thị
 */
export const EventCard = ({ event }: EventCardProps) => {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="transform 0.3s"
      _hover={{ transform: "translateY(-5px)" }}
      bg="white"
    >
      {/* Phần hình ảnh sự kiện */}
      <Box position="relative">
        <Image
          src={event.image}
          alt={event.title}
          height="200px"
          width="100%"
          objectFit="cover"
        />

        {/* Badge hiển thị loại sự kiện và thông tin giá */}
        <Box position="absolute" top={2} right={2} display="flex" gap={1}>
          <Badge
            colorScheme="teal"
            fontSize="xs"
            textTransform="capitalize"
            borderRadius="md"
            px={2}
            py={1}
          >
            {event.category}
          </Badge>
          <Badge
            colorScheme={event.isPaid ? "purple" : "green"}
            fontSize="xs"
            borderRadius="md"
            px={2}
            py={1}
          >
            {event.isPaid ? "Có phí" : "Miễn phí"}
          </Badge>
        </Box>
      </Box>

      {/* Phần nội dung thông tin */}
      <Box p={5}>
        {/* Tiêu đề sự kiện */}
        <Heading size="md" my={2} noOfLines={2}>
          {event.title}
        </Heading>

        {/* Mô tả ngắn */}
        <Text noOfLines={2} mb={3} fontSize="sm" color="gray.600">
          {event.description}
        </Text>

        {/* Thông tin thời gian */}
        <Flex align="center" color="gray.500" fontSize="sm" mb={2}>
          <FiCalendar />
          <Text ml={2}>{event.date}</Text>
        </Flex>

        {/* Thông tin địa điểm */}
        <Flex align="center" color="gray.500" fontSize="sm" mb={4}>
          <FiMapPin />
          <Text ml={2} noOfLines={1}>
            {event.location}
          </Text>
        </Flex>

        {/* Nút xem chi tiết */}
        <Button
          as={Link}
          to={`/events/${event.id}`}
          colorScheme="teal"
          width="full"
          size="sm"
          sx={{ textDecoration: "none" }}
        >
          Xem Chi Tiết
        </Button>
      </Box>
    </Box>
  );
};

export default EventCard;
