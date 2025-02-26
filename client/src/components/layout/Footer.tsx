import { Box, Text, Container, Stack, Link, Divider } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box as="footer" bg="gray.100" py={10}>
      <Container maxW="container.xl">
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={8}
          justify="space-between"
          align="start"
          mb={8}
        >
          <Stack align="start" spacing={3}>
            <Text fontWeight="bold" fontSize="xl">
              EventHub
            </Text>
            <Text color="gray.600">
              Comprehensive event management platform
            </Text>
          </Stack>
          <Stack align="start" spacing={3}>
            <Text fontWeight="bold">Platform</Text>
            <Link href="#">Find Events</Link>
            <Link href="#">Create Event</Link>
            <Link href="#">Become an Organizer</Link>
          </Stack>
          <Stack align="start" spacing={3}>
            <Text fontWeight="bold">Company</Text>
            <Link href="#">About Us</Link>
            <Link href="#">Contact</Link>
            <Link href="#">Blog</Link>
          </Stack>
          <Stack align="start" spacing={3}>
            <Text fontWeight="bold">Support</Text>
            <Link href="#">Help</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Privacy Policy</Link>
          </Stack>
        </Stack>
        <Divider />
        <Text pt={6} fontSize="sm" textAlign="center">
          © {new Date().getFullYear()} EventHub. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;
