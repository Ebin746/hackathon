// CLIENT LOGIN
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './loginclient.css' ;

const LoginClient = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState(""); // New state for wallet address
  const [phoneNumber, setPhoneNumber] = useState(""); // New state for phone number
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleSubmit = (e) => {
    e.preventDefault();
    // alert(Client Login Attempted with: ${email});
        // Redirect to the client dashboard page (create this page later)
        const storedClientData = localStorage.getItem("clientData");

        if (storedClientData) {
          const clientData = JSON.parse(storedClientData);
    
          // Validate email and password (basic example)
          if (email === clientData.email && password === clientData.password) {
            // Optionally, store a login flag in local storage
            localStorage.setItem("isLoggedIn", "true");
    
            // Navigate to the client dashboard
            navigate("/client-dashboard");
          } else {
            alert("Incorrect email or password.");
          }
        } else {
          alert("No client found. Please sign up first.");
        }
        

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
        <p>
  Don't have an account? <Link to="/client-signup">Sign Up</Link>
</p>
      </header>
    <div className="login-container">
      <h2>Client Login</h2>
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

export default LoginClient;