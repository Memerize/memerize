import { useState } from "react";
import ReplyCard from "./ReplyCard";

export default function CommentCard({ comment, slug }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleReplyBox = () => {
    setShowReplyBox((prev) => !prev);
  };

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
    } catch (error) {
      console.error("Error submitting reply:", error);
      setError("Error submitting reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md shadow">
      <div className="flex items-center space-x-4 mb-2">
        <img
          src={comment.userImage?.image || "https://via.placeholder.com/50"}
          alt={comment.username}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800">{comment.username}</p>
          <span className="text-sm text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
      <p className="text-gray-700">{comment.content}</p>

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
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Write a reply..."
          ></textarea>
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
