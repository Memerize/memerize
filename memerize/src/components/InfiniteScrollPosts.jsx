"use client";

import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "@/app/loading";
import PostCard from "../components/post/PostCard";

export default function InfiniteScrollPosts({
  posts,
  loadMorePosts,
  hasMore,
  savedPosts,
}) {
  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={loadMorePosts}
      hasMore={hasMore}
      loader={<Loading />}
      endMessage={
        <p className="text-center text-gray-500">No more posts available</p>
      }
    >
      <div className="grid grid-cols-1 gap-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} savedPosts={savedPosts} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
