"use client";

import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "@/components/post/PostCard";
import Loading from "@/app/loading";

export default function UserPage({ params }) {
  const { username } = params;
  const postsPerScroll = 2;

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getUser = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}`,
          {
            cache: "no-store",
          }
        );
        const userData = await getUser.json();
        setUser(userData);

        const getPosts = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${username}`,
          {
            cache: "no-store",
          }
        );
        const postsData = await getPosts.json();
        setPosts(postsData);
        setVisiblePosts(postsData.slice(0, postsPerScroll));
        setHasMore(postsData.length > postsPerScroll);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const loadMorePosts = () => {
    const nextPosts = posts.slice(
      visiblePosts.length,
      visiblePosts.length + postsPerScroll
    );
    setVisiblePosts((prevPosts) => [...prevPosts, ...nextPosts]);

    if (visiblePosts.length + nextPosts.length >= posts.length) {
      setHasMore(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
      {/* User Details */}
      {user && (
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <img
            src={user.image || "https://via.placeholder.com/50"}
            alt={user.username}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.username}
            </h1>
            <p className="text-lg text-gray-500">
              <span className="font-medium">{user.name}</span>
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-medium">{user.email}</span>
            </p>
            <p className="text-sm text-gray-500">
              Posts: <span className="font-medium">{posts.length}</span>
            </p>
          </div>
        </div>
      )}

      {/* Infinite Scroll for Posts */}
      <InfiniteScroll
        dataLength={visiblePosts.length}
        next={loadMorePosts}
        hasMore={hasMore}
        loader={<Loading />}
      >
        <div className="space-y-8">
          {visiblePosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
