import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>JerseyHub</h3>
          <p>Premium quality football jerseys from your favorite clubs and national teams.</p>
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/track-order">Track Order</Link></li>
            <li><Link to="/login">My Account</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul className="footer-links">
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns & Exchanges</a></li>
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>Email: support@jerseyhub.com</p>
          <p>Phone: +233 241-689-631</p>
          <p>Hours: Mon-Sat 9am-6pm GMT</p>
          <p>Address: Kromoase - Kumasi, Ashanti Region</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 JerseyHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;