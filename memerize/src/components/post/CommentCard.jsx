import { useState, useEffect } from "react";
import ReplyCard from "./ReplyCard";
import { MentionsInput, Mention } from "react-mentions";
import mentionStyle from "@/components/post/MentionStyle";
import Link from "next/link";

export default function CommentCard({ comment, slug, onReplyAdded }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]); // To store users for mentions

  const toggleReplyBox = () => {
    setShowReplyBox((prev) => !prev);
  };

  // Fetch users when reply box is opened
  useEffect(() => {
    if (showReplyBox) {
      const fetchUsers = async () => {
        try {
          const response = await fetch(`/api/users`);
          if (!response.ok) {
            throw new Error("Failed to fetch users");
          }
          const usersData = await response.json();
          setUsers(usersData.slice(0, 5)); // Limit to 5 users for suggestions
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      fetchUsers();
    }
  }, [showReplyBox]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!newReply.trim()) {
      setError("Reply cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/comments/${slug}/${comment.commentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newReply,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add reply");
      }

      const addedReply = await response.json();
      comment.replies.push(addedReply);
      setNewReply("");
      setShowReplyBox(false);

      if (onReplyAdded) {
        onReplyAdded();
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      setError("Error submitting reply");
    } finally {
      setLoading(false);
    }
  };

  const userSuggestions = users.map((user) => ({
    id: user.username,
    display: `@${user.username}`,
  }));

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

  return (
    <div className="bg-gray-100 p-4 rounded-md shadow">
      <div className="flex items-center space-x-4 mb-2">
        <Link href={`/posts/${comment.username}`}>
          <img
            src={comment.userImage?.image || "https://via.placeholder.com/50"}
            alt={comment.username}
            className="w-8 h-8 rounded-full object-cover"
          />
        </Link>
        <div>
          <p className="font-semibold text-gray-800">{comment.username}</p>
          <span className="text-sm text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
      <p className="text-gray-700">{parseMentions(comment.content)}</p>

      <div className="ml-4 mt-4">
        {comment.replies?.length > 0 && (
          <div className="space-y-2">
            {comment.replies.map((reply, index) => (
              <ReplyCard key={index} reply={reply} />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={toggleReplyBox}
        className="text-sm text-blue-600 hover:text-blue-800 mt-2"
      >
        {showReplyBox ? "Cancel" : "Reply"}
      </button>

      {showReplyBox && (
        <form onSubmit={handleReplySubmit} className="mt-2">
          <MentionsInput
            value={newReply}
            onChange={(e, newValue) => setNewReply(newValue)}
            placeholder="Write a reply..."
            className="w-full p-2 border rounded-md"
            style={mentionStyle}
            allowSuggestionsAboveCursor={true}
          >
            <Mention
              trigger="@"
              data={userSuggestions}
              displayTransform={(id, display) => `${display}`}
            />
          </MentionsInput>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
            disabled={loading}
          >
            {loading ? "Adding reply..." : "Submit Reply"}
          </button>
        </form>
      )}
    </div>
  );
}
