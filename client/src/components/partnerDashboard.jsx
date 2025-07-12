import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./partnerdashboard.css";

// Fix for default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const PartnerDashboard = () => {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch available jobs
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/middleman/available-items")
      .then((response) => {
        setAvailableJobs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, []);

  // Assign item to middleman
  const assignItem = async (middlemanId, itemId) => {
    try {
      const response = await axios.post("http://localhost:3000/api/middleman/assign-item", {
        middlemanId,
        itemId,
      });
      alert(response.data.message);
      setAvailableJobs(availableJobs.filter((job) => job.items.some((item) => item._id !== itemId)));
      setShowModal(false); // Close modal after assigning
    } catch (error) {
      console.error("Error assigning item:", error);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="home-header">
        <nav className="home-nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/job-status" className="job-status-link">
                Check Job Status
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <div className="dashboard-container">
        <h2>Partner Dashboard</h2>
        <p>Welcome, Delivery Partner! Here are the available jobs.</p>

        {/* Available Jobs */}
        <div className="job-list">
          {availableJobs?.map((job) => (
            <div key={job.userId} className="job-card">
              <h3>{job.userName}</h3>
              <p>📞 {job.userPhone}</p>

              {job?.items.map((item) => (
                <div key={item._id} className="item">
                  <p>📦 {item.type} : {item.quantity} kg </p>
                  <p>📅 Date: {item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString("en-GB") : "DD-MM-YYYY"}</p>
                  <p>🛠 Status: {item.status}</p>
                  
                  {item?.location && (
                    <MapContainer center={[item.location.lat, item.location.long]} zoom={13} style={{ height: "150px", width: "300px", borderRadius:"10%" }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[item.location.lat, item.location.long]}>
                        <Popup>
                          {job.userName}'s Location
                        </Popup>
                      </Marker>
                    </MapContainer>
                  )}
                  <button
                    className="assign-btn"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowModal(true);
                    }}
                  >
                    Take Work
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for assigning items */}
      {showModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Assign Item</h3>
            <p>Are you sure you want to assign {selectedItem.name}?</p>
            <button
              className="confirm-btn"
              onClick={() => assignItem("67bc5864afb8c019a8581a75", selectedItem._id)}
            >
              Confirm
            </button>
            <button className="cancel-btn" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PartnerDashboard;