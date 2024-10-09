"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaBell } from "react-icons/fa";
import memerizeTypeLogo from "../assets/img/memerizeTypeLogo.png";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import { UserContext } from "@/context/UserContext";
import NotificationCard from "./NotificationCard";
import { getCookie } from "cookies-next"; // Untuk cek cookie login manual
import { useSession, signOut } from "next-auth/react"; // Untuk cek sesi Google OAuth

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const router = useRouter(); // Added router for handling navigation
  const { data: session } = useSession();

  const { user } = useContext(UserContext);

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`/api/users/search?query=${query}`);
      if (response.ok) {
        const users = await response.json();
        return users;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      return [];
    }
  };

  const markNotificationAsSeen = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isSeen: true,
        }),
      });

      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === notificationId ? { ...notif, isSeen: true } : notif
        )
      );
      setUnseenCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error marking notification as seen", error);
    }
  };

  useEffect(() => {
    setUserProfile(user);
  }, [user]);

  useEffect(() => {
    const authCookie = getCookie("Authorization");
    const userCookie = getCookie("User");
    if (authCookie && userCookie) {
      setIsLogin(true);
      const ParsedUserCookie = JSON.parse(userCookie);
      // Start SSE connection with username as query parameter
      const eventSource = new EventSource(
        `/api/notifications/stream?username=${ParsedUserCookie?.username}`
      );

      eventSource.onmessage = (event) => {
        const newNotifications = JSON.parse(event.data);
        const unseenNotifications = newNotifications.filter(
          (notif) => !notif.isSeen
        );
        const newUniqueNotifications = unseenNotifications.filter(
          (notif) =>
            !notifications.find(
              (existingNotif) => existingNotif._id === notif._id
            )
        );
        if (newUniqueNotifications.length > 0) {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            ...newUniqueNotifications,
          ]);
          setUnseenCount((prev) => prev + newUniqueNotifications.length);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    } else if (session) {
      // Login via Google OAuth (next-auth)
      setIsLogin(true);
      setUserProfile({
        username: session.user.email.split("@")[0],
        image: session.user.image,
        email: session.user.email,
      });

      // Fetch notifications for Google OAuth users
      const eventSource = new EventSource(
        `/api/notifications/stream?username=${session.user.email.split("@")[0]}`
      );

      eventSource.onmessage = (event) => {
        const newNotifications = JSON.parse(event.data);
        const unseenNotifications = newNotifications.filter(
          (notif) => !notif.isSeen
        );
        const newUniqueNotifications = unseenNotifications.filter(
          (notif) =>
            !notifications.find(
              (existingNotif) => existingNotif._id === notif._id
            )
        );
        if (newUniqueNotifications.length > 0) {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            ...newUniqueNotifications,
          ]);
          setUnseenCount((prev) => prev + newUniqueNotifications.length);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    } else {
      setIsLogin(false);
    }
  }, [notifications, session]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    document.cookie = "Authorization=; Max-Age=0; path=/;";
    document.cookie = "User=; Max-Age=0; path=/;";
    document.cookie = "next-auth.session-token=; Max-Age=0; path=/;";

    try {
      setIsLogin(false);
      setUserProfile(null);
      if (session) {
        await signOut({ redirect: false });
      }
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="navbar bg-[#2E2E2E] sticky top-0 z-10 h-16">
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
            />
          </Link>
        </div>
        <div className="flex-none gap-2 flex items-center">
          <SearchBar onSearch={handleSearch} />

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
                      <NotificationCard
                        key={index}
                        notification={notif}
                        markAsSeen={markNotificationAsSeen}
                      />
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
                    href={`/posts/${userProfile?.username}`}
                    className="justify-between text-color1"
                  >
                    Your Posts
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/profile`}
                    className="justify-between text-color1"
                  >
                    Edit Profile
                  </Link>
                </li>
                <li>
                  <a
                    className="text-white btn btn-error"
                    onClick={handleLogout}
                  >
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
