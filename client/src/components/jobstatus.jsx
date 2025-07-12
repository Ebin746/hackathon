import React, { useState, useEffect } from "react";
import axios from "axios";
import "./jobstatus.css";

const JobStatus = () => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssignedItems();
  }, []);

  const fetchAssignedItems = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/middleman/assigned-items",
        { id: "67bc5864afb8c019a8581a75" }
      );
      console.log("Fetched items:", response.data);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
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
    } catch (error) {
      console.error("Error verifying item:", error);
    }
  };

  return (
    <div className="app">
      <h1>Assigned Items</h1>

      {items.length === 0 ? (
        <p className="no-items">No assigned items found.</p>
      ) : (
        <div className="item-list">
          {items.map((item) => (
            <div key={item._id} className="item-card">
              <h2>{item.name}</h2>
              <p><strong>Material:</strong> {item.type}</p>
              <p><strong>Weight:</strong> {item.quantity}</p>
              <p>
                <strong>Assigned Date:</strong>{" "}
                {new Date(item.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="status">{item.status}</span>
              </p>

              {item.ethValue && (
                <p className="eth-value">
                  <strong>ETH Value:</strong> {item.ethValue} ETH
                </p>
              )}

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
            </div>
          ))}
        </div>
      )}

      <p className="status-message">{status}</p>
    </div>
  );
};

export default JobStatus;
