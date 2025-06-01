import { useEffect, useRef, useState } from "react";
import {
  Box,
  Center,
  Text,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
} from "@chakra-ui/react";
import { Html5Qrcode } from "html5-qrcode";

interface QrCodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: Error | string) => void;
  isActive: boolean;
}

/**
 * Component để quét mã QR code
 * Tự động quản lý vòng đời camera để đảm bảo dừng camera khi không sử dụng
 */
const QrCodeScanner = ({
  onScanSuccess,
  onScanError,
  isActive,
}: QrCodeScannerProps) => {
  const qrScannerRef = useRef<HTMLDivElement>(null);
  const [scannerInstance, setScannerInstance] = useState<Html5Qrcode | null>(
    null
  );
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Đảm bảo camera được dừng và giải phóng khi component unmount
  useEffect(() => {
    return () => {
      if (scannerInstance) {
        console.log("Cleaning up camera on component unmount");
        try {
          if (scannerInstance.isScanning) {
            scannerInstance
              .stop()
              .catch((err) => console.error("Error stopping camera:", err))
              .finally(() => {
                scannerInstance.clear();
              });
          }
        } catch (error) {
          console.error("Error during camera cleanup:", error);
        }
      }
    };
  }, []);

  // Khởi tạo hoặc dừng scanner dựa trên prop isActive
  useEffect(() => {
    const qrCodeId = "qr-reader";

    // Hàm khởi tạo và bắt đầu quét QR
    const startScanner = async () => {
      // Dừng instance cũ nếu có
      if (scannerInstance) {
        if (scannerInstance.isScanning) {
          await scannerInstance.stop();
        }
        scannerInstance.clear();
        setScannerInstance(null);
      }

      if (!isActive) return;

      setIsLoading(true);
      try {
        // Khởi tạo Html5Qrcode
        const html5QrCode = new Html5Qrcode(qrCodeId);
        setScannerInstance(html5QrCode);

        // Liệt kê các thiết bị camera
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          const cameraId = devices[0].id;

          // Cấu hình quét
          const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          };

          // Bắt đầu quét với camera đầu tiên
          await html5QrCode.start(
            cameraId,
            config,
            (decodedText) => {
              // Xử lý khi quét thành công
              onScanSuccess(decodedText);
              // Tự động dừng camera sau khi quét thành công
              if (html5QrCode.isScanning) {
                html5QrCode.stop().catch((err) => {
                  console.error(
                    "Error stopping camera after successful scan:",
                    err
                  );
                });
              }
            },
            (errorMessage) => {
              // Bỏ qua lỗi thường xảy ra khi quét
              console.log("QR Code scanning error:", errorMessage);
            }
          );

          setPermissionError(null);
        } else {
          setPermissionError("Không tìm thấy thiết bị camera");
        }
      } catch (error) {
        console.error("Error starting QR scanner:", error);
        setPermissionError(
          "Không thể truy cập camera. Vui lòng cấp quyền camera cho trang web này."
        );
        if (onScanError) onScanError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    // Xử lý camera khi isActive thay đổi
    if (isActive) {
      startScanner();
    } else if (scannerInstance) {
      console.log("Stopping camera because component is not active");
      if (scannerInstance.isScanning) {
        scannerInstance
          .stop()
          .catch((err) => {
            console.error("Error stopping camera:", err);
          })
          .finally(() => {
            // Xóa instance sau khi dừng
            if (scannerInstance) {
              scannerInstance.clear();
            }
          });
      }
    }
  }, [isActive, onScanError, onScanSuccess]);

  // Xử lý sự kiện visibility change của trang
  useEffect(() => {
    // Hàm xử lý khi người dùng chuyển tab hoặc ẩn trang
    const handleVisibilityChange = () => {
      if (document.hidden && scannerInstance && scannerInstance.isScanning) {
        console.log("Page hidden, stopping camera");
        scannerInstance.stop().catch((err) => {
          console.error("Error stopping camera on visibility change:", err);
        });
      }
    };

    // Đăng ký sự kiện
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [scannerInstance]);

  if (!isActive) {
    return null;
  }

  return (
    <Box
      p={5}
      borderWidth="1px"
      borderRadius="md"
      borderColor={borderColor}
      bg={bgColor}
      boxShadow="sm"
      width="100%"
    >
      <VStack spacing={4} align="center">
        <Text fontSize="md" fontWeight="medium">
          Đặt mã QR vào giữa khung hình
        </Text>

        {isLoading && (
          <Center p={8}>
            <Spinner size="xl" color="teal.500" />
          </Center>
        )}

        {permissionError && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {permissionError}
          </Alert>
        )}

        {/* Container cho QR scanner */}
        <Box
          id="qr-reader"
          ref={qrScannerRef}
          width="100%"
          maxWidth="400px"
          minHeight="300px"
          borderRadius="md"
          overflow="hidden"
          display={isLoading || permissionError ? "none" : "block"}
        />

        <Text fontSize="sm" color="gray.500">
          Đảm bảo mã QR rõ ràng và nằm trong khung hình
        </Text>
      </VStack>
    </Box>
  );
};

export default QrCodeScanner;
