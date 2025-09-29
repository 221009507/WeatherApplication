import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../services/api";
import avatarImg from "../images/user.png";
import "../styles/ProfilePage.css";

export default function UserProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    userId: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    let userId = "";
    if (storedProfile) {
      try {
        userId = JSON.parse(storedProfile).userId;
      } catch {}
    }
    if (!userId) {
      setLoading(false);
      setError("No user ID found. Please log in.");
      return;
    }
    getUserById(userId)
      .then(res => {
        setProfile(res.data);
        setFormData(res.data);
      })
      .catch(err => {
        console.error("Profile fetch error:", err);
        setError("No profile found. Please register first.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.email) return alert("Email is required!");
    try {
      const response = await updateUser(formData);
      setProfile(response.data);
      setFormData(response.data);
      setIsEditing(false);
      alert("Profile updated ✅");
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving profile ❌");
    }
  };

  const handleCancel = () => {
    setFormData(profile || { firstName: "", lastName: "", email: "", phoneNumber: "", gender: "", userId: "" });
    setIsEditing(false);
  };

  if (loading) return <p>Loading profile...</p>;
  if (error && !profile) return <p style={{ color: "orange" }}>{error}</p>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>User Profile</h1>
        <button className="primary back-btn" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>
      </div>

      <div className="profile-container">
        <div className="profile-avatar-section">
          <img src={avatarImg} alt="Profile Avatar" className="profile-avatar" />
          <p className="user-name">{formData.firstName} {formData.lastName}</p>
          <p className="user-email">{formData.email}</p>
          {!isEditing && (
            <button className="primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>

        <div className="profile-details-section">
          {!isEditing ? (
            <div className="profile-details">
              <ProfileItem label="Gender" value={formData.gender || "-"} />
              <ProfileItem label="Phone" value={formData.phoneNumber || "-"} />
            </div>
          ) : (
            <form className="profile-form" onSubmit={handleSave}>
              <FormItem label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
              <FormItem label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              <FormItem label="Email" name="email" value={formData.email} onChange={handleChange} type="email" disabled />
              <FormItem label="Phone" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              <FormItem label="Gender" name="gender" value={formData.gender} onChange={handleChange} />
              <div className="profile-buttons">
                <button type="submit" className="primary">Save</button>
                <button type="button" className="danger" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="profile-item">
      <span className="profile-label">{label}:</span>
      <span className="profile-value">{value}</span>
    </div>
  );
}

function FormItem({ label, name, value, onChange, type = "text" }) {
  return (
    <label className="form-item">
      {label}:
      <input type={type} name={name} value={value} onChange={onChange} />
    </label>
  );
}
