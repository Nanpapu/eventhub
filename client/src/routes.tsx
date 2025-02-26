import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import EventDetail from "./pages/events/EventDetail";
import SearchResults from "./pages/events/SearchResults";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "events",
        element: <SearchResults />,
      },
      {
        path: "events/:id",
        element: <EventDetail />,
      },
      {
        path: "search",
        element: <SearchResults />,
      },
    ],
  },
]);

export default router;
