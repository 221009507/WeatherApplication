import { useState, useEffect } from "react";
import "../styles/EventPage.css";

export default function EventPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock data
  useEffect(() => {
    setEvents([
      {
        eventId: "e1",
        title: "Tech Conference 2025",
        date: "2025-09-30",
        location: "City Hall",
        description: "Annual tech meetup.",
        venue: { venueId: "v1", name: "City Hall", address: "123 Main St", capacity: 500 },
        participants: [
          { participantId: "p1", name: "Alice Johnson", email: "alice@example.com", phoneNumber: "+27 123 456 789" },
          { participantId: "p2", name: "Bob Smith", email: "bob@example.com", phoneNumber: "+27 987 654 321" },
        ],
      },
      {
        eventId: "e2",
        title: "Music Festival",
        date: "2025-10-15",
        location: "Grand Arena",
        description: "Live music performances.",
        venue: { venueId: "v2", name: "Grand Arena", address: "456 Broad Ave", capacity: 2000 },
        participants: [
          { participantId: "p3", name: "Charlie Lee", email: "charlie@example.com", phoneNumber: "+27 456 789 123" },
        ],
      },
    ]);
  }, []);

  return (
    <div className="event-page">
      <h1>Events 🎉</h1>

      <div className="events-grid">
        {events.map((event) => (
          <div 
            key={event.eventId} 
            className="event-card"
            onClick={() => setSelectedEvent(event)}
          >
            <h3>{event.title}</h3>
            <p>📅 {event.date}</p>
            <p>📍 {event.location}</p>
            <p>📝 {event.description}</p>
            <p>🏛 Venue: {event.venue.name}</p>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="event-details">
          <h2>{selectedEvent.title}</h2>
          <p>📅 Date: {selectedEvent.date}</p>
          <p>📍 Location: {selectedEvent.location}</p>
          <p>📝 Description: {selectedEvent.description}</p>

          <div className="venue-section">
            <h3>Venue Details 🏛</h3>
            <p><strong>Name:</strong> {selectedEvent.venue.name}</p>
            <p><strong>Address:</strong> {selectedEvent.venue.address}</p>
            <p><strong>Capacity:</strong> {selectedEvent.venue.capacity}</p>
          </div>

          <div className="participants-section">
            <h3>Participants 👥</h3>
            {selectedEvent.participants.map(p => (
              <div key={p.participantId} className="participant-card">
                <p><strong>{p.name}</strong></p>
                <p>📧 {p.email}</p>
                <p>📞 {p.phoneNumber}</p>
              </div>
            ))}
          </div>

          <button onClick={() => setSelectedEvent(null)}>Close</button>
        </div>
      )}
    </div>
  );
}