// import React, { useEffect, useState } from "react";

// const UpcomingTrip = () => {
//   const [trips, setTrips] = useState([]);

//   useEffect(() => {
//     const fetchTrips = async () => {
//       const url = "https://desire4travels-1.onrender.com/api/upcoming-trips";
//       console.log("🌐 Attempting to fetch upcoming trips from:", url);

//       try {
//         const res = await fetch(url);
//         console.log("📦 Raw response:", res);

//         const contentType = res.headers.get("content-type");
//         console.log("🔍 Content-Type:", contentType);

//         if (!res.ok || !contentType?.includes("application/json")) {
//           throw new Error("Invalid JSON response from server.");
//         }

//         const data = await res.json();
//         console.log("✅ Data received:", JSON.stringify(data, null, 2));

//         // Check and extract trips safely
//         if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0].trips)) {
//           setTrips(data[0].trips);
//         } else {
//           console.warn("⚠️ Unexpected data structure:", data);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching trips:", error);
//       }
//     };

//     fetchTrips();
//   }, []);

//   return (
//     <div>
//       <h2>Upcoming Trips</h2>
//       {trips.length > 0 ? (
//         <ul>
//           {trips.map((trip, index) => (
//             <li key={index}>
//               <strong>{trip.packageId}</strong> – {trip.travelDate}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No upcoming trips available.</p>
//       )}
//     </div>
//   );
// };

// export default UpcomingTrip;


import React, { useEffect, useState } from "react";

const UpcomingTrip = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const url = "https://desire4travels-1.onrender.com/api/upcoming-trips";
      console.log("🌐 Attempting to fetch upcoming trips from:", url);

      try {
        const res = await fetch(url);
        const contentType = res.headers.get("content-type");

        if (!res.ok || !contentType?.includes("application/json")) {
          throw new Error("Invalid JSON response from server.");
        }

        const data = await res.json();
        console.log("✅ Data received:", JSON.stringify(data, null, 2));

        if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0].trips)) {
          setTrips(data[0].trips);
        } else {
          console.warn("⚠️ Unexpected data structure:", data);
        }
      } catch (error) {
        console.error("❌ Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Upcoming Trips</h2>
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {trips.map((trip, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 transition transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Package ID: {trip.packageId}</h3>
              <p className="text-gray-700">Travel Date: {trip.travelDate}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No upcoming trips available.</p>
      )}
    </div>
  );
};

export default UpcomingTrip;
