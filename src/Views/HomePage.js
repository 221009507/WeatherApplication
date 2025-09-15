import { useNavigate } from "react-router-dom";
import bgImage from "../images/weatherImg.png"; // local background image
import "../styles/HomePage.css"; // import CSS file for styling

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      className="home-container"
      style={{ background: `url(${bgImage}) no-repeat center center/cover` }}
    >
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">WeatherApp 🌤️</div>
        <div className="nav-actions">
          <button
            className="nav-btn login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="nav-btn register-btn"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="home-overlay">
        <div className="hero-text">
          <h1>Welcome to Weather App 🌤️</h1>
          <p>Check the weather in your city quickly and easily.</p>
        </div>
      </div>
    </div>
  );
}
