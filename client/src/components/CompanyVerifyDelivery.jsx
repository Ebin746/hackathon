import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./companyverifydelivery.css";

const CompanyVerifyDelivery = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/company/available-items");
        setItems(response.data);
      } catch (error) {
        alert(error.response?.data?.message || "Error fetching items");
      }
    };
    if (companyId) {
      fetchItems();
    } else {
      navigate("/company-login");
    }
  }, [companyId, navigate]);

  const handleChange = (itemId, field, value) => {
    setFormData({
      ...formData,
      [itemId]: { ...formData[itemId], [field]: value },
    });
  };

  const handleVerify = async (itemId) => {
    try {
      const response = await axios.post("http://localhost:3000/api/company/verify-middleman-delivery", {
        itemId,
        companyId,
        quantityVerified: parseInt(formData[itemId]?.quantityVerified || 0),
        carbonCreditsGenerated: parseFloat(formData[itemId]?.carbonCredits || 1),
      });
      alert(response.data.message);
      setItems(items.filter((item) => item._id !== itemId));
      setFormData({ ...formData, [itemId]: undefined });
    } catch (error) {
      alert(error.response?.data?.message || "Error verifying delivery");
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
            <li>
              <Link to="/company-dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>
      </header>

      <div className="verify-container">
        <h2>Verify Middleman Deliveries</h2>
        {items.length === 0 ? (
          <p>No items available for verification</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="item-card">
              <p>Type: {item.type}</p>
              <p>Quantity: {item.quantity}</p>
              <p>User: {item.user.name}</p>
              <p>Middleman: {item.assignedMiddleman.name}</p>
              <input
                type="number"
                placeholder="Verify Quantity"
                value={formData[item._id]?.quantityVerified || ""}
                onChange={(e) => handleChange(item._id, "quantityVerified", e.target.value)}
              />
              <input
                type="number"
                placeholder="Carbon Credits Generated"
                value={formData[item._id]?.carbonCredits || ""}
                onChange={(e) => handleChange(item._id, "carbonCredits", e.target.value)}
              />
              <button onClick={() => handleVerify(item._id)}>Verify Delivery</button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default CompanyVerifyDelivery;