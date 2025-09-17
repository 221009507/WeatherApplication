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

  useEffect(() => {
    if (!userEmail) return;

    axios
      .get("http://localhost:8080/subscription/getAll")
      .then((res) => setSubscriptionTypes(res.data))
      .catch((err) => console.error(err));

    axios
      //.get(`http://localhost:8080/api/user-subscriptions/user?email=${userEmail}`)
      .get(`http://localhost:8080/api/user-subscriptions/user/${userEmail}`)

      .then((res) => setUserSubscriptions(res.data))
      .catch((err) => console.error(err));
  }, [userEmail]);

  const subscribe = (type) => {
    console.log("current subscriptions:", userSubscriptions);
    axios
      .post("http://localhost:8080/api/user-subscriptions", {
        email: userEmail,
        name: type.name,
        price: type.price,
        duration: type.duration,
      })
      .then((res) => setUserSubscriptions([...userSubscriptions, res.data]))
      .catch((err) => console.error(err));
  };

  const isSubscribed = (planName) =>
    userSubscriptions.some((sub) => sub.name === planName);

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
        {subscriptionTypes.map((type) => (
          <div key={type.subscriptionId} className="plan-card">
            {isSubscribed(type.name) && <div className="subscribed-badge">Subscribed</div>}
            {type.trial && <div className="trial-badge">{type.trial}</div>}

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
              className="subscribe-btn"
              disabled={isSubscribed(type.name)}
            >
              {isSubscribed(type.name)
                ? "Subscribed"
                : type.trial
                ? "Start My Trial"
                : "Subscribe"}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
