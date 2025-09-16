import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const Header = styled.header`
  position: absolute;
  top: 0;
  width: 100%;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e293b; /* Dark card background */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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

const SignupPrompt = styled.p`
  color: #d1d5db; /* Light gray */
  font-size: 1rem;

  a {
    color: #10b981; /* Green */
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
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

const LoginButton = styled.button`
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

const ErrorMessage = styled.p`
  font-size: 1rem;
  color: #ef4444; /* Red */
  text-align: center;
  margin-top: 16px;
  animation: ${shake} 0.4s ease;

  &:empty {
    display: none;
  }
`;

const LoginClient = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask not detected. Please install MetaMask!");
        return;
      }

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const walletAddress = accounts[0];

      const response = await axios.post("http://localhost:3000/api/login", {
        walletAddress,
        role: "user",
      });

      if (response.data.user) {
        localStorage.clear();
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("role", "user");
        navigate("/client-dashboard");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Container>
      <Header>
        <Nav>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
          </ul>
        </Nav>
        <SignupPrompt>
          Don't have an account? <Link to="/client-signup">Sign Up</Link>
        </SignupPrompt>
      </Header>

      <Card>
        <Title>Client Login</Title>
        <LoginButton onClick={handleLogin}>Login with MetaMask</LoginButton>
        <ErrorMessage>{error}</ErrorMessage>
      </Card>
    </Container>
  );
};

export default LoginClient;