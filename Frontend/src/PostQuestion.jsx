import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PostQuestion = ({ closeModal, onLoginSuccess }) => {
  const [subject, setSubject] = useState("");
  const [timeRequired, setTimeRequired] = useState("");
  const [file, setFile] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For handling errors during login
  const navigate = useNavigate();

  const handlePostSubmit = () => {
    setShowLoginPopup(true); // Show login popup after posting
  };

  const handleLoginSubmit = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check if both email and password are entered
    if (!trimmedEmail || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      // Make the API call to validate login
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email: trimmedEmail,
        password,
      });

      // If login is successful, invoke the onLoginSuccess callback
      const { user } = response.data;
      // Save the userID from the login response to localStorage
      localStorage.setItem("userID", user.userID);
      onLoginSuccess();
      closeModal(); // Close the modal after login success
    } catch (err) {
      // Handle login errors (wrong email or password)
      if (err.response) {
        setError(err.response.data.message || "Invalid credentials. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleSignUpClick = () => {
    closeModal(); // Close the current modal
    navigate("/app/user-signup"); // Navigate to the UserSignUp page
  };

  // Retrieve userID from localStorage
  const userID = localStorage.getItem("userID");

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">
          Your answer awaits! <br />
          We just need you to log in to access your dashboard.
        </h2>
        <label className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="block w-full px-4 py-2 mb-4 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="block text-gray-700 font-medium mb-2">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="block w-full px-4 py-2 mb-4 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {/* Display the error below the password field */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        

        <button
          className="w-full px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400"
          onClick={handleLoginSubmit}
        >
          Log in
        </button>

        {/* Sign Up Link */}
        <p
          className="mt-4 text-center text-blue-500 hover:underline cursor-pointer"
          onClick={handleSignUpClick}
        >
          Don't have an account? Sign up here
        </p>

        <p
          className="mt-4 text-center text-red-500 hover:underline cursor-pointer"
          onClick={closeModal}
        >
          Close
        </p>
      </div>
    </div>
  );
};

export default PostQuestion;
