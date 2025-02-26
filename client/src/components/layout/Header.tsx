import { Box, Flex, Button, Heading, Spacer, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Header = () => {
  // Assume not logged in initially
  const isAuthenticated = false;

  return (
    <Box as="header" bg="teal.500" py={4} px={8} color="white">
      <Flex align="center">
        <Heading size="md" as={Link} to="/" sx={{ textDecoration: "none" }}>
          EventHub
        </Heading>
        <Spacer />
        <HStack spacing={4}>
          {isAuthenticated ? (
            <>
              <Button
                as={Link}
                to="/dashboard"
                colorScheme="teal"
                variant="outline"
                sx={{ textDecoration: "none" }}
              >
                Dashboard
              </Button>
              <Button colorScheme="teal" variant="outline">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                as={Link}
                to="/login"
                colorScheme="teal"
                variant="outline"
                sx={{ textDecoration: "none" }}
              >
                Login
              </Button>
              <Button
                as={Link}
                to="/register"
                colorScheme="teal"
                variant="solid"
                sx={{ textDecoration: "none" }}
              >
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
