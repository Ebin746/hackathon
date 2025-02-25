import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import "./loginpartner.css";

const LoginDelivery = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        phone,
        password,
        role: "middleman",
      });

      if (response.data) {
        localStorage.clear(); 
        localStorage.setItem("userId", response.data.middleman._id); // Store middleman ID
        localStorage.setItem("isLoggedIn", "true");
        navigate("/partner-dashboard");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <header className="home-header">
        <nav className="home-nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
        <p>
          Don't have an account? <Link to="/delivery-signup">Sign Up</Link>
        </p>
      </header>
      <div className="login-container">
        <h2>Delivery Partner Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
};

export default LoginDelivery;