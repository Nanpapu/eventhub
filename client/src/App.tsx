import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import theme from "./utils/theme";

function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <Outlet />
        <ToastContainer position="top-right" autoClose={3000} />
      </ChakraProvider>
    </>
  );
}

export default App;
