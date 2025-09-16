import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">
          <h1>GreenCycle Express</h1>
          <span className="tagline">Sustainable Delivery Solutions</span>
        </div>
        <nav className="home-nav">
          <ul>
            <li>
              <Link to="/client-login" className="nav-link">
                <i className="fas fa-user"></i> Client
              </Link>
            </li>
            <li>
              <Link to="/delivery-login" className="nav-link">
                <i className="fas fa-truck"></i> Partner
              </Link>
            </li>
            <li>
              <Link to="/company-login" className="nav-link">
                <i className="fas fa-building"></i> Company
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="home-main">
        <section className="hero">
          <div className="hero-content">
            <h2>Delivering a <span className="highlight">Sustainable</span> Future</h2>
            <p>
              At GreenCycle Express, we connect communities with reliable recycling services.
              Experience eco-friendly delivery that transforms waste into opportunity.
            </p>
            <div className="hero-buttons">
              <Link to="#services" className="btn btn-primary">Discover Our Services</Link>
              <Link to="#about" className="btn btn-secondary">Learn More</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-icon"><i className="fas fa-leaf"></i></div>
            <div className="floating-icon"><i className="fas fa-recycle"></i></div>
            <div className="floating-icon"><i className="fas fa-truck"></i></div>
          </div>
        </section>

        <section className="auth-section" id="services">
          <header className="section-header">
            <h2>Get Started Today</h2>
            <p>Choose your role and join our sustainable delivery network</p>
          </header>
          
          <div className="auth-cards">
            <article className="auth-card">
              <div className="card-icon"><i className="fas fa-user-circle"></i></div>
              <h3>For Clients</h3>
              <p>Request eco-friendly delivery services and track your sustainable impact</p>
              <div className="card-buttons">
                <Link to="/client-login" className="btn btn-outline">Login</Link>
                <Link to="/client-signup" className="btn btn-primary">Sign Up</Link>
              </div>
            </article>

            <article className="auth-card">
              <div className="card-icon"><i className="fas fa-shipping-fast"></i></div>
              <h3>For Delivery Partners</h3>
              <p>Join our network of eco-conscious delivery professionals</p>
              <div className="card-buttons">
                <Link to="/delivery-login" className="btn btn-outline">Login</Link>
                <Link to="/delivery-signup" className="btn btn-primary">Sign Up</Link>
              </div>
            </article>

            <article className="auth-card">
              <div className="card-icon"><i className="fas fa-industry"></i></div>
              <h3>For Companies</h3>
              <p>Streamline your business with sustainable delivery solutions</p>
              <div className="card-buttons">
                <Link to="/company-login" className="btn btn-outline">Login</Link>
                <Link to="/company-signup" className="btn btn-primary">Sign Up</Link>
              </div>
            </article>
          </div>
        </section>

        <section className="features" id="about">
          <header className="section-header">
            <h2>Why Choose GreenCycle Express?</h2>
          </header>
          
          <div className="features-grid">
            <article className="feature">
              <div className="feature-icon"><i className="fas fa-recycle"></i></div>
              <h3>Eco-Friendly</h3>
              <p>Committed to reducing environmental impact with sustainable practices and carbon-neutral delivery options.</p>
            </article>
            
            <article className="feature">
              <div className="feature-icon"><i className="fas fa-bolt"></i></div>
              <h3>Lightning Fast</h3>
              <p>Efficient service ensuring timely recycling pickups and deliveries with real-time tracking.</p>
            </article>
            
            <article className="feature">
              <div className="feature-icon"><i className="fas fa-users"></i></div>
              <h3>Community Focused</h3>
              <p>Empowering local communities through innovative recycling solutions and sustainable employment.</p>
            </article>

            <article className="feature">
              <div className="feature-icon"><i className="fas fa-shield-alt"></i></div>
              <h3>Trusted & Secure</h3>
              <p>Reliable service with comprehensive insurance coverage and verified delivery professionals.</p>
            </article>

            <article className="feature">
              <div className="feature-icon"><i className="fas fa-chart-line"></i></div>
              <h3>Impact Tracking</h3>
              <p>Monitor your environmental impact with detailed analytics and sustainability reports.</p>
            </article>

            <article className="feature">
              <div className="feature-icon"><i className="fas fa-clock"></i></div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support to ensure seamless delivery experiences.</p>
            </article>
          </div>
        </section>

        <section className="stats-section">
          <div className="stats-container">
            <div className="stat">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Happy Clients</div>
            </div>
            <div className="stat">
              <div className="stat-number">100K+</div>
              <div className="stat-label">Deliveries Made</div>
            </div>
            <div className="stat">
              <div className="stat-number">500+</div>
              <div className="stat-label">Partner Network</div>
            </div>
            <div className="stat">
              <div className="stat-number">95%</div>
              <div className="stat-label">Eco-Friendly Rate</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>GreenCycle Express</h3>
            <p>Leading the way in sustainable delivery solutions.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/client-signup">Client Signup</Link></li>
              <li><Link to="/delivery-signup">Partner Signup</Link></li>
              <li><Link to="/company-signup">Company Signup</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: info@greencycle.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} GreenCycle Express. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;