// PartnerDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./partnerdashboard.css";

const PartnerDashboard = () => {
  return (
    <>
    <header className="home-header">
            <nav className="home-nav">
              <ul>
                <li>
                  <Link to="/" > home </Link>
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
    <p>Welcome, Delivery Partner! This is your dashboard.</p>
    {/* Link to navigate to the job status page */}
    
  </div>
  </>
  );
};

export default PartnerDashboard;
