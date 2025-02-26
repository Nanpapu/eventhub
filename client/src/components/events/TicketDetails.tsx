import { useState, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Divider,
  Badge,
  Button,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  IconButton,
} from "@chakra-ui/react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaTicketAlt,
  FaDownload,
  FaPrint,
  FaEnvelopeOpen,
  FaQrcode,
  FaUserAlt,
} from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";

export interface TicketDetailsProps {
  ticket: {
    id: string;
    eventId: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    eventImageUrl: string;
    ticketType: string;
    ticketPrice: number;
    purchaseDate: string;
    attendeeName: string;
    attendeeEmail: string;
    status: "confirmed" | "pending" | "cancelled";
    isOnline: boolean;
    joinUrl?: string;
    organizer: string;
    scanCount: number;
    seatInfo?: string;
    notes?: string;
  };
  onDownload?: () => void;
  onEmailTicket?: () => void;
}

/**
 * Component hiển thị thông tin chi tiết của vé
 * Bao gồm thông tin sự kiện, trạng thái vé, và QR code
 */
export default function TicketDetails({
  ticket,
  onDownload,
  onEmailTicket,
}: TicketDetailsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isExpanded, setIsExpanded] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Tạo dữ liệu cho QR code (trong thực tế, đây sẽ là dữ liệu xác thực từ backend)
  const qrData = `TICKET:${ticket.id}|EVENT:${ticket.eventId}|USER:${ticket.attendeeEmail}`;

  // Giả lập tải xuống vé
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Giả lập tải xuống
      console.log("Downloading ticket...");
    }
  };

  // Giả lập gửi lại vé qua email
  const handleEmailTicket = () => {
    if (onEmailTicket) {
      onEmailTicket();
    } else {
      // Giả lập gửi email
      console.log("Emailing ticket...");
    }
  };

  // Trạng thái vé bằng văn bản và màu sắc
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "confirmed":
        return { text: "Đã xác nhận", color: "green" };
      case "pending":
        return { text: "Đang xử lý", color: "yellow" };
      case "cancelled":
        return { text: "Đã hủy", color: "red" };
      default:
        return { text: status, color: "gray" };
    }
  };

  // Chi tiết trạng thái hiện tại
  const statusDetails = getStatusDetails(ticket.status);

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      borderColor={borderColor}
      bg={bgColor}
      boxShadow="md"
      w="100%"
    >
      {/* Header kèm hình ảnh sự kiện */}
      <Box position="relative">
        <Image
          src={ticket.eventImageUrl}
          alt={ticket.eventTitle}
          w="100%"
          h="150px"
          objectFit="cover"
          filter="brightness(0.7)"
        />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={4}
          bg="rgba(0,0,0,0.6)"
          color="white"
        >
          <Heading size="md" noOfLines={1}>
            {ticket.eventTitle}
          </Heading>
          <Text fontSize="sm" mt={1}>
            Tổ chức bởi: {ticket.organizer}
          </Text>
        </Box>
      </Box>

      {/* Thông tin vé */}
      <Box p={5}>
        <Flex
          direction="row"
          justify="space-between"
          align="center"
          mb={4}
          pb={2}
          borderBottomWidth="1px"
          borderColor={borderColor}
        >
          <VStack align="start" spacing={1}>
            <Badge
              colorScheme={statusDetails.color}
              fontSize="sm"
              px={2}
              py={1}
              borderRadius="md"
            >
              {statusDetails.text}
            </Badge>
            <Text fontWeight="bold" fontSize="md">
              {ticket.ticketType}
              {ticket.ticketPrice > 0 && ` - $${ticket.ticketPrice.toFixed(2)}`}
            </Text>
          </VStack>

          <Box ref={qrRef}>
            <IconButton
              aria-label="Mở mã QR"
              icon={<FaQrcode />}
              size="md"
              onClick={onOpen}
              colorScheme="teal"
              variant="ghost"
            />
          </Box>
        </Flex>

        <VStack spacing={4} align="stretch">
          <HStack>
            <Box color="gray.500" minW="30px">
              <FaCalendarAlt />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontWeight="medium">Ngày</Text>
              <Text fontSize="sm">{ticket.eventDate}</Text>
            </VStack>
          </HStack>

          <HStack>
            <Box color="gray.500" minW="30px">
              <FaClock />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontWeight="medium">Thời gian</Text>
              <Text fontSize="sm">{ticket.eventTime}</Text>
            </VStack>
          </HStack>

          <HStack>
            <Box color="gray.500" minW="30px">
              <FaMapMarkerAlt />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontWeight="medium">Địa điểm</Text>
              <Text fontSize="sm">
                {ticket.isOnline ? "Sự kiện trực tuyến" : ticket.eventLocation}
              </Text>
              {ticket.isOnline && ticket.joinUrl && (
                <Button
                  size="xs"
                  colorScheme="blue"
                  variant="link"
                  mt={1}
                  onClick={() => window.open(ticket.joinUrl, "_blank")}
                >
                  Tham gia sự kiện
                </Button>
              )}
            </VStack>
          </HStack>

          <Divider />

          <HStack>
            <Box color="gray.500" minW="30px">
              <FaTicketAlt />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontWeight="medium">Mã vé</Text>
              <Text fontSize="sm" fontFamily="monospace">
                {ticket.id}
              </Text>
            </VStack>
          </HStack>

          <HStack>
            <Box color="gray.500" minW="30px">
              <FaUserAlt />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontWeight="medium">Người tham dự</Text>
              <Text fontSize="sm">{ticket.attendeeName}</Text>
              <Text fontSize="sm" color="gray.500">
                {ticket.attendeeEmail}
              </Text>
            </VStack>
          </HStack>

          {ticket.seatInfo && (
            <HStack>
              <Box color="gray.500" minW="30px">
                <FaTicketAlt />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontWeight="medium">Chỗ ngồi</Text>
                <Text fontSize="sm">{ticket.seatInfo}</Text>
              </VStack>
            </HStack>
          )}

          {/* Chi tiết mở rộng */}
          {isExpanded && (
            <>
              <Divider />
              <VStack align="start" spacing={2}>
                <Flex w="100%" justify="space-between">
                  <Text fontSize="sm" fontWeight="medium">
                    Ngày mua:
                  </Text>
                  <Text fontSize="sm">{ticket.purchaseDate}</Text>
                </Flex>
                {ticket.notes && (
                  <Box>
                    <Text fontSize="sm" fontWeight="medium">
                      Ghi chú:
                    </Text>
                    <Text fontSize="sm">{ticket.notes}</Text>
                  </Box>
                )}
                <Flex w="100%" justify="space-between">
                  <Text fontSize="sm" fontWeight="medium">
                    Số lần quét:
                  </Text>
                  <Text fontSize="sm">{ticket.scanCount}</Text>
                </Flex>
              </VStack>
            </>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Ẩn bớt" : "Xem thêm"}
          </Button>

          <Divider />

          {/* Nút tương tác */}
          <HStack spacing={4} justify="space-between">
            <Button
              leftIcon={<FaDownload />}
              colorScheme="teal"
              size="sm"
              onClick={handleDownload}
            >
              Tải vé
            </Button>
            <HStack>
              <IconButton
                aria-label="In vé"
                icon={<FaPrint />}
                size="sm"
                variant="ghost"
                onClick={() => window.print()}
              />
              <IconButton
                aria-label="Gửi vé qua email"
                icon={<FaEnvelopeOpen />}
                size="sm"
                variant="ghost"
                onClick={handleEmailTicket}
              />
            </HStack>
          </HStack>
        </VStack>
      </Box>

      {/* Modal hiển thị QR code */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mã QR vé của bạn</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="center">
              <Box
                p={6}
                bg="white"
                borderRadius="md"
                boxShadow="sm"
                maxW="250px"
                mx="auto"
              >
                <QRCodeSVG value={qrData} size={200} />
              </Box>
              <Text fontSize="sm" textAlign="center" color="gray.600">
                Xuất trình mã QR này khi đến địa điểm sự kiện để check-in
              </Text>
              <Button
                leftIcon={<FaDownload />}
                colorScheme="teal"
                size="sm"
                onClick={handleDownload}
                w="full"
              >
                Tải mã QR
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
