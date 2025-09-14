import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/AdminDashBoard.css";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/all");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        alert("Failed to fetch users. Redirecting to login.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Handle delete user with detailed error handling
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await axios.delete(`http://localhost:8080/api/users/${userId}`, {
        timeout: 5000,
      });

      if (response.status === 204) {
        setUsers(users.filter((user) => user.userId !== userId));
        alert("User deleted successfully!");
      } else {
        alert(`Unexpected response: ${response.status}`);
      }

    } catch (error) {
      if (error.response) {
        console.error("Server error:", error.response);
        alert(`Server error: ${error.response.status} ${error.response.statusText}`);
      } else if (error.request) {
        console.error("Network error:", error.request);
        alert("Network error: Cannot reach backend. Make sure your server is running on localhost:8080");
      } else {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
      }
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
          </ul>
          <button
            className="logout-btn"
            onClick={() => {
              // Clear auth token if you have one
              localStorage.removeItem("authToken"); // or sessionStorage
              navigate("/"); // navigate to home page
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
                  <td>{user.credentials?.email}</td>
                  <td>{user.gender}</td>
                  <td>{user.phoneNumber}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/edit-user/${user.userId}`)}
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
    </div>
  );
}
