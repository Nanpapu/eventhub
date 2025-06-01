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
  const scannerInstanceRef = useRef<Html5Qrcode | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);
  const cameraActiveRef = useRef(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Tạo container ID duy nhất để tránh xung đột DOM
  const containerId = useRef(
    `qr-reader-${Math.random().toString(36).substring(2, 9)}`
  );

  // Hàm dừng camera an toàn
  const stopCamera = async () => {
    try {
      if (scannerInstanceRef.current && cameraActiveRef.current) {
        console.log("Stopping camera...");

        try {
          if (scannerInstanceRef.current.isScanning) {
            await scannerInstanceRef.current.stop();
          }
        } catch (stopError) {
          console.error("Error stopping camera:", stopError);
        }

        cameraActiveRef.current = false;

        // Đảm bảo giải phóng bộ nhớ
        if (!isActive) {
          scannerInstanceRef.current = null;
        }
      }
    } catch (error) {
      console.error("Critical error during camera cleanup:", error);
    }
  };

  // Đảm bảo camera được dừng khi component unmount
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      stopCamera();

      // Force stop all video tracks
      try {
        const videoElements = document.querySelectorAll("video");
        videoElements.forEach((video) => {
          try {
            if (video.srcObject) {
              const stream = video.srcObject as MediaStream;
              stream.getTracks().forEach((track) => {
                track.stop();
              });
            }
          } catch (e) {
            console.error("Error stopping video streams:", e);
          }
        });
      } catch (e) {
        console.error("Error force stopping camera:", e);
      }
    };
  }, []);

  // Xử lý visibility change của trang
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && cameraActiveRef.current) {
        console.log("Page hidden, stopping camera");
        stopCamera();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Xử lý thay đổi isActive prop
  useEffect(() => {
    const startScanner = async () => {
      if (!isActive || !isMountedRef.current) {
        await stopCamera();
        return;
      }

      if (!qrScannerRef.current) {
        console.error("QR scanner element ref is null");
        return;
      }

      try {
        // Dừng instance cũ nếu có
        await stopCamera();

        setIsLoading(true);

        // Khởi tạo HTML5Qrcode mới
        const html5QrCode = new Html5Qrcode(containerId.current);
        scannerInstanceRef.current = html5QrCode;

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

          // Bắt đầu quét với camera
          await html5QrCode.start(
            cameraId,
            config,
            (decodedText) => {
              // Xử lý khi quét thành công
              if (isMountedRef.current && isActive) {
                onScanSuccess(decodedText);
              }
              // Dừng camera sau khi quét thành công
              stopCamera();
            },
            (errorMessage) => {
              // Bỏ qua lỗi thường xảy ra khi quét
              if (isMountedRef.current) {
                console.log("QR Code scanning error:", errorMessage);
              }
            }
          );

          cameraActiveRef.current = true;
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
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    // Bắt đầu quét QR khi component được active
    startScanner();

    // Cleanup khi isActive thay đổi
    return () => {
      stopCamera();
    };
  }, [isActive, onScanSuccess, onScanError]);

  // Xử lý khi component bị unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopCamera();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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

        {/* Container cho QR scanner với ID duy nhất để tránh xung đột DOM */}
        <Box
          id={containerId.current}
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
