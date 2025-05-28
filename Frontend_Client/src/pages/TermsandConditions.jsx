import { useState } from 'react';
import './TermsandConditions.css';
import { Helmet } from 'react-helmet';

const termsData = [
  {
    question: "General Terms",
    answer: [
      "The advance amount is refundable as per the cancellation policy.",
      "Full payment of the trip cost must be made before the trip begins. Pending payments may eventually lead to trip cancellation.",
      "Any add-ons during the trip will incur additional charges and must be paid in advance.",
      "IDs will be verified before boarding. No boarding will be allowed without a valid Government ID.",
      "Transfer of bookings is not permitted. Only the names mentioned at confirmation are allowed to travel.",
      "No refunds for any inclusions not availed by the client.",
      "Travelers must take care of their luggage and belongings. The management is not responsible for damaged or missing items.",
      "Departure time is fixed. Travelers must update their status with Trip Coordinators and report at the pickup point 30 minutes prior to departure.",
      "Air Conditioning will be switched off in the hills and at the driver’s discretion during the trip for safety reasons.",
      "Drinking and smoking are strictly prohibited during journeys for the health and safety of all passengers.",
      "No misconduct or indiscipline will be tolerated. We strive to provide a hassle-free and memorable experience.",
      "Desire4travels is not responsible for delays or alterations due to natural hazards, accidents, machinery breakdown, weather, landslides, political issues, or other incidents.",
      "We do not provide insurance coverage for sickness, accidents, theft, or losses.",
      "Itinerary changes may occur due to weather, road conditions, or participant ability to ensure safety and comfort.",
      "Customers are responsible for any damages to hotel or vendor property.",
      "If the specified hotels are unavailable, alternate accommodations in a similar category will be arranged.",
      "Hotel rooms are provided as per the hotel’s standard check-in times. Early check-in or late check-out charges are the customer’s responsibility.",
      "Amendments or changes to trip dates or passengers will be treated as cancellations and cancellation charges apply.",
      "Desire4travels is not responsible for flight cancellations or rescheduling. We will assist with alternatives but any losses are to be borne by the customer.",
      "Photos and videos may be taken during the trip for promotional use. Travelers consent to this unless they notify us in writing otherwise.",
    ],
  },
  {
    question: "Cancellation Policy",
    answer: [
      "30 days before trip: 60% of advance payment will be refunded.",
      "10-30 days before trip: 50% of advance payment will be refunded.",
      "Within 10 days of trip: 25% of advance payment will be refunded.",
      "Within 5 days of trip: 10% of advance payment will be refunded.",
      "On the boarding day of trip: No refund.",
      "The applicable refund amount will be credited within 15 days after the trip completion date.",
    ],
  },
];

const TermsAndConditions = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleSection = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="terms-page">
      <Helmet>
        <title>Terms & Conditions and Cancellation Policy | Desire4Travels</title>
        <meta
          name="description"
          content="Review the Terms & Conditions and Cancellation Policy of Desire4Travels. Learn about booking rules, refunds, traveler responsibilities, and service terms."
        />
        <meta
          name="keywords"
          content="Desire4Travels terms and conditions, cancellation policy, travel terms, booking terms, refund policy, trip cancellations, user responsibilities, cancellation rules, booking conditions, refund eligibility, terms of service, payment policy"
        />
        <meta property="og:title" content="Terms & Conditions and Cancellation Policy | Desire4Travels" />
        <meta
          property="og:description"
          content="Review the Terms & Conditions and Cancellation Policy of Desire4Travels. Learn about booking rules, refunds, traveler responsibilities, and service terms."
        />
      </Helmet>

      <div className="terms-hero">
        <div className="terms-hero-content">
          <h1>Terms and Conditions</h1>
          <p>Please read our policies carefully before booking your trip with Desire4Travels.</p>
        </div>
      </div>

      <div className="terms-container">
        {termsData.map((section, index) => (
          <div
            key={index}
            className={`terms-section ${activeIndex === index ? 'active' : ''}`}
          >
            <div className="terms-question" onClick={() => toggleSection(index)}>
              {section.question}
              <span className="terms-toggle">{activeIndex === index ? '-' : '+'}</span>
            </div>
            {activeIndex === index && (
              <div className="terms-answer">
                <ul>
                  {section.answer.map((point, i) => (
                    <li
                      key={i}
                      className={
                        point ===
                          "The applicable refund amount will be credited within 15 days after the trip completion date."
                          ? "no-dot"
                          : ""
                      }
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsAndConditions;
