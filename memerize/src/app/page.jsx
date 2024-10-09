"use client";

import React, { useEffect, useState } from "react";
import InfiniteScrollPosts from "@/components/InfiniteScrollPosts";
import ModalNewPosts from "@/components/ModalNewPosts";
import Loading from "@/app/loading";

export default function Home() {
  const [posts, setPosts] = useState([]); // All fetched posts
  const [visiblePosts, setVisiblePosts] = useState([]); // Posts to display incrementally
  const [savedPosts, setSavedPosts] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("latest");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasMore, setHasMore] = useState(true); // For infinite scrolling
  const postsPerScroll = 2; // Number of posts per scroll

  const fetchPosts = async (url) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const json = await response.json();
      setPosts(json);
      setVisiblePosts(json.slice(0, postsPerScroll)); // Initialize with first 2 posts
      setHasMore(json.length > postsPerScroll);
      setShowModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      const response = await fetch(`/api/saves`);
      if (!response.ok) {
        throw new Error("Failed to fetch saved posts");
      }
      const saved = await response.json();
      setSavedPosts(saved);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
    }
  };

  const listenForNewPosts = () => {
    const eventSource = new EventSource("/api/stream/posts");
    eventSource.onmessage = () => {
      setShowModal(true);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  };

  useEffect(() => {
    fetchPosts("/api/posts");
    fetchSavedPosts();

    const stopListening = listenForNewPosts();

    return () => {
      stopListening();
    };
  }, []);

  const handleTrendingClick = () => {
    setCurrentFilter("trending");
    fetchPosts("/api/trending");
  };

  const handleTopClick = () => {
    setCurrentFilter("top");
    fetchPosts("/api/top");
  };

  const handleLatestClick = () => {
    setCurrentFilter("latest");
    fetchPosts("/api/posts");
  };

  const handleRefetchPosts = () => {
    fetchPosts("/api/posts");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const loadMorePosts = () => {
    const nextPosts = posts.slice(
      visiblePosts.length,
      visiblePosts.length + postsPerScroll
    );

    setVisiblePosts((prevPosts) => [...prevPosts, ...nextPosts]);

    if (visiblePosts.length + nextPosts.length >= posts.length) {
      setHasMore(false); // No more posts to load
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Modal for new posts */}
      <ModalNewPosts
        show={showModal}
        onClose={handleCloseModal}
        onFetchNewPosts={handleRefetchPosts}
      />

      <div className="flex justify-center">
        <main className="w-full max-w-5xl p-6">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              className={`px-6 py-2 rounded-full transition-colors duration-300 ${
                currentFilter === "latest"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black hover:bg-gray-400"
              }`}
              onClick={handleLatestClick}
            >
              Latest
            </button>
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
          </div>

          {loading ? (
            <Loading />
          ) : visiblePosts.length > 0 ? (
            <InfiniteScrollPosts
              posts={visiblePosts}
              loadMorePosts={loadMorePosts}
              hasMore={hasMore}
              savedPosts={savedPosts}
            />
          ) : (
            <p className="text-center text-gray-500">No posts available</p>
          )}
        </main>
      </div>
    </div>
  );
}
