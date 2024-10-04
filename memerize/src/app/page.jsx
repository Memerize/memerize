"use client";

import PostCard from "@/components/post/PostCard";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("fresh");

  const fetchPosts = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const json = await response.json();
      setPosts(json);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Fetch default posts when the component mounts
    fetchPosts("/api/posts");
  }, []);

  // Handlers for each filter
  const handleTrendingClick = () => {
    setCurrentFilter("trending");
    fetchPosts("/api/trending");
  };

  const handleTopClick = () => {
    setCurrentFilter("top");
    fetchPosts("/api/top");
  };

  const handleFreshClick = () => {
    setCurrentFilter("fresh");
    fetchPosts("/api/posts");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Main Content */}
      <div className="flex justify-center">
        {/* Main Section */}
        <main className="w-full max-w-5xl p-6">
          {/* Filter Bar */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              className={`px-6 py-2 rounded-full transition-colors duration-300 ${
                currentFilter === "trending"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black hover:bg-gray-400"
              }`}
              onClick={handleTrendingClick}
            >
              Trending
            </button>
            <button
              className={`px-6 py-2 rounded-full transition-colors duration-300 ${
                currentFilter === "top"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black hover:bg-gray-400"
              }`}
              onClick={handleTopClick}
            >
              Top
            </button>
            <button
              className={`px-6 py-2 rounded-full transition-colors duration-300 ${
                currentFilter === "fresh"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black hover:bg-gray-400"
              }`}
              onClick={handleFreshClick}
            >
              Fresh
            </button>
          </div>

          {/* Meme Post */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white shadow-lg rounded-lg overflow-hidden p-6"
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No posts available</p>
          )}
        </main>
      </div>
    </div>
  );
}
