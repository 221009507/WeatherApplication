import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import "../styles/RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phoneNumber: "",
    password: "",
    adminCode: "" // optional
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { adminCode, ...payload } = formData;
    try {
      const response = await registerUser(payload);
      const profile = response.data;
      console.log("User registered:", profile);
      alert("Registered successfully!");
      // Save only needed fields in localStorage for account fetch
      localStorage.setItem("userProfile", JSON.stringify({
        userId: profile.userId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        gender: profile.gender,
        phoneNumber: profile.phoneNumber
      }));
      navigate("/dashboard", { state: { firstName: profile.firstName } });
    } catch (error) {
      console.error("Registration failed:", error.response || error);
      alert(error.response?.data || "Registration failed! Check console for details.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="adminCode"
            placeholder="Admin Secret (optional)"
            value={formData.adminCode}
            onChange={handleChange}
          />
          <button type="submit" className="primary-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
