import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BlogList.css';
import axios from 'axios';

const API_BASE_URL = "https://desire4travels-1.onrender.com/blogs";
const API_FEEDBACK_URL = "https://desire4travels-1.onrender.com/blog-feedback";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(6); // Number of blogs per page
  const [isModalOpen, setIsModalOpen] = useState(false);

  ////////

  //feedback form 
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    feedback: '',
    yourStory: ''
  });

  const [submitted, setSubmitted] = useState(false);
  // const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(API_FEEDBACK_URL, formData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  ////////

  const ensureAbsoluteUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_BASE_URL.replace('/blogs', '')}${url}`;
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(API_BASE_URL);
        const data = response.data;

        // Ensure all blog images have absolute URLs
        const blogsWithAbsoluteUrls = data.map(blog => ({
          ...blog,
          image: ensureAbsoluteUrl(blog.image)
        }));

        setBlogs(blogsWithAbsoluteUrls);
        setFilteredBlogs(blogsWithAbsoluteUrls);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchBlogs();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = blogs;

    if (selectedCategory !== 'all') {
      result = result.filter(blog =>
        blog.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(blog =>
        blog.title.toLowerCase().includes(term) ||
        blog.author.toLowerCase().includes(term) ||
        blog.excerpt.toLowerCase().includes(term)
      );
    }

    setFilteredBlogs(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, blogs]);

  // Get current blogs for pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const categories = ['all', ...new Set(blogs.map(blog => blog.category.toLowerCase()))];

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading blogs...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p>Error: {error}</p>
      <button onClick={() => window.location.reload()} className="retry-button">
        Retry
      </button>
    </div>
  );

  return (
    <div className="blog-list-container">
      {/* Full-width Hero Section */}
      <header className="blog-hero">
        <div className="hero-content">
          <h1>Desire4Travels Stories</h1>
          <p>Discover inspiring travel stories, expert tips, and breathtaking destinations from around the globe.</p>
          <button className="btn-primary share" onClick={() => setIsModalOpen(true)}>
            Share Your Story
          </button>
        </div>
      </header>

      <div className="blog-content-container">
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="clear-search"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <div className="select-arrow">▼</div>
          </div> */}

          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              <option value="" disabled>Select a category</option>
              <option value="all">All Categories</option>
              <option value="Mountain">Mountain</option>
              <option value="Beach">Beach</option>
              <option value="Heritage">Heritage</option>
              <option value="Treks">Treks</option>
              <option value="Offbeat">Offbeat</option>
              <option value="Other">Other</option>
            </select>
            <div className="select-arrow">▼</div>
          </div>


        </div>

        {/* <div className="results-count">
          Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? 'post' : 'posts'}
          {filteredBlogs.length !== blogs.length && ' (filtered)'}
        </div> */}

        <div className="blog-grid">
          {currentBlogs.length > 0 ? (
            currentBlogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))
          ) : (
            <div className="no-results">
              <img src="/images/no-results.svg" alt="No results" className="no-results-img" />
              <h3>No matching posts found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`pagination-button ${currentPage === number ? 'active' : ''}`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Sticky Call & WhatsApp Buttons */}
      <div className='sticky-buttons-container'>
        <a href="tel:+91 79770 22583" className="sticky-button" target="_blank" rel="noopener noreferrer">
          Call
        </a>
        <a href="https://wa.me/1234567890" className="sticky-button" target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            <h2 className="modal-title">Share Your Story</h2>

            {submitted ? (
              <div className="success-box">
                <svg className="checkmark" viewBox="0 0 52 52">
                  <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="checkmark-check" fill="none" d="M14 27l8 8 16-16" />
                </svg>
                <p className="success-message">Thank you for your story!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form">
                <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                <input type="tel" name="number" placeholder="Phone Number" value={formData.number} onChange={handleChange} required />
                <input type="text" name="feedback" placeholder="Short Feedback" value={formData.feedback} onChange={handleChange} required />
                <textarea name="yourStory" placeholder="Tell us your story..." rows="5" value={formData.yourStory} onChange={handleChange} required></textarea>
                <button type="submit" className="submit-button">Submit</button>
                {error && <p className="error-message">{error}</p>}
              </form>
            )}
          </div>
        </div>
      )}


    </div>
  );
};

const BlogCard = ({ blog, index }) => {
  return (
    <div
      className="blog-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Link to={blog.url} className="blog-link">
        <div className="blog-image-container">
          <img
            src={blog.image}
            alt={blog.alt || blog.title}
            className="blog-image"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
          />
          <div className="image-overlay"></div>
          <span className="blog-category-badge">{blog.category}</span>
        </div>
        <div className="blog-content">
          <h2 className="blog-title">{blog.title}</h2>
          <p className="blog-excerpt">{blog.excerpt}</p>
          <div className="blog-meta">
            <span className="blog-author">
              <svg className="author-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {blog.author}
            </span>
            <span className="blog-date">
              <svg className="date-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {new Date(blog.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogList;
