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
    phoneNumber: "",
    gender: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load current user profile using JWT token
  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (!storedProfile) {
      setError("No user profile found. Please log in.");
      setLoading(false);
      return;
    }

    const { userId } = JSON.parse(storedProfile);
    if (!userId) {
      setError("User ID not found. Please log in.");
      setLoading(false);
      return;
    }

    // Fetch user profile from protected endpoint
    getUserById(userId)
      .then((res) => {
        setProfile(res.data);
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          phoneNumber: res.data.phoneNumber || "",
          gender: res.data.gender || "",
        });
      })
      .catch((err) => {
        console.error("Error fetching profile:", err.response || err);
        setError("Failed to fetch profile.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile?.userId) return alert("User ID missing. Cannot update profile.");

    try {
      const response = await updateUser(profile.userId, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
      });

      // Update state & localStorage
      setProfile(response.data);
      setFormData({
        firstName: response.data.firstName || "",
        lastName: response.data.lastName || "",
        phoneNumber: response.data.phoneNumber || "",
        gender: response.data.gender || "",
      });
      localStorage.setItem("userProfile", JSON.stringify(response.data));

      setIsEditing(false);
      alert("Profile updated ✅");
    } catch (err) {
      console.error("Update error:", err.response || err);
      alert("Error updating profile ❌");
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phoneNumber: profile.phoneNumber || "",
        gender: profile.gender || "",
      });
    }
    setIsEditing(false);
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "orange" }}>{error}</p>;

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
          <p className="user-name">{profile.firstName} {profile.lastName}</p>
          <p className="user-email">{profile.email}</p>
          {!isEditing && (
            <button className="primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>

        <div className="profile-details-section">
          {!isEditing ? (
            <div className="profile-details">
              <ProfileItem label="Gender" value={profile.gender || "-"} />
              <ProfileItem label="Phone" value={profile.phoneNumber || "-"} />
            </div>
          ) : (
            <form className="profile-form" onSubmit={handleSave}>
              <FormItem label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
              <FormItem label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
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
