import { useState } from "react";
import "../styles/UserProfile.css";
import avatarImg from "../images/user.png"; // Add a default avatar image

export default function UserProfile() {
  const [user, setUser] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+27 123 456 789",
    city: "Johannesburg",
    country: "South Africa",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      <div className="profile-container">
        {/* Left section: avatar */}
        <div className="profile-avatar-section">
          <img src={avatarImg} alt="Profile Avatar" className="profile-avatar" />
          <p className="user-name">{user.fullName}</p>
          <p className="user-email">{user.email}</p>
          {!isEditing && (
            <button className="primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        {/* Right section: profile details / edit form */}
        <div className="profile-details-section">
          {!isEditing ? (
            <div className="profile-details">
              <ProfileItem label="Phone" value={user.phone} />
              <ProfileItem label="City" value={user.city} />
              <ProfileItem label="Country" value={user.country} />
            </div>
          ) : (
            <form className="profile-form" onSubmit={handleSave}>
              <FormItem label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
              <FormItem label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
              <FormItem label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              <FormItem label="City" name="city" value={formData.city} onChange={handleChange} />
              <FormItem label="Country" name="country" value={formData.country} onChange={handleChange} />
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

/* Subcomponents */
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