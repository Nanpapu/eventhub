import { Box } from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';
import { ReactNode } from 'react';
interface LayoutProps {
  children: ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box flex="1" as="main" py={8} px={4}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
export default Layout;
