import { Box, Flex, Button, Heading, Spacer, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
const Header = () => {
  // Gi? d?nh chua dang nh?p
  const isAuthenticated = false;
  return (
    <Box as="header" bg="teal.500" py={4} px={8} color="white">
      <Flex align="center">
        <Heading size="md" as={Link} to="/">
          EventHub
        </Heading>
        <Spacer />
        <HStack spacing={4}>
          {isAuthenticated ? (
            <>
              <Button as={Link} to="/dashboard" colorScheme="teal" variant="outline">
                Dashboard
              </Button>
              <Button colorScheme="teal" variant="outline">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" colorScheme="teal" variant="outline">
                Login
              </Button>
              <Button as={Link} to="/register" colorScheme="teal" variant="solid">
                Register
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};
export default Header;
