import React from "react";
import "./productcard.css";
const Product =({imageurl,title,price,onselect})=>{
  return(
    <>
     <div className="product-card">
      <img src={imageurl} alt={title} className="product-image" />
      <div className="product-details">
        <h3 className="product-title">{title}</h3>
        <p className="product-price">${price}</p>
        <button className="select-button" onClick={onselect}>
          Select
        </button>
      </div>
    </div>

    </>

  )
};
export default Product ;