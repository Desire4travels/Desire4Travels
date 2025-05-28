import React from 'react';
import './BlogsCard.css';

const BlogCard = ({ imgSrc, title}) => {
  return (
    <div className='blog-card'>
      <img src={imgSrc} alt={title} className="blog-image" />
      <div className="card-content">
        <h2>{title}</h2>
        <button className="detail-btn">Details</button>
      </div>
    </div>
  );
};

export default BlogCard;
