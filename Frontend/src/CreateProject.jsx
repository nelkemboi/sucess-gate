import React, { useState } from "react";
import WriterSearch from "./WriterSearch";

const CreateProject = ({ onBack }) => {
  const [projectTitle, setProjectTitle] = useState("");
  const [briefDescription, setBriefDescription] = useState("");
  const [projectType, setProjectType] = useState("");
  const [subjectArea, setSubjectArea] = useState("");
  const [attachments, setAttachments] = useState(null);
  const [deadline, setDeadline] = useState("");
  const [autoMatch, setAutoMatch] = useState(false);
  const [isWriterSearch, setIsWriterSearch] = useState(false); // State to show WriterSearch

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

  const handleCreate = () => {
    // Simulate project submission
    alert("Project Created Successfully!");
    setIsWriterSearch(true); // Switch to WriterSearch after project creation
  };

  const handleWriterSearchBack = () => {
    setIsWriterSearch(false); // Go back to CreateProject
  };

  const handleAcceptBid = () => {
    alert("Bid Accepted! Redirecting to Active Projects...");
    // Logic to navigate to the "Student Body" page
  };

  // If WriterSearch should be displayed
  if (isWriterSearch) {
    return <WriterSearch onBack={handleWriterSearchBack} onAcceptBid={handleAcceptBid} />;
  }

  // Default CreateProject form
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

        <label className="block text-gray-600 font-medium mb-2">Brief Description</label>
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

        <div className="flex items-center space-x-4 mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <span className="text-gray-600">Attach</span>
            <input
              type="file"
              onChange={(e) => setAttachments(e.target.files[0])}
              className="hidden"
            />
          </label>

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

        <div className="flex justify-between">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            onClick={onBack}
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
