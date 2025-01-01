// WriterSearch.js
import React from "react";

const WriterSearch = ({ onBack, onAcceptBid }) => {
  const writers = [
    {
      name: "Obute G",
      rating: 4.9,
      reviews: 3819,
      price: 28,
      description: "Bachelor, Manufacturing Engineering (Technology)\nCompleted 94 Computer security projects out of 10194",
    },
    {
      name: "Jane D",
      rating: 4.7,
      reviews: 2301,
      price: 32,
      description: "Masters, Computer Science\nCompleted 120 AI-related projects out of 500",
    },
  ];

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center">
      <div className="bg-white w-3/4 rounded-md shadow-md p-8 mt-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Choose an Expert for Your Project
        </h2>
        <p className="text-gray-600 mb-6">Step 2: At the auction</p>

        {writers.map((writer, index) => (
          <div
            key={index}
            className="border p-4 mb-4 rounded-md shadow-md flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {writer.name}
              </h3>
              <p className="text-gray-600 text-sm">Rating: {writer.rating} ⭐</p>
              <p className="text-gray-600 text-sm">
                {writer.reviews} reviews | ${writer.price} per project
              </p>
              <p className="text-gray-600 text-sm mt-2">
                {writer.description}
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={onAcceptBid} // Call onAcceptBid when selecting a writer
              >
                Hire this Expert
              </button>
            </div>
          </div>
        ))}

        <button
          className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          onClick={onBack}
        >
          Back to Project Creation
        </button>
      </div>
    </div>
  );
};

export default WriterSearch;
