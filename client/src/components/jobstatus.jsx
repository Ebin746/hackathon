import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ABI from "../../../blockchain/artifacts/contracts/RecyclingSystem.sol/PaymentForwarder.json";
import axios from "axios";
import "./jobstatus.css";

// Smart Contract Details
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = ABI.abi;

const JobStatus = () => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      console.log("MetaMask detected:", window.ethereum);
    } else {
      console.error("MetaMask not detected. Please install MetaMask.");
      setStatus("MetaMask not detected. Please install MetaMask.");
    }
    fetchAssignedItems();
  }, []);

  // Fetch assigned items from the backend
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

  // Verify an individual item
  const verifyItem = async (itemId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/middleman/verify-item",
        { itemId }
      );
      console.log("Verification response:", response.data);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId
            ? { 
                ...item, 
                status: "Verified", 
                ethValue: response.data.item.ethValue 
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error verifying item:", error);
    }
  };

  // Request account connection via MetaMask
  const requestAccounts = async () => {
    if (!window.ethereum) {
      setStatus("MetaMask not found. Please install it.");
      return null;
    }
    try {
      console.log("Requesting MetaMask accounts...");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("Accounts:", accounts);
      return accounts[0]; // Return the first account
    } catch (error) {
      console.error("MetaMask connection error:", error);
      setStatus("MetaMask connection failed: " + error.message);
      return null;
    }
  };

  // Forward ETH payment via smart contract and update payment status via API
  const forwardFunds = async (recipient, amount, itemId) => {
    if (!window.ethereum) {
      setStatus("Please install MetaMask.");
      return;
    }
    try {
      setLoading(true);
      const account = await requestAccounts(); // Ensure MetaMask connection
      if (!account) {
        setStatus("MetaMask connection rejected.");
        setLoading(false);
        return;
      }
  
      console.log("Connected MetaMask account:", account);
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("Signer retrieved:", signer);
  
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      console.log("Contract connected:", contract);
  
      const ethAmount = ethers.parseEther(amount.toString());
      console.log("Sending transaction with:", { recipient, ethAmount });
  
      const tx = await contract.forwardFunds(recipient, ethAmount, { value: ethAmount });
      setStatus("Transaction sent... Waiting for confirmation");
      await tx.wait();
      setStatus(`Transaction confirmed: ${tx.hash}`);
  
      // Call API endpoint to update payment status in the backend
      await axios.post("http://localhost:3000/api/middleman/update-payment", { itemId });
  
      // Update local state to mark payment as done for this item
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, paymentIsDone: true } : item
        )
      );
    } catch (error) {
      console.error("Transaction error:", error);
      setStatus("Transaction failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Assigned Items</h1>

      {/* Test button to connect MetaMask separately */}
      <button
        onClick={async () => {
          const acct = await requestAccounts();
          if (acct) setStatus("Connected: " + acct);
        }}
        className="connect-btn"
      >
        Connect MetaMask
      </button>

      {items.length === 0 ? (
        <p className="no-items">No assigned items found.</p>
      ) : (
        <div className="item-list">
          {items.map((item) => (
            <div key={item._id} className="item-card">
              <h2>{item.name}</h2>
              <p><strong>Material:</strong> {item.type}</p>
              <p><strong>Weight:</strong> {item.quantity} </p>
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
                ) : item.paymentIsDone ? (
                  <p className="payment-done">Payment Completed</p>
                ) : (
                  <button
                    onClick={() =>
                      forwardFunds(item.user.walletAddress, item.ethValue, item._id)
                    }
                    disabled={loading}
                    className={`button pay-btn ${loading ? "disabled" : ""}`}
                  >
                    {loading ? "Processing..." : "Verify & Pay"}
                  </button>
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
