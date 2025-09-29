import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Views/HomePage";
import LoginPage from "./Views/LoginPage";
import RegisterPage from "./Views/RegisterPage";
import WeatherDashboard from "./Views/WeatherDashboard";
import AlertsPage from "./Views/AlertsPage";
import AdminAlertsPage from "./Views/AdminAlertsPage"; // admin alerts page
import UserProfile from "./Views/UserProfile";

// New pages
import EventPage from "./Views/EventPage";
import VenuePage from "./Views/VenuePage";
import SubscriptionPage from "./Views/SubscriptionPage";
import ReportsPage from "./Views/ReportsPage";
import ForecastPage from "./Views/ForecastPage";

import AdminDashboardPage from "./Views/AdminDashBoard"; // admin dashboard

// Updated Location pages
import AdminLocationPage from "./Views/AdminLocationPage"; // admin can add/delete
import UserLocationsPage from "./Views/UserLocationsPage";   // user can only view/search

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<WeatherDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />

        {/* Locations */}
        <Route path="/locations" element={<UserLocationsPage />} />       {/* user-only */}
        <Route path="/admin/locations" element={<AdminLocationPage />} /> {/* admin-only */}

        {/* Alerts routes */}
        <Route path="/alerts" element={<AlertsPage />} />            {/* user view */}
        <Route path="/admin/alerts" element={<AdminAlertsPage />} /> {/* admin create */}

        {/* Profile & other pages */}
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/venues" element={<VenuePage />} />
        <Route path="/subscriptions" element={<SubscriptionPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/forecast" element={<ForecastPage />} />
      </Routes>
    </Router>
  );
}

export default App;
