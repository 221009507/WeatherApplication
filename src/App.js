import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./Views/HomePage";
import LoginPage from "./Views/LoginPage";
import RegisterPage from "./Views/RegisterPage";
import WeatherDashboard from "./Views/WeatherDashboard";
import LocationsPage from "./Views/LocationsPage";
import AlertsPage from "./Views/AlertsPage";
import UserProfile from "./Views/UserProfile";

// New pages
import EventPage from "./Views/EventPage";
import VenuePage from "./Views/VenuePage";
import SubscriptionPage from "./Views/SubscriptionPage";
import ReportsPage from "./Views/ReportsPage";
import ForecastPage from "./Views/ForecastPage";

function App() {
  return (
    <Router>
      <div>
        {/* Navigation bar */}
        <nav className="navbar flex gap-4 p-4 bg-gray-800 text-white">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/locations">Locations</Link>
          <Link to="/alerts">Alerts</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/events">Events</Link>
          <Link to="/venues">Venues</Link>
          <Link to="/subscriptions">Subscriptions</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/forecast">Forecast</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<WeatherDashboard />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/venues" element={<VenuePage />} />
          <Route path="/subscriptions" element={<SubscriptionPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;