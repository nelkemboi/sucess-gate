import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { BiArrowToLeft } from "react-icons/bi";
import {
  FaTasks,
  FaListAlt,
  FaUserFriends,
  FaEnvelope,
  FaFileAlt,
  FaBell,
  FaQuestionCircle,
  FaCog,
} from "react-icons/fa";
import { IoMdChatboxes } from "react-icons/io";
import ContactSupport from "./ContactSupport"; // Import the SupportContact component

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar toggle state
  const [isChatOpen, setIsChatOpen] = useState(false); // Chatbox toggle state
  const [messages, setMessages] = useState([]); // Chatbox messages
  const [input, setInput] = useState(""); // Chatbox input text
  const [currentLevel, setCurrentLevel] = useState("Beginner"); // Admin-controlled level
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Settings dropdown state
  const [showSupport, setShowSupport] = useState(false); // Show contact support page

  const navigate = useNavigate(); // Hook for navigation

  // Toggle sidebar open/close
  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { text: input, sender: "You" }]);
      setInput("");
    }
  };

  // Handle logout
  const handleLogout = () => {
    navigate("/"); // Redirect to the landing page
  };

  const levels = ["Beginner", "Standard", "Expert"];

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-gray-800 text-white flex flex-col transition-all duration-500 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 bg-gray-900">
          {isOpen && <span className="text-xl font-bold">SUCCESS GATE</span>}
          <BiArrowToLeft
            size={24}
            className={`cursor-pointer transform transition-transform ${
              isOpen ? "rotate-0" : "rotate-180"
            }`}
            onClick={toggleNav}
          />
        </div>
        <ul className="flex-grow space-y-2 mt-4">
          <li className="px-6 py-4 hover:bg-gray-700 cursor-pointer flex items-center">
            <FaTasks className="mr-4" />
            {isOpen && (
              <Link
                to="/app"
                className="text-white"
                onClick={() => setShowSupport(false)}
              >
                Dashboard
              </Link>
            )}
          </li>
          <li className="px-6 py-4 hover:bg-gray-700 cursor-pointer flex items-center">
            <FaListAlt className="mr-4" />
            {isOpen && (
              <Link
                to="/app/browse"
                className="text-white"
                onClick={() => setShowSupport(false)}
              >
                Browse Questions
              </Link>
            )}
          </li>
          <li className="px-6 py-4 hover:bg-gray-700 cursor-pointer flex items-center">
            <FaUserFriends className="mr-4" />
            {isOpen && (
              <Link
                to="/app/students"
                className="text-white"
                onClick={() => setShowSupport(false)}
              >
                My Students
              </Link>
            )}
          </li>
          <li
            className="px-6 py-4 hover:bg-gray-700 cursor-pointer flex items-center"
            onClick={() => setShowSupport(true)}
          >
            <FaEnvelope className="mr-4" />
            {isOpen && <span>Contact Support</span>}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col bg-gray-100">
        {/* Top Bar */}
        <div className="flex items-center justify-between bg-white shadow-md py-3 px-6 border-b relative">
          <div>
            <h2 className="text-2xl font-bold text-orange-500">Success Gate</h2>
          </div>
          <div className="flex items-center space-x-6 relative">
            <div>
              <Link
                to="/app/balance"
                className="text-gray-700 cursor-pointer"
                onClick={() => setShowSupport(false)}
              >
                $0.00
              </Link>
            </div>
            <FaBell size={20} className="text-gray-700" />
            <span className="text-gray-700 cursor-pointer">Notifications</span>
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

        {/* Levels Section */}
        <div className="flex justify-center bg-white py-3 px-6 shadow-md border-b">
          <div className="flex space-x-8">
            {levels.map((level) => (
              <div
                key={level}
                className={`flex items-center space-x-2 ${
                  currentLevel === level ? "text-blue-500" : "text-gray-500"
                }`}
              >
                <div
                  className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                    currentLevel === level
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-400"
                  }`}
                >
                  {currentLevel === level && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                  )}
                </div>
                <span>{level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Outlet or Support Contact */}
        <div className="p-6 overflow-auto flex-grow">
          {showSupport ? <ContactSupport /> : <Outlet />}
        </div>
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
                  <span className="block text-sm font-medium text-gray-700">
                    {message.sender}
                  </span>
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
