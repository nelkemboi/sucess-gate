import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaBell, FaQuestionCircle, FaCog } from "react-icons/fa";
import { IoMdChatboxes } from "react-icons/io";
import CreateProject from "./CreateProject";

const Navigation = ({ onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Active");
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // Chatbox toggle state
  const [messages, setMessages] = useState([]); // Chat messages
  const [input, setInput] = useState(""); // Chat input field

  const navigate = useNavigate();
  
  const userID = localStorage.getItem("userID"); // Get user ID from localStorage

  const handleLogout = () => {
    setIsDropdownOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      navigate("/"); // Navigate to the landing page if no `onLogout` function provided
    }
  };

  const handleSendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { text: input, sender: "You" }]);
      setInput("");
    }
  };

  const tabs = ["Active", "Completed", "Notebank Unlocks"];

  return (
    <div className="flex flex-col h-screen relative">
      <div className="flex items-center justify-between bg-white shadow-md py-3 px-6 border-b relative">
        <div>
          <h2 className="text-2xl font-bold text-orange-500">Success Gate</h2>
        </div>
        <div className="flex items-center space-x-6 relative">
          <FaBell size={20} className="text-gray-700" />
          {!showCreateProject && (
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
              onClick={() => setShowCreateProject(true)}
            >
              Create Project
            </button>
          )}
          <FaQuestionCircle size={20} className="text-gray-700" />
          <span className="text-gray-700 cursor-pointer">Help</span>
          <div className="relative">
            <FaCog
              size={20}
              className="text-gray-700 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <Link to="/app/profile" className="text-gray-700">
                      My Profile
                    </Link>
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Welcome message section */}
      <div className="bg-white border-b py-2 px-6 shadow-md">
        <p className="text-left text-gray-700 font-medium">
          Welcome, User ID: {userID}
        </p>
      </div>

      {!showCreateProject && (
        <div className="bg-white border-b shadow-md">
          <div className="flex space-x-6 px-6 py-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`text-gray-700 font-semibold ${
                  activeTab === tab ? "border-b-2 border-orange-500" : "hover:text-orange-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-6 overflow-auto flex-grow bg-gray-100">
        {showCreateProject ? (
          <CreateProject
            onBack={() => {
              setShowCreateProject(false);
              setActiveTab("Student Body");
            }}
          />
        ) : (
          <>
            {activeTab === "Active" && (
              <div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search for question"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <table className="w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 text-left">Title</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Time Remaining</th>
                      <th className="px-4 py-2 text-left">Tutor</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 text-center" colSpan="5">
                        <div className="flex flex-col items-center">
                          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-400">🌴</span>
                          </div>
                          <p className="text-gray-500 mt-4">
                            You have no active questions yet.
                          </p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "Completed" && <p className="text-gray-500">No completed questions to show.</p>}

            {activeTab === "Notebank Unlocks" && <p className="text-gray-500">No Notebank unlocks to show.</p>}
          </>
        )}
        <Outlet />
      </div>

      {/* Floating Chat Icon */}
      <div className="fixed bottom-6 right-6">
        <button
          className="bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-500"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <IoMdChatboxes size={24} />
        </button>

        {/* Chatbox */}
        {isChatOpen && (
          <div className="fixed bottom-20 right-6 bg-white w-80 h-96 rounded-lg shadow-lg flex flex-col">
            <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
              <span>Chat</span>
              <button
                className="text-white hover:text-gray-300"
                onClick={() => setIsChatOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="flex-grow p-4 overflow-auto">
              {messages.map((message, index) => (
                <div key={index} className="mb-2">
                  <span className="block text-sm font-medium text-gray-700">{message.sender}</span>
                  <span className="block text-gray-900">{message.text}</span>
                </div>
              ))}
            </div>
            <div className="p-2 border-t">
              <input
                type="text"
                className="w-full border rounded-md px-4 py-2"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2 w-full hover:bg-blue-500"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
