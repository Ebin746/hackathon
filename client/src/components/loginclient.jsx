import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./loginclient.css";

const LoginClient = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not detected. Please install MetaMask!");
        return;
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const walletAddress = accounts[0];

      const response = await axios.post("http://localhost:3000/api/login", {
        walletAddress,
        role: "user",
      });

      if (response.data.user) {
        localStorage.clear();
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("role", "user");
        navigate("/client-dashboard");
      } else {
        alert(response.data.message || "Login failed");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <header className="home-header">
        <nav className="home-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
          </ul>
        </nav>
        <p>
          Don't have an account? <Link to="/client-signup">Sign Up</Link>
        </p>
      </header>

      <div className="login-container">
        <h2>Client Login</h2>
        <button onClick={handleLogin}>Login with MetaMask</button>
      </div>
    </>
  );
};

export default LoginClient;
