import { useState, useEffect } from "react";
import "../styles/VenuesPage.css";

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);

  // form state
  const [formData, setFormData] = useState({
    venueId: "",
    name: "",
    address: "",
    capacity: ""
  });

  // load venues from backend
  useEffect(() => {
    fetch("http://localhost:8080/venue/getAll")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch venues");
        return res.json();
      })
      .then(data => setVenues(data))
      .catch(err => console.error("Error loading venues:", err));
  }, []);

  // handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // create new venue
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/venue/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueId: formData.venueId,
          name: formData.name,
          address: formData.address,
          capacity: parseInt(formData.capacity, 10)
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create venue");
      }

      const newVenue = await response.json();
      setVenues(prev => [...prev, newVenue]); // add to UI
      setFormData({ venueId: "", name: "", address: "", capacity: "" }); // reset form
    } catch (err) {
      console.error("Error creating venue:", err);
    }
  };

  return (
    <div className="venues-page">
      <h1>Venues 🏛️</h1>

      {/* Venue Form */}
      <form className="venue-form" onSubmit={handleSubmit}>
        <h2>Add New Venue</h2>
        <input
          type="text"
          name="venueId"
          placeholder="Venue ID"
          value={formData.venueId}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Venue Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Venue</button>
      </form>

      {/* Venue List */}
      <div className="venues-grid">
        {venues.map(v => (
          <div 
            key={v.venueId} 
            className="venue-card"
            onClick={() => setSelectedVenue(v)}
          >
            <h3>{v.name}</h3>
            <p>📍 {v.address}</p>
            <p>👥 Capacity: {v.capacity}</p>
          </div>
        ))}
      </div>

      {/* Venue Details */}
      {selectedVenue && (
        <div className="venue-details">
          <h2>Venue Details</h2>
          <p><strong>Name:</strong> {selectedVenue.name}</p>
          <p><strong>Address:</strong> {selectedVenue.address}</p>
          <p><strong>Capacity:</strong> {selectedVenue.capacity}</p>
          <button onClick={() => setSelectedVenue(null)}>Close</button>
        </div>
      )}
    </div>
  );
}