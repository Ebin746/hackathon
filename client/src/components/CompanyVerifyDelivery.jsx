import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ethers } from "ethers";
import ABIs from "../../../blockchain/artifacts/contracts/WastePayoutManager.sol/WastePayoutManager.json";
import "./companyverifydelivery.css";

const ABI = ABIs.abi;
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // ✅ Hardcoded

const CompanyVerifyDelivery = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({});
  const [paymentStatus, setPaymentStatus] = useState({});
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
        carbonCreditsGenerated: parseFloat(formData[itemId]?.carbonCredits || 1),
      });
      alert(response.data.message);
      setItems(items.map((item) => 
        item._id === itemId ? response.data.item : item
      ));
      setFormData({ ...formData, [itemId]: undefined });
    } catch (error) {
      alert(error.response?.data?.message || "Error verifying delivery");
    }
  };

  const handlePayment = async (amt, itemId, type) => {
    const addressMap = {
      user: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      deliveryBoy: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    };
    const to = addressMap[type];

    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    try {
      setPaymentStatus((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], [type]: "⏳ Waiting for signature…" },
      }));

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS, // ✅ Using hardcoded address
        ABI,
        signer
      );

      const method = type === "user" ? "sendToUser" : "sendToDeliveryBoy";
      const tx = await contract[method](to, {
        value: ethers.parseEther(amt.toString()),
      });

      setPaymentStatus((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], [type]: "⏳ Transaction sent, awaiting confirmation…" },
      }));

      await tx.wait();

      setPaymentStatus((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], [type]: "✅ Sent!" },
      }));

      await axios.post("http://localhost:3000/api/middleman/update-payment", {
        itemId,
      });
    } catch (e) {
      console.error(e);
      setPaymentStatus((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [type]: "❌ " + (e.message || e),
        },
      }));
    }
  };

  return (
    <>
      <header className="home-header">
        <nav className="home-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/company-dashboard">Dashboard</Link></li>
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
              <p>ETH Value: {item.ethValue}</p>
              <p>Status: {item.status}</p>

              {item.status !== "CompanyVerified" ? (
                <>
                  <input
                    type="number"
                    placeholder="Carbon Credits Generated"
                    value={formData[item._id]?.carbonCredits || ""}
                    onChange={(e) =>
                      handleChange(item._id, "carbonCredits", e.target.value)
                    }
                  />
                  <button onClick={() => handleVerify(item._id)}>Verify Delivery</button>
                </>
              ) : (
                <div className="payment-section">
                  <button
                    onClick={() => handlePayment(item.ethValue, item._id, "user")}
                    disabled={paymentStatus[item._id]?.user === "✅ Sent!"}
                  >
                    Pay to User
                  </button>
                  <p>{paymentStatus[item._id]?.user || ""}</p>

                  <button
                    onClick={() => handlePayment(item.ethValue, item._id, "deliveryBoy")}
                    disabled={paymentStatus[item._id]?.deliveryBoy === "✅ Sent!"}
                  >
                    Pay to Delivery Boy
                  </button>
                  <p>{paymentStatus[item._id]?.deliveryBoy || ""}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default CompanyVerifyDelivery;
