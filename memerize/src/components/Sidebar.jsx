// memerize/src/components/Sidebar.jsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaHome, FaTags, FaImage, FaPen } from "react-icons/fa";

export default function Sidebar({ closeSidebar }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTagsOpen, setIsTagsOpen] = useState(false);

  useEffect(() => {
    const fetchTopTags = async () => {
      try {
        const response = await fetch("/api/posts/tags");
        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }
        const data = await response.json();
        setTags(data.slice(0, 5));
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError("Failed to load tags");
      } finally {
        setLoading(false);
      }
    };

    fetchTopTags();
  }, []);

  const toggleTagsDropdown = () => {
    setIsTagsOpen((prev) => !prev);
  };

  const handleTagClick = () => {
    setIsTagsOpen(false);
  };

  return (
    <ul className="menu bg-color3 h-full p-4 md:w-24 lg:w-24 xl:w-64 space-y-2">
      {/* Link Home */}
      <li>
        <Link
          href="/"
          onClick={closeSidebar}
          className="flex items-center space-x-2 text-md text-color2 hover:bg-color5 focus:bg-color5 rounded px-3 py-2"
        >
          <FaHome className="text-xl" />
          <span className="inline xl:inline md:hidden">Home</span>
        </Link>
      </li>

      {/* Dropdown Tags */}
      <li>
        <button
          onClick={toggleTagsDropdown}
          className="flex items-center space-x-2 w-full text-left text-md text-color2 hover:bg-color5 focus:bg-color5 rounded px-3 py-2"
          aria-haspopup="true"
          aria-expanded={isTagsOpen}
        >
          <FaTags className="text-xl" />
          <span className="inline xl:inline md:hidden">Tags</span>
        </button>
        {isTagsOpen && (
          <ul className="mt-2 space-y-1">
            {loading ? (
              <li className="px-3 py-2 text-sm text-gray-500 flex items-center justify-center">
                Loading...
              </li>
            ) : error ? (
              <li className="px-3 py-2 text-sm text-red-500 flex items-center justify-center">
                {error}
              </li>
            ) : tags.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500 flex items-center justify-center">
                No tags available
              </li>
            ) : (
              tags.map((tag) => (
                <li key={tag.tag}>
                  <Link
                    href={`/posts/tags/${encodeURIComponent(tag.tag)}`}
                    onClick={handleTagClick}
                    className="mr-1 px-1 py-1 text-sm text-color2 hover:bg-color5 focus:bg-color5 rounded block"
                  >
                    {tag.tag} ({tag.count})
                  </Link>
                </li>
              ))
            )}
          </ul>
        )}
      </li>

      {/* Link Create Meme */}
      <li>
        <Link
          href="/create-meme"
          onClick={closeSidebar}
          className="flex items-center space-x-2 text-md text-color2 hover:bg-color5 focus:bg-color5 rounded px-3 py-2"
        >
          <FaImage className="text-xl" />
          <span className="inline xl:inline md:hidden">Create Meme</span>
        </Link>
      </li>

      {/* Link Create Post */}
      <li>
        <Link
          href="/create-post"
          onClick={closeSidebar}
          className="flex w-full items-center space-x-2 text-md text-color2 hover:bg-color5 focus:bg-color5 rounded px-3 py-2"
        >
          <FaPen className="text-xl" />
          <span className="inline xl:inline md:hidden w-full">Create Post</span>
        </Link>
      </li>
    </ul>
  );
}
