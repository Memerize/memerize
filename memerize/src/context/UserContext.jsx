// src/context/UserContext.jsx

"use client";

import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Import useSession dari next-auth
import { toast } from "sonner";

// Create the UserContext
export const UserContext = createContext();

// Helper function to get a specific cookie by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Function to fetch user data from API
  const fetchUser = async () => {
    try {
      // Cek apakah user login dengan manual
      const userCookie = getCookie("User");
      
      if (userCookie) {
        // Pengguna login manual
        const userData = JSON.parse(userCookie);
        const response = await fetch(`/api/users/${userData.username}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user profile.");
        }

        const userProfile = await response.json();
        setUser(userProfile);
      } 
      // Jika login dengan Google (via next-auth session)
      else if (session && status === "authenticated") {
        const googleUser = {
          username: session.user.email.split("@")[0],
          email: session.user.email,
          image: session.user.image,
        };

        const response = await fetch(`/api/users/${googleUser.username}`);

        if (!response.ok) {
          throw new Error("Failed to fetch Google user profile.");
        }

        const userProfile = await response.json();
        setUser(userProfile);
      } 
      else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Error loading profile.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUser();
  }, [session, status]); // Tambahkan dependency session dan status

  // Function to update user data (e.g., updating profile image)
  const updateUser = async (updatedFields) => {
    if (!user) {
      toast.error("No user is logged in.");
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        throw new Error("Failed to update user profile.");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating user profile:", err);
      toast.error(err.message || "Error updating profile.");
    }
  };

  // Function to handle logout
  const logout = () => {
    document.cookie = "Authorization=; Max-Age=0; path=/;";
    document.cookie = "User=; Max-Age=0; path=/;";
    setUser(null);
    router.push("/login");
    toast.success("Logged out successfully!");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        updateUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
