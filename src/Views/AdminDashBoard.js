import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAllUsers, updateUser, deactivateUser, reactivateUser } from "../services/api"; // added reactivate
import "../styles/AdminDashBoard.css";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null); // user to edit
  const [showModal, setShowModal] = useState(false); // modal visibility

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err.response || err);
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle deactivate user
  const handleDeactivate = async (userId) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) return;

    try {
      await deactivateUser(userId);
      fetchUsers();
      alert("User deactivated successfully!");
    } catch (err) {
      console.error("Deactivate error:", err.response || err);
      alert("Failed to deactivate user. Check console for details.");
    }
  };

  // Handle reactivate user
  const handleReactivate = async (userId) => {
    if (!window.confirm("Are you sure you want to reactivate this user?")) return;

    try {
      await reactivateUser(userId);
      fetchUsers();
      alert("User reactivated successfully!");
    } catch (err) {
      console.error("Reactivate error:", err.response || err);
      alert("Failed to reactivate user. Check console for details.");
    }
  };

  // Open modal to edit user
  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Handle changes in modal inputs
  const handleChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
  };

  // Save changes to backend
  const handleSave = async () => {
    if (!selectedUser || !selectedUser.userId) return;

    try {
      await updateUser(selectedUser.userId, selectedUser);
      alert("User updated successfully!");
      setShowModal(false);
      fetchUsers(); // refresh user list
    } catch (err) {
      console.error("Update error:", err.response || err);
      alert("Failed to update user. Check console for details.");
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Navbar */}
      <nav className="admin-navbar">
        <h1>Admin Panel</h1>
        <div className="navbar-right">
          <ul className="navbar-links">
            <li>
              <Link to="/venues">Venue</Link>
            </li>
            <li>
              <Link to="/admin/alerts">Alerts</Link>
            </li>
            <li>
              <Link to="/admin/locations">Locations</Link>
            </li>
          </ul>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("jwtToken");
              localStorage.removeItem("userProfile");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Welcome Section */}
      <section className="welcome-section">
        <p>Welcome, Admin! Here you can manage users and monitor activities.</p>
      </section>

      {/* Users Section */}
      <section className="users-card">
        <h2>Registered Users</h2>
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Phone Number</th>
                <th>Role</th>
                <th>Status</th> {/* NEW COLUMN */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.userId}
                  className={user.role === "ADMIN" ? "admin-row" : ""}
                >
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.gender}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.role}</td>
                  <td>{user.isActive ? "Active" : "Inactive"}</td> {/* STATUS */}
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    {user.isActive ? (
                      <button
                        className="delete-btn"
                        onClick={() => handleDeactivate(user.userId)}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        className="reactivate-btn"
                        onClick={() => handleReactivate(user.userId)}
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Edit User Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit User</h2>
            <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
              <label>
                First Name:
                <input
                  type="text"
                  name="firstName"
                  value={selectedUser.firstName}
                  onChange={handleChange}
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={selectedUser.lastName}
                  onChange={handleChange}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleChange}
                  disabled
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="text"
                  name="phoneNumber"
                  value={selectedUser.phoneNumber}
                  onChange={handleChange}
                />
              </label>
              <label>
                Gender:
                <select
                  name="gender"
                  value={selectedUser.gender}
                  onChange={handleChange}
                >
                  <option value="">--Select--</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </label>
              <label>
                Role:
                <select
                  name="role"
                  value={selectedUser.role}
                  onChange={handleChange}
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" className="save-btn" onClick={handleSave}>
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
