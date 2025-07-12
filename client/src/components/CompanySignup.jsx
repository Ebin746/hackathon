import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./companysignup.css";

const CompanySignup = () => {
  const [formData, setFormData] = useState({
    walletAddress: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    companyType: "Recycling Plant",
    address: "",
    city: "",
    country: "",
    lat: "",
    long: "",
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
      const response = await axios.post("http://localhost:3000/api/company/register", {
        ...formData,
        location: {
          address: formData.address,
          city: formData.city,
          country: formData.country,
          lat: parseFloat(formData.lat),
          long: parseFloat(formData.long),
        },
      });
      alert(response.data.message);
      navigate("/company-login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed. Please try again.");
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
          Already have an account? <Link to="/company-login">Login</Link>
        </p>
      </header>

      <div className="signup-container">
        <h2>Company Signup</h2>
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
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Company Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <select name="companyType" value={formData.companyType} onChange={handleChange}>
            <option value="Recycling Plant">Recycling Plant</option>
            <option value="Waste Management">Waste Management</option>
            <option value="Climate Investor">Climate Investor</option>
            <option value="Carbon Credit Company">Carbon Credit Company</option>
          </select>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
          />
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
          />
          <input
            type="number"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            placeholder="Latitude"
          />
          <input
            type="number"
            name="long"
            value={formData.long}
            onChange={handleChange}
            placeholder="Longitude"
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </>
  );
};

export default CompanySignup;