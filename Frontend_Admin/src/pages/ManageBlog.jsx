import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProtectedCard from '../Components/ProtectedCard.jsx';
import "./ManageBlog.css";


const API_BASE_URL = "https://desire4travels-1.onrender.com/blogs";

const AUTO_LOGOUT_MS =  60 * 60 * 1000; // 1 hour

const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
   const [isAuthenticated, setIsAuthenticated] = useState(false); // <-- Add this
  const navigate = useNavigate(); // <-- Add this
    const timerRef = useRef(); 

  // const [formData, setFormData] = useState({
  //   title: "",
  //   author: "",
  //   category: "",
  //   content: "",
  //   date: new Date().toISOString().split('T')[0], // Default to today
  //   excerpt: "",
  //   alt: "",
  //   status: "draft",
  //   image: null,
  //   slug: ""
  // });
  useEffect(() => {
    const localAuth = localStorage.getItem('auth-blogs');
    setIsAuthenticated(localAuth === 'true');
  }, []);


  // Auto logout effect
  useEffect(() => {
    if (!isAuthenticated) return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        handleLogout();
      }, AUTO_LOGOUT_MS);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated]);


  const handleLogout = () => {
    const AUTH_KEYS = ["auth-enquiries", "auth-destinations", "auth-packages", "auth-blogs", "auth-AI"];
AUTH_KEYS.forEach(k => localStorage.removeItem(k));

    setIsAuthenticated(false);
    navigate('/'); // Redirect to home page
  };



  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    content: "",
    date: new Date().toISOString().split('T')[0],
    excerpt: "",
    alt: "",
    status: "draft",
    images: [], // <-- changed from image: null
    slug: "",
     metaKeywords: "" // <-- Add this
  });


  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_BASE_URL);
      setBlogs(res.data);
      setTimeout(() => setIsLoading(false), 500); // Animation delay
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setIsLoading(false);
    }
  };

  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;

  //   if (name === "image") {
  //     setFormData({ ...formData, image: files[0] });
  //   } else {
  //     const updatedFormData = { ...formData, [name]: value };

  //     // Auto-generate slug when title changes
  //     if (name === "title" && !editingId) {
  //       updatedFormData.slug = slugify(value);
  //     }

  //     setFormData(updatedFormData);
  //   }
  // };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      setFormData({ ...formData, images: Array.from(files) }); // for multiple images
    } else {
      const updatedFormData = { ...formData, [name]: value };
      if (name === "title" && !editingId) {
        updatedFormData.slug = slugify(value);
      }
      setFormData(updatedFormData);
    }
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   const payload = new FormData();
  //   Object.entries(formData).forEach(([key, value]) => {
  //     if (value !== null && value !== undefined) {
  //       payload.append(key, value);
  //     }
  //   });

  //   try {
  //     if (editingId) {
  //       await axios.put(`${API_BASE_URL}/${editingId}`, payload);
  //     } else {
  //       await axios.post(API_BASE_URL, payload);
  //     }
  //     await fetchBlogs();
  //     setShowModal(false);
  //     setEditingId(null);
  //     resetForm();
  //   } catch (err) {
  //     console.error("Error submitting form:", err);
  //     alert(`Error: ${err.response?.data?.error || err.message}`);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach(file => payload.append('images', file));
      } else if (key !== 'metaKeywords' && value !== null && value !== undefined) {
      payload.append(key, value);
      }
    });

      // ✅ Explicitly append metaKeywords
  payload.append('metaKeywords', formData.metaKeywords || '');

  
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, payload);
      } else {
        await axios.post(API_BASE_URL, payload);
      }
      await fetchBlogs();
      setShowModal(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      console.error("Error submitting form:", err);
      alert(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      category: "",
      content: "",
      date: new Date().toISOString().split('T')[0],
      excerpt: "",
      alt: "",
      status: "draft",
      image: null,
      slug: "",
      metaKeywords:""
    });
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      author: blog.author,
      category: blog.category,
      content: blog.content,
      date: blog.date,
      excerpt: blog.excerpt,
      alt: blog.alt,
      status: blog.status,
      image: null,
      slug: blog.slug,
       metaKeywords: blog.metaKeywords || "" 
    });
    setEditingId(blog.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      await fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  if (!isAuthenticated) {
    return (
      <ProtectedCard cardKey="blogs">
        <div className="manage-blog-card">
          <h1>Manage Blogs</h1>
        </div>
      </ProtectedCard>
    );
  }

  return (
    <div className="manage-blog-container">

         <button className="logout-fixed-btn" onClick={handleLogout}>
  Logout
</button>

    
      <h1 className="page-title">Manage Blog Posts</h1>

      <button
        className="create-btn"
        onClick={() => {
          resetForm();
          setEditingId(null);
          setShowModal(true);
        }}
      >
        <span className="btn-icon">+</span> Create New Blog
      </button>

      {isLoading ? (
        <div className="loading-animation">
          <div className="spinner"></div>
          <p>Loading blogs...</p>
        </div>
      ) : (
        <div className="blog-list">
          {blogs.map((blog) => (
            <div key={blog.id} className="blog-card">
              <div className="blog-card-header">
                <h3 className="blog-title">{blog.title}</h3>
                <span className={`status-badge ${blog.status}`}>
                  {blog.status}
                </span>
              </div>
              <p className="blog-meta">
                <span className="meta-author">By {blog.author}</span>
                <span className="meta-date">
                  {new Date(blog.date).toLocaleDateString()}
                </span>
                <span className="meta-slug">/{blog.slug}</span>
              </p>
              <p className="blog-excerpt">{blog.excerpt}</p>
              {/* {blog.image && (
                <div className="blog-image-preview">
                  <img
                    src={blog.image}
                    alt={blog.alt || blog.title}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )} */}
              {Array.isArray(blog.images) && blog.images.length > 0 && (
                <div className="blog-image-preview multi">
                  {blog.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={blog.alt || blog.title}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  ))}
                </div>
              )}

              <div className="blog-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(blog)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(blog.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className={`modal-overlay ${showModal ? "visible" : ""}`}>
          <div className="modal">
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
              disabled={isLoading}
            >
              &times;
            </button>

            <h2 className="modal-title">
              {editingId ? "Edit Blog Post" : "Add New Blog Post"}
            </h2>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
  {/* 1 – Title */}
  <div className="form-group">
    <label>Title*</label>
    <input
      type="text"
      name="title"
      placeholder="Enter blog title"
      value={formData.title}
      onChange={handleChange}
      required
    />
  </div>

  {/* 2 – Slug (only when creating) */}
  {!editingId && (
    <div className="form-group">
      <label>Slug*</label>
      <input
        type="text"
        name="slug"
        placeholder="URL‑friendly slug"
        value={formData.slug}
        onChange={handleChange}
        required
        pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
        title="Slug can only contain lowercase letters, numbers, and hyphens"
      />
      <small className="slug-hint">
        This will be part of the URL: /blogs/{formData.slug || "your-slug"}
      </small>
    </div>
  )}

  {/* 3 – Author + Category */}
  <div className="form-row">
    <div className="form-group">
      <label>Author*</label>
      <input
        type="text"
        name="author"
        placeholder="Author name"
        value={formData.author}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label>Category*</label>
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="" disabled>Select a category</option>
        <option value="Mountain">Mountain</option>
        <option value="Beach">Beach</option>
        <option value="Religious">Religious</option>
        <option value="Treks">Treks</option>
        <option value="Offbeat">Offbeat</option>
        <option value="Desert">Desert</option>
        <option value="Cityscape">Cityscape</option>
        <option value="Other">Other</option>
      </select>
    </div>
  </div>

  {/* 4 – Date + Status */}
  <div className="form-row">
    <div className="form-group">
      <label>Date*</label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label>Status*</label>
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
    </div>
  </div>

  {/* 5 – Alt text */}
  <div className="form-group">
    <label>Image Alt Text*</label>
    <input
      type="text"
      name="alt"
      placeholder="Description for accessibility"
      value={formData.alt}
      onChange={handleChange}
      required
    />
  </div>

  {/* 6 – Images */}
  <div className="form-group">
    <label>Featured Images{!editingId && "*"}</label>
    <div className="file-upload">
      <input
        type="file"
        name="images"
        accept="image/*"
        multiple
        onChange={handleChange}
        {...(editingId ? {} : { required: true })}
      />
      <span className="file-upload-label">
        {formData.images?.length > 0
          ? `${formData.images.length} file(s) selected`
          : "Choose images"}
      </span>
    </div>
    {editingId && (
      <small className="image-hint">Leave empty to keep current images</small>
    )}
  </div>

  {/* Meta Keywords */}
<div className="form-group">
  <label>
    Meta Keywords <small>(Comma-separated)</small>
  </label>
  <input
    type="text"
    name="metaKeywords"
    placeholder="e.g., travel, beach, adventure"
    value={formData.metaKeywords}
    onChange={handleChange}
  />
</div>



  {/* 7 – Excerpt */}
  <div className="form-group excerpt-group">
    <label>Excerpt*</label>
    <textarea
      name="excerpt"
      placeholder="Short summary of your blog"
      value={formData.excerpt}
      onChange={handleChange}
      required
      rows="4"
    />
  </div>

  {/* 8 – Content */}
  <div className="form-group content-group">
    <label>Content*</label>
    <textarea
      name="content"
      placeholder="Write your blog content here..."
      value={formData.content}
      onChange={handleChange}
      required
      rows="8"
    />
  </div>

  {/* 9 – Buttons (directly after content) */}
  <div className="modal-buttons">
    <button
      type="button"
      className="cancel-btn"
      onClick={() => setShowModal(false)}
      disabled={isLoading}
    >
      Cancel
    </button>
    <button type="submit" className="submit-btn" disabled={isLoading}>
      {isLoading ? <span className="btn-spinner" /> : editingId ? "Update Blog" : "Publish Blog"}
    </button>
  </div>
</form>


          </div>
        </div>
      )}
    </div>

    
  );
};

export default Blog;
