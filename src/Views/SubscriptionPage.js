import { useState, useEffect } from "react";
import "../styles/SubscriptionPage.css";

export default function SubscriptionPage() {
  const [subscriptionTypes, setSubscriptionTypes] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);

  // Load mock data
  useEffect(() => {
    const types = [
      { id: "1", name: "Basic", price: 50, duration: "1 Month", features: ["Standard Forecast"] },
      { id: "2", name: "Premium", price: 120, duration: "1 Month", features: ["Ad-free", "Detailed Forecast"] },
      { id: "3", name: "Annual", price: 1000, duration: "12 Months", features: ["All Features"] },
    ];
    setSubscriptionTypes(types);

    const userSubs = [
      { id: "101", subscriptionType: types[0], startDate: "2025-08-01", endDate: "2025-08-31", active: true },
      { id: "102", subscriptionType: types[2], startDate: "2025-01-01", endDate: "2025-12-31", active: false },
    ];
    setUserSubscriptions(userSubs);
  }, []);

  const subscribe = (type) => {
    if (!userSubscriptions.find(sub => sub.subscriptionType.id === type.id)) {
      const newSub = {
        id: Date.now().toString(),
        subscriptionType: type,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
        active: true
      };
      setUserSubscriptions(prev => [...prev, newSub]);
    }
  };

  const unsubscribe = (id) => {
    setUserSubscriptions(prev =>
      prev.map(sub => sub.id === id ? { ...sub, active: false } : sub)
    );
  };

  return (
    <div className="subscription-page">
      <h1>Subscriptions</h1>

      <section className="available-subscriptions">
        <h2>Available Plans</h2>
        <div className="subscription-grid">
          {subscriptionTypes.map(type => (
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
          {userSubscriptions.map(sub => (
            <div key={sub.id} className={`subscription-card ${sub.active ? "active" : "inactive"}`}>
              {sub.active && <span className="active-badge">Active</span>}
              <h3>{sub.subscriptionType.name}</h3>
              <p>💰 Price: R{sub.subscriptionType.price}</p>
              <p>⏱ Duration: {sub.subscriptionType.duration}</p>
              <p>Start: {sub.startDate}</p>
              <p>End: {sub.endDate}</p>
              <p>Status: {sub.active ? "Active ✅" : "Inactive ❌"}</p>
              {sub.active && <button className="unsubscribe-btn" onClick={() => unsubscribe(sub.id)}>Unsubscribe</button>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}