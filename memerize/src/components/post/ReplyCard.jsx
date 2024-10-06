import Link from "next/link";
import React from "react";

const parseMentions = (text) => {
  const regex = /@\[(.*?)\]\((.*?)\)/g;
  const parts = [];
  let lastIndex = 0;

  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const display = match[1];
    const username = match[2];

    parts.push(
      <Link key={match.index} href={`/posts/${username}`}>
        <span className="mention">{display}</span>
      </Link>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};

export default function ReplyCard({ reply }) {
  return (
    <div className="bg-gray-200 p-2 rounded-md shadow-sm text-sm text-black">
      <div className="flex items-center space-x-4 mb-1">
        <Link href={`/posts/${reply.username}`}>
          <img
            src={reply.userImage?.image || "https://via.placeholder.com/50"}
            alt={reply.username}
            className="w-6 h-6 rounded-full object-cover"
          />
        </Link>
        <p className="font-semibold">{reply.username}</p>
      </div>
      <p className="text-gray-700">{parseMentions(reply.content)}</p>
      <span className="text-xs text-gray-500">
        {new Date(reply.createdAt).toLocaleString()}
      </span>
    </div>
  );
}
