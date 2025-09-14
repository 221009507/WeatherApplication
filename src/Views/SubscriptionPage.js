import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SubscriptionPage.css";

export default function SubscriptionPage() {
  const [subscriptionTypes, setSubscriptionTypes] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const userEmail = "testuser@example.com"; // TODO: replace with logged-in user’s email

  // Load available plans (mock for now, can later fetch from backend if you store them there)
  useEffect(() => {
    const types = [
      { id: "1", name: "Basic", price: 50, duration: "1 Month", features: ["Standard Forecast"] },
      { id: "2", name: "Premium", price: 120, duration: "1 Month", features: ["Ad-free", "Detailed Forecast"] },
      { id: "3", name: "Annual", price: 1000, duration: "12 Months", features: ["All Features"] },
    ];
    setSubscriptionTypes(types);

    // Fetch user’s subscriptions from backend
    axios
      .get(`http://localhost:8080/api/user-subscriptions/${userEmail}`)
      .then((res) => setUserSubscriptions(res.data))
      .catch((err) => console.error(err));
  }, [userEmail]);

  // Subscribe user
  const subscribe = (type) => {
    axios
      .post("http://localhost:8080/api/user-subscriptions", {
        email: userEmail,
        name: type.name,
        price: type.price,
        duration: type.duration,
      })
      .then((res) => setUserSubscriptions((prev) => [...prev, res.data]))
      .catch((err) => console.error(err));
  };

  // Unsubscribe user
  const unsubscribe = (id) => {
    axios
      .put(`http://localhost:8080/api/user-subscriptions/unsubscribe/${id}`)
      .then((res) =>
        setUserSubscriptions((prev) =>
          prev.map((sub) => (sub.id === id ? res.data : sub))
        )
      )
      .catch((err) => console.error(err));
  };

  return (
    <div className="subscription-page">
      <h1>Subscriptions</h1>

      <section className="available-subscriptions">
        <h2>Available Plans</h2>
        <div className="subscription-grid">
          {subscriptionTypes.map((type) => (
            <div key={type.id} className="subscription-card">
              <h3>{type.name}</h3>
              <p>💰 Price: R{type.price}</p>
              <p>⏱ Duration: {type.duration}</p>
              <p>⭐ Features: {type.features.join(", ")}</p>
              <button onClick={() => subscribe(type)}>Subscribe</button>
            </div>
          ))}
        </div>
      </section>

      <section className="user-subscriptions">
        <h2>My Subscriptions</h2>
        {userSubscriptions.length === 0 && <p>No subscriptions yet.</p>}
        <div className="subscription-grid">
          {userSubscriptions.map((sub) => (
            <div
              key={sub.id}
              className={`subscription-card ${sub.active ? "active" : "inactive"}`}
            >
              {sub.active && <span className="active-badge">Active</span>}
              <h3>{sub.name}</h3>
              <p>💰 Price: R{sub.price}</p>
              <p>⏱ Duration: {sub.duration}</p>
              <p>Start: {sub.startDate}</p>
              <p>End: {sub.endDate}</p>
              <p>Status: {sub.active ? "Active ✅" : "Inactive ❌"}</p>
              {sub.active && (
                <button
                  className="unsubscribe-btn"
                  onClick={() => unsubscribe(sub.id)}
                >
                  Unsubscribe
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
