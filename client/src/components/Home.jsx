import React from 'react';
import { Link } from 'react-router-dom';
import './home.css'; // Import the CSS file for styling

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">
          <h1>GreenCycle Express</h1>
        </div>
        <nav className="home-nav">
          <ul>
            <li>
              <Link to="/client-login">Client Login</Link>
            </li>
            <li>
              <Link to="/delivery-login">Partner Login</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="home-main">
        <section className="hero">
          <h2>Delivering a Sustainable Future</h2>
          <p>
            At GreenCycle Express, we connect communities with reliable recycling services.
            Experience eco-friendly delivery that transforms waste into opportunity.
          </p>
          <Link to="/" className="btn">
            Discover Our Services
          </Link>
        </section>

        <section className="features">
          <div className="feature">
            <i className="fas fa-recycle"></i>
            <h3>Eco-Friendly</h3>
            <p>Committed to reducing environmental impact with sustainable practices.</p>
          </div>
          <div className="feature">
            <i className="fas fa-truck"></i>
            <h3>Fast Delivery</h3>
            <p>Efficient service ensuring timely recycling pickups and deliveries.</p>
          </div>
          <div className="feature">
            <i className="fas fa-users"></i>
            <h3>Community Focused</h3>
            <p>Empowering local communities through innovative recycling solutions.</p>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} GreenCycle Express. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;