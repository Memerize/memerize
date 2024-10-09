"use client";

import { useState, useEffect } from "react";
import PostCard from "@/components/post/PostCard";

export default function SavePages() {
  const [saves, setSaves] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSaves = async () => {
      try {
        const responseSaves = await fetch("/api/saves", {
          method: "GET",
        });

        if (!responseSaves.ok) {
          throw new Error("Failed to fetch saved posts");
        }

        const savesData = await responseSaves.json();
        setSaves(savesData);
        setSavedPosts(savesData);
      } catch (err) {
        console.error(err);
        setError("Failed to load saved posts");
      } finally {
        setLoading(false);
      }
    };

    fetchSaves();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6 text-black">Saved Posts</h1>
      <div className="space-y-8">
        {saves.length > 0 ? (
          saves.map((save) => (
            <PostCard key={save._id} post={save} savedPosts={savedPosts} /> // Pass savedPosts as prop
          ))
        ) : (
          <p className="text-gray-500">No saved posts</p>
        )}
      </div>
    </div>
  );
}
