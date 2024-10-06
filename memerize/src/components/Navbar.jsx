"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaBell } from "react-icons/fa";
import memerizeTypeLogo from "../assets/img/memerizeTypeLogo.png";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const router = useRouter();

  const fetchUserProfile = async (username) => {
    try {
      const response = await fetch(`/api/users/${username}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data.");
      }
      const user = await response.json();
      setUserProfile(user);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const fetchNotifications = async (username) => {
    try {
      const response = await fetch(`/api/notifications`, {
        headers: {
          "x-user-username": username,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch notifications.");
      }
      const notificationsData = await response.json();
      setNotifications(notificationsData);
      const unseen = notificationsData.filter((notif) => !notif.isSeen).length;
      setUnseenCount(unseen);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    const authCookie = getCookie("Authorization");
    const userCookie = getCookie("User");

    if (authCookie) {
      setIsLogin(true);
      if (userCookie) {
        try {
          const user = JSON.parse(userCookie);
          fetchUserProfile(user.username);
          fetchNotifications(user.username);
        } catch (error) {
          console.error("Error parsing user cookie", error);
        }
      }
    } else {
      setIsLogin(false);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    document.cookie = "Authorization=; Max-Age=0; path=/;";
    document.cookie = "User=; Max-Age=0; path=/;";

    setIsLogin(false);
    setUserProfile(null);
    router.push("/login");
  };

  const handleSearch = (query) => {
    console.log("Search query:", query);
  };

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
          <button
            className="md:hidden mr-4 focus:outline-none"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <svg
              className="w-6 h-6 text-black"
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

          <Link
            href={"/"}
            className="btn hover:bg-color6 btn-ghost text-xl text-black"
          >
            <Image
              src={memerizeTypeLogo}
              alt="Memerize Logo"
              width={150}
              height={50}
              className="w-[150px] h-[50px] object-cover invert"
              objectFit="contain"
            />
          </Link>
        </div>
        <div className="flex-none gap-2 flex items-center">
          <SearchBar onSearch={handleSearch} />

          {/* Notification Icon */}
          {isLogin && (
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="btn btn-ghost btn-circle text-black"
                aria-label="Notifications"
              >
                <div className="indicator">
                  <FaBell className="w-6 h-6 text-white" />
                  {unseenCount > 0 && (
                    <span className="badge badge-sm indicator-item">
                      {unseenCount}
                    </span>
                  )}
                </div>
              </button>

              {isNotificationsOpen && (
                <ul className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 p-2 text-black">
                  {notifications.length > 0 ? (
                    notifications.map((notif, index) => (
                      <li key={index} className="flex flex-col">
                        <Link href={`/posts/${notif.slug}`}>
                          <p
                            className={`text-sm ${
                              !notif.isSeen ? "font-bold" : ""
                            }`}
                          >
                            {notif.message}
                          </p>
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li>
                      <p className="text-gray-500">No notifications</p>
                    </li>
                  )}
                </ul>
              )}
            </div>
          )}

          {isLogin ? (
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar text-black"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="User Avatar"
                    src={userProfile?.image || "https://via.placeholder.com/50"}
                  />
                </div>
              </button>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link
                    href={`/profile`}
                    className="justify-between text-color1"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <a className="text-color1" onClick={handleLogout}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <Link href="/login" className="text-color2">
              <p className="btn btn-primary">Login</p>
            </Link>
          )}
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={toggleSidebar}
          ></div>
          <aside
            className="absolute left-0 top-16 w-64 h-full bg-color3 shadow-lg transform transition-transform duration-300 ease-in-out"
            role="navigation"
            aria-label="Sidebar Navigation"
          >
            <Sidebar closeSidebar={toggleSidebar} />
          </aside>
        </div>
      )}
    </>
  );
}
