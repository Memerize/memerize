"use client";

/* eslint-disable @next/next/no-img-element */
// src/components/create-meme/MemePostForm.jsx

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { WithContext as ReactTags } from "react-tag-input";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default function MemePostForm() {
  const searchParams = useSearchParams();
  const meme = searchParams.get("meme");
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [memeUrl, setMemeUrl] = useState(meme || "");
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]); // Renamed to allTags
  const [loadingTags, setLoadingTags] = useState(true);
  const [tagError, setTagError] = useState(null);
  const [uploading, setUploading] = useState(false); // Declare uploading state

  // Fetch all tags from the API when the component mounts
  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const response = await fetch("/api/posts/tags");
        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }
        const data = await response.json();
        setAllTags(
          data.map((tag) => ({ id: tag.tag, text: tag.tag })) // Use all tags
        );
        setLoadingTags(false);
      } catch (error) {
        console.error("Error fetching all tags:", error);
        toast.error("Failed to load tag statistics.");
        setTagError("Failed to load tags.");
        setLoadingTags(false);
      }
    };

    fetchAllTags();
  }, []);

  // Handle tag deletion
  const handleDelete = (i) => {
    setSelectedTags(selectedTags.filter((tag, index) => index !== i));
  };

  // Handle tag addition
  const handleAddition = (tag) => {
    // Prevent adding duplicate tags
    if (
      selectedTags.find(
        (existingTag) =>
          existingTag.text.toLowerCase() === tag.text.toLowerCase()
      )
    ) {
      toast.error("Tag already added.");
      return;
    }

    setSelectedTags([...selectedTags, tag]);
  };

  // Function to validate image URL
  const isValidImageUrl = (url) => {
    return /\.(jpeg|jpg|png)$/.test(url);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    if (!memeUrl.trim()) {
      toast.error("Meme URL is required.");
      return;
    }

    if (!isValidImageUrl(memeUrl)) {
      toast.error("Please enter a valid image URL (jpeg, jpg, png).");
      return;
    }

    // Combine selected tags
    const combinedTags = selectedTags.map((tag) => tag.text);

    const postData = {
      title,
      image: memeUrl, // Ensure the API expects 'image' field
      tags: combinedTags,
    };

    setUploading(true); // Start uploading

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers like authentication here
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to home with success message
        router.push(`/?success=${encodeURIComponent("Post berhasil dibuat!")}`);
      } else {
        console.error("Error from API:", data);
        // Display error message
        toast.error(data.error?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Submission error:", error);
      // Display error message
      toast.error("Something went wrong when sending data");
    } finally {
      setUploading(false); // Stop uploading
    }
  };
  const onClearAll = () => {
    setSelectedTags([]);
  };
  const handleDrag = (tag, currPos, newPos) => {
    const newTags = selectedTags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setSelectedTags(newTags);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl text-color1 font-bold mb-6 text-center">
          Create a New Meme Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              name="title"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter post title"
              required
            />
          </div>
          {/* Display Meme Image */}
          {memeUrl ? (
            <div className="mb-4">
              <img
                src={memeUrl}
                alt="Meme Preview"
                className="w-full h-auto rounded-md object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=Invalid+URL";
                }}
              />
            </div>
          ) : (
            <div className="mb-4">
              <img
                src="https://via.placeholder.com/400x300?text=Memes+preview+goes+here"
                alt="Meme Preview"
                className="w-full h-auto rounded-md object-cover"
              />
            </div>
          )}

          {/* Meme URL Input */}
          <div className="mb-4">
            <label
              htmlFor="memeUrl"
              className="block mb-2 text-sm font-medium text-color1"
            >
              Meme URL (Make your memes{" "}
              <a href="/create-meme" className="link text-blue-600">
                here
              </a>
              )
            </label>
            <input
              name="memeUrl"
              type="text"
              id="memeUrl"
              value={memeUrl}
              onChange={(e) => setMemeUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter meme image URL"
            />
          </div>

          {/* Tag Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Tags
            </label>
            <div className="relative">
              {loadingTags ? (
                <div className="text-sm text-gray-500">Loading tags...</div>
              ) : (
                <ReactTags
                  tags={selectedTags}
                  suggestions={allTags}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  handleDrag={handleDrag}
                  delimiters={delimiters}
                  autofocus={false}
                  placeholder="Add or select tags"
                  clearAll
                  maxTags={5}
                  onClearAll={onClearAll}
                  classNames={{
                    tags: "flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md",
                    tagInput: "w-full",
                    tagInputField:
                      "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                    selected: "flex flex-wrap",
                    tag: "flex items-center bg-blue-100 text-blue-800 px-2 py-1 mb-1 mx-1 rounded-full text-sm",
                    remove:
                      "ml-1 cursor-pointer text-blue-600 hover:text-blue-800",
                    suggestions:
                      "absolute bg-white border border-gray-300 rounded-md mt-1 w-full max-h-60 overflow-y-auto z-10 text-color1",
                    activeSuggestion: "bg-blue-500 text-white",
                    suggestion:
                      "p-2 hover:bg-blue-500 hover:text-white cursor-pointer text-color1",
                    clearAll: "btn btn-error mt-1 p-1 h-6 min-h-6",
                  }}
                />
              )}
              {tagError && (
                <p className="text-red-500 text-sm mt-1">{tagError}</p>
              )}
            </div>
          </div>

          {/* Post Button */}
          <div>
            <button
              type="submit"
              className={`w-full flex justify-center items-center px-4 py-2 rounded-md text-white font-semibold ${
                title && memeUrl
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 cursor-not-allowed"
              } transition-colors duration-200`}
              disabled={!title || uploading}
            >
              {uploading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
