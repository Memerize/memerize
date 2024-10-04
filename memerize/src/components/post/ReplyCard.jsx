import React from "react";

export default function ReplyCard({ reply }) {
  return (
    <div className="bg-gray-200 p-2 rounded-md shadow-sm text-sm text-black">
      <div className="flex items-center space-x-4 mb-1">
        <img
          src={reply.userImage?.image || "https://via.placeholder.com/50"}
          alt={reply.username}
          className="w-6 h-6 rounded-full object-cover"
        />
        <p className="font-semibold">{reply.username}</p>
      </div>
      <p>{reply.content}</p>
      <span className="text-xs text-gray-500">
        {new Date(reply.createdAt).toLocaleString()}
      </span>
    </div>
  );
}
