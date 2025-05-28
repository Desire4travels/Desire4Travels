import { useState, useEffect } from 'react';
import './BlogPage.css';

const BlogPage = () => {
  // Initial blog data
  const initialBlogs = [
    {
        id: 1,
        category: "adventure",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        title: "Trekking Through Patagonia's Untamed Wilderness",
        excerpt: "Our 14-day journey through Torres del Paine National Park tested our limits but rewarded us with some of the most breathtaking landscapes on Earth...",
        author: "Sarah Johnson",
        date: "May 15, 2023"
      },
      {
        id: 2,
        category: "culture",
        image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        title: "A Month in Kyoto: Discovering Japan's Ancient Heart",
        excerpt: "From tea ceremonies to temple stays, our deep dive into Kyoto's traditional culture changed our perspective on modern Japan...",
        author: "Michael Chen",
        date: "April 2, 2023"
      },
      {
        id: 3,
        category: "food",
        image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        title: "Eating Our Way Through Sicily: A Food Lover's Guide",
        excerpt: "From street food markets to family-run trattorias, Sicily offers some of Italy's most vibrant and authentic culinary experiences...",
        author: "Elena Rodriguez",
        date: "March 18, 2023"
      },
      {
        id: 4,
        category: "tips",
        image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        title: "The Ultimate Packing List for Long-Term Travel",
        excerpt: "After 18 months on the road, we've perfected our packing strategy. Here's everything you need (and what you can leave behind)...",
        author: "David & Priya",
        date: "February 28, 2023"
      },
      {
        id: 5,
        category: "destinations",
        image: "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        title: "Hidden Gems: Thailand's Lesser-Known Islands",
        excerpt: "Skip the crowds of Phuket and discover these 5 stunning Thai islands where you can still find secluded beaches and authentic local experiences...",
        author: "Liam Nguyen",
        date: "January 12, 2023"
      },
      {
        id: 6,
        category: "adventure",
        image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        title: "Mountain Biking the Swiss Alps: Trail Guide",
        excerpt: "We spent a summer exploring Switzerland's best mountain bike trails. Here are our top picks for all skill levels, plus essential tips...",
        author: "Olivia Schmidt",
        date: "December 5, 2022"
      }
  ];

  // State management
  const [blogs, setBlogs] = useState(initialBlogs);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    category: 'adventure',
    image: '',
    content: '',
    author: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const blogsPerPage = 6;

  // Disable body scroll when modal is open
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showForm]);

  // Filter blogs by category and search term
  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = activeCategory === 'all' || blog.category === activeCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlog(prev => ({ ...prev, [name]: value }));
  };

  // Handle blog submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedBlog = {
      id: blogs.length + 1,
      title: newBlog.title,
      category: newBlog.category,
      image: newBlog.image,
      excerpt: newBlog.content.substring(0, 100) + '...',
      author: newBlog.author,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    
    setBlogs([submittedBlog, ...blogs]);
    setNewBlog({
      title: '',
      category: 'adventure',
      image: '',
      content: '',
      author: ''
    });
    
    // Show success animation
    setShowSuccess(true);
    
    // Hide form and success animation after delay
    setTimeout(() => {
      setShowForm(false);
      setTimeout(() => setShowSuccess(false), 300);
    }, 1500);
  };

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="travel-blog">
      {/* Hero Section */}
      <header className="blog-header">
        <h1>Desi4Travels Stories</h1>
        <p>Discover inspiring travel stories, expert tips, and breathtaking destinations from around the globe.</p>
        <button className="btn-primary share" onClick={() => setShowForm(true)}>
          Share Your Story
        </button>
      </header>

      {/* Filter/Search Bar */}
      <div className="blog-filter">
        <div className="filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="category-filter">
            {['all', 'adventure', 'culture', 'food', 'tips', 'destinations'].map(category => (
              <button
                key={category}
                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(category);
                  setCurrentPage(1);
                }}
                data-category={category}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <section className="blog-container">
        <div className="blog-grid">
          {currentBlogs.length > 0 ? (
            currentBlogs.map(blog => (
              <article key={blog.id} className="blog-card" data-category={blog.category}>
                <div className="blog-image">
                  <img src={blog.image} alt={blog.title} />
                </div>
                <div className="blog-content">
                  <span className="blog-category">{blog.category}</span>
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-excerpt">{blog.excerpt}</p>
                  <a href="#" className="read-more">Read More →</a>
                  <div className="blog-meta">
                    <span>By {blog.author}</span>
                    <span>{blog.date}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="no-results">
              <p>No blog posts found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => paginate(Math.max(1, currentPage - 1))} 
              disabled={currentPage === 1}
            >
              &laquo;
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={currentPage === number ? 'active' : ''}
              >
                {number}
              </button>
            ))}
            
            <button 
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))} 
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </div>
        )}
      </section>

      {/* Blog Submission Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className={`modal-content ${showSuccess ? 'success' : ''}`}>
            {!showSuccess ? (
              <>
                <div className="modal-header">
                  <h2>Share Your Travel Story</h2>
                  <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="blog-title">Title*</label>
                    <input
                      type="text"
                      id="blog-title"
                      name="title"
                      value={newBlog.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Your blog post title"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="blog-category">Category*</label>
                    <select
                      id="blog-category"
                      name="category"
                      value={newBlog.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="adventure">Adventure</option>
                      <option value="culture">Culture</option>
                      <option value="food">Food</option>
                      <option value="tips">Travel Tips</option>
                      <option value="destinations">Destinations</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="blog-image">Cover Image URL*</label>
                    <input
                      type="url"
                      id="blog-image"
                      name="image"
                      value={newBlog.image}
                      onChange={handleInputChange}
                      placeholder="Paste image link (e.g., from Imgur)"
                      required
                    />
                    <small>Use services like Imgur or Unsplash to host your image</small>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="blog-content">Your Story*</label>
                    <textarea
                      id="blog-content"
                      name="content"
                      value={newBlog.content}
                      onChange={handleInputChange}
                      rows="8"
                      required
                      placeholder="Share your travel experience in detail..."
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="author-name">Your Name*</label>
                    <input
                      type="text"
                      id="author-name"
                      name="author"
                      value={newBlog.author}
                      onChange={handleInputChange}
                      required
                      placeholder="How should we credit you?"
                    />
                  </div>
                  
                  <button type="submit" className="btn-submit">
                    Submit for Review
                  </button>
                </form>
              </>
            ) : (
              <div className="success-animation">
                <div className="checkmark">✓</div>
                <h3>Submitted Successfully!</h3>
                <p>Your travel story has been received.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default BlogPage;