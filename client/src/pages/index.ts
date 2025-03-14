// Export components from pages directory
import Home from "./Home";

// Auth pages
import Login from "./auth/Login";
import Register from "./auth/Register";

// Event pages
import SearchResults from "./events/SearchResults";
import EventDetail from "./events/EventDetail";
import CreateEvent from "./events/CreateEvent";

// User pages
import Profile from "./user/Profile";
import MyEvents from "./user/MyEvents";

// Organizer pages
import Dashboard from "./organizer/Dashboard";
import EventAttendees from "./organizer/EventAttendees";

export {
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
};
