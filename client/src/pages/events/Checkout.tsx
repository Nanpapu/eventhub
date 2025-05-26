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
  Badge,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheck, FaTicketAlt, FaEnvelope } from "react-icons/fa";
import CheckoutForm from "../../components/checkout/CheckoutForm";
import { CurrencyDisplay } from "../../components/common";
import eventService from "../../services/event.service";
import { useAppSelector } from "../../app/hooks";
import { selectIsAuthenticated } from "../../app/features/authSlice";

// Định nghĩa interface cho event
interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  price: number; // Giá mặc định nếu không có ticketTypes
  organizer: string;
  availableTickets: number; // Tổng số vé còn lại (fallback nếu không có ticketTypes)
  maxPerOrder: number; // Số lượng tối đa mỗi đơn hàng (chung)
  ticketTypes?: {
    id: string;
    name: string;
    price: number;
    availableQuantity: number;
    // maxPerOrder?: number; // Có thể thêm maxPerOrder cho từng loại vé nếu cần
  }[];
}

// Interface cho trạng thái vé người dùng
interface UserTicketStatus {
  success: boolean;
  ticketCount: number; // Số lượng vé đã mua
  hasFreeTicker: boolean; // Đã có vé miễn phí hay chưa
}

/**
 * Trang thanh toán cho việc mua vé sự kiện
 * Quy trình 3 bước: chọn vé, thanh toán, xác nhận
 */
