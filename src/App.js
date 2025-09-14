import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

import AdminDashboardPage from "./Views/AdminDashBoard"; // import admin page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<WeatherDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
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