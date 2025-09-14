import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/EditUserPage.css";

export default function EditUserPage() {
  const { id } = useParams(); // get userId from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    phoneNumber: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(true);

  // Fetch user details on page load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${id}`);
        const user = response.data;
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.credentials?.email || "",
          gender: user.gender || "",
          phoneNumber: user.phoneNumber || "",
          role: user.role || "USER",
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        alert("Failed to load user. Redirecting to dashboard.");
        navigate("/admin-dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/users/${id}`, {
        ...formData,
        credentials: { email: formData.email }, // update email nested object
      });
      alert("User updated successfully!");
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update user.");
    }
  };

  if (loading) return <p>Loading user details...</p>;

  return (
    <div className="edit-user-container">
      <h2>Edit User</h2>
      <form className="edit-user-form" onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Role:
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
        <div className="form-buttons">
          <button type="submit" className="save-btn">Save</button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/admin-dashboard")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}