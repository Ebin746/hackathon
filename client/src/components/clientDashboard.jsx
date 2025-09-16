import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

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
  text-align: center;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #e2e8f0; /* Light gray */
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #d1d5db; /* Light gray */
  margin-top: 8px;
`;

const Section = styled.section`
  width: 100%;
  max-width: 1024px;
  margin-bottom: 32px;
`;

const Card = styled.div`
  background-color: #1e293b; /* Dark card background */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  padding: 24px;
  animation: ${fadeIn} 0.7s ease-out;
`;

const FormCard = styled(Card)`
  margin-bottom: 32px;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #e2e8f0; /* Light gray */
  margin-bottom: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #d1d5db; /* Light gray */
  font-weight: 500;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #4b5563; /* Gray border */
  border-radius: 8px;
  background-color: #2d3748; /* Dark input background */
  color: #e2e8f0; /* Light text */
  font-size: 1rem;
  animation: ${fadeIn} 0.9s ease-out;

  &:focus {
    outline: none;
    border-color: #10b981; /* Green focus border */
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); /* Green glow */
  }
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

const MapWrapper = styled.div`
  height: 300px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #4b5563; /* Gray border */
  animation: ${fadeIn} 1s ease-out;

  .leaflet-container {
    height: 100%;
    width: 100%;
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
  animation: ${fadeIn} 1.1s ease-out;

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

const StatusMessage = styled.p`
  font-size: 1rem;
  color: ${(props) => (props.error ? "#ef4444" : "#10b981")}; /* Red for error, green for success */
  text-align: center;
  margin-top: 16px;
  animation: ${shake} 0.4s ease;

  &:empty {
    display: none;
  }
`;

const ItemsCard = styled(Card)`
  padding: 24px;
`;

const ItemsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #e2e8f0; /* Light gray */
  margin-bottom: 16px;
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
`;

const ItemCard = styled.div`
  background-color: #2d3748; /* Darker card background */
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: ${fadeIn} 0.7s ease-out;
  border: 2px solid ${(props) => {
    
    if (props.status === "Picked Up") return "#ef4444"; /* Red for Picked Up */
    else  return "#06ab74"; /* Green for Verified */
    
  }};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    animation: ${pulse} 1.5s infinite;
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.875rem;
  color: #d1d5db; /* Light gray */
`;

const Loading = styled.p`
  font-size: 1.125rem;
  color: #d1d5db; /* Light gray */
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: ${fadeIn} 0.7s ease-out;

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

const ClientDashboard = () => {
  const userId = localStorage.getItem("userId") || "67bc5817afb8c019a8581a73";
  const [itemType, setItemType] = useState({ type: "paper", price: 0.5 });
  const [quantity, setQuantity] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [status, setStatus] = useState("");
  const [lat, setLat] = useState(9.9312); // Default latitude for Kochi
  const [long, setLong] = useState(76.2673); // Default longitude for Kochi
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const imageMapping = {
    paper: "https://placehold.co/600x400?text=Paper",
    electronics: "https://placehold.co/600x400?text=Electronics",
    glass: "https://placehold.co/600x400?text=Glass",
    furniture: "https://placehold.co/600x400?text=Furniture",
    plastic: "https://placehold.co/600x400?text=Plastic",
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/user/items/${userId}`);
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setStatus("Error fetching items: " + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!quantity) {
      setStatus("Please enter quantity.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/api/user/add-item", {
        userId,
        type: itemType.type,
        quantity,
        price: itemType.price,
        scheduledDate,
        lat,
        long,
      });
      setStatus(response.data.message);
      setQuantity("");
      setScheduledDate("");
      fetchItems();
    } catch (error) {
      console.error("Error adding item:", error);
      setStatus("Error adding item: " + error.message);
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setLat(e.latlng.lat);
        setLong(e.latlng.lng);
      },
    });

    return lat === null ? null : <Marker position={[lat, long]}></Marker>;
  };

  return (
    <Container>
      <Header>
        <Title>Client Dashboard</Title>
        <Subtitle>Welcome, Client! Manage your recyclable items here.</Subtitle>
      </Header>

      <Section>
        <FormCard>
          <FormTitle>Add a Recyclable Item</FormTitle>
          <Form onSubmit={handleAddItem}>
            <FormGroup>
              <Label htmlFor="itemType">Item Type</Label>
              <Select
                id="itemType"
                value={itemType.type}
                onChange={(e) => {
                  const selectedOption = e.target.options[e.target.selectedIndex];
                  setItemType({
                    type: selectedOption.value,
                    price: parseFloat(selectedOption.getAttribute("data-price")),
                  });
                }}
              >
                <option value="paper" data-price="0.5">Paper - $0.5/kg</option>
                <option value="electronics" data-price="5.0">Electronics - $5.0/kg</option>
                <option value="glass" data-price="0.3">Glass - $0.3/kg</option>
                <option value="furniture" data-price="2.0">Furniture - $2.0/kg</option>
                <option value="plastic" data-price="0.8">Plastic - $0.8/kg</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="quantity">Quantity (in Kg)</Label>
              <Input
                type="number"
                id="quantity"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="scheduledDate">Schedule Date</Label>
              <Input
                type="date"
                id="scheduledDate"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="location">Select Location</Label>
              <MapWrapper>
                <MapContainer
                  center={[9.9312, 76.2673]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                  aria-label="Select location on map"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker />
                </MapContainer>
              </MapWrapper>
            </FormGroup>
            <SubmitButton type="submit">Add Item</SubmitButton>
          </Form>
          <StatusMessage error={status.toLowerCase().includes("error")}>
            {status}
          </StatusMessage>
        </FormCard>
      </Section>

      <Section>
        <ItemsCard>
          <ItemsTitle>Your Added Items</ItemsTitle>
          {loading ? (
            <Loading>Loading items...</Loading>
          ) : items.length === 0 ? (
            <NoItems>No items added yet.</NoItems>
          ) : (
            <ItemsGrid>
              {items.map((item, index) => (
                <ItemCard
                  key={item._id}
                  status={item.status}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  aria-label={`Item: ${item.type}, Status: ${item.status}`}
                >
                  <ItemImage
                    src={imageMapping[item.type] || "https://placehold.co/600x400?text=Item"}
                    alt={item.type}
                  />
                  <ItemDetails>
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
                  </ItemDetails>
                </ItemCard>
              ))}
            </ItemsGrid>
          )}
        </ItemsCard>
      </Section>
    </Container>
  );
};

export default ClientDashboard;