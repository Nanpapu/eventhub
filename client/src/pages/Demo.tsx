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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaShoppingCart,
  FaListAlt,
  FaUsers,
} from "react-icons/fa";

/**
 * Trang Demo - Giúp người dùng dễ dàng test các luồng chính của hệ thống
 * Trang này sẽ bị xóa khi tích hợp BE thực tế
 */
export default function Demo() {
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Danh sách sự kiện demo
  const demoEvents = [
    {
      id: "1",
      title: "Tech Conference 2023",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      price: 49.99,
      description: "Sự kiện công nghệ lớn nhất năm 2023",
      type: "paid",
    },
    {
      id: "2",
      title: "Workshop Thiết kế UX/UI",
      imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692",
      price: 29.99,
      description: "Học thiết kế giao diện người dùng hiệu quả",
      type: "paid",
    },
    {
      id: "3",
      title: "Hội thảo Khởi nghiệp",
      imageUrl: "https://images.unsplash.com/photo-1559223607-a43c990c692c",
      price: 0,
      description: "Sự kiện miễn phí cho những người mới khởi nghiệp",
      type: "free",
    },
  ];

  const goToEventDetail = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  const goToEventCheckout = (eventId: string) => {
    navigate(`/events/${eventId}/checkout`);
  };

  const goToMyTickets = () => {
    navigate("/my-tickets");
  };

  const loginAsUser = () => {
    // Bạn cần thêm hàm này vào useAuth context
    toast({
      title: "Đã đăng nhập",
      description: "Đã đăng nhập với vai trò người dùng",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const loginAsOrganizer = () => {
    // Bạn cần thêm hàm này vào useAuth context
    toast({
      title: "Đã đăng nhập",
      description: "Đã đăng nhập với vai trò người tổ chức",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl">Trang Demo EventHub</Heading>
          <Text mt={2} color="gray.600">
            Sử dụng trang này để dễ dàng test các tính năng chính của hệ thống
          </Text>
        </Box>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>
            1. Đăng nhập nhanh
          </Heading>
          <HStack spacing={4}>
            <Button colorScheme="blue" onClick={loginAsUser}>
              Đăng nhập là Người dùng
            </Button>
            <Button colorScheme="orange" onClick={loginAsOrganizer}>
              Đăng nhập là Người tổ chức
            </Button>
          </HStack>
        </Box>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>
            2. Các sự kiện demo
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {demoEvents.map((event) => (
              <Card
                key={event.id}
                overflow="hidden"
                variant="outline"
                bg={bgColor}
                borderColor={borderColor}
              >
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  h="150px"
                  objectFit="cover"
                />
                <CardBody>
                  <Stack spacing={3}>
                    <Heading size="md">{event.title}</Heading>
                    <Text py={1}>{event.description}</Text>

                    <HStack>
                      <Badge
                        colorScheme={event.type === "free" ? "green" : "blue"}
                      >
                        {event.type === "free" ? "Miễn phí" : `$${event.price}`}
                      </Badge>
                    </HStack>

                    <HStack spacing={2} pt={2}>
                      <Button
                        flex={1}
                        variant="outline"
                        colorScheme="teal"
                        leftIcon={<FaListAlt />}
                        onClick={() => goToEventDetail(event.id)}
                      >
                        Chi tiết
                      </Button>
                      <Button
                        flex={1}
                        colorScheme="teal"
                        leftIcon={<FaShoppingCart />}
                        onClick={() => goToEventCheckout(event.id)}
                      >
                        Mua vé
                      </Button>
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        <Divider />

        <Box>
          <Heading size="md" mb={4}>
            3. Các trang quản lý
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Button
              size="lg"
              height="100px"
              leftIcon={<FaTicketAlt size={24} />}
              colorScheme="purple"
              onClick={goToMyTickets}
            >
              Vé của tôi
            </Button>
            <Button
              size="lg"
              height="100px"
              leftIcon={<FaUsers size={24} />}
              colorScheme="cyan"
              onClick={() => navigate("/my-events")}
            >
              Sự kiện của tôi
            </Button>
            <Button
              size="lg"
              height="100px"
              leftIcon={<FaListAlt size={24} />}
              colorScheme="orange"
              onClick={() => navigate("/notifications")}
            >
              Thông báo
            </Button>
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
}
