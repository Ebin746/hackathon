import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./clientdashboard.css";

// Fix for default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const ClientDashboard = () => {
  const userId = localStorage.getItem("userId") || "67bc5817afb8c019a8581a73";

  const [itemType, setItemType] = useState({ type: "paper", price: 0.5 });
  const [quantity, setQuantity] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [status, setStatus] = useState("");
  const [lat, setLat] = useState(9.9312); // Default latitude for Kochi
  const [long, setLong] = useState(76.2673); // Default longitude for Kochi
  const [items, setItems] = useState([]);

  const imageMapping = {
    paper: "/images/paper.png",
    electronics: "/images/electronics.png",
    glass: "/images/glass.png",
    furniture: "/images/furniture.png",
    plastic: "/images/plastic.png",
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/user/items/${userId}`);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
      setStatus("Error fetching items: " + error.message);
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

    return lat === null ? null : (
      <Marker position={[lat, long]}></Marker>
    );
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Client Dashboard</h1>
        <p>Welcome, Client! Manage your recyclable items here.</p>
      </header>

      <section className="form-section">
        <div className="card form-card">
          <h2>Add a Recyclable Item</h2>
          <form onSubmit={handleAddItem}>
            <div className="form-group">
              <label htmlFor="itemType">Item Type</label>
              <select
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
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity (in Kg)</label>
              <input
                type="number"
                id="quantity"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="scheduledDate">Schedule Date</label>
              <input
                type="date"
                id="scheduledDate"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Select Location</label>
              <MapContainer center={[9.9312, 76.2673]} zoom={13} style={{ height: "300px", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker />
              </MapContainer>
            </div>
            <button type="submit" className="submit-btn">
              Add Item
            </button>
          </form>
          {status && <p className="status-message">{status}</p>}
        </div>
      </section>

      <section className="items-section">
        <div className="card items-card">
          <h2>Your Added Items</h2>
          {items.length === 0 ? (
            <p className="no-items">No items added yet.</p>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div key={item._id} className="item-card">
                  <img
                    src={ "https://placehold.co/600x400"}
                    alt={item.type}
                    className="item-image"
                  />
                  <div className="item-details">
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ClientDashboard;