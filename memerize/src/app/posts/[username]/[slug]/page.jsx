"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MentionsInput, Mention } from "react-mentions";
import { FaArrowUp, FaComment, FaRegBookmark, FaShare } from "react-icons/fa";
import Loading from "@/app/loading";
import CommentCard from "@/components/post/CommentCard";
import { mentionStyle } from "@/components/post/MentionStyle";

export default function PostDetail({ params }) {
  const { username, slug } = params;

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [users, setUsers] = useState([]); // State to store fetched users

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${username}/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch post data.");
      }
      const postData = await response.json();
      setPost(postData);
      setComments(postData.comments || []);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Error loading post.");
    } finally {
      setLoadingPost(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [username, slug]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const usersData = await response.json();
      setUsers(usersData.slice(0, 5));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Extract mentioned users from the comment content
      const mentionedUsers = [
        ...newComment.matchAll(/@\[(.*?)\]\((.*?)\)/g),
      ].map(
        (match) => match[2] // This gets the usernames from the mentions
      );

      // Post the comment
      const response = await fetch(`/api/comments/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const addedComment = await response.json();
      setComments([...comments, addedComment]);
      setNewComment(""); // Clear the comment input

      // Send a notification for each mentioned user
      for (const mentionedUser of mentionedUsers) {
        await fetch(`/api/notifications/${mentionedUser}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "mention",
            message: `${username} mentioned you in a comment.`,
            slug: slug, // Post slug where the mention happened
            postUsername: post.user?.username, // The owner of the post
          }),
        });
      }

      // Refresh post to reflect the new comment
      fetchPost();
    } catch (error) {
      setError("Error submitting the comment");
      console.error("Error submitting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const userSuggestions = users.map((user) => ({
    id: user.username,
    display: `@${user.username}`,
  }));

  if (loadingPost) {
    return <Loading />;
  }

  if (!post) {
    return <div>Error loading post.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
      <div className="flex items-center space-x-4 mb-6">
        <Link href={`/posts/${post.user.username}`}>
          <img
            src={post.user?.image || "https://via.placeholder.com/50"}
            alt={post.user?.username}
            className="w-12 h-12 rounded-full object-cover"
          />
        </Link>
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {post.user?.username}
          </h2>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-black">{post.title}</h1>

      <div className="bg-gray-200 w-full h-96 mb-6">
        <img
          src={post.image}
          alt={post.title}
          className="object-contain w-full h-full"
        />
      </div>

      <div className="flex flex-wrap mb-4">
        {post.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm mr-2"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
          <FaArrowUp />
          <span>{post.likes.length} Upvotes</span>
        </button>

        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
          <FaComment />
          <span>{comments.length} Comments</span>
        </button>

        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
          <FaRegBookmark />
          <span>Save</span>
        </button>

        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
          <FaShare />
          <span>Share</span>
        </button>
      </div>

      <div className="mt-8 h-96 overflow-y-auto pr-2">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentCard
                key={comment._id}
                comment={comment}
                slug={slug}
                postUsername={post.user?.username}
                onReplyAdded={fetchPost}
              />
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 bg-white p-4 border-t">
        <MentionsInput
          value={newComment}
          onChange={(e, newValue) => setNewComment(newValue)}
          placeholder="Write a comment..."
          className="w-full p-2 border rounded-md"
          style={mentionStyle}
          allowSuggestionsAboveCursor={true}
        >
          <Mention
            trigger="@"
            data={userSuggestions}
            displayTransform={(id, display) => `${display}`} // No extra classes here
          />
        </MentionsInput>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <button
          onClick={handleAddComment}
          className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
          disabled={loading}
        >
          {loading ? "Adding comment..." : "Add Comment"}
        </button>
      </div>
    </div>
  );
}
