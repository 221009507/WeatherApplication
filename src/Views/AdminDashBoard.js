import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/AdminDashBoard.css";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null); // user to edit
  const [showModal, setShowModal] = useState(false); // modal visibility

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users/all");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:8080/users/delete/${userId}`,
        { timeout: 5000 }
      );

      if (response.status === 204) {
        setUsers(users.filter((user) => user.userId !== userId));
        alert("User deleted successfully!");
      } else {
        alert(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        alert(
          `Server error: ${error.response.status} ${error.response.statusText}`
        );
      } else if (error.request) {
        alert("Network error: Cannot reach backend.");
      } else {
        alert(`Error: ${error.message}`);
      }
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
    try {
      await axios.put("http://localhost:8080/users/update", selectedUser);
      alert("User updated successfully!");
      setShowModal(false);
      // Refresh user list
      const response = await axios.get("http://localhost:8080/users/all");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user. Try again.");
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
        <Link to="/admin/locations">Locations</Link>  {/* New admin link */}
      </li>
    </ul>
    <button
      className="logout-btn"
      onClick={() => {
        localStorage.removeItem("authToken");
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
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user.userId)}
                    >
                      Delete
                    </button>
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
