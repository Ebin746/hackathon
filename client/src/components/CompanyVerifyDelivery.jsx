import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { ethers } from "ethers";
import ABIs from "../../../blockchain/artifacts/contracts/WastePayoutManager.sol/WastePayoutManager.json";

const ABI = ABIs.abi;
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #0f172a; /* Dark slate background */
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  position: absolute;
  top: 0;
  width: 100%;
  padding: 16px 24px;
  display: flex;
  justify-content: flex-start;
  background-color: #1e293b; /* Dark card background */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.5s ease-out;
`;

const Nav = styled.nav`
  ul {
    list-style: none;
    display: flex;
    gap: 16px;
  }
`;

const NavLink = styled(Link)`
  color: #d1d5db; /* Light gray */
  font-size: 1rem;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #10b981; /* Green on hover */
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #e2e8f0; /* Light gray */
  text-align: center;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.7s ease-out;
`;

const NoItems = styled.p`
  font-size: 1.125rem;
  color: #d1d5db; /* Light gray */
  text-align: center;
  animation: ${fadeIn} 0.7s ease-out;
`;

const ItemsGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  width: 100%;
  max-width: 1024px;
`;

const ItemCard = styled.div`
  background-color: #2d3748; /* Darker card background */
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 2px solid ${(props) => (props.status === "CompanyVerified" ? "#10b981" : "#4b5563")}; /* Green for CompanyVerified, gray otherwise */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: ${fadeIn} 0.7s ease-out;

  &:hover {
    transform: translateY(-4px);
    animation: ${pulse} 1.5s infinite;
  }
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.875rem;
  color: #d1d5db; /* Light gray */
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #4b5563; /* Gray border */
  border-radius: 8px;
  background-color: #2d3748; /* Dark input background */
  color: #e2e8f0; /* Light text */
  font-size: 1rem;
  animation: ${fadeIn} 0.9s ease-out;

  &::placeholder {
    color: #9ca3af; /* Gray placeholder */
  }

  &:focus {
    outline: none;
    border-color: #10b981; /* Green focus border */
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); /* Green glow */
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: #10b981; /* Green */
  color: #ffffff;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  animation: ${fadeIn} 1s ease-out;

  &:hover {
    background-color: #059669; /* Darker green */
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #6b7280;
    cursor: not-allowed;
    transform: none;
  }
`;

const PaymentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`;

const StatusMessage = styled.p`
  font-size: 0.875rem;
  color: ${(props) => (props.error ? "#ef4444" : "#10b981")}; /* Red for error, green for success */
  text-align: center;
  animation: ${shake} 0.4s ease;

  &:empty {
    display: none;
  }
