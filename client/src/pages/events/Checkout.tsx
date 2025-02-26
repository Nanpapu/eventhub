import { useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  HStack,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheck, FaTicketAlt, FaEnvelope } from "react-icons/fa";
import CheckoutForm from "../../components/checkout/CheckoutForm";

// Định nghĩa interface cho event
interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  price: number;
  organizer: string;
  availableTickets: number;
  maxPerOrder: number;
}

// Giả lập dữ liệu sự kiện (trong thực tế sẽ fetch từ API)
const mockEvents: EventData[] = [
  {
    id: "1",
    title: "Tech Conference 2023",
    date: "Dec 15, 2023",
    time: "09:00 AM - 05:00 PM",
    location: "Convention Center, New York",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format",
    price: 49.99,
    organizer: "TechEvents Inc.",
    availableTickets: 122,
    maxPerOrder: 10,
  },
  {
    id: "2",
    title: "JavaScript Workshop",
    date: "Nov 20, 2023",
    time: "10:00 AM - 04:00 PM",
    location: "Online Event",
    imageUrl:
      "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?w=500&auto=format",
    price: 29.99,
    organizer: "Coding Academy",
    availableTickets: 43,
    maxPerOrder: 3,
  },
  {
    id: "3",
    title: "Music Festival",
    date: "Aug 10, 2023",
    time: "11:00 AM - 11:00 PM",
    location: "Central Park, New York",
    imageUrl:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&auto=format",
    price: 89.99,
    organizer: "Music Events Co.",
    availableTickets: 378,
    maxPerOrder: 6,
  },
  {
    id: "4",
    title: "Data Science Meetup",
    date: "Sep 5, 2023",
    time: "06:00 PM - 09:00 PM",
    location: "Community Center, Boston",
    imageUrl:
      "https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=500&auto=format",
    price: 0,
    organizer: "Data Science Hub",
    availableTickets: 65,
    maxPerOrder: 2,
  },
  {
    id: "5",
    title: "Business Networking Event",
    date: "Dec 28, 2023",
    time: "07:00 PM - 10:00 PM",
    location: "Grand Hotel, Chicago",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&auto=format",
    price: 79.99,
    organizer: "Business Network Association",
    availableTickets: 87,
    maxPerOrder: 4,
  },
];

// Các bước trong quy trình thanh toán
const steps = [
  { title: "Chọn vé", description: "Số lượng vé" },
  { title: "Thanh toán", description: "Thông tin thanh toán" },
  { title: "Xác nhận", description: "Xác nhận vé" },
];

/**
 * Trang thanh toán cho việc mua vé sự kiện
 * Quy trình 3 bước: chọn vé, thanh toán, xác nhận
 */
