import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to WebSocket server

const Browse = () => {
  const [projects, setProjects] = useState([]);
  const [bids, setBids] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    allProjects: false,
    collegeHWHelp: false,
    invitations: false,
    k12Projects: false,
  });
  const [prices, setPrices] = useState({});
  const [popupMessages, setPopupMessages] = useState({});

  // Fetch projects and bids
  useEffect(() => {
    const fetchProjectsAndBids = async () => {
      try {
        const [projectsResponse, bidsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/projects"),
          axios.get("http://localhost:5000/api/bids/all"),
        ]);

        const projects = projectsResponse.data;
        const bids = bidsResponse.data;

        const bidsByProject = bids.reduce((acc, bid) => {
          acc[bid.projectId] = acc[bid.projectId] || [];
          acc[bid.projectId].push(bid);
          return acc;
        }, {});

        setProjects(projects);
        setBids(bidsByProject);
        setLoading(false);

        const initialPrices = projects.reduce((acc, project) => {
          acc[project._id] = 3; // Default starting price
          return acc;
        }, {});
        setPrices(initialPrices);
      } catch (error) {
        console.error("Error fetching projects and bids:", error);
        setLoading(false);
      }
    };

    fetchProjectsAndBids();

    // WebSocket listeners
    socket.on("newProject", (project) => {
      setProjects((prevProjects) => [project, ...prevProjects]);
    });

    socket.on("newBid", (bid) => {
      setBids((prevBids) => ({
        ...prevBids,
        [bid.projectId]: [...(prevBids[bid.projectId] || []), bid],
      }));
      setPopupMessages((prevMessages) => ({
        ...prevMessages,
        [bid.projectId]: "A new bid has been placed!",
      }));
    });

    socket.on("deleteBid", ({ bidId, projectId }) => {
      setBids((prevBids) => ({
        ...prevBids,
        [projectId]: prevBids[projectId]?.filter((bid) => bid._id !== bidId),
      }));
    });

    return () => {
      socket.off("newProject");
      socket.off("newBid");
      socket.off("deleteBid");
    };
  }, []);

  // Handle price changes
  const handlePriceChange = (projectId, e) => {
    const newPrice = Math.max(3, parseFloat(e.target.value));
    setPrices((prevPrices) => ({
      ...prevPrices,
      [projectId]: newPrice,
    }));
  };

  // Handle bid placement
  const handlePlaceBid = async (projectId) => {
    try {
      const basePrice = prices[projectId];
      const finalPrice = basePrice * 2.5;

      // Retrieve writer metrics from local storage
      const writerMetrics = JSON.parse(localStorage.getItem("writerMetrics"));
      if (!writerMetrics) {
        setPopupMessages((prevMessages) => ({
          ...prevMessages,
          [projectId]: "Writer metrics not found. Please log in.",
        }));
        return;
      }

      const bidData = {
        projectId,
        price: finalPrice,
        writerId: writerMetrics.id,
        questionsAnswered: writerMetrics.questionsAnswered,
        reviews: writerMetrics.reviews,
        onTimeDelivery: writerMetrics.onTimeDelivery,
      };

      // Send bid data to the backend
      const response = await axios.post("http://localhost:5000/api/bids", bidData);

      // Emit the new bid through WebSocket
      socket.emit("newBid", response.data);

      setPopupMessages((prevMessages) => ({
        ...prevMessages,
        [projectId]: "Bid placed successfully!",
      }));
    } catch (error) {
      console.error("Error placing bid:", error.response?.data || error.message);
      setPopupMessages((prevMessages) => ({
        ...prevMessages,
        [projectId]: "Failed to place bid. Please try again.",
      }));
    }
  };

  // Filter and sort projects
  const filteredProjects = projects.filter((project) => {
    if (filters.allProjects) return true;
    if (filters.collegeHWHelp && project.category === "College HW help") return true;
    if (filters.invitations && project.status === "Invitation") return true;
    if (filters.k12Projects && project.category === "K-12") return true;
    return false;
  });

  const sortedProjects = filteredProjects.sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
    <div className="flex-grow p-6 bg-gray-100 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Browse Eligible Projects</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          {["allProjects", "collegeHWHelp", "invitations", "k12Projects"].map((filterKey) => (
            <label key={filterKey} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters[filterKey]}
                onChange={() =>
                  setFilters((prev) => ({ ...prev, [filterKey]: !prev[filterKey] }))
                }
              />
              <span>{filterKey.replace(/([A-Z])/g, " $1")}</span>
            </label>
          ))}
        </div>
      </div>

      {sortedProjects.length > 0 ? (
        sortedProjects.map((project) => (
          <div key={project._id} className="bg-white shadow rounded-md p-4 mb-4">
            <div className="flex justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={project.profileImage || "https://via.placeholder.com/50"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-bold">Student ID: {project.userID}</h3>
                  <p className="text-gray-500 text-sm">Your Price:</p>
                  <input
                    type="number"
                    value={prices[project._id] || 3}
                    onChange={(e) => handlePriceChange(project._id, e)}
                    min="3"
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-gray-700"
                  />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-700">Category: {project.projectType}</h4>
                <p className="text-gray-500 text-sm">Subject Area: {project.subjectArea}</p>
                <p className="text-gray-500 text-sm">
                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => handlePlaceBid(project._id)}
                >
                  Place Bid
                </button>
                {popupMessages[project._id] && (
                  <p className="text-orange-500 mt-2">{popupMessages[project._id]}</p>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-2 text-right">
              Posted on: {new Date(project.timestamp).toLocaleDateString()}{" "}
              {new Date(project.timestamp).toLocaleTimeString()}
            </div>
            {bids[project._id] &&
              bids[project._id].map((bid) => (
                <div key={bid.bidId} className="p-2 bg-gray-200 rounded mt-2">
                  <p>Bidder: {bid.bidderDetails.name}</p>
                  <p>Price: ${bid.bidderDetails.price}</p>
                  <p>Reviews: {bid.bidderDetails.reviews}</p>
                  <p>On-Time Delivery: {bid.bidderDetails.deliveryInTime}%</p>
                </div>
              ))}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center mt-4">No projects available.</p>
      )}
    </div>
  );
};

export default Browse;
