import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SubscriptionPage.css";
import subscriptionImg from "../images/subscriptionImg.png";

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  const userEmail = userProfile?.email;

  const [subscriptionTypes, setSubscriptionTypes] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all subscriptions and user subscriptions
  useEffect(() => {
    if (!userEmail) return;

    const fetchSubscriptions = async () => {
      try {
        const [typesRes, userSubsRes] = await Promise.all([
          axios.get("http://localhost:8080/subscription/getAll"),
          axios.get(`http://localhost:8080/api/user-subscriptions/user/${userEmail}`),
        ]);
        setSubscriptionTypes(typesRes.data);
        setUserSubscriptions(userSubsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load subscriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [userEmail]);

  // Check if user is already subscribed
  const isSubscribed = (planName) =>
    userSubscriptions.some((sub) => sub.name === planName);

  // Subscribe to a plan
  const subscribe = async (type) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/user-subscriptions",
        {
          email: userEmail,
          name: type.name,
          price: type.price,
          duration: type.duration,
        }
      );
      setUserSubscriptions([...userSubscriptions, res.data]);
      alert(`Successfully subscribed to ${type.name} ✅`);
    } catch (err) {
      if (err.response?.status === 409) {
        alert("You are already subscribed to this plan!");
      } else if (err.response?.data?.error) {
        alert(`Error: ${err.response.data.error}`);
      } else {
        console.error(err);
        alert("Failed to subscribe ❌");
      }
    }
  };

  if (!userEmail) return <p>Please log in to subscribe.</p>;
  if (loading) return <p>Loading subscriptions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="subscription-page">
      <nav className="subscription-navbar">
        <h1>Subscription</h1>
        <div className="navbar-right">
          <button className="navbar-btn dashboard" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
        </div>
      </nav>

      <header className="subscription-header">
        <h1>Level up your forecast</h1>
      </header>

      <div className="subscription-image">
        <img src={subscriptionImg} alt="Subscription Preview" />
      </div>

      <section className="plans-section">
        {subscriptionTypes.map((type) => {
          const subscribed = isSubscribed(type.name);
          return (
            <div key={type.subscriptionId} className="plan-card">
              {subscribed && <div className="subscribed-badge">Subscribed</div>}
              {type.trial && !subscribed && <div className="trial-badge">{type.trial}</div>}

              <h2>{type.name}</h2>
              <p className="price">
                R{type.price} <span>{type.billing}</span>
              </p>

              <div className="features-list">
                {type.features?.map((feature, idx) => (
                  <div key={idx} className="feature-item">
                    <span>✔</span> {feature}
                  </div>
                ))}
              </div>

              <button
                onClick={() => subscribe(type)}
                className={`subscribe-btn ${subscribed ? "subscribed-btn" : ""}`}
                disabled={subscribed}
              >
                {subscribed
                  ? "Subscribed"
                  : type.trial
                  ? "Start My Trial"
                  : "Subscribe"}
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
}