export default function Checkout() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [event, setEvent] = useState<EventData | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Giả lập fetch dữ liệu sự kiện
  useEffect(() => {
    setIsLoading(true);
    // Trong thực tế, đây sẽ là một API call
    setTimeout(() => {
      const foundEvent = mockEvents.find((e) => e.id === eventId);
      if (foundEvent) {
        setEvent(foundEvent);
      }
      setIsLoading(false);
    }, 1000);
  }, [eventId]);

  // Xử lý khi bấm tiếp tục ở bước 1
  const handleContinueToPayment = () => {
    if (ticketQuantity < 1) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất 1 vé",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (event && ticketQuantity > event.availableTickets) {
      toast({
        title: "Lỗi",
        description: `Chỉ còn ${event.availableTickets} vé có sẵn`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (event && ticketQuantity > event.maxPerOrder) {
      toast({
        title: "Giới hạn đặt vé",
        description: `Tối đa ${event.maxPerOrder} vé mỗi lần đặt`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setActiveStep(1);
  };

  // Xử lý khi thanh toán thành công
  const handlePaymentSuccess = (paymentId: string) => {
    setTransactionId(paymentId);
    setActiveStep(2);
  };

  // Xử lý khi hủy thanh toán
  const handlePaymentCancel = () => {
    setActiveStep(0);
  };

  // Xử lý khi hoàn tất thanh toán
  const handleFinish = () => {
    toast({
      title: "Đặt vé thành công!",
      description: "Thông tin vé đã được gửi đến email của bạn",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    navigate(`/my-tickets`);
  };

  // Xử lý khi quay lại trang sự kiện
  const handleBackToEvent = () => {
    navigate(`/events/${eventId}`);
  };

  if (isLoading) {
    return (
      <Container maxW="4xl" py={8} centerContent>
        <Text>Đang tải thông tin thanh toán...</Text>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertTitle>Sự kiện không tồn tại!</AlertTitle>
          <AlertDescription>
            Không tìm thấy thông tin sự kiện bạn đang tìm kiếm.
          </AlertDescription>
        </Alert>
        <Button mt={4} onClick={() => navigate("/events")}>
          Quay lại danh sách sự kiện
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl" textAlign="center">
          Đặt vé sự kiện
        </Heading>

        <Stepper
          index={activeStep}
          colorScheme="teal"
          size="lg"
          px={{ base: 2, md: 8 }}
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink={0}>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>

        <Box mt={8}>
          {activeStep === 0 && (
            <VStack
              spacing={6}
              align="stretch"
              bg={bgColor}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              boxShadow="md"
            >
              <Heading size="md">Chọn số lượng vé</Heading>

              <HStack spacing={4} py={4}>
                <Text fontWeight="medium">Sự kiện:</Text>
                <Text>{event.title}</Text>
              </HStack>

              <HStack spacing={4}>
                <Text fontWeight="medium">Thời gian:</Text>
                <Text>
                  {event.date} • {event.time}
                </Text>
              </HStack>

              <HStack spacing={4}>
                <Text fontWeight="medium">Địa điểm:</Text>
                <Text>{event.location}</Text>
              </HStack>

              <HStack spacing={4}>
                <Text fontWeight="medium">Giá vé:</Text>
                <Text>
                  {event.price === 0
                    ? "Miễn phí"
                    : `$${event.price.toFixed(2)}`}
                </Text>
              </HStack>

              <HStack spacing={4}>
                <Text fontWeight="medium">Vé còn lại:</Text>
                <Text>{event.availableTickets}</Text>
              </HStack>

              <Divider my={2} />

              <Flex align="center" justify="space-between">
                <Text fontWeight="medium">Số lượng vé:</Text>
                <NumberInput
                  maxW={32}
                  min={1}
                  max={Math.min(event.availableTickets, event.maxPerOrder)}
                  value={ticketQuantity}
                  onChange={(valueString) =>
                    setTicketQuantity(parseInt(valueString))
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>

              <Divider my={2} />

              <Flex justify="space-between" fontWeight="bold">
                <Text>Tổng cộng:</Text>
                <Text>${(event.price * ticketQuantity).toFixed(2)}</Text>
              </Flex>

              <HStack spacing={4} justify="flex-end" pt={4}>
                <Button variant="outline" onClick={handleBackToEvent}>
                  Quay lại
                </Button>
                <Button
                  colorScheme="teal"
                  rightIcon={<FaTicketAlt />}
                  onClick={handleContinueToPayment}
                >
                  Tiếp tục
                </Button>
              </HStack>
            </VStack>
          )}

          {activeStep === 1 && (
            <CheckoutForm
              event={event}
              ticketQuantity={ticketQuantity}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          )}

          {activeStep === 2 && (
            <VStack
              spacing={6}
              align="stretch"
              bg="green.50"
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="green.200"
              boxShadow="md"
            >
              <Box textAlign="center">
                <Box
                  mx="auto"
                  mb={4}
                  bg="green.100"
                  color="green.700"
                  w="80px"
                  h="80px"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FaCheck size={40} />
                </Box>

                <Heading size="lg" color="green.700" mb={2}>
                  Đặt vé thành công!
                </Heading>

                <Text color="green.600" mb={4}>
                  Cảm ơn bạn đã đặt vé! Thông tin chi tiết đã được gửi đến email
                  của bạn.
                </Text>
              </Box>

              <Box bg="white" p={4} borderRadius="md" boxShadow="sm">
                <Heading size="md" mb={4}>
                  Thông tin vé
                </Heading>

                <VStack spacing={3} align="stretch">
                  <HStack>
                    <Text fontWeight="medium" width="40%">
                      Sự kiện:
                    </Text>
                    <Text>{event.title}</Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="medium" width="40%">
                      Số lượng vé:
                    </Text>
                    <Text>{ticketQuantity}</Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="medium" width="40%">
                      Mã giao dịch:
                    </Text>
                    <Text>{transactionId}</Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="medium" width="40%">
                      Thời gian:
                    </Text>
                    <Text>
                      {event.date} • {event.time}
                    </Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="medium" width="40%">
                      Địa điểm:
                    </Text>
                    <Text>{event.location}</Text>
                  </HStack>
                </VStack>
              </Box>

              <HStack spacing={4} justify="center" pt={4}>
                <Button
                  leftIcon={<FaEnvelope />}
                  onClick={() =>
                    toast({
                      title: "Đã gửi lại email xác nhận",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    })
                  }
                >
                  Gửi lại email
                </Button>

                <Button
                  colorScheme="teal"
                  rightIcon={<FaTicketAlt />}
                  onClick={handleFinish}
                >
                  Xem vé của tôi
                </Button>
              </HStack>
            </VStack>
          )}
        </Box>
      </VStack>
    </Container>
  );
}
