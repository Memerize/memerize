import React from "react";

export default function ProfileUser() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Main Content */}
      <div className="flex">
        {/* Main Section */}
        <main className="w-full p-4">
          {/* Filter Bar */}
          <div className="flex justify-center space-x-4 mb-4">
            <button className="bg-gray-300 p-2 rounded text-black">
              Trending
            </button>
            <button className="bg-gray-300 p-2 rounded text-black">Top</button>
            <button className="bg-gray-300 p-2 rounded text-black">
              Fresh
            </button>
          </div>

          {/* Meme Post */}
          <div className="bg-white shadow p-4 rounded">
            <div className="flex flex-col space-y-4">
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
}
