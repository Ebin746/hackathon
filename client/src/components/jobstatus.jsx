import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import "./jobstatus.css"; 
// import Product from "../card/productCard";
import ABI from "../../../blockchain/artifacts/contracts/RecyclingSystem.sol/PaymentForwarder.json";



// Smart Contract Details
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with deployed address
const CONTRACT_ABI = ABI.abi;

const JobStatus = () => { const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  // Request account connection via MetaMask
  const requestAccounts = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const forwardFunds = async () => {
    if (!window.ethereum) {
      setStatus("Please install MetaMask.");
      return;
    }
    if (!recipient || !amount) {
      setStatus("Please enter a valid recipient address and amount.");
      return;
    }
    try {
      await requestAccounts();
      // ethers v6 uses BrowserProvider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Convert the entered ETH amount (string) to wei
      const ethAmount = ethers.parseEther(amount);

      // Call the contract function, sending the specified ETH
      const tx = await contract.forwardFunds(recipient, ethAmount, { value: ethAmount });
      setStatus("Transaction sent... Waiting for confirmation");
      await tx.wait();
      setStatus(`Transaction confirmed: ${tx.hash}`);
    } catch (error) {
      console.error(error);
      setStatus("Transaction failed: " + error.message);
    }
  };

  return (
    <div className="app">
      <h1>Payment Forwarder</h1>
      <input
        type="text"
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={forwardFunds}>Send Payment</button>
      <p>{status}</p>
    </div>
  )
};

export default JobStatus;
