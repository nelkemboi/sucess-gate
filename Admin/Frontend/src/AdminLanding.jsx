import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundImage from "/images/student.jpg"; // Replace with the correct path to your background image
import {
  FaCcApplePay,
  FaGooglePay,
  FaCcVisa,
  FaCcMastercard,
  FaPaypal,
  FaCcDiscover,
} from "react-icons/fa";

const AdminLanding = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Password state
  const navigate = useNavigate(); // For navigation

  const handleLogin = async () => {
    try {
      // Use dummy credentials for demonstration
      const dummyEmail = "admin@successGate.com";
      const dummyPassword = "Admin123";

      if (email === dummyEmail && password === dummyPassword) {
        localStorage.setItem("adminAuthToken", "dummy-token"); // Dummy token
        setIsLoggedIn(true); // Update login state
        alert("Login Successful!");
        navigate("/admin/dashboard");
      } else {
        throw new Error("Invalid credentials! Please try again.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthToken");
    setIsLoggedIn(false);
    alert("You have been logged out.");
    navigate("/");
  };

  return (
    <div className="w-full h-screen bg-gray-100 relative">
      {/* Background Section */}
      <div
        className="w-full h-screen bg-cover bg-center relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black"></div>

        {/* Login Section */}
        {!isLoggedIn ? (
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 z-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-orange-500">Admin Login</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center z-10">
            <h2 className="text-2xl font-bold text-white mb-6">Welcome, Admin</h2>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
            >
              Go to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="mb-4">&copy; Success Gate 2024. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <FaCcApplePay size={36} className="text-gray-300 hover:text-white transition" />
            <FaGooglePay size={36} className="text-gray-300 hover:text-white transition" />
            <FaCcVisa size={36} className="text-blue-500 hover:text-white transition" />
            <FaCcMastercard size={36} className="text-red-500 hover:text-white transition" />
            <FaPaypal size={36} className="text-blue-700 hover:text-white transition" />
            <FaCcDiscover size={36} className="text-orange-500 hover:text-white transition" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLanding;
