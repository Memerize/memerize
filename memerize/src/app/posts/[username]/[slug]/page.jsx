"use client";

import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation"; // Import to listen to query changes
import Link from "next/link";
import { MentionsInput, Mention } from "react-mentions";
import { FaComment, FaRegBookmark, FaBookmark, FaShare } from "react-icons/fa";
import { BsArrowUpCircle, BsArrowUpCircleFill } from "react-icons/bs";
import Loading from "@/app/loading";
import CommentCard from "@/components/post/CommentCard";
import { mentionStyle } from "@/components/post/MentionStyle";
import { UserContext } from "@/context/UserContext";

export default function PostDetail({ params }) {
  const { username, slug } = params;
  const searchParams = useSearchParams(); // Get query params from URL

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // For comment submission
  const [loadingLike, setLoadingLike] = useState(false); // For like button
  const [loadingSave, setLoadingSave] = useState(false); // For save button
  const [loadingPost, setLoadingPost] = useState(true);
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useContext(UserContext);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${username}/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch post data.");
      }
      const postData = await response.json();
      setPost(postData);
      setComments(postData.comments || []);
      setLikesCount(postData.likes.length);
      setLiked(postData.likes.includes(currentUser?.username));
      checkIfSaved(postData.slug);
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

  // Re-run when query params change (like ?commentId=123)
  useEffect(() => {
    const commentId = searchParams.get("commentId"); // Get commentId from query params
    if (commentId) {
      const element = document.getElementById(commentId); // Find the element by ID
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" }); // Scroll to it
        element.classList.add("highlight"); // Optionally highlight it
        setTimeout(() => element.classList.remove("highlight"), 2000); // Remove highlight after 2 seconds
      }
    }
  }, [searchParams, comments]); // Trigger this effect when searchParams or comments change

  const checkIfSaved = async (slug) => {
    try {
      const response = await fetch(`/api/saves`);
      if (!response.ok) {
        throw new Error("Failed to fetch saved posts");
      }
      const savedPosts = await response.json();
      const isPostSaved = savedPosts.some(
        (savedPost) => savedPost.slug === slug
      );
      setSaved(isPostSaved);
    } catch (error) {
      console.error("Error checking if post is saved:", error);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      alert("You need to log in to like this post.");
      return (window.location.href = "/login"); // Redirect to login
    }

    setLoadingLike(true);

    try {
      const response = await fetch(`/api/likes/${slug}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to like/unlike the post");
      }

      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      alert("You need to log in to save this post.");
      return (window.location.href = "/login"); // Redirect to login
    }

    if (loadingSave) return;

    setLoadingSave(true);

    setSaved(!saved);

    try {
      const response = await fetch(`/api/saves`, {
        method: "POST",
        body: JSON.stringify({ slug }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to save/unsave the post");
      }

      const data = await response.json();
      if (data.message.includes("removed")) {
        setSaved(false);
      } else {
        setSaved(true);
      }
    } catch (error) {
      console.error("Error saving/unsaving post:", error);
      setSaved(!saved);
    } finally {
      setLoadingSave(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mentionedUsers = [
        ...newComment.matchAll(/@\[(.*?)\]\((.*?)\)/g),
      ].map((match) => match[2]);

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
      setNewComment("");

      for (const mentionedUser of mentionedUsers) {
        await fetch(`/api/notifications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "mention",
            message: `${username} mentioned you in a comment.`,
            slug: slug,
            postUsername: post.user?.username,
            mentionedUsername: mentionedUser,
            commentId: addedComment.commentId,
          }),
        });
      }

      fetchPost();
    } catch (error) {
      setError("Error submitting the comment");
      console.error("Error submitting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterUserSuggestions = (search) => {
    if (!search) return [];

    return users
      .filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 5)
      .map((user) => ({
        id: user.username,
        display: `@${user.username}`,
      }));
  };

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

      <div className="bg-gray-200 w-full mb-6">
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
        <button
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          onClick={handleLike}
          disabled={loadingLike}
        >
          {liked ? <BsArrowUpCircleFill /> : <BsArrowUpCircle />}
          <span>{likesCount} Upvotes</span>
        </button>

        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
          <FaComment />
          <span>{comments.length} Comments</span>
        </button>

        <button
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          onClick={handleSave}
          disabled={loadingSave}
        >
          {saved ? <FaBookmark /> : <FaRegBookmark />}
          <span>{saved ? "Saved" : "Save"}</span>
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
              <div key={comment.commentId} id={comment.commentId}>
                {/* Add id to the comment element */}
                <CommentCard
                  comment={comment}
                  slug={slug}
                  postUsername={post.user?.username}
                  onReplyAdded={fetchPost}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 bg-white p-4 border-t">
        <MentionsInput
          value={newComment}
          onFocus={fetchUsers}
          onChange={(e, newValue) => setNewComment(newValue)}
          placeholder="Write a comment..."
          className="w-full p-2 border rounded-md"
          style={mentionStyle}
          allowSuggestionsAboveCursor={true}
        >
          <Mention
            trigger="@"
            data={filterUserSuggestions}
            displayTransform={(id, display) => `${display}`}
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
