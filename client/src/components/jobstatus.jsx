import React, { useState, useEffect } from "react";
import axios from "axios";
import "./jobstatus.css";

const JobStatus = () => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const middlemanId = localStorage.getItem("middlemanId");

  useEffect(() => {
    fetchAssignedItems();
  }, []);

  const fetchAssignedItems = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/middleman/assigned-items",
        { id: middlemanId }
      );
      console.log("Fetched items:", response.data);
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setLoading(false);
    }
  };

  const verifyItem = async (itemId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/middleman/verify-item",
        { itemId }
      );
      console.log("Verification response:", response.data);

      // Hardcode paymentIsDone: true (no blockchain)
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId
            ? {
                ...item,
                status: "Verified",
                ethValue: response.data.item.ethValue,
                paymentIsDone: true,
              }
            : item
        )
      );
      setStatus("Item verified successfully!");
    } catch (error) {
      console.error("Error verifying item:", error);
      setStatus("Failed to verify item.");
    }
  };

  return (
    <main className="app">
      <header className="app-header">
        <h1>Assigned Items</h1>
      </header>

      <section className="item-section">
        {loading ? (
          <p className="loading">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="no-items">No assigned items found.</p>
        ) : (
          <div className="item-list">
            {items.map((item) => (
              <article key={item._id} className="item-card">
                <h2>{item.name}</h2>
                <div className="item-details">
                  <p><strong>Material:</strong> {item.type}</p>
                  <p><strong>Weight:</strong> {item.quantity} kg</p>
                  <p>
                    <strong>Assigned Date:</strong>{" "}
                    {new Date(item.date).toLocaleDateString("en-GB")}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </p>
                  {item.ethValue && (
                    <p className="eth-value">
                      <strong>ETH Value:</strong> {item.ethValue} ETH
                    </p>
                  )}
                </div>
                <div className="buttons">
                  {item.status !== "Verified" ? (
                    <button
                      onClick={() => verifyItem(item._id)}
                      className="button verify-btn"
                    >
                      Verify
                    </button>
                  ) : (
                    <p className="payment-done">Payment Completed</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {status && <p className="status-message">{status}</p>}
    </main>
  );
};

export default JobStatus;