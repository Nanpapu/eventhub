import { ChakraProvider } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ChakraProvider>
      <Outlet />
      <ToastContainer position="top-right" autoClose={3000} />
    </ChakraProvider>
  );
}

export default App;
