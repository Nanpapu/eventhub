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
import { useTranslation } from "react-i18next";
import { CurrencyDisplay } from "../../components/common";

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
  ticketTypes?: {
    id: string;
    name: string;
    price: number;
    availableQuantity: number;
  }[];
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
    ticketTypes: [
      {
        id: "early-bird",
        name: "Early Bird",
        price: 29.99,
        availableQuantity: 22,
      },
      {
        id: "standard",
        name: "Standard",
        price: 49.99,
        availableQuantity: 80,
      },
      {
        id: "vip",
        name: "VIP",
        price: 99.99,
        availableQuantity: 20,
      },
    ],
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
    ticketTypes: [
      {
        id: "standard",
        name: "Standard",
        price: 29.99,
        availableQuantity: 30,
      },
      {
        id: "premium",
        name: "Premium (includes code review)",
        price: 49.99,
        availableQuantity: 13,
      },
    ],
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

/**
 * Trang thanh toán cho việc mua vé sự kiện
 * Quy trình 3 bước: chọn vé, thanh toán, xác nhận
 */
export default function Checkout() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [event, setEvent] = useState<EventData | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(
    null
  );
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Các bước trong quy trình thanh toán
  const steps = [
    {
      title: "Chọn vé",
      description: "Số lượng vé",
    },
    {
      title: "Thanh toán",
      description: "Thông tin thanh toán",
    },
    {
      title: "Xác nhận",
      description: "Xác nhận vé",
    },
  ];

  // Màu sắc theo theme
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const successBg = useColorModeValue("green.50", "green.900");
  const successBorderColor = useColorModeValue("green.200", "green.700");
  const successIconBg = useColorModeValue("green.100", "green.800");
  const successIconColor = useColorModeValue("green.700", "green.200");
  const confirmBoxBg = useColorModeValue("white", "gray.700");

  // Tải dữ liệu sự kiện
  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      // Giả lập gọi API để lấy dữ liệu
      setTimeout(() => {
        const foundEvent = mockEvents.find((e) => e.id === eventId);
        if (foundEvent) {
          setEvent(foundEvent);
          // Tự động chọn loại vé đầu tiên nếu có
          if (foundEvent.ticketTypes && foundEvent.ticketTypes.length > 0) {
            setSelectedTicketType(foundEvent.ticketTypes[0].id);
          }
        }
        setIsLoading(false);
      }, 800);
    };

    fetchEvent();
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
        description: `Không đủ vé (chỉ còn ${event.availableTickets} vé)`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (event && ticketQuantity > event.maxPerOrder) {
      toast({
        title: "Vượt quá giới hạn vé",
        description: `Tối đa ${event.maxPerOrder} vé mỗi đơn hàng`,
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
      title: "Thanh toán thành công",
      description: "Email xác nhận đã được gửi đến hòm thư của bạn",
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
        <Text color={textColor}>Đang tải...</Text>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertTitle>Không tìm thấy sự kiện</AlertTitle>
          <AlertDescription>
            Sự kiện này không tồn tại hoặc đã bị xóa
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
        <Heading size="xl" textAlign="center" color={textColor}>
          Thanh toán
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
              <Heading size="md" color={textColor}>
                Chọn số lượng vé
              </Heading>

              <HStack spacing={4} py={4}>
                <Text fontWeight="medium" color={textColor}>
                  Sự kiện:
                </Text>
                <Text color={textColor}>{event.title}</Text>
              </HStack>

              <HStack spacing={4}>
                <Text fontWeight="medium" color={textColor}>
                  Thời gian:
                </Text>
                <Text color={textColor}>
                  {event.date} • {event.time}
                </Text>
              </HStack>

              <HStack spacing={4}>
                <Text fontWeight="medium" color={textColor}>
                  Địa điểm:
                </Text>
                <Text color={textColor}>{event.location}</Text>
              </HStack>

              <HStack spacing={4}>
                <Text fontWeight="medium" color={textColor}>
                  Giá vé:
                </Text>
                <Text color={textColor}>
                  {event.ticketTypes && selectedTicketType ? (
                    <>
                      {event.ticketTypes.find(
                        (t) => t.id === selectedTicketType
                      )?.price === 0 ? (
                        "Miễn phí"
                      ) : (
                        <CurrencyDisplay
                          amount={
                            event.ticketTypes.find(
                              (t) => t.id === selectedTicketType
                            )?.price || 0
                          }
                        />
                      )}
                    </>
                  ) : (
                    <>
                      {event.price === 0 ? (
                        "Miễn phí"
                      ) : (
                        <CurrencyDisplay amount={event.price} />
                      )}
                    </>
                  )}
                </Text>
              </HStack>

              <HStack spacing={4}>
                <Text fontWeight="medium" color={textColor}>
                  Số vé còn lại:
                </Text>
                <Text color={textColor}>
                  {event.ticketTypes && selectedTicketType
                    ? event.ticketTypes.find((t) => t.id === selectedTicketType)
                        ?.availableQuantity || 0
                    : event.availableTickets}
                </Text>
              </HStack>

              {event.ticketTypes && event.ticketTypes.length > 0 && (
                <>
                  <Heading size="sm" color={textColor} mt={2}>
                    Chọn loại vé:
                  </Heading>
                  <VStack spacing={3} align="stretch">
                    {event.ticketTypes.map((ticket) => (
                      <Box
                        key={ticket.id}
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor={
                          selectedTicketType === ticket.id
                            ? "teal.500"
                            : borderColor
                        }
                        bg={
                          selectedTicketType === ticket.id
                            ? "teal.50"
                            : "transparent"
                        }
                        cursor="pointer"
                        onClick={() => setSelectedTicketType(ticket.id)}
                      >
                        <Flex justify="space-between" align="center">
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold" color={textColor}>
                              {ticket.name}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              Còn {ticket.availableQuantity} vé
                            </Text>
                          </VStack>
                          <Text fontWeight="bold" color={textColor}>
                            {ticket.price === 0 ? (
                              "Miễn phí"
                            ) : (
                              <CurrencyDisplay amount={ticket.price} />
                            )}
                          </Text>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                </>
              )}

              <Divider my={2} />

              <Flex align="center" justify="space-between">
                <Text fontWeight="medium" color={textColor}>
                  {t("checkout.ticketQuantity")}:
                </Text>
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

              <Flex justify="space-between" fontWeight="bold" color={textColor}>
                <Text>{t("checkout.total")}:</Text>
                <CurrencyDisplay amount={event.price * ticketQuantity} />
              </Flex>

              <HStack spacing={4} justify="flex-end" pt={4}>
                <Button variant="outline" onClick={handleBackToEvent}>
                  {t("common.back")}
                </Button>
                <Button
                  colorScheme="teal"
                  rightIcon={<FaTicketAlt />}
                  onClick={handleContinueToPayment}
                >
                  {t("common.continue")}
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
              bg={successBg}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={successBorderColor}
              boxShadow="md"
            >
              <Box textAlign="center">
                <Box
                  mx="auto"
                  mb={4}
                  bg={successIconBg}
                  color={successIconColor}
                  w="80px"
                  h="80px"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FaCheck size={40} />
                </Box>

                <Heading size="lg" color={successIconColor} mb={2}>
                  {t("checkout.success.title")}
                </Heading>

                <Text color={successIconColor} mb={4}>
                  {t("checkout.success.thankYou")}
                </Text>
              </Box>

              <Box bg={confirmBoxBg} p={4} borderRadius="md" boxShadow="sm">
                <Heading size="md" mb={4} color={textColor}>
                  {t("checkout.ticketInfo")}
                </Heading>

                <VStack spacing={3} align="stretch">
                  <HStack>
                    <Text fontWeight="medium" width="40%" color={textColor}>
                      Sự kiện:
                    </Text>
                    <Text color={textColor}>{event.title}</Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="medium" width="40%" color={textColor}>
                      {t("checkout.ticketQuantity")}:
                    </Text>
                    <Text color={textColor}>{ticketQuantity}</Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="medium" width="40%" color={textColor}>
                      {t("checkout.transactionId")}:
                    </Text>
                    <Text color={textColor}>{transactionId}</Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="medium" width="40%" color={textColor}>
                      Thời gian:
                    </Text>
                    <Text color={textColor}>
                      {event.date} • {event.time}
                    </Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="medium" width="40%" color={textColor}>
                      Địa điểm:
                    </Text>
                    <Text color={textColor}>{event.location}</Text>
                  </HStack>
                </VStack>
              </Box>

              <HStack spacing={4} justify="center" pt={4}>
                <Button
                  leftIcon={<FaEnvelope />}
                  onClick={() =>
                    toast({
                      title: t("checkout.success.emailResent"),
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    })
                  }
                >
                  {t("checkout.resendEmail")}
                </Button>

                <Button
                  colorScheme="teal"
                  rightIcon={<FaTicketAlt />}
                  onClick={handleFinish}
                >
                  {t("checkout.viewMyTickets")}
                </Button>
              </HStack>
            </VStack>
          )}
        </Box>
      </VStack>
    </Container>
  );
}
