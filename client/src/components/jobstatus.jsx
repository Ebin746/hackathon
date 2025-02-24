// JobStatus.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./jobstatus.css"; 
import Product from "../card/productCard";

const JobStatus = () => {
  const product = {
    imageUrl: "https://via.placeholder.com/300x200",
    title: "Sample Product",
    price: 29.99,
  };
  const handleSelect = () => {
    alert("Product selected!");
  };

  return (
    <div className="job-status-container">
      <h2>Job Status</h2>
      <p>This page displays the status of the job you selected.</p>
       
      {/* Display the ProductCard */}
      <Product
        imageurl={product.imageUrl}
        title={product.title}
        price={product.price}
        onselect={handleSelect}
      />
      <Product
        imageurl={product.imageUrl}
        title={product.title}
        price={product.price}
        onselect={handleSelect}
      />
      <Product
        imageurl={product.imageUrl}
        title={product.title}
        price={product.price}
        onselect={handleSelect}
      />
      <Link to="/partner-dashboard" className="back-link">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default JobStatus;
