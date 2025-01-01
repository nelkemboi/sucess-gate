import React, { useState, useEffect } from "react";
import axios from "axios";

const WriterDashboard = () => {
  const [metrics, setMetrics] = useState({
    fullName: "",
    tasksInProgress: 0,
    questionsAnswered: 0,
    reviews: 0,
    onTimeDelivery: 100,
    cancelledTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      const email = localStorage.getItem("userEmail"); // Get email from localStorage
      const response = await axios.get(`http://localhost:5000/api/writers/metrics/${email}`);
      setMetrics(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching writer metrics.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{metrics.fullName ? metrics.fullName : 'Writer'}'s Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <p className="text-xl font-bold">{metrics.tasksInProgress}</p>
          <p className="text-gray-500">Tasks in Progress</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <p className="text-xl font-bold">{metrics.questionsAnswered}</p>
          <p className="text-gray-500">Questions Answered</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <div className="flex justify-center">{renderStars(metrics.reviews)}</div>
          <p className="text-gray-500 mt-2">Reviews</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <p className="text-xl font-bold">{metrics.onTimeDelivery}%</p>
          <p className="text-gray-500">On-Time Delivery</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <p className="text-xl font-bold">{metrics.cancelledTasks}</p>
          <p className="text-gray-500">Cancelled Tasks</p>
        </div>
      </div>
    </div>
  );
};

export default WriterDashboard;
