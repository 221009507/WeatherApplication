import { useState, useEffect } from "react";
import "../styles/ReportsPage.css";

export default function ReportsPage() {
  const [healthReports, setHealthReports] = useState([]);
  const [journalReports, setJournalReports] = useState([]);
  const [accuracyReports, setAccuracyReports] = useState([]);

  // Load mock data
  useEffect(() => {
    setHealthReports([
      {
        reportId: "h1",
        weatherReport: "Sunny Day",
        entries: ["Felt great today", "Ran 5km", "Slept 7 hours"],
        userId: "user123",
      },
      {
        reportId: "h2",
        weatherReport: "Cloudy Morning",
        entries: ["Felt tired", "Yoga session", "Slept 6 hours"],
        userId: "user123",
      },
    ]);

    setJournalReports([
      {
        journalId: "j1",
        weatherReport: "Sunny Day",
        entries: ["Had a productive morning", "Read a book"],
        timestamp: "2025-08-25 08:00",
        userId: "user123",
      },
      {
        journalId: "j2",
        weatherReport: "Cloudy Morning",
        entries: ["Busy work day", "Meditation in evening"],
        timestamp: "2025-08-26 09:30",
        userId: "user123",
      },
    ]);

    setAccuracyReports([
      {
        reportId: "a1",
        weatherReport: "Sunny Day",
        entries: ["Forecast accurate by 90%", "Temperature prediction off by 1°C"],
        userId: "user123",
      },
      {
        reportId: "a2",
        weatherReport: "Cloudy Morning",
        entries: ["Forecast accurate by 85%", "Wind prediction off by 2 km/h"],
        userId: "user123",
      },
    ]);
  }, []);

  const renderEntries = (entries) => (
    <ul>
      {entries.map((entry, idx) => (
        <li key={idx}>• {entry}</li>
      ))}
    </ul>
  );

  return (
    <div className="reports-page">
      <h1>Reports Dashboard 📊</h1>

      {/* Health Reports */}
      <section>
        <h2>Health Logs</h2>
        <div className="report-grid">
          {healthReports.map((r) => (
            <div key={r.reportId} className="report-card health">
              <p>🌤 Related Weather: {r.weatherReport}</p>
              <p>👤 User: {r.userId}</p>
              <p>📝 Entries:</p>
              {renderEntries(r.entries)}
            </div>
          ))}
        </div>
      </section>

      {/* Journal Reports */}
      <section>
        <h2>Journal Entries</h2>
        <div className="report-grid">
          {journalReports.map((r) => (
            <div key={r.journalId} className="report-card journal">
              <p>🌤 Related Weather: {r.weatherReport}</p>
              <p>⏰ Timestamp: {r.timestamp}</p>
              <p>👤 User: {r.userId}</p>
              <p>📝 Entries:</p>
              {renderEntries(r.entries)}
            </div>
          ))}
        </div>
      </section>

      {/* Accuracy Reports */}
      <section>
        <h2>Forecast Accuracy</h2>
        <div className="report-grid">
          {accuracyReports.map((r) => (
            <div key={r.reportId} className="report-card accuracy">
              <p>🌤 Related Weather: {r.weatherReport}</p>
              <p>👤 User: {r.userId}</p>
              <p>📝 Accuracy Entries:</p>
              {renderEntries(r.entries)}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}