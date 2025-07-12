import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./companylogin.css";

const CompanyLogin = () => {
  const [formData, setFormData] = useState({
    walletAddress: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConnectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setFormData({ ...formData, walletAddress: accounts[0] });
      } catch (error) {
        alert("MetaMask connection failed");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/company/login", formData);
      if (response.data.company) {
        localStorage.clear();
        localStorage.setItem("companyId", response.data.company.id);
        localStorage.setItem("role", "company");
        navigate("/company-dashboard");
      } else {
        alert(response.data.message);
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
          Don't have an account? <Link to="/company-signup">Sign Up</Link>
        </p>
      </header>

      <div className="login-container">
        <h2>Company Login</h2>
        <form onSubmit={handleSubmit}>
          <button type="button" onClick={handleConnectMetaMask}>
            Connect MetaMask
          </button>
          <input
            type="text"
            name="walletAddress"
            value={formData.walletAddress}
            readOnly
            placeholder="MetaMask Wallet Address"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
};

export default CompanyLogin;