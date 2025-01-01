import React, { useState, useEffect } from "react";
import axios from "axios";

const WriterApplications = () => {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/writers/pending");
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching writer applications:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/writers/approve/${id}`);
      setApplications((prev) => prev.filter((application) => application._id !== id));
      alert("Writer approved successfully.");
    } catch (error) {
      console.error("Error approving writer:", error);
      alert("Failed to approve writer.");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/writers/reject/${id}`);
      setApplications((prev) => prev.filter((application) => application._id !== id));
      alert("Writer rejected successfully.");
    } catch (error) {
      console.error("Error rejecting writer:", error);
      alert("Failed to reject writer.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Writer Applications</h2>
      {applications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((application) => (
            <div
              key={application._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden p-4"
            >
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {application.fullName}
              </h3>
              <p className="text-gray-600">
                <strong>Email:</strong> {application.email}
              </p>
              <p className="text-gray-600">
                <strong>Phone:</strong> {application.countryCode + application.phone}
              </p>
              <p className="text-gray-600">
                <strong>Expertise:</strong> {application.expertise}
              </p>
              <p className="text-gray-600">
                <strong>Qualifications:</strong> {application.qualifications}
              </p>
              <p className="text-gray-600">
                <strong>Experience:</strong> {application.experience}
              </p>
              <div className="mt-4 flex justify-between space-x-2">
                <button
                  onClick={() => handleApprove(application._id)}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(application._id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-600 text-lg">No pending applications at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default WriterApplications;
