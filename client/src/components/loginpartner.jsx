import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import "./loginpartner.css";

const LoginDelivery = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState(""); // New state for wallet address
  const [phoneNumber, setPhoneNumber] = useState(""); // New state for phone number
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleSubmit = (e) => {
    e.preventDefault();
    // alert(`Delivery Partner Login Attempted with: ${email}`);
    navigate('/partner-dashboard')

  };

  return (
    <>
    <header className="home-header">
            <nav className="home-nav">
              <ul>
                <li>
                  <Link to="/" > home </Link>
                </li>
              </ul>
            </nav>
          </header>
    <div className="login-container">
      <h2>Delivery Partner Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
    </>
  );
};

export default LoginDelivery;
