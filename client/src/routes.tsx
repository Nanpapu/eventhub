import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import EventDetail from "./pages/events/EventDetail";
import SearchResults from "./pages/events/SearchResults";
import MainLayout from "./components/layout/MainLayout";
import CreateEvent from "./pages/events/CreateEvent";

// Cấu hình bộ định tuyến cho ứng dụng
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<SearchResults />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/create-event" element={<CreateEvent />} />
      </Route>
    </Route>
  )
);

export default router;
