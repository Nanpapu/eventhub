import {
  Box,
  Badge,
  Flex,
  Heading,
  Icon,
  Image,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiTag } from "react-icons/fi";
import { memo } from "react";
import { getCategoryName } from "../../utils/categoryUtils"; // Đường dẫn này giả định utils nằm cùng cấp với components

// Định nghĩa interface cho props của EventCard
export interface EventCardData {
  id: string;
  title: string;
  description: string;
  date: string; // Nên là chuỗi đã được format sẵn
  location: string;
  imageUrl: string;
  category: string; // ID của category
  isPaid: boolean;
  // address?: string; // Hiện tại không được sử dụng trong JSX của card
}

interface EventCardProps {
  event: EventCardData;
}

const EventCardComponent: React.FC<EventCardProps> = ({ event }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const cardHoverBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const tagBg = useColorModeValue("teal.50", "teal.900");
  const tagColor = useColorModeValue("teal.600", "teal.200");
  const locationColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box
      as={Link}
      to={`/events/${event.id}`}
      borderRadius="lg"
      overflow="hidden"
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "lg",
        bg: cardHoverBg,
      }}
      transition="all 0.3s"
      sx={{ textDecoration: "none" }} // Đảm bảo Link không có gạch chân
      display="flex" // Thêm để đảm bảo chiều cao đồng nhất nếu nội dung khác nhau
      flexDirection="column" // Sắp xếp nội dung theo cột
    >
      <Box position="relative">
        <Image
          src={event.imageUrl}
          alt={event.title}
          width="100%"
          height="180px"
          objectFit="cover"
          fallbackSrc="/images/default-event-image.png"
        />
        <Box position="absolute" top={2} right={2}>
          {event.isPaid ? (
            <Badge colorScheme="blue" py={1} px={2} borderRadius="md">
              Trả phí
            </Badge>
          ) : (
            <Badge colorScheme="green" py={1} px={2} borderRadius="md">
              Miễn phí
            </Badge>
          )}
        </Box>
      </Box>

      <Box p={4} flexGrow={1} display="flex" flexDirection="column">
        {" "}
        {/* Thêm flexGrow và display flex để nội dung co giãn */}
        <Tag
          size="sm"
          bg={tagBg}
          color={tagColor}
          mb={2}
          borderRadius="full"
          alignSelf="flex-start"
        >
          <Icon as={FiTag} mr={1} />
          {getCategoryName(event.category)}
        </Tag>
        <Heading as="h3" size="md" mb={2} noOfLines={2} flexShrink={0}>
          {" "}
          {/* Ngăn Heading co lại */}
          {event.title}
        </Heading>
        <Text fontSize="sm" color={textColor} mb={3} noOfLines={2} flexGrow={1}>
          {" "}
          {/* Cho phép Text co giãn */}
          {event.description}
        </Text>
        <Box mt="auto">
          {" "}
          {/* Đẩy phần date và location xuống dưới cùng */}
          <Flex fontSize="sm" color={locationColor} align="center" mb={2}>
            <Icon as={FiCalendar} mr={2} />
            <Text>{event.date}</Text>
          </Flex>
          <Flex fontSize="sm" color={locationColor} align="center">
            <Icon as={FiMapPin} mr={2} />
            <Text>{event.location}</Text>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export const EventCard = memo(EventCardComponent);
