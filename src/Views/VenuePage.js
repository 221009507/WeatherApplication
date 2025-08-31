import { useState, useEffect } from "react";
import "../styles/VenuesPage.css";

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);

  // Mock venue data
  useEffect(() => {
    setVenues([
      { venueId: "v1", name: "City Hall", address: "123 Main St", capacity: 500 },
      { venueId: "v2", name: "Grand Arena", address: "456 Broad Ave", capacity: 2000 },
      { venueId: "v3", name: "Riverside Park", address: "789 River Rd", capacity: 300 },
    ]);
  }, []);

  return (
    <div className="venues-page">
      <h1>Venues 🏛️</h1>
      
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