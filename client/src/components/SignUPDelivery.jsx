// src/components/MiddlemanSignup.jsx

import React, { useState } from "react";
import axios from "axios";

const MiddlemanSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  });
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");

  // Prompt MetaMask to connect and grab the first account
  const connectWallet = async () => {
    if (!window.ethereum) {
      setMessage("MetaMask not detected");
      return;
    }
    try {
      const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(account);
      setMessage("");  // clear any previous error
    } catch (err) {
      setMessage("Wallet connection rejected");
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!walletAddress) {
      setMessage("Please connect your wallet first");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/signup", {
        ...formData,
        role: "middleman",
        walletAddress,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error during signup");
    }
  };

  return (
    <div className="signup-container">
      <h2>Middleman Sign Up</h2>

      {!walletAddress ? (
        <button type="button" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <p>Wallet: {walletAddress}</p>
      )}

      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>

      {message && <p className="signup-message">{message}</p>}
    </div>
  );
};

export default MiddlemanSignup;
