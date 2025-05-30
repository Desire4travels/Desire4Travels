import { Link } from 'react-router-dom';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaInstagram,
  FaShareAlt,
} from 'react-icons/fa';
import companylogo from '../../assets/companylogo.png';
import { useState } from 'react';
import axios from 'axios';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const res = await axios.post('https://desire4travels-1.onrender.com/api/newsletter', { email });
      setMessage(res.data.message || 'Subscribed successfully!');
      setEmail('');
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Subscription failed. Please try again.';
      setMessage(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      {/* First Footer Section */}
      <div className="first-footer">
        <div className="footer-section footerleft">
          <div className="icon-heading">
            <FaPhoneAlt className="icon" />
            <h4>Call us</h4>
          </div>
          <p>Chat or get a quote 24/7—we’re here to help!</p>
          <div className="phone-links">
            <a href="tel:+91-7977022583" className="footer-link">+91-7977022583</a>
            <a href="tel:+91-7409030585" className="footer-link">+91-7409030585</a>
          </div>
        </div>

        <div className="footer-section">
          <div className="icon-heading">
            <FaEnvelope className="icon" />
            <h4>Write to us</h4>
          </div>
          <p>Enquiry, feedback, or suggestion? Write to us.</p>
          <a href="mailto:info@desire4travels.com" className="footer-link">info@desire4travels.com</a>
        </div>

        <div className="footer-section lastsection">
          <div className="icon-heading">
            <FaWhatsapp className="icon" />
            <h4>WhatsApp us</h4>
          </div>
          <p>Chat with us for quick travel help!</p>
          <a href="https://wa.me/917977022583" className="footer-link">+91-7977022583</a>
        </div>
      </div>

      {/* Second Footer Section */}
      <div className="second-footer">
        <div className="subscribe">
          <img src={companylogo} alt="Company Logo" className="companylogo" />
          <h4>Subscribe to our newsletter</h4>
          <p>Stay updated with the latest travel deals and blogs.</p>
          <input
            type="email"
            placeholder="Enter your email"
            className="newsletter-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
          <button
            className="subscribe-button"
            onClick={handleSubscribe}
            disabled={submitting}
          >
            {submitting ? 'Subscribing...' : 'Subscribe'}
          </button>
          {message && <p className="subscribe-message">{message}</p>}
        </div>

        <div className="footer-links">
          <div className="link-column">
            <h4>About Us</h4>
            <Link to="/about">About Us</Link>
            <Link to="/careerpage">Career Page</Link>
            <Link to="/reviews">Reviews</Link>
          </div>

          <div className="link-column">
            <h4>Navigation</h4>
            <Link to="/">Home</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className="link-column">
            <h4>Resources</h4>
            <Link to="/faq">FAQ</Link>
            <Link to="/blogs">Blogs</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>

          <div className="link-column">
            <h4>Travel</h4>
            <Link to="/destination">Destinations</Link>
            <Link to="/package">Packages</Link>
          </div>

          <div className="footer-section-social">
            <div className="icon-heading">
              <FaShareAlt className="icon" />
              <h4>Connect with us</h4>
            </div>
            <p>Reviews, podcasts, blogs and more...</p>
            <div className="social-icons">
              <a href="https://www.facebook.com/hashtag/desire4travels/" target="_blank" rel="noopener noreferrer" className="facebook"><FaFacebookF /></a>
              <a href="https://www.youtube.com/channel/UCyeSVsm2NoBijIiE4saB2_A" target="_blank" rel="noopener noreferrer" className="youtube"><FaYoutube /></a>
              <a href="https://in.linkedin.com/company/desire4travels" target="_blank" rel="noopener noreferrer" className="linkedin"><FaLinkedinIn /></a>
              <a href="https://www.instagram.com/desire4travels/" target="_blank" rel="noopener noreferrer" className="instagram"><FaInstagram /></a>
              <a href="https://wa.me/917977022583" target="_blank" rel="noopener noreferrer" className="whatsapp"><FaWhatsapp /></a>
            </div>
          </div>
        </div>
      </div>

      <p className="footer-note">© {new Date().getFullYear()} Desire4Travels. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
