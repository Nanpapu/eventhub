import { useState } from "react";
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
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaMoneyBillWave,
} from "react-icons/fa";

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

type PaymentMethod = "credit_card" | "paypal" | "bank_transfer";

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
    useState<PaymentMethod>("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();
  const formBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

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
  const onSubmit = (data: FormValues) => {
    setIsProcessing(true);

    // Giả lập xử lý thanh toán với API
    setTimeout(() => {
      // Tạo ID giao dịch ngẫu nhiên
      const transactionId = `TRX-${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`;

      // Giả lập thành công
      toast({
        title: "Thanh toán thành công!",
        description: `ID giao dịch của bạn là: ${transactionId}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setIsProcessing(false);
      reset();
      onSuccess(transactionId);
    }, 2000);
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
                alt={event.title}
                w="100px"
                h="100px"
                objectFit="cover"
                borderRadius="md"
              />
              <Box>
                <Heading size="md">{event.title}</Heading>
                <Text fontSize="sm" color="gray.500">
                  {event.date} • {event.time}
                </Text>
                <Text fontSize="sm" color="gray.500" mb={2}>
                  {event.location}
                </Text>
                <Badge colorScheme="teal">
                  {getTicketName()}: {ticketQuantity}{" "}
                  {ticketQuantity > 1 ? "vé" : "vé"} x ${getTicketPrice()}
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
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.phone} isRequired>
                <FormLabel>Số điện thoại</FormLabel>
                <Input
                  {...register("phone", {
                    required: "Vui lòng nhập số điện thoại",
                    pattern: {
                      value: /^[0-9+-]+$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  })}
                />
                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
              </FormControl>

              <Divider my={4} />

              <Heading size="md">Phương thức thanh toán</Heading>

              <RadioGroup
                onChange={(value) => setPaymentMethod(value as PaymentMethod)}
                value={paymentMethod}
              >
                <Stack direction="column" spacing={4}>
                  <Radio value="credit_card">
                    <Flex align="center">
                      <Text mr={2}>Thẻ tín dụng/ghi nợ</Text>
                      <HStack spacing={1}>
                        <FaCcVisa color="#1A1F71" size={24} />
                        <FaCcMastercard color="#EB001B" size={24} />
                      </HStack>
                    </Flex>
                  </Radio>

                  <Radio value="paypal">
                    <Flex align="center">
                      <Text mr={2}>PayPal</Text>
                      <FaCcPaypal color="#003087" size={24} />
                    </Flex>
                  </Radio>

                  <Radio value="bank_transfer">
                    <Flex align="center">
                      <Text mr={2}>Chuyển khoản ngân hàng</Text>
                      <FaMoneyBillWave color="green" size={20} />
                    </Flex>
                  </Radio>
                </Stack>
              </RadioGroup>

              {paymentMethod === "credit_card" && (
                <Box mt={4}>
                  <VStack spacing={4} align="stretch">
                    <FormControl isInvalid={!!errors.cardNumber} isRequired>
                      <FormLabel>Số thẻ</FormLabel>
                      <Input
                        placeholder="XXXX XXXX XXXX XXXX"
                        {...register("cardNumber", {
                          required: "Vui lòng nhập số thẻ",
                          pattern: {
                            value: /^[0-9\s]{13,19}$/,
                            message: "Số thẻ không hợp lệ",
                          },
                        })}
                      />
                      <FormErrorMessage>
                        {errors.cardNumber?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <HStack>
                      <FormControl isInvalid={!!errors.cardExpiry} isRequired>
                        <FormLabel>Ngày hết hạn</FormLabel>
                        <Input
                          placeholder="MM/YY"
                          {...register("cardExpiry", {
                            required: "Vui lòng nhập ngày hết hạn",
                            pattern: {
                              value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                              message: "Định dạng MM/YY",
                            },
                          })}
                        />
                        <FormErrorMessage>
                          {errors.cardExpiry?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.cardCvv} isRequired>
                        <FormLabel>CVV</FormLabel>
                        <Input
                          type="password"
                          placeholder="XXX"
                          maxLength={4}
                          {...register("cardCvv", {
                            required: "Vui lòng nhập CVV",
                            pattern: {
                              value: /^[0-9]{3,4}$/,
                              message: "CVV không hợp lệ",
                            },
                          })}
                        />
                        <FormErrorMessage>
                          {errors.cardCvv?.message}
                        </FormErrorMessage>
                      </FormControl>
                    </HStack>

                    <FormControl isInvalid={!!errors.cardHolder} isRequired>
                      <FormLabel>Tên chủ thẻ</FormLabel>
                      <Input
                        placeholder="Như trên thẻ"
                        {...register("cardHolder", {
                          required: "Vui lòng nhập tên chủ thẻ",
                        })}
                      />
                      <FormErrorMessage>
                        {errors.cardHolder?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </VStack>
                </Box>
              )}

              {paymentMethod === "paypal" && (
                <Box
                  mt={4}
                  p={4}
                  bg="blue.50"
                  color="blue.800"
                  borderRadius="md"
                >
                  <Text>
                    Bạn sẽ được chuyển hướng đến PayPal để hoàn tất thanh toán
                    sau khi xác nhận.
                  </Text>
                </Box>
              )}

              {paymentMethod === "bank_transfer" && (
                <Box
                  mt={4}
                  p={4}
                  bg="green.50"
                  color="green.800"
                  borderRadius="md"
                >
                  <Text fontWeight="bold">Thông tin chuyển khoản:</Text>
                  <Text>Ngân hàng: EventHub Bank</Text>
                  <Text>Số tài khoản: 1234567890</Text>
                  <Text>Chủ tài khoản: EventHub Inc.</Text>
                  <Text mt={2}>
                    Nội dung chuyển khoản: {event.id}-
                    {Math.random().toString(36).substring(2, 10).toUpperCase()}
                  </Text>
                  <Text mt={2} fontStyle="italic">
                    Vé của bạn sẽ được xác nhận sau khi chúng tôi nhận được
                    thanh toán.
                  </Text>
                </Box>
              )}

              <Divider my={4} />

              <FormControl>
                <FormLabel>Mã giảm giá (nếu có)</FormLabel>
                <Input {...register("promoCode")} />
              </FormControl>

              <Box
                p={4}
                borderWidth="1px"
                borderRadius="md"
                borderColor={borderColor}
                bg={useColorModeValue("gray.50", "gray.700")}
              >
                <Heading size="sm" mb={3}>
                  Tóm tắt hóa đơn
                </Heading>
                <HStack justify="space-between" mb={2}>
                  <Text>Vé ({ticketQuantity})</Text>
                  <Text>${subtotal.toFixed(2)}</Text>
                </HStack>
                <HStack justify="space-between" mb={2}>
                  <Text>Phí dịch vụ</Text>
                  <Text>${serviceFee.toFixed(2)}</Text>
                </HStack>
                <Divider my={2} />
                <HStack justify="space-between" fontWeight="bold">
                  <Text>Tổng cộng</Text>
                  <Text>${total.toFixed(2)}</Text>
                </HStack>
              </Box>

              <HStack spacing={4} justify="flex-end" mt={4}>
                <Button variant="ghost" onClick={handleCancel}>
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  colorScheme="teal"
                  isLoading={isProcessing}
                  loadingText="Đang xử lý"
                >
                  Thanh toán ${total.toFixed(2)}
                </Button>
              </HStack>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );
}
