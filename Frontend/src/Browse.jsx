import React, { useState, useEffect } from "react";
import axios from "axios";

const Browse = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [filters, setFilters] = useState({
    allQuestions: false,
    collegeHWHelp: false,
    invitations: false,
    k12Questions: false,
  });

  const [newOrderNotification, setNewOrderNotification] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/assignments"); // Replace with your backend URL
        setQuestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleFilterChange = (filterKey) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: !prevFilters[filterKey],
    }));
  };

  const filteredQuestions = questions.filter((question) => {
    if (filters.allQuestions) return true;
    if (filters.collegeHWHelp && question.category === "College HW help") return true;
    if (filters.invitations && question.status === "Invitation") return true;
    if (filters.k12Questions && question.category === "K-12") return true;
    return false;
  });

  if (loading) {
    return <p>Loading questions...</p>;
  }

  return (
    <div className="flex-grow p-6 bg-gray-100 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Browse Eligible Questions</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.allQuestions}
              onChange={() => handleFilterChange("allQuestions")}
            />
            <span>All questions</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.collegeHWHelp}
              onChange={() => handleFilterChange("collegeHWHelp")}
            />
            <span>College HW help</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.invitations}
              onChange={() => handleFilterChange("invitations")}
            />
            <span>Invitations</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.k12Questions}
              onChange={() => handleFilterChange("k12Questions")}
            />
            <span>K-12 questions</span>
          </label>
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <span>New Order Notification</span>
            <input
              type="checkbox"
              checked={newOrderNotification}
              onChange={() => setNewOrderNotification(!newOrderNotification)}
              className="toggle-checkbox"
            />
          </label>
        </div>
      </div>

      {filteredQuestions.length > 0 ? (
        filteredQuestions.map((question) => (
          <div key={question.id} className="bg-white shadow rounded-md p-4 mb-4">
            <div className="flex justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src="https://via.placeholder.com/50"
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-bold">{question.username}</h3>
                  <p className="text-gray-500 text-sm">Status: {question.status}</p>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-700">Category: {question.category}</h4>
                <p className="text-gray-500 text-sm">
                  Academic level: {question.academicLevel} Topic: {question.topic}
                </p>
                <p className="text-gray-500 text-sm">Subject: {question.subject}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-700">Urgency: {question.urgency}</p>
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => alert(`Viewing details for ${question.topic}`)}
                >
                  View detail
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center mt-4">No questions available.</p>
      )}
    </div>
  );
};

export default Browse;
