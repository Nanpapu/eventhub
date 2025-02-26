import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "./App";
import {
  Home,
  Login,
  Register,
  SearchResults,
  EventDetail,
  CreateEvent,
  Profile,
  MyEvents,
  Dashboard,
  EventAttendees,
} from "./pages/index";
import {
  AboutUs,
  FAQ,
  PrivacyPolicy,
  TermsOfService,
  HelpCenter,
  Community,
  PressKit,
  ContactUs,
} from "./pages/info/index";
import MainLayout from "./components/layout/MainLayout";

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/organizer/events/:eventId/attendees"
          element={<EventAttendees />}
        />

        {/* Information Pages */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/community" element={<Community />} />
        <Route path="/press" element={<PressKit />} />
        <Route path="/contact" element={<ContactUs />} />
      </Route>
    </Route>
  )
);

export default router;
