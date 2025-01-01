import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserSignUp = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const validateFields = () => {
    const newErrors = {};
    if (isSignUp && !fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Valid email is required.";
    if (isSignUp && email !== confirmEmail)
      newErrors.confirmEmail = "Emails do not match.";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters long.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateFields()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/users/register", {
        fullName,
        email,
        password,
      });
      setMessage("Account created successfully!");
      setErrors({});
      setTimeout(() => navigate("/"), 2000); // Redirect to Landing page after 2 seconds
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });
      const { token } = response.data;

      // Store token in localStorage
      localStorage.setItem("authToken", token);
      setIsLoggedIn(true);
      setMessage("Login successful!");
      setErrors({});
      setTimeout(() => navigate("/StudentBody"), 2000); // Redirect to StudentBody after 2 seconds
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid credentials.");
    }
  };

  const handleLogout = () => {
    // Clear session
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
          <button
            className="mt-6 w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignUp ? "User Sign-Up" : "Log In"}
        </h2>

        {isSignUp && (
          <>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="block mt-2 px-4 py-2 w-full rounded-md border"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </>
        )}

        <label className="block mt-4 text-gray-700 font-medium">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="block mt-2 px-4 py-2 w-full rounded-md border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        {isSignUp && (
          <>
            <label className="block mt-4 text-gray-700 font-medium">
              Re-enter Email
            </label>
            <input
              type="email"
              placeholder="Re-enter your email"
              className="block mt-2 px-4 py-2 w-full rounded-md border"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
            />
            {errors.confirmEmail && (
              <p className="text-red-500 text-sm">{errors.confirmEmail}</p>
            )}
          </>
        )}

        <label className="block mt-4 text-gray-700 font-medium">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="block mt-2 px-4 py-2 w-full rounded-md border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        {message && <p className="mt-2 text-green-500 text-sm">{message}</p>}

        <button
          className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
          onClick={isSignUp ? handleSignUp : handleLogin}
        >
          {isSignUp ? "Sign Up" : "Log In"}
        </button>

        <p
          className="mt-4 text-center text-blue-500 hover:underline cursor-pointer"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setMessage("");
            setErrors({});
          }}
        >
          {isSignUp
            ? "Already have an account? Log in here."
            : "Don't have an account? Sign up here."}
        </p>
      </div>
    </div>
  );
};

export default UserSignUp;
