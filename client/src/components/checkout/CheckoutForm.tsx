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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { FaMoneyBillWave, FaSpinner, FaCheck } from "react-icons/fa";
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

type PaymentMethod =
  | "credit_card"
  | "paypal"
  | "bank_transfer"
  | "demo_success"
  | "demo_fail";

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
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("demo_success");
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();
  const formBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

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
      return selectedType ? selectedType.price : event.price;
    }
    return event.price;
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

  const subtotal = getTicketPrice() * ticketQuantity;
  const serviceFee = Math.round(subtotal * 0.05); // Phí dịch vụ 5%
  const total = subtotal + serviceFee;

  // Xử lý khi gửi form
  const onSubmit = async (data: FormValues) => {
    setIsProcessing(true);

    const payload = {
      eventId: event.id,
      ticketTypeId: selectedTicketTypeId,
      quantity: ticketQuantity,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      paymentMethodDetails: {
        type:
          paymentMethod === "demo_success"
            ? "DEMO_SUCCESS"
            : ("DEMO_FAIL" as "DEMO_SUCCESS" | "DEMO_FAIL"),
      },
    };

    try {
      console.log("[CheckoutForm] Submitting payment with payload:", payload);
      // Gọi API service
      const result = await checkoutService.processDemoPayment(payload);

      if (result.success) {
        toast({
          title: "Thanh toán Demo thành công!",
          description: `ID giao dịch của bạn là: ${result.transactionId}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        reset();
        onSuccess(result.transactionId); // Truyền transactionId từ API response
      } else {
        // Trường hợp này ít khi xảy ra nếu service đã throw error, nhưng để an toàn
        toast({
          title: "Thanh toán Demo thất bại",
          description: result.message || "Có lỗi xảy ra từ phía server.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("[CheckoutForm] Error during payment submission:", error);
      let errorMessage = "Không thể hoàn tất thanh toán vào lúc này.";
      if (error instanceof Error) {
        errorMessage = error.message;
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
                  <Text as="span">${getTicketPrice()}</Text>
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
                />
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
                  })}
                  placeholder="example@email.com"
                />
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

              <Heading size="md">Phương thức thanh toán Demo</Heading>
              <Text
                fontSize="sm"
                color={useColorModeValue("gray.600", "gray.400")}
              >
                Đây là giao diện demo. Chọn "Thành công" hoặc "Thất bại" để giả
                lập kết quả.
              </Text>

              <RadioGroup
                onChange={(value) => setPaymentMethod(value as PaymentMethod)}
                value={paymentMethod}
              >
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={4}
                  mt={2}
                >
                  <Radio value="demo_success" colorScheme="green">
                    <Flex align="center">
                      <FaCheck style={{ marginRight: "8px" }} /> Thanh toán
                      thành công (Demo)
                    </Flex>
                  </Radio>
                  <Radio value="demo_fail" colorScheme="red">
                    <Flex align="center">
                      <FaMoneyBillWave style={{ marginRight: "8px" }} /> Thanh
                      toán thất bại (Demo)
                    </Flex>
                  </Radio>
                </Stack>
              </RadioGroup>

              <Divider my={4} />

              <VStack spacing={2} align="stretch" fontSize="sm">
                <HStack justify="space-between">
                  <Text>Tạm tính ({ticketQuantity} vé):</Text>
                  <Text fontWeight="medium">${subtotal.toLocaleString()}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text>Phí dịch vụ (5%):</Text>
                  <Text fontWeight="medium">
                    ${serviceFee.toLocaleString()}
                  </Text>
                </HStack>
                <HStack justify="space-between" fontWeight="bold" fontSize="md">
                  <Text>Tổng cộng:</Text>
                  <Text>${total.toLocaleString()}</Text>
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
