// JobStatus.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./jobstatus.css"; //

const JobStatus = () => {
  return (
    <div className="job-status-container">
      <h2>Job Status</h2>
      <p>This page displays the status of the job you selected.</p>
      <Link to="/partner-dashboard" className="back-link">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default JobStatus;
