import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";

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

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #0f172a; /* Dark slate background */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Card = styled.div`
  background-color: #1e293b; /* Dark card background */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  padding: 32px;
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #e2e8f0; /* Light gray */
  text-align: center;
  margin-bottom: 24px;
`;

const WalletButton = styled.button`
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
  margin-bottom: 16px;
  animation: ${fadeIn} 0.7s ease-out;

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

const WalletText = styled.p`
  font-size: 1rem;
  color: #d1d5db; /* Light gray */
  word-break: break-all;
  text-align: center;
  margin-bottom: 16px;
  animation: ${fadeIn} 0.7s ease-out;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
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

const SubmitButton = styled.button`
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

const Message = styled.p`
  font-size: 1rem;
  color: ${(props) => (props.error ? "#ef4444" : "#10b981")}; /* Red for error, green for success */
  text-align: center;
  margin-top: 16px;
  animation: ${shake} 0.4s ease;

  &:empty {
    display: none;
  }
`;

const UserSignup = () => {
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
      setMessage(""); // Clear any previous error
    } catch (err) {
      setMessage("Wallet connection rejected");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        role: "user",
        walletAddress,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error during signup");
    }
  };

  return (
    <Container>
      <Card>
        <Title>User Sign Up</Title>

        {!walletAddress ? (
          <WalletButton onClick={connectWallet}>Connect Wallet</WalletButton>
        ) : (
          <WalletText>Wallet: {walletAddress}</WalletText>
        )}

        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <SubmitButton type="submit">Sign Up</SubmitButton>
        </Form>

        <Message error={message.toLowerCase().includes("error") || message.includes("rejected") || message.includes("connect")}>
          {message}
        </Message>
      </Card>
    </Container>
  );
};

export default UserSignup;