`;

const Loading = styled.p`
  font-size: 0.875rem;
  color: #d1d5db; /* Light gray */
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: ${fadeIn} 0.7s ease-out;

  &:before {
    content: "";
    width: 16px;
    height: 16px;
    border: 2px solid #10b981; /* Green */
    border-top-color: transparent;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

const CompanyVerifyDelivery = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({});
  const [paymentStatus, setPaymentStatus] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const companyId = localStorage.getItem("companyId");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/company/available-items"
        );
        setItems(response.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "Error fetching items");
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
      const response = await axios.post(
        "http://localhost:3000/api/company/verify-middleman-delivery",
        {
          itemId,
          companyId,
          carbonCredits: parseFloat(formData[itemId]?.carbonCredits || 1),
        }
      );
      setMessage(response.data.message);
      setItems((items) =>
        items.map((item) => (item._id === itemId ? response.data.item : item))
      );
      setFormData({ ...formData, [itemId]: undefined });
    } catch (error) {
      setMessage(error.response?.data?.message || "Error verifying delivery");
    }
  };

  const handlePayment = async (amt, itemId, type, walletAddress) => {
    if (!walletAddress) {
      setMessage("Wallet address missing!");
      return;
    }

    if (!window.ethereum) {
      setMessage("Please install MetaMask!");
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

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const to = ethers.getAddress(walletAddress);
      const method = type === "user" ? "sendToUser" : "sendToDeliveryBoy";
      const tx = await contract[method](to, {
        value: ethers.parseEther(amt.toString()),
      });

      setPaymentStatus((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [type]: "⏳ Transaction sent, awaiting confirmation…",
        },
      }));

      await tx.wait();

      setPaymentStatus((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], [type]: "✅ Sent!" },
      }));

      await axios.post("http://localhost:3000/api/middleman/update-payment", {
        itemId,
      });
    } catch (error) {
      console.error(error);
      setPaymentStatus((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [type]: `❌ ${error.message || error}`,
        },
      }));
      setMessage("Payment failed. Please try again.");
    }
  };

  return (
    <Container>
      <Header>
        <Nav>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/company-dashboard">Dashboard</NavLink></li>
          </ul>
        </Nav>
      </Header>

      <Title>Verify Middleman Deliveries</Title>
      <StatusMessage error={message.toLowerCase().includes("error")}>
        {message}
      </StatusMessage>
      {items.length === 0 ? (
        <NoItems>No items available for verification</NoItems>
      ) : (
        <ItemsGrid>
          {items.map((item, index) => (
            <ItemCard
              key={item._id}
              status={item.status}
              style={{ animationDelay: `${index * 0.1}s` }}
              aria-label={`Item: ${item.type}, Status: ${item.status}`}
            >
              <ItemDetails>
                <p><strong>Type:</strong> {item.type}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p>
                  <strong>User:</strong> {item.user.name} (
                  <span style={{ wordBreak: "break-all" }}>{item.user.walletAddress}</span>)
                </p>
                <p>
                  <strong>Middleman:</strong> {item.assignedMiddleman.name} (
                  <span style={{ wordBreak: "break-all" }}>{item.assignedMiddleman.walletAddress}</span>)
                </p>
                <p><strong>ETH Value:</strong> {item.ethValue}</p>
                <p><strong>Status:</strong> {item.status}</p>
              </ItemDetails>
              {item.status !== "CompanyVerified" ? (
                <>
                  <Input
                    type="number"
                    placeholder="Carbon Credits Generated"
                    value={formData[item._id]?.carbonCredits || ""}
                    onChange={(e) => handleChange(item._id, "carbonCredits", e.target.value)}
                    aria-label="Carbon Credits Generated"
                  />
                  <Button onClick={() => handleVerify(item._id)}>Verify Delivery</Button>
                </>
              ) : (
                <PaymentSection>
                  <Button
                    onClick={() =>
                      handlePayment(item.ethValue, item._id, "user", item.user.walletAddress)
                    }
                    disabled={paymentStatus[item._id]?.user === "✅ Sent!"}
                    aria-label={`Pay to User ${item.user.name}`}
                  >
                    Pay to User
                  </Button>
                  {paymentStatus[item._id]?.user && (
                    <StatusMessage
                      error={paymentStatus[item._id]?.user.includes("❌")}
                    >
                      {paymentStatus[item._id]?.user}
                    </StatusMessage>
                  )}
                  <Button
                    onClick={() =>
                      handlePayment(
                        item.ethValue,
                        item._id,
                        "deliveryBoy",
                        item.assignedMiddleman.walletAddress
                      )
                    }
                    disabled={paymentStatus[item._id]?.deliveryBoy === "✅ Sent!"}
                    aria-label={`Pay to Middleman ${item.assignedMiddleman.name}`}
                  >
                    Pay to Delivery Boy
                  </Button>
                  {paymentStatus[item._id]?.deliveryBoy && (
                    <StatusMessage
                      error={paymentStatus[item._id]?.deliveryBoy.includes("❌")}
                    >
                      {paymentStatus[item._id]?.deliveryBoy}
                    </StatusMessage>
                  )}
                </PaymentSection>
              )}
            </ItemCard>
          ))}
        </ItemsGrid>
      )}
    </Container>
  );
};

export default CompanyVerifyDelivery;