export default function Checkout() {
  const { eventId } = useParams<{ eventId: string }>();
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
  const [error, setError] = useState<string | null>(null);

  // Thêm state cho trạng thái vé người dùng
  const [userTicketStatus, setUserTicketStatus] =
    useState<UserTicketStatus | null>(null);

  // Kiểm tra người dùng đã đăng nhập chưa
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

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

  // Màu cho ticket type selection
  const selectedTicketBorderColor = useColorModeValue("teal.500", "teal.300");
  const selectedTicketBgColor = useColorModeValue("teal.50", "teal.900");
  const ticketAvailableTextColor = useColorModeValue("gray.500", "gray.400");

  // Tải dữ liệu sự kiện từ API
  useEffect(() => {
    const fetchEventData = async () => {
      console.log(
        "[Checkout.tsx] Attempting to fetch event with ID from URL params:",
        eventId
      );

      if (!eventId) {
        console.error("[Checkout.tsx] No eventId found in URL params.");
        setError("Không tìm thấy mã sự kiện trong đường dẫn.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await eventService.getEventById(eventId);
        console.log("[Checkout.tsx] API response for event:", data);

        if (data) {
          const formattedData: EventData = {
            ...data,
            date: data.date
              ? new Date(data.date).toLocaleDateString("vi-VN")
              : "N/A",
            maxPerOrder: data.maxTicketsPerPerson || 3,
          };
          setEvent(formattedData);
          if (
            formattedData.ticketTypes &&
            formattedData.ticketTypes.length > 0
          ) {
            setSelectedTicketType(formattedData.ticketTypes[0].id);
            setTicketQuantity(1);
          } else {
            setTicketQuantity(1);
          }

          // Kiểm tra trạng thái vé người dùng nếu đã đăng nhập
          if (isAuthenticated) {
            try {
              const ticketStatus = await eventService.getUserTicketStatus(
                eventId
              );
              console.log("[Checkout.tsx] User ticket status:", ticketStatus);
              setUserTicketStatus(ticketStatus);

              // Nếu sự kiện miễn phí và người dùng đã có vé miễn phí, hiển thị thông báo
              const currentTicketPrice =
                formattedData.ticketTypes?.find(
                  (t) => t.id === formattedData.ticketTypes?.[0].id
                )?.price ?? formattedData.price;

              if (currentTicketPrice === 0 && ticketStatus.hasFreeTicker) {
                toast({
                  title: "Thông báo",
                  description:
                    "Bạn đã đăng ký vé miễn phí cho sự kiện này rồi.",
                  status: "warning",
                  duration: 5000,
                  isClosable: true,
                });
              }
            } catch (err) {
              console.error(
                "[Checkout.tsx] Error fetching user ticket status:",
                err
              );
              // Không hiển thị lỗi này cho người dùng, chỉ log
            }
          }
        } else {
          console.error(
            "[Checkout.tsx] Event not found by API, eventId:",
            eventId
          );
          setError("Sự kiện không tồn tại hoặc đã bị xóa.");
        }
      } catch (err: unknown) {
        console.error("[Checkout.tsx] Error fetching event:", err);
        let message = "Có lỗi xảy ra khi tải thông tin sự kiện.";
        if (typeof err === "object" && err !== null && "response" in err) {
          const axiosError = err as {
            response?: { data?: { message?: string } };
          };
          if (axiosError.response?.data?.message) {
            message = axiosError.response.data.message;
          }
        } else if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, isAuthenticated, toast]);

  // Tính toán số lượng vé tối đa có thể mua
  const currentSelectedTicketInfo = event?.ticketTypes?.find(
    (t) => t.id === selectedTicketType
  );
  const maxTicketsAvailableForOrder = currentSelectedTicketInfo
    ? currentSelectedTicketInfo.availableQuantity
    : event?.availableTickets || 0;

  // Giới hạn chung của sự kiện cho mỗi đơn hàng
  const eventMaxPerOrder = event?.maxPerOrder || Infinity; // Nếu không có thì coi như vô hạn

  // Số lượng tối đa thực tế người dùng có thể chọn cho NumberInput
  const maxAllowedForInput = Math.max(
    0,
    Math.min(maxTicketsAvailableForOrder, eventMaxPerOrder)
  );

  // Thêm biến kiểm tra đã đạt giới hạn vé
  const hasReachedTicketLimit =
    isAuthenticated &&
    userTicketStatus &&
    event &&
    typeof userTicketStatus.ticketCount === "number" &&
    event.maxPerOrder > 0 &&
    userTicketStatus.ticketCount >= event.maxPerOrder;

  // Xử lý khi thay đổi loại vé
  const handleTicketTypeChange = (newTicketTypeId: string) => {
    console.log(
      "[Checkout.tsx] handleTicketTypeChange - newTicketTypeId:",
      newTicketTypeId
    );
    setSelectedTicketType(newTicketTypeId);
    // Tìm thông tin của loại vé mới
    const newTypeInfo = event?.ticketTypes?.find(
      (t) => t.id === newTicketTypeId
    );
    const newMaxAvailable = newTypeInfo
      ? newTypeInfo.availableQuantity
      : event?.availableTickets || 0;
    const newMaxAllowed = Math.max(
      0,
      Math.min(newMaxAvailable, eventMaxPerOrder)
    );

    // Bỏ kiểm tra vé miễn phí ở đây

    if (ticketQuantity > newMaxAllowed || newMaxAllowed === 0) {
      setTicketQuantity(newMaxAllowed > 0 ? 1 : 0);
    } else if (ticketQuantity === 0 && newMaxAllowed > 0) {
      setTicketQuantity(1);
    }

    // Bỏ giới hạn số lượng vé miễn phí
  };

  // Kiểm tra khi thay đổi số lượng vé
  const handleTicketQuantityChange = (
    valueAsString: string,
    valueAsNumber: number
  ) => {
    // Loại bỏ kiểm tra vé miễn phí - cho phép mua nhiều vé miễn phí
    setTicketQuantity(valueAsNumber);
  };

  // Xử lý khi bấm tiếp tục ở bước 1
  const handleContinueToPayment = () => {
    if (!event) return;
    console.log(
      "[Checkout.tsx] handleContinueToPayment - selectedTicketType:",
      selectedTicketType
    ); // DEBUG

    // Đảm bảo giá vé luôn là số, mặc định là 0 nếu undefined
    const currentTicketPrice =
      currentSelectedTicketInfo?.price ?? event.price ?? 0;

    // Dù giá vé đã được đảm bảo là số, nhưng vẫn giữ lại kiểm tra này để an toàn
    if (currentTicketPrice === undefined) {
      toast({
        title: "Lỗi",
        description: "Không thể xác định giá vé.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Nếu sự kiện có nhiều loại vé, phải chọn 1 loại vé
    if (
      event.ticketTypes &&
      event.ticketTypes.length > 0 &&
      !selectedTicketType
    ) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn loại vé",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (ticketQuantity < 1 && maxAllowedForInput > 0) {
      // Chỉ báo lỗi nếu có thể mua được vé
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất 1 vé",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (maxAllowedForInput === 0 && ticketQuantity > 0) {
      toast({
        title: "Thông báo",
        description: "Loại vé này đã hết hoặc không có sẵn.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (ticketQuantity === 0 && maxAllowedForInput > 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn số lượng vé.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (ticketQuantity > maxTicketsAvailableForOrder) {
      toast({
        title: "Lỗi",
        description: `Không đủ vé (chỉ còn ${maxTicketsAvailableForOrder} vé)`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (ticketQuantity > eventMaxPerOrder) {
      toast({
        title: "Vượt quá giới hạn vé",
        description: `Tối đa ${eventMaxPerOrder} vé mỗi đơn hàng`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Kiểm tra giới hạn tổng số vé người dùng đã mua
    if (isAuthenticated && userTicketStatus && event.maxPerOrder) {
      const ticketCount = userTicketStatus.ticketCount || 0; // Đảm bảo có giá trị mặc định nếu undefined
      if (ticketCount + ticketQuantity > event.maxPerOrder) {
        toast({
          title: "Vượt quá giới hạn vé",
          description: `Bạn chỉ có thể mua tối đa ${event.maxPerOrder} vé cho sự kiện này. Bạn đã mua ${ticketCount} vé.`,
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
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
    navigate(`/user/tickets`);
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

  if (error || !event) {
    return (
      <Container maxW="4xl" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <AlertTitle>
            {error ? "Có lỗi xảy ra" : "Không tìm thấy sự kiện"}
          </AlertTitle>
          <AlertDescription>
            {error || "Sự kiện này không tồn tại hoặc đã bị xóa."}
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
              <Flex justify="space-between" align="center" mb={2}>
                <Heading size="md" color={textColor}>
                  Chọn số lượng vé
                </Heading>

                {/* Kiểm tra đã đạt giới hạn vé */}
                {hasReachedTicketLimit && (
                  <Badge colorScheme="red" py={1} px={2} borderRadius="md">
                    Đã đạt giới hạn vé
                  </Badge>
                )}
              </Flex>

              {/* Hiển thị thông báo về giới hạn vé */}
              {isAuthenticated && userTicketStatus && event.maxPerOrder > 0 && (
                <Alert
                  status={
                    userTicketStatus?.ticketCount &&
                    userTicketStatus?.ticketCount >= event.maxPerOrder
                      ? "error"
                      : "info"
                  }
                  borderRadius="md"
                  mb={4}
                >
                  <AlertIcon />
                  <Box>
                    {userTicketStatus?.ticketCount &&
                    userTicketStatus?.ticketCount >= event.maxPerOrder ? (
                      <>
                        <AlertTitle>Bạn đã đạt giới hạn vé</AlertTitle>
                        <AlertDescription>
                          Bạn đã mua {userTicketStatus?.ticketCount || 0} vé cho
                          sự kiện này. Mỗi người chỉ được mua tối đa{" "}
                          {event.maxPerOrder} vé.
                        </AlertDescription>
                      </>
                    ) : (
                      <>
                        <AlertTitle>Thông tin vé</AlertTitle>
                        <AlertDescription>
                          Bạn đã mua {userTicketStatus?.ticketCount || 0}/
                          {event.maxPerOrder} vé cho sự kiện này. Còn có thể mua
                          thêm{" "}
                          {event.maxPerOrder -
                            (userTicketStatus?.ticketCount || 0)}{" "}
                          vé.
                        </AlertDescription>
                      </>
                    )}
                  </Box>
                </Alert>
              )}

              {/* Nếu người dùng đã đăng nhập, hiển thị số vé đã mua */}
              {isAuthenticated &&
                userTicketStatus &&
                typeof userTicketStatus.ticketCount === "number" &&
                userTicketStatus.ticketCount > 0 &&
                event.maxPerOrder > 0 && (
                  <HStack spacing={4}>
                    <Text fontWeight="medium" color={textColor}>
                      Số vé đã mua:
                    </Text>
                    <Text color={textColor}>
                      {userTicketStatus.ticketCount}/{event.maxPerOrder}
                    </Text>
                  </HStack>
                )}

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

              {/* Hiển thị thông tin giá vé */}
              <HStack spacing={4}>
                <Text fontWeight="medium" color={textColor}>
                  Giá vé:
                </Text>
                <Text as="span" color={textColor}>
                  {currentSelectedTicketInfo ? (
                    currentSelectedTicketInfo.price === 0 ? (
                      "Miễn phí"
                    ) : (
                      <CurrencyDisplay
                        amount={currentSelectedTicketInfo.price}
                      />
                    )
                  ) : event.price === 0 ? (
                    "Miễn phí"
                  ) : (
                    <CurrencyDisplay amount={event.price || 0} />
                  )}
                </Text>
              </HStack>

              <HStack spacing={4}>
                <Text fontWeight="medium" color={textColor}>
                  Số vé còn lại:
                </Text>
                <Text color={textColor}>{maxTicketsAvailableForOrder}</Text>
              </HStack>

              {/* Kiểm tra còn vé không */}
              {maxAllowedForInput === 0 && (
                <Alert status="warning" borderRadius="md" mb={2}>
                  <AlertIcon />
                  <AlertTitle>Loại vé này đã hết hoặc không có sẵn</AlertTitle>
                </Alert>
              )}

              {event.ticketTypes && event.ticketTypes.length > 0 && (
                <>
                  <Heading size="sm" color={textColor} mt={2}>
                    Chọn loại vé:
                  </Heading>
                  <VStack spacing={3} align="stretch">
                    {event.ticketTypes.map((ticket) => {
                      const isSelected = selectedTicketType === ticket.id;
                      console.log(
                        `[Checkout.tsx] Rendering ticket: ${ticket.name} (ID: ${ticket.id}), selectedTicketType: ${selectedTicketType}, isSelected: ${isSelected}`
                      ); // DEBUG
                      return (
                        <Box
                          key={ticket.id}
                          p={3}
                          borderWidth="1px"
                          borderRadius="md"
                          borderColor={
                            isSelected // Sử dụng biến isSelected đã check ở trên
                              ? selectedTicketBorderColor
                              : borderColor
                          }
                          bg={
                            isSelected // Sử dụng biến isSelected
                              ? selectedTicketBgColor
                              : "transparent"
                          }
                          cursor={
                            ticket.availableQuantity > 0
                              ? "pointer"
                              : "not-allowed"
                          }
                          opacity={ticket.availableQuantity > 0 ? 1 : 0.6}
                          onClick={() =>
                            ticket.availableQuantity > 0 &&
                            handleTicketTypeChange(ticket.id)
                          }
                        >
                          <Flex justify="space-between" align="center">
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="bold" color={textColor}>
                                {ticket.name}
                              </Text>
                              <Text
                                fontSize="sm"
                                color={
                                  ticket.availableQuantity > 0
                                    ? ticketAvailableTextColor
                                    : "red.400"
                                }
                              >
                                {ticket.availableQuantity > 0
                                  ? `Còn ${ticket.availableQuantity} vé`
                                  : "Hết vé"}
                              </Text>
                            </VStack>
                            <Text fontWeight="bold" color={textColor} as="span">
                              {ticket.price === 0 ? (
                                "Miễn phí"
                              ) : (
                                <CurrencyDisplay amount={ticket.price} />
                              )}
                            </Text>
                          </Flex>
                        </Box>
                      );
                    })}
                  </VStack>
                </>
              )}

              <Divider my={2} />

              <Flex align="center" justify="space-between">
                <Text fontWeight="medium" color={textColor}>
                  Số lượng vé:
                </Text>
                <NumberInput
                  maxW={32}
                  min={maxAllowedForInput > 0 ? 1 : 0}
                  max={maxAllowedForInput}
                  value={ticketQuantity}
                  onChange={handleTicketQuantityChange}
                  isDisabled={Boolean(
                    maxAllowedForInput === 0 || hasReachedTicketLimit
                  )}
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
                <Text>Tổng cộng:</Text>
                <Text as="span">
                  {currentSelectedTicketInfo?.price === 0 ||
                  (!currentSelectedTicketInfo && event.price === 0) ? (
                    "Miễn phí"
                  ) : (
                    <CurrencyDisplay
                      amount={
                        (currentSelectedTicketInfo?.price ?? event.price ?? 0) *
                        ticketQuantity
                      }
                    />
                  )}
                </Text>
              </Flex>

              <HStack spacing={4} justify="flex-end" pt={4}>
                <Button variant="outline" onClick={handleBackToEvent}>
                  Quay lại
                </Button>
                <Button
                  colorScheme="teal"
                  rightIcon={<FaTicketAlt />}
                  onClick={handleContinueToPayment}
                  isDisabled={Boolean(
                    isLoading ||
                      (maxAllowedForInput === 0 && ticketQuantity === 0) ||
                      hasReachedTicketLimit
                  )}
                >
                  Tiếp tục
                </Button>
              </HStack>
            </VStack>
          )}

          {activeStep === 1 && event && (
            <CheckoutForm
              event={event}
              ticketQuantity={ticketQuantity}
              selectedTicketTypeId={selectedTicketType}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          )}

          {activeStep === 2 && event && (
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
                  Đặt vé thành công
                </Heading>

                <Text color={successIconColor} mb={4}>
                  Cảm ơn bạn đã đặt vé!
                </Text>
              </Box>

              <Box bg={confirmBoxBg} p={4} borderRadius="md" boxShadow="sm">
                <Heading size="md" mb={4} color={textColor}>
                  Thông tin vé
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
                      Số lượng vé:
                    </Text>
                    <Text color={textColor}>{ticketQuantity}</Text>
                  </HStack>

                  <HStack>
                    <Text fontWeight="medium" width="40%" color={textColor}>
                      Mã giao dịch:
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
                      title: "Email xác nhận đã được gửi lại",
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
