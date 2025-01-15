import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const WriterSearch = ({ onBack }) => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bids from the API
  useEffect(() => {
    const fetchBids = async () => {
      try {
        console.log("Fetching bids for project ID:", projectId);
        const response = await axios.get(`http://localhost:5000/api/bids/${projectId}`);
        setWriters(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bids:", err.response || err.message);
        setError("Failed to load bids. Please try again later.");
        setLoading(false);
      }
    };

    if (projectId) {
      fetchBids();
    } else {
      setError("Invalid Project ID. Please check the URL.");
      setLoading(false);
    }
  }, [projectId]);

  // Navigate to payment page
  const handleHireExpert = (writerId) => {
    navigate(`/payment/${projectId}/${writerId}`);
  };

  if (loading) {
    return <p>Loading bids...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center">
      <div className="bg-white w-3/4 rounded-md shadow-md p-8 mt-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Choose an Expert for Your Project
        </h2>
        <p className="text-gray-600 mb-6">Step 2: At the auction</p>

        {writers.length === 0 ? (
          <p className="text-gray-600 text-sm mt-4">
            No bid placed for this project.
          </p>
        ) : (
          writers.map((writer) => (
            <div
              key={writer._id}
              className="border p-4 mb-4 rounded-md shadow-md flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {writer.fullName}
                </h3>
                <p className="text-gray-600 text-sm">Rating: {writer.reviews} ⭐</p>
                <p className="text-gray-600 text-sm">
                  {writer.questionsAnswered} questions answered | ${writer.price} per project
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  On-Time Delivery: {writer.onTimeDelivery}%
                </p>
              </div>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={() => handleHireExpert(writer._id)}
              >
                Hire this Expert
              </button>
            </div>
          ))
        )}

        <button
          className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          onClick={() => navigate("/StudentBody")}
        >
          Back to Project Creation
        </button>
      </div>
    </div>
  );
};

export default WriterSearch;
