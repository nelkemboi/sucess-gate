import React, { useState } from "react";

const StudentDashboard = () => {
  const [isNavOpen, setIsNavOpen] = useState(true); // Sidebar toggle state

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen); // Toggle sidebar
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logged out!");
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex">
      {/* Sidebar Navigation */}
      <StudentNavigation
        isOpen={isNavOpen}
        toggleNav={toggleNav}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-blue-500 text-2xl font-bold">Success Gate</h1>
        </header>

        {/* Content */}
        <main className="flex-1 flex flex-col items-center justify-center">
          <p>Your student dashboard content goes here!</p>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
