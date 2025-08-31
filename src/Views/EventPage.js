import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/EventPage.css";

export default function EventPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Load events from backend
  useEffect(() => {
    axios.get("http://localhost:8080/event/getAll")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));
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
            <p>🏛 Venue: {event.venue?.name || "N/A"}</p>
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
            <p><strong>Name:</strong> {selectedEvent.venue?.name}</p>
            <p><strong>Address:</strong> {selectedEvent.venue?.address}</p>
            <p><strong>Capacity:</strong> {selectedEvent.venue?.capacity}</p>
          </div>

          <div className="participants-section">
            <h3>Participants 👥</h3>
            {selectedEvent.participants?.length > 0 ? (
              selectedEvent.participants.map((p) => (
                <div key={p.participantId} className="participant-card">
                  <p><strong>{p.name}</strong></p>
                  <p>📧 {p.email}</p>
                  <p>📞 {p.phoneNumber}</p>
                </div>
              ))
            ) : (
              <p>No participants registered yet.</p>
            )}
          </div>

          <button onClick={() => setSelectedEvent(null)}>Close</button>
        </div>
      )}
    </div>
  );
}