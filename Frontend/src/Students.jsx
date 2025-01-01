import React, { useState } from "react";

const Students = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "John Doe",
      rating: 5,
      review: "Great tutor, explained everything clearly!",
      date: "2023-12-01",
    },
    {
      id: 2,
      name: "Jane Smith",
      rating: 4,
      review: "Helpful, but could be faster.",
      date: "2023-11-28",
    },
  ]);

  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("Most Recent");

  // Filter students based on the search input
  const filteredStudents = students
    .filter((student) =>
      student.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "Most Recent") {
        return new Date(b.date) - new Date(a.date);
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Students</h1>

      {/* Search and Sort Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-3 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-3 py-2 rounded">
            🔍
          </button>
        </div>
        <div>
          <label className="mr-2 font-medium">Sort By:</label>
          <select
            className="border rounded px-3 py-2"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option>Most Recent</option>
            <option>Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Students List */}
      {filteredStudents.length > 0 ? (
        <div className="bg-white shadow-md rounded-md p-4">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="flex justify-between items-center border-b py-4"
            >
              <div className="flex items-center">
                <img
                  src={`https://ui-avatars.com/api/?name=${student.name}&background=random`}
                  alt={student.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h2 className="font-bold">{student.name}</h2>
                  <p className="text-sm text-gray-500">
                    {student.review} - {student.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-yellow-500">
                  {"★".repeat(student.rating)}
                  {"☆".repeat(5 - student.rating)}
                </div>
                <span className="text-sm text-gray-500">Rating: {student.rating}/5</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">No students found</p>
      )}
    </div>
  );
};

export default Students;
