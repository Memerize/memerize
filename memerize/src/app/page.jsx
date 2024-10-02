import React from "react";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Main Content */}
      <div className="flex">
        {/* Main Section */}
        <main className="w-full p-4">
          {/* Filter Bar */}
          <div className="flex justify-center space-x-4 mb-4">
            <button className="bg-gray-300 p-2 rounded text-black">Trending</button>
            <button className="bg-gray-300 p-2 rounded text-black">Top</button>
            <button className="bg-gray-300 p-2 rounded text-black">Fresh</button>
          </div>

          {/* Meme Post */}
          <div className="bg-white shadow p-4 rounded">
            <div className="flex space-x-4">
              <span className="font-bold text-black">User</span> 
              <span className="font-bold text-black">Title</span>
            </div>
            <div className="bg-gray-300 text-center text-4xl py-16 mt-4 text-black">
              MEME
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="space-x-4">
                <button className="text-blue-600">Vote</button>
                <button className="text-blue-600">Comments</button>
              </div>
              <div className="space-x-4">
                <button className="text-blue-600">Save</button>
                <button className="text-blue-600">Share</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};


/*
CATATAN => ini contoh penerapan infinity scroll

"use client";

import React, { useEffect, useState } from "react";
import InfiniteScroll from "@/components/InfiniteScroll";

export default function Home() {
  const [items, setItems] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const newItems = Array.from({ length: 50 }, (_, i) => `Meme ${i + 1}`);
    setItems(newItems);
  }, []);

  const loadMore = async () => {
    const newItems = Array.from({ length: 100 }, (_, i) => `Meme ${items.length + i + 1}`);
    setItems([...items, ...newItems]);
    if (newItems.length < 5) {
      setHasMore(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex">
        <main className="w-full p-4">
          <div className="flex justify-center space-x-4 mb-4">
            <button className="bg-gray-300 p-2 rounded text-black">Trending</button>
            <button className="bg-gray-300 p-2 rounded text-black">Top</button>
            <button className="bg-gray-300 p-2 rounded text-black">Fresh</button>
          </div>

          <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
            {items.map((item, index) => (
              <div key={index} className="bg-white shadow p-4 rounded mb-4">
                <div className="flex space-x-4">
                  <span className="font-bold text-black">User</span>
                  <span className="font-bold text-black">{item}</span>
                </div>
                <div className="bg-gray-300 text-center text-4xl py-16 mt-4 text-black">
                  MEME
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="space-x-4">
                    <button className="text-blue-600">Vote</button>
                    <button className="text-blue-600">Comments</button>
                  </div>
                  <div className="space-x-4">
                    <button className="text-blue-600">Save</button>
                    <button className="text-blue-600">Share</button>
                  </div>
                </div>
              </div>
            ))}
          </InfiniteScroll>
        </main>
      </div>
    </div>
  );
}


 */