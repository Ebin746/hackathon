import React, { useState } from "react";
import axios from "axios";
//import "./signup.css";

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/signup", {
        ...formData,
        role: "user",
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error during signup");
    }
  };

  return (
    <div className="signup-container">
      <h2>User Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Sign Up</button>
        {message && <p className="signup-message">{message}</p>}
      </form>
    </div>
  );
};

export default UserSignup;
