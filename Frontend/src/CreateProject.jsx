import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [briefDescription, setBriefDescription] = useState("");
  const [projectType, setProjectType] = useState("");
  const [subjectArea, setSubjectArea] = useState("");
  const [attachments, setAttachments] = useState([]); // Store multiple files
  const [deadline, setDeadline] = useState("");
  const [autoMatch, setAutoMatch] = useState(false);
  const [pages, setPages] = useState(1); // Number of pages
  const [error, setError] = useState(""); // For handling errors
  const [success, setSuccess] = useState(""); // For success messages

  const navigate = useNavigate(); // Navigation hook

  const projectTypes = [
    "Essays",
    "Tests",
    "Research Papers",
    "Presentations",
    "Case Studies",
    "Lab Reports",
    "Group Projects",
    "Quizzes",
    "Coding Assignments",
    "Problem Sets",
    "Portfolios",
    "Reviews (e.g., book or article reviews)",
    "Creative Writing",
    "Discussion Posts",
    "Annotated Bibliographies",
    "Data Analysis Projects",
    "Proposals",
    "Speeches",
    "Reflections/Personal Statements",
    "Timelines",
  ];

  const subjectAreas = [
    "Mathematics",
    "History",
    "Science (Biology, Physics, Chemistry, etc.)",
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

  const handleCreate = async () => {
    setError(""); // Reset error state
    setSuccess(""); // Reset success state

    if (!projectTitle || !briefDescription || !projectType || !subjectArea || !deadline) {
      setError("Please fill in all required fields.");
      return;
    }

    const userID = localStorage.getItem("userID");
    console.log("UserID:", userID); // Debugging UserID
    if (!userID || userID.length < 8) {
      setError("Invalid or missing User ID. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("userID", userID);
    formData.append("projectTitle", projectTitle);
    formData.append("briefDescription", briefDescription);
    formData.append("projectType", projectType);
    formData.append("subjectArea", subjectArea);
    formData.append("deadline", deadline);
    formData.append("autoMatch", autoMatch);
    formData.append("pages", pages);

    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    try {
      const response = await axios.post("http://localhost:5000/api/projects", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const projectId = response.data.projectId; // Get projectId from backend response
      console.log("Created Project ID:", projectId);

      setSuccess("Project created successfully!");
      setTimeout(() => navigate(`/WriterSearch/${projectId}`), 2000); // Navigate to WriterSearch with projectId
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      setError("An error occurred while creating the project. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prevFiles) => [...prevFiles, ...files]);
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md shadow-md w-2/3">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Create a New Project</h2>

        <label className="block text-gray-600 font-medium mb-2">Project Title*</label>
        <input
          type="text"
          placeholder="Enter your project title"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
        />

        <label className="block text-gray-600 font-medium mb-2">Brief Description*</label>
        <textarea
          placeholder="Enter a brief description"
          value={briefDescription}
          onChange={(e) => setBriefDescription(e.target.value)}
          className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
          rows="4"
        ></textarea>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-medium mb-2">Project Type*</label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Select Project Type
              </option>
              {projectTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-2">Subject Area*</label>
            <select
              value={subjectArea}
              onChange={(e) => setSubjectArea(e.target.value)}
              className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
            >
              <option value="" disabled>
                Select Subject Area
              </option>
              {subjectAreas.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-medium mb-2">Number of Pages*</label>
          <input
            type="number"
            min="1"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <span className="text-gray-600">Attach Files</span>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {attachments.length > 0 && (
          <div className="mb-4">
            <h3 className="text-gray-600">Uploaded Files:</h3>
            <ul className="list-disc pl-5">
              {attachments.map((file, index) => (
                <li key={index} className="text-gray-700">{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center space-x-4 mb-4">
          <label className="flex items-center space-x-2">
            <span className="text-gray-600">Deadline*</span>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            />
          </label>
        </div>

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={autoMatch}
            onChange={(e) => setAutoMatch(e.target.checked)}
            className="mr-2"
          />
          <span className="text-gray-600">Auto-match (We will choose the best expert for you)</span>
        </label>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <div className="flex justify-between">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            onClick={() => navigate("/StudentBody")}
          >
            Back
          </button>
          <button
            className="px-6 py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 transition"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
