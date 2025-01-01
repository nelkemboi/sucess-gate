import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAuthToken");
    navigate("/");
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 bg-gray-900">
          <h2 className="text-2xl font-bold">Success Gate</h2>
        </div>
        <nav className="flex-grow space-y-4 mt-4 px-4">
          <NavLink
            to="writer-applications"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Writer Applications
          </NavLink>
          <NavLink
            to="writer-issues"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Writer Issues
          </NavLink>
          <NavLink
            to="student-issues"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Student Issues
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow-md py-3 px-6 border-b flex justify-between items-center relative">
          <h2 className="text-2xl font-bold text-orange-500">Success Gate</h2>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <FaUserCircle size={24} />
              <span>Admin</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <NavLink to="/admin/profile" className="text-gray-700">
                      My Profile
                    </NavLink>
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="p-6 flex-grow bg-gray-100">
          <Outlet /> {/* Renders the child route components */}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
