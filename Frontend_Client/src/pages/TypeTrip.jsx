import React from 'react';
import { Link } from 'react-router-dom';
import './TypeTrip.css';
import Mountain from '../assets/Mountain.webp';
import Beach from '../assets/Beach.webp';
import Religious from '../assets/Religious.webp';
import Treks from '../assets/Treks.webp';
import Offbeat from '../assets/Offbeat.webp';
import Other from '../assets/Other.webp';
import { Helmet } from "react-helmet";


const types = [
  { name: 'Mountain', image: Mountain },
  { name: 'Beach', image: Beach },
  { name: 'Religious', image: Religious },
  { name: 'Treks', image: Treks },
  { name: 'Offbeat', image: Offbeat },
  { name: 'Other', image: Other }
];

const TypeTrip = () => {
  return (
    <div className="typetrip">
      <Helmet>
        <title>Trip Types | Your Company Name</title>
        <meta name="description" content="Explore various types of trips like mountain, beach, religious, and more to plan your next adventure." />
        <meta name="keywords" content="trip types, mountain, beach, religious, treks, offbeat, other travel" />
        <meta name="author" content="Your Company Name" />
        <meta property="og:title" content="Explore Different Types of Trips" />
        <meta property="og:description" content="Browse through a wide range of trip types to find your perfect getaway." />
      </Helmet>

      <h1>Type of Trips</h1>
      <div className="typetrip-box">
        {types.map((type) => (
          <Link
            to={`/triptype/${type.name}`}
            className="typetripcard"
            key={type.name}
          >
            <img src={type.image} alt={type.name} className="logo" />
            <p>{type.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TypeTrip;
