// Export components from pages directory
import Home from "./Home";

// Auth pages
import Login from "./auth/Login";
import Register from "./auth/Register";

// Event pages
import SearchResults from "./events/SearchResults";
import EventDetail from "./events/EventDetail";
import CreateEvent from "./events/CreateEvent";
import Checkout from "./events/Checkout";

// User pages
import Profile from "./user/Profile";
import MyEvents from "./user/MyEvents";
import Notifications from "./user/Notifications";
import MyTickets from "./user/MyTickets";
import SavedEvents from "./user/SavedEvents";

// Organizer pages
import Dashboard from "./organizer/Dashboard";
import EventAttendees from "./organizer/EventAttendees";
import EventCheckIn from "./organizer/EventCheckIn";
import EventAnalytics from "./organizer/EventAnalytics";

// Demo page
// import Demo from "./Demo";

// Re-export tất cả components dưới dạng default exports
export {
  Home,
  Login,
  Register,
  SearchResults,
  EventDetail,
  CreateEvent,
  Checkout,
  Profile,
  MyEvents,
  Notifications,
  Dashboard,
  EventAttendees,
  EventCheckIn,
  EventAnalytics,
  MyTickets,
  SavedEvents,
  // Demo,
};
