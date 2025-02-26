import { Box, Text, Container, Stack, Link, Divider } from '@chakra-ui/react';
const Footer = () => {
  return (
    <Box as="footer" bg="gray.100" py={10}>
      <Container maxW="container.xl">
        <Stack
          direction={{ base: 'column', md: 'row' }}
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
              N?n t?ng qu?n l� v� t? ch?c s? ki?n to�n di?n
            </Text>
          </Stack>
          <Stack align="start" spacing={3}>
            <Text fontWeight="bold">Platform</Text>
            <Link href="#">T�m s? ki?n</Link>
            <Link href="#">T?o s? ki?n</Link>
            <Link href="#">Tr? th�nh nh� t? ch?c</Link>
          </Stack>
          <Stack align="start" spacing={3}>
            <Text fontWeight="bold">C�ng ty</Text>
            <Link href="#">V? ch�ng t�i</Link>
            <Link href="#">Li�n h?</Link>
            <Link href="#">Blog</Link>
          </Stack>
          <Stack align="start" spacing={3}>
            <Text fontWeight="bold">H? tr?</Text>
            <Link href="#">Tr? gi�p</Link>
            <Link href="#">�i?u kho?n</Link>
            <Link href="#">Ch�nh s�ch</Link>
          </Stack>
        </Stack>
        <Divider />
        <Text pt={6} fontSize="sm" textAlign="center">
          � {new Date().getFullYear()} EventHub. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
};
export default Footer;
