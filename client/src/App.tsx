import { ChakraProvider } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <ChakraProvider>
      <Layout>
        <Outlet />
      </Layout>
      <ToastContainer position="top-right" autoClose={3000} />
    </ChakraProvider>
  );
}
export default App;
