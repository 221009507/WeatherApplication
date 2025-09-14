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
      <div className="home-overlay">
        <h1>Welcome to Weather App 🌤️</h1>
        <p>Check the weather in your city quickly and easily.</p>

        {/* Buttons for navigation */}
        <div className="home-buttons">
          <button
            className="primary-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}