import { useState } from 'react';
import './Faq.css';
import { Helmet } from "react-helmet";

const faqData = [
  {
    question: "What destinations do you cover at Desire4Travels?",
    answer:
      "We offer curated travel packages across top tourist destinations in India, including Kashmir, Himachal Pradesh, Goa, Kerala, Andaman & Nicobar Islands, and other scenic locations such as Rajasthan, Northeast India, Uttarakhand, and more.",
  },
  {
    question: "What types of trips do you offer?",
    answer:
      "We specialize in group tours, couple trips, solo travel packages, and customized itineraries. Whether you're planning a honeymoon in Kashmir, a beach holiday in Goa, or a family trip to Kerala backwaters, we’ve got you covered.",
  },
  {
    question: "Can I customize my travel itinerary?",
    answer:
      "Yes! All our India tour packages are customizable. You can choose your destinations, dates, transport, accommodation type, and activities – and we'll create a plan tailored just for you.",
  },
  {
    question: "Are your travel packages budget-friendly?",
    answer:
      "Absolutely. We offer a range of budget travel packages and luxury travel experiences. Whether you want an affordable group trip or a premium getaway, we can create a plan that fits your budget.",
  },
  {
    question: "What is included in the tour package?",
    answer: `
      Our packages typically include:
      - Accommodation (hotels, homestays, or resorts)
      - Local and intercity transportation
      - Sightseeing and activity planning
      - Meals (as per package)
      A detailed itinerary is shared with inclusions and exclusions before booking.`,
  },
  {
    question: "Do you provide transportation from major cities like Delhi or Mumbai?",
    answer:
      "Yes. We arrange pickup and drop from major cities such as Delhi, Mumbai, Bangalore, Chandigarh, and Kochi. Options include Volvo buses, private cabs, trains, or flights.",
  },
  {
    question: "Are your trips suitable for solo female travelers?",
    answer:
      "Yes, we ensure safe and reliable travel arrangements for all travelers, including solo women. We partner only with trusted vendors and accommodations and maintain regular communication throughout the trip.",
  },
  {
    question: "Do you arrange honeymoon or couple trips?",
    answer:
      "Yes! We offer honeymoon packages to romantic destinations like Kashmir, Kerala, Andaman Islands, Manali, and Goa – complete with private stays, candlelight dinners, and customized experiences.",
  },
  {
    question: "How do I book a trip with Desire4Travels?",
    answer:
      "You can reach out to us via WhatsApp, Instagram, or our website contact form. Once we understand your preferences, we’ll send a customized plan and guide you through the booking process.",
  },
  {
    question: "Do you organize trips for colleges or corporate groups?",
    answer:
      "Yes, we offer bulk travel packages for college trips, corporate team outings, and student groups. We provide special group discounts, curated itineraries, and complete travel management.",
  },
  {
    question: "What are the payment terms?",
    answer:
      "We usually require a 50% advance to confirm the booking. The remaining amount is payable before departure. All details are shared transparently in your itinerary.",
  },
  {
    question: "What is your cancellation and refund policy?",
    answer:
      "Our cancellation policy is traveler-friendly. Refund eligibility depends on how early the cancellation is made. We provide full clarity at the time of booking.",
  },
  {
    question: "What should I pack for the trip?",
    answer: `
      Packing recommendations vary by destination:
      - Kashmir/Himachal: Warm clothes, thermals, gloves, sturdy shoes
      - Goa/Andaman: Swimwear, sunscreen, light clothing, flip flops
      - Kerala: Cotton wear, mosquito repellent, rain gear (during monsoons)
      We send a detailed packing list for every trip.`,
  },
  {
    question: "Do you help with flight or train bookings?",
    answer:
      "Yes. We can assist with flight and train ticket bookings on request, especially when included in our travel packages to remote or island destinations like Andaman & Nicobar or Leh-Ladakh.",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="faq-page">
      <Helmet>
        <title>Answers to Common Travel Questions | Desire4Travels</title>
        <meta
          name="description"
          content="Find answers to common travel questions about booking, itineraries, payments, safety, and more. Get clear information from the Desire4Travels team."
        />
        <meta
          name="keywords"
          content="travel FAQs, common travel questions, Desire4Travels help, booking questions, travel safety, itinerary help, payment information, travel planning support, travel customer service, travel assistance, frequent travel inquiries"
        />
        <meta property="og:title" content="Answers to Common Travel Questions | Desire4Travels" />
        <meta
          property="og:description"
          content="Find answers to common travel questions about booking, itineraries, payments, safety, and more. Get clear information from the Desire4Travels team."
        />
      </Helmet>

      {/* Hero Header */}
      <div className="faq-hero">
        <div className="faq-hero-content">
          <h1>Frequently Asked Questions</h1>
          <p>Your travel questions answered – everything you need to know about Desire4Travels</p>
        </div>
      </div>

      {/* FAQ Content Container */}
      <div className="faq-container">
        <div className="faq-list">
          {faqData.map((item, index) => (
            <div
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              key={index}
            >
              <div
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                {item.question}
                <span className="faq-toggle">{activeIndex === index ? '-' : '+'}</span>
              </div>
              {activeIndex === index && (
                <div className="faq-answer">
                  {item.answer.split('\n').map((line, idx) => (
                    <p key={idx}>{line.trim()}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
