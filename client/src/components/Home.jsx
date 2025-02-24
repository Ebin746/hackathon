import React from 'react';
import { Link } from 'react-router-dom';
import './home.css'; // Import the CSS file for styling

const Home = () => {
  return (
    <div>
      <header className="home-header">
        <nav className="home-nav">
          <ul>
            <li>
              <Link to="/client-login">client Login</Link>
            </li>
            <li>
              <Link to="/delivery-login">partner Login</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="home-main">
        <h1>Welcome to Our Delivery Service</h1>
        <p>Select your login option from the navigation above.</p>
      </main>
    </div>
  );
};

export default Home;
