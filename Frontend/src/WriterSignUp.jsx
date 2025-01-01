import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Writer = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1"); // Default country code
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [expertise, setExpertise] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [experience, setExperience] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const navigate = useNavigate(); // For navigation

  const expertiseOptions = [
    "Mathematics",
    "History",
    "Science (Biology, Physics, Chemistry)",
    "English Literature",
    "Social Studies",
    "Economics",
    "Political Science",
    "Psychology",
    "Philosophy",
    "Art and Design",
    "Music",
    "Health Sciences",
    "Computer Science",
    "Business Studies",
    "Environmental Studies",
    "Geography",
    "Sociology",
    "Linguistics",
    "Law",
    "Engineering",
  ];

  const countryCodes = [
    { name: "United States", code: "+1" },
    { name: "Kenya", code: "+254" },
    { name: "South Africa", code: "+27" },
    { name: "Nigeria", code: "+234" },
    { name: "India", code: "+91" },
    { name: "United Kingdom", code: "+44" },
    { name: "China", code: "+86" },
    { name: "Japan", code: "+81" },
    { name: "Germany", code: "+49" },
    { name: "France", code: "+33" },
  ];

  const validateFields = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Valid email is required.";
    if (!phone.trim() || !/^\d{10,15}$/.test(phone))
      newErrors.phone = "Enter a valid phone number.";
    if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters long.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!expertise) newErrors.expertise = "Please select your expertise.";
    if (!qualifications.trim())
      newErrors.qualifications = "Educational qualifications are required.";
    if (!experience.trim()) newErrors.experience = "Work experience is required.";
    if (attachments.length > 2)
      newErrors.attachments = "You can only upload up to 2 files.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateFields()) return;

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", `${countryCode}${phone}`);
    formData.append("password", password);
    formData.append("expertise", expertise);
    formData.append("qualifications", qualifications);
    formData.append("experience", experience);
    attachments.forEach((file) => formData.append("attachments", file));

    try {
      await axios.post("http://localhost:5000/api/writers/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage("Application submitted successfully!");
      setTimeout(() => {
        navigate("/"); // Redirect to the landing page after a delay
      }, 3000);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to submit the application.");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    const updatedAttachments = [...attachments];
    updatedAttachments.splice(index, 1);
    setAttachments(updatedAttachments);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Writer Arena Sign-Up</h1>
      <div className="max-w-4xl w-full bg-white p-8 shadow-md rounded-lg">
        <label className="block text-gray-700 font-medium">Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="block mt-2 px-4 py-2 w-full rounded-md border"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
        )}

        <label className="block mt-4 text-gray-700 font-medium">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block mt-2 px-4 py-2 w-full rounded-md border"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

        <label className="block mt-4 text-gray-700 font-medium">Phone</label>
        <div className="flex items-center">
          <select
            className="px-4 py-2 border rounded-md"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.code})
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-grow px-4 py-2 rounded-md border"
          />
        </div>
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}

        <label className="block mt-4 text-gray-700 font-medium">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block mt-2 px-4 py-2 w-full rounded-md border"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}

        <label className="block mt-4 text-gray-700 font-medium">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="block mt-2 px-4 py-2 w-full rounded-md border"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}

        <label className="block mt-4 text-gray-700 font-medium">Expertise</label>
        <select
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
          className="block mt-2 px-4 py-2 w-full rounded-md border"
        >
          <option value="">Select expertise</option>
          {expertiseOptions.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.expertise && (
          <p className="text-red-500 text-sm mt-1">{errors.expertise}</p>
        )}

        <label className="block mt-4 text-gray-700 font-medium">Qualifications</label>
        <textarea
          placeholder="Enter qualifications"
          value={qualifications}
          onChange={(e) => setQualifications(e.target.value)}
          className="block mt-2 px-4 py-2 w-full rounded-md border"
          rows="3"
        />
        {errors.qualifications && (
          <p className="text-red-500 text-sm mt-1">{errors.qualifications}</p>
        )}

        <label className="block mt-4 text-gray-700 font-medium">Experience</label>
        <textarea
          placeholder="Enter experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="block mt-2 px-4 py-2 w-full rounded-md border"
          rows="3"
        />
        {errors.experience && (
          <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
        )}

        <label className="block mt-4 text-gray-700 font-medium">Attachments</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block mt-2"
        />
        {attachments.map((file, idx) => (
          <div key={idx} className="mt-2 flex items-center space-x-2">
            <p>{file.name}</p>
            <button
              onClick={() => removeAttachment(idx)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        {errors.attachments && (
          <p className="text-red-500 text-sm mt-1">{errors.attachments}</p>
        )}

        <button
          onClick={handleSignUp}
          className="mt-6 w-full px-6 py-3 bg-green-600 text-white rounded-lg"
        >
          Submit
        </button>

        {successMessage && (
          <div className="mt-4 bg-green-100 text-green-700 p-4 rounded">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Writer;
