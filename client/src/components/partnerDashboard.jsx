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
  const middlemanId = localStorage.getItem("middlemanId");

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
      setShowModal(false);
    } catch (error) {
      console.error("Error assigning item:", error);
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-container">
          <div className="header-brand">
            <h1 className="brand-title">DeliveryHub</h1>
          </div>
          <nav className="header-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <span className="nav-icon">🏠</span>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/job-status" className="nav-link">
                  <span className="nav-icon">📊</span>
                  Job Status
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <div className="welcome-content">
              <h2 className="welcome-title">Partner Dashboard</h2>
              <p className="welcome-subtitle">
                Welcome back! Here are the available delivery jobs for you.
              </p>
            </div>
            <div className="stats-container">
              <div className="stat-card">
                <span className="stat-number">{availableJobs.length}</span>
                <span className="stat-label">Available Jobs</span>
              </div>
            </div>
          </section>

          {/* Jobs Section */}
          <section className="jobs-section">
            <h3 className="section-title">Available Jobs</h3>
            
            {availableJobs.length === 0 ? (
              <div className="no-jobs-container">
                <div className="no-jobs-icon">📦</div>
                <p className="no-jobs-text">No jobs available at the moment</p>
              </div>
            ) : (
              <div className="jobs-grid">
                {availableJobs.map((job) => (
                  <div key={job.userId} className="job-card">
                    <div className="job-header">
                      <div className="customer-info">
                        <h4 className="customer-name">{job.userName}</h4>
                        <div className="customer-phone">
                          <span className="phone-icon">📞</span>
                          {job.userPhone}
                        </div>
                      </div>
                    </div>

                    <div className="items-container">
                      {job.items.map((item) => (
                        <div key={item._id} className="item-card">
                          <div className="item-header">
                            <div className="item-details">
                              <div className="item-type">
                                <span className="item-icon">📦</span>
                                <span className="item-text">{item.type}</span>
                              </div>
                              <div className="item-quantity">
                                <span className="quantity-text">{item.quantity} kg</span>
                              </div>
                            </div>
                            <div className="item-status">
                              <span className={`status-badge ${item.status.toLowerCase()}`}>
                                {item.status}
                              </span>
                            </div>
                          </div>

                          <div className="item-meta">
                            <div className="item-date">
                              <span className="date-icon">📅</span>
                              <span className="date-text">
                                {item.scheduledDate 
                                  ? new Date(item.scheduledDate).toLocaleDateString("en-GB")
                                  : "Date TBD"
                                }
                              </span>
                            </div>
                          </div>

                          {item?.location && (
                            <div className="map-container">
                              <MapContainer
                                center={[item.location.lat, item.location.long]}
                                zoom={13}
                                className="leaflet-map"
                              >
                                <TileLayer
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker position={[item.location.lat, item.location.long]}>
                                  <Popup>{job.userName}'s Location</Popup>
                                </Marker>
                              </MapContainer>
                            </div>
                          )}

                          <div className="item-actions">
                            <button
                              className="take-work-btn"
                              onClick={() => {
                                setSelectedItem(item);
                                setShowModal(true);
                              }}
                            >
                              <span className="btn-icon">✨</span>
                              Take Work
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal */}
      {showModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Confirm Assignment</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="confirmation-icon">🤝</div>
              <p className="modal-text">
                Are you sure you want to take this delivery job?
              </p>
              <div className="item-summary">
                <div className="summary-item">
                  <span className="summary-label">Item:</span>
                  <span className="summary-value">{selectedItem.type}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Quantity:</span>
                  <span className="summary-value">{selectedItem.quantity} kg</span>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button
                className="modal-btn confirm-btn"
                onClick={() => assignItem(middlemanId, selectedItem._id)}
              >
                <span className="btn-icon">✅</span>
                Confirm & Take Job
              </button>
              <button 
                className="modal-btn cancel-btn" 
                onClick={() => setShowModal(false)}
              >
                <span className="btn-icon">❌</span>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerDashboard;