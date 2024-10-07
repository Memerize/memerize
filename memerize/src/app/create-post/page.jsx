// memerize/src/app/create-post/page.jsx

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MemePostForm() {
  const searchParams = useSearchParams();
  const meme = searchParams.get("meme");
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [memeUrl, setMemeUrl] = useState(meme || "");
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTags, setCustomTags] = useState("");
  const [topTags, setTopTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);

  // Fetch top 10 tags from the API when the component mounts
  useEffect(() => {
    const fetchTopTags = async () => {
      try {
        const response = await fetch("/api/posts/tags");
        const data = await response.json();
        setTopTags(data?.slice(0, 10));
        setLoadingTags(false);
      } catch (error) {
        console.error("Error fetching top tags:", error);
        toast.error("Failed to load tag statistics.");
        setLoadingTags(false);
      }
    };

    fetchTopTags();
  }, []);

  // Handle checkbox toggle for tags
  const handleTagChange = (e) => {
    const tag = e.target.value;
    if (e.target.checked) {
      setSelectedTags((prevTags) => [...prevTags, tag]);
    } else {
      setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Process custom tags: split by comma, trim whitespace, filter out empty strings
    const processedCustomTags = customTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    // Combine selected tags and custom tags, and remove duplicates
    const combinedTags = Array.from(
      new Set([...selectedTags, ...processedCustomTags])
    );

    const postData = {
      title,
      image: memeUrl, // Ensure the API expects 'image' field
      tags: combinedTags,
    };

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Tambahkan header lainnya jika diperlukan, seperti autentikasi
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to home with success message
        router.push(`/?success=${encodeURIComponent("Post berhasil dibuat!")}`);
      } else {
        console.error("Error from API:", data);
        // Redirect back to form with error message
        router.push(
          `/create-post?error=${encodeURIComponent(
            data.error?.message || "Something went wrong"
          )}`
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      // Redirect back to form with error message
      router.push(
        `/create-post?error=${encodeURIComponent(
          "Something went wrong when sending data"
        )}`
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200 p-4">
      <div className="bg-gray-400 p-6 rounded-md w-full max-w-md">
        <form onSubmit={handleSubmit}>
          {/* Display Meme Image */}
          {memeUrl && (
            <div className="mb-4">
              <img
                src={memeUrl}
                alt="if you see this probably your url is invalid"
                className="w-full h-auto rounded"
              />
            </div>
          )}

          {/* Title Input */}
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-sm font-medium">
              Title
            </label>
            <input
              name="title"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Title"
              required
            />
          </div>

          {/* Meme URL Input */}
          <div className="mb-4">
            <label htmlFor="memeUrl" className="block mb-2 text-sm font-medium">
              Meme URL (Make your memes{" "}
              <a href="/create-meme" className="link">
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
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter meme URL"
              required
            />
          </div>

          {/* Tag Selection */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Select Tags
            </label>
            {loadingTags ? (
              <div>Loading tags...</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {topTags?.map((tag) => (
                  <label key={tag.tag} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={tag.tag}
                      onChange={handleTagChange}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-sm">{tag.tag}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Custom Tags Input */}
          <div className="mb-4">
            <label
              htmlFor="customTags"
              className="block mb-2 text-sm font-medium"
            >
              Add Custom Tags
            </label>
            <input
              name="customTags"
              type="text"
              id="customTags"
              value={customTags}
              onChange={(e) => setCustomTags(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Add tags separated by commas"
            />
          </div>

          {/* Post Button */}
          <button
            type="submit"
            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
