import React, { useEffect, useState } from "react";
import PackageCard from "../Components/Package/PackageCard";
import "./Package.css";
import { Helmet } from "react-helmet";

const Package = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("https://desire4travels-1.onrender.com/api/packages");
        if (!res.ok) throw new Error("Failed to fetch packages");
        const data = await res.json();
        setPackages(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="package-container">
      <Helmet>
        <title>Travel Deals for Couples, Families & Groups | Desire4Travels</title>
        <meta
          name="description"
          content="Browse our travel packages for every style and budget. From romantic getaways to adventure tours, Desire4Travels offers custom itineraries and great deals."
        />
        <meta
          name="keywords"
          content="travel packages, vacation packages, custom travel plans, adventure travel deals, romantic getaways, family vacation packages, Couple packages, Honeymoon packages, budget travel packages, luxury travel deals, group travel packages, holiday deals, tour packages, personalized travel packages, travel itineraries, Desire4Travels packages"
        />
        <meta name="author" content="Your Company Name" />
        <meta property="og:title" content="Travel Deals for Couples, Families & Groups | Desire4Travels" />
        <meta
          property="og:description"
          content="Browse our travel packages for every style and budget. From romantic getaways to adventure tours, Desire4Travels offers custom itineraries and great deals."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="package-list">
        <header className="package-hero">
          <div className="package-hero-content">
            <h1 className="package-title">Our Packages</h1>
          </div>
        </header>

        <div className="package-grid">
          {loading ? (
            <div className="spinner-container">
            <div className="spinner"></div>
            <div className="spinner-text">Loading packages...</div>
          </div>
          
          ) : packages.length > 0 ? (
            packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                id={pkg.id}
                imgSrc={pkg.photo}
                packageName={pkg.packageName}
                destinations={pkg.destinations}
                price={pkg.price}
                duration={pkg.duration}
              />
            ))
          ) : (
            <p>No packages available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Package;
