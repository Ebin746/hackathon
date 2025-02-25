import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import "./signupclient.css"; // Create this CSS file for styling

const SignUpClient = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call your API to register the client user
    // For now, simply navigate to the client dashboard after sign-up
      // Create an object with the client data
      const clientData = {
        fullName,
        email,
        password,
        walletAddress,
        phoneNumber,
      };
      localStorage.setItem("clientData", JSON.stringify(clientData));
    navigate('/client-dashboard');
  };

  return (
    <>
      <header className="home-header">
        <nav className="home-nav">
          <ul>
            <li>
              <Link to="/">home</Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className="signup-container">
        <h2>Client Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
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
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link to="/client-login">Login here</Link>
        </p>
      </div>
    </>
  );
};

export default SignUpClient;