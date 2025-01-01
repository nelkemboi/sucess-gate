import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundImage from "/images/student.jpg"; // Adjust the path if needed
import Navigation from "./Navigation"; // Import Navigation Component
import Browse from "./Browse"; // Import Browse Component
import PostQuestion from "./PostQuestion"; // Import PostQuestion Component
import StudentBody from "./StudentBody"; // Import StudentBody Component
import { FaCcApplePay, FaGooglePay, FaCcVisa, FaCcMastercard, FaPaypal, FaCcDiscover } from "react-icons/fa";

const Landing = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [isExpert, setIsExpert] = useState(false); // Track User/Expert login
  const [showPostQuestion, setShowPostQuestion] = useState(false); // For POST QUESTION modal
  const [showWriterArena, setShowWriterArena] = useState(false); // For WRITER ARENA functionality
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // For navigation

  const handleLogin = async () => {
    try {
      // Determine the API endpoint based on user role (expert or user)
      const endpoint = isExpert
        ? "http://localhost:5000/api/writers/login"
        : "http://localhost:5000/api/users/login";
  
      // Send login request to the appropriate endpoint
      const response = await axios.post(endpoint, {
        email,
        password,
      });
  
      const { token, user } = response.data; // Extract token and user data
  
      // Store token in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userEmail", user.email);
  
      // Update login state
      setIsLoggedIn(true);
  
      alert("Login Successful!");
  
      // Redirect to the appropriate dashboard
      if (isExpert) {
        navigate("/app"); // Redirect to expert dashboard
      } else {
        navigate("/StudentBody"); // Redirect to user dashboard
      }
    } catch (error) {
      // Log error for debugging (optional)
      console.error("Login Error:", error.response?.data || error.message);
  
      // Show error message to the user
      alert(error.response?.data?.message || "Invalid credentials! Please try again.");
    }
  };
  
  
  const handleLogout = () => {
    // Clear session data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false); // Log the user out
    setEmail(""); // Clear email
    setPassword(""); // Clear password
    alert("You have been logged out.");
    navigate("/");
  };

  const handleSignUp = () => {
    setShowWriterArena(false); // Close the modal
    if (isExpert) {
      navigate("/app/writer-signup"); // Navigate to WriterSignUp page
    } else {
      navigate("/app/user-signup"); // Redirect to Landing page after successful sign up
    }
  };

  if (isLoggedIn) {
    return isExpert ? (
      <div className="app-container flex flex-col">
        <Navigation onLogout={handleLogout} /> {/* Render Navigation for Expert */}
        <Browse onLogout={handleLogout} /> {/* Render Browse for Expert */}
      </div>
    ) : (
      <div className="app-container flex flex-col">
        <StudentBody onLogout={handleLogout} /> {/* Render StudentBody for User */}
      </div>
    );
  }

  return (
    <div className="w-full h-auto bg-gray-100 relative">
      {/* Header Section with Background */}
      <div
        className="w-full h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black"></div>

        {/* Navigation Bar */}
        <div className="navbar flex justify-between items-center px-10 py-4 absolute top-0 w-full z-10">
          <div className="icon">
            <h2 className="text-3xl font-bold text-orange-500">Success Gate</h2>
          </div>
          <div className="menu">
            <ul className="flex space-x-8 text-white">
              <li>
                <a href="#" className="hover:underline">
                  HOME
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  ABOUT
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  SERVICES
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:underline"
                  onClick={() => setShowWriterArena(!showWriterArena)}
                >
                  LOGINS
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="content text-white absolute left-10 top-1/4 z-10 max-w-lg">
          <h1 className="text-5xl font-extrabold leading-snug">
            Success Gate <br />
            <span className="text-yellow-400">Online Tutoring & Coaching</span>
          </h1>
          <p className="mt-6 text-xl font-semibold text-yellow-200 leading-8">
            Stuck with an assignment or any project? Post your question here to be
            helped by our vast range of experts.
          </p>
          <button
            className="mt-4 px-8 py-3 bg-yellow-500 text-black text-lg font-bold rounded-full hover:bg-yellow-600 transition duration-300 shadow-lg"
            onClick={() => setShowPostQuestion(true)}
          >
            Post Question
          </button>
        </div>

        {/* LOGINS Popup */}
        {showWriterArena && (
          <div className="absolute top-32 right-20 bg-white p-6 rounded-md w-96 shadow-lg z-50">
            <div className="flex justify-between mb-6">
              {/* User Tab */}
              <button
                className={`px-6 py-3 ${
                  !isExpert ? "bg-green-500 text-white" : "bg-gray-200"
                } rounded-md`}
                onClick={() => setIsExpert(false)}
              >
                As User
              </button>

              {/* Expert Tab */}
              <button
                className={`px-6 py-3 ${
                  isExpert ? "bg-blue-500 text-white" : "bg-gray-200"
                } rounded-md`}
                onClick={() => setIsExpert(true)}
              >
                As Expert
              </button>
            </div>

            {/* Login Form */}
            <div>
              <h2 className="text-xl font-bold text-center mb-4">
                {isExpert ? "Expert Login" : "User Login"}
              </h2>
              <input
                type="email"
                placeholder="Enter your email"
                className="block mt-4 px-4 py-2 w-full rounded-md border border-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter your password"
                className="block mt-4 px-4 py-2 w-full rounded-md border border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="mt-4 w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
                onClick={handleLogin}
              >
                Login
              </button>

              {/* Sign Up Link */}
              <p className="mt-4 text-center">
                Don't have an account?{" "}
                <span
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={handleSignUp}
                >
                  Sign up here
                </span>
              </p>
            </div>

            <p
              className="mt-4 text-center text-red-500 hover:underline cursor-pointer"
              onClick={() => setShowWriterArena(false)}
            >
              Close
            </p>
          </div>
        )}

        {/* POST QUESTION Popup */}
        {showPostQuestion && (
          <PostQuestion
            closeModal={() => setShowPostQuestion(false)}
            onLoginSuccess={() => {
              setIsLoggedIn(true);
              setIsExpert(false); // User login after posting a question
            }}
          />
        )}
      </div>

      {/* Additional Information Section */}
      <div className="py-12 px-10 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-bold text-green-500">12+</h3>
            <p className="mt-2 text-gray-700">Years helping students in their studies</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-bold text-green-500">5K+</h3>
            <p className="mt-2 text-gray-700">Highly qualified and trusted experts</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-bold text-green-500">400K+</h3>
            <p className="mt-2 text-gray-700">Successfully completed orders</p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-bold text-green-500">4.8</h3>
            <p className="mt-2 text-gray-700">Average user rating</p>
          </div>
        </div>
      </div>

      <div className="py-12 px-10 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">Our Guarantee</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-md">
            <span className="text-green-500 font-bold text-2xl">✔</span>
            <p className="text-gray-700">Plagiarism-Free Content</p>
          </div>
          <div className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-md">
            <span className="text-green-500 font-bold text-2xl">✔</span>
            <p className="text-gray-700">Top Rated Writers</p>
          </div>
          <div className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-md">
            <span className="text-green-500 font-bold text-2xl">✔</span>
            <p className="text-gray-700">24/7 Customer Support</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="mb-4">&copy; Success Gate 2024. All rights reserved.</p>
          <div className="flex justify-right space-x-4">
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

export default Landing;
