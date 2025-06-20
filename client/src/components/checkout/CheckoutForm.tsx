import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Divider,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  useToast,
  FormErrorMessage,
  Flex,
  useColorModeValue,
  Image,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FaSpinner,
  FaCreditCard,
  FaUniversity,
  FaMoneyCheckAlt,
  FaWallet,
} from "react-icons/fa";
import checkoutService from "../../services/checkout.service";
import { useAppSelector } from "../../app/hooks";
import {
  selectUser,
  selectIsAuthenticated,
} from "../../app/features/authSlice";

interface CheckoutFormProps {
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    imageUrl: string;
    price: number;
    organizer: string;
    ticketTypes?: {
      id: string;
      name: string;
      price: number;
      availableQuantity: number;
    }[];
  };
  ticketQuantity: number;
  selectedTicketTypeId: string | null;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

type PaymentMethod = "vnpay" | "momo" | "bank_transfer" | "credit_card";

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardHolder?: string;
  billingAddress?: string;
  promoCode?: string;
};

/**
 * Biểu mẫu thanh toán để xử lý quá trình mua vé sự kiện
 * Hỗ trợ nhiều phương thức thanh toán và xác nhận thông tin
 */
export default function CheckoutForm({
  event,
  ticketQuantity,
  selectedTicketTypeId,
  onSuccess,
  onCancel,
}: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("vnpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();
  const formBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const methodBgActive = useColorModeValue("teal.50", "teal.900");
  const methodBorder = useColorModeValue("gray.200", "gray.700");
  const methodActiveBorder = useColorModeValue("teal.500", "teal.300");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FormValues>();

  // Lấy thông tin người dùng từ Redux
  const currentUser = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // useEffect để tự động điền thông tin người dùng nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Chỉ reset nếu các trường trong form còn trống hoặc là giá trị mặc định
      // Điều này cho phép người dùng chỉnh sửa sau khi tự động điền
      const currentFormValues = getValues();
      const defaultValues: Partial<FormValues> = {};

      if (!currentFormValues.fullName && currentUser.name) {
        defaultValues.fullName = currentUser.name;
      }
      if (!currentFormValues.email && currentUser.email) {
        defaultValues.email = currentUser.email;
      }
      if (!currentFormValues.phone && currentUser.phone) {
        // currentUser.phone có thể undefined
        defaultValues.phone = currentUser.phone;
      }

      // Chỉ gọi reset nếu có ít nhất một giá trị được điền
      // và các giá trị đó khác với giá trị hiện tại của form
      // Hoặc khi form mới được render lần đầu và chưa có giá trị
      const shouldReset =
        Object.keys(defaultValues).length > 0 &&
        ((!currentFormValues.fullName &&
          !currentFormValues.email &&
          !currentFormValues.phone) || // Form rỗng ban đầu
          (defaultValues.fullName &&
            defaultValues.fullName !== currentFormValues.fullName) ||
          (defaultValues.email &&
            defaultValues.email !== currentFormValues.email) ||
          (defaultValues.phone &&
            defaultValues.phone !== currentFormValues.phone));

      if (shouldReset) {
        reset({
          ...currentFormValues, // Giữ lại các giá trị đã có hoặc người dùng đã nhập
          ...defaultValues, // Ghi đè bằng thông tin user nếu có và form field đó rỗng
        });
      }
    }
  }, [isAuthenticated, currentUser, reset, getValues]);

  // Tính toán tổng tiền
  const getTicketPrice = () => {
    if (event.ticketTypes && selectedTicketTypeId) {
      const selectedType = event.ticketTypes.find(
        (t) => t.id === selectedTicketTypeId
      );
      return selectedType ? selectedType.price || 0 : event.price || 0;
    }
    return event.price || 0; // Đảm bảo luôn trả về số, mặc định là 0
  };

  const getTicketName = () => {
    if (event.ticketTypes && selectedTicketTypeId) {
      const selectedType = event.ticketTypes.find(
        (t) => t.id === selectedTicketTypeId
      );
      return selectedType ? selectedType.name : "Standard";
    }
    return "Standard";
  };

  // Định nghĩa các phương thức thanh toán
  const paymentMethods = [
    {
      id: "vnpay",
      name: "VNPay",
      icon: FaMoneyCheckAlt,
      color: "blue.500",
      description: "Thanh toán an toàn qua VNPay",
      fee: 2.5, // 2.5%
    },
    {
      id: "momo",
      name: "MoMo",
      icon: FaWallet,
      color: "pink.500",
      description: "Thanh toán qua ví điện tử MoMo",
      fee: 3, // 3%
    },
    {
      id: "bank_transfer",
      name: "Chuyển khoản ngân hàng",
      icon: FaUniversity,
      color: "green.500",
      description: "Chuyển khoản trực tiếp qua ngân hàng",
      fee: 1.5, // 1.5%
    },
    {
      id: "credit_card",
      name: "Thẻ tín dụng/ghi nợ",
      icon: FaCreditCard,
      color: "orange.500",
      description: "Thanh toán qua thẻ Visa, Mastercard, JCB",
      fee: 3.5, // 3.5%
    },
  ];

  // Lấy tỷ lệ phí dịch vụ dựa theo phương thức thanh toán
  const getServiceFeeRate = () => {
    const selectedMethod = paymentMethods.find((m) => m.id === paymentMethod);
    return selectedMethod ? selectedMethod.fee / 100 : 0.05; // Mặc định 5% nếu không tìm thấy
  };

  // Kiểm tra xem có phải là vé miễn phí không
  const isFreeTicket = getTicketPrice() === 0;
  const subtotal = getTicketPrice() * ticketQuantity;
  // Không áp dụng phí dịch vụ cho vé miễn phí
  const serviceFeeRate = getServiceFeeRate();
  const serviceFee = isFreeTicket ? 0 : Math.round(subtotal * serviceFeeRate);
  const total = subtotal + serviceFee;

  // Xử lý khi gửi form
  const onSubmit = async (data: FormValues) => {
    // Kiểm tra xác thực trước khi thực hiện thanh toán
    if (!isAuthenticated) {
      toast({
        title: "Yêu cầu đăng nhập",
        description:
          "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để hoàn tất thanh toán.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      // Lưu URL hiện tại để sau khi đăng nhập chuyển về
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        eventId: event.id,
        ticketTypeId: selectedTicketTypeId,
        quantity: ticketQuantity,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        paymentMethodDetails: {
          type: "DEMO_SUCCESS" as "DEMO_SUCCESS" | "DEMO_FAIL", // Luôn gọi DEMO_SUCCESS để auto thành công
          // Không thêm trường method vì không có trong interface DemoPaymentPayload
        },
      };

      console.log("[CheckoutForm] Submitting payment with payload:", payload);
      // Gọi API service
      const result = await checkoutService.processDemoPayment(payload);

      if (result.success) {
        // Lấy tên phương thức thanh toán
        const paymentMethodName =
          paymentMethods.find((m) => m.id === paymentMethod)?.name ||
          paymentMethod;

        toast({
          title: "Thanh toán thành công!",
          description: `Giao dịch qua ${paymentMethodName} đã được xác nhận thành công.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        reset();
        onSuccess(result.transactionId); // Truyền transactionId từ API response

        // Lưu lại loại payment method đã chọn vào localStorage để sau này có thể xem lại
        localStorage.setItem("lastPaymentMethod", paymentMethod);
      } else {
        // Trường hợp này ít khi xảy ra nếu service đã throw error, nhưng để an toàn
        toast({
          title: "Thanh toán thất bại",
          description: result.message || "Có lỗi xảy ra từ phía server.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("[CheckoutForm] Error during payment submission:", error);
      let errorMessage = "Không thể hoàn tất thanh toán vào lúc này.";
      if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = (error as Error).message;
      }
      toast({
        title: "Lỗi xử lý thanh toán",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Xử lý hủy
  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      borderColor={borderColor}
      bg={formBg}
      boxShadow="md"
    >
      <Box p={6}>
        <VStack spacing={6} align="stretch">
          <Heading size="lg">Thanh toán</Heading>

          {/* Thông tin sự kiện */}
          <Box
            borderWidth="1px"
            borderRadius="md"
            p={4}
            borderColor={borderColor}
          >
            <Flex gap={4}>
              <Image
                src={event.imageUrl}
                fallbackSrc="/images/default-event-image.png"
                alt={event.title}
                w="100px"
                h="100px"
                objectFit="cover"
                borderRadius="md"
              />
              <Box>
                <Heading size="md">{event.title}</Heading>
                <Text
                  fontSize="sm"
                  color={useColorModeValue("gray.600", "gray.400")}
                >
                  {event.date} • {event.time}
                </Text>
                <Text
                  fontSize="sm"
                  color={useColorModeValue("gray.600", "gray.400")}
                  mb={2}
                >
                  {event.location}
                </Text>
                <Badge colorScheme="teal">
                  {getTicketName()}: {ticketQuantity} vé x{" "}
                  <Text as="span">
                    {isFreeTicket
                      ? "Miễn phí"
                      : `${getTicketPrice().toLocaleString()} đ`}
                  </Text>
                </Badge>
              </Box>
            </Flex>
          </Box>

          {/* Form thanh toán */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">
              <Heading size="md">Thông tin người mua</Heading>

              <FormControl isInvalid={!!errors.fullName} isRequired>
                <FormLabel>Họ và tên</FormLabel>
                <Input
                  {...register("fullName", {
                    required: "Vui lòng nhập họ tên đầy đủ",
                  })}
                  placeholder="Nguyễn Văn A"
                  isDisabled={isAuthenticated && !!currentUser?.name}
                  _disabled={{
                    opacity: 0.8,
                    cursor: "not-allowed",
                    border: "1px solid",
                    borderColor: "gray.300",
                  }}
                />
                {isAuthenticated && currentUser?.name && (
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Họ tên được lấy từ tài khoản của bạn. Vui lòng vào trang{" "}
                    <i>Quản lý tài khoản</i> để chỉnh sửa.
                  </Text>
                )}
                <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email} isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  {...register("email", {
                    required: "Vui lòng nhập email",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email không hợp lệ",
                    },
                    validate:
                      isAuthenticated && !!currentUser?.email
                        ? undefined
                        : undefined,
                  })}
                  placeholder="example@email.com"
                  isDisabled={isAuthenticated && !!currentUser?.email}
                  _disabled={{
                    opacity: 0.8,
                    cursor: "not-allowed",
                    border: "1px solid",
                    borderColor: "gray.300",
                  }}
                />
                {isAuthenticated && currentUser?.email && (
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Email được lấy từ tài khoản của bạn và không thể chỉnh sửa
                  </Text>
                )}
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.phone} isRequired>
                <FormLabel>Số điện thoại</FormLabel>
                <Input
                  type="tel"
                  {...register("phone", {
                    required: "Vui lòng nhập số điện thoại",
                    pattern: {
                      value:
                        /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  })}
                  placeholder="09xxxxxxxx"
                />
                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
              </FormControl>

              <Divider my={4} />

              <Heading size="md">Phương thức thanh toán</Heading>

              <Box mt={2}>
                <RadioGroup
                  onChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  value={paymentMethod}
                >
                  <Stack spacing={4} direction="column">
                    {paymentMethods.map((method) => (
                      <Box
                        key={method.id}
                        borderWidth="1px"
                        borderRadius="md"
                        p={4}
                        cursor="pointer"
                        onClick={() =>
                          setPaymentMethod(method.id as PaymentMethod)
                        }
                        borderColor={
                          paymentMethod === method.id
                            ? methodActiveBorder
                            : methodBorder
                        }
                        bg={
                          paymentMethod === method.id
                            ? methodBgActive
                            : "transparent"
                        }
                        _hover={{
                          borderColor: methodActiveBorder,
                        }}
                        transition="all 0.2s"
                      >
                        <Radio
                          value={method.id}
                          colorScheme="teal"
                          size="lg"
                          w="100%"
                        >
                          <Flex align="center" w="100%" justify="space-between">
                            <HStack spacing={3}>
                              <Icon
                                as={method.icon}
                                w={6}
                                h={6}
                                color={method.color}
                              />
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="medium">{method.name}</Text>
                                <Text fontSize="xs" color="gray.500">
                                  {method.description}
                                </Text>
                              </VStack>
                            </HStack>
                          </Flex>
                        </Radio>
                      </Box>
                    ))}
                  </Stack>
                </RadioGroup>
              </Box>

              <Divider my={4} />

              <VStack spacing={2} align="stretch" fontSize="sm">
                <HStack justify="space-between">
                  <Text>Tạm tính ({ticketQuantity} vé):</Text>
                  <Text fontWeight="medium">
                    {isFreeTicket
                      ? "Miễn phí"
                      : `${subtotal.toLocaleString()} đ`}
                  </Text>
                </HStack>
                {!isFreeTicket && (
                  <HStack justify="space-between">
                    <Text>
                      Phí dịch vụ ({(serviceFeeRate * 100).toFixed(1)}%):
                    </Text>
                    <Text fontWeight="medium">
                      {serviceFee.toLocaleString()} đ
                    </Text>
                  </HStack>
                )}
                <HStack justify="space-between" fontWeight="bold" fontSize="md">
                  <Text>Tổng cộng:</Text>
                  <Text>
                    {isFreeTicket ? "Miễn phí" : `${total.toLocaleString()} đ`}
                  </Text>
                </HStack>
              </VStack>

              <Divider my={4} />

              <HStack justifyContent="flex-end" spacing={4}>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  isDisabled={isProcessing}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  colorScheme="teal"
                  isLoading={isProcessing}
                  spinner={<FaSpinner />}
                  loadingText="Đang xử lý..."
                >
                  Hoàn tất thanh toán
                </Button>
              </HStack>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );
}
