import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import "./loginclient.css";

const LoginClient = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        phone,
        password,
        role: "user",
      });

      if (response.data) {
        const { user, middleman } = response.data;

        if (user) {
          localStorage.clear();
          localStorage.setItem("userId", user._id); // Store user ID
          localStorage.setItem("role", "user");
          navigate("/client-dashboard");
        } else if (middleman) {
          localStorage.setItem("userId", middleman._id); // Store middleman ID
          localStorage.setItem("role", "middleman");
          navigate("/middleman-dashboard");
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please try again.");
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
          Don't have an account? <Link to="/client-signup">Sign Up</Link>
        </p>
      </header>

      <div className="login-container">
        <h2>Client Login</h2>
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

export default LoginClient;
