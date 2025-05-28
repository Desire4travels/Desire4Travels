import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './SingleBlogPage.css';

const SingleBlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch from an API
    const fetchBlog = async () => {
      try {
        // Simulate API call
        const blogsFromStorage = JSON.parse(localStorage.getItem('blogs')) || [];
        const foundBlog = blogsFromStorage.find(b => b.id.toString() === id);
        
        if (foundBlog) {
          setBlog(foundBlog);
        } else {
          // Handle not found
          console.error('Blog not found');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!blog) {
    return <div className="not-found">Blog not found</div>;
  }

  return (
    <div className="single-blog-container">
      <article className="single-blog">
        <div className="blog-header-image">
          <img src={blog.image} alt={blog.title} />
        </div>
        
        <div className="blog-content">
          <div className="blog-meta">
            <span className="blog-category">{blog.category}</span>
            <span className="blog-date">{blog.date}</span>
          </div>
          
          <h1>{blog.title}</h1>
          
          <div className="author-info">
            <span>By {blog.author}</span>
          </div>
          
          <div className="blog-body">
            <p>{blog.excerpt}</p>
            {/* In a real app, this would be the full content */}
            <p>{blog.content || "This would be the full content of the blog post..."}</p>
            <p>More detailed content would appear here in a real implementation.</p>
          </div>
        </div>
      </article>
      
      <div className="related-blogs">
        <h2>You might also like</h2>
        {/* Related blogs component would go here */}
      </div>
    </div>
  );
};

export default SingleBlogPage;











// // Add this import at the top
// import { Link } from 'react-router-dom';

// // Then update the Read More link in your blog cards:
// <a href={`/blog/${blog.id}`} className="read-more">Read More →</a>
// // Change to:
// <Link to={`/blog/${blog.id}`} className="read-more">Read More →</Link>