// src/components/Navbar.jsx
"use client"; // Marks this as a Client Component

import React, { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar"; // Import komponen SearchBar
import Sidebar from "@/components/Sidebar"; // Import Sidebar component

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Optional: Close Sidebar when ESC key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isSidebarOpen]);

  return (
    <>
      <div className="navbar bg-color4 sticky top-0 z-10 h-16">
        <div className="flex-1 flex items-center">
          {/* Hamburger Menu - Visible on Mobile */}
          <button
            className="md:hidden mr-4 focus:outline-none"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>

          {/* Brand Link */}
          <a className="btn hover:bg-color6 btn-ghost text-xl text-white">
            Memerize
          </a>
        </div>
        <div className="flex-none gap-2 flex items-center">
          <SearchBar
            onSearch={(query) => console.log("Search query:", query)}
          />{" "}
          {/* Implementasikan SearchBar */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar text-black"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between text-color1">
                  Profile
                  <span className="badge text-color1 bg-white">New</span>
                </a>
              </li>
              <li>
                <a className="text-color1">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sidebar as a drawer for mobile screens */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={toggleSidebar}
          ></div>
          {/* Drawer */}
          <aside className="absolute left-0 top-16 w-64 h-full bg-color3 shadow-lg transform transition-transform duration-300 ease-in-out">
            <Sidebar closeSidebar={toggleSidebar} />{" "}
            {/* Pass closeSidebar to allow closing from Sidebar */}
          </aside>
        </div>
      )}
    </>
  );
}
