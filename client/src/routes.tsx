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
  ForgotPassword,
  ResetPassword,
  SearchResults,
  EventDetail,
  CreateEvent,
  Profile,
  MyEvents,
  Dashboard,
  EventAttendees,
  Checkout,
  MyTickets,
  // Demo,
  EventCheckIn,
  EventAnalytics,
  SavedEvents,
} from "./pages/index";
import {
  AboutUs,
  PrivacyPolicy,
  TermsOfService,
  HelpCenter,
  Community,
  PressKit,
  ContactUs,
  BecomeOrganizer,
} from "./pages/info/index";
import MainLayout from "./components/layout/MainLayout";
import UserDashboard from "./pages/user/UserDashboard";

// Cấu hình bộ định tuyến cho ứng dụng
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/events" element={<SearchResults />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/events/:eventId/checkout" element={<Checkout />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/saved-events" element={<SavedEvents />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/demo" element={<Demo />} /> */}

        {/* Trang tài khoản người dùng tích hợp */}
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/profile" element={<UserDashboard />} />
        <Route path="/user/events" element={<UserDashboard />} />
        <Route path="/user/tickets" element={<UserDashboard />} />
        <Route path="/user/settings" element={<UserDashboard />} />

        <Route
          path="/organizer/events/:eventId/attendees"
          element={<EventAttendees />}
        />
        <Route
          path="/organizer/events/:eventId/check-in"
          element={<EventCheckIn />}
        />
        <Route
          path="/organizer/events/:eventId/analytics"
          element={<EventAnalytics />}
        />

        {/* Information Pages */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/community" element={<Community />} />
        <Route path="/press" element={<PressKit />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/become-organizer" element={<BecomeOrganizer />} />
      </Route>
    </Route>
  )
);

export default router;
