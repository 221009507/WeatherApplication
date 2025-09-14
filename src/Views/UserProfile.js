import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UserProfile.css";
import avatarImg from "../images/user.png";

export default function UserProfile({ userEmail }) {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    password: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(!!userEmail);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:8080/api/profiles/email/${userEmail}`)
      .then(res => {
        setUser(res.data);
        setFormData(res.data);
      })
      .catch(err => {
        console.error("Profile fetch error:", err);
        setError("No profile found. You can create one below.");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [userEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.email) {
      alert("Email is required!");
      return;
    }

    axios
      .post("http://localhost:8080/api/profiles/create", formData)
      .then(res => {
        setUser(res.data);
        setIsEditing(false);
        alert("Profile saved ✅");
      })
      .catch(err => {
        console.error("Save error:", err);
        alert("Error saving profile ❌");
      });
  };

  const handleCancel = () => {
    setFormData(user || { firstName: "", lastName: "", email: "", phoneNumber: "", gender: "" });
    setIsEditing(false);
  };

  if (loading) return <p>Loading profile...</p>;
  if (error && !user) return <p style={{ color: "orange" }}>{error}</p>;

  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      <div className="profile-container">
        <div className="profile-avatar-section">
          <img src={avatarImg} alt="Profile Avatar" className="profile-avatar" />
          <p className="user-name">{formData.firstName} {formData.lastName}</p>
          <p className="user-email">{formData.email}</p>
          {!isEditing && (
            <button className="primary" onClick={() => setIsEditing(true)}>
              {user ? "Edit Profile" : "Create Profile"}
            </button>
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
              <FormItem label="Email" name="email" value={formData.email} onChange={handleChange} type="email" disabled={!!userEmail} />
              <FormItem label="Phone" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              <FormItem label="Gender" name="gender" value={formData.gender} onChange={handleChange} />
              <div className="profile-buttons">
                <button type="submit" className="primary">{user ? "Save" : "Create"}</button>
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
