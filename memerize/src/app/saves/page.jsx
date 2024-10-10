"use client";

import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "@/components/post/PostCard";
import Loading from "@/app/loading";
import { toast, Toaster } from "sonner";

export const dynamic = "force-dynamic";

export default function SavePages() {
  const [saves, setSaves] = useState([]);
  const [visibleSaves, setVisibleSaves] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const postsPerScroll = 2;
  
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
      setVisibleSaves(savesData.slice(0, postsPerScroll));
      setSavedPosts(savesData);
      setHasMore(savesData.length > postsPerScroll);
      toast.success("Saved posts loaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load saved posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaves();
  }, []);

  const loadMoreSaves = () => {
    const nextSaves = saves.slice(
      visibleSaves.length,
      visibleSaves.length + postsPerScroll
    );
    setVisibleSaves((prevSaves) => [...prevSaves, ...nextSaves]);

    if (visibleSaves.length + nextSaves.length >= saves.length) {
      setHasMore(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6 text-black">Saved Posts</h1>
      <InfiniteScroll
        dataLength={visibleSaves.length}
        next={loadMoreSaves}
        hasMore={hasMore}
        loader={<Loading />}
      >
        <div className="space-y-8">
          {visibleSaves.length > 0 ? (
            visibleSaves.map((save) => (
              <PostCard key={save._id} post={save} savedPosts={savedPosts} />
            ))
          ) : (
            <p className="text-gray-500">No saved posts</p>
          )}
        </div>
      </InfiniteScroll>
      <Toaster position="top-right" richColors style={{ marginTop: "40px" }} />
    </div>
  );
}
