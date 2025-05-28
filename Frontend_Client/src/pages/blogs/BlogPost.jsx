import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { FiArrowLeft, FiCalendar, FiUser, FiChevronRight } from 'react-icons/fi';
import { Helmet } from 'react-helmet';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import './BlogPost.css';

const API_BASE_URL = "https://desire4travels-1.onrender.com/blogs";
// const API_BASE_URL = "http://localhost:3000/blogs";

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [similarBlogs, setSimilarBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tripFormData, setTripFormData] = useState({
    destination: '',
    startDate: null,
    noofdays: '',
    travelers: '',
    preference: '',
    mobileNumber: ''
  });

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const [blogResponse, similarResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/${id}`),
          axios.get(API_BASE_URL)
        ]);

        if (!blogResponse.data) {
          throw new Error('Blog post not found');
        }

        setBlog(blogResponse.data);

        const filteredSimilar = similarResponse.data
          .filter(b => b.category === blogResponse.data.category && b.id !== id)
          .slice(0, 3)
          .map(blog => ({
            ...blog,
            image: ensureAbsoluteUrl(blog.image)
          }));

        setSimilarBlogs(filteredSimilar);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  const ensureAbsoluteUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_BASE_URL.replace('/blogs', '')}${url}`;
  };

  const handleTripChange = (e) => {
    const { name, value } = e.target;
    setTripFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setTripFormData(prev => ({ ...prev, startDate: date }));
  };

  const handleTripSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://desire4travels-1.onrender.com/api/plan-trip', tripFormData);
      alert('Trip planned successfully! We will contact you shortly.');
      setTripFormData({
        destination: '',
        startDate: null,
        noofdays: '',
        travelers: '',
        preference: '',
        mobileNumber: ''
      });
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || 'Failed to submit trip plan'}`);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Helmet>
          <title>Loading... | Desire4Travel</title>
        </Helmet>
        <div className="loading-spinner"></div>
        <p>Loading blog post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Helmet>
          <title>Error | Desire4Travel</title>
        </Helmet>
        <div className="error-icon">!</div>
        <h3>Error Loading Content</h3>
        <p>{error}</p>
        <Link to="/blogs" className="error-back-btn">
          <FiArrowLeft /> Back to Blogs
        </Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="not-found-container">
        <Helmet>
          <title>Not Found | Desire4Travel</title>
        </Helmet>
        <h3>Blog Post Not Found</h3>
        <p>The requested blog post doesn't exist or may have been removed.</p>
        <Link to="/blogs" className="not-found-btn">
          <FiArrowLeft /> Browse All Blogs
        </Link>
      </div>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(blog.content);
  const cleanExcerpt = blog.excerpt.replace(/<[^>]+>/g, '').slice(0, 160);
  const absoluteImageUrl = ensureAbsoluteUrl(blog.image);

  return (
    <div className="blog-page-wrapper">
      <Helmet>
        <title>Travel Blogs & Stories – Tips, Guides & Inspiration | Desire4Travels</title>
        <meta name="description" content="Explore the Desire4Travels blog for expert travel tips, destination guides, inspiring stories, and practical advice to plan your perfect journey." />
        <meta name="keywords" content="travel blogs, travel stories, travel guides, travel tips, vacation ideas, destination blogs, travel experiences, D4T blogs, travel articles, trip planning advice, adventure travel blogs, travel inspiration, Desire4Travels blog, solo travel blogs, family travel tips" />
        <meta name="author" content="Your Company Name" />
        <meta property="og:title" content="Travel Blogs & Stories – Tips, Guides & Inspiration | Desire4Travels" />
        <meta property="og:description" content="Explore the Desire4Travels blog for expert travel tips, destination guides, inspiring stories, and practical advice to plan your perfect journey." />
      </Helmet>

      <div className="main-content-area">
        <div className="blog-post-container">
          <article className="blog-post">
            <header className="blog-post-header">
              <h1>{blog.title}</h1>
              <div className="blog-meta">
                <span>
                  <FiUser /> {blog.author}
                </span>
                <span className="blog-category">{blog.category}</span>

                <span>
                  <FiCalendar /> {new Date(blog.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </header>

            <div className="blog-image-box">
              <img
                src={absoluteImageUrl}
                alt={blog.alt || blog.title}
                className="blog-featured-image"
                loading="eager"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>

            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </article>
        </div>

        <div className="side-suggestions right">
          <div className="trip-box">
            <h3>Plan Your Dream Trip</h3>
            <form onSubmit={handleTripSubmit}>
              <input
                type="text"
                name="destination"
                placeholder="Where to?"
                value={tripFormData.destination}
                onChange={handleTripChange}
                required
              />

              <input
                selected={tripFormData.startDate}
                onChange={handleDateChange}
                placeholder="Travel Dates"
                minDate={new Date()}
                className="date-picker"
                required
              />

              <input
                type="number"
                name="noofdays"
                placeholder="Duration (days)"
                min="1"
                value={tripFormData.noofdays}
                onChange={handleTripChange}
                required
              />

              <input
                type="number"
                name="travelers"
                placeholder="Travelers"
                min="1"
                value={tripFormData.travelers}
                onChange={handleTripChange}
                required
              />

              <input
                type="tel"
                name="mobileNumber"
                placeholder="Your Phone Number"
                pattern="[0-9]{10}"
                value={tripFormData.mobileNumber}
                onChange={handleTripChange}
                required
              />

              <button type="submit" className="submit-btn">
                Get Custom Plan
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="bottom-suggestions">
        <h3 className="suggestions-title">You Might Also Like</h3>
        <div className="suggestions-grid">
          {similarBlogs.map((b) => (
            <Link to={b.url} key={b.id} className="suggestion-card">
              <div className="suggestion-image-container">
                <img
                  src={ensureAbsoluteUrl(b.image)}
                  alt={b.alt || b.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
              <div className="suggestion-info">
                <h4>{b.title}</h4>
                <p>{b.excerpt.slice(0, 60)}...</p>
                <span className="read-more">
                  Read More <FiChevronRight />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mobile-suggestions">
        <h3>Related Articles</h3>
        <div className="mobile-suggestions-grid">
          {similarBlogs.map((b) => (
            <Link to={b.url} key={b.id} className="mobile-suggestion-card">
              <div className="mobile-suggestion-image">
                <img
                  src={ensureAbsoluteUrl(b.image)}
                  alt={b.alt || b.title}
                  loading="lazy"
                />
              </div>
              <div className="mobile-suggestion-info">
                <h4>{b.title}</h4>
                <p>{b.excerpt.slice(0, 80)}...</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="sticky-contact-buttons">
        <a href="tel:+1234567890" className="sticky-button call">
          <span></span> Call Us
        </a>
        <a
          href="https://wa.me/1234567890"
          className="sticky-button whatsapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span></span> WhatsApp
        </a>
      </div>
    </div>
  );
};

export default BlogPost;

