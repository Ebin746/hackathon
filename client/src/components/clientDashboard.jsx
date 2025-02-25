import React, { useState, useEffect } from "react";
import axios from "axios";
import "./clientdashboard.css";

const ClientDashboard = () => {
  // Use a constant userId for th
  const userId = localStorage.getItem("userId") || "67bc5817afb8c019a8581a73";

  // Form state for adding an item
  const [itemType, setItemType] = useState("paper");
  const [quantity, setQuantity] = useState("");
  const [scheduledDate, setScheduledDate] = useState(""); // New state for scheduled date
  const [status, setStatus] = useState("");

  // List of items added by the user
  const [items, setItems] = useState([]);

  // Mapping for placeholder images based on item type (update paths to images in your public folder)
  const imageMapping = {
    paper: "/images/paper.png",
    electronics: "/images/electronics.png",
    glass: "/images/glass.png",
    furniture: "/images/furniture.png",
    plastic: "/images/plastic.png",
  };

  // Fetch the user's added items from the backend
  const fetchItems = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/user/items/${userId}`);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
      setStatus("Error fetching items: " + error.message);
    }
  };

  // Fetch items when the component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  // Handle form submission to add an item
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!quantity) {
      setStatus("Please enter quantity.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/api/user/add-item", {
        userId,
        type: itemType,
        quantity,
        scheduledDate, // Send the scheduled date to backend
      });
      setStatus(response.data.message);
      setQuantity("");
      setScheduledDate(""); // Clear the date input after submission
      // Refresh the items list after adding
      fetchItems();
    } catch (error) {
      console.error("Error adding item:", error);
      setStatus("Error adding item: " + error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Client Dashboard</h1>
        <p>Welcome, Client! Manage your recyclable items here.</p>
      </header>

      {/* Form Section */}
      <section className="form-section">
        <div className="card form-card">
          <h2>Add a Recyclable Item</h2>
          <form onSubmit={handleAddItem}>
            <div className="form-group">
              <label htmlFor="itemType">Item Type</label>
              <select
                id="itemType"
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
              >
                <option value="paper">Paper</option>
                <option value="electronics">Electronics</option>
                <option value="glass">Glass</option>
                <option value="furniture">Furniture</option>
                <option value="plastic">Plastic</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity (in Kg)</label>
              <input
                type="number"
                id="quantity"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="scheduledDate">Schedule Date</label>
              <input
                type="date"
                id="scheduledDate"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            <div className="form-group image-preview">
              <label>Image Preview</label>
              <img
              //src={imageMapping[item.type.toLowerCase()] || "https://placehold.co/600x400"}
              src={"https://placehold.co/600x400"}
              alt={itemType} />
            </div>
            <button type="submit" className="submit-btn">
              Add Item
            </button>
          </form>
          {status && <p className="status-message">{status}</p>}
        </div>
      </section>

      {/* Items Section */}
      <section className="items-section">
        <div className="card items-card">
          <h2>Your Added Items</h2>
          {items.length === 0 ? (
            <p className="no-items">No items added yet.</p>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div key={item._id} className="item-card">
                  <img
                    //src={imageMapping[item.type.toLowerCase()] || "https://placehold.co/600x400"}
                    src={"https://placehold.co/600x400"}
                    alt={item.type}
                    className="item-image"
                  />
                  <div className="item-details">
                    <p>
                      <strong>Type:</strong> {item.type}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {item.quantity} Kg
                    </p>
                    <p>
                      <strong>Status:</strong> {item.status}
                    </p>
                    {item.scheduledDate && (
                      <p>
                        <strong>Schedule Date:</strong>{" "}
                        {new Date(item.scheduledDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ClientDashboard;
