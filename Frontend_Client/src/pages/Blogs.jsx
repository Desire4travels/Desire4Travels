import React from 'react';
import './Destination.css';
import BlogsCard from '../Components/Destination/DestinationCard';
import destImg1 from '../assets/destImg1.jpg';
import destImg2 from '../assets/destImg1.jpg';
import destImg3 from '../assets/destImg1.jpg';

const Blogs = () => {
  return (
    <div>
      <h1>Blogs</h1>
      <div className='cards-container'>
        <BlogsCard
          imgSrc={destImg1} 
          title="Maldives Beach" 
          location="Maldives" 
          price="25,000" 
        />     
      </div>
    </div>
  );
};

export default Blogs;
