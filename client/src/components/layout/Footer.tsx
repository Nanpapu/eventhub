import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link as ChakraLink,
  VisuallyHidden,
  chakra,
  useColorModeValue,
  Flex,
  Heading,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import {
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      mt="auto" // Giúp footer luôn ở dưới cùng nếu nội dung trang không đủ cao
    >
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid
          templateColumns={{ sm: "1fr 1fr", md: "2fr 1fr 1fr 2fr" }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Flex alignItems="center">
              <Heading
                as={Link}
                to="/"
                size="md"
                color={useColorModeValue("teal.600", "teal.300")}
                sx={{ textDecoration: "none" }}
              >
                EventHub
              </Heading>
            </Flex>
            <Text fontSize={"sm"}>© 2023 EventHub. All rights reserved</Text>
            <Stack direction={"row"} spacing={6}>
              <SocialButton label={"Twitter"} href={"#"}>
                <FaTwitter />
              </SocialButton>
              <SocialButton label={"YouTube"} href={"#"}>
                <FaYoutube />
              </SocialButton>
              <SocialButton label={"Instagram"} href={"#"}>
                <FaInstagram />
              </SocialButton>
            </Stack>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Company</ListHeader>
            <ChakraLink as={Link} to={"/about"}>
              About Us
            </ChakraLink>
            <ChakraLink as={Link} to={"/contact"}>
              Contact Us
            </ChakraLink>
            <ChakraLink as={Link} to={"/privacy"}>
              Privacy Policy
            </ChakraLink>
            <ChakraLink as={Link} to={"/terms"}>
              Terms of Service
            </ChakraLink>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Support</ListHeader>
            <ChakraLink as={Link} to={"/help"}>
              Help Center
            </ChakraLink>
            <ChakraLink as={Link} to={"/faq"}>
              FAQ
            </ChakraLink>
            <ChakraLink as={Link} to={"/organizers"}>
              Organizers
            </ChakraLink>
            <ChakraLink as={Link} to={"/community"}>
              Community
            </ChakraLink>
          </Stack>
          <Stack align={"flex-start"}>
            <ListHeader>Stay up to date</ListHeader>
            <Stack direction={"row"}>
              <Input
                placeholder={"Your email address"}
                bg={useColorModeValue("whiteAlpha.100", "blackAlpha.100")}
                border={1}
                borderStyle={"solid"}
                borderColor={useColorModeValue("gray.200", "gray.700")}
                _focus={{
                  bg: "whiteAlpha.300",
                }}
              />
              <IconButton
                bg={useColorModeValue("teal.500", "teal.500")}
                color={useColorModeValue("white", "gray.800")}
                _hover={{
                  bg: "teal.600",
                }}
                aria-label="Subscribe"
                icon={<FaArrowRight />}
              />
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
