import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Styled Components
const Main = styled.main`
  min-height: 100vh;
  background-color: #0f172a; /* Dark slate background */
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  margin-bottom: 24px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #e2e8f0; /* Light gray */
`;

const Section = styled.section`
  max-width: 1024px;
  margin: 0 auto;
  width: 100%;
`;

const Loading = styled.p`
  font-size: 1.125rem;
  color: #d1d5db; /* Light gray */
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:before {
    content: "";
    width: 20px;
    height: 20px;
    border: 2px solid #10b981; /* Green */
    border-top-color: transparent;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

const NoItems = styled.p`
  font-size: 1.125rem;
  color: #d1d5db; /* Light gray */
  text-align: center;
`;

const ItemList = styled.div`
  display: grid;
  gap: 24px;
  justify-content: center;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 300px);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 300px);
  }
`;

const ItemCard = styled.article`
  background-color: #1e293b; /* Dark card background */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  padding: 16px;
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: ${fadeIn} 0.5s ease-out;
`;

const ItemTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #e2e8f0; /* Light gray */
  margin-bottom: 8px;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.875rem;
  color: #d1d5db; /* Light gray */
  flex-grow: 1;
  overflow-y: auto;
`;

const ItemText = styled.p`
  font-size: 0.875rem;
  color: #d1d5db; /* Light gray */
`;

const Status = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  background-color: ${(props) =>
    props.status.toLowerCase() === "verified" ? "#d1fae5" : "#fef3c7"};
  color: ${(props) =>
    props.status.toLowerCase() === "verified" ? "#065f46" : "#92400e"};
`;

const ButtonContainer = styled.div`
  margin-top: 8px;
`;

const VerifyButton = styled.button`
  width: 100%;
  background-color: #10b981; /* Green */
  color: #ffffff;
  padding: 8px;
  border-radius: 4px;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #059669; /* Darker green */
  }

  &:disabled {
    background-color: #6b7280;
    cursor: not-allowed;
  }
`;

const PaymentDone = styled.p`
  color: #10b981; /* Green */
  font-weight: 500;
  text-align: center;
  font-size: 0.875rem;
`;

const StatusMessage = styled.p`
  margin-top: 24px;
  text-align: center;
  font-size: 1.125rem;
  color: ${(props) => (props.success ? "#10b981" : "#ef4444")}; /* Green or red */
  animation: ${fadeIn} 0.3s ease-out;
`;

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
      setStatus("Failed to fetch items.");
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
    <Main>
      <Header>
        <Title>Assigned Items</Title>
      </Header>

      <Section>
        {loading ? (
          <Loading>Loading items...</Loading>
        ) : items.length === 0 ? (
          <NoItems>No assigned items found.</NoItems>
        ) : (
          <ItemList>
            {items.map((item, index) => (
              <ItemCard key={item._id} style={{ animationDelay: `${index * 0.1}s` }}>
                <ItemTitle>{item.name}</ItemTitle>
                <ItemDetails>
                  <ItemText>
                    <strong>Material:</strong> {item.type}
                  </ItemText>
                  <ItemText>
                    <strong>Weight:</strong> {item.quantity} kg
                  </ItemText>
                  <ItemText>
                    <strong>Assigned Date:</strong>{" "}
                    {new Date(item.date).toLocaleDateString("en-GB")}
                  </ItemText>
                  <ItemText>
                    <strong>Status:</strong>{" "}
                    <Status status={item.status}>{item.status}</Status>
                  </ItemText>
                  {item.ethValue && (
                    <ItemText>
                      <strong>ETH Value:</strong> {item.ethValue} ETH
                    </ItemText>
                  )}
                  {item.user && (
                    <>
                      <ItemText>
                        <strong>User:</strong> {item.user.name || "Unknown"}
                      </ItemText>
                      <ItemText>
                        <strong>Phone:</strong> {item.user.phone || "N/A"}
                      </ItemText>
                    </>
                  )}
                </ItemDetails>
                <ButtonContainer>
                  {item.status == "Picked Up" ? (
                    <VerifyButton onClick={() => verifyItem(item._id)}>
                      Verify
                    </VerifyButton>
                  ) : (
                    <PaymentDone>Verification Completed</PaymentDone>
                  )}
                </ButtonContainer>
              </ItemCard>
            ))}
          </ItemList>
        )}
      </Section>

      {status && (
        <StatusMessage success={status.includes("successfully")}>
          {status}
        </StatusMessage>
      )}
    </Main>
  );
};

export default JobStatus;