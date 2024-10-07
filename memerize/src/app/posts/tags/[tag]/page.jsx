// memerize/src/app/posts/tags/[tag]/page.jsx

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Loading from "@/app/loading";
import PostCard from "@/components/post/PostCard";

export default function TagPage() {
  const params = useParams();
  const { tag } = params;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostsByTag = async () => {
      try {
        const response = await fetch(
          `/api/posts/tags/${decodeURI(tag)}`
        );
        const data = await response.json();

        if (response.ok) {
          setPosts(data);
        } else {
          toast.error(data.error || "Failed to load posts.");
        }
      } catch (error) {
        console.error("Error fetching posts by tag:", error);
        toast.error("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (tag) {
      fetchPostsByTag();
    } else {
      setLoading(false);
      toast.error("Tag is missing.");
    }
  }, [tag]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-center">
        <main className="w-full max-w-5xl p-6">
          {/* Header */}
          <h1 className="text-color1 text-2xl font-bold mb-4">
            Posts tagged with &quot;{decodeURI(tag)}&quot;
          </h1>

          {/* Content */}
          {loading ? (
            <Loading />
          ) : posts.length > 0 ? (
